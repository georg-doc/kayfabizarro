/* FORK-STEMPEL: v10 · 2026-08-09 · aus overworld-game-v9.js (Stand V10-S2d, Export
   export/overworld-v10-S2_2026-08-09/). Ab hier ist DIESE Datei der Runner; v9 bleibt eingefroren
   als Vergleichsmaßstab. Versionsnummern gehören dem Runner (Hausregel 5).
   KFB Overworld — S1 Wanderkern · S2 Sprite-Pipeline · S3 Karten-Zonen · S4 Mobs & Kampf.
   Assets zur Laufzeit aus dem Repo — die Basis-URL steht in overworld/asset-source.js, nicht hier.
   Messen statt behaupten: HUD-Zähler, Konsole loggt Probes und Weltzahlen.
   V4-S1: das Eigenleben der Mobs wohnt in overworld/mob-ai.js — ein Gehirn je Mob,
   Lenkung statt Teleport, Wahrnehmung mit Anlauf. Der Runner behält Kampf, Beute, Welt. */
(function(){
'use strict';
const S=window.OW_SRC;
if(!S)console.error('[overworld] asset-source.js fehlt — Assets laden nicht');
const RAW=S?S.a2d(''):'';   // Quelle: overworld/asset-source.js
const KFB=S?S.kfb(''):'';
const P10=RAW+'Tiny%20Swords%20(Update%20010)/';
const PFREE=RAW+'Tiny%20Swords%20(Free%20Pack)/';
/* Loot-Zone A (V5-S6): der Zaun aus dem Enemy Pack ist **kein** Streifen, sondern ein Rahmen —
   gemessen 4×3 Kacheln à 64 px: Zeile 0 = Ecke · Riegel · Riegel · Ecke, Zeile 1 = Pfosten · LEER ·
   LEER · Pfosten, Zeile 2 = Ecke · halber Riegel (44 px, links) · halber Riegel (42 px, rechts) ·
   Ecke. Die zwei halben Riegel unten SIND das Tor. Genau deshalb wird gemessen, bevor man legt. */
const FENCE_SHEET='Tiny Swords (Enemy Pack)/Enemy Pack/Enemies/Goblin Raiders/Wooden Fence/'+
  'Wooden Fence_64x64 tile.png';
const FENCE={tl:[0,0],rail:[1,0],railB:[2,0],tr:[3,0],left:[0,1],right:[3,1],
  bl:[0,2],gateL:[1,2],gateR:[2,2],br:[3,2]};
const FENCE_PAD={tl:0,rail:11,railB:11,tr:0,left:0,right:0,bl:11,gateL:11,gateR:11,br:12};
const PEN_COLS=7,PEN_ROWS=4;   // 7/4 = 1,75 ≈ CARD_AR 1,74 — die Zone LIEGT als Karte da
const LOOT_SHEET='free-simple-summer-top-down-vector-tileset/PNG/'+
  'Top-Down Simple Summer_Prop - Treasure Chest.png';
const TILE=64, CELL=192;
/* Die Bezugsgröße für ALLES Lebendige: 91 px Körperhöhe — der gemessene Warrior-Körper, gegen den
   das Bestiarium eingestellt ist (pig_rider 107 · bear 111 · panda 102 · thief 86 · gnome 71).
   Sie ist eine Zahl an einer Stelle und gehört NICHT dem jeweiligen Helden: sonst skaliert ein
   Heldenwechsel die halbe Welt (V5-S7b). */
const HERO_REF=91;
/* ── v11-R4 · Kamera auf dem Kartenblatt: Lesen und Drüberlaufen sind zwei Dinge ─────────────────
   Georgs Befund (11.8.): »wenn ich mit meiner Unit über eine Karte gehe, zieht die Kamera erst
   hinterher, wenn ich die Karte wieder verlasse.«

   Die Ursache ist eine RICHTIGE Regel mit einer fehlenden Bedingung. Seit V9-B3b zielt die Kamera
   aufs Blatt statt auf den Helden, sobald er darauf steht — sonst schiebt wer auf der unteren
   Kartenreihe steht die Oberkante samt Beschriftung aus dem Bild. Für das LESEN ist das die richtige
   Regie: beim Lesen hält die Kamera still. Für das DURCHLAUFEN ist es falsch, und für den Code sah
   beides gleich aus, weil er nur »steht auf dem Blatt« geprüft hat.

   Also die fehlende Bedingung nachgezogen: **nicht die Position entscheidet, sondern die Ruhe.**
   Wer sich bewegt, wird verfolgt; wer stehen bleibt, gibt die Kamera an das Blatt ab. Mit zwei
   Schwellen und Abstand dazwischen (Schmitt-Trigger, dieselbe Bauart wie die Lauf-Hysterese in
   mob-ai.js) — eine einzige Schwelle würde bei jedem Schritt hin und her schalten, und genau das
   wäre die schlimmere Version des Fehlers: eine Kamera, die zuckt.
   Der Übergang ist kein Schnitt, sondern ein Anteil (0…1) zwischen Held und Blattmitte. Damit
   wandert der Ausschnitt beim Anhalten sanft auf die Karte und beim Losgehen sanft zurück. */
/* v12-K1: die Ruhe-Schwellen der Kamera sind RAUS. Sie gehörten zum zeitgesteuerten Überblenden
   auf die Blattmitte; das ist durch eine geometrische Klammer ersetzt (Suche: v12-K1). Eine
   Konstante, deren Leser weg ist, ist kein Andenken — sie ist die nächste falsche Fundstelle. */
const MOB_COLORS=['Red','Purple','Yellow','Blue'];
const ZONE_TINTS=['rgba(255,176,56,.10)','rgba(110,150,255,.11)','rgba(255,104,104,.10)',
  'rgba(178,116,255,.11)','rgba(72,214,152,.10)','rgba(255,220,90,.10)'];
// Bestiarium je Biome (V2-S1). Ranged-Rollen fehlen bewusst: sie brauchen Projektile,
// und Projektile sind ein eigener Slice (Masterplan §8) — nicht heimlich hier mit reinschmuggeln.
/* V9-B1: **sechs** Biome, und zwar eins pro Zone. Vorher standen fünf Einträge mit drei echten
   Werten in der Liste und wurden je Zone gewürfelt — sechs Zonen zeigten dann typisch drei Böden,
   zwei davon doppelt. Georgs Befund »ich sehe keine sechs Welten« war also kein Bodenfehler,
   sondern ein Würfelfehler: eine Ziehung mit Zurücklegen kann keine Vielfalt garantieren.
   Jetzt trägt der Zonenindex das Biom (siehe buildZone), der `zseed` nur noch die Bodenvariante. */
const BIOMES=['camp','wilds','cave','frost','shore','dungeon'];const BESTIARY={
  camp:{melee:['torch_goblin_ep','spear_goblin','pig','pig_rider'],elite:['pig_rider','spear_goblin']},
  wilds:{melee:['gnome','panda','thief'],elite:['panda','gnome']},
  cave:{melee:['lizard','snake','spider','turtle','bear'],elite:['bear','turtle']},
  frost:{melee:['bear','turtle','spider'],elite:['bear','turtle']},
  shore:{melee:['paddle_shark','pig','torch_goblin_ep'],elite:['paddle_shark']},
  dungeon:{melee:['skull','thief'],elite:['skull','thief']},
};
/* Bodenschicht je Zonen-Biome (V6-S1, Masterplan §27). Zwei Paletten pro Bestiarium-Biome, gewählt
   aus dem `zseed` — damit sechs Zonen sechs Böden zeigen und nicht drei. Die Namen zeigen auf
   `OW_GROUND.BIOMES`, die Texturen stehen dort (Georgs Auswahl, docs/TEXTUR_AUSWAHL_georg.md). */
const GROUND_OF={camp:['grass','waste'],wilds:['wilds','swamp'],cave:['ash','highland'],
  frost:['winter','highland'],shore:['waste','grass'],dungeon:['paper','ash']};

// ── RPG-Kern (V2-S2, Spec: uploads/kfb-overworld-rpg-system.md) ───────────────
// Zahlen am Helden, nie an der Karte. Fluff ist die Anzeige-Einheit, intern ×20 gerechnet.
/* ═══ v10-S6 · FORTSCHRITT NACH DEM BESCHLUSS VOM 9.8. ═══════════════════════════════════════
   Alt (v2): drei Werte (Puste/Witz/Schneid → fluff/kayfabe/bizarro), XP-Tabelle, sichtbares Level,
   Slots auf Stufe 3 und 6. Der Masterplan hat das am 9.8. verworfen. Neu:

     · **Sechs Werte** — Bizarro · Kayfabe · Bingo · Bongo · Boggle · BLÖDSINN!
     · **Fluff ist KEIN Wert mehr, sondern die Folge aller sechs** (Lebenspunkte).
       Eine Zahl, ein Ort: `fluffOf()` rechnet sie, niemand speichert sie. `stats.fluff` bleibt als
       **nicht-aufzählbarer Getter** stehen, damit fremde Leser (HUD v7 gehört WS0) weiterlaufen —
       ein Getter ist kein zweiter Wert, er ist derselbe Wert an einer zweiten Tür.
     · **POP statt XP.** Kein sichtbares Level. POP wird ausgegeben, nicht angesammelt.
     · **Preise stehen im Menü, nie im Bild** (K1): `popCost()` ist die einzige Preisliste.

   Die Zahlen (Vorschlag Lead 9.8., Georg entscheidet):
     Wert anheben  = 4 + 2 × aktueller Wert   (Bizarro 3 → 10 POP · ein frischer Wert 0 → 4)
     Action-Slot 2 = 15 POP · Slot 3 = 40 POP
   Maßstab: eine geräumte Zone gibt 8 POP + Mobs ≈ 11–13. Nach der Tutorial-Runde ist also genau
   **ein** frischer Wert drin — die erste Entscheidung kommt sofort, die zweite kostet eine Zone. */
const FLUFF_UNIT=20;
const STAT_KEYS=['bizarro','kayfabe','bingo','bongo','boggle','bloedsinn'];
const START_STATS={bizarro:3,kayfabe:2,bingo:1,bongo:1,boggle:1,bloedsinn:0};
/* Fluff = 4 + Summe/3, abgerundet. Mit dem Startprofil (Summe 8) sind das 6 — nah am alten Wert 5,
   also bleibt das Kampfgefühl, wo es abgenommen wurde. */
const fluffOf=st=>4+Math.floor(STAT_KEYS.reduce((a,k)=>a+(st[k]|0),0)/3);
const POP_SRC={mob:1,elite:3,secret:2,zone:8,boss:12};
const POP_COST={slot2:15,slot3:40,stat:v=>4+2*(v|0)};
/* Rückwärtskompatibel für alte Aufrufer im Runner (ein Name, ein Ort — der neue heißt POP_SRC). */
const XP_SRC=POP_SRC;
/* Die Farbe der drei Stats gehört dem HUD, nicht dem Runner: sie kommt als CSS-Variable aus dem
   Skin (Ink = hell auf dunkel, Papier = dunkel auf hell). Der Rückfallwert hier ist der Ink-Ton —
   so kippt der Kontrast nicht mehr, wenn die HUD-Sprache wechselt. */
const STAT_INFO={
  bizarro:  {name:'Bizarro',  color:'var(--stat-bizarro,#e8b45c)', line:'The blow lands. Enemies get quiet.'},
  kayfabe:  {name:'Kayfabe',  color:'var(--stat-kayfabe,#7fb0ff)', line:'One more Kayfabe charge. One more argument.'},
  bingo:    {name:'Bingo',    color:'var(--stat-bingo,#7fd6a2)',   line:'You spot the pattern before it closes.'},
  bongo:    {name:'Bongo',    color:'var(--stat-bongo,#d99a5c)',   line:'Rhythm. You keep going when others stop.'},
  boggle:   {name:'Boggle',   color:'var(--stat-boggle,#c58ce0)',  line:'The world stops making sense in your favour.'},
  bloedsinn:{name:'BLÖDSINN!',color:'var(--stat-bloedsinn,#e8756a)',line:'Nonsense as a method. It should not work.'},
  // Kein Wert, sondern die Folge aller sechs — steht hier nur für Anzeigen, die einen Namen brauchen
  fluff:    {name:'Fluff',    color:'var(--stat-fluff,#e8756a)',   line:'Your standing. It follows from the six.'},
};
// S3: die Registry liegt in kayfabe-abilities.js — hier nur die Handler-Familie (EFFECTS).
let OWK=null,OWJ=null;
const SLOT_KEYS=['1','2','3']; // W gehört dem Laufen (V4-S4): Abilities auf 1/2/3

// Die Stadt am Innenufer der Lagune (Amaurotum). Jeder Ort ist eine Adresse für ein System,
// das es schon gibt — keine Kampfzone. Winkel/Radius sind relativ zur Stadtmitte.
  /* Die Stadt braucht Weg, nicht Nachbarschaft (V5-S9/S10): die Radien standen auf 5–7 Feldern,
   also lagen Turm und Archiv **4 Felder** auseinander — bei einer Burg, die allein 5 Felder breit
   ist. Das hatte zwei Folgen: kein Raumgefühl, und die Aufräumzone des einen Baus löschte die
   Kollision des anderen (siehe buildTown). Die Radien wachsen ab S10 mit der Welt. */
const TOWN=[
  {id:'market',   label:'the marketplace',          hint:'every road starts here', a:-2.20,r:4, asset:null},
  {id:'tavern',   label:'Uncle FrizzleBob’s tavern',hint:'hear the afterglow',  a:-1.15,r:9, asset:'b_house'},
  {id:'tower',    label:'the King’s tower',         hint:'the door has an inside', a:-1.85,r:11, asset:'b_castle'},
  /* Die Kirche bekommt das Kloster: es ist das EINZIGE sakrale Blatt im Pack, und ein sakrales
     Blatt gehört an den sakralen Ort. Das Archiv zieht dafür in ein Stadthaus — ein Archiv ist ein
     Haus voller Papier, keine Kapelle. */
  {id:'church',   label:'the church',               hint:'a page is read aloud', a:-2.90,r:11, asset:'b_monastery'},
  {id:'archive',  label:'the archive',              hint:'turn the page',      a:-2.55,r:12, asset:'b_house2'},
  {id:'arena',    label:'the arena',                hint:'look at the ring',   a:-0.35,r:11, asset:'b_tower'},
  {id:'graveyard',label:'the graveyard',            hint:'you come back here',  a:-3.35,r:13, asset:null},
  {id:'garden',   label:'the garden',               hint:'rest and recover',   a:0.10,r:13, asset:null},
];

/* Weltgrößen (V5-S10, Georg 7.8.): **nicht rauszoomen, sondern die Welt vergrößern.**
   Tiny Swords ist für 1:1 gezeichnet — die Kontur ist ein bis zwei Pixel breit, und das Grasmuster
   wiederholt sich alle 64 px. Bei Zoom 0,65 verschwindet die Kontur und das Muster wird zum Moiré;
   genau Georgs Befund. Der Ausschnitt gehört also der Zeichnung, die Weite gehört der Karte. */
const WORLD_SIZES={small:[120,90],medium:[180,135],large:[240,180],huge:[320,240]};

function loadImg(url){return new Promise((res,rej)=>{const i=new Image();i.crossOrigin='anonymous';
  i.onload=()=>res(i);i.onerror=()=>rej(new Error('Ladefehler: '+url));i.src=url;});}

function sampleColor(img){
  const cv=document.createElement('canvas');cv.width=cv.height=4;
  const c=cv.getContext('2d');c.drawImage(img,0,0,4,4);
  const d=c.getImageData(1,1,1,1).data;return `rgb(${d[0]},${d[1]},${d[2]})`;
}
// Die Sheet-Proben wohnen ab V2-S1 im unit-loader (eine Wahrheit, ein Ort).
let OWL=null;
const probeRows=(i,c)=>OWL.probeRows(i,c);
const probeStrip=i=>OWL.probeStrip(i);
const probeStripCached=i=>OWL.probeStripCached(i);

// Gesäter Zufall + Value-Noise
function rand2(x,y,s){let h=Math.imul(x,374761393)+Math.imul(y,668265263)+Math.imul(s,1013904223);
  h^=h>>>13;h=Math.imul(h,1274126177);return((h^(h>>>16))>>>0)/4294967296;}
function smooth(t){return t*t*(3-2*t);}
function vnoise(x,y,s){
  const ix=Math.floor(x),iy=Math.floor(y),fx=smooth(x-ix),fy=smooth(y-iy);
  const a=rand2(ix,iy,s),b=rand2(ix+1,iy,s),c=rand2(ix,iy+1,s),d=rand2(ix+1,iy+1,s);
  return a+(b-a)*fx+(c-a)*fy+(a-b-c+d)*fx*fy;
}
function autoTileIdx(N,E,S,W){
  const col=(!W&&!E)?3:(!W?0:(!E?2:1));
  const row=(!N&&!S)?3:(!N?0:(!S?2:1));
  return{col,row};
}

class OverworldGame extends HTMLElement{
  /* Die DC-Laufzeit schreibt Attribute **kleingeschrieben und ohne Bindestrich** (`coastink`,
     nicht `coast-ink`). Wer nur die Bindestrich-Form beobachtet, baut einen Regler, den niemand
     erreicht — gemessen 7.8.: `setAttribute('coastink','hard')` → `att.coastInk` blieb 'feather'.
     `hero-color`/`herocolor` stand schon aus genau diesem Grund doppelt drin; `world-size` und
     `town-color` waren aus demselben Grund seit jeher tot. Beide Schreibweisen, immer. */
  static get observedAttributes(){return['seed','hero-color','herocolor','zoom','zones','sound','rss','back-set','backset','layout','hero','loot','town-color','towncolor','world-size','worldsize','water-form','waterform','ground','life','terrain','coast-ink','coastink','relief','relief-tex','relieftex','hud-skin','shadow','puddles','prop-sheet','propsheet','prop-grid','propgrid','hudskin','waber','waber-props','waberprops','shade','fluid','render-scale','renderscale','bubble-font','bubblefont','chatter'];}
  constructor(){super();
    this.att={seed:7,color:'Blue',zoom:1,zones:6,sound:true,rss:'off',backSet:'kfb',layout:'utopia',hero:'warrior',loot:'pen',townColor:'Blue',worldSize:'large',ground:true,life:1,terrain:'tiles',propSheet:'mix',propGrid:'smooth',shadow:'contact',puddles:'on',coastInk:'feather',relief:'bevel',reliefTex:0.55,hudSkin:'v7',renderScale:1,fightTalk:'off',bubbleFont:'potty',chatter:'on'};
    this.keys={};this.stats={fps:0,tiles:0,sprites:0,msFrame:0};
    /* v10-S1 · SCHICHTSCHALTER UND ABSCHNITTSUHR.
       Hausregel 1 aus v9: eine Messung ohne festen Standpunkt ist keine Messung. Dazu braucht es
       zwei Dinge im Runner selbst — jede Zeichenschicht einzeln abschaltbar (`dbg`) und die Zeit je
       Abschnitt zaehlbar (`dbgT`, nur wenn ein Messgeraet sie anlegt; ohne Messung kostet `_t` einen
       Vergleich). Die Schalter sind AUS-Schalter zum Messen, keine Optionen — Standard ist alles an. */
    this.dbg={wasser:1,boden:1,tschatten:1,trelief:1,kurzweg:1,wege:1,zonen:1,graben:1,zonenkarte:1,tusche:1,karte:1,shade:1,pfuetzen:1,
      bruecken:1,deko:1,bauten:1,mobs:1,schatten:1};
    this.dbgT=null;this._tk=null;this._tn=0;
    this.time=0;this.freeze=0;this.ready=false;
    this.mobs=[];this.corpses=[];this.floaters=[];this.msgs=[];this.shots=[];
  }
  attributeChangedCallback(n,_o,v){
    if(v==null)return;
    if(n==='seed'){const s=parseInt(v)||7;if(s!==this.att.seed){this.att.seed=s;if(this.ready)this.buildWorld();}}
    if(n==='zones'){const z=Math.max(2,Math.min(10,parseInt(v)||6));if(z!==this.att.zones){this.att.zones=z;if(this.ready)this.buildWorld();}}
    if(n==='zoom')this.att.zoom=parseFloat(v)||1;
    // v10-S3b: beides wirkt sofort, ohne Neubau — es ist Darstellung, keine Welt
    if(n==='bubble-font'||n==='bubblefont')this.att.bubbleFont=(v==='mono'?'mono':'potty');
    if(n==='chatter')this.att.chatter=(v==='off'?'off':'on');
    if(n==='sound'){this.att.sound=(v!=='false'&&v!=='0');if(this.audio)this.audio.enabled=this.att.sound;}
    if(n==='layout'){const l=(v==='noise')?'noise':'utopia';if(l!==this.att.layout){this.att.layout=l;if(this.ready)this.buildWorld();}}
    /* Kein festes Zweier-Menü mehr: der Zweig kannte ¦'frizzlebob'¦ und sonst ¦'warrior'¦, damit kam
       ein neuer Held über den Tweak **nie** an (gemessen: ¦hero="rogue"¦ → ¦att.hero 'warrior'¦).
       Gültig ist, was es gibt — die Helden aus Einzelframes melden sich selbst an (§19). */
    if(n==='hero'){
      /* Wer gültig ist, steht im Katalog (V6-S1) — nicht in einer Liste hier. Solange der
         Katalog noch lädt, wird der Wert übernommen; ¦loadHeroUnit¦ hat denselben Rückweg. */
      const CAT=window.OW_UNITS;
      const known=CAT&&CAT.isHero?(CAT.isHero(v)?v:'warrior'):v;
      if(known!==this.att.hero){this.att.hero=known;if(this.ready)this.reloadHero();}
    }
    if(n==='world-size'||n==='worldsize'){
      const w=WORLD_SIZES[v]?v:'large';
      if(w!==this.att.worldSize){this.att.worldSize=w;if(this.ready)this.buildWorld();}
    }
    if(n==='town-color'||n==='towncolor'){
      const c=['Blue','Red','Yellow','Purple'].includes(v)?v:'Blue';
      if(c!==this.att.townColor){this.att.townColor=c;if(this.ready){this.img={};this.boot();}}
    }
    if(n==='render-scale'||n==='renderscale'){
      const rs=Math.max(0.4,Math.min(1,parseFloat(v)||1));
      if(rs!==this.att.renderScale){this.att.renderScale=rs;if(this.ready)this.resize();}
    }
    if(n==='puddles'){this.att.puddles=v==='off'?'off':'on';}
    if(n==='shadow'){
      const sd=['contact','ellipse','off'].includes(v)?v:'contact';
      this.att.shadow=sd;
    }
    if(n==='prop-sheet'||n==='propsheet'){
      const p=['tiny','mix','sheet'].includes(v)?v:'mix';
      if(p!==this.att.propSheet){this.att.propSheet=p;if(this.ready)this.buildWorld();}
    }
    if(n==='prop-grid'||n==='propgrid'){
      const p=['smooth','pixel','both'].includes(v)?v:'both';
      if(p!==this.att.propGrid){this.att.propGrid=p;if(this.ready)this.buildWorld();}
    }
    if(n==='ground'){this.att.ground=v!=='false';}
    if(n==='terrain'){this.att.terrain=(v==='paint')?'paint':(v==='band')?'band':'tiles';}
    /* Zwei Amplituden, EIN Feld (§29): der Boden wabert voll, Requisiten mit `propFaktor`.
       Als Zahl über das Attribut, damit die Amplitude messbar ist und nicht als Gefühl wandert. */
    if(n==='shade'){this.att.shade=(v==='off')?'off':(v==='stark')?'stark':'on';}
    if(n==='fluid'){this.att.fluid=(window.OW_SHADE&&OW_SHADE.PALETTES[v])?v:'wasser';}
    /* v12-W2: die FORMFAMILIE des Glitzerns (kleckse · striche · schlieren). Eine Bildentscheidung,
       keine Ingenieursfrage — deshalb ein Schalter und keine Zahl im Modul. */
    if(n==='water-form'||n==='waterform'){if(window.OW_WATER)OW_WATER.form(v);this.att.waterForm=v;}
    if(n==='waber'){const t=parseFloat(v);
      if(!isNaN(t)&&window.OW_BAND)OW_BAND.waber=Math.max(0,Math.min(12,t));}
    if(n==='waber-props'||n==='waberprops'){const t=parseFloat(v);
      if(!isNaN(t)&&window.OW_BAND)OW_BAND.propFaktor=Math.max(0,Math.min(1,t));}
    if(n==='hud-skin'||n==='hudskin'){this.att.hudSkin=(v==='v6')?'v6':'v7';}
    if(n==='relief'){this.att.relief=(v==='off')?'off':'bevel';}
    if(n==='coast-ink'||n==='coastink'){
      const S=window.OW_TERRAIN&&OW_TERRAIN.INK_STYLES;
      this.att.coastInk=(S&&S[v])?v:'feather';
    }
    if(n==='life'){this.att.life=v==='off'?0:v==='full'?1.8:1;}
    /* Textur-Relief — beide Schreibweisen, aus demselben Grund wie `hero-color` oben. Der Regler
       ändert die gebackene Kachel, das Modul wirft dabei selbst den Cache weg. */
    if(n==='relief-tex'||n==='relieftex'){
      const t=Math.max(0,Math.min(1,parseFloat(v)));
      if(!isNaN(t)){this.att.reliefTex=t;
        if(window.OW_GROUND)OW_GROUND.reliefTex=t;}
    }
    if(n==='loot'){
      const l=(v==='chest')?'chest':'pen';
      if(l!==this.att.loot)this.att.loot=l;   // gilt ab der nächsten geräumten Zone
    }
    if(n==='hero-color'||n==='herocolor'){const c=v||'Blue';if(c!==this.att.color){this.att.color=c;if(this.ready)this.reloadHero();}}
  }
  connectedCallback(){
    const sh=this.attachShadow({mode:'open'});
    sh.innerHTML=`<style>
      :host{display:block;position:fixed;inset:0;width:100%;height:100%;overflow:hidden;background:#47aba9;
        font-family:"Courier New",ui-monospace,monospace}
      canvas{position:absolute;inset:0;width:100%;height:100%;image-rendering:pixelated}
      .pill{position:absolute;right:14px;top:14px;background:rgba(20,26,24,.72);
        color:#9aa79c;padding:5px 11px;border-radius:5px;font-size:11px;letter-spacing:.4px;white-space:nowrap}
      .hint{position:absolute;left:14px;bottom:12px;background:rgba(20,26,24,.72);color:#cfc9b8;
        padding:6px 12px;border-radius:6px;font-size:12px;max-width:calc(100% - 28px)}
      .left{position:absolute;left:14px;top:14px;display:flex;flex-direction:column;
        align-items:flex-start;gap:8px;max-height:calc(100% - 80px);pointer-events:none}
      .panel{position:static;background:rgba(20,26,24,.82);color:#e8e4d8;
        padding:9px 12px;border-radius:6px;font-size:12px;width:214px;flex:none;pointer-events:auto}
      .panel .lbl{font-size:10px;letter-spacing:1px;color:#9aa79c;margin-bottom:2px}
      .bar{height:12px;border-radius:3px;background:#0e1512;position:relative;margin-bottom:7px;overflow:hidden}
      .bar i{position:absolute;inset:0;transform-origin:left;background:#c43c3c}
      .bar u{position:absolute;inset:0;pointer-events:none;background-repeat:repeat-x;
        background-size:calc(100% / var(--seg,5)) 100%;
        background-image:linear-gradient(90deg,transparent calc(100% - 2px),rgba(10,16,13,.9) 0)}
      .bar.xp i{background:#3f7fd1}
      .bar span{position:absolute;inset:0;text-align:center;font-size:10px;line-height:12px;color:#fff}
      .lv{margin-top:2px;color:#e8d38a}
      .stats{margin-top:5px;display:flex;gap:10px;font-size:12px}
      .stats b{font-weight:700}
      .kf{margin-top:7px;display:flex;align-items:center;gap:5px}
      .kf .slot{width:40px;height:34px;border:2px dashed #4c5a50;border-radius:5px;display:flex;
        flex-direction:column;align-items:center;justify-content:center;font-size:9px;color:#6d7d71;
        text-align:center;line-height:1.1;overflow:hidden}
      .kf .slot.on{border-style:solid;cursor:pointer}
      .kf .slot.on:hover{background:rgba(232,211,138,.14)}
      .kf .slot.spent{opacity:.42}
      .kf .slot em{font-style:normal;font-size:8px;opacity:.6;letter-spacing:.5px}
      .kf .chg{display:flex;gap:3px;margin-left:3px;flex-wrap:wrap;width:26px}
      .kf .chg i{width:8px;height:8px;border-radius:50%;background:#243029;border:1px solid #4c5a50}
      .kf .chg i.f{background:#6ea0ff;border-color:#9fc3ff}
      .mini{position:absolute;left:50%;bottom:16px;transform:translateX(-50%);display:none;
        align-items:center;gap:11px;background:rgba(20,26,24,.5);padding:6px 14px;border-radius:20px}
      .mini .fb{width:132px;height:8px;border-radius:4px;background:#0e1512;position:relative;overflow:hidden}
      .mini .fb i{position:absolute;inset:0;transform-origin:left;background:#c43c3c}
      .mini .kc{display:flex;gap:4px}
      .mini .kc i{width:7px;height:7px;border-radius:50%;background:#243029;border:1px solid #4c5a50}
      .mini .kc i.f{background:#6ea0ff;border-color:#9fc3ff}
      .pool{margin-top:5px;font-size:10px;color:#8b968c;line-height:1.35}
      .lvup,.cap,.award,.pop{position:absolute;inset:0;display:none;align-items:center;justify-content:center;
        background:rgba(12,18,15,.72)}
      .pop .box{background:#1a2420;border:2px solid #e8d38a;border-radius:8px;padding:20px 22px;
        color:#e8e4d8;max-width:560px;text-align:center}
      .pop h3{margin:0 0 4px;font-size:19px;color:#e8d38a;letter-spacing:1px}
      .pop p{margin:0 0 14px;font-size:12px;color:#a9b3a8}
      .pop .opts{display:grid;grid-template-columns:1fr 1fr;gap:8px}
      .pop button.buy{font-family:inherit;background:#243029;color:#e8e4d8;border:2px solid #3c4a41;
        border-radius:6px;padding:10px 12px;cursor:pointer;text-align:left;font-size:12px;
        display:flex;justify-content:space-between;align-items:center;gap:10px}
      .pop button.buy:hover:not(:disabled){border-color:#e8d38a;background:#2c3a32}
      .pop button.buy:disabled{opacity:.42;cursor:default}
      .pop button.buy b{font-size:13px}
      .pop button.buy em{font-style:normal;color:#c58ce0;font-size:12px;white-space:nowrap}
      .pop .ok{margin-top:14px;font-family:inherit;font-size:12px;background:#243029;color:#e8d38a;
        border:2px solid #e8d38a;border-radius:6px;padding:9px 24px;cursor:pointer}
      .lvup .box,.cap .box,.award .box{background:#1a2420;border:2px solid #e8d38a;border-radius:8px;padding:20px 22px;
        color:#e8e4d8;max-width:580px;text-align:center}
      .lvup h3,.cap h3,.award h3{margin:0 0 4px;font-size:19px;color:#e8d38a;letter-spacing:1px}
      .lvup p,.cap p,.award p{margin:0 0 16px;font-size:13px;color:#a9b3a8}
      /* v10-S4 · Die Karten-Übergabe. Ein Möbel, drei Anlässe (Zone · König · Fund) — der
         Unterschied ist Rahmen und Text, die Mechanik ist dieselbe (Masterplan §4.2). */
      .award .box{max-width:520px;animation:owAward .5s cubic-bezier(.22,1.2,.36,1) both}
      @keyframes owAward{from{transform:scale(.86) translateY(18px);opacity:0}to{transform:none;opacity:1}}
      .award .art{margin:0 auto 14px;width:392px;max-width:100%;border:2px solid #1f1a14;
        background:#efe7d4;box-shadow:0 12px 30px rgba(0,0,0,.45)}
      /* Die nackte Regel oben (canvas{position:absolute;inset:0}) gilt für die SPIELFLÄCHE — sie
         erwischte auch das Kartenblatt: gemessen lag es 564×324 über der ganzen Box, der Rahmen
         war 0 px hoch. Also hier zurückholen: statisch, mit Seitenverhältnis (392×225 = 1,742).
         NB: in diesem Stylesheet-Template ist ein Backtick ein Dateiende — zweimal passiert. */
      .award .art canvas{position:static;display:block;width:100%;height:auto;
        aspect-ratio:392/225;inset:auto;image-rendering:auto}
      .award .why{margin:0 0 4px;font-size:11px;letter-spacing:2px;color:#8fa08c;text-transform:uppercase}
      .award .ok{font-family:inherit;font-size:13px;background:#243029;color:#e8d38a;
        border:2px solid #e8d38a;border-radius:6px;padding:10px 30px;cursor:pointer;letter-spacing:1px}
      .award .ok:hover{background:#2c3a32}
      .lvup .opts,.cap .opts{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
      .lvup button,.cap .opts button{font-family:inherit;background:#243029;color:#e8e4d8;border:2px solid #3c4a41;
        border-radius:6px;padding:12px 14px;width:158px;cursor:pointer;text-align:left;font-size:12px}
      .lvup button:hover,.cap .opts button:hover{border-color:#e8d38a;background:#2c3a32}
      .lvup button b,.cap .opts button b{display:block;font-size:14px;margin-bottom:4px}
      .cap .opts button{width:172px;line-height:1.35}
      .cap .own{display:flex;gap:8px;margin-top:14px}
      .cap input{flex:1;font-family:inherit;font-size:12px;background:#0f1613;color:#e8e4d8;
        border:1px solid #3c4a41;border-radius:5px;padding:9px 10px}
      .cap input:focus{outline:none;border-color:#e8d38a}
      .cap .ok{font-family:inherit;font-size:12px;background:#243029;color:#e8d38a;
        border:1px solid #e8d38a;border-radius:5px;padding:9px 14px;cursor:pointer}
      .diary{position:absolute;right:14px;top:46px;width:330px;max-height:calc(100% - 120px);
        background:rgba(20,26,24,.93);border:1px solid #3c4a41;border-radius:6px;color:#e8e4d8;
        font-size:12px;display:none;flex-direction:column;overflow:hidden}
      .diary h4{margin:0;padding:9px 12px;font-size:11px;letter-spacing:1.4px;color:#e8d38a;
        border-bottom:1px solid #3c4a41;display:flex;justify-content:space-between;align-items:center}
      .diary .rep{padding:8px 12px;border-bottom:1px solid #2c3730;display:flex;flex-wrap:wrap;gap:4px 12px;font-size:11px}
      .diary .rep span{color:#9aa79c}
      .diary ul{margin:0;padding:8px 12px;list-style:none;overflow-y:auto;flex:1;line-height:1.45}
      .diary li{padding:4px 0;border-bottom:1px solid rgba(60,74,65,.45)}
      .diary li i{font-style:normal;color:#6d7d71;font-size:10px;letter-spacing:.6px;display:block}
      .diary .row{display:flex;gap:6px;padding:9px 12px;border-top:1px solid #3c4a41}
      .diary button{flex:1;font-family:inherit;font-size:11px;background:#243029;color:#e8e4d8;
        border:1px solid #3c4a41;border-radius:4px;padding:6px 4px;cursor:pointer}
      .diary button:hover{border-color:#e8d38a}
      .after{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(620px,86%);
        max-height:78%;background:#161f1b;border:2px solid #e8d38a;border-radius:8px;color:#e8e4d8;
        display:none;flex-direction:column;overflow:hidden}
      .after h3{margin:0;padding:13px 18px;font-size:14px;letter-spacing:1.6px;color:#e8d38a;
        border-bottom:1px solid #3c4a41;display:flex;justify-content:space-between}
      .after h3 em{font-style:normal;font-size:11px;color:#8b968c;letter-spacing:.8px}
      .after .body{padding:16px 18px;overflow-y:auto;font-size:13.5px;line-height:1.65}
      .after .body p{margin:0 0 12px}
      .after .hof{margin-top:6px;border-top:1px solid #2c3730;padding-top:12px}
      .after .hof h5{margin:0 0 8px;font-size:10px;letter-spacing:1.4px;color:#8b968c}
      .after .hof div{padding:4px 0;font-size:12px;border-bottom:1px solid rgba(60,74,65,.4)}
      .after .hof i{font-style:normal;color:#6d7d71}
      .after .row{display:flex;gap:8px;padding:12px 18px;border-top:1px solid #3c4a41}
      .after .row button{flex:1;font-family:inherit;font-size:12px;background:#243029;color:#e8e4d8;
        border:1px solid #3c4a41;border-radius:5px;padding:8px;cursor:pointer}
      .after .row button:hover{border-color:#e8d38a}
      .prompt{position:absolute;left:50%;bottom:104px;transform:translateX(-50%);display:none;
        background:rgba(20,26,24,.88);color:#e8d38a;border:1px solid #e8d38a;border-radius:6px;
        padding:7px 15px;font-size:13px;white-space:nowrap}
      .zone{position:absolute;left:50%;bottom:56px;transform:translateX(-50%);background:rgba(20,26,24,.85);
        color:#e8e4d8;padding:8px 18px;border-radius:6px;font-size:14px;text-align:center;display:none;max-width:70%}
      .zone b{color:#e8d38a}
      .log{position:static;color:#e8e4d8;font-size:13px;text-shadow:0 1px 2px rgba(0,0,0,.6);
        display:flex;flex-direction:column;gap:3px;pointer-events:none;min-height:0;overflow:hidden}
      .log div{background:rgba(20,26,24,.6);padding:3px 9px;border-radius:4px;max-width:420px}
      .load{position:absolute;inset:0;display:flex;flex-direction:column;gap:10px;align-items:center;
        justify-content:center;background:#47aba9;color:#0e3d3c;font-size:16px}
      .err{color:#7a1d1d;max-width:640px;text-align:center;font-size:13px;white-space:pre-wrap}
    </style>
    <canvas></canvas>
    <div class="left">
    <div class="panel" style="display:none">
      <div class="lbl">FLUFF</div><div class="bar hp"><i></i><u></u><span></span></div>
      <div class="lbl">XP</div><div class="bar xp"><i></i><span></span></div>
      <div class="lv"></div>
      <div class="stats"></div>
      <div class="kf"></div>
      <div class="pool"></div>
    </div>
    <div class="log"></div>
    </div>
    <div class="pill" style="display:none"></div>
    <div class="zone"></div>
    <div class="hint" style="display:none">WASD / arrows move · <b>right-click</b> walk / attack · space attack · <b>1 2 3</b> Kayfabe · <b>P</b> spend POP · <b>J</b> diary · <b>C</b> play as · <b>V</b> shapeshift · <b>M</b> overview · <b>F</b> audit · <b>H</b> help · <b>+ −</b> zoom · <b>Tab</b> hide HUD</div>
    <div class="lvup"><div class="box"><h3></h3><p></p><div class="opts"></div></div></div>
    <div class="cap"><div class="box">
      <h3>LETTER THE PANEL</h3>
      <p>The zone is quiet. What does the caption say?</p>
      <div class="opts"></div>
      <div class="own"><input type="text" maxlength="90" placeholder="…or write your own">
      <button class="ok">Set</button></div>
    </div></div>
    <div class="pop"><div class="box">
      <h3>SPEND POP</h3>
      <p></p>
      <div class="opts"></div>
      <button class="ok">Close</button>
    </div></div>
    <div class="award"><div class="box">
      <div class="why"></div>
      <h3></h3>
      <div class="art"><canvas width="392" height="225"></canvas></div>
      <p class="ctx"></p>
      <button class="ok">OK</button>
    </div></div>
    <div class="prompt"></div>
    <div class="mini"><div class="fb"><i></i></div><div class="kc"></div></div>
    <div class="after">
      <h3><span>THE AFTERGLOW</span><em class="tone"></em></h3>
      <div class="body"></div>
      <div class="row">
        <button data-a="export">Export journey</button>
        <button data-a="close">Back to the island</button>
      </div>
    </div>
    <div class="diary">
      <h4><span>JOURNEY DIARY</span><span class="cnt"></span></h4>
      <div class="rep"></div>
      <ul></ul>
      <div class="row">
        <button data-a="export">Export</button>
        <button data-a="import">Import</button>
        <button data-a="reset">New run</button>
      </div>
    </div>
    <div class="load"><div>KFB Overworld loading <span class="n">0/0</span> …</div><div class="err"></div></div>`;
    this.cv=sh.querySelector('canvas');this.ctx=this.cv.getContext('2d');
    // V5-S5b: drei Zeiger. Am **Wirtselement**, nicht an der Leinwand — die Leinwand bekommt beim
    // Ändern der Fenstergröße neue Styles, und der Zeiger war danach wieder `auto` (gemessen).
    if(window.OW_CURSOR)OW_CURSOR.attach(this);
    this.pill=sh.querySelector('.pill');this.hintEl=sh.querySelector('.hint');
    this.panel=sh.querySelector('.panel');this.zoneEl=sh.querySelector('.zone');this.logEl=sh.querySelector('.log');
    this.loadEl=sh.querySelector('.load');this.loadN=sh.querySelector('.n');this.errEl=sh.querySelector('.err');
    this.lvupEl=sh.querySelector('.lvup');this.kfEl=sh.querySelector('.kf');this.poolEl=sh.querySelector('.pool');
    this.diaryEl=sh.querySelector('.diary');
    this.leftEl=sh.querySelector('.left');this.miniEl=sh.querySelector('.mini');
    this.capEl=sh.querySelector('.cap');this.afterEl=sh.querySelector('.after');
    this.awardEl=sh.querySelector('.award');
    this.awardEl.querySelector('.ok').onclick=()=>this.closeAward();
    this.popEl=sh.querySelector('.pop');
    this.popEl.querySelector('.ok').onclick=()=>this.togglePop(false);
    /* HUD-Aussehen: zwei Skins nebeneinander (V6-S11). `hud-skin.js` ist v6 (Chrome auf Papier),
       `hud-v7.js` ist »Tisch & Hand« mit derselben Tuschekante wie die Küste. Beide melden sich
       als `OW_HUD` an — deshalb sichert das Helmet jeden unter eigenem Namen, und hier wird
       gewählt. Auf „läuft" gaten, nicht auf „existiert". */
    const skin=(this.att.hudSkin==='v6')?window.OW_HUD_V6:(window.OW_HUD_V7||window.OW_HUD_V6);
    const HUDMOD=skin||window.OW_HUD;
    this.HUD=(HUDMOD&&typeof HUDMOD.install==='function')?HUDMOD.install(this,sh):null;
    /* **Und wenn v7 zu spät kommt, nochmal fragen.** Im Chat liegen die Module als `<script src>`
       im Helmet und sind vor dem Mount da; im gebündelten Standalone nicht — dort installierte der
       Runner v6 und versuchte es nie wieder (Georg, 7.8.: »das alte schwarze Chrome statt unserem
       Ink-Interface«). »Auf läuft gaten« heißt auch: wer beim ersten Versuch leer ausgeht, fragt
       nach, statt den Ersatz für das Ergebnis zu halten. */
    if(this.att.hudSkin!=='v6'&&!window.OW_HUD_V7){
      let n=0;
      const retry=setInterval(()=>{
        if(window.OW_HUD_V7&&typeof OW_HUD_V7.install==='function'){
          clearInterval(retry);
          sh.querySelectorAll('.v7,.lowlane').forEach(e=>e.remove());
          this.HUD=OW_HUD_V7.install(this,sh);
          console.log('[hud] v7 nachinstalliert nach',n*100,'ms');
        }else if(++n>40)clearInterval(retry);
      },100);
    }
    /* v7 bringt seine eigene Statuszeile mit. Die des v6-HUD bleibt sonst darunter liegen und
       schreibt »32 fps · 266 tiles …« quer unter den Kompass — zwei HUDs in einem Bild.
       Als REGEL, nicht als Inline-Stil: der Runner setzt `pill.style.display` beim Aktualisieren
       selbst wieder auf `block` (gemessen), eine einmalige Zuweisung hält also nicht. */
    if(this.att.hudSkin!=='v6'){
      const st=document.createElement('style');
      st.textContent='.pill,.pillslot,.mm{display:none!important}'+
        /* Das Logbuch wächst nach UNTEN aus dem Bild: gemessen clientHeight 103 gegen
           scrollHeight 122 bei `overflow: visible` — die NEUESTE Zeile wurde am Canvasrand
           gekappt (»Journey restored — the island is…«). Also unten bündig setzen und oben
           abschneiden: was herausläuft, ist dann das Älteste. `hud-v7.js` bleibt unangetastet —
           sein README sagt, die Module blieben unverändert, und eine Regel im Shadow-Root ist
           kein Eingriff in fremden Code. */
        /* NUR das Logbuch. Der erste Versuch hat dieselbe Regel auf `.v7-mid` und `.v7-hand`
           gelegt, weil die Messung dort denselben Überlauf zeigte — aber die Hand ist eine REIHE
           von Karten und das mittlere Feld ein Banner. `flex-direction: column` hat beide
           gestapelt und die Texturen zerlegt. Ein Messwert sagt, DASS etwas überläuft, nicht,
           dass dieselbe Behandlung passt. */
        '.v7 .log{overflow:hidden!important;display:flex!important;'+
        'flex-direction:column!important;justify-content:flex-end!important}'+
        /* v10-S6b: **es gibt kein Spieler-Level mehr** (Kanon 9.8.). Das v7-Heldenblatt zeigt
           weiter »Level 1« mit leerem Balken — eine Zahl, die nichts mehr bedeutet, ist schlimmer
           als keine. Bis WS0 in Paket 3 POP anzeigt, bleibt die Zeile hier verborgen; ihre Werte
           stehen im eigenen Blatt (P) und in der Panel-Zeile. Wieder gilt: eine Regel im
           Shadow-Root ist kein Eingriff in fremden Code. */
        '.v7-hero .bar.xp,.v7-hero .xpn{display:none!important}'+
        // ...samt der Beschriftung davor, sonst bleibt eine leere Zeile »LEVEL« stehen
        '.v7-hero .lab:has(+ .bar.xp){display:none!important}'+
/* v10-S6d · **P gehört ins Bild.** Die Tastenzeile des Runners (`.hint`) ist beim v7-Skin
           ausgeblendet; sichtbar ist `.hintw` und die gehört WS0. Also angehängt statt
           hineingeschrieben — dieselbe Übereinkunft wie beim Logbuch. */
        /* Am KIND, nicht am Elternteil: der Tastentext steckt in `.hintw > div`, und das schaltet
           die Hilfe ab (`display:none`). Ein `::after` am Elternteil überlebt das und stand dann
           als nacktes »· P spend POP« über der Wiese (gemessen: .hintw 73×14 px, Kind aus).
           So teilt der Zusatz Sichtbarkeit, Farbe und Hintergrund der echten Zeile. */
        '.v7 .hintw > div::after{content:" · P spend POP"}';
      sh.appendChild(st);
    }
    console.log('[overworld] HUD-Skin',this.att.hudSkin,'·',HUDMOD&&HUDMOD.version);
    // Wahlblatt (V6-S1, Taste C) — auf „läuft“ gaten, nicht auf „existiert“
    if(window.OW_ROSTER&&typeof window.OW_ROSTER.mount==='function')window.OW_ROSTER.mount(this);
    /* Jedes Blatt schließt per Klick daneben (Georg 7.8.). In der Erfassungsphase, damit der Klick
       nicht gleichzeitig als Reisebefehl auf der Karte ankommt — wer ein Menü wegklickt, will nicht
       auch noch loslaufen. ¦composedPath¦ statt ¦contains¦: im Shadow-DOM ist ¦target¦ der Host. */
    sh.addEventListener('pointerdown',e=>{
      const open=[this.settingsEl,this.rosterEl,this.diaryEl]
        .filter(el=>el&&el.style.display&&el.style.display!=='none');
      if(!open.length)return;
      const path=e.composedPath();
      const hit=open.filter(el=>!path.includes(el));
      if(hit.length!==open.length)return;         // der Klick ging in ein offenes Blatt
      for(const el of hit)el.style.display='none';
      if(this.syncSettings)this.syncSettings();
      e.stopPropagation();e.preventDefault();
    },true);
    this.promptEl=sh.querySelector('.prompt');
    this.capEl.querySelector('.ok').onclick=()=>{
      const v=this.capEl.querySelector('input').value.trim();
      if(v)this.setCaption(v,'own');
    };
    this.capEl.querySelector('input').onkeydown=e=>{
      e.stopPropagation();
      if(e.key==='Enter'){const v=e.target.value.trim();if(v)this.setCaption(v,'own');}
    };
    for(const b of this.afterEl.querySelectorAll('.row button'))
      b.onclick=()=>{b.dataset.a==='export'?this.journeyAction('export'):this.closeAfterglow();};
    for(const b of this.diaryEl.querySelectorAll('button'))
      b.onclick=()=>this.journeyAction(b.dataset.a);
    this.ro=new ResizeObserver(()=>this.resize());this.ro.observe(this);
    this.onKey=e=>{
      const k=e.key.toLowerCase();
      if(e.type==='keydown'){
        if(k==='escape'){this.keys={};this.moveTarget=null;this.attackTarget=null;this.path=null;return;}
        if(this.paused)return;
        if(k==='j'){this.toggleDiary();return;}
        if(k==='f'){this.toggleAudit();return;}
        if(k==='p'){this.togglePop();return;}
        if(k==='m'){this.toggleOverview();return;}
        /* **Ein Eigentümer je Taste** (V8-S4). Georg: »C triggert noch einen (legacy) modal« — und das
         war wörtlich richtig: `hud-v7.js:1396` bindet C auf das Character-Fenster, diese Zeile band C
         auf das alte Roster, und **beide Listener feuerten**. Zwei Fenster auf einen Tastendruck.
         Dieselbe Klasse wie »ein Kamera-Eigentümer« (v9-Plan A): wenn zwei Stellen dasselbe dürfen,
         streiten sie, und der Streit sieht wie ein Fehler aus. Das Skin hat den Vorrang, weil es die
         neuere Ansicht ist; nur ohne Skin fällt es auf das Roster zurück. */
        if(k==='c'){
          /* Gefragt wird das **installierte** Skin, nicht ob das Modul im Fenster liegt: geladen ist
             nicht montiert (auf »läuft« gaten, nie auf »existiert« — dieselbe Regel wie beim
             Skin-Nachfassen am 7.8.). */
          const skinOwnsC=!!(this.HUD&&this.HUD.version&&/v7/.test(this.HUD.version));
          if(!skinOwnsC&&this.toggleRoster)this.toggleRoster();
          return;
        }
        /* Gestaltwandlung auf **V** (V6-S13): eine zufällige Einheit aus dem Bestiarium, nie eine
           Heldenklasse. Zum Durchprobieren der Biome — und nebenbei ein Spielzeug. */
        if(k==='v'){this.shapeShift();return;}
        if(k==='+'||k==='='){this.stepZoom(1);return;}
        if(k==='-'||k==='_'){this.stepZoom(-1);return;}
        if(k==='tab'){e.preventDefault();this.minimal=!this.minimal;this.syncHudMode();
          this.msg(this.minimal?'':'HUD back.');return;}
        if(k==='e'&&this.nearPlace){this.enterPlace(this.nearPlace);return;}
        const sk=SLOT_KEYS.indexOf(k);
        if(sk>=0){this.useKayfabe(sk);return;}
        // Cmd/Ctrl/Alt-Kombis schlucken das keyup (macOS) — gar nicht erst setzen
        if(e.metaKey||e.ctrlKey||e.altKey)return;
        if(['arrowup','arrowdown','arrowleft','arrowright',' '].includes(k))e.preventDefault();
        this.keys[k]=true;if(k===' ')this.tryAttack(this.hero);
      }else this.keys[k]=false;
    };
    this.clearKeys=()=>{this.keys={};};
    window.addEventListener('keydown',this.onKey);window.addEventListener('keyup',this.onKey);
    window.addEventListener('blur',this.clearKeys);
    document.addEventListener('visibilitychange',this.clearKeys);
    this.cv.addEventListener('contextmenu',e=>e.preventDefault());
    /* v10-S9 · Anreden liegt auf der LINKEN Taste und vor allem anderen: wer eine Figur trifft,
       bekommt ihre Blase; wer ins Leere klickt, ändert nichts (gehen bleibt rechts). */
    this.cv.addEventListener('pointerdown',e=>{
      if(e.button!==0||!this.ready||this.paused||this.overview)return;
      const r=this.cv.getBoundingClientRect(),z=this.zoomEff();
      const wx=this.cam.x-r.width/(2*z)+(e.clientX-r.left)/z;
      const wy=this.cam.y-r.height/(2*z)+(e.clientY-r.top)/z;
      const u=this.einheitBei(wx,wy);
      if(u){e.preventDefault();e.stopPropagation();this.anreden(u);}
    },true);
    /* Zeigerposition für die Übersicht: dort trägt nur EIN Ort seinen Namen — der unter dem
       Zeiger (v10-S1f). In CSS-Pixeln, weil `drawOverview` mit `setTransform(dpr)` zeichnet. */
    this.cv.addEventListener('pointermove',e=>{
      const r=this.cv.getBoundingClientRect();
      this.ovPtr={x:e.clientX-r.left,y:e.clientY-r.top};
    });
    this.cv.addEventListener('pointerleave',()=>{this.ovPtr=null;});
    this.cv.addEventListener('pointerdown',e=>{
      window.focus(); // Fokus zurückholen (Chat/Panel stiehlt ihn — danach kamen keine keyups mehr an)
      if(e.button===0)this.clearKeys(); // Linksklick = Steuerung resetten, falls eine Taste hängt
      /* **In der Übersicht reist die LINKE Taste** (V9-B4c). Das Tor über diesem Zweig ließ nur
         `button===2` durch — also reagierte die Karte auf alles außer dem Klick, den man macht.
         Der eigene Hinweistext sagt »click a place to travel, shift+click to drop yourself«: die
         Anweisung auf dem Bildschirm war richtig, die Implementierung war es nicht. Genau Georgs
         »M triggert die map, alter! danach bin ich wieder am strand« — er hat links geklickt.
         Im Spiel bleibt die rechte Taste, was sie war; nur die Karte hört auf beide. */
      if(!this.ready||this.paused)return;
      /* v10-S9: die linke Taste darf jetzt auch im Spiel etwas — **anreden**. Alles andere bleibt,
         wie es war: gehen und schlagen gehören weiter der rechten. */
      if(e.button!==2&&!this.overview&&!e.__anrede)return;
      if(e.button!==0&&e.button!==2)return;
      e.preventDefault();
      const r=this.cv.getBoundingClientRect(),z=this.zoomEff();
      const wx=this.cam.x-r.width/(2*z)+(e.clientX-r.left)/z;
      const wy=this.cam.y-r.height/(2*z)+(e.clientY-r.top)/z;
      if(this.overview){ // God-Mode: Shift setzt den Helden, sonst reist er — die Karte ist der Hub
        if(e.shiftKey){
          if(this.passable(wx,wy)){
            this.hero.x=wx;this.hero.y=wy;this.moveTarget=null;this.path=null;this.attackTarget=null;
            this.cam.x=wx;this.cam.y=wy;this.msg('Placed.');
          }else this.msg('Not walkable there.');
          return;
        }
        /* **Jeder Ort ist ein Reiseziel** (V9-B4). Vorher prüfte der Klick nur Kampfzonen und das
           Wirtshaus — ein Klick auf Marktplatz, Archiv oder Turm tat gar nichts, die Karte schloss,
           und man stand wieder da, wo man war: Georgs »M triggert die map, danach bin ich wieder am
           strand«. Die Trefferfläche rechnet in WELTpixeln, damit sie bei jeder Zoomstufe gleich ist. */
        let bp=null,bd=1e9;
        for(const p of (this.places||[])){
          const d=Math.hypot(wx-p.x,wy-p.y);if(d<bd){bd=d;bp=p;}
        }
        const Rr=this.reader;
        if(Rr){
          const rx=(Rr.x+Rr.w/2)*TILE,ry=(Rr.y+Rr.h/2)*TILE;
          const d=Math.hypot(wx-rx,wy-ry);
          /* Das Ziel ist **vor** der Karte, nicht darauf (V9-B4e): Georg will Anreise und Trigger als
             Flow prüfen, und der Aggro-Trigger hängt am Überschreiten der Tusche — wer mitten auf dem
             Blatt landet, hat ihn übersprungen. Dieselben drei Felder wie die Sprungmarke im
             Abnahmeblatt: **eine** Anreise, nicht zwei. */
          if(d<bd){bd=d;bp={x:rx,y:(Rr.y+Rr.h+2)*TILE,label:'the card',_card:true};}
        }
        if(bp&&bd<TILE*10){this.travelPoint(bp.x,bp.y+(bp._card?0:70),bp.label||bp.id);return;}
        const zo=this.zones.find(z=>wx>=(z.x-2)*TILE&&wx<(z.x+z.w+2)*TILE
          &&wy>=(z.y-2)*TILE&&wy<(z.y+z.h+2)*TILE);
        if(zo){this.travelTo(zo);return;}
        /* Die alten Radien (tavern 200 · places 150 · spawn 200) sind **weg**, nicht liegengelassen:
           der Test oben fängt dieselbe Entscheidung schon ab, und zwei Wahrheiten für eine Frage
           laufen beim nächsten Fork auseinander (»eine Zahl, ein Ort«). */
        if(this.spawn&&Math.hypot(wx-this.spawn.x,wy-this.spawn.y)<TILE*4){
          this.travelPoint(this.spawn.x,this.spawn.y,'camp');return;
        }
        /* **Ein leerer Klick reist nicht quer über die Insel** (v10-S1f, Georgs Befund: »bei Klick
           auf die Map werde ich immer wieder zum Strand teleportiert«). Hier stand
           `setMoveTarget(wx,wy)` — ein Laufbefehl auf einen Punkt, der in der Lagune meist im
           Wasser liegt; der Wegfinder nimmt dann das nächste erreichbare Feld, und das ist die
           Küste. Die Karte hat es nie gesagt, der Held stand plötzlich am Strand.
           Jetzt: begehbares und verbundenes Land ist ein Ziel, alles andere ist keins. */
        const tx=Math.floor(wx/TILE),ty=Math.floor(wy/TILE);
        if(this.walk(tx,ty)&&this.sameLand(tx,ty)){this.travelPoint(wx,wy,'the map',1);return;}
        this.msg('Nothing to travel to there.');
        return;
      }
      const m=this.mobs.find(m=>m.hp>0&&Math.hypot(m.x-wx,m.y-(wy+30))<48);
      if(m){this.attackTarget=m;this.moveTarget=null;this.path=null;}
      else this.setMoveTarget(wx,wy);
    });
    this.boot();
  }
  disconnectedCallback(){
    cancelAnimationFrame(this.raf);this.ro.disconnect();
    window.removeEventListener('keydown',this.onKey);window.removeEventListener('keyup',this.onKey);
    window.removeEventListener('blur',this.clearKeys);
    document.removeEventListener('visibilitychange',this.clearKeys);
  }
  /* **Renderskala** (v10-S1a). Der Befund aus S1: die teuerste Schicht kostet durch FLÄCHE, nicht
     durch Pfade — eine vollbildgroße texturierte Füllung ~12 ms, egal wie sie gezeichnet wird. Der
     einzige große Hebel ist also die Zahl der Pixel. Die Leinwand wird kleiner gerechnet und vom
     Browser hochgezogen (`image-rendering:pixelated`, also nearest — bei Pixelkunst ist das kein
     Weichzeichner, sondern größeres Korn). Nur die Dichte ändert sich: `dpr` trägt den Faktor, und
     Kamera, Zoom, Rasterung und Physik hängen ohnehin an `dpr` — die Welt bleibt gleich groß. */
  resize(){
    const rs=+this.att.renderScale||1;
    const d=Math.min(devicePixelRatio||1,2)*rs;
    this.cv.width=Math.max(2,this.clientWidth*d);this.cv.height=Math.max(2,this.clientHeight*d);
    this.dpr=d;
  }
  msg(t){
    const ab=this._kaufAbgelehnt;
    if(ab&&Date.now()-ab.t<1500&&/skill point spent/i.test(String(t))){
      this._kaufAbgelehnt=null;t=ab.note;   // der wahre Satz statt des behaupteten
    }
    if(this.msgs[this.msgs.length-1]===t)return; // dieselbe Meldung zweimal ist keine Meldung
    // Die Beats sind seit V4-S3 eine scrollbare Spalte, keine Vierzeilen-Blende:
    // die Geschichte bleibt lesbar, auch wenn man erst später hinsieht.
    this.msgs.push(t);if(this.msgs.length>40)this.msgs.shift();
    this.logEl.innerHTML=this.msgs.map(m=>`<div>${m}</div>`).join('');
  }
  async boot(){
    if(!await this.waitForDeps())return;
    // Bodenschicht im Hintergrund laden — das Spiel wartet nicht darauf, es fällt auf die
    // flache Zonen-Tönung zurück, bis die Blätter da sind (»auf läuft gaten, nie auf existiert«)
    if(window.OW_GROUND)OW_GROUND.ready().catch(e=>console.warn('[ground]',e.message));
    const TC=this.att.townColor||'Blue';
    const want=[
      ['flat',P10+'Terrain/Ground/Tilemap_Flat.png'],
      ['water',P10+'Terrain/Water/Water.png'],
      ['foam',P10+'Terrain/Water/Foam/Foam.png'],
      ['bridge',P10+'Terrain/Bridge/Bridge_All.png'],
      ['dead',P10+'Factions/Knights/Troops/Dead/Dead.png'],
      ['tavern',(window.OW_UNITS.props.goblin_hut||{}).url],
      /* Eine Stadt, eine Farbe (Georg 7.8.): vorher stand ein rotes Haus neben einer blauen Burg,
         einem lila Kloster und einem gelben Turm — vier Fraktionen auf einem Marktplatz.
         Amaurotum gehört dem Hof, also trägt es dessen Farbe. Umschaltbar über `town-color`. */
      ['b_house',PFREE+'Buildings/'+TC+'%20Buildings/House1.png'],
      ['b_castle',PFREE+'Buildings/'+TC+'%20Buildings/Castle.png'],
      ['b_monastery',PFREE+'Buildings/'+TC+'%20Buildings/Monastery.png'],
      ['b_tower',PFREE+'Buildings/'+TC+'%20Buildings/Tower.png'],
      ['b_house2',PFREE+'Buildings/'+TC+'%20Buildings/House2.png'],
      ['b_house3',PFREE+'Buildings/'+TC+'%20Buildings/House3.png'],
      ['deadtree',(window.OW_UNITS.props.dead_tree||{}).url],
      ['sheep',P10+'Resources/Sheep/HappySheep_Idle.png'],
      ['bone0',((window.OW_UNITS.props.bones||[])[0])||''],
      ['bone1',((window.OW_UNITS.props.bones||[])[1])||''],
      ['bone2',((window.OW_UNITS.props.skull_spikes||[])[0])||''],
      ['tree1',PFREE+'Terrain/Resources/Wood/Trees/Tree1.png'],
      ['tree2',PFREE+'Terrain/Resources/Wood/Trees/Tree2.png'],
      ['wrock1',P10+'Terrain/Water/Rocks/Rocks_01.png'],
      ['wrock2',P10+'Terrain/Water/Rocks/Rocks_02.png'],
    ];
    for(let i=1;i<=18;i++)want.push(['deco'+i,P10+'Deco/'+String(i).padStart(2,'0')+'.png']);
    this.img={};let done=0;this.loadN.textContent='0/'+want.length;
    const results=await Promise.allSettled(want.map(async([k,u])=>{
      this.img[k]=await loadImg(u);done++;this.loadN.textContent=done+'/'+want.length;
    }));
    const failed=results.map((r,i)=>r.status==='rejected'?want[i][1]:null).filter(Boolean);
    const core=['flat','water','foam'];
    if(core.some(k=>!this.img[k])){
      this.errEl.textContent='Core assets missing:\n'+failed.join('\n');return;
    }
    if(failed.length)console.warn('[overworld] optional fehlgeschlagen:',failed);
    /* Generierte Requisiten (V7-S1). Auf „läuft" gaten, nicht auf „existiert": das Blatt wird
       gemessen, freigestellt und in zwei Fassungen gebacken — schlägt irgendetwas davon fehl,
       bleibt `this.PROPS` null und die Welt streut wie bisher Tiny Swords. Kein halber Zustand. */
    this.PROPS=null;
    if(window.OW_PROPS&&this.att.propSheet!=='tiny'){
      try{
        const cat=await OW_PROPS.ready();
        if(cat&&cat.total>0){this.PROPS=OW_PROPS;
          console.log('[overworld] Prop-Blätter:',cat.sheets.length,'·',cat.total,'Requisiten ·',
            'Gitter im Blatt:',cat.sheets.map(s=>s.id+' '+(s.probe.onGrid?'ja':'nein')).join(' · '));}
      }catch(e){console.warn('[overworld] Prop-Blatt nicht nutzbar:',e.message);}
    }
    try{await this.loadHeroUnit();}
    catch(e){this.errEl.textContent='Hero could not be loaded:\n'+e.message;return;}
    this.foam=probeStrip(this.img.foam);
    // Dead.png ist ein Raster-Sheet (Skelett + Geist) — als Zellen bizarroen, nie ganz zeichnen
    this.deadSheet=null;
    if(this.img.dead){
      const di=this.img.dead;
      const cell=(di.width%128===0&&di.height%128===0)?128:64;
      const rows=probeRows(di,cell);
      this.deadSheet={img:di,cell,rows};
      console.log('[overworld] dead sheet',di.width+'×'+di.height,'cell',cell,'rows',JSON.stringify(rows));
    }
    this.flatCols=Math.floor(this.img.flat.width/TILE);
    this.sandBX=(this.flatCols>=10)?5:4;
    this.waterColor=sampleColor(this.img.water);
    console.log('[overworld] geladen:',done+'/'+want.length,
      '· foam',this.foam.frames,'frames · flat',this.flatCols,'cols → sandBX',this.sandBX);
    await this.loadDeck();
    const saved=OWJ.read();
    if(saved&&saved.runSeed===this.att.seed){
      this.pendingSave=saved;
      console.log('[journey] found save for seed',saved.runSeed,'· saved',saved.savedAt||'?');
    }
    this.buildWorld();
    this.loadEl.style.display='none';this.pill.style.display='';this.panel.style.display='';
    this.hintEl.style.display='';this.hintEl.classList.toggle('on',!!this.helpOn); // Hilfe standardmäßig aus
    this.resize();this.ready=true;
    /* v10-S13b · **Der Einbau hing an einem Anker, den es nicht gab.** `replaceText` wirft nicht,
       wenn der Suchtext fehlt — die Verdrahtung war also stillschweigend nie passiert, das Modul lag
       geladen daneben und der Regler `rss` schaltete nichts. Jetzt hängt sie hier, wo die Welt
       fertig steht. *Eine Ersetzung, die nichts findet, meldet nichts — geprüft wird am geladenen
       Stand, nicht am geschriebenen Code.* */
    if(window.OW_RSS){
      if(this.att.rss==='on')OW_RSS.start(this);
      else OW_RSS.offline();
    }
    this.msg(`This island runs on »${this.deck.title}«`);
    let last=performance.now();
    const loop=t=>{
      const rohMs=t-last;
      let dt=Math.min(0.05,rohMs/1000);last=t;
      /* Die WIRKLICHE Bildzeit, ungeklemmt. `dt` ist fuer die Physik begrenzt; wer daraus die
         Bildrate rechnet, misst die Grenze (1/0,05 = 20,0 fps konstant) statt der Wirklichkeit. */
      if(rohMs>0&&rohMs<4000)
        this.stats.msFrame=this.stats.msFrame?this.stats.msFrame*0.9+rohMs*0.1:rohMs;
      if(this.freeze>0){this.freeze-=dt;dt=0;}
      this.time+=dt;
      this.step(dt);this.stepReader(dt);this.draw();
      this.raf=requestAnimationFrame(loop);
    };
    this.raf=requestAnimationFrame(loop);
  }
  // Katalog + Loader kommen als eigene Skripte — auf „läuft" gaten, nicht auf „existiert"
  async waitForDeps(){
    const aiUp=()=>window.OW_AI&&typeof window.OW_AI.step==='function';
    const srcUp=()=>window.OW_SRC&&typeof window.OW_SRC.a2d==='function';
    for(let i=0;i<120&&!(srcUp()&&window.OW_LOADER&&window.OW_UNITS&&window.OW_KAYFABE&&window.OW_JOURNEY&&aiUp());i++)
      await new Promise(r=>setTimeout(r,50));
    OWL=this.OWL=window.OW_LOADER;OWK=this.OWK=window.OW_KAYFABE;OWJ=this.OWJ=window.OW_JOURNEY;
    // Auf „läuft" gaten, nicht auf „existiert": erst wenn step() eine Funktion ist, gilt das Gehirn
    /* v10-S19d · **Nicht einfangen, nachschlagen.** `this.OWA=window.OW_AI` hat die Instanz
       eingefroren, die beim Weltaufbau zufällig da war. Wird das Modul später erneut ausgewertet
       (Neuladen einer Datei, zweiter Script-Tag, Hot-Reload), zeigt `window.OW_AI` auf eine andere —
       und dann laufen zwei Gehirne mit zwei Zählern: gemessen `report().bubbles` **0** gegen **219**
       im selben Augenblick. Ein Getter kann nicht veralten.
       Auf »läuft« gaten bleibt: ohne `step()` gibt es kein Gehirn. */
    Object.defineProperty(this,'OWA',{configurable:true,
      get(){return (window.OW_AI&&typeof window.OW_AI.step==='function')?window.OW_AI:null;}});
    if(this.OWA)window.__owAi={report:()=>this.OWA.report(this),reset:()=>this.OWA.reset(this),game:this};
    this.audio=window.OW_AUDIO||null;
    if(this.audio){
      this.audio.enabled=this.att.sound!==false;
      this.audio.init();
      const wake=()=>{this.audio.resume();};
      this.audio.onSay=txt=>{if(this.hero)this.say(txt,1.5,'shout');};
      window.addEventListener('pointerdown',wake,{once:true});
      window.addEventListener('keydown',wake,{once:true});
    }
    if(!OWL||!window.OW_UNITS||!OWK||!OWJ||!this.OWA){
      this.errEl.textContent='unit-loader.js / units-catalog.js / kayfabe-abilities.js / journey.js / mob-ai.js not loaded.';
      return false;
    }
    return true;
  }
  // Der Held ist der Maßstab: seine gemessene Körperhöhe ist die Referenz für alle sizeRel-Werte.
  async loadHeroUnit(){
    const CAT=window.OW_UNITS;
    const h=String(this.att.hero||'warrior');
    /* Aufgelöst wird im Katalog (V6-S1): Knights nach Farbe, Helden aus Einzelframes (§19)
       über OW_HERO, jedes Wesen des Bestiariums als es selbst. Der Runner kennt die Fälle
       nicht mehr — er kennt nur die Frage. */
    const r=await CAT.heroDef(h,this.att.color);
    const id=r.id,def=r.def;
    /* Die Bezugsgröße der Welt ist eine ZAHL, nicht der jeweilige Held. Vorher hing sie an
       ¦srcBodyH¦ des geladenen Packs — damit skalierte jeder Heldenwechsel das ganze Bestiarium
       (gemessen 2026-08-06: Rogue-Frames sind 128 × 128 mit viel Luft, Körper **50 px**; der Held
       stand als Mook neben 71–111 px hohen Gegnern, oder die Gegner schrumpften auf ihn). Der
       Warrior-Körper (91 px) ist die Referenz, gegen die das Bestiarium gemessen wurde — die bleibt. */
    this.heroUnit=await this.OWL.loadUnit(id,def,{refBody:HERO_REF});
    this.refBody=HERO_REF;
    // v11-U2: das Geschossblatt vorwärmen, solange noch niemand schießt — der erste Wurf soll
    // fliegen, nicht laden.
    if(window.OW_SHOTS)OW_SHOTS.warm(this.heroUnit);
    console.log('[overworld] Held',h,'→',id,'· sizeRel',def.sizeRel,'· Körper',
      Math.round(this.heroUnit.bodyH)+'px gegen HERO_REF '+HERO_REF,
      /* v11-U1: das Tempo hängt jetzt am Körper (game-feel `bodyFactor`) — also steht es hier,
         wo der Körper gemeldet wird, und nicht in einer zweiten Zeile woanders. */
      window.OW_FEEL&&OW_FEEL.bodyFactor
        ?'· Tempo '+Math.round(OW_FEEL.T.base*OW_FEEL.bodyFactor({unit:this.heroUnit}))+'px/s':'',
      this.heroUnit.bump?'· kein Hieb → Rempler':'');
    if(this.hero)this.hero.unit=this.heroUnit;
  }
  /* Der gespielte Charakter kommt in der Welt nicht als Gegner vor. Eine Stelle, überall gelesen. */
  notMe(list){
    const me=String(this.att.hero||'');
    const out=(list||[]).filter(x=>x!==me);
    return out.length?out:(list||[]);
  }
  /* Bestiarium: je Zone zwei Grundtypen + ab Zone 2 ein Elite, gewürfelt aus dem zoneSeed.
     Geladen wird nur, was diese Insel braucht — nicht der ganze Katalog. */
  async populate(){
    const tok=(this._popTok=(this._popTok||0)+1);
    const CAT=window.OW_UNITS,s=this.att.seed,need=new Set();
    for(const [zi,z] of this.zones.entries()){
      /* Den Spieler gibt es einmal (Georg 7.8.): wer als Goblin spielt, trifft keinen zweiten
         Goblin desselben Blattes. Fällt der Pool dadurch leer, bleibt er wie er war — eine leere
         Zone wäre der schlechtere Fehler. */
      /* v10-S3a · **Die Tutorial-Zone ist keine bewachte Zone, sie ist eine Lektion.** Georg 9.8.:
         Wächter → EIN Kampf → Reveal → Almanach. Keine drei Wellen, kein Elite, kein Mob-Teppich.
         Zwei Einheiten, mehr nicht: das Skelett hält die Karte, das Schwein steht daneben und
         schlägt erst zurück, wenn man es schlägt. */
      if(z.tutorial){
        z.tutorialGuard=this.notMe(['skull','thief'])[0]||'skull';
        z.tutorialPig=this.notMe(['pig'])[0]||null;
        z.roster=z.tutorialPig?[z.tutorialGuard,z.tutorialPig]:[z.tutorialGuard];
        z.eliteId=null;
        for(const id of z.roster)need.add(id);
        continue;
      }
      const b=BESTIARY[z.biome]||BESTIARY.camp;
      const pool=this.notMe(b.melee);
      const a=pool[Math.floor(rand2(zi,31,z.zseed)*pool.length)];
      let c=pool[Math.floor(rand2(zi,37,z.zseed^0x9e37)*pool.length)];
      if(c===a&&pool.length>1)c=pool[(pool.indexOf(a)+1)%pool.length];
      z.roster=[a,c];
      // Elite bevorzugt aus einem Typ, der noch nicht im Roster steht — sonst kostet er Varianz
      let el=null;
      if(zi>0&&b.elite&&b.elite.length){
        const eli=this.notMe(b.elite);
        const fresh=eli.filter(x=>x!==a&&x!==c),src=fresh.length?fresh:eli;
        el=src[Math.floor(rand2(zi,41,z.zseed)*src.length)];
      }
      z.eliteId=el;
      if(z.eliteId&&!z.roster.includes(z.eliteId))z.roster.push(z.eliteId);
      for(const id of z.roster)need.add(id);
    }
    const ids=[...need],units={};
    await Promise.all(ids.map(async id=>{
      try{units[id]=await this.OWL.loadUnit(id,CAT.enemies[id],{refBody:this.refBody});}
      catch(e){console.warn('[overworld] Einheit fällt aus:',id,e.message);}
    }));
    if(tok!==this._popTok)return; // Seed wurde während des Ladens gewechselt — Rückweg
    this.mobs=[];
    for(const [zi,z] of this.zones.entries()){
      const list=z.roster.map(id=>units[id]).filter(Boolean);
      if(!list.length){z.alive=0;continue;}
      if(z.tutorial){
        z.alive=0;
        const gu=units[z.tutorialGuard];
        if(gu){
          // Der Wächter steht am Tor — dort, wo man hereinkommt, und auf der Tuschelinie, an der
          // seit v10-S2d seine Aggro hängt. 34 HP: ein Kampf, keine Prüfung.
          const g=this.makeGuard(gu,z,z.gate.x,z.gate.y,{hp:34,dmg:6,lv:1});
          g.tutorial=true;
          this.mobs.push(g);z.alive=1;
        }
        const pu=z.tutorialPig&&units[z.tutorialPig];
        if(pu){
          const px=(z.x+2.5)*TILE,py=(z.y+z.h-2.5)*TILE;
          if(this.passable(px,py)&&!this.aufBlatt(px,py)){   // v12-Z1
            const c=this.makeCritter(pu,z,px,py);
            c.trainee=true;c.hp=c.maxhp=22;c.dmg=4;
            this.mobs.push(c);
          }
        }
        console.log('[tutorial] Zone 0 ·',z.tutorialGuard,'am Tor',z.gate.x+','+z.gate.y,
          '· Übungsgegner',z.tutorialPig||'—','· alive',z.alive);
        continue;
      }
      // Drei als Regel, mehr nur wo ein Elite steht — eine Zone ist bewacht, kein Mob-Teppich
      const n=Math.min(6,3+(z.eliteId?1:0)+(zi%3===0?1:0));
      const pts=this.spawnPoints(z,n);
      z.alive=0;
      for(let k=0;k<pts.length;k++){
        const isElite=!!(z.eliteId&&units[z.eliteId]&&zi>0&&k===pts.length-1);
        const isGuard=k===0;
        const un=isElite?units[z.eliteId]:list[k%Math.min(2,list.length)];
        const mx=(pts[k].x+0.5)*TILE,my=(pts[k].y+0.5)*TILE;
        const tier=k%3,hp=Math.round((26+8*tier)*(isElite?1.9:(isGuard?1.4:1)));
        this.mobs.push({zone:z,unit:un,elite:isElite,guard:isGuard,sizeMul:isElite?1.22:1,
          x:mx,y:my,hx:mx,hy:my,hp,maxhp:hp,
          dmg:Math.round((6+2*tier)*(isElite?1.5:1)),
          lv:1+tier+(isElite?2:0),
          xp:isElite?XP_SRC.elite:XP_SRC.mob,
          state:'idle',anim:rand2(k,zi,s)*5,face:1,dir:'side',atkT:0,atkKey:'idle',combo:0,
          slot:k*Math.PI*2/Math.max(1,pts.length)+rand2(k,zi,z.zseed)*0.6,
          cool:0,didHit:false,wt:0,wx:mx,wy:my,aggro:false});
        z.alive++;
      }
    }
    const kinds=new Set(this.mobs.map(m=>m.unit.id));
    console.log('[overworld] Bestiarium:',
      this.zones.map(z=>z.biome+' › '+z.roster.join('+')+(z.eliteId?' ★'+z.eliteId:'')).join(' | '),
      '· Einheiten geladen',Object.keys(units).length+'/'+ids.length,
      '· Mobs',this.mobs.length,'· Typen gleichzeitig',kinds.size,
      '· ranged im Katalog (wartet auf Projektile):',
      Object.values(CAT.enemies).filter(e=>e.role==='ranged').length);
    /* Abnahmezahl zu Georgs Schattenregel (V7-S6): eine Auflage bekommt NUR, wer gemessen keine
       mitbringt. Bei Tiny Swords ist das nie der Fall — steht hier »eigene Auflage 0«, ist die Regel
       eingehalten; steht dort eine Zahl, gehört sie zu einem unserer eigenen Blätter. */
    const ell=Object.values(units).filter(u=>u.shadow==='ellipse');
    console.log('[shadow]',this.att.shadow,'· Einheiten mit eigener Auflage',ell.length+'/'+
      Object.keys(units).length,ell.length?'('+ell.map(u=>u.id).join(', ')+')':'· alle Blätter backen selbst');
    this.msg(`Bestiary: ${kinds.size} enemy types on this island.`);
    this.spawnRoadside(units);
    await this.spawnCritters();
    await this.spawnTowerGuard();
    this.loadKing();
    if(this.pendingSave){
      this.applyJourney(this.pendingSave);
      this.pendingSave=null;
      this.msg('Journey restored — the island is new, the evidence is not.');
      this.updateHud();
    }
  }
  /* v11-U1: ein Rempler wiegt weniger als ein Hieb — sonst wäre das Schaf die beste Wahl im Spiel.
     0,55 gerechnet am Tor-Wächter (34 HP, Bizarro 1 → 10 Schaden): mit Hieb fällt er in 4 Schlägen,
     mit Rempler in 7. Spürbar, aber nicht sperrend. */
  heroDamage(){const d=6+4*this.hero.stats.bizarro;
    return Math.round(d*(this.hero.unit&&this.hero.unit.bump?0.55:1));}
  /* Die Welt als Spielzeug (V4-S2): Kreaturen leben in der Welt, nicht in der Kampfrechnung.
     Sie zählen nicht zur Zone (`z.alive` bleibt unberührt), geben keine Erfahrung und wehren sich
     nicht — sie rennen. Wer sie trotzdem erschlägt, sammelt Ruf statt XP. */
  async spawnCritters(){
    const CAT=window.OW_UNITS;
    if(!CAT.critters||!CAT.critters.sheep||!this.zones.length)return;
    let un;
    try{un=await this.OWL.loadUnit('sheep',CAT.critters.sheep,{refBody:this.refBody});}
    catch(e){console.warn('[overworld] Kreatur fällt aus: sheep —',e.message);return;}
    const s=this.att.seed;let n=0;
    for(const [zi,z] of this.zones.entries()){
      const k=1+(rand2(zi,71,s)<0.5?1:0);
      for(let i=0;i<k;i++){
        const px=(z.x+1+rand2(zi*7+i,73,s)*(z.w-2))*TILE;
        const py=(z.y+1+rand2(zi*7+i,79,s)*(z.h-2))*TILE;
        if(!this.passable(px,py)||this.aufBlatt(px,py))continue;   // v12-Z1
        this.mobs.push(this.makeCritter(un,z,px,py));n++;
      }
    }
    const garden=(this.places||[]).find(p=>p.id==='garden');
    if(garden)for(let i=0;i<2;i++){ // die Stadt ist auch Welt
      const px=garden.x+56+i*44,py=garden.y+30+i*16;
      if(this.passable(px,py)){const c=this.makeCritter(un,this.zones[0],px,py);
        c.town=true;c.faction='townsfolk';   // Stadttiere gehören den Städtern, nicht dem Biome
        this.mobs.push(c);n++;}
    }
    console.log('[overworld] Kreaturen:',n,'· Körper',Math.round(un.bodyH)+'px');
  }
  /* v10-S11 · **WEGELAGERER** (Georg 9.8.). Kämpfen lernen soll keinen Umweg über Tutorial oder
     Card Zone brauchen: am Wegesrand stehen kleine Gruppen auf niedrigem Level, die man im
     Vorbeigehen anspricht oder anschlägt.

     Drei Eigenschaften, die sie von Zonenwächtern unterscheiden:
       · **kein Fortschritt** — ihre Pseudo-Zone trägt `noProgress`, es gibt keine Karte zu räumen
       · **kurze Leine** — sie verteidigen ihren Fleck, sie jagen niemanden über die Insel
       · **sie stehen am WEG**, nicht im Nirgendwo: gesetzt wird auf Feldern neben `this.paths`,
         mit Abstand zu Orten und Zonen. Wer läuft, trifft sie; wer sucht, muss nicht suchen.

     Geladen wird **nichts Neues**: die Gruppe nimmt Einheiten, die für die Zonen ohnehin im Speicher
     liegen. Ein Trainingsgegner, der eine eigene Ladezeit kostet, ist kein Trainingsgegner. */
  spawnRoadside(units){
    const frei=Object.values(units||{}).filter(Boolean);
    if(!frei.length||!this.paths||!this.paths.size)return;
    const W=this.W,s=this.att.seed;
    const wege=[...this.paths];
    const weit=(x,y)=>{
      /* **Neben dem Weg heißt: NICHT auf dem Weg.** Der Versatz ±2 reicht dafür nicht — an
         L-aufgefüllten Kreuzungen und Doppelspuren (316 Wegfelder) landet er wieder auf der Straße
         (gemessen: Lager 3 saß auf 194,95, einem Wegfeld). Also die Frage direkt stellen, statt sie
         aus dem Abstand zu erschließen. */
      if(this.paths.has(y*W+x))return false;
      for(let ax=-1;ax<=1;ax++)for(let ay=-1;ay<=1;ay++)
        if(this.paths.has((y+ay)*W+(x+ax))&&(ax||ay)===0)return false;
      for(const p of (this.places||[]))if(Math.abs(p.tx-x)<10&&Math.abs(p.ty-y)<10)return false;
      for(const z of this.zones)
        if(x>z.x-4&&x<z.x+z.w+4&&y>z.y-4&&y<z.y+z.h+4)return false;
      for(const r of (this.roadside||[]))if(Math.hypot(r.x-x,r.y-y)<22)return false;
      return true;
    };
    this.roadside=[];
    const ziel=3;
    for(let t=0;t<wege.length&&this.roadside.length<ziel;t++){
      const i=wege[Math.floor(rand2(t,17,s)*wege.length)];
      const px=i%W, py=(i/W)|0;
      // Zwei Felder neben den Weg, nicht darauf — ein Lager auf der Straße blockiert die Reise
      const dx=rand2(t,23,s)<0.5?-2:2, dy=rand2(t,29,s)<0.5?-2:2;
      const x=px+dx, y=py+dy;
      if(!this.walk(x,y)||!weit(x,y))continue;
      this.roadside.push({x,y});
    }
    const zoneOf=(k,x,y)=>({zseed:(this.att.seed^(0x51ed+k*7))>>>0,biome:'camp',
      cleared:false,alive:0,noProgress:true,roadside:true,
      card:{n:0,t:'the roadside'},x:x-3,y:y-3,w:7,h:7,roster:[]});
    let n=0;
    for(const [k,spot] of this.roadside.entries()){
      const z=zoneOf(k,spot.x,spot.y);
      const wieViele=2+Math.floor(rand2(k,31,s)*2);   // zwei oder drei — eine Gruppe, kein Teppich
      for(let j=0;j<wieViele;j++){
        const un=frei[Math.floor(rand2(k*5+j,37,s)*frei.length)];
        const x=(spot.x+(j%2?1:-1)*(0.6+j*0.35))*TILE, y=(spot.y+(j>1?0.9:0))*TILE;
        if(!this.passable(x,y))continue;
        // Auch die einzelnen Plätze halten die Straße frei — sonst steht das Lager daneben,
        // die Gruppe aber darauf.
        if(this.paths.has(Math.floor(y/TILE)*W+Math.floor(x/TILE)))continue;
        /* Niedrig heißt niedrig: 16 HP, 3 Schaden. Sie sollen den Schlagabtausch zeigen, nicht
           den ersten Spieler erschlagen. */
        const m=this.makeGuard(un,z,Math.round(x/TILE),Math.round(y/TILE),
          {hp:16,dmg:3,lv:1,xp:POP_SRC.mob});
        m.guard=false;m.roadside=true;m.x=x;m.y=y;m.hx=x;m.hy=y;m.wx=x;m.wy=y;
        this.mobs.push(m);n++;
      }
    }
    console.log('[wegelagerer]',this.roadside.length,'Lager ·',n,'Gegner am Weg ·',
      'Felder im Wegenetz',this.paths.size);
  }
  makeCritter(un,z,x,y){
    return{zone:z,unit:un,critter:true,peaceful:true,elite:false,guard:false,sizeMul:1,
      x,y,hx:x,hy:y,hp:12,maxhp:12,dmg:3,lv:1,xp:0,   // 3 Schaden: feindliche Kreaturen sollen beißen können
      state:'idle',anim:rand2(x|0,y|0,5)*4,face:1,dir:'side',atkT:0,atkKey:'idle',combo:0,
      cool:0,didHit:false,aggro:false,frozen:0,lastHit:-99};
  }
  /* Sechs Werte plus **Fluff als Getter**. Nicht aufzählbar, damit `JSON.stringify` im Spielstand
     nur die echten sechs schreibt — sonst läge die abgeleitete Zahl im Save und wäre beim nächsten
     Laden die zweite Wahrheit. */
  freshStats(from){
    const st={};
    for(const k of STAT_KEYS)st[k]=(from&&from[k]!=null)?(from[k]|0):START_STATS[k];
    Object.defineProperty(st,'fluff',{get:()=>fluffOf(st),enumerable:false,configurable:true});
    return st;
  }
  /* POP kommt aus Taten, nie aus Kayfabe (kein Snowball) — die Regel aus der alten Spec bleibt.
     Der alte Name `gainXp` bleibt als Aufrufer-Alias stehen; die Wahrheit heißt `pop`. */
  gainPop(n,x,y){
    const h=this.hero;if(!n)return;
    h.pop+=n;h.popTotal+=n;
    this.floaters.push({x:x!=null?x:h.x,y:(y!=null?y:h.y)-96,txt:'+'+n+' POP',t:0,c:'#c58ce0'});
    /* Kein Level-Up mehr, keine Unterbrechung: POP liegt bereit, ausgegeben wird im Menü.
       Gemeldet wird nur, wenn der Held sich zum ersten Mal etwas leisten kann. */
    const billig=Math.min(...STAT_KEYS.map(k=>POP_COST.stat(h.stats[k])));
    if(h.pop>=billig&&!this._popHint){
      this._popHint=true;
      this.msg('POP to spend — open the character sheet (C).');
      if(this.hudWake)this.hudWake('panel',3);
    }
    if(h.pop<billig)this._popHint=false;
  }
  gainXp(n,x,y){return this.gainPop(n,x,y);}
  /* **Die eine Preisliste.** Sie steht im Menü, nie im Bild (K1). */
  popCost(kind,key){
    const h=this.hero;
    if(kind==='stat')return POP_COST.stat(h.stats[key]);
    if(kind==='slot')return h.slots>=3?null:(h.slots===1?POP_COST.slot2:POP_COST.slot3);
    return null;
  }
  /* Eine Menü-Transaktion: prüfen, abbuchen, anwenden, melden. Gibt {ok,note} zurück, damit jede
     Oberfläche (meine, WS0s) dieselbe Antwort bekommt statt eigener Regeln. */
  popSpend(kind,key){
    const h=this.hero;
    if(kind==='stat'&&!STAT_KEYS.includes(key)){
      /* `fluff` ist seit V10-S6 ein Getter. Eine Zuweisung darauf **wirft** in diesem Modul
         ('use strict') — und das v7-HUD bietet genau diesen Knopf noch an (es kennt die alten drei).
         Also hier abfangen, mit Grund, statt drüben im fremden Code zu reparieren. */
      return{ok:false,note:key==='fluff'
        ?'Fluff follows from the six — raise one of those.'
        :'Unknown stat.'};
    }
    const cost=this.popCost(kind,key);
    if(cost==null)return{ok:false,note:'Nothing left to buy.'};
    if(h.pop<cost)return{ok:false,note:'Not enough POP — '+cost+' needed.'};
    h.pop-=cost;
    if(kind==='stat'){
      h.stats[key]=(h.stats[key]|0)+1;
      const vor=h.maxhp;
      h.maxhp=h.stats.fluff*FLUFF_UNIT;
      if(h.maxhp>vor)h.hp=Math.min(h.maxhp,h.hp+(h.maxhp-vor));   // mehr Fluff heilt mit
      if(key==='kayfabe')h.charges=Math.min(h.stats.kayfabe,h.charges+1);
      this.diary.push({t:'pop',text:'Spent '+cost+' POP on '+STAT_INFO[key].name+'.'});
      this.msg(STAT_INFO[key].name+' is now '+h.stats[key]+' · Fluff '+h.stats.fluff);
    }else{
      h.slots++;
      this.diary.push({t:'pop',text:'Bought act slot '+h.slots+' for '+cost+' POP.'});
      this.msg('Act slot '+h.slots+' is open.');
    }
    if(this.audio)this.audio.sfx('confirm');
    this.autosave();this.updateHud();
    console.log('[pop]',kind,key||'','−'+cost,'· Rest',h.pop,'· Stats',JSON.stringify(h.stats),
      '· Fluff',h.stats.fluff);
    return{ok:true,note:'−'+cost+' POP'};
  }
  /* **Der Bedienweg zu POP** (V10-S6b). Der Umbau war über die API grün und über den Schalter tot:
     das v7-HUD kennt nur die alten drei Werte und hängt seine »+«-Knöpfe an `skillPoints`, das es
     nicht gab. Genau die Fehlerklasse aus Hausregel 4. Also ein eigenes Blatt, das dem Runner
     gehört: sechs Werte, ein Slot, Preise daneben, **P** öffnet es. Wenn WS0 in Paket 3 POP
     anzeigt, kann es weg — bis dahin ist es der Weg, auf dem man wirklich klickt. */
  togglePop(an){
    const el=this.popEl;if(!el)return;
    const auf=(an==null)?el.style.display!=='flex':!!an;
    if(!auf){el.style.display='none';this.paused=false;this.keys={};return;}
    this.renderPop();
    el.style.display='flex';this.paused=true;
    if(this.audio)this.audio.sfx('uiOpen');
  }
  renderPop(){
    const h=this.hero,el=this.popEl;
    el.querySelector('p').textContent=
      h.pop+' POP to spend · Fluff '+h.stats.fluff+' follows from the six · '+h.slots+' act slot(s)';
    const opts=el.querySelector('.opts');opts.innerHTML='';
    for(const k of STAT_KEYS){
      const cost=this.popCost('stat',k),info=STAT_INFO[k];
      const b=document.createElement('button');b.className='buy';
      b.innerHTML='<span><b style="color:'+info.color+'">'+info.name+' · '+h.stats[k]+'</b></span>'+
        '<em>'+cost+' POP</em>';
      b.disabled=h.pop<cost;
      b.onclick=()=>{const r=this.popSpend('stat',k);if(!r.ok)this.msg(r.note);this.renderPop();};
      opts.appendChild(b);
    }
    const sc=this.popCost('slot');
    const s=document.createElement('button');s.className='buy';
    s.style.gridColumn='1 / -1';
    s.innerHTML='<span><b>Act slot '+(h.slots+1)+'</b></span>'+
      '<em>'+(sc==null?'all open':sc+' POP')+'</em>';
    s.disabled=sc==null||h.pop<sc;
    s.onclick=()=>{const r=this.popSpend('slot');if(!r.ok)this.msg(r.note);this.renderPop();};
    opts.appendChild(s);
  }
  /* v10-S6e · **Die Werteliste nach außen.** Das v7-Heldenblatt hatte sie als eingetippte Kopie
     (Resonance · Amplitude · Frequency) und wusste deshalb nichts von den sechs Werten — es bot eine
     »Frequency«-Zeile mit »+«-Knopf an, den der Kern grundsätzlich ablehnen muss. Jetzt liest es
     hier. Eine Liste, ein Ort. */
  get STAT_KEYS(){return STAT_KEYS.slice();}
  get STAT_INFO(){return STAT_INFO;}
  /* Brücke für das v7-HUD (gehört WS0): sein »+«-Knopf ruft `game.spendSkillPoint`. Er bekommt
     jetzt die echte Transaktion samt Preis. Fällt er weg, weil WS0 in Paket 3 auf POP umbaut, kann
     diese Zeile mit. */
  spendSkillPoint(k){
    const r=this.popSpend('stat',k);
    /* `hud-v7.js:1335` schreibt **unabhängig von der Antwort** »Skill point spent — k is now n« ins
       Logbuch. Der Kauf findet nicht statt (der Guard hält), die Meldung schon — und eine Meldung,
       die lügt, ist in diesem Projekt die teuerste Klasse. Reparieren kann ich es nicht dort
       (fremde Datei), also hier: die Ablehnung wird gemerkt, und `msg()` tauscht die nächste
       Fremdzeile, die einen Kauf behauptet, gegen den echten Grund. */
    if(!r.ok)this._kaufAbgelehnt={t:Date.now(),note:r.note};
    return r;
  }
  /* **VERWORFEN 9.8.** Das Level-Up-Blatt gehört zum alten Modell (XP-Tabelle, Stufen 3 und 6).
     Es wird nicht mehr gerufen: POP liegt bereit, ausgegeben wird im Charakterblatt. Die Methode
     bleibt einen Fork lang stehen, damit ein alter Aufruf nicht ins Leere greift — sie sagt es
     dann in der Konsole, statt ein Fenster über das Bild zu legen. */
  levelUp(){
    console.warn('[pop] levelUp() ist verworfen (v10-S6) — POP wird im Charakterblatt ausgegeben');
    return;
  }
  _levelUpAlt(){
    const h=this.hero;
    this.paused=true;
    const box=this.lvupEl.querySelector('.box');
    box.querySelector('h3').textContent='LEVEL '+h.lv;
    const opts=box.querySelector('.opts');opts.innerHTML='';
    if(SLOT_LEVELS.includes(h.lv)&&h.slots<3){
      h.slots++;
      box.querySelector('p').textContent='A new Kayfabe slot. Room for one more unnecessary gesture.';
      const b=document.createElement('button');
      b.style.width='auto';b.style.textAlign='center';
      b.innerHTML='<b>Slot '+h.slots+' open</b>Continue';
      b.onclick=()=>this.closeLevelUp();
      opts.appendChild(b);
    }else{
      box.querySelector('p').textContent='A number grows. The cards stay what they are.';
      for(const k of ['fluff','kayfabe','bizarro']){
        const info=STAT_INFO[k];
        const b=document.createElement('button');
        b.innerHTML='<b style="color:'+info.color+'">+1 '+info.name+' · '+(h.stats[k]+1)+'</b>'+info.line;
        b.onclick=()=>{
          h.stats[k]++;
          if(k==='fluff'){h.maxhp=h.stats.fluff*FLUFF_UNIT;h.hp=Math.min(h.maxhp,h.hp+FLUFF_UNIT);}
          if(k==='kayfabe')h.charges=Math.min(h.stats.kayfabe,h.charges+1);
          this.diary.push({t:'lv'+h.lv,text:'The hero chose '+info.name+'.'});
          this.closeLevelUp();
        };
        opts.appendChild(b);
      }
    }
    this.lvupEl.style.display='flex';
    if(this.audio){this.audio.sfx('win');this.audio.voice('levelUp',1,0);}
    console.log('[overworld] Level',h.lv,'· Stats',JSON.stringify(h.stats),'· Slots',h.slots);
  }
  closeLevelUp(){
    this.paused=false;this.keys={};
    if(this.audio)this.audio.sfx('confirm');
    this.lvupEl.style.display='none';
    const h=this.hero;
    this.msg(`Level ${h.lv} · Fluff ${h.stats.fluff} · Kayfabe ${h.stats.kayfabe} · Bizarro ${h.stats.bizarro}`);
    this.autosave();
    this.updateHud();
  }
  /* Effekt-Handler-Familie (S3). Jeder Handler bekommt das Spiel und die Ability und liefert
     {ok,note}. Sagt ein Handler nein, wird KEINE Kayfabe-Ladung verbraucht — jeder Auftrag
     braucht einen Rückweg. */
  static get EFFECTS(){return {
    freeze(g,ab){
      let n=0;
      for(const m of g.mobs)
        if(m.hp>0&&Math.hypot(m.x-g.hero.x,m.y-g.hero.y)<ab.effect.range){m.frozen=ab.effect.seconds;n++;}
      return n?{ok:true,note:n+' stopped listening to reason.'}:{ok:false,note:'Nobody around to interrupt.'};
    },
    distract(g,ab){
      let n=0;
      for(const m of g.mobs)
        if(m.hp>0&&Math.hypot(m.x-g.hero.x,m.y-g.hero.y)<ab.effect.range){
          m.cool=Math.max(m.cool,ab.effect.seconds);n++;}
      return{ok:true,note:n+' hesitated.'};
    },
    heal(g,ab){
      const h=g.hero;
      if(h.hp>=h.maxhp)return{ok:false,note:'Nothing to recover.'};
      h.hp=Math.min(h.maxhp,h.hp+ab.effect.power*FLUFF_UNIT);
      return{ok:true,note:'+'+ab.effect.power+' Fluff.'};
    },
    bridge(g,ab){
      const h=g.hero;
      let dx=0,dy=0;
      if(h.dir==='side')dx=h.face;else dy=(h.dir==='up')?-1:1;
      const sx=Math.floor(h.x/TILE),sy=Math.floor(h.y/TILE),tiles=[];
      let landed=false,started=false;
      for(let k=1;k<=ab.effect.span;k++){
        const x=sx+dx*k,y=sy+dy*k;
        if(x<1||y<1||x>=g.W-1||y>=g.H-1)break;
        const i=y*g.W+x;
        const water=!(g.land[i]>0&&!g.blocked[i]);
        if(!started){if(water){started=true;tiles.push(i);}continue;}
        if(water)tiles.push(i);else{landed=true;break;}
      }
      if(!landed||!tiles.length)return{ok:false,note:'No gap to cross in that direction.'};
      const until=g.time+ab.effect.seconds;
      for(const i of tiles)g.tempBridge.set(i,{until,horiz:dx!==0});
      return{ok:true,note:'Inked '+tiles.length+' panels of bridge.'};
    },
    mark(g,ab){
      let best=null,bs=-1;
      for(const m of g.mobs){
        if(m.hp<=0)continue;
        const d=Math.hypot(m.x-g.hero.x,m.y-g.hero.y);
        if(d>ab.effect.range)continue;
        const s=m.maxhp+(m.elite?100:0)-d*0.05;
        if(s>bs){bs=s;best=m;}
      }
      if(!best)return{ok:false,note:'No subject worth reviewing.'};
      g.marked={mob:best,hits:0,need:ab.effect.power};
      return{ok:true,note:best.unit.name+' is under review.'};
    },
    meta(g,ab){
      let n=0;
      for(const m of g.mobs)
        if(m.hp>0&&Math.hypot(m.x-g.hero.x,m.y-g.hero.y)<ab.effect.range){m.frozen=ab.effect.seconds;n++;}
      g.panel.style.transition='transform .35s ease';
      g.panel.style.transform='rotate(-4deg) translateY(6px)';
      setTimeout(()=>{g.panel.style.transform='';},ab.effect.seconds*1000);
      return{ok:true,note:'The page noticed. '+n+' held still.'};
    },
  };}
  /* v10-S18b · **Der Schrei gehört dem Overlay, nicht dem Runner.** Die Zacken-Kontur aus S18 war
     toter Code: sie existierte in `bubble-ts.js`, aber **kein einziger Aufruf im Spiel** übergab
     `type:'shout'`. Geschrien wird an drei Stellen über `say(…, 'shout')` — Ringsprecher-Ansagen und
     die BLÖDSINN!-Regie —, und die landeten in einem **dritten** Blasenzeichner im Runner: ein
     goldenes Rechteck mit Dreieck-Zipfel, ohne Zacken, ohne Feder, ohne Bangers.
     Drei Zeichner für eine Sache sind zwei zu viel. Der Schrei geht jetzt ins Overlay, alles andere
     bleibt, wo es war. *Eine Kontur, die niemand ruft, ist kein Feature, sondern ein Kommentar.* */
  say(text,ttl,style){
    if(style==='shout'){this._shoutN=(this._shoutN|0)+1;}
    if(style==='shout'&&window.OW_BUBBLE&&this.hero){
      OW_BUBBLE.zeigen(this,this.hero,{text:String(text),type:'shout'});
      this._shoutBis=performance.now()+(ttl||2.4)*1000;
      return;
    }
    this.bubble={text,t:0,ttl:ttl||2.4,style:style||'talk'};
  }
  /* Die Kette: Slot → Kayfabe-Ladung → Effekt → Diary. */
  useKayfabe(slot){
    const h=this.hero;
    if(!h||this.paused)return;
    if(slot>=h.slots){this.msg('Slot '+(slot+1)+' opens at a later level.');return;}
    const id=h.equipped[slot];
    if(!id){this.msg('Slot '+(slot+1)+' is empty — click it to fit an act.');return;}
    const ab=OWK.ABILITIES[id];
    if(h.charges<ab.cost){this.msg('No Kayfabe left. Entering a zone restores a charge.');return;}
    let res;
    if(ab.trigger==='onFightStart'){
      h.buffs[id]=ab.fights||1;
      res={ok:true,note:'Armed for the next '+(ab.fights||1)+' fight(s).'};
    }else res=OverworldGame.EFFECTS[ab.effect.type](this,ab);
    if(!res.ok){this.msg(ab.title+': '+res.note);return;}
    h.charges-=ab.cost;
    if(ab.busy){h.busy=ab.busy;h.state='idle';this.moveTarget=null;this.path=null;this.attackTarget=null;}
    if(window.OW_MOTION)window.OW_MOTION.poke(h,'cast',1.2,h.face);
    this.say(ab.say);
    if(this.audio){this.audio.voice('kayfabe',1,2500);this.audio.sfx('card',{gain:0.7});}
    this.diary.push({t:ab.id,text:ab.diary});
    this.msg(ab.diary);
    console.log('[overworld] kayfabe',ab.id,'·',res.note,'· charges',h.charges+'/'+h.stats.kayfabe);
    this.updateHud();
  }
  // Buffs mit trigger onFightStart zünden, sobald ein Kampf beginnt
  fightStart(){
    const h=this.hero;
    for(const id in h.buffs){
      const ab=OWK.ABILITIES[id];
      if(!ab)continue;
      const res=OverworldGame.EFFECTS[ab.effect.type](this,ab);
      this.say(ab.say,1.8);
      if(res.ok)this.msg(ab.title+': '+res.note);
      if(--h.buffs[id]<=0)delete h.buffs[id];
    }
  }
  // Drop nach Rarity-Tabelle. Am Kill-Zähler gesät, damit ein Verlauf reproduzierbar bleibt.
  tryDrop(source,x,y){
    const h=this.hero;
    this._drops=(this._drops||0)+1;
    const r1=rand2(this._drops,source.length,this.att.seed*31+5);
    const r2=rand2(source.length,this._drops,this.att.seed*17+9);
    const ab=OWK.rollDrop(source,r1,r2,h.unlocked);
    if(!ab)return;
    h.unlocked.push(ab.id);
    const free=h.equipped.findIndex((v,i)=>i<h.slots&&!v);
    if(free>=0)h.equipped[free]=ab.id;
    this.floaters.push({x,y:y-124,txt:ab.title,t:0,c:OWK.RARITY[ab.rarity].color});
    if(this.audio)this.audio.sfx('coin');
    this.msg(OWK.RARITY[ab.rarity].label+': '+ab.title+' — '+ab.hint);
    this.diary.push({t:'drop',text:'The evidence yielded a new act: '+ab.title+'.'});
    this.autosave();
    console.log('[overworld] drop',source,'→',ab.id,'('+ab.rarity+') · unlocked',
      h.unlocked.length+'/'+OWK.ORDER.length);
  }
  // Klick auf einen Slot: durch die freigeschalteten Akte drehen, die nicht anderswo stecken
  cycleSlot(slot){
    const h=this.hero;
    if(slot>=h.slots)return;
    const pool=h.unlocked.filter(id=>h.equipped.indexOf(id)<0||h.equipped[slot]===id);
    if(pool.length<2)return;
    const cur=pool.indexOf(h.equipped[slot]);
    h.equipped[slot]=pool[(cur+1)%pool.length];
    this.msg('Slot '+(slot+1)+': '+OWK.ABILITIES[h.equipped[slot]].title);
    this.updateHud();
  }
  /* ── Afterglow: der Spieler ist der Letterer ───────────────────────────── */
  askCaption(z){
    const N=window.OW_NARRATOR;
    if(!N){return;}
    /* Im Prüflauf keine Caption (V5-S11c): der Schalter »Zone räumen« löste ein
       bildschirmfüllendes Modal aus, setzte `paused=true` — und danach öffnete `F` das Blatt nicht
       mehr, weil der Key-Handler bei `paused` aussteigt. Ein Abnahme-Schalter stellt einen Zustand
       her; er führt keine Szene auf. */
    if(this.auditDirty)return;
    const kills=this.diary.filter(d=>d.t==='zone').length;
    const acts=this.hero.unlocked;
    const opts=N.captions({cardTitle:z.card.t,biome:z.biome,kills:z.alive0||3,
      lastAbility:OWK.ABILITIES[acts[acts.length-1]].title,
      used:Object.values(this.captions||{}).map(c=>c.text),
      rand:i=>rand2(i*7+kills,z.zseed%9973,this.att.seed)});
    this._capZone=z;
    const box=this.capEl.querySelector('.opts');
    box.innerHTML='';
    for(const o of opts){
      const b=document.createElement('button');
      b.innerHTML='<b>'+o.tone+'</b>'+o.text;
      b.onclick=()=>this.setCaption(o.text,o.tone);
      box.appendChild(b);
    }
    this.capEl.querySelector('input').value='';
    this.capEl.style.display='flex';
    this.paused=true;this.keys={};
  }
  setCaption(text,tone){
    const z=this._capZone;
    this.capEl.style.display='none';
    this.paused=false;this._capZone=null;
    if(!z)return;
    this.captions=this.captions||{};
    this.captions[z.zseed]={text,tone,cardTitle:z.card.t,at:Date.now()};
    this.diary.push({t:'caption',text:'“'+text+'”'});
    this.msg('Caption set: “'+text+'”');
    if(this.audio)this.audio.sfx('confirm');
    this.autosave();
  }
  openAfterglow(){
    const N=window.OW_NARRATOR;
    if(!N)return;
    const s=this.captureJourney();
    const res=N.compose(s);
    this.afterEl.querySelector('.tone').textContent=res.tone+' · seed '+s.runSeed;
    const caps=Object.values(this.captions||{});
    const hof=caps.length
      ?'<div class="hof"><h5>UNCLE FRIZZLEBOB’S HALL OF KAYFABIZARRO FAME</h5>'
        +caps.map(c=>`<div><i>»${c.cardTitle}«</i> — “${c.text}”</div>`).join('')+'</div>'
      :'';
    this.afterEl.querySelector('.body').innerHTML=
      res.lines.map(l=>'<p>'+l+'</p>').join('')+hof;
    this.afterEl.style.display='flex';
    this.paused=true;this.keys={};
    if(this.audio)this.audio.sfx('card');
    console.log('[afterglow]',res.tone,'· zones',res.zonesCleared,'· captions',caps.length);
  }
  closeAfterglow(){
    this.afterEl.style.display='none';
    this.paused=false;
  }
  /* ── Journey: Seeds + Fakten, nie die Welt ────────────────────────────── */
  // Eine Liste, ein Ort: der Save-Vertrag führt die Fraktionen, factions.js liest denselben
  freshRep(){const L=(window.OW_FACTIONS&&window.OW_FACTIONS.ORDER)||OWJ.FACTIONS;
    return L.reduce((o,f)=>(o[f]=0,o),{});}
  captureJourney(){
    const h=this.hero,s=this.journey||OWJ.emptySave(this.att.seed);
    s.runSeed=this.att.seed;
    /* `stats` ist ein reines Objekt mit sechs Zahlen — `fluff` ist ein nicht-aufzählbarer Getter
       und landet deshalb NICHT im Save. Genau so soll es sein: abgeleitete Werte gehören nicht in
       den Spielstand, sonst widersprechen sie sich beim nächsten Laden. */
    s.hero={color:this.att.color,pop:h.pop,popTotal:h.popTotal,slots:h.slots,charges:h.charges,
      /* v12-J1 · DIE GEWÄHLTE EINHEIT IST TEIL DES SPIELSTANDS (Georg 12.8.). Gespeichert wird der
         Katalogschlüssel, nicht die Loader-Kennung: der Loader stellt spielbaren Einheiten ein
         `hero_` voran (`hero_bear`), der Katalog und das Attribut führen sie ohne (`bear`).
         Wer die Loader-Kennung speichert, schreibt beim Laden ein Attribut, das der Katalog nicht
         kennt — und bekommt still wieder eine gewürfelte Einheit. */
      unit:((h.unit&&h.unit.id)||'').replace(/^hero_/,'')||null,
      stats:Object.assign({},h.stats),unlocked:h.unlocked.slice(),equipped:h.equipped.slice()};
    s.cards={deckId:this.deck.packId||null,collected:this.collected.map(c=>c.n)};
    s.zones={};
    for(const z of this.zones)
      s.zones[z.zseed]={cardN:z.card.n,cardTitle:z.card.t,biome:z.biome,
        status:z.cleared?'cleared':(z.visited?'visited':'unvisited'),looted:!!z.looted};
    s.diary=this.diary.slice(-200);
    s.captions=Object.assign({},this.captions||{});
    s.reputation=Object.assign({},this.reputation||this.freshRep());
    s.savedAt=new Date().toISOString();
    this.journey=s;
    return s;
  }
  // Die Welt ist beim Aufruf schon aus dem Seed gebaut — hier kommen nur die Fakten zurück.
  applyJourney(s){
    const h=this.hero;
    if(!s||!s.hero||!h)return false;
    /* **Migration alter Spielstände** (v10-S6). Alt: {fluff,kayfabe,bizarro} + lv/xp.
       Fluff war ein Wert, jetzt ist er die Folge — der alte Fluff-Wert wird also **nicht**
       übernommen, sondern als Bingo/Bongo verbucht (er war erspielt, er soll nicht verfallen).
       Aus Level und XP wird POP: jede alte Stufe zählt als das, was sie gekostet hätte. */
    const alt=s.hero.stats||{};
    const migriert=(alt.fluff!=null&&alt.bingo==null);
    if(migriert){
      const extra=Math.max(0,(alt.fluff|0)-5);
      h.stats=this.freshStats({bizarro:alt.bizarro,kayfabe:alt.kayfabe,
        bingo:1+Math.ceil(extra/2),bongo:1+Math.floor(extra/2),boggle:1,bloedsinn:0});
      h.pop=(s.hero.pop|0)+Math.max(0,((s.hero.lv|0)-1))*6+(s.hero.xp|0);
      console.log('[pop] alter Spielstand migriert · lv',s.hero.lv,'→ POP',h.pop,
        '· Stats',JSON.stringify(h.stats),'· Fluff',h.stats.fluff);
    }else{
      h.stats=this.freshStats(alt);
      h.pop=s.hero.pop|0;
    }
    h.popTotal=s.hero.popTotal!=null?(s.hero.popTotal|0):h.pop;
    h.lv=1;h.xp=0;h.slots=s.hero.slots||1;
    h.unlocked=(s.hero.unlocked||['monologue']).slice();
    h.equipped=(s.hero.equipped||['monologue',null,null]).slice();
    h.maxhp=h.stats.fluff*FLUFF_UNIT;h.hp=h.maxhp;
    h.charges=Math.min(h.stats.kayfabe,s.hero.charges==null?h.stats.kayfabe:s.hero.charges);
    this.diary=(s.diary||[]).slice();
    this.captions=Object.assign({},s.captions||{});
    this.reputation=Object.assign(this.freshRep(),s.reputation||{});
    this.collected=[];
    let restored=0;
    for(const z of this.zones){
      const rec=s.zones&&s.zones[z.zseed];
      if(!rec)continue;
      z.visited=rec.status!=='unvisited';
      if(rec.status==='cleared'){z.cleared=true;z.alive=0;this.collected.push(z.card);restored++;
        // Die Kiste steht wieder da, wenn sie nie offen war (Save 2.3.0)
        z.looted=rec.looted!==false;
        if(!z.looted)this.spawnLoot(z);
      }
    }
    this.mobs=this.mobs.filter(m=>!m.zone.cleared);
    this.journey=s;
    /* v12-J1: die Einheit zuletzt — sie lädt asynchron und darf die übrige Wiederherstellung nicht
       aufhalten. `null` heißt »nie gewählt« und bleibt beim gewürfelten Helden. */
    const uKey=s.hero.unit;
    if(uKey&&uKey!==((h.unit&&h.unit.id)||'').replace(/^hero_/,'')){
      console.log('[journey] Einheit aus dem Spielstand:',uKey);
      this.setAttribute('hero',uKey);
    }
    console.log('[journey] restored · lv',h.lv,'· stats',JSON.stringify(h.stats),
      '· zones cleared',restored+'/'+this.zones.length,'· diary',this.diary.length,
      '· unlocked',h.unlocked.length,'· rep',JSON.stringify(this.reputation));
    return true;
  }
  autosave(){
    // Drinnen wird nicht gespeichert (V5-S8): der Save liest `this.zones`, und die sind im
    // Innenraum leer — ein Autosave hinter der Tür hätte den Inselfortschritt gelöscht.
    if(this.interior)return;
    /* Und im Abnahme-Modus auch nicht (V5-S11b). Die Schalter gehen absichtlich über den echten
       Bedienweg — `damage()` erreicht `killMob`, das `autosave()` ruft. Damit schrieb ein Werkzeug,
       dessen Zweck »sehen statt spielen« ist, in die Datei des Spielers: gemessen wurde ein Stand
       mit 21 Diary-Einträgen, 6 Abilities und aufgebautem Ruf durch einen Testlauf ersetzt.
       Wer einen hergestellten Zustand behalten will, exportiert ihn — den Knopf gibt es. */
    if(this.auditDirty)return;
    /* v10-S20b · **Titel werden hier vergeben.** `verdient()` war eine Rechnung ohne Aufrufer —
       ein Titel konnte im Spiel nie entstehen. Der Autosave ist der richtige Ort: er läuft nach
       jeder Tat, die etwas ändert, und nirgends sonst muss dafür Buch geführt werden.
       Getragen wird der Titel **nicht automatisch** — er ist eine Wahl, kein Aufkleber. */
    if(window.OW_IDENT){
      const neu=OW_IDENT.pruefe({
        hunt:this.hunt|0, collected:this.collected.length,
        rep:this.reputation||{}, shouts:this._shoutN|0});
      for(const t of neu){
        this.msg('Title earned: '+t.name+' \u2014 '+t.woher+'.');
        this.diary.push({t:'title',text:'Earned the title »'+t.name+'« ('+t.woher+').'});
      }
    }
    if(this._saveT)return;
    this._saveT=setTimeout(()=>{this._saveT=null;OWJ.write(this.captureJourney());},900);
  }
  rep(faction,delta){
    if(!this.reputation)this.reputation=this.freshRep();
    this.reputation[faction]=(this.reputation[faction]||0)+delta;
  }
  // Schlechter Ruf macht eine Fraktion wachsamer — die Stelle, an der Ruf heute schon beißt
  // Ruf beißt seit V4-S7 in factions.js — hier bleibt nur der Rückweg, wenn das Modul fehlt
  repAggro(biome){
    const F=window.OW_FACTIONS;
    if(F)return F.nerve(this,biome);
    const r=(this.reputation&&this.reputation[biome])||0;
    return r<0?Math.min(2.2,1+(-r)*0.04):1;
  }
  toggleDiary(){
    const open=this.diaryEl.style.display==='flex';
    this.diaryEl.style.display=open?'none':'flex';
    if(!open)this.renderDiary();
  }
  /* ── Abnahme ohne Reisewege (V5-S11, Georg 7.8.) ───────────────────────────
     Wer prüfen will, ob etwas gut ist, soll es sehen können — nicht erst hinlaufen und kämpfen.
     Das Blatt springt an jeden Prüfpunkt und stellt auf Wunsch den Zustand her, den man sehen will.
     Es geht über dieselben Wege wie der Spieler (`travelPoint`, `enterPlace`), damit die Abnahme
     nicht an einer API vorbeigeht, die im Spiel anders reagiert (Hausregel: über den Bedienweg). */
  auditItems(){
    const P=id=>(this.places||[]).find(p=>p.id===id);
    const zoneOffen=this.zones.find(z=>!z.cleared)||this.zones[0];
    const loot=(this.places||[]).find(p=>p.loot);
    const g=this.towerGuard;
    return[
      {k:'Turm · Türsteher',s:g&&g.hp>0?'lebt':'gefallen',
       go:()=>{const t=P('tower');if(t)this.travelPoint(t.x,t.y+150,'the tower');}},
      {k:'Turm · Inneres',s:this.interior?'du bist drin':'über E am Tor',
       go:()=>{const t=P('tower');if(!t)return;
         this.travelPoint(t.x,t.y+80,'the tower');this.nearPlace=t;this.enterPlace(t);}},
      {k:'Kampfzone',s:zoneOffen?(zoneOffen.biome+' · '+zoneOffen.alive+' Wächter'):'keine',
       go:()=>{if(zoneOffen)this.travelTo(zoneOffen);}},
      {k:'Loot-Zone',s:loot?'liegt bereit':'erst eine Zone räumen',
       go:()=>{if(loot)this.travelPoint(loot.x,loot.y+140,'the loot');}},
      {k:'Wirtshaus',s:'Afterglow',go:()=>{const t=P('tavern');if(t)this.travelPoint(t.x,t.y+90,'the tavern');}},
      {k:'Marktplatz',s:'Wegeknoten',
       go:()=>{const h=this.hubAt;if(h)this.travelPoint((h.x+0.5)*TILE,(h.y+2.5)*TILE,'the square');}},
      /* **Die Karte, zweimal** (V9-B4b, Georg: »der char soll nicht auf der card starten, sondern
         anreise, trigger etc als kompletten flow testen können«). Der erste Eintrag setzt ihn
         DAVOR — drei Felder unter der Unterkante, außerhalb der Tusche, mit Blick darauf: von dort
         läuft man hinein und der Trigger gehört dem Spiel. Der zweite ist der Kurzweg auf das Blatt,
         für die Ansicht selbst. */
      {k:'Karte · Anreise',s:this.reader?('»'+(this.reader.card.t||'?')+'«'):'nicht gebaut',
       go:()=>{const R=this.reader;if(!R)return;
         this.travelPoint((R.x+R.w/2)*TILE,(R.y+R.h+2)*TILE,'the card');}},
      {k:'Karte · drauf',s:this.reader?'Ansicht':'nicht gebaut',
       go:()=>{const R=this.reader;if(!R)return;
         this.travelPoint((R.x+R.w/2)*TILE,(R.y+R.h-0.5)*TILE,'the card');}},
    ];
  }
  auditActions(){
    // Jeder Schalter markiert die Sitzung als Prüflauf — danach schweigt der Autosave (siehe dort)
    const mark=fn=>()=>{this.auditDirty=true;fn();};
    return[
      {k:'Türsteher fällt',go:mark(()=>{const g=this.towerGuard;
        if(g&&g.hp>0){this.damage(g,999,true);this.msg('Doorman down — the tower is open.');}
        else this.msg('The doorman is already down.');})},
      {k:'Zone räumen',go:mark(()=>{const z=this.zones.find(zz=>!zz.cleared);
        if(!z){this.msg('Every zone is cleared.');return;}
        for(const m of this.mobs)if(m.zone===z&&m.hp>0)this.damage(m,9999,true);})},
      {k:'POP +50',go:mark(()=>{
        /* Ein Abnahme-Schalter stellt einen ZUSTAND her, er simuliert keine Spielhandlung.
           Über `gainXp` gelevelt kam Level 8 heraus (jeder Aufruf gibt 400 XP und löst mehrere
           Stufen aus), das Spiel stand auf `paused`, und ein bildschirmfüllendes Level-Up-Blatt
           wartete auf sechs Entscheidungen, die niemand traf — genau das Mikromanagement, das
           dieses Werkzeug abschaffen soll. */
        const h=this.hero;
        if(h.lv>=6){this.msg('Already level '+h.lv+'.');return;}
        /* v10-S6: der Schalter stellt einen ZUSTAND her — er schenkt POP, er kauft nicht ein.
           Was man damit macht, ist die Entscheidung, die geprüft werden soll. */
        h.pop+=50;h.popTotal+=50;
        h.maxhp=h.stats.fluff*FLUFF_UNIT;h.hp=h.maxhp;
        h.charges=h.stats.kayfabe;
        this.updateHud();
        this.msg('+50 POP · '+h.pop+' to spend. Set, not played.');
      })},
      {k:'Voll heilen',go:mark(()=>{const h=this.hero;h.hp=h.maxhp;h.charges=h.stats.kayfabe;this.hurt=0;
        this.msg('Fluff and Kayfabe are full.');})},
    ];
  }
  toggleAudit(){
    if(!this.auditEl){
      const el=this.auditEl=document.createElement('div');
      el.style.cssText='position:absolute;right:14px;top:14px;z-index:60;width:308px;max-height:86%;'+
        'overflow:auto;background:#f0ead6;color:#1f1a14;border:2px solid #6b5a3a;border-radius:4px;'+
        'padding:14px 15px;font:12px/1.5 "Courier New",monospace;'+
        'box-shadow:0 10px 30px rgba(0,0,0,.45)';
      this.shadowRoot.appendChild(el);
    }
    const open=this.auditEl.style.display==='block';
    if(open){
      this.auditEl.style.display='none';
      /* Beim Schließen wird der echte Stand zurückgeschrieben, sofern einer da war. Das Flag
         `auditDirty` bleibt gesetzt — wer danach weiterspielt, spielt auf einem Prüfzustand, und
         der gehört nicht in die Datei. Ein Neuladen stellt beides zurück.
         **Der Wächter hieß zuerst `window.OWJ` — und das Global existiert nicht** (der Modul ist
         `OW_JOURNEY`, im Runner über die lokale Konstante `OWJ` erreichbar). Damit war die ganze
         Schnappschuss-Hälfte toter Code, während der Changelog behauptete, sie läufe. */
      if(this._auditSnap&&this.auditDirty){
        try{OWJ.write(this._auditSnap);
          this.msg('Review closed — your saved run is untouched.');}catch(e){}
      }
      return;
    }
    // Schnappschuss VOR dem ersten Schalter: der Stand des Spielers ist kein Testmaterial
    if(!this._auditSnap){try{this._auditSnap=OWJ.read();}catch(e){}}
    this.renderAudit();
    this.auditEl.style.display='block';
  }
  renderAudit(){
    const el=this.auditEl;
    if(!el)return;
    el.innerHTML='';
    const h2=document.createElement('div');
    h2.style.cssText='font-weight:bold;letter-spacing:1.4px;font-size:11px;margin-bottom:2px';
    h2.textContent='ABNAHME · F SCHLIESST';
    el.appendChild(h2);
    const sub=document.createElement('div');
    sub.style.cssText='font-size:11px;opacity:.65;margin-bottom:12px';
    sub.textContent='Springt hin und stellt her, was du sehen willst.';
    el.appendChild(sub);
    if(this.auditDirty){
      // Eine unsichtbare Sperre ist keine Sperre: wer weiterspielt, muss wissen, dass nichts zählt
      const w=document.createElement('div');
      w.style.cssText='font-size:11px;line-height:1.5;margin:0 0 12px;padding:7px 9px;'+
        'background:#e8d8a8;border:1px solid #9a8a4a;border-radius:3px';
      w.innerHTML='<b>Prüflauf</b> — nichts wird gespeichert. Dein Stand kommt beim Schließen zurück; '+
        'ein Neuladen setzt alles zurück.';
      el.appendChild(w);
    }
    const mk=(label,note,fn)=>{
      const b=document.createElement('button');
      b.style.cssText='display:block;width:100%;text-align:left;margin-bottom:6px;padding:7px 9px;'+
        'font:12px/1.4 "Courier New",monospace;background:#e2d9bf;color:#1f1a14;cursor:pointer;'+
        'border:1px solid #9a8a66;border-radius:3px';
      b.innerHTML='<b>'+label+'</b>'+(note?'<span style="float:right;opacity:.6">'+note+'</span>':'');
      b.onmouseenter=()=>b.style.background='#efe7cd';
      b.onmouseleave=()=>b.style.background='#e2d9bf';
      b.onclick=()=>{fn();this.renderAudit();};
      el.appendChild(b);
      return b;
    };
    const lbl=t=>{const d=document.createElement('div');
      d.style.cssText='font-size:10px;letter-spacing:1.4px;opacity:.55;margin:12px 0 6px';
      d.textContent=t;el.appendChild(d);};
    lbl('HIN·SPRINGEN');
    for(const it of this.auditItems())mk(it.k,it.s,it.go);
    lbl('ZUSTAND HERSTELLEN');
    for(const a of this.auditActions())mk(a.k,'',a.go);
    lbl('WELT');
    const info=document.createElement('div');
    info.style.cssText='font-size:11px;line-height:1.7;opacity:.78';
    const R=this.reachable;let unreach=0;
    if(R)for(let i=0;i<this.W*this.H;i++)
      if(!R[i]&&this.walk(i%this.W,(i/this.W)|0))unreach++;
    info.innerHTML=[
      this.W+'×'+this.H+' Felder · Zoom '+this.att.zoom.toFixed(2),
      this.zones.length+' Zonen · '+(this.places||[]).length+' Orte · '+this.mobs.filter(m=>m.hp>0).length+' Mobs',
      (this.paths?this.paths.size:0)+' Wegfelder · '+this.bridge.size+' Brücken',
      unreach+' unerreichbare Felder',
      'Beweisstücke '+this.collected.length+'/'+(this.zones.length+this.collected.length),
    ].join('<br>');
    el.appendChild(info);
    if(window.OW_FEEL){
      lbl('SPIELGEFÜHL');
      const f=document.createElement('div');
      f.style.cssText='font-size:11px;line-height:1.7;opacity:.78;font-variant-numeric:tabular-nums';
      const p=OW_FEEL.probe(this);
      f.innerHTML=['Tempo '+p.sp+' / '+p.target+' px/s',
        'Fahrt ×'+p.flow+' · Kampf ×'+p.fight+' · Betäubt ×'+p.stun,
        'Bloodlust '+p.lust+' · Rückstoß '+p.knock].join('<br>');
      el.appendChild(f);
    }
  }
  renderDiary(){
    const rep=this.reputation||this.freshRep();
    this.diaryEl.querySelector('.cnt').textContent=this.diary.length+' entries';
    const FL=(window.OW_FACTIONS&&window.OW_FACTIONS.ORDER)||OWJ.FACTIONS;
    this.diaryEl.querySelector('.rep').innerHTML=FL.map(f=>{
      const v=rep[f]||0,c=v>0?'#6fc48a':(v<0?'#e07a6a':'#9aa79c');
      return `<span>${f} <b style="color:${c}">${v>0?'+':''}${v}</b></span>`;
    }).join('');
    this.diaryEl.querySelector('ul').innerHTML=this.diary.slice().reverse().slice(0,80)
      .map(d=>`<li><i>${d.t}</i>${d.text}</li>`).join('')
      ||'<li>Nothing yet. Go make some evidence.</li>';
  }
  async journeyAction(a){
    if(a==='export'){OWJ.download(this.captureJourney());this.msg('Journey exported.');return;}
    if(a==='import'){
      const s=await OWJ.pickFile();
      if(!s){this.msg('Import failed — unreadable, or from a version without a migrator.');return;}
      this.pendingSave=s;
      this.att.seed=s.runSeed;
      this.buildWorld();
      this.msg('Journey imported — the island was rebuilt from its seed.');
      return;
    }
    if(a==='reset'){
      this.journey=null;this.pendingSave=null;
      OWJ.write(OWJ.emptySave(this.att.seed));
      this.buildWorld();
      this.msg('New run. The page is blank again.');
    }
  }
  /* God-Mode-Übersicht (Taste M): die ganze Insel auf einen Blick, Zonen beschriftet.
     Für Zonen-Planung beim Bauen — und der Vorläufer der Minimap als Seitenspiegel (Masterplan §5.1). */
  // Stufenweiser Zoom — rastet auf feste Werte, damit Pixelart nicht zwischen den Stufen matscht
  stepZoom(dir){
    // Nach unten erweitert (V5-S9): bei Zoom 1 sah man 11×9 Felder — zu wenig, um einen Weg zu haben
    const S=[0.4,0.5,0.65,0.8,1,1.25,1.5,1.9];
    let i=0,best=1e9;
    for(let k=0;k<S.length;k++){const d=Math.abs(S[k]-this.att.zoom);if(d<best){best=d;i=k;}}
    i=Math.max(0,Math.min(S.length-1,i+dir));
    this.att.zoom=S[i];
    this.msg('Zoom '+S[i].toFixed(2)+'×');
  }
  zoomEff(){
    if(!this.overview)return this.att.zoom;
    const w=this.clientWidth||1,h=this.clientHeight||1;
    return Math.min(w/(this.W*TILE),h/(this.H*TILE))*0.94;
  }
  toggleOverview(){
    this.overview=!this.overview;
    this.syncHudMode();
    this.msg(this.overview
      ?'Overview — click a place to travel, shift+click to drop yourself. M to close.'
      :'Back on the ground.');
  }
  // In der Übersicht gehört der Bildschirm der Karte, im Minimal-Modus dem Spiel
  syncHudMode(){
    const ov=!!this.overview,min=!!this.minimal&&!ov;
    if(this.leftEl)this.leftEl.style.display=(ov||min)?'none':'flex';
    if(this.pill)this.pill.style.display=(ov||min)?'none':'';
    if(this.hintEl){this.hintEl.style.display='';this.hintEl.classList.toggle('on',!!this.helpOn&&!ov&&!min);}
    if(this.beatsEl)this.beatsEl.style.display=(ov||min)?'none':'flex';
    if(this.gearEl)this.gearEl.style.display=(ov||min)?'none':'';
    if(this.hbtnEl)this.hbtnEl.style.display=(ov||min)?'none':'';
    if(this.settingsEl&&(ov||min))this.settingsEl.style.display='none';
    if(this.miniEl)this.miniEl.style.display=min?'flex':'none';
    if(ov||min){
      if(this.zoneEl)this.zoneEl.style.display='none';
      if(this.promptEl&&ov)this.promptEl.style.display='none';
    }
  }
  travelTo(zo){
    const cx=Math.floor(zo.x+zo.w/2),cy=Math.floor(zo.y+zo.h/2);
    if(!this.walk(cx,cy)){this.msg('No footing there.');return;}
    if(!this.sameLand(cx,cy)){this.msg('No way over. That shore is not connected to this one.');return;}
    this.travelPoint((cx+0.5)*TILE,(cy+0.5)*TILE,'»'+zo.card.t+'«');
  }
  /* **Jedes** Reiseziel wird geprüft, nicht nur die Kampfzonen (V5-S10e). Der Schutz saß in
     `travelTo`, aber die sechs Stadt-Orte, das Wirtshaus und der Marktplatz gehen über
     `travelPoint` — und das setzte `hero.x/y` ungeprüft. Gemessen bei small/66666: Klick auf den
     Garten in der Übersichtskarte, Held landet im Wasser, 0 erreichbare Felder, kein Weg zurück,
     keine Meldung. Ein Teleport ohne Rückweg ist derselbe Fehler wie in der Zonen-Runde, nur an
     der zweiten Tür. */
  travelPoint(x,y,label,snap){
    /* **Die Nachsicht gehört dem Anker, nicht dem Klick** (v10-S1h, Georg: »und ich wurde wieder zum
       Strand teleportiert?«). Mein S1f-Fix saß auf der falschen Tür: er hat den Klick auf die große
       Übersicht geprüft — der Kompaß im v7-Möbel ruft `travelPoint` aber direkt
       (`hud-v7.js:855`). Und hier lag die eigentliche Ursache, global für **jede** Reise: das
       Ausweichen mit drei Feldern Umkreis. Für einen benannten Ort ist das richtig (der Klickpunkt
       liegt 70 px unter dem Anker, also fast zwei Felder tiefer). Für einen freien Klick ist es
       fatal: der Kompaß ist 112 px breit für 240 Felder, **ein Pixel sind zwei Felder** — die
       Nachsicht war größer als die Genauigkeit, also fand jeder Klick irgendein Ufer. Der Held stand
       am Strand, und die Meldung sagte »Travelled to the map«.
       Anker rufen mit 3 (Vorgabe), Klicks mit 1: ein Feld für die Rundung, sonst eine Absage. */
    let tx=Math.floor(x/TILE),ty=Math.floor(y/TILE);
    const R=snap==null?3:snap;
    if(!this.walk(tx,ty)||!this.sameLand(tx,ty)){
      let found=null;
      for(let r=1;r<=R&&!found;r++)for(let k=0;k<=r*8;k++){
        const a=k/Math.max(1,r*8)*Math.PI*2;
        const nx=Math.round(tx+Math.cos(a)*r),ny=Math.round(ty+Math.sin(a)*r);
        if(this.walk(nx,ny)&&this.sameLand(nx,ny)){found=[nx,ny];break;}
      }
      if(!found){
        this.msg('No way over to '+(label||'there')+'.');
        if(this.audio)this.audio.sfx('hit',{gain:0.12});
        return;
      }
      tx=found[0];ty=found[1];
      x=(tx+0.5)*TILE;y=(ty+0.6)*TILE;
    }
    this.hero.x=x;this.hero.y=y;
    this.cam.x=x;this.cam.y=y;
    this.moveTarget=null;this.path=null;this.attackTarget=null;
    this.overview=false;
    this.syncHudMode();
    this.msg('Travelled to '+label+'.');
    if(this.audio)this.audio.sfx('card');
  }
  /* ── v10-S1f · DIE ÜBERSICHT IST EINE KARTE, KEIN AUSHANG ──────────────────────────────────
     Georg: »die M ist nur super unübersichtlich.« Sie war es, weil jeder Ort und jede Zone ihre
     Beschriftung DAUERHAFT trug — sechs Titel, sechs Untertitel, neun Ortsnamen, dazu die
     Ausweichlogik, die sie auseinanderschiebt. Achtzehn Kästen auf einer Insel.
     Jetzt: Marken zeichnen, **einen** Namen zeigen — den unter dem Zeiger. Der Rest ist Karte.
     (Aufräumen, nicht gestalten: das Design der Übersicht ist ein eigener Slice.) */
  drawOverview(ox,oy,z){
    const ctx=this.ctx,d=this.dpr,s=z/d;
    ctx.setTransform(d,0,0,d,0,0);
    const toX=w=>(w-ox)*s,toY=w=>(w-oy)*s;
    ctx.font='11px "Courier New",monospace';ctx.textAlign='center';
    const ptr=this.ovPtr||null;
    let nah=null,nd=26;                       // was der Zeiger meint, in Bildschirmpixeln
    const merke=(x,y,titel,unter,farbe)=>{
      if(!ptr)return;
      const dd=Math.hypot(ptr.x-x,ptr.y-y);
      if(dd<nd){nd=dd;nah={x,y,titel,unter,farbe};}
    };
    for(const zo of this.zones){
      const x=toX(zo.x*TILE),y=toY(zo.y*TILE),w=zo.w*TILE*s,h=zo.h*TILE*s;
      ctx.strokeStyle=zo.cleared?'rgba(232,211,138,.95)':'rgba(255,255,255,.85)';
      ctx.lineWidth=2;ctx.strokeRect(x,y,w,h);
      // Der Zustand steht als Marke an der Ecke, nicht als Satz daneben
      ctx.fillStyle=zo.cleared?'rgba(232,211,138,.95)':'rgba(226,90,80,.95)';
      ctx.beginPath();ctx.arc(x+w,y,3.4,0,7);ctx.fill();
      // Der Treffer gilt für das ganze Rechteck, nicht nur für seine Mitte
      if(ptr&&ptr.x>=x-6&&ptr.x<=x+w+6&&ptr.y>=y-6&&ptr.y<=y+h+6){
        nd=0;nah={x:x+w/2,y:y,titel:'»'+zo.card.t+'«',
          unter:zo.biome+(zo.cleared?' · secured':' · '+zo.alive+' guards'),
          farbe:zo.cleared?'#e8d38a':'#e8e4d8'};
      }
    }
    const marke=(wx,wy,col,r)=>{
      const x=toX(wx),y=toY(wy);
      ctx.beginPath();ctx.arc(x,y,r||4.5,0,7);ctx.fillStyle=col;ctx.fill();
      ctx.strokeStyle='rgba(20,26,24,.9)';ctx.lineWidth=1.5;ctx.stroke();
      return[x,y];
    };
    if(this.places)for(const p of this.places){
      const[x,y]=marke(p.x,p.y,p.id==='tavern'?'#e8d38a':'#cfc9b8');
      merke(x,y,p.label||p.id,p.hint||'',p.id==='tavern'?'#e8d38a':'#cfc9b8');
    }
    if(this.reader){
      const R=this.reader,[x,y]=marke((R.x+R.w/2)*TILE,(R.y+R.h/2)*TILE,'#9fd1ff',4);
      merke(x,y,'»'+(R.card.t||'the card')+'«','the sheet in the grass','#9fd1ff');
    }
    if(this.spawn){const[x,y]=marke(this.spawn.x,this.spawn.y,'#9fd1ff',4);
      merke(x,y,'camp','where you woke up','#9fd1ff');}
    /* Du bist immer beschriftet — ohne dich ist eine Karte ein Bild. */
    if(this.hero){
      const[x,y]=marke(this.hero.x,this.hero.y,'#6fc48a',5);
      ctx.fillStyle='rgba(20,26,24,.9)';
      const w=ctx.measureText('you').width+8;
      ctx.fillRect(x-w/2,y+8,w,14);
      ctx.fillStyle='#6fc48a';ctx.fillText('you',x,y+18);
    }
    // Der eine Name: unter dem Zeiger, am Zeiger, mit Zustand darunter
    if(nah){
      const t=nah.titel,u=nah.unter||'';
      const tw=ctx.measureText(t).width,uw=u?ctx.measureText(u).width:0;
      const w=Math.max(tw,uw)+14,h=u?30:18;
      let bx=Math.min(this.cv.width/d-w-8,Math.max(8,nah.x-w/2)),by=nah.y-h-10;
      if(by<8)by=nah.y+14;
      ctx.fillStyle='rgba(20,26,24,.92)';ctx.fillRect(bx,by,w,h);
      ctx.strokeStyle='rgba(232,211,138,.35)';ctx.lineWidth=1;ctx.strokeRect(bx+0.5,by+0.5,w-1,h-1);
      ctx.fillStyle=nah.farbe||'#e8e4d8';ctx.fillText(t,bx+w/2,by+13);
      if(u){ctx.fillStyle='#9aa79c';ctx.fillText(u,bx+w/2,by+25);}
    }
    const head='OVERVIEW · seed '+this.att.seed+' · click to travel · shift+click to drop yourself';
    const hw=ctx.measureText(head).width;
    ctx.fillStyle='rgba(20,26,24,.85)';ctx.fillRect(14,14,hw+16,20);
    ctx.textAlign='left';ctx.fillStyle='#e8d38a';ctx.fillText(head,22,28);
  }
  zoneAt(x,y){
    return this.zones.find(z=>x>=z.x*TILE&&x<(z.x+z.w)*TILE&&y>=z.y*TILE&&y<(z.y+z.h)*TILE)||null;
  }
  /* Spawnpunkte nach WoW-Logik: die Zone ist bewacht, nicht bevölkert.
     Einer steht am Tor (Brückenkopf), der Rest staffelt sich in die Tiefe, alle mit Mindestabstand —
     vorher lagen sie übereinander und flackerten. Deterministisch aus zoneSeed. */
  /* v12-Z1 · KEIN SPRITE STEHT AUF DEM BLATT (Georg 12.8.: »Sprites sollten per Default nicht AUF
     der Card Zone platziert werden, weil es den Karteninhalt/Text überlagert«). Requisiten aus dem
     Terrain dürfen die Kante leicht überlappen — sie liegen am Rand und verdecken keine Zeile;
     eine Einheit steht mitten drauf und verdeckt genau das, wofür das Objekt existiert.
     EINE Abfrage, alle Säher: Zonenwächter, Kreaturen, Übungsgegner. */
  aufBlatt(px,py,saum){
    const R=this.reader;if(!R)return false;
    const s=saum==null?0.5:saum,x=px/TILE,y=py/TILE;
    return x>=R.x-s&&x<R.x+R.w+s&&y>=R.y-s&&y<R.y+R.h+s;
  }
  spawnPoints(z,n){
    const g=z.gate||{x:z.x+(z.w>>1),y:z.y};
    const cand=[];
    for(let y=z.y+1;y<z.y+z.h-1;y++)for(let x=z.x+1;x<z.x+z.w-1;x++){
      if(this.aufBlatt((x+0.5)*TILE,(y+0.5)*TILE))continue;   // v12-Z1
      cand.push({x,y,d:Math.hypot(x-g.x,y-g.y),j:rand2(x,y,z.zseed)});
    }
    cand.sort((a,b)=>a.d-b.d||a.j-b.j);
    if(!cand.length)return[];
    const out=[cand[0]],MIN=2.6,far=cand[cand.length-1].d;
    for(let i=1;i<n;i++){
      const want=(i/Math.max(1,n-1))*far;
      let pick=null,bd=1e9;
      for(const c of cand){
        if(c.used||c===out[0])continue;
        let ok=true;
        for(const o of out)if(Math.hypot(o.x-c.x,o.y-c.y)<MIN){ok=false;break;}
        if(!ok)continue;
        const dd=Math.abs(c.d-want)+c.j*0.9;
        if(dd<bd){bd=dd;pick=c;}
      }
      if(!pick)break;
      pick.used=true;out.push(pick);
    }
    return out;
  }
  async loadDeck(){
    this.deck={title:'Kayfabizarro'};this.cards=null;
    try{
      const reg=await(await fetch(KFB+'index.json')).json();
      const decks=(reg.decks||[]).filter(d=>d.cardCount>=20&&d.gameMode==='KFB'&&!/^medkayfab/.test(d.packId));
      /* **Ein Deck ohne gemessenes Kartenraster liefert angeschnittene Karten** (V9-B4b, Georgs
         Befund »die karte ist zu stark im anschnitt«). Der Kanon ist eindeutig: die `cardGrid`-Zahlen
         stehen im Manifest, geraten wird nicht (EMBED §5 / §9). Gemessen sind die drei Decks der
         Trilogie — `trust_and_betrayal` war es nicht, und der Rückfallwert schnitt jede Zelle falsch.
         Also wählt der Runner **nur aus gemessenen Decks**, solange es welche gibt.
         Und §3.4: die Starter-Welt ist Utopia, also beginnt die Reise mit `forget_utopia`
         (Utopia → Dystopia → Protopia). Kein neuer Vertrag, nur die Reihenfolge, die schon feststeht. */
      const MEASURED=['forget_utopia','ignore_dystopia','embrace_protopia'];
      const good=decks.filter(d=>d.cardGrid||MEASURED.indexOf(d.packId)>=0);
      const pool=good.length?good:decks;
      if(!good.length)console.warn('[overworld] kein Deck mit gemessenem Kartenraster — Karten werden angeschnitten');
      let pick=null;
      if(this.att.layout==='utopia')pick=pool.find(d=>d.packId==='forget_utopia')||null;
      if(!pick)pick=pool[Math.floor(rand2(this.att.seed,17,3)*pool.length)]||pool[0];
      if(pick){
        this.deck={title:pick.title,packId:pick.packId};
        try{
          // Die Registry nennt eine eigene Basis (Rohadresse) — die wird NICHT übernommen.
          // Ein Manifest, das seinen Kanal selbst bestimmt, zieht uns aus dem CDN heraus
          // (gemessen: genau diese Zeile war die letzte raw-Anfrage im Spiel).
          const dj=await(await fetch(KFB+encodeURIComponent(pick.data))).json();
          const arr=Array.isArray(dj)?dj:(dj.cards||dj.items||Object.values(dj).find(v=>Array.isArray(v)&&v.length>5));
          if(arr)this.cards=arr.map(c=>({n:c.n??c.cardNumber,t:c.t??c.cardName,l:c.l??c.lore}))
            .filter(c=>c.t);
        }catch(e){console.warn('[overworld] Deck-Daten:',e.message);}
      }
      console.log('[overworld] Deck:',this.deck.packId,'· Karten im Datenfach:',this.cards?this.cards.length:0);
    }catch(e){console.warn('[overworld] Registry:',e.message);}
  }
  buildWorld(){
    const[WW,HH]=WORLD_SIZES[this.att.worldSize]||WORLD_SIZES.large;
    const W=this.W=WW,H=this.H=HH,s=this.att.seed;
    // Alles, was in Feldern gerechnet wird, wächst mit — sonst hat die große Welt feinere Buchten
    // und einen dünneren Fluss als die kleine, und die Form ist eine andere Insel.
    const K=this.worldK=Math.max(1,W/120);
    const land=this.land=new Uint8Array(W*H); // 0 Wasser · 1 Sand · 2 Gras
    /* Ein Innenraum überlebt den Weltbau nicht (V5-S10g). Vorher blieben `interior` und `_outside`
       stehen: der Zeichenzweig malte den alten 13×17-Raum in ein 240×180-Fenster (schwarzer
       Bildschirm, `tiles` 108 → 0), und das nächste Betreten des veralteten Ausgangsfeldes stellte
       die Arrays der **verworfenen** Welt wieder her — der Seed-Wechsel wurde stillschweigend
       zurückgenommen. Erreichbar über vier Regler: seed · worldSize · zones · layout.
       Die Hausregel gilt hier umgekehrt: fällt der Rückweg weg, wird der Auftrag abgebrochen. */
    this.interior=null;this._outside=null;this._exitArmed=false;
    this.king=null;this.towerGuard=null;this.nearPlace=null;
    // Gleich hier allozieren, nicht erst bei der Deko: `connectLand()` läuft vorher und braucht
    // denselben Begriff von »begehbar« wie `walk()` — also auch `blocked`.
    this.blocked=new Uint8Array(W*H);
    this.cityAt=null;
    if(this.att.layout==='utopia')this.shapeUtopia(land,W,H,s);
    else for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      let n=0.62*vnoise(x/(17*K),y/(17*K),s)+0.38*vnoise(x/(6.5*K)+91,y/(6.5*K)+37,s*7+1);
      const d=Math.min(x,y,W-1-x,H-1-y);
      n-=Math.max(0,1-d/(7*K))*0.34;
      land[y*W+x]=n>0.545?2:(n>0.465?1:0);
    }
    // Karten-Zonen: Gras-Rechtecke suchen, Graben (Gutter) fluten, Brücke setzen
    this.zones=[];this.bridge=new Map();this.mobs=[];this.corpses=[];this.collected=[];this.shots=[];
    this.gutter=new Set();this.causeway=new Set();
    this.connectLand();   // erst prüfen, ob die Insel eine ist — dann darauf bauen
    const IW=18,IH=10,PAD=1; // Innenmaß + Rand um den Graben — v10-S2b: Kartenformat statt 10×8
    const fits=(zx,zy)=>{
      let landN=0,tot=0;
      /* Der Rand wird VIER Felder weit geprüft, nicht zwei, und mit 94 % statt 88 % Land.
         Grund (gemessen 2026-08-07): der Grabenring einer Zone ist ein geschlossener Wassergürtel —
         sitzt die Zone auf einer Engstelle des Utopia-Rings, **zerschneidet ihr eigener Graben die
         Insel**. Bei small/2024 lagen drei Zonen so; Brücke und Vorplatz waren begehbar, aber die
         ganze Gegend dahinter war vom Helden getrennt, und die Notbremse verwarf sie.
         Viel Land ringsum heißt: keine Engstelle. */
      for(let y=zy-PAD-3;y<zy+IH+PAD+3;y++)for(let x=zx-PAD-3;x<zx+IW+PAD+3;x++){
        if(x<2||y<2||x>=W-2||y>=H-2)return false;
        tot++;if(land[y*W+x]>0)landN++;
      }
      if(landN/tot<0.94)return false;
      for(const z of this.zones)
        if(!(zx+IW+3<z.x-3||z.x+z.w+3<zx-3||zy+IH+3<z.y-3||z.y+z.h+3<zy-3))return false;
      return true;
    };
    // Zonen als Kranz um die Inselmitte verteilen — sonst drängen sie sich oben zusammen,
    // weil die Rastersuche zeilenweise läuft. Kandidaten sammeln, dann Winkel für Winkel greifen.
    let tries=0;
    const offX=Math.floor(rand2(1,2,s)*6*K),offY=Math.floor(rand2(3,4,s)*6*K);
    const mx=W/2,my=H*0.48,cand=[];
    const STEP=Math.round(6*K);
    for(let gy=4+offY;gy<H-IH-6;gy+=STEP)for(let gx=4+offX;gx<W-IW-6;gx+=STEP)
      cand.push({x:gx,y:gy,a:Math.atan2(gy+IH/2-my,gx+IW/2-mx),used:false});
    const startA=rand2(5,6,s)*Math.PI*2;
    for(let i=0;i<this.att.zones;i++){
      const want=startA+i*Math.PI*2/this.att.zones;
      let pick=null,bd=1e9;
      for(const c of cand){
        if(c.used)continue;
        const d=Math.abs(((c.a-want+Math.PI*3)%(Math.PI*2))-Math.PI);
        if(d>=bd)continue;
        tries++;
        if(!fits(c.x,c.y))continue;
        bd=d;pick=c;
      }
      if(pick){pick.used=true;this.addZone(pick.x,pick.y,IW,IH,s);}
    }
    while(this.zones.length<this.att.zones&&tries<3000){
      tries++;
      const zx=4+Math.floor(rand2(tries,3,s*11+2)*(W-IW-8));
      const zy=4+Math.floor(rand2(7,tries,s*11+2)*(H-IH-8));
      if(!fits(zx,zy))continue;
      this.addZone(zx,zy,IW,IH,s);
    }
    // Deko + Kollision (Zonen + Gräben bleiben frei) — `blocked` liegt seit oben bereit
    this.blocked.fill(0);
    const inZoneArea=(x,y)=>this.zones.some(z=>x>=z.x-2&&x<z.x+z.w+2&&y>=z.y-2&&y<z.y+z.h+2);
    const sprites=this.decos=[];
    let trees=0,small=0,rocks=0;
    /* ── Verteilung nach Regeln statt nach Würfel (V6-S13, Georg 7.8.) ──────────────────────
       Drei Befunde, alle am Bild: »gestackte Assets = Anti-Pattern, vor allem, wenn es das gleiche
       ist« · ein Fels direkt vor einem Baum · »dass die Elemente nicht so schlau verteilt sind, dass
       man ein Konzept erkennen könnte«. Vorher entschied EIN Zufallswert je Feld über Ja/Nein UND
       über die Sorte — benachbarte Felder mit ähnlichem Wert bekamen deshalb dasselbe Sprite
       nebeneinander. Jetzt vier Regeln:
         1. Ein Prop **reserviert** seine Nachbarschaft (Radius nach Größe).
         2. Kein Prop auf einer **Terrainkante** — Georg: »das bricht die Illusion, dass da
            wirklich ein Höhenunterschied wäre.«
         3. Die Sorte kommt aus einem **eigenen** Hash und weicht dem letzten Nachbarn aus.
         4. Haine statt Gleichverteilung: das vorhandene Dichtefeld entscheidet, die Reservierung
            dünnt aus. Beides zusammen ergibt Gruppen mit Lichtungen dazwischen. */
    const taken=new Uint8Array(W*H);
    let lastTree=-1;
    const onEdge=(x,y)=>{
      const t=land[y*W+x];
      for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
        const nx=x+dx,ny=y+dy;
        if(nx<0||ny<0||nx>=W||ny>=H)return true;
        if(land[ny*W+nx]!==t)return true;
      }
      return false;
    };
    const reserve=(x,y,rad)=>{
      for(let dy=-rad;dy<=rad;dy++)for(let dx=-rad;dx<=rad;dx++){
        const nx=x+dx,ny=y+dy;
        if(nx>=0&&ny>=0&&nx<W&&ny<H)taken[ny*W+nx]=1;
      }
    };
    /* Cartoon-Verformung je Instanz (§31.7): dasselbe Sprite, leicht anders. Aus der Position
       gesät, damit derselbe Baum immer gleich steht. Bei hohen Props trägt eine Neigung, bei
       flachen liest sie als Fehler — deshalb `tall` als Faktor. */
    const deform=(x,y,tall)=>{
      const a=rand2(x+13,y+29,s+401),b=rand2(x+71,y+17,s+733),c2=rand2(x+5,y+91,s+199);
      return {sx:(0.94+a*0.12)*(c2<0.5?1:-1), sy:0.965+b*0.075,
              skew:(a-0.5)*0.10*tall, rot:(b-0.5)*0.035*tall};
    };
    /* ── Zwei Quellen nebeneinander (V7-S1, Georgs Entscheidung) ────────────────────────────
       Georgs generiertes Blatt gegen die Tiny-Swords-Deko, und die glatte Fassung gegen die aufs
       4-px-Gitter gezwungene — beides IM Bild vergleichbar, nicht in zwei Exporten. Die Quelle
       entscheidet ein grobes Feld (Regionen, keine Streuung: sonst stehen die Stile durcheinander
       und man sieht keinen Unterschied), die Fassung eine harte Naht in der Weltmitte. */
    let sheetProps=0;
    const useSheet=(x,y)=>!!this.PROPS&&(this.att.propSheet==='sheet'||
      (this.att.propSheet==='mix'&&vnoise(x/14+31,y/14+17,s*5+9)>0.5));
    const gridOf=x=>this.att.propGrid==='both'?(x<W/2?'smooth':'pixel'):this.att.propGrid;
    const sheetProp=(x,y,px,py,place,r)=>{
      const p=this.PROPS.pick(r,{grid:gridOf(x),biome:land[y*W+x]===2?'grass':'sand',place});
      if(!p)return null;
      sheetProps++;
      return Object.assign(p,{x:px,y:py,def:deform(x,y,p.tall)});
    };
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      const i=y*W+x,r=rand2(x,y,s*13+5);
      const px=x*TILE+TILE/2,py=y*TILE+TILE;
      if(inZoneArea(x,y))continue;
      if(taken[i])continue;
      if(land[i]===2){
        /* Hainbreite und Mindestabstand sind ZWEI Skalen und müssen sich unterscheiden. Erst stand
           das Dichtefeld auf 5 Feldern Wellenlänge und die Reservierung auf Radius 2 — jede Blase
           fasste damit rechnerisch genau EINEN Baum, und heraus kam ein Zufallsraster mit
           Mindestabstand (gemessen: Varianz/Mittel 1,22, also nicht von Poisson zu unterscheiden;
           65 % aller Bäume saßen dicht am harten Minimum). Jetzt: Hain ≈ 20 Felder, Reservierung
           1 Feld, und die Annahmeschwelle hängt am Feldwert — im Hain dicht, draußen gar nicht. */
        const t=vnoise(x/20+7,y/20+3,s*3+2);
        if(t>0.46&&r<(t-0.46)*0.44&&this.img.tree1&&!onEdge(x,y)){
          if(useSheet(x,y)){
            const p=sheetProp(x,y,px,py-6,'grove',rand2(x*7+1,y*3+5,s+911));
            if(p){sprites.push(p);this.blocked[i]=1;trees++;reserve(x,y,1);continue;}
          }
          // Sorte aus eigenem Hash — und nie zweimal dieselbe direkt hintereinander
          let kind=rand2(x*7+1,y*3+5,s+911)<0.5?1:2;
          if(kind===lastTree)kind=kind===1?2:1;
          lastTree=kind;
          const img=(kind===1?this.img.tree1:this.img.tree2)||this.img.tree1;
          const st=probeStripCached(img);
          sprites.push({img,fw:st.fw,frames:st.frames,x:px,y:py-6,anim:0.9+r,
            def:deform(x,y,1)});
          this.blocked[i]=1;trees++;
          reserve(x,y,1);
        }else if(r>0.62&&r<0.6295&&!onEdge(x,y)){
          /* **Dreiergruppe statt Streuung** (v10-S1h, Georg: »sprite-dichte global etwa halbiert,
             und eher rule of three statt des erratischen Musters«). Vorher nahm dieser Zweig 8 %
             aller Grasfelder und setzte **je eines** — das ist Rauschen mit Mindestabstand, und es
             sieht aus wie verstreute Reste. Jetzt entscheidet der Wurf über eine **Gruppe**: ein
             großes Stück, ein mittleres, ein kleines, dicht beieinander und als schiefes Dreieck
             (drei in einer Reihe wären eine Hecke). Der Umkreis von drei Feldern hält die Gruppen
             auseinander — so entstehen Grüppchen mit Lichtungen, nicht ein Teppich. */
          const TRIO=[[0,0,1],[26,9,0.82],[-19,16,0.66]];
          let gesetzt=0;
          for(const [ox,oy,sk] of TRIO){
            const rr=rand2(x*3+9+ox,y*5+2+oy,s+77);
            let p=null;
            if(useSheet(x,y))p=sheetProp(x,y,px+ox,py-4+oy,'deco',rr);
            if(!p){
              const img=this.img['deco'+(1+Math.floor(rr*18))];
              if(img)p={img,fw:img.width,frames:1,x:px+ox,y:py-4+oy,def:deform(x+ox,y+oy,0.35)};
            }
            if(!p)continue;
            // Der Rangunterschied macht die Gruppe lesbar — gleich große Dinge lesen als Muster
            p.def=Object.assign({},p.def||{},{sy:(p.def&&p.def.sy||1)*sk,
              sx:(p.def&&p.def.sx||1)*sk});
            sprites.push(p);small++;gesetzt++;
          }
          if(gesetzt)reserve(x,y,3);
        }
      }else if(land[i]===0&&r<0.008){
        const img=r<0.004?this.img.wrock1:this.img.wrock2;
        if(img){const st=probeStripCached(img);
          sprites.push({img,fw:st.fw,frames:st.frames,x:px,y:py-14,anim:0.5,
            def:deform(x,y,0.2)});rocks++;reserve(x,y,2);}
      }
    }
    sprites.sort((a,b)=>a.y-b.y);
    /* Beide Zähler an DERSELBEN Stelle ziehen (V7-S1b). Vorher zählte `tinyProps` nur den
       Kleinprop-Zweig — die 479 Tiny-Swords-Bäume und die Wasserfelsen fehlten darin, und der
       Changelog behauptete daraufhin ein Verhältnis, das der Code nicht hergab. Genau die Falle,
       die §2 des Handovers führt: eine Zahl gehört an die Stelle gemessen, um die es geht. */
    const nSheet=sprites.filter(d=>d.src).length,
          nSmooth=sprites.filter(d=>d.src==='smooth').length;
    console.log('[props]',this.att.propSheet,'·',this.att.propGrid,
      '· Blatt',nSheet,'(glatt '+nSmooth+' · Gitter '+(nSheet-nSmooth)+')',
      '· Tiny Swords',sprites.length-nSheet,'· Requisiten gesamt',sprites.length,
      '· davon Bäume',trees,'· Wasserfelsen',rocks);
    /* Die Pfützen bekommen die Welt, nicht nur den Seed (V7-S4): `wetness` ist die Nähe zum echten
       Wasser — am Ufer ist der Boden feucht. Ringsuche bis 4 Felder, damit die Schicht nicht über die
       ganze Karte rechnet. Ohne diesen Aufruf behält die Schicht die Pfützen der vorigen Welt:
       **wer neu baut, muss auch neu säen.** */
    if(window.OW_PUDDLES){
      const nearWater=(x,y)=>{
        for(let r=1;r<=4;r++)for(let a=-r;a<=r;a++){
          const pts=[[x+a,y-r],[x+a,y+r],[x-r,y+a],[x+r,y+a]];
          for(const p of pts){
            if(p[0]<0||p[1]<0||p[0]>=W||p[1]>=H)continue;
            if(land[p[1]*W+p[0]]===0)return 1-(r-1)/4;
          }
        }
        return 0;
      };
      OW_PUDDLES.reset(s,nearWater);
      const pw=Math.min(W,120),ph=Math.min(H,90);
      const pp=OW_PUDDLES.probe(pw,ph,s,nearWater);
      console.log('[puddles]',OW_PUDDLES.enabled?'AN':'AUS','·',pp.n,'gesät auf',pw+'×'+ph,
        'Feldern ·',pp.per1000,'je 1000 · Tönung',pp.toneMin+'…'+pp.toneMax,'(Median '+pp.toneMed+')',
        OW_PUDDLES.enabled?'':'— gezeichnet wird keine (V8-S2: harter Glanzbalken)');
    }
    // Schaumkanten
    this.foamTiles=[];
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      if(!land[y*W+x])continue;
      let edge=false;
      for(let dy=-1;dy<=1&&!edge;dy++)for(let dx=-1;dx<=1;dx++){
        const nx=x+dx,ny=y+dy;
        if(nx<0||ny<0||nx>=W||ny>=H||!land[ny*W+nx]){edge=true;break;}
      }
      if(edge)this.foamTiles.push(y*W+x);
    }
    // Spawn: nächstes freies Gras zur Mitte, außerhalb der Zonen
    let best=null,bd=1e9;
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      if(land[y*W+x]!==2||this.blocked[y*W+x]||inZoneArea(x,y))continue;
      const d=(x-W/2)**2+(y-H/2)**2;
      if(d<bd){bd=d;best={x,y};}
    }
    this.hero={unit:this.heroUnit,x:(best.x+0.5)*TILE,y:(best.y+0.5)*TILE,face:1,dir:'side',
      anim:0,state:'idle',atkT:0,atkKey:'idle',combo:0,didHit:false,busy:0,
      stats:this.freshStats(),pop:0,popTotal:0,lv:1,xp:0,slots:1,charges:START_STATS.kayfabe,
      unlocked:['monologue'],equipped:['monologue',null,null],buffs:{},
      hp:0,maxhp:0,lastHit:-99};
    this.hero.maxhp=this.hero.stats.fluff*FLUFF_UNIT;this.hero.hp=this.hero.maxhp;
    /* **Brücke zum v7-HUD** (WS0). Sein Heldenblatt zeigt »n skill points to spend« und hängt die
       »+«-Knöpfe an `hero.skillPoints`. POP ist keine Punktzahl, sondern eine Währung mit Preisen —
       darum meldet der Getter nur, **ob** etwas erschwinglich ist (1) oder nicht (0). Gekauft wird
       trotzdem über `popSpend` mit echtem Preis. Fällt in Paket 3 weg, wenn WS0 POP anzeigt. */
    Object.defineProperty(this.hero,'skillPoints',{configurable:true,
      get:()=>{const h=this.hero;
        return h.pop>=Math.min(...STAT_KEYS.map(k=>POP_COST.stat(h.stats[k])))?1:0;}});
    this.diary=[];this.curZone=null;this.paused=false;this.lvupEl.style.display='none';
    this.tempBridge=new Map();this.bubble=null;this.marked=null;this.inFight=false;
    if(!this.reputation)this.reputation=this.freshRep();
    this.spawn={x:this.hero.x,y:this.hero.y};
    this.buildTown(best,sprites,inZoneArea);
    this.buildReader();   // V9-B3: das Blatt im Terrain, in Sichtweite des Startpunkts
    this._zonesPlaced=this.zones.length;   // Messpunkt: platziert, vor der Notbremse
    if(this._missingPlaces&&this._missingPlaces.length){
      this.msg('This island has no '+this._missingPlaces.join(', no ')+'. The page came out short.');
      this.diary.push({t:'page',text:'Some addresses did not fit on this island: '+
        this._missingPlaces.join(' · ')+'.'});
    }
    /* Der zweite `connectLand()`-Lauf ist wieder da (V5-S10f) — und die Begründung von S10c, ihn zu
       entfernen, war falsch: sie beruhte auf Konsolenlogs aus einem Stand **vor** dem Gutter-Guard.
       Mit `if(gutter.has(j)) continue` kann er die Zoneninneren nicht mehr für Inseln halten, also
       baut er auch keine unbewachten Zweittore (gegengeprüft über 32 Welten: 0 Zweittore).
       Nötig ist er, weil `addZone` die Gutter erst NACH dem Formen flutet und ein Gutter an einer
       Engstelle die Insel zerschneidet: bei small/8080 waren **832 von 4057 begehbaren Feldern
       (20,5 % der Insel) unerreichbar** — nicht »eine Zone«, sondern ein Fünftel der Welt samt
       Bäumen und Deko. Eine einzige neue Brücke heilt es (832 → 2 unerreichbare Felder). */
    this.connectLand();
    /* Der Steg zur Zone bleibt frei (V5-S10d). Die Deko wird NACH `addZone` verteilt und hält nur
       zwei Felder Abstand von der Zone (`inZoneArea`) — der Steg ist aber bis zu zehn Felder lang.
       Ein einzelner Baum darauf trennt die ganze Zone ab, und die Notbremse verwirft sie. Das war
       die eigentliche Ursache des Zonenverlusts, nicht die gewürfelte Torseite:
       bei `small` ist die Deko relativ zur Fläche am dichtesten, und dort fehlten die meisten. */
    if(this.causeway){
      let freed=0;
      for(const i of this.causeway)if(this.blocked[i]){this.blocked[i]=0;freed++;}
      if(freed)console.log('[overworld] Stege von Deko befreit:',freed,'Felder');
    }
    /* Zweiter Durchgang: die Zonengräben werden erst NACH dem Formen geflutet, jeder mit genau einer
       Brücke — trifft die auf Wasser oder eine Ecke, liegt die Zone hinter ihrem eigenen Gutter.
       Gemessen über 4 Seeds × 4 Weltgrößen: nach dem ersten Lauf allein waren 8 von 16 Welten
       kaputt. Der zweite Lauf prüft die Welt so, wie man sie betritt. */
    /* Kein zweiter `connectLand()`-Lauf mehr (V5-S10c) — **widerrufen in S10f, siehe oben.** */
    const reach=(()=>{
      const W2=this.W,H2=this.H,seen=new Uint8Array(W2*H2),NB=[[1,0],[-1,0],[0,1],[0,-1]];
      const sx=Math.floor(this.hero.x/TILE),sy=Math.floor(this.hero.y/TILE);
      if(!this.walk(sx,sy))return null;
      const q=[sy*W2+sx];seen[q[0]]=1;
      while(q.length){
        const c=q.pop(),x=c%W2,y=(c/W2)|0;
        for(const[dx,dy]of NB){
          const nx=x+dx,ny=y+dy;
          if(nx<0||ny<0||nx>=W2||ny>=H2)continue;
          const j=ny*W2+nx;
          if(!seen[j]&&this.walk(nx,ny)){seen[j]=1;q.push(j);}
        }
      }
      return seen;
    })();
    this.reachable=reach;
    if(reach){
      const W2=this.W;
      const drop=this.zones.filter(z=>!reach[Math.floor(z.y+z.h/2)*W2+Math.floor(z.x+z.w/2)]);
      if(drop.length){
        this.zones=this.zones.filter(z=>!drop.includes(z));
        console.warn('[overworld] Zone(n) ohne Landverbindung verworfen:',drop.length,
          '· verbleibend',this.zones.length);
      }
      /* Orte genauso prüfen wie Zonen (V5-S10e): bei small/66666 lag das Türfeld des Gartens im
         Wasser, der Ort blieb in der Liste, erschien in der Übersichtskarte und war anklickbar.
         Beim Turm hieße derselbe Fall: der ganze Dungeon-Slice unerreichbar. Ein Ort, dessen Tür
         nicht erreichbar ist, wird verschoben — und wenn kein Platz zu finden ist, entfernt. */
      const lost=[];
      for(const p of (this.places||[])){
        if(reach[(p.ty+1)*W2+p.tx])continue;
        let moved=null;
        for(let r=1;r<=8&&!moved;r++)for(let k=0;k<=r*8;k++){
          const a=k/Math.max(1,r*8)*Math.PI*2;
          const nx=Math.round(p.tx+Math.cos(a)*r),ny=Math.round(p.ty+Math.sin(a)*r);
          if(ny+1>=this.H||nx<1||ny<1||nx>=W2-1)continue;
          if(reach[(ny+1)*W2+nx]&&this.walk(nx,ny+1)){moved={x:nx,y:ny};break;}
        }
        if(moved){
          p.tx=moved.x;p.ty=moved.y;p.x=(moved.x+0.5)*TILE;p.y=(moved.y+1)*TILE;
          if(p.id==='tavern')this.tavern={x:p.x,y:p.y};
          console.warn('[overworld] Ort verschoben (Tür lag im Wasser):',p.id,'→',moved.x+','+moved.y);
        }else lost.push(p);
      }
      if(lost.length){
        this.places=this.places.filter(p=>!lost.includes(p));
        console.warn('[overworld] Ort(e) ohne erreichbare Tür entfernt:',lost.map(p=>p.id).join(' · '));
      }
    }
    this.cam={x:this.hero.x,y:this.hero.y};
    this.moveTarget=null;this.attackTarget=null;this.path=null;this.floaters=[];
    const landCount=land.reduce((a,v)=>a+(v?1:0),0);
    console.log('[overworld] Welt',W+'×'+H,'seed',s,'· layout',this.att.layout,
      '· Land',landCount,'· Zonen',this.zones.length,
      '(Versuche',tries+')','· Schaumkanten',this.foamTiles.length,
      '· Bäume',trees,'· Deko',small,'· Felsen',rocks,
      '· Zonen-Karten',JSON.stringify(this.zones.map(z=>z.card.n)));
    this.stats.sprites=sprites.length;
    window.__ow_stats=this.stats;
    this.populate();
    this.loadCardBack();   // v10-S2b: eine Rückseite für alle Zonen und den Reader
  }
  /* Utopia (Holbein 1518, Georgs Vorlage): ein fast geschlossener Landring um eine Lagune,
     unten die schmale Einfahrt mit dem Wachturm im Wasser, die Stadt Amaurotum am inneren Ufer,
     der Anydrus von der Quelle im Westen in die Lagune.
     Gerechnet wird in Tiles bis zur nächsten Kante — damit greifen Sandsaum, Schaum und
     Autotiling unverändert weiter. Die Lagune ist zugleich der große Gutter der Seite. */
  shapeUtopia(land,W,H,s){
    const K=this.worldK||1;
    // Holbein 1518: keine Ringscheibe, sondern eine **Mondsichel** — oben breites Land,
    // unten zwei einwärts gebogene Hörner, dazwischen die Einfahrt mit dem Turm im Wasser.
    // Erreicht wird das mit drei Kniffen: die Lagune sitzt TIEFER als die Inselmitte (macht das
    // Land oben breit und unten dünn), die Außenkontur wird nach unten eingezogen, und der
    // Gate-Sektor schneidet den Kanal auf. Küste in zwei Oktaven, damit sie zackt statt wellt.
    const cx=W/2,cy=H*0.455;       // Inselmitte
    const lx=W/2,ly=H*0.515;       // Lagunenmitte — leicht tiefer
    const RX=W*0.455,RY=H*0.455;
    const rx=W*0.235,ry=H*0.235;
    const GATE=0.22;
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      const ang=Math.atan2(y-cy,x-cx);
      const down=Math.max(0,Math.sin(ang));            // 1 = genau unten
      const shrink=1-0.15*Math.pow(down,2.2);          // Sichel: nur ganz unten einziehen
      const dOut=Math.hypot((x-cx)/(RX*shrink),(y-cy)/(RY*shrink));
      const dIn=Math.hypot((x-lx)/rx,(y-ly)/ry);
      let e=Math.min((1-dOut)*RY,(dIn-1)*ry);
      e+=(vnoise(x/(7.5*K),y/(7.5*K),s)-0.5)*4.6*K;              // grobe Buchten
      e+=(vnoise(x/(2.9*K)+50,y/(2.9*K)+20,s*3+7)-0.5)*2.4*K;    // gezackte Kante
      const gate=Math.abs(((ang-Math.PI/2)+Math.PI*3)%(Math.PI*2)-Math.PI);
      if(gate<GATE)e-=(1-gate/GATE)*26*K;                // Einfahrt aufschneiden
      land[y*W+x]=e>1.7*K?2:(e>0.15*K?1:0);
    }
    // Der Anydrus: Quelle im Westen, quer durch den Ring, Mündung in die Lagune
    const RW=Math.max(1,Math.round(1.2*K));
    for(let x=2;x<lx;x++){
      const yy=Math.round(cy-3*K+Math.sin((x-2)/(11*K))*4.2*K);
      if(Math.hypot((x-lx)/rx,(yy-ly)/ry)<1)break;
      for(let d=-RW;d<=RW;d++){
        const y=yy+d;
        if(y>1&&y<H-1)land[y*W+x]=0;
      }
    }
    // Der Wachturm in der Einfahrt — wer herein will, kommt an ihm vorbei
    const tx=Math.round(cx),ty=Math.round(cy+RY*0.80);
    for(let y=ty-Math.round(5*K);y<=ty+Math.round(5*K);y++)for(let x=tx-Math.round(6*K);x<=tx+Math.round(6*K);x++){
      if(x<1||y<1||x>=W-1||y>=H-1)continue;
      const d=Math.hypot((x-tx)/(5.2*K),(y-ty)/(3.8*K));
      if(d<1)land[y*W+x]=d<0.66?2:1;
    }
    this.cityAt={x:Math.round(lx),y:Math.round(ly-ry-5*K)};
    this.gateAt={x:tx,y:ty};
  }
  /* Amaurotum: sechs Orte am Innenufer, keiner davon eine Kampfzone. Jeder Ort ist die Adresse
     eines Systems, das es schon gibt — deshalb sind es genau diese sechs und nicht mehr. */
  /* Eine Insel, die zerfällt, ist keine Insel (V5-S10b).
     Bei 120×90 hielt der Utopia-Ring zusammen; mit `K = 2` wurde der Gate-Einschnitt doppelt tief
     und der Anydrus fünf statt drei Felder breit — die Südwesthälfte der Sichel hängt seitdem an
     nichts mehr. Gemessen bei seed 7: **4 Komponenten mit 13 753 · 3 085 · 251 · 7 Feldern**, eine
     Kampfzone auf der abgeschnittenen. Das ist nicht Kosmetik: die Insel kann nie geräumt werden,
     und ein Klick auf die Zone teleportiert den Helden dorthin, ohne Rückweg.

     Statt die Formzahlen zu justieren (die beim nächsten Seed wieder kippen) wird der Zusammenhang
     **geprüft und hergestellt**: Flood-Fill über das Land, dann von der größten Komponente aus ein
     0-1-BFS über das Wasser zur nächsten Insel; die getroffene Strecke wird Brücke (kurz) oder
     Sandbank (lang). Der Brückenmechanismus liegt seit V1 im Runner — er hatte nur nie diese
     Aufgabe. */
  connectLand(){
    const W=this.W,H=this.H,land=this.land,N=W*H;
    /* »Begehbar« muss hier dasselbe heißen wie in `walk()` — **Brücken zählen als Land**.
       Ohne das hielt der zweite Lauf jedes Zoneninnere für eine Insel (es hängt ja nur über seine
       Torbrücke am Ufer) und »rettete« es mit einem zweiten Zugang: gemessen sechs Komponenten von
       exakt 80 Feldern = das Zonen-Innenmaß 10×8. Damit lief der Spieler an jedem Torwächter vorbei
       (V3-S1) und der Gutter der Comicseite bekam ein zweites Loch (§3.2). */
    const pass=i=>(land[i]>0&&!this.blocked[i])||this.bridge.has(i);
    const gutter=this.gutter;
    const comp=new Int32Array(N).fill(-1),q=new Int32Array(N),sizes=[];
    const NB=[[1,0],[-1,0],[0,1],[0,-1]];
    let nc=0;
    for(let i=0;i<N;i++){
      if(!pass(i)||comp[i]>=0)continue;
      let head=0,tail=0;q[tail++]=i;comp[i]=nc;let n=0;
      while(head<tail){
        const c=q[head++];n++;
        const x=c%W,y=(c/W)|0;
        for(const[dx,dy]of NB){
          const nx=x+dx,ny=y+dy;
          if(nx<0||ny<0||nx>=W||ny>=H)continue;
          const j=ny*W+nx;
          if(pass(j)&&comp[j]<0){comp[j]=nc;q[tail++]=j;}
        }
      }
      sizes.push(n);nc++;
    }
    if(nc<=1){this.landComp=comp;console.log('[overworld] Land: eine Komponente,',sizes[0],'Felder');return;}
    let main=0;for(let k=1;k<nc;k++)if(sizes[k]>sizes[main])main=k;
    // Nur was eine Zone tragen könnte, wird angebunden — eine Sandbank von sieben Feldern nicht
    const want=new Set();
    for(let k=0;k<nc;k++)if(k!==main&&sizes[k]>=20)want.add(k);
    const built=[];
    while(want.size){
      // 0-1-BFS von der Hauptkomponente aus: Land kostet nichts, Wasser einen Schritt
      const dist=new Int32Array(N).fill(-1),prev=new Int32Array(N).fill(-1);
      const dq=[];let hi=0;
      for(let i=0;i<N;i++)if(comp[i]===main){dist[i]=0;dq.push(i);}
      let hit=-1;
      while(hi<dq.length){
        const c=dq[hi++];
        const x=c%W,y=(c/W)|0;
        for(const[dx,dy]of NB){
          const nx=x+dx,ny=y+dy;
          if(nx<1||ny<1||nx>=W-1||ny>=H-1)continue;
          const j=ny*W+nx;
          if(dist[j]>=0)continue;
          // Der Zonengraben IST der Gutter der Comicseite (§3.2) und hat genau ein Tor. Wer hier
          // eine zweite Brücke schlägt, lässt den Spieler an jedem Torwächter vorbei (V3-S1).
          if(gutter&&gutter.has(j))continue;
          dist[j]=dist[c]+1;prev[j]=c;dq.push(j);
          if(comp[j]>=0&&want.has(comp[j])){hit=j;hi=dq.length;break;}
        }
        if(hit>=0)break;
      }
      if(hit<0)break;   // nicht erreichbar — Rückweg: die übrigen bleiben, die Zonen meiden sie
      const target=comp[hit];
      // Strecke zurückverfolgen und alles Wasser darauf gangbar machen
      const span=[];
      for(let c=hit;c>=0&&comp[c]!==main;c=prev[c])if(!pass(c))span.push(c);
      const asBridge=span.length<=6;
      for(const c of span){
        const x=c%W,y=(c/W)|0;
        if(asBridge){
          const horiz=span.some(o=>Math.abs((o%W)-x)===1&&((o/W)|0)===y);
          this.bridge.set(c,horiz);
        }else land[c]=1;
        comp[c]=main;
      }
      // Die angebundene Insel gehört jetzt zur Hauptkomponente
      for(let i=0;i<N;i++)if(comp[i]===target)comp[i]=main;
      want.delete(target);
      built.push((asBridge?'Brücke ':'Damm ')+span.length+'F');
    }
    this.landComp=comp;
    console.log('[overworld] Land verbunden:',nc,'Komponenten (',sizes.join('/'),
      ') → Hauptland',sizes[main],'· angebunden:',built.length?built.join(' · '):'nichts nötig',
      want.size?('· UNERREICHBAR: '+want.size):'');
  }
  /* Kann der Held von hier nach dort laufen? Ohne diese Frage ist `travelPoint` ein Teleport ohne
     Rückweg — und die Hausregel sagt, jeder Auftrag braucht einen. */
  sameLand(tx,ty){
    const R=this.reachable;
    if(R)return !!R[ty*this.W+tx];
    const c=this.landComp;
    if(!c)return true;
    const h=this.hero;
    const a=c[Math.floor(h.y/TILE)*this.W+Math.floor(h.x/TILE)];
    const b=c[ty*this.W+tx];
    return a<0||b<0||a===b;
  }
  buildTown(best,sprites,inZoneArea){
    const W=this.W,H=this.H,land=this.land;
    this.places=[];this.tavern=null;this.nearPlace=null;
    this._missingPlaces=[];
    if(this.promptEl)this.promptEl.style.display='none';
    const mid=this.cityAt||{x:best.x,y:best.y};
    const free=(x,y)=>{
      if(!(x>2&&y>2&&x<W-3&&y<H-3&&land[y*W+x]===2&&!inZoneArea(x,y)))return false;
      /* Deko darf weichen, andere Orte nicht. Der Mindestabstand stand auf **4 Feldern** — bei einer
         Burg, die allein 5 Felder breit ist. Georgs Bild vom 7.8. zeigt die Folge: das Kloster steht
         vor dem Turmtor, der Türsteher ist nicht zu sehen, kämpfen kann man dort nicht.
         **9 Felder**, und snap darf weiter suchen — der Ort schiebt sich selbst frei, statt dass wir
         Wunschwinkel nachrechnen. */
      for(const q of this.places)if(Math.abs(q.tx-x)<9&&Math.abs(q.ty-y)<9)return false;
      return true;
    };
    // Was vor dem Bau der Stadt gewachsen ist, weicht dem Bau — sonst steht ein Baum im Wirtshaus
    const clearArea=(px,py,halfW,halfH)=>{
      for(let i=sprites.length-1;i>=0;i--){
        const sp=sprites[i];
        if(sp.town)continue;
        if(Math.abs(sp.x-px)<halfW&&sp.y>py-halfH&&sp.y<py+halfH*0.6)sprites.splice(i,1);
      }
      const tx0=Math.floor((px-halfW)/TILE),tx1=Math.ceil((px+halfW)/TILE);
      const ty0=Math.floor((py-halfH)/TILE),ty1=Math.ceil((py+halfH*0.6)/TILE);
      for(let y=ty0;y<=ty1;y++)for(let x=tx0;x<=tx1;x++)
        if(x>0&&y>0&&x<W&&y<H)this.blocked[y*W+x]=0;
    };
    /* Vom Wunschpunkt aus nach außen suchen. Die Grenze war erst 5, dann 14 — beides zu eng, sobald
       der Wunschpunkt im Wasser liegt. Bei `layout=noise` gibt es keine `cityAt`, die Radien 9–13 ×
       worldK zeigen auf einer verstreuten Rauschkarte ins Meer, und `snap` gab auf: gemessen fehlten
       bei noise/large/314 **drei von sechs Orten** — Turm (der ganze Dungeon-Slice), Archiv
       (Seitenwechsel) und Friedhof (Respawn), sichtbar nur als `console.warn`.
       Jetzt wird gesucht, bis die Insel abgesucht ist. Die Ringreihenfolge hält den Ort trotzdem so
       nah am Wunschpunkt wie möglich — ein Ort weiter draußen ist besser als keiner. */
    const snap=(wx,wy,maxR)=>{
      const lim=maxR||Math.max(W,H);
      for(let r=0;r<=lim;r++)for(let k=0;k<=r*8;k++){
        const a=k/Math.max(1,r*8)*Math.PI*2;
        const x=Math.round(wx+Math.cos(a)*r),y=Math.round(wy+Math.sin(a)*r);
        if(free(x,y))return{x,y};
      }
      return null;
    };
    /* v10-S3a · **Die ganze Runde an einem Ort.** Der Friedhof ist der Respawn-Punkt und damit der
       Startpunkt — also gehört er neben die Tutorial-Zone, nicht auf seinen Ringwinkel. Gesetzt
       wird nur der Wunschpunkt (fünf Felder vor dem Tor, nach außen); `snap` sucht sich von dort
       einen freien Platz wie für jeden anderen Ort. Fällt die Zone aus, gilt wieder der Winkel. */
    const tut=(this.zones||[]).find(z=>z.tutorial&&z.gate);
    const wunsch=def=>{
      const K=this.worldK||1;
      if(def.id==='graveyard'&&tut){
        const g=tut.gate;
        const dx=g.x===tut.x?-1:(g.x===tut.x+tut.w-1?1:0);
        const dy=g.y===tut.y?-1:(g.y===tut.y+tut.h-1?1:0);
        if(dx||dy)return{x:g.x+dx*5,y:g.y+dy*5};
      }
      return{x:Math.round(mid.x+Math.cos(def.a)*def.r*K),
             y:Math.round(mid.y+Math.sin(def.a)*def.r*K)};
    };
    for(const def of TOWN){
      const w0=wunsch(def);
      const spot=snap(w0.x,w0.y);
      if(!spot){
        // Ein fehlender Systemzugang ist Spielinhalt, keine Konsolenzeile
        console.warn('[overworld] kein Platz für',def.id);
        (this._missingPlaces=this._missingPlaces||[]).push(def.id);
        continue;
      }
      const p={id:def.id,label:def.label,hint:def.hint,tx:spot.x,ty:spot.y,
        x:(spot.x+0.5)*TILE,y:(spot.y+1)*TILE};
      const img=def.asset&&this.img[def.asset];
      p.img=img||null;p.def=def;
      if(img){
        clearArea(p.x,p.y,img.width/2+26,img.height*0.9);
        sprites.push({img,fw:img.width,frames:1,x:p.x,y:p.y+8,town:true});
      }else if(def.id==='graveyard'){
        clearArea(p.x,p.y,215,210);
        if(this.img.deadtree)sprites.push({img:this.img.deadtree,fw:this.img.deadtree.width,frames:1,x:p.x,y:p.y+4,town:true});
        // Der tote Baum ist 384 px breit — Knochen erst jenseits seiner Wurzeln, sonst liegen sie darin
        const spots=[[-168,34],[152,44],[112,74]];
        for(let i=0;i<3;i++){
          const b=this.img['bone'+i];
          if(b)sprites.push({img:b,fw:b.width,frames:1,x:p.x+spots[i][0],y:p.y+spots[i][1],town:true});
        }
      }else if(def.id==='market'){
        clearArea(p.x,p.y,240,180);
        const h3=this.img.b_house3;
        if(h3){
          sprites.push({img:h3,fw:h3.width,frames:1,x:p.x-96,y:p.y-16,town:true});
          sprites.push({img:h3,fw:h3.width,frames:1,x:p.x+104,y:p.y+22,town:true});
        }
      }else if(def.id==='garden'){
        clearArea(p.x,p.y,195,205);
        if(this.img.tree1)sprites.push({img:this.img.tree1,fw:probeStripCached(this.img.tree1).fw,
          frames:probeStripCached(this.img.tree1).frames,x:p.x-34,y:p.y,anim:0.8,town:true});
      }
      if(def.id==='tavern')this.tavern={x:p.x,y:p.y};
      this.places.push(p);
    }
    /* Zweiter Durchgang: erst JETZT wird gesperrt. Vorher setzte jeder Ort seinen Fußabdruck und
       der nächste Bau räumte ihn mit `clearArea` wieder ab — deshalb konnte man durch Turm und
       Wirtshaus hindurchlaufen (gemessen: `walk()` auf dem Turmfeld war `true`).

       **Die Sperrfläche kommt aus der Sprite-Geometrie** (V9-B5b). Vorher war sie ein fester Stummel:
       »zwei Felder tief« mit der Begründung, in der Draufsicht sei nur die Grundfläche Körper und der
       Rest Höhe. Diese Begründung ist für eine ECHTE Draufsicht richtig — Tiny Swords zeichnet aber
       schräg von vorn, und da ist die gezeichnete Wand Fläche, keine Höhe. Gemessen am Wirtshaus
       (Sprite 128×192 = 2×3 Felder): gesperrt war 1×2, und quer durch die obere Hälfte lief der Held
       4,69 von 4,69 Feldern ohne jeden Widerstand — mitten durch das gezeichnete Haus. Bei der Kirche
       (3×5 Felder) war es ein Fünftel. Georgs »man kann durch gebäude durchlaufen« war also kein
       fehlender Gummi, sondern **Kollision an der falschen Stelle**.
       Jetzt sperrt der Bau seine gezeichnete Fläche; nur die unterste Reihe bleibt frei (der Fußsaum,
       auf dem man vor der Tür steht) und das Türfeld darunter. */
    let solid=0;
    for(const p of this.places){
      const img=p.img;
      const tw=img?Math.max(1,Math.round(img.width/TILE)):2;
      const th=img?Math.max(1,Math.round(img.height/TILE)-1):1;
      for(let dy=0;dy<th;dy++)for(let dx=-((tw-1)>>1);dx<=(tw>>1);dx++){
        const bx=p.tx+dx,by=p.ty-dy;
        if(bx>0&&by>0&&bx<W&&by<H){this.blocked[by*W+bx]=1;solid++;}
      }
      // Vor der Tür bleibt frei — sonst steht man im Gebäude, wenn E gedrückt wird
      if(p.ty+1<H)this.blocked[(p.ty+1)*W+p.tx]=0;
    }
    console.log('[overworld] Gebäude solide:',solid,'Felder gesperrt · Mindestabstand 9');
    this.buildPaths(mid);
    sprites.sort((a,b)=>a.y-b.y);
    // Der Held startet auf dem Marktplatz — aber NEBEN dem Wegeknoten, nicht darauf: dort laufen
    // alle sechs Speichen plus die Platzfläche zusammen, und das erste Bild des Spiels wäre zu
    // einem Fünftel Sand (gemessen: 104 von 162 Wegfeldern im Startbild).
    const K2=this.worldK||1;
    const start=snap(Math.round(mid.x+4*K2),Math.round(mid.y+3*K2),6)||snap(mid.x,mid.y-1,6);
    if(start){
      clearArea((start.x+0.5)*TILE,(start.y+1)*TILE,80,110);
      this.hero.x=(start.x+0.5)*TILE;this.hero.y=(start.y+0.5)*TILE;
      this.spawn={x:this.hero.x,y:this.hero.y};
      this.cam={x:this.hero.x,y:this.hero.y};
    }
    const grab=this.places.find(p=>p.id==='graveyard');
    if(grab){
      this.spawn={x:grab.x,y:grab.y+70};
      console.log('[overworld] Respawn: Friedhof @'+grab.tx+','+grab.ty);
    }
    console.log('[overworld] Stadt:',this.places.map(p=>
      p.id+'@'+Math.round(Math.hypot(p.tx-mid.x,p.ty-mid.y))+'t').join(' · '),
      '· Mitte',mid.x+','+mid.y);
  }
  /* Die Lootbox (V5-S5). Sie ist ein ORT, kein neues System: damit gelten der E-Weg, die
     Nähe-Erkennung und die Sprechzeile, die es längst gibt. Auf dem Boden liegt eine Kiste (Deko mit
     gemessenem Fußpunkt), im Inneren steckt die Karte der Zone — dieselbe Karte, die der Kanon in 3D
     baut, hier über `OW_CARD` als 2D-Blatt mit Kanon-Tusche. */
  spawnLoot(zone){
    if(!zone||zone.loot)return;
    const x=(zone.x+zone.w/2)*TILE,y=(zone.y+zone.h*0.62)*TILE;
    const pen=this.att.loot!=='chest';
    const p={id:'loot_'+zone.zseed,label:pen?'Loot zone':'Lootbox',
      hint:pen?'walk in — the evidence lies inside':'open the evidence',
      x,y,tx:Math.round(x/TILE),ty:Math.round(y/TILE),zone,card:zone.card,loot:true,pen};
    zone.loot=p;
    (this.places=this.places||[]).push(p);
    if(pen)this.buildPen(p);else this.buildChest(p);
    if(window.OW_CARD)OW_CARD.ready();   // Kanon vorladen, damit das Aufdecken nicht wartet
  }
  buildChest(p){
    const url=window.OW_SRC?OW_SRC.a2d(LOOT_SHEET):null;
    if(!url||!this.OWL)return;
    this.OWL.loadImg(url).then(img=>{
      p.deco={img,fw:img.width,frames:1,anim:0,x:p.x,y:p.y};
      this.decos.push(p.deco);
      console.log('[loot] Kiste bei',Math.round(p.x)+','+Math.round(p.y),'für »'+p.card.t+'«');
    }).catch(e=>console.warn('[loot] Kisten-Sprite fehlt:',e.message));
  }
  /* Der Zaun liegt als Karte auf dem Boden: 7×4 Kacheln (1,75 ≈ CARD_AR), Tor unten in der Mitte,
     innen die Kartenrückseite. **Betreten ist die Handlung** — kein Knopf. */
  /* Ein Zaun braucht Land. Die Zonenmitte liegt bei »utopia« gern in der Lagune — gemessen: die
     erste gebaute Karte stand im Wasser. Also wird ein Platz GESUCHT (Ring um die Mitte, alle
     Ecken müssen begehbar sein); findet sich keiner, gibt es die Kiste. Kein Zaun im Meer. */
  penSpot(p){
    const W=this.W,land=this.land;
    const cw=Math.ceil(PEN_COLS/2)+1,chh=Math.ceil(PEN_ROWS/2)+1;
    const okAt=(tx,ty)=>{
      for(let dy=-chh;dy<=chh;dy++)for(let dx=-cw;dx<=cw;dx++){
        const x=tx+dx,y=ty+dy;
        if(x<1||y<1||x>=this.W-1||y>=this.H-1)return false;
        if(land[y*W+x]!==2)return false;
      }
      return true;
    };
    const t0={x:Math.round(p.x/TILE),y:Math.round(p.y/TILE)};
    if(okAt(t0.x,t0.y))return t0;
    for(let r=1;r<=10;r++)
      for(let a=0;a<16;a++){
        const th=a/16*Math.PI*2;
        const tx=Math.round(t0.x+Math.cos(th)*r),ty=Math.round(t0.y+Math.sin(th)*r);
        if(okAt(tx,ty))return{x:tx,y:ty};
      }
    return null;
  }
  buildPen(p){
    const url=window.OW_SRC?OW_SRC.a2d(FENCE_SHEET):null;
    if(!url||!this.OWL)return;
    const spot=this.penSpot(p);
    if(!spot){
      p.pen=false;p.label='Lootbox';p.hint='open the evidence';
      console.log('[loot] kein Land für die Zaun-Karte → Kiste bei',Math.round(p.x)+','+Math.round(p.y));
      return this.buildChest(p);
    }
    p.x=spot.x*TILE+TILE/2;p.y=spot.y*TILE+TILE/2;
    p.tx=spot.x;p.ty=spot.y;
    this.OWL.loadImg(url).then(sheet=>{
      const cut={};
      for(const k in FENCE){
        const[c,r]=FENCE[k];
        const cv=document.createElement('canvas');cv.width=64;cv.height=64;
        cv.getContext('2d').drawImage(sheet,c*64,r*64,64,64,0,0,64,64);
        cut[k]=cv;
      }
      const W=PEN_COLS*TILE,H=PEN_ROWS*TILE;
      const x0=p.x-W/2,y0=p.y-H/2;
      p.rect={x:x0,y:y0,w:W,h:H};
      p.inner={x:x0+TILE*0.7,y:y0+TILE*0.7,w:W-TILE*1.4,h:H-TILE*1.4};
      p.tiles=[];
      const put=(k,cx,cy)=>{
        const d={img:cut[k],fw:64,frames:1,anim:0,pad:FENCE_PAD[k],
          x:x0+cx*TILE+TILE/2,y:y0+cy*TILE+TILE};
        this.decos.push(d);p.tiles.push(d);
      };
      const gate=Math.floor(PEN_COLS/2);
      for(let c=0;c<PEN_COLS;c++)
        put(c===0?'tl':c===PEN_COLS-1?'tr':'rail',c,0);
      for(let r=1;r<PEN_ROWS-1;r++){put('left',0,r);put('right',PEN_COLS-1,r);}
      for(let c=0;c<PEN_COLS;c++){
        if(c===gate)continue;                                   // das Tor bleibt offen
        put(c===0?'bl':c===PEN_COLS-1?'br':c===gate-1?'gateL':c===gate+1?'gateR':'railB',
          c,PEN_ROWS-1);
      }
      if(window.OW_CARD)OW_CARD.ready().then(()=>{
        p.back=OW_CARD.back({size:Math.round(p.inner.w),seed:(p.card.n|0)+3}).canvas;
      });
      console.log('[loot] Zaun-Karte',PEN_COLS+'×'+PEN_ROWS,'bei',Math.round(p.x)+','+Math.round(p.y),
        '· Tor Spalte',gate,'· für »'+p.card.t+'«');
    }).catch(e=>console.warn('[loot] Zaun-Blatt fehlt:',e.message));
  }
  /* Die Rückseite liegt flach — also mit dem Boden gezeichnet, nicht mit den Sprites. */
  drawLootFloors(ctx){
    for(const p of (this.places||[])){
      if(!p.pen||!p.rect)continue;
      ctx.fillStyle='rgba(28,22,14,.10)';
      ctx.fillRect(p.rect.x,p.rect.y,p.rect.w,p.rect.h);
      if(p.back){
        const k=Math.min(p.inner.w/p.back.width,p.inner.h/p.back.height);
        const w=p.back.width*k,h=p.back.height*k;
        ctx.globalAlpha=0.96;
        ctx.drawImage(p.back,p.x-w/2,p.y-h/2,w,h);
        ctx.globalAlpha=1;
      }
    }
  }
  /* Prüfblatt (V9-B2). Kein Spielzug: kein Fund, kein XP, kein Diary, kein Save. */
  async previewCard(){
    if(!window.OW_REVEAL||!window.OW_CARD)return;
    const list=(this.zones||[]).map(z=>z.card).filter(Boolean);
    if(!list.length){this.msg('no card in this world');return;}
    this._pvi=((this._pvi==null?-1:this._pvi)+1)%list.length;
    const card=list[this._pvi];
    const wasPaused=this.paused;
    this.paused=true;this.keys={};
    await OW_CARD.ready();
    const sheet=OW_CARD.draw(card,{size:900,portrait:false,deck:this.deck&&this.deck.title,seed:(card.n|0)+11});
    let note='text sheet · PDF pending';
    if(window.OW_ART&&this.deck&&this.deck.packId)
      OW_ART.art({n:card.n,packId:this.deck.packId}).then(a=>{
        if(a&&OW_CARD.paintArt(sheet,a.canvas))
          console.log('[preview] Artwork: Seite',a.page,'· Quadrant',a.quad,
            '· Zellformat',a.ar.toFixed(3),a.measured?'· Raster gemessen':'· Raster GERATEN');
        else console.log('[preview] kein Artwork — Textblatt bleibt');
      });
    if(window.OW_CURSOR)OW_CURSOR.set('locked');
    OW_REVEAL.show({host:this.shadowRoot,canvas:sheet.canvas,
      title:'Card check '+(this._pvi+1)+'/'+list.length,
      sub:'»'+card.t+'« · '+(this.deck?this.deck.title:'')+' · #'+card.n,
      seed:(card.n|0)+11,
      onClose:()=>{this.paused=wasPaused;if(window.OW_CURSOR)OW_CURSOR.set('default');}});
  }
  /* ══ DER PDF-VIEWER IM TERRAIN (V9-B3) ══════════════════════════════════════════════════════
     Masterplan §3.2 und Georgs Briefing: der Viewer ist **ein Objekt in der Welt**, mit
     Kanon-Tusche umrandet, und **der Charakter bedient ihn**. Kein Overlay, keine Lightbox, keine
     Pause — wer davorsteht, sieht die Seite; wer darauf steht, hebt eine Karte; wer auf die
     Trittsteine tritt, blättert. Der Held IST der Cursor.
     Geometrie: eine Karte 5×3 Felder (320×192 px, Verhältnis 1,67 — dicht am Sollformat 1,74),
     das Blatt also 10×6 Felder. Groß genug, dass man den Titel im Vorbeilaufen liest. */
  buildReader(){
    this.reader=null;
    const W=this.W,H=this.H,land=this.land;
    /* **Die Viertelseite als Boden** (V9-B4g, Georg wörtlich: »statt einfach die entsprechende 2x2
       ecke des PDFs in der aspect ratio der page zu zeigen!«). Seite 1400×781 → Viertel 700×390 →
       Verhältnis 1,795. Das Feld ist deshalb **9×5 Felder** (576×320 = 1,80) und nicht mehr das
       Blattformat 1,74: der Boden ist keine gedruckte Karte, sondern der Ausschnitt einer Seite. */
    const CW=9,CH=5,BW=CW,BH=CH,PAD=1;
    /* Anker ist der **Marktplatz**, nicht der Spawnpunkt: »every road starts here« (§3.3), und ein
       Spielstand setzt den Helden irgendwohin — am Startpunkt gebaut lag das Blatt für Georg
       unsichtbar am anderen Ende der Insel. Ein Ort, den man beim Loslaufen nicht sieht, ist nicht da. */
    const market=(this.places||[]).find(p=>p.id==='market')||null;
    const anchor=market?{x:market.tx*TILE,y:market.ty*TILE}:(this.spawn||{x:W*TILE/2,y:H*TILE/2});
    const sx=Math.floor(anchor.x/TILE),sy=Math.floor(anchor.y/TILE);
    const frei=(x0,y0)=>{
      for(let y=y0-PAD;y<y0+BH+PAD;y++)for(let x=x0-PAD-2;x<x0+BW+PAD+2;x++){
        if(x<1||y<1||x>=W-1||y>=H-1)return false;
        const i=y*W+x;
        if(land[i]!==2||this.blocked[i])return false;
        if(this.zones.some(z=>x>=z.x-1&&x<z.x+z.w+1&&y>=z.y-1&&y<z.y+z.h+1))return false;
      }
      return true;
    };
    /* Vom Startpunkt nach außen suchen, nicht an eine geratene Adresse setzen. Ein Ort, den man
       beim Loslaufen nicht sieht, ist für Georg nicht da — genau das war der Befund. */
    let put=null;
    for(let r=3;r<40&&!put;r++)
      for(let a=0;a<24&&!put;a++){
        const th=a/24*Math.PI*2;
        const x=Math.round(sx+Math.cos(th)*r)-((BW/2)|0),y=Math.round(sy+Math.sin(th)*r)-((BH/2)|0);
        if(frei(x,y))put={x,y};
      }
    if(!put){console.warn('[reader] kein freier Platz für das Blatt gefunden');return;}
    const off=1;
    const first=(this.zones[0]&&this.zones[0].card)||(this.cards&&this.cards[0])||{n:1,t:'Untitled'};
    this.reader={x:put.x,y:put.y,w:BW,h:BH,cw:CW,ch:CH,off,mode:'single',
      card:first,page:off+1+Math.floor(((first.n||1)-1)/4),
      img:null,back:null,pick:null,seed:(this.att.seed|0)+404,pages:null};
    // Der Reader sperrt nichts: man läuft über das Blatt. Deko darauf wäre aber Unsinn.
    for(let y=put.y;y<put.y+BH;y++)for(let x=put.x-2;x<put.x+BW+2;x++)this.blocked[y*W+x]=0;
    this.decos=(this.decos||[]).filter(d=>{
      const dx=Math.floor(d.x/TILE),dy=Math.floor(d.y/TILE);
      return !(dx>=put.x-2&&dx<put.x+BW+2&&dy>=put.y-1&&dy<put.y+BH+1);
    });
    console.log('[reader] Karte im Terrain @'+put.x+','+put.y+' · '+BW+'×'+BH+' Felder · »'+
      (this.reader.card.t||'?')+'« #'+this.reader.card.n+
      ' · '+(market?Math.round(Math.hypot(put.x-sx,put.y-sy))+' Felder vom Marktplatz':'ohne Marktplatz gesetzt')+
      ' · Held steht '+Math.round(Math.hypot(this.hero.x/TILE-put.x,this.hero.y/TILE-put.y))+' Felder entfernt');
    this.loadReaderCard();
    this.dressReader();
  }
  /* ── v10-S1b · DIE KARTE IST EIN ORT, KEIN FOTO ────────────────────────────────────────────
     Georgs Befund am Bildschirmfoto: ein perfektes Rechteck mit Fotokante auf gleichmäßigem Grün.
     Drei billige Mittel, die sich gegenseitig tragen (die Tusche ist Punkt I und sitzt in
     `drawReader`):
       **F · Die Kante gehört dem Terrain.** Büschel aus DEMSELBEN Deko-Vorrat wie die Landschaft
         stehen mit ihrem Fuß auf der Kante — gezeichnet werden sie im Sprite-Durchgang, also ÜBER
         der Tusche. Verdeckung ist der stärkste Tiefenhinweis, den es gibt.
       **C · Ein Anker überlappt.** Ein Stein steht mit dem Fuß AUF dem Blatt. Ein Frame, und die
         Karte liegt in der Welt statt darauf.
     Nichts davon sperrt ein Feld: das Blatt bleibt begehbar, der Charakter ist der Cursor (V9-B3).
     Die Mitte bleibt frei — verdeckt wird an den Rändern, nicht über dem Bild. */
  dressReader(){
    const R=this.reader;if(!R)return;
    const s=(this.att.seed|0)+404;
    const x0=R.x*TILE,y0=R.y*TILE,w=R.w*TILE,h=R.h*TILE;
    /* Requisiten aus DEMSELBEN Blatt wie die Landschaft (`OW_PROPS`) — und benannt gewählt, nicht
       gewürfelt: an einer Kante, die Terrain sein soll, hat ein Kürbis nichts verloren. Fehlt das
       Blatt, fällt es auf den Tiny-Swords-Vorrat zurück (auf »läuft« gaten, nicht auf »existiert«). */
    const ausBlatt=(vorsilbe,r)=>{
      if(!this.PROPS)return null;
      for(let i=0;i<12;i++){
        const p=this.PROPS.pick((r+i*0.137)%1,{grid:this.att.propGrid==='pixel'?'pixel':'smooth',
          biome:'grass',place:'deco'});
        if(p&&(!vorsilbe||String(p.name||'').startsWith(vorsilbe)))return p;
      }
      return null;
    };
    const setz=(p,px,py)=>{if(!p)return 0;p.x=px;p.y=py;this.decos.push(p);return 1;};
    const notfall=i=>{
      const img=this.img['deco'+(1+Math.floor(rand2(i*13+5,i*7+3,s)*18))];
      if(!img)return null;
      const st=probeStripCached(img);
      return {img,fw:st?st.fw:img.width,frames:st?st.frames:1,anim:0.7};
    };
    let n=0,k=0;
    const halm=()=>{k++;return ausBlatt(rand2(k,2,s)<0.55?'Busch':'Blueher',rand2(k*3,7,s))||notfall(k);};
    /* Oben und unten je drei, außen dichter als in der Mitte: ein Saum, der die Kante verdeckt,
       kein Zaun. Der Fuß liegt AUF der Tuschelinie — daneben wäre es Nachbarschaft, nicht Verdeckung. */
    for(const [ry,dy] of [[0,5],[1,3]])
      for(let i=0;i<3;i++){
        const t=[0.09,0.5,0.91][i]+(rand2(i+ry*9,3,s)-0.5)*0.07;
        n+=setz(halm(),x0+w*t,y0+ry*h+dy);
      }
    // Links und rechts je eines auf halber Höhe — die senkrechte Kante braucht dieselbe Behandlung
    for(const [rx,dx] of [[0,3],[1,-3]])
      n+=setz(halm(),x0+rx*w+dx,y0+h*(0.42+rand2(rx,11,s)*0.2));
    /* C · der Anker: ein Stein mit dem Fuß AUF dem Blatt, obere linke Ecke. Er ist das einzige
       große Ding darauf — zwei wären Deko, eines ist ein Ort. */
    const anker=ausBlatt('Stein',rand2(41,5,s))||notfall(21);
    n+=setz(anker,x0+TILE*1.1,y0+TILE*0.9);
    console.log('[reader] Kante bewachsen:',n,'Requisiten ·',
      this.PROPS?'aus dem Prop-Blatt':'aus dem Tiny-Swords-Vorrat','· nichts gesperrt');
  }
  /* Die Zelle aus dem Deck-PDF — der Kartenbauer hält die Adresse, wir halten nur den Boden.
     Die Kartenrückseite ist der **Fallback**, nicht Deko: ohne Verbindung liegt die Karte verdeckt
     da, statt dass ein leeres Rechteck im Gras steht. Sie ist gleichzeitig der Zustand »noch nicht
     aufgedeckt«, den der Sand-Kampf (V9-B5) braucht. */
  async loadReaderCard(){
    const R=this.reader;if(!R)return;
    /* v10-S16: der Reader nimmt die Rückseite **seiner Zone** — sonst zeigt das Blatt im Viewer
       eine andere Rückseite als dasselbe Blatt im Terrain. `OW_BACKS` hat seinen eigenen Rückweg. */
    if(!R.back){
      if(R.zone&&R.zone._back)R.back=R.zone._back;
      else if(window.OW_BACKS)OW_BACKS.für({seed:(R.zone&&R.zone.zseed|0)||7,set:this.att.backSet||'kfb'})
        .then(r=>{if(this.reader===R&&r)R.back=r.img;});
      else this.OWL.loadImg('overworld/card-backside.png')
        .then(i=>{if(this.reader===R)R.back=i;}).catch(()=>{});
    }
    if(!window.OW_ART)return;
    const pid=this.deck&&this.deck.packId;if(!pid)return;
    if(!R.meta){R.meta=await OW_ART.meta(pid)||{off:1};R.off=R.meta.off!=null?R.meta.off:1;}
    /* **`quarter()`, nicht `art()`** (V9-B4g). `art()` schneidet nach dem gemessenen `cardGrid` —
       richtig für das Blatt in der Hand, wo kein Fremdinhalt an den Rand darf. Hier ist es falsch,
       weil eine Zahl, die falsch sitzt, den Titel oder die LORE-Zeile abschneidet: **dreimal**
       passiert, weil die Kartengrenzen auf dieser Seite Weißraum sind und keine Tuschelinie.
       Eine Halbierung kann nicht falsch sitzen. Der Preis ist ein Streifen Papier am Rand. */
    const a=await OW_ART.quarter({n:R.card.n,packId:pid},1400);
    if(a&&this.reader===R){
      R.img=a.canvas;
      console.log('[reader] Viertelseite: Seite',a.page,'· Quadrant',a.quad,
        '·',a.canvas.width+'×'+a.canvas.height,'· Verhältnis',a.ar.toFixed(3),
        '(Feld '+(R.w/R.h).toFixed(3)+')');
    }else if(this.reader===R)console.log('[reader] keine Seite — Rückseite bleibt liegen');
  }
  /* **Eine** Zellgeometrie für Treffer UND Hervorhebung (V9-B3b). Vorher rechnete der Treffer auf
     dem Blattrechteck und ignorierte, dass die gedruckte Seite einen Rand und zwischen den Karten
     einen Gutter hat: am Blattrand stand man auf »einer Karte«, obwohl man auf dem Seitenrand stand.
     `OW_ART.meta()` liefert das gemessene Raster — hier wird es benutzt, statt es zu raten.
     Rückgabe: Bildlage im Blatt + die vier Zellrechtecke, alles in Blattkoordinaten (px). */
  readerCells(R){
    const w=R.w*TILE,h=R.h*TILE;
    if(!R.img)return null;
    const k=Math.min(w/R.img.width,h/R.img.height);
    const iw=R.img.width*k,ih=R.img.height*k,ix=(w-iw)/2,iy=(h-ih)/2;
    const G=(R.meta&&R.meta.grid)||{x:0,y:0,w:1,h:1,gapX:0,gapY:0};
    const cw=(G.w-G.gapX)/2,ch=(G.h-G.gapY)/2;
    const cells=[];
    for(let qi=0;qi<4;qi++){
      const cx=G.x+(qi%2)*(cw+G.gapX),cy=G.y+((qi/2)|0)*(ch+G.gapY);
      cells.push({qi,x:ix+cx*iw,y:iy+cy*ih,w:cw*iw,h:ch*ih});
    }
    return{ix,iy,iw,ih,cells};
  }
  /* Bedienung: reine Ortsabfrage, kein Tastendruck. Der Charakter ist der Cursor. */
  stepReader(dt){
    const R=this.reader;if(!R||this.interior||!this.hero)return;
    const hx=this.hero.x/TILE,hy=this.hero.y/TILE;
    const onSheet=hx>=R.x&&hx<R.x+R.w&&hy>=R.y&&hy<R.y+R.h;
    /* **Auf dem Blatt gehört der Bildschirm dem Blatt** (V9-B3b). Das HUD deckte die obere
       Kartenreihe zu — und Lesbarkeit ist der ganze Zweck des Objekts. Dieselbe Mechanik wie Tab,
       kein zweiter Weg; die eigene Wahl des Spielers wird gemerkt und zurückgegeben. */
    if(onSheet!==!!R.onSheet){
      R.onSheet=onSheet;
      /* v12-K2 · DAS BLATT SCHALTET DAS HUD NICHT MEHR AB (Georg 12.8.: »das UI wechselt in den
         Tab-Minified-State beim Betreten der Card Zone«). Hier stand `this.minimal=true` —
         V9-B3b, und der Anlass war echt: das HUD von damals deckte die obere Kartenreihe zu.
         Seit dem Rail-Umbau steht links ein kleines Blatt und rechts eine schmale Spalte; das
         Blatt liegt zwischen beiden. Der Grund ist weg, der Griff war geblieben — und ein
         Moduswechsel, den der Spieler nicht ausgelöst hat, liest sich als Defekt.
         **Was das Blatt im Bild hält, ist jetzt die Kamera-Klammer** (v12-K1), nicht das Abräumen
         der Anzeige. TAB gehört weiter dem Spieler. */
    }
    // Blättern ist geparkt (V9-B4, Georg: »die blätter buttons sind viel zu groß« · PDF-Blättern später)
    let pick=null;
    if(onSheet&&R.mode==='single')pick={qi:0,n:R.card.n,card:R.card,cell:null};
    else if(onSheet){
      const geo=this.readerCells(R);
      if(geo){
        const px=(hx-R.x)*TILE,py=(hy-R.y)*TILE;
        for(const c of geo.cells)
          if(px>=c.x&&px<c.x+c.w&&py>=c.y&&py<c.y+c.h){
            const n=(R.page-R.off-1)*4+c.qi+1;
            pick={qi:c.qi,n,card:(this.cards||[]).find(x=>x.n===n)||null,cell:c};
            break;
          }
      }
    }
    if((pick&&pick.n)!==(R.pick&&R.pick.n)){
      R.pick=pick;
      if(pick&&pick.card&&this.say)this.say('»'+pick.card.t+'«',2.2,'read');
    }
  }
  /* ── v10-S2b · EIN KARTENTELLER, ZWEI AUFRUFER ───────────────────────────────────────────────
     Reader und Kampfzone zeichnen ab hier dieselbe Karte. Vorher gab es den Teller nur einmal, im
     Reader, und die sechs Zonen waren beigefarbene Rechtecke mit einem Titel — Georgs Befund:
     »die Zone zeigt einfach eine andere Textur statt die Karte«. Zwei Zeichner für dasselbe Objekt
     hätten beim nächsten Fork auseinandergelaufen (»eine Zahl, ein Ort«).

     **Die Feder trägt das Format, die Felder tragen den Tritt.** Ganzzahlige Felder treffen
     `CARD_AR` 1,74 nicht: 18×10 ist 1,80, und die nächsten ganzzahligen Treffer wären 19×11 (1,727)
     oder 26×15 (1,733). Also läuft die Tusche auf Feldbruchteilen im echten Format und ragt oben und
     unten über das begehbare Rechteck hinaus (bei 18×10 um 11 px je Seite). Begehbar bleibt das
     ganze Rechteck — die Kontur ist die Kante des Ortes, nicht ein Zaun.

     `o = {x,y,w,h}` in Weltpixeln · `seed` für die Feder · `img` die aufgedeckte Karte ·
     `back` die Rückseite · `reveal` 0…1 (0 = verdeckt, 1 = offen) · `lift` der Zonenschatten. */
  /* **Die Feder sitzt INNEN — deshalb blieb ein Rand stehen** (v10-S8, Georgs Befund).
     `canon.contour('card',…)` liefert eine Kontur, die rund 1,3 % vom Rechteck eingerückt ist
     (gemessen bei 1152×662: Kasten 14,2 … 1137,1 · 14,4 … 647,8, also ~15 px je Seite). Die Füllung
     ist auf diese Kontur geklippt — also blieben zwischen Tuschelinie und Wasser **15 px
     Zonenboden** sichtbar, und beim Dungeon-Biom ist der papierbeige. Das ist der »innere Spalt«.
     Jetzt wird das Blatt so viel größer gebaut, dass die **Kontur** auf der Zonenkante landet:
     einmal messen, Verhältnis merken, mit dem größeren Maß neu bauen. Gemerkt wird je Blattgröße,
     nicht je Bild — die Kontur ist deterministisch. */
  konturRand(seed,w,h){
    const canon=window.OW_CARD&&OW_CARD.canon;if(!canon)return{fx:0,fy:0};
    const k=seed+'|'+Math.round(w)+'|'+Math.round(h);
    this._rand=this._rand||new Map();
    if(this._rand.has(k))return this._rand.get(k);
    let r={fx:0,fy:0};
    try{
      const pts=canon.contour('card',seed,w,h);
      let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
      for(const p of pts){const px=Array.isArray(p)?p[0]:p.x,py=Array.isArray(p)?p[1]:p.y;
        if(px<x0)x0=px;if(px>x1)x1=px;if(py<y0)y0=py;if(py>y1)y1=py;}
      if(x1>x0&&y1>y0)r={fx:(x0+(w-x1))/w,fy:(y0+(h-y1))/h};
    }catch(e){}
    this._rand.set(k,r);return r;
  }
  drawCardPlate(ctx,o){
    const canon=window.OW_CARD&&OW_CARD.canon;
    const AR=(window.OW_CARD&&OW_CARD.CARD_AR)||1.74;
    let w=o.w, h=Math.round(o.w/AR);
    let x=o.x, y=o.y+Math.round((o.h-h)/2);
    // Die KANTE, die man sieht: das Rechteck VOR der Aufweitung. Darauf liegt die Feder.
    const kante={x,y,w,h};
    if(o.flush!==false&&canon){
      const r=this.konturRand(o.seed||7,w,h);
      const w2=Math.round(w/(1-r.fx)), h2=Math.round(h/(1-r.fy));
      x-=Math.round((w2-w)/2);y-=Math.round((h2-h)/2);
      w=w2;h=h2;
    }
    const seed=o.seed||7;
    const lift=o.lift!=null?o.lift:0;
    const LICHT={x:-1,y:-1};   // Licht von oben links — die eine Richtung für alle Schatten
    if(lift>0){
      const s=Math.min(TILE*1.6,TILE*0.42*lift);
      ctx.save();
      ctx.translate(x-LICHT.x*s*0.5,y-LICHT.y*s*0.5);
      const p=canon?canon.contour('card',seed,w,h):null;
      ctx.globalAlpha=0.30;ctx.fillStyle='#241d12';
      if(p){canon.pathOf(ctx,p);ctx.fill();}else ctx.fillRect(0,0,w,h);
      ctx.restore();
    }
    ctx.save();
    ctx.translate(x,y);
    const pts=canon?canon.contour('card',seed,w,h):null;
    ctx.save();
    if(pts){canon.pathOf(ctx,pts);ctx.clip();}
    ctx.fillStyle='#f4ecd6';ctx.fillRect(0,0,w,h);
    /* Rand für die Tusche: formatfüllend gezeichnet deckte das Bild die eigene Kontur zu, und man
       sah nur die harte Schnittkante des PDF. Hier ist die Linie aber die Zonengrenze. */
    const m=Math.round(Math.min(w,h)*0.045);
    const bw=w-2*m,bh=h-2*m;
    const leg=img=>{
      if(!img)return;
      const k=Math.min(bw/img.width,bh/img.height);
      const iw=img.width*k,ih=img.height*k;
      ctx.imageSmoothingQuality='high';
      ctx.drawImage(img,m+(bw-iw)/2,m+(bh-ih)/2,iw,ih);
    };
    const rev=Math.max(0,Math.min(1,o.reveal==null?1:o.reveal));
    if(rev>=1)leg(o.img||o.back);
    else if(rev<=0)leg(o.back||o.img);
    else{
      /* **Die Rückseite zieht sich zurück, sie blendet nicht aus.** Ein Alpha-Übergang sieht aus
         wie ein Fehler im Bild; ein Rückzug sieht aus wie ein Vorgang. Die Kante läuft schräg —
         eine gerade Kante liest als Wischmaske, eine schräge als Papier, das sich löst. */
      leg(o.img||o.back);
      if(o.back){
        const d=(w+h)*rev;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(d,0);ctx.lineTo(w,0);ctx.lineTo(w,h);ctx.lineTo(d-h,h);
        ctx.closePath();ctx.clip();
        leg(o.back);
        ctx.restore();
        // Der Glanz auf der laufenden Kante: sie soll gerissen wirken, nicht geschnitten
        ctx.save();
        ctx.globalAlpha=0.55;
        ctx.strokeStyle='#fff8e4';ctx.lineWidth=Math.max(2,TILE*0.06);
        ctx.beginPath();ctx.moveTo(d,0);ctx.lineTo(d-h,h);ctx.stroke();
        ctx.restore();
      }
    }
    ctx.restore();
    /* Die Grube: zwei Verläufe an den Lichtkanten, innen. Kein Blur, keine zweite Kontur — der Clip
       von oben gilt noch, also kann der Verlauf nicht über die Tusche hinauslaufen. */
    if(lift<0){
      const d=Math.min(TILE*1.5,TILE*0.40*-lift);
      ctx.save();
      if(pts){canon.pathOf(ctx,pts);ctx.clip();}
      const gy=ctx.createLinearGradient(0,0,0,d);
      gy.addColorStop(0,'rgba(30,24,14,.42)');gy.addColorStop(1,'rgba(30,24,14,0)');
      ctx.fillStyle=gy;ctx.fillRect(0,0,w,d);
      const gx=ctx.createLinearGradient(0,0,d,0);
      gx.addColorStop(0,'rgba(30,24,14,.34)');gx.addColorStop(1,'rgba(30,24,14,0)');
      ctx.fillStyle=gx;ctx.fillRect(0,0,d,h);
      // Gegenlicht an der Sonnenseite: eine Grube hat unten rechts eine helle Kante
      const gh=ctx.createLinearGradient(0,h,0,h-d*0.7);
      gh.addColorStop(0,'rgba(255,246,214,.20)');gh.addColorStop(1,'rgba(255,246,214,0)');
      ctx.fillStyle=gh;ctx.fillRect(0,h-d*0.7,w,d*0.7);
      ctx.restore();
    }
    // Was der Aufrufer noch INNEN haben will (der Reader seine Zellen-Hervorhebung) — vor der Tusche
    if(o.after)o.after(ctx,w,h);
    if(pts)canon.drawInk('card',ctx,pts,w,h,seed,(OW_CARD.inkGain||1)*1.8);
    ctx.restore();
    /* Zwei Rechtecke, zwei Bedeutungen — und beide benannt, damit sie nicht verwechselt werden:
       `x/y/w/h` = das gezeichnete Blatt (um den Konturrand größer, trägt die Kunst),
       `kante`    = wo die Feder liegt. Wasser und Schattenclip gehören an die **Kante**. */
    return {x,y,w,h,kante};
  }
  /* Kartenkunst je Zone: dieselbe Viertelseite wie beim Reader (`quarter()`, nicht `art()` — eine
     Halbierung kann nicht falsch sitzen, V9-B4g). Geladen wird **eine Zone nach der anderen und nur
     bei Bedarf**: sechs PDF-Seiten beim Weltbau wären sechs Sekunden Stillstand für Bilder, die man
     erst nach dem Kampf sieht. Die Rückseite ist geteilt und liegt sofort. */
  async loadZoneCard(z){
    if(!z||z._artLaeuft)return;
    z._artLaeuft=true;
    try{
      if(!window.OW_ART||!this.deck||!this.deck.packId)return;
      const a=await OW_ART.quarter({n:z.card.n,packId:this.deck.packId},1200);
      if(a){z.art=a.canvas;
        console.log('[zone] Karte »'+z.card.t+'« · Seite',a.page,'Quadrant',a.quad,
          '·',a.canvas.width+'×'+a.canvas.height);}
    }catch(e){console.warn('[zone] keine Kartenkunst für »'+z.card.t+'«:',e.message);}
    finally{z._artLaeuft=false;}
  }
  /* v10-S16 · **Vier Rückseiten statt einer.** Bis eben lag eine einzige Zeichnung unter allen
     sechs Zonen — sechs verdeckte Karten sahen aus wie sechsmal dasselbe Blatt. Jetzt kommen sie
     aus Seite 16 des Anti-Rules-Decks, geschnitten mit **demselben Raster wie die Vorderseiten**
     (`OW_BACKS`), und jede Zone bekommt **deterministisch** ihre eigene: gewürfelt aus dem
     Zonen-Seed, nicht aus `Math.random` — sonst wechselte das Blatt bei jedem Neuzeichnen.
     Der Reader behält die geteilte Rückseite als Rückweg, falls der Satz nicht lädt. */
  loadCardBack(){
    if(this._backLaeuft)return;
    this._backLaeuft=true;
    const satz=this.att.backSet||'kfb';
    if(window.OW_BACKS){
      OW_BACKS.vorladen(satz).then(async st=>{
        for(const z of this.zones){
          const r=await OW_BACKS.für({seed:(z.zseed|0)+(z.card&&z.card.n|0),set:satz});
          if(r)z._back=r.img;
        }
        this._back=this.zones[0]&&this.zones[0]._back||null;
        this._backLaeuft=false;
        console.log('[backs] Satz '+st.satz+' · '+st.blätter+' Blätter · Zonen belegt '+
          this.zones.filter(z=>z._back).length+'/'+this.zones.length+
          ' · Varianten '+new Set(this.zones.map(z=>z._back)).size);
      }).catch(()=>{this._backLaeuft=false;});
      return;
    }
    const nimm=i=>{this._back=i;this._backLaeuft=false;};
    this.OWL.loadImg('overworld/card-backside.png').then(nimm).catch(()=>{this._backLaeuft=false;});
  }
  /* Gezeichnet nach dem Graben und vor der Tusche: die Karte LIEGT in der Zone. */
  drawZoneCards(ctx,x0,y0,x1,y1){
    if(this.interior||!this.zones.length)return 0;
    let n=0;
    for(const z of this.zones){
      if(z.x>x1+1||z.x+z.w<x0-1||z.y>y1+1||z.y+z.h<y0-1)continue;
      if(!z.art&&z.cleared)this.loadZoneCard(z);
      const rev=z.cleared?(z.revealT==null?1:Math.min(1,z.revealT/1.4)):0;
      const pl=this.drawCardPlate(ctx,{x:z.x*TILE,y:z.y*TILE,w:z.w*TILE,h:z.h*TILE,
        seed:(z.card&&z.card.n|0)+z.zseed,img:z.art,back:z._back||this._back,reveal:rev,
        lift:this.att.cardLift!=null?+this.att.cardLift:-1.4});
      z._plate=pl.kante||pl;   // nach außen gilt die KANTE — Wasser und Schatten hängen daran
      n++;
    }
    return n;
  }
  /* Gezeichnet wird nach dem Boden und vor der Deko: das Blatt LIEGT im Gras.
     Seit v10-S2b malt **`drawCardPlate`** den Teller — Schatten, Grube, Papier, Bild, Tusche, alles
     einmal für Reader und Kampfzone. Hier bleibt nur, was der Reader eigen hat: die Hervorhebung der
     gewählten Zelle (als `after`, also INNEN vor der Tusche) und die geparkten Trittsteine. */
  drawReader(ctx){
    const R=this.reader;if(!R||this.interior)return;
    const canon=window.OW_CARD&&OW_CARD.canon;
    const plate=this.drawCardPlate(ctx,{
      x:R.x*TILE,y:R.y*TILE,w:R.w*TILE,h:R.h*TILE,
      seed:R.seed,img:R.img,back:R.back,reveal:1,
      lift:this.att.cardLift!=null?+this.att.cardLift:-1.4,
      after:(c,w,h)=>{
        // Die gewählte Karte hebt sich: der Rest tritt zurück, statt dass eine Lupe aufgeht.
        // Die Zelle kommt aus `readerCells` — dieselbe Geometrie, die den Treffer entschied.
        if(R.mode!=='page'||!R.pick||!R.pick.cell)return;
        const cc=R.pick.cell;
        c.fillStyle='rgba(30,24,16,.30)';
        c.fillRect(0,0,w,h);
        c.save();
        c.beginPath();c.rect(cc.x,cc.y,cc.w,cc.h);c.clip();
        c.fillStyle='#f4ecd6';c.fillRect(cc.x,cc.y,cc.w,cc.h);
        if(R.img){
          const k=Math.min(w/R.img.width,h/R.img.height);
          const iw=R.img.width*k,ih=R.img.height*k;
          c.drawImage(R.img,(w-iw)/2,(h-ih)/2,iw,ih);
        }
        c.restore();
      }});
    const w=plate.w,h=plate.h;
    ctx.save();
    ctx.translate(plate.x,plate.y);
    // Trittsteine gehören dem späteren Seitenmodus (V9-B4: gepark, nicht gelöscht)
    const stone=(sxT,dir,dead)=>{
      const px=sxT*TILE,py=(R.y+R.h/2-1)*TILE,sw=2*TILE,sh=2*TILE;
      ctx.save();ctx.translate(px,py);
      const sp=canon?canon.contour('chip',R.seed+(dir>0?7:13),sw,sh):null;
      ctx.save();
      if(sp){canon.pathOf(ctx,sp);ctx.clip();}
      ctx.fillStyle=dead?'rgba(214,203,178,.55)':'#e8dcbe';ctx.fillRect(0,0,sw,sh);
      ctx.restore();
      if(sp)canon.drawInk('chip',ctx,sp,sw,sh,R.seed+(dir>0?7:13));      ctx.fillStyle=dead?'rgba(60,50,36,.35)':'#2a2318';
      ctx.beginPath();
      const cx=sw/2,cy=sh/2,a=TILE*0.42;
      ctx.moveTo(cx+dir*a,cy);ctx.lineTo(cx-dir*a*0.7,cy-a*0.8);ctx.lineTo(cx-dir*a*0.7,cy+a*0.8);
      ctx.closePath();ctx.fill();
      ctx.restore();
    };
    if(R.mode==='page'){
      const lo=R.off+1,hi=R.pages||99;
      stone(R.x-2,-1,R.page<=lo);
      stone(R.x+R.w,1,R.page>=hi);
    }
    /* **Der Titelstreifen ist geparkt** (V9-B4d, Georg): »cooles feature, sollte aber hier nicht
       angezeigt werden, da titel etc ja auch auf der card/im PDF viewer zu sehen ist.« Richtig — die
       Karte sagt ihren Namen selbst, ein Etikett darüber sagt ihn zweimal. Der Code bleibt stehen
       (`R.showLabel`, Standard aus), weil er im späteren Seitenmodus wieder Sinn hat: dort stehen
       vier Titel auf einem Blatt, und dann ist eine Zeile, die »diese hier« sagt, keine Doppelung.
       Zur Erinnerung, falls er zurückkommt: die Zeile gehört **über** die Oberkante — unter dem Blatt
       steht die Stadt und deckt sie zu (V9-B3b, gemessen an Marktplatz ty 34 und Deko 33,9…35,3). */
    if(!R.showLabel){ctx.restore();return;}   // v10-S2b-Fix: das offene `save()` von oben zurücknehmen
    ctx.restore();                            // der Titelstreifen rechnet in Weltpixeln, nicht im Blatt
    const x=plate.x,y=plate.y;
    ctx.save();
    const lbl=R.mode==='single'?'»'+(R.card.t||'?')+'«':
      (R.pick&&R.pick.card?'»'+R.pick.card.t+'«':
      ('the reader · page '+(R.page-R.off)+(R.pages?'/'+(R.pages-R.off):'')));
    const fs=Math.round(TILE*0.46);
    ctx.font='600 '+fs+'px "Special Elite",monospace';
    const tw=ctx.measureText(lbl).width,ph=fs*1.7,pw=tw+TILE*0.9;
    const px0=x+w/2-pw/2,py0=y-ph-TILE*0.22;
    ctx.fillStyle='rgba(244,236,214,.94)';
    ctx.fillRect(px0,py0,pw,ph);
    ctx.strokeStyle='rgba(40,32,20,.85)';ctx.lineWidth=2.2;
    ctx.beginPath();ctx.moveTo(px0,py0+ph);ctx.lineTo(px0+pw,py0+ph);ctx.stroke();
    ctx.fillStyle='#2a2318';
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(lbl,x+w/2,py0+ph/2+1);
    ctx.textAlign='left';ctx.textBaseline='alphabetic';
    ctx.restore();
  }
  async openLoot(p){
    if(!p||!window.OW_REVEAL||!window.OW_CARD)return;
    if(p.opening)return;
    p.opening=true;   // vor dem ersten await: der Kanon-Import dauert, die Schleife läuft weiter
    const wasPaused=this.paused;
    this.paused=true;this.keys={};
    await OW_CARD.ready();
    /* Querformat: die echte Cut-&-Play-Karte LIEGT (Zellformat 1,46–1,97), und ab V9-B2 kann auf dem
       Blatt das Bild aus dem Deck-PDF landen. Ein hochkant gestelltes Blatt hätte dafür nur ein Band
       in der Mitte übrig. Das Textblatt liegt jetzt genauso — ein Format für beide Zustände. */
    const sheet=OW_CARD.draw(p.card,{size:900,portrait:false,deck:this.deck&&this.deck.title,seed:(p.card.n|0)+11});
    if(sheet.ink)console.log('[loot] Tusche:',sheet.ink.kind,'· Bauchung',sheet.ink.bowPct+'%',
      '· Feder',sheet.ink.featherPct+'%','·',sheet.ink.ok?'ok':sheet.ink.why);
    /* Das Bild wird NICHT abgewartet: das Textblatt ist sofort da, das Artwork kommt hinein, wenn es
       kommt (PDF-Seite rendern dauert). Fällt es aus, bleibt das Textblatt — auf »läuft« gaten. */
    if(window.OW_ART&&this.deck&&this.deck.packId)
      OW_ART.art({n:p.card.n,packId:this.deck.packId}).then(a=>{
        if(a&&OW_CARD.paintArt(sheet,a.canvas))
          console.log('[loot] Artwork: Seite',a.page,'· Quadrant',a.quad,
            '· Zellformat',a.ar.toFixed(3),a.measured?'· Raster gemessen':'· Raster GERATEN (ganze Seite)');
      });
    if(this.audio)this.audio.sfx('card');
    if(window.OW_CURSOR)OW_CURSOR.set('locked');
    OW_REVEAL.show({host:this.shadowRoot,canvas:sheet.canvas,
      title:'Evidence secured',sub:'»'+p.card.t+'« · '+(p.zone?p.zone.biome:''),
      seed:(p.card.n|0)+11,
      onDone:()=>{if(this.audio)this.audio.sfx('pickup');},
      onClose:()=>{
        this.paused=wasPaused;
        p.opening=false;
        if(window.OW_CURSOR)OW_CURSOR.set('default');
        if(p.zone)p.zone.looted=true;
        if(p.deco){const i=this.decos.indexOf(p.deco);if(i>=0)this.decos.splice(i,1);}
        if(p.back)p.back=null;   // die Zone bleibt als Ort stehen, die Karte ist heraus
        const j=this.places.indexOf(p);if(j>=0)this.places.splice(j,1);
        this.nearPlace=null;
        if(this.promptEl)this.promptEl.style.display='none';
        this.diary.push({t:'loot',text:'The box gave up »'+p.card.t+'«. Paper, not power.'});
        this.autosave();
      }});
  }
  /* Ein Ort, eine Handlung. Mehr braucht der Hub nicht, solange die Systeme dahinter stehen. */
  enterPlace(p){
    if(!p)return;
    if(p.loot){this.openLoot(p);return;}
    if(p.id==='tavern'){this.openAfterglow();return;}
    if(this.audio)this.audio.sfx('confirm');
    if(p.id==='tower'){this.enterTower(p);return;}
    if(p.id==='archive'){ // Umblättern: neue Seite, neue Insel — die Reise bleibt (§3.1)
      const next=(this.att.seed|0)+1;
      this.msg('The archive turns the page — seed '+next+'.');
      this.diary.push({t:'page',text:'The archive turned the page. A new island, the same journey.'});
      this.att.seed=next;
      this.pendingSave=this.captureJourney();
      this.pendingSave.runSeed=next;
      this.buildWorld();
      if(this.audio)this.audio.sfx('card');
      return;
    }
    if(p.id==='graveyard'){
      this.spawn={x:this.hero.x,y:this.hero.y};
      this.msg('The graveyard will have you back. Respawn set here.');
      return;
    }
    if(p.id==='garden'){
      const h=this.hero;
      if(h.hp>=h.maxhp&&h.charges>=h.stats.kayfabe){this.msg('Nothing to recover. Sit anyway.');return;}
      h.hp=h.maxhp;h.charges=h.stats.kayfabe;
      this.msg('Rested. Fluff and Kayfabe are full again.');
      this.say('That helped, oddly.',2.2);
      this.autosave();
      return;
    }
    if(p.id==='arena'){
      this.msg('The ring is still being set up. King Kayfabian will call for you.');
      this.say('Not yet. Go make a story worth telling.',2.6);
    }
  }
  /* ── Der Turm hat ein Inneres (V5-S8, §24) ─────────────────────────────────
     Drei Bauteile, mehr nicht: die Tür ist das Tor der Burggrafik, dahinter ein Tunnel, oben eine
     Kammer mit einem Wächter, und der Rückweg liegt an derselben Tür. Etagen und Boss später.

     Der Innenraum ist KEINE zweite Engine: er tauscht nur die zwei Felder aus, aus denen die Welt
     besteht (`land` begehbar, `blocked` versperrt). Alles andere — A*, Fußpunkt, Mob-KI, Schatten,
     y-Sortierung, Kamera — läuft unverändert weiter. Jeder Auftrag braucht einen Rückweg: was hier
     beiseitegelegt wird, kommt beim Verlassen vollständig zurück. */
  async enterTower(p){
    if(this.interior)return;
    const g=this.towerGuard;
    if(g&&g.hp>0){
      this.msg('The doorman stands where he stands. Bizarro speaks louder than manners.');
      this.say('Let me in.',2.0);
      g.aggro=true;
      return;
    }
    let int;
    // Der Hof spricht weiter mit — der Ruf entscheidet später, wer ohne Kampf hineinkommt (§24.3)
    const r=this.reputation||this.freshRep();
    this.msg('The court: '+(r.kingCourt>=4?'delighted':r.kingCourt>0?'mildly pleased':'unmoved')+'.');
    try{await OW_DUNGEON.ready();int=OW_DUNGEON.build({seed:(this.att.seed*7+3)});}
    catch(e){console.warn('[dungeon]',e.message);this.msg('The door is stuck. (assets missing)');return;}
    this.enterInterior(int,p);
  }
  enterInterior(int,place){
    const W=int.W,H=int.H;
    // Was draußen gilt, wird beiseitegelegt — nicht überschrieben
    this._outside={W:this.W,H:this.H,land:this.land,blocked:this.blocked,zones:this.zones,
      mobs:this.mobs,decos:this.decos,places:this.places,corpses:this.corpses,
      foamTiles:this.foamTiles,bridge:this.bridge,tempBridge:this.tempBridge,
      curZone:this.curZone,heroX:this.hero.x,heroY:this.hero.y,
      camX:this.cam.x,camY:this.cam.y,place};
    const land=new Uint8Array(W*H);
    for(let i=0;i<W*H;i++)land[i]=int.floorType[i]?2:0;
    this.W=W;this.H=H;this.land=land;this.blocked=int.blocked;
    this.zones=[];this.decos=[];this.places=[];this.corpses=[];this.shots=[];
    this.foamTiles=[];this.bridge=new Map();this.tempBridge=new Map();
    this.curZone=null;this.nearPlace=null;this.moveTarget=null;this.attackTarget=null;this.marked=null;
    if(this.promptEl)this.promptEl.style.display='none';
    this.hero.x=(int.spawn.x+0.5)*TILE;this.hero.y=(int.spawn.y+0.7)*TILE;
    this.cam.x=this.hero.x;this.cam.y=this.hero.y;
    this.interior=int;
    this._exitArmed=false;   // erst wenn man das Ausgangsfeld einmal verlassen hat, führt es hinaus
    this.mobs=[];
    this.decos=OW_DUNGEON.propDecos(int);
    this.spawnChamberGuard(int);
    if(this.audio)this.audio.sfx('card');
    this.msg('Inside the King’s tower. Stairs up, one room, one guard.');
    this.diary.push({t:'place',text:'The tower has an inside. Someone is standing in it.'});
    console.log('[dungeon] betreten ·',W+'×'+H,'Felder · Kammer',
      int.room.w+'×'+int.room.h,'· Tunnel',int.tunnel.w+'×'+int.tunnel.h,
      '· Spawn',int.spawn.x+','+int.spawn.y,'· Ausgang',int.exit.x+','+int.exit.y,
      '· Requisiten',this.decos.length,'· Fackeln',(int.torches||[]).length);
  }
  exitInterior(){
    const o=this._outside;
    if(!o)return;
    this.W=o.W;this.H=o.H;this.land=o.land;this.blocked=o.blocked;this.zones=o.zones;
    this.mobs=o.mobs;this.decos=o.decos;this.places=o.places;this.corpses=o.corpses;
    this.foamTiles=o.foamTiles;this.bridge=o.bridge;this.tempBridge=o.tempBridge;
    this.curZone=o.curZone;
    // Man tritt aus der Tür, aus der man hineingegangen ist — nicht dahin, wo man vorher stand
    const p=o.place;
    this.hero.x=p?p.x:o.heroX;this.hero.y=p?p.y+72:o.heroY;
    this.cam.x=this.hero.x;this.cam.y=this.hero.y;
    this.moveTarget=null;this.attackTarget=null;this.marked=null;
    this.interior=null;this._outside=null;
    if(this.audio)this.audio.sfx('card');
    this.msg('Back out the same door. The island did not miss you.');
    this.autosave();   // was draußen passiert ist, wird jetzt wieder gebucht
  }
  /* Betreten IST die Handlung (§22.4/A) — auch beim Hinausgehen. Der Ausgang scharf zu schalten,
     sobald man ihn einmal verlassen hat, verhindert das sofortige Umkehren beim Eintreten. */
  checkExit(){
    const int=this.interior,h=this.hero;
    if(!int)return;
    const tx=Math.floor(h.x/TILE),ty=Math.floor(h.y/TILE);
    const on=(tx===int.exit.x&&ty===int.exit.y);
    if(!on){this._exitArmed=true;return;}
    if(this._exitArmed)this.exitInterior();
  }
  /* Ein Wächter ist ein Mob mit Auftrag — und mit einer Zone, weil das Gehirn ein Revier braucht.
     Die Pseudo-Zone ist genau so groß wie der Raum: das Revier IST die Kammer. */
  makeGuard(un,zone,tx,ty,o){
    o=o||{};
    const x=(tx+0.5)*TILE,y=(ty+0.6)*TILE;
    const hp=o.hp||40;
    return{zone,unit:un,elite:!!o.elite,guard:true,sizeMul:o.sizeMul||1,
      x,y,hx:x,hy:y,hp,maxhp:hp,dmg:o.dmg||8,lv:o.lv||2,xp:o.xp||XP_SRC.mob,
      state:'idle',anim:0,face:-1,dir:'side',atkT:0,atkKey:'idle',combo:0,
      slot:0,cool:0,didHit:false,wt:0,wx:x,wy:y,aggro:false};
  }
  async spawnChamberGuard(int){
    const CAT=window.OW_UNITS;
    const id=this.notMe(['skull','thief'])[0];   // den Spieler gibt es einmal (Georg 7.8.)
    const zone={zseed:(int.seed^0x51ed)>>>0,biome:'dungeon',cleared:false,alive:1,noProgress:true,
      card:{n:0,t:'the King’s tower'},
      x:int.room.x,y:int.room.y,w:int.room.w,h:int.room.h,
      gate:{x:int.tunnel.x+1,y:int.tunnel.y},tint:'rgba(0,0,0,0)'};
    this.interiorZone=zone;
    try{
      const un=await this.OWL.loadUnit(id,CAT.enemies[id],{refBody:this.refBody});
      if(this.interior!==int)return;   // inzwischen wieder draußen — Rückweg
      this.mobs.push(this.makeGuard(un,zone,int.guardAt.x,int.guardAt.y,{hp:48,dmg:9,lv:3}));
      console.log('[dungeon] Kammerwächter',id,'bei',int.guardAt.x+','+int.guardAt.y);
    }catch(e){console.warn('[dungeon] Wächter fällt aus:',e.message);}
  }
  /* Der Türsteher steht DRAUSSEN vor dem Tor: niedriger Level (§24.1), aber er lässt niemanden
     vorbei. Später kommen VIP-Kayfabe und Fluff-Bestechung als zweiter und dritter Weg hinein. */
  async spawnTowerGuard(){
    const tower=(this.places||[]).find(p=>p.id==='tower');
    if(!tower)return;
    const CAT=window.OW_UNITS,id=this.notMe(['thief','skull'])[0];
    const zone={zseed:(this.att.seed^0x7a11)>>>0,biome:'dungeon',cleared:false,alive:1,noProgress:true,
      card:{n:0,t:'the King’s tower'},
      x:tower.tx-2,y:tower.ty-1,w:5,h:3,gate:{x:tower.tx,y:tower.ty},tint:'rgba(0,0,0,0)'};
    try{
      const un=await this.OWL.loadUnit(id,CAT.enemies[id],{refBody:this.refBody});
      // Niedriger Level heißt niedrig (§24.1): 24 HP, 4 Schaden — er soll im Weg stehen, nicht töten
      const g=this.makeGuard(un,zone,tower.tx,tower.ty+1,{hp:24,dmg:4,lv:1});
      g.doorman=true;
      this.mobs.push(g);
      this.towerGuard=g;
      console.log('[dungeon] Türsteher',id,'am Turm bei',tower.tx+','+(tower.ty+1));
    }catch(e){console.warn('[dungeon] Türsteher fällt aus:',e.message);}
  }
  /* Der König steht oben auf dem Turm — als Figur, nicht als Menüpunkt. Bis es einen echten
     König-Sprite gibt, trägt er Purpur (Warrior Purple); der Platzhalter ist als solcher benannt.
     Die Höhe wird an der Grafik GEMESSEN, nicht geraten: Kronenmitte = Fußpunkt minus Krongesims. */
  async loadKing(){
    const tower=(this.places||[]).find(p=>p.id==='tower');
    const img=this.img.b_castle;
    if(!tower||!img)return;
    const CAT=window.OW_UNITS;
    try{
      const un=await this.OWL.loadUnit('king_purple',CAT.playable.warrior_purple,{refBody:this.refBody});
      const box=OWL.probeBox(img,0,0,img.width,img.height);
      const foot=box?box.bottom:img.height;      // Fußpunkt der Burg im Blatt
      const crown=Math.round(img.height*0.58);   // Oberkante des Zinnenkranzes, am Blatt abgelesen
      const dy=foot-crown;
      this.king={unit:un,x:tower.x,y:tower.y+8-dy,sortY:tower.y+9,
        state:'idle',anim:0,face:1,dir:'down',atkT:0,atkKey:'idle',combo:0,
        hp:1,maxhp:1,flash:0,sizeMul:1,frozen:0,elite:false,z:0,press:0};
      console.log('[dungeon] König auf dem Turm ·',img.width+'×'+img.height,
        '· Fußpunkt',foot,'· Krone',crown,'· Höhe über dem Boden',dy+'px');
    }catch(e){console.warn('[dungeon] König fällt aus:',e.message);}
  }
  /* Wege: die Stadt ist ein Netz, keine Streusiedlung (V5-S9, Georg 7.8.).
     Mit 9 Feldern Mindestabstand stehen die Orte weit genug auseinander, um einen Weg zu brauchen —
     ohne ihn liegen sechs Gebäude beziehungslos im Gras. Gelegt wird mit **demselben A∗, das den
     Helden führt**: was der Weg zeigt, ist genau das, was man auch gehen kann. Ein zweiter
     Wegfinder hätte irgendwann eine andere Meinung als die Füße.
     Gezeichnet wird der Weg als Sandkachel über dem Gras — das Autotiling dafür läuft längst. */
  buildPaths(mid){
    this.paths=new Set();
    const W=this.W,H=this.H;
    const add=(x,y)=>{if(x>0&&y>0&&x<W&&y<H&&this.land[y*W+x]>0)this.paths.add(y*W+x);};
    // Der Marktplatz ist der Knoten; von dort geht ein Weg zu jedem Ort (Speichenrad, kein Netz —
    // sechs Orte über Kreuz wären 15 Wege und eine Asphaltfläche)
    /* Der Knoten liegt auf dem Marktplatz, wenn es einen gibt (W1). Vorher wurde er unabhängig in
       der Inselmitte gesucht — dann trafen sich die Wege NEBEN dem Platz, und der Platz war Deko. */
    let hub=null;
    const markt=(this.places||[]).find(p=>p.id==='market');
    if(markt&&this.walk(markt.tx,markt.ty+1))hub={x:markt.tx,y:markt.ty+1};
    for(let r=0;r<=8&&!hub;r++)for(let k=0;k<=r*8;k++){
      const a=k/Math.max(1,r*8)*Math.PI*2;
      const x=Math.round(mid.x+Math.cos(a)*r),y=Math.round(mid.y+Math.sin(a)*r);
      if(this.walk(x,y)){hub={x,y};break;}
    }
    if(!hub)return;
    this.hubAt=hub;
    let laid=0,failed=0;
    for(const p of this.places){
      const path=this.findPath(hub.x,hub.y,p.tx,p.ty+1);
      if(!path){failed++;continue;}
      /* Jede Diagonale wird zum L aufgefüllt (Georg 7.8.): A* läuft achtfach, und zwei diagonal
         versetzte Felder berühren sich nur an der Ecke. Das Autotiling sieht dort keinen Nachbarn
         in N/E/S/W und malt zwei abgeschnittene Stücke statt eines Weges. Ein Weg, den man gehen
         kann, muss auch orthogonal zusammenhängen. */
      let prev=null;
      for(const n of path){
        add(n.x,n.y);
        if(prev&&prev.x!==n.x&&prev.y!==n.y)add(n.x,prev.y);
        prev=n;
      }
      laid++;
    }
    // Der Platz selbst: eine kleine Fläche, damit die Speichen einen Mittelpunkt haben
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)add(hub.x+dx,hub.y+dy);
    console.log('[overworld] Wege:',laid,'von',this.places.length,'Orten angebunden ·',
      this.paths.size,'Felder · Knoten',hub.x+','+hub.y,failed?('· ohne Weg: '+failed):'');
  }
  addZone(zx,zy,IW,IH,s){
    const W=this.W,land=this.land,zi=this.zones.length;
    /* Die Torseite wird GEWÄHLT, nicht gewürfelt (V5-S10d). Vorher fiel sie per `rand2` — und wenn
       sie zum Meer zeigte, hing die Zone hinter ihrem Steg und wurde von der Notbremse verworfen:
       gemessen fehlten in 10 von 24 Welten eine, in dreien sogar zwei Zonen (Ø 5,63 von 6). Da die
       Zonen die Deck-Karten tragen, war das Inhaltsverlust, keine Kosmetik.
       Geprüft wird VOR dem Fluten, solange das Ufer noch unberührt ist: welche Seite hat in ihrer
       Stegrichtung echtes Land? Die gewürfelte Reihenfolge bleibt — es entscheidet nur, wer von den
       vier zuerst passt, damit dieselbe Insel dieselben Tore hat. */
    const dirOf=k=>k===0?[0,-1]:k===1?[1,0]:k===2?[0,1]:[-1,0];
    const stegStart=k=>{
      if(k===0)return[zx+(IW>>1),zy-2];
      if(k===2)return[zx+(IW>>1),zy+IH+1];
      if(k===1)return[zx+IW+1,zy+(IH>>1)];
      return[zx-2,zy+(IH>>1)];
    };
    const reachesLand=k=>{
      const[dx,dy]=dirOf(k),[sx0,sy0]=stegStart(k);
      for(let t=0;t<10;t++){
        const x=sx0+dx*t,y=sy0+dy*t;
        if(x<2||y<2||x>=W-2||y>=this.H-2)return false;
        if(land[y*W+x]>0){
          // Echtes Ufer, keine Sandbank: ein Nachbar QUER zur Richtung muss auch Land sein
          const px=x+(dx?0:1),py=y+(dx?1:0),qx=x-(dx?0:1),qy=y-(dx?1:0);
          if(land[py*W+px]>0||land[qy*W+qx]>0)return true;
        }
      }
      return false;
    };
    const order=[0,1,2,3];
    const first=Math.floor(rand2(zi,99,s)*4);
    order.sort((a,b)=>((a-first+4)%4)-((b-first+4)%4));
    let side=order.find(reachesLand);
    if(side===undefined)side=first;   // Rückweg: keine Seite trifft Ufer — die Notbremse fängt es
    // Graben fluten, Inneres begrünen (erst JETZT, die Seitenwahl brauchte das rohe Ufer)
    /* **Der Graben verlässt `land`** (v10-S2a). Vorher stand hier `land[i] = inner ? 2 : 0` — der
       Ring wurde also **Ozean**, und damit übernahmen ihn Sandsaum, Schaum und Autotiling. Bei
       einem Feld Breite (92 von 234 Feldern) fressen die von beiden Seiten die Linie auf; übrig
       bleiben die Ecken als blaue Lappen. Jetzt: das Innere wird Gras, der **Ring bleibt, was er
       war** (Land für den Maler) und wird nur **gesperrt**. Gezeichnet wird er von `OW_GUTTER` als
       Strich über dem Boden. Ein Graben ist eine Rolle, kein Bodentyp. */
    const gut=(this.gutter=this.gutter||new Set());
    for(let y=zy-1;y<=zy+IH;y++)for(let x=zx-1;x<=zx+IW;x++){
      const inner=x>=zx&&x<zx+IW&&y>=zy&&y<zy+IH;
      const i=y*W+x;
      if(inner){land[i]=2;this.blocked[i]=0;}
      else{gut.add(i);this.blocked[i]=1;}
    }
    let bx,by,horiz,ax,ay;
    if(side===0){bx=zx+(IW>>1);by=zy-1;horiz=false;ax=bx;ay=by-1;}
    else if(side===2){bx=zx+(IW>>1);by=zy+IH;horiz=false;ax=bx;ay=by+1;}
    else if(side===1){bx=zx+IW;by=zy+(IH>>1);horiz=true;ax=bx+1;ay=by;}
    else{bx=zx-1;by=zy+(IH>>1);horiz=true;ax=bx-1;ay=by;}
    this.bridge.set(by*W+bx,horiz?1:0);
    gut.delete(by*W+bx);   // das Tor ist der EINE Zugang — der Rest des Grabens bleibt unantastbar
    this.blocked[by*W+bx]=0;
    /* **Zwei Wahrheiten, gefunden am 9.8. (v10-S3a).** Hier stand: »der Zeichner braucht das Tor« —
       und geschrieben wurde `this.zones[this.zones.length-1].gate`. Die neue Zone ist an dieser
       Stelle aber noch **nicht gepusht**: die Zeile traf die VORHERIGE Zone. Gemessen bei seed 7:
       Zone 0 liegt auf 206..224/95..105, ihr `gate` stand auf **200,124** — dem Brückenfeld von
       Zone 1. Folge: der Wächter spawnte am falschen Ort und der Graben bekam sein Loch woanders.
       Aufgefallen ist es erst, als die Tutorial-Zone ihren Wächter ans Tor stellen sollte.
       Jetzt trägt die Zone **beide** Felder, getrennt benannt: `gate` = das innere Feld am Tor
       (dort spawnt und staffelt sich), `bridgeAt` = das Brückenfeld im Graben (dort schneidet der
       Zeichner sein Loch). Eine Zahl, ein Ort — und diesmal auch: ein Begriff, eine Bedeutung. */
    // Der Steg muss ans Ufer reichen, nicht ins Meer: bei seed 13 endete die Torbrücke im Wasser,
    // und die Zone hing an einem Ein-Feld-Steg — unerreichbar, obwohl sie ein Tor hatte.
    const sdx=(side===1?1:side===3?-1:0),sdy=(side===0?-1:side===2?1:0);
    const cway=(this.causeway=this.causeway||new Set());
    cway.add(by*W+bx);
    for(let k=0;k<=8;k++){
      const nx=ax+sdx*k,ny=ay+sdy*k;
      if(nx<1||ny<1||nx>=W-1||ny>=this.H-1)break;
      const i=ny*W+nx;
      // Kein Abbruch am ersten Landfeld: bei seed 13 war der Vorplatz selbst eine Sandbank im
      // Meer, der Steg endete nach einem Feld und die Zone hing an 81 Feldern Nichts.
      // Abgebrochen wird erst, wenn ein Nachbar QUER zur Richtung auch Land ist — das ist Ufer.
      const px=nx+(sdx?0:1),py=ny+(sdx?1:0);
      const qx=nx-(sdx?0:1),qy=ny-(sdx?1:0);
      const shore=(land[i]>0)&&((land[py*W+px]>0)||(land[qy*W+qx]>0));
      cway.add(i);
      if(shore)break;
      land[i]=1;
    }
    let card;    if(this.cards&&this.cards.length){
      // Gesät gemischt, ohne Zurücklegen — Beweisstücke wiederholen sich nicht
      if(!this.cardOrder||this.cardOrderSeed!==s){
        this.cardOrderSeed=s;
        this.cardOrder=this.cards.map((c,i)=>i)
          .sort((a,b)=>rand2(a,5,s*3+1)-rand2(b,5,s*3+1));
      }
      card=this.cards[this.cardOrder[zi%this.cardOrder.length]];
    }else card={n:zi+1,t:'Karte '+(zi+1)};
    // zoneSeed = hash(Insel-Seed · cardId) — Biome, Bestiarium und später die Zone selbst hängen daran
    const zseed=(Math.imul(s,2654435761)^Math.imul((card.n||zi+1),40503))>>>0;
    /* Das Biom hängt am Zonenindex, nicht am Würfel: sechs Zonen sind sechs Welten (V9-B1).
       **v10-S3a — Kanon-Ausnahme, notiert:** die Startzone war `camp` (»der erste Ort soll lesbar
       sein«). Sie ist jetzt `dungeon`, weil die Tutorial-Runde am Friedhof spielt und das Skelett
       das einzige Blatt mit `guard`-Clip in dieser Rolle ist. Lesbarkeit kommt hier aus dem Ort
       (Friedhof, toter Baum, Knochen), nicht aus dem Biom. */
    const tutorial=(zi===0);
    const biome=tutorial?'dungeon':BIOMES[zi%BIOMES.length];
    // Der innere Nachbar der Brücke ist das Tor — hier steht der Wächter, hier staffelt sich der Rest
    let gx,gy;
    if(side===0){gx=bx;gy=zy;}
    else if(side===2){gx=bx;gy=zy+IH-1;}
    else if(side===1){gx=zx+IW-1;gy=by;}
    else{gx=zx;gy=by;}
    this.zones.push({x:zx,y:zy,w:IW,h:IH,card,zseed,biome,tutorial,roster:[],eliteId:null,
      gate:{x:gx,y:gy},bridgeAt:{x:bx,y:by},
      tint:ZONE_TINTS[zi%ZONE_TINTS.length],
      color:MOB_COLORS[zi%MOB_COLORS.length],cleared:false,alive:0});
  }
  walk(x,y){
    if(x<0||y<0||x>=this.W||y>=this.H)return false;
    const i=y*this.W+x;
    if(this.bridge.has(i))return true;
    if(this.tempBridge&&this.tempBridge.has(i))return true;
    /* **Der Graben sperrt hier, nicht in `blocked`** (v10-S2a). Erster Versuch setzte das Feld in
       `addZone` auf `blocked` — und `populate()` ruft danach `blocked.fill(0)`. Gemessen: 234
       Grabenfelder, **0 davon gesperrt**, man lief hindurch. Dieselbe Klasse wie »eine Zahl, ein
       Ort«: wer eine Sperre in ein Feld schreibt, das jemand anders leert, hat keine Sperre.
       Jetzt fragt der Gang die Menge selbst \u2014 sie ist die Wahrheit, und das Tor steht als Br\u00fccke
       schon oben drin. */
    if(this.gutter&&this.gutter.has(i))return false;
    return this.land[i]>0&&!this.blocked[i];
  }
  passable(px,py){return this.walk(Math.floor(px/TILE),Math.floor(py/TILE));}
  // A* auf dem Tile-Grid, 8 Richtungen, kein Eckenbizarroen
  findPath(sx,sy,tx,ty){
    const W=this.W,key=(x,y)=>y*W+x;
    if(!this.walk(tx,ty)){
      let found=null;
      outer:for(let r=1;r<=6;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){
        if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;
        if(this.walk(tx+dx,ty+dy)){found=[tx+dx,ty+dy];break outer;}
      }
      if(!found)return null;tx=found[0];ty=found[1];
    }
    const open=[[sx,sy]],came=new Map(),g=new Map([[key(sx,sy),0]]),f=new Map([[key(sx,sy),0]]);
    const inOpen=new Set([key(sx,sy)]);
    let iter=0;
    while(open.length){
      if(++iter>60000)return null;
      let bi=0,bf=1e18;
      for(let i=0;i<open.length;i++){const v=f.get(key(open[i][0],open[i][1]))??1e18;if(v<bf){bf=v;bi=i;}}
      const[cx,cy]=open.splice(bi,1)[0];inOpen.delete(key(cx,cy));
      if(cx===tx&&cy===ty){
        const path=[];let node=[cx,cy];
        while(node){path.push({x:node[0],y:node[1]});node=came.get(key(node[0],node[1]));}
        return path.reverse();
      }
      for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
        if(!dx&&!dy)continue;
        const nx=cx+dx,ny=cy+dy;
        if(!this.walk(nx,ny))continue;
        if(dx&&dy&&(!this.walk(cx+dx,cy)||!this.walk(cx,cy+dy)))continue;
        const ng=g.get(key(cx,cy))+Math.hypot(dx,dy);
        if(ng<(g.get(key(nx,ny))??1e18)){
          g.set(key(nx,ny),ng);f.set(key(nx,ny),ng+Math.hypot(tx-nx,ty-ny));
          came.set(key(nx,ny),[cx,cy]);
          if(!inOpen.has(key(nx,ny))){open.push([nx,ny]);inOpen.add(key(nx,ny));}
        }
      }
    }
    return null;
  }
  setMoveTarget(wx,wy){
    const h=this.hero;
    const p=this.findPath(Math.floor(h.x/TILE),Math.floor(h.y/TILE),Math.floor(wx/TILE),Math.floor(wy/TILE));
    this.attackTarget=null;
    if(!p){this.msg('No way there.');this.moveTarget=null;this.path=null;return;}
    this.path=p;this.pathI=1;this.moveTarget={x:wx,y:wy,t:this.time};
  }
  async reloadHero(){
    try{await this.loadHeroUnit();}catch(e){console.warn(e.message);}
    try{await this.purgeHeroTwins();}catch(e){console.warn(e.message);}
  }
  /* Gestaltwandlung (V6-S13). Der Katalog sagt, wer in Frage kommt — hier steht keine Liste.
     Über den Bedienweg: dasselbe Attribut wie das Wahlblatt, also derselbe Ladeweg, dieselbe
     Doppelgänger-Regel. */
  async shapeShift(){
    const CAT=window.OW_UNITS;
    if(!CAT||!CAT.shiftPool)return;
    const pool=CAT.shiftPool().filter(id=>id!==this.att.hero);
    if(!pool.length)return;
    const next=pool[Math.floor(Math.random()*pool.length)];
    if(this.audio)this.audio.sfx('card',{gain:0.6});
    if(window.OW_MOTION)window.OW_MOTION.poke(this.hero,'stumble',1.2,this.hero.face);
    this.setAttribute('hero',next);
    const r=CAT.roster().find(x=>x.id===next);
    this.msg('You are now a '+((r&&r.label)||next)+'.');
  }
  /* Den Spieler gibt es einmal (Georg 7.8.). Der Heldenwechsel baut die Welt NICHT neu — der
     Fortschritt der Zonen hängt dran. Also werden die lebenden Zwillinge getauscht (die Zahl der
     Wächter bleibt, nur ihre Art ändert sich) und der Typ aus den Rostern gestrichen, damit ihn
     kein Respawn zurückholt. */
  async purgeHeroTwins(){
    const me=String(this.att.hero||''),CAT=window.OW_UNITS;
    /* Erst die Roster zurückstellen, DANN prüfen, ob es überhaupt etwas zu tauschen gibt. Vorher
       stand die Rückkehr davor — und griff für jeden Helden, der kein Gegnertyp ist (Warrior,
       Archer, Pawn, FrizzleBob, Rogue, Knight, Mage). Damit war ausgerechnet der Rückweg
       unerreichbar: wer einen Gegner ausprobierte und zum Warrior zurückging, verlor den Typ
       für die Sitzung. Gemessen an Zone 3: roster0 lizard/snake/bear, roster blieb lizard/snake. */
    for(const z of this.zones||[]){
      /* Gegen den Roster von VOR dem ersten Wechsel filtern, nicht gegen den zuletzt gefilterten —
         sonst verarmt die Insel mit jedem Heldenwechsel um einen Typ. */
      if(!z.roster0)z.roster0=(z.roster||[]).slice();
      if(z.elite0===undefined)z.elite0=z.eliteId;
      z.roster=this.notMe(z.roster0);
      z.eliteId=(z.elite0===me)?((z.roster&&z.roster[0])||null):z.elite0;
    }
    if(!this.mobs||!CAT||!CAT.enemies[me])return 0;
    let n=0;
    for(const m of this.mobs){
      if(!m.unit||m.unit.id!==me)continue;
      const z=m.zone;
      const base=(z&&z.roster&&z.roster.length)?z.roster:((BESTIARY[(z&&z.biome)||'camp']||BESTIARY.camp).melee);
      const pool=this.notMe(base);
      const id=pool[n%pool.length];
      if(!CAT.enemies[id]||id===me)continue;
      try{m.unit=await this.OWL.loadUnit(id,CAT.enemies[id],{refBody:this.refBody});n++;}
      catch(e){console.warn('[overworld] Tausch fehlgeschlagen:',id,e.message);}
    }
    if(n)console.log('[overworld] Doppelgänger getauscht:',n,'· Held',me);
    return n;
  }
  tryAttack(u){
    if(!u||!u.unit||u.state==='attack'||(u.busy>0))return;
    /* v11-R2: im Nachlauf wird nicht geschlagen — der Druck wird aber GEMERKT statt verworfen.
       Ohne dieses Gedächtnis verliert man jeden Schlag, den man einen Wimpernschlag zu früh drückt,
       und das fühlt sich wie eine hakelige Tastatur an. Gemerkt wird genau einer und nur kurz
       (`buffer`), sonst füllt eine gehaltene Taste eine Warteschlange und der Held schlägt weiter,
       wenn längst niemand mehr drückt. */
    if(u.rec>0){if(u===this.hero)this._atkBuf=this.time;return;}
    /* Wer zuschlägt, verliert die Fahrt — **außer er läuft gerade selbst** (V9-B5a, Georgs Befund
       »die steuerung versagt bzw ist so träge, dass man sich im kampf gar nicht bewegen kann«).
       Der Grund war diese Zeile im Verbund mit dem Auto-Angriff: jeder Schlag setzte den Antritt
       (0,18 s) auf null, und im Kampf schlägt man dauernd — man kam nie in Fahrt. Die Regel aus S12c
       bleibt für den **Klick**-Angriff richtig; wer die Taste hält, hat sich entschieden. */
    const laeuft=u===this.hero&&(this.keys['w']||this.keys['a']||this.keys['s']||this.keys['d']||
      this.keys['arrowup']||this.keys['arrowleft']||this.keys['arrowdown']||this.keys['arrowright']);
    if(u===this.hero&&window.OW_FEEL&&!laeuft)OW_FEEL.breakFlow(this);
    u.state='attack';u.atkT=0;u.didHit=false;u.combo=1-(u.combo||0);
    u.atkKey=u.unit.pick('attack',u.dir,u.combo);
    /* v11-U1 · **der Rempler bekommt Schub.** Wer kein Angriffsblatt hat (Schwein, Schaf), zeigt
       jetzt seine Laufbilder — aber Laufbilder auf der Stelle sind ein Trippeln, kein Anrennen.
       Der Stoß läuft über dieselbe Rechnung wie jeder Rückstoss (`game-feel`), nur nach VORN:
       150 px/s, Abbau 9,5 → ~16 px Weg. Das ist etwa der halbe Körper eines Schweins, also
       sichtbar, und es bleibt innerhalb des Trefferbands aus `reach.js`. */
    if(u.unit.bump&&window.OW_FEEL)OW_FEEL.knock(u,u.face||1,0,OW_FEEL.T.knockHero);
  }
  moveEntity(u,dx,dy,speed,dt){
    const l=Math.hypot(dx,dy);if(!l)return false;
    const sp=speed*dt,R=12;
    const nx=u.x+dx/l*sp,ny=u.y+dy/l*sp;
    const stuck=!this.passable(u.x,u.y);
    let moved=false;
    if(stuck){u.x=nx;u.y=ny;moved=true;}
    else{
      const freiX=this.passable(nx+Math.sign(dx)*R,u.y-8)&&this.passable(nx+Math.sign(dx)*R,u.y+8);
      const freiY=this.passable(u.x-8,ny+Math.sign(dy)*R)&&this.passable(u.x+8,ny+Math.sign(dy)*R);
      if(freiX){u.x=nx;moved=moved||!!dx;}
      if(freiY){u.y=ny;moved=moved||!!dy;}
      /* **Wand als Gummi** (V9-B5a, Georg: »man kann durch gebäude durchlaufen, statt bouncy leicht
         abzuprallen«). Eine gesperrte Kante hielt bisher nur an; jetzt gibt sie einen kleinen Stoß
         zurück. Der Stoß geht in die **Geschwindigkeit**, nicht in die Position — dieselbe Regel wie
         beim Treffer-Rückstoss (`game-feel.js`), damit es EINE Kinetik gibt und nicht zwei. */
      if(!freiX||!freiY){
        const kx=freiX?0:-Math.sign(dx),ky=freiY?0:-Math.sign(dy);
        if(window.OW_FEEL&&OW_FEEL.knock&&(kx||ky))OW_FEEL.knock(u,kx,ky,46);
        else{u.x-=Math.sign(dx)*1.5;u.y-=Math.sign(dy)*1.5;}
      }
    }
    /* **Die Blickrichtung aus der RICHTUNG, nicht aus der Rohzahl** (V9-B5a). Hier lagen drei von
       Georgs vier Kampfbefunden — »unit dreht sich nicht korrekt in laufrichtung«, »man schlägt immer
       in die gleiche richtung«, »man kann sich nicht umdrehen« — als **ein** Fehler: die Schwelle
       prüfte `|dx| > 6`, aber die Tastatur liefert `dx = ±1`. Nur die Wegfindung (Pixelabstände, oft
       über 60) kam über die Hürde; wer selbst lief, behielt sein Gesicht.
       Jetzt entscheidet der normierte Anteil — eine Einheit, in der Tastatur und Pfad dasselbe sagen. */
    const ux=dx/l,uy=dy/l;
    if(Math.abs(ux)>0.30&&Math.abs(ux)>Math.abs(uy)*0.3)u.face=Math.sign(ux);
    u.dir=Math.abs(ux)>=Math.abs(uy)?'side':(uy>0?'down':'up');
    return moved;
  }
  hitFlash(u){u.flash=0.12;}
  onStumble(u){ if(u===this.hero&&this.audio)this.audio.sfx('hit',{gain:0.18,throttle:900}); }
  damage(target,amount,fromHero){
    target.hp-=amount;target.lastHit=this.time;this.hitFlash(target);
    if(window.OW_MOTION){
      const src=fromHero?this.hero:null;
      const dirx=src?(Math.sign(target.x-src.x)||1):(-(target.face||1));
      window.OW_MOTION.poke(target,'hit',Math.min(1.8,0.7+amount/22),dirx);
    }
    // Poise: mehr Fluff = kürzere Unterbrechung, wenn es den Helden erwischt
    const poise=fromHero?0.045:Math.max(0.03,0.09-0.008*this.hero.stats.fluff);
    this.freeze=Math.max(this.freeze,poise);
    /* Treffer-Stopp (V5-S12): der kurze Halt, an dem das Auge den Schlag liest. Gestaffelt, damit
       der zehnte Treffer sich anders anfühlt als der erste — und der tödliche noch anders. */
    if(window.OW_FEEL){
      const kill=target.hp<=0;
      OW_FEEL.hitStop(this,kill?'kill':((this.streak||0)>=3?'streak':'hit'));
      if(!fromHero){
        OW_FEEL.knock(this.hero,this.hero.x-target.x,this.hero.y-target.y,OW_FEEL.T.knockHero);
        if(target===this.hero)OW_FEEL.breakFlow(this);   // getroffen heißt: Fahrt weg
      }
    }
    if(this.audio)this.audio.sfx('hit',{throttle:70,vary:0.16,gain:fromHero?1:0.85});
    if(fromHero){
      const bh=target.unit?target.unit.bodyH*(target.sizeMul||1):64;
      this.floaters.push({x:target.x,y:target.y-bh-22,txt:'-'+amount,t:0,c:'#ffd977'});
      // Peer Review: jeder dritte Treffer auf das markierte Ziel stunnt
      if(this.marked&&this.marked.mob===target&&target.hp>0){
        if(++this.marked.hits%this.marked.need===0){
          target.frozen=1.6;
          this.floaters.push({x:target.x,y:target.y-bh-46,txt:'REVIEWED',t:0,c:'#6ea0ff'});
        }
      }
      // Social Aggro: nur die Nachbarn, nicht die ganze Zone — sonst ist Einzeln-Anspielen sinnlos
      for(const m of this.mobs)
        if(m.zone===target.zone&&m.hp>0&&Math.hypot(m.x-target.x,m.y-target.y)<230)m.aggro=true;
      if(target.hp<=0)this.killMob(target);
    }else{ // Zahlen am Helden vermeiden: roter Randblitz statt Ziffern
      this.hurt=0.3;
      // Der Einschlag geht durch die Fläche: das Fluff-Blatt wackelt mit (V4-S4)
      if(this.hudShake)this.hudShake('panel',Math.min(4,1+Math.round(amount/6)));
      if(this.audio&&this.hero.hp>0&&this.hero.hp/this.hero.maxhp<0.28)
        this.audio.voice('lowFluff',1,14000);
    }
  }
  killMob(m){
    m.state='dead';
    if(m.critter&&m.trainee){
      /* v10-S3a · Der Übungsgegner zählt nicht zur Zone (die Karte hängt am Wächter) und kostet
         keinen Ruf: wer zurückschlägt, ist kein Vieh. Er ist da, damit man das Schlagen einmal
         ohne Folgen übt. */
      this.msg('The pig has had enough of the lesson.');
      if(this.marked&&this.marked.mob===m)this.marked=null;
      if(this.attackTarget===m){this.attackTarget=null;this.path=null;}
      return;
    }
    if(m.critter){ // Keine Erfahrung, kein Zonenfortschritt — aber die Insel merkt es sich
      this.hunt=(this.hunt||0)+1;
      const F=window.OW_FACTIONS;
      if(F){
        // In der Stadt gehört das Tier den Städtern; Zeugen verdoppeln den Abzug (§13)
        const town=F.inTown(this,m.x,m.y);
        const f=town?'townsfolk':F.factionOf(this,m);
        const seen=F.witnesses(this,m)>0;
        const d=F.blame(this,f,this.hunt>=3?-3:-1,seen);
        // Die Begründung ist die Meldung — keine Floskel darüber
        this.msg(F.hostile(this,f)?F.label(f)+' had enough of you.'
          :(seen?'Someone saw that. '+F.label(f)+' '+d+'.'
                :'A sheep less. '+F.label(f)+' '+d+'.'));
      }else if(m.zone)this.rep(m.zone.biome,-1);
      if(this.hunt===1&&!F)this.msg('You killed a sheep. Nobody asked you to.');
      if(this.hunt===3){
        this.msg('Sheep hunter. The island is taking notes.');
        this.diary.push({t:'hunt',text:'Three sheep. A game mode nobody wrote down.'});
      }
      if(this.marked&&this.marked.mob===m)this.marked=null;
      if(this.attackTarget===m){this.attackTarget=null;this.path=null;}
      return;
    }
    const z=m.zone;z.alive--;
    /* **Der Wächter kommt wieder** (v10-S2d, Georg: »nach 1 min respawnt die Guard-Unit an einem
       zufälligen Punkt auf der Karte — erhebt sich aus der Asche«). Gemerkt wird nur der Zeitpunkt;
       die Uhr läuft in `step`, damit ein Wechsel in den Turm oder ein Neuladen sie nicht abschneidet.
       Die Karte bleibt aufgedeckt — wer sie geholt hat, hat sie: der zweite Kampf gibt XP, keinen Loot. */
    if(m.guard&&!m.critter)m.deadAt=this.time;
    // Kill-Streak: die Kette macht den Pop größer (§17.2). Sie verfällt nach 4 s ohne Kill.
    if(this.time-(this._streakAt||-9)>4)this.streak=0;
    this._streakAt=this.time;this.streak=(this.streak||0)+1;
    if(window.OW_MOTION)window.OW_MOTION.poke(this.hero,'streak',Math.min(2.0,0.7+this.streak*0.28),this.hero.face);
    if(this.deadSheet)this.corpses.push({x:m.x,y:m.y+26,t:0,v:this.corpses.length});
    this.gainXp(m.xp,m.x,m.y);
    // Der Sprecher zählt mit: Kill-Streak, solange die Schläge dicht beieinander liegen
    this.streak=(this.time-(this._lastKill||-9)<4.5)?(this.streak||0)+1:1;
    this._lastKill=this.time;
    if(this.audio){
      if(m.elite)this.audio.voice('eliteDown',1,3000);
      else if(this.streak>=4)this.audio.voice('multiKill',0.7,4000)||this.audio.number(this.streak);
      else if(this.streak===3)this.audio.number(3);
      else if(this.streak===2)this.audio.voice('combo',0.6,3000);
      const weak=this.mobs.find(o=>o.hp>0&&o.hp/o.maxhp<0.2&&Math.hypot(o.x-m.x,o.y-m.y)<300);
      if(weak)this.audio.voice('finishHim',0.35,9000);
    }
    this.tryDrop(m.elite?'elite':'mob',m.x,m.y);
    if(window.OW_FEEL)OW_FEEL.onKill(this);   // Bloodlust: der Kill gibt kurz Tempo (V5-S12)
    if(this.marked&&this.marked.mob===m)this.marked=null;
    if(this.attackTarget===m){this.attackTarget=null;this.path=null;}
    // Ein Wächter ist kein Beweisstück: seine Pseudo-Zone trägt keinen Fortschritt (V5-S8).
    if(z.alive<=0&&!z.cleared&&!z.noProgress){
      z.cleared=true;
      if(window.OW_STORY){
        OW_STORY.beat(this,z,'win');
        /* Das Aufdecken kommt SPÄTER als der Sieg — die Rückseite zieht sich 1,4 s zurück, und ein
           Satz über die Karte, bevor man sie sieht, verrät die Pointe. */
        setTimeout(()=>{if(z.cleared)OW_STORY.beat(this,z,'reveal');},1600);
      }
      /* v10-S2b · **Der Sieg deckt auf.** Kein Overlay, keine Lightbox — die Rückseite zieht sich in
         der Welt zurück, und was darunter liegt, ist die Karte. Der Zeitwert läuft in `step`; ab
         hier ist die Zone auch von weitem als geräumt erkennbar, weil sie ein Bild trägt statt
         einer Farbe. */
      z.revealT=0;
      if(!z.art)this.loadZoneCard(z);
      this.msg(`Evidence secured: »${z.card.t}«`);
      this.spawnLoot(z);   // V5-S5: die Karte liegt jetzt als Kiste da, nicht nur im Log
      if(this.hudShake)this.hudShake('panel',4);
      if(this.audio)this.audio.sfx('win');      this.diary.push({t:'zone',text:`»${z.card.t}« was a place first, then a piece of evidence.`});
      this.gainXp(XP_SRC.zone,this.hero.x,this.hero.y);
      this.tryDrop('zone',this.hero.x,this.hero.y);
      // Ruf: der Hof freut sich, die Fraktion nicht. XP kann man nicht verlieren, Ruf schon.
      const F=window.OW_FACTIONS;
      if(F){F.blame(this,'kingCourt',2,false);F.blame(this,z.biome,-3,F.witnesses(this,{x:this.hero.x,y:this.hero.y,zone:z})>0);}
      else{this.rep('kingCourt',2);this.rep(z.biome,-3);}
      this.autosave();
      if(this.audio)this.audio.voice('zoneClear',1,0);
      /* v10-S4 · **Der Sieg übergibt die Karte.** Vorher wanderte sie still in `collected`, und das
         HUD ließ sie eine Sekunde später in den Almanach fliegen — den Moment hat niemand gesehen.
         Jetzt: Aufdecken in der Welt (1,4 s) → Übergabe-Blatt mit Kontext → OK → **dann** wandert sie
         in `collected`, und der vorhandene Einflug des HUD (`hud-v7.js flyIn`) zeigt, wohin.
         Das Blatt ist der Lead-Stand; sobald WS0 seinen Screen liefert, hängt er sich an
         `game.hudCardAward` und dieses hier tritt zurück (Masterplan §4.2, Vertrag §6). */
      this.awardCard(z.card,'zone',z);
      if(this.zones.every(zz=>zz.cleared)){
        this.msg('Every piece of evidence on this island is yours. Stay fluffy.');
        if(this.audio)setTimeout(()=>this.audio.voice('islandClear',1,0),1400);
      }
    }
  }
  /* v10-S9 · **Anreden statt nur Anschlagen** (Georg 9.8.). Wer eine Einheit anklickt, bekommt ihre
     Blase mit Knöpfen: attack · ask · taunt · philosophize · trade · leave. Damit ist jeder Mob ein
     Point of Interest, ohne dass ein Dialogsystem entsteht — die Antwort ist eine Blase, die Aktion
     eine Zeile im Verhalten. Was gesagt wird, kommt aus `OW_CHATTER` (Quelle → Fraktionston → Laune). */
  einheitBei(wx,wy){
    let best=null,bd=1e9;
    for(const m of this.mobs){
      if(m.hp<=0)continue;
      const bh=(m.unit?m.unit.bodyH*(m.sizeMul||1):60);
      if(wx<m.x-38||wx>m.x+38||wy<m.y-bh-8||wy>m.y+10)continue;
      const d=Math.hypot(wx-m.x,wy-m.y);
      if(d<bd){bd=d;best=m;}
    }
    return best;
  }
  anreden(u){
    if(!window.OW_BUBBLE||!u||u.hp<=0)return false;
    const C=window.OW_CHATTER;
    const sag=(kind,fall)=>{
      let s=C&&C.line?C.line(this,u,kind):null;
      if(s&&typeof s==='object')s=s.text;
      return s||fall;
    };
    const antwort=(text,typ)=>OW_BUBBLE.zeigen(this,u,{text,type:typ||'speech',actions:menue()});
    const menue=()=>[
      {label:'attack',go:()=>{this.attackTarget=u;u.aggro=true;this.msg('You start it.');}},
      {label:'ask',close:false,go:()=>antwort(sag('ask','It has nothing to add.'))},
      {label:'taunt',close:false,go:()=>{u.aggro=true;
        antwort(sag('taunt','…'),'speech');this.msg(u.unit.name+' heard that.');}},
      {label:'philo',close:false,go:()=>antwort(sag('philo','Ask again when the page turns.'),'thought')},
      {label:'trade',close:false,go:()=>antwort(sag('trade','Nothing to trade. Not yet.'),'whisper')},
      {label:'leave',go:()=>{}},
    ];
    OW_BUBBLE.zeigen(this,u,{text:sag('spin',"What's up…?"),actions:menue()});
    return true;
  }
  /* Drei Anlässe, ein Ablauf (Masterplan §4.2). Der Unterschied ist Rahmen und Copy. */
  awardCard(card,reason,zone){
    if(!card)return;
    if(this._award){this.collected.push(card);return;}   // zwei auf einmal: die zweite still
    this._award={card,reason,zone};
    /* WS0-Haken: wer einen eigenen Screen mitbringt, bekommt den Auftrag samt Rückweg.
       Auf »läuft« gaten — ohne `done` würde die Karte nie ankommen, deshalb wird die Funktion
       nur benutzt, wenn sie eine ist. */
    if(typeof this.hudCardAward==='function'){
      this.hudCardAward({card,reason,zone,done:()=>this.closeAward()});
      return;
    }
    const warten=(reason==='zone')?1500:200;   // dem Aufdecken in der Welt seine 1,4 s lassen
    clearTimeout(this._awardT);
    this._awardT=setTimeout(()=>this.showAward(),warten);
  }
  showAward(){
    const a=this._award;if(!a||!this.awardEl)return;
    const RAHMEN={
      zone:  ['EVIDENCE SECURED','The zone kept this one. It does not any more.'],
      king:  ['THE KING ACCEPTS','He takes your story and gives you a piece of his.'],
      hidden:['FOUND IN THE GRASS','Nobody put it there. Somebody must have.'],
    };
    const r=RAHMEN[a.reason]||RAHMEN.zone;
    const box=this.awardEl;
    box.querySelector('.why').textContent=r[0];
    box.querySelector('h3').textContent='»'+(a.card.t||'?')+'«';
    const ctx=[r[1]];
    if(a.zone&&a.zone.tutorial)ctx.push('Your first one. The others are the same, only louder.');
    box.querySelector('.ctx').textContent=ctx.join(' ');
    // Das Blatt selbst: dieselbe Kunst, die in der Welt liegt — kein zweites Kartenbild
    const cv=box.querySelector('canvas'),g=cv.getContext('2d');
    g.clearRect(0,0,cv.width,cv.height);
    const art=a.zone&&a.zone.art;
    if(art){
      const s=Math.min(cv.width/art.width,cv.height/art.height);
      const w=art.width*s,h=art.height*s;
      g.drawImage(art,(cv.width-w)/2,(cv.height-h)/2,w,h);
    }else if(window.OW_CARD&&OW_CARD.draw){
      /* Noch kein Blatt geladen (die Zone lädt es erst beim Aufdecken): dann zeichnet der
         Kanon-Zeichner das Ersatzblatt — Titel, Lore, Tuschekante. Kein leeres Rechteck. */
      try{
        const b=OW_CARD.draw(a.card,{portrait:false,deck:this.deck&&this.deck.title});
        const src=b&&(b.canvas||b);
        if(src&&src.width){
          const s=Math.min(cv.width/src.width,cv.height/src.height);
          g.drawImage(src,(cv.width-src.width*s)/2,(cv.height-src.height*s)/2,src.width*s,src.height*s);
        }
      }catch(e){console.warn('[award] Kartenzeichner fällt aus:',e.message);}
    }
    this.paused=true;
    box.style.display='flex';
    if(this.audio)this.audio.sfx('card');
    // Notausgang: ein Blatt, das niemand schließt, darf die Karte nicht behalten
    clearTimeout(this._awardAuto);
    this._awardAuto=setTimeout(()=>{if(this._award)this.closeAward();},30000);
  }
  closeAward(){
    const a=this._award;this._award=null;
    clearTimeout(this._awardT);clearTimeout(this._awardAuto);
    if(this.awardEl)this.awardEl.style.display='none';
    this.paused=false;this.keys={};
    if(!a)return;
    this.collected.push(a.card);          // ab hier fliegt sie — das HUD sieht den Zuwachs
    if(this.audio)this.audio.sfx('confirm');
    this.autosave();
    if(a.zone)setTimeout(()=>this.askCaption(a.zone),900);
    console.log('[award]','»'+(a.card.t||'?')+'«','·',a.reason,'→ Almanach ('+this.collected.length+')');
  }
  step(dt){
    const h=this.hero;
    if(!h||this.paused)return;
    this._dtLast=dt;   // v10-S22: der Skin-Haken zeichnet, wo er kein dt hat
    if(this.hurt>0)this.hurt-=dt;
    // v11-R2: Nachlauf abbauen — und den gemerkten Druck einlösen, sobald er abgelaufen ist
    if(h.rec>0){
      h.rec-=dt;
      if(h.rec<=0&&this._atkBuf&&this.time-this._atkBuf<=(window.OW_FEEL?OW_FEEL.T.buffer:0.15)){
        this._atkBuf=0;this.tryAttack(h);
      }
    }
    /* Die Regie hat Vorfahrt vor der Eingabe — sonst läuft man mitten im Flug los. Sie steht hier
       oben, damit auch Kamera und Zeichner schon ihre Position sehen. */
    if(this.stepBlodsinn(dt)){
      this.cam.x+=(h.x-this.cam.x)*Math.min(1,dt*9);
      this.cam.y+=(h.y-this.cam.y)*Math.min(1,dt*9);
      if(this.OWA)for(const m of this.mobs)if(m.hp>0&&m.ai)m.anim+=dt*4;
      this._hud=(this._hud||0)+dt;
      if(this._hud>0.2){this._hud=0;this.updateHud();}
      return;
    }
    // Eingabe: Tastatur schlägt Klick-Aufträge
    let dx=(this.keys['d']||this.keys['arrowright']?1:0)-(this.keys['a']||this.keys['arrowleft']?1:0);
    let dy=(this.keys['s']||this.keys['arrowdown']?1:0)-(this.keys['w']||this.keys['arrowup']?1:0);
    if(dx||dy){this.moveTarget=null;this.path=null;this.attackTarget=null;}
    // Während der Rede steht der Held still — das ist der Preis der Ability
    if(h.busy>0){h.busy-=dt;dx=0;dy=0;this.path=null;this.attackTarget=null;}
    // Auto-Attack-Ziel verfolgen
    const at=this.attackTarget;
    if(at&&at.hp>0&&h.state!=='attack'&&h.busy<=0){
      const d=Math.hypot(at.x-h.x,at.y-h.y);
      /* v11-R1: **stoppen, wo der Körper aufhört** — nicht bei einer festen 54. Gegen die
         Schildkröte stand der Held vorher im Panzer, gegen das Schaf einen halben Meter daneben. */
      /* v11-U2: ein Fernkämpfer bleibt stehen, wo er WERFEN kann. Vorher lief er mit dem Bogen bis
         auf Handkantenabstand (`OW_REACH.stop`, 54…70 px) — und damit war der Unterschied zwischen
         Archer und Warrior im Spiel nicht zu sehen, nur im Katalog zu lesen. */
      const SH=window.OW_SHOTS;
      const stopAt=(SH&&SH.armed(h))?SH.T.standoff:(window.OW_REACH?OW_REACH.stop(h,at):54);
      if(d<=stopAt){
        this.path=null;
        h.face=Math.sign(at.x-h.x)||h.face;
        h.dir=Math.abs(at.x-h.x)>=Math.abs(at.y-h.y)?'side':(at.y>h.y?'down':'up');
        this.tryAttack(h);
      }else if(!this.path||this.time-(this._repath||0)>0.7){
        this._repath=this.time;
        this.path=this.findPath(Math.floor(h.x/TILE),Math.floor(h.y/TILE),Math.floor(at.x/TILE),Math.floor(at.y/TILE));
        this.pathI=1;
        if(!this.path){this.attackTarget=null;this.msg('No path to that target.');}
      }
    }
    // Pfad folgen
    if(!dx&&!dy&&this.path&&h.state!=='attack'){
      const wp=this.path[this.pathI];
      if(!wp){this.path=null;this.moveTarget=null;}
      else{
        let tx=(wp.x+0.5)*TILE,ty=(wp.y+0.5)*TILE;
        if(this.pathI===this.path.length-1&&this.moveTarget){tx=this.moveTarget.x;ty=this.moveTarget.y;}
        const ddx=tx-h.x,ddy=ty-h.y;
        if(Math.hypot(ddx,ddy)<8)this.pathI++;
        else{dx=ddx;dy=ddy;}
      }
    }
    if(h.state==='attack'){
      h.atkT+=dt;
      const ha=h.unit.anim(h.atkKey),dur=ha.frames/ha.fps;
      if(!h.didHit&&h.atkT>dur*0.45){
        h.didHit=true;
        if(window.OW_STORY&&this.curZone)OW_STORY.beat(this,this.curZone,'fight');
        /* v11-U2 · **Wer ein Geschoss führt, wirft — und schlägt nicht zusätzlich zu.** Sonst hätte
           der Archer beides: Reichweite UND Nahkampf, und die fünf Fernkämpfer wären nicht eine
           andere Spielweise, sondern die bessere. Getroffen wird unterwegs (shots.js). Ohne Ziel
           fliegt es geradeaus — ins Leere zu schießen ist erlaubt. */
        const S=window.OW_SHOTS;
        if(S&&S.armed(h)){
          const t=S.aimFrom(this,h);
          S.fire(this,h,t?t.x:h.x+h.face*S.T.standoff,
            t?t.y-((t.unit&&t.unit.bodyH)||60)*0.55:h.y-((h.unit.bodyH||60)*0.55),
            {dmg:this.heroDamage(),fromHero:true});
        }else for(const m of this.mobs){
          if(m.hp<=0)continue;
          const mx=m.x-h.x,my=m.y-h.y,d=Math.hypot(mx,my);
          // v11-R1: dieselbe Rechnung wie beim Heranlaufen, nur der äußere Rand des Bandes
          const hitAt=window.OW_REACH?OW_REACH.hit(h,m):62;
          if(d<hitAt&&(mx*h.face>=-14||Math.abs(my)>Math.abs(mx))){
            this.damage(m,this.heroDamage(),true);
            // Rückstoß als abklingende Geschwindigkeit (V5-S12) statt Sofort-Versatz
            if(window.OW_FEEL)window.OW_FEEL.knock(m,mx,my,OW_FEEL.T.knockMob);
            else{const kb=90/Math.max(d,10);m.x+=mx*kb*0.5;m.y+=my*kb*0.5;}
          }
        }
      }
      /* v11-R2 · Nachlauf. Vorher stand hier `if(h.atkT>dur)h.state='idle'` und sonst nichts:
         der Schlag war in dem Bild vorbei, in dem der Clip endete, und die Leertaste beliebig oft
         drückbar. Das ist der Grund, warum sich der Kampf wie Tippen anfühlte und nicht wie Schlagen.
         Jetzt bekommt der Hieb ein Ende mit Dauer — aber nur für den SCHLAG. Laufen geht sofort
         wieder, weil ein festgenagelter Held als Hänger gelesen wird und nicht als Gewicht. */
      if(h.atkT>dur){h.state='idle';h.rec=dur*(window.OW_FEEL?OW_FEEL.T.recover:0.35);}
    }else if(dx||dy){
      const px=h.x,py=h.y;
      // Trägheit, Fahrt, Kampfbremse und Bloodlust liegen in game-feel.js (V5-S12, eine Tabelle)
      this.dtLast=dt;
      const got=window.OW_FEEL?window.OW_FEEL.drive(this,h,dx,dy,dt)
        :(this.moveEntity(h,dx,dy,250,dt),Math.hypot(h.x-px,h.y-py));
      h.state='run';
      /* V8-S1: die Animationsrate hängt an der GELAUFENEN Strecke, nicht an der Uhr. `got` ist der
         gemessene Weg — genau die Zahl, die hier vorher ungenutzt herumlag, während `dt*10` die
         Beine unabhängig davon drehte. Vor der Wand ist `got` 0, also stehen die Beine. */
      this._heroMoved=got;
      if(window.OW_ACLOCK)window.OW_ACLOCK.advance(h,h.unit,dt,got,'run');
      else h.anim+=dt*10;
      /* Gummiband-Küste (V6-S12): wer gegen die Kante läuft, beult sie ein — und wenn sie reißt,
         schnappt sie zurück und schießt ihn weg. Gerechnet wird in FELDERN, weil die Kontur in
         Feldern liegt; der Rückwurf kommt als Geschwindigkeit, nicht als Positionssprung
         (Fehlerklasse v8: »Trägheit als Geschwindigkeitsvektor, nicht als Positionssprung«). */
      const RB=window.OW_RUBBER;
      if(RB&&!this.interior){
        const vfx=(h.x-px)/Math.max(dt,1e-3)/TILE, vfy=(h.y-py)/Math.max(dt,1e-3)/TILE;
        const want2=(window.OW_FEEL?(h._sp||0):250)/TILE;
        // Der Wunsch zählt, nicht der Weg: an der Wand kommt man nicht voran und drückte sonst nie
        const wx=dx*want2, wy=dy*want2;
        const kick=RB.push(h.x/TILE,h.y/TILE,
          Math.abs(vfx)+Math.abs(vfy)<0.05?wx:vfx,
          Math.abs(vfx)+Math.abs(vfy)<0.05?wy:vfy, dt, 1.1);
        if(kick){
          /* Der Rückwurf geht über `OW_FEEL.knock` — die eine Stelle, an der dieses Projekt Stöße
             kennt (`_kx`/`_ky`, integriert in `applyKnock`, Kollision gilt dabei weiter). Der
             erste Entwurf schrieb in `h.vx`/`h.vy`; die gibt es am Helden nicht, und niemand liest
             sie — gemessen: der Held bewegte sich in zwei Sekunden um 3,9 px. */
          const F=window.OW_FEEL;
          const force=Math.hypot(kick.x,kick.y)*TILE;
          if(F)F.knock(h,kick.x,kick.y,force);
          if(window.OW_MOTION)window.OW_MOTION.poke(h,'bump',1.5,h.face);
          if(this.audio)this.audio.sfx('hit',{gain:0.3,throttle:300});
          this.msg('The coastline threw you back.');
        }
      }
      /* Prellen: der Held wollte laufen und ist nicht gekommen — Wand, Baum, Gebäude.
         Gemessen am Weg, nicht an einer Kollisionsmeldung; mit Sperre, damit Anliegen nicht ruckelt. */
      const want=(window.OW_FEEL?(h._sp||0):250)*dt;
      if(window.OW_MOTION&&want>1.2&&got<want*0.35&&this.time-(this._bumpAt||-9)>0.55){
        this._bumpAt=this.time;
        window.OW_MOTION.poke(h,'bump',Math.min(1.6,want/Math.max(got,0.6)*0.5),h.face);
        if(this.audio)this.audio.sfx('hit',{gain:0.22,throttle:400});
      }
      if(this.audio){
        const ti=Math.floor(h.y/TILE)*this.W+Math.floor(h.x/TILE);
        this.audio.step(got,this.land[ti]===0?'water':'ground');
      }
    }else{
      h.state='idle';
      this._heroMoved=0;
      if(window.OW_ACLOCK)window.OW_ACLOCK.advance(h,h.unit,dt,0,'idle');
      else h.anim+=dt*7;
      // Auch im Stand läuft der Auslauf ab, und ein Rückstoß schiebt weiter
      if(window.OW_FEEL)window.OW_FEEL.drive(this,h,0,0,dt);
    }
    // Regeneration außerhalb des Kampfs
    if(this.time-h.lastHit>4&&h.hp<h.maxhp)h.hp=Math.min(h.maxhp,h.hp+3*dt);
    // Mobs — das Eigenleben liegt ab V4-S1 in mob-ai.js: Zustände mit Verweildauer,
    // Lenkung, Trennung als Kraft, Wahrnehmung mit Anlauf. Eine Wahrheit, ein Ort.
    this.OWA.step(this,dt);
    // Rückstoß für ALLE, nach der Lenkung: sonst rechnet die KI gegen einen Schlag an (V5-S12b)
    if(window.OW_FEEL)OW_FEEL.tick(this,dt);
    if(window.OW_SHOTS)OW_SHOTS.step(this,dt,TILE);
    if(window.OW_MOTION)window.OW_MOTION.updateAll(this,dt);
    if(h.flash)h.flash-=dt;
    for(const c of this.corpses)c.t+=dt;
    /* v10-S2d · Die Uhr des Wächters und sein Auftauchen. Beides hängt hier, nicht in der KI: ein
       Toter denkt nicht, und `think()` überspringt ihn ohnehin. */
    for(const m of this.mobs){
      if(m.rise!=null&&m.rise<1.35){
        m.rise+=dt/0.9;
        if(m.rise>=1&&m.rise-dt/0.9<1&&window.OW_MOTION)
          window.OW_MOTION.poke(m,'land',1.1,m.face);   // der Tritt beim Herauskommen
        if(m.rise>=1.35)m.rise=null;
      }
      if(m.hp<=0&&m.deadAt!=null&&this.time-m.deadAt>=60)this.reviveGuard(m);
    }
    this.corpses=this.corpses.filter(c=>c.t<9);
    for(const fl of this.floaters){fl.t+=dt;fl.y-=26*dt;}
    this.floaters=this.floaters.filter(f=>f.t<1.1);
    // Kamera
    const z=this.zoomEff();
    if(this.overview){this.cam.x=this.W*TILE/2;this.cam.y=this.H*TILE/2;}
    else{
      /* **Auf dem Blatt zielt die Kamera aufs Blatt, nicht auf den Helden** (V9-B3b). Sonst hängt der
         Ausschnitt an der Führungsfigur: wer auf der unteren Kartenreihe steht, schiebt Oberkante und
         Beschriftung aus dem Bild — gemessen und im Screenshot belegt. Beim Lesen hält die Kamera
         still, das ist auch die richtige Regie. Dieselbe Dämpfung, kein Schnitt und kein zweiter
         Kamera-Eigentümer (die Lehre aus S73: **ein** Kamera-Eigentümer). */
      const Rd=this.reader;
      /* v12-K1 · DIE KAMERA FOLGT DEM HELDEN, PUNKT — sie wird nur GEKLAMMERT (Georg 12.8.:
         »Kamera folgt nicht korrekt auf der Karte, springt/schwimmt, nachdem die Unit am Entry-Rand
         stehen bleibt«).

         Der Vorgänger blendete zeitgesteuert zwischen Held und Blattmitte über (Schmitt-Trigger auf
         die Ruhe, 0,5 s Verweildauer). Das erzeugte GENAU das gemeldete Bild: der Held bleibt am
         Rand stehen, das Ziel wandert von selbst weg, und weil die Dämpfung darunter mit derselben
         Zeitkonstante läuft, sind es **zwei ineinander geschachtelte Glättungen** — das ist das
         Schwimmen. *Wer eine Kamera an eine Uhr hängt, hat eine Kamera, die sich selbst bewegt.*

         Der Anlass war trotzdem echt und gemessen (V9-B3b): wer auf der unteren Kartenreihe steht,
         schiebt die Oberkante des Blattes aus dem Bild. Das ist aber eine GEOMETRIE-Frage, keine
         Zeitfrage. Also eine Klammer: solange der Held auf dem Blatt steht, darf die Kamera nur
         soweit wandern, wie das ganze Blatt im Bild bleibt; passt es nicht ins Bild, steht sie auf
         seiner Mitte. Keine Uhr, kein Anteil, kein zweiter Kamera-Eigentümer. */
      let tx=h.x,ty=h.y;
      if(Rd&&Rd.onSheet){
        const vwK=this.cv.width/this.dpr/z,vhK=this.cv.height/this.dpr/z;
        const sx0=Rd.x*TILE,sy0=Rd.y*TILE,swK=Rd.w*TILE,shK=Rd.h*TILE;
        const mx=(vwK-swK)/2,my=(vhK-shK)/2;
        const cx=sx0+swK/2,cy=sy0+shK/2;
        tx=mx>0?Math.max(cx-mx,Math.min(cx+mx,h.x)):cx;
        ty=my>0?Math.max(cy-my,Math.min(cy+my,h.y)):cy;
      }
      this.cam.x+=(tx-this.cam.x)*Math.min(1,dt*5);
      this.cam.y+=(ty-this.cam.y)*Math.min(1,dt*5);
      const vw=this.cv.width/this.dpr/z,vh=this.cv.height/this.dpr/z;
      if(vw<this.W*TILE)this.cam.x=Math.max(vw/2,Math.min(this.W*TILE-vw/2,this.cam.x));
      else this.cam.x=this.W*TILE/2;
      if(vh<this.H*TILE)this.cam.y=Math.max(vh/2,Math.min(this.H*TILE-vh/2,this.cam.y));
      else this.cam.y=this.H*TILE/2;
    }
    // Kayfabe sammelt sich beim Betreten einer Zone, nicht pro Kampf (Spec §3)
    const zn=this.zoneAt(h.x,h.y);
    if(zn!==this.curZone){
      /* v10-S17 · Die Mini-Story hängt an denselben Übergängen, die es ohnehin gibt — sie erfindet
         keine eigenen Ereignisse. Ohne gebundene Beats passiert hier nichts. */
      if(window.OW_STORY){
        if(this.curZone)OW_STORY.beat(this,this.curZone,'leave');
        if(zn)OW_STORY.beat(this,zn,'enter');
      }
      this.curZone=zn;
      if(zn)zn.visited=true;
      if(zn&&h.charges<h.stats.kayfabe){
        h.charges++;
        this.msg(`Kayfabe recovers — ${h.charges}/${h.stats.kayfabe} charges.`);
      }
      if(zn&&this.audio){
        this.audio.sfx('card');
        const open=this.zones.filter(z=>!z.cleared).length;
        if(!zn.cleared&&open===1)this.audio.voice('finalZone',1,0);
        else if(!zn.cleared)this.audio.round(this.zones.indexOf(zn));
      }
    }
    // Kampfbeginn: der Moment, in dem onFightStart-Buffs zünden
    const fighting=this.mobs.some(m=>m.hp>0&&m.aggro&&Math.hypot(m.x-h.x,m.y-h.y)<420);
    if(fighting&&!this.inFight){
      this.inFight=true;
      if(this.audio)this.audio.voice('fightStart',0.85,7000);
      if(Object.keys(h.buffs).length)this.fightStart();
    }
    else if(!fighting&&this.inFight)this.inFight=false;
    // Tusche-Brücke abräumen — aber nie unter den Füßen des Helden
    if(this.tempBridge.size){
      const hi=Math.floor(h.y/TILE)*this.W+Math.floor(h.x/TILE);
      for(const [i,b] of this.tempBridge){
        if(this.time<b.until)continue;
        if(i===hi){b.until=this.time+1.2;continue;}
        this.tempBridge.delete(i);
      }
    }
    if(this.bubble){this.bubble.t+=dt;if(this.bubble.t>this.bubble.ttl)this.bubble=null;}
    // v10-S2b: das Aufdecken läuft in der Welt weiter, auch wenn man wegläuft
    for(const z of this.zones)if(z.cleared&&z.revealT!=null&&z.revealT<1.5)z.revealT+=dt;
    if(this.interior){this.checkExit();if(this.king)this.king.anim+=dt*6;}
    else if(this.king)this.king.anim+=dt*6;
    /* Loot-Zone: Betreten IST die Handlung (§22.4 A). Der Test darf NICHT in der Nähe-Berechnung
       hängen: deren Radius ist 118 px, der innere Rahmen aber 179 px halbbreit — links und rechts
       blieb ein Band von 61 px, in dem man mitten auf der Karte stand und nichts geschah (gemessen).
       Geprüft wird darum über alle Orte, unabhängig von der Sprechzeile. */
    for(const q of (this.places||[])){
      if(!q.pen||!q.inner||q.opening||q.zone.looted)continue;
      if(h.x>q.inner.x&&h.x<q.inner.x+q.inner.w&&h.y>q.inner.y&&h.y<q.inner.y+q.inner.h){
        this.openLoot(q);break;
      }
    }
    if(this.places&&this.places.length&&this.promptEl){
      // Reichweite je Ort: ein Gebäude ruft auf 118 px, eine Loot-Zone ist größer als das —
      // der Hinweis »walk in« muss VOR dem Tor stehen, nicht erst mitten auf der Karte.
      let near=null,nd=1e9;
      for(const p of this.places){
        const d=Math.hypot(h.x-p.x,h.y-p.y);
        const r=(p.pen&&p.rect)?Math.max(p.rect.w,p.rect.h)*0.6+80:118;
        if(d<r&&d<nd){nd=d;near=p;}
      }
      if(near!==this.nearPlace){
        this.nearPlace=near;
        if(window.OW_CURSOR)OW_CURSOR.set(near?'hint':'default');
        if(near)this.promptEl.textContent=(near.pen?'':'E — ')+near.label+': '+near.hint;
        this.promptEl.style.display=(near&&!this.overview)?'block':'none';
      }
    }
    if(this.marked&&this.marked.mob.hp<=0)this.marked=null;
    // HUD
    /* Bildrate aus der ungeklemmten Zeit. Die alte Zeile rechnete 1/dt und meldete damit die
       Klemme: exakt 20,0 in jeder Lage (Befund 8.8.). */
    this.stats.fps=this.stats.msFrame>0?1000/this.stats.msFrame:0;
    this._hud=(this._hud||0)+ (dt||0.008);
    if(this._hud>0.2){this._hud=0;this.updateHud();}
  }
  /* v10-S5 · **BLÖDSINN!-Regie** — v11-R5 umgebaut (Georg 11.8.)
     ────────────────────────────────────────────────────────────────────────────────────────────
     Der Tod war einmal ein Teleport (ein Satz im Log, und der Held stand am Friedhof), dann ein
     **zackiger Flug quer über die Insel mit Tempolinien**. Georgs Befund zum Flug: »wenn ich sterbe,
     werde ich über die ganze Map geschoben, mit so einem komischen Strich hinten dran — das sollte
     man ausblenden«. Er hat recht, und der Grund ist grundsätzlicher als der Strich:

     **Ein Flug behauptet, dass der Weg passiert.** Er passiert aber nicht — der Held wird versetzt.
     Wer ihn zwei Sekunden lang über Gras, Wasser und Wände hinweg schiebt, zeigt eine Bewegung, die
     die Welt gar nicht zulässt (durch Berge hindurch, über Meer), und die Tempolinien behaupten das
     doppelt. Zwischen »Teleport ohne Erlebnis« und »Flug, der lügt« liegt die Fassung, die Filme seit
     hundert Jahren nehmen: **es wird dunkel, und man wacht anderswo auf.**

     Drei Takte, alle in der Welt gezeichnet, keiner in einem DOM-Overlay:
       1. **Blinken** (0,55 s) — der Held flackert auf der Stelle und ruft BLÖDSINN!.
          Der Ausruf ist der Kanon-Name, nicht »you died«.
       2. **Wegdämmern** (0,4 s) — er sinkt in sich zusammen, ein Schleier zieht über das Bild.
       3. **Aufwachen** (0,55 s) — der Schleier hebt sich am Friedhof, er richtet sich auf, Staub.
     **Der Schnitt liegt im Dunkeln**: Held und Kamera springen genau dann, wenn der Schleier voll
     deckt. Nichts wird geschoben, nichts hinterlässt eine Linie, und die Regie ist eine halbe
     Sekunde kürzer als vorher.
     Die Uhr läuft in `step`, nicht in `setTimeout`: ein Fensterwechsel darf die Regie nicht
     zerschneiden (dieselbe Regel wie beim Wächter-Respawn, v10-S2d). */
  heroDown(){
    const h=this.hero;
    if(this._blod)return;                  // wer schon fliegt, stirbt nicht zweimal
    this.msg('BLÖDSINN! — the island spits you back to the graveyard.');
    if(this.audio)this.audio.voice('heroDown',1,0);
    h.hp=h.maxhp;h.busy=0;
    this.attackTarget=null;this.moveTarget=null;this.path=null;this.marked=null;
    for(const m of this.mobs)if(m.hp>0){m.aggro=false;m.fled=false;m.frozen=0;m.x=m.hx;m.y=m.hy;m.hp=m.maxhp;}
    this.say('BLÖDSINN!',1.5,'shout');
    if(this.audio)this.audio.sfx('error',{gain:0.5});
    this._blod={t:0,phase:'blink',hide:false,base:h.sizeMul||1,veil:0,
      from:{x:h.x,y:h.y},to:{x:this.spawn.x,y:this.spawn.y},dust:[]};
    this.diary.push({t:'down',text:'BLÖDSINN! — the island returned me to the graveyard.'});
    console.log('[blödsinn] Start',Math.round(h.x/TILE)+','+Math.round(h.y/TILE),
      '→',Math.round(this.spawn.x/TILE)+','+Math.round(this.spawn.y/TILE),
      '· Strecke',Math.round(Math.hypot(this.spawn.x-h.x,this.spawn.y-h.y)/TILE),'Felder');
  }
  /* Gibt true, solange die Regie das Kommando hat — dann schweigt die Eingabe. */
  stepBlodsinn(dt){
    const b=this._blod;if(!b)return false;
    const h=this.hero;b.t+=dt;
    const BLINK=0.55,OUT=0.4,WAKE=0.55;
    if(b.phase==='blink'){
      b.hide=Math.floor(b.t*12)%2===1;
      h.sizeMul=b.base*(1+0.06*Math.sin(b.t*26));
      h.state='idle';
      if(b.t>=BLINK){b.phase='out';b.t=0;b.hide=false;}
      return true;
    }
    if(b.phase==='out'){
      const p=Math.min(1,b.t/OUT);
      b.veil=p*p;                              // spät einsetzend, damit das Blinken noch zu sehen ist
      h.sizeMul=b.base*(1-0.36*p);             // er sinkt in sich zusammen, wo er gefallen ist
      h.state='idle';
      if(p>=1){
        /* **Der Schnitt liegt im Dunkeln.** Held UND Kamera springen in demselben Bild, in dem der
           Schleier voll deckt — und der Kamera-Merker wird geleert, sonst rechnet die Kamera aus dem
           Sprung ein Tempo von einigen Tausend Pixeln je Sekunde und hält sich für einen Sprint. */
        h.x=b.to.x;h.y=b.to.y;
        this.cam.x=h.x;this.cam.y=h.y;this._camPrev=null;this._camStill=0;
        b.phase='wake';b.t=0;b.veil=1;
        for(let i=0;i<10;i++){
          const a=Math.PI*(0.15+0.7*(i/9)),v=64+38*rand2(i,3,7);
          b.dust.push({x:h.x,y:h.y,vx:Math.cos(a)*v*(i%2?1:-1),vy:-Math.sin(a)*v*0.5,t:0});
        }
        if(this.audio)this.audio.sfx('hit',{gain:0.32});
        if(this.hudShake)this.hudShake('panel',5);
      }
      return true;
    }
    // Aufwachen: der Schleier hebt sich, er richtet sich auf, der Staub legt sich
    const p=Math.min(1,b.t/WAKE);
    b.veil=1-p;
    h.sizeMul=b.base*(0.64+0.36*p+0.07*Math.sin(p*Math.PI));
    h.state='idle';
    for(const d of b.dust){d.t+=dt;d.x+=d.vx*dt;d.y+=d.vy*dt;d.vy+=180*dt;}
    if(p>=1){
      h.sizeMul=b.base;this._blod=null;this.keys={};
      this.cam={x:h.x,y:h.y};this._camPrev=null;this._camStill=0;
      console.log('[blödsinn] aufgewacht · Feld',Math.round(h.x/TILE)+','+Math.round(h.y/TILE));
    }
    return true;
  }
  /* v11-R5 · Der Schleier statt der Tempolinien. Er liegt IM Weltbild (dieselbe Leinwand, dieselbe
     Kameramatrix), nicht als DOM-Schicht darüber — deshalb rechnet er in Weltkoordinaten und deckt
     genau den sichtbaren Ausschnitt plus einen Rand. Gezeichnet wird er NACH den Figuren und VOR den
     Sprechblasen: der Held verschwindet darunter, der BLÖDSINN!-Ruf bleibt lesbar. */
  drawBlodsinn(){
    const b=this._blod;if(!b)return;
    const ctx=this.ctx;
    if(b.veil>0.002){
      const z=this.zoomEff();
      const vw=this.cv.width/this.dpr/z,vh=this.cv.height/this.dpr/z;
      ctx.save();
      ctx.fillStyle='rgba(9,7,6,'+(0.95*b.veil).toFixed(3)+')';
      ctx.fillRect(this.cam.x-vw/2-12,this.cam.y-vh/2-12,vw+24,vh+24);
      ctx.restore();
    }
    if(b.dust.length){
      ctx.save();
      for(const d of b.dust){
        const a=Math.max(0,1-d.t/0.6);if(a<=0)continue;
        ctx.globalAlpha=a*0.7;ctx.fillStyle='#cbbfa4';
        ctx.beginPath();ctx.arc(d.x,d.y,3+4*(1-a),0,6.283);ctx.fill();
      }
      ctx.restore();
    }
  }
  updateHud(){
    const h=this.hero;
    if(this.minimal&&!this.overview){
      this.miniEl.querySelector('.fb i').style.transform=`scaleX(${Math.max(0,h.hp/h.maxhp)})`;
      const kc=Array.from({length:h.stats.kayfabe},(_,i)=>`<i class="${i<h.charges?'f':''}"></i>`).join('');
      const el=this.miniEl.querySelector('.kc');
      if(el.innerHTML!==kc)el.innerHTML=kc;
      return;
    }
    if(this.HUD&&this.settingsEl&&this.settingsEl.style.display==='flex'&&this.time-(this._syncT||0)>0.5){
      this._syncT=this.time;this.HUD.sync();
    }
    this.pill.textContent=`${Math.round(this.stats.fps)} fps (${(this.stats.msFrame||0).toFixed(1)} ms) · ${this.stats.tiles} tiles · ${this.stats.sprites+this.mobs.length} sprites · seed ${this.att.seed}`;
    if(this.overview){this.zoneEl.style.display='none';return;}
    const hp=this.panel.querySelector('.hp i');hp.style.transform=`scaleX(${Math.max(0,h.hp/h.maxhp)})`;
    this.panel.querySelector('.hp u').style.setProperty('--seg',h.stats.fluff);
    this.panel.querySelector('.hp span').textContent=
      (Math.ceil(h.hp/FLUFF_UNIT*10)/10).toFixed(1)+' / '+h.stats.fluff;
    /* v10-S6: kein Level, kein Balken zur nächsten Stufe. Der Balken zeigt jetzt, **wie nah die
       nächste Ausgabe ist** — voll heißt: du kannst etwas kaufen. */
    const billig=Math.min(...STAT_KEYS.map(k=>POP_COST.stat(h.stats[k])));
    this.panel.querySelector('.xp i').style.transform=`scaleX(${Math.min(1,h.pop/billig)})`;
    this.panel.querySelector('.xp span').textContent=h.pop+' POP';
    this.panel.querySelector('.lv').textContent=
      `Fluff ${h.stats.fluff} · evidence ${this.collected.length}/${this.zones.length}`;
    this.panel.querySelector('.stats').innerHTML=STAT_KEYS
      .map(k=>`<span style="color:${STAT_INFO[k].color}"><b>${h.stats[k]}</b> ${STAT_INFO[k].name}</span>`).join('');
    let kf='';
    for(let i=0;i<3;i++){
      const id=i<h.slots?h.equipped[i]:null;
      if(i>=h.slots){kf+='<div class="slot"></div>';continue;}
      if(!id){kf+='<div class="slot on" data-s="'+i+'">empty<em>'+SLOT_KEYS[i].toUpperCase()+'</em></div>';continue;}
      const ab=OWK.ABILITIES[id],col=OWK.RARITY[ab.rarity].color;
      const armed=h.buffs[id]?' ●':'';
      // Der Text bleibt Knopfschrift (lesbar), die Rarity trägt ein eigener Punkt —
      // border-color wäre unter dem 9-Slice-Rahmen ohnehin unsichtbar.
      kf+=`<div class="slot on${h.charges<ab.cost?' spent':''}" data-s="${i}" `
        +`title="${ab.title} — ${OWK.RARITY[ab.rarity].label} — ${ab.hint}">`
        +`<b class="rr" style="background:${col}"></b>`
        +`${ab.key}${armed}<em>${SLOT_KEYS[i].toUpperCase()}</em></div>`;
    }
    kf+='<div class="chg">'+Array.from({length:h.stats.kayfabe},(_,i)=>
      `<i class="${i<h.charges?'f':''}"></i>`).join('')+'</div>';
    if(this.kfEl.innerHTML!==kf){
      this.kfEl.innerHTML=kf;
      for(const el of this.kfEl.querySelectorAll('.slot.on')){
        const s=+el.dataset.s;
        el.onclick=ev=>{ev.shiftKey?this.cycleSlot(s):this.useKayfabe(s);};
        el.oncontextmenu=ev=>{ev.preventDefault();this.cycleSlot(s);};
      }
    }
    const spare=h.unlocked.filter(id=>h.equipped.indexOf(id)<0);
    this.poolEl.textContent=spare.length
      ?'In the pool: '+spare.map(id=>OWK.ABILITIES[id].title).join(' · ')+'  (right-click a slot to swap)'
      :'';
    const zone=this.zoneAt(h.x,h.y);
    /* **Zwei Eigentümer für dieselbe Auskunft** (Georg 9.8.: »da liegt irgendein Overlay über den
       Units«). Das Overlay war dieses Banner: es stand mitten im Bild über den Bären und sagte
       Wort für Wort, was das v7-Möbel oben rechts im Feld »Nearest« ohnehin sagt — Titel, Biom,
       Wächterzahl. Dieselbe Klasse wie der C-Streit (V8-S4): wenn zwei Stellen dasselbe dürfen,
       stört die zweite. Das Skin gewinnt, weil es an der Kante sitzt und nicht in der Szene; nur
       ohne Skin bleibt das Banner als Notausgang. */
    const skinSagtEsSchon=!!(this.HUD&&this.HUD.version&&/v7/.test(this.HUD.version));
    if(zone&&!skinSagtEsSchon){
      this.zoneEl.style.display='block';
      const names=[...new Set(this.mobs.filter(m=>m.zone===zone&&m.hp>0&&!m.critter)
        .map(m=>m.unit.name+(m.elite?' ★':'')))].join(' · ');
      this.zoneEl.innerHTML=zone.cleared
        ?`<b>»${zone.card.t}«</b> — secured`
        :`<b>»${zone.card.t}«</b> · ${this.deck.title}<br>${zone.biome} · guards left: ${zone.alive}`
         +(names?`<br><span style="opacity:.75">${names}</span>`:'');
    }else this.zoneEl.style.display='none';
  }
  drawAuto(img,bx,x,y,maskFn){
    const N=maskFn(x,y-1),E=maskFn(x+1,y),S=maskFn(x,y+1),W=maskFn(x-1,y);
    const{col,row}=autoTileIdx(N,E,S,W);
    this.ctx.drawImage(img,(bx+col)*TILE,row*TILE,TILE,TILE,x*TILE,y*TILE,TILE,TILE);
  }
  /* Abschnittsuhr: `_t('name')` schliesst den vorigen Abschnitt ab und beginnt den naechsten,
     `_t(null)` schliesst den letzten. Summiert wird in `dbgT` — das Messgeraet teilt durch die
     Zahl der Bilder. Ohne `dbgT` ist das ein `if` und sonst nichts. */
  _t(k){
    const T=this.dbgT;if(!T)return;
    const n=performance.now();
    if(this._tk)T[this._tk]=(T[this._tk]||0)+(n-this._tn);
    this._tk=k;this._tn=n;
  }
  draw(){
    const ctx=this.ctx,z=this.zoomEff()*this.dpr;
    this._tk=null;this._t('grund');
    ctx.setTransform(1,0,0,1,0,0);
    ctx.fillStyle=this.interior?'#100e15':this.waterColor;ctx.fillRect(0,0,this.cv.width,this.cv.height);
    ctx.imageSmoothingEnabled=false;
    const vw=this.cv.width/z,vh=this.cv.height/z;
    const ox=this.cam.x-vw/2,oy=this.cam.y-vh/2;
    /* **Auf ganze Gerätepixel rasten** (V8-S4). Georg: »die Sprites flackern in der Umgebung während
       der Bewegung« — und die Bewegung wirke träge. Gemessen war die Bildrate einwandfrei (Median
       8 ms, größtes Bild 18 ms, kein Bild über 20 ms), also kein Rechenproblem. Der Held stand bei
       x 10764,**05** und die Kamera auf demselben Wert: er ist stabil, die Welt landet auf
       Bruchteilen von Pixeln. Mit `imageSmoothingEnabled=false` greift Nearest dann jedes Bild andere
       Quellpixel — genau die »1- und 2-px-Streifen«, die `prop-sheet.js` schon für die Requisiten
       beschreibt. Das sieht wie Flackern aus und, weil es unregelmäßig ist, wie Ruckeln.
       Gerundet wird die **Verschiebung in Gerätepixeln**, nicht die Weltposition: die Physik bleibt
       stufenlos (Trittfrequenz, Kollision, A*), nur das Bild rastet. Kosten: die Kamera hinkt bis zu
       einem halben Gerätepixel nach — unsichtbar, gemessen 0,5 px bei dpr 2. */
    ctx.setTransform(z,0,0,z,Math.round(-ox*z),Math.round(-oy*z));
    const x0=Math.max(0,Math.floor(ox/TILE)-1),x1=Math.min(this.W-1,Math.ceil((ox+vw)/TILE)+1);
    const y0=Math.max(0,Math.floor(oy/TILE)-1),y1=Math.min(this.H-1,Math.ceil((oy+vh)/TILE)+1);
    let tiles=0;
    /* Innen gilt derselbe Ausschnitt, nur ein anderes Bild (V5-S8): der Dungeon liegt in denselben
       Feldern, also greifen Kamera, Zoom und Sortierung unverändert. */
    if(this.interior){
      this.stats.tiles=OW_DUNGEON.drawFloor(ctx,this.interior,x0,y0,x1,y1);
      OW_DUNGEON.drawTorches(ctx,this.interior,this.time);
    }else{
    this._t('schaum');
    const ff=this.foam,fi=this.img.foam;
    if(this.att.terrain!=='paint')for(const idx of this.foamTiles){
      const x=idx%this.W,y=(idx/this.W)|0;
      if(x<x0-2||x>x1+2||y<y0-2||y>y1+2)continue;
      const fr=Math.floor(this.time*10+(x*7+y*13))%ff.frames;
      const off=(ff.fw-TILE)/2;
      ctx.drawImage(fi,fr*ff.fw,0,ff.fw,fi.height,x*TILE-off,y*TILE-off,ff.fw,fi.height);
    }
    const land=this.land,Wd=this.W,Hd=this.H;
    /* V9-S1: `band` ist ein DRITTER Terrain-Modus, kein Ersatz. Er benutzt denselben Weg wie
       `paint` — Silhouette, Relief, Wasser und Küstentusche kommen weiter aus OW_TERRAIN — und
       legt die gemalte Fläche darauf. Wer den Boden ersetzt, baut Sandsaum, Schaum und
       Klippenfront nach, und zwei Implementierungen derselben Regel laufen auseinander (S13b). */
    const band=this.att.terrain==='band'&&window.OW_BAND&&window.OW_TERRAIN;
    const paint=(this.att.terrain==='paint'||band)&&window.OW_TERRAIN&&window.OW_GROUND;
    const sandM=(x,y)=>x<0||y<0||x>=Wd||y>=Hd?false:land[y*Wd+x]>=1;
    const grassM=(x,y)=>x<0||y<0||x>=Wd||y>=Hd?false:land[y*Wd+x]===2;
    const pathSet=this.paths;
    const pathM=(x,y)=>x<0||y<0||x>=Wd||y>=Hd?false:(land[y*Wd+x]===1||(!!pathSet&&pathSet.has(y*Wd+x)));
    if(paint){
      /* V6-S2: kein Kacheldurchlauf. Die Landform wird als Form gefüllt (OW_TERRAIN), die
         Tuschekante kommt nach den Zonen. Das Autotiling bleibt im Code — `terrain=tiles` ist
         weiter der Vergleichsmaßstab, und ein Vergleich, den man nicht mehr ziehen kann, ist keiner. */
      /* **Weit weg braucht keine Details** (V9-B6). Bei Zoom 0,4 liegt sechsmal so viel Welt im Bild
         wie bei Zoom 1 (gemessen: 1110 gegen 288 Felder Fläche) — und jede Schicht zahlt mit. Es gab
         keinen einzelnen Schuldigen: Fläche 10 fps, Tusche und Wasser je nichts, 40 gegen 60 fps.
         Also fällt weg, was man auf dieser Entfernung sowieso nicht sieht: das Relief der Küste
         (weiche Schatten auf einer Silhouette mit 6150 Punkten) und die Bodentextur.
         Das ist ein Regler, kein Eingriff in die Logik — wer wieder heranzoomt, bekommt alles zurück. */
      const nah=this.zoomEff()/this.dpr>=0.7;
      /* v10-S1: Wurfschatten und Bevel der Landform einzeln messbar — sie sind die zwei
         weichgezeichneten Vollbildfüllungen in dieser Kette, und `boden` ist die teuerste Schicht. */
      this.paintOpt={land,W:Wd,H:Hd,TILE,x0,y0,x1,y1,key:'w'+this.att.seed+'_'+Wd+'x'+Hd,
        /* v12-W1: das Fluid gehört in die Zeichenoptionen, weil das Glitzern seine Farbe daraus
           nimmt (eine Streufarbe je Fluid-Körper). `nah` steht mit hier, damit die Zoomschwelle
           EINE Zahl an EINEM Ort bleibt — der Wasserzweig liest sie unten wieder. */
        fluid:this.att.fluid||'wasser',nah,
        inkStyle:this.att.coastInk||'feather',shadows:!!this.dbg.tschatten,kurzweg:!!this.dbg.kurzweg,
        relief:(nah&&this.dbg.trelief)?(this.att.relief||'bevel'):'off'};
      // Die Federkette der Küste einen Schritt weiter (V6-S12) — vor dem Zeichnen, sonst hinkt
      // die Beule dem Kontakt einen Frame hinterher
      if(window.OW_RUBBER)this.stats.rubber=window.OW_RUBBER.step(this.dtLast||0.016);
      /* v12-W1 · DAS GLITZERN STAND HIER FALSCH. Es wurde vor dem Land gezeichnet — und die
         Fluid-Schicht des Waber-Shaders legt sich danach mit Deckung 0,82 auf dasselbe Wasser.
         Von jeder Glanzstelle blieben also 18 %. Das Wasser wirkte deshalb wie ein reines
         Wabern; nicht weil das Muster zu schwach war, sondern weil es UNTER seinem Material lag.
         Der Aufruf steht jetzt hinter der Fluid-Schicht (Suche: v12-W1 · Glitzern).
         Merksatz: *eine Schicht, die zugedeckt wird, ist keine Schicht — sie ist eine Rechnung.* */
      this._t('boden');
      this.stats.tiles=this.dbg.boden?OW_TERRAIN.draw(ctx,Object.assign({},this.paintOpt,{
        sand:OW_GROUND.tileFor('__sand',4,false,true),
        grass:OW_GROUND.tileFor(this.baseGround||'grass',11,false,true)})):0;
    }else{
    for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){
      const v=land[y*Wd+x];
      if(!v)continue;
      this.drawAuto(this.img.flat,this.sandBX,x,y,sandM);tiles++;
      if(v===2){this.drawAuto(this.img.flat,0,x,y,grassM);tiles++;}
      // Weg als dritte Schicht: derselbe Sand, dieselbe Autotile-Formel — nur eine andere Maske
      if(this.dbg.wege&&pathSet&&v===2&&pathSet.has(y*Wd+x)){this.drawAuto(this.img.flat,this.sandBX,x,y,pathM);tiles++;}
    }
    this.stats.tiles=tiles;
    }
    /* Bodenschicht (V6-S1): Grundton + Textur + Decals + Feldkanten, je Zone. Sie ERSETZT die flache
       Zonen-Tönung — die war ein Farbschleier über Gras, also genau das Problem, das Georg benannt
       hat: farbige Blöcke ohne Material. Gezeichnet wird nur über Zonenrechtecken, deshalb braucht
       es kein Clipping gegen das Wasser. */
    /* Zuerst die Basisinsel — sie ist der größte Teil des Bildes, und ohne sie liegt Material nur
       in den Zonen. Gegen das Wasser geclippt statt gerechnet: ein Pfad aus den sichtbaren
       Landfeldern, dann EIN fillRect. Gras und Sandsaum getrennt, weil die Erdtextur den Saum
       sonst schluckt. Zonenfelder bleiben frei — sie bekommen ihre eigene Palette gleich danach. */
    /* `inZone` gilt für Boden UND Pfützen — deshalb eine Ebene höher als der Boden-Zweig (V7-S4).
       Innerhalb des `if` deklariert wäre sie für die Pfützenschicht nicht sichtbar. */
    const zs=this.zones;
    const detail=this.zoomEff()/this.dpr>=0.7;   // V9-B6: Bodentextur nur in der Nähe
    const inZone=(x,y)=>{for(let i=0;i<zs.length;i++){const z=zs[i];
      if(x>=z.x&&x<z.x+z.w&&y>=z.y&&y<z.y+z.h)return true;}return false;};
    if(this.att.ground&&window.OW_GROUND&&!paint&&detail){
      const vr={x:ox-TILE,y:oy-TILE,w:vw+TILE*2,h:vh+TILE*2};
      for(const pass of [2,1]){
        ctx.save();ctx.beginPath();let any=false;
        for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){
          if(land[y*Wd+x]!==pass||inZone(x,y))continue;
          ctx.rect(x*TILE,y*TILE,TILE,TILE);any=true;
        }
        if(any){ctx.clip();
          OW_GROUND.draw(ctx,pass===2?(this.baseGround||'grass'):'__sand',vr,
            this.time,this.att.life,pass===2?11:4,'grain');}
        ctx.restore();
      }
    }
    /* V9-S1 — DAS BAND ÜBER DER LANDFORM.
       Zwei Durchgänge, weil Gras und Sandsaum verschiedene Gewichtungen führen: der Saum ist kein
       Biom, sondern eine Rolle, und er muss an jeder Küste derselbe bleiben. Zonenfelder bleiben
       frei — sie bekommen gleich darunter ihr eigenes Biom. Geclippt statt gerechnet: ein Pfad aus
       den sichtbaren Landfeldern, dann EIN drawImage je Durchgang.
       Der Boden ist die sichtbare Schicht, nie die spielende — Kollision bleibt beim `land[]`. */
    const bandVr=band?{x:ox-TILE,y:oy-TILE,w:vw+TILE*2,h:vh+TILE*2}:null;
    if(band&&this.att.ground&&detail){
      OW_BAND.keim(this.att.seed|0);
      const bBase=OW_BAND.biomFuer(this.baseGround||'grass');
      let fertig=true;
      for(const pass of [2,1]){
        ctx.save();ctx.beginPath();let any=false;
        for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){
          if(land[y*Wd+x]!==pass||inZone(x,y))continue;
          ctx.rect(x*TILE,y*TILE,TILE,TILE);any=true;
        }
        if(any){ctx.clip();
          if(!OW_BAND.floor(ctx,bandVr,pass===2?bBase:'__saum',this.time))fertig=false;}
        ctx.restore();
      }
      this.stats.band=(fertig?'':'backt ')+OW_BAND.stats.warteschlange+' | '+
        OW_BAND.stats.bakes+'x '+OW_BAND.stats.bakeMs+'ms';
    }
    this._t('zonen');
    for(const zo of (this.dbg.zonen?this.zones:[])){
      const rect={x:zo.x*TILE,y:zo.y*TILE,w:zo.w*TILE,h:zo.h*TILE};
      let painted=false;
      if(this.att.ground&&window.OW_GROUND){
        if(!zo.ground){
          const set=GROUND_OF[zo.biome]||GROUND_OF.camp;
          zo.ground=set[(zo.zseed>>>3)%set.length];
        }
        if(band){
          /* Gegen das Zonenrechteck clippen, aber den ANSCHNITT des Ausschnitts zeichnen: eine
             Zone kann größer sein als jede Zwischenfläche, und eine Fläche in Zonengröße wäre
             genau die Blockade, die das Backen vermeidet. */
          ctx.save();ctx.beginPath();ctx.rect(rect.x,rect.y,rect.w,rect.h);ctx.clip();
          OW_BAND.floor(ctx,bandVr,OW_BAND.biomFuer(zo.biome),this.time);
          ctx.restore();
          painted=true;
        }else painted=paint
          ? OW_TERRAIN.fillZone(ctx,OW_GROUND.tileFor(zo.ground,zo.zseed,false,true),this.paintOpt,rect,0.9)
          : OW_GROUND.draw(ctx,zo.ground,rect,this.time,this.att.life,zo.zseed);
      }
      if(!painted){ctx.fillStyle=zo.cleared?'rgba(255,255,255,.07)':zo.tint;ctx.fillRect(rect.x,rect.y,rect.w,rect.h);}
      else if(zo.cleared){ctx.fillStyle='rgba(255,255,255,.07)';ctx.fillRect(rect.x,rect.y,rect.w,rect.h);}
    }
    this._t('graben');
    /* v10-S2a · DER GRABEN ALS EIGENER BAUSTEIN. Nach dem Boden (er liegt darauf), vor der Tusche
       und allem Lebendigen. Ein Pfad je Zone, nicht 40 Kacheln — deshalb trägt er ein Feld Breite. */
    if(window.OW_GUTTER&&this.dbg.graben!==false&&this.zones.length)
      OW_GUTTER.draw(ctx,{zones:this.zones,TILE,time:this.time,fluid:this.att.fluid||'wasser',
        breite:1,x0,y0,x1,y1});
    this._t('zonenkarte');
    /* v10-S2b · DIE KARTE IN DER ZONE. Nach dem Graben (er ist die Kante), vor der Tusche und vor
       allem Lebendigen — die Karte liegt, sie klebt nicht. */
    if(this.dbg.karte)this.drawZoneCards(ctx,x0,y0,x1,y1);
    this._t('tusche');
    if(paint&&this.dbg.tusche){
      // Schaum ist aus (Georg 7.8.: »lieblos über die Landschaft geworfen«) — er kommt als
      // Federstrich wieder, nicht als weichgezeichnetes Band.
      OW_TERRAIN.drawInk(ctx,this.paintOpt);
    }
    this._t('karte');
    if(this.dbg.karte)this.drawReader(ctx);   // V9-B3: liegt auf dem Boden, unter der Deko und unter allem Lebendigen
    /* ── T2 · DER WABER-SHADER (Georg, 8.8.) ────────────────────────────────────────────────
       Der Skydome aus Travel v12, auf 2D portiert: `overworld/skyshade-2d.js`. Zwei Schichten,
       nicht sieben — **eine** Terrain-Palette je Bild und **eine** Fluid-Palette. Jede weitere
       Palette wäre ein weiteres Gitter, und sieben Gitter sind der Weg zurück in die Kosten, aus
       denen dieser Sprint gerade herausgeführt hat.

       Die Terrain-Palette kommt aus der Zone, in der der Held STEHT. Dadurch wandert die Stimmung
       mit ihm, statt je Fläche zu springen: eine Welt, die sich beim Reisen verfärbt, statt eines
       Flickenteppichs. Über Land liegt sie gedämpft (`overlay`, 0,16) — der Boden lebt, er wird
       nicht eingefärbt. Über Wasser liegt sie deckend, dort IST sie das Material. */
    this._t('shade');
    if(this.att.shade!=='off'&&this.dbg.shade&&window.OW_SHADE&&!this.interior&&!this._shadeTot){
      try{
      OW_SHADE.tick();
      const sr={x:ox-TILE,y:oy-TILE,w:vw+TILE*2,h:vh+TILE*2};
      const stark=this.att.shade==='stark';
      /* Die Terrain-Tönung läuft OHNE Kachel-Clip über den ganzen Ausschnitt. Ein Clip aus tausend
         Rechtecken kostet mehr als die Schicht selbst — und was hier auf das Wasser fällt, deckt
         die Fluid-Schicht gleich danach zu. Reihenfolge statt Maske. */
      const hx=Math.floor(this.hero.x/TILE),hy=Math.floor(this.hero.y/TILE);
      let pal='hof';
      for(const zo of this.zones)
        if(hx>=zo.x&&hx<zo.x+zo.w&&hy>=zo.y&&hy<zo.y+zo.h){
          const b=window.OW_BAND?OW_BAND.biomFuer(zo.biome):'hof';
          pal=(b==='wasser')?'wasserland':b; break;}
      /* Die Toenung liegt ueber Land UND Wasser; das Fluid deckt gleich danach zu, was auf das
         Wasser fiel. Reihenfolge statt Maske. */
      OW_SHADE.draw(ctx,sr,pal,this.time,stark?{alpha:0.30}:null);
      /* Das Fluid wird auf die KUESTENKONTUR geclippt, nicht auf Kachelrechtecke. Der erste Versuch
         nahm land[]-Felder — daraus wurden die harten Bloecke ueber der geglaetteten Kueste
         (Befund Georg, 8.8.). clipWater benutzt denselben Path2D wie der Wasserzweig selbst. */
      if(paint){
        ctx.save();
        if(OW_TERRAIN.clipWater(ctx,this.paintOpt))
          OW_SHADE.draw(ctx,sr,this.att.fluid||'wasser',this.time,{alpha:stark?1:0.82});
        ctx.restore();
      }
      /* Je Schicht ihre eigenen Zahlen. Vorher stand hier eine globale Zahl unter dem Namen der
         Terrain-Palette — und weil beide Schichten gestaffelt in verschiedenen Bildern rechnen,
         war das je Bild die Zahl der anderen Schicht (Befund 8.8.). */
      this.stats.shade=OW_SHADE.zeile(pal)+'  ·  '+
        (paint?OW_SHADE.zeile(this.att.fluid||'wasser'):'kein Fluid');
      }catch(e){
        /* Einmal melden, dann stillschweigend abschalten. Ein Fehler je Bild fuellt die Konsole und
           macht den echten Befund unfindbar. */
        this._shadeTot=true;
        this.stats.shade='AUS nach Fehler: '+e.message;
        console.warn('[shade] abgeschaltet, das Spiel laeuft weiter:',e);
      }
    }
    /* ── v12-W1 · Glitzern ─────────────────────────────────────────────────────────────────
       Streulicht liegt AUF dem Material, nicht darunter (siehe den Befund oben am Boden-Takt).
       **Die Zoomsperre ist weg** (v12-W1c): sie hing an `nah` (Zoom ≥ 0,7), und auf einem Gerät
       mit dpr 2 ist die Standardansicht 0,5 — das Wasser hat also nie geglitzert, in keiner
       Sitzung. Das Aliasing, gegen das die Sperre stand, löst jetzt `OW_WATER.glitzer` selbst:
       der Maßstab der Kachel hat eine Untergrenze, ein Quellpixel fällt nie unter 0,6
       Gerätepixel. Weiter weg wird das Muster größer und ruhiger, statt zu verschwinden. */
    this._t('wasser');
    if(this.dbg.wasser&&this.paintOpt&&window.OW_TERRAIN)
      OW_TERRAIN.drawWater(ctx,this.paintOpt,this.time);
    /* Pfützen als eigene Schicht (V7-S4, §31.2b) — über dem Boden, unter allem, was darauf steht.
       Hier und nicht im Sprite-Zweig: eine Pfütze hängt an der Senke, nicht an einem Asset. Nur auf
       Landfeldern, damit sie nicht auf dem Wasser liegen; die Zonenflächen bleiben frei, weil sie
       ihre eigene Palette führen. */
    this._t('pfuetzen');
    if(this.att.puddles!=='off'&&this.dbg.pfuetzen&&window.OW_PUDDLES){
      ctx.save();ctx.beginPath();let anyLand=false;
      for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){
        if(land[y*Wd+x]!==2||inZone(x,y))continue;
        ctx.rect(x*TILE,y*TILE,TILE,TILE);anyLand=true;
      }
      if(anyLand){ctx.clip();
        this.stats.puddles=OW_PUDDLES.draw(ctx,{x:ox-TILE,y:oy-TILE,w:vw+TILE*2,h:vh+TILE*2});}
      ctx.restore();
    }
    this.drawLootFloors(ctx);
    // Brücken
    this._t('bruecken');
    if(this.dbg.bruecken&&this.img.bridge)for(const[idx,horiz]of this.bridge){
      const x=idx%Wd,y=(idx/Wd)|0;
      if(x<x0-1||x>x1+1||y<y0-1||y>y1+1)continue;
      const sx=horiz?1*TILE:0,sy=horiz?0:2*TILE;
      /* v12-B1 · DIE BRÜCKE MUSS BEIDE PANEL-LINIEN ÜBERBRÜCKEN (Georg 12.8.). Sie war genau EIN
         Feld lang — so breit wie der Graben — und endete damit GENAU auf den zwei Tuschelinien,
         die auf seinen Kanten liegen. Ein Steg, der am Geländer aufhört, ist kein Übergang.
         Jetzt zwei Felder: eine halbe Kachel Anschluss auf jeder Seite, gezeichnet als ZWEI
         Kopien derselben Zelle (nicht als eine gedehnte — gedehnte Planken sind gedehnte Zeichnung).
         Das ist zugleich die Regel aus dem Ink-Slice: **eine schwarze Linie wird nie unterbrochen,
         nur überdeckt — die Holzbrücke ist die Tür.** */
      const dx=horiz?TILE:0,dy=horiz?0:TILE;
      ctx.drawImage(this.img.bridge,sx,sy,TILE,TILE,x*TILE-dx*0.5,y*TILE-dy*0.5,TILE,TILE);
      ctx.drawImage(this.img.bridge,sx,sy,TILE,TILE,x*TILE+dx*0.5,y*TILE+dy*0.5,TILE,TILE);
    }
    // Tusche-Brücke (Gutter Ethics) — pulsiert, solange sie hält
    if(this.img.bridge&&this.tempBridge.size)for(const[idx,b]of this.tempBridge){
      const x=idx%Wd,y=(idx/Wd)|0;
      if(x<x0||x>x1||y<y0||y>y1)continue;
      const left=Math.max(0,b.until-this.time);
      ctx.globalAlpha=left<1.4?0.35+0.45*Math.abs(Math.sin(this.time*9)):0.95;
      const sx=b.horiz?1*TILE:0,sy=b.horiz?0:2*TILE;
      ctx.drawImage(this.img.bridge,sx,sy,TILE,TILE,x*TILE,y*TILE,TILE,TILE);
      ctx.globalAlpha=1;
    }
    }
    // Klick-Marker
    if(this.moveTarget){
      const p=1-((this.time-this.moveTarget.t)%0.9)/0.9;
      ctx.strokeStyle=`rgba(255,255,255,${0.25+0.5*p})`;ctx.lineWidth=3;
      ctx.beginPath();ctx.ellipse(this.moveTarget.x,this.moveTarget.y,14*(1.6-p),7*(1.6-p),0,0,7);ctx.stroke();
    }
    if(this.attackTarget&&this.attackTarget.hp>0){
      ctx.strokeStyle='rgba(230,80,70,.85)';ctx.lineWidth=3;
      ctx.beginPath();ctx.ellipse(this.attackTarget.x,this.attackTarget.y+26,22,10,0,0,7);ctx.stroke();
    }
    // Leichen unter den Lebenden
    const ds=this.deadSheet;
    if(ds)for(const c of this.corpses){
      const row=c.v%Math.max(1,ds.rows.length);
      const n=Math.max(1,ds.rows[row]||1);
      const fr=Math.min(n-1,Math.floor(c.t*8));
      ctx.globalAlpha=Math.max(0,1-c.t/9);
      ctx.drawImage(ds.img,fr*ds.cell,row*ds.cell,ds.cell,ds.cell,
        c.x-ds.cell/2,c.y-ds.cell+10,ds.cell,ds.cell);
      ctx.globalAlpha=1;
    }
    // Sprites y-sortiert
    this._t('sprites');
    const h=this.hero;
    const view=[];
    for(const d of this.decos){
      if(d.x<ox-CELL||d.x>ox+vw+CELL||d.y<oy-CELL||d.y>oy+vh+CELL)continue;
      // v10-S1: Bauten (`town`) und Landschaftsdeko einzeln abschaltbar — sonst misst man beide
      if(d.town?!this.dbg.bauten:!this.dbg.deko)continue;
      view.push(d);
    }
    if(this.dbg.mobs)for(const m of this.mobs)if(m.hp>0)view.push({ent:m,x:m.x,y:m.y});
    view.push({ent:h,x:h.x,y:h.y});
    /* Der König steht OBEN auf dem Turm: er wird an seinem eigenen y gezeichnet (Krone), aber am
       Fußpunkt des Turms einsortiert — sonst verschwände er hinter der Mauer, auf der er steht. */
    if(this.king&&!this.interior)view.push({ent:this.king,x:this.king.x,y:this.king.sortY});
    view.sort((a,b)=>a.y-b.y||a.x-b.x); // stabiler Tiebreaker: sonst tauschen gleich hohe Sprites jeden Frame
    this.stats.view=view.length;         // gezeichnete Sprites im Bild — die Zahl, die zur Zeit gehört
    for(const d of view){
      if(d.ent){this.drawUnit(d.ent);continue;}
      const fw=d.fw,fh=d.fh||d.img.height,sy=d.sy||0,sx0=d.sx||0,sc=d.scale||1;
      // Fußpunkt gemessen, nicht geraten: Streifen mit leerem Rand unten schwebten sonst über allem,
      // was dahinter steht (Georgs Schaf auf der Tanne).
      if(d.pad===undefined){const b=OWL.probeBox(d.img,sx0,sy,fw,fh);d.pad=b?fh-b.bottom:0;}
      const fr=d.frames>1?Math.floor(this.time*8*d.anim)%d.frames:0;
      // scale zeichnet ein feineres Blatt groß (16er-Dungeon-Kachel auf 64er-Feld);
      // dy hebt ein Requisit über den Boden, ohne die Sortierung zu belügen (Laternen, Fahnen)
      const dw=fw*sc,dh=fh*sc;
      const bx=d.x-dw/2, by=d.y-dh+d.pad*sc+(d.dy||0);
      /* Kontaktschatten für Requisiten ohne gebackenen (V7-S1c/S3). Die Tiny-Swords-Deko bringt
         ihren mit (`deco1`: 41 halbtransparente, durchweg dunkle Pixel), Georgs Blatt auf
         ausdrücklichen Wunsch nicht — Punkt 1 des Re-Briefings. Seit S3 ist es keine Ellipse mehr,
         sondern die **gemessene Standfläche** des Sprites (`OW_CONTACT`), multipliziert statt grau
         übermalt. Die Zielbreite ist die Breite des GEZEICHNETEN Rahmens, nicht die des Körpers —
         das Profil muss mit demselben Faktor skalieren wie das Sprite. */
      if(d.src&&this.att.shadow!=='off'&&this.dbg.schatten){
        const D=d.def, wv=dw*(D?Math.abs(D.sx):1), fy=by+dh-d.pad*sc;
        const mass=0.9+(d.tall||0)*0.3;
        if(this.att.shadow==='contact'&&window.OW_CONTACT)
          OW_CONTACT.draw(ctx,d.x,fy,{img:d.img,sx:sx0,sy,w:fw,h:fh},{width:wv,mass});
        else if(window.OW_SHADOW)
          OW_SHADOW.draw(ctx,d.x,fy,wv,{mass});
      }
      if(d.def){
        /* Cartoon-Verformung je Instanz (V6-S13, §31.7). Der Anker ist der **Fußpunkt**, nicht die
           Bildmitte — sonst wandert das Ding beim Skalieren vom Boden weg, und genau dafür haben
           wir `pad` gemessen. Die Scherung wirkt über die Höhe: unten null, oben voll. */
        const D=d.def, footY=by+dh-d.pad*sc;
        ctx.save();
        ctx.translate(d.x,footY);
        ctx.rotate(D.rot);
        ctx.transform(D.sx,0,-D.skew,D.sy,0,0);
        ctx.drawImage(d.img,sx0+fr*fw,sy,fw,fh,-dw/2,by-footY,dw,dh);
        ctx.restore();
      }else{
        ctx.drawImage(d.img,sx0+fr*fw,sy,fw,fh,bx,by,dw,dh);
      }
    }
    /* v11-U2 · Fliegendes liegt ÜBER allem, was steht: es wird nach der Sortierliste gezeichnet,
       nicht in ihr. Ein Pfeil, der hinter einem Baum verschwindet, wäre richtiger — aber dann müsste
       jedes Geschoss in die Tiefensortierung, und ein Pfeil ist 0,4 Sekunden im Bild. */
    if(window.OW_SHOTS)OW_SHOTS.draw(this,ctx);
    // Peer Review: das begutachtete Ziel
    if(this.marked&&this.marked.mob.hp>0){
      const m=this.marked.mob;
      ctx.strokeStyle='rgba(110,160,255,.85)';ctx.lineWidth=2;ctx.setLineDash([6,5]);
      ctx.beginPath();ctx.ellipse(m.x,m.y,26,12,0,0,7);ctx.stroke();ctx.setLineDash([]);
      for(let i=0;i<this.marked.need;i++){
        ctx.fillStyle=i<this.marked.hits%this.marked.need?'#6ea0ff':'rgba(110,160,255,.28)';
        ctx.beginPath();ctx.arc(m.x-10+i*10,m.y+18,3.2,0,7);ctx.fill();
      }
    }
    this._t('vfx');
    // Mob-Stimmen: gelegt, bevor die Schadenszahlen kommen (Blasen weichen einander aus)
    /* Im Kampf schweigen sie (Georg 9.8., Standard `fightTalk` = off). Ein Wächter, der beim
       Zuschlagen eine Kartenzeile zitiert, nimmt dem Schlag die Zeit — und die Blase steht
       ausgerechnet dort, wo man hinsieht. Außerhalb des Kampfes reden sie weiter. */
    if(window.OW_BUBBLE){
      /* Zwei Uhren, zwei Blasenarten (ChatterBox S1 §4): die **bedienbare** endet mit dem Spieler,
         der **Schrei** endet nach seiner Zeit — er trägt keine Knöpfe, auf die man warten müsste. */
      if(this._shoutBis&&performance.now()>this._shoutBis){
        this._shoutBis=0;
        if(OW_BUBBLE.offen()&&OW_BUBBLE.unit()===this.hero)OW_BUBBLE.schliessen(this);
      }
      OW_BUBBLE.tick(this);
    }
    this.drawBlodsinn();
    const stumm=this.inFight&&this.att.fightTalk==='off';
    if(this.OWA&&this.OWA.drawBubbles&&!stumm)this.OWA.drawBubbles(this);
    // Schadenszahlen
    ctx.font='bold 17px "Courier New",monospace';ctx.textAlign='center';
    for(const fl of this.floaters){
      ctx.globalAlpha=Math.max(0,1-fl.t/1.1);
      ctx.fillStyle=fl.c;ctx.fillText(fl.txt,fl.x,fl.y);
      ctx.globalAlpha=1;
    }
    // Kayfabe spricht, bevor sie wirkt — und der Held ist sein eigener Ringsprecher
    if(this.bubble){
      const b=this.bubble,hb=h.unit?h.unit.bodyH:96,shout=b.style==='shout';
      ctx.font=(shout?'bold 17px':'13px')+' "Courier New",monospace';ctx.textAlign='center';
      const w=ctx.measureText(b.text).width+(shout?22:18),by=h.y-hb-34;
      ctx.globalAlpha=Math.min(1,(b.ttl-b.t)*3);
      ctx.fillStyle=shout?'#e8d38a':'rgba(240,236,222,.94)';
      ctx.fillRect(h.x-w/2,by-(shout?18:15),w,shout?26:22);
      ctx.beginPath();ctx.moveTo(h.x-6,by+(shout?8:7));ctx.lineTo(h.x+2,by+15);
      ctx.lineTo(h.x+6,by+(shout?8:7));ctx.fill();
      ctx.fillStyle='#1f1a14';ctx.fillText(b.text,h.x,by);
      ctx.globalAlpha=1;
    }
    // Treffer am Helden: Randblitz statt Ziffern (Zahlen am Helden bleiben klein und selten)
    if(this.hurt>0){
      ctx.setTransform(1,0,0,1,0,0);
      const g=ctx.createRadialGradient(this.cv.width/2,this.cv.height/2,
        Math.min(this.cv.width,this.cv.height)*0.35,this.cv.width/2,this.cv.height/2,
        Math.max(this.cv.width,this.cv.height)*0.62);
      g.addColorStop(0,'rgba(196,60,60,0)');
      g.addColorStop(1,'rgba(196,60,60,'+(0.5*Math.min(1,this.hurt/0.3)).toFixed(3)+')');
      ctx.fillStyle=g;ctx.fillRect(0,0,this.cv.width,this.cv.height);
    }
    if(this.overview)this.drawOverview(ox,oy,z);
    this._t(null);
  }
  /* ── v10-S2c · EINE EINHEIT SAGT EINE SACHE ───────────────────────────────────────
     Georgs Auftrag: Mini-Fluff-Bars, farbcodiert nach Haltung, plus `Lv` am Gegner — und die Zahl
     **weicht der Leiste**, sobald gekämpft oder verwundet wird.

     Drei Regeln, die daraus folgen:
     · **Wer nichts zu sagen hat, sagt nichts.** Voll und unbeteiligt heißt: kein Etikett. Vorher trug
       jede angeschlagene Einheit eine rote Leiste, und mehr nicht — man sah den Schaden, aber nicht,
       wer überhaupt feindlich ist.
     · **Die Farbe ist die Haltung, nicht der Rang.** Rot = greift an, Bernstein = hat mich bemerkt,
       Blassgrün = neutral, Grün = verbündet. Elite und Wächter bekommen eine breitere Leiste mit
       Kerbe, keine eigene Farbe: zwei Bedeutungen auf einem Kanal sind eine zu viel.
     · **Zahlen sind keine Beweisstücke** (Kanon). `Lv 5` ist eine Einschätzung, kein Punktestand —
       darum steht **keine** Ziffer neben der Leiste, und die Leiste trägt keine Prozente.
     Die Ablage ist dieselbe wie bei den Sprechblasen: die ankern auf `y-bh-30`, das Etikett sitzt auf
     `y-bh-16` — vierzehn Pixel Luft, also stapelt sich nichts über einem Kopf. */
  drawUnitTag(ctx,u,bh){
    if(u.hp<=0)return;
    /* v10-S12b · **Der Abstand steht an EINER Stelle.** Vorher gab der Aufrufer `bh+1` und diese
       Methode zog nochmal 16 ab — aus »1 px Luft« wurden 17. Jetzt bekommt sie die gemessene
       Tintenhöhe roh, und der Abstand entsteht hier: die **Unterkante des Blocks** (Leiste 7 px,
       Text bis +11) sitzt **1 px** über der Figur. Wer zwei Abstände addiert, hat keinen. */
    /* **12, nicht 11** — das tiefste gezeichnete Pixel gehört nicht der Leiste (y+7) und nicht der
       Kerbe (y+9), sondern dem Lv-Kasten: er beginnt bei `y−2` und ist 14 hoch, endet also bei
       `y+12`. Mit 11 berührte er im Ruhezustand exakt die Tinte (0 px Luft) — die Prüfung hat das
       an den Rechtecken gemessen, ich hatte es aus der Formel abgelesen.
       *Eine Blockhöhe, die man nicht am tiefsten Rechteck geprüft hat, ist geraten.* */
    const BLOCK=12, LUFT=1;
    const F=window.OW_FACTIONS;
    const fac=F?F.factionOf(this,u):null;
    const feind=!!(F&&fac&&F.hostile(this,fac));
    const freund=!!(F&&fac&&F.friendly(this,fac));
    const verwundet=u.hp<u.maxhp;
    const kampf=!!u.aggro;
    const gemerkt=!kampf&&!!(u.ai&&u.ai.notice>0.35);
    const held=u===this.hero;
    /* ── v11-H3 · **Die Stufe ist raus, die Leiste sagt es** (Georg 11.8.) ──────────────────────
       `Lv 3` stand hier, solange eine Einheit unversehrt war, und wich der Leiste beim ersten
       Treffer. Zwei Nachteile, die im Kampf zusammenfallen: die Auskunft **wechselt genau in dem
       Moment die Form**, in dem man hinsieht (man liest erst eine Ziffer, dann einen Balken, und
       muss beides übereinanderlegen) — und eine Stufe ist eine Zahl über eine Einheit, also genau
       das, was der Kanon nicht will. Der alte Kommentar sagte es selbst: *Zahlen sind keine
       Beweisstücke.* Die Stufe war die Ausnahme, die die Regel begründet.

       Jetzt EINE Form für alle: wer etwas zu sagen hat, trägt eine Fluffbar. Wer nichts zu sagen
       hat, trägt weiter nichts — die Regel bleibt, sie hat nur keinen Sonderfall mehr. */
    if(held){
      // Der Held zeigt sie im Kampf und wenn er etwas abbekommen hat — sonst verdeckt sie das Spiel
      if(!verwundet&&!this.inFight)return;
    }else if(!verwundet&&!kampf&&!gemerkt&&!(u.guard||u.elite))return;
    /* Die eigene Leiste sitzt vier Pixel höher als die der Gegner und trägt eine helle Naht.
       »Das gleiche Design, ein bisschen abgesetzt«: gleiche Höhe, gleiche Bauart, gleiche Kante —
       unterschieden wird über die FÜLLUNG (der Fluff-Verlauf des HUD statt einer Haltungsfarbe) und
       über die Höhe. Zwei Kanäle für »das bin ich«, keiner davon ein neues Material. */
    const y=u.y-bh-LUFT-BLOCK-(held?4:0);
    const w=held?58:u.elite?56:u.guard?50:42;
    const t=Math.max(0,Math.min(1,u.hp/u.maxhp));
    /* ── v11-H7 · Draußen die PIXEL-Outline, drinnen die Feder (Georg 11.8.) ──────────────────
       Im HUD zieht die Kanon-Feder die Kante, weil der Balken dort auf Papier liegt. Hier draußen
       liegt er über Gras, Sand und Sprites — und eine gezogene Tuschekante mit weichen Rändern
       verschwindet darin. Deshalb ein harter, deckender Rahmen von einem Pixel: er ist zu allem
       lesbar, was darunter liegen kann. Georgs Satz dazu: »außerhalb des HUD können wir die
       Pixel-Outline nehmen, das ist besser lesbar.« Zwei Materialien, zwei Orte, EIN Grund. */
    ctx.fillStyle='rgba(10,13,11,.95)';
    ctx.fillRect(u.x-w/2,y,w,7);
    /* Die eigene Leiste färbt sich nach dem STAND (grün → gelb → orange → rot, OW_FEEL.fluffColor,
       dieselbe Funktion wie im HUD). Die der Gegner färbt sich nach der HALTUNG — das ist keine
       Inkonsequenz, sondern die Trennung aus v10-S2c: bei mir will ich wissen, wie es mir geht;
       beim Gegner, was er vorhat. Seine Länge sagt schon, wie weit er ist. */
    if(held){
      ctx.fillStyle=(window.OW_FEEL&&OW_FEEL.fluffColor)?OW_FEEL.fluffColor(t):'#5fbf7a';
    }else ctx.fillStyle=freund?'#5fbf7a':kampf?'#d8452f':gemerkt?'#e0a12c':
      (u.critter&&!feind)?'#a9c48f':'#c43c3c';
    ctx.fillRect(u.x-w/2+1,y+1,(w-2)*t,5);
    // Ein Pixel Glanz an der Oberkante der Füllung — die »leichte Spiegelung«, so weit sie auf
    // fünf Pixel Höhe geht. Mehr wäre bei dieser Größe Rauschen.
    if((w-2)*t>2){
      ctx.fillStyle='rgba(255,255,255,.26)';
      ctx.fillRect(u.x-w/2+1,y+1,(w-2)*t,1);
    }
    /* Der Wächter trägt eine Kerbe statt eines zweiten Farbtons: an ihm hängt die Karte, und das
       muss man auch im Handgemenge sehen. */
    if(!held&&(u.guard||u.elite)){
      ctx.fillStyle='rgba(244,236,214,.9)';
      ctx.fillRect(u.x-w/2+Math.round((w-2)*0.5),y-2,2,11);
    }
  }
  /* Ein Zeichenweg für alle Einheiten — der Renderer weiß nicht mehr, aus welchem Sheet-Format
     die Figur kommt. Fußpunkt liegt auf u.y (Anker aus dem Loader gemessen). */
  /* ── v10-S2d · DER WÄCHTER ──────────────────────────────────────────────────────
     Der Aschekranz: kein Partikelsystem, sondern zwölf Flocken auf einem gesäten Ring. Sie steigen,
     werden kleiner und verlieren Deckkraft — mehr braucht ein Rauchkranz nicht, und er kostet zwölf
     `fillRect` statt eines Puffers über 2000 Stück.
     Gezeichnet UNTER der Figur (vor dem Sprite): sie steigt heraus, der Rauch bleibt am Boden. */
  drawAshes(ctx,u){
    if(u.rise==null||u.rise>=1.35)return;
    const p=Math.max(0,Math.min(1.35,u.rise));
    const s=(this.att.seed|0)+((u.x|0)*7)+((u.y|0)*13);
    for(let i=0;i<12;i++){
      const r0=rand2(i*5+1,i*3+2,s), r1=rand2(i*7+4,i*2+9,s);
      const t=Math.max(0,Math.min(1,(p-r0*0.35)/0.75));
      if(t<=0||t>=1)continue;
      const a=(i/12)*6.2832+r1*0.5;
      const rad=16+r0*26+t*22;
      const x=u.x+Math.cos(a)*rad*0.9;
      const y=u.y-t*(34+r1*40)-4;
      const sz=Math.max(1,(3.4+r0*3)*(1-t*0.7));
      ctx.globalAlpha=Math.min(1,(1-t)*0.85);
      ctx.fillStyle=t<0.45?'#4a4038':'#8b8175';
      ctx.fillRect(x-sz/2,y-sz/2,sz,sz);
    }
    // Glut am Boden: der Fleck, aus dem sie kommt — er verschwindet zuletzt
    ctx.globalAlpha=Math.max(0,0.5*(1-p/1.35));
    ctx.fillStyle='#c2521c';
    ctx.beginPath();ctx.ellipse(u.x,u.y,20,7,0,0,7);ctx.fill();
    ctx.globalAlpha=1;
  }
  /* Ein Wächter kommt zurück, aber nicht dort, wo er lag: die Karte hätte sonst eine Todesstelle,
     die man auswendig lernt. Zufälliger Punkt im Zonenrechteck, begehbar geprüft. */
  reviveGuard(m){
    const z=m.zone;if(!z)return;
    let px=m.hx,py=m.hy;
    for(let k=0;k<24;k++){
      const tx=z.x+1+Math.floor(rand2(k*3+1,k*5+2,(this.att.seed|0)+k)*(z.w-2));
      const ty=z.y+1+Math.floor(rand2(k*7+4,k*2+9,(this.att.seed|0)+k*3)*(z.h-2));
      if(this.walk(tx,ty)&&Math.hypot((tx+0.5)*TILE-this.hero.x,(ty+0.5)*TILE-this.hero.y)>150){
        px=(tx+0.5)*TILE;py=(ty+0.5)*TILE;break;
      }
    }
    m.x=px;m.y=py;m.hx=px;m.hy=py;
    m.hp=m.maxhp;m.state='idle';m.anim=0;m.aggro=false;m.frozen=0;m.atkT=0;
    m.rise=0;m.deadAt=null;
    if(m.ai){m.ai.notice=0;m.ai.st='pause';m.ai.t=0;m.ai.tgt=null;m.ai.vx=0;m.ai.vy=0;}
    z.alive++;
    if(this.audio)this.audio.sfx('card',{gain:0.3});
    console.log('[guard] »'+(m.unit&&m.unit.name)+'« erhebt sich · Feld',
      Math.round(px/TILE)+','+Math.round(py/TILE));
  }
  drawUnit(u){
    const ctx=this.ctx,un=u.unit;
    if(!un)return;
    const isHero=u===this.hero;
    if(isHero&&this._blod&&this._blod.hide)return;   // v10-S5: das Blinken vor dem Flug
    const key=u.state==='attack'?(u.atkKey||'idle')
      /* v10-S2d: die **Warnhaltung**. Nur vier Einheiten im Katalog haben einen echten `guard`-Clip
         (minotaur · skull · panda · turtle) — wer keinen hat, steht eben ruhig da. Auf »läuft« gaten,
         nicht auf »existiert«: `un.has` fragt das Blatt, nicht eine Liste, die veraltet. */
      :(u.state==='guard'?(un.has('guard')?'guard':'idle'):un.pick(u.state,u.dir,0));
    const a=un.anim(key);
    const fr=u.state==='attack'
      ?Math.min(a.frames-1,Math.floor(u.atkT*a.fps))
      :Math.floor(u.anim)%a.frames;
    const s=un.scale*(u.sizeMul||1),bh=un.bodyH*(u.sizeMul||1);
    if(u.elite){
      ctx.strokeStyle='rgba(232,211,138,.5)';ctx.lineWidth=2;
      ctx.beginPath();ctx.ellipse(u.x,u.y,21,9,0,0,7);ctx.stroke();
    }
    if(u.frozen>0){ // „…" — das Publikum wartet auf die Pointe
      ctx.font='bold 22px "Courier New",monospace';ctx.textAlign='center';
      ctx.fillStyle='rgba(232,211,138,'+Math.min(1,u.frozen*2).toFixed(2)+')';
      ctx.fillText('…',u.x,u.y-un.bodyH*(u.sizeMul||1)-24);
    }
    /* Bodenkontakt (V5-S4, §21): Tiny-Swords-Blätter bringen den Schatten gebacken mit, fremde
       Blätter (FrizzleBob, die drei Helden) nicht — gemessen im unit-loader, nicht angenommen.
       Gezeichnet wird VOR dem Sprite und an der PHYSIK (u.z/u.press), nie an der Verformung.
       Seit V7-S3 aus der gemessenen Standfläche des Idle-Frames statt als Ellipse: EIN Frame für
       die ganze Figur, damit der Schatten nicht je Laufbild seine Form wechselt. */
    const SH=window.OW_SHADOW;
    /* v10-S8 · **Der Schatten bleibt auf dem Blatt.** Eine Einheit darf die Tuschelinie überlappen
       (sie steht ja davor), aber ihr Bodenkontakt gehört auf den Untergrund, auf dem sie steht —
       ein Schatten, der über die Kante ins Wasser läuft, klebt die Figur an die falsche Ebene.
       Geklippt wird auf das gemerkte Blatt der Zone, nicht auf das Zonenrechteck: die Feder ist
       seit v10-S8 die Kante. */
    const platte=(u.zone&&u.zone._plate)||null;
    if(un.shadow==='ellipse'&&this.att.shadow!=='off'&&this.dbg.schatten){
      const ia=un.anim('idle');
      const o={z:u.z||0,press:u.press||0,mass:un.def&&un.def.sizeRel||1};
      if(this.att.shadow==='contact'&&window.OW_CONTACT&&ia)
        OW_CONTACT.draw(ctx,u.x,u.y,{img:ia.img,sx:ia.sx||0,sy:ia.sy||0,w:ia.fw,h:ia.fh},
          Object.assign({width:ia.fw*s},o));
      else if(SH)
        SH.draw(ctx,u.x,u.y,(un.bodyW||bh*0.6)*(u.sizeMul||1),o);
    }
    /* v10-S8 · Etikett und Leiste stehen über dem **gezeichneten Rahmen**, nicht über dem Körper.
       `bodyH` misst den Rumpf; ein erhobenes Schwert oder Ohren ragen darüber hinaus, und genau
       dort saß die Leiste im Bild (Georg: 1 px Sicherheitsabstand). `anchorY` ist der gemessene
       Abstand Fußpunkt→Rahmenoberkante — die ehrliche Oberkante der Figur. */
    /* v10-S12 · Das Etikett stand zu hoch. `anchorY*s` ist die **Rahmen**höhe — Tiny-Swords-Blätter
       haben Leerraum über dem Kopf, also schwebte die Marke. `bodyH` ist die **gemessene
       Tintenhöhe** (probeBox über alle nicht-transparenten Pixel, inklusive erhobenem Schwert):
       das ist die Oberkante, die man sieht. Plus 1 px Luft, wie Georg es wollte. */
    /* v10-S22 · **Der Haken für die Lulls-Skins** (WS0-Befund 10.8.: »wer ruft draw()?«).
       Der Zeichenpfad gehört dem Runner, also gehört der Haken hierher — sonst müsste WS0 im Runner
       eingreifen, und genau das schließen beide Hausregeln aus.
       Er sitzt **nach** der Einheit und **vor** dem Etikett: ein Skin liegt über der Figur, aber
       unter ihrer Beschriftung. Zwei Uhren, wie WS0 richtig anmerkt: `dt` für das Schweben (es
       schwebt auch im Stand), `moved` für alles, was am Laufen hängt. */
    if(window.OW_SKINS&&u.skin){
      const mv=(u.ai&&u.ai.moved)||(isHero?(this._heroMoved||0):0);
      try{OW_SKINS.draw(ctx,u.skin,u,this._dtLast||0.016,mv);}catch(e){
        if(!this._skinWarn){this._skinWarn=true;console.warn('[skins] draw() wirft:',e.message);}}
    }
    this.drawUnitTag(ctx,u,bh);   // v11-H3: auch der Held — die Methode entscheidet, wann
    if(u.rise!=null&&u.rise<1.35)this.drawAshes(ctx,u);
    const M=window.OW_MOTION;
    if(M)M.drawAccent(ctx,u,bh);
    ctx.save();
    /* v10-S8c · **Der gebackene Schatten gehört auf das Blatt, der Körper darf darüber hinaus.**
       Die Tiny-Swords-Blätter bringen ihre Auflage **im Sprite** mit (`shadow:'baked'`, gemessen bei
       allen 24 Einheiten und beim Helden) — der erste Anlauf klippte den `ellipse`-Zweig, und der
       läuft hier nie. Also ein Clip um die Zeichnung selbst, in **Weltkoordinaten**, aus zwei
       Rechtecken: das Blatt der Zone **plus** alles oberhalb der Fußlinie. Damit ist der Körper frei
       (er soll die Feder überlappen), aber alles ab dem Fußpunkt abwärts — und das ist die
       Auflage — endet an der Kartenkante. */
    /* **Nur wer AUF dem Blatt steht, wird geklippt.** Vorher galt ein Umkreis von 96 px — eine
       Einheit direkt neben der Karte verlor damit ihre gebackene Auflage und **schwebte**
       (Georgs Befund). Der Fußpunkt entscheidet, nicht die Nähe: steht er auf dem Blatt, bleibt der
       Schatten drauf; steht er daneben, gehört der Schatten dem Boden, auf dem die Figur steht. */
    if(platte&&u.x>=platte.x&&u.x<=platte.x+platte.w&&
       u.y>=platte.y&&u.y<=platte.y+platte.h){
      const oberhalb=u.y-2;
      ctx.beginPath();
      ctx.rect(platte.x,platte.y,platte.w,platte.h);
      ctx.rect(u.x-4096,oberhalb-8192,8192,8192);
      ctx.clip();
    }
    ctx.translate(u.x,u.y);
    if(M)M.applyTransform(ctx,u);   // §17.1: Verformung NUR im Bild, der Fußpunkt ist der Ursprung
    /* **Aus der Asche** (v10-S2d). Es gibt kein Rise-Sprite — in keinem der 20 Blätter. Also wird
       nicht eingeblendet (das sähe aus wie ein Fehler im Bild), sondern **beschnitten**: die
       Bodenlinie läuft über 0,9 s nach oben, die Figur schiebt sich heraus. Dazu ein Stauchen, das
       beim Auftauchen ausläuft — die letzten Zentimeter kostet Kraft.
       Der Clip sitzt NACH `applyTransform`, damit die Erdkante am Fußpunkt bleibt und nicht mit der
       Verformung wandert. */
    if(u.rise!=null&&u.rise<1){
      const p=Math.max(0,u.rise);
      const hoch=bh*1.25;
      ctx.beginPath();ctx.rect(-hoch,-hoch*p,hoch*2,hoch*p+4);ctx.clip();
      const q=1+0.22*(1-p)*(1-p);      // gestaucht, während sie noch im Boden steckt
      ctx.scale(1/Math.sqrt(q),q);
    }
    if(u.face*(un.faceSign||1)<0)ctx.scale(-1,1); // Sheets, die nach links zeigen, drehen anders
    if(u.flash>0)ctx.filter='brightness(1.9)';
    ctx.drawImage(a.img,(a.sx||0)+fr*a.fw,a.sy,a.fw,a.fh,-a.anchorX*s,-a.anchorY*s,a.fw*s,a.fh*s);
    ctx.restore();
    ctx.filter='none';
  }
}
customElements.define('overworld-game',OverworldGame);
})();
