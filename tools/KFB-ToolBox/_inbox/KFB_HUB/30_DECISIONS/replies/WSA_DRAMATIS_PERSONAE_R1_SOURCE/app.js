import { createDramatisPersonaeController } from './dramatis-personae.js';
import { createStyleReferenceController } from './style-reference-browser.js';
import { createExternalSearchController } from './external-3d-search.js';
import { createPrivateIntakeController } from './private-intake.js';

const LIVE_BASE = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/bot/asset-registry-update/registry/assets/v1';
const CANONICAL_BASE = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/registry/assets/v1';
const REPO_API = 'https://api.github.com/repos/georg-doc/kayfabizarro';
const REPO_WEB = 'https://github.com/georg-doc/kayfabizarro';
const PRIVATE_ASSET_LIVE_URL = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/tools/asset_registry/librarian/live/private-asset-live.json';
const STORAGE_SET = 'kfb.asset-saved-set.v1.site';
const PAGE_SIZE = 72;

const $ = (id) => document.getElementById(id);
const state = {
  base: LIVE_BASE, manifest: null, packs: [], catalog: [], catalogById: new Map(), rigById: null,
  query: '', family: '', pack: '', collection: '', kind: '', rigFilter: '', view: 'gallery',
  mode: initialMode(), visible: PAGE_SIZE, active: null,
  set: loadSet(),
  privateRevision: null,
};
let personae;
let styleRefs;
let externalSearch;
let privateIntake;

function initialMode() {
  const view = new URL(location.href).searchParams.get('view');
  return ['browse','external-search','motions','style-references','saved','intake','dramatis-personae'].includes(view) ? view : 'browse';
}

const SOURCE_FAMILIES = [
  ['kaykit','KayKit'], ['tiny-treats','Tiny Treats'], ['kenney','Kenney'], ['quaternius','Quaternius'],
  ['kfb','KFB'], ['public-domain','Public domain'], ['other','Other'],
];

function sourceFamilyForPack(pack) {
  const text = [pack?.packId, pack?.displayName, pack?.root].map((v) => String(v || '').toLowerCase()).join(' ');
  if (/kay[ _-]?kit/.test(text)) return 'kaykit';
  if (/tiny[ _-]?treats/.test(text)) return 'tiny-treats';
  if (/kenney/.test(text)) return 'kenney';
  if (/quaternius/.test(text)) return 'quaternius';
  if (/public[_ /-]?domain/.test(text)) return 'public-domain';
  if (/(^|[ /_-])kfb([ /_-]|$)|kayfabizarro/.test(text)) return 'kfb';
  return 'other';
}

function familyLabel(id) { return SOURCE_FAMILIES.find(([value]) => value === id)?.[1] || 'Other'; }
function packFor(record) { return state.packs.find((pack) => pack.packId === record.packId); }
function loadSet() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_SET) || 'null');
    if (saved?.schema === 'kfb.asset-saved-set.v1' && Array.isArray(saved.items)) return saved;
  } catch {}
  return { schema:'kfb.asset-saved-set.v1', id:crypto.randomUUID?.() || String(Date.now()), name:'Town Market Props', notes:'', items:[] };
}
function persistSet() { localStorage.setItem(STORAGE_SET, JSON.stringify(state.set)); }
async function fetchText(url) { const response = await fetch(url, {cache:'no-store'}); if (!response.ok) throw new Error(`${response.status} ${response.statusText}`); return response.text(); }
async function fetchJSON(url) { return JSON.parse(await fetchText(url)); }
async function fetchJSONL(url) { return (await fetchText(url)).split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line)); }
function formatBytes(value) { const bytes=Number(value||0); if(!bytes)return'—'; const units=['B','KB','MB','GB']; const i=Math.min(3,Math.floor(Math.log(bytes)/Math.log(1024))); const n=bytes/(1024**i); return `${n>=10||i===0?n.toFixed(0):n.toFixed(1)} ${units[i]}`; }
function escapeHTML(value='') { return String(value).replace(/[&<>"]/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[char])); }
function option(value, label) { const node=document.createElement('option'); node.value=value; node.textContent=label; return node; }
function toast(message) { const node=$('toast'); node.textContent=message; node.classList.add('show'); clearTimeout(toast.timer); toast.timer=setTimeout(()=>node.classList.remove('show'),1800); }

async function resolveLiveBase() {
  try {
    const branch = await fetchJSON(`${REPO_API}/commits/${encodeURIComponent('bot/asset-registry-update')}?t=${Date.now()}`);
    return branch?.sha ? `https://raw.githubusercontent.com/georg-doc/kayfabizarro/${branch.sha}/registry/assets/v1` : LIVE_BASE;
  } catch { return LIVE_BASE; }
}

function setRegistryState(kind, status, detail) {
  const pill=$('registryPill');
  pill.classList.toggle('error', kind==='error');
  pill.classList.toggle('stale', kind==='stale');
  $('registryStatus').textContent=status;
  $('registryFreshness').textContent=detail;
}

async function updateRepositoryFreshness() {
  const registryCommit=String(state.manifest?.sourceCommit||'');
  if (!registryCommit) return;
  try {
    const [head, entries] = await Promise.all([
      fetchJSON(`${REPO_API}/commits/main?t=${Date.now()}`),
      fetchJSON(`${REPO_API}/contents/media/3D_Assets?ref=main&t=${Date.now()}`),
    ]);
    const mainCommit=String(head?.sha||'');
    const directories=new Set((Array.isArray(entries)?entries:[]).filter((item)=>item.type==='dir').map((item)=>item.name.toLowerCase()));
    const waiting=(Array.isArray(entries)?entries:[]).filter((item)=>item.type==='file'&&/\.zip$/i.test(item.name)&&!directories.has(item.name.replace(/\.zip$/i,'').toLowerCase()));
    const registryShort=registryCommit.slice(0,8), mainShort=mainCommit.slice(0,8);
    let assetChangesPending=false;
    if (mainCommit && mainCommit!==registryCommit) {
      const comparison=await fetchJSON(`${REPO_API}/compare/${registryCommit}...${mainCommit}?t=${Date.now()}`);
      assetChangesPending=(comparison?.files||[]).some((file)=>/^(media\/(2D_Assets|3D_Assets|public_domain|kfb)\/|tools\/asset_registry\/((build|packs|dependencies|decks|delta|validate|rigfacts)\.py|config\.json|overrides\/))/.test(file.filename||''));
    }
    if (assetChangesPending) {
      setRegistryState('stale', `Live Registry · ${state.catalog.length.toLocaleString()} assets`, `Asset update pending · registry ${registryShort} · repo ${mainShort}`);
    } else if (waiting.length) {
      const label=waiting.length===1?'1 ZIP awaits extraction':`${waiting.length} ZIPs await extraction`;
      setRegistryState('stale', `Live Registry · ${state.catalog.length.toLocaleString()} assets`, `${label} · ${registryShort}`);
      $('registryPill').title=waiting.slice(0,8).map((item)=>item.name).join('\n');
    } else {
      const detail=mainCommit&&mainCommit!==registryCommit?`Current · no asset changes since ${registryShort}`:`Current · repo ${mainShort||registryShort}`;
      setRegistryState('ok', `Live Registry · ${state.catalog.length.toLocaleString()} assets`, detail);
      $('registryPill').removeAttribute('title');
    }
  } catch {
    setRegistryState('ok', `Live Registry · ${state.catalog.length.toLocaleString()} assets`, `Registry ${registryCommit.slice(0,8)} · repository check unavailable`);
  }
}

async function loadRegistry(base) {
  if (!base) base=await resolveLiveBase();
  state.base = base;
  try {
    const [manifest, packs, catalog, privateDoc] = await Promise.all([
      fetchJSON(`${base}/manifest.json`), fetchJSON(`${base}/packs/index.json`), fetchJSONL(`${base}/catalog.jsonl`),
      fetchJSON(`${PRIVATE_ASSET_LIVE_URL}?t=${Date.now()}`).catch(()=>({schema:'kfb.asset-private-live.v1',revision:'unavailable',assets:[]})),
    ]);
    const privateRows=privateDoc?.schema==='kfb.asset-private-live.v1'&&Array.isArray(privateDoc.assets)
      ? privateDoc.assets.filter((record)=>record?.schema==='kfb.asset-private-projection.v1'&&record?.source?.private===true)
      : [];
    const merged=[...catalog,...privateRows.filter((record)=>!catalog.some((item)=>item.assetId===record.assetId))];
    const mergedPacks=[...packs];
    if(privateRows.length&&!mergedPacks.some((pack)=>pack.packId==='private-production-inbox'))mergedPacks.push({packId:'private-production-inbox',displayName:'Private Production Inbox',root:'private://production-inbox',assetCount:privateRows.length,collections:[...new Set(privateRows.map((row)=>row.collectionPath).filter(Boolean))].map((path)=>({path,assetCount:privateRows.filter((row)=>row.collectionPath===path).length}))});
    state.manifest = manifest; state.packs = mergedPacks; state.catalog = merged; state.privateRevision=privateDoc?.revision||null;
    state.catalogById = new Map(merged.map((record) => [record.assetId, record]));
    const commit = String(manifest.sourceCommit || '').slice(0, 8);
    setRegistryState('ok', `Live Registry · ${catalog.length.toLocaleString()} assets`, `Registry ${commit} · checking repository…`);
    populateFamilies(); populatePacks(); updateSetUI(); render();
    await updateRepositoryFreshness();
  } catch (error) {
    if (base !== CANONICAL_BASE) return loadRegistry(CANONICAL_BASE);
    setRegistryState('error', 'Registry unavailable', 'Refresh to try again');
    $('resultMeta').textContent = error.message;
  }
}

function populateFamilies() {
  const counts = new Map();
  state.packs.forEach((pack) => counts.set(sourceFamilyForPack(pack), (counts.get(sourceFamilyForPack(pack)) || 0) + 1));
  $('familyFilter').replaceChildren(option('', 'All families'), ...SOURCE_FAMILIES.filter(([id])=>counts.has(id)).map(([id,label])=>option(id,`${label} · ${counts.get(id)} packs`)));
}
function visiblePacks() { return state.packs.filter((pack) => !state.family || sourceFamilyForPack(pack) === state.family); }
function populatePacks() {
  const packs = visiblePacks().sort((a,b)=>String(a.displayName||a.packId).localeCompare(String(b.displayName||b.packId)));
  $('packFilter').replaceChildren(option('', 'All packs'), ...packs.map((pack)=>option(pack.packId, `${pack.displayName || pack.packId} · ${Number(pack.assetCount||0).toLocaleString()}`)));
  $('packFilter').value = packs.some((pack)=>pack.packId===state.pack) ? state.pack : '';
  state.pack = $('packFilter').value;
  populateCollections();
}
function populateCollections() {
  const select=$('collectionFilter'); const pack=state.packs.find((item)=>item.packId===state.pack); const collections=pack?.collections||[];
  select.disabled=!state.pack; select.replaceChildren(option('', state.pack?'All collections':'Choose a pack first'), ...collections.map((item)=>option(item.path,`${item.path} · ${item.assetCount}`)));
  if (!collections.some((item)=>item.path===state.collection)) state.collection='';
  select.value=state.collection;
}

async function ensureRigFacts() {
  if (state.rigById) return;
  $('resultMeta').textContent='Loading rig facts…';
  try { const rows=await fetchJSONL(`${state.base}/rigfacts.jsonl`); state.rigById=new Map(rows.map((row)=>[row.assetId,row.rigFacts])); }
  catch { state.rigById=new Map(); }
}

function recordFamily(record) { return sourceFamilyForPack(packFor(record)); }
function searchable(record) { return [record.name,record.assetId,record.path,record.packId,record.collectionPath,record.collection,record.artist,record.creditText,record.format,record.kind,record.audio?.audioClass,...(record.tags||[])].join(' ').toLowerCase(); }
function filteredRecords() {
  const q=state.query.trim().toLowerCase();
  return state.catalog.filter((record)=>{
    if (state.mode==='motions' && !(record.kind==='model-3d' && (/anim|motion|rig_/i.test(searchable(record)) || state.rigById?.get(record.assetId)?.animationCount>0))) return false;
    if (q && !searchable(record).includes(q)) return false;
    if (state.family && recordFamily(record)!==state.family) return false;
    if (state.pack && record.packId!==state.pack) return false;
    if (state.collection && record.collectionPath!==state.collection) return false;
    if (state.kind && record.kind!==state.kind) return false;
    if (state.rigFilter) {
      const rig=state.rigById?.get(record.assetId) || record.rigFacts;
      if (state.rigFilter==='rigged' && !rig?.rigged) return false;
      if (state.rigFilter==='animated' && !(Number(rig?.animationCount||rig?.clipCount||0)>0 || record.animated)) return false;
    }
    return true;
  });
}

function previewURL(record) { return record.delivery?.previewUrl || record.delivery?.runtimeUrl || record.source?.rawPinned || record.source?.rawLatest || ''; }
function githubFileURL(record) {
  if (!record?.path || record.source?.private) return '';
  const ref=String(state.manifest?.sourceCommit||'main');
  const path=String(record.path).replace(/^\/+/, '').split('/').map(encodeURIComponent).join('/');
  return `${REPO_WEB}/blob/${encodeURIComponent(ref)}/${path}`;
}
function cardThumb(record) {
  const url=previewURL(record); const ext=String(record.format||record.kind||'FILE').toUpperCase();
  if (record.kind==='image-2d' && url) return `<div class="thumb"><img src="${escapeHTML(url)}" alt="" loading="lazy"><span class="type-badge">IMAGE</span></div>`;
  if (record.kind==='model-3d' && url && ['glb','gltf'].includes(String(record.format).toLowerCase())) {
    return `<div class="thumb model model-thumb" data-model-src="${escapeHTML(url)}" data-model-alt="${escapeHTML(record.name)}"><span class="type-badge">${escapeHTML(ext)}</span><span class="model-loading">3D</span></div>`;
  }
  const cls=record.kind==='model-3d'?'model':record.kind==='audio'?'audio':'';
  const symbol=record.kind==='model-3d'?'◈':record.kind==='audio'?'≈':ext;
  return `<div class="thumb placeholder ${cls}" data-ext="${escapeHTML(symbol)}"><span class="type-badge">${escapeHTML(ext)}</span></div>`;
}
function isSelected(id) { return state.set.items.some((item)=>item.id===id); }
function card(record) {
  const pack=packFor(record); const family=familyLabel(recordFamily(record));
  const subtitle=record.kind==='audio'&&record.artist?[record.artist,record.collection].filter(Boolean).join(' · '):`${family} · ${pack?.displayName||record.packId||'Unpacked'}`;
  return `<article class="asset-card" data-id="${escapeHTML(record.assetId)}" data-open-asset="${escapeHTML(record.assetId)}" tabindex="0" role="button">
    <div class="card-visual">${cardThumb(record)}<button class="add-button card-add-overlay ${isSelected(record.assetId)?'selected':''}" type="button" data-add="${escapeHTML(record.assetId)}" aria-label="${isSelected(record.assetId)?'Remove from':'Add to'} saved set">${isSelected(record.assetId)?'✓':'+'}</button></div>
    <div class="card-copy"><h3 title="${escapeHTML(record.name)}">${escapeHTML(record.name)}</h3><p>${escapeHTML(subtitle)}</p></div>
  </article>`;
}

function render() {
  if (state.mode==='dramatis-personae') return;
  if (state.mode==='style-references') return styleRefs.render();
  if (state.mode==='external-search') return externalSearch.render();
  if (!state.catalog.length) return;
  if (state.mode==='saved') return renderSavedView();
  if (state.mode==='intake') return renderIntakeView();
  $('noticePanel').hidden=true; $('results').hidden=false; $('showMore').hidden=true;
  const rows=filteredRecords(); const visible=rows.slice(0,state.visible);
  $('results').className=`results ${state.view}`; $('results').innerHTML=visible.map(card).join('');
  hydrateVisibleModels();
  $('resultMeta').textContent=`${visible.length.toLocaleString()} shown · ${rows.length.toLocaleString()} matches`;
  $('showMore').hidden=visible.length>=rows.length; $('showMore').textContent=`Show ${Math.min(PAGE_SIZE,rows.length-visible.length)} more`;
  $('eyebrow').textContent=state.mode==='motions'?'MOTIONS / DISCOVERY':'BROWSE / REGISTRY';
  $('viewTitle').textContent=state.mode==='motions'?'Find the right movement.':'Find something worth using.';
}
function hydrateVisibleModels() {
  const targets=[...document.querySelectorAll('.model-thumb[data-model-src]')];
  if (!targets.length) return;
  const mount=(target)=>{
    if (!target.dataset.modelSrc) return;
    const viewer=document.createElement('model-viewer');
    const reveal=()=>target.classList.add('model-ready');
    viewer.addEventListener('load',reveal,{once:true});
    viewer.src=target.dataset.modelSrc;
    viewer.alt=`3D preview of ${target.dataset.modelAlt||'asset'}`;
    viewer.setAttribute('loading','lazy');
    viewer.setAttribute('camera-orbit','35deg 70deg auto');
    viewer.setAttribute('interaction-prompt','none');
    viewer.setAttribute('shadow-intensity','.65');
    viewer.setAttribute('environment-image','neutral');
    target.prepend(viewer);
    const revealWhenReady=()=>{
      if (!target.isConnected) return;
      if (viewer.loaded) return reveal();
      window.setTimeout(revealWhenReady,120);
    };
    customElements.whenDefined('model-viewer').then(revealWhenReady);
    delete target.dataset.modelSrc;
  };
  if (!('IntersectionObserver' in window)) return targets.slice(0,12).forEach(mount);
  const observer=new IntersectionObserver((entries)=>{
    entries.forEach((entry)=>{if(entry.isIntersecting){mount(entry.target);observer.unobserve(entry.target);}});
  },{rootMargin:'160px'});
  targets.forEach((target)=>observer.observe(target));
}
function renderSavedView() {
  $('noticePanel').hidden=false; $('noticePanel').innerHTML='<strong>Saved Sets</strong><br>Your current set is stored in this browser. Open it to rename, annotate, reorder or export a candidate-only handoff.';
  const rows=state.set.items.map((item)=>state.catalogById.get(item.id)).filter(Boolean);
  $('results').hidden=false; $('results').className=`results ${state.view}`; $('results').innerHTML=rows.map(card).join('');
  hydrateVisibleModels();
  $('resultMeta').textContent=`${rows.length} item${rows.length===1?'':'s'} in ${state.set.name}`; $('showMore').hidden=true;
  $('eyebrow').textContent='COLLECT / SAVED SETS'; $('viewTitle').textContent=state.set.name;
}
function renderIntakeView() {
  $('results').hidden=true; $('showMore').hidden=true; $('resultMeta').textContent='Asset/file intake remains Phase C';
  $('eyebrow').textContent='INTAKE / UNREGISTERED'; $('viewTitle').textContent='Preview first. Register explicitly.';
  $('noticePanel').hidden=false; privateIntake.render($('noticePanel'));
}

function renderInspector(record) {
  state.active=record; $('inspectorEmpty').hidden=true; $('referenceInspector').hidden=true; $('inspectorContent').hidden=false; $('inspector').classList.add('open'); $('inspector').setAttribute('aria-hidden','false');
  const pack=packFor(record); const family=familyLabel(recordFamily(record)); const rig=state.rigById?.get(record.assetId)||record.rigFacts;
  $('assetFamily').textContent=[family, pack?.displayName||record.packId, record.collectionPath].filter(Boolean).join(' / ');
  $('assetTitle').textContent=record.name; $('assetPath').textContent=record.path;
  const githubLink=$('assetGithubLink'); const githubURL=githubFileURL(record);
  githubLink.hidden=!githubURL; githubLink.href=githubURL||'#';
  $('factGrid').innerHTML=[['Type',record.kind],['Format',String(record.format||'—').toUpperCase()],['Size',formatBytes(record.sizeBytes)],['Status',record.source?.private?(record.delivery?.previewStatus==='READY'?'Private · preview ready':'Private · preview pending'):(record.dependencyStatus||'source-backed')], record.artist&&['Artist',record.artist], record.collection&&['Collection',record.collection], record.audio?.audioClass&&['Audio class',record.audio.audioClass], rig?.rigFamily&&['Rig',rig.rigFamily], Number(rig?.animationCount||rig?.clipCount||0)>0&&['Clips',rig.animationCount||rig.clipCount]].filter(Boolean).map(([a,b])=>`<div class="fact"><span>${escapeHTML(a)}</span><b>${escapeHTML(b)}</b></div>`).join('');
  $('technicalDetails').innerHTML=[['Asset ID',record.assetId],['Path',record.path],['Pack ID',record.packId],['Collection',record.collectionPath||'—'],['Source',record.source?.private?'Private Production Inbox':state.manifest?.sourceCommit||'—'],['Runtime',record.audio?.runtimeStatus||record.dependencyStatus||'—'],record.creditText&&['Credit',record.creditText]].filter(Boolean).map(([a,b])=>`<dt>${escapeHTML(a)}</dt><dd>${escapeHTML(b)}</dd>`).join('');
  $('toggleSet').textContent=isSelected(record.assetId)?'Remove from set':'Add to set';
  renderPreview(record);
  renderAssetReferenceLinks(record.assetId);
}
function renderPreview(record) {
  const target=$('preview'); const url=previewURL(record); target.innerHTML='';
  if (record.kind==='image-2d' && url) { const img=document.createElement('img'); img.src=url; img.alt=`Preview of ${record.name}`; target.append(img); return; }
  if (record.kind==='audio' && url) { const audio=document.createElement('audio'); audio.src=url; audio.controls=true; audio.preload='metadata'; target.append(audio); return; }
  if (record.kind==='model-3d' && url && ['glb','gltf'].includes(String(record.format).toLowerCase())) {
    const viewer=document.createElement('model-viewer'); viewer.src=url; viewer.alt=`3D preview of ${record.name}`; viewer.setAttribute('camera-controls',''); viewer.setAttribute('auto-rotate',''); viewer.setAttribute('shadow-intensity','1'); viewer.setAttribute('environment-image','neutral'); target.append(viewer); return;
  }
  if(record.source?.private){target.innerHTML=`<div class="preview-fallback"><b>${record.kind==='audio'?'≈':'◇'}</b>Private source<br>${record.delivery?.previewStatus==='UNAVAILABLE'?'Preview unavailable':'Preview pending'}</div>`;return;}
  target.innerHTML=`<div class="preview-fallback"><b>${record.kind==='model-3d'?'◈':'◇'}</b>${escapeHTML(String(record.format||record.kind).toUpperCase())}<br>Metadata preview</div>`;
}
function renderAssetReferenceLinks(assetId) {
  const references=styleRefs.relatedToAsset(assetId);
  $('assetReferenceLinks').innerHTML=references.length
    ? '<h3>Curated style references</h3>' + references.map((reference)=>`<div class="reference-link-row"><span>${escapeHTML(reference.title)}</span><button type="button" data-open-related-reference="${escapeHTML(reference.referenceId)}">Inspect</button></div>`).join('')
    : '';
}

function toggleSetItem(id) {
  const index=state.set.items.findIndex((item)=>item.id===id);
  if (index>=0) state.set.items.splice(index,1); else state.set.items.push({kind:'asset',id,source:'registry'});
  persistSet(); updateSetUI(); render(); if (state.active?.assetId===id) $('toggleSet').textContent=isSelected(id)?'Remove from set':'Add to set';
}
function updateSetUI() {
  if (state.mode==='style-references') return styleRefs.updateSetUI();
  if (state.mode==='external-search') return externalSearch.updateBadge();
  $('setCount').textContent=state.set.items.length; $('setName').value=state.set.name; $('setNotes').value=state.set.notes;
  const rows=state.set.items.map((item)=>state.catalogById.get(item.id)).filter(Boolean);
  $('setItems').innerHTML=rows.length?rows.map((record)=>`<div class="set-row"><div class="set-icon">${record.kind==='model-3d'?'3D':record.kind==='image-2d'?'IMG':'SND'}</div><div><b>${escapeHTML(record.name)}</b><small>${escapeHTML(record.packId||'Registry')}</small></div><button type="button" data-remove="${escapeHTML(record.assetId)}" aria-label="Remove ${escapeHTML(record.name)}">×</button></div>`).join(''):'<p class="set-empty">Your working set is empty.<br>Add assets from Browse.</p>';
}
function handoff() {
  const assets=state.set.items.map((item)=>state.catalogById.get(item.id)).filter(Boolean).map((record)=>({assetId:record.assetId,name:record.name,path:record.path,kind:record.kind,format:record.format,sizeBytes:record.sizeBytes,packId:record.packId,collectionPath:record.collectionPath,dependencyStatus:record.dependencyStatus,source:record.source,relations:record.relations,rigFacts:state.rigById?.get(record.assetId)||record.rigFacts||null}));
  return {schema:'kfb.asset-saved-set.v1',id:state.set.id,name:state.set.name,notes:state.set.notes,items:state.set.items,handoff:{schema:'kfb.asset-handoff.v1',sourceRepo:state.manifest?.sourceRepo,sourceCommit:state.manifest?.sourceCommit,consumer:'worldbuilder',selectionStatus:'candidate-only',suitabilityDecision:'owned-by-receiving-consumer',assets}};
}
async function copy(value) { await navigator.clipboard.writeText(value); toast('Copied'); }
function download(value,filename) { const blob=new Blob([JSON.stringify(value,null,2)+'\n'],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=filename||`${state.set.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'kfb-saved-set'}.json`; a.click(); setTimeout(()=>URL.revokeObjectURL(url),1000); }
function openSet() { updateSetUI(); $('setDrawer').classList.add('open'); $('setDrawer').setAttribute('aria-hidden','false'); $('backdrop').hidden=false; }
function closeSet() { $('setDrawer').classList.remove('open'); $('setDrawer').setAttribute('aria-hidden','true'); $('backdrop').hidden=true; }
function activateMode(mode,push=true) {
  state.mode=mode; state.visible=PAGE_SIZE; state.active=null;
  document.body.classList.toggle('personae-mode',mode==='dramatis-personae');
  $('dramatisPersonae').hidden=mode!=='dramatis-personae';
  if(mode==='dramatis-personae') { $('preview').replaceChildren(); closeSet(); personae.activate(); }
  else personae.deactivate();
  document.body.classList.toggle('reference-mode',mode==='style-references');
  document.body.classList.toggle('external-mode',mode==='external-search');
  if(mode!=='style-references')document.body.classList.remove('reference-viewer-active');
  $('assetSearchControls').hidden=['style-references','external-search'].includes(mode);
  $('referenceSearchControls').hidden=mode!=='style-references';
  $('externalSearchControls').hidden=mode!=='external-search';
  $('referenceBrowser').hidden=mode!=='style-references';
  $('externalBrowser').hidden=mode!=='external-search';
  $('inspectorContent').hidden=true; $('referenceInspector').hidden=true; $('inspectorEmpty').hidden=false; $('inspector').classList.remove('open'); $('inspector').setAttribute('aria-hidden','true');
  document.querySelectorAll('.nav-item').forEach((node)=>node.classList.toggle('active',node.dataset.view===mode));
  $('openSetButton').querySelector('span').textContent=mode==='style-references'?'Reference set':mode==='external-search'?'Intake queue':'Current set';
  $('inspectorEmpty').querySelector('h2').textContent=mode==='style-references'?'Choose a reference':'Choose an asset';
  $('inspectorEmpty').querySelector('p').textContent=mode==='style-references'?'Open a card to inspect the exact source, notes and construction principles.':'Open a card to inspect the preview, exact identity and source facts.';
  updateSetUI();
  if (mode==='motions') ensureRigFacts().then(render); else render();
  if (mode==='external-search') externalSearch.activate();
  if (mode==='saved') openSet();
  if (push) {
    const url=new URL(location.href);
    if (mode!=='browse') url.searchParams.set('view',mode); else url.searchParams.delete('view');
    history.pushState({view:mode},'',url);
  }
}

let debounce;
$('searchInput').addEventListener('input',(event)=>{clearTimeout(debounce);debounce=setTimeout(()=>{state.query=event.target.value;state.visible=PAGE_SIZE;render();},120)});
$('familyFilter').onchange=(event)=>{state.family=event.target.value;state.pack='';state.collection='';populatePacks();state.visible=PAGE_SIZE;render();};
$('packFilter').onchange=(event)=>{state.pack=event.target.value;state.collection='';populateCollections();state.visible=PAGE_SIZE;render();};
$('collectionFilter').onchange=(event)=>{state.collection=event.target.value;state.visible=PAGE_SIZE;render();};
$('typeFilter').onchange=(event)=>{state.kind=event.target.value;document.querySelectorAll('[data-kind]').forEach((node)=>node.classList.toggle('active',node.dataset.kind===state.kind));state.visible=PAGE_SIZE;render();};
document.querySelectorAll('[data-kind]').forEach((node)=>node.onclick=()=>{state.kind=state.kind===node.dataset.kind?'':node.dataset.kind;$('typeFilter').value=state.kind;document.querySelectorAll('[data-kind]').forEach((n)=>n.classList.toggle('active',n.dataset.kind===state.kind));state.visible=PAGE_SIZE;render();});
document.querySelectorAll('[data-rig]').forEach((node)=>node.onclick=async()=>{const next=state.rigFilter===node.dataset.rig?'':node.dataset.rig;if(next)await ensureRigFacts();state.rigFilter=next;document.querySelectorAll('[data-rig]').forEach((n)=>n.classList.toggle('active',n.dataset.rig===state.rigFilter));state.visible=PAGE_SIZE;render();});
$('resetFilters').onclick=()=>{Object.assign(state,{query:'',family:'',pack:'',collection:'',kind:'',rigFilter:'',visible:PAGE_SIZE});$('searchInput').value='';$('familyFilter').value='';$('typeFilter').value='';document.querySelectorAll('.chip').forEach((n)=>n.classList.remove('active'));populatePacks();render();};
$('results').onclick=(event)=>{
  if (state.mode==='style-references' && styleRefs.handleResultsClick(event)) return;
  const add=event.target.closest('[data-add]');
  if (add) { event.stopPropagation(); toggleSetItem(add.dataset.add); return; }
  const cardNode=event.target.closest('[data-open-asset]');
  if (cardNode) renderInspector(state.catalogById.get(cardNode.dataset.openAsset));
};
$('results').onkeydown=(event)=>{
  if (state.mode==='style-references' && styleRefs.handleResultsKey(event)) return;
  if (event.target.closest('button,a,input,select,textarea')) return;
  const cardNode=event.target.closest('[data-open-asset]');
  if (cardNode && (event.key==='Enter'||event.key===' ')) { event.preventDefault(); renderInspector(state.catalogById.get(cardNode.dataset.openAsset)); }
};
$('galleryButton').onclick=()=>{state.view='gallery';$('galleryButton').classList.add('active');$('listButton').classList.remove('active');render();};
$('listButton').onclick=()=>{state.view='list';$('listButton').classList.add('active');$('galleryButton').classList.remove('active');render();};
$('showMore').onclick=()=>{state.visible+=PAGE_SIZE;render();};
document.querySelectorAll('.nav-item[data-view]').forEach((node)=>node.onclick=()=>activateMode(node.dataset.view));
$('toggleSet').onclick=()=>state.active&&toggleSetItem(state.active.assetId);
$('copyReference').onclick=()=>state.active&&copy(JSON.stringify({id:state.active.assetId,path:state.active.path,source:state.active.source},null,2));
function closeInspector(){ $('inspector').classList.remove('open'); $('inspector').setAttribute('aria-hidden','true'); }
$('closeInspector').onclick=closeInspector;
$('railToggle').onclick=()=>{const expanded=document.body.classList.toggle('rail-expanded');$('railToggle').setAttribute('aria-expanded',String(expanded));$('railToggle').title=expanded?'Collapse navigation':'Expand navigation';localStorage.setItem('kfb.librarian.rail-expanded',expanded?'1':'0');};
$('openSetButton').onclick=()=>state.mode==='external-search'?externalSearch.openQueue():openSet();$('closeSet').onclick=closeSet;$('backdrop').onclick=closeSet;
$('refreshRegistry').onclick=async()=>{const button=$('refreshRegistry');button.classList.add('loading');button.disabled=true;setRegistryState('ok','Refreshing Registry…','Checking GitHub for the newest build');try{await loadRegistry();toast('Asset Registry refreshed');}finally{button.classList.remove('loading');button.disabled=false;}};
$('setName').oninput=(event)=>{if(state.mode==='style-references')styleRefs.setName(event.target.value);else{state.set.name=event.target.value||'Untitled Set';persistSet();}};
$('setNotes').oninput=(event)=>{if(state.mode==='style-references')styleRefs.setNotes(event.target.value);else{state.set.notes=event.target.value;persistSet();}};
$('setItems').onclick=(event)=>{
  const assetButton=event.target.closest('[data-remove]');const referenceButton=event.target.closest('[data-remove-reference]');
  if(assetButton)toggleSetItem(assetButton.dataset.remove);
  if(referenceButton)styleRefs.removeSetItem(referenceButton.dataset.removeReference);
};
$('newSet').onclick=()=>{if(state.mode==='style-references'){styleRefs.newSet();return;}if(state.set.items.length&&!confirm('Start a new empty set?'))return;state.set={schema:'kfb.asset-saved-set.v1',id:crypto.randomUUID?.()||String(Date.now()),name:'Untitled Set',notes:'',items:[]};persistSet();updateSetUI();render();};
$('copyHandoff').onclick=()=>{try{copy(JSON.stringify(state.mode==='style-references'?styleRefs.pack():handoff(),null,2));}catch(error){toast(error.message);}};
$('downloadHandoff').onclick=()=>{try{if(state.mode==='style-references'){const pack=styleRefs.pack();download(pack,(pack.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'style-reference-pack')+'.json');}else download(handoff());}catch(error){toast(error.message);}};
$('assetReferenceLinks').onclick=(event)=>{const button=event.target.closest('[data-open-related-reference]');if(button){activateMode('style-references');styleRefs.openById(button.dataset.openRelatedReference);}};
document.addEventListener('keydown',(event)=>{if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){event.preventDefault();document.body.classList.remove('search-compact');$(state.mode==='dramatis-personae'?'dpSearch':state.mode==='style-references'?'referenceSearchInput':state.mode==='external-search'?'externalSearchInput':'searchInput').focus();}if(event.key==='Escape'){closeSet();closeInspector();}});
if(localStorage.getItem('kfb.librarian.rail-expanded')==='1'){document.body.classList.add('rail-expanded');$('railToggle').setAttribute('aria-expanded','true');$('railToggle').title='Collapse navigation';}
let lastScrollY=window.scrollY,scrollTick=false;
window.addEventListener('scroll',()=>{if(scrollTick)return;scrollTick=true;requestAnimationFrame(()=>{const y=window.scrollY;const movingDown=y>lastScrollY+4;const movingUp=y<lastScrollY-4;if(state.mode==='browse'||state.mode==='motions'||state.mode==='saved'){if(y<90||movingUp)document.body.classList.remove('search-compact');else if(movingDown&&y>140&&!document.querySelector('.search-zone :focus'))document.body.classList.add('search-compact');}else document.body.classList.remove('search-compact');lastScrollY=y;scrollTick=false;});},{passive:true});
$('assetSearchControls').addEventListener('focusin',()=>document.body.classList.remove('search-compact'));
window.onpopstate=()=>activateMode(initialMode(),false);

personae=createDramatisPersonaeController(document.getElementById('dramatisPersonae'));
styleRefs=createStyleReferenceController({$:$,escapeHTML:escapeHTML,option:option,toast:toast,catalog:()=>state.catalog,catalogById:()=>state.catalogById,assetSearchText:searchable,isReferenceMode:()=>state.mode==='style-references'});
styleRefs.bind();
externalSearch=createExternalSearchController({$:$,escapeHTML:escapeHTML,toast:toast});
externalSearch.bind();
privateIntake=createPrivateIntakeController({escapeHTML:escapeHTML,toast:toast,copy:copy,download:download});
window.KFBAssetPicker={version:'1.2.0-layout-r1',getQuery:()=>({query:state.query,family:state.family,pack:state.pack,collection:state.collection,assetTypes:state.kind?[state.kind]:[],rigged:state.rigFilter==='rigged'?true:null,animated:state.rigFilter==='animated'?true:null,scope:state.mode==='motions'?'motions':'assets',representation:'primary'}),getActiveItem:()=>state.active,getSavedSet:()=>handoff(),getReferenceIds:(assetId)=>styleRefs.relatedToAsset(assetId).map((reference)=>reference.referenceId)};
window.KFBStyleReferencePicker={version:'2.1.0-live-data',schema:'kfb.style-reference/1',getActiveReference:()=>styleRefs.getActive(),getReferenceSet:()=>styleRefs.getSet(),getBuiltInReferences:()=>styleRefs.getBuiltIns(),getAllReferences:()=>styleRefs.getAllReferences(),getEmanataTargets:()=>styleRefs.getEmanataTargets(),getDataStatus:()=>styleRefs.getDataStatus(),exportPack:()=>styleRefs.pack(),open:()=>activateMode('style-references')};
window.KFBExternalAssetDiscovery={version:'1.0.0',schema:'kfb.external-asset-intake/1',getPreparedIntake:()=>externalSearch.getIntake(),open:()=>activateMode('external-search')};
window.KFBPrivateAssetIntake={version:'1.0.0',schema:'kfb.asset-intake.v1',getDraft:()=>privateIntake.getDraft(),open:()=>activateMode('intake')};
activateMode(state.mode,false);
loadRegistry();
