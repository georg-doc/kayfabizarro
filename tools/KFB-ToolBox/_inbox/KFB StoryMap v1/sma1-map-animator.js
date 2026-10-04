// KFB Storytelling Map Animator · SMA1 — Source-backed Map Piece Animator
// FORK of tools/kfb-cartoon-map-board/src/app.js @ dadf2fa34cc3b64ae7177953387c91e6d3042bb4
//   copied verbatim: OpenPlanetData catalogue + fileUrl, CORE_CODES, EUROPE_BBOX/CENTER/MAP_SCALE,
//   project(), sampleRing/ringToProjected/polygonArea2D/centroid2D/makeShape, polygon keep rules,
//   extrude settings, makePaperTexture, makeInkRibbonGeometry/buildCountryInk, hashString/seeded01,
//   lights, fog, tone mapping, camera presets, explode spread, lerp constants.
// NAHT 1 — each country gets a centroid pivot wrapper so a single piece can rotate/stand up around
//          itself. The donor put every group at the origin with absolute coordinates.
// NAHT 2 — the ripple phase argument (see RIPPLE below).
// Donor pins and the full Q&A live in docs/SMA1-GATE.md.

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const MAP_PIN = 'dadf2fa34cc3b64ae7177953387c91e6d3042bb4';
const RAW = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/' + MAP_PIN + '/';
// raw.githubusercontent serves .mjs as text/plain and the browser then refuses the ES module.
// The donor board already loads its ink canon through jsDelivr for exactly this reason.
const CDN = 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@' + MAP_PIN + '/';
const OPENPLANET_API = 'https://download.openplanetdata.com/files?category=boundaries&subcategory=countries&limit=-1';
const OPENPLANET_BASE = 'https://download.openplanetdata.com';

const CORE_CODES = [
  'IS','IE','GB','PT','ES','FR','BE','NL','LU','DE','DK','NO','SE','FI','CH','AT','IT',
  'CZ','PL','SK','HU','SI','HR','BA','RS','RO','BG','GR','AL','ME','MK','TR','CY','MT',
  'EE','LV','LT','BY','MD','UA'
];
const EUROPE_BBOX = { minLon:-25, maxLon:42, minLat:34, maxLat:72 };
const CENTER = { lon:10, lat:51 };
const MAP_SCALE = 4.05;
const BOARD_W = 188, BOARD_H = 166, BOARD_DEPTH = 2.35, BOARD_TOP = BOARD_DEPTH;
const PIECE_DEPTH = 0.9, BASE_INK_WIDTH = 0.25;
const PIECE_Y = BOARD_TOP + 0.06;

/* ---------------------------------------------------------- Farbwelt
   OWNER: travel/travel-v16/terrain-v16/world-palettes.js @ main (georg-doc/kayfabizarro).
   Der Donor-Matrix-§6 und das Briefing nennen ihn und schließen die Tür ausdrücklich:
   "Do not invent a new palette owner." NAMED_PALETTES ist deshalb 1:1 übernommen —
   acht Farbwelten, je drei Stops, RGB 0..1, dunkles Tal → Mitte → leuchtende Spitze.

   NAHT · Der Owner liefert Verlaufs-Stops für einen Terrain-Shader, keinen kategorialen
   Satz für 40 aneinandergrenzende Kartenstücke. Die Stückfarben werden deshalb aus
   seiner Rampe ABGETASTET — dieselbe Lesart, die der Shader anwendet —, nicht neu
   erfunden. Der untere Bereich der Rampe (t < 0.22) bleibt außen vor: das dunkle Tal
   ist als Flächenfarbe eines Landes unlesbar. */
const NAMED_PALETTES = [
  { id: 'cubescape', name: 'Cubescape (CMY)',
    stops: [[0.02, 0.35, 0.42], [0.96, 0.86, 0.12], [0.92, 0.20, 0.72]] },
  { id: 'bubblegum', name: 'Bubblegum',
    stops: [[0.30, 0.06, 0.28], [0.96, 0.30, 0.55], [1.00, 0.86, 0.62]] },
  { id: 'toybox', name: 'Toybox',
    stops: [[0.06, 0.14, 0.42], [0.92, 0.22, 0.22], [1.00, 0.84, 0.16]] },
  { id: 'mint_pop', name: 'Mint Pop',
    stops: [[0.02, 0.24, 0.28], [0.16, 0.82, 0.62], [0.90, 1.00, 0.60]] },
  { id: 'sunset_arcade', name: 'Sunset Arcade',
    stops: [[0.16, 0.05, 0.30], [0.94, 0.34, 0.20], [1.00, 0.82, 0.34]] },
  { id: 'grape_soda', name: 'Grape Soda',
    stops: [[0.10, 0.04, 0.28], [0.72, 0.18, 0.82], [0.20, 0.86, 0.92]] },
  { id: 'seafoam', name: 'Seafoam',
    stops: [[0.03, 0.10, 0.24], [0.14, 0.62, 0.74], [0.86, 0.96, 0.90]] },
  { id: 'ember', name: 'Ember',
    stops: [[0.14, 0.02, 0.04], [0.88, 0.26, 0.10], [1.00, 0.80, 0.42]] },
];
// Der Pastellsatz des Map-Board-Donors bleibt als eigener Eintrag wählbar.
const DONOR_PASTEL = [
  0xe7b6a7, 0xf0d37c, 0xa8c9a7, 0x91bed1, 0xc8acd7,
  0xd7b99c, 0xa9d7ca, 0xe3a9ba, 0xb8c8e6, 0xc9d58d
];

function rampColor(stops, t){
  const u = Math.max(0, Math.min(1, t)) * 2;
  const i = u < 1 ? 0 : 1, f = u < 1 ? u : u - 1;
  const a = stops[i], b = stops[i + 1];
  const to8 = (v) => Math.max(0, Math.min(255, Math.round(v * 255)));
  return (to8(a[0] + (b[0] - a[0]) * f) << 16) | (to8(a[1] + (b[1] - a[1]) * f) << 8) | to8(a[2] + (b[2] - a[2]) * f);
}
const PALETTE_BY_ID = {};
for (const p of NAMED_PALETTES) PALETTE_BY_ID[p.id] = p;

function paletteList(id, n = 10){
  if (id === 'paper') return DONOR_PASTEL.slice();
  const p = PALETTE_BY_ID[id] || PALETTE_BY_ID.ember;
  const out = [];
  for (let i = 0; i < n; i++) out.push(rampColor(p.stops, 0.22 + (0.78 * i) / (n - 1)));
  return out;
}
/* ================================================== ATLAS · HAUPTTÖNE, GEBROCHEN
   Georg, 2026-09-21: „die farbverteilung ist nicht gut gelöst, verglichen mit anderen farbigen
   karten- und länder-darstellungen … gebrochene farben und haupt-töne … mehr farbstufen".

   Der Befund ist richtig und er trifft nicht die Färbung, sondern die Palette. Eine Terrain-Rampe
   ist EINE Farbfamilie: Dunkelrot → Glut → Butter. Zehn Stufen daraus sind zehn Schattierungen
   derselben Sache — die Karte liest als Heatmap, also als „die roten gehören zusammen". Keine
   Graphfärbung der Welt repariert das; die Trennung, die eine politische Karte braucht, ist
   TONTRENNUNG, nicht Helligkeitstrennung.

   Wie Atlanten es seit hundert Jahren machen: wenige HAUPTTÖNE, jeder stark GEBROCHEN (niedrige
   Sättigung, hohe Helligkeit), jeder in zwei, drei Stufen. Der Ton trennt die Nachbarn, die
   Bräune hält die Fläche ruhig genug für Tusche und Beschriftung.

   NAHT · der Paletten-Owner bleibt, aber er ist nicht mehr allein zuständig.
   `world-palettes.js` ist der Owner für TERRAIN — Verlaufs-Stops für einen Höhen-Shader. Für
   eine politische Karte gibt es dort keinen Satz, und einen zu erfinden wäre genau das, was das
   Briefing verbietet. Die Haupt-Töne kommen deshalb aus der Quelle, die dieses Projekt für
   kategoriale Farbe ohnehin besitzt: die Wash-Farben des KAYFABIZARRO-Systems (Modus-Farben,
   `--wash-*`), plus `--paper-stain` als achter Ton. Acht Hände, nicht erfunden, nur gebrochen.
   Die acht Rampen des Owners bleiben wählbar und heißen jetzt, was sie sind: Terrain-Rampen. */
/* ================================================== ATLAS-SÄTZE · KURATIERT
   Zwei Anläufe gerechnet, zwei Anläufe daneben — notiert, nicht weggeputzt:

   1. Gleichmäßig verteilte Töne auf hoher Helligkeit: zu pastellig, schwamm auf dem Meer.
   2. An die Wash-Farben geheftet: kräftiger, aber unharmonisch.

   Der Denkfehler steckt in beiden: eine Palette über den ganzen Farbkreis bei gleicher Sättigung
   ist RECHNERISCH optimal getrennt und sieht trotzdem zusammengewürfelt aus. Harmonie kommt
   nicht aus Abstand, sondern aus einem GETEILTEN Unterton und einem schmalen Helligkeitsband —
   und das lässt sich nicht ausrechnen, das wählt man. Also kuratierte Sätze, Hex für Hex.

   Und: das Wasser gehört zur Palette. Ein Atlas mit Cremetönen braucht ein helles Meer, ein
   Spielbrett ein tiefes. Jeder Satz bringt sein eigenes mit, statt gegen ein festes anzurennen. */
const ATLAS_SETS = [
  { id:'atlas-papier', name:'Atlas · Papier (helles Meer)', sea:0x9fbcc4, seabed:0x7d9aa3, tones:[
    ['ocker',   [0xe8cf9a,0xdcbc7a,0xc9a55f]],
    ['ziegel',  [0xe0ab96,0xcf8d76,0xb8705a]],
    ['salbei',  [0xc5cfa8,0xaebb8c,0x93a26f]],
    ['rose',    [0xe2bcc2,0xd29ea8,0xb9808d]],
    ['flieder', [0xcbc3da,0xb3a9c8,0x9a8fb2]],
    ['putty',   [0xded5c2,0xcbc0a9,0xb3a68d]],
  ]},
  /* Georgs Richtung: „ein buntes, harmonisch designtes Brettspielfeld für ein satirisches
     Cartoon-Game mit Underground-Comic-Anmutung“ — und ausdrücklich sättiger.
     Also Druckfarben statt Geologie: sieben flache Tinten, wie sie ein Siebdruck auf getöntes
     Papier legt. Die Harmonie kommt nicht aus wenig Sättigung, sondern aus dem geteilten warmen
     Unterton und einem schmalen Helligkeitsband — sechs Warme, EIN kühler Gegenpol (Immergrün-
     blau), damit die Fläche nicht zur Soße wird. Das Meer geht tiefer als vorher: gegen helle
     Tinten braucht es mehr Boden, sonst flimmert die Küste. */
  { id:'atlas-brett', name:'Spielbrett · Druckfarben (tiefes Meer)', sea:0x1a5257, seabed:0x114347, tones:[
    ['gold',    [0xf5cf55,0xe6b62c,0xcb9a18]],
    ['zinnober',[0xe87a4a,0xd6552c,0xb94120]],
    ['lehm',    [0xefa45c,0xdb8538,0xc06c26]],
    ['rose',    [0xe89aa0,0xd67d86,0xbd6470]],
    ['pflaume', [0xb877a2,0x9c5b85,0x82466c]],
    ['avocado', [0xa6bd57,0x8aa33e,0x748c2e]],
    ['veilchen',[0xa3a0d2,0x8a87bb,0x74719f]],
  ]},
  { id:'atlas-zine', name:'Zine · gedämpft (Papier & Tusche)', sea:0x2f5a5c, seabed:0x214446, tones:[
    ['bone',    [0xe9dfc4,0xdbcfae,0xc8bb97]],
    ['hase',    [0xe5c877,0xd4b258,0xbb9942]],
    ['blut',    [0xcf8b76,0xbd705c,0xa25a48]],
    ['moos',    [0xaebb8c,0x96a473,0x7d8a5d]],
    ['rauch',   [0xc2bcb0,0xa9a297,0x8f887d]],
  ]},
];
const ATLAS_BY_ID = {}; for(const s of ATLAS_SETS) ATLAS_BY_ID[s.id]=s;

function srgbToLin(c){ c/=255; return c<=0.04045 ? c/12.92 : Math.pow((c+0.055)/1.055,2.4); }
function oklab(hex){
  const r=srgbToLin((hex>>16)&255), g=srgbToLin((hex>>8)&255), b=srgbToLin(hex&255);
  const l=Math.cbrt(0.4122214708*r+0.5363325363*g+0.0514459929*b);
  const m=Math.cbrt(0.2119034982*r+0.6806995451*g+0.1073969566*b);
  const s=Math.cbrt(0.0883024619*r+0.2817188376*g+0.6299787005*b);
  return [ 0.2104542553*l+0.7936177850*m-0.0040720468*s,
           1.9779984951*l-2.4285922050*m+0.4505937099*s,
           0.0259040371*l+0.7827717662*m-0.8086757660*s ];
}
// Helligkeit höher gewichtet: auf der beschatteten Karte trägt sie weiter als der Ton.
const dE=(a,b)=>Math.hypot((a[0]-b[0])*1.6, a[1]-b[1], a[2]-b[2])*100;

function atlasPalette(id){
  const set=ATLAS_BY_ID[id]||ATLAS_SETS[0];
  const hex=[], fam=[], label=[];
  // Stufenweise, nicht tonweise einsortiert: so liegen die hellen Stufen aller Töne beieinander
  // und die Stufen-Balance in applyColours greift auf dem Index.
  const steps=set.tones[0][1].length;
  for(let t=0;t<steps;t++) for(let i=0;i<set.tones.length;i++){
    hex.push(set.tones[i][1][t]); fam.push(i); label.push(set.tones[i][0]+' '+(t+1));
  }
  return { hex, fam, label, sea:set.sea, seabed:set.seabed };
}

// Rampen behalten ihr Verhalten; jede Stufe ist ihre eigene „Familie“, weil eine Rampe keine hat.
function resolvePalette(id){
  if(ATLAS_BY_ID[id]) return atlasPalette(id);
  const hex=paletteList(id);
  return { hex, fam:hex.map((_,i)=>i), label:hex.map((_,i)=>String(i+1)), sea:0x1d5b60, seabed:0x13454a };
}

export const PALETTE_MENU = [
  ...ATLAS_SETS.map((s) => ({ id: s.id, name: s.name })),
  ...NAMED_PALETTES.map((p) => ({ id: p.id, name: 'Terrain-Rampe · ' + p.name })),
  { id: 'paper', name: 'Papier (Map-Board-Donor)' },
];

let PALETTE_NAME = 'atlas-brett';
let palette = [], PAL_FAM = [], PAL_LABEL = [], PAL_SEA = 0x1d5b60, PAL_SEABED = 0x13454a;
function usePalette(id){ const r=resolvePalette(id); palette=r.hex; PAL_FAM=r.fam; PAL_LABEL=r.label;
  PAL_SEA=r.sea; PAL_SEABED=r.seabed; }
usePalette(PALETTE_NAME);
const INK = 0x17131b;

/* ------------------------------------------------- donor maths (copied) */

function hashString(s){ let h=2166136261>>>0; for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);} return h>>>0; }
function seeded01(seed,n=0){ let x=(seed+Math.imul(n+1,0x9e3779b1))>>>0; x^=x<<13; x^=x>>>17; x^=x<<5; return (x>>>0)/4294967295; }
function project(lon,lat){ const cos=Math.cos(CENTER.lat*Math.PI/180); return { x:(lon-CENTER.lon)*cos*MAP_SCALE, z:-(lat-CENTER.lat)*MAP_SCALE }; }
function withinEuropeCentroid(coords){ let lon=0,lat=0,n=0; for(const p of coords){lon+=p[0];lat+=p[1];n++;} if(!n)return false; lon/=n;lat/=n;
  return lon>=EUROPE_BBOX.minLon&&lon<=EUROPE_BBOX.maxLon&&lat>=EUROPE_BBOX.minLat&&lat<=EUROPE_BBOX.maxLat; }
// KORREKTUR 2026-09-21 · Die Index-Dezimierung des Donors (jeder n-te Punkt, max 480) ist die
// Ursache der Dreieck-Keile quer durch Norwegen und Dänemark: an einem schmalen Fjord springt
// die Schrittweite von einem Ufer auf das gegenüberliegende, der Ring schneidet sich selbst,
// und earcut spannt die Fläche über die Selbstüberschneidung. Für die FLÄCHE wird deshalb gar
// nicht mehr dezimiert — die echte Kontur triangulieren ist einmalige Arbeit und kann sich
// nicht selbst schneiden. Nur ein absurd langer Ring wird bogenlängen-gleichmäßig gekürzt,
// und das ohne Index-Sprünge.
// 24 000 war die Obergrenze "praktisch nie greifen". Gemessen kostet das: earcut über die
// volle Küstenlinie blockiert den Hauptthread in Schüben über 10 s. Der Deckel darf zurück,
// weil das VERFAHREN jetzt ein anderes ist — bogenlängen-gleichmäßig statt Index-Schritt,
// also ohne den Fjord-Sprung, der die Selbstüberschneidung erzeugt hat. 2 500 Punkte sind
// auf einem 188-Einheiten-Brett deutlich feiner als ein Pixel.
const MAX_RING_POINTS = 2500;
function sampleRing(coords,maxPoints=MAX_RING_POINTS){
  const n=coords.length;
  if(n<=maxPoints) return coords;
  let total=0; const seg=new Array(n);
  for(let i=0;i<n;i++){ const p=coords[i],q=coords[(i+1)%n];
    seg[i]=Math.hypot(q[0]-p[0],q[1]-p[1]); total+=seg[i]; }
  if(total<=0) return coords;
  const out=[]; let acc=0, k=0, want=0; const stepLen=total/maxPoints;
  for(let i=0;i<n;i++){
    if(acc>=want){ out.push(coords[i]); want+=stepLen; }
    acc+=seg[i];
  }
  return out.length>=3?out:coords;
}
function ringToProjected(coords){ const s=sampleRing(coords); const a=s.map(p=>project(p[0],p[1]));
  if(a.length>1){ const f=a[0],l=a[a.length-1]; if(Math.abs(f.x-l.x)<1e-8&&Math.abs(f.z-l.z)<1e-8) a.pop(); } return a; }
function polygonArea2D(pts){ let a=0; for(let i=0;i<pts.length;i++){ const p=pts[i],q=pts[(i+1)%pts.length]; a+=p.x*q.z-q.x*p.z; } return a/2; }
function centroid2D(pts){ let a=0,cx=0,cz=0; for(let i=0;i<pts.length;i++){ const p=pts[i],q=pts[(i+1)%pts.length]; const c=p.x*q.z-q.x*p.z; a+=c; cx+=(p.x+q.x)*c; cz+=(p.z+q.z)*c; }
  if(Math.abs(a)<1e-6) return pts.reduce((s,p)=>({x:s.x+p.x/pts.length,z:s.z+p.z/pts.length}),{x:0,z:0});
  return { x:cx/(3*a), z:cz/(3*a) }; }
function makeShape(outer){ const s=new THREE.Shape(); outer.forEach((p,i)=>i?s.lineTo(p.x,-p.z):s.moveTo(p.x,-p.z)); s.closePath(); return s; }
function normalizeGeometryInput(g){ if(!g)return[]; if(g.type==='Polygon')return[g.coordinates]; if(g.type==='MultiPolygon')return g.coordinates; return []; }
function roundedRectShape(w,h,r){ const s=new THREE.Shape(); const x=-w/2,y=-h/2;
  s.moveTo(x+r,y); s.lineTo(x+w-r,y); s.quadraticCurveTo(x+w,y,x+w,y+r); s.lineTo(x+w,y+h-r);
  s.quadraticCurveTo(x+w,y+h,x+w-r,y+h); s.lineTo(x+r,y+h); s.quadraticCurveTo(x,y+h,x,y+h-r);
  s.lineTo(x,y+r); s.quadraticCurveTo(x,y,x+r,y); return s; }

function makePaperTexture(renderer, base='#d8c6a6', line='#ffffff'){
  const c=document.createElement('canvas'); c.width=c.height=256; const x=c.getContext('2d');
  let seed=hashString(base+'|'+line+'|kfb-paper-v1');
  const rnd=()=>{ seed^=seed<<13; seed^=seed>>>17; seed^=seed<<5; return (seed>>>0)/4294967295; };
  x.fillStyle=base; x.fillRect(0,0,256,256);
  const im=x.getImageData(0,0,256,256);
  for(let i=0;i<im.data.length;i+=4){ const n=(rnd()-0.5)*15;
    im.data[i]=Math.max(0,Math.min(255,im.data[i]+n));
    im.data[i+1]=Math.max(0,Math.min(255,im.data[i+1]+n));
    im.data[i+2]=Math.max(0,Math.min(255,im.data[i+2]+n)); }
  x.putImageData(im,0,0);
  x.globalAlpha=0.08; x.strokeStyle=line; x.lineWidth=1;
  for(let i=0;i<90;i++){ x.beginPath(); const y=rnd()*256; x.moveTo(-10,y);
    x.bezierCurveTo(60,y+(rnd()-.5)*9,180,y+(rnd()-.5)*9,270,y); x.stroke(); }
  const t=new THREE.CanvasTexture(c); t.colorSpace=THREE.SRGBColorSpace;
  t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(4,3);
  t.anisotropy=Math.min(8, renderer.capabilities.getMaxAnisotropy());
  return t;
}

/* ============================ KFB INK · Kanon-Band =========================
   SSOT: skills/kfb-ink-canon.js @ main (INK_CANON_VERSION 2) — geladen über jsDelivr.
   Die eine Regel des Kanons: BAND (brushLoop + inkRibbon2D) für alles, was Karte, Panel
   oder Schnittkante ist. "Eine gestrichene Polylinie mit Punktrauschen kann nie wie ein
   Pinselband aussehen" — genau das war die geerbte Kante des Map-Board-Donors.

   Übernommen, nicht nachgerechnet:
   · Bogenlängen-Parametrisierung  th = cum/total * 2π
   · zwei langwellige Sinus        a1=(rnd()*3+2)*bow, f1=⌊rnd()*3+3⌋ · a2=(rnd()*1.6+0.8)*bow, f2=⌊rnd()*4+6⌋
   · Punkt-Jitter als TEXTUR       tj = (rnd()-0.5)*1.4*wob
   · Feder                         hb, mod = 0.62·sin(k1θ+q1)+0.38·sin(k2θ+q2), diag, taper, edge, minHalf
   · Gehrung im Band               ext = half / max(m·n1, 0.35) * s
   · mulberry(seed) als RNG
   · bow = 1.4 × 0.14 = 0.196 — DIE Zahl (ein Port, der die Signatur statt der Aufrufstelle
     liest, baucht die Kante siebenfach: "Bend statt ink")

   ZWEI NÄHTE, beide benannt:
   N-A · Der Kanon baut ein RECHTECK mit festen Ecken und Corner-Fade. Eine Landeskontur ist
         ein geschlossener, überall gekrümmter Ring — es gibt keine Ecke, zu der ausgefadet
         werden müsste. fade = 1 über den ganzen Umfang.
   N-B · hb ist im Kanon relativ zu min(W,H) EINER Karte, die ihren Rahmen füllt. Auf einem
         Brett mit 40 Stücken muss die Feder überall dieselbe sein (die eine Regel: "eine
         gezeichnete Linie auf Papier hat überall dieselbe Feder"). Sie wird deshalb EINMAL
         gegen eine Referenzausdehnung kalibriert, nicht pro Land. Die Bauchung dagegen ist
         eine Form-Kennzahl und bleibt relativ zur eigenen Ausdehnung des Stücks.
   ========================================================================= */

const INK_UNIT = 19;          // N-B · Referenzausdehnung in Welteinheiten (~mittelgroßes Land)
let CANON = null;             // die echte skills/kfb-ink-canon.js
let INK_STATUS = 'lädt';
let INK_PRESET = 'ink';       // ink · bend · torn — Default ist Ink, für alle Kanten
let INK_GAIN = 1;

const PRESET_MAP = { ink:'card', bend:'academy-2026-07', torn:'sky-2026-07' };
function inkPreset(){
  if(!CANON) return null;
  return CANON.INK_PRESETS[PRESET_MAP[INK_PRESET]] || CANON.INK_PRESETS.card;
}

// gleichmäßige Abtastung entlang der Bogenlänge — ungleich verteilte Quellpunkte sind der
// zweite Grund, warum die Donor-Kante eckig las
function resampleRing(pts, step){
  // Doppelte / fast doppelte Punkte zuerst raus: zwei identische Punkte hintereinander
  // machen die Normale undefiniert, und daraus wird im Band eine lange gerade Zacke.
  const clean=[];
  for(const p of pts){
    const q=clean[clean.length-1];
    if(!q || Math.hypot(p.x-q.x,p.z-q.z)>1e-6) clean.push(p);
  }
  if(clean.length>2){
    const f=clean[0], l=clean[clean.length-1];
    if(Math.hypot(f.x-l.x,f.z-l.z)<1e-6) clean.pop();
  }
  pts=clean;
  const n=pts.length; if(n<3) return pts;
  const seg=[], cum=[0];
  for(let i=0;i<n;i++){ const p=pts[i],q=pts[(i+1)%n]; const d=Math.hypot(q.x-p.x,q.z-p.z); seg.push(d); cum.push(cum[i]+d); }
  const total=cum[n]; if(total<=0) return pts;
  const count=Math.max(12,Math.round(total/step));
  const out=[]; let k=0;
  for(let i=0;i<count;i++){
    const t=total*i/count;
    while(k<n-1 && cum[k+1]<t) k++;
    const p=pts[k], q=pts[(k+1)%n];
    const u=seg[k]>1e-9?(t-cum[k])/seg[k]:0;
    out.push({ x:p.x+(q.x-p.x)*u, z:p.z+(q.z-p.z)*u });
  }
  return out;
}

// Kanon-Band auf einem beliebigen geschlossenen Ring, in Weltkoordinaten.
function makeInkBandGeometry(ring, y, seed, bbox, gain){
  const p=inkPreset();
  if(!p||ring.length<3) return null;
  const extent=Math.max(bbox.w,bbox.h);
  const px2u=extent/p.refW;                       // Kanon rechnet in px des Baurahmens
  const stroke=p.family!=='band';

  const pts=resampleRing(ring, Math.max(0.12, p.step*px2u));
  const N=pts.length;
  const rnd=CANON.mulberry(seed|0);

  const cum=[0];
  for(let i=1;i<N;i++) cum[i]=cum[i-1]+Math.hypot(pts[i].x-pts[i-1].x,pts[i].z-pts[i-1].z);
  const total=cum[N-1]+Math.hypot(pts[0].x-pts[N-1].x,pts[0].z-pts[N-1].z)||1;

  let out;
  if(stroke){
    // TORN · Strich-Familie: unabhängiger Versatz auf beiden Achsen, kein Glätten
    const jit=p.jit*px2u;
    out=pts.map(q=>({ x:q.x+(rnd()-0.5)*2*jit, z:q.z+(rnd()-0.5)*2*jit }));
  } else {
    const A=p.wob, B=p.bow;
    const a1=(rnd()*3+2)*B*px2u, f1=Math.floor(rnd()*3+3), q1=rnd()*6.283;
    const a2=(rnd()*1.6+0.8)*B*px2u, f2=Math.floor(rnd()*4+6), q2=rnd()*6.283;
    out=[];
    for(let i=0;i<N;i++){
      const pp=pts[(i-1+N)%N], cc=pts[i], pn=pts[(i+1)%N];
      const tx=pn.x-pp.x, tz=pn.z-pp.z, tl=Math.hypot(tx,tz)||1;
      const nx=-tz/tl, nz=tx/tl, th=(cum[i]/total)*Math.PI*2;
      const w=a1*Math.sin(f1*th+q1)+a2*Math.sin(f2*th+q2);   // N-A · fade = 1
      const tj=(rnd()-0.5)*1.4*A*px2u;
      out.push({ x:cc.x+nx*w+tj, z:cc.z+nz*w+tj });
    }
  }

  // Feder
  const M=out.length, c2=[0];
  for(let i=1;i<M;i++) c2[i]=c2[i-1]+Math.hypot(out[i].x-out[i-1].x,out[i].z-out[i-1].z);
  const tot2=c2[M-1]||1;
  const r2=CANON.mulberry((seed*7+5)|0);
  const k1=3+Math.floor(r2()*3), s1=r2()*6.283, k2=8+Math.floor(r2()*6), s2=r2()*6.283;
  let halfFn;
  if(stroke){
    const small=Math.min(bbox.w,bbox.h);
    const hw=Math.min(p.baseW*0.5*(INK_UNIT/p.refW)*(gain||1), Math.max(small*0.055,0.035));
    halfFn=()=>hw;
  } else {
    // N-C · Eine Feder für das ganze Brett — aber gedeckelt, damit winzige Länder nicht
    // in ihrer eigenen Kontur ersaufen (gemessen am Balkan: Montenegro ist schmaler als
    // zwei Federbreiten). Die Deckelung greift NUR unterhalb der Referenzausdehnung.
    const small=Math.min(bbox.w,bbox.h);
    const hb=Math.min(INK_UNIT*p.hb*(gain||1), Math.max(small*0.055, 0.035));
    const minHalf=Math.min(p.minHalf*(INK_UNIT/p.refW), hb*0.6);
    halfFn=(i)=>{
      const th=c2[i]/tot2*Math.PI*2;
      const mod=0.62*Math.sin(k1*th+s1)+0.38*Math.sin(k2*th+s2);
      const u=(out[i].x-bbox.x0)/(bbox.w||1), v=(out[i].z-bbox.z0)/(bbox.h||1);
      const diag=1+p.edge*((u*0.42+v*0.58)-0.5);
      return Math.max(minHalf, hb*(1+p.taper*mod*0.5)*diag);
    };
  }

  // Band mit Gehrung — dieselbe Offsetformel wie inkRibbon2D
  const verts=[], idx=[];
  const off=(j,s)=>{
    const pp=out[(j-1+M)%M], cc=out[j], pn=out[(j+1)%M];
    let d1x=cc.x-pp.x, d1z=cc.z-pp.z; const l1=Math.hypot(d1x,d1z)||1; d1x/=l1; d1z/=l1;
    let d2x=pn.x-cc.x, d2z=pn.z-cc.z; const l2=Math.hypot(d2x,d2z)||1; d2x/=l2; d2z/=l2;
    const n1x=-d1z, n1z=d1x, n2x=-d2z, n2z=d2x;
    let mx=n1x+n2x, mz=n1z+n2z; const ml=Math.hypot(mx,mz)||1; mx/=ml; mz/=ml;
    const h=halfFn(j);
    // Gehrung begrenzen: bei fast antiparallelen Segmenten (Fjord-Spitzen, Inselzipfel)
    // läuft der Gehrungsfaktor gegen unendlich — das waren die geraden Zacken quer
    // durch Norwegen und Dänemark. Der Kanon fängt das mit max(...,0.35) ab; auf einer
    // Küstenlinie reicht das nicht, also zusätzlich eine harte Deckelung auf 2.2 × Feder.
    const ext=Math.min(h/Math.max(mx*n1x+mz*n1z,0.35), h*2.2)*s;
    return [cc.x+mx*ext, cc.z+mz*ext];
  };
  for(let i=0;i<M;i++){
    const o=off(i,1), n=off(i,-1);
    verts.push(o[0],y,o[1], n[0],y,n[1]);
  }
  for(let i=0;i<M;i++){ const j=(i+1)%M; const A0=i*2,B0=i*2+1,C0=j*2,D0=j*2+1; idx.push(A0,B0,C0,B0,D0,C0); }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));
  g.setIndex(idx); g.computeVertexNormals();
  return g;
}

function fileUrl(f){ return OPENPLANET_BASE+'/'+f.remote_path+'/'+f.remote_version+'/'+f.remote_filename; }
async function fetchJson(url,{timeoutMs=12000,retries=1,cache='force-cache'}={}){
  let last=null;
  for(let a=0;a<=retries;a++){
    const ctrl=new AbortController();
    const t=setTimeout(()=>ctrl.abort(new Error('timeout')),timeoutMs);
    try{
      // Der AbortController kündigt in dieser Umgebung nachweislich NICHT: gemessene
      // Ressourcenzeiten von 150–250 s bei deklarierten 12 s. Deshalb zusätzlich ein Rennen
      // gegen einen Timer — die Anfrage mag weiterlaufen, der Worker-Slot wird frei.
      const r=await Promise.race([
        fetch(url,{mode:'cors',cache,signal:ctrl.signal}),
        new Promise((_,rej)=>setTimeout(()=>rej(new Error('timeout '+timeoutMs+'ms (soft)')),timeoutMs+50))
      ]);
      if(!r.ok) throw new Error('HTTP '+r.status);
      return await r.json();
    }
    catch(e){ last=e; if(a<retries) await new Promise(res=>setTimeout(res,250*(a+1))); }
    finally{ clearTimeout(t); }
  }
  throw new Error('fetchJson failed: '+url+' · '+String(last?.message||last));
}
async function mapLimit(items,limit,fn){ let i=0; await Promise.all(Array.from({length:Math.min(limit,items.length)},async()=>{ while(i<items.length){ const k=i++; await fn(items[k],k); } })); }

/* ---------------------------------------------------------- loop driver */
// rAF fires once in the design preview and stops (see docs/SMA1-GATE.md). An animator needs a
// real clock, so the driver watches rAF and falls back to a timer if it never comes back.
function startLoop(step){
  // Ein Zeitstempel, zwei Treiber. setInterval ist der VERLÄSSLICHE — rAF steht in dieser
  // Umgebung nach ein paar Frames still, und die vorige Fassung prüfte das nur EINMAL nach
  // 400 ms: da war rAF noch am Leben, der Timer wurde nie installiert, und als rAF danach
  // aufhörte, lief nichts mehr. Tweens, Kamera, Wasseruhr und die Freiraum-Prüfung hingen
  // alle daran. Der dt-Deckel unten verhindert Doppelschritte, wenn beide Treiber laufen.
  let last=performance.now();
  const tick=()=>{
    const t=performance.now();
    const dt=(t-last)/1000;
    if(dt<0.008) return;
    last=t;
    step(Math.min(0.05,dt));
  };
  const timer=setInterval(tick,16);
  const frame=()=>{ tick(); requestAnimationFrame(frame); };
  requestAnimationFrame(frame);
  return ()=>clearInterval(timer);
}

/* ------------------------------------------------------------- easings */
const EASE = {
  linear:t=>t,
  out:t=>1-Math.pow(1-t,3),
  inOut:t=>t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,
  back:t=>{ const c1=1.70158,c3=c1+1; return 1+c3*Math.pow(t-1,3)+c1*Math.pow(t-1,2); },
  anticipate:t=>{ const c=1.9; return t<0.28 ? -(t/0.28)*0.12 : (()=>{ const u=(t-0.28)/0.72; return -0.12+1.12*(1-Math.pow(1-u,3)*Math.cos(u*0.0)) ; })(); }
};

/* ============================================================== builder */

export async function mount(opts={}) {
  const status = opts.onStatus || (()=>{});
  const onState = opts.onState || (()=>{});

  const views = {};
  let boardTopMat=null;
  function makeView(id, {fov=40, bg=0x2b2533, fogNear=175, fogFar=370, shadow=2048}={}) {
    const host=document.querySelector('#'+id);
    if(!host) return null;
    const canvas=document.createElement('canvas');
    canvas.style.cssText='display:block;width:100%;height:100%;touch-action:none';
    host.prepend(canvas);
    const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,preserveDrawingBuffer:true});
    renderer.setPixelRatio(Math.min(devicePixelRatio,2));
    renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.03;
    const scene=new THREE.Scene();
    scene.background=new THREE.Color(bg);
    if(fogFar) scene.fog=new THREE.Fog(bg,fogNear,fogFar);
    const camera=new THREE.PerspectiveCamera(fov,1,0.1,4000);
    const controls=new OrbitControls(camera,canvas);
    controls.enableDamping=true; controls.dampingFactor=0.065;
    controls.zoomToCursor=true;                 // Zoom folgt dem Cursor, nicht der Bildmitte
    controls.enablePan=true; controls.panSpeed=0.9; controls.screenSpacePanning=false;
    controls.zoomSpeed=0.9;
    controls.mouseButtons={ LEFT:THREE.MOUSE.ROTATE, MIDDLE:THREE.MOUSE.DOLLY, RIGHT:THREE.MOUSE.PAN };
    controls.touches={ ONE:THREE.TOUCH.ROTATE, TWO:THREE.TOUCH.DOLLY_PAN };
    scene.add(new THREE.HemisphereLight(0xfff5dd,0x413b50,1.9));
    const key=new THREE.DirectionalLight(0xfff0d4,4.1);
    key.position.set(-80,120,-95); key.castShadow=true; key.shadow.mapSize.set(shadow,shadow);
    key.shadow.camera.left=-130; key.shadow.camera.right=130;
    key.shadow.camera.top=115; key.shadow.camera.bottom=-115; key.shadow.bias=-0.00015;
    scene.add(key);
    const rim=new THREE.DirectionalLight(0x83a8d6,0.8); rim.position.set(110,60,90); scene.add(rim);
    const v={id,host,canvas,renderer,scene,camera,controls,goalPos:new THREE.Vector3(),goalTarget:new THREE.Vector3(),tween:false};
    controls.addEventListener('start',()=>{v.tween=false;});
    v.ro=new ResizeObserver(()=>resizeView(v)); v.ro.observe(host);
    resizeView(v);
    views[id]=v;
    return v;
  }
  function resizeView(v){
    const r=v.host.getBoundingClientRect();
    const w=Math.max(2,Math.floor(r.width||v.host.clientWidth||2));
    const h=Math.max(2,Math.floor(r.height||v.host.clientHeight||2));
    if(v.lw===w&&v.lh===h) return;
    v.lw=w; v.lh=h;
    v.renderer.setSize(w,h,false);
    v.camera.aspect=w/h; v.camera.updateProjectionMatrix();
  }

  try {
    CANON = await import(CDN + 'skills/kfb-ink-canon.js');
    INK_STATUS = 'Kanon v' + CANON.INK_CANON_VERSION;
  } catch (err) {
    INK_STATUS = 'INK CANON FAILED · ' + (err?.message || err);
  }

  const board = makeView('sma-board');
  // Die zwei Nebenblicke zeigen EIN Stück bzw. EIN Modell und brauchen die Brett-Schattenkarte
  // nicht: 3 × 2048² waren rund 150 MB Schattenspeicher und die Quelle des OOM im Ladelauf.
  const isoView = makeView('sma-piece', {fov:36, bg:0x231f2b, fogFar:0, shadow:512});
  const lmView  = makeView('sma-landmark', {fov:45, bg:0x262230, fogFar:0, shadow:512});
  if(!board) throw new Error('SMA1: board host missing');

  board.camera.position.set(35,128,155);
  board.controls.minDistance=40; board.controls.maxDistance=420;
  board.controls.maxPolarAngle=Math.PI*0.47;
  board.controls.target.set(0,4,-5);

  const boardTexture=makePaperTexture(board.renderer,'#72bcca','#e9ffff');
  const countryTexture=makePaperTexture(board.renderer,'#eee1c7','#ffffff');

  const root=new THREE.Group(); board.scene.add(root);
  (function createBoard(){
    const g=new THREE.ExtrudeGeometry(roundedRectShape(BOARD_W,BOARD_H,8),
      {depth:BOARD_DEPTH,bevelEnabled:true,bevelSize:1.1,bevelThickness:0.8,bevelSegments:3,curveSegments:5});
    g.rotateX(-Math.PI/2);
    const top=new THREE.MeshStandardMaterial({color:PAL_SEABED,map:boardTexture,roughness:0.98,metalness:0,side:THREE.DoubleSide});
    boardTopMat=top;
    const side=new THREE.MeshStandardMaterial({color:0x536b76,roughness:0.96,metalness:0});
    const m=new THREE.Mesh(g,[top,side]); m.receiveShadow=true; m.castShadow=true; m.position.y=-0.02; root.add(m);
    const under=new THREE.Mesh(new THREE.CylinderGeometry(96,104,4.5,8,1,false,Math.PI/8),
      new THREE.MeshStandardMaterial({color:0x45384d,roughness:1}));
    under.scale.z=0.76; under.position.y=-3.8; under.rotation.y=Math.PI/8; under.receiveShadow=true; root.add(under);
  })();

  const pieces=[]; const pickMeshes=[];
  // Das Wasser gehört zur Palette: ein Cremeton-Atlas braucht ein helles Meer, ein Spielbrett
  // ein tiefes. Der Deckel ist Meeresgrund — er muss mitwandern, sonst kämpft jede Palette
  // gegen ein festes Teal, und genau das war Georgs „funktioniert nicht mit dem wasser“.
  let selected=null;
  let autoPick=false;
  let paletteOn=true;
  let edgeMode='outline';                 // vor pushState() deklariert — sonst TDZ
  let edgeHeight=1;
  const PAPER=new THREE.Color(0xe6dcc2);


  // EIN Bauweg für GeoJSON und Schnappschuss — Wort für Wort derselbe Code.
  function buildPiece(code, name, polygons, seed){
    const centroid=centroid2D(polygons.slice().sort((a,b)=>Math.abs(polygonArea2D(b.outer))-Math.abs(polygonArea2D(a.outer)))[0].outer);
    const totalArea=polygons.reduce((s,p)=>s+Math.abs(polygonArea2D(p.outer)),0);

    // the donor keeps every group at the origin; a single piece cannot rotate around itself there
    const pivot=new THREE.Group();
    pivot.position.set(centroid.x, PIECE_Y, centroid.z);
    const inner=new THREE.Group();
    inner.position.set(-centroid.x, 0, -centroid.z);
    pivot.add(inner);

    const color=palette[seed%palette.length];
    const topMat=new THREE.MeshStandardMaterial({color,map:countryTexture,roughness:0.98,metalness:0,side:THREE.DoubleSide});
    topMat.emissive=new THREE.Color(0x000000);
    // Combat Arena arena-ring.v1.js: Seiten SCHWARZ wie die Tusche (#1f1a14, roughness 0.92),
    // nicht abgedunkelte Fläche — die beleuchtete Kante war dort der weiße Blitzer an der Kontur.
    const sideMat=new THREE.MeshStandardMaterial({color:0x1f1a14,roughness:0.92,metalness:0});
    topMat.polygonOffset=true; topMat.polygonOffsetFactor=-1; topMat.polygonOffsetUnits=-1;
    const inkMat=new THREE.MeshBasicMaterial({color:INK,side:THREE.DoubleSide,depthWrite:false,toneMapped:false});

    const rec={ code,name,pivot,inner,centroid,totalArea,seed,polygons,topMat,sideMat,inkMat,baseColor:color,
      meshes:[],inkMeshes:[],bases:[],landmark:null,
      canonical:{ p:new THREE.Vector3(centroid.x,PIECE_Y,centroid.z), q:new THREE.Quaternion(), s:new THREE.Vector3(1,1,1) },
      ripple:{ on:false, t:0, cx:0, cz:0 } };

    for(const poly of polygons){
      const geom=new THREE.ExtrudeGeometry(makeShape(poly.outer),
        {depth:PIECE_DEPTH,bevelEnabled:true,bevelSize:0.035,bevelThickness:0.045,bevelSegments:1,curveSegments:2});
      geom.rotateX(-Math.PI/2);
      const mesh=new THREE.Mesh(geom,[topMat,sideMat]);
      mesh.castShadow=true; mesh.receiveShadow=true; mesh.userData.country=rec;
      inner.add(mesh); rec.meshes.push(mesh); pickMeshes.push(mesh);
      rec.bases.push(geom.attributes.position.array.slice());
    }
    rec.bbox=(()=>{ let x0=1e9,x1=-1e9,z0=1e9,z1=-1e9;
      for(const poly of polygons) for(const p of poly.outer){ x0=Math.min(x0,p.x);x1=Math.max(x1,p.x);z0=Math.min(z0,p.z);z1=Math.max(z1,p.z); }
      return {x0,z0,w:x1-x0,h:z1-z0}; })();
    buildInk(rec);

    inner.scale.y=edgeHeight;
    root.add(pivot);
    pivot.updateMatrixWorld(true);
    rec.restBox=new THREE.Box3().setFromObject(inner);
    pieces.push(rec);
    return rec;
  }

  // Aus einem Schnappschuss: identischer Bauweg wie addCountry, nur sind die Ringe schon
  // projiziert. EINE Bau-Funktion wäre schöner; sie hätte aber zwei Eingangsformate zu
  // unterscheiden, und genau das ist die Stelle, an der zwei Wahrheiten entstehen.
  function addCountryFromRings(p){
    const unflat=(a)=>{ const r=[]; for(let i=0;i<a.length;i+=2) r.push({x:a[i],z:a[i+1]}); return r; };
    const polygons=(p.polygons||[]).map(poly=>({
      outer:unflat(poly.outer),
      holes:(poly.holes||[]).map(unflat)
    })).filter(poly=>poly.outer.length>=3);
    if(!polygons.length) return null;
    return buildPiece(p.code,p.name,polygons,p.seed);
  }

  /* ------------------------------------------- NAHT 1 · centroid pivot */
  function addCountry(code,name,geojson){
    const geoms=[];
    if(geojson.type==='FeatureCollection'){ for(const f of geojson.features||[]) geoms.push(f.geometry); }
    else if(geojson.type==='Feature') geoms.push(geojson.geometry);
    else geoms.push(geojson);

    const candidates=[];
    for(const geom of geoms) for(const poly of normalizeGeometryInput(geom)){
      if(!poly?.[0]||!withinEuropeCentroid(poly[0])) continue;
      const outer=ringToProjected(poly[0]); if(outer.length<3) continue;
      const area=Math.abs(polygonArea2D(outer)); if(area<0.004) continue;
      // Die KACHEL bleibt solide (Donor-Entscheidung). Die Innenringe werden aber behalten:
      // für die Wassermaske SIND sie die großen Seen.
      const holes=[];
      for(let hI=1;hI<poly.length;hI++){ const hr=ringToProjected(poly[hI]); if(hr.length>=3) holes.push(hr); }
      candidates.push({outer,holes,area});
    }
    if(!candidates.length) return null;
    candidates.sort((a,b)=>b.area-a.area);
    const largestArea=candidates[0].area;
    const polygons=candidates.filter((p,i)=>i===0||p.area>=Math.max(0.018,largestArea*0.00035)).slice(0,24);

    return buildPiece(code, name, polygons, hashString(code));
  }


  function buildInk(rec){
    for(const m of rec.inkMeshes){ rec.inner.remove(m); m.geometry.dispose(); }
    rec.inkMeshes.length=0;
    if(!CANON) return;
    for(const poly of rec.polygons){
      const g=makeInkBandGeometry(poly.outer, PIECE_DEPTH+0.055, rec.seed, rec.bbox, INK_GAIN);
      if(!g) continue;
      const m=new THREE.Mesh(g,rec.inkMat); m.renderOrder=8; rec.inner.add(m); rec.inkMeshes.push(m);
    }
  }
  function rebuildAllInk(){ for(const r of pieces) buildInk(r); }

  /* ------------------------------------------------------ action engine */
  const tweens=[];
  function animate(rec,to,{dur=0.7,ease='out',tag=''}={}){
    const from={ p:rec.pivot.position.clone(), q:rec.pivot.quaternion.clone(), s:rec.pivot.scale.clone() };
    const target={ p:to.p?to.p.clone():from.p.clone(), q:to.q?to.q.clone():from.q.clone(), s:to.s?to.s.clone():from.s.clone() };
    for(let i=tweens.length-1;i>=0;i--) if(tweens[i].rec===rec) tweens.splice(i,1);
    tweens.push({rec,from,target,t:0,dur,ease,tag});
  }
  /* --------------------------------------------------- KOLLISION
     Ein gedrehtes Kartenstück darf nicht im Brett, im Wasser oder in einem Nachbarn
     stecken. Board-Game-Logik statt Physik: das bewegte Stück HEBT SICH über alles, was
     es überlappt — Nachbarn anzuschieben wäre falsch, weil deren kanonische Lage dann
     nicht mehr kanonisch ist (der Reset-Beweis hängt daran).
     Die Prüfung läuft nur, solange das Stück wirklich gedreht ist; in Ruhe rührt sie
     nichts an, sonst wäre die Abweichung nach Reset nicht mehr 0. */
  const _gb=new THREE.Box3();
  function clearanceGuard(rec){
    const q=rec.canonical.q;
    const rotated=Math.abs(rec.pivot.quaternion.dot(q))<0.99995;
    if(!rotated) return;
    rec.pivot.updateMatrixWorld(true);
    _gb.setFromObject(rec.inner);
    let floor=BOARD_TOP+0.03;
    if(WATER.on) floor=Math.max(floor, WATER.y+0.03);
    for(const o of pieces){
      if(o===rec||!o.restBox) continue;
      if(_gb.max.x<o.restBox.min.x||_gb.min.x>o.restBox.max.x) continue;
      if(_gb.max.z<o.restBox.min.z||_gb.min.z>o.restBox.max.z) continue;
      if(o.restBox.max.y+0.03>floor) floor=o.restBox.max.y+0.03;
    }
    const lift=floor-_gb.min.y;
    if(lift>0.0005) rec.pivot.position.y+=lift;
  }

  function stepTweens(dt){
    for(let i=tweens.length-1;i>=0;i--){
      const tw=tweens[i];
      tw.t=Math.min(1,tw.t+dt/tw.dur);
      const e=(EASE[tw.ease]||EASE.out)(tw.t);
      tw.rec.pivot.position.lerpVectors(tw.from.p,tw.target.p,e);
      tw.rec.pivot.quaternion.slerpQuaternions(tw.from.q,tw.target.q,e);
      tw.rec.pivot.scale.lerpVectors(tw.from.s,tw.target.s,e);
      clearanceGuard(tw.rec);
      if(tw.t>=1) tweens.splice(i,1);
    }
    // Auch nach dem Tween: ein stehendes Stück bleibt frei, wenn Wasser dazukommt
    // oder die Kantenhöhe wächst.
    for(const r of pieces) if(r.pivot.quaternion.w<0.99995) clearanceGuard(r);
  }

  const C = (rec)=>rec.canonical;
  const qFrom=(x,y,z)=>new THREE.Quaternion().setFromEuler(new THREE.Euler(x,y,z));

  const ACTIONS = {
    RAISE:      r=>animate(r,{p:C(r).p.clone().setY(C(r).p.y+7)},{dur:0.55,ease:'back',tag:'RAISE'}),
    LOWER:      r=>animate(r,{p:C(r).p.clone()},{dur:0.45,ease:'out',tag:'LOWER'}),
    STAND_UP:   r=>animate(r,{p:C(r).p.clone().setY(C(r).p.y+Math.min(26,Math.sqrt(r.totalArea)*2.6)),q:qFrom(-Math.PI/2,0,0)},{dur:0.85,ease:'back',tag:'STAND_UP'}),
    LAY_FLAT:   r=>animate(r,{p:C(r).p.clone(),q:new THREE.Quaternion()},{dur:0.6,ease:'out',tag:'LAY_FLAT'}),
    SLIDE:      r=>{ const len=Math.hypot(r.centroid.x,r.centroid.z)||1;
                     animate(r,{p:C(r).p.clone().add(new THREE.Vector3(r.centroid.x/len*22,0,r.centroid.z/len*22))},{dur:0.8,ease:'inOut',tag:'SLIDE'}); },
    ROTATE:     r=>animate(r,{q:qFrom(0,Math.PI*0.5,0)},{dur:0.9,ease:'inOut',tag:'ROTATE'}),
    FLIP:       r=>animate(r,{p:C(r).p.clone().setY(C(r).p.y+5),q:qFrom(0,0,Math.PI)},{dur:0.95,ease:'back',tag:'FLIP'}),
    PULSE:      r=>{ animate(r,{s:new THREE.Vector3(1.12,1.6,1.12)},{dur:0.16,ease:'out',tag:'PULSE'});
                     setTimeout(()=>animate(r,{s:new THREE.Vector3(1,1,1)},{dur:0.45,ease:'back'}),170); },
    SNAP_HOME:  r=>animate(r,{p:C(r).p.clone(),q:C(r).q.clone(),s:C(r).s.clone()},{dur:0.5,ease:'back',tag:'SNAP_HOME'})
  };

  let exploded=false;
  function setExploded(on){
    exploded=!!on;
    for(const r of pieces){
      if(exploded){
        const len=Math.hypot(r.centroid.x,r.centroid.z)||1;
        const spread=5.0+seeded01(r.seed,4)*4.2;                       // donor values
        const p=C(r).p.clone().add(new THREE.Vector3(r.centroid.x/len*spread, seeded01(r.seed,7)*0.55, r.centroid.z/len*spread));
        animate(r,{p},{dur:0.7+seeded01(r.seed,11)*0.35,ease:'out',tag:'EXPLODE'});
      } else {
        animate(r,{p:C(r).p.clone(),q:C(r).q.clone(),s:C(r).s.clone()},{dur:0.65+seeded01(r.seed,13)*0.3,ease:'back',tag:'ASSEMBLE'});
      }
    }
    return exploded;
  }

  function resetCanonical(){
    tweens.length=0;
    exploded=false;
    let worst=0;
    for(const r of pieces){
      worst=Math.max(worst, r.pivot.position.distanceTo(C(r).p));
      r.pivot.position.copy(C(r).p);
      r.pivot.quaternion.copy(C(r).q);
      r.pivot.scale.copy(C(r).s);
      stopRipple(r);
    }
    return worst;
  }
  function canonicalError(){
    let worst=0, code=null;
    for(const r of pieces){
      const d=r.pivot.position.distanceTo(C(r).p)
        + 2*Math.acos(Math.min(1,Math.abs(r.pivot.quaternion.dot(C(r).q))))
        + r.pivot.scale.distanceTo(C(r).s);
      if(d>worst){ worst=d; code=r.code; }
    }
    return { worst:+worst.toFixed(5), code };
  }

  /* --------------------------------------------------- RIPPLE · NAHT 2 */
  // Copied from KFB-Travel-Globe travel/terrain-planets-v1/card-carrier.js @ 8614282a
  // ("carpet-waver"): phase rate 2.6/s, amplitude base 0.06, the (0.35 + |w|) edge weighting and
  // computeVertexNormals() per frame. The ONE change is the phase argument: the donor's
  // directional (z*3.4 + x*1.6) becomes radial (-dist*K) so the wave expands from a struck point.
  const RIPPLE_K = 0.55, RIPPLE_LIFE = 2.2;
  function startRipple(rec){
    rec.ripple.on=true; rec.ripple.t=0;
    rec.ripple.cx=rec.centroid.x; rec.ripple.cz=rec.centroid.z;
  }
  function stopRipple(rec){
    if(!rec.ripple.on && rec.ripple.t===0) return;
    rec.ripple.on=false; rec.ripple.t=0;
    rec.meshes.forEach((m,i)=>{
      const pos=m.geometry.attributes.position, base=rec.bases[i];
      pos.array.set(base); pos.needsUpdate=true; m.geometry.computeVertexNormals();
    });
  }
  function stepRipple(rec,dt){
    if(!rec.ripple.on) return;
    rec.ripple.t+=dt;
    const life=rec.ripple.t/RIPPLE_LIFE;
    if(life>=1){ stopRipple(rec); return; }
    const wavePhase=rec.ripple.t*2.6;                       // donor rate
    const amp=0.06*4.2*(1-life)*(1-life);                   // donor base, map-scale gain + decay
    rec.meshes.forEach((m,i)=>{
      const pos=m.geometry.attributes.position, base=rec.bases[i], arr=pos.array;
      for(let k=0;k<arr.length;k+=3){
        const x=base[k], y=base[k+1], z=base[k+2];
        if(y < PIECE_DEPTH*0.5){ arr[k+1]=y; continue; }    // only the top face moves
        const dx=x-rec.ripple.cx, dz=z-rec.ripple.cz;
        const dist=Math.hypot(dx,dz);
        const w=Math.min(1,dist/22);
        const wave=Math.sin(wavePhase - dist*RIPPLE_K)*amp*(0.35+Math.abs(w));
        arr[k+1]=y+wave;
      }
      pos.needsUpdate=true; m.geometry.computeVertexNormals();
    });
  }

  /* ----------------------------------------------------------- WASSER
     Donor: `kfb-fluid-v2/card-zone-v2-fluid-source.js` — source-locked 1:1 gegen den
     laufenden KFB Card Zone Lab v2 Donor-Blob (43eea82f8727d3581e50374d6263e48a28241d3b),
     nicht mehr aus der ToolBox-Bench-Schwundform (ehem. kfb-fluid-v1) abgeleitet. Vertex-
     und Fragment-GLSL, Texturvertrag (RepeatWrapping, sRGB nur für water.jpg, NoColorSpace
     für dudv, Anisotropie 8) und Materialflags (transparent, DoubleSide, depthWrite false,
     polygonOffset -2/-4) sind wörtlich der Donor. `createCardZoneV2FluidMaterial` +
     `setCardZoneV2ConstantFlow` sind die einzigen Bausteine, die dieses Projekt daraus zieht.

     NAHT · Der Donor erzeugt keine See-/Flussform — das bleibt geometrie-seitig hier.
     `aFlow=[0,0]` (See/Meer) wird über `setCardZoneV2ConstantFlow` auf eine lokal gebaute
     Netzgeometrie geschrieben; Flusstangenten wären derselbe Aufruf mit ungleich Null.

     NAHT · Das Modul war ursprünglich für den Wassergraben EINER Card Zone gebaut. Ein Meer
     um 40 Landmassen ist keine Wanne — die Nass-Entscheidung kann von dort nicht kommen. Der
     Vertrag verlangt dafür genau eines: EINE Wahrheit über nass. Sie liegt hier in
     `waterMask()` und wird von Netz und Messung gelesen, sonst nirgends.

     Die Maske entsteht nicht durch Punkt-in-Polygon über 40 Länder × 12 000 Zellen, sondern
     durch Rastern in ein 2D-Canvas: Außenringe füllen (Land), Innenringe ausstanzen (Seen).
     Einmalige Arbeit in der Größenordnung der Punktzahl statt ihres Produkts. */
  const WATER = { on:false, fluid:'wasser', cell:1.6, mesh:null, mat:null, cells:[], y:BOARD_TOP+0.30 };
  let FLUID = null;

  // Map-eigener Netzbau (kein Donor-Code): ein durchgehendes Quad-Netz aus den nassen Zellen,
  // reine Positionen + Index. `aFlow` kommt separat über den Donor-Helfer.
  function buildSeaGeometry(cells, cell, y){
    const h=cell/2, snap=(v)=>Math.round(v/h)*h;
    const pos=[], idx=[];
    cells.forEach((c)=>{
      const cx=snap(c.x), cz=snap(c.z), b=pos.length/3;
      pos.push(cx-h,y,cz-h, cx+h,y,cz-h, cx+h,y,cz+h, cx-h,y,cz+h);
      idx.push(b,b+2,b+1, b,b+3,b+2);
    });
    const g=new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos,3));
    g.setIndex(idx);
    g.computeVertexNormals();
    g.computeBoundingSphere();
    return g;
  }

  function waterMask(){
    const cell=WATER.cell;
    const nx=Math.ceil(BOARD_W/cell), nz=Math.ceil(BOARD_H/cell);
    const cv=document.createElement('canvas'); cv.width=nx; cv.height=nz;
    const g=cv.getContext('2d', { willReadFrequently:true });
    const toPx=(x,z)=>[ (x+BOARD_W/2)/cell, (z+BOARD_H/2)/cell ];
    const ring=(r)=>{ g.beginPath(); r.forEach((p,i)=>{ const [px,pz]=toPx(p.x,p.z); i?g.lineTo(px,pz):g.moveTo(px,pz); }); g.closePath(); };
    g.clearRect(0,0,nx,nz);
    g.globalCompositeOperation='source-over'; g.fillStyle='#fff';
    for(const rec of pieces) for(const poly of rec.polygons){ ring(poly.outer); g.fill(); }
    g.globalCompositeOperation='destination-out';
    for(const rec of pieces) for(const poly of rec.polygons) for(const hr of (poly.holes||[])){ ring(hr); g.fill(); }
    g.globalCompositeOperation='source-over';
    const data=g.getImageData(0,0,nx,nz).data;
    const cells=[];
    const rx=BOARD_W/2-2.5, rz=BOARD_H/2-2.5;      // innerhalb der Brettkante bleiben
    for(let j=0;j<nz;j++) for(let i=0;i<nx;i++){
      if(data[(j*nx+i)*4+3]>=128) continue;         // Land
      const x=-BOARD_W/2+(i+0.5)*cell, z=-BOARD_H/2+(j+0.5)*cell;
      if(Math.abs(x)>rx||Math.abs(z)>rz) continue;
      cells.push({x,z});
    }
    return cells;
  }

  async function buildWater(){
    if(!FLUID){
      try{ FLUID = await import(new URL('kfb-fluid-v2/card-zone-v2-fluid-source.js', document.baseURI).href); }
      catch(err){ WATER.error='SOURCE MODULE FAILED · card-zone-v2-fluid-source.js · '+(err?.message||err); return; }
    }
    if(WATER.mesh){ root.remove(WATER.mesh); WATER.mesh.geometry.dispose(); WATER.mesh=null; }
    WATER.cells=waterMask();
    if(!WATER.mat){
      WATER.mat=FLUID.createCardZoneV2FluidMaterial(THREE,{fluid:WATER.fluid});
      try{ await WATER.mat.loadTextures(); }
      catch(err){ WATER.error='TEXTURE LOAD FAILED · '+(err?.message||err); }
    }
    const geo=buildSeaGeometry(WATER.cells, WATER.cell, WATER.y);
    FLUID.setCardZoneV2ConstantFlow(THREE, geo, 0, 0);
    WATER.mesh=new THREE.Mesh(geo,WATER.mat.material);
    WATER.mesh.renderOrder=4;
    WATER.mesh.visible=WATER.on;
    root.add(WATER.mesh);
  }

  async function setWater(on){
    WATER.on=!!on;
    if(WATER.on && !WATER.mesh) await buildWater();
    if(WATER.mesh) WATER.mesh.visible=WATER.on;
    pushState();
    return WATER.on;
  }
  function setFluid(k){
    WATER.fluid=k;
    if(WATER.mat) WATER.mat.setFluid(k);
    pushState();
    return WATER.fluid;
  }

  /* ------------------------------------------------------------ VOXEL
     Donor-Lage, geprüft statt angenommen: `kfb-voxel-world-v1/voxel-terrain.js` ist ein
     PROZEDURALES Voxelfeld. Seine API ist setWorldContext / setPalette / setRainbow /
     setColorParams / setFog / setCarve / setCarvePath / setZones — kein Setter nimmt ein
     externes Höhen- oder Farbfeld entgegen, die Höhen entstehen im eigenen Noise-Bake
     (`rebakeAll`). Ein Feld, das eine Landkarte trägt, kann von dort nicht kommen.

     Übernommen wird deshalb das, was übertragbar IST:
     · das D6-Höhenraster  heightStep = cell/6   (README: "Terrain und alles, was daran
       anschließt, müssen denselben Wert benutzen, sonst springen Übergänge in ganzen Cubes")
     · die Kantentextur    kfb-voxel-world-v1/edge3.jpg
     · world-context.js als Farb-Owner (hexToRgb, mulberry32) — keine erfundenen Farben

     Die Stufen sind eine Distanztransformation zur Küste: je weiter im Landesinneren, desto
     mehr D6-Stufen. Das ergibt genau die Höhenlinien-Terrassen. Echte Elevation ist noch
     nicht verdrahtet — der Platz dafür ist `elevationAt`, aktuell null. */
  const VOX = { on:false, cell:1.4, mesh:null, count:0, step:0, error:null, elevationAt:null, clock:0, base:null };
  let WCTX = null;

  function voxelRaster(cell){
    const nx=Math.ceil(BOARD_W/cell), nz=Math.ceil(BOARD_H/cell);
    const cv=document.createElement('canvas'); cv.width=nx; cv.height=nz;
    const g=cv.getContext('2d',{willReadFrequently:true});
    const toPx=(x,z)=>[ (x+BOARD_W/2)/cell, (z+BOARD_H/2)/cell ];
    const ring=(r)=>{ g.beginPath(); r.forEach((p,i)=>{ const [px,pz]=toPx(p.x,p.z); i?g.lineTo(px,pz):g.moveTo(px,pz); }); g.closePath(); };
    g.clearRect(0,0,nx,nz);
    // Landbesitz im Rotkanal kodieren: Index+1, damit 0 = Wasser bleibt.
    pieces.forEach((rec,i)=>{
      g.globalCompositeOperation='source-over';
      g.fillStyle='rgb('+(i+1)+',0,0)';
      for(const poly of rec.polygons){ ring(poly.outer); g.fill(); }
    });
    g.globalCompositeOperation='destination-out';
    for(const rec of pieces) for(const poly of rec.polygons) for(const hr of (poly.holes||[])){ ring(hr); g.fill(); }
    g.globalCompositeOperation='source-over';
    const d=g.getImageData(0,0,nx,nz).data;
    const owner=new Int16Array(nx*nz).fill(-1);
    for(let k=0;k<nx*nz;k++){ if(d[k*4+3]>=128 && d[k*4]>0) owner[k]=d[k*4]-1; }
    return { nx, nz, owner };
  }

  // Zwei-Pass-Chamfer: Abstand jeder Landzelle zur nächsten Wasserzelle, in Zellen.
  function coastDistance(nx,nz,owner){
    const INF=1e6, dist=new Float32Array(nx*nz).fill(INF);
    const at=(i,j)=>j*nx+i;
    for(let j=0;j<nz;j++) for(let i=0;i<nx;i++) if(owner[at(i,j)]<0) dist[at(i,j)]=0;
    for(let j=0;j<nz;j++) for(let i=0;i<nx;i++){
      const k=at(i,j); if(dist[k]===0) continue;
      let m=dist[k];
      if(i>0) m=Math.min(m,dist[k-1]+1);
      if(j>0) m=Math.min(m,dist[k-nx]+1);
      if(i>0&&j>0) m=Math.min(m,dist[k-nx-1]+1.414);
      if(i<nx-1&&j>0) m=Math.min(m,dist[k-nx+1]+1.414);
      if(i===0||j===0||i===nx-1) m=Math.min(m,1);      // Brettrand zählt als Küste
      dist[k]=m;
    }
    for(let j=nz-1;j>=0;j--) for(let i=nx-1;i>=0;i--){
      const k=at(i,j); if(dist[k]===0) continue;
      let m=dist[k];
      if(i<nx-1) m=Math.min(m,dist[k+1]+1);
      if(j<nz-1) m=Math.min(m,dist[k+nx]+1);
      if(i<nx-1&&j<nz-1) m=Math.min(m,dist[k+nx+1]+1.414);
      if(i>0&&j<nz-1) m=Math.min(m,dist[k+nx-1]+1.414);
      if(j===nz-1) m=Math.min(m,1);
      dist[k]=m;
    }
    return dist;
  }

  /* --------------------------------------------------- NACHBAR-FÄRBUNG
     Das offene Thema aus der letzten Runde, jetzt geschlossen. Bis hier kam die Stückfarbe aus
     `palette[seed % n]`. Ein Seed weiß nichts über Nachbarschaft — Deutschland und Polen konnten
     denselben Rampenwert ziehen, und auf einer Rampe aus zehn Stufen sehen schon Nachbarstufen
     gleich aus. Genau das zeigt Georgs Screenshot.

     Die Nachbarschaft wird nicht geschätzt, sondern GEMESSEN — mit dem Raster, das für Wasser und
     Voxel ohnehin existiert: zwei Länder sind Nachbarn, wenn ihre Zellen im Vier-Nachbar-Sinn
     aneinanderstoßen. `MIN_TOUCH` Zellen Mindestberührung, damit ein einzelnes Raster-Artefakt
     keine Grenze erfindet. Zellkante 1,0 u ≈ 17 km, also bleibt der Kanal zwischen England und
     Frankreich Wasser statt gemeinsame Grenze.

     Gefärbt wird nach DSATUR (das Land mit den meisten schon gefärbten Nachbarn zuerst). Unter
     den Kandidaten gewinnt aber NICHT die erste freie Farbe, sondern die mit dem größten
     Mindestabstand zu allen Nachbarfarben. Das Ziel ist nicht „verschieden", sondern
     „unterscheidbar" — Abstand in Oklab, weil zwei Rampenstufen sich in der Helligkeit kaum,
     im Ton aber sichtbar trennen lassen. Bei Gleichstand (halbes ΔE Raster) gewinnt die bisher
     seltener benutzte Farbe, damit die Karte nicht auf drei Tönen zusammenläuft.

     NAHT · Eine echte Vierfarben-Zuweisung wird nicht angestrebt: die Rampe liefert zehn Werte,
     und mehr Farben bei garantiertem Abstand lesen besser als vier bei minimalem. Der Rest ist
     messbar — `api.colorInfo()` gibt gleiche Nachbarpaare und das kleinste ΔE über alle Grenzen. */
  const ADJ_CELL=1.0, MIN_TOUCH=3;
  let ADJ=null, COLOR_FIT={ applied:false, appliedFor:-1, conflicts:0, famConflicts:0, minDE:0, edges:0, pairs:0, families:0, error:null };

  function adjacency(){
    /* KORREKTUR · der erste Anlauf lief über das gemeinsame Besitz-Raster und meldete NULL
       Grenzen auf einem Brett voller Grenzen. Ursache: Canvas-Kantenglättung. Das Randpixel
       zwischen zwei Ländern wird von beiden übermalt, sein Rotwert ist eine Mischung — und
       `owner = rot-1` dekodiert damit einen DRITTEN, nicht existierenden Index. Zwischen den
       echten Nachbarn liegt eine Naht aus Unsinn, also berühren sie sich nie.

       Jetzt wird je Land EINE Maske gerastert und jede Zelle mitgenommen, die das Land auch nur
       anschneidet (`alpha >= 8`). Zwei Nachbarn belegen die Grenzzelle dann BEIDE — die
       Berührung ist eine Überlappung, und die kann Antialiasing nicht kaputtmachen, weil nur
       noch „angeschnitten oder nicht" gefragt wird. */
    const cell=ADJ_CELL;
    const nx=Math.ceil(BOARD_W/cell), nz=Math.ceil(BOARD_H/cell), nk=nx*nz;
    const cv=document.createElement('canvas'); cv.width=nx; cv.height=nz;
    const g=cv.getContext('2d',{willReadFrequently:true});
    const toPx=(x,z)=>[ (x+BOARD_W/2)/cell, (z+BOARD_H/2)/cell ];

    const first=new Int16Array(nk).fill(-1);
    const extra=new Map();
    const touch=new Map();
    const bump=(a,b)=>{ const k=a<b?a+'|'+b:b+'|'+a; touch.set(k,(touch.get(k)||0)+1); };

    // Die Zelle jedes Landes nur über seinem eigenen Ausschnitt lesen. Ein voller
    // 188×166-getImageData mal 40 war unnötiger Speicherdruck neben der ohnehin teuren
    // Triangulierung — ein Land belegt selten mehr als ein Fünftel des Bretts.
    pieces.forEach((rec,i)=>{
      let x0=Infinity,z0=Infinity,x1=-Infinity,z1=-Infinity;
      for(const poly of rec.polygons) for(const p of poly.outer){
        const [px,pz]=toPx(p.x,p.z);
        if(px<x0)x0=px; if(px>x1)x1=px; if(pz<z0)z0=pz; if(pz>z1)z1=pz;
      }
      if(!isFinite(x0)) return;
      const ix=Math.max(0,Math.floor(x0)-1), iz=Math.max(0,Math.floor(z0)-1);
      const iw=Math.min(nx,Math.ceil(x1)+2)-ix, ih=Math.min(nz,Math.ceil(z1)+2)-iz;
      if(iw<=0||ih<=0) return;
      g.clearRect(ix,iz,iw,ih);
      g.fillStyle='#fff';
      for(const poly of rec.polygons){
        g.beginPath();
        poly.outer.forEach((p,n)=>{ const [px,pz]=toPx(p.x,p.z); n?g.lineTo(px,pz):g.moveTo(px,pz); });
        g.closePath(); g.fill();
      }
      const d=g.getImageData(ix,iz,iw,ih).data;
      for(let jj=0;jj<ih;jj++) for(let ii=0;ii<iw;ii++){
        if(d[(jj*iw+ii)*4+3]<8) continue;        // angeschnitten zählt — sonst fällt die Grenze weg
        const k=(iz+jj)*nx+(ix+ii);
        if(first[k]<0){ first[k]=i; continue; }
        let a=extra.get(k); if(!a){ a=[]; extra.set(k,a); }
        a.push(i);
      }
    });

    // Nur überlappende Zellen sind interessant, und die liegen ausschließlich auf Grenzen.
    for(const [k,list] of extra){
      const all=[first[k],...list];
      for(let a=0;a<all.length;a++) for(let b=a+1;b<all.length;b++) bump(all[a],all[b]);
    }

    const nb=pieces.map(()=>new Set());
    let edges=0;
    for(const [k,n] of touch){
      if(n<MIN_TOUCH) continue;
      const a=+k.split('|')[0], b=+k.split('|')[1];
      if(!nb[a]||!nb[b]) continue;
      nb[a].add(b); nb[b].add(a); edges++;
    }
    return { nb, edges, pairs:touch.size };
  }

  function applyColours(){
    if(!pieces.length) return COLOR_FIT;
    const list=palette, lab=list.map(oklab), n=pieces.length;
    if(!ADJ || ADJ.nb.length!==n){
      try{ ADJ=adjacency(); }
      catch(err){ ADJ={ nb:pieces.map(()=>new Set()), edges:0, error:'MESSUNG FEHLGESCHLAGEN · '+(err?.message||err) }; }
    }
    const nb=ADJ.nb;
    const chosen=new Array(n).fill(-1), used=new Array(list.length).fill(0);
    const famCount=new Map();
    // ΔE allein zieht an die Ränder der Leiter: lauter fast weiße neben lauter dunklen. Die
    // mittlere Stufe verschwand, und die Karte sah gebleicht aus. Stufen werden deshalb genauso
    // ausbalanciert wie Haupttöne, nur schwächer — Trennung bleibt wichtiger als Gleichverteilung.
    const tintCount=new Map();
    const tones=new Set(PAL_FAM).size||1;
    const tintOf=(c)=>Math.floor(c/tones);

    for(let step=0;step<n;step++){
      let best=-1, bSat=-1, bDeg=-1, bSeed=-1;
      for(let i=0;i<n;i++){
        if(chosen[i]>=0) continue;
        let sat=0; for(const j of nb[i]) if(chosen[j]>=0) sat++;
        const deg=nb[i].size, sd=pieces[i].seed;
        if(sat>bSat || (sat===bSat&&(deg>bDeg || (deg===bDeg&&sd>bSeed)))){ best=i; bSat=sat; bDeg=deg; bSeed=sd; }
      }
      const near=[], banned=new Set();
      for(const j of nb[best]) if(chosen[j]>=0){ near.push(lab[chosen[j]]); banned.add(PAL_FAM[chosen[j]]); }
      /* HARTE REGEL ZUERST: kein Nachbar teilt den Haupt-Ton. Das ist die Trennung, die eine
         politische Karte trägt — ΔE allein lässt zwei helle Stufen desselben Tons nebeneinander
         zu, und genau das liest als „gehört zusammen". Planare Graphen brauchen höchstens vier
         Farben, acht Töne sind also reichlich; fällt die Regel trotzdem aus, wird nicht still
         gepfuscht, sondern in famConflicts gezählt. */
      /* ZWEISTUFIG statt einer Punktzahl. Eine gewichtete Summe aus ΔE und Verteilung fällt
         immer zugunsten von ΔE aus — deshalb überzog erst Rosa, dann Lavendel, dann Pflaume die
         Karte, egal wie die Strafterme standen. Trennung ist aber keine Größe, die man maximiert,
         sondern eine SCHWELLE: ab FLOOR ΔE sind zwei Nachbarn unterscheidbar, darunter nicht.
         Also erst filtern (Ton frei UND über der Schwelle), dann unter den Übriggebliebenen rein
         nach Verteilung wählen. Bleibt nichts übrig, gewinnt der größte Abstand — und das wird
         als Konflikt gezählt, nicht verschwiegen. */
      const FLOOR=18;
      const sep=new Array(list.length);
      for(let c=0;c<list.length;c++){
        let min=999; for(const q of near) min=Math.min(min, dE(lab[c],q));
        sep[c]=min;
      }
      let cands=[];
      for(let c=0;c<list.length;c++) if(!banned.has(PAL_FAM[c]) && sep[c]>=FLOOR) cands.push(c);
      if(!cands.length) for(let c=0;c<list.length;c++) if(!banned.has(PAL_FAM[c])) cands.push(c);
      let pick;
      if(cands.length){
        // Reine Verteilung: seltenster Ton, dann seltenste Stufe, dann seltenste Farbe, dann Seed.
        pick=cands[0]; let bk=null;
        for(const c of cands){
          const k=[ famCount.get(PAL_FAM[c])||0, tintCount.get(tintOf(c))||0, used[c], -seeded01(pieces[best].seed,c) ];
          if(!bk || k[0]<bk[0] || (k[0]===bk[0]&&(k[1]<bk[1] || (k[1]===bk[1]&&(k[2]<bk[2] || (k[2]===bk[2]&&k[3]<bk[3])))))){ bk=k; pick=c; }
        }
      } else {
        pick=0; for(let c=1;c<list.length;c++) if(sep[c]>sep[pick]) pick=c;
      }
      chosen[best]=pick; used[pick]++;
      famCount.set(PAL_FAM[pick],(famCount.get(PAL_FAM[pick])||0)+1);
      tintCount.set(tintOf(pick),(tintCount.get(tintOf(pick))||0)+1);
    }

    let conflicts=0, famConflicts=0, minDE=Infinity;
    for(let i=0;i<n;i++) for(const j of nb[i]){
      if(j<i) continue;
      if(chosen[i]===chosen[j]) conflicts++;
      if(PAL_FAM[chosen[i]]===PAL_FAM[chosen[j]]) famConflicts++;
      minDE=Math.min(minDE, dE(lab[chosen[i]],lab[chosen[j]]));
    }
    // Null Grenzen auf einem Brett mit Stücken ist keine Messung, sondern ein Befund.
    const blind = n>1 && !ADJ.edges ? 'KEINE GRENZE GEMESSEN · Färbung ungeprüft' : null;
    COLOR_FIT={ applied:true, appliedFor:n, conflicts, famConflicts, minDE:ADJ.edges?+minDE.toFixed(1):0,
      edges:ADJ.edges, pairs:ADJ.pairs||0, families:famCount.size, error:ADJ.error||blind };

    for(let i=0;i<n;i++){
      const r=pieces[i];
      r.colorIndex=chosen[i];
      r.baseColor=list[chosen[i]];
      if(paletteOn) r.topMat.color.setHex(r.baseColor);
      if(edgeMode==='shadow') r.sideMat.color.setHex(r.baseColor).multiplyScalar(0.32);
    }
    if(VOX.on) buildVoxels();
    return COLOR_FIT;
  }

  /* Spät eintreffende Länder ändern die Nachbarschaft.
     `loadBoundaries` wartet nur bis BOOT_MS — danach läuft `drain` weiter und schiebt Stücke in
     `pieces`, lange nachdem einmal gefärbt wurde. Genau dann behielten die Nachspringer ihre
     provisorische Seed-Farbe, also den Zustand, über den Georg sich beschwert hat. Jeder Weg,
     der `pieces` verändert, meldet sich deshalb hier; die Bremse bündelt den Schwung ein. */
  let recolourTimer=null;
  function scheduleRecolour(){
    clearTimeout(recolourTimer);
    recolourTimer=setTimeout(()=>{
      recolourTimer=null;
      if(!pieces.length) return;
      pieces.sort((a,b)=>b.totalArea-a.totalArea);
      ADJ=null;
      // Scheitert die Färbung, wird `appliedFor` trotzdem gesetzt — sonst versucht es die
      // Selbstheilung alle 500 ms erneut und die Seite dreht sich an ihrem eigenen Fehler fest.
      try{ applyColours(); }
      catch(e){ console.error('[SMA1] Färbung fehlgeschlagen', e);
        COLOR_FIT={ ...COLOR_FIT, appliedFor:pieces.length, error:'FÄRBUNG FEHLGESCHLAGEN · '+(e?.message||e) }; }
      pushState();
    },420);
  }

  async function buildVoxels(){
    try{
      if(!WCTX) WCTX = await import(new URL('kfb-voxel-world-v1/world-context.js', document.baseURI).href);
    }catch(err){ VOX.error='SOURCE MODULE FAILED · world-context.js · '+(err?.message||err); return; }
    if(VOX.mesh){ root.remove(VOX.mesh); VOX.mesh.geometry.dispose(); VOX.mesh.material.dispose(); VOX.mesh=null; }

    const cell=VOX.cell;
    const step=cell/6;                                   // D6-Raster des Donors
    VOX.step=step;
    const { nx, nz, owner } = voxelRaster(cell);
    const dist = coastDistance(nx,nz,owner);

    let n=0; for(let k=0;k<owner.length;k++) if(owner[k]>=0) n++;
    if(!n){ VOX.error='keine Landzellen'; return; }

    const geo=new THREE.BoxGeometry(cell*0.98, 1, cell*0.98);
    geo.translate(0,0.5,0);                               // Ursprung auf die Unterkante
    if(!VOX.edgeTex){
      const tl=new THREE.TextureLoader();
      VOX.edgeTex=tl.load(new URL('kfb-voxel-world-v1/edge3.jpg', document.baseURI).href);
      VOX.edgeTex.colorSpace=THREE.SRGBColorSpace;
      VOX.edgeTex.wrapS=VOX.edgeTex.wrapT=THREE.ClampToEdgeWrapping;
      VOX.edgeTex.anisotropy=4;
    }
    const mat=new THREE.MeshStandardMaterial({ map:VOX.edgeTex, roughness:0.94, metalness:0 });
    const mesh=new THREE.InstancedMesh(geo,mat,n);
    mesh.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(n*3),3);
    mesh.castShadow=true; mesh.receiveShadow=true;
    const m=new THREE.Matrix4(), q=new THREE.Quaternion(), s=new THREE.Vector3(), p=new THREE.Vector3();
    const col=new THREE.Color();
    const base=new Float32Array(n*3);                     // x, yTop, z — für spätere Animation
    let idx=0;
    for(let j=0;j<nz;j++) for(let i=0;i<nx;i++){
      const k=j*nx+i, o=owner[k]; if(o<0) continue;
      const rec=pieces[o]; if(!rec) continue;
      const x=-BOARD_W/2+(i+0.5)*cell, z=-BOARD_H/2+(j+0.5)*cell;
      // Sockel = Kachelstärke des Bretts (PIECE_DEPTH), damit Land als Land liest.
      // Die Terrassen liegen DARAUF — sonst ist die Küste 0,23 u hoch und verschwindet,
      // und die Karte liest als Bergklumpen statt als Kontinent.
      const baseSteps = Math.max(1, Math.round(PIECE_DEPTH/step));
      const relief = VOX.elevationAt
        ? Math.round(VOX.elevationAt(x,z)/step)
        : Math.min(10, Math.floor(dist[k]/2.4));
      const steps = baseSteps + relief;
      const h=steps*step;
      p.set(x,PIECE_Y,z); s.set(1,h,1);
      m.compose(p,q,s); mesh.setMatrixAt(idx,m);
      col.setHex(paletteOn?rec.baseColor:0xe6dcc2);
      col.multiplyScalar(0.78+0.34*(relief/10));          // höher = heller, wie Höhenlinien
      mesh.setColorAt(idx,col);
      base[idx*3]=x; base[idx*3+1]=PIECE_Y+h; base[idx*3+2]=z;
      idx++;
    }
    mesh.count=idx; VOX.count=idx; VOX.base=base;
    mesh.instanceMatrix.needsUpdate=true;
    if(mesh.instanceColor) mesh.instanceColor.needsUpdate=true;
    mesh.visible=VOX.on;
    mesh.scale.y=edgeHeight;
    VOX.mesh=mesh; VOX.error=null;
    root.add(mesh);
  }

  async function setVoxel(on){
    VOX.on=!!on;
    if(VOX.on && !VOX.mesh) await buildVoxels();
    if(VOX.mesh) VOX.mesh.visible=VOX.on;
    // Die extrudierten Kacheln treten zurück, solange die Voxel stehen.
    for(const r of pieces){
      for(const mm of r.meshes) mm.visible=!VOX.on;
      for(const mm of r.inkMeshes) mm.visible=!VOX.on && edgeMode==='outline';
    }
    pushState();
    return VOX.on;
  }
  async function setVoxelCell(c){
    VOX.cell=Math.max(0.8,Math.min(3.0,Number(c)||1.4));
    if(VOX.mesh){ root.remove(VOX.mesh); VOX.mesh.geometry.dispose(); VOX.mesh.material.dispose(); VOX.mesh=null; }
    if(VOX.on) await buildVoxels();
    if(VOX.mesh) VOX.mesh.visible=VOX.on;
    pushState();
    return VOX.cell;
  }

  /* -------------------------------------------------------- cameras */
  function queueCam(v,p,t){ v.goalPos.copy(p); v.goalTarget.copy(t); v.tween=true; }
  const CAMERAS = {
    FLAT:    ()=>queueCam(board,new THREE.Vector3(0,225,0.1),new THREE.Vector3(0,0,0)),
    TABLE:   ()=>queueCam(board,new THREE.Vector3(35,128,155),new THREE.Vector3(0,4,-5)),
    FLYOVER: ()=>queueCam(board,new THREE.Vector3(22,54,160),new THREE.Vector3(0,7,-8)),
    POPUP:   ()=>{ const r=selected||pieces[0]; if(!r) return;
                   const x=r.pivot.position.x, z=r.pivot.position.z;
                   const reach=THREE.MathUtils.clamp(Math.sqrt(Math.max(1,r.totalArea))*2.0,26,62);
                   queueCam(board,new THREE.Vector3(x+reach*0.5,Math.max(22,reach*0.62),z+reach*0.95),
                            new THREE.Vector3(x,PIECE_Y+6,z)); },
    RESET:   ()=>queueCam(board,new THREE.Vector3(35,128,155),new THREE.Vector3(0,4,-5))
  };
  function stepCam(v,dt){
    if(!v.tween) return;
    const k=1-Math.pow(0.0012,dt);
    v.camera.position.lerp(v.goalPos,k);
    v.controls.target.lerp(v.goalTarget,k);
    if(v.camera.position.distanceTo(v.goalPos)<0.08 && v.controls.target.distanceTo(v.goalTarget)<0.05){
      v.camera.position.copy(v.goalPos); v.controls.target.copy(v.goalTarget); v.tween=false;
    }
  }

  /* --------------------------------------------- piece isolation view */
  const isoRoot=new THREE.Group(); if(isoView) isoView.scene.add(isoRoot);
  function showIsolated(rec){
    if(!isoView) return;
    while(isoRoot.children.length) isoRoot.remove(isoRoot.children[0]);
    if(!rec) return;
    const g=new THREE.Group();
    for(const m of rec.meshes){ const c=new THREE.Mesh(m.geometry,m.material); c.castShadow=true; c.receiveShadow=true; g.add(c); }
    for(const m of rec.inkMeshes){ const c=new THREE.Mesh(m.geometry,m.material); c.renderOrder=8; g.add(c); }
    g.position.set(-rec.centroid.x,0,-rec.centroid.z);
    isoRoot.add(g);
    isoRoot.updateMatrixWorld(true);              // ohne das misst Box3 die Matrizen von vorher
    const box=new THREE.Box3().setFromObject(isoRoot);
    if(box.isEmpty()) return;
    const sph=box.getBoundingSphere(new THREE.Sphere());
    if(!isFinite(sph.radius)||sph.radius<=0) return;
    const d=(sph.radius/Math.sin(THREE.MathUtils.degToRad(18)))*1.15;
    // Blickrichtung EXAKT die des Bretts (Preset TABLE: Position 35/128/155 auf Ziel 0/4/-5).
    // Vorher hatte die Isolieransicht eine eigene Richtung — dasselbe Stück las sich dort
    // anders herum als auf dem Brett, und genau das ist als "FR steht kopf" aufgefallen.
    // Eine Richtung, eine Lesart: jetzt kann Panel B gar nicht mehr abweichen.
    const BOARD_DIR=new THREE.Vector3(35-0,128-4,155-(-5)).normalize();
    isoView.controls.target.copy(sph.center);
    isoView.camera.position.copy(sph.center).add(BOARD_DIR.clone().multiplyScalar(d));
    isoView.camera.up.set(0,1,0);
    isoView.controls.update();
    isoView.renderer.render(isoView.scene, isoView.camera);
    isoView.lastCode = rec.code;
    isoView.lastChildren = isoRoot.children.length;
    isoView.lastRadius = +sph.radius.toFixed(3);
  }

  function selectPiece(rec){
    selected=rec;
    for(const r of pieces) r.topMat.emissive.setHex(r===rec?0x1d1207:0x000000);
    showIsolated(rec);
    pushState();
  }

  /* --------------------------------------------------- landmark donor */
  /* ------------------------------------------------- CARTOON-DEFORMER
     Donor: travel/wip/travel_globe_wsa/kfb-cartoon-deform.js @ main, über jsDelivr geladen,
     nicht kopiert. Er ist HÖHEN-parametrisiert: t = (y - minY) / höhe, Bogen mit t²,
     Neigung linear, am Fuß verankert, Verjüngung nach innen.

     WO ER PASST: stehende Props. Die Landmark-Geometrie ist genau seine Klasse — und die
     Grotesque-Optik von Pilot-06 kommt aus derselben Familie, deshalb greift er dort ohne
     Anpassung.

     WO ER NICHT PASST, und warum ich ihn dort nicht hinbiege:
     · Landesumrisse liegen FLACH. Ihre "Höhe" ist die Kachelstärke (0,9), ihre Ausdehnung
       30+ Einheiten — t wäre die Dicke, Bogen und Neigung täten nichts Sinnvolles, und die
       Verjüngung würde die Deckfläche einschnüren. Die Donor-Matrix warnt genau davor
       ("Do not assume a building deformer is valid for country outlines").
     · Küstenlinien bogig über das Wasser ziehen wäre eine Verformung IN DER EBENE. Der
       Donor kann das nicht; das ist eine andere Funktion, kein Parameter.
     · Voxelsäulen sind seine Klasse, liegen aber in einem InstancedMesh. Der Donor sagt
       selbst, wie: "Für echtes Instanced-Scatter gehören die Werte statt in Uniforms in
       Instanced-Attribute — dieselbe Mathematik, anderer Träger." Nicht in dieser Scheibe. */
  const DEF = { on:false, strength:1, mod:null, handles:[], clock:0, error:null };

  async function ensureDeformer(){
    if(DEF.mod || DEF.error) return DEF.mod;
    try{ DEF.mod = await import(CDN+'travel/wip/travel_globe_wsa/kfb-cartoon-deform.js'); }
    catch(err){ DEF.error='SOURCE MODULE FAILED · kfb-cartoon-deform.js · '+(err?.message||err); }
    return DEF.mod;
  }
  function deformLimits(){
    const D=DEF.mod?DEF.mod.DEFAULT_LIMITS:{bend:0.06,lean:0.05,taper:0.12,twist:6,squash:0.03};
    const k=DEF.strength;
    return { bend:D.bend*k, lean:D.lean*k, taper:D.taper*k, twist:D.twist*k, squash:D.squash*k, squashSpeed:D.squashSpeed };
  }
  async function deformGroup(group,seed){
    const m=await ensureDeformer();
    if(!m) return null;
    const h=m.applyCartoonDeform(THREE,group,{ limits:deformLimits(), seed:seed>>>0 || 1 });
    h.setMix(DEF.on?1:0);
    DEF.handles.push(h);
    return h;
  }
  function setDeform(on){
    DEF.on=!!on;
    for(const h of DEF.handles) h.setMix(DEF.on?1:0);
    pushState();
    return DEF.on;
  }
  function setDeformStrength(v){
    DEF.strength=Math.max(0,Math.min(3,Number(v)||1));
    const L=deformLimits();
    for(const h of DEF.handles) h.setLimits(L);
    return DEF.strength;
  }

  const LM = { status:'pending', model:'eiffel', asset:null, iso:null, anchored:null, error:null };
  const lmRoot=new THREE.Group(); if(lmView) lmView.scene.add(lmRoot);

  async function loadLandmark(modelId='eiffel'){
    LM.model=modelId; LM.status='loading'; pushState();
    try{
      const base=CDN+'tools/img2threejs/';
      const [geometry,deform,adapter,worldStyle]=await Promise.all([
        import(base+'landmarks/pilot-02/geometry.mjs'),
        import(base+'landmarks/pilot-03/deform.mjs'),
        import(base+'landmarks/pilot-01/three-adapter.mjs'),
        import(base+'styles/landmark-world-style.mjs')
      ]);
      const [profiles,snapshot,cityStyle]=await Promise.all([
        fetchJson(base+'styles/landmark-style-profiles.v1.json',{cache:'force-cache',retries:0}),
        fetchJson(base+'styles/travel-visual-snapshot.v1.json',{cache:'force-cache',retries:0}),
        fetchJson(CDN+'tools/osm-city-lab/styles/kfb-city-v0.json',{cache:'force-cache',retries:0})
      ]);
      const mode = deform.modeSupported(modelId,'city-grotesque') ? 'city-grotesque' : 'base';
      const raw = geometry.buildLandmark(modelId);
      const asset = deform.shapeAsset(raw, cityStyle, mode);
      const colours = worldStyle.resolveLandmarkColours(modelId, profiles, snapshot,
        { environment:'osm', mood:'verdant', biomeIndex:0, timeOfDay:'day' });
      LM.asset={asset,colours,adapter,mode,triangles:asset.triangles,profiles};
      LM.status='ok'; LM.error=null;

      while(lmRoot.children.length) lmRoot.remove(lmRoot.children[0]);
      const iso=adapter.createLandmarkGroup(THREE,asset,colours);
      lmRoot.add(iso); LM.iso=iso;
      DEF.handles.length=0;
      await deformGroup(iso, hashString(modelId));
      if(lmView){
        const box=new THREE.Box3().setFromObject(lmRoot);
        const sph=box.getBoundingSphere(new THREE.Sphere());
        const d=(sph.radius/Math.sin(THREE.MathUtils.degToRad(22)))*1.2;
        lmView.controls.target.copy(sph.center);
        lmView.camera.position.copy(sph.center).add(new THREE.Vector3(0.7,0.42,1).normalize().multiplyScalar(d));
        lmView.controls.update();
        const floor=new THREE.Mesh(new THREE.CylinderGeometry(sph.radius*0.95,sph.radius*0.98,Math.max(.3,sph.radius*0.015),40),
          new THREE.MeshStandardMaterial({color:0x4a4356,roughness:1,flatShading:true}));
        floor.position.set(sph.center.x,box.min.y-0.2,sph.center.z); floor.receiveShadow=true; lmRoot.add(floor);
      }
    }catch(err){
      LM.status='failed'; LM.error=String(err?.message||err);
      while(lmRoot.children.length) lmRoot.remove(lmRoot.children[0]);
    }
    pushState();
  }

  function anchorLandmark(){
    if(LM.status!=='ok'||!selected) return false;
    unanchorLandmark();
    const g=LM.asset.adapter.createLandmarkGroup(THREE,LM.asset.asset,LM.asset.colours);
    const box=new THREE.Box3().setFromObject(g);
    const size=box.getSize(new THREE.Vector3());
    const target=Math.max(7,Math.min(16,Math.sqrt(Math.max(1,selected.totalArea))*1.5));
    const s=target/Math.max(size.y,0.001);
    g.scale.setScalar(s);
    g.updateMatrixWorld(true);
    const b2=new THREE.Box3().setFromObject(g);
    g.position.set(selected.centroid.x,PIECE_DEPTH-b2.min.y,selected.centroid.z);
    g.traverse(o=>{ if(o.isMesh){ o.castShadow=true; o.receiveShadow=true; } });
    selected.inner.add(g);
    selected.landmark=g; LM.anchored=selected.code;
    deformGroup(g, hashString(LM.model+selected.code));
    pushState();
    return true;
  }
  function unanchorLandmark(){
    for(const r of pieces) if(r.landmark){ r.inner.remove(r.landmark); r.landmark=null; }
    LM.anchored=null;
  }

  /* ------------------------------------------------------------- boot
     ENTSCHEIDUNG statt Timer-Tuning: das Laden der Grenzen liegt NICHT mehr im kritischen
     Pfad. mount() baut die Szene, setzt window.KFBSMA1 und kehrt zurück; die Länder tropfen
     danach herein. Drei Runden lang war die Seite minutenlang TOT, weil alles hinter einem
     await auf einen fremden CDN hing — und jeder Deckel lief erst an, nachdem der Katalog
     selbst schon Minuten gebraucht hatte. Jetzt ist die Seite ab der ersten Sekunde bedienbar
     und füllt sich; was ausbleibt, holt die Nachladetaste. */
  let loaded=0, failed=0, expected=0;
  const failedFiles=[];
  let bootDeadline=Infinity;
  // Getrennt von bootDeadline, weil die nach der Race auf Infinity zurückgesetzt wird. Diese
  // Frist bleibt stehen, damit der Takt den Sweep auch dann nachholt, wenn die Race nie auslöst.
  let bootSweepAt=0, picked=[], sweptOnce=false;
  const isDone=(code)=>pieces.some(p=>p.code===code);
  const dropFailed=(code)=>{
    const i=failedFiles.findIndex(x=>String(x.entity).toUpperCase()===code);
    if(i>=0) failedFiles.splice(i,1);
  };
  // failed wird ABGELEITET, nicht mitgezählt: mitgezählt ergab 42/40, weil ein Nachzügler
  // nach dem Deckel-Sweep noch ankam und sein Eintrag in failedFiles stehen blieb.
  const recount=()=>{ failed=failedFiles.length; };

  async function loadOne(f){
    const code=String(f.entity).toUpperCase();
    if(performance.now()>bootDeadline && !isDone(code)){
      if(!failedFiles.some(x=>String(x.entity).toUpperCase()===code)) failedFiles.push(f);
      recount(); scheduleRecolour(); return;
    }
    try{
      const timeoutMs=code==='NO'?30000:code==='FI'?16000:12000;
      const data=await fetchJson(fileUrl(f),{timeoutMs,retries:1});
      const name=f.name||data.features?.[0]?.properties?.name||code;
      if(addCountry(code,name,data)){ loaded++; dropFailed(code); }
      else if(!failedFiles.some(x=>String(x.entity).toUpperCase()===code)) failedFiles.push(f);
    }catch(e){
      if(!isDone(code) && !failedFiles.some(x=>String(x.entity).toUpperCase()===code)) failedFiles.push(f);
    }
    recount();
    scheduleRecolour();
    status('Europa wird zerschnitten … '+pieces.length+'/'+(expected||'?'));
    // Atempause: addCountry trianguliert die Kontur. Ohne Rückgabe an den Eventloop
    // steht die Oberfläche in Schüben.
    await new Promise(r=>setTimeout(r,0));
  }

  async function loadBoundaries(){
    try{
      status('OSM-Grenzkatalog wird gelesen …');
      const cat=await fetchJson(OPENPLANET_API,{timeoutMs:14000,retries:1,cache:'no-store'});
      const files=(cat.files||[]).filter(f=>f.remote_version==='v2'&&f.extension==='geojson'&&!f.deprecated);
      const byCode=new Map();
      for(const f of files){ const c=String(f.entity||'').toUpperCase(); if(!byCode.has(c)) byCode.set(c,f); }
      picked=CORE_CODES.map(c=>byCode.get(c)).filter(Boolean);
      expected=picked.length;
      status('Europa wird zerschnitten … 0/'+expected);

      const BOOT_MS=45000;
      bootDeadline=performance.now()+BOOT_MS;
      bootSweepAt=bootDeadline;
      const drain=mapLimit(picked,8,loadOne);
      drain.catch(()=>{});
      await Promise.race([ drain, new Promise(r=>setTimeout(r,BOOT_MS)) ]);
      bootDeadline=Infinity;
      for(const f of picked){
        const code=String(f.entity).toUpperCase();
        if(!isDone(code) && !failedFiles.some(x=>String(x.entity).toUpperCase()===code)) failedFiles.push(f);
      }
      recount();
      if(!pieces.length){ status('SOURCE FAILED · kein Grenzdatensatz erreichbar','bad'); return; }
      pieces.sort((a,b)=>b.totalArea-a.totalArea);
      try{ ADJ=null; applyColours(); }              // Nachbarschaft gilt erst, wenn Stücke stehen
      catch(e){ COLOR_FIT={ ...COLOR_FIT, appliedFor:pieces.length, error:'FÄRBUNG FEHLGESCHLAGEN · '+(e?.message||e) }; }
      drain.then(()=>scheduleRecolour()).catch(()=>scheduleRecolour());   // Nachspringer nach BOOT_MS
      if(!selected) selectPiece(pieces.find(p=>p.code==='FR')||pieces[0]);
      CAMERAS.TABLE();
      status(null);
      pushState();
    }catch(err){
      /* Ein Fehlschlag HIER — typischerweise Speicher, nicht Netz — ließ das Brett vorher leer
         und OHNE Nachladetaste zurück: der Wurf sprang über die Buchführung, die `failedFiles`
         füllt, und ohne Einträge erscheint der Knopf nicht. Sackgasse ohne Neuladen. Was noch
         nicht auf dem Brett liegt, wird deshalb im Fehlerfall als fehlend eingetragen, damit
         der bestehende Weg zurück aus dem Loch führt. */
      for(const f of picked){
        const code=String(f.entity).toUpperCase();
        if(!isDone(code) && !failedFiles.some(x=>String(x.entity).toUpperCase()===code)) failedFiles.push(f);
      }
      recount();
      console.error('[SMA1] loadBoundaries abgebrochen', err);
      if(pieces.length){ try{ scheduleRecolour(); selectPiece(selected||pieces[0]); }
        catch(e2){ console.error('[SMA1] Wiederanlauf nach Abbruch fehlgeschlagen', e2); } }
      status('SOURCE FAILED · '+(err?.message||err)+(failedFiles.length?' · '+failedFiles.length+' nachladbar':''),'bad');
      pushState();
    }
  }

  /* -------------------------------------------------------- SNAPSHOT
     SOURCE_SPEC.json nennt es selbst als P1: "replace the live-catalogue dependency with a
     pinned cached snapshot + checksums". Der Schnappschuss hält die BEREITS PROJIZIERTEN
     Ringe in Brettkoordinaten — der Import braucht damit weder Netz noch Projektion, und die
     Projektionsparameter stehen trotzdem mit drin, damit nachvollziehbar bleibt, woraus sie
     entstanden sind. Schema-Form wie die übrigen KFB-JSONs: schema / version / source. */
  const SNAP_SCHEMA='kfb.storymap-snapshot/v1';
  function exportSnapshot(){
    // Flache Zahlenreihe statt [x,z]-Paare und 0,01 Einheiten Präzision: auf einem
    // 188-Einheiten-Brett ist das rund 1/20 000 der Breite, also weit unter einem Pixel.
    // Drei Nachkommastellen in Paaren ergaben 7,4 MB — unbrauchbar als gepinnte Datei.
    const round=(v)=>Math.round(v*1000)/1000;
    const flat=(ring)=>{ const a=new Array(ring.length*2);
      for(let i=0;i<ring.length;i++){ a[i*2]=Math.round(ring[i].x*100)/100; a[i*2+1]=Math.round(ring[i].z*100)/100; }
      return a; };
    return {
      schema:SNAP_SCHEMA, version:1,
      generated:new Date().toISOString(),
      source:{
        provider:'OpenPlanetData', derivation:'country boundaries derived from OpenStreetMap, GeoJSON v2',
        catalogue:OPENPLANET_API, spec:'tools/kfb-cartoon-map-board/data/europe-p0/SOURCE_SPEC.json',
        runtime:'tools/kfb-cartoon-map-board/src/app.js @ '+MAP_PIN,
        attribution:'Map data © OpenStreetMap contributors, ODbL 1.0'
      },
      encoding:'rings as flat [x,z,x,z,…] in board units, 2 decimals',
      projection:{ kind:'local equirectangular presentation projection', centerLon:CENTER.lon, centerLat:CENTER.lat, scale:MAP_SCALE },
      board:{ w:BOARD_W, h:BOARD_H, depth:BOARD_DEPTH, pieceDepth:PIECE_DEPTH, pieceY:PIECE_Y },
      counts:{ pieces:pieces.length, expected, missing:failedFiles.length },
      missing:failedFiles.map(f=>String(f.entity).toUpperCase()),
      pieces:pieces.map(r=>({
        code:r.code, name:r.name, seed:r.seed,
        centroid:{ x:round(r.centroid.x), z:round(r.centroid.z) },
        totalArea:round(r.totalArea),
        polygons:r.polygons.map(p=>({
          outer:flat(p.outer),
          holes:(p.holes||[]).map(flat)
        }))
      }))
    };
  }

  function importSnapshot(doc){
    if(!doc||doc.schema!==SNAP_SCHEMA) throw new Error('kein '+SNAP_SCHEMA);
    // Brett leeren, ohne Szene, Kamera oder Regler anzufassen.
    for(const r of pieces){ root.remove(r.pivot); for(const m of r.meshes) m.geometry.dispose(); }
    pieces.length=0; pickMeshes.length=0; failedFiles.length=0;
    selected=null; loaded=0;
    if(VOX.mesh){ root.remove(VOX.mesh); VOX.mesh=null; }
    if(WATER.mesh){ root.remove(WATER.mesh); WATER.mesh.geometry.dispose(); WATER.mesh=null; }
    for(const p of doc.pieces||[]){
      // addCountryFromRings ist derselbe Bau wie aus GeoJSON, nur ohne Projektionsschritt.
      addCountryFromRings(p);
      loaded++;
    }
    expected=(doc.counts&&doc.counts.expected)||pieces.length;
    pieces.sort((a,b)=>b.totalArea-a.totalArea);
    ADJ=null; applyColours();
    if(pieces.length) selectPiece(pieces.find(x=>x.code==='FR')||pieces[0]);
    CAMERAS.TABLE(); status(null); pushState();
    return { pieces:pieces.length, from:doc.generated||'?' };
  }

  /* ------------------------------------------------------- SPIELFIGUREN
     Diplomacy/Risiko-Logik: je Land ein Bit aus dem KayKit-BoardGameBits-Pack, gesetzt auf
     den Schwerpunkt. Die Namen sind nicht geraten — sie stammen aus dem Asset-Registry-Lauf
     dieser Sitzung (registry/assets/v1/packs/kaykit-boardgamebits-1-0-free.json), 162
     Modelle verifiziert — die Wuerfelfamilie dort ist D4 / D8 / D20, es gibt KEIN D6 im Pack.
     (Erste Fassung trug D6_* aus dem Gedaechtnis nach und behauptete im selben Kommentar,
     die Namen seien verifiziert. Vier 404er, sechs Laender ohne Figur. Notiert, nicht
     weggeputzt.) Die Figur haengt in inner, macht also Explode, Rotate, Hoehe und
     die Freiraum-Pruefung mit, ohne eigene Buchfuehrung. */
  const BITS_BASE='https://raw.githubusercontent.com/georg-doc/kayfabizarro/a6b9220a0b42d50a9de9804fad22e84dde2c322c/media/3D_Assets/KayKit_BoardGameBits_1.0_FREE/Assets/gltf/';
  const BIT_SET=[
    'meeple_red.gltf','meeple_blue.gltf','meeple_green.gltf','meeple_yellow.gltf',
    'pawn_A_red.gltf','pawn_A_blue.gltf','pawn_A_green.gltf','pawn_A_yellow.gltf',
    'D20_red.gltf','D20_blue.gltf','D20_green.gltf','D20_yellow.gltf',
    'D8_red.gltf','D8_blue.gltf','D4_green.gltf','D4_yellow.gltf',
    'flag_A_red.gltf','flag_A_blue.gltf','flag_A_green.gltf','flag_A_yellow.gltf',
    'building_red.gltf','building_blue.gltf','building_green.gltf','building_yellow.gltf'
  ];
  const BITS={ on:false, size:6, loaded:new Map(), placed:[], error:null, busy:false, dead:[], hosts:0 };
  const bitLoader=new GLTFLoader();

  async function loadBit(file){
    if(BITS.loaded.has(file)) return BITS.loaded.get(file);
    const gltf=await bitLoader.loadAsync(BITS_BASE+file);
    BITS.loaded.set(file,gltf.scene);
    return gltf.scene;
  }
  function clearBits(){
    for(const o of BITS.placed){ if(o.parent) o.parent.remove(o); }
    BITS.placed.length=0;
  }
  async function setBits(on){
    BITS.on=!!on;
    if(!BITS.on){ clearBits(); pushState(); return false; }
    if(BITS.busy) return true;
    BITS.busy=true; BITS.error=null;
    try{
      BITS.dead.length=0;
      const hosts=pieces.filter(r=>r.totalArea>12);   // sonst steht der Balkan voll
      BITS.hosts=hosts.length;
      for(const rec of hosts){
        const file=BIT_SET[rec.seed % BIT_SET.length];
        let src=null;
        try{ src=await loadBit(file); }catch(e){ if(!BITS.dead.includes(file)) BITS.dead.push(file); continue; }
        const obj=src.clone(true);
        obj.traverse(o=>{ if(o.isMesh){ o.castShadow=true; o.receiveShadow=true; } });
        obj.updateMatrixWorld(true);
        let box=new THREE.Box3().setFromObject(obj);
        const size=box.getSize(new THREE.Vector3());
        obj.scale.setScalar(BITS.size/Math.max(size.x,size.y,size.z,1e-4));
        obj.updateMatrixWorld(true);
        box=new THREE.Box3().setFromObject(obj);
        obj.position.set(rec.centroid.x, PIECE_DEPTH-box.min.y, rec.centroid.z);
        obj.rotation.y=seeded01(rec.seed,3)*Math.PI*2;
        rec.inner.add(obj);
        BITS.placed.push(obj);
        await new Promise(r=>setTimeout(r,0));
      }
    } finally { BITS.busy=false; }
    // Ein toter Name darf nicht als Gestaltungsentscheidung durchgehen: fehlende Figuren
    // stehen im Status, nicht nur in einem Toast, der nach 1,4 s weg ist.
    BITS.error=BITS.dead.length
      ? 'SOURCE ASSET FAILED · '+BITS.dead.join(', ')+' · '+(BITS.hosts-BITS.placed.length)+' Länder ohne Figur'
      : null;
    pushState();
    return BITS.on;
  }

  /* ---------------------------------------------------------- picking */
  let down=null;
  const raycaster=new THREE.Raycaster(), pointer=new THREE.Vector2();
  board.canvas.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY};});
  board.canvas.addEventListener('pointerup',e=>{
    if(!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>5){down=null;return;}
    down=null;
    const r=board.canvas.getBoundingClientRect();
    pointer.x=((e.clientX-r.left)/r.width)*2-1;
    pointer.y=-((e.clientY-r.top)/r.height)*2+1;
    raycaster.setFromCamera(pointer,board.camera);
    const hit=raycaster.intersectObjects(pickMeshes,false)[0];
    if(hit?.object?.userData?.country){ autoPick=false; selectPiece(hit.object.userData.country); }
  });

  /* ------------------------------------------------------------- loop */
  startLoop(dt=>{
    stepTweens(dt);
    if(WATER.mat && WATER.on){ WATER.clock=(WATER.clock||0)+dt; WATER.mat.update(WATER.clock); }
    if(DEF.on && DEF.handles.length){ DEF.clock+=dt; for(const h of DEF.handles) h.update(DEF.clock); }
    for(const r of pieces) stepRipple(r,dt);
    for(const v of Object.values(views)){
      stepCam(v,dt); v.controls.update();
      // Ein Nebenblick mit zusammengefahrenem Behälter rendert ins Nichts und kostet trotzdem
      // eine volle Szene. Drei lebende Renderer waren die OOM-Quelle im Ladelauf.
      if(v!==board && (v.canvas.clientWidth<8 || v.canvas.clientHeight<8)) continue;
      try{ v.renderer.render(v.scene,v.camera); }
      catch(err){ if(!v._renderErr){ v._renderErr=true; console.warn('[SMA1] render übersprungen',err?.message||err); } }
    }
  });

  function pushState(){
    /* SELBSTHEILUNG statt Vollständigkeitsversprechen. Die vorige Runde verließ sich darauf,
       dass JEDER Weg, der `pieces` verändert, brav `scheduleRecolour()` ruft — und genau einer
       tat es nicht, also färbte das Brett gegen einen Graphen mit 5 statt 17 Grenzen und meldete
       die 5 auch noch als Messung. Eine Invariante, die an jeder Aufrufstelle hängt, ist keine.
       Der 500-ms-Takt vergleicht deshalb, wofür zuletzt gefärbt wurde, mit dem, was jetzt auf
       dem Brett liegt, und holt die Differenz selbst nach. */
    /* Dritter Konsument derselben toten Stelle. Die Färbung und die Auswahl hängen längst im
       Takt; der Sweep, der `failedFiles` füllt, hing weiter hinter `await Promise.race([drain,
       setTimeout(BOOT_MS)])` — und die löst in einer gedrosselten Vorschau auch nach dem
       Dreifachen der Frist nicht aus. Folge: rotes „32 fehlen“ und KEIN Nachladeknopf, weil der
       sich aus einer Liste speist, die niemand mehr füllt. Der Nutzer saß fest. Der Sweep ist
       idempotent (`dropFailed` räumt bei Erfolg auf), läuft also einfach mit dem Takt. */
    if(bootSweepAt && performance.now()>bootSweepAt && picked.length){
      let added=0;
      for(const f of picked){
        const code=String(f.entity).toUpperCase();
        if(!isDone(code) && !failedFiles.some(x=>String(x.entity).toUpperCase()===code)){ failedFiles.push(f); added++; }
      }
      if(added){
        recount();
        if(!sweptOnce){ sweptOnce=true; console.warn('[SMA1] Boot überfällig — '+added+' Länder als nachladbar eingetragen'); }
      }
    }
    if(pieces.length && COLOR_FIT.appliedFor!==pieces.length && !recolourTimer) scheduleRecolour();
    /* Dieselbe Lehre, zweiter Gegenstand: die Auswahl hing am Ende der Boot-Sequenz, und die
       kommt nicht immer an (gedrosselte Timer in einer Hintergrund-Vorschau reichen schon).
       Folge: kein Stück gewählt, und damit waren RAISE / STAND_UP / SLIDE / ROTATE / FLIP /
       PULSE / SNAP / Ripple stumme Blindgänger — alle acht sind auf `if(!selected) return false`
       gebaut. Also auch das als Invariante in den Takt statt an eine Reihenfolge. */
    // Beim ersten Takt liegt oft nur eine Handvoll Länder da, FR ist noch unterwegs. Die
    // Notauswahl hält deshalb fest, dass sie NUR eine Notauswahl war, und tritt zurück, sobald
    // das dokumentierte Startland ankommt — aber nie gegen eine Wahl, die Georg selbst getroffen hat.
    if(pieces.length && (!selected || autoPick)){
      const want=pieces.find(p=>p.code==='FR')||pieces[0];
      if(want && want!==selected){ try{ selectPiece(want); autoPick=true; }
        catch(err){ console.error('[SMA1] Auto-Auswahl fehlgeschlagen', err); } }
    }
    onState({
      pieces:pieces.length, expected, failed, retryable:failedFiles.length,
      selected:selected?{code:selected.code,name:selected.name,area:+selected.totalArea.toFixed(1)}:null,
      exploded, palette:paletteOn, paletteName:PALETTE_NAME, edgeMode,
      color:{ ...COLOR_FIT },
      water:{ on:WATER.on, fluid:WATER.fluid, cells:WATER.cells.length, error:WATER.error||null },
      voxel:{ on:VOX.on, cell:VOX.cell, count:VOX.count, error:VOX.error||null },
      deform:{ on:DEF.on, strength:DEF.strength, groups:DEF.handles.length, error:DEF.error||null },
      bits:{ on:BITS.on, placed:BITS.placed.length, error:BITS.error||null },
      ink:{status:INK_STATUS,preset:INK_PRESET,gain:INK_GAIN},
      landmark:{...LM, asset:undefined, iso:undefined},
      canonical:canonicalError()
    });
  }
  pushState();
  setInterval(pushState,500);

  // KANTEN-MODUS
  // 'outline' = Kanon-Tusche, Seiten in Tuschefarbe (Combat Arena).
  // 'shadow'  = keine Tusche. Jedes Stück wird um LIFT angehoben, sodass der bestehende
  //             Schattenwurf zwischen Stück und Brett UND zwischen den Stücken eine echte
  //             Kante zeichnet; die Seitenwand bekommt den eigenen Farbton stark abgedunkelt,
  //             also eine Eigenschatten-Kante statt einer gezeichneten Linie.
  //             Der Hub sitzt auf inner.position.y — der Pivot und damit der kanonische
  //             Zustand bleiben unberührt (Reset-Abweichung bleibt 0).
  const EDGE_LIFT=0.62;
  function setEdgeMode(mode){
    edgeMode = mode==='shadow' ? 'shadow' : 'outline';
    for(const r of pieces){
      for(const m of r.inkMeshes) m.visible = edgeMode==='outline';
      r.inner.position.y = edgeMode==='shadow' ? EDGE_LIFT : 0;
      if(edgeMode==='shadow') r.sideMat.color.setHex(r.baseColor).multiplyScalar(0.32);
      else r.sideMat.color.setHex(0x1f1a14);
    }
    return edgeMode;
  }

  function setEdgeHeight(k){
    edgeHeight=Math.max(0.2,Math.min(4,Number(k)||1));
    for(const r of pieces) r.inner.scale.y=edgeHeight;
    if(VOX.mesh) VOX.mesh.scale.y=edgeHeight;
    return edgeHeight;
  }

  function setPaletteName(name){
    const known = !!ATLAS_BY_ID[name] || name === 'paper' || !!PALETTE_BY_ID[name];
    PALETTE_NAME = known ? name : 'atlas-brett';
    usePalette(PALETTE_NAME);
    if(boardTopMat) boardTopMat.color.setHex(PAL_SEABED);
    if(WATER.mat && WATER.mat.uniforms && WATER.mat.uniforms.uCol) WATER.mat.uniforms.uCol.value.setHex(PAL_SEA);
    applyColours();
    return PALETTE_NAME;
  }

  function setPalette(on){
    paletteOn=!!on;
    for(const r of pieces){
      if(paletteOn) r.topMat.color.setHex(r.baseColor);
      else r.topMat.color.copy(PAPER);
    }
    return paletteOn;
  }

  const api={
    mapPin:MAP_PIN,
    inkStatus(){ return INK_STATUS; },
    isoInfo(){ return isoView ? { code:isoView.lastCode, children:isoView.lastChildren, radius:isoView.lastRadius,
      camY:+isoView.camera.position.y.toFixed(2), w:isoView.lw, h:isoView.lh } : null; },
    inkPresetName(){ return INK_PRESET; },
    setInkPreset(name){ if(PRESET_MAP[name]){ INK_PRESET=name; rebuildAllInk(); } return INK_PRESET; },
    setInkGain(g){ INK_GAIN=Math.max(0.15,Math.min(3,Number(g)||1)); rebuildAllInk(); return INK_GAIN; },
    inkGain(){ return INK_GAIN; },
    setPalette, palette(){ return paletteOn; },
    setEdgeMode, edgeMode(){ return edgeMode; },
    setEdgeHeight, edgeHeight(){ return edgeHeight; },
    clearance(){ let n=0; for(const r of pieces) if(Math.abs(r.pivot.quaternion.dot(r.canonical.q))<0.99995) n++; return { rotated:n, guard:'lift-over' }; },
    setBits, bits(){ return BITS.on; },
    bitsInfo(){ return { on:BITS.on, placed:BITS.placed.length, hosts:BITS.hosts, size:BITS.size, dead:BITS.dead.slice(), error:BITS.error }; },
    setDeform, deform(){ return DEF.on; },
    setDeformStrength, deformStrength(){ return DEF.strength; },
    deformInfo(){ return { on:DEF.on, strength:DEF.strength, groups:DEF.handles.length,
      error:DEF.error, info:DEF.handles[0]?DEF.handles[0].info:null }; },
    exportSnapshot, importSnapshot, snapshotSchema:SNAP_SCHEMA,
    setVoxel, voxel(){ return VOX.on; },
    setVoxelCell, voxelCell(){ return VOX.cell; },
    voxelInfo(){ return { on:VOX.on, cell:VOX.cell, count:VOX.count, step:+VOX.step.toFixed(4), error:VOX.error }; },
    setWater, water(){ return WATER.on; },
    setFluid, fluid(){ return WATER.fluid; },
    fluidKeys(){ return FLUID ? Object.entries(FLUID.CARD_ZONE_V2_FLUIDS).map(([id,f])=>({id,name:f.label})) : []; },
    waterInfo(){
      const m=WATER.mesh;
      return { on:WATER.on, fluid:WATER.fluid, cells:WATER.cells.length, cell:WATER.cell, y:WATER.y, error:WATER.error||null,
        mesh: m ? {
          visible:m.visible, inRoot:m.parent===root, parent:m.parent?m.parent.type:null,
          verts:m.geometry.attributes.position?m.geometry.attributes.position.count:0,
          idx:m.geometry.index?m.geometry.index.count:0,
          bsR:m.geometry.boundingSphere?+m.geometry.boundingSphere.radius.toFixed(1):null,
          matType:m.material?m.material.type:null,
          col:m.material&&m.material.uniforms?m.material.uniforms.uCol.value.getHexString():null,
          hasMap:m.material&&m.material.uniforms?m.material.uniforms.uHasMap.value:null,
          wy:(()=>{const v=new THREE.Vector3();m.getWorldPosition(v);return +v.y.toFixed(2);})()
        } : null };
    },
    setPaletteName, paletteName(){ return PALETTE_NAME; },
    paletteMenu(){ return PALETTE_MENU; },
    colorInfo(){ return { ...COLOR_FIT, cell:ADJ_CELL, minTouch:MIN_TOUCH, colors:palette.length,
      tones:new Set(PAL_FAM).size,
      swatches:palette.map((h,i)=>({ hex:'#'+h.toString(16).padStart(6,'0'), tone:PAL_LABEL[i] })) }; },
    recolour(){ ADJ=null; return applyColours(); },
    act(name){ if(!selected||!ACTIONS[name]) return false; ACTIONS[name](selected); pushState(); return true; },
    camera(name){ (CAMERAS[name]||CAMERAS.RESET)(); return name; },
    explode(){ return setExploded(!exploded); },
    ripple(){ if(!selected) return false; startRipple(selected); return true; },
    reset(){ const worst=resetCanonical(); unanchorLandmark(); CAMERAS.TABLE(); pushState(); return worst; },
    select(code){ const r=pieces.find(p=>p.code===String(code||'').toUpperCase()); if(r){ autoPick=false; selectPiece(r); } return !!r; },
    list(){ return pieces.map(p=>({code:p.code,name:p.name,area:+p.totalArea.toFixed(1)})); },
    missing(){ return failedFiles.map(f=>String(f.entity).toUpperCase()); },
    async retryMissing(){
      if(!failedFiles.length) return 0;
      const again=failedFiles.splice(0); recount();
      status('lade ' + again.length + ' fehlende Länder nach …');
      await mapLimit(again,4,loadOne);
      pieces.sort((a,b)=>b.totalArea-a.totalArea);
      ADJ=null; applyColours();          // ein nachgeladenes Land ändert die Nachbarschaft
      status(null); pushState();
      return failedFiles.length;
    },
    loadLandmark, anchorLandmark, unanchorLandmark,
    state(){ return { pieces:pieces.length, expected, failed, exploded,
      selected:selected?.code||null, landmark:{status:LM.status,model:LM.model,error:LM.error,anchored:LM.anchored,
      triangles:LM.asset?.triangles||null,mode:LM.asset?.mode||null}, canonical:canonicalError() }; }
  };
  window.KFBSMA1=api;
  loadLandmark('eiffel');
  loadBoundaries();          // bewusst NICHT awaited — siehe Boot-Kommentar
  return api;
}
