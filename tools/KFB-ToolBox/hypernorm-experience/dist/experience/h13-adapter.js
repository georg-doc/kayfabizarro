import {H13Engine,POOL,TEXTS,CTX,W,H} from './vendor/h13-engine.js';
export async function createH13(canvas,recipes,assets){
 const e=new H13Engine({bpm:125,candidates:10,grain:.1,kfbShare:0,palSource:'RANDOM',typeShadow:true,genShare:0});
 Object.assign(e,{imgs:{},failed:{},cache:new Map(),ready:false,frame:0,fps:0,lastInfo:0,lastSave:0,grainPats:new WeakMap(),all:[],pool:[],films:[],genCards:[],kfb:{ms:[],loading:false,cards:0,motifs:0},pd:{loaded:0,rows:0},_seed:738,_ctx:'POLITICAL',faceEl:canvas});
 for(const name of ['off','tmp','bufA','bufB','noiseSrc']){e[name]=document.createElement('canvas');e[name].width=W;e[name].height=H;}
 canvas.width=W;canvas.height=H;
 // The donor's unmodified shot planner, simScore and paint own the collage.
 // Only its Design UI lifecycle/network discovery/audio owner are adapted.
 const loaded=await Promise.all(POOL.slice(0,12).map(p=>new Promise(resolve=>{const im=new Image();im.crossOrigin='anonymous';im.onload=()=>resolve({...p,image:im,src:'loc'});im.onerror=()=>resolve(null);im.src='./archive/'+p.id+'.jpg';setTimeout(()=>resolve(null),6000);})));
 for(const p of loaded.filter(Boolean)){e.imgs[p.id]=p.image;e.pool.push(p);}
 const card=new Image();card.src='./private/fundstuecke/F1_karte_moving_launch_date.png';await card.decode();
 e.imgs['private.card']=card;e.pool.push({id:'private.card',kind:'card',tags:['artistic'],src:'private',title:'The Moving Launch Date'});
 const nara=new Image();nara.src='./archive/nara-40027753-p15.jpg';await nara.decode();e.imgs['nara.40027753.p15']=nara;e.pool.push({id:'nara.40027753.p15',kind:'document',tags:['historical','document','ufo'],src:'nara',title:'Project Blue Book: UFO Sightings, page 15, NARA 40027753'});
 for(let i=0;i<recipes.length;i++){const c=document.createElement('canvas');c.width=900;c.height=1200;c.naturalWidth=900;c.naturalHeight=1200;const x=c.getContext('2d');x.fillStyle=recipes[i].colors[1];x.fillRect(0,0,900,1200);x.fillStyle='#191b18';x.font='26px monospace';x.fillText(recipes[i].title.toUpperCase(),70,90);recipes[i].texts.forEach((t,j)=>{x.font='24px monospace';const words=t.split(' ');let line='',y=190+j*220;for(const w of words){if(x.measureText(line+w).width>750){x.fillText(line,70,y);line='';y+=38;}line+=w+' ';}x.fillText(line,70,y);});const id='recipe.'+i;e.imgs[id]=c;e.pool.push({id,kind:i===1?'document':'poster',tags:['historical','artistic'],src:'recipe'});}
 e.all=e.pool; e.ready=true;
 const meme=(assets.pool||[]).filter(t=>t.kind==='slogan'&&t.text);for(const p of meme.slice(0,60))TEXTS.push({s:p.text,voice:'slogan',cat:'political'});
 let shot=null,lastKey='',prev=null;
 return {engine:e,canvas,sourceCount:e.pool.length,setRoom(recipe,seed){e._seed=seed;e._ctx=CTX[recipe.context]?recipe.context:'KALEIDOSCOPE';e.st=e.newState(seed,e._ctx);lastKey='';shot=null;},paint(seconds,slot){const key=slot.slot;if(key!==lastKey){prev=shot;const sec=slot.hold?'BREAK':'VERSE';const S={e:slot.hold?.12:.5,shot:[slot.duration/(60/125)],trans:{CUT:1},base:{},type:{},cam:{}};shot=e.planShot(e.st,(()=>{let a=e._seed+key;return ()=>{a=Math.imul(a^a>>>15,2246822519);return (a>>>0)/4294967296;};})(),S,sec,slot.duration/(60/125));shot.trans='CUT';shot.post='NONE';shot.cycle=0;shot.k=key;if(slot.hold){shot.cam='FLOAT';shot.cp.amp=.04;}lastKey=key;}e.frame++;e.paint(canvas.getContext('2d'),shot,prev,slot.local);}};
}
