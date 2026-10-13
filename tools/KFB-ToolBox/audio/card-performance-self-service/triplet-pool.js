import { originalCardPage } from './card-source-visual.mjs';
import { fetchGithubFile } from './card-performance.js?v=0.7.0';
import { POOL_SCHEMA,validatePool,validateSource,missingFields,fullSourceBeat,validateBeat,retention,applyOpener,openerAllowed,makePacket,seededOrder,validateOpener } from './triplet-pool-core.mjs';
const REF='planning/kfb-chatterbox-voice-layer-v1-2026-10-08';
const PATH='skills/chat/workflows/KFB_CHATTERBOX_VOICE_V1_2026-10-08/data/KFB_TRIPLET_OPENER_POOL_R1_2026-10-13.json';
const KEY='kfb.triplet-pool.local/1';
const $=s=>document.querySelector(s), esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let registry,registryBlob,pool,poolBlob,basePool,state,deck,meta,loadToken=0;
const note=x=>$('#poolStatus').textContent=x;
const guard=fn=>async()=>{try{await fn();}catch(e){note('Stopped safely · '+e.message);}};
const save=()=>{state.pool=pool;localStorage.setItem(KEY,JSON.stringify(state));localStorage.setItem(KEY+':'+state.deckId,JSON.stringify(state));};
const card=()=>deck.cards.find(c=>c.cardNumber===state.active);
const beat=()=>state.beats[state.active];
const opts=()=>({allowPerformerFiction:$('#poolFiction').checked,sourceClass:$('#poolClass').value,pronoun:$('#poolPronoun').value,classEvidence:JSON.parse($('#poolClassEvidence').value||'null')});
function packet(selection=state.selection){return makePacket({pool,deck,meta,beats:state.beats,selection,intro:state.intro,preview:true,contentBlob:poolBlob,registryBlob});}
async function loadDeck(id,restore=false){
  if(state?.deckId)localStorage.setItem(KEY+':'+state.deckId,JSON.stringify(state));
  const token=++loadToken;const d=registry.decks.find(d=>d.packId===id);if(!d)throw Error('UNKNOWN_REGISTRY_DECK');
  const entry=await fetchGithubFile(REF,'media/kfb/'+d.data);const source=validateSource(JSON.parse(entry.text),d);if(entry.cacheState==='LAST_KNOWN_GOOD')throw Error('OFFLINE_SOURCE · source not reverified; draft preserved');if(token!==loadToken)return;
  let scoped;try{scoped=JSON.parse(localStorage.getItem(KEY+':'+id)||'null');}catch{}
  if(scoped && scoped.cardBlob!==entry.sha)throw Error('SOURCE_REVISION_CONFLICT · saved '+id+' draft retained; export before source migration');
  if(scoped)state=scoped;
  deck=source;meta={...d,deckId:id,cardBlob:entry.sha,pdfPath:'media/kfb/'+d.pdf};
  if(state?.deckId!==id || state?.cardBlob!==entry.sha){
    state={deckId:id,cardBlob:entry.sha,beats:{},selection:[],active:id==='wrinkle_rumble'?10:source.cards[0].cardNumber,intro:'',seed:'kfb',history:{},baseContentRevision:pool.contentRevision,baseContentBlob:poolBlob};
    for(const c of source.cards){if(!missingFields(c).length)state.beats[c.cardNumber]=fullSourceBeat(c,meta);}
    for(const b of pool.beats.filter(b=>b.deckId===id && b.cardBlob===entry.sha)){validateBeat(b,source.cards.find(c=>c.cardNumber===b.cardNumber),meta);state.beats[b.cardNumber]=structuredClone(b);}
    state.selection=[state.active];
  }
  save();render();
}
async function reload(){
  if(!$('#poolPreview').checked){note('Preview disabled. No accepted public pool has been published; source cards remain read-only.');return;}
  note('Reading explicit Voice PR #379 preview…');
  const [indexEntry,poolEntry]=await Promise.all([fetchGithubFile(REF,'media/kfb/index.json'),fetchGithubFile(REF,PATH)]);
  if([indexEntry,poolEntry].some(e=>e.cacheState==='LAST_KNOWN_GOOD'))throw Error('OFFLINE_LAST_KNOWN_GOOD · reload not proven');
  const next=validatePool(JSON.parse(poolEntry.text)),idx=JSON.parse(indexEntry.text);if(!Array.isArray(idx.decks))throw Error('INVALID_REGISTRY');
  registry=idx;registryBlob=indexEntry.sha;poolBlob=poolEntry.sha;basePool=structuredClone(next);
  let saved;try{saved=JSON.parse(localStorage.getItem(KEY)||'null');}catch{}
  const conflict=saved && saved.baseContentBlob!==poolBlob;
  pool=next;
  if(saved){state=saved;if(saved.pool){const local=validatePool(saved.pool);pool={...next,openers:[...next.openers]};for(const o of local.openers){const remote=pool.openers.find(x=>x.openerId===o.openerId);if(!remote || o.version>remote.version){pool.openers=pool.openers.filter(x=>x.openerId!==o.openerId).concat(o);}}}}
  $('#poolDeck').innerHTML=registry.decks.map(d=>`<option value="${esc(d.packId)}">${esc(d.title)} · ${d.cardCount}</option>`).join('');
  $('#poolDeck').value=state?.deckId||'wrinkle_rumble';
  await loadDeck($('#poolDeck').value,true);
  note(conflict?'New GitHub revision loaded. Local beats preserved. Compare, then Reload card to adopt each remote change. Export base revision is stale until reset.':'GitHub pool loaded. Drafts stay local; original Cards read-only.');
}
function render(){
  $('#poolRevision').textContent=`PREVIEW · ${basePool.contentRevision} · blob ${poolBlob} · ${pool.openers.length} openers`;
  $('#poolDraftRevision').textContent=`Local base ${state.baseContentRevision} · ${state.baseContentBlob===poolBlob?'current':'REVISION CONFLICT: compare / reload before writeback'}`;
  $('#poolDeck').value=state.deckId;
  $('#poolCards').innerHTML=deck.cards.map(c=>`<option value="${c.cardNumber}" ${state.selection.includes(c.cardNumber)?'selected':''}>${c.cardNumber} · ${esc(c.cardName)}${missingFields(c).length?' · BLOCKED / NO_BEAT_SOURCE_INCOMPLETE':''}</option>`).join('');
  $('#poolCount').textContent=`${deck.cards.length} original Cards · ${deck.cards.filter(c=>missingFields(c).length).length} blocked · ${state.selection.length} selected`;
  $('#poolActive').innerHTML=deck.cards.map(c=>`<option value="${c.cardNumber}" ${c.cardNumber===state.active?'selected':''}>${c.cardNumber} · ${esc(c.cardName)}</option>`).join('');
  $('#poolOrder').innerHTML=state.selection.map((n,i)=>`<button data-pool-card="${n}">${i+1} · ${n}</button>`).join(' ');
  document.querySelectorAll('[data-pool-card]').forEach(b=>b.onclick=()=>{state.active=Number(b.dataset.poolCard);save();renderCard();});
  $('#poolIntro').value=state.intro;$('#poolSeed').value=state.seed;
  renderCard();renderOpener();renderText();
}
function renderCard(){
  $('#poolActive').value=state.active;
  const c=card(),b=beat(),blocked=missingFields(c);
  $('#poolSource').innerHTML=`<div class="eyebrow">ORIGINAL · ${esc(state.deckId)} / ${c.cardNumber} · ${meta.cardBlob}</div><h4>${esc(c.cardName)}</h4><dl><dt>POWER</dt><dd>${esc(c.power??'null · SOURCE MISSING')}</dd><dt>LORE</dt><dd>${esc(c.lore??'null · SOURCE MISSING')}</dd></dl><a href="https://github.com/georg-doc/kayfabizarro/blob/${encodeURIComponent(REF)}/${meta.pdfPath.split('/').map(encodeURIComponent).join('/')}#page=${meta.coverOffset+1+Math.floor((c.cardNumber-1)/4)}" target="_blank" rel="noopener">Original PDF Card Grid · page ${meta.coverOffset+1+Math.floor((c.cardNumber-1)/4)} · ${['TL','TR','BL','BR'][(c.cardNumber-1)%4]}</a>`;
  $('#poolLine').value=b?.surfaceText||'';$('#poolLine').disabled=!!blocked.length;
  $('#poolEvidence').value=JSON.stringify(b?.evidence||[],null,2);$('#poolSemantic').value=JSON.stringify(b?.semanticCoverage||{},null,2);
  $('#poolMode').value=b?.mode||'FULL_SOURCE_RECITAL';$('#poolReview').textContent=blocked.length?'BLOCKED / NO_BEAT_SOURCE_INCOMPLETE · '+blocked.join(', '):`${b.status} · ${b.mode} · human acceptance ${b.humanAcceptance||'PENDING'}`;
  $('#poolOpener').innerHTML=pool.openers.map(o=>`<option value="${esc(o.openerId)}" ${o.openerId===b?.openerId?'selected':''}>${esc(o.openerId)} v${o.version} · ${esc(o.status)}${o.retired?' · RETIRED':''}${!o.enabled?' · disabled':''}</option>`).join('');
  $('#poolClass').value=c.cardName==='The Cookie of Causality'?'FOOD':'SOURCE_NEUTRAL';$('#poolClassEvidence').value=c.cardName==='The Cookie of Causality'?JSON.stringify({field:'lore',quote:'a snickerdoodle'}):'null';
  $('#poolAudit').textContent=b?JSON.stringify(retention(b,c)):'No beat generated. No source replacement.';
  $('#poolPause').value=b?.delivery?.pauseAfterMs??800;$('#poolEmphasis').value=b?.delivery?.emphasis||'';
  const remote=basePool.beats.find(x=>x.deckId===state.deckId&&x.cardNumber===state.active);
  $('#poolCompare').textContent=remote?`GitHub v${remote.version} · ${remote.status}: ${remote.surfaceText}`:'GitHub has no compact recipe for this Card. Full source is an explicit recitation, not a semantic Triplet.';
}
function renderText(){try{$('#poolScript').value=packet().text;}catch(e){$('#poolScript').value='Not playable/exportable: '+e.message;}}
function checkpoint(){const key=String(state.active);state.history[key]??=[];state.history[key].push(structuredClone(beat()));if(state.history[key].length>20)state.history[key].shift();}
function saveBeat(){
  if(!beat())throw Error('NO_BEAT_SOURCE_INCOMPLETE');
  const next={...beat(),surfaceText:$('#poolLine').value.trim(),evidence:JSON.parse($('#poolEvidence').value),semanticCoverage:JSON.parse($('#poolSemantic').value),mode:$('#poolMode').value,version:beat().version+1,status:'EDITORIAL_CANDIDATE',reviewer:null,humanAcceptance:'PENDING',delivery:{...beat().delivery,pauseAfterMs:Number($('#poolPause').value),emphasis:$('#poolEmphasis').value},history:[...(beat().history||[]),{version:beat().version,text:beat().surfaceText,status:beat().status}]};
  validateBeat(next,card(),meta);checkpoint();state.beats[state.active]=next;save();renderCard();renderText();note('Card saved locally. Editorial evidence is a claim for review; no automatic creative acceptance.');
}
function renderOpener(){
  const current=$('#poolCatalogSelect').value;
  $('#poolCatalogSelect').innerHTML=pool.openers.map(o=>`<option value="${esc(o.openerId)}">${esc(o.openerId)} v${o.version} · ${esc(o.status)}${o.retired?' · RETIRED':''}</option>`).join('');
  if(pool.openers.some(o=>o.openerId===current))$('#poolCatalogSelect').value=current;
  $('#poolOpenerJson').value=JSON.stringify(pool.openers.find(o=>o.openerId===$('#poolCatalogSelect').value),null,2);
}
function editOpener(retire=false){
  const candidate=JSON.parse($('#poolOpenerJson').value),old=pool.openers.find(o=>o.openerId===candidate.openerId);
  candidate.status='PROPOSED';candidate.enabled=false;candidate.reviewer=null;candidate.humanApproval=null;candidate.version=(old?.version||0)+1;candidate.retired=retire;
  candidate.history=[...(old?.history||[]),...(old?[{version:old.version,pattern:old.pattern,status:old.status,retired:!!old.retired}]:[])];
  validateOpener(candidate);pool.openers=pool.openers.filter(o=>o.openerId!==candidate.openerId).concat(candidate);save();renderOpener();renderCard();note('Opener saved locally as PROPOSED / disabled. Export for GitHub editorial review.');
}
function download(value,name,type='application/json'){const url=URL.createObjectURL(new Blob([typeof value==='string'?value:JSON.stringify(value,null,2)],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function exportEditor(){return {schema:'kfb.voice.pool-editor-draft/1',baseContentBlob:state.baseContentBlob,baseContentRevision:state.baseContentRevision,sourceCardBlob:meta.cardBlob,pool,state:{...state,pool:undefined},packet:packet(),writeback:{repo:'georg-doc/kayfabizarro',branch:REF,path:PATH,expectedBlob:state.baseContentBlob,directCloudSave:false,route:'ORDINARY_WEB_CHAT_GITHUB_COMPARE_AND_COMMIT'}};}
function bind(){
  $('#poolShowVisual').onclick=guard(async()=>{const current=state.active;const proof=await originalCardPage({repo:'georg-doc/kayfabizarro',ref:REF,path:meta.pdfPath,cardNumber:current,coverOffset:meta.coverOffset},$('#poolOriginalCanvas'));meta.pdfRevision=proof.pdfRevision;$('#poolVisualProof').textContent=`Original PDF ${proof.pdfRevision} · page ${proof.page} · Card ${current} ${proof.quadrant} · exact crop pending`;});
  $('#poolReload').onclick=guard(reload);$('#poolPreview').onchange=()=>{if(!$('#poolPreview').checked){window.KFBCardAudition.stop();note('Preview disabled. Accepted pool not published.');}};
  $('#poolDeck').onchange=guard(()=>loadDeck($('#poolDeck').value));
  $('#poolCards').onchange=()=>{state.selection=[...$('#poolCards').selectedOptions].map(o=>Number(o.value));save();render();};
  $('#poolActive').onchange=()=>{state.active=Number($('#poolActive').value);save();renderCard();};
  document.querySelectorAll('[data-pool-scope]').forEach(b=>b.onclick=()=>{const all=deck.cards.map(c=>c.cardNumber),scope=b.dataset.poolScope;state.selection=scope==='deck'?all:scope==='page'?all.filter(n=>Math.floor((n-1)/4)===Math.floor((state.active-1)/4)):scope==='1'?[state.active]:all.slice(0,Number(scope));save();render();});
  $('#poolSaveBeat').onclick=guard(saveBeat);
  $('#poolUndo').onclick=guard(()=>{const old=state.history[state.active]?.pop();if(old){state.beats[state.active]=old;save();renderCard();renderText();}});
  $('#poolSourceReset').onclick=guard(()=>{checkpoint();const remote=basePool.beats.find(b=>b.deckId===state.deckId&&b.cardNumber===state.active&&b.cardBlob===meta.cardBlob);state.beats[state.active]=remote?structuredClone(remote):fullSourceBeat(card(),meta);save();renderCard();renderText();});
  $('#poolFull').onclick=guard(()=>{checkpoint();state.beats[state.active]=fullSourceBeat(card(),meta);save();renderCard();renderText();});
  $('#poolApplyOpener').onclick=guard(()=>{const o=pool.openers.find(o=>o.openerId===$('#poolOpener').value);const next=applyOpener(beat(),o,card(),opts());validateBeat(next,card(),meta);checkpoint();state.beats[state.active]=next;save();renderCard();renderText();});
  $('#poolShuffle').onclick=()=>{state.seed=$('#poolSeed').value;state.selection=seededOrder(state.selection,state.seed);save();render();};
  $('#poolIntro').onchange=()=>{state.intro=$('#poolIntro').value.replace(/[\r\n]+/g,' ');save();renderText();};
  document.querySelectorAll('[data-pool-verdict]').forEach(b=>b.onclick=guard(()=>{if(!beat())throw Error('NO_BEAT');checkpoint();state.beats[state.active]={...beat(),localVerdict:b.dataset.poolVerdict,status:b.dataset.poolVerdict==='CUT'?'QUARANTINED':'EDITORIAL_CANDIDATE',reviewer:null,humanAcceptance:'PENDING'};save();renderCard();renderText();note('Local '+b.dataset.poolVerdict+' recorded; GitHub acceptance requires owner review.');}));
  $('#poolCatalogSelect').onchange=renderOpener;$('#poolSaveOpener').onclick=guard(()=>editOpener());$('#poolRetireOpener').onclick=guard(()=>editOpener(true));
  $('#poolNewOpener').onclick=()=>{$('#poolOpenerJson').value=JSON.stringify({...pool.openers[1],openerId:'NEW_'+Date.now(),version:1,status:'PROPOSED',enabled:false,reviewer:null,history:[],pattern:'Ever heard of {title}?'},null,2);};
  $('#poolPlay').onclick=guard(async()=>{if(!$('#poolPreview').checked)throw Error('EXPLICIT_PREVIEW_REQUIRED');const p=packet();if(!window.KFBCardAudition)throw Error('AUDIO_OWNER_UNAVAILABLE');await window.KFBCardAudition.play({segments:[...(p.PerformanceSet.intro?[{cueId:'intro',kind:'intro',text:p.PerformanceSet.intro}]:[]),...p.CardBeats.map(b=>({cueId:b.beatId,kind:'card',cardNumber:b.cardNumber,text:b.surfaceText,pauseAfterMs:b.delivery?.pauseAfterMs||0})),{cueId:'outro',kind:'outro',text:'Stay Fluffy!'}],bed:$('#poolBed').value,rate:Number($('#poolRate').value),pitch:1,voiceURI:$('#poolVoice').value,deckId:state.deckId,sourceRevision:meta.cardBlob,contentRevision:pool.contentRevision});note('Audition through existing Audio owner. Human intelligibility remains KEEP/TUNE/CUT.');});
  $('#poolStop').onclick=()=>window.KFBCardAudition?.stop();
  $('#poolExport').onclick=guard(()=>download(exportEditor(),'kfb-triplet-opener-editor.json'));
  $('#poolExportPacket').onclick=guard(()=>download(packet(),'kfb-card-performance-packet.json'));
  $('#poolLyrics').onclick=guard(()=>download('[Spoken Word]\n\n'+packet().text+'\n\n[End]','kfb-suno-lyrics.txt','text/plain'));
  $('#poolStyle').onclick=()=>download('Solo spoken-word stand-up, clear natural English, dry solo voice, no instruments, no singing, no music or effects. Independent card beats with short pauses. No chorus. Dry output is requested, not guaranteed.','kfb-suno-style.txt','text/plain');
  $('#poolImportApply').onclick=guard(async()=>{
    const value=JSON.parse($('#poolImport').value);if(value.schema!=='kfb.voice.pool-editor-draft/1')throw Error('EDITOR_PACKAGE_REQUIRED');
    const importedPool=validatePool(value.pool),saved=structuredClone(value.state),d=registry.decks.find(d=>d.packId===saved.deckId);if(!d)throw Error('UNKNOWN_DECK');
    const entry=await fetchGithubFile(REF,'media/kfb/'+d.data,saved.cardBlob);if(entry.cacheState==='LAST_KNOWN_GOOD')throw Error('IMPORTED_SOURCE_NOT_REVERIFIED');
    const importedDeck=validateSource(JSON.parse(entry.text),d),importedMeta={...d,deckId:d.packId,cardBlob:entry.sha,pdfPath:'media/kfb/'+d.pdf};
    if(saved.cardBlob!==entry.sha)throw Error('IMPORTED_SOURCE_REVISION_CONFLICT');
    if(!Array.isArray(saved.selection)||saved.selection.some(n=>!importedDeck.cards.some(c=>c.cardNumber===n)))throw Error('IMPORTED_SELECTION_INVALID');
    if(!importedDeck.cards.some(c=>c.cardNumber===saved.active) || !saved.beats || typeof saved.beats!=='object' || !saved.history || typeof saved.history!=='object')throw Error('IMPORTED_ACTIVE_OR_STATE_INVALID');
    for(const [key,b] of Object.entries(saved.beats)){if(Number(key)!==b.cardNumber)throw Error('IMPORTED_BEAT_MAP_CONFLICT');validateBeat(b,importedDeck.cards.find(c=>c.cardNumber===b.cardNumber),importedMeta);if(!['QUARANTINED','PROPOSED'].includes(b.status))b.status='EDITORIAL_CANDIDATE';b.reviewer=null;b.humanAcceptance='PENDING';b.humanApproval=null;}
    for(const [key,items] of Object.entries(saved.history)){if(!Array.isArray(items))throw Error('IMPORTED_HISTORY_INVALID');for(const b of items){if(Number(key)!==b.cardNumber)throw Error('IMPORTED_HISTORY_CARD_CONFLICT');validateBeat(b,importedDeck.cards.find(c=>c.cardNumber===b.cardNumber),importedMeta);}}
    const importedOpeners=importedPool.openers.map(o=>{const trusted=basePool.openers.find(x=>JSON.stringify(x)===JSON.stringify(o));return trusted?structuredClone(trusted):{...o,status:'PROPOSED',enabled:false,reviewer:null,humanApproval:null};});
    // Mutate only after the complete package has passed validation.
    if(state?.deckId)localStorage.setItem(KEY+':'+state.deckId,JSON.stringify(state));
    state=saved;pool={...importedPool,openers:importedOpeners};deck=importedDeck;meta=importedMeta;save();render();note('Editor state restored locally. Untrusted review claims downgraded; quarantine preserved.');
  });
  const populate=()=>{$('#poolVoice').innerHTML=window.speechSynthesis?.getVoices().filter(v=>/^en[-_]/i.test(v.lang)).map(v=>`<option value="${esc(v.voiceURI)}" ${/Samantha|Google US English/.test(v.name)?'selected':''}>${esc(v.name)} · ${esc(v.lang)}</option>`).join('')||'<option value="">Default English</option>';};populate();window.speechSynthesis?.addEventListener('voiceschanged',populate);
  window.KFBTripletPool={version:'0.7.0',getState:()=>structuredClone({state,pool,meta,contentBlob:poolBlob,registryBlob}),getPacket:packet,reload};
}
bind();note('Enable explicit preview, then Reload pool. No private draft is loaded silently.');
