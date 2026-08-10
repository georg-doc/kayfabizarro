/* KFB Overworld — Benchmark (bench-v1.0, V8-S5)
   **Ein Messgerät, zwei Welten.** Georgs Befund: die Bewegung fühlt sich in v8 träger und ruckeliger
   an als in v4, wo noch das alte Terrain lief. Das ist eine Behauptung über zwei Runner — und in
   diesem Projekt gilt: messen statt behaupten. Also ein Modul, das in **beiden** läuft und
   vergleichbare Zahlen schreibt.

   Die Regel, aus der der Aufbau folgt: **fehlt ein System, wird das berichtet, nicht ersetzt.**
   v4 hat kein `OW_GROUND`, kein `OW_RELIEF`, kein `OW_ACLOCK` — dann steht dort `null`, und genau das
   ist der Vergleich. Wer stattdessen einen Ersatzwert einsetzt, vergleicht seine eigene Annahme.
   (Dieselbe Fehlerklasse wie der Textur-Cache am 7.8.: wer beim ersten Versuch leer ausgeht, darf den
   Ersatz nicht für das Ergebnis halten.)

   Fünf Größen, weil »ruckelig« und »träge« NICHT dasselbe sind:

     1 Bildzeit        — ruckelt es, weil Bilder ausfallen?
     2 Zeichenzeit     — geht die Zeit im Zeichnen weg, und wo?
     3 Bildstillstand  — ruckelt es, obwohl die Bildrate steht? (Rasterung, Animationsuhr)
     4 Eingabe-Latenz  — ist es träge, weil die Antwort spät kommt?
     5 Anlauf          — oder ist es träge, weil es absichtlich weich anfährt? (game-feel)

   3 ist die Größe, die dieses Projekt gebaut hat und noch nie gemessen hat, und 4 gegen 5 ist die
   Frage, die »träge« überhaupt erst beantwortbar macht: ein weicher Antritt IST träge — mit Absicht.

   Bedienung (Konsole oder Abnahme-Blatt):
     await OW_BENCH.run()          // ~6 s, fährt den Helden selbst
     OW_BENCH.last                 // das Ergebnis als Objekt
     OW_BENCH.json()               // als Zeichenkette, zum Hin- und Herschieben
     OW_BENCH.compare(a,b)         // zwei Läufe gegenüberstellen
*/
(function(){
'use strict';
const VER='bench-v1.0';
if(window.OW_BENCH&&window.OW_BENCH.version===VER){
  console.log('[bench] schon geladen — zweite Ausführung übersprungen');return;}

const med=a=>{if(!a.length)return null;const s=[...a].sort((x,y)=>x-y);
  return +s[Math.floor(s.length/2)].toFixed(2);};
const pct=(a,p)=>{if(!a.length)return null;const s=[...a].sort((x,y)=>x-y);
  return +s[Math.min(s.length-1,Math.floor(s.length*p))].toFixed(2);};
const mean=a=>a.length?+(a.reduce((x,y)=>x+y,0)/a.length).toFixed(2):null;

function game(){
  const el=document.querySelector('overworld-game');
  if(!el)throw new Error('[bench] kein <overworld-game> im Dokument');
  return el;
}

/* Was überhaupt vorhanden ist. Das ist die halbe Diagnose: v4 und v8 unterscheiden sich hier. */
function stack(){
  const g=game();
  const v=k=>window[k]?(window[k].version||true):null;
  return {
    runner:g.tagName.toLowerCase(),
    hud:(g.HUD&&g.HUD.version)||null,
    ground:v('OW_GROUND'), relief:v('OW_RELIEF'), terrain:v('OW_TERRAIN'),
    puddles:v('OW_PUDDLES'), props:v('OW_PROPS'), contact:v('OW_CONTACT'),
    aclock:v('OW_ACLOCK'), feel:v('OW_FEEL'), motion:v('OW_MOTION'),
    ai:v('OW_AI'), shadow:v('OW_SHADOW'), sfmap:v('OW_SFMAP'),
    terrainMode:(g.att&&g.att.terrain)||null,
    shadowMode:(g.att&&g.att.shadow)||null,
    reliefTex:(window.OW_GROUND&&OW_GROUND.reliefTex!=null)?OW_GROUND.reliefTex:null,
    worldSize:(g.W&&g.H)?g.W+'×'+g.H:null,
    zoom:g.zoomEff?+g.zoomEff().toFixed(3):null,
    dpr:g.dpr||devicePixelRatio,
    canvas:g.cv?g.cv.width+'×'+g.cv.height:null,
    mobs:g.mobs?g.mobs.length:null,
    zones:g.zones?g.zones.length:null,
  };
}

/* Die Zeichenphase messen, ohne sie zu verändern: `draw` einmal umhüllen, nach dem Lauf zurück.
   Kein Dauer-Overhead, und der Runner weiß nichts davon. */
function wrapDraw(g,out){
  const orig=g.draw;
  g.draw=function(){const t=performance.now();orig.call(this);out.push(performance.now()-t);};
  return ()=>{g.draw=orig;};
}

/* Tastendruck echt schicken — nicht `keys[k]=true` setzen. Der Unterschied hat dieses Projekt
   schon einmal einen Slice gekostet (S20: über `start()` grün, über den Schalter tot). */
const send=(type,key)=>window.dispatchEvent(new KeyboardEvent(type,{key,bubbles:true}));

async function run(opt){
  const o=Object.assign({frames:240,warm:30,key:'d'},opt||{});
  const g=game();
  const res={version:VER,at:new Date().toISOString(),stack:stack(),umgebung:env()};
  if(!res.umgebung.vertrauenswuerdig)
    console.warn('[bench] Achtung:',res.umgebung.warnung,'— Bildzeiten aus diesem Kontext sind '+
      'nicht vergleichbar. Im sichtbaren Fenster messen.');
  const frames=[],draws=[];
  const stop=wrapDraw(g,draws);

  /* Der Held muss wirklich laufen, sonst misst der Lauf nichts. Erste Fassung lief blind nach
     rechts und stand nach 240 Bildern am Ufer — die nächsten drei Läufe meldeten dann brav
     `verschiebung 0` und `latenz null`, als wäre das ein Ergebnis. **Ein Messgang, der nichts
     bewegt, ist ein Fehlschlag, kein Messwert.** Also: vier Richtungen probieren, die erste nehmen,
     die den Helden tatsächlich vom Fleck bringt, und ehrlich melden, wenn keine es tut. */
  let dirKey=null;
  for(const k of [o.key,'a','w','s']){
    const hx=g.hero?g.hero.x:0, hy=g.hero?g.hero.y:0;
    send('keydown',k);
    for(let i=0;i<12;i++)await new Promise(r=>requestAnimationFrame(r));
    const moved=g.hero?Math.hypot(g.hero.x-hx,g.hero.y-hy):0;
    send('keyup',k);
    if(moved>8){dirKey=k;break;}
  }
  if(!dirKey){
    res.fehlschlag='Der Held bewegt sich in keiner Richtung — blockiert, pausiert oder ein '+
      'Fenster fängt die Tasten. Kein Messwert.';
    stop();last=res;console.warn('[bench]',res.fehlschlag);return res;
  }
  res.richtung=dirKey;
  o.key=dirKey;

  /* ── 4 · Eingabe-Latenz ─────────────────────────────────────────────────────
     Von der Taste bis zur ERSTEN sichtbaren Bildbewegung. Nicht bis zur ersten
     Positionsänderung: eine Verschiebung unter einem Gerätepixel sieht man nicht, und genau darum
     geht es bei »träge«. */
  const z0=(g.zoomEff?g.zoomEff():1)*(g.dpr||1);
  const tx=()=>Math.round(-(g.cam.x-(g.cv.width/z0)/2)*z0);
  await new Promise(r=>requestAnimationFrame(r));
  const start=tx(), t0=performance.now();
  send('keydown',o.key);
  let latency=null, framesToMove=0;
  for(let i=0;i<90;i++){
    await new Promise(r=>requestAnimationFrame(r));
    framesToMove++;
    if(tx()!==start){latency=+(performance.now()-t0).toFixed(1);break;}
  }
  res.input={latenzMs:latency,bilderBisBewegung:latency==null?null:framesToMove};

  /* ── 1 · 2 · 3 · Lauf unter Bewegung ────────────────────────────────────────
     Der Held fährt weiter (die Taste ist noch unten). Aufgezeichnet wird je Bild: Bildzeit,
     Zeichenzeit, Verschiebung in Gerätepixeln, Heldentempo, Animationsbild. */
  const shifts=[],speeds=[],animKeys=[];
  let lastTx=tx(),lastX=g.hero?g.hero.x:0,lastY=g.hero?g.hero.y:0;
  let lastT=performance.now(),stillWhileMoving=0,movedFrames=0;
  const bakes0=bakeCount(), bms0=bakeMs(), draws0=drawCount();
  for(let i=0;i<o.frames;i++){
    await new Promise(r=>requestAnimationFrame(r));
    const now=performance.now(), dt=now-lastT; lastT=now;
    if(i>=o.warm)frames.push(dt);
    const t=tx(), d=Math.abs(t-lastTx); lastTx=t;
    const hx=g.hero?g.hero.x:0, hy=g.hero?g.hero.y:0;
    const sp=Math.hypot(hx-lastX,hy-lastY)/(dt/1000); lastX=hx;lastY=hy;
    if(i>=o.warm){
      shifts.push(d); speeds.push(sp);
      if(sp>4){movedFrames++; if(d===0)stillWhileMoving++;}
      if(g.hero&&g.hero.anim!=null)animKeys.push(String(g.hero.anim));
    }
  }
  send('keyup',o.key);
  stop();

  res.frame={medianMs:med(frames),p90Ms:pct(frames,0.9),maxMs:pct(frames,0.999),
    ueber20:frames.filter(x=>x>20).length,ueber33:frames.filter(x=>x>33).length,
    n:frames.length,fpsAusMedian:med(frames)?+(1000/med(frames)).toFixed(1):null};
  res.draw={medianMs:med(draws),p90Ms:pct(draws,0.9),maxMs:pct(draws,0.999),
    anteilAmBild:(med(draws)&&med(frames))?+(med(draws)/med(frames)*100).toFixed(1):null};

  /* ── 3 · Bildstillstand: DIE Zahl für »ruckelig« ───────────────────────────
     Anteil der Bilder, in denen der Held gemessen läuft, das Bild aber stehen bleibt. Zwei Ursachen
     sind möglich und der Wert unterscheidet sie nicht — er zeigt nur, DASS es passiert:
       · die Kamera rückt weniger als ein Gerätepixel weiter (Rasterung, V8-S4), oder
       · die Bildrate ist höher als die Bewegung braucht.
     Bei welchem Tempo das kippt, sagt `pixelSchwelleMs`. */
  const spMed=med(speeds);
  res.judder={
    bilderMitBewegung:movedFrames,
    stillTrotzBewegung:stillWhileMoving,
    anteilStill:movedFrames?+(stillWhileMoving/movedFrames*100).toFixed(1):null,
    verschiebungMedianPx:med(shifts),
    verschiebungMax:pct(shifts,0.999),
    tempoMedianPxS:spMed,
    // Ab welchem Tempo ein Bild garantiert mindestens 1 Gerätepixel weiterrückt:
    pixelSchwelleMs:(spMed&&z0)?+(1000/(spMed*z0)).toFixed(2):null,
    animBilder:[...new Set(animKeys)].length||null,
  };

  /* ── 5 · Anlauf: »träge« kann Absicht sein ─────────────────────────────────
     `game-feel.js` fährt bewusst weich an. Wer das für einen Fehler hält, baut das Gefühl aus. */
  res.feel=(window.OW_FEEL&&OW_FEEL.probe)?safe(()=>OW_FEEL.probe()):null;
  res.feelTuning=(window.OW_FEEL&&OW_FEEL.T)?safe(()=>JSON.parse(JSON.stringify(OW_FEEL.T))):null;

  /* ── 2b · Wo die Zeichenzeit hingeht: Arbeit, die nur v8 hat ───────────────*/
  res.work={
    kachelBacken:(bakeCount()!=null&&bakes0!=null)?bakeCount()-bakes0:null,
    kachelBackenMs:(bakeMs()!=null&&bms0!=null)?+(bakeMs()-bms0).toFixed(1):null,
    kachelCache:(window.OW_GROUND&&OW_GROUND.bakeReport)?safe(()=>OW_GROUND.bakeReport().imCache):null,
    schattenZeichnungen:drawCount()-draws0,
    schattenBacken:(window.OW_CONTACT&&OW_CONTACT.last)?OW_CONTACT.last.bakes:null,
    reliefGebaut:(window.OW_RELIEF&&OW_RELIEF.report)?safe(()=>OW_RELIEF.report().built):null,
    reliefVerworfen:(window.OW_RELIEF&&OW_RELIEF.report)?safe(()=>OW_RELIEF.report().skipped):null,
    pfuetzen:(window.OW_PUDDLES&&OW_PUDDLES.report)?safe(()=>OW_PUDDLES.report()):null,
    gezeichneteKacheln:(g.stats&&g.stats.tiles)||null,
  };
  res.aclock=(window.OW_ACLOCK&&OW_ACLOCK.report)?safe(()=>OW_ACLOCK.report()):null;
  /* **Die Startphase war in keiner der fünf Größen enthalten** — die Abnahme hat am 8.8. 36 Sekunden
     kaltes Relief gefunden, während jeder Messwert danach warm und winzig war. Ein Benchmark, der nur
     den eingelaufenen Zustand kennt, verschweigt den Zustand, in dem der Spieler ankommt. */
  res.start=(window.OW_RELIEF&&OW_RELIEF.report)?safe(()=>{
    const r=OW_RELIEF.report();
    return {reliefKaltMs:r.firstBuildMs,netzsucheMs:r.probeMs,
      urlsJeMaterial:r.urlsJeMaterial,gebaut:r.built,verworfen:r.skipped};}):null;

  last=res;
  console.log('[bench]',res.stack.terrainMode||'?','· Bild',res.frame.medianMs+' ms',
    '· Zeichnen',res.draw.medianMs+' ms',
    '· Latenz',res.input.latenzMs+' ms',
    '· still trotz Bewegung',res.judder.anteilStill+' %',
    res.umgebung.vertrauenswuerdig?'':'· ⚠ '+res.umgebung.warnung);
  return res;
}

/* **Wo gemessen wird, entscheidet mit.** Am 8.8. selbst hineingetappt: dieselbe Fassung meldete im
   sichtbaren Fenster des Nutzers **8 ms** Median und in meiner eigenen, nicht im Vordergrund
   liegenden Vorschau **53–58 ms** — bei identischem Code, identischer Welt und einer JS-Zeichenzeit
   von 0–1 ms in beiden Fällen. Ein gedrosselter `requestAnimationFrame` sieht genauso aus wie ein
   langsames Spiel. Also prüft der Benchmark seinen eigenen Kontext, statt der Zahl zu glauben:
   ein Vergleich v4 gegen v8 gilt nur, wenn beide Läufe hier `true` melden. */
function env(){
  const imFrame=window.top!==window.self;
  const sichtbar=document.visibilityState==='visible';
  const fokus=document.hasFocus?document.hasFocus():null;
  const warn=[];
  if(!sichtbar)warn.push('Reiter nicht sichtbar');
  if(imFrame&&!fokus)warn.push('in einem Rahmen ohne Fokus (rAF wird gedrosselt)');
  return {imFrame,sichtbar,fokus,
    dpr:devicePixelRatio,
    kerne:navigator.hardwareConcurrency||null,
    vertrauenswuerdig:sichtbar&&!(imFrame&&fokus===false),
    warnung:warn.join(' · ')||null};
}

function safe(fn){try{return fn();}catch(e){return null;}}
function bakeCount(){
  /* **Echt gezählt, nicht geschätzt.** Erste Fassung gab hier fest 0 zurück — eine Attrappe im
     Messgerät ist schlimmer als eine fehlende Zahl, weil sie wie ein Befund aussieht. `ground-paint`
     zählt seit gp-v1.8 selbst mit. Fehlt das Modul (v4), steht `null`. */
  const r=(window.OW_GROUND&&OW_GROUND.bakeReport)?safe(()=>OW_GROUND.bakeReport()):null;
  return r?r.bakes:null;
}
function bakeMs(){
  const r=(window.OW_GROUND&&OW_GROUND.bakeReport)?safe(()=>OW_GROUND.bakeReport()):null;
  return r?r.ms:null;
}
function drawCount(){
  return (window.OW_CONTACT&&OW_CONTACT.last)?(OW_CONTACT.last.n||0):0;
}

let last=null;

/* Zwei Läufe gegenüberstellen. Nur Zahlen, keine Deutung — die Deutung gehört in den Changelog. */
function compare(a,b){
  const rows=[];
  if(!(a.umgebung&&a.umgebung.vertrauenswuerdig)||!(b.umgebung&&b.umgebung.vertrauenswuerdig))
    console.warn('[bench] Mindestens ein Lauf kommt aus einem gedrosselten Kontext — die Bildzeiten '+
      'sind NICHT vergleichbar. Zeichenzeit, Latenz und Judder-Anteil bleiben aussagekräftig.');
  const num=(o,path)=>path.split('.').reduce((x,k)=>x?x[k]:null,o);
  const keys=['frame.medianMs','frame.p90Ms','frame.maxMs','frame.ueber20','frame.ueber33',
    'draw.medianMs','draw.p90Ms','draw.anteilAmBild',
    'input.latenzMs','input.bilderBisBewegung',
    'judder.anteilStill','judder.verschiebungMedianPx','judder.tempoMedianPxS','judder.pixelSchwelleMs'];
  for(const k of keys){
    const x=num(a,k),y=num(b,k);
    rows.push({groesse:k,A:x,B:y,
      delta:(typeof x==='number'&&typeof y==='number')?+(y-x).toFixed(2):null,
      faktor:(typeof x==='number'&&typeof y==='number'&&x)?+(y/x).toFixed(2):null});
  }
  const t=[['System','A','B']];
  for(const k of Object.keys(a.stack))t.push([k,String(a.stack[k]),String(b.stack[k])]);
  console.table(rows);
  return {zahlen:rows,systeme:t.filter(r=>r[1]!==r[2])};
}

window.OW_BENCH={version:VER,run,compare,stack,
  get last(){return last;},
  json(){return JSON.stringify(last,null,2);},
  note:'Ein Messgerät für zwei Runner. Fehlt ein System, steht null — das IST der Vergleich, kein '+
       'Ersatzwert. Trennt »ruckelig« (Bildzeit gegen Bildstillstand) von »träge« (Latenz gegen '+
       'Anlauf), weil das zwei verschiedene Fehler sind.'};
})();
