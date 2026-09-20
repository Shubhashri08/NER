import unittest
from app.modules.decision.decision_service import decision_engine
from app.modules.gis.spatial_service import spatial_service
from app.modules.audit.audit_service import audit_ledger

class TestDecisionGIS(unittest.TestCase):
    def test_urgency_score_critical(self):
        # Extreme emergency: total water and medical exhaustion, prolonged isolation
        res = decision_engine.calculate_urgency_score(
            water_deficit=1.0,
            med_deficit=0.95,
            food_deficit=0.8,
            days_cut_off=7.0,
            vulnerability_pop_fraction=0.6
        )
        self.assertEqual(res["priority_tier"], "CRITICAL")
        self.assertGreaterEqual(res["urgency_score"], 80.0)

    def test_spatial_route_calculation(self):
        # Route from Haflong to Harangajao bypassing blocked NH-27 segment
        route = spatial_service.calculate_route("NODE-HAFLONG", "NODE-HARANGAJAO", require_4x4=True)
        self.assertIsNotNone(route)
        self.assertIn("NODE-BRO-BYPASS-JATINGA", route["path_nodes"])
        self.assertGreater(route["total_distance_km"], 0)

    def test_cryptographic_audit_ledger(self):
        rec1 = audit_ledger.record_decision(
            user_id="USR-DIST-001",
            user_role="ROLE_DISTRICT_AUTH",
            action_type="TEST_APPROVE",
            target_resource_id="MSN-TEST-1",
            decision_reasoning="Validating signature chain"
        )
        self.assertEqual(len(rec1.record_hash), 64)
        self.assertIsNotNone(rec1.previous_state_hash)
