import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const player=await fs.readFile(new URL('../app/src/ground-player.js',import.meta.url),'utf8');
const owner=await fs.readFile(new URL('../../../tools/KFB-ToolBox/kfb-lib/locomotion-profiles.v1.js',import.meta.url),'utf8');
const anim=await fs.readFile(new URL('../../../tools/KFB-ToolBox/kfb-lib/anim-map.v1.js',import.meta.url),'utf8');

assert.match(owner,/export const SCHEMA = 'kfb\.locomotion-profile-set\/0\.1'/);
assert.match(owner,/role: 'run'[\s\S]*clip: 'Running_A'/);
assert.match(owner,/role: 'sprint'[\s\S]*among: \['Running_B'\]/);
assert.match(owner,/'run→sprint': \{ fade: 0\.15, syncPhase: true \}/);
assert.match(owner,/'sprint→run': \{ fade: 0\.2, syncPhase: true \}/);
assert.match(anim,/id:'DriveSteerLeft'[\s\S]*fallback:'PROCEDURAL'/);
assert.match(player,/from '\/tools\/KFB-ToolBox\/kfb-lib\/locomotion-profiles\.v1\.js'/);
assert.match(player,/buildProfileSet\(THREE/);
assert.match(player,/consumerView\(travelProfileSet\)/);
assert.match(player,/const TRAVEL_FORWARD_SPEED = 5\.4/);
assert.match(player,/const TRAVEL_SPRINT_SPEED = 9\.45/);
assert.match(player,/TRAVEL_RATE_MAX = 3\.0/);
assert.doesNotMatch(player,/TRAVEL_CADENCE/);
assert.match(player,/profileTransition\(currentRole,nextRole\)/);
assert.match(player,/profileContactPhase\(currentRole\)/);
assert.match(player,/profileOwner:walkPace==='travel'\?PROFILE_OWNER_PATH:null/);
console.log('RESULT 16/16 PASS');
