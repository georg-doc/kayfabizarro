#!/usr/bin/env python3
"""KFB room manifest -> Blender scene.

Run by Blender, not system Python:
  blender --background --python build_room_from_manifest.py -- manifest.json --output room.blend --render review.png

The browser/room recipe is the layout owner. This script only imports registered source assets
and applies the exported world transforms.
"""
import argparse
import json
import math
import os
from pathlib import Path
import sys
import urllib.parse
import urllib.request

import bpy
from mathutils import Matrix, Vector


def log(msg):
    print(f"[KFB_BLENDER] {msg}", flush=True)


def parse_args():
    argv = sys.argv
    argv = argv[argv.index("--") + 1:] if "--" in argv else []
    p = argparse.ArgumentParser()
    p.add_argument("manifest")
    p.add_argument("--output", required=True)
    p.add_argument("--render")
    p.add_argument("--export-glb")
    p.add_argument("--cache")
    return p.parse_args(argv)


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for datablocks in (bpy.data.meshes, bpy.data.curves, bpy.data.materials, bpy.data.images,
                       bpy.data.cameras, bpy.data.lights):
        for block in list(datablocks):
            if block.users == 0:
                datablocks.remove(block)


def safe_target(root: Path, relative_uri: str) -> Path:
    decoded = urllib.parse.unquote(relative_uri).replace("\\", "/")
    target = (root / decoded).resolve()
    root_resolved = root.resolve()
    if root_resolved not in target.parents and target != root_resolved:
        raise RuntimeError(f"dependency escapes cache root: {relative_uri}")
    return target


def fetch(url: str, target: Path):
    if target.exists() and target.stat().st_size > 0:
        return
    target.parent.mkdir(parents=True, exist_ok=True)
    log(f"download {url}")
    urllib.request.urlretrieve(url, target)


def fetch_asset(pack: str, name: str, src: dict, cache_root: Path) -> Path:
    base = src["base"]
    ext = src.get("ext", ".gltf")
    pack_root = cache_root / pack
    source_dir = pack_root / "source"
    source_dir.mkdir(parents=True, exist_ok=True)
    filename = urllib.parse.quote(name, safe="") + ext
    url = base + filename
    local = source_dir / (name + ext)
    fetch(url, local)
    if ext.lower() != ".gltf":
        return local

    data = json.loads(local.read_text(encoding="utf-8"))
    uris = []
    for entry in data.get("buffers", []):
        if entry.get("uri"):
            uris.append(entry["uri"])
    for entry in data.get("images", []):
        if entry.get("uri") and not entry["uri"].startswith("data:"):
            uris.append(entry["uri"])

    for uri in sorted(set(uris)):
        dep_url = urllib.parse.urljoin(url, urllib.parse.quote(uri, safe="/:@%?=&"))
        dep_target = safe_target(source_dir, uri)
        fetch(dep_url, dep_target)
    return local


def three_matrix_to_blender(elements):
    if len(elements) != 16:
        raise ValueError("matrixWorldThree must contain 16 values")
    m = Matrix((
        (elements[0], elements[4], elements[8], elements[12]),
        (elements[1], elements[5], elements[9], elements[13]),
        (elements[2], elements[6], elements[10], elements[14]),
        (elements[3], elements[7], elements[11], elements[15]),
    ))
    # Three/glTF: X right, Y up, Z; Blender: X right, Z up, -Y corresponds to +Z source.
    c = Matrix(((1, 0, 0, 0), (0, 0, -1, 0), (0, 1, 0, 0), (0, 0, 0, 1)))
    return c @ m @ c.inverted()


def import_instance(rec, asset_sources, cache_root, room_collection):
    pack = rec["pack"]
    name = rec["name"]
    if pack not in asset_sources:
        raise KeyError(f"manifest has no assetSources entry for pack {pack!r}")
    path = fetch_asset(pack, name, asset_sources[pack], cache_root)

    before = {o.name for o in bpy.data.objects}
    bpy.ops.import_scene.gltf(filepath=str(path))
    imported = [o for o in bpy.data.objects if o.name not in before]
    imported_set = set(imported)
    roots = [o for o in imported if o.parent not in imported_set]

    anchor = bpy.data.objects.new(f"KFB_{rec['index']:03d}_{pack}_{name}", None)
    room_collection.objects.link(anchor)
    anchor.empty_display_type = "PLAIN_AXES"
    anchor["kfb_asset"] = rec["asset"]
    anchor["kfb_layer"] = rec.get("layer") or ""
    anchor["kfb_group"] = rec.get("group") or ""

    for obj in roots:
        world = obj.matrix_world.copy()
        obj.parent = anchor
        obj.matrix_world = world

    anchor.matrix_world = three_matrix_to_blender(rec["matrixWorldThree"])
    return anchor, imported


def scene_bounds():
    bpy.context.view_layer.update()
    pts = []
    for obj in bpy.context.scene.objects:
        if obj.type != "MESH" or not obj.visible_get():
            continue
        pts.extend(obj.matrix_world @ Vector(c) for c in obj.bound_box)
    if not pts:
        return None
    mn = [min(p[i] for p in pts) for i in range(3)]
    mx = [max(p[i] for p in pts) for i in range(3)]
    return mn, mx


def add_camera(manifest):
    cam_data = bpy.data.cameras.new("KFB_Production_Camera")
    cam = bpy.data.objects.new("KFB_Production_Camera", cam_data)
    bpy.context.scene.collection.objects.link(cam)
    cam.matrix_world = three_matrix_to_blender(manifest["camera"]["matrixWorldThree"])
    cam_data.sensor_fit = "VERTICAL"
    cam_data.angle = math.radians(float(manifest["camera"]["verticalFovDegrees"]))
    bpy.context.scene.camera = cam
    return cam


def add_review_lighting(bounds):
    world = bpy.context.scene.world or bpy.data.worlds.new("KFB_World")
    bpy.context.scene.world = world
    world.use_nodes = True
    bg = world.node_tree.nodes.get("Background")
    bg.inputs["Color"].default_value = (0.025, 0.018, 0.04, 1)
    bg.inputs["Strength"].default_value = 0.35

    if bounds:
        mn, mx = bounds
        c = [(mn[i] + mx[i]) * 0.5 for i in range(3)]
        span = max(mx[i] - mn[i] for i in range(3))
    else:
        c, span = [0, 0, 0], 12

    key_data = bpy.data.lights.new("KFB_Key", type="AREA")
    key_data.energy = 1100
    key_data.shape = "DISK"
    key_data.size = max(4.0, span * 0.75)
    key = bpy.data.objects.new("KFB_Key", key_data)
    bpy.context.scene.collection.objects.link(key)
    key.location = (c[0] - span * 0.55, c[1] - span * 0.35, c[2] + span * 1.25)

    fill_data = bpy.data.lights.new("KFB_Fill", type="AREA")
    fill_data.energy = 450
    fill_data.size = max(3.0, span * 0.5)
    fill = bpy.data.objects.new("KFB_Fill", fill_data)
    bpy.context.scene.collection.objects.link(fill)
    fill.location = (c[0] + span * 0.7, c[1] + span * 0.45, c[2] + span * 0.65)


def configure_render():
    scene = bpy.context.scene
    try:
        scene.render.engine = "BLENDER_EEVEE_NEXT"
    except Exception:
        pass
    scene.render.resolution_x = 1280
    scene.render.resolution_y = 720
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.film_transparent = False


def main():
    args = parse_args()
    manifest_path = Path(args.manifest).expanduser().resolve()
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    if manifest.get("schema") != "kfb.blender-room-manifest.v1":
        raise RuntimeError(f"unsupported manifest schema: {manifest.get('schema')}")

    output = Path(args.output).expanduser().resolve()
    output.parent.mkdir(parents=True, exist_ok=True)
    cache_root = Path(args.cache).expanduser().resolve() if args.cache else output.parent / "_asset_cache"

    clear_scene()
    room_collection = bpy.data.collections.new(f"KFB_ROOM_{manifest.get('room', {}).get('id') or 'room'}")
    bpy.context.scene.collection.children.link(room_collection)

    imported_count = 0
    for rec in manifest.get("instances", []):
        _, imported = import_instance(rec, manifest["assetSources"], cache_root, room_collection)
        imported_count += len(imported)

    add_camera(manifest)
    bounds = scene_bounds()
    add_review_lighting(bounds)
    configure_render()

    bpy.ops.wm.save_as_mainfile(filepath=str(output))
    log(f"instances={len(manifest.get('instances', []))} importedObjects={imported_count}")
    log(f"blend={output}")

    if args.render:
        render = Path(args.render).expanduser().resolve()
        render.parent.mkdir(parents=True, exist_ok=True)
        bpy.context.scene.render.filepath = str(render)
        bpy.ops.render.render(write_still=True)
        log(f"render={render}")

    if args.export_glb:
        glb = Path(args.export_glb).expanduser().resolve()
        glb.parent.mkdir(parents=True, exist_ok=True)
        bpy.ops.export_scene.gltf(filepath=str(glb), export_format="GLB", use_selection=False)
        log(f"glb={glb}")


if __name__ == "__main__":
    main()
