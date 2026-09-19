const params=new URLSearchParams(location.search);
const frame=document.getElementById('driveHost');
const speedCluster=document.getElementById('speedCluster');
const speedValue=document.getElementById('speedValue');
const speedArcLive=document.getElementById('speedArcLive');
const driveState=document.getElementById('driveState');
const boostState=document.getElementById('boostState');
const radioTitle=document.getElementById('radioTitle');
const radioPlay=document.getElementById('radioPlay');
const radioNext=document.getElementById('radioNext');
const radioVolume=document.getElementById('radioVolume');
const almanac=document.getElementById('almanac');
const almanacCards=document.getElementById('almanacCards');
const failure=document.getElementById('failure');

const isStage=/kayfabizarro\.pages\.dev$|georg-doc\.github\.io$/.test(location.hostname);
const fixture=params.get('fixture')==='1';
const defaultHost=isStage?'../../../stunt-race/track-lab-v08/':'./tests/host.html';
const hostUrl=params.get('host')||defaultHost;

const state={
  ready:false,error:null,sameOrigin:false,host:hostUrl,
  radioReady:false,radioSource:fixture?'FIXTURE':'BOX1_RADIO_MODULE',
  almanacReady:false,cardSource:'KFB_PDF_ART',cards:0,minimap:false,
  keyboardKeysOwned:[],audioContextsOwned:0,
  visualSSOT:'CHAT_ACCEPTED_CLEAN_RACER_2026-09-19'
};
let hostWindow=null,hostDocument=null,radio=null,raf=0,lastTelemetry=null;

function fail(message){state.error=String(message);failure.hidden=false;failure.textContent='HUD V2 · '+state.error}
function telemetry(){return hostWindow?.__KFB_RACE_TELEMETRY__||null}
function phase(t){
  if(t?.airborne)return 'AIR';
  if(t?.driftActive)return t.driftDirection<0?'DRIFT L':'DRIFT R';
  if(t?.regrip)return 'RE-GRIP';
  return 'GRIP';
}

function styleHost(){
  const style=hostDocument.createElement('style');
  style.id='kfb-clean-hud-v2-host-style';
  style.textContent=`
    .hud,#labToggle,#labPanel,.build,.controls{display:none!important}
    #miniWrap{
      display:block!important;position:fixed!important;right:18px!important;bottom:18px!important;
      width:178px!important;height:178px!important;z-index:12!important;overflow:hidden!important;
      border:0!important;border-radius:17px 17px 17px 5px!important;
      background:
        linear-gradient(180deg,rgba(28,33,35,.72),rgba(19,23,25,.62))!important;
      box-shadow:0 10px 24px rgba(0,0,0,.20),inset 0 0 0 1px rgba(255,255,255,.09)!important;
      backdrop-filter:blur(7px)!important;-webkit-backdrop-filter:blur(7px)!important;
    }
    #miniWrap:after{
      content:"";position:absolute;inset:0;pointer-events:none;
      background:linear-gradient(135deg,rgba(75,210,228,.18),transparent 28%,transparent 75%,rgba(242,188,77,.10));
      border-radius:inherit;
    }
    #mini{width:100%!important;height:100%!important;opacity:.94;filter:contrast(1.07) saturate(.88)}
    @media(max-width:700px){
      #miniWrap{right:8px!important;bottom:92px!important;width:124px!important;height:124px!important;border-radius:14px 14px 14px 4px!important}
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
    const titles=['VAN METRONOME','CHECKPOINT RUSH','NIGHT CIRCUIT RUNNER'];
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

async function bootAlmanac(){
  if(!window.OW_ART?.art)throw new Error('KFB Card art source unavailable');
  for(let i=0;i<4;i++){
    const art=await window.OW_ART.art({packId:'ai_kayfabe',n:i+1},{res:720});
    if(!art?.canvas)throw new Error('KFB Card art failed at '+(i+1));
    const button=document.createElement('button');
    button.type='button';button.className='almanacCard';button.tabIndex=-1;
    const out=document.createElement('canvas');out.width=art.canvas.width;out.height=art.canvas.height;
    out.getContext('2d').drawImage(art.canvas,0,0);
    button.appendChild(out);almanacCards.appendChild(button);state.cards++;
  }
  state.almanacReady=state.cards===4;
}

radioPlay.addEventListener('pointerdown',async e=>{e.preventDefault();e.stopPropagation();if(!radio)return;await radio.resume();radio.toggle()});
radioNext.addEventListener('pointerdown',async e=>{e.preventDefault();e.stopPropagation();if(!radio)return;await radio.resume();radio.next()});
radioVolume.addEventListener('input',e=>radio?.setVolume(Number(e.target.value)));

function paint(){
  const t=telemetry();
  if(t){
    lastTelemetry=t;
    const kmh=Math.round(Math.abs(Number(t.speed)||0)*7.2);
    const n=Math.max(0,Math.min(1,Number(t.speedNormalized)||0));
    speedValue.textContent=String(kmh);
    speedArcLive.style.strokeDasharray=(n*100).toFixed(1)+' 100';
    driveState.textContent=phase(t);
    boostState.dataset.on=String(!!t.boostActive);
    speedCluster.dataset.boost=String(!!t.boostActive);
  }
  if(radio){
    const r=radio.snapshot();
    radioTitle.textContent=r.title||'RADIO';
    radioPlay.textContent=r.playing?'Ⅱ':'▶';
    radioPlay.dataset.on=String(!!r.playing);
    radioVolume.value=String(Number.isFinite(r.volume)?r.volume:.45);
  }
  raf=requestAnimationFrame(paint);
}

function snapshot(){
  return JSON.parse(JSON.stringify({
    ...state,
    layout:{radio:'TOP_LEFT_OPEN_STRIP',speed:'BOTTOM_LEFT_OPEN_GAUGE',minimap:'BOTTOM_RIGHT_TRUE_ROUTE',almanac:'TOP_RIGHT_CARD_FAN',waypoint:'DORMANT_NO_DESTINATION_OWNER'},
    telemetry:lastTelemetry?{speed:lastTelemetry.speed,speedNormalized:lastTelemetry.speedNormalized,boostActive:lastTelemetry.boostActive,driftActive:lastTelemetry.driftActive}:null
  }));
}
window.__KFB_HUD_RACER_V2__={version:'2.0.0-clean-racer',snapshot,get ready(){return state.ready||!!state.error}};

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
    state.ready=true;failure.hidden=true;
  }catch(error){fail(error?.message||error)}
});
frame.src=hostUrl;
paint();
addEventListener('pagehide',()=>cancelAnimationFrame(raf));
