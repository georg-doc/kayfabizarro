"""S3 · clearance of the core track body against the Uni-Center scenery (independent BVH check in Blender).
Hard obstacles only: core tower, wing decks, columns. Slabs are supporting surfaces (road on ground / roof)."""
import bpy
from mathutils.bvhtree import BVHTree
dg = bpy.context.evaluated_depsgraph_get()
hard = [o for o in bpy.data.collections['S3_UNICENTER_SCENERY'].objects if o.get('kfb_td02_role') in ('core', 'wing_deck', 'columns')]
trees = []
for o in hard:
    me = o.evaluated_get(dg).to_mesh()
    trees.append((o.name, BVHTree.FromPolygons([o.matrix_world @ v.co for v in me.vertices], [tuple(p.vertices) for p in me.polygons])))
    o.evaluated_get(dg).to_mesh_clear()
body = [o for o in bpy.data.objects if o.name.startswith('TC_') and o.name.endswith('_body')]
worst = (1e9, None, None)
for b in body:
    for v in b.data.vertices:
        p = b.matrix_world @ v.co
        for nm, t in trees:
            hit = t.find_nearest(p, 20.0)
            if hit[0] is not None and hit[3] < worst[0]:
                worst = (hit[3], nm, tuple(round(c, 1) for c in p))
result = dict(min_clear_m=round(worst[0], 3), nearest=worst[1], at=worst[2], obstacles=[o.name for o in hard])
