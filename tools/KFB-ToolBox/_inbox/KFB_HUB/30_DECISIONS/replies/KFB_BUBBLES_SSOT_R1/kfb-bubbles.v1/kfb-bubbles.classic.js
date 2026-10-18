// Classic script build: include chatterbox-core.js and THREE global before this file.
(function(){'use strict';
// Sprechblasen-Modul · Host-Vertrag R1.2 · V-204 / V-212 / V-215.
// Eine DOM-Schicht (#ui-bubbles) über dem Canvas, Anker = projizierter Kopf pro Frame, kein React-State.
// Form 1:1 wie replies/lab-donors/islands-npc.ts Z. 89–98: roundRectPath + Fläche mix('#fbf2df', Farbe, .2) + clayFront,
// keine Tusche, keine Randwände, ein Zipfel, ein drop-shadow. Reveal 300 ms, Stagger 520 ms, cubic-bezier(.2,.9,.3,1.12) – hier über dt (seek-fähig).
const THREE = window.THREE;
const INK = '#1f1a14', M = 34, STAGGER = 520, FLIP = 300;
const mix = (a, b, t) => { const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)); const A = p(a), B = p(b); return '#' + A.map((v, i) => Math.round(v * (1 - t) + B[i] * t).toString(16).padStart(2, '0')).join(''); };
function bez(p1x, p1y, p2x, p2y) { const cx = 3 * p1x, bx = 3 * (p2x - p1x) - cx, ax = 1 - cx - bx, cy = 3 * p1y, by = 3 * (p2y - p1y) - cy, ay = 1 - cy - by; const X = t => ((ax * t + bx) * t + cx) * t, Y = t => ((ay * t + by) * t + cy) * t, dX = t => (3 * ax * t + 2 * bx) * t + cx; return v => { let t = v; for (let i = 0; i < 10; i++) { const d = dX(t); if (Math.abs(d) < 1e-6) break; t -= (X(t) - v) / d; } return Y(Math.max(0, Math.min(1, t))); }; }
const EASE = bez(.2, .9, .3, 1.12), esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

function createWirefaceOriginal(o) {
  const host = o.host, C = window.KFB_CB; if (!C) throw new Error('chatterbox-core fehlt (window.KFB_CB)');
  const layer = document.createElement('div'); layer.id = 'ui-bubbles'; layer.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:5'; host.appendChild(layer);
  const bubbles = [], v = new THREE.Vector3();
  function layout(parts, basePx) {
    const Ls = parts.map(t => C.layout(t, 'speech', { basePx, maxPx: o.maxPx ?? 420 })), L0 = Ls[0], fs = L0.fontPx, lh = L0.lh, gap = Math.round(fs * 0.5), lines = [];
    Ls.forEach((l, pi) => l.lines.forEach((toks, li) => lines.push({ part: pi, mt: pi > 0 && li === 0 ? gap : 0, text: toks.map(t => t.text).join('') })));
    const w = Math.round(Math.max(...Ls.map(l => l.w - 2 * l.padX)) + 2 * L0.padX), h = Math.round(lines.length * fs * lh + gap * (Ls.length - 1) + 2 * L0.padY);
    return { w, h, fs, lh, padX: L0.padX, padY: L0.padY, lines };
  }
  function svgFor(b, hlx, hly) {
    const d = C.roundRectPath(M, b.L.w, b.L.h, Math.min(14, Math.round(b.L.h * 0.3)), b.seed, hlx, hly, 16, 12), face = mix('#fbf2df', b.col, 0.2);
    return [{ d, fill: face }, ...C.clayFront(d)].map(l => `<path d="${l.d}" fill="${l.fill ?? 'none'}"${l.stroke ? ` stroke="${l.stroke}" stroke-width="${l.sw}" stroke-linejoin="round" stroke-linecap="round"` : ''}${l.tf ? ` transform="${l.tf}"` : ''}${l.op != null ? ` opacity="${l.op}"` : ''}${l.filter ? ` filter="${l.filter}"` : ''}${l.mask ? ` mask="${l.mask}"` : ''}/>`).join('');
  }
  function say(actor, parts, col) {
    clear(actor.id);
    const basePx = host.clientWidth >= 900 ? 16 : host.clientWidth >= 520 ? 15 : 14, L = layout(parts, basePx), el = document.createElement('div');
    el.dataset.speaker = actor.id; el.dataset.text = parts.join(' / ');
    el.style.cssText = `position:absolute;left:0;top:0;width:${L.w + 2 * M}px;height:${L.h + 2 * M}px;filter:drop-shadow(0 3px 5px rgba(42,26,12,.28));will-change:transform`;
    el.innerHTML = `<svg width="${L.w + 2 * M}" height="${L.h + 2 * M}" style="position:absolute;left:0;top:0;overflow:visible"></svg><div style="position:absolute;left:${M}px;top:${M}px;width:${L.w}px;height:${L.h}px;padding:${L.padY}px ${L.padX}px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:center;align-items:center;font-family:'Shantell Sans','Comic Sans MS',cursive;font-size:${L.fs}px;line-height:${L.lh};color:${INK}">${L.lines.map(l => `<div data-part="${l.part}" style="white-space:pre;text-align:center;margin-top:${l.mt}px;transform-origin:50% 0;opacity:0">${esc(l.text)}</div>`).join('')}</div>`;
    layer.appendChild(el);
    const b = { el, actor, L, col, seed: C.hash(parts.join(' / ') + 'speech') % 9999, t: 0, hl: null, svg: el.querySelector('svg'), rows: [...el.querySelectorAll('[data-part]')] };
    bubbles.push(b); return b;
  }
  function clear(id) { for (let i = bubbles.length - 1; i >= 0; i--) if (!id || bubbles[i].actor.id === id) { bubbles[i].el.remove(); bubbles.splice(i, 1); } }
  function place(b, cam, W, H, pads, avoid) {
    v.copy(b.actor.headWorld()).project(cam); const hx = (v.x + 1) / 2 * W, hy = (1 - v.y) / 2 * H, w = b.L.w, h = b.L.h;
    const cx = x => Math.max(pads.l, Math.min(W - pads.r - w, x)), cy = y => Math.max(pads.t, Math.min(H - pads.b - h, y));
    let bx, by; const up = hy - 16 - h;
    if (up >= pads.t) { bx = cx(hx - w / 2); by = up; }
    else { const side = 22, ys = cy(hy - h * 0.2); if (hx + side + w <= W - pads.r) { bx = hx + side; by = ys; } else if (hx - side - w >= pads.l) { bx = hx - side - w; by = ys; } else { bx = cx(hx - w / 2); by = pads.t; } }
    for (const f of avoid) if (bx < f.x + f.w && bx + w > f.x && by < f.y + f.h && by + h > f.y) { const ny = f.y - 12 - h; if (ny >= pads.t) by = ny; else { const sx = hx < W / 2 ? f.x + f.w + 12 : f.x - 12 - w; if (sx >= pads.l && sx + w <= W - pads.r) bx = sx; } }
    const hlx = Math.max(4, Math.min(W - 4, hx)) - (bx - M), hly = Math.max(4, Math.min(H - 4, hy)) - (by - M);
    if (!b.hl || Math.abs(b.hl[0] - hlx) > 2 || Math.abs(b.hl[1] - hly) > 2) { b.hl = [hlx, hly]; b.svg.innerHTML = svgFor(b, hlx, hly); }
    b.el.style.transform = `translate(${Math.round(bx - M)}px,${Math.round(by - M)}px)`; b.rect = { x: bx, y: by, w, h };
  }
  return {
    object3d: new THREE.Group(), layer, say, clear,
    get list() { return bubbles; },
    update(dt, ctx) {
      const W = host.clientWidth, H = host.clientHeight, pads = ctx.pads || { l: 12, r: 12, t: 12, b: 12 };
      for (const b of bubbles) {
        b.t += dt * 1000; place(b, ctx.camera, W, H, pads, ctx.avoid || []);
        for (const r of b.rows) { const p = Math.max(0, Math.min(1, (b.t - Number(r.dataset.part) * STAGGER) / FLIP)), e = p <= 0 ? 0 : EASE(p); r.style.opacity = Math.max(0, Math.min(1, e)).toFixed(3); r.style.transform = `perspective(520px) rotateX(${(-86 * (1 - e)).toFixed(1)}deg)`; }
      }
    },
    dispose() { clear(); layer.remove(); }
  };
}



const VERSION = 'kfb-bubbles.v1';
const BUBBLE_INK = '#1f1a14', PAPER = '#fbf2df';
const FONT_LINK = 'https://fonts.googleapis.com/css2?family=Shantell+Sans:wght@400;700&family=Bangers&family=Irish+Grover&display=swap';
const SVG_DEFS = "<defs>\n      <filter id=\"kfbClayEdge\" filterUnits=\"userSpaceOnUse\" x=\"-200\" y=\"-200\" width=\"3000\" height=\"3000\">\n        <feTurbulence type=\"fractalNoise\" baseFrequency=\"0.8\" numOctaves=\"1\" seed=\"4\" result=\"n\"></feTurbulence>\n        <feDisplacementMap in=\"SourceGraphic\" in2=\"n\" scale=\"2.8\" xChannelSelector=\"R\" yChannelSelector=\"G\"></feDisplacementMap>\n      </filter>\n      <filter id=\"kfbClayBevel\" x=\"-8%\" y=\"-8%\" width=\"116%\" height=\"116%\" color-interpolation-filters=\"sRGB\">\n        <feGaussianBlur in=\"SourceAlpha\" stdDeviation=\"3.4\" result=\"b\"></feGaussianBlur>\n        <feDiffuseLighting in=\"b\" surfaceScale=\"4\" diffuseConstant=\"1.18\" lighting-color=\"#ffffff\" result=\"df\"><feDistantLight azimuth=\"225\" elevation=\"52\"></feDistantLight></feDiffuseLighting>\n        <feComposite in=\"df\" in2=\"SourceAlpha\" operator=\"in\" result=\"dfc\"></feComposite>\n        <feBlend in=\"SourceGraphic\" in2=\"dfc\" mode=\"multiply\" result=\"lit\"></feBlend>\n        <feSpecularLighting in=\"b\" surfaceScale=\"4\" specularConstant=\".5\" specularExponent=\"22\" lighting-color=\"#fff6e6\" result=\"sp\"><feDistantLight azimuth=\"225\" elevation=\"40\"></feDistantLight></feSpecularLighting>\n        <feComposite in=\"sp\" in2=\"SourceAlpha\" operator=\"in\" result=\"spc\"></feComposite>\n        <feComposite in=\"spc\" in2=\"lit\" operator=\"arithmetic\" k1=\"0\" k2=\"1\" k3=\"1\" k4=\"0\"></feComposite>\n      </filter>\n      <linearGradient id=\"kfbFaceShade\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#ffffff\" stop-opacity=\".34\"></stop><stop offset=\".48\" stop-color=\"#ffffff\" stop-opacity=\"0\"></stop><stop offset=\"1\" stop-color=\"#2a1a0c\" stop-opacity=\".14\"></stop></linearGradient>\n      <linearGradient id=\"kfbWallShade\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#000000\" stop-opacity=\"0\"></stop><stop offset=\"1\" stop-color=\"#1a0f05\" stop-opacity=\".32\"></stop></linearGradient>\n      <filter id=\"kfbSoftShadow\" x=\"-20%\" y=\"-20%\" width=\"140%\" height=\"140%\"><feGaussianBlur stdDeviation=\"3\"></feGaussianBlur></filter>\n      <pattern id=\"kfbDotsWarm\" width=\"7\" height=\"7\" patternUnits=\"userSpaceOnUse\"><circle cx=\"3.5\" cy=\"3.5\" r=\"1.3\" fill=\"#b38a55\"></circle></pattern>\n      <pattern id=\"kfbDotsDeep\" width=\"8\" height=\"8\" patternUnits=\"userSpaceOnUse\"><circle cx=\"4\" cy=\"4\" r=\"1.8\" fill=\"#8f2416\"></circle></pattern>\n      <pattern id=\"kfbDotsPink\" width=\"8\" height=\"8\" patternUnits=\"userSpaceOnUse\"><circle cx=\"4\" cy=\"4\" r=\"1.7\" fill=\"#e86bb7\"></circle></pattern>\n      <pattern id=\"kfbDotsViolet\" width=\"8\" height=\"8\" patternUnits=\"userSpaceOnUse\"><circle cx=\"4\" cy=\"4\" r=\"1.8\" fill=\"#43247f\"></circle></pattern>\n      <radialGradient id=\"kfbFade\" cx=\"0.8\" cy=\"0.86\" r=\"0.8\"><stop offset=\"0\" stop-color=\"#ffffff\"></stop><stop offset=\"1\" stop-color=\"#000000\"></stop></radialGradient>\n      <mask id=\"kfbCornerMask\" maskContentUnits=\"objectBoundingBox\"><rect width=\"1\" height=\"1\" fill=\"url(#kfbFade)\"></rect></mask>\n    </defs>";
const GLYPH_CHARS = Object.freeze(['✦','◈','◆']); // unlicensed PottyMouth BB deliberately NOT used
const FLOW = new Set('a an the and or but so because until for from with without in on at to of by as if when while then than this that these those you your yours we our us they their them he his him she her i me my it its is are was were be been being am do does did can could would should will may might must not no who what which why how where here there into out over under up down just ever never only all any each every once now'.split(' '));
function ensureCore(){const C=globalThis.window?.KFB_CB;if(!C||C.version!=='cbs-core-0.1')throw Error('Load bundled chatterbox-core.js first (cbs-core-0.1)');return C;}
function loadFonts(){
  if(typeof document==='undefined')return Promise.resolve(false);
  let tag=document.querySelector('link[data-kfb-bubbles-fonts]');
  if(!tag){tag=document.createElement('link');tag.rel='stylesheet';tag.href=FONT_LINK;tag.dataset.kfbBubblesFonts='1';document.head.appendChild(tag);}
  return document.fonts?.ready?.then(()=>true,()=>false) || Promise.resolve(true);
}
function injectDefs(root){
  if(typeof document==='undefined')throw Error('DOM required');
  if(document.getElementById('kfb-bubbles-v1-defs'))return document.getElementById('kfb-bubbles-v1-defs');
  const el=document.createElementNS('http://www.w3.org/2000/svg','svg');
  el.id='kfb-bubbles-v1-defs';el.setAttribute('width','0');el.setAttribute('height','0');el.setAttribute('aria-hidden','true');
  el.style.cssText='position:absolute;overflow:hidden;pointer-events:none';
  el.innerHTML=SVG_DEFS;(root||document.body).prepend(el);return el;
}
function stageOf(i,n,progress){
  const d=Math.max(0,Math.min(1,Number(progress)||0))*3-(n>0?i/n:0);
  return d<1?'glyph':d<2?'fluff':'plain';
}
function fluffify(word){
  // Fixed R9 Smurf POS lexicon. No padding and no novel invented compounds.
  const w=String(word).toLowerCase();
  if(/ly$/.test(w))return 'fluffily';
  if(/ing$/.test(w))return 'fluffing';
  if(/ed$/.test(w))return 'fluffed';
  if(/(ness|tion|ment|ity|ery)$/.test(w))return 'fluffery';
  if(/(ful|ous|ive|able|ible|al|ic|y)$/.test(w))return 'fluffy';
  if(/s$/.test(w)&&!/(ss|us)$/.test(w))return 'fluffs';
  return 'fluff';
}
function glyphFor(word,chars=GLYPH_CHARS){
  const n=word.length<=4?1:word.length<=8?2:3;
  let out='';for(let i=0;i<n;i++)out+=chars[(word.charCodeAt(i%word.length)+i)%chars.length];return out;
}
function fitCoded(word,reference,font,opts={}){
  const ctx=document.createElement('canvas').getContext('2d');
  ctx.font=font;const width=Math.max(1,ctx.measureText(word).width);
  const symbols=glyphFor(word,opts.glyphCharacters||GLYPH_CHARS);
  const fontPx=parseFloat(getComputedStyle(reference).fontSize)||16;
  const glyphFont=opts.glyphFont||'"Shantell Sans", cursive';
  ctx.font=(1.6*fontPx)+'px '+glyphFont;
  const codedWidth=Math.max(1,ctx.measureText(symbols).width);
  const outer=document.createElement('span');outer.className='kfb-coded-word';outer.setAttribute('aria-hidden','true');
  outer.style.cssText='display:inline-block;position:relative;vertical-align:baseline;white-space:nowrap;height:1em;width:'+width.toFixed(2)+'px';
  const inner=document.createElement('span');inner.textContent=symbols;
  inner.style.cssText='display:inline-block;position:absolute;left:0;top:-.27em;white-space:nowrap;font-family:'+glyphFont+';font-size:1.6em;line-height:1;color:'+INK+';transform-origin:0 50%;transform:scaleX('+(width/codedWidth).toFixed(6)+')';
  outer.appendChild(inner);return outer;
}
function renderWords(node,plain,opts={}){
  if(typeof document==='undefined')throw Error('DOM required');
  const words=(plain.match(/[A-Za-z][A-Za-z'-]*/g)||[]), total=words.length;
  const style=getComputedStyle(node);
  const font=style.font || (style.fontWeight+' '+style.fontSize+' '+style.fontFamily);
  const bits=plain.match(/([A-Za-z][A-Za-z'-]*)|([^A-Za-z]+)/g)||[plain];
  const frag=document.createDocumentFragment();let i=0;
  for(const bit of bits){
    if(!/^[A-Za-z]/.test(bit)){frag.appendChild(document.createTextNode(bit));continue;}
    const flow=FLOW.has(bit.toLowerCase());
    const stage=opts.stage==='auto'||!opts.stage?stageOf(i,total,opts.progress||0):opts.stage;
    if(flow||stage==='plain')frag.appendChild(document.createTextNode(bit));
    else if(stage==='fluff')frag.appendChild(document.createTextNode(fluffify(bit)));
    else frag.appendChild(fitCoded(bit,node,font,opts));
    i++;
  }
  node.replaceChildren(frag);node.setAttribute('aria-label',plain);return node;
}
function renderBubbleRows(b,opts){
  if(!b._kfbOriginalRows)b._kfbOriginalRows=b.rows.map(row=>row.textContent);
  b.rows.forEach((row,i)=>renderWords(row,b._kfbOriginalRows[i],opts));
}
function decorateHost(host,options={}){
  const originalSay=host.say.bind(host);
  let decode={stage:options.stage||'plain',progress:options.progress||0,glyphFont:options.glyphFont,glyphCharacters:options.glyphCharacters};
  host.say=function(actor,parts,color){const b=originalSay(actor,parts,color);renderBubbleRows(b,decode);return b;};
  host.setDecode=function(stage,progress=0){if(!['glyph','fluff','plain','auto'].includes(stage))throw Error('Invalid decode stage');decode={...decode,stage,progress};host.list.forEach(b=>renderBubbleRows(b,decode));};
  host.getDecode=()=>({...decode});
  return host;
}
function createHost(options){ensureCore();injectDefs();loadFonts();return decorateHost(createWirefaceOriginal(options),options||{});}

window.KFB_BUBBLES=Object.freeze({version:VERSION,INK,PAPER,FLOW,core:ensureCore,injectDefs,loadFonts,stageOf,fluffify,glyphFor,fitCoded,renderWords,create:createHost});
})();
