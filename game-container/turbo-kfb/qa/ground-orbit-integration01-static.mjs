import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const root=new URL('../',import.meta.url);
const main=await fs.readFile(new URL('app/src/main.js',root),'utf8');
const orbit=await fs.readFile(new URL('app/src/ground-orbit-camera.js',root),'utf8');
const player=await fs.readFile(new URL('app/src/ground-player.js',root),'utf8');
const walker=await fs.readFile(new URL('app/src/walk-controller.js',root),'utf8');
const feel=await fs.readFile(new URL('app/src/ground-feel.js',root),'utf8');

assert.match(main,/groundOrbit/);
assert.match(main,/GroundOrbitCamera/);
assert.match(main,/camera\.groundOrbit\.update/);
assert.match(orbit,/pointerdown/);
assert.match(orbit,/WheelEvent|wheel/);
assert.match(orbit,/KeyC/);
assert.match(player,/Running_B/);
assert.match(player,/Running_Strafe_Left/);
assert.match(walker,/feelMode/);
assert.match(feel,/stepLocalVelocity/);
console.log('RESULT 10/10 PASS');
