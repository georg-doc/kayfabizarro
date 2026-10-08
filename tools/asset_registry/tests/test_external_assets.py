import sys
import unittest
from pathlib import Path
from urllib.parse import unquote, urlparse

HERE = Path(__file__).resolve().parents[1]
if str(HERE) not in sys.path:
    sys.path.insert(0, str(HERE))

from external_assets import CANDIDATE_STATUS, ExternalAssetClient, ExternalAssetError
from librarian_tools import LibrarianTools


ASSET = {
    "id": "threedassets:pine-test",
    "provider": "threedassets",
    "nativeId": "pine-test",
    "title": "Pine Test",
    "author": "3D Assets",
    "type": "model",
    "url": "https://3dassets.dev/assets/pine-test",
    "thumbnailUrl": "https://cdn.3dassets.dev/pine-test.webp",
    "license": {
        "name": "CC0",
        "url": "https://creativecommons.org/publicdomain/zero/1.0/",
        "commercialUse": True,
        "attributionRequired": False,
    },
    "price": {"free": True},
    "formats": ["glb"],
    "polyCount": 161,
    "rigged": False,
    "animated": False,
    "downloadable": True,
}


class FakeExternalAPI:
    def __init__(self):
        self.urls = []

    def __call__(self, url):
        self.urls.append(url)
        parsed = urlparse(url)
        if parsed.path == "/v1/search":
            return {"query": "pine", "results": [dict(ASSET)], "providers": []}
        if parsed.path == "/v1/providers":
            return {"providers": [{"id": "threedassets", "supportsDownload": True}]}
        if parsed.path.startswith("/v1/assets/"):
            self.assert_requested_id(parsed.path)
            return {
                **ASSET,
                "files": [{
                    "url": "https://cdn.3dassets.dev/pine-test.glb",
                    "filename": "pine-test.glb",
                    "format": "glb",
                    "group": "glb",
                    "sizeBytes": 26580,
                }],
            }
        raise AssertionError(f"unexpected URL: {url}")

    @staticmethod
    def assert_requested_id(path):
        assert unquote(path.rsplit("/", 1)[-1]) == ASSET["id"]


class ExternalAssetClientTests(unittest.TestCase):
    def setUp(self):
        self.api = FakeExternalAPI()
        self.client = ExternalAssetClient(
            fetcher=self.api,
            clock=lambda: 100.0,
            utc_now=lambda: "2026-10-08T12:00:00+00:00",
        )

    def test_search_labels_provider_claims_without_registry_claims(self):
        result = self.client.search("pine", free=True, downloadable=True)
        self.assertEqual(result["status"], CANDIDATE_STATUS)
        self.assertEqual(result["assets"][0]["providerLicenseClaim"]["name"], "CC0")
        self.assertIn("unverified", result["assets"][0]["claimBoundary"])
        self.assertNotIn("assetId", result["assets"][0])

        self.client.search("pine", free=True, downloadable=True)
        self.assertEqual(len(self.api.urls), 1, "identical searches should use the bounded cache")

    def test_prepare_intake_is_metadata_only_and_keeps_k2_fields(self):
        intake = self.client.prepare_intake(
            ASSET["id"],
            measured_height=3.4,
            scale_hint="tall background pine",
            notes="Verify silhouette in K2.",
        )
        self.assertEqual(intake["schema"], "kfb.external-asset-intake/1")
        self.assertEqual(intake["requestedFile"]["filename"], "pine-test.glb")
        self.assertEqual(intake["k2Measurement"]["measuredHeight"], 3.4)
        self.assertFalse(intake["boundaries"]["bytesDownloaded"])
        self.assertFalse(intake["boundaries"]["registered"])

    def test_unknown_file_url_fails_closed(self):
        with self.assertRaises(ExternalAssetError):
            self.client.prepare_intake(ASSET["id"], file_url="https://evil.example/model.glb")

    def test_librarian_tools_exposes_separate_external_lane(self):
        tools = LibrarianTools.from_data(
            {"sourceRepo": "georg-doc/kayfabizarro", "sourceCommit": "abc"},
            [],
            {},
        )
        tools.external_client = self.client
        result = tools.call("search_external_assets", {"query": "pine", "limit": 3})
        self.assertEqual(result["status"], CANDIDATE_STATUS)
        intake = tools.call("prepare_external_asset_intake", {"external_id": ASSET["id"]})
        self.assertEqual(intake["nextGate"], "trusted-download-hash-source-isolation-3d-proof-registry-build")


if __name__ == "__main__":
    unittest.main()
