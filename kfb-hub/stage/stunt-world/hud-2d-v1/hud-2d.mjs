const params=new URLSearchParams(location.search);
const frame=document.getElementById('driveHost');
const speedEl=document.getElementById('speedValue');
const driveEl=document.getElementById('driveState');
const boostEl=document.getElementById('boostState');
const boostFill=document.getElementById('boostRailFill');
const needle=document.getElementById('needle');
const radioTitle=document.getElementById('radioTitle');
const radioPlay=document.getElementById('radioPlay');
const radioNext=document.getElementById('radioNext');
const radioVolume=document.getElementById('radioVolume');
const almanacDock=document.getElementById('almanacDock');
const almanacCards=document.getElementById('almanacCards');
const hudState=document.getElementById('hudState');
const failure=document.getElementById('failure');

const isStage=/kayfabizarro\.pages\.dev$|georg-doc\.github\.io$/.test(location.hostname);
const defaultHost=isStage?'../../../stunt-race/track-lab-v08/':'./tests/host.html';
const hostUrl=params.get('host')||defaultHost;
const fixture=params.get('fixture')==='1';
const state={
  ready:false,host:hostUrl,sameOrigin:false,radioReady:false,radioSource:fixture?'FIXTURE':'BOX1_RADIO_MODULE',
  almanacReady:false,cardSource:fixture?'FIXTURE_ONLY':'KFB_PDF_ART',
  cards:0,minimap:false,keyboardKeysOwned:[],audioContextsOwned:0,error:null
};
let hostWindow=null,hostDocument=null,radio=null,raf=0;

function showFailure(message){state.error=String(message);failure.hidden=false;failure.textContent=String(message)}
function styleHost(){
  const style=hostDocument.createElement('style');
  style.id='kfb-hud2d-host-style';
  style.textContent=`
    .hud,#labToggle,#labPanel,.build,.controls{display:none!important}
    #miniWrap{display:block!important;position:fixed!important;right:16px!important;bottom:16px!important;width:184px!important;height:184px!important;border-radius:10px!important;background:rgba(22,26,29,.78)!important;border:1px solid rgba(255,255,255,.13)!important;overflow:hidden!important;box-shadow:0 10px 28px rgba(0,0,0,.24)!important;z-index:12!important}
    #mini{width:100%!important;height:100%!important}
    @media(max-width:700px){#miniWrap{right:8px!important;bottom:94px!important;width:132px!important;height:132px!important}}
  `;
  hostDocument.head.appendChild(style);
  const mini=hostDocument.getElementById('miniWrap');
  if(mini){mini.hidden=false;state.minimap=true}
}
function phaseFrom(t){
  if(t?.airborne)return 'AIR';
  if(t?.driftActive)return t.driftDirection<0?'DRIFT L':'DRIFT R';
  if(t?.regrip)return 'RE-GRIP';
  return 'GRIP';
}
function telemetry(){
  return hostWindow?.__KFB_RACE_TELEMETRY__||null;
}
function renderTelemetry(){
  const t=telemetry();
  if(t){
    const kmh=Math.round(Math.abs(Number(t.speed)||0)*7.2);
    speedEl.textContent=String(kmh);
    driveEl.textContent=phaseFrom(t);
    const speedN=Math.max(0,Math.min(1,Number(t.speedNormalized)||0));
    const angle=-118+speedN*236;
    needle.style.transform=`rotate(${angle}deg)`;
    boostEl.dataset.on=String(!!t.boostActive);
    boostFill.style.width=(t.boostActive?100:Math.round(speedN*42))+'%';
  }
  if(radio){
    const r=radio.snapshot();
    radioTitle.textContent=r.title||'RADIO';
    radioPlay.textContent=r.playing?'Ⅱ':'▶';
    radioPlay.dataset.on=String(!!r.playing);
    radioVolume.value=String(Number.isFinite(r.volume)?r.volume:.45);
  }
  hudState.textContent=state.ready?'HUD 2D v1 · Race owns drive · cards 4 · map live':'HUD connecting…';
  raf=requestAnimationFrame(renderTelemetry);
}
async function bootRadio(){
  if(fixture){
    let playing=false,volume=.45,index=0;
    const titles=['VAN METRONOME','ROADTRIP CHECKPOINT','FINAL LAP LIFT'];
    radio={
      snapshot:()=>({title:titles[index],playing,volume}),
      async resume(){return true},
      toggle(){playing=!playing},
      next(){index=(index+1)%titles.length},
      setVolume(v){volume=Math.max(0,Math.min(1,v))}
    };
    state.radioReady=true;return;
  }
  const moduleUrl=params.get('radioModule')||(isStage?'../../../stunt-race/track-environment-lab/box-stop/radio.mjs':'../track-environment-lab/box-stop/radio.mjs');
  const mod=await import(moduleUrl);
  radio=await mod.createRadio(()=>{});
  state.radioReady=true;
}
radioPlay.addEventListener('pointerdown',async e=>{e.preventDefault();e.stopPropagation();if(!radio)return;await radio.resume();radio.toggle()});
radioNext.addEventListener('pointerdown',async e=>{e.preventDefault();e.stopPropagation();if(!radio)return;await radio.resume();radio.next()});
radioVolume.addEventListener('input',e=>{radio?.setVolume(Number(e.target.value))});
function fixtureCard(index){
  const c=document.createElement('canvas');c.width=240;c.height=418;const g=c.getContext('2d');
  const colors=['#d4774b','#4f96a6','#c3a54b','#735c8e'];g.fillStyle=colors[index%colors.length];g.fillRect(0,0,c.width,c.height);
  g.fillStyle='#1e2224';g.fillRect(16,16,c.width-32,c.height-32);g.fillStyle='#ece0c4';g.beginPath();g.arc(120,145,68,0,Math.PI*2);g.fill();
  return c;
}
async function bootAlmanac(){
  for(let i=0;i<4;i++){
    let canvas;
    if(fixture)canvas=fixtureCard(i);
    else{
      if(!window.OW_ART?.art)throw new Error('KFB Card art source unavailable');
      const art=await window.OW_ART.art({packId:'ai_kayfabe',n:i+1},{res:720});
      if(!art?.canvas)throw new Error('KFB Card art failed at '+(i+1));
      canvas=art.canvas;
    }
    const button=document.createElement('button');button.className='almanacCard';button.type='button';button.tabIndex=-1;
    const out=document.createElement('canvas');out.width=canvas.width;out.height=canvas.height;out.getContext('2d').drawImage(canvas,0,0);
    button.appendChild(out);almanacCards.appendChild(button);state.cards++;
  }
  state.almanacReady=state.cards===4;
}
function snapshot(){return JSON.parse(JSON.stringify({...state,layout:{
  radio:'TOP_LEFT',speed:'BOTTOM_LEFT',minimap:'BOTTOM_RIGHT',almanac:'TOP_RIGHT',waypoint:'DORMANT_NO_DESTINATION_OWNER'
},telemetry:telemetry()?{speed:telemetry().speed,boostActive:telemetry().boostActive,driftActive:telemetry().driftActive}:null}))}
window.__KFB_HUD_2D__={version:'1.0.0-interim',snapshot,get ready(){return state.ready||!!state.error}};

frame.addEventListener('load',async()=>{
  try{
    hostWindow=frame.contentWindow;hostDocument=frame.contentDocument;
    if(!hostWindow||!hostDocument||hostWindow.location.href==='about:blank')return;
    state.sameOrigin=true;styleHost();
    if(!fixture){
      const deadline=performance.now()+30000;
      while(!hostWindow.__KFB_RACE_TELEMETRY__&&performance.now()<deadline)await new Promise(r=>setTimeout(r,100));
      if(!hostWindow.__KFB_RACE_TELEMETRY__)throw new Error('Race telemetry seam unavailable');
    }
    await Promise.all([bootRadio(),bootAlmanac()]);
    state.ready=true;
    failure.hidden=true;
  }catch(error){showFailure('HUD 2D v1 · '+(error?.message||error))}
});
frame.src=hostUrl;
renderTelemetry();
addEventListener('pagehide',()=>cancelAnimationFrame(raf));
