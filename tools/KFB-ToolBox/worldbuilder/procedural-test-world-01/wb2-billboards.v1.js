/* Actual Clay Billboard consumer: geometry/compositor/scheduler stay native. WB2 owns frame/edit/support. */
import * as THREE from 'three';
import {Billboard,BillboardScheduler,makeClayFamily,loadContent} from '../../_inbox/KFB_WORLD_BILLBOARD_CLAY01_CLAUDE_DESIGN_SESSION_CUT_2026-10-01_r1/briefd/billboard-clay.js';
export const BILLBOARD_SOURCE={commit:'9c2fee62b815f19cf967867f54985bd22e3f222b',path:'tools/KFB-ToolBox/_inbox/KFB_WORLD_BILLBOARD_CLAY01_CLAUDE_DESIGN_SESSION_CUT_2026-10-01_r1/briefd/billboard-clay.js',blobSha:'751b69099ceaad0c1cb2147dc38e6a538840a8a4'};
let specPromise,family;const poolCache=new Map();
const spec=()=>specPromise||(specPromise=fetch(new URL('../../_inbox/KFB_WORLD_BILLBOARD_CLAY01_CLAUDE_DESIGN_SESSION_CUT_2026-10-01_r1/billboard.embed-spec.v1.json',import.meta.url)).then(r=>{if(!r.ok)throw Error('Required Clay Billboard spec missing');return r.json()}));
async function fonts(){const dir='https://raw.githubusercontent.com/georg-doc/kayfabizarro/'+BILLBOARD_SOURCE.commit+'/tools/KFB-ToolBox/_inbox/KFB_WORLD_BILLBOARD_CLAY01_CLAUDE_DESIGN_SESSION_CUT_2026-10-01_r1/';await Promise.all([['KFBDisplay','CCClobberinTime-Krackle.otf'],['KFBHand','Baby_Eliot.ttf']].map(async([name,file])=>{const f=new FontFace(name,'url('+dir+'fonts/'+file+')');document.fonts.add(await f.load())}));}
const fontReady=fonts();
async function imagePool(worldId,cards){if(poolCache.has(worldId))return poolCache.get(worldId);let cv,path,blob;
 if(worldId==='world.kfb-town'){path='media/kfb/KayfaBizarro_Card_Backside_01.png';blob='d63c82eda4b26c3220ed389cd0310d959cb734b1';const img=new Image();img.crossOrigin='anonymous';await new Promise((ok,no)=>{img.onload=ok;img.onerror=()=>no(Error('Canonical Card Back missing'));img.src='https://raw.githubusercontent.com/georg-doc/kayfabizarro/'+BILLBOARD_SOURCE.commit+'/'+path});cv=img;}
 else{const deck={'world.dystopia':'ignore_dystopia','world.utopia':'forget_utopia','world.protopia':'embrace_protopia'}[worldId];cv=await cards.builder.renderDeckCover(deck);path=cards.builder.decks.find(d=>d.packId===deck).pdf;blob={'world.dystopia':'432416a81a42eca6440711597f22bd667c2d9cca','world.utopia':'ab373a2c19e1ebc1694143d218037152853477cf','world.protopia':'ec7c6001fcd276685647a14a4146061224faabd7'}[worldId];}
 const pool={imgs:[{img:cv,w:cv.width||cv.naturalWidth,h:cv.height||cv.naturalHeight,path,blob}],skipped:[],ms:0};poolCache.set(worldId,pool);return pool;}
export async function createWorldBillboard(worldId,{cards,renderer,original=false}={}){
 await fontReady;const source=await spec(),s=structuredClone(source),parent=new THREE.Group();
 const pool=original?await loadContent(source.contentAsset):await imagePool(worldId,cards);if(!pool.imgs.length)throw Error('Required Billboard content missing');
 s.id='billboard.'+worldId.replace('world.','').replace('kfb-','');s.seed=s.id+'#3';s.position=[0,0,0];s.rotation=[0,0,0];s.islandAnchor={mode:'local',x:0,z:0,yawDeg:0,groundSnap:{mode:'flat'}};
 if(!family)family=makeClayFamily('wb2-billboards',{uClayNear:{value:s.lod.clay.nearM},uClayFar:{value:s.lod.clay.farM},uClayScale:{value:2.6},uClayAmt:{value:.4}});
 const bb=new Billboard(s,{parent,island:{H:()=>0,biome:null},pool,bodyMat:family.std('#ffffff',.88,{vertexColors:true}),aniso:renderer.capabilities.getMaxAnisotropy()});
 parent.userData.sourceRecord={assetId:s.id,packId:'KFB Clay Billboard',source:BILLBOARD_SOURCE,content:pool.imgs.map(({path,blob})=>({path,blob}))};
 const scheduler=new BillboardScheduler();scheduler.list.push(bb);scheduler.prime(performance.now());
 if(!original){const c=bb.ctx,img=pool.imgs[0].img,W=bb.cv.width,H=bb.cv.height,k=Math.min(W/(img.width||img.naturalWidth),H/(img.height||img.naturalHeight)),w=(img.width||img.naturalWidth)*k,h=(img.height||img.naturalHeight)*k;c.fillStyle=bb.pal.paper;c.fillRect(0,0,W,H);c.drawImage(img,(W-w)/2,(H-h)/2,w,h);bb.tex.needsUpdate=true;bb.next=performance.now()+2500;}
 return{root:parent,update(dt,clock){parent.updateMatrixWorld(true);bb.center.copy(bb.face.getWorldPosition(new THREE.Vector3()));if(clock?.camera)scheduler.tick(performance.now(),clock.camera);},evidence:()=>({source:BILLBOARD_SOURCE,id:s.id,nativeFaceSize:s.faceSize,content:parent.userData.sourceRecord.content,updates:bb.updates,lod:bb.lod,loop:'native Clay kaleido-cuts',owner:'WB2 frame / native BillboardScheduler'}),dispose:()=>bb.dispose()};
}
