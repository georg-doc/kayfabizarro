"""KFB #369 gift loot via the shared appear grammar (kfb_appear.py), in a copy of the accepted scene.

Scene '369_GROUND_HANDOVER_APPEAR' is a linked copy of '369_GROUND_HANDOVER': characters, gift box, box light and
stars are shared (unchanged); the old loot rig (GH_loot*, GH_float, GH_CT_*, GH_PX_*) is removed from the copy only.
The loot items are fresh copies (GA_card, GA_radio) so the accepted scene stays untouched.
Gift-specific part: the clay ball is spat straight up out of the box mouth at the box's stretch frame;
everything after that is kfb_appear.build().
"""
import bpy, math, importlib
from mathutils import Vector
import kfb369_lib as L
import kfb_appear as A
importlib.reload(A)

SRC_SC = "369_GROUND_HANDOVER"; SC = "369_GROUND_HANDOVER_APPEAR"
BOX = Vector((-0.85, 0.0, 0.0)); MOUTH_Z = 0.46
LAUNCH = 249; RISE = 14
PRESENT = Vector((-0.85, 0.0, 1.55))
CLAY_HEX = "#f2b632"                       # ribbon colour of gift colourway A1
RADIO_MAXDIM = 1.0
END = 420
OLD_LOOT_COLS = ("GH_loot",)
OLD_LOOT_PREFIX = ("GH_loot", "GH_float", "GH_CT_", "GH_PX_", "GH_card", "GH_radio", "GH_beam", "GH_ptcl")


def make_scene():
    src = bpy.data.scenes[SRC_SC]
    sc = bpy.data.scenes.get(SC)
    if sc is None:
        sc = src.copy(); sc.name = SC
    for cname in OLD_LOOT_COLS:
        c = bpy.data.collections.get(cname)
        if c and c.name in sc.collection.children: sc.collection.children.unlink(c)
    for o in list(sc.collection.objects):
        if o.name.startswith(OLD_LOOT_PREFIX): sc.collection.objects.unlink(o)
    col = bpy.data.collections.get("GA_loot") or bpy.data.collections.new("GA_loot")
    if col.name not in sc.collection.children: sc.collection.children.link(col)
    return sc, col


def item_copy(col, name, sources, root_scale=1.0):
    """Fresh root empty + linked-data copies of the item meshes (keeps materials, drops old animation)."""
    for o in [o for o in bpy.data.objects if o.name.startswith(name)]:
        bpy.data.objects.remove(o, do_unlink=True)
    sub = bpy.data.collections.get(name) or bpy.data.collections.new(name)
    if sub.name not in col.children: col.children.link(sub)
    root = bpy.data.objects.new(name + "_root", None); sub.objects.link(root); root.scale = (root_scale,) * 3
    made = {}
    for src_name, parent_name in sources:
        s = bpy.data.objects[src_name]
        o = s.copy(); o.animation_data_clear(); o.name = name + "_" + src_name.split("_", 1)[1]
        sub.objects.link(o)
        o.parent = made.get(parent_name, root); o.matrix_parent_inverse.identity()
        if "reveal" in o.keys(): o["reveal"] = 1.05
        made[src_name] = o
    return root, sub


def run():
    sc, col = make_scene(); bpy.context.window.scene = sc
    rep = {}
    card_src = bpy.data.objects["GH_card"]
    card, card_col = item_copy(col, "GA_card", [("GH_card", None)])
    card.children[0].location = (0, 0, 0); card.children[0].rotation_euler = (0, 0, 0)
    radio, radio_col = item_copy(col, "GA_radio", [("GH_radio_radio", None), ("GH_radio_radio_handle", "GH_radio_radio")])
    # radio size: max dimension RADIO_MAXDIM
    rm = [o for o in radio.children_recursive if o.type == 'MESH']
    radio.scale = (1, 1, 1); bpy.context.view_layer.update()
    dg = bpy.context.evaluated_depsgraph_get(); inv = radio.matrix_world.inverted()
    pts = [inv @ (o.evaluated_get(dg).matrix_world @ v.co) for o in rm for v in o.evaluated_get(dg).data.vertices]
    md = max(max(p[i] for p in pts) - min(p[i] for p in pts) for i in range(3))
    radio_scale = RADIO_MAXDIM / md
    path = [(LAUNCH - 1, BOX + Vector((0, 0, MOUTH_Z - 0.1)), 0.001), (LAUNCH, BOX + Vector((0, 0, MOUTH_Z)), 0.2)]
    for tag, root, s, coll in (("card", card, 1.0, card_col), ("radio", radio, radio_scale, radio_col)):
        rep[tag] = A.build(sc, coll, root, path, LAUNCH + RISE, PRESENT, name="GA_" + tag + "_fx",
                           clay_hex=CLAY_HEX, prop_scale=s, prop_rz=0.0, end=END)
    rep["radio_scale"] = round(radio_scale, 3)
    sc.frame_set(1)
    return rep


result = run()
