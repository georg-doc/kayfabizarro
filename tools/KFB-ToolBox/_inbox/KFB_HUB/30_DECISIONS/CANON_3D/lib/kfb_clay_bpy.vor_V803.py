# kfb_clay_bpy · Blender-Knet- und Palettenmodul (V-563 K1; Kanon Gebiete 6, 8, 15; V-565 Eingangsprüfung, V-566 Asset-Pass). WSB 2026-10-20.
#
# EIN Material-Baustein für alles, was in Blender gebaut wird, mit den Profilen 1:1 aus
#   replies/CLAY_SSOT_R1/kfb-clay.v1.1.js (Quellzeilen unten je Wert) und den Rollenfarben aus
#   replies/COLOR_HARMONY_R1/kfb-cartoon-palette.js (envRoles: Rolle → [hell, mitte, dunkel]) bzw. replies/ISLAND_PALETTES_R1/island_palettes.r1.json.
#
# Benutzung (im Blender-Build, vor dem Szenenbau):
#   import sys; sys.path.insert(0, '<KFB_HUB>/30_DECISIONS/CANON_3D/lib'); import kfb_clay_bpy as clay
#   pal = clay.palette_from_island('01_Port')              # oder clay.load_palette(<json>) / dict {rolle: [hell, mitte, dunkel]}
#   clay.apply(ob, 'stone', pal, source='kit')             # Knet-Profil + Rollenfarbe; setzt kfb_role, kfb_color, Material kfb_material
#   clay.write_asset_pass('<asset>.asset_pass.json', ob=ob, origin=…, licence=…, form_dna=…, wear=[…], placement=…)
#
# Was 1:1 ist und was angenähert (Blender-Knoten statt GLSL):
#   1:1 übernommen: alle Profilwerte (Größen, Steigungen, Dichten, Radien, mottle, maxSlope, roughMin, sheen), ROUGH_FLOOR 0,6, SHEEN_MAX 0,05, MAX_PULL 0,18,
#     Seed-Regel (FNV-1a, nie zufällig), Bezugslänge (Figuren: Objekthöhe; Requisiten/Bühne: FrizzleBob-Höhe wie der Proof Stage), Metall 0, matt.
#   angenähert (Knoten-Grenze, Wirkung gleich gerichtet): Beulen = Rauschen (2 Oktaven) als Höhe → Bump; Dellen (2 Lagen) = Voronoi-Schalen mit Dichte-Maske
#     (rund statt oval, ohne Randwulst, ohne Log-Normal-Streuung); Körnung = feines Rauschen; Facetten = Voronoi-Zellen leicht gekippt; Steigungs-Deckel
#     maxSlope nur über die Amplituden; Sichtbarkeits-Bänder (LOD nach Bildschirmgröße) entfallen – Blender rendert feste Ansichten.
#   Farbe: Rollenton als Grundfarbe (eigene Teile) bzw. Farbton/Sättigung zur Rolle gezogen, Helligkeit bleibt (Kit-/Meshy-Texturen); Meshy höchstens
#     MAX_PULL (V-286 „nur leicht tönen“), Kit kräftiger (Gebiet 15: Kit-Farben auf die Rollen umtönen).
#   Emission wie das Web-Modul (WS0 20.10., SSOT kfb-clay.v1.1 Z. 324, V-429/V-431): Profile mit emissive=true (midground, background) übernehmen die
#   Emission des Quellmaterials (Farbe, Textur, Stärke) unverändert; character setzt sie auf 0. Es wird nie Emission hinzugefügt. Gate M2 lässt Emission
#   nur an kfb-clay-Profilen zu. Keine AO-/Licht-Texturen (werden entfernt).
import bpy, json, math, os, hashlib, colorsys

VERSION = 'kfb-clay.v1.1'; SCHEMA = 'kfb.clay/1'; MODULE = 'kfb_clay_bpy/1'
MAX_PULL = 0.18          # kfb-clay.v1.1.js Z. 28 (V-340)
SHEEN_MAX = 0.05         # Z. 29 (V-385)
ROUGH_FLOOR = 0.6        # Z. 30
FB_HEIGHT_U = 1.81 / 0.616381042   # Proof Stage: Requisiten/Bühne mit scaleRef = FrizzleBob-Höhe (kfb-proof-stage.v1.2.js Z. 34), in u
HUB = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))   # …/KFB_HUB/30_DECISIONS
ISLANDS_JSON = os.path.join(HUB, 'replies', 'ISLAND_PALETTES_R1', 'island_palettes.r1.json')

# kfb-clay.v1.1.js Z. 42–73 (CLAY_PROFILES), Werte 1:1
PROFILES = {
    'character': dict(lump=(0.085, 0.16), dent=dict(size=0.03, density=0.8, slope=0.15, rim=0.06, elong=2.6, sigma=0.4, radius=0.42),
                      dent2=dict(size=0.075, density=0.65, slope=0.19, rim=0.1, elong=2.8, sigma=0.35, radius=0.34), grain=(0.0055, 0.02), facet=(0.0, 0.0),
                      mottle=0.025, maxSlope=0.42, roughMin=0.72, sheen=0.04, srcNormalK=0.5, emissive=False),
    'midground': dict(lump=(0.12, 0.11), dent=dict(size=0.044, density=0.8, slope=0.15, rim=0.05, elong=2.6, sigma=0.4, radius=0.42),
                      dent2=dict(size=0.11, density=0.6, slope=0.17, rim=0.07, elong=2.8, sigma=0.35, radius=0.34), grain=(0.008, 0.028), facet=(0.09, 0.05),
                      mottle=0.03, maxSlope=0.4, roughMin=0.82, sheen=0.02, srcNormalK=0.6, emissive=True),
    'background': dict(lump=(0.45, 0.09), dent=dict(size=0.18, density=0.62, slope=0.11, rim=0.04, elong=2.6, sigma=0.4, radius=0.42),
                       dent2=dict(size=0.44, density=0.5, slope=0.12, rim=0.06, elong=2.8, sigma=0.35, radius=0.34), grain=(0.0, 0.0), facet=(0.3, 0.045),
                       mottle=0.035, maxSlope=0.28, roughMin=0.9, sheen=0.0, srcNormalK=0.4, emissive=True),
}
# Z. 74–78 (PROFILE_ALIASES)
ALIASES = {'figure-fine': 'character', 'fine': 'character', 'figure': 'character', 'face': 'character', 'actor': 'character',
           'vehicle': 'midground', 'prop': 'midground', 'house': 'midground', 'road': 'midground', 'nature': 'midground', 'mid': 'midground', 'diorama': 'midground',
           'stage': 'midground', 'terrainFg': 'midground', 'terrain': 'background', 'terrainBg': 'background', 'far': 'background', 'large': 'background',
           'cloud': 'background', 'world': 'background'}
# Rolle → Profil (wenn nicht angegeben): Figuren fein, Umgebung Mittelgrund, Boden/Ferne ruhig
ROLE_PROFILE = {'figure': 'character', 'ground': 'background', 'sky': 'background', 'water': 'midground'}
SOURCE_PULL = {'own': 1.0, 'kit': 0.85, 'meshy': MAX_PULL}   # Anteil Farbton/Sättigung zur Rolle; Helligkeit bleibt (eigene Teile: Rollenton direkt)
NOISE_GAIN = 1.6   # gemessen (K1): Blender-Noise Detail 0 hat Median-Gradient 0,47/Zelle bei σ 0,126 → ×1,6, damit die Neigung ≈ slope wie kfbNoiseD/1,5
SKIP = ('eye', 'pupil', 'iris', 'lid', 'mouth', 'teeth', 'tongue', 'lash', 'decal', 'kfb_screen_slot')   # Z. 98 SKIP_DEFAULT


def resolve_profile(name='character'):
    pid = name if name in PROFILES else ALIASES.get(name)
    if not pid: raise ValueError(f'kfb_clay_bpy: unbekanntes Profil {name!r} ({" | ".join(PROFILES)})')
    return pid


def seed_from(v):   # Z. 87–88: Zahl → uint32, sonst FNV-1a des Texts. Nie zufällig.
    if isinstance(v, (int, float)) and math.isfinite(v): return int(abs(v)) & 0xffffffff
    h = 0x811c9dc5
    for ch in str(v if v is not None else 'kfb'): h ^= ord(ch); h = (h * 0x01000193) & 0xffffffff
    return h


# ------------------------------------------------------------------ Palette
def load_palette(src):
    """dict {rolle: [hell, mitte, dunkel]} | Pfad zu JSON mit envRoles/roles | kfb-cartoon-palette-Ausgabe (envRoles)."""
    if isinstance(src, dict): d = src
    else: d = json.load(open(src))
    for k in ('envRoles', 'roles'):
        if isinstance(d.get(k), dict) and all(isinstance(v, list) for v in d[k].values()): return {r: [c.lower() for c in v] for r, v in d[k].items()}
    return {r: ([c.lower() for c in v] if isinstance(v, list) else [str(v).lower()] * 3) for r, v in d.items()}


def palette_from_island(island_id, path=ISLANDS_JSON):
    I = json.load(open(path))['islands']; return load_palette(I[island_id]['roles'])


def role_color(pal, role, tone=1):
    if role not in pal: raise KeyError(f'kfb_clay_bpy: Rolle {role!r} nicht in der Palette ({", ".join(sorted(pal))})')
    v = pal[role]; return v[min(tone, len(v) - 1)]


def _lin(hexs):
    h = hexs.lstrip('#'); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return [x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c]


# ------------------------------------------------------------------ Knoten
def _n(nt, typ, loc, **kw):
    n = nt.nodes.new(typ); n.location = loc
    for k, v in kw.items():
        if k in n.inputs: n.inputs[k].default_value = v
        else: setattr(n, k, v)
    return n


def _math(nt, op, a, b=None, loc=(0, 0)):
    m = nt.nodes.new('ShaderNodeMath'); m.operation = op; m.location = loc
    for i, x in enumerate((a, b)):
        if x is None: continue
        if isinstance(x, (int, float)): m.inputs[i].default_value = x
        else: nt.links.new(x, m.inputs[i])
    return m.outputs[0]


def _noise_height(nt, P, size, amp, seed_off, loc, octave2=True):
    """Rauschen (Quilez-Wertrauschen ≈ Blender Noise, Detail 0) als Höhe in Bezugslängen; 2. Oktave ×2,07 mit halber Stärke wie kfbClayGrad.
    Höhe ±amp·size/1,5 ⇒ Steigung ≈ amp (Wert des Profils, 'slope')."""
    off = _n(nt, 'ShaderNodeVectorMath', (loc[0] - 180, loc[1] - 60), operation='ADD'); off.inputs[1].default_value = (seed_off, seed_off * 0.37, seed_off * 0.61); nt.links.new(P, off.inputs[0])
    def octave(scale, y):
        nz = _n(nt, 'ShaderNodeTexNoise', (loc[0], y), noise_dimensions='3D'); nz.inputs['Scale'].default_value = scale; nz.inputs['Detail'].default_value = 0.0
        nz.inputs['Roughness'].default_value = 0.5; nt.links.new(off.outputs[0], nz.inputs['Vector']); return _math(nt, 'SUBTRACT', nz.outputs['Fac'], 0.5, (loc[0] + 180, y))
    h = octave(1.0 / size, loc[1])
    if octave2:
        h2 = octave(2.07 / size, loc[1] - 200); mad = nt.nodes.new('ShaderNodeMath'); mad.operation = 'MULTIPLY_ADD'; mad.location = (loc[0] + 360, loc[1] - 100)
        nt.links.new(h2, mad.inputs[0]); mad.inputs[1].default_value = 0.5; nt.links.new(h, mad.inputs[2]); h = _math(nt, 'DIVIDE', mad.outputs[0], 1.5, (loc[0] + 520, loc[1] - 100))
    return _math(nt, 'MULTIPLY', h, NOISE_GAIN * 2.0 * amp * size / 1.5, (loc[0] + 680, loc[1]))


def _vm(nt, op, a, b=None, loc=(0, 0), out=0):
    """Vektor-Rechnung: a, b = Ausgang oder Konstante (Tupel/Zahl). out 0 = Vector, 1 = Value."""
    m = nt.nodes.new('ShaderNodeVectorMath'); m.operation = op; m.location = loc
    for i, x in enumerate((a, b)):
        if x is None: continue
        if isinstance(x, (int, float)): m.inputs[i].default_value = (x, x, x)
        elif isinstance(x, tuple): m.inputs[i].default_value = x
        else: nt.links.new(x, m.inputs[i])
    if op == 'SCALE' and isinstance(b, (int, float)): m.inputs['Scale'].default_value = b
    return m.outputs['Value'] if out else m.outputs['Vector']


def _sep(nt, v, loc):
    s = nt.nodes.new('ShaderNodeSeparateXYZ'); s.location = loc; nt.links.new(v, s.inputs[0]); return s.outputs


def _smooth(nt, x, a, b, loc):
    m = _n(nt, 'ShaderNodeMapRange', loc, interpolation_type='SMOOTHSTEP'); m.inputs['From Min'].default_value = a; m.inputs['From Max'].default_value = b
    nt.links.new(x, m.inputs['Value']); return m.outputs['Result']


def _dent_height(nt, P, d, seed_off, loc):
    """r2 (K1 R2): Dellen-Lage wie kfbDentLayer (kfb-clay.v1.1 Z. 177–216) als Höhe, je Voronoi-Zelle (Zellgröße d.size) eine Delle:
    Cluster-Feld 0,35 + 1,65·smoothstep(0,15, 0,85, ½(q2 + q4)) aus zwei groben Oktaven (2 und 4 Zellen) → Anteil density·Feld;
    Achse a zufällig, Streckung e = 1 + (elong − 1)·√r, Radius log-normal R = radius·exp(sigma·n), Tiefe 0,65…1,35;
    h = D·(−exp(−2,5 rr²)(1 − ½g) + rim·exp(−((rr − 1)/0,26)²)·(1 + g)²/4), g = t/(1 + |t|): Schale am Druckende tiefer, Wulst nur auf der Schubseite (Halbmond).
    Abweichung: Blender-Voronoi kennt nur die nächste Zelle (Web: 27 Zellen) → R·e ≤ 0,5 Zellen und weiches Ausblenden zum Zellrand (keine Nähte)."""
    x0, y0 = loc; sz = d['size']
    off = _vm(nt, 'ADD', P, (seed_off * 0.71, seed_off, seed_off * 0.29), (x0 - 200, y0)); xs = _vm(nt, 'SCALE', off, 1.0 / sz, (x0 - 60, y0))   # x in Zellen
    vo = _n(nt, 'ShaderNodeTexVoronoi', (x0 + 80, y0), voronoi_dimensions='3D', feature='F1', distance='EUCLIDEAN'); vo.inputs['Scale'].default_value = 1.0; vo.inputs['Randomness'].default_value = 1.0
    nt.links.new(xs, vo.inputs['Vector'])
    c = vo.outputs['Color']; q = _vm(nt, 'SUBTRACT', xs, vo.outputs['Position'], (x0 + 240, y0))
    r3 = _vm(nt, 'FRACTION', _vm(nt, 'MULTIPLY_ADD', c, (13.7, 17.1, 11.3), loc=(x0 + 240, y0 - 120)), None, (x0 + 380, y0 - 120))
    r4 = _vm(nt, 'FRACTION', _vm(nt, 'MULTIPLY', c, (29.3, 23.9, 31.7), (x0 + 240, y0 - 240)), None, (x0 + 380, y0 - 240))
    r5 = _vm(nt, 'FRACTION', _vm(nt, 'MULTIPLY', c, (41.9, 47.3, 37.1), (x0 + 240, y0 - 360)), None, (x0 + 380, y0 - 360))
    c_, r4_, r5_ = _sep(nt, c, (x0 + 520, y0 - 60)), _sep(nt, r4, (x0 + 520, y0 - 240)), _sep(nt, r5, (x0 + 520, y0 - 360))
    # Cluster-Feld (grobe Oktaven 2 und 4 Zellen)
    n2 = _n(nt, 'ShaderNodeTexNoise', (x0 + 80, y0 - 480), noise_dimensions='3D'); n2.inputs['Scale'].default_value = 0.5; n2.inputs['Detail'].default_value = 0.0; nt.links.new(xs, n2.inputs['Vector'])
    n4 = _n(nt, 'ShaderNodeTexNoise', (x0 + 80, y0 - 640), noise_dimensions='3D'); n4.inputs['Scale'].default_value = 0.25; n4.inputs['Detail'].default_value = 0.0; nt.links.new(xs, n4.inputs['Vector'])
    fld = _math(nt, 'MULTIPLY', _math(nt, 'ADD', n2.outputs['Fac'], n4.outputs['Fac'], (x0 + 240, y0 - 560)), 0.5, (x0 + 380, y0 - 560))
    fld = _math(nt, 'MULTIPLY_ADD', _smooth(nt, fld, 0.15, 0.85, (x0 + 520, y0 - 560)), 1.65, (x0 + 680, y0 - 560)); fld.node.inputs[2].default_value = 0.35
    mask = _math(nt, 'LESS_THAN', c_[0], _math(nt, 'MULTIPLY', fld, d['density'], (x0 + 840, y0 - 560)), (x0 + 1000, y0 - 480))
    # Streckung, Radius, Tiefe
    e = _math(nt, 'MULTIPLY_ADD', _math(nt, 'SQRT', r4_[1], None, (x0 + 680, y0 - 240)), d['elong'] - 1.0, (x0 + 840, y0 - 240)); e.node.inputs[2].default_value = 1.0
    nrm = _n(nt, 'ShaderNodeClamp', (x0 + 1320, y0 - 360)); nrm.inputs['Min'].default_value = -2.2; nrm.inputs['Max'].default_value = 2.2
    nt.links.new(_math(nt, 'MULTIPLY', _math(nt, 'SUBTRACT', _math(nt, 'ADD', _math(nt, 'ADD', r5_[0], r5_[1]), r5_[2]), 1.5), 2.0), nrm.inputs['Value'])
    R = _math(nt, 'MULTIPLY', _math(nt, 'EXPONENT', _math(nt, 'MULTIPLY', nrm.outputs[0], d['sigma'], (x0 + 1480, y0 - 360)), None, (x0 + 1640, y0 - 360)), d['radius'], (x0 + 1800, y0 - 360))
    R = _math(nt, 'MINIMUM', R, _math(nt, 'DIVIDE', 0.5, e, (x0 + 1000, y0 - 200)), (x0 + 1960, y0 - 300))   # R·e ≤ 0,5 Zellen (eine Zelle, s. o.)
    depth = _math(nt, 'MULTIPLY_ADD', r4_[2], 0.7, (x0 + 680, y0 - 300)); depth.node.inputs[2].default_value = 0.65
    # Geometrie der Delle
    a = _vm(nt, 'NORMALIZE', _vm(nt, 'ADD', r3, (-0.5, -0.5, -0.5001), (x0 + 520, y0 - 120)), None, (x0 + 680, y0 - 120))
    aq = _vm(nt, 'DOT_PRODUCT', a, q, (x0 + 840, y0 - 120), out=1)
    kk = _math(nt, 'SUBTRACT', 1.0, _math(nt, 'DIVIDE', 1.0, e, (x0 + 1000, y0 - 160)), (x0 + 1160, y0 - 160))
    sc = _n(nt, 'ShaderNodeVectorMath', (x0 + 1320, y0 - 120), operation='SCALE'); nt.links.new(a, sc.inputs[0]); nt.links.new(_math(nt, 'MULTIPLY', kk, aq, (x0 + 1160, y0 - 100)), sc.inputs['Scale'])
    u = _vm(nt, 'SUBTRACT', q, sc.outputs[0], (x0 + 1480, y0 - 60)); lu = _vm(nt, 'LENGTH', u, None, (x0 + 1640, y0 - 60), out=1)
    rr = _math(nt, 'DIVIDE', lu, R, (x0 + 1800, y0 - 60))
    t = _math(nt, 'DIVIDE', aq, _math(nt, 'MULTIPLY', R, e, (x0 + 1800, y0 - 160)), (x0 + 1960, y0 - 120))
    g = _math(nt, 'DIVIDE', t, _math(nt, 'ADD', _math(nt, 'ABSOLUTE', t, None, (x0 + 2120, y0 - 160)), 1.0, (x0 + 2280, y0 - 160)), (x0 + 2440, y0 - 120))
    E1 = _math(nt, 'EXPONENT', _math(nt, 'MULTIPLY', _math(nt, 'POWER', rr, 2.0, (x0 + 1960, y0)), -2.5, (x0 + 2120, y0)), None, (x0 + 2280, y0))
    bowl = _math(nt, 'MULTIPLY', E1, _math(nt, 'MULTIPLY_ADD', g, -0.5, (x0 + 2600, y0 - 60)), (x0 + 2760, y0)); bowl.node.inputs[1].links[0].from_node.inputs[2].default_value = 1.0
    zr = _math(nt, 'DIVIDE', _math(nt, 'SUBTRACT', rr, 1.0, (x0 + 1960, y0 + 120)), 0.26, (x0 + 2120, y0 + 120))
    E2 = _math(nt, 'EXPONENT', _math(nt, 'MULTIPLY', _math(nt, 'POWER', zr, 2.0, (x0 + 2280, y0 + 120)), -1.0, (x0 + 2440, y0 + 120)), None, (x0 + 2600, y0 + 120))
    cr = _math(nt, 'MULTIPLY', _math(nt, 'POWER', _math(nt, 'ADD', g, 1.0, (x0 + 2600, y0 + 200)), 2.0, (x0 + 2760, y0 + 200)), 0.25, (x0 + 2920, y0 + 200))
    rimh = _math(nt, 'MULTIPLY', _math(nt, 'MULTIPLY', E2, cr, (x0 + 3080, y0 + 160)), d['rim'], (x0 + 3240, y0 + 160))
    h = _math(nt, 'SUBTRACT', rimh, bowl, (x0 + 3400, y0 + 60))                                     # −Schale + Wulst
    h = _math(nt, 'MULTIPLY', h, _math(nt, 'LESS_THAN', rr, 1.5, (x0 + 3240, y0 - 60)), (x0 + 3560, y0))   # Schnitt bei rr = 1,5
    D = _math(nt, 'MULTIPLY', _math(nt, 'MULTIPLY', R, d['slope'] / 1.356, (x0 + 3400, y0 - 200)), depth, (x0 + 3560, y0 - 200))
    h = _math(nt, 'MULTIPLY', _math(nt, 'MULTIPLY', h, D, (x0 + 3720, y0)), mask, (x0 + 3880, y0))
    ve = _n(nt, 'ShaderNodeTexVoronoi', (x0 + 80, y0 - 800), voronoi_dimensions='3D', feature='DISTANCE_TO_EDGE'); ve.inputs['Scale'].default_value = 1.0; ve.inputs['Randomness'].default_value = 1.0
    nt.links.new(xs, ve.inputs['Vector']); h = _math(nt, 'MULTIPLY', h, _smooth(nt, ve.outputs['Distance'], 0.0, 0.22, (x0 + 240, y0 - 800)), (x0 + 4040, y0))
    return _math(nt, 'MULTIPLY', h, sz, (x0 + 4200, y0))   # Zellen → Bezugslängen


def _facet_height(nt, P, size, slope, seed_off, loc):
    """r2 (K1 R2) wie kfbFacets (Z. 218–228): Zellen (Punkte 0,15 + 0,7·Zufall) leicht gekippt, Neigung (2r − 1)·slope, „gedrückt“ smoothstep(0,2, 0,7),
    zum Zellrand weich auf 0 (smoothstep 0 … 0,35 von F2 − F1 ≈ 2·Randabstand). r1 nahm FRACT einer schrägen Ebene → Sägezahn-Streifen (das „Fleckenband“)."""
    x0, y0 = loc
    off = _vm(nt, 'ADD', P, (seed_off * 0.13, seed_off * 0.47, seed_off), (x0 - 200, y0)); xs = _vm(nt, 'SCALE', off, 1.0 / size, (x0 - 60, y0))
    vo = _n(nt, 'ShaderNodeTexVoronoi', (x0 + 80, y0), voronoi_dimensions='3D', feature='F1'); vo.inputs['Scale'].default_value = 1.0; vo.inputs['Randomness'].default_value = 0.7; nt.links.new(xs, vo.inputs['Vector'])
    q = _vm(nt, 'SUBTRACT', xs, vo.outputs['Position'], (x0 + 240, y0)); c = vo.outputs['Color']
    v = _vm(nt, 'MULTIPLY_ADD', _vm(nt, 'FRACTION', _vm(nt, 'MULTIPLY', c, (19.3, 27.7, 23.1), (x0 + 240, y0 - 120)), None, (x0 + 380, y0 - 120)), (2.0, 2.0, 2.0), (x0 + 520, y0 - 120))
    v.node.inputs[2].default_value = (-1.0, -1.0, -1.0)
    h = _vm(nt, 'DOT_PRODUCT', v, q, (x0 + 680, y0), out=1)
    press = _smooth(nt, _sep(nt, c, (x0 + 380, y0 - 260))[2], 0.2, 0.7, (x0 + 520, y0 - 260))
    ve = _n(nt, 'ShaderNodeTexVoronoi', (x0 + 80, y0 - 380), voronoi_dimensions='3D', feature='DISTANCE_TO_EDGE'); ve.inputs['Scale'].default_value = 1.0; ve.inputs['Randomness'].default_value = 0.7
    nt.links.new(xs, ve.inputs['Vector']); edge = _smooth(nt, ve.outputs['Distance'], 0.0, 0.175, (x0 + 240, y0 - 380))
    h = _math(nt, 'MULTIPLY', _math(nt, 'MULTIPLY', h, press, (x0 + 840, y0)), edge, (x0 + 1000, y0))
    return _math(nt, 'MULTIPLY', h, slope * size, (x0 + 1160, y0))


def build_material(name, profile='midground', seed='kfb', ref_world=1.0, k=1.0, base_hex=None, image=None, vcol=None, role_hex=None, pull=0.0, src_rough=1.0, emission=None):
    """Ein Knet-Material. ref_world = Bezugslänge in Welt-Einheiten; k = Welt-Länge je Objekt-Einheit / Bezugslänge (wie uClayK)."""
    pid = resolve_profile(profile); Pp = PROFILES[pid]; sd = seed_from(seed); so = (sd % 9973) / 9973 * 50.0
    m = bpy.data.materials.new(f'kfb-clay:{pid}:{name}'); m.use_nodes = True; nt = m.node_tree; nt.nodes.clear()
    out = _n(nt, 'ShaderNodeOutputMaterial', (2600, 0)); bs = _n(nt, 'ShaderNodeBsdfPrincipled', (2300, 0)); nt.links.new(bs.outputs[0], out.inputs['Surface'])
    tc = _n(nt, 'ShaderNodeTexCoord', (-1400, 0)); P = _n(nt, 'ShaderNodeVectorMath', (-1200, 0), operation='SCALE'); P.inputs['Scale'].default_value = k
    nt.links.new(tc.outputs['Object'], P.inputs[0]); P = P.outputs[0]   # Bezugslängen (Ruhelage, Objektraum)
    # Höhe (Bezugslängen) → Welt: × ref_world
    hs = [_noise_height(nt, P, Pp['lump'][0], Pp['lump'][1], so, (-900, 600))]
    for i, key in enumerate(('dent', 'dent2')): hs.append(_dent_height(nt, P, Pp[key], so + 11.3 * (i + 1), (-900, 100 - 420 * i)))
    if Pp['grain'][1] > 0: hs.append(_noise_height(nt, P, Pp['grain'][0], Pp['grain'][1], so + 41.0, (-900, -800), octave2=False))
    if Pp['facet'][1] > 0: hs.append(_facet_height(nt, P, Pp['facet'][0], Pp['facet'][1], so + 21.0, (-900, -1100)))
    H = hs[0]
    for i, h in enumerate(hs[1:]): H = _math(nt, 'ADD', H, h, (900, 300 - 120 * i))
    Hw = _math(nt, 'MULTIPLY', H, ref_world, (1400, 200))
    bump = _n(nt, 'ShaderNodeBump', (1700, -300)); bump.inputs['Strength'].default_value = 1.0; bump.inputs['Distance'].default_value = 1.0; nt.links.new(Hw, bump.inputs['Height'])
    nt.links.new(bump.outputs['Normal'], bs.inputs['Normal'])
    # Farbe: Quelle (Bild/Vertexfarbe/Wert) → zur Rolle gezogen (Farbton + Sättigung, Helligkeit bleibt) → Fleckung (mottle)
    if image is not None:
        ti = _n(nt, 'ShaderNodeTexImage', (800, 900)); ti.image = image; col = ti.outputs['Color']
    elif vcol:
        va = _n(nt, 'ShaderNodeVertexColor', (800, 900)); va.layer_name = vcol; col = va.outputs['Color']
    else:
        rgb = _n(nt, 'ShaderNodeRGB', (800, 900)); rgb.outputs[0].default_value = tuple(_lin(base_hex or role_hex or '#bdb3a6')) + (1,); col = rgb.outputs[0]
    if role_hex and pull > 0:
        rc = _n(nt, 'ShaderNodeRGB', (800, 700)); rc.outputs[0].default_value = tuple(_lin(role_hex)) + (1,)
        for j, mode in enumerate(('HUE', 'SATURATION')):
            mx = _n(nt, 'ShaderNodeMix', (1000 + 180 * j, 850), data_type='RGBA', blend_type=mode); mx.inputs['Factor'].default_value = pull
            nt.links.new(col, mx.inputs[6]); nt.links.new(rc.outputs[0], mx.inputs[7]); col = mx.outputs[2]
    mt = _n(nt, 'ShaderNodeTexNoise', (1000, 600), noise_dimensions='3D'); mt.inputs['Scale'].default_value = 1.0 / (Pp['lump'][0] * 1.6); mt.inputs['Detail'].default_value = 0.0
    off = _n(nt, 'ShaderNodeVectorMath', (800, 520), operation='ADD'); off.inputs[1].default_value = (31.7, 31.7, 31.7); nt.links.new(P, off.inputs[0]); nt.links.new(off.outputs[0], mt.inputs['Vector'])
    fac = _math(nt, 'MULTIPLY_ADD', mt.outputs['Fac'], 2.0 * Pp['mottle'], (1200, 600)); fac.node.inputs[2].default_value = 1.0 - Pp['mottle']   # 1 + mottle·(2n−1)
    mul = _n(nt, 'ShaderNodeMix', (1500, 800), data_type='RGBA', blend_type='MULTIPLY'); mul.inputs['Factor'].default_value = 1.0
    cfac = _n(nt, 'ShaderNodeCombineColor', (1350, 600)); [nt.links.new(fac, cfac.inputs[i]) for i in range(3)]
    nt.links.new(col, mul.inputs[6]); nt.links.new(cfac.outputs[0], mul.inputs[7]); nt.links.new(mul.outputs[2], bs.inputs['Base Color'])
    bs.inputs['Roughness'].default_value = max(ROUGH_FLOOR, Pp['roughMin'], min(1.0, src_rough)); bs.inputs['Metallic'].default_value = 0.0
    bs.inputs['Sheen Weight'].default_value = min(SHEEN_MAX, Pp['sheen']); bs.inputs['Sheen Roughness'].default_value = 0.9; bs.inputs['Specular IOR Level'].default_value = 0.5
    bs.inputs['Emission Strength'].default_value = 0.0; bs.inputs['Coat Weight'].default_value = 0.0
    if Pp['emissive'] and emission and (emission.get('image') or any(c > 0 for c in emission['color'][:3])) and emission['strength'] > 0:   # Z. 324: P.emissive && src.emissive → kopieren
        bs.inputs['Emission Color'].default_value = tuple(emission['color'][:3]) + (1,); bs.inputs['Emission Strength'].default_value = emission['strength']
        if emission.get('image'): et = _n(nt, 'ShaderNodeTexImage', (1500, 300)); et.image = emission['image']; nt.links.new(et.outputs['Color'], bs.inputs['Emission Color'])
    m['kfb_material'] = f'{VERSION}/{pid}'; m['kfb_clay'] = json.dumps({'schema': SCHEMA, 'module': MODULE, 'profile': pid, 'seed': sd, 'k': round(k, 6), 'ref_world': round(ref_world, 4), 'role_hex': role_hex, 'pull': round(pull, 3)})
    return m


# ------------------------------------------------------------------ Anwenden
def _src_info(mat):
    """Grundfarbe/Bild/Vertexfarbe/Rauheit aus einem importierten Material (glTF-Principled)."""
    if mat is None or not mat.use_nodes: return dict(base_hex=None, image=None, vcol=None, rough=1.0, emission=None)
    bs = next((n for n in mat.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'), None); img = None; vcol = None; base = None; rough = 1.0; em = None
    if bs:
        rough = bs.inputs['Roughness'].default_value
        ec = bs.inputs['Emission Color']; eimg = next((l.from_node.image for l in ec.links if l.from_node.type == 'TEX_IMAGE'), None) if ec.is_linked else None
        em = {'color': list(ec.default_value), 'strength': bs.inputs['Emission Strength'].default_value, 'image': eimg}
        bc = bs.inputs['Base Color']
        if bc.is_linked:
            stack = [bc.links[0].from_node]
            while stack:
                n = stack.pop()
                if n.type == 'TEX_IMAGE' and n.image and not any(k in n.image.name.lower() for k in ('ao', 'bake', 'light', 'shadow')): img = n.image; break
                if n.type in ('VERTEX_COLOR', 'ATTRIBUTE'): vcol = getattr(n, 'layer_name', None) or getattr(n, 'attribute_name', None); break
                stack += [l.from_node for i in n.inputs for l in i.links]
        else:
            c = bc.default_value; base = '#' + ''.join('%02x' % int(round(255 * (x * 12.92 if x <= 0.0031308 else 1.055 * x ** (1 / 2.4) - 0.055))) for x in c[:3])
    return dict(base_hex=base, image=img, vcol=vcol, rough=rough, emission=em)


def _world_height(objs):
    zs = [(o.matrix_world @ v.co).z for o in objs for v in o.data.vertices]
    return (max(zs) - min(zs)) if zs else 1.0


def apply(ob, role, palette, tone=1, profile=None, seed=None, source='kit', pull=None, scale_ref=None, set_props=True, skip=SKIP):
    """Eingangsprüfung (V-565): alle Meshes unter ob → kfb-clay mit Rollenfarbe. source: 'own' (Rollenton direkt), 'kit' (Kit-Textur umgetönt),
    'meshy' (leicht getönt, ≤ MAX_PULL). scale_ref: Bezugslänge in Welt-Einheiten (Standard: Figur = Objekthöhe, sonst FrizzleBob-Höhe wie Proof Stage).
    Rückgabe: Bericht (dict). Setzt auf ob: kfb_role, kfb_color (Rollenton), kfb_clay_profile."""
    pal = load_palette(palette) if not isinstance(palette, dict) or not all(isinstance(v, list) for v in palette.values()) else palette
    rhex = role_color(pal, role, tone); pid = resolve_profile(profile or ROLE_PROFILE.get(role, 'midground'))
    meshes = [o for o in [ob] + list(ob.children_recursive) if o.type == 'MESH' and not any(s in o.name.lower() for s in skip)]
    ref = scale_ref or (_world_height(meshes) if pid == 'character' else FB_HEIGHT_U)
    p = SOURCE_PULL.get(source, 0.85) if pull is None else min(1.0, max(0.0, pull))
    if source == 'meshy': p = min(p, MAX_PULL)
    rep = {'object': ob.name, 'role': role, 'tone': tone, 'color': rhex, 'profile': pid, 'source': source, 'pull': round(p, 3), 'ref_world': round(ref, 4), 'meshes': [], 'replaced': 0}
    cache = {}
    for o in meshes:
        wscale = (abs(o.matrix_world.to_3x3().determinant())) ** (1 / 3); k = wscale / ref
        for slot in o.material_slots:
            src = slot.material; key = (src.name if src else None, round(k, 5))
            if key not in cache:
                si = _src_info(src); own = source == 'own' or (si['image'] is None and si['vcol'] is None and si['base_hex'] is None)   # r2 (K4): Kit mit reiner Grundfarbe wird angezogen (pull), nicht ersetzt
                cache[key] = build_material(f'{ob.name}:{src.name if src else "none"}', pid, seed if seed is not None else ob.name, ref, k,
                                            base_hex=rhex if own else si['base_hex'], image=None if own else si['image'], vcol=None if own else si['vcol'],
                                            role_hex=None if own else rhex, pull=0.0 if own else p, src_rough=si['rough'], emission=si['emission'])
            slot.material = cache[key]; rep['replaced'] += 1
        if not o.material_slots:
            m = build_material(f'{ob.name}:none', pid, seed if seed is not None else ob.name, ref, k, base_hex=rhex); o.data.materials.append(m); rep['replaced'] += 1
        rep['meshes'].append({'name': o.name, 'k': round(k, 5)})
    if set_props: ob['kfb_role'] = role; ob['kfb_color'] = rhex; ob['kfb_clay_profile'] = pid
    return rep


def write_asset_pass(path, ob=None, glb=None, origin=None, licence=None, role=None, color=None, profile=None, form_dna=None, wear=None, scale=None, placement=None, kit=None, notes=None):
    """Asset-Pass (V-566, Kanon Gebiet 15): Ursprung und Lizenz, Knet-Profil, Rollenfarbe, Form-DNA, Gebrauchsspuren, Maßstab, erlaubte Platzierung."""
    d = {'schema': 'kfb.asset-pass/1', 'module': MODULE, 'asset': (ob.name if ob else None) or (os.path.basename(glb) if glb else None),
         'origin': origin, 'licence': licence, 'kit': kit, 'clay': {'version': VERSION, 'profile': profile or (ob.get('kfb_clay_profile') if ob else None)},
         'role': role or (ob.get('kfb_role') if ob else None), 'color': color or (ob.get('kfb_color') if ob else None),
         'form_dna': form_dna, 'wear': wear or [], 'scale': scale, 'placement': placement, 'notes': notes}
    if glb and os.path.exists(glb): d['glb'] = {'path': glb, 'sha256': hashlib.sha256(open(glb, 'rb').read()).hexdigest()}
    missing = [k for k in ('origin', 'licence', 'role', 'color', 'form_dna', 'scale', 'placement') if not d.get(k) and not (k == 'form_dna' and d.get(k) == {})]
    d['complete'] = not missing; d['missing'] = missing
    json.dump(d, open(path, 'w'), indent=1, ensure_ascii=False)
    if ob is not None: ob['kfb_asset_pass'] = path
    return d
