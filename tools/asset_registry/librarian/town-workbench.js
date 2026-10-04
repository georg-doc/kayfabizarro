import { $, state, badge } from './state.js';
import { ensureCatalog, ensureRigFacts } from './registry.js';
import { attach3DThumbnail } from './thumb3d.js';
import { toggleSelected, updateSelectionUI, copyText } from './selection.js';

const style = document.createElement('link');
style.rel = 'stylesheet';
style.href = './town-workbench.css';
document.head.append(style);

const STORAGE_SCENE = 'kfb.asset-librarian.v1.6.town-scene';
const LIMIT_STEP = 18;
const RIG_FAMILY_RE = /^Rig_(Small|Medium|Large)$/i;
const FIRST_CHOICE_PACKS = new Set(['kaykit-forest-nature-pack-1-0-free','kenney-nature-kit','scifi-ultimate-space-kit-quaternius']);
const NATURE = ['forest','nature','tree','bush','plant','flower','grass','rock','mushroom','stump','log','cactus','palm','foliage','shrub','fern'];
const BUILDINGS = ['building','city-kit','city kit','house','home','shop','market','commercial','industrial','suburban','castle','tower','roof','wall','door','window','fence','gate','farm','barn','garage','store','station'];
const SPACE = ['space','sci-fi','sci fi','scifi','alien','planet','moon','satellite','asteroid','spaceship','spacecraft','rocket','cosmic','lunar'];

let initialized = false;
let limits = { environment:LIMIT_STEP, character:LIMIT_STEP, prop:LIMIT_STEP };
let scenePlan = readScene();

function ensureTownDom() {
  if (!$('townTab')) {
    const tab=document.createElement('button'); tab.id='townTab'; tab.className='production-tab'; tab.type='button'; tab.textContent='Town';
    const nav=$('productionTabs'); nav.insertBefore(tab,nav.firstElementChild);
  }
  if (!$('townWorkspace')) {
    const section=document.createElement('section'); section.id='townWorkspace'; section.className='town-workspace'; section.hidden=true; section.setAttribute('aria-label','KFB Town workbench');
    section.innerHTML=`
      <section class="town-intro panel"><div><div class="eyebrow">KFB Town · candidate assembly</div><p>Workbench groups Registry facts for worldbuilding. Nature / Buildings / Space / Prop are presentation filters, not new Registry semantics.</p></div><span id="townStatus" class="pill town-status">Open Town to load</span></section>
      <section class="town-toolbar panel">
        <input id="townSearch" class="global-search" type="search" placeholder="Filter Town workbench…" autocomplete="off">
        <label><span>World source</span><select id="townVendorFilter"><option value="first-choice">First choice · Kenney + KayKit + Space Kit</option><option value="kenney">Kenney only</option><option value="kaykit">KayKit only</option><option value="space">Quaternius Space Kit</option><option value="all">All first-choice families</option></select></label>
        <label><span>World view</span><select id="townWorldFilter"><option value="nature">Nature & Forest</option><option value="buildings">Buildings & Town</option><option value="space">Space & Sci-fi</option><option value="all">All 3D candidates</option></select></label>
        <label><span>World pack</span><select id="townWorldPackFilter"><option value="">All matching packs</option></select></label>
        <label><span>Characters</span><select id="townCharacterScope"><option value="mystery-first">Mystery Series first</option><option value="mystery-only">Mystery Series only</option><option value="all-kaykit">All KayKit characters</option></select></label>
        <label><span>Rig family</span><select id="townRigFamilyFilter"><option value="">Any KayKit rig</option><option value="Rig_Small">Rig_Small</option><option value="Rig_Medium">Rig_Medium</option><option value="Rig_Large">Rig_Large</option></select></label>
      </section>
      <section class="town-grid">
        <section class="town-lane panel"><div class="town-lane-head"><div><div class="eyebrow">worldbuilding</div><h2>Environment</h2><p id="townEnvironmentMeta">—</p></div></div><div id="townEnvironmentList" class="town-list"></div></section>
        <section class="town-lane panel"><div class="town-lane-head"><div><div class="eyebrow">KayKit</div><h2>Characters</h2><p id="townCharacterMeta">—</p></div></div><div id="townCharacterList" class="town-list"></div></section>
        <section class="town-lane panel"><div class="town-lane-head"><div><div class="eyebrow">same collection</div><h2>Character props</h2><p id="townPropMeta">—</p></div></div><p id="townPropHint" class="town-source-note"></p><div id="townPropList" class="town-list"></div></section>
      </section>
      <section class="town-scene panel"><div class="town-scene-head"><div><div class="eyebrow">candidate composition</div><h2>Scene Plan</h2></div><div class="town-scene-actions"><button id="townAddScene" class="primary" type="button" disabled>Add scene to Selection</button><button id="townCopyScene" class="quiet" type="button" disabled>Copy scene plan</button></div></div><div class="town-scene-slots"><div id="townScene-environment" class="scene-slot"></div><div id="townScene-character" class="scene-slot"></div><div id="townScene-prop" class="scene-slot"></div></div></section>`;
    const resource=$('resourceWorkspace'); resource.parentNode.insertBefore(section,resource);
  }
}
function readScene() {
  try { const value=JSON.parse(localStorage.getItem(STORAGE_SCENE)||'{}'); return {environment:value.environment||null,character:value.character||null,prop:value.prop||null}; }
  catch { return {environment:null,character:null,prop:null}; }
}
function saveScene() { localStorage.setItem(STORAGE_SCENE, JSON.stringify(scenePlan)); }
function text(record) { return [record.name,record.path,record.packId,record.collectionPath].map((v)=>String(v||'').toLowerCase()).join(' '); }
function hasAny(hay, words) { return words.some((word)=>hay.includes(word)); }
function isRenderable(record) { return record?.kind === 'model-3d' && ['glb','gltf'].includes(record.format); }
function isKenney(record) { return String(record?.packId||'').startsWith('kenney-') || String(record?.path||'').toLowerCase().includes('/kenney_'); }
function isKayKit(record) { return String(record?.packId||'').startsWith('kaykit-') || String(record?.path||'').includes('/KayKit_'); }
function isSpaceKit(record) { return record?.packId === 'scifi-ultimate-space-kit-quaternius' || /SciFI_Ultimate Space Kit_Quaternius/i.test(String(record?.path||'')); }
function isAnimationSource(record) { return /\/Animations\//i.test(String(record?.path||'')) || record?.packId === 'kaykit-character-animations-1-1'; }
function facts(record) { return state.rigById?.get(record.assetId) || record.rigFacts || {}; }
function rigFamily(record) { const names=(facts(record).skins||[]).map((skin)=>String(skin?.name||'')); const hit=names.find((name)=>RIG_FAMILY_RE.test(name)); return hit?.match(RIG_FAMILY_RE)?.[0] || null; }
function isCharacter(record) { return isRenderable(record) && isKayKit(record) && facts(record).hasSkin === true && !isAnimationSource(record); }
function isWorldCandidate(record) { return isRenderable(record) && facts(record).hasSkin !== true && !isAnimationSource(record) && (isKenney(record) || isKayKit(record) || isSpaceKit(record)); }
function mystery(record) { return record?.packId === 'kaykit-mystery-series6' || /KayKit_Mystery_Series6/i.test(String(record?.path||'')); }
function queryMatch(record) { const q=String($('townSearch')?.value||'').trim().toLowerCase(); return !q || text(record).includes(q); }
function vendorMatch(record) { const vendor=$('townVendorFilter')?.value || 'first-choice'; if (vendor==='kenney') return isKenney(record); if (vendor==='kaykit') return isKayKit(record); if (vendor==='space') return isSpaceKit(record); return isKenney(record)||isKayKit(record)||isSpaceKit(record); }
function worldCategoryMatch(record) { const mode=$('townWorldFilter')?.value || 'nature', hay=text(record); if(mode==='nature')return hasAny(hay,NATURE)||record.packId==='kaykit-forest-nature-pack-1-0-free'||record.packId==='kenney-nature-kit'; if(mode==='buildings')return hasAny(hay,BUILDINGS); if(mode==='space')return isSpaceKit(record)||hasAny(hay,SPACE); return true; }
function worldPackMatch(record) { const pack=$('townWorldPackFilter')?.value || ''; return !pack || record.packId===pack; }
function worldRank(record) { if(record.packId==='kaykit-forest-nature-pack-1-0-free')return 0;if(record.packId==='kenney-nature-kit')return 1;if(String(record.packId||'').includes('city-kit'))return 2;if(isSpaceKit(record))return 3;if(FIRST_CHOICE_PACKS.has(record.packId))return 4;if(isKayKit(record))return 5;if(isKenney(record))return 6;return 7; }
function characterScopeMatch(record) { return ($('townCharacterScope')?.value||'mystery-first')==='mystery-only' ? mystery(record) : true; }
function characterRigMatch(record) { const wanted=$('townRigFamilyFilter')?.value || ''; return !wanted || rigFamily(record)===wanted; }
function characterRank(record) { return mystery(record)?0:String(record.packId||'').includes('character')?1:2; }
function byRank(rank) { return (a,b)=>rank(a)-rank(b)||String(a.name).localeCompare(String(b.name))||String(a.path).localeCompare(String(b.path)); }
function openAsset(assetId){document.dispatchEvent(new CustomEvent('kfb-open-asset',{detail:assetId}));}
function cardBadge(record) { const nodes=[];if(isKenney(record))nodes.push(badge('Kenney'));else if(isKayKit(record))nodes.push(badge('KayKit'));else if(isSpaceKit(record))nodes.push(badge('Space Kit'));const family=rigFamily(record);if(family)nodes.push(badge(family,'ok'));if(mystery(record))nodes.push(badge('Mystery Series'));return nodes; }
function renderCard(record, role) {
  const card=document.createElement('article'); card.className='town-card'; card.dataset.assetId=record.assetId; if(scenePlan[role]===record.assetId)card.classList.add('active');
  const thumb=document.createElement('button'); thumb.type='button'; thumb.className='town-thumb'; thumb.title='Open asset detail'; thumb.onclick=()=>openAsset(record.assetId); attach3DThumbnail(record,thumb);
  const copy=document.createElement('div');copy.className='town-card-copy';const title=document.createElement('button');title.type='button';title.className='town-title';title.textContent=record.name;title.onclick=()=>openAsset(record.assetId);const meta=document.createElement('div');meta.className='town-meta';meta.textContent=record.packId||record.collectionPath||'unpacked';const badges=document.createElement('div');badges.className='badges';badges.append(...cardBadge(record));const actions=document.createElement('div');actions.className='town-card-actions';
  const use=document.createElement('button');use.type='button';use.className=scenePlan[role]===record.assetId?'primary':'quiet small-button';use.textContent=role==='environment'?'Use environment':role==='character'?'Use character':'Use prop';use.onclick=()=>setScene(role,record.assetId);
  const add=document.createElement('button');add.type='button';add.className='quiet small-button';add.textContent=state.selected.has(record.assetId)?'Selected':'Add';add.disabled=state.selected.has(record.assetId);add.onclick=()=>{toggleSelected(record.assetId,true);add.textContent='Selected';add.disabled=true;};actions.append(use,add);copy.append(title,meta,badges,actions);card.append(thumb,copy);return card;
}
function renderLane(targetId,metaId,rows,role){const target=$(targetId),meta=$(metaId);if(!target)return;const limit=limits[role];target.replaceChildren(...rows.slice(0,limit).map((record)=>renderCard(record,role)));meta.textContent=`${Math.min(rows.length,limit).toLocaleString()} shown · ${rows.length.toLocaleString()} candidates`;const moreId=`townMore-${role}`;document.getElementById(moreId)?.remove();if(rows.length>limit){const more=document.createElement('button');more.id=moreId;more.type='button';more.className='quiet town-more';more.textContent=`Show ${Math.min(LIMIT_STEP,rows.length-limit)} more`;more.onclick=()=>{limits[role]+=LIMIT_STEP;renderTown();};target.after(more);}}
function worldRows(){return state.catalog.filter((r)=>isWorldCandidate(r)&&vendorMatch(r)&&worldCategoryMatch(r)&&worldPackMatch(r)&&queryMatch(r)).sort(byRank(worldRank));}
function characterRows(){return state.catalog.filter((r)=>isCharacter(r)&&characterScopeMatch(r)&&characterRigMatch(r)&&queryMatch(r)).sort(byRank(characterRank));}
function propRows(){const character=state.catalogById?.get(scenePlan.character);const base=state.catalog.filter((r)=>isRenderable(r)&&facts(r).hasSkin!==true&&!isAnimationSource(r)&&isKayKit(r)&&queryMatch(r));if(!character)return base.filter((r)=>mystery(r)).sort((a,b)=>String(a.name).localeCompare(String(b.name)));return base.filter((r)=>r.assetId!==character.assetId&&r.packId===character.packId&&r.collectionPath===character.collectionPath).sort((a,b)=>String(a.name).localeCompare(String(b.name)));}
function fillWorldPacks(){const select=$('townWorldPackFilter');if(!select)return;const previous=select.value;const packs=[...new Set(state.catalog.filter((r)=>isWorldCandidate(r)&&vendorMatch(r)).map((r)=>r.packId).filter(Boolean))].sort();select.replaceChildren(new Option('All matching packs',''),...packs.map((pack)=>new Option(pack,pack)));if(packs.includes(previous))select.value=previous;}
function recordLabel(record){return record?`${record.name} · ${record.packId||'unpacked'}`:'Not selected';}
function renderSceneSlot(role,label){const host=$(`townScene-${role}`);if(!host)return;const record=state.catalogById?.get(scenePlan[role]);host.replaceChildren();const strong=document.createElement('strong');strong.textContent=label;const value=document.createElement(record?'button':'span');value.textContent=recordLabel(record);value.className=record?'scene-slot-value':'small-note';if(record){value.type='button';value.onclick=()=>openAsset(record.assetId);}const clear=document.createElement('button');clear.type='button';clear.className='quiet small-button';clear.textContent='Clear';clear.disabled=!record;clear.onclick=()=>setScene(role,null);host.append(strong,value,clear);}
function scenePayload(){const asset=(role)=>{const r=state.catalogById?.get(scenePlan[role]);return r?{assetId:r.assetId,name:r.name,path:r.path,packId:r.packId,collectionPath:r.collectionPath,source:r.source}:null;};return{schema:'kfb.town-scene-candidate.v1',sourceRepo:state.manifest?.sourceRepo,sourceCommit:state.manifest?.sourceCommit,registryMode:state.registryMode,status:'candidate-only',ownership:'KFB Town / receiving implementation validates composition and runtime suitability',slots:{environment:asset('environment'),character:asset('character'),prop:asset('prop')}};}
function renderScene(){renderSceneSlot('environment','Environment');renderSceneSlot('character','Character');renderSceneSlot('prop','Prop');const chosen=Object.values(scenePlan).filter(Boolean).length;$('townAddScene').disabled=!chosen;$('townCopyScene').disabled=!chosen;}
function setScene(role,assetId){scenePlan[role]=assetId||null;if(role==='character'&&scenePlan.prop){const prop=state.catalogById?.get(scenePlan.prop),character=state.catalogById?.get(scenePlan.character);if(!prop||!character||prop.packId!==character.packId||prop.collectionPath!==character.collectionPath)scenePlan.prop=null;}saveScene();limits[role]=LIMIT_STEP;if(role==='character')limits.prop=LIMIT_STEP;renderTown();}
function renderTown(){if(!initialized||!state.catalog)return;fillWorldPacks();const worlds=worldRows(),chars=characterRows(),props=propRows();renderLane('townEnvironmentList','townEnvironmentMeta',worlds,'environment');renderLane('townCharacterList','townCharacterMeta',chars,'character');renderLane('townPropList','townPropMeta',props,'prop');const character=state.catalogById?.get(scenePlan.character);$('townPropHint').textContent=character?`Structural siblings from ${character.collectionPath||character.packId}. These are candidate props, not semantic ownership claims.`:'Choose a KayKit character to focus this lane on structural siblings from the same collection.';renderScene();}
function closeDrawers(){for(const id of ['detailPanel','resourceDetailPanel','selectionTray']){$(id)?.classList.remove('open');$(id)?.setAttribute('aria-hidden','true');}if($('drawerBackdrop'))$('drawerBackdrop').hidden=true;}
export async function activateTownWorkbench(){ensureTownDom();document.querySelectorAll('.production-tab').forEach((button)=>button.classList.remove('active'));$('townTab').classList.add('active');$('assetWorkspace').hidden=true;$('resourceWorkspace').hidden=true;$('townWorkspace').hidden=false;closeDrawers();if(!state.catalog||!state.rigById){initialized=false;$('townStatus').textContent='Loading catalog + rig facts…';await ensureCatalog();await ensureRigFacts();initialized=true;$('townStatus').textContent='Workbench ready';}else initialized=true;renderTown();}
export function hideTownWorkbench(){if($('townWorkspace'))$('townWorkspace').hidden=true;if($('townTab'))$('townTab').classList.remove('active');}
export function getTownScene(){return scenePayload();}
function init(){ensureTownDom();document.title='KFB Asset Librarian v1.6';const version=document.querySelector('h1 span');if(version)version.textContent='v1.6';$('townTab').onclick=()=>activateTownWorkbench().catch((error)=>{$('townStatus').textContent=`Workbench unavailable: ${error.message}`;$('townStatus').classList.add('error');});for(const id of ['townSearch','townVendorFilter','townWorldFilter','townWorldPackFilter','townCharacterScope','townRigFamilyFilter']){const node=$(id);node.addEventListener(id==='townSearch'?'input':'change',()=>{limits={environment:LIMIT_STEP,character:LIMIT_STEP,prop:LIMIT_STEP};renderTown();});}for(const tab of document.querySelectorAll('[data-library-tab]'))tab.addEventListener('click',hideTownWorkbench);$('townAddScene').onclick=()=>{for(const id of Object.values(scenePlan).filter(Boolean))toggleSelected(id,true);updateSelectionUI();};$('townCopyScene').onclick=()=>copyText(JSON.stringify(scenePayload(),null,2)+'\n');setTimeout(()=>{if(window.KFBAssetLibrarianV15)window.KFBAssetLibrarianV16={...window.KFBAssetLibrarianV15,version:'1.6',activateTownWorkbench,getTownScene};},0);}
init();
