"""Plan + height plot for a Fahrschule graph stream over the OSM lake extract (Blender plan x east, y north)."""
import json, sys
import matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt
G = json.load(open(sys.argv[1])); out = sys.argv[2]
osm = json.load(open(sys.argv[3] if len(sys.argv) > 3 else 'layout/otto_maigler_see.osm.json'))
col = {'water': '#4a90c8', 'beach': '#e8c870', 'parking': '#999', 'water_park': '#9bd', 'swimming_area': '#7ce', 'nature_reserve': '#8c8', 'park': '#ac8', 'tertiary': '#c55'}
fig, ax = plt.subplots(1, 2, figsize=(18, 9), gridspec_kw={'width_ratios': [1.3, 1]})
a = ax[0]
for w in osm['ways']:
    xs = [p[0] for p in w['pts']]; ys = [p[1] for p in w['pts']]
    if w['kind'] == 'water': a.fill(xs, ys, color='#bcdcf0', zorder=0)
    a.plot(xs, ys, color=col.get(w['kind'], 'k'), lw=1)
def W(q, k):
    lat, lift = q['slots'][k]; return [q['p'][i] + q['R'][i] * lat + q['U'][i] * lift for i in range(3)]
for rid, r in G['routes'].items():
    S = r['samples']
    for k, c in ((6, '#279797'), (7, '#279797'), (0, '#fa7a47'), (13, '#fa7a47')):
        P = [W(q, k) for q in S if q['prm']['surface'] > 0.5]
        a.plot([p[0] for p in P], [-p[2] for p in P], '.', ms=0.6, color=c)
for pad in G.get('pads', []):
    o = pad['outline']; a.plot([p[0] for p in o] + [o[0][0]], [-p[2] for p in o] + [-o[0][2]], color='#a60', lw=1.5)
    for st in pad['stations']:
        if st['type'] == 'cones': a.plot([p[0] for p in st['pts']], [-p[2] for p in st['pts']], 'o', color='orange', ms=3)
        if st['type'] == 'parking_box': c = st['corners'] + [st['corners'][0]]; a.plot([p[0] for p in c], [-p[2] for p in c], color='w', lw=1)
        if st['type'] == 'brake_line': a.plot([st['from'][0], st['to'][0]], [-st['from'][2], -st['to'][2]], color='r', lw=2)
a.set_xlim(-1150, -150); a.set_ylim(-800, 50); a.set_aspect('equal'); a.set_title('FS01 plan over OSM (Otto-Maigler-See)'); a.grid(alpha=.3)
b = ax[1]
for rid, r in G['routes'].items():
    S = r['samples']; b.plot([q['s'] for q in S], [q['p'][1] for q in S], label=rid)
b.axhline(G.get('water', -1.2) if 'water' in G else -1.2, color='#4a90c8', ls='--', lw=1); b.legend(); b.grid(alpha=.3); b.set_title('height over s (water dashed)')
plt.tight_layout(); plt.savefig(out, dpi=80); print(out)
