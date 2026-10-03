const ROOT=new URL('../../../',location.href);
const $=(s)=>document.querySelector(s);
const $$=(s)=>[...document.querySelectorAll(s)];

let spec=null;
let ctx=null;
let buffers=new Map();
let active=[];
let timer=null;
let playStart=0;
let currentMode='idle';
let laneNodes=new Map();
let masterBus=null;
let comp=null;
let delay=null;
let delayFeedback=null;
let delayWet=null;

const ARRANGE_GAINS={
  OPEN:{drums:.08,bass:.16,guitar:.04,keyboard:.26,percussion:.14,strings:.08,synth:.24,brass:.00,wet:.10},
  A:{drums:.72,bass:.80,guitar:.10,keyboard:.48,percussion:.20,strings:.03,synth:.12,brass:.00,wet:.08},
  APRIME:{drums:.76,bass:.82,guitar:.20,keyboard:.44,percussion:.28,strings:.04,synth:.14,brass:.04,wet:.09},
  B:{drums:.80,bass:.88,guitar:.15,keyboard:.56,percussion:.34,strings:.06,synth:.20,brass:.08,wet:.10},
  SPACE:{drums:.16,bass:.32,guitar:.06,keyboard:.22,percussion:.16,strings:.10,synth:.28,brass:.00,wet:.22},
  ARETURN:{drums:.72,bass:.80,guitar:.16,keyboard:.46,percussion:.22,strings:.04,synth:.14,brass:.02,wet:.09},
  PSY:{drums:.66,bass:.72,guitar:.18,keyboard:.40,percussion:.25,strings:.08,synth:.38,brass:.05,wet:.26},
  RECOVERY:{drums:.38,bass:.55,guitar:.08,keyboard:.30,percussion:.14,strings:.05,synth:.16,brass:.00,wet:.12}
};

const state={
  loaded:false,
  contextCount:0,
  stats:{},
  errors:[],
  scheduledStarts:[],
  activeSources:0,
  currentSection:null,
  currentBar:null
};

function rootURL(path){return new URL(path,ROOT).href;}
function barSeconds(){return 60/spec.bpm*spec.beatsPerBar;}
function fmt(sec){sec=Math.max(0,sec||0);const m=Math.floor(sec/60),s=Math.floor(sec%60);return m+':'+String(s).padStart(2,'0');}
function setGain(param,value,time,ramp=.14){
  param.cancelScheduledValues(time);
  param.setValueAtTime(Math.max(.0001,param.value||.0001),time);
  param.linearRampToValueAtTime(Math.max(.0001,value),time+ramp);
}
function makeGraph(){
  masterBus=ctx.createGain();masterBus.gain.value=.55;
  comp=ctx.createDynamicsCompressor();
  comp.threshold.value=-14;comp.knee.value=12;comp.ratio.value=3;comp.attack.value=.008;comp.release.value=.18;
  masterBus.connect(comp);comp.connect(ctx.destination);

  delay=ctx.createDelay(1.5);delay.delayTime.value=.315;
  delayFeedback=ctx.createGain();delayFeedback.gain.value=.24;
  delayWet=ctx.createGain();delayWet.gain.value=.0001;
  delay.connect(delayFeedback);delayFeedback.connect(delay);delay.connect(delayWet);delayWet.connect(masterBus);

  for(const stem of spec.stems){
    const gain=ctx.createGain();gain.gain.value=.0001;
    const send=ctx.createGain();
    send.gain.value=['keyboard','guitar','synth','strings','brass'].includes(stem.id)?.36:.08;
    gain.connect(masterBus);
    gain.connect(send);send.connect(delay);
    laneNodes.set(stem.id,{gain,send});
  }
}
function approxStats(buffer){
  const ch=buffer.getChannelData(0);
  const stride=Math.max(1,Math.floor(ch.length/120000));
  let sum=0,peak=0,n=0;
  for(let i=0;i<ch.length;i+=stride){const v=ch[i];sum+=v*v;peak=Math.max(peak,Math.abs(v));n++;}
  const rms=Math.sqrt(sum/Math.max(1,n));
  const win=Math.max(256,Math.floor(buffer.sampleRate*.02));
  let onset=0,found=false,globalPeak=peak||1;
  const threshold=Math.max(.004,globalPeak*.035);
  for(let i=0;i<ch.length-win;i+=win){
    let e=0;
    for(let j=0;j<win;j+=8){const v=ch[i+j];e+=v*v;}
    e=Math.sqrt(e/Math.max(1,Math.ceil(win/8)));
    if(e>threshold){onset=i/buffer.sampleRate;found=true;break;}
  }
  return {duration:+buffer.duration.toFixed(4),sampleRate:buffer.sampleRate,channels:buffer.numberOfChannels,rms:+rms.toFixed(5),peak:+peak.toFixed(5),onset:+(found?onset:0).toFixed(4)};
}
async function decodeOne(id,path){
  const res=await fetch(rootURL(path),{cache:'no-store'});
  if(!res.ok)throw new Error(path+' HTTP '+res.status);
  const ab=await res.arrayBuffer();
  const buf=await ctx.decodeAudioData(ab.slice(0));
  buffers.set(id,buf);
  state.stats[id]=approxStats(buf);
}
async function loadAll(){
  if(state.loaded)return snapshot();
  if(!spec){
    const r=await fetch('./SOURCE.json',{cache:'no-store'});
    if(!r.ok)throw new Error('SOURCE.json HTTP '+r.status);
    spec=await r.json();
    renderForm();
    renderLanes();
  }
  if(!ctx){
    const C=window.AudioContext||window.webkitAudioContext;
    if(!C)throw new Error('Web Audio unavailable');
    ctx=new C({latencyHint:'interactive'});
    state.contextCount++;
    makeGraph();
  }
  if(ctx.state!=='running')await ctx.resume();
  $('#mode').textContent='LOADING…';
  const jobs=[];
  for(const m of spec.masters)jobs.push(decodeOne('master:'+m.id,m.path));
  for(const s of spec.stems)jobs.push(decodeOne('stem:'+s.id,s.path));
  await Promise.all(jobs);
  state.loaded=true;
  $('#mode').textContent='READY';
  $$('[data-play]').forEach(b=>b.disabled=false);
  $('#stop').disabled=false;
  render();
  return snapshot();
}
function stopAll(){
  for(const src of active){try{src.stop();}catch{} try{src.disconnect();}catch{}}
  active=[];
  state.activeSources=0;
  state.scheduledStarts=[];
  currentMode='idle';
  state.currentSection=null;state.currentBar=null;
  if(timer){clearInterval(timer);timer=null;}
  if(masterBus&&ctx)setGain(masterBus.gain,.55,ctx.currentTime,.04);
  if(delayWet&&ctx)setGain(delayWet.gain,.0001,ctx.currentTime,.04);
  for(const {gain} of laneNodes.values())if(ctx)setGain(gain.gain,.0001,ctx.currentTime,.04);
  render();
}
function mkSource(buffer,destination,startAt,offset=0){
  const src=ctx.createBufferSource();src.buffer=buffer;src.connect(destination);src.start(startAt,offset);active.push(src);return src;
}
function playMaster(id){
  stopAll();
  const buf=buffers.get('master:'+id);if(!buf)throw new Error('master not loaded '+id);
  currentMode='master:'+id;
  playStart=ctx.currentTime+.08;
  setGain(masterBus.gain,.78,ctx.currentTime,.04);
  const src=mkSource(buf,masterBus,playStart,0);
  state.scheduledStarts=[playStart];
  state.activeSources=1;
  src.onended=()=>{if(currentMode==='master:'+id)stopAll();};
  startTicker();
  render();
  return snapshot();
}
function scheduleArrange(start){
  const bs=barSeconds();
  for(const sec of spec.sections){
    const t=start+sec.fromBar*bs;
    const g=ARRANGE_GAINS[sec.id];
    for(const stem of spec.stems){
      const node=laneNodes.get(stem.id);
      node.gain.gain.setValueAtTime(Math.max(.0001,g[stem.id]??0),t);
    }
    delayWet.gain.setValueAtTime(Math.max(.0001,g.wet||0),t);
  }
  // One deliberate near-silence bar inside SPACE.
  const down=start+36*bs,back=start+37*bs;
  for(const stem of spec.stems){
    const node=laneNodes.get(stem.id);
    node.gain.gain.setValueAtTime(.006,down);
    node.gain.gain.linearRampToValueAtTime(Math.max(.0001,ARRANGE_GAINS.SPACE[stem.id]??0),back+.18);
  }
  delayWet.gain.setValueAtTime(.04,down);
  delayWet.gain.linearRampToValueAtTime(ARRANGE_GAINS.SPACE.wet,back+.18);
}
function playStems(mode){
  stopAll();
  currentMode='stems:'+mode;
  playStart=ctx.currentTime+.10;
  setGain(masterBus.gain,mode==='reconstruct'?.34:.56,ctx.currentTime,.04);
  if(mode==='reconstruct'){
    for(const stem of spec.stems)laneNodes.get(stem.id).gain.gain.setValueAtTime(1,playStart);
    delayWet.gain.setValueAtTime(.0001,playStart);
  }else scheduleArrange(playStart);

  const starts=[];
  for(const stem of spec.stems){
    const buf=buffers.get('stem:'+stem.id);
    const src=mkSource(buf,laneNodes.get(stem.id).gain,playStart,0);
    starts.push(playStart);
    src.onended=()=>{};
  }
  state.scheduledStarts=starts;
  state.activeSources=active.length;
  startTicker();
  render();
  return snapshot();
}
function sectionAt(bar){
  if(!spec||bar==null)return null;
  return spec.sections.find(s=>bar>=s.fromBar&&bar<s.toBar)||null;
}
function startTicker(){
  if(timer)clearInterval(timer);
  timer=setInterval(()=>{
    if(!ctx||currentMode==='idle')return;
    const elapsed=Math.max(0,ctx.currentTime-playStart);
    const bar=Math.floor(elapsed/barSeconds());
    state.currentBar=bar;
    state.currentSection=sectionAt(bar)?.id||null;
    $('#time').textContent=fmt(elapsed);
    renderLive();
    if(currentMode==='stems:arrange'&&bar>=spec.totalBars)stopAll();
  },100);
}
function renderForm(){
  const root=$('#form');root.innerHTML='';
  for(const s of spec.sections){const d=document.createElement('div');d.dataset.section=s.id;d.textContent=s.id;root.appendChild(d);}
}
function renderLanes(){
  const root=$('#lanes');root.innerHTML='';
  for(const s of spec.stems){
    const d=document.createElement('div');d.className='lane';d.dataset.lane=s.id;
    d.innerHTML='<span>'+s.id.toUpperCase()+'</span><b>'+s.label+'</b><div class="meter"><i></i></div><div class="meta">not loaded</div>';
    root.appendChild(d);
  }
}
function renderLive(){
  $('#mode').textContent=currentMode.toUpperCase();
  $('#bar').textContent=state.currentBar==null?'—':String(state.currentBar+1);
  $('#section').textContent=state.currentSection||'—';
  $$('#form [data-section]').forEach(el=>el.classList.toggle('active',el.dataset.section===state.currentSection));
  for(const stem of spec?.stems||[]){
    const el=document.querySelector('[data-lane="'+stem.id+'"]');
    const node=laneNodes.get(stem.id);
    const v=currentMode.startsWith('stems:')?Math.min(1,node.gain.gain.value):0;
    el.querySelector('.meter i').style.width=Math.round(v*100)+'%';
  }
}
function snapshot(){
  const stemStats=spec?Object.fromEntries(spec.stems.map(s=>[s.id,state.stats['stem:'+s.id]||null])):{};
  const masterStats=spec?Object.fromEntries(spec.masters.map(m=>[m.id,state.stats['master:'+m.id]||null])):{};
  const stemDur=Object.values(stemStats).filter(Boolean).map(x=>x.duration);
  return {
    build:spec?.build||null,
    loaded:state.loaded,
    contextCount:state.contextCount,
    contextState:ctx?.state||'none',
    mode:currentMode,
    bpm:spec?.bpm||null,
    beatsPerBar:spec?.beatsPerBar||null,
    barSeconds:spec?barSeconds():null,
    totalBars:spec?.totalBars||null,
    sections:spec?.sections?.map(x=>({...x}))||[],
    activeSources:state.activeSources,
    scheduledStarts:[...state.scheduledStarts],
    synchronizedStarts:state.scheduledStarts.length<2||Math.max(...state.scheduledStarts)-Math.min(...state.scheduledStarts)<1e-7,
    masterStats,
    stemStats,
    stemDurationSpread:stemDur.length?+(Math.max(...stemDur)-Math.min(...stemDur)).toFixed(4):null,
    currentBar:state.currentBar,
    currentSection:state.currentSection,
    arrangeGains:ARRANGE_GAINS,
    errors:[...state.errors]
  };
}
function render(){
  renderLive();
  if(spec){
    for(const s of spec.stems){
      const st=state.stats['stem:'+s.id];
      const el=document.querySelector('[data-lane="'+s.id+'"] .meta');
      if(el)el.textContent=st?fmt(st.duration)+' · onset '+st.onset.toFixed(2)+'s · rms '+st.rms.toFixed(3):'not loaded';
    }
  }
  $('#diag').textContent=JSON.stringify(snapshot(),null,2);
}
function bind(){
  $('#load').addEventListener('click',()=>loadAll().catch(e=>{state.errors.push(e.message);render();}));
  $$('[data-play]').forEach(b=>b.addEventListener('click',()=>{
    try{
      const [kind,id]=b.dataset.play.split(':');
      if(kind==='master')playMaster(id);else playStems(id);
    }catch(e){state.errors.push(e.message);render();}
  }));
  $('#stop').addEventListener('click',stopAll);
}
window.__KFB_AUDIO_ARRANGE__={loadAll,playMaster,playStems,stopAll,snapshot};
fetch('./SOURCE.json',{cache:'no-store'}).then(r=>r.json()).then(s=>{spec=s;renderForm();renderLanes();bind();render();}).catch(e=>{state.errors.push(e.message);bind();render();});
