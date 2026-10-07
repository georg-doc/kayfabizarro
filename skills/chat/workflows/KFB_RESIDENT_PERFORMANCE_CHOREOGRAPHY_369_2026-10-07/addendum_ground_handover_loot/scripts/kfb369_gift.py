# KFB #369 follow-up: gift colourways + per-rig gift size (Blender 5.2). Additive helper.
import bpy, colorsys
from mathutils import Vector

# Joyride track worlds (lab-track/track-look.v5.js via KFB_OPEN_WORLD_STYLEGUIDE 00_referenzblatt/01-farbpaletten)
PALETTES = {
    "A_canyon": [("#ef5a22", "#f2b632"), ("#8b68c7", "#f2b632"), ("#f2b632", "#8b68c7")],
    "B_bikini": [("#f2708a", "#f7d23c"), ("#5cc3bf", "#f7a1c4"), ("#9a6fd0", "#8fcf45")],
    "C_otown":  [("#e9b53b", "#c9508f"), ("#3aa596", "#fff06a"), ("#c9508f", "#f08a2c")],
}
# gift body width per rig class (round clay present, body 0.5 m at scale 1)
RIG_GIFT_SCALE = {"Rig_Medium": 0.9, "Rig_Large": 1.7, "Rig_Legacy": None}


def hex2lin(h):
    h = h.lstrip('#')
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(((x / 12.92) if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4) for x in c) + (1.0,)


def flat_mat(name, hexcol, rough=0.8):
    m = bpy.data.materials.get(name)
    if m is None:
        m = bpy.data.materials.new(name)
        m.use_nodes = True
    b = [n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'][0]
    b.inputs['Base Color'].default_value = hex2lin(hexcol)
    b.inputs['Roughness'].default_value = rough
    m.diffuse_color = hex2lin(hexcol)
    return m


def _src_image(obj):
    m = obj.material_slots[0].material
    return [n for n in m.node_tree.nodes if n.type == 'TEX_IMAGE'][0].image


def classify_faces(obj):
    """Return list of 0 (body) / 1 (ribbon) per polygon from the source clay texture."""
    img = _src_image(obj)
    w, h = img.size
    px = img.pixels[:]
    me = obj.data
    uv = me.uv_layers.active.data
    hues = []
    for p in me.polygons:
        u = sum(uv[i].uv[0] for i in p.loop_indices) / p.loop_total
        v = sum(uv[i].uv[1] for i in p.loop_indices) / p.loop_total
        x = min(w - 1, max(0, int(u % 1 * w)))
        y = min(h - 1, max(0, int(v % 1 * h)))
        r, g, b = px[(y * w + x) * 4:(y * w + x) * 4 + 3]
        hues.append(colorsys.rgb_to_hsv(r, g, b))
    # body = the hue that dominates the box walls; take the most frequent hue bucket on this object
    return hues


def recolour(box, lid, body_hex, rib_hex, tag):
    """Assign two flat materials. Face class: hue nearest to the box's dominant hue -> body."""
    from collections import Counter
    hb = classify_faces(box)
    dom = Counter(round(h[0], 2) for h in hb).most_common(1)[0][0]
    mb = flat_mat(f"KFB_Gift_{tag}_body", body_hex)
    mr = flat_mat(f"KFB_Gift_{tag}_ribbon", rib_hex)
    for o in (box, lid):
        hs = classify_faces(o) if o is lid else hb
        o.data.materials.clear()
        o.data.materials.append(mb)
        o.data.materials.append(mr)
        for p, h in zip(o.data.polygons, hs):
            d = min(abs(h[0] - dom), 1 - abs(h[0] - dom))
            p.material_index = 0 if d < 0.15 else 1
    return mb, mr
