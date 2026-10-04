/* KFB Collage Engine v0 · Schema kfb.collage-engine.v0
   Ein WebGL-Renderer, ein Takt, ein Planer je Canvas.
   Seed + Regelwerk + Pool -> endlose, nicht repetitive Collage in beliebigem Seitenverhältnis.
   Einsatz: Billboard-Anzeigemodus, später Karten, Module, Three.js-CanvasTexture.
   Repo-Ziel: tools/collage_engine/kfb-collage-engine.js (Claude Design pusht nicht). */
(function (root) {
'use strict';

const hash32 = s => { let h = 2166136261 >>> 0; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
const rng = seed => { let a = seed >>> 0; return () => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
const wpick = (r, w, avoid) => { let e = Object.entries(w || {}).filter(([k, v]) => v > 0 && !(avoid && avoid.has(k))); if (!e.length) e = Object.entries(w || {}).filter(([, v]) => v > 0); const s = e.reduce((a, [, v]) => a + v, 0); let x = r() * s; for (const [k, v] of e) { x -= v; if (x <= 0) return k; } return e.length ? e[e.length - 1][0] : null; };
const range = (r, a, b) => a + (b - a) * r();
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const hex = h => { const n = parseInt(String(h).replace('#', ''), 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]; };
const lin = c => c <= .03928 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4);
const relL = ([r, g, b]) => .2126 * lin(r) + .7152 * lin(g) + .0722 * lin(b);
const ratio = (a, b) => { const x = relL(a), y = relL(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
const strip = s => String(s || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

const EFFECTS = { none: [0, 0], ascii: [1, 2], dither: [2, 1], halftone: [3, 1], pixel: [4, 1], lines: [5, 1], engrave: [6, 1], thermal: [7, 2], duotone: [8, 0] };
const HERO_FX = ['none', 'duotone', 'engrave', 'halftone', 'dither'];
const CELL = { ascii: [8, 13], dither: [6, 10], halftone: [7, 12], pixel: [6, 10], lines: [6, 10], engrave: [7, 12] };
const LENSES = { waber: 1, heat: 2, swirl: 3, kal: 4, shake: 5 };
const BLENDS = { normal: [0, 0], multiply: [1, 0], screen: [2, 0], overlay: [3, 1], difference: [4, 2], lumakey: [5, 1] };
const MASKS = { full: 0, card: 1, circle: 2, arch: 3, strip: 4, blob: 5 };
const TRANS = { cut: 0, fade: 1, wipe: 2, luma: 3, iris: 4, push: 5, glitch: 6, ink: 7 };
const CHARSETS = { standard: ' .:-=+*#%@MB', blocks: ' ░▒▓█', braille: ' ⠁⠃⠇⡇⣇⣧⣷⣿', runic: ' .ᚠᚢᚦᚨᚱᚲᚷᚹ', matrix: ' 01', dots: ' .•◦●◉' };
const PICO = ['#000000', '#1D2B53', '#7E2553', '#008751', '#AB5236', '#5F574F', '#C2C3C7', '#FFF1E8', '#FF004D', '#FFA300', '#FFEC27', '#00E436', '#29ADFF', '#83769C', '#FF77A8', '#FFCCAA'];
// Paletten wie im Effekt-Labor (OPEN: Labor soll künftig von hier lesen, dann gibt es nur noch eine Liste)
const PALETTES = {
  kfb: { label: 'KFB', bg: '#121110', fg: '#ece6da', type: '#ff6a50', pal: ['#121110', '#5a3a2e', '#ff6a50', '#ece6da'] },
  paper: { label: 'Papier', bg: '#ece6da', fg: '#1b1917', type: '#b3261e', pal: ['#ece6da', '#a39b8c', '#4a453e', '#1b1917'] },
  sepia: { label: 'Sepia', bg: '#1c140c', fg: '#f1e2c4', type: '#ffffff', pal: ['#1c140c', '#5e4630', '#b89770', '#f1e2c4'] },
  phosphor: { label: 'Phosphor', bg: '#031a0a', fg: '#33ff66', type: '#d8ffe0', pal: ['#031a0a', '#0f5a26', '#33ff66', '#b8ffc8'] },
  amber: { label: 'Amber', bg: '#140b00', fg: '#ffb000', type: '#fff1c9', pal: ['#140b00', '#6b3f00', '#ffb000', '#ffe7a3'] },
  gameboy: { label: 'Game Boy', bg: '#0f380f', fg: '#9bbc0f', type: '#e0f8d0', pal: ['#0f380f', '#306230', '#8bac0f', '#9bbc0f'] },
  pico8: { label: 'PICO-8', bg: '#000000', fg: '#FFF1E8', type: '#FF004D', pal: PICO },
  propaganda: { label: 'Druck', bg: '#e9dcc0', fg: '#1a1a1a', type: '#c8102e', pal: ['#e9dcc0', '#c8102e', '#1a1a1a'] }
};
const CATS = { alchemy: 'Alchemie', davinci: 'da Vinci', anatomy: 'Anatomie', science: 'Wissenschaft', maps: 'Karten', arthistory: 'Kunstgeschichte', photo: 'Fotos', newspaper: 'Zeitungen', propaganda: 'Propaganda', silentfilm: 'Stummfilm', cartoon: 'Cartoons', documentary: 'Dokus' };
const VIDEO_CATS = new Set(['silentfilm', 'cartoon', 'propaganda', 'documentary']);
// Notbehelf, falls seeds.json nicht erreichbar ist. Wahrheit bleibt tools/public_domain/seeds.json.
const SEEDS_FALLBACK = { alchemy: ['alchemy engraving'], davinci: ['Leonardo da Vinci drawing'], anatomy: ['anatomical engraving'], science: ['astronomy engraving'], maps: ['antique world map'], arthistory: ['Hokusai'], photo: ['daguerreotype portrait'], newspaper: ['newspaper 1920'], propaganda: ['wartime poster 1942'], silentfilm: ['silent film 1920'], cartoon: ['cartoon 1930'], documentary: ['educational film 1950'] };

/* ---------- Regelwerke (kfb.collage-rules.v0) ---------- */
const BASE = {
  shot: { min: 3.5, max: 6 }, transDur: [.45, 1.1], layers: { min: 2, max: 3 }, budget: 3,
  effects: { none: 3, duotone: 2, halftone: 2, dither: 2, engrave: 2, lines: 1, pixel: 1, ascii: 1, thermal: 1 },
  lenses: { waber: 1, heat: 1, swirl: 1, kal: .5, shake: 1 }, lensP: .3,
  blends: { multiply: 2, screen: 2, overlay: 1, difference: 1, lumakey: 2 },
  masks: { card: 3, circle: 2, arch: 2, strip: 1, blob: 1 },
  transitions: { cut: 2, fade: 2, wipe: 2, luma: 2, iris: 1, push: 2, glitch: 1, ink: 1 },
  moves: { schweben: 3, ranfahrt: 2, rausfahrt: 1, drift: 2, kippen: 1 },
  palettes: { paper: 2, propaganda: 2, kfb: 2, sepia: 1, amber: 1, phosphor: .5, gameboy: .3 },
  text: { p: .7, moods: { werbung: 3, subversiv: 2, zufall: 1 }, modes: { fest: 3, tipp: 2, wort: 2, wechsel: 1, atmen: 1 } },
  memory: { asset: 14, effect: 2, transition: 2, palette: 1, text: 40, mask: 1 },
  legibility: { minContrast: 4.5, maxBusy: .14 },
  post: { grain: .6, vig: .5 }, video: .25, credits: { every: 24 }
};
const PRESETS = {
  werbeblock: { label: 'Werbeblock', text: { p: .9, moods: { werbung: 4, subversiv: 1, zufall: 1 }, modes: { fest: 3, tipp: 2, wort: 2, wechsel: 1, atmen: 1 } }, transitions: { cut: 3, push: 3, wipe: 2, iris: 1, fade: 1, glitch: 1 }, lensP: .15 },
  subversiv: { label: 'Subversiv', text: { p: .85, moods: { subversiv: 4, werbung: 1, zufall: 1 }, modes: { fest: 4, wort: 2, tipp: 2 } }, palettes: { propaganda: 3, paper: 2, kfb: 2, sepia: 1 }, effects: { halftone: 3, engrave: 2, dither: 2, duotone: 2, none: 2, lines: 1 }, transitions: { cut: 4, wipe: 2, glitch: 1, push: 1 } },
  hypnose: { label: 'Hypnose', shot: { min: 6, max: 10 }, transDur: [1.2, 2.4], budget: 4, lensP: .6, text: { p: .4, moods: { zufall: 3, subversiv: 1 }, modes: { atmen: 3, fest: 1, wort: 2 } }, transitions: { fade: 3, ink: 3, luma: 3 }, moves: { schweben: 3, ranfahrt: 2, rausfahrt: 2 } },
  wochenschau: { label: 'Wochenschau', shot: { min: 3, max: 5 }, layers: { min: 1, max: 2 }, effects: { dither: 3, duotone: 3, engrave: 2, none: 1, lines: 1 }, palettes: { sepia: 3, paper: 2, propaganda: 1 }, transitions: { cut: 3, wipe: 2, iris: 2 }, text: { p: .6, moods: { subversiv: 2, werbung: 2 }, modes: { fest: 3, tipp: 2 } }, post: { grain: 1, vig: .8 }, video: .5 },
  fiebertraum: { label: 'Fiebertraum', shot: { min: 2.5, max: 5 }, layers: { min: 3, max: 3 }, budget: 5, lensP: .7, blends: { difference: 2, screen: 2, lumakey: 2, overlay: 2 }, transitions: { glitch: 2, ink: 2, luma: 2, cut: 1 }, text: { p: .5, moods: { zufall: 3, werbung: 1 }, modes: { wechsel: 2, atmen: 2, fest: 1 } }, palettes: { kfb: 2, pico8: 1, phosphor: 1, amber: 1, gameboy: 1 } }
};
const rulesFor = (name, extra) => { const p = PRESETS[name] || PRESETS.werbeblock, o = {}; for (const k of Object.keys(BASE)) { const b = BASE[k], v = (extra && extra[k]) ?? p[k]; o[k] = v === undefined ? b : (b && typeof b === 'object' && !Array.isArray(b) && ['shot', 'layers', 'memory', 'legibility', 'post', 'credits', 'text'].includes(k) ? { ...b, ...v } : v); } o.name = name; return o; };

/* ---------- Textgenerator (kfb.collage-text.v0) ---------- */
const VOCAB = {
  en: {
    noun: ['MOON', 'LUNG', 'ENGINE', 'COMET', 'ORACLE', 'TOOTH', 'EMPIRE', 'SALT', 'MIRROR', 'SAINT', 'TURBINE', 'SPLEEN', 'LIGHTHOUSE', 'APPARATUS', 'SPHERE', 'NERVE', 'HORIZON', 'SKELETON', 'TELESCOPE', 'HOMUNCULUS', 'CATHEDRAL', 'DYNAMO', 'ZEPPELIN', 'LABYRINTH'],
    nouns: ['MOONS', 'LUNGS', 'ENGINES', 'ORACLES', 'TEETH', 'EMPIRES', 'MIRRORS', 'SAINTS', 'NERVES', 'HORIZONS', 'SKELETONS', 'DREAMS', 'MAPS', 'CLOCKS'],
    abstract: ['CERTAINTY', 'NOSTALGIA', 'PROGRESS', 'SILENCE', 'DESTINY', 'OBEDIENCE', 'WONDER', 'HYGIENE', 'ETERNITY', 'CONSENSUS', 'MEANING', 'GRAVITY', 'HOPE', 'LOYALTY', 'MYSTERY', 'CALM'],
    adj: ['ALCHEMICAL', 'ELECTRIC', 'PATENTED', 'IMPERIAL', 'ANATOMICAL', 'CELESTIAL', 'SILENT', 'SANITARY', 'INFINITE', 'HANDMADE', 'NATIONAL', 'HOLLOW', 'RADIANT', 'OFFICIAL', 'FORBIDDEN'],
    auth: ['DOCTOR', 'ALCHEMIST', 'PRIEST', 'ACCOUNTANT', 'ASTRONOMER', 'MAYOR', 'ORACLE', 'LANDLORD', 'BARBER'],
    color: ['ORANGE', 'SEPIA', 'ULTRAMARINE', 'BEIGE', 'NEON', 'GOLD', 'GREY'],
    verb: ['TRUST', 'POLISH', 'INHALE', 'FORGET', 'OBEY', 'REPEAT', 'CALIBRATE', 'WORSHIP', 'UPGRADE', 'SWALLOW', 'MEASURE', 'RENT'],
    claim: ['CLINICALLY PROVEN', 'CERTIFIED', 'APPROVED BY MOONS', 'TESTED ON SAINTS', 'GUARANTEED', 'OFFICIAL']
  },
  de: {
    noun: ['MOND', 'LUNGE', 'MOTOR', 'KOMET', 'ORAKEL', 'ZAHN', 'IMPERIUM', 'SALZ', 'SPIEGEL', 'TURBINE', 'MILZ', 'LEUCHTTURM', 'APPARAT', 'NERV', 'HORIZONT', 'SKELETT', 'FERNROHR', 'HOMUNKULUS', 'DYNAMO', 'ZEPPELIN', 'LABYRINTH'],
    nouns: ['MONDE', 'LUNGEN', 'MOTOREN', 'ORAKEL', 'ZÄHNE', 'SPIEGEL', 'NERVEN', 'SKELETTE', 'TRÄUME', 'KARTEN', 'UHREN', 'HEILIGE'],
    abstract: ['GEWISSHEIT', 'NOSTALGIE', 'FORTSCHRITT', 'STILLE', 'SCHICKSAL', 'GEHORSAM', 'STAUNEN', 'HYGIENE', 'EWIGKEIT', 'KONSENS', 'SINN', 'HOFFNUNG', 'TREUE', 'RUHE'],
    adj: ['ALCHEMISTISCH', 'ELEKTRISCH', 'PATENTIERT', 'KAISERLICH', 'HIMMLISCH', 'STUMM', 'HYGIENISCH', 'UNENDLICH', 'AMTLICH', 'HOHL', 'STRAHLEND', 'VERBOTEN'],
    auths: ['ÄRZTE', 'ALCHEMISTEN', 'PRIESTER', 'BUCHHALTER', 'ASTRONOMEN', 'BÜRGERMEISTER', 'VERMIETER', 'BARBIERE'],
    color: ['ORANGE', 'SEPIA', 'ULTRAMARIN', 'BEIGE', 'NEON', 'GOLD', 'GRAU'],
    verb: ['VERTRAUEN', 'POLIEREN', 'EINATMEN', 'VERGESSEN', 'GEHORCHEN', 'WIEDERHOLEN', 'KALIBRIEREN', 'ANBETEN', 'SCHLUCKEN', 'VERMESSEN', 'MIETEN'],
    claim: ['KLINISCH GEPRÜFT', 'ZERTIFIZIERT', 'VON MONDEN EMPFOHLEN', 'AMTLICH BESTÄTIGT', 'GARANTIERT']
  }
};
const TEMPLATES = {
  en: {
    werbung: ['NOW WITH MORE {abstract}', '{title}. NOW IN {color}.', 'ASK YOUR {auth} ABOUT {abstract}', '{num}% MORE {abstract}', 'NEW! {adj} {noun}', '{noun} FOR THE WHOLE FAMILY', 'YOU DESERVE {abstract}', '{verb} THE {noun}. {verb} MORE.', 'LIMITED EDITION {abstract}', '{claim}', '{title}: THE {adj} CHOICE', '{adj} {abstract} · ONLY {num} LEFT'],
    subversiv: ['WHO OWNS YOUR {nouns}?', '{abstract} IS A SUBSCRIPTION', 'THE {noun} IS WATCHING BACK', 'YOU ARE THE {noun}', 'NOTHING TO SEE. {verb} ANYWAY.', '{abstract} WAS NEVER FREE', 'STAY {adj}. STAY QUIET.', 'CONSUME {abstract} RESPONSIBLY', 'THIS {noun} IS NOT A {noun}', '{title} WAS HERE FIRST', 'DO NOT {verb} THE {noun}'],
    zufall: ['{noun} / {noun}', '{adj} {noun}', '{title}?', '{num} {nouns} LATER', '{abstract} / {noun} / {verb}', '{noun} OF {abstract}']
  },
  de: {
    werbung: ['JETZT MIT NOCH MEHR {abstract}', '{title}. JETZT IN {color}.', '{auths} EMPFEHLEN {abstract}', '{num} % MEHR {abstract}', 'NEU! {abstract} ZUM {verb}', '{abstract} FÜR DIE GANZE FAMILIE', 'SIE HABEN {abstract} VERDIENT', '{claim}', 'LIMITIERTE AUFLAGE: {abstract}', '{title}: {claim}'],
    subversiv: ['WEM GEHÖREN DEINE {nouns}?', '{abstract} IST EIN ABO', 'DU BIST DAS PRODUKT', 'HIER GIBT ES NICHTS ZU SEHEN', '{abstract} WAR NIE UMSONST', 'BLEIB {adj}. BLEIB STILL.', 'NICHT {verb}', '{title} WAR ZUERST DA', '{nouns} SIND AUCH NUR {nouns}'],
    zufall: ['{noun} / {noun}', '{adj} / {noun}', '{title}?', '{num} {nouns} SPÄTER', '{abstract} / {noun} / {verb}']
  }
};
const STOP = new Set(['OF', 'THE', 'AND', 'IN', 'A', 'AN', 'TO', 'DE', 'DER', 'DIE', 'DAS', 'UND', 'VON', 'LA', 'LE', 'DU', 'ET', 'FOR', 'WITH', 'ON', 'AT', 'BY']);
const titleWords = t => { let s = strip(t).split(/\blabel\b|QS:|\s[-–—]\s|;/i)[0]; s = s.replace(/\([^)]*\)|\[[^\]]*\]|\d{3,4}|File:|\.(jpe?g|png|tiff?|webm|ogv)$/gi, '').replace(/[_:,"“”„]+/g, ' ').trim(); let w = s.split(/\s+/).filter(x => x.length > 1).slice(0, 4).map(x => x.toUpperCase()); while (w.length && STOP.has(w[w.length - 1])) w.pop(); if (w.length > 1 && STOP.has(w[0])) w.shift(); const out = w.join(' '); return out.length > 2 && out.length <= 24 ? out : null; };
function genText(r, mood, lang, title) {
  const V = VOCAB[lang] || VOCAB.en, T = (TEMPLATES[lang] || TEMPLATES.en)[mood] || TEMPLATES.en.zufall;
  const tpl = T[Math.floor(r() * T.length)];
  return tpl.replace(/\{(\w+)\}/g, (_, k) => {
    if (k === 'num') return String([3, 7, 12, 40, 99, 101, 250][Math.floor(r() * 7)]);
    if (k === 'title') return title || (V.noun[Math.floor(r() * V.noun.length)]);
    const list = V[k] || V.noun; return list[Math.floor(r() * list.length)];
  });
}
const FONTS = {
  werbung: [s => `900 ${s}px 'Archivo'`, s => `${s}px 'Bungee'`, s => `${s}px 'Rubik Mono One'`, s => `italic 800 ${s}px 'Bodoni Moda'`],
  subversiv: [s => `900 ${s}px 'Archivo'`, s => `700 ${s}px 'Space Mono'`, s => `800 ${s}px 'Syne'`],
  zufall: [s => `900 ${s}px 'Archivo'`, s => `${s}px 'Bungee'`, s => `italic 800 ${s}px 'Bodoni Moda'`, s => `${s}px 'UnifrakturMaguntia'`, s => `800 ${s}px 'Syne'`]
};
const SWITCH = ["'UnifrakturMaguntia'", "'Bodoni Moda'", "'Space Mono'", "'Bungee'", "'Syne'", "'Rubik Mono One'", "'Archivo'"];

/* ---------- Shader ---------- */
const VS = 'attribute vec2 p;varying vec2 vUv;void main(){vUv=p*.5+.5;gl_Position=vec4(p,0.,1.);}';
const COMMON = `
float luma(vec3 c){return dot(c,vec3(.299,.587,.114));}
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,s,-s,c);}
float vnoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*vnoise(p);p*=2.03;a*=.5;}return v;}`;
const LAYER_FS = `precision highp float;
uniform sampler2D uDst,uSrc,uGlyph;
uniform vec2 uRes,uSrcSize;
uniform vec4 uRect,uXf;
uniform float uTime,uCell,uContrast,uBright,uSat,uColorSrc,uPalN,uOpacity,uDim,uLensAmt,uGlyphN,uShadow,uSeed;
uniform int uMode,uBlend,uMask,uLens;
uniform vec3 uFg,uBg,uPal[16];
varying vec2 vUv;
${COMMON}
float bayer2(vec2 a){a=floor(a);return fract(a.x/2.+a.y*a.y*.75);}
float bayer4(vec2 a){return bayer2(.5*a)*.25+bayer2(a);}
float bayer8(vec2 a){return bayer4(.5*a)*.25+bayer2(a);}
vec2 rpx(){return uRect.zw*uRes*uXf.z;}
vec2 cover(vec2 q){vec2 rp=rpx();float ra=rp.x/rp.y,sa=uSrcSize.x/max(uSrcSize.y,1.);vec2 s=vec2(1.);if(sa>ra)s.x=ra/sa;else s.y=sa/ra;return(q-.5)*s+.5;}
vec3 src(vec2 q){vec3 c=texture2D(uSrc,cover(clamp(q,0.,1.))).rgb;c=(c-.5)*uContrast+.5+uBright;c=mix(vec3(luma(c)),c,uSat);return clamp(c,0.,1.);}
float tone(float l){return luma(uBg)<luma(uFg)?l:1.-l;}
vec3 nearestPal(vec3 c){vec3 b=uPal[0];float bd=1e9;for(int i=0;i<16;i++){if(float(i)>=uPalN)break;vec3 d=c-uPal[i];float dd=dot(d,d);if(dd<bd){bd=dd;b=uPal[i];}}return b;}
vec3 inkc(vec3 c){return uColorSrc>.5?c:uFg;}
vec3 thermal(float t){vec3 a=vec3(0.,0.,.1),b=vec3(.25,0.,.6),c=vec3(.9,0.,.35),d=vec3(1.,.45,0.),e=vec3(1.,.9,.2),f=vec3(1.);
 if(t<.2)return mix(a,b,t/.2);if(t<.4)return mix(b,c,(t-.2)/.2);if(t<.6)return mix(c,d,(t-.4)/.2);if(t<.8)return mix(d,e,(t-.6)/.2);return mix(e,f,(t-.8)/.2);}
vec2 lens(vec2 q){float k=uLensAmt,t=uTime;vec2 rp=rpx();vec2 a=vec2(rp.x/rp.y,1.);
 if(uLens==1){vec2 p=q*a*2.5;q+=(vec2(fbm(p+vec2(t*.25,0.)),fbm(p+vec2(5.2,1.3)-t*.22))-.5)*.12*k;}
 else if(uLens==2){q.x+=(vnoise(vec2(q.x*24.,q.y*38.-t*4.))-.5)*.016*k;q.y+=(vnoise(vec2(q.x*30.+7.,q.y*20.-t*3.))-.5)*.006*k;}
 else if(uLens==3){vec2 p=(q-.5)*a;float r=length(p);p=rot(k*3.*(1.-smoothstep(0.,.65,r))*sin(t*.45))*p;q=p/a+.5;}
 else if(uLens==4){vec2 p=(q-.5)*a;float an=atan(p.y,p.x)+t*.08,r=length(p),seg=6.28318/(3.+floor(k*6.));an=mod(an,seg);an=abs(an-seg*.5);q=vec2(cos(an),sin(an))*r/a+.5;}
 else if(uLens==5){q=(q-.5)/(1.+.05*k)+.5;q+=(vec2(fbm(vec2(t*1.3,1.7)),fbm(vec2(4.1,t*1.1)))-.5)*.035*k;}
 return q;}
vec3 effect(vec2 q){vec2 rp=rpx();vec2 px=q*rp;
 if(uMode==1){vec2 cs=vec2(uCell*.62,uCell);vec2 id=floor(px/cs);vec3 col=src((id+.5)*cs/rp);float l=tone(luma(col));float gi=floor(clamp(l,0.,.999)*uGlyphN);vec2 f=fract(px/cs);float a=texture2D(uGlyph,vec2((gi+f.x)/uGlyphN,f.y)).a;return mix(uBg,inkc(col),a);}
 if(uMode==2){float s=max(1.,floor(uCell/3.));vec2 id=floor(px/s);vec3 col=src((id+.5)*s/rp);float t=bayer8(id);
  if(uPalN>2.5&&uColorSrc>.5)return nearestPal(col+(t-.5)*.3);
  if(uPalN>2.5){float l=tone(luma(col));float k=floor(l*(uPalN-1.)+t);k=clamp(k,0.,uPalN-1.);vec3 r=uPal[0];for(int i=0;i<16;i++){if(float(i)==k)r=uPal[i];}return r;}
  return mix(uBg,inkc(col),step(t,tone(luma(col))));}
 if(uMode==3){float s=uCell;vec2 p=rot(.785)*px;vec2 id=floor(p/s);vec2 c=(id+.5)*s;vec3 col=src((rot(-.785)*c)/rp);float r=sqrt(tone(luma(col)))*s*.6;float on=1.-smoothstep(r-.8,r+.8,length(p-c));return mix(uBg,inkc(col),on);}
 if(uMode==4){float s=max(2.,floor(uCell/2.));vec2 id=floor(px/s);vec3 col=src((id+.5)*s/rp);return nearestPal(col+(bayer4(id)-.5)*.2);}
 if(uMode==5){float s=uCell;float row=floor(px.y/s);float cy=(row+.5)*s;vec3 col=src(vec2(px.x,cy)/rp);float th=tone(luma(col))*s*.95;float on=1.-smoothstep(th*.5-.7,th*.5+.7,abs(px.y-cy));return mix(uBg,inkc(col),on);}
 if(uMode==6){vec3 col=src(q);float l=tone(luma(col));float sp=max(3.,uCell*.45);float on=0.;
  vec2 p1=rot(.45)*px,p2=rot(-.45)*px;
  float d1=abs(fract(p1.y/sp)-.5)*2.,d2=abs(fract(p2.y/sp)-.5)*2.,d3=abs(fract(px.x/sp)-.5)*2.;
  on=max(on,step(d1,clamp((l-.12)*1.6,0.,.9)));on=max(on,step(d2,clamp((l-.42)*1.6,0.,.9)));on=max(on,step(d3,clamp((l-.7)*1.8,0.,.9)));
  vec2 e=1.5/rp;float gx=luma(src(q+vec2(e.x,0.)))-luma(src(q-vec2(e.x,0.)));float gy=luma(src(q+vec2(0.,e.y)))-luma(src(q-vec2(0.,e.y)));
  on=max(on,smoothstep(.12,.35,length(vec2(gx,gy))));return mix(uBg,inkc(col),on);}
 if(uMode==7){return thermal(luma(src(q)));}
 if(uMode==8){vec3 col=src(q);return mix(uBg,uFg,smoothstep(0.,1.,tone(luma(col))));}
 return src(q);}
float maskSd(vec2 q){vec2 rp=rpx();vec2 p=(q-.5)*rp;
 if(uMask==1){vec2 d=abs(p)-(rp*.5-6.);return length(max(d,0.))+min(max(d.x,d.y),0.)-6.;}
 if(uMask==2){return length(p)-min(rp.x,rp.y)*.5;}
 if(uMask==3){float w=rp.x*.5,h=rp.y*.5;vec2 c=vec2(0.,h-w);if(p.y>c.y)return length(p-c)-w;vec2 d=abs(p)-vec2(w,h);return max(d.x,d.y);}
 if(uMask==4){float e=(fbm(vec2(p.x*.035,uSeed))-.5)*rp.y*.22;float e2=(fbm(vec2(p.x*.035+9.,uSeed))-.5)*rp.y*.22;return max(abs(p.x)-rp.x*.5,max(p.y-(rp.y*.5+e),-(p.y+rp.y*.5+e2)));}
 if(uMask==5){float a=atan(p.y,p.x);float r0=min(rp.x,rp.y)*.5;return length(p)-r0*(.8+.34*(fbm(vec2(cos(a),sin(a))*1.4+uSeed)-.5));}
 return -1e3;}
void main(){
 vec3 dst=texture2D(uDst,vUv).rgb;
 if(uMode==99){vec4 t=texture2D(uSrc,vUv);gl_FragColor=vec4(mix(dst,t.rgb,t.a*uOpacity),1.);return;}
 vec2 asp=vec2(uRes.x/uRes.y,1.);
 vec2 d=rot(-uXf.w)*((vUv-uRect.xy-uXf.xy)*asp);
 vec2 q=d/(uRect.zw*asp*uXf.z)+.5;
 float m=1.;
 if(uMask!=0){float sd=maskSd(q);m=1.-smoothstep(-1.,1.,sd);
  if(uShadow>0.){float s2=maskSd(q-vec2(10.,-14.)/rpx());dst*=1.-(1.-smoothstep(-2.,26.,s2))*uShadow*.55*uOpacity;}}
 if(m<.001){gl_FragColor=vec4(dst,1.);return;}
 vec2 ql=uLens>0?lens(q):q;
 vec3 c=mix(uBg,effect(ql),uDim);
 vec3 b=c;
 if(uBlend==1)b=dst*c;else if(uBlend==2)b=1.-(1.-dst)*(1.-c);else if(uBlend==3)b=mix(2.*dst*c,1.-2.*(1.-dst)*(1.-c),step(.5,dst));else if(uBlend==4)b=abs(dst-c);else if(uBlend==5){float k=smoothstep(.3,.7,luma(c));b=mix(dst,c,k);}
 gl_FragColor=vec4(mix(dst,b,m*uOpacity),1.);
}`;
const TRANS_FS = `precision highp float;
uniform sampler2D uA,uB;uniform vec2 uRes;uniform float uP,uTime,uDir,uGrain,uVig,uLed,uSeed;uniform int uKind;uniform vec3 uBg;varying vec2 vUv;
${COMMON}
vec3 A(vec2 u){return texture2D(uA,u).rgb;}vec3 B(vec2 u){return texture2D(uB,u).rgb;}
void main(){vec2 uv=vUv;if(uLed>0.)uv=(floor(uv*uRes/uLed)+.5)*uLed/uRes;float p=clamp(uP,0.,1.);vec3 c;vec2 asp=vec2(uRes.x/uRes.y,1.);
 if(uKind<0)c=A(uv);
 else if(uKind==0)c=p<.5?A(uv):B(uv);
 else if(uKind==1)c=mix(A(uv),B(uv),smoothstep(0.,1.,p));
 else if(uKind==2){float an=uDir*1.5708+.35;vec2 dr=vec2(cos(an),sin(an));float s=dot(uv-.5,dr)/(abs(dr.x)*.5+abs(dr.y)*.5)*.5+.5;float w=.05;float k=smoothstep(s-w,s,p*(1.+w));float edge=smoothstep(.012,0.,abs(s-p*(1.+w)+w*.5))*step(.02,p)*step(p,.98);c=mix(mix(A(uv),B(uv),k),uBg,edge);}
 else if(uKind==3){float th=luma(B(uv))*.7+fbm(uv*asp*6.+uSeed)*.3;float k=smoothstep(th-.08,th+.08,p*1.16-.08);c=mix(A(uv),B(uv),k);}
 else if(uKind==4){float r=length((uv-.5)*asp),rm=length(asp*.5);float k=1.-smoothstep(p*rm-.004,p*rm+.004,r);float ring=smoothstep(.01,0.,abs(r-p*rm))*step(.02,p)*step(p,.98);c=mix(mix(A(uv),B(uv),k),uBg,ring);}
 else if(uKind==5){float e=p*p*(3.-2.*p);float sg=mod(uDir,2.)<1.?1.:-1.;if(uDir<2.){float x=uv.x+sg*e;c=(x>=0.&&x<=1.)?A(vec2(x,uv.y)):B(vec2(x-sg,uv.y));}else{float y=uv.y+sg*e;c=(y>=0.&&y<=1.)?A(vec2(uv.x,y)):B(vec2(uv.x,y-sg));}}
 else if(uKind==6){float s=sin(p*3.14159);vec2 bl=floor(uv*vec2(10.,28.));float g=hash(bl+floor(uTime*24.));vec2 o=vec2((hash(bl.yy+floor(uTime*30.))-.5)*.18*s*step(1.-s*.7,g),0.);vec2 u=uv+o;float ca=.012*s;c=p<.5?vec3(A(u+vec2(ca,0.)).r,A(u).g,A(u-vec2(ca,0.)).b):vec3(B(u+vec2(ca,0.)).r,B(u).g,B(u-vec2(ca,0.)).b);}
 else{float th=fbm(uv*asp*3.+uSeed);float x=p*1.3-.15;float k=smoothstep(th-.04,th+.04,x);float edge=smoothstep(.05,0.,abs(th-x))*step(.02,p)*step(p,.98);c=mix(mix(A(uv),B(uv),k),uBg*.25,edge*.7);}
 if(uGrain>0.){c+=(hash(floor(vUv*uRes)+fract(uTime*7.)*91.)-.5)*.09*uGrain;}
 if(uVig>0.){vec2 q=vUv-.5;c*=1.-dot(q,q)*uVig;}
 if(uLed>0.){vec2 f=fract(vUv*uRes/uLed)-.5;c*=(.2+1.05*smoothstep(.5,.3,length(f)));}
 gl_FragColor=vec4(clamp(c,0.,1.),1.);}`;

/* ---------- Pool ---------- */
const RAW = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/';
// Manifest mit Commit-Pin (PD-POOL-R1, Persistenz-Commit). Daten über raw, Medien über jsDelivr am selben Pin (raw liefert SVG als text/plain).
const PD_PIN = 'f3acaaeb98530dd9ffb7d200d61956891e738336';
const PD_MANIFEST = `https://raw.githubusercontent.com/georg-doc/kayfabizarro/${PD_PIN}/media/public_domain/manifest.jsonl`;
const PROV_LABEL = { met: 'The Met Open Access', aic: 'Art Institute of Chicago', commons: 'Wikimedia Commons', ia: 'Internet Archive' };
const PROV_CAT = { met: 'arthistory', aic: 'arthistory', commons: 'science', ia: 'silentfilm' };
const TAG_CAT = { print: 'arthistory', intertitle: 'silentfilm', etching: 'arthistory', engraving: 'science', newsreel: 'propaganda', poster: 'propaganda' };
const mediaBaseOf = (u) => { const m = /^https:\/\/raw\.githubusercontent\.com\/([^/]+)\/([^/]+)\/([^/]+)\/(.*\/)?[^/]*$/.exec(u); if (m) return `https://cdn.jsdelivr.net/gh/${m[1]}/${m[2]}@${m[3]}/${m[4] || ''}`; try { return new URL('.', new URL(u, location.href)).href; } catch (e) { return ''; } };
const kindOf = (p) => { const e = String(p || '').split('?')[0].split('.').pop().toLowerCase(); return /^(jpe?g|png|webp|gif|svg|avif)$/.test(e) ? 'image' : /^(webm|mp4|ogv|ogg|mov)$/.test(e) ? 'video' : /^(mp3|wav|flac|oga|opus)$/.test(e) ? 'audio' : null; };
// Liest kfb.public-domain-asset/0.2 (fetch_pool.py auf main) und kfb.pd-item.v1 (älteres Paket). Thema: category > Tag "cat:<id>" > Tag = Themen-ID > TAG_CAT > Anbieter.
function normEntry(x, base) {
  const tags = (x.tags || []).map(t => String(t).toLowerCase());
  const kind = x.media || kindOf(x.localPath || x.path || x.fileUrl || x.sourceFileUrl);
  if (!kind || x.stored === false || x.tier === 'reject') return null;
  const ct = tags.find(t => t.startsWith('cat:'));
  const category = x.category || (ct && ct.slice(4)) || tags.map(t => t.replace(/[-_ ]/g, '')).find(t => CATS[t]) || tags.map(t => TAG_CAT[t]).find(Boolean) || PROV_CAT[x.provider] || 'arthistory';
  const url = x.localPath ? base + x.localPath.split('/').map(encodeURIComponent).join('/') : x.stored ? RAW + x.path : (x.fileUrl || x.sourceFileUrl);
  if (!url) return null;
  const clean = s => s == null ? '' : String(s).replace(/\s+/g, ' ').trim();
  const title = clean(x.title).replace(/^File:/, '');
  const credit = x.credit || [title, clean(x.creator) || 'Urheber unbekannt', clean(x.date), clean(x.rights), PROV_LABEL[x.provider] || x.provider].filter(Boolean).join(' · ');
  return { id: x.id, category, title, credit, tier: x.tier || 'free', sourcePage: x.sourcePage, kind, urls: [url], from: 'manifest', sha256: x.sha256 };
}
class Pool {
  constructor(eng) { this.e = eng; this.items = []; this.status = 'init'; this.source = '—'; this.tried = 0; this.failed = 0; this.rejected = 0; this.queue = []; this.gen = 0; this.addProcedural(); }
  addProcedural() {
    const mk = (id, title, draw) => { const c = document.createElement('canvas'); c.width = 960; c.height = 640; draw(c.getContext('2d'), c.width, c.height); this.add({ id, category: 'proc', title, credit: 'generiert', tier: 'proc', kind: 'image', el: c, w: c.width, h: c.height }); };
    mk('proc-rings', 'Ringe', (x, W, H) => { const g = x.createRadialGradient(W * .4, H * .45, 10, W / 2, H / 2, W * .7); g.addColorStop(0, '#f4efe4'); g.addColorStop(1, '#1b1917'); x.fillStyle = g; x.fillRect(0, 0, W, H); x.strokeStyle = 'rgba(0,0,0,.5)'; for (let i = 1; i < 40; i++) { x.lineWidth = 1 + (i % 3); x.beginPath(); x.arc(W * .4, H * .45, i * 14, 0, 7); x.stroke(); } });
    mk('proc-sphere', 'Kugel', (x, W, H) => { x.fillStyle = '#d8d0c0'; x.fillRect(0, 0, W, H); const g = x.createRadialGradient(W * .44, H * .38, 20, W / 2, H / 2, H * .42); g.addColorStop(0, '#ffffff'); g.addColorStop(.7, '#6b645a'); g.addColorStop(1, '#121110'); x.fillStyle = g; x.beginPath(); x.arc(W / 2, H / 2, H * .42, 0, 7); x.fill(); });
  }
  // Mindestauflösung: Vorschaubilder (z. B. IA Item Tile, 4 KB) werden als Held zu Pixelbrei. SVG ohne Eigenmaß zählt nicht als zu klein.
  tooSmall(x, w, h) { const m = this.e.opts.minEdge; if (!m || x.kind !== 'image' || /\.svg($|\?)/i.test(x.urls[0]) || Math.max(w, h) >= m) return false; this.small = (this.small || 0) + 1; return true; }
  add(it) { const gl = this.e.gl; it.tex = this.e.mkTex(); if (it.kind === 'image') this.e.uploadTex(it.tex, it.el); it.uses = 0; this.items.push(it); return it; }
  real() { return this.items.filter(i => i.tier !== 'proc'); }
  pick(r, avoid, wantVideo, inShot, lastUse) {
    const pool = this.real().filter(i => (wantVideo ? i.kind === 'video' : i.kind === 'image') && !inShot.has(i.id));
    let c = pool.filter(i => !avoid.has(i.id));
    if (!c.length && wantVideo) return null;
    if (c.length) return c[Math.floor(r() * c.length)];
    // Gedächtnis größer als Pool: das am längsten nicht gezeigte Bild statt Zufall (G6)
    if (pool.length) return pool.slice().sort((a, b) => (lastUse.get(a.id) ?? -1) - (lastUse.get(b.id) ?? -1))[0];
    c = this.items.filter(i => i.tier === 'proc');
    return c[Math.floor(r() * c.length)];
  }
  async init() {
    const g = ++this.gen, o = this.e.opts, themes = new Set(o.themes && o.themes.length ? o.themes : Object.keys(CATS));
    this.items.filter(i => i.tier !== 'proc').forEach(i => { this.e.gl.deleteTexture(i.tex); if (i.kind === 'video') { i.el.pause(); i.el.removeAttribute('src'); } });
    this.items = this.items.filter(i => i.tier === 'proc'); this.tried = this.failed = this.rejected = this.small = 0;
    this.status = 'sucht'; this.e.emit('pool', this.info());
    let man = [], parts = [];
    this.manifest = { url: o.manifestUrl || null, rows: 0, usable: 0, matching: 0, error: null };
    if (o.manifestUrl) {
      try {
        const res = await fetch(o.manifestUrl, { cache: 'no-cache' }); if (!res.ok) throw new Error(res.status);
        const rows = (await res.text()).split('\n').filter(l => l.trim()).map(l => { try { return JSON.parse(l); } catch (e) { return null; } }).filter(Boolean);
        const base = o.mediaBase || mediaBaseOf(o.manifestUrl), all = rows.map(x => normEntry(x, base)).filter(x => x && (x.kind === 'image' || x.kind === 'video'));
        man = all.filter(x => themes.has(x.category));
        Object.assign(this.manifest, { rows: rows.length, usable: all.length, matching: man.length });
        const pin = (/\/([0-9a-f]{40})\//.exec(o.manifestUrl) || [])[1];
        parts.push(`Manifest${pin ? ' @' + pin.slice(0, 7) : ''} (${man.length} von ${rows.length} passend)`);
      } catch (e) { this.manifest.error = String(e.message); parts.push(`Manifest nicht erreichbar (${e.message})`); }
    }
    if (g !== this.gen) return;
    // Live-Suche ergänzt, solange das Manifest das Gedächtnisfenster nicht füllen kann (minManifest), und bleibt abschaltbar (live: false).
    let liveE = [];
    if (o.live !== false && man.filter(x => x.kind === 'image').length < o.minManifest) { liveE = (await this.live(themes)).filter(x => !man.some(m => m.id === x.id)); parts.push(`Live-Suche Commons + Art Institute (${liveE.length} Treffer)`); }
    if (g !== this.gen) return;
    this.source = parts.join(' + ') || '—';
    const r = rng(hash32(o.seed + '|pool'));
    const order = (entries) => { const byCat = {}; entries.forEach(x => (byCat[x.category] = byCat[x.category] || []).push(x));
      Object.values(byCat).forEach(a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } });
      const keys = Object.keys(byCat).sort(), q = []; for (let i = keys.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [keys[i], keys[j]] = [keys[j], keys[i]]; }
      for (let k = 0; q.length < entries.length; k++) keys.forEach(c => { if (byCat[c][k]) q.push(byCat[c][k]); }); return q; };
    // Manifest zuerst: gepinnte, geprüfte Assets haben Vorrang vor Live-Treffern
    const q = [...order(man), ...order(liveE)];
    let nImg = 0, nVid = 0; this.queue = q.filter(x => x.kind === 'image' ? (nImg++ < o.poolCap) : (nVid++ < o.videoCap));
    this.status = 'lädt'; this.e.emit('pool', this.info());
    const worker = async () => { while (this.queue.length && g === this.gen) { const x = this.queue.shift(); this.tried++; try { await this.load(x); } catch (e) { this.failed++; } this.e.emit('pool', this.info()); } };
    await Promise.all([worker(), worker(), worker(), worker()]);
    if (g === this.gen) { this.status = 'bereit'; this.e.emit('pool', this.info()); }
  }
  load(x) {
    if (x.kind === 'image' && window.createImageBitmap) return Promise.race([this.loadBitmap(x), new Promise((_, rej) => setTimeout(() => rej(new Error('Frist')), 8000))]).catch(() => this.items.some(i => i.id === x.id) ? null : this.loadImg(x));
    return this.loadImg(x);
  }
  // Dekodieren und Verkleinern ausserhalb des Hauptfadens; flipY steckt im Bitmap, weil UNPACK_FLIP_Y fuer ImageBitmap nicht gilt.
  async loadBitmap(x) {
    const res = await fetch(x.urls[0], { mode: 'cors' }); if (!res.ok) throw new Error(res.status);
    const b0 = await createImageBitmap(await res.blob()), M = 1024, k = Math.min(1, M / Math.max(b0.width, b0.height));
    if (this.tooSmall(x, b0.width, b0.height)) { b0.close && b0.close(); return; }
    const bmp = await createImageBitmap(b0, { resizeWidth: Math.max(1, Math.round(b0.width * k)), resizeHeight: Math.max(1, Math.round(b0.height * k)), resizeQuality: 'high', imageOrientation: 'flipY' });
    b0.close && b0.close();
    if (this.items.some(i => i.id === x.id)) { bmp.close && bmp.close(); return; }
    this.add({ ...x, el: bmp, w: bmp.width, h: bmp.height, bitmap: true });
  }
  loadImg(x) {
    return new Promise((res, rej) => {
      let done = false; const ok = () => { if (done) return false; done = true; clearTimeout(to); return true; };
      // Jede Ladung hat eine Frist, sonst hält ein stummer Clip einen der vier Arbeiter für immer fest
      const to = setTimeout(() => { if (!ok()) return; if (x._v) { x._v.onloadeddata = x._v.onerror = null; x._v.removeAttribute('src'); x._v.load(); } rej(new Error('Frist')); }, x.kind === 'video' ? 12000 : 8000);
      if (x.kind === 'video') {
        const tryN = i => { if (done) return; if (i >= x.urls.length) { ok() && rej(new Error('video')); return; } const v = document.createElement('video'); x._v = v; v.crossOrigin = 'anonymous'; v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'auto';
          v.onloadeddata = () => { if (!ok()) return; v.play().catch(() => {}); this.add({ ...x, el: v, w: v.videoWidth || 16, h: v.videoHeight || 9 }); res(); }; v.onerror = () => tryN(i + 1); v.src = x.urls[i]; };
        return tryN(0);
      }
      const img = new Image(); img.crossOrigin = 'anonymous';
      img.onload = () => { if (!ok()) return; if (this.tooSmall(x, img.naturalWidth, img.naturalHeight)) { res(); return; } try { this.add({ ...x, el: img, w: img.naturalWidth, h: img.naturalHeight }); res(); } catch (e) { rej(e); } };
      img.onerror = () => { ok() && rej(new Error('img')); }; img.src = x.urls[0];
    });
  }
  async live(themes) {
    const o = this.e.opts, r = rng(hash32(o.seed + '|q'));
    let seeds = null;
    if (o.seedsUrl) { try { const j = await (await fetch(o.seedsUrl)).json(); seeds = {}; j.categories.forEach(c => seeds[c.id] = c.queries); } catch (e) { seeds = null; } }
    seeds = seeds || SEEDS_FALLBACK;
    const out = [], jobs = [];
    const commons = async (cat, q, video) => {
      const u = `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrlimit=40&gsrsearch=${encodeURIComponent(q + (video ? ' filetype:video' : ' filetype:bitmap'))}&prop=imageinfo&iiprop=url|extmetadata|mime&iiurlwidth=1280`;
      const pages = Object.values(((await (await fetch(u)).json()).query || {}).pages || {});
      let n = 0;
      for (const p of pages) {
        const ii = (p.imageinfo || [])[0]; if (!ii) continue;
        const lic = String(((ii.extmetadata || {}).License || {}).value || '').toLowerCase();
        if (!(lic.startsWith('pd') || lic === 'cc0')) { this.rejected++; continue; }
        const em = ii.extmetadata || {}, title = strip(em.ObjectName && em.ObjectName.value) || p.title.replace(/^File:/, ''), artist = strip(em.Artist && em.Artist.value) || 'Urheber unbekannt';
        const base = { id: 'commons-' + p.pageid, category: cat, title, tier: 'free', sourcePage: ii.descriptionurl, credit: `${title} · ${artist} · ${strip(em.LicenseShortName && em.LicenseShortName.value)} · Wikimedia Commons` };
        if (video) { if (!/video|ogg/.test(ii.mime)) continue; const m = /\/wikipedia\/commons\/(\w\/\w\w)\/([^/]+)$/.exec(ii.url); const urls = m ? ['360p.vp9.webm', '360p.webm', '480p.vp9.webm'].map(x => `https://upload.wikimedia.org/wikipedia/commons/transcoded/${m[1]}/${m[2]}/${m[2]}.${x}`) : []; urls.push(ii.url); out.push({ ...base, kind: 'video', urls }); if (++n >= 3) break; }
        else { if (!/jpeg|png/.test(ii.mime)) continue; out.push({ ...base, kind: 'image', urls: [ii.thumburl || ii.url] }); if (++n >= 8) break; }
      }
    };
    const aic = async (cat, q) => {
      const u = `https://api.artic.edu/api/v1/artworks/search?q=${encodeURIComponent(q)}&query[term][is_public_domain]=true&fields=id,title,artist_title,date_display,image_id&limit=12`;
      const d = (await (await fetch(u)).json()).data || [];
      d.filter(a => a.image_id).slice(0, 6).forEach(a => out.push({ id: 'aic-' + a.id, category: cat, title: a.title, tier: 'free', kind: 'image', sourcePage: `https://www.artic.edu/artworks/${a.id}`, credit: `${a.title} · ${a.artist_title || 'Urheber unbekannt'} · ${a.date_display || ''} · CC0 · Art Institute of Chicago`, urls: [`https://www.artic.edu/iiif/2/${a.image_id}/full/843,/0/default.jpg`] }));
    };
    for (const cat of themes) {
      const qs = (seeds[cat] || []).slice(); if (!qs.length) continue;
      const q1 = qs[Math.floor(r() * qs.length)], q2 = qs[Math.floor(r() * qs.length)];
      if (!['silentfilm', 'documentary'].includes(cat)) { jobs.push(commons(cat, q1, false).catch(() => {})); if (q2 !== q1) jobs.push(commons(cat, q2, false).catch(() => {})); }
      if (VIDEO_CATS.has(cat) && o.video !== false) jobs.push(commons(cat, q1, true).catch(() => {}));
      if (['arthistory', 'photo'].includes(cat)) jobs.push(aic(cat, q1).catch(() => {}));
    }
    await Promise.all(jobs);
    const seen = new Set(); return out.filter(x => !seen.has(x.id) && seen.add(x.id));
  }
  info() { const real = this.real(); const byCat = {}; real.forEach(i => byCat[i.category] = (byCat[i.category] || 0) + 1); return { status: this.status, source: this.source, manifest: this.manifest || null, fromManifest: real.filter(i => i.from === 'manifest').length, small: this.small || 0, images: real.filter(i => i.kind === 'image').length, videos: real.filter(i => i.kind === 'video').length, queued: this.queue.length, tried: this.tried, failed: this.failed, rejected: this.rejected, byCat }; }
}

/* ---------- Engine ---------- */
class Engine {
  constructor(canvas, opts) {
    this.canvas = canvas;
    this.opts = Object.assign({ seed: 'kfb', preset: 'werbeblock', rules: null, aspect: '16:9', longEdge: 1280, mode: 'endless', loopShots: 8, lang: 'en', guard: true, text: true, led: 0, themes: null, manifestUrl: PD_MANIFEST, mediaBase: null, minManifest: 24, minEdge: 640, live: true, seedsUrl: null, poolCap: 36, videoCap: 3, autoplay: true, speed: 1 }, opts || {});
    this.L = {}; this.fx = {}; this.glyphs = {};
    this.stats = { fps: 0, ms: 0, shots: 0 };
    this.initGL();
    this.typeC = [document.createElement('canvas'), document.createElement('canvas')];
    this.typeTex = [this.mkTex(), this.mkTex()];
    this.applyRules(); this.resize(); this.reset();
    this.pool = new Pool(this); this.pool.init();
    if (document.fonts) { ["900 40px 'Archivo'", "200 40px 'Archivo'", "40px 'Bungee'", "40px 'Rubik Mono One'", "italic 800 40px 'Bodoni Moda'", "700 40px 'Bodoni Moda'", "700 40px 'Space Mono'", "800 40px 'Syne'", "40px 'UnifrakturMaguntia'", "500 40px 'IBM Plex Mono'"].forEach(f => document.fonts.load(f).catch(() => {})); }
    if (document.fonts) document.fonts.addEventListener && document.fonts.addEventListener('loadingdone', () => { this.plans.forEach(p => p && p.text && (p.text.layout = null)); this.glyphs = {}; });
    this._last = 0; this._fpsT = 0; this._fpsN = 0; this._ms = 0;
    if (this.opts.autoplay) this.start();
  }
  on(ev, fn) { (this.L[ev] = this.L[ev] || []).push(fn); return () => { this.L[ev] = this.L[ev].filter(f => f !== fn); }; }
  emit(ev, d) { (this.L[ev] || []).forEach(f => { try { f(d); } catch (e) { console.error(e); } }); }
  applyRules() { this.rules = rulesFor(this.opts.preset, this.opts.rules); }
  set(o) {
    const prev = { ...this.opts }; Object.assign(this.opts, o);
    if ('preset' in o || 'rules' in o) this.applyRules();
    if ('aspect' in o || 'longEdge' in o) this.resize();
    if (['seed', 'preset', 'rules', 'aspect', 'longEdge', 'mode', 'loopShots', 'lang', 'guard', 'text'].some(k => k in o && o[k] !== prev[k])) this.reset();
    if (('themes' in o && JSON.stringify(o.themes) !== JSON.stringify(prev.themes)) || ('manifestUrl' in o && o.manifestUrl !== prev.manifestUrl)) this.pool.init();
    this.emit('opts', this.opts);
  }
  reset() { this._trim = 0; this.plans = []; this.cur = 0; this.t = 0; this.frozen = false; this.shown = []; this.used = new Map(); this.lastUse = new Map(); this.stats.shots = 0; this._lastCur = -1; }

  initGL() {
    const gl = this.canvas.getContext('webgl', { preserveDrawingBuffer: true, antialias: false, premultipliedAlpha: false });
    if (!gl) throw new Error('WebGL nicht verfügbar');
    this.gl = gl;
    const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; };
    const prog = fs => { const p = gl.createProgram(); gl.attachShader(p, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs)); gl.bindAttribLocation(p, 0, 'p'); gl.linkProgram(p); if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p)); p._u = {}; return p; };
    this.pLayer = prog(LAYER_FS); this.pTrans = prog(TRANS_FS);
    const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  }
  u(p, n) { let l = p._u[n]; if (l === undefined) l = p._u[n] = this.gl.getUniformLocation(p, n); return l; }
  mkTex() { const gl = this.gl, t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t); [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T].forEach(k => gl.texParameteri(gl.TEXTURE_2D, k, gl.CLAMP_TO_EDGE)); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255])); return t; }
  uploadTex(t, el) { const gl = this.gl; gl.bindTexture(gl.TEXTURE_2D, t); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, el); }
  mkFBO(w, h) { const gl = this.gl, tex = this.mkTex(); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null); const fb = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, fb); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0); gl.bindFramebuffer(gl.FRAMEBUFFER, null); return { fb, tex, w, h }; }
  glyph(cs) {
    if (this.glyphs[cs]) return this.glyphs[cs];
    const chars = [...(CHARSETS[cs] || CHARSETS.standard)], cw = 40, ch = 64, c = document.createElement('canvas'); c.width = cw * chars.length; c.height = ch;
    const x = c.getContext('2d'); x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = "500 54px 'IBM Plex Mono', monospace";
    chars.forEach((k, i) => x.fillText(k, i * cw + cw / 2, ch / 2 + 2));
    const t = this.mkTex(); this.uploadTex(t, c); return (this.glyphs[cs] = { tex: t, n: chars.length });
  }
  resize() {
    const [a, b] = String(this.opts.aspect).split(':').map(Number), R = (a > 0 && b > 0) ? a / b : 16 / 9, E = this.opts.longEdge;
    const W = Math.round((R >= 1 ? E : E * R) / 2) * 2, H = Math.round((R >= 1 ? E / R : E) / 2) * 2;
    this.W = W; this.H = H; this.R = W / H; this.canvas.width = W; this.canvas.height = H;
    this.typeC.forEach(c => { c.width = W; c.height = H; });
    const gl = this.gl; (this.acc || []).flat().forEach(f => { gl.deleteTexture(f.tex); gl.deleteFramebuffer(f.fb); });
    this.acc = [[this.mkFBO(W, H), this.mkFBO(W, H)], [this.mkFBO(W, H), this.mkFBO(W, H)]];
    const mw = 96, mh = Math.max(8, Math.round(96 / this.R)); if (this.meas) { gl.deleteTexture(this.meas.tex); gl.deleteFramebuffer(this.meas.fb); } this.meas = this.mkFBO(mw, mh);
  }

  /* ----- Planer ----- */
  plan(n) {
    if (this.frozen) n = ((n % this.opts.loopShots) + this.opts.loopShots) % this.opts.loopShots;
    while (this.plans.length <= n) { const k = this.plans.length, p = this.makePlan(k), pr = this.plans[k - 1]; p.T = pr ? pr.T + pr.dur : 0; this.plans.push(p); }
    return this.plans[n];
  }
  recent(n, win, f) { const s = new Set(); for (let i = Math.max(0, n - win); i < n; i++) { const p = this.plans[i]; if (p) [].concat(f(p)).forEach(v => v != null && s.add(v)); } return s; }
  makePlan(n) {
    const R = this.rules, o = this.opts, g = o.guard, r = rng(hash32(o.seed + '|' + o.preset + '|' + n)), M = R.memory;
    const every = R.credits && R.credits.every, req = [...this.used.values()].filter(i => i.tier === 'fallback-attribution');
    if (every && req.length && n > 0 && n % every === 0) return this.creditsPlan(n, req);
    const dur = range(r, R.shot.min, R.shot.max);
    const tk = wpick(r, R.transitions, g ? this.recent(n, M.transition, p => p.trans.kind) : null);
    const trans = { kind: tk, dur: tk === 'cut' ? .06 : tk === 'glitch' ? .4 : range(r, R.transDur[0], R.transDur[1]), dir: Math.floor(r() * 4), seed: r() * 50 };
    const palette = wpick(r, R.palettes, g ? this.recent(n, M.palette, p => p.palette) : null);
    const move = wpick(r, R.moves), side = r() < .5 ? -1 : 1, phase = r() * 6.28;
    const hasText = o.text && r() < R.text.p;
    let budget = g ? R.budget - (hasText ? 1 : 0) : 99;
    const avoid = this.recent(n, M.asset, p => p.layers.map(l => l.asset && l.asset.id));
    const nReal = this.pool.real().length;
    let nL = R.layers.min + Math.floor(r() * (R.layers.max - R.layers.min + 1)); if (nReal < 3) nL = Math.min(nL, Math.max(1, nReal));
    const avoidFx = g ? this.recent(n, M.effect, p => p.layers.map(l => l.effect)) : null;
    const pickFx = (maxCost, allowAvoid, only) => { const w = {}; Object.entries(R.effects).forEach(([k, v]) => { if (EFFECTS[k] && EFFECTS[k][1] <= maxCost && (!only || only.includes(k))) w[k] = v; }); if (!Object.keys(w).length) w.none = 1; return wpick(r, w, allowAvoid ? null : avoidFx); };
    const fxParams = (effect) => { const c = CELL[effect]; return { effect, cell: c ? Math.round(range(r, c[0], c[1])) : 10, charset: ['standard', 'blocks', 'braille', 'runic', 'matrix', 'dots'][Math.floor(r() * 6)], contrast: range(r, 1, 1.3), bright: 0, colorSrc: r() < .3 }; };
    const pa = (a) => a ? clamp(a.w / Math.max(1, a.h), .62, 1.5) : 1;
    const layers = [], used = new Set();
    const take = (video) => { const a = this.pool.pick(r, avoid, video, used, this.lastUse); if (a) used.add(a.id); return a; };
    const wantVid = r() < R.video;
    // Held: genau einer (G1)
    let heroRect = null, textBox = null, align = 'center';
    const Rr = this.R;
    if (nL >= 2) {
      const mask = wpick(r, R.masks, g ? this.recent(n, M.mask, p => p.layers.filter(l => l.role === 'held').map(l => l.mask)) : null);
      const a = take(false), ar = mask === 'circle' || mask === 'blob' ? 1 : mask === 'strip' ? 2.6 : mask === 'arch' ? Math.min(pa(a), .85) : pa(a);
      let cx, cy, h;
      if (Rr >= 1.6) { cx = .5 + side * (hasText ? .22 : .1); cy = .5; h = mask === 'strip' ? .4 : .8; textBox = [.5 - side * .24, .5, .42, .72]; align = side > 0 ? 'left' : 'right'; }
      else if (Rr <= .8) { cx = .5; cy = hasText ? .62 : .54; h = mask === 'strip' ? .2 : .5; textBox = [.5, .19, .86, .26]; }
      else { cx = .5 + side * .12; cy = hasText ? .58 : .52; h = mask === 'strip' ? .3 : .64; textBox = [.5, .15, .86, .2]; }
      let w = h * ar / Rr; const wMax = hasText && Rr >= 1.6 ? .46 : .88; if (w > wMax) { w = wMax; h = w * Rr / ar; }
      // G1: der Held muss erkennbar bleiben, nur Effekte, die Umriss und Tonwerte tragen
      const fx = pickFx(g ? Math.min(1, budget) : 9, false, g ? HERO_FX : null); budget -= EFFECTS[fx][1];
      heroRect = [cx, cy, w, h]; const hp = fxParams(fx); if (g) hp.cell = Math.min(hp.cell, 9);
      layers.push({ role: 'held', asset: a, ...hp, mask, rect: heroRect, z: 1.5, blend: 'normal', opacity: 1, dim: 1, sat: 1, lens: null, shadow: ['card', 'arch', 'circle'].includes(mask) ? .9 : .5 });
    } else if (hasText) { textBox = Rr >= 1.6 ? [.5, .22, .8, .3] : Rr <= .8 ? [.5, .2, .86, .26] : [.5, .18, .86, .24]; }
    // Grundplatte
    { const vid = wantVid ? take(true) : null, a = vid || take(false);
      const fx = pickFx(g ? Math.max(0, budget) : 9); budget -= EFFECTS[fx][1];
      let lens = null; if (r() < R.lensP && (!g || budget >= 1)) { lens = wpick(r, R.lenses); budget -= g ? 1 : 0; }
      const under = nL > 1 || hasText;
      layers.unshift({ role: 'grund', asset: a, ...fxParams(fx), mask: 'full', rect: [.5, .5, 1, 1], z: 3, blend: 'normal', opacity: 1, dim: g && under ? range(r, .42, .62) : 1, sat: g && under ? .55 : 1, lens, lensAmt: range(r, .35, .8), shadow: 0 }); }
    // Akzent
    if (nL >= 3) {
      const a = take(false), bl = wpick(r, g ? Object.fromEntries(Object.entries(R.blends).filter(([k]) => BLENDS[k] && BLENDS[k][1] <= Math.max(0, budget))) : R.blends) || 'multiply'; budget -= g ? BLENDS[bl][1] : 0;
      const fx = pickFx(g ? Math.max(0, budget) : 9); budget -= EFFECTS[fx][1];
      const mask = ['circle', 'strip', 'card', 'blob'][Math.floor(r() * 4)], h = mask === 'strip' ? range(r, .12, .2) : range(r, .22, .36), ar = mask === 'strip' ? 3.2 : mask === 'card' ? pa(a) : 1;
      const w = Math.min(.7, h * ar / Rr);
      const inHero = c => heroRect && Math.abs(c[0] - heroRect[0]) < heroRect[2] / 2 + w * .2 && Math.abs(c[1] - heroRect[1]) < heroRect[3] / 2 + h * .2;
      const cand = [[.16, .8], [.84, .8], [.16, .2], [.84, .2], [.5, .87], [.5, .13]].concat(g ? [] : [[heroRect ? heroRect[0] : .5, heroRect ? clamp(heroRect[1] + heroRect[3] * .45, .1, .9) : .8]]);
      // G1: der Akzent liegt neben dem Helden, nicht auf ihm, und nie im Textfeld
      const pos = cand.filter(c => (!g || !inHero(c)) && (!textBox || Math.abs(c[0] - textBox[0]) > textBox[2] / 2 + w / 3 || Math.abs(c[1] - textBox[1]) > textBox[3] / 2 + h / 3));
      const pp = (pos.length ? pos : cand)[Math.floor(r() * (pos.length || cand.length))];
      layers.push({ role: 'akzent', asset: a, ...fxParams(fx), mask, rect: [pp[0], pp[1], w, h], z: .8, blend: bl, opacity: range(r, .55, .85), dim: 1, sat: 1, lens: null, shadow: 0 });
    }
    let text = null;
    if (hasText && textBox) {
      const mood = wpick(r, R.text.moods), heroA = layers.find(l => l.role === 'held') || layers[0];
      const rt = this.recent(n, M.text, p => p.text && p.text.str);
      let str = ''; for (let i = 0; i < 8; i++) { str = genText(r, mood, o.lang, titleWords(heroA.asset && heroA.asset.title)); if (!rt.has(str)) break; }
      let mode = wpick(r, R.text.modes); if (g && mode === 'wechsel' && str.replace(/\s|\//g, '').length > 14) mode = 'fest';
      const fl = FONTS[mood] || FONTS.zufall;
      text = { str, mood, mode, box: textBox, align: Rr >= 1.6 ? align : 'center', font: fl[Math.floor(r() * fl.length)], layout: null, measured: null };
    }
    const cost = layers.reduce((s, l) => s + EFFECTS[l.effect][1] + (l.lens ? 1 : 0) + (l.role === 'akzent' ? BLENDS[l.blend][1] : 0), 0) + (text ? 1 : 0);
    layers.forEach(l => { if (l.asset && l.asset.tier !== 'proc') { this.used.set(l.asset.id, l.asset); this.lastUse.set(l.asset.id, n); } });
    return { n, type: 'shot', dur, trans, palette, move, phase, side, layers, text, cost, budget: g ? R.budget : null, seed: r() * 100 };
  }
  creditsPlan(n, req) {
    const lines = req.slice(0, 14).map(i => i.credit);
    return { n, type: 'credits', dur: Math.max(6, lines.length * .8), trans: { kind: 'fade', dur: .8, dir: 0, seed: 1 }, palette: 'kfb', move: 'schweben', phase: 0, side: 1, layers: [], cost: 0, budget: null, seed: 1,
      text: { str: 'CREDITS', lines, mood: 'credits', mode: 'credits', box: [.5, .5, .8, .84], align: 'center', font: s => `500 ${s}px 'IBM Plex Mono'`, layout: null, measured: { treatment: 'none', color: PALETTES.kfb.fg, contrast: ratio(hex(PALETTES.kfb.fg), hex(PALETTES.kfb.bg)), busy: 0 } } };
  }

  /* ----- Zeit ----- */
  state() {
    const n = this.cur, pl = this.plan(n), lt = this.t - pl.T;
    let prev = null, prevT = 0;
    if (n > 0) { prev = this.plan(n - 1); prevT = prev.T; }
    else if (this.frozen) { prev = this.plan(this.opts.loopShots - 1); prevT = -prev.dur; }
    if (prev && lt < prev.trans.dur) return { A: prev, tA: this.t - prevT, B: pl, tB: lt, p: lt / prev.trans.dur, trans: prev.trans };
    return { A: pl, tA: lt, B: null, tB: 0, p: 0, trans: null, prevTrans: prev ? prev.trans.dur : 0 };
  }
  advance(dt) {
    this.t += dt * this.opts.speed;
    for (let guard = 0; guard < 50; guard++) {
      const pl = this.plan(this.cur); if (this.t < pl.T + pl.dur) break;
      this.cur++;
      if (this.opts.mode === 'loop' && !this.frozen && this.cur >= this.opts.loopShots) { this.frozen = true; this.t -= this.plan(this.opts.loopShots - 1).T + this.plan(this.opts.loopShots - 1).dur; this.cur = 0; }
      else if (this.frozen && this.cur >= this.opts.loopShots) { this.cur = 0; this.t -= this.loopLength(); }
    }
    if (this.opts.mode !== 'loop') { const drop = this.cur - 40; for (let i = this._trim || 0; i < drop; i++) this.plans[i] = { ...this.plans[i], layers: this.plans[i].layers.map(l => ({ role: l.role, effect: l.effect, mask: l.mask, asset: l.asset && { id: l.asset.id } })) }; this._trim = Math.max(this._trim || 0, drop); }
    if (this.cur !== this._lastCur) { this._lastCur = this.cur; this.stats.shots++; const p = this.plan(this.cur); this.shown.push(p); if (this.shown.length > 200) this.shown.shift(); this.emit('shot', { plan: p, next: [1, 2, 3].map(k => this.plan(this.cur + k)), frozen: this.frozen }); }
  }
  loopLength() { let s = 0; for (let i = 0; i < this.opts.loopShots; i++) s += this.plan(i).dur; return s; }
  skip() { const pl = this.plan(this.cur); this.t = pl.T + pl.dur + .001; }
  restart() { this.t = 0; this.cur = 0; this._lastCur = -1; }

  /* ----- Render ----- */
  start() { if (this.running) return; this.running = true; const loop = now => { if (!this.running) return; this._raf = requestAnimationFrame(loop); const dt = this._last ? Math.min(.1, (now - this._last) / 1000) : 0; this._last = now; this.tick(dt, now); }; this._raf = requestAnimationFrame(loop);
    // Verdeckte Seite: rAF ruht. Ersatztakt 4 Hz mit gl.finish(), sonst stauen sich Frames ohne Gegendruck in der GPU-Schlange und der nächste readPixels wartet auf alle.
    clearInterval(this._fb); this._fb = setInterval(() => { if (!this.running || document.visibilityState !== 'hidden') return; const now = performance.now(); const dt = this._last ? Math.min(.25, (now - this._last) / 1000) : .25; this._last = now; this.tick(dt, now); this.gl.finish(); }, 250); }
  stop() { this.running = false; cancelAnimationFrame(this._raf); clearInterval(this._fb); this._last = 0; }
  destroy() { this.stop(); this.pool.gen++; const ext = this.gl.getExtension('WEBGL_lose_context'); ext && ext.loseContext(); }
  tick(dt, now) {
    const t0 = performance.now(); now = now || t0; this.frameNo = (this.frameNo || 0) + 1;
    this.advance(dt);
    const s = this.state(), gl = this.gl;
    const texA = this.drawShot(s.A, s.tA, 0, s.B ? 0 : s.prevTrans);
    const texB = s.B ? this.drawShot(s.B, s.tB, 1, s.trans.dur) : texA;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, this.W, this.H);
    const P = this.pTrans, U = n => this.u(P, n), pal = PALETTES[(s.B || s.A).palette] || PALETTES.kfb, post = this.rules.post || {};
    gl.useProgram(P);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, texA); gl.uniform1i(U('uA'), 0);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, texB); gl.uniform1i(U('uB'), 1);
    gl.uniform2f(U('uRes'), this.W, this.H); gl.uniform1f(U('uP'), s.p); gl.uniform1f(U('uTime'), now / 1000);
    gl.uniform1i(U('uKind'), s.B ? TRANS[s.trans.kind] : -1); gl.uniform1f(U('uDir'), s.trans ? s.trans.dir : 0); gl.uniform1f(U('uSeed'), s.trans ? s.trans.seed : 0);
    gl.uniform1f(U('uGrain'), post.grain || 0); gl.uniform1f(U('uVig'), post.vig || 0); gl.uniform1f(U('uLed'), +this.opts.led || 0);
    gl.uniform3fv(U('uBg'), hex(pal.bg));
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    this._ms += performance.now() - t0; this._fpsN++;
    if (now - this._fpsT > 1000) { this.stats.fps = Math.round(this._fpsN * 1000 / (now - this._fpsT || 1)); this.stats.ms = +(this._ms / this._fpsN).toFixed(1); this._fpsT = now; this._fpsN = 0; this._ms = 0; this.stats.repeat = this.repeatCheck(); this.emit('stats', { ...this.stats, t: this.t, cur: this.cur, frozen: this.frozen, loopLength: this.frozen ? this.loopLength() : null }); }
    this.emit('frame', null);
  }
  moveXf(pl, lt, z) {
    const u = lt / (pl.dur + pl.trans.dur), f = 1.5 / z, ph = pl.phase, s = pl.side;
    let ox = 0, oy = 0, sc = 1, rt = 0;
    switch (pl.move) {
      case 'schweben': ox = Math.sin(u * 3.1 + ph) * .012; oy = Math.cos(u * 2.5 + ph) * .008; rt = Math.sin(u * 2 + ph) * .004; break;
      case 'ranfahrt': sc = 1 + .09 * u; break;
      case 'rausfahrt': sc = 1.09 - .09 * u; break;
      case 'drift': ox = s * (u - .5) * .06; break;
      case 'kippen': rt = (u - .5) * .03 * s; ox = (u - .5) * .02; break;
    }
    return [ox * f, oy * f, 1 + (sc - 1) * f, rt * f];
  }
  drawShot(pl, lt, slot, inDur) {
    const gl = this.gl, acc = this.acc[slot], pal = PALETTES[pl.palette] || PALETTES.kfb, bg = hex(pal.bg), P = this.pLayer, U = n => this.u(P, n), now = performance.now() / 1000;
    gl.bindFramebuffer(gl.FRAMEBUFFER, acc[0].fb); gl.viewport(0, 0, this.W, this.H); gl.clearColor(bg[0], bg[1], bg[2], 1); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(P);
    gl.uniform2f(U('uRes'), this.W, this.H); gl.uniform1f(U('uTime'), now);
    gl.uniform3fv(U('uFg'), hex(pal.fg)); gl.uniform3fv(U('uBg'), bg);
    const flat = new Float32Array(48); pal.pal.forEach((h, i) => flat.set(hex(h), i * 3)); gl.uniform3fv(U('uPal[0]'), flat); gl.uniform1f(U('uPalN'), pal.pal.length);
    gl.uniform1i(U('uDst'), 0); gl.uniform1i(U('uSrc'), 1); gl.uniform1i(U('uGlyph'), 2);
    let k = 0;
    const pass = () => { gl.bindFramebuffer(gl.FRAMEBUFFER, acc[1 - k].fb); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, acc[k].tex); gl.drawArrays(gl.TRIANGLES, 0, 3); k = 1 - k; };
    for (const L of pl.layers) {
      const a = L.asset && L.asset.tex ? L.asset : this.pool.items[0];
      if (a.kind === 'video' && a.el.readyState >= 2 && a._up !== this.frameNo) { this.uploadTex(a.tex, a.el); a._up = this.frameNo; }
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, a.tex);
      if (L.effect === 'ascii') { const gph = this.glyph(L.charset); gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, gph.tex); gl.uniform1f(U('uGlyphN'), gph.n); }
      const base = L.mask === 'full' ? 1.12 : 1, xf = this.moveXf(pl, lt, L.z);
      gl.uniform2f(U('uSrcSize'), a.w || 1, a.h || 1);
      gl.uniform4f(U('uRect'), L.rect[0], L.rect[1], L.rect[2], L.rect[3]); gl.uniform4f(U('uXf'), xf[0], xf[1], xf[2] * base, xf[3]);
      gl.uniform1i(U('uMode'), EFFECTS[L.effect][0]); gl.uniform1f(U('uCell'), L.cell); gl.uniform1f(U('uContrast'), L.contrast); gl.uniform1f(U('uBright'), L.bright);
      gl.uniform1f(U('uSat'), L.sat); gl.uniform1f(U('uColorSrc'), L.colorSrc ? 1 : 0); gl.uniform1f(U('uOpacity'), L.opacity); gl.uniform1f(U('uDim'), L.dim);
      gl.uniform1i(U('uLens'), L.lens ? LENSES[L.lens] : 0); gl.uniform1f(U('uLensAmt'), L.lensAmt || .5);
      gl.uniform1i(U('uBlend'), BLENDS[L.blend][0]); gl.uniform1i(U('uMask'), MASKS[L.mask]); gl.uniform1f(U('uShadow'), L.shadow || 0); gl.uniform1f(U('uSeed'), pl.seed);
      pass();
    }
    if (pl.text) {
      const tIn = (inDur || 0) + .15, tOut = pl.dur - .12, alpha = clamp(Math.min((lt - tIn) / .25, (tOut - lt) / .2), 0, 1);
      if (alpha > 0) {
        if (!pl.text.measured) this.measure(pl, acc[k].tex);
        this.drawText(this.typeC[slot], pl, lt - tIn, now);
        this.uploadTex(this.typeTex[slot], this.typeC[slot]);
        gl.useProgram(P); gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, this.typeTex[slot]);
        gl.uniform1i(U('uMode'), 99); gl.uniform1f(U('uOpacity'), alpha);
        pass();
      }
    }
    return acc[k].tex;
  }
  measure(pl, tex) {
    const gl = this.gl, m = this.meas, P = this.pTrans, U = n => this.u(P, n);
    gl.bindFramebuffer(gl.FRAMEBUFFER, m.fb); gl.viewport(0, 0, m.w, m.h); gl.useProgram(P);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex); gl.uniform1i(U('uA'), 0); gl.uniform1i(U('uB'), 0);
    gl.uniform2f(U('uRes'), m.w, m.h); gl.uniform1i(U('uKind'), -1); gl.uniform1f(U('uGrain'), 0); gl.uniform1f(U('uVig'), 0); gl.uniform1f(U('uLed'), 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    const px = new Uint8Array(m.w * m.h * 4); gl.readPixels(0, 0, m.w, m.h, gl.RGBA, gl.UNSIGNED_BYTE, px);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, this.W, this.H); gl.useProgram(this.pLayer);
    const [cx, cy, w, h] = pl.text.box, x0 = Math.floor((cx - w / 2) * m.w), x1 = Math.ceil((cx + w / 2) * m.w), y0 = Math.floor((cy - h / 2) * m.h), y1 = Math.ceil((cy + h / 2) * m.h);
    const Ls = [], cols = [];
    for (let y = Math.max(0, y0); y < Math.min(m.h, y1); y++) for (let x = Math.max(0, x0); x < Math.min(m.w, x1); x++) { const i = (y * m.w + x) * 4, c = [px[i] / 255, px[i + 1] / 255, px[i + 2] / 255]; cols.push(c); Ls.push(relL(c)); }
    const n = Ls.length || 1, mean = Ls.reduce((a, b) => a + b, 0) / n, busy = Math.sqrt(Ls.reduce((a, b) => a + (b - mean) ** 2, 0) / n);
    const sorted = Ls.slice().sort((a, b) => a - b), p10 = sorted[Math.floor(n * .1)] || 0, p90 = sorted[Math.floor(n * .9)] || 0;
    const pal = PALETTES[pl.palette] || PALETTES.kfb, cands = [pal.type, pal.fg, pal.bg];
    const worst = c => { const L = relL(hex(c)); return Math.min((Math.max(L, p10) + .05) / (Math.min(L, p10) + .05), (Math.max(L, p90) + .05) / (Math.min(L, p90) + .05)); };
    const L = this.rules.legibility, raw = worst(pal.type);
    let res;
    if (!this.opts.guard) res = { treatment: 'none', color: pal.type, contrast: raw };
    else {
      const best = cands.map(c => ({ c, v: worst(c) })).sort((a, b) => b.v - a.v)[0];
      if (best.v >= L.minContrast && busy < L.maxBusy) res = { treatment: 'schatten', color: best.c, contrast: best.v };
      else if (best.v >= L.minContrast * .7 && busy < L.maxBusy * 1.6) res = { treatment: 'schleier', color: best.c, veil: pal.bg === best.c ? pal.fg : pal.bg, contrast: null };
      else { const band = pl.text.mood === 'subversiv' && ratio(hex(pal.type), hex(pal.bg)) >= L.minContrast ? pal.type : pal.bg; const tc = [pal.fg, pal.type, pal.bg].filter(c => c !== band).sort((a, b) => ratio(hex(b), hex(band)) - ratio(hex(a), hex(band)))[0]; res = { treatment: 'band', color: tc, band, contrast: ratio(hex(tc), hex(band)) }; }
      if (res.treatment === 'schleier') { const vL = relL(hex(res.veil)), mixL = x => x * .25 + vL * .75; const lo = mixL(p10), hi = mixL(p90), tL = relL(hex(res.color)); res.contrast = Math.min((Math.max(tL, lo) + .05) / (Math.min(tL, lo) + .05), (Math.max(tL, hi) + .05) / (Math.min(tL, hi) + .05)); }
    }
    pl.text.measured = { ...res, raw, busy, pass: res.contrast >= L.minContrast };
    this.emit('measure', { n: pl.n, ...pl.text.measured });
  }
  drawText(c, pl, lt, now) {
    const x = c.getContext('2d'), W = c.width, H = c.height, T = pl.text, M = T.measured || { treatment: 'none', color: '#fff' };
    x.clearRect(0, 0, W, H);
    const [cx, cy, bwf, bhf] = T.box, bw = bwf * W, bh = bhf * H, bx = (cx - bwf / 2) * W, by = (1 - cy - bhf / 2) * H;
    if (T.mode === 'credits') {
      const s = Math.max(11, Math.min(bh / (T.lines.length + 3) * .8, bw / 60)); x.font = `500 ${s}px 'IBM Plex Mono'`; x.fillStyle = M.color; x.textAlign = 'center'; x.textBaseline = 'middle';
      const scroll = lt * s * .9;
      x.fillText('Namensnennung · Fallback-Assets', W / 2, by + s - scroll + bh * .1);
      T.lines.forEach((l, i) => x.fillText(l.length > 110 ? l.slice(0, 108) + '…' : l, W / 2, by + s * (i + 3) - scroll + bh * .1)); return;
    }
    if (!T.layout) {
      const words = T.str.split(' '); let best = null, lo = 10, hi = Math.min(bh, bw * .5);
      const wrap = s => { x.font = T.font(s); const lines = []; let cur = ''; for (const w of words) { if (w === '/') { if (cur) lines.push(cur); cur = ''; continue; } const t = cur ? cur + ' ' + w : w; if (x.measureText(t).width <= bw) cur = t; else { if (!cur) return null; lines.push(cur); cur = w; if (x.measureText(w).width > bw) return null; } } if (cur) lines.push(cur); return lines; };
      for (let i = 0; i < 16; i++) { const s = (lo + hi) / 2, ls = wrap(s); if (ls && ls.length * s * 1.06 <= bh && ls.length <= 4) { best = { s, lines: ls }; lo = s; } else hi = s; }
      T.layout = best || { s: lo, lines: wrap(lo) || [T.str] };
    }
    const { s, lines } = T.layout, lh = s * 1.06, top = by + (bh - lines.length * lh) / 2 + s * .82;
    const chars = T.str.replace(/ \/ /g, ' ').length;
    let shown = Infinity; if (T.mode === 'tipp') shown = Math.floor(lt / .045); else if (T.mode === 'wort') shown = Math.floor(lt / .28) + 1;
    if (M.treatment === 'schleier') { const g = x.createRadialGradient(bx + bw / 2, by + bh / 2, 0, bx + bw / 2, by + bh / 2, Math.max(bw, bh) * .62); g.addColorStop(0, M.veil + 'd0'); g.addColorStop(.75, M.veil + 'b8'); g.addColorStop(1, M.veil + '00'); x.fillStyle = g; x.fillRect(bx - bw * .1, by - bh * .1, bw * 1.2, bh * 1.2); }
    let ci = 0, wi = 0;
    lines.forEach((line, li) => {
      x.font = T.font(s); const lw = x.measureText(line).width, y = top + li * lh;
      const x0 = T.align === 'left' ? bx : T.align === 'right' ? bx + bw - lw : bx + (bw - lw) / 2;
      if (M.treatment === 'band') { x.fillStyle = M.band; x.fillRect(x0 - s * .2, y - s * .86, lw + s * .4, s * 1.1); }
      x.save();
      if (M.treatment === 'schatten') { x.shadowColor = (M.color === (PALETTES[pl.palette] || PALETTES.kfb).bg ? (PALETTES[pl.palette] || PALETTES.kfb).fg : (PALETTES[pl.palette] || PALETTES.kfb).bg); x.shadowBlur = s * .22; }
      x.fillStyle = M.color; x.textBaseline = 'alphabetic';
      if (T.mode === 'wechsel' || T.mode === 'atmen') {
        const cs = [...line], fonts = cs.map((_, i) => { const k = i + li * 7; if (T.mode === 'atmen') return `${Math.round(200 + 700 * (.5 + .5 * Math.sin(now * 2.2 + k * .55)))} ${s}px 'Archivo'`; const st = Math.floor(now * 4 + ((k * 7919) % 13) * .37); return `700 ${s}px ${SWITCH[Math.floor(((Math.sin(k * 12.9898 + st * 78.233) * 43758.5453) % 1 + 1) % 1 * SWITCH.length)]}`; });
        const ws = cs.map((ch, i) => { x.font = fonts[i]; return x.measureText(ch).width; }), tot = ws.reduce((a, b) => a + b, 0), sc = Math.min(1, lw / tot * 1.02, bw / tot);
        let px = T.align === 'left' ? bx : T.align === 'right' ? bx + bw - tot * sc : bx + (bw - tot * sc) / 2;
        cs.forEach((ch, i) => { x.save(); x.translate(px, y); x.scale(sc, 1); x.font = fonts[i]; x.fillText(ch, 0, 0); x.restore(); px += ws[i] * sc; });
      } else if (shown === Infinity) x.fillText(line, x0, y);
      else if (T.mode === 'tipp') { const vis = line.slice(0, Math.max(0, shown - ci)); x.fillText(vis, x0, y); }
      else { const wds = line.split(' '), vis = wds.slice(0, Math.max(0, shown - wi)).join(' '); x.fillText(vis, x0, y); wi += wds.length; }
      ci += line.length + 1;
      x.restore();
    });
  }
  repeatCheck() {
    const win = this.shown.slice(-50), keys = win.map(p => p.type === 'credits' ? 'credits' : `${(p.layers.find(l => l.role === 'held') || p.layers[0] || {}).asset?.id}|${(p.layers.find(l => l.role === 'held') || p.layers[0] || {}).effect}|${p.trans.kind}`);
    const dup = keys.length - new Set(keys).size;
    const last = new Map(); let minGap = Infinity;
    win.forEach((p, i) => p.layers.forEach(l => { const id = l.asset && l.asset.id; if (!id || /^proc/.test(id)) return; if (last.has(id) && last.get(id) !== i) minGap = Math.min(minGap, i - last.get(id)); last.set(id, i); }));
    const texts = win.filter(p => p.text).map(p => p.text.str);
    return { window: win.length, dupCombos: dup, minAssetGap: minGap === Infinity ? null : minGap, dupTexts: texts.length - new Set(texts).size };
  }
  describe(p) {
    if (!p) return null;
    return { n: p.n, type: p.type, dur: +p.dur.toFixed(2), palette: p.palette, move: p.move, trans: p.trans.kind, transDur: +p.trans.dur.toFixed(2), cost: p.cost, budget: p.budget,
      layers: p.layers.map(l => ({ role: l.role, title: l.asset ? (l.asset.title || l.asset.id) : '—', id: l.asset && l.asset.id, category: l.asset && l.asset.category, kind: l.asset && l.asset.kind, effect: l.effect, blend: l.blend, mask: l.mask, lens: l.lens, credit: l.asset && l.asset.credit, tier: l.asset && l.asset.tier, url: l.asset && l.asset.sourcePage })),
      text: p.text && { str: p.text.mode === 'credits' ? 'Abspann' : p.text.str, mood: p.text.mood, mode: p.text.mode, measured: p.text.measured } };
  }
  credits() { const all = [...this.used.values()]; return { required: all.filter(i => i.tier === 'fallback-attribution'), free: all.filter(i => i.tier === 'free') }; }
}

const api = { create: (canvas, opts) => new Engine(canvas, opts), Engine, PRESETS, PALETTES, CATS, rulesFor, genText, version: 'kfb.collage-engine.v0' };
root.KFBCollage = api;
if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
