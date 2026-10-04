const RAW='https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
let catalog=null,soundscape=null,sourceIntake=null,mixerData=null,sfxLibrary=null,intake=[];
const audioUrl=file=>RAW+file.split('/').map(encodeURIComponent).join('/');
const text=(v='')=>String(v??'');
const escapeHtml=s=>text(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function firstJson(urls){let last=null;for(const u of urls){try{const r=await fetch(u,{cache:'no-store'});if(!r.ok)throw new Error('HTTP '+r.status+' '+u);return await r.json()}catch(e){last=e}}throw last||new Error('no JSON source')}
async function load(){
 [catalog,soundscape,sourceIntake,mixerData,sfxLibrary]=await Promise.all([
   firstJson(['./catalog.snapshot.json','../../media/3D_Assets/Sounds/jukebox.json',RAW+'media/3D_Assets/Sounds/jukebox.json']),
   firstJson(['./soundscape-source.json']),
   firstJson(['./source-intake.v1.json']),
   firstJson(['./world-mixer-recipes.json']),
   firstJson(['./sfx-library.snapshot.json'])
 ]);
 renderAll();bind();
}

/* Musical World Mixer */
const musicDecks=[new Audio(),new Audio()];
musicDecks.forEach(a=>{a.crossOrigin='anonymous';a.preload='none'});
const physical={world:new Audio(),vehicle:new Audio(),accent:new Audio()};
Object.values(physical).forEach(a=>{a.crossOrigin='anonymous';a.preload='none'});
let activeMusic=0,currentTrackId=null,currentSceneId=null,fadeSeconds=8,fadeTimer=null,voiceFocus=false;
let activeRecipeId=null,sceneVariant={},layerEnabled={world:true,vehicle:true};
const getTrack=id=>catalog.tracks.find(t=>t.id===id);
const getSource=id=>soundscape.available.find(s=>s.id===id);
const getRecipe=()=>mixerData.recipes.find(r=>r.id===activeRecipeId);
const getScene=id=>getRecipe()?.scenes.find(s=>s.id===id);
const duckGain=()=>voiceFocus?.34:1;
function setMusicVolumes(a,b){musicDecks[activeMusic].volume=Math.max(0,Math.min(1,a))*duckGain();musicDecks[1-activeMusic].volume=Math.max(0,Math.min(1,b))*duckGain()}
function stopFade(){if(fadeTimer){clearInterval(fadeTimer);fadeTimer=null}}
function updatePlayIcon(){const running=musicDecks.some(a=>!a.paused);$('#worldToggle').textContent=running?'Ⅱ':'▶';$('#worldToggle').setAttribute('aria-label',running?'Pause':'Play')}
function setProgress(p){$('#worldProgress').style.width=(Math.max(0,Math.min(1,p))*100)+'%'}
function syncLayerButton(name,on){const b=document.querySelector('[data-layer="'+name+'"]');if(b)b.classList.toggle('active',on)}
function setPhysicalAudio(channel,sourceId,shouldPlay){
 const a=physical[channel];const src=getSource(sourceId);
 if(!src){a.pause();a.removeAttribute('src');return}
 const u=audioUrl(src.file);if(a.src!==u){a.src=u;a.loop=!!src.loop;a.volume=channel==='vehicle'?.22:.13}
 if(shouldPlay)a.play().catch(()=>{});
}
function syncPhysical(scene,shouldPlay){
 if(layerEnabled.world&&scene?.world)setPhysicalAudio('world',scene.world,shouldPlay);else physical.world.pause();
 if(layerEnabled.vehicle&&scene?.vehicle)setPhysicalAudio('vehicle',scene.vehicle,shouldPlay);else physical.vehicle.pause();
 if(scene?.accent&&shouldPlay){setPhysicalAudio('accent',scene.accent,true)}else physical.accent.pause();
}
function sceneTrack(scene){
 const i=sceneVariant[scene.id]||0;return getTrack(scene.tracks[i%scene.tracks.length]);
}
function updateWorldUI(scene,track,transition=''){
 currentSceneId=scene.id;
 $$('#sceneStrip .scene-btn').forEach(b=>b.classList.toggle('active',b.dataset.scene===scene.id));
 $('#worldMode').textContent=scene.label+' · '+scene.mode;
 $('#worldTitle').textContent=track?.title||'No track';
 $('#worldTransition').textContent=transition||'Ready';
 $('#worldAlt').disabled=(scene.tracks?.length||0)<2;
 $('#worldAlt').style.opacity=$('#worldAlt').disabled?'.28':'1';
}
function loadCurrentScene(scene,{play=false}={}){
 const t=sceneTrack(scene);if(!t)return;
 stopFade();const a=musicDecks[activeMusic];a.src=audioUrl(t.file);a.currentTime=0;a.volume=duckGain();currentTrackId=t.id;setProgress(0);
 updateWorldUI(scene,t);syncPhysical(scene,play);if(play)a.play().catch(()=>{});updatePlayIcon();
}
function transitionTo(scene){
 const t=sceneTrack(scene);if(!t)return;
 const running=musicDecks.some(a=>!a.paused);
 if(!currentTrackId||!running){loadCurrentScene(scene,{play:running});return}
 if(t.id===currentTrackId){updateWorldUI(scene,t);syncPhysical(scene,true);return}
 stopFade();
 const oldIndex=activeMusic,newIndex=1-oldIndex,old=musicDecks[oldIndex],next=musicDecks[newIndex];
 next.src=audioUrl(t.file);next.currentTime=0;next.volume=0;next.play().catch(()=>{});
 const oldTrack=getTrack(currentTrackId),duration=fadeSeconds*1000,start=performance.now();
 updateWorldUI(scene,t,(oldTrack?.title||'Current')+' → '+t.title);syncPhysical(scene,true);
 fadeTimer=setInterval(()=>{
   const p=Math.min(1,(performance.now()-start)/duration);
   const out=Math.cos(p*Math.PI/2),inn=Math.sin(p*Math.PI/2),gain=duckGain();
   old.volume=out*gain;next.volume=inn*gain;setProgress(p);
   if(p>=1){
     clearInterval(fadeTimer);fadeTimer=null;old.pause();old.currentTime=0;activeMusic=newIndex;currentTrackId=t.id;
     next.volume=gain;setProgress(0);$('#worldTransition').textContent='Ready';updatePlayIcon();
   }
 },40);
}
function chooseScene(id){const s=getScene(id);if(!s)return;transitionTo(s)}
function renderRecipe(){
 const r=getRecipe();if(!r)return;
 $('#sceneStrip').innerHTML=r.scenes.map(s=>'<button class="scene-btn" data-scene="'+escapeHtml(s.id)+'">'+escapeHtml(s.label)+'</button>').join('');
 $$('#sceneStrip .scene-btn').forEach(b=>b.onclick=()=>chooseScene(b.dataset.scene));
 sceneVariant={};loadCurrentScene(r.scenes[0],{play:false});
}
function renderWorld(){
 $('#worldRecipe').innerHTML=mixerData.recipes.map(r=>'<option value="'+escapeHtml(r.id)+'">'+escapeHtml(r.label)+'</option>').join('');
 activeRecipeId=mixerData.defaultRecipe||mixerData.recipes[0]?.id;$('#worldRecipe').value=activeRecipeId;renderRecipe();
}
function toggleWorldPlayback(){
 const running=musicDecks.some(a=>!a.paused);
 if(running){musicDecks.forEach(a=>a.pause());Object.values(physical).forEach(a=>a.pause());stopFade();updatePlayIcon();return}
 const s=getScene(currentSceneId)||getRecipe()?.scenes[0];if(!currentTrackId&&s)loadCurrentScene(s,{play:false});
 musicDecks[activeMusic].volume=duckGain();musicDecks[activeMusic].play().catch(()=>{});syncPhysical(s,true);updatePlayIcon();
}
function cycleAlternate(){
 const s=getScene(currentSceneId);if(!s||s.tracks.length<2)return;
 sceneVariant[s.id]=((sceneVariant[s.id]||0)+1)%s.tracks.length;transitionTo(s);
}
function setFadeSeconds(sec){fadeSeconds=sec;$('#world').dataset.fade=String(sec);$('[data-world-fade]').forEach(b=>b.classList.toggle('active',+b.dataset.worldFade===sec))}
function toggleLayer(name){
 layerEnabled[name]=!layerEnabled[name];syncLayerButton(name,layerEnabled[name]);syncPhysical(getScene(currentSceneId),musicDecks.some(a=>!a.paused));
}
function toggleVoice(){
 voiceFocus=!voiceFocus;$('#voiceDuck').classList.toggle('active',voiceFocus);const gain=duckGain();
 if(fadeTimer)return;musicDecks.forEach((a,i)=>{if(!a.paused)a.volume=(i===activeMusic?1:0)*gain});
}

/* Library */
function meta(t){const a=[];if(t.bpm)a.push(t.bpm+' BPM');if(t.stems)a.push(t.stems.policy==='certified'?'certified stems':'stems');return a.join(' · ')}
function renderCatalog(){
 const q=$('#search').value.trim().toLowerCase(),coll=$('#collection').value,sf=$('#stemFilter').value;
 const all=catalog.tracks,filtered=all.filter(t=>{
  if(coll&&t.collection!==coll)return false;if(sf==='stems'&&!t.stems)return false;if(sf==='certified'&&t.stems?.policy!=='certified')return false;
  if(!q)return true;return JSON.stringify([t.title,t.id,t.roles,t.moods,t.tags,t.family]).toLowerCase().includes(q);
 });
 $('#stats').textContent=filtered.length+' shown · '+all.length+' tracks · '+all.filter(t=>t.collection==='roadtrip-v2').length+' world · '+all.filter(t=>t.stems).length+' stems';
 $('#catalogGrid').innerHTML=filtered.map(t=>'<article class="track"><div><h3>'+escapeHtml(t.title)+'</h3><div class="tiny">'+escapeHtml(meta(t))+'</div></div><div class="track-actions"><button class="play" aria-label="Play" data-play="'+escapeHtml(t.id)+'">▶</button><button data-ref="'+escapeHtml(t.id)+'">Ref</button></div></article>').join('');
 $$('[data-play]').forEach(b=>b.onclick=()=>playTrack(b.dataset.play));$$('[data-ref]').forEach(b=>b.onclick=()=>addPromptRef(b.dataset.ref));
}
function playTrack(id){const t=getTrack(id);if(!t)return;const a=$('#preview');a.src=audioUrl(t.file);a.play().catch(()=>{});$('#nowTitle').textContent=t.title;$('#nowMeta').textContent=meta(t)}
function fillSelect(sel){sel.innerHTML=catalog.tracks.filter(t=>t.collection==='roadtrip-v2').map(t=>'<option value="'+escapeHtml(t.id)+'">'+escapeHtml(t.title)+'</option>').join('')}

/* Sources */
function renderSources(){
 $('#availableSources').innerHTML=soundscape.available.map(s=>'<div class="sourceitem"><div><b>'+escapeHtml(s.label)+'</b><br><small>'+escapeHtml(s.role)+'</small></div><span class="chip ok">source</span></div>').join('');
 $('#missingSources').innerHTML=soundscape.missing.map(s=>'<div class="sourceitem"><div><b>'+escapeHtml(s.label)+'</b><br><small>'+escapeHtml(s.need)+'</small></div><span class="chip missing">'+escapeHtml(s.status)+'</span></div>').join('');
}

function sfxLabel(x){return x.path.split('/').pop().replace(/\.(wav|ogg|mp3)$/i,'')}
function renderSfx(){
 const q=$('#sfxSearch').value.trim().toLowerCase(),use=$('#sfxUseCase').value,temp=$('#sfxTemporal').value;
 const seen=new Set(),all=sfxLibrary?.assets||[];
 const filtered=all.filter(x=>{
   if(use&&!x.useCases?.includes(use))return false;if(temp&&x.temporal!==temp)return false;
   if(q&&!JSON.stringify([x.path,x.pack,x.roles,x.useCases,x.verbs]).toLowerCase().includes(q))return false;
   if(seen.has(x.blobSha))return false;seen.add(x.blobSha);return true;
 });
 const shown=filtered.slice(0,60);
 $('#sfxStats').textContent=filtered.length+' matches'+(filtered.length>60?' · first 60':'');
 $('#sfxGrid').innerHTML=shown.map(x=>'<article class="track"><div><h3>'+escapeHtml(sfxLabel(x))+'</h3><div class="tiny">'+escapeHtml(x.pack)+' · '+escapeHtml(x.temporal.replace('_',' ').toLowerCase())+'</div></div><div class="track-actions"><button class="play" aria-label="Play SFX" data-sfx-play="'+escapeHtml(x.path)+'">▶</button></div></article>').join('');
 document.querySelectorAll('[data-sfx-play]').forEach(b=>b.onclick=()=>playSfx(b.dataset.sfxPlay));
}
function playSfx(path){const x=(sfxLibrary?.assets||[]).find(a=>a.path===path);if(!x)return;const a=$('#preview');a.src=audioUrl(x.path);a.play().catch(()=>{});$('#nowTitle').textContent=sfxLabel(x);$('#nowMeta').textContent=x.pack}
function fillSfxFilters(){
 const sel=$('#sfxUseCase'),uses=sfxLibrary?.taxonomy?.useCases||[];sel.insertAdjacentHTML('beforeend',uses.map(x=>'<option value="'+escapeHtml(x)+'">'+escapeHtml(x.replaceAll('_',' ').toLowerCase())+'</option>').join(''));
 const events=['click','pickup','jump','land','hit','engine','success','error'];
 $('#eventMap').innerHTML=events.map(x=>'<button data-event="'+x+'">'+x+'</button>').join('');
 document.querySelectorAll('[data-event]').forEach(b=>b.onclick=()=>{$('#sfxSearch').value=b.dataset.event;renderSfx()});
 $('#sfxCount').textContent='· '+(sfxLibrary?.assets?.length||0).toLocaleString('en-US');
}

function renderCandidates(){
 const status=$('#candidateStatus')?.value||'',category=$('#candidateCategory')?.value||'';
 const all=sourceIntake?.elevenLabs||[],xs=all.filter(x=>(!status||x.status===status)&&(!category||x.category===category));
 $('#sourceLabCount').textContent='· '+all.length;$('#candidateStats').textContent=xs.length+' shown';
 $('#candidateGrid').innerHTML=xs.map(x=>'<article class="track candidate"><div><h3>'+escapeHtml(x.label)+'</h3><div class="tiny">'+escapeHtml(x.category)+' · '+escapeHtml(x.status==='HUMAN_TUNE'?'Tune':'Unreviewed')+'</div></div><div class="track-actions"><button class="play" aria-label="Play test" data-candidate-play="'+escapeHtml(x.id)+'">▶</button></div></article>').join('');
 $$('[data-candidate-play]').forEach(b=>b.onclick=()=>playCandidate(b.dataset.candidatePlay));
}
function playCandidate(id){const x=(sourceIntake?.elevenLabs||[]).find(v=>v.id===id);if(!x)return;const a=$('#preview');a.src=audioUrl(x.file);a.play().catch(()=>{});$('#nowTitle').textContent=x.label;$('#nowMeta').textContent=x.category+' · test'}
function fillCandidateFilters(){const sel=$('#candidateCategory');const cats=[...new Set((sourceIntake?.elevenLabs||[]).map(x=>x.category))].sort();sel.insertAdjacentHTML('beforeend',cats.map(c=>'<option value="'+escapeHtml(c)+'">'+escapeHtml(c)+'</option>').join(''))}
function filesChanged(list){intake=[...list].map(f=>({name:f.name,size:f.size,type:f.type||null,relativePath:f.webkitRelativePath||null,lastModified:f.lastModified}));$('#queue').innerHTML=intake.map(x=>'<div>'+escapeHtml(x.name)+' <span class="tiny">'+Math.round(x.size/1024)+' KB</span></div>').join('')}
function downloadIntake(){const blob=new Blob([JSON.stringify({schema:'kfb.audio-intake/0.1',created:new Date().toISOString(),files:intake},null,2)],{type:'application/json'}),u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='kfb-audio-intake.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)}

/* Prompt */
function addPromptRef(id){const o=[...$('#pRefs').options].find(x=>x.value===id);if(o){o.selected=true;show('prompt')}}
function buildPrompt(){
 const refs=[...$('#pRefs').selectedOptions].map(o=>getTrack(o.value)).filter(Boolean),mood=$('#pMood').value.trim()||'[mood]',biome=$('#pBiome').value.trim()||'[place]',resident=$('#pResident').value.trim(),role=$('#pRole').value;
 $('#promptOut').value='Create one Suno-ready instrumental prompt for '+role+'. Mood: '+mood+'. Place: '+biome+'.'+(resident?' Performer/resident: '+resident+'.':'')+'\n\nStyle references:\n'+(refs.length?refs.map(t=>'- '+t.title+(t.bpm?' · '+t.bpm+' BPM':'')).join('\n'):'- none selected')+'\n\nReturn one copy/paste block only: BPM or BPM range + short direction phrase + Style prompt. Preserve negative space for dialogue/SFX. No invented source facts or unexplained internal project terminology.';
}

/* Shell */
function show(id){
 $$('.view').forEach(v=>v.classList.toggle('active',v.id===id));$$('.tabs button').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.view===id)));
 $('#previewBar').hidden=id==='world';
}
function bind(){
 $$('.tabs button').forEach(b=>b.onclick=()=>show(b.dataset.view));
 $('#worldRecipe').onchange=e=>{musicDecks.forEach(a=>a.pause());Object.values(physical).forEach(a=>a.pause());stopFade();activeRecipeId=e.target.value;currentTrackId=null;renderRecipe();updatePlayIcon()};
 $('#worldToggle').onclick=toggleWorldPlayback;$('#worldAlt').onclick=cycleAlternate;$$('[data-world-fade]').forEach(b=>b.onclick=()=>setFadeSeconds(+b.dataset.worldFade));
 $$('[data-layer]').forEach(b=>b.onclick=()=>toggleLayer(b.dataset.layer));$('#voiceDuck').onclick=toggleVoice;
 ['#search','#collection','#stemFilter'].forEach(s=>$(s).addEventListener('input',renderCatalog));
 $('#sfxSearch').addEventListener('input',renderSfx);$('#sfxUseCase').addEventListener('input',renderSfx);$('#sfxTemporal').addEventListener('input',renderSfx);$('#candidateStatus').addEventListener('input',renderCandidates);$('#candidateCategory').addEventListener('input',renderCandidates);
 const drop=$('#drop'),input=$('#files');drop.onclick=()=>input.click();input.onchange=e=>filesChanged(e.target.files);drop.ondragover=e=>{e.preventDefault();drop.classList.add('drag')};drop.ondragleave=()=>drop.classList.remove('drag');drop.ondrop=e=>{e.preventDefault();drop.classList.remove('drag');filesChanged(e.dataTransfer.files)};
 $('#downloadIntake').onclick=downloadIntake;$('#buildPrompt').onclick=buildPrompt;$('#copyPrompt').onclick=()=>navigator.clipboard?.writeText($('#promptOut').value);
}
function renderAll(){renderWorld();setFadeSeconds(fadeSeconds);renderCatalog();renderSources();fillSfxFilters();renderSfx();fillCandidateFilters();renderCandidates();fillSelect($('#pRefs'));filesChanged([]);show('world')}
load().catch(e=>{document.body.insertAdjacentHTML('beforeend','<pre style="padding:20px;color:#f88">'+escapeHtml(e.stack||e)+'</pre>')});