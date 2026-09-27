"""S5 · TD04 closed circuit in Blender: Uni-Center scenery (from the S3 file, unchanged) + the TD04 stream.
Run inside a copy of KFB_TRACKCORE_S3_TD03_v1.blend; the caller saves the result as a NEW file (S5 folder).
Removes the TD03 / split-seed track collections, imports TD04 with the B1 importer (oracle checks + GLB round trip)."""
import bpy
KIT = '/Users/georgv.westphalen/Dropbox/CLAUDE/KFB Racetrack Blender Kit/TRACK-CORE/'
S5 = KIT + 'S5_CIRCUIT_2026-09-27/'
for name in ('TC_TD03', 'TC_SPLIT_MERGE', 'TC_TD04'):
    c = bpy.data.collections.get(name)
    if not c:
        continue
    for o in list(c.objects):
        me = o.data
        bpy.data.objects.remove(o, do_unlink=True)
        if me is not None and me.users == 0:
            bpy.data.meshes.remove(me)
    bpy.data.collections.remove(c)
g = {'__name__': 's5_import', 'B1_ROOT': S5, 'B1_OUT': S5 + 'b1/',
     'B1_STREAMS': [(S5 + 'out/td04.stream.json', (0.0, 0.0), 'TD04')]}
exec(open(S5 + 'blender/b1_import_stream.py').read(), g)
rep = g['result']
result = {k: (v['oracle'] if isinstance(v, dict) and 'oracle' in v else v) for k, v in rep.items()}
