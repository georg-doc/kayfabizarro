"""S5 · clearance of the core track body against the Uni-Center scenery (independent BVH check in Blender).
Hard obstacles: core tower, wing decks, columns. Reports the minimum per obstacle and splits column hits into
'support' (the column stands under the deck: nearest column point lies below the body vertex, steeper than 45 deg)
and 'obstacle' (beside or above the track). Slabs are supporting surfaces and are not checked."""
import bpy
from mathutils.bvhtree import BVHTree
SCEN = globals().get('S5_SCENERY', 'S3_UNICENTER_SCENERY')
dg = bpy.context.evaluated_depsgraph_get()
hard = [o for o in bpy.data.collections[SCEN].objects if o.get('kfb_td02_role') in ('core', 'wing_deck', 'columns')]
trees = []
for o in hard:
    me = o.evaluated_get(dg).to_mesh()
    trees.append((o.name, o.get('kfb_td02_role'), BVHTree.FromPolygons([o.matrix_world @ v.co for v in me.vertices], [tuple(p.vertices) for p in me.polygons])))
    o.evaluated_get(dg).to_mesh_clear()
body = [o for o in bpy.data.objects if o.name.startswith('TC_') and o.name.endswith('_body') and not o.hide_get()]
best = {}
for b in body:
    for v in b.data.vertices:
        p = b.matrix_world @ v.co
        for nm, role, t in trees:
            loc, _n, _i, d = t.find_nearest(p, 25.0)
            if loc is None:
                continue
            key = role
            if role == 'columns':
                dz = p.z - loc.z; dh = ((p.x - loc.x) ** 2 + (p.y - loc.y) ** 2) ** 0.5
                key = 'column_support' if dz > 0 and dz >= dh else 'column_obstacle'
            if d < best.get(key, (1e9,))[0]:
                best[key] = (d, nm, tuple(round(c, 1) for c in p))
result = {k: dict(min_clear_m=round(v[0], 3), obstacle=v[1], at_track_vertex=v[2]) for k, v in sorted(best.items())}
result['_bodies'] = [b.name for b in body]
