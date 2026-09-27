"""S6 · TD05 (twisted balcony circuit) in Blender: Uni-Center scenery (from the S5 file) + the TD05 stream, then the
rounded-architecture modifiers (s6_round_scenery.py). Run inside a copy of KFB_TRACKCORE_S5_TD04_v1.blend; the caller
saves the result as a NEW file (S6 folder). Removes old track collections, imports TD05 with the B1 importer."""
import bpy
KIT = '/Users/georgv.westphalen/Dropbox/CLAUDE/KFB Racetrack Blender Kit/TRACK-CORE/'
S6 = KIT + 'S6_TWIST_ROUND_2026-09-27/'
for name in ('TC_TD03', 'TC_SPLIT_MERGE', 'TC_TD04', 'TC_TD05'):
    c = bpy.data.collections.get(name)
    if not c:
        continue
    for o in list(c.objects):
        me = o.data
        bpy.data.objects.remove(o, do_unlink=True)
        if me is not None and me.users == 0:
            bpy.data.meshes.remove(me)
    bpy.data.collections.remove(c)
g = {'__name__': 's6_import', 'B1_ROOT': S6, 'B1_OUT': S6 + 'b1/',
     'B1_STREAMS': [(S6 + 'out/td05.stream.json', (0.0, 0.0), 'TD05')]}
exec(open(S6 + 'blender/b1_import_stream.py').read(), g)
r = {'__name__': 's6_round'}
exec(open(S6 + 'blender/s6_round_scenery.py').read(), r)
result = dict(oracle={k: (v['oracle'] if isinstance(v, dict) and 'oracle' in v else v) for k, v in g['result'].items()},
              rounded=r['result']['rounded'], rounded_detail=r['result']['objects'])
