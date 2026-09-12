import { REGISTRY_BASE, PROFILES_URL, $, state, fetchJSON, option, setBusy, showError, persistSelection } from './state.js';
import { ensureCatalog, ensureRigFacts, ensureProblems, renderMetrics } from './registry.js';
import { searchRegistry } from './search.js';
import { setResultView, renderResults, showDetail, closeDetail } from './render.js';
import { updateSelectionUI, renderConsumerBoundary, buildHandoff, copyText, downloadJSON } from './selection.js';
import { fitCamera, setWireframe, playClip, animationState } from './preview.js';

function closeSelection() {
  $('selectionTray').classList.remove('open');
  $('selectionTray').setAttribute('aria-hidden', 'true');
  $('selectionButton').setAttribute('aria-expanded', 'false');
  if (!$('detailPanel').classList.contains('open')) $('drawerBackdrop').hidden = true;
}
function openSelection() {
  closeDetail();
  $('selectionTray').classList.add('open');
  $('selectionTray').setAttribute('aria-hidden', 'false');
  $('selectionButton').setAttribute('aria-expanded', 'true');
  $('drawerBackdrop').hidden = false;
}
function closePanels() { closeDetail(); closeSelection(); $('drawerBackdrop').hidden = true; }

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

async function bootstrap() {
  try {
    setBusy(true, 'Loading manifest…');
    const [manifest, packs, profileDoc, rigSummary] = await Promise.all([
      fetchJSON(`${REGISTRY_BASE}/manifest.json`), fetchJSON(`${REGISTRY_BASE}/packs/index.json`), fetchJSON(PROFILES_URL), fetchJSON(`${REGISTRY_BASE}/rigfacts-summary.json`, true),
    ]);
    state.manifest = manifest; state.packs = packs; state.profiles = profileDoc.profiles || {}; state.rigSummary = rigSummary;
    $('sourceCommit').textContent = manifest.sourceCommit || '';
    $('packFilter').replaceChildren(option('', 'All packs'), ...packs.map((pack) => option(pack.packId, pack.packId)));
    $('consumerSelect').replaceChildren(...Object.entries(state.profiles).map(([id, profile]) => option(id, profile.displayName || id)));
    renderMetrics(); renderConsumerBoundary(); setResultView(state.viewMode); updateSelectionUI(); setBusy(false);
  } catch (error) {
    document.body.classList.remove('loading'); $('registryStatus').textContent = 'Registry unavailable'; $('registryStatus').classList.add('error'); $('resultMeta').textContent = `Registry unavailable: ${error.message}`;
  }
}

$('searchButton').onclick = () => runSearch().catch(showError);
$('searchInput').onkeydown = (event) => { if (event.key === 'Enter') runSearch().catch(showError); };
$('resetButton').onclick = resetFilters;
$('filtersToggle').onclick = toggleFilters;
$('listViewButton').onclick = () => setResultView('list');
$('galleryViewButton').onclick = () => setResultView('gallery');
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

window.KFBAssetLibrarianV12 = { version:'1.2', runSearch, showDetail, buildHandoff, ensureCatalog, ensureRigFacts, ensureProblems, getState:() => ({ selectedAssetIds:[...state.selected].sort(), activeAssetId:state.active, viewMode:state.viewMode, sourceCommit:state.manifest?.sourceCommit || null }) };
updateSelectionUI(); bootstrap();
