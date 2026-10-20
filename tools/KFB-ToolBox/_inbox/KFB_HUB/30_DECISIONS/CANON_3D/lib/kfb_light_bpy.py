# kfb_light_bpy · Blender-Fassung von kfb-stage-light.v1.1 (kfb.stage-light/1) · WSB K3 (BRIEF_WSB_CANON_3D_R1) · 2026-10-20
# Ein Licht für alle Blender-Jobs (Kanon: ein Rig, V-392). Kein Job baut eigenes Licht daneben; Licht nur über setup().
# Quelle: 30_DECISIONS/replies/PROOF_STAGE_R1/vendor/kfb-stage-light.v1.1.js (Zeilenangaben unten). Werte 1:1, nur Einheiten umgerechnet.
# Inhalt des Rigs (wie createStageLight, Z. 166–197):
#   Sonne (einziger Schattenwerfer) · Hemisphäre (Himmel oben, Boden = Bühnenboden × bounce) als Welt · Figurenlicht V-386 als Option
#   (weicher Spot von vorn-oben auf der Kameraseite, schattenlos, am Gesicht ≈ figI). Kein Rand-, kein Gegenlicht (V-392). Keine Emission (V-385).
# Umrechnung three → Blender (gemessen im K1-Bildpaar, 50_BLENDER/K1/RETURN.md):
#   Richtung: glTF (x, y, z) → Blender (x, −z, y). sunDirection = Richtung ZUM Licht, Azimut ab +Z (glTF) Richtung +X (Z. 73–74).
#   Sonne: DirectionalLight-Stärke = Blender-Sonnenstärke 1:1 (K1: 2,4 ↔ 2,4).
#   Hemisphäre: three-Hemisphäre ist Bestrahlung, Blender-Welt Strahldichte → Weltstärke = hemiI / π (K1).
#   Figurenlicht: three-Spot in cd (E = I / d², Z. 189: intensity = figI · d²); Blender-Punkt/Spot: Bestrahlung = P / (4π² d²) → P = 4π² · figI · d².
#     (Blender-Konvention: Punktlicht P ≙ Sonne P / (4π² d²). Im K1-Paar ohne Figurenlicht geprüft; das Figurenlicht selbst ist noch nicht am Bild verglichen.)
#   Ton: three ACESFilmic, Belichtung 1 (Z. 159–160; three skaliert intern mit 1/0,6) → AgX + Look „AgX - Punchy“, Belichtung log2(1/0,6) = +0,74 Blenden.
#   Schatten: three PCFSoft mit engem Kasten (fitShadow/fitAround) → Blender-Sonne mit kleinem Winkel (SUN_ANGLE_DEG 2°, Näherung für den weichen Rand).
import math

SCHEMA = 'kfb.stage-light/1'
VERSION = 'kfb-stage-light.v1.1'
SOURCE = '30_DECISIONS/replies/PROOF_STAGE_R1/vendor/kfb-stage-light.v1.1.js'
MODULE = 'kfb_light_bpy.r1'

# Z. 35–41 · MOODS (r2 = J17-Tag)
MOODS = {
    'day': dict(sun='#fff4e6', sunI=2.9, elev=48.99, az=-53.13, hemiSky='#eef4fa', hemiI=1.05, bounce=1, figI=0.35, figColor='#ffd9b0', skyL=1, glow=0, src='J17'),
    'gold': dict(sun='#ffb877', sunI=2.5, elev=14, az=-53.13, hemiSky='#dbe6fb', hemiI=1.05, bounce=1, figI=0.8, figColor='#ffcf9e', skyL=0.82, glow=0.35, src='R2 + PROPOSED'),
    'night': dict(sun='#a9bcff', sunI=0.45, elev=38, az=-53.13, hemiSky='#43507e', hemiI=0.55, bounce=1, figI=1.5, figColor='#ffc890', skyL=0.3, glow=1, src='R2 + PROPOSED'),
}
# Z. 44–48 · MOODS_COZY
MOODS_COZY = {
    'day': dict(sun='#ffe4bd', sunI=2.3, elev=40, az=-53.13, hemiSky='#dfe6ef', hemiI=0.72, bounce=0.55, figI=0.3, figColor='#ffd0a0', skyL=0.94, glow=0, src='COZY'),
    'gold': dict(sun='#ffa25a', sunI=2.2, elev=12, az=-53.13, hemiSky='#c7d4ef', hemiI=0.75, bounce=0.5, figI=0.7, figColor='#ffc690', skyL=0.78, glow=0.4, src='COZY'),
    'night': dict(sun='#9fb2f0', sunI=0.35, elev=38, az=-53.13, hemiSky='#36416a', hemiI=0.45, bounce=0.4, figI=1.3, figColor='#ffc088', skyL=0.28, glow=1, src='COZY'),
}
# Z. 52–56 · MOODS_MESA (Grundstimmung, Proof Stage v1.2)
MOODS_MESA = {
    'day': dict(sun='#ffdcae', sunI=2.4, elev=38, az=-53.13, hemiSky='#b4bdee', hemiI=0.82, bounce=0.5, figI=0.3, figColor='#ffcf9c', skyL=1, glow=0, src='MESA'),
    'gold': dict(sun='#ff9246', sunI=2.3, elev=11, az=-53.13, hemiSky='#9c9be2', hemiI=0.82, bounce=0.48, figI=0.7, figColor='#ffc28a', skyL=0.8, glow=0.4, src='MESA'),
    'night': dict(sun='#93a6ee', sunI=0.35, elev=38, az=-53.13, hemiSky='#3b3878', hemiI=0.5, bounce=0.4, figI=1.7, figColor='#ffbf86', skyL=0.28, glow=1, src='MESA'),
}
MOOD_SETS = {'r2': MOODS, 'cozy': MOODS_COZY, 'mesa': MOODS_MESA}   # Z. 57
TOD = {'night': 0, 'gold': 0.5, 'day': 1}                            # Z. 58
FIGURE_LIGHT = dict(distance=3.4, up=2.2, face=0.8, angle=1.15, penumbra=0.7)   # Z. 167 (m bzw. rad)
STAGE_GROUND = '#f2e8d8'      # Proof Stage v1.2 Hohlkehle (Hemi-Boden der Prüfbühne); Szenen geben ihren Boden mit
STAGE_BACKGROUND = '#f3ece0'  # Proof Stage v1.2 Hintergrund
SUN_ANGLE_DEG = 2.0
EXPOSURE = math.log2(1 / 0.6)
ROLE_NAMES = ('kfb_sun', 'kfb_figure_light')


def _hx(h): return [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]
def _lin(v): return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
def _srgb(v): return v * 12.92 if v <= 0.0031308 else 1.055 * v ** (1 / 2.4) - 0.055
def _to_hex(c): return '#' + ''.join('%02x' % round(min(1, max(0, v)) * 255) for v in c)
def lin_rgb(h): return tuple(_lin(v) for v in _hx(h))


def mix_hex(a, b, k):   # Z. 64: Mischung im linearen Raum
    A, B = _hx(a), _hx(b); return _to_hex([_srgb(_lin(x) + (_lin(y) - _lin(x)) * k) for x, y in zip(A, B)])


def _ease(u): return u * u * (3 - 2 * u)   # Z. 65


def _mix_mood(A, B, k):   # Z. 66
    o = {}
    for key, a in A.items():
        b = B[key]
        if isinstance(a, (int, float)) and not isinstance(a, bool): o[key] = a + (b - a) * k
        elif isinstance(a, str) and a.startswith('#'): o[key] = mix_hex(a, b, k)
        else: o[key] = a if k < 0.5 else b
    return o


def sun_direction(elev_deg, az_deg):   # Z. 74 · glTF, Richtung ZUM Licht
    e, a = math.radians(elev_deg), math.radians(az_deg)
    return (math.cos(e) * math.sin(a), math.sin(e), math.cos(e) * math.cos(a))


def gltf_to_blender(v): return (v[0], -v[2], v[1])


def shadow_length(elev_deg): return 1 / math.tan(math.radians(max(1, elev_deg)))   # Z. 77


def mood_at(tod=1.0, mood_set='mesa'):   # Z. 68–72
    S = MOOD_SETS[mood_set] if isinstance(mood_set, str) else (mood_set or MOODS)
    t = min(1.0, max(0.0, tod))
    M = _mix_mood(S['night'], S['gold'], _ease(t / 0.5)) if t <= 0.5 else _mix_mood(S['gold'], S['day'], _ease((t - 0.5) / 0.5))
    M['tod'] = t; M['sunDir'] = sun_direction(M['elev'], M['az']); return M


def _clear_rig(scene):
    import bpy
    for o in list(scene.objects):
        if o.get('kfb_light_rig'): bpy.data.objects.remove(o, do_unlink=True)


def setup(scene, mood_set='mesa', mood='day', tod=None, ground=STAGE_GROUND, background=None, figure_light=False, figures=None, camera=None,
          fig_scale=1.0, sun_angle_deg=SUN_ANGLE_DEG, tone=True, replace=True):
    """Licht für eine Blender-Szene. mood ∈ day|gold|night oder tod 0..1 (stufenlos wie moodAt).
    ground: Bühnenboden (Hemi-Boden; three: groundColor × bounce). background: Hex nur für Kamerastrahlen (z. B. Proof-Hintergrund), sonst Hemisphäre.
    figure_light (V-386): nur mit figures (Objekte) und camera; Spot von vorn-oben auf der Kameraseite, am Gesicht ≈ figI, schattenlos.
    fig_scale: Maßstab der Bühne (Proof Stage: fs), skaliert distance/up. Liefert info (wie rig.info())."""
    import bpy
    from mathutils import Vector
    if replace: _clear_rig(scene)
    M = mood_at(TOD[mood] if tod is None else tod, mood_set)
    # Sonne (Z. 169, 180)
    ld = bpy.data.lights.new('kfb_sun', 'SUN'); ld.color = lin_rgb(M['sun']); ld.energy = M['sunI']; ld.angle = math.radians(sun_angle_deg)
    try: ld.use_shadow = True
    except Exception: pass
    so = bpy.data.objects.new('kfb_sun', ld); scene.collection.objects.link(so); so['kfb_light_rig'] = 'sun'
    d = Vector(gltf_to_blender(M['sunDir'])); so.rotation_euler = (-d).to_track_quat('-Z', 'Y').to_euler()
    # Hemisphäre als Welt (Z. 170, 181): oben hemiSky, unten Boden × bounce, Stärke hemiI / π
    w = scene.world or bpy.data.worlds.new('kfb_world'); scene.world = w; w.use_nodes = True; nt = w.node_tree
    for n in list(nt.nodes): nt.nodes.remove(n)
    out = nt.nodes.new('ShaderNodeOutputWorld'); bg = nt.nodes.new('ShaderNodeBackground'); tc = nt.nodes.new('ShaderNodeTexCoord'); sep = nt.nodes.new('ShaderNodeSeparateXYZ')
    nt.links.new(tc.outputs['Generated'], sep.inputs[0])
    # three HemisphereLight: Bestrahlung je Normale = mix(Boden, Himmel, 0,5 + 0,5·n.y). Eine Welt mit Strahldichte mix(Boden, Himmel, 0,5 + 0,75·ω.z)
    #   liefert nach Kosinus-Integration genau das (∫ ω.z cos = 2/3 · π · n.z). Faktor ungeklemmt (−0,25 … 1,25), Farben bleiben positiv.
    mp = nt.nodes.new('ShaderNodeMapRange'); mp.clamp = False; mp.inputs[1].default_value = -2 / 3; mp.inputs[2].default_value = 2 / 3; nt.links.new(sep.outputs[2], mp.inputs[0])
    gnd = tuple(c * M['bounce'] for c in lin_rgb(ground)) + (1,)
    mx = nt.nodes.new('ShaderNodeMix'); mx.data_type = 'RGBA'; mx.clamp_factor = False; mx.inputs[6].default_value = gnd; mx.inputs[7].default_value = lin_rgb(M['hemiSky']) + (1,)
    nt.links.new(mp.outputs[0], mx.inputs['Factor']); nt.links.new(mx.outputs[2], bg.inputs['Color']); bg.inputs['Strength'].default_value = M['hemiI'] / math.pi
    if background:
        lp = nt.nodes.new('ShaderNodeLightPath'); bg2 = nt.nodes.new('ShaderNodeBackground'); bg2.inputs['Color'].default_value = lin_rgb(background) + (1,); bg2.inputs['Strength'].default_value = 1.0
        ms = nt.nodes.new('ShaderNodeMixShader'); nt.links.new(lp.outputs['Is Camera Ray'], ms.inputs[0]); nt.links.new(bg.outputs[0], ms.inputs[1]); nt.links.new(bg2.outputs[0], ms.inputs[2]); nt.links.new(ms.outputs[0], out.inputs[0])
    else: nt.links.new(bg.outputs[0], out.inputs[0])
    w['kfb_light'] = MODULE
    # Figurenlicht V-386 (Z. 172, 182–190)
    fig = None
    if figure_light and figures and camera is not None:
        pts = [o.matrix_world @ Vector(c) for o in figures for c in o.bound_box]
        lo = Vector([min(p[i] for p in pts) for i in range(3)]); hi = Vector([max(p[i] for p in pts) for i in range(3)]); mid = (lo + hi) / 2; h = hi.z - lo.z
        cam = camera.matrix_world.translation; dv = Vector((cam.x - mid.x, cam.y - mid.y, 0)); dv = dv.normalized() if dv.length > 1e-6 else Vector((0, -1, 0))
        aim = Vector((mid.x, mid.y, lo.z + h * FIGURE_LIGHT['face'])); pos = aim + dv * FIGURE_LIGHT['distance'] * fig_scale; pos.z = aim.z + FIGURE_LIGHT['up'] * fig_scale
        dist = (pos - aim).length
        fl = bpy.data.lights.new('kfb_figure_light', 'SPOT'); fl.color = lin_rgb(M['figColor']); fl.energy = 4 * math.pi ** 2 * M['figI'] * dist ** 2
        fl.spot_size = 2 * FIGURE_LIGHT['angle']; fl.spot_blend = FIGURE_LIGHT['penumbra']
        try: fl.use_shadow = False
        except Exception: pass
        fig = bpy.data.objects.new('kfb_figure_light', fl); scene.collection.objects.link(fig); fig['kfb_light_rig'] = 'figure'; fig.location = pos
        fig.rotation_euler = (aim - pos).to_track_quat('-Z', 'Y').to_euler()
    # Ton (Z. 159–160)
    if tone:
        scene.view_settings.view_transform = 'AgX'; scene.view_settings.exposure = EXPOSURE
        try: scene.view_settings.look = 'AgX - Punchy'
        except Exception: pass
    info = {'schema': SCHEMA, 'module': MODULE, 'source': SOURCE, 'mood_set': mood_set if isinstance(mood_set, str) else 'custom', 'mood': mood if tod is None else None,
            'tod': round(M['tod'], 3), 'sun': M['sun'], 'sunI': round(M['sunI'], 3), 'elev': round(M['elev'], 2), 'az': M['az'], 'hemiSky': M['hemiSky'], 'hemiI': round(M['hemiI'], 3),
            'ground': ground, 'bounce': M['bounce'], 'figI': round(M['figI'], 3), 'figure_light': bool(fig), 'rim': False, 'glow': round(M['glow'], 3),
            'shadowLen': round(shadow_length(M['elev']), 3), 'tone': 'AgX Punchy, +0.74 EV (≈ three ACES 1)' if tone else None}
    scene['kfb_light'] = MODULE
    return info
