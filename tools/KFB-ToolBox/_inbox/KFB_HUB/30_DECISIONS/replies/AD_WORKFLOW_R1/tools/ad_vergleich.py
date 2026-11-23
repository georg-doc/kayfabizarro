#!/usr/bin/env python3
"""Blind-Vergleich Bau ↔ Zielbild: Runden zählen, PASS rechnen, Stopp-Regeln durchsetzen (Standardbibliothek).

  python3 ad_vergleich.py runde  <vergleich/F03.json> <kritiker-ausgabe.json> --erfassung <ordner unter …/_privat/> [--gates-gruen]
  python3 ad_vergleich.py stand  <vergleich/F03.json>

Kritiker-Ausgabe = JSON nach `<VERDICT>` im Format `output` von tools/qa_matrix.r1.json
({"verdict", "scores": {"A".."H": 0–10 | "n/a"}, "findings": [...]}). Jede Zahl > 6 braucht einen Beleg (Prompt Regel 3).
Regeln (aus vergleich.json): PASS = keine Achse < min_axis, Mittel ≥ min_mean, B ≥ min_B, B nicht n/a, höchstens 3 Achsen n/a,
Handwerks-Gates Stufe A/B grün (WS0 bestätigt mit --gates-gruen, nachdem die Gate-Ausgabe des Owners geprüft ist).
Besserung = Mittel oder B höher als in der besten Vorrunde. Stopp nach max_runden oder stopp_ohne_besserung Runden ohne Besserung.
Ausgabe: PASS → „Karte frei“; WEITER → Befunde an den Owner; STOPP → kleinster Blocker als Hub-Karte. Exit 0 PASS, 1 WEITER, 3 STOPP, 2 Fehler.
"""
import json, os, sys
sys.dont_write_bytecode = True   # kein __pycache__ im gespiegelten replies/-Ordner
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ad_common import sync_schuetzt

AXES = 'ABCDEFGH'


def die(m):
    print('FEHLER:', m); sys.exit(2)


def bewerte(v, out, gates):
    s = out.get('scores')
    if not isinstance(s, dict) or set(s) != set(AXES):
        die('scores braucht genau die Achsen A–H')
    nums = {}
    for k, x in s.items():
        if x == 'n/a':
            continue
        if not isinstance(x, (int, float)) or not 0 <= x <= 10:
            die(f'Achse {k}: {x!r} ist keine Zahl 0–10 oder "n/a"')
        nums[k] = x
    if 'B' not in nums:
        die('Achse B (Ziel-Treue) darf beim Vergleich nicht n/a sein')
    if len(nums) < 5:
        die('mehr als 3 Achsen n/a: Kritik unvollständig, neu bewerten lassen')
    belege = {f.get('axis') for f in out.get('findings', []) if f.get('file') or f.get('scene')}
    ohne = [k for k, x in nums.items() if x > 6 and k not in belege]
    p = v['pass']
    mittel = round(sum(nums.values()) / len(nums), 2)
    ok = min(nums.values()) >= p['min_axis'] and mittel >= p['min_mean'] and nums['B'] >= p['min_B'] and not ohne and gates
    return {'gates_gruen': gates, 'scores': s, 'mittel': mittel, 'B': nums['B'], 'pass': ok, 'ohne_beleg': ohne,
            'kleinster': min(nums, key=nums.get), 'verdict_kritiker': out.get('verdict')}


def runden_pfad(vp):
    return os.path.splitext(vp)[0] + '.runden.json'


def main():
    a = sys.argv[1:]
    if len(a) < 2 or a[0] not in ('runde', 'stand'):
        sys.exit(__doc__)
    vp = a[1]; v = json.load(open(vp, encoding='utf-8')); rp = runden_pfad(vp)
    st = json.load(open(rp, encoding='utf-8')) if os.path.exists(rp) else {'runden': [], 'ende': None}
    if a[0] == 'stand':
        print(json.dumps(st, ensure_ascii=False, indent=1)); return
    if st['ende']:
        die(f'Vergleich ist beendet ({st["ende"]}); neue Runde nur mit neuem Auftrag')
    if len(a) < 3:
        sys.exit(__doc__)
    erf = a[a.index('--erfassung') + 1] if '--erfassung' in a else None
    if not erf or not os.path.isdir(erf) or not sync_schuetzt(erf):
        die('--erfassung <Ordner der neuen Erfassung> fehlt oder würde öffentlich gespiegelt: unter …/_privat/ ablegen')
    r = bewerte(v, json.load(open(a[2], encoding='utf-8')), '--gates-gruen' in a)
    r['erfassung'] = os.path.basename(os.path.abspath(erf))
    vor = st['runden']
    r['runde'] = len(vor) + 1
    best_m = max([x['mittel'] for x in vor], default=-1); best_b = max([x['B'] for x in vor], default=-1)
    r['besserung'] = not vor or r['mittel'] > best_m or r['B'] > best_b
    vor.append(r)
    ohne = 0
    for x in reversed(vor):
        if x['besserung']:
            break
        ohne += 1
    if r['pass']:
        st['ende'] = 'PASS'; msg, code = f'PASS in Runde {r["runde"]} (Mittel {r["mittel"]}, B {r["B"]}): Karte frei, WS0 prüft selbst, dann Georg', 0
    elif r['runde'] >= v['max_runden'] or ohne >= v['stopp_ohne_besserung']:
        st['ende'] = 'STOPP'
        msg, code = f'STOPP nach Runde {r["runde"]} ({ohne} ohne Besserung): kleinster Blocker Achse {r["kleinster"]} als Hub-Karte', 3
    else:
        msg, code = f'WEITER: Runde {r["runde"]} nicht bestanden (Mittel {r["mittel"]}, B {r["B"]}' + \
                    (f', ohne Beleg {r["ohne_beleg"]}' if r['ohne_beleg'] else '') + ('' if r['gates_gruen'] else ', Gates A/B nicht bestätigt') + '); Befunde still an den Owner', 1
    json.dump(st, open(rp, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(msg); sys.exit(code)


if __name__ == '__main__':
    main()
