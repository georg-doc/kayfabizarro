import fs from 'node:fs';

const root='kfb-hub/stage/world/world-drive-interact-m2a';
const read=p=>fs.readFileSync(p,'utf8');
const drive=read(root+'/world-drive-m2a.mjs');
const physics=read(root+'/donor-race-pr10/physics.js');
const response=read(root+'/world-collision-response.mjs');
const mobility=read(root+'/world-mobility-m1.mjs');

const tests=[];
function ok(name,pass){if(!pass)throw new Error('FAIL '+name);tests.push(name);}

ok('terrain contact uses heightfield mesh',drive.includes('buildHeightfieldMesh(app.terrainHeightAt,contactRect,1)'));
ok('flat ground proxy removed',!drive.includes("{id:'world-ground',shape:'box'"));
ok('source Vehicle Lab carrig v3 consumed',drive.includes('carrig.v3.js')&&drive.includes('new WheelRig'));
ok('invented cylinder wheels removed',!drive.includes('CylinderGeometry(.42'));
ok('source profile consumed',drive.includes("vehicleProfile:'CAR_CHILL_LIGHT'")&&drive.includes('deformer-profiles.json'));
ok('receiver does not retune physics',!drive.includes('Object.assign(physics.params'));
ok('semantic forward cap follows physics owner',drive.includes('maxForward:physics.params.maxSpeed,maxBoost:physics.params.maxSpeed'));
ok('Race physical params preserved',physics.includes("export const PARAMS={engine:1000,maxSpeed:27,steerMax:.43,steerFalloff:.035,steerEase:.16,grip:4.5,driftGrip:1.0,side:1.8,driftSide:.55,hopImpulse:5.4,brake:80,slopeBrakeMax:40,coast:2}"));
ok('contact telemetry is read-only export',physics.includes('function contactFacts()')&&physics.includes('cameraClearance,contactFacts,step'));
ok('impact approach is captured pre-solver',physics.includes('lastIncoming=incoming')&&physics.includes('v=lastIncoming'));
ok('terrain collider does not block checkpoint occupancy',physics.includes("s.kind!=='terrain'&&!s.road"));
ok('directional impact path exists',drive.includes("direction==='front'")&&drive.includes("direction==='left'")&&drive.includes('deformer.railImpact'));
ok('landing drives deformer and world response',drive.includes('deformer.landing({strength})')&&drive.includes('presentation.landing'));
ok('authored props only get reactive colliders',response.includes("root.userData?.kind!=='prop'"));
ok('building response remains presentation-only',response.includes('kfbImpactAmp')&&response.includes('patchCityMesh')&&!response.includes('setTranslation('));
ok('temporary tyre tracks are bounded',response.includes('maxMarks=72')&&drive.includes('presentation.wheelTrack'));
ok('temporary impact impressions are bounded',response.includes('function dent(')&&response.includes('marks.length>maxMarks'));
ok('whole-car scale pulse removed',!mobility.includes('drivePulse')&&!mobility.includes('drive.root.scale'));

console.log('R0B COLLISION SOURCE TEST '+tests.length+'/'+tests.length+' PASS');
for(const t of tests)console.log('PASS '+t);
