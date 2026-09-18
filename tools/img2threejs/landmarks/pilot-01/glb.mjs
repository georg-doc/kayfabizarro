/** Minimal deterministic glTF 2.0 binary export of the SAME authored vertex data.
 * No viewer floor, camera, lighting or inspection scale is included.
 */
import {mergeZones,faceNormals} from './geometry.mjs';
const linear=c=>{const v=c/255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;};
function colour(hex){
 if(!/^#[0-9a-f]{6}$/i.test(hex))throw Error('Expected a six-digit sRGB colour');
 return [...[1,3,5].map(i=>linear(parseInt(hex.slice(i,i+2),16))),1];
}
export function exportGLB(asset,colours){
 const meshes=mergeZones(asset),chunks=[],bufferViews=[],accessors=[];let offset=0;
 function floats(values,position=false){
  const bytes=new Uint8Array(values.length*4),dv=new DataView(bytes.buffer);
  values.forEach((v,i)=>{if(!Number.isFinite(v))throw Error('Non-finite geometry');dv.setFloat32(i*4,v,true);});
  const view=bufferViews.length;bufferViews.push({buffer:0,byteOffset:offset,byteLength:bytes.length,target:34962});
  const acc={bufferView:view,componentType:5126,count:values.length/3,type:'VEC3'};
  if(position){acc.min=[Infinity,Infinity,Infinity];acc.max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<values.length;i++){const a=i%3;acc.min[a]=Math.min(acc.min[a],values[i]);acc.max[a]=Math.max(acc.max[a],values[i]);}}
  const index=accessors.length;accessors.push(acc);chunks.push(bytes);offset+=bytes.length;return index;
 }
 const materials=meshes.map(m=>({name:m.zone,pbrMetallicRoughness:{baseColorFactor:colour(colours[m.zone]),metallicFactor:0,roughnessFactor:.9},doubleSided:false,extras:{kfbMaterialZone:m.zone}}));
 const gltfMeshes=meshes.map((m,i)=>({name:asset.id+'-'+m.zone,primitives:[{attributes:{POSITION:floats(m.positions,true),NORMAL:floats(faceNormals(m.positions))},material:i,mode:4}],extras:{kfbMaterialZone:m.zone}}));
 const doc={asset:{version:'2.0',generator:'KFB landmark pilot 01'},scene:0,scenes:[{nodes:[0]}],nodes:[{name:asset.title,children:meshes.map((_,i)=>i+1),extras:{units:'metre',upAxis:'+Y',pivot:asset.pivot,geographicBinding:null,visualAcceptance:'PENDING',collision:'NOT_PROVIDED',sourceId:asset.id,sourceNotes:asset.note}},...meshes.map((m,i)=>({name:m.zone,mesh:i}))],meshes:gltfMeshes,materials,accessors,bufferViews,buffers:[{byteLength:offset}]};
 const jsonRaw=new TextEncoder().encode(JSON.stringify(doc)),jsonLen=Math.ceil(jsonRaw.length/4)*4;
 const out=new Uint8Array(12+8+jsonLen+8+offset),dv=new DataView(out.buffer);
 dv.setUint32(0,0x46546c67,true);dv.setUint32(4,2,true);dv.setUint32(8,out.length,true);
 dv.setUint32(12,jsonLen,true);dv.setUint32(16,0x4e4f534a,true);out.fill(32,20,20+jsonLen);out.set(jsonRaw,20);
 const bin=20+jsonLen;dv.setUint32(bin,offset,true);dv.setUint32(bin+4,0x004e4942,true);
 let ptr=bin+8;for(const c of chunks){out.set(c,ptr);ptr+=c.length;}return out;
}
