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


def _dent_height(nt, P, d, seed_off, loc):
    """Dellen-Lage: Voronoi-Zellen (Zellgröße d.size); Zelle trägt eine Delle mit Wahrscheinlichkeit density (Mittel des Cluster-Felds 1,2 → × 1,2, gekappt);
    Schale −D·exp(−2,5 (r/R)²), R = radius (Zellen), D = slope·R/1,356 (wie kfbDentLayer, Medianwerte)."""
    off = _n(nt, 'ShaderNodeVectorMath', (loc[0] - 180, loc[1]), operation='ADD'); off.inputs[1].default_value = (seed_off * 0.71, seed_off, seed_off * 0.29); nt.links.new(P, off.inputs[0])
    vo = _n(nt, 'ShaderNodeTexVoronoi', loc, voronoi_dimensions='3D', feature='F1', distance='EUCLIDEAN'); vo.inputs['Scale'].default_value = 1.0 / d['size']; vo.inputs['Randomness'].default_value = 1.0
    nt.links.new(off.outputs[0], vo.inputs['Vector'])
    R = d['radius']; D = d['slope'] * R / 1.356
    rr = _math(nt, 'DIVIDE', vo.outputs['Distance'], R, (loc[0] + 180, loc[1])); e = _math(nt, 'POWER', rr, 2.0, (loc[0] + 340, loc[1]))
    e = _math(nt, 'MULTIPLY', e, -2.5, (loc[0] + 500, loc[1])); e = _math(nt, 'EXPONENT', e, None, (loc[0] + 660, loc[1]))
    sep = _n(nt, 'ShaderNodeSeparateColor', (loc[0] + 180, loc[1] - 160)); nt.links.new(vo.outputs['Color'], sep.inputs['Color'])
    mask = _math(nt, 'LESS_THAN', sep.outputs[0], min(1.0, d['density'] * 1.2), (loc[0] + 340, loc[1] - 160))
    depth = _math(nt, 'MULTIPLY', sep.outputs[1], 0.7, (loc[0] + 500, loc[1] - 200)); depth = _math(nt, 'ADD', depth, 0.65, (loc[0] + 660, loc[1] - 200))   # 0,65 … 1,35
    h = _math(nt, 'MULTIPLY', e, mask, (loc[0] + 820, loc[1])); h = _math(nt, 'MULTIPLY', h, depth, (loc[0] + 980, loc[1]))
    ve = _n(nt, 'ShaderNodeTexVoronoi', (loc[0], loc[1] - 320), voronoi_dimensions='3D', feature='DISTANCE_TO_EDGE'); ve.inputs['Scale'].default_value = 1.0 / d['size']; ve.inputs['Randomness'].default_value = 1.0
    nt.links.new(off.outputs[0], ve.inputs['Vector'])   # Zellrand: Delle weich auf 0 (Blender-Voronoi kennt nur die nächste Zelle; das Web-Modul summiert 27 Zellen, ohne Naht)
    fr = _n(nt, 'ShaderNodeMapRange', (loc[0] + 180, loc[1] - 320), interpolation_type='SMOOTHSTEP'); fr.inputs['From Min'].default_value = 0.0; fr.inputs['From Max'].default_value = 0.22
    nt.links.new(ve.outputs['Distance'], fr.inputs['Value']); h = _math(nt, 'MULTIPLY', h, fr.outputs['Result'], (loc[0] + 1060, loc[1] - 80))
    return _math(nt, 'MULTIPLY', h, -D * d['size'], (loc[0] + 1140, loc[1]))


def _facet_height(nt, P, size, slope, seed_off, loc):
    off = _n(nt, 'ShaderNodeVectorMath', (loc[0] - 180, loc[1]), operation='ADD'); off.inputs[1].default_value = (seed_off * 0.13, seed_off * 0.47, seed_off); nt.links.new(P, off.inputs[0])
    vo = _n(nt, 'ShaderNodeTexVoronoi', loc, voronoi_dimensions='3D', feature='F1'); vo.inputs['Scale'].default_value = 1.0 / size; nt.links.new(off.outputs[0], vo.inputs['Vector'])
    dot = _n(nt, 'ShaderNodeVectorMath', (loc[0] + 180, loc[1]), operation='DOT_PRODUCT'); nt.links.new(vo.outputs['Color'], dot.inputs[0]); nt.links.new(off.outputs[0], dot.inputs[1])
    s = _n(nt, 'ShaderNodeSeparateColor', (loc[0] + 180, loc[1] - 160)); nt.links.new(vo.outputs['Color'], s.inputs['Color'])
    press = _math(nt, 'GREATER_THAN', s.outputs[2], 0.45, (loc[0] + 340, loc[1] - 160))
    h = _math(nt, 'FRACT', dot.outputs['Value'], None, (loc[0] + 340, loc[1])); h = _math(nt, 'SUBTRACT', h, 0.5, (loc[0] + 500, loc[1]))
    h = _math(nt, 'MULTIPLY', h, press, (loc[0] + 660, loc[1])); return _math(nt, 'MULTIPLY', h, slope * size, (loc[0] + 820, loc[1]))


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
                si = _src_info(src); own = source == 'own' or (si['image'] is None and si['vcol'] is None)
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
