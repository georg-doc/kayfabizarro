/**
 * Source-profile admission only. No Three.js, transforms, animation or combat writer.
 * PASS here checks declared evidence; it never certifies a visible asset or gameplay.
 */
import { auditMuzzleEffects } from './muzzle-sources.v1.mjs';
export const POLICY_REVISION = '2026-10-21/V-574+V-579+V-581+V-582';
export function weaponPolicy({ origin, use }) {
  if (!['kit-original', 'custom'].includes(origin)) throw new TypeError('UNKNOWN_WEAPON_ORIGIN');
  if (!['target', 'melee', 'throw', 'carry'].includes(use)) throw new TypeError('UNKNOWN_WEAPON_USE');
  if (origin === 'kit-original') return Object.freeze({
    rule: 'V-574', axis: 'kit', mount: 'source-slot', nativeClipsUnchanged: true,
    forearmAxisRequired: false, armIKRequired: false, perFramePostPoseAllowed: false
  });
  if (use === 'target') return Object.freeze({
    rule: 'V-536', axis: 'forearm', mount: 'KFB_Grip', nativeClipsUnchanged: false,
    forearmAxisRequired: true, armIKRequired: true, perFramePostPoseAllowed: false
  });
  return Object.freeze({
    rule: use === 'melee' ? 'V-562' : use === 'throw' ? 'V-537' : 'V-536/carry',
    mount: 'KFB_Grip', forearmAxisRequired: false, armIKRequired: false,
    perFramePostPoseAllowed: false
  });
}
const finite3 = v => Array.isArray(v) && v.length === 3 && v.every(Number.isFinite);
const evidenceRef = v => typeof v === 'string' && v.trim().length > 0;
const unit3 = v => finite3(v) && Math.abs(Math.hypot(...v) - 1) <= 1e-6;
const unit4 = v => Array.isArray(v) && v.length === 4 && v.every(Number.isFinite) && Math.abs(Math.hypot(...v)-1)<5e-4;
const sameRotation = (a,b) => unit4(a) && Math.abs(Math.abs(a.reduce((n,v,i)=>n+v*b[i],0))-1)<5e-4;
const kitRotation = [0,Math.SQRT1_2,0,Math.SQRT1_2];
function slotIssues(c,need,{family=false}={}) {
 if(c.rotation!==undefined){
  need(c.reason==='kit-axis-mismatch' && evidenceRef(c.evidence),'KIT_AXIS_ROTATION_EVIDENCE_REQUIRED');
  need(unit4(c.rotation),'UNIT_SLOT_ROTATION_REQUIRED');
  if(!family)need(sameRotation(c.rotation,kitRotation),'KIT_AXIS_ROTATION_MUST_BE_MEASURED_Y90');
  if(c.position!==undefined){need(finite3(c.position),'FINITE_SLOT_OFFSET_REQUIRED');need(c.positionReason==='visible-interpenetration'&&evidenceRef(c.positionEvidence),'SLOT_POSITION_NEEDS_VISIBLE_INTERPENETRATION');}
 }else{
  need(c.reason==='visible-interpenetration'&&evidenceRef(c.evidence),'SLOT_OFFSET_NEEDS_VISIBLE_INTERPENETRATION');need(finite3(c.position),'FINITE_SLOT_OFFSET_REQUIRED');
 }
}
export function auditClipFamilies(f) {
 const issues=[],need=(ok,code)=>{if(!ok)issues.push(code);};
 if(!f||typeof f!=='object')return ['CLIP_FAMILIES_REQUIRED'];
 need(f.rule==='V-582'&&evidenceRef(f.evidence),'CLIP_FAMILY_EVIDENCE_REQUIRED');
 const seen=new Set();
 for(const id of ['aim','natural','layered']){
  const family=f[id];need(family&&Array.isArray(family.clips)&&family.clips.length>0,'CLIP_FAMILY_'+id.toUpperCase()+'_REQUIRED');
  if(!family)continue;
  for(const clip of family.clips||[]){need(evidenceRef(clip)&&!seen.has(clip),'CLIP_FAMILY_AMBIGUOUS');seen.add(clip);}
  if(family.slotOffset)slotIssues(family.slotOffset,need,{family:true});
  if(family.rootYawDeg!==undefined)need(id==='aim'&&Number.isFinite(family.rootYawDeg)&&evidenceRef(family.rootYawEvidence),'ROOT_YAW_ONLY_MEASURED_AIM_FAMILY');
  if(family.perClip){for(const [clip,offset]of Object.entries(family.perClip)){need(family.clips.includes(clip),'SLOT_CLIP_OUTSIDE_FAMILY');need(unit4(offset.rotation)&&finite3(offset.position)&&evidenceRef(offset.evidence),'PER_CLIP_MOUNT_PROOF_REQUIRED');}}
  if(id==='layered'){
   need(Array.isArray(family.parts)&&family.parts.length>=2,'LAYERED_NATIVE_PARTS_REQUIRED');
   const mask=new Set();for(const part of family.parts||[]){
    need(evidenceRef(part.sourceClip)&&evidenceRef(part.evidence)&&part.nativeClipUnchanged===true,'LAYERED_PART_SOURCE_REQUIRED');
    need(Array.isArray(part.mask)&&part.mask.length>0,'EXPLICIT_LAYER_MASK_REQUIRED');
    for(const bone of part.mask||[]){need(evidenceRef(bone)&&!mask.has(bone),'OVERLAPPING_LAYER_MASK');mask.add(bone);}
   }
  }
 }
 return issues;
}
export function auditWeaponProfile(p) {
  const issues = [];
  if (!p || typeof p !== 'object') return { status: 'CONTRACT_FAIL', issues: ['PROFILE_REQUIRED'], visualProofRequired: true };
  let policy;
  try { policy = weaponPolicy(p); } catch (e) { return { status: 'CONTRACT_FAIL', issues: [e.message], visualProofRequired: true }; }
  const need = (condition, code) => { if (!condition) issues.push(code); };
  const pinnedGit = /^[0-9a-f]{40}$/.test(p.source?.commit || '');
  const pinnedPrivate = p.source?.private === true && /^(private:|dropbox:)/.test(p.source?.path || '') &&
    /^[0-9a-f]{64}$/.test(p.source?.sha256 || '');
  need(evidenceRef(p.source?.path) && (pinnedGit || pinnedPrivate), 'EXACT_SOURCE_REQUIRED');
  need(p.instances === 1, 'ONE_WEAPON_INSTANCE_REQUIRED');
  need(p.mount?.kind === policy.mount, 'MOUNT_CONTRACT_MISMATCH');
  need(evidenceRef(p.mount?.evidence), 'MOUNT_EVIDENCE_REQUIRED');
  need(p.perFrameWeaponRotation === false, 'NO_PER_FRAME_WEAPON_ROTATION');
  if (p.origin === 'kit-original') {
    need(p.modelUnchanged === true, 'KIT_FORM_MUST_REMAIN_ORIGINAL');
    need(p.nativeClipsUnchanged === true, 'NATIVE_CLIPS_MUST_REMAIN_UNCHANGED');
    need(p.perFrameArmPostPose === false, 'NO_KIT_ARM_POSTPOSE');
    need(p.handCount === 'source', 'PRESERVE_SOURCE_HAND_COUNT');
    if(p.mount?.slotOffset!=null)slotIssues(p.mount.slotOffset,need);
    if(p.mount?.families!=null)issues.push(...auditClipFamilies(p.mount.families));
    if(p.mount?.rootYawDeg!=null)need(p.mount.rootYawDeg===0,'ROOT_YAW_ONLY_MEASURED_AIM_FAMILY');
  }
  if (p.origin === 'custom' && p.use === 'target') {
    need(p.grip === 'KFB_Grip', 'CUSTOM_GRIP_REQUIRED');
    need(p.muzzle?.node === 'KFB_Muzzle', 'CUSTOM_MUZZLE_REQUIRED');
    need(p.aimOwner === 'actor-arm-ik', 'CUSTOM_ARM_IK_OWNER_REQUIRED');
    need(evidenceRef(p.forearmGeometryEvidence), 'FOREARM_GEOMETRY_PROOF_REQUIRED');
  }
  if (p.use === 'target') {
    const archery=['bow','crossbow'].includes(p.weaponClass);
    const releaseFX=p.releaseEffect||(p.muzzle?.kind==='release'?p.muzzle:null);
    if(archery){
      need(!p.muzzle||p.muzzle.kind==='release','ARCHERY_MUST_NOT_FLASH');
      need(evidenceRef(p.release?.point)&&evidenceRef(p.release?.evidence),'ARCHERY_RELEASE_ANCHOR_REQUIRED');
      need(p.projectileDirection==='release-anchor','ARCHERY_PHYSICAL_RELEASE_DIRECTION_REQUIRED');
      if(releaseFX)need(releaseFX.kind==='release'&&['string-snap','dust-puff'].includes(releaseFX.type)&&Number.isFinite(releaseFX.durationSeconds)&&releaseFX.durationSeconds>0&&releaseFX.durationSeconds<=.25&&releaseFX.emissive===false&&evidenceRef(releaseFX.evidence),'BOUNDED_NONEMISSIVE_RELEASE_FX_REQUIRED');
    }else{
      issues.push(...auditMuzzleEffects(p.muzzle));
      need(['source-anchor','geometry-measured'].includes(p.muzzle?.kind),'PHYSICAL_MUZZLE_REQUIRED');
      need(evidenceRef(p.muzzle?.node)&&evidenceRef(p.muzzle?.evidence),'MUZZLE_EVIDENCE_REQUIRED');
      need(unit3(p.muzzle?.forwardLocal),'MEASURED_UNIT_MUZZLE_AXIS_REQUIRED');
      need(finite3(p.muzzle?.forwardLocal)&&p.muzzle.forwardLocal.every((n,i)=>n===[0,0,1][i]),'MUZZLE_LOCAL_Z_REQUIRED');
      need(p.projectileDirection==='muzzle','NO_TARGET_DIRECTED_RELEASE_BYPASS');
    }
  }
  if (p.use === 'throw') {
    need(evidenceRef(p.release?.point) && evidenceRef(p.release?.evidence), 'THROW_RELEASE_POINT_REQUIRED');
  }
  if (p.use === 'target' || p.use === 'throw') {
    need(Number.isFinite(p.release?.seconds) && p.release.seconds >= 0 &&
      Number.isFinite(p.release?.clipDuration) && p.release.clipDuration > p.release.seconds, 'RELEASE_MARKER_REQUIRED');
    need(evidenceRef(p.release?.clip) && evidenceRef(p.release?.evidence), 'RELEASE_SOURCE_REQUIRED');
    need(p.release?.oncePerAction === true, 'ONE_RELEASE_PER_ACTION_REQUIRED');
  }
  if (p.use === 'melee') need(evidenceRef(p.contact?.evidence) &&
    p.contact?.owner === 'existing-contact-ledger', 'MELEE_CONTACT_PROOF_REQUIRED');
  return { status: issues.length ? 'CONTRACT_FAIL' : 'CONTRACT_PASS', rule: policy.rule,
    issues, visualProofRequired: true };
}
