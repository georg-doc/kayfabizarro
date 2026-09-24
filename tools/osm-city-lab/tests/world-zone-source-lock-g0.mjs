#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { normalizeOverpass } from '../src/osm/normalize.js';

const cityId=process.argv[2]||'dom-zentrum-v0';
if(!/^[a-z0-9-]+$/.test(cityId))throw new Error('invalid city id');

const root=process.cwd();
const lab=path.join(root,'tools/osm-city-lab');
const data=path.join(lab,'data',cityId);
const locksPath=path.join(lab,'src/world-zone/source-locks.json');

const [rawBuf,normBuf,specText,provText,locksText]=await Promise.all([
  fs.readFile(path.join(data,'source.overpass.json')),
  fs.readFile(path.join(data,'normalized.json')),
  fs.readFile(path.join(data,'SOURCE_SPEC.json'),'utf8'),
  fs.readFile(path.join(data,'PROVENANCE.json'),'utf8'),
  fs.readFile(locksPath,'utf8')
]);

const spec=JSON.parse(specText);
const provenance=JSON.parse(provText);
const locks=JSON.parse(locksText);
const lock=locks.datasets?.[cityId];
if(!lock)throw new Error('missing source lock for '+cityId);

const sha256=value=>crypto.createHash('sha256').update(value).digest('hex');
const gitBlobSha=buf=>{
  const header=Buffer.from('blob '+buf.length+'\0');
  return crypto.createHash('sha1').update(header).update(buf).digest('hex');
};
const payloadText=buf=>{
  const s=buf.toString('utf8');
  return s.endsWith('\n')?s.slice(0,-1):s;
};

let pass=0;
const rows=[];
function ok(name,condition,detail=''){
  if(!condition)throw new Error('FAIL · '+name+(detail?' · '+detail:''));
  pass++;
  rows.push({name,status:'PASS',detail});
}

const rawFileSha=sha256(rawBuf);
const rawPayload=payloadText(rawBuf);
const rawPayloadSha=sha256(rawPayload);
const normFileSha=sha256(normBuf);
const normPayload=payloadText(normBuf);
const normPayloadSha=sha256(normPayload);

ok('source Git blob lock',gitBlobSha(rawBuf)===lock.sourceBlobSha,gitBlobSha(rawBuf));
ok('source file-byte SHA lock',rawFileSha===lock.cachedFileSha256,rawFileSha);
ok('source payload SHA lock',rawPayloadSha===lock.reportedSourceSha256,rawPayloadSha);
ok('provenance source SHA agrees',provenance.sourceSha256===lock.reportedSourceSha256,provenance.sourceSha256);
ok('source JSON canonical payload',JSON.stringify(JSON.parse(rawPayload))===rawPayload);

ok('normalized Git blob lock',gitBlobSha(normBuf)===lock.normalizedBlobSha,gitBlobSha(normBuf));
ok('normalized file-byte SHA lock',normFileSha===lock.cachedNormalizedFileSha256,normFileSha);
ok('normalized payload SHA lock',normPayloadSha===lock.reportedNormalizedSha256,normPayloadSha);
ok('normalized JSON canonical payload',JSON.stringify(JSON.parse(normPayload))===normPayload);

const raw=JSON.parse(rawPayload);
const normalizedA=normalizeOverpass(raw,spec,provenance);
const normalizedB=normalizeOverpass(raw,spec,provenance);
const deterministicA=JSON.stringify(normalizedA);
const deterministicB=JSON.stringify(normalizedB);

ok('normalization deterministic',deterministicA===deterministicB);
ok('rebuild payload hash equals locked normalized payload',sha256(deterministicA)===lock.reportedNormalizedSha256,sha256(deterministicA));
ok('rebuild payload equals committed normalized payload',deterministicA===normPayload);
ok('metre frame preserved',normalizedA.frame?.units==='metre'&&normalizedA.frame?.axes?.x==='east'&&normalizedA.frame?.axes?.z==='north');
ok('feature counts preserved',
  normalizedA.features.roads.length===5236 &&
  normalizedA.features.roads.filter(r=>r.driveable).length===2523 &&
  normalizedA.features.buildings.length===6351 &&
  normalizedA.features.landuse.length===456 &&
  normalizedA.features.waterLines.length===6,
  JSON.stringify(normalizedA.diagnostics.featureCounts)
);

const report={
  schema:'kfb.world-zone.source-lock-g0-report.v1',
  id:cityId,
  status:'PASS',
  pass,
  fail:0,
  source:{
    blobSha:gitBlobSha(rawBuf),
    fileSha256:rawFileSha,
    payloadSha256:rawPayloadSha
  },
  normalized:{
    blobSha:gitBlobSha(normBuf),
    fileSha256:normFileSha,
    payloadSha256:normPayloadSha
  },
  counts:{
    roads:normalizedA.features.roads.length,
    driveableRoads:normalizedA.features.roads.filter(r=>r.driveable).length,
    buildings:normalizedA.features.buildings.length,
    landuse:normalizedA.features.landuse.length,
    waterLines:normalizedA.features.waterLines.length
  },
  runtimeNetworkRequests:0,
  worldZoneCompileExecuted:false,
  rows
};
console.log(JSON.stringify(report,null,2));
