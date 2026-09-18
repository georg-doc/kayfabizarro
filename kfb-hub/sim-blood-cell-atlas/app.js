let DATA=null;
const atlas=document.getElementById('atlas');
const search=document.getElementById('search');
const groupFilter=document.getElementById('groupFilter');
function groupLabel(id){return DATA.groups.find(g=>g.id===id)?.label||id}
function slotHtml(asset,i){
  if(asset) return '<div class="slot"><div class="thumb"><img loading="lazy" src="'+asset.src+'" alt="'+asset.id+'"><span class="badge">'+asset.status+'</span></div><div class="slot-id">'+asset.id+'</div></div>';
  return '<div class="slot"><div class="thumb"><div class="placeholder">Asset-Kandidat<br>noch offen</div></div><div class="slot-id">Variante '+(i+1)+'</div></div>';
}
function row(cell){
  const assets=cell.sampleAssets||[];
  return '<details class="cell-row" data-label="'+cell.label.toLowerCase()+'" data-group="'+cell.group+'">'+
    '<summary><div class="cell-name">'+cell.label+(cell.simBloodExtension?' · SimBlood+':'')+'</div><div class="size">Darstellungsgröße ≈ '+cell.sizeUm+' µm</div><div class="state">'+(assets.length?assets.length+' Kandidaten im Template':'Asset-Pool offen')+'</div><div class="chev">⌄</div></summary>'+
    '<div class="content"><div class="variant-toolbar"><button class="active" type="button" data-page="0">Varianten 1–5</button><button type="button" data-page="1">Varianten 6–10</button></div>'+
    '<div class="variants" data-variants>'+Array.from({length:5},(_,i)=>slotHtml(assets[i],i)).join('')+'</div>'+
    '<details class="meta"><summary>Review- & Assetdetails anzeigen</summary><div class="meta-body">'+
      '<div class="meta-card"><b>Familie</b>'+groupLabel(cell.group)+'</div>'+
      '<div class="meta-card"><b>Relative Größe</b>≈ '+cell.sizeUm+' µm</div>'+
      '<div class="meta-card"><b>Medical Review</b>noch nicht final</div>'+
      '<div class="meta-card"><b>Runtime Pool</b>'+ (assets.length?'POC-Kandidaten vorhanden':'noch nicht aufgebaut') +'</div>'+
    '</div></details></div></details>';
}
function render(){
  const q=(search.value||'').trim().toLowerCase(), gf=groupFilter.value;
  let html='';
  for(const g of DATA.groups){
    const cells=DATA.cellTypes.filter(c=>(!gf||c.group===gf)&&(!q||c.label.toLowerCase().includes(q))&&c.group===g.id);
    if(!cells.length) continue;
    html+='<div class="group">'+g.label+'</div>'+cells.map(row).join('');
  }
  atlas.innerHTML=html||'<div class="group">Keine Treffer</div>';
  atlas.querySelectorAll('.variant-toolbar').forEach(tb=>{
    tb.querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>{
      tb.querySelectorAll('button').forEach(x=>x.classList.remove('active'));btn.classList.add('active');
      const detail=tb.closest('.content'), row=tb.closest('.cell-row');
      const cell=DATA.cellTypes.find(c=>row.dataset.label===c.label.toLowerCase());
      const page=Number(btn.dataset.page), start=page*5, assets=cell?.sampleAssets||[];
      detail.querySelector('[data-variants]').innerHTML=Array.from({length:5},(_,i)=>slotHtml(assets[start+i],start+i)).join('');
    }))
  })
}
fetch('./cell-types.v0.1.json').then(r=>r.json()).then(j=>{
  DATA=j;
  for(const g of DATA.groups){groupFilter.insertAdjacentHTML('beforeend','<option value="'+g.id+'">'+g.label+'</option>')}
  render();
});
search.addEventListener('input',render);groupFilter.addEventListener('change',render);
document.getElementById('openAll').addEventListener('click',()=>document.querySelectorAll('details.cell-row').forEach(d=>d.open=true));
document.getElementById('closeAll').addEventListener('click',()=>document.querySelectorAll('details.cell-row').forEach(d=>d.open=false));