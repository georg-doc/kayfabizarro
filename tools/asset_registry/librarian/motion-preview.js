import { $, state } from './state.js';
import { playExternalClip } from './preview3d.js';

const style=document.createElement('link');
style.rel='stylesheet';
style.href='./motion-preview.css';
document.head.append(style);

let choices=new Map();
function ensureMotionDom(){
  if ($('externalMotionControl')) return;
  const controls=$('threeControls'); if(!controls)return;
  const label=document.createElement('label'); label.id='externalMotionControl'; label.className='clip-control'; label.hidden=true; label.append(document.createTextNode('KayKit motion '));
  const select=document.createElement('select'); select.id='externalMotionSelect'; select.append(new Option('Choose local/shared motion…','')); label.append(select);
  const note=document.createElement('span'); note.id='externalMotionBoundary'; note.className='motion-preview-boundary'; note.hidden=true;
  controls.append(label,note);
}
function clipRows(source) {
  const rig=state.rigById?.get(source.assetId) || source.rigFacts || {};
  const clips=rig.animationClips || [];
  if (clips.length) return clips.map((clip,index)=>({ name:clip.name || `Clip ${index+1}`, index }));
  return Array.from({length:Number(rig.animationCount||0)},(_,index)=>({name:`Clip ${index+1}`,index}));
}
function sourceLabel(source) {
  return String(source.name || source.path?.split('/').pop() || source.assetId).replace(/\.(glb|gltf)$/i,'').replace(/^Rig_(Small|Medium|Large)_/i,'');
}
function appendGroup(select,label,sources,kind) {
  if (!sources?.length) return 0;
  const group=document.createElement('optgroup'); group.label=label; let count=0;
  for (const source of sources) {
    for (const clip of clipRows(source)) {
      const key=`m${choices.size}`;
      choices.set(key,{source,clipName:clip.name,clipIndex:clip.index,kind});
      const option=document.createElement('option'); option.value=key; option.textContent=`${clip.name} · ${sourceLabel(source)}`; group.append(option); count+=1;
    }
  }
  if (count) select.append(group); return count;
}
export function clearMotionPreview() {
  ensureMotionDom();
  choices=new Map();
  const control=$('externalMotionControl'), select=$('externalMotionSelect'), note=$('externalMotionBoundary');
  if (select) select.replaceChildren(new Option('Choose local/shared motion…',''));
  if (control) control.hidden=true; if (note) note.hidden=true;
}
export function configureMotionPreview(record,discovery) {
  ensureMotionDom();
  clearMotionPreview();
  const control=$('externalMotionControl'), select=$('externalMotionSelect'), note=$('externalMotionBoundary');
  if (!control || !select || !record?.rigFacts?.hasSkin) return 0;
  let count=0;
  count+=appendGroup(select,'Local character motions',discovery?.local || [],'local');
  count+=appendGroup(select,'Shared KayKit motions',discovery?.shared || [],'shared');
  if (!count) return 0;
  control.hidden=false; note.hidden=false;
  note.textContent=`${count} local/shared motion previews · preview evidence only; Animation Lab v2 owns final compatibility.`;
  select.onchange=async()=>{
    const choice=choices.get(select.value); if (!choice) return;
    select.disabled=true;
    try {
      const result=await playExternalClip(choice.source,choice.clipName,choice.clipIndex);
      if (!result) return;
      note.textContent=`${choice.kind} · ${result.clipName} · ${result.matchedTracks}/${result.totalTracks} tracks bound · preview only; Animation Lab v2 validates final compatibility.`;
    } catch (error) {
      note.textContent=`Motion preview failed: ${error.message} · source remains a candidate.`;
    } finally { select.disabled=false; }
  };
  return count;
}
