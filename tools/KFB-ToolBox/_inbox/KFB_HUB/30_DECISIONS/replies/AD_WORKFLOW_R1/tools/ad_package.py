#!/usr/bin/env python3
"""AD-Paket bauen, prüfen, bereitlegen, veröffentlichen (WS0-Seite; Standardbibliothek, Pillow oder macOS-sips fürs Auffüllen).

  python3 ad_package.py pin      <auswahl.json>          (sha256 der gesehenen Stills/Clips in die Auswahl schreiben)
  python3 ad_package.py build    <auswahl.json> <ausgabe-ordner unter …/_privat/> [--erlaube-behoben] [--erlaube-zeit-unsicher]
  python3 ad_package.py validate <paket-ordner>
  python3 ad_package.py stage    <paket-ordner> <familie> [--lauf n --anker <PASS-Bild> --nur F01,F03] [--ziel KFB_AD]
  python3 ad_package.py publish  <paket-ordner> [--push]
  python3 ad_package.py publish  <ordner> --run <run_id> --unter rueckgabe/<F>_l<n> [--push]

build    liest die Auswahl (WS0), kopiert Stills/Clips/Referenz-Frames mit sprechenden Namen nach media/,
         legt je Still eine aufs Bildmodell-Format aufgefüllte Fassung an (media/edit/, grauer Rand, unskaliert),
         holt Referenzen per Name aus KFB_REFERENZEN_R1.md, SOP-Versionen aus den SOP-Köpfen, Ereignisse und
         Konfiguration aus protokoll.json, schreibt package.json, je Familie einen Upload-Ordner (≤ 10 Dateien)
         und README.md mit der Aufrufzeile (inkl. Paket-Prüfsumme). Trägt das Paket in KFB_AD/pakete.json ein.
validate Schema + Dateien + sha256 + Regeln.
stage    Upload-Ordner einer Familie nach KFB_AD/<run_id>_<familie>/ (Georgs einziger Ordner).
publish  Commit nach georg-doc/KFB-Stunt-Car-Race (PRIVAT), Branch ad/<run_id>, nur unter ad/<run_id>/.
         Ohne --push nur Probe. Ein vorhandener Rückgabe-Ordner wird nie überschrieben. Nie nach kayfabizarro.
Exit 0 = ok, 2 = Fehler.
"""
import json, os, re, shutil, subprocess, sys, tempfile
sys.dont_write_bytecode = True   # kein __pycache__ im gespiegelten replies/-Ordner
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ad_common import (HUB, KFB_AD, canon_hash, dump, image_size, load_schema, mp4_duration, pad_geometry, pad_image,
                       referenz_tabelle, sha256, sop_kurz, sop_versions, sync_schuetzt, validate)

SKILL_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'chatgpt-skill', 'kfb-art-direction')
WERKZEUG = os.path.join(SKILL_DIR, 'scripts', 'ad_return.py')
LEITPLANKEN = os.path.join(SKILL_DIR, 'references', 'LEITPLANKEN.md')

PRIV_REPO = 'git@github.com:georg-doc/KFB-Stunt-Car-Race.git'
PRIV_KEY = os.path.expanduser('~/.ssh/kfb_private_assets_deploy')
MAX_UPLOAD = 8   # Georg 23.11.: der Webchat verkraftet nur wenige Dateien; package.json + Bilder + eine Referenz (Skript und Leitplanke liegen im Skill)


def die(msgs):
    for m in (msgs if isinstance(msgs, list) else [msgs]):
        print('FEHLER:', m)
    sys.exit(2)


def arg(a, k):
    return a[a.index(k) + 1] if k in a else None


def resolve(p, base):
    p = os.path.expanduser(p)
    if os.path.isabs(p):
        return p
    for b in (base, HUB):
        q = os.path.join(b, p)
        if os.path.exists(q):
            return q
    return os.path.join(base, p)


def slug(s):
    return re.sub(r'[^a-z0-9_]+', '_', s.lower()).strip('_')


def ablauf_version():
    """Ablauf-Stand des ChatGPT-SKILL.md (Kopfzeile „Ablauf rN“); der Chat stoppt, wenn sein Skill einen anderen hat."""
    m = re.search(r'Ablauf (r[0-9]+)', open(os.path.join(SKILL_DIR, 'SKILL.md'), encoding='utf-8').read())
    if not m:
        die('SKILL.md ohne Kopf „Ablauf rN“')
    return m.group(1)


def register_paket(pkg, out):
    p = os.path.join(KFB_AD, 'pakete.json')
    os.makedirs(KFB_AD, exist_ok=True)
    reg = json.load(open(p, encoding='utf-8')) if os.path.exists(p) else {}
    reg.setdefault(pkg['run_id'], {})[pkg['paket_rev']] = {'paket': os.path.abspath(out), 'hash': canon_hash(pkg)}
    dump(reg, p)


def files_of(spec, base):
    root = resolve(spec['erfassung_wurzel'], base)
    for s in spec['szenen']:
        for st in s['stills']:
            yield st, os.path.join(root, s['lauf'], st['datei'])
        if s.get('clip'):
            yield s['clip'], os.path.join(root, s['lauf'], s['clip']['datei'])


def pin(spec_path):
    """WS0 hat die Stills angesehen: deren sha256 festnageln, damit build keine neu geschriebene Erfassung unterschiebt."""
    base = os.path.dirname(os.path.abspath(spec_path)); spec = json.load(open(spec_path, encoding='utf-8'))
    for item, p in files_of(spec, base):
        item['sha256'] = sha256(p)
    dump(spec, spec_path); print(f'OK: {sum(1 for _ in files_of(spec, base))} Dateien festgenagelt in {spec_path}')


def build(spec_path, out, ausnahmen):
    base = os.path.dirname(os.path.abspath(spec_path))
    spec = json.load(open(spec_path, encoding='utf-8'))
    root = resolve(spec['erfassung_wurzel'], base)
    if not sync_schuetzt(root):
        die(f'Erfassung {root} wird öffentlich gespiegelt (sync_github.sh): erst unter …/_privat/ ablegen oder den Ausschluss aus VORSCHLAG_sync_github.diff einbauen')
    if not sync_schuetzt(out):
        die(f'Paketordner {out} würde öffentlich gespiegelt: unter …/_privat/ bauen')
    for item, p in files_of(spec, base):
        if not item.get('sha256'):
            die(f'{p}: sha256 fehlt in der Auswahl – Stills ansehen, dann ad_package.py pin')
        if not os.path.exists(p) or sha256(p) != item['sha256']:
            die(f'{p} weicht von der angesehenen Fassung ab (Erfassung neu geschrieben?): Befunde neu prüfen, dann pin')
    lp_kopf = open(LEITPLANKEN, encoding='utf-8').readline()
    sv = sop_versions()
    if not all(sv[k] in lp_kopf for k in ('stamm', 'aeste', 'referenzen')):
        die(f'LEITPLANKEN.md nennt nicht den aktuellen SOP-Stand ({sop_kurz(sv)}): Leitplanke nachziehen, dann bauen')
    if os.path.exists(os.path.join(out, 'package.json')):
        die(f'{out} enthält schon ein Paket; neue paket_rev = neuer Ordner')
    for d in ('media/stills', 'media/edit', 'media/clips', 'media/refs'):
        os.makedirs(os.path.join(out, d), exist_ok=True)
    errs, protos, laeufe = [], {}, {}
    tabelle = referenz_tabelle()

    def proto(lauf):
        if lauf not in protos:
            p = os.path.join(root, lauf, 'protokoll.json')
            protos[lauf] = json.load(open(p, encoding='utf-8')) if os.path.exists(p) else None
            if protos[lauf] is None:
                errs.append(f'{lauf}: protokoll.json fehlt (Ereignisse/Konfiguration gingen verloren)')
            laeufe[lauf] = (protos[lauf] or {}).get('konfiguration', {})
        return protos[lauf]

    def copy(src, rel):
        if not os.path.exists(src):
            errs.append(f'Quelle fehlt: {src}'); return None
        shutil.copy2(src, os.path.join(out, rel))
        return rel

    refs = []
    for r in spec['referenzen']:
        row = tabelle.get(r['name'])
        if not row:
            errs.append(f'Referenz „{r["name"]}“ steht nicht in KFB_REFERENZEN_R1.md (Name wie in der Tabelle, fett)'); continue
        frames = []
        for i, fp in enumerate(r.get('frames', []), 1):
            rel = copy(resolve(fp, base), f'media/refs/{r["id"]}__{i}{os.path.splitext(fp)[1].lower() or ".jpg"}')
            if rel:
                frames.append(rel)
        refs.append({'id': r['id'], 'name': r['name'], 'aeste': row['aeste'], 'nimm': row['nimm'], 'nicht': row['nicht'],
                     'wirksamkeit': row['wirksamkeit'], 'frames': frames})

    szenen = []
    for s in spec['szenen']:
        lauf = s['lauf']; p = proto(lauf) or {}
        ps = next((x for x in p.get('szenen', []) if x.get('nr') == s.get('protokoll_nr')), {})
        vb = ps.get('video_beginn_s')
        stills = []
        for st in s['stills']:
            suffix = slug(st.get('suffix') or st['rolle'])
            src = os.path.join(root, lauf, st['datei'])
            stem = f'{s["scene_id"]}__{lauf}__{suffix}'
            rel = copy(src, f'media/stills/{stem}{os.path.splitext(src)[1].lower()}')
            if not rel:
                continue
            w, h = image_size(os.path.join(out, rel)) or (0, 0)
            g = pad_geometry(w, h) if w else None
            edit = None
            if g:
                er = f'media/edit/{stem}__edit.png'
                pad_image(os.path.join(out, rel), os.path.join(out, er), g)
                edit = dict(g, pfad=er, sha256=sha256(os.path.join(out, er)))
            t = st.get('t_clip_s')
            if t is None and vb is not None and st.get('ereignis_s') is not None:
                t = round(st['ereignis_s'] - vb, 2)
            stills.append({'pfad': rel, 'rolle': st['rolle'], 't_clip_s': t, 'ereignis': st.get('ereignis'),
                           'breite': w, 'hoehe': h, 'sha256': sha256(os.path.join(out, rel)), 'edit': edit, '_quelle': st['datei']})
        clip = None
        if s.get('clip'):
            src = os.path.join(root, lauf, s['clip']['datei'])
            rel = copy(src, f'media/clips/{s["scene_id"]}__{lauf}{os.path.splitext(src)[1].lower()}')
            if rel:
                t0, t1 = s['clip'].get('t_start'), s['clip'].get('t_end')
                ts = [x['t_clip_s'] for x in stills if x['t_clip_s'] is not None]
                if t0 is None and ts:
                    t0, t1 = max(0, min(ts) - 0.5), max(ts) + 0.5
                clip = {'pfad': rel, 'sha256': sha256(os.path.join(out, rel)), 'dauer_s': mp4_duration(os.path.join(out, rel)),
                        't_start': t0, 't_end': t1, 'zeit_unsicher': t0 is None or t1 is None}
        by_src = {st['_quelle']: st['pfad'] for st in stills}
        by_role = {st['rolle']: st for st in stills}
        befunde = []
        for b in s.get('befunde', []):
            beleg = []
            for x in b['beleg']:
                if x.get('clip') and clip:
                    beleg.append({'pfad': clip['pfad'], 't_clip_s': clip['t_start'], 'ereignis': x.get('ereignis')}); continue
                st = by_role.get(x.get('rolle')) or next((y for y in stills if y['pfad'] == by_src.get(x.get('datei'))), None)
                if not st:
                    errs.append(f'{b["id"]}: Beleg {x} nicht im Paket'); continue
                beleg.append({'pfad': st['pfad'], 't_clip_s': st['t_clip_s'], 'ereignis': x.get('ereignis') or st['ereignis']})
            befunde.append({'id': b['id'], 'achse': b['achse'], 'schwere': b['schwere'], 'art': b['art'], 'text': b['text'],
                            'beleg': beleg, 'quelle': b['quelle'], 'owner': b['owner'], 'malbar': b.get('malbar', True),
                            'stand': b.get('stand', 'offen'), 'referenzen': b.get('referenzen', []), 'aeste': b.get('aeste', []),
                            'bereich': b.get('bereich')})
        for st in stills:
            st.pop('_quelle')
        konf = {k: ps.get(k) for k in ('lage', 'ueberdeckung', 'handwerk', 'fehler', 'konsole', 'notiz', 'dauer_s', 'video_s',
                                       'video_fps', 'video_beginn_s') if k in ps}
        szenen.append({'scene_id': s['scene_id'], 'familie': s['familie'], 'titel': s['titel'], 'modus_geraet': lauf,
                       'clip': clip, 'stills': stills, 'ereignisse': ps.get('ereignisse', []), 'konfiguration': konf, 'befunde': befunde})

    familien = [{'id': f['id'], 'name': f['name'], 'szenen': [s['scene_id'] for s in szenen if s['familie'] == f['id']]}
                for f in spec['familien']]
    pkg = {'schema': 'kfb.ad-package.v1', 'run_id': spec['run_id'], 'paket_rev': spec['paket_rev'], 'erstellt': spec['erstellt'],
           'produkt': spec['produkt'], 'build': spec['build'], 'absicht': spec['absicht'], 'genre': spec['genre'],
           'aeste': sorted({n for s in szenen for b in s['befunde'] for n in b['aeste']}) or spec.get('aeste', [1]),
           'sop': sop_versions(), 'referenzen': refs,
           'ablage': {'repo': 'georg-doc/KFB-Stunt-Car-Race', 'branch': f'ad/{spec["run_id"]}',
                      'pfad': f'ad/{spec["run_id"]}/paket_{spec["paket_rev"]}', 'privat': True},
           'erfassung': {'quelle': spec['erfassung_wurzel'], 'laeufe': [{'modus_geraet': k, 'konfiguration': v} for k, v in laeufe.items()]},
           'familien': [f for f in familien if f['szenen']], 'szenen': szenen, 'upload': [], 'ausnahmen': ausnahmen,
           'ablauf': ablauf_version(),
           'werkzeug': {'datei': 'ad_return.py', 'sha256': sha256(WERKZEUG)},
           'leitplanken': {'datei': 'LEITPLANKEN.md', 'sha256': sha256(LEITPLANKEN), 'sop': sop_kurz(sop_versions())}}
    shutil.copy2(WERKZEUG, os.path.join(out, 'ad_return.py')); shutil.copy2(LEITPLANKEN, os.path.join(out, 'LEITPLANKEN.md'))

    for f in pkg['familien']:
        ordner = f'upload/{f["id"]}'
        os.makedirs(os.path.join(out, ordner), exist_ok=True)
        files, fam_refs = ['package.json'], []
        for s in szenen:
            if s['familie'] != f['id'] or not any(b['malbar'] for b in s['befunde']):
                continue
            noetig = {x['pfad'] for b in s['befunde'] if b['malbar'] for x in b['beleg']}
            for st in s['stills']:
                if st['pfad'] in noetig or any(b['art'] == 'bewegung' for b in s['befunde']):
                    files.append((st['edit'] or {}).get('pfad') or st['pfad'])
            for b in s['befunde']:
                fam_refs += [r for r in b['referenzen'] if r not in fam_refs]
        for r in refs:
            if r['id'] in fam_refs:
                for fr in r['frames'][:1]:
                    if len(files) < MAX_UPLOAD and not any(x in [y for q in refs for y in q['frames']] for x in files):
                        files.append(fr)
        if len(files) > MAX_UPLOAD:
            errs.append(f'Familie {f["id"]}: {len(files)} Upload-Dateien > {MAX_UPLOAD}; Familie teilen')
        names = []
        for rel in files[1:]:
            if rel in ('LEITPLANKEN.md', 'ad_return.py'):
                shutil.copy2(os.path.join(out, rel), os.path.join(out, ordner, rel)); names.append(rel); continue
            shutil.copy2(os.path.join(out, rel), os.path.join(out, ordner, os.path.basename(rel)))
            names.append(os.path.basename(rel))
        pkg['upload'].append({'familie': f['id'], 'ordner': ordner, 'dateien': ['package.json'] + names})

    dump(pkg, os.path.join(out, 'package.json'))
    for u in pkg['upload']:
        shutil.copy2(os.path.join(out, 'package.json'), os.path.join(out, u['ordner'], 'package.json'))
    errs += check(out, pkg)
    if errs:
        die(errs)
    write_readme(pkg, out)
    register_paket(pkg, out)
    print(f'OK: Paket {pkg["run_id"]} {pkg["paket_rev"]} #{canon_hash(pkg)[:12]} → {out}')


def ordnername(pkg, fam, lauf=1):
    return f'{pkg["run_id"]}_{pkg["paket_rev"]}_{fam}_l{lauf}'


def aufruf(pkg, fam, lauf=1, nur=None):
    url = f'https://github.com/{pkg["ablage"]["repo"]}/tree/{pkg["ablage"]["branch"]}/{pkg["ablage"]["pfad"]}'
    return (f'Nutze den Skill kfb-art-direction: kfb-art-direction {url} Familie {fam} Lauf {lauf}'
            + (f' Nur {",".join(nur)}' if nur else '') + f' Ordner {ordnername(pkg, fam, lauf)} #{canon_hash(pkg)[:12]}')


def write_readme(pkg, out):
    lines = [f'# AD-Paket {pkg["run_id"]} ({pkg["paket_rev"]})', '',
             f'Produkt: {pkg["produkt"]["name"]} · Build {pkg["build"]["version"]}', f'Absicht: {pkg["absicht"]}', '',
             'Je Familie ein neuer ChatGPT-Chat, nacheinander. Erste Nachricht (eine Zeile) und dazu alle Dateien aus',
             'dem genannten Ordner in Dropbox › KFB_AD in den Chat ziehen:', '']
    for u in pkg['upload']:
        lines.append(f'- Familie {u["familie"]}: `{aufruf(pkg, u["familie"])}`')
    with open(os.path.join(out, 'README.md'), 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines) + '\n')


def check(out, pkg=None):
    pkg = pkg or json.load(open(os.path.join(out, 'package.json'), encoding='utf-8'))
    errs = validate(pkg, load_schema('kfb.ad-package.v1'))
    if errs:
        return errs
    aus = set(pkg.get('ausnahmen', []))
    ids, refs = set(), {r['id']: r for r in pkg['referenzen']}

    def same(rel, h):
        p = os.path.join(out, rel)
        if not os.path.exists(p):
            errs.append(f'fehlt: {rel}')
        elif sha256(p) != h:
            errs.append(f'sha256 weicht ab: {rel}')
    for r in refs.values():
        for fr in r['frames']:
            if not os.path.exists(os.path.join(out, fr)):
                errs.append(f'Referenz-Frame fehlt: {fr}')
    for s in pkg['szenen']:
        for st in s['stills']:
            same(st['pfad'], st['sha256'])
            if st['edit']:
                same(st['edit']['pfad'], st['edit']['sha256'])
        c = s['clip']
        if c:
            same(c['pfad'], c['sha256'])
            if c['dauer_s'] and c['t_end'] is not None and c['t_end'] > c['dauer_s'] + 0.05:
                errs.append(f'{s["scene_id"]}: t_end {c["t_end"]} > Clipdauer {c["dauer_s"]}')
            if c['t_start'] is not None and c['t_end'] is not None and c['t_start'] >= c['t_end']:
                errs.append(f'{s["scene_id"]}: t_start ≥ t_end')
        roles = {st['rolle'] for st in s['stills']}
        for b in s['befunde']:
            if b['id'] in ids:
                errs.append(f'Befund-ID doppelt: {b["id"]}')
            ids.add(b['id'])
            if 'behoben' in b['stand'].lower() and 'behoben' not in aus:
                errs.append(f'{b["id"]}: Stand „{b["stand"]}“ – behobene Befunde nicht malen lassen')
            if b['art'] == 'bewegung':
                if not c or not {'ausholung', 'aufprall'} <= roles:
                    errs.append(f'{b["id"]}: Bewegungsbefund braucht Clip und Stills ausholung + aufprall')
                elif c.get('zeit_unsicher') and 'zeit_unsicher' not in aus:
                    errs.append(f'{b["id"]}: Clip-Zeitfenster unbekannt (protokoll ohne video_beginn_s); nur mit --erlaube-zeit-unsicher')
            for r in b['referenzen']:
                if r not in refs:
                    errs.append(f'{b["id"]}: Referenz {r} nicht im Paket')
            if b['malbar']:
                if not b['referenzen']:
                    errs.append(f'{b["id"]}: malbarer Befund ohne Referenz')
                elif not any(refs.get(r, {}).get('frames') for r in b['referenzen']):
                    errs.append(f'{b["id"]}: keine Referenz mit Frames (Anti-Sample 2: keine Stilwörter ohne Bild)')
    for k in ('werkzeug', 'leitplanken'):
        same(pkg[k]['datei'], pkg[k]['sha256'])
    for u in pkg['upload']:
        for fn in u['dateien']:
            if not os.path.exists(os.path.join(out, u['ordner'], fn)):
                errs.append(f'Upload {u["familie"]}: {fn} fehlt')
        if u['dateien'][0] != 'package.json':
            errs.append(f'Upload {u["familie"]}: package.json muss zuerst stehen')
        if len(set(u['dateien'])) != len(u['dateien']):
            errs.append(f'Upload {u["familie"]}: Dateiname doppelt')
    return errs


def stage(out, fam, ziel, lauf=1, anker=None, nur=None):
    """Upload-Ordner einer Familie; Lauf ≥ 2: mit Anker-Bild (erstes PASS aus Lauf 1) und nur den noch offenen Befunden."""
    pkg = json.load(open(os.path.join(out, 'package.json'), encoding='utf-8'))
    u = next((x for x in pkg['upload'] if x['familie'] == fam), None)
    if not u:
        die(f'Familie {fam} hat keinen Upload-Ordner')
    ids = {b['id'] for s in pkg['szenen'] if s['familie'] == fam for b in s['befunde']}
    if nur and not set(nur) <= ids:
        die(f'--nur {nur}: nicht alle in Familie {fam} ({sorted(ids)})')
    if lauf > 1 and not anker:
        die('Lauf ≥ 2 braucht --anker <PASS-Bild aus dem ersten Lauf> (Stil-Anker)')
    dst = os.path.join(os.path.expanduser(ziel), ordnername(pkg, fam, lauf))
    if os.path.exists(dst):
        die(f'{dst} existiert schon (nichts überschreiben)')
    os.makedirs(dst)
    for fn in u['dateien']:
        shutil.copy2(os.path.join(out, u['ordner'], fn), os.path.join(dst, fn))
    if anker:
        shutil.copy2(anker, os.path.join(dst, 'ANKER_' + os.path.basename(anker)))
    print(f'OK: {len(os.listdir(dst))} Dateien → {dst}')
    print('Aufruf:', aufruf(pkg, fam, lauf, nur))


def git(*a, env=None, inp=None):
    r = subprocess.run(['git', *a], capture_output=True, text=True, env=env, input=inp)
    if r.returncode:
        die(f'git {" ".join(a)}: {r.stderr.strip()}')
    return r.stdout.strip()


def publish(out, push=False, run=None, unter=None):
    """Paket (Standard) oder mit run+unter einen Rückgabe-Ordner nach ad/<run>/<unter>/."""
    if run and unter:
        if not re.match(r'^rueckgabe/[A-F]_l[0-9]+$', unter) or not re.match(r'^[a-z0-9]+(-[a-z0-9]+)*$', run):
            die('--unter nur rueckgabe/<Familie>_l<n>, --run wie run_id')
        br, prefix, label = f'ad/{run}', f'ad/{run}/{unter}/', unter
    else:
        errs = check(out)
        if errs:
            die(errs)
        pkg = json.load(open(os.path.join(out, 'package.json'), encoding='utf-8'))
        run, br, prefix, label = pkg['run_id'], pkg['ablage']['branch'], pkg['ablage']['pfad'] + '/', pkg['paket_rev']
    files = [os.path.relpath(os.path.join(dp, fn), out) for dp, _, fns in os.walk(out) for fn in fns if not fn.startswith('.')]
    w = tempfile.mkdtemp(prefix='kfbad')
    env = dict(os.environ, GIT_DIR=os.path.join(w, 'r.git'), GIT_INDEX_FILE=os.path.join(w, 'idx'),
               GIT_SSH_COMMAND=f'ssh -i {PRIV_KEY} -o IdentitiesOnly=yes', GIT_NO_LAZY_FETCH='1')
    try:
        git('init', '-q', '--bare', env['GIT_DIR'])
        parent = None
        if push:
            if git('ls-remote', PRIV_REPO, f'refs/heads/{br}', env=env):
                git('fetch', '-q', '--filter=blob:none', '--depth=1', PRIV_REPO, f'refs/heads/{br}:refs/heads/{br}', env=env)
                parent = git('rev-parse', f'refs/heads/{br}', env=env)
                if git('ls-tree', '--name-only', parent, prefix.rstrip('/'), env=env):
                    die(f'{prefix} gibt es schon auf {br}: neue Paket-Revision bzw. neuer Lauf, nichts überschreiben')
                git('read-tree', parent, env=env)
        for rel in sorted(files):
            h = git('hash-object', '-w', os.path.join(out, rel), env=env)
            git('update-index', '--add', '--cacheinfo', f'100644,{h},{prefix}{rel}', env=env)
        tree = git('write-tree', '--missing-ok', env=env)
        msg = f'AD {run} {label} (privat)\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>\n'
        c = git('commit-tree', tree, *(['-p', parent] if parent else []), env=env, inp=msg)
        changed = [x for x in git('diff-tree', '-r', '--no-commit-id', '--name-only', *([parent, c] if parent else ['--root', c]), env=env).split('\n') if x]
        bad = [x for x in changed if not x.startswith(prefix)]
        if bad:
            die(f'Commit berührt fremde Pfade: {bad[:5]}')
        print(f'{len(changed)} Dateien unter {prefix} → {PRIV_REPO} {br}')
        if not push:
            print('PROBE: nichts gepusht (--push zum Veröffentlichen)')
            return
        git('push', '-q', PRIV_REPO, f'{c}:refs/heads/{br}', env=env)
        print(f'gepusht {c[:8]} · https://github.com/georg-doc/KFB-Stunt-Car-Race/tree/{br}/{prefix.rstrip("/")}')
    finally:
        shutil.rmtree(w, ignore_errors=True)


def main():
    a = sys.argv[1:]
    if not a:
        sys.exit(__doc__)
    cmd = a[0]
    if cmd == 'pin' and len(a) >= 2:
        pin(a[1])
    elif cmd == 'build' and len(a) >= 3:
        build(a[1], a[2], [x for x, f in (('behoben', '--erlaube-behoben'), ('zeit_unsicher', '--erlaube-zeit-unsicher')) if f in a])
    elif cmd == 'validate' and len(a) >= 2:
        errs = check(a[1])
        if errs:
            die(errs)
        print('OK: Paket gültig')
    elif cmd == 'stage' and len(a) >= 3:
        stage(a[1], a[2], arg(a, '--ziel') or KFB_AD, int(arg(a, '--lauf') or 1), arg(a, '--anker'),
              [x for x in (arg(a, '--nur') or '').split(',') if x] or None)
    elif cmd == 'publish' and len(a) >= 2:
        publish(a[1], '--push' in a, arg(a, '--run'), arg(a, '--unter'))
    else:
        sys.exit(__doc__)


if __name__ == '__main__':
    main()
