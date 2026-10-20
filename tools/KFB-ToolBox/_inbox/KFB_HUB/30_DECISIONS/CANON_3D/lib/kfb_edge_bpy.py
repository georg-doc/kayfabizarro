# kfb_edge_bpy · EIN Werkzeug für alle Abschlüsse (K8, WS0 20.10.; Kanon Gebiet 4, V-577, SPEC_EDGE_RUBBLE_GRAMMAR_R1; Georg 20.10. für das freie Ende).
#   free_end(tiles, …)   Freies Ende eines Plattenfelds durch Verfall: Randplatten werden in Pfad-artige Stücke GESCHNITTEN (echtes Material der Platte,
#                        Deckflächen-UV, Steinchen wandern mit), Bruchkanten verwittert gerundet, von dicht nach locker verteilt wie KayKit path_A → path_D.
#                        Ein Zerfallsfeld D(x, y) steuert Stückgröße, Fuge, Verteilung, fehlende Stücke, Einsinken; das Feld liefert auch Erde/Geländehöhe.
#   built_end(...)       Gebautes Ende: gerundete Knet-Kappe aus dem Material des Bauteils (Wandkopf/Mauerende) bzw. Kantensteinreihe am Plattenrand.
#   ruin_end(wall, …)    Ruinen-Ende: abgebrochene, gerundete Oberkante (abgeleitete Kopie, Original bleibt) + Rubbel aus demselben Material am Fuß.
#   Parameter: kfb_edge_params.json (gleicher Ordner). Seeds deterministisch (Text). Alle erzeugten Objekte tragen kfb_*-Eigenschaften fürs Gate.
#   Kit-Originale werden nie verformt: ersetzte Quellen werden nur ausgeblendet (kfb_edge_replaced).
# Achsen: Blender-Welt, z oben. Platten/Wände dürfen nur um z gedreht sein (Kit-Lage); Plattenoberseite = größte Deckfläche.
import bpy, bmesh, json, math, os, random, zlib
from mathutils import Vector, Matrix
import numpy as np
import kfb_env

HERE = os.path.dirname(os.path.abspath(__file__)); PARAMS_PATH = os.path.join(HERE, 'kfb_edge_params.json'); VERSION = 'kfb-edge.v1'
def load_params(path=None): return json.load(open(path or PARAMS_PATH))
def _sm(a, b, v): t = min(1.0, max(0.0, (v - a) / (b - a))); return t * t * (3 - 2 * t)
def _rng(seed): return random.Random(str(seed))
def _coll(name):
    c = bpy.data.collections.get(name) or bpy.data.collections.new(name)
    if c.name not in bpy.context.scene.collection.children: bpy.context.scene.collection.children.link(c)
    return c
def _props(ob, kind, role, palette_role, layer, story, edge, src=None, group=None, extra=None):
    ob['kfb_kind'] = kind; ob['kfb_role'] = role; ob['kfb_palette_role'] = palette_role; ob['kfb_layer'] = layer; ob['kfb_story'] = story
    ob['kfb_edge'] = edge; ob['kfb_edge_tool'] = VERSION
    if src: ob['kfb_edge_source'] = src
    if group: ob['kfb_group'] = group
    for k, v in (extra or {}).items(): ob[k] = v
def _chaikin(P, n):
    for _ in range(n):
        P = [q for k in range(len(P)) for q in ((0.75 * P[k][0] + 0.25 * P[(k + 1) % len(P)][0], 0.75 * P[k][1] + 0.25 * P[(k + 1) % len(P)][1]),
                                                (0.25 * P[k][0] + 0.75 * P[(k + 1) % len(P)][0], 0.25 * P[k][1] + 0.75 * P[(k + 1) % len(P)][1]))]
    return P
def _clip(poly, a, b, c):   # Halbebene a·x + b·y ≤ c
    out = []
    for k in range(len(poly)):
        p, q = poly[k], poly[(k + 1) % len(poly)]; fp, fq = a * p[0] + b * p[1] - c, a * q[0] + b * q[1] - c
        if fp <= 0: out.append(p)
        if (fp <= 0) != (fq <= 0): t = fp / (fp - fq); out.append((p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t))
    return out
def _inside(poly, x, y):
    n = len(poly); return all((poly[(k + 1) % n][0] - poly[k][0]) * (y - poly[k][1]) - (poly[(k + 1) % n][1] - poly[k][1]) * (x - poly[k][0]) >= -1e-9 for k in range(n))
def _islands(bm):
    seen, isl = set(), []
    for f in bm.faces:
        if f in seen: continue
        st, comp = [f], []
        while st:
            g = st.pop()
            if g in seen: continue
            seen.add(g); comp.append(g); st += [h for e in g.edges for h in e.link_faces if h not in seen]
        isl.append(comp)
    isl.sort(key=lambda c: -sum(f.calc_area() for f in c)); return isl
# ------------------------------------------------------------------ Analyse einer Platte (lokal, je Mesh zwischengespeichert)
_SLAB = {}
def slab_data(ob):
    me = ob.data
    if me.name in _SLAB: return _SLAB[me.name]
    bm = bmesh.new(); bm.from_mesh(me); bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-4); uv = bm.loops.layers.uv.active; isl = _islands(bm); main = isl[0]
    tops = sorted([f for f in main if f.normal.z > 0.9], key=lambda f: -f.calc_area()); tops = [f for f in tops if f.calc_area() > 0.2 * tops[0].calc_area()]
    P = [[l.vert.co.x, l.vert.co.y, 1.0] for f in tops for l in f.loops]; U = [list(l[uv].uv) for f in tops for l in f.loops]
    aff = np.linalg.lstsq(np.array(P), np.array(U), rcond=None)[0]; umin, umax = np.array(U).min(0) + 0.003, np.array(U).max(0) - 0.003
    sides = sorted([f for f in main if abs(f.normal.z) < 0.3], key=lambda f: -f.calc_area()); side_uv = tuple(np.mean([list(l[uv].uv) for l in sides[0].loops], 0)) if sides else tuple(U[0])
    xs = [v.co.x for f in main for v in f.verts]; ys = [v.co.y for f in main for v in f.verts]
    top_z = max(l.vert.co.z for f in tops for l in f.loops)
    peb = []
    for comp in isl[1:]:
        vs = list({v for f in comp for v in f.verts}); idx = {v: i for i, v in enumerate(vs)}
        peb.append({'c': (sum(v.co.x for v in vs) / len(vs), sum(v.co.y for v in vs) / len(vs)), 'v': [tuple(v.co) for v in vs],
                    'f': [[idx[v] for v in f.verts] for f in comp], 'uv': [[tuple(l[uv].uv) for l in f.loops] for f in comp]})
    bm.free()
    d = dict(aff=aff, umin=umin, umax=umax, side_uv=side_uv, peb=peb, mat=me.materials[0] if me.materials else None,
             cx=(min(xs) + max(xs)) / 2, cy=(min(ys) + max(ys)) / 2, hx=(max(xs) - min(xs)) / 2, hy=(max(ys) - min(ys)) / 2, top=top_z)
    _SLAB[me.name] = d; return d
# ------------------------------------------------------------------ das eine Zerfallsfeld
class EdgeField:
    """D(x, y) ∈ [0, 1]: 0 = Platte heil, 1 = Gelände. Aus der verzerrten Distanz zum Umriss der Plattenvereinigung (Weltkoordinaten)."""
    def __init__(self, tiles, params=None, strength=None):
        self.p = (params or load_params())['free_end']; self.strength = strength or (lambda x, y: 1.0); self.boxes = []; self.G = 2.0
        for ob in tiles:
            sd = slab_data(ob); M = ob.matrix_world; inv = M.inverted()
            cs = [M @ Vector((sd['cx'] + sx * sd['hx'], sd['cy'] + sy * sd['hy'], sd['top'])) for sx, sy in ((-1, -1), (1, -1), (1, 1), (-1, 1))]
            self.boxes.append((inv, sd, cs, min(c.x for c in cs), max(c.x for c in cs), min(c.y for c in cs), max(c.y for c in cs)))
        self.top = sum((ob.matrix_world @ Vector((0, 0, slab_data(ob)['top']))).z for ob in tiles) / max(1, len(tiles))
        self.bh = {}
        for b in self.boxes:
            for gx in range(int(math.floor(b[3] / self.G)), int(math.floor(b[4] / self.G)) + 1):
                for gy in range(int(math.floor(b[5] / self.G)), int(math.floor(b[6] / self.G)) + 1): self.bh.setdefault((gx, gy), []).append(b)
        # äußerer Umriss der Plattenvereinigung: Kantenstücke, hinter denen keine Platte liegt (innere Fugen zählen nicht als Rand)
        self.seg = {}; nseg = 0
        for inv, sd, cs, *_ in self.boxes:
            for k in range(4):
                a, b = cs[k], cs[(k + 1) % 4]; L = (b - a).length; n_ = max(1, int(L / 0.25)); t = (b - a) / L; nrm = Vector((t.y, -t.x, 0.0))
                ctr = sum(cs, Vector()) / 4
                if nrm.dot(((a + b) / 2) - ctr) < 0: nrm = -nrm
                for i in range(n_):
                    p0, p1 = a + (b - a) * (i / n_), a + (b - a) * ((i + 1) / n_); m = (p0 + p1) / 2
                    if self.covered(m.x + nrm.x * 0.03, m.y + nrm.y * 0.03): continue
                    for gx in range(int(math.floor(min(p0.x, p1.x) / self.G)), int(math.floor(max(p0.x, p1.x) / self.G)) + 1):
                        for gy in range(int(math.floor(min(p0.y, p1.y) / self.G)), int(math.floor(max(p0.y, p1.y) / self.G)) + 1): self.seg.setdefault((gx, gy), []).append((p0.x, p0.y, p1.x, p1.y))
                    nseg += 1
        self.nseg = nseg
    def covered(self, x, y):
        for inv, sd, cs, x0, x1, y0, y1 in self.bh.get((int(math.floor(x / self.G)), int(math.floor(y / self.G))), ()):
            if x0 - 1e-6 <= x <= x1 + 1e-6 and y0 - 1e-6 <= y <= y1 + 1e-6:
                l = inv @ Vector((x, y, self.top))
                if abs(l.x - sd['cx']) <= sd['hx'] + 1e-6 and abs(l.y - sd['cy']) <= sd['hy'] + 1e-6: return True
        return False
    def sdf(self, x, y):   # vorzeichenbehafteter Abstand zum äußeren Umriss (innen negativ)
        gx, gy = int(math.floor(x / self.G)), int(math.floor(y / self.G)); best = None
        for r in range(0, 6):
            for i in range(gx - r, gx + r + 1):
                for j in range(gy - r, gy + r + 1):
                    if r and max(abs(i - gx), abs(j - gy)) != r: continue
                    for x0, y0, x1, y1 in self.seg.get((i, j), ()):
                        dx, dy = x1 - x0, y1 - y0; L2 = dx * dx + dy * dy or 1e-12; t = max(0.0, min(1.0, ((x - x0) * dx + (y - y0) * dy) / L2))
                        d = math.hypot(x - x0 - t * dx, y - y0 - t * dy); best = d if best is None or d < best else best
            if best is not None and best <= r * self.G: break
        if best is None: best = 6 * self.G
        return -best if self.covered(x, y) else best
    @staticmethod
    def _nz(x, y): return math.sin(x * 1.13 + 0.7 * math.sin(y * 0.61)) * math.sin(y * 0.97 + 0.6 * math.sin(x * 0.53))
    def warp(self, x, y):
        a, b = self.p['warp']; s1, s2 = self.p['warp_scale']; return a * self._nz(x * s1, y * s1) + b * self._nz(x * s2 + 3.1, y * s2 - 1.7)
    def D(self, x, y):
        s = self.sdf(x, y) + self.warp(x, y); wi = self.p['w_in'] * self.strength(x, y); return _sm(-wi, self.p['w_out'], s)
    def outward(self, x, y, e=0.05):
        gx = self.sdf(x + e, y) - self.sdf(x - e, y); gy = self.sdf(x, y + e) - self.sdf(x, y - e); L = math.hypot(gx, gy) or 1; return gx / L, gy / L
    def earth(self, x, y):   # > 0 = Erde (Knetfleck-Rand als Sprenkel, nie Linie); innen (unter/zwischen Platten) immer Erde
        e = self.p['earth']; s = self.sdf(x, y) + self.warp(x, y); d = e['band'] - s
        cl = math.sin(x * 5.3 + 1.7 * math.sin(y * 2.1)) * math.sin(y * 4.7 + 1.3 * math.sin(x * 1.9)); k = max(0.0, 1 - abs(d) / e['sprinkle_width'])
        return d + k * 0.5 * (0.9 * cl + 0.25 * math.sin(x * 11.0 + y * 9.0))
    def ground_level(self, x, y, base=None):   # Vorschlag Geländehöhe: unter/zwischen den Stücken knapp unter der Oberkante, sinkt mit D; außen → base
        e = self.p['earth']; s = self.sdf(x, y); y_in = self.top + e['level_in'] - e['level_drop'] * self.D(x, y)
        if s <= 0 or base is None: return y_in
        return y_in + (base - y_in) * _sm(0.0, 1.3, s)
# ------------------------------------------------------------------ Stück-Mesh (Platte, Knet-Fase, Kachel-UV, Steinchen)
def _piece_mesh(name, poly, cx, cy, sd, fase, T, peb):
    rings = [(fase, 0.0), (fase * 0.38, -fase * 0.08), (fase * 0.08, -fase * 0.38), (0.0, -fase), (0.0, -T)] if fase > 0.004 else [(0.0, 0.0), (0.0, -T)]
    n = len(poly); verts = [(0.0, 0.0, 0.0)]; faces, uvs = [], []
    for ins, z in rings:
        for (x, y) in poly: L = math.hypot(x - cx, y - cy) or 1; s_ = max(0.0, L - ins) / L; verts.append(((x - cx) * s_, (y - cy) * s_, z))
    verts.append((0.0, 0.0, -T)); bot = len(verts) - 1; rg = lambda r, k: 1 + r * n + k % n
    uvt = lambda x, y: tuple(np.clip(np.array([x + cx, y + cy, 1.0]) @ sd['aff'], sd['umin'], sd['umax']))
    for k in range(n): faces.append((0, rg(0, k), rg(0, k + 1))); uvs.append([uvt(*verts[v][:2]) for v in faces[-1]])
    for r in range(len(rings) - 1):
        for k in range(n):
            fc = (rg(r, k), rg(r + 1, k), rg(r + 1, k + 1), rg(r, k + 1)); faces.append(fc); uvs.append([uvt(*verts[v][:2]) if (v <= 2 * n and fase > 0.004) else sd['side_uv'] for v in fc])
    for k in range(n): faces.append((bot, rg(len(rings) - 1, k + 1), rg(len(rings) - 1, k))); uvs.append([sd['side_uv']] * 3)
    for pb in peb:
        o0 = len(verts); verts += [(v[0] - cx, v[1] - cy, v[2] - sd['top']) for v in pb['v']]
        for fc, fu in zip(pb['f'], pb['uv']): faces.append(tuple(o0 + q for q in fc)); uvs.append(list(fu))
    me = bpy.data.meshes.new(name); me.from_pydata(verts, [], faces); me.update(); ul = me.uv_layers.new(name='UVMap').data
    for p, fu in zip(me.polygons, uvs):
        p.use_smooth = fase > 0.004 and abs(p.normal.z) < 0.95
        for li, u in zip(p.loop_indices, fu): ul[li].uv = u
    if sd['mat']: me.materials.append(sd['mat'])
    return me
# ------------------------------------------------------------------ free_end
def free_end(tiles, seed='free_end', strength=None, params=None, collection='kfb_edge_free_end', hide_source=True, group=None, story=None):
    """Randplatten an Ort und Stelle in Pfad-artige Stücke schneiden und von dicht (path_A) nach locker (path_D) verteilen. Rückgabe: Bericht + Feld."""
    P = params or load_params(); p = P['free_end']; field = EdgeField(tiles, P, strength); col = _coll(collection); A, Dd = p['path_stages']['A'], p['path_stages']['D']
    rep = {'tool': VERSION, 'seed': str(seed), 'tiles_in': len(tiles), 'tiles_cut': 0, 'pieces': 0, 'missing': 0, 'intact_rest': 0, 'objects': [], 'replaced': []}
    story = story or 'Die Platte bricht am freien Rand in Stücke, die sich wie ein alter Steinpfad zur Wiese hin auflösen (Verfall).'
    for ob in tiles:
        sd = slab_data(ob); M = ob.matrix_world; RS = M.to_3x3().to_4x4(); rn = _rng(f'{seed}:{ob.name}')
        W = lambda lx, ly: M @ Vector((lx, ly, sd['top']))
        if max(field.D(*W(sd['cx'] + u * sd['hx'], sd['cy'] + v * sd['hy']).xy) for u in (-1, -0.5, 0, 0.5, 1) for v in (-1, -0.5, 0, 0.5, 1)) < p['intact_below']: continue
        rep['tiles_cut'] += 1; rep['replaced'].append(ob.name); pts = []; th = p['intact_below']
        DL = lambda lx, ly: field.D(*W(lx, ly).xy)
        for _ in range(p['point_candidates']):
            lx, ly = sd['cx'] + rn.uniform(-sd['hx'], sd['hx']), sd['cy'] + rn.uniform(-sd['hy'], sd['hy']); d = field.D(*W(lx, ly).xy)
            if d < p['intact_below']: continue                                                 # Risspunkte nur im Bruchbereich; der heile Rest folgt der Isolinie
            md = A['diam'] + (Dd['diam'] - A['diam']) * _sm(p['stage_from'], p['stage_to'], d)
            if all(math.hypot(lx - px, ly - py) >= md * 0.5 + pm * 0.5 for px, py, pm in pts): pts.append((lx, ly, md))
        box = [(sd['cx'] - sd['hx'], sd['cy'] - sd['hy']), (sd['cx'] + sd['hx'], sd['cy'] - sd['hy']), (sd['cx'] + sd['hx'], sd['cy'] + sd['hy']), (sd['cx'] - sd['hx'], sd['cy'] + sd['hy'])]
        for i, (px, py, _) in enumerate(pts):
            poly = box
            for j, (qx, qy, _) in enumerate(pts):
                if i != j: poly = _clip(poly, qx - px, qy - py, (qx * qx + qy * qy - px * px - py * py) / 2)
            if len(poly) < 3: continue
            cx = sum(a[0] for a in poly) / len(poly); cy = sum(a[1] for a in poly) / len(poly); dc = DL(cx, cy); e_ = 0.05
            gx, gy = (DL(cx + e_, cy) - DL(cx - e_, cy)) / (2 * e_), (DL(cx, cy + e_) - DL(cx, cy - e_)) / (2 * e_)
            poly = _clip(poly, -gx, -gy, dc - th - 0.02 - gx * cx - gy * cy)                    # an der Isolinie zum heilen Rest abschneiden (Tangente)
            if len(poly) < 3: continue
            cx = sum(a[0] for a in poly) / len(poly); cy = sum(a[1] for a in poly) / len(poly); wp = W(cx, cy); d = field.D(wp.x, wp.y)
            mine = [pb for pb in sd['peb'] if _inside(poly, *pb['c'])]
            if rn.random() < max(0.0, (d - p['missing_from']) / (1 - p['missing_from'])) * p['missing_max']: rep['missing'] += 1; continue
            broken = d >= p['intact_below']
            if not broken: continue
            g = A['gap_side'] + (Dd['gap_side'] - A['gap_side']) * _sm(p['stage_from'], 1.0, d) ** 1.4
            P2 = [(cx + (a[0] - cx) * max(0.0, 1 - g / (math.hypot(a[0] - cx, a[1] - cy) or 1)), cy + (a[1] - cy) * max(0.0, 1 - g / (math.hypot(a[0] - cx, a[1] - cy) or 1))) for a in poly]
            P2 = _chaikin(P2, p['chaikin'])                                                   # erst die Grundform runden (Ecken wie Pfadsteine), dann leicht wellig
            Q = []
            for k in range(len(P2)):
                (x0, y0), (x1, y1) = P2[k], P2[(k + 1) % len(P2)]; L = math.hypot(x1 - x0, y1 - y0) or 1; nxv, nyv = (y1 - y0) / L, -(x1 - x0) / L
                ph = rn.uniform(0, 6.3); chip = (rn.uniform(0.3, 0.7), rn.uniform(0.02, 0.05)) if rn.random() < p['chip_prob'] else None
                for jj in range(2):
                    t = jj / 2; w = p['edge_wobble'] * 4 * L * math.sin(math.pi * t) * math.sin(6.3 * t + ph)
                    if chip and abs(t - chip[0]) < 0.15: w -= chip[1] * math.cos((t - chip[0]) / 0.15 * math.pi / 2) ** 2
                    Q.append((x0 + (x1 - x0) * t + nxv * w, y0 + (y1 - y0) * t + nyv * w))
            P2 = _chaikin(Q, 1)
            me = _piece_mesh(f'{ob.name}_stk_{i}', P2, cx, cy, sd, p['fase'], p['thickness'], mine); o = bpy.data.objects.new(me.name, me); col.objects.link(o)
            ox, oy = field.outward(wp.x, wp.y); sink = p['sink_max'] * d ** 1.3 * rn.uniform(0.7, 1.3); tilt = p['tilt_max_deg'] * d ** 1.5 * rn.uniform(0.3, 1.2)
            ax = Vector((-oy, ox, 0.0)); ax = ax.normalized() if ax.length > 1e-6 else Vector((1, 0, 0))          # oben × außen → Außenseite sinkt
            drift = p['drift_max'] * _sm(0.3, 1.0, d) ** 1.5 * rn.uniform(0.5, 1.2); j_ = p['jitter'] * d
            loc = wp + Vector((ox * drift + rn.uniform(-j_, j_), oy * drift + rn.uniform(-j_, j_), -sink))
            o.matrix_world = Matrix.Translation(loc) @ Matrix.Rotation(math.radians(tilt), 4, ax) @ Matrix.Rotation(math.radians(rn.uniform(-5, 5) * d), 4, 'Z') @ RS
            _props(o, 'edge_piece', 'ground', ob.get('kfb_palette_role', 'earth'), 3, story, 'free_end', ob.name, group or ob.get('kfb_group'),
                   {'kfb_edge_D': round(d, 3), 'kfb_edge_stage': 'A' if d < 0.4 else 'B' if d < 0.6 else 'C' if d < 0.8 else 'D'})
            rep['pieces'] += 1; rep['objects'].append(o.name)
        # heiler Rest: Platte bis zur weich geschwungenen Isolinie D = Schwelle (Raster + Schnitt je Quad), Bruchkante gerundet, Steinchen bleiben
        st = 0.08; nx_, ny_ = max(2, int(2 * sd['hx'] / st)), max(2, int(2 * sd['hy'] / st)); x0, y0 = sd['cx'] - sd['hx'], sd['cy'] - sd['hy']; sx, sy = 2 * sd['hx'] / nx_, 2 * sd['hy'] / ny_
        F = [[th - DL(x0 + i * sx, y0 + j * sy) for i in range(nx_ + 1)] for j in range(ny_ + 1)]; tv, tf = [], []
        for j in range(ny_):
            for i in range(nx_):
                c4 = [(i, j), (i + 1, j), (i + 1, j + 1), (i, j + 1)]
                if max(F[jj][ii] for ii, jj in c4) <= 0: continue
                pts4 = [(x0 + ii * sx, y0 + jj * sy, F[jj][ii]) for ii, jj in c4]; pol = []
                for k in range(4):
                    a_, b_ = pts4[k], pts4[(k + 1) % 4]
                    if a_[2] > 0: pol.append(a_)
                    if (a_[2] > 0) != (b_[2] > 0): t = a_[2] / (a_[2] - b_[2]); pol.append(tuple(a_[q] + (b_[q] - a_[q]) * t for q in range(3)))
                if len(pol) >= 3: b0 = len(tv); tv += [(x, y, 0.0) for x, y, _ in pol]; tf.append(tuple(range(b0, b0 + len(pol))))
        if tf:
            bm = bmesh.new(); vv = [bm.verts.new(v) for v in tv]
            for f in tf: bm.faces.new([vv[q] for q in f])
            bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5); uvl = bm.loops.layers.uv.new('UVMap')
            bnd = [e for e in bm.edges if e.is_boundary]
            ext = bmesh.ops.extrude_edge_only(bm, edges=bnd); nv = [g for g in ext['geom'] if isinstance(g, bmesh.types.BMVert)]
            for v in nv: v.co.z = -p['thickness']
            bmesh.ops.recalc_face_normals(bm, faces=list(bm.faces))
            inner_top = [e for e in bnd if not (abs(abs(e.verts[0].co.x - sd['cx']) - sd['hx']) < 1e-4 and abs(abs(e.verts[1].co.x - sd['cx']) - sd['hx']) < 1e-4)
                         and not (abs(abs(e.verts[0].co.y - sd['cy']) - sd['hy']) < 1e-4 and abs(abs(e.verts[1].co.y - sd['cy']) - sd['hy']) < 1e-4)]
            if inner_top: bmesh.ops.bevel(bm, geom=inner_top, offset=p['fase'] * 0.6, segments=2, profile=0.5, affect='EDGES', clamp_overlap=True)   # Bruchkante des Rests gerundet
            for f in bm.faces:
                top = f.normal.z > 0.5
                for l in f.loops: l[uvl].uv = tuple(np.clip(np.array([l.vert.co.x, l.vert.co.y, 1.0]) @ sd['aff'], sd['umin'], sd['umax'])) if top else sd['side_uv']
            for pb in [pb for pb in sd['peb'] if DL(*pb['c']) < th - 0.03]:                      # Steinchen der Kachel bleiben auf dem Rest
                vs = [bm.verts.new((v[0], v[1], v[2] - sd['top'])) for v in pb['v']]
                for fc, fu in zip(pb['f'], pb['uv']):
                    try: f = bm.faces.new([vs[q] for q in fc])
                    except ValueError: continue
                    for l, u in zip(f.loops, fu): l[uvl].uv = u
            me = bpy.data.meshes.new(f'{ob.name}_heil'); bm.to_mesh(me); bm.free()
            for pg in me.polygons: pg.use_smooth = abs(pg.normal.z) < 0.5
            if sd['mat'] and not me.materials: me.materials.append(sd['mat'])
            o = bpy.data.objects.new(me.name, me); col.objects.link(o); o.matrix_world = M @ Matrix.Translation((0, 0, sd['top']))
            _props(o, 'edge_piece', 'ground', ob.get('kfb_palette_role', 'earth'), 2, 'Heiler Rest der Randplatte bis zur Bruchlinie (Schnitt aus derselben Platte).', 'free_end_rest', ob.name, group or ob.get('kfb_group'))
            rep['intact_rest'] += 1; rep['objects'].append(o.name)
        if hide_source: ob.hide_render = True; ob.hide_set(True); ob['kfb_edge_replaced'] = 'free_end'
    rep['params'] = p; rep['field'] = field; return rep
# ------------------------------------------------------------------ Wand-Daten
def _wall_data(wall):
    me = wall.data; uvl = me.uv_layers.active.data; vs = [v.co for v in me.vertices]
    lo = Vector([min(v[i] for v in vs) for i in range(3)]); hi = Vector([max(v[i] for v in vs) for i in range(3)])
    def uv_of(nrm):
        f = max((pg for pg in me.polygons), key=lambda pg: pg.normal.dot(nrm) * pg.area); return tuple(np.mean([list(uvl[li].uv) for li in f.loop_indices], 0))
    return dict(lo=lo, hi=hi, L=hi.x - lo.x, T=hi.y - lo.y, H=hi.z - lo.z, uv_end=uv_of(Vector((1, 0, 0))), uv_top=uv_of(Vector((0, 0, 1))), uv_side=uv_of(Vector((0, -1, 0))), mat=me.materials[0] if me.materials else None)
def _const_uv(me, uv):
    ul = me.uv_layers.get('UVMap') or me.uv_layers.new(name='UVMap')
    for l in ul.data: l.uv = uv
def _rounded_block(name, size, r, seg, mat, uv):
    bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0); bmesh.ops.scale(bm, vec=size, verts=bm.verts)
    bmesh.ops.bevel(bm, geom=list(bm.edges), offset=min(r, min(size) * 0.49), segments=seg, profile=0.5, affect='EDGES', clamp_overlap=True)
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    for p in me.polygons: p.use_smooth = True
    _const_uv(me, uv)
    if mat: me.materials.append(mat)
    return me
def _chunk(name, r, rn, mat, uv, P):
    n = rn.randint(5, 7); a0 = rn.uniform(0, 6.3); pts = [(r * rn.uniform(0.75, 1.15) * math.cos(a0 + 2 * math.pi * k / n + rn.uniform(-0.25, 0.25)), r * rn.uniform(0.75, 1.15) * math.sin(a0 + 2 * math.pi * k / n + rn.uniform(-0.25, 0.25))) for k in range(n)]
    pts = _chaikin(pts, 2); T = r * P['rubble']['thickness_of_r']; f = T * 0.3; m = len(pts)
    rings = [(f, 0.0), (f * 0.4, -f * 0.1), (0.0, -f), (0.0, -T)]; verts = [(0.0, 0.0, 0.0)]; faces = []
    for ins, z in rings:
        for x, y in pts: L = math.hypot(x, y) or 1; s = max(0.0, L - ins) / L; verts.append((x * s, y * s, z))
    verts.append((0.0, 0.0, -T)); bot = len(verts) - 1; rg = lambda rr, k: 1 + rr * m + k % m
    faces += [(0, rg(0, k), rg(0, k + 1)) for k in range(m)] + [(rg(rr, k), rg(rr + 1, k), rg(rr + 1, k + 1), rg(rr, k + 1)) for rr in range(len(rings) - 1) for k in range(m)] + [(bot, rg(len(rings) - 1, k + 1), rg(len(rings) - 1, k)) for k in range(m)]
    me = bpy.data.meshes.new(name); me.from_pydata(verts, [], faces); me.update()
    for p in me.polygons: p.use_smooth = abs(p.normal.z) < 0.95
    _const_uv(me, uv)
    if mat: me.materials.append(mat)
    return me, T
def rubble_nest(center, ground_z, count, R, hang, mat, uv, seed, collection, source, params=None, story='Rubbel aus demselben Material, gehäuft am Fuß (Verfall).'):
    """Rubbel-Nest über kfb_env.nest_ok (gehäuft, nie aufgereiht), Stücke aus demselben Material (konstante UV aus dem Bauteil). center = (x, y) Welt."""
    P = params or load_params(); rn = _rng(seed); col = _coll(collection); out = []
    G = kfb_env.nest_ok([center[0], center[1]], count=count, R=R, seed=zlib.crc32(str(seed).encode()) % 100000, hang=hang)
    for k, it in enumerate(G):
        r = it['r']; me, T = _chunk(f'{source}_rubbel_{seed}_{k}', r, rn, mat, uv, P); o = bpy.data.objects.new(me.name, me); col.objects.link(o)
        gz = ground_z(it['c'][0], it['c'][1]) if callable(ground_z) else ground_z; sk = rn.uniform(*P['rubble']['sink_frac'])
        o.matrix_world = Matrix.Translation((it['c'][0], it['c'][1], gz + T * (1 - sk))) @ Matrix.Rotation(rn.uniform(-0.25, 0.25), 4, Vector((rn.random(), rn.random(), 0)).normalized()) @ Matrix.Rotation(rn.uniform(0, 6.3), 4, 'Z')
        _props(o, 'contact', 'stone', 'stone', 3, story, 'rubble', source, extra={'kfb_nest_role': it['role']}); out.append(o.name)
    return {'rule_ok': kfb_env.rule_report(G)['ok'], 'objects': out}
# ------------------------------------------------------------------ built_end
def built_end(target, cap_kind='wall_head', end=1, seed='built_end', params=None, collection='kfb_edge_built_end', ground_z=0.0, edge=None, outward=None, ref=None):
    """Gebautes Ende. cap_kind 'wall_head' | 'mauerende' (target = Wand-Objekt, end = +1/−1 entlang lokal x): gerundete Kappe aus dem Wandmaterial + kleines Rubbel.
    cap_kind 'kantenstein' | 'bordsteinkopf' (edge = ((x0, y0), (x1, y1)) Welt, outward = (nx, ny), ref = Platte fürs Material): gerundete Steinreihe am Rand."""
    P = params or load_params(); B = P['built_end']; col = _coll(collection); rn = _rng(seed); rep = {'tool': VERSION, 'kind': cap_kind, 'objects': []}
    if cap_kind in ('wall_head', 'mauerende'):
        wd = _wall_data(target); c = B['wall_head']; M = target.matrix_world; xe = wd['hi'].x if end > 0 else wd['lo'].x
        size = (wd['T'] * c['len_of_T'], wd['T'] * c['wide_of_T'], wd['H'] * c['high_of_H'])
        me = _rounded_block(f'{target.name}_kappe', size, wd['T'] * c['round_of_T'], c['segments'], wd['mat'], wd['uv_side']); o = bpy.data.objects.new(me.name, me); col.objects.link(o)
        o.matrix_world = M @ Matrix.Translation((xe + end * size[0] * 0.15, (wd['lo'].y + wd['hi'].y) / 2, wd['lo'].z + size[2] / 2))
        _props(o, 'building', 'stone', target.get('kfb_palette_role', 'stone'), 2, 'Gebautes Mauerende: gerundeter Wandkopf aus demselben Stein (hier endet die Mauer absichtlich).', 'built_end', target.name, target.get('kfb_group'))
        rep['objects'].append(o.name); foot = M @ Vector((xe + end * wd['T'] * 0.9, (wd['lo'].y + wd['hi'].y) / 2 + wd['T'] * 0.6, wd['lo'].z))
        rb = rubble_nest((foot.x, foot.y), ground_z, B['rubble']['count'], B['rubble']['R'] * max(1.0, wd['H'] / 1.5), math.atan2(*(M.to_3x3() @ Vector((end, 0, 0))).yx), wd['mat'], wd['uv_side'], f'{seed}:rb', collection, target.name, P)
        rep['objects'] += rb['objects']; rep['rubble_rule_ok'] = rb['rule_ok']
    elif cap_kind in ('kantenstein', 'bordsteinkopf'):
        sd = slab_data(ref); c = B['kantenstein']; (x0, y0), (x1, y1) = edge; L = math.hypot(x1 - x0, y1 - y0); tx, ty = (x1 - x0) / L, (y1 - y0) / L; nx, ny = outward
        n = max(1, int(L / (c['len'] + c['gap']))); seg = L / n; topz = (ref.matrix_world @ Vector((0, 0, sd['top']))).z
        for k in range(n):
            ln = seg - c['gap'] * rn.uniform(0.6, 1.4); me = _rounded_block(f'{ref.name}_kante_{k}', (ln, c['wide'], c['high'] + c['sink']), c['round'], c['segments'], sd['mat'], sd['side_uv'])
            o = bpy.data.objects.new(me.name, me); col.objects.link(o); cx, cy = x0 + tx * seg * (k + 0.5) + nx * c['wide'] / 2, y0 + ty * seg * (k + 0.5) + ny * c['wide'] / 2
            o.matrix_world = Matrix.Translation((cx, cy, topz + c['high'] - (c['high'] + c['sink']) / 2 - c['sink'] * 0.5)) @ Matrix.Rotation(math.atan2(ty, tx) + math.radians(rn.uniform(-1.5, 1.5)), 4, 'Z')
            _props(o, 'building', 'stone', ref.get('kfb_palette_role', 'earth'), 2, 'Gebaute Kante: gerundeter Kantenstein aus dem Plattenmaterial (hier wurde bis zur Grenze gebaut).', 'built_end', ref.name, ref.get('kfb_group'))
            rep['objects'].append(o.name)
    else: raise ValueError(f'kfb_edge_bpy.built_end: unbekannte Kappe {cap_kind!r}')
    return rep
# ------------------------------------------------------------------ ruin_end
def ruin_end(wall, end=1, seed='ruin_end', params=None, collection='kfb_edge_ruin_end', ground_z=0.0, hide_source=True):
    """Ruinen-Ende: abgeleitete Kopie der Wand, zum Ende hin bis auf einen Sockel abgetragen; darauf treppig fallende, gerundete Mauerbrocken aus demselben Stein
    (abgebrochene, vom Wetter gerundete Krone) + Rubbel-Nester am Fuß. Original bleibt unverändert und wird nur ausgeblendet."""
    P = params or load_params(); c = P['ruin_end']; col = _coll(collection); rn = _rng(seed); wd = _wall_data(wall); M = wall.matrix_world
    me = wall.data.copy(); me.name = f'{wall.name}_ruine'; ob = bpy.data.objects.new(me.name, me); col.objects.link(ob); ob.matrix_world = M.copy()
    H, T = wd['H'], wd['T']; xe = wd['hi'].x if end > 0 else wd['lo'].x; Lb = min(c['break_len_of_H'] * H, 0.8 * wd['L']); xb = xe - end * Lb; z0 = wd['lo'].z
    hmin = z0 + c['keep_min_of_H'] * H; yc = (wd['lo'].y + wd['hi'].y) / 2
    bm = bmesh.new(); bm.from_mesh(me); uv = bm.loops.layers.uv.active
    bmesh.ops.bisect_plane(bm, geom=list(bm.verts) + list(bm.edges) + list(bm.faces), plane_co=(xb, 0, 0), plane_no=(end, 0, 0), clear_outer=True)   # jenseits xb weg
    new = bmesh.ops.holes_fill(bm, edges=[e for e in bm.edges if e.is_boundary], sides=0)['faces']; bmesh.ops.recalc_face_normals(bm, faces=list(bm.faces))
    for f in new:
        for l in f.loops: l[uv].uv = wd['uv_side']
    bm.to_mesh(me); bm.free()
    for p in me.polygons: p.use_smooth = False
    _props(ob, 'building', 'stone', wall.get('kfb_palette_role', 'stone'), 3, 'Ruinen-Ende: Die Mauer ist zum Ende hin abgebrochen; Sockel bleibt, darauf treppig fallende, gerundete Brocken (Verfall).', 'ruin_end', wall.name, wall.get('kfb_group'))
    rep = {'tool': VERSION, 'objects': [ob.name], 'blocks': 0, 'nests': []}
    fuss = (Lb + T * 0.3, T * 1.06, hmin - z0 + T * 0.12)                                              # Mauerfuß: flacher, gerundeter Block bis zum Ende
    fm = _rounded_block(f'{wall.name}_fuss', fuss, T * 0.22, 3, wd['mat'], wd['uv_side']); fo = bpy.data.objects.new(fm.name, fm); col.objects.link(fo)
    fo.matrix_world = M @ Matrix.Translation((xb + end * (Lb - T * 0.3) / 2, yc, z0 - T * 0.12 + fuss[2] / 2)) @ Matrix.Rotation(math.radians(rn.uniform(-1.5, 1.5)), 4, 'Z')
    _props(fo, 'building', 'stone', wall.get('kfb_palette_role', 'stone'), 3, 'Stehengebliebener Mauerfuß der Ruine, gerundet.', 'ruin_end', wall.name, wall.get('kfb_group')); rep_f = fo.name
    nst = rn.randint(*c['steps']); x = xb - end * T * 0.2; k = 0
    while k < nst:                                                                                     # Krone: Mauerwerk in Lagen, treppig zum Ende fallend
        t = (k + 0.5) / nst; ln = Lb / nst * rn.uniform(0.7, 1.4); top = hmin + (wd['hi'].z - hmin) * (1 - t) ** 1.3 * rn.uniform(0.8, 1.05)
        if top - hmin < 0.08 * H: break
        nl = max(1, min(3, int((top - hmin) / (0.3 * H) + 0.5))); zb = hmin - T * 0.1                     # 1–3 Lagen, je Lage ein gerundeter Brocken
        for lay in range(nl):
            hh = (top - hmin) / nl * rn.uniform(0.9, 1.1); lw = ln * (1 - 0.18 * lay) * rn.uniform(0.85, 1.05)
            size = (lw, T * rn.uniform(0.88, 1.0), hh + T * 0.1)
            bme = _rounded_block(f'{wall.name}_brocken_{k}_{lay}', size, T * rn.uniform(0.18, 0.3), 3, wd['mat'], wd['uv_side']); b = bpy.data.objects.new(bme.name, bme); col.objects.link(b)
            cxl = x + end * (lw / 2 + rn.uniform(-0.08, 0.05) * ln * lay)
            b.matrix_world = M @ Matrix.Translation((cxl, yc + rn.uniform(-0.06, 0.06) * T, zb + size[2] / 2)) @ Matrix.Rotation(math.radians(rn.uniform(-5, 5)), 4, 'Z') @ Matrix.Rotation(math.radians(rn.uniform(-4, 4)), 4, 'X') @ Matrix.Rotation(math.radians(rn.uniform(-3, 3)), 4, 'Y')
            _props(b, 'building', 'stone', wall.get('kfb_palette_role', 'stone'), 3, 'Brocken der abgebrochenen Mauerkrone, vom Wetter gerundet.', 'ruin_end', wall.name, wall.get('kfb_group'))
            rep['objects'].append(b.name); rep['blocks'] += 1; zb += hh * 0.97
        x += end * ln * rn.uniform(0.9, 1.0); k += 1
    rep['objects'].append(rep_f)
    hang = math.atan2(*(M.to_3x3() @ Vector((end, 0, 0))).yx)
    for k in range(c['rubble']['nests']):
        lx = xe - end * Lb * rn.uniform(0.0, 0.6); side = rn.choice((-1, 1)); foot = M @ Vector((lx + end * T * 0.6, yc + side * T * rn.uniform(0.9, 1.4), z0))
        rb = rubble_nest((foot.x, foot.y), ground_z, rn.choice(c['rubble']['count']), c['rubble']['R'] * max(1.0, H / 1.5), hang, wd['mat'], wd['uv_side'], f'{seed}:n{k}', collection, wall.name, P)
        rep['objects'] += rb['objects']; rep['nests'].append(rb['rule_ok'])
    if hide_source: wall.hide_render = True; wall.hide_set(True); wall['kfb_edge_replaced'] = 'ruin_end'
    return rep
