// Fetch only pinned existing donors; no provider generation, credentials or browser automation.
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const pin='904f0e95968999c7e8af77cc6667161bd4f3f788';
const out=new URL('../dist/footsteps/assets/',import.meta.url);await mkdir(out,{recursive:true});
const rows=[];
function add(file,path,license){rows.push({file,path,license});}
const audio='media/3D_Assets/Audio/';
for(let i=0;i<5;i++)add(`grass-${i}.ogg`,`${audio}kenney_impact-sounds/Audio/footstep_grass_00${i}.ogg`,'CC0-1.0');
for(const surface of ['concrete','gravel'])for(let i=1;i<=4;i++)add(`${surface}-${i}.wav`,`${audio}Footsteps/foley_footstep_${surface}_${i}.wav`,'Chequered Ink asset licence');
for(let i=0;i<2;i++)add(`land-${i}.ogg`,`${audio}kenney_impact-sounds/Audio/impactSoft_heavy_00${i}.ogg`,'CC0-1.0');
const pack='media/3D_Assets/KayKit_Character_Animations_1.1/';
add('Mannequin_Medium.glb',`${pack}Mannequin Character/characters/Mannequin_Medium.glb`,'CC0-1.0');
for(const set of ['General','MovementBasic'])add(`${set}.glb`,`${pack}Animations/gltf/Rig_Medium/Rig_Medium_${set}.glb`,'CC0-1.0');
add('KayKit-License.txt',`${pack}License.txt`,'CC0-1.0');
for(const row of rows){const url=`https://raw.githubusercontent.com/georg-doc/kayfabizarro/${pin}/${row.path.split('/').map(encodeURIComponent).join('/')}`;let b;try{b=await readFile(new URL(row.file,out));}catch{const r=await fetch(url);if(!r.ok)throw Error(`${r.status}: ${row.path}`);b=Buffer.from(await r.arrayBuffer());await writeFile(new URL(row.file,out),b);}row.bytes=b.length;row.gitBlob=createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex');row.url=url;console.log(row.file,row.bytes,row.gitBlob);}
await writeFile(new URL('../sources.json',out),JSON.stringify({schema:'kfb.audio.footstep-donors/1',pin,rows},null,2)+'\n');
