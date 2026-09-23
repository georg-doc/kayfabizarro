import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
LIB = ROOT / "tools/asset_registry/librarian"


class LibrarianBrowserContractTests(unittest.TestCase):
    def test_required_browser_files_exist(self):
        for name in (
            "index.html", "styles.css", "resources.css", "animation-sources.css", "app.js", "state.js", "registry.js",
            "search.js", "render.js", "selection.js", "preview.js", "preview3d.js", "framing3d.js",
            "thumb3d.js", "resources-ui.js", "rig-preview.js", "animation-sources.js", "README.md",
        ):
            self.assertTrue((LIB / name).is_file(), name)

    def test_html_exposes_v15_daily_resource_live_and_motion_controls(self):
        html = (LIB / "index.html").read_text(encoding="utf-8")
        for control_id in (
            "searchInput", "kindFilter", "packFilter", "collectionFilter", "formatFilter",
            "dependencyFilter", "problemFilter", "rigFilter", "animatedFilter", "clipFilter",
            "jointFilter", "listViewButton", "galleryViewButton", "resultList",
            "previewCanvas", "selectionButton", "selectionTray", "consumerSelect", "copyHandoff",
            "productionTabs", "assetWorkspace", "resourceWorkspace", "resourceSearch",
            "resourceActorFilter", "resourceStatusFilter", "resourceList", "resourceDetailPanel",
            "resourcePreviewWrap", "resourcePreviewCanvas", "resourcePreviewStatus",
            "registryModeSelect", "kaykitPreset", "animationSources",
        ):
            self.assertIn(f'id="{control_id}"', html, control_id)
        self.assertIn("No embedded clips", html)
        self.assertIn("https://kayfabizarro.pages.dev/asset-librarian/", html)
        for tab in ("assets", "actors", "rigs", "motions", "fx"):
            self.assertIn(f'data-library-tab="{tab}"', html)

    def test_browser_reuses_generated_registries_read_only(self):
        js = "\n".join((LIB / name).read_text(encoding="utf-8") for name in (
            "app.js", "state.js", "registry.js", "search.js", "render.js", "selection.js",
            "preview.js", "preview3d.js", "framing3d.js", "thumb3d.js", "resources-ui.js", "rig-preview.js", "animation-sources.js",
        ))
        self.assertIn("../../../registry/assets/v1", js)
        self.assertIn("bot/asset-registry-update/registry/assets/v1", js)
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

    def test_animation_discovery_separates_embedded_local_shared_and_animation_lab_boundary(self):
        js = (LIB / "animation-sources.js").read_text(encoding="utf-8")
        self.assertIn("Local character animation packs", js)
        self.assertIn("KayKit shared animation library", js)
        self.assertIn("skeleton-signature", js)
        self.assertIn("Animation Lab v2 owns playback", js)
        self.assertIn("Same-skeleton candidates", js)
        render = (LIB / "render.js").read_text(encoding="utf-8")
        self.assertIn("embedded animations", render)
        self.assertIn("local motions", render)
        self.assertIn("shared motions", render)

    def test_visible_mesh_framing_is_shared_by_detail_and_gallery(self):
        util = (LIB / "framing3d.js").read_text(encoding="utf-8")
        detail = (LIB / "preview3d.js").read_text(encoding="utf-8")
        gallery = (LIB / "thumb3d.js").read_text(encoding="utf-8")
        self.assertIn("visibleMeshBounds", util)
        self.assertIn("paddedFramingBounds", util)
        self.assertIn("headroom", util)
        self.assertIn("projectedBounds", util)
        self.assertIn("visibleMeshBounds", detail)
        self.assertIn("framePerspectiveCamera", detail)
        self.assertIn("visibleMeshBounds", gallery)
        self.assertIn("framePerspectiveCamera", gallery)

    def test_preview_repairs_known_nearby_missing_texture_maps(self):
        js = (LIB / "preview3d.js").read_text(encoding="utf-8")
        self.assertIn("textureFallbackUrls", js)
        self.assertIn("repairMissingTextureMaps", js)
        self.assertIn("../textures/", js)
        self.assertIn("../../textures/", js)
        self.assertIn("THREE.SRGBColorSpace", js)
        self.assertIn("THREE.NearestFilter", js)
        self.assertIn("mat.map=tex", js)
        self.assertIn("texture fallback", js)

    def test_permanent_url_redirect_exists(self):
        redirect = ROOT / "asset-librarian/index.html"
        self.assertTrue(redirect.is_file())
        html = redirect.read_text(encoding="utf-8")
        self.assertIn("/tools/asset_registry/librarian/", html)
        self.assertIn("location.replace", html)

    def test_rig_preview_uses_existing_owner_readers_and_keeps_vehicle_boundary(self):
        js = (LIB / "rig-preview.js").read_text(encoding="utf-8")
        self.assertIn("mountCarl", js)
        self.assertIn("mountGraft", js)
        self.assertIn("kfb-rigs-embed-v3", js)
        self.assertIn("partial composition", js)
        self.assertIn("cut/base/cockpit fabrication", js)

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

    def test_v15_keeps_runtime_aliases_for_regression_smoke(self):
        js = (LIB / "app.js").read_text(encoding="utf-8")
        for alias in ("V12", "V13", "V14", "V15"):
            self.assertIn(f"window.KFBAssetLibrarian{alias}", js)
        self.assertIn("version:'1.5'", js)


if __name__ == "__main__":
    unittest.main()
