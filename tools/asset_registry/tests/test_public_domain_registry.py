import hashlib
import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
POOL = ROOT / "media/public_domain"
CONFIG = ROOT / "tools/asset_registry/config.json"


class PublicDomainRegistrySourceTests(unittest.TestCase):
    EXPECTED = {
        "media/public_domain/met/bathing-suit-1890-95.jpg": {
            "provider": "met",
            "sourceId": 86434,
            "sha256": "8d4696259a2fa664da351e6f619a8808ca129c1bd45e4d0f80e87381c151917c",
        },
        "media/public_domain/aic/great-wave-hokusai-1830-33.jpg": {
            "provider": "aic",
            "sourceId": 24645,
            "sha256": "e0aa55ad5865f5ffa3e0fb7087e91a1e11ce5d7f13f392ba0f493c513b7f0f56",
        },
        "media/public_domain/commons/silent-film.svg": {
            "provider": "commons",
            "sourceId": "File:Silent film.svg",
            "sha256": "e55e5d25eb1c834816a10d4d15d9ef30fa8a467c92d853f7439556b5774aadc7",
        },
        "media/public_domain/ia/the-general-1926-item-tile.jpg": {
            "provider": "ia",
            "sourceId": "TheGeneral1926",
            "sha256": "bbc1321e8ca53998e8bb2761a199d0130dc6230de589087ea62eddaf7888ee19",
        },
    }

    def test_existing_registry_config_registers_public_domain_root(self):
        config = json.loads(CONFIG.read_text(encoding="utf-8"))
        self.assertIn("media/public_domain", config["roots"])

    def test_exact_four_smoke_assets_have_matching_explicit_sidecars(self):
        found = []
        for rel, expected in self.EXPECTED.items():
            asset = ROOT / rel
            self.assertTrue(asset.is_file(), rel)
            sidecar = Path(str(asset) + ".license.json")
            self.assertTrue(sidecar.is_file(), sidecar)
            data = json.loads(sidecar.read_text(encoding="utf-8"))
            self.assertEqual(data["provider"], expected["provider"])
            self.assertEqual(data["sourceId"], expected["sourceId"])
            self.assertEqual(data["tier"], "free")
            self.assertTrue(data["rights"])
            self.assertTrue(data["sourcePage"])
            self.assertTrue(data["sourceRecordUrl"])
            self.assertTrue(data["sourceFileUrl"])
            self.assertTrue(data["retrievedAt"])
            self.assertEqual(data["bytes"], asset.stat().st_size)
            digest = hashlib.sha256(asset.read_bytes()).hexdigest()
            self.assertEqual(digest, expected["sha256"])
            self.assertEqual(data["sha256"], digest)
            self.assertEqual(
                data["localPath"],
                rel.removeprefix("media/public_domain/"),
            )
            found.append(rel)
        self.assertEqual(set(found), set(self.EXPECTED))

    def test_generated_pool_manifest_is_same_four_asset_set(self):
        rows = [
            json.loads(line)
            for line in (POOL / "manifest.jsonl").read_text(encoding="utf-8").splitlines()
            if line.strip()
        ]
        self.assertEqual(len(rows), 4)
        local = {
            "media/public_domain/" + row["localPath"]: row
            for row in rows
        }
        self.assertEqual(set(local), set(self.EXPECTED))
        for rel, expected in self.EXPECTED.items():
            self.assertEqual(local[rel]["provider"], expected["provider"])
            self.assertEqual(local[rel]["sha256"], expected["sha256"])

    def test_librarian_reuses_existing_provenance_surface(self):
        render = (
            ROOT / "tools/asset_registry/librarian/render.js"
        ).read_text(encoding="utf-8")
        for label in (
            "license/source metadata",
            "rights provenance",
            "rights tier",
            "external provider",
            "external source ID",
            "external source page",
            "rights checked at",
            "payload SHA-256",
            "rights evidence sidecar",
        ):
            self.assertIn(label, render)
        self.assertNotIn("license inference", render.lower())


if __name__ == "__main__":
    unittest.main()
