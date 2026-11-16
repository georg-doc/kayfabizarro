import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import crypto from 'node:crypto'
import * as THREE from 'three'
import {createApexPart,PARTS,disposePart} from '../adapters/parts.js'
const lock=JSON.parse(await fs.readFile(new URL('../SOURCE_LOCK.json',import.meta.url)))
for(const f of lock.files){const b=await fs.readFile(new URL('../original/'+f.path,import.meta.url));assert.equal(crypto.createHash('sha256').update(b).digest('hex'),f.sha256)}
let tested=0
for(const kind of Object.keys(PARTS))for(const subdivide of [false,true]){const part=createApexPart(kind,{material:new THREE.MeshStandardMaterial(),subdivide,id:'proof:'+kind}),box=new THREE.Box3().setFromObject(part),size=box.getSize(new THREE.Vector3());assert.ok(size.x>0&&size.y>0&&size.z>0);assert.ok(Math.abs(box.min.y)<.001);assert.equal(part.userData.kfbDonor.source,'micha-ostrowski/apex-drift');assert.equal(part.userData.kfbDonor.subdivided,subdivide);disposePart(part);tested++}
console.log(JSON.stringify({result:'PASS',partContracts:tested,originalSourceHashes:lock.files.length,physicsAdoption:false}))
