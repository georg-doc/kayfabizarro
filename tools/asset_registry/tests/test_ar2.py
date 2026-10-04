import importlib.util
import json
import struct
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def load(name):
    spec = importlib.util.spec_from_file_location(name, ROOT / f"{name}.py")
    mod = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(mod)
    return mod


packs = load("packs")
deps = load("dependencies")


def record(path, fmt="gltf"):
    return {
        "assetId": path,
        "name": Path(path).stem,
        "path": path,
        "root": "media/3D_Assets",
        "folder": str(Path(path).parent).replace("\\", "/"),
        "kind": "model-3d",
        "format": fmt,
        "sizeBytes": 1,
        "source": {"repo": "x/y", "commit": "abc", "blobSha": "x", "rawLatest": "", "rawPinned": ""},
        "provenance": {"identity": "repo-exact", "kind": "generated-structural"},
    }


def glb_bytes(doc):
    payload = json.dumps(doc, separators=(",", ":")).encode("utf-8")
    payload += b" " * ((4 - len(payload) % 4) % 4)
    chunk = struct.pack("<II", len(payload), 0x4E4F534A) + payload
    total = 12 + len(chunk)
    return b"glTF" + struct.pack("<II", 2, total) + chunk


class PackTests(unittest.TestCase):
    def test_mystery_series_pack_and_collection_are_structural(self):
        rows = [
            record("media/3D_Assets/KayKit_Mystery_Series6/12 - June 2026 - Farmers/Farmer_A.glb", "glb"),
            record("media/3D_Assets/KayKit_Mystery_Series6/Animations serie 4/gltf/Rig_Medium/a.glb", "glb"),
        ]
        meta = packs.assign_packs(rows, ["media/2D_Assets", "media/3D_Assets"], {})
        self.assertIn("kaykit-mystery-series6", meta)
        self.assertEqual(rows[0]["packId"], "kaykit-mystery-series6")
        self.assertEqual(rows[0]["collectionPath"], "12 - June 2026 - Farmers")
        self.assertEqual(rows[1]["collectionPath"], "Animations serie 4")
        self.assertEqual(meta["kaykit-mystery-series6"]["assetCount"], 2)


class DependencyTests(unittest.TestCase):
    def test_gltf_resolves_buffer_texture_case_mismatch_and_outside_pack(self):
        with tempfile.TemporaryDirectory() as td:
            repo = Path(td)
            model_path = "media/3D_Assets/PackA/gltf/model.gltf"
            (repo / model_path).parent.mkdir(parents=True)
            (repo / model_path).write_text(json.dumps({
                "asset": {"version": "2.0"},
                "buffers": [{"uri": "mesh.bin", "byteLength": 1}],
                "images": [{"uri": "Texture.PNG"}, {"uri": "../../Shared/shared.png"}],
            }))
            for rel in [
                "media/3D_Assets/PackA/gltf/mesh.bin",
                "media/3D_Assets/PackA/gltf/texture.png",
                "media/3D_Assets/Shared/shared.png",
            ]:
                p = repo / rel
                p.parent.mkdir(parents=True, exist_ok=True)
                p.write_bytes(b"x")
            rec = record(model_path, "gltf")
            packs.assign_packs([rec], ["media/3D_Assets"], {})
            tracked = {model_path, "media/3D_Assets/PackA/gltf/mesh.bin", "media/3D_Assets/PackA/gltf/texture.png", "media/3D_Assets/Shared/shared.png"}
            from collections import defaultdict
            cm = defaultdict(list)
            for p in tracked:
                cm[p.casefold()].append(p)
            out, problems = deps.resolve_model_dependencies(repo, rec, tracked_paths=tracked, case_map=cm, overrides={})
            self.assertEqual(out["dependencyStatus"], "complete")
            types = [p["type"] for p in problems]
            self.assertIn("CASE_MISMATCH", types)
            self.assertIn("OUTSIDE_PACK_REFERENCE", types)
            self.assertEqual(len(out["relations"]["dependencies"]), 3)

    def test_glb_embedded_status(self):
        with tempfile.TemporaryDirectory() as td:
            repo = Path(td)
            path = "media/3D_Assets/Pack/self.glb"
            p = repo / path
            p.parent.mkdir(parents=True)
            p.write_bytes(glb_bytes({"asset": {"version": "2.0"}, "buffers": [{"byteLength": 4}], "images": [{"bufferView": 0, "mimeType": "image/png"}]}))
            rec = record(path, "glb")
            packs.assign_packs([rec], ["media/3D_Assets"], {})
            from collections import defaultdict
            cm = defaultdict(list)
            cm[path.casefold()].append(path)
            out, problems = deps.resolve_model_dependencies(repo, rec, tracked_paths={path}, case_map=cm, overrides={})
            self.assertEqual(out["dependencyStatus"], "embedded")
            self.assertEqual(problems, [])

    def test_obj_resolves_mtl_and_texture(self):
        with tempfile.TemporaryDirectory() as td:
            repo = Path(td)
            obj = "media/3D_Assets/Pack/model.obj"
            mtl = "media/3D_Assets/Pack/model.mtl"
            tex = "media/3D_Assets/Pack/Textures/diffuse.png"
            for rel, data in [(obj, "mtllib model.mtl\nv 0 0 0\n"), (mtl, "newmtl x\nmap_Kd Textures/diffuse.png\n")]:
                p = repo / rel
                p.parent.mkdir(parents=True, exist_ok=True)
                p.write_text(data)
            p = repo / tex
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_bytes(b"png")
            rec = record(obj, "obj")
            packs.assign_packs([rec], ["media/3D_Assets"], {})
            tracked = {obj, mtl, tex}
            from collections import defaultdict
            cm = defaultdict(list)
            for p in tracked:
                cm[p.casefold()].append(p)
            out, problems = deps.resolve_model_dependencies(repo, rec, tracked_paths=tracked, case_map=cm, overrides={})
            self.assertEqual(out["dependencyStatus"], "complete")
            self.assertEqual(sorted(d["role"] for d in out["relations"]["dependencies"]), ["baseColor", "material"])
            self.assertEqual(problems, [])

    def test_fbx_is_explicitly_unresolved(self):
        with tempfile.TemporaryDirectory() as td:
            repo = Path(td)
            path = "media/3D_Assets/Pack/model.fbx"
            p = repo / path
            p.parent.mkdir(parents=True)
            p.write_bytes(b"fbx")
            rec = record(path, "fbx")
            packs.assign_packs([rec], ["media/3D_Assets"], {})
            from collections import defaultdict
            cm = defaultdict(list)
            cm[path.casefold()].append(path)
            out, problems = deps.resolve_model_dependencies(repo, rec, tracked_paths={path}, case_map=cm, overrides={})
            self.assertEqual(out["dependencyStatus"], "unresolved")
            self.assertEqual(problems[0]["type"], "UNRESOLVED_FBX_DEPENDENCY")

    def test_missing_reference_is_named_not_hidden(self):
        with tempfile.TemporaryDirectory() as td:
            repo = Path(td)
            path = "media/3D_Assets/Pack/model.gltf"
            p = repo / path
            p.parent.mkdir(parents=True)
            p.write_text(json.dumps({"asset": {"version": "2.0"}, "images": [{"uri": "missing.png"}]}))
            rec = record(path, "gltf")
            packs.assign_packs([rec], ["media/3D_Assets"], {})
            from collections import defaultdict
            cm = defaultdict(list)
            cm[path.casefold()].append(path)
            out, problems = deps.resolve_model_dependencies(repo, rec, tracked_paths={path}, case_map=cm, overrides={})
            self.assertEqual(out["dependencyStatus"], "missing")
            self.assertEqual(problems[0]["type"], "MISSING_REFERENCED_FILE")


if __name__ == "__main__":
    unittest.main()
