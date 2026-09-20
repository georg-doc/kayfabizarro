# KFB ToolBox · KayKit Character Compatibility v0 · RETURN

**Date:** 2026-09-20  
**Repo:** `georg-doc/kayfabizarro`  
**Owner:** KFB ToolBox / Character compatibility  
**Branch:** `chatgpt-web/toolbox-kaykit-character-compat-2026-09-20`  
**Draft PR:** #147  
**Implementation/browser-proof head before this handoff:** `41e3a1b65683e5d0dff94e5b1726bb013220087f`  
**Fixed Stage route:** https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/kaykit-character-compat-v0/  
**Status:** SOURCE / CONTRACT BENCH COMPLETE · REPOSITORY PASS · PUBLIC CLOUDFLARE PASS BLOCKED

## What changed

KCC-0 creates one routing/compatibility contract around existing owners instead of a new monolithic character runtime.

Reused owners:

- KayKit Motion Lab / RigMotionProfile for character motion;
- EyeRig v6 for eyes;
- existing FrizzleBob measured graft for head/face;
- consumer/runtime for world motion, vehicle physics and root transform.

Source-first donor bench includes:

- Goth Girl · real Rig_Medium source;
- FrizzleBob · real Driver host source;
- Bath · real Tiny Treats source;
- Rover Round · real vehicle source;
- Paper Plane · real KFB source;
- Pencil A long · real KayKit RPG Tools source;
- Rubber / Eraser · explicitly `SOURCE_REQUIRED`, no substitute.

## Vehicle finding

Measured legacy configuration confirms two different paths:

- Bath: `cut=false · base=false · cockpit=false`, whole character retained; hips measured 0.355 below waterline.
- Rover: `cut=true · base=true · cockpit=true`, legacy destructive presentation.

Target direction is reversible `hidden | occluded` lower-body presentation through a later VehicleMount adapter, not new cut character assets.

## FrizzleBob secondary-motion finding

Current verified behavior donors:

- `frizzlegraft-v1/ears.v2.js`
- `frizzlegraft-v1/actor-wobble.v1.js`

Do not fork the KayKit skeleton and do not replace the current spring just to accept Race input. Next slice separates deterministic Race wind facts from ear geometry.

## Evidence

Repository-native checks:

- **28 / 28 PASS**
- Stage source matrix and workflow source matrix are the same Git blob.
- all six real donor paths exist;
- all four external dependencies referenced by text glTF donors exist;
- Rubber remains source-empty by policy.

Test report:
`skills/chat/workflows/KAYKIT_CHARACTER_COMPAT_V0_2026-09-20/TEST_REPORT.md`

## Public Stage status

Main publication checkpoint:
`8eab229c0345ffe3a152edbd2a0149e494096a36`

Router newline repair:
`085934f7dddc614e8f28aab7b9152f8eb27023fd`

Public proof run:
`35528646651`

Result:

- syntax: PASS;
- Playwright install: PASS;
- exact public marker: FAIL after timeout;
- returned content was the public root page, not KCC `SOURCE.json`.

Therefore the Stage URL is **linked/prepared but not PUBLIC_VERIFIED**. No Live claim.

## Dropbox sanity

The 2026-09-20 Cologne Race intake copy of
`KFB_ANIMATION_LAB_v2_FRIZZLEBOB_GRAFT_BRIEFING.md`
is text-identical to the previously inspected Vehicle + Rigging + Animation Lab copy. It is not a newer competing owner.

## Environment

`GAME_DEV_CLI_UNAVAILABLE`

The optional Game Development Studio CLI is unavailable in this environment. Repository-native evidence remains the accepted fallback for KCC-0.

## Open items

1. Cloudflare project must actually expose this Stage route and exact `SOURCE.json` marker before public browser PASS can be claimed.
2. Real Rubber/Eraser 3D source is still missing.
3. New FrizzleBob ear geometry is still unselected.
4. No VehicleMount runtime has been implemented yet.
5. No Prop FaceHost → EyeRig v6 adapter has been implemented yet.

## One next gate

**KCC-1A · FrizzleBob Secondary Motion Facts**

Build a pure, deterministic adapter from consumer-provided Race motion/wind facts to bounded secondary-motion target facts. No new ear mesh, no new spring owner, no Race physics ownership.

Expected inputs:

- `speedNorm`
- `apparentWindLocal`
- `accelLocal`
- `angularVelocityLocal`
- deterministic `time` / seed

Expected outputs:

- bounded root/tip target angles or normalized deflection facts;
- zero output at rest;
- no accumulated state/drift;
- deterministic flutter phase;
- safe clamps for later ear geometry integration.
