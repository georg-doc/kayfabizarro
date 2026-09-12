import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
LIB = ROOT / "tools/asset_registry/librarian"


class LibrarianBrowserContractTests(unittest.TestCase):
    def test_required_browser_files_exist(self):
        for name in ("index.html", "styles.css", "app.js", "README.md"):
            self.assertTrue((LIB / name).is_file(), name)

    def test_html_exposes_vertical_slice_controls(self):
        html = (LIB / "index.html").read_text(encoding="utf-8")
        for control_id in (
            "searchInput",
            "kindFilter",
            "packFilter",
            "rigFilter",
            "animatedFilter",
            "resultList",
            "previewCanvas",
            "consumerSelect",
            "copyHandoff",
            "librarianQuestion",
            "copyLibrarianPacket",
        ):
            self.assertIn(f'id="{control_id}"', html)

    def test_browser_reads_generated_registry_and_profiles(self):
        js = (LIB / "app.js").read_text(encoding="utf-8")
        self.assertIn("../../../registry/assets/v1", js)
        self.assertIn("../consumer_profiles.json", js)
        self.assertIn("kfb.asset-handoff.v1", js)
        self.assertIn("candidate-only", js)
        self.assertIn("kfb.asset-librarian-request.v1", js)
        self.assertIn("rawPinned", js)
        self.assertIn("GLTFLoader", js)

    def test_expected_consumers_are_profile_driven(self):
        profiles = json.loads((ROOT / "tools/asset_registry/consumer_profiles.json").read_text(encoding="utf-8"))["profiles"]
        expected = {
            "animation-lab",
            "frankenstein-studio",
            "combat-arena",
            "stunt-car-race",
            "generic-runtime",
        }
        self.assertTrue(expected.issubset(profiles))
        for consumer_id in expected:
            self.assertEqual(profiles[consumer_id]["selectionStatus"], "candidate-only")

    def test_static_browser_does_not_embed_openai_credentials_or_fake_endpoint(self):
        text = (LIB / "app.js").read_text(encoding="utf-8").lower()
        self.assertNotIn("api.openai.com", text)
        self.assertNotIn("authorization: bearer", text)
        self.assertNotIn("sk-proj-", text)


if __name__ == "__main__":
    unittest.main()
