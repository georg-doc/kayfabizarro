
# KFB Production Architecture v3 · Character / Resident Production Workflow · 2026-09-24

Status: CURRENT WORKFLOW DECISION · BROWSER-FIRST POSE/SCENE · BLENDER FOR RIG/MOTION AUTHORING
Owner: KFB Web Architecture lane
Parent: START_HERE.md

## Purpose

This workflow decides where character/resident work should happen so Georg does not have to do delicate pose/scene work in Blender when the browser tools are better suited for it.

Rule:

Can current actor + current clip + browser pose/scene tools produce the desired result?
YES -> Resident Atlas / ToolBox.
NO because new time-based motion, retarget, rig, weights or topology is required -> Blender MCP.

Blender and browser authoring share contracts; they do not become two competing actor owners.

## 1 · Current source facts

### Resident Atlas S7 already proves browser posing / scene authoring

Current source:
tools/KFB-ToolBox/_inbox/KayKit Resident Atlas vS7/S38-rig-werkstatt/KFB_Resident_Atlas_S7.html
blob 20ef6153dcd4819fb6929a3c87e0e539aecdf4a3.

Current useful capabilities include:
- actor + prop scene recipes;
- object Move / Rotate / Scale;
- World / Local gizmo;
- Drop to support;
- Bone target selection;
- direct Bone rotation;
- puppet/IK handles for hands/feet;
- head/chest rotation handles;
- hip/root movement;
- optional foot/world-position locking;
- ground placement;
- freeze motion while adjusting;
- persistent Studio corrections;
- per-Resident check state;
- import/export of Resident Studio bundles;
- export of complete atlas scene recipes.

Therefore static pose, prop fit, contact setup and scene composition are browser-authoring tasks by default.

### Blender MCP proof is real but should be used for the right jobs

PR #192 head b49fb6e1adde070d658e1cc21dadb3294164cb29 proves direct Blender MCP authored animation and GLB export on a real KayKit actor.

Use Blender for:
- new time-based motion;
- clip repair over multiple frames;
- animation layering/baking;
- retargeting;
- skeleton/weight changes;
- head/body graft derivatives that require mesh/rig work;
- Action/NLA/export.

Do not send a static wrist angle, prop offset or scene layout to Blender merely because Blender can do it.

### Motion Library already exists

PR #197 head bf0eace2332a48f0b220318ad7567c68cc6dfbad already contains 33 Mixamo-derived actions on Rig_Medium and Rig_Large.

New Blender motion work must first ask whether the required action is already in the current Motion Library.

### Mixamo workflow is established

Current intake:
tools/KFB-ToolBox/_handover/WORLD_BUILDER_V1_2026-09-22/ANIMATION_INTAKE_01_MIXAMO_2026-09-24.md
blob 5b3e28a5cb16ae945959b311273cdaa13886808d.

Rules:
- raw FBX stays in Dropbox;
- runtime GLB libraries/catalogue may live in KFB repo;
- exact transfer if the uploaded KayKit skeleton is preserved;
- retarget only measured exceptions;
- EyeRig remains runtime/browser-owned, not baked by Blender.

## 2 · Decision table

Use Resident Atlas / ToolBox for:
- move/rotate/scale/drop actor or prop;
- static bone pose;
- rifle/drum/stick/guitar fit;
- scene composition;
- reusable Resident module authoring;
- choosing/testing existing motions;
- final visual fine-tuning.

Use Animation Studio for:
- speed, loop, crossfade, phase and beat alignment;
- choreography from existing actions;
- song/performance timeline.

Use Blender MCP for:
- a genuinely new motion;
- time-varying clip repair;
- Mixamo/external retarget;
- new body/head graft derivative;
- skeleton, weights or topology;
- bake/export.

Use Combat/Animation Studio for fight choreography. Blender is only needed when a reusable combat action is actually missing.

## 3 · Pose-to-Blender handoff

A browser pose is not throwaway.

Preferred route:

Resident Atlas / ToolBox
-> Georg poses actor + prop visually
-> export Studio Patch / Resident recipe
-> mark target contact/key pose
-> Blender MCP consumes the pose as reference
-> author/interpolate/bake only the missing time-based motion
-> GLB Action returns to Motion Library
-> Resident Atlas consumes the Action again.

This is the preferred path for drummer strike, rifle-ready pose, sword guard, two-hand prop contact and seated/cockpit acting.

Georg should not have to manipulate Blender bones merely to communicate the desired pose.

## 4 · KayfaBizarros Orc Band as Resident Scene Module

Current ORB source:
PR #195 head 9dda7957a33e69926265c1e3a69028a4b35b26f0.

Current accepted/product facts:
- Legacy Orc B leader: Georg OK;
- Orc Raider guitar fit: Georg OK;
- Orc Brute drummer unresolved;
- exact Wardrum + sticks exist;
- signature song exists;
- current Motion Library includes guitar/drum/dance source motions.

Previous automated drummer-arm fitting failed because numerical contact optimisation produced broken/twisted arms.

Preferred route:
Build a baseplate-free Resident Performance Scene containing:
- Orc B leader/dancer;
- Orc Raider guitarist;
- Orc Brute drummer;
- Wardrum;
- sticks;
- optional microphone/speaker/camp props;
- songRef;
- performanceRecipe.

There is no mandatory stage/floor mesh. The module can be placed into Tavern, street, Town, Card Zone, campsite or any WorldBuilder location. The host supplies the support surface.

### Drummer workflow

Browser first:
1. load Orc Brute + drum + sticks;
2. choose closest existing drum action / paused strike frame;
3. position drum and sticks;
4. use puppet/bone controls to make the visually accepted reference/contact pose;
5. save the pose/scene patch.

Then decide:
- if one constant correction survives the action acceptably, keep it as a Resident Studio patch;
- if correction must vary through the strike, send accepted pose targets to Blender MCP and author only that time-varying correction.

Do not run another automatic arm-to-drum solve.

### Performance recipe

Store references to:
- songRef;
- BPM;
- bar/phase offset;
- performers;
- action ids;
- pose patches;
- prop attachments;
- local transforms;
- optional beat markers.

Do not bake song, actors and world placement into one monolithic GLB.

## 5 · Reusable Resident vignettes / Resident City

The same module model supports:
- marching rifle character;
- tavern band;
- dancing pair;
- blacksmith/tool loop;
- combat exhibition;
- street performer;
- NPC gift vignette.

A Resident module may contain actors, props, attachments, posePatches, actions, performance/behavior recipe, audio refs, encounter hooks and local anchors.

No mandatory base plate.

## 6 · Rifle / marching Resident

The exact named “Musknacker” source is not currently pinned under that name in GitHub/Dropbox search. Do not silently map a different actor to it.

Useful donors exist:
- Resident Atlas S7 already measures/places rifle props including ToySoldier_Rifle;
- the Motion Library covers many Medium/Large locomotion/performance actions;
- the Mixamo intake pipeline is established.

When the exact actor is pinned:
1. load it in Resident Atlas/ToolBox;
2. attach the source-backed rifle;
3. pose/fit grip in browser;
4. audition current march/walk actions;
5. if suitable motion exists, save Resident scene/pose patch;
6. if missing, source one motion;
7. Blender MCP exact-transfers/retargets and bakes only that motion;
8. return it to Motion Library;
9. browser does final grip/pose/scene tuning.

## 7 · Legacy characters

Do not “re-rig Legacy” generically.

Legacy already has:
- Rig_Legacy;
- 6-bone / 30-clip animation rig;
- modular Dungeon kit bodies/heads/arms;
- complete Legacy character packs;
- current Legacy EyeRig/Combat readiness work.

Blender is justified for:
- one custom new Legacy derivative;
- a head/body graft outside the modular assembler;
- selected external motion that must be adapted to Rig_Legacy;
- geometry/weight repair.

Browser remains owner for existing Legacy assembly, EyeRig, pose, props and Resident scene.

## 8 · Frizzle-Orc family variants

Requested experiment:
take the existing Frizzle-Orc 3 / Rig-Warp identity and try it on:
- one Rig_Medium body;
- one Rig_Large body;
- one Rig_Legacy/custom Legacy body;
- a Legacy/template blank head plus the requested head accessories.

The exact Frizzle-Orc 3 Rig-Warp source path is not pinned from the current repository search.
Status: SOURCE_REQUIRED / USER-HAS-SOURCE.

Do not recreate it from prose.

### Blender architecture

Stage 0: isolate and show each real donor separately:
- Frizzle-Orc source;
- Medium body;
- Large body;
- Legacy body/template;
- blank/template head;
- requested accessories.

Stage 1: preserve destination rigs.
Prefer attaching/grafting the identity/head to the existing rig over warping one whole skeleton into another family.

Medium remains Rig_Medium.
Large remains Rig_Large.
Legacy remains Rig_Legacy.

Stage 2: use the least destructive head strategy:
- rigid head attachment where possible;
- separate skinned head only if needed;
- leave body mesh/weights unchanged where possible;
- clean donor face features only where required by the current FaceHost/EyeRig owner.

EyeRig is mounted later in ToolBox/runtime; Blender must not bake a competing eye system.

Stage 3: export one derivative GLB per family plus source/provenance, rig family, head/face anchors, material refs and known compatible action library.

This becomes an Actor Family Factory pattern rather than a one-off Frizzle-Orc build.

## 9 · Combat animation workflow

Order:
1. Actor Capability Matrix says what the fighter supports.
2. Animation/Duel Studio auditions existing KayKit/Motion Library actions.
3. Combat Studio tests silhouette, spacing, weapon contact, reaction and loop.
4. Only a genuinely missing reusable action goes to Blender.
5. Blender authors/retargets one action.
6. The action returns to Motion Library.
7. Combat choreography consumes it.

Not Blender-first:
weapon angle, stance, fighter spacing, prop placement, static guard pose, scene composition.

## 10 · Best next Blender job after current Race Track session

Do not interrupt current RKIT/track authoring.

If the Frizzle-Orc source is ready:
BLENDER-ACTOR-FAMILY-01 · Frizzle-Orc Medium / Large / Legacy derivatives.

Why:
- tests a reusable Actor Family Factory;
- spans three rig families;
- preserves current animation owners;
- creates immediately useful ToolBox roster content.

If the Frizzle-Orc source is not pinned:
BLENDER-MOTION-02 · one named missing high-value motion family, e.g. march/rifle, combat action or band/performance action.

Do not start another generic clip batch without new source clips.

Not recommended next:
- generic Legacy re-rigging;
- static drummer arm posing;
- Resident scene composition;
- prop placement.

## 11 · Prepared jobs

RESIDENT-BAND-MODULE-01 · READY
Build the baseplate-free KayfaBizarros performance scene in Resident Atlas/ToolBox with browser-first drummer reference posing.

POSE-TO-BLENDER-01 · READY
Prove one Studio Patch / target pose can drive a Blender key-pose/time-correction handoff and return a reusable Action.

BLENDER-ACTOR-FAMILY-01 · HOLD
Waiting only on exact Frizzle-Orc 3 Rig-Warp / blank-head/accessory source pins.

BLENDER-MOTION-02 · READY WHEN A NAMED MISSING CLIP EXISTS
One concrete missing march/combat/performance motion; not a speculative batch.

LEGACY-CUSTOM-ACTOR-01 · HOLD
One custom Legacy derivative after actor/source selection; not a rerig of the existing Legacy roster.

## 12 · Success criterion

Everyday visual authoring should happen in browser:
find actor -> choose clip -> pose -> fit prop -> arrange Resident scene -> save -> audition.

Blender is invoked only at the real boundary:
new motion, retarget, weights, topology, rig or bake.
