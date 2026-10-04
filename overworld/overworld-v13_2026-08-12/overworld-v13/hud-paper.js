/* KFB Overworld — HUD auf Papier (V4-S4, hud-v4.2).
   Jetzt mit den RICHTIGEN Teilen: Tiny Swords **Free Pack → UI Elements** (Papier mit
   Schriftrollen-Kanten, Wood Table, Big/Small Ribbons in fünf Farben, Live Bars, Square/Round
   Buttons). Drei Regeln, aus denen alles folgt:
     1. **1:1 oder halbieren, nie dazwischen.** Die Blätter sind 320/448 px; wir zeichnen sie auf
        0,5 (ganzzahliger Nearest-Neighbour-Schnitt) — deshalb sind auch die Slice-Werte halbiert.
     2. **Mehrfarbige Bögen werden geschnitten, nicht gestreckt.** Ribbons und Swords liegen als
        fünf Bänder übereinander; der Slicer holt ein Band heraus und macht daraus eine eigene
        Grafik (Data-URL). Ohne das dehnt `border-image` immer den ganzen Bogen.
     3. **Papier kachelt, es dehnt nicht.** Mitte und Kanten mit `round`, sonst zieht die Faser.
   Dazu der Schüttler: `OW_HUD.shake(el|'panel', wucht)` — die Fläche reagiert auf Einschläge
   (Georgs „Welt als Spielzeug"). Der Runner ruft `OW_HUD.install(game, shadowRoot)`. */
(function(){
'use strict';
/* Die UI-Teile und der 9-Teil-Composer wohnen seit V5-S2 in `overworld/paper-atlas.js` —
   dieselbe Liste stand hier UND im Asset-Browser, und eine Liste an zwei Orten ist eine zu viel
   (Falle 7, Session-Cut v4). Fehlt das Modul, läuft das HUD weiter: BASE bringt Rückfallfarben mit,
   angezogen wird dann nichts. Auf „läuft" gaten, nie auf „existiert". */
const PA=window.OW_PAPER;
if(!PA)console.warn('[hud] paper-atlas.js fehlt — HUD läuft mit Rückfallfarben, ohne Papier');
const SHEETS=PA?PA.SHEETS:{};
function loadSheets(){return PA?PA.load():Promise.resolve({});}

/* Wer bekommt welches Teil. row = Farbband. Kleine Knöpfe und Icons sind Einzelstücke (plain). */
const DRESS=[
  {sel:'.panel',sheet:'paper'},
  {sel:'.beats',sheet:'paper'},
  {sel:'.settings',sheet:'banner'},
  {sel:'.diary',sheet:'banner'},
  {sel:'.after',sheet:'banner'},
  {sel:'.lvup .box',sheet:'banner'},
  {sel:'.cap .box',sheet:'banner'},
  {sel:'.tools',sheet:'table'},
  {sel:'.settings button.sw',sheet:'btnBlue'},
  {sel:'.settings button.sw.off',sheet:'btnRed'},
  {sel:'.diary button',sheet:'btnBlue'},
  {sel:'.after .row button',sheet:'btnBlue'},
  {sel:'.lvup button',sheet:'btnBlue'},
  {sel:'.cap .opts button',sheet:'btnBlue'},
  {sel:'.cap .ok',sheet:'btnBlue'},
  {sel:'.hint',sheet:'smallRib',row:1},
  {sel:'.zone',sheet:'smallRib',row:2},
  {sel:'.prompt',sheet:'smallRib',row:0},
  {sel:'.panel .bar',sheet:'barBase'},
];
const PLAIN=[
  {sel:'.tools button',sheet:'sqBlue'},
  {sel:'.tools button.red',sheet:'sqRed'},
  {sel:'.kf .slot.on',sheet:'sqBlue'},
];
function iconCss(p){
  const bg=(sel,k)=>p[k]?sel+'{background-image:url('+p[k].cv.toDataURL('image/png')+')}':'';
  return [bg('.settings .close','icoClose'),bg('.tools .gear i','icoGear'),
    bg('.tools .hbtn i','icoHelp'),bg('.settings .row[data-r="sound"] .ico','icoSound'),
    bg('.settings .row[data-r="jukebox"] .ico,.settings .row[data-r="drones"] .ico','icoLock')]
    .filter(Boolean).join('\n');
}
/* Wer welches Teil bekommt, ist HUD-Sache und bleibt hier; gemalt wird im paper-atlas. */
function dress(sh,parts){
  if(!PA)return;
  PA.dress(sh,DRESS,parts);
  PA.dress(sh,PLAIN.map(x=>Object.assign({plain:true},x)),parts);
}

const SETTINGS_HTML=`
  <h4><span>SETTINGS</span><button class="close" title="close (Esc)"></button></h4>
  <div class="rows">
    <div class="row" data-r="sound"><span class="ico"></span>
      <span class="k">Sound<em>SFX and the ring announcer</em></span>
      <button class="sw" data-a="sound">ON</button></div>
    <div class="row" data-r="help"><span class="ico"></span>
      <span class="k">Controls<em>the key list at the bottom · H</em></span>
      <button class="sw" data-a="help">OFF</button></div>
    <div class="sep"></div>
    <div class="row" data-r="jukebox"><span class="ico"></span>
      <span class="k">Jukebox<em>waits for the music slice</em></span>
      <button class="sw" disabled>LOCKED</button></div>
    <div class="row" data-r="drones"><span class="ico"></span>
      <span class="k">Drones<em>ambient beds, same slice</em></span>
      <button class="sw" disabled>LOCKED</button></div>
    <div class="sep"></div>
    <div class="row"><span class="k"><b>BUILD</b></span></div>
    <div class="txt" data-r="build">—</div>
    <div class="sep"></div>
    <div class="row"><span class="k"><b>BIOME</b></span></div>
    <div class="txt" data-r="biome">—</div>
    <div class="sep"></div>
    <div class="row"><span class="k"><b>COLLECTION</b></span></div>
    <div class="txt" data-r="collection">—</div>
    <div class="sep"></div>
    <div class="row" data-r="diary">
      <span class="k">Journey diary<em>open the record · J</em></span>
      <button class="sw" data-a="diary">OPEN</button></div>
    <div class="row" data-r="overview">
      <span class="k">Island overview<em>pins and fast travel · M</em></span>
      <button class="sw" data-a="overview">OPEN</button></div>
  </div>`;

function fonts(){
  if(document.getElementById('ow-hud-fonts'))return;
  const l=document.createElement('link');
  l.id='ow-hud-fonts';l.rel='stylesheet';
  l.href='https://fonts.googleapis.com/css2?family=Special+Elite&family=Irish+Grover&display=swap';
  document.head.appendChild(l);
}

/* Grundgerüst: Lage, Schrift, Rückfallfarben. Läuft sofort, auch ohne Netz. */
const BASE=`
  :host{--ink:#2a1f16;--ink2:#5c4630;--rust:#8a2114;--gold:#6b4413;--paper:#dcc39c;
    --stat-fluff:#8a2114;--stat-kayfabe:#1f4f8f;--stat-bizarro:#6b4413;}
  .panel,.beats,.settings,.diary,.after,.lvup .box,.cap .box,.tools{
    background-color:#dcc39c;color:var(--ink);border-radius:0;image-rendering:pixelated}
  .panel{width:auto;min-width:250px;padding:16px 18px;margin:0;font-size:12px;position:static}
  .panel .lbl{font-family:"Special Elite",monospace;font-size:10px;letter-spacing:1.6px;color:var(--ink2);margin-bottom:3px}
  .panel .bar{height:32px;border-radius:0;background:transparent;box-shadow:none;position:relative;overflow:hidden}
  .panel .bar i{position:absolute;left:14px;right:14px;top:11px;bottom:11px;transform-origin:left;background:#b3341f}
  .panel .bar.xp i{background:#2f6ea8}
  .panel .bar u{display:none}
  .panel .bar span{position:absolute;inset:0;text-align:center;font-family:"Special Elite",monospace;
    font-size:10px;line-height:32px;color:#f7ecd4}
  .panel .lv{font-family:"Irish Grover",cursive;font-size:15px;color:var(--rust);letter-spacing:.5px}
  .panel .stats,.panel .pool{font-family:"Special Elite",monospace}
  .panel .pool{color:var(--ink2);font-size:10.5px}
  .kf{gap:8px}
  .kf .slot{width:56px;height:52px;border:0;border-radius:0;color:#fdf6e6;font-size:10px;
    background-color:#7d7566;padding:10px 0 0;line-height:1.15;position:relative;
    display:flex;flex-direction:column;align-items:center;justify-content:center;box-sizing:border-box;
    image-rendering:pixelated;overflow:hidden}
  .kf .slot.on{background-color:#3d6f8c;cursor:pointer}
  .kf .slot.spent{opacity:.55}
  .kf .slot em{font-size:9px;opacity:.9;letter-spacing:.6px}
  .kf .slot .rr{position:absolute;top:3px;left:5px;right:5px;height:8px;box-sizing:border-box;
    border:2px solid #f4e8cf}
  .beats{position:absolute;left:14px;bottom:82px;width:min(38vw,430px);max-height:28vh;
    padding:18px 20px 16px;display:flex;flex-direction:column;pointer-events:auto;z-index:3}
  .beats .ttl{font-family:"Special Elite",monospace;font-size:9.5px;letter-spacing:1.8px;
    color:var(--ink2);margin:0 0 5px}
  .log{position:static;display:flex;flex-direction:column;gap:4px;overflow-y:auto;
    font-family:"Special Elite",monospace;font-size:12.5px;color:var(--ink);text-shadow:none;
    padding-right:4px;min-height:0;scrollbar-width:thin;scrollbar-color:#8a7052 transparent}
  .log div{background:none;padding:0 0 3px;border-bottom:1px solid rgba(90,70,48,.3);max-width:none}
  .log div:last-child{color:var(--rust)}
  .tools{position:absolute;right:14px;top:12px;display:flex;gap:10px;padding:16px 18px;z-index:4}
  .tools button{width:44px;height:44px;border:0;padding:0;cursor:pointer;background-color:#3d6f8c;
    image-rendering:pixelated;display:flex;align-items:center;justify-content:center}
  .tools button.red{background-color:#a8402d}
  .tools button i{display:block;width:24px;height:24px;background:center/contain no-repeat;image-rendering:pixelated}
  .settings{position:absolute;right:14px;top:84px;width:min(88vw,392px);max-height:calc(100% - 120px);
    display:none;flex-direction:column;padding:40px 42px 36px;z-index:6;overflow:hidden}
  .settings h4{margin:0 0 10px;font-family:"Irish Grover",cursive;font-size:18px;color:var(--rust);
    letter-spacing:.6px;display:flex;justify-content:space-between;align-items:center}
  .settings .close{width:28px;height:28px;border:0;cursor:pointer;background:center/contain no-repeat;
    image-rendering:pixelated;background-color:transparent}
  .settings .rows{overflow-y:auto;display:flex;flex-direction:column;gap:8px;min-height:0;
    scrollbar-width:thin;scrollbar-color:#8a7052 transparent}
  .settings .row{display:flex;align-items:center;gap:10px;font-family:"Special Elite",monospace;
    font-size:12px;color:var(--ink)}
  .settings .row .k{flex:1;line-height:1.25}
  .settings .row .k em{font-style:normal;display:block;font-size:10.5px;color:var(--ink2)}
  .settings .row .ico{width:26px;height:26px;background:center/contain no-repeat;image-rendering:pixelated;flex:none}
  .settings button.sw{font-family:"Special Elite",monospace;font-size:11px;color:#f7ecd4;cursor:pointer;
    min-width:84px;height:40px;border:0;padding:0 8px;background-color:#3d6f8c;image-rendering:pixelated}
  .settings button.sw.off{background-color:#a8402d}
  .settings button.sw:disabled{background-color:#7d7566;cursor:default;color:#eee3cd}
  .settings .txt{font-family:"Special Elite",monospace;font-size:11.5px;color:var(--ink2);line-height:1.45}
  .settings .sep{height:1px;background:rgba(90,70,48,.32);margin:3px 0}
  .zone,.prompt,.hint{background-color:transparent;background-repeat:no-repeat;border:0;border-radius:0;
    font-family:"Special Elite",monospace;padding:0 40px;height:32px;
    display:none;align-items:center;justify-content:center;text-align:center;image-rendering:pixelated}
  .zone{color:#3a2a16;bottom:84px}
  .zone b{color:var(--rust)}
  .prompt{color:#f2f7fa;bottom:150px}
  .hint{color:#f7ecd4;left:50%;transform:translateX(-50%);bottom:12px;font-size:11.5px;
    max-width:min(96vw,940px);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .diary,.after,.lvup .box,.cap .box{color:var(--ink);border:0}
  .diary{right:14px;top:84px;padding:34px 36px}
  .diary h4,.after h3{color:var(--rust);border-bottom:1px solid rgba(90,70,48,.32);
    font-family:"Irish Grover",cursive;letter-spacing:.4px;padding:0 0 6px;margin:0 0 8px}
  .after{padding:38px 40px}
  .diary .rep,.diary ul,.diary .row,.after .body,.after .row{border-color:rgba(90,70,48,.32);
    padding-left:0;padding-right:0}
  .diary li,.after .hof div{border-bottom:1px solid rgba(90,70,48,.26)}
  .diary li i,.after .hof i,.diary .rep span,.after h3 em,.after .hof h5{color:var(--ink2)}
  .diary ul,.after .body{font-family:"Special Elite",monospace}
  .diary button,.after .row button,.lvup button,.cap .opts button,.cap .ok{
    font-family:"Special Elite",monospace;color:#f7ecd4;background-color:#3d6f8c;border:0;cursor:pointer;
    image-rendering:pixelated;border-radius:0;padding:14px 16px}
  .lvup h3,.cap h3{font-family:"Irish Grover",cursive;color:var(--rust)}
  .lvup p,.cap p{color:var(--ink2);font-family:"Special Elite",monospace}
  .lvup .box,.cap .box{padding:38px 42px}
  .cap input{background:#f0e2c6;color:var(--ink);border:2px solid #8a7052;border-radius:0;
    font-family:"Special Elite",monospace}
  .pill{font-family:"Special Elite",monospace;background:rgba(42,31,22,.62);color:#e6d8bd;
    top:auto;bottom:12px;right:14px;z-index:2}
  @keyframes owShake{
    0%{transform:translate(0,0) rotate(0)}
    18%{transform:translate(calc(var(--sx,3px)*-1),var(--sy,2px)) rotate(-.35deg)}
    38%{transform:translate(var(--sx,3px),calc(var(--sy,2px)*-1)) rotate(.3deg)}
    58%{transform:translate(calc(var(--sx,3px)*-.6),calc(var(--sy,2px)*.5)) rotate(-.18deg)}
    78%{transform:translate(calc(var(--sx,3px)*.4),calc(var(--sy,2px)*-.3)) rotate(.1deg)}
    100%{transform:translate(0,0) rotate(0)}}
  .owShake{animation:owShake .32s cubic-bezier(.36,.07,.19,.97) both}
  @media (max-width:760px){
    .panel{min-width:0;width:220px;font-size:11px;padding:14px 15px}
    .beats{width:min(66vw,330px);max-height:24vh;padding:15px 16px;bottom:74px}
    .settings{right:8px;top:74px;padding:34px 34px 28px}
    .kf .slot{width:50px;height:48px}
    .pill{display:none!important}
  }`;

function install(game,sh){
  fonts();
  const st=document.createElement('style');st.textContent=BASE;sh.appendChild(st);
  const skin=document.createElement('style');sh.appendChild(skin);
  let PARTS_READY=null,pending=false;
  const redress=()=>{
    if(!PARTS_READY||pending)return;
    pending=true;
    requestAnimationFrame(()=>{pending=false;dress(sh,PARTS_READY);});
  };
  game.hudDress=redress;
  loadSheets().then(p=>{
    PARTS_READY=p;game.hudParts=p;
    skin.textContent=iconCss(p);
    dress(sh,p);
    // Größe ändert sich (Fenster, Text, Panel wächst) → neu malen; DOM-Wechsel (Slots) auch
    if(window.ResizeObserver){
      const ro=new ResizeObserver(redress);
      for(const sel of ['.panel','.beats','.settings','.diary','.after','.hint','.zone','.prompt','.tools'])
        for(const el of sh.querySelectorAll(sel))ro.observe(el);
    }
    if(window.MutationObserver)new MutationObserver(m=>{
      if(m.some(x=>x.type==='childList'&&x.addedNodes.length))redress();
    }).observe(sh,{childList:true,subtree:true});
    console.log('[hud] UI-Teile geschnitten:',Object.keys(p).length+'/'+Object.keys(SHEETS).length,
      '· angezogen:',sh.querySelectorAll('[data-ow-skin]').length);
  });

  const log=sh.querySelector('.log');
  const beats=document.createElement('div');
  beats.className='beats';beats.innerHTML='<div class="ttl">STORY BEATS</div>';
  if(log){beats.appendChild(log);sh.appendChild(beats);
    if(window.MutationObserver)new MutationObserver(()=>{
      log.scrollTop=log.scrollHeight;
      if(game.hudShake)game.hudShake(beats,1);   // ein neuer Beat rüttelt das Blatt kurz an
    }).observe(log,{childList:true});}
  game.beatsEl=beats;

  const hint=sh.querySelector('.hint');
  game.helpOn=false;
  const setHelp=on=>{game.helpOn=on;if(hint)hint.style.display=on?'flex':'none';sync();};
  game.setHelp=setHelp;

  const tools=document.createElement('div');tools.className='tools';
  tools.innerHTML='<button class="hbtn red" title="controls (H)"><i></i></button>'
    +'<button class="gear" title="settings"><i></i></button>';
  const box=document.createElement('div');box.className='settings';box.innerHTML=SETTINGS_HTML;
  sh.appendChild(tools);sh.appendChild(box);
  const gear=tools.querySelector('.gear'),hbtn=tools.querySelector('.hbtn');
  game.settingsEl=box;game.gearEl=tools;game.hbtnEl=null;

  const rowTxt=k=>box.querySelector('.txt[data-r="'+k+'"]');
  const swSound=box.querySelector('[data-a="sound"]'),swHelp=box.querySelector('[data-a="help"]');
  function sync(){
    const on=game.audio?game.audio.enabled!==false:game.att.sound!==false;
    swSound.textContent=on?'ON':'OFF';swSound.classList.toggle('off',!on);
    swHelp.textContent=game.helpOn?'ON':'OFF';swHelp.classList.toggle('off',!game.helpOn);
    const h=game.hero;
    if(h&&h.stats)rowTxt('build').innerHTML=`LV ${h.lv} · ${h.xp}/${10+5*(h.lv-1)} XP<br>`+
      `Fluff ${h.stats.fluff} · Kayfabe ${h.stats.kayfabe} · Bizarro ${h.stats.bizarro}`+
      `<br>Kayfabe slots ${h.slots||0} · charges ${h.charges||0}/${h.stats.kayfabe}`;
    const z=game.curZone,open=(game.zones||[]).filter(x=>!x.cleared).length;
    rowTxt('biome').innerHTML=z
      ? `${z.biome} · »${z.card?z.card.t:'?'}«<br>guards left ${Math.max(0,z.alive)} · zones open ${open}/${(game.zones||[]).length}`
      : `no card zone — ${open} of ${(game.zones||[]).length} still open`;
    const col=game.collected||[];
    rowTxt('collection').innerHTML=col.length?col.map(c=>'»'+c.t+'«').join('<br>'):'no evidence secured yet';
  }
  game.syncSettings=sync;
  const open=on=>{box.style.display=on?'flex':'none';if(on){sync();shake(box,2);}};
  gear.onclick=()=>open(box.style.display!=='flex');
  hbtn.onclick=()=>setHelp(!game.helpOn);
  box.querySelector('.close').onclick=()=>open(false);
  box.addEventListener('click',e=>{
    const a=e.target.getAttribute&&e.target.getAttribute('data-a');
    if(!a)return;
    if(a==='sound'){const on=!(game.audio?game.audio.enabled!==false:game.att.sound!==false);
      game.att.sound=on;if(game.audio)game.audio.enabled=on;sync();}
    if(a==='help')setHelp(!game.helpOn);
    if(a==='diary'){open(false);if(game.toggleDiary)game.toggleDiary();}
    if(a==='overview'){open(false);game.overview=!game.overview;}
  });
  window.addEventListener('keydown',e=>{
    if(e.key==='h'||e.key==='H')setHelp(!game.helpOn);
    if(e.key==='Escape'&&box.style.display==='flex')open(false);
  });
  if(hint)hint.style.display='none';
  setTimeout(sync,300);

  /* Der Schüttler. Kein Timer-Salat: die Klasse wird gesetzt, das Ende der Animation nimmt sie weg.
     wucht 1…4 → Amplitude 2…7 px. Mehrfach hintereinander stapelt nicht (Klasse wird neu gesetzt). */
  function shake(target,force){
    const el=(!target||target==='panel')?game.panel:(target==='beats'?beats:target);
    if(!el)return;
    const f=Math.max(1,Math.min(4,force||2));
    el.style.setProperty('--sx',(1.6*f).toFixed(1)+'px');
    el.style.setProperty('--sy',(1.1*f).toFixed(1)+'px');
    el.classList.remove('owShake');void el.offsetWidth;el.classList.add('owShake');
    if(!el._shakeBound){el._shakeBound=true;
      el.addEventListener('animationend',()=>el.classList.remove('owShake'));}
  }
  game.hudShake=shake;
  return{sync,open,shake};
}

window.OW_HUD={version:'hud-v4.3',install,SHEETS,
  note:'Papier-HUD. Die Teile und der Composer kommen aus overworld/paper-atlas.js (pa-v1.0)'};
})();
