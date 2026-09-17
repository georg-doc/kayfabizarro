import { createSupportSurfaceResolver } from './support-surface.js';
import { createAssemblyA0SurfaceAdapter, KFB_ASSEMBLY_A0_CONTRACT } from './assembly-a0-surface-adapter.js';

function waitForRuntime(timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    const t0 = performance.now();
    const tick = () => {
      if (window.__wb0?.ground && window.__globe?.scene) return resolve({ wb0: window.__wb0, g: window.__globe });
      if (performance.now() - t0 > timeoutMs) return reject(new Error('Support Surface gate timed out waiting for WB0'));
      setTimeout(tick, 40);
    };
    tick();
  });
}
function knownSupportKind(anchor) {
  if (anchor.userData?.wb0SupportSurface === false) return null;
  if (anchor.userData?.wb0SupportSurface === true) return anchor.userData.wb0SupportKind || 'prop';
  const name = String(anchor.name || '');
  if (/^WB0 ROAD · /i.test(name)) return 'road';
  if (/Stunt Ramp/i.test(name)) return 'ramp';
  if (/BlockBits Grass/i.test(name)) return 'voxel';
  if (/Caveman Mine/i.test(name)) return 'structure';
  return null;
}
function rolesForKind(kind) {
  if (kind === 'road') return ['support','walkable','road'];
  if (kind === 'ramp') return ['support','walkable','stunt'];
  if (kind === 'structure') return ['support','walkable','deck'];
  if (kind === 'voxel') return ['support','walkable'];
  if (kind === 'bridge') return ['support','walkable','bridge'];
  return ['support','walkable'];
}
function localKind(surface) {
  const roles = Array.isArray(surface?.roles) ? surface.roles : [], ref = surface?.geometryRef;
  if (ref?.runtime === 'travel-terrain-cards' || ref === 'runtime:travel-terrain-cards') return 'card';
  if (roles.includes('road')) return 'road'; if (roles.includes('bridge')) return 'bridge'; if (roles.includes('deck')) return 'structure'; if (roles.includes('stunt')) return 'ramp'; return 'support';
}
async function main() {
  const { wb0, g } = await waitForRuntime();
  const bodyHeight = Number(wb0.report?.().bodyHeight) || 0.022;
  const resolver = createSupportSurfaceResolver({ terrainRadiusAt: (direction) => wb0.ground.radiusAt(direction), bodyHeight });
  wb0.ground.setSupportResolver((direction, terrainRadius) => resolver.resolve(direction, terrainRadius));
  let cardLift = null;
  if (g.teppiche?.group) {
    const desiredLift = bodyHeight * 0.01; cardLift = { before: Number(g.teppiche.params?.lift), after: desiredLift };
    if (g.teppiche.params && Number.isFinite(g.teppiche.params.lift) && g.teppiche.params.lift > desiredLift) { g.teppiche.params.lift = desiredLift; if (typeof g.teppiche.neubau === 'function') g.teppiche.neubau(); }
  }
  function findByWb0Id(id) { let found = null; g.scene.traverse((object) => { if (!found && String(object.userData?.wb0Id || '') === String(id)) found = object; }); return found; }
  function resolveGeometryRef(ref, surface) {
    let object = null;
    if (ref === 'runtime:travel-terrain-cards' || ref?.runtime === 'travel-terrain-cards') object = g.teppiche?.group || null;
    else if (typeof ref === 'string' && ref.startsWith('wb0:')) object = findByWb0Id(ref.slice(4));
    else if (typeof ref === 'string' && ref.startsWith('scene:')) object = g.scene.getObjectByName(ref.slice(6)) || null;
    else if (ref?.wb0Id != null) object = findByWb0Id(ref.wb0Id);
    else if (ref?.instanceId != null) object = findByWb0Id(ref.instanceId);
    else if (ref?.splineId != null) object = g.scene.getObjectByName(`WB0 ROAD · ${ref.splineId}`) || findByWb0Id(ref.splineId);
    else if (ref?.sceneName) object = g.scene.getObjectByName(String(ref.sceneName)) || null;
    if (!object) return null;
    const kind = localKind(surface);
    return { object, options: { kind, minUpDot: kind === 'card' ? 0.12 : (kind === 'road' || kind === 'ramp' || kind === 'bridge') ? 0.18 : 0.28, maxRise: kind === 'card' ? bodyHeight * 2 : bodyHeight * 12 } };
  }
  const a0Adapter = createAssemblyA0SurfaceAdapter({ registerSupport: (id, object, options) => resolver.registerObject(id, object, options), resolveGeometryRef });
  function surfaceForObject(object, index) {
    const explicitRoles = Array.isArray(object.userData?.kfbA0SurfaceRoles) ? object.userData.kfbA0SurfaceRoles.map(String) : null;
    const kind = knownSupportKind(object); if (!explicitRoles && !kind) return null;
    const roles = explicitRoles || rolesForKind(kind), wb0Id = object.userData?.wb0Id, sceneName = String(object.name || ''), identity = wb0Id || sceneName || `object-${index}`;
    const geometryRef = wb0Id != null ? { wb0Id: String(wb0Id) } : { sceneName };
    const priority = roles.includes('stunt') ? 40 : roles.includes('road') ? 30 : roles.includes('bridge') ? 30 : 20;
    return { id:`wb0.${identity}`, geometryRef, roles, priority, normalPolicy:'travel-upward-facing', connectorRefs:[] };
  }
  function buildLiveA0Envelope() {
    const surfaces = [];
    if (g.teppiche?.group) surfaces.push({ id:'travel.terrain-cards', geometryRef:{runtime:'travel-terrain-cards'}, roles:['support','walkable'], priority:10, normalPolicy:'terrain-conforming', materialHint:'card/polygon-offset', connectorRefs:[] });
    let index=0; g.scene.traverse((object)=>{const surface=surfaceForObject(object,index++);if(surface)surfaces.push(surface);});
    return { id:'travel.wb0.live-support-surfaces', kind:'terrain', schemaVersion:'A0', revision:'runtime-live', status:'candidate', maturity:'L4', consumerTargets:['Travel/WB0'], assetRefs:[], slots:[], surfaces, connectors:[], variants:[], evidence:[{type:'implementation',consumer:'Travel/WB0',status:'browser-acceptance-pending'}], notes:'Travel-local live proof envelope. A0 semantics only; Support Surface resolver remains Travel-owned.' };
  }
  let liveEnvelope=null, liveSignature='';
  function syncLiveA0Supports(){const next=buildLiveA0Envelope();const signature=JSON.stringify(next.surfaces.map((s)=>[s.id,s.geometryRef,s.roles,s.priority]));if(signature===liveSignature)return;liveSignature=signature;liveEnvelope=next;a0Adapter.applyRecipe(next);}
  syncLiveA0Supports(); const timer=setInterval(syncLiveA0Supports,500);
  wb0.assemblyA0={name:'wb0-assembly-a0-consumer-seam',contract:KFB_ASSEMBLY_A0_CONTRACT,adapter:a0Adapter,applyRecipe(envelope){return a0Adapter.applyRecipe(envelope);},removeRecipe(id){return a0Adapter.removeRecipe(id);},sync:syncLiveA0Supports,get liveRecipe(){return liveEnvelope?structuredClone(liveEnvelope):null;},report(){return a0Adapter.report();}};
  wb0.supportSurfaces={resolver,cardLift,a0:wb0.assemblyA0,sync:syncLiveA0Supports,register(id,object,options={}){return resolver.registerObject(id,object,options);},report(){return{cardLift,groundSupport:wb0.ground.state.support,a0:a0Adapter.report(),resolver:resolver.report()};},dispose(){clearInterval(timer);a0Adapter.clear();resolver.clear();wb0.ground.setSupportResolver(null);}};
  console.info('[wb0 support-surface/A0]', wb0.supportSurfaces.report());
}
main().catch((error) => console.warn('[wb0 support-surface/A0]', error));
