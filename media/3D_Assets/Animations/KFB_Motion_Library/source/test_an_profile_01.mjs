import { readFileSync } from 'node:fs';

const here = new URL('../', import.meta.url);
const sourceCatalog = JSON.parse(readFileSync(new URL('KFB_Motion_Library.catalog.json', here), 'utf8'));
const profileCatalog = JSON.parse(readFileSync(new URL('KFB_Motion_Library.profile-catalog.v1.json', here), 'utf8'));
const readerSource = readFileSync(new URL('motion-profile-reader.v1.js', here), 'utf8');
const reader = await import('data:text/javascript;base64,' + Buffer.from(readerSource).toString('base64'));

let passed = 0;
const failures = [];
function check(condition, message) {
  if (condition) passed += 1;
  else failures.push(message);
}
function close(a, b, eps = 1e-6) {
  return Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= eps;
}

check(profileCatalog.schema === 'kfb.motion-profile-catalog/1.0', 'profile schema');
check(profileCatalog.clipCount === 33, '33 profile clips');
check(sourceCatalog.clips.length === 33, '33 source clips');
check(profileCatalog.policy.noFilenameContactInference === true, 'no filename contact inference');
check(profileCatalog.policy.noCrossRigContactCopy === true, 'no cross-rig contact copy');
check(profileCatalog.policy.noRateWindowInheritance === true, 'no rate window inheritance');
check(profileCatalog.consumers.toolboxAnimationStudio != null, 'ToolBox Animation Studio consumer');
check(profileCatalog.consumers.worldBuilder != null, 'WorldBuilder consumer');
check(profileCatalog.referenceProfiles.humanAccepted === false, 'reference profiles not human accepted');
check(profileCatalog.referenceProfiles.scope.includes('REFERENCE_ONLY_KAYKIT_STOCK'), 'KayKit reference scope isolated');

const sourceIds = sourceCatalog.clips.map(c => c.id).sort();
const profileIds = Object.keys(profileCatalog.clipProfiles).sort();
check(JSON.stringify(sourceIds) === JSON.stringify(profileIds), 'profile ids exactly cover source catalogue');

for (const clip of sourceCatalog.clips) {
  const p = profileCatalog.clipProfiles[clip.id];
  check(!!p, `${clip.id}: profile exists`);
  if (!p) continue;

  check(p.durationSec === clip.durationSec, `${clip.id}: duration preserved`);
  check(p.rootTravel.mode === clip.rootMotion, `${clip.id}: root mode preserved`);
  check(p.rootTravel.direction === clip.travelDirection, `${clip.id}: direction preserved`);
  check(p.contacts.hands.status === 'UNKNOWN_NOT_MEASURED', `${clip.id}: hands remain unknown`);
  check(p.contacts.feet.Rig_Large.status === 'UNKNOWN_NOT_MEASURED', `${clip.id}: Large feet remain unknown`);
  check(p.acceptableRateWindow.status === 'UNKNOWN_NOT_MEASURED_FOR_THIS_CLIP', `${clip.id}: rate window remains unknown`);
  check(p.actionMarkers.contact === null, `${clip.id}: contact action marker not invented`);
  check(p.actionMarkers.release === null, `${clip.id}: release action marker not invented`);
  check(p.actionMarkers.impact === null, `${clip.id}: impact action marker not invented`);
  check(p.actionMarkers.recoveryStart === null, `${clip.id}: recovery marker not invented`);

  const rawFeet = clip.contacts?.feetGroundFrames || {};
  const medium = p.contacts.feet.Rig_Medium;
  if (Object.keys(rawFeet).length) {
    check(medium.status === 'MEASURED_THRESHOLD_WINDOWS', `${clip.id}: Medium foot windows measured`);
    check(JSON.stringify(medium.frameIntervals) === JSON.stringify(rawFeet), `${clip.id}: raw foot windows unchanged`);

    for (const [foot, ranges] of Object.entries(p.plantedIntervals.Rig_Medium.feet || {})) {
      check(Array.isArray(ranges), `${clip.id}/${foot}: planted intervals array`);
      for (const interval of ranges) {
        check(interval.frames[0] >= 1 && interval.frames[1] <= clip.frames, `${clip.id}/${foot}: frames bounded`);
        check(interval.phase[0] >= 0 && interval.phase[1] <= 1, `${clip.id}/${foot}: phase bounded`);
        check(interval.seconds[0] >= 0 && interval.seconds[1] <= clip.durationSec + (1 / clip.fps), `${clip.id}/${foot}: seconds bounded`);
      }
    }
  }

  if (clip.rootMotion === 'travel') {
    check(p.rootTravel.referenceSpeed.status === 'MEASURED_DERIVED', `${clip.id}: travel ref speed derived`);
    for (const rig of clip.rigs) {
      const expected = Math.abs(clip.travelMetersPerCycle[rig]) / clip.durationSec;
      const actual = p.rootTravel.referenceSpeed.metersPerSecond[rig];
      check(close(actual, expected, 1e-6), `${clip.id}/${rig}: ref speed = travel/duration`);
      check(close(reader.getReferenceSpeedMps(p, rig), actual), `${clip.id}/${rig}: reader returns ref speed`);
    }
  } else {
    check(p.rootTravel.referenceSpeed.status === 'UNKNOWN_NOT_APPLICABLE_TO_IN_PLACE_CLIP', `${clip.id}: in-place ref speed unknown`);
    for (const rig of clip.rigs) {
      check(reader.getReferenceSpeedMps(p, rig) === null, `${clip.id}/${rig}: reader returns null ref speed`);
    }
  }

  check(reader.getClipProfile(profileCatalog, clip.id) === p, `${clip.id}: reader profile lookup`);
}

const climbTop = profileCatalog.clipProfiles.kfb_climb_to_top_a;
check(reader.hasMeasuredActionMarker(climbTop, 'endsOnTop') === true, 'climb-to-top endsOnTop marker explicit');
check(climbTop.actionMarkers.markers.length === 1, 'climb-to-top has exactly one explicit action marker');
check(profileCatalog.clipProfiles.kfb_music_drums_a.semantics.stance === 'seated', 'drums seated stance from RETURN evidence');
check(profileCatalog.clipProfiles.kfb_idle_kneeling_a.semantics.stance === 'kneeling', 'kneeling stance from catalogue semantics');
check(profileCatalog.clipProfiles.kfb_idle_ninja_a.semantics.stance === 'unknown', 'unmeasured stance remains unknown');

const validation = reader.validateMotionProfileCatalog(profileCatalog);
check(validation.ok === true, 'reader validates catalogue');
check(reader.getKayKitReferenceProfile(profileCatalog, 'Rig_Medium') != null, 'reader exposes Rig_Medium reference only');
check(reader.getKayKitReferenceProfile(profileCatalog, 'Rig_Large') != null, 'reader exposes Rig_Large reference only');

if (failures.length) {
  console.error(`AN-PROFILE-01 FAIL: ${failures.length} failed / ${passed + failures.length} total`);
  for (const failure of failures) console.error(' - ' + failure);
  process.exit(1);
}
console.log(`AN-PROFILE-01 PASS: ${passed}/${passed} assertions`);
