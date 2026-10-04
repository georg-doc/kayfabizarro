import { $, state, badge } from './state.js';
import { attach3DThumbnail } from './thumb3d.js';

const style=document.createElement('link');
style.rel='stylesheet';
style.href='./related-assets.css';
document.head.append(style);

function isKayKit(record){return String(record?.packId||'').startsWith('kaykit-')||String(record?.path||'').includes('/KayKit_');}
function isRenderable(record){return record?.kind==='model-3d'&&['glb','gltf'].includes(record.format);}
function isAnimation(record){return /\/Animations\//i.test(String(record?.path||''))||record?.packId==='kaykit-character-animations-1-1';}
function rig(record){return state.rigById?.get(record.assetId)||record.rigFacts||{};}
function ensureRelatedDom(){
  if ($('relatedAssets')) return $('relatedAssets');
  const box=document.createElement('section'); box.id='relatedAssets'; box.className='related-assets'; box.hidden=true;
  const quick=document.querySelector('#detailContent .quick-actions'); quick?.after(box);
  return box;
}
export function renderRelatedAssets(record,onInspect){
  const box=ensureRelatedDom(); if(!box)return [];
  box.replaceChildren(); box.hidden=true;
  if(!record?.collectionPath||!isKayKit(record)||rig(record).hasSkin!==true||!state.catalog)return[];
  const rows=state.catalog.filter((candidate)=>candidate.assetId!==record.assetId&&candidate.packId===record.packId&&candidate.collectionPath===record.collectionPath&&isRenderable(candidate)&&!isAnimation(candidate)&&rig(candidate).hasSkin!==true).sort((a,b)=>String(a.name).localeCompare(String(b.name)));
  if(!rows.length)return[];
  box.hidden=false;
  const head=document.createElement('div'); head.className='related-head';
  const title=document.createElement('div'); const strong=document.createElement('strong');strong.textContent='Collection props'; const note=document.createElement('span');note.textContent=`${rows.length} structural sibling${rows.length===1?'':'s'} · same ${record.collectionPath}`; title.append(strong,note); head.append(title,badge('candidate-only')); box.append(head);
  const grid=document.createElement('div');grid.className='related-grid';
  for(const candidate of rows.slice(0,12)){
    const button=document.createElement('button');button.type='button';button.className='related-card';button.onclick=()=>onInspect?.(candidate.assetId);
    const thumb=document.createElement('div');thumb.className='related-thumb';attach3DThumbnail(candidate,thumb);
    const copy=document.createElement('div');const name=document.createElement('b');name.textContent=candidate.name;const meta=document.createElement('span');meta.textContent=candidate.format;copy.append(name,meta);button.append(thumb,copy);grid.append(button);
  }
  box.append(grid);
  const foot=document.createElement('p');foot.className='small-note';foot.textContent='Grouped by existing pack + collection structure only. “Prop” is a workbench convenience label, not new Registry semantics.';box.append(foot);
  return rows;
}
