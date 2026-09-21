# KFB ToolBox · Legacy RPG Rigging Lab · Failure Recovery Export

**Date:** 2026-09-21  
**Status:** ARCHIVED_FAILED_BROWSER_GATE_CANDIDATE · SOURCE/STATIC SALVAGEABLE  
**Owner:** KFB ToolBox / Rigging  
**Repo:** georg-doc/kayfabizarro  
**Branch:** `chatgpt-web/toolbox-legacy-rpg-rigging-2026-09-21`  
**Draft PR:** #155  
**Fixed intended Stage:** https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/legacy-rpg-rigging/

## 1 · Preserved candidate

The editable candidate remains on the branch. Do not delete or rewrite it.

Implementation/source files:
- `tools/KFB-ToolBox/legacy-rpg-rigging/`
- `kfb-hub/stage/toolbox/legacy-rpg-rigging/`
- `.github/workflows/toolbox-legacy-rpg-rigging-test.yml`

Current recovery head when this export was started:
`b9b150b971fcc3fdac087b617b73420fded01575`

Prior complete implementation/test head:
`dd439ecbf6fa063175db7c2dd9820285b1bf982a`

A transient Git-data write at `b3907029f9a3b983ff1a183d9e505fb220505807` accidentally created an incomplete tree containing only the two proof files because the base-tree SHA was absent. It was immediately recovered without force-push by fast-forwarding to `b9b150b971fcc3fdac087b617b73420fded01575`, whose tree restores the full candidate and applies the proof change. Exact core files were read back after recovery.

## 2 · Source truth preserved

Dungeon source:
`media/3D_Assets/KayKit Legacy/KayKit Dungeon Pack 1.0 2/`

Source pin:
`eb48f50489b9e4903ec1e3d2fb1837605ce7d792`

License:
CC0

Cataloged candidate:
- 4 static modular character bodies: Barbarian, Knight, Mage, Rogue;
- 17 head choices: 4 embedded defaults + 12 alternate class heads + Skull;
- 5 embedded head-gear/hair sources;
- 24 tiered weapons: 8 families × common/uncommon/rare;
- Arrow + three Quivers + Spell Book;
- clothing/body appearance recorded from source body-material inventories because the pack does not provide a detached clothing asset set.

Legacy motion donor:
`media/3D_Assets/KayKit Legacy/KayKit Character Animations 1.2 - legacy/Animations/gltf/KayKit_AnimatedCharacter_v1.2.glb`

Rig pin:
`10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0`

Measured donor contract:
- 6 bones: Body · Head · armLeft · handSlotLeft · armRight · handSlotRight;
- 30 embedded clips.

Eye owner remains:
`tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/pet-eye-rig.v6.js`

No source GLTF/GLB is rewritten.

## 3 · Salvage map

### KEEP · source/catalog

`data/catalog.v1.json`
- source-backed roster/counts;
- semantic motion names;
- exact source paths;
- no placeholders.

### KEEP · assembly mechanism

`lib/legacy-rig-adapter.v1.js`
- reuses Resident Atlas inverse-bind placement;
- preserves rigid Body/Head/ArmLeft/ArmRight assembly;
- handles the literal Mage `ArnLeft` source typo through normalization rather than asset mutation;
- retains rigid-arm paw-anchor attachment logic.

### KEEP · Legacy face bridge

`lib/legacy-facehost.v1.js`
- separate LegacyFaceHost because the normal skinned FaceHost correctly cannot measure unskinned static heads;
- preserves EyeRig's `body` host contract;
- candidate eye measurement remains review-only.

### KEEP · authoring surface

`index.html · app.js · styles.css`
- source-isolation first;
- body/head assembly;
- weapon audition;
- native Legacy animation controls;
- EyeRig-v6 candidate controls;
- Pack Sheet reference.

### HOLD · browser acceptance

Do not publish the Stage candidate or claim runtime PASS until the actor-switch readiness gate below is deterministic.

## 4 · Actual evidence

### Static/source

Latest failed browser run still passed the complete source/static suite:

**26/26 PASS**

This includes:
- 4 bodies;
- 17 heads;
- 24 weapons;
- 10 gear/props;
- 30 clips;
- exact Legacy core-bone contract;
- inverse-bind assembly;
- paw-anchor mechanism;
- EyeRig v6 reuse;
- LegacyFaceHost body-host contract;
- source-isolation/no-placeholder guard;
- JS module parsing.

### Browser attempt A

Workflow run:
`35543850991`

Observed:
- HTTP PASS;
- READY PASS;
- source-isolate PASS;
- Barbarian donor visible PASS;
- WebGL canvas PASS;
- all catalog-count/semantic checks PASS.

Failure:
the proof waited for the transient string `30 native legacy clips`, but the runtime immediately calls `playMotion('Idle')`, replacing that text with `Idle · native Rig_Legacy …`.

Classification:
**PROOF SYNCHRONIZATION BUG, not runtime failure.**

### Browser attempt B

Workflow run:
`35548588227`

Observed:
- static/source: **26/26 PASS**;
- browser passed initial source/catalog checks;
- Barbarian assembly passed:
  - RIG_LEGACY;
  - ASSEMBLED;
  - source identity;
  - native motion active;
  - 30 clips recorded;
  - core parts placed.
- Knight reached RIG_LEGACY and ASSEMBLED checks.

Failure:
the Knight identity check read:
`Barbarian + Barbarian · default`

Proven cause:
the proof waits on generic UI conditions that remain true from the prior actor. At the start of a new async `assemble()`, the previous `#rigStatus`, `#stageMode` and native-motion status remain valid, so the wait may resolve before the requested actor has replaced the previous actor.

This is a **stale-read synchronization problem in the proof contract**. It does not establish that Knight failed to assemble.

No screenshot/browser JSON artifact was produced because the proof writes evidence only after completing the full sequence.

## 5 · What is NOT proven

- 4/4 actor switching in one automated browser sequence;
- 17-head EyeRig visual quality;
- weapon visual fit;
- Cloudflare deployment;
- Georg human visual acceptance;
- Pencil / CapsuleCarl / Eraser compatibility.

## 6 · Game Development Studio

`GAME_DEV_CLI_UNAVAILABLE · OPTIONAL FALLBACK USED`

No sealed Game Development Studio asset-production or GPU evidence is claimed.

## 7 · Exactly one next gate

### KLR-SYNC-01 · deterministic actor-switch readiness token

Fresh slice only.

Do not tune visuals or add features.

Prove this minimal sequence:

`Barbarian → Knight → Mage → Rogue`

For each requested body:
1. start assembly;
2. enter an explicit not-ready state or increment an assembly generation/request id;
3. wait until the completed result exposes the requested body id;
4. then assert `RIG_LEGACY`, `ASSEMBLED`, 30 clips and placed core parts.

Required gate:
**4/4 body switches PASS in a dedicated minimal browser proof**.

Only after KLR-SYNC-01 passes may the full browser proof resume. Do not publish Cloudflare Stage before that.
