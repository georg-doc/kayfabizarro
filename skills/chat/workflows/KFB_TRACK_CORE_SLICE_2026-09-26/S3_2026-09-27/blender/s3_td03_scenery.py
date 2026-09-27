"""S3 · Uni-Center scenery for the TD03 route, built by the approved TD02 builder (unchanged functions), with:
- parameter overrides so the core route fits (hub_r 68, hole_r 36 for a STANDARD 14.4 helix around the 13 m core),
- the TD02 route shells and ribbon previews NOT built (the route now comes only from the Track Core stream),
- columns skipped where the route corridor passes (TD02 v2 open item: no stray columns in the track).
Globals: TD02_SRC (builder path), S3_CORRIDOR (json), S3_P (dict of overrides)."""
import bpy, json, math
TD02 = globals().get('TD02_SRC', '/Users/georgv.westphalen/Dropbox/CLAUDE/KFB Racetrack Blender Kit/TD02-UNICENTER-Y/scripts/build_td02_ytower.py')
src = open(TD02).read()
head = src[:src.index('\nc, lap, ncol = build()')]                 # functions + P only, no build / routes / export
g = {'__name__': 'td02_scenery', 'TD_OUT': '/tmp/'}
exec(head, g)
P = g['P']; P.update(globals().get('S3_P', dict(hub_r=68.0, hole_r=36.0, core_r=13.0, helix_R=23.0)))
g['D0'] = math.sqrt(P['hub_r'] ** 2 - (P['arm_w'] / 2) ** 2)
g['COLL'] = 'S3_UNICENTER_SCENERY'
cor = json.load(open(globals()['S3_CORRIDOR']))['pts']
def near_route(x, y, pad=1.2):
    return any(math.hypot(x - px, y - py) < hw + pad for px, py, pz, hw in cor)
# columns: same grid as TD02, but none inside the route corridor. Patch the build() source for this one condition.
bsrc = head[head.index('def build():'):]
bsrc = bsrc.replace("            if not (inside_hub or inside_arm):\n                continue",
                    "            if not (inside_hub or inside_arm):\n                continue\n            if near_route(x, y):\n                skipped[0] += 1; continue")
assert 'near_route(x, y)' in bsrc
g['near_route'] = near_route; g['skipped'] = [0]
exec(bsrc, g)
c, lap, ncol = g['build']()
# remove the TD02 route shells (helix / balcony decks + parapets): the route is the core stream now
removed = []
for o in list(c.objects):
    if o.get('kfb_td02_role') in ('helix_deck', 'balcony_deck', 'parapet'):
        removed.append(o.name); bpy.data.objects.remove(o, do_unlink=True)
result = dict(objects=len(c.objects), columns=ncol, columns_skipped_for_route=g['skipped'][0], removed_route_shells=removed, P={k: P[k] for k in ('hub_r', 'hole_r', 'core_r', 'helix_R')})
