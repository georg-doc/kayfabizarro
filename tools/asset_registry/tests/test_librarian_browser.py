import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
LIB = ROOT / "tools/asset_registry/librarian"


class LibrarianBrowserContractTests(unittest.TestCase):
    def test_required_browser_files_exist(self):
        for name in ("index.html", "styles.css", "app.js", "state.js", "registry.js", "search.js", "render.js", "selection.js", "preview.js", "preview3d.js", "README.md", "SOURCE_PATHS.md", "SITE_QA.md", "RETURN.md", "BUILD_MANIFEST.json", "CHANGELOG.md"):
            self.assertTrue((LIB / name).is_file(), name)

    def test_html_exposes_v12_daily_tool_controls(self):
        html = (LIB / "index.html").read_text(encoding="utf-8")
        for control_id in (
            "searchInput", "kindFilter", "packFilter", "collectionFilter", "formatFilter",
            "dependencyFilter", "problemFilter", "rigFilter", "animatedFilter", "clipFilter",
            "jointFilter", "listViewButton", "galleryViewButton", "resultList",
            "copyPath", "copyAssetId", "copyRaw", "openRaw", "openLatestRaw",
            "previewCanvas", "imagePreview", "audioPlayer", "resetCamera", "fitCamera",
            "wireframeToggle", "autoplayToggle", "clipSelect", "problemFacts",
            "selectionTray", "trayItems", "consumerSelect", "copyHandoff", "downloadHandoff",
        ):
            self.assertIn(f'id="{control_id}"', html, control_id)
        self.assertIn("AI Assistant · optional / unavailable in v1.2 Core", html)
        self.assertNotIn('id="librarianQuestion"', html)
        self.assertNotIn('id="copyLibrarianPacket"', html)

    def test_browser_reuses_canonical_registry_and_is_read_only(self):
        js = "\n".join((LIB / name).read_text(encoding="utf-8") for name in ("app.js", "state.js", "registry.js", "search.js", "render.js", "selection.js", "preview.js", "preview3d.js"))
        self.assertIn("../../../registry/assets/v1", js)
        self.assertIn("../consumer_profiles.json", js)
        self.assertIn("catalog.jsonl", js)
        self.assertIn("rigfacts.jsonl", js)
        self.assertIn("problems.json", js)
        self.assertIn("kfb.asset-handoff.v1", js)
        self.assertIn("candidate-only", js)
        self.assertIn("owned-by-receiving-consumer", js)
        self.assertIn("localStorage", js)
        self.assertIn("GLTFLoader", js)
        self.assertNotIn("fetch('/api", js)
        self.assertNotIn("POST", js)
        self.assertNotIn("PUT", js)
        self.assertNotIn("DELETE", js)

    def test_preview_support_is_format_specific_and_lazy(self):
        js = "\n".join((LIB / name).read_text(encoding="utf-8") for name in ("app.js", "state.js", "registry.js", "search.js", "render.js", "selection.js", "preview.js", "preview3d.js"))
        self.assertIn("render3D", js)
        self.assertIn("renderImage", js)
        self.assertIn("renderAudio", js)
        self.assertIn("preload=\"metadata\"", (LIB / "index.html").read_text(encoding="utf-8"))
        self.assertIn("img.loading = 'lazy'", js)
        self.assertIn("ensureRigFacts", js)
        self.assertIn("ensureProblems", js)

    def test_expected_consumers_remain_profile_driven_candidate_only(self):
        profiles = json.loads((ROOT / "tools/asset_registry/consumer_profiles.json").read_text(encoding="utf-8"))["profiles"]
        expected = {"animation-lab", "frankenstein-studio", "combat-arena", "stunt-car-race", "generic-runtime"}
        self.assertTrue(expected.issubset(profiles))
        for consumer_id in expected:
            self.assertEqual(profiles[consumer_id]["selectionStatus"], "candidate-only")

    def test_static_core_has_no_llm_or_api_key_dependency(self):
        text = "\n".join((LIB / name).read_text(encoding="utf-8", errors="ignore") for name in ("index.html", "app.js", "state.js", "registry.js", "search.js", "render.js", "selection.js", "preview.js", "preview3d.js", "styles.css")).lower()
        for forbidden in ("api.openai.com", "authorization: bearer", "sk-proj-", "openai_api_key", "anthropic_api_key", "claude"):
            self.assertNotIn(forbidden, text)
        self.assertNotIn("kfb.asset-librarian-request.v1", text)


if __name__ == "__main__":
    unittest.main()
