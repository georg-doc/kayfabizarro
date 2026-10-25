// R10.1 source port. Original snippets pinned by R101_SOURCE.json; no probe audio or private font.
(function(){'use strict';
const h32=s=>{let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
const rng=seed=>{let x=seed||1;return()=>{x^=x<<13;x>>>=0;x^=x>>17;x^=x<<5;x>>>=0;return x/4294967296}};
const words=t=>t.match(/[^\s]+/g)||[];const clean=w=>w.toLowerCase().replace(/[^a-zäöüß0-9']/g,'');
const FUNC2=new Set("a an the and or but so of to in on at for with by from is are was were be been it its this that you your we our he she they his her their him them not no as if than then i me my".split(" "));
const IRR_PAST=new Set("told said made went gave took came knew saw thought brought bought felt kept left lost met paid sent sold spent stood understood won wrote ate drew drove fell flew forgot grew hid held hung laid led meant ran rang rode rose sang sat slept spoke stole stuck swam taught threw woke wore broke chose froze found built caught fought heard sought struck spun".split(" "));
const COMPOUND={bloodbath:'fluffbath',firestorm:'fluffstorm',mastermind:'fluffmind',warlord:'flufflord',heartbreak:'fluffbreak'};
const ADJ_Y=new Set("dirty dusty easy lazy crazy angry hungry empty heavy holy ugly busy tiny shiny cozy fuzzy spooky lucky sticky tricky foggy happy funny sunny silly misty cloudy rusty greedy sleepy fluffy tasty scary".split(" "));
function fluffify(w){const p=(w.match(/[.,!?;:…]+$/)||[''])[0];const core=w.slice(0,w.length-p.length);const poss=/'s$/i.test(core);const c=core.toLowerCase().replace(/'s$/,'').replace(/[^a-z']/g,'');
  /* Smurf logic (V-500): one fixed word, inflected by part of speech; nothing invented, nothing padded */
  /* R10 (V-508 §5): north rule only for fixed lexicon entries, otherwise the whole word takes its normal lexicon form */
  const cp=COMPOUND[c]||(/s$/.test(c)&&COMPOUND[c.slice(0,-1)]?COMPOUND[c.slice(0,-1)]+'s':'');
  let f;if(cp)f=cp;else if(IRR_PAST.has(c)||/ed$/.test(c))f='fluffed';else if(/ing$/.test(c))f='fluffing';else if(/ly$/.test(c))f='fluffily';
  else if(ADJ_Y.has(c)||/([bdfglmnprtz])\1y$/.test(c)||/(ous|ful|ive|ical|less|ic)$/.test(c)||(/(ible|able)$/.test(c)&&c.length>6)||(/al$/.test(c)&&c.length>5))f='fluffy';
  else if(/(tion|sion|ness|ment|ity|ism|ance|ence)$/.test(c))f='fluffery';else if(/[^su]s$/.test(c)&&c.length>3)f='fluffs';else f='fluff';
  if(poss)f+="'s";if(/^[A-Z]/.test(core))f=f[0].toUpperCase()+f.slice(1);return f+p}
/* R8: words that carry the sentence flow of a triplet (connectors, pronouns, articles, auxiliaries, prepositions) stay plain at every stage */
const FLOW=new Set((FUNC2?[...FUNC2]:[]).concat("because so but yet until unless while when where whose whom though although since once till therefore thus still only just even never always every all can cannot can't don't won't will would should must do does did has have had who what why how which there here into through up down out over under about after before against between without within upon am us our ours yours doesn't isn't aren't wasn't weren't didn't couldn't wouldn't shouldn't haven't hasn't hadn't it's i'm you're we're they're that's he's she's there's let's i've you've i'll you'll doesnt isnt arent wasnt werent didnt couldnt wouldnt shouldnt havent hasnt hadnt its im youre were theyre thats hes shes theres lets ive youve ill youll".split(" ")));
function stageOf(w,d){const c=clean(w);if(FLOW.has(c)||/\d/.test(c))return 2;const v=h32(c||w)%100;/* R9.1: strictly ordered per word – glyph until a, fluff until b, then plain; 0 % = all glyphs, 100 % = all plain */const a=v*.6,b=40+v*.6;return d>=b?2:d>a?1:0}
/* ── R10 (V-508): word roles, unlock state ─────────────────────────────── */
/* roles: title (card title phrase) · name · func (shared FLOW list) · num · content. Only content words are ever coded. */
const NAMES=new Set("rumpelstiltskin blackrock aladdin frizzlebob knucklebob dory hunky lorekeeper".split(" "));
const NUMW=new Set("zero one two three four five six seven eight nine ten eleven twelve twenty thirty forty fifty hundred thousand million billion".split(" "));
const WH=new Set("who what why how which where when whose whom".split(" "));
const lem=w=>clean(w).replace(/'s$/,'');
const capW=w=>/^[A-Z0-9]/.test(w.replace(/^[^A-Za-z0-9]+/,''));
function analyze(text){const ws=words(text);const T=ws.map((w,i)=>({w,i,c:clean(w),l:lem(w),role:'content'}));
  /* card title = phrase at line start up to the first ':' or ',' – only if it is title-cased (every non-function word capitalised, max. 6 words);
     a single word only with ':' – so "Did you really …," or "Yes, …" are not titles */
  const e=ws.findIndex(w=>/[:,]$/.test(w));
  if(e>=0&&e<6){const span=T.slice(0,e+1);const tc=span.every((t,k)=>capW(t.w)||(k>0&&FLOW.has(t.c)));
    if(tc&&(span.length>1||/:$/.test(ws[e])))span.forEach(t=>t.role='title')}
  T.forEach((t,k)=>{if(t.role==='title')return;
    if(!t.c||FLOW.has(t.c))t.role='func';else if(/\d/.test(t.c)||NUMW.has(t.c))t.role='num';
    else if(NAMES.has(t.l)||(k>0&&!/[.!?…:]$/.test(ws[k-1])&&capW(t.w)))t.role='name'});
  return T}
function createDecoder(input={}){
 const cards=input.cards||[];
 if(new Set(cards.map(c=>c.id)).size!==cards.length)throw new Error('Duplicate card id');
 const LINES=cards.map(c=>[c.id,c.text]);
 const CARD_LEMMAS=LINES.map(([,t])=>new Set(analyze(t).filter(x=>x.role==='content').map(x=>x.l)));
 const DECKS=(input.decks||[]).map(d=>({...d,lines:[...new Set((d.cardIds||[]).map(id=>cards.findIndex(c=>c.id===id)).filter(i=>i>=0))]}));
 let ST={enc:{},own:{}};
 function setState(state={}){ST={enc:state.encounters||{},own:Object.fromEntries(cards.map((c,i)=>[i,!!state.owned?.[c.id]]))};}
 const bundled=dk=>dk.lines.filter(i=>ST.own[i]).length>=3;
function unlockStage(l){if(LINES.some((_,i)=>ST.own[i]&&CARD_LEMMAS[i].has(l))||DECKS.some(dk=>bundled(dk)&&dk.lines.some(i=>CARD_LEMMAS[i].has(l))))return 2;/* R10.1: Smurf reading first – content words start as fluff; only the key words of the line (the two longest content words) start as glyphs; 2 encounters turn a key word into fluff */return (!KEYS.has(l)||(ST.enc[l]||0)>=2)?1:0}
let KEYS=new Set();
function setKeys(toks){const c=[...new Map(toks.filter(t=>t.role==='content').map(t=>[t.l,t])).values()].sort((x,y)=>y.l.length-x.l.length||x.l.localeCompare(y.l));KEYS=new Set(c.slice(0,2).map(t=>t.l))}
function stageAt(t,o){if(o.assist||t.role!=='content')return 2;return o.ovr?stageOf(t.w,o.d):unlockStage(t.l)}
 setState(input.state);
 return {setState,setKeys,unlockStage,stageAt,keys:()=>[...KEYS]};
}
function createFitter(characters=['✦','◈','◆']){
 const PM=[...new Set(characters)];
 if(PM.length<2)throw new Error('At least two distinct glyphs required');
function fitCoded(b){const probe=document.createElement('span');probe.style.cssText='visibility:hidden;position:absolute;white-space:nowrap';b.append(probe);
  b.querySelectorAll('.w.g').forEach(sp=>{const w=sp.dataset.src;const p=(w.match(/[.,!?;:…]+$/)||[''])[0];const core=w.slice(0,w.length-p.length)||w;probe.textContent=core;const W=probe.offsetWidth;const n=sp.firstChild;
    const L=clean(core).length;const cnt=L<=6?1:2;const r=rng(h32(clean(core)||w));let o='';for(let k=0;k<cnt;k++){let g;do{g=PM[Math.floor(r()*PM.length)]}while(o&&g===o[o.length-1]);o+=g}n.textContent=o;
    /* R9.1: glyphs grow by transform only (base 1.6 × text size), so every line keeps the bubble's line height */
    const gw=(n.offsetWidth||1)*1.6;const s=W/gw;const u=Math.max(.85,Math.min(1.35,s));const sx=Math.max(.85,Math.min(1.25,s/u));
    const U=1.6*u;n.style.transform='scale('+(U*sx).toFixed(3)+','+U.toFixed(3)+')';sp.style.width=(gw*u*sx).toFixed(1)+'px';
    if(p){const k=document.createElement('span');k.style.whiteSpace='nowrap';sp.replaceWith(k);k.append(sp,p)}});probe.remove()}
 return fitCoded;
}
window.KFB_Fluffolect_R101=Object.freeze({analyze,fluffify,FLOW,IRR_PAST,ADJ_Y,COMPOUND,stageOf,clean,createDecoder,createFitter,fitCoded:createFitter()});
})();
