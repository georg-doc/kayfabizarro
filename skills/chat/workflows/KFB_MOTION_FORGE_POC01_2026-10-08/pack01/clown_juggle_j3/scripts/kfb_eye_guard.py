"""KFB eye guard: every resident on screen must wear the KFB eyes (Georg 2026-10-09: never without eyes, never with
the original painted eyes). Call check(scene) before any render; it raises when a visible character lacks them.

clone_tree(src, parent, col, arm) deep-copies an object hierarchy (the eye rig is EYE_<arm>_L/R -> lids/pupilpivot ->
meshes; copying only direct children loses the eye meshes, which is how the Stammtisch S1 renders lost their eyes).
"""
import bpy

EYE_PARTS = ('sclera', 'pupil', 'lo', 'up')


def eye_meshes(arm):
    return [o for o in arm.children_recursive if o.type == 'MESH' and o.name.startswith('EYE_')]


def visible(o, sc):
    if o.hide_render or o.name not in sc.objects:
        return False
    def lc_ok(lc):
        if o.name in lc.collection.objects and not lc.exclude and not lc.collection.hide_render:
            return True
        return any(lc_ok(c) for c in lc.children if not c.exclude and not c.collection.hide_render)
    return lc_ok(sc.view_layers[0].layer_collection) or o.name in sc.collection.objects


def check(sc=None, raise_on_fail=True):
    sc = sc or bpy.context.scene
    bad = {}
    for a in sc.objects:
        if a.type != 'ARMATURE' or not visible(a, sc):
            continue
        body = [c for c in a.children if c.type == 'MESH' and visible(c, sc)]
        if not body:
            continue
        eyes = [e for e in eye_meshes(a) if visible(e, sc)]
        missing = [f'{s}.{p}' for s in ('L', 'R') for p in EYE_PARTS
                   if not any(e.name.split('.')[0].endswith(f'_{s}_{p}') for e in eyes)]
        if missing:
            bad[a.name] = missing
    if bad and raise_on_fail:
        raise RuntimeError(f'KFB eye guard: characters without KFB eyes: {bad}')
    return bad


def clone_tree(src, parent, col, arm):
    """Copy src (and its whole subtree) under parent; armature modifiers and constraints point to arm."""
    o = src.copy()
    col.objects.link(o)
    o.parent = parent
    o.parent_type = src.parent_type; o.parent_bone = src.parent_bone
    o.matrix_parent_inverse = src.matrix_parent_inverse.copy()
    for m in getattr(o, 'modifiers', []):
        if m.type == 'ARMATURE':
            m.object = arm
    for c in o.constraints:
        if getattr(c, 'target', None) is not None and c.target.type == 'ARMATURE':
            c.target = arm
    for ch in src.children:
        clone_tree(ch, o, col, arm)
    return o
