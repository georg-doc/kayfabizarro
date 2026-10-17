const DEFAULTS={character:'rogue',muted:false};
const TYPE='kfb-legacy-web-pet';

function defaultStorage(){
  return {
    async get(){return DEFAULTS;},
    async set(){}
  };
}
function makeAudio(){
  let ctx=null;
  const rand=()=>crypto.getRandomValues(new Uint32Array(1))[0]/4294967296;
  function ensure(){ctx ||= new (window.AudioContext||window.webkitAudioContext)();ctx.resume?.();return ctx;}
  function tone(freq=440,to=220,dur=.12,type='triangle',amp=.055){
    const c=ensure(),now=c.currentTime,o=c.createOscillator(),g=c.createGain();
    o.type=type;o.frequency.setValueAtTime(freq,now);o.frequency.exponentialRampToValueAtTime(Math.max(40,to),now+dur);
    g.gain.setValueAtTime(amp,now);g.gain.exponentialRampToValueAtTime(.0001,now+dur);
    o.connect(g).connect(c.destination);o.start(now);o.stop(now+dur+.02);
  }
  function noise(){
    const c=ensure(),dur=.11,buf=c.createBuffer(1,Math.ceil(c.sampleRate*dur),c.sampleRate),a=buf.getChannelData(0);
    for(let i=0;i<a.length;i++)a[i]=(Math.random()*2-1)*(1-i/a.length);
    const s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();
    s.buffer=buf;f.type='bandpass';f.frequency.value=1000+rand()*1500;f.Q.value=1.3;g.gain.value=.035;
    s.connect(f).connect(g).connect(c.destination);s.start();
  }
  return ()=>{const n=Math.floor(rand()*3);if(n===0)tone(520,180,.13,'triangle');else if(n===1){tone(900,420,.08,'square',.03);tone(510,240,.12,'sine',.025);}else noise();};
}

export async function mountLegacyWebPet({
  frameSrc,
  storage=defaultStorage(),
  mode='web',
  debug=false
}={}){
  if(!frameSrc)throw new Error('LegacyWebPet frameSrc required');
  if(document.getElementById('kfb-legacy-web-pet-host'))return window.__KFB_LEGACY_WEB_PET__;

  const saved={...DEFAULTS,...await storage.get()};
  const host=document.createElement('div');
  host.id='kfb-legacy-web-pet-host';
  host.style.cssText='position:fixed;inset:0;z-index:2147483000;pointer-events:none;';
  const shadow=host.attachShadow({mode:'open'});
  shadow.innerHTML=`
<style>
:host{all:initial}
iframe{position:fixed;inset:0;width:100vw;height:100vh;border:0;background:transparent;pointer-events:none;z-index:1}
.hit{position:fixed;display:block;border:0;padding:0;margin:0;background:transparent;pointer-events:auto;cursor:pointer;z-index:3;border-radius:22px}
.hit.home{cursor:context-menu}
.panel{position:fixed;right:18px;bottom:178px;width:220px;padding:10px;background:#f1eadb;color:#171512;border:2px solid #171512;box-shadow:5px 6px 0 rgba(0,0,0,.22);font:12px/1.3 system-ui,sans-serif;pointer-events:auto;z-index:5}
.panel[hidden]{display:none}.panel strong{display:block;font:800 13px/1.1 Georgia,serif;margin-bottom:8px}.panel label{display:grid;gap:4px;margin:8px 0}.panel select,.panel button{font:700 12px system-ui;border:1px solid #171512;background:#fffdf6;color:#171512;padding:6px}.panel .row{display:flex;gap:8px;align-items:center}.panel .row label{display:flex;gap:6px;align-items:center;margin:0}.panel small{display:block;color:#5b554c;margin-top:7px}
${debug?'.hit{outline:1px dashed #e46d52;background:#e46d5210}':''}
</style>
<iframe title="KFB Legacy Web Pet" data-kfb-frame></iframe>
<button class="hit pet" aria-label="Legacy pet"></button>
<button class="hit home" aria-label="Legacy pet camp"></button>
<div class="panel" hidden>
  <strong>Legacy Web Pet</strong>
  <label>Character
    <select>
      <option value="rogue">Rogue</option>
      <option value="knight">Knight</option>
      <option value="mage">Mage</option>
      <option value="barbarian">Barbarian</option>
    </select>
  </label>
  <div class="row"><label><input type="checkbox" data-sound> Sound</label><button type="button" data-home>Go home</button></div>
  <small>Right-click pet or camp to open.</small>
</div>`;
  document.documentElement.appendChild(host);

  const frame=shadow.querySelector('iframe'),petHit=shadow.querySelector('.pet'),homeHit=shadow.querySelector('.home'),panel=shadow.querySelector('.panel');
  const select=shadow.querySelector('select'),sound=shadow.querySelector('[data-sound]'),goHome=shadow.querySelector('[data-home]');
  select.value=saved.character;sound.checked=!saved.muted;
  const sfx=makeAudio();

  const send=(type,payload={})=>frame.contentWindow?.postMessage({type:TYPE+':'+type,...payload},'*');
  const persist=async()=>storage.set({character:select.value,muted:!sound.checked});
  const setRect=(el,r,pad=0)=>{
    if(!r)return;
    const left=Math.max(0,r.left-pad),top=Math.max(0,r.top-pad),w=Math.max(18,r.width+pad*2),h=Math.max(18,r.height+pad*2);
    Object.assign(el.style,{left:left+'px',top:top+'px',width:w+'px',height:h+'px'});
  };
  const openPanel=e=>{e?.preventDefault?.();panel.hidden=false;};
  petHit.addEventListener('click',()=>{if(sound.checked)sfx();send('trigger');});
  petHit.addEventListener('contextmenu',openPanel);
  homeHit.addEventListener('contextmenu',openPanel);
  homeHit.addEventListener('click',()=>send('home'));
  select.addEventListener('change',async()=>{await persist();send('character',{character:select.value});panel.hidden=true;});
  sound.addEventListener('change',async()=>{await persist();send('muted',{muted:!sound.checked});});
  goHome.addEventListener('click',()=>{send('home');panel.hidden=true;});
  window.addEventListener('pointerdown',e=>{if(!panel.hidden&&!e.composedPath().includes(host))panel.hidden=true;},true);

  window.addEventListener('message',e=>{
    if(e.source!==frame.contentWindow||!e.data||typeof e.data.type!=='string'||!e.data.type.startsWith(TYPE+':'))return;
    const kind=e.data.type.slice(TYPE.length+1);
    if(kind==='bounds'){setRect(petHit,e.data.pet,8);setRect(homeHit,e.data.home,10);}
    if(kind==='ready'){
      document.documentElement.dataset.kfbLegacyWebPet='ready';
      document.documentElement.dataset.kfbLegacyWebPetCharacter=e.data.character||'';
      document.documentElement.dataset.kfbLegacyWebPetProps=(e.data.props||[]).join(',');
    }
    if(kind==='clip')document.documentElement.dataset.kfbLegacyWebPetLastClip=e.data.clip||'';
    if(kind==='error')document.documentElement.dataset.kfbLegacyWebPet='error';
  });

  frame.addEventListener('load',()=>{
    send('init',{character:select.value,muted:!sound.checked,hostname:location.hostname||'kfb-hub',mode});
  });
  frame.src=frameSrc;

  const api={
    host,frame,
    trigger(){if(sound.checked)sfx();send('trigger');},
    home(){send('home');},
    character(id){select.value=id;select.dispatchEvent(new Event('change'));},
    destroy(){host.remove();delete window.__KFB_LEGACY_WEB_PET__;}
  };
  window.__KFB_LEGACY_WEB_PET__=api;
  return api;
}
