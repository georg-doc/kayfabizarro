#!/usr/bin/env python3
"""Bildtreue-Prüfung Zielbild ↔ Original-Still (deterministisch, ohne KI; braucht nur Pillow, eigenständig ohne ad_common,
damit sie im Paket mitreisen und auch in Codex laufen kann).

  python3 ad_bildtreue.py <ziel> <original> [--bereich x,y,w,h] [--rand-geo '{json}'] [--heatmap <pfad unter _privat>]
                          [--json <ausgabe.json>] [--ohne-ocr]
  python3 ad_bildtreue.py <ziel> --paket <package.json> --befund F04 [--rolle aufprall] [...]
          (Original, Bereich und Rand der aufgefüllten __edit.png kommen aus dem Paket)

Prüft
  1. Format: gleiche Größe, sauber skaliert (Seitenverhältnis ≤ 1 %) oder die aufgefüllte Fassung (Rand wird proportional
     entfernt; übermalter Rand = HINWEIS). Anderes Format = FAIL.
  2. Pixel außerhalb des Befund-Bereichs (Maske, um RAND_MASKE erweitert): mittlere Abweichung und je Kachel (16×9) auf einer
     auf ANALYSE_BREITE verkleinerten Fassung. Kennzahlen + optional Heatmap-PNG (nur unter einem _privat-Ordner).
  3. Text außerhalb des Bereichs per OCR, nur wenn `tesseract` installiert ist (sonst „OCR übersprungen“); Abweichung = HINWEIS.
Ausgabe JSON (stdout bzw. --json). Exit 0 PASS · 1 HINWEIS (Blick) · 3 FAIL · 2 Aufruf-/Lesefehler.
"""
import io, json, os, re, shutil, subprocess, sys, tempfile
sys.dont_write_bytecode = True

ANALYSE_BREITE = 320
RAND_MASKE = 0.03                      # Bereich je Seite um 3 % der Bildmaße erweitern (Übergänge zählen nicht)
GRID = (16, 9)
SCHWELLEN = {'mittel_hinweis': 12, 'mittel_fail': 25,      # wie AUSSEN_HINWEIS/AUSSEN_KLAEREN in ad_ingest R1 (0–255)
             'kachel_hinweis': 30, 'kachel_fail': 45,      # eine Kachel stark verändert = erfundenes Menü, fremde Figur …
             'kachel_min_aussen': 0.5}
RATIO_TOL = 0.01


def _pil():
    try:
        from PIL import Image, ImageChops, ImageDraw
        return Image, ImageChops, ImageDraw
    except ImportError:
        return None


def _open(x):
    Image = _pil()[0]
    return Image.open(io.BytesIO(x) if isinstance(x, (bytes, bytearray)) else x).convert('RGB')


def ratio_ok(a, b, tol=RATIO_TOL):
    return abs(a[0] / a[1] - b[0] / b[1]) / (b[0] / b[1]) <= tol


def _band_grau(im, box):
    W, H = im.size
    px = []
    for t in [(0, 0, W, box[1]), (0, box[3], W, H), (0, 0, box[0], H), (box[2], 0, W, H)]:
        if t[2] - t[0] > 2 and t[3] - t[1] > 2:
            px += list(im.crop((t[0] + 1, t[1] + 1, t[2] - 1, t[3] - 1)).convert('L').resize((32, 4)).getdata())
    if not px:
        return True
    m = sum(px) / len(px)
    return abs(m - 128) < 20 and max(abs(x - m) for x in px) < 40


def format_pruefen(ziel, orig_wh, geo=None):
    """→ (bild_auf_originalgroesse | None, wie, hinweise). wie: gleich | skaliert | rand_entfernt | None."""
    Image = _pil()[0]
    wh, hin = ziel.size, []
    if tuple(wh) == tuple(orig_wh):
        return ziel, 'gleich', hin
    if ratio_ok(wh, orig_wh):
        return ziel.resize(tuple(orig_wh), Image.LANCZOS), 'skaliert', hin
    if geo and ratio_ok(wh, (geo['breite'], geo['hoehe'])):
        sx, sy = wh[0] / geo['breite'], wh[1] / geo['hoehe']
        box = (round(geo['links'] * sx), round(geo['oben'] * sy), wh[0] - round(geo['rechts'] * sx), wh[1] - round(geo['unten'] * sy))
        if not _band_grau(ziel, box):
            hin.append('grauer Rand übermalt oder Ausschnitt verschoben')
        return ziel.crop(box).resize(tuple(orig_wh), Image.LANCZOS), 'rand_entfernt', hin
    return None, None, hin


def _box(bereich, W, H, rand=0.0):
    x0 = max(0.0, bereich['x'] - rand); y0 = max(0.0, bereich['y'] - rand)
    x1 = min(1.0, bereich['x'] + bereich['w'] + rand); y1 = min(1.0, bereich['y'] + bereich['h'] + rand)
    return int(x0 * W), int(y0 * H), int(round(x1 * W)), int(round(y1 * H))


def _privat(p):
    return any(part.startswith('_privat') for part in os.path.abspath(p).split(os.sep))


def ocr_woerter(im, box_px):
    """Wörter (≥ 3 Zeichen, Konfidenz ≥ 60) außerhalb box_px; None, wenn tesseract fehlt."""
    exe = shutil.which('tesseract')
    if not exe:
        return None
    d = tempfile.mkdtemp(prefix='kfbocr')
    try:
        p = os.path.join(d, 'x.png'); im.save(p)
        r = subprocess.run([exe, p, 'stdout', '--psm', '11', 'tsv'], capture_output=True, text=True, timeout=120)
        if r.returncode:
            return None
        out = []
        for ln in r.stdout.splitlines()[1:]:
            f = ln.split('\t')
            if len(f) < 12:
                continue
            try:
                conf = float(f[10]); l, t, w, h = int(f[6]), int(f[7]), int(f[8]), int(f[9])
            except ValueError:
                continue
            wort = re.sub(r'[^\wäöüß]', '', f[11].lower())
            cx, cy = l + w / 2, t + h / 2
            innen = box_px and box_px[0] <= cx <= box_px[2] and box_px[1] <= cy <= box_px[3]
            if conf >= 60 and len(wort) >= 3 and not innen:
                out.append(wort)
        return out
    except (OSError, subprocess.SubprocessError):
        return None
    finally:
        shutil.rmtree(d, ignore_errors=True)


def pruefe(ziel, original, bereich=None, geo=None, heatmap=None, ocr=True):
    """ziel/original: Pfad oder Bytes. bereich: {x,y,w,h} (Anteile am Original). geo: Rand der aufgefüllten Fassung.
    Gibt das Ergebnis-Dict zurück (status PASS | HINWEIS | FAIL)."""
    libs = _pil()
    if not libs:
        raise RuntimeError('Pillow fehlt (pip install pillow)')
    Image, ImageChops, ImageDraw = libs
    o = _open(original); z0 = _open(ziel)
    res = {'schema': 'kfb.ad-bildtreue.v1', 'status': 'PASS', 'gruende': [], 'hinweise': [],
           'format': {'ziel': list(z0.size), 'original': list(o.size), 'wie': None},
           'maske': {'bereich': bereich, 'rand': RAND_MASKE}, 'aussen': None, 'schwellen': SCHWELLEN,
           'ocr': {'status': 'aus'}, 'heatmap': None}
    z, wie, hin = format_pruefen(z0, o.size, geo)
    res['format']['wie'] = wie; res['hinweise'] += hin
    if z is None:
        res['status'] = 'FAIL'
        res['gruende'].append(f'Format {z0.size[0]}×{z0.size[1]} passt weder zum Original {o.size[0]}×{o.size[1]} noch zur aufgefüllten Fassung')
        return res
    if not bereich:
        res['hinweise'].append('kein Bereich: Abweichung außerhalb nicht prüfbar (Befund ohne bereich)')
        res['status'] = 'HINWEIS'
        return res
    W, H = o.size
    w = min(ANALYSE_BREITE, W); h = max(1, round(H * w / W))
    zs, os_ = z.resize((w, h), Image.BILINEAR), o.resize((w, h), Image.BILINEAR)
    dif = ImageChops.difference(zs, os_).convert('L')          # Luminanz der RGB-Differenz
    bx = _box(bereich, w, h, RAND_MASKE)
    mask = Image.new('L', (w, h), 0); mask.paste(255, bx)
    dv, mv = list(dif.getdata()), list(mask.getdata())
    aussen = [d for d, m in zip(dv, mv) if m == 0]
    mittel = round(sum(aussen) / len(aussen), 2) if aussen else 0.0
    kacheln, kmax, kort = [], 0.0, None
    gx, gy = GRID
    for j in range(gy):
        for i in range(gx):
            x0, x1 = i * w // gx, (i + 1) * w // gx; y0, y1 = j * h // gy, (j + 1) * h // gy
            vals = [dv[y * w + x] for y in range(y0, y1) for x in range(x0, x1) if mv[y * w + x] == 0]
            n = (x1 - x0) * (y1 - y0)
            if n and len(vals) / n >= SCHWELLEN['kachel_min_aussen']:
                v = sum(vals) / len(vals); kacheln.append(v)
                if v > kmax:
                    kmax, kort = v, [i, j]
    stark = sum(1 for v in kacheln if v >= SCHWELLEN['kachel_fail'])
    res['aussen'] = {'mittel': mittel, 'max_kachel': round(kmax, 1), 'max_kachel_ort': kort,
                     'kacheln_stark': stark, 'kacheln_geprueft': len(kacheln), 'anteil_aussen': round(len(aussen) / len(dv), 3),
                     'analyse': [w, h]}
    if mittel >= SCHWELLEN['mittel_fail']:
        res['gruende'].append(f'Bild verändert außerhalb des Bereichs: mittlere Abweichung {mittel}/255 ≥ {SCHWELLEN["mittel_fail"]}')
    elif mittel >= SCHWELLEN['mittel_hinweis']:
        res['hinweise'].append(f'mittlere Abweichung außerhalb {mittel}/255 (ab {SCHWELLEN["mittel_hinweis"]} Blick)')
    if kmax >= SCHWELLEN['kachel_fail']:
        res['gruende'].append(f'Bild verändert außerhalb des Bereichs: {stark} Kachel(n) stark verändert, max {round(kmax, 1)}/255 '
                              f'bei Spalte {kort[0] + 1}/{gx}, Zeile {kort[1] + 1}/{gy} (neues Element?)')
    elif kmax >= SCHWELLEN['kachel_hinweis']:
        res['hinweise'].append(f'eine Kachel außerhalb {round(kmax, 1)}/255 bei Spalte {kort[0] + 1}, Zeile {kort[1] + 1} (Blick)')
    if heatmap:
        if not _privat(heatmap):
            raise ValueError(f'Heatmap {heatmap}: nur unter einem _privat-Ordner (Spiel-Screenshots)')
        os.makedirs(os.path.dirname(os.path.abspath(heatmap)), exist_ok=True)
        base = os_.convert('L').point(lambda v: v // 3).convert('RGB')
        rot = Image.merge('RGB', (dif.point(lambda v: min(255, v * 4)), Image.new('L', (w, h), 0), Image.new('L', (w, h), 0)))
        hm = ImageChops.add(base, rot); ImageDraw.Draw(hm).rectangle([bx[0], bx[1], bx[2] - 1, bx[3] - 1], outline=(0, 200, 0))
        hm.save(heatmap); res['heatmap'] = heatmap
    if ocr:
        bp = _box(bereich, W, H, RAND_MASKE)
        a, b = ocr_woerter(o, bp), None
        if a is None:
            res['ocr'] = {'status': 'übersprungen', 'grund': 'tesseract nicht installiert oder nicht lesbar'}
        else:
            b = ocr_woerter(z, bp) or []
            neu = sorted(set(b) - set(a)); weg = sorted(set(a) - set(b))
            res['ocr'] = {'status': 'geprüft', 'neu': neu, 'weg': weg}
            if neu or weg:
                res['hinweise'].append(f'Text außerhalb des Bereichs anders (OCR): neu {neu[:8]}, weg {weg[:8]}')
    res['status'] = 'FAIL' if res['gruende'] else ('HINWEIS' if res['hinweise'] else 'PASS')
    return res


def aus_paket(pp, fid, rolle=None):
    """Original-Still, Bereich und Rand-Geometrie eines Befunds aus package.json (Pfade relativ zum Paket bzw. Upload-Ordner)."""
    pkg = json.load(open(pp, encoding='utf-8')); pdir = os.path.dirname(os.path.abspath(pp))
    for s in pkg['szenen']:
        for b in s['befunde']:
            if b['id'] != fid:
                continue
            belegt = {x['pfad'] for x in b['beleg']}
            sts = [st for st in s['stills'] if (rolle and st['rolle'] == rolle) or (not rolle and st['pfad'] in belegt)]
            if not sts:
                raise ValueError(f'{fid}: kein Still mit Rolle {rolle}')
            st = sts[0]
            kand = [os.path.join(pdir, st['pfad']), os.path.join(pdir, os.path.basename(st['pfad'])),
                    os.path.join(pdir, '..', '..', st['pfad'])]
            orig = next((k for k in kand if os.path.exists(k)), None)
            if not orig:
                raise ValueError(f'Original {st["pfad"]} nicht gefunden (neben package.json oder im Paket)')
            return orig, b.get('bereich'), st.get('edit')
    raise ValueError(f'Befund {fid} nicht im Paket')


def main():
    a = sys.argv[1:]
    def arg(k):
        return a[a.index(k) + 1] if k in a and a.index(k) + 1 < len(a) else None
    pos = [x for i, x in enumerate(a) if not x.startswith('--') and (i == 0 or not a[i - 1].startswith('--') or a[i - 1] == '--ohne-ocr')]
    if not pos:
        print(__doc__); sys.exit(2)
    try:
        if arg('--paket'):
            orig, bereich, geo = aus_paket(arg('--paket'), arg('--befund'), arg('--rolle'))
        else:
            if len(pos) < 2:
                print(__doc__); sys.exit(2)
            orig = pos[1]
            bereich = dict(zip('xywh', map(float, arg('--bereich').split(',')))) if arg('--bereich') else None
            geo = json.loads(arg('--rand-geo')) if arg('--rand-geo') else None
        res = pruefe(pos[0], orig, bereich, geo, arg('--heatmap'), '--ohne-ocr' not in a)
    except (OSError, ValueError, RuntimeError, KeyError) as e:
        print(json.dumps({'status': 'FEHLER', 'grund': str(e)}, ensure_ascii=False)); sys.exit(2)
    txt = json.dumps(res, ensure_ascii=False, indent=1)
    if arg('--json'):
        with open(arg('--json'), 'w', encoding='utf-8') as f:
            f.write(txt + '\n')
    print(txt)
    sys.exit({'PASS': 0, 'HINWEIS': 1, 'FAIL': 3}[res['status']])


if __name__ == '__main__':
    main()
