"""Convert Blender prop matrices (actor space, Z up, actor faces -Y) to kfb.prop-tracks.v2 rows in glTF space.

usage: python3 kfb_prop_tracks_to_gltf.py prop_tracks_blender_<kind>.json out.json asset_prefix

glTF space: Y up, actor faces +Z, actor root at the origin (stand it on the podium top).
For a Blender actor-space matrix Mb of the RAW asset (glTF-native mesh, imported with the Blender glTF importer):
    Mg = C^-1 @ Mb @ C,  C (glTF -> Blender) = (x, -z, y)
Rows: tx, ty, tz, qx, qy, qz, qw, s (uniform scale), one per frame.
"""
import sys, json, numpy as np

C = np.array([[1, 0, 0, 0], [0, 0, -1, 0], [0, 1, 0, 0], [0, 0, 0, 1]], float)
Ci = np.linalg.inv(C)


def m2q(R):
    t = np.trace(R)
    if t > 0:
        s = np.sqrt(t + 1) * 2; w = .25 * s; x = (R[2, 1] - R[1, 2]) / s; y = (R[0, 2] - R[2, 0]) / s; z = (R[1, 0] - R[0, 1]) / s
    elif R[0, 0] > R[1, 1] and R[0, 0] > R[2, 2]:
        s = np.sqrt(1 + R[0, 0] - R[1, 1] - R[2, 2]) * 2; w = (R[2, 1] - R[1, 2]) / s; x = .25 * s; y = (R[0, 1] + R[1, 0]) / s; z = (R[0, 2] + R[2, 0]) / s
    elif R[1, 1] > R[2, 2]:
        s = np.sqrt(1 + R[1, 1] - R[0, 0] - R[2, 2]) * 2; w = (R[0, 2] - R[2, 0]) / s; x = (R[0, 1] + R[1, 0]) / s; y = .25 * s; z = (R[1, 2] + R[2, 1]) / s
    else:
        s = np.sqrt(1 + R[2, 2] - R[0, 0] - R[1, 1]) * 2; w = (R[1, 0] - R[0, 1]) / s; x = (R[0, 2] + R[2, 0]) / s; y = (R[1, 2] + R[2, 1]) / s; z = .25 * s
    q = np.array([x, y, z, w]); return q / np.linalg.norm(q)


def rows(mats):
    out = []
    for m in mats:
        Mg = Ci @ np.array(m).reshape(4, 4) @ C
        s = np.linalg.norm(Mg[:3, 0]); R = Mg[:3, :3] / s
        q = m2q(R)
        out.append([round(float(v), 5) for v in (*Mg[:3, 3], *q, s)])
    return out


def asset_rel(path, prefix):
    if '/' not in path:                              # KayKit clown set (pins, clown ball)
        return 'KayKit_Mystery_Monthly_Series_4/11 - May 2024 - Clown/assets/gltf/' + path + '.gltf'
    i = path.find('3D ASSETS/')
    return (path[i + len('3D ASSETS/'):] if i >= 0 else path) + '.gltf'


if __name__ == '__main__':
    src, dst = sys.argv[1], sys.argv[2]
    d = json.load(open(src))
    clips = {}
    for cid, c in d['clips'].items():
        clips[cid] = dict(frames=c['frames'], loop=c['loop'], next=c['next'], talkWindows=c['talkWindows'],
                          props=[dict(id=f'prop_{i}', track=rows(c['rows'][str(i)] if str(i) in c['rows'] else c['rows'][i])) for i in range(3)])
    out = dict(schema='kfb.prop-tracks.v2', kind=d['kind'], fps=30,
               space='glTF, Y up, actor faces +Z, actor root (the clown armature origin, standing on the podium top) at the origin; KayKit units',
               columns=['tx', 'ty', 'tz', 'qx', 'qy', 'qz', 'qw', 's'],
               note='one row per frame and prop; place the raw asset (glTF-native, as shipped) with this transform as a child of the actor root. '
                    'Clips chain: juggle loop -> stop -> talk (loops while the line plays) -> resume -> juggle loop (frame 0).',
               assets=[asset_rel(d['propPaths'][str(i)] if str(i) in d['propPaths'] else d['propPaths'][i], '') for i in range(3)],
               podiumTop=d['podiumTop'], timing=d['timing'],
               throws=[dict(beat=t[0], prop=t[1], thrower=t[2], catcher=t[3]) for t in d['throws']], clips=clips)
    json.dump(out, open(dst, 'w'), separators=(',', ':'))
    print(dst, sum(len(c['props'][0]['track']) for c in clips.values()), 'frames')
