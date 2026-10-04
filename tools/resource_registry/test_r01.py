import tempfile
import unittest
from pathlib import Path
import sys

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

from build import read_json, read_jsonl  # noqa: E402
from r01 import augment, validate  # noqa: E402


class ResourceRegistryR01Tests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.out = Path(self.tmp.name) / "resources"
        self.manifest = augment(self.out)
        validate(self.out)
        self.motions = read_jsonl(self.out / "motions.jsonl")
        self.fx = read_jsonl(self.out / "fx.jsonl")

    def tearDown(self):
        self.tmp.cleanup()

    def test_preserves_three_motion_vocabularies(self):
        procedural = next(row for row in self.motions if row["resourceId"] == "motion:kfb-pets/procedural/hop")
        semantic = next(row for row in self.motions if row["resourceId"] == "motion:kfb-pets/semantic/kayfabulate")
        self.assertEqual(procedural["motionType"], "authored-procedural")
        self.assertEqual(semantic["motionType"], "semantic-animation")
        self.assertEqual(semantic["trigger"], "narration")
        self.assertTrue(any(row["motionType"] == "embedded-clip" for row in self.motions))

    def test_custom_motions_do_not_claim_playback_runtime(self):
        rows = [row for row in self.motions if row.get("scopeRef") == "kfb-pets"]
        self.assertGreaterEqual(len(rows), 10)
        self.assertTrue(all(row["status"] == "CONFIGURED" for row in rows))
        self.assertTrue(all(row["executionStatus"] == "OWNER_RUNTIME_REQUIRED" for row in rows))
        self.assertTrue(all(row["actorRefs"] == [] for row in rows))

    def test_configured_eye_and_trigger_fx_are_indexed(self):
        ids = {row["resourceId"] for row in self.fx}
        for resource_id in (
            "fx:kfb-pets/eye/spiral",
            "fx:kfb-pets/eye/heart",
            "fx:kfb-pets/trigger/star",
            "fx:kfb-pets/trigger/dust",
        ):
            self.assertIn(resource_id, ids)
        dust = next(row for row in self.fx if row["resourceId"] == "fx:kfb-pets/trigger/dust")
        self.assertIn("drop", dust["triggerRefs"])
        self.assertIn("brake", dust["triggerRefs"])

    def test_manifest_records_explicit_custom_source(self):
        self.assertEqual(self.manifest["resourceRegistryRevision"], "R0.1")
        self.assertEqual(self.manifest["customMotionSource"], "media/3D_Assets/kfb-pets.json")
        source_doc = read_json(HERE.parent.parent / "media/3D_Assets/kfb-pets.json")
        expected_semantic = len(source_doc["motion"]["anims"])
        actual_semantic = sum(1 for row in self.motions if row.get("motionType") == "semantic-animation")
        self.assertEqual(actual_semantic, expected_semantic)

    def test_r01_is_deterministic(self):
        other = Path(self.tmp.name) / "resources2"
        augment(other)
        self.assertEqual((self.out / "resources.jsonl").read_bytes(), (other / "resources.jsonl").read_bytes())


if __name__ == "__main__":
    unittest.main()
