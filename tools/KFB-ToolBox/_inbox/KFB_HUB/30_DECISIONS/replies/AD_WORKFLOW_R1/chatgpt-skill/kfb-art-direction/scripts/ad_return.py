#!/usr/bin/env python3
"""kfb-art-direction · Rückgabe-Werkzeug für die ChatGPT-Sandbox (Standardbibliothek, Pillow nur für die Übersicht).
Arbeitsordner: --arbeit (Standard /mnt/data/kfb_ad). Jeder Schritt schreibt entwurf.json fort.

  start      --paket package.json --familie D [--lauf 1] [--nur F01,F03] [--erwarte <12 Zeichen>] [--modell ".."] [--neu]
             [--gestartet <Zeit aus der ersten start-Ausgabe>]   (Wiederaufnahme nach verlorener Sandbox)
  ziel       --finding F03 --rolle aufprall (--bild datei | --ohne-datei) [--fassung n]   Zielbild registrieren
  verwerfen  --finding F03 --grund ".."                                   Befund ohne Zielbild zurückgeben
  texte      --finding F03 --aenderung .. --bleibt .. --warum .. --referenzen a,b --baubarkeit '{json}'
  freigabe   --target F03_aufprall_v1 --status PASS|TUNE|FAIL [--wortlaut ".."] [--notiz ".."] [--zeit <aus ZUSTAND>]
  uebersicht                                                               2×2-Blätter der neuesten Ziele mit Datei
  status                                                                   was fehlt noch
  abschluss  --weg bundle|einzeln|github                                   prüfen + Rückgabedatei schreiben
"""
import base64, datetime, hashlib, json, os, re, shutil, struct, sys

SKILL_VERSION = 'r1'
HERE = os.path.dirname(os.path.abspath(__file__))
SCHEMA_NAME = 'kfb.ad-return.v1.json'
SCHEMA_ORTE = [os.path.join(os.path.dirname(HERE), 'references'), os.path.join(HERE, 'references'), HERE, '/mnt/data']
FLAGS = ['echtzeit_threejs', 'ein_licht_rig', 'keine_glanzpunkte', 'kein_neuer_text', 'figuren_unveraendert',
         'komposition_gleich', 'seitenverhaeltnis_gleich']


def now():
    return datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')


def arg(a, k, default=None):
    return a[a.index(k) + 1] if k in a else default


def die(m):
    print('FEHLER:', m); sys.exit(2)


def canon_hash(obj):
    return hashlib.sha256(json.dumps(obj, sort_keys=True, ensure_ascii=False, separators=(',', ':')).encode('utf-8')).hexdigest()


def self_sha():
    return hashlib.sha256(open(os.path.abspath(__file__), 'rb').read()).hexdigest()


def size(d):
    if d[:8] == b'\x89PNG\r\n\x1a\n':
        return struct.unpack('>II', d[16:24])
    if d[:4] == b'RIFF' and d[8:12] == b'WEBP' and d[12:16] == b'VP8X':
        return int.from_bytes(d[24:27], 'little') + 1, int.from_bytes(d[27:30], 'little') + 1
    if d[:2] == b'\xff\xd8':
        i = 2
        while i < len(d) - 9:
            if d[i] != 0xFF:
                i += 1; continue
            if d[i + 1] in (0xC0, 0xC1, 0xC2):
                h, w = struct.unpack('>HH', d[i + 5:i + 9]); return w, h
            i += 2 + struct.unpack('>H', d[i + 2:i + 4])[0]
    try:
        from PIL import Image
        import io
        return Image.open(io.BytesIO(d)).size
    except Exception:
        return None


def ratio_ok(wh, w, h):
    return abs(wh[0] / wh[1] - w / h) / (w / h) <= 0.01


def validate(o, s, root=None, p='$'):
    root = root or s
    if '$ref' in s:
        return validate(o, root['$defs'][s['$ref'].split('/')[-1]], root, p)
    T = {'object': dict, 'array': list, 'string': str, 'boolean': bool, 'null': type(None)}
    def isa(v, t):
        if t == 'integer': return isinstance(v, int) and not isinstance(v, bool)
        if t == 'number': return isinstance(v, (int, float)) and not isinstance(v, bool)
        return isinstance(v, T[t])
    e = []
    if 'type' in s:
        ts = s['type'] if isinstance(s['type'], list) else [s['type']]
        if not any(isa(o, t) for t in ts):
            return [f'{p}: falscher Typ']
    if 'const' in s and o != s['const']: e.append(f'{p}: muss {s["const"]} sein')
    if 'enum' in s and o not in s['enum']: e.append(f'{p}: {o!r} nicht erlaubt')
    if isinstance(o, str):
        if len(o) < s.get('minLength', 0): e.append(f'{p}: zu kurz')
        if 'pattern' in s and not re.search(s['pattern'], o): e.append(f'{p}: Format {o!r}')
    if isa(o, 'number'):
        if o < s.get('minimum', o): e.append(f'{p}: zu klein')
        if o > s.get('maximum', o): e.append(f'{p}: zu groß')
    if isinstance(o, list):
        if len(o) < s.get('minItems', 0): e.append(f'{p}: zu wenige')
        for i, v in enumerate(o):
            e += validate(v, s.get('items', {}), root, f'{p}[{i}]')
    if isinstance(o, dict):
        e += [f'{p}: {k} fehlt' for k in s.get('required', []) if k not in o]
        pr, ad = s.get('properties', {}), s.get('additionalProperties', True)
        for k, v in o.items():
            if k in pr: e += validate(v, pr[k], root, f'{p}.{k}')
            elif ad is False: e.append(f'{p}: unbekannt {k}')
            elif isinstance(ad, dict): e += validate(v, ad, root, f'{p}.{k}')
    return e


class Arbeit:
    def __init__(self, a):
        self.dir = arg(a, '--arbeit', '/mnt/data/kfb_ad')
        self.path = os.path.join(self.dir, 'entwurf.json')

    def load(self):
        if not os.path.exists(self.path):
            die('kein Entwurf: zuerst start')
        return json.load(open(self.path, encoding='utf-8'))

    def save(self, d):
        os.makedirs(self.dir, exist_ok=True)
        json.dump(d, open(self.path, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)


def find(d, fid):
    b = next((x for x in d['befunde'] if x['finding_id'] == fid), None)
    if not b:
        die(f'{fid} gehört nicht zu Familie {d["familie"]} dieses Pakets')
    return b


def file_sha(p):
    return hashlib.sha256(open(p, 'rb').read()).hexdigest() if os.path.exists(p) else None


def start(a, w):
    pp = arg(a, '--paket'); pdir = os.path.dirname(os.path.abspath(pp))
    pkg = json.load(open(pp, encoding='utf-8')); fam = arg(a, '--familie')
    if pkg.get('schema') != 'kfb.ad-package.v1':
        die('kein kfb.ad-package.v1')
    if os.path.exists(w.path) and '--neu' not in a:
        die('Es gibt schon einen Entwurf in diesem Chat: weiterarbeiten (status); neu nur mit --neu')
    h = canon_hash(pkg)
    if arg(a, '--erwarte') and not h.startswith(arg(a, '--erwarte').lstrip('#')):
        die(f'Paket-Prüfsumme {h[:12]} ≠ Aufruf {arg(a, "--erwarte")}: falsche oder veränderte package.json – Ordner neu hochladen')
    if self_sha() != pkg['werkzeug']['sha256']:
        die('Dieses ad_return.py gehört nicht zum Paket: Skill veraltet, bitte den Skill kfb-art-direction neu hochladen')
    lp_orte = [os.path.join(pdir, 'LEITPLANKEN.md'), os.path.join(os.path.dirname(HERE), 'references', 'LEITPLANKEN.md'), os.path.join(HERE, 'references', 'LEITPLANKEN.md')]
    if pkg['leitplanken']['sha256'] not in [file_sha(x) for x in lp_orte]:
        die('LEITPLANKEN.md im Skill passt nicht zum Paket: Skill veraltet, bitte den Skill kfb-art-direction neu hochladen')
    if fam not in [f['id'] for f in pkg['familien']]:
        die(f'Familie {fam} nicht im Paket: {[f["id"] for f in pkg["familien"]]}')
    soll = {}
    for s in pkg['szenen']:
        for st in s['stills']:
            soll[os.path.basename(st['pfad'])] = st['sha256']
            if st['edit']:
                soll[os.path.basename(st['edit']['pfad'])] = st['edit']['sha256']
    u = next(x for x in pkg['upload'] if x['familie'] == fam)
    fehlt = [fn for fn in u['dateien'] if not os.path.exists(os.path.join(pdir, fn))]
    falsch = [fn for fn in u['dateien'] if fn in soll and fn not in fehlt and file_sha(os.path.join(pdir, fn)) != soll[fn]]
    if fehlt or falsch:
        die(f'Upload passt nicht zu Familie {fam}: fehlt {fehlt or "–"}, verändert {falsch or "–"}. Ordner {pkg["run_id"]}_{fam} vollständig hochladen')
    befunde, ausgabe = [], []
    nur = [x for x in (arg(a, '--nur') or '').split(',') if x]
    for s in pkg['szenen']:
        if s['familie'] != fam:
            continue
        for b in s['befunde']:
            if nur and b['id'] not in nur:
                befunde.append({'finding_id': b['id'], 'scene_id': s['scene_id'], 'status': 'uebersprungen',
                                'grund': 'anderer Lauf: nicht Teil dieses Laufs', 'aenderung': '', 'bleibt': '', 'warum': '',
                                'referenzen': [], 'aeste': b['aeste'], 'baubarkeit': None, 'ziele': [], '_stills': {}, '_art': b['art'],
                                '_rollen': [], '_refs': b['referenzen'], '_bereich': None})
                continue
            bp = {x['pfad'] for x in b['beleg']}
            rollen = ['ausholung', 'aufprall'] if b['art'] == 'bewegung' else [st['rolle'] for st in s['stills'] if st['pfad'] in bp]
            befunde.append({'finding_id': b['id'], 'scene_id': s['scene_id'],
                            'status': 'bearbeitet' if b['malbar'] else 'nicht_malbar',
                            'grund': None if b['malbar'] else 'laut Paket nicht als Bild lösbar',
                            'aenderung': '', 'bleibt': '', 'warum': '', 'referenzen': [], 'aeste': b['aeste'],
                            'baubarkeit': None, 'ziele': [],
                            '_stills': {st['rolle']: st for st in s['stills']}, '_art': b['art'], '_rollen': rollen,
                            '_refs': b['referenzen'], '_bereich': b.get('bereich')})
            ausgabe.append(f'{b["id"]} · {s["scene_id"]} · Achse {b["achse"]} · {b["art"]} · {"malbar" if b["malbar"] else "NICHT malbar"} · '
                           f'Referenzen {",".join(b["referenzen"])}: {b["text"]}')
            for st in s['stills']:
                if b['malbar'] and st['rolle'] in rollen:
                    datei = os.path.basename((st['edit'] or {}).get('pfad') or st['pfad'])
                    ausgabe.append(f'    bearbeiten: {datei} (Rolle {st["rolle"]})' + (' · grauer Rand bleibt grau' if st['edit'] else ''))
    d = {'schema': 'kfb.ad-return.v1', 'run_id': pkg['run_id'], 'familie': fam, 'lauf': int(arg(a, '--lauf', 1)),
         'paket': {'repo': pkg['ablage']['repo'], 'branch': pkg['ablage']['branch'], 'pfad': pkg['ablage']['pfad'],
                   'paket_rev': pkg['paket_rev'], 'sha256': h},
         'webchat': {'plattform': 'chatgpt', 'modell': arg(a, '--modell', 'unbekannt'), 'skill': 'kfb-art-direction',
                     'skill_version': SKILL_VERSION, 'skill_sha256': self_sha(), 'sop': pkg['leitplanken']['sop'],
                     'gestartet': arg(a, '--gestartet') or now(), 'beendet': '',
                     'chat_titel': None},
         'check_in': {'weg': 'bundle', 'ziel': None}, 'simuliert': '--simuliert' in a, 'befunde': befunde,
         '_refs': {r['id']: r['name'] for r in pkg['referenzen']}}
    w.save(d)
    print(f'Skript-Prüfsumme {self_sha()[:12]} · Ablauf {pkg["ablauf"]} · Paket #{h[:12]} · Familie {fam} · {len(befunde)} Befunde · gestartet {d["webchat"]["gestartet"]}')
    print('\n'.join(ausgabe))


def ziel(a, w):
    d = w.load(); b = find(d, arg(a, '--finding')); rolle = arg(a, '--rolle', 'still')
    if b['status'] != 'bearbeitet':
        die(f'{b["finding_id"]} ist {b["status"]}')
    if rolle not in b['_rollen']:
        die(f'Rolle {rolle} ist für {b["finding_id"]} nicht verlangt; verlangt: {b["_rollen"]}')
    src = b['_stills'][rolle]
    n = 1 + max([z['iteration'] for z in b['ziele'] if z['rolle'] == rolle], default=0)
    if arg(a, '--fassung'):
        n = max(n, int(arg(a, '--fassung')))
    if n > 3:
        die('mehr als 3 Fassungen: Befund als FAIL abschließen, nicht weiter malen')
    tid = f'{b["finding_id"]}_{rolle}_v{n}'
    z = {'target_id': tid, 'quelle_still': src['pfad'], 'rolle': rolle, 'iteration': n, 'datei': None, 'download_nr': None,
         'sha256': None, 'breite': None, 'hoehe': None, 'format': None,
         'freigabe': {'status': 'OFFEN', 'notiz': None, 'georg_wortlaut': None, 'zeit': now()}}
    bild = arg(a, '--bild')
    if bild:
        data = open(bild, 'rb').read(); wh = size(data)
        if not wh:
            die('Bildformat nicht lesbar')
        e = src.get('edit')
        if ratio_ok(wh, src['breite'], src['hoehe']):
            z['format'] = 'original'
        elif e and ratio_ok(wh, e['breite'], e['hoehe']):
            z['format'] = 'edit'
        else:
            die(f'Format {wh[0]}×{wh[1]} passt weder zum Original {src["breite"]}×{src["hoehe"]} noch zur hochgeladenen Fassung'
                + (f' {e["breite"]}×{e["hoehe"]}' if e else '') + ': die hochgeladene Datei bearbeiten, nicht neu erzeugen')
        hs = hashlib.sha256(data).hexdigest()
        if hs in (src['sha256'], (e or {}).get('sha256')) and not d['simuliert']:
            die('Zielbild ist unverändert das Original: erst malen, dann registrieren')
        ext = os.path.splitext(bild)[1].lower().replace('.jpeg', '.jpg') or '.png'
        os.makedirs(os.path.join(w.dir, 'ziele'), exist_ok=True)
        z['datei'] = f'ziele/{tid}{ext}'
        shutil.copyfile(bild, os.path.join(w.dir, z['datei']))
        z.update(sha256=hs, breite=wh[0], hoehe=wh[1])
    elif '--ohne-datei' not in a:
        die('--bild oder --ohne-datei angeben')
    b['ziele'].append(z); w.save(d)
    print(f'registriert {tid}' + (f' ({z["format"]})' if bild else ' (ohne Datei: Georg lädt das Bild am Ende)'))


def texte(a, w):
    d = w.load(); b = find(d, arg(a, '--finding'))
    for k in ('aenderung', 'bleibt', 'warum'):
        v = arg(a, '--' + k)
        if v:
            b[k] = v.strip()
    if arg(a, '--aeste'):
        die(f'Äste stehen fest im Paket ({b["aeste"]}), nicht ändern')
    if arg(a, '--referenzen'):
        refs = [x.strip() for x in arg(a, '--referenzen').split(',') if x.strip()]
        bad = [r for r in refs if r not in b['_refs']]
        if bad:
            die(f'Referenzen {bad} gehören nicht zu {b["finding_id"]}; erlaubt: {b["_refs"]}')
        b['referenzen'] = refs
    if arg(a, '--baubarkeit'):
        bb = json.loads(arg(a, '--baubarkeit'))
        miss = [f for f in FLAGS + ['hud_aus_kit', 'neue_assets', 'hinweis'] if f not in bb]
        if miss:
            die(f'Baubarkeit unvollständig: {miss}')
        b['baubarkeit'] = bb
    w.save(d); print(f'{b["finding_id"]}: Texte gespeichert')


def verwerfen(a, w):
    d = w.load(); b = find(d, arg(a, '--finding')); g = arg(a, '--grund')
    if not g:
        die('--grund angeben (ein Satz)')
    if any(z['freigabe']['status'] == 'PASS' for z in b['ziele']):
        die(f'{b["finding_id"]} hat schon ein PASS-Bild: nicht verwerfen')
    b['status'] = 'uebersprungen'; b['grund'] = g.strip(); b['ziele'] = []
    w.save(d); print(f'{b["finding_id"]}: ohne Zielbild zurück ({g.strip()})')


def zustand(d):
    return 'ZUSTAND ' + '; '.join(f'{z["target_id"]}={z["freigabe"]["status"]}@{z["freigabe"]["zeit"]}' for b in d['befunde'] for z in neueste(b).values()) \
        + ' · gestartet ' + d['webchat']['gestartet']


def neueste(b):
    out = {}
    for z in b['ziele']:
        out[z['rolle']] = z
    return out


def freigabe(a, w):
    d = w.load(); tid = arg(a, '--target'); st = arg(a, '--status')
    if st not in ('PASS', 'TUNE', 'FAIL'):
        die('Status PASS, TUNE oder FAIL')
    for b in d['befunde']:
        for z in b['ziele']:
            if z['target_id'] == tid:
                if z is not neueste(b).get(z['rolle']):
                    die(f'{tid} ist nicht die neueste Fassung')
                z['freigabe'] = {'status': st, 'notiz': arg(a, '--notiz'), 'georg_wortlaut': arg(a, '--wortlaut'), 'zeit': arg(a, '--zeit') or now()}
                w.save(d); print(f'{tid}: {st}'); print(zustand(d)); return
    die(f'{tid} unbekannt')


def offen(d):
    o = []
    for b in d['befunde']:
        if b['status'] != 'bearbeitet':
            continue
        for r in b['_rollen']:
            if r not in neueste(b):
                o.append(f'{b["finding_id"]}: Zielbild für Rolle {r} fehlt')
        if any(z['freigabe']['status'] == 'PASS' for z in neueste(b).values()):
            for k in ('aenderung', 'bleibt', 'warum'):
                if not b[k]:
                    o.append(f'{b["finding_id"]}: Zeile {k} fehlt')
            if not b['referenzen']:
                o.append(f'{b["finding_id"]}: keine Referenz')
            if not b['baubarkeit']:
                o.append(f'{b["finding_id"]}: Baubarkeit fehlt')
        for z in neueste(b).values():
            if z['freigabe']['status'] in ('OFFEN', 'TUNE'):
                o.append(f'{z["target_id"]}: wartet auf Georg ({z["freigabe"]["status"]})')
    return o


def uebersicht(a, w):
    d = w.load()
    try:
        from PIL import Image, ImageDraw
    except ImportError:
        die('Pillow fehlt: Bilder einzeln zeigen')
    zs = [(z, b) for b in d['befunde'] for z in neueste(b).values() if z['datei']]
    if not zs:
        die('keine Zielbilder als Datei: Bilder einzeln im Chat zeigen')
    outs = []
    for k in range(0, len(zs), 4):
        teil = zs[k:k + 4]
        ims = [Image.open(os.path.join(w.dir, z['datei'])).convert('RGB') for z, _ in teil]
        cw = 960; ch = int(cw * ims[0].height / ims[0].width)
        sheet = Image.new('RGB', (cw * 2 + 30, (ch + 40) * 2 + 10), (24, 24, 24)); dr = ImageDraw.Draw(sheet)
        for i, ((z, b), im) in enumerate(zip(teil, ims)):
            x, y = 10 + (i % 2) * (cw + 10), 10 + (i // 2) * (ch + 40)
            im = im.copy(); im.thumbnail((cw, ch)); sheet.paste(im, (x, y + 30))
            dr.text((x, y + 8), f'{z["target_id"]} · {b["scene_id"]}', fill=(240, 240, 240))
        p = os.path.join(w.dir, f'uebersicht_{k // 4 + 1}.png'); sheet.save(p); outs.append(p)
    print('\n'.join(outs))


def abschluss(a, w):
    d = w.load(); weg = arg(a, '--weg', 'bundle')
    rest = offen(d)
    if rest:
        die('noch offen:\n  ' + '\n  '.join(rest))
    d['webchat']['beendet'] = d['webchat']['beendet'] or now(); d['check_in']['weg'] = weg
    nr = 0
    for b in d['befunde']:
        for z in b['ziele']:
            z['download_nr'] = None
            if z['freigabe']['status'] == 'PASS' and weg == 'einzeln':
                nr += 1; z['download_nr'] = nr
    w.save(d)
    out = {k: v for k, v in d.items() if not k.startswith('_')}
    out['befunde'] = [{k: v for k, v in b.items() if not k.startswith('_')} for b in d['befunde']]
    for b in out['befunde']:
        if b['baubarkeit'] is None:
            b['baubarkeit'] = {**{f: False for f in FLAGS}, 'hud_aus_kit': None, 'neue_assets': [], 'hinweis': b.get('grund') or 'nicht bearbeitet'}
    if weg in ('bundle', 'github'):
        out['bilder_b64'] = {}
        for b in out['befunde']:
            for z in b['ziele']:
                if z['freigabe']['status'] == 'PASS':
                    if not z['datei']:
                        die(f'{z["target_id"]} hat keine Datei: Weg einzeln wählen')
                    out['bilder_b64'][z['datei']] = base64.b64encode(open(os.path.join(w.dir, z['datei']), 'rb').read()).decode()
        if weg == 'github':
            out.pop('bilder_b64')
    schema = arg(a, '--schema') or next((os.path.join(o, SCHEMA_NAME) for o in SCHEMA_ORTE if os.path.exists(os.path.join(o, SCHEMA_NAME))), None)
    errs = validate(out, json.load(open(schema, encoding='utf-8')) if schema else json.loads(SCHEMA_EINGEBETTET))
    if errs:
        die('Schema:\n  ' + '\n  '.join(errs[:20]))
    stamp = d['webchat']['gestartet'].replace('-', '').replace(':', '')[:13]
    name = f'kfb-ad-return_{d["run_id"]}_{d["familie"]}_l{d["lauf"]}_{stamp}.json'
    p = os.path.join(w.dir, name)
    json.dump(out, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    pas = [z for b in out['befunde'] for z in b['ziele'] if z['freigabe']['status'] == 'PASS']
    print(f'{p}\nPASS: {", ".join(z["target_id"] for z in pas) or "keine"}')
    if weg == 'einzeln':
        for z in pas:
            print(f'  Bild {z["download_nr"]}: {z["target_id"]}')


# Kopie von schema/kfb.ad-return.v1.json (Test prüft Gleichheit); gilt, wenn keine Schema-Datei daneben liegt.
SCHEMA_EINGEBETTET = r'''{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "kfb.ad-return.v1",
  "title": "KFB Art-Direction-Rückgabe v1 (Webchat → WS0)",
  "description": "Eine Rückgabe = ein Webchat-Lauf = eine Szenenfamilie eines Pakets. Jedes Zielbild ist über finding_id, scene_id, quelle_still und paket.sha256 auf Befund, Clip+Zeit, Screenshot, Referenz und SOP-Ast rückführbar.",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema",
    "run_id",
    "familie",
    "paket",
    "webchat",
    "check_in",
    "simuliert",
    "befunde"
  ],
  "properties": {
    "schema": {
      "const": "kfb.ad-return.v1"
    },
    "run_id": {
      "type": "string",
      "pattern": "^[a-z0-9]+(-[a-z0-9]+)*$"
    },
    "familie": {
      "type": "string",
      "pattern": "^[A-F]$"
    },
    "lauf": {
      "type": "integer",
      "minimum": 1,
      "description": "1 = erster Webchat-Lauf dieser Familie; neuer Chat = +1"
    },
    "paket": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "repo",
        "branch",
        "pfad",
        "paket_rev",
        "sha256"
      ],
      "properties": {
        "repo": {
          "type": "string"
        },
        "branch": {
          "type": "string"
        },
        "pfad": {
          "type": "string"
        },
        "paket_rev": {
          "type": "string",
          "pattern": "^r[0-9]+$"
        },
        "sha256": {
          "type": "string",
          "pattern": "^[0-9a-f]{64}$",
          "description": "sha256 der kanonischen package.json (json.dumps sort_keys, separators , :) – unempfindlich gegen Neu-Formatierung, empfindlich gegen jede Inhaltsänderung"
        }
      }
    },
    "webchat": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "plattform",
        "modell",
        "skill",
        "skill_version",
        "gestartet",
        "beendet",
        "skill_sha256",
        "sop"
      ],
      "properties": {
        "plattform": {
          "type": "string"
        },
        "modell": {
          "type": "string",
          "description": "so genau, wie der Chat es weiß, z. B. 'ChatGPT Images 2.5'"
        },
        "skill": {
          "const": "kfb-art-direction"
        },
        "skill_version": {
          "type": "string",
          "pattern": "^r[0-9]+(\\.[0-9]+)?$"
        },
        "gestartet": {
          "type": "string"
        },
        "beendet": {
          "type": "string"
        },
        "chat_titel": {
          "type": [
            "string",
            "null"
          ]
        },
        "skill_sha256": {
          "type": "string",
          "pattern": "^[0-9a-f]{64}$",
          "description": "sha256 von ad_return.py, wie es im Chat lief"
        },
        "sop": {
          "type": "string",
          "description": "SOP-Stand der Leitplanke, z. B. Stamm R2 · Äste R1 · Referenzen R1"
        }
      }
    },
    "check_in": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "weg"
      ],
      "properties": {
        "weg": {
          "enum": [
            "github",
            "bundle",
            "einzeln"
          ],
          "description": "github = Commit durch den Webchat; bundle = eine JSON-Datei mit eingebetteten Bildern; einzeln = Manifest + Bilder einzeln geladen"
        },
        "ziel": {
          "type": [
            "string",
            "null"
          ]
        }
      }
    },
    "simuliert": {
      "type": "boolean",
      "description": "true = Probelauf ohne echte Bildgenerierung; nie bauen"
    },
    "befunde": {
      "type": "array",
      "minItems": 1,
      "items": {
        "$ref": "#/$defs/befund"
      }
    },
    "bilder_b64": {
      "type": "object",
      "description": "nur bei weg=bundle: datei → Base64 (PNG/JPEG/WebP)",
      "additionalProperties": {
        "type": "string",
        "minLength": 16
      }
    }
  },
  "$defs": {
    "freigabe": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "status",
        "zeit"
      ],
      "properties": {
        "status": {
          "enum": [
            "PASS",
            "TUNE",
            "FAIL",
            "OFFEN"
          ]
        },
        "notiz": {
          "type": [
            "string",
            "null"
          ]
        },
        "georg_wortlaut": {
          "type": [
            "string",
            "null"
          ],
          "description": "Georgs Worte wörtlich"
        },
        "zeit": {
          "type": "string"
        }
      }
    },
    "ziel": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "target_id",
        "quelle_still",
        "rolle",
        "iteration",
        "datei",
        "sha256",
        "breite",
        "hoehe",
        "freigabe"
      ],
      "properties": {
        "target_id": {
          "type": "string",
          "pattern": "^F[0-9]{2}_(still|ausholung|aufprall|naehe)_v[0-9]+$"
        },
        "quelle_still": {
          "type": "string",
          "description": "pfad aus package.json szenen[].stills[]"
        },
        "rolle": {
          "enum": [
            "still",
            "ausholung",
            "aufprall",
            "naehe"
          ]
        },
        "iteration": {
          "type": "integer",
          "minimum": 1,
          "maximum": 3
        },
        "datei": {
          "type": [
            "string",
            "null"
          ],
          "pattern": "^ziele/F[0-9]{2}_(still|ausholung|aufprall|naehe)_v[0-9]+\\.(png|jpg|webp)$"
        },
        "download_nr": {
          "type": [
            "integer",
            "null"
          ],
          "minimum": 1,
          "description": "nur weg=einzeln: Reihenfolge, in der Georg die PASS-Bilder lädt"
        },
        "sha256": {
          "type": [
            "string",
            "null"
          ],
          "pattern": "^[0-9a-f]{64}$"
        },
        "breite": {
          "type": [
            "integer",
            "null"
          ],
          "minimum": 16
        },
        "hoehe": {
          "type": [
            "integer",
            "null"
          ],
          "minimum": 16
        },
        "freigabe": {
          "$ref": "#/$defs/freigabe"
        },
        "format": {
          "enum": [
            "original",
            "edit",
            null
          ],
          "type": [
            "string",
            "null"
          ],
          "description": "Seitenverhältnis des Zielbilds: wie Original oder wie aufgefüllte Fassung (Ingest entfernt den Rand)"
        }
      }
    },
    "baubarkeit": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "echtzeit_threejs",
        "ein_licht_rig",
        "keine_glanzpunkte",
        "kein_neuer_text",
        "figuren_unveraendert",
        "komposition_gleich",
        "seitenverhaeltnis_gleich",
        "hud_aus_kit",
        "neue_assets",
        "hinweis"
      ],
      "properties": {
        "echtzeit_threejs": {
          "type": "boolean"
        },
        "ein_licht_rig": {
          "type": "boolean"
        },
        "keine_glanzpunkte": {
          "type": "boolean"
        },
        "kein_neuer_text": {
          "type": "boolean"
        },
        "figuren_unveraendert": {
          "type": "boolean"
        },
        "komposition_gleich": {
          "type": "boolean"
        },
        "seitenverhaeltnis_gleich": {
          "type": "boolean"
        },
        "hud_aus_kit": {
          "type": [
            "boolean",
            "null"
          ],
          "description": "null = kein HUD im Bild betroffen"
        },
        "neue_assets": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Teile, die es im Spiel noch nicht gibt (→ Fehlt-im-Kit / Beschaffung)"
        },
        "hinweis": {
          "type": "string"
        }
      }
    },
    "befund": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "finding_id",
        "scene_id",
        "status",
        "aenderung",
        "bleibt",
        "warum",
        "referenzen",
        "aeste",
        "baubarkeit",
        "ziele"
      ],
      "properties": {
        "finding_id": {
          "type": "string",
          "pattern": "^F[0-9]{2}$"
        },
        "scene_id": {
          "type": "string",
          "pattern": "^S[0-9]{2}_[a-z0-9_]+$"
        },
        "status": {
          "enum": [
            "bearbeitet",
            "nicht_malbar",
            "uebersprungen"
          ]
        },
        "grund": {
          "type": [
            "string",
            "null"
          ]
        },
        "aenderung": {
          "type": "string",
          "description": "Zeile 1: was geändert ist"
        },
        "bleibt": {
          "type": "string",
          "description": "Zeile 2: was gleich bleibt"
        },
        "warum": {
          "type": "string",
          "description": "Zeile 3: welches Problem gelöst wird (Befund-Bezug)"
        },
        "referenzen": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "ids aus package.json referenzen[]"
        },
        "aeste": {
          "type": "array",
          "items": {
            "type": "integer",
            "minimum": 1,
            "maximum": 11
          }
        },
        "baubarkeit": {
          "$ref": "#/$defs/baubarkeit"
        },
        "ziele": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/ziel"
          }
        }
      }
    }
  }
}
'''


def main():
    a = sys.argv[1:]
    if not a:
        sys.exit(__doc__)
    w = Arbeit(a)
    {'start': start, 'ziel': ziel, 'texte': texte, 'freigabe': freigabe, 'uebersicht': uebersicht,
     'status': lambda a, w: print('\n'.join(offen(w.load())) or 'alles bereit für abschluss', zustand(w.load()), sep='\n'),
     'abschluss': abschluss, 'verwerfen': verwerfen}.get(a[0], lambda *_: sys.exit(__doc__))(a, w)


if __name__ == '__main__':
    main()
