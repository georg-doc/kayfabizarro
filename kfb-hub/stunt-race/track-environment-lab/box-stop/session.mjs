import {loadSources,readSaved,writeSaved,clamp} from './sources.mjs';
import {vehicleFactory} from './vehicles.mjs';
import {createPitPresentation,createInstruments} from './presentation.mjs';
import {createRadio} from './radio.mjs';
const $=id=>document.getElementById(id);
const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export async function installBoxStop(port,environment){
  const source=await loadSources(),factory=vehicleFactory(source),pit=createPitPresentation(),hud=createInstruments(),saved=readSaved();
  const prefs=saved.vehicles||{},votes=saved.votes||{};let mode='drive',active=null,draft=null,requested='car-hatchback',loadToken=0,loading=false,counterElapsed=0,counterLast=0,toastTimer=0,radio=null,lastRadioTitle='',dragX=null,stageRect=null,failures=[];
  let reduced=!!saved.reducedMotion||matchMedia('(prefers-reduced-motion: reduce)').matches;
  const block=on=>{window.__KFB_BOX_BLOCK_INPUT__=on;port.box.pause(on||document.hidden)};
  document.body.insertAdjacentHTML('beforeend',`
    <div id="boxToast" role="status" hidden></div>
    <div class="driveStatus"><span id="boxDriving">Hatchback</span> · <span id="boxResponse">Deformer</span></div>
    <div id="radioControls" aria-label="Car radio"><button id="radioPlay">Play</button><button id="radioNext" title="Next track">Next</button><button id="radioMore" title="Radio settings">···</button><input id="radioVolume" type="range" min="0" max="1" step="0.01" value="0.45" aria-label="Music volume"></div>
    <section id="radioMorePanel" hidden><b>KFB Radio</b><p id="radioCatalogLabel" class="subtle">Repository jukebox · loading</p><select id="radioTrack" aria-label="Music track"></select><p id="radioState" class="subtle radioState">Ready · press Play</p><p class="subtle">Adaptive A1 soundscape: awaiting original source. No replacement synthesis is playing.</p><label class="subtle"><input id="reducedMotion" type="checkbox"> Steady instruments</label></section>
    <section id="boxOverlay" role="dialog" aria-modal="true" aria-labelledby="boxTitle" hidden>
      <header><div><div class="eyebrow">KFB / TEST GARAGE</div><h1 id="boxTitle">Box Stop</h1></div><span class="muted">Choose a shell. Take it for a lap.</span><button id="boxClose">Back to drive</button></header>
      <aside id="vehicleListPanel"><label class="heading" for="vehicleSearch">Vehicle collection</label><input id="vehicleSearch" type="search" placeholder="Find a vehicle…" autocomplete="off"><div id="vehicleList" role="listbox" aria-label="Vehicle candidates"></div><p class="subtle">43 source-backed candidates.<br>No driver rigs.</p><details class="sourceInfo"><summary>Unresolved source requests</summary><p>Space Base Bits: three original handoff requests remain outside this delivered 43-model set. No fabricated model paths.</p></details></aside>
      <div id="previewStage" aria-label="Vehicle preview; drag to rotate"><div id="previewCaption"><span>Drag to look around</span><span id="previewDims">—</span></div></div>
      <aside id="vehicleOptions"><h2 class="detailTitle" id="vehicleName">Hatchback</h2><div id="vehicleCollection" class="collectionLabel"></div>
        <div class="field"><label class="heading" for="motionProfile">Motion profile</label><select id="motionProfile"></select></div>
        <div class="field"><label class="heading">Visual response</label><div class="segmented"><button id="modeOriginal" aria-pressed="false">Original</button><button id="modeDeformer" aria-pressed="true">Deformer</button></div></div>
        <div class="field"><label class="heading" for="deformStrength">Deformer strength</label><div class="strength"><input id="deformStrength" type="range" min="0" max="1.5" step="0.05" value="1"><output id="strengthValue">100%</output></div></div>
        <div class="field"><label class="heading">Your shortlist</label><div class="segmented" id="votes"><button data-vote="keep">Keep</button><button data-vote="maybe">Maybe</button><button data-vote="reject">Reject</button></div></div>
        <p id="boxStatus" role="status">Loading the original vehicle…</p>
        <details class="sourceInfo"><summary>Source & comparison notes</summary><p id="sourceInfo"></p><p>Same v0.8 movement and contact proxy for every shell. Visual size classes are not individual collision or handling models.</p><p>Heavy and Mech profiles are unapproved starting values. No bend shader or rider skeleton is enabled.</p></details>
      </aside>
      <footer class="boxFooter"><button class="stepVehicle" id="previousVehicle" aria-label="Previous vehicle">←</button><button class="stepVehicle" id="nextVehicle" aria-label="Next vehicle">→</button><span class="subtle">Same route. Same handling. Your choice.</span><button id="exportSelection">Save shortlist</button><button id="testLap" disabled>Test Lap →</button></footer>
    </section>`);
  const boxButton=document.createElement('button');boxButton.id='boxOpen';boxButton.textContent='Box Stop';boxButton.title='Vehicle selection (B)';document.querySelector('.toolbar').insertBefore(boxButton,document.querySelector('.seedBox'));
  const compareButton=document.createElement('button');compareButton.id='compareMotion';compareButton.textContent='Deformer';compareButton.title='Compare original response (V)';document.querySelector('.toolbar').insertBefore(compareButton,boxButton);
  const labels={citybuilder:'KayKit · City Builder',poly:'Poly collection',karts:'Kenney · Karts',heavy:'Heavy vehicles',board:'Board & skate','car-kit-road':'Kenney · Road cars',toy:'Kenney · Toy cars',racing:'Kenney · Racing'};
  function persist(){if(!writeSaved({vehicles:prefs,votes,selected:active?.row.id,reducedMotion:reduced}))toast('Browser storage unavailable. Save shortlist to retain your choices.')}
  function toast(text){$('boxToast').textContent=text;$('boxToast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('boxToast').hidden=true,3500)}
  function drawList(){const query=$('vehicleSearch').value.toLowerCase().trim();let html='';for(const group of source.fixtures.GROUPS){const rows=group.rows.filter(r=>(r.label+' '+r.id+' '+labels[group.id]).toLowerCase().includes(query));if(!rows.length)continue;
      html+=`<div class="groupLabel">${escapeHtml(labels[group.id]||group.label)}</div>`+rows.map(r=>`<button class="vehicleRow" role="option" aria-selected="${r.id===requested}" data-vehicle="${escapeHtml(r.id)}"><span>${escapeHtml(r.label)}</span><small class="grade">${escapeHtml(votes[r.id]?.vote||'')}</small></button>`).join('')}
    $('vehicleList').innerHTML=html;$('vehicleList').querySelectorAll('[data-vehicle]').forEach(b=>b.onclick=()=>select(b.dataset.vehicle));
  }
  const profileOptions=Object.values(source.profiles).map(p=>`<option value="${p.id}">${escapeHtml(p.label)}${p.id.includes('FUTURE')?' · experimental':''}</option>`).join('');$('motionProfile').innerHTML=profileOptions;
  function updateDetails(vehicle){const i=vehicle.info();$('vehicleName').textContent=i.label;$('vehicleCollection').textContent=labels[i.group]||i.group;
    $('motionProfile').value=i.profile;$('deformStrength').value=i.strength;$('strengthValue').textContent=Math.round(i.strength*100)+'%';
    $('modeOriginal').setAttribute('aria-pressed',i.mode==='original');$('modeDeformer').setAttribute('aria-pressed',i.mode==='deformer');
    $('boxStatus').textContent=i.note;$('previewDims').textContent=i.dimensions.map(v=>v.toFixed(1)).join(' × ')+' m · visual';
    $('sourceInfo').textContent=i.sourcePath+'\nPin '+i.sourcePin.slice(0,10)+' · '+(i.wheelAnimation?i.measured.wheels+' rotating wheels':'shell only');
    $('votes').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',votes[i.id]?.vote===b.dataset.vote));
  }
  async function select(id){const token=++loadToken;requested=id;loading=true;$('testLap').disabled=true;$('boxStatus').textContent='Loading original source…';drawList();
    try{const candidate=await factory.load(id);if(token!==loadToken||mode!=='box'){candidate.dispose();return}
      candidate.configure(prefs[id]||{});const old=draft;draft=candidate;pit.mount(draft);old?.dispose();loading=false;updateDetails(draft);$('testLap').disabled=false;
    }catch(e){if(token!==loadToken)return;loading=false;failures.push({id,message:e.message});$('boxStatus').textContent='Could not load this candidate. The last valid vehicle is preserved. '+e.message;$('testLap').disabled=!draft;toast('Vehicle source failed; no model was replaced.');}
  }
  async function open(){if(mode==='box')return;mode='box';block(true);hud.counter('',0);$('labPanel').hidden=true;$('miniWrap').hidden=true;$('radioMorePanel').hidden=true;
    document.body.classList.add('body-box');$('boxOverlay').hidden=false;$('vehicleSearch').value='';stageRect=$('previewStage').getBoundingClientRect();
    requested=active?.row.id||'car-hatchback';drawList();$('boxClose').focus();await select(requested);
  }
  function close(){if(mode!=='box')return;loadToken++;pit.release();draft?.dispose();draft=null;mode='drive';block(false);document.body.classList.remove('body-box');$('boxOverlay').hidden=true;$('boxOpen').focus();$('gl').focus({preventScroll:true})}
  function changeConfig(patch){if(!draft||loading)return;draft.configure(patch);prefs[draft.row.id]={profile:draft.info().profile,mode:draft.info().mode,strength:draft.info().strength};updateDetails(draft);persist()}
  function driveLabel(){if(!active)return;const info=active.info();$('boxDriving').textContent=info.label;$('boxResponse').textContent=info.mode==='deformer'?'Deformer':'Original';$('compareMotion').textContent=info.mode==='deformer'?'Deformer':'Original'}
  function testLap(){if(!draft||loading)return;loadToken++;pit.release();const old=active;active=draft;draft=null;
    port.box.mount(active.root);port.box.setMode(active.info().mode);active.reset();old?.dispose();port.box.restart();mode='countdown';block(true);counterElapsed=0;counterLast=performance.now();
    document.body.classList.remove('body-box');$('boxOverlay').hidden=true;hud.counter('3',0);driveLabel();persist();$('gl').focus({preventScroll:true});
  }
  function compare(){if(mode!=='drive'||!active)return;active.configure({mode:active.info().mode==='deformer'?'original':'deformer'});port.box.setMode(active.info().mode);driveLabel();prefs[active.row.id]={profile:active.info().profile,mode:active.info().mode,strength:active.info().strength};persist()}
  const navigate=dir=>{const rows=source.fixtures.ALL;const i=rows.findIndex(r=>r.id===requested);select(rows[(i+dir+rows.length)%rows.length].id)};
  $('boxOpen').onclick=open;$('boxClose').onclick=close;$('testLap').onclick=testLap;$('compareMotion').onclick=compare;
  $('previousVehicle').onclick=()=>navigate(-1);$('nextVehicle').onclick=()=>navigate(1);$('vehicleSearch').oninput=drawList;
  $('motionProfile').onchange=e=>changeConfig({profile:e.target.value});$('deformStrength').oninput=e=>changeConfig({strength:+e.target.value});
  $('modeOriginal').onclick=()=>changeConfig({mode:'original'});$('modeDeformer').onclick=()=>changeConfig({mode:'deformer'});
  $('votes').querySelectorAll('button').forEach(b=>b.onclick=()=>{if(!draft||loading)return;votes[draft.row.id]={vote:b.dataset.vote,profile:draft.info().profile,strength:draft.info().strength,mode:draft.info().mode,sourcePath:draft.row.path,sourcePin:draft.row.pin};updateDetails(draft);drawList();persist()});
  $('exportSelection').onclick=()=>{const data={schema:'kfb.race-box-shortlist/1',build:'BOX1-20260918',votes,vehicles:prefs,environment:environment.snapshot().recipe,seed:environment.snapshot().seed,sourcePin:source.fixtures.SOURCES.handoff.commit,humanAcceptance:'Per-entry votes only; no global visual acceptance'};
    const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='KFB-vehicle-shortlist.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),5000)};
  $('previewStage').onpointerdown=e=>{dragX=e.clientX;e.currentTarget.setPointerCapture(e.pointerId)};
  $('previewStage').onpointermove=e=>{if(dragX===null)return;pit.rotate((e.clientX-dragX)*.009);dragX=e.clientX};
  $('previewStage').onpointerup=$('previewStage').onpointercancel=()=>dragX=null;
  function handleKey(e){if(e.code==='Escape'&&mode==='box'){e.preventDefault();close();return}if(e.code==='Tab'&&mode==='box'){
      const all=[...$('boxOverlay').querySelectorAll('button,input,select,summary,a[href]')].filter(el=>!el.disabled&&el.offsetParent!==null);const first=all[0],last=all.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}
  }
  window.__KFB_BOX_HANDLE_KEY__=handleKey;
  addEventListener('keydown',e=>{if(e.repeat||e.target.closest?.('input,select,textarea'))return;if(e.code==='KeyB'){e.preventDefault();open()}if(e.code==='KeyV'){e.preventDefault();compare()}});
  addEventListener('resize',()=>stageRect=$('previewStage').getBoundingClientRect());
  document.addEventListener('visibilitychange',()=>{counterLast=performance.now();port.box.pause(mode!=='drive'||document.hidden)});
  $('radioMore').onclick=()=>{$('radioMorePanel').hidden=!$('radioMorePanel').hidden};$('reducedMotion').checked=reduced;hud.setReduced(reduced);
  $('reducedMotion').onchange=e=>{reduced=e.target.checked;hud.setReduced(reduced);persist()};
  try{radio=await createRadio(i=>{lastRadioTitle=i.title;hud.setTitle(i.title);$('radioPlay').textContent=i.playing?'Pause':'Play';$('radioState').textContent=i.error|| (i.playing?'Playing · ':'Ready · ')+i.title;if($('radioTrack').options.length)$('radioTrack').value=String(i.index)});
    $('radioCatalogLabel').textContent=radio.snapshot().stageMode?`Repository jukebox · ${radio.tracks.length} tracks · RoadTrip v2 Stage`:`Repository jukebox · ${radio.tracks.length} tracks`;
    $('radioTrack').innerHTML=radio.tracks.map((t,i)=>`<option value="${i}">${escapeHtml(t.title)}</option>`).join('');$('radioTrack').onchange=e=>radio.choose(+e.target.value);
    $('radioPlay').onclick=()=>radio.toggle();$('radioNext').onclick=()=>radio.next();$('radioVolume').oninput=e=>radio.setVolume(+e.target.value);
  }catch(e){$('radioState').textContent='Jukebox source unavailable.';$('radioPlay').disabled=true;failures.push({component:'radio',message:e.message})}
  try{active=await factory.load(source.fixtures.ALL.some(r=>r.id===saved.selected)?saved.selected:'car-hatchback')}catch{active=await factory.load('car-hatchback')}
  active.configure(prefs[active.row.id]||{});port.box.mount(active.root);port.box.setMode(active.info().mode);driveLabel();
  port.box.onReset(()=>{active?.reset()});
  port.box.onFrame((dt,t)=>{
    active?.update(dt,t,mode==='drive'&&!document.hidden);
    if(mode==='countdown'&&!document.hidden){const now=performance.now();counterElapsed+=(now-counterLast)/1000;counterLast=now;const n=3-Math.floor(counterElapsed);hud.counter(n>0?String(n):'GO',counterElapsed%1);
      if(counterElapsed>=3.45){mode='drive';block(false);hud.counter('',0);toast('WASD / arrows · Q/E drift · Shift boost · Space jump · B Box Stop · V compare')}}
    hud.update(dt,t,document.activeElement?.closest?.('#radioControls,#radioMorePanel')||$('radioControls').matches(':hover'));
  });
  port.box.drawWith((renderer,draw,scene,camera)=>{if(mode==='box'){
      renderer.setClearColor('#171910',1);renderer.clear();pit.draw(renderer,draw,stageRect);
    }else{draw(scene,camera);hud.draw(renderer,draw)}});
  $('buildLabel').textContent='BOX1 · v0.8 + ENV1';
  window.__KFB_BOX__=Object.freeze({open,close,testLap,select,compare,snapshot:()=>({build:'BOX1-20260918',mode,loading,requested,active:active?.info(),draft:draft?.info(),count:source.fixtures.ALL.length,votes:structuredClone(votes),failures:structuredClone(failures),race:port.box.state(),host:port.box.diagnostics(),radio:radio?.snapshot(),instruments:hud.snapshot()}),
    // Existing source candidates; diagnostic access does not accept them for Georg.
    candidates:source.fixtures.ALL.map(r=>({id:r.id,label:r.label,sourcePath:r.path,pin:r.pin})),radio});
  window.__KFB_BOX_READY__=true;return window.__KFB_BOX__;
}
