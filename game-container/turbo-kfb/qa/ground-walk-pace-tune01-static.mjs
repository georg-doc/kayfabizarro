import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const root=new URL('../',import.meta.url);
const player=await fs.readFile(new URL('app/src/ground-player.js',root),'utf8');
const main=await fs.readFile(new URL('app/src/main.js',root),'utf8');
const walker=await fs.readFile(new URL('app/src/walk-controller.js',root),'utf8');
const feel=await fs.readFile(new URL('app/src/ground-feel.js',root),'utf8');
const orbit=await fs.readFile(new URL('app/src/ground-orbit-camera.js',root),'utf8');

assert.match(player,/const PLAYABLE_WALK_SPEED = 1\.108;/);
assert.match(player,/const WALK_SPEED = PLAYABLE_WALK_SPEED;/);
assert.match(player,/const HANDOFF_SPEED = PLAYABLE_WALK_SPEED;/);
assert.match(player,/walkReferenceSpeed:REF_SPEED\[CLIP\.walk\]/);
assert.match(player,/walkPlaybackRateAtTarget:enhanced\?rateFor\(CLIP\.walk,WALK_SPEED\)/);
assert.match(player,/const RATE_MAX = 1\.8;/);
assert.match(main,/GroundOrbitCamera/);
assert.match(walker,/feelMode/);
assert.match(feel,/stepLocalVelocity/);
assert.match(orbit,/pointerdown/);
console.log('RESULT 10/10 PASS');
