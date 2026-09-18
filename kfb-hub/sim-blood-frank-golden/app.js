const grid=document.getElementById('grid');
const veil=document.getElementById('veil'),focusTitle=document.getElementById('focusTitle');
const compare=document.getElementById('compare'),rail=document.getElementById('rail'),dots=document.getElementById('dots');
const closeBtn=document.getElementById('close'),hint=document.getElementById('hint');
let DATA={items:[]},activeGroup='',activeItem=null,activeCandidate=1,lastFocus=null;

const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
function img(src,alt=''){return '<img loading="lazy" src="'+esc(src)+'" alt="'+esc(alt)+'" data-img>'}
function card(item){
 const extra=item.samples.length>1?'<span class="card-more" aria-hidden="true"></span>':'';
 return '<button class="card" data-id="'+esc(item.id)+'" data-group="'+esc(item.group)+'" aria-label="'+esc(item.label)+' öffnen">'+
   img(item.hero,item.label)+'<span class="card-name">'+esc(item.label)+'</span>'+extra+'</button>';
}
function render(){
 grid.innerHTML=DATA.items.filter(x=>!activeGroup||x.group===activeGroup).map(card).join('');
 wireImages(grid);
 grid.querySelectorAll('.card').forEach(b=>b.addEventListener('click',()=>openItem(DATA.items.find(x=>x.id===b.dataset.id),b)));
}
function wireImages(root){
 root.querySelectorAll('img[data-img]').forEach(im=>im.addEventListener('error',()=>{
   const p=im.parentElement; im.remove(); if(p)p.classList.add('fallback');
 },{once:true}));
}
function pane(sample,label){
 const link=sample.href?'<a href="'+esc(sample.href)+'" target="_blank" rel="noreferrer" aria-label="Quelle öffnen" data-tip="Quelle">↗</a>':'';
 return '<div class="pane">'+img(sample.src,label)+'<span class="pane-tag">'+esc(sample.kind==='ref'?'REF':'CAND')+'</span>'+link+'</div>';
}
function openItem(item,origin){
 if(!item)return;
 activeItem=item; activeCandidate=Math.min(1,item.samples.length-1); lastFocus=origin||document.activeElement;
 focusTitle.textContent=item.label;
 veil.hidden=false; document.body.style.overflow='hidden';
 paintFocus();
 requestAnimationFrame(()=>closeBtn.focus({preventScroll:true}));
}
function paintFocus(){
 const ref=activeItem.samples.find(x=>x.kind==='ref')||activeItem.samples[0];
 const candidates=activeItem.samples.filter(x=>x.kind!=='ref');
 compare.classList.toggle('dual',candidates.length>0);
 compare.innerHTML=pane(ref,activeItem.label)+(candidates.length?pane(candidates[Math.max(0,activeCandidate-1)]||candidates[0],activeItem.label):'');
 wireImages(compare);
 rail.innerHTML=activeItem.samples.map((s,i)=>'<button class="thumb '+(i===activeCandidate?'active':'')+'" data-i="'+i+'" aria-label="Sample '+(i+1)+'">'+img(s.src,'')+'</button>').join('');
 wireImages(rail);
 rail.querySelectorAll('.thumb').forEach(b=>b.addEventListener('click',()=>{
   const i=+b.dataset.i;
   if(activeItem.samples[i].kind==='ref' && activeItem.samples.length>1){activeCandidate=1}else{activeCandidate=i}
   paintFocus();
 }));
 dots.innerHTML=activeItem.samples.map((_,i)=>'<i class="'+(i===activeCandidate?'live':'')+'"></i>').join('');
}
function close(){
 if(veil.hidden)return;
 veil.hidden=true; document.body.style.overflow=''; activeItem=null;
 if(lastFocus&&lastFocus.focus)lastFocus.focus({preventScroll:true});
}
function step(dir){
 if(!activeItem)return;
 const candidates=activeItem.samples.filter(x=>x.kind!=='ref');
 if(!candidates.length)return;
 let idx=Math.max(0,activeCandidate-1);
 idx=(idx+dir+candidates.length)%candidates.length;
 activeCandidate=idx+1; paintFocus();
}
document.querySelectorAll('.filters button').forEach(b=>b.addEventListener('click',()=>{
 activeGroup=b.dataset.group;
 document.querySelectorAll('.filters button').forEach(x=>x.classList.toggle('active',x===b));
 render();
}));
closeBtn.addEventListener('click',close);
veil.addEventListener('click',e=>{if(e.target===veil)close()});
document.addEventListener('keydown',e=>{
 if(!veil.hidden){
  if(e.key==='Escape')close();
  if(e.key==='ArrowRight')step(1);
  if(e.key==='ArrowLeft')step(-1);
 }
});
document.addEventListener('pointerover',e=>{
 const t=e.target.closest('[data-tip]'); if(!t)return;
 hint.textContent=t.dataset.tip; hint.classList.add('show');
});
document.addEventListener('pointermove',e=>{
 if(!hint.classList.contains('show'))return;
 hint.style.left=Math.min(innerWidth-80,e.clientX+12)+'px';hint.style.top=(e.clientY+12)+'px';
});
document.addEventListener('pointerout',e=>{if(e.target.closest('[data-tip]'))hint.classList.remove('show')});

fetch('./golden-samples.v0.1.json?v=20260918a').then(r=>r.json()).then(d=>{DATA=d;render()}).catch(()=>{grid.innerHTML='';});
