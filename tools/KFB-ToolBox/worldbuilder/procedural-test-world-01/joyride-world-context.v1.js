import {createPresentationAtlas} from './joyride-source/transition-presentation.js';
import {trackCorridor} from './world-clearance.v1.mjs';
export async function prepareJoyride(arch){
 const json=async name=>{const r=await fetch(new URL('./joyride-source/'+name,import.meta.url));if(!r.ok)throw Error('Joyride source '+name+': '+r.status);return r.json()};
 const [TP,MR,M2]=await Promise.all(['transition-profiles.v1.json','road-markings.m1.json','road-markings.m2.json'].map(json));
 const contexts=new Map(),corridors=[];
 const groundY=q=>arch.nodes.find(n=>n.plan.sdf(q.p[0],q.p[2])<=0)?.field.heightAt(q.p[0],q.p[2])??-44;
 for(const {id,stream} of [...arch.nodes.map(n=>({id:n.id,stream:n.plan.stream})),...arch.connections]){
  const L=stream.samples.at(-1).s,bridge=id.startsWith('route.');
  // Explicit recipe seam: donor transition families retained; stations are current-stream fractions.
  const zones=bridge?[{id:'leave',family:'C_city_track_deck',s0:0,s1:L*.15},{id:'arrive',family:'A_track_city',s0:L*.85,s1:L}]:[{id:'entry',family:'A_track_city',s0:0,s1:L*.2},{id:'leave',family:'C_city_track_deck',s0:L*.8,s1:L}];
  const tp={...TP,zones},atlas=createPresentationAtlas(stream.samples,tp,groundY);
  contexts.set(id,{TP:tp,MR,M2,atlas,groundY,connected:true});corridors.push(...trackCorridor(stream,atlas,id,bridge?'bridgehead':'track'));
 }
 return {contexts,corridors};
}
