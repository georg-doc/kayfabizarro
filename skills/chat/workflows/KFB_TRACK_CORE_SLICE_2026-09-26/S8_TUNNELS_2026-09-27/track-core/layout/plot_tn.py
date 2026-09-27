# TN01 plan + height profile: tubes coloured by host, cavern outline, shafts
import json, math, matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt
G = json.load(open('out/tn01.graph.stream.json')); M = G['routes']['M']; J = G['routes']['J']
COL = {'mountain': '#8a5a2b', 'building': '#d0453a', 'shaft': '#6a3fb0', 'labyrinth': '#1f8a70'}
fig, (a, b) = plt.subplots(2, 1, figsize=(15, 11), gridspec_kw={'height_ratios': [3, 1.3]})
h = G['hosts'][0]; cx, cy, cz = h['center']; rx = h['radii'][0]
fr = G['meta']['floorR']
a.add_patch(plt.Circle((cx, -cz), rx, fc='#f3e3b8', ec='#b99a55', lw=1, zorder=0, label='hollow earth (widest)'))
a.add_patch(plt.Circle((cx, -cz), fr, fc='#e9d08e', ec='#b99a55', lw=1, ls='--', zorder=0, label='cavern floor'))
sx, sy, sz = h['sun']['at']; a.add_patch(plt.Circle((sx, -sz), h['sun']['r'], fc='#ffcc33', ec='#e0a000', zorder=1, label='inner sun'))
for R, lab in ((M, 'M'), (J, 'J')):
    S = R['samples']; xs = [q['p'][0] for q in S]; ys = [-q['p'][2] for q in S]
    a.plot(xs, ys, color='#555' if lab == 'M' else '#999', lw=1.2, zorder=2)
    for t in R.get('tunnels', []):
        seg = S[t['i0']:t['i1'] + 1]
        a.plot([q['p'][0] for q in seg], [-q['p'][2] for q in seg], color=COL.get(t['host'], 'k'), lw=5, alpha=0.8, zorder=3, solid_capstyle='butt')
        q = S[t['i0']]; a.annotate(f"{t['id']} · {'→'.join(t['shapes'])}", (q['p'][0], -q['p'][2]), fontsize=8, xytext=(5, 8), textcoords='offset points')
for k, v in COL.items(): a.plot([], [], color=v, lw=5, label=f'tube: {k}')
a.plot(0, 0, 'k^', ms=10, label='start / finish'); a.set_aspect('equal'); a.grid(alpha=0.3); a.legend(loc='lower left', fontsize=8)
a.set_title('TN01 · KFB tunnels · plan (x east, y north, m)')
for R, lab, c in ((M, 'M', '#333'), (J, 'J', '#1f8a70')):
    S = R['samples']; b.plot([q['s'] for q in S], [q['p'][1] for q in S], color=c, lw=1, label=f'route {lab} road height')
    for t in R.get('tunnels', []):
        seg = S[t['i0']:t['i1'] + 1]
        b.fill_between([q['s'] for q in seg], [q['p'][1] - q['tunnel']['fill'] for q in seg], [q['p'][1] + max(p[1] for p in R['tunnelRings'][q['tunnel']['ringId']]) for q in seg], color=COL.get(t['host'], 'k'), alpha=0.25)
b.axhline(0, color='#6a8f3a', lw=1, label='ground'); b.axhline(G['meta']['floorZ'], color='#b99a55', ls='--', lw=1, label='cavern floor')
b.set_xlabel('s (m)'); b.set_ylabel('height (m)'); b.grid(alpha=0.3); b.legend(fontsize=8, loc='lower right')
plt.tight_layout(); plt.savefig('out/tn01_plan.png', dpi=110)
S = M['samples']; g = max(abs(q['grade']) for q in S if q['law'] == 'guide'); print('max grade', round(g * 100, 1), '%')
