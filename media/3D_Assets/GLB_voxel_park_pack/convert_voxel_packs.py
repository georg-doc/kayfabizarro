"""KFB voxel pack converter · Claude Coworker 26.09.2026
MagicaVoxel OBJ (+MTL + palette PNG) -> one GLB per model, KFB-ready:
- palette texture kept with NEAREST sampling (Blender 'Closest'), so voxels stay crisp (no palette bleeding);
- origin moved to bottom centre (x/y centre, z = 0) for placement;
- unlit-friendly material: roughness 1, no specular;
- native scale kept (MagicaVoxel export: 0.1 unit per voxel); a suggested KFB scale goes into the manifest;
- manifest JSON per pack: name, category, file, bbox (native), voxel counts, source, licence.
exec with globals: VX_JOBS=[(pack_id, src_dir, out_dir, licence, suggested_scale, [relative obj paths] or None)]
Runs in Georg's open Blender; imports are removed again and orphans purged after each job."""
import bpy, os, json, mathutils

RESULTS = []
for pack_id, src, out, licence, sscale, only in globals().get('VX_JOBS', []):
    os.makedirs(out, exist_ok=True)
    objs = only or sorted(os.path.relpath(os.path.join(d, f), src) for d, _, fs in os.walk(src) for f in fs if f.lower().endswith('.obj'))
    man_path = os.path.join(out, f'{pack_id}.manifest.json')
    man = json.load(open(man_path)) if os.path.exists(man_path) else dict(
        schema='kfb.asset-pack-manifest.v0', pack=pack_id, licence=licence, native_unit='0.1 unit per voxel (MagicaVoxel export)',
        suggested_kfb_scale=sscale, up='+Y (glTF)', origin='bottom centre', sampling='NEAREST (palette texture)', models=[])
    done = {m['file'] for m in man['models']}
    for rel in objs:
        stem = os.path.splitext(os.path.basename(rel))[0]
        cat = os.path.dirname(rel) or 'root'
        rel_out = os.path.join(cat.replace(' ', '_'), stem + '.glb')
        if rel_out in done:
            continue
        before = set(bpy.data.objects)
        bpy.ops.wm.obj_import(filepath=os.path.join(src, rel))
        new = [o for o in bpy.data.objects if o not in before and o.type == 'MESH']
        if not new:
            continue
        if len(new) > 1:
            with bpy.context.temp_override(active_object=new[0], selected_editable_objects=new, selected_objects=new):
                bpy.ops.object.join()
            new = [new[0]]
        o = new[0]
        o.name = stem
        o.data.name = stem
        bpy.context.view_layer.update()
        bb = [o.matrix_world @ mathutils.Vector(v) for v in o.bound_box]
        mn = [min(q[i] for q in bb) for i in range(3)]
        mx = [max(q[i] for q in bb) for i in range(3)]
        shift = mathutils.Vector(((mn[0] + mx[0]) / 2, (mn[1] + mx[1]) / 2, mn[2]))
        o.data.transform(mathutils.Matrix.Translation(-(o.matrix_world.inverted().to_3x3() @ shift)))
        o.location = (0, 0, 0)
        for m in o.data.materials:
            if not m or not m.node_tree:
                continue
            for n in m.node_tree.nodes:
                if n.type == 'TEX_IMAGE':
                    n.interpolation = 'Closest'
                if n.type == 'BSDF_PRINCIPLED':
                    n.inputs['Roughness'].default_value = 1.0
                    if 'Specular IOR Level' in n.inputs:
                        n.inputs['Specular IOR Level'].default_value = 0.0
        dst = os.path.join(out, rel_out)
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        for x in bpy.context.view_layer.objects:
            x.select_set(False)
        o.select_set(True)
        bpy.ops.export_scene.gltf(filepath=dst, export_format='GLB', use_selection=True, export_apply=True, export_yup=True)
        man['models'].append(dict(name=stem, category=cat, file=rel_out, source=rel,
                                  bbox_native=[round(mx[i] - mn[i], 3) for i in range(3)],
                                  tris=sum(len(p.vertices) - 2 for p in o.data.polygons), kb=os.path.getsize(dst) // 1024))
        me = o.data
        mats = list(me.materials)
        bpy.data.objects.remove(o, do_unlink=True)
        bpy.data.meshes.remove(me)
        for m in mats:
            if m and m.users == 0:
                for n in m.node_tree.nodes:
                    if n.type == 'TEX_IMAGE' and n.image and n.image.users <= 1:
                        img = n.image
                        n.image = None
                        bpy.data.images.remove(img)
                bpy.data.materials.remove(m)
    json.dump(man, open(man_path, 'w'), indent=1)
    RESULTS.append((pack_id, len(man['models'])))
