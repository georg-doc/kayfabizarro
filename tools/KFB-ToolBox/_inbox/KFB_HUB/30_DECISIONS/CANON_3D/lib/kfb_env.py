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
#                 "material": "kfb-clay.v1.1/<profil>", "baked_light": false, "color": "#rrggbb" (Rollenton) }] }
import json, math, random

# ------------------------------------------------------------------ Zahlen der Quellen
SINK = {  # Anteil der Höhe unter dem Gelände [min, max] – Etherington §2 [KFB-Startwerte], Grammatik §4.1 für Steinkit
    'rock': (0.25, 0.45), 'rockgroup': (0.20, 0.35), 'tree': (0.05, 0.10), 'bush': (0.05, 0.12), 'building': (0.0, 0.15),
    'prop': (0.02, 0.05), 'stone_L': (0.45, 0.60), 'stone_M': (0.35, 0.50), 'stone_S': (0.30, 0.40),
    'grass': (0.0, 1.0), 'fluff': (0.0, 1.0), 'contact': (0.25, 1.0), 'water_plant': (0.0, 1.0), 'character': (0.0, 0.03), 'vehicle': (0.0, 0.03),
}
RULES = dict(size_tol=0.10, spread=0.30, line_tol=0.05, neighbour_r=4.5, overlap=0.85, air=1.25,  # grammar.js GRAMMAR.rules
             neg_space=0.30, float_tol_H=0.003, landmark_front=0.60, repeat_max=3, clone_dist_H=6 / 3.64,
             ratio_LMS=(1, 3, 9), groups=(2, 4))
NEST = dict(sizes=(1.0, 0.62, 0.38), med=(-1.2, 0.1, 1.3), small=(-0.6, 0.7, -2.0, 2.05, 3.1), k=0.86, spread=1.75)
LAYERS = {1: 'Entstehen', 2: 'Nutzen', 3: 'Vergehen', 4: 'Bewachsen'}
ROLES = {'ground', 'stone', 'bark', 'leaf', 'grass', 'bloom', 'accent', 'prop', 'figure', 'water'}
CONCEPT_FIELDS = ('story', 'image_idea', 'focal', 'space', 'palette_roles', 'material_codes', 'biography', 'story_beat')
ENV_KINDS = {'rock', 'rockgroup', 'tree', 'bush', 'grass', 'prop', 'building', 'stone_L', 'stone_M', 'stone_S', 'fluff', 'water_plant'}


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
    spread = (mx - min(fin)) / mx if len(fin) >= 2 and mx > 0 else 1.0
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
    F = lambda code, msg: fail.append(f'{code} {msg}')
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
            elif not (lo - 0.02 <= sink <= hi + 0.02): F('E2', f"{oid}: Einsinken {sink:.0%} außerhalb {lo:.0%}–{hi:.0%} ({o.get('kind')})")
    # M1–M3 Einpassung ins Terrain (Kanon Gebiet 15): ein Material, kein eingebackenes Licht, Farben nur aus der Palette
    pal = {str(v).lower() for v in ((scene.get('concept') or {}).get('palette_roles') or {}).values() if isinstance(v, str)}
    for o in objs:
        oid = o.get('id', '?')
        if (o.get('kind') in ENV_KINDS or o.get('material') is not None) and not str(o.get('material') or '').startswith('kfb-clay'): F('M1', f"{oid}: Material {o.get('material')!r} statt kfb-clay (fremde Textur liegt auf dem Terrain)")
        if o.get('baked_light'): F('M2', f'{oid}: eingebackenes Licht/AO – nur das eine Rig (V-385)')
        if pal and o.get('color') and str(o['color']).lower() not in pal: F('M3', f"{oid}: Farbe {o['color']} nicht aus der Palette der Szene")
    # C1 Kontakt-Geometrie (V-565): jede Fuge Objekt–Boden wird von kleineren Elementen gebrochen (Steinchen, Moos, Gras, Erdkeil), Etherington „Überlappen“
    for o in env:
        if o.get('kind') not in ('building', 'rock', 'rockgroup', 'prop') or not o.get('h'): continue
        near = [q for q in objs if q is not o and q.get('h', 0) < 0.35 * o['h'] and _d2(q['c'], o['c']) <= o['r'] * 1.5 + 0.5 * H]
        if not near:
            (F if o.get('kind') != 'prop' else (lambda c, m: find.append(f'{c} {m}')))('C1', f"{o.get('id', '?')}: keine Kontakt-Geometrie an der Fuge (kleine Knet-Elemente fehlen)")
    layers = {o.get('layer') for o in env}
    if env and len(layers & set(LAYERS)) < 4: find.append('S4 Ortsbiografie unvollständig: Schichten ' + ', '.join(LAYERS[l] for l in LAYERS if l not in layers) + ' fehlen')
    # Gruppen (H4/E4/E5 + Zahlen-Regeln §0)
    groups = {}
    for o in env: groups.setdefault(o.get('group') or '_ohne', []).append(o)
    rep = {k: rule_report(v) for k, v in groups.items() if k != '_ohne' and len(v) >= 2}
    for k, rr in rep.items():
        if not rr['ok']: F('G1', f"Gruppe {k}: {', '.join(rr['failed'])} (n={rr['n']}, Spread {rr['spread']})")
    if '_ohne' in groups: F('G2', f"{len(groups['_ohne'])} Elemente ohne Gruppe (Einzelgänger/Streuung)")
    ng = len(rep)
    if env and not (R['groups'][0] <= ng <= R['groups'][1]) and scene.get('kind') in ('diorama', 'island'): find.append(f'H4 {ng} Gruppen (Soll 2–4 je Zone)')
    # H3 Negativraum
    ns = _neg_space(scene, env)
    if ns is not None and ns < R['neg_space']: F('H3', f'Negativraum {ns:.0%} < 30 %')
    # H5 Landmarke höchstes Element, nichts davor > 60 %
    lm = next((o for o in objs if o.get('id') == scene.get('landmark')), None)
    if env and not lm: F('H5', 'keine Landmarke/Fokus benannt')
    elif lm:
        top = lambda o: (o.get('ground_z', 0) + o.get('h', 0) - max(0, o.get('ground_z', 0) - o.get('bottom_z', o.get('ground_z', 0))))
        higher = [o['id'] for o in env if o is not lm and top(o) > top(lm)]
        if higher: F('H5', f"Landmarke {lm['id']} nicht höchstes Element ({', '.join(higher[:4])})")
    # H7 Größenstaffel 1 : 3 : 9 (wenige groß, mehr mittel, viele klein)
    hs = sorted(o.get('h', 0) for o in env if o.get('h'))
    if len(hs) >= 9:
        top = hs[-1]  # Klassen relativ zum Größten nach Etherington §3 (1 : 0,6 : 0,35)
        L = sum(h >= 0.6 * top for h in hs); S = sum(h < 0.35 * top for h in hs); M = len(hs) - L - S
        if not (L <= M <= S): find.append(f'H7 Größenstaffel L/M/S = {L}/{M}/{S} (Soll wenige/mehr/viele)')
    # Signatur: 1 Hero + höchstens 2 Echos (Ortsbiografie §3)
    hero = [o for o in objs if o.get('signature') == 'hero']; echo = [o for o in objs if o.get('signature') == 'echo']
    if env and len(hero) != 1: F('S5', f'{len(hero)} Signatur-Hero (Soll genau 1)')
    if len(echo) > 2: F('S5', f'{len(echo)} Echos (max 2)')
    # H9 ein Kit je Gruppe, H11 keine geklonten Nachbarn, Formwiederholung ≤ 3
    for k, v in groups.items():
        kits = {o.get('kit') for o in v if o.get('kit')}
        if k != '_ohne' and len(kits) > 1: F('H9', f"Gruppe {k}: Kit-Mix {sorted(kits)}")
    for i, a in enumerate(env):
        for b in env[i + 1:]:
            if a.get('asset') and a.get('asset') == b.get('asset') and abs((a.get('rot_z', 0) - b.get('rot_z', 0) + 180) % 360 - 180) < 5 and _d2(a['c'], b['c']) < R['clone_dist_H'] * H:
                F('H11', f"Klon-Nachbarn {a['id']} / {b['id']}")
    cnt = {}
    for o in env: cnt[o.get('asset')] = cnt.get(o.get('asset'), 0) + 1
    rep_assets = [f'{k}×{n}' for k, n in cnt.items() if k and n > R['repeat_max']]
    if rep_assets: find.append('Formwiederholung > 3: ' + ', '.join(rep_assets))
    return {'id': scene.get('id'), 'ok': not fail, 'fail': fail, 'findings': find, 'groups': rep, 'negative_space': ns}


if __name__ == '__main__':
    import sys
    res = gate(json.load(open(sys.argv[1])))
    print(json.dumps(res, indent=1, ensure_ascii=False)); sys.exit(0 if res['ok'] else 1)
