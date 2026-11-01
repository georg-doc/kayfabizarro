#!/usr/bin/env python3
"""Deck-Paket: Bilder backen (ohne Modell). Druck-PDF wird nur gelesen.

python3 bake_deck.py <packId> --pdf <druck.pdf> --out <paketordner> --work <scratch> [--split 0.5,0.54] [--page-split 10=0.5,0.51 ...]

Erzeugt <out>/bilder/cover.webp, karte/NN.webp (Viertelseite, rund 1366 px, nichts beschnitten),
motiv/NN.webp (rund 700 px, Rechteck aus Apple Vision) und <work>/bake.json (Seite, Viertel, Rechtecke, Motiv-Vorschlag, Größen, Prüfsumme).
Kartenzuordnung wie Registry: Seite = coverOffset + 1 + floor((n-1)/4), Viertel = (n-1) % 4 (TL, TR, BL, BR).
Die Karte kommt aus dem Viertel; `--split` setzt die Schnittlinie, wo ein Titelband die Reihen verschiebt.
"""
import argparse, hashlib, json, os, subprocess, sys, time, unicodedata
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
W_KARTE, W_MOTIV, Q_WEBP = 1366, 700, 82


def motiv_vorschlag(v):
    """Motiv-Rechteck aus Apple Vision (vision_boxes.swift): größte freigestellte Figur, sonst auffälligstes Objekt.
    Mit Rand, möglichst nah am Quadrat (für Kugeln), ohne Textzeilen anzuschneiden, wo das geht.
    Rückgabe: [x, y, w, h] in Anteilen der Karte, Quelle, Güte 0..1."""
    AR = 1366 / 762
    fg = sorted(v.get('fg', []), key=lambda f: -f['area'])
    fg = [f for f in fg if f['area'] > .02 and f['h'] > .15]
    sal = sorted(v.get('salient', []), key=lambda f: -f['w'] * f['h'])
    if fg:
        b, src = fg[0], 'vordergrund'
    elif sal:
        b, src = sal[0], 'auffaellig'
    else:
        return [.2, .15, .6, .7], 'mitte', 0.0
    x0, y0, x1, y1 = b['x'], b['y'], b['x'] + b['w'], b['y'] + b['h']
    pad = .06
    x0 -= pad * (x1 - x0); x1 += pad * (x1 - x0); y0 -= pad * (y1 - y0); y1 += pad * (y1 - y0)
    # Textzeilen abziehen: Zeilen, die das Rechteck unten oder oben nur anschneiden, schieben die Kante
    texts = [t for t in v.get('text', []) if t['w'] > .08]
    for t in texts:
        tx0, ty0, tx1, ty1 = t['x'], t['y'], t['x'] + t['w'], t['y'] + t['h']
        if min(x1, tx1) - max(x0, tx0) < .3 * (tx1 - tx0):
            continue
        if ty0 > (y0 + y1) / 2 and ty0 < y1:
            y1 = ty0 - .005
        elif ty1 < (y0 + y1) / 2 and ty1 > y0:
            y0 = ty1 + .005
    # zum Quadrat hin aufweiten (in Pixeln), innerhalb der Karte
    w_px, h_px = (x1 - x0) * AR, (y1 - y0)
    if w_px < h_px * .85:
        grow = (h_px * .85 - w_px) / AR / 2; x0 -= grow; x1 += grow
    elif h_px < w_px / 1.5:
        grow = (w_px / 1.5 - h_px) / 2; y0 -= grow; y1 += grow
    x0, y0, x1, y1 = max(0, x0), max(0, y0), min(1, x1), min(1, y1)
    hit = 0.0
    for t in texts:
        ox = max(0, min(x1, t['x'] + t['w']) - max(x0, t['x'])); oy = max(0, min(y1, t['y'] + t['h']) - max(y0, t['y']))
        hit += ox * oy
    area = (x1 - x0) * (y1 - y0)
    guete = max(0.0, 1 - hit / max(area, 1e-6) * 4) * (1.0 if src == 'vordergrund' else .6)
    return [round(x0, 4), round(y0, 4), round(x1 - x0, 4), round(y1 - y0, 4)], src, round(guete, 3)


def sha256(p):
    h = hashlib.sha256()
    with open(p, 'rb') as f:
        for b in iter(lambda: f.read(1 << 20), b''):
            h.update(b)
    return h.hexdigest()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('pack'); ap.add_argument('--pdf', required=True); ap.add_argument('--out', required=True)
    ap.add_argument('--work', required=True); ap.add_argument('--cards', type=int, required=True)
    ap.add_argument('--cover-offset', type=int, default=1); ap.add_argument('--split', default='0.5,0.5')
    ap.add_argument('--page-split', action='append', default=[])
    ap.add_argument('--vision-json', help='vorhandenes vision.json nutzen statt Apple Vision neu zu rufen (Neural Engine belegt)')
    A = ap.parse_args()
    t0 = time.time()
    os.makedirs(A.work, exist_ok=True)
    for d in ('karte', 'motiv'):
        os.makedirs(os.path.join(A.out, 'bilder', d), exist_ok=True)
    default = tuple(map(float, A.split.split(',')))
    pages = {int(p.split('=')[0]): tuple(map(float, p.split('=')[1].split(','))) for p in A.page_split}
    jobs = [{'page': 1, 'rect': [0, 0, 1, 1], 'out': os.path.join(A.work, 'cover.png'), 'width': W_KARTE}]
    rows = []
    for n in range(1, A.cards + 1):
        page = A.cover_offset + 1 + (n - 1) // 4
        q = (n - 1) % 4
        sp = pages.get(page, default)
        col, row = q % 2, q // 2
        if len(sp) == 4:  # xOben, xUnten, yLinks, yRechts
            sx, sy = sp[row], sp[2 + col]
        else:
            sx, sy = sp[0], sp[1 + col] if len(sp) == 3 else sp[1]
        x0, x1 = (0, sx) if col == 0 else (sx, 1)
        y0, y1 = (0, sy) if row == 0 else (sy, 1)
        rect = [x0, y0, round(x1 - x0, 5), round(y1 - y0, 5)]
        jobs.append({'page': page, 'rect': rect, 'out': os.path.join(A.work, f'k{n:02d}.png'), 'width': W_KARTE})
        rows.append({'n': n, 'page': page, 'quad': ['TL', 'TR', 'BL', 'BR'][q], 'rect': rect})
    jf = os.path.join(A.work, 'jobs.json')
    json.dump(jobs, open(jf, 'w'))
    subprocess.run(['swift', os.path.join(HERE, 'render_pdf.swift'), A.pdf, jf], check=True, capture_output=True)
    Image.open(os.path.join(A.work, 'cover.png')).convert('RGB').save(os.path.join(A.out, 'bilder', 'cover.webp'), quality=Q_WEBP, method=6)
    pngs = [os.path.join(A.work, f"k{r['n']:02d}.png") for r in rows]
    vj = os.path.join(A.work, 'vision.json')
    if A.vision_json:
        vj = A.vision_json
    else:
        subprocess.run(['swift', os.path.join(HERE, 'vision_boxes.swift'), vj] + pngs, check=True, capture_output=True)
    vision = json.load(open(vj))
    total = 0
    for r in rows:
        png = os.path.join(A.work, f"k{r['n']:02d}.png")
        im = Image.open(png).convert('RGB')
        kp = os.path.join(A.out, 'bilder', 'karte', f"{r['n']:02d}.webp")
        im.save(kp, quality=Q_WEBP, method=6)
        v = vision.get(f"k{r['n']:02d}.png", {})
        box, src, g = motiv_vorschlag(v)
        r['ocr'] = [t['s'] for t in v.get('text', [])]
        W, H = im.size
        cr = im.crop((int(box[0] * W), int(box[1] * H), int((box[0] + box[2]) * W), int((box[1] + box[3]) * H)))
        k = W_MOTIV / max(cr.size)
        if k < 1:
            cr = cr.resize((round(cr.size[0] * k), round(cr.size[1] * k)), Image.LANCZOS)
        mp = os.path.join(A.out, 'bilder', 'motiv', f"{r['n']:02d}.webp")
        cr.save(mp, quality=Q_WEBP, method=6)
        r.update(karteSize=list(im.size), motivRect=box, motivQuelle=src, motivGuete=g, karteKB=os.path.getsize(kp) // 1024, motivKB=os.path.getsize(mp) // 1024)
        total += os.path.getsize(kp) + os.path.getsize(mp)
    total += os.path.getsize(os.path.join(A.out, 'bilder', 'cover.webp'))
    res = {'packId': A.pack, 'pdfFile': unicodedata.normalize('NFC', os.path.basename(A.pdf)), 'pdfSha256': sha256(A.pdf), 'pdfBytes': os.path.getsize(A.pdf),
           'bakeSeconds': round(time.time() - t0, 1), 'bilderBytes': total, 'cards': rows}
    json.dump(res, open(os.path.join(A.work, 'bake.json'), 'w'), indent=1, ensure_ascii=False)
    print(f"{A.pack}: {len(rows)} Karten, {total / 1e6:.1f} MB, {res['bakeSeconds']} s")


if __name__ == '__main__':
    main()
