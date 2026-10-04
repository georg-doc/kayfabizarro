const ROOT_URL=new URL('../../../',location.href);
const $=(s)=>document.querySelector(s);
const $$=(s)=>[...document.querySelectorAll(s)];
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,Number(v)||0));

let manifest=null,ctx=null,musicEl=null,musicNode=null;
const buffers=new Map(),loops=new Map(),nodes={};
const state={
  ready:false,
  contextCount:0,
  scene:'golden-hour-town',
  ducked:false,
  musicWanted:true,
  loaded:0,
  loadErrors:[],
  voiceTimer:null,
  user:{master:.88,voice:.92,sfx:.82,music:.86,ambience:.78},
  counters:{impact:0,crowd:0,cascade:0,storm:0,vehicle:0,voice:0}
};

function assetURL(rel){return new URL(rel,ROOT_URL).href}

async function getManifest(){
  if(manifest)return manifest;
  const res=await fetch('./SOURCE.json',{cache:'no-store'});
  if(!res.ok)throw new Error('SOURCE.json HTTP '+res.status);
  manifest=await res.json();
  return manifest;
}

function setParam(param,value,tau=.06){
  if(!ctx||!param)return;
  const t=ctx.currentTime;
  param.cancelScheduledValues(t);
  param.setTargetAtTime(Math.max(.0001,value),t,tau);
}

async function loadBuffer(rel){
  if(buffers.has(rel))return buffers.get(rel);
  const job=(async()=>{
    try{
      const res=await fetch(assetURL(rel),{cache:'force-cache'});
      if(!res.ok)throw new Error('HTTP '+res.status);
      const ab=await res.arrayBuffer();
      const buf=await ctx.decodeAudioData(ab);
      state.loaded++;
      return buf;
    }catch(e){
      state.loadErrors.push(rel+': '+e.message);
      throw e;
    }finally{
      render();
    }
  })();
  buffers.set(rel,job);
  return job;
}

function currentScene(){
  return manifest?.scenes?.[state.scene]||manifest?.scenes?.['golden-hour-town'];
}

function createBus(){
  const g=ctx.createGain();
  g.gain.value=.0001;
  g.connect(nodes.compressor);
  return g;
}

function updateMix(){
  if(!ctx||!manifest)return;
  const sc=currentScene();
  const duck=state.ducked?sc.duck:{music:1,ambience:1};

  setParam(nodes.master.gain,state.user.master,.05);
  setParam(nodes.musicBus.gain,state.user.music*duck.music,state.ducked ? .07 : .32);
  setParam(nodes.ambienceBus.gain,state.user.ambience*duck.ambience,state.ducked ? .09 : .38);
  setParam(nodes.sfxBus.gain,state.user.sfx,.05);

  setParam(nodes.musicScene.gain,sc.music,.14);
  setParam(nodes.windGain.gain,sc.wind,.16);
  setParam(nodes.localGain.gain,sc.localWater,.16);

  updateMeters();
}

async function startLoop(id,rel,gainNode,destination){
  if(loops.has(id))return loops.get(id);
  const buf=await loadBuffer(rel);
  const src=ctx.createBufferSource();
  src.buffer=buf;
  src.loop=true;
  src.connect(gainNode);
  gainNode.connect(destination);
  src.start();
  loops.set(id,src);
  return src;
}

async function startAudio(){
  await getManifest();

  if(!ctx){
    const C=window.AudioContext||window.webkitAudioContext;
    if(!C)throw new Error('Web Audio unavailable');

    ctx=new C({latencyHint:'interactive'});
    state.contextCount++;

    nodes.master=ctx.createGain();
    nodes.master.gain.value=.0001;

    nodes.compressor=ctx.createDynamicsCompressor();
    nodes.compressor.threshold.value=-11;
    nodes.compressor.knee.value=10;
    nodes.compressor.ratio.value=3.2;
    nodes.compressor.attack.value=.005;
    nodes.compressor.release.value=.16;
    nodes.compressor.connect(nodes.master);
    nodes.master.connect(ctx.destination);

    nodes.musicBus=createBus();
    nodes.ambienceBus=createBus();
    nodes.sfxBus=createBus();

    nodes.musicScene=ctx.createGain();
    nodes.musicScene.gain.value=.0001;
    nodes.musicScene.connect(nodes.musicBus);

    nodes.windGain=ctx.createGain();
    nodes.windGain.gain.value=.0001;

    nodes.localGain=ctx.createGain();
    nodes.localGain.gain.value=.0001;

    nodes.engineGain=ctx.createGain();
    nodes.engineGain.gain.value=.0001;

    musicEl=document.createElement('audio');
    musicEl.src=assetURL(manifest.assets.music.path);
    musicEl.loop=true;
    musicEl.preload='auto';
    musicEl.crossOrigin='anonymous';

    musicNode=ctx.createMediaElementSource(musicEl);
    musicNode.connect(nodes.musicScene);

    const preload=[
      manifest.assets.wind.path,
      manifest.assets.localWater.path,
      manifest.assets.vehicle.path,
      manifest.assets.impact.path,
      manifest.assets.crowd.path,
      ...manifest.assets.cascade.paths
    ];

    await Promise.all(preload.map((p)=>loadBuffer(p).catch(()=>null)));

    await Promise.all([
      startLoop('wind',manifest.assets.wind.path,nodes.windGain,nodes.ambienceBus),
      startLoop('local',manifest.assets.localWater.path,nodes.localGain,nodes.ambienceBus),
      startLoop('vehicle',manifest.assets.vehicle.path,nodes.engineGain,nodes.sfxBus)
    ].map((p)=>p.catch(()=>null)));
  }

  if(ctx.state!=='running')await ctx.resume();

  if(state.musicWanted){
    try{await musicEl.play()}
    catch(e){state.loadErrors.push('music play: '+e.message)}
  }

  state.ready=true;
  updateMix();
  render();
  return snapshot();
}

function setScene(id){
  if(!manifest?.scenes?.[id])return false;
  state.scene=id;
  document.body.dataset.scene=id;

  $$('.scene-button').forEach((b)=>b.classList.toggle('active',b.dataset.scene===id));

  const sc=manifest.scenes[id];
  $('#sceneTitle').textContent=sc.label;
  $('#sceneSummary').textContent=sc.summary;
  $('#voiceText').textContent=sc.voice;

  updateMix();
  render();
  return true;
}

function voiceFocus(on){
  state.ducked=!!on;
  updateMix();
  render();
  return snapshot();
}

function pickVoice(){
  const synth=window.speechSynthesis;
  if(!synth)return null;
  const all=synth.getVoices()||[];
  const en=all.filter((v)=>String(v.lang||'').toLowerCase().startsWith('en'));
  return en.find((v)=>v.localService)||en[0]||all[0]||null;
}

function speak(){
  if(!manifest)return false;

  const text=currentScene().voice;
  $('#voiceText').textContent=text;
  clearTimeout(state.voiceTimer);
  voiceFocus(true);
  state.counters.voice++;

  const synth=window.speechSynthesis;
  const done=()=>voiceFocus(false);

  if(synth&&window.SpeechSynthesisUtterance){
    try{
      synth.cancel();
      const u=new SpeechSynthesisUtterance(text);
      const v=pickVoice();
      if(v)u.voice=v;
      u.lang=(v&&v.lang)||'en-US';
      u.rate=.94;
      u.pitch=.86;
      u.volume=state.user.voice;
      u.onend=done;
      u.onerror=done;
      synth.speak(u);
      state.voiceTimer=setTimeout(done,8000);
    }catch{
      state.voiceTimer=setTimeout(done,3600);
    }
  }else{
    state.voiceTimer=setTimeout(done,3600);
  }

  render();
  return true;
}

async function playOne(rel,gain=1,rate=1){
  if(!ctx)await startAudio();
  const buf=await loadBuffer(rel);

  const src=ctx.createBufferSource();
  const g=ctx.createGain();

  src.buffer=buf;
  src.playbackRate.value=rate;
  g.gain.value=gain;

  src.connect(g);
  g.connect(nodes.sfxBus);
  src.start();

  src.onended=()=>{
    try{src.disconnect();g.disconnect()}catch{}
  };
}

async function impact(){
  await playOne(manifest.assets.impact.path,.72,1);
  state.counters.impact++;
  render();
}

async function crowd(){
  await playOne(manifest.assets.crowd.path,.42,1);
  state.counters.crowd++;
  render();
}

async function cascade(){
  if(!ctx)await startAudio();
  state.counters.cascade++;

  manifest.assets.cascade.paths.forEach((p,i)=>{
    setTimeout(()=>playOne(p,.28+i*.035,.96+i*.025).catch(()=>{}),i*105);
  });

  render();
}

function seededNoise(frames,seed=0x4b4642){
  let x=seed|0;
  const out=new Float32Array(frames);
  for(let i=0;i<frames;i++){
    x^=x<<13;
    x^=x>>>17;
    x^=x<<5;
    out[i]=((x>>>0)/4294967296)*2-1;
  }
  return out;
}

async function storm(){
  if(!ctx)await startAudio();

  const dur=2.5;
  const frames=Math.floor(ctx.sampleRate*dur);
  const buf=ctx.createBuffer(1,frames,ctx.sampleRate);
  const data=buf.getChannelData(0);
  const noise=seededNoise(frames);

  for(let i=0;i<frames;i++){
    const t=i/frames;
    const env=Math.exp(-5.5*t)*(1-Math.exp(-80*t));
    data[i]=noise[i]*env*(.75+.25*Math.sin(i*.0017));
  }

  const src=ctx.createBufferSource();
  const lp=ctx.createBiquadFilter();
  const g=ctx.createGain();

  lp.type='lowpass';
  lp.frequency.value=520;
  lp.Q.value=.5;
  g.gain.value=.48;

  src.buffer=buf;
  src.connect(lp);
  lp.connect(g);
  g.connect(nodes.sfxBus);
  src.start();

  const osc=ctx.createOscillator();
  const og=ctx.createGain();
  osc.type='sine';
  osc.frequency.value=57;
  og.gain.value=.11;
  osc.connect(og);
  og.connect(nodes.sfxBus);
  osc.start();
  og.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+1.7);
  osc.stop(ctx.currentTime+1.8);

  state.counters.storm++;
  render();
}

async function vehicle(){
  if(!ctx)await startAudio();
  state.counters.vehicle++;
  setParam(nodes.engineGain.gain,.40,.05);
  setTimeout(()=>setParam(nodes.engineGain.gain,.0001,.35),1800);
  render();
}

async function toggleMusic(){
  if(!ctx)await startAudio();

  state.musicWanted=!state.musicWanted;

  if(state.musicWanted){
    try{await musicEl.play()}
    catch(e){state.loadErrors.push('music play: '+e.message)}
  }else{
    musicEl.pause();
  }

  render();
  return state.musicWanted;
}

function snapshot(){
  const safe=(n)=>Number((n||0).toFixed(4));

  return {
    build:manifest?.build||null,
    ready:state.ready,
    scene:state.scene,
    ducked:state.ducked,
    contextState:ctx?.state||'none',
    contextCount:state.contextCount,
    loaded:state.loaded,
    loadErrors:[...state.loadErrors],
    activeLoops:loops.size,
    musicWanted:state.musicWanted,
    musicPaused:musicEl?musicEl.paused:true,
    musicTime:safe(musicEl?.currentTime||0),
    gains:{
      master:safe(nodes.master?.gain.value),
      musicBus:safe(nodes.musicBus?.gain.value),
      ambienceBus:safe(nodes.ambienceBus?.gain.value),
      sfxBus:safe(nodes.sfxBus?.gain.value),
      musicScene:safe(nodes.musicScene?.gain.value),
      wind:safe(nodes.windGain?.gain.value),
      local:safe(nodes.localGain?.gain.value)
    },
    user:{...state.user},
    counters:{...state.counters}
  };
}

function updateMeters(){
  if(!manifest)return;
  const sc=currentScene();
  const duck=state.ducked?sc.duck:{music:1,ambience:1};

  const values={
    master:state.user.master,
    voice:state.user.voice,
    music:state.user.music*sc.music*duck.music,
    ambience:state.user.ambience*Math.max(sc.wind,sc.localWater)*duck.ambience,
    sfx:state.user.sfx*.72
  };

  for(const [key,val] of Object.entries(values)){
    const el=document.querySelector('[data-meter="'+key+'"]');
    if(el)el.style.setProperty('--level',Math.round(clamp(val)*100)+'%');
  }
}

function render(){
  const snap=snapshot();

  $('#audioStatus').textContent=snap.ready?'AUDIO RUNNING':'AUDIO STOPPED';
  $('#contextStatus').textContent='Context '+snap.contextState+' · '+snap.contextCount+' owner';
  $('#duckStatus').textContent=snap.ducked?'VOICE FOCUS · DUCKED':'WORLD MIX · OPEN';
  $('#musicStatus').textContent=snap.musicWanted?'BAND ON':'BAND PAUSED';
  $('#diagnostics').textContent=JSON.stringify(snap,null,2);

  updateMeters();
}

function bind(){
  $('#startAudio').addEventListener('click',()=>startAudio().catch((e)=>{
    state.loadErrors.push('start: '+e.message);
    render();
  }));

  $('#speak').addEventListener('click',speak);
  $('#impact').addEventListener('click',()=>impact().catch(()=>{}));
  $('#crowd').addEventListener('click',()=>crowd().catch(()=>{}));
  $('#cascade').addEventListener('click',()=>cascade().catch(()=>{}));
  $('#storm').addEventListener('click',()=>storm().catch(()=>{}));
  $('#vehicle').addEventListener('click',()=>vehicle().catch(()=>{}));
  $('#musicToggle').addEventListener('click',()=>toggleMusic().catch(()=>{}));

  $$('.scene-button').forEach((b)=>b.addEventListener('click',()=>setScene(b.dataset.scene)));

  $$('input[type="range"]').forEach((input)=>{
    input.addEventListener('input',()=>{
      state.user[input.dataset.bus]=clamp(input.value);
      input.nextElementSibling.textContent=Math.round(state.user[input.dataset.bus]*100)+'%';
      updateMix();
      render();
    });
  });

  document.addEventListener('visibilitychange',()=>{
    if(ctx&&document.hidden&&ctx.state==='running'){
      ctx.suspend().then(render).catch(()=>{});
    }
  });
}

window.__KFB_AUDIO_CAL__={
  startAudio,
  setScene,
  voiceFocus,
  speak,
  impact,
  crowd,
  cascade,
  storm,
  vehicle,
  toggleMusic,
  snapshot
};

getManifest()
  .then((m)=>{
    document.body.dataset.build=m.build;
    bind();
    setScene(state.scene);
    render();
  })
  .catch((e)=>{
    state.loadErrors.push('manifest: '+e.message);
    bind();
    render();
  });
