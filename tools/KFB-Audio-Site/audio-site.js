const RAW='https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const text=(v='')=>String(v??'');
const escapeHtml=s=>text(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dbToGain=db=>10**(db/20);
let catalog=null,soundscape=null,interaction=null,intake=[];
let graph=null,audioContextsCreated=0,activeState='C',voiceActive=false,xfadePosition=0,demoRun=0;
const aMix=new Audio(),bMix=new Audio();aMix.crossOrigin='anonymous';bMix.crossOrigin='anonymous';
const audioUrl=file=>RAW+file.split('/').map(encodeURIComponent).join('/');

async function firstJson(urls){let last=null;for(const u of urls){try{const r=await fetch(u,{cache:'no-store'});if(!r.ok)throw new Error('HTTP '+r.status+' '+u);return await r.json()}catch(e){last=e}}throw last||new Error('no JSON source')}

async function load(){
  [catalog,soundscape,interaction]=await Promise.all([
    firstJson(['./catalog.snapshot.json','../../media/3D_Assets/Sounds/jukebox.json',RAW+'media/3D_Assets/Sounds/jukebox.json']),
    firstJson(['./soundscape-source.json']),
    firstJson(['./music-interaction-states.json'])
  ]);
  activeState=interaction.defaultState;
  renderAll();bind();bindExternalAdapter();exposeApi();
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
 $('#catalogGrid').innerHTML=filtered.map(t=>'<article class="track"><div><h3>'+escapeHtml(t.title)+'</h3><div class="tiny">'+escapeHtml(meta(t))+'</div></div><div class="chips">'+(t.roles||[]).map(x=>'<span class="chip">'+escapeHtml(x)+'</span>').join('')+(t.stems?.policy==='certified'?'<span class="chip ok">stem-certified</span>':'')+'</div><div class="track-actions"><button class="play" data-play="'+escapeHtml(t.id)+'">Play master</button><button data-ref="'+escapeHtml(t.id)+'">Use as ref</button></div></article>').join('');
 $$('[data-play]').forEach(b=>b.onclick=()=>playTrack(b.dataset.play));
 $$('[data-ref]').forEach(b=>b.onclick=()=>addPromptRef(b.dataset.ref));
}

function ensureGraph(){
 if(graph)return graph;
 const Context=window.AudioContext||window.webkitAudioContext;
 if(!Context)throw new Error('Web Audio is unavailable in this browser.');
 const ctx=new Context();audioContextsCreated+=1;
 const master=ctx.createGain(),buses={};
 for(const role of interaction.semanticBuses){buses[role]=ctx.createGain();buses[role].gain.value=1;buses[role].connect(master)}
 master.connect(ctx.destination);
 const deckA=ctx.createGain(),deckB=ctx.createGain(),preview=ctx.createGain();
 deckA.connect(buses.SCORE);deckB.connect(buses.SCORE);preview.connect(buses.SCORE);
 const sources={deckA:ctx.createMediaElementSource(aMix),deckB:ctx.createMediaElementSource(bMix),preview:ctx.createMediaElementSource($('#preview'))};
 sources.deckA.connect(deckA);sources.deckB.connect(deckB);sources.preview.connect(preview);
 graph={ctx,master,buses,decks:{A:deckA,B:deckB,preview},sources};
 setFadeGains(0,0);applyMixTargets(0);renderContext();
 return graph;
}

async function resumeGraph(){const g=ensureGraph();if(g.ctx.state==='suspended')await g.ctx.resume();return g}

function hold(param,at){if(typeof param.cancelAndHoldAtTime==='function')param.cancelAndHoldAtTime(at);else{const v=param.value;param.cancelScheduledValues(at);param.setValueAtTime(v,at)}}
function rampGain(param,gain,seconds){const now=graph.ctx.currentTime;hold(param,now);if(seconds>0)param.linearRampToValueAtTime(Math.max(0,gain),now+seconds);else param.setValueAtTime(Math.max(0,gain),now)}

function effectiveBusDb(state,role){
 let value=state.semanticBusGainDb[role]??0;
 if(voiceActive&&(role==='SCORE'||role==='DIEGETIC_MUSIC'))value+=interaction.ducking.baseMusicDuckDb+state.targets.speechDuckingBiasDb;
 if(voiceActive&&(role==='LOCAL_AMBIENCE'||role==='GLOBAL_BED'))value+=interaction.ducking.baseAmbienceDuckDb+(state.targets.speechDuckingBiasDb*.5);
 return value;
}

function applyMixTargets(seconds){
 if(!graph)return;
 const state=interaction.states[activeState];
 for(const role of ['SCORE','DIEGETIC_MUSIC','LOCAL_AMBIENCE','GLOBAL_BED'])rampGain(graph.buses[role].gain,dbToGain(effectiveBusDb(state,role)),seconds);
}

function transitionSeconds(from,to){return interaction.transitions.matrixSeconds[from+'>'+to]??interaction.states[to].targets.crossfadeSeconds}

function setContextState(id,options={}){
 if(!interaction?.states[id])throw new Error('Unknown KFB music context state: '+id);
 const previous=activeState,duration=Number.isFinite(options.crossfadeSeconds)?options.crossfadeSeconds:transitionSeconds(previous,id);
 activeState=id;applyMixTargets(duration);renderContext();
 const detail={state:id,previousState:previous,crossfadeSeconds:duration,source:options.source||'manual',reason:options.reason||null,context:options.context||null,voiceActive,snapshot:getContextSnapshot()};
 window.dispatchEvent(new CustomEvent(interaction.adapter.outboundEvent,{detail}));
 return detail;
}

function setVoiceActive(on,options={}){
 voiceActive=!!on;
 const seconds=voiceActive?interaction.ducking.attackSeconds:interaction.ducking.releaseSeconds;
 applyMixTargets(seconds);renderContext();
 return {voiceActive,state:activeState,source:options.source||'manual',snapshot:getContextSnapshot()};
}

function getContextSnapshot(){
 const state=interaction.states[activeState];
 return {state:activeState,slug:state.slug,voiceActive,audioContextCount:audioContextsCreated,audioContextState:graph?.ctx.state||'not-created',targets:structuredClone(state.targets),tempo:structuredClone(state.tempo),effectiveBusGainDb:Object.fromEntries(['SCORE','DIEGETIC_MUSIC','LOCAL_AMBIENCE','GLOBAL_BED'].map(role=>[role,effectiveBusDb(state,role)])),stemAvailability:interaction.stemContract.availability};
}

function exposeApi(){
 window.KFBAudioSite={version:'0.2.0',get audioContext(){return graph?.ctx||null},get audioContextsCreated(){return audioContextsCreated},musicContext:{get contract(){return interaction},setState:setContextState,setVoiceActive,getSnapshot:getContextSnapshot}};
}

function bindExternalAdapter(){
 window.addEventListener(interaction.adapter.inboundEvent,e=>{const d=e.detail||{};if(d.state)setContextState(d.state,{source:d.source||'event',reason:d.reason,context:d.context})});
 window.addEventListener(interaction.adapter.voiceFocusEvent,e=>setVoiceActive(!!e.detail?.active,{source:e.detail?.source||'event'}));
}

function percent(v){return Math.round(v*100)+'%'}
function renderContext(){
 if(!interaction)return;
 const state=interaction.states[activeState],t=state.targets,tempo=state.tempo;
 $('#contextButtons').innerHTML=Object.values(interaction.states).map(s=>'<button class="context-button" data-context="'+s.id+'" aria-pressed="'+(s.id===activeState)+'"><strong>'+s.id+'</strong><span>'+escapeHtml(s.shortLabel)+'</span><small>'+escapeHtml(s.label)+'</small></button>').join('');
 $$('[data-context]').forEach(b=>b.onclick=async()=>{await resumeGraph();setContextState(b.dataset.context,{source:'manual-mixer'})});
 $('#contextStatus').innerHTML='<b>'+state.id+' · '+escapeHtml(state.shortLabel)+'</b><span>'+escapeHtml(state.intent)+'</span>';
 const metrics=[['Energy',percent(t.energy)],['Density',percent(t.density)],['Music gain',t.musicGainDb+' dB'],['Transient restraint',percent(t.transientRestraint)],['Percussion restraint',percent(t.percussionRestraint)],['Speech-space bias',percent(t.speechSpaceBias)],['Crossfade',t.crossfadeSeconds+' s'],['Tempo',tempo.bpmMin+'–'+tempo.bpmMax+' BPM'],['Pulse',tempo.subdivision],['Stems',interaction.stemContract.availability.replaceAll('_',' ')]];
 $('#contextMetrics').innerHTML=metrics.map(([k,v])=>'<div><span>'+escapeHtml(k)+'</span><b>'+escapeHtml(v)+'</b></div>').join('');
 $('#ttsToggle').textContent='TTS ducking: '+(voiceActive?'on':'off');$('#ttsToggle').setAttribute('aria-pressed',String(voiceActive));
 $('#ttsStatus').textContent=voiceActive?'Voice focus active · existing ducking + '+state.id+' speech-space bias · music timeline continues.':'TTS focus is separate from state '+state.id+' and remains ready.';
}

function runContextDemo(){
 const g=ensureGraph(),run=++demoRun,start=g.ctx.currentTime;
 const steps=[{at:0,state:'B'},{at:1.6,state:'C'},{at:3.2,state:'D'},{at:4.4,voice:true},{at:5.8,voice:false}];let index=0;
 const tick=()=>{if(run!==demoRun)return;while(index<steps.length&&g.ctx.currentTime-start>=steps[index].at){const step=steps[index++];if(step.state)setContextState(step.state,{source:'mixer-demo',crossfadeSeconds:1.25});if('voice' in step)setVoiceActive(step.voice,{source:'mixer-demo'})}if(index<steps.length)requestAnimationFrame(tick)};
 tick();
}

async function playTrack(id){const t=catalog.tracks.find(x=>x.id===id);if(!t)return;const a=$('#preview');a.src=audioUrl(t.file);await resumeGraph();a.play().catch(()=>{});$('#nowTitle').textContent=t.title;$('#nowMeta').textContent=meta(t)+' · MASTER · STATE '+activeState}
function fillSelect(sel,includeLegacy=true){sel.innerHTML=catalog.tracks.filter(t=>includeLegacy||t.collection==='roadtrip-v2').map(t=>'<option value="'+escapeHtml(t.id)+'">'+escapeHtml(t.title)+(t.bpm?' · '+t.bpm:'')+'</option>').join('')}

function renderSources(){
 $('#availableSources').innerHTML=soundscape.available.map(s=>'<div class="sourceitem"><div><b>'+escapeHtml(s.label)+'</b><br><small>'+escapeHtml(s.role)+'</small></div><span class="chip ok">source</span></div>').join('');
 $('#missingSources').innerHTML=soundscape.missing.map(s=>'<div class="sourceitem"><div><b>'+escapeHtml(s.label)+'</b><br><small>'+escapeHtml(s.need)+'</small></div><span class="chip missing">'+escapeHtml(s.status)+'</span></div>').join('');
}

function loadMix(which){const sel=$(which==='A'?'#deckA':'#deckB'),t=catalog.tracks.find(x=>x.id===sel.value),a=which==='A'?aMix:bMix;if(!t)return;a.src=audioUrl(t.file);a.currentTime=0;return {a,t}}

function setFadeGains(v,seconds=0){
 v=Math.min(1,Math.max(0,+v));xfadePosition=v;
 const av=Math.cos(v*Math.PI/2),bv=Math.sin(v*Math.PI/2);
 if(graph){rampGain(graph.decks.A.gain,av,seconds);rampGain(graph.decks.B.gain,bv,seconds)}
 $('#xfade').value=v;$('#xfadeLabel').textContent='A '+Math.round(av*100)+'% · B '+Math.round(bv*100)+'%';
}

function autoFade(seconds){
 const g=ensureGraph(),start=xfadePosition,target=start<.5?1:0,t0=g.ctx.currentTime;setFadeGains(target,seconds);
 const paint=()=>{const p=Math.min(1,(g.ctx.currentTime-t0)/seconds),v=start+(target-start)*p,av=Math.cos(v*Math.PI/2),bv=Math.sin(v*Math.PI/2);$('#xfade').value=v;$('#xfadeLabel').textContent='A '+Math.round(av*100)+'% · B '+Math.round(bv*100)+'%';if(p<1)requestAnimationFrame(paint)};paint();
}

function filesChanged(list){intake=[...list].map(f=>({name:f.name,size:f.size,type:f.type||null,relativePath:f.webkitRelativePath||null,lastModified:f.lastModified}));$('#queue').innerHTML=intake.length?intake.map(x=>'<div><b>'+escapeHtml(x.name)+'</b> <span class="tiny">'+Math.round(x.size/1024)+' KB'+(x.relativePath?' · '+escapeHtml(x.relativePath):'')+'</span></div>').join(''):'<div class="tiny">No files selected.</div>'}
function downloadIntake(){const blob=new Blob([JSON.stringify({schema:'kfb.audio-intake/0.1',created:new Date().toISOString(),files:intake},null,2)],{type:'application/json'}),u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='kfb-audio-intake.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)}
function addPromptRef(id){const o=[...$('#pRefs').options].find(x=>x.value===id);if(o){o.selected=true;show('prompt')}}

function fillPromptStyles(){$('#pStyle').innerHTML=Object.values(interaction.states).map(s=>'<option value="'+s.id+'">'+s.id+' · '+escapeHtml(s.label)+'</option>').join('');$('#pStyle').value=interaction.defaultState;renderPromptStyle()}
function renderPromptStyle(){const state=interaction.states[$('#pStyle').value],p=state.promptReference,t=state.targets;$('#styleReference').innerHTML='<div><span class="eyebrow">PROMPT DONOR '+state.id+'</span><b>'+escapeHtml(p.label)+'</b><small>'+escapeHtml(state.intent)+'</small></div><div class="style-stats"><span>'+state.tempo.bpmMin+'–'+state.tempo.bpmMax+' BPM</span><span>energy '+percent(t.energy)+'</span><span>density '+percent(t.density)+'</span><span>speech '+percent(t.speechSpaceBias)+'</span></div><code>'+escapeHtml(p.path)+'#'+escapeHtml(p.anchor)+'</code>'}

function buildPrompt(){
 const refs=[...$('#pRefs').selectedOptions].map(o=>catalog.tracks.find(t=>t.id===o.value)).filter(Boolean),state=interaction.states[$('#pStyle').value],p=state.promptReference;
 const mood=$('#pMood').value.trim()||'[mood]',biome=$('#pBiome').value.trim()||'[biome / place]',resident=$('#pResident').value.trim()||'[resident / performer]',role=$('#pRole').value;
 $('#promptOut').value='Create one Suno-ready KFB instrumental prompt for '+role+'. Music interaction style: '+state.id+' · '+state.label+'. Use the existing authored prompt pack entry "'+p.label+'" at '+p.path+'#'+p.anchor+'. Mood: '+mood+'. Biome/place: '+biome+'. Resident/performer: '+resident+'.\n\nState targets: '+state.tempo.bpmMin+'–'+state.tempo.bpmMax+' BPM; energy '+percent(state.targets.energy)+'; density '+percent(state.targets.density)+'; transient restraint '+percent(state.targets.transientRestraint)+'; percussion restraint '+percent(state.targets.percussionRestraint)+'; speech-space bias '+percent(state.targets.speechSpaceBias)+'.\n\nUse these existing KFB masters as style references, not as material to copy or cross-mix:\n'+(refs.length?refs.map(t=>'- '+t.title+(t.bpm?' · '+t.bpm+' BPM':'')+(t.moods?.length?' · '+t.moods.join('/'):'')).join('\n'):'- no reference selected yet')+'\n\nKeep the KFB audio rules: complete master first, 2–4 variants, human-select the winner, stems only afterward; preserve negative space for SFX/dialogue; avoid generic trailer/EDM cliché and invented source facts. Stems are FUTURE_NOT_AVAILABLE: return stem priorities only, never placeholder audio. Suggest BPM/tonal center only when musically justified. Return: main prompt + stem priority + selection note.';
}

function show(id){$$('.view').forEach(v=>v.classList.toggle('active',v.id===id));$$('.tabs button').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.view===id)))}

function bind(){
 $$('.tabs button').forEach(b=>b.onclick=()=>show(b.dataset.view));['#search','#collection','#stemFilter'].forEach(s=>$(s).addEventListener('input',renderCatalog));
 $('#playA').onclick=async()=>{const x=loadMix('A');if(x){await resumeGraph();x.a.play();$('#nowTitle').textContent=x.t.title;$('#nowMeta').textContent='TRANSITION DECK A · MASTER · STATE '+activeState}};
 $('#playB').onclick=async()=>{const x=loadMix('B');if(x){await resumeGraph();x.a.play();$('#nowTitle').textContent=x.t.title;$('#nowMeta').textContent='TRANSITION DECK B · MASTER · STATE '+activeState}};
 $('#xfade').oninput=async e=>{await resumeGraph();setFadeGains(e.target.value,0)};$$('[data-fade]').forEach(b=>b.onclick=async()=>{await resumeGraph();autoFade(+b.dataset.fade)});$('#stopMix').onclick=()=>{aMix.pause();bMix.pause()};
 $('#runContextDemo').onclick=async()=>{await resumeGraph();runContextDemo()};$('#ttsToggle').onclick=async()=>{await resumeGraph();setVoiceActive(!voiceActive,{source:'manual-mixer'})};
 $('#ttsSpeak').onclick=async()=>{await resumeGraph();if(!('speechSynthesis' in window))return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance('Statement. Response. Reframe. The groove leaves room for us.');u.onstart=()=>setVoiceActive(true,{source:'browser-tts-demo'});u.onend=u.onerror=()=>setVoiceActive(false,{source:'browser-tts-demo'});window.speechSynthesis.speak(u)};
 const drop=$('#drop'),input=$('#files');drop.onclick=()=>input.click();input.onchange=e=>filesChanged(e.target.files);drop.ondragover=e=>{e.preventDefault();drop.classList.add('drag')};drop.ondragleave=()=>drop.classList.remove('drag');drop.ondrop=e=>{e.preventDefault();drop.classList.remove('drag');filesChanged(e.dataTransfer.files)};
 $('#downloadIntake').onclick=downloadIntake;$('#pStyle').onchange=renderPromptStyle;$('#buildPrompt').onclick=buildPrompt;$('#copyPrompt').onclick=()=>navigator.clipboard?.writeText($('#promptOut').value);
}

function renderAll(){renderCatalog();fillSelect($('#deckA'));fillSelect($('#deckB'));$('#deckB').selectedIndex=Math.min(1,$('#deckB').options.length-1);fillSelect($('#pRefs'),false);fillPromptStyles();renderSources();setFadeGains(0,0);filesChanged([]);renderContext()}

load().catch(e=>{document.body.insertAdjacentHTML('beforeend','<pre style="padding:20px;color:#f88">'+escapeHtml(e.stack||e)+'</pre>')});
