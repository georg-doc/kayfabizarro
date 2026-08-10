/* KFB Overworld — Narrator 2D (V2-S4b, Fallback-Ebene)
   Erzählt ohne LLM. Die LLM-Ebene kommt später DARÜBER, nie darunter (Lehre aus Travel S70/S80):
   ein leeres Fach heißt, dass diese Ebene spricht — nicht, dass niemand spricht.

   Zwei Aufgaben:
   1. captions(ctx) — drei Bildunterschriften zur Wahl nach dem Räumen einer Zone.
      Der Spieler ist der Letterer. Seine Wahl setzt den Ton, in dem der Afterglow erzählt wird.
   2. compose(save) — der Afterglow-Text aus Fakten, Captions und Diary.

   Sprache EN; Eigennamen (Kayfabe, BLÖDSINN!, Stay fluffy) bleiben stehen. */
(function(){
'use strict';

const TONES=['heroic','cynic','absurd'];

// Biome-Ids sind intern — im Satz steht der Anzeigename, nie der Schlüssel
const BIOME_NAME={camp:'the camp',wilds:'the wilds',cave:'the caves',dungeon:'the dungeon'};

// Bausteine je Ton. {n} Kills · {t} Kartentitel · {b} Biome · {a} zuletzt genutzte Ability
const CAPTION_POOL={
  heroic:[
    'A hero passed through.',
    'The guards of »{t}« learned a name today.',
    'Three steps in, and the panel belonged to him.',
    'They will speak of {b} for one more season.',
    'He left {b} tidier than he found it.',
    'The page held. Barely, but it held.',
    'Whatever stood in »{t}« does not stand there now.',
  ],
  cynic:[
    'Another pointless skirmish.',
    'Nobody asked for this either.',
    '{n} down. The page did not notice.',
    'The evidence was secured. The meaning was not.',
    'A panel emptied itself. Call it a victory.',
    '»{t}« is quiet now, which proves nothing.',
    'Work was done in {b}. That is the kindest reading.',
  ],
  absurd:[
    'The day the guards of {b} met an argument.',
    'A footnote grew teeth.',
    '»{t}« turned out to be a place, briefly.',
    'The {a} did most of the talking.',
    'Something in {b} agreed to be over.',
    'The gutter was consulted. It abstained.',
    'Nobody in »{t}« had read the rules either.',
  ],
};

// Afterglow-Gerüst je Ton: Eröffnung · Mitte · Schluss
const FRAMES={
  heroic:{
    open:'They came back through the gutter with {cards} pieces of evidence.',
    mid:'{zoneLine} The court noticed.',
    close:'What was carried out of the page is worth more than what was left on it.',
  },
  cynic:{
    open:'{cards} cards. That is the whole haul.',
    mid:'{zoneLine} Nobody sent a letter about it.',
    close:'The island forgets. The diary does not. That is the only difference.',
  },
  absurd:{
    open:'The evidence arrived first, the hero shortly after — {cards} cards, no explanation.',
    mid:'{zoneLine} A duck may have been present.',
    close:'None of it adds up, which is the correct amount.',
  },
};

function pick(list,r){return list[Math.floor(r*list.length)%list.length];}
function fill(tpl,v){return tpl.replace(/\{(\w+)\}/g,(m,k)=>v[k]!=null?v[k]:'');}

/* Drei Vorschläge, je einer pro Ton — und immer die Möglichkeit, selbst zu schreiben.
   Drei vorgekaute Optionen wären das Gegenteil von Kayfabulieren.
   `used` hält schon vergebene Unterschriften draußen, damit die Hall of Fame nicht kopiert klingt. */
function captions(ctx){
  const r=ctx.rand||Math.random;
  const used=ctx.used||[];
  const v={t:ctx.cardTitle||'the card',b:BIOME_NAME[ctx.biome]||ctx.biome||'the wilds',
    n:ctx.kills||0,a:ctx.lastAbility||'monologue'};
  return TONES.map((tone,i)=>{
    const all=CAPTION_POOL[tone].map(t=>fill(t,v));
    const fresh=all.filter(t=>used.indexOf(t)<0);
    const pool=fresh.length?fresh:all;
    return {tone,text:pick(pool,r(i+1))};
  });
}

function dominantTone(captionList){
  const c={heroic:0,cynic:0,absurd:0};
  for(const x of captionList||[])if(c[x.tone]!=null)c[x.tone]++;
  let best='cynic',n=-1;
  for(const k in c)if(c[k]>n){n=c[k];best=k;}
  return n<=0?'cynic':best;
}

/* Der Afterglow. Keine Erfindung ohne Deckung: jeder Satz steht auf einer Zahl oder einem
   Diary-Eintrag aus dem Save. Was offen blieb, bleibt offen — Closure ist nicht Pflicht. */
function compose(save,extra){
  extra=extra||{};
  const zones=Object.values(save.zones||{});
  const cleared=zones.filter(z=>z.status==='cleared');
  const caps=(save.captions&&Object.values(save.captions))||[];
  const tone=extra.tone||dominantTone(caps);
  const f=FRAMES[tone]||FRAMES.cynic;
  const rep=save.reputation||{};
  const acts=(save.diary||[]).filter(d=>d.t&&d.t!=='zone'&&d.t!=='drop'&&d.t!=='caption'&&!/^lv/.test(d.t));
  const lvs=(save.diary||[]).filter(d=>/^lv/.test(d.t));

  const zoneLine=cleared.length
    ? cleared.slice(0,3).map(z=>'»'+z.cardTitle+'«').join(', ')+
      (cleared.length>3?' and '+(cleared.length-3)+' more':'')+' are quiet now.'
    : 'Not one zone went quiet.';

  const out=[];
  out.push(fill(f.open,{cards:cleared.length}));
  out.push(fill(f.mid,{zoneLine}));
  if(caps.length)out.push('The player called one of them: “'+caps[caps.length-1].text+'”');
  if(acts.length){
    const a=acts[acts.length-1];
    out.push(a.text);
  }
  if(lvs.length)out.push('The hero grew '+lvs.length+' time'+(lvs.length>1?'s':'')+
    ' — and still cannot explain why that helps.');
  const hof=rep.kingCourt||0,worst=Object.entries(rep).filter(([k])=>k!=='kingCourt')
    .sort((a,b)=>a[1]-b[1])[0];
  if(hof||(worst&&worst[1]<0))
    out.push('The court is '+(hof>=4?'delighted':hof>0?'mildly pleased':'unmoved')+
      (worst&&worst[1]<-2?'. The '+worst[0]+' is not.':'.'));
  out.push(f.close);
  return {tone,text:out.join(' '),lines:out,zonesCleared:cleared.length};
}

window.OW_NARRATOR={captions,compose,dominantTone,TONES,
  note:'V2-S4b — Fallback-Erzähler. Die LLM-Ebene kommt darüber, nie darunter.'};
})();
