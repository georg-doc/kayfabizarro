const RAW='https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
let catalog=null,soundscape=null,sourceIntake=null,intake=[];
const audioUrl=file=>RAW+file.split('/').map(encodeURIComponent).join('/');
const text=(v='')=>String(v??'');
const escapeHtml=s=>text(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function firstJson(urls){let last=null;for(const u of urls){try{const r=await fetch(u,{cache:'no-store'});if(!r.ok)throw new Error('HTTP '+r.status+' '+u);return await r.json()}catch(e){last=e}}throw last||new Error('no JSON source')}
async function load(){
  [catalog,soundscape,sourceIntake]=await Promise.all([
    firstJson(['./catalog.snapshot.json','../../media/3D_Assets/Sounds/jukebox.json',RAW+'media/3D_Assets/Sounds/jukebox.json']),
    firstJson(['./soundscape-source.json']),
    firstJson(['./source-intake.v1.json'])
  ]);
  renderAll();bind();
}
function meta(t){const a=[];if(t.collection)a.push(t.collection);if(t.bpm)a.push(t.bpm+' BPM');if(t.stems)a.push((t.stems.policy==='certified'?'STEMS ✓':'stems source'));return a.join(' · ')}
function renderCatalog(){
 const q=$('#search').value.trim().toLowerCase(),coll=$('#collection').value,sf=$('#stemFilter').value;
 const all=catalog.tracks,filtered=all.filter(t=>{
  if(coll&&t.collection!==coll)return false;
  if(sf==='stems'&&!t.stems)return false;
  if(sf==='certified'&&t.stems?.policy!=='certified')return false;
  if(!q)return true;
  return JSON.stringify([t.title,t.id,t.roles,t.moods,t.tags,t.family]).toLowerCase().includes(q);
 });
 $('#stats').textContent=filtered.length+' shown · '+all.length+' catalog tracks · '+all.filter(t=>t.collection==='roadtrip-v2').length+' RoadTrip v2 · '+all.filter(t=>t.stems).length+' stem families';
 $('#catalogGrid').innerHTML=filtered.map(t=>'<article class="track"><div><h3>'+escapeHtml(t.title)+'</h3><div class="tiny">'+escapeHtml(meta(t))+'</div></div><div class="chips">'+(t.roles||[]).map(x=>'<span class="chip">'+escapeHtml(x)+'</span>').join('')+(t.stems?.policy==='certified'?'<span class="chip ok">stem-certified</span>':'')+(t.humanReview?.status==='positive'?'<span class="chip ok">human-positive</span>':'')+'</div><div class="track-actions"><button class="play" data-play="'+escapeHtml(t.id)+'">Play master</button><button data-ref="'+escapeHtml(t.id)+'">Use as ref</button></div></article>').join('');
 $$('[data-play]').forEach(b=>b.onclick=()=>playTrack(b.dataset.play));
 $$('[data-ref]').forEach(b=>b.onclick=()=>addPromptRef(b.dataset.ref));
}
function playTrack(id){
 const t=catalog.tracks.find(x=>x.id===id);if(!t)return;
 const a=$('#preview');a.src=audioUrl(t.file);a.play().catch(()=>{});
 $('#nowTitle').textContent=t.title;$('#nowMeta').textContent=meta(t)+' · MASTER';
}
function fillSelect(sel,includeLegacy=true){
 sel.innerHTML=catalog.tracks.filter(t=>includeLegacy||t.collection==='roadtrip-v2').map(t=>'<option value="'+escapeHtml(t.id)+'">'+escapeHtml(t.title)+(t.bpm?' · '+t.bpm:'')+'</option>').join('');
}
function renderSources(){
 $('#availableSources').innerHTML=soundscape.available.map(s=>'<div class="sourceitem"><div><b>'+escapeHtml(s.label)+'</b><br><small>'+escapeHtml(s.role)+'</small></div><span class="chip ok">source</span></div>').join('');
 $('#missingSources').innerHTML=soundscape.missing.map(s=>'<div class="sourceitem"><div><b>'+escapeHtml(s.label)+'</b><br><small>'+escapeHtml(s.need)+'</small></div><span class="chip missing">'+escapeHtml(s.status)+'</span></div>').join('');
}
let aMix=new Audio(),bMix=new Audio(),fadeTimer=null;aMix.crossOrigin='anonymous';bMix.crossOrigin='anonymous';
function loadMix(which){
 const sel=$(which==='A'?'#deckA':'#deckB'),t=catalog.tracks.find(x=>x.id===sel.value),a=which==='A'?aMix:bMix;if(!t)return;a.src=audioUrl(t.file);a.currentTime=0;return {a,t};
}
function setFade(v){
 v=+v;const av=Math.cos(v*Math.PI/2),bv=Math.sin(v*Math.PI/2);aMix.volume=av;bMix.volume=bv;$('#xfade').value=v;$('#xfadeLabel').textContent='A '+Math.round(av*100)+'% · B '+Math.round(bv*100)+'%';
}
function autoFade(sec){
 clearInterval(fadeTimer);const start=+$('#xfade').value,target=start<.5?1:0,t0=performance.now();fadeTimer=setInterval(()=>{const p=Math.min(1,(performance.now()-t0)/(sec*1000));setFade(start+(target-start)*p);if(p>=1){clearInterval(fadeTimer);fadeTimer=null}},40);
}
function filesChanged(list){
 intake=[...list].map(f=>({name:f.name,size:f.size,type:f.type||null,relativePath:f.webkitRelativePath||null,lastModified:f.lastModified}));
 $('#queue').innerHTML=intake.length?intake.map(x=>'<div><b>'+escapeHtml(x.name)+'</b> <span class="tiny">'+Math.round(x.size/1024)+' KB'+(x.relativePath?' · '+escapeHtml(x.relativePath):'')+'</span></div>').join(''):'<div class="tiny">No files selected.</div>';
}
function downloadIntake(){
 const blob=new Blob([JSON.stringify({schema:'kfb.audio-intake/0.1',created:new Date().toISOString(),files:intake},null,2)],{type:'application/json'}),u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='kfb-audio-intake.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);
}
function addPromptRef(id){const o=[...$('#pRefs').options].find(x=>x.value===id);if(o){o.selected=true;show('prompt')}}
function buildPrompt(){
 const refs=[...$('#pRefs').selectedOptions].map(o=>catalog.tracks.find(t=>t.id===o.value)).filter(Boolean);
 const mood=$('#pMood').value.trim()||'[mood]',biome=$('#pBiome').value.trim()||'[biome / place]',resident=$('#pResident').value.trim()||'[resident / performer]',role=$('#pRole').value;
 $('#promptOut').value='Create one Suno-ready KFB instrumental prompt for '+role+'. Mood: '+mood+'. Biome/place: '+biome+'. Resident/performer: '+resident+'.\n\nUse these existing KFB masters as style references, not as material to copy or cross-mix:\n'+(refs.length?refs.map(t=>'- '+t.title+(t.bpm?' · '+t.bpm+' BPM':'')+(t.moods?.length?' · '+t.moods.join('/'):'')).join('\n'):'- no reference selected yet')+'\n\nKeep the KFB audio rules: complete master first, 2–4 variants, human-select the winner, stems only afterward; preserve negative space for SFX/dialogue; avoid generic trailer/EDM cliché and invented source facts. Suggest BPM/tonal center only when musically justified. Return: main prompt + stem priority + selection note.';
}

function renderCandidates(){
 const status=$('#candidateStatus')?.value||'',category=$('#candidateCategory')?.value||'';
 const all=sourceIntake?.elevenLabs||[],xs=all.filter(x=>(!status||x.status===status)&&(!category||x.category===category));
 $('#candidateStats').textContent=xs.length+' shown · '+all.length+' ElevenLabs tests · no accepted production sources';
 $('#candidateGrid').innerHTML=xs.map(x=>'<article class="track candidate"><div><h3>'+escapeHtml(x.label)+'</h3><div class="tiny">'+escapeHtml(x.category)+' · '+Math.round(x.size/1024)+' KB</div></div><div class="chips"><span class="chip '+(x.status==='HUMAN_TUNE'?'warn':'')+'">'+escapeHtml(x.status)+'</span><span class="chip">ElevenLabs</span></div><div class="tiny">'+escapeHtml(x.note||'')+'</div><div class="track-actions"><button class="play" data-candidate-play="'+escapeHtml(x.id)+'">Play test</button></div></article>').join('');
 document.querySelectorAll('[data-candidate-play]').forEach(b=>b.onclick=()=>playCandidate(b.dataset.candidatePlay));
}
function playCandidate(id){
 const x=(sourceIntake?.elevenLabs||[]).find(v=>v.id===id);if(!x)return;
 const a=$('#preview');a.src=audioUrl(x.file);a.play().catch(()=>{});
 $('#nowTitle').textContent=x.label;$('#nowMeta').textContent=x.category+' · '+x.status+' · TEST CANDIDATE';
}
function fillCandidateFilters(){
 const sel=$('#candidateCategory');if(!sel)return;
 const cats=[...new Set((sourceIntake?.elevenLabs||[]).map(x=>x.category))].sort();
 sel.insertAdjacentHTML('beforeend',cats.map(c=>'<option value="'+escapeHtml(c)+'">'+escapeHtml(c)+'</option>').join(''));
}

function show(id){$$('.view').forEach(v=>v.classList.toggle('active',v.id===id));$$('.tabs button').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.view===id)))}
function bind(){
 $$('.tabs button').forEach(b=>b.onclick=()=>show(b.dataset.view));['#search','#collection','#stemFilter'].forEach(s=>$(s).addEventListener('input',renderCatalog));
 $('#playA').onclick=()=>{const x=loadMix('A');if(x){aMix.play();$('#nowTitle').textContent=x.t.title;$('#nowMeta').textContent='TRANSITION DECK A · MASTER'}};$('#playB').onclick=()=>{const x=loadMix('B');if(x){bMix.play();$('#nowTitle').textContent=x.t.title;$('#nowMeta').textContent='TRANSITION DECK B · MASTER'}};
 $('#xfade').oninput=e=>setFade(e.target.value);$$('[data-fade]').forEach(b=>b.onclick=()=>autoFade(+b.dataset.fade));$('#stopMix').onclick=()=>{aMix.pause();bMix.pause();clearInterval(fadeTimer)};
 const drop=$('#drop'),input=$('#files');drop.onclick=()=>input.click();input.onchange=e=>filesChanged(e.target.files);drop.ondragover=e=>{e.preventDefault();drop.classList.add('drag')};drop.ondragleave=()=>drop.classList.remove('drag');drop.ondrop=e=>{e.preventDefault();drop.classList.remove('drag');filesChanged(e.dataTransfer.files)};
 $('#candidateStatus')?.addEventListener('input',renderCandidates);$('#candidateCategory')?.addEventListener('input',renderCandidates);$('#downloadIntake').onclick=downloadIntake;$('#buildPrompt').onclick=buildPrompt;$('#copyPrompt').onclick=()=>navigator.clipboard?.writeText($('#promptOut').value);
}
function renderAll(){renderCatalog();fillSelect($('#deckA'));fillSelect($('#deckB'));$('#deckB').selectedIndex=Math.min(1,$('#deckB').options.length-1);fillSelect($('#pRefs'),false);renderSources();fillCandidateFilters();renderCandidates();setFade(0);filesChanged([])}
load().catch(e=>{document.body.insertAdjacentHTML('beforeend','<pre style="padding:20px;color:#f88">'+escapeHtml(e.stack||e)+'</pre>')});