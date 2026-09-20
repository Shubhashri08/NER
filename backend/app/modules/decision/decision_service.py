import math
from typing import Optional
from app.modules.gis.spatial_service import spatial_service

class DecisionEngineService:
    @staticmethod
    def calculate_urgency_score(
        water_deficit: float,
        med_deficit: float,
        food_deficit: float,
        days_cut_off: float,
        vulnerability_pop_fraction: float
    ) -> dict:
        """
        Calculates urgency score U in [0, 100] strictly per docs/08-DECISION-ENGINE.md Section 2:
        U = w1*D_water + w2*D_med + w3*D_food + w4*I_iso + w5*V_pop
        w1=0.35, w2=0.30, w3=0.15, w4=0.10, w5=0.10
        I_iso = 1.0 - exp(-0.1 * days_cut_off)
        """
        # Clamp inputs to [0, 1]
        d_water = min(max(water_deficit, 0.0), 1.0)
        d_med = min(max(med_deficit, 0.0), 1.0)
        d_food = min(max(food_deficit, 0.0), 1.0)
        v_pop = min(max(vulnerability_pop_fraction, 0.0), 1.0)
        
        i_iso = 1.0 - math.exp(-0.1 * max(days_cut_off, 0.0))

        u_raw = (0.35 * d_water) + (0.30 * d_med) + (0.15 * d_food) + (0.10 * i_iso) + (0.10 * v_pop)
        urgency_score = round(u_raw * 100.0, 1)

        if urgency_score >= 80.0:
            tier = "CRITICAL"
            action_window = "Dispatch required within 4 hours (Immediate threat to life)"
        elif urgency_score >= 50.0:
            tier = "HIGH"
            action_window = "Severe depletion imminent within 24 hours"
        elif urgency_score >= 25.0:
            tier = "MODERATE"
            action_window = "Sustained relief required within 48-72 hours"
        else:
            tier = "MONITORED"
            action_window = "Stable in-situ stockpiles; periodic surveillance"

        return {
            "urgency_score": urgency_score,
            "priority_tier": tier,
            "action_window": action_window,
            "components": {
                "water_deficit_weighted": round(0.35 * d_water * 100, 1),
                "med_deficit_weighted": round(0.30 * d_med * 100, 1),
                "food_deficit_weighted": round(0.15 * d_food * 100, 1),
                "isolation_penalty_weighted": round(0.10 * i_iso * 100, 1),
                "vulnerability_pop_weighted": round(0.10 * v_pop * 100, 1)
            }
        }

    @staticmethod
    def evaluate_relocation_feasibility(
        habitation_id: str,
        road_cut_hours: float,
        geological_displacement_confirmed: bool,
        water_depletion_hours: float,
        earliest_delivery_hours: float,
        candidate_shelters: list[dict]
    ) -> dict:
        """
        Evaluates relocation need per docs/08-DECISION-ENGINE.md Section 5:
        Triggers if:
        1. Road cut > 72 hours OR
        2. Geological displacement confirmed OR
        3. Depletion hours < earliest delivery hours
        """
        needs_relocation = (
            road_cut_hours > 72.0 or
            geological_displacement_confirmed or
            water_depletion_hours < earliest_delivery_hours
        )

        reasons = []
        if road_cut_hours > 72.0:
            reasons.append(f"Inaccessible by road for {road_cut_hours}h (exceeds 72h safety threshold)")
        if geological_displacement_confirmed:
            reasons.append("Active geological displacement confirms imminent slope failure")
        if water_depletion_hours < earliest_delivery_hours:
            reasons.append(f"Water reserves deplete in {water_depletion_hours}h before earliest supply transit ({earliest_delivery_hours}h)")

        scored_shelters = []
        if needs_relocation:
            for s in candidate_shelters:
                total_cap = s.get("certified_capacity", 1)
                headroom = s.get("available_headroom", 0)
                if headroom <= 0:
                    continue
                headroom_ratio = headroom / total_cap
                transit_time = max(s.get("transit_time_min", 30.0), 1.0)
                readiness = 1.0 if (s.get("potable_water") and s.get("generator_backup")) else 0.5

                # S = (headroom/total)*0.35 + (1/transit)*0.35 + readiness*0.30
                score = (headroom_ratio * 0.35) + ((1.0 / (transit_time / 10.0)) * 0.35) + (readiness * 0.30)
                scored_shelters.append({
                    "shelter_id": s.get("shelter_id"),
                    "name": s.get("name"),
                    "score": round(score, 3),
                    "available_headroom": headroom,
                    "transit_time_min": transit_time,
                    "readiness": readiness
                })

            scored_shelters.sort(key=lambda x: x["score"], reverse=True)

        return {
            "habitation_id": habitation_id,
            "relocation_recommended": needs_relocation,
            "trigger_reasons": reasons,
            "recommended_destination_shelters": scored_shelters
        }

    @staticmethod
    def evaluate_replan_impact(incident_location: str, active_missions: list[dict]) -> dict:
        """
        Dynamic replan routine triggered by road blockages / severe rainfall per docs/08-DECISION-ENGINE.md Section 6.
        """
        compromised = []
        for m in active_missions:
            # Check if mission intersects
            route_nodes = m.get("path_nodes", [])
            if incident_location in route_nodes:
                # Compute alternate bypass
                origin = m.get("current_node", route_nodes[0])
                dest = route_nodes[-1]
                bypass = spatial_service.calculate_route(origin, dest, require_4x4=True)

                replan_option = {
                    "mission_id": m.get("mission_id"),
                    "vehicle_id": m.get("vehicle_id"),
                    "compromised_node": incident_location,
                    "alternate_route": bypass,
                    "delay_minutes": (bypass.get("estimated_time_minutes", 0) - m.get("original_time_min", 0)) if bypass else None,
                    "recommendation": "EXECUTE_BYPASS_VIA_BRO_MILITARY_CORRIDOR" if bypass else "DIVERT_TO_SECONDARY_STAGING_CAMP",
                    "justification": "Primary arterial NH-58 blocked; bypass verified passable for 4x4 light tactical vehicle." if bypass else "No safe corridor available; convoy must hold and divert."
                }
                compromised.append(replan_option)

        return {
            "incident_node": incident_location,
            "total_compromised_missions": len(compromised),
            "proposals": compromised
        }

decision_engine = DecisionEngineService()
