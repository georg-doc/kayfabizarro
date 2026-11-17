import{createCore}from'./native/cascade/core.mjs';
import{createWallField,syncField,clearField,fieldD}from'./native/cascade/r4/impact-mask.mjs';
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0),sub=(a,b)=>a.map((x,i)=>x-b[i]),clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export const ROOM_SURFACES=Object.freeze([
 {name:'west',origin:[.75,.75,5.75],u:[0,0,-1],v:[0,1,0],normal:[1,0,0],width:5,height:3},
 {name:'east',origin:[5.75,.75,.75],u:[0,0,1],v:[0,1,0],normal:[-1,0,0],width:5,height:3},
 {name:'north',origin:[.75,.75,.75],u:[1,0,0],v:[0,1,0],normal:[0,0,1],width:5,height:3},
 {name:'south',origin:[5.75,.75,5.75],u:[-1,0,0],v:[0,1,0],normal:[0,0,-1],width:5,height:3},
 {name:'floor',origin:[.75,.75,5.75],u:[1,0,0],v:[0,0,-1],normal:[0,1,0],width:5,height:5},
 {name:'ceiling',origin:[.75,3.75,.75],u:[1,0,0],v:[0,0,1],normal:[0,-1,0],width:5,height:5}
]);
// Six placements of the EXISTING planar fracture field, not a new fracture solver.
// commitFracture is the receiving geometry/collision/fragment owner, not a VFX hook.
export function createFractureRoomResponse({roomId='r0',frame,commitFracture,canReset,seed=1337,fieldPipeline=null}){
 if(!frame||typeof frame.toLocal!=='function'||typeof frame.localDirection!=='function'||typeof commitFracture!=='function'||typeof canReset!=='function')throw Error('Existing frame/geometry/reset owners required');
 const rows=ROOM_SURFACES.map((p,i)=>({...p,id:roomId+':'+p.name,field:createWallField(p.width,p.height,seed+i)})),core=createCore({nodes:rows.map(p=>({id:p.id,vault:true})),edges:[],source:rows[0].id,target:rows[0].id,golden:true}),stats={confirmedMessages:0,surfaceCommits:0,resets:0,profile:[]};let commandId=0;
 const project=(s,p)=>{const d=sub(p,s.origin);return{x:dot(d,s.u)-s.width/2,y:dot(d,s.v),depth:dot(d,s.normal)};};
 const point=(s,x,y)=>s.origin.map((v,i)=>v+s.u[i]*(x+s.width/2)+s.v[i]*y);
 function apply(s,info,profile,p){
  const q=project(s,p);if(Math.abs(q.depth)>.751||q.x< -s.width/2-.01||q.x>s.width/2+.01||q.y<-.01||q.y>s.height+.01)return false;
  const direction=frame.localDirection({x:info.dir?.[0]??0,y:info.dir?.[1]??0,z:info.dir?.[2]??0}),d=[direction.x,direction.y,direction.z],command={id:'ir:'+ ++commandId,type:'shellHit',cell:s.id,wall:0,weapon:info.kind==='blast'&&profile.blastFallback&&info.energy<=profile.blastFallback.threshold?profile.blastFallback.below:profile.nativeCommandWeapon,energy:info.energy,length:info.length,point:[clamp(q.x,-s.width/2,s.width/2),clamp(q.y,0,s.height)],direction:[dot(d,s.u),dot(d,s.v)]};
  if(fieldPipeline&&!fieldPipeline.canSubmit())return false;const t0=performance.now();if(!core.command(command))return false;const t1=performance.now();const receipt={surface:s.id,weapon:info.weapon,color:info.weaponColor??null,commandId:command.id,kind:info.kind,geometryChanged:!fieldPipeline,geometryPending:!!fieldPipeline};const impacts=core.state.cells[s.id].impacts;if(fieldPipeline){fieldPipeline.submit(s,impacts,field=>{receipt.geometryChanged=true;receipt.geometryPending=false;s.field={...field,seedBase:s.field.seedBase};commitFracture({surface:s,field:s.field,impacts,receipt});stats.surfaceCommits++;});}else{syncField(s.field,impacts);commitFracture({surface:s,field:s.field,impacts,receipt});stats.surfaceCommits++;}stats.profile.push({command:t1-t0,field:fieldPipeline?0:performance.now()-t1});if(stats.profile.length>64)stats.profile.shift();return receipt;
 }
 return{surfaces:rows,core,impact(info,profile){const pos=frame.toLocal({x:info.at[0],y:info.at[1],z:info.at[2]}),p=[pos.x,pos.y,pos.z];let receipts=[];
  if(info.kind==='blast'){
   // Source-local area response permitted by combatTargets' blast contract.
   // Pressure radius decides which existing planes respond; it is not another ray.
   for(const s of rows){const q=project(s,p),cp=point(s,clamp(q.x,-s.width/2,s.width/2),clamp(q.y,0,s.height)),distance=Math.hypot(...sub(cp,p));if(distance>=info.radius)continue;const r=apply(s,{...info,energy:info.energy*(1-distance/info.radius)},profile,cp);if(r)receipts.push(r);}
  }else{const s=rows.find(s=>s.id===info.id);if(s){const r=apply(s,info,profile,p);if(r)receipts.push(r);}}
  if(!receipts.length)return false;stats.confirmedMessages++;return{kind:info.kind,weapon:info.weapon,surfaces:receipts};
 },sample(name,x,y){const s=rows.find(s=>s.name===name);if(!s)throw Error('Unknown surface');return{distance:fieldD(s.field,x,y),field:s.field};},status:()=>({...stats,nativeGraph:'cascade/r4/fracture.mjs via createCore/syncField',autonomousQueries:0,createdPhysicsWorlds:0,createdRenderers:0,fieldPipeline:fieldPipeline?.status()??null}),reset(){if(!canReset())return false;core.reset();fieldPipeline?.reset();for(const s of rows){s.field=createWallField(s.width,s.height,s.field.seedBase);commitFracture({surface:s,field:s.field,impacts:[],receipt:{reset:true,surface:s.id}});}stats.resets++;return true;}};
}
