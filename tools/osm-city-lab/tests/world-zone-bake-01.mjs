#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { validateWorldZoneObject,serializeWorldBuilderScene,reloadWorldBuilderScene } from '../../KFB-ToolBox/worldbuilder/world-zone-bake-01/zone-ref.js';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const a=path.resolve(process.argv[2]),b=path.resolve(process.argv[3]);
const fixturePath=path.resolve('tools/KFB-ToolBox/worldbuilder/world-zone-bake-01/fixture.scene.json');
let pass=0;const rows=[];function ok(name,cond,detail=''){if(!cond)throw new Error(`FAIL · ${name}${detail?' · '+detail:''}`);pass++;rows.push({name,status:'PASS',detail});}
const readJson=async(dir,n)=>JSON.parse(await fs.readFile(path.join(dir,n),'utf8'));
const ma=await readJson(a,'MANIFEST.json'),mb=await readJson(b,'MANIFEST.json'),ra=await readJson(a,'BUILD_REPORT.json');
ok('manifest schema',ma.schema==='kfb.world-zone.manifest.v1');
ok('zone id/revision',ma.id==='cologne-dom-zentrum-v0'&&ma.revision==='2026-09-24.1');
ok('reported source hash pinned',ma.source.reportedSourceSha256==='8ab058da444eee7bd54c367aec770bbe10c4bef2ddda636cd95b886f5dca244c');
ok('cached source file hash pinned',ma.source.cachedFileSha256==='5a7d32efe5c83711d189c501d6d93af3b81ecfcea8770ba9592cc9a066b91e7a');
ok('source Git blob pinned',ma.source.sourceBlobSha==='7220dc617782b4db7dfa80e3b3d58e54046eebb4');
ok('normalized hash pinned',ma.source.normalizedSha256==='4fced62a95499aaba0bfbd111da41db8222ef6f507a330f55e1f033b41bb8702');
ok('metre frame',ma.frame.units==='metre'&&ma.frame.axes.x==='east'&&ma.frame.axes.z==='north');
ok('road count',ma.counts.roads===5236&&ma.counts.driveableRoads===2523,String(ma.counts.roads));
ok('building count',ma.counts.buildings===6351,String(ma.counts.buildings));
ok('anchor count',ma.counts.anchors===5,String(ma.counts.anchors));
const required=['source-spec.json','provenance.json','query.overpassql','normalized.json','roads.json','building-semantics.json','anchors.json','visual.glb','support-collision.json','SOURCE.json','MANIFEST.json','BUILD_REPORT.json'];
for(const n of required)ok('package file '+n,(await fs.stat(path.join(a,n))).isFile());
const glb=await fs.readFile(path.join(a,'visual.glb'));ok('GLB magic',glb.readUInt32LE(0)===0x46546c67);ok('GLB version 2',glb.readUInt32LE(4)===2);ok('baked visual non-trivial',glb.length>100000,`${glb.length} bytes`);
const support=await readJson(a,'support-collision.json');ok('support remains undeformed',support.truth==='undeformed-normalized-semantics');ok('support references semantics',support.roadSupports.source==='roads.json#/roads'&&support.buildingObstacles.source==='building-semantics.json#/buildings');
const anchors=await readJson(a,'anchors.json');ok('landmarks stay separate',anchors.landmarkPolicy.externalModulesRemainSeparate===true);ok('Dom source anchor preserved',anchors.anchors.some(x=>x.id==='way/4532022'));
const source=await readJson(a,'SOURCE.json');ok('runtime policy forbids Overpass',/no runtime\/editor Overpass/.test(source.runtimePolicy));
ok('package excludes raw Overpass payload',!(await fs.readdir(a)).includes('source.overpass.json'));
const names=(await fs.readdir(a)).sort(),namesB=(await fs.readdir(b)).sort();ok('deterministic file list',JSON.stringify(names)===JSON.stringify(namesB));
for(const n of names){const [aa,bb]=await Promise.all([fs.readFile(path.join(a,n)),fs.readFile(path.join(b,n))]);ok('deterministic '+n,sha(aa)===sha(bb),sha(aa).slice(0,12));}
ok('build gates all pass',Object.values(ra.gates).every(Boolean));
const fixture=JSON.parse(await fs.readFile(fixturePath,'utf8')),zone=fixture.objects.find(o=>o.kind==='world-zone');ok('WorldBuilder zone ref valid',validateWorldZoneObject(zone));ok('scene stores ref+transform only',!JSON.stringify(zone).includes('footprint')&&!JSON.stringify(zone).includes('centerline')&&!JSON.stringify(zone).includes('vertices'));
const encoded=serializeWorldBuilderScene(fixture),reloaded=reloadWorldBuilderScene(encoded),zone2=reloaded.objects.find(o=>o.kind==='world-zone');ok('save/reload preserves manifest ref',zone2.source.path===zone.source.path&&zone2.source.revision===zone.source.revision);ok('save/reload preserves transform',JSON.stringify(zone2.transform)===JSON.stringify(zone.transform));
const report={schema:'kfb.world-zone.test-report.v1',pass,fail:0,status:'PASS',rows};
console.log(JSON.stringify(report,null,2));
