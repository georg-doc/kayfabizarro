/* KFB Overworld — HUD „Ink" (V4-S5, hud-v5.0).
   Zurück auf dunkel und durchsichtig, aber aufgeräumt: ein Block links oben (Fluff · XP · Stand ·
   Stats · Kayfabe), die Geschichte unten links ohne Kasten, oben rechts eine **Minimap** mit den
   zwei Knöpfen daran angedockt. Alles ohne Bildmaterial — Immersion vor Zierde.
   Das Tiny-Swords-Papier ist **geparkt**, nicht weg: `overworld/hud-paper.js` (hud-v4.3) bleibt
   liegen und ist der Ausgangspunkt für NPC-Dialoge, Quests und Karten-Sheets (Masterplan §12/§14).
   Der Schüttler bleibt: `OW_HUD.shake(ziel, wucht)` — der Einschlag geht durch die Fläche. */
(function(){
'use strict';

const CSS=`
  :host{--hud:rgba(14,20,17,.8);--hud2:rgba(14,20,17,.88);--line:rgba(232,224,200,.16);
    --stat-fluff:#f08a7c;--stat-kayfabe:#8fbcff;--stat-bizarro:#f0be6a;
    --ink:#e8e4d8;--dim:#9aa79c;--gold:#e8d38a;--rust:#d8763f}
  /* ── Block links oben: eine Karte, kein Stapel ─────────────────────────── */
  /* Ein Raster statt gestapelter Blöcke: Beschriftung links, Balken rechts, darunter Volle Breite.
     Typo hat drei Stufen und nur die: Beschriftung 9 · Wert 11 · Beiwerk 9,5. */
  .panel{position:static;width:auto;min-width:0;padding:9px 11px;font-size:11px;
    background:var(--hud);border:1px solid var(--line);border-radius:7px;color:var(--ink);
    backdrop-filter:blur(2px);font-family:"Courier New",ui-monospace,monospace;
    display:grid;grid-template-columns:42px 176px;align-items:center;column-gap:9px;row-gap:6px}
  .panel .lbl{font-size:9px;letter-spacing:1.3px;color:var(--dim);margin:0;line-height:1}
  .panel .bar{height:12px;border-radius:3px;background:rgba(0,0,0,.46);position:relative;
    overflow:hidden;margin:0;box-shadow:inset 0 0 0 1px rgba(232,224,200,.1);width:auto}
  .panel .bar i{position:absolute;inset:1px;transform-origin:left;background:#c4472c;border-radius:2px}
  .panel .bar.xp i{background:#4f88c4}
  .panel .bar u{display:none}
  .panel .bar span{position:absolute;inset:0;text-align:right;padding-right:5px;box-sizing:border-box;
    font-size:9px;line-height:12px;color:#fff;letter-spacing:.4px;text-shadow:0 1px 2px rgba(0,0,0,.9)}
  .panel .lv,.panel .stats,.panel .pool,.panel .kf{grid-column:1/-1}
  .panel .lv{margin:0;font-size:11px;color:var(--gold);letter-spacing:.3px}
  .panel .stats{margin:0;display:flex;gap:10px;font-size:11px}
  .panel .pool{margin:0;font-size:9.5px;color:var(--dim);line-height:1.4}
  .kf{margin:0;display:flex;align-items:center;gap:5px}
  .kf .slot{width:38px;height:30px;border-radius:4px;border:1px solid var(--line);
    background:rgba(0,0,0,.3);color:var(--dim);font-size:8.5px;line-height:1.1;
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    box-sizing:border-box;position:relative;overflow:hidden;padding:0;font-family:inherit}
  .kf .slot.on{background:rgba(232,211,138,.1);border-color:rgba(232,211,138,.45);
    color:var(--ink);cursor:pointer}
  .kf .slot.on:hover{background:rgba(232,211,138,.2)}
  .kf .slot.spent{opacity:.42}
  .kf .slot em{font-size:7.5px;color:var(--dim);letter-spacing:.6px}
  .kf .slot .rr{position:absolute;left:0;right:0;bottom:0;height:2px;border:0}
  .kf .chg{display:flex;gap:3px;margin-left:2px;width:auto;flex-wrap:wrap}
  .kf .chg i{width:6px;height:6px;border-radius:50%;background:rgba(0,0,0,.4);
    border:1px solid rgba(232,224,200,.25)}
  .kf .chg i.f{background:#6ea0ff;border-color:#9fc3ff}
  /* ── Geschichte unten links: Text, kein Kasten ─────────────────────────── */
  /* Unten links an der Kante, wächst nach oben, gedeckelt und scrollbar — wie ein Chat. */
  .beats{position:absolute;left:12px;bottom:12px;width:min(34vw,400px);max-height:26vh;
    display:flex;flex-direction:column;justify-content:flex-end;
    pointer-events:auto;z-index:3;background:none;border:0;padding:0}
  .beats .ttl{display:none}
  .log{position:static;display:flex;flex-direction:column;gap:2px;overflow-y:auto;
    font-family:"Special Elite",ui-monospace,monospace;font-size:12px;color:var(--ink);
    text-shadow:0 1px 3px rgba(0,0,0,.85);padding:0;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(232,224,200,.25) transparent}
  .log{align-items:flex-start}
  .log div{background:rgba(14,20,17,.72);border:0;padding:3px 9px;border-radius:4px;
    max-width:100%;opacity:.72;backdrop-filter:blur(2px)}
  .log div:nth-last-child(2){opacity:.88}
  .log div:last-child{opacity:1;color:var(--gold)}
  /* ── Minimap oben rechts, Knöpfe angedockt ─────────────────────────────── */
  .mm{position:absolute;right:12px;top:12px;z-index:5;display:flex;flex-direction:row-reverse;
    align-items:flex-start;gap:7px}
  .mm .frame{position:relative;padding:5px;background:var(--hud);border:1px solid var(--line);
    border-radius:7px;backdrop-filter:blur(2px);transition:transform .16s ease;transform-origin:top right}
  /* Ruhe heißt: kaum da. Wer hinsieht (Zeiger) oder wem etwas passiert (awake), sieht alles. */
  .panel,.mm,.beats,.pill{opacity:.62;transition:opacity .22s ease}
  .panel:hover,.mm:hover,.beats:hover,.pill:hover,
  .panel.awake,.mm.awake,.beats.awake{opacity:1}
  .mm .btns button{opacity:.72}
  .mm:hover .btns button{opacity:1}
  .mm .frame:hover{transform:scale(1.55)}
  .mm canvas{display:block;width:132px;height:104px;image-rendering:pixelated;border-radius:4px;
    position:static;inset:auto}
  .mm .cap{position:absolute;left:6px;right:6px;bottom:5px;font-family:"Courier New",monospace;
    font-size:7px;letter-spacing:.6px;color:var(--ink);text-shadow:0 1px 2px #000;
    text-align:center;opacity:0;transition:opacity .16s ease;pointer-events:none}
  .mm .frame:hover .cap{opacity:.92}
  .mm .btns{display:flex;flex-direction:column;gap:7px}
  /* Georg 7.8.: die Knöpfe waren gegenüber der Karte zu klein geraten. 30 → **40 px**, Glyphe
     12 → 17. Die Größe ist in allen drei Zuständen dieselbe — nur die Farbe wechselt, sonst
     springt der Knopf unter dem Zeiger weg. */
  .mm .btns button{width:40px;height:40px;border-radius:7px;border:1px solid var(--line);
    background:var(--hud);color:var(--ink);cursor:pointer;font-family:"Courier New",monospace;
    font-size:17px;line-height:1;display:flex;align-items:center;justify-content:center;
    backdrop-filter:blur(2px);padding:0}
  .mm .btns button:hover{border-color:rgba(232,211,138,.6);color:var(--gold)}
  .mm .btns button.act{border-color:rgba(232,211,138,.6);color:var(--gold)}
  /* ── Settings: dieselbe dunkle Karte, nur größer ───────────────────────── */
  .settings{position:absolute;right:12px;top:132px;width:min(90vw,308px);
    max-height:calc(100% - 156px);display:none;flex-direction:column;gap:7px;z-index:6;
    box-sizing:border-box;padding:11px 13px 12px;background:var(--hud2);
    border:1px solid var(--line);border-radius:7px;backdrop-filter:blur(3px);
    color:var(--ink);font-family:"Courier New",monospace;overflow:hidden}
  .settings h4{margin:0;font-size:9px;letter-spacing:1.8px;color:var(--dim);
    display:flex;justify-content:space-between;align-items:center}
  .settings .close{width:20px;height:20px;border:1px solid var(--line);border-radius:4px;
    background:none;color:var(--dim);cursor:pointer;font-family:inherit;font-size:11px;line-height:1;padding:0}
  .settings .close:hover{color:var(--ink);border-color:rgba(232,211,138,.5)}
  .settings .rows{overflow-y:auto;display:flex;flex-direction:column;gap:6px;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(232,224,200,.22) transparent}
  .settings .row{display:flex;align-items:center;gap:9px;font-size:10.5px}
  .settings .row .k{flex:1;line-height:1.3}
  .settings .row .k b{color:var(--gold);font-size:8.5px;letter-spacing:1.4px;font-weight:400}
  .settings .row .k em{font-style:normal;display:block;font-size:9px;color:var(--dim)}
  .settings .row .ico{display:none}
  .settings button.sw{font-family:inherit;font-size:9.5px;letter-spacing:.6px;color:var(--ink);
    cursor:pointer;min-width:54px;height:24px;border:1px solid var(--line);border-radius:5px;
    background:rgba(232,211,138,.1);padding:0 7px}
  .settings button.sw:hover{border-color:rgba(232,211,138,.55)}
  .settings button.sw.off{background:rgba(200,70,50,.16);color:#efb9a8}
  .settings button.sw:disabled{background:none;color:#6d7d71;cursor:default;border-style:dashed}
  .settings .txt{font-size:9.5px;color:var(--dim);line-height:1.5}
  .settings .sep{height:1px;background:var(--line);margin:1px 0}
  /* ── Bänder unten: reiner Text, kein Flex (Flex frisst Wortabstände) ───── */
  .zone,.prompt,.hint{background:var(--hud2);border:1px solid var(--line);border-radius:6px;
    color:var(--ink);font-family:"Courier New",monospace;backdrop-filter:blur(2px);
    display:none;text-align:center;white-space:normal;padding:6px 13px;height:auto;
    line-height:1.45;text-overflow:clip;overflow:visible}
  .zone{bottom:52px;font-size:12px}
  .zone b{color:var(--gold)}
  .prompt{bottom:96px;font-size:12px;color:var(--gold);border-color:rgba(232,211,138,.4)}
  .hint{left:50%;transform:translateX(-50%);bottom:12px;font-size:11px;color:var(--dim);
    max-width:min(92vw,880px);opacity:.9}
  .hint.on{display:block}
  .hint b{color:var(--ink)}
  /* ── Diary · Afterglow · Level-Up · Caption: gleiche Sprache ───────────── */
  .diary{right:12px;top:132px;width:min(92vw,330px);max-height:calc(100% - 176px);
    box-sizing:border-box;background:var(--hud2);border:1px solid var(--line);border-radius:7px;
    color:var(--ink);backdrop-filter:blur(3px);padding:11px 13px 12px;gap:0}
  .diary h4{padding:0 0 7px;margin:0 0 7px;font-size:9px;letter-spacing:1.8px;color:var(--dim);
    border-bottom:1px solid var(--line)}
  .diary .rep{padding:0 0 7px;border-bottom:1px solid var(--line);font-size:9.5px;gap:3px 10px}
  .diary ul{padding:7px 0;font-size:10.5px}
  .diary li{border-bottom:1px solid rgba(232,224,200,.08)}
  .diary li i,.diary .rep span{color:var(--dim)}
  .diary .row{padding:8px 0 0;border-top:1px solid var(--line);gap:6px}
  .diary button,.after .row button,.lvup button,.cap .opts button,.cap .ok{
    font-family:"Courier New",monospace;font-size:10px;color:var(--ink);background:rgba(232,211,138,.1);
    border:1px solid var(--line);border-radius:5px;cursor:pointer;padding:7px 9px}
  .diary button:hover,.after .row button:hover,.lvup button:hover,.cap .opts button:hover,.cap .ok:hover{
    border-color:rgba(232,211,138,.55)}
  .lvup .box,.cap .box,.after{background:var(--hud2);border:1px solid var(--line);border-radius:8px;
    color:var(--ink);backdrop-filter:blur(3px);box-sizing:border-box;padding:18px 20px}
  .lvup h3,.cap h3,.after h3{color:var(--gold);font-family:"Special Elite",monospace;
    letter-spacing:1px;border-color:var(--line)}
  .lvup p,.cap p,.after .body{color:var(--dim);font-family:"Special Elite",monospace}
  .after .body{color:var(--ink)}
  .cap input{background:rgba(0,0,0,.35);color:var(--ink);border:1px solid var(--line);
    border-radius:5px;font-family:"Courier New",monospace}
  .pill{font-family:"Courier New",monospace;background:var(--hud);border:1px solid var(--line);
    color:var(--dim);top:auto;bottom:12px;right:14px;font-size:9.5px;z-index:2;backdrop-filter:blur(2px)}
  /* Der Schüttler bleibt: die Fläche reagiert auf den Einschlag */
  @keyframes owShake{
    0%{transform:translate(0,0) rotate(0)}
    18%{transform:translate(calc(var(--sx,3px)*-1),var(--sy,2px)) rotate(-.3deg)}
    38%{transform:translate(var(--sx,3px),calc(var(--sy,2px)*-1)) rotate(.26deg)}
    58%{transform:translate(calc(var(--sx,3px)*-.6),calc(var(--sy,2px)*.5)) rotate(-.14deg)}
    78%{transform:translate(calc(var(--sx,3px)*.4),calc(var(--sy,2px)*-.3)) rotate(.08deg)}
    100%{transform:translate(0,0) rotate(0)}}
  .owShake{animation:owShake .3s cubic-bezier(.36,.07,.19,.97) both}
  @media (max-width:760px){
    .panel{font-size:10px;padding:8px 9px;grid-template-columns:38px 132px}
    .beats{width:min(62vw,300px);max-height:22vh}
    .mm canvas{width:104px;height:82px}
    .settings,.diary{right:8px;top:120px}
    .pill{display:none!important}
  }`;

const MM_W=132,MM_H=104;

function fonts(){
  if(document.getElementById('ow-hud-fonts'))return;
  const l=document.createElement('link');
  l.id='ow-hud-fonts';l.rel='stylesheet';
  l.href='https://fonts.googleapis.com/css2?family=Special+Elite&display=swap';
  document.head.appendChild(l);
}

const SETTINGS_HTML=`
  <h4><span>SETTINGS</span><button class="close" title="close (Esc)">✕</button></h4>
  <div class="rows">
    <div class="row" data-r="sound">
      <span class="k">Sound<em>SFX and the ring announcer</em></span>
      <button class="sw" data-a="sound">ON</button></div>
    <div class="row" data-r="help">
      <span class="k">Controls<em>key list at the bottom · H</em></span>
      <button class="sw" data-a="help">OFF</button></div>
    <div class="row" data-r="hud">
      <span class="k">Immersion<em>hide the HUD · Tab</em></span>
      <button class="sw" data-a="hud">OFF</button></div>
    <div class="row" data-r="audit">
      <span class="k">Review sheet<em>jump to any checkpoint · F</em></span>
      <button class="sw" data-a="audit">OPEN</button></div>
    <div class="sep"></div>
    <div class="row" data-r="hero">
      <span class="k">Character<em>who you play · borromean three</em></span>
      <button class="sw" data-a="hero">—</button></div>
    <div class="sep"></div>
    <div class="row" data-r="jukebox">
      <span class="k">Jukebox<em>waits for the music slice</em></span>
      <button class="sw" disabled>LOCKED</button></div>
    <div class="row" data-r="drones">
      <span class="k">Drones<em>ambient beds, same slice</em></span>
      <button class="sw" disabled>LOCKED</button></div>
    <div class="sep"></div>
    <div class="row"><span class="k"><b>BUILD</b></span></div>
    <div class="txt" data-r="build">—</div>
    <div class="sep"></div>
    <div class="row"><span class="k"><b>PLACE</b></span></div>
    <div class="txt" data-r="biome">—</div>
    <div class="sep"></div>
    <div class="row"><span class="k"><b>EVIDENCE</b></span></div>
    <div class="txt" data-r="collection">—</div>
    <div class="sep"></div>
    <div class="row" data-r="diary">
      <span class="k">Journey diary<em>the record · J</em></span>
      <button class="sw" data-a="diary">OPEN</button></div>
    <div class="row" data-r="overview">
      <span class="k">Island overview<em>pins and fast travel · M</em></span>
      <button class="sw" data-a="overview">OPEN</button></div>
  </div>`;

/* Minimap: die Insel wird EINMAL gebacken (sie ändert sich nur beim Weltbau),
   je Aufruf kommen nur Zonen, Stadt und Held darüber. Klicken reist wie die Übersicht. */
function makeMini(game,cv){
  const c=cv.getContext('2d');
  let baked=null,bakedFor=null;
  function bake(){
    const W=game.W,H=game.H,land=game.land;
    if(!W||!land)return null;
    const off=document.createElement('canvas');off.width=W;off.height=H;
    const o=off.getContext('2d');
    o.fillStyle='#12333a';o.fillRect(0,0,W,H);
    const img=o.createImageData(W,H);
    for(let i=0;i<W*H;i++){
      const v=land[i];
      const col=v===2?[86,132,72]:(v===1?[176,158,104]:[34,84,92]);
      img.data[i*4]=col[0];img.data[i*4+1]=col[1];img.data[i*4+2]=col[2];img.data[i*4+3]=255;
    }
    o.putImageData(img,0,0);
    return off;
  }
  return function tick(){
    if(!game.ready||!game.land)return;
    if(bakedFor!==game.att.seed+'|'+game.att.layout+'|'+game.W){baked=bake();bakedFor=game.att.seed+'|'+game.att.layout+'|'+game.W;}
    if(!baked)return;
    cv.width=MM_W;cv.height=MM_H;
    c.imageSmoothingEnabled=false;
    c.clearRect(0,0,MM_W,MM_H);
    c.drawImage(baked,0,0,MM_W,MM_H);
    const sx=MM_W/game.W,sy=MM_H/game.H;
    for(const z of (game.zones||[])){
      const x=(z.x+z.w/2)*sx,y=(z.y+z.h/2)*sy;
      c.fillStyle=z.cleared?'rgba(232,224,200,.45)':'#e8d38a';
      c.fillRect(x-2,y-2,4,4);
      if(!z.cleared){c.strokeStyle='rgba(232,211,138,.5)';c.lineWidth=1;
        c.strokeRect(z.x*sx,z.y*sy,z.w*sx,z.h*sy);}
    }
    if(game.tavern){c.fillStyle='#d8763f';
      c.fillRect(game.tavern.x/64*sx-1.5,game.tavern.y/64*sy-1.5,3,3);}
    const h=game.hero;
    if(h){const hx=h.x/64*sx,hy=h.y/64*sy;
      c.fillStyle='#fff';c.beginPath();c.arc(hx,hy,2.4,0,7);c.fill();
      c.strokeStyle='rgba(0,0,0,.6)';c.lineWidth=1;c.stroke();}
  };
}

function install(game,sh){
  fonts();
  const st=document.createElement('style');st.textContent=CSS;sh.appendChild(st);

  // Geschichte aus dem Block lösen (kein Kasten, nur Text)
  const log=sh.querySelector('.log');
  const beats=document.createElement('div');beats.className='beats';
  if(log){beats.appendChild(log);sh.appendChild(beats);
    if(window.MutationObserver)new MutationObserver(()=>{
      log.scrollTop=log.scrollHeight;
      if(game.hudShake)game.hudShake(beats,1);
    }).observe(log,{childList:true});}
  game.beatsEl=beats;

  const hint=sh.querySelector('.hint');
  game.helpOn=false;
  const setHelp=on=>{game.helpOn=on;if(hint){hint.style.display='';hint.classList.toggle('on',on);}sync();};
  game.setHelp=setHelp;
  if(hint){hint.style.display='';hint.classList.remove('on');}

  // Minimap + die zwei Knöpfe daran
  const mm=document.createElement('div');mm.className='mm';
  mm.innerHTML='<div class="frame"><canvas></canvas><div class="cap"></div></div>'
    +'<div class="btns"><button class="hbtn" title="controls (H)">?</button>'
    +'<button class="gear" title="settings">⚙</button></div>';
  sh.appendChild(mm);
  const cv=mm.querySelector('canvas'),cap=mm.querySelector('.cap');
  const tick=makeMini(game,cv);
  const gear=mm.querySelector('.gear'),hbtn=mm.querySelector('.hbtn');
  game.gearEl=mm;game.hbtnEl=null;game.miniEl2=mm;

  const box=document.createElement('div');box.className='settings';box.innerHTML=SETTINGS_HTML;
  sh.appendChild(box);
  game.settingsEl=box;

  const rowTxt=k=>box.querySelector('.txt[data-r="'+k+'"]');
  const swSound=box.querySelector('[data-a="sound"]'),swHelp=box.querySelector('[data-a="help"]'),
        swHud=box.querySelector('[data-a="hud"]'),swHero=box.querySelector('[data-a="hero"]');
  /* Die Helden-Liste wird **gelesen**, nicht aufgezählt: seit V6-S1 ist `OW_UNITS.roster()` die
     eine Stelle, an der steht, wen es gibt. Der Zyklus-Schalter ist weg — bei dreißig Einheiten
     wäre Durchklicken kein Bedienweg, sondern eine Strafe. Die Zeile öffnet das Wahlblatt. */
  const HERO_LABEL={warrior:'WARRIOR',frizzlebob:'FRIZZLEBOB',rogue:'ROGUE',knight:'KNIGHT',mage:'MAGE'};
  const heroLabel=cur=>{
    if(HERO_LABEL[cur])return HERO_LABEL[cur];
    const CAT=window.OW_UNITS;
    const r=CAT&&CAT.roster?CAT.roster().find(x=>x.id===cur):null;
    return (r?r.label:cur).toUpperCase();
  };
  function sync(){
    const on=game.audio?game.audio.enabled!==false:game.att.sound!==false;
    swSound.textContent=on?'ON':'OFF';swSound.classList.toggle('off',!on);
    swHelp.textContent=game.helpOn?'ON':'OFF';swHelp.classList.toggle('off',!game.helpOn);
    swHud.textContent=game.minimal?'ON':'OFF';swHud.classList.toggle('off',!game.minimal);
    const cur=String(game.att.hero||'warrior');
    swHero.textContent=heroLabel(cur);
    swHero.classList.remove('off');
    const h=game.hero;
    if(h&&h.stats)rowTxt('build').innerHTML=`LV ${h.lv} · ${h.xp}/${10+5*(h.lv-1)} XP · `+
      `Fluff ${h.stats.fluff} · Kayfabe ${h.stats.kayfabe} · Bizarro ${h.stats.bizarro}`+
      `<br>slots ${h.slots||0} · charges ${h.charges||0}/${h.stats.kayfabe}`;
    const z=game.curZone,open=(game.zones||[]).filter(x=>!x.cleared).length;
    rowTxt('biome').innerHTML=z
      ? `${z.biome} · »${z.card?z.card.t:'?'}«<br>guards left ${Math.max(0,z.alive)} · ${open}/${(game.zones||[]).length} zones open`
      : `no card zone — ${open} of ${(game.zones||[]).length} still open`;
    const col=game.collected||[];
    rowTxt('collection').innerHTML=col.length?col.map(c=>'»'+c.t+'«').join('<br>'):'nothing secured yet';
    gear.classList.toggle('act',box.style.display==='flex');
    hbtn.classList.toggle('act',!!game.helpOn);
  }
  game.syncSettings=sync;
  const open=on=>{box.style.display=on?'flex':'none';if(on)sync();else sync();};
  gear.onclick=()=>open(box.style.display!=='flex');
  hbtn.onclick=()=>setHelp(!game.helpOn);
  box.querySelector('.close').onclick=()=>open(false);
  box.addEventListener('click',e=>{
    const a=e.target.getAttribute&&e.target.getAttribute('data-a');
    if(!a)return;
    if(a==='sound'){const on=!(game.audio?game.audio.enabled!==false:game.att.sound!==false);
      game.att.sound=on;if(game.audio)game.audio.enabled=on;sync();}
    if(a==='help')setHelp(!game.helpOn);
    if(a==='hud'){game.minimal=!game.minimal;if(game.syncHudMode)game.syncHudMode();sync();}
    if(a==='audit'&&game.toggleAudit)game.toggleAudit();
    if(a==='hero'){
      open(false);
      if(game.toggleRoster)game.toggleRoster(true);
    }
    if(a==='diary'){open(false);if(game.toggleDiary)game.toggleDiary();}
    if(a==='overview'){open(false);if(game.toggleOverview)game.toggleOverview();}
  });
  window.addEventListener('keydown',e=>{
    if(e.key==='h'||e.key==='H')setHelp(!game.helpOn);
    if(e.key==='Escape'&&box.style.display==='flex')open(false);
  });
  // Karte klicken = reisen (dasselbe wie in der Übersicht), Reisen bleibt eine Sache des Runners
  cv.addEventListener('click',ev=>{
    const r=cv.getBoundingClientRect();
    const wx=(ev.clientX-r.left)/r.width*game.W*64,wy=(ev.clientY-r.top)/r.height*game.H*64;
    if(game.travelPoint)game.travelPoint(wx,wy,'the map');
    else if(game.setMoveTarget)game.setMoveTarget(wx,wy);
  });

  // Minimap läuft auf eigener, ruhiger Uhr — 8×/s reicht für einen Punkt
  let sig='';
  let t=setInterval(()=>{
    tick();
    const hh=game.hero;
    if(hh){
      const s=[Math.round(hh.hp),hh.xp,hh.lv,hh.charges,(game.collected||[]).length,hh.slots].join('|');
      if(sig&&s!==sig)wake(game.panel,2.4);
      sig=s;
    }
    const z=game.curZone;
    cap.textContent=z?(z.cleared?'cleared · '+z.biome:z.biome+' · '+Math.max(0,z.alive)+' left')
      :((game.zones||[]).filter(x=>!x.cleared).length+' zones open');
  },125);
  game._mmStop=()=>clearInterval(t);
  setTimeout(sync,300);

  /* Aufwachen statt dauernd leuchten: 2,4 s volle Deckkraft, dann zurück in die Ruhe. */
  function wake(el,secs){
    if(!el)return;
    el.classList.add('awake');
    clearTimeout(el._wakeT);
    el._wakeT=setTimeout(()=>el.classList.remove('awake'),(secs||2.4)*1000);
  }
  game.hudWake=(what,secs)=>wake(what==='beats'?beats:(what==='map'?mm:game.panel),secs);

  function shake(target,force){
    const el=(!target||target==='panel')?game.panel:(target==='beats'?beats:target);
    if(!el)return;
    const f=Math.max(1,Math.min(4,force||2));
    el.style.setProperty('--sx',(1.5*f).toFixed(1)+'px');
    el.style.setProperty('--sy',(1*f).toFixed(1)+'px');
    wake(el,2.4);
    el.classList.remove('owShake');void el.offsetWidth;el.classList.add('owShake');
    if(!el._shakeBound){el._shakeBound=true;
      el.addEventListener('animationend',()=>el.classList.remove('owShake'));}
  }
  game.hudShake=shake;
  game.hudDress=()=>{};   // die Papier-Version hatte das; hier gibt es nichts anzuziehen
  return{sync,open,shake,tick};
}

window.OW_HUD={version:'hud-v5.0',install,
  note:'Ink-HUD: dunkel/durchsichtig, Minimap oben rechts, Papier-Version geparkt in hud-paper.js'};
})();
/* Zweiter Name, damit zwei Skins nebeneinander leben können (V6-S11). Beide Module melden
   sich als OW_HUD an; wer zuletzt lädt, gewinnt — der Runner wählt über OW_HUD_V6/V7. */
window.OW_HUD_V6=window.OW_HUD;
