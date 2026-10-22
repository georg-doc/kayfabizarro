# RKIT R3 · Bauweise-Blatt: construction sketches generated from the actual rules (paving plan with cut stones, kerb
# transition stones, halftone strip). Units: K2 lab units; the drawing scale is given per sketch.
import math
def clip_halfplane(poly, keep):  # Sutherland-Hodgman against keep(p) <= 0 (linear)
    out = []
    for i in range(len(poly)):
        a, b = poly[i - 1], poly[i]; fa, fb = keep(a), keep(b)
        if fa <= 0: out.append(a)
        if (fa <= 0) != (fb <= 0):
            t = fa / (fa - fb); out.append((a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t))
    if fa <= 0 and False: pass
    return out
def pts(P, S, ox, oy, flip=True): return ' '.join(f'{ox + x * S:.1f},{oy - y * S if flip else oy + y * S:.1f}' for x, y in P)

def edging(g, P, S, ox, oy, out=(0, 1), seed=1, flip=True):
    """built edge as rounded clay edging stones (0.8 long) along polyline P (units), rubble and pebbles on the outer side,
    denser at the edge. No stroke line, no hard cut."""
    acc = 0.0
    for i in range(len(P) - 1):
        (x0, y0), (x1, y1) = P[i], P[i + 1]; L = math.hypot(x1 - x0, y1 - y0); n = max(1, round(L / 0.84))
        ang = math.degrees(math.atan2(-(y1 - y0) if flip else (y1 - y0), x1 - x0))
        for k in range(n):
            t = (k + 0.5) / n; cx, cy = x0 + (x1 - x0) * t, y0 + (y1 - y0) * t; X, Y = ox + cx * S, (oy - cy * S) if flip else (oy + cy * S)
            g.append(f'<rect x="{X - 0.4 * S:.1f}" y="{Y - 0.14 * S:.1f}" width="{0.78 * S:.1f}" height="{0.28 * S:.1f}" rx="{0.12 * S:.1f}" transform="rotate({ang:.1f} {X:.1f} {Y:.1f})" fill="var(--kerb)" stroke="var(--fg)" stroke-width=".6"/>')
            nx, ny = -(y1 - y0) / L * out[1] + 0, (x1 - x0) / L * out[1]
            for q in range(3):
                h1, h2, h3 = _h(seed * 101 + i * 31 + k * 7 + q), _h(seed * 103 + i * 37 + k * 11 + q), _h(seed * 107 + i * 41 + k * 13 + q)
                d = 0.25 + 1.1 * h1 ** 1.8; r = (0.07 + 0.11 * h2) * (1.2 - d / 1.6)
                if r < 0.04: continue
                px, py = cx + nx * d + (h3 - .5) * 0.6, cy + ny * d
                X2, Y2 = ox + px * S, (oy - py * S) if flip else (oy + py * S)
                g.append(f'<ellipse cx="{X2:.1f}" cy="{Y2:.1f}" rx="{r * 1.25 * S:.1f}" ry="{r * S:.1f}" fill="{["var(--kerb)", "var(--tile)", "var(--tile2)"][q]}" stroke="var(--fg)" stroke-width=".4"/>')

def paving_plan():
    """walk narrows from 4.9 to 1.7 over 12.8 (B2-like taper) behind a straight kerb; rows of 1.6 slabs in stretcher bond
    from the kerb; slabs crossing the back edge are CUT along it; a piece narrower than 0.4 is not laid: its neighbour is
    cut longer instead (no slivers). An edging stone (0.12) runs along the cut back edge."""
    S = 34; ox, oy = 30, 250; L0, L1, x0, x1 = 4.9, 1.7, 6.0, 18.8; XE = 26.0; J = 0.06; K = 0.3
    back = lambda x: K + (L0 if x <= x0 else L1 if x >= x1 else L0 + (L1 - L0) * (x - x0) / (x1 - x0))
    g = []
    g.append(f'<rect x="{ox}" y="{oy}" width="{XE * S:.0f}" height="{1.2 * S:.0f}" fill="var(--asphalt)"/>')
    for i in range(int(XE / 1.6) + 1):   # kerb stones 1.6 with joints
        xa = i * 1.6; xb = min(XE, xa + 1.6 - J)
        if xa >= XE: break
        g.append(f'<rect x="{ox + xa * S:.1f}" y="{oy - K * S:.1f}" width="{(xb - xa) * S:.1f}" height="{K * S:.1f}" rx="3" fill="var(--kerb)" stroke="var(--fg)" stroke-width=".8"/>')
    cut = 0
    for r in range(3):
        ya, yb = K + J + r * (1.6 + J), K + J + r * (1.6 + J) + 1.6
        off = 0.8 if r % 2 else 0.0
        xs = [-off + k * (1.6 + J) for k in range(int(XE / 1.6) + 3)]
        for xa in xs:
            xb = xa + 1.6; xa_, xb_ = max(xa, 0), min(xb, XE)
            if xb_ - xa_ < 0.05: continue
            rect = [(xa_, ya), (xb_, ya), (xb_, yb), (xa_, yb)]
            m = (L1 - L0) / (x1 - x0)
            def keep(p): return p[1] - (back(p[0]) - 0.14)
            poly = clip_halfplane(rect, keep)
            if len(poly) < 3: continue
            area = 0.5 * abs(sum(poly[i - 1][0] * poly[i][1] - poly[i][0] * poly[i - 1][1] for i in range(len(poly))))
            if area < 0.4 * 1.6 * 0.5: continue
            iscut = abs(area - 1.6 * (xb_ - xa_)) > 1e-3
            cut += iscut
            g.append(f'<polygon points="{pts(poly, S, ox, oy)}" fill="{"var(--tile2)" if iscut else "var(--tile)"}" stroke="var(--fg)" stroke-width="{1.6 if iscut else .7}"/>')
    edging(g, [(0, back(0) + 0.0), (x0, back(x0)), (x1, back(x1)), (XE, back(XE))], S, ox, oy, out=(0, 1), seed=3)
    g.append(f'<path d="M{ox} {oy - 6.3 * S:.0f} H{ox + XE * S:.0f}" stroke="none"/>')
    lab = [(ox + 2, oy + 26, 'Fahrbahn'), (ox + 2, oy - 0.3 * S - 4, ''), (ox + x0 * S, oy - 5.8 * S, 'Verziehung beginnt'), (ox + x1 * S, oy - 5.8 * S, 'endet (2 MC)')]
    for x, y, t in lab:
        if t: g.append(f'<text x="{x:.0f}" y="{y:.0f}" font-size="12">{t}</text>')
    g.append(f'<line x1="{ox + x0 * S:.0f}" y1="{oy - 5.6 * S:.0f}" x2="{ox + x0 * S:.0f}" y2="{oy + 1.2 * S:.0f}" stroke="var(--muted)" stroke-dasharray="3 3"/>')
    g.append(f'<line x1="{ox + x1 * S:.0f}" y1="{oy - 5.6 * S:.0f}" x2="{ox + x1 * S:.0f}" y2="{oy + 1.2 * S:.0f}" stroke="var(--muted)" stroke-dasharray="3 3"/>')
    W, H = int(ox * 2 + XE * S), int(oy + 1.2 * S + 20)
    return f'<svg viewBox="0 0 {W} {H}" role="img" aria-label="Verlegeplan an einer Verjüngung mit angeschnittenen Platten und Kantenstein">{"".join(g)}</svg>', cut

def kerb_elevation():
    """side view along the kerb: high kerb 0.35 -> transition stone (sloped top over one stone) -> low kerb 0.08 ->
    kerb head (rounded end). Heights drawn x4."""
    S, V = 40, 160; ox, oy = 20, 120
    g = [f'<line x1="{ox}" y1="{oy}" x2="{ox + 20 * S}" y2="{oy}" stroke="var(--asphalt)" stroke-width="4"/>']
    seq = [('Hochbord', 0.35, 0.35)] * 4 + [('Übergangsstein', 0.35, 0.08)] + [('Tiefbord', 0.08, 0.08)] * 3
    x = 0
    for name, ha, hb in seq:
        P = [(x, 0), (x + 1.54, 0), (x + 1.54, hb), (x, ha)]
        g.append(f'<polygon points="{" ".join(f"{ox + a * S:.1f},{oy - b * V:.1f}" for a, b in P)}" fill="{"var(--accent2)" if name == "Übergangsstein" else "var(--kerb)"}" stroke="var(--fg)" stroke-width=".9"/>')
        x += 1.6
    g.append(f'<path d="M{ox + x * S:.1f} {oy} v{-0.08 * V:.1f} q{0.5 * S:.1f} 0 {0.5 * S:.1f} {0.08 * V:.1f} z" fill="var(--kerb)" stroke="var(--fg)" stroke-width=".9"/>')
    for t, xx in (('Hochbord 0,35', 1.0), ('Übergangsstein', 6.5), ('Tiefbord 0,08 (befahrbar)', 9.0), ('Bordsteinkopf', 13.2)):
        g.append(f'<text x="{ox + xx * S:.0f}" y="{oy - 0.35 * V - 12:.0f}" font-size="12">{t}</text>')
    g.append(f'<text x="{ox}" y="{oy + 22}" font-size="11" class="t-muted">Steinlänge 1,6 (¼ MC), Fuge 0,06 · Höhen 4-fach überhöht</text>')
    return f'<svg viewBox="0 0 {int(ox * 2 + 15 * S)} {oy + 34}" role="img" aria-label="Bordstein-Ansicht: Hochbord, Übergangsstein, Tiefbord, Bordsteinkopf">{"".join(g)}</svg>'

def halftone():
    """M2 halftone: fixed grid (pitch 1.2), euclidean dot cos u + cos v, only the size moves: dots of B grow in A, touch
    as diamonds and flip into dots of A in B. No contour, no randomness."""
    S = 18; nx, ny = 44, 7; P = 1.2; g = []
    W, H = nx * P * S, ny * P * S
    g.append(f'<rect x="0" y="0" width="{W:.0f}" height="{H:.0f}" fill="var(--asphalt)"/>')
    res = 3
    for i in range(nx * res):
        for j in range(ny * res):
            x, y = (i + 0.5) / res * P, (j + 0.5) / res * P
            w = min(1, max(0, (x - 0.12 * nx * P) / (0.76 * nx * P)))
            u, v = 2 * math.pi * x / P, 2 * math.pi * y / P
            f = (math.cos(u) + math.cos(v)) / 4 + 0.5          # 0..1 euclidean dot field
            if f > 1 - w: g.append(f'<rect x="{(x - P / res / 2) * S:.1f}" y="{(y - P / res / 2) * S:.1f}" width="{P / res * S + 0.4:.1f}" height="{P / res * S + 0.4:.1f}" fill="var(--gravel)"/>')
    return f'<svg viewBox="0 0 {W:.0f} {H:.0f}" role="img" aria-label="Punktraster nach M2: Kies wächst als Punkte in den Asphalt">{"".join(g)}</svg>'

def takt():
    """M2 Takt-Auslauf: a line that must end decays into its rhythm: piece centres stay on the period (3), length falls
    linearly to the line width (square), then it stops. Below: weight change B -> S as a 20 wedge, outer edge flush."""
    S = 14; g = []; ox, oy = 10, 30
    g.append(f'<rect x="0" y="0" width="{ox * 2 + 60 * S}" height="90" fill="var(--asphalt)"/>')
    g.append(f'<rect x="{ox}" y="{oy - 0.3 * S / 2}" width="{20 * S}" height="{0.3 * S}" fill="var(--mark)"/>')
    for k in range(10):
        c = 20 + 1.5 + k * 3; Lk = max(0.3, 2.4 * (1 - k / 9) + 0.3 * (k / 9))
        g.append(f'<rect x="{ox + (c - Lk / 2) * S:.1f}" y="{oy - 0.3 * S / 2:.1f}" width="{Lk * S:.1f}" height="{0.3 * S:.1f}" fill="var(--mark)"/>')
    y2 = 70; g.append(f'<polygon points="{ox},{y2} {ox + 60 * S},{y2} {ox + 60 * S},{y2 - 0.3 * S} {ox + 40 * S},{y2 - 0.3 * S} {ox + 20 * S},{y2 - 0.6 * S} {ox},{y2 - 0.6 * S}" fill="var(--mark)"/>')
    return f'<svg viewBox="0 0 {ox * 2 + 60 * S} 90" role="img" aria-label="Takt-Auslauf einer Linie und Stärkewechsel als Keil">{"".join(g)}</svg>'

def _tiles(g, S, ox, oy, x_from, x_to, y0, rows, endcut=None):
    """rows of 1.6 slabs (stretcher bond) from y0 outward; endcut(x, y) <= 0 keeps (cut line) -> cut stones."""
    J = 0.06
    for r in range(rows):
        ya, yb = y0 + J + r * 1.66, y0 + J + r * 1.66 + 1.6; off = 0.8 if r % 2 else 0
        x = x_from - off
        while x < x_to:
            xa, xb = max(x, x_from), min(x + 1.6, x_to)
            if xb - xa > 0.05:
                poly = [(xa, ya), (xb, ya), (xb, yb), (xa, yb)]
                if endcut: poly = clip_halfplane(poly, endcut)
                if len(poly) >= 3:
                    area = 0.5 * abs(sum(poly[i - 1][0] * poly[i][1] - poly[i][0] * poly[i - 1][1] for i in range(len(poly))))
                    if area > 0.32:
                        cutp = abs(area - (xb - xa) * 1.6) > 1e-3
                        g.append(f'<polygon points="{pts(poly, S, ox, oy)}" fill="{"var(--tile2)" if cutp else "var(--tile)"}" stroke="var(--fg)" stroke-width="{1.4 if cutp else .6}"/>')
            x += 1.66
def _kerb_run(g, S, ox, oy, x0, x1, y0, K=0.3, fill='var(--kerb)'):
    x = x0
    while x < x1 - 0.05:
        xb = min(x + 1.54, x1); g.append(f'<rect x="{ox + x * S:.1f}" y="{oy - (y0 + K) * S:.1f}" width="{(xb - x) * S:.1f}" height="{K * S:.1f}" rx="2" fill="{fill}" stroke="var(--fg)" stroke-width=".7"/>'); x += 1.6

def ortseingang():
    S = 19; ox, oy = 20, 210; XE = 44
    g = [f'<rect x="0" y="0" width="{ox * 2 + XE * S}" height="{oy + 40}" fill="var(--grass)"/>',
         f'<rect x="{ox}" y="{oy}" width="{XE * S}" height="{2.4 * S}" fill="var(--asphalt)"/>']
    # gravel shoulder of the country road: organic clay outline (no rectangle), begins with a rounded end behind the kerb head;
    # loose gravel lies on the asphalt edge as small pebble clusters (rubble logic), never as a dot grid
    top = [(27.0 + 0.0, 0.0)] + [(x / 4, 1.0 + 0.10 * math.sin(x * 0.9) + 0.08 * (_h(x) - .5)) for x in range(110, int(XE * 4) + 1)] + [(XE, 0.0)]
    d = f"M{ox + 27.0 * S:.1f} {oy:.1f} Q{ox + 27.0 * S:.1f} {oy - 1.0 * S:.1f} {ox + 27.9 * S:.1f} {oy - 1.0 * S:.1f} " + " ".join(f"L{ox + x * S:.1f} {oy - y * S:.1f}" for x, y in top[2:-1]) + f" L{ox + XE * S:.1f} {oy:.1f} Z"
    g.append(f'<path d="{d}" fill="var(--gravel)"/>')
    for c in range(16):
        cx = 27.6 + c * 1.05 + 0.4 * _h(c * 3); n = 2 + int(3 * _h(c * 5))
        for q in range(n):
            px, py = cx + 0.6 * (_h(c * 7 + q) - .5), -0.08 - 0.45 * _h(c * 11 + q) ** 1.6; r = 0.07 + 0.08 * _h(c * 13 + q)
            g.append(f'<ellipse cx="{ox + px * S:.1f}" cy="{oy - py * S:.1f}" rx="{r * 1.3 * S:.1f}" ry="{r * S:.1f}" fill="var(--gravel)" stroke="var(--fg)" stroke-width=".35"/>')
    # town: gutter + kerb (high -> transition stone -> low) + sidewalk with a 45 deg cut end and an edging stone
    _kerb_run(g, S, ox, oy, 0, 19.2, 0)
    g.append(f'<polygon points="{pts([(19.2, 0), (20.74, 0), (20.74, 0.18), (19.2, 0.3)], S, ox, oy)}" fill="var(--accent2)" stroke="var(--fg)" stroke-width=".8"/>')
    _kerb_run(g, S, ox, oy, 20.8, 25.6, 0, K=0.18)
    g.append(f'<path d="M{ox + 25.6 * S:.1f} {oy:.1f} v{-0.18 * S:.1f} q{0.5 * S:.1f} 0 {0.5 * S:.1f} {0.18 * S:.1f} z" fill="var(--kerb)" stroke="var(--fg)" stroke-width=".8"/>')
    cut = lambda p: (p[0] - 16.0) - (5.2 - p[1]) * 0   # placeholder replaced below
    end = lambda p: (p[0] + p[1]) - 22.4            # 45 deg cut line x + y = 22.4
    _tiles(g, S, ox, oy, 0, 24, 0.3, 3, endcut=end)
    edging(g, [(22.25, 0.45), (17.3, 5.4)], S, ox, oy, out=(0, -1), seed=5)
    g.append(f'<rect x="{ox + 15.2 * S:.0f}" y="{oy + 0.15 * S:.0f}" width="{0.8 * S:.0f}" height="{0.4 * S:.0f}" fill="var(--fg)"/><g stroke="var(--asphalt)" stroke-width="1.2">' + ''.join(f'<line x1="{ox + (15.3 + k * 0.15) * S:.1f}" y1="{oy + 0.18 * S:.1f}" x2="{ox + (15.3 + k * 0.15) * S:.1f}" y2="{oy + 0.52 * S:.1f}"/>' for k in range(5)) + '</g>')
    g.append(f'<circle cx="{ox + 22.6 * S:.0f}" cy="{oy - 6.0 * S:.0f}" r="7" fill="var(--accent)"/>')
    T = [(1, oy - 5.9 * S, 'Gehweg (Läuferverband 1,6)'), (17.5, oy - 6.3 * S, 'Ortsschild'), (14.2, oy + 1.35 * S, 'letzter Straßenablauf'),
         (19.0, oy + 2.15 * S, 'Übergangsstein'), (24.2, oy - 0.7 * S, 'Bordsteinkopf'), (28.5, oy - 1.5 * S, 'Kiesbankett · Kiesrubbel am Rand'),
         (15.0, oy - 2.6 * S, 'Passsteine am 45°-Schnitt'), (22.0, oy - 4.2 * S, 'Kantenstein'), (31, oy - 4.5 * S, 'Wiese (Land)')]
    for x, y, t in T: g.append(f'<text x="{ox + x * S:.0f}" y="{y:.0f}" font-size="12">{t}</text>')
    return f'<svg viewBox="0 0 {ox * 2 + XE * S} {oy + 2.4 * S + 8:.0f}" role="img" aria-label="Ortseingang gebaut: Übergangsstein, Tiefbord, Bordsteinkopf, Gehweg mit 45-Grad-Schnitt und Kantenstein, Kiesbankett">{"".join(g)}</svg>'

def rampenfuss():
    """B5 (Georg 09.10.): the road edge has two families, kerb and Joyride bande. The bande ends with a rounded head that
    dives into the ground, with rubble; a grass strip; then the town begins with a kerb head; the walk starts with a 45 deg
    edge, edging stones and rubble. No wall, no tyres, no layers lying on each other."""
    S = 19; ox, oy = 20, 150; XE = 44
    g = [f'<rect x="0" y="0" width="{ox * 2 + XE * S}" height="{oy + 60}" fill="var(--grass)"/>',
         f'<rect x="{ox}" y="{oy}" width="{XE * S}" height="{2.6 * S}" fill="var(--asphalt)"/>']
    # bande: rounded red strand on its grass bed, head rounds off and dives (drawn narrowing + darker where it is underground)
    g.append(f'<path d="M{ox} {oy - 0.45 * S:.1f} H{ox + 11.5 * S:.1f} q{1.6 * S:.1f} 0 {2.6 * S:.1f} {-0.6 * S:.1f} q{-1.0 * S:.1f} {-0.75 * S:.1f} {-2.6 * S:.1f} {-0.75 * S:.1f} H{ox} Z" fill="#d6463a" stroke="var(--fg)" stroke-width="1"/>')
    for q in range(12):
        a = _h(q * 3) * 6.283; d = 0.9 * S * _h(q * 5) ** 1.5; r = (0.12 + 0.16 * _h(q * 7)) * S
        g.append(f'<ellipse cx="{ox + 14.4 * S + math.cos(a) * d:.1f}" cy="{oy - 0.85 * S + math.sin(a) * d * 0.7:.1f}" rx="{r * 1.25:.1f}" ry="{r:.1f}" fill="{["#d8c8ae", "#e7d9c5", "#c9b48c"][q % 3]}" stroke="var(--fg)" stroke-width=".4"/>')
    # town: kerb head, kerb, walk starting with a 45 deg edge + edging stones + rubble
    g.append(f'<path d="M{ox + 21.4 * S:.1f} {oy:.1f} v{-0.3 * S:.1f} h{-0.4 * S:.1f} q{-0.5 * S:.1f} 0 {-0.5 * S:.1f} {0.3 * S:.1f} z" fill="var(--kerb)" stroke="var(--fg)" stroke-width=".8"/>')
    _kerb_run(g, S, ox, oy, 21.4, XE, 0)
    start = lambda p: (21.7 + p[1]) - p[0]
    _tiles(g, S, ox, oy, 21.4, XE, 0.3, 3, endcut=start)
    edging(g, [(21.85, 0.45), (26.85, 5.45)], S, ox, oy, out=(0, -1), seed=7)
    T = [(1, oy - 1.6 * S, 'Joyride-Bande (rund, rot)'), (10.0, oy - 2.6 * S, 'Bandenkopf taucht in den Boden · Rubbel'), (15.4, oy - 4.0 * S, 'Grünstreifen'),
         (22.5, oy - 6.0 * S, 'Stadt: Bordsteinkopf, Bord, Gehweg mit 45°-Anfang'), (2, oy + 2.1 * S, 'Fahrbahn läuft durch')]
    for x, yy, t in T: g.append(f'<text x="{ox + x * S:.0f}" y="{yy:.0f}" font-size="12">{t}</text>')
    return f'<svg viewBox="0 0 {ox * 2 + XE * S} {oy + 2.6 * S + 8:.0f}" role="img" aria-label="Rampenfuß: Joyride-Bande taucht ab, Grünstreifen, Bordsteinkopf, Gehweganfang">{"".join(g)}</svg>'

def bogen():
    """stone arch from the island rock (Georg 08.10): springing banks cut into both rock flanks ~12 below the turf, a
    segmental arch of clay voussoirs with a keystone, spandrel walls up to the deck (slight crest), stone parapet with
    coping, end piers and wing walls on the islands. Scale 7 px per unit."""
    S = 7.0; rimL, rimR, yR = 150, 150 + 64 * S, 120
    g = [f'<rect x="0" y="0" width="760" height="380" fill="var(--void)"/>']
    # islands (turf + rock), flanks recede inward downward
    for sgn, rx in ((-1, rimL), (1, rimR)):
        far = 0 if sgn < 0 else 760
        face = [(rx, yR), (rx + sgn * -6, yR + 30), (rx + sgn * -15, yR + 84), (rx + sgn * -40, yR + 170), (rx + sgn * -90, yR + 225), (far, yR + 240)]
        g.append(f'<polygon points="{far},{yR} ' + ' '.join(f'{x:.0f},{y:.0f}' for x, y in face) + f'" fill="var(--rock)"/>')
        g.append(f'<path d="M{far} {yR} H{rx}" stroke="var(--grass)" stroke-width="8" stroke-linecap="round"/>')
    spL, spR, ySp = rimL - 23, rimR + 23, yR + 84           # springings 8 px INSIDE the rock face: the ring end sits in a cut seat
    span = spR - spL; cx = (spL + spR) / 2; rise = 72; R = (span ** 2 / 4 + rise ** 2) / (2 * rise); cy = ySp - rise + R
    a0 = math.asin((span / 2) / R)
    tS, tC = 20, 12   # ring thickness springing / crown (px)
    N = 21
    for k in range(N):
        a, b = -a0 + 2 * a0 * k / N, -a0 + 2 * a0 * (k + 1) / N
        ta = tS + (tC - tS) * (1 - abs(a) / a0); tb = tS + (tC - tS) * (1 - abs(b) / a0)
        P = [(cx + R * math.sin(a), cy - R * math.cos(a)), (cx + R * math.sin(b), cy - R * math.cos(b)),
             (cx + (R + tb) * math.sin(b), cy - (R + tb) * math.cos(b)), (cx + (R + ta) * math.sin(a), cy - (R + ta) * math.cos(a))]
        key = k == N // 2
        if key: P = [P[0], P[1], (P[2][0], P[2][1] - 6), (P[3][0], P[3][1] - 6)]
        g.append(f'<polygon points="{" ".join(f"{x:.1f},{y:.1f}" for x, y in P)}" fill="{"var(--accent2)" if key else "var(--wall)"}" stroke="var(--fg)" stroke-width="1"/>')
    for sgn in (-1, 1):   # skewback seat (Kaempferbank): cut into the rock under and behind the ring's radial end face
        a = sgn * a0; ii = (cx + R * math.sin(a), cy - R * math.cos(a)); ee = (cx + (R + tS) * math.sin(a), cy - (R + tS) * math.cos(a))
        seat = [ii, ee, (ee[0] + sgn * 14, ee[1] + 12), (ii[0] + sgn * 16, ii[1] + 16), (ii[0] - sgn * 4, ii[1] + 16)]
        g.append(f'<polygon points="{" ".join(f"{x:.1f},{y:.1f}" for x, y in seat)}" fill="var(--wall2)" stroke="var(--fg)" stroke-width="1"/>')
        g.append(f'<path d="M{ii[0] - sgn * 4:.1f} {ii[1] + 16:.1f} l{sgn * 26:.1f} 0" stroke="var(--fg)" stroke-width=".8" stroke-dasharray="2 2"/>')
    # deck line with crest (0.9 over 64 -> 6 px), spandrel walls between extrados and deck
    deck = lambda x: yR - 2 - 6.3 * 64 * ((x - rimL) / (rimR - rimL) * (1 - (x - rimL) / (rimR - rimL))) ** 3 * 64 / 64 if rimL <= x <= rimR else yR - 2
    xs = [rimL - 30 + i * 4 for i in range(int((rimR - rimL + 60) / 4) + 1)]
    ext = lambda x: cy - math.sqrt(max(0, (R + tC + (tS - tC) * min(1, abs(x - cx) / (span / 2))) ** 2 - (x - cx) ** 2))
    sp = [(x, deck(x)) for x in xs if spL <= x <= spR]
    poly = sp + [(x, max(ext(x), deck(x))) for x, _ in reversed(sp)]
    g.append(f'<polygon points="{" ".join(f"{x:.1f},{y:.1f}" for x, y in poly)}" fill="var(--wall2)" stroke="var(--fg)" stroke-width="1"/>')
    for k in range(1, 9):   # courses in the spandrel wall
        yy = yR + 6 + k * 9
        segs = [(x, yy) for x in xs if spL < x < spR and ext(x) > yy + 1]
        if len(segs) > 1:
            left = [x for x, _ in segs if x < cx]; right = [x for x, _ in segs if x > cx]
            for part in (left, right):
                if len(part) > 1: g.append(f'<line x1="{part[0]:.0f}" y1="{yy}" x2="{part[-1]:.0f}" y2="{yy}" stroke="var(--fg)" stroke-width=".5" opacity=".5"/>')
    road = [(x, deck(x)) for x in xs]
    g.append(f'<polyline points="{" ".join(f"{x:.1f},{y:.1f}" for x, y in road)}" fill="none" stroke="var(--asphalt)" stroke-width="3"/>')
    par = [(x, deck(x) - 11.5) for x in xs if rimL - 18 <= x <= rimR + 18]
    g.append(f'<polyline points="{" ".join(f"{x:.1f},{y:.1f}" for x, y in par)}" fill="none" stroke="var(--wall)" stroke-width="7" stroke-linecap="round"/>')
    for x in (rimL - 20, rimR + 20):
        g.append(f'<rect x="{x - 6}" y="{yR - 22}" width="12" height="20" rx="3" fill="var(--wall2)" stroke="var(--fg)"/>')
        g.append(f'<path d="M{x + (6 if x < cx else -6)} {yR - 2} l{(-16 if x < cx else 16)} 0 l{(-4 if x < cx else 4)} 18 l{(20 if x < cx else -20)} 0 z" fill="var(--wall2)" stroke="var(--fg)" stroke-width=".8"/>')
    # load path
    g.append(f'<path d="M{cx} {yR - 8} C {cx - 60} {yR + 4}, {spL + 40} {ySp - 30}, {spL - 12} {ySp + 6}" fill="none" stroke="var(--accent)" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#ah)"/>')
    g.append('<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--accent)"/></marker></defs>')
    T = [(cx - 52, ySp - rise - 30, 'Schlussstein'), (cx + 70, yR + 40, 'Zwickelmauer'), (cx + 120, ySp + 22, 'Bogen aus Knetquadern'),
         (spL - 125, ySp + 40, 'Kämpferbank in den Fels gehauen'), (rimL - 145, yR - 30, 'Endpfeiler + Flügelmauer'), (cx + 40, yR - 30, 'Steinbrüstung mit Deckplatte, Kuppe 0,9'),
         (cx - 120, yR + 150, 'Lastweg: Fahrbahn → Zwickel → Bogen → Fels')]
    for x, y, t in T:
        cls = ' class="t-acc"' if t.startswith("Lastweg") else ''
        g.append(f'<text x="{x:.0f}" y="{y:.0f}" font-size="12"{cls}>{t}</text>')
    return '<svg viewBox="0 0 760 380" role="img" aria-label="Steinbogenbrücke zwischen zwei schwebenden Inseln mit Kämpferbänken im Fels">' + ''.join(g) + '</svg>'

def _h(n):   # deterministic hash 0..1
    v = math.sin(n * 91.345 + 47.853) * 43758.5453; return v - math.floor(v)
def bogen2(crest_units=2.4):
    """Steinbogen nach Georgs Referenz (08.10.): Buckel in der Fahrbahn, Rundbogen-Charakter (Stich = Spannweite / 3),
    grosse Bogensteine als eigener Ring, Zwickel in unregelmaessigen Steinlagen, Bruestung mit runden Decksteinen,
    Kaempfer in Sitzen im Fels, Rubbel und Knetsteinchen an den Sitzen. Scale 6 px per unit."""
    S = 6.0; rimL, rimR, yR = 188, 188 + 64 * S, 150
    g = [f'<rect x="0" y="0" width="760" height="430" fill="var(--void)"/>']
    for sgn, rx in ((-1, rimL), (1, rimR)):
        far = 0 if sgn < 0 else 760
        face = [(rx, yR), (rx - sgn * 5, yR + 30), (rx - sgn * 16, yR + 90), (rx - sgn * 34, yR + 160), (rx - sgn * 80, yR + 230), (far, yR + 250)]
        g.append(f'<polygon points="{far},{yR} ' + ' '.join(f'{x:.0f},{y:.0f}' for x, y in face) + f'" fill="var(--rock)"/>')
        g.append(f'<path d="M{far} {yR} H{rx}" stroke="var(--grass)" stroke-width="9" stroke-linecap="round"/>')
    span_top = rimR - rimL
    # springing depth from the rock: deep enough for a round-arch character; rise follows from it (crown under the deck)
    ySp = yR + 150; tS, tC, N = 30, 22, 15
    rise = ySp - (yR - 2 - crest_units * S) - tC - 8
    spL, spR = rimL - 31 - 8, rimR + 31 + 8                    # seats 8 px inside the receding rock face at that depth
    span = spR - spL; cx = (spL + spR) / 2; R = (span ** 2 / 4 + rise ** 2) / (2 * rise); cy = ySp - rise + R; a0 = math.asin(min(1, (span / 2) / R))
    deck = lambda x: yR - 2 - crest_units * S * (math.sin(math.pi * min(1, max(0, (x - (rimL - 24)) / (span_top + 48)))) ** 2)
    ext = lambda x: cy - math.sqrt(max(0, (R + tC + (tS - tC) * min(1, abs(x - cx) / (span / 2))) ** 2 - (x - cx) ** 2))
    xs = [rimL - 40 + i * 3 for i in range(int((span_top + 80) / 3) + 1)]
    # spandrel walls in irregular courses (stones of varying length per course), between the ring and the deck
    sp_poly = [(x, deck(x)) for x in xs if spL - 6 <= x <= spR + 6] + [(x, max(ext(x), deck(x))) for x in reversed([x for x in xs if spL - 6 <= x <= spR + 6])]
    g.append(f'<polygon points="{" ".join(f"{x:.1f},{y:.1f}" for x, y in sp_poly)}" fill="var(--wall2)"/>')
    for row in range(14):
        y0 = yR - 2 - crest_units * S + 4 + row * 9
        x = spL - 6 + (row % 2) * 9; k = 0
        while x < spR + 6:
            L = 14 + 18 * _h(row * 31 + k); xb = min(x + L, spR + 6)
            top = max(deck(x), deck(xb)) + 2; bot = y0 + 9
            if y0 >= top - 9 and ext(x) > y0 + 4 and ext(xb) > y0 + 4:
                yy0 = max(y0, top)
                if bot - yy0 > 3: g.append(f'<rect x="{x + 1:.1f}" y="{yy0 + 1:.1f}" width="{xb - x - 2:.1f}" height="{bot - yy0 - 2:.1f}" rx="2.5" fill="var(--wall)" stroke="var(--fg)" stroke-width=".6"/>')
            x = xb; k += 1
    # voussoir ring: big stones, keystone, radial joints, slightly proud of the spandrel face
    for k in range(N):
        a, b = -a0 + 2 * a0 * k / N, -a0 + 2 * a0 * (k + 1) / N
        ta = tS + (tC - tS) * (1 - abs(a) / a0); tb = tS + (tC - tS) * (1 - abs(b) / a0)
        P = [(cx + R * math.sin(a), cy - R * math.cos(a)), (cx + R * math.sin(b), cy - R * math.cos(b)), (cx + (R + tb) * math.sin(b), cy - (R + tb) * math.cos(b)), (cx + (R + ta) * math.sin(a), cy - (R + ta) * math.cos(a))]
        key = k == N // 2
        if key: P = [P[0], P[1], (P[2][0], P[2][1] - 7), (P[3][0], P[3][1] - 7)]
        g.append(f'<polygon points="{" ".join(f"{x:.1f},{y:.1f}" for x, y in P)}" fill="{"var(--accent2)" if key else "var(--wall)"}" stroke="var(--fg)" stroke-width="1.2" stroke-linejoin="round"/>')
    for sgn in (-1, 1):   # seats cut into the rock + crumbs and clay pebbles in front of them
        a = sgn * a0; ii = (cx + R * math.sin(a), cy - R * math.cos(a)); ee = (cx + (R + tS) * math.sin(a), cy - (R + tS) * math.cos(a))
        seat = [ii, ee, (ee[0] + sgn * 16, ee[1] + 14), (ii[0] + sgn * 18, ii[1] + 20), (ii[0] - sgn * 6, ii[1] + 20)]
        g.append(f'<polygon points="{" ".join(f"{x:.1f},{y:.1f}" for x, y in seat)}" fill="var(--wall2)" stroke="var(--fg)" stroke-width="1"/>')
        for k in range(9):
            px = ii[0] - sgn * (4 + 26 * _h(k * 7 + (sgn > 0))); py = ii[1] + 22 + 10 * _h(k * 13 + 3); r = 2 + 4.5 * _h(k * 5 + 1)
            g.append(f'<ellipse cx="{px:.1f}" cy="{py:.1f}" rx="{r * 1.3:.1f}" ry="{r:.1f}" fill="{"var(--wall)" if k % 2 else "var(--gravel)"}" stroke="var(--fg)" stroke-width=".5"/>')
    road = [(x, deck(x)) for x in xs]
    g.append(f'<polyline points="{" ".join(f"{x:.1f},{y:.1f}" for x, y in road)}" fill="none" stroke="var(--asphalt)" stroke-width="3"/>')
    # parapet: wall with rounded cap stones, end piers on the islands
    xa, xb = rimL - 24, rimR + 24; k = 0; x = xa
    while x < xb - 2:
        L = 10 + 4 * _h(k + 99); y = deck(x + L / 2) - 13
        g.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="{L - 1:.1f}" height="9" rx="4" fill="var(--wall)" stroke="var(--fg)" stroke-width=".7"/>'); x += L; k += 1
    for x in (xa - 8, xb + 8):
        g.append(f'<rect x="{x - 7}" y="{yR - 26}" width="14" height="24" rx="4" fill="var(--wall2)" stroke="var(--fg)"/>')
    g.append('<defs><marker id="ah2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--accent)"/></marker></defs>')
    g.append(f'<path d="M{cx} {yR - 16} C {cx - 70} {yR}, {spL + 50} {ySp - 40}, {spL - 10} {ySp + 8}" fill="none" stroke="var(--accent)" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#ah2)"/>')
    T = [(cx - 30, yR - crest_units * S - 30, 'Schlussstein · Buckel'), (rimL - 182, yR + 62, 'Zwickel: unregelmäßige Steinlagen'), (cx + 120, ySp + 6, 'Bogensteine (eigener Ring)'),
         (spL - 150, ySp + 50, 'Kämpfersitz im Fels · Rubbel'), (8, yR - 34, 'Endpfeiler'), (cx + 150, yR - crest_units * S - 30, 'Brüstung mit runden Decksteinen'), (cx - 110, yR + 190, 'Lastweg: Fahrbahn → Zwickel → Bogen → Fels')]
    for x, y, t in T:
        cls = ' class="t-acc"' if t.startswith('Lastweg') else ''
        g.append(f'<text x="{x:.0f}" y="{y:.0f}" font-size="12"{cls}>{t}</text>')
    return '<svg viewBox="0 0 760 430" role="img" aria-label="Steinbogen mit Buckel nach Referenz: Bogensteinring, Zwickel aus Steinlagen, Brüstung mit runden Decksteinen, Kämpfersitze im Fels">' + ''.join(g) + '</svg>'

def wegende_frei():
    """free path end (Georg 09.10., second TUNE): only whole big slabs; the last three step back and form the rounded end;
    rubble fills the steps, heaped irregularly; transition about 1-2 slab lengths. Plan view."""
    S = 34; ox, oy = 20, 26; P = 1.66
    TONES = ['#e7d9c5', '#dccbb2', '#ecdfcb', '#d6c3a7']
    g = [f'<rect x="0" y="0" width="{ox * 2 + 16 * S:.0f}" height="{oy * 2 + 3 * P * S + 10:.0f}" fill="var(--grass)"/>']
    rows = {0: 4, 1: 6, 2: 5}
    g.append(f'<rect x="{ox:.0f}" y="{oy:.0f}" width="{3.6 * P * S:.0f}" height="{3 * P * S:.0f}" rx="{0.8 * S:.0f}" fill="#b9ac96"/>')
    for r, n in rows.items():
        for k in range(n):
            last = k == n - 1; x = ox + (k * P + (0.4 if r == 1 else 0)) * S; y = oy + r * P * S
            rot = (_h(r * 13 + k) - .5) * (18 if last else 1.5); rx = (0.25 if last else 0.08) * S
            g.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="{1.6 * S:.1f}" height="{1.6 * S:.1f}" rx="{rx:.1f}" transform="rotate({rot:.1f} {x + 0.8 * S:.1f} {y + 0.8 * S:.1f})" fill="{TONES[(r * 7 + k * 3) % 4]}" stroke="var(--fg)" stroke-width=".8"/>')
    ends = [(rows[0] - .5) * P, (rows[1] - .5) * P + 0.4, (rows[2] - .5) * P]
    for i, xe in enumerate(ends):
        cx, cy = ox + (xe + 1.0) * S, oy + (i * P + 0.8) * S; n = 11 if i == 1 else 8
        for q in range(n):
            a = _h(i * 31 + q) * 6.283; d = 0.85 * S * _h(i * 37 + q) ** 1.6; rr = (0.12 + 0.17 * _h(i * 43 + q)) * S * (1.1 - d / (0.9 * S))
            g.append(f'<ellipse cx="{cx + math.cos(a) * d + 0.3 * S * _h(q * 5 + i) ** 2:.1f}" cy="{cy + math.sin(a) * d:.1f}" rx="{rr * 1.25:.1f}" ry="{rr:.1f}" fill="{TONES[q % 4]}" stroke="var(--fg)" stroke-width=".5"/>')
    for x, y, t in ((0.4, 3 * P + 0.75, 'ganze große Platten'), (8.6, -0.25, 'die letzten drei treten gestaffelt zurück'), (10.4, 3 * P + 0.75, 'Rubbel in den Stufen, gehäuft')):
        g.append(f'<text x="{ox + x * S:.0f}" y="{oy + y * S:.0f}" font-size="13">{t}</text>')
    return f'<svg viewBox="0 0 {ox * 2 + 16 * S:.0f} {oy * 2 + 3 * P * S + 10:.0f}" role="img" aria-label="Freies Wegende: ganze Platten, die letzten drei treten gestaffelt zurück, Rubbel in den Stufen">{"".join(g)}</svg>'
