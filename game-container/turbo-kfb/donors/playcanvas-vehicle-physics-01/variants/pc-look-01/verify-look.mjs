import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const DONOR='game-container/turbo-kfb/donors/playcanvas-vehicle-physics-01/static';
const LOOK='game-container/turbo-kfb/donors/playcanvas-vehicle-physics-01/variants/pc-look-01/static';
const OUT='playcanvas-look-01-local-proof';
await fs.mkdir(OUT,{recursive:true});

const walk=async root=>{
  const out=[];
  const rec=async rel=>{
    for(const ent of await fs.readdir(path.join(root,rel),{withFileTypes:true})){
      const r=path.join(rel,ent.name);
      if(ent.isDirectory()) await rec(r); else out.push(r.replaceAll('\\','/'));
    }
  };
  await rec('');
  return out.sort();
};
const sha=async p=>crypto.createHash('sha256').update(await fs.readFile(p)).digest('hex');
const donorFiles=await walk(DONOR);
const lookFiles=await walk(LOOK);
const nonConfig=donorFiles.filter(x=>x!=='config.json');
const fileSetEqual=JSON.stringify(donorFiles)===JSON.stringify(lookFiles);
const hashMismatches=[];
for(const rel of nonConfig){
  const [a,b]=await Promise.all([sha(path.join(DONOR,rel)),sha(path.join(LOOK,rel))]);
  if(a!==b) hashMismatches.push({rel,a,b});
}

const donor=JSON.parse(await fs.readFile(path.join(DONOR,'config.json'),'utf8'));
const look=JSON.parse(await fs.readFile(path.join(LOOK,'config.json'),'utf8'));
const ids=['52417947','52417948','52417949','52417952','52417961','52418068'];
const allowedFields=new Set(['diffuse','diffuseMapTint','specular','shininess','reflectivity','bumpMapFactor','useMetalness','metalness']);
const diffs=[];
const diff=(a,b,p='')=>{
  if(Object.is(a,b)) return;
  if(Array.isArray(a)&&Array.isArray(b)){
    const n=Math.max(a.length,b.length);
    for(let i=0;i<n;i++) diff(a[i],b[i],p+'['+i+']');
    return;
  }
  if(a&&b&&typeof a==='object'&&typeof b==='object'){
    for(const k of new Set([...Object.keys(a),...Object.keys(b)])) diff(a[k],b[k],p?(p+'.'+k):k);
    return;
  }
  diffs.push({path:p,donor:a,look:b});
};
diff(donor,look);
const allowedDiff=d=>{
  const m=d.path.match(/^assets\.([0-9]+)\.data\.([^.\[]+)/);
  return Boolean(m&&ids.includes(m[1])&&allowedFields.has(m[2]));
};
const forbiddenDiffs=diffs.filter(d=>!allowedDiff(d));

const expected={
  '52417947':'#f2b632','52417948':'#5983ac','52417949':'#2e2c3a',
  '52417952':'#e2d0bc','52417961':'#e2d0bc','52418068':'#f0cf7e'
};
const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255);
const close=(a,b)=>Math.abs(a-b)<1e-6;
const profilesOk=ids.every(id=>{
  const d=look.assets[id].data, e=hex(expected[id]);
  return d.useMetalness===false && d.metalness===0 && d.diffuseMapTint===true &&
    e.every((v,i)=>close(v,d.diffuse[i]));
});
const textureMapsPreserved=ids.every(id=>{
  const a=donor.assets[id].data,b=look.assets[id].data;
  return a.diffuseMap===b.diffuseMap && a.normalMap===b.normalMap &&
    a.specularMap===b.specularMap && a.opacityMap===b.opacityMap;
});

const checks=[
  ['same runtime file set',fileSetEqual],
  ['42 donor runtime files',donorFiles.length===42],
  ['42 look runtime files',lookFiles.length===42],
  ['41 non-config blobs byte-identical',nonConfig.length===41&&hashMismatches.length===0],
  ['config changed',await sha(path.join(DONOR,'config.json'))!==await sha(path.join(LOOK,'config.json'))],
  ['only six material assets changed',new Set(diffs.map(d=>d.path.match(/^assets\.([0-9]+)/)?.[1]).filter(Boolean)).size===6],
  ['no forbidden config delta',forbiddenDiffs.length===0],
  ['K2 palette profile exact',profilesOk],
  ['original diffuse/normal/spec/opacity map ids preserved',textureMapsPreserved],
  ['application properties unchanged',JSON.stringify(donor.application_properties)===JSON.stringify(look.application_properties)],
  ['scenes unchanged',JSON.stringify(donor.scenes)===JSON.stringify(look.scenes)],
  ['asset count unchanged',Object.keys(donor.assets).length===Object.keys(look.assets).length]
];
const report={schema:'kfb.pc-look-01.source-proof/1',donorFiles:donorFiles.length,lookFiles:lookFiles.length,
  changedConfigPaths:diffs.map(d=>d.path),hashMismatches,forbiddenDiffs,checks};
await fs.writeFile(OUT+'/source.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
for(const [name,ok] of checks) if(!ok) throw new Error(name+' failed');
console.log('SOURCE CHECKS '+checks.length+'/'+checks.length+' PASS');
