/* KFB Overworld — HUD v7 „Tisch & Hand"
   ────────────────────────────────────────────────────────────────────────────────
   DAS KONZEPT, in einem Satz: Du sitzt am KFB-Tisch. Der Rand des Bildschirms ist
   dein Tischmöbel, die Mitte gehört der Geschichte.

     oben links   DEIN BLATT      Wappen · Name · Fluff als durchgehender Verlauf
     oben rechts  DER KOMPASS     runde Karte, bündig in die Ecke, Peilring mit
                                  EINEM Zielpfeil + Zielname darunter
     oben mitte   DIE BÜHNE       Zonen-Banner. Hier liegt nie ein Widget.
     unten mitte  DEINE HAND      sechs KARTEN, gefächert. Karte spielen = Karte fliegt.
     unten links  DAS LOGBUCH     Papierstreifen. Loot, Story, Treffer. KEINE Eingabe —
                                  es gibt keinen Multiplayer, also gibt es keinen Chat.
     unten rechts DEIN DECK       ein Stapel, der mit jeder Fundkarte dicker wird.
                                  Das Zahnrad wohnt daneben, nicht oben.

   WARUM v6 NICHT FUNKTIONIERT HAT (und was hier anders ist):
     · Helle Tuschekante auf dunklem Grund — Tusche IST dunkel. Hier: PAPIER als Grund,
       schwarze Blockkante (kfb-ink-canon, Preset `card`, Kanonfarbe #1f1a14).
     · Würfel als Slots — KFB ist ein KARTENspiel. Die Hand sind Karten.
     · Almanach ohne Bild — jetzt ein Stapel mit sichtbarer Dicke.
     · Segmentierte HP-Balken — jetzt ein Verlauf rot→gold→grün, der beim Sinken
       durch die warmen Töne läuft. Man SIEHT den Zustand, ohne zu lesen.
     · „0 / 10" in 9 px auf Dunkelbraun — Zahlen stehen jetzt in Tusche auf Papier.

   ZWEI SCHRIFTREGISTER: Shantell Sans = du und das UI · Special Elite = alles, was
   Karte oder Buch IST. Nie vermischt.

   VERTRAG ZUM SPIEL (unverändert gegenüber v6, damit WS1 tauschen kann):
     rein  game.hero · game.zones · game.collected · game.curZone · game.captions · game.deck
     raus  CustomEvents slotUsed · openWindow · configChanged
   ──────────────────────────────────────────────────────────────────────────────── */
(function(){
'use strict';
const SRC=(document.currentScript&&document.currentScript.src)||location.href;
const RAWROOT='https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/';
const PA=()=>window.KFB_PAPER;
const LS='kfb.hud.v7.cfg';

/* Die Palette. Papier und Tusche, sonst nichts Neues. */
const PAPER='#efe2c4', PAPER_HI='#f7eed8', PAPER_LO='#d8c69c', INKC='#1f1a14';

let INK=null,inkTry=null,INK_OPT=false;
/* **Der Kanon wird lokal zuerst gesucht — und auf Fähigkeit geprüft, nicht auf Existenz** (V8-S4d).
   Am 8.8. teuer gelernt: die Änderung an `cardbuilder/kfb-ink-canon.js` lag lokal, geladen wurde die
   Repo-Fassung von pages.dev — und der Changelog behauptete trotzdem, `edgeJitter` wirke. Ein
   `drawInk` ohne 8. Argument verwirft `opt` **stillschweigend**: kein Fehler, kein Hinweis, nur die
   alte Kante. Genau die Fehlerklasse, die dieselbe Sitzung als Falle #1 aufgeschrieben hat.
   Deshalb: erst die lokale Datei, und danach die Signatur prüfen. Wer `opt` nicht kann, wird als
   solcher behandelt und sagt es. */
const INK_NEEDS_OPT=8;   // drawInk(preset,g,pts,W,H,seed,gain,opt)
function loadInk(){
  if(inkTry)return inkTry;
  inkTry=(async()=>{
    const R=(p,n,r)=>(window.OW_SRC&&OW_SRC.rel)?OW_SRC.rel(p,n,r):p;
    const tries=[
      R('../cardbuilder/kfb-ink-canon.js',SRC,'cardbuilder/kfb-ink-canon.js'),
      R('./cardbuilder/kfb-ink-canon.js',location.href,'cardbuilder/kfb-ink-canon.js'),
      RAWROOT+'skills/kfb-ink-canon.js',
      'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/skills/kfb-ink-canon.js'];
    for(const u of tries){
      let m=null;try{m=await import(u);}catch(e){continue;}
      if(!m||typeof m.drawInk!=='function')continue;
      const canOpt=m.drawInk.length>=INK_NEEDS_OPT;
      if(!canOpt&&u!==tries[tries.length-1]){
        console.warn('[hud-v7] Kanon ohne opt-Argument ('+m.drawInk.length+' Parameter):',u,
          '— suche weiter nach einer Fassung mit edgeJitter/edgeGain');
        INK=m;INK_OPT=false;continue;   // merken, aber weitersuchen
      }
      /* **Der Merker liegt hier, nicht am Modul.** Erste Fassung schrieb `INK.__canOpt` — ein
         ES-Modul-Namensraum ist eingefroren, also flog eine »read-only«-Ausnahme, `loadInk()` wurde
         abgewiesen, und gezeichnet wurde stillschweigend wieder ohne Optionen. Der Versuch, die
         Fähigkeit zu merken, hat sie ausgeschaltet. */
      INK=m;INK_OPT=canOpt;
      console.log('[hud-v7] Kanon:',u.replace(/^.*\//,''),'· opt',canOpt?'ja':'NEIN — die '+
        'Schattenachse bleibt ungestreut, bis das Repo die Fassung mit opt trägt');
      return INK;
    }
    if(INK)return INK;
    console.warn('[hud-v7] kfb-ink-canon nicht erreichbar — Ersatzkante');
    INK=false;return INK;
  })();
  return inkTry;
}

const FALLBACK={
  version:'hud-v7.0',ambient:true,
  colors:{fluff:'#c8622a',kayfabe:'#7b3fa8',bizarro:'#1b8476',sig:'#a83a2b',utility:'#7a6844'},
  moods:{heroic:'#c8622a',cynic:'#7b3fa8',absurd:'#1b8476'},
  biomeMood:{camp:'heroic',wilds:'absurd',cave:'cynic'},
  slots:[
    {id:'fluff',label:'Fluff',key:'1',color:'fluff',action:'kayfabe',arg:0},
    {id:'kayfabe',label:'Kayfabe',key:'2',color:'kayfabe',action:'kayfabe',arg:1},
    {id:'bizarro',label:'Bizarro',key:'3',color:'bizarro',action:'kayfabe',arg:2},
    {id:'signature',label:'Signature',key:'4',color:'sig',action:'signature',arg:null},
    {id:'map',label:'Island',key:'5',color:'utility',action:'window',arg:'overview'},
    {id:'diary',label:'Diary',key:'6',color:'utility',action:'window',arg:'diary'},
  ],
};
async function loadCfg(){
  let cfg=JSON.parse(JSON.stringify(FALLBACK));
  try{
    const u=(window.OW_SRC&&OW_SRC.rel)?OW_SRC.rel('./hud-slots.json',SRC,'overworld/hud-slots.json'):null;
    const r=await fetch(u||new URL('./hud-slots.json',SRC).href,{cache:'no-cache'});
    if(r.ok){const j=await r.json();delete j.skin;delete j.colors;cfg=Object.assign(cfg,j);}
  }catch(e){}
  try{const s=localStorage.getItem(LS);if(s)cfg=Object.assign(cfg,JSON.parse(s));}catch(e){}
  return cfg;
}

const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);

function fonts(){
  if(document.getElementById('ow7-fonts'))return;
  const l=document.createElement('link');l.id='ow7-fonts';l.rel='stylesheet';
  l.href='https://fonts.googleapis.com/css2?family=Shantell+Sans:wght@400;600;700'
        +'&family=Special+Elite&display=swap';
  document.head.appendChild(l);
}

const CSS=`
:host{--stat-fluff:#c8622a;--stat-kayfabe:#7b3fa8;--stat-bizarro:#1b8476}
.left{display:none!important}
.mini{background:rgba(24,19,13,.55);border-radius:22px}

.v7{position:absolute;inset:0;z-index:6;pointer-events:none;
  font-family:'Shantell Sans',ui-rounded,system-ui,sans-serif;
  --paper:${PAPER};--paperHi:${PAPER_HI};--paperLo:${PAPER_LO};--ink:${INKC};
  --pad:clamp(8px,1vw,13px);--rowH:86px;--cw:clamp(84px,9.4vw,116px);--ch:calc(var(--cw) / 1.42);
  color:var(--ink);font-size:clamp(11px,1.02vw,13px);line-height:1.3}
.v7 *{box-sizing:border-box}
.v7 .pe{pointer-events:auto}
.v7 canvas{position:static;inset:auto;width:auto;height:auto}
canvas.ow7ink{position:absolute!important;inset:0!important;pointer-events:none;z-index:0}
.v7 .ct{position:relative;z-index:1}
.v7 img.px{image-rendering:pixelated;display:block}
.v7 .ttl{font-family:'Special Elite',ui-monospace,monospace}

/* Ambient: das Möbel ruht, bis man hinsieht oder etwas passiert. */
.v7 .amb{opacity:.68;transition:opacity .22s ease,transform .22s ease}
.v7.lean .v7-log,.v7.lean .v7-story,.v7.lean .v7-nav .tgt,.v7.lean .pill{display:none}
.v7.lean .amb,.v7.lean .v7-card{opacity:.42}
.v7.lean .amb:hover,.v7.lean .v7-card:hover,.v7.lean .v7-hand:hover .v7-card{opacity:1}
.v7.ambOff .amb{opacity:1}
.v7 .amb:hover,.v7 .amb:focus-within,.v7 .amb.awake{opacity:1}

/* ══ OBEN LINKS — dein Blatt ══════════════════════════════════════════════════
   Drei beschriftete Zeilen, sonst nichts. Kein Wappen (das kostet Platz und sagt
   nichts), kein Einheitenname (»Warrior Blue« ist Dateiname, nicht Figur).
   Die drei Borromean-Werte stehen NICHT hier: sie ändern sich nur beim Aufstieg
   und wohnen im Charakterblatt. Das HUD zeigt, was sich JETZT bewegt. */
.v7-hero{position:absolute;left:var(--pad);top:var(--pad);cursor:pointer;
  min-width:min(214px,40vw);max-width:min(252px,44vw)}
.v7-hero .ct{display:flex;flex-direction:column;justify-content:center;padding:12px 16px}
.v7-hero .who{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:8px 11px}
/* WS1-Eingriff 9.8.: Raster statt Reihe — sechs Werte in 214 px brauchen zwei Zeilen à drei. */
.v7-hero .duo{grid-column:1/-1;display:grid;grid-template-columns:repeat(3,1fr);
  gap:3px 8px;align-items:baseline;margin-top:3px}
.v7-hero .claim{grid-column:1/-1;display:none;align-items:center;gap:7px;margin-top:8px;
  padding:6px 9px;border-radius:4px;background:#d8b45f;color:#241d15;cursor:pointer;
  box-shadow:0 0 0 2px var(--ink);animation:ow7claim 1.9s ease-in-out infinite}
.v7-hero .claim.on{display:flex}
.v7-hero .claim b{font-size:14px;font-weight:700;line-height:1;font-variant-numeric:tabular-nums}
.v7-hero .claim span{font-size:10.5px;font-weight:600;letter-spacing:.02em}
.v7-hero .claim i{margin-left:auto;font-style:normal;font-size:12px}
@keyframes ow7claim{0%,100%{box-shadow:0 0 0 2px var(--ink)}
  50%{box-shadow:0 0 0 2px var(--ink),0 0 11px rgba(216,180,95,.85)}}
.v7-hero .duo > span{display:flex;gap:5px;align-items:baseline}
/* WS1-Eingriff 10.8. · **Das Kürzel wird nicht mehr umgeschrieben.** Die Regel ».v7-hero .lab« setzt
   Versalien (richtig für FLUFF, POP und die Navigationsetiketten) — hier war es eine zweite Wahrheit
   über demselben String: im Feld stand »Blö«, im Bild stand »BLÖ«. Das Kürzel ist gesetzter Text aus
   STAT_INFO[k].short, also gilt es, wie es dasteht. Nur die sechs Werte im »duo«-Raster, nicht die
   übrigen Etiketten. Gemischt gesetzt ist es schmaler als in Versalien — die Reihe wird dadurch
   nicht weiter.
   **Und die Falle, die das gekostet hat:** dieses Blatt IST ein Template-Literal (const CSS = …).
   Ein Backtick im Kommentar beendet den String, und das nächste Wort wird zu Code. Deshalb stehen
   Codenamen hier in deutschen Anführungszeichen, nie in Backticks. */
.v7-hero .duo .lab{text-transform:none;letter-spacing:.06em;font-size:9.5px}
.v7-hero .duo b{font-size:14px;font-weight:700;line-height:1;color:var(--sc);
  font-variant-numeric:tabular-nums}
.v7 .mod{font-family:'Special Elite',ui-monospace,monospace;font-size:10px;margin-left:4px}
.v7 .mod.up{color:#4f9440}
.v7 .mod.dn{color:#9e2b1c}
.v7-hero .lab{font-size:9px;letter-spacing:.13em;text-transform:uppercase;color:#6d5c3e;
  white-space:nowrap;font-weight:700}
.v7-hero .val{font-size:15px;font-weight:700;line-height:1;white-space:nowrap;
  color:#241d15;justify-self:end;font-variant-numeric:tabular-nums}

/* Der Verlauf: die Spur bleibt stehen, die Füllung wandert. Bei wenig Fluff sieht man
   Rot, weil Rot am Anfang des Verlaufs liegt — kein zweiter Zustand, nur Geometrie. */
.v7 .bar{position:relative;height:10px;background:rgba(31,26,20,.14);overflow:hidden;
  box-shadow:inset 0 0 0 1.5px var(--ink);border-radius:5px}
.v7 .bar>i{position:absolute;left:0;top:0;bottom:0;overflow:hidden;
  transition:width .3s cubic-bezier(.2,.8,.3,1)}
.v7 .bar>i>b{position:absolute;left:0;top:0;bottom:0;width:var(--track,180px);border-radius:5px}
.v7 .bar.hp>i>b{background:linear-gradient(90deg,#9e2b1c 0%,#cc5b1f 26%,#dda32c 52%,#8fae35 78%,#4f9440 100%)}

.v7 .bar.xp>i>b{background:linear-gradient(90deg,#4a2d6b,#8a55c4)}
.v7-hero .chg{display:flex;gap:4px;align-items:center}
.v7-hero .chg i{width:9px;height:9px;border-radius:50%;background:transparent;
  box-shadow:inset 0 0 0 1.5px rgba(31,26,20,.45)}
.v7-hero .chg i.f{background:var(--stat-kayfabe);box-shadow:inset 0 0 0 1.5px var(--ink)}
.v7-hero:hover{transform:translateY(-1px)}

/* ══ OBEN RECHTS — der Kompass, bündig ═══════════════════════════════════════
   Zielschild LINKS neben der Karte, oben angeschlagen — damit es mit dem Blatt
   links oben auf einer Flucht liegt und nicht als zweite Zeile darunter hängt. */
.v7-nav{position:absolute;right:var(--pad);top:var(--pad);display:flex;flex-direction:row;
  align-items:flex-start;gap:9px}
.v7-nav canvas.map{display:block;cursor:crosshair;flex:none;
  width:clamp(112px,12.5vw,148px);height:clamp(112px,12.5vw,148px);
  filter:drop-shadow(0 3px 5px rgba(0,0,0,.35))}
.v7-nav .side{display:flex;flex-direction:column;align-items:flex-end;gap:5px;min-width:0}
.v7-nav .tgt{position:relative;width:298px;text-align:right;line-height:1.2;
  filter:drop-shadow(0 2px 4px rgba(0,0,0,.3))}
.v7-nav .tgt{height:var(--rowH)}
.v7-nav .tgt .ct{display:flex;flex-direction:column;justify-content:flex-start;
  height:100%;padding:11px 15px 10px}
.v7-nav .tgt .lab{display:block;font-size:9px;letter-spacing:.13em;text-transform:uppercase;
  color:#6d5c3e;font-weight:700}
.v7-nav .tgt b{font-family:'Special Elite',ui-monospace,monospace;
  font-size:var(--lfs,13px);line-height:1.24;color:#241d15;margin:1px 0 2px;
  display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.v7-nav .tgt em{margin-top:auto;padding-top:6px;font-style:normal;font-size:10px;
  color:#5d4f38;letter-spacing:.03em}
.v7-nav .pillslot{position:absolute;top:100%;right:0;margin-top:4px;display:flex;
  justify-content:flex-end}
.v7 .pill{position:static!important;background:none;border:0;backdrop-filter:none;
  color:#2b2318;font-family:'Special Elite',ui-monospace,monospace;font-size:8.5px;
  letter-spacing:.02em;padding:0;white-space:nowrap;max-width:190px;overflow:hidden;
  text-overflow:ellipsis;opacity:.42;text-shadow:0 1px 0 rgba(247,238,216,.5)}

/* ══ OBEN MITTE — die Bühne ══════════════════════════════════════════════════ */
.v7-story{position:absolute;left:50%;top:var(--pad);transform:translateX(-50%);z-index:2;
  width:max-content;max-width:var(--midW,300px);display:none}
/* Keine Bahn zwischen Blatt und Quest? Dann spielt die Bühne eine Etage tiefer. */
.v7.lowlane .v7-story{top:calc(var(--rowH) + var(--pad) * 2);max-width:var(--lowW,420px)}
.v7-story.on{display:block;animation:ow7drop .28s cubic-bezier(.3,1.5,.5,1)}
@keyframes ow7drop{from{transform:translateX(-50%) translateY(-10px);opacity:0}
  to{transform:translateX(-50%) translateY(0);opacity:1}}
.v7 .zone{position:static!important;transform:none!important;left:auto;right:auto;bottom:auto;
  display:block!important;background:transparent;border:0;border-radius:0;max-width:100%;
  font-family:'Special Elite',ui-monospace,monospace;font-size:12.5px;line-height:1.4;
  color:#2b2318;text-align:center;padding:10px 18px}
.v7 .zone b{color:#8c3a1e;font-weight:400}

/* ══ UNTEN LINKS — das Logbuch ═══════════════════════════════════════════════ */
.v7-log{position:absolute;left:var(--pad);bottom:var(--pad);width:min(27vw,286px);
  pointer-events:auto;transition:opacity .45s ease,transform .45s ease}
.v7-log.idle{opacity:0;transform:translateX(-10px)}
/* Eingeschlafen heißt nicht weg: der Zeiger holt es zurück, und dann zeigt es auch,
   welche Tasten es gibt. Das ist die Hilfe, die man genau dann sucht. */
.v7-log:hover{opacity:1!important;transform:none!important}
.v7-log .ct{padding:9px 11px}
/* Neueste Zeile unten, wie in jedem Logbuch. Was oben rausläuft, ist Vergangenheit. */
.v7-log .lines{height:min(19vh,108px);overflow:hidden;display:flex;flex-direction:column;
  justify-content:flex-end}
.v7 .log{position:static!important;display:flex;flex-direction:column;gap:0;
  font-family:inherit;font-size:11.5px;color:#463a27;pointer-events:none;overflow:visible;
  text-shadow:none}
.v7 .log div{background:none;border:0;border-radius:0;padding:2px 0;max-width:100%;
  backdrop-filter:none;line-height:1.34;opacity:.48;text-shadow:none;
  border-top:1px solid rgba(31,26,20,.1)}
.v7 .log div:first-child{border-top:0}
.v7 .log div:nth-last-child(2){opacity:.72}
.v7 .log div:last-child{opacity:1;color:#241d15;font-weight:600}

/* ══ UNTEN MITTE — Prompt, Hilfe, deine Hand ════════════════════════════════ */
.v7-mid{position:absolute;left:50%;bottom:var(--pad);transform:translateX(-50%);
  display:flex;flex-direction:column;align-items:center;gap:7px;max-width:96vw}
.v7 .prompt{position:static!important;transform:none!important;left:auto;bottom:auto;
  background:var(--paperHi);color:#241d15;border:2px solid var(--ink);border-radius:4px;
  font-family:inherit;font-weight:600;font-size:11.5px;padding:5px 13px;white-space:nowrap;
  max-width:min(52vw,440px);overflow:hidden;text-overflow:ellipsis;
  box-shadow:0 2px 5px rgba(0,0,0,.3)}
.v7 .hint{position:static!important;transform:none!important;left:auto;bottom:auto;
  display:none;background:rgba(31,26,20,.82);color:#efe2c4;border:0;border-radius:5px;
  font-family:inherit;font-size:10.5px;padding:5px 12px;text-align:center;
  max-width:min(74vw,700px);line-height:1.5}
.v7 .hint b{color:#fff;font-weight:700}
.v7 .hint.on{display:block}

/* Der F\u00e4cher kippt die \u00e4u\u00dferen Karten nach unten \u2014 die Bewegung ist Transform, also
   z\u00e4hlt sie f\u00fcr das Layout nicht. Ohne diesen Fu\u00df s\u00e4gt der Bildschirmrand sie ab. */
.v7-hand{display:flex;align-items:flex-end;justify-content:center;pointer-events:auto;
  padding:16px 0 12px}
.v7-hand:hover .v7-card{opacity:1}
.v7-card{position:relative;flex:none;width:var(--cw);height:var(--ch);opacity:.78;
  transition:opacity .2s ease;
  margin:0 calc(var(--cw)*-.085);padding:0;border:0;background:transparent;cursor:pointer;
  font-family:inherit;color:var(--ink);transform-origin:50% 150%;
  transform:rotate(var(--rot,0deg)) translateY(var(--dip,0px));
  filter:drop-shadow(0 3px 3px rgba(0,0,0,.34));
  transition:transform .18s cubic-bezier(.34,1.5,.64,1),filter .18s ease}
.v7-card:hover,.v7-card:focus-visible{outline:none;z-index:4;opacity:1;
  transform:rotate(0deg) translateY(-13px) scale(1.1);
  filter:drop-shadow(0 10px 8px rgba(0,0,0,.4))}
.v7-card .fc{position:absolute;inset:0;z-index:1;display:flex;flex-direction:column;
  padding:9% 9% 17%}
.v7-card .band{width:100%;height:4px;border-radius:2px;background:var(--c);
  box-shadow:0 0 0 1px rgba(31,26,20,.55);flex:none}
.v7-card .body{flex:1;min-height:0;display:flex;align-items:center}
.v7-card .num{position:absolute;z-index:2;left:9%;bottom:7%;
  font-family:'Special Elite',ui-monospace,monospace;
  font-size:calc(var(--ch)*.2);line-height:1;color:#6d5c3e}
.v7-card .lbl{flex:1;min-width:0;text-align:left;
  font-family:'Special Elite',ui-monospace,monospace;
  font-size:var(--lfs,calc(var(--ch)*.2));line-height:1.2;color:#2b2318;
  display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.v7-card .cost{position:absolute;z-index:2;right:8%;bottom:7%;display:flex;gap:2px}
.v7-card .cost i{width:5px;height:5px;border-radius:50%;background:var(--stat-kayfabe);
  box-shadow:0 0 0 1px rgba(31,26,20,.6)}
.v7-card .cost i.off{background:transparent}
.v7-card .rr{position:absolute;z-index:2;right:9%;top:17%;width:6px;height:6px;
  transform:rotate(45deg);box-shadow:0 0 0 1px rgba(31,26,20,.6)}
/* Rückseite: verdeckte Karte = noch nicht deine. */
.v7-card .back{position:absolute;inset:4%;z-index:1;display:none;border-radius:2px;
  background:repeating-linear-gradient(45deg,${PAPER_LO} 0 4px,${PAPER} 4px 8px);
  opacity:.75}
/* Ein leerer oder versiegelter Platz ist ein HINWEIS, keine Karte. Er zeigt nur,
   dass dort einmal etwas liegen wird — und tritt sonst aus dem Bild zurück. */
.v7-card.ghost{display:none}
.v7-card.locked{cursor:default}
.v7-card.spent{filter:drop-shadow(0 2px 2px rgba(0,0,0,.3)) grayscale(.55) brightness(.95)}
.v7-card .armed{position:absolute;z-index:0;inset:-6%;border-radius:6px;
  box-shadow:0 0 0 2px var(--c),0 0 14px var(--c);animation:ow7pulse 1.5s ease-in-out infinite}
@keyframes ow7pulse{0%,100%{opacity:.35}50%{opacity:.95}}
.v7-card .tip{position:absolute;z-index:9;bottom:calc(100% + 12px);left:50%;
  transform:translate(-50%,6px);white-space:nowrap;padding:5px 10px;border-radius:4px;
  background:var(--paperHi);color:#241d15;font-size:10.5px;font-weight:600;opacity:0;
  pointer-events:none;transition:opacity .13s ease,transform .13s ease;
  box-shadow:0 0 0 2px var(--ink),0 5px 12px rgba(0,0,0,.35)}
.v7-card .tip em{font-style:normal;color:#6d5c3e;font-weight:400}
.v7-card:hover .tip,.v7-card:focus-visible .tip{opacity:1;transform:translate(-50%,0)}
.v7-card.play{animation:ow7play .5s cubic-bezier(.24,1.4,.4,1)}
@keyframes ow7play{
  0%{transform:rotate(0) translateY(-13px) scale(1.1)}
  26%{transform:rotate(-3deg) translateY(-54px) scale(1.2)}
  60%{transform:rotate(2deg) translateY(-20px) scale(.98)}
  100%{transform:rotate(var(--rot,0deg)) translateY(var(--dip,0px)) scale(1)}}
.v7-card.nope{animation:ow7nope .34s ease-in-out}
@keyframes ow7nope{0%,100%{transform:rotate(var(--rot,0deg)) translateY(var(--dip,0px))}
  25%{transform:rotate(calc(var(--rot,0deg) - 5deg)) translateX(-5px)}
  60%{transform:rotate(calc(var(--rot,0deg) + 4deg)) translateX(4px)}}

/* ══ UNTEN RECHTS — dein Deck ════════════════════════════════════════════════ */
.v7-deck{position:absolute;right:var(--pad);bottom:var(--pad);display:flex;
  flex-direction:column;align-items:flex-end;gap:7px}
/* Die eingefächerte Fassung der Hand: dieselbe Karte, dieselbe Feder, nur
   aufgefächert und nach außen versetzt. Leer ist er fast nicht da — ein
   Versprechen, kein Bauteil. */
.v7-stack{position:relative;width:calc(var(--cw) + 30px);height:calc(var(--ch) + 16px);
  cursor:pointer;opacity:.74;transition:opacity .2s ease,transform .16s ease}
.v7-stack:hover{opacity:1;transform:translateY(-3px)}
.v7-stack.empty{opacity:.26}
.v7-stack.empty:hover{opacity:.62}
.v7-stack:focus-visible{outline:none;opacity:1;filter:drop-shadow(0 0 6px #d8b45f)}
.v7-stack .pc{position:absolute;bottom:calc(var(--k) * 4px);right:calc(30px - var(--k) * 9px);
  width:var(--cw);height:var(--ch);background:transparent;border:0;
  transform-origin:50% 150%;transform:rotate(calc(var(--k) * 5.5deg));
  filter:drop-shadow(0 2px 3px rgba(0,0,0,.3))}
.v7-stack .pc.top{z-index:6;
  filter:drop-shadow(0 3px 5px rgba(0,0,0,.34))}
/* Dieselbe Grammatik wie die Handkarte: Band oben, Titel, Zähler in der Ecke.
   Ein eigener Kopf passt in 61 px Höhe nicht — er bricht um und frisst den Titel. */
.v7-stack .pc.top .ct{display:flex;flex-direction:column;height:100%;padding:9% 9% 17%}
.v7-stack .band{width:100%;height:4px;border-radius:2px;background:#8c3a1e;flex:none;
  box-shadow:0 0 0 1px rgba(31,26,20,.55)}
.v7-stack .body{flex:1;min-height:0;display:flex;align-items:center}
.v7-stack b{flex:1;min-width:0;font-family:'Special Elite',ui-monospace,monospace;
  font-size:var(--lfs,10px);line-height:1.2;color:#241d15;text-align:left;font-weight:400;
  display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.v7-stack b.mt{color:#7a6844}
.v7-stack .ct2{position:absolute;z-index:2;left:9%;bottom:7%;
  font-family:'Special Elite',ui-monospace,monospace;font-size:10px;line-height:1;color:#6d5c3e}
.v7-stack .lab{position:absolute;z-index:2;right:9%;bottom:7%;font-size:8px;letter-spacing:.1em;
  text-transform:uppercase;color:#8a7757;font-weight:700}
.v7-stack.pop{animation:ow7pop .55s cubic-bezier(.34,1.56,.64,1)}
@keyframes ow7pop{0%{transform:scale(1)}38%{transform:scale(1.08) rotate(-1.4deg)}100%{transform:scale(1)}}
.v7-nav .mapw{position:relative;flex:none}
.v7-nav .cog{position:absolute;right:1px;top:1px;width:29px;height:29px;padding:0;
  border:0;background:transparent;cursor:pointer;pointer-events:auto;
  filter:drop-shadow(0 2px 3px rgba(0,0,0,.34));transition:transform .12s ease}
.v7-nav .cog .ct{display:grid;place-items:center;width:100%;height:100%}
.v7-nav .cog:hover{transform:translateY(-1px) rotate(-6deg)}
.v7-nav .cog:active{transform:translateY(1px)}
.v7-nav .cog img{width:16px;height:16px;opacity:.88}
.v7-nav .cog.on img{opacity:1}
.v7 .icobtn{width:32px;height:32px;padding:0;border:2px solid var(--ink);border-radius:4px;
  background:var(--paper);cursor:pointer;display:grid;place-items:center;
  box-shadow:0 2px 4px rgba(0,0,0,.3);transition:transform .12s ease,background .12s ease}
.v7 .icobtn:hover{transform:translateY(-2px);background:var(--paperHi)}
.v7 .icobtn:active{transform:translateY(1px)}
.v7 .icobtn img{width:19px;height:19px}
.v7 .icobtn.on{background:#d8b45f}
.v7-fly{position:absolute;z-index:30;width:116px;height:82px;pointer-events:none;
  background:var(--paperHi);border:2px solid var(--ink);border-radius:3px;
  display:flex;align-items:center;justify-content:center;padding:8px;text-align:center;
  font-family:'Special Elite',ui-monospace,monospace;font-size:10px;line-height:1.25;
  color:#241d15;box-shadow:0 10px 24px rgba(0,0,0,.5)}

/* ══ Fenster ═════════════════════════════════════════════════════════════════ */
.v7-win{position:absolute;inset:0;display:none;place-items:center;z-index:24;
  background:rgba(12,9,6,.5);padding:clamp(10px,3vw,28px);pointer-events:auto}
.v7-win.on{display:grid;animation:ow7fade .18s ease-out}
@keyframes ow7fade{from{opacity:0}to{opacity:1}}
.v7-box{position:relative;width:min(720px,100%);max-height:100%;display:flex;flex-direction:column;
  min-height:0;animation:ow7rise .26s cubic-bezier(.3,1.5,.5,1)}
@keyframes ow7rise{from{transform:translateY(14px) scale(.97);opacity:.4}to{transform:none;opacity:1}}
.v7-box .ct{display:flex;flex-direction:column;min-height:0;padding:0}
.v7-box .wh{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;
  padding:clamp(26px,2.6vw,30px) clamp(30px,3.2vw,38px) clamp(14px,1.4vw,18px)}
.v7-box .wh h3{margin:0;font-family:'Special Elite',ui-monospace,monospace;
  font-size:clamp(15px,1.8vw,20px);font-weight:400;color:#241d15}
.v7-box .wh em{font-style:normal;font-size:11px;color:#6d5c3e;display:block;margin-top:2px}
.v7-box .wb{overflow-y:auto;padding:0 clamp(30px,3.2vw,38px) clamp(28px,2.8vw,34px);
  display:flex;flex-direction:column;gap:14px;min-height:0;
  scrollbar-width:thin;scrollbar-color:rgba(31,26,20,.3) transparent}
.v7 .sub{font-family:'Special Elite',ui-monospace,monospace;font-size:10.5px;letter-spacing:.1em;
  text-transform:uppercase;color:#6d5c3e}
.v7 .slab{background:rgba(31,26,20,.07);box-shadow:inset 0 0 0 1.5px rgba(31,26,20,.3);
  border-radius:4px;padding:10px 12px}
.v7 .pbtn{padding:8px 14px;border:2px solid var(--ink);border-radius:4px;cursor:pointer;
  font-family:inherit;font-weight:700;font-size:12px;color:#241d15;background:var(--paper);
  box-shadow:0 2px 0 rgba(31,26,20,.45);transition:transform .1s ease,background .1s ease}
.v7 .pbtn:hover{background:var(--paperHi);transform:translateY(-1px)}
.v7 .pbtn:active{transform:translateY(2px);box-shadow:none}
.v7 .pbtn.hot{background:#c8622a;color:var(--paperHi)}
.v7 .pbtn.off{opacity:.5;cursor:default}
.v7 .row{display:flex;gap:9px;flex-wrap:wrap;align-items:center}
.v7 .actor{padding:8px 11px;min-width:104px;border:2px solid var(--ink);border-radius:4px;
  cursor:pointer;font-family:inherit;font-size:12px;font-weight:600;color:#241d15;text-align:left;
  background:var(--paper);transition:transform .12s ease}
.v7 .actor:hover{transform:translateY(-2px)}
.v7 .actor.on{background:#d8b45f;box-shadow:0 0 0 2px rgba(31,26,20,.35)}
.v7 .actor em{font-style:normal;display:block;font-size:10px;color:#6d5c3e;font-weight:400}
.v7 .swatches{display:flex;gap:7px}
.v7 .sw{width:26px;height:26px;border-radius:50%;border:2px solid var(--ink);cursor:pointer;padding:0}
.v7 .sw.on{box-shadow:0 0 0 2px var(--paperHi),0 0 0 4px var(--ink)}
.v7 .skill{display:flex;gap:10px;align-items:flex-start;padding:8px 10px;border-radius:4px;
  background:rgba(31,26,20,.06);box-shadow:inset 0 0 0 1.5px rgba(31,26,20,.24)}
.v7 .skill .dot{width:11px;height:11px;border-radius:3px;flex:none;margin-top:3px;
  box-shadow:0 0 0 1px rgba(31,26,20,.5)}
.v7 .skill b{display:block;font-size:12.5px}
.v7 .skill span{font-size:11px;color:#5d4f38}
.v7 .chip{padding:4px 10px;border-radius:11px;background:var(--paper);
  box-shadow:inset 0 0 0 1.5px rgba(31,26,20,.4);cursor:pointer;font-weight:600;font-size:11px}
.v7 .chip:hover{background:#d8b45f}
.v7 .pages{display:grid;grid-template-columns:repeat(auto-fill,minmax(164px,1fr));gap:11px}
.v7 .page{position:relative;aspect-ratio:1.42;background:var(--paperHi);color:#241d15;
  border:2px solid var(--ink);border-radius:3px;padding:9px 10px;display:flex;flex-direction:column;
  gap:5px;font-family:'Special Elite',ui-monospace,monospace;
  overflow:hidden;transition:transform .16s ease}
.v7 .page:hover{transform:translateY(-4px) rotate(-1deg)}
.v7 .page .band{width:100%;height:5px;border-radius:2px;background:var(--c,#7a6844);flex:none;
  box-shadow:0 0 0 1px rgba(31,26,20,.5)}
.v7 .page b{font-size:11px;font-weight:400;line-height:1.2}
.v7 .page span{font-size:9px;color:#7a6844;letter-spacing:.03em}
.v7 .page q{font-size:9px;color:#6b6152;font-style:italic;quotes:'\\201C' '\\201D';margin-top:auto}
.v7 .page.sealed{background:repeating-linear-gradient(45deg,${PAPER_LO} 0 5px,${PAPER} 5px 10px);
  color:#6d5c3e;align-items:center;justify-content:center;text-align:center}
.v7 .page.fresh{animation:ow7flyin .6s cubic-bezier(.22,1.2,.36,1) both}
@keyframes ow7flyin{from{transform:translateY(30px) scale(.74) rotate(-4deg);opacity:0}to{transform:none;opacity:1}}

@keyframes ow7shake{0%{transform:translate(0,0)}
  18%{transform:translate(calc(var(--sx,3px)*-1),var(--sy,2px))}
  38%{transform:translate(var(--sx,3px),calc(var(--sy,2px)*-1))}
  62%{transform:translate(calc(var(--sx,3px)*-.5),calc(var(--sy,2px)*.4))}
  100%{transform:translate(0,0)}}
.v7 .shaking{animation:ow7shake .3s cubic-bezier(.36,.07,.19,.97) both}

/* Die Spiel-Fenster ziehen mit ins Papier-Register. */
.diary,.after,.lvup .box,.cap .box{font-family:'Shantell Sans',ui-rounded,system-ui,sans-serif;
  background:${PAPER};border:2px solid ${INKC};border-radius:5px;color:#241d15;
  box-shadow:0 10px 28px rgba(0,0,0,.42)}
.diary h4,.after h3,.lvup h3,.cap h3{color:#8c3a1e;
  font-family:'Special Elite',ui-monospace,monospace;font-weight:400;letter-spacing:.02em}
.diary li i,.diary .rep span,.lvup p,.cap p,.after .hof i{color:#6d5c3e}
.after .body,.cap .opts button b{font-family:'Special Elite',ui-monospace,monospace}
.diary button,.after .row button,.lvup button,.cap .opts button,.cap .ok{
  font-family:'Shantell Sans',system-ui,sans-serif;font-weight:600;background:${PAPER_HI};
  color:#241d15;border:2px solid ${INKC};border-radius:4px;cursor:pointer}
.diary button:hover,.after .row button:hover,.lvup button:hover,.cap .opts button:hover,.cap .ok:hover{
  background:#d8b45f}
.load{font-family:'Shantell Sans',system-ui,sans-serif}

/* ══ Eng / Split-Screen ══════════════════════════════════════════════════════ */
@media (max-width:1000px){.v7-log{width:min(24vw,220px)}}
@media (max-width:820px){
  .v7-hero{min-width:0;width:min(44vw,230px)}
  .v7-log{width:min(30vw,200px)}
  .v7-log .lines{height:64px}
  .v7 .pill{display:none!important}
  .v7-nav .tgt{width:auto}
}
@media (max-width:640px){
  .v7-log{display:none}

}
@media (max-height:520px){
  .v7-log .lines{height:50px}
}
`;

/* ── Tusche: eine Uhr, ein ResizeObserver, Papier drunter, Kanon-Kante drauf ── */
function inkKit(){
  const pend=new Set();let raf=0,tmo=0;
  const ro=('ResizeObserver'in window)?new ResizeObserver(es=>{for(const e of es)mark(e.target);}):null;
  /* Zwei Wecker, mit Absicht: rAF wird in verstecktem/gedrosseltem Kontext nie gerufen,
     und dann stünde die Kante nie auf dem Papier. Der Timer ist die Versicherung. */
  function mark(el){pend.add(el);
    if(!raf)raf=requestAnimationFrame(flush);
    if(!tmo)tmo=setTimeout(flush,60);}
  function flush(){
    if(raf){cancelAnimationFrame(raf);raf=0;}
    if(tmo){clearTimeout(tmo);tmo=0;}
    const l=[...pend];pend.clear();
    for(const el of l){try{draw(el);}catch(e){
      if(!el._iw){el._iw=1;console.warn('[hud-v7] Kante:',e.message);}}}
  }
  function attach(el,opt){
    let cv=el.querySelector(':scope > canvas.ow7ink');
    if(!cv){cv=document.createElement('canvas');cv.className='ow7ink';el.insertBefore(cv,el.firstChild);}
    el._ink=Object.assign({seed:7,fill:PAPER,gain:1},opt||{});
    if(ro)ro.observe(el);
    mark(el);return cv;
  }
  function draw(el){
    const cv=el.querySelector(':scope > canvas.ow7ink');if(!cv||!el._ink)return;
    const w=Math.round(el.clientWidth),h=Math.round(el.clientHeight);
    if(w<10||h<10)return;
    const dpr=Math.min(2,window.devicePixelRatio||1);
    cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr);
    cv.style.width=w+'px';cv.style.height=h+'px';
    const g=cv.getContext('2d');g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,w,h);
    const o=el._ink;
    if(INK){
      const pts=INK.contour('card',o.seed,w,h);
      g.save();INK.pathOf(g,pts);g.clip();
      g.fillStyle=o.fill;g.fillRect(0,0,w,h);
      /* Papierkorn: zwei sehr flache Verläufe, damit die Fläche nicht wie Karton wirkt. */
      const lg=g.createLinearGradient(0,0,w,h);
      lg.addColorStop(0,'rgba(255,255,255,.34)');lg.addColorStop(.55,'rgba(255,255,255,0)');
      lg.addColorStop(1,'rgba(120,96,54,.16)');
      g.fillStyle=lg;g.fillRect(0,0,w,h);
      g.restore();
      /* Die Feder ist eine BREITE, keine Proportion — auf kleinen Flächen nachziehen,
         sonst verschwindet die Kante. Die FORM bleibt der Kanon.
         **Und auf großen Flächen zurücknehmen** (V8-S4): `hb` hängt an `min(W,H)`, ein Fenster ist
         groß, also wurde seine Kante fett — bei 720 px Breite 5,0 px Halbbreite, und die diagonale
         Modulation der geführten Hand (`edge 1.05`) macht unten rechts daraus 7,6 px, also ein
         15-px-Band. Georg: »zu dick, gerade unten rechts«. Genau die Stelle, wo der Kanon es
         absichtlich satter zieht — richtig für eine Karte, zu viel für ein Fenster.
         Ein Fenster ist keine Karte: `penPx` gibt ihm eine **absolute** Federbreite, aus der der
         Gain zurückgerechnet wird. Die Form (Wobble, Bauchung, Diagonale) bleibt unangetastet. */
      let gain=o.gain*Math.max(1,Math.min(4.4,250/Math.min(w,h)));
      if(o.penPx)gain=o.gain*(o.penPx/(Math.min(w,h)*0.0069));
      /* **Die Schattenseite bleibt die Schattenseite** (V8-S4c, Georgs Korrektur). Die dicke Kante
         unten rechts ist ein Code, kein Nebeneffekt: dick = Schatten, dünn = Licht — derselbe
         comic-typische Übergang von Strich zu Form, dem auch die Terrain-Kontur folgt. Mein erster
         Fix hat sie gedreht und damit die Bedeutung weggeworfen; falsch war nicht die Richtung,
         sondern die **Gleichförmigkeit** (12 von 13 Flächen dieselbe Ecke, auf den Grad genau).
         Jetzt streut die Achse um die Kanon-Richtung (±40°, aus dem Seed) und die Ausprägung ist
         zurückgenommen (0,62) — ein Stapel Blätter unter einem Licht, nicht ein Raster. */
      /* Die Optionen werden nur übergeben, wenn der geladene Kanon sie kennt — sonst gehen sie ins
         Leere und der Eintrag im Changelog wäre wieder eine Behauptung. Auf **Fähigkeit** gaten. */
      if(INK_OPT)
        INK.drawInk('card',g,pts,w,h,o.seed,gain,
          {edgeJitter:o.edgeJitter==null?0.70:o.edgeJitter,
           edgeGain:o.edgeGain==null?0.62:o.edgeGain});
      else
        INK.drawInk('card',g,pts,w,h,o.seed,gain);
    }else{
      const r=Math.min(6,Math.min(w,h)*.14);
      g.fillStyle=o.fill;g.strokeStyle=INKC;g.lineWidth=2.6;
      g.beginPath();g.moveTo(r,1.3);
      g.arcTo(w-1.3,1.3,w-1.3,h-1.3,r);g.arcTo(w-1.3,h-1.3,1.3,h-1.3,r);
      g.arcTo(1.3,h-1.3,1.3,1.3,r);g.arcTo(1.3,1.3,w-1.3,1.3,r);g.closePath();
      g.fill();g.stroke();
    }
  }
  function detach(el){const cv=el.querySelector(':scope > canvas.ow7ink');if(cv)cv.remove();
    el._ink=null;if(ro)ro.unobserve(el);}
  return {attach,detach,mark,stop(){if(ro)ro.disconnect();if(raf)cancelAnimationFrame(raf);
    if(tmo)clearTimeout(tmo);}};
}

/* ── Der Kompass. Rund, weil ein Peilring nur rund funktioniert. ──────────────
   Was er zeigt (und nur das): Land, offene Zonen als Punkte, geräumte als Ringe,
   Stadt, du — und EIN Pfeil auf dem Rand, der zum Ziel zeigt. Nicht drei. */
function makeCompass(game,cv,moodOf){
  const g=cv.getContext('2d');let baked=null,bakedFor=null;
  /* Eine gestochene Zirkellinie hätte hier nichts zu suchen — der Rest des HUD ist
     von Hand gezogen. Zwei lange Wellen plus eine kurze: dieselbe Feder wie am Kartenrand. */
  function wob(c,cx,cy,r,seed,amp){
    const n=88;c.beginPath();
    for(let i=0;i<=n;i++){
      const a=i/n*Math.PI*2;
      const d=Math.sin(a*3+seed)*amp*.55+Math.sin(a*5.3+seed*1.7)*amp*.3
             +Math.sin(a*11+seed*.7)*amp*.15;
      const x=cx+Math.cos(a)*(r+d),y=cy+Math.sin(a)*(r+d);
      if(i)c.lineTo(x,y);else c.moveTo(x,y);
    }
    c.closePath();
  }
  function bake(){
    const W=game.W,H=game.H,land=game.land;if(!W||!land)return null;
    const off=document.createElement('canvas');off.width=W;off.height=H;
    const o=off.getContext('2d'),img=o.createImageData(W,H);
    for(let i=0;i<W*H;i++){
      const v=land[i],c=v===2?[104,140,74]:(v===1?[196,176,118]:[42,104,110]);
      img.data[i*4]=c[0];img.data[i*4+1]=c[1];img.data[i*4+2]=c[2];img.data[i*4+3]=255;
    }
    o.putImageData(img,0,0);return off;
  }
  let target=null;
  function pickTarget(){
    const h=game.hero,zs=game.zones||[];
    if(!h)return null;
    const open=zs.filter(z=>!z.cleared);
    if(!open.length)return game.tavern?{x:game.tavern.x,y:game.tavern.y,kind:'tavern',
      label:'The tavern',note:'tell the tall tale'}:null;
    let best=null,bd=1e18;
    for(const z of open){
      const zx=(z.x+z.w/2)*64,zy=(z.y+z.h/2)*64;
      const d=(zx-h.x)*(zx-h.x)+(zy-h.y)*(zy-h.y);
      if(d<bd){bd=d;best={x:zx,y:zy,kind:'zone',z:z,
        label:(z.card&&z.card.t)?'\u00bb'+z.card.t+'\u00ab':z.biome,
        note:z.biome+' \u00b7 '+Math.max(0,z.alive)+' guards'};}
    }
    return best;
  }
  function tick(){
    if(!game.ready||!game.land)return;
    const sig=game.att.seed+'|'+game.att.layout+'|'+game.W;
    if(bakedFor!==sig){baked=bake();bakedFor=sig;}
    if(!baked)return;
    const dpr=Math.min(2,window.devicePixelRatio||1);
    const S=Math.round(cv.clientWidth||132);
    if(cv.width!==Math.round(S*dpr)){cv.width=cv.height=Math.round(S*dpr);}
    g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,S,S);
    g.imageSmoothingEnabled=false;
    const R=S/2, rim=Math.max(11,S*.092), ir=R-rim-3;

    g.save();
    wob(g,R,R,ir+rim,11,rim*.09);g.clip();
    g.fillStyle=PAPER;g.fillRect(0,0,S,S);
    const pg=g.createLinearGradient(0,0,S,S);
    pg.addColorStop(0,'rgba(255,255,255,.3)');pg.addColorStop(.6,'rgba(255,255,255,0)');
    pg.addColorStop(1,'rgba(120,96,54,.16)');
    g.fillStyle=pg;g.fillRect(0,0,S,S);
    g.restore();

    g.save();
    wob(g,R,R,ir,23,rim*.07);g.clip();
    g.fillStyle='#2a686e';g.fillRect(0,0,S,S);
    const box=ir*2*0.985, sc=box/Math.max(game.W,game.H);
    const iw=game.W*sc, ih=game.H*sc, ox=R-iw/2, oy=R-ih/2;
    g.drawImage(baked,ox,oy,iw,ih);
    tick.map={ox:ox,oy:oy,sc:sc,R:R,ir:ir};   // damit der Klick dieselbe Rechnung benutzt
    const toX=wx=>ox+wx/64*sc, toY=wy=>oy+wy/64*sc;
    for(const z of (game.zones||[])){
      const x=toX((z.x+z.w/2)*64),y=toY((z.y+z.h/2)*64),c=moodOf(z);
      if(z.cleared){g.strokeStyle='rgba(239,226,196,.85)';g.lineWidth=1.6;
        g.beginPath();g.arc(x,y,3.4,0,7);g.stroke();}
      else{g.fillStyle=c;g.beginPath();g.arc(x,y,3.6,0,7);g.fill();
        g.strokeStyle=INKC;g.lineWidth=1.4;g.stroke();}
    }
    if(game.tavern){const x=toX(game.tavern.x),y=toY(game.tavern.y);
      g.fillStyle='#d8763f';g.strokeStyle=INKC;g.lineWidth=1.2;
      g.beginPath();g.moveTo(x,y-4);g.lineTo(x+3.6,y+3);g.lineTo(x-3.6,y+3);g.closePath();
      g.fill();g.stroke();}
    const h=game.hero;
    if(h){const x=toX(h.x),y=toY(h.y);
      g.fillStyle='#fff';g.strokeStyle=INKC;g.lineWidth=1.6;
      g.beginPath();g.arc(x,y,3.2,0,7);g.fill();g.stroke();}
    g.restore();

    // Beide Kanten von Hand gezogen — außen kräftig, innen als Fassungsnaht.
    g.strokeStyle=INKC;g.lineJoin='round';
    g.lineWidth=Math.max(2.6,S*.022);wob(g,R,R,ir+rim-1,11,rim*.09);g.stroke();
    g.lineWidth=Math.max(1.9,S*.016);wob(g,R,R,ir+1,23,rim*.07);g.stroke();
    // Vier Peilkerben — von Hand gesetzt, also nicht auf den Grad genau.
    g.lineWidth=1.8;g.lineCap='round';
    for(let i=0;i<4;i++){
      const a=i*Math.PI/2-Math.PI/2+Math.sin(i*2.7)*.035;
      const r0=ir+3+Math.sin(i*1.9)*.9,r1=ir+rim-3+Math.cos(i*2.3)*.9;
      g.beginPath();g.moveTo(R+Math.cos(a)*r0,R+Math.sin(a)*r0);
      g.lineTo(R+Math.cos(a+.012)*r1,R+Math.sin(a+.012)*r1);g.stroke();}
    g.lineCap='butt';

    // Der EINE Zielpfeil. Er reitet IM Peilring — draußen lag er jenseits der
    // Leinwandkante und war damit schlicht nicht vorhanden.
    target=pickTarget();
    if(target&&h){
      const a=Math.atan2(target.y-h.y,target.x-h.x);
      const c0=Math.cos(a),s0=Math.sin(a),nx=-s0,ny=c0;
      const tipR=ir+rim+1, baseR=ir+1, half=rim*.72;
      const tx=R+c0*tipR, ty=R+s0*tipR, bx=R+c0*baseR, by=R+s0*baseR;
      g.beginPath();
      g.moveTo(tx,ty);
      g.lineTo(bx+nx*half,by+ny*half);
      g.lineTo(bx-nx*half,by-ny*half);
      g.closePath();
      g.fillStyle=target.kind==='tavern'?'#d8763f':moodOf(target.z);
      g.fill();g.strokeStyle=INKC;g.lineWidth=2.4;g.stroke();
      // Ein heller Kern, damit der Pfeil auch auf dunklem Wasser noch zeigt.
      g.beginPath();
      g.moveTo(R+c0*(tipR-3),R+s0*(tipR-3));
      g.lineTo(R+c0*(baseR+3)+nx*half*.45,R+s0*(baseR+3)+ny*half*.45);
      g.lineTo(R+c0*(baseR+3)-nx*half*.45,R+s0*(baseR+3)-ny*half*.45);
      g.closePath();g.fillStyle='rgba(247,238,216,.55)';g.fill();
    }
  }
  tick.target=()=>target;
  return tick;
}

const ACTORS=[{id:'warrior',name:'Sir Kayfabe',line:'KayKit knight \u00b7 sword & shield'},
              {id:'frizzlebob',name:'Uncle FrizzleBob',line:'the rabbit MC \u00b7 sheet-based'}];
const COLORS=[['Blue','#5b86c4'],['Red','#c4544a'],['Yellow','#d9b043'],['Purple','#8e4ec6']];

/* ════════════════════════════════════════════════════════════════════════════ */
function install(game,sh){
  fonts();
  const P=PA();
  const st=document.createElement('style');st.textContent=CSS;sh.appendChild(st);
  const ik=inkKit();
  loadInk().then(()=>{for(const cv of sh.querySelectorAll('canvas.ow7ink'))
    if(cv.parentElement&&cv.parentElement._ink)ik.mark(cv.parentElement);});

  let cfg=JSON.parse(JSON.stringify(FALLBACK));
  const emit=(n,d)=>{try{game.dispatchEvent(new CustomEvent(n,{detail:d,bubbles:true,composed:true}));}catch(e){}};
  /* WS1-Eingriff 9.8. (V10-S6g) · **Die dritte Kopie derselben Liste.** S6e machte die Werteliste
     zur Ableitung, S6f das Dauerpanel — die **Farbtabelle** blieb eine HUD-eigene Kopie mit den drei
     alten Schlüsseln. Bingo, Bongo, Boggle und BLÖDSINN! fielen deshalb alle vier auf
     `cfg.colors.utility` (#7a6844) und waren farblich nicht unterscheidbar. Das wiegt hier schwer:
     im Dauerpanel stehen Drei-Buchstaben-Kürzel, und BIN/BON/BOG sind als Wort fast gleich — die
     Farbe IST dort der Unterschied.
     Jetzt zuerst der Runner. `STAT_INFO[k].color` ist ein `var(--stat-bingo,#7fd6a2)`-String, und
     `onPaper` erkennt nur reines Hex — also wird der Rückfallwert herausgezogen, sonst käme
     wieder keine Tönung an. *Eine Tabelle, die dem Runner gehört, wird gelesen, nicht gepflegt.* */
  const hexAus=v=>{
    const s=String(v||'');
    const m=/#([0-9a-f]{6})/i.exec(s);
    return m?('#'+m[1]):null;
  };
  const col=k=>{
    const si=game.STAT_INFO&&game.STAT_INFO[k];
    return (si&&hexAus(si.color))||cfg.colors[k]||cfg.colors.utility;
  };
  function onPaper(hex){
    const m=/^#?([0-9a-f]{6})$/i.exec(String(hex||''));
    if(!m)return hex;
    const v=parseInt(m[1],16),ink=[0x1f,0x1a,0x14];
    const c=[v>>16&255,v>>8&255,v&255].map((x,i)=>Math.round(x*0.66+ink[i]*0.34));
    return 'rgb('+c.join(',')+')';
  }
  const KAY=()=>game.OWK||window.OW_KAYFABE||null;
  const moodOf=z=>z?(cfg.moods[cfg.biomeMood[z.biome]]||cfg.colors.utility):cfg.colors.utility;
  game.zoneMood=()=>{const z=game.curZone;return z?(cfg.biomeMood[z.biome]||null):null;};

  /* ── Klang: EINE UI-Familie aus ui-sfx.json. Hover und Tippen bleiben still. ── */
  let uiMan=null,uiRules={debounce_ms:80,rate_jitter:0.06,cap_polyphony:4};
  function mergeManifest(){
    const a=game.audio;
    if(!uiMan||!a||!a.manifest)return false;
    if(a.manifest['ui.click'])return true;
    Object.assign(a.manifest,uiMan);
    return true;
  }
  fetch(RAWROOT+'media/3D_Assets/Audio/ui-sfx.json').then(r=>r.json())
    .then(j=>{uiMan=j.sfx||null;uiRules=Object.assign(uiRules,j._rules||{});mergeManifest();})
    .catch(e=>console.warn('[hud-v7] ui-sfx.json:',e.message));
  const voices=[];
  function ui(ev,opts){
    const a=game.audio;if(!a||a.enabled===false||!ev)return;
    if(!mergeManifest())return;
    const now=performance.now(),cap=uiRules.cap_polyphony||4;
    while(voices.length&&now-voices[0]>140)voices.shift();
    if(voices.length>=cap)return;
    voices.push(now);
    if(a.resume)a.resume();
    a.sfx(ev,Object.assign({throttle:uiRules.debounce_ms||80,
      vary:uiRules.rate_jitter||0.06},opts||{}));
  }
  game.hudSfx=ui;
  game.hudAudioReady=()=>!!(game.audio&&game.audio.manifest&&game.audio.manifest['ui.click']);

  /* ── Die Wurzel ──────────────────────────────────────────────────────────── */
  const root=document.createElement('div');root.className='v7';
  root.innerHTML=
    '<div class="v7-hero amb pe" role="button" tabindex="0" title="Character sheet (C)">'
      +'<div class="ct">'
        +'<span class="who">'
          /* WS1-Eingriff 9.8. (V10-S20): Name und Titel stehen beim Avatar, nicht in einem eigenen
             Fenster (ChatterBox §10). Eine Zeile über allem anderen — sie ist die soziale Identität,
             nicht ein Wert. */
          +'<span class="ident" style="grid-column:1/-1;font-size:11px;line-height:1.15;'
            +'color:#241d15;margin-bottom:1px"><b style="font-weight:700"></b>'
            +'<i style="font-style:normal;color:#6d5c3e"></i></span>'
          +'<span class="lab">Fluff</span>'
          +'<span class="bar hp" title="How much nonsense you can still absorb">'
            +'<i><b></b></i></span>'
          +'<span class="val hpn"></span>'
          +'<span class="lab">Level</span>'
          +'<span class="bar xp" title="Progress to the next level"><i><b></b></i></span>'
          +'<span class="val xpn"></span>'
          +'<span class="duo">'
            /* WS1-Eingriff 9.8. (V10-S6f) · **Leer, weil die Werte von außen kommen.**
               Hier standen zwei fest eingebaute Slots (`.kfn`, `.bzn`) — das Panel konnte deshalb
               strukturell nie mehr als zwei Werte zeigen, egal was `renderHero` hineinschrieb.
               Der Held hat sechs. Jetzt füllt `renderHero` diesen Block aus `game.STAT_KEYS`. */
          +'</span>'
          +'<span class="claim" role="button" tabindex="0">'
            +'<b></b><span>skill points to spend</span><i>\u2192</i></span>'
        +'</span>'
      +'</div>'
    +'</div>'
    +'<div class="v7-story amb"></div>'
    +'<div class="v7-nav amb pe">'
      +'<div class="side">'
        +'<div class="tgt"><div class="ct"><span class="lab">Nearest</span>'
          +'<b></b><em></em></div></div>'
        +'<div class="pillslot"></div>'
      +'</div>'
      +'<div class="mapw">'
        +'<canvas class="map" title="click the island to travel"></canvas>'
        +'<button class="cog pe" title="Settings & keys"><span class="ct"></span></button>'
      +'</div>'
    +'</div>'
    +'<div class="v7-log amb"><div class="ct"><div class="lines"></div></div></div>'
    +'<div class="v7-mid">'
      +'<div class="promptw"></div><div class="hintw"></div>'
      +'<div class="v7-hand"></div>'
    +'</div>'
    +'<div class="v7-deck pe">'
      +'<div class="v7-stack amb" role="button" tabindex="0" title="Fractal Almanac (N)"></div>'
    +'</div>';
  sh.appendChild(root);

  const q=s=>root.querySelector(s);
  const hero=q('.v7-hero'),navw=q('.v7-nav'),story=q('.v7-story'),logw=q('.v7-log'),
        hand=q('.v7-hand'),stack=q('.v7-stack'),gear=q('.cog'),
        mapCv=q('canvas.map'),tgtEl=q('.tgt');

  ik.attach(hero,{seed:11});
  ik.attach(logw,{seed:17});
  ik.attach(story,{seed:29});
  ik.attach(tgtEl,{seed:19,gain:.82});   // etwas feiner als das Blatt — es ist ein Zettel

  /* Spiel-Elemente umziehen — sie bleiben die Datenquelle, nur woanders zu Hause.
     Die Chat-Eingabe kommt NICHT mit: es gibt keinen zweiten Spieler, dem man schreibt. */
  const gLog=sh.querySelector('.log'),gZone=sh.querySelector('.zone'),
        gPrompt=sh.querySelector('.prompt'),gHint=sh.querySelector('.hint'),
        gPill=sh.querySelector('.pill');
  if(gLog)q('.lines').appendChild(gLog);
  if(gZone)story.appendChild(gZone);
  if(gPrompt)q('.promptw').appendChild(gPrompt);
  if(gHint){gHint.style.display='';gHint.classList.remove('on');q('.hintw').appendChild(gHint);}
  if(gPill)q('.pillslot').appendChild(gPill);
  game.beatsEl=logw;

  /* Das Banner ist des Spiels — wir spiegeln nur, ob es etwas zu sagen hat. */
  function syncStory(){
    const on=!!gZone&&gZone.style.display!=='none'&&!!gZone.textContent.trim();
    story.classList.toggle('on',on);
    if(on)ik.mark(story);
  }
  if(gZone&&window.MutationObserver)
    new MutationObserver(syncStory).observe(gZone,{attributes:true,childList:true,subtree:true,
      attributeFilter:['style']});
  syncStory();

  /* Das Logbuch schläft ein, wenn nichts passiert — und wacht bei jeder Zeile auf. */
  let logTimer=0;
  function wakeLog(){
    logw.classList.remove('idle');clearTimeout(logTimer);
    logTimer=setTimeout(()=>logw.classList.add('idle'),9000);
  }
  if(gLog&&window.MutationObserver)
    new MutationObserver(wakeLog).observe(gLog,{childList:true});
  wakeLog();

  /* ── Kompass ─────────────────────────────────────────────────────────────── */
  const compass=makeCompass(game,mapCv,moodOf);
  mapCv.addEventListener('click',ev=>{
    const m=compass.map;if(!m)return;
    const r=mapCv.getBoundingClientRect(),k=r.width/(mapCv.clientWidth||r.width);
    const px=(ev.clientX-r.left)/k, py=(ev.clientY-r.top)/k;
    if(Math.hypot(px-m.R,py-m.R)>m.ir)return;    // der Peilring ist kein Reiseziel
    const wx=(px-m.ox)/m.sc*64, wy=(py-m.oy)/m.sc*64;
    /* Ein Feld Nachsicht, nicht drei (v10-S1h): der Kompaß ist 112 px breit für 240 Felder, ein
       Pixel sind also zwei Felder. Wer hier drei Felder verzeiht, verzeiht mehr als der Klick weiß —
       und landet zuverlässig am nächsten Ufer. */
    if(game.travelPoint)game.travelPoint(wx,wy,'the map',1);
    else if(game.setMoveTarget)game.setMoveTarget(wx,wy);
    ui('ui.select');
  });

  /* ── Ambient / Wachrütteln ───────────────────────────────────────────────── */
  function applyAmbient(){root.classList.toggle('ambOff',!cfg.ambient);}
  function wake(el,secs){if(!el)return;el.classList.add('awake');clearTimeout(el._wt);
    el._wt=setTimeout(()=>el.classList.remove('awake'),(secs||2.4)*1000);}
  game.hudWake=(what,secs)=>{
    if(what==='beats'){wakeLog();return;}
    wake(what==='map'?navw:hero,secs);
  };
  game.hudShake=(t,force)=>{
    const el=(!t||t==='panel')?hero:(t==='beats'?logw:(t==='map'?navw:t));
    if(!el||!el.classList)return;
    const f=Math.max(1,Math.min(4,force||2));
    el.style.setProperty('--sx',(1.6*f).toFixed(1)+'px');
    el.style.setProperty('--sy',(1.1*f).toFixed(1)+'px');
    wake(el,2.4);
    el.classList.remove('shaking');void el.offsetWidth;el.classList.add('shaking');
    if(!el._sb){el._sb=1;el.addEventListener('animationend',()=>el.classList.remove('shaking'));}
  };
  game.hudDress=()=>{};

  /* ── DIE HAND ────────────────────────────────────────────────────────────── */
  let cards=[];
  function buildHand(){
    hand.innerHTML='';cards=[];
    const list=cfg.slots||[];
    list.forEach((s,i)=>{
      const b=document.createElement('button');
      b.className='v7-card amb';
      b.style.setProperty('--c',col(s.color));
      b.dataset.id=s.id;
      b.innerHTML='<span class="armed" style="display:none"></span>'
        +'<span class="back"></span>'
        +'<span class="fc"><span class="band"></span>'
        +'<span class="body"><span class="num">'+esc(s.key||'')+'</span>'
        +'<span class="lbl"></span></span></span>'
        +'<span class="rr" style="display:none"></span>'
        +'<span class="cost"></span><span class="tip"></span>';
      b.onclick=ev=>fire(s,i,ev);
      b.oncontextmenu=ev=>{ev.preventDefault();
        if(s.action==='kayfabe'&&game.cycleSlot){game.cycleSlot(s.arg|0);ui('ui.select');}};
      hand.appendChild(b);cards.push(b);
      ik.attach(b,{seed:37+i*13});
    });
    paintHand(true);
    layoutHand();
  }
  function layoutHand(){
    const on=cards.filter(b=>b&&!b.classList.contains('ghost'));
    const sig=on.length;
    if(hand._fan===sig)return;
    hand._fan=sig;
    const mid=(sig-1)/2;
    on.forEach((b,i)=>{
      b.style.setProperty('--rot',((i-mid)*3.4).toFixed(2)+'deg');
      b.style.setProperty('--dip',(Math.pow(Math.abs(i-mid),2)*1.15).toFixed(1)+'px');
    });
  }
  function juice(b,ok){
    if(!b)return;
    const c=ok?'play':'nope';
    b.classList.remove('play','nope');void b.offsetWidth;b.classList.add(c);
    if(!b._jb){b._jb=1;b.addEventListener('animationend',()=>b.classList.remove('play','nope'));}
  }
  function canFire(s){
    const h=game.hero,K=KAY();
    if(!h)return false;
    if(s.action!=='kayfabe')return true;
    const idx=s.arg|0;
    if(idx>=h.slots)return false;
    const id=h.equipped&&h.equipped[idx],ab=id&&K&&K.ABILITIES[id];
    return !!ab&&(h.charges||0)>=(ab.cost||0);
  }
  function fire(s,i,ev){
    if(!s)return;
    const b=cards[i],ok=canFire(s);
    juice(b,ok);
    if(!ok){ui('ui.error');return;}
    if(s.action==='kayfabe'){
      if(ev&&ev.shiftKey){if(game.cycleSlot)game.cycleSlot(s.arg|0);ui('ui.select');return;}
      if(game.useKayfabe)game.useKayfabe(s.arg|0);
      ui('ui.slot.resource');
    }else if(s.action==='signature'){
      if(typeof game.useSignature==='function')game.useSignature(s);
      else if(game.tryAttack){game.tryAttack(game.hero);
        if(game.say)game.say((s.label||'Signature')+'!',1.6,'shout');}
      ui('ui.slot.signature');
    }else if(s.action==='window')openWindow(s.arg);
    emit('slotUsed',{id:s.id,slot:i,action:s.action,arg:s.arg});
  }
  function openWindow(name){
    if(name==='overview'&&game.toggleOverview){
      ui(game.overview?'ui.map.close':'ui.map.open');game.toggleOverview();}
    else if(name==='diary'&&game.toggleDiary){
      const open=game.diaryEl&&game.diaryEl.style.display==='flex';
      ui(open?'ui.window.close':'ui.diary.open');game.toggleDiary();}
    /* **Dieselbe Taste schließt, was sie öffnet** (V8-S4). `showWin(…,true)` war fest auf offen, also
       war C ein Einbahnknopf: drücken, drücken, drücken — nichts passiert, das Fenster steht schon.
       Ein Umschalter, der nur in eine Richtung schaltet, fühlt sich wie ein toter Knopf an.
       Der Zeigerweg (Zahnrad) macht es seit je richtig — nur die Tasten nicht. */
    else if(name==='character'){const on=!charWin.classList.contains('on');
      if(on)renderChar();showWin(charWin,on);}
    else if(name==='almanac'){const on=!almWin.classList.contains('on');
      if(on)renderAlmanac();showWin(almWin,on,'ui.diary.open');}
    emit('openWindow',{name});
  }
  game.hudOpen=openWindow;

  let fitCv=null;
  function fitLabel(el,text,maxLines,minSize){
    maxLines=maxLines||3;minSize=minSize||8;
    if(el._fitFor===text&&el._fitW===el.clientWidth)return;
    el._fitFor=text;el._fitW=el.clientWidth;
    el.style.removeProperty('--lfs');
    const box=el.clientWidth;if(!box||!text)return;
    const cs=getComputedStyle(el);
    const base=parseFloat(cs.fontSize)||12;
    if(!fitCv)fitCv=document.createElement('canvas').getContext('2d');
    const font=g=>cs.fontStyle+' '+cs.fontWeight+' '+g+'px '+cs.fontFamily;
    const words=text.split(/\s+/);
    fitCv.font=font(base);
    // Zwei Schranken: das längste Wort (sonst bricht nichts) und — bei einer
    // einzigen erlaubten Zeile — der ganze Satz.
    let need=Math.max.apply(null,words.map(w=>fitCv.measureText(w).width));
    if(maxLines===1)need=Math.max(need,fitCv.measureText(text).width);
    let size=need>box?Math.floor(base*box/need*10)/10:base;
    for(let pass=0;pass<6;pass++){
      fitCv.font=font(size);
      let lines=1,run=0;
      for(const w of words){
        const ww=fitCv.measureText(w).width;
        const sp=run?fitCv.measureText(' ').width:0;
        if(run&&run+sp+ww>box){lines++;run=ww;}else run+=sp+ww;
      }
      if(lines<=maxLines||size<=minSize)break;
      size=Math.max(minSize,Math.floor(size*.92*10)/10);
    }
    if(size<base)el.style.setProperty('--lfs',size+'px');
  }
  function paintHand(){
    const h=game.hero,K=KAY();if(!h)return;
    (cfg.slots||[]).forEach((s,i)=>{
      const b=cards[i];if(!b)return;
      const lbl=b.querySelector('.lbl'),cost=b.querySelector('.cost'),
            rr=b.querySelector('.rr'),tip=b.querySelector('.tip'),
            armed=b.querySelector('.armed'),num=b.querySelector('.num');
      let title=s.label||'',costN=0,spent=false,locked=false,empty=false,isArmed=false,rar=null,
          tipHtml='<b>'+esc(s.label)+'</b>';
      if(s.action==='kayfabe'){
        const idx=s.arg|0;
        if(idx>=h.slots){locked=true;empty=true;title='sealed';
          const pc=(typeof game.popCost==='function')?game.popCost('slot'):null;
          tipHtml='<b>'+esc(s.label)+'</b> <em>\u00b7 '+(pc!=null
            ? 'open the next act slot for '+pc+' POP'
            : 'a second act at LV 3, a third at LV 6')+'</em>';}
        else{
          const id=h.equipped&&h.equipped[idx],ab=id&&K&&K.ABILITIES[id];
          if(ab){title=ab.title||ab.key;costN=ab.cost||0;
            spent=(h.charges||0)<costN;
            isArmed=!!(h.buffs&&h.buffs[id]);
            rar=(K.RARITY&&K.RARITY[ab.rarity]&&K.RARITY[ab.rarity].color)||null;
            tipHtml='<b>'+esc(ab.title)+'</b> <em>\u00b7 '+costN+' charge'+(costN===1?'':'s')
              +(spent?' \u00b7 not enough':'')+'<br>'+esc(ab.hint||'')+'</em>';}
          else{title='empty';empty=true;
            tipHtml='<b>'+esc(s.label)+'</b> <em>\u00b7 right-click to deal one in</em>';}
        }
      }else if(s.action==='signature'){
        tipHtml='<b>'+esc(s.label)+'</b> <em>\u00b7 your heavy strike</em>';
      }else{
        tipHtml='<b>'+esc(s.label)+'</b> <em>\u00b7 key '+esc(s.key||'')+'</em>';
      }
      if(lbl.textContent!==title)lbl.textContent=title;
      fitLabel(lbl,title);
      if(tip.innerHTML!==tipHtml)tip.innerHTML=tipHtml;
      const ch=Array.from({length:costN},(_,k)=>
        '<i class="'+(k<(h.charges||0)?'':'off')+'"></i>').join('');
      if(cost.innerHTML!==ch)cost.innerHTML=ch;
      if(rar){rr.style.display='';rr.style.background=rar;}else rr.style.display='none';
      armed.style.display=isArmed?'':'none';
      num.style.opacity='';
      b.classList.toggle('spent',spent&&!empty);
      b.classList.toggle('locked',locked);
      b.classList.toggle('ghost',empty);
    });
    layoutHand();
  }

  /* ── Dein Blatt ──────────────────────────────────────────────────────────── */
  const hpBar=hero.querySelector('.bar.hp'),xpBar=hero.querySelector('.bar.xp'),
        hpn=hero.querySelector('.hpn'),xpn=hero.querySelector('.xpn'),
        duo=hero.querySelector('.duo'),identEl=hero.querySelector('.ident'),
        claimEl=hero.querySelector('.claim');
  const XP_NEED=lv=>10+5*(lv-1);
  /* »5.0 / 5« liest sich wie ein Rechenfehler, nicht wie Gesundheit. */
  /* Nur ZEITWEILIGE Auf- und Abschläge sind eine Zahl wert — dauerhaft Erspieltes
     steht einfach im Wert. WS1 setzt dafür h.tempStats[k]; ohne das Feld: nichts. */
  function mod(h,k){
    const t=h.tempStats&&h.tempStats[k];
    if(!t)return '';
    return '<i class="mod '+(t>0?'up':'dn')+'">('+(t>0?'+':'\u2212')+Math.abs(t)+')</i>';
  }
  /* WS1-Eingriff 9.8. (V10-S6h) · **Hier war die Wurzel, nicht in den Anzeigestellen.**
     `openPts` las `hero.skillPoints` — die **Brücke**, die 1 wird, sobald irgendetwas bezahlbar ist,
     und 0, sobald nichts mehr geht. Jede Stelle, die davon anzeigte, zeigte deshalb eine tote Zahl:
     »1 to spend« bei 29 POP im Beutel, während die billigste Anhebung 8 kostet — der Spieler könnte
     dreimal kaufen und das Blatt behauptet einmal.
     Vier Stellen einzeln zu reparieren wäre die fünfte Kopie gewesen. Jetzt gibt `openPts` den
     **Kontostand** zurück, wenn es einen gibt, und `waehrung` liefert das passende Wort. */
  const openPts=h=>Math.max(0,(h&&(h.pop!=null?h.pop
    :(h.skillPoints!=null?h.skillPoints:h.sp)))|0);
  const waehrung=h=>(h&&h.pop!=null)?'POP':'skill point';
  function fluffNow(h){
    const cur=h.hp/(h.maxhp/h.stats.fluff);
    if(h.hp>0&&cur<0.1)return '0.1';
    return Math.abs(cur-Math.round(cur))<0.05?String(Math.round(cur)):cur.toFixed(1);
  }
  function setBar(bar,pct){
    const i=bar.querySelector('i'),b=i.firstElementChild;
    const w=bar.clientWidth;
    if(w)b.style.setProperty('--track',w+'px');
    i.style.width=(Math.max(0,Math.min(1,pct))*100).toFixed(2)+'%';
  }
  /* Eine Messung, drei Konsequenzen — und nur dann, wenn sich wirklich etwas
     geändert hat, sonst rechnet die Uhr acht Mal pro Sekunde umsonst. */
  function layoutTop(){
    const W=root.clientWidth;if(W<200)return;
    const pad=parseFloat(getComputedStyle(root).getPropertyValue('--pad'))||10;
    const heroR=hero.offsetLeft+hero.offsetWidth;
    const mapW=mapCv.clientWidth||120, gap=9;
    const sig=W+'|'+heroR+'|'+mapW;
    if(root._topSig===sig)return;
    root._topSig=sig;
    const avail=W-pad-mapW-gap-heroR-pad;      // was zwischen Blatt und Karte frei ist
    const want=Math.min(382,Math.max(298,W*0.32));
    const tgtW=Math.round(Math.max(150,Math.min(want,avail-12)));
    tgtEl.style.width=tgtW+'px';
    /* Die Bühne steht in der BILDSCHIRMmitte, die Bahn liegt aber selten mittig.
       Also zählt nicht die rohe Lücke, sondern wie breit ein mittiges Band sein
       darf, ohne einen der beiden Nachbarn zu berühren. */
    const mid=W/2, tgtL=W-pad-mapW-gap-tgtW;
    const lane=Math.round(2*Math.min(mid-heroR,tgtL-mid)-16);
    const low=lane<200;
    root.classList.toggle('lowlane',low);
    root.style.setProperty('--midW',Math.max(160,lane)+'px');
    /* Eine Etage tiefer liegt die Karte noch immer daneben — auch dort bleibt die
       Bühne von ihr weg, statt sich unter sie zu schieben. */
    const mapL=W-pad-mapW;
    root.style.setProperty('--lowW',
      Math.max(200,Math.min(420,W*0.56,2*(mapL-mid)-16))+'px');
  }
  function paintHero(){
    const h=game.hero;if(!h)return;
    setBar(hpBar,h.hp/h.maxhp);
    /* Fluff IST die Lebenszahl. Ganze Punkte, wenn es ganze sind \u2014 \u00bb5.0 / 5\u00ab liest
       sich wie ein Rechenfehler, nicht wie Gesundheit. */
    const t=fluffNow(h)+mod(h,'fluff');
    if(hpn.innerHTML!==t)hpn.innerHTML=t;
    const need=XP_NEED(h.lv);
    setBar(xpBar,Math.min(1,h.xp/need));
    const xt=String(h.lv);
    if(xpn.textContent!==xt)xpn.textContent=xt;
    /* WS1-Eingriff 9.8. (V10-S6f): alle Werte des Runners, nicht zwei ausgewählte. Sechs Zahlen
       passen nicht als Wörter in 214 px — also **Kürzel aus drei Buchstaben** (Biz · Kay · Bin ·
       Bon · Bog · Blö; zwei Buchstaben kollidierten bei Bingo/Bongo/Boggle) in zwei Reihen à drei.
       Der volle Name steht im Tooltip. Kayfabe zeigt weiter die **Ladungen**, nicht den Rohwert —
       das ist die Zahl, die im Kampf zählt.
       **10.8.:** das Kürzel wird **gelesen** (`info[k].short`), nicht mehr aus dem Namen geschnitten.
       `slice(0,3)` hätte mit den kanonischen Etiketten Kay · Kay · Kay geliefert. Der Schnitt bleibt
       als Rückweg für einen Runner ohne `short` stehen. */
    /* WS1-Eingriff 9.8. (V10-S20): »Titel Name«, oder nur der Name. Eine Quelle: `OW_IDENT.wer()`
       — dieselbe, die die Mobs für ihre Schmährufe lesen. */
    if(identEl&&window.OW_IDENT){
      const I=window.OW_IDENT.get();
      const nb=identEl.querySelector('b'), ni=identEl.querySelector('i');
      if(nb.textContent!==I.name)nb.textContent=I.name;
      const t=I.titel?' \u00b7 '+I.titel:'';
      if(ni.textContent!==t)ni.textContent=t;
    }
    const keys=(typeof game.STAT_KEYS!=='undefined'&&game.STAT_KEYS)||['kayfabe','bizarro'];
    const info=game.STAT_INFO||{};
    const kurz=k=>(info[k]&&info[k].short)||((info[k]&&info[k].name)||k).slice(0,3);
    const wert=k=>k==='kayfabe'?((h.charges||0)+mod(h,'kayfabe')):(h.stats[k]+mod(h,k));
    const sig=keys.map(k=>k+':'+wert(k)).join('|');
    if(duo._sig!==sig){
      duo._sig=sig;
      duo.innerHTML=keys.map(k=>
        '<span title="'+esc((info[k]&&info[k].name)||k)+(info[k]&&info[k].line?' \u2014 '+esc(info[k].line):'')+'">'
        +'<span class="lab">'+esc(kurz(k))+'</span>'
        +'<b style="--sc:'+onPaper(col(k))+'">'+wert(k)+'</b></span>').join('');
    }
    /* WS1-Eingriff 9.8. (V10-S6f): das Siegel hing an `hero.skillPoints` — der **Brücke**, die 0
       wird, sobald nichts mehr bezahlbar ist. Mit POP im Beutel wäre es dann verschwunden, obwohl
       Geld da ist. Jetzt entscheidet der Kontostand, wenn es ihn gibt. */
    const p=openPts(h);   // seit S6h ist das der Kontostand, wenn es POP gibt
    claimEl.classList.toggle('on',p>0);
    if(p>0){
      const pb=claimEl.querySelector('b');
      if(pb.textContent!=='+'+p)pb.textContent='+'+p;
      /* WS1-Eingriff 9.8. (V10-S6f): die Währung heißt POP. »skill point« war das letzte Wort aus
         dem abgeschafften Modell im dauerhaft sichtbaren Panel. */
      claimEl.querySelector('span').textContent=
        waehrung(h)+(waehrung(h)==='POP'||p===1?'':'s')+' to spend';
      if(!claimEl._seen){claimEl._seen=true;ui('ui.almanac.pagein');wake(hero,4);}
    }else claimEl._seen=false;
    const zs=game.zones||[],done=zs.filter(z=>z.cleared).length;
    const hh=hero.offsetHeight;
    if(hh>20&&hh!==hero._h){hero._h=hh;root.style.setProperty('--rowH',hh+'px');}
    layoutTop();
    const tt='Level '+h.lv+' \u00b7 '+done+'/'+zs.length
      +' zones cleared \u2014 open the character sheet (C)';
    if(hero.title!==tt)hero.title=tt;
  }
  const openChar=()=>{renderChar();showWin(charWin,true);emit('openWindow',{name:'character'});};
  hero.onclick=openChar;
  /* Das Siegel führt dorthin, wo man die Punkte ausgibt — und nirgendwo sonst hin. */
  claimEl.onclick=e=>{e.stopPropagation();ui('ui.confirm');openChar();};
  claimEl.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();
    openChar();}};
  hero.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openChar();}};

  /* ── Dein Deck: der Stapel wächst sichtbar ───────────────────────────────── */
  let seen=0,fresh=new Set();
  function paintDeck(){
    const cs=game.collected||[],zs=game.zones||[],n=cs.length;
    const sigd=n+'/'+zs.length;
    if(stack._sig!==sigd){
      stack._sig=sigd;
      /* Zwei angedeutete Karten reichen, um »Stapel« zu sagen — mehr wäre Buchhaltung. */
      const fan=Math.min(Math.max(n-1,0),2);
      let html='';
      for(let k=fan;k>=1;k--)html+='<span class="pc" style="--k:'+k+'"></span>';
      const top=cs[n-1];
      html+='<span class="pc top" style="--k:0"><span class="ct">'
        +'<span class="band"></span><span class="body">'
        +(n?'<b>\u00bb'+esc(top&&top.t||'?')+'\u00ab</b>'
           :'<b class="mt">nothing secured</b>')
        +'</span></span>'
        +'<span class="ct2">'+n+'\u2009/\u2009'+zs.length+'</span>'
        +'<span class="lab">Almanac</span></span>';
      stack.innerHTML=html;
      const tb=stack.querySelector('.pc.top b');
      if(tb)requestAnimationFrame(()=>fitLabel(tb,tb.textContent,3));
      stack.classList.toggle('empty',!n);
      for(const pc of stack.querySelectorAll('.pc'))
        ik.attach(pc,{seed:53+ +pc.style.getPropertyValue('--k')*17,
          fill:pc.classList.contains('top')?PAPER_HI:PAPER});
    }
    if(n>seen){
      for(let i=seen;i<n;i++){fresh.add(cs[i]&&cs[i].t);flyIn(cs[i]);}
      seen=n;
      stack.classList.remove('pop');void stack.offsetWidth;stack.classList.add('pop');
      wake(stack,3);
      if(almWin.classList.contains('on'))renderAlmanac();
    }
  }
  function flyIn(card){
    if(!card)return;
    ui('ui.almanac.pagein');
    const f=document.createElement('div');f.className='v7-fly';
    f.innerHTML='\u00bb'+esc(card.t||'?')+'\u00ab';
    const hr=root.getBoundingClientRect(),ar=stack.getBoundingClientRect();
    const x0=hr.width/2-39,y0=hr.height*0.4;
    f.style.left=x0+'px';f.style.top=y0+'px';
    root.appendChild(f);
    const dx=(ar.left-hr.left+ar.width/2-39)-x0, dy=(ar.top-hr.top)-y0;
    f.animate([
      {transform:'translate(0,0) scale(.6) rotate(-4deg)',opacity:0},
      {transform:'translate(0,-20px) scale(1.08) rotate(1deg)',opacity:1,offset:.24},
      {transform:'translate(0,-14px) scale(1) rotate(0)',opacity:1,offset:.58},
      {transform:'translate('+dx+'px,'+dy+'px) scale(.3) rotate(8deg)',opacity:.2},
    ],{duration:1250,easing:'cubic-bezier(.3,.9,.2,1)'}).onfinish=()=>f.remove();
    setTimeout(()=>f.remove(),1500);
  }
  const openAlm=()=>{renderAlmanac();showWin(almWin,true,'ui.diary.open');
    emit('openWindow',{name:'almanac'});};
  stack.onclick=openAlm;
  stack.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openAlm();}};

  /* ── Fenster ─────────────────────────────────────────────────────────────── */
  let winSeed=0;
  function mkWin(title,sub){
    const w=document.createElement('div');w.className='v7-win';
    w.innerHTML='<div class="v7-box"><div class="ct">'
      +'<div class="wh"><div><h3>'+esc(title)+'</h3><em>'+esc(sub||'')+'</em></div>'
      +'<button class="icobtn close pe" title="close (Esc)">\u2715</button></div>'
      +'<div class="wb"></div></div></div>';
    root.appendChild(w);
    /* Eigener Seed je Fenster: alle drei standen auf 41, hatten also **dieselbe Kontur** — nur
       verschieden groß skaliert. Drei Blätter, eine Form. */
    ik.attach(w.querySelector('.v7-box'),{seed:41+(winSeed++)*23,fill:PAPER,penPx:2.1});
    const cb=w.querySelector('.close');
    cb.onclick=()=>showWin(w,false);
    w.addEventListener('click',e=>{if(e.target===w)showWin(w,false);});
    return w;
  }
  function showWin(w,on,openSfx){
    const was=w.classList.contains('on');
    w.classList.toggle('on',on);
    if(on){game._ow7Paused=true;game.paused=true;game.keys={};
      if(!was)ui(openSfx||'ui.window.open');
      ik.mark(w.querySelector('.v7-box'));}
    else{if(game._ow7Paused){game._ow7Paused=false;game.paused=false;}
      if(was)ui('ui.window.close');}
  }
  const charWin=mkWin('Character','who is telling this story');
  const almWin=mkWin('Fractal Almanac','the evidence, bound as pages');
  const setWin=mkWin('Settings','controls \u00b7 sound \u00b7 export');

  function pbtn(label,fn,cls,sfxName){
    const b=document.createElement('button');b.className='pbtn'+(cls?' '+cls:'');
    b.textContent=label;
    b.onclick=e=>{ui(sfxName||'ui.click');if(fn)fn(e);};
    return b;
  }

  function renderChar(){
    const h=game.hero,K=KAY();if(!h)return;
    const wb=charWin.querySelector('.wb');wb.innerHTML='';
    const actor=ACTORS.filter(a=>a.id===game.att.hero)[0];
    charWin.querySelector('h3').textContent=(actor&&actor.name)||'Character';
    const vit=document.createElement('div');vit.className='slab';
    vit.innerHTML='<div class="sub">Vitals</div>'
      +'<div style="display:flex;gap:12px;align-items:center;margin-top:8px">'
      +'<div style="flex:1"><div class="bar hp" style="height:14px"><i style="width:'
      +(Math.max(0,h.hp/h.maxhp)*100).toFixed(1)+'%"><b style="--track:320px"></b></i></div></div>'
      +'<b style="white-space:nowrap;font-family:\'Special Elite\',monospace">'
      +fluffNow(h)+' / '+h.stats.fluff+' Fluff</b></div>'
      /* WS1-Eingriff 9.8.: `h.lv` ist auf 1 eingefroren und `h.xp` auf 0 — diese Zeile las also
         für immer dasselbe. POP statt Level, wenn der Runner es führt. */
      +'<div style="margin-top:9px;font-size:11.5px;color:#5d4f38">'
      +(h.pop!=null
        ? h.pop+' POP to spend \u00b7 '+(h.popTotal||0)+' earned'
        : 'Level '+h.lv+' \u00b7 '+h.xp+' / '+XP_NEED(h.lv)+' XP')
      +' \u00b7 '+(h.charges||0)+' / '+h.stats.kayfabe
      +' Kayfabe charges \u00b7 '+h.slots+' act slot(s)</div>';
    wb.appendChild(vit);

    const acw=document.createElement('div');
    acw.innerHTML='<div class="sub">Avatar / actor</div>';
    const acts=document.createElement('div');acts.className='row';acts.style.marginTop='8px';
    ACTORS.forEach(a=>{
      const b=document.createElement('button');b.className='actor'+(game.att.hero===a.id?' on':'');
      b.innerHTML='<b>'+esc(a.name)+'</b><em>'+esc(a.line)+'</em>';
      b.onclick=()=>{ui('ui.select');game.setAttribute('hero',a.id);setTimeout(renderChar,60);};
      acts.appendChild(b);
    });
    acw.appendChild(acts);
    const sws=document.createElement('div');sws.className='swatches';sws.style.marginTop='9px';
    COLORS.forEach(([n,c])=>{
      const b=document.createElement('button');b.className='sw'+(game.att.color===n?' on':'');
      b.style.background=c;b.title=n;
      b.onclick=()=>{ui('ui.select');game.setAttribute('hero-color',n);setTimeout(renderChar,60);};
      sws.appendChild(b);
    });
    acw.appendChild(sws);wb.appendChild(acw);

    const pts=openPts(h);
    const skw=document.createElement('div');
    skw.innerHTML='<div class="sub">Borromean skills'
      +(pts?' \u00b7 <b style="color:#8c3a1e">'+pts+' '+waehrung(h)
        +(waehrung(h)==='POP'||pts===1?'':'s')+' to spend</b>':'')+'</div>';
    /* WS1-Eingriff 9.8. (V10-S6e) · **Die Liste war eine Kopie und ist jetzt eine Ableitung.**
       Sie stand hier fest eingetippt als Dreier — Resonance · Amplitude · **Frequency**. Der Runner
       kennt seit V10-S6 aber sechs Werte, und Fluff ist keiner davon, sondern die abgeleiteten
       Lebenspunkte. Also bot das Blatt eine Zeile mit einem »+«-Knopf an, der **grundsätzlich nie**
       funktionieren konnte: der Guard lehnte korrekt ab, aber der Spieler sah ein Angebot.
       Jetzt wird `game.STAT_KEYS`/`STAT_INFO` gelesen, wenn es sie gibt — und die eingetippte
       Dreierliste bleibt nur als Rückweg für einen Runner ohne POP stehen.
       *Ein Menü, das etwas anbietet, was der Kern ablehnt, ist eine zweite Wahrheit in Worten.* */
    const RAF=(function(){
      const keys=game.STAT_KEYS, info=game.STAT_INFO;
      if(keys&&keys.length&&info)
        return keys.map(k=>[k,(info[k]&&info[k].name)||k,(info[k]&&info[k].line)||'']);
      return [['kayfabe','Resonance','it echoes \u2014 one more charge, one more argument'],
              ['bizarro','Amplitude','the blow lands, the enemies get quiet'],
              ['fluff','Frequency','you last longer, even when nobody listens']];
    })();
    const list=document.createElement('div');
    list.style.cssText='display:flex;flex-direction:column;gap:7px;margin-top:8px';
    RAF.forEach(([k,n,line])=>{
      const d=document.createElement('div');d.className='skill';
      d.style.alignItems='center';
      d.innerHTML='<span class="dot" style="background:'+col(k)+'"></span>'
        +'<span style="flex:1"><b>'+n+' \u00b7 '+h.stats[k]+'</b><span>'+esc(line)+'</span></span>';
      if(pts){
        const plus=pbtn('+',()=>{spendPoint(k);},'hot','ui.confirm');
        plus.style.cssText+=';min-width:34px;padding:6px 0;text-align:center';
        d.appendChild(plus);
      }
      list.appendChild(d);
    });
    skw.appendChild(list);wb.appendChild(skw);

    if(K){
      const eq=document.createElement('div');
      eq.innerHTML='<div class="sub">Your hand \u2014 click to deal a different act</div>';
      const line=document.createElement('div');line.className='row';line.style.marginTop='8px';
      for(let i=0;i<3;i++){
        const c=document.createElement('span');c.className='chip';
        const id=i<h.slots&&h.equipped[i],ab=id&&K.ABILITIES[id];
        /* WS1-Eingriff 9.8.: Slots kosten POP, nicht Level. Der Preis kommt aus der einen
           Preisliste (`game.popCost`) — hier wird keine Zahl nachgebaut. */
        const pc=(typeof game.popCost==='function')?game.popCost('slot'):null;
        c.textContent=(i+1)+' \u00b7 '+(i>=h.slots
          ? (pc!=null?'sealed ('+pc+' POP)':'sealed')
          : (ab?ab.title:'empty'));
        if(i<h.slots)c.onclick=()=>{ui('ui.select');if(game.cycleSlot)game.cycleSlot(i);
          setTimeout(renderChar,80);};
        else c.style.opacity='.5';
        line.appendChild(c);
      }
      eq.appendChild(line);
      const spare=(h.unlocked||[]).filter(id=>(h.equipped||[]).indexOf(id)<0);
      const p=document.createElement('div');p.style.cssText='margin-top:8px;font-size:11px;color:#5d4f38';
      p.textContent=spare.length?'In the pool: '+spare.map(id=>K.ABILITIES[id].title).join(' \u00b7 ')
        :'Nothing spare in the pool yet.';
      eq.appendChild(p);wb.appendChild(eq);
    }
  }

  /* Ausgeben ist Sache des Spiels, sobald es das kann — sonst tut es das HUD selbst,
     damit die Belohnung nicht liegen bleibt. */
  function spendPoint(k){
    const h=game.hero;if(!h)return;
    /* WS1-Eingriff 9.8.: mit POP entscheidet der Preis, nicht ein Punktevorrat. `popSpend` gibt
       `{ok,note}` — und der Fehlschlag wird gemeldet, nicht verschluckt. */
    if(typeof game.popSpend==='function'){
      const r=game.popSpend('stat',k);
      if(game.msg&&r&&!r.ok)game.msg(r.note);
      emit('skillPointSpent',{stat:k,ok:!!(r&&r.ok)});
      setTimeout(renderChar,60);
      return;
    }
    if(openPts(h)<1)return;
    if(typeof game.spendSkillPoint==='function')game.spendSkillPoint(k);
    else{
      h.stats[k]=(h.stats[k]|0)+1;
      if(h.skillPoints!=null)h.skillPoints--;else if(h.sp!=null)h.sp--;
      if(k==='fluff'){
        const unit=h.maxhp/Math.max(1,h.stats.fluff-1);
        h.maxhp=h.stats.fluff*unit;h.hp+=unit;
      }
      if(k==='kayfabe')h.charges=Math.min(h.stats.kayfabe,(h.charges|0)+1);
      if(game.updateHud)game.updateHud();
    }
    emit('skillPointSpent',{stat:k,left:openPts(game.hero)});
    if(game.msg)game.msg('Skill point spent \u2014 '+k+' is now '+game.hero.stats[k]+'.');
    setTimeout(renderChar,60);
  }
  game.hudSpendPoint=spendPoint;

  function renderAlmanac(){
    const wb=almWin.querySelector('.wb');wb.innerHTML='';
    const zs=game.zones||[],cs=game.collected||[],caps=game.captions||{};
    almWin.querySelector('em').textContent=((game.deck&&game.deck.title)||'Kayfabizarro')
      +' \u00b7 '+cs.length+' of '+zs.length+' secured';
    const pages=document.createElement('div');pages.className='pages';
    zs.forEach(z=>{
      const d=document.createElement('div'),capt=caps[z.zseed];
      if(z.cleared){
        d.className='page'+(fresh.has(z.card&&z.card.t)?' fresh':'');
        d.style.setProperty('--c',moodOf(z));
        d.innerHTML='<span class="band"></span><b>\u00bb'+esc((z.card&&z.card.t)||'?')+'\u00ab</b>'
          +'<span>'+esc(z.biome)+'</span>'+(capt?'<q>'+esc(capt.text)+'</q>':'');
      }else{
        d.className='page sealed';
        d.innerHTML='<b>sealed</b><span>'+esc(z.biome)+' \u00b7 '+Math.max(0,z.alive)+' guards</span>';
      }
      pages.appendChild(d);
    });
    if(!zs.length){
      const n=document.createElement('div');n.className='slab';
      n.textContent='The island is still being drawn.';wb.appendChild(n);
    }
    wb.appendChild(pages);
    fresh.clear();
    const row=document.createElement('div');row.className='row';row.style.marginTop='4px';
    row.appendChild(pbtn('Tell the King a tall tale \u2192',()=>{
      showWin(almWin,false);
      if(game.openAfterglow)game.openAfterglow();
      else if(game.msg)game.msg('The King is not in the tavern yet.');
    },'hot','ui.confirm'));
    row.appendChild(pbtn('Journey diary (6)',()=>{showWin(almWin,false);openWindow('diary');},
      '','ui.tab'));
    wb.appendChild(row);
  }

  function renderSettings(){
    const wb=setWin.querySelector('.wb');wb.innerHTML='';
    const mk=(label,hint,val,fn,dis)=>{
      const r=document.createElement('div');r.className='skill';r.style.alignItems='center';
      r.innerHTML='<span style="flex:1"><b>'+esc(label)+'</b><span>'+esc(hint)+'</span></span>';
      const b=pbtn(val,fn,dis?'off':'','ui.toggle');
      b.style.minWidth='78px';if(dis)b.disabled=true;
      r.appendChild(b);wb.appendChild(r);return b;
    };
    const soundOn=game.audio?game.audio.enabled!==false:game.att.sound!==false;
    mk('Sound','UI, world foley and the ring announcer',soundOn?'ON':'OFF',()=>{
      const on=!(game.audio?game.audio.enabled!==false:game.att.sound!==false);
      game.att.sound=on;if(game.audio)game.audio.enabled=on;renderSettings();});
    mk('Ambient fade','the furniture rests until you look at it',cfg.ambient?'ON':'OFF',
      ()=>{cfg.ambient=!cfg.ambient;applyAmbient();saveCfg();renderSettings();});
    mk('Immersion','hide the whole table \u00b7 Tab',game.minimal?'ON':'OFF',()=>{
      game.minimal=!game.minimal;if(game.syncHudMode)game.syncHudMode();renderSettings();});
    mk('In-fight dialogue','guards quote their card \u2014 not while swinging',
      game.att.fightTalk==='off'?'OFF':'ON',()=>{
        game.att.fightTalk=game.att.fightTalk==='off'?'on':'off';renderSettings();});
    mk('Jukebox','waits for the music slice','LOCKED',null,true);
    const keys=document.createElement('div');
    keys.innerHTML='<div class="sub">Keys</div>';
    const kt=document.createElement('div');kt.className='slab';
    kt.style.cssText+=';font-size:11.5px;line-height:1.75;color:#463a27';
    kt.innerHTML='<b>WASD</b> / arrows move \u00b7 <b>right-click</b> walk or attack<br>'
      +'<b>1 2 3</b> play an act \u00b7 <b>4</b> signature<br>'
      +'<b>5</b> island \u00b7 <b>6</b> diary \u00b7 <b>C</b> character \u00b7 <b>N</b> almanac<br>'
      +'<b>+ \u2212</b> zoom \u00b7 <b>Tab</b> hide the table \u00b7 <b>Esc</b> close';
    keys.appendChild(kt);wb.appendChild(keys);
    const sep=document.createElement('div');sep.className='sub';sep.textContent='Hand config';
    wb.appendChild(sep);
    const pre=document.createElement('div');pre.className='slab';
    pre.style.cssText+=';font-family:ui-monospace,monospace;font-size:10.5px;white-space:pre-wrap;'
      +'max-height:150px;overflow:auto';
    pre.textContent=JSON.stringify({slots:cfg.slots},null,1);
    wb.appendChild(pre);
    const row=document.createElement('div');row.className='row';
    row.appendChild(pbtn('Copy config JSON',()=>{
      const t=JSON.stringify(cfg,null,2);
      try{navigator.clipboard.writeText(t);if(game.msg)game.msg('HUD config copied.');}
      catch(e){console.log(t);}
      emit('configChanged',cfg);},'','ui.confirm'));
    row.appendChild(pbtn('Reset to file',()=>{
      try{localStorage.removeItem(LS);}catch(e){}
      loadCfg().then(c=>{cfg=c;applyAmbient();buildHand();renderSettings();emit('configChanged',cfg);});
    },'','ui.back'));
    wb.appendChild(row);
  }
  function saveCfg(){try{localStorage.setItem(LS,JSON.stringify(cfg));}catch(e){}
    emit('configChanged',cfg);}

  ik.attach(gear,{seed:71,gain:1.35});
  const gearCt=gear.querySelector('.ct');
  if(P){const im=document.createElement('img');im.className='px';im.src=P.icon('gear');
    gearCt.appendChild(im);}
  else gearCt.textContent='\u2699';
  gear.onclick=()=>{const on=!setWin.classList.contains('on');
    ui('ui.gear');if(on)renderSettings();showWin(setWin,on,'ui.gear');gear.classList.toggle('on',on);};

  game.settingsEl={style:{
    get display(){return setWin.classList.contains('on')?'flex':'none';},
    set display(v){if(v==='none'&&setWin.classList.contains('on')){
      showWin(setWin,false);gear.classList.remove('on');}},
  }};
  game.syncSettings=()=>{if(setWin.classList.contains('on'))renderSettings();};

  /* ── Hilfe-Band ──────────────────────────────────────────────────────────── */
  game.helpOn=false;
  function setHelp(on){game.helpOn=on;if(gHint)gHint.classList.toggle('on',on);}
  game.setHelp=setHelp;
  if(gHint)gHint.innerHTML='WASD / arrows move \u00b7 <b>right-click</b> walk / attack \u00b7 '
    +'<b>1 2 3</b> acts \u00b7 <b>4</b> signature \u00b7 <b>5</b> island \u00b7 <b>6</b> diary \u00b7 '
    +'<b>C</b> character \u00b7 <b>N</b> almanac \u00b7 <b>+ \u2212</b> zoom \u00b7 <b>Tab</b> hide the table';

  /* ── Tasten ──────────────────────────────────────────────────────────────── */
  const byKey=k=>(cfg.slots||[]).findIndex(s=>String(s.key||'').toLowerCase()===k);
  function onKey(e){
    const t=e.target;
    if(t&&(t.tagName==='TEXTAREA'||t.tagName==='INPUT'))return;
    const k=(e.key||'').toLowerCase();
    if(k==='escape'){
      for(const w of [charWin,almWin,setWin])if(w.classList.contains('on')){
        showWin(w,false);gear.classList.remove('on');e.preventDefault();return;}
    }
    if(k==='h'){setHelp(!game.helpOn);ui('ui.toggle');return;}
    if(k==='c'){openWindow('character');return;}
    if(k==='n'){openWindow('almanac');return;}
    const i=byKey(k);
    if(i>=0){
      const s=cfg.slots[i];
      if(s.action==='kayfabe'){
        // Das Spiel feuert selbst — hier nur Bewegung und Klang, kein Doppel-Cast.
        const ok=canFire(s);juice(cards[i],ok);ui(ok?'ui.slot.resource':'ui.error');
      }else fire(s,i,e);
    }
  }
  window.addEventListener('keydown',onKey);

  const origSync=game.syncHudMode&&game.syncHudMode.bind(game);
  game.syncHudMode=function(){
    if(origSync)origSync();
    const lean=!!game.minimal&&!game.overview;
    root.style.display=game.overview?'none':'';
    root.classList.toggle('lean',lean);
    if(game.miniEl)game.miniEl.style.display='none';   // das Spiel-Mini-Panel bleibt fort
  };

  /* ── Die ruhige Uhr ──────────────────────────────────────────────────────── */
  let sig='';
  const timer=setInterval(()=>{
    if(!game.ready)return;
    mergeManifest();
    compass();
    if(root.style.display==='none')return;
    paintHero();paintHand();paintDeck();
    const tg=compass.target();
    const tb=tgtEl.querySelector('b'),te=tgtEl.querySelector('em');
    if(tg){
      const h=game.hero;
      const steps=h?Math.round(Math.hypot(tg.x-h.x,tg.y-h.y)/64):0;
      if(tb.textContent!==tg.label){tb.textContent=tg.label;}
      fitLabel(tb,tg.label,1,10);
      const nt=tg.note+' \u00b7 '+steps+(steps===1?' step':' steps');
      if(te.textContent!==nt)te.textContent=nt;
      tgtEl.style.display='';
    }else{tgtEl.style.display='none';}
    const h=game.hero;
    if(h){
      const s=[Math.round(h.hp),h.xp,h.lv,h.charges,(game.collected||[]).length,h.slots].join('|');
      if(sig&&s!==sig)wake(hero,2.4);
      sig=s;
    }
  },125);
  game._mmStop=()=>clearInterval(timer);

  /* ── Farben von außen (DC-Props über Attribute) ─────────────────────────── */
  function readAttrs(){
    const g=n=>game.getAttribute(n);
    const map={'c-fluff':'fluff','c-kayfabe':'kayfabe','c-bizarro':'bizarro','c-sig':'sig'};
    let dirty=false;
    for(const a in map){const v=g(a);if(v&&cfg.colors[map[a]]!==v){cfg.colors[map[a]]=v;dirty=true;}}
    const am=g('hud-ambient');
    if(am!=null){const on=am!=='false'&&am!=='0';if(on!==cfg.ambient){cfg.ambient=on;dirty=true;}}
    if(dirty){
      game.style.setProperty('--stat-fluff',cfg.colors.fluff);
      game.style.setProperty('--stat-kayfabe',cfg.colors.kayfabe);
      game.style.setProperty('--stat-bizarro',cfg.colors.bizarro);
      applyAmbient();
      (cfg.slots||[]).forEach((s,i)=>{if(cards[i])cards[i].style.setProperty('--c',col(s.color));});
      paintHand(true);
    }
  }
  const mo=new MutationObserver(readAttrs);
  mo.observe(game,{attributes:true});

  loadCfg().then(c=>{
    cfg=c;
    game.style.setProperty('--stat-fluff',cfg.colors.fluff);
    game.style.setProperty('--stat-kayfabe',cfg.colors.kayfabe);
    game.style.setProperty('--stat-bizarro',cfg.colors.bizarro);
    applyAmbient();buildHand();readAttrs();
    seen=(game.collected||[]).length;
    emit('configChanged',cfg);
  });
  game.hudConfig=()=>JSON.parse(JSON.stringify(cfg));
  game.hudSetConfig=c=>{cfg=Object.assign(cfg,c||{});applyAmbient();buildHand();saveCfg();};

  return {
    version:'hud-v7.0',
    sync(){if(setWin.classList.contains('on'))renderSettings();},
    shake:(t,f)=>game.hudShake(t,f),
    tick:compass,
    config:()=>game.hudConfig(),
    sfx:ui,
    destroy(){
      clearInterval(timer);mo.disconnect();ik.stop();
      window.removeEventListener('keydown',onKey);
      root.remove();st.remove();
      if(origSync)game.syncHudMode=origSync;
    },
  };
}

window.OW_HUD={version:'hud-v7.0',install,
  note:'Tisch & Hand — Papier mit schwarzer Blockkante. Blatt links oben, runder Kompass '
      +'mit einem Zielpfeil rechts oben, Karten-Hand unten mitte, Deck-Stapel + Zahnrad '
      +'unten rechts, Logbuch unten links. Kein Chat: es gibt keinen zweiten Spieler.'};
})();
window.OW_HUD_V7=window.OW_HUD;   // siehe hud-skin.js: zwei Skins, zwei Namen (V6-S11)
