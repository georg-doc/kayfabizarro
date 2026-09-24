import fs from 'node:fs';

const read=(p)=>fs.readFileSync(p,'utf8');
const lab=read('tools/KFB-ToolBox/stage-first/src/KFB Animation Lab v3.dc.html');
const adapter=read('tools/KFB-ToolBox/stage-first/src/lab/motion-library.v1.js');

let pass=0;
function ok(name,cond){
  if(!cond) throw new Error('FAIL '+name);
  pass++;console.log('ok '+pass+' - '+name);
}

ok('adapter pins exact accepted AN-PROFILE-01 head',adapter.includes("032c9d50cd5de6764fa37fec65cb203ed35fcb11"));
ok('adapter pins Motion Library PR 197',adapter.includes("MOTION_LIBRARY_PR = 197"));
ok('adapter declares source catalogue schema',adapter.includes("kfb.motion-catalog.v1"));
ok('adapter declares profile catalogue schema',adapter.includes("kfb.motion-profile-catalog/1.0"));
ok('adapter requires exact 33 clip source',adapter.includes("expected 33 motion clips"));
ok('adapter validates shared profile reader',adapter.includes("validateMotionProfileCatalog"));
ok('adapter compares exact catalogue/profile ids',adapter.includes("catalogue/profile clip ids differ"));
ok('adapter creates no AnimationMixer',!adapter.includes('AnimationMixer'));
ok('adapter creates no WebGLRenderer',!adapter.includes('WebGLRenderer'));
ok('adapter exposes rig-specific library URL',adapter.includes('libraryUrl(ctx, rig)')&&adapter.includes("Rig_"));
ok('adapter exposes semantic profile families',adapter.includes('semanticFamilies(ctx)')&&adapter.includes("Motion · "));
ok('adapter preserves unknown planted state',adapter.includes("UNKNOWN_NOT_MEASURED")&&adapter.includes("return 'unknown"));

ok('Animation Lab v3 loads shared motion adapter',lab.includes("./lab/motion-library.v1.js"));
ok('Animation Lab v3 lazily loads rig motion GLB',lab.includes('async loadMotionPack(rig)'));
ok('Animation Lab requires 33 clips per rig',lab.includes("expected 33 clips, got"));
ok('KFB library joins existing allClips pool',lab.includes("key: 'KFBMotion/' + cl.name")&&lab.includes('library: true'));
ok('KFB library uses existing selectClip path',lab.includes("const item = this.allClips().find((x) => x.key === key)"));
ok('semantic family filter uses profile metadata',lab.includes('this.itemFamily(x)')&&lab.includes('semanticFamilies(this.motion)'));
ok('search consumes semantic motion metadata',lab.includes('this.motionSearchText(x).includes(q)'));
ok('Data exposes state and loop',lab.includes("Motion · State")&&lab.includes("Motion · Loop"));
ok('Data exposes root/travel and reference speed',lab.includes("Motion · Travel")&&lab.includes("Motion · Ref speed"));
ok('Data exposes contacts without inventing them',lab.includes("Motion · Feet")&&lab.includes("Motion · Hands"));
ok('Data exposes unknown rate window',lab.includes("Motion · Rate window"));
ok('Data exposes only shared action markers',lab.includes("Motion · Markers")&&lab.includes('this.ML.actionMarkers'));
ok('Data exposes immutable AN-PROFILE evidence',lab.includes("Motion · Evidence")&&lab.includes('this.ML.SOURCE_REVISION'));
ok('inventory surfaces semantic group and speed',lab.includes("speed unknown")&&lab.includes("mp.semantics.stateFamily"));
ok('KFB motion clips are visibly marked',lab.includes("background:#8fbf6a"));

ok('existing AnimationMixer creation count remains three',(lab.split('new THREE.AnimationMixer').length-1)===3);
ok('existing WebGLRenderer creation count remains two',(lab.split('new THREE.WebGLRenderer').length-1)===2);
ok('existing Stage mixer remains the selected-clip owner',lab.includes('this.mixer = new THREE.AnimationMixer(this.charScene)'));
ok('no consumer-local profile JSON copy exists',!fs.existsSync('tools/KFB-ToolBox/stage-first/src/lab/KFB_Motion_Library.profile-catalog.v1.json'));
ok('no consumer-local motion GLB copy exists',!fs.existsSync('tools/KFB-ToolBox/stage-first/src/lab/KFB_Motion_Library_Rig_Medium.glb')&&!fs.existsSync('tools/KFB-ToolBox/stage-first/src/lab/KFB_Motion_Library_Rig_Large.glb'));

const m=lab.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/);
ok('Animation Lab data-dc script exists',!!m);
if(m){
  try{ new Function(m[1]); ok('Animation Lab data-dc JavaScript parses',true); }
  catch(e){ throw new Error('FAIL Animation Lab data-dc JavaScript parses: '+e.message); }
}

console.log('AN-PROFILE-02 STATIC PASS '+pass+'/'+pass);
