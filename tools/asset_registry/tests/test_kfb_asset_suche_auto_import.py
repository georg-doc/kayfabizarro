"""V421 KFB Asset Suche direct-to-repo intake gate: temporary offline test fixtures."""
import hashlib
import io
import json
from pathlib import Path
import tempfile
import unittest
import zipfile

from tools.asset_registry.kfb_asset_suche_auto_import import (
    run, IntakeError, BASE, safe_relative, check_source, digest, extract_whitelist,
)


def make_zip(entries):
    buff = io.BytesIO()
    with zipfile.ZipFile(buff, "w") as z:
        for name, value in entries.items():
            z.writestr(name, value)
    return buff.getvalue()


class KfbAssetSucheAutoImportTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.repo = Path(self.tmp.name)
        self.source_data = make_zip({"sample-model.glb": b"ORIGINAL-SOURCE-MESH", "albedo.png": b"image"})
        self.source = {
            "id": "test_landmark_cc0",
            "landmarkId": "test_monument",
            "title": "Named monument",
            "sourcePage": "https://opengameart.org/content/test-monument",
            "archiveUrl": "https://opengameart.org/sites/default/files/test.zip",
            "archiveSha256": digest(self.source_data),
            "license": "CC0-1.0",
            "licenceEvidence": "https://opengameart.org/content/test-monument",
            "author": "Example Creator",
            "identityChecked": True,
            "rightsVerifiedForPublicRepo": True,
            "sourceRole": "exact-landmark-model",
            "selectedSourceFile": "sample-model.glb",
            "selectedSourceSha256": digest(b"ORIGINAL-SOURCE-MESH"),
            "sourceApproval": "CANDIDATE_ONLY_KNETE_FOLGT_NOT_GEORG_SELECTED",
            "files": [
                {"archiveMember": "sample-model.glb", "destination": "source/sample-model.glb"},
                {"archiveMember": "albedo.png", "destination": "source/albedo.png"},
            ],
        }

    def tearDown(self):
        self.tmp.cleanup()

    def request(self, *entries):
        path = self.repo / "request.json"
        path.write_text(json.dumps({
            "schema": "kfb.asset-suche-github-intake/1",
            "destinationRoot": BASE.as_posix(),
            "candidates": list(entries or (self.source,)),
        }))
        return path

    def downloader(self, url):
        self.assertEqual(url, self.source["archiveUrl"])
        return self.source_data

    def test_happy_import_copies_original_bytes_and_credits(self):
        out = run(self.request(), self.repo, self.downloader)
        self.assertEqual(out["status"], "STAGED_FOR_REVIEW")
        dest = self.repo / BASE / "test_monument" / "test_landmark_cc0"
        self.assertEqual((dest / "source/sample-model.glb").read_bytes(), b"ORIGINAL-SOURCE-MESH")
        self.assertEqual((dest / "source/albedo.png").read_bytes(), b"image")
        manifest = json.loads((dest / "SOURCE.json").read_text())
        self.assertEqual(manifest["licenseSPDX"], "CC0-1.0")
        self.assertEqual(manifest["files"][0]["sha256"], digest(b"image"))
        self.assertFalse(out["georgSelected"])
        self.assertFalse(out["autoMerged"])
        self.assertIn("Example Creator", (dest / "CREDITS.md").read_text())

    def test_blocks_noncommercial_licenses(self):
        self.source["license"] = "CC-BY-NC-4.0"
        with self.assertRaises(IntakeError):
            run(self.request(), self.repo, self.downloader)

    def test_blocks_unknown_rights_or_identity(self):
        self.source["identityChecked"] = False
        with self.assertRaises(IntakeError):
            run(self.request(), self.repo, self.downloader)

    def test_blocks_kenney_category_substitute(self):
        self.source["sourceRole"] = "construction_donor_not_neuschwanstein"
        with self.assertRaises(IntakeError):
            run(self.request(), self.repo, self.downloader)

    def test_blocks_wrong_archive_sha(self):
        self.source["archiveSha256"] = "f" * 64
        with self.assertRaises(IntakeError):
            run(self.request(), self.repo, self.downloader)
        self.assertFalse((self.repo / BASE).exists())

    def test_blocks_changed_selected_model_sha(self):
        self.source["selectedSourceSha256"] = "0" * 64
        with self.assertRaises(IntakeError):
            run(self.request(), self.repo, self.downloader)

    def test_blocks_duplicate_or_existing_dest(self):
        path = self.request()
        run(path, self.repo, self.downloader)
        with self.assertRaises(IntakeError):
            run(path, self.repo, self.downloader)

    def test_blocks_zip_slip_from_original(self):
        self.source_data = make_zip({"../evil.glb": b"bad", "sample-model.glb": b"ORIGINAL-SOURCE-MESH", "albedo.png": b"image"})
        self.source["archiveSha256"] = digest(self.source_data)
        with self.assertRaises(Exception):
            run(self.request(), self.repo, self.downloader)
        self.assertFalse((self.repo / "evil.glb").exists())

    def test_blocks_unsafe_output_path(self):
        self.source["files"][0]["destination"] = "source/../../bad.glb"
        with self.assertRaises(IntakeError):
            run(self.request(), self.repo, self.downloader)

    def test_requires_credit_for_cc_by(self):
        self.source["license"] = "CC-BY-4.0"
        self.source.pop("attribution", None)
        with self.assertRaises(IntakeError):
            run(self.request(), self.repo, self.downloader)
        self.source["attribution"] = "Creator under CC BY 4.0, with source link"
        run(self.request(), self.repo, self.downloader)

    def test_requires_explicit_selected_model_in_file_list(self):
        self.source["files"] = [{"archiveMember": "albedo.png", "destination": "source/albedo.png"}]
        with self.assertRaises(IntakeError):
            run(self.request(), self.repo, self.downloader)

    def test_blocks_non_https_or_non_allowed_host(self):
        self.source["archiveUrl"] = "http://opengameart.org/anything.zip"
        with self.assertRaises(IntakeError):
            run(self.request(), self.repo, self.downloader)

    def test_two_items_fail_transactionally(self):
        second = dict(self.source)
        second["id"] = "another_monument_cc0"
        second["selectedSourceSha256"] = "f" * 64
        with self.assertRaises(IntakeError):
            run(self.request(self.source, second), self.repo, self.downloader)
        self.assertFalse((self.repo / BASE / "test_monument" / "test_landmark_cc0").exists())


if __name__ == "__main__":
    unittest.main()
