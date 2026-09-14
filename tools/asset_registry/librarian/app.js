import { LIVE_REGISTRY_BASE, PROFILES_URL, $, state, fetchJSON, option, setBusy, showError, persistSelection, registryBase, setRegistryMode } from './state.js';
import { ensureCatalog, ensureRigFacts, ensureProblems, renderMetrics } from './registry.js';
import { searchRegistry } from './search.js';
import { setResultView, renderResults, showDetail, closeDetail } from './render.js';
import { updateSelectionUI, renderConsumerBoundary, buildHandoff, copyText, downloadJSON } from './selection.js';
import { fitCamera, setWireframe, playClip, animationState } from './preview.js';
import { initProductionResources } from './resources-ui.js';

let productionUi;
let registryLoadToken = 0;

function closeSelection() {
  $('selectionTray').classList.remove('open');
  $('selectionTray').setAttribute('aria-hidden', 'true');
  $('selectionButton').setAttribute('aria-expanded', 'false');
  if (!$('detailPanel').classList.contains('open') && !$('resourceDetailPanel').classList.contains('open')) $('drawerBackdrop').hidden = true;
}
function openSelection() {
  closeDetail();
  productionUi?.closeResourceDetail();
  $('selectionTray').classList.add('open');
  $('selectionTray').setAttribute('aria-hidden', 'false');
  $('selectionButton').setAttribute('aria-expanded', 'true');
  $('drawerBackdrop').hidden = false;
}
function closePanels() { closeDetail(); closeSelection(); productionUi?.closeResourceDetail(); $('drawerBackdrop').hidden = true; }

export async function runSearch() {
  const result = await searchRegistry();
  state.lastResults = result.rows;
  renderResults(result.rows);
  $('resultMeta').classList.remove('error');
  $('resultMeta').textContent = `${result.rows.length.toLocaleString()} shown · ${result.total.toLocaleString()} matches`;
  return result;
}
function resetFilters() {
  for (const id of ['searchInput','kindFilter','packFilter','collectionFilter','formatFilter','dependencyFilter','problemFilter','rigFilter','animatedFilter','clipFilter','jointFilter']) $(id).value = '';
  state.lastResults = [];
  $('resultList').replaceChildren();
  $('resultMeta').textContent = 'Enter a query or choose filters.';
}
function toggleFilters() {
  const hidden = !$('advancedFilters').hidden;
  $('advancedFilters').hidden = hidden;
  $('filtersToggle').setAttribute('aria-expanded', hidden ? 'false' : 'true');
  $('filtersToggle').textContent = hidden ? 'More filters' : 'Hide filters';
}
function toggleTechnical() {
  const open = !$('technicalDetails').classList.contains('open');
  $('technicalDetails').classList.toggle('open', open);
  $('technicalDetails').setAttribute('aria-hidden', open ? 'false' : 'true');
  $('technicalToggle').setAttribute('aria-expanded', open ? 'true' : 'false');
  $('technicalToggle').textContent = open ? 'Hide technical details' : 'Technical details';
}
function hasSearchIntent() {
  return ['searchInput','kindFilter','packFilter','collectionFilter','formatFilter','dependencyFilter','problemFilter','rigFilter','animatedFilter','clipFilter','jointFilter'].some((id) => String($(id).value || '').trim());
}
function formatSourceLine(manifest) {
  const commit = String(manifest?.sourceCommit || '').slice(0, 12) || 'unknown';
  const count = Number(manifest?.counts?.total || 0).toLocaleString();
  const when = manifest?.sourceCommitTime ? ` · ${manifest.sourceCommitTime}` : '';
  return `${state.registryMode.toUpperCase()} · ${commit} · ${count} assets${when}`;
}

async function loadRegistry(mode = state.registryMode, { rerun = false, allowFallback = true } = {}) {
  const token = ++registryLoadToken;
  setRegistryMode(mode);
  $('registryModeSelect').value = state.registryMode;
  closeDetail();
  state.lastResults = [];
  $('resultList').replaceChildren();
  setBusy(true, `Loading ${state.registryMode} registry…`);
  try {
    const base = registryBase();
    const [manifest, packs, profileDoc, rigSummary] = await Promise.all([
      fetchJSON(`${base}/manifest.json`), fetchJSON(`${base}/packs/index.json`), fetchJSON(PROFILES_URL), fetchJSON(`${base}/rigfacts-summary.json`, true),
    ]);
    if (token !== registryLoadToken) return;
    state.manifest = manifest; state.packs = packs; state.profiles = profileDoc.profiles || {}; state.rigSummary = rigSummary;
    $('registryStatus').classList.remove('error');
    $('registryStatus').textContent = `${state.registryMode.toUpperCase()} · Registry ready`;
    $('sourceCommit').textContent = formatSourceLine(manifest);
    $('packFilter').replaceChildren(option('', 'All packs'), ...packs.map((pack) => option(pack.packId, pack.packId)));
    $('consumerSelect').replaceChildren(...Object.entries(state.profiles).map(([id, profile]) => option(id, profile.displayName || id)));
    renderMetrics(); renderConsumerBoundary(); setResultView(state.viewMode); updateSelectionUI(); setBusy(false);
    if (rerun && hasSearchIntent()) await runSearch();
    else $('resultMeta').textContent = state.registryMode === 'live' ? 'Live Registry ready. New generated asset uploads appear here without a site redeploy.' : 'Canonical Registry ready.';
  } catch (error) {
    if (state.registryMode === 'live' && allowFallback) {
      setRegistryMode('canonical');
      $('registryModeSelect').value = 'canonical';
      await loadRegistry('canonical', { rerun, allowFallback:false });
      $('registryStatus').textContent = 'CANONICAL · live unavailable';
      $('registryStatus').classList.add('error');
      return;
    }
    document.body.classList.remove('loading'); $('registryStatus').textContent = 'Registry unavailable'; $('registryStatus').classList.add('error'); $('resultMeta').textContent = `Registry unavailable: ${error.message}`;
  }
}

async function pollLiveRegistry() {
  if (state.registryMode !== 'live') return;
  try {
    const manifest = await fetchJSON(`${LIVE_REGISTRY_BASE}/manifest.json`, true);
    if (!manifest?.sourceCommit || manifest.sourceCommit === state.manifest?.sourceCommit) return;
    const rerun = hasSearchIntent();
    await loadRegistry('live', { rerun, allowFallback:false });
  } catch { /* polling is best-effort; explicit mode switch still reports failures */ }
}

async function openAssetFromResource(assetId, clipName = null) {
  await productionUi.activateProductionTab('assets');
  await showDetail(assetId);
  if (!clipName) return;
  const select = $('clipSelect');
  const match = [...select.options].find((node) => node.textContent === clipName);
  if (!match || match.value === '') return;
  select.value = match.value;
  $('autoplayToggle').checked = true;
  playClip(Number(match.value));
}

async function bootstrap() { await loadRegistry(state.registryMode, { allowFallback:true }); }

productionUi = initProductionResources({ showAsset: openAssetFromResource });

$('searchButton').onclick = () => runSearch().catch(showError);
$('searchInput').onkeydown = (event) => { if (event.key === 'Enter') runSearch().catch(showError); };
$('kaykitPreset').onclick = () => { $('searchInput').value = 'KayKit'; $('kindFilter').value = ''; setResultView('gallery'); runSearch().catch(showError); };
$('resetButton').onclick = resetFilters;
$('filtersToggle').onclick = toggleFilters;
$('listViewButton').onclick = () => setResultView('list');
$('galleryViewButton').onclick = () => setResultView('gallery');
$('registryModeSelect').onchange = (event) => loadRegistry(event.target.value, { rerun:true, allowFallback:true }).catch(showError);
$('selectionButton').onclick = openSelection;
$('selectionClose').onclick = closeSelection;
$('detailClose').onclick = closeDetail;
$('drawerBackdrop').onclick = closePanels;
$('technicalToggle').onclick = toggleTechnical;
$('clearSelection').onclick = () => { state.selected.clear(); persistSelection(); updateSelectionUI(); renderResults(state.lastResults); if (state.active) $('toggleSelection').textContent = 'Add'; };
$('consumerSelect').onchange = renderConsumerBoundary;
$('copyHandoff').onclick = async () => copyText(JSON.stringify(await buildHandoff(), null, 2) + '\n');
$('downloadHandoff').onclick = async () => downloadJSON(`kfb-asset-handoff-${$('consumerSelect').value}.json`, await buildHandoff());
$('resetCamera').onclick = fitCamera;
$('fitCamera').onclick = fitCamera;
$('wireframeToggle').onchange = (event) => setWireframe(event.target.checked);
$('autoplayToggle').onchange = (event) => {
  const { mixer, loadedAnimations } = animationState();
  if (!loadedAnimations.length) return;
  if (event.target.checked) { const i = Number($('clipSelect').value || 0); $('clipSelect').value = String(i); playClip(i); }
  else if (mixer) { mixer.stopAllAction(); $('previewStatus').textContent = `${loadedAnimations.length} clip(s) · paused`; }
};
$('clipSelect').onchange = (event) => { if (event.target.value === '') return; $('autoplayToggle').checked = true; playClip(Number(event.target.value)); };
document.addEventListener('kfb-open-asset', (event) => showDetail(event.detail).catch(showError));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closePanels(); });

const publicApi = { version:'1.4', runSearch, showDetail, buildHandoff, activateProductionTab: productionUi.activateProductionTab, setRegistryMode:(mode)=>loadRegistry(mode,{rerun:true}), ensureCatalog, ensureRigFacts, ensureProblems, getState:() => ({ selectedAssetIds:[...state.selected].sort(), activeAssetId:state.active, viewMode:state.viewMode, registryMode:state.registryMode, sourceCommit:state.manifest?.sourceCommit || null }) };
window.KFBAssetLibrarianV12 = publicApi;
window.KFBAssetLibrarianV13 = publicApi;
window.KFBAssetLibrarianV14 = publicApi;
updateSelectionUI(); bootstrap();
setInterval(pollLiveRegistry, 90_000);
