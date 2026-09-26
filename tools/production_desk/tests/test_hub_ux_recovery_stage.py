from pathlib import Path
import hashlib
import unittest

ROOT = Path(__file__).resolve().parents[3]
SOURCE = ROOT / "tools" / "KFB-ToolBox" / "_inbox" / "KFB HUB Design v2" / "KFB_HUB_UX_RECOVERY_CLAUDE_DESIGN_SESSION_CUT_2026-09-25_r1" / "code"
STAGE = ROOT / "kfb-hub" / "stage" / "hub-ux-recovery"


def git_blob_sha1(path: Path) -> str:
    data = path.read_bytes()
    header = f"blob {len(data)}\0".encode("utf-8")
    return hashlib.sha1(header + data).hexdigest()


class HubUxRecoveryStageTest(unittest.TestCase):
    def test_candidate_is_exact_session_cut_source(self):
        self.assertEqual(
            (STAGE / "index.html").read_bytes(),
            (SOURCE / "KFB Hub UX Recovery v2.dc.html").read_bytes(),
        )

    def test_donor_proof_is_exact_session_cut_source(self):
        self.assertEqual(
            (STAGE / "donor.html").read_bytes(),
            (SOURCE / "Hub Donor Proof v2.dc.html").read_bytes(),
        )

    def test_support_runtime_is_exact_session_cut_source(self):
        self.assertEqual(
            (STAGE / "support.js").read_bytes(),
            (SOURCE / "support.js").read_bytes(),
        )

    def test_embedded_registry_is_exact_session_cut_source(self):
        self.assertEqual(
            (STAGE / "hub-recovery" / "embedded-registry-2026-09-25.js").read_bytes(),
            (SOURCE / "hub-recovery" / "embedded-registry-2026-09-25.js").read_bytes(),
        )

    def test_resident_overlay_is_exact_session_cut_source(self):
        self.assertEqual(
            (STAGE / "hub-recovery" / "resident-overlay.v1.js").read_bytes(),
            (SOURCE / "hub-recovery" / "resident-overlay.v1.js").read_bytes(),
        )

    def test_exact_accepted_donor_blob_is_mounted(self):
        donor = STAGE / "hub-recovery" / "donor" / "kfb-hub-v2-dfaafac.html"
        self.assertEqual(donor.read_bytes(), (SOURCE / "hub-recovery" / "donor" / "kfb-hub-v2-dfaafac.html").read_bytes())
        self.assertEqual(git_blob_sha1(donor), "0de46343ddeb70a5f423876e75dc916ae7200c5b")

    def test_donor_proof_names_all_required_viewports(self):
        text = (STAGE / "donor.html").read_text(encoding="utf-8")
        for marker in (
            "DESKTOP · 1440 × 900 · Paper",
            "SPLIT · 880 × 900 · Paper",
            "MOBILE · 390 × 844 · Paper",
            "Pocket Inbox / Dropzone",
            "ToolBox-Prominenz",
        ):
            self.assertIn(marker, text)

    def test_candidate_keeps_local_decision_and_pocket_contracts(self):
        text = (STAGE / "index.html").read_text(encoding="utf-8")
        self.assertIn("kfb.hub-decision/1", text)
        self.assertIn("kfb.hub.decisions.v1", text)
        self.assertIn("kfb-hub-pocket-inbox-v1", text)
        self.assertIn("Lokal", text)

    def test_candidate_keeps_current_registry_reload_contract(self):
        text = (STAGE / "index.html").read_text(encoding="utf-8")
        self.assertIn("bot/production-desk-update", text)
        self.assertIn("registry/production/v1", text)
        self.assertIn("POLL_MS=75000", text)
        self.assertIn("Live-Registry", text)


if __name__ == "__main__":
    unittest.main()
