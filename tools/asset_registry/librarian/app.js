import { LIVE_REGISTRY_BASE, PROFILES_URL, RESULT_LIMIT, $, state, fetchJSON, option, setBusy, showError, persistSelection, registryBase, setRegistryMode, setBrowseMode } from './state.js';
import { ensureCatalog, ensureRigFacts, ensureProblems, renderMetrics, refreshMultiFilterSummaries } from './registry.js';
import { searchRegistry } from './search.js';
import { setResultView, renderResults, showDetail, closeDetail } from './render.js';
import { updateSelectionUI, renderConsumerBoundary, buildHandoff, copyText, downloadJSON } from './selection.js';
import { fitCamera, setWireframe, playClip, animationState } from './preview.js';
import { initProductionResources } from './resources-ui.js';
import { initModuleKitWorkbench } from './module-kit.js';

let productionUi;
let moduleKitUi;
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

function updateSearchMeta(result) {
  const shown=result.rows.length, total=result.total, raw=result.rawTotal;
  const mode=state.browseMode==='primary'?'primary matches':'matches';
  $('resultMeta').classList.remove('error');
  $('resultMeta').textContent = `${shown.toLocaleString()} shown · ${total.toLocaleString()} ${mode}${raw!==total?` · ${raw.toLocaleString()} raw matches`:''}`;
  const remaining=Math.max(0,total-shown);
  $('loadMoreButton').hidden=remaining===0;
  $('loadMoreButton').textContent=remaining?`Show ${Math.min(RESULT_LIMIT,remaining).toLocaleString()} more`:'Show more';
}
export async function runSearch({ resetLimit=true } = {}) {
  const aliasPack=moduleKitUi?.resolveAlias?.($('searchInput').value.trim());
  if(aliasPack&&!$('packFilter').value){$('packFilter').value=aliasPack;$('searchInput').value='';await moduleKitUi.openPack(aliasPack,{updateUrl:true});}
  if (resetLimit) state.resultVisibleLimit=RESULT_LIMIT;
  const result = await searchRegistry();
  state.lastResults = result.rows;
  renderResults(result.rows);
  updateSearchMeta(result);
  return result;
}
function clearMultiChecks(id){for(const input of $(id)?.querySelectorAll('input[type="checkbox"]')||[])input.checked=false;}
function resetFilters() {
  for (const id of ['searchInput','kindFilter','packFilter','collectionFilter','dependencyFilter','problemFilter','rigFilter','animatedFilter','clipFilter','jointFilter']) if($(id))$(id).value = '';
  clearMultiChecks('typeFilterOptions'); clearMultiChecks('formatFilterOptions');
  setBrowseMode('primary'); $('browseModeFilter').value='primary'; refreshMultiFilterSummaries();
  state.resultVisibleLimit=RESULT_LIMIT; state.lastResults = [];
  $('resultList').replaceChildren(); $('loadMoreButton').hidden=true;
  $('resultMeta').textContent = 'Enter a query or choose filters.';
}
async function toggleFilters() {
  const hidden = !$('advancedFilters').hidden;
  $('advancedFilters').hidden = hidden;
  $('filtersToggle').setAttribute('aria-expanded', hidden ? 'false' : 'true');
  $('filtersToggle').textContent = hidden ? 'More filters' : 'Hide filters';
  if (!hidden) await ensureCatalog();
}
function toggleTechnical() {
  const open = !$('technicalDetails').classList.contains('open');
  $('technicalDetails').classList.toggle('open', open);
  $('technicalDetails').setAttribute('aria-hidden', open ? 'false' : 'true');
  $('technicalToggle').setAttribute('aria-expanded', open ? 'true' : 'false');
  $('technicalToggle').textContent = open ? 'Hide technical details' : 'Technical details';
}
function hasMultiSelection(id){return Boolean($(id)?.querySelector('input[type="checkbox"]:checked'));}
function hasSearchIntent() {
  const base=['searchInput','kindFilter','packFilter','collectionFilter','dependencyFilter','problemFilter','rigFilter','animatedFilter','clipFilter','jointFilter'].some((id) => String($(id)?.value || '').trim());
  return base || hasMultiSelection('typeFilterOptions') || hasMultiSelection('formatFilterOptions') || state.browseMode==='all';
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
  $('browseModeFilter').value = state.browseMode;
  closeDetail();
  state.lastResults = [];
  $('resultList').replaceChildren(); $('loadMoreButton').hidden=true;
  setBusy(true, `Loading ${state.registryMode} registry…`);
  try {
    const base = registryBase();
    const [manifest, packs, profileDoc, rigSummary] = await Promise.all([
      fetchJSON(`${base}/manifest.json`), fetchJSON(`${base}/packs/index.json`), fetchJSON(PROFILES_URL), fetchJSON(`${base}/rigfacts-summary.json`, true),
    ]);
    if (token !== registryLoadToken) return;
    state.manifest = manifest; state.packs = packs; state.profiles = profileDoc.profiles || {}; state.rigSummary = rigSummary;
    $('registryStatus').classList.remove('error');
    $('registryStatus').textContent = 'Registry ready';
    $('sourceCommit').textContent = formatSourceLine(manifest);
    $('packFilter').replaceChildren(option('', 'All packs'), ...packs.map((pack) => option(pack.packId, String(pack.displayName||pack.packId).replaceAll('_',' '))));
    $('consumerSelect').replaceChildren(...Object.entries(state.profiles).map(([id, profile]) => option(id, profile.displayName || id)));
    renderMetrics(); renderConsumerBoundary(); setResultView(state.viewMode); updateSelectionUI(); setBusy(false);
    if (rerun && hasSearchIntent()) await runSearch();
    else $('resultMeta').textContent = state.registryMode === 'live' ? 'Live Registry ready. New generated asset uploads appear here without a site redeploy.' : 'Canonical Registry ready.';
  } catch (error) {
    if (state.registryMode === 'live' && allowFallback) {
      setRegistryMode('canonical');
      $('registryModeSelect').value = 'canonical';
      await loadRegistry('canonical', { rerun, allowFallback:false });
      $('registryStatus').textContent = 'Registry ready';
      $('sourceCommit').textContent = `CANONICAL · live unavailable · ${$('sourceCommit').textContent.replace(/^CANONICAL · /,'')}`;
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

async function bootstrap() {
  $('browseModeFilter').value=state.browseMode; refreshMultiFilterSummaries(); await loadRegistry(state.registryMode, { allowFallback:true });
  moduleKitUi=await initModuleKitWorkbench();
  if(moduleKitUi.initialPackId){$('packFilter').value=moduleKitUi.initialPackId;await moduleKitUi.openPack(moduleKitUi.initialPackId,{updateUrl:false});await runSearch();}
}

productionUi = initProductionResources({ showAsset: openAssetFromResource });
// Town v1.6 remains a compatibility module and may set its historical visible version during module init.
// v1.7 is the current shell version after all dependency initializers have run.
document.title='KFB Asset Librarian v1.7';
const visibleVersion=document.querySelector('h1 span'); if(visibleVersion)visibleVersion.textContent='v1.7';

$('searchButton').onclick = () => runSearch().catch(showError);
$('searchInput').onkeydown = (event) => { if (event.key === 'Enter') runSearch().catch(showError); };
$('kaykitPreset').onclick = () => { $('searchInput').value = 'KayKit'; $('kindFilter').value = ''; $('packFilter').value=''; $('moduleKitPanel').hidden=true; setBrowseMode('primary'); $('browseModeFilter').value='primary'; setResultView('gallery'); runSearch().catch(showError); };
$('packFilter').onchange = (event) => { moduleKitUi?.openPack?.(event.target.value,{updateUrl:true}).catch(showError); };
$('browseModeFilter').onchange = (event) => { setBrowseMode(event.target.value); if(hasSearchIntent())runSearch().catch(showError); };
$('loadMoreButton').onclick = () => { state.resultVisibleLimit += RESULT_LIMIT; runSearch({resetLimit:false}).catch(showError); };
$('resetButton').onclick = resetFilters;
$('filtersToggle').onclick = () => toggleFilters().catch(showError);
$('typeFilterOptions').onchange = refreshMultiFilterSummaries;
$('formatFilterOptions').onchange = refreshMultiFilterSummaries;
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
$('copyHandoff').onclick = async () => copyText(JSON.stringify(await buildHandoff(), null, 2) + '
');
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

const publicApi = { version:'1.5', runSearch, showDetail, buildHandoff, activateProductionTab: productionUi.activateProductionTab, setRegistryMode:(mode)=>loadRegistry(mode,{rerun:true}), ensureCatalog, ensureRigFacts, ensureProblems, moduleKitState:()=>moduleKitUi?.getState?.()||null, getState:() => ({ selectedAssetIds:[...state.selected].sort(), activeAssetId:state.active, viewMode:state.viewMode, registryMode:state.registryMode, browseMode:state.browseMode, resultVisibleLimit:state.resultVisibleLimit, sourceCommit:state.manifest?.sourceCommit || null }) };
window.KFBAssetLibrarianV12 = publicApi;
window.KFBAssetLibrarianV13 = publicApi;
window.KFBAssetLibrarianV14 = publicApi;
window.KFBAssetLibrarianV15 = publicApi;
window.KFBAssetLibrarianV17 = { ...publicApi, version:'1.7', loadMore:()=>{state.resultVisibleLimit+=RESULT_LIMIT;return runSearch({resetLimit:false});} };
updateSelectionUI(); bootstrap();
setInterval(pollLiveRegistry, 90_000);
