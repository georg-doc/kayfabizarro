// WB2 continuous macro-ground owner. Hex coordinates below are spatial addresses only.
// Mesh, Rapier triangles and support queries use this exact global triangular lattice.
import { fbm2, seedDomainOffset } from './wb2-noise.js';
import { hexToWorld, worldToAxial } from './hex';
import { dabDeltaAt } from '../owners/wb2-sculpt/terrain-sculpt.js';
import { CHUNK } from './units';
export const SURFACE_SUBDIV = 4;
export interface SurfaceContribution {
  id: string; owner: 'river' | 'village' | 'track-core';
  sample(x:number,z:number,base:number): {height:number;weight:number} | null;
}
export interface SurfaceContact {
  id:string; owner:'track-core';
  heightAt(x:number,z:number):number|null;
}
export interface SculptStroke { id:string;x:number;z:number;radius:number;amount:number }
export class SurfaceTruth {
  revision=0;
  readonly contributions = new Map<string,SurfaceContribution>();
  readonly contacts = new Map<string,SurfaceContact>();
  readonly strokes = new Map<string,SculptStroke>();
  private samples = new Map<string,number>();
  private listeners = new Set<()=>void>();
  constructor(readonly seed:number) {}
  onChange(fn:()=>void) {this.listeners.add(fn);return ()=>this.listeners.delete(fn);}
  invalidate() {this.revision++;this.samples.clear();for(const fn of this.listeners)fn();}
  contribute(c:SurfaceContribution) {this.contributions.set(c.id,c);this.invalidate();}
  removeContribution(id:string) {if(this.contributions.delete(id))this.invalidate();}
  contact(c:SurfaceContact) {this.contacts.set(c.id,c);this.invalidate();}
  removeContact(id:string) {if(this.contacts.delete(id))this.invalidate();}
  sculpt(s:SculptStroke) {if(!Number.isFinite(s.amount)||s.radius<=0)throw Error('invalid sculpt');this.strokes.set(s.id,{...s});this.invalidate();}
  restore(strokes:SculptStroke[]) {this.strokes.clear();for(const s of strokes)this.strokes.set(s.id,{...s});this.invalidate();}
  baseHeight(x:number,z:number) {
    const o=seedDomainOffset(this.seed);
    const macro=fbm2(x/520+o,z/520-o,5,.5,2.02);
    const ridge=fbm2(x/1100-o,z/1100+o,3,.52,2.03);
    return (macro-.5)*38+Math.max(0,ridge-.53)*180+ (fbm2(x/75+o,z/75-o,3,.45,2)-.5)*2.5;
  }
  designHeightAt(x:number,z:number) {
    let y=this.baseHeight(x,z);
    for(const c of [...this.contributions.values()].sort((a,b)=>a.id.localeCompare(b.id))) {
      if(c.owner==='track-core')continue;const h=c.sample(x,z,y);if(h)y+=(h.height-y)*Math.max(0,Math.min(1,h.weight));
    }
    return y;
  }
  private vertex(i:number,j:number) {
    const key=i+','+j;const hit=this.samples.get(key);if(hit!==undefined)return hit;
    const w=hexToWorld(i/SURFACE_SUBDIV-.5,j/SURFACE_SUBDIV-.5);
    let y=this.baseHeight(w.x,w.z);
    // Explicit deterministic owner order. Contributions never call the final Surface Truth recursively.
    for(const c of [...this.contributions.values()].sort((a,b)=>a.id.localeCompare(b.id))) {
      const s=c.sample(w.x,w.z,y);if(s)y+=(s.height-y)*Math.max(0,Math.min(1,s.weight));
    }
    for(const s of this.strokes.values()) {
      y+=dabDeltaAt(w.x,w.z,s.amount<0?'lower':'raise',s.x,s.z,s.radius,Math.abs(s.amount));
    }
    // Float32 is the shared collision/render precision, including support interpolation.
    y=Math.fround(y);this.samples.set(key,y);
    if(this.samples.size>200000){let n=50000;for(const k of this.samples.keys()){this.samples.delete(k);if(!--n)break;}}
    return y;
  }
  groundHeightAt(x:number,z:number) {
    const a=worldToAxial(x,z),u=(a.q+.5)*SURFACE_SUBDIV,v=(a.r+.5)*SURFACE_SUBDIV;
    const i=Math.floor(u),j=Math.floor(v),f=u-i,g=v-j;
    const h00=this.vertex(i,j),h10=this.vertex(i+1,j),h01=this.vertex(i,j+1),h11=this.vertex(i+1,j+1);
    // Same diagonal, same barycentric interpolation as the rendered/collided triangles.
    return f+g<=1 ? h00+(h10-h00)*f+(h01-h00)*g : h11+(h01-h11)*(1-f)+(h10-h11)*(1-g);
  }
  /** Highest solid kit surface above the macro ground. Bridges leave the river ground intact. */
  heightAt(x:number,z:number) {
    let y=this.groundHeightAt(x,z);
    for(const c of [...this.contacts.values()].sort((a,b)=>a.id.localeCompare(b.id))) {
      const h=c.heightAt(x,z);if(h!==null&&Number.isFinite(h))y=Math.max(y,h);
    }
    return y;
  }
  slopeAt(x:number,z:number) {const e=.1;return Math.hypot((this.heightAt(x+e,z)-this.heightAt(x-e,z))/(2*e),(this.heightAt(x,z+e)-this.heightAt(x,z-e))/(2*e));}
  isWalkable(x:number,z:number){return this.slopeAt(x,z)<Math.tan(Math.PI/3);}
  isBuildable(x:number,z:number){return this.slopeAt(x,z)<.35;}
  canStep(ax:number,az:number,bx:number,bz:number) {
    const d=Math.hypot(bx-ax,bz-az),n=Math.max(1,Math.ceil(d/.35));let prev=this.heightAt(ax,az);
    for(let k=1;k<=n;k++){const x=ax+(bx-ax)*k/n,z=az+(bz-az)*k/n,h=this.heightAt(x,z);if(!this.isWalkable(x,z)||Math.abs(h-prev)>.5)return false;prev=h;}return true;
  }
  mesh(cx:number,cz:number) {
    const n=CHUNK*SURFACE_SUBDIV,stride=n+1,origin=hexToWorld(cx*CHUNK-.5,cz*CHUNK-.5);
    const positions=new Float32Array(stride*stride*3),indices=new Uint32Array(n*n*6);
    for(let j=0;j<=n;j++)for(let i=0;i<=n;i++) {
      const gi=cx*n+i,gj=cz*n+j,w=hexToWorld(gi/SURFACE_SUBDIV-.5,gj/SURFACE_SUBDIV-.5),k=(j*stride+i)*3;
      positions[k]=w.x-origin.x;positions[k+1]=this.vertex(gi,gj);positions[k+2]=w.z-origin.z;
    }
    let k=0;for(let j=0;j<n;j++)for(let i=0;i<n;i++){const a=j*stride+i,b=a+1,c=a+stride,d=c+1;indices.set([a,c,b,b,c,d],k);k+=6;}
    return {positions,indices,origin,revision:this.revision};
  }
}
const owners=new Map<number,SurfaceTruth>();
export function surfaceFor(seed:number) {let s=owners.get(seed);if(!s)owners.set(seed,s=new SurfaceTruth(seed));return s;}
