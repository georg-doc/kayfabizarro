"""Compose the K1 and K2 boards from the Blender renders (fixed scale per row, transparent renders on a neutral board)."""
import json, sys
from PIL import Image, ImageDraw, ImageFont

SRC = sys.argv[1]            # .../ISLAND_FORM_KIT_01_2026-10-11
OUT = sys.argv[2]
BG = (59, 63, 69); FG = (236, 232, 224); DIM = (170, 170, 165); ACC = (255, 196, 92)
F = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; FB = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
font = lambda s, b=False: ImageFont.truetype(FB if b else F, s)


def union_bbox(ims):
    bb = [im.getchannel('A').getbbox() for im in ims]
    return (min(b[0] for b in bb), min(b[1] for b in bb), max(b[2] for b in bb), max(b[3] for b in bb))


def text(d, xy, s, size, col=FG, bold=False, anchor='la'):
    d.text(xy, s, fill=col, font=font(size, bold), anchor=anchor)


def k1(scale=0.62):
    fams = [('base', 'A · Anatomy baseline', 'Scholle v7 as is: taper, spikes as pulled corners'),
            ('blast', 'B · Blasted clod', 'strata, flat fracture faces, 2 pipes, cellar breach, tunnel bore'),
            ('roots', 'C · Root ball', 'strata + 5 thick and 9 thin roots out of the topsoil')]
    views = [('SIDE', 'Side view, 12° (same camera for A, B, C)'), ('UNDER', 'Underside 3/4 (from below, 22°)'), ('TOP', 'Top')]
    met = json.load(open(f'{SRC}/data/K1_metrics.json'))['metrics']
    rows = []
    for v, _ in views:
        ims = [Image.open(f'{SRC}/renders/K1/K1_{f}_{v}.png').convert('RGBA') for f, _, _ in fams]
        bb = union_bbox(ims); pad = 12
        bb = (max(0, bb[0] - pad), max(0, bb[1] - pad), bb[2] + pad, bb[3] + pad)
        s = scale if v != 'TOP' else scale * 1.0
        rows.append([im.crop(bb).resize((int((bb[2] - bb[0]) * s), int((bb[3] - bb[1]) * s)), Image.LANCZOS) for im in ims])
    colw = max(max(r[i].width for r in rows) for i in range(3)) + 40
    left = 210; top = 230
    H = top + sum(max(im.height for im in r) + 50 for r in rows) + 330
    W = left + colw * 3 + 30
    board = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(board)
    text(d, (30, 28), 'KFB Island Form Kit 01 · K1 underside families · R1', 40, bold=True)
    text(d, (30, 84), 'One closed mesh per island (top, rim and body grown from one mesh, nothing attached). Template: Scholle v7 port, preset C "Garten".', 21, DIM)
    text(d, (30, 114), 'K2 units: island 20 MC = 128 wide (H = 3.64, MC = 6.4). Red pole = 1 H, blue box = car (length 6). Colours: v7 preset, not the island theme.', 21, DIM)
    text(d, (30, 144), 'Counter-reference V-106: an underside that looks "stuck on instead of a clod" is wrong. Risk check for C: Scholle v6 "Würste" (FAIL 03.10.).', 21, ACC)
    for i, (_, t, sub) in enumerate(fams):
        x = left + i * colw
        text(d, (x, 186), t, 28, bold=True); text(d, (x, 220), sub, 17, DIM)
    y = top + 40
    for (v, vt), r in zip(views, rows):
        rh = max(im.height for im in r)
        text(d, (30, y + rh // 2), vt.split(' (')[0], 22, bold=True, anchor='lm')
        if '(' in vt:
            text(d, (30, y + rh // 2 + 28), '(' + vt.split(' (')[1], 15, DIM, anchor='lm')
        for i, im in enumerate(r):
            x = left + i * colw + (colw - 40 - im.width) // 2
            board.paste(im, (x, y + (rh - im.height) // 2), im)
        y += rh + 50
    # metrics
    text(d, (30, y), 'Measured', 22, bold=True)
    an = 'Anatomy rule (StreakByte, 0.43–0.52 W deep, plate 2–4 % W): '
    for i, (f, _, _) in enumerate(fams):
        m = met[f]; x = left + i * colw
        lines = [f"depth below plate  {m['depth_W']} W   plate {m['plate_W']} W",
                 f"width at 50 % depth  {m['taper'][5]} R  (rule 0.59)",
                 f"spikes  {m['spikes']}   deepest point  {m['deepest_off_R']} R off centre",
                 f"triangles  {m['tris']}   non-manifold edges  {m['non_manifold_edges']}",
                 f"facets before clay smoothing  {m['facets_before_clay']}"]
        for k, ln in enumerate(lines):
            text(d, (x, y + 4 + k * 28), ln, 18, FG if k else ACC)
    y += 170
    notes = ['Depth and plate are inside the anatomy ranges for A and B. At half depth the body is fuller than the rule (0.67–0.69 R vs 0.59 R): a rounder belly. C reads wider only because roots count as body.',
             'The deepest point sits close to the centre (0.05–0.06 R); the rule measured 0.07–0.56 R on the StreakByte islands. Spikes per v7 preset (3) are at the low end.',
             'Not done here: Knete material v10, island terrain on the top, island theme colours. These are references for Georg and the Lab generator, not a runtime.']
    for k, ln in enumerate(notes):
        text(d, (30, y + k * 28), ln, 17, DIM)
    board.save(OUT + '/K1_UNDERSIDE_BOARD.png', optimize=True)
    return board.size


def k2(s_side=0.62, s_top=0.62):
    shapes = [('round', 'Round', 'v7 lobed outline'), ('long', 'Long', 'ellipse 1.9 : 1'), ('bean', 'Bean', 'one bay'),
              ('twin', 'Twin', 'two lobes, waist'), ('terrace', 'Stepped plateau', 'inner plateau, +1 MC step'), ('shard', 'Shard', '7 straight edges, deeper')]
    sizes = [('S', 12), ('M', 20), ('L', 40)]
    rows = []
    for sid, _, _ in shapes:
        sides = [Image.open(f'{SRC}/renders/K2/K2_{sid}_{z}_SIDE.png').convert('RGBA') for z, _ in sizes]
        tops = [Image.open(f'{SRC}/renders/K2/K2_{sid}_{z}_TOP.png').convert('RGBA') for z, _ in sizes]
        bb = union_bbox(sides); y0, y1 = bb[1] - 6, bb[3] + 6
        cells = []
        for si, ti in zip(sides, tops):
            b = si.getchannel('A').getbbox(); sc = si.crop((b[0] - 6, y0, b[2] + 6, y1))
            sc = sc.resize((int(sc.width * s_side), int(sc.height * s_side)), Image.LANCZOS)
            tb = ti.getchannel('A').getbbox(); tc = ti.crop((tb[0] - 4, tb[1] - 4, tb[2] + 4, tb[3] + 4))
            tc = tc.resize((max(1, int(tc.width * s_top)), max(1, int(tc.height * s_top))), Image.LANCZOS)
            cells.append((sc, tc))
        rows.append(cells)
    colw = [max(r[i][0].width + r[i][1].width + 30 for r in rows) + 30 for i in range(3)]
    left = 270; top = 210
    rowh = [max(max(c[0].height, c[1].height) for c in r) + 40 for r in rows]
    W = left + sum(colw) + 30; H = top + sum(rowh) + 200
    board = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(board)
    text(d, (30, 28), 'KFB Island Form Kit 01 · K2 silhouette line-up · R1', 40, bold=True)
    text(d, (30, 84), 'Six plan outlines × three size classes at ONE fixed scale: side view 12° at full scale, top view at half scale (front = bottom edge).', 21, DIM)
    text(d, (30, 114), 'Body = Scholle v7 (preset C). Sizes are equal-area diameters: S 12 MC (77), M 20 MC (128, test island), L 40 MC (256, Town). Pole and car are on each island but too small to see at this scale.', 21, DIM)
    x = left
    for i, (z, mc) in enumerate(sizes):
        text(d, (x, 168), f'{z} · {mc} MC', 28, bold=True); x += colw[i]
    y = top
    for (sid, nm, sub), r, rh in zip(shapes, rows, rowh):
        text(d, (30, y + rh // 2 - 14), nm, 24, bold=True, anchor='lm'); text(d, (30, y + rh // 2 + 16), sub, 16, DIM, anchor='lm')
        x = left
        for i, (sc, tc) in enumerate(r):
            board.paste(tc, (x, y + (rh - 40 - tc.height) // 2), tc)
            board.paste(sc, (x + tc.width + 20, y + (rh - 40 - sc.height) // 2), sc)
            x += colw[i]
        d.line((30, y + rh - 18, W - 30, y + rh - 18), fill=(80, 85, 92), width=1)
        y += rh
    # scale bar: side render is 1260 px for 420 units = 3 px/unit, times s_side
    ppu = 3 * s_side; bar = int(10 * 6.4 * ppu)
    d.rectangle((left, y + 20, left + bar, y + 32), fill=FG); text(d, (left + bar + 14, y + 26), '10 MC = 64 (side view)', 18, FG, anchor='lm')
    notes = ['Open for Georg: should depth grow with width? Here it does (depth ≈ 0.47 W, from the anatomy rule), so an L island is about 33 H deep.',
             'Long, bean and twin measure shallower per W because W is their longest extent. Same seed per row, so S, M and L are the same shape at three sizes.']
    for k, ln in enumerate(notes):
        text(d, (30, y + 70 + k * 28), ln, 17, ACC if k == 0 else DIM)
    board.save(OUT + '/K2_SILHOUETTE_BOARD.png', optimize=True)
    return board.size


if __name__ == '__main__':
    print(k1(), k2())
