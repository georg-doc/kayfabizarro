import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
LIB = ROOT / "tools/asset_registry/librarian"


class LibrarianBrowserContractTests(unittest.TestCase):
    def test_required_browser_files_exist(self):
        for name in (
            "index.html", "styles.css", "resources.css", "app.js", "state.js", "registry.js",
            "search.js", "render.js", "selection.js", "preview.js", "preview3d.js",
            "thumb3d.js", "resources-ui.js", "README.md",
        ):
            self.assertTrue((LIB / name).is_file(), name)

    def test_html_exposes_v13_daily_and_resource_controls(self):
        html = (LIB / "index.html").read_text(encoding="utf-8")
        for control_id in (
            "searchInput", "kindFilter", "packFilter", "collectionFilter", "formatFilter",
            "dependencyFilter", "problemFilter", "rigFilter", "animatedFilter", "clipFilter",
            "jointFilter", "listViewButton", "galleryViewButton", "resultList",
            "previewCanvas", "selectionButton", "selectionTray", "consumerSelect", "copyHandoff",
            "productionTabs", "assetWorkspace", "resourceWorkspace", "resourceSearch",
            "resourceActorFilter", "resourceStatusFilter", "resourceList", "resourceDetailPanel",
            "kaykitPreset",
        ):
            self.assertIn(f'id="{control_id}"', html, control_id)
        for tab in ("assets", "actors", "rigs", "motions", "fx"):
            self.assertIn(f'data-library-tab="{tab}"', html)

    def test_browser_reuses_both_generated_registries_read_only(self):
        js = "\n".join((LIB / name).read_text(encoding="utf-8") for name in (
            "app.js", "state.js", "registry.js", "search.js", "render.js", "selection.js",
            "preview.js", "preview3d.js", "thumb3d.js", "resources-ui.js",
        ))
        self.assertIn("../../../registry/assets/v1", js)
        self.assertIn("../../../registry/resources/v1", js)
        self.assertIn("../consumer_profiles.json", js)
        self.assertIn("catalog.jsonl", js)
        self.assertIn("actors.jsonl", js)
        self.assertIn("configs.jsonl", js)
        self.assertIn("motions.jsonl", js)
        self.assertIn("fx.jsonl", js)
        self.assertIn("kfb.asset-handoff.v1", js)
        self.assertIn("candidate-only", js)
        self.assertIn("GLTFLoader", js)
        for forbidden in ("fetch('/api", "POST", "PUT", "DELETE", "api.openai.com", "authorization: bearer", "sk-proj-"):
            self.assertNotIn(forbidden, js)

    def test_motion_preview_and_owner_runtime_boundary_are_explicit(self):
        js = (LIB / "resources-ui.js").read_text(encoding="utf-8")
        self.assertIn("Preview source clip", js)
        self.assertIn("does not prove retarget or actor compatibility", js)
        self.assertIn("OWNER_RUNTIME_REQUIRED", js)
        self.assertIn("Librarian does not fake execution", js)
        self.assertIn("no verified standalone playback adapter", js)

    def test_expected_consumers_remain_profile_driven_candidate_only(self):
        profiles = json.loads((ROOT / "tools/asset_registry/consumer_profiles.json").read_text(encoding="utf-8"))["profiles"]
        expected = {"animation-lab", "frankenstein-studio", "combat-arena", "stunt-car-race", "generic-runtime"}
        self.assertTrue(expected.issubset(profiles))
        for consumer_id in expected:
            self.assertEqual(profiles[consumer_id]["selectionStatus"], "candidate-only")

    def test_v13_keeps_v12_runtime_alias_for_regression_smoke(self):
        js = (LIB / "app.js").read_text(encoding="utf-8")
        self.assertIn("window.KFBAssetLibrarianV12", js)
        self.assertIn("window.KFBAssetLibrarianV13", js)
        self.assertIn("version:'1.3'", js)


if __name__ == "__main__":
    unittest.main()
