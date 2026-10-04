import importlib.util
import json
import os
import subprocess
import tempfile
import unittest
from pathlib import Path

MODULE_PATH = Path(__file__).resolve().parents[1] / "build.py"
spec = importlib.util.spec_from_file_location("kfb_asset_registry_build", MODULE_PATH)
build = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(build)


class BuildTests(unittest.TestCase):
    def test_extension_classification_matches_ar1_contract(self):
        cases = {
            "x.glb": "model-3d",
            "x.gltf": "model-3d",
            "x.fbx": "model-3d",
            "x.obj": "model-3d",
            "x.blend": "model-3d",
            "x.dae": "model-3d",
            "x.3ds": "model-3d",
            "x.png": "image-2d",
            "x.jpg": "image-2d",
            "x.svg": "image-2d",
            "x.tif": "image-2d",
            "x.gif": "image-2d",
            "x.webp": "image-2d",
            "x.wav": "audio",
            "x.ogg": "audio",
            "x.mp3": "audio",
            "x.json": None,
            "x.zip": None,
        }
        for path, expected in cases.items():
            with self.subTest(path=path):
                self.assertEqual(build.classify(path), expected)

    def test_texture_hint_is_structural_and_conservative(self):
        self.assertTrue(build.is_texture_candidate("media/3D_Assets/Pack/Textures/a.png"))
        self.assertTrue(build.is_texture_candidate("media/2D_Assets/Pack/textures/a.png"))
        self.assertFalse(build.is_texture_candidate("media/3D_Assets/Pack/gltf/my_texture.png"))

    def test_urls_encode_paths_but_preserve_slashes(self):
        got = build.raw_url("georg-doc/kayfabizarro", "abc123", "media/3D_Assets/A B/ä.glb")
        self.assertEqual(
            got,
            "https://raw.githubusercontent.com/georg-doc/kayfabizarro/abc123/media/3D_Assets/A%20B/%C3%A4.glb",
        )

    def test_end_to_end_is_deterministic_and_excludes_legacy_catalog(self):
        with tempfile.TemporaryDirectory() as td:
            repo = Path(td)
            subprocess.run(["git", "init", "-q"], cwd=repo, check=True)
            subprocess.run(["git", "config", "user.email", "test@example.invalid"], cwd=repo, check=True)
            subprocess.run(["git", "config", "user.name", "KFB Test"], cwd=repo, check=True)

            files = {
                "media/2D_Assets/Test Pack/icon.png": b"png",
                "media/3D_Assets/KayKit_Mystery_Series6/12 - June 2026 - Farmers/Farmer_A.glb": b"glb",
                "media/3D_Assets/KayKit_Mystery_Series6/12 - June 2026 - Farmers/Textures/farmer.png": b"tex",
                "media/3D_Assets/Audio/hit.ogg": b"ogg",
                "media/3D_Assets/CATALOG/preview.png": b"legacy",
                "media/3D_Assets/Pack/notes.json": b"{}",
            }
            for rel, data in files.items():
                path = repo / rel
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_bytes(data)
            subprocess.run(["git", "add", "."], cwd=repo, check=True)
            env = os.environ.copy()
            env.update(
                {
                    "GIT_AUTHOR_DATE": "2026-09-12T12:00:00+02:00",
                    "GIT_COMMITTER_DATE": "2026-09-12T12:00:00+02:00",
                }
            )
            subprocess.run(["git", "commit", "-qm", "fixture"], cwd=repo, check=True, env=env)

            config = {
                "sourceRepo": "georg-doc/kayfabizarro",
                "roots": ["media/2D_Assets", "media/3D_Assets"],
                "excludePrefixes": ["media/3D_Assets/CATALOG/"],
                "output": "registry/assets/v1",
            }
            out_a = repo / "out-a"
            out_b = repo / "out-b"
            manifest_a = build.build_registry(repo, config, out_a)
            manifest_b = build.build_registry(repo, config, out_b)

            self.assertEqual(manifest_a, manifest_b)
            self.assertEqual(manifest_a["counts"]["total"], 4)
            self.assertEqual(manifest_a["counts"]["byKind"]["model-3d"], 1)
            self.assertEqual(manifest_a["counts"]["byKind"]["image-2d"], 2)
            self.assertEqual(manifest_a["counts"]["byKind"]["audio"], 1)
            self.assertEqual(manifest_a["counts"]["textureCandidates"], 1)

            files_a = sorted(p.relative_to(out_a) for p in out_a.rglob("*") if p.is_file())
            files_b = sorted(p.relative_to(out_b) for p in out_b.rglob("*") if p.is_file())
            self.assertEqual(files_a, files_b)
            for rel in files_a:
                self.assertEqual((out_a / rel).read_bytes(), (out_b / rel).read_bytes(), rel)

            catalog = [json.loads(line) for line in (out_a / "catalog.jsonl").read_text().splitlines()]
            self.assertEqual([row["path"] for row in catalog], sorted(row["path"] for row in catalog))
            farmer = next(row for row in catalog if row["path"].endswith("Farmer_A.glb"))
            self.assertEqual(farmer["assetId"], farmer["path"])
            self.assertEqual(farmer["source"]["commit"], manifest_a["sourceCommit"])


if __name__ == "__main__":
    unittest.main()
