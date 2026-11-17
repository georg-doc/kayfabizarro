const registrations=new WeakMap();
const vec=v=>Array.isArray(v)&&v.length===3&&v.every(Number.isFinite);
// Registration only: the combat/collider owner supplies the sweep, and confirmed
// hit/blast messages reach level.impact without another ray or damage calculation.
export function createInfiniteRoomsCombatSource({addCombatTarget,sweepWorld,level,profiles,recipe,readWeaponContext=()=>null,onCascade}){
 if(typeof addCombatTarget!=='function'||typeof sweepWorld!=='function'||typeof level?.impact!=='function'||typeof onCascade!=='function'||recipe?.id!=='infiniterooms.impact.v1')throw Error('Missing existing host owners');
 if(registrations.has(addCombatTarget))throw Error('InfiniteRooms source already registered');
 let disposed=false,sequence=0;const seen=new Set(),counts={received:0,accepted:0,rejected:0,duplicates:0};
 function receive(input,kind){
  counts.received++;if(disposed||!input||input.kind&&input.kind!==kind||!vec(input.at)||typeof input.weapon!=='string'||!Object.hasOwn(profiles,input.weapon)||!Number.isFinite(input.energy)||input.energy<=0||kind==='shot'&&(!vec(input.dir)||Math.hypot(...input.dir)<1e-8||!vec(input.normal))||kind==='blast'&&(!Number.isFinite(input.radius)||input.radius<=0)){counts.rejected++;return false;}
  // Only deduplicate an explicit host shot identity. Consecutive anonymous blasts
  // at the same position may be two legitimate bombs and must both survive.
  const key=input.shot==null?null:JSON.stringify([kind,input.weapon,input.shot,input.id]);if(key&&seen.has(key)){counts.duplicates++;return false;}
  const context=readWeaponContext(),info=structuredClone({...input,kind,weaponColor:context?.waffe===input.weapon?context.farbe:null});
  const receipt=level.impact(info,profiles[input.weapon]);if(!receipt){counts.rejected++;return false;}
  if(key){seen.add(key);if(seen.size>256)seen.delete(seen.values().next().value);}counts.accepted++;
  // Exactly one parent cascade notification; no hit+break double accounting,
  // VFX rendering, audio playback, damage, timers or frame loop in this adapter.
  onCascade({id:'infiniterooms:'+ ++sequence,info,receipt,recipe,profile:profiles[input.weapon]});return receipt;
 }
 const source={name:'infiniterooms',sweep(a,b,radius,options){if(disposed)return null;return sweepWorld(a,b,radius,options);},hit:info=>receive(info,'shot'),blast:info=>receive(info,'blast')};
 const off=addCombatTarget(source);registrations.set(addCombatTarget,source);
 return{source,status:()=>({...counts,disposed,sourceCount:disposed?0:1}),reset(){if(disposed||!level.reset?.())return false;seen.clear();return true;},dispose(){if(disposed)return;disposed=true;off();registrations.delete(addCombatTarget);seen.clear();}};
}
