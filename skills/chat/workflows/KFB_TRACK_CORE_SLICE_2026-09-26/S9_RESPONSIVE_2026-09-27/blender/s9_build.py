"""S9 · TN02 responsive tunnels in Blender (preview / oracle). Uses the S8 site script for the track and the tubes
(S8_SRC = the TN02 stream), then adds what is new in S9:
  hall end walls : the flat wall at each end of a junction hall, with the mouths of the tubes that continue from it cut
                   out (boolean with the tubes' own rings, so every mouth has its tube's shape)
  hangar ship    : a Quaternius spaceship (CC0), scaled up, standing on the hangar floor beside the track
Globals: S9_ROOT, S9_STAGE ('new' | 'track' | 'tubes' | 'extras'), S8_SCRIPT (path of s8_tunnel_site.py)."""
import bpy, bmesh, json, gzip, math, os
import numpy as np
from mathutils import Vector, Matrix

KIT = '/Users/georgv.westphalen/Dropbox/CLAUDE/KFB Racetrack Blender Kit/TRACK-CORE/'
ROOT = globals().get('S9_ROOT', KIT + 'S9_RESPONSIVE_2026-09-27/')
STAGE = globals().get('S9_STAGE', 'new')
SRC = ROOT + 'out/tn02.graph.stream.json.gz'
S8 = ROOT + 'blender/s8_tunnel_site.py'


def run_s8(stage):
    g = {'__name__': 's9', 'S8_ROOT': ROOT, 'S8_SRC': SRC, 'S8_STAGE': stage}
    exec(open(S8).read(), g)
    return g


def B(v):
    v = np.asarray(v, dtype=float)
    return np.stack([v[..., 0], -v[..., 2], v[..., 1]], axis=-1)


def extras():
    G = json.load(gzip.open(SRC, 'rt'))
    s8 = {}
    exec(compile(open(S8).read().split("\nresult = {")[0], S8, 'exec'), s8)   # helpers only (no stage run)
    c = s8['coll']('S9_HALL_WALLS')
    out = {'walls': 0, 'mouths': 0}
    routes = G['routes']
    ends = []   # every tube end (route, sample index, ring id) to find the mouths in a hall wall
    for rid, r in routes.items():
        for seg in r.get('tunnels', []):
            if seg.get('kind') == 'hall':
                continue
            for i in (seg['i0'], seg['i1']):
                ends.append((rid, i))
    for rid, r in routes.items():
        S, rings = r['samples'], r['tunnelRings']
        for seg in r.get('tunnels', []):
            if seg.get('kind') != 'hall':
                continue
            for i, sg in ((seg['i0'], -1), (seg['i1'], 1)):
                q = S[i]; P, R, U, T = B(q['p']), B(q['R']), B(q['U']), B(q['T']); tn = q['tunnel']
                outer = s8['outer_ring'](rings[tn['ringId']], tn['wall'])
                wv = [P + R * a + U * b + T * sg * d for d in (0.0, 1.0) for a, b in outer]   # 1 m thick, outside the hall
                n = len(outer)
                wf = [(j, (j + 1) % n, n + (j + 1) % n, n + j) for j in range(n)] + [tuple(range(n))[::-1], tuple(range(n, 2 * n))]
                col = s8['srgb'](s8['HOST'].get(tn['host'], s8['HOST']['earth'])[1])
                wall = s8['mesh_obj'](c, f'S9_hallwall_{rid}_{i}', np.array(wv), wf, [col] * len(wf), 'hall_wall')
                me = wall.data; bm = bmesh.new(); bm.from_mesh(me); bmesh.ops.recalc_face_normals(bm, faces=bm.faces); bm.to_mesh(me); bm.free()
                out['walls'] += 1
                # mouths: tube ends of any route that lie in this wall's plane, inside the hall
                for rj, ij in ends:
                    qj = routes[rj]['samples'][ij]; Pj = B(qj['p'])
                    if abs(np.dot(Pj - P, T)) > 3 or np.linalg.norm(Pj - P) > tn['w'] / 2 + 12:   # the branch lane sits up to a lane + gore beside the axis
                        continue
                    Rj, Uj, Tj = B(qj['R']), B(qj['U']), B(qj['T'])
                    ring = routes[rj]['tunnelRings'][qj['tunnel']['ringId']]
                    cv = [Pj + Rj * a + Uj * b + Tj * d for d in (-6, 6) for a, b in ring]
                    cf = [(j, (j + 1) % n, n + (j + 1) % n, n + j) for j in range(n)] + [tuple(range(n))[::-1], tuple(range(n, 2 * n))]
                    cut = s8['mesh_obj'](c, f'S9_mouthcut_{rid}_{i}_{rj}_{ij}', np.array(cv), cf, [(1, 0, 1, 1)] * len(cf), 'cutter')
                    mc = cut.data; bm = bmesh.new(); bm.from_mesh(mc); bmesh.ops.recalc_face_normals(bm, faces=bm.faces); bm.to_mesh(mc); bm.free()
                    cut.hide_set(True); cut.hide_render = True
                    bo = wall.modifiers.new(f'mouth_{rj}_{ij}', 'BOOLEAN'); bo.operation = 'DIFFERENCE'; bo.object = cut; bo.solver = 'EXACT'
                    out['mouths'] += 1
    # hangar ship: Quaternius Spaceship_FinnTheFrog (CC0), x6, on the hangar floor beside the track
    M = routes['M']; S = M['samples']
    hg = next(t for t in M['tunnels'] if t['host'] == 'hangar'); q = S[(hg['i0'] + hg['i1']) // 2]
    tn = q['tunnel']; P, R, U, T = B(q['p']), B(q['R']), B(q['U']), B(q['T'])
    cs = s8['coll']('S9_HANGAR_SHIP')
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=ROOT + 'assets/Spaceship_FinnTheFrog.gltf')
    new = [o for o in bpy.data.objects if o not in before]
    for o in new:
        for cc in list(o.users_collection):
            cc.objects.unlink(o)
        cs.objects.link(o)
    roots = [o for o in new if o.parent is None]
    bpy.context.view_layer.update()
    vs = [o.matrix_world @ Vector(cn) for o in new if o.type == 'MESH' for cn in o.bound_box]
    lo = Vector((min(v.x for v in vs), min(v.y for v in vs), min(v.z for v in vs))); hi = Vector((max(v.x for v in vs), max(v.y for v in vs), max(v.z for v in vs)))
    ext = hi - lo; k = 72.0 / max(ext.x, ext.y)          # about 72 m long
    floor = P[2] - tn['fill']
    side = tn['w'] / 2 - min(ext.x, ext.y) * k / 2 - 4          # against the far wall, clear of the barrier
    tgt = Vector((P + R * side).tolist()); tgt.z = floor
    ctr = (lo + hi) / 2; base = Vector((ctr.x, ctr.y, lo.z))
    yaw = math.atan2(T[1], T[0])
    A = Matrix.Translation(tgt) @ Matrix.Rotation(yaw + (math.pi / 2 if ext.y > ext.x else 0), 4, 'Z') @ Matrix.Scale(k, 4) @ Matrix.Translation(-base)
    for o in roots:
        o.matrix_world = A @ o.matrix_world
    for o in new:
        if o.type == 'MESH':
            me = o.data
            ca = me.color_attributes.get('paint') or me.color_attributes.new('paint', 'FLOAT_COLOR', 'CORNER')
            cols = [tuple(m.diffuse_color) if m else (0.8, 0.8, 0.8, 1) for m in me.materials] or [(0.8, 0.8, 0.8, 1)]
            data = np.zeros((len(me.loops), 4), dtype=np.float32)
            for poly in me.polygons:
                data[poly.loop_start:poly.loop_start + poly.loop_total] = cols[min(poly.material_index, len(cols) - 1)]
            ca.data.foreach_set('color', data.ravel()); me.color_attributes.active_color = ca
    out.update(ship_scale=round(k, 2), ship_size=[round(x * k, 1) for x in ext], ship_objects=len(new), hangar=[tn['w'], tn['h']])
    return out


if STAGE in ('new', 'track', 'tubes'):
    result = run_s8(STAGE)['result']
else:
    result = extras()
