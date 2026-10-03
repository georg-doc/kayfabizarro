import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { SOURCE, ROLES } from '../kfb-lib/locomotion-profiles.v1.js';

const contract=JSON.parse(fs.readFileSync(new URL('../kfb-lib/MOTION_STATE_CONTRACT.v1.json',import.meta.url),'utf8'));
const role=(name)=>ROLES.find((x)=>x.role===name);

test('ActionFigure primary locomotion source is KayKit Character Animations 1.1',()=>{
  assert.equal(SOURCE.pack,'KayKit Character Animations 1.1');
  assert.equal(SOURCE.commit,'b97b5ac55df2724fae623992433685583eece51e');
  assert.deepEqual(SOURCE.sets,['General','MovementBasic','MovementAdvanced']);
});

test('canonical native roles stay on original KayKit clips',()=>{
  assert.equal(role('idle').clip,'Idle_A');
  assert.equal(role('walk').clip,'Walking_A');
  assert.equal(role('run').clip,'Running_A');
  assert.equal(role('backward').clip,'Walking_Backwards');
  assert.equal(role('strafe.left').clip,'Running_Strafe_Left');
  assert.equal(role('strafe.right').clip,'Running_Strafe_Right');
  assert.equal(role('jump.start').clip,'Jump_Start');
  assert.equal(role('jump.air').clip,'Jump_Idle');
  assert.equal(role('jump.land').clip,'Jump_Land');
});

test('contract makes KayKit native source priority 1',()=>{
  assert.equal(contract.sourcePriority?.[0]?.priority,1);
  assert.match(contract.sourcePriority?.[0]?.source||'',/KayKit Character Animations 1\.1/);
  assert.match(contract.sourcePriority?.[0]?.policy||'',/must not be replaced/i);
});

test('Motion Library and Ladder 02 are supplementary / archived, not primary',()=>{
  assert.equal(contract.sourceLineage?.motionLibraryV7?.status,'SUPPLEMENTARY_VARIANT_ACTION_LIBRARY_NOT_PRIMARY_LOCOMOTION');
  assert.equal(contract.sourceLineage?.blenderLadder?.status,'ARCHIVED_GAP_DONOR_NOT_PRIMARY_LOCOMOTION');
  assert.match(contract.currentRigMediumEvidence?.mixamoPolicy||'',/SUPPLEMENTARY_ONLY/);
});

test('failed mixed freeplay cannot be treated as accepted baseline',()=>{
  assert.equal(contract.currentRigMediumEvidence?.previousCandidate?.status,'ARCHIVED_FAILED_CANDIDATE');
  assert.equal(contract.currentRigMediumEvidence?.previousCandidate?.userVerdict,'HUMAN_FAIL');
  assert.equal(contract.prototypeGate?.status,'BLOCKED_BY_HUMAN_FAIL');
});

test('next gate is Blender-native baseline before another runtime',()=>{
  assert.equal(contract.prototypeGate?.nextGate,'KAYKIT-NATIVE-BLENDER-BASELINE-01');
  assert.equal(contract.prototypeGate?.nextExecutor,'Coworker / Blender MCP');
  assert.match(contract.prototypeGate?.purpose||'',/before any controller/i);
});
