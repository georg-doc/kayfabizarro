# Artefakt-Fassung: wie gelaende-probe.public.html, aber alle GitHub-Assets als mitveröffentlichte Dateien (gh/…).
# Der claude.ai-Viewer erlaubt keine Abrufe fremder Adressen (Georg 21.10.: „Racer konnte nicht geladen werden“); Pages bleibt unverändert.
import json, shutil, os
P = '/Users/georgvonwestphalen/kfb-ws1/probe'
OUT = '/private/tmp/claude-503/-Users-georgvonwestphalen-Library-CloudStorage-OneDrive-DocCheckAG-CLAUDE/79466b96-14df-4e6d-b8fa-6602ca96bdab/scratchpad/artifact'
s = open(P + '/gelaende-probe.public.html').read(); mp0 = json.load(open(P + '/artifact-assets/map.json'))
# Der Viewer liefert nur Web-Typen aus: .gltf → .gltf.json, .glb/.bin → base64 als .b64.txt (fetch-Aufsatz dekodiert), .png bleibt
pub = lambda v: v + '.json' if v.endswith('.gltf') else v + '.b64.txt' if v.endswith(('.glb', '.bin')) else v
mp = {k: pub(v) for k, v in mp0.items()}
inj = ('<script>/* Artefakt: GitHub-Adressen auf mitgelieferte Dateien umlenken (Loader + fetch) */(function(){var M=' + json.dumps(mp, ensure_ascii=False) +
       ';function L(u){if(!u)return u;if(M[u])return M[u];try{var d=decodeURI(u);if(M[d])return M[d]}catch(e){}return u}'
       'THREE.DefaultLoadingManager.setURLModifier(L);var F=window.fetch.bind(window);'
       'window.fetch=function(u,o){var s0=typeof u==="string"?u:(u&&u.url),t=L(s0),v=(t===s0&&typeof u!=="string")?u:t;if(typeof t==="string"&&/\\.b64\\.txt$/.test(t.split("?")[0]))return F(t).then(function(r){if(!r.ok)return r;return r.text().then(function(t){var b=atob(t.trim()),a=new Uint8Array(b.length);for(var i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return new Response(a.buffer,{status:200,headers:{"Content-Type":"application/octet-stream"}})})});return F(v,o)};window.__ART_MAP=M})()</script>')
a = '<script src="https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/loaders/GLTFLoader.js"></script>'
assert s.count(a) == 1; s = s.replace(a, a + '\n' + inj)
os.makedirs(OUT, exist_ok=True); open(OUT + '/gelaende-probe.artifact.html', 'w').write(s)
import base64
for v in set(mp0.values()):
    src = os.path.join(P, 'artifact-assets', v); d = os.path.join(OUT, pub(v)); os.makedirs(os.path.dirname(d), exist_ok=True)
    sm = os.path.join(P, 'artifact-assets', 'small2', os.path.basename(v))   # Racer im Artefakt verkleinert (halbe Dreiecke, Textur 1024²): geladen wird ohnehin nur der gewählte, Grenze 64 MB je Version
    if v.endswith('_browser.v3.glb') and os.path.exists(sm): src = sm
    if os.path.exists(d): continue
    if d.endswith('.b64.txt'): open(d, 'w').write(base64.b64encode(open(src, 'rb').read()).decode())
    else: shutil.copy(src, d)
json.dump(sorted(set(mp.values())), open(OUT + '/files.json', 'w')); print('ok', len(set(mp.values())), len(s))
