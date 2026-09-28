# Claude Coworker · CLAY-CITY-MVP-01


## Mission

Build one productive, playable KFB World MVP tile. This is an implementation and integration job for **Claude Coworker**, not Claude Design.

The outcome must let Georg walk, switch directly to a car, drive on and off the road, and fly over one coherent Claymation district under a real shared skydome.

Do not build the whole Open World.

Preferred execution environment: **Claude Coworker Desktop** with the real local repository checkout, browser and GitHub access. Desktop is preferred because the job needs local asset inspection, browser playtesting and small crash-safe commits. Do not continue from an uploaded snapshot when the current checkout is available.

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
- 6–12 verified KayKit/Kenney/Tiny Treats building archetypes, approximately 60–120 deterministic instances;
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

## Track source lock · T4 required

The visual owner for the integrated track is **KFB Knet-Strecke T4**, not T2 and not an older freehand proxy. T4 supplies the accepted clay look, edge/band/marking language, transition staging and biome/VFX language. Track Core remains the geometry/contact owner.

At briefing time no file, branch or PR named T4 is discoverable on GitHub main. Therefore:

1. check the current KFB Production Inbox/Site receipt and GitHub `_inbox` for the exact T4 session package;
2. if found, persist or reference its complete package and pin exact path/ref/checksums before implementation;
3. if absent, classify `T4_SOURCE_REQUIRED` and do not silently substitute T2/T3 visuals;
4. continue donor isolation, geometric road, city and sky work if useful, but do not claim the Track-look gate complete without T4.

The integrated sample needs only one short, properly driveable Track segment. A full circuit, pit lane and complete Racer mode are outside this slice.

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
- city draw calls target ≤ 24;
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

After every write, read back the exact branch head and intended files. A timeout is `UNKNOWN`: inspect first, retry only when the write is absent.

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

Georg can use one real browser surface to walk, enter Auto directly, drive on/off a smooth geometric clay road and fly over a colourful, varied kit-built KFB district under a proper skydome. The scene is materially smoother and clearer than public World M2A R5, and every claim is recoverable from GitHub plus the Site handoff.
