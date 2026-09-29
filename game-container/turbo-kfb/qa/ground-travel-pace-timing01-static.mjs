import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const player=await fs.readFile(new URL('../app/src/ground-player.js',import.meta.url),'utf8');
const main=await fs.readFile(new URL('../app/src/main.js',import.meta.url),'utf8');

assert.match(player,/const TRAVEL_CADENCE = 1\.8/);
assert.match(player,/TRAVEL_FORWARD_SPEED = RUN_SPEED \* TRAVEL_CADENCE/);
assert.match(player,/TRAVEL_SPRINT_SPEED = SPRINT_SPEED \* TRAVEL_CADENCE/);
assert.match(player,/forwardSprintSpeed = walkPace === 'travel' \? TRAVEL_SPRINT_SPEED : SPRINT_SPEED/);
assert.equal((player.match(/forwardSprintSpeed\/baseForwardSpeed/g)||[]).length,2);
assert.match(player,/travelRunPlaybackRate:walkPace==='travel'\?rateFor\(CLIP\.run,TRAVEL_FORWARD_SPEED\):null/);
assert.match(player,/travelSprintPlaybackRate:walkPace==='travel'\?rateFor\(CLIP\.sprint,TRAVEL_SPRINT_SPEED\):null/);
assert.match(main,/const dt = Math\.min\(rawDt, 1 \/ 30\)/);
assert.match(main,/function simulateTravelElapsed\(w, elapsed\)/);
assert.match(main,/TRAVEL_TIMING_REQUESTED && w\.controlMode === 'ground'/);
assert.match(main,/if \(travelGround\)[\s\S]*simulateTravelElapsed\(w, rawDt\)[\s\S]*else[\s\S]*simulate\(w, dt\)/);
assert.match(main,/advanceTravelFrame\(seconds\)/);
console.log('RESULT 12/12 PASS');
