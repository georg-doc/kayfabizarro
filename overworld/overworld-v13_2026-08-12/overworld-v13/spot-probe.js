/* KFB Overworld — Ortsmessung (spot-v1.0, v10-S1)
   **Hausregel 1, in Code gegossen:** eine Messung ohne festen Standpunkt ist keine Messung.
   In v9 schwankte die Bildrate zwischen 18 fps (Stadtmitte) und 52 (freies Feld); fünf Messungen
   waren wertlos, weil der Held dazwischen woanders stand. Dieses Modul setzt den Helden auf einen
   BENANNTEN Standpunkt, hält ihn dort fest und misst erst dann.

   Es misst nicht die Bildrate als Hauptzahl, sondern die **Zeichenzeit je Abschnitt**. Grund:
   `requestAnimationFrame` wird in einem Rahmen ohne Fokus gedrosselt (bench.js, 8.8.: 8 ms gegen
   53 ms bei identischem Code) — die Bildrate ist dort eine Aussage über den Browser, die
   Zeichenzeit eine über die Zeichenkette. Die Abschnittsuhr sitzt im Runner (`_t`, `dbgT`), die
   Schichtschalter auch (`dbg`); dieses Modul bedient beide.

   Bedienung (Konsole oder Abnahme-Blatt):
     OW_SPOT.stellen()                    // welche Standpunkte es gibt, mit Feldkoordinaten
     await OW_SPOT.messen('stadt')        // eine Messung, ein Ort — Abschnitte als Tabelle
     await OW_SPOT.orte()                 // alle Standpunkte, gleiche Bildzahl, gegenübergestellt
     await OW_SPOT.schichten('stadt')     // eine Schicht nach der anderen aus, jede Zahl notiert
     OW_SPOT.frei()                       // alle Schichten zurück an

   Was dieses Modul NICHT tut: es schreibt nie in den Spielstand, es lädt nie nach, und es ersetzt
   keine fehlende Zahl durch eine geschätzte — fehlt ein Ort, steht er als `null` in der Liste.
*/
(function(){
'use strict';
const VER='spot-v1.3';
if(window.OW_SPOT&&window.OW_SPOT.version===VER){
  console.log('[spot] schon geladen — zweite Ausführung übersprungen');return;}

const TILE=64;
const rAF=()=>new Promise(r=>requestAnimationFrame(r));
const med=a=>{if(!a.length)return null;const s=[...a].sort((x,y)=>x-y);return +s[s.length>>1].toFixed(2);};
const pct=(a,p)=>{if(!a.length)return null;const s=[...a].sort((x,y)=>x-y);
  return +s[Math.min(s.length-1,Math.floor(s.length*p))].toFixed(2);};

function game(){
  const el=document.querySelector('overworld-game');
  if(!el)throw new Error('[spot] kein <overworld-game> im Dokument');
  if(!el.dbg)throw new Error('[spot] dieser Runner hat keine Schichtschalter (dbg) — v10 nötig');
  return el;
}

/* ── Die Standpunkte ──────────────────────────────────────────────────────────────────────────
   Sie werden aus der Welt GELESEN, nicht gesetzt: Marktplatz, Spawn, das Blatt, ein freies Feld.
   Das freie Feld wird gesucht, nicht geraten — größter Abstand zu allen Orten, Zonen und zum Blatt.
   Damit ist »freies Feld« reproduzierbar und nicht »irgendwo, wo ich gerade stand«. */
function orteVon(g){
  const o={};
  const px=(fx,fy)=>({x:(fx+0.5)*TILE,y:(fy+0.6)*TILE});
  if(g.spawn)o.stadt={x:g.spawn.x,y:g.spawn.y,was:'Spawn (Stadtmitte)'};
  const markt=(g.places||[]).find(p=>p.id==='market');
  if(markt)o.markt={x:markt.x,y:markt.y+TILE,was:'Marktplatz, ein Feld davor'};
  const turm=(g.places||[]).find(p=>p.id==='tower');
  if(turm)o.turm={x:turm.x,y:turm.y+TILE*1.5,was:'vor dem Turm'};
  const R=g.reader;
  if(R)o.karte={x:(R.x+R.w/2)*TILE,y:(R.y+R.h/2)*TILE,was:'auf dem Blatt'};
  o.feld=freiesFeld(g,px);
  o.kueste=kuestenFeld(g,px);
  for(const k in o)if(!o[k])delete o[k];
  return o;
}

function freiesFeld(g,px){
  const W=g.W,H=g.H,land=g.land;if(!land)return null;
  const weit=[];
  for(const p of (g.places||[]))weit.push({x:p.x/TILE,y:p.y/TILE,r:6});
  for(const z of (g.zones||[]))weit.push({x:z.x+z.w/2,y:z.y+z.h/2,r:Math.max(z.w,z.h)/2+3});
  if(g.reader)weit.push({x:g.reader.x+g.reader.w/2,y:g.reader.y+g.reader.h/2,r:8});
  let best=null,bd=-1;
  for(let y=2;y<H-2;y+=2)for(let x=2;x<W-2;x+=2){
    if(land[y*W+x]!==2)continue;
    if(g.blocked&&g.blocked[y*W+x])continue;
    let d=1e9;
    for(const w of weit)d=Math.min(d,Math.hypot(x-w.x,y-w.y)-w.r);
    if(d>bd){bd=d;best={x,y};}
  }
  if(!best)return null;
  const p=px(best.x,best.y);
  return {x:p.x,y:p.y,was:'freies Feld, '+Math.round(bd)+' Felder von allem entfernt'};
}

/* Die Küste ist ein eigener Standpunkt, weil dort Relief, Feder und Wasser zusammen zahlen —
   die drei Schichten, die im Landesinneren nichts kosten. */
function kuestenFeld(g,px){
  const W=g.W,H=g.H,land=g.land;if(!land)return null;
  const mitte={x:W/2,y:H/2};
  let best=null,bd=-1;
  for(let y=2;y<H-2;y+=2)for(let x=2;x<W-2;x+=2){
    if(land[y*W+x]!==2)continue;
    let wasser=false;
    for(let dy=-2;dy<=2&&!wasser;dy++)for(let dx=-2;dx<=2;dx++)
      if(!land[(y+dy)*W+(x+dx)]){wasser=true;break;}
    if(!wasser)continue;
    let d=1e9;
    for(const p of (g.places||[]))d=Math.min(d,Math.hypot(x-p.x/TILE,y-p.y/TILE));
    if(d>bd){bd=d;best={x,y};}
  }
  if(!best)return null;
  const p=px(best.x,best.y);
  return {x:p.x,y:p.y,was:'Küste, '+Math.round(bd)+' Felder von der Stadt'};
}

/* ── Den Standpunkt setzen und HALTEN ─────────────────────────────────────────────────────────
   Setzen allein reicht nicht: ein Mob schiebt, ein Klickziel zieht, `game-feel` fährt nach. Also
   wird nach jedem gemessenen Bild zurückgesetzt. Ohne das messe ich wieder eine Fahrt. */
async function stelle(name,g){
  g=g||game();
  const o=orteVon(g)[name];
  if(!o)throw new Error('[spot] unbekannter Standpunkt »'+name+'« — bekannt: '+Object.keys(orteVon(g)).join(', '));
  pin(g,o);
  for(let i=0;i<24;i++){await rAF();pin(g,o);}    // einlaufen lassen: Kamera, Uhr, Kachel-Cache
  return o;
}
function pin(g,o){
  const h=g.hero;if(!h)return;
  h.x=o.x;h.y=o.y;
  if(h.vx!=null)h.vx=0;if(h.vy!=null)h.vy=0;
  g.cam.x=o.x;g.cam.y=o.y;
  g.moveTarget=null;g.path=null;g.attackTarget=null;
  g.keys={};
}

/* ── Eine Messung ────────────────────────────────────────────────────────────────────────────*/
async function messen(name,opt){
  const g=game();
  const o=Object.assign({bilder:120,warm:20,still:false,flush:true},typeof opt==='object'?opt:{});
  const ort=typeof name==='string'?await stelle(name,g):{x:g.hero.x,y:g.hero.y,was:'wo der Held steht'};
  const frames=[],draws=[];
  const T={};g.dbgT=T;
  const orig=g.draw;
  g.draw=function(){const t=performance.now();orig.call(this);
    if(o.flush)spuelen(g);
    draws.push(performance.now()-t);};
  let last=performance.now();
  for(let i=0;i<o.bilder;i++){
    await rAF();
    const n=performance.now();
    if(i>=o.warm)frames.push(n-last);
    last=n;
    pin(g,ort);
  }
  g.draw=orig;g.dbgT=null;
  const n=Math.max(1,draws.length);
  const abschnitte=Object.keys(T).map(k=>({abschnitt:k,msJeBild:+(T[k]/n).toFixed(3)}))
    .sort((a,b)=>b.msJeBild-a.msJeBild);
  const zeichnen=med(draws);
  for(const a of abschnitte)a.anteil=zeichnen?+(a.msJeBild/zeichnen*100).toFixed(1):null;
  const res={version:VER,stelle:typeof name==='string'?name:'hier',ort:ort.was,
    gespuelt:!!o.flush,
    feld:Math.round(ort.x/TILE)+','+Math.round(ort.y/TILE),
    zoom:+g.zoomEff().toFixed(3),dpr:g.dpr,
    zeichnenMs:zeichnen,zeichnenP90:pct(draws,0.9),
    bildMs:med(frames),fpsAusBild:med(frames)?+(1000/med(frames)).toFixed(1):null,
    sprites:(g.stats&&g.stats.view)||null,kacheln:(g.stats&&g.stats.tiles)||null,
    mobsImBild:(g.mobs||[]).filter(m=>m.hp>0).length,
    umgebung:umgebung(),abschnitte};
  if(!o.still){
    console.log('[spot] '+res.stelle+' · '+res.ort+' · Zeichnen '+res.zeichnenMs+' ms (p90 '+
      res.zeichnenP90+') · Bild '+res.bildMs+' ms ('+res.fpsAusBild+' fps'+
      (res.umgebung.vertrauenswuerdig?'':', GEDROSSELT')+') · '+res.sprites+' Sprites');
    console.table(abschnitte);
  }
  letzte=res;return res;
}

/* ── SPÜLEN: der Unterschied zwischen »Befehle abgeben« und »Bild fertig« ─────────────────────
   Zweiter Befund von v10-S1, und er entwertet die erste Messung dieser Sitzung: `draw()` misst mit
   `performance.now()` nur die Zeit, in der wir Canvas-BEFEHLE abgeben — 1 ms an jedem Standpunkt.
   Gezeichnet wird danach, auf der GPU, und diese Zeit landet im »Rest« (17–26 ms). Eine Messung, die
   die Rasterung nicht enthält, misst nicht das Zeichnen.
   `getImageData(0,0,1,1)` erzwingt ein Rücklesen und wartet damit, bis das Bild wirklich fertig ist.
   Der Aufruf selbst kostet in jeder Variante dasselbe — der VERGLEICH bleibt gültig, der Absolutwert
   ist ein Deckel nach oben. */
function spuelen(g){try{g.ctx.getImageData(0,0,1,1);}catch(e){}}

/* ── Das ganze Bild, nicht nur das Zeichnen ──────────────────────────────────────────────────
   Erster Befund von v10-S1: die Zeichenzeit liegt überall bei ~1 ms, die Bildzeit bei 17–26 ms.
   Damit ist die Frage nicht mehr »welche Schicht«, sondern »welcher der drei Aufrufe« — und wie
   viel davon überhaupt in JavaScript passiert. `rest` ist die Zeit, die der Browser braucht,
   nachdem unser Code fertig ist: Rasterung, Zusammensetzung, Warten auf den Bildschirm. */
async function budget(name,opt){
  const g=game(),o=Object.assign({bilder:120,warm:20},opt||{});
  const ort=typeof name==='string'?await stelle(name,g):{x:g.hero.x,y:g.hero.y,was:'wo der Held steht'};
  const teile={step:[],reader:[],draw:[],hud:[]};
  const frames=[],js=[];
  const wrap=(schluessel,methode)=>{
    const orig=g[methode];
    g[methode]=function(){const t=performance.now();const r=orig.apply(this,arguments);
      teile[schluessel].push(performance.now()-t);return r;};
    return ()=>{g[methode]=orig;};
  };
  const zurueck=[wrap('step','step'),wrap('reader','stepReader'),wrap('draw','draw'),wrap('hud','updateHud')];
  let last=performance.now();
  for(let i=0;i<o.bilder;i++){
    const n0=teile.step.length;
    await rAF();
    const n=performance.now();
    if(i>=o.warm){
      frames.push(n-last);
      const s=teile.step[teile.step.length-1]||0,r=teile.reader[teile.reader.length-1]||0,
            d=teile.draw[teile.draw.length-1]||0;
      js.push(s+r+d);
    }
    last=n;pin(g,ort);
  }
  for(const f of zurueck)f();
  const bild=med(frames),jsM=med(js);
  const res={stelle:typeof name==='string'?name:'hier',ort:ort.was,
    bildMs:bild,fps:bild?+(1000/bild).toFixed(1):null,
    jsMs:jsM,restMs:(bild!=null&&jsM!=null)?+(bild-jsM).toFixed(2):null,
    stepMs:med(teile.step),readerMs:med(teile.reader),zeichnenMs:med(teile.draw),
    hudMs:med(teile.hud),hudAufrufe:teile.hud.length,
    bildP90:pct(frames,0.9),jsP90:pct(js,0.9),
    leinwand:g.cv?g.cv.width+'×'+g.cv.height:null,zoom:+g.zoomEff().toFixed(3),dpr:g.dpr,
    sprites:(g.stats&&g.stats.view)||null,mobs:(g.mobs||[]).filter(m=>m.hp>0).length,
    umgebung:umgebung()};
  console.log('[spot] Budget '+res.stelle+': Bild '+res.bildMs+' ms = JS '+res.jsMs+
    ' (step '+res.stepMs+' · reader '+res.readerMs+' · draw '+res.zeichnenMs+') + Rest '+res.restMs);
  letztesBudget=res;return res;
}

/* ── Alle Standpunkte, gleiche Bildzahl ──────────────────────────────────────────────────────*/
async function orte(opt){
  const g=game(),o=Object.assign({bilder:120},opt||{});
  const namen=Object.keys(orteVon(g));
  const rows=[],alle=[];
  for(const nm of namen){
    const r=await messen(nm,{bilder:o.bilder,still:true});
    alle.push(r);
    rows.push({stelle:nm,ort:r.ort,zeichnenMs:r.zeichnenMs,bildMs:r.bildMs,fps:r.fpsAusBild,
      sprites:r.sprites,teuerste:r.abschnitte[0]?r.abschnitte[0].abschnitt+' '+r.abschnitte[0].msJeBild:null});
  }
  console.log('[spot] '+namen.length+' Standpunkte, je '+o.bilder+' Bilder, gleicher Zoom');
  console.table(rows);
  letzteOrte=alle;return {rows,alle};
}

/* ── Schicht für Schicht ─────────────────────────────────────────────────────────────────────
   Erst ein Grundwert mit allem an, dann je Schicht: aus, messen, wieder an. Der Gewinn steht als
   Differenz zum Grundwert — nicht als Vergleich zweier Läufe an verschiedenen Orten. */
async function schichten(name,opt){
  const g=game(),o=Object.assign({bilder:90,warm:15,flush:true},opt||{});
  const ort=typeof name==='string'?await stelle(name,g):null;
  const grund=await messen(null,{bilder:o.bilder,warm:o.warm,still:true,flush:o.flush});
  const namen=Object.keys(g.dbg);
  const rows=[];
  for(const k of namen){
    g.dbg[k]=0;
    const r=await messen(null,{bilder:o.bilder,warm:o.warm,still:true,flush:o.flush});
    g.dbg[k]=1;
    rows.push({schicht:k,ohneMs:r.zeichnenMs,gewinnMs:+(grund.zeichnenMs-r.zeichnenMs).toFixed(2),
      anteil:grund.zeichnenMs?+((grund.zeichnenMs-r.zeichnenMs)/grund.zeichnenMs*100).toFixed(1):null,
      spritesOhne:r.sprites});
  }
  rows.sort((a,b)=>b.gewinnMs-a.gewinnMs);
  console.log('[spot] Schichten am Standpunkt '+(typeof name==='string'?name:'hier')+
    ' · Grundwert Zeichnen '+grund.zeichnenMs+' ms'+(ort?' · '+ort.was:''));
  console.table(rows);
  letzteSchichten={stelle:name,grund,rows};
  return letzteSchichten;
}

/* ── VERGLEICH IM WECHSEL ────────────────────────────────────────────────────────────────────
   Die dritte bezahlte Lehre dieser Sitzung, und die teuerste: **dieselbe Variante am selben
   Standpunkt lieferte 28 und 22 ms.** Das Rauschen in diesem Kontext liegt bei ±6 ms — jede
   einzelne Messung darunter ist keine Aussage, und meine erste Schichttabelle stand voll davon.
   Also: die Varianten im WECHSEL messen (A B A B A B), je Runde ein eigener Median, und danach der
   Median der Runden plus die Spanne. Zwei Varianten gelten erst als verschieden, wenn die Spannen
   sich nicht überlappen — steht in der Tabelle als `sicher`.

     await OW_SPOT.vergleich('feld',{an:g=>g.dbg.kurzweg=1, aus:g=>g.dbg.kurzweg=0},{runden:6})
*/
async function vergleich(name,varianten,opt){
  const g=game(),o=Object.assign({runden:6,bilder:40,warm:8,flush:true},opt||{});
  const ort=typeof name==='string'?await stelle(name,g):{x:g.hero.x,y:g.hero.y,was:'wo der Held steht'};
  const namen=Object.keys(varianten);
  const werte={};for(const k of namen)werte[k]=[];
  for(let r=0;r<o.runden;r++)
    for(const k of namen){
      varianten[k](g);
      const m=await messen(null,{bilder:o.bilder,warm:o.warm,still:true,flush:o.flush});
      werte[k].push(m.zeichnenMs);
      pin(g,ort);
    }
  const rows=namen.map(k=>({variante:k,medianMs:med(werte[k]),
    min:Math.min(...werte[k]),max:Math.max(...werte[k]),laeufe:werte[k].join(' ')}));
  const a=rows[0];
  for(const r of rows){
    r.gegenErste=r===a?0:+(r.medianMs-a.medianMs).toFixed(2);
    r.sicher=r===a?'—':(r.min>a.max?'ja (langsamer)':r.max<a.min?'ja (schneller)':'nein — im Rauschen');
  }
  console.log('[spot] Wechselvergleich · '+ort.was+' · '+o.runden+' Runden à '+o.bilder+' Bilder');
  console.table(rows);
  letzterVergleich={ort:ort.was,rows};
  return letzterVergleich;
}

function umgebung(){
  const imFrame=window.top!==window.self;
  const fokus=document.hasFocus?document.hasFocus():null;
  const sichtbar=document.visibilityState==='visible';
  return {imFrame,fokus,sichtbar,
    vertrauenswuerdig:sichtbar&&!(imFrame&&fokus===false),
    hinweis:'Bildzeit nur im sichtbaren, fokussierten Fenster vergleichbar. Zeichenzeit immer.'};
}

function frei(){
  const g=game();for(const k in g.dbg)g.dbg[k]=1;
  g.dbgT=null;console.log('[spot] alle Schichten an');
}

let letzte=null,letzteOrte=null,letzteSchichten=null,letztesBudget=null,letzterVergleich=null;

window.OW_SPOT={version:VER,messen,orte,schichten,budget,vergleich,stelle:n=>stelle(n),frei,
  get letzterVergleich(){return letzterVergleich;},
  get letztesBudget(){return letztesBudget;},
  stellen(){const o=orteVon(game());
    console.table(Object.keys(o).map(k=>({stelle:k,was:o[k].was,
      feld:Math.round(o[k].x/TILE)+','+Math.round(o[k].y/TILE)})));return o;},
  get letzte(){return letzte;},
  get letzteOrte(){return letzteOrte;},
  get letzteSchichten(){return letzteSchichten;},
  json(){return JSON.stringify({letzte,letzteOrte,letzteSchichten},null,2);},
  note:'Standpunkt setzen, festhalten, dann messen. Hauptzahl ist die Zeichenzeit je Abschnitt, '+
       'nicht die Bildrate — die hängt am Fenster, nicht an der Zeichenkette.'};
})();
