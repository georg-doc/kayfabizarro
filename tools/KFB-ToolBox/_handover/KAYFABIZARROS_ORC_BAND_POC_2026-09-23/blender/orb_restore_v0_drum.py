"""
KFB · ORB-P1 · v5 = restore the v0 drummer 1:1 (Georg 2026-09-23: v1-v4 drummer passes = FAIL,
"die Animation ganz vom Anfang war noch die beste").

Source of truth for v0 is the exported GLB (`orb_band_module_v0.glb`): the v0 .blend was later
overwritten by v1 work before `save_as v2`, so it does NOT hold the v0 drum.

Method (run inside the ORB .blend, two separate MCP calls because a glTF import needs one
depsgraph rebuild before its NLA evaluates):
  call 1: import orb_band_module_v0.glb into collection `_v0_import`; unmute its `drum` NLA track
  call 2: for frames 0..48 copy every bone's deformation (pose @ rest^-1) from the imported rig to
          Rig_Brute in parent->child order and key it; push to NLA track `drum`; place the drum
          (scale 2 at (0,-1.1,0)), Brute at y 1.3, sticks identity grip scale 2; pauldron back to
          the source skinning (chest 1.0); delete the import.
Verified: bone head positions and stick grip/tip positions identical to the v0 GLB (max error 0).
"""
import bpy, os

ORB = os.path.dirname(bpy.data.filepath)


def call1_import():
    col = bpy.data.collections.new('_v0_import'); bpy.context.scene.collection.children.link(col)
    bpy.context.view_layer.active_layer_collection = bpy.context.view_layer.layer_collection.children['_v0_import']
    bpy.ops.import_scene.gltf(filepath=os.path.join(ORB, 'orb_band_module_v0.glb'))
    imp = [o for o in col.objects if o.type == 'ARMATURE' and 'Brute' in o.name][0]
    imp.animation_data.nla_tracks[0].mute = False   # the importer creates the track muted
    bpy.context.view_layer.active_layer_collection = bpy.context.view_layer.layer_collection
    return imp.name


def call2_bake(imp_name):
    B = {'__name__': 'orb'}; exec(open(os.path.join(ORB, 'orb_build.py')).read(), B)
    O = bpy.data.objects; sc = bpy.context.scene; vl = bpy.context.view_layer
    rig, imp = O['Rig_Brute'], O[imp_name]
    rig.location = (0, 1.3, 0); imp.location = (0, 1.3, 0)
    drum = O['Orc_Wardrum']; drum.scale = (2, 2, 2); drum.location = (0, -1.1, 0)
    pad = O['OrcBrute_Shoulderpad']; idx = [v.index for v in pad.data.vertices]
    pad.vertex_groups['chest'].add(idx, 1.0, 'REPLACE')
    if 'upperarm.l' in pad.vertex_groups:
        pad.vertex_groups.remove(pad.vertex_groups['upperarm.l'])
    ad = rig.animation_data
    for t in list(ad.nla_tracks):
        if t.name == 'drum':
            ad.nla_tracks.remove(t)
    sc.frame_set(0)
    B['new_action'](rig, 'orb_drum_2beat_v0restored')
    order = []

    def walk(b):
        order.append(b.name)
        for c in b.children:
            walk(c)
    for b in rig.data.bones:
        if b.parent is None:
            walk(b)
    ib, ob = imp.data.bones, rig.data.bones
    for fr in range(0, 49):
        sc.frame_set(fr)
        for n in order:
            D = imp.pose.bones[n].matrix @ ib[n].matrix_local.inverted()
            rig.pose.bones[n].matrix = D @ ob[n].matrix_local
            vl.update()
        B['key_bones'](rig, order, fr)
    B['push_to_nla'](rig, 'drum', 48)
    rig.data.pose_position = 'REST'; B['reset'](rig, [b.name for b in rig.pose.bones]); vl.update()
    for side, name in (('l', 'Orc_WardrumStick'), ('r', 'Orc_WardrumStick.R')):
        o = O[name]; o.parent = None
        o.matrix_world = B['prop_matrix'](rig, side, B['identity_offset'](rig, side), 2.0)
        B['parent_keep'](o, rig, f'handslot.{side}')
    rig.data.pose_position = 'POSE'; vl.update()
    col = bpy.data.collections['_v0_import']
    for o in list(col.objects):
        bpy.data.objects.remove(o, do_unlink=True)
    bpy.data.collections.remove(col)
