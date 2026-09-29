import {
  AppBase, AppOptions, CameraComponentSystem, Color, Entity, FILLMODE_FILL_WINDOW,
  LightComponentSystem, Mat4, Quat, RenderComponentSystem, RESOLUTION_AUTO,
  StandardMaterial, Vec3, VertexBuffer, VertexFormat, createGraphicsDevice
} from 'playcanvas';

const ENGINE_VERSION = '2.22.4';
const canvas = document.getElementById('application-canvas');
const device = await createGraphicsDevice(canvas, { deviceTypes: ['webgl2'] });
device.maxPixelRatio = 1;

const options = new AppOptions();
options.graphicsDevice = device;
options.componentSystems = [RenderComponentSystem, CameraComponentSystem, LightComponentSystem];
options.resourceHandlers = [];
const app = new AppBase(canvas);
app.init(options);
app.setCanvasFillMode(FILLMODE_FILL_WINDOW);
app.setCanvasResolution(RESOLUTION_AUTO);
app.scene.ambientLight = new Color(0.34, 0.34, 0.34);
app.scene.exposure = 1;
app.start();
window.__PC_ARCH_BENCH__ = { app, engineVersion: ENGINE_VERSION, ready: false, lastSweep: null };

const resize = () => app.resizeCanvas();
window.addEventListener('resize', resize);

const camera = new Entity('Camera');
camera.addComponent('camera', { clearColor: new Color(0.70, 0.79, 0.80), farClip: 1000, nearClip: 0.1 });
app.root.addChild(camera);

const light = new Entity('Key');
light.addComponent('light', { type: 'directional', intensity: 1.15, castShadows: false, shadowResolution: 1024 });
light.setLocalEulerAngles(48, 32, 0);
app.root.addChild(light);

const sharedMaterial = new StandardMaterial();
sharedMaterial.diffuse = new Color(0.84, 0.46, 0.28);
sharedMaterial.metalness = 0;
sharedMaterial.gloss = 0.25;
sharedMaterial.update();

const groundMaterial = new StandardMaterial();
groundMaterial.diffuse = new Color(0.34, 0.42, 0.36);
groundMaterial.gloss = 0.05;
groundMaterial.update();
const ground = new Entity('Ground');
ground.addComponent('render', { type: 'box', material: groundMaterial, castShadows: false, receiveShadows: true });
ground.setLocalScale(180, 0.2, 180);
ground.setLocalPosition(0, -0.6, 0);
app.root.addChild(ground);

let contentRoot = null;
let instanceBuffer = null;
let state = { mode: 'entities', count: 100, shadows: false, pixelRatio: false };
let view = { yaw: 35, pitch: -28, distance: 55 };
const center = new Vec3(0, 2, 0);

function layoutPosition(i, count, out) {
  const side = Math.ceil(Math.sqrt(count));
  const row = Math.floor(i / side);
  const col = i % side;
  const spacing = 1.35;
  const x = (col - (side - 1) / 2) * spacing;
  const z = (row - (Math.ceil(count / side) - 1) / 2) * spacing;
  const y = 0.1 + ((i * 17) % 5) * 0.08;
  out.set(x, y, z);
}

function destroyContent() {
  if (instanceBuffer) { instanceBuffer.destroy(); instanceBuffer = null; }
  if (contentRoot) { contentRoot.destroy(); contentRoot = null; }
}

function setShadowState(enabled) {
  light.light.castShadows = enabled;
  ground.render.receiveShadows = enabled;
}

function buildEntities(count) {
  contentRoot = new Entity('EntityGrid');
  app.root.addChild(contentRoot);
  const p = new Vec3();
  for (let i = 0; i < count; i++) {
    layoutPosition(i, count, p);
    const e = new Entity(`Box-${i}`);
    e.addComponent('render', { type: 'box', material: sharedMaterial, castShadows: state.shadows, receiveShadows: state.shadows });
    e.setLocalPosition(p);
    e.setLocalScale(0.88, 0.7 + ((i * 7) % 4) * 0.12, 0.88);
    e.setLocalEulerAngles(0, (i * 29) % 360, 0);
    contentRoot.addChild(e);
  }
}

function buildInstanced(count) {
  contentRoot = new Entity('InstancedGrid');
  contentRoot.addComponent('render', { type: 'box', material: sharedMaterial, castShadows: state.shadows, receiveShadows: state.shadows });
  app.root.addChild(contentRoot);
  if (count === 0) { contentRoot.enabled = false; return; }
  const matrices = new Float32Array(count * 16);
  const p = new Vec3(), s = new Vec3(), q = new Quat(), m = new Mat4();
  let k = 0;
  for (let i = 0; i < count; i++) {
    layoutPosition(i, count, p);
    s.set(0.88, 0.7 + ((i * 7) % 4) * 0.12, 0.88);
    q.setFromEulerAngles(0, (i * 29) % 360, 0);
    m.setTRS(p, q, s);
    for (let j = 0; j < 16; j++) matrices[k++] = m.data[j];
  }
  const format = VertexFormat.getDefaultInstancingFormat(app.graphicsDevice);
  instanceBuffer = new VertexBuffer(app.graphicsDevice, format, count, { data: matrices });
  contentRoot.render.meshInstances[0].setInstancing(instanceBuffer, false);
}

function rebuild() {
  destroyContent();
  setShadowState(state.shadows);
  app.graphicsDevice.maxPixelRatio = state.pixelRatio ? Math.min(window.devicePixelRatio || 1, 2) : 1;
  app.resizeCanvas();
  if (state.mode === 'entities') buildEntities(state.count); else buildInstanced(state.count);
  updateView(true);
  document.getElementById('status').textContent = `${state.mode} · ${state.count}`;
  document.getElementById('tris').textContent = (state.count * 12 + 12).toLocaleString();
  document.getElementById('finding').textContent = state.mode === 'entities'
    ? 'Entity mode: every visible cube is its own MeshInstance/draw submission. This is the deliberately expensive baseline.'
    : 'Instanced mode: the same box geometry is submitted through one instanced MeshInstance. Watch draw calls, CPU render time and frame time.';
}

function updateView(force = false) {
  const side = Math.max(1, Math.ceil(Math.sqrt(Math.max(state.count, 1))));
  if (force) view.distance = Math.max(18, side * 1.7);
  const yr = view.yaw * Math.PI / 180;
  const pr = view.pitch * Math.PI / 180;
  const cp = Math.cos(pr);
  camera.setPosition(
    center.x + Math.sin(yr) * cp * view.distance,
    center.y - Math.sin(pr) * view.distance,
    center.z + Math.cos(yr) * cp * view.distance
  );
  camera.lookAt(center);
}

let drag = null;
canvas.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, y: e.clientY, yaw: view.yaw, pitch: view.pitch }; canvas.setPointerCapture(e.pointerId); });
canvas.addEventListener('pointermove', (e) => { if (!drag) return; view.yaw = drag.yaw - (e.clientX - drag.x) * 0.25; view.pitch = Math.max(-75, Math.min(5, drag.pitch + (e.clientY - drag.y) * 0.2)); updateView(); });
canvas.addEventListener('pointerup', () => drag = null);
canvas.addEventListener('wheel', (e) => { e.preventDefault(); view.distance = Math.max(6, Math.min(180, view.distance * Math.exp(e.deltaY * 0.001))); updateView(); }, { passive: false });

const metric = id => document.getElementById(id);
let ema = { frame: 0, render: 0, draws: 0, fps: 0, vram: 0 };
let warm = 0;
let frameCounter = 0;
app.on('frameend', () => {
  frameCounter++;
  const s = app.stats;
  const a = warm++ < 20 ? 1 : 0.12;
  const mix = (old, val) => old ? old * (1 - a) + val * a : val;
  ema.frame = mix(ema.frame, s.frameTime || 0);
  ema.render = mix(ema.render, s.cpuRenderTime || 0);
  ema.draws = mix(ema.draws, s.drawCallCount || 0);
  ema.fps = mix(ema.fps, s.fps || (s.frameTime > 0 ? 1000 / s.frameTime : 0));
  ema.vram = mix(ema.vram, s.vramTotalBytes || 0);
  metric('fps').textContent = ema.fps ? ema.fps.toFixed(0) : '—';
  metric('frame').textContent = ema.frame ? `${ema.frame.toFixed(1)} ms` : '—';
  metric('render').textContent = `${ema.render.toFixed(2)} ms`;
  metric('draws').textContent = Math.round(ema.draws).toLocaleString();
  metric('vram').textContent = `${(ema.vram / 1048576).toFixed(1)} MB`;
});

function selectButton(group, selector, attr, value) {
  document.querySelectorAll(`${group} button`).forEach(b => b.classList.toggle('active', b.dataset[attr] === String(value)));
}

document.getElementById('mode-controls').addEventListener('click', e => {
  const b = e.target.closest('button[data-mode]'); if (!b) return;
  state.mode = b.dataset.mode; selectButton('#mode-controls', '', 'mode', state.mode); warm = 0; rebuild();
});
document.getElementById('count-controls').addEventListener('click', e => {
  const b = e.target.closest('button[data-count]'); if (!b) return;
  state.count = Number(b.dataset.count); selectButton('#count-controls', '', 'count', state.count); warm = 0; rebuild();
});
document.getElementById('shadows').addEventListener('change', e => { state.shadows = e.target.checked; warm = 0; rebuild(); });
document.getElementById('pixelratio').addEventListener('change', e => { state.pixelRatio = e.target.checked; warm = 0; rebuild(); });
document.getElementById('reset-view').addEventListener('click', () => { view.yaw = 35; view.pitch = -28; rebuild(); });

const sleep = ms => new Promise(r => setTimeout(r, ms));
async function sample(seconds = 1.6) {
  const rows = [];
  const startFrame = frameCounter;
  const end = Date.now() + Math.max(0.1, Number(seconds) || 1.6) * 1000;
  do {
    await new Promise(resolve => setTimeout(resolve, 34));
    const s = app.stats;
    rows.push({ frame: s.frameTime || 0, render: s.cpuRenderTime || 0, draws: s.drawCallCount || 0, vram: s.vramTotalBytes || 0 });
  } while (Date.now() < end);
  const avg = k => rows.length ? rows.reduce((a, r) => a + r[k], 0) / rows.length : 0;
  return { frames: frameCounter - startFrame, samples: rows.length, frameMs: avg('frame'), cpuRenderMs: avg('render'), drawCalls: avg('draws'), vramMB: avg('vram') / 1048576 };
}

let running = false;
document.getElementById('autorun').addEventListener('click', async () => {
  if (running) return; running = true;
  const out = document.getElementById('results'); out.textContent = 'running sweep…';
  const original = { ...state }; const cases = [];
  try {
    for (const mode of ['entities', 'instanced']) {
      for (const count of [100, 500, 1000, 2000]) {
        state = { mode, count, shadows: false, pixelRatio: false };
        warm = 0; rebuild(); await sleep(450);
        const r = await sample(1.25); cases.push({ mode, count, ...r });
        out.textContent = cases.map(x => `${x.mode.padEnd(9)} ${String(x.count).padStart(4)} · ${x.frameMs.toFixed(1)}ms · ${x.cpuRenderMs.toFixed(2)}ms CPU · ${x.drawCalls.toFixed(0)} draws`).join('\n');
      }
    }
    window.__PC_ARCH_BENCH__.lastSweep = cases;
    document.getElementById('status').textContent = 'sweep complete';
  } finally {
    state = original; rebuild(); running = false;
  }
});

rebuild();

window.__PC_ARCH_BENCH__.setCase = async ({ mode = state.mode, count = state.count, shadows = state.shadows, pixelRatio = state.pixelRatio } = {}) => {
  state = { mode, count: Number(count), shadows: Boolean(shadows), pixelRatio: Boolean(pixelRatio) };
  document.getElementById('shadows').checked = state.shadows;
  document.getElementById('pixelratio').checked = state.pixelRatio;
  selectButton('#mode-controls', '', 'mode', state.mode);
  selectButton('#count-controls', '', 'count', state.count);
  warm = 0;
  rebuild();
  await sleep(350);
  return window.__PC_ARCH_BENCH__.snapshot();
};
window.__PC_ARCH_BENCH__.snapshot = () => ({
  mode: state.mode, count: state.count, shadows: state.shadows, pixelRatio: state.pixelRatio,
  webgl2: Boolean(app.graphicsDevice.isWebGL2), deviceType: app.graphicsDevice.deviceType,
  fps: app.stats.fps, frameMs: app.stats.frameTime, cpuRenderMs: app.stats.cpuRenderTime,
  drawCalls: app.stats.drawCallCount, vramMB: app.stats.vramTotalBytes / 1048576,
  estimatedTriangles: state.count * 12 + 12
});
window.__PC_ARCH_BENCH__.sample = sample;
window.__PC_ARCH_BENCH__.ready = true;
document.documentElement.dataset.pcArchReady = '1';
document.getElementById('status').textContent = `${state.mode} · ${state.count} · ready`;
