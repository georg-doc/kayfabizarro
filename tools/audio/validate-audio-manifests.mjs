import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const ROOT=path.resolve(new URL('../..', import.meta.url).pathname);
const AUDIO_EXT=new Set(['.ogg','.wav','.mp3','.m4a','.flac','.aac','.aif','.aiff']);

function readJson(rel){
  const abs=path.join(ROOT,rel);
  return JSON.parse(fs.readFileSync(abs,'utf8'));
}
function collectAssetRefs(value,out=[]){
  if(typeof value==='string'){
    if(AUDIO_EXT.has(path.extname(value).toLowerCase())) out.push(value);
  }else if(Array.isArray(value)){
    for(const v of value) collectAssetRefs(v,out);
  }else if(value&&typeof value==='object'){
    for(const v of Object.values(value)) collectAssetRefs(v,out);
  }
  return [...new Set(out)];
}
function checkRefs(label,rel){
  const refs=collectAssetRefs(readJson(rel));
  const missing=refs.filter(ref=>!fs.existsSync(path.join(ROOT,ref)));
  return {label,manifest:rel,total:refs.length,passed:refs.length-missing.length,missing};
}
function walkAudio(dir,out=[]){
  for(const ent of fs.readdirSync(dir,{withFileTypes:true})){
    const abs=path.join(dir,ent.name);
    if(ent.isDirectory()) walkAudio(abs,out);
    else if(AUDIO_EXT.has(path.extname(ent.name).toLowerCase())) out.push(abs);
  }
  return out;
}

const reports=[
  checkRefs('shared-sfx','media/3D_Assets/Audio/sfx.json'),
  checkRefs('ui-sfx','media/3D_Assets/Audio/ui-sfx.json'),
  checkRefs('audio-jukebox','media/3D_Assets/Audio/jukebox.json'),
  checkRefs('kfb-jukebox','media/3D_Assets/Sounds/jukebox.json'),
];

const catalog=readJson('media/3D_Assets/CATALOG/audio-catalog.json');
const audioFiles=walkAudio(path.join(ROOT,'media/3D_Assets/Audio'));
const soundFiles=walkAudio(path.join(ROOT,'media/3D_Assets/Sounds'));
const actualTotal=audioFiles.length+soundFiles.length;
const catalogCheck={
  label:'audio-catalog',
  passed:Number(catalog.total_files===actualTotal && catalog.roots?.Audio===audioFiles.length && catalog.roots?.Sounds===soundFiles.length),
  total:1,
  actual:{total_files:actualTotal,Audio:audioFiles.length,Sounds:soundFiles.length},
  catalog:{total_files:catalog.total_files,Audio:catalog.roots?.Audio,Sounds:catalog.roots?.Sounds}
};
reports.push(catalogCheck);

let failures=0;
for(const r of reports){
  if(r.missing?.length || r.passed!==r.total) failures++;
}
const summary={
  status:failures?'FAIL':'PASS',
  checks:reports.length,
  failures,
  reports
};
console.log(JSON.stringify(summary,null,2));
if(failures) process.exit(1);
