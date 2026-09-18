const matrix=document.getElementById('matrix'),empty=document.getElementById('empty');
const search=document.getElementById('search'),familyFilter=document.getElementById('familyFilter'),
priorityFilter=document.getElementById('priorityFilter'),coverageFilter=document.getElementById('coverageFilter'),
onlyMissing=document.getElementById('onlyMissing'),kindTabs=document.getElementById('kindTabs');
let DATA=null,activeKind='';
const kindLabel={cell_class:'Cell',morphology_variant:'Morphology',inclusion:'Inclusion',population_state:'Field state',artifact_or_other_finding:'Finding',condition_recipe:'Condition'};
function esc(s=''){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function coveragePct(r){return Math.min(100,Math.round((r.currentAssets.length/Math.max(1,r.targetAssets))*100))}
function metricClass(n){return n===0?'none':n<2?'mid':'good'}
function assetCard(a){
 const visual=a.src?'<img loading="lazy" src="'+esc(a.src)+'" alt="'+esc(a.id)+'">':'<div class="asset-symbol">'+(a.type==='recipe'?'◫':a.type==='procedural'?'○':'●')+'</div>';
 return '<div class="asset-card"><div class="thumb">'+visual+'<div class="asset-status">'+esc(a.status||'CURRENT')+'</div></div><div class="asset-id">'+esc(a.id)+'</div></div>';
}
function missingCard(i){return '<div class="missing-card"><div class="thumb"><div class="asset-symbol">＋</div></div><div class="asset-id">fehlend '+(i+1)+'</div></div>'}
function refsHtml(r){
 if(!r.references.length)return '<div class="source-card"><b>Noch keine direkte Vorlage</b><span>Reference Wave erweitern.</span></div>';
 return r.references.map(x=>'<a class="ref-link" target="_blank" rel="noreferrer" href="'+esc(x.url)+'"><b>'+esc(x.name)+'</b><span>Reference / morphology anchor ↗</span></a>').join('');
}
function sourcesHtml(r){
 if(!r.datasets.length)return '<div class="source-card"><b>Noch keine Dataset-Lane</b><span>Asset-/Source-Recherche offen.</span></div>';
 return r.datasets.map(x=>'<a class="ref-link" target="_blank" rel="noreferrer" href="'+esc(x.url||'#')+'"><b>'+esc(x.id)+'</b><span>'+esc(x.role||'source candidate')+'</span><span class="source-license">'+esc(x.license||'LICENSE VERIFY')+'</span></a>').join('');
}
function row(r){
 const pct=coveragePct(r),assets=[...r.currentAssets,...Array.from({length:r.missingAssets},(_,i)=>({missing:true,i}))];
 const assetHtml=assets.slice(0,Math.max(r.targetAssets,5)).map(x=>x.missing?missingCard(x.i):assetCard(x)).join('');
 return '<details class="row">'+
  '<summary>'+
   '<div class="entity"><div class="entity-name">'+esc(r.label)+'</div><div class="entity-meta"><span class="id">'+esc(r.id)+'</span><span class="kind-chip">'+esc(kindLabel[r.kind]||r.kind)+'</span><span class="family-chip">'+esc(r.family)+'</span></div></div>'+
   '<div class="priority '+esc(r.priority)+'">'+esc(r.priority)+'</div>'+
   '<div class="metric refs '+metricClass(r.references.length)+'">'+r.references.length+' <small>refs</small></div>'+
   '<div class="metric sources '+metricClass(r.datasets.length)+'">'+r.datasets.length+' <small>sources</small></div>'+
   '<div class="metric '+(r.currentAssets.length?'good':'none')+'">'+r.currentAssets.length+'/'+r.targetAssets+' <small>assets</small><div class="coverage-bar"><i style="width:'+pct+'%"></i></div></div>'+
   '<div class="chev">⌄</div>'+
  '</summary>'+
  '<div class="detail"><div class="detail-grid">'+
   '<section class="panel"><div class="panel-title"><span>Vorlagen / Referenzen</span><span>'+r.references.length+'</span></div><div class="ref-list">'+refsHtml(r)+'</div></section>'+
   '<section class="panel"><div class="panel-title"><span>Dataset / Source lanes</span><span>'+r.datasets.length+'</span></div><div class="source-list">'+sourcesHtml(r)+'</div></section>'+
   '<section class="panel assets"><div class="panel-title"><span>Aktuell / fehlend</span><span>'+r.currentAssets.length+' vorhanden · '+r.missingAssets+' fehlen</span></div><div class="asset-grid">'+assetHtml+'</div></section>'+
  '</div><div class="detail-note"><span><b>Scope:</b> '+esc(r.scope||'—')+'</span><span><b>Status:</b> '+esc(r.coverage)+'</span><span><b>Target:</b> '+r.targetAssets+' Varianten/Representations</span>'+(r.parent?'<span><b>Parent:</b> '+esc(r.parent)+'</span>':'')+'</div></div>'+
 '</details>';
}
function renderStats(rows){
 const refs=rows.filter(r=>r.references.length).length,sources=rows.filter(r=>r.datasets.length).length,assets=rows.filter(r=>r.currentAssets.length).length,missing=rows.filter(r=>r.missingAssets>0).length;
 document.getElementById('stats').innerHTML=[
  [rows.length,'entities'],[refs,'with refs'],[sources,'with sources'],[assets,'with assets'],[missing,'gaps']
 ].map(x=>'<div class="stat"><b>'+x[0]+'</b><span>'+x[1]+'</span></div>').join('');
}
function render(){
 const q=search.value.trim().toLowerCase(),family=familyFilter.value,priority=priorityFilter.value,cov=coverageFilter.value;
 const rows=DATA.rows.filter(r=>
  (!activeKind||r.kind===activeKind)&&(!family||r.family===family)&&(!priority||r.priority===priority)&&(!cov||r.coverage===cov)&&
  (!onlyMissing.checked||r.missingAssets>0)&&
  (!q||[r.id,r.label,r.family,r.kind,r.scope,...r.references.map(x=>x.name),...r.datasets.map(x=>x.id)].join(' ').toLowerCase().includes(q))
 );
 matrix.innerHTML=rows.map(row).join('');empty.hidden=rows.length>0;renderStats(rows);
}
Promise.all([fetch('./coverage.v0.1.json?v=20260918c').then(r=>{if(!r.ok)throw new Error('coverage '+r.status);return r.json()})]).then(([data])=>{
 DATA=data;
 [...new Set(DATA.rows.map(r=>r.family))].sort().forEach(f=>familyFilter.insertAdjacentHTML('beforeend','<option value="'+esc(f)+'">'+esc(f)+'</option>'));
 render();
}).catch(err=>{console.error(err);document.getElementById('empty').hidden=false;document.getElementById('empty').textContent='Coverage-Daten konnten nicht geladen werden. Bitte Seite hart neu laden.';});
kindTabs.addEventListener('click',e=>{const b=e.target.closest('button[data-kind]');if(!b)return;activeKind=b.dataset.kind;kindTabs.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));render()});
[search,familyFilter,priorityFilter,coverageFilter,onlyMissing].forEach(el=>el.addEventListener(el===search?'input':'change',render));
