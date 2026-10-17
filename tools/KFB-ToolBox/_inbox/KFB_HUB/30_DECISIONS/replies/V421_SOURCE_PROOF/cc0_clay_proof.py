#!/usr/bin/env python3
"""V-421: Download CC0 3D sources and render originals in isolation; no invented clay.
Research proof only; no KFB runtime, no generated substitute geometry, no pseudo clay and no preview overlays.
Run: python cc0_clay_proof.py fetch
     blender -b --factory-startup --disable-autoexec --python cc0_clay_proof.py -- render
"""
import hashlib
import json
import os
from pathlib import Path
import sys
import urllib.request
import zipfile

ROOT = Path(os.environ.get("V421_PROOF_DIR", "v421-proof"))
SOURCES = [
    {
        "id": "stonehenge_oga_cc0",
        "source_page": "https://opengameart.org/node/30878",
        "download_url": "https://opengameart.org/sites/default/files/Stonehenge.zip",
        "creator": "eugeneloza",
        "license": "CC0-1.0",
        "kind": "monument_source",
        "selection_hints": ["stonehenge", "stone"],
    },
    {
        "id": "kenney_castle_cc0",
        "source_page": "https://opengameart.org/content/castle-kit",
        "download_url": "https://opengameart.org/sites/default/files/kenney_castle-kit.zip",
        "creator": "Kenney",
        "license": "CC0-1.0",
        "kind": "construction_donor_not_neuschwanstein",
        "selection_hints": ["tower", "castle"],
    },
    {
        "id": "chichen_el_castillo_oga_cc0",
        "source_page": "https://opengameart.org/content/chichen-itza-el-castillo",
        "download_url": "https://opengameart.org/sites/default/files/chichenitza.zip",
        "creator": "Esteban Lopez (elopez7)",
        "license": "CC0-1.0",
        "kind": "monument_source_el_castillo_not_ballcourt",
        "selection_hints": ["castillo", "chichen", "pyramid", "temple"],
    },
    {
        "id": "modular_temple_fertile_cc0",
        "source_page": "https://opengameart.org/content/modular-temple-3d-models",
        "download_url": "https://opengameart.org/sites/default/files/modular_temple_collection.zip",
        "creator": "Keith at Fertile Soil Productions",
        "license": "CC0-1.0",
        "kind": "construction_donor_not_ur_not_borobudur",
        "selection_hints": ["column", "pillar", "stair", "temple"],
    },
    {
        "id": "simple_castle_titanium_cc0",
        "source_page": "https://opengameart.org/content/simple-castle",
        "download_url": "https://opengameart.org/sites/default/files/SimpleCastle.blend",
        "file_name": "SimpleCastle.blend",
        "creator": "TitaniumFalcon",
        "license": "CC0-1.0",
        "kind": "construction_donor_not_neuschwanstein",
        "selection_hints": ["castle", "simple"],
    },
]
EXTS = {".blend", ".blend1", ".glb", ".gltf", ".obj", ".fbx"}
# Prefer inspectable interchange sources to accidental archive backups.
PREFERRED = {".glb": 0, ".obj": 1, ".gltf": 2, ".blend": 3, ".blend1": 3, ".fbx": 4}


def sha256(path):
    digest = hashlib.sha256()
    with open(path, "rb") as f:
        for block in iter(lambda: f.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def write_json(path, payload):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False, sort_keys=True) + "\n")


def fetch():
    """Fetch original files, record exact archive hashes and manifests. Fail closed."""
    ROOT.mkdir(parents=True, exist_ok=True)
    summary = {"schema": "kfb.landmark.source-isolation/1", "sources": [], "gate": "FAIL_CLOSED"}
    for source in SOURCES:
        folder = ROOT / source["id"]
        folder.mkdir(parents=True, exist_ok=True)
        audit = {k: v for k, v in source.items() if k != "selection_hints"}
        audit.update({"state": "DOWNLOAD_FAILED", "files": [], "preview_status": "NOT_RENDERED"})
        try:
            request = urllib.request.Request(
                source["download_url"],
                headers={"User-Agent": "KFB-source-audit/1.0 (noncommercial source-verification; contact via source page)", "Accept": "application/zip,*/*"},
            )
            is_zip = source["download_url"].lower().split("?")[0].endswith(".zip")
            stored = folder / ("original.zip" if is_zip else source.get("file_name", "source.blend"))
            with urllib.request.urlopen(request, timeout=80) as response:
                with open(stored, "wb") as out:
                    total = 0
                    while True:
                        block = response.read(1024 * 1024)
                        if not block: break
                        total += len(block)
                        if total > 50_000_000:
                            raise ValueError("original file too large for bounded source proof")
                        out.write(block)
            audit["downloadBytes"] = stored.stat().st_size
            audit["downloadSha256"] = sha256(stored)
            audit["downloadKind"] = "zip" if is_zip else "direct_model"
            # Keep legacy audit schema keys but tag whether original is ZIP or direct binary.
            audit["archiveBytes"] = stored.stat().st_size
            audit["archiveSha256"] = sha256(stored)
            if is_zip:
                with zipfile.ZipFile(stored) as zf:
                    items = [i for i in zf.infolist() if not i.is_dir()]
                    if len(items) > 1000: raise ValueError("too many archive members")
                    uncompressed = sum(i.file_size for i in items)
                    if uncompressed > 240_000_000: raise ValueError("uncompressed archive too big")
                    for entry in items:
                        target = (folder / "source" / entry.filename).resolve()
                        if not target.is_relative_to((folder / "source").resolve()):
                            raise ValueError("zip slip path refused")
                        if entry.file_size > 150_000_000:
                            raise ValueError("individual member too big")
                        target.parent.mkdir(parents=True, exist_ok=True)
                        with zf.open(entry) as i, open(target, "wb") as o:
                            import shutil
                            shutil.copyfileobj(i, o)
                        audit["files"].append({"path": entry.filename, "bytes": entry.file_size})
            else:
                target = (folder / "source" / stored.name)
                target.parent.mkdir(parents=True, exist_ok=True)
                import shutil
                shutil.copyfile(stored, target)
                audit["files"].append({"path": stored.name, "bytes": stored.stat().st_size})
            models = [folder / "source" / e["path"] for e in audit["files"] if Path(e["path"]).suffix.lower() in EXTS and not Path(e["path"]).name.startswith(".")]
            def model_score(p):
                name = p.name.lower()
                return (0 if name in ("tower-square.glb", "tower-square.obj") else 1,
                        0 if any(h in name for h in source["selection_hints"]) else 1,
                        1 if "demolished" in name else 0,
                        PREFERRED[p.suffix.lower()], len(p.parts), str(p))
            models.sort(key=model_score)
            audit["formatsDiscovered"] = sorted(set(p.suffix.lower() for p in models))
            audit["meshCandidates"] = len(models)
            if not models:
                raise ValueError("no supported source mesh files in archive")
            chosen = models[0]
            audit["selectedRelativeFile"] = str(chosen.relative_to(folder / "source"))
            audit["selectedSourceSha256"] = sha256(chosen)
            audit["state"] = "ARCHIVE_VERIFIED_MESH_LOCATED"
        except Exception as e:
            audit["state"] = "SOURCE_FAILED"
            audit["error"] = str(e)
        write_json(folder / "audit.json", audit)
        summary["sources"].append(audit)
    write_json(ROOT / "fetch-audit.json", summary)
    if not any(s["state"] == "ARCHIVE_VERIFIED_MESH_LOCATED" for s in summary["sources"]):
        raise SystemExit("No actual source downloaded. No synthetic preview substituted.")


def look_at(obj, target):
    from mathutils import Vector
    direction = Vector(target) - obj.location
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()


def render_one(source):
    import bpy
    from mathutils import Vector
    import math
    folder = ROOT / source["id"]
    audit = json.loads((folder / "audit.json").read_text())
    if audit["state"] != "ARCHIVE_VERIFIED_MESH_LOCATED":
        return audit
    file_path = folder / "source" / audit["selectedRelativeFile"]
    suffix = file_path.suffix.lower()
    bpy.ops.wm.read_factory_settings(use_empty=True)
    if suffix in (".blend", ".blend1"):
        bpy.ops.wm.open_mainfile(filepath=str(file_path.resolve()), load_ui=False)
    elif suffix == ".obj":
        if hasattr(bpy.ops.wm, "obj_import"): bpy.ops.wm.obj_import(filepath=str(file_path.resolve()))
        else: bpy.ops.import_scene.obj(filepath=str(file_path.resolve()))
    elif suffix in (".glb", ".gltf"):
        bpy.ops.import_scene.gltf(filepath=str(file_path.resolve()))
    elif suffix == ".fbx":
        bpy.ops.import_scene.fbx(filepath=str(file_path.resolve()))
    mesh_objs = [o for o in bpy.context.scene.objects if o.type == "MESH" and not o.hide_render]
    if not mesh_objs:
        raise ValueError("no visible mesh found after real source import")
    for obj in mesh_objs:
        obj.data.calc_loop_triangles()
    audit["meshCount"] = len(mesh_objs)
    audit["trianglesMeasured"] = sum(len(o.data.loop_triangles) for o in mesh_objs)
    audit["facePolygonsMeasured"] = sum(len(o.data.polygons) for o in mesh_objs)
    audit["sourceMeshNames"] = [o.name for o in mesh_objs[:80]]
    # Only the real imported geometry is rendered. No built facade, proxy or other model.
    corners = [o.matrix_world @ Vector(c) for o in mesh_objs for c in o.bound_box]
    xyz_min = [min(p[i] for p in corners) for i in range(3)]
    xyz_max = [max(p[i] for p in corners) for i in range(3)]
    center = [(a+b)/2 for a,b in zip(xyz_min, xyz_max)]
    diagonal = max((b-a for a,b in zip(xyz_min, xyz_max)), default=1) or 1
    # Camera target is original source coordinate midpoint; model geometry stays intact.
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    scene.cycles.samples = 12
    if hasattr(scene.cycles, "use_denoising"):
        scene.cycles.use_denoising = False
    if hasattr(bpy.context.view_layer.cycles, "use_denoising"):
        bpy.context.view_layer.cycles.use_denoising = False
    scene.render.resolution_x = 600
    scene.render.resolution_y = 600
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.film_transparent = False
    world = bpy.data.worlds.new("neutral_clay_proof_world")
    world.use_nodes = True
    world.node_tree.nodes.get("Background").inputs["Color"].default_value = (0.72, 0.77, 0.76, 1)
    world.node_tree.nodes.get("Background").inputs["Strength"].default_value = 0.7
    scene.world = world
    cam_data = bpy.data.cameras.new("proof_ortho")
    cam = bpy.data.objects.new("proof_ortho", cam_data)
    scene.collection.objects.link(cam)
    cam.location = (center[0]+diagonal*1.5,center[1]-diagonal*2,center[2]+diagonal*1.35)
    look_at(cam, center)
    cam_data.type = "ORTHO"
    cam_data.ortho_scale = diagonal * 1.95
    scene.camera = cam
    for name, xyz, power in [
        ("Key", (center[0]-diagonal,center[1]-diagonal,center[2]+diagonal*2), 1250),
        ("Fill", (center[0]+diagonal,center[1]+diagonal,center[2]+diagonal*1.2), 750)
    ]:
        light_data = bpy.data.lights.new(name,"AREA")
        light_obj = bpy.data.objects.new(name, light_data)
        scene.collection.objects.link(light_obj)
        light_obj.location = xyz
        light_data.energy = power
        light_data.shape = "DISK"
        light_data.size = diagonal*1.5
        look_at(light_obj,center)
    # First: untouched source materials, source mesh in isolation (camera/lights are presentation only).
    source_png = folder / "source-isolation.png"
    scene.render.filepath = str(source_png.resolve())
    bpy.ops.render.render(write_still=True)
    # V-424: source-only. Fake flat-material clay explicitly rejected.
    audit["state"] = "SOURCE_ISOLATED_ONLY"
    audit["preview_status"] = "SOURCE_ORIGINAL_ONLY_KNETE_FOLGT"
    audit["sourceImageSha256"] = sha256(source_png)
    audit["proofConditions"] = {"source_mesh_kept": True, "no_image_overlays": True,
                                "pseudo_clay_generated": False, "georg_selection_enabled": False}
    write_json(folder / "audit.json", audit)
    return audit


def render():
    outcomes = []
    for source in SOURCES:
        audit_path = ROOT/source["id"]/"audit.json"
        audit = json.loads(audit_path.read_text())
        try:
            audit = render_one(source)
        except Exception as e:
            audit.update({"state": "RENDER_FAILED", "renderError": str(e), "preview_status": "NOT_RENDERED"})
            write_json(audit_path,audit)
        outcomes.append(audit)
    write_json(ROOT/"final-audit.json",{
        "schema":"kfb.landmark.source-isolation/1",
        "sources":outcomes,
        "passed":sum(a["state"]=="SOURCE_ISOLATED_ONLY" for a in outcomes),
        "attempted":len(outcomes),
        "readyForGeorg":False,
        "nextGate":"WS0_SOURCES_VISUAL_REVIEW_AND_RIGHTS_THEN_REMAINING_23",
    })
    if not any(a["state"] == "SOURCE_ISOLATED_AND_CLAY_RENDERED" for a in outcomes):
        raise SystemExit("No original source proof rendered; candidate selection stays disabled.")


if __name__ == "__main__":
    args = sys.argv[sys.argv.index("--")+1:] if "--" in sys.argv else sys.argv[1:]
    if args and args[0] == "fetch": fetch()
    elif args and args[0] == "render": render()
    else: raise SystemExit("Usage: fetch | render")
