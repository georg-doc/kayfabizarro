import {createWallField,syncField} from './native/cascade/r4/impact-mask.mjs';
// Derived native mask/face computation only. Commands, hits and physics stay with the host.
export function createFieldEngine(){const fields=new Map();return message=>{
 if(message.type==='reset'){fields.clear();return {type:'reset',generation:message.generation};}
 const {surface,impacts,generation,id}=message;let f=fields.get(surface.id);if(!f){f=createWallField(surface.width,surface.height,surface.seed);fields.set(surface.id,f);}
 const t=performance.now();syncField(f,impacts);
 const field={w:f.w,h:f.h,cols:f.cols,rows:f.rows,x0:f.x0,y0:f.y0,sx:f.sx,sy:f.sy,version:f.version,applied:f.applied,maxD:f.maxD,d:f.d.slice(),data:f.data.slice(),graph:f.graph};
 return {type:'field',generation,id,surface:surface.id,field,computeMs:performance.now()-t,metrics:{nodes:f.graph.nodes.length,edges:f.graph.edges.length,faces:f.graph.faces.length,impacts:f.applied}};
};}
