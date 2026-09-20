import importlib.util
import json
import os
import subprocess
import tempfile
import unittest
from pathlib import Path

TOOLS = Path(__file__).resolve().parents[1]


def load_module(name: str, filename: str):
    spec = importlib.util.spec_from_file_location(name, TOOLS / filename)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


build = load_module("kfb_asset_registry_build_ar4", "build.py")
delta_mod = load_module("kfb_asset_registry_delta_ar4", "delta.py")
validate_mod = load_module("kfb_asset_registry_validate_ar4", "validate.py")


class AR4Tests(unittest.TestCase):
    def _git(self, repo: Path, *args: str, env=None):
        return subprocess.run(
            ["git", *args],
            cwd=repo,
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            env=env,
        ).stdout.strip()

    def _commit(self, repo: Path, message: str, timestamp: str):
        env = os.environ.copy()
        env["GIT_AUTHOR_DATE"] = timestamp
        env["GIT_COMMITTER_DATE"] = timestamp
        self._git(repo, "add", "-A")
        self._git(repo, "commit", "-qm", message, env=env)
        return self._git(repo, "rev-parse", "HEAD")

    def _write(self, repo: Path, rel: str, data: bytes | str):
        path = repo / rel
        path.parent.mkdir(parents=True, exist_ok=True)
        if isinstance(data, bytes):
            path.write_bytes(data)
        else:
            path.write_text(data, encoding="utf-8")

    def _config(self):
        return {
            "sourceRepo": "georg-doc/kayfabizarro",
            "roots": ["media/2D_Assets", "media/3D_Assets"],
            "excludePrefixes": ["media/3D_Assets/CATALOG/"],
            "output": "registry/assets/v1",
        }

    def test_delta_marks_only_unique_same_blob_as_move(self):
        old = [
            {"path": "a.png", "source": {"blobSha": "same"}},
            {"path": "dup-a.png", "source": {"blobSha": "dup"}},
            {"path": "dup-b.png", "source": {"blobSha": "dup"}},
        ]
        new = [
            {"path": "b.png", "source": {"blobSha": "same"}},
            {"path": "dup-c.png", "source": {"blobSha": "dup"}},
        ]
        delta = delta_mod.build_delta(
            previous={"manifest": {"sourceCommit": "old"}, "records": old, "problems": []},
            current_records=new,
            current_problems=[],
            to_commit="new",
        )
        self.assertEqual(delta["moved"], [{"from": "a.png", "to": "b.png", "blobSha": "same"}])
        self.assertEqual(delta["added"], ["dup-c.png"])
        self.assertEqual(delta["removed"], ["dup-a.png", "dup-b.png"])

    def test_real_git_delta_cleanup_validation_and_repeatability(self):
        with tempfile.TemporaryDirectory() as td:
            repo = Path(td)
            self._git(repo, "init", "-q")
            self._git(repo, "config", "user.email", "registry-test@example.invalid")
            self._git(repo, "config", "user.name", "KFB Registry Test")

            gltf = {
                "asset": {"version": "2.0"},
                "buffers": [{"uri": "model.bin", "byteLength": 3}],
                "images": [{"uri": "tex.png"}],
            }
            self._write(repo, "media/3D_Assets/Pack/model.gltf", json.dumps(gltf))
            self._write(repo, "media/3D_Assets/Pack/model.bin", b"bin")
            self._write(repo, "media/3D_Assets/Pack/tex.png", b"texture")
            self._write(repo, "media/3D_Assets/OldPack/hit.ogg", b"old-audio")
            baseline_source = self._commit(repo, "source baseline", "2026-09-12T12:00:00+02:00")

            out = repo / "registry/assets/v1"
            out.mkdir(parents=True, exist_ok=True)
            (out / "README.md").write_text("keep me\n", encoding="utf-8")
            first = build.build_registry(repo, self._config())
            self.assertEqual(first["sourceCommit"], baseline_source)
            self.assertEqual(validate_mod.validate_registry(out), [])
            self.assertTrue((out / "packs" / "oldpack.json").is_file())
            registry_commit = self._commit(repo, "registry baseline", "2026-09-12T12:01:00+02:00")
            self.assertNotEqual(registry_commit, baseline_source)

            # Move the exact same texture blob so the model keeps the old explicit
            # URI and becomes missing. Remove one pack completely and add audio.
            old_tex = repo / "media/3D_Assets/Pack/tex.png"
            new_tex = repo / "media/3D_Assets/Pack/Textures/tex.png"
            new_tex.parent.mkdir(parents=True, exist_ok=True)
            old_tex.rename(new_tex)
            (repo / "media/3D_Assets/OldPack/hit.ogg").unlink()
            self._write(repo, "media/3D_Assets/Pack/new.wav", b"new-audio")
            changed_source = self._commit(repo, "source delta", "2026-09-12T12:02:00+02:00")

            second = build.build_registry(repo, self._config())
            self.assertEqual(second["sourceCommit"], changed_source)
            self.assertEqual(validate_mod.validate_registry(out), [])
            self.assertEqual((out / "README.md").read_text(encoding="utf-8"), "keep me\n")
            self.assertFalse((out / "packs" / "oldpack.json").exists())

            delta = json.loads((out / "delta.json").read_text(encoding="utf-8"))
            self.assertEqual(delta["fromCommit"], baseline_source)
            self.assertEqual(delta["toCommit"], changed_source)
            self.assertEqual(delta["added"], ["media/3D_Assets/Pack/new.wav"])
            self.assertEqual(delta["removed"], ["media/3D_Assets/OldPack/hit.ogg"])
            self.assertEqual(
                delta["moved"],
                [{
                    "from": "media/3D_Assets/Pack/tex.png",
                    "to": "media/3D_Assets/Pack/Textures/tex.png",
                    "blobSha": self._git(repo, "rev-parse", "HEAD:media/3D_Assets/Pack/Textures/tex.png"),
                }],
            )
            changed = [item["path"] for item in delta["changedDependencies"]]
            self.assertEqual(changed, ["media/3D_Assets/Pack/model.gltf"])

            snapshot = {
                str(path.relative_to(out)): path.read_bytes()
                for path in sorted(out.rglob("*"))
                if path.is_file()
            }
            build.build_registry(repo, self._config())
            self.assertEqual(validate_mod.validate_registry(out), [])
            repeat = {
                str(path.relative_to(out)): path.read_bytes()
                for path in sorted(out.rglob("*"))
                if path.is_file()
            }
            self.assertEqual(snapshot, repeat)


if __name__ == "__main__":
    unittest.main()
