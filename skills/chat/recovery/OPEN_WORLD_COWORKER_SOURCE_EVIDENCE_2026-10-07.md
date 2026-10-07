# Coworker source evidence audit · 2026-10-07

Read-only Evidence Auditor. This is factual source checking, not plan certification or runtime acceptance. Binding ledger was frozen before candidate inspection. Inspected current Dropbox `/CLAUDE/KFB Open World` using the inspect-dropbox-file skill: metadata first, document fetch, complete recursive src listing (`has_more=false`), then raw download because Dropbox text extraction classifies .ts as video/mp2t and returns INVALID_ARGUMENT. One rate-limit delay was observed and resolved. 55 downloaded source files match all 55 Dropbox content hashes. Copies and verification records are in `candidate-inputs/`; no donor/runtime/GitHub/Sites/Dropbox source was modified. No build, browser play, source-object isolation, or visual certification was performed.

## Source authority and pins

Current candidate documents (Dropbox server time UTC):
| Path below /CLAUDE/KFB Open World | rev | server_modified |
|---|---|---|
| RETURN.md | 65d38ed49831e4602da6f | 2026-10-07T04:55:40Z |
| SPEC_KFB_OPEN_WORLD_01.md | 65d1e758ae0f64602da6f | 2026-10-05T21:21:02Z |
| docs/ARCHITECTURE_AS_BUILT.md | 65d304fce17084602da6f | 2026-10-06T18:38:58Z |
| docs/FREEZE_GAP_CHECK.md | 65d38ed49831f4602da6f | 2026-10-07T04:55:40Z |
| docs/STATUS.json | 65d38ed4983194602da6f | 2026-10-07T04:55:40Z |

RETURN does not give an exact current full Git head: it says local main was never pushed and parent is 6d69428. Additional read-only Dropbox ref inspection proves actual HEAD: `.git/HEAD` rev `65d1ecae829ee4602da6f` (server_modified 2026-10-05T21:44:54Z) contains `ref: refs/heads/main`; `.git/refs/heads/main` rev `65d38ed49831d4602da6f` (server_modified 2026-10-07T04:55:40Z) contains **`5f0cdfa2eb4c6927c50ca399f8dbd62fa79dc3a4`**. This is a fetched current ref, not a chat-memory inference. The repo is local, never pushed according to RETURN; it has no public PR head. Ref copies/metadata are in candidate-inputs/candidate-git-ref.json. Complete root/docs listings found ARCHITECTURE_AS_BUILT and FREEZE_GAP_CHECK but no completed final Architecture Freeze artifact. Thus the following decisions audit the current proposed Freeze, not a newly completed freeze implementation.

Candidate SPEC:61 still says camera-relative WASD and :70 excludes Residents/cards/dialogue/vehicles. Those are candidate history, not authority to weaken GitHub required rows. Current code supersedes the old control description; frozen GitHub requirements supersede candidate exclusions.

## Mandatory terrain classification

**HEX_ROLE = MACRO_TERRAIN_OWNER · ARCHITECTURE DRIFT**

| Question | Actual source evidence (paths relative to candidate root) |
|---|---|
| What creates visible ground? | terrain/build.ts:15–18 names hex_grass/base/bottom/slope assets; :555–642 iterates chunk.cells, places cell geometry at hexToWorld(q,r), y0=cell.level*LEVEL_H, emits Hex flat tops, cliff columns, shore meshes and planar Hex ramps. Welding same-level tops changes seams, not macro topology. |
| Who owns support height? | terrain/index.ts:262 installs TerrainBuilder.heightAt into world.heightProvider. terrain/build.ts:528–552 rounds world xz to the nearest Hex and reads final cell.level, slope, coast and embankment. core/world.ts:138–162 has a Hex fallback. roads/index.ts:198–199 wraps the provider with roadSinkAt. |
| What does collision sample? | Ground collision is Rapier geometry, not merely a call to heightAt: terrain/build.ts:811–859 creates Hex prism/ramp convex hulls; :510–522 embankment trimesh; :621–632 lowers road support hulls. roads/render.ts:677–686 installs road WORLD trimeshes. character/player.ts:1432 uses KCC.computeColliderMovement; :1700+ support probes and :1735 tryStep query Rapier. :1594 heightAt is a fall-rescue bound, not the entire collision mechanism. |
| What do roads sample? | roads/index.ts:192 binds RoadNet to world.cellAt(2); roads/net.ts:238–256 requires same integer levels at sites; :515–606 and :880–976 route/notch/foot-ramp eligibility use levels/slopes. roads/layers.ts:37–47 writes roadMask, level and slope. roads/render.ts:638–640 bases rendered road/river y on cell.level*LEVEL_H; :962 additionally samples world.heightAt for berm continuity. |
| What do rivers sample? | roads/index.ts:193 binds RiverNet to world.cellAt(4), i.e. stages 1–3. roads/rivers.ts:216–227 locks a route to one integer level; roads/corridor.ts imports terrain/gen. river masks and bridges are written by roads/layers.ts:56–66. River terrain is a flat corridor and tile topology, not continuous-surface sampling. |
| What is a chunk? | core/units.ts:29–30 CHUNK=8; core/hex.ts:76–87 maps axial cells into an 8×8 parallelogram; core/types.ts:50–55 ChunkInfo contains cells. core/chunks.ts:310 constructs chunk.cells from chunkCells. This addressing/lifecycle can remain spatial. |
| Are boundaries structural? | Yes: level steps are 3.75 m (units.ts:23), pitch 15 m (:19), slope direction is a six-edge cell direction (types.ts:15–23); support selection uses hexRound and convex hulls use six Hex corners. Return's tile-read complaint is corroboration, not the deciding evidence. |

Smallest correction seam, without implementation: one Continuous Terrain/Surface Truth owner must supply visible macro mesh **and matching support/collision**, consuming declared road cuts/ramps, river corridors and village flattening contributions. Retain axial region addresses, seed/hashes, memoized semantic generation and streaming lifecycle as data/mechanisms. Replace the terrain builder/provider and terrain-specific road surface/render contribution boundary; replace direct level writers with contributions. Adapt all remaining level-derived placement shortcuts: nature/place.ts:146–151 bypasses heightAt for flat cells, villages/plan.ts:453 and :859 assigns level*LEVEL_H, props/plan.ts:190 starts from level. Surface walkability, slope and ramp eligibility must also replace integer-level assumptions in terrain/api.ts:40–67 and roads/net.ts:515–606; RoadNet/RiverNet route constraints must consume these public facts. Authoring/surface revisions must invalidate/recompute affected derived memo layers/plans, not keep WorldModel's seed+q/r memo and module region caches silently stale (world.ts:78–111; village plan.ts:219–234; nature place.ts local plan caches). A provider-only swap would leave visual mesh, physics, placements, walkability and derived memos inconsistent. RoadNet/RiverNet eligibility and render-tile geometry need adaptation, but their routing determinism, graph/anchor concepts, village/prop planning and streaming do not need wholesale reinvention. Relative effort LARGE, not a cosmetic SMALL seam.

## Mechanisms genuinely present versus acceptance

KEEP/ADAPT below describe **source-proven mechanisms only**. They do not certify integrated runtime quality or presentation/content identity.

| Capability | Source-proven mechanism | Disposition / receiving boundary |
|---|---|---|
| Deterministic world | world.ts:50–128 ordered layers, clone-before-apply, per-stage memo, retry marker; rng.ts seeded functions. | KEEP seed/hash/layer mechanisms; ADAPT terrain/override dependency model. Memo is q/r per fixed seed and is not override-aware. |
| Streaming | streaming/streamer.ts:120–166 takes chunk lifecycle; :328–377 time-slices jobs with 6 ms base, 10 ms growth, 24 ms recovery; :401–448 streams colliders near player. job.ts:54–106 stages warm/plan/module/merge/compile/adopt. | KEEP lifecycle, prefetch, disposal, near-physics machinery; ADAPT API imports and actor scheduler. Urgent/atomic work can exceed budgets. |
| Ground movement / collision | player.ts:396–406 KCC and fixed step; :735–798 defaults to canon, A/D heading belongs to character, Q/E strafe, Shift sprint, Space jump; :1432 KCC, :1735 extra stepping. | KEEP normal-input semantics + KCC/contact mechanism; ADAPT to final surface and future mode arbitration. No new global keyboard owner. |
| Motion | anim.ts:81–244 samples real skeleton stance/native speed and drift; player.ts:444–465 validates precomputed records and remeasures stale clips; :1572–1591 natural clocks; :2055–2128 planted-foot slip diagnostics. | KEEP measurement/diagnostic/natural-clock mechanism; ADAPT Motion SSOT/layer stack. Reported foot-slip score is not an independently re-run native speed-band proof. |
| Camera | rig.ts:267+ sphere cast, :296+ rays, :453+ orbit/zoom, :676–1046 pin/slide/edge/raise/canopy rule stack. | ADAPT public input/probe seam; current quality UNPROVEN here, known below threshold in candidate records. Do not KEEP-quality certify camera. |
| Roads/rivers/bridges | roads/layers.ts, net.ts, rivers.ts; render.ts:638–688 tiles/trimeshes, :1851–1920 bridge deck hull/parapets/approach handling. | ADAPT graph/routing and collision-fit mechanisms to Surface Truth; visual design UNPROVEN, overland roads are not Track Core. |
| Villages/farms | villages/index.ts:20–51, plan.ts:298–336 core plan, :382–453 frontage/lot fitting, :884 deterministic village ID, rural.ts. | ADAPT plan/frontage/POI mechanism and surface requests; no content/presentation KEEP until isolated source proof. |
| Nature/props | nature/place.ts seeded clusters and terrain-aware exclusions; nature/index.ts:23–65 near/far render LOD; props/plan.ts:414–418 and :1575–1579 support fitting/validation. | ADAPT placement/validation/render LOD; not actor simulation LOD, not final source-isolated visual acceptance. |
| Events/failure isolation | events.ts:3–11 typed technical catalogue; :26–35 catches each receiver exception; engine.ts:108–130/:196–202 isolates module faults; world.ts:89–96 isolates failed layers. | KEEP plumbing and consumer-error isolation; ADAPT versioned semantic catalogue and typed services. |
| Environment | environment/index.ts:115–119 setTime emits time:changed; :299 registers one environment API. shadows.ts:92–135 texel snapping and scale-based normalBias exist. | ADAPT renderer owner with existing KFB Skydome; configuration works in source, persistence absent, full shadow/Golden acceptance UNPROVEN. |
| Asset loading | assets/library.ts:102–142 cached preload/static extraction; :212–239 cached glTF and manifest URL seam. | KEEP cache/loader mechanism; ADAPT source provenance/authoring registry. Catalog asset ID is not stable world instance ID; loader is not Asset Librarian acceptance. |
| Clay | terrain/look.ts:23–77 loads luminance STAND_IN with 2.8 m tile, 22–50 m fade, 0.07 strength; :196–197 world projection. | ADAPT bounded stand-in/performance mechanism only. K2/v10, relief/toolmix and locked Golden parity are absent/unproven. Do not certify licence from code comment or filename. |

Authoring editor, PLAY/BUILD/GOD modes, object place/move/rotate/scale, terrain sculpt, override storage and save/fresh-reload are absent from candidate architecture and inspected public model. types.ts:79 declares only game/showcase. WorldModel has no override/store API. This donor cannot own required authoring/persistence today. Parent's WB2 donor audit must supply those mechanisms; this source audit does not invent an editor.

Stable world-object identity is absent: CellData.building stores asset+rotY only (types.ts:28). Village/region IDs exist, but ChunkBuilder.add/addInstanced:38–67 retains asset/material/transforms without stable instance records; villages/render.ts:134–170 merges per material with fade anchors, which are spheres, not semantic IDs. Nature mesh.ts:152–210 likewise merges with anchors. Retaining render batching is possible only alongside a separate stable semantic registry and address/rebuild mapping.

Resident/ChatterBox, Card/Almanac, Billboard/media, Audio/Jukebox, Vehicle/Drive, Track/Core sockets or authored RouteRecipe, placeable canonical signature family and Curtain adapter: not present in listed module tree/public types; candidate FREEZE_GAP_CHECK:26–40 explicitly records these omissions. Village POIs are useful facts, not a Resident seam; road tiles are not Joyride Track Core; debug landmarks are not source-proven placeable signature modules.

## Proposed Freeze review

| Decision | Classification | Boundary / factual correction |
|---|---|---|
| One owner per state | ACCEPT AS SURFACE-AGNOSTIC | Binding target, not currently achieved for level; terrain/index:25, roads/layers:45, villages/index:26 are three writers. |
| Height / Ramp / Slope owner | HOLD — depends on terrain correction | One owner must be continuous Surface Truth; proposed inclined Hex macro plane is REJECT — contradicts binding product decision. |
| Public APIs | ACCEPT WITH BOUNDARY | Existing roads/villages/terrain api.ts helpers are reusable. Internal imports remain (villages/plan:22; props/plan:22; streaming/index:262), services are untyped (types:72–75). |
| Semantic Event Layer | ACCEPT WITH BOUNDARY | events.ts has a typed technical map and already isolates receivers. Semantic/versioned domain facts remain absent; no need to rebuild the bus. |
| Base Recipe → Authoring Override → Dynamic State | ACCEPT AS SURFACE-AGNOSTIC | Desired boundary only; no override store or dependency invalidation in WorldModel. Per-cell level override must not reinstate Hex macro ownership. |
| Ground/Drive/Dialogue/Activity control-camera arbitration | ACCEPT WITH BOUNDARY | Canon controls already default. Control token/handoff absent. New mode adapters must preserve character heading ownership. |
| Stable WorldObjectId | ACCEPT AS SURFACE-AGNOSTIC | Needed independent semantic instance identity; asset ID, village ID, mesh UUID/fade anchor are insufficient. |
| One K2 material adapter | ACCEPT WITH BOUNDARY | Presentation only; Golden per family, source-map preservation, object/rest-space marks and near LOD. Candidate stand-in is not K2. “K2 deformation owns every rounding operation” is broader than canon: keep massing/deformation separate and family-specific. |
| Simulation LOD | ACCEPT WITH BOUNDARY | Chunk work + nature render LOD are present; no actor simulation/presentation scheduler. |
| Render batching preserves identity | ACCEPT WITH BOUNDARY | Current batching erases addressable per-object state. Keep performance mechanism after semantic instance mapping exists. |
| One explicit camera model | ACCEPT WITH BOUNDARY | Current owner/probes are reusable; proposed replacement has no source/runtime proof. Terrain fade/cut unresolved locally; no control remap implied. |
| LLM-free deterministic default | ACCEPT AS SURFACE-AGNOSTIC | No mandatory LLM in inspected core/module tree. Optional resident AI must remain adapter-only. |
| Source-fidelity / Clay / authored-world visual acceptance | UNPROVEN | No isolated actual source object/design or Golden comparison performed by this audit. |

Important document/source corrections: ARCHITECTURE_AS_BUILT:53/:137 and FREEZE_GAP_CHECK:25/:28 still describe camera-yaw steering; actual default canon player.ts:194–202/:735–798 owns heading. Legacy camera-relative mode remains opt-in. FREEZE_GAP_CHECK:50 asks to extend isolation to event consumers, but events.ts:26–35 already does that.

## Evidence limits / actual checks

Performed: full src inventory; named document reads; raw code inspection; Dropbox metadata pins; byte verification against 55 content hashes; six critical source metadata rechecks (terrain build/index, roads index, villages index, player, events), all unchanged. Not performed: building, runtime testing, visual source isolation, video review or performance measurement. Candidate docs report whole-game r5 camera 8.0, later cam_r6 6.0 and cam_r7 6.5, forest 1.51M triangles and cold road hitches; these are **reported prior evidence**, not this audit's independently executed results. Reported native-speed/foot-slip/A1 evidence remains distinct from code presence and needs final integrated normal-input proof.

## Exact source rev pins
All rows below are beneath `/CLAUDE/KFB Open World/`. Full 81-file metadata inventory, 55 copied source files and content-hash verification are retained in candidate-inputs.
| Source | Dropbox rev | server_modified UTC |
|---|---|---|
| src/core/world.ts | 65d272f57acd44602da6f | 2026-10-06T07:45:39Z |
| src/core/types.ts | 65d1fee85dd4e4602da6f | 2026-10-05T23:06:27Z |
| src/core/events.ts | 65d1ea90d75134602da6f | 2026-10-05T21:35:26Z |
| src/core/units.ts | 65d1f392d31544602da6f | 2026-10-05T22:15:44Z |
| src/core/chunks.ts | 65d259458755b4602da6f | 2026-10-06T05:50:44Z |
| src/modules/terrain/index.ts | 65d29f98e20454602da6f | 2026-10-06T11:05:22Z |
| src/modules/terrain/build.ts | 65d34d034f70c4602da6f | 2026-10-07T00:01:13Z |
| src/modules/terrain/gen.ts | 65d2a5e688a6a4602da6f | 2026-10-06T11:33:34Z |
| src/modules/terrain/api.ts | 65d2d23e4574d4602da6f | 2026-10-06T14:51:57Z |
| src/modules/terrain/look.ts | 65d3531df97914602da6f | 2026-10-07T00:28:31Z |
| src/modules/roads/index.ts | 65d30098568c34602da6f | 2026-10-06T18:19:19Z |
| src/modules/roads/layers.ts | 65d21d5d9ab9e4602da6f | 2026-10-06T01:22:43Z |
| src/modules/roads/net.ts | 65d2a3e238d6b4602da6f | 2026-10-06T11:24:32Z |
| src/modules/roads/rivers.ts | 65d2a860e9b064602da6f | 2026-10-06T11:44:39Z |
| src/modules/roads/render.ts | 65d373993acbf4602da6f | 2026-10-07T02:53:50Z |
| src/modules/villages/index.ts | 65d2840a8dd814602da6f | 2026-10-06T09:02:05Z |
| src/modules/villages/plan.ts | 65d2a1c96db9d4602da6f | 2026-10-06T11:15:09Z |
| src/modules/villages/render.ts | 65d34b0217f694602da6f | 2026-10-06T23:52:14Z |
| src/modules/nature/place.ts | 65d2cfea02c4d4602da6f | 2026-10-06T14:41:32Z |
| src/modules/nature/mesh.ts | 65d2d4818472b4602da6f | 2026-10-06T15:02:04Z |
| src/modules/character/player.ts | 65d36d73849624602da6f | 2026-10-07T02:26:20Z |
| src/modules/character/anim.ts | 65d34e37d54e74602da6f | 2026-10-07T00:06:36Z |
| src/modules/streaming/streamer.ts | 65d281907e9fa4602da6f | 2026-10-06T08:51:00Z |
| src/modules/streaming/job.ts | 65d2816e088b24602da6f | 2026-10-06T08:50:24Z |
| src/modules/camera/rig.ts | 65d38555db0e34602da6f | 2026-10-07T04:13:12Z |
| src/modules/environment/index.ts | 65d2ce8c7cee64602da6f | 2026-10-06T14:35:25Z |

No public Site/Stage acceptance URL was verified or required for this factual source audit. No READY/BLOCKED plan classification is issued by this role.

## Full 24-item candidate Freeze list

This table follows FREEZE_GAP_CHECK's exact numbered list. Nonrequired future items stay future items; acceptance of a boundary does not add a frozen MVP requirement.

| # | Candidate Freeze item | Classification | Source fact and boundary |
|---|---|---|---|
| 1 | Authoring + persistence | ACCEPT WITH BOUNDARY | Gap:22; absent in source. Base Recipe → Overrides → Dynamic State is valid; cell overrides must contribute to continuous Surface Truth. Reuse verified WB2 authoring/store donor, preserve instance identity and dependency invalidation. |
| 2 | Height/world ownership cleanup | HOLD — depends on terrain correction | Gap:23; actual macro-Hex geometry/support is drift. Single continuous height/mesh/collision owner plus declared contributors; Hex macro plane itself REJECT — contradicts binding product decision. |
| 3 | Semantic events/services | ACCEPT WITH BOUNDARY | Gap:24; events.ts:3–35 typed technical bus already catches receivers. Domain versioning and typed services absent. |
| 4 | Motion/character control | ACCEPT WITH BOUNDARY | Gap:25; player.ts:194–202/:735–798 already defaults to canon-owned heading. Keep KCC/native clip diagnostics; future layers belong behind existing single Ground/Motion writer. |
| 5 | Joyride Track | ACCEPT WITH BOUNDARY | Gap:26; overland roads are not authored Track Core. Existing Track Core mechanics and source-isolated Joyride presentation stay owners; world handles surface/placement claims. |
| 6 | Sky/environment | ACCEPT WITH BOUNDARY | Gap:27; environment/index:115–119/:299 supplies owner/API. One adapter/reconciled Skydome owner; save/environment overrides required. |
| 7 | Vehicle/Drive | ACCEPT WITH BOUNDARY | Gap:28; absent. Existing Drive owner needs single input-camera handoff, no second Ground writer. |
| 8 | Audio | ACCEPT AS SURFACE-AGNOSTIC | Gap:29; absent. One AudioContext/mixer/music-clock owner consumes semantic events. No audio choices in World owner. |
| 9 | Resident/living world | ACCEPT WITH BOUNDARY | Gap:30; POI tags only. Existing Resident state owner plus POI/nav/sim adapter; no use of player.ts as second Resident motion owner. |
| 10 | Resident body pose/performance | ACCEPT WITH BOUNDARY | Gap:31; absent. Performance Composer coordinates independent channel owners; existing character anim.ts mechanism may supply clips, not player custody. |
| 11 | Resident face/ChatterBox | ACCEPT WITH BOUNDARY | Gap:31; absent. Preserve current ChatterBox/EyeRig/PetMouth channel ownership, representative real Resident required; current TUNE cannot be accepted from mere module presence. |
| 12 | Resident emanata | ACCEPT WITH BOUNDARY | Gap:31; absent. Presentation channel behind Composer; no new world/state ownership. Full family rollout remains outside representative MVP seam. |
| 13 | Billboard/media | ACCEPT WITH BOUNDARY | Gap:32; absent. Existing placeable Clay Billboard/media consumer; source-isolated object and deterministic HyperNormalisation loop required. |
| 14 | Card/Almanac | ACCEPT AS SURFACE-AGNOSTIC | Gap:33; absent. Canonical Card/Almanac state/provenance owner; references by IDs, acquire/inspect/persist representative record. |
| 15 | Clay construction/fluff economy | ACCEPT WITH BOUNDARY | Gap:34; absent. Future state layer may use stable identities; full economy is frozen nonblocking and may not create an extra MVP gate. |
| 16 | Destruction/rebuild | ACCEPT WITH BOUNDARY | Gap:34; absent. Future dynamic state/re-emission requires semantic IDs separated from render batches; full destruction system is not silently added to MVP. |
| 17 | UFO/Hunky & Dory world events | ACCEPT WITH BOUNDARY | Gap:35; absent. Deterministic event clock/optional consumers valid; not a new required full event system beyond frozen representative signature/module seam. |
| 18 | Beam family/object custody | ACCEPT WITH BOUNDARY | Gap:35; absent. Future custody uses stable instance IDs and separate transfer/damage/construction state; visual family UNPROVEN without isolated source object. |
| 19 | Flight capability | ACCEPT WITH BOUNDARY | Gap:36; absent. Optional future motion mode preserves Equipment → Capability → Presentation and input token. No additional full-flight MVP blocker. |
| 20 | Activity seam | ACCEPT AS SURFACE-AGNOSTIC | Gap:37; absent. World → Activity owner → Result → World with event/control token valid; full activities/minigames remain frozen nonblocking. |
| 21 | Signature/landmark/Curtain | ACCEPT WITH BOUNDARY | Gap:38; only demo landmarks. Existing source-proven placeable signature owner required; Curtain compatibility hook valid, actual playback nonblocking when base streaming is seamless. |
| 22 | Simulation LOD | ACCEPT WITH BOUNDARY | Gap:39; streamer.ts chunk budget and nature/index render LOD exist. Actor/presentation sim scheduler absent; reuse budget mechanisms rather than claim all LOD exists. |
| 23 | LLM-free default | ACCEPT AS SURFACE-AGNOSTIC | Gap:40; seeded core has no mandatory LLM. Future AI behind optional adapter cannot block boot/sim. |
| 24 | Web/Steam host | ACCEPT WITH BOUNDARY | Gap:41; static web build, no storage/identity adapter. Storage behind host interface valid; full Steam delivery is not an added frozen MVP requirement. |

For every visual-sensitive entry (5, 6, 9–13, 18, 21, Clay/material crosscut), source identity/design is **UNPROVEN** in this audit because no actual source object/design was shown in isolation. API/boundary acceptance never certifies that presentation.
