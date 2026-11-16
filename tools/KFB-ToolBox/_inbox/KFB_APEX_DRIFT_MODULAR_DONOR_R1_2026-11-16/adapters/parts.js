// KFB modular extraction/adaptation of micha-ostrowski/apex-drift, MIT.
// Source224734fe7a064a5483f2c8c6bf3ca8a8d0676d82, original/src/scenery.js.
// Originals remain untouched. Source dimensions/material defaults retained; factories
// add ground anchors, stable metadata, optional subdivisions and existing KFB bend.
import * as THREE from 'three'
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js'
import * as textures from '../original/src/textures.js'
import {applyCartoonDeform} from './vendor/kfb-cartoon-deform.js'
export const PARTS=Object.freeze({container:{size:[12.2,2.6,2.44],lines:[127,154]},warehouse:{size:[46,12,22],lines:[238,258]},hangar:{size:[60,14,34],lines:[333,345]},crane:{size:[135,53,22],lines:[207,237]},lamp:{size:[5,9.07,.5],lines:[155,178]}})
const box=(w,h,d,n=1)=>new THREE.BoxGeometry(w,h,d,Math.max(1,Math.ceil(w/4))*n,Math.max(1,Math.ceil(h/3))*n,Math.max(1,Math.ceil(d/4))*n)
function mesh(g,m){const o=new THREE.Mesh(g,m);o.castShadow=true;o.receiveShadow=true;return o}
export function createApexPart(kind,{id=kind,material=null,color=null,subdivide=false}={}) {
 if(!PARTS[kind])throw Error('Unknown Apex part '+kind)
 const root=new THREE.Group();root.name='kfb-apex:'+id;const n=subdivide?1:0,geometry=(w,h,d)=>n?box(w,h,d):new THREE.BoxGeometry(w,h,d)
 if(kind==='container'){const mat=material??new THREE.MeshStandardMaterial({map:textures.containerSide(),roughness:.62,metalness:.45});if(color)mat.color.set(color);root.add(mesh(geometry(12.2,2.6,2.44).translate(0,1.3,0),mat))}
 if(kind==='warehouse'){const win=material?null:textures.windows(),mat=material??new THREE.MeshStandardMaterial({map:win,roughness:.8,emissiveMap:win,emissive:new THREE.Color('#fff'),emissiveIntensity:.9});root.add(mesh(geometry(46,12,22).translate(0,6,0),mat))}
 if(kind==='hangar'){const mat=material??new THREE.MeshStandardMaterial({color:'#a9b0b6',metalness:.4,roughness:.6});root.add(mesh(geometry(60,14,34).translate(0,7,0),mat))}
 if(kind==='crane'){const mat=material??new THREE.MeshStandardMaterial({color:'#2f3a4c',metalness:.5,roughness:.55}),parts=[geometry(2,46,2).translate(-18,23,-9),geometry(2,46,2).translate(-18,23,9),geometry(2,46,2).translate(18,23,-9),geometry(2,46,2).translate(18,23,9),geometry(40,3,22).translate(0,46,0),geometry(90,3,4).translate(30,50,0),geometry(2,22,2).translate(70,40,0)];root.add(mesh(mergeGeometries(parts),mat));for(const g of parts)g.dispose()}
 if(kind==='lamp'){const mat=material??new THREE.MeshStandardMaterial({color:'#2b2e36',metalness:.5,roughness:.5}),parts=[new THREE.CylinderGeometry(.14,.2,9,8,subdivide?8:1).translate(0,4.5,0),geometry(4.6,.14,.14).translate(-2.3,9,0)];root.add(mesh(mergeGeometries(parts),mat));for(const g of parts)g.dispose();root.add(mesh(geometry(1.1,.12,.5).translate(-4.4,8.9,0),new THREE.MeshBasicMaterial({color:new THREE.Color('#ffd9a0').multiplyScalar(5)})))}
 root.userData.kfbDonor={id,kind,source:'micha-ostrowski/apex-drift',head:'224734fe7a064a5483f2c8c6bf3ca8a8d0676d82',license:'MIT',adaptation:'individual factory,ground anchor,optional subdivisions',subdivided:subdivide}
 return root
}
// Existing kit-preserving KFB deformation handle; the receiving host owns updates.
// Visual shader deformation DOES NOT silently rewrite colliders. Use the canonical
// S5/Elastic-Grotesque owner for an accepted physical/exported building adaptation.
export function bindExistingKfbBend(root,options={}) {return applyCartoonDeform(THREE,root,options)}
// Input must already be approved by Hypernormalisation Curator (use=true/bake).
// No new collage engine, renderer, audio context or private H16-media download.
export function approvedFacadeTexture(canvasOrFrame) {const t=canvasOrFrame?.getContext?new THREE.CanvasTexture(canvasOrFrame):new THREE.Texture(canvasOrFrame);t.colorSpace=THREE.SRGBColorSpace;t.needsUpdate=true;return t}
export function addApprovedFacade(root,texture,{width=40,height=9,z=11.02,y=6}={}){const face=mesh(new THREE.PlaneGeometry(width,height,12,6),new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide}));face.name='approved-hypernorm-facade';face.position.set(0,y,z);root.add(face);return face}
export function disposePart(root){root.removeFromParent();root.traverse(o=>{if(o.isMesh){o.geometry.dispose();for(const m of [].concat(o.material)){m.map?.dispose();m.emissiveMap?.dispose();m.dispose()}}})}
