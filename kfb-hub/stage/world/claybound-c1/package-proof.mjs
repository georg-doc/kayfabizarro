import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const source = path.resolve('kfb-hub/stage/world/world-r2');
const candidate = path.resolve('kfb-hub/stage/world/claybound-c1');
let count = 0;
function ok(name, condition) {
  if (!condition) throw new Error('FAIL ' + name);
  console.log('ok ' + (++count) + ' - ' + name);
}
const digest = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
}
const runtime = walk(path.join(source, 'runtime'));
for (const file of runtime) {
  const rel = path.relative(source, file);
  ok('accepted runtime unchanged: ' + rel, digest(file) === digest(path.join(candidate, rel)));
}
const owner = path.resolve('tools/KFB-ToolBox/worldbuilder/presentation/claybound-presentation.v1.js');
const mirror = path.join(candidate, 'runtime/worldbuilder/presentation/claybound-presentation.v1.js');
ok('presentation adapter exact mirror', digest(owner) === digest(mirror));
const index = fs.readFileSync(path.join(candidate, 'index.html'), 'utf8');
ok('C1 entry marker', index.includes('CLAYBOUND-WORLD-C1'));
ok('accepted World r2 source marker', index.includes('58028b07d7618926c40ffaec3bd4053dc88c0efd'));
ok('one WorldBuilder runtime', index.includes("await import('./runtime/worldbuilder/wb2-design-01/wb2d-app.js')"));
ok('one presentation adapter', index.includes("await import('./runtime/worldbuilder/presentation/claybound-presentation.v1.js')"));
const adapter = fs.readFileSync(owner, 'utf8');
ok('upper-wall allowlist', adapter.includes('city.blocks') || adapter.includes('walls = city.blocks'));
ok('no terrain modification', !adapter.includes('app.terrain.geometry.setAttribute') && !adapter.includes('terrain.geometry.attributes.position.set'));
ok('no screen-space noise', !adapter.includes('gl_FragCoord') && !adapter.includes('uTime'));
ok('no new renderer or camera', !/new THREE\.(WebGLRenderer|PerspectiveCamera|OrthographicCamera)/.test(adapter));
console.log('CLAYBOUND C1 PACKAGE PASS ' + count + '/' + count);
