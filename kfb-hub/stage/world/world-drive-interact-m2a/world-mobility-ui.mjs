export function mountWorldMobilityUi({clay,mobility}){
  const root=document.createElement('div');root.id='m1-ui';root.innerHTML=`
    <div id="m1-bar"><div class="m1-cluster" aria-label="Bewegung"><button id="m1-ground" aria-pressed="true">Zu Fuß</button><button id="m1-drive" aria-pressed="false">Auto</button><button id="m1-flight" aria-pressed="false">Flug</button></div><div class="m1-cluster" aria-label="Ansicht"><button id="m1-original" aria-pressed="true">Original</button><button id="m1-clay" aria-pressed="false">Knete</button><button id="m1-info" aria-label="Info">ⓘ</button></div></div>
    <section id="m1-help" hidden><h1>World Drive M2A</h1><p>Zu Fuß, Auto und Flug in derselben Hürth-Welt. Gelände und Gebäude bleiben Eigentum der World; das Auto nutzt die bewährte Fahrphysik aus Race PR #10.</p><h2>Steuerung</h2><p><b>Zu Fuß:</b> W/S laufen · A/D drehen · Q/R seitlich · E ins Auto · Shift rennen · 1× Leertaste springen · 2× innerhalb 400 ms abheben.</p><p><b>Auto:</b> W/S fahren · A/D lenken · Q/R driften · B bremsen · Shift Schub · Leertaste springen · E aussteigen.</p><p><b>Flug:</b> W beschleunigen · S bremsen · A/D steuern · Leertaste/C Höhe · Shift Schub.</p><h2>KlayfaBizarro-Look</h2><p>Der Knete-Modus nutzt direkt das akzeptierte Hirnwelt-H0-Relief und -Material. Kollision und Bewegung bleiben unverändert.</p><h2>Verwendete Quellen</h2><p><code>World r2 · 58028b07</code><br><code>Race PR #10 · 406cd26f</code><br><code>Vehicle Deformer · f30b719a</code><br><code>Travel Modes PR #39 · e10a9775</code><br><code>Hirnwelt H0 · 2026-09-27</code></p><p id="m1-state"></p></section>
    <div id="m1-hint">W/S laufen · E ins Auto · 1× springen · 2× abheben</div>`;
  document.body.appendChild(root);
  const $=id=>root.querySelector('#'+id),buttons={ground:$('m1-ground'),drive:$('m1-drive'),flight:$('m1-flight'),original:$('m1-original'),clay:$('m1-clay')},hint=$('m1-hint'),help=$('m1-help'),state=$('m1-state');
  function pressed(group,key){for(const k of group)buttons[k].ariaPressed=String(k===key)}
  function setMobility(next){if(next==='drive')mobility.interact({source:'World Mobility UI'});else mobility.setMode(next,{source:'World Mobility UI'});paint()}
  function setLook(next){clay.setMode(next);paint()}
  function paint(){
    const r=mobility.report(),flying=mobility.mode==='flight',driving=mobility.mode==='drive';pressed(['ground','drive','flight'],flying?'flight':driving?'drive':'ground');pressed(['original','clay'],clay.mode==='clay'?'clay':'original');
    hint.textContent=flying?'Flug · W Gas · S Bremse · A/D steuern · Leertaste/C Höhe':driving?'Auto · W/S fahren · A/D lenken · Q/R Drift · E aussteigen':r.interaction.available?'E · '+(r.interaction.target?.label||'interact'):'W/S laufen · A/D drehen · 1× springen · 2× abheben';
    state.textContent=`Aktuell: ${flying?'Flug':driving?'Auto':'zu Fuß'} · ${clay.mode==='clay'?'Clay':'Original'} · ${driving?r.drive.speedKmh+' km/h':flying?r.flight.speed+' m/s':'Ground'}`;
  }
  buttons.ground.onclick=()=>setMobility('ground');buttons.drive.onclick=()=>setMobility('drive');buttons.flight.onclick=()=>setMobility('flight');buttons.original.onclick=()=>setLook('original');buttons.clay.onclick=()=>setLook('clay');$('m1-info').onclick=()=>{help.hidden=!help.hidden;paint()};
  addEventListener('kfb-world-mobility',paint);
  addEventListener('keydown',e=>{const tag=String(e.target?.tagName||'').toLowerCase();if(tag==='input'||tag==='textarea'||tag==='select')return;if(e.code==='KeyF'){e.preventDefault();setMobility(mobility.mode==='flight'?'ground':'flight')}if(e.code==='KeyL'){e.preventDefault();setLook(clay.mode==='clay'?'original':'clay')}},{capture:true});
  if(new URLSearchParams(location.search).get('mode')==='flight')setMobility('flight');paint();
  return {setMobility,setLook,paint,root};
}
