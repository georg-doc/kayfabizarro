// KFB FrankenStein Composer. Optional Wireface boundary, not live SDK integration.
// No renderer, AudioContext, replacement rig or hidden fake-face fallback.
// R2 (WS1, V-228 §4, WS0 14.10. Punkt 3): Erweiterung von #355 @bea811c1 für Figuren, die nicht aus KayKit-Körper + Kopf bestehen.
//  (a) composition.modelRef { path, revision (40 hex), blob (8–40 hex) } = EIN gepinntes Modell (z. B. FrizzleBob v5, Ohren am eigenen Skelett)
//      statt bodyRef + headRef; beides zugleich = COMPOSITION_AMBIGUOUS;
//  (b) rigFamily "CUSTOM" nur zusammen mit modelRef (eigenes Skelett, nicht KayKit);
//  (c) Exklusivität in beide Richtungen: KFB_NATIVE lehnt einen aktiven Wireface-Besitzer ab (vorher nur Wireface → KFB geprüft).
//      Die aktiven Besitzer leitet der Darsteller-Slot aus composition.faceOwners des Rezepts ab (actorSlot.js activeOwners).
// Alles andere ist unverändert; die #355-Tests laufen gegen diese Datei unverändert grün (test/actors.mjs).
export const FACE_MODES = Object.freeze(["KFB_NATIVE","WIREFACE_MESH","WIREFACE_MODEL","WIREFACE_SCREEN"]);
export const SCHEMA = "kfb.frankenstein.face-driver-companion/0.1";
export const RIG_FAMILIES = Object.freeze(["Rig_Medium","Rig_Large","Rig_Legacy","CUSTOM"]);
const check=(pass,reason)=>{if(!pass)throw new Error(reason)};
const vector=x=>Array.isArray(x)&&x.length===3&&x.every(n=>Number.isFinite(n));
export function companion(actor,options={}){
 check(actor?.primaryFormat==="kfb.pets/1"&&actor?.schema?.startsWith("kfb.actor-recipe/"),"ORIGINAL_ACTOR_RECIPE_REQUIRED");
 const {bodyRef,headRef,modelRef}=actor.composition||{};
 check(!(modelRef&&(bodyRef||headRef)),"COMPOSITION_AMBIGUOUS");
 const single=!!modelRef, str=x=>typeof x==="string"&&x.trim()===x&&x.length>0;
 if(single)check(str(modelRef.path)&&/^[0-9a-f]{40}$/.test(modelRef.revision)&&/^[0-9a-f]{8,40}$/.test(modelRef.blob)&&RIG_FAMILIES.includes(actor.source?.rigFamily),"MODEL_RIG_SOURCE_REQUIRED");
 else check(bodyRef&&headRef&&RIG_FAMILIES.slice(0,3).includes(actor.source?.rigFamily),"BODY_HEAD_RIG_SOURCE_REQUIRED");
 const mode=options.mode||"KFB_NATIVE";
 check(FACE_MODES.includes(mode),"UNSUPPORTED_FACE_DRIVER");
 check(options.audioClockOwner===undefined||options.audioClockOwner==="KFB_AUDIO_EXISTING","SECOND_AUDIO_CLOCK_FORBIDDEN");
 const native=mode==="KFB_NATIVE";
 if(native)check(!(options.activeFaceOwners||[]).some(x=>/wireface/i.test(x)),"DOUBLE_FACE_CHANNEL_OWNER");
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
  bodyRef:bodyRef||null,headRef:headRef||null,modelRef:single?Object.freeze({...modelRef}):null,rigFamily:actor.source.rigFamily,
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
