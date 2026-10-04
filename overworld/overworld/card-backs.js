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

const SETS={
  kfb:['overworld/backs/kfb-back-1.png','overworld/backs/kfb-back-2.png',
       'overworld/backs/kfb-back-3.png','overworld/backs/kfb-back-4.png'],
  med:[],   // wartet auf Blätter — bewusst leer, nicht geraten
};
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
      try{const img=await ladeBild('overworld/card-backside.png');
        return {img,satz:'fallback',index:-1,pfad:'overworld/card-backside.png'};}
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
    größen:{kfb:SETS.kfb.length,med:SETS.med.length}};},
  note:'Seite 16 des Anti-Rules-Decks ist EINE Fläche, geschnitten mit dem Vorderseiten-Raster. '+
       'Wahl deterministisch aus dem Zonen-Seed. MED ist vorgesehen, nicht erfunden.',
};
})();
