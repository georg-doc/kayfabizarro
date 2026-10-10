'use strict';
const assert = require('node:assert/strict');
const manifest = require('../data/TRIPLET_AUDIO_INTEGRATION_R1_MANIFEST.json');
const identity = require('../runtime/voice-asset-identity.v1.js');
const poolAdapter = require('../runtime/real-pool-adapter.js');
let checks = 0;
const pass = (condition, message) => { assert.ok(condition, message); checks += 1; };
const roles = ['subject', 'connector', 'reframe'];
pass(manifest.schema === 'kfb.voice-triplet-audio-integration/1', 'schema');
pass(manifest.usage === 'NON_CANON_AUDITION', 'usage');
pass(manifest.source.sourceStatus === 'AUTHORING_CANDIDATE', 'source status');
pass(manifest.source.sourceRevision === 'cf975a72637630d97fc626962ef591b356ce0bbf', 'source revision');
pass(manifest.source.sourceNamespace === 'kfb.semantic-triplet', 'source namespace');
pass(JSON.stringify(manifest.source.beats) === JSON.stringify(['Nothing changed','except the frame','everything changed']), 'exact beats');
pass(JSON.stringify(manifest.site.resolverOrder) === JSON.stringify(['whole','fragments','browser']), 'whole-first resolver');
pass(manifest.render.rightsStatus === 'PENDING' && manifest.render.publicShip === false, 'rights/public gate');
pass(manifest.profiles.length === 3, 'three profiles');
for (const profile of manifest.profiles) {
  pass(profile.status === 'HEURISTIC_EDITABLE_CANDIDATE', profile.residentId + ' editable');
  for (const role of ['whole', ...roles]) {
    const refs = (role === 'whole' ? roles : [role]).map(part => ({
      sourceId: `${manifest.source.sourceNamespace}:${manifest.source.tripletId}:${part}`,
      sourceRevision: manifest.source.sourceRevision,
      textRevision: manifest.source.textRevisions[part]
    }));
    const request = {
      sourceRefs: refs,
      text: role === 'whole' ? manifest.source.visibleText : manifest.source.beats[roles.indexOf(role)],
      voicePreset: profile.voicePreset,
      emotion: profile.emotion
    };
    const recipe = {
      segmentRole: role,
      locale: manifest.render.locale,
      provider: manifest.render.provider,
      model: manifest.render.model,
      voiceId: profile.voiceId,
      recipeRevision: manifest.render.recipeRevision,
      settingsRevision: manifest.render.settingsRevision
    };
    const key = identity.makeKey(request, recipe);
    const asset = {...manifest.assets[profile.residentId][role], identityKey:key, sourceStatus:manifest.source.sourceStatus, rightsStatus:manifest.render.rightsStatus, castingStatus:manifest.render.castingStatus};
    pass(identity.evaluateAsset(asset, key, {mode:'audition'}).eligible, profile.residentId + ' ' + role + ' audition');
    pass(!identity.evaluateAsset(asset, key, {mode:'public'}).eligible, profile.residentId + ' ' + role + ' public rejected');
    pass(asset.duration > 0 && /^[a-f0-9]{64}$/.test(asset.sha256), profile.residentId + ' ' + role + ' receipt');
  }
}
const adapterSegments = poolAdapter.tripletToSegments({
  tripletId: manifest.source.tripletId,
  subject: manifest.source.beats[0],
  connector: manifest.source.beats[1],
  reframe: manifest.source.beats[2]
}, {
  sourceNamespace: manifest.source.sourceNamespace,
  sourceRevision: manifest.source.sourceRevision,
  sourceStatus: manifest.source.sourceStatus
});
pass(JSON.stringify(adapterSegments.map(x => x.sourceId)) === JSON.stringify(roles.map(role => `${manifest.source.sourceNamespace}:${manifest.source.tripletId}:${role}`)), 'role-specific source ids reuse triplet adapter contract');
const stable = {sourceRefs:[{sourceId:'x',sourceRevision:'r',textRevision:'t'}],text:'Exact',voicePreset:'p',emotion:'e'};
const recipe = {segmentRole:'whole',locale:'en',provider:'p',model:'m',voiceId:'v',recipeRevision:'r',settingsRevision:'s'};
pass(identity.makeKey(stable,recipe) === identity.makeKey(structuredClone(stable),structuredClone(recipe)), 'stable identity');
pass(identity.makeKey(stable,recipe) !== identity.makeKey({...stable,text:'Changed'},recipe), 'text invalidation');
console.log(JSON.stringify({status:'PASS',checks,profiles:manifest.profiles.length,assets:Object.values(manifest.assets).reduce((n,x)=>n+Object.keys(x).length,0)}, null, 2));
