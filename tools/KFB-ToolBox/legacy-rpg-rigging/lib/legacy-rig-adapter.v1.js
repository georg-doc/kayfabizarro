import { clone as skinClone } from 'three/addons/utils/SkeletonUtils.js';

export const SCHEMA='kfb.legacy-rig-adapter/0.1-candidate';
export const CORE_BONES=['Body','Head','armLeft','armRight'];
const EXTRA_RULES=[[/hat|helmet|visor|hair|hood|cowl|mask|jaw|eyes|beard|horn/i,'Head'],[/cape|cloak|backpack|quiver|belt/i,'Body']];
const cache=new Map();

async function load(loader,url){ if(!cache.has(url)) cache.set(url,loader.loadAsync(url)); return cache.get(url); }
function cloneStatic(g){ const s=g.scene.clone(true); s.traverse(o=>{ if(o.isMesh && o.material){ o.material=Array.isArray(o.material)?o.material.map(m=>m.clone()):o.material.clone(); } }); return s; }
const norm=(s)=>String(s||'').toLowerCase().replace(/_broken$/,'').replace(/arn(left|right)$/,'arm$1').replace(/[^a-z0-9]/g,'');

function matchParts(parts, explicit={}) {
  parts.updateMatrixWorld(true); const all=[]; parts.traverse(o=>{if(o.name)all.push(o);});
  const found={},why={};
  const rules={Body:/body$/,Head:/head$/,armLeft:/armleft$/,armRight:/armright$/};
  for(const [bone,rx] of Object.entries(rules)){
    let node=explicit[bone]?parts.getObjectByName(explicit[bone]):null;
    if(!node) node=all.find(o=>rx.test(norm(o.name)));
    if(node){found[bone]={node,world:node.matrixWorld.clone()};why[bone]=node.name+(explicit[bone]?' (catalog exact)':' (normalized suffix)');}
  }
  if(!found.Body){ const used=new Set(Object.values(found).map(x=>x.node)); const node=all.find(o=>/^character/i.test(o.name)&&!used.has(o)&&!/(hat|helmet|visor|hair|hood|mask|cape|cloak)/i.test(o.name)); if(node){found.Body={node,world:node.matrixWorld.clone()};why.Body=node.name+' (character fallback)';} }
  return {found,why};
}

function boneOf(skel,name){ return skel?.bones?.find(b=>b.name===name)||null; }
function attachWorldToBone(node,world,bone,skel){ const ix=skel.bones.indexOf(bone); const inv=skel.boneInverses[ix]; bone.add(node); node.matrixAutoUpdate=false; node.matrix.copy(inv).multiply(world); node.matrixWorldNeedsUpdate=true; }

export async function assembleLegacy({THREE,loader,rigUrl,partsUrl,catalogCharacter,log=()=>{}}={}) {
  const [rg,pg]=await Promise.all([load(loader,rigUrl),load(loader,partsUrl)]);
  const root=skinClone(rg.scene), parts=cloneStatic(pg); let skel=null;
  root.traverse(o=>{if(o.isSkinnedMesh){o.visible=false;if(!skel)skel=o.skeleton;}});
  if(!skel) throw new Error('Rig_Legacy skeleton missing');
  const explicit={Body:catalogCharacter?.bodyNode,Head:catalogCharacter?.headNode,armLeft:catalogCharacter?.leftArmNode,armRight:catalogCharacter?.rightArmNode};
  const {found,why}=matchParts(parts,explicit); const placed=[],missing=[];
  const main=new Set(Object.values(found).map(x=>x.node));
  const underMain=(o)=>{for(let p=o.parent;p;p=p.parent)if(main.has(p))return true;return false;};
  const extras=[];
  parts.traverse(o=>{
    if(main.has(o)||underMain(o)||!o.name)return;
    const rule=EXTRA_RULES.find(([rx])=>rx.test(o.name)); if(rule && (o.isMesh||o.children?.length)) extras.push({node:o,world:o.matrixWorld.clone(),bone:rule[1]});
  });
  for(const name of CORE_BONES){ const hit=found[name],bone=boneOf(skel,name); if(!hit||!bone){missing.push(name);continue;} attachWorldToBone(hit.node,hit.world,bone,skel); hit.node.userData.kfbLegacyRole=name; placed.push(`${hit.node.name} → ${name}`); }
  const extraPlaced=[]; for(const e of extras){const b=boneOf(skel,e.bone);if(!b)continue;attachWorldToBone(e.node,e.world,b,skel);e.node.userData.kfbLegacyRole='extra:'+e.bone;extraPlaced.push(`${e.node.name} → ${e.bone}`);}
  root.userData.legacy={schema:SCHEMA,placed,extraPlaced,missing,why,partsUrl,rigUrl}; root.updateMatrixWorld(true);
  const api={schema:SCHEMA,root,skeleton:skel,animations:rg.animations||[],source:parts,parts:found,extras,headBone:boneOf(skel,'Head'),leftArmBone:boneOf(skel,'armLeft'),rightArmBone:boneOf(skel,'armRight'),report:root.userData.legacy};
  log(`Rig_Legacy assembled · ${placed.length}/4 core · ${extraPlaced.length} extras · ${api.animations.length} clips`);
  return api;
}

export async function replaceHead({loader,character,headUrl,log=()=>{}}={}) {
  if(!character?.headBone) throw new Error('head bone missing');
  character.headReplacement?.removeFromParent?.();
  if(!headUrl){ if(character.parts?.Head?.node) character.parts.Head.node.visible=true; for(const e of character.extras) if(e.bone==='Head') e.node.visible=true; character.headReplacement=null; return {status:'DEFAULT',headPart:character.parts.Head?.node}; }
  if(character.parts?.Head?.node) character.parts.Head.node.visible=false; for(const e of character.extras) if(e.bone==='Head') e.node.visible=false;
  const g=await load(loader,headUrl), src=cloneStatic(g); const group=new character.root.constructor(); group.name='kfb-legacy-head-replacement';
  while(src.children.length){ const child=src.children[0]; child.removeFromParent(); child.position.set(0,0,0); child.quaternion.identity(); child.scale.set(1,1,1); group.add(child); }
  character.headBone.add(group); group.position.set(0,0,0); group.quaternion.identity(); group.scale.set(1,1,1); character.headReplacement=group; character.root.updateMatrixWorld(true);
  let headPart=null; group.traverse(o=>{if(!headPart && o.isMesh && /head|skull/i.test(o.name||'')&&!/hair|hat|helmet|visor/i.test(o.name||''))headPart=o;}); headPart ||= group;
  log(`head replacement · ${headUrl.split('/').pop()}`); return {status:'ASSET',headPart,group};
}

export function pawAnchor(THREE,host,bone,partRe,frac=.82){
  let part=null; host.traverse(o=>{if(!part&&!o.isBone&&partRe.test(o.name||''))part=o;}); if(!part||!bone)return null;
  bone.updateWorldMatrix(true,false); const inv=bone.matrixWorld.clone().invert(),pts=[],t=new THREE.Vector3(); part.updateWorldMatrix(true,true);
  part.traverse(m=>{if(!m.isMesh)return;const p=m.geometry?.attributes?.position;if(!p)return;for(let i=0;i<p.count;i++)pts.push(t.fromBufferAttribute(p,i).applyMatrix4(m.matrixWorld).applyMatrix4(inv).clone());});
  if(!pts.length)return null; let far=0; for(const p of pts)far=Math.max(far,p.length()); const tip=pts.filter(p=>p.length()>far*frac),c=new THREE.Vector3();for(const p of tip)c.add(p);c.multiplyScalar(1/tip.length);return{local:c,part:part.name,verts:pts.length,tipVerts:tip.length,far};
}

export async function mountHeldProp({THREE,loader,character,url,side='right',scale=1,rotation=[0,0,0],log=()=>{}}={}) {
  character.held?.[side]?.removeFromParent?.(); const bone=side==='left'?character.leftArmBone:character.rightArmBone; if(!bone)return null;
  const re=side==='left'?/ArmLeft|ArnLeft/i:/ArmRight/i; const anchor=pawAnchor(THREE,character.root,bone,re); if(!anchor)return null;
  const g=await load(loader,url),prop=cloneStatic(g); prop.name=`kfb-held-${side}`; bone.add(prop); prop.position.copy(anchor.local);
  const slotName=side==='left'?'handSlotLeft':'handSlotRight'; const slot=character.skeleton?.bones?.find(b=>b.name===slotName); if(slot) prop.quaternion.copy(slot.quaternion);
  prop.rotateX(rotation[0]||0); prop.rotateY(rotation[1]||0); prop.rotateZ(rotation[2]||0); prop.scale.setScalar(scale); character.held ||= {}; character.held[side]=prop;
  log(`held ${url.split('/').pop()} → ${bone.name} · measured paw ${anchor.part}`); return {prop,anchor};
}

export function playClip(character,mixer,name,fade=.12){ const clip=(character.animations||[]).find(c=>c.name===name); if(!clip)return null; const next=mixer.clipAction(clip,character.root); next.reset().play(); if(character.action&&character.action!==next)character.action.crossFadeTo(next,fade,false); character.action=next; return clip; }
