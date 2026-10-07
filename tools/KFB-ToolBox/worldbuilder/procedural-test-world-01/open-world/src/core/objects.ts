// Semantic identity is retained separately from render merging, instancing and stream residency.
export interface WorldObjectRecord {
 id:string; source:string; recipe?:string; chunk:string; role:string;
 matrix:number[]; origin:'procedural'|'authored'; parent?:string; stateRef:string;
}
export class WorldObjects {
 readonly records=new Map<string,WorldObjectRecord>();
 readonly resident=new Set<string>();
 register(record:WorldObjectRecord){const old=this.records.get(record.id);this.records.set(record.id,old?.origin==='authored'?old:record);this.resident.add(record.id);return this.records.get(record.id)!;}
 streamOut(chunk:string){for(const r of this.records.values())if(r.chunk===chunk)this.resident.delete(r.id);}
 snapshot(){return [...this.records.values()].sort((a,b)=>a.id.localeCompare(b.id)).map(r=>({...r,matrix:[...r.matrix]}));}
 restore(records:WorldObjectRecord[]){for(const r of records){if(!r.id||r.matrix.length!==16||!r.matrix.every(Number.isFinite))throw Error('invalid WorldObject');this.records.set(r.id,{...r,matrix:[...r.matrix]});}}
}
const worlds=new Map<number,WorldObjects>();
export function objectsFor(seed:number){let o=worlds.get(seed);if(!o)worlds.set(seed,o=new WorldObjects());return o;}
export function instanceId(seed:number,module:string,source:string,chunk:string,matrix:number[]){
 // Planned horizontal location identifies a procedural instance independently from fitted ground height.
 // Asset/module/rotation discriminate coincident source objects; authored edits retain this original id.
 const key=[seed,module,source,chunk,matrix[12],matrix[14],matrix[0],matrix[2]].join('|');
 let h=2166136261;for(let i=0;i<key.length;i++)h=Math.imul(h^key.charCodeAt(i),16777619);
 return `${module}:${source}:${(h>>>0).toString(16)}:${key}`;
}
