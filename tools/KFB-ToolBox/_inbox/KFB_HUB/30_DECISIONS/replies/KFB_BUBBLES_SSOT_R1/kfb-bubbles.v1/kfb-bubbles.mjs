import './chatterbox-core.js';
import './fluffolect-r101.js';
import {create as createWirefaceOriginal} from './bubbles.module.js';
const ASSET_BASE=new URL('.',import.meta.url).href;
const FONT_CSS="@font-face{font-family:\"Shantell Sans\";font-style:normal;font-weight:300 800;font-display:swap;src:url(\"fonts/ShantellSans[BNCE,INFM,SPAC,wght].ttf\") format(\"truetype\")}\n@font-face{font-family:\"Bangers\";font-style:normal;font-weight:400;font-display:swap;src:url(\"fonts/Bangers-Regular.ttf\") format(\"truetype\")}\n";
const SVG_DEFS = "<defs>\n      <filter id=\"kfbClayEdge\" filterUnits=\"userSpaceOnUse\" x=\"-200\" y=\"-200\" width=\"3000\" height=\"3000\">\n        <feTurbulence type=\"fractalNoise\" baseFrequency=\"0.8\" numOctaves=\"1\" seed=\"4\" result=\"n\"></feTurbulence>\n        <feDisplacementMap in=\"SourceGraphic\" in2=\"n\" scale=\"2.8\" xChannelSelector=\"R\" yChannelSelector=\"G\"></feDisplacementMap>\n      </filter>\n      <filter id=\"kfbClayBevel\" x=\"-8%\" y=\"-8%\" width=\"116%\" height=\"116%\" color-interpolation-filters=\"sRGB\">\n        <feGaussianBlur in=\"SourceAlpha\" stdDeviation=\"3.4\" result=\"b\"></feGaussianBlur>\n        <feDiffuseLighting in=\"b\" surfaceScale=\"4\" diffuseConstant=\"1.18\" lighting-color=\"#ffffff\" result=\"df\"><feDistantLight azimuth=\"225\" elevation=\"52\"></feDistantLight></feDiffuseLighting>\n        <feComposite in=\"df\" in2=\"SourceAlpha\" operator=\"in\" result=\"dfc\"></feComposite>\n        <feBlend in=\"SourceGraphic\" in2=\"dfc\" mode=\"multiply\" result=\"lit\"></feBlend>\n        <feSpecularLighting in=\"b\" surfaceScale=\"4\" specularConstant=\".5\" specularExponent=\"22\" lighting-color=\"#fff6e6\" result=\"sp\"><feDistantLight azimuth=\"225\" elevation=\"40\"></feDistantLight></feSpecularLighting>\n        <feComposite in=\"sp\" in2=\"SourceAlpha\" operator=\"in\" result=\"spc\"></feComposite>\n        <feComposite in=\"spc\" in2=\"lit\" operator=\"arithmetic\" k1=\"0\" k2=\"1\" k3=\"1\" k4=\"0\"></feComposite>\n      </filter>\n      <linearGradient id=\"kfbFaceShade\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#ffffff\" stop-opacity=\".34\"></stop><stop offset=\".48\" stop-color=\"#ffffff\" stop-opacity=\"0\"></stop><stop offset=\"1\" stop-color=\"#2a1a0c\" stop-opacity=\".14\"></stop></linearGradient>\n      <linearGradient id=\"kfbWallShade\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#000000\" stop-opacity=\"0\"></stop><stop offset=\"1\" stop-color=\"#1a0f05\" stop-opacity=\".32\"></stop></linearGradient>\n      <filter id=\"kfbSoftShadow\" x=\"-20%\" y=\"-20%\" width=\"140%\" height=\"140%\"><feGaussianBlur stdDeviation=\"3\"></feGaussianBlur></filter>\n      <pattern id=\"kfbDotsWarm\" width=\"7\" height=\"7\" patternUnits=\"userSpaceOnUse\"><circle cx=\"3.5\" cy=\"3.5\" r=\"1.3\" fill=\"#b38a55\"></circle></pattern>\n      <pattern id=\"kfbDotsDeep\" width=\"8\" height=\"8\" patternUnits=\"userSpaceOnUse\"><circle cx=\"4\" cy=\"4\" r=\"1.8\" fill=\"#8f2416\"></circle></pattern>\n      <pattern id=\"kfbDotsPink\" width=\"8\" height=\"8\" patternUnits=\"userSpaceOnUse\"><circle cx=\"4\" cy=\"4\" r=\"1.7\" fill=\"#e86bb7\"></circle></pattern>\n      <pattern id=\"kfbDotsViolet\" width=\"8\" height=\"8\" patternUnits=\"userSpaceOnUse\"><circle cx=\"4\" cy=\"4\" r=\"1.8\" fill=\"#43247f\"></circle></pattern>\n      <radialGradient id=\"kfbFade\" cx=\"0.8\" cy=\"0.86\" r=\"0.8\"><stop offset=\"0\" stop-color=\"#ffffff\"></stop><stop offset=\"1\" stop-color=\"#000000\"></stop></radialGradient>\n      <mask id=\"kfbCornerMask\" maskContentUnits=\"objectBoundingBox\"><rect width=\"1\" height=\"1\" fill=\"url(#kfbFade)\"></rect></mask>\n    </defs>";
const VERSION='kfb-bubbles.v1-r10.1';
const INK='#1f1a14', PAPER='#fffdf8';
const BODY_FONT='"Shantell Sans", "Comic Neue", system-ui, sans-serif';
const R=window.KFB_Fluffolect_R101;
const {FLOW,IRR_PAST,ADJ_Y,COMPOUND,analyze,fluffify,stageOf,createDecoder}=R;
function ensureCore(){
 const C=window.KFB_CB;
 if(!C||C.version!=='cbs-core-0.1')throw new Error('Load bundled chatterbox-core.js first');
 const fonts={body:BODY_FONT,shout:'Bangers, "Irish Grover", '+BODY_FONT,label:BODY_FONT,word:'Bangers, "Irish Grover", '+BODY_FONT};
 if(C.FONTS.body!==BODY_FONT){Object.assign(C.FONTS,fonts);C.clearCache();}
 return C;
}
function injectDefs(root){
 let el=document.getElementById('kfb-bubbles-v1-defs');if(el)return el;
 el=document.createElementNS('http://www.w3.org/2000/svg','svg');el.id='kfb-bubbles-v1-defs';el.setAttribute('width','0');el.setAttribute('height','0');el.setAttribute('aria-hidden','true');
 el.style.cssText='position:absolute;overflow:hidden;pointer-events:none';el.innerHTML=SVG_DEFS;(root||document.body).prepend(el);return el;
}
function installTextStyle(){
 if(document.getElementById('kfb-bubbles-text-style'))return;
 const s=document.createElement('style');s.id='kfb-bubbles-text-style';
 s.textContent='.kfb-fluff-row .w{display:inline-block;white-space:nowrap;color:'+INK+'}.kfb-fluff-row .w>i{font-style:normal;display:inline-block;white-space:nowrap;transform-origin:0 62%}.kfb-fluff-row .w.g{position:relative;vertical-align:baseline;height:1em;letter-spacing:0}';document.head.append(s);
}
let fontsPromise;
function loadFonts({baseUrl=ASSET_BASE,timeoutMs=1600}={}){
 ensureCore();installTextStyle();
 if(!document.querySelector('[data-kfb-bubbles-fonts]')){
  const s=document.createElement('style');s.dataset.kfbBubblesFonts='1';
  s.textContent=FONT_CSS.replace(/url\("([^"]+)"\)/g,(_,p)=>'url("'+new URL(p,baseUrl).href+'")');document.head.append(s);
 }
 if(!document.fonts)return Promise.resolve(false);
 if(!fontsPromise){
  let timer;
  const loading=Promise.all([document.fonts.load('400 16px "Shantell Sans"'),document.fonts.load('400 24px Bangers')]).then(()=>true,()=>false);
  fontsPromise=Promise.race([loading,new Promise(resolve=>{timer=setTimeout(()=>resolve(false),timeoutMs);})]).then(ok=>{clearTimeout(timer);ensureCore().clearCache();return ok;});
 }
 return fontsPromise;
}
const channels=h=>/^#[a-f\d]{6}$/i.test(h)?[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)):null;
const hex=c=>'#'+c.map(v=>Math.round(Math.max(0,Math.min(255,v))).toString(16).padStart(2,'0')).join('');
const blend=(a,b,t)=>a.map((v,i)=>v*(1-t)+b[i]*t);
function luminance(h){const c=channels(h);if(!c)throw new Error('Expected #rrggbb');return c.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);}
function contrast(a,b=INK){const x=luminance(a),y=luminance(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
function paperColor({storyMode=false,tint='#d9e5ef',light=1,timeOfDay=.5,minContrast=7}={}){
 const clamp=x=>Math.max(0,Math.min(1,Number.isFinite(x)?x:1));
 const daylight=(1-Math.cos(2*Math.PI*clamp(timeOfDay)))/2;
 const shade=(1-clamp(light))*.035+(1-daylight)*.025;
 let c=blend(channels(PAPER),[224,218,208],shade);
 if(storyMode)c=blend(c,channels(tint)||channels(PAPER),.14);
 let out=hex(c);const floor=Math.max(7,Math.min(21,Number(minContrast)||7));
 for(let i=0;i<24&&contrast(out)<floor;i++){c=blend(c,[255,255,255],.2);out=hex(c);}
 if(contrast(out)<7)out=PAPER;
 return out;
}
function glyphFor(word,characters=['✦','◈','◆']){
 const holder=document.createElement('div');holder.style.font='16px '+BODY_FONT;const sp=document.createElement('span');sp.className='w g';sp.dataset.src=word;sp.append(document.createElement('i'));holder.append(sp);document.body.append(holder);R.createFitter(characters)(holder);const text=sp.querySelector('i').textContent;holder.remove();return text;
}
function fitCoded(node,options={}){
 // Source fitCoded is copied verbatim; this seam reserves the exact hidden-word advance afterwards.
 R.createFitter(options.glyphCharacters||['✦','◈','◆'])(node);
 const probe=document.createElement('span');probe.style.cssText='visibility:hidden;position:absolute;white-space:pre';node.append(probe);
 for(const sp of node.querySelectorAll('.w.g')){
  const source=sp.dataset.src.replace(/[.,!?;:…]+$/,'');probe.textContent=source;
  const width=probe.getBoundingClientRect().width,n=sp.querySelector('i');
  sp.style.width=width+'px';sp.dataset.reservedWidth=String(width);
  const m=new DOMMatrixReadOnly(getComputedStyle(n).transform);n.style.position='absolute';n.style.left=((width-n.offsetWidth*m.a)/2)+'px';n.style.top='0';
 }
 probe.remove();return node;
}
function renderWords(node,plain,opts={}){
 ensureCore();installTextStyle();node.classList.add('kfb-fluff-row');
 const tokens=opts.tokens||analyze(plain),decoder=opts.decoder||createDecoder({cards:opts.cards,decks:opts.decks,state:opts.state});decoder.setKeys(opts.keyTokens||tokens);
 const pieces=String(plain).match(/\S+|\s+/g)||[],fragment=document.createDocumentFragment();let i=0;
 for(const text of pieces){
  if(/^\s+$/.test(text)){fragment.append(document.createTextNode(text));continue;}
  const token=tokens[i++]||{w:text,l:R.clean(text),role:'content'};
  let stage=decoder.stageAt(token,{assist:opts.assist,ovr:opts.stage==='auto',d:(opts.progress||0)*100});
  if(token.role==='content'&&!opts.assist&&['glyph','fluff','plain'].includes(opts.stage))stage={glyph:0,fluff:1,plain:2}[opts.stage];
  const sp=document.createElement('span');sp.className='w'+(stage===0?' g':stage===1?' f':'');sp.dataset.src=text;sp.dataset.role=token.role;sp.dataset.lemma=token.l;sp.dataset.stage=String(stage);
  if(stage===2)sp.textContent=text;else{const n=document.createElement('i');n.textContent=stage===1?fluffify(text):'';sp.append(n);}fragment.append(sp);
 }
 node.replaceChildren(fragment);fitCoded(node,opts);node.setAttribute('aria-label',plain);return node;
}
function renderBubbleRows(b,opts){
 if(!b._kfbOriginalRows)b._kfbOriginalRows=b.rows.map(row=>row.textContent);
 const byPart=new Map();b.rows.forEach((row,i)=>{const p=row.dataset.part;if(!byPart.has(p))byPart.set(p,[]);byPart.get(p).push(i);});
 for(const indices of byPart.values()){
  const all=analyze(indices.map(i=>b._kfbOriginalRows[i]).join(' '));let offset=0;
  for(const i of indices){const text=b._kfbOriginalRows[i],count=(text.match(/\S+/g)||[]).length;renderWords(b.rows[i],text,{...opts,tokens:all.slice(offset,offset+count),keyTokens:all});offset+=count;}
 }
}
function decorateHost(host,options={}){
 const say=host.say.bind(host),update=host.update.bind(host);
 const decoder=options.decoder||createDecoder({cards:options.cards,decks:options.decks,state:options.state});
 let decode={stage:options.stage||'state',progress:options.progress||0,assist:!!options.assist,decoder,glyphCharacters:options.glyphCharacters};
 let paper=options.paper||{};
 function paint(b){const opts=typeof paper==='function'?paper(b):paper;const fill=paperColor({...opts,tint:opts?.tint||b.col||'#d9e5ef'});b.svg.firstElementChild?.setAttribute('fill',fill);b.el.dataset.paper=fill;}
 host.say=function(actor,parts,color){
  // Layout stays in cbs-core. Budget each content word for the larger of plaintext and Fluff,
  // then map the core's token cuts back to the real words. No squeezed Fluff, no state-dependent reflow.
  const C=ensureCore(),plain=parts.map(p=>C.parse(p).plain),fs=options.host.clientWidth>=900?16:options.host.clientWidth>=520?15:14;
  const budget=plain.map(text=>analyze(text).map(t=>{const f=t.role==='content'?fluffify(t.w):t.w;return C.measure(f,fs,'body',false)>C.measure(t.w,fs,'body',false)?f:t.w;}).join(' '));
  const b=say(actor,budget,color),offsets={};
  b.rows.forEach((row,i)=>{const part=Number(row.dataset.part),tokens=plain[part].match(/\S+/g)||[],offset=offsets[part]||0,n=(row.textContent.match(/\S+/g)||[]).length;row.textContent=tokens.slice(offset,offset+n).join(' ');b.L.lines[i].text=row.textContent;offsets[part]=offset+n;});
  b.seed=C.hash(parts.join(' / ')+'speech')%9999;b.el.dataset.text=parts.join(' / ');
  b.rows[0]?.parentElement.style.setProperty('font-family',BODY_FONT);renderBubbleRows(b,decode);return b;
 };
 host.update=function(dt,ctx){update(dt,ctx);host.list.forEach(paint);};
 host.setDecode=function(stage='state',progress=0){if(!['state','glyph','fluff','plain','auto'].includes(stage))throw new Error('Invalid decode stage');decode={...decode,stage,progress};host.list.forEach(b=>renderBubbleRows(b,decode));};
 host.setLanguageState=function(state){decoder.setState(state);host.list.forEach(b=>renderBubbleRows(b,decode));};
 host.setAssist=function(assist){decode={...decode,assist:!!assist};host.list.forEach(b=>renderBubbleRows(b,decode));};
 host.setPaper=function(next){paper=next||{};host.list.forEach(paint);};
 host.getDecode=()=>({...decode});return host;
}
function createHost(options={}){ensureCore();injectDefs();loadFonts(options.fonts);return decorateHost(createWirefaceOriginal(options),options);}
export {VERSION,INK,PAPER,BODY_FONT,FLOW,IRR_PAST,ADJ_Y,COMPOUND,analyze,fluffify,stageOf,createDecoder,injectDefs,loadFonts,glyphFor,fitCoded,renderWords,paperColor,contrast,createHost};
export const create=createHost;
export const core=ensureCore;
