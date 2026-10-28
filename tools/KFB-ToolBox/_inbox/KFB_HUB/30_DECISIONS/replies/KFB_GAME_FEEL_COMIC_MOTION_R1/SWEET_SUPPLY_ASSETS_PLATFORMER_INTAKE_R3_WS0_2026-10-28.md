# KFB Cascade Sphere · Sweet Supply + Platformer Asset Intake R3 · WS0

**2026-10-28. ADDITIVE GEORG INTENT / READ-ONLY ASSET AUDIT / DESIGN, NOT A RUNTIME OR LICENSE PROMOTION.**
**One concept owner:** existing WS0 Game Design / KFB_HUB Fractal Canvas, Draft PR #435 on branch `planning/kfb-game-feel-comic-motion-ideation-r1-2026-10-19`. Earlier R1 Cascade Sphere and R2 Prototype Factory Maze remain intact and authoritative for the primary gameplay. **One next gate:** `WS0_PLATFORMER_ASSET_INTAKE_AND_L01_SOURCE_GATE`.
**Receivers unchanged:** sole WS1/WS1b R3F host, single Asset Librarian/Registry source truth, existing private asset intake ownership, Combat, World/Surface, Audio, Card/Save, HyperNorm. No new Asset Librarian, World, combat, editor, site or food game owner. WB2 Four-Island R4 remains STOPPED/NO MVP.

## 1 · Georg's revised direction

Georg reports that he has **purchased KayKit Platformer Pack including EXTRA** and supplies the Dropbox folders for FREE and EXTRA, plus KayKit Prototype Bits, KayKit Restaurant Bits, Tiny Treats Bakery Interior, Baked Goods and Charming Kitchen. WS0 should check which purchased sources are not on GitHub/private repo, carry out source-hashed license-aware intake, make verified donor models available to the current game build and keep the Asset Librarian current.

Game objective is still Cascade Sphere / Prototype Factory Maze: one short accessible action/tactics + supply/route intervention loop, flying Mech/maze/Fluff/Goo, real KayKit art. The cozy edible aesthetic is **an additive level skin and object/process palette**, not a diversion into an entire restaurant-management simulation or a separate recipe engine. The same route graph, switch/socket/packet logic and Level 01 acceptance are shared. Broaden visual/emotional appeal through agency, varied activities and friendly, readable characters rather than assigning colors or gameplay to gender stereotypes.

## 2 · Dropbox inventory and source/license evidence — actual connector reads

Provided folder links (all confirmed Dropbox metadata and folder listing):
- **KayKit Platformer FREE**: https://www.dropbox.com/scl/fo/2xr71fa9czj8ibyaefog4/AFWr0GunBMcc05dQLLl6F_4?rlkey=lhty677518g4nyepusps6tgt3&dl=0 — folder `KayKit_Platformer_Pack_1.0_FREE`, actual `Assets/gltf/{neutral,blue,red,green,yellow}`, License.txt and textures. In `neutral` **38 .gltf**, in `blue` **83 .gltf**, listed with the matching source folder hierarchy. Models include `button_base_blue.gltf`, `lever_floor_base_blue.gltf`, `spring_pad_blue.gltf`, `pipe_straight_A_blue.gltf`, `platform_slope_4x4x4_blue.gltf`.
- **KayKit Platformer EXTRA**: https://www.dropbox.com/scl/fo/z0nmtrkeuko9afnr02wwp/AML2C9iu3vGrYCScKdyt_xE?rlkey=2ivkfiajavr42cilv4gwj28ex&dl=0 — `KayKit_Platformer_Pack_1.0_EXTRA`, same five colors and asset/texture hierarchy. In `neutral` **53 .gltf**, in `blue` **118 .gltf**, e.g. `conveyor_4x4x1_blue.gltf`, `conveyor_4x8x1_blue.gltf`, `sawblade.gltf`, `spikeball.gltf`, `hammerblock.gltf`.
- **KayKit Prototype Bits**: https://www.dropbox.com/scl/fo/fgmxjabw7sx31ixch8l8p/ACYgaIhgmP_MhDQEG73l8OQ?rlkey=hsahar6edt430mc2i8ysi1nhc&dl=0 — source folder confirmed. KFB repo already contains richer Prototype Bits 1.1 in `media/3D_Assets/KayKit_Bits_Bundle1_1.1/` (85 GLTF).
- **Exact license checks:** both FREE and EXTRA Dropbox `License.txt` were read: explicitly `Creative Commons Zero (CC0)`, permits personal/educational/commercial use. Official itch https://kaylousberg.itch.io/kaykit-platformer likewise CC0, describes 120 unique FREE and 170+ unique EXTRA models; these official totals describe *unique assets* across groups and must not be conflated with individual color-folder listing counts. The purchase does not alone require private-only storage. Creator requests not to resell unmodified files or claim authorship. Source provenance/purchase tier and attribution encouraged; no public binary publishing in this documentation change.
- Dropbox source folders are user-provided publicly shareable links; do **not** infer that game distribution/provenance is already implemented. **No files have been downloaded or uploaded by this research pass.**

## 3 · GitHub main food assets — actual source directory listings, not a visual acceptance

The exact provided main folders were opened by the GitHub connector. Listed matching GLTF model counts:
| Main source directory | GLTF models | Gameplay/art role |
| --- | ---: | --- |
| `media/3D_Assets/KayKit_Restaurant_Bits_1.0_FREE/Assets/gltf/` | **144** | ingredient state changes, counter, sink, oven, crates |
| `media/3D_Assets/KayKit_Bits_Bundle1_1.1/Restaurant Bits/Assets/gltf/` | **225** | richer Restaurant 1.1, pizza, ice cream, ingredients/dough, served foods |
| `media/3D_Assets/Tiny_Treats_Bakery_Interior_1.1_FREE/Assets/gltf/` | **114** | modular bakery interior, oven, stand mixer, display, café |
| `media/3D_Assets/Tiny_Treats_Baked_Goods_1.0_FREE/Assets/gltf/` | **32** | croissant, donut, strawberry/chocolate cake states, buns |
| `media/3D_Assets/Tiny_Treats_Charming_Kitchen_1.1_FREE/Assets/gltf/` | **118** | fridge, stove, sink, counters, appliances |
All four FREE pack `License.txt` files inspected in KFB main: **CC0**; Tiny Treats attribution optional. 1.1 and 1.0 atlases must remain attached to their respective source variants. Presence in GitHub is not proof of exact visual donor use; isolate source objects and fit before composing.

Exact source examples for first scene composition (names inventoried in GitHub directory listings):
- City/streets: `KayKit_Bits_Bundle1_1.1/City Builder Bits/Assets/gltf/road_tsplit.gltf`, `road_straight.gltf`, `building_A_withoutBase.gltf`.
- Delivery modules: `KayKit_Bits_Bundle1_1.1/Restaurant Bits/Assets/gltf/crate_dough.gltf`, `food_ingredient_dough.gltf`, `food_pizza_cheese_plated.gltf`.
- Bakery goal: `Tiny_Treats_Bakery_Interior_1.1_FREE/Assets/gltf/display_case_short.gltf` and `bread_oven.gltf`.
- Cute reward objects: `Tiny_Treats_Baked_Goods_1.0_FREE/Assets/gltf/croissant.gltf`, `donut_pink.gltf`, `cake_strawberry_slice.gltf`.
- A few objects should be selected and source-isolated **as actual rendered GLTFs**, showing geometry/materials at gameplay distance; do not simultaneously import five entire packs into a Level01 scene.

## 4 · Visual/gameplay overlay: SAME MECHANIC, two presentation themes

**Technical Factory / Mech:** Fluff packets are stylized data/work objects; a blocked queue and Goo-covered junction break the route; Mech shoots a corrupt detachable cell, reroutes flow and repairs a socket.
**Sweet Supply / Bakery City:** the same graph is a bakery delivery network; cute animated flour/ingredient/parcel packets travel conveyor belts and streets; the switch reroutes an ingredient cart or pastry parcel toward a café, not a server. Goo can be a local theatrical dark icing/ink occlusion only if its underlying exact infection state remains consistent; no wholesale replacement of KFB Black Goo canon. The player may simply switch a belt, catch a parcel, use an actual oven/receipt target, and get a short tactile/sound reward. The player can freely choose either theme and both retain actual causal state.
**Concrete themed variant of L01 SWITCHYARD:** spawn 6–12 friendly recipe parcels, one junction, two routes and an actual `button_base` + `lever_floor_base` source-family actuator after visual/interaction proof. A single hand-controlled switch sends deliveries to a small Tiny Treats bakery case; a blocked route visibly queues. Completion = authoritative arrivals at the café, not decorative pastries at a scoreboard. No new cooking physics or crafting recipe economy.
**Possible L02/L03 later:** L02 repairs a damaged conveyor belt, with goo/ink outside edible item visuals; L03 flies Mech to a rooftop kitchen switch or optional accessible on-foot courier and opens elevated delivery route. Keep no mandatory combat in Chill. Alternate sweets and dystopian treatments may coexist within adjacent Mindscapes.

**Why this helps broader audiences:** low reading burden, expressive toy proportions, gentle humor from physical cause/effect, rewarding restoration, freedom to fight OR solve, strong readable silhouettes and warm visual variety. Not tied to "pink for girls" or a gender-coded game mode.

## 5 · WS0 repo intake: pragmatic, license-aware, no automatic upload

**Existing private repo confirmed by GitHub:** `georg-doc/kayfabizarro-private-assets`, default branch `intake/v538-2026-10-18`, owner permissions yes. That branch currently holds a **separate V-538 sealed manifest of 41 assets** requiring LFS and license verification; do not append Platformer files to V-538 manifest or reinterpret its `UNRESOLVED_RUNTIME_HOLD`. `BUILD_CONTRACT.md` forbids unallowlisted raw assets in runtime and client-side GitHub tokens.

**Proposed WS0 Asset Librarian intake path:**
1. Source-inspect actual Dropbox FREE and EXTRA pack trees, license file, textures, glTF/bin completeness by color; count unique model stems and duplicate FREE-in-EXTRA before any upload. One exact-source file at a time for visual isolation (button, lever, conveyor, ramp, bouncer).
2. Create or choose a distinct **platformer-asset-intake** branch or isolated asset folder under existing authorized ownership. CC0 means public repo can host legally cleared optimized runtime art when desired; for tidy purchased SOURCE/EXTRA provenance or existing KFB policy keep raw paid tier inputs in appropriately restricted private source location. **Do not assume EXTRA must legally remain private**. Avoid duplicate FREE raw copies if EXTRA contains them; keep stable alias/pack identity.
3. Add proper `LICENSE.txt`, creator, source URL, FREE/EXTRA/SOURCE variant, purchase/availability evidence (private), file sizes/SHA-256, glTF texture/bin dependencies, path and content hashes; preserve original 5-color directories and atlas names. Git LFS for large bundles only as the intake owner specifies; verify that consumers get bytes rather than Git LFS pointer.
4. Current single `kfb-asset-librarian.frizzlebob.chatgpt.site` is the owner of asset discovery. Update its registry/index of source refs after commit and verify model load + visual isolated donor, don't fork a second gallery. A source URL load alone is not original donor visual proof.
5. Runtime can only consume an explicitly source-cleared, build-time packaged/allowlisted subset from private repo; a browser cannot fetch private GitHub binaries without leaking tokens. Public CC0 optimized models can use the existing approved public asset path if chosen by WS0. Keep private purchase/account metadata private. No raw-file public gallery, no new Site, no broad registry regeneration without owner gate.
6. The Tiny Treats and KayKit Restaurant FREE / KayKit Restaurant 1.1 sources are **already in main**; dedupe and reuse present registry records rather than re-upload all. The one game requirement is a few exact scene objects, not a full pack migration.

**User asks WS0 to do the push:** this web-chat note is a *handoff*, not actual binary movement. The currently available GitHub connector only writes UTF-8 code/text files and Dropbox link/folder reads do not by themselves upload binary trees into the repo; do not claim these packs were pushed. WS0/Asset-Librarian executor with authenticated access to Dropbox and Git LFS performs the intake as a separate owned asset-production task.

## 6 · Acceptance and exactly one next gate

Current-turn source checks: Dropbox link metadata **3/3**, licensed FREE/EXTRA read **2/2**, variant `gltf/neutral` and `gltf/blue` folders **4/4**, full KFB food pack directory inventory **5/5**, main FREE licenses **4/4**, current private repo and its V-538 contract read. New 3D source isolation, GLTF decode, runtime, cooking simulation, mobile browser/GPU, game audio, Site/Stage tests: **0**. No asset push, no runtime scene and no public deployment.
**ONE NEXT GATE: `WS0_PLATFORMER_ASSET_INTAKE_AND_L01_SOURCE_GATE`.** WS0 validates platformer source/license/variant and existing pack dedupe, persists only approved assets and provenance via authorized current Asset Librarian/Git owner, source-isolates original button/lever/conveyor and one bakery reward object, pins the WS1b actual receiving head, then selects a single L01 Switchyard fixture with a technical and sweet-supply visual variant of the **same** graph. No game implementation or Live promotion before this gate.
