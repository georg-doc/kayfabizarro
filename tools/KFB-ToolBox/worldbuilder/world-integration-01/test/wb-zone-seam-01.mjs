import fs from 'node:fs';
import assert from 'node:assert/strict';
import { loadZone } from '../wd1-seam.js';

const PIN='3b4909d4c83b704662e66b60212e7f20ba5cf662';
const MANIFEST='https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@'+PIN+'/tools/osm-city-lab/world-zones/cologne-dom-zentrum-v0/2026-09-24.1/MANIFEST.json';
const FIXTURE='tools/KFB-ToolBox/worldbuilder/world-integration-01/fixtures/cologne-dom-crop-v0.json';
const fx=JSON.parse(fs.readFileSync(FIXTURE,'utf8'));
assert.equal(fx.counts.buildings,369,'frozen Cologne fixture pins 369 buildings');
const requests=[];
const nativeFetch=globalThis.fetch;
globalThis.fetch=async(url,opts)=>{requests.push(String(url));return nativeFetch(url,opts);};

let pass=0;
const ok=(name,cond,detail='')=>{assert.ok(cond,name+(detail?' · '+detail:''));pass++;console.log('ok '+pass+' - '+name+(detail?' · '+detail:''));};
const eq=(name,a,b)=>{assert.deepEqual(a,b,name);pass++;console.log('ok '+pass+' - '+name+' · '+JSON.stringify(a));};

const zone=await loadZone({
  kind:'world-zone-bake',
  manifestUrl:MANIFEST,
  presentationData:fx,
  expectedId:'cologne-dom-zentrum-v0',
  expectedRevision:'2026-09-24.1',
  expectedNormalizedBlob:'14d3f09da6e14fb7f5dc9478f78be9f876bffab9',
  crop:{minX:-620,maxX:180,minZ:-300,maxZ:300}
});

eq('baked manifest id',zone.package.id,'cologne-dom-zentrum-v0');
eq('baked revision',zone.package.revision,'2026-09-24.1');
eq('WB contract stores manifest ref + transform only',zone.package.worldBuilderContract.storage,'zone manifest reference + transform only');
eq('crop buildings parity',zone.counts.buildings,fx.counts.buildings);
eq('crop road-parts parity',zone.counts.roadParts,fx.counts.roadParts);
const roadSigZone=zone.roads.map(r=>({
  id:r.id,cls:r.cls,w:r.w,drive:!!r.drive,name:r.name??null,bridge:r.bridge??null,tunnel:r.tunnel??null,
  layer:Number(r.layer||0),area:!!r.area,
  line:r.line.map(p=>[p.x,Object.is(-p.z,-0)?0:-p.z])
})).sort((a,b)=>a.id.localeCompare(b.id));
const roadSigFixture=fx.roads.map(r=>({
  id:r.id,cls:r.cls,w:r.w,drive:!!r.drive,name:r.name??null,bridge:r.bridge??null,tunnel:r.tunnel??null,
  layer:Number(r.layer||0),area:!!r.area,line:r.line
})).sort((a,b)=>a.id.localeCompare(b.id));
assert.deepEqual(roadSigZone,roadSigFixture,'exact frozen road ids + line geometry + metadata');
pass++;console.log('ok '+pass+' - exact frozen road ids + line geometry + metadata · '+roadSigZone.length+' roads');
eq('crop landuse parity',zone.counts.landuse,fx.counts.landuse);
const landSigZone=zone.landuse.map(l=>({
  id:l.id,cls:l.cls,
  poly:l.poly.map(p=>[p.x,Object.is(-p.z,-0)?0:-p.z])
})).sort((a,b)=>a.id.localeCompare(b.id));
const landSigFixture=fx.landuse.map(l=>({id:l.id,cls:l.cls,poly:l.poly})).sort((a,b)=>a.id.localeCompare(b.id));
assert.deepEqual(landSigZone,landSigFixture,'exact frozen landuse ids + polygon geometry + class');
pass++;console.log('ok '+pass+' - exact frozen landuse ids + polygon geometry + class · '+landSigZone.length+' surfaces');
eq('crop water parity',zone.counts.water,fx.counts.water);
const waterSigZone=zone.water.map(l=>({
  id:l.id,cls:l.cls,
  poly:l.poly.map(p=>[p.x,Object.is(-p.z,-0)?0:-p.z])
})).sort((a,b)=>a.id.localeCompare(b.id));
const waterSigFixture=fx.water.map(l=>({id:l.id,cls:l.cls,poly:l.poly})).sort((a,b)=>a.id.localeCompare(b.id));
assert.deepEqual(waterSigZone,waterSigFixture,'exact frozen water ids + clipped polygon geometry');
pass++;console.log('ok '+pass+' - exact frozen water ids + clipped polygon geometry · '+waterSigZone.length+' surfaces');
eq('exact building id set survives bake→crop',zone.buildings.map(x=>x.id).sort(),fx.buildings.map(x=>x.id).sort());
eq('protected Dom id retained',zone.landmark.id,fx.landmark.id);
eq('presentation railway count retained',zone.railways.length,fx.railways.length);
eq('Hbf presentation axis retained',zone.hbf.axisDeg,fx.hbf.axisDeg);
eq('historical Track conflicts are deferred, not active',zone.conflicts.size,0);
eq('all eight historical Track conflicts remain named',zone.deferredTrackConflicts.length,8);
eq('heightAt uses baked support ground',zone.heightAt(13,-21),zone.heightAtSource.ground.y);
ok('heightAt source is WORLD-ZONE support contract',zone.heightAtSource.schema==='kfb.world-zone.support-collision.v1'&&zone.heightAtSource.truth==='undeformed-normalized-semantics');
ok('no runtime Overpass request',requests.every(u=>!/overpass|api\.openstreetmap/i.test(u)),requests.join(' | '));
ok('only baked package network files requested',requests.length===3&&requests.every(u=>u.startsWith('https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@'+PIN+'/')),requests.join(' | '));
ok('baked source is materially larger than the presentation crop',zone.sourceCounts.buildings>zone.counts.buildings&&zone.sourceCounts.roads>zone.counts.roadParts);

console.log('WB-ZONE-SEAM-01 PASS '+pass+'/'+pass);
