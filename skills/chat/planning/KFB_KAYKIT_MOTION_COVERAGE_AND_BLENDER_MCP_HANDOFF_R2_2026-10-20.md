# KayKit cartoon motion source census and Blender MCP handoff R2
2026-10-20 | RESEARCH / DESIGN ONLY | Central KFB animation planning branch

## Verified source candidates
Medium primary: `Rig_Medium_CombatMelee.glb` within `media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/`; real clip `Melee_1H_Attack_Chop`. Resource Registry `registry/resources/v1/motions.jsonl` records source blob `0ab63f221ca5d5c7c485a245199fb6107f1f3764`, pinned source commit `11d7df978c63b9e375707bd8d9431b4c8358cda8`; additional real same-file variants: `Melee_1H_Attack_Jump_Chop`, `Melee_1H_Attack_Slice_Diagonal`, `Melee_1H_Attack_Slice_Horizontal`. Registry availability != visual proof.

Actual receiving donor: separate private repo `georg-doc/KFB-Combat-Arena`, PR #7, branch `chatgpt-web/ca2-04-melee-vfx-sfx-2026-09-20`. `slices/ca2-melee-lab/RETURN.md` documents Skeleton_Warrior.glb + Skeleton_Blade.gltf, handslot.r / runtime handslotr, real chop, sweep/AttackLedger, isolated diagnostic orbit/fight camera, 1x/0.25x/scrub and contact markers. Repo-native tests recorded as 98/98 PASS on implementation commit `c04f0fffeb8cd90b48d70a2787c9ef1ca75ee725`; these are historical reports, NOT tests executed by this research pass. Visual approval still open. Public CA2 Sword child route FAILED twice (SOURCE.json returned fallback HTML), frozen; never represent it as a working public test surface or retry the frozen publication gate in this research slice.

Large next donor: `Rig_Large_CombatMelee.glb` real clips `Melee_2H_Attack`, `Melee_2H_Idle`, `Melee_2H_Slam` documented by Combat RETURN. Black Knight + large sword reserved as later CA2-LARGE-2H-01. Shield mount human-rejected, not reusable as accepted transform. Medium motions must not be assumed compatible with Large or Legacy rigs.

Browser discovery donor: `tools/asset_registry/librarian/README.md` documents Gothic Girl source audition: 25 local, 132 shared distinct motion names, 165 total concrete selection entries, `Death_A` from Rig_Medium_General, track binding 69/69. These are one-character test facts, not full catalog counts. User estimates (~139 Medium/~100 Large) remain unverified. Asset search is the canonical discovery seam; do not clone asset registry.

## Coverage matrix (evidence tier)
| Family | Semantic capability | Source | Status | Next work |
| --- | --- | --- | --- | --- |
| Medium | one-handed melee chop | Rig_Medium_CombatMelee / Melee_1H_Attack_Chop | NAMED_SOURCE + HISTORICAL COMBAT CI; NOT VISUALLY ACCEPTED | original donor isolation then A/B/C |
| Medium | one-handed jump chop | same / Melee_1H_Attack_Jump_Chop | NAMED_SOURCE ONLY | verify contact/air/landing |
| Medium | horizontal / diagonal sword slice | same / Melee_1H_Attack_Slice_Horizontal, Melee_1H_Attack_Slice_Diagonal | NAMED_SOURCE ONLY | check silhouettes and weapon alignment |
| Medium | walk/run/sprint | Walking_B / Running_A / Running_B, Motion PR #344 | HUMAN CHOSEN, keep choices | no re-pick or retime |
| Medium | pivot/start/stop/strafe walk | native Motion audit | DOCUMENTED GAP | later separate transition assessment |
| Large | two-handed attack / idle / slam | Rig_Large_CombatMelee | DOCUMENTED REAL CLIPS, NO CURRENT ACCEPTANCE | isolated Black Knight + sword comparison later |
| Other | acting/interaction/hit/landing | full KayKit packs | UNINVENTORIED | enumerate from registry, do not guess |

## Cartoon craft acceptance for first pilot
- Source display: actual donor actor and clip alone, same camera, at 1x and slowed, provenance and skeleton track bindings on record.
- Three labeled cuts: ORIGINAL, RESTRAINED, EXPRESSIVE. No assumed numerical timing baked into original; measure events/foot plants before shortening or exaggerating.
- Anticipation readable without input lag; strong silhouette at strike; clean precise contact; follow-through obeys force; recovery is a fully interruptible, cleaned-up return to owned idle or next action.
- Log animation contacts as presentation markers; Combat owns actual active hit windows/damage. Preserve handslot/weapon contact, grounded feet, root/world ownership.
- Confirm cinematic variant can be longer than gameplay variant without becoming a second gameplay controller.
- Never turn unreviewed source, 69/69 track binding or repository CI into visual HUMAN PASS.

## For later Blender MCP on Georg's Mac mini
A receiving executor, once authorized, should read this R2 plus R1 plan and fresh `skills/chat/START_HERE.md` / KFB animation skill, current Motion and Combat project Returns. Reuse original GLB and source actor, not recreated substitute. On Mac mini Blender MCP, inspect the actual source file in Blender: object tree/armature/rest pose, action list, NLA, track/bone names, FPS, root translation, start/end frames, peak/impact frame candidates, contact/foot and hand paths. Record exact input file hashes and software/addon versions; export an original-isolated viewport proof first. Then non-destructively duplicate one action and author restrained/expressive variants, preserving original, fixed rig naming, asset IDs and repeatable export settings. Confirm exported GLB glTF channel bindings and playback in owning runtime, do not trust only Blender viewport. Return source/action timing sheet, before/after video and small clips, JSON event metadata candidates, QA findings, file roster and rollback recipe.
Do NOT try to access/control Georg's Mac mini or Blender MCP from this web chat without an actual connected execution environment. Work/code later for Blender session automation and integration in exact Combat owner.

## Current stop/boundary
The current scope is repository-native inventory, conceptual mapping and future MCP handoff. No Blender MCP connection, original GLB playback, new rigging, combat source modification, screenshots or live Stage proof occurred.
Next gate: source-isolated original Medium chop proof and measured contact/track metadata in Blender MCP, then A/B/C authored variants only when the receiving Combat owner and exact execution branch are pinned.
