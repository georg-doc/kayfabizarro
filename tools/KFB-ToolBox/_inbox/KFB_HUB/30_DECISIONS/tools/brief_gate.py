#!/usr/bin/env python3
"""Brief-Gate: prüft ein Briefing gegen Register und Specs, bevor es an eine Sitzung geht.

Aufruf:  python3 tools/brief_gate.py <briefing.md> [--domains HUD,Figuren]
Schritt 1 (dieses Skript, mechanisch): erkennt die Bereiche, prüft V-Verweise und Dateipfade,
          schreibt ein Prüfpaket GATE/<name>.pack.md mit allen gültigen Register-Einträgen und Specs.
Schritt 2 (frischer Prüf-Agent ohne WS0-Verlauf, Prompt tools/BRIEF_GATE_PROMPT.md): liest das Paket,
          urteilt PASS oder BLOCK und schreibt GATE/<name>.verdict.json.
Ein Briefing geht nur mit Exit 0 hier und PASS dort raus.
Exit: 0 = mechanisch ok, 2 = Blocker (fehlende/überholte V-Verweise, fehlende oder überholte Dateien).
"""
import json, os, re, sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GATE = os.path.join(BASE, 'GATE')
SPEC_LIMIT = 60000  # Zeichen je Spec im Paket


def load(p):
    with open(os.path.join(BASE, p), encoding='utf-8') as f:
        return f.read()


def main():
    args = sys.argv[1:]
    if not args:
        sys.exit(__doc__)
    brief_path = os.path.abspath(args[0])
    forced = []
    if '--domains' in args:
        forced = [d.strip() for d in args[args.index('--domains') + 1].split(',') if d.strip()]
    brief = open(brief_path, encoding='utf-8').read()
    low = ' ' + brief.lower() + ' '

    reg = json.loads(load('decisions.json'))['entries']
    by_id = {e['id']: e for e in reg}
    domains = json.loads(load('tools/brief_domains.json'))['domains']

    hits = {d: sum(len(re.findall(r'(?<![\wäöüß])' + re.escape(k.strip()) + r'(?![\wäöüß])', low)) for k in cfg['keywords'])
            for d, cfg in domains.items()}
    top = max(hits.values() or [0])
    # höchstens zwei Hauptbereiche, und nur wenn sie deutlich vorkommen
    chosen = forced or [d for d, n in sorted(hits.items(), key=lambda x: -x[1]) if n >= max(3, top * 0.4)][:2]

    blockers, notes = [], []
    # V-Verweise: existieren sie, sind sie überholt oder ein FAIL?
    for vid in sorted(set(re.findall(r'V-\d{3}', brief))):
        e = by_id.get(vid)
        if not e:
            blockers.append(f'{vid}: nicht im Register (decisions.json)')
        elif e.get('superseded_by'):
            blockers.append(f'{vid}: überholt durch {", ".join(e["superseded_by"])}')
        elif e.get('verdict') == 'FAIL':
            notes.append(f'{vid}: ist ein FAIL ({e["text"][:90]}) – nur als Warnung zitieren')
    # Dateipfade im Briefing: vorhanden und nicht als ÜBERHOLT markiert?
    for p in sorted(set(re.findall(r'(?:replies|CANON_3D|CHARACTERS_R1|tools)/[\w./-]+\.(?:md|json|py|js)', brief))):
        fp = os.path.join(BASE, p)
        if not os.path.exists(fp):
            blockers.append(f'{p}: Datei fehlt')
        elif 'ÜBERHOLT' in open(fp, encoding='utf-8', errors='ignore').read(400):
            blockers.append(f'{p}: als ÜBERHOLT markiert')

    # Prüfpaket
    areas = {a for d in chosen for a in domains[d]['areas']}
    active = [e for e in reg if e.get('area') in areas and not e.get('superseded_by')]
    specs = []
    for d in chosen:
        for s in domains[d]['specs']:
            if s not in specs:
                specs.append(s)
    os.makedirs(GATE, exist_ok=True)
    name = os.path.splitext(os.path.basename(brief_path))[0]
    out = [f'# Prüfpaket · {name}', f'Bereiche: {", ".join(chosen) or "keine erkannt"}',
           f'Register-Einträge (gültig, Gebiete {", ".join(sorted(areas))}): {len(active)}', '',
           '## Briefing', brief, '', '## Mechanische Befunde']
    out += [f'- BLOCKER {b}' for b in blockers] + [f'- Hinweis {n}' for n in notes] or ['- keine']
    out += ['', '## Gültige Register-Einträge']
    for e in active:
        out.append(f'- {e["id"]} ({e.get("date", "")}, {e.get("area", "")}, {e.get("verdict", "")}): {e["text"]}')
    for s in specs:
        fp = os.path.join(BASE, s)
        out += ['', f'## Spec · {s}']
        if not os.path.exists(fp):
            out.append('(fehlt)')
            continue
        t = load(s)
        out.append(t[:SPEC_LIMIT] + ('\n… (gekürzt)' if len(t) > SPEC_LIMIT else ''))
    pack = os.path.join(GATE, name + '.pack.md')
    with open(pack, 'w', encoding='utf-8') as f:
        f.write('\n'.join(out))

    print(f'Bereiche: {", ".join(chosen) or "keine"} · Einträge: {len(active)} · Specs: {len(specs)}')
    for b in blockers:
        print('BLOCKER', b)
    for n in notes:
        print('Hinweis', n)
    print('Paket:', pack)
    if not chosen:
        print('BLOCKER kein Bereich erkannt – mit --domains angeben')
        sys.exit(2)
    sys.exit(2 if blockers else 0)


if __name__ == '__main__':
    main()
