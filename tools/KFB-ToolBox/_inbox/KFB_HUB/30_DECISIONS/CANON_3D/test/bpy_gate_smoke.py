import sys, bpy
import os; sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib'))
import kfb_env_bpy
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.mesh.primitive_grid_add(x_subdivisions=20, y_subdivisions=20, size=20); g = bpy.context.object; g['kfb_ground'] = 'terrain'
for v in g.data.vertices: v.co.z = 0.4 * (v.co.x / 10) ** 2
bpy.ops.mesh.primitive_cylinder_add(radius=3, depth=0.3, location=(0, 0, 0.15)); disc = bpy.context.object
for i in range(5):
    bpy.ops.mesh.primitive_cube_add(size=0.5, location=(i - 2, 0, 0.55)); c = bpy.context.object
    c['kfb_kind'] = 'prop'; c['kfb_role'] = 'prop'; c['kfb_group'] = 'g1'
res = kfb_env_bpy.run(scene_kind='diorama', raise_on_fail=False)
print('GATE_OK', res['ok']); print('\n'.join(res['fail'][:12]))
