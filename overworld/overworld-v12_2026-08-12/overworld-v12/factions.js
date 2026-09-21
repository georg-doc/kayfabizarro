/* KFB Overworld — Fraktionen (V4-S7, Masterplan §13/§15).
   Sechs Fraktionen, eine Haltung je Fraktion, und aus der Haltung fallen zwei Faktoren:
   wie wach jemand ist und wie weit er dir folgt. Kein zweites KI-System — das Gehirn
   (mob-ai.js) liest hier zwei Zahlen und eine Schwelle.

     stance(f)  = clamp(rep[f]/20, −1 … +1)     wie steht diese Fraktion zu dir
     nerve(f)   = 1 + max(0,−stance)*1,6        Feind: bis dreimal wacher
     leash(f)   = 1 + max(0,−stance)*0,8        Feind: folgt weiter
     hostile(f) = stance ≤ −0,35                ab hier greift auch Zivilbevölkerung an
     friendly(f)= stance ≥ +0,5                 ab hier sind Verbündete denkbar (§15.3)

   Die Zeugen-Regel steckt in `blame()`: wer beim Töten gesehen wird, zahlt doppelt.
   Ein späterer Schwierigkeitsgrad ist derselbe Faktor (`OW_FACTIONS.difficulty`), kein neuer Weg. */
(function(){
'use strict';

const FACTIONS={
  kingCourt:{label:'the court',   home:'town',  guards:true },
  townsfolk:{label:'the townsfolk',home:'town', guards:true },
  camp:     {label:'the camp',    home:'zone',  guards:false},
  wilds:    {label:'the wilds',   home:'zone',  guards:false},
  cave:     {label:'the deep',    home:'zone',  guards:false},
  audience: {label:'the audience',home:'meta',  guards:false},
};
// Reihenfolge aus dem Save-Vertrag, damit es nur EINE Liste gibt (journey-v2.2.0)
const ORDER=(window.OW_JOURNEY&&window.OW_JOURNEY.FACTIONS)||
  ['kingCourt','townsfolk','camp','wilds','cave','audience'];
const SCALE=20;          // so viele Rufpunkte sind eine ganze Haltungsstufe
const HOSTILE=-0.35, FRIENDLY=0.5;
let difficulty=1;        // späterer Schwierigkeitsgrad: derselbe Faktor, kein zweiter Weg

const clamp=(v,a,b)=>v<a?a:(v>b?b:v);
function repOf(g,f){return (g&&g.reputation&&g.reputation[f])||0;}
function stance(g,f){return clamp(repOf(g,f)/SCALE,-1,1);}
function nerve(g,f){return (1+Math.max(0,-stance(g,f))*1.6)*difficulty;}
function leash(g,f){return 1+Math.max(0,-stance(g,f))*0.8;}
function hostile(g,f){return stance(g,f)<=HOSTILE;}
function friendly(g,f){return stance(g,f)>=FRIENDLY;}

/* Wem gehört diese Einheit? Kreaturen und NPCs in der Stadt gehören den Städtern,
   alles in einer Kartenzone der Fraktion des Biomes. Torwächter am Hof gehören dem Hof. */
function factionOf(g,m){
  if(m&&m.faction)return m.faction;
  if(m&&m.town)return 'townsfolk';
  const z=m&&m.zone;
  if(z&&z.biome&&FACTIONS[z.biome])return z.biome;
  return 'camp';
}
// Steht ein Ort der Stadt in der Nähe? Dann zählt ein Kill als von Städtern gesehen.
function inTown(g,x,y,r){
  const rr=(r||7*64);
  for(const p of (g.places||[]))if(Math.abs(p.x-x)<rr&&Math.abs(p.y-y)<rr)return true;
  return false;
}
/* Zeugen: lebende Einheiten derselben Fraktion in Sichtweite. Wer gesehen wird, zahlt doppelt. */
function witnesses(g,m,range){
  const f=factionOf(g,m),rr=range||380;let n=0;
  for(const o of (g.mobs||[]))
    if(o!==m&&o.hp>0&&factionOf(g,o)===f&&Math.hypot(o.x-m.x,o.y-m.y)<rr)n++;
  return n;
}
/* Ruf ändern, mit Zeugen-Aufschlag und einer Meldung, die den Grund nennt. */
function blame(g,f,delta,seen){
  const d=(seen&&delta<0)?delta*2:delta;
  if(g.rep)g.rep(f,d);
  return d;
}
function label(f){return (FACTIONS[f]||{}).label||f;}
function summary(g){
  return ORDER.map(f=>f+' '+repOf(g,f)+(hostile(g,f)?' ✕':(friendly(g,f)?' ✓':''))).join(' · ');
}

window.OW_FACTIONS={FACTIONS,ORDER,SCALE,HOSTILE,FRIENDLY,
  stance,nerve,leash,hostile,friendly,factionOf,inTown,witnesses,blame,label,summary,
  get difficulty(){return difficulty;},set difficulty(v){difficulty=Math.max(0.5,Math.min(2.5,v||1));},
  version:'fac-v1.0'};
})();
