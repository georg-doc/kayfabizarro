# KFB Maker Space · Holographic World Foundry + Personal Retreats v0.8
**2026-10-09 · Concept / architecture addendum · NO production World runtime implementation or public Site**
**Owner:** KFB AI Game Art Academy / Maker Space for player-facing Maker UX, lesson/crafting presentation and source routing only. **Receiving authority:** existing KFB WorldBuilder/WB2 + God Mode (world recipe, placement, persistence, release), Track Core (tracks/roads), Asset Registry, Resident/Activity, Surface/Skydome, Audio and Production Control (checkpoints only).
**Repo:** georg-doc/kayfabizarro
**Branch:** planning/kfb-ai-game-art-academy-makerspace-v05-2026-10-09
**Current KFB World status:** Island MVP R4 STOPPED, NO MVP, no authorized R5. Four-Island Story Vision A/B remains separate gate. This side-lane DOES NOT modify either.

## 1. Product thesis

**A playable world can contain an interactive holographic representation of a future world without running a second full world engine.** Use the SAME versioned WorldRecipe/module/asset references viewed through different adapters:

- **Workshop tabletop/hologram:** selected island/world recipe drawn as low-LOD miniaturization / derived preview, not a second authoritative world.
- **Focused simulation/instance:** render only one isolated bounded test world using existing World renderer/physics owner; draft is mutable, reversible, not public.
- **Personal Retreat / Player Housing:** durable authored private world/lot, player can visit, furnish, invite and extend under permitted state owner.
- **Shared Catalog World:** separately reviewed and published versioned owner-accepted world instance discoverable by other users.
- **God Mode:** privileged authoring, validation and promotion path. Maker/Crafting and Feynman Tutor are narrower permitted projections over the same owner actions.

Holographic materialization is an **animation/presentation of a version-controlled application operation**, not a literal terrain teleporter or automatic mutation of the canonical global World.

Cartoon identity: one workshop board/workstation is enough for the first proof. Future stage may present mini islands on a luminous/clay sculpting table, FrizzleBob v5 as source-pinned tutor, 3 maker desks, existing Billboard and source-backed world/asset/style palette. No new generic UI suite.

## 2. Existing verified donors and precise reuse

1. **God Mode + Lean Memory/Stage/Live architecture**: `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/SITE_GODMODE_LEAN_MEMORY_ARCHITECTURE_2026-10-04.md` blob `ff4571348634181323059b0babad3b5d862e409c`; enumerates WorldRecipe, Mini-Scene, Track/Transition, Resident Set, Attraction/Instance, Media, Sky/Weather profiles, typed semantic actions, one canvas and one pointer owner. It is a planning owner contract, NOT a running published world.
2. **Track Core ownership canon**: `skills/chat/KFB_OPEN_WORLD_ROAD_TRACK_CORE_CANON_2026-10-07.md` blob `4c32fd8a08a124c6015b91b951e37020e8b13c75`; Track Core compiles RouteRecipe, connection sockets and canonical construction/profile/physical road geometry. World route planner owns routes/terrain intent. No new Track Editor owner. Existing donor `tools/world_atlas/source/lib/track-chain.js` blob `e6a6afc3d7439e0b6a28b648e77d4af2fe5daf18` contains measured original Kenney token-chain racetrack mechanics; it is a source candidate, NOT automatically accepted Track Core implementation.
3. **Tactical / Storytelling Map**: `tools/KFB-ToolBox/_handover/CLAUDE_DESIGN_WORLD_RACER_2026-09-22/STORYTELLING_MAP_WORLD_DONOR_2026-09-22.md` blob `8b35933ad5ee6879fcdd65cbc94543e9742bbd26`: map representation acts on reversible pivot wrappers and restores canonical geographic transforms. Current Europe board has unresolved water/look and is NOT an approved world runtime. Reuse its *view/truth separation* and possible mini-world animation grammar only.
4. **Resident mini-scenes**: `tools/resident_atlas/modules/clown-juggling-island.module.json` blob `1c75730143e3481b43edaa8e7231e1a853f7834d`: actual candidate recipe with resident, source, activity, support/footprint and host-owned collision. Good proof that a residency can be represented as a module instead of a freestanding second simulator. Status candidate-only.
5. **Skydome / environment**: `travel/KFB Travel Combat v25/terrain-v25/skydome-shader.js` blob `919ed27bb4ab5a6bb9b823421804d73cb5ae64bd`: source supports selectable procedural or static atmospheres; world sky owner remains authoritative; compatibility with current WB2 and interactive editing untested.
6. **World Deck seeds**: `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/DECK_WORLD_SEED_CARD_PIPELINE_2026-10-04.md` blob `15f8fce5428bfc6c2725b9e3042e9a8a83966468`: existing Card/Deck art/json may seed world themes and motifs while retaining provenance.
7. **Terrain Sculpt**: God Mode architecture references `tools/KFB-ToolBox/worldbuilder/wb2-terrain-sculpt-01/terrain-sculpt.js`, but the exact file path returned **GitHub NOT_FOUND on current main** in this review. Search found mentions/older inbox candidate compositions only. Mark actual active terrain-sculpt source/version **SOURCE_REQUIRED** before promising implementable brush strokes. Never imply another terrain owner.
8. **Maker-capability sources**: `GODMODE_TOOLBOX_CAPABILITY_CENSUS_V07.md` plus `MAKERSPACE_INTERACTIVE_LEARNING_CRAFTING_V06.md` cover Asset Librarian, FrankenStein/EyeRig/Material/Rig/Animation, VFX, audio, ChatterBox, Backpack and user asset receipts. Existing specialist sites are tools, not new world or map authority.
9. **Current World authority:** `skills/chat/recovery/KFB_ISLAND_MVP_FROZEN_MATRIX_2026-10-07.md` F-R02 island/session local identity, F-R03 continuous Surface Truth, F-R04 stable WorldObject identity, F-R06 module API/failure isolation, F-R07 bounded perf/LOD, F-R08 LLM-free deterministic default. R4 stopped due to world-model/composition failure; no successful final World baseline.

## 3. Functional workflow: holographic island from modules

0. In current MakerSpace select `NEW DRAFT: ISLAND`, `PERSONAL RETREAT`, or `SCENE MODULE`. Create a draft with own stable `worldId/instanceId`, owner ID, base WorldRecipe and version. **Do not clone or mutate public shared World immediately.**
1. **Layout on tabletop:** choose a source-backed island module / biomes / terrain profile and relative island-local coordinates. Holographic thumbnail uses a **Map Representation Adapter** that projects the same draft recipe in miniature (same semantic IDs and canonical positions, visual scaling only).
2. **Terrain sculpture:** issue owner-approved additive/non-destructive patch strokes against one bounded authoritative Surface Truth, respecting support, water/bridge/road invariants. Do not cut visuals free of collision/nav/ground. Actual module availability must first be verified.
3. **Structure & residency:** select approved Asset Registry props and Resident Atlas/Scene modules, place through existing God Mode snap/support rules. Each resident has a real activity/POI/reaction contract and support anchor; a random standing figurine is not “a living residence.”
4. **Track:** operate on Track Core RouteRecipe / source-measured sockets/profiles, snap ramps/loops/road pieces only when Track Core supports exact geometry, grade/turn radius/support/drive contact. Prevent crossing terrain/Resident POIs and preserve authored track identities; auto-connectors need real connected graph proof.
5. **Skydome/light/material/audio:** select existing owner-pinned profiles and modify allowed parameters on a draft, then check total scene coherence, GPU budget and lighting; shader experimentation does not automatically replace World/Surface truth.
6. **Focused test/play:** spawn into an isolated actual bounded runtime instance, walk/drive/return, test navigation, collision, Residents, FPS, effect/audio resources, save/restore, draw calls. The hologram alone is NOT acceptance.
7. **Save/edit:** durable versioned recipe + patch journal + artifact references. Autosave without loss is a real persistence feature, not assumed by a visual Site. Versioned undo/redo, branch/restore and exact asset pins.
8. **Place on Tactical Map:** choose a WorldGraph attachment point or destination portal/route node; validate graph identity/connectivity and player return. Its placement in a tabletop view is a proposed *map/portal patch*, not a direct mutation of the existing canonical world.
9. **Publish request:** declare destination `PRIVATE`, `INVITE`, `PUBLIC_CATALOG` or authorized `CANONICAL_WORLD_STAGE`. Validate, package, accept/reject, then atomically apply the appropriate owner-managed manifest pointer. The visible “materialize” animation follows confirmed application and readback.
10. **Return:** world is reachable from its approved anchor/portal, or from a personal retreat library; rollback/removal respects existing visits, inventory, resident histories and immutable old versions.

## 4. Persistence & permission state — NOT just additional views

**Separate immutable content from mutable player/world state.**

- `WorldTemplate/WorldRecipe`: immutable base module refs, content pins, deterministic generator seed and compatible versions.
- `WorldDraft`: actor/user-owned working branch/patch sequence and pending edits; can safely discard/replay.
- `WorldInstance`: durable unique identity, owner/ACL and currently pinned recipe revision, independent mutable state (objects, terrain effects, Residents, portal links).
- `PlayerSave`: player position, personal home anchor, inventory/quests, private world access links.
- `LearnerState`: Academy mastery E0–E5, recapture tasks, evidence receipts; distinct from PlayerSave/World truth.
- `PublicationRecord`: accepted package, provenance/licensing, checks, published revision and rollback pointer; not KFB Production Control alone (that is operations checkpoint ledger).

Representative state model (conceptual, **not yet adopted schemas**):
`DRAFT → LOCAL_PREVIEW → VALIDATED → PRIVATE_VISITABLE → SHARED_INVITE → PUBLIC_CATALOG`. 
Separately `STAGE_CANDIDATE → HUMAN_ACCEPTED → LIVE_CANON` where named World authority explicitly permits. These are separate publication scopes, not a single rising privilege ladder. A private owner may never obtain rights to alter canonical shared World merely by completing a tutor task or paying Fluff.

**Access roles:** owner/editor/invitee/visitor/moderator/World publisher. Enforce on server/tool actions, not client visibility. An API may reject unauthorized changes even when buttons are hidden. Public uploads require validation, licensing, quota, abuse protection, moderation and content policy; user GLBs/JS/shaders must not be executed without validation/sandbox.

**Atomicity:** `validate(recipeRevision, worldRuntimeRevision) → package → approved target manifest → server apply-if-head-matches → readback → publish/notify`; on conflict reject/rebase, do not overwrite concurrent creator changes or partial meshes. Lossless restore by exact old revision. Client-side user state alone is insufficient for multiple players or shared world.

## 5. Nested simulation without nested runtime

The holographic view is a **presentation adapter**, not a physically running entire WB2 World inside another WB2 World. Use one host renderer/context, low-LOD/RTT for preview and static material approximations; suspend expensive AI/audio/physics in miniature. Detailed interactions switch to the **one focused scene/instance** through existing World portal/instance owner, then back to same location. Simulation clock and pointer ownership are explicit. Limit depth (no recursive unlimited universe nesting), textures, actors, shader budget and memory.

Tactical map location can be topological/semantic before physically placing new terrain in shared continuous space. Validate coordinate-frame translation: `miniWorld-local → authored island-local → WorldGraph anchor`; only the owner computes final World surface/physics placement. No arbitrary float offset “materialization.”

## 6. Five main product risks + mitigations

1. **Shared-state and multiplayer correctness:** permissions and views do not solve distributed persistence, optimistic concurrency, invitations, rollback, server authoritative source or synchronization. First use private single-user recipes without live multiplayer. Public/canonical is separate release infrastructure.
2. **World structural integrity:** terrain edits must preserve Surface Truth, colliders, roads/tracks, resident supports, water and nav; treat patch as one validated transaction, not instant vertices change.
3. **Performance and hardware:** a nested open world with active Resident simulation, bloom, particles and audio duplicates GPU/CPU cost. Miniaturization preview stays cheap/dormant; full focused instance uses one World runtime and bounded budgets.
4. **Source provenance, asset rights and safety:** community GLB/FBX/video/audio and shaders require scanning, attribution/license, validated rig/material formats, texture size, script sandboxing and robust asset cleanup. User created content does not inherit rights to redistribute donor source.
5. **Publication and human governance:** public worlds need visibility controls, content policy/moderation, name/route collision resolution, broken world quarantine, compatibility migration and publisher authority; stable links are IDs + manifest version, not arbitrary Site redeploys. GPT Site can be presentation/editor, but does not automatically provide these backend functions.

## 7. Incremental proof plan without starting World R5

**R0 planning (this chat):** source-owner architecture, draft→instance→publication truth, precise next executor. No world edits.

**R1 cheap visual/semantic proof (current gate, no new gate):**
- Claude Design first shows original KFB World/Track/Resident/Skydome/Map donors **in isolation** where used, alongside existing Academy Drag/Character-Alchemy first proof.
- One static/deterministic miniature `WorldRecipe` preview using exact source-backed KFB modules on an isolated test surface; show that one semantic landmark, one route and one Resident share stable IDs in both hologram map and future World recipe. Mini scene is a proposal until rendered and separately QA'd.
- One *simulated* publication receipt, explicitly DRY_RUN with no real player/world state written; preview→validate→revert must be inspectable.
- No requirement to produce full terrain, real multiplayer, new God Mode runtime or public Stage as part of current Academy original-source gate.

**R2 private owner-authorized integration (later separate scope):** single exact existing World instance/template, one terrain patch and one Track-Core/Resident placement, preview/play/restore, stored as private single-user recipe if World owner approves after A/B and source tests.

**R3 later optional:** personal housing/world browsing; controlled invitations/public catalog, robust server identity/access, creator uploads and publication/moderation; no default Live promotion.

## 8. Responsibility / next owner

**Current Academy owner (this planning branch):** maintain reusable learning/visual/capability concepts, asset/source inventory and crash-safe Recovery/Return. Do not implement the World or Track Core.
**Next executor:** Claude Design for source-faithful holographic MakerSpace spatial concept and existing functional visual proof, **only after** original donor source isolated. Any code/runtime/JSON manifest test beyond Claude Design goes to *one sequential* Claude Code or ChatGPT Work technical executor in existing owner; not a second runtime.
**WorldBuilder WB2 and Track Core owners:** independently authorize and implement any actual world-edit/track recipe/instance/publishing capability *after* their current product gates; Studio cannot mutate protected runtime during R4 STOP.
**KFB production/publishing authority:** human review for public/canonical release, not automatic from craft/tutor action.
**Georg:** can select priorities/house design/asset references; no manual tool setup needed just for this planning proof. Only actual visual/prod decision when a real evidence artifact exists.

**Exactly one active Academy gate:** `ACADEMY_MAKERSPACE_VISUAL_SOURCE_PROOF_R1` (source-grounded Maker Space visual functional proof). World Four-Island Story Vision R1 is separately unchanged. No auto-merge, no live promotion or new public Stage/GPT Site in this work.
