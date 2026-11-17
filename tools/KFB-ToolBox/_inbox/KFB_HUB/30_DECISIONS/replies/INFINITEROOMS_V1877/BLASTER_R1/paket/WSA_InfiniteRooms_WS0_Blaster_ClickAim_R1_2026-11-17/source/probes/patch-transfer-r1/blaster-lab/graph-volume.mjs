import {TunnelVolume} from '../corner-lab/module/core/volume.mjs';
import {ROOM_SURFACES} from './fracture-surfaces.mjs';
import {holeAt} from './native/cascade/r4/impact-mask.mjs';
// Same native samples and same 12.5 cm bits as the reference implementation.
// A planar sample is shared by its six thickness cells, never resampled per voxel.
export class GraphRoomVolume extends TunnelVolume {
 constructor(){super({cell:.125,nx:52,ny:36,nz:68,chunk:16,z0:0});this.initial=this.bits.slice();this.initialSolid=this.bits.reduce((a,b)=>a+b,0);this.planes=new Map(ROOM_SURFACES.map(r=>[r.name,{columns:this.columns(r),version:null,removed:[]}]));}
 reset(){this.bits.fill(0);for(let y=0;y<this.ny;y++)for(let z=0;z<this.nz;z++)for(let x=0;x<this.nx;x++){const room=z<52&&(x<6||x>=46||z<6||z>=46||y<6||y>=30),door=z>=46&&z<52&&x>=20&&x<32&&y>=6&&y<26,apron=z>=52&&x>=20&&x<32&&y<6;if(room&&!door||apron)this.bits[this.index(x,y,z)]=1;}this.removed=0;return this.keys();}
 columns(r){const axis=r.normal.findIndex(n=>n!==0),lo=axis===0?(r.name==='west'?0:46):axis===1?(r.name==='floor'?0:30):(r.name==='north'?0:46),out=[];
  for(let y=axis===1?lo:0;y<(axis===1?lo+1:this.ny);y++)for(let z=axis===2?lo:0;z<(axis===2?lo+1:52);z++)for(let x=axis===0?lo:0;x<(axis===0?lo+1:this.nx);x++){
   const p=[(x+.5)*this.cell-r.origin[0],(y+.5)*this.cell-r.origin[1],(z+.5)*this.cell-r.origin[2]],u=p.reduce((a,b,i)=>a+b*r.u[i],0)-r.width/2,v=p.reduce((a,b,i)=>a+b*r.v[i],0);if(u< -r.width/2||u>r.width/2||v<0||v>r.height)continue;
   const cells=[];for(let k=0;k<6;k++)cells.push(this.index(axis===0?lo+k:x,axis===1?lo+k:y,axis===2?lo+k:z));out.push({u,v,cells});
  }return out;
 }
 derive(rows){const next=this.initial.slice(),dirty=new Set();let removed=0;
  for(const r of rows){const p=this.planes.get(r.name);if(p.version!==r.field.version){p.removed=[];if(r.field.applied)for(const c of p.columns)if(holeAt(r.field,c.u,c.v))for(const i of c.cells)if(this.initial[i])p.removed.push(i);p.version=r.field.version;}for(const i of p.removed)if(next[i]){next[i]=0;removed++;}}
  const plane=this.nx*this.nz;for(let i=0;i<next.length;i++){if(next[i]===this.bits[i])continue;const y=Math.floor(i/plane),q=i-y*plane,z=Math.floor(q/this.nx),x=q-z*this.nx;dirty.add(this.key(x,y,z));if(x>0)dirty.add(this.key(x-1,y,z));if(x+1<this.nx)dirty.add(this.key(x+1,y,z));if(y>0)dirty.add(this.key(x,y-1,z));if(y+1<this.ny)dirty.add(this.key(x,y+1,z));if(z>0)dirty.add(this.key(x,y,z-1));if(z+1<this.nz)dirty.add(this.key(x,y,z+1));}
  this.bits=next;this.removed=removed;return [...dirty];
 }
 occupiedByReset(p,{radius=.29,height=1.81}={}){const s=this.cell,half=Math.max(0,height/2-radius);for(let y=0;y<this.ny;y++)for(let z=0;z<this.nz;z++)for(let x=0;x<this.nx;x++){const i=this.index(x,y,z);if(!this.initial[i]||this.bits[i])continue;const dx=Math.max(x*s-p.x,0,p.x-(x+1)*s),dy=Math.max(y*s-p.y-half,0,p.y-half-(y+1)*s),dz=Math.max(z*s-p.z,0,p.z-(z+1)*s);if(dx*dx+dy*dy+dz*dz<radius*radius)return true;}return false;}
 info(){return {...super.info(),solid:this.initialSolid-this.removed,shape:'native planar fracture fields, cached exact thickness columns'};}
}
