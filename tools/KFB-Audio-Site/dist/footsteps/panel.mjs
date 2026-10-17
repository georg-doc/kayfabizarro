const panel=document.createElement('section');panel.id='footsteps';panel.className='panel';
panel.innerHTML=`<div class="eyebrow">FOOTSTEPS R2 · V-430 · SOURCE 0.7.3</div><h2>Soft steps</h2><div class="foot-layout"><div><div id="footCanvas" style="max-width:640px;overflow:hidden"></div><p id="footLast" class="tiny"></p></div><div>
<p><button class="btn primary" id="footPlay">Play steps</button> <button class="btn" id="footStop" disabled>Stop steps</button> <button class="btn" id="footLoad">Inspect figure · silent</button></p>
<label>Movement <select id="footGait"><option value="idle">Idle</option><option value="walk" selected>Walk</option><option value="run">Run</option></select></label>
<label>Surface <select id="footSurface"><option value="sand">Sand</option><option value="stone">Stone</option><option value="wood">Wood</option><option value="wet-clay" selected>Wet clay</option></select></label>
<label>Walking tempo <select id="footTempo"><option value="0.9">Relaxed · 1.69 steps/s</option><option value="1" selected>Natural · 1.88 steps/s</option><option value="1.15">Brisk · 2.16 steps/s</option></select></label>
<label>Figure <select id="footFigure"><option value="Medium">KayKit · Medium</option><option value="Large">KayKit · Large</option></select></label>
<p><button class="btn" id="footJump" disabled>Hop · support landing</button> <button class="btn" id="footDemo">Record 16 s proof</button> <button class="btn" id="footRecord" disabled>Record / finish clip</button></p>
<p><button class="btn" id="footReset">Reset measurements</button> <button class="btn" id="footExport">Download measurements</button></p>
<p id="footStatus" role="status">Press Play. Quiet start; no music is started or replaced.</p><p id="footMetrics" class="tiny"></p></div></div>
<video id="footVideo" controls hidden style="width:min(640px,100%)"></video><a id="footClipDownload" hidden>Download audible motion clip</a>
<details><summary>Contact and control evidence</summary><pre id="footDiagnostics" style="max-height:420px;overflow:auto;white-space:pre-wrap"></pre></details>
<p class="tiny">Five unique CC0 donors per surface, ±3% pitch variation, soft attack. Sand and wet-clay are processed snow/grass foley interpretations, not original clay recordings. One existing AudioContext / PLAYER_CRITICAL bus. Music and TTS ducking unchanged. <a href="./footsteps/LICENCES.md">Sources & licences</a>.</p>
<p class="tiny"><a href="./footsteps/proof/footsteps-r2.mp4">Watch R2 · four surfaces with sound</a> · <a href="./footsteps/proof/footsteps-r2.wav">Hear R2</a> · <a href="./footsteps/proof/footsteps-r2-fixture.json">Recorded measurements</a></p>`;
document.getElementById('mix').append(panel);
const style=document.createElement('style');style.textContent='.foot-layout{display:flex;gap:20px;flex-wrap:wrap}.foot-layout>div{flex:1;min-width:280px}#footCanvas canvas{width:100%!important;height:auto!important;display:block}#footsteps label{display:block;margin:12px 0}#footsteps select{max-width:100%;margin-left:8px}';document.head.append(style);
let modulePromise;
const module=()=>modulePromise??=import('./preview.mjs').catch(e=>{modulePromise=null;throw e;});
for(const [id,action] of [['footPlay','play'],['footStop','stop'],['footLoad','inspect'],['footJump','jump'],['footDemo','demo'],['footRecord','record'],['footReset','reset'],['footExport','export']]){
 document.getElementById(id).onclick=async()=>{try{
 const host=['play','demo'].includes(action)?window.KFBAudioSite.resume():null;
 await (await module()).command(action,host);
 }catch(e){document.getElementById('footStatus').textContent='Unable to start: '+e.message;document.getElementById('footPlay').disabled=false;}};
}
for(const id of ['footGait','footSurface','footTempo','footFigure'])document.getElementById(id).onchange=async()=>{try{await(await module()).command('change',id);}catch(e){document.getElementById('footStatus').textContent=e.message;}};
if(location.hash==='#footsteps'){document.querySelector('[data-view="mix"]').click();panel.scrollIntoView();}

