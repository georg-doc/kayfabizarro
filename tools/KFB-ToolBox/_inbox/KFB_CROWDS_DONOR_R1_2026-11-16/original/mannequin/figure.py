# The fields of Patch's 1.8 m scale figure, as the web app's scale-figure.blender.py builds them (Patch, CC0): every
# shell and joint as a signed distance field on a 2 mm grid. build.blender.py runs this with each part kept apart.
# ------------------------------------------------------------- field basics
# Z up, metres, feet on z = 0, facing -Y. Wearer's left is +X.
LO = np.array([-0.36, -0.26, -0.01])
HI = np.array([0.36, 0.17, 1.83])
N = np.ceil((HI - LO) / VS).astype(int) + 1


def grid(lo, hi):
    i0 = np.clip(np.floor((np.asarray(lo) - LO) / VS).astype(int), 0, N - 1)
    i1 = np.clip(np.ceil((np.asarray(hi) - LO) / VS).astype(int) + 1, 1, N)
    sl = tuple(slice(a, b) for a, b in zip(i0, i1))
    xs = [(LO[d] + VS * np.arange(i0[d], i1[d])).astype(np.float32) for d in range(3)]
    return sl, np.stack(np.meshgrid(*xs, indexing="ij"), axis=-1)


def smin(a, b, k):
    if k <= 0:
        return np.minimum(a, b)
    h = np.clip(0.5 + 0.5 * (b - a) / k, 0, 1)
    return b + (a - b) * h - k * h * (1 - h)


def smax(a, b, k):
    return -smin(-a, -b, k)


def unit(v):
    v = np.asarray(v, float)
    return v / np.linalg.norm(v)


def frame(axis, ref=(1, 0, 0)):
    """Rows: local x, local y, local z (= axis)."""
    z = unit(axis)
    r = np.asarray(ref, float)
    if abs(r.dot(z)) > 0.99:
        r = np.array([0.0, 1.0, 0.0])
    x = unit(r - r.dot(z) * z)
    return np.stack([x, np.cross(z, x), z]).astype(np.float32)


def rot(rx=0, ry=0, rz=0):
    rx, ry, rz = (math.radians(a) for a in (rx, ry, rz))
    cx, sx, cy, sy, cz, sz = math.cos(rx), math.sin(rx), math.cos(ry), math.sin(ry), math.cos(rz), math.sin(rz)
    Rx = np.array([[1, 0, 0], [0, cx, -sx], [0, sx, cx]])
    Ry = np.array([[cy, 0, sy], [0, 1, 0], [-sy, 0, cy]])
    Rz = np.array([[cz, -sz, 0], [sz, cz, 0], [0, 0, 1]])
    return (Rz @ Ry @ Rx).T.astype(np.float32)


# Primitives: each returns a function of P (points) -> signed distance.
def ell(c, r, R=None):
    c = np.asarray(c, np.float32)
    r = np.asarray(r, np.float32)
    def d(P):
        q = P - c
        if R is not None:
            q = q @ R.T
        k0 = np.linalg.norm(q / r, axis=-1)
        k1 = np.linalg.norm(q / (r * r), axis=-1)
        return k0 * (k0 - 1) / np.maximum(k1, 1e-9)
    d.box = (c - r.max(), c + r.max())
    return d


def cone(a, b, r1, r2, sx=1.0, sy=1.0, ref=(1, 0, 0)):
    """Round cone from a (radius r1) to b (radius r2); cross-section scaled sx, sy."""
    a = np.asarray(a, np.float32)
    b = np.asarray(b, np.float32)
    h = float(np.linalg.norm(b - a))
    R = frame(b - a, ref)
    bb = (r1 - r2) / h
    aa = math.sqrt(max(1 - bb * bb, 1e-6))
    def d(P):
        q = (P - a) @ R.T
        qx, qy, qz = q[..., 0] / sx, q[..., 1] / sy, q[..., 2]
        l = np.sqrt(qx * qx + qy * qy)
        k = -bb * l + aa * qz
        out = np.where(k < 0, np.sqrt(l * l + qz * qz) - r1,
                       np.where(k > aa * h, np.sqrt(l * l + (qz - h) ** 2) - r2, l * aa + qz * bb - r1))
        return out * min(sx, sy)
    pad = max(r1, r2) * max(sx, sy)
    d.box = (np.minimum(a, b) - pad, np.maximum(a, b) + pad)
    return d


def box(c, half, rad, R=None):
    c = np.asarray(c, np.float32)
    half = np.asarray(half, np.float32)
    def d(P):
        q = P - c
        if R is not None:
            q = q @ R.T
        q = np.abs(q) - (half - rad)
        return np.linalg.norm(np.maximum(q, 0), axis=-1) + np.minimum(q.max(axis=-1), 0) - rad
    d.box = (c - np.linalg.norm(half), c + np.linalg.norm(half))
    return d


def plane(p, n):
    """Keeps the side opposite n: negative behind the plane through p."""
    p = np.asarray(p, np.float32)
    n = unit(n).astype(np.float32)
    def d(P):
        return (P - p) @ n
    return d


class Piece:
    """One part of the figure, built in its own box, then merged (without
    blending) into a field."""

    def __init__(self, forms, pad=0.02):
        self.ops = []
        lo = np.min([f.box[0] for f, _ in forms], axis=0) - pad
        hi = np.max([f.box[1] for f, _ in forms], axis=0) + pad
        self.sl, self.P = grid(lo, hi)
        self.D = np.full(self.P.shape[:3], 1.0, np.float32)
        for f, k in forms:
            self.D = smin(self.D, f(self.P), k)

    def add(self, f, k):
        self.D = smin(self.D, f(self.P), k)
        return self

    def cut(self, f, k):
        self.D = smax(self.D, -f(self.P), k)
        return self

    def trim(self, f, k):
        """Keeps only what's behind a plane, with a rounded (bevelled) edge."""
        self.D = smax(self.D, f(self.P), k)
        return self

    def into(self, F):
        F[self.sl] = np.minimum(F[self.sl], self.D)


def M(v, s):
    return (v[0] * s, v[1], v[2])


def MR(R, s):
    return R if s > 0 else (R @ np.diag([-1, 1, 1])).astype(np.float32)


def lerp(a, b, t, off=(0, 0, 0)):
    a, b = np.asarray(a, float), np.asarray(b, float)
    return tuple(a + (b - a) * t + np.asarray(off))


SHELL_F = np.full(N, 1.0, dtype=np.float32)
JOINT_F = np.full(N, 1.0, dtype=np.float32)

BEVEL = 0.011      # rounding of each shell's rim
CLEAR = 0.004      # gap between a shell's cup and its ball joint

# ---------------------------------------------------------------- landmarks
SH, EL, WR = (0.205, 0.0, 1.452), (0.262, 0.018, 1.128), (0.29, -0.006, 0.872)
HP, KN, AN = (0.09, 0.004, 0.858), (0.1, -0.006, 0.5), (0.104, 0.012, 0.098)
R_SH, R_EL, R_WR, R_HP, R_KN, R_AN = 0.05, 0.032, 0.021, 0.052, 0.04, 0.025
CHEST_BOTTOM, PELVIS_TOP, PELVIS_BOTTOM = 1.135, 1.055, 0.83

# --------------------------------------------------------------------- head
# A smooth, featureless head: cranium and jaw only.
head = Piece([
    (ell((0, 0.01, 1.705), (0.079, 0.097, 0.097)), 0),
    (ell((0, -0.016, 1.635), (0.06, 0.07, 0.068)), 0.05),
])
head.into(SHELL_F)

# -------------------------------------------------------------------- chest
forms = [
    (ell((0, 0.01, 1.3), (0.138, 0.104, 0.17)), 0),
    (ell((0, -0.03, 1.35), (0.13, 0.07, 0.08)), 0.05),                              # flat, broad chest plate
    (ell((0, 0.012, 1.405), (0.172, 0.094, 0.084)), 0.04),
    (ell((0, 0.058, 1.39), (0.12, 0.05, 0.09)), 0.03),
    (ell((0, -0.004, 1.17), (0.118, 0.09, 0.09)), 0.045),
]
for s in (1, -1):
    forms += [
        (ell(M((0.098, 0.03, 1.3), s), (0.058, 0.042, 0.11), MR(rot(0, -14, 0), s)), 0.04),
        (cone((0, 0.03, 1.52), M((0.15, 0.025, 1.455), s), 0.04, 0.03), 0.04),
    ]
chest = Piece(forms)
chest.cut(cone((0, 0.124, 1.41), (0, 0.114, 1.16), 0.007, 0.007), 0.014)        # spine line
chest.trim(plane((0, 0, CHEST_BOTTOM), (0, 0, -1)), BEVEL)
chest.cut(cone((0, 0.012, 1.44), (0, 0.004, 1.65), 0.056, 0.056), BEVEL)          # collar
for s in (1, -1):
    chest.cut(ell(M(SH, s), (R_SH + CLEAR,) * 3), 0.004)
chest.into(SHELL_F)

# ------------------------------------------------------------------- pelvis
forms = [
    (ell((0, 0.004, 0.965), (0.15, 0.104, 0.105)), 0),
    (ell((0, -0.008, 1.03), (0.124, 0.09, 0.06)), 0.04),
]
for s in (1, -1):
    forms.append((ell(M((0.068, 0.052, 0.915), s), (0.078, 0.062, 0.085)), 0.03))
pelvis = Piece(forms)
pelvis.trim(plane((0, 0, PELVIS_TOP), (0, 0, 1)), BEVEL)
pelvis.trim(plane((0, 0, PELVIS_BOTTOM), (0, 0, -1)), BEVEL)
for s in (1, -1):
    pelvis.cut(ell(M(HP, s), (R_HP + CLEAR,) * 3), 0.004)
pelvis.into(SHELL_F)

for s in (1, -1):
    sh, el, wr = M(SH, s), M(EL, s), M(WR, s)
    hp, kn, an = M(HP, s), M(KN, s), M(AN, s)

    # ---------------------------------------------------------- upper arm
    u = unit(np.subtract(el, sh))
    U = frame(u)
    arm = Piece([
        (cone(sh, el, 0.052, 0.045), 0),
        (ell(lerp(sh, el, 0.45, (0, -0.017, 0)), (0.036, 0.038, 0.08), U), 0.025),
        (ell(lerp(sh, el, 0.4, (0, 0.022, 0)), (0.037, 0.036, 0.085), U), 0.025),
    ])
    arm.trim(plane(np.add(sh, u * (R_SH * 0.78)), -u), BEVEL)
    arm.trim(plane(np.subtract(el, u * (R_EL * 0.45)), u), BEVEL)
    arm.cut(ell(sh, (R_SH + CLEAR,) * 3), 0.004).cut(ell(el, (R_EL + CLEAR,) * 3), 0.004)
    arm.into(SHELL_F)

    # ------------------------------------------------------------ forearm
    v = unit(np.subtract(wr, el))
    V = frame(v)
    fore = Piece([
        (cone(el, wr, 0.046, 0.031, sy=0.86), 0),
        (ell(lerp(el, wr, 0.3, (s * 0.004, 0, 0)), (0.041, 0.037, 0.075), V), 0.025),
    ])
    fore.trim(plane(np.add(el, v * (R_EL * 0.45)), -v), BEVEL)
    fore.trim(plane(np.subtract(wr, v * (R_WR * 0.35)), v), BEVEL * 0.7)
    fore.cut(ell(el, (R_EL + CLEAR,) * 3), 0.004).cut(ell(wr, (R_WR + CLEAR,) * 3), 0.003)
    fore.into(SHELL_F)

    # --------------------------------------------------------------- hand
    # Palm toward the thigh, fingers relaxed and a little curled.
    dx = wr[0] - s * 0.274
    def H(p):
        return (p[0] * s + dx, p[1] - 0.002, p[2] - 0.002)
    forms = [
        (box(H((0.282, -0.008, 0.823)), (0.0135, 0.041, 0.047), 0.012, MR(rot(0, -5, 0), s)), 0),
        (ell(H((0.274, -0.024, 0.84)), (0.016, 0.021, 0.032)), 0.012),
    ]
    fingers = (
        (-0.0285, 0.778, (0.04, 0.024, 0.02), (0.0094, 0.0087, 0.008, 0.0071), -0.1),
        (-0.0095, 0.774, (0.044, 0.027, 0.021), (0.0097, 0.009, 0.0082, 0.0073), -0.03),
        (0.0095, 0.776, (0.042, 0.025, 0.02), (0.0093, 0.0086, 0.0079, 0.007), 0.04),
        (0.028, 0.784, (0.033, 0.02, 0.018), (0.0083, 0.0076, 0.007, 0.0063), 0.12),
    )
    for y, z, lens, radii, spread in fingers:
        p = np.array(H((0.282, y, z)))
        ang = 0.0
        for i, (ln, curl) in enumerate(zip(lens, (16, 26, 20))):
            ang += math.radians(curl)
            dirn = unit((-s * math.sin(ang), spread * math.cos(ang), -math.cos(ang)))
            q = p + dirn * ln
            forms.append((cone(tuple(p), tuple(q), radii[i], radii[i + 1]), 0.005 if i == 0 else 0.002))
            p = q
    thumb = [H(t) for t in ((0.274, -0.027, 0.852), (0.27, -0.043, 0.82), (0.266, -0.049, 0.794), (0.263, -0.05, 0.773))]
    tr = (0.0135, 0.0118, 0.0105, 0.0088)
    for i in range(3):
        forms.append((cone(thumb[i], thumb[i + 1], tr[i], tr[i + 1]), 0.006 if i == 0 else 0.002))
    hand = Piece(forms)
    hand.trim(plane(np.add(wr, v * (R_WR + 0.002)), -v), 0.006)
    hand.cut(ell(wr, (R_WR + 0.004,) * 3), 0.003)
    hand.into(SHELL_F)

    # -------------------------------------------------------------- thigh
    t = unit(np.subtract(kn, hp))
    thigh = Piece([
        (cone(hp, kn, 0.084, 0.053), 0),
        (ell(M((0.1, -0.03, 0.665), s), (0.058, 0.05, 0.135)), 0.03),
        (ell(M((0.128, -0.006, 0.635), s), (0.042, 0.05, 0.13), MR(rot(0, -4, 0), s)), 0.025),
        (ell(M((0.074, -0.03, 0.57), s), (0.034, 0.034, 0.052)), 0.025),
        (ell(M((0.094, 0.036, 0.7), s), (0.055, 0.048, 0.14)), 0.03),
        (ell(M((0.06, 0.002, 0.785), s), (0.04, 0.05, 0.085)), 0.03),
    ])
    # The leg opening rises toward the outside of the hip.
    thigh.trim(plane(np.add(hp, t * (R_HP * 0.5)), (-s * 0.3, 0, 1)), 0.024)
    thigh.trim(plane(np.subtract(kn, t * (R_KN * 0.45)), t), BEVEL)
    thigh.cut(ell(hp, (R_HP + CLEAR,) * 3), 0.004).cut(ell(kn, (R_KN + CLEAR,) * 3), 0.004)
    thigh.into(SHELL_F)

    # --------------------------------------------------------------- shin
    w = unit(np.subtract(an, kn))
    shin = Piece([
        (cone(kn, an, 0.052, 0.033), 0),
        (ell(M((0.088, 0.032, 0.39), s), (0.04, 0.042, 0.09)), 0.025),
        (ell(M((0.118, 0.03, 0.4), s), (0.036, 0.042, 0.085)), 0.025),
        (ell(M((0.1, -0.03, 0.44), s), (0.03, 0.02, 0.05)), 0.03),
    ])
    shin.trim(plane(np.add(kn, w * (R_KN * 0.45)), -w), BEVEL)
    shin.trim(plane(np.subtract(an, w * (R_AN * 0.4)), w), BEVEL * 0.8)
    shin.cut(ell(kn, (R_KN + CLEAR,) * 3), 0.004).cut(ell(an, (R_AN + CLEAR,) * 3), 0.004)
    shin.into(SHELL_F)

    # --------------------------------------------------------------- foot
    foot = Piece([
        (ell(M((0.104, 0.044, 0.042), s), (0.034, 0.042, 0.044)), 0),
        (ell(M((0.11, -0.03, 0.05), s), (0.042, 0.09, 0.045), MR(rot(-14, 0, 4), s)), 0.035),
        (cone(M((0.104, 0.01, 0.07), s), M((0.114, -0.07, 0.056), s), 0.036, 0.03), 0.03),
        (ell(M((0.118, -0.11, 0.03), s), (0.05, 0.042, 0.03), MR(rot(0, 0, 6), s)), 0.025),
        (ell(M((0.121, -0.148, 0.022), s), (0.046, 0.034, 0.022), MR(rot(0, 0, 6), s)), 0.02),
        (ell(np.add(an, (0, 0.006, -0.006)), (0.036, 0.04, 0.042)), 0.03),         # ankle collar
    ])
    foot.cut(ell(M((0.088, -0.02, 0.012), s), (0.02, 0.06, 0.02)), 0.02)            # arch
    foot.trim(plane((0, 0, an[2] + R_AN * 0.05), (0, 0.4, 1)), 0.02)
    foot.trim(plane((0, 0, 0), (0, 0, -1)), 0.004)                                  # flat sole
    foot.cut(ell(an, (R_AN + CLEAR,) * 3), 0.004)
    foot.into(SHELL_F)

    # --------------------------------------------------------- ball joints
    for c, r in ((sh, R_SH), (el, R_EL), (wr, R_WR), (hp, R_HP), (kn, R_KN), (an, R_AN)):
        b = Piece([(ell(c, (r, r, r)), 0)], pad=0.004)
        b.into(JOINT_F)

# --------------------------------------------- neck and waist: ribbed cores
neck = Piece([
    (cone((0, 0.012, 1.45), (0, 0.004, 1.62), 0.041, 0.037), 0),
    (ell((0, 0.01, 1.505), (0.049, 0.049, 0.0075)), 0.004),
    (ell((0, 0.008, 1.545), (0.047, 0.047, 0.0075)), 0.004),
])
neck.into(JOINT_F)
waist = Piece([
    (cone((0, 0.006, 1.0), (0, 0.006, 1.2), 0.086, 0.09, sy=0.8), 0),
    (ell((0, 0.006, 1.078), (0.097, 0.079, 0.0085)), 0.004),
    (ell((0, 0.006, 1.108), (0.099, 0.081, 0.0085)), 0.004),
])
waist.into(JOINT_F)
print("field", round(time.time() - T0, 1))

