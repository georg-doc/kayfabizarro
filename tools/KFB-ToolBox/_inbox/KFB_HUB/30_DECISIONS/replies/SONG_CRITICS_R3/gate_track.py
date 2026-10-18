#!/usr/bin/env python3
"""Run the canonical lyrics gate (CI-equivalent card range + media) for one track.
Usage: python3 SONG_CRITICS_R3/gate_track.py <track_base e.g. federal_kayfabe.part1> <candidate.suno.txt>
Run from 30_DECISIONS/replies. Corpus = all other current candidates in SONG_CRITICS_R3/inputs + OPENER_ARC_R2."""
import json,sys,glob,os,subprocess
base,cand=sys.argv[1],sys.argv[2]
cfg=json.load(open('SONG_CRITICS_R3/gate_config.json'))[base]
corpus=[c for c in glob.glob('SONG_CRITICS_R3/inputs/*.suno.txt')+glob.glob('SONG_CRITICS_R3/r46/*.suno.txt') if not os.path.basename(c).startswith(base+'.')]
a=['python3','song_gate.py','lyrics',cand,'--deck',cfg['deck']]
if cfg.get('media'): a+=['--media',cfg['media']]
if cfg.get('cards'): a+=['--cards',cfg['cards']]
sl=sorted(glob.glob(f'SONG_CRITICS_R3/r46/{base}.*.songlines.json'))
sl=sl[-1] if sl else cfg.get('songlines')
if sl: a+=['--songlines',sl]
a+=['--corpus','OPENER_ARC_R2',*corpus]
sys.exit(subprocess.call(a))
