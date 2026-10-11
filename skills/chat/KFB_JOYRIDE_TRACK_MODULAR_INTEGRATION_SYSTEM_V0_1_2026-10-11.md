# KFB Joyride Track Modular Integration System · Design & Construction Brief v0.1 · 2026-10-11

**Status:** GEORG AUTHOR DIRECTION + SOURCE-AUDITED MODULAR DESIGN BRIEF. **NOT** a second Track Core/runtime, a new geometry implementation, generated image, approval of all adapters, R5, Golden or publication. One existing planning owner: **KFB Island Worldbuilder / Fluff–Crafting–Almanac**. Repo \`georg-doc/kayfabizarro\`, branch \`planning/kfb-fluff-crafting-almanac-ideation-2026-10-09\`. **Outcome:** one reusable, *buildable-and-testable design vocabulary* for island-to-island cosmic Joyride tracks and island-internal roads, with exact core-source dependencies, formulas, connection constraints, drawing/evidence requirements and five first application routes. **No new fork of RouteRecipe, terrain or collision.**

## 0. What Georg asks us to solve

The inter-island road is a suspended **Joyride clay racetrack deck**, visually rooted into the island lip: drive ON and OFF at both ends, cleanly become a grounded road, path, plaza, parking pad or internal loop. **No masonry arches/pier bridges in the void** (Georg FAIL on previous Protopia–Maker image); genuine stone bridges remain for **on-island rivers, cuts and roads**. Track sections may rest *on* the island surface, be lightly clay-supported, embed through terrain tunnels or hug cliff edges, but every route must connect **specific origins and destinations**. The network links central **KFB Town** to Protopia, Utopia, Dystopia and later satellites, with **Maker Space as a separate large island directly drivable both ways from Protopia**, not a district on Protopia. The KFB Organ-Attraction cosmic track is a **composition/traffic precedent**, never independent geometry authority.

**Quality change after Polar failure:** 3D geometry/connection evidence FIRST, then bounded image composition. Generated unconditioned concept posters are at most \`MOOD_ONLY\`. The goal is a kit of **real junctions and interfaces**, not a moodboard of fantasy highways.

## 1. Owner and source-precedence firewall

| Concern | Single owner / pin | What may be reused |
| --- | --- | --- |
| World / island relationships, route purpose, network connectivity | existing WorldBuilder/world-planner | Graph/RouteRecipe *intent*, island terrain, POI relationship, save targets; NO own road sweep |
| Road + track geometry, route expansion, sockets, collision cross-section, connector spline | **KFB Track Core** | Exact v0.12 donor below; inspect active receiving build before translating recipes |
| Visible road body/strang, surface, markings, KFB clay and transitions | **Joyride J17 inheriting J16 r2 T4 / K2** | Real road design, not Cabrio paint or generic grey road |
| Authoritative terrain, sculpt, support/collision outside deck | existing **Surface Truth** | Track and terrain exchange recorded contributions/contact; no duplicate height owner |
| Car movement and interaction | existing Joyride/Drive/Rapier owners | Test both travel directions with actual vehicle bounds/control |
| Track-through-tunnel vs world portal | Track Core tunnel shell/clearance for a ROAD, existing WorldGraph/Portal for actual INSTANCE travel | Never treat the track tunnel as an automatic teleport or a portal graphic as physical clearance |

Read in order on current ref, not from an image:
1. \`skills/chat/START_HERE.md\`, \`CHAT_GITHUB_KFB_STAGE_WORKFLOW.md\`, \`FRESH_CHAT_SLICE_PROTOCOL.md\`.
2. \`skills/chat/KFB_OPEN_WORLD_ROAD_TRACK_CORE_CANON_2026-10-07.md\` (binding).
3. \`tools/KFB-ToolBox/_inbox/KFB_JOYRIDE_J14_CLAUDE_DESIGN_SESSION_CUT_2026-09-30_r1/lab-track/core/track-core.v012.mjs\` (main, Git blob **1bcf7ad3a384a57d7caf83488c436f4c4835346f**; 1657 lines, source inspected) and \`lab-track/parcours/p1-recipes.js\` (actual recipes/macros/pads).
4. \`tools/KFB-ToolBox/_inbox/KFB_JOYRIDE_J14_CLAUDE_DESIGN_SESSION_CUT_2026-09-30_r1/lab-track/track-look.v5.js\` (main blob **7c0d248391c3eaf1887a0afc97ee02b25f6dec85**, K2/T4 material/strang donor).
5. \`tools/KFB-ToolBox/_inbox/KFB Joyride J17 · FB Cabrio/JOYRIDE_J17_2026-10-01/CHANGELOG.md\` (main blob **a6f6aa668f95923d6add145443bb90cfc0950a73**) states **J17 leaves Track Core v0.12, stream p1b.v2, tunnel TC1, T4 look unchanged**, and adds vehicle integration, not new track formulas.
6. \`skills/chat/KFB_MAKER_SPACE_JOYRIDE17_FLOATING_TRACK_LINK_CORRECTION_2026-10-11.md\` (planning branch, Georg decision, original O1-v4 local source record) and \`skills/chat/KFB_PROTOPIA_MAKER_ASSET_ARCHITECTURE_VISUAL_R1_2026-10-11.md\` (donor/negative visual review).
7. \`skills/chat/KFB_OPEN_WORLD_CLAY_SURFACE_CANON_2026-10-07.md\` and K1/H0 Golden + K2/v10; current KFB Open World Styleguide \`02_strecke\` is a **benchmark**, not authority over Track Core.
8. \`tools/KFB-ToolBox/_inbox/KFB Organ-Attraktion C2/KFB_ORGAN_ATTRAKTIONEN_2026-10-03/\` (track-through-attraction **visual/topology donor only**, must inspect exact source scene and route).

**Recent study integrity:** the owner Return reports an adjacent Protopia–Maker neutral/source/K2 scene and an independently tested connector trial (18 sources, 12/12 controls at an evidence head). The referenced \`tools/KFB-ToolBox/_inbox/MVP1_RETURNS/PROTOPIA_MAKER_TRACK_R1/RETURN.md\` was **NOT FOUND on main or directly at the cited evidence commit** in this audit: treat counts as **reported in the existing Return, not independently reproduced here**. Recover the exact live candidate/branch and real screenshot/geometry/QA packet BEFORE designating any island lip as a proven Golden, adopting its numbers or publishing images.

## 2. Exact Track Core v0.12 vocabulary, numerical source constants and formulas

### 2.1 Coordinate/slot contract

Right-handed **metres**; **+Y up**, \`heading psi=0\` goes +Z. Each sample stores centre \`P(s)\`, unit tangent \`T(s)\`, road-up \`U(s)\`, driver's right \`R = T × U\`. Positive heading/curvature turns right; positive bank lowers right edge. Source coordinate construction:

\`\`\`
point(s,lat,lift) = P(s) + lat * R(s) + lift * U(s)
road_L = -(width/2), road_R = +(width/2) before offset
\`\`\`

Source stream has **14 ordered \`SLOTS\`**, from outer left underside/barrier/shoulder through \`road_L/road_R\` to right shoulder/barrier/underside. Use the **same compiled samples/frames** for mesh, markings, tunnel, collider, vehicle/Blender oracle and export; consumer NEVER re-solves its own Bézier road.

\`\`\`
WIDTHS = { NARROW:10.8, STANDARD:14.4, WIDE:18.0,
           HERO:21.6, HERO_XL:28.8 }  // metres, source v0.12
profile = { shoulderW:1.98, shoulderDrop:0.28,
            barrierGap:0.72, barrierT:1.62,
            barrierH:1.35, barrierOuterTop:1.18, deckDepth:2.25 }
SIDE_EXTENT = 1.98 + 0.72 + 1.62 = 4.32 m
VEHICLE_ENVELOPE = { height:4.0, reserve:3.0, width:4.1 }
VEHICLE_HEADROOM = 7.0 m
\`\`\`

These are **measured core implementation constants**, not final adapter sizes nor a compulsory 14.4-metre village road. A city/parking path may use the same core with a genuinely selected profile; do NOT scale the entire KFB world to force a street onto a small island.

### 2.2 Curves, offset and CONNECT

\`STRAIGHT\` curvature 0. \`CURVE_EASE(turnDeg,R,ease)\` schedules linearly increasing curvature over eased head, a constant-curvature middle, then decreasing tail. With \`θ=abs(turnDeg)*π/180\`, \`κmax=1/R\`, \`Le=ease\`, \`La=max(0,θR−Le)\` and source's fallback \`Le=θR\` when \`La<0\`, **piece length = La+2 Le**. Right/left sign from \`turnDeg\`; default \`ease=min(0.6R,30m)\`. \`SPIRAL\` uses same curvature scheduling, default ease \`0.5R\`. Do not draw arbitrary circular arcs with visually plausible but physically impossible folding.

\`OFFSET_S(length L,shift a)\` solves amplitude A by numerical bisection such that lateral shift approximates the integral of \`sin(A sin²(πs/L))\`. Curvature is **\`κ(s)=Aπ/L·sin(2πs/L)\`**. Reuse the solver, don't hardcode lane-change kinks.

\`CONNECT\` is the core's flexible island-lip/socket adapter, implemented as a **quintic Hermite path** between **full endpoint frames** (position, heading, grade). It uses endpoint tangent vectors scaled to \`chordLength*stretch\`, arc-length reparametrisation, and actual stream frames. It is NOT “put a pretty curved mesh between two placed deck ends.” If endpoint headings, heights or slopes are incompatible, the compiler/tests must reject/rework the recipe rather than silently faking them.

Minimum conceptual socket payload for the design ledger (NOT a new runtime schema): \`islandId; islandLipId; routeId; nodeOrPieceId; P; T/heading; U; grade; bank; widthClass/profile; roadSkin; supportPlane/terrainVersion; travelDirection; inbound/outbound intent\`. Exact receiving owner must map these fields to existing Track Core startState, target, segment IDs and World stable object identities.

### 2.3 Width transition, elevation and bank

\`WIDTH_STEP\` missing length computes: **\`L = max(40m, ceil(25 * |Wtarget−Wcurrent| / 2))\`**. Hence STANDARD 14.4 → WIDE 18 yields \`45m\`; STANDARD → HERO 21.6 yields \`90m\`. Use compiler's \`smootherstep\` and source profile rather than shortening for visual convenience.

Height schedules support \`rise\` with \`smootherstep\` or piece-specific \`ramp/rampIn/rampOut\` blends. No globally binding maximum road grade was proven here; use existing \`runChecks\`, terrain contact and real vehicle climb/braking review. \`autoBank\` source defaults: \`gain=26\`, \`limitDeg=24\`, bank smoothing circa \`24m\`; DO NOT reinterpret it as an author-approved banking value for every parking plaza or town street. A neutral building entry may need \`bankDeg:0\` and level approach from legitimate available pieces.

### 2.4 Road transitions and skins

\`TRANSITION\` source carrier: default \`80m\`, reference \`minLength=60m\`, \`maxLength=100m\`; biome vocabulary **\`track/city/nature/canyon/coast\`**. \`TRANSITION_WINDOWS\` is **asymmetric**: leaving race road starts dropping race barrier before final road paint/props; entering race road clears props/kerbs, grows barrier/strang, and markings return later. Original blend system layers: surface, markings, barrier, pit, curb, nature, props, light, vfx. Source SKIN_BLEND nominal \`32m\` staggered per role. Winter/polar/rural road are **style/terrain overlays or future authored biome recipes**, NOT existing \`polar\`/ \`protopia\` built-ins. Do not invent new \`TRANSITION\` enum values in a visual brief.

**Joyride J14/T4 Canyon verified illustrative palette:** \`strang #ef5a22\`, \`roadStreet #566680\`, \`roadTrack #3d4a60\`. The locally audited Organ O1-v4 excerpt also had \`roadStreet #566680\` / \`strang #ef5a22\`. Color is **source family evidence**, not a claim every J17 road everywhere is these exact hex values or that the Cabrio color is track orange. Preserve the source-correct road/strang cross-section from the actual material owner and isolate at least one unmodified original road segment before any invented adaptation.

### 2.5 Tunnel, junction, pads, structural checks

- Tunnel is a per-sample **closed section ring** on the SAME compiled track stream: source \`TUNNEL_N=48\`, shape set round/oval/rect/poly/arch, source default \`headroom=7m\`, \`margin=0.3m\`, \`clear=1m\`, \`wall=1.2m\`, collar portal zone \`10m\`. Actual \`tunnelSection\` sizes against road + shoulders/barriers + vehicle envelope, not a fantasy fixed hole. Portals share the tube's shape; entering/exiting tube section needs source-driven \`portal_match\`, \`tunnel_morph\`, \`tunnel_clearance\`, \`tunnel_shell\` checks.
- \`ROUNDABOUT\` is real in core **v0.12**, with default island radius \`16m\`, ring width class \`STANDARD\`, 30m arm length, 14m fillet. \`Ri >= SIDE_EXTENT+2 = 6.32m\` is **only one** rejection guard. Additional arm width/fillet/wedge geometry checks may fail; earlier source notes explicitly report some **60° STANDARD** arms refuse. NEVER assume 3/4/6-arm star junctions magically fit. No generic fake flat circular plate fallbacks.
- \`PIT_LANE\` and \`WEICHE\` are v0.12 **graph macros** with a shared-gore deck/branch, e.g. \`PIT.taper=80m\`, \`PIT.lane=7.2m\`, \`WEICHE.taper=80m\`. \`FORK/JOIN\` expand into \`WIDTH_STEP+SPLIT_HALF/MERGE_HALF\`. A cinematic highway exit must genuinely compile and preserve lane width/marking, full drive surface and split-edge parity; it is not two unjoined ribbon meshes.
- J14 source recipe provides \`J14_PADS\`, \`placePads\` and a \`practice\` pad with source \`size [120,14.4]\`, two \`parking_box\` stations \`[5.4,3.0]\`; use as a PAD/parking ***donor***, **not** an obligatory 120m Town parking lot or full endcap claim. Distinguish a valid in-network parking branch/turnaround from a track that simply stops on a precipice.
- **Missing or uncertain:** generic T-junction in core 0.12 is not proven; DO NOT invent one as implemented. Tight three-way/star arrangements require a real \`ROUNDABOUT\` or other positively tested Track Core graph/route recipe, possibly a new explicitly authorised core capability later.

Source \`TOL\` checks include \`kinkDegPerM=0.5\`, \`kappaJump=0.01\`, \`bankStepDeg=1.5\`, \`orth=1e−6\`, \`foldMargin=0.5m\`, \`crossClearance=0.9m\`, \`tunnelMorph=0.3\`, \`tunnelRock=1.0m\`. These are **core check defaults**, not a full whole-product safety case. Run \`runChecks\`, \`runGraphChecks\`, and added receiving-level independent road/terrain/body contact + drive testing, never silently weakening tolerances.

## 3. Modular catalog: **existing primitive** vs **adapter proposal**

| ID | Design module | Composition from existing core | Shape/contact purpose | Current state |
| --- | --- | --- | --- | --- |
| C01 | **Island Lip Entry** | CONNECT + legitimate TRANSITION/STRAIGHT + Surface Truth endpoint | Suspended deck nests onto island, supports, tangent/grade continuous, uninterrupted drive collision | **ADAPTER PROPOSAL**, geometry not independently proven |
| C02 | **Island Lip Exit** | Reverse of C01 only after independent directional test | From island street to raised Joyride deck | ADAPTER PROPOSAL |
| C03 | **Suspended Straight / Curve / S** | STRAIGHT, CURVE_EASE, OFFSET_S, CONNECT | One continuous supported or unsupported void deck, fixed Joyride cross-section | SOURCE PRIMITIVES, constellation-specific construction unproven |
| C04 | **Raised Ramp / Highway Offramp** | rise/blended straights, FORK/WEICHE or proven branch macros, CONNECT | True off-axis/height diverge and rejoin; no visual-only branch | SOURCE PRIMITIVES, island adapter pending |
| C05 | **Grounded Track → Island Road Merge** | TRANSITION (track to city/nature) + local real street profile + terrain contributions | Barrier/lip/markings gradually recede; trail/road contacts supported | SOURCE TRANSITION, biome/island fit pending |
| C06 | **Ring-road on an island** | route graph + CURVE_EASE + CONNECT, optional source roundabout | Road hugs usable rim **without** cutting settlement off; meaningful ingress/dropoff and emergency exit | ARCHITECTURE PROPOSAL |
| C07 | **Star / central distributor** | real ROUNDABOUT if arm fit passes, branches to destinations | Feeds multiple functional locations without road-clutter | **CONDITIONAL / NOT GENERIC SOLVED T-JUNCTION** |
| C08 | **Island Tunnel Through** | compiled tunnel ring + terrain cut + entry/exit portals of same ring | Drive straight/curved through bulk with verified roof/vehicle clearance | SOURCE TUNNEL, world boolean/contact pending |
| C09 | **Cliffside / Through-Gate** | source curve/ramp + source tunnel/clearance if enclosed | Track physically attaches to bluff/gate, protected sightline, optional scenic | ADAPTER PROPOSAL |
| C10 | **On-island Stone Bridge** | Track Core route crossing + physically isolated Kenney stone bridge donor if selected, real abutments | ONLY on island river/gap/cut or actual landscape crossing | REUSE CANDIDATE; **FORBIDDEN AS INTER-ISLAND VOID BRIDGE** |
| C11 | **Parking / turnaround / endcap** | \`pads\` donor, source \`placePads\`, PIT_LANE/WEICHE where appropriate, valid turnaround geometry | Terminates into a useful park/garage/lookout/social spot and preserves escape/return | PROPOSAL ADAPTED FROM PADS, not source-certified standalone terminal |
| C12 | **Ring/portal/organ drive-through** | tunnel/portal ring matching compiled stream; World portal only where explicitly authored | Visual organ tunnel as meaningful ride experience; never bypass physics or WorldGraph | SOURCE TUNNEL + ORGAN VISUAL DONOR |
| C13 | **Overpass / island-supported raised track** | source route vertical profile + authored measured columns/terrain embedding | Supports stand on the island terrain; no pier hallucinations dangling in cosmic void | FORM/STRUCTURE PROPOSAL |
| C14 | **Island-to-island junction/satellite branch** | compileGraph + named source node, FORK/WEICHE and individual CONNECT endpoints | Direct distribution to multiple satellites; avoid arbitrary loops/dead-end arms | CONDITIONAL GRAPH SOURCE; inter-island contact pending |

**Important:** This table is a **design catalog, not new exported runtime enum or a statement that all 14 are already playable**. Exact existing core spellings stay under the Track Core owner. Proposed \`Cxx\` codes are only briefing/evidence identifiers.

## 4. Connection anatomy: one two-way road as a real physical contract

The expected sequence per inter-island connector is:

\`\`\`
Island A meaningful road node
  -> grounded prepared approach (terrain/contact)
  -> TRANSITION / WIDTH_STEP if actually necessary
  -> lip A support / fully supported deck endpoint
  -> compiled CONNECT / curve / floating Joyride road body
  -> lip B support / fully supported deck endpoint
  -> terrain seam and surface transition
  -> Island B local street/POI/distributor/parking route
\`\`\`

For **both** travel directions inspect:
1. \`P0/P1\` shared position parity, connected stream tangents and headings, slopes, banks and slot width/profile; road-right handedness and outward normals do not flip under reversal.
2. Centreline curvature and **inner-edge fold margin**; explicit core checks plus real mesh triangles/kerbs/strang/guardrails.
3. Deck-to-ground vertical gap, buried/visible interface, collision/suspension step, underside/abutment/shadow contact and lateral edge safety. A real small clay sill/foot can support the deck **on the island**; no faux masonry canyon bridge in void.
4. Surface/markings/barriers/strang visually carry through the seam via source role-based transition windows; the island style starts *after* legitimate drive geometry is stable.
5. No road to nowhere: connection has an actual on-island arrival, turnaround or outgoing branch; vehicle can pull out, return, park or continue without falling off a cliff.
6. Deterministic \`RouteRecipe\`, named socket/island IDs, selected donor revisions, Surface Truth seed/overrides, collision, persistence/fresh reload and same-source browser/Blender comparison.

**Do not fabricate numerical thresholds** for drive slope, landing support, steering, bridge bearing or K2 collision. When no receiving contract is audited, record \`SOURCE_REQUIRED/NOT_TESTED\`, then derive the tolerance from vehicle physics and real terrain measured geometry.

## 5. Candidate network: semantic Town hub with optional satellites

No arbitrary mandated ring or centre star. Routes need a reason and available space:

| Island | Candidate adapter | Why and how to test |
| --- | --- | --- |
| **KFB Town** | compact civic distributorship, small connector approaches, optional edge ring *only if settlement allows* | Traffic feeds **market, civic centre, mine/farm, satellites**; keep pedestrians/social middle intact; do not pave over town with a heroic 28.8m ring |
| **Protopia** | handmade repaired connector with actual durable road; link to **separate Maker Space** | Farmers/repair routes cross a legitimate supply/travel connection; visible repairs not equivalent to unsafe seams |
| **Maker Space** | wide DIY island workshop service turnout, park/garage, small stunts on source-backed pads | Goods, workshop and play areas reached from a genuine off-ramp, not disconnected track on decorative platform |
| **Dystopia** | encircling broadcast/industrial road OR stage detour + cliff tunnel | Crisis broadcast/performance and lived social routes; no literal “no off ramp” that breaks access |
| **Utopia** | engineered clean showroom-to-worker-backstage lane or controlled plaza split | Robot workforce/service road connects CEO/showroom with real loading/repair, not empty circular city |
| **Polar Xmas** | short winter lip/shelf approach, single deliberate arrival/dropoff | Glacial mass supports one road; **separate** Hunky/Dory UFO **underside portal/flight** (do not force the car road through UFO hole) |
| **Organs / Attractions** | through-road / tunnel ring along source-authored attraction | Validate actual organ/O1 donor silhouette, path purpose, body separation and same Track Core; concept inspiration only |

There is no topological requirement that Town must be a fully central 6-arm **physical roundabout**. Town is a **narrative hub**; candidate routing can use several smaller supported distributors where story and terrain require them.

## 6. Image generation as **construction communication**, not fantasy production evidence

**Source gate mandatory:** isolated real Joyride J17/T4 unchanged road section first (compiled sample deck, strang, markings, barrier, 3/4+front+section), and real current accepted Protopia/Maker contact source before proposing shape changes. Images shown in the image-generation host must be **actual source pixels** with a receipt, not path names. If source pixels are not genuinely available, produce a neutral source-render/geometry sheet in existing Blender or ToolBox before image generation; a generated mood sheet must be labeled \`MOOD_ONLY\`.

**Four bounded visual jobs, each on a frozen source or real candidate**:
- **Sheet S01 — Lip Interfaces:** 3–4 *genuinely compiled alternatives* shown individually at SAME scale/camera/terrain datum; isolated \`lip+deck+ground seam\`, front/side/top/3/4, no island decoration.
- **S02 — Junction/Exit:** one real \`WEICHE/PIT_LANE/FORK\` source cut plus a roundabout **only if solved**, showing actual road boundaries, splitter/gore and parking exit, 3/4 and ortho/cut.
- **S03 — Tunnel & Cliff:** source tunnel \`48-point section\`, 7m headroom design and actual host terrain cut: mouth/roof/portal collar and section at same sample, no fantasy false rock-hole.
- **S04 — Network Grammar:** a **source-derived schematic/model view** with Town, Protopia, Maker, Utopia, Dystopia and optional Polar as separately readable masses, routes labeled by actual socket/piece/zone and their destination purpose. No fabricated star/round ring geometry presented as compiled.

**Rules for every sheet:** no invented residents, billboards/branding, vehicles, arches/pillars, assets, fake road widths, fake measurements or second track surface. Same source revision, 3/4 hero + ortho top + side/section, grayscale neutral form and separate actual KFB Clay/Joyride role-color render at fixed camera. Directly on the image: only neutral labels, measurements actually derived from same candidate, exact module ID and \`SOURCE_ISOLATED/PROPOSAL/NOT_TESTED\` classification; no glossy poster title. Show close crops of **contact seams, support feet, lane split, road markings**. At most **5–6 proposed build-form families**, not a 6-mesh limit. ImageGen suggestions may explore **surface, lip support and local clay treatment** after actual unchanged geometry is frozen, never hallucinate new roads or assert drivability from pixels.

A beautiful 3D-looking perspective does **not** certify that a real \`.blend\`, core stream, collider, exported GLB, connected island graph or browser driver exists. For Blender/Work acceptance compare **same source at neutral, Clay and actual world-context views**; independent Critic sees measured geometric evidence, not promotional art.

## 7. Acceptance / reusable kit exit — future, **NOT RUN in this slice**

**Minimum first engineering pilot**, when separately authorised AFTER current design gate: recover *the actual Protopia→Maker working candidate*, preserve the exact donor source and revision, isolate road and both lips. Show **one complete two-way** Protopia↔Maker route, continuous stream and contact, at least one real split/turnout to a meaningful Maker parking/service space; no runtime fan-out to six islands yet.

Required **same-candidate** evidence:
- \`compileRecipe\` / \`compileGraph\` and \`runChecks\`/\`runGraphChecks\` error/warn record; rejected geometry is a legitimate FAIL, never overwrite checks.
- Source \`P,T,U,R\` stream + donor version/recipe checksum; triangle/surface/collider parity, 14 slots, lips and field-contact/tangents at each endpoint.
- Real vehicle drive from both sides on the route, parking/turnaround, grounded road seam and visible cliff clearance; independent Tester and independent Critic rather than Builder self-approval.
- A 3/4, top, side, cross-section and detail crop from same neutral scene, then material parity in Joyride/K2 via same camera.
- Saved edit, fresh reload, independent island state and no second road owner; no generic SVG/promo screenshot or raw asset URL as acceptance proof.

**Current truth at v0.1:** this document is **design and source-text audit**. **0 new Track Core implementation, 0 generated connected routes, 0 actual new model renders, 0 drivability checks, 0 source-isolated fresh road images in this slice, 0 independent critic runs, 0 Stage or Site product deployment, no PR/merge/Golden**. Existing Source Return describes a recent pilot but is **not reverified here**. Preserve parent current **Four-Island Story Vision R1 → Georg A/B/FAIL**, World R4 **STOP / NO MVP**; **one next engineering evidence gate is conditional** on that authorisation. Routine planning input stays on the owning branch; no KFB Hub/public Stage churn.

---
## Additive change note / recovery pointer

2026-10-11: new v0.1 foundation brief on existing planning branch; source-checked exact v0.12 formulas and known junction/clearance edge cases, Joyride J17 inherited presentation, Georg's void-bridge ban and central-Town purpose. On timeout: fetch this exact file and branch head; re-read owning Return; never rely on a previous message alone. No generated alternative track core.
