import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {SURFACE_IDS,createSurfaceAdapter,logicalPose,frameDiagnostics,roundTripError} from '../surface-core.mjs';
import {RECIPE,RECIPE_ID,stableRecipeFingerprint,ENVIRONMENT_PROFILE_REF,PROP_IDENTITY} from '../recipe.mjs';

let passed=0;
const test=(name,fn)=>{fn();passed++;console.log(`PASS ${passed} · ${name}`);};
const points=[[0,0],[2,0],[-2,0],[1.2,1.5],[-1.4,-1.3]];

test('one immutable recipe identity drives every adapter',()=>{
  assert.equal(RECIPE.id,RECIPE_ID);
  assert.equal(RECIPE.cells.length,7);
  assert.equal(new Set(RECIPE.cells.map(c=>c.id)).size,7);
  assert.equal(RECIPE.environmentProfileRef,ENVIRONMENT_PROFILE_REF);
  assert.equal(RECIPE.prop.identity,PROP_IDENTITY);
  const fp=stableRecipeFingerprint();
  for(const id of SURFACE_IDS){ assert.equal(stableRecipeFingerprint(RECIPE),fp,id); }
});

test('seven-cell fixture uses only measured KayKit identities and valid rotations',()=>{
  for(const c of RECIPE.cells){
    assert.match(c.tile,/^hex_(?:grass|road_[A-M])$/);
    assert.ok([0,60,120,180,240,300].includes(c.rotation),`${c.id}:${c.rotation}`);
  }
  assert.deepEqual(RECIPE.cells.slice(0,3).map(c=>[c.tile,c.rotation]),[['hex_road_M',180],['hex_road_A',0],['hex_road_M',0]]);
});

test('frames are finite, normalized, orthogonal and consistently right-handed',()=>{
  for(const id of SURFACE_IDS){
    const a=createSurfaceAdapter(id);
    for(const p of points){
      const d=frameDiagnostics(logicalPose(a,p,0.17));
      assert.equal(d.finite,true,`${id} finite`);
      assert.ok(Math.abs(d.normalLength-1)<1e-10,`${id} n`);
      assert.ok(Math.abs(d.uLength-1)<1e-10,`${id} u`);
      assert.ok(Math.abs(d.vLength-1)<1e-10,`${id} v`);
      assert.ok(Math.abs(d.nu)<1e-10,`${id} nu`);
      assert.ok(Math.abs(d.nv)<1e-10,`${id} nv`);
      assert.ok(Math.abs(d.uv)<1e-10,`${id} uv`);
      assert.equal(d.handedness,1,`${id} handedness`);
    }
  }
});

test('Flat/Sphere/Torus logical-address round trips stay below tolerance',()=>{
  for(const id of SURFACE_IDS){
    const a=createSurfaceAdapter(id);
    for(const p of points) assert.ok(roundTripError(a,p)<1e-9,`${id} ${p}`);
  }
});

test('world projection round-trips surface points back to the same logical address',()=>{
  for(const id of SURFACE_IDS){
    const a=createSurfaceAdapter(id);
    for(const p of points){
      const f=logicalPose(a,p,0);
      const q=a.project(f.position).logical;
      assert.ok(Math.hypot(q[0]-p[0],q[1]-p[1])<1e-8,`${id} ${p} -> ${q}`);
    }
  }
});

test('curved adapters do not use global Y as universal up',()=>{
  const s=logicalPose(createSurfaceAdapter('SPHERE'),[1.4,1.1],0).normal;
  const t=logicalPose(createSurfaceAdapter('TORUS'),[1.4,1.1],0).normal;
  assert.ok(Math.hypot(s[0],s[2])>0.2);
  assert.ok(Math.hypot(t[0],t[2])>0.2);
});

test('recipe route, prop and environment references are surface-agnostic data',()=>{
  assert.deepEqual(RECIPE.route.points,[[-2,0],[-1,0],[0,0],[1,0],[2,0]]);
  assert.equal(RECIPE.prop.source,'decoration/props/target.gltf');
  assert.match(RECIPE.environmentProfileRef,/^kfb\.environment-profile\/1@a487294/);
  assert.equal(RECIPE.surfaceFx.type,'KFB_RADIAL_RIPPLE');
});

test('runtime source does not introduce movement, camera or terrain ownership',()=>{
  const here=path.dirname(fileURLToPath(import.meta.url));
  const root=path.resolve(here,'..');
  const text=['surface-core.mjs','recipe.mjs'].map(f=>fs.readFileSync(path.join(root,f),'utf8')).join('\n');
  for(const forbidden of ['setPlayer(','movementWriter','cameraWriter','setTerrainZones(','bodenRadius(','MazeGraph','RaceController']){
    assert.equal(text.includes(forbidden),false,forbidden);
  }
});

console.log(`RESULT ${passed}/${passed} PASS`);
