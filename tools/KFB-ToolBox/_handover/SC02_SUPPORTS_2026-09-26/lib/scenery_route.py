"""Shared route stand-in for scenery shells (SC01, SC02, ...) · Claude Coworker 26.09.2026
Same shape the Track Core (W0) is expected to deliver: arc-length samples with a heading + bank frame.
Runtime coords: x right, y up, z forward. Replace `make_samples` input with the core stream later; consumers only use Route.
Pure maths (mathutils only), no bpy."""
import math
from mathutils import Vector, kdtree


def make_samples(pts, deck_half, bank=None):
    """pts: list of Vector centre points (road surface). bank: None, a number, or fn(s, i, kappa) -> radians (+ raises the right edge)."""
    out, s = [], 0.0
    n = len(pts)
    for i, p in enumerate(pts):
        if i:
            s += (p - pts[i - 1]).length
        T = (pts[min(i + 1, n - 1)] - pts[max(i - 1, 0)]).normalized()
        R = Vector((0, 1, 0)).cross(T).normalized()          # flat heading-right
        out.append(dict(s=s, p=p.copy(), T=T, R0=R, deck_half=deck_half(s) if callable(deck_half) else deck_half))
    for i, q in enumerate(out):                              # signed horizontal curvature (+ = turning right)
        a, b = out[max(i - 1, 0)], out[min(i + 1, n - 1)]
        ds = max(1e-6, b['s'] - a['s'])
        q['kappa'] = (b['T'] - a['T']).dot(q['R0']) / ds
    for i, q in enumerate(out):
        bnk = bank(q['s'], i, q['kappa']) if callable(bank) else (bank or 0.0)
        T, R = q['T'], q['R0']
        if bnk:
            R = (R * math.cos(bnk) + T.cross(R) * math.sin(bnk)).normalized()
        q['R'] = R
        q['U'] = T.cross(R).normalized()
        q['bank'] = bnk
    return out


def smooth(vals, win):
    out = []
    for i in range(len(vals)):
        a, b = max(0, i - win), min(len(vals), i + win + 1)
        out.append(sum(vals[a:b]) / (b - a))
    return out


class Route:
    def __init__(self, samples, name='route', corridor_h=6.5):
        self.S, self.name, self.corridor_h = samples, name, corridor_h
        self.L = samples[-1]['s']
        self.kd = kdtree.KDTree(len(samples))
        for i, q in enumerate(samples):
            self.kd.insert(q['p'], i)
        self.kd.balance()

    def at(self, s):
        s = max(0.0, min(self.L, s))
        lo, hi = 0, len(self.S) - 1
        while hi - lo > 1:
            mid = (lo + hi) // 2
            if self.S[mid]['s'] <= s:
                lo = mid
            else:
                hi = mid
        a, b = self.S[lo], self.S[hi]
        t = 0.0 if b['s'] == a['s'] else (s - a['s']) / (b['s'] - a['s'])
        lerp = lambda u, v: u * (1 - t) + v * t
        T = lerp(a['T'], b['T']).normalized()
        R = lerp(a['R'], b['R'])
        R = (R - T * R.dot(T)).normalized()
        return dict(s=s, p=lerp(a['p'], b['p']), T=T, R=R, U=T.cross(R).normalized(),
                    deck_half=lerp(a['deck_half'], b['deck_half']), bank=lerp(a['bank'], b['bank']))

    def flat(self, s):
        f = self.at(s)
        T = Vector((f['T'].x, 0.0, f['T'].z)).normalized()
        R = Vector((0, 1, 0)).cross(T).normalized()
        return dict(f, T=T, R=R, U=Vector((0, 1, 0)))

    def local(self, v, s_hint=None, window=None):
        """Projection of a runtime point to (s, x, y, deck_half). With s_hint + window: search only that s-range
        (branch-safe at crossings / self-overlap). Nearest sample, then linear refinement along T."""
        if s_hint is None:
            _, i, _ = self.kd.find(v)
        else:
            best, i = 1e18, 0
            for j, q in enumerate(self.S):
                if abs(q['s'] - s_hint) <= window:
                    d = (q['p'] - v).length_squared
                    if d < best:
                        best, i = d, j
        q = self.S[i]
        d = v - q['p']
        return q['s'] + d.dot(q['T']), d.dot(q['R']), d.dot(q['U']), q['deck_half']

    def horizontal_hits(self, v, pad, s_skip=None, skip_win=0.0):
        """All samples whose horizontal distance across the route (|x| in the flat frame) is within deck_half + pad
        of v (x/z only, any height). Used for keep-out zones on the ground under/around a route."""
        hits = []
        for q in self.S[::2]:
            if s_skip is not None and abs(q['s'] - s_skip) < skip_win:
                continue
            d = v - q['p']
            dh = Vector((d.x, 0.0, d.z))
            Th = Vector((q['T'].x, 0.0, q['T'].z)).normalized()
            along = dh.dot(Th)
            if abs(along) > 1.0:
                continue
            across = (dh - Th * along).length
            if across <= q['deck_half'] + pad:
                hits.append(q['s'])
        return hits
