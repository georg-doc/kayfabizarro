import {loadVfxCatalog,vfxRows,vfxSearchText,vfxText,vfxPreview,renderVfxDetail} from './vfx-catalog.js';
import { previewRigResource, clearRigPreview, canPreviewRig } from './rig-preview.js';
import { initDeckLibrary } from './deck-library.js';

const RESOURCE_BASE = '../../../registry/resources/v1';
const $ = (id) => document.getElementById(id);
const resourceStyle = document.createElement('link');
resourceStyle.rel = 'stylesheet';
resourceStyle.href = './resources.css';
document.head.append(resourceStyle);

const cache = { manifest:null, actors:null, configs:null, motions:null, fx:null };
let currentTab = 'assets';
let currentRows = [];
let showAssetCallback = null;
let deckUi = null;
let vfxCatalog = null, vfxPending = null, activation = 0;
let legacyStatuses = [];

async function json(url) {
  const response = await fetch(url, { cache:'no-store' });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return response.json();
}
async function jsonl(url) {
  const response = await fetch(url, { cache:'no-store' });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return (await response.text()).split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
}
async function ensureManifest() { if (!cache.manifest) cache.manifest = await json(`${RESOURCE_BASE}/manifest.json`); return cache.manifest; }
async function ensureActors() { if (!cache.actors) cache.actors = await jsonl(`${RESOURCE_BASE}/actors.jsonl`); return cache.actors; }
async function ensureRows(tab) {
  await ensureManifest();
  if (tab === 'actors') return ensureActors();
  if (tab === 'rigs') { if (!cache.configs) cache.configs = await jsonl(`${RESOURCE_BASE}/configs.jsonl`); return cache.configs; }
  if (tab === 'motions') { if (!cache.motions) cache.motions = await jsonl(`${RESOURCE_BASE}/motions.jsonl`); return cache.motions; }
  if (tab === 'fx') { if (!cache.fx) cache.fx = await jsonl(`${RESOURCE_BASE}/fx.jsonl`); return cache.fx; }
  return [];
}
function badge(text, cls='') { const span=document.createElement('span'); span.className=`badge ${cls}`.trim(); span.textContent=text; return span; }
function option(value,text) { const node=document.createElement('option'); node.value=value; node.textContent=text; return node; }
function statusClass(status) { return ['im Spiel','AVAILABLE','CONFIGURED'].includes(status) ? 'ok' : ['vendored ungenutzt','WIP','WIP_CONFIG','DOCUMENTED_REFERENCE'].includes(status) ? 'warn' : ''; }
function closeResourceDetail() {
  clearRigPreview();
  $('resourceDetailPanel').classList.remove('open');
  $('resourceDetailPanel').setAttribute('aria-hidden','true');
  if (!$('detailPanel').classList.contains('open') && !$('selectionTray').classList.contains('open')) $('drawerBackdrop').hidden=true;
}
function openResourceDetail() {
  $('detailPanel').classList.remove('open'); $('detailPanel').setAttribute('aria-hidden','true');
  $('selectionTray').classList.remove('open'); $('selectionTray').setAttribute('aria-hidden','true');
  $('resourceDetailPanel').classList.add('open'); $('resourceDetailPanel').setAttribute('aria-hidden','false'); $('drawerBackdrop').hidden=false;
}
function resourceSummary(row) {
  if (row.kind === 'actor') { const asset=row.assets?.[0]; return `${row.actorKind || 'actor'} · ${row.motionCount || 0} linked motions${asset ? ` · ${asset.format || 'asset'} body` : ''}`; }
  if (row.kind === 'motion') return `${row.motionType || 'motion'}${row.animationSet ? ` · ${row.animationSet}` : ''}${row.trigger ? ` · trigger ${row.trigger}` : ''}`;
  if (row.kind === 'fx') return `${row.fxType || 'FX'}${row.executionStatus ? ` · ${row.executionStatus}` : ''}`;
  return `${row.schema || row.kind}${row.summary?.figure ? ` · ${row.summary.figure}` : ''}`;
}
function actionButton(label, handler, primary=true) { const button=document.createElement('button'); button.type='button'; button.className=primary?'primary':'quiet'; button.textContent=label; button.onclick=handler; return button; }
function linkButton(label, href) { const a=document.createElement('a'); a.className='button-link quiet'; a.textContent=label; a.href=href; a.target='_blank'; a.rel='noreferrer'; return a; }
async function showResource(row) {
  openResourceDetail();
  $('vfxDetailContent').hidden = !row.vfxDonor;
  $('vfxDetailContent').replaceChildren();
  if (row.vfxDonor) {
    clearRigPreview();
    const effect = row.vfxEffect, donor = row.vfxDonor;
    $('resourceDetailKind').textContent = effect?.art || 'Spender';
    $('resourceDetailName').textContent = effect?.name || donor.name;
    $('resourceDetailSummary').textContent = effect ? donor.name : donor.id;
    $('resourceDetailBadges').replaceChildren(...(effect ? [badge(effect.status,statusClass(effect.status))] : []));
    $('resourceDetailJson').textContent = JSON.stringify(effect || donor,null,2);
    $('resourcePrimaryAction').replaceChildren();
    renderVfxDetail(row,$('vfxDetailContent'),$('resourcePrimaryAction'));
    return;
  }
  $('resourceDetailKind').textContent=row.kind;
  $('resourceDetailName').textContent=row.displayName || row.actorId || row.resourceId;
  $('resourceDetailSummary').textContent=resourceSummary(row);
  const badgeNodes=[badge(row.status || 'UNKNOWN',statusClass(row.status)), ...(row.actorRefs || []).map((id)=>badge(id))];
  if (row.scopeRef) badgeNodes.push(badge(row.scopeRef));
  if (currentTab === 'rigs' && canPreviewRig(row)) badgeNodes.push(badge(row.schema === 'kfb.carl.rig/6' || row.schema === 'kfb.pets/1' ? 'owner preview' : 'partial preview', row.schema === 'kfb.carl.rig/6' || row.schema === 'kfb.pets/1' ? 'ok' : 'warn'));
  $('resourceDetailBadges').replaceChildren(...badgeNodes);
  $('resourceDetailJson').textContent=JSON.stringify(row,null,2);
  if (currentTab === 'rigs') await previewRigResource(row); else clearRigPreview();
  const actions=$('resourcePrimaryAction'); actions.replaceChildren();
  if (row.kind === 'actor' && row.assets?.[0]?.exists && showAssetCallback) actions.append(actionButton('Open body asset',()=>showAssetCallback(row.assets[0].assetId)));
  if (row.kind === 'motion' && row.motionType === 'embedded-clip' && row.sourceAssetId && showAssetCallback) {
    actions.append(actionButton(`Preview source clip · ${row.clipName || 'clip'}`,()=>showAssetCallback(row.sourceAssetId,row.clipName)));
    const note=document.createElement('p'); note.className='small-note'; note.textContent='Source-clip preview only. This does not prove retarget or actor compatibility.'; actions.append(note);
  } else if (row.kind === 'motion' && row.executionStatus === 'OWNER_RUNTIME_REQUIRED') {
    const note=document.createElement('p'); note.className='warning-box'; note.textContent='Configured KFB motion. Playback belongs to its owner runtime; Librarian does not fake execution.'; actions.append(note);
  }
  if (row.kind === 'fx' && row.executionStatus === 'OWNER_RUNTIME_REQUIRED') {
    const note=document.createElement('p'); note.className='warning-box'; note.textContent='Configured FX is discoverable, but this resource has no verified standalone playback adapter yet.'; actions.append(note);
  }
  const raw=row.source?.rawPinned || row.source?.rawLatest; if (raw) actions.append(linkButton('Open source',raw));
}
function matchesScope(row, actor) {
  if (!actor) return true;
  if (row.scopeRef === actor) return true;
  if ((row.actorRefs || []).includes(actor)) return true;
  return row.actorId === actor || row.compositionId === actor;
}
function filteredRows() {
  const q=$('resourceSearch').value.trim().toLowerCase(), actor=$('resourceActorFilter').value, status=$('resourceStatusFilter').value;
  const scope = currentTab === 'fx' ? $('resourceFxScope').value : '';
  const rows = scope === 'donors' ? (vfxCatalog?.document?.spender || []).map(donor=>({vfxDonor:donor})) : currentRows;
  return rows.filter((row)=>{
    if (row.vfxDonor) {
      const effect=row.vfxEffect, donor=row.vfxDonor;
      if (scope === 'registry' || actor && effect) return false;
      if (effect && status && effect.status !== status) return false;
      if ($('resourceSpenderFilter').value && donor.id !== $('resourceSpenderFilter').value) return false;
      if (effect && $('resourceArtFilter').value && effect.art !== $('resourceArtFilter').value) return false;
      return !q || vfxSearchText(row).includes(q);
    }
    if (scope === 'vfx' || scope === 'donors' || currentTab === 'fx' && ($('resourceSpenderFilter').value || $('resourceArtFilter').value)) return false;
    if (status && row.status !== status) return false;
    if (!matchesScope(row,actor)) return false;
    if (!q) return true;
    return [row.displayName,row.resourceId,row.kind,row.schema,row.motionType,row.animationSet,row.clipName,row.scopeRef,...(row.aliases||[]),...(row.actorRefs||[])].some((value)=>String(value||'').toLowerCase().includes(q));
  });
}
function renderResources() {
  const donors=currentTab==='fx' && $('resourceFxScope').value==='donors';
  for (const id of ['resourceArtFilter','resourceStatusFilter','resourceActorFilter']) $(id).disabled=donors;
  const rows=filteredRows(), list=$('resourceList'), tpl=$('resourceTemplate'); list.replaceChildren();
  for (const row of rows) {
    const f=tpl.content.cloneNode(true);
    if (row.vfxDonor) {
      const effect=row.vfxEffect, donor=row.vfxDonor;
      f.querySelector('.resource-title').textContent=effect?.name || donor.name;
      f.querySelector('.resource-kind').textContent=effect?.art || 'Spender';
      f.querySelector('.resource-card-meta').textContent=effect ? donor.name : donor.lizenz;
      f.querySelector('.resource-open').prepend(vfxPreview(effect?.vorschau ?? donor.vorschau,effect?.name || donor.name));
      if (effect) f.querySelector('.resource-badges').append(badge(effect.status,statusClass(effect.status)));
      f.querySelector('.resource-card').dataset.vfxId=effect?.id || donor.id;
      f.querySelector('.resource-open').onclick=()=>showResource(row); list.append(f); continue;
    }
    f.querySelector('.resource-title').textContent=row.displayName || row.resourceId; f.querySelector('.resource-kind').textContent=row.kind;
    f.querySelector('.resource-card-meta').textContent=resourceSummary(row); const badges=f.querySelector('.resource-badges'); badges.append(badge(row.status || 'UNKNOWN',statusClass(row.status)));
    if (row.provider) badges.append(badge(row.provider)); if (row.rig) badges.append(badge(`Rig ${row.rig}`)); if (row.executionStatus) badges.append(badge('owner runtime'));
    if (currentTab === 'rigs' && canPreviewRig(row)) badges.append(badge(row.schema === 'kfb.carl.rig/6' || row.schema === 'kfb.pets/1' ? '3D owner preview' : '3D partial preview', row.schema === 'kfb.carl.rig/6' || row.schema === 'kfb.pets/1' ? 'ok' : 'warn'));
    f.querySelector('.resource-open').onclick=()=>showResource(row); list.append(f);
  }
  $('resourceMeta').textContent=`${rows.length.toLocaleString()} shown · ${currentRows.length.toLocaleString()} ${currentTab}`;
  if (currentTab === 'fx' && vfxCatalog?.document) $('resourceMeta').textContent = `${rows.length.toLocaleString()} gezeigt · ${vfxCatalog.document.zahlen.effekte} VFX-Effekte · ${currentRows.filter(row=>!row.vfxDonor).length} Registry-FX`;

}
async function fillActorFilter() {
  const actors=await ensureActors(), select=$('resourceActorFilter'), previous=select.value;
  select.replaceChildren(option('','All actors / scopes'),option('kfb-pets','KFB Pets · custom motion/FX scope'),...actors.map((a)=>option(a.actorId,a.displayName || a.actorId))); select.value=previous;
}
function configureFxFilters(active) {
  for (const id of ['resourceFxScope','resourceSpenderFilter','resourceArtFilter','vfxCatalogHeader']) $(id).hidden=!active;
  const select=$('resourceStatusFilter'), previous=select.value;
  const statuses=active ? [...new Set([...legacyStatuses, ...Object.keys(vfxCatalog?.document?.zahlen.nach_status || {})])] : legacyStatuses;
  select.replaceChildren(option('','Any status'),...statuses.map(value=>option(value,value)));
  if (statuses.includes(previous)) select.value=previous;
  if (!active) return;
  const doc=vfxCatalog?.document;
  const donors=$('resourceSpenderFilter'), arts=$('resourceArtFilter'), donorValue=donors.value, artValue=arts.value;
  donors.replaceChildren(option('','Alle Spender'),...(doc?.spender || []).map(donor=>option(donor.id,donor.name)));
  if ([...donors.options].some(value=>value.value===donorValue)) donors.value=donorValue;
  const kinds=[...new Set(vfxRows(doc).map(row=>row.vfxEffect.art))].sort();
  arts.replaceChildren(option('','Alle Arten'),...kinds.map(art=>option(art,art)));
  if (kinds.includes(artValue)) arts.value=artValue;
  $('vfxCatalogStand').textContent=doc ? `Stand ${vfxText(doc.stand)} · ${doc.zahlen.spender} Spender · ${doc.zahlen.effekte} Effekte · ${vfxCatalog.source==='main'?'main':'lokaler Schnappschuss'}` : 'VFX-Katalog vorübergehend nicht verfügbar';
  $('vfxCatalogCounts').replaceChildren(...Object.entries(doc?.zahlen.nach_status || {}).map(([status,count])=>badge(`${status} · ${vfxText(count)}`,statusClass(status))));
  $('vfxCatalogFields').textContent=doc ? JSON.stringify(Object.fromEntries(Object.entries(doc).filter(([key])=>key!=='spender')),null,2) : '';
}
export async function activateProductionTab(tab) {
  const request=++activation;
  currentTab=tab;
  document.querySelectorAll('[data-library-tab]').forEach((button)=>button.classList.toggle('active',button.dataset.libraryTab===tab));
  if (tab === 'decks') { closeResourceDetail(); return deckUi.activateDeckLibrary(); }
  deckUi.deactivateDeckLibrary();
  const assets=tab==='assets'; $('assetWorkspace').hidden=!assets; $('resourceWorkspace').hidden=assets; closeResourceDetail();
  configureFxFilters(false);
  if (assets) return;
  $('resourceMeta').classList.remove('error');
  if (tab==='fx') {
    $('resourceList').replaceChildren(); $('resourceMeta').textContent='FX werden geladen…';
    vfxPending ||= loadVfxCatalog();
    const [legacy, catalog]=await Promise.allSettled([ensureRows('fx'),vfxPending,fillActorFilter()]);
    if (request!==activation) return;
    vfxCatalog=catalog.status==='fulfilled'?catalog.value:null;
    currentRows=[...(legacy.status==='fulfilled'?legacy.value:[]),...vfxRows(vfxCatalog?.document)];
    $('resourceRevision').textContent=vfxCatalog?.document?.version || cache.manifest?.resourceRegistryRevision || 'FX';
    $('resourceEyebrow').textContent='fx'; configureFxFilters(true); renderResources(); return;
  }
  try {
    const manifest=await ensureManifest();
    await fillActorFilter(); const rows=await ensureRows(tab);
    if (request!==activation) return;
    $('resourceRevision').textContent=manifest.resourceRegistryRevision || 'R0'; currentRows=rows; $('resourceEyebrow').textContent=tab; renderResources();
  } catch (error) { if (request===activation) { $('resourceMeta').textContent=`Resource Registry unavailable: ${error.message}`; $('resourceMeta').classList.add('error'); } }
}
export function initProductionResources({ showAsset }) {
  showAssetCallback=showAsset;
  legacyStatuses=[...$('resourceStatusFilter').options].map(value=>value.value).filter(Boolean);
  for (const id of ['resourceFxScope','resourceSpenderFilter','resourceArtFilter']) $(id).onchange=renderResources;
  deckUi=initDeckLibrary();
  document.querySelectorAll('[data-library-tab]').forEach((button)=>button.onclick=()=>activateProductionTab(button.dataset.libraryTab));
  $('resourceSearch').oninput=renderResources; $('resourceActorFilter').onchange=renderResources; $('resourceStatusFilter').onchange=renderResources; $('resourceDetailClose').onclick=closeResourceDetail;
  return { activateProductionTab, closeResourceDetail, closeDeckDetail:deckUi.closeDeckDetail };
}
