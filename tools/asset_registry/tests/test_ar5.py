import argparse
import json
import sys
import tempfile
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parents[1]
if str(HERE) not in sys.path:
    sys.path.insert(0, str(HERE))

from query import filter_records, handoff
from rigfacts import build_sidecar, extract_rig_facts, validate_sidecar


class RigFactsTests(unittest.TestCase):
    def _doc(self, shift=0):
        prefix = [{"name": "Unrelated"}] * shift
        root = shift
        hip = shift + 1
        hand = shift + 2
        nodes = prefix + [
            {"name": "Root", "children": [hip]},
            {"name": "Hip", "children": [hand]},
            {"name": "Hand", "mesh": 0, "skin": 0},
        ]
        return {
            "nodes": nodes,
            "skins": [{"name": "Body", "joints": [root, hip, hand], "skeleton": root}],
            "animations": [{
                "name": "Walk",
                "channels": [
                    {"target": {"node": hip, "path": "translation"}},
                    {"target": {"node": hand, "path": "rotation"}},
                ],
            }],
        }

    def test_rig_facts_are_file_explicit(self):
        facts = extract_rig_facts(self._doc())
        self.assertEqual(facts["provenance"], "file-explicit")
        self.assertTrue(facts["hasSkin"])
        self.assertEqual(facts["skinCount"], 1)
        self.assertEqual(facts["jointCount"], 3)
        self.assertEqual(facts["jointNames"], ["Hand", "Hip", "Root"])
        self.assertEqual(facts["animationCount"], 1)
        self.assertEqual(facts["animationClips"][0]["name"], "Walk")
        self.assertEqual(facts["animationClips"][0]["targetPaths"], ["rotation", "translation"])

    def test_signature_ignores_absolute_node_index_shift(self):
        a = extract_rig_facts(self._doc(shift=0))["skeletonSignatures"]
        b = extract_rig_facts(self._doc(shift=3))["skeletonSignatures"]
        self.assertEqual(a, b)

    def test_sidecar_exactly_covers_models_and_validates(self):
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            registry = root / "registry/assets/v1"
            registry.mkdir(parents=True)
            model = root / "media/3D_Assets/Test/hero.gltf"
            model.parent.mkdir(parents=True)
            model.write_text(json.dumps(self._doc()), encoding="utf-8")
            (registry / "manifest.json").write_text(json.dumps({"sourceCommit": "abc"}), encoding="utf-8")
            catalog = [
                {
                    "assetId": "media/3D_Assets/Test/hero.gltf",
                    "path": "media/3D_Assets/Test/hero.gltf",
                    "kind": "model-3d",
                    "format": "gltf",
                    "source": {"blobSha": "blob-a"},
                },
                {
                    "assetId": "media/2D_Assets/Test/icon.png",
                    "path": "media/2D_Assets/Test/icon.png",
                    "kind": "image-2d",
                    "format": "png",
                    "source": {"blobSha": "blob-b"},
                },
            ]
            with (registry / "catalog.jsonl").open("w", encoding="utf-8") as fh:
                for row in catalog:
                    fh.write(json.dumps(row) + "\n")
            summary = build_sidecar(root, registry)
            self.assertEqual(summary["modelCount"], 1)
            self.assertEqual(summary["riggedModelCount"], 1)
            self.assertEqual(summary["animatedModelCount"], 1)
            self.assertEqual(validate_sidecar(registry), [])


class ConsumerHandoffTests(unittest.TestCase):
    def _args(self, **changes):
        values = dict(
            query=None,
            kind=None,
            pack=None,
            format=None,
            dependency_status=None,
            rigged=None,
            animated=None,
            clip=None,
            joint=None,
            signature=None,
            limit=20,
        )
        values.update(changes)
        return argparse.Namespace(**values)

    def test_consumer_profile_filters_kind_without_claiming_fit(self):
        records = [
            {
                "assetId": "a.glb",
                "name": "Hero",
                "path": "a.glb",
                "kind": "model-3d",
                "format": "glb",
                "packId": "p",
                "dependencyStatus": "embedded",
                "rigFacts": {"parseStatus": "ok", "hasSkin": True, "animationCount": 2, "jointNames": ["Hip"], "animationClips": [{"name": "Walk"}], "skeletonSignatures": ["sig"]},
                "source": {"rawPinned": "pinned"},
            },
            {
                "assetId": "sound.ogg",
                "name": "Sound",
                "path": "sound.ogg",
                "kind": "audio",
                "format": "ogg",
                "packId": "p",
                "source": {"rawPinned": "sound"},
            },
        ]
        profile = {"displayName": "Frankenstein Studio", "allowedKinds": ["model-3d"], "selectionStatus": "candidate-only"}
        matches = filter_records(records, self._args(rigged="yes", clip="walk"), profile)
        self.assertEqual([r["assetId"] for r in matches], ["a.glb"])
        result = handoff({"sourceRepo": "x/y", "sourceCommit": "abc"}, "frankenstein-studio", profile, matches)
        self.assertEqual(result["selectionStatus"], "candidate-only")
        self.assertEqual(result["suitabilityDecision"], "owned-by-receiving-consumer")
        self.assertEqual(result["assets"][0]["source"]["rawPinned"], "pinned")


if __name__ == "__main__":
    unittest.main()
