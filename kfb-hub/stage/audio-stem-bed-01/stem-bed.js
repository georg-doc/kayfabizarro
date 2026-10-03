const ROOT=new URL('../../../',location.href);
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
let spec=null,ctx=null,masterBus=null,nightFilter=null,buffers=new Map(),laneNodes=new Map(),sources=[],timer=null,playStart=0;
const state={loaded:false,contextCount:0,mode:'idle',activity:.35,roadLift:0,night:0,voiceFocus:false,timelineStarts:[],errors:[],stats:{}};

const BASE={drums:.48,bass:.72,guitar:.16,keyboard:.48,percussion:.12,strings:.05,synth:.14,brass:.025};
const ACT={drums:.34,bass:.12,guitar:.10,keyboard:.08,percussion:.26,strings:.02,synth:.06,brass:.02};
const ROAD={drums:.18,bass:.16,guitar:.09,keyboard:.05,percussion:.18,strings:-.02,synth:.10,brass:.015};
const NIGHT={drums:-.12,bass:-.03,guitar:-.08,keyboard:-.08,percussion:-.10,strings:.05,synth:.08,brass:-.01};
const VOICE={drums:.72,bass:.78,guitar:.26,keyboard:.34,percussion:.42,strings:.24,synth:.28,brass:.20};

function clamp(v,a=0,b=1){return Math.max(a,Math.min(b,Number(v)||0));}
function rootURL(p){return new URL(p,ROOT).href;}
function barSeconds(){return 60/spec.donor.bpm*spec.donor.beatsPerBar;}
function fmt(sec){sec=Math.max(0,sec||0);return Math.floor(sec/60)+':'+String(Math.floor(sec%60)).padStart(2,'0');}
function targetFor(id){
 let v=(BASE[id]||0)+(ACT[id]||0)*state.activity+(ROAD[id]||0)*state.roadLift+(NIGHT[id]||0)*state.night;
 v=clamp(v,0,.95);
 if(state.voiceFocus)v*=VOICE[id]??.4;
 return clamp(v,0,.95);
}
function targets(){return Object.fromEntries(spec.donor.stems.map(s=>[s.id,+targetFor(s.id).toFixed(3)]));}
function setTarget(param,v,tau=.16){if(!ctx)return;const t=ctx.currentTime;param.cancelScheduledValues(t);param.setTargetAtTime(Math.max(.0001,v),t,tau);}
function makeGraph(){
 masterBus=ctx.createGain();masterBus.gain.value=.82;
 nightFilter=ctx.createBiquadFilter();nightFilter.type='lowpass';nightFilter.frequency.value=12000;nightFilter.Q.value=.15;
 nightFilter.connect(masterBus);masterBus.connect(ctx.destination);
 for(const s of spec.donor.stems){const g=ctx.createGain();g.gain.value=.0001;g.connect(nightFilter);laneNodes.set(s.id,g);}
}
function approxStats(b){
 const ch=b.getChannelData(0),stride=Math.max(1,Math.floor(ch.length/90000));let sum=0,peak=0,n=0;
 for(let i=0;i<ch.length;i+=stride){const v=ch[i];sum+=v*v;peak=Math.max(peak,Math.abs(v));n++;}
 return {duration:+b.duration.toFixed(4),sampleRate:b.sampleRate,channels:b.numberOfChannels,rms:+Math.sqrt(sum/Math.max(1,n)).toFixed(5),peak:+peak.toFixed(5)};
}
async function decode(id,path){const r=await fetch(rootURL(path),{cache:'no-store'});if(!r.ok)throw new Error(path+' HTTP '+r.status);const b=await ctx.decodeAudioData((await r.arrayBuffer()).slice(0));buffers.set(id,b);state.stats[id]=approxStats(b);}
async function loadAll(){
 if(state.loaded)return snapshot();
 if(!spec)spec=await fetch('./SOURCE.json',{cache:'no-store'}).then(r=>r.json());
 if(!ctx){const C=window.AudioContext||window.webkitAudioContext;if(!C)throw new Error('Web Audio unavailable');ctx=new C({latencyHint:'interactive'});state.contextCount++;makeGraph();}
 if(ctx.state!=='running')await ctx.resume();
 $('#mode').textContent='LOADING…';
 await Promise.all([decode('master',spec.donor.master.path),...spec.donor.stems.map(s=>decode('stem:'+s.id,s.path))]);
 state.loaded=true;$$('.transport button').forEach(b=>b.disabled=false);$('#reset').disabled=false;applyMix();render();return snapshot();
}
function stopAll(){for(const s of sources){try{s.stop()}catch{}try{s.disconnect()}catch{}}sources=[];state.timelineStarts=[];state.mode='idle';if(timer){clearInterval(timer);timer=null;}render();}
function source(buffer,dest,t){const s=ctx.createBufferSource();s.buffer=buffer;s.connect(dest);s.start(t);sources.push(s);return s;}
function playMaster(){stopAll();state.mode='master';playStart=ctx.currentTime+.08;masterBus.gain.setValueAtTime(.68,playStart);nightFilter.frequency.setValueAtTime(12000,playStart);source(buffers.get('master'),nightFilter,playStart);state.timelineStarts=[playStart];startTicker();render();}
function playStemBed(){
 stopAll();state.mode='stem-bed';playStart=ctx.currentTime+.10;masterBus.gain.setValueAtTime(.88,playStart);
 const starts=[];for(const s of spec.donor.stems){const t=playStart;source(buffers.get('stem:'+s.id),laneNodes.get(s.id),t);starts.push(t);}
 state.timelineStarts=starts;applyMix(true);startTicker();render();
}
function applyMix(immediate=false){
 if(!ctx||!spec)return;const t=targets();
 for(const [id,v] of Object.entries(t)){const g=laneNodes.get(id);if(immediate)g.gain.setValueAtTime(Math.max(.0001,v),ctx.currentTime);else setTarget(g.gain,v,.18);}
 const cutoff=12000-state.night*7800; if(immediate)nightFilter.frequency.setValueAtTime(cutoff,ctx.currentTime);else setTarget(nightFilter.frequency,cutoff,.24);
 if(state.mode==='stem-bed')setTarget(masterBus.gain,state.voiceFocus?.72:.88,.18);
 render();
}
function setControl(name,value){if(!['activity','roadLift','night'].includes(name))return snapshot();state[name]=clamp(value);applyMix();return snapshot();}
function setVoiceFocus(on){state.voiceFocus=!!on;applyMix();return snapshot();}
function reset(){state.activity=.35;state.roadLift=0;state.night=0;state.voiceFocus=false;syncUI();applyMix();return snapshot();}
function startTicker(){if(timer)clearInterval(timer);timer=setInterval(()=>{if(!ctx||state.mode==='idle')return;const e=Math.max(0,ctx.currentTime-playStart);$('#time').textContent=fmt(e);$('#bar').textContent=String(Math.floor(e/barSeconds())+1);renderLive();},120);}
function renderLanes(){const r=$('#lanes');r.innerHTML='';for(const s of spec.donor.stems){const d=document.createElement('div');d.className='lane';d.dataset.lane=s.id;d.innerHTML='<span>'+s.id.toUpperCase()+'</span><b>'+s.label+'</b><div class="meter"><i></i></div><div class="meta">—</div>';r.appendChild(d);}}
function contextLabel(){const p=[];if(state.activity>.68)p.push('active');else if(state.activity<.2)p.push('calm');if(state.roadLift>.25)p.push('road');if(state.night>.35)p.push('night');if(state.voiceFocus)p.push('voice');return p.length?p.join(' + '):'neutral';}
function syncUI(){for(const id of ['activity','roadLift','night']){const el=$('#'+id);el.value=state[id];el.nextElementSibling.textContent=Math.round(state[id]*100)+'%';}$('#voiceFocus').setAttribute('aria-pressed',String(state.voiceFocus));$('#voiceFocus').textContent=state.voiceFocus?'ON':'OFF';}
function renderLive(){
 $('#mode').textContent=state.mode.toUpperCase();$('#ctxState').textContent=contextLabel();const t=targets();
 for(const s of spec?.donor?.stems||[]){const el=document.querySelector('[data-lane="'+s.id+'"]');if(!el)continue;el.querySelector('.meter i').style.width=Math.round((t[s.id]||0)*100)+'%';const st=state.stats['stem:'+s.id];el.querySelector('.meta').textContent=(t[s.id]||0).toFixed(2)+(st?' · '+st.duration.toFixed(1)+'s':'');}
}
function snapshot(){
 const durs=spec?spec.donor.stems.map(s=>state.stats['stem:'+s.id]?.duration).filter(Number.isFinite):[];
 return {build:spec?.build||null,loaded:state.loaded,contextCount:state.contextCount,contextState:ctx?.state||'none',mode:state.mode,controls:{activity:state.activity,roadLift:state.roadLift,night:state.night,voiceFocus:state.voiceFocus},targets:spec?targets():{},timelineStarts:[...state.timelineStarts],synchronizedStarts:state.timelineStarts.length<2||Math.max(...state.timelineStarts)-Math.min(...state.timelineStarts)<1e-7,stemDurationSpread:durs.length?+(Math.max(...durs)-Math.min(...durs)).toFixed(4):null,masterStats:state.stats.master||null,stemStats:spec?Object.fromEntries(spec.donor.stems.map(s=>[s.id,state.stats['stem:'+s.id]||null])):{},errors:[...state.errors]};
}
function render(){renderLive();$('#diag').textContent=JSON.stringify(snapshot(),null,2);}
function bind(){
 $('#load').onclick=()=>loadAll().catch(e=>{state.errors.push(e.message);render()});$('#playMaster').onclick=playMaster;$('#playStemBed').onclick=playStemBed;$('#stop').onclick=stopAll;$('#reset').onclick=reset;
 for(const id of ['activity','roadLift','night'])$('#'+id).oninput=e=>{setControl(id,e.target.value);e.target.nextElementSibling.textContent=Math.round(e.target.value*100)+'%';};
 $('#voiceFocus').onclick=()=>{setVoiceFocus(!state.voiceFocus);syncUI();};
}
window.__KFB_STEM_BED__={loadAll,playMaster,playStemBed,stopAll,setControl,setVoiceFocus,reset,snapshot};
fetch('./SOURCE.json',{cache:'no-store'}).then(r=>r.json()).then(s=>{spec=s;renderLanes();bind();syncUI();render()}).catch(e=>{state.errors.push(e.message);bind();render()});