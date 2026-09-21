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

## Status vocabulary

`CURRENT_CANON` · `CURRENT_TOOL` · `CURRENT_REFERENCE` · `CURRENT_PROJECT_SSOT` · `LEGACY_REFERENCE` · `SUPERSEDED` · `ARCHIVED_HISTORY` · `UNVERIFIED` · `EXPERIMENTAL`

## Core docs

- `LIVING_MASTERPLAN.md` — durable cross-project lead plan and sequence
- `masterplan/` — scoped masterplan addenda, referenced from `REGISTRY.json`
- `meta/KFB_META_COMPENDIUM_v1.md` — cross-module meta index; routing/reference only
- `town/START_HERE.md` + `town/LIVING_KFB_TOWN.md` — current KFB Town ideation home
- `RECOVERY_PATH.md` — deterministic recovery after chat/context failure
- `FRESH_CHAT_SLICE_PROTOCOL.md` — bounded cold-start work and compact next-day review packet
- `CHAT_GITHUB_KFB_STAGE_WORKFLOW.md` — binding Chat → GitHub → Cloudflare Stage → Hub delivery and timeout recovery
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


## 2026-09-21 · Legacy RPG Rigging base PASS + Actor Kit F1 PASS

ToolBox Legacy RPG Rigging remains on Draft PR #155 / branch `chatgpt-web/toolbox-legacy-rpg-rigging-2026-09-21`.

The **Legacy base is browser-proven** at `5b2fa78220ec4127c1b761c4d7f7a8304dfb11e9`: **29/29 static · 41/41 KLR-SYNC · 44/44 full browser/WebGL PASS**, with zero failed resources and zero page/console errors. Source roster remains 4 Dungeon 1.0 bodies, 17 heads, source body/clothing materials, 5 head-gear/hair entries, 24 tiered weapons, Arrow/Quiver/Spellbook props and the existing 6-bone / 30-clip Rig_Legacy donor. Resident Atlas inverse-bind assembly and EyeRig v6 remain reused owners.

KLR-KIT-01 provides the caller-seeded `kfb.legacy-actor-recipe/0.1-candidate` appearance core with **33/33 static + 16/16 deterministic recipe PASS**, no `Math.random()` and explicit rejection of gameplay/AI/stat fields.

The earlier browser integration regression is now isolated and resolved by **KLR-KIT-F1** on branch `chatgpt-web/klr-kit-f1-2026-09-21`. Tested head `44d595bc60259f4a74da7043df13582f1b5ccd89`: **2/2 selector + 21/21 isolated browser/WebGL PASS**. Exact recipe `gate-16 = Knight + Rogue Head C + no held item`; ready token, recipe/UI identity, 30 clips and core parts all matched; zero failed resources and zero browser errors. Run `35552848730`, artifact `10618729208`.

Current router: [KAYKIT_LEGACY_RPG_RIGGING_2026-09-21](workflows/KAYKIT_LEGACY_RPG_RIGGING_2026-09-21/START_HERE.md).

Exactly one next gate: **resume the KLR-KIT-01 three-seed browser matrix: `gate-16 → gate-75 → gate-33 → repeat gate-16`.** No Combat/WhackMan runtime integration or Legacy Stage publication before that matrix passes.

