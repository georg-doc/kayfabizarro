# KFB Racetrack Construction Kit · RKIT R3 · Complete Blender MCP Execution Brief

**Date:** 2026-10-08  
**Status:** AUTHORISED BRIEF / SOURCE-AUDIT & ASSET-PRODUCTION INSTRUCTION · NOT AN IMPLEMENTED KIT  
**Primary working/documentation repository (Claude-readable PUBLIC):** `georg-doc/kayfabizarro`  
**Brief branch:** `planning/rkit-r3-blender-mcp-construction-2026-10-08`  
**Implementation/asset authoring lane:** Blender MCP, producing isolated, editable, testable track parts in a NEW working branch of this PUBLIC repository, based on the source-proven packet.  
**Canonical future Race Track Core/runtime owner:** `georg-doc/KFB-Stunt-Car-Race` (PRIVATE; do not assume Claude can read or write).  
**One named product outcome:** a source-verified, modular Blender track construction library with compatibility, source provenance, deterministic export and meaningful assembled proofs, deliberately designed to feed the existing Track Core.  
**No Stage/public/site route required** for this Blender asset production until an explicit later human/public acceptance milestone.  
**Out of scope:** Island/Unity-import work, WorldBuilder runtime restart, Race physics/camera modification, editor implementation, merge, Live promotion.

## 0 · Essential reading and precedence

Fetch current GitHub state before executing. GitHub source/head overrides older notes.

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `skills/chat/KFB_OPEN_WORLD_ROAD_TRACK_CORE_CANON_2026-10-07.md`
5. `skills/chat/workflows/KFB_MVP_PLANNING_2026-09-26/DRAFT_RACER.md` — historical draft, relevant source pointers, not unconditional authorization.
6. `tools/KFB-ToolBox/_inbox/KFB Racetrack Blender Kit/START_BLENDER_RACETRACK.md` and `ONBOARDING_BLENDER_MCP_CHAT.md`.
7. `skills/chat/recovery/KFB_OPEN_WORLD_VISUAL_TERRAIN_LAB_DONOR_FINDINGS_2026-10-07.md`.
8. Exact public Track Core / Joyride source copy at `tools/KFB-ToolBox/_inbox/KFB_JOYRIDE_J14_CLAUDE_DESIGN_SESSION_CUT_2026-09-30_r1/lab-track/core/{track-core.v012.mjs,stream-to-three.v5.mjs}`; this is a **pinned donor copy**, not proof it is the latest private canonical owner.
9. Public external federation specification in `tools/asset_registry/librarian/_handover/EXTERNAL_3D_SEARCH_FEDERATION_R1_2026-10-07/` on `planning/asset-librarian-external-3d-search-r1-2026-10-07`.
10. This packet's `ROAD_CONSTRUCTOR_EVALUATION.md` and `START_FOR_CLAUDE.md`.

**CRITICAL PUBLIC-ACCESS RULE:** Claude's source-of-work and Return are the public `georg-doc/kayfabizarro` branch. The private Race repository's RKIT branches/PRs may be cited as historical pointers only. If Claude cannot inspect exact private originals, classify them `PRIVATE_SOURCE_UNAVAILABLE` and audit available public snapshots or ask a source-owning agent for a lawful public handoff. Never reconstruct or invent the geometry and never claim a full current private-inventory audit from an inaccessible repository. Do not copy private source automatically to public.

**STOP-state firewall:** Open World / Island MVP R4 is STOPPED / NO MVP, F-R39 FAIL. This RKIT asset-authoring lane does not reopen, repair, fan out, or alter R4. No new island terrain/runtime work.

## 1 · Product north star

Georg wants to DRAW a road/track someday: select a width and family, sketch a path or place nodes, automatically fit curves and connectors, change elevation and banking, generate appropriate junctions/bridges/tunnels/supports/markings, and preview terrain cut/fill. The exact same authored RouteRecipe should create:
- a driving-school yard and small-town street network;
- normal urban streets, T/Y/X junctions, roundabouts, multi-lane boulevards and highway ramps;
- country roads, mountain switchbacks, serpentine hairpins, cliff roads and viaducts;
- conventional race courses with pits, kerbs and barriers;
- free-standing stunt/cosmic highways with jumps, wallrides, loops, corkscrews and independently themed appearances.

**NOW:** missing reusable geometry/structure/prop families + compatiblity + module metadata + Blender assembly proofs.
**LATER:** drawn-curve road editor and automatic terrain adaptation, implemented through the current Track Core/WorldBuilder owners, not within this Blender task.

## 2 · Authoritative separation of responsibilities

```text
Human stroke / node edit [FUTURE EDITOR]
  → RoadNetworkIntent / RouteRecipe (graph, mode, width, profile, elevations)
  → CURRENT Track Core owner (curve solve, transported frames, slot sections,
     width/bank/grade, graph/junction solve, checks, contact metadata, stable IDs)
  → immutable Track Stream & per-piece sockets / material role metadata
  → Blender MCP construction/geometry oracle, source-proven modules & exporter
  → accepted GLB + editable .blend + manifest + isolated evidence
  → existing Joyride/KFB Clay presentation & existing Race physics consumer [LATER]
  → existing Surface Truth terrain cut/fill/contact reconcile [LATER]
```

Do not create `BlenderCurveRoadCore`, Unity RoadConstructor runtime owner, extra Bézier road-sweep, additional Race physics solver, duplicate terrain owner, or second Asset Registry.

The authored graph describes **where**; Track Core decides **drivable geometry/contact and sockets**; Blender provides **physical modular construction and approved visual assets**; surface owner handles **actual terrain mesh/support/terrain collisions**; presentation owner handles **KFB Clay/Joyride look**.

Source object must be shown **in isolation** before every visual adaptation. An asset URL loading, GLB filename, a nice screenshot or a successful import does NOT prove the correct donor mesh/design was used.

## 3 · Verified candidate contract values from public Track Core v0.12

These are observations from a public pinned reference, **not a blanket freeze of the private live owner**:

- Right-handed metre coordinates, +Y up, heading 0 toward +Z.
- T = unit tangent, U = road up, R = T × U (driver's right); bank > 0 lowers right edge.
- Profile width classes: `NARROW=10.8`, `STANDARD=14.4`, `WIDE=18.0`, `HERO=21.6`, `HERO_XL=28.8` metres.
- Slot cross-section = **14 named slots**, not the older RKIT R3d 12-point cross-section; `PROFILE_DEFAULTS` owns shoulder, barrier and underside rules. Do not silently use the wrong revision.
- `VEHICLE_ENVELOPE` height 4.0 + reserve 3.0, width 4.1; currently 7.0 m headroom in the public copy. Verify per receiving revision before releasing tunnel/arch pieces.
- `WIDTH_TAPER=25`, `WIDTH_STEP_MIN=40` in this source; use the owner's effective transition rules rather than a global scale factor.
- `compileRecipe`, `compileGraph`, `expandNodes`, `profileSlots`, `attachRings`, `runChecks`, `runGraphChecks`, `slotWorld`, `fingerprint` already exist as reference interfaces.
- Existing pre-defined markings/skins are source data only; sample placeholder colours in v0.12 are NOT KFB Clay Goldens.
- The public Three consumer `stream-to-three.v5.mjs` already uses the stream as input and must not recalculate routes; a historical Blender importer `b1_import_stream.py` is referenced by that adapter but must be located and inspected before reuse.

Prior terrain lab has **non-canonical** `K=0.375` rescale; DO NOT apply it as a hidden shortcut. Narrow streets must have a proper profile, not an arbitrary scale of entire geometry.

**Known failure inputs requiring regression witnesses:**
- per-cell bespoke Bézier sections developed tangent cracks/wedges and tight-radius inner fold; accepted path = Track Core stream, analytically stable tangents/radius rules;
- Track Core v0.12 misses ordinary T-junction and some STANDARD-arm 60° roundabouts fail;
- historical 'plate fallback' can cut passing road geometry and is **FORBIDDEN as PASS**;
- RKIT-01 candidate had a 15.5 m curve radius vs 15.3 m outer-barrier offset (near fold), arch legs wider than cap, embankment/support grounding defects;
- RKIT-02 jump/flap work had unresolved physics-ownership and collision problems;
- RKIT-11 Mülheimer Brücke is named an important frozen acceptance/reference fixture in public planning, but exact private source must still be obtained lawfully before comparing it visually.
- Island R4 product failure is **not** evidence that any technical RKIT module passed or failed here.

## 4 · P0: Audit, salvage, source isolation and catalogue (MANDATORY; NOT the final stopping point)

Inventory all actually reachable sources **before modelling**:
- RKIT-01..11 candidates and their Return/evidence (public sources first; inaccessible private labelled);
- Joyride J14/T4/K2 reference materials, Track Core v0.12 stream, Blender stream importer if found;
- Kenney City Kit Roads / Racing / Modular tracks; relevant KayKit city/medieval/dungeon modules;
- real KFB Registry/Asset Librarian already indexed packs, Blender files, marked source family IDs;
- existing prepared GLB supports, tunnels, arches, foundations, barrier endcaps, marking plates, race/pit props;
- external 3D discovery candidates (only after actual local gaps).

For each logical element, record:
`family, subtype, source URL or exact repo path, branch + head + hash, rights/licence evidence, native unit/axis, source bounds, visible source-isolated image, runtime/Track Core contract coverage, Blender editable/export status, mesh defects, decision, dependency, next-action`.

Classify independently:
- **LOGIC:** `CORE_SUPPORTED / CORE_MISSING / CORE_UNVERIFIED`.
- **ASSET:** `VERIFIED_KEEP / NEEDS_ADAPT / NEEDS_FIX / MISSING / REJECTED / UNAVAILABLE`.
- **RIGHTS:** `VERIFIED / CLAIM_ONLY / UNKNOWN`.
- **VISUAL:** `SOURCE_ISOLATED / ADAPTED_REVIEWED / NOT_PROVEN`.

Do not say "present" because an alternate private branch is named. Produce a priority-sorted missing-module list plus source-isolation contact sheets.

## 5 · Prioritized production matrix — explicit scope

**P1 / CONSTRUCTION-CRITICAL (build first, source permitting):**
1. Connector anatomy: entry/exit socket frames, canonical pivots, width/profile/lane/grade/bank compatibility and visible seam rules; separate connector marker geometry from runtime core data.
2. **Width and profile transitions**: narrow↔standard↔wide, lane begin/end, shoulders, barrier profile changes, flush/cap end, edge/underbody continuity; lengths from Track Core owner.
3. **Grade/bank/radius transitions**: straight↔curve, S curves, crest/dip, right/left banked curve, cross-slope and tight-radius avoidance. No 'closed-looking' but self-folded mesh.
4. **Junction anatomy**: T/Y/X, skewed arms, roundabouts, split/merge, turnarounds, slip-lanes; author reusable surface/kerb/island/traffic-furniture *visual* families where the core supports them. Unsupported math/Junction stays `CORE_MISSING`; **do not fake a connection with an overlap plate**.
5. **Bridge/elevation**: authentic deck thickness, pillar/support height adapters, bridge-end, parapet/barrier continuation, underpass clearance, multi-level crossings and beams.
6. **Tunnel/portal**: continuous drivable floor, curve-following gallery, bridge-to-tunnel mouth, arch feet on true cap anchors, local cutout/retaining connectors and headroom check.
7. **Road boundaries**: kerbs/sidewalks, soft/rubber race rails, barriers/endcaps, guardrails, shoulders, retaining wall attachments and terrain-edge transitions. Existing Joyride design must win visual comparison.

**P2 / PRACTICAL ROAD NETWORKS (start after P1 connectors validate):**
8. Driving school: stop lines, crosswalk, parking/reverse bays, practice intersections, slalom, turning circle and signpost/traffic-cone sockets. Traffic-rule semantics remain in graph/data, not painted into core mesh.
9. City: two-lane street, multi-lane boulevard, kerb/gutter/sidewalk, median island, pedestrian crossing, traffic lights as external props, driveway/service/industrial approach.
10. Rural/mountain: single/narrow roads, asphalt↔dirt shoulder, hairpin/serpentine with grade, cliff-facing guardrail, rock-cut retaining wall, ditch and bridge/tunnel continuation.
11. Race facility: pit split/merge, pit-lane curb, grid, start/finish, safe runoff, barrier families, service/garage interface and modular decorative dressing.

**P3 / STUNT & COSMIC (source-backed generalization, not prerequisite to P1):**
12. Rise-to-vertical frame and inverted-section tests; one loop with entry/exit/bypass, one wallride, jump/landing and one twist/corkscrew adapter. The preexisting min-twist transported-frame solution must be the contact/geometry truth.
13. Floating highway underside, freestanding supports, optional suspension details, soft toy/rubber/Clay alternative, cosmic palette/material assignment; no independent visual-only collision path.
14. Additional later use cases retained in data model: mine-cart/rail ride and arbitrary up/gravity, without building a new rail runtime.

**P4 / FUTURE EDITOR (design the interface, DO NOT implement in Blender):**
15. Road-Constructor-inspired draw/edit workflow, auto-snap/mend junction, auto supports, terrain cut/fill request, undo/redo, saved editable RouteRecipe; reference `ROAD_CONSTRUCTOR_EVALUATION.md`.

Each module family's required count, actual status and acceptance remain **unknown until census**. The listed families are the target catalogue, not a claim that they are missing or authorized to be rebuilt wholesale.

## 6 · Mechanical/visual modular contract

Each approved module/kit entry needs a source-backed editable representation plus data:
- `sourceObjectId / family / moduleId / variantId / sourceCommit / license`;
- units, axes, root pivot; transformed bounds at native scale;
- role-separated mesh objects (drivable road, shoulder, kerb, barrier, outer shell, underside, support, decoration); never lose silhouette/colour author identity;
- entry/exit/auxiliary connector transforms `position + T/R/U`, profileId/widthClass, directed lane map, grade, bank, clearance + safety envelope;
- supports/portal/guardrail/marking/dressing anchor positions in canonical frame;
- collision proxy recommendation and separation of physical vs visual geometry; **Blender is not the contact owner**;
- material roles rather than baked arbitrary palette: road, shoulder, kerb, barrier cap/side, underside, structure, markings, optional emissive accents;
- generated geometry resolution/density targets and deterministic LOD where applicable;
- right/left banking, curve/radius, closure and local-space orientation witnesses;
- explicit `unsupported` when a model needs a graph/junction/terrain capability Track Core doesn't supply.

Blender and GLB compatibility:
- clean independent source scene; never damage upstream .blend;
- scripted, repeatable build/export where practical; saved script in repo;
- export GLB *and* .blend for each accepted physical assembly, plus manifest; reimport into clean scene;
- GLB and Blender socket/bounds/units/axis/material-role and semantic ID equality checked numerically;
- inspect top, three-quarter, side, underside and socket close-up; supports sit on actual underside and ground feet are not truncated;
- no duplicate faces, inverted winding, self-intersection, dangling ends, intersecting rail, arbitrary hidden meshes or generic substitute parts.

## 7 · Three physical compatibility assemblies (not Island worlds)

A. **CITY / DRIVING SCHOOL:** one source-proven urban entrance, T/X junction if core supports it (otherwise explicit unavailable contract witness), crossing, small roundabout when valid, parking/turning and side roads. Show same source modules alone first; proof of lane flow/connectors, not generic city scenery.

B. **MOUNTAIN / SERPENTINE:** straight → narrowing → banked hairpin → grade change → retaining wall → bridge approach → tunnel portal; show actual tight curve seam, support/clearance and correct underbody.

C. **RACE / COSMIC:** existing Joyride track → width taper → banked 3D rise/inversion fixture (only when true frames supported) → suspended structure → race marking/kerb → cosmetic alternate materials; no freeplay physics owner or second scene generator.

Assembly cannot turn green because a design renders pretty. All relevant socket/continuity and source-identity proofs must exist.

## 8 · QA: don't repeat previous failures

Mandatory measured/instrumented witnesses:
- source object isolated BEFORE adaptation and side-by-side after adaptation;
- sockets frame and position compatibility on mixed-source modules, centreline continuity, lane alignment, no unexpected gap/overlap;
- graded/banked/tight curves: analytic tangent/transported frame, no inner-edge folding; mixed connection at high bank and grade;
- intersection/topology: invalid graph gets clear refusal, no defective plate masking; no hidden duplicate junction solver;
- tunnels: sweep/clipping and vehicle headroom across varying bank and grade;
- supports/bridge: feet at surface/support metadata, head exactly at real underside, no chopped arches;
- export/reimport: geometry bounds, pivots, world pose, material slots, IDs and GLB sanity;
- visual isolation + silhouette/colour/material family comparison with accepted KFB source; KFB Clay compatibility, not default unmodified KayKit or generic procedural look;
- 3 demo assemblies separated in named Blender collections/GLBs; one contact-sheet + diagnostics per family;
- log actual numerical test counts and failures. **No test results may be invented in this planning packet.**

Optional source-informed future automated tests: Offroad `Arz-Gev/offroad` for collision ground-match, grade/serpentine trail and drivable route telemetry; Oxijolt for deterministic headless laws, input replay and real-GLB collider gate. THESE ARE TEST-DESIGN DONORS, not new physics runtimes. Preserve the Race owner.

Two non-improving repair passes: freeze failing seam, export evidence and allow parent families to continue unless independent Guard proves outcome-critical. No unbounded workaround loops.

## 9 · External asset/texture procurement

Use KFB Asset Librarian/Registry as canonical. Discovery only via `arielshad/3d-asset-server` / `3d.shep.bot` or documented provider page **after internal gap is explicit**. Federation implementation was PREPARED, not accepted as live; if endpoint fails, continue internal inventory without pretending it works.

Sequence:
`gap definition → internal source / Kenney / KayKit / RKIT check → external candidate → provider metadata/rights claim → safe trusted download when authorised → exact bytes/hash/provenance → isolated actual model → form/UV/normal/scale/material critique → KEEP/ADAPT/REJECT → existing Registry intake → Blender compatible output`.

Priority search baskets:
- road curbs, pavement/sidewalk, road signs/markings, crosswalk, cones, guardrails, lamps;
- modular city intersection assets and driving-school props;
- tunnel/bridge portals, beams, piers, fences, stone retaining/roadside props;
- cliffside/hairpin supports, drainage/ditch props;
- pit/runoff/start-finish and racing safety furniture;
- toy/cosmic track fascia and lighting details;
- texture / roughness only for a documented KFB Clay/Surface gap.

No bulk marketplace import; no unknown-license acceptance; no redirection to arbitrary paid model sources unless justified; no third-party branding on KFB meshes; no loaded URL as source proof. Colour/material conversion is downstream KFB Clay/Surface owner, not an excuse to overwrite source mesh identity.

## 10 · Road Constructor as conceptual editor reference (separate design research)

Road Constructor `Pampel Games / Unity Asset Store #287445`:
`https://assetstore.unity.com/packages/tools/level-design/road-constructor-287445`

Public product features to study: draw/edit infrastructure, snapping and dynamic intersections, roundabouts, ramps, profile styles, slope/elevation constraints, bridges, parametric mesh generation, terrain leveling/blending, undo/incremental editing. Research **user-visible functions** and feature boundaries, not proprietary source.

We want analogous user outcomes independently:
```text
Drag path / place or move point → edit RouteRecipe / topological graph
→ validate radius / grade / bank / vehicle envelope
→ choose profile, lane links and actual junction piece(s)
→ sample Track Core, autogenerate sockets/road/rails/support anchors
→ calculate preview cut/fill mask through existing Surface Truth API
→ selective rebuild of affected graph neighborhood
→ preview without replacing the route, save semantic edits + undo/redo
```
Blender R3 deliverable: **editor-ready source data and a short independently drafted interaction/dataflow specification**, NOT the editor runtime. No Unity import or purchase required for current Blender output.

A purchase is an OPTIONAL human choice, not an execution dependency. Unity is already installed by Georg; a later isolated Unity study may be cost-effective *if* we can inspect an authorized installation and record observable workflow/outputs. The license for this Extension Asset does not automatically authorize SDK source modification, transfer to AI tools, portability to non-Unity runtime, asset-package redistribution, or use in user-generated content tools. Do not upload proprietary Road Constructor package files, code or mesh exports into GitHub/LLM without necessary rights. Ask publisher for written approval before any actual port or third-party editor integration; see `ROAD_CONSTRUCTOR_EVALUATION.md`. Use publicly advertised functions for independent architecture.

## 11 · Phased bounded execution without fake 'baby slice' completion

**Phase A · Audit/checkpoint:** verified public KFB inventory + private-unavailable list, P0 source gallery, current Track Core importer/manifest contract, gap matrix; immediately identify real P1 opportunities.
**Phase B · Build/checkpoint:** reuse/refine existing P1 modules and produce missing compatible transition/structure modules that are source-backed; measurable connector tests and export/reimport. Do not stop with inventory-only if a nonblocked P1 module can be produced.
**Phase C · Coverage/checkpoint:** P2 urban/practice, mountain and race families as genuinely composable assets; three full mixed assemblies with proof. Add P3 fixture only behind proven 3D frames / source access.
**Phase D · Evidence & independent critic:** source-isolation gallery, visual + numeric tests, existing KFB appearance gate, documented blocking Track Core functions; no accept without source proof.
**Phase E · Return:** current public branch head, manifest, exact changed files, test counts/evidence, coverage table, accepted vs blocked, licensing/source table and exactly one next gate.

For substantial work: Builder/Blender MCP = only production writer; independent Integration Tester factual; independent Critic assesses look/use; Production Guard decides continue/repair/quarantine/stop. Do not self-accept own visual output. After **every** GitHub write, fetch exact branch head and files. On timeout assume UNKNOWN until remote checked. No merge, Live or Island scope.

## 12 · Required final handoff

Report in German to Georg, briefly and plainly:
- what was physically built/reused and what actually works;
- public repo/branch/PR/head and every changed file;
- module families with `VERIFIED / NEEDS_TUNE / BLOCKED / MISSING` and exact source references;
- Blender screenshots/previews, isolated original source vs adapted source, GLB reimport/geometry test counts;
- road/T/X/roundabout capability blockers tied to current Track Core, not hidden plates;
- status of external asset rights and any Road Constructor purchase/permission dependency;
- direct public Stage/Site URL only when an actual relevant acceptance route was named and opened;
- **ONE next gate**. Suggested initial: `RKIT_R3_VERIFIED_REUSE_CENSUS_AND_FIRST_COMPATIBLE_P1_TRANSITION_ASSEMBLY`.

**Success ≠ brief, a named branch, imported files, screenshots alone, or a partial prototype. Success means that the agreed asset families and actual connected assemblies meet the independent Blender geometry + source visual + export gates.**
