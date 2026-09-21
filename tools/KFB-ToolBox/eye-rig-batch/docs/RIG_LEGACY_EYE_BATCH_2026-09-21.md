# KLR-EYE-01 · Rig_Legacy Eye Batch 17/17

**Date:** 2026-09-21  
**Owner:** KFB ToolBox / Rigging · Batch EyeRig Atlas  
**Repo:** `georg-doc/kayfabizarro`  
**Branch:** `chatgpt-web/legacy-eye-batch-17-2026-09-21`  
**Base owner:** `toolbox/eye-rig-batch-2026-09-18@e277c3456651d314a01adea046e0105d2a12cdd1`  
**Current tested head:** `91cca48809fb8a86c8ea7a8326eb6637fa89a066`  
**Status:** TECHNICAL PASS · 17/17 PERSISTED · HUMAN VISUAL REVIEW OPEN

## Goal

Bring all 17 KayKit Dungeon Pack 1.0 Legacy head identities into the same EyeRig Batch profile pipeline already used for Rig_Medium and Rig_Large.

No second eye runtime or profile registry is introduced.

## Owners retained

- Eye runtime: existing EyeRig v6.
- Eye shape helper: existing EyeOval v1.
- Profile schema: existing `kfb.eye-profile/0.1-candidate`.
- Batch schema: existing `kfb.eye-profile-batch/0.2-candidate`.
- Profile inheritance: `rigClass → character → session`.
- Legacy assembly donor: browser-proven KLR-KIT-F1 runtime.
- Legacy face measurement: existing LegacyFaceHost.
- Source GLTF/GLB files: unchanged.

## Source catalog

`data/rig-legacy-heads.v0.json`

17 head identities:

- Barbarian default / A / B / C
- Knight default / A / B / C
- Mage default / A / B / C
- Rogue default / A / B / C
- Skull

Exact source pins:

- Dungeon parts: `eb48f50489b9e4903ec1e3d2fb1837605ce7d792`
- Rig_Legacy donor: `10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0`
- proven Legacy runtime adapter: `44d595bc60259f4a74da7043df13582f1b5ccd89`
- EyeRig / EyeOval donor revision: `5650b6c54d8789b20ea80abe857688173d506d3b`

## Source-first lane

`legacy/`

Every head must pass:

`exact source isolate → Rig_Legacy assembly → LegacyFaceHost → source eye measurement/classification → EyeRig v6 mount`

EyeRig mount is rejected if source isolation has not occurred in the current session.

Automatic source-eye hiding is allowed only for `MEASURED_CANDIDATE` heads and affects cloned runtime materials only. HUMAN_REQUIRED heads keep source geometry visible.

## Candidate profiles

Canonical candidate batch:

`data/rig-legacy-auto.v1.json`

Result:

- **17/17 persisted profiles**
- **16 MEASURED_CANDIDATE**
- **1 HUMAN_REQUIRED**
- `Skull` is the only HUMAN_REQUIRED head
- no profile claims human visual approval
- no shared Rig_Legacy class default is inferred

Skull currently uses the explicitly marked calibration fallback:

`dx 0.40 · dy 0.05 · ring 0.15 · track 0.12`

It must be manually reviewed/tuned before approval.

## Automatic measurement evidence

Workflow:
`35661858046`

Job:
`106538705766`

Results:

- static contracts: **24/24 PASS**
- real browser/WebGL: **247/247 PASS**
- all 17 heads source-isolated
- all 17 heads assembled
- all 17 heads received EyeRig v6
- 16 measured / 1 human-required
- 0 failed HTTP/resources
- 0 page/console errors

Artifact:

- ID `10667124760`
- digest `sha256:e95731117565bef97ef917d47bb2ff3529b64d01227223642db53ea401973f26`

Artifact includes source and mounted screenshots for each head plus generated batch JSON.

## Persisted-profile evidence

Workflow:
`35662264764`

Job:
`106539992446`

Results:

- static/profile contracts: **30/30 PASS**
- persisted-profile browser/WebGL: **215/215 PASS**
- all 17 saved profiles reloaded from `rig-legacy-auto.v1.json`
- exact actor/source identity
- exact saved anchor
- exact saved status
- exact saved face color
- current measurement classification stable
- EyeRig eyeFrame present for 17/17
- 0 failed HTTP/resources
- 0 page/console errors

Artifact:

- ID `10667790643`
- digest `sha256:e7a8b41d8172c621aef3c1250d95c2e938db58cac761b83459fbe026cf8d8ba1`

## What this proves

The Legacy EyeRig profile layer is now a real reusable data asset, not a transient runtime measurement.

The 17 profiles can be consumed later by:

- Legacy Character Baukasten / randomizer;
- Combat Arena Legacy actor adapter;
- KFB WhackMan Legacy presentation;
- later KFB games.

Consumer gameplay remains outside this tool.

## What is not yet proven

- Georg visual approval of the 16 auto-measured placements;
- manual Skull placement;
- source-eye cleanup aesthetics on every head;
- public Cloudflare Legacy Eye Batch route;
- Combat ranged integration;
- Combat melee contact/hit integration.

## Exactly one next gate

**KLR-EYE-VIS-01 · 17-head human visual review**

Publish the Legacy lane as a Stage candidate and review all 17 heads.

Required:
- Front + 3/4 view for every head;
- approve / adjust / reject per profile;
- Skull must receive a manual placement or remain unsupported;
- source-eye cleanup must be visually checked separately from EyeRig placement.

Only accepted/adjusted profiles become Combat-ready.
