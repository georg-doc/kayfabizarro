# WSB B7 · Wie weit schwebt die Unterseite? Strahlen von unten nach oben im Raster über die Grundfläche → Höhe der untersten Fläche je Punkt.
# Usage: blender -b --factory-startup --python b7_ground_gap.py -- <A_v3.glb> <scale_m_per_u>
import bpy, sys, json, numpy as np
from mathutils import Vector
from mathutils.bvhtree import BVHTree
src, S = sys.argv[sys.argv.index('--') + 1:][:2]; S = float(S)
bpy.ops.wm.read_factory_settings(use_empty=True); bpy.ops.import_scene.gltf(filepath=src)
ob = [o for o in bpy.context.scene.objects if o.type == 'MESH'][0]; dg = bpy.context.evaluated_depsgraph_get(); bvh = BVHTree.FromObject(ob, dg)
Mw = ob.matrix_world; co = np.array([list(Mw @ v.co) for v in ob.data.vertices]); mn, mx = co.min(0), co.max(0)
H = []
for x in np.linspace(mn[0], mx[0], 120):
    for y in np.linspace(mn[1], mx[1], 120):
        h = bvh.ray_cast(Mw.inverted() @ Vector((x, y, mn[2] - 0.01)), Vector((0, 0, 1)), 0.3)
        if h[0] is not None: H.append((Mw @ h[0]).z - mn[2])
H = np.array(H); q = np.percentile(H, [5, 25, 50, 75]) * S
print('GAP', json.dumps({'hits': len(H), 'p5_m': round(q[0], 3), 'p25_m': round(q[1], 3), 'median_m': round(q[2], 3), 'p75_m': round(q[3], 3),
      'share_within_5cm': round(float((H * S < 0.05).mean()), 3), 'share_within_15cm': round(float((H * S < 0.15).mean()), 3)}))
