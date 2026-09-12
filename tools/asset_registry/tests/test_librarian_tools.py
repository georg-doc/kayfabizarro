import sys
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parents[1]
if str(HERE) not in sys.path:
    sys.path.insert(0, str(HERE))

from librarian_tools import LibrarianToolError, LibrarianTools


class LibrarianToolsTests(unittest.TestCase):
    def setUp(self):
        self.manifest = {
            "sourceRepo": "georg-doc/kayfabizarro",
            "sourceCommit": "abc123",
        }
        self.profiles = {
            "animation-lab": {
                "displayName": "Animation Lab",
                "selectionStatus": "candidate-only",
                "allowedKinds": ["model-3d"],
                "ownerBoundary": "Animation Lab owns compatibility.",
                "requiredDownstreamValidation": ["visual playback"],
            },
            "frankenstein-studio": {
                "displayName": "Frankenstein Studio",
                "selectionStatus": "candidate-only",
                "allowedKinds": ["model-3d"],
                "ownerBoundary": "Frankenstein workflow owns donor acceptance.",
                "requiredDownstreamValidation": ["donor measurement"],
            },
            "combat-arena": {
                "displayName": "Combat Arena",
                "selectionStatus": "candidate-only",
                "allowedKinds": ["model-3d", "image-2d", "audio"],
                "ownerBoundary": "Combat Arena owns roster acceptance.",
                "requiredDownstreamValidation": ["arena playtest"],
            },
        }
        source = {"rawPinned": "https://example.test/pinned", "rawLatest": "https://example.test/latest"}
        self.records = [
            {
                "assetId": "media/3D_Assets/Test/HeroA.glb",
                "name": "HeroA",
                "path": "media/3D_Assets/Test/HeroA.glb",
                "kind": "model-3d",
                "format": "glb",
                "packId": "test",
                "collectionPath": "Heroes",
                "sizeBytes": 100,
                "dependencyStatus": "complete",
                "source": source,
                "relations": {"dependencies": [{"role": "image", "path": "texture.png", "exists": True}]},
                "rigFacts": {
                    "parseStatus": "ok",
                    "hasSkin": True,
                    "jointCount": 3,
                    "jointNames": ["Hand", "Hip", "Root"],
                    "animationCount": 1,
                    "animationClips": [{"name": "Walk"}],
                    "skeletonSignatures": ["sig-same"],
                },
            },
            {
                "assetId": "media/3D_Assets/Test/HeroB.glb",
                "name": "HeroB",
                "path": "media/3D_Assets/Test/HeroB.glb",
                "kind": "model-3d",
                "format": "glb",
                "packId": "test",
                "collectionPath": "Heroes",
                "dependencyStatus": "embedded",
                "source": source,
                "relations": {"dependencies": []},
                "rigFacts": {
                    "parseStatus": "ok",
                    "hasSkin": True,
                    "jointCount": 3,
                    "jointNames": ["Hand", "Hip", "Root"],
                    "animationCount": 0,
                    "animationClips": [],
                    "skeletonSignatures": ["sig-same"],
                },
            },
            {
                "assetId": "media/3D_Assets/Test/HeroC.glb",
                "name": "HeroC",
                "path": "media/3D_Assets/Test/HeroC.glb",
                "kind": "model-3d",
                "format": "glb",
                "packId": "test",
                "collectionPath": "Heroes",
                "dependencyStatus": "embedded",
                "source": source,
                "relations": {"dependencies": []},
                "rigFacts": {
                    "parseStatus": "ok",
                    "hasSkin": True,
                    "jointCount": 5,
                    "jointNames": ["Root", "Spine"],
                    "animationCount": 1,
                    "animationClips": [{"name": "Idle"}],
                    "skeletonSignatures": ["sig-other"],
                },
            },
            {
                "assetId": "media/2D_Assets/Test/HeroPortrait.png",
                "name": "HeroPortrait",
                "path": "media/2D_Assets/Test/HeroPortrait.png",
                "kind": "image-2d",
                "format": "png",
                "packId": "test-2d",
                "collectionPath": None,
                "source": source,
            },
        ]
        self.tools = LibrarianTools.from_data(self.manifest, self.records, self.profiles)

    def test_search_assets_uses_existing_registry_filters(self):
        result = self.tools.search_assets(
            "Hero",
            filters={"kind": "model-3d", "rigged": "yes", "clip": "walk"},
            consumer_id="animation-lab",
            limit=10,
        )
        self.assertEqual(result["schema"], "kfb.asset-librarian-tool-result.v1")
        self.assertEqual(result["selectionStatus"], "candidate-only")
        self.assertEqual(result["count"], 1)
        self.assertEqual(result["assets"][0]["name"], "HeroA")

    def test_dependency_and_rig_tools_return_facts_only(self):
        asset_id = "media/3D_Assets/Test/HeroA.glb"
        deps = self.tools.get_dependencies(asset_id)
        self.assertEqual(deps["dependencyStatus"], "complete")
        self.assertEqual(deps["dependencies"][0]["path"], "texture.png")
        rig = self.tools.get_rig_facts(asset_id)
        self.assertEqual(rig["rigFacts"]["jointCount"], 3)
        self.assertEqual(rig["selectionStatus"], "candidate-only")

    def test_find_same_skeleton_is_evidence_not_compatibility(self):
        result = self.tools.find_same_skeleton("media/3D_Assets/Test/HeroA.glb")
        self.assertEqual(result["evidenceType"], "exact-structural-skeleton-signature-overlap")
        self.assertEqual(result["compatibilityDecision"], "not-made")
        self.assertEqual(result["count"], 1)
        self.assertEqual(result["candidates"][0]["asset"]["name"], "HeroB")
        self.assertEqual(result["candidates"][0]["matchingSignatures"], ["sig-same"])

    def test_export_handoff_preserves_receiving_owner_boundary(self):
        result = self.tools.export_handoff(
            "frankenstein-studio",
            [
                "media/3D_Assets/Test/HeroA.glb",
                "media/2D_Assets/Test/HeroPortrait.png",
            ],
        )
        self.assertEqual(result["schema"], "kfb.asset-handoff.v1")
        self.assertEqual(result["selectionStatus"], "candidate-only")
        self.assertEqual(result["suitabilityDecision"], "owned-by-receiving-consumer")
        self.assertTrue(result["assets"][0]["consumerKindAllowed"])
        self.assertFalse(result["assets"][1]["consumerKindAllowed"])

    def test_tool_catalog_is_small_and_read_only(self):
        catalog = self.tools.tool_catalog()
        self.assertEqual(catalog["mode"], "read-only")
        self.assertEqual(
            [tool["name"] for tool in catalog["tools"]],
            [
                "search_assets",
                "get_asset",
                "get_dependencies",
                "get_rig_facts",
                "find_same_skeleton",
                "export_handoff",
            ],
        )

    def test_dispatch_rejects_unknown_tool_and_asset(self):
        with self.assertRaises(LibrarianToolError):
            self.tools.call("delete_asset", {})
        with self.assertRaises(LibrarianToolError):
            self.tools.get_asset("missing")


class RealRegistryLibrarianToolsSmoke(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tools = LibrarianTools(repo_root=HERE.parents[1])

    def test_real_registry_search_rig_and_consumer_handoff(self):
        rigged = self.tools.search_assets(
            "4GTN",
            filters={"kind": "model-3d", "rigged": "yes"},
            limit=5,
        )
        target_path = "media/3D_Assets/KayKit_Mystery_Series6/7 - January 2026 - 4GTN/4GTN.glb"
        target = next((asset for asset in rigged["assets"] if asset["path"] == target_path), None)
        self.assertIsNotNone(target)
        rig = self.tools.get_rig_facts(target["assetId"])
        self.assertEqual(rig["rigFacts"]["jointCount"], 23)
        structural = self.tools.find_same_skeleton(target["assetId"], limit=5)
        self.assertEqual(structural["compatibilityDecision"], "not-made")

        animated = self.tools.search_assets(
            "Alien",
            filters={"kind": "model-3d", "animated": "yes"},
            consumer_id="combat-arena",
            limit=20,
        )
        alien_path = "media/3D_Assets/MonsterPack_Quaternius/Big/glTF/Alien.gltf"
        alien = next((asset for asset in animated["assets"] if asset["path"] == alien_path), None)
        self.assertIsNotNone(alien)
        handoff = self.tools.export_handoff("combat-arena", [alien["assetId"]])
        self.assertEqual(handoff["selectionStatus"], "candidate-only")
        self.assertEqual(handoff["suitabilityDecision"], "owned-by-receiving-consumer")
        self.assertTrue(handoff["assets"][0]["consumerKindAllowed"])


if __name__ == "__main__":
    unittest.main()
