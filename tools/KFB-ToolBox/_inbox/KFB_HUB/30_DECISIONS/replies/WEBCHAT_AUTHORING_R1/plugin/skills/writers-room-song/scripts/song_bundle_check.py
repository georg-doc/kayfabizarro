#!/usr/bin/env python3
"""Small deterministic structural gate for a KFB Writer's Room song; not an independent critic."""
import json, re, sys
from pathlib import Path

def check(song, cards, lines):
    errors=[]
    if not song.startswith('[Spoken Word]\n'): errors.append('first line not [Spoken Word]')
    if len(song)>=5000: errors.append(f'character limit: {len(song)} >= 5000')
    if re.search(r'meta.message',song,re.I): errors.append('forbidden Meta-Message')
    if len(re.findall(r'Uncle FrizzleBob',song,re.I))>1: errors.append('Uncle FrizzleBob repeated')
    rule_pattern = re.compile(r'\b(?:draw|discard|roll|deal|reveal|skip)\s+(?:a|the|one|two|your|another|opponent)\b', re.I)
    if rule_pattern.search(song) or any(rule_pattern.search(line['songLine']) for line in lines):
        errors.append('possible gameplay rule recital in song or songLine; editorial check required')
    cc={c['cardNumber']:c for c in cards}; ll={l['cardNumber']:l for l in lines}
    if set(cc)!=set(ll):errors.append('card/songLine coverage mismatch')
    if len(ll)!=len(lines):errors.append('duplicate songLine cardNumber')
    if not all('changeReason' in l for l in lines):errors.append('missing songLine change log')
    if any(c.get('visualVerified') and not c.get('imageMotif') for c in cards):errors.append('false visual verification without motif')
    body=song.split('\n\n')[2:]  # song intro grouping can differ; coverage follows printed-card names
    for n,c in sorted(cc.items()):
        name=c['cardName']
        if name and name not in song and c.get('status')!='OPEN':errors.append(f'card title missing: {n} {name}')
    if len(re.findall(r'(?m)^\s*$',song))<max(1,len({c.get('page') for c in cards})-1):errors.append('too few stanza breaks')
    return errors

if __name__=='__main__':
    if len(sys.argv)!=4:sys.exit('usage: song_bundle_check.py song.suno.txt cards.json songlines.json')
    song=Path(sys.argv[1]).read_text(); cards=json.loads(Path(sys.argv[2]).read_text()); lines=json.loads(Path(sys.argv[3]).read_text())
    e=check(song,cards,lines)
    print(f'characters={len(song)} cards={len(cards)} songlines={len(lines)} static_errors={len(e)}')
    for x in e: print('FAIL',x)
    if e:sys.exit(1)
