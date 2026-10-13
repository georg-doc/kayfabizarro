// Source-only handoff QA; NOT a substitute for KFB Audio consumePacket accepted-only.
// Usage from repo root:
// node kfb-hub/stage/toolbox/frankenstein-composer/tests/wireface-theatre-card-readiness-preflight-r1.mjs <local-readiness-json> [local-audio-consumer-packet-json]
// Readiness snapshot and Audio export are intentionally separately fetched, not copied into Composer runtime.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

export const CHECK_SCHEMA='kfb.frankenstein.wireface-theatre-card-mvp-readiness/1';
export const PACKET_SCHEMA='kfb.voice.card-performance-packet/1';

export function inspectReadiness(snapshot, consumerPacket=null) {
  const planIssues=[], productBlockers=[], evidence=[];
  if(snapshot?.schema!==CHECK_SCHEMA) planIssues.push('INVALID_READINESS_SCHEMA');
  if(snapshot?.owner?.pr!==355) planIssues.push('WRONG_COMPOSER_OWNER');
  if(snapshot?.dependencies?.audio?.pr!==365 || snapshot?.dependencies?.voice?.pr!==379)
    planIssues.push('WRONG_SOURCE_OR_AUDIO_OWNER');
  if(snapshot?.dependencies?.audio?.consumerSchema!==PACKET_SCHEMA)
    planIssues.push('WRONG_AUDIO_CONSUMER_SCHEMA');
  if(snapshot?.vendor?.name!=='Wireface Three.js (not unrelated Babylon library)')
    planIssues.push('UNVERIFIED_VENDOR_IDENTITY');
  if(snapshot?.guards?.oneComposerRenderer!==true || snapshot?.guards?.oneKfbAudioClockOwner!==true)
    planIssues.push('SECOND_RUNTIME_OWNER_FORBIDDEN');
  if(!snapshot?.fixture?.originalCardBlob || !snapshot?.fixture?.originalCardName)
    planIssues.push('MISSING_ORIGINAL_CARD_SOURCE');
  if(planIssues.length===0)evidence.push('SCHEMA_AND_SOURCE_OWNER_PLAN_READY');

  // Dynamic packet evaluation is a preliminary sanity check only. The Audio
  // owner's actual consumePacket() remains the authoritative validator.
  if(!consumerPacket) productBlockers.push('CURRENT_AUDIO_CONSUMER_PACKET_NOT_PROVIDED');
  else {
    if(consumerPacket.schema!==PACKET_SCHEMA)
      productBlockers.push('INVALID_AUDIO_PACKET_SCHEMA');
    if(consumerPacket.preview!==false)
      productBlockers.push('PREVIEW_IS_NOT_CANON');
    const beats=consumerPacket.CardBeats||[];
    if(!beats.length || beats.some(b=>b.status!=='ACCEPTED' ||
      !['ACCEPTED','KEEP'].includes(b.humanAcceptance)))
      productBlockers.push('NO_HUMAN_ACCEPTED_CARD_BEAT');
    const openers=consumerPacket.Openers||[];
    if(!openers.length || openers.some(o=>o.status!=='ACCEPTED' || o.enabled===false))
      productBlockers.push('NO_ACCEPTED_ENABLED_OPENER');
    const clips=consumerPacket.VoiceClips||[];
    if(!clips.length || clips.some(c=>
      !/^[a-f0-9]{64}$/.test(c.sha256||c.sha||'') ||
      !Number.isFinite(c.durationMs) || c.durationMs<=0))
      productBlockers.push('NO_SHA_AND_DURATION_VERIFIED_VOICE_CLIP');
    const visuals=consumerPacket.CardVisuals||[];
    if(!visuals.length || visuals.some(c=>
      c.status!=='VERIFIED_EXACT_CARD_CROP'))
      productBlockers.push('ORIGINAL_CARD_CROP_NOT_VERIFIED');
    if(consumerPacket.contentBlob!==snapshot?.dependencies?.voice?.poolBlob)
      productBlockers.push('CONTENT_REVISION_DIFF_RE_FETCH_LIVE_SOURCE');
  }
  if(snapshot?.vendor?.licensedForThisKfbDistribution!==true)
    productBlockers.push('WIRE_FACE_VENDOR_LICENSE_NOT_VERIFIED');
  if(snapshot?.vendor?.demoSourceVisuallyIsolatedInComposer!==true)
    productBlockers.push('WIRE_FACE_OBJECT_NOT_ISOLATED');
  if(snapshot?.vendor?.sdkVersionVerified!==true)
    productBlockers.push('VENDOR_SDK_VERSION_NOT_VERIFIED');
  if(snapshot?.fixture?.audioRightsVerified!==true)
    productBlockers.push('REUSABLE_AUDIO_RIGHTS_NOT_VERIFIED');
  if(snapshot?.fixture?.renderedCueTimesVerified!==true)
    productBlockers.push('VOICE_TO_FACE_CUE_TIMES_NOT_MEASURED');

  return {
    status:planIssues.length?'PLAN_BLOCKED':
      productBlockers.length?'PLAN_GO_PRODUCT_NO_GO':'PRODUCT_READINESS_CANDIDATE_REQUIRES_REAL_QA',
    composerPlanAllowed:planIssues.length===0,
    liveMvpAllowed:false, // must only be promoted via actual owner, vendor, voice & human browser proof
    planIssues,productBlockers,evidence,
    caveat:'Snapshot and packet are neither an accepted live performance nor a substitute for real Audio consumePacket and WebGL/rights/browser proof.'
  };
}
const invoked=process.argv[1] && fileURLToPath(import.meta.url)===process.argv[1];
if(invoked){
  const [readinessPath,packetPath]=process.argv.slice(2);
  if(!readinessPath){
    console.error('Usage: node .../wireface-theatre-card-readiness-preflight-r1.mjs <readiness.json> [audio-export.json]');
    process.exitCode=2;
  } else {
    const snapshot=JSON.parse(readFileSync(readinessPath,'utf8'));
    const packet=packetPath?JSON.parse(readFileSync(packetPath,'utf8')):null;
    const decision=inspectReadiness(snapshot,packet);
    console.log(JSON.stringify(decision,null,2));
    // Planning only exits 0; production no-go is always reported in structured output.
    if(!decision.composerPlanAllowed)process.exitCode=2;
  }
}
// Node's assert imported only for independent fixture runners, not used for runtime approvals.
