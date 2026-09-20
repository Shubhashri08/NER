import json
from typing import Optional
import networkx as nx
from app.core.config import settings

class SpatialRoutingService:
    def __init__(self):
        self.graph = nx.Graph()
        self.nodes_meta: dict[str, dict] = {}
        self.edges_meta: dict[str, dict] = {}
        self.load_graph()

    def load_graph(self):
        if not settings.ROADS_GRAPH_PATH.exists():
            return
        with open(settings.ROADS_GRAPH_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)

        for n in data.get("nodes", []):
            node_id = n["id"]
            self.nodes_meta[node_id] = n
            self.graph.add_node(node_id, **n)

        for e in data.get("edges", []):
            s = e["source"]
            t = e["target"]
            edge_id = e["edge_id"]
            self.edges_meta[edge_id] = e

            # Compute effective cost C_R per docs/08-DECISION-ENGINE.md Section 3:
            # C_R(e) = Time(e) * [1 + alpha * H_landslide + beta * H_flood + gamma * R_surface]
            # alpha = 1.5, beta = 1.2, gamma = 0.8
            base_time = e.get("base_time_min", 10.0)
            h_landslide = e.get("landslide_factor", 0.0)
            h_flood = e.get("flood_factor", 0.0)
            r_surface = e.get("surface_factor", 0.0)
            status = e.get("status", "CLEAR")

            if status in ["BLOCKED", "COLLAPSED", "IMPASSABLE_HIGH_HAZARD"]:
                weight = float("inf")
            else:
                multiplier = 1.0 + (1.5 * h_landslide) + (1.2 * h_flood) + (0.8 * r_surface)
                weight = base_time * multiplier

            self.graph.add_edge(s, t, edge_id=edge_id, weight=weight, base_time=base_time, meta=e)

    def calculate_route(self, origin_node: str, destination_node: str, require_4x4: bool = False) -> Optional[dict]:
        if origin_node not in self.graph or destination_node not in self.graph:
            return None

        # Build subview filtering out impassable edges or incompatible terrain
        def edge_filter(u, v):
            data = self.graph.get_edge_data(u, v)
            if data["weight"] == float("inf"):
                return False
            status = data["meta"].get("status", "")
            if status == "RESTRICTED_4X4_ONLY" and not require_4x4:
                return False
            return True

        subgraph = nx.subgraph_view(self.graph, filter_edge=edge_filter)

        try:
            path = nx.shortest_path(subgraph, source=origin_node, target=destination_node, weight="weight")
            total_time_min = 0.0
            total_distance_km = 0.0
            path_edges = []
            hazard_warnings = []

            for i in range(len(path) - 1):
                u, v = path[i], path[i + 1]
                edge_data = self.graph.get_edge_data(u, v)
                meta = edge_data["meta"]
                path_edges.append(meta["edge_id"])
                total_distance_km += meta.get("distance_km", 0.0)
                total_time_min += edge_data["weight"]

                if meta.get("landslide_factor", 0) > 1.5:
                    hazard_warnings.append(f"Elevated landslide risk on {meta.get('ref', 'segment')} ({u} -> {v})")

            coordinates = [[self.nodes_meta[nid]["lng"], self.nodes_meta[nid]["lat"]] for nid in path]

            return {
                "route_id": f"RT-{origin_node[-4:]}-{destination_node[-4:]}",
                "origin_node": origin_node,
                "destination_node": destination_node,
                "path_nodes": path,
                "path_edges": path_edges,
                "coordinates": coordinates,
                "total_distance_km": round(total_distance_km, 2),
                "estimated_time_minutes": round(total_time_min, 1),
                "hazard_warnings": hazard_warnings,
                "data_tier": "REAL_DATA"
            }
        except (nx.NetworkXNoPath, nx.NodeNotFound):
            return None

    def update_edge_status(self, edge_id: str, new_status: str, blockage_reason: Optional[str] = None) -> bool:
        if edge_id not in self.edges_meta:
            return False
        e = self.edges_meta[edge_id]
        e["status"] = new_status
        if blockage_reason:
            e["blockage_reason"] = blockage_reason
        # Re-sync weight
        s, t = e["source"], e["target"]
        if new_status in ["BLOCKED", "COLLAPSED", "IMPASSABLE_HIGH_HAZARD"]:
            self.graph[s][t]["weight"] = float("inf")
        else:
            base_time = e.get("base_time_min", 10.0)
            mult = 1.0 + (1.5 * e.get("landslide_factor", 0.0)) + (1.2 * e.get("flood_factor", 0.0)) + (0.8 * e.get("surface_factor", 0.0))
            self.graph[s][t]["weight"] = base_time * mult
        return True

spatial_service = SpatialRoutingService()
