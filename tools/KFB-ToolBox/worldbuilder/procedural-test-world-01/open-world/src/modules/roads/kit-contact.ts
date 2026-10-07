// Spatial index of the pinned kit's actual solid triangles. No road profile is reconstructed here.
import * as THREE from 'three';
export interface KitTriangle { id:string; p:number[]; bounds:[number,number,number,number]; bridge:boolean }
export class KitContact {
 readonly triangles:KitTriangle[]=[];
 private bins=new Map<string,KitTriangle[]>();
 constructor(readonly id:string) {}
 add(geometry:THREE.BufferGeometry,bridge=false,matrix=new THREE.Matrix4()) {
   const P=geometry.getAttribute('position'),I=geometry.index,v=new THREE.Vector3();
   for(let k=0;k<(I?.count??P.count);k+=3) {
     const p:number[]=[];for(let j=0;j<3;j++){v.fromBufferAttribute(P,I?I.getX(k+j):k+j).applyMatrix4(matrix);p.push(v.x,v.y,v.z);}
     const minX=Math.min(p[0],p[3],p[6]),maxX=Math.max(p[0],p[3],p[6]),minZ=Math.min(p[2],p[5],p[8]),maxZ=Math.max(p[2],p[5],p[8]);
     // Vertical walls have no support projection; they remain solid in Rapier.
     if(Math.abs((p[3]-p[0])*(p[8]-p[2])-(p[6]-p[0])*(p[5]-p[2]))<1e-10)continue;
     const t={id:this.id+'/'+k,p,bounds:[minX,minZ,maxX,maxZ] as [number,number,number,number],bridge};this.triangles.push(t);
     for(let z=Math.floor(minZ/20);z<=Math.floor(maxZ/20);z++)for(let x=Math.floor(minX/20);x<=Math.floor(maxX/20);x++){const key=x+','+z;let b=this.bins.get(key);if(!b)this.bins.set(key,b=[]);b.push(t);}
   }
 }
 heightAt(x:number,z:number,includeBridge=true):number|null {
   let y:number|null=null;for(const t of this.bins.get(Math.floor(x/20)+','+Math.floor(z/20))??[]) {
     if(!includeBridge&&t.bridge)continue;const p=t.p;
     const ax=p[0],az=p[2],bx=p[3],bz=p[5],cx=p[6],cz=p[8],d=(bx-ax)*(cz-az)-(cx-ax)*(bz-az);
     const u=((x-ax)*(cz-az)-(cx-ax)*(z-az))/d,v=((bx-ax)*(z-az)-(x-ax)*(bz-az))/d;
     if(u < -1e-7||v < -1e-7||u+v>1+1e-7)continue;
     const h=p[1]+u*(p[4]-p[1])+v*(p[7]-p[1]);if(y===null||h>y)y=h;
   }return y;
 }
}
