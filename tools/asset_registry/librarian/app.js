import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const REGISTRY_BASE = '../../../registry/assets/v1';
const PROFILES_URL = '../consumer_profiles.json';
const RESULT_LIMIT = 80;

const $ = (id) => document.getElementById(id);
const state = {
  manifest: null,
  packs: [],
  profiles: {},
  rigSummary: null,
  catalog: null,
  rigById: null,
  selected: new Set(),
  active: null,
  lastResults: [],
};

async function fetchJSON(url, optional = false) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    if (optional) return null;
    throw new Error(`${response.status} ${response.statusText}: ${url}`);
  }
  return response.json();
}

async function fetchJSONL(url) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  const text = await response.text();
  return text.split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
}

function metric(label, value) {
  const div = document.createElement('div');
  div.className = 'metric';
  const b = document.createElement('b');
  b.textContent = Number(value ?? 0).toLocaleString();
  const span = document.createElement('span');
  span.textContent = label;
  div.append(b, span);
  return div;
}

function renderMetrics() {
  const counts = state.manifest?.counts || {};
  const byKind = counts.byKind || {};
  const nodes = [
    metric('assets', counts.total),
    metric('3D models', byKind['model-3d']),
    metric('images', byKind['image-2d']),
    metric('audio', byKind.audio),
    metric('packs', counts.packs),
    metric('rigged models', state.rigSummary?.riggedModelCount ?? 0),
  ];
  $('metrics').replaceChildren(...nodes);
}

function badge(text, cls = '') {
  const span = document.createElement('span');
  span.className = `badge ${cls}`.trim();
  span.textContent = text;
  return span;
}

function dependencyBadge(record) {
  const status = record.dependencyStatus;
  if (!status) return null;
  return badge(status, status === 'missing' || status === 'unresolved' ? 'warn' : 'ok');
}

function rigBadge(record) {
  const rig = record.rigFacts;
  if (!rig) return null;
  if (rig.parseStatus === 'ok' && rig.hasSkin) return badge(`rig ${rig.jointCount || 0}j`, 'ok');
  if (rig.parseStatus === 'unresolved') return badge('rig ?', 'warn');
  return null;
}

async function ensureCatalog() {
  if (state.catalog) return state.catalog;
  setBusy(true, 'Loading catalog…');
  try {
    state.catalog = await fetchJSONL(`${REGISTRY_BASE}/catalog.jsonl`);
    const formats = [...new Set(state.catalog.map((r) => r.format).filter(Boolean))].sort();
    $('formatFilter').replaceChildren(option('', 'All formats'), ...formats.map((v) => option(v, v)));
    return state.catalog;
  } finally {
    setBusy(false);
  }
}

async function ensureRigFacts() {
  if (state.rigById) return state.rigById;
  setBusy(true, 'Loading rig facts…');
  try {
    const rows = await fetchJSONL(`${REGISTRY_BASE}/rigfacts.jsonl`);
    state.rigById = new Map(rows.map((row) => [row.assetId, row.rigFacts]));
    if (state.catalog) {
      for (const record of state.catalog) {
        const rig = state.rigById.get(record.assetId);
        if (rig) record.rigFacts = rig;
      }
    }
    return state.rigById;
  } finally {
    setBusy(false);
  }
}

function option(value, text) {
  const node = document.createElement('option');
  node.value = value;
  node.textContent = text;
  return node;
}

function filters() {
  return {
    query: $('searchInput').value.trim(),
    kind: $('kindFilter').value,
    pack: $('packFilter').value,
    format: $('formatFilter').value,
    dependencyStatus: $('dependencyFilter').value,
    rigged: $('rigFilter').value,
    animated: $('animatedFilter').value,
    clip: $('clipFilter').value.trim(),
    joint: $('jointFilter').value.trim(),
  };
}

function textRank(record, query) {
  if (!query) return 9;
  const q = query.toLocaleLowerCase();
  const name = String(record.name || '').toLocaleLowerCase();
  const path = String(record.path || '').toLocaleLowerCase();
  const pack = String(record.packId || '').toLocaleLowerCase();
  const collection = String(record.collectionPath || '').toLocaleLowerCase();
  if (name === q) return 0;
  if (name.startsWith(q)) return 1;
  if (name.includes(q)) return 2;
  if (pack.includes(q)) return 3;
  if (collection.includes(q)) return 4;
  if (path.includes(q)) return 5;
  return null;
}

function ternaryMatch(value, wanted) {
  if (!wanted) return true;
  if (wanted === 'yes') return value === true;
  if (wanted === 'no') return value === false;
  return value !== true && value !== false;
}

function applyFilters(records, f) {
  const scored = [];
  for (const record of records) {
    if (f.kind && record.kind !== f.kind) continue;
    if (f.pack && record.packId !== f.pack) continue;
    if (f.format && record.format !== f.format) continue;
    if (f.dependencyStatus && record.dependencyStatus !== f.dependencyStatus) continue;

    const rig = record.rigFacts || {};
    const parsed = rig.parseStatus === 'ok' || rig.parseStatus === 'not-applicable';
    const hasSkin = parsed ? Boolean(rig.hasSkin) : null;
    const hasAnimation = rig.parseStatus === 'ok' ? (rig.animationCount || 0) > 0 : null;
    if (!ternaryMatch(hasSkin, f.rigged)) continue;
    if (!ternaryMatch(hasAnimation, f.animated)) continue;

    if (f.clip) {
      const q = f.clip.toLocaleLowerCase();
      const clips = (rig.animationClips || []).map((c) => c.name).filter(Boolean);
      if (!clips.some((name) => name.toLocaleLowerCase().includes(q))) continue;
    }
    if (f.joint) {
      const q = f.joint.toLocaleLowerCase();
      if (!(rig.jointNames || []).some((name) => name.toLocaleLowerCase().includes(q))) continue;
    }

    const rank = textRank(record, f.query);
    if (rank == null) continue;
    scored.push([rank, record]);
  }
  scored.sort((a, b) => a[0] - b[0] || String(a[1].name).localeCompare(String(b[1].name)) || a[1].path.localeCompare(b[1].path));
  return scored.slice(0, RESULT_LIMIT).map((pair) => pair[1]);
}

async function runSearch() {
  const f = filters();
  const needsRig = Boolean(f.rigged || f.animated || f.clip || f.joint);
  const catalog = await ensureCatalog();
  if (needsRig) await ensureRigFacts();
  state.lastResults = applyFilters(catalog, f);
  renderResults(state.lastResults);
  $('resultMeta').textContent = `${state.lastResults.length.toLocaleString()} shown · limit ${RESULT_LIMIT.toLocaleString()}`;
}

function renderResults(records) {
  const list = $('resultList');
  list.replaceChildren();
  const template = $('resultTemplate');
  for (const record of records) {
    const fragment = template.content.cloneNode(true);
    const card = fragment.querySelector('.result-card');
    const checkbox = fragment.querySelector('.result-select');
    const open = fragment.querySelector('.result-open');
    fragment.querySelector('.result-title').textContent = record.name;
    fragment.querySelector('.result-subtitle').textContent = [record.packId, record.collectionPath].filter(Boolean).join(' · ') || 'unpacked';
    fragment.querySelector('.result-path').textContent = record.path;
    const badges = fragment.querySelector('.result-badges');
    badges.append(badge(record.kind), badge(record.format));
    const dep = dependencyBadge(record); if (dep) badges.append(dep);
    const rig = rigBadge(record); if (rig) badges.append(rig);
    checkbox.checked = state.selected.has(record.assetId);
    checkbox.addEventListener('change', () => toggleSelected(record.assetId, checkbox.checked));
    open.addEventListener('click', () => showDetail(record.assetId));
    if (state.active === record.assetId) card.classList.add('active');
    card.dataset.assetId = record.assetId;
    list.append(fragment);
  }
}

async function showDetail(assetId) {
  await ensureCatalog();
  const record = state.catalog.find((r) => r.assetId === assetId);
  if (!record) return;
  if (record.kind === 'model-3d') {
    await ensureRigFacts();
    record.rigFacts = state.rigById.get(assetId) || null;
  }
  state.active = assetId;
  document.querySelectorAll('.result-card').forEach((el) => el.classList.toggle('active', el.dataset.assetId === assetId));
  $('emptyDetail').hidden = true;
  $('detailContent').hidden = false;
  $('detailKind').textContent = `${record.kind} · ${record.format}`;
  $('detailName').textContent = record.name;
  $('detailPath').textContent = record.path;
  $('detailBadges').replaceChildren(badge(record.packId || 'unpacked'));
  const dep = dependencyBadge(record); if (dep) $('detailBadges').append(dep);
  const rig = rigBadge(record); if (rig) $('detailBadges').append(rig);
  $('openRaw').href = record.source?.rawPinned || record.source?.rawLatest || '#';
  $('toggleSelection').textContent = state.selected.has(assetId) ? 'Remove' : 'Add';
  $('copyRaw').onclick = () => copyText(record.source?.rawPinned || record.source?.rawLatest || '');
  $('toggleSelection').onclick = () => {
    toggleSelected(assetId, !state.selected.has(assetId));
    $('toggleSelection').textContent = state.selected.has(assetId) ? 'Remove' : 'Add';
  };
  renderRigFacts(record.rigFacts);
  renderDependencies(record);
  await renderPreview(record);
}

function renderRigFacts(rig) {
  const target = $('rigFacts');
  target.replaceChildren();
  if (!rig) {
    target.append(fact('not loaded', 'rig facts'));
    return;
  }
  target.append(
    fact(rig.parseStatus || 'unknown', 'parse status'),
    fact(rig.hasSkin === true ? 'yes' : rig.hasSkin === false ? 'no' : 'unknown', 'has skin'),
    fact(rig.jointCount ?? '—', 'joints'),
    fact(rig.animationCount ?? '—', 'animations'),
  );
  const clips = (rig.animationClips || []).map((c) => c.name).filter(Boolean);
  if (clips.length) target.append(fact(clips.slice(0, 8).join(', '), 'clips'));
}

function fact(value, label) {
  const div = document.createElement('div');
  div.className = 'fact';
  const b = document.createElement('b'); b.textContent = String(value);
  const span = document.createElement('span'); span.textContent = label;
  div.append(b, span);
  return div;
}

function renderDependencies(record) {
  const target = $('dependencyFacts');
  target.replaceChildren();
  const deps = record.relations?.dependencies || [];
  if (!deps.length) {
    const p = document.createElement('p');
    p.className = 'small-note';
    p.textContent = record.kind === 'model-3d' ? `No explicit external dependency rows · status ${record.dependencyStatus || 'n/a'}` : 'Not a model dependency record.';
    target.append(p);
    return;
  }
  const ul = document.createElement('ul');
  ul.className = 'dependency-list';
  for (const dep of deps) {
    const li = document.createElement('li');
    const path = dep.resolvedPath || dep.path || dep.uri || 'unknown';
    li.textContent = `${dep.role || 'file'} · ${dep.exists === false ? 'MISSING · ' : ''}${path}`;
    ul.append(li);
  }
  target.append(ul);
}

function toggleSelected(assetId, force) {
  if (force) state.selected.add(assetId); else state.selected.delete(assetId);
  updateSelectionUI();
  document.querySelectorAll('.result-card').forEach((card) => {
    if (card.dataset.assetId === assetId) card.querySelector('.result-select').checked = state.selected.has(assetId);
  });
}

function updateSelectionUI() {
  const count = state.selected.size;
  $('selectionCount').textContent = `${count} selected`;
  $('clearSelection').disabled = count === 0;
  $('copyHandoff').disabled = count === 0;
  $('downloadHandoff').disabled = count === 0;
}

function currentProfile() {
  return state.profiles[$('consumerSelect').value] || null;
}

function renderConsumerBoundary() {
  const profile = currentProfile();
  const target = $('consumerBoundary');
  target.replaceChildren();
  if (!profile) return;
  const strong = document.createElement('strong'); strong.textContent = profile.ownerBoundary || 'Receiving consumer owns suitability.';
  target.append(strong);
  const checks = profile.requiredDownstreamValidation || [];
  if (checks.length) {
    const ul = document.createElement('ul');
    for (const check of checks) { const li = document.createElement('li'); li.textContent = check; ul.append(li); }
    target.append(ul);
  }
}

async function buildHandoff() {
  await ensureCatalog();
  const consumerId = $('consumerSelect').value;
  const profile = state.profiles[consumerId];
  const assets = state.catalog.filter((r) => state.selected.has(r.assetId));
  if (assets.some((r) => r.kind === 'model-3d')) await ensureRigFacts();
  const allowed = new Set(profile?.allowedKinds || []);
  return {
    schema: 'kfb.asset-handoff.v1',
    sourceRepo: state.manifest.sourceRepo,
    sourceCommit: state.manifest.sourceCommit,
    consumer: { consumerId, ...profile },
    selectionStatus: 'candidate-only',
    suitabilityDecision: 'owned-by-receiving-consumer',
    assets: assets.map((record) => ({
      assetId: record.assetId,
      name: record.name,
      path: record.path,
      kind: record.kind,
      format: record.format,
      packId: record.packId,
      collectionPath: record.collectionPath,
      dependencyStatus: record.dependencyStatus,
      source: record.source,
      rigFacts: state.rigById?.get(record.assetId) || record.rigFacts || null,
      consumerKindAllowed: allowed.size ? allowed.has(record.kind) : true,
    })),
  };
}

function downloadJSON(filename, value) {
  const blob = new Blob([JSON.stringify(value, null, 2) + '\n'], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function copyText(text) {
  if (!text) return;
  await navigator.clipboard.writeText(text);
}

function setBusy(busy, text = '') {
  document.body.classList.toggle('loading', busy);
  if (text) $('registryStatus').textContent = text;
  else if (state.manifest) $('registryStatus').textContent = 'Registry ready';
}

function resetFilters() {
  for (const id of ['searchInput', 'kindFilter', 'packFilter', 'formatFilter', 'dependencyFilter', 'rigFilter', 'animatedFilter', 'clipFilter', 'jointFilter']) $(id).value = '';
  state.lastResults = [];
  $('resultList').replaceChildren();
  $('resultMeta').textContent = 'Enter a query or choose filters.';
}

function librarianPacket() {
  return {
    schema: 'kfb.asset-librarian-request.v1',
    mode: 'read-only',
    sourceRepo: state.manifest?.sourceRepo,
    sourceCommit: state.manifest?.sourceCommit,
    question: $('librarianQuestion').value.trim(),
    filters: filters(),
    consumerId: $('consumerSelect').value,
    selectedAssetIds: [...state.selected].sort(),
    availableTools: ['search_assets', 'get_asset', 'get_pack', 'get_dependencies', 'get_rig_facts', 'find_same_skeleton', 'export_handoff'],
    rule: 'Compatibility and suitability are inference until receiving-consumer validation.',
  };
}

let renderer, scene, camera, controls, previewRoot, mixer, clock, previewToken = 0;
function initPreview() {
  if (renderer) return;
  const canvas = $('previewCanvas');
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(38, 1, 0.01, 10000);
  camera.position.set(2.4, 1.8, 2.4);
  controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  scene.add(new THREE.HemisphereLight(0xffffff, 0x777777, 2.4));
  const key = new THREE.DirectionalLight(0xffffff, 2.0); key.position.set(4, 7, 3); scene.add(key);
  clock = new THREE.Clock();
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(canvas);
  resize();
  const loop = () => {
    requestAnimationFrame(loop);
    const dt = clock.getDelta();
    if (mixer) mixer.update(dt);
    controls.update();
    renderer.render(scene, camera);
  };
  loop();
}

function clearPreview() {
  mixer = null;
  if (!previewRoot || !scene) return;
  scene.remove(previewRoot);
  previewRoot.traverse((obj) => {
    if (obj.geometry) obj.geometry.dispose?.();
    const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
    for (const material of materials.filter(Boolean)) {
      for (const value of Object.values(material)) if (value?.isTexture) value.dispose?.();
      material.dispose?.();
    }
  });
  previewRoot = null;
}

async function renderPreview(record) {
  const supported = record.kind === 'model-3d' && ['glb', 'gltf'].includes(record.format);
  $('previewWrap').hidden = !supported;
  clearPreview();
  if (!supported) return;
  initPreview();
  const token = ++previewToken;
  $('previewStatus').textContent = 'Loading…';
  const loader = new GLTFLoader();
  const url = record.source?.rawPinned || record.source?.rawLatest;
  try {
    const gltf = await loader.loadAsync(url);
    if (token !== previewToken) return;
    previewRoot = gltf.scene;
    scene.add(previewRoot);
    const box = new THREE.Box3().setFromObject(previewRoot);
    const sphere = box.getBoundingSphere(new THREE.Sphere());
    const radius = Math.max(sphere.radius, 0.01);
    const vFov = THREE.MathUtils.degToRad(camera.fov);
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * Math.max(camera.aspect, 0.01));
    const fitFov = Math.max(0.01, Math.min(vFov, hFov));
    const distance = (radius / Math.sin(fitFov / 2)) * 1.18;
    const viewDir = new THREE.Vector3(1, 0.65, 1).normalize();
    controls.target.copy(sphere.center);
    camera.near = Math.max(radius / 100, distance - radius * 3, 0.001);
    camera.far = Math.max(distance + radius * 10, 100);
    camera.position.copy(sphere.center).add(viewDir.multiplyScalar(distance));
    camera.updateProjectionMatrix();
    controls.update();
    if (gltf.animations?.length) {
      mixer = new THREE.AnimationMixer(previewRoot);
      mixer.clipAction(gltf.animations[0]).play();
      $('previewStatus').textContent = `${gltf.animations.length} clip(s) · playing first`;
    } else {
      $('previewStatus').textContent = 'Loaded';
    }
  } catch (error) {
    if (token !== previewToken) return;
    $('previewStatus').textContent = `Preview failed: ${error.message}`;
  }
}

async function bootstrap() {
  try {
    setBusy(true, 'Loading manifest…');
    const [manifest, packs, profileDoc, rigSummary] = await Promise.all([
      fetchJSON(`${REGISTRY_BASE}/manifest.json`),
      fetchJSON(`${REGISTRY_BASE}/packs/index.json`),
      fetchJSON(PROFILES_URL),
      fetchJSON(`${REGISTRY_BASE}/rigfacts-summary.json`, true),
    ]);
    state.manifest = manifest;
    state.packs = packs;
    state.profiles = profileDoc.profiles || {};
    state.rigSummary = rigSummary;
    $('sourceCommit').textContent = manifest.sourceCommit || '';
    $('packFilter').replaceChildren(option('', 'All packs'), ...packs.map((p) => option(p.packId, p.packId)));
    const consumers = Object.entries(state.profiles).map(([id, profile]) => option(id, profile.displayName || id));
    $('consumerSelect').replaceChildren(...consumers);
    renderMetrics();
    renderConsumerBoundary();
    setBusy(false);
  } catch (error) {
    document.body.classList.remove('loading');
    $('registryStatus').textContent = 'Registry unavailable';
    $('registryStatus').classList.add('error');
    $('resultMeta').textContent = `Build the registry first: ${error.message}`;
  }
}

$('searchButton').addEventListener('click', () => runSearch().catch(showError));
$('searchInput').addEventListener('keydown', (event) => { if (event.key === 'Enter') runSearch().catch(showError); });
$('resetButton').addEventListener('click', resetFilters);
$('clearSelection').addEventListener('click', () => { state.selected.clear(); updateSelectionUI(); renderResults(state.lastResults); });
$('consumerSelect').addEventListener('change', renderConsumerBoundary);
$('copyHandoff').addEventListener('click', async () => copyText(JSON.stringify(await buildHandoff(), null, 2) + '\n'));
$('downloadHandoff').addEventListener('click', async () => downloadJSON(`kfb-asset-handoff-${$('consumerSelect').value}.json`, await buildHandoff()));
$('copyLibrarianPacket').addEventListener('click', async () => {
  await copyText(JSON.stringify(librarianPacket(), null, 2) + '\n');
  $('librarianPacketStatus').textContent = 'Request packet copied.';
});

function showError(error) {
  $('resultMeta').textContent = error.message;
  $('resultMeta').classList.add('error');
  document.body.classList.remove('loading');
}

updateSelectionUI();
bootstrap();
