import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const source = path.resolve('kfb-hub/stage/world/world-r2');
const candidate = path.resolve('kfb-hub/stage/world/world-flight-clay-c0');
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
  ok('accepted World r2 runtime unchanged: ' + rel, digest(file) === digest(path.join(candidate, rel)));
}
const canonicalClay = path.resolve('tools/KFB-ToolBox/worldbuilder/presentation/claybound-presentation.v1.js');
const mirroredClay = path.join(candidate, 'runtime/worldbuilder/presentation/claybound-presentation.v1.js');
ok('ClayBound presentation donor exact mirror', digest(canonicalClay) === digest(mirroredClay));

const index = fs.readFileSync(path.join(candidate, 'index.html'), 'utf8');
const flight = fs.readFileSync(path.join(candidate, 'flight-mode-c0.mjs'), 'utf8');
const clay = fs.readFileSync(path.join(candidate, 'clay-world-c0.mjs'), 'utf8');
const track = fs.readFileSync(path.join(candidate, 'track-module-c0.mjs'), 'utf8');
const ui = fs.readFileSync(path.join(candidate, 'world-c0-ui.mjs'), 'utf8');
const recipe = JSON.parse(fs.readFileSync(path.join(candidate, 'TRACK_MODULE_SOURCE.json'), 'utf8'));
const adapters = [flight, clay, track, ui].join('\n');

ok('C0 entry marker', index.includes('WORLD-FLIGHT-CLAY-C0'));
ok('accepted World r2 source marker', index.includes('58028b07d7618926c40ffaec3bd4053dc88c0efd'));
ok('accepted ClayBound source marker', index.includes('e1f693347fd0049deb9f7ef89ee85341bd9f355d'));
ok('one WorldBuilder runtime import', (index.match(/wb2d-app\.js/g) || []).length === 1);
ok('track recipe exact revision', recipe.revision === '2026-09-19.st01.1');
ok('track width classes retained', recipe.widthClasses.NARROW === 10.8 && recipe.widthClasses.HERO === 21.6);
ok('track entry and exit connectors declared', track.includes("'track.entry'") && track.includes("'track.exit'"));
ok('flight wraps existing play owner', flight.includes('baseUpdate=play.update.bind(play)') && flight.includes('play.update='));
ok('flight returns through existing placement owner', flight.includes('play.place('));
ok('clay collision owner stays World r2', clay.includes("collisionOwner:'World r2 unchanged'"));
ok('clay mode is reversible', clay.includes("terrain.material=on?clay.terrain:originals.terrain"));
ok('compact controls include walk/flight', ui.includes('Zu Fuß') && ui.includes('Flug'));
ok('compact controls include Original/Clay', ui.includes('Original') && ui.includes('Clay'));
ok('documentation is hidden by default', ui.includes('id="c0-help" hidden'));
ok('no second renderer or camera in adapters', !/new THREE\.(WebGLRenderer|PerspectiveCamera|OrthographicCamera)/.test(adapters));
ok('no placeholder branding', !/(Lorem|placeholder|helvetiker|TextGeometry)/i.test(adapters));
ok('no runtime file edited by adapter package', runtime.every(file => digest(file) === digest(path.join(candidate, path.relative(source, file)))));

console.log('WORLD FLIGHT CLAY C0 PACKAGE PASS ' + count + '/' + count);
