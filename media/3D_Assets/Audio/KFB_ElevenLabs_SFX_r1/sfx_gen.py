#!/usr/bin/env python3
"""KFB ElevenLabs sound-effects generator (V-448/b69). The key is read from the macOS keychain
(item 'kfb-elevenlabs', account 'georg') and never printed, logged or written to disk.
Usage: python3 sfx_gen.py <set.json> [--only id1,id2] [--dry]"""
import json, subprocess, sys, os, time, urllib.request, urllib.error, hashlib

KEYFILE = os.path.expanduser('~/KFB_Geheim/elevenlabs.txt')   # fallback outside Dropbox; never printed
def key():
    for args in (['-s', 'kfb-elevenlabs', '-a', 'georg'], ['-s', 'kfb-elevenlabs'], ['-l', 'kfb-elevenlabs']):
        r = subprocess.run(['security', 'find-generic-password', *args, '-w'], capture_output=True, text=True)
        if r.returncode == 0 and r.stdout.strip(): return r.stdout.strip()
    if os.path.isfile(KEYFILE):
        k = open(KEYFILE, encoding='utf-8', errors='ignore').read().strip()
        if k: return k
    sys.exit('no key: keychain item kfb-elevenlabs (login keychain) not found and ~/KFB_Geheim/elevenlabs.txt missing')

def gen(k, item, out):
    body = {'text': item['prompt'], 'model_id': 'eleven_text_to_sound_v2', 'prompt_influence': item.get('influence', 0.6), 'loop': bool(item.get('loop'))}
    if item.get('seconds'): body['duration_seconds'] = item['seconds']
    req = urllib.request.Request('https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128', data=json.dumps(body).encode(), method='POST',
                                 headers={'xi-api-key': k, 'Content-Type': 'application/json', 'Accept': 'audio/mpeg'})
    try:
        with urllib.request.urlopen(req, timeout=180) as r:
            data = r.read(); cost = r.headers.get('character-cost') or r.headers.get('x-character-count')
    except urllib.error.HTTPError as e:
        return {'id': item['id'], 'ok': False, 'status': e.code, 'error': e.read()[:300].decode('utf8', 'replace')}
    fn = os.path.join(out, item['id'] + '.mp3'); open(fn, 'wb').write(data)
    return {'id': item['id'], 'ok': True, 'file': os.path.basename(fn), 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest(), 'cost_header': cost, 'request': body}

if __name__ == '__main__':
    S = json.load(open(sys.argv[1])); only = None
    if '--only' in sys.argv: only = set(sys.argv[sys.argv.index('--only') + 1].split(','))
    items = [i for i in S['items'] if not only or i['id'] in only]
    est = sum(40 * (i.get('seconds') or 2) for i in items)
    print(f"{len(items)} item(s), estimated {est} credits (40/s)")
    if '--dry' in sys.argv: sys.exit(0)
    out = os.path.join(os.path.dirname(os.path.abspath(sys.argv[1])), S['set']); os.makedirs(out, exist_ok=True)
    k = key(); log = []
    for i in items:
        res = gen(k, i, out); log.append(res); print(res['id'], 'OK' if res['ok'] else f"FAIL {res.get('status')} {res.get('error','')[:120]}"); time.sleep(0.5)
    mf = os.path.join(out, 'manifest.json'); prev = json.load(open(mf)) if os.path.exists(mf) else {'set': S['set'], 'runs': []}
    prev['runs'].append({'at': time.strftime('%Y-%m-%dT%H:%M:%S'), 'results': log}); json.dump(prev, open(mf, 'w'), indent=1, ensure_ascii=False)
