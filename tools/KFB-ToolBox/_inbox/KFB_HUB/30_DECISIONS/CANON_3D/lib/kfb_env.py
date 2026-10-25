# kfb_env · Umgebungs-Grammatik + Regel-Gate für JEDEN 3D-Job (V-563, Kanon CANON_3D_R1.md)
# Quellen (Zahlen 1:1, nicht neu erfunden):
#   ETHERINGTON_REGELN_IN_ZAHLEN_R1 (R2-Stand 09.10., §1–§6) · QA_RULEBOOK_ENVIRONMENT_R1 (H1–H12, E1–E7) ·
#   SPEC_PLACEMENT_GRAMMAR_R2 (§0 Zahlen-Regeln, §2 nest/relax, §4 Steine) · KONZEPT_ORTSBIOGRAFIE_UND_BAUSATZ_R1 (§2 vier Schichten, §3 Codes/Signatur/Rollen)
#   Port der Prüfer aus kfb-planet src/world/grammar.js (ruleReport, Lesart A4) – gleiche Toleranzen.
# Rein Python, ohne bpy: läuft in Blender (headless) und in jeder Shell. Blender-Adapter: kfb_env_bpy.py.
#
# Eingabe kfb.env-scene/1 (JSON):
# { "id", "kind": "diorama|resident|scenelet|island|proof", "units_per_H": 1.0, "ground": {"kind": "terrain|island|disc|plate", "samples_z": [...]},
#   "area": {"min": [x, y], "max": [x, y]}, "landmark": "<object id>",
#   "concept": {"story", "image_idea", "focal", "palette_roles": {...}, "material_codes": [...], "story_beat"},   # Konzeptblatt (V-561)
#   "objects": [{ "id", "kind": "rock|rockgroup|tree|bush|grass|prop|building|stone_L|stone_M|stone_S|fluff|character|vehicle|water_plant",
#                 "role": "ground|stone|bark|leaf|grass|bloom|accent|prop|figure", "layer": 1..4, "story": "wer/womit/warum",
#                 "group": "g1", "c": [x, y, z], "r": footprint-radius, "h": höhe, "bottom_z": mesh-unterkante, "ground_z": gelände unter dem fuß,
#                 "signature": "hero|echo|null", "asset": "kit/datei", "kit": "kaykit|kenney|quaternius|kfb|meshy", "rot_z": deg,
#                 "material": "kfb-clay.v1.1/<profil>", "baked_light": false, "color": "#rrggbb" (Rollenton),
#                 "meaning": "ziel|gefahr|interaktion|figur|erzählkern" (Pflicht bei role accent), "asset_pass": "<pfad>.asset_pass.json" (Pflicht bei Kit/Meshy) }] }
import json, math, random, os
# r3 (WSB, V-763, Freigabe über WS0): ENV-KONTAKTFENSTER nur für Anker und frei stehende Objekte (Slots in CONTACT_SHARED teilen den Kontakt des Ankers); H5 nur für Landmarken,
#   ein Fokus (scene.focus oder Slot focus) erfüllt die Benennung ohne Höhenregel, Ü6-Ring auch um den Fokus; Ü3 mit Slots nur über Stützen und Akzent; H9 ohne Mikro-Ebene (Kiesel, Kontakt); neighbourSpread erst ab n = 3. Stand davor: kfb_env.r2_vor_V763.py
# r2 (WSB N39, Nachtrag 36, Freigabe über WS0, Georg q201): Zahlen kommen aus der einen Regeldatei CANON_3D/lib/kfb_place.r1.json (rules.sink, sink_cap,
#   group, nest, zone, contact, ordered, lean, biography, gates_prefix). Die Konstanten unten bleiben nur als Rückfall (mit Warnung, V-749 Nr. 9).
#   Gate-Codes tragen das Präfix ENV- (alter Code in Klammern), neu: ENV-ORDNUNG, ENV-KONTAKTFENSTER, ENV-LEHNE-Ü1…Ü7, ENV-BIOGRAFIE (Schichten, Signatur, Spuren).

# ------------------------------------------------------------------ Zahlen der Quellen
SINK = {  # Anteil der Höhe unter dem Gelände [min, max] – Etherington §2 [KFB-Startwerte], Grammatik §4.1 für Steinkit
    'rock': (0.40, 0.50), 'rockgroup': (0.20, 0.35), 'tree': (0.05, 0.10), 'bush': (0.05, 0.12), 'building': (0.0, 0.15),
    'prop': (0.02, 0.05), 'prop_buried': (0.40, 0.95), 'stone_L': (0.40, 0.50), 'stone_M': (0.35, 0.50), 'stone_S': (0.30, 0.40),  # prop_buried: bewusst tief versunkenes Requisit mit Geschichte (Disco-Pult, RA y −1,9; V-571)
    'grass': (0.0, 1.0), 'fluff': (0.0, 1.0), 'contact': (0.25, 1.0), 'water_plant': (0.0, 1.0), 'character': (0.0, 0.03), 'vehicle': (0.0, 0.03),
}
SINK_CAP = 0.50  # [I] Georg 20.10.: Findling als umgekehrter Eisberg, Kappe ≤ 50 % (V-570)
RULES = dict(size_tol=0.20, spread_tune=0.45, spread_target=0.50, spread=0.30, line_tol=0.05, neighbour_r=4.5, overlap=0.85, air=1.25,  # grammar.js GRAMMAR.rules
             neg_space=0.30, float_tol_H=0.003, landmark_front=0.60, repeat_max=3, clone_dist_H=6 / 3.64,
             ratio_LMS=(1, 3, 9), groups=(2, 4))
NEST = dict(sizes=(1.0, 0.62, 0.38), med=(-1.2, 0.1, 1.3), small=(-0.6, 0.7, -2.0, 2.05, 3.1), k=0.86, spread=1.75)
LAYERS = {1: 'Entstehen', 2: 'Nutzen', 3: 'Vergehen', 4: 'Bewachsen'}
ROLES = {'ground', 'stone', 'bark', 'leaf', 'grass', 'bloom', 'accent', 'prop', 'figure', 'water'}
CONCEPT_FIELDS = ('one_sentence', 'story', 'image_idea', 'focal', 'space', 'color_script', 'form_dna', 'life_anchor', 'palette_roles', 'material_codes', 'biography', 'story_beat')
ENV_KINDS = {'rock', 'rockgroup', 'tree', 'bush', 'grass', 'prop', 'building', 'stone_L', 'stone_M', 'stone_S', 'fluff', 'water_plant', 'path_stone', 'rubble', 'dust'}   # r2: + path_stone, rubble, dust (rules.sink)
CONTACT = dict(perimeter=(0.40, 0.50), gap_min=0.25); CONTACT_SHARED = ('support', 'accent', 'pebble', 'echo', 'path', 'contact', 'fluff_hero', 'fluff_side', 'find'); ORDERED = dict(gap_min_m=1.2, skip=['odd', 'collinear']); LEAN = dict(lean_tol=15, lean_exc=(25, 45), pebble_tilt=(15, 0.20), grass_gap=0.25,
    primary_max=3, height_tol=0.10, focal_ring=0.5, interact_free_H=1.0, tree_lean=(0.2, 0.4)); BIO = dict(layers_required=[1, 2, 3, 4], signature='1 Hero + 2 Echos', wear_marks_min=2); PREFIX = 'ENV-'
WARN = []
KEY_MAP = {'overlap': 'rules.group.overlap_max', 'air': 'rules.group.air_min', 'spread': 'rules.group.spread_pair_min', 'size_tol': 'rules.group.size_tol', 'spread_tune': 'rules.group.spread_tune',
           'spread_target': 'rules.group.spread_target', 'line_tol': 'rules.group.line_tol', 'neighbour_r': 'rules.group.neighbour_r', 'float_tol_H': 'rules.group.float_tol_H', 'repeat_max': 'rules.group.repeat_max',
           'clone_dist_H': 'rules.group.clone_dist_H', 'neg_space': 'rules.zone.neg_space_min', 'landmark_front': 'rules.zone.landmark_front', 'ratio_LMS': 'rules.zone.ratio_LMS', 'groups': 'rules.zone.groups',
           'SINK': 'rules.sink', 'SINK_CAP': 'rules.sink_cap', 'NEST': 'rules.nest (relax_out 0,85/1,25 statt 0,92)'}
def _load_place():
    here = os.path.dirname(os.path.abspath(__file__)); cand = [os.environ.get('KFB_PLACE_RULES'), os.path.join(here, 'kfb_place.r1.json'), os.path.join(here, '..', '..', '..', '30_DECISIONS', 'CANON_3D', 'lib', 'kfb_place.r1.json')]
    for c in cand:
        if c and os.path.exists(c): return json.load(open(c)), os.path.abspath(c)
    return None, None
CFG, CFG_PATH = _load_place()
if CFG:
    _r = CFG['rules']; _g, _z, _n = _r['group'], _r['zone'], _r['nest']
    SINK = {k: tuple(v) for k, v in _r['sink'].items()}; SINK_CAP = _r['sink_cap']
    RULES = dict(size_tol=_g['size_tol'], spread_tune=_g['spread_tune'], spread_target=_g['spread_target'], spread=_g['spread_pair_min'], line_tol=_g['line_tol'], neighbour_r=_g['neighbour_r'],
                 overlap=_g['overlap_max'], air=_g['air_min'], neg_space=_z['neg_space_min'], float_tol_H=_g['float_tol_H'], landmark_front=_z['landmark_front'], repeat_max=_g['repeat_max'],
                 clone_dist_H=_g['clone_dist_H'], ratio_LMS=tuple(_z['ratio_LMS']), groups=tuple(_z['groups']))
    NEST = dict(sizes=tuple(_n['sizes']), med=tuple(_n['med']), small=tuple(_n['small']), k=_n['k'], spread=_n['spread'])
    CONTACT = dict(perimeter=tuple(_r['contact']['perimeter']), gap_min=_r['contact']['gap_min']); ORDERED = dict(gap_min_m=_r['ordered']['gap_min_m'], skip=_r['ordered']['skip'])
    LEAN = {k: (tuple(v) if isinstance(v, list) else v) for k, v in _r['lean'].items()}; BIO = dict(_r['biography']); PREFIX = _r['gates_prefix']['env']
else:
    WARN.append('kfb_place.r1.json nicht gefunden: Rückfall auf die eingebauten Konstanten (r1)')
CODES = {'K0': 'KONZEPT', 'B1': 'BODEN', 'B2': 'BODEN-TELLER', 'S1': 'STORY', 'S2': 'ROLLE', 'S3': 'SCHICHT', 'E1': 'SCHWEBEN', 'E2': 'EINSINKEN', 'M1': 'MATERIAL', 'M2': 'LICHT-GEBACKEN',
         'M3': 'PALETTE', 'M4': 'AKZENT', 'M5': 'ASSETPASS', 'C1': 'KONTAKT', 'S4': 'BIOGRAFIE', 'G1': 'GRUPPE', 'G2': 'STREUUNG', 'H3': 'NEGATIVRAUM', 'H4': 'ZONE', 'H5': 'LANDMARKE',
         'H7': 'STAFFEL', 'S5': 'SIGNATUR', 'H9': 'KIT', 'H11': 'KLON', 'RPT': 'WIEDERHOLUNG'}
def code(c): return PREFIX + CODES[c] + f' [{c}]' if c in CODES else (c if c.startswith(PREFIX) else PREFIX + c)


def _d2(a, b): return math.hypot(a[0] - b[0], a[1] - b[1])


# ------------------------------------------------------------------ Bau-Operatoren (Grammatik §2, deterministisch über seed)
def nest(p, count=5, R=1.0, seed=1, hang=0.0, spread=NEST['spread']):
    """1 groß, ~3 mittel, Rest klein (1 : 0,62 : 0,38), Abstand (R + r)·0,86·spread. hang = Fallrichtung (rad, xy). Ungerade count."""
    if count % 2 == 0: count -= 1
    rnd, out = random.Random(seed), []
    size = lambda i: R * NEST['sizes'][0 if i == 0 else 1 if i <= 3 else 2] * (0.9 + 0.2 * rnd.random())
    out.append({'c': [p[0], p[1]], 'r': size(0), 'role': 'anchor'})
    for i in range(1, min(3, count - 1) + 1):
        r = size(i); a = hang + NEST['med'][i - 1] + (rnd.random() - 0.5) * 0.5; d = (R + r) * NEST['k'] * spread * (0.9 + 0.3 * rnd.random())
        out.append({'c': [p[0] + math.cos(a) * d, p[1] + math.sin(a) * d], 'r': r, 'role': 'support'})
    for i in range(4, min(count, 4 + len(NEST['small']))):
        r = size(i); a = hang + NEST['small'][i - 4] + (rnd.random() - 0.5) * 0.4; d = (R * 1.62 + r * 0.9) * spread * (0.9 + 0.3 * rnd.random())
        out.append({'c': [p[0] + math.cos(a) * d, p[1] + math.sin(a) * d], 'r': r, 'role': 'pebble'})
    return relax(out)


def nest_ok(p, count=5, R=1.0, seed=1, hang=0.0, tries=16):
    """nest() mit Durchsetzung der Zahlen-Regeln wie grammar.js A4: Neuversuch mit abgeleitetem Seed, bis rule_report ok."""
    for t in range(tries):
        out = nest(p, count, R, seed * 7919 + t, hang)
        rr = rule_report(out)
        if rr['ok']: return out
        if rr['failed'] == ['neighbourSpread']:  # A4: zu gleichmäßig → kleinste Stütze sinkt in den Anker (Überlappung ≥ 15 % ist gültig)
            a = out[0]; s = min(out[1:], key=lambda it: it['r']); d = _d2(a['c'], s['c']) or 1; want = 0.85 * (a['r'] + s['r'])
            s['c'] = [a['c'][0] + (s['c'][0] - a['c'][0]) * want / d, a['c'][1] + (s['c'][1] - a['c'][1]) * want / d]
            if rule_report(out)['ok']: return out
    raise ValueError(f'nest_ok: keine regelkonforme Gruppe nach {tries} Versuchen (count={count})')


def contact(o, n=3, seed=1, hang=0.0, what='stone_S'):
    """Kontakt-Geometrie (V-565, Etherington „Überlappen“): n kleine Knet-Elemente an der Fuß-Linie von o, bergab gehäuft, ungleiche Abstände.
    Ergebnis-Objekte haben kind 'contact' (Mikro-Ebene, zählt nicht in die Gruppen-Zahlenregeln) und erben Gruppe/Schicht von o."""
    rnd, out, r0 = random.Random(seed), [], max(0.06, 0.12 * o['r'])
    for i in range(n):
        a = hang + (-0.9 + 0.75 * i + (rnd.random() - 0.5) * 0.5); d = o['r'] * (0.95 + 0.25 * rnd.random()) + r0 * (0.6 + 0.9 * i)
        r = r0 * (1.0, 0.7, 0.5, 0.4, 0.3)[min(i, 4)]
        out.append({'id': f"{o.get('id', 'o')}_contact{i}", 'kind': 'contact', 'what': what, 'role': 'stone' if what.startswith('stone') else 'grass',
                    'layer': 3 if what.startswith('stone') else 4, 'group': o.get('group'), 'story': f"bricht die Fuge von {o.get('id', 'o')} ({what})",
                    'c': [o['c'][0] + math.cos(a) * d, o['c'][1] + math.sin(a) * d], 'r': r, 'h': r * 1.2, 'material': o.get('material')})
    return out


def relax(items, k=8, pull=0.85, gap=1.25, split=1.05):
    """Kontur-Regel: d/(ra+rb) nie im Band 0,85–1,25 (unter 1,05 → Klumpen 0,85, sonst Luft 1,25)."""
    for _ in range(k):
        for i in range(len(items)):
            for j in range(i + 1, len(items)):
                a, b = items[i], items[j]; d = _d2(a['c'], b['c']); s = a['r'] + b['r']; q = d / s if s else 9
                if d <= 1e-9 or q <= pull + 1e-6 or q >= gap - 1e-6: continue
                want = (pull if q < split else gap) * s * 1.0001; ux, uy = (b['c'][0] - a['c'][0]) / d, (b['c'][1] - a['c'][1]) / d; m = (want - d) / 2
                a['c'] = [a['c'][0] - ux * m, a['c'][1] - uy * m]; b['c'] = [b['c'][0] + ux * m, b['c'][1] + uy * m]
    return items


# ------------------------------------------------------------------ Prüfer einer Gruppe (Port ruleReport, Lesart A4)
def rule_report(items, R=RULES):
    P = [it['c'] for it in items]; r = [it.get('r', 1.0) for it in items]; n = len(items)
    nn, nnd = [], []
    for i in range(n):
        best = min(((j, _d2(P[i], P[j])) for j in range(n) if j != i), key=lambda t: t[1], default=(-1, math.inf)); nn.append(best[0]); nnd.append(best[1])
    same, seen = 0, set()
    for i in range(n):
        j = nn[i]; key = (min(i, j), max(i, j))
        if j < 0 or key in seen: continue
        seen.add(key)
        if abs(r[i] - r[j]) / max(r[i], r[j]) < R['size_tol']: same += 1
    fin = [d for d in nnd if math.isfinite(d)]; mx = max(fin) if fin else 0
    spread = (mx - min(fin)) / mx if len(fin) >= 3 and mx > 0 else 1.0   # r3: bei n = 2 sind beide Nachbarabstände gleich (Spread immer 0) – nicht messbar, kein FAIL
    near = lambda a, b: _d2(P[a], P[b]) <= R['neighbour_r'] * (r[a] + r[b]) / 2
    lines = 0
    for m in range(n):
        for a in range(n):
            if a == m or not near(a, m): continue
            for c in range(a + 1, n):
                if c == m or not near(c, m): continue
                acx, acy = P[c][0] - P[a][0], P[c][1] - P[a][1]; L2 = acx * acx + acy * acy
                if L2 <= 0: continue
                amx, amy = P[m][0] - P[a][0], P[m][1] - P[a][1]; t = (amx * acx + amy * acy) / L2
                if 0 < t < 1 and math.hypot(amx - acx * t, amy - acy * t) <= R['line_tol'] * math.sqrt(L2): lines += 1
    touch = sum(1 for i in range(n) for j in range(i + 1, n) if R['overlap'] < _d2(P[i], P[j]) / (r[i] + r[j]) < R['air'])
    failed = [k for k, bad in (('odd', n % 2 == 0), ('sameSizeAdjacent', same > 0), ('neighbourSpread', spread < R['spread']),
                               ('collinear', lines > 0), ('nearTouch', touch > 0)) if bad]
    return {'n': n, 'sameSize': same, 'spread': round(spread, 4), 'lines': lines, 'nearTouch': touch, 'ok': not failed, 'failed': failed}


# ------------------------------------------------------------------ Szenen-Gate
def _neg_space(scene, objs, step=None):
    a = scene.get('area')
    if not a: return None
    (x0, y0), (x1, y1) = a['min'], a['max']; step = step or max(x1 - x0, y1 - y0) / 120; free = tot = 0
    y = y0
    while y <= y1:
        x = x0
        while x <= x1:
            tot += 1; free += all(_d2((x, y), o['c']) > o['r'] for o in objs); x += step
        y += step
    return free / tot if tot else None


def gate(scene, R=RULES):
    """Mechanisches Gate. Ergebnis {'ok', 'fail': [...], 'findings': [...], 'groups': {...}}. FAIL = harte Regel verletzt."""
    H = scene.get('units_per_H', 1.0); objs = scene.get('objects', []); env = [o for o in objs if o.get('kind') in ENV_KINDS]
    fail, find = [], []
    F = lambda c, msg: fail.append(f'{code(c)} {msg}')
    # K0 Konzeptblatt (V-561: WS0 schreibt es, ohne Blatt kein Bau)
    miss = [f for f in CONCEPT_FIELDS if not (scene.get('concept') or {}).get(f)]
    if miss: F('K0', 'Konzeptblatt fehlt/unvollständig: ' + ', '.join(miss))
    # Boden: keine Scheibe/Platte, kein flacher Teller (Georg 20.10. „Props auf eine Scheibe“)
    g = scene.get('ground', {})
    if g.get('kind') in ('disc', 'plate', None): F('B1', f"Grund = {g.get('kind')!r}: Props auf Scheibe/Platte verboten, Terrain oder Inselkörper (V-142/V-167)")
    for o in objs:
        if o.get('kind') == 'untagged_plate': F('B1', f"{o['id']}: unmarkierte Scheibe/Platte unter der Szene (Ø {2 * o['r']:.1f}) – Props gehören ins Gelände")
    zs = g.get('samples_z') or []; a = scene.get('area')
    if zs and a:
        ext = max(a['max'][0] - a['min'][0], a['max'][1] - a['min'][1]) or 1
        if (max(zs) - min(zs)) / ext < 0.02: F('B2', 'Gelände ist ein flacher Teller (Höhenspanne < 2 % der Ausdehnung)')
    # Jedes Element: Geschichte, Rolle, Schicht (QA §00, Ortsbiografie §2/§3)
    for o in objs:
        oid = o.get('id', '?')
        if o.get('kind') in ENV_KINDS:
            if not o.get('story'): F('S1', f'{oid}: keine Geschichte (wer/womit/warum) → nicht bauen')
            if o.get('role') not in ROLES: F('S2', f"{oid}: Palettenrolle fehlt/ungültig ({o.get('role')})")
            if o.get('layer') not in LAYERS: F('S3', f'{oid}: Ortsbiografie-Schicht fehlt (1–4)')
        # E1 Schweben / E2 Einsinken (H1)
        if all(k in o for k in ('bottom_z', 'ground_z', 'h')) and o.get('h'):
            lo, hi = SINK.get(o.get('kind'), (0.0, 1.0)); sink = (o['ground_z'] - o['bottom_z']) / o['h']
            if o['bottom_z'] - o['ground_z'] > R['float_tol_H'] * H: F('E1', f'{oid}: schwebt ({o["bottom_z"] - o["ground_z"]:.3f} über Grund)')
            elif o.get('kind') in ('rock', 'rockgroup', 'stone_L', 'stone_M', 'stone_S') and sink > SINK_CAP + 0.02: F('E2', f'{oid}: Einsinken {sink:.0%} über Kappe 50 % (V-570)')
            elif not (lo - 0.02 <= sink <= hi + 0.02): F('E2', f"{oid}: Einsinken {sink:.0%} außerhalb {lo:.0%}–{hi:.0%} ({o.get('kind')})")
    # M1–M3 Einpassung ins Terrain (Kanon Gebiet 15): ein Material, kein eingebackenes Licht, Farben nur aus der Palette
    pal = {str(v).lower() for v in ((scene.get('concept') or {}).get('palette_roles') or {}).values() if isinstance(v, str)}
    for o in objs:
        oid = o.get('id', '?')
        if (o.get('kind') in ENV_KINDS or o.get('material') is not None) and not str(o.get('material') or '').startswith('kfb-clay'): F('M1', f"{oid}: Material {o.get('material')!r} statt kfb-clay (fremde Textur liegt auf dem Terrain)")
        if o.get('baked_light'): F('M2', f'{oid}: eingebackenes Licht/AO – nur das eine Rig (V-385)')
        if o.get('role') == 'accent' and not o.get('meaning') and o.get('id') != scene.get('landmark'): F('M4', f'{oid}: Akzentfarbe ohne Bedeutung (Ziel, Gefahr, Interaktion, Figur, Erzählkern), V-566')
        if o.get('kit') in ('kaykit', 'kenney', 'quaternius', 'meshy', 'tinytreats') and o.get('kind') in ENV_KINDS and not o.get('asset_pass'): F('M5', f'{oid}: Asset-Pass fehlt (Ursprung, Knet-Profil, Rolle, Form-DNA, Spuren, Maßstab), V-566')
        if pal and o.get('color') and str(o['color']).lower() not in pal: F('M3', f"{oid}: Farbe {o['color']} nicht aus der Palette der Szene")
    # C1 Kontakt-Geometrie (V-565): jede Fuge Objekt–Boden wird von kleineren Elementen gebrochen (Steinchen, Moos, Gras, Erdkeil), Etherington „Überlappen“
    for o in env:
        if o.get('kind') not in ('building', 'rock', 'rockgroup', 'prop') or not o.get('h'): continue
        near = [q for q in objs if q is not o and q.get('h', 0) < 0.35 * o['h'] and _d2(q['c'], o['c']) <= o['r'] * 1.5 + 0.5 * H]
        if not near:
            (F if o.get('kind') != 'prop' else (lambda c, m: find.append(f'{code(c)} {m}')))('C1', f"{o.get('id', '?')}: keine Kontakt-Geometrie an der Fuge (kleine Knet-Elemente fehlen)")
    layers = {o.get('layer') for o in env}
    if env and len(layers & set(BIO['layers_required'])) < len(BIO['layers_required']): F('S4', 'Ortsbiografie unvollständig: Schichten ' + ', '.join(LAYERS[l] for l in LAYERS if l not in layers) + ' fehlen (r2: Pflicht, rules.biography)')
    # Gruppen (H4/E4/E5 + Zahlen-Regeln §0)
    groups = {}
    for o in env: groups.setdefault(o.get('group') or '_ohne', []).append(o)
    ordered_groups = set(scene.get('ordered_groups') or []) | {o.get('group') for o in env if o.get('ordered')}
    trace = {k for k, v in groups.items() if v and all(o.get('kind') in ('path_stone', 'dust') for o in v)}   # r2: Steinspur/Staub – Nest-Zahlenregeln nicht anwendbar (eigene Spur-Prüfung im Löser)
    for k in sorted(trace): find.append(f"{code('G1')} Gruppe {k}: Steinspur ({len(groups[k])} Teile) – Nest-Regeln nicht angewendet")
    rep = {k: rule_report(v) for k, v in groups.items() if k != '_ohne' and k not in trace and len(v) >= 2}
    for k, rr in rep.items():
        if k in ordered_groups: rr['failed'] = [x for x in rr['failed'] if x not in ORDERED['skip']]; rr['ok'] = not rr['failed']; rr['ordered'] = True   # gebaute Ordnung: Reihen erlaubt
        if rr['ok'] and rr['spread'] < R.get('spread_tune', 0) and k not in ordered_groups: find.append(f"{code('G1')} Gruppe {k}: Abstands-Spread {rr['spread']} < 0,45 (Ziel 2 : 1, TUNE)")
        if not rr['ok']: F('G1', f"Gruppe {k}: {', '.join(rr['failed'])} (n={rr['n']}, Spread {rr['spread']})")
    if '_ohne' in groups: F('G2', f"{len(groups['_ohne'])} Elemente ohne Gruppe (Einzelgänger/Streuung)")
    ng = len(rep)
    if env and not (R['groups'][0] <= ng <= R['groups'][1]) and scene.get('kind') in ('diorama', 'island'): find.append(f"{code('H4')} {ng} Gruppen (Soll 2–4 je Zone)")
    # H3 Negativraum
    ns = _neg_space(scene, env)
    if ns is not None and ns < R['neg_space']: F('H3', f'Negativraum {ns:.0%} < 30 %')
    # H5 Landmarke höchstes Element, nichts davor > 60 %
    lm = next((o for o in objs if o.get('id') == scene.get('landmark')), None)
    fo = next((o for o in objs if o.get('id') == scene.get('focus') or o.get('slot') == 'focus'), None)   # r3 (V-763): Fokus ohne Höhenregel; H5 gilt nur für Landmarken
    if env and not lm and not fo: F('H5', 'keine Landmarke/Fokus benannt')
    elif lm:
        top = lambda o: (o.get('ground_z', 0) + o.get('h', 0) - max(0, o.get('ground_z', 0) - o.get('bottom_z', o.get('ground_z', 0))))
        higher = [o['id'] for o in env if o is not lm and top(o) > top(lm)]
        if higher: F('H5', f"Landmarke {lm['id']} nicht höchstes Element ({', '.join(higher[:4])})")
    # H7 Größenstaffel 1 : 3 : 9 (wenige groß, mehr mittel, viele klein)
    hs = sorted(o.get('h', 0) for o in env if o.get('h'))
    if len(hs) >= 9:
        top = hs[-1]  # Klassen relativ zum Größten nach Etherington §3 (1 : 0,6 : 0,35)
        L = sum(h >= 0.6 * top for h in hs); S = sum(h < 0.35 * top for h in hs); M = len(hs) - L - S
        if not (L <= M <= S): find.append(f"{code('H7')} Größenstaffel L/M/S = {L}/{M}/{S} (Soll wenige/mehr/viele)")
    # Signatur: 1 Hero + höchstens 2 Echos (Ortsbiografie §3)
    hero = [o for o in objs if o.get('signature') == 'hero']; echo = [o for o in objs if o.get('signature') == 'echo']
    if env and len(hero) != 1: F('S5', f'{len(hero)} Signatur-Hero (Soll genau 1)')
    if len(echo) > 2: F('S5', f'{len(echo)} Echos (max 2)')
    # H9 ein Kit je Gruppe, H11 keine geklonten Nachbarn, Formwiederholung ≤ 3
    for k, v in groups.items():
        kits = {o.get('kit') for o in v if o.get('kit') and o.get('slot') not in ('pebble', 'contact') and o.get('kind') != 'contact'}   # r3 (V-763 e): Kiesel/Kontakt = Mikro-Ebene, Steinkit erlaubt
        if k != '_ohne' and len(kits) > 1: F('H9', f"Gruppe {k}: Kit-Mix {sorted(kits)}")
    for i, a in enumerate(env):
        for b in env[i + 1:]:
            if a.get('asset') and a.get('asset') == b.get('asset') and abs((a.get('rot_z', 0) - b.get('rot_z', 0) + 180) % 360 - 180) < 5 and _d2(a['c'], b['c']) < R['clone_dist_H'] * H:
                F('H11', f"Klon-Nachbarn {a['id']} / {b['id']}")
    cnt = {}
    for o in env: cnt[o.get('asset')] = cnt.get(o.get('asset'), 0) + 1
    rep_assets = [f'{k}×{n}' for k, n in cnt.items() if k and n > R['repeat_max']]
    if rep_assets: find.append(f"{code('RPT')} Formwiederholung > 3: " + ', '.join(rep_assets))
    _extended(scene, objs, env, groups, ordered_groups, F, find, H)
    return {'id': scene.get('id'), 'ok': not fail, 'fail': fail, 'findings': find, 'groups': rep, 'negative_space': ns, 'rules_source': CFG_PATH, 'warnings': list(WARN)}


# ------------------------------------------------------------------ r2: neue Prüfungen (V-749 Nr. 6, rules.contact/lean/biography)
def _arc_cover(center, R0, parts):
    """Anteil des Umfangs, den Kontakt-Elemente bedecken, und größte Lücke (Anteil), über Winkel-Intervalle."""
    iv = []
    for q in parts:
        d = max(1e-6, _d2(q['c'], center)); half = math.asin(min(1.0, q.get('r', 0.1) / d)) if d > q.get('r', 0.1) else math.pi / 2
        a = math.atan2(q['c'][1] - center[1], q['c'][0] - center[0]); iv.append(((a - half) % (2 * math.pi), (a + half) % (2 * math.pi)))
    marks = sorted([x for a, b in iv for x in ([(a, b)] if a <= b else [(a, 2 * math.pi), (0.0, b)])])
    merged = []
    for a, b in marks:
        if merged and a <= merged[-1][1]: merged[-1][1] = max(merged[-1][1], b)
        else: merged.append([a, b])
    cov = sum(b - a for a, b in merged) / (2 * math.pi)
    if not merged: return 0.0, 1.0
    gaps = [merged[i + 1][0] - merged[i][1] for i in range(len(merged) - 1)] + [2 * math.pi - merged[-1][1] + merged[0][0]]
    return cov, max(gaps) / (2 * math.pi)


def _extended(scene, objs, env, groups, ordered_groups, F, find, H):
    mpu = scene.get('m_per_unit', 1.0)
    # ENV-ORDNUNG · gebaute Ordnung (Reihen erlaubt): Glieder der Reihe = je geordnete Gruppe das Hauptobjekt (größtes h·r) bzw. scene['ordered_members'];
    #   geprüft werden Durchdringung 0, Kontakt (kleinere Elemente an der Fuge wie C1), Lücken ≥ gap_min_m zwischen Gliedern, keine gleichen Nachbarn. Einsinken prüft E2 oben.
    ids = set(scene.get('ordered_members') or [])
    mem = [o for o in env if o.get('id') in ids] if ids else [max(groups[g], key=lambda o: o.get('h', 0) * o.get('r', 0)) for g in sorted(ordered_groups) if g in groups]
    for i, a in enumerate(mem):
        nb = [(b, _d2(a['c'], b['c']) - a.get('r', 0) - b.get('r', 0)) for b in mem if b is not a]
        if nb:
            b, gap = min(nb, key=lambda t: t[1])
            if gap < -1e-3: F('ENV-ORDNUNG', f"{a['id']} durchdringt {b['id']} ({gap * mpu:.2f} m)")
            elif gap * mpu < ORDERED['gap_min_m'] - 1e-3 and mem.index(b) > i: F('ENV-ORDNUNG', f"Lücke {a['id']}–{b['id']} {gap * mpu:.2f} m < {ORDERED['gap_min_m']} m")
            if a.get('asset') and a.get('asset') == b.get('asset') and abs((a.get('rot_z', 0) - b.get('rot_z', 0) + 180) % 360 - 180) < 5 and mem.index(b) > i: F('ENV-ORDNUNG', f"gleiche Nachbarn {a['id']} / {b['id']}")
        if a.get('h') and not [q for q in objs if q is not a and q.get('h', 0) < 0.35 * a['h'] and _d2(q['c'], a['c']) <= a.get('r', 0) * 1.5 + 0.5 * H]: F('ENV-ORDNUNG', f"{a['id']}: keine Kontakt-Geometrie an der Fuge")
    # ENV-KONTAKTFENSTER · Kontakt auf 40–50 % des Umfangs, größte Lücke ≥ 25 % (kein Kranz)
    #   r3 (V-763, rules.contact.applies_to): gilt für Anker und frei stehende Objekte; Stützen, Akzente, Kiesel und Echos im Nest teilen den Kontakt des Ankers (Slot aus dem Rezept, kfb_role_slot)
    for o in env:
        cs = [q for q in objs if q.get('kind') == 'contact' and q.get('group') == o.get('group') and _d2(q['c'], o['c']) <= o.get('r', 0) * 1.6 + 0.3 * H]
        if len(cs) < 2 or o.get('kind') in ('fluff', 'grass', 'path_stone', 'dust') or o.get('slot') in CONTACT_SHARED: continue
        cov, gap = _arc_cover(o['c'], o.get('r', 1.0), cs); lo, hi = CONTACT['perimeter']
        if not (lo - 0.02 <= cov <= hi + 0.02) or gap < CONTACT['gap_min']: F('ENV-KONTAKTFENSTER', f"{o['id']}: Kontakt deckt {cov:.0%} des Umfangs (Soll {lo:.0%}–{hi:.0%}), größte Lücke {gap:.0%} (Soll ≥ {CONTACT['gap_min']:.0%})")
    # ENV-LEHNE · Ü1–Ü7 (CANON_3D/EINARBEITUNG_WS1_R1.md); fehlen die Messwerte im Export, ist es ein Befund (nicht messbar), kein FAIL
    stones = lambda v: [o for o in v if o.get('kind') in ('rock', 'rockgroup', 'stone_L', 'stone_M', 'stone_S', 'rubble')]
    for k, v in groups.items():
        if k == '_ohne': continue
        st = stones(v); la = [o['lean_az'] for o in st if o.get('lean_az') is not None]
        if len(st) >= 3:   # Ü1 gemeinsame Lehnrichtung ±15°, genau 1 Ausnahme 25–45°
            if len(la) < len(st): find.append(f"{PREFIX}LEHNE-Ü1 Gruppe {k}: Lehnrichtung nicht im Export (lean_az) – nicht messbar")
            else:
                ref = math.degrees(math.atan2(sum(math.sin(math.radians(x)) for x in la), sum(math.cos(math.radians(x)) for x in la)))
                dev = [abs((x - ref + 180) % 360 - 180) for x in la]; exc = [d for d in dev if d > LEAN['lean_tol']]
                if len(exc) != 1 or not (LEAN['lean_exc'][0] <= exc[0] <= LEAN['lean_exc'][1]): F('ENV-LEHNE-Ü1', f"Gruppe {k}: {len(exc)} Ausnahmen der Lehnrichtung (Soll genau 1 mit 25–45°)")
        sS = [o for o in v if o.get('kind') == 'stone_S']
        if len(sS) >= 3:   # Ü2 ≥ 20 % der stone_S schräg (> 15°), ≤ 1 Schlüsselstein
            if any(o.get('tilt') is None for o in sS): find.append(f"{PREFIX}LEHNE-Ü2 Gruppe {k}: Neigung nicht im Export (tilt) – nicht messbar")
            elif sum(o['tilt'] > LEAN['pebble_tilt'][0] for o in sS) / len(sS) < LEAN['pebble_tilt'][1]: F('ENV-LEHNE-Ü2', f"Gruppe {k}: < 20 % der kleinen Steine schräg (> 15°)")
        if sum(1 for o in v if o.get('keystone')) > 1: F('ENV-LEHNE-Ü2', f"Gruppe {k}: mehr als 1 Schlüsselstein")
        forms = {o.get('form') for o in v if o.get('form')}
        if len(forms) > LEAN['primary_max']: F('ENV-LEHNE-Ü3', f"Gruppe {k}: {len(forms)} Primärformen (≤ {LEAN['primary_max']})")
        st3 = [o for o in v if o.get('slot') in ('support', 'accent')] if any(o.get('slot') for o in v) else v   # r3 (V-763): mit Rezept-Slots über Stützen und Akzent, sonst über alle
        hs = sorted((o.get('h', 0), o['id']) for o in st3 if o.get('h') and o.get('kind') not in ('fluff', 'contact'))   # Ü3 keine zwei Elemente innerhalb ±10 % Höhe
        same = [(a[1], b[1]) for a, b in zip(hs, hs[1:]) if b[0] > 0 and abs(b[0] - a[0]) / b[0] < LEAN['height_tol']]
        if same and k not in ordered_groups and not all(o.get('kind') in ('path_stone', 'dust') for o in v): F('ENV-LEHNE-Ü3', f"Gruppe {k}: gleich hohe Elemente ±10 % ({', '.join(f'{a}/{b}' for a, b in same[:3])})")
        trees = [o for o in v if o.get('kind') == 'tree']
        for t in trees:   # Ü4 Hangbaum lehnt 20–40 % des Winkels zur Hangnormale
            if t.get('slope_deg') and t['slope_deg'] > 5:
                if t.get('lean_deg') is None: find.append(f"{PREFIX}LEHNE-Ü4 {t['id']}: Lehnwinkel nicht im Export – nicht messbar")
                elif not (LEAN['tree_lean'][0] <= t['lean_deg'] / t['slope_deg'] <= LEAN['tree_lean'][1]): F('ENV-LEHNE-Ü4', f"{t['id']}: lehnt {t['lean_deg']:.0f}° bei Hang {t['slope_deg']:.0f}° (Soll 20–40 %)")
        tr = sorted((o.get('trunk_r'), o['id']) for o in trees if o.get('trunk_r'))
        for a, b in zip(tr, tr[1:]):
            if abs(b[0] - a[0]) / b[0] < 0.2: F('ENV-LEHNE-Ü4', f"Gruppe {k}: Nachbarstämme {a[1]}/{b[1]} < 20 % verschieden dick")
    for o in env:   # Ü5 Gras am Fuß ≤ 50 % des Umfangs, Lücke ≥ 25 %
        gr = [q for q in objs if q.get('kind') == 'grass' and q is not o and _d2(q['c'], o['c']) <= o.get('r', 0) * 1.3 + 0.2 * H and o.get('kind') in ('rock', 'stone_L', 'building', 'prop', 'tree')]
        if len(gr) >= 2:
            cov, gap = _arc_cover(o['c'], o.get('r', 1.0), gr)
            if cov > 0.5 + 0.02 or gap < LEAN['grass_gap']: F('ENV-LEHNE-Ü5', f"{o['id']}: Gras deckt {cov:.0%} des Fußes, größte Lücke {gap:.0%} (Soll ≤ 50 %, ≥ 25 %)")
    lm = next((o for o in objs if o.get('id') == scene.get('landmark')), None) or next((o for o in objs if o.get('id') == scene.get('focus') or o.get('slot') == 'focus'), None)   # r3: Fokus-Ring auch um den Fokus
    if lm:   # Ü6 im Ring 0,5 × r(Landmarke) höchstens 1 Objekt der Klasse M oder größer; Interaktionspunkte 1 H frei
        top = max((o.get('h', 0) for o in env), default=1) or 1
        ring = [o['id'] for o in env if o is not lm and _d2(o['c'], lm['c']) <= lm.get('r', 0) * (1 + LEAN['focal_ring']) and o.get('h', 0) >= 0.35 * top]
        if len(ring) > 1: F('ENV-LEHNE-Ü6', f"Fokus-Ring um {lm['id']}: {len(ring)} Objekte M+ ({', '.join(ring[:4])}), erlaubt 1")
        for ip in scene.get('interaction_points') or []:
            near = [o['id'] for o in env if _d2(o['c'], ip) < LEAN['interact_free_H'] * H + o.get('r', 0)]
            if near: F('ENV-LEHNE-Ü6', f"Interaktionspunkt {ip}: nicht 1 H frei ({', '.join(near[:3])})")
    tang = scene.get('tangents') or []   # Ü7 Tangente nur, wenn focal.tangent sie benennt; höchstens 1
    named = (scene.get('concept') or {}).get('focal_tangent')
    if len(tang) > 1 or (tang and tang[0] != named): F('ENV-LEHNE-Ü7', f"Tangenten {tang} (erlaubt höchstens 1, benannt in focal.tangent: {named})")
    # ENV-BIOGRAFIE · Signatur mit Gebrauchsspuren (rules.biography.wear_marks_min)
    hero = [o for o in objs if o.get('signature') == 'hero']
    for o in hero:
        if 'wear' not in o: find.append(f"{PREFIX}BIOGRAFIE Signatur {o['id']}: Gebrauchsspuren nicht im Export (kfb_wear) – nicht messbar"); continue
        w = o.get('wear') or []
        if len(w) < BIO.get('wear_marks_min', 2): F('ENV-BIOGRAFIE', f"Signatur {o['id']}: {len(w)} Gebrauchsspuren (Soll ≥ {BIO.get('wear_marks_min', 2)})")


if __name__ == '__main__':
    import sys
    res = gate(json.load(open(sys.argv[1])))
    print(json.dumps(res, indent=1, ensure_ascii=False)); sys.exit(0 if res['ok'] else 1)
