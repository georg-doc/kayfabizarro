#!/usr/bin/env python3
"""
KFB KayKit Platformer — source-only material/UV/triangle zone scanner.

Usage after owner-approved FREE/EXTRA binary intake:
  python3 KAYKIT_PLATFORMER_R7_OFFLINE_MATERIAL_ZONE_SCANNER.py \
      --root /asset-intake/KayKit_Platformer_Pack_1.0_EXTRA/Assets/gltf \
      --out /tmp/kfb-platformer-material-zones.json
  # Optional real RGB atlas sampling:
  python3 -m pip install Pillow
  python3 KAYKIT_PLATFORMER_R7_OFFLINE_MATERIAL_ZONE_SCANNER.py ... --sample-colors

Requires Python 3.10+. Pillow is optional for sampled atlas colors. NO uploads,
asset mutations, shader generation, runtime edits or private link publication.
This scanner reports *candidates*, never approved material-mask/port geometry.
"""
import argparse
import collections
import hashlib
import json
import math
from pathlib import Path
import struct
import sys

TYPE_SIZE = {"SCALAR": 1, "VEC2": 2, "VEC3": 3, "VEC4": 4,
             "MAT2": 4, "MAT3": 9, "MAT4": 16}
FMT = {5120: "b", 5121: "B", 5122: "h", 5123: "H", 5125: "I", 5126: "f"}

def sha(path):
    h = hashlib.sha256()
    with path.open("rb") as f:
        for block in iter(lambda: f.read(1048576), b""):
            h.update(block)
    return h.hexdigest()

def accessor_values(doc, asset_dir, accessor_idx, buf_cache):
    a = doc["accessors"][accessor_idx]
    if a.get("sparse"):
        raise ValueError("sparse accessor requires dedicated source parser")
    if a.get("bufferView") is None:
        raise ValueError("accessor without bufferView")
    view = doc["bufferViews"][a["bufferView"]]
    bdef = doc["buffers"][view["buffer"]]
    uri = bdef.get("uri")
    if not uri or uri.startswith("data:") or "://" in uri or ".." in Path(uri).parts:
        raise ValueError("unsupported/unsafe buffer URI")
    buf_path = asset_dir / uri
    if uri not in buf_cache:
        buf_cache[uri] = buf_path.read_bytes()
    raw = buf_cache[uri]
    count = int(a["count"])
    width = TYPE_SIZE[a["type"]]
    format_char = FMT[a["componentType"]]
    fmt = "<" + format_char * width
    item_bytes = struct.calcsize(fmt)
    stride = int(view.get("byteStride", item_bytes))
    if stride < item_bytes:
        raise ValueError("invalid buffer byteStride")
    start = int(view.get("byteOffset", 0)) + int(a.get("byteOffset", 0))
    result = []
    for n in range(count):
        offset = start + n * stride
        if offset + item_bytes > len(raw):
            raise ValueError("truncated binary accessor")
        result.append(struct.unpack_from(fmt, raw, offset))
    return result

def rgb_bucket(rgb):
    return tuple(min(255, (int(v) // 32) * 32) for v in rgb[:3])

def triangle_up_class(a, b, c):
    ux, uy, uz = (b[i] - a[i] for i in range(3))
    vx, vy, vz = (c[i] - a[i] for i in range(3))
    nx = uy * vz - uz * vy
    ny = uz * vx - ux * vz
    nz = ux * vy - uy * vx
    norm = math.sqrt(nx * nx + ny * ny + nz * nz)
    if norm < 1e-9:
        return "degenerate"
    y = ny / norm
    return "upper" if y > 0.75 else ("lower" if y < -0.75 else "side_or_slope")

def classify_primitive(doc, mesh, primitive, asset_dir, cache, sample_colors, sample_max):
    mat_index = primitive.get("material")
    mat = doc.get("materials", [])[mat_index] if mat_index is not None else {}
    pbr = mat.get("pbrMetallicRoughness", {})
    tex_index = pbr.get("baseColorTexture", {}).get("index")
    image_uri = None
    if tex_index is not None:
        texture = doc.get("textures", [])[tex_index]
        source_index = texture.get("source")
        if source_index is not None:
            image_uri = doc.get("images", [])[source_index].get("uri")
    result = {
        "mesh": mesh.get("name"), "materialIndex": mat_index,
        "materialName": mat.get("name"), "materialBaseTexture": image_uri,
        "materialBaseColorFactor": pbr.get("baseColorFactor", [1, 1, 1, 1]),
        "metallic": pbr.get("metallicFactor", 1),
        "roughness": pbr.get("roughnessFactor", 1),
        "attrs": list(primitive.get("attributes", {}).keys()),
        "faceNormalFrame": "UNTRANSFORMED_MESH_LOCAL_ONLY",
        "trianglesSampled": 0, "sampledZones": [],
        "warnings": []
    }
    attr = primitive.get("attributes", {})
    if "POSITION" not in attr or "TEXCOORD_0" not in attr:
        result["warnings"].append("missing UV0 or POSITION")
        return result
    pos = accessor_values(doc, asset_dir, attr["POSITION"], cache)
    uv = accessor_values(doc, asset_dir, attr["TEXCOORD_0"], cache)
    inds = ([int(x[0]) for x in accessor_values(doc, asset_dir, primitive["indices"], cache)]
            if "indices" in primitive else list(range(len(pos))))
    if primitive.get("mode", 4) != 4:
        result["warnings"].append("non-TRIANGLES primitive mode")
        return result
    image = None
    if sample_colors and image_uri:
        if "://" in image_uri or ".." in Path(image_uri).parts or image_uri.startswith("data:"):
            raise ValueError("unsafe image URI")
        try:
            from PIL import Image
            with Image.open(asset_dir / image_uri) as im:
                image = im.convert("RGB")
        except (ImportError, OSError) as exc:
            result["warnings"].append("cannot sample atlas PNG: " + str(exc))
    n_tri = len(inds) // 3
    step = max(1, math.ceil(n_tri / sample_max))
    zone_counts = collections.Counter()
    for ti in range(0, n_tri, step):
        ia, ib, ic = inds[ti*3:ti*3+3]
        if max(ia, ib, ic) >= len(pos) or max(ia, ib, ic) >= len(uv):
            raise ValueError("out-of-range triangle index")
        orientation = triangle_up_class(pos[ia], pos[ib], pos[ic])
        tag = "NO_PIXEL_SAMPLE"
        if image:
            tu = sum(uv[k][0] for k in (ia, ib, ic)) / 3
            tv = sum(uv[k][1] for k in (ia, ib, ic)) / 3
            # glTF UV V is bottom-up relative to a top-left PIL bitmap.
            xx = min(image.width - 1, int((tu % 1.0) * image.width))
            yy = min(image.height - 1, int((1 - tv % 1.0) * image.height))
            tag = "#%02x%02x%02x" % rgb_bucket(image.getpixel((xx, yy)))
        zone_counts[(orientation, tag)] += 1
        result["trianglesSampled"] += 1
    result["sampledZones"] = [
        {"meshLocalFace": ori, "atlasRgbBucket": rgb, "trianglesSampled": cnt}
        for (ori, rgb), cnt in zone_counts.most_common(24)
    ]
    if n_tri > sample_max:
        result["warnings"].append("triangle sampling subsampled, not full zone coverage")
    if image:
        image.close()
    return result

def scan_one(path, root, sample_colors, max_triangles):
    d = json.loads(path.read_text("utf-8-sig"))
    cache = {}
    out = {
        "sourceRelative": str(path.relative_to(root)), "sha256": sha(path),
        "sourceGLTFVersion": d.get("asset", {}).get("version"),
        "sceneNodes": [{"name": n.get("name"), "mesh": n.get("mesh"),
                        "children": n.get("children", []),
                        "translation": n.get("translation"), "rotation": n.get("rotation")}
                       for n in d.get("nodes", [])],
        "materials": [], "primitives": [],
        "warnings": ["SOURCE ZONE CANDIDATES ONLY; mesh-local normals ignore node transforms"]
    }
    for i, mat in enumerate(d.get("materials", [])):
        pbr = mat.get("pbrMetallicRoughness", {})
        out["materials"].append({"index": i, "name": mat.get("name"),
                                 "baseTextureIndex": pbr.get("baseColorTexture", {}).get("index"),
                                 "metallic": pbr.get("metallicFactor", 1),
                                 "roughness": pbr.get("roughnessFactor", 1)})
    for mesh in d.get("meshes", []):
        for primitive in mesh.get("primitives", []):
            out["primitives"].append(classify_primitive(
                d, mesh, primitive, path.parent, cache, sample_colors, max_triangles))
    out["bufferSha256"] = {
        uri: sha(path.parent / uri)
        for uri in cache if (path.parent / uri).is_file()
    }
    return out

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--root", required=True, type=Path)
    p.add_argument("--out", required=True, type=Path)
    p.add_argument("--sample-colors", action="store_true",
                   help="Requires Pillow; use original local atlas PNG")
    p.add_argument("--max-triangles", type=int, default=1800)
    args = p.parse_args()
    if args.max_triangles < 1:
        p.error("--max-triangles must be positive")
    files = sorted(args.root.rglob("*.gltf"))
    if not files:
        p.error("no GLTF files under --root")
    all_rows, errors = [], []
    for file in files:
        try:
            all_rows.append(scan_one(file, args.root, args.sample_colors, args.max_triangles))
        except (OSError, ValueError, KeyError, IndexError, struct.error) as exc:
            errors.append({"sourceRelative": str(file.relative_to(args.root)), "error": str(exc)})
    report = {
        "schema": "kfb.kaykit.platformer.material-zone-offline-scan/0.1",
        "parsedFileCount": len(all_rows),
        "sourceGLTFSeen": len(files),
        "errors": errors, "colorSampleEnabled": args.sample_colors,
        "sourceTruth": "mesh-local UV and triangle sample, NOT measured world contact",
        "requires": ["original source GLTF/BIN/PNG bytes",
                     "independent 3D material-mask and collider proof"],
        "files": all_rows
    }
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(f"material scan: {len(all_rows)}/{len(files)} files, {len(errors)} errors -> {args.out}")
    return 1 if errors else 0

if __name__ == "__main__":
    sys.exit(main())
