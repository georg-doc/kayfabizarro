"""KFB Prison Maze graph generator (Step B).

The maze graph JSON is the source of truth. Blender (and later the game runtime) only build geometry from it.

Two layouts on the same island footprint (island-local metres, Z up, island centre at the origin):
  * square: orthogonal grid, cells outside the walkable disk dropped, a central courtyard reserved for the tower;
  * polar:  rings of sectors around the same courtyard (ring/spoke maze).

Every maze is a perfect maze (recursive backtracker, one route between any two cells), seeded and repeatable.
One gate opens to the outside (south); the courtyard passage is placed where the escape route is longest.

Usage: python3 kfb_prison_maze_graph.py OUT.json
"""
import json, math, random, sys

PARAMS = {
    'walkableRadius': 9.4,     # metres; the rock rim of the Port candidate starts at about 10
    'courtyardRadius': 3.0,    # tower courtyard (Pirate watch tower base is 3.2 m wide)
    'pitch': 2.1,              # cell pitch: 1.5 m corridor + 0.6 m wall
    'wall': {'height': 1.6, 'thickness': 0.6, 'bevel': 0.18},
    'gateAngleDeg': -90.0,     # outside gate points to -Y (south)
    'seeds': [1, 2, 3],
    'polarSectors': [12, 18, 24],
    'polarRotationDeg': -7.5,  # turns the rings so an outer cell is centred on the gate (v2)
}


def backtracker(cells, nbrs, start, rng):
    """Return the set of open edges (frozenset of two cell ids) of a perfect maze."""
    seen = {start}; stack = [start]; open_ = set()
    while stack:
        c = stack[-1]
        cand = [n for n in nbrs[c] if n not in seen]
        if not cand:
            stack.pop(); continue
        n = rng.choice(cand)
        open_.add(frozenset((c, n))); seen.add(n); stack.append(n)
    assert len(seen) == len(cells), 'maze graph is not connected'
    return open_


def farthest(open_, start, candidates):
    """Candidate cell with the longest route from start (ties broken by name)."""
    adj = {}
    for e in open_:
        a, b = tuple(e); adj.setdefault(a, []).append(b); adj.setdefault(b, []).append(a)
    dist = {start: 0}; q = [start]
    while q:
        c = q.pop(0)
        for n in adj.get(c, []):
            if n not in dist:
                dist[n] = dist[c] + 1; q.append(n)
    return max(sorted(candidates), key=lambda c: dist.get(c, -1))


def square(seed, P):
    p, R, Rc = P['pitch'], P['walkableRadius'], P['courtyardRadius']
    n = int(2 * R // p) | 1                      # odd count so a cell sits on the centre
    h = n // 2
    cells = {}
    for i in range(n):
        for j in range(n):
            x, y = (i - h) * p, (j - h) * p
            far = max(math.hypot(x + sx * p / 2, y + sy * p / 2) for sx in (-1, 1) for sy in (-1, 1))
            if far > R + 0.35 * p:               # cell corners must stay on the walkable disk
                continue
            if max(abs(x), abs(y)) < Rc:         # courtyard
                continue
            cells[f's{i}_{j}'] = {'i': i, 'j': j, 'x': round(x, 4), 'y': round(y, 4)}
    nbrs = {c: [] for c in cells}
    for c, v in cells.items():
        for di, dj in ((1, 0), (0, 1)):
            o = f's{v["i"] + di}_{v["j"] + dj}'
            if o in cells:
                nbrs[c].append(o); nbrs[o].append(c)
    rng = random.Random(seed)
    start = sorted(cells)[0]
    open_ = backtracker(cells, nbrs, start, rng)
    # courtyard link: inner-ring cells touching the courtyard square; gate: outer cells facing the gate direction
    def court_side(c):
        v = cells[c]
        return [(di, dj) for di, dj in ((1, 0), (-1, 0), (0, 1), (0, -1))
                if f's{v["i"] + di}_{v["j"] + dj}' not in cells and max(abs(v['x'] + di * p), abs(v['y'] + dj * p)) < Rc]
    inner = [c for c in cells if court_side(c)]
    gdir = math.radians(P['gateAngleDeg']); gx, gy = math.cos(gdir), math.sin(gdir)
    outer = [c for c in cells if any(f's{cells[c]["i"] + di}_{cells[c]["j"] + dj}' not in cells
                                      for di, dj in ((1, 0), (-1, 0), (0, 1), (0, -1)))]
    gate_cell = max(sorted(outer), key=lambda c: (round(cells[c]['x'] * gx + cells[c]['y'] * gy, 6), -abs(cells[c]['x'] * gy - cells[c]['y'] * gx)))
    court_cell = farthest(open_, gate_cell, inner)          # longest escape route from the courtyard to the gate
    # walls: every cell side that is not an open passage
    walls = []; half = p / 2
    sides = {(1, 0): ((half, -half), (half, half)), (-1, 0): ((-half, -half), (-half, half)),
             (0, 1): ((-half, half), (half, half)), (0, -1): ((-half, -half), (half, -half))}
    done = set()
    for c, v in cells.items():
        for (di, dj), (a, b) in sides.items():
            o = f's{v["i"] + di}_{v["j"] + dj}'
            key = frozenset((c, o))
            if key in done:
                continue
            done.add(key)
            if o in cells and key in open_:
                continue
            kind = 'inner' if o in cells else 'boundary'
            # openings: courtyard link and gate
            if kind == 'boundary':
                if c == gate_cell and (di * gx + dj * gy) > 0.7:
                    kind = 'gate'
                elif c == court_cell and (di, dj) == court_side(c)[0]:
                    kind = 'courtyardLink'
            if kind in ('gate', 'courtyardLink'):
                continue
            walls.append({'type': 'line', 'kind': kind,
                          'a': [round(v['x'] + a[0], 4), round(v['y'] + a[1], 4)],
                          'b': [round(v['x'] + b[0], 4), round(v['y'] + b[1], 4)]})
    return {'layout': 'square', 'seed': seed, 'cells': cells, 'open': sorted(sorted(e) for e in open_),
            'courtyardCell': court_cell, 'gateCell': gate_cell, 'walls': walls}


def polar(seed, P):
    Rc, R, sectors = P['courtyardRadius'], P['walkableRadius'], P['polarSectors']
    rings = len(sectors); dr = (R - Rc) / rings
    cells = {}
    for k, ns in enumerate(sectors):
        for s in range(ns):
            rot = math.radians(P.get('polarRotationDeg', 0.0))
            t0, t1 = 2 * math.pi * s / ns + rot, 2 * math.pi * (s + 1) / ns + rot
            cells[f'p{k}_{s}'] = {'ring': k, 'sector': s, 'r0': round(Rc + k * dr, 4), 'r1': round(Rc + (k + 1) * dr, 4),
                                  't0': round(t0, 6), 't1': round(t1, 6)}
    nbrs = {c: [] for c in cells}
    def link(a, b):
        nbrs[a].append(b); nbrs[b].append(a)
    for k, ns in enumerate(sectors):
        for s in range(ns):
            link(f'p{k}_{s}', f'p{k}_{(s + 1) % ns}')          # around the ring
            if k + 1 < rings:                                   # outward: angular overlap
                for s2 in range(sectors[k + 1]):
                    a0, a1 = cells[f'p{k}_{s}']['t0'], cells[f'p{k}_{s}']['t1']
                    b0, b1 = cells[f'p{k + 1}_{s2}']['t0'], cells[f'p{k + 1}_{s2}']['t1']
                    if min(a1, b1) - max(a0, b0) > 1e-6:
                        link(f'p{k}_{s}', f'p{k + 1}_{s2}')
    rng = random.Random(seed)
    open_ = backtracker(cells, nbrs, 'p0_0', rng)
    gdir = math.radians(P['gateAngleDeg']) % (2 * math.pi)
    def angdist(a, b):
        return abs((a - b + math.pi) % (2 * math.pi) - math.pi)
    gate_cell = min((c for c, v in cells.items() if v['ring'] == rings - 1),
                    key=lambda c: angdist((cells[c]['t0'] + cells[c]['t1']) / 2, gdir))
    court_cell = farthest(open_, gate_cell, [f'p0_{s}' for s in range(sectors[0])])
    walls = []
    # arcs: inner edge of each cell (courtyard boundary for ring 0) + outer boundary of last ring
    for c, v in cells.items():
        k = v['ring']
        if k == 0:
            if c != court_cell:
                walls.append({'type': 'arc', 'kind': 'boundary', 'r': v['r0'], 't0': v['t0'], 't1': v['t1']})
        else:
            # split the inner edge where it meets several inner cells; open only the shared part of an open passage
            for c2, v2 in cells.items():
                if v2['ring'] != k - 1:
                    continue
                lo, hi = max(v['t0'], v2['t0']), min(v['t1'], v2['t1'])
                if hi - lo > 1e-6 and frozenset((c, c2)) not in open_:
                    walls.append({'type': 'arc', 'kind': 'inner', 'r': v['r0'], 't0': round(lo, 6), 't1': round(hi, 6)})
        if k == rings - 1 and c != gate_cell:
            walls.append({'type': 'arc', 'kind': 'boundary', 'r': v['r1'], 't0': v['t0'], 't1': v['t1']})
        # radial wall on the t1 side
        ns = sectors[k]; o = f'p{k}_{(v["sector"] + 1) % ns}'
        if frozenset((c, o)) not in open_:
            walls.append({'type': 'radial', 'kind': 'inner', 't': v['t1'], 'r0': v['r0'], 'r1': v['r1']})
    return {'layout': 'polar', 'seed': seed, 'cells': cells, 'open': sorted(sorted(e) for e in open_),
            'courtyardCell': court_cell, 'gateCell': gate_cell, 'walls': walls}


def check(m):
    """Connectivity from the courtyard cell to the gate cell through open passages, and the route length."""
    adj = {}
    for a, b in m['open']:
        adj.setdefault(a, []).append(b); adj.setdefault(b, []).append(a)
    prev = {m['courtyardCell']: None}; q = [m['courtyardCell']]
    while q:
        c = q.pop(0)
        for n in adj.get(c, []):
            if n not in prev:
                prev[n] = c; q.append(n)
    route = []; c = m['gateCell']
    while c is not None:
        route.append(c); c = prev.get(c)
    return {'cells': len(m['cells']), 'reachable': len(prev), 'routeCells': len(route), 'walls': len(m['walls'])}


def main(out):
    P = PARAMS
    mazes = []
    for seed in P['seeds']:
        for m in (square(seed, P), polar(seed, P)):
            m['check'] = check(m); mazes.append(m)
    doc = {'schema': 'kfb.prison-maze-graph/1', 'version': 2, 'date': '2026-10-10',
           'space': 'island-local metres, Z up, island centre at the origin, main ground at z = 0 (Port candidate)',
           'params': P, 'mazes': mazes,
           'note': 'perfect mazes (one route); walls of kind inner/boundary; gate and courtyard link are openings, not walls. v2: the gate opening is centred on the gate direction in both layouts (one bridge socket for both).'}
    json.dump(doc, open(out, 'w'), indent=1)
    for m in mazes:
        print(m['layout'], m['seed'], m['check'], m['courtyardCell'], m['gateCell'])


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'prison_maze_graph.json')
