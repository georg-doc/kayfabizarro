// Road consumer of the shared exact-triangle contact index.
import * as THREE from 'three';
import {TriangleContact} from '../../core/triangle-contact';
export type {ContactTriangle as KitTriangle} from '../../core/triangle-contact';
export class KitContact extends TriangleContact {
 add(geometry:THREE.BufferGeometry,bridge=false,matrix=new THREE.Matrix4()) {
   const P=geometry.getAttribute('position'),I=geometry.index,v=new THREE.Vector3(),positions=new Float32Array(P.count*3);
   for(let i=0;i<P.count;i++){v.fromBufferAttribute(P,i).applyMatrix4(matrix);positions.set([v.x,v.y,v.z],i*3)}
   this.addArrays(positions,I?.array??null,bridge);
 }
}
