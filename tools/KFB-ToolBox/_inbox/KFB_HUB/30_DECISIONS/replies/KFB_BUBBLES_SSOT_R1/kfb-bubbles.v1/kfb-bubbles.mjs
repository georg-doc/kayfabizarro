// Shared host composition of immutable ChatterBox core + original Wireface adapter.
import './chatterbox-core.js';
import { create as createWirefaceOriginal } from './bubbles.module.js';

const VERSION = 'kfb-bubbles.v1';
const INK = '#1f1a14', PAPER = '#fbf2df';
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

export { VERSION, INK, PAPER, FLOW, injectDefs, loadFonts, stageOf, fluffify, glyphFor, fitCoded, renderWords, createHost };
export const create=createHost;
export const core=()=>ensureCore();
