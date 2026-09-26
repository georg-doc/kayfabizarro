# KFB Chat Production Router

Status: CURRENT ROUTER v0.3
Date: 2026-09-19
Owner: Georg / KFB

This folder is the current LLM production routing layer for ChatGPT/Astra and Claude Design.
It does not replace project SSOTs, current tools, or canonical skills. It tells an agent what is current, what to read, and what not to trust without review.

## Start order

1. Read `REGISTRY.json`.
2. Read `LIVING_MASTERPLAN.md` only when cross-project sequencing or current lead intent matters.
3. Identify the current project or tool node.
4. Read the referenced project SSOT / START / RETURN files.
5. If the task points to a shared intake package, apply `INBOX_PROTOCOL.md` before treating anything there as current truth.
6. Load only the current skills required for the task.
7. Apply the provider adapter only after the provider-neutral SOP.
8. For a bounded fresh-chat/module/POC slice, also apply `FRESH_CHAT_SLICE_PROTOCOL.md`.
9. For every Web/Claude/Codex delivery, apply `CHAT_GITHUB_KFB_STAGE_WORKFLOW.md` before writing or publishing.
10. Record decisions and results additively.

For meta-narrative/cross-module ideation, especially KFB Town, use the registry entries for `kfb-meta-compendium-v1` and `kfb-town`. The Meta Compendium is an index, not a canon/implementation SSOT; Town has its own living document under `town/`.

If this is a replacement/fresh chat after context loss, use `RECOVERY_PATH.md` rather than asking Georg for a transcript reconstruction.

## Hard rules

- GitHub state beats chat recollection when they conflict.
- Reuse before rebuild. Read the donor before adapting it.
- Reuse-before-rebuild applies to concepts too: do not invent a second hub/dialogue/presenter/card-navigation/memory grammar before checking its named home.
- Never silently replace an owner, contract, or SSOT.
- A donor PASS is not an integration PASS.
- A numerical PASS is not a browser PASS.
- A browser PASS is not Georg's visual/freeplay acceptance.
- Legacy files remain useful evidence but are not current merely because they exist.
- Meta indexes may contain stale version/status/count snapshots; verify operational claims in the current project/tool SSOT.
- Inbox files are inputs, not SSOTs, until a receiving owner accepts/pins them.
- The planned shared inbox is the private `georg-doc/KFB-Production-Inbox`; the old public Travel-mirror inbox is historical staging only.
- One inbox folder per job/project; processed packages move to `_inbox/archiv/` with return/destination evidence preserved.
- Do not read giant housekeeping/history files front to back at startup. Search them only for a concrete question.
- Do not copy canonical skills into this folder. Reference them from the registry.
- Chats synchronize through GitHub state; do not assume direct chat-to-chat messaging or shared hidden context.
- Human-facing KFB preview/Stage/Live links use `kayfabizarro.pages.dev` / KFB Hub; do not publish active review links through GitHub Pages, githack or raw-CDN mirrors.
- A timeout is `UNKNOWN`, never success: verify the exact branch head, workflow/deployment and public URL before retrying or claiming completion.
- After two repair passes without progress on the same gate, stop and export. Preserve the failed candidate and route through the failure-recovery template instead of spending a third pass on the same foundation.
- **Gate severity must be proportional to product impact.** Optional actors/assets/axes/attachments/shaders may not block an MVP unless they are the named acceptance target. Apply `GATE_PROPORTIONALITY_TOKEN_BUDGET_PROTOCOL.md`: ask Georg when cheap clarification beats another diagnostic pass; quarantine minor issues; protect Work/Claude budget.

## Status vocabulary

`CURRENT_CANON` · `CURRENT_TOOL` · `CURRENT_REFERENCE` · `CURRENT_PROJECT_SSOT` · `LEGACY_REFERENCE` · `SUPERSEDED` · `ARCHIVED_HISTORY` · `UNVERIFIED` · `EXPERIMENTAL`

## Core docs

- `LIVING_MASTERPLAN.md` — durable cross-project lead plan and sequence
- `masterplan/` — scoped masterplan addenda, referenced from `REGISTRY.json`
- `meta/KFB_META_COMPENDIUM_v1.md` — cross-module meta index; routing/reference only
- `town/START_HERE.md` + `town/LIVING_KFB_TOWN.md` — current KFB Town ideation home
- `RECOVERY_PATH.md` — deterministic recovery after chat/context failure
- `FRESH_CHAT_SLICE_PROTOCOL.md` — bounded cold-start work and compact next-day review packet
- `workflows/KFB_WEB_FIRST_EXECUTION_V1_2026-09-22/START_HERE.md` — **CURRENT DEFAULT EXECUTION LANE**: Web/GitHub + Claude Design + local preview first; Work/WSA only by explicit capability escalation
- `CHAT_GITHUB_KFB_STAGE_WORKFLOW.md` — binding Chat → GitHub → Cloudflare Stage → Hub delivery and timeout recovery
- `GATE_PROPORTIONALITY_TOKEN_BUDGET_PROTOCOL.md` — binding cross-project rule preventing minor details from consuming MVP / Work / Claude budget
- `WEB_PROJECT_FOLDER_INSTRUCTIONS.md` — copy-ready instruction text for Web project folders
- `templates/CLAUDE_DESIGN_FAILURE_RECOVERY_EXPORT.md` — stop/export/post-mortem template after repeated visual or kit failures
- `ANTI_SLOP_VISUAL_BRIEF_GUARDRAILS.md` — mandatory donor-first and every-pixel-pays-rent rules for visual briefs
- `workflows/KFB_HUB_UI_V2_2026-09-19/CLAUDE_DESIGN_BRIEF.md` — lean Hub UI brief for desktop, split-screen and mobile
- `SYNC_PROTOCOL.md` — shared GitHub-based chat/agent synchronization
- `INBOX_PROTOCOL.md` — shared cross-project intake/staging rules
- `INBOX_REPO_BOOTSTRAP.md` — one-time structure for the private production inbox
- `PRODUCTION_SOP.md` — provider-neutral production method
- `EVIDENCE_AND_STATUS.md` — claim / proof vocabulary
- `CHANGELOG.md` — additive history of this router
- `adapters/chatgpt-astra.md` — ChatGPT/Astra operating layer
- `adapters/claude-design.md` — Claude Design operating layer
- `workflows/` — reusable task workflows
- `workflows/KFB_MODULAR_MINIGAME_HUB_2026-09-19/START_HERE.md` — current Baukasten catalog + Dungeon/Hex/Combat Web-Chat slices
- `workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/START_HERE.md` — lock-first WSA/Astra playable loop
- `workflows/KFB_THEATRE_CURTAIN_CORE_V2_2026-09-21/START_HERE.md` — reusable cutscene/loading/instance transition seam
- `workflows/KFB_TOOLBOX_FLUID_CARD_VOXEL_CONSOLIDATION_V1_2026-09-21/START_HERE.md` — verified intake, source census and bounded module proofs
- `tool-nodes/` — current tool/project entry cards
- `consumers/` — project/chat-specific sync adapters without copied skill bodies

## Current first-class nodes

- Asset Librarian
- FrankenStein Studio v16
- Travel Globe
- Combat Arena
- KFB Town — current living concept/reference, not a runtime project
- Wissens-Pilli / DocCheck Interactive Microlearning — `UNVERIFIED` intake until implementation SSOT/runtime is explicitly pinned
- **SimBlood / DocCheck — `CURRENT_PROJECT_SSOT` at `georg-doc/doccheck/sim-blood/`; recovery in `RECOVERY.md`, current WIPs in `WIP_STATUS.json`**
- **2D Animation Studio — `CURRENT_TOOL` at `tools/2D Animation Studio/`; browser-first 2D/2.5D cutout rig authoring, first lab DocCheck Eumel**
- Animation Lab — `UNVERIFIED` until current implementation SSOT/site is pinned
- **KayKit Character Compatibility — `EXPERIMENTAL` ToolBox lane. KCC-0 = Draft PR #147 / 28-of-28 repository PASS; its Cloudflare Stage is `PUBLIC BLOCKED` after run 35528646651 returned the root page instead of the exact marker. KCC-1A = stacked Draft PR #148 / 43-of-43 contract + local-browser PASS for Race secondary-motion facts. Motion Lab, EyeRig v6 and the existing FrizzleBob graft remain owners; Rubber/Eraser remains `SOURCE_REQUIRED`.**

DocCheck UI convention for project surfaces: use `#cc0033` as a restrained accent for controls/links/active states; do not tint medical imagery.

When a task says only “start KFB production”, begin here. When a task names a project or tool, this file routes you to its actual SSOT rather than becoming one itself.

## 2026-09-15 · ToolBox reentry and Town birthday input

Read [the scoped masterplan addendum](masterplan/TOOLBOX_UX_TOWN_BIRTHDAY_2026-09-15.md) for the two separate ToolBox results A/B, WS0's source corrections, efficient handoff practice, birthday character selection and the Makerspace cinema direction. It routes to existing owners and preserves the distinction between a workspace report, a user direction and a tested consumer result. It does not promote tools or start a Town implementation.

## 2026-09-17 · DocCheck SimBlood recovery node

SimBlood is now a first-class project node with its own external SSOT in `georg-doc/doccheck/sim-blood/`. The KFB Hub/router only points to its `START_HERE`, `RECOVERY`, `WIP_STATUS`, Living and Return files; it does not duplicate SimBlood project truth.

## 2026-09-18 · Astra Integration 01 onboarding

On Georg's request, the prepared cross-project execution brief is now at [Astra Integration 01 · START_HERE](workflows/ASTRA_INTEGRATION_01_2026-09-18/START_HERE.md).

Scope: local multi-repository workspace, existing BOX1/Race/Vehicles/Audio, World/Environment, Residents/Animation, ToolBox/Studio/Rigging, Arena, Asset Librarian and the existing KFB Hub. A single execution instance works under the existing WSA/product/module owners; this is not a new universal runtime, Registry, monorepo or automatic promotion of any candidate.

Status: **ONBOARDING PREPARED · WORLD REVIEW PENDING · EXECUTION NOT STARTED**. Read [World review request](workflows/ASTRA_INTEGRATION_01_2026-09-18/WORLD_REVIEW.md) and [task changelog](workflows/ASTRA_INTEGRATION_01_2026-09-18/CHANGELOG.md). Current project HEADs, source arrivals and human gates must be rechecked before work; especially the incoming Audio A1 source. No local Work-session permissions or new runtime tests are claimed by this routing addition.


## 2026-09-18 · 2D Animation Studio

Georg established a current tool lane at `tools/2D Animation Studio/` for browser-first 2D/2.5D cutout rigs, pivot hierarchies, cartoon deformation/motion calibration and reusable animation modules for mini-games. Load it with `skills/kfb-cartoon-animation_v2.md`.

The first lab is DocCheck Eumel. The current measured/traced Eumel package is **provisional donor evidence** only. Georg will provide the DocCheck AD Illustrator source in the tool-local `_inbox/doccheck-ad-ai-source/`; that intake remains input until classified, measured and explicitly accepted into the tool's canonical asset library. The tool-local inbox does not replace the central production inbox contract.


## 2026-09-19 · Fresh-chat slice handoff

For Georg's parallel web chats, modules and POCs, use `FRESH_CHAT_SLICE_PROTOCOL.md`. It lets one chat finish one clearly bounded slice independently, but never grants broader ownership. Every result remains additive and returns as a small review packet: exact source state, changed files, actual tests, visible proof, open questions and the next safe gate.


## 2026-09-19 · Claude Design failure recovery

Repeated visual/kit repair loops now stop after two passes without progress on the same gate. Use `templates/CLAUDE_DESIGN_FAILURE_RECOVERY_EXPORT.md` to preserve the complete editable source/state, distinguish evidence from hypothesis, record salvageable parts and return one smaller next gate. Project-specific post-mortems remain additive examples; an exported failed candidate is not promoted to current implementation truth.


## 2026-09-19 · Modular 3D Mini-Game Hub briefing

For the next ChatGPT Web comparison, use [KFB 3D Mini-Game Hub · START_HERE](workflows/KFB_MODULAR_MINIGAME_HUB_2026-09-19/START_HERE.md). It defines one shared Baukasten catalog and three separate POCs: furnished Dungeon rooms, a measured three-piece Hex gate leading to a hand-authored Babel micro-tower, and a Combat Arena platform level that preserves the Combat repository's current owners.

The verified Claude Design recovery export is donor evidence only. Its inventory, measurement, loader, grid, camera and jump/contact ideas may be reused; its large island generator and automatic diorama composition are explicitly rejected. Tiny Treats is a first-class catalog lane and must distinguish modular interior parts from loose scenery before use.


## 2026-09-19 · Visual anti-slop guardrails + lean Hub UI

All future visual/UI/asset-based briefs load `ANTI_SLOP_VISUAL_BRIEF_GUARDRAILS.md`: source output must visibly reappear; source-mandated objects have no aesthetic fallback; generic UI chrome is not added without request; FOV/task composition outranks safe-area containment; technical PASS, visual comparison and Georg acceptance remain separate.

The KFB Production Hub now defaults to a lean `Heute` surface. Explanatory hero copy, giant focus tabs and the default link-card wall are removed from the first view. The Pocket Inbox/dropzone is open and visible; the first screen is limited to current P0 actions and four handoff briefs. Long project/reference lists remain available only through compact filters. Claude Design receives the separate three-viewport brief under `workflows/KFB_HUB_UI_V2_2026-09-19/`.

HUD Rig v1 remains rejected history. The current Race/Travel radio restart brief lives in `georg-doc/KFB-Stunt-Car-Race/_handover/RACE_HUB_3D_AUTORADIO_RESTART_BRIEF_2026-09-19.md` and starts with the isolated exact Tiny Treats radio donor, never the rejected presentation.


## 2026-09-19 · Priorisierte KFB-Route: World/Race → Librarian/C0 → Babel

Für den aktuellen KFB-Fokus zuerst [Racetrack World Look + 3D HUD v1](workflows/RACETRACK_WORLD_LOOK_AND_3D_HUD_V1_2026-09-19/START_HERE.md) lesen: OSM/Track, Tiny-Skies-/Travel-Gestaltungsgrammatik, KayKit/Kenney-Rollen und das laufende eigene 3D-HUD werden als eine kleine, testbare Weltprobe behandelt. Die abgelehnte HUD-v1-Historie ist keine Vorlage; Tiny Treats ist nicht der Standard-HUD-Donor.

Vor C0 folgt [Asset Librarian × Tiny Treats · Discoverability Recon](workflows/ASSET_LIBRARIAN_TINY_TREATS_RECON_V1_2026-09-19/START_HERE.md). Charming Kitchen 1.1 ist im Registry-Bestand, aber der Librarian muss es über menschliche Namen und eine direkte Packansicht auffindbar machen. ToolBox ergänzt dies als Konsument, nicht als zweite Bibliothek.

Danach ist der [Babel Tower S2b → Hex Platform Generator](workflows/KFB_MODULAR_MINIGAME_HUB_2026-09-19/BABEL_HEX_PLATFORM_GENERATOR_V1_BRIEF.md) der konkrete Hex-Platformer-POC. Dungeon und Combat bleiben vorbereitet, aber nachrangig gegenüber der Weltkonsistenz.


## 2026-09-19 · Visible briefs and separated generator lanes

- The KFB Hub gets a dedicated **Briefings** filter; Today is a short priority view, never the complete catalogue.
- C0 is now recovery/history after its documented visual rejection. Asset Librarian remains the only common discovery layer.
- `DUNGEON_GENERATOR_V2_BRIEF.md` is corrected to a KayKit-only productive Dungeon Raid: existing S13.2 generator, real original pack props, filled treasure room and Combat-gated Skeleton Raid.
- `TINY_TREATS_VENUE_GENERATOR_V1_2026-09-19.md` owns Bakery/Charming Kitchen; it is separate from Dungeon.
- `KFB_INK_CARTOON_MECHANICS_V1_2026-09-19.md` defines isolated Ink / rubber barrier / tube / EyeRig reaction proofs using existing canon.
- `KFB_WORLD_ONBOARDING_CHATTERBOX_V1_2026-09-19.md` is planning-only and keeps private personal-admin subjects out of public runtime.
- `EYE_RIG_BATCH_TOOLBOX_SLICE_V1_2026-09-19.md` makes the existing EyeRig batch brief a visible ToolBox slice.


## 2026-09-19 · Track Ribbon S-T01b failure recovery

Race S-T01b was intentionally built as an **integration-first** candidate: wider 14.4 / 18.0 / 21.6 / 28.8 track scale, clean broad-guidance surface, Travel-derived terrain coupling and active BLACK_ICE / OIL / LOW_GRAVITY zones, with the distracting Kenney cue cluster disabled by default.

Implementation SSOT remains `georg-doc/KFB-Stunt-Car-Race`, Draft PR #29 / branch `wsa/track-ribbon-st01b-2026-09-19`. The candidate is now **FROZEN FAILED CANDIDATE** after two repaired browser-gate failures. Final static/ownership checks are green; the last real-browser run reached 24 checks with 0 page errors and 0 HTTP errors, then timed out on LOW_GRAVITY landing observability.

Do not publish S-T01b to Stage or resume the full candidate. Exact recovery lives at `ChatGPT_web/track-lab/ST01B_RETURN_2026-09-19.md` and `ChatGPT_web/track-lab/st01b/failure-recovery/` in the Race repository. Exactly one next gate: deterministic fixed-step LOW_GRAVITY jump/landing seam. S-T01 remains separate prior evidence.


### Correction · Track Ribbon terrain donor

The S-T01b failure-recovery note above is superseded on one crucial point: its terrain donor was wrong.

Do **not** route future Track/Terrain work through Travel-v16 Voxel.

Current Travel implementation SSOT:
`georg-doc/KFB-Travel-Globe@8614282aab2ced43bb5dda9fcf7abadf9768100a`

Current macro-world rule:
**Travel/TinySkies remains the world.** BlockBits/Voxel is local/selective tooling, never the replacement world aesthetic.

Current surface owners:
- `travel/globe-v13/globe.js`
- `travel/globe-v13/terrain-surface.js`
- `travel/globe-v13/simplex-noise.js`
- `travel/globe-v13/boden-lesung.js`

Gold-standard upstream:
`dannylimanseta/tinyskies@2659a5cc987d7e4a4c5aa7e79c86a1626ad75df6`.

Race PR #29 is now **REJECTED FOUNDATION · WRONG TERRAIN DONOR**. The LOW_GRAVITY timeout is secondary evidence, not the next product gate.

Next gate:
source-isolated current Travel Globe/TinySkies surface proof, then the smallest Track-to-spherical-surface deformation seam through the existing Travel terrain truth.


### Current Track/Terrain donor gate · TinySkies source isolated

Current Travel/TinySkies donor source is now isolated and browser-proved on `georg-doc/KFB-Travel-Globe#30`.

- Travel donor: **12/12 browser PASS**
- existing Travel `setTerrainZones()`: proven to deform the real baked Globe surface
- no Race Track in this gate
- Voxel remains valid for deliberately voxel/block-based KFB modes; it is only out of scope for this seam
- public mirror source merged to kayfabizarro
- canonical Cloudflare child route: **BLOCKED / NOT PUBLIC_VERIFIED** after QA #112 returned fallback HTML

Do not send Georg the unverified child route as a test link. Keep the current accepted Travel Globe public route as the only visible donor reference until Cloudflare publishes the new source-first comparison.

Next technical product gate after public donor review: extend the existing Travel terrain-owner seam from authored zones to one sampled spherical Track corridor. Do not revive the rejected S-T01b voxel sleeve.


### 2026-09-20 · Current Track/Terrain gate · TC-01 ready for Stage promotion

TC-01 is now the current Track/Terrain candidate.

- implementation SSOT: `georg-doc/KFB-Travel-Globe#31`
- architecture: sampled spherical Track route → additive compiler → existing `setTerrainZones()` → current TinySkies-derived Travel surface
- frozen `terrain-surface.js`: unchanged
- implementation browser: **15/15 PASS**
- Travel baseline: **PASS**
- Stage source package: `georg-doc/kayfabizarro#116`
- Stage mirror browser: **13/13 PASS**
- PR #116: **13/13 STAGE-MIRROR PASS · UNMERGED / PUBLICATION PENDING**
- no public `kayfabizarro.pages.dev` TC-01 link may be claimed yet
- Voxel remains a valid selective KFB donor for deliberate block/Minecraft/mining/building worlds; it is only out of scope for this Globe seam

After the TC-01 human visual gate, the next prepared lane is OSM translation through the same terrain owner: lat/lon → Globe normal/ENU, one short OSM road → spherical route → same Track/Terrain adapter, then a few building support pads and one exact landmark override.


### 2026-09-20 · TC-01 publication status

Current Track/Terrain implementation remains `georg-doc/KFB-Travel-Globe#31`.

Verified implementation:
- Travel TC-01 **15/15 browser PASS**
- Travel baseline **test/build/verify PASS**
- frozen current Travel terrain owner unchanged

Stage source:
- `georg-doc/kayfabizarro#116`
- merged at `958a0622b03d6164aa80ea4f426272e24531e22e`
- Stage mirror browser **13/13 PASS**

Canonical Cloudflare:
- QA `#117`
- run `35477984153`
- job `105990469211`
- result **BLOCKED / NOT PUBLIC_VERIFIED**
- exact `DEPLOYMENT.json` child path still returned HTML fallback instead of the TC-01 build marker
- canonical Chromium runtime proof was skipped

Do not send Georg the intended TC-01 child URL as a human-test link yet. Do not substitute GitHub Pages.

The product slice is technically complete; the only current gate is Cloudflare publication/sync of the already-tested Stage source. After PUBLIC_VERIFIED + Georg visual acceptance, use Travel `site/terrain-corridor-tc01/OSM_FOLLOWUP.md` for the next bounded lane.


### 2026-09-20 · TC-01 PUBLIC VERIFIED human gate

Current Track/Terrain candidate:
`georg-doc/KFB-Travel-Globe#31`

Public Stage:
`https://kayfabizarro.pages.dev/kfb-hub/stage/stunt-world/tinyskies-track-corridor-tc01/`

Verified evidence:
- implementation: **15/15 PASS**
- Travel baseline test/build/verify: **PASS**
- Stage mirror: **13/13 PASS**
- Cloudflare canonical: **13/13 PASS**
- final public run `35477984153`, attempt 3, job `105992963433`
- boot 946 ms
- 0 page/script errors
- 0 failed HTTP assets
- publication branch `cloudflare-live@ce455841ad1c90d6ea379f1b8ac97dd873a787bc`

Georg acceptance remains OPEN. Live remains unchanged.

Ask only:
**Does the embedded Track read as part of the current TinySkies/Travel terrain instead of a ribbon floating above unrelated ground?**

Only after acceptance start the prepared OSM lane:
`lat/lon → Globe normal/ENU → one short OSM road → same Travel terrain adapter → 3–5 building support pads → one exact landmark override`.

## 2026-09-20 · Game Dev Studio · Theatre Curtain v1

Game Dev Studio now has a reusable Theatre Curtain candidate in Draft PR #114.

Fixed human Stage:
`https://kayfabizarro.pages.dev/kfb-hub/stage/game-dev-studio/theatre-curtain-v1/`

Technical evidence at run `35479125591`: **22/22 local + 25/25 public PASS**, exact Three.js cloth donor isolated, real KFB fabric maps, two physically gathered panels, zero public resource/browser errors.

Status: **PUBLIC VERIFIED · HUMAN VISUAL/PHYSICS GATE OPEN · UNMERGED**.

Exactly one next gate is Georg's isolated curtain review: weight/folds, idle wind, opening gather, closing, impact and fabric choice. Birthday is not reactivated. Aging, tieback/swag, card-breach/dissolve and Shader Pool research remain deferred.



## 2026-09-20 · 2D Resident / DocCheck Project Island handoff

The 2D Animation Studio now has a named consumer route rather than remaining a generic donor lane.

WSA check-in:

`workflows/2D_RESIDENT_ACTOR_WSA_2026-09-20/START_HERE.md`

First prepared actor:

**DocCheck Eumel · 2.5D Resident**

Prepared consumers:

- DocCheck Project Island with an exact pinned KayKit 3D environment;
- KFB Resident Atlas through the existing Resident Scene Module seam;
- one later named KFB game consumer after the Resident proof.

The new `kfb.2d-actor-module/0.1-candidate` contract keeps world position, collision, camera, gameplay and persistence with the receiving consumer.

A Doccy quadruped topology template is prepared, but no Doccy visual geometry is inferred without authoritative source art.

Next technical gate: one browser-proven world-space `three2p5d` Eumel adapter. Do not index/promote the Resident candidate before that gate.


### 2026-09-20 · Current Track/Terrain state · visual reject, WorldSurface pivot

TC-01 remains **technical evidence**, not an accepted visual foundation.

Georg rejected the PUBLIC VERIFIED result because the Track reads as a black band, terrain pokes through, and the review camera cannot inspect the surface closely enough.

Current planning source:
`georg-doc/KFB-Travel-Globe/site/terrain-corridor-tc01/RED_TEAM_WORLD_SURFACE_PIVOT.md`
on branch `wsa/track-terrain-corridor-tc01-2026-09-20`.

Next gate is one A/B/C design/geometry proof:
1. host terrain only;
2. direct existing-face Track grading;
3. locally refined SurfacePatch derived from the host polygons.

Do not tune the existing TC-01 ribbon/zone composition forward. TinySkies/Travel remains one spherical WorldSurface donor; OSM remains geographic/semantic truth; OMS/Grotesque remains a stylised environment donor; Race retains driving/contact ownership.

The wider KFB target may support Sphere / Plane / InnerSphere and later structure/tunnel/underwater/free-space routes, but do not build a mega-engine before Sphere + Plane share one proven TrackPatch contract.


## 2026-09-20 · MVP world, combat, ToolBox and editor briefs

The current short planning board is [KFB MVP Integration Board](workflows/KFB_MVP_INTEGRATION_BOARD_V1_2026-09-20/START_HERE.md).

It routes four separate, source-preserving work lanes:
- [World/Race/Audio/Traffic](workflows/KFB_WORLD_RACE_AUDIO_TRAFFIC_V1_2026-09-20/START_HERE.md) — existing Race engine + Travel/TinySkies seam, real Racer audio and visual traffic proof;
- [Combat Arena Raid + Open World](workflows/KFB_COMBAT_RAID_OPEN_WORLD_SPRINT_V1_2026-09-20/START_HERE.md) — actor/EyeRig/ranged gates before melee/portal coupling;
- [ToolBox Cloudflare consolidation](workflows/KFB_TOOLBOX_CLOUDFLARE_CONSOLIDATION_V1_2026-09-20/START_HERE.md) — direct tested tool routes, a compact router and never-empty publication contract;
- [3D in-scene editor](workflows/KFB_INSCENE_EDITOR_MODULE_V1_2026-09-20/START_HERE.md) — adapters for Resident, Environment, Dungeon and Babel rather than a replacement editor.

These briefs are planning/export instructions. They grant no Race/Combat runtime rewrite or automatic Live promotion.


## 2026-09-21 · Hub UI v2 accepted + ToolBox v2

Georg accepted the Paper/Dark Hub UI v2 Stage. Promotion is source-reconciled onto the current Hub rather than merging the older diverged PR #141 snapshot directly.

ToolBox Home adopts the same Paper/Dark/hash/preview grammar at `/kfb-hub/stage/toolbox/` and is linked prominently from the Hub header. Its current route audit is honest: 6 public previews, 5 missing/blocked routes, 6 source/integration gates. Missing Cloudflare routes receive no fake preview.

WorldSurface I1A is locally complete at `georg-doc/KFB-Travel-Globe@d9d9d93c286fa52551ee881292a4db426a4cb8fc`: 72/72 PASS; SurfacePatch C is the technical leader but Georg's B/C/neither visual gate remains open. No public I1A Stage is claimed.


## 2026-09-21 · Legacy Actor Kit + EyeRig 17/17 technical PASS

ToolBox Legacy RPG Rigging remains on Draft PR #155, with current bounded evidence on follow-up branches. The shared Legacy appearance Baukasten / seeded Character+Monster randomizer is technically proven: Legacy base **29/29 static · 41/41 actor-switch · 44/44 full browser/WebGL PASS**; ActorRecipe **33/33 + 16/16 PASS**; selector F1 **2/2 + 21/21 PASS**; full seeded matrix **35/35 browser/WebGL PASS**.

KLR-EYE-01 now adds the requested Legacy eye-profile layer on Draft PR #162 / branch `chatgpt-web/legacy-eye-batch-17-2026-09-21`. Current branch head `7b1b52a60d64c9dc710514a59d1a7365f8a168e7`; persisted-profile tested head `91cca48809fb8a86c8ea7a8326eb6637fa89a066`.

Result:
- **17/17 persisted Legacy head profiles**;
- **16 MEASURED_CANDIDATE**;
- **1 HUMAN_REQUIRED: Skull**;
- automatic source-first generation **24/24 static + 247/247 browser/WebGL PASS**;
- persisted-profile reconstruction **30/30 static/profile + 215/215 browser/WebGL PASS**;
- zero failed resources and zero page/console errors in both browser runs;
- EyeRig v6 / EyeOval / existing profile schemas remain owners;
- source GLTF/GLB files remain unchanged.

The previously partial Cloudflare mirror has been repaired at repository level: the Legacy review lane now has its index, app, styles, adapter and all three Legacy profile/catalog data files under `kfb-hub/stage/toolbox/eye-rig-batch/legacy/` / sibling `data/`. Public `pages.dev` runtime verification from this chat environment remains pending because DNS/Web fetch is unavailable here.

Current router: [KAYKIT_LEGACY_RPG_RIGGING_2026-09-21](workflows/KAYKIT_LEGACY_RPG_RIGGING_2026-09-21/START_HERE.md).

Exactly one next gate: **KLR-EYE-VIS-01 · visual review of all 17 Legacy heads** at the direct intended route `https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-rig-batch/legacy/`. Front + 3/4; approve/adjust/reject per head; Skull manual placement or unsupported. Combat ranged/melee integration waits until this visual gate.


## 2026-09-21 · Legacy Web Pet v0

Sidequest candidate: Draft PR #157 / branch `chatgpt-web/legacy-web-pet-v0-2026-09-21`.

One shared Legacy presentation runtime now exists for a KFB-Hub/Web embed and a Chrome MV3 extension candidate. The Web/Hub host is technically green at tested runtime head `f41c59a8178bf77266c0f776f2e20a7948ee6223`: **15/15 static + 12/12 WebGL PASS**, Rogue default, real Rig_Legacy actions, 3D shadow, exact Orc-Warband banner + two props, click SFX/VFX, right-click character picker, Mage switch, zero failed resources and zero page/console errors. The branch also contains a default KFB-Hub mount candidate with `?pet=0` opt-out; it is not merged or published.

The MV3 extension source **builds**, but the arbitrary-page injection gate timed out twice before the pet `ready` marker. Explicit bundled-Chromium launch did not change that. Per the two-pass rule the extension gate is frozen; do not guess-fix it again in the same slice.

Return and recovery live on PR #157 under `skills/chat/workflows/LEGACY_WEB_PET_V0_2026-09-21/`.

Intended Stage `https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/legacy-web-pet/` is **NOT PUBLISHED / NOT PUBLIC_VERIFIED**.

Exactly one next gate: **LWP-EXT-F1 · extension-load observability** — identify the first missing transition in `CONTENT_ENTRY → HOST_CREATED → FRAME_INSERTED → FRAME_LOADED | FRAME_ERROR → PET_READY` before changing runtime behavior.

## 2026-09-22 · Combat CA2-LEGACY-00 readiness

Combat Arena Draft PR #10 is the new bounded Legacy readiness lane, stacked on the preserved PR #7 melee source. Final head `663f0610eb960f322d67b078f1302d0c6178d1c2` is CI-green at **106/106**, portable build **241 files**, re-home **172 preserved / 66 verified / routes PASS**.

This slice changes no Arena runtime. It pins the proven ToolBox Legacy donor as 4 bodies / 17 heads / 24 weapons / 6-bone 30-clip `Rig_Legacy`, then selects exactly two source candidates: **Rogue + common Crossbow + `Shoot(2h)`** for first ranged proof and **Knight + common Sword + `Attack(1h)`** for first melee proof. ToolBox remains appearance/EyeRig owner; Arena remains gameplay/combat owner.

No new Stage route is claimed. Sword-01's frozen Cloudflare child-route failure remains separate.

Exactly one next gate is **KLR-EYE-VIS-01** at the existing Legacy EyeRig review surface. Knight default and Rogue default must be human accepted/adjusted before `CA2-LEGACY-01R` starts; Skull may remain unsupported.



## 2026-09-22 · KFB Lead Work check-in reset

Cross-project consolidation returns to the existing KFB Lead / WSA Work lane rather than letting ToolBox become the accidental integration owner.

Current onboarding:

`skills/chat/workflows/KFB_LEAD_WORK_CHECKIN_2026-09-22/START_HERE.md`

Use Lead Work for:
- exact GitHub check-ins and status matrices;
- architecture/integration locks;
- sequencing accepted Web/Claude results;
- hard cross-repo implementation seams.

Keep source census, isolated donor proofs and calibration in bounded Web slices; keep visual/interactive authoring in Claude Design.

Prepared Combat companion:
`skills/chat/workflows/KFB_LEAD_WORK_CHECKIN_2026-09-22/COMBAT_RANGED_MVP.md`

First Combat consolidation is ranged-first and does not depend on melee.


## 2026-09-22 · Web-first / Work-escalation-only reset

Routine KFB lead/control-plane work no longer defaults to Work/WSA.

Current execution default:

`skills/chat/workflows/KFB_WEB_FIRST_EXECUTION_V1_2026-09-22/START_HERE.md`

Use:

- Web/GitHub for normal production, source work, planning, code, tests, debugging, changelogs and Hub metadata;
- Claude Design for visual/interactive 3D authoring;
- local HTTP preview for the normal human edit-review loop;
- Work/WSA only when an explicit capability gap remains after those three lanes.

Before using Work, fill:
`workflows/KFB_WEB_FIRST_EXECUTION_V1_2026-09-22/WORK_ESCALATION_CARD.md`.

For browser/game/3D slices use:
`workflows/KFB_WEB_FIRST_EXECUTION_V1_2026-09-22/LOCAL_PREVIEW_FIRST.md`.

Cloudflare Stage is a milestone/public acceptance surface, not the normal debugging loop.


## 2026-09-23 · Racer MVP Stabilization · RSTAB-0 mapped

Current Racer stabilization owner remains `georg-doc/KFB-Stunt-Car-Race`.

Newest Claude source is pinned to `KFB Cologne Race Option C-3/` at Race `main@cc80f4a1c6c509db9668df79fd53b13cee093a9d`.

RSTAB-0 is preserved on Race Draft PR #31 / `chat/racer-rstab0-audit-2026-09-23`; verified handoff head `58d837a5b858bdf7af178bcf0bb578d6ab018ff4`. It changes no Racer runtime.

Deterministic P0 map:
- ground wedge: ground-cut ↔ tunnel-shell seam, current visible mesh must be identified on the reproduced frame;
- hard bend: route index 176 / 29.4% / s≈589 m / radius ≈35.3 m, outside the preserved v0.8 full-speed ordinary-steer envelope;
- support pillars: 54/54 generated supports scanned, road penetrations at indices 166 / 179 / 187; normal `auditRoute()` excludes `structure-*`.

Current router:
`tools/KFB-ToolBox/_handover/RACER_MVP_STABILIZATION_2026-09-23/START_HERE.md`.

Exactly one next gate: **RSTAB-1 · static geometry intrusions — ground wedges + support pillars.** No global FLOW/FEEL or curve tuning before that gate is clear.


## 2026-09-23 · Racer MVP Stabilization · RSTAB-1 technical PASS

Current Racer remains owned by `georg-doc/KFB-Stunt-Car-Race`.

RSTAB-1 is on Draft PR #32 / `chat/racer-rstab1-geometry-2026-09-23`, stacked on RSTAB-0 PR #31.

Exact runtime + bounded-CI candidate head:

`e9c72a404aff63d46762d9101a727a9e7f94a6b0`

Technical result:

- ground cut now follows the actual banked 14-facet tunnel-shell seam with separate left/right cut edges;
- old post-SLEW split ownership is removed;
- all 54 structure supports remain, each ending at its real banked soffit;
- old support placement reproduces route penetrations 166 / 179 / 187; repaired placement yields 0;
- GitHub Actions run `35807766171`: **5/5 PASS · 0 FAIL**;
- route and v0.8 FLOW/FEEL unchanged;
- RSTAB-2 not started.

Current router:
`tools/KFB-ToolBox/_handover/RACER_MVP_STABILIZATION_2026-09-23/START_HERE.md`.

Exactly one next gate: **RSTAB-1 HUMAN GEOMETRY GATE** — visible tunnel/ground-cut + support review. Only human ACCEPT advances to RSTAB-2.


Zero-install human gate is now packaged as kayfabizarro Draft PR #178 with **20/20 C-3 `lab-v9` blob parity**. Intended review route:
`https://kayfabizarro.pages.dev/kfb-hub/stage/stunt-world/cologne-option-c-rstab1/`.

Cloudflare source commit: `77e4bd44aac0d0ce720c5b0149eedb3eef62ac36`. Hub source: `a075934bb5f8628535b673459b0b9ddcc0af5312`; main Hub metadata: `fd7680034171f9a327936e9ee7fa2a3cc1f6b4dc`.

Public verification is **UNKNOWN / PENDING** because this execution environment cannot resolve/access `pages.dev`. Local HTTP is only a developer fallback; do not present it as the human acceptance link. RSTAB-2 remains blocked until human ACCEPT.



## 2026-09-23 · Racer RSTAB-1 human FAIL → WEDGE pass 2

Current Racer owner remains `georg-doc/KFB-Stunt-Car-Race`.

The first zero-install RSTAB-1 human gate failed:
- at least two brown wedges remain in the first tunnel;
- first hard curve remains extremely jerky/unstable;
- Tail/Speedline ribbons overlap and break into rectangular pieces in that phase;
- vehicle floats above the track at rest, including visible front-wheel lift, and can jump/land above or inside the track.

Current WEDGE pass 2:
- exact brown cut transitions localized to **99→100** and **133→134**;
- both are inside TUNNEL and have rendered shell geometry;
- shell now owns those two transition segments; brown cut wall/invert is not emitted there;
- historical mouth **90→91** remains ground-owned;
- Race runtime/test candidate `a9dd49995d32423e101a67f2e591c2b069583252`;
- GitHub runs `35814096388` + `35814091421`: SUCCESS;
- current test file: **6 active / 0 skipped**;
- current Race PR #32 branch handoff head: `841d0cbd2f55561dd63897036ae3890ce6a246fa`.

This is the second and final WEDGE repair pass on this foundation. Same-gate failure again => STOP + full failure-recovery export; no pass 3.

Zero-install Stage:
`https://kayfabizarro.pages.dev/kfb-hub/stage/stunt-world/cologne-option-c-rstab1/`

Stage source:
- kayfabizarro Draft PR #178 head `df82e1fa31213d21c13af1f39f369608078633a3`;
- Cloudflare route source `ad0036c465e7c5a87c3cfcc0d49cfb2cf3378de0`;
- Hub metadata `cloudflare-live@f904c318172848078b9d7f58e2b186c5fda03e7d` / `main@db3a651698d4f829ebc1f7be543ab1b51dc20494`.

Public verification remains **UNKNOWN / PENDING** because this execution environment cannot resolve/access `pages.dev`.

After WEDGE ACCEPT, sequence is locked:
1. vehicle support/orientation/landing;
2. hard-curve stability with global v0.8 FLOW/FEEL preserved;
3. trail/speedline continuity recheck after stable motion.

Do not start curve/trail tuning before the WEDGE human recheck.

## 2026-09-23 · Travel Mode Bridge v1 · TMB-1D complete · TMB-1E next

Coordination brief:

`tools/KFB-ToolBox/_handover/TRAVEL_MODE_BRIDGE_V1_2026-09-23/START_HERE.md`

Prepared next review:

`tools/KFB-ToolBox/_handover/TRAVEL_MODE_BRIDGE_V1_2026-09-23/TMB1_SCALE_CAPACITY_REVIEW_2026-09-23.md`

Travel owner remains private `georg-doc/KFB-Travel-Globe`.

Completed source-first sequence:
- A · exact animated CardCarrier alone → public 18/18 PASS;
- B · exact ActionFigure Rig_Medium alone → public 22/22 PASS;
- C · neutral measured mount → public 41/41 PASS;
- D · exact S33 Surf candidate → public 52/52 PASS;
- current Travel Surf Draft PR #36 head `88382c111acf32f6b934c15ce7b6b1f6d4d15283`.

Georg human finding:
- card/contact good;
- rider too small;
- test roughly 1.8×–2.0× rider presentation;
- keep Surf/Ride pose;
- compare Legacy Warband Orc + Orc Brute/Large + one XL/Large-class character on the same card;
- card-thickness change deferred.

Exactly one next gate: **TMB-1E · HTML-first Surf scale + three-character capacity comparison.**

TMB-2 Double-Space, TMB-3 landing, WorldBuilder consumption and Drive integration remain **HOLD** until TMB-1E human scale/capacity review is resolved.

Racer stabilization separately carries `RSTAB-CYLINDER-GROUND-01` for track/support cylinders that appear above or below their intended support surface.


## 2026-09-23 · ToolBox / WorldBuilder / Orc Band current routing

### ToolBox
Current consolidation brief:
`tools/KFB-ToolBox/_handover/TOOLBOX_STAGE_FIRST_DEFAULT_V1_2026-09-23/START_HERE.md`

Direction:
- Stage-First Concept is the candidate default ToolBox UI;
- Claude Design composes existing owners, it does not rebuild EyeRig/Graft/Motion/Scene Editor;
- Web rehomes the Session Cut and generates zero-install HTML review;
- current v0.5 ZIP is intake/provenance, not wholesale promotion.

### WorldBuilder
Current product gate:
`WB1-TERRAIN-EDITOR-01`

Brief:
`tools/KFB-ToolBox/_handover/WORLD_BUILDER_V1_2026-09-22/TERRAIN_FIRST_FRESH_WEB_START.md`

After Web HTML Human PASS only:
`TERRAIN_EDITOR_CLAUDE_DESIGN_AFTER_WEB_2026-09-23.md`

### KayfaBizarros Orc Band
Current ideation/POC handoff:
`tools/KFB-ToolBox/_handover/KAYFABIZARROS_ORC_BAND_POC_2026-09-23/START_HERE.md`

First gate:
exact Orc B bandleader + source-backed drummer/wardrum + existing camp/scenery + `Rubbish Groove 2min A extend 01.mp3`, one shared beat clock, one HTML review.

All three lanes use HTML-first review. Cloudflare is milestone-only.


## 2026-09-23 · Racer TARCH-0 · Chat-artifact visual QA

Current Racer tunnel architecture lane is Race Draft PR **#33**:
- branch `chat/racer-tarch0-sp13ktra-2026-09-23`;
- current handoff head `45fa80d0449efecf6a9ecfb69386c6cb4f9ba1fd`;
- runtime-tested architecture head `b37cbad1038e669a0c9929d25789d54d0283b0fc`;
- CI `35817990559 / 107043574054 · SUCCESS`;
- **7 active architecture tests · 0 skipped**.

The previous RSTAB-1 tunnel/ground foundation is archived after two failed human repair passes; do not resume WEDGE pass 3.

TARCH donor principle:
`KilledByAPixel/SP13KTRA@166ad838b9a067f85100eaff7876522f7cfe9feb`.
SP13KTRA is All Rights Reserved; no source/assets copied.

Visual acceptance workflow:
1. R1 isolated HTML artifact attached directly in ChatGPT;
2. after R1 ACCEPT: R2 integrated Racer HTML artifact;
3. optional R3 one local integration correction.

**Cloudflare / Pages are deferred until after human visual acceptance and are not part of iterative QA.**

Current project router:
`tools/KFB-ToolBox/_handover/RACER_MVP_STABILIZATION_2026-09-23/START_HERE.md`.

Exactly one next gate:
**TARCH-0 HUMAN ARCHITECTURE GATE · R1 CHAT HTML**.


## KFB Authoring Recovery · 2026-09-23

After timeout/context loss across the current authoring lanes, use:

`tools/KFB-ToolBox/_handover/KFB_AUTHORING_RECOVERY_2026-09-23/START_HERE.md`

Fresh-chat prompt:

`tools/KFB-ToolBox/_handover/KFB_AUTHORING_RECOVERY_2026-09-23/FRESH_WEB_START.md`

This recovers current ToolBox Stage-First, WorldBuilder Terrain-First and Orc Band POC routing, then selects exactly one lane for execution.

Normal visual loop is:
`GitHub checkpoint → zero-install REVIEW.html → Georg feedback`.
Cloudflare and Work are not part of ordinary iteration.


## 2026-09-23 · Verified Review Artifact Pool · Racer R1 accepted / R2 next

Web-First HTML review now has a shared verified donor pool:

- `skills/chat/workflows/KFB_WEB_FIRST_EXECUTION_V1_2026-09-22/REVIEW_TEMPLATE_POOL.md`
- `skills/chat/workflows/KFB_WEB_FIRST_EXECUTION_V1_2026-09-22/review-templates/REGISTRY.json`

Admission rule: only human-accepted review harnesses enter the pool.

Current first verified donor:
`threejs-focus-review-v1`

Origin:
Racer TARCH-0 R1, Race Draft PR #33.

R1 status:
**GEORG ACCEPTED**.

Current Race branch:
`chat/racer-tarch0-sp13ktra-2026-09-23@2ab130f871fc0340401145c8713a64c97789b80b`

Runtime geometry remains:
`b37cbad1038e669a0c9929d25789d54d0283b0fc`

R2 integrated Chat HTML is prepared and recoverable via:
`_handover/RACER_MVP_STABILIZATION_2026-09-23/TARCH-0/review/R2_PREPARED.md`

Exactly one current Racer gate:
**TARCH-0 R2 · integrated Racer Chat HTML human review**.

Cloudflare / Pages remain deferred until after human visual acceptance.


## 2026-09-23 · WorldBuilder becomes ToolBox scene authoring

Current corrected WorldBuilder route:

`tools/KFB-ToolBox/_handover/WORLD_BUILDER_V1_2026-09-22/TOOLBOX_SCENE_AUTHORING_CORRECTION_2026-09-23.md`

Fresh Web start:

`tools/KFB-ToolBox/_handover/WORLD_BUILDER_V1_2026-09-22/TOOLBOX_SCENE_AUTHORING_FRESH_WEB_START_2026-09-23.md`

WorldBuilder remains Terrain-First, but its first useful gate now includes one real Resident Atlas actor and one existing compatible animation clip. It is a ToolBox scene-building surface, not a second Resident Atlas, Animation Lab or game runtime.

FrizzleBob source identity is separately pinned at:

`tools/KFB-ToolBox/_handover/FRIZZLEBOB_IDENTITY_MAP_2026-09-23.md`

Current first gate: **CLAUDE DESIGN · WORLDBUILDER AUTHORING/UI REFINEMENT AFTER WB2 HUMAN PASS**.

Accepted foundation on Draft PR #186:
- R1 functional foundation is **GEORG HUMAN PASS**: Caveman texture, Character Y, Character-Y save/reload and palette/FOV;
- R2 shared inline editor is **GEORG HUMAN PASS**: object mini-menu, Move / Rotate / free Scale / Drop / World-Local / Close and Save/Reload transform roundtrip;
- shared edit owner: `tools/KFB-ToolBox/lib/edit-layer.js`;
- R3 uniform smaller/larger remains **OPTIONAL / NON-BLOCKING**.

Current WB2 implementation on stacked Draft PR #190:
- branch: `chatgpt-web/worldbuilder-wb2-terrain-sculpt-2026-09-23`;
- brief: `tools/KFB-ToolBox/_handover/WORLD_BUILDER_V1_2026-09-22/WB2_TERRAIN_SCULPTING_PROPOSAL_2026-09-23.md`;
- Source: `tools/KFB-ToolBox/worldbuilder/wb2-terrain-sculpt-01/WB2_TERRAIN_SCULPT_01_SOURCE.html`;
- Chat Review: `tools/KFB-ToolBox/worldbuilder/wb2-terrain-sculpt-01/WB2_TERRAIN_SCULPT_01_REVIEW.html`;
- sculpt module: `tools/KFB-ToolBox/worldbuilder/wb2-terrain-sculpt-01/terrain-sculpt.js`;
- Return: `tools/KFB-ToolBox/_handover/WORLD_BUILDER_V1_2026-09-22/RETURN_WB2_TERRAIN_SCULPT_2026-09-23.md`;
- implemented: Object / Raise / Lower, Radius, Strength, visible brush footprint, drag strokes, C2 falloff, Undo/Clear, sculpt Save/Reload, normal recompute, wheel/touchpad Radius, hold-Space temporary Orbit and `1/2/3` quick modes;
- evidence: **24/24** sculpt math/geometry + **56/56** current Source/Review contract + **31/31** focused interaction contract + **4/4** exact runtime sources;
- embedded browser self-test: **34 assertions prepared / 0 executed**;
- automated browser runtime: **0**; screenshots: **0**;
- human result: **WB2-TERRAIN-SCULPT-01 · GEORG HUMAN PASS**;
- Cloudflare: **HOLD · NOT PUBLISHED**.

Exactly one next WorldBuilder gate: **Claude Design authoring/UI refinement on the accepted WB2 source**, using `tools/KFB-ToolBox/_handover/WORLD_BUILDER_V1_2026-09-22/TERRAIN_EDITOR_CLAUDE_DESIGN_AFTER_WEB_2026-09-23.md`.

Primary UX direction: reduce redundant side-panel editor controls/copy, keep object transforms inline, keep Terrain Sculpt compact and scene-level, maximize 3D FOV, and compose accepted WorldDesign look/environment controls. Smooth / Flatten / material painting remain separate later functional slices.
