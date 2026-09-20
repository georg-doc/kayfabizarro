# WSA / Astra KFB Integration Living Masterplan · 2026-09-20

Status: **CURRENT SCOPED INTEGRATION PLAN · PREP ONLY · NO AUTO-MERGE / NO LIVE PROMOTION**  
Owner: **existing WSA Work Lead + existing project/runtime owners**  
Coordination home: `skills/chat/workflows/WSA_MVP_CONSOLIDATION_2026-09-20/`  
Execution router: existing `skills/chat/workflows/ASTRA_INTEGRATION_01_2026-09-18/`  
Coordination Stage route: `https://kayfabizarro.pages.dev/kfb-hub/stage/wsa-mvp-consolidation/`

This is a living integration plan, not a universal runtime or replacement SSOT. Current project GitHub state wins when a named owner moves.

## Integration outcome

Prepare one larger Work/Astra pass that can assemble:

**Travel/TinySkies world → Walk / Drive / Fly → Resident Zones → optional mini-races / mini-quests → portal-entered Dungeon/Combat instances → Storytelling Map/cards/cut-scenes → return to world.**

The pass consumes tested owner seams. It does not merge all projects into one engine.

## Focus A · Combat Arena → melee → Dungeon/Raid/Open World

Current owner: `georg-doc/KFB-Combat-Arena`.

Current evidence:
- PR #5: CA2 Driver graft + verified KayKit combat actors; recorded 68/68 test PASS.
- PR #6: KayKit/spindle integration planning and **CA2-04 Melee Choreography + VFX/SFX Lab**.
- kayfabizarro PR #137: CA2-03A public source/clip proof for Skeleton Warrior, Orc Brute and Avian Swordsman; 32/32 public checks.

Sequence:
1. CA2-03B: play the frozen actor state maps and verify grounding/deformation/one mixer per actor.
2. CA2-04: real 1H grip/orientation, swept weapon contact, confirmed damage → VFX → SFX on the same hit.
3. Dungeon consumes only spawn/encounter/return seams.
4. Combat keeps damage/AI/rewards/run-flow ownership.
5. Open World owns only gateway/return state.

Future prop/rig consumers (Rig_Legacy, zero-bone EyeRig props, Plant rigs) may reuse choreography only after their profile seams are proven.

## Focus B · Race / Travel → Walk → Drive → Fly

Macro-world owner remains Travel/TinySkies. Race keeps vehicle movement/contact/gameplay.

Current facts:
- Travel PR #31 TC-01 proved the terrain-owner seam technically, then Georg visually rejected the black-band/penetration presentation. Keep it as technical evidence only.
- Current Track/Terrain gate is a local refined **SurfacePatch** proof; do not revive the rejected dense-zone ribbon visual.
- Race PR #30 is the approved compact HUD v4 implementation brief.
- KCC-0/KCC-1A provide current KayKit/custom actor source and secondary-motion facts for vehicle presentation.

Integration target:
1. Walk is the baseline exploration mode.
2. Enter/exit Drive without replacing world ownership.
3. Drive can remain free-roam; a mini-race/challenge is optional encounter logic.
4. Enter/exit Fly through the current Travel flight owner.
5. Preserve zone/quest state across transitions.

Tone: chill/free-roaming first, optional fun challenges second. A race track is also a road/world object.

## Focus C · Resident Zones + ChatterBox + mini-quests

Current Resident modules remain actor/activity sources. `KFB_WORLD_ONBOARDING_CHATTERBOX_V1_2026-09-19.md` is planning-only.

First integrated proof:
- one named zone;
- one real Resident module;
- one short donor-backed, location-aware ChatterBox exchange;
- exactly three confirmed remembered interaction facts;
- one optional visible Card/Landmark mini-quest and clean return.

No second dialogue system, no second memory layer, no new Resident movement/collision owner.

Storytelling Maps may later present the zone/card/route, but dialogue semantics stay outside the map renderer.

## Focus D · ToolBox + 3D in-place editor

The old “mini-editor not pinned” status is superseded.

Pinned sources:
- Dropbox: `/CLAUDE/KayKit Environment Atlas + Dungeon Generator + 3D scene editor TOOL (5)/KFB_Dungeon_RoomStudy_S21_EXPORT_2026-09-20`
- GitHub PR #120: S21 intake.
- PR #126 / S14: strongest current authoring proof — 22/22 static, 15/15 real Chromium/editor, prop-adjustment → recipe patch → reload, PUBLIC_VERIFIED 17/17, plus valid Blender 4.0.2 .blend export.
- PR #133 / E1: frozen candidate whose browser **harness** failed twice; not evidence that the editor interaction itself failed.
- PR #146: ToolBox Home router candidate.

Direction:
1. retain S21/S14 as donor evidence;
2. prove a Resident host and Dungeon host against the same minimal transform/recipe semantics;
3. only then extract a truly shared edit layer;
4. Platformer Hub and KFB World consume later;
5. host keeps collision, movement, camera and runtime semantics.

## Focus E · Environment → modular Scene/Zone Generator

Asset identity remains Registry/Asset Librarian truth.

Current sources:
- PR #144 KayKit Bits Bundle 1: provenance-preserving WIP package; 1,306 package-root files, including 628 GLTF+BIN pairs.
- Tiny Treats Charming Kitchen is already registered (118 GLTF + 5 PNG) and has a discoverability brief.
- Dropbox exposes current Tiny Treats source ZIPs for Baked Goods, Charming Kitchen, Bakery Interior, Pleasant Picnic, Pretty Park, Homely House and House Plants.
- Dungeon stays KayKit-only. Tiny Treats stays Venue/interior.

Proposed recipe seam (proposal, not canon until host proof):
- exact asset/pack ID and path;
- transform;
- semantic role;
- host-owned collision/grounding policy;
- optional Resident slot;
- optional **rule-of-three prop group**: anchor / support / story-readable accent.

The Scene/Zone Generator consumes registered assets and recipes; it is not a second library.

## Focus F · KFB Storytelling Maps

Owner remains `tools/kfb-cartoon-map-board/`.

Current ladder:
- T1 exact tabletop donors: PUBLIC_VERIFIED 9/9.
- T2 Media Standee: PUBLIC_VERIFIED 13/13.
- next gate: **T2.1 / VL1 Responsive Rounded CardRig** — exact KayKit card, corner-preserving mesh deformation, no rectangular media plane.

Integration roles after VL1:
1. World/Zone map.
2. Resident quest/card/landmark presentation.
3. Tactical Combat/Dungeon board where gameplay state remains consumer-owned.
4. 2–3 minute story-map / cut-scene player.
5. Later manifest authoring.

Do not merge its future shot/timeline editor with the 3D placement editor merely because both are editors. Share only proven source/asset/transform seams.

## Cross-lane seams to prove

1. World mode handoff: Walk / Drive / Fly and back.
2. Instance handoff: overworld gateway → Dungeon/Combat → return transform/state.
3. Actor profile seam: model/rig/motion/attachments facts, consumer-owned gameplay state.
4. Scene recipe seam: registered assets + transforms + semantic grouping.
5. Story-map manifest: presentation/timeline facts, not canonical game state.
6. Publication: exact tested Stage files only; never wholesale-merge `main` into `cloudflare-live`.

## Work/Astra order

### W0 · source/ref lock
Read the branch census, re-fetch every active input, then write the existing Astra Integration Lock. Branch presence is not acceptance.

### W1 · owner gates
- Combat CA2-03B → CA2-04.
- Track SurfacePatch after TC-01 visual rejection.
- S14 human form/editor review; E1 stays frozen unless separately QA-proved.
- Storytelling CardRig VL1.
- KayKit Bits / Asset Librarian / Tiny Treats discoverability.

### W2 · coherent local world slice
Travel world + Walk + one Drive enter/exit + one Fly enter/exit + one Resident zone + one registered Environment recipe + one Dungeon/Combat gateway + Storytelling Map presentation only if its current gate passed.

### W3 · integrated proof
Run owner tests first, then integrated browser/freeplay. A successful page load is not an integration PASS.

### W4 · Stage
Publish through existing KFB Cloudflare + Hub route. No Live promotion without Georg's named human gate.

## Branch policy

The branch census is mechanical inventory; the active status matrix is the curated integration set.

Do not mass-delete, auto-merge or cosmetically “clean up” refs. Consolidation means: pin → classify → consume/archive intentionally → preserve failed/rejected evidence → merge only through the receiving owner gate.

## Game Development Studio

The Game Development Studio operating skill was loaded. No local `game-dev` execution surface is exposed in this Web session, and current handoffs already record the optional CLI as unavailable. Repository-native GitHub/Chromium/Blender evidence is the fallback here. No sealed GDS run is claimed.
