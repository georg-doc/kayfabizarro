/* Canonical catalog selector/transition consumer. Travel Audio owns one graph; S16 owns one master clock. */
import {createTravelAudio} from '../../../../travel/KFB Travel Combat v25/terrain-v25/travel-audio.js';
import {FrizzleBobVoice} from '../../../../travel/KFB Travel Combat v25/terrain-v25/frizzlebob-voice.js';
export const AUDIO_SOURCE={catalogPin:'137735599a4747a373c3f978799880ef2b1c45d5',catalogPath:'media/3D_Assets/Sounds/jukebox.json',catalogBlob:'bcd4b6c3100cb83adacd90eb85c3d87fc617bcff',contextOwner:'KFB Travel Audio',clockOwner:'S16 SongTransport'};
const P='roadtrip-v2-',PALETTE={town:[P+'folk-acoustic-storybook-bed',P+'soul-r-and-b-ambient-bed'],dystopia:[P+'dystopia-ambient-bed'],utopia:[P+'utopia-ambient-bed'],protopia:[P+'protopia-ambient-bed'],road:[P+'wet-neon-road-cosmic-surf-experiment',P+'wet-road-rhythmic-texture-road-radio']};
const hash=s=>{let n=2166136261;for(const c of String(s))n=Math.imul(n^c.charCodeAt(0),16777619);return n>>>0};
const raw=(pin,path)=>'https://raw.githubusercontent.com/georg-doc/kayfabizarro/'+pin+'/'+path.split('/').map(encodeURIComponent).join('/');
export function createMusicalWorld(A,{signature,journey,onError=console.error}={}){
 const owner=createTravelAudio({externalTransport:true,sourcePin:AUDIO_SOURCE.catalogPin,params:{drone:0,music:.26,musicHead:2.4,wind:.15,rumble:.1,gust:.15}}),voice=new FrizzleBobVoice();let socialFocus=false,voiceFocus=false;const focus=()=>owner.duck(socialFocus||voiceFocus,.5);voice.onActivity=on=>{voiceFocus=on;focus()};let transport=null,catalog=null,active=false,party=false,manual=false,pending=null,lastZone=null,fade=null,wind=null,engine=null,water=null,lastStep=0,elapsed=0,vector={},logs=[];
 const select=zone=>PALETTE[zone][hash(journey.memory().seed+'#'+zone)%PALETTE[zone].length];
 function record(type,extra={}){logs.push({type,time:performance.now(),...extra});if(logs.length>80)logs.shift()}
 function song(id){if(id==='demon-afro-strut')return signature;const t=catalog?.tracks.find(t=>t.id===id);if(!t?.source?.sha)throw Error('Canonical master source missing '+id);const found=/main@([a-f0-9]{40})/.exec(t.source.provenance||'');return{id:t.id,commit:found?.[1]||AUDIO_SOURCE.catalogPin,repoPath:t.file,gitBlob:t.source.sha,bpm:t.bpm||null,phaseOffset:0,beatsPerBar:4,catalogId:t.id};}
 function schedule(id,reason,immediate=false){if(!transport||pending?.id===id||fade?.id===id||transport.song.id===id)return;const bpm=transport.song.bpm,beat=transport.beatPos(),boundary=Number.isFinite(bpm)&&bpm>0&&!immediate?transport.songTime()+(16-((beat%16+16)%16))*60/bpm:transport.songTime();pending={id,reason,scheduledTime:boundary,transitionClass:'phrase-tail / physical-ambience bridge'};record('scheduled',{...pending,state:{...vector}});}
 function begin(){if(!pending||fade)return;fade={...pending,t:0};pending=null;transport.setLevel(0,.18);}
 function load(id){const s=song(id);transport.load(s,false);const off=transport.onChange(()=>{if(transport.state==='bereit'){off();if(!transport.blobOk){onError(Error('Required master blob mismatch '+id));return}if(active){transport.setLevel(1,.4);transport.play();}record('master-started',{id,blob:transport.blobHash,sourcePin:s.commit});}else if(transport.state.startsWith('fehlt')){off();onError(Error(transport.state))}});}
 return{owner,getSharedGraph(){owner.start();return owner.sharedGraph;},
  async prepare(){const r=await fetch(raw(AUDIO_SOURCE.catalogPin,AUDIO_SOURCE.catalogPath));if(!r.ok)throw Error('Required canonical Jukebox missing');catalog=await r.json();if(catalog.tracks.length!==69)throw Error('Unexpected canonical catalog count');for(const ids of Object.values(PALETTE))for(const id of ids)song(id);record('catalog',{count:69,source:AUDIO_SOURCE});},
  attach(t){transport=t;},
  start(){if(active){owner.resume();return}active=true;owner.start();voice.setEnabled(true);schedule(select('town'),'ENTER / Town identity',true);begin();
   Promise.all([owner.physicalLoop('wind','media/3D_Assets/Audio/Environment/ambient_wind.wav'),owner.physicalLoop('engine','media/3D_Assets/Audio/KFB Racer/KFB_V8_Load_Loop_10s_48k.wav'),owner.physicalLoop('water','media/3D_Assets/Audio/Environment/water_babbling_loop.wav')]).then(([w,e,a])=>{wind=w;engine=e;water=a;wind.setLevel(.08);record('physical-loops-ready',{ids:['wind','engine','water']})}).catch(onError);},
  speak(text){voice.speak(text,{priority:2});},
  social(on){socialFocus=!!on;focus();if(!on)voice.setEnabled(false);else voice.setEnabled(true);},
  card(){owner.sfx('card',.35);},
  party(){manual=false;party=true;if(transport.song.id==='demon-afro-strut'&&transport.blobOk)transport.toggle();else{schedule('demon-afro-strut','Resident concert',true);begin();}},
  radio(){manual=true;party=false;schedule('demon-afro-strut','Collected Jukebox song',true);begin();},
  ended(id){if(id==='demon-afro-strut'){party=false;manual=false;schedule(select(lastZone||'town'),'Performance complete → world',true);}else {const next=select(lastZone||'town');if(next===id){transport.restart();transport.play();record('master-restarted',{id});return;}schedule(next,'Master ended / world continuity',true);}begin();},
  update(dt){if(!active||!transport)return;elapsed+=dt;const p=A.play.position,d=A.mvp.drive?.evidence(),node=A.world.archipelago.nodes.find(n=>n.plan.sdf(p.x,p.z)<=0),zone=d?.active?'road':(node?.id.replace('world.','').replace('kfb-','')||lastZone||'town');const speed=d?.active?(d.speed||0):Math.abs(A.play.speed),band=A.sceneObjects.get('dystopia.band'),distance=band?Math.hypot(p.x-band.position.x,p.z-band.position.z):Infinity;
   vector={biome:zone,deckFamily:node?.recipe.deckId||null,motion:Math.min(1,speed/10),verticality:p.y,airborne:false,drive:!!d?.active,danger:0,social:socialFocus?1:0,weatherIntensity:0,timeOfDay:'day',event:party?'disco':null,residentSignature:party?'dystopia.orc':null,voiceFocus};
   owner.update(dt,{heat:Math.min(1,speed/24),rate:1,mode:1,agl:0,camera:A.camera});engine?.setLevel(d?.active ? .22+Math.min(1,speed/35)*.20:0);engine?.setRate(.78+Math.min(1,speed/35)*.64);
   const pd=node?.plan.pond,waterNear=pd?Math.max(0,1-Math.hypot(p.x-pd.x,p.z-pd.z)/22):0;water?.setLevel(waterNear*.09);
   if(!d?.active&&A.play.on&&speed>.5&&elapsed-lastStep>.5){owner.sfx('step',.09);lastStep=elapsed;}
   if(party&&distance>60){party=false;schedule(select(zone),'Leaving performance zone');}
   if(zone!==lastZone){lastZone=zone;if(!party&&!manual)schedule(select(zone),'Semantic world/drive handoff');}
   if(!fade&&!pending&&transport.playing)transport.setLevel(.75+.25*vector.motion,.4);if(pending&&(!transport.playing||transport.songTime()>=pending.scheduledTime))begin();if(fade){fade.t+=dt;if(fade.t>=.6){const f=fade;fade=null;load(f.id);record('transition',{...f,actualTime:performance.now()});}}
  },
  evidence(){return{source:AUDIO_SOURCE,catalogCount:catalog?.tracks.length||0,currentTrack:transport?.song.id,targetTrack:pending?.id||fade?.id||null,transportState:transport?.state,blobOk:transport?.blobOk,sourcePin:transport?.song.commit,contextOwner:owner.sharedGraph?.owner||'not started',contextState:owner.state,transportContext:transport?.audioContextOwner,stateVector:vector,physicalAmbience:[wind&&'wind',engine&&'engine',water&&'water'].filter(Boolean),voiceDuck:owner.ducked,voiceAvailable:voice.ready,voiceActive:voice.speaking,dialogueFocus:socialFocus,transitions:logs};}
 };
}
