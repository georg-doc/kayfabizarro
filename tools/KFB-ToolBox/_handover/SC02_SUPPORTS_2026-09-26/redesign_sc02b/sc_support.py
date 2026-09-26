"""SC-LIB · sc_support · clean parametric support family (redesign 26.09, replaces the donor-profile route in SC02)
Concept: the shaft profile is defined by HEIGHT SHARES with min/max, not by absolute heights.
  footing (round block, v1 proportions)  |  foot flare  |  shaft (tapering, thicker at the base)  |  capital flare + disc  |  bearing plate
  z is strictly increasing along the profile BY CONSTRUCTION -> a lathe can never fold.
  Very short supports (no room for a neck) become a PEDESTAL: footing + capital disc, no shaft.
Style layer (classic / trunk / vine / rope) reuses rkit3_lib.organic_shaft on THIS profile (donor unchanged).
Units: metres, runtime frame (x right, y up, z forward); Blender via K.to_bl."""
import math
import bpy
from mathutils import Vector

P = dict(
    foot_r=2.9, waist_r=2.1, neck_r=1.65, disc_r=2.62,     # radii: foot of shaft, shaft bottom, shaft top, capital disc
    shaft_z0=0.8,                                          # shaft starts inside the footing block (top at +1.0)
    flare_share=0.30, flare_min=0.6, flare_max=2.2,        # foot flare height = share of usable height, clamped
    cap_share=0.28, cap_min=0.55, cap_max=1.6,             # capital flare height
    neck_min=0.35,                                         # below this remaining shaft length -> pedestal
    disc_t=0.22,                                           # straight disc band under the plate
    plate=(5.6, 7.2), plate_t=0.8, plate_bevel=0.22,       # bearing plate across x along, thickness (0.55 visible + 0.25 embed)
    samples=7,
)


def ease(t):
    return t * t * (3 - 2 * t)


def profile(cap_top, p=P):
    """[(r, z)] from the shaft foot (z0) to the disc top (cap_top + 0.1). Strictly increasing z. Returns (prof, kind)."""
    z0 = p['shaft_z0']
    usable = cap_top - z0
    fl = min(p['flare_max'], max(p['flare_min'], p['flare_share'] * usable))
    cp = min(p['cap_max'], max(p['cap_min'], p['cap_share'] * usable))
    neck = usable - fl - cp - p['disc_t']
    n = p['samples']
    prof = []
    if neck < p['neck_min']:
        # PEDESTAL: footing + one soft capital from the foot radius to the disc
        kind = 'pedestal'
        span = max(0.3, usable - p['disc_t'])
        for i in range(n + 1):
            t = i / n
            prof.append((p['foot_r'] + (p['disc_r'] - p['foot_r']) * ease(t) - 0.35 * math.sin(math.pi * t), z0 + span * t))
    else:
        kind = 'column'
        for i in range(n + 1):                                     # foot flare foot_r -> waist_r
            t = i / n
            prof.append((p['foot_r'] + (p['waist_r'] - p['foot_r']) * ease(t), z0 + fl * t))
        zs, ze = z0 + fl, z0 + fl + neck                           # shaft: straight taper waist -> neck
        for i in range(1, 4):
            t = i / 3
            prof.append((p['waist_r'] + (p['neck_r'] - p['waist_r']) * t, zs + (ze - zs) * t))
        for i in range(1, n + 1):                                  # capital flare neck -> disc
            t = i / n
            prof.append((p['neck_r'] + (p['disc_r'] - p['neck_r']) * ease(t), ze + cp * t))
    zt = prof[-1][1]
    prof.append((p['disc_r'], cap_top - 0.02))                     # disc band up into the plate
    prof.append((p['disc_r'] - 0.08, cap_top + 0.1))
    # strict monotonic guard (construction guarantees it; keep the assert as a contract)
    for a, b in zip(prof, prof[1:]):
        assert b[1] > a[1], ('profile not monotonic', a, b)
    return prof, kind


def check_profile(prof):
    zs = [z for _, z in prof]
    return all(b > a for a, b in zip(zs, zs[1:]))


# ------------------------------------------------------------------ geometry (bpy)
FOOT_PROFILE = [(3.6, -0.8), (3.6, -0.05), (3.3, 0.12), (3.1, 0.3), (3.1, 0.65), (3.05, 0.85), (2.9, 0.97), (2.7, 1.0)]


def _mesh(K, name, verts_bl, faces, role, smooth=True):
    return K.mesh_from(name, verts_bl, faces, [role] * len(faces), smooth=smooth)


def round_footing(K, name, base, ground, segs=48):
    """Round block, v1 proportions (6.2 m, top +1.0, sunk 0.8); only the skirt (r 3.1 -> 3.6) follows ground(x, z)."""
    v, f = [], []
    for r, h in FOOT_PROFILE:
        w = 1.0 if h <= 0.12 else max(0.0, (0.3 - h) / 0.18)
        for k in range(segs):
            a = 2 * math.pi * k / segs
            x, z = base.x + r * math.cos(a), base.z + r * math.sin(a)
            y = base.y + h + (ground(x, z) - base.y) * w
            v.append(K.to_bl(x, y, z))
    n = len(FOOT_PROFILE)
    for i in range(n - 1):
        for k in range(segs):
            kn = (k + 1) % segs
            f.append((i * segs + k, i * segs + kn, (i + 1) * segs + kn, (i + 1) * segs + k))
    c = len(v); v.append(K.to_bl(base.x, base.y + FOOT_PROFILE[-1][1], base.z))
    f += [((n - 1) * segs + k, (n - 1) * segs + (k + 1) % segs, c) for k in range(segs)]
    c2 = len(v); v.append(K.to_bl(base.x, base.y - 0.8, base.z))
    f += [((k + 1) % segs, k, c2) for k in range(segs)]
    return _mesh(K, name, v, f, 'support')


def build(K, R3, name, base, H, style='classic', soffit=None, yaw=0.0, ground=None, embed=0.25, seed=1, p=P):
    """One support. base: runtime Vector on the ground under the route; H: clear height ground -> soffit at base.
    soffit(x, z) -> runtime y of the track underside (bank/grade); defaults to flat base.y + H.
    Returns (objects, info)."""
    ground = ground or (lambda x, z: base.y)
    soffit = soffit or (lambda x, z: base.y + H)
    cap_top = H - (p['plate_t'] - embed)
    prof, kind = profile(cap_top, p)
    objs = []
    styles = getattr(R3, 'PILLAR_STYLES', {})
    st = styles.get(style, {})
    if not st.get('roots'):
        objs.append(round_footing(K, name + '_footing', base, ground))
    if style == 'classic':
        shaft = K.lathe(name + '_shaft', prof, segs=40)
    else:
        shaft = R3.organic_shaft(name + '_shaft', prof, cap_top, style, seed=seed)
    bl = K.to_bl(base.x, base.y, base.z)
    shaft.location = (bl.x, bl.y, bl.z)
    objs.append(shaft)
    sx, sy = p['plate']
    plate = R3.rounded_box(name + '_bearing_plate', sx, sy, p['plate_t'], p['plate_bevel'], 'underside', (0, 0, 0))
    plate.rotation_euler = (0, 0, yaw)
    plate.location = (bl.x, bl.y, bl.z + cap_top)
    bpy.context.view_layer.update()
    mw, inv = plate.matrix_world, plate.matrix_world.inverted()
    s0 = soffit(base.x, base.z)
    for v in plate.data.vertices:
        w = mw @ v.co
        w.z += soffit(w.x, -w.y) - s0            # Blender (x, y) -> runtime (x, z = -y)
        v.co = inv @ w
    plate.data.update()
    objs.append(plate)
    for o in objs:
        o['kfb_module'] = 'scenery_support'
        o['kfb_support_kind'] = kind
        o['kfb_pillar_style'] = style
        if o.type == 'MESH':
            o.data.name = o.name
    return objs, dict(kind=kind, cap_top=round(cap_top, 3), profile_ok=check_profile(prof), n_prof=len(prof))
