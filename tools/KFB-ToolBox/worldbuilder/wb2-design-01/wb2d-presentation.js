/* KFB WorldBuilder · WB2-DESIGN-01 · presentation seam
   Composes the WhackMan-origin WorldDesign Lab donors into the accepted WB2 editor WITHOUT forking them:
     wd-light.js  → environment/light profile (BASELINE · WHACKMAN), orthogonal to surface
     wd-look.js   → surface look per layer (terrain · objects), SOURCE = untouched material
   Default profile `wb2` = the accepted WB2 light set, byte-for-byte (hemi 2.4 · sun 2.8 · fog 22–45 · 0x8e887a).
   Presentation state is NOT scene truth: it lives in its own localStorage key, the scene document is unchanged. */
import * as THREE from 'three';
import * as LIGHT from '../../_inbox/KFB%20World%20Design%20Setup%20(1)/WORLDDESIGN_LAB_2026-09-23/deliverables/wd-light.js';
import * as LOOK from '../../_inbox/KFB%20World%20Design%20Setup%20(1)/WORLDDESIGN_LAB_2026-09-23/deliverables/wd-look.js';

/* wd-look's own REF_URL is document-relative ('./textures/…'); resolve it against the donor folder instead. */
const REF_URL = new URL('../../_inbox/KFB%20World%20Design%20Setup%20(1)/WORLDDESIGN_LAB_2026-09-23/deliverables/textures/derek-rgb-ref.png', import.meta.url).href;
const KEY = 'kfb-wb2-design-01.presentation';

export const PROFILES = [['wb2', 'WB2'], ['baseline', 'Baseline'], ['whackman', 'WhackMan']];
/* Only presets whose texture source this host can honour (ref tile · repo set · procedural). */
export const TERRAIN_LOOKS = ['SOURCE', 'TERRAIN · COMBINED REF', 'PROCEDURAL / CLAY', 'STONE', 'PAPER', 'FELT', 'DEREK', 'CEL PUR', 'NORMALEN-LOOK', 'RAUHEITS-LOOK'];
export const OBJECT_LOOKS = ['SOURCE', 'DEREK · CHARAKTER', 'DEREK · PROP', 'PROCEDURAL / CLAY', 'CARDBOARD', 'CEL PUR', 'NORMALEN-LOOK'];
export const LIGHT_PARAMS = LIGHT.PARAMS.filter(p => p[0] !== 'local');
export const TORCH_KEYS = ['torch', 'torchRange', 'flicker'];

const DEFAULTS = () => ({ profile: 'wb2', light: { ...LIGHT.DEF }, terrainLook: 'SOURCE', objectLook: 'SOURCE', story: 0, drawer: '' });

let refP = null;
function refTile() {
  if (!refP) refP = new THREE.TextureLoader().loadAsync(REF_URL).then(t => {
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.NoColorSpace; t.anisotropy = 4;
    return { map: t, normalMap: null, roughMap: null };
  });
  return refP;
}
async function mapsFor(p) {
  try {
    if (p.src === 'ref') return await refTile();
    if (p.src === 'set') return await LOOK.repoSet(p.set);
  } catch (err) { console.warn('look texture unavailable', p.src, p.set, err); }
  return {};
}

export function makePresentation({ scene, renderer, wb2Lights, wb2Background, wb2Fog, heightAt }) {
  let state = DEFAULTS();
  try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s) state = { ...state, ...s, light: { ...LIGHT.DEF, ...(s.light || {}) } }; } catch {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} };

  let environment=null, cloudField=null, cloudFamily=null, cloudMaterial=null, lastTime=0,cloudTextures=new Set();
  const rig = LIGHT.makeRig(scene, state.light);
  const box = new THREE.Box3(new THREE.Vector3(-9, -2, -9), new THREE.Vector3(9, 3, 9));
  const torchXZ = [[-4, 3], [4.2, 2.6], [-3.2, -4], [3.6, -3.4]]; // LABOR positions, not world truth
  const torchPoints = () => torchXZ.map(([x, z]) => new THREE.Vector3(x, heightAt(x, z) + 1.7, z));

  function applyProfile() {
    if(environment){rig.group.visible=false;wb2Lights.forEach(l=>l.visible=false);return;}
    const wb2 = state.profile === 'wb2';
    rig.group.visible = !wb2;
    wb2Lights.forEach(l => { l.visible = wb2; });
    if (wb2) {
      scene.background = wb2Background; scene.fog = wb2Fog;
      renderer.toneMapping = THREE.NoToneMapping; renderer.toneMappingExposure = 1;
    } else {
      state.light.profile = state.profile;
      rig.placeWorld(box, torchPoints());
      LIGHT.applyRenderer(renderer, state.light);
    }
  }

  const looks = { terrain: LOOK.makeLook(), objects: LOOK.makeLook() };
  const roots = { terrain: new Set(), objects: new Set() };
  let lookToken = { terrain: 0, objects: 0 };
  async function setLook(layer, name) {
    state[layer === 'terrain' ? 'terrainLook' : 'objectLook'] = name; save();
    const look = looks[layer], p = LOOK.PRESETS[name], tok = ++lookToken[layer];
    if (!p || p.on === false) look.p.on = false;
    else { look.setAll({ ...p }); look.p.on = true; look.maps(await mapsFor(p)); }
    if (tok !== lookToken[layer]) return;
    for (const r of roots[layer]) LOOK.apply(r, look);
  }
  function attach(layer, root) { roots[layer].add(root); LOOK.apply(root, looks[layer]); }

  LOOK.STORY.uStoryAmt.value = state.story;
  applyProfile();
  setLook('terrain', state.terrainLook);
  setLook('objects', state.objectLook);

  return {
    get state() { return state; },
    async useIslandEnvironment(camera) {
      if(environment)return;
      const base='../../_inbox/KFB Skydome Gates SKY3/KFB_SKYDOME_SKY3_SESSION_CUT_2026-10-01_r1/lab-sky/';
      const [{createEnvironmentHost},clouds]=await Promise.all([import(base+'env-host.v3.js'),import(base+'cloud-family.v3.js')]);
      environment=await createEnvironmentHost({THREE,scene,renderer,camera,radius:900,fogScale:12,travelVariant:'A',getClayU:null});
      await environment.setShell('travel');environment.setTime('day');
      renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.62;
      const light=environment.sun;light.castShadow=true;light.shadow.mapSize.set(2048,2048);Object.assign(light.shadow.camera,{left:-42,right:42,top:42,bottom:-42,near:.5,far:200});light.shadow.normalBias=.025;light.shadow.bias=-.0001;scene.add(light.target);
      const donor=await clouds.loadDonor(THREE);cloudFamily=clouds.buildFamily(THREE,donor.lobes,{seed:3,plan:['donor','kumulus','stratus']});
      const U=await clouds.makeClayBase(THREE,renderer);Object.values(U).forEach(u=>{if(u.value?.isTexture)cloudTextures.add(u.value)});cloudMaterial=clouds.makeCloudMaterial(THREE,U);cloudMaterial.fog=false;
      cloudField=clouds.createCloudField({THREE,family:cloudFamily,material:cloudMaterial,parent:scene});
      cloudField.set([[-140,74,-95,50,0],[100,86,-140,64,1],[160,60,80,55,2],[-120,100,145,72,1]].map(([x,y,z,s,v])=>({p:[x,y,z],s,v,yaw:v*.7,sq:[1,1,1]})));
      cloudField.group.userData.sourceRecord={assetId:'SKY3 Jarlan cloud family',packId:'KFB SKY3',source:{commit:'9bc11ba0861ac5b41f8a4df3d76922bac1e23134',path:base+'cloud-family.v3.js',blobSha:donor.inventory.sha}};
      applyProfile();environment.update(0);cloudField.update(camera);
    },
    environmentProbe(){return environment?.probe()||null;},
    after(){environment?.after();},
    dispose(){cloudField?.dispose();cloudFamily?.dispose();cloudMaterial?.dispose();cloudTextures.forEach(t=>t.dispose());cloudTextures.clear();environment?.dispose();},
    setProfile(p) {
      if (!PROFILES.some(x => x[0] === p)) return;
      state.profile = p;
      if (p !== 'wb2') Object.assign(state.light, p === 'whackman' ? LIGHT.WHACKMAN : LIGHT.BASELINE);
      applyProfile(); save();
    },
    setLight(k, v) { state.light[k] = v; if (!environment&&state.profile !== 'wb2') { rig.refresh(); LIGHT.applyRenderer(renderer, state.light); } save(); },
    setLook,
    setStory(v) { state.story = v; LOOK.STORY.uStoryAmt.value = v; save(); },
    setDrawer(tab) { state.drawer = tab; save(); },
    onTerrain(mesh) { roots.terrain.clear(); attach('terrain', mesh); if (!environment&&state.profile !== 'wb2') rig.placeWorld(box, torchPoints()); },
    onObjectsReset() { roots.objects.clear(); },
    onObject(root) { attach('objects', root); },
    tick(t,camera,target) { LOOK.TIME.value=t;const dt=Math.min(.05,Math.max(0,t-lastTime));lastTime=t;if(environment){environment.update(dt);if(target){const sun=environment.sun,dir=sun.position.clone().sub(sun.target.position).normalize();sun.target.position.copy(target);sun.position.copy(target).addScaledVector(dir,95);sun.target.updateMatrixWorld();}cloudField?.update(camera);cloudField?.setTint(environment.cloudColor);}else if(state.profile!=='wb2')rig.update(t); }
  };
}
