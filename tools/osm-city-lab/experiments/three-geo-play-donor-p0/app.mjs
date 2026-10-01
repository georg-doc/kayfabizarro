import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const BUILD = 'KFB-THREE-GEO-P0-20261001';
const DONOR_URL = 'https://unpkg.com/lm-three-geo-play@2.2.0/dist/three-geo-play.js';
const DONOR_COMMIT = '78a6b822261929a54f731dd08a972cf7b0a11500';
const ORIGIN = Object.freeze({ lat: 50.949425, lon: 6.917500 });
const state = { ready:false, fatal:null, mode:'source', auto:false, loads:0, unloads:0, sourceErrors:0, workerStarts:0, workerFallbacks:0, frames:[], selected:null };

try {
  if (globalThis.Worker) {
    const NativeWorker = globalThis.Worker;
    globalThis.Worker = new Proxy(NativeWorker, {
      construct(Target, args) {
        state.workerStarts += 1;
        return Reflect.construct(Target, args);
      }
    });
  }
} catch (_) {}

const nativeWarn = console.warn.bind(console);
console.warn = function() {
  const msg = Array.from(arguments).map(String).join(' ');
  if (/web workers are not available/i.test(msg)) state.workerFallbacks += 1;
  nativeWarn.apply(console, arguments);
};

document.body.innerHTML =
'<style>*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#151613;color:#efe8d7;font:11px/1.35 ui-monospace,SFMono-Regular,Menlo,monospace}canvas{width:100%;height:100%;display:block}.p{position:fixed;z-index:4;background:#201f1bdc;border:1px solid #5b5749;padding:10px;backdrop-filter:blur(8px)}#a{left:10px;top:10px;max-width:570px}#b{right:10px;top:10px;width:230px}#q{left:10px;bottom:10px;max-width:650px}.g{display:grid;grid-template-columns:1fr auto;gap:2px 8px}.g b{text-align:right}button{font:inherit;padding:6px 8px;margin:6px 4px 0 0;background:#302e27;color:#eee6d4;border:1px solid #6e6855;cursor:pointer}button.on{background:#d0a26b;color:#21170f;font-weight:800}.muted{color:#aaa18f}#fatal{display:none;inset:0;place-items:center;background:#291613;z-index:9;font:700 15px system-ui;text-align:center;padding:30px;white-space:pre-wrap}#fatal.on{display:grid}@media(max-width:760px){#b{top:auto;bottom:10px}#q{bottom:145px}}</style>' +
'<canvas id="c"></canvas>' +
'<div class="p" id="a"><b>THREE-GEO-PLAY / DONOR P0 / EHRENFELD</b><div class="muted">Exact upstream geometry first / Three r160 compatibility</div><button id="src" class="on">A SOURCE</button><button id="kfb">B KFB MATERIAL</button><button id="stream">C RUN STREAM</button><button id="reset">RESET</button></div>' +
'<div class="p" id="b"><div class="g"><span>READY</span><b id="ready">no</b><span>FPS / P95</span><b id="fps">-</b><span>DRAWS / TRI</span><b id="draw">-</b><span>GEO / TEX</span><b id="mem">-</b><span>TILES R/L/F</span><b id="tiles">-</b><span>LOAD / UNLOAD</span><b id="evt">0 / 0</b><span>WORKERS</span><b id="workers">-</b></div></div>' +
'<div class="p" id="q"><b>D QUERY</b> <span id="geo" class="muted">click a feature</span></div>' +
'<div class="p" id="fatal"></div>';

const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({canvas:canvas, antialias:true, powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
renderer.setSize(innerWidth, innerHeight, false);
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xb8c7bf);
scene.fog = new THREE.Fog(0xb8c7bf, 900, 3200);
scene.add(new THREE.HemisphereLight(0xfff1d4, 0x48515c, 2.1));
const sun = new THREE.DirectionalLight(0xffddb5, 2.2);
sun.position.set(-180, 300, 200);
scene.add(sun);

const camera = new THREE.PerspectiveCamera(56, innerWidth/innerHeight, 0.5, 7000);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI * 0.49;
controls.maxDistance = 850;

const anchor = new THREE.Object3D();
scene.add(anchor);
let geo = null;
let sourceStyle = null;
let kfbStyle = null;
let phase = 0;
let lastAnchor = new THREE.Vector3();
let lastFrame = performance.now();
let lastUi = 0;

function resetView() {
  camera.position.set(170,165,215);
  controls.target.set(0,0,0);
  controls.update();
  state.auto = false;
  document.getElementById('stream').classList.remove('on');
  document.getElementById('stream').textContent = 'C RUN STREAM';
  if (geo) geo.setFollowTarget(camera);
}
resetView();

function kfbPaint(style) {
  const palette = {background:0xcbbf9f,building:0xd6a16f,transportation:0x5d5448,landuse:0x8e9c66,landcover:0x7d9162,water:0x6c9ea6,waterway:0x6c9ea6};
  style.forEachType(function(type, layerName) {
    if (type && type.material && type.material.color && palette[layerName] !== undefined) type.material.color.setHex(palette[layerName]);
  });
  style.refresh();
  return style;
}

function setMode(mode) {
  if (!geo) return;
  state.mode = mode;
  geo.setMapStyle((mode === 'source' ? sourceStyle : kfbStyle).clone());
  document.getElementById('src').classList.toggle('on', mode === 'source');
  document.getElementById('kfb').classList.toggle('on', mode === 'kfb');
}

function toggleStream() {
  if (!geo) return;
  state.auto = !state.auto;
  const button = document.getElementById('stream');
  button.classList.toggle('on', state.auto);
  button.textContent = state.auto ? 'C STOP STREAM' : 'C RUN STREAM';
  if (state.auto) {
    anchor.position.copy(controls.target);
    lastAnchor.copy(anchor.position);
    geo.setFollowTarget(anchor);
  } else geo.setFollowTarget(camera);
}

function p95(values) {
  if (!values.length) return 0;
  const a = values.slice().sort(function(x,y){return x-y;});
  return a[Math.max(0, Math.ceil(a.length*0.95)-1)] || 0;
}

function snapshot() {
  const ts = geo ? geo.getTileStats() : {total:0,ready:0,loading:0,failed:0,rebuilding:0};
  const rr = renderer.info.render;
  const mm = renderer.info.memory;
  const avg = state.frames.length ? state.frames.reduce(function(a,b){return a+b;},0)/state.frames.length : 0;
  return {
    build:BUILD, ready:state.ready, fatal:state.fatal, mode:state.mode, auto:state.auto,
    donor:{version:'2.2.0',commit:DONOR_COMMIT}, three:'0.160.0', origin:ORIGIN,
    tiles:ts, events:{load:state.loads,unload:state.unloads,sourceError:state.sourceErrors},
    workers:{starts:state.workerStarts,fallbacks:state.workerFallbacks},
    renderer:{calls:rr.calls,triangles:rr.triangles,geometries:mm.geometries,textures:mm.textures},
    perf:{fps:avg?1000/avg:0,p95Ms:p95(state.frames),samples:state.frames.length},
    dpr:renderer.getPixelRatio(), selected:state.selected,
    source:geo ? geo.getTileSource() : null
  };
}

const api = Object.freeze({snapshot:snapshot,setMode:setMode,toggleStream:toggleStream,reset:resetView});
window.__KFB_THREE_GEO_P0__ = api;

function fatal(error) {
  state.fatal = String(error && (error.stack || error.message || error));
  const box = document.getElementById('fatal');
  box.textContent = 'P0 runtime failed\n\n' + state.fatal;
  box.classList.add('on');
}
addEventListener('error', function(e){ fatal(e.error || e.message); });
addEventListener('unhandledrejection', function(e){ fatal(e.reason); });

document.getElementById('src').onclick = function(){setMode('source');};
document.getElementById('kfb').onclick = function(){setMode('kfb');};
document.getElementById('stream').onclick = toggleStream;
document.getElementById('reset').onclick = resetView;

const ray = new THREE.Raycaster();
const pointer = new THREE.Vector2();
canvas.addEventListener('pointerup', function(e) {
  if (!geo) return;
  const rect = canvas.getBoundingClientRect();
  pointer.set((e.clientX-rect.left)/rect.width*2-1, -(e.clientY-rect.top)/rect.height*2+1);
  ray.setFromCamera(pointer,camera);
  const hit = geo.pickFeature(ray);
  if (!hit) return;
  const p = hit.intersection.point;
  const ll = geo.worldToLatLon(p.x,p.z);
  const h = geo.getHeightAt(p.x,p.z);
  state.selected = {layer:hit.layer,type:hit.type,key:hit.key || null,id:hit.id || null,height:h,lat:ll.lat,lon:ll.lon};
  document.getElementById('geo').textContent = hit.layer + '/' + hit.type + ' / h ' + h.toFixed(1) + 'm / ' + ll.lat.toFixed(6) + ', ' + ll.lon.toFixed(6);
});

addEventListener('resize', function() {
  camera.aspect = innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight,false);
});

try {
  const donor = await import(DONOR_URL);
  geo = new donor.ThreeGeoPlay(scene,camera,renderer,{
    tileUrl:'https://tiles.openfreemap.org/planet',
    originLatLon:ORIGIN,
    zoomLevel:14,
    unitsPerMeter:1,
    renderDistance:2,
    followUpdateInterval:120
  });
  sourceStyle = geo.getMapStyle().clone();
  kfbStyle = kfbPaint(sourceStyle.clone());
  geo.addEventListener('tileload',function(){state.loads += 1;});
  geo.addEventListener('tileunload',function(){state.unloads += 1;});
  geo.addEventListener('sourceerror',function(){state.sourceErrors += 1;});
  geo.start();
} catch (e) { fatal(e); }

renderer.setAnimationLoop(function(now) {
  const dt = Math.min(100, now-lastFrame);
  lastFrame = now;
  state.frames.push(dt);
  if (state.frames.length > 240) state.frames.shift();

  if (state.auto && geo) {
    phase += dt * 0.00012;
    const next = new THREE.Vector3(Math.sin(phase)*1900,0,Math.sin(phase*0.61)*620);
    const delta = next.clone().sub(lastAnchor);
    anchor.position.copy(next);
    camera.position.add(delta);
    controls.target.add(delta);
    lastAnchor.copy(next);
  }

  controls.update();
  if (geo) geo.onFrameUpdate();
  renderer.render(scene,camera);

  if (now-lastUi > 350) {
    lastUi = now;
    const x = snapshot();
    if (!state.ready && x.tiles.ready > 0 && x.source) state.ready = true;
    document.getElementById('ready').textContent = state.ready ? 'yes' : 'no';
    document.getElementById('fps').textContent = x.perf.fps ? x.perf.fps.toFixed(1) + ' / ' + x.perf.p95Ms.toFixed(1) + 'ms' : '-';
    document.getElementById('draw').textContent = x.renderer.calls + ' / ' + x.renderer.triangles.toLocaleString();
    document.getElementById('mem').textContent = x.renderer.geometries + ' / ' + x.renderer.textures;
    document.getElementById('tiles').textContent = (x.tiles.ready||0) + '/' + (x.tiles.loading||0) + '/' + (x.tiles.failed||0);
    document.getElementById('evt').textContent = x.events.load + ' / ' + x.events.unload;
    document.getElementById('workers').textContent = x.workers.fallbacks ? 'fallback ' + x.workers.fallbacks : 'starts ' + x.workers.starts;
  }
});
