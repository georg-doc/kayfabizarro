import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import crypto from 'node:crypto';

const root = path.dirname(fileURLToPath(import.meta.url));
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const json = name => JSON.parse(read(name));
const catalog = json('catalog.snapshot.json');
const sound = json('soundscape-source.json');
const lock = json('source-lock.json');
const interaction = json('music-interaction-states.json');
const adaptive = json('adaptive-music-source.json');
const siteJs = read('audio-site.js');
const stemJs = read('adaptive-stems.mjs');
const voiceJs = read('voice-bench.js');
const cardPerformanceJs = read('card-performance.js');
const cardPerformanceCore = read('card-performance-core.mjs');
const cardPerformanceCss = read('card-performance.css');
const voiceData = json('voice-bench-data.json');
const voiceTriplet = json('voice-triplet-r1.json');
const html = read('index.html');
const require = createRequire(import.meta.url);
const voiceIdentity = require('./voice-asset-identity.v1.js');
const promptPack = read('prompts/KFB_MUSIC_CONTEXT_STYLES_BCD_v1.md');
const checks = [];
const check = (name, ok, detail = null) => {
  checks.push({ name, ok: Boolean(ok), detail });
  if (!ok) throw new Error(`${name}: ${JSON.stringify(detail)}`);
};

try {
  check('site source 0.10.0', html.includes('data-kfb-audio-site="0.10.0"'));
  check('catalog version', catalog.version === '2.0.0', catalog.version);
  check('54 catalog tracks', catalog.tracks.length === 54, catalog.tracks.length);
  check('44 RoadTrip tracks', catalog.tracks.filter(track => track.collection === 'roadtrip-v2').length === 44);
  check('14 catalog stem families', catalog.tracks.filter(track => track.stems).length === 14);
  check('unique track ids', new Set(catalog.tracks.map(track => track.id)).size === catalog.tracks.length);
  check('unique track files', new Set(catalog.tracks.map(track => track.file)).size === catalog.tracks.length);
  check('source lock has 44 masters', lock.roadTripV2.masters.length === 44);
  check('source lock has 14 stem families', lock.roadTripV2.stemFamilies.length === 14);
  check('rain explicitly missing', sound.missing.some(item => item.id === 'rain-bank' && item.status === 'SOURCE_REQUIRED'));
  check('music context schema', interaction.schema === 'kfb.audio.music-context/1.0', interaction.schema);
  check('three B/C/D states', JSON.stringify(Object.keys(interaction.states)) === JSON.stringify(['B', 'C', 'D']), Object.keys(interaction.states));
  check('default state C', interaction.defaultState === 'C', interaction.defaultState);
  check('TTS remains separate', interaction.ducking.separateFromMusicContextState && interaction.ducking.musicTimelineContinues);
  check('AudioContext clock owner', interaction.transitions.clockOwner === 'AudioContext.currentTime');
  check('complete transition matrix', Object.keys(interaction.transitions.matrixSeconds).length === 6);
  check('generic stems remain future', interaction.stemContract.availability === 'FUTURE_NOT_AVAILABLE');
  check('generic stems have no placeholder audio', interaction.stemContract.audioFiles.length === 0);
  for (const [id, state] of Object.entries(interaction.states)) {
    for (const key of ['energy', 'density', 'transientRestraint', 'percussionRestraint', 'speechSpaceBias']) {
      check(`${id} ${key} normalized`, state.targets[key] >= 0 && state.targets[key] <= 1, state.targets[key]);
    }
    check(`${id} positive crossfade`, state.targets.crossfadeSeconds > 0, state.targets.crossfadeSeconds);
    check(`${id} BPM metadata`, state.tempo.bpmMin > 0 && state.tempo.bpmMax >= state.tempo.bpmMin, state.tempo);
    check(`${id} prompt reference`, state.promptReference.path.endsWith('KFB_MUSIC_CONTEXT_STYLES_BCD_v1.md'));
  }
  check('D triplet metadata', interaction.states.D.tempo.tripletFriendly && interaction.states.D.tempo.preferredBpm === 94);
  check('World Billboard seam prepared only', interaction.worldIntegration.status === 'PREPARED_NOT_INTEGRATED' && interaction.worldIntegration.billboardHints.length === 3);
  check('12 B/C/D prompt entries', (promptPack.match(/^## /gm) || []).length === 12);
  check('Base B prompt present', promptPack.includes('KFB Base Style B · Downtown Groove Ecology'));
  check('Cozy C prompt present', promptPack.includes('KFB Cozy Style C · Base'));
  check('Conversation D prompt present', promptPack.includes('KFB Conversation Style D · Base'));

  check('adaptive proof schema', adaptive.schema === 'kfb.adaptive-music-proof/1', adaptive.schema);
  check('adaptive proof PR 365', adaptive.sourcePr === 365, adaptive.sourcePr);
  check('only G and D admitted', JSON.stringify(Object.keys(adaptive.decks)) === JSON.stringify(['G', 'D']), Object.keys(adaptive.decks));
  check('G 120 BPM', adaptive.decks.G.bpm === 120, adaptive.decks.G.bpm);
  check('D 94 BPM', adaptive.decks.D.bpm === 94, adaptive.decks.D.bpm);
  for (const [id, deck] of Object.entries(adaptive.decks)) {
    check(`${id} has 10 real stems`, deck.stems.length === 10, deck.stems.length);
    check(`${id} unique files`, new Set(deck.stems.map(stem => stem.file)).size === 10);
    check(`${id} unique roles`, new Set(deck.stems.map(stem => stem.role)).size === 10);
    for (const stem of deck.stems.filter(stem => stem.classification?.startsWith('MUTED'))) {
      check(`${id} ${stem.sourceLabel} muted`, stem.default === 0, stem.default);
    }
  }
  check('G has ROAD WIDE EPIC', JSON.stringify(Object.keys(adaptive.decks.G.presets)) === JSON.stringify(['ROAD', 'WIDE', 'EPIC']));
  check('D speech focus EQ', adaptive.decks.D.speechFocus.eqHz === 2200 && adaptive.decks.D.speechFocus.eqGainDb < 0, adaptive.decks.D.speechFocus);
  check('adaptive module creates no AudioContext', !/new\s+(?:window\.)?(?:AudioContext|webkitAudioContext)/.test(stemJs));
  check('adaptive diagnostics declare zero contexts', stemJs.includes('moduleCreatedAudioContexts: 0'));
  check('adaptive host injection required', stemJs.includes('Existing AudioContext host has not been injected'));
  check('common loop end prevents accumulated drift', stemJs.includes('source.loopEnd = minDuration'));
  check('gain-only presets', !stemJs.includes('playbackRate') && stemJs.includes('setPreset'));
  check('one Site AudioContext constructor', (siteJs.match(/new Context\(\)/g) || []).length === 1, (siteJs.match(/new Context\(\)/g) || []).length);
  check('Site injects SCORE destination', siteJs.includes('musicDestination:buses.SCORE'));
  check('no interval clock in Site', !siteJs.includes('setInterval('));
  check('consumer API exposed', siteJs.includes('adaptiveMusic:{startDeck:startAdaptiveDeck'));
  check('adaptive controls present', ['startStemG', 'startStemD', 'ttsToggle'].every(id => html.includes(`id="${id}"`)));
  check('voice bench 0.3 schema', voiceData.schema === 'kfb.chatterbox.voice-casting-bench/0.3');
  check('six editable story-mode candidates', voiceData.storyModes.length === 6 && voiceData.storyModes.every(mode => mode.affectCandidates.length >= 3 && mode.actingCandidates.length >= 3));
  check('story-mode mapping explicitly non-final', voiceData.status === 'EDITABLE_CANDIDATE_MAPPING' && voiceData.rules.storyModeMappingIsFinal === false);
  check('three named resident audition candidates', JSON.stringify(voiceData.residentCandidates.map(x => x.residentId)) === JSON.stringify(['demon-lord','robot-one','farmer-a']));
  check('semantic triplet fixture has three meaningful beats', voiceData.auditionItems[0].beats.length === 3 && voiceData.auditionItems[0].beats[1].length > 2);
  check('Waffle Fluff and Stay fluffy candidates', ['Waffle Fluff','Stay fluffy!'].every(text => voiceData.auditionItems.some(item => item.beats.includes(text))));
  check('voice bench creates no AudioContext', !/(?:new\s+)?(?:window\.)?(?:AudioContext|webkitAudioContext)\s*\(/.test(voiceJs));
  check('voice bench uses existing audio owner', voiceJs.includes('window.KFBAudioSite') && voiceJs.includes("setState('D'") && voiceJs.includes('setVoiceActive'));
  check('talk animation is event-only and no viseme claim', voiceJs.includes("kfb:talk-animation") && voiceJs.includes('TALK_LOOP_NO_LIPSYNC') && !voiceJs.includes('visemeIndex'));
  check('secure provider bridge keeps browser key-free', voiceData.providerCandidates.elevenLabs.status === 'OPTIONAL_SECURE_SERVER_BRIDGE' && !/xi-api-key|ELEVENLABS_API_KEY/.test(voiceJs));
  check('dynamic local clip ingestion', voiceJs.includes('indexedDB.open') && voiceJs.includes('putClip') && voiceJs.includes('kfb.voice-casting-session/0.3'));
  check('voice controls present', ['voiceResident','voiceModeGrid','voicePlayWhole','voicePlayFragments','voiceSpeak','voicePause','voiceStop','voiceMute','voiceBed','voiceDucking','voiceFiles','voiceQueueExport'].every(id => html.includes(`id="${id}"`)));
  check('source object isolated in UI', html.includes('id="voiceSourceObject"') && voiceJs.includes('renderSource'));
  check('source-bound Triplet schema', voiceTriplet.schema === 'kfb.voice-triplet-audition/1');
  check('candidate remains visibly non-canon', voiceTriplet.usage === 'NON_CANON_AUDITION' && voiceTriplet.source.status === 'AUTHORING_CANDIDATE' && html.includes('NON_CANON_AUDITION'));
  check('exact donor Triplet', voiceTriplet.source.tripletId === 'core.frame.01' && JSON.stringify(voiceTriplet.source.beats) === JSON.stringify(['Nothing changed','except the frame','everything changed']));
  check('exact donor revision', voiceTriplet.source.sourceRevision === 'cf975a72637630d97fc626962ef591b356ce0bbf');
  check('canonical triplet source namespace', voiceTriplet.source.sourceNamespace === 'kfb.semantic-triplet');
  check('explicit Whole-first resolver', JSON.stringify(voiceTriplet.resolverOrder) === JSON.stringify(['whole','fragments','browser']));
  check('three heuristic editable profiles', voiceTriplet.profiles.length === 3 && voiceTriplet.profiles.every(x => x.status === 'HEURISTIC_EDITABLE_CANDIDATE'));
  check('rights and public ship fail closed', voiceTriplet.assetPolicy.rightsStatus === 'PENDING' && voiceTriplet.assetPolicy.publicShip === false);
  for (const profile of voiceTriplet.profiles) {
    for (const role of ['whole','subject','connector','reframe']) {
      const asset = voiceTriplet.assets[profile.residentId][role];
      const file = path.join(root, asset.path.replace(/^\.\//,''));
      check(`${profile.residentId} ${role} WAV exists`, fs.existsSync(file) && fs.statSync(file).size > 1000, fs.existsSync(file) ? fs.statSync(file).size : 0);
      check(`${profile.residentId} ${role} SHA-256`, crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') === asset.sha256);
      const partRoles = ['subject','connector','reframe'];
      const refs = (role === 'whole' ? partRoles : [role]).map(part => ({sourceId:`${voiceTriplet.source.sourceNamespace}:${voiceTriplet.source.tripletId}:${part}`,sourceRevision:voiceTriplet.source.sourceRevision,textRevision:voiceTriplet.source.textRevisions[part]}));
      const request = {sourceRefs:refs,text:role === 'whole' ? voiceTriplet.source.visibleText : voiceTriplet.source.beats[partRoles.indexOf(role)],voicePreset:profile.voicePreset,emotion:profile.emotion};
      const recipe = {segmentRole:role,locale:voiceTriplet.assetPolicy.locale,provider:voiceTriplet.assetPolicy.provider,model:voiceTriplet.assetPolicy.model,voiceId:profile.voiceId,recipeRevision:voiceTriplet.assetPolicy.recipeRevision,settingsRevision:voiceTriplet.assetPolicy.settingsRevision};
      const key = voiceIdentity.makeKey(request, recipe);
      const candidate = {...asset,identityKey:key,sourceStatus:voiceTriplet.assetPolicy.sourceStatus,rightsStatus:voiceTriplet.assetPolicy.rightsStatus,castingStatus:voiceTriplet.assetPolicy.castingStatus};
      check(`${profile.residentId} ${role} private audition identity eligible`, voiceIdentity.evaluateAsset(candidate,key,{mode:'audition'}).eligible);
      check(`${profile.residentId} ${role} public use rejected`, !voiceIdentity.evaluateAsset(candidate,key,{mode:'public'}).eligible);
    }
  }
  const stableRequest={sourceRefs:[{sourceId:'x',sourceRevision:'r1',textRevision:'t1'}],text:'Exact text',voicePreset:'p',emotion:'e'};
  const stableRecipe={segmentRole:'whole',locale:'en',provider:'p',model:'m',voiceId:'v',recipeRevision:'r',settingsRevision:'s'};
  const stableKey=voiceIdentity.makeKey(stableRequest,stableRecipe);
  check('voice identity stable', stableKey === voiceIdentity.makeKey(structuredClone(stableRequest),structuredClone(stableRecipe)));
  check('voice identity invalidates text', stableKey !== voiceIdentity.makeKey({...stableRequest,text:'Changed text'},stableRecipe));
  check('missing source revision fails closed', (()=>{try{voiceIdentity.makeKey({...stableRequest,sourceRefs:[{sourceId:'x',textRevision:'t1'}]},stableRecipe);return false}catch{return true}})());
  check('static routes start lifecycle on actual media', voiceJs.includes('audio.onplaying=') && voiceJs.includes("setSpeaking(true,'voice-bench-"));
  check('pause and reset release focus', voiceJs.includes("setSpeaking(false,'voice-bench-pause')") && voiceJs.includes("setSpeaking(false,'voice-bench-reset')"));
  check('voice adapter is reused', voiceJs.includes('KFBVoiceAssetIdentity.makeKey') && voiceJs.includes('KFBVoiceAssetIdentity.evaluateAsset'));
  check('browser fallback has honest media safety route', voiceJs.includes("active.kind='browser-media'") && voiceJs.includes('Web Speech unavailable · identity-matched media started'));
  check('Card Performance editor stays in Voice Acting', html.includes('id="cardPerformanceEditor"') && html.indexOf('id="cardPerformanceEditor"') > html.indexOf('id="voiceSourceObject"') && html.indexOf('id="cardPerformanceEditor"') < html.indexOf('id="soundscape"'));
  check('Card Performance dynamic GitHub feed', cardPerformanceJs.includes('api.github.com/repos/') && cardPerformanceJs.includes('Reload GitHub content') === false && cardPerformanceJs.includes('fetchGithubFile'));
  check('no GitHub credential or client write route', !/github_pat_|ghp_|Authorization\s*:/i.test(cardPerformanceJs) && !/PUT|PATCH/.test(cardPerformanceJs));
  check('preview lane explicit', html.includes('PREVIEW · Voice PR #379') && cardPerformanceJs.includes('PREVIEW_REF'));
  check('accepted/local split explicit', html.includes('local, non-canon draft') && html.includes('Direct GitHub Save is intentionally absent'));
  check('local draft persistence', cardPerformanceJs.includes('localStorage.setItem(DRAFT_KEY') && cardPerformanceJs.includes('LOCAL_EDITORIAL_DRAFT'));
  check('revision and last-known-good cache', cardPerformanceJs.includes('ETAG_304') && cardPerformanceJs.includes('LAST_KNOWN_GOOD') && cardPerformanceJs.includes('expectedSha'));
  check('source count derives from metadata with legacy fixture compatibility', cardPerformanceCore.includes('deck.cards.length !== expectedCount') && cardPerformanceJs.includes('deckMeta'));
  check('one Card one sentence source model', cardPerformanceCore.includes("kind: 'card'") && cardPerformanceCore.includes('Card ${number} line'));
  check('missing source POWER or LORE stays explicit silence', cardPerformanceCore.includes('sourceTextOrSilence') && cardPerformanceCore.includes('explicit empty string'));
  check('required Stay Fluffy outro', cardPerformanceCore.includes("rows.at(-1) !== 'Stay Fluffy!'") && cardPerformanceCore.includes("text: 'Stay Fluffy!'"));
  check('typed bridge sidecar and safe no-edge', ['fromCardId','toCardId','relation','cost','callback','sourceRefs','editorialStatus','NO_EDGE'].every(term => cardPerformanceCore.includes(term)));
  check('no random connective pool', cardPerformanceCore.includes('selectBridge') && cardPerformanceCore.includes('eligible') && !/Math\.random/.test(cardPerformanceCore));
  check('single AudioContext remains owner', !/(?:new\s+)?(?:window\.)?(?:AudioContext|webkitAudioContext)\s*\(/.test(cardPerformanceJs));
  check('real D bed uses existing owner', cardPerformanceJs.includes('window.KFBAudioSite') && cardPerformanceJs.includes("startDeck?.('D')") && cardPerformanceJs.includes('setVoiceActive'));
  check('exact same control vocal dry and D', html.includes('cardExactDry') && html.includes('cardExactBed') && cardPerformanceJs.includes('triplet-core-frame-01/demon-lord/whole.wav'));
  check('browser boundary claim remains conditional', cardPerformanceJs.includes('onboundary') && html.includes('no waveform claim for browser voices'));
  check('rendition-specific cue verification', cardPerformanceJs.includes('!profile.sha256') && cardPerformanceJs.includes('EXACT_R2_RENDITION_WITH_50_MATCHING_CUES'));
  check('provenance exports present', ['cardExportJson','cardExportCsv','cardExportLyrics','cardCopyJson'].every(id => html.includes(`id="${id}"`)) && cardPerformanceCore.includes('csvForDraft') && cardPerformanceCore.includes('lyricsForDraft'));
  check('import surfaces include JSON CSV SRT text and audio', html.includes('accept="audio/*,.json,.csv,.srt,.txt"') && cardPerformanceJs.includes('indexedDB.open'));
  check('mobile Card Performance layout', cardPerformanceCss.includes('@media(max-width:760px)') && cardPerformanceCss.includes('.card-performance-grid'));

  console.log(JSON.stringify({
    status: 'PASS',
    checks: checks.length,
    catalogTracks: catalog.tracks.length,
    interactionStates: Object.keys(interaction.states).length,
    adaptiveDecks: Object.keys(adaptive.decks).length,
    realStemEntries: Object.values(adaptive.decks).reduce((sum, deck) => sum + deck.stems.length, 0),
    promptEntries: (promptPack.match(/^## /gm) || []).length,
    voiceStoryModes: voiceData.storyModes.length,
    voiceResidentCandidates: voiceData.residentCandidates.length,
    tripletAudioAssets: Object.values(voiceTriplet.assets).reduce((sum, actor) => sum + Object.keys(actor).length, 0),
    cardPerformanceChecks: checks.filter(check => /Card Performance|card|bridge|outro|GitHub|provenance|rendition/i.test(check.name)).length
  }, null, 2));
} catch (error) {
  console.error(JSON.stringify({ status: 'FAIL', checks, failure: String(error.stack || error) }, null, 2));
  process.exit(1);
}
