#!/usr/bin/env python3
"""WSB B2 · data/anchors_raw.json (b2.html?mode=anchors) -> kaykit-tree-fluff-anchors.v1.json.
Usage: python3 -I b2_build_json.py <anchors_raw.json> <out.json>"""
import json, sys, subprocess, os
raw = json.load(open(sys.argv[1])); src = os.path.join(os.path.dirname(os.path.abspath(sys.argv[2])), '_src'); P = raw['params']
pins = {}
for m in raw['models']:
    for ext in ('gltf', 'bin'):
        pins[m + '.' + ext] = subprocess.check_output(['git', 'hash-object', os.path.join(src, m + '.' + ext)]).decode().strip()[:10]
out = {
    'schema': 'kfb.tree-fluff-anchors.v1', 'job': 'WSB B2 · 2026-10-17',
    'decision': 'V-368 (fluff sorts = six story modes), V-292 colours; Georg 17.10. tunes: no balls on crown corners/edges, organic loose groups, colour contrast rule, '
                'size variation, no Christmas-bauble hanging as default, groups not too tight, nothing may poke through a ball',
    'source': {'pack': 'media/3D_Assets/KayKit_Forest_Nature_Pack_1.0_FREE/Assets/gltf @ georg-doc/kayfabizarro main (git blob, short)', 'blobs': pins,
               'note': 'FREE pack = 20 trees, no snow variants (those need the full KayKit Forest Nature Pack, not in the repo).'},
    'units': 'model space of each gltf (= world units; Rig_Medium figure ~2.2 tall), y up',
    'params': P,
    'fields': {
        'p': 'attach point on the mesh', 'n': 'attach direction (outward surface normal; hang variant: 0,-1,0)', 'surfaceNormal': 'mesh face normal at p',
        'attach': "surface = nestled into the crown (45 % embedded); branch = sits on top of a thin outer branch or in a fork; hang = gag variant only (params.bareMode='hang')",
        'ballCenter': 'centre for the default radius params.ballR', 'sizeScale': 'visual size factor 0.85-1.15 (same value for every ball)',
        'maxBallR': 'largest radius (<= 0.35) that still passes the no-piercing test here', 'group': 'loose cluster id (1-2 balls, 3.4-4.5 R apart); 99 = filler',
        'bgColor': 'leaf texel behind the ball (null on bare wood)', 'contrastDE': 'CIE76 dE of each fluff colour vs bgColor (100 on wood)',
        'proofColour': 'colour chosen by colourRule for the proof renders', 'regrowDelayS': 'proposal: seconds until this anchor starts regrowing after harvest',
        'dropOrder': 'proposal: order in which balls loosen when the tree is shaken/boxed/blasted (0 = first; low and outer first)'},
    'placementRules': {
        'edges': 'canopy anchors keep >= %.1f R from crease edges (> 25 deg) and open boundaries of the crown mesh' % P['edgeClear'],
        'noPiercing': 'inside the ball radius only the contact cap below the attach plane may hold geometry; anything above (branch spike, crown lobe) rejects the anchor',
        'spacing': 'group centres >= %g R, inside a group %g-%g R, fillers >= %g R' % (P['centreGap'], P['groupMin'], P['groupMax'], P['fillGap']),
        'bare': 'thin branches only (local thickness <= %g), away from the trunk column, top side; no hanging rows' % P['branchMaxThick'],
        'count': 'canopy 3 + 0.6 * sqrt(crown area), clamped 6-12; bare trees keep what fits (some thin dead trees get < 6, flagged belowMinimum)'},
    'colourRule': {
        'neighbours': 'balls closer than %g R never share a colour' % P['neighbourR'],
        'contrast': 'a fluff colour is only placed where contrastDE >= %g against the local leaf colour' % P['minContrast'],
        'balance': 'least-used colour first, so each tree shows as many of the six sorts as anchors allow',
        'finding': 'Comic olive #7a8d4a: dE ~26 against the KayKit green crowns (others 44-99) -> not on green canopies; carried by bare trees, ground nests, chests. '
                   'Zone weighting (V-368, main sort ~40 %) must route Comic to non-green carriers or give it a contrast aid (open decision, see RETURN).'},
    'lifecycle': {'status': 'PROPOSAL (Georg 17.10.), runtime owner WS1 decides',
        'grow': 'after harvest/drop: wait regrowDelayS, then scale 0 -> sizeScale over 6-10 s, ease-out with ~8 % clay overshoot (knead squash), seeded per anchor',
        'ripe': 'full size: slow 0.5-1 Hz wobble, amplitude 2-3 % scale',
        'loosen': 'shake/box/blast: in dropOrder, 0.4-0.6 s wiggle, then detach',
        'drop': 'Windfall physics (fall, bounce, roll downhill), staggered 0.08-0.15 s per ball so it reads as a pattern, not a burst'},
    'fluffColours': {'Tragic': '#3e6a83', 'Comic': '#7a8d4a', 'Absurd': '#e9c14a', 'Heroic': '#d97c3a', 'Mystical': '#6b4e7d', 'Forbidden': '#a64670'},
    'models': {}}
for m, v in raw['models'].items():
    out['models'][m] = {'kind': v['kind'], 'height': v['height'], 'bbox': v['bbox'], 'anchorCount': len(v['anchors']), 'belowMinimum': len(v['anchors']) < 6,
                        'minSpacing': v['minSpacing'], 'coloursUsed': v['coloursUsed'], 'anchors': v['anchors']}
json.dump(out, open(sys.argv[2], 'w'), indent=1)
tot = sum(len(v['anchors']) for v in out['models'].values())
print('models', len(out['models']), 'anchors', tot, 'belowMinimum', [m for m, v in out['models'].items() if v['belowMinimum']])
for m, v in out['models'].items(): print(' ', m.ljust(22), v['kind'], v['anchorCount'], 'minSpacing', v['minSpacing'], v['coloursUsed'])
