"""Cross-sections (14 slots, coloured by role and skin), placeholder skins, seam-blend stagger. Reads the TD03 stream."""
import json, sys
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

SRC = sys.argv[1] if len(sys.argv) > 1 else 'out/td03.stream.json'
OUT = sys.argv[2] if len(sys.argv) > 2 else 'out/profiles_and_skins.png'
d = json.load(open(SRC)); S = d['samples']
ROLE = ['barrier_side', 'barrier_side', 'barrier_cap', 'barrier_side', 'shoulder', 'shoulder', 'road',
        'shoulder', 'shoulder', 'barrier_side', 'barrier_cap', 'barrier_side', 'barrier_side', 'underside']
CASES = [(100, 'STREET · street_in'), (272, 'Car-park entry · slim parapet'), (1300, 'TRACK · STANDARD 14.4'),
         (1600, 'TRACK · WIDE 18 (drift ring)'), (1950, 'MAG · slim loop profile')]
BG = '#f4f1e8'
fig = plt.figure(figsize=(16, 11), dpi=100); fig.patch.set_facecolor(BG)
for k, (i, t) in enumerate(CASES):
    ax = fig.add_axes([0.03, 0.83 - k * 0.19, 0.62, 0.13]); q = S[i]; sl = q['slots']; n = len(sl)
    xs = [p[0] for p in sl]; ys = [p[1] for p in sl]
    ax.fill(xs, ys, color=q['paint']['underside'], alpha=0.25, zorder=0)
    for a in range(n):
        b = (a + 1) % n
        ax.plot([sl[a][0], sl[b][0]], [sl[a][1], sl[b][1]], color=q['paint'][ROLE[a]], lw=5, solid_capstyle='round')
    ax.set_xlim(-13, 13); ax.set_ylim(-3.2, 2.2); ax.set_aspect('equal'); ax.set_facecolor(BG); ax.tick_params(labelsize=7)
    ax.set_title(f"{t}   (sample {i}, road width {q['prm']['width']:.1f} m, skin {q['skin']}; metres, driver's view)",
                 fontsize=10, loc='left')
ax = fig.add_axes([0.70, 0.55, 0.28, 0.38]); ax.axis('off'); ax.set_title('Placeholder skins (per role)', fontsize=11, loc='left')
roles = ['road', 'shoulder', 'barrier_side', 'barrier_cap', 'underside']
for r_, (sk, ix) in enumerate([('street', 100), ('track', 1300), ('mag', 2082)]):
    for c_, ro in enumerate(roles):
        ax.add_patch(plt.Rectangle((c_ * 1.1, -r_ * 1.3), 1, 1, color=S[ix]['paint'][ro]))
    ax.text(-0.2, -r_ * 1.3 + 0.5, sk, ha='right', va='center', fontsize=10)
for c_, ro in enumerate(roles):
    ax.text(c_ * 1.1 + 0.5, 1.15, ro.replace('_', '\n'), ha='center', fontsize=8)
ax.set_xlim(-1.4, 5.6); ax.set_ylim(-3.1, 1.8)
ax = fig.add_axes([0.72, 0.08, 0.26, 0.36]); ax.set_facecolor(BG)
ax.set_title('Seam blend: 32 m centred on the joint,\nstaggered per role (0 = old skin, 1 = new)', fontsize=10, loc='left')
Z = {'barrier_cap': (0, .55), 'barrier_side': (.1, .7), 'underside': (.1, .9), 'shoulder': (.25, .85), 'road': (.4, 1)}
x = np.linspace(0, 1, 200)
for ro, (a, b) in Z.items():
    u = np.clip((x - a) / (b - a), 0, 1); ax.plot(x * 32 - 16, u * u * (3 - 2 * u), lw=2, label=ro)  # core: smoothstep
ax.axvline(0, color='k', lw=0.6, ls='--'); ax.text(0.5, 0.05, 'joint', fontsize=8)
ax.set_xlabel('m from joint'); ax.legend(fontsize=8)
fig.savefig(OUT, facecolor=BG)
print(OUT)
