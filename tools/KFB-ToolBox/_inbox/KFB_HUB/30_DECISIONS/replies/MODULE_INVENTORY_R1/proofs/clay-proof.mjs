const LAB = process.env.HOME + '/Dropbox/CLAUDE/KFB Island Worldbuilder Lab';
const THREE = await import(LAB + '/node_modules/three/build/three.module.js');
const C = await import(LAB + '/src/sky/vendor/lab-clay/clay-material.v10.js');
const R = await import(LAB + '/src/sky/vendor/lab-clay/clay-relief.v2.js');
console.log('three', THREE.REVISION, 'exports', Object.keys(C).join(','));
const t0 = Date.now();
const rel = R.makeClayRelief({ size: 256, seed: 31 });
console.log('relief', rel.size, rel.data.length, (Date.now()-t0)+'ms');
const tex = new THREE.DataTexture(rel.data, rel.size, rel.size, THREE.RGBAFormat);
const U = C.makeClayUniforms(THREE, tex);
const m = C.makeClayMaterial(THREE, U, { color: 0xc88a5a, profile: C.PROFILES.terrainFg });
console.log('material', m.type, m instanceof THREE.Material, 'onBeforeCompile', typeof m.onBeforeCompile, 'uniforms', Object.keys(U).length);
const shader = { uniforms: {}, vertexShader: THREE.ShaderLib.standard.vertexShader, fragmentShader: THREE.ShaderLib.standard.fragmentShader };
try { m.onBeforeCompile(shader, null); console.log('onBeforeCompile ok, frag len', shader.fragmentShader.length, 'has uClay', /uClay/.test(shader.fragmentShader)); } catch(e) { console.log('onBeforeCompile err', e.message); }
const g = C.seedGeometry(THREE, new THREE.BoxGeometry(1,1,1), 7);
console.log('seedGeometry attrs', Object.keys(g.attributes).join(','));
m.dispose(); tex.dispose(); g.dispose();
