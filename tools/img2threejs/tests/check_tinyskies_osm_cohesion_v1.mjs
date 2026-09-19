import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {createWorldAppearanceState,deriveTinySkiesLikeObjectResponse,groundingContract,assertWorldAppearanceState} from '../styles/world-appearance-state.mjs';

const root=fileURLToPath(new URL('../',import.meta.url));
const contract=JSON.parse(readFileSync(root+'styles/tinyskies-osm-cohesion.v1.json','utf8'));
const profiles=JSON.parse(readFileSync(root+'styles/landmark-style-profiles.v1.json','utf8'));
const checks=[];
function ok(id,value,detail=null){checks.push({id,pass:!!value,detail});if(!value)throw Error('FAIL '+id+' '+JSON.stringify(detail));}

ok('default.landmark.grotesque',contract.defaultLandmarkShape==='city-grotesque');
ok('default.review.osm',contract.defaultReviewEnvironment==='osm');
ok('profiles.review.osm',profiles.defaultEnvironment==='osm');
ok('tinyskies.commit',contract.donor.commit==='2659a5cc987d7e4a4c5aa7e79c86a1626ad75df6');
ok('tinyskies.globe.pin',contract.donor.sources.globe==='c853d16bd7b5e44fcd331e6ff90ab82142e66c9e');
ok('tinyskies.daynight.pin',contract.donor.sources.dayNight==='dd485092e574037f9782f9ef68f7649e8e100287');
ok('tinyskies.rim.pin',contract.donor.sources.rimLight==='e2a669912b9cb65fc96889a544024bbe2e20be44');
ok('donor.shared-rim',contract.donorFacts.materialLanguage.sharedRimColour===true);
ok('donor.flat-shading',contract.donorFacts.materialLanguage.flatShading===true);
ok('donor.terrain-grounding',contract.donorFacts.grounding.terrainSurfaceSampled===true&&contract.donorFacts.grounding.propsSunkIntoTerrain===true);
ok('donor.rain-overlay',contract.donorFacts.weather.confirmedRainVisual==='RainOverlay');
ok('donor.no-wetness-claim',contract.donorFacts.weather.confirmedBuildingWetness===false);
ok('donor.no-rain-albedo-claim',contract.donorFacts.weather.confirmedBuildingAlbedoShift===false);

const state=createWorldAppearanceState({
  phase:{day:2,evening:1,night:1},
  rainWeight:1.5,
  rimColor:'#aabbcc',
  fog:{color:'#ccddee',near:10,far:100},
  cloudOpacity:.4,
  source:'test'
});
ok('state.schema',state.schema==='kfb.world-appearance-state/1.0');
ok('state.phase-normalized',Math.abs(state.phase.day-.5)<1e-12&&Math.abs(state.phase.evening-.25)<1e-12&&Math.abs(state.phase.night-.25)<1e-12,state.phase);
ok('state.rain-clamped',state.rainWeight===1,state.rainWeight);
ok('state.validate',assertWorldAppearanceState(state)===true);

const plain=deriveTinySkiesLikeObjectResponse(state,{});
ok('response.rim-pass',plain.rimColor==='#aabbcc');
ok('response.albedo-stable',plain.albedoMultiplier===1);
ok('response.wetness-baseline-zero',plain.wetness===0);
ok('response.roughness-baseline-zero',plain.roughnessDelta===0);
ok('response.no-emissive-role',plain.emissiveGain===0);

const windowRole=deriveTinySkiesLikeObjectResponse(state,{emissiveRole:'window',emissiveGain:1});
ok('response.emissive-role',windowRole.emissiveGain===1);
ok('response.world-only-weather',windowRole.weatherMaterialMode==='WORLD_ONLY_BASELINE');

const ground=groundingContract({terrainHeight:12.5,foundationDepth:.4,extraSlopeFoundation:.2});
ok('ground.mode',ground.mode==='terrain-sampled-foundation');
ok('ground.no-floating',ground.requireNoFloating===true);
ok('ground.values',ground.terrainHeight===12.5&&ground.foundationDepth===.4&&ground.extraSlopeFoundation===.2,ground);

ok('policy.world-owns',contract.kfbPolicy.worldOwns.includes('rimColor')&&contract.kfbPolicy.worldOwns.includes('weather'));
ok('policy.object-owns',contract.kfbPolicy.objectOwns.includes('baseAlbedo')&&contract.kfbPolicy.objectOwns.includes('identityPalette'));
ok('policy.hero-light-off',contract.kfbPolicy.landmarks.heroLightByDefault===false);
ok('policy.wetness-deferred',contract.kfbPolicy.weather.wetMaterialExtension==='DEFERRED_SEPARATE_GATE');

const out=root+'evidence/2026-09-19-tinyskies-osm-cohesion-v1/';
mkdirSync(out,{recursive:true});
const result={schema:'kfb.tinyskies-osm-cohesion.qa/1.0',evidenceClass:'STATIC_SOURCE_CONTRACT',browserWebGL:'NOT_RUN',publicStage:'NOT_DEPLOYED',passed:checks.length,total:checks.length,checks};
writeFileSync(out+'checks.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({passed:checks.length,total:checks.length},null,2));
