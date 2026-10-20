# Test kfb_env_bpy.place() (WSB K3, WS0 20.10.): Kugel und Fels auf einem Hang (20 % Gefälle + Mulde), Einsinken im Band aus kfb_env.SINK,
#   Talseite liegt auf, Gate meldet für beide kein E1/E2. Dazu: Einsinken außerhalb des Bands wird abgewiesen, ohne kfb_ground kein Setzen.
# Usage: blender -b --factory-startup --python test/bpy_place_slope.py
import sys, os, math, bpy
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib'))
import kfb_env, kfb_env_bpy
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.mesh.primitive_grid_add(x_subdivisions=60, y_subdivisions=60, size=20); g = bpy.context.object; g.name = 'hang'
for v in g.data.vertices: v.co.z = 0.2 * v.co.x + 0.15 * math.sin(v.co.y * 0.7)   # 20 % Gefälle in x, leichte Wellen in y
fails = []
try: kfb_env_bpy.place(g, 0, 0, 'rock')
except ValueError as e: print('OK ohne kfb_ground abgewiesen:', e)
else: fails.append('ohne kfb_ground nicht abgewiesen')
g['kfb_ground'] = 'terrain'
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.6, location=(-3, 1, 5)); ball = bpy.context.object; ball.name = 'kugel'
bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=3, radius=1.0, location=(3, -1, 5)); rock = bpy.context.object; rock.name = 'fels'
rock.scale = (1.4, 0.9, 0.7); bpy.ops.object.transform_apply(scale=True)
for i, v in enumerate(rock.data.vertices): v.co *= 1 + 0.12 * math.sin(i * 1.7)   # unregelmäßig
R = [kfb_env_bpy.place(ball, -3, 1, 'stone_M', seed='t1', role='stone', layer=1, group='g1', story='Test: Kugel am Hang'),
     kfb_env_bpy.place(rock, 3, -1, 'rock', rz=30, seed='t1', role='stone', layer=1, group='g1', story='Test: Fels am Hang')]
for r in R:
    lo, hi = r['band']; ok = lo - 1e-6 <= r['sink'] <= hi + 1e-6 and (r['sink'] <= kfb_env.SINK_CAP + 1e-6)
    print('PLACE', r)
    if not ok: fails.append(f"{r['id']}: Einsinken {r['sink']} außerhalb {lo}–{hi}")
    if r['downhill_gap']: fails.append(f"{r['id']}: Talseite frei {r['downhill_gap']}")
try: kfb_env_bpy.place(rock, 3, -1, 'rock', sink=0.7)
except ValueError as e: print('OK Einsinken 0,7 abgewiesen:', e)
else: fails.append('Einsinken 0,7 nicht abgewiesen')
kfb_env_bpy.place(rock, 3, -1, 'rock', rz=30, seed='t1')   # zurück auf die Testlage
res = kfb_env_bpy.run(scene_kind='proof', raise_on_fail=False)
mine = [f for f in res['fail'] if f[:2] in ('E1', 'E2') and ('kugel' in f or 'fels' in f)]
fails += mine
print('GATE E1/E2 für Kugel/Fels:', mine or 'keine')
print('PLACE_TEST', 'PASS' if not fails else 'FAIL', fails)
