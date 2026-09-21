const params=new URLSearchParams(location.search);
const frame=document.getElementById('driveHost');
const speedCluster=document.getElementById('speedCluster');
const speedValue=document.getElementById('speedValue');
const speedArcLive=document.getElementById('speedArcLive');
const driveState=document.getElementById('driveState');
const boostState=document.getElementById('boostState');
const radioPlay=document.getElementById('radioPlay');
const radioNext=document.getElementById('radioNext');
const radioMute=document.getElementById('radioMute');
const radioVolume=document.getElementById('radioVolume');
const almanacCards=document.getElementById('almanacCards');
const failure=document.getElementById('failure');

const isStage=/kayfabizarro\.pages\.dev$|georg-doc\.github\.io$/.test(location.hostname);
const fixture=params.get('fixture')==='1';
const defaultHost=isStage?'../../../stunt-race/track-lab-v08/':'./tests/host.html';
const hostUrl=params.get('host')||defaultHost;

const state={
  ready:false,error:null,sameOrigin:false,host:hostUrl,
  radioReady:false,almanacReady:false,cards:0,minimap:false,
  radioSource:fixture?'FIXTURE':'BOX1_RADIO_MODULE',
  cardSource:'KFB_PDF_ART',
  keyboardKeysOwned:[],audioContextsOwned:0,
  cardOrientation:'LANDSCAPE_NATURAL_RATIO',
  visualSSOT:'GAME_HUD_V3_2026-09-19'
};

let hostWindow=null,hostDocument=null,radio=null,raf=0,lastTelemetry=null,lastVolume=.45,muted=false;

function fail(message){state.error=String(message);failure.hidden=false;failure.textContent='HUD V3 · '+state.error}
function telemetry(){return hostWindow?.__KFB_RACE_TELEMETRY__||null}
function phase(t){if(t?.airborne)return'AIR';if(t?.driftActive)return t.driftDirection<0?'DRIFT L':'DRIFT R';if(t?.regrip)return'RE-GRIP';return'GRIP'}

function styleHost(){
  const style=hostDocument.createElement('style');
  style.id='kfb-game-hud-v3-host-style';
  style.textContent=`
    .hud,#labToggle,#labPanel,.build,.controls{display:none!important}
    #miniWrap{
      display:block!important;position:fixed!important;right:18px!important;bottom:18px!important;
      width:182px!important;height:182px!important;z-index:12!important;overflow:hidden!important;
      border:1px solid rgba(255,255,255,.12)!important;border-radius:8px!important;
      background:rgba(20,24,26,.68)!important;
      box-shadow:0 8px 18px rgba(0,0,0,.22)!important;
      backdrop-filter:blur(5px)!important;-webkit-backdrop-filter:blur(5px)!important;
    }
    #mini{width:100%!important;height:100%!important;opacity:.96;filter:contrast(1.08) saturate(.9)}
    @media(max-width:700px){
      #miniWrap{right:8px!important;bottom:92px!important;width:126px!important;height:126px!important;border-radius:7px!important}
    }
  `;
  hostDocument.head.appendChild(style);
  const mini=hostDocument.getElementById('miniWrap');
  if(mini){mini.hidden=false;state.minimap=true}
  hostWindow.dispatchEvent(new Event('resize'));
}

async function bootRadio(){
  if(fixture){
    let index=0,playing=false,volume=.45;
    radio={
      snapshot:()=>({index,playing,volume}),
      async resume(){return true},
      toggle(){playing=!playing},
      next(){index=(index+1)%4},
      setVolume(v){volume=Math.max(0,Math.min(1,v))}
    };
    state.radioReady=true;return;
  }
  const moduleUrl=params.get('radioModule')||(isStage?'../../../stunt-race/track-environment-lab/box-stop/radio.mjs':'../track-environment-lab/box-stop/radio.mjs');
  const mod=await import(moduleUrl);radio=await mod.createRadio(()=>{});state.radioReady=true;
}

async function bootAlmanac(){
  if(!window.OW_ART?.art)throw new Error('KFB Card art source unavailable');
  for(let i=0;i<4;i++){
    const art=await window.OW_ART.art({packId:'ai_kayfabe',n:i+1},{res:900});
    if(!art?.canvas)throw new Error('KFB Card art failed at '+(i+1));
    const ratio=art.canvas.width/art.canvas.height;
    if(ratio<=1)throw new Error('KFB Card is not landscape at '+(i+1)+' ratio='+ratio.toFixed(3));
    const b=document.createElement('button');b.type='button';b.className='almanacCard';b.tabIndex=-1;b.dataset.card=String(i+1);
    const out=document.createElement('canvas');out.width=art.canvas.width;out.height=art.canvas.height;out.getContext('2d').drawImage(art.canvas,0,0);
    b.appendChild(out);almanacCards.appendChild(b);state.cards++;
  }
  state.almanacReady=state.cards===4;
}

radioPlay.addEventListener('pointerdown',async e=>{e.preventDefault();e.stopPropagation();if(!radio)return;await radio.resume();radio.toggle()});
radioNext.addEventListener('pointerdown',async e=>{e.preventDefault();e.stopPropagation();if(!radio)return;await radio.resume();radio.next()});
radioMute.addEventListener('pointerdown',e=>{
  e.preventDefault();e.stopPropagation();if(!radio)return;
  const snap=radio.snapshot();
  if(!muted){lastVolume=Number.isFinite(snap.volume)?snap.volume:lastVolume;radio.setVolume(0);muted=true}else{radio.setVolume(lastVolume||.45);muted=false}
  radioMute.dataset.muted=String(muted);
});
radioVolume.addEventListener('input',e=>{const v=Number(e.target.value);lastVolume=v;if(v>0)muted=false;radioMute.dataset.muted=String(muted);radio?.setVolume(v)});

function paint(){
  const t=telemetry();
  if(t){
    lastTelemetry=t;const n=Math.max(0,Math.min(1,Number(t.speedNormalized)||0));speedValue.textContent=String(Math.round(Math.abs(Number(t.speed)||0)*7.2));speedArcLive.style.strokeDasharray=(n*100).toFixed(1)+' 100';driveState.textContent=phase(t);boostState.dataset.on=String(!!t.boostActive);speedCluster.dataset.boost=String(!!t.boostActive);
  }
  if(radio){
    const r=radio.snapshot();radioPlay.dataset.on=String(!!r.playing);if(!muted&&Number.isFinite(r.volume)){lastVolume=r.volume;radioVolume.value=String(r.volume)}
  }
  raf=requestAnimationFrame(paint);
}

function snapshot(){
  const ratios=[...almanacCards.querySelectorAll('canvas')].map(c=>c.width/c.height);
  return JSON.parse(JSON.stringify({
    ...state,
    layout:{radio:'TOP_LEFT_GAME_CONTROLS',speed:'BOTTOM_LEFT_TACHO',minimap:'BOTTOM_RIGHT_REAL_ROUTE',almanac:'TOP_RIGHT_LANDSCAPE_FAN',waypoint:'DORMANT_NO_DESTINATION_OWNER'},
    cardRatios:ratios,
    telemetry:lastTelemetry?{speed:lastTelemetry.speed,speedNormalized:lastTelemetry.speedNormalized,boostActive:lastTelemetry.boostActive,driftActive:lastTelemetry.driftActive}:null
  }));
}
window.__KFB_HUD_GAME_V3__={version:'3.0.0-game-hud',snapshot,get ready(){return state.ready||!!state.error}};

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
    await Promise.all([bootRadio(),bootAlmanac()]);state.ready=true;failure.hidden=true;
  }catch(error){fail(error?.message||error)}
});
frame.src=hostUrl;paint();addEventListener('pagehide',()=>cancelAnimationFrame(raf));
