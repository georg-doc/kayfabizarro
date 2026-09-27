export function mountC0Ui({track,clay,flight}){
  const root=document.createElement('div');root.id='c0-ui';root.innerHTML=`
    <div id="c0-bar"><div class="c0-cluster" aria-label="Bewegung"><button id="c0-walk" aria-pressed="true">Zu Fuß</button><button id="c0-flight" aria-pressed="false">Flug</button></div><div class="c0-cluster" aria-label="Ansicht"><button id="c0-original" aria-pressed="true">Original</button><button id="c0-clay" aria-pressed="false">Clay</button><button id="c0-info" aria-label="Info und Status">ⓘ</button></div></div>
    <section id="c0-help" hidden><h1>World · Flight · Clay C0</h1><p>Eine Welt, zwei Bewegungsarten und ein reversibler Look-Vergleich. Keine zweite Welt- oder Kamera-Engine.</p><h2>Steuerung</h2><p><b>Zu Fuß:</b> W/S laufen · A/D drehen · Q/E seitlich · Shift rennen · Leertaste springen.</p><p><b>Flug:</b> WASD bewegen · Leertaste/C Höhe · Shift schneller · ziehen zum Umschauen.</p><h2>Was hier geprüft wird</h2><ul><li>OSM-Hürth als begeh- und überfliegbare Welt</li><li>ein vorhandenes ST01-Track-Rezept mit echten Ein-/Ausgangsankern</li><li>Clay-Richtung für Terrain, Straße, Bürgersteig, Bordsteine und Gebäude</li></ul><h2>Quelle</h2><p><code>World r2 · 58028b07</code><br><code>ClayBound C1 · e1f69334</code><br><code>ST01 · ${track.source.revision}</code></p><p id="c0-state"></p></section>
    <div id="c0-hint">Zu Fuß · W/S laufen · A/D drehen · Leertaste springen</div>`;
  document.body.appendChild(root);
  const $=id=>root.querySelector('#'+id),buttons={walk:$('c0-walk'),flight:$('c0-flight'),original:$('c0-original'),clay:$('c0-clay')},hint=$('c0-hint'),help=$('c0-help'),state=$('c0-state');
  function pressed(group,key){for(const k of group)buttons[k].ariaPressed=String(k===key)}
  function mobility(m){flight.setMode(m);hint.textContent=m==='flight'?'Flug · WASD bewegen · Leertaste/C Höhe · Shift schneller · ziehen zum Umschauen':'Zu Fuß · W/S laufen · A/D drehen · Leertaste springen';pressed(['walk','flight'],m);paint()}
  function look(m){clay.setMode(m);pressed(['original','clay'],m);paint()}
  function paint(){state.textContent=`Aktuell: ${flight.mode==='flight'?'Flug':'zu Fuß'} · ${clay.mode==='clay'?'Clay':'Original'} · Track ${track.source.revision}`}
  buttons.walk.onclick=()=>mobility('walk');buttons.flight.onclick=()=>mobility('flight');buttons.original.onclick=()=>look('original');buttons.clay.onclick=()=>look('clay');$('c0-info').onclick=()=>{help.hidden=!help.hidden;paint()};
  addEventListener('keydown',e=>{const tag=String(e.target?.tagName||'').toLowerCase();if(tag==='input'||tag==='textarea'||tag==='select')return;if(e.code==='KeyF'){e.preventDefault();mobility(flight.mode==='flight'?'walk':'flight')}if(e.code==='KeyL'){e.preventDefault();look(clay.mode==='clay'?'original':'clay')}},{capture:true});
  if(new URLSearchParams(location.search).get('mode')==='flight')mobility('flight');if(clay.mode==='clay')pressed(['original','clay'],'clay');paint();
  return {mobility,look,paint,root};
}
