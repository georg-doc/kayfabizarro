(async()=>{'use strict';
 const B=window.KFB_BUBBLES,C=B.core();B.injectDefs();await B.loadFonts();
 const examples={speech:'Your world never needed permission.',thought:'Who owns the other side of this thought?',whisper:'Never mistake silence for agreement.',shout:'STOP THE SHOW!',caption:'The panel looks ordinary. It is not.',kayfabulate:'This scene is an argument with a stage.',ambient:'Whose ship is this?',choice:'Will you let them explain?'};
 const paths=[];
 Object.entries(examples).forEach(([kind,text],i)=>{
  const L=C.layout(text,kind,{basePx:16,maxPx:220}),M=28,w=L.w,h=L.h,noTail=kind==='caption'||kind==='kayfabulate';
  const d=kind==='thought'?C.thoughtPath(M,w,h,9+i):kind==='shout'?C.shoutPath(M,w,h,10+i,M+w/2,M+h+20,16,12):C.roundRectPath(M,w,h,Math.min(14,h*.3),10+i,noTail?null:M+w/2,noTail?null:M+h+22,16,12,noTail);
  const box=document.createElement('article');box.className='item';box.dataset.kind=kind;const title=document.createElement('strong');title.textContent=kind;box.append(title);
  const scene=document.createElement('div');scene.className='scene';scene.style.cssText='width:'+Math.ceil(w+2*M)+'px;max-width:100%;height:'+Math.ceil(h+2*M+20)+'px';
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('width',w+2*M);svg.setAttribute('height',h+2*M+20);svg.setAttribute('viewBox','0 0 '+(w+2*M)+' '+(h+2*M+20));svg.innerHTML='<path d="'+d+'" fill="'+B.PAPER+'"/><path d="'+d+'" fill="url(#kfbFaceShade)"/>';scene.append(svg);paths.push(svg.firstElementChild);
  const letters=document.createElement('div');letters.className='letter';letters.style.cssText='left:'+(M+L.padX)+'px;top:'+(M+L.padY)+'px;width:'+(w-2*L.padX)+'px;font:'+L.fontPx+'px/'+L.lh+' '+C.FONTS[L.face];
  for(const row of L.lines){const el=document.createElement('div');for(const t of row){const span=document.createElement('span');span.textContent=t.text;if(t.bold)span.style.fontWeight='700';el.append(span);}letters.append(el);}scene.append(letters);box.append(scene);document.querySelector('#kinds').append(box);
 });
 for(const [i,[word,cls]] of [['BAM!','impact'],['SWOOSH','movement'],['WHAT?!','reaction'],['BONUS!','reward']].entries()){
  const W=C.comicWord(word,cls,30,17+i,'clay','demo'+i),div=document.createElement('div');div.className='word';div.dataset.wordClass=cls;
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('width',W.bw);svg.setAttribute('height',W.bh);svg.setAttribute('viewBox','0 0 '+W.bw+' '+W.bh);
  svg.innerHTML=W.layers.map(l=>'<path d="'+(l.d||'')+'" fill="'+(l.fill||'none')+'"'+(l.stroke?' stroke="'+l.stroke+'" stroke-width="'+(l.sw||1)+'"':'')+(l.tf?' transform="'+l.tf+'"':'')+'/>').join('');div.append(svg);
  const text=document.createElement('span');text.textContent=word;text.style.cssText='font-size:'+W.fs+'px;left:'+((W.bw-W.tw)/2)+'px;top:'+((W.bh-W.th)/2)+'px;width:'+W.tw+'px;line-height:1;transform:'+W.rowTf;div.append(text);document.querySelector('#words').append(div);
 }
 const LINES=[
 ["Bord · Dory","Five thousand years at the edge of the galaxy, and you call this a career?"],
 ["Bord · Hunky","I am a misunderstood genius, my dear; the Academy simply fears my terraforming."],
 ["Bord · Dory","Then terraform us a table at court, darling!"],
 ["Technik-Test (kein gültiges Triplet)","Vulnerability Over Perfection: you cannot be loved until you drop the mask; ethical bloodbath."],
 ["Geopolitical","BlackRock's Aladdin AI: doesn't predict the future, owns the companies that dictate it."],
 ["Grimm 02","Rumpelstiltskin: the devil told you that! Straw into gold, till his name is guessed."],
 ["Therapy","Tent of Unnamed Feelings, language fails before feeling; a foggy tent of colored clouds."],
 ["Frage","Did you really fix the engine again, or is that just more fluff tape?"],
 ["Kurz","Not again!"],
 ["W-Frage","Why did FrizzleBob trade the Lorekeeper's map for more fluff tape?"]];
 const cards=LINES.map(([label,text],i)=>({id:'probe-'+i,label,text}));
 const decks=[{id:'bord',cardIds:cards.slice(0,3).map(c=>c.id)},{id:'test',cardIds:cards.slice(3).map(c=>c.id)}];
 const state={encounters:{},owned:{}};const decoder=B.createDecoder({cards,decks,state});
 const el=id=>document.getElementById(id),select=el('sample');
 cards.forEach((c,i)=>{const o=document.createElement('option');o.value=i;o.textContent=c.label;select.append(o);});select.value='3';el('text').value=cards[3].text;
 let bundleAdded=[];
 function paper(){const fill=B.paperColor({storyMode:el('story').checked,tint:'#d6e1f2',light:Number(el('light').value)/100,timeOfDay:Number(el('time').value)/100});el('decode-paper').style.background=fill;paths.forEach(p=>p.setAttribute('fill',fill));el('paper-status').textContent=fill+' · Kontrast '+B.contrast(fill).toFixed(1)+':1';return fill;}
 function render(){decoder.setState(state);B.renderWords(el('decoded'),el('text').value,{decoder,assist:el('assist').checked});el('own').checked=!!state.owned[cards[select.value].id];el('progress-status').textContent=decoder.keys().map(k=>k+': '+(state.encounters[k]||0)+' Begegnungen').join(' · ');paper();}
 select.onchange=()=>{el('text').value=cards[select.value].text;render();};el('text').oninput=render;
 el('encounter').onclick=()=>{for(const lemma of new Set(B.analyze(el('text').value).filter(t=>t.role==='content').map(t=>t.l)))state.encounters[lemma]=(state.encounters[lemma]||0)+1;render();};
 el('own').onchange=()=>{state.owned[cards[select.value].id]=el('own').checked;render();};
 el('bundle').onchange=()=>{if(el('bundle').checked){const id=cards[select.value].id,deck=decks.find(d=>d.cardIds.includes(id));bundleAdded=deck.cardIds.filter(x=>x!==id&&!state.owned[x]).slice(0,3);bundleAdded.forEach(id=>state.owned[id]=true);}else{bundleAdded.forEach(id=>delete state.owned[id]);bundleAdded=[];}render();};
 el('assist').onchange=render;el('reset').onclick=()=>{state.encounters={};state.owned={};bundleAdded=[];el('bundle').checked=false;el('assist').checked=false;render();};
 for(const id of ['story','time','light'])el(id).oninput=paper;
 window.BUBBLES_DEMO={B,C,state,decoder,cards,decks,render,paper};render();document.body.dataset.ready='true';
})();
