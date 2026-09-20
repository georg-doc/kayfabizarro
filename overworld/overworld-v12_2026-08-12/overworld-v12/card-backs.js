/* KFB Overworld — Kartenrückseiten (v10-S16 · backs-v1)
   ------------------------------------------------------------------------------------------------
   **Der Befund, der die Sache erst richtig gemacht hat:** Seite 16 des Anti-Rules-Decks ist **keine**
   2×2-Anordnung von vier Rückseiten. Sie ist **eine durchgehende Fläche** — Kaffeeringe,
   BLÖDSINN!-Stempel, »PRINT. CUT. PLAY.« quer über die Mitte. Vier Rückseiten werden daraus, weil
   sie mit **demselben Kartenraster** geschnitten wird wie die Vorderseiten. Das ist der Witz des
   Formats: *ein Schnitt für beide Seiten.* Wer die Rückseite anders schneidet, bekommt Karten, deren
   Seiten nicht aufeinanderpassen.

   Der erste Anlauf halbierte die Seite stumpf — heraus kamen vier Ausschnitte, von denen einer die
   Wortmarke zerschnitt und keiner das Kartenformat hatte. Jetzt geschnitten mit
   \`x .0831 · y .1339 · w .8364 · h .8533 · gapX .0335 · gapY .0127\` (V10-S7), Ergebnis
   4 × 623×364 px = **1,712**, also dasselbe Format wie die Vorderseiten.

   **Die Wahl ist deterministisch.** Eine Zone bekommt IMMER dieselbe Rückseite — sonst wechselt sie
   bei jedem Neuzeichnen und das Blatt flackert. Gewürfelt wird aus dem Zonen-Seed, nicht aus
   \`Math.random\`.

   **MED ist vorgesehen, aber nicht erfunden.** Der Satz \`med\` ist leer, bis echte Blätter da sind;
   \`setOf('med')\` fällt dann sichtbar auf \`kfb\` zurück, statt eine Rückseite zu behaupten, die es
   nicht gibt. */
(function(){
'use strict';

/* WS0-Befund 10.8. (Georg): **BLÖDSINN! ist nicht die KFB-Standardrückseite.** Der Satz hieß hier
   `kfb` und enthielt die vier gestempelten Blätter von **Seite 16 des Anti-Rules-Decks** — das sind
   die Rückseiten *dieses* Decks, nicht die der KFB-Cut-&-Play-Decks. Die echte Standardrückseite ist
   die **Wortmarke** (KayfaBizarro auf Papier, Kaffeeringe, Tuschespritzer), und sie lag die ganze
   Zeit im Rückweg: `card-backside.png`.
   **Default und Rückweg waren vertauscht** — die richtige Vorgabe war nur erreichbar, wenn alles
   andere fehlschlug. Deshalb trugen nach dem Pfad-Fix alle sechs Zonen die Rückseite eines fremden
   Decks, und es sah aus wie Absicht.
   Welches Deck welchen Satz bekommt, entscheidet der Runner (WS1) über `für({set})`; hier stehen nur
   die Sätze. Ein Deck hat **eine** Rückseite — dass `kfb` nur ein Blatt führt, ist richtig und keine
   Lücke. */
const SETS={
  kfb:['overworld/card-backside.png'],
  anti_rules:['overworld/backs/kfb-back-1.png','overworld/backs/kfb-back-2.png',
              'overworld/backs/kfb-back-3.png','overworld/backs/kfb-back-4.png'],
  med:[],   // wartet auf Blätter — bewusst leer, nicht geraten
};
/* WS0-Eingriff 10.8. (geht als Diff zurück) · **Ein Modul, das nachlädt, muß relativ zu SICH
   auflösen, nicht relativ zum Dokument.** Die Pfade oben sind dokumentbezogen und stimmen nur,
   solange das DC neben `overworld/` liegt. Bei uns liegen die Module in `overworld-v10/` — damit
   zeigten alle vier Blätter ins Leere, und weil `für()` einen RuÌkweg hat, wäre daraus **kein
   Fehler** geworden, sondern eine still falsche Rückseite. Dieselbe Klasse wie `hud-slots.json`
   (EXPORT_PRUEFLISTE: was Module selbst nachladen). `document.currentScript` ist beim
   Modul-Start noch gesetzt. */
const SRC=(document.currentScript&&document.currentScript.src)||location.href;
/* v12-P1 · DIE BLÄTTER LAUFEN ÜBER DEN KANAL DES SPIELS, nicht mehr über den Ordner daneben.
   Sie liegen im Repo (`overworld/overworld/backs/…`, `…/card-backside.png`) und wogen hier lokal
   2,3 MB — das ist genau die Klasse, die Hausregel 1 verbietet (»nichts Schweres ins Projekt«).
   `OW_SRC.ow()` ist derselbe Kanal wie für Sprites und Klänge; fällt `asset-source.js` aus, bleibt
   der alte modulrelative Weg als Rückweg stehen (er findet dann nichts, meldet das aber — anders
   als vor §4q, wo ein stiller Rückweg die falsche Rückseite in allen sechs Zonen zeigte). */
const heim=(p)=>{
  const rel=String(p).replace(/^overworld\//,'');
  if(window.OW_SRC&&OW_SRC.ow)return OW_SRC.ow(rel);
  try{return new URL('./'+rel,SRC).href;}catch(e){return p;}
};
SETS.kfb=SETS.kfb.map(heim);
SETS.anti_rules=SETS.anti_rules.map(heim);
const NOTFALL=SETS.kfb[0];
const cache=new Map();
let geladen=0, gefehlt=0;

function ladeBild(pfad){
  if(cache.has(pfad))return cache.get(pfad);
  const p=new Promise((res,rej)=>{
    const i=new Image();
    i.onload=()=>{geladen++;res(i);};
    i.onerror=()=>{gefehlt++;rej(new Error(pfad));};
    i.src=pfad;
  });
  cache.set(pfad,p);
  return p;
}
function setOf(name){
  const s=SETS[name];
  if(s&&s.length)return {name,list:s};
  if(name&&name!=='kfb')console.warn('[backs] Satz »'+name+'« ist leer — nehme kfb');
  return {name:'kfb',list:SETS.kfb};
}
/* Aus einer Zahl eine Wahl. Klein und stabil: derselbe Seed gibt dieselbe Karte, über Neustarts
   hinweg und in jedem Browser. */
function waehle(seed,len){
  let a=(seed|0)*2654435761;
  a^=a>>>15;a=Math.imul(a,2246822507);a^=a>>>13;
  return Math.abs(a)%Math.max(1,len);
}

window.OW_BACKS={
  version:'backs-v1',
  SETS,
  /* Die eine Frage, die der Runner stellt: »welche Rückseite gehört zu dieser Zone?«
     \`ctx\` darf \`{seed, set}\` sein — \`set\` wählt KFB oder MED, \`seed\` die Variante. */
  async für(ctx){
    ctx=ctx||{};
    const s=setOf(ctx.set||'kfb');
    const idx=waehle(ctx.seed==null?7:ctx.seed, s.list.length);
    try{
      const img=await ladeBild(s.list[idx]);
      return {img,satz:s.name,index:idx,pfad:s.list[idx]};
    }catch(e){
      /* Rückweg über das alte Einzelblatt — jeder Auftrag braucht einen (Fehlerklasse v8). */
      try{const img=await ladeBild(NOTFALL);
        return {img,satz:'fallback',index:-1,pfad:NOTFALL};}
      catch(e2){return null;}
    }
  },
  /* Alle Blätter eines Satzes vorladen — einmal beim Weltaufbau, damit das erste Aufdecken nicht
     auf ein Bild wartet. */
  async vorladen(set){
    const s=setOf(set||'kfb');
    await Promise.all(s.list.map(p=>ladeBild(p).catch(()=>null)));
    return {satz:s.name,blätter:s.list.length,geladen,gefehlt};
  },
  stand(){return {geladen,gefehlt,sätze:Object.keys(SETS),
    größen:{kfb:SETS.kfb.length,anti_rules:SETS.anti_rules.length,med:SETS.med.length}};},
  note:'Standard ist die WORTMARKE (card-backside.png). Die vier BLÖDSINN!-Blätter sind die '+
       'Rückseiten des ANTI-RULES-Decks (Seite 16, eine Fläche, geschnitten mit dem '+
       'Vorderseiten-Raster) und stehen als Satz anti_rules. Wahl deterministisch aus dem '+
       'Zonen-Seed. MED ist vorgesehen, nicht erfunden.',
};
})();
