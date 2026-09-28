# Claude Coworker · CLAY-CITY-MVP-01


## Mission

Build one productive, playable KFB World MVP tile. This is an implementation and integration job for **Claude Coworker**, not Claude Design.

The outcome must let Georg walk, switch directly to a car, drive on and off the road, and fly over one coherent Claymation district under a real shared skydome.

Do not build the whole Open World.

## Current execution result · 2026-09-29

The first Coworker implementation is persisted on `coworker/clay-city-mvp-01-2026-09-28@939224c051afb464c553ff6f9b59609503eb1b49` and has a public review wrapper:

`https://kayfabizarro.pages.dev/kfb-hub/pruefen/clay-city-mvp-01/`

Measured result: play probe 6/7, donor isolation 13/13, T4 intake 52/52 and 45–68% fewer draw calls than R6. Ground/road continuity, direct Auto, off-road Drive, the full short T4 segment and Flight work. This is a useful candidate, not an accepted MVP.

Georg's first human test fixes the repair priority without another decision gate:

1. walking is still unacceptably slow and appears to use the wrong or incorrectly timed standard KayKit walk / Movement-State mapping;
2. the Clay look is incomplete on facades and buildings: H0/K2 cartoon bend, facade deformation and characteristic surface treatment are missing or too weak;
3. triangles remain 213–240k against the 200k target; trim after the near-field look is correct, without replacing accepted buildings with boxes;
4. real visible p95 and boot remain unproven.

The next implementation pass is one coherent **playability + look acceptance repair**, not a choice between unrelated micro-gates: correct the movement owner and animation timing, complete the bounded H0/K2 building/facade treatment, then trim triangles and rerun the same Ground/Auto/T4/Flight probe. T4 extras and the Resident pocket remain secondary until this acceptance pass is green.

The candidate currently places 64–66 buildings, although this brief asked for approximately 12–36 instances in 4–8 readable clusters. Treat that as scope drift, not as a new density target. The first triangle/composition lever is to return to a few strong street/landmark clusters and spend the saved budget on visible Clay facade quality. Do not first degrade the geometric road, continuous ground or hero buildings.

Execution environment: **Claude Coworker Desktop**. Capability note confirmed on 2026-09-28: this Coworker session has Dropbox and Chrome/GitHub access, but no real local Git checkout or local server. Work through the existing GitHub branch and review browser surfaces with small crash-safe commits. Do not claim local tests that this environment cannot run, and do not publish every micro-checkpoint to the fixed public Stage.

## Recover exact truth first

Read in this order:

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `skills/chat/GATE_PROPORTIONALITY_TOKEN_BUDGET_PROTOCOL.md`
5. PR #282 `skills/chat/workflows/KFB_WORLD_CLAY_CITY_SKY_CORE_2026-09-28/START_HERE.md`
6. PR #282 Return/Source/Test evidence for World M2A R6
7. this brief

Re-fetch current heads immediately before changing anything. Briefing-time pins:

- repo: `georg-doc/kayfabizarro`
- main: `51f9bc22596a0d0165f4da9e8e2ea14118466210`
- World R6 branch: `work/world-m2a-r6-focus-quality-2026-09-28`
- World R6 head: `df7220331932a28865af96d8411aac630d21dff7`
- World R6 PR: `#282`

GitHub current state wins.

## One branch, one outcome

Create or use exactly one review branch:

`coworker/clay-city-mvp-01-2026-09-28`

Base it on the current World R6 candidate unless GitHub proves a newer accepted World owner head.

No merge. No Live promotion. Do not replace World r2/WB2, movement, camera, Track, Resident, Drive or Flight owners.

## MVP scene

One approximately 184 m coherent play tile containing:

- one residential street;
- one shop/crossroads pocket;
- one taller silhouette landmark;
- one real, driveable KFB race-track segment with a city/nature transition plus a branch/ramp socket;
- continuous terrain around and below every driveable area;
- 4–8 verified KayKit/Kenney/Tiny Treats building archetypes, approximately 12–36 deterministic building instances arranged as readable scene clusters rather than continuous city fill;
- one small Resident pocket, allowed to sleep outside its near range;
- one lightweight billboard/sign socket without autoplay media;
- one shared skydome adapter with `BASIC` and `TINY_SKIES`; richer `KFB_UNIVERSE` bodies are optional and quarantinable.

## Architecture decision

OSM is the orientation skeleton, not the visible city.

Keep only what improves gameplay:

- road graph/centre lines, class, width and names;
- selected landmark anchors;
- water/zone boundaries only where needed;
- provenance.

Remove visible OSM building extrusions, far generic block shells and their collision from the active candidate tile. Do not render another 700-building OSM city.

## Sparse Scene Grammar · preferred MVP direction

Treat empty space as composition, not missing content. The visual target is the economical Knet-Strecke-T4 logic: colourful Clay terrain carries a small number of readable, interaction-rich islands.

- road graph and Track Core define traversal; the world does not need to reproduce every real parcel or building;
- two or three buildings plus facade/prop rhythm may represent one street block;
- nature appears as reusable vignettes: one Clay hill, 1–3 trees, rocks, fence/ditch or a picnic/activity pocket;
- landmarks and interaction pockets are hand-authored anchors;
- Residents, props and animation-heavy interactions concentrate in a few hero pockets; distant pockets sleep or use cheap loops;
- use instanced cluster recipes with deterministic palette/rotation/scale variation, not independent random scatter;
- coloured terrain is allowed and encouraged per biome, including purple, green, ochre or surreal combinations, as long as road/contact readability stays clear;
- preserve deliberate breathing room between clusters so the World reads as a cartoon stage/playset rather than an asset dump;
- far distance uses silhouettes, fog, sky and a few landmarks instead of generic building carpets.

### WFC boundary

Wave Function Collapse may select and arrange **approved cluster recipes** only in unlocked filler zones.

WFC does not own:

- the road or Track path;
- driving/contact geometry;
- OSM provenance;
- landmark position;
- spawn, quest or interaction anchors;
- the visual identity of a biome.

Its rules may choose compatible neighbours such as `street pocket → small building cluster → sidewalk/prop edge → terrain vignette`. Every generated placement must remain seed-reproducible, collision-safe and removable without changing the traversal graph.

For the 184 m MVP tile, prefer 4–8 scene clusters over continuous coverage. One strong Resident/interaction pocket is more valuable than dozens of inert props.

## Track source lock · T4 required

The visual owner for the integrated track is **KFB Knet-Strecke T4**, not T2 and not an older freehand proxy. T4 supplies the accepted clay look, edge/band/marking language, transition staging and biome/VFX language. Track Core remains the geometry/contact owner.

T4/M2 is not yet on GitHub, but its exact uploaded package is present in the authenticated KFB Production Inbox:

- receipt: `6d9b0cd8-bc29-4b8b-b41f-5821eef69d21`;
- bytes: `1,433,281`;
- SHA-256: `101b7c66edb259520c480a618cf064f25adf0ce4781c9f7e960eb7a13abeb93a`;
- content: accepted Knet-Strecke T4, road-marking grammar M2, transitions/VFX, evidence and checksums.

Therefore:

1. use the verified local copy at `/Users/georgv.westphalen/Dropbox/CLAUDE/KFB_TRACK_T4_M2_CLAUDE_DESIGN_SESSION_CUT_2026-09-28_r1.zip`;
2. verify byte count and SHA-256 again before unpacking;
3. inspect its manifest/checksums, then ingest it into the existing Track receiving owner on the Coworker branch;
4. commit the verified intake as the first checkpoint before runtime integration;
5. if the exact bytes are unavailable, return `T4_SOURCE_REQUIRED` for the Track subgate and do not silently substitute T2/T3 visuals.

The integrated sample needs only one short, properly driveable Track segment. A full circuit, pit lane and complete Racer mode are outside this slice.

## Clay material source lock · reuse the existing kit

T4 is the current scene/Track presentation donor, but it does not replace the already accepted Clay material kit. Before integrating the district, read and reuse:

- H0 art direction and world grammar: `tools/KFB-ToolBox/_inbox/KFB_CLAYMATION_H0_HIRNWELT_2026-09-27/`;
- K2 accepted material/tool owner: `tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T3 v2/KFB_CLAYMATION_K2_KNET_WERKZEUGE_2026-09-28/`;
- K2 executable modules: `lab-clay/clay-material.v10.js`, `clay-relief.v4.js`, `clay-tools.v1.js`, `clay-toolmix.v1.js`, `clay-profiles.v2.js`;
- accepted Track composition fallback/reference: T3 `track-look.v3.js` and K2/T3-v2 `track-look.v4.js`.

Ownership is fixed: H0 = visual direction, K2 = material/tool implementation, T3/T4 = Track/world composition, Track Core = contact geometry. Do not write a new Clay shader family inside World M2. Prove large/medium/small surface profiles in isolation, then adapt them with bounded quality tiers. If one expensive layer threatens the frame budget, disable that layer in the lower tier rather than replacing the whole look with boxes or flat colour.

T4's Clay particle/VFX language is also a donor, not a new effect system. Support a small pooled, event-driven set for footsteps, jump/landing, tyre contact, collision and biome dust. Colour and particle profile derive from the contacted terrain/Track biome. Quality tiers are `off / low / standard / high`; no continuous emitter, per-particle shadow, unbounded spawn count or required VFX for gameplay contact. VFX failure is quarantinable and may not block the playable tile.

Keep the adapter extensible to the shared interaction vocabulary `brickfish_throw`, `brickfish_hit`, `melee_hit`, `wrestling_impact`, `gift_open`, `gift_burst`, `prop_break` and `explosion`. The MVP tile only has to prove the events already present in its play loop; the others are contract entries for Resident/Combat consumers, not extra scene scope. Base Clay particles may later combine with optional comic starburst/impact marks and smoke. Gameplay remains authoritative; VFX only observes events.

CHOREO LAB 01 on PR #275 @ `358f4eeece97587498bd898a170089d53ad3f628` is the current interaction-contract donor. It proves `kfb.choreo.v0` storyboards and timing/spacing rules on `Rig_Medium`, not a playable two-actor runtime. If the Resident pocket uses an interaction, consume at most one small recipe such as gift handoff or argument through an adapter; do not rebuild the full Choreography Player in this World slice. Keep Body, Face/Eyes/Brows/Eyelids, Prop, Event and Clay-VFX tracks separable so the later Animation Lab owner can replace the preview adapter without changing World gameplay.

## Required implementation gates

### 0 · prove real donors

Before integration, render each chosen source building in isolation and record path/ref, bounds, pivot, materials and triangle count. A loaded URL is not proof that the intended donor design was used.

If a Kenney building source cannot be proven quickly, quarantine it and continue with verified KayKit/Tiny Treats. Missing one family is not an MVP blocker.

### 1 · geometric terrain-conforming road

Replace the active tile's raster/canvas road edge with geometry derived from the road graph.

- sample centre lines at 2–4 m;
- derive width from road class;
- project vertices through the existing terrain height owner;
- use a small presentation lift and side skirt to prevent cracks/z-fighting;
- stitch intersections and tile edges once;
- no overlapping decorative road ribbons;
- visual clay curb/sidewalk may not become an invisible hard wall;
- off-road terrain remains continuous and driveable.

PASS: no pixel stair edge, floating ribbon, crack, missing floor or vehicle fall-through in Ground, Drive and Flight views.

### 2 · deterministic Kit district

Each building is one recipe shared by rendering and collision:

`family + floorCount + body + roof + facadeRhythm + palette + deformationSeed`

- mostly 1–3 floors;
- selected 4–6 floor accents;
- rare 7–9 floor landmark silhouette;
- instancing per archetype × LOD × material family;
- shared clay material with per-instance colour/seed;
- facade sockets for verified windows, doors, awnings, balconies and signs;
- one-time squash/stretch/lean only, not per-frame mesh deformation;
- foundation pad/skirt follows terrain while buildings stay upright;
- simple collision proxy derives from the same recipe/transform.

### 3 · real play loop

Use the existing controls and owners.

- `Zu Fuß`: responsive movement with correct walk/run state;
- `Auto`: direct playtest switch, no long walk to the vehicle;
- `Auto/Drive`: road and off-road travel without holes;
- `Flug`: same World focus/LOD owner, stable view of the whole tile;
- existing E interaction remains the in-world interaction key.

The tile is not accepted if only Flight is smooth while Ground is ruckly.

The same vehicle must be able to enter the short T4 Track segment from the city road and return to city/off-road terrain. Track contact comes from the current Track Core; T4 presentation must not modify the proven driving surface underneath.

### 4 · shared sky in the representative scene

Reuse the existing Travel/TinySkies/WorldDesign donors; do not add an ad-hoc backdrop.

Minimum:

- `BASIC`: cheap gradient/sun/fog/cloud fallback;
- `TINY_SKIES`: accepted atmosphere/distance language;
- stable horizon and camera-follow behavior in Ground, Drive and Flight;
- no watercolor wall as default;
- same adapter contract usable later by Resident Atlas.

`KFB_UNIVERSE` cards/dice/planets are optional. If they threaten the frame budget, keep them off by default and record them as a later tier.

## Performance budget

Test the same representative tile in Ground, Drive and Flight, desktop and narrow.

- p95 frame time ≤ 33.3 ms;
- local boot ≤ 8 s;
- total draw calls no worse than R6;
- city/world cluster draw calls target ≤ 24;
- inactive cluster recipes must be instanced, culled or sleeping; no per-frame logic merely because an asset is visible;
- visible triangles target ≤ 200k;
- moving resolution floors remain at least R6: desktop 0.80, narrow 0.72;
- zero page errors, request failures and missing assets.

Use near/mid/far LOD with hysteresis. Do not solve performance by replacing nearby accepted buildings with obvious boxes. Far distance may use silhouette clusters/fog/cull, but no visible block popping at normal play distances.

## Crash-safe GitHub contract

Checkpoint early and narrowly:

1. source lock + donor isolation;
2. geometric road and continuous ground;
3. Kit district + play loop;
4. sky + performance evidence;
5. Return/changelog/Hub handoff.

These are recovery checkpoints, not Human Gates. Do not stop after checkpoints 1 or 2 merely to ask Georg to approve progress. Continue autonomously while the next bounded step is clear. Stop early only for a true core blocker, conflicting source ownership, or after the second failed repair pass on the same gate.

Because this environment has no local server, publish a review surface only when a coherent browser-testable checkpoint exists. Do not churn the fixed Stage for every commit. After every write, read back the exact branch head and intended files. A timeout is `UNKNOWN`: inspect first, retry only when the write is absent.

For binary intake, verify file count, size, format magic and parse/load before commit. Never commit command stderr as asset data and never perform a blind ZIP/base64 bulk upload.

## Site/Hub proof of concept

Do not assume Claude Coworker can directly edit the private GPT Site.

Required durable output on the GitHub branch:

- `RETURN.md` with exact repo/branch/PR/head, changed files, actual test counts, direct Stage URL only if genuinely published, unresolved items and exactly one next gate;
- additive `CHANGELOG.md` update;
- `SOURCE.json`;
- `TEST_REPORT.md`;
- `HUB_UPDATE.json` with short non-technical title, status, result, test link and next action;
- `SITE_HANDOFF.md` explaining what the existing KFB Production Control Site should show.

If Coworker has a tested KFB Production Inbox upload endpoint, it may additionally upload the compact handoff package and record the receipt. GitHub remains implementation truth. A GitHub-capable Codex/Sites owner ingests the handoff and publishes the existing Site in place.

This is the external-executor proof: Coworker completes and persists the production slice without needing direct access to the private Site or asking Georg to reconstruct the result manually.

## Gate proportionality

Core blockers:

- runtime does not boot;
- Ground is not controllable;
- direct Auto/Drive cannot move on and off road;
- missing terrain causes fall-through;
- active tile remains dominated by raster road edges or OSM blocks;
- frame budget prevents meaningful play.

Quarantinable:

- one building donor;
- one Resident;
- optional KFB Universe sky bodies;
- billboard media playback;
- decorative particles;
- one facade prop.

Do not let a quarantinable asset consume a second repair pass.

## Stop

Stop after one locally proven playable tile and its handoff. Do not expand to the full city, Combat, Racer, full NPC society, Water travel or Live publication.

After two failed repair passes on the same core gate, preserve the candidate and write failure recovery instead of continuing.

## Definition of done

Georg can use one real browser surface to walk, enter Auto directly, drive on/off a smooth geometric clay road and fly over a colourful, sparse-but-lively kit-built KFB playset under a proper skydome. The scene is materially smoother and clearer than public World M2A R5, and every claim is recoverable from GitHub plus the Site handoff.
