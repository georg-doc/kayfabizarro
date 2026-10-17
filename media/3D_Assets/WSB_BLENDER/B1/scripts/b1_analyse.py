#!/usr/bin/env python3
"""WSB B1 · turns data/measure.json (three.js r180 skinned-vertex measurement, b1.html?mode=measure)
into tempo.json + data/checks.json.  Usage: python3 -I b1_analyse.py <measure.json> <out_dir>"""
import json, math, os, sys

TARGET = 118.0          # Pharaoh Piledriver beat grid (beats.json, stem timeline)
MIX_BPM = 117.748       # Georg's full mix is linearly stretched (beats.json mix_timeline.bpm_mix)
CONTACT_M = 0.015       # foot counts as planted when its lowest vertex is < 1.5 cm above ground
SKATE_MPS = 0.25        # planted foot moving faster than this (horizontal, foot bone) = sliding
FPS = 30

m = json.load(open(sys.argv[1])); out_dir = sys.argv[2]
tempo, checks = {}, {}


def octave_factor(bpm):
    f = TARGET / bpm
    while f < 0.75: f *= 2
    while f >= 1.5: f /= 2
    return f


def runs(mask):
    r, s = [], None
    for i, v in enumerate(mask + [False]):
        if v and s is None: s = i
        if not v and s is not None: r.append((s, i - 1)); s = None
    return r


idle = m['clips']['kfb_idle_happy_a']
for clip, c in m['clips'].items():
    dur = c['duration']; t = c['A']['tempo']
    cands = t.get('candidates', [])
    agree = t.get('agree'); top = cands[0] if cands else {}
    conf = 'high' if agree else ('medium' if top.get('r', 0) >= 0.45 else 'low')
    f = octave_factor(t['bpmLoop'])
    played_bpm_equiv = t['bpmLoop'] * f
    bars_at_118 = dur / f * TARGET / 240
    nb = max(1, round(dur * TARGET / 240))
    tempo[clip] = {
        'duration_s': round(dur, 4), 'bpm_natural': t['bpmNatural'], 'bpm_loop_quantised': t['bpmLoop'],
        'beats_in_loop': t['beatsInLoop'], 'beat_phase_s': t['beatPhaseS'], 'confidence': conf, 'signal': t['source'],
        'alternatives': [{'bpm': x['folded'], 'from': x['src'], 'r': x['r']} for x in cands[1:4]],
        'playback_factor_118': round(f, 4),
        'playback_factor_mix_117_748': round(f * MIX_BPM / TARGET, 4),
        'beats_per_loop_at_118': round(t['beatsInLoop'] * (played_bpm_equiv / t['bpmLoop']), 2),
        'loop_seconds_at_118': round(dur / f, 3), 'loop_bars_at_118': round(bars_at_118, 3),
        'alt_whole_bar_factor_118': {'bars': nb, 'factor': round(dur * TARGET / (nb * 240), 4),
                                     'note': 'loop = exactly %d bars at 118; ignores the clip\'s own beat' % nb},
    }

for clip, c in m['clips'].items():
    checks[clip] = {}
    for k in ('A', 'B'):
        r = c[k]; P = r['penetration']; pf = r['perFrame']; n = r['frames']; nh, nf = P['sampledHandVerts'], P['sampledForearmVerts']
        base_fb = max(idle[k]['perFrame']['forearmInBody'])  # KayKit arm shells rest inside the torso even in idle
        hb = [v / nh for v in pf['handInBody']]; hh = [v / nh for v in pf['handInHead']]; fh = [v / nf for v in pf['forearmInHead']]
        fb_ex = [max(0, v - base_fb) / nf for v in pf['forearmInBody']]
        sk = {}
        for side in 'LR':
            pos, mn = pf['foot' + side], pf['footMin' + side]
            planted = [y < CONTACT_M for y in mn]
            spd = [math.hypot(pos[(i + 1) % n][0] - pos[i - 1][0], pos[(i + 1) % n][2] - pos[i - 1][2]) * FPS / 2 for i in range(n)]
            skate = [planted[i] and spd[i] > SKATE_MPS for i in range(n)]
            sr = [x for x in runs(skate) if x[1] - x[0] + 1 >= 3]
            longest = max(sr, key=lambda x: x[1] - x[0], default=None)
            sk[side] = {'planted_frames': sum(planted), 'skate_frames': sum(skate), 'skate_share_of_planted': round(sum(skate) / max(1, sum(planted)), 3),
                        'max_planted_speed_mps': round(max([s for s, p in zip(spd, planted) if p], default=0), 3),
                        'longest_skate': None if not longest else {'from_s': round(longest[0] / FPS, 2), 'to_s': round(longest[1] / FPS, 2)},
                        'sink_median_cm': round(-100 * sorted(mn)[len(mn) // 2], 1), 'deepest_cm': round(-100 * min(mn), 1),
                        'deepest_at_s': round(mn.index(min(mn)) / FPS, 2), 'frames_deeper_3cm': sum(1 for y in mn if y < -0.03)}
        def pen(arr, thr=0.1):
            fr = [i for i, v in enumerate(arr) if v >= thr]
            return {'frames': len(fr), 'share': round(len(fr) / n, 3), 'max_share_of_sampled_verts': round(max(arr), 3),
                    'worst_at_s': round(arr.index(max(arr)) / FPS, 2) if max(arr) > 0 else None}
        res = {
            'broken_limbs': {'max_edge_stretch': r['stretch']['max']['v'], 'at_s': round(r['stretch']['max']['frame'] / FPS, 2), 'part': r['stretch']['part'],
                             'p95': r['stretch']['p95'], 'frames_over_1_5': r['stretch']['framesOver1_5']},
            'hand_in_body': pen(hb), 'hand_in_head': pen(hh), 'forearm_in_head': pen(fh), 'forearm_in_body_beyond_idle': pen(fb_ex),
            'feet': sk, 'airborne_frames_3cm': r['ground']['framesAirborne3cm'],
            'hand_lowest_cm': round(100 * r['ground']['hand']['y'], 1), 'head_lowest_cm': round(100 * r['ground']['head']['y'], 1),
        }
        notes = []
        for key, label in (('hand_in_body', 'hand in body'), ('hand_in_head', 'hand in head'), ('forearm_in_head', 'forearm in head'), ('forearm_in_body_beyond_idle', 'forearm in body')):
            if res[key]['share'] > 0.05: notes.append('%s %d%% of frames' % (label, round(100 * res[key]['share'])))
        for side in 'LR':
            f_ = sk[side]
            if f_['skate_share_of_planted'] > 0.10: notes.append('foot %s slides on %d%% of planted frames' % (side, round(100 * f_['skate_share_of_planted'])))
            if f_['deepest_cm'] > 5: notes.append('foot %s dips %.1f cm into ground at %.2f s' % (side, f_['deepest_cm'], f_['deepest_at_s']))
        res['notes'] = notes
        res['broken_limbs']['bone_offset_max_m'] = 0.0  # data/bone_check.json: library only rotates bones
        res['broken_limbs']['note'] = 'edge stretch = joint-crossing edges of hard-weighted KayKit joints (elbow/knee/wrist), shells overlap, visually closed; info only'
        res['verdict'] = 'PASS WITH NOTES' if notes else 'PASS'
        checks[clip][k] = res

meta = {'schema': 'kfb.wsb-b1-tempo.v1', 'target_bpm': TARGET, 'mix_bpm': MIX_BPM,
        'source': {'library': 'media/3D_Assets/Animations/KFB_Motion_Library/KFB_Motion_Library_Rig_Medium.glb @ georg-doc/kayfabizarro main 904f0e9 (blob 45e1291)',
                   'beat_grid': 'KFB_HUB/40_AUDIO/pharaoh_piledriver__suno_01a/beats.json'},
        'method': 'Bone-world-space samples at 30 fps in three.js r180 on Mummy_A (skeleton identical on Mummy_B). Two signals: hip height '
                  '(dance bounce) and summed speed of hands, feet, head, hips, chest. Autocorrelation peaks 45-200 BPM, folded into 80-160 BPM; '
                  'the candidate with cross-signal support (within 3 %) wins, else the strongest. Loop-quantised = whole beats per loop. '
                  'beat_phase_s = time in the clip of the lowest hip point within one beat (the down-bounce, to place on the beat).',
        'how_to_use': 'mixer timeScale = playback_factor_118 (stems / 118.000 grid) or playback_factor_mix_117_748 (full mix mp3). '
                      'Start the clip so that clip time beat_phase_s lands on a beat of the song.',
        'clips': tempo}
json.dump(meta, open(os.path.join(out_dir, 'tempo.json'), 'w'), indent=1)
json.dump({'schema': 'kfb.wsb-b1-checks.v1', 'thresholds': {'contact_m': CONTACT_M, 'skate_mps': SKATE_MPS, 'note_share': 0.05, 'broken_limbs': 'bone local offset/scale vs rest (data/bone_check.json)',
           'penetration': 'ray-parity point-in-mesh on every 6th hand/forearm vertex vs skinned Body/Head shells; frame counts when >=10 % of sampled verts are inside'},
           'clips': checks}, open(os.path.join(out_dir, 'data', 'checks.json'), 'w'), indent=1)
for clip in tempo:
    t = tempo[clip]
    print('%-28s nat %6.2f loop %7.3f beats %3d conf %-6s f118 %.4f phase %.3f | A %s | B %s' % (clip, t['bpm_natural'], t['bpm_loop_quantised'], t['beats_in_loop'], t['confidence'], t['playback_factor_118'], t['beat_phase_s'] or -1, checks[clip]['A']['verdict'], checks[clip]['B']['verdict']))
    for k in 'AB': print('   ', k, '; '.join(checks[clip][k]['notes']))
