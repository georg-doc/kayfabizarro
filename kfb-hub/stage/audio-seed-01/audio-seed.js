import {
  averageDeck,
  baselineDelta,
  deriveRuntime,
  eventsForStep,
  GRAMMAR_NAMES,
  FAMILY_NAMES,
  identityCompatibility,
  selectIdentity,
  structureFingerprint
} from './audio-seed-core.js';

const ROOT_URL=new URL('../../../',location.href);
const $=(s)=>document.querySelector(s);
const $$=(s)=>[...document.querySelectorAll(s)];
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,Number(v)||0));

let manifest=null;
let ctx=null;
let timer=null;
let nextStepTime=0;
let noiseBuffer=null;

const nodes={};
const activeSources=new Set();

const state={
  ready:false,
  contextCount:0,
  deckId:'FORGET',
  deckSource:null,
  semantic:null,
  semanticDelta:null,
  identity:null,
  timelineStep:0,
  restartCount:0,
  errors:[],
  context:{
    mode:'world',
    speed:.35,
    night:0,
    rain:0,
    psychedelic:0,
    shadow:0,
    ducked:false
  }
};

function rootURL(rel){return new URL(rel,ROOT_URL).href;}

async function getManifest(){
  if(manifest)return manifest;
  const res=await fetch('./SOURCE.json',{cache:'no-store'});
  if(!res.ok)throw new Error('SOURCE.json HTTP '+res.status);
  manifest=await res.json();
  return manifest;
}

async function getDeckSource(deck){
  const res=await fetch(rootURL(deck.dataPath),{cache:'no-store'});
  if(!res.ok)throw new Error(deck.dataPath+' HTTP '+res.status);
  return res.json();
}

function setParam(param,value,tau=.06){
  if(!ctx||!param)return;
  const t=ctx.currentTime;
  param.cancelScheduledValues(t);
  param.setTargetAtTime(Math.max(.0001,value),t,tau);
}

function currentRuntime(){
  if(!state.identity)return null;
  return deriveRuntime(state.identity,state.context);
}

function makeNoise(){
  const len=ctx.sampleRate;
  const buf=ctx.createBuffer(1,len,ctx.sampleRate);
  const d=buf.getChannelData(0);
  let x=0x4b464231;
  for(let i=0;i<d.length;i++){
    x^=x<<13;x^=x>>>17;x^=x<<5;
    d[i]=((x>>>0)/4294967296)*2-1;
  }
  return buf;
}

function trackSource(src){
  activeSources.add(src);
  src.addEventListener('ended',()=>activeSources.delete(src),{once:true});
  return src;
}

function killVoices(){
  for(const src of [...activeSources]){
    try{src.stop();}catch{}
    try{src.disconnect();}catch{}
  }
  activeSources.clear();
}

function buildGraph(){
  nodes.master=ctx.createGain();
  nodes.master.gain.value=.82;

  nodes.compressor=ctx.createDynamicsCompressor();
  nodes.compressor.threshold.value=-13;
  nodes.compressor.knee.value=12;
  nodes.compressor.ratio.value=3;
  nodes.compressor.attack.value=.006;
  nodes.compressor.release.value=.18;
  nodes.compressor.connect(nodes.master);
  nodes.master.connect(ctx.destination);

  nodes.musicGain=ctx.createGain();
  nodes.musicGain.gain.value=.58;

  nodes.musicFilter=ctx.createBiquadFilter();
  nodes.musicFilter.type='lowpass';
  nodes.musicFilter.frequency.value=2400;
  nodes.musicGain.connect(nodes.musicFilter);
  nodes.musicFilter.connect(nodes.compressor);

  nodes.delay=ctx.createDelay(1.2);
  nodes.delay.delayTime.value=.31;
  nodes.delayFeedback=ctx.createGain();
  nodes.delayFeedback.gain.value=.08;
  nodes.delayWet=ctx.createGain();
  nodes.delayWet.gain.value=.06;
  nodes.musicFilter.connect(nodes.delay);
  nodes.delay.connect(nodes.delayFeedback);
  nodes.delayFeedback.connect(nodes.delay);
  nodes.delay.connect(nodes.delayWet);
  nodes.delayWet.connect(nodes.compressor);

  nodes.ambienceGain=ctx.createGain();
  nodes.ambienceGain.gain.value=.32;
  nodes.ambienceGain.connect(nodes.compressor);

  noiseBuffer=makeNoise();
  const rain=ctx.createBufferSource();
  rain.buffer=noiseBuffer;
  rain.loop=true;
  const rainFilter=ctx.createBiquadFilter();
  rainFilter.type='bandpass';
  rainFilter.frequency.value=3600;
  rainFilter.Q.value=.35;
  nodes.rainGain=ctx.createGain();
  nodes.rainGain.gain.value=.0001;
  rain.connect(rainFilter);
  rainFilter.connect(nodes.rainGain);
  nodes.rainGain.connect(nodes.ambienceGain);
  rain.start();
  nodes.rainSource=rain;
}

function midiHz(n){return 440*Math.pow(2,(n-69)/12);}

function playTone(midi,t,dur,gain=.08,type='sine',detune=0){
  const osc=trackSource(ctx.createOscillator());
  const g=ctx.createGain();
  osc.type=type;
  osc.frequency.setValueAtTime(Math.max(20,midiHz(midi)),t);
  osc.detune.value=detune;
  g.gain.setValueAtTime(.0001,t);
  g.gain.linearRampToValueAtTime(gain,t+.012);
  g.gain.exponentialRampToValueAtTime(.0001,t+Math.max(.06,dur));
  osc.connect(g);
  g.connect(nodes.musicGain);
  osc.start(t);
  osc.stop(t+dur+.04);
}

function playPluck(midi,t,gain=.08,detune=0){
  playTone(midi,t,.48,gain,'triangle',detune);
  playTone(midi+12,t,.12,gain*.13,'sine',detune+3);
}

function playChord(root,t,gain=.035,dur=.7){
  const third=state.identity.pitch.id==='major-pentatonic'||state.identity.pitch.id==='mixolydian'?4:3;
  [0,third,7].forEach((n,i)=>playTone(root+n,t+i*.012,dur,gain,'triangle',i===1?2:-2));
}

function playKick(t,gain=.11){
  const osc=trackSource(ctx.createOscillator());
  const g=ctx.createGain();
  osc.type='sine';
  osc.frequency.setValueAtTime(92,t);
  osc.frequency.exponentialRampToValueAtTime(44,t+.14);
  g.gain.setValueAtTime(gain,t);
  g.gain.exponentialRampToValueAtTime(.0001,t+.18);
  osc.connect(g);g.connect(nodes.musicGain);
  osc.start(t);osc.stop(t+.2);
}

function playNoiseHit(t,dur,gain,freq,type='bandpass'){
  const src=trackSource(ctx.createBufferSource());
  src.buffer=noiseBuffer;
  const f=ctx.createBiquadFilter();
  f.type=type;f.frequency.value=freq;f.Q.value=.7;
  const g=ctx.createGain();
  g.gain.setValueAtTime(gain,t);
  g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  src.connect(f);f.connect(g);g.connect(nodes.musicGain);
  src.start(t,0,dur+.02);
}

function playEvent(ev,t,rt){
  if(!state.identity)return;
  const base=state.identity.rootMidi+ev.degree;
  const detune=ev.altered?(rt.effectiveShadow>.4?24:12):0;
  const a=ev.accent;
  if(ev.type==='bass')playTone(base,t,.28,.075*a,'sine',detune);
  else if(ev.type==='motif')playPluck(base+12,t,.065*a,detune);
  else if(ev.type==='answer')playPluck(base+19,t,.045*a,-detune);
  else if(ev.type==='chord')playChord(base,t,.030*a,.55);
  else if(ev.type==='pad')playChord(state.identity.rootMidi,t,.027*a,1.8);
  else if(ev.type==='guitar'){
    playTone(base+12,t,.22,.060*a,'triangle',detune);
    playTone(base+24,t,.10,.012*a,'square',detune);
  }else if(ev.type==='kick')playKick(t,.13*a);
  else if(ev.type==='snare')playNoiseHit(t,.13,.085*a,1700,'bandpass');
  else if(ev.type==='hat')playNoiseHit(t,.045,.032*a,6200,'highpass');
}

function updateAudioParams(){
  if(!ctx||!state.identity)return;
  const rt=currentRuntime();
  setParam(nodes.musicGain.gain,.62*rt.musicGain,state.context.ducked?.06:.22);
  setParam(nodes.ambienceGain.gain,.34*rt.ambienceGain,state.context.ducked?.08:.28);
  setParam(nodes.musicFilter.frequency,rt.cutoff,.22);
  setParam(nodes.delayWet.gain,rt.delayWet,.22);
  setParam(nodes.delayFeedback.gain,rt.delayFeedback,.22);
  setParam(nodes.rainGain.gain,.20*rt.effectiveRain,.30);
}

function scheduler(){
  if(!ctx||ctx.state!=='running'||!state.identity)return;
  while(nextStepTime<ctx.currentTime+.32){
    const rt=currentRuntime();
    const events=eventsForStep(state.identity,state.context,state.timelineStep);
    for(const ev of events)playEvent(ev,nextStepTime,rt);
    const stepSeconds=(60/rt.bpm)/4;
    nextStepTime+=stepSeconds;
    state.timelineStep++;
  }
  render();
}

function ensureScheduler(){
  if(timer)return;
  nextStepTime=ctx.currentTime+.06;
  timer=setInterval(scheduler,100);
}

async function startAudio(){
  await getManifest();
  if(!state.identity)await selectDeck(state.deckId);

  if(!ctx){
    const C=window.AudioContext||window.webkitAudioContext;
    if(!C)throw new Error('Web Audio unavailable');
    ctx=new C({latencyHint:'interactive'});
    state.contextCount++;
    buildGraph();
  }
  if(ctx.state!=='running')await ctx.resume();
  state.ready=true;
  updateAudioParams();
  ensureScheduler();
  render();
  return snapshot();
}

function restartSameSeed(){
  if(state.ready&&ctx){
    killVoices();
    state.timelineStep=0;
    nextStepTime=ctx.currentTime+.08;
  }else{
    state.timelineStep=0;
  }
  state.restartCount++;
  render();
  return snapshot();
}

async function selectDeck(id){
  await getManifest();
  const deck=manifest.decks[id];
  if(!deck)return false;
  const json=await getDeckSource(deck);
  const semantic=averageDeck(json.cards,deck.role);
  state.deckId=id;
  state.deckSource=json;
  state.semantic=semantic;
  state.semanticDelta=baselineDelta(semantic,deck.expectedSemanticBaseline);
  state.identity=selectIdentity(deck,semantic);
  document.body.dataset.deck=id;
  $$('.deck-button').forEach((b)=>b.classList.toggle('active',b.dataset.deck===id));
  if(state.ready&&ctx)restartSameSeed();
  updateAudioParams();
  render();
  return true;
}

function setMode(mode){
  state.context.mode=mode==='road'?'road':'world';
  document.body.dataset.mode=state.context.mode;
  updateAudioParams();render();
  return snapshot();
}

function toggleMode(){
  return setMode(state.context.mode==='road'?'world':'road');
}

function setSpeed(value){
  state.context.speed=clamp(value);
  updateAudioParams();render();
  return snapshot();
}

function setTransform(name,value){
  if(!['night','rain','psychedelic','shadow'].includes(name))return snapshot();
  state.context[name]=clamp(value);
  updateAudioParams();render();
  return snapshot();
}

function voiceFocus(on){
  state.context.ducked=!!on;
  updateAudioParams();render();
  return snapshot();
}

function speak(){
  voiceFocus(true);
  const phrase=state.deckId==='IGNORE'
    ? 'Keep the warning readable without muting the world.'
    : state.deckId==='EMBRACE'
      ? 'Same island, same motif. Context moves around it.'
      : 'The future can change shape without changing musical identity.';
  const done=()=>voiceFocus(false);
  if(window.speechSynthesis&&window.SpeechSynthesisUtterance){
    try{
      speechSynthesis.cancel();
      const u=new SpeechSynthesisUtterance(phrase);
      u.lang='en-US';u.rate=.94;u.pitch=.88;u.onend=done;u.onerror=done;
      speechSynthesis.speak(u);
      setTimeout(done,6500);
    }catch{setTimeout(done,2600);}
  }else setTimeout(done,2600);
  return true;
}

function renderSemantic(){
  if(!state.semantic)return;
  const root=$('#semanticBars');
  root.innerHTML='';
  for(const [k,v] of Object.entries(state.semantic)){
    const row=document.createElement('div');
    row.className='sem';
    const name=document.createElement('span');name.textContent=k.toUpperCase();
    const track=document.createElement('span');track.className='sem-track';
    const bar=document.createElement('i');bar.style.width=Math.round(v*100)+'%';
    const val=document.createElement('b');val.textContent=v.toFixed(2);
    track.appendChild(bar);row.append(name,track,val);root.appendChild(row);
  }
}

function snapshot(){
  const rt=currentRuntime();
  return {
    build:manifest?.build||null,
    ready:state.ready,
    deckId:state.deckId,
    semantic:state.semantic?{...state.semantic}:null,
    semanticDelta:state.semanticDelta,
    identity:state.identity?{
      primary:state.identity.primary,
      primaryName:state.identity.primaryName,
      secondary:state.identity.secondary,
      secondaryName:state.identity.secondaryName,
      compatibility:identityCompatibility(state.identity),
      secondaryWeight:state.identity.secondaryWeight,
      families:[...state.identity.families],
      familyNames:[...state.identity.familyNames],
      pitch:state.identity.pitch.id,
      rootMidi:state.identity.rootMidi,
      motif:[...state.identity.motif],
      identitySignature:state.identity.identitySignature
    }:null,
    context:{...state.context},
    runtime:rt?{...rt}:null,
    previewFingerprint:state.identity?structureFingerprint(state.identity,state.context,64):null,
    contextState:ctx?.state||'none',
    contextCount:state.contextCount,
    timelineStep:state.timelineStep,
    restartCount:state.restartCount,
    activeVoices:activeSources.size,
    errors:[...state.errors]
  };
}

function render(){
  if(!manifest||!state.identity)return;
  const deck=manifest.decks[state.deckId];
  const rt=currentRuntime();
  $('#deckRole').textContent=deck.role;
  $('#deckTitle').textContent=deck.title;
  $('#deckSummary').textContent='Real deck JSON · '+deck.cardCount+' cards · semantic delta '+Number(state.semanticDelta||0).toFixed(4);
  $('#identitySignature').textContent=state.identity.identitySignature;
  $('#primaryGrammar').textContent=state.identity.primary+' · '+state.identity.primaryName;
  $('#secondaryGrammar').textContent=state.identity.secondary+' · '+state.identity.secondaryName+' · '+state.identity.secondaryWeight;
  $('#families').textContent=state.identity.families.map((id)=>id+' '+FAMILY_NAMES[id]).join(' · ');
  $('#pitchMotif').textContent=state.identity.pitch.id+' · '+state.identity.motif.join('-');
  $('#audioStatus').textContent=state.ready?'AUDIO RUNNING':'AUDIO STOPPED';
  $('#modeStatus').textContent=rt.mode.toUpperCase()+' · '+rt.subdivisionLevel+' SUBDIV';
  $('#tempoStatus').textContent=rt.bpm+' BPM';
  $('#contextStatus').textContent='Context '+(ctx?.state||'none')+' · '+state.contextCount+' owner';
  $('#modeToggle').textContent=state.context.mode==='world'?'WORLD → ROAD':'ROAD → WORLD';
  $('#diagnostics').textContent=JSON.stringify(snapshot(),null,2);
  renderSemantic();
}

function bind(){
  $('#startAudio').addEventListener('click',()=>startAudio().catch((e)=>{state.errors.push('start: '+e.message);render();}));
  $('#restartSeed').addEventListener('click',restartSameSeed);
  $('#modeToggle').addEventListener('click',toggleMode);
  $('#speak').addEventListener('click',speak);
  $$('.deck-button').forEach((b)=>b.addEventListener('click',()=>selectDeck(b.dataset.deck).catch((e)=>{state.errors.push('deck: '+e.message);render();})));

  $('#speed').addEventListener('input',(e)=>{setSpeed(e.target.value);e.target.nextElementSibling.textContent=Math.round(e.target.value*100)+'%';});
  for(const id of ['night','rain','psychedelic','shadow']){
    $('#'+id).addEventListener('input',(e)=>{setTransform(id,e.target.value);e.target.nextElementSibling.textContent=Math.round(e.target.value*100)+'%';});
  }

  document.addEventListener('visibilitychange',()=>{
    if(ctx&&document.hidden&&ctx.state==='running')ctx.suspend().then(render).catch(()=>{});
  });
}

window.__KFB_AUDIO_SEED__={
  startAudio,
  restartSameSeed,
  selectDeck,
  setMode,
  setSpeed,
  setTransform,
  voiceFocus,
  speak,
  snapshot
};

getManifest()
  .then(()=>selectDeck(state.deckId))
  .then(()=>{bind();render();})
  .catch((e)=>{state.errors.push('init: '+e.message);bind();});
