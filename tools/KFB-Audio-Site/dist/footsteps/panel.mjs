const panel=document.createElement('section');panel.id='footsteps';panel.className='panel';
panel.innerHTML=`<div class="eyebrow">FOOTSTEPS · KONTAKTKORREKTUR · SOURCE 0.7.6</div><h2>Schritte · Soft steps</h2><p>Start: <strong>Play steps</strong>. Ende: <strong>Stop steps</strong>. Musik und Prüf-Funktionen brauchst du dafür nicht.</p><div class="foot-layout"><div><div id="footCanvas" style="max-width:640px;overflow:hidden"></div><p id="footLast" class="tiny"></p></div><div>
<p><button class="btn primary" id="footPlay">Play steps</button> <button class="btn" id="footStop" disabled>Stop steps</button> <button class="btn" id="footLoad">Inspect figure · silent</button></p>
<label>Movement <select id="footGait"><option value="idle">Idle</option><option value="walk" selected>Walk</option><option value="run">Run</option></select></label>
<label>Untergrund <select id="footSurface"><optgroup label="Cozy"><option value="wood" selected>Wood · Cozy-Standard</option><option value="carpet-wood">Teppich auf Holz · Versuch</option></optgroup><optgroup label="Bisherige Böden"><option value="sand">Sand · weich</option><option value="stone">Stone</option><option value="wet-clay">Gras / Lehm · leiser</option></optgroup><optgroup label="Neue Foley-Aufnahmen · je 4 Varianten"><option value="foley-carpet">Teppich · Foley</option><option value="foley-concrete">Beton · Foley</option><option value="foley-gravel">Kies · Foley</option><option value="foley-vinyl">Vinyl · Foley</option></optgroup><optgroup label="Digital · je 4 Varianten"><option value="digital-grass">Gras · Digital</option><option value="digital-gravel">Kies · Digital</option><option value="digital-snow">Schnee · Digital</option><option value="digital-wood">Holz · Digital</option></optgroup></select></label>
<p class="tiny">Ein Fußkontakt = ein Klang. Die Varianten wechseln automatisch, ohne direkte Wiederholung; sie laufen nie als Schritt-Loop.</p><p><button class="btn" id="footCreak">Knarren · einzelner Akzent</button></p>
<label>Walking tempo <select id="footTempo"><option value="0.9">Relaxed · 1.69 steps/s</option><option value="1" selected>Natural · 1.88 steps/s</option><option value="1.15">Brisk · 2.16 steps/s</option></select></label>
<label>Figure <select id="footFigure"><option value="Medium">KayKit · Medium</option><option value="Large">KayKit · Large</option></select></label>
<p><button class="btn" id="footJump" disabled>Hop · support landing</button> <button class="btn" id="footDemo">Record 16 s proof</button> <button class="btn" id="footRecord" disabled>Record / finish clip</button></p>
<p><button class="btn" id="footReset">Reset measurements</button> <button class="btn" id="footExport">Download measurements</button></p>
<p id="footStatus" role="status">Press Play. Quiet start; no music is started or replaced.</p><p id="footMetrics" class="tiny"></p></div></div>
<video id="footVideo" controls hidden style="width:min(640px,100%)"></video><a id="footClipDownload" hidden>Download audible motion clip</a>
<details><summary>Contact and control evidence</summary><pre id="footDiagnostics" style="max-height:420px;overflow:auto;white-space:pre-wrap"></pre></details>
<p class="tiny">Wood bleibt die Klangreferenz. Neue Foley-/Digital-Gruppen: Chequered Ink, eigene kommerzielle Nutzungslizenz (nicht CC0). Teppich auf Holz ist eine Bearbeitung der Wood-Dateien. Ein bestehender AudioContext / PLAYER_CRITICAL-Bus; Musik und Ducking unverändert. <a href="./footsteps/LICENCES.md">Quellen &amp; Lizenzen</a> · <a href="./footsteps/CONSUMER.md">Spiel-Anschluss</a>.</p>
<p class="tiny"><a href="./footsteps/proof/wood-carpet.mp4">Wood / Teppich · aktueller Vergleich mit Ton</a> · <a href="./footsteps/proof/wood-carpet-fixture.json">Kontaktmessungen</a>. Ältere Aufnahmen sind kein aktueller Synchronitätsnachweis.</p>`;
document.getElementById('mix').append(panel);
const style=document.createElement('style');style.textContent='.foot-layout{display:flex;gap:20px;flex-wrap:wrap}.foot-layout>div{flex:1;min-width:280px}#footCanvas canvas{width:100%!important;height:auto!important;display:block}#footsteps label{display:block;margin:12px 0}#footsteps select{max-width:100%;margin-left:8px}';document.head.append(style);
let modulePromise;
const module=()=>modulePromise??=import('./preview.mjs?v=0.7.6').catch(e=>{modulePromise=null;throw e;});
for(const [id,action] of [['footPlay','play'],['footStop','stop'],['footLoad','inspect'],['footJump','jump'],['footDemo','demo'],['footRecord','record'],['footReset','reset'],['footExport','export'],['footCreak','creak']]){
 document.getElementById(id).onclick=async()=>{try{
 const host=['play','demo','creak'].includes(action)?window.KFBAudioSite.resume():null;
 await (await module()).command(action,host);
 }catch(e){document.getElementById('footStatus').textContent='Unable to start: '+e.message;document.getElementById('footPlay').disabled=false;}};
}
for(const id of ['footGait','footSurface','footTempo','footFigure'])document.getElementById(id).onchange=async()=>{try{await(await module()).command('change',id);}catch(e){document.getElementById('footStatus').textContent=e.message;}};
if(location.hash==='#footsteps'){document.querySelector('[data-view="mix"]').click();panel.scrollIntoView();}


const shortcut=document.createElement('button');shortcut.id='footShortcut';shortcut.textContent='Schritte';document.querySelector('nav.tabs').append(shortcut);
function openSteps(){document.querySelector('[data-view="mix"]').click();panel.scrollIntoView({block:'start'});history.replaceState(null,'','#footsteps');}
shortcut.onclick=openSteps;window.addEventListener('hashchange',()=>{if(location.hash==='#footsteps')openSteps();});

