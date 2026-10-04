const grid=document.getElementById('grid'),filters=document.getElementById('filters');
const detail=document.getElementById('detail'),title=document.getElementById('title'),groupLabel=document.getElementById('groupLabel');
const hero=document.getElementById('hero'),lanes=document.getElementById('lanes');
const back=document.getElementById('back'),closeBtn=document.getElementById('close'),home=document.getElementById('home'),hint=document.getElementById('hint');
let DATA=null,activeGroup='',activeItem=null,lastFocus=null;
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const groupName=id=>DATA.groups.find(x=>x.id===id)?.label||id;

function wireImages(root){
 root.querySelectorAll('img[data-img]').forEach(im=>im.addEventListener('error',()=>{const p=im.parentElement;im.remove();p?.classList.add('fallback')},{once:true}));
}
function renderFilters(){
 filters.innerHTML='<button class="'+(!activeGroup?'active':'')+'" data-group="">Alle</button>'+
   DATA.groups.map(g=>'<button class="'+(activeGroup===g.id?'active':'')+'" data-group="'+esc(g.id)+'">'+esc(g.label)+'</button>').join('');
 filters.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{activeGroup=b.dataset.group;renderFilters();renderGrid()}));
}
function laneCount(item){return DATA.laneOrder.filter(k=>item.lanes?.[k]?.length).length}
function renderGrid(){
 const items=DATA.items.filter(x=>!activeGroup||x.group===activeGroup);
 grid.innerHTML=items.map(item=>'<button class="card" data-id="'+esc(item.id)+'" aria-label="'+esc(item.label)+' öffnen">'+
   '<img data-img loading="lazy" src="'+esc(item.hero)+'" alt="'+esc(item.label)+'">'+
   '<span class="card-name">'+esc(item.label)+'</span>'+
   '<span class="card-stack" aria-hidden="true">'+Array.from({length:Math.min(4,laneCount(item))},()=>'<i></i>').join('')+'</span>'+
   '</button>').join('');
 wireImages(grid);
 grid.querySelectorAll('.card').forEach(b=>b.addEventListener('click',()=>openItem(b.dataset.id,b)));
}
function sampleCard(s){
 if(s.type==='iframe'){
  return '<article class="sample sample-frame"><iframe loading="lazy" src="'+esc(s.src)+'" title="'+esc(s.source)+'"></iframe>'+
    '<div class="frame-bar"><span>'+esc(s.source)+' · '+esc(s.use)+'</span><a href="'+esc(s.href||s.src)+'" target="_blank" rel="noreferrer" data-tip="Öffnen">↗</a></div></article>';
 }
 if(s.type==='image'){
  const inner='<img data-img loading="lazy" src="'+esc(s.src)+'" alt=""><div class="sample-copy"><span class="sample-source">'+esc(s.source)+'</span><span class="sample-use">'+esc(s.use)+'</span></div>';
  return '<article class="sample">'+(s.href?'<a href="'+esc(s.href)+'" target="_blank" rel="noreferrer">'+inner+'</a>':inner)+'</article>';
 }
 if(s.type==='link'){
  return '<article class="sample"><a class="sample-link sample-live" href="'+esc(s.href||'#')+'" target="_blank" rel="noreferrer">'+
    '<div><span class="glyph">↗</span><b>'+esc(s.label||'Live')+'</b><small>'+esc(s.source)+' · '+esc(s.use)+'</small></div></a></article>';
 }
 return '<article class="sample sample-planned"><div><span class="glyph">＋</span><b>'+esc(s.label||'offen')+'</b><small>'+esc(s.source)+' · '+esc(s.use)+'</small></div></article>';
}
function renderLane(key,samples,open){
 const label=DATA.laneLabels[key]||key;
 return '<details class="lane" '+(open?'open':'')+'><summary><span>'+esc(label)+'</span></summary><div class="lane-body"><div class="samples">'+samples.map(sampleCard).join('')+'</div></div></details>';
}
function openItem(id,origin){
 const item=DATA.items.find(x=>x.id===id); if(!item)return;
 activeItem=item;lastFocus=origin||document.activeElement;
 title.textContent=item.label;groupLabel.textContent=groupName(item.group);hero.src=item.hero;hero.alt=item.label;
 const keys=DATA.laneOrder.filter(k=>item.lanes?.[k]?.length);
 lanes.innerHTML=keys.map((k,i)=>renderLane(k,item.lanes[k],i===0)).join('');
 wireImages(lanes);
 detail.hidden=false;document.body.style.overflow='hidden';
 history.replaceState(null,'','#'+encodeURIComponent(item.id));
 requestAnimationFrame(()=>back.focus({preventScroll:true}));
}
function closeDetail(){
 if(detail.hidden)return;detail.hidden=true;document.body.style.overflow='';activeItem=null;
 history.replaceState(null,'',location.pathname+location.search);
 lastFocus?.focus?.({preventScroll:true});
}
back.addEventListener('click',closeDetail);closeBtn.addEventListener('click',closeDetail);
home.addEventListener('click',()=>{activeGroup='';renderFilters();renderGrid();if(!detail.hidden)closeDetail()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!detail.hidden)closeDetail()});
document.addEventListener('pointerover',e=>{const t=e.target.closest('[data-tip]');if(!t)return;hint.textContent=t.dataset.tip;hint.classList.add('show')});
document.addEventListener('pointermove',e=>{if(!hint.classList.contains('show'))return;hint.style.left=Math.min(innerWidth-90,e.clientX+12)+'px';hint.style.top=e.clientY+12+'px'});
document.addEventListener('pointerout',e=>{if(e.target.closest('[data-tip]'))hint.classList.remove('show')});

fetch('./hub-data.v0.2.json?v=20260918b').then(r=>r.json()).then(d=>{
 DATA=d;renderFilters();renderGrid();
 const id=decodeURIComponent(location.hash.slice(1));if(id&&DATA.items.some(x=>x.id===id))openItem(id,null);
}).catch(()=>{grid.innerHTML=''});
