import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT=process.cwd();
const BASE='tools/KFB-ToolBox/stage-first/music-performance-01';
const read=(p)=>fs.readFileSync(path.join(ROOT,p));
const json=(p)=>JSON.parse(read(p).toString('utf8'));
const gitBlobSha=(buf)=>crypto.createHash('sha1').update(Buffer.from('blob '+buf.length+'\0')).update(buf).digest('hex');

const checks=[];
function ok(name,pass,detail=''){checks.push({name,pass:!!pass,detail});if(!pass)throw new Error(name+' · '+detail);}

const source=json(BASE+'/SOURCE.json');
const recipe=json(BASE+'/performance-recipe.json');
const donor=json(BASE+'/donor/orb_module_source.json');
const runtime=read(BASE+'/music-performance-01.js').toString('utf8');
const html=read(BASE+'/index.html').toString('utf8');
const coherent=read('tools/KFB-ToolBox/stage-first/coherent-integration-01.js').toString('utf8');

ok('source schema',source.schema==='kfb.music-performance-source/1',source.schema);
ok('recipe schema',recipe.schema==='kfb.resident-performance.v1',recipe.schema);
ok('single song ref',!!recipe.songRef && !recipe.performers.some(p=>p.songRef),JSON.stringify(recipe.performers));
ok('100 BPM',recipe.timing.bpm===100,recipe.timing.bpm);
ok('phase 0.465',recipe.timing.phaseOffsetSec===0.465,recipe.timing.phaseOffsetSec);
ok('bar offset explicit',Number.isInteger(recipe.timing.barOffset),recipe.timing.barOffset);
ok('markers 0..32',recipe.markers.startBeat===0&&recipe.markers.loopStartBeat===0&&recipe.markers.loopEndBeat===32&&recipe.markers.finishBeat===32,JSON.stringify(recipe.markers));
ok('leader accepted',recipe.performers.find(p=>p.id==='leader')?.humanResult==='PASS');
ok('guitarist accepted',recipe.performers.find(p=>p.id==='guitarist')?.humanResult==='PASS');
ok('drummer HOLD disabled',recipe.performers.find(p=>p.id==='drummer')?.humanResult==='HOLD'&&recipe.performers.find(p=>p.id==='drummer')?.enabled===false);
ok('action refs source-backed',recipe.performers.every(p=>donor.clips.some(c=>c.name===p.choreography.actionRef)),recipe.performers.map(p=>p.choreography.actionRef).join(','));
ok('source isolation required',recipe.sourceObject.isolationRequired===true);
ok('donor identity exact',donor.id===recipe.sourceObject.residentModuleId&&donor.version===recipe.sourceObject.version,donor.id+' '+donor.version);
ok('donor GLB exact blob',gitBlobSha(read(BASE+'/donor/orb_band_module_v5.glb'))===recipe.sourceObject.glbBlob,gitBlobSha(read(BASE+'/donor/orb_band_module_v5.glb')));
ok('donor metadata exact blob',gitBlobSha(read(BASE+'/donor/orb_module_source.json'))===source.donor.moduleJsonBlob,gitBlobSha(read(BASE+'/donor/orb_module_source.json')));
ok('song exact blob',gitBlobSha(read(BASE+'/audio/rubbish_groove.mp3'))===recipe.songRef.blob,gitBlobSha(read(BASE+'/audio/rubbish_groove.mp3')));
ok('one preview audio element',(html.match(/<audio\b/g)||[]).length===1,(html.match(/<audio\b/g)||[]).length);
ok('no per-performer Audio constructor',!runtime.includes('new Audio('));
ok('song is master clock',runtime.includes('function beatPos()')&&runtime.includes('audio.currentTime'));
ok('no second motion catalogue',source.motionLibrary.status==='OWNER_PRESERVED');
ok('ToolBox Music entry present',coherent.includes("id:'kfb-ci-music'")&&coherent.includes("./music-performance-01/"));
ok('build marker',html.includes('data-kfb-build="MUSIC-PERF-01-v1"'));

console.log(JSON.stringify({status:'PASS',count:checks.length,checks},null,2));
