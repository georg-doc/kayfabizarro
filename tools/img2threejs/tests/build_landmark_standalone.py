"""Build a derived, single-file viewer from the actual repo sources.
Run by the production agent, not a terminal task for Georg. No network required.
The output embeds the current City style as a labelled build-time snapshot;
canonical runtime imports continue to point at the City Lab owner.
"""
from pathlib import Path
import hashlib, json, re, sys
ROOT = Path(__file__).resolve().parents[1]
PILOT = ROOT / 'landmarks/pilot-01'
CITY = ROOT.parent / 'osm-city-lab'
def script(text: str) -> str:
    text = re.sub(r'^import .*?;\n', '', text, flags=re.M)
    return re.sub(r'\bexport (?=(?:const|function|async function))', '', text)
def build(output: Path) -> None:
    style_bytes = (CITY / 'styles/kfb-city-v0.json').read_bytes()
    style = json.loads(style_bytes)
    helpers = (CITY / 'src/style/kfb-city-materials.js').read_text()
    sources = [PILOT / name for name in ['geometry.mjs','presentation.mjs','three-adapter.mjs','glb.mjs','viewer.mjs']]
    pins = {str(p.relative_to(ROOT)):hashlib.sha256(p.read_bytes()).hexdigest() for p in sources}
    pins['cityStyleSha256'] = hashlib.sha256(style_bytes).hexdigest()
    body = '\n'.join([script(helpers)] + [script(p.read_text()) for p in sources])
    entry = """const timer=setTimeout(()=>document.querySelector('#status').textContent='Still loading Three.js. Check access to unpkg.com.',12000);
try {
const THREE=await import('three');
const {OrbitControls}=await import('three/addons/controls/OrbitControls.js');
"""
    entry += 'window.__KFB_EMBEDDED_CITY_STYLE__='+json.dumps(style)+';\n'
    entry += 'window.__KFB_SOURCE_PINS__='+json.dumps(pins)+';\n'+body
    entry += "\nawait boot();clearTimeout(timer);\n}catch(e){clearTimeout(timer);const s=document.querySelector('#status');s.textContent='Viewer could not start: '+e.message;s.classList.add('error');document.querySelector('#export').disabled=true;console.error(e);}\n"
    html=(PILOT/'index.html').read_text()
    html=re.sub(r'<script type="module" id="boot">.*?</script>', lambda m:'<script type="module" id="boot">\n'+entry+'</script>',html,flags=re.S)
    html=html.replace('href="../../prototypes/koelner-dom/v0.2/index.html"','href="https://github.com/georg-doc/kayfabizarro/blob/main/tools/img2threejs/prototypes/koelner-dom/v0.2/index.html"')
    output.write_text(html)
    print(json.dumps({'output':str(output),'bytes':output.stat().st_size,'sha256':hashlib.sha256(output.read_bytes()).hexdigest()}))
if __name__ == '__main__':
    build(Path(sys.argv[1]) if len(sys.argv)>1 else ROOT/'landmark-pilot-01-standalone.html')
