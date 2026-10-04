import tempfile
import unittest
from pathlib import Path
import sys

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
from build import build, validate, read_jsonl  # noqa: E402
from library import ResourceLibrary  # noqa: E402


class ResourceRegistryR0Tests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.out = Path(self.tmp.name) / "resources"
        self.manifest = build(self.out)
        validate(self.out)
        self.lib = ResourceLibrary(self.out)

    def tearDown(self):
        self.tmp.cleanup()

    def test_toolbox_config_coverage_and_contracts(self):
        configs = read_jsonl(self.out / "configs.jsonl")
        self.assertEqual(self.manifest["counts"]["configs"], 6)
        self.assertEqual(len(configs), 6)
        carl = next(r for r in configs if r.get("schema") == "kfb.carl.rig/6")
        self.assertEqual(carl["kind"], "rig-config")
        self.assertIn("capsule-carl", carl["actorRefs"])
        self.assertTrue(any(r["kind"] == "vehicle-rig" for r in configs))
        self.assertTrue(any(r.get("schema") == "kfb.pets/1" for r in configs))

    def test_actor_and_composition_links_are_explicit(self):
        carl = self.lib.get_actor("capsule-carl")
        self.assertEqual(carl["assets"][0]["assetId"], "media/3D_Assets/KayKit_Mystery_Series6/CapsuleCarl/gltf/player.gltf")
        self.assertTrue(carl["assets"][0]["exists"])
        graft = self.lib.get_actor("frizzlebob-driver-graft")
        self.assertEqual(graft["actorKind"], "composition")
        comp = self.lib.get_composition("frizzlebob-driver-graft")
        self.assertEqual(comp["hostAssetId"], "media/3D_Assets/KayKit_Mystery_Series6/2 - August 2023 - Driver/character/gltf/Driver.glb")
        self.assertEqual(comp["selectionStatus"], "candidate-only")
        self.assertIn("module:frizzlegraft-v1/graft-biped.v1.js", comp["moduleResourceIds"])

    def test_rig_medium_motion_inventory_is_joined_from_rigfacts(self):
        motions = self.lib.get_motions("frizzlebob-driver-graft")
        self.assertGreater(len(motions), 100)
        self.assertTrue(all(m["motionType"] == "embedded-clip" for m in motions))
        self.assertTrue(all("/Rig_Medium/" in m["sourceAssetId"] for m in motions))
        self.assertTrue(any("Walk" in m["clipName"] or "Walking" in m["clipName"] for m in motions))

    def test_custom_fx_remain_documented_references(self):
        fx = self.lib.get_fx("frizzlebob-driver-graft")
        wobble = next(r for r in fx if "actor-wobble.v1.js" in r["resourceId"])
        self.assertEqual(wobble["status"], "DOCUMENTED_REFERENCE")
        self.assertFalse(wobble["deliveredAsLooseSource"])
        self.assertEqual(wobble["provenance"], "source-document-reference")

    def test_composition_plan_is_read_only_candidate(self):
        plan = self.lib.export_composition_plan("frizzlebob-driver-graft")
        self.assertEqual(plan["selectionStatus"], "candidate-only")
        self.assertEqual(plan["suitabilityDecision"], "owned-by-receiving-consumer")
        self.assertGreater(len(plan["motions"]), 100)
        self.assertGreaterEqual(len(plan["fx"]), 2)

    def test_build_is_deterministic(self):
        other = Path(self.tmp.name) / "resources2"
        build(other)
        self.assertEqual((self.out / "resources.jsonl").read_bytes(), (other / "resources.jsonl").read_bytes())


if __name__ == "__main__":
    unittest.main()
