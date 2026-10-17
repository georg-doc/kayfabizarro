// KFB FrankenStein Composer. Optional Wireface boundary, not live SDK integration.
// No renderer, AudioContext, replacement rig or hidden fake-face fallback.
export const FACE_MODES = Object.freeze(["KFB_NATIVE","WIREFACE_MESH","WIREFACE_MODEL","WIREFACE_SCREEN"]);
export const SCHEMA = "kfb.frankenstein.face-driver-companion/0.1";
const check=(pass,reason)=>{if(!pass)throw new Error(reason)};
const vector=x=>Array.isArray(x)&&x.length===3&&x.every(n=>Number.isFinite(n));
export function companion(actor,options={}){
 check(actor?.primaryFormat==="kfb.pets/1"&&actor?.schema?.startsWith("kfb.actor-recipe/"),"ORIGINAL_ACTOR_RECIPE_REQUIRED");
 const {bodyRef,headRef}=actor.composition||{};
 check(bodyRef&&headRef&&["Rig_Medium","Rig_Large","Rig_Legacy"].includes(actor.source?.rigFamily),"BODY_HEAD_RIG_SOURCE_REQUIRED");
 const mode=options.mode||"KFB_NATIVE";
 check(FACE_MODES.includes(mode),"UNSUPPORTED_FACE_DRIVER");
 check(options.audioClockOwner===undefined||options.audioClockOwner==="KFB_AUDIO_EXISTING","SECOND_AUDIO_CLOCK_FORBIDDEN");
 const native=mode==="KFB_NATIVE";
 if(!native){
  const source=options.faceSource,mount=options.mount;
  check(source?.proof==="SOURCE_ISOLATED_VISUALLY_VERIFIED"&&source.sourceId&&source.sourceRef&&source.sdkVersion,"VENDOR_FACE_SOURCE_NOT_ISOLATED");
  check(source.distributionReviewed===true,"WIRE_FACE_LICENCE_NOT_REVIEWED");
  check(mount?.headNodeId&&mount.measured===true&&vector(mount.at)&&vector(mount.rotation)&&Number.isFinite(mount.size)&&mount.size>0,"REAL_HEAD_MEASUREMENT_REQUIRED");
  const owners=options.activeFaceOwners||[];
  check(!owners.some(x=>["eye","mouth","lids","headRotation"].includes(x)),"DOUBLE_FACE_CHANNEL_OWNER");
 }
 return Object.freeze({
  schema:SCHEMA,actorSchema:actor.schema,actorId:actor.source.selectedId,
  bodyRef,headRef,rigFamily:actor.source.rigFamily,
  faceDriver:mode,channelOwner:native?"KFB_NATIVE":"WIREFACE_EXCLUSIVE",
  faceSource:native?null:Object.freeze({...options.faceSource}),
  mount:native?null:Object.freeze({...options.mount}),
  audioClockOwner:"KFB_AUDIO_EXISTING",
  exportMode:"ACTOR_RECIPE_PLUS_SEPARATE_FACE_RECIPE",
  status:native?"KFB_NATIVE_UNCHANGED":"SDK_LOAD_AND_VISUAL_PROOF_REQUIRED",
  selfContainedAnimatedGLBVerified:false,humanAccepted:false
 });
}
export function attachWireface({sdk,face,head,recipe,sourceProof=false}){
 check(recipe?.schema===SCHEMA&&recipe.faceDriver!=="KFB_NATIVE","WRONG_FACE_DRIVER");
 check(sourceProof===true,"SOURCE_VISUAL_PROOF_REQUIRED");
 check(typeof sdk?.attachFace==="function"&&face&&head,"VENDOR_SDK_FACE_HEAD_REQUIRED");
 check(head.name===recipe.mount?.headNodeId,"HEAD_MOUNT_IDENTITY_MISMATCH");
 const attachment=sdk.attachFace(head,face,{
  at:recipe.mount.at,rotation:recipe.mount.rotation,size:recipe.mount.size
 });
 check(attachment!=null&&attachment!==false,"WIRE_FACE_ATTACHMENT_FAILED");
 return {status:"SDK_ATTACHED_VISUAL_NOT_YET_ACCEPTED",attachment};
}
export function bindOwnerAudio({face,audioContext,audioSource}){
 check(audioContext&&audioSource&&typeof face?.listenTo==="function","EXISTING_AUDIO_SOURCE_REQUIRED");
 const binding=face.listenTo(audioContext,audioSource);
 return {binding,status:"BOUND_NOT_AUDIO_AUDITED",audioClockOwner:"KFB_AUDIO_EXISTING"};
}
