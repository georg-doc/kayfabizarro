# KFB Island MVP · Frozen Matrix · 2026-10-07

Status: **FROZEN PRODUCT CONTRACT FOR NEXT ISLAND ONE-SHOT · NO MVP YET**
Authority: **Georg / KFB**
Receiving owner: **KFB WorldBuilder / WB2 · Issue #360 · Draft PR #348**
Execution after freeze: **exactly one ChatGPT Work/WSA Integrator**
Source census: `skills/chat/recovery/KFB_ISLAND_MVP_INTEGRATION_CENSUS_2026-10-07.md`

## 0 · Freeze rule

This matrix exists to prevent another contract collapse.

- The previous **37 REQUIRED** Open-World rows remain REQUIRED.
- No existing required row is deleted because the bounded-Island architecture is smaller.
- New Georg decisions below refine/add acceptance requirements for the Island product.
- A required row can leave this matrix only by explicit Georg product decision.
- Placeholder substitution never satisfies a required row.
- Product verdict remains **NO MVP** until every REQUIRED row is GREEN at its named proof level.
- `Receiving Core`, technical checkpoint, deployment, CI or aggregate score never substitute for complete product acceptance.

## 1 · REQUIRED · binding MVP acceptance

### A · World / architecture

| Freeze ID | Required outcome | Acceptance clamp |
|---|---|---|
| F-R01 | Bounded island document inside WB2 | One runtime/document/editor owner; no second Island/Open-World runtime. |
| F-R02 | Independent island/session identity + local frame | Same-seed named islands do not share mutable state. Terrain, Track, objects, colliders, player and queries share one island-local physics frame. |
| F-R03 | Continuous Surface Truth | One authoritative visible/support/collision surface. No player-ground penetration; bridge/road/water seams are physically coherent. |
| F-R04 | Stable WorldObject identity | Semantic IDs survive batching/streaming and address authoring, state, Resident POIs, transfer/damage/rebuild. |
| F-R05 | Deterministic seeded generation + bounded streaming | Pinned generator/source revision, unload/dispose/reload isolation, no mutable-current-recipe dependency. |
| F-R06 | Public owner APIs + failure isolation | Modules consume existing owners through explicit seams; one broken optional module cannot stop ordinary world boot. |
| F-R07 | Simulation/render budget | Central update budgets, bounded LOD/instancing and target-device performance evidence. |
| F-R08 | LLM-free deterministic default | Moment-to-moment world, movement and activity boot/run without mandatory LLM. |

### B · Player feel / mobility

| Freeze ID | Required outcome | Acceptance clamp |
|---|---|---|
| F-R09 | Binding Ground controls | W/S, A/D turn, Q/E strafe, Shift, Space, RMB camera, wheel zoom; one Ground writer. |
| F-R10 | **P0 locomotion feel** | Default movement = clean Jog; Shift = clearly faster Sprint with matched clip; separate deliberate Slow Walk; usable faster Backward; no visible foot skating. |
| F-R11 | **P0 Cartoon Jump** | Anticipation → measured take-off → ballistic air → landing compression/recovery. No up/hold/down fake jump. |
| F-R12 | Camera | Stable normal-input third-person camera; no head clipping, wrong-level spiral behavior or geometry intrusion on required slice. |
| F-R13 | **Flight** | Ground → Flight → Ground in same world. First Space remains Jump; second fresh Space within accepted **400 ms** requests Flight. Take-off, forward, climb, descend, hover, boost, bank, intentional safe landing. One Flight owner. |
| F-R14 | Mode arbitration | Ground / Drive / Flight / Dialogue / Activity cannot simultaneously write movement/camera. Explicit handoff state. |

### C · Roads / Drive / world traversal

| Freeze ID | Required outcome | Acceptance clamp |
|---|---|---|
| F-R15 | Track Core construction + Joyride presentation | Ordinary road and race/stunt are one modular construction family. Technical Track-Core slabs are never final visible road language. |
| F-R16 | Representative road-world seam | Simple island road loop with village/POI street or sidewalk, bridge/water crossing and one modest race/fun section. Complex 720° Skydrive not required. |
| F-R17 | Vehicle / Drive | Enter/exit, accelerate/brake/reverse/steer, usable collision/recovery, continue driving after ordinary contact. Current Joyride physics = KEEP + TUNE, not final acceptance. |
| F-R18 | World traversal continuity | Player can move Ground → Drive → Ground and Ground → Flight → Ground without teleporting ownership bugs. |

### D · World construction / visual canon

| Freeze ID | Required outcome | Acceptance clamp |
|---|---|---|
| F-R19 | KFB Clay visual canon | K1/H0 Golden + K2/v10 routing; default KayKit material is not final KFB presentation. |
| F-R20 | **Claybound Compatibility Gate** | Every new/adapted prop/building/tree/rock/landmark plausibly belongs to one coherent clay/cartoon toy world. Reuse first; custom build only for a proven gap. |
| F-R21 | Source fidelity / source isolation | Actual donor/source is shown in isolation before adaptation; loaded URL/name is not design proof. |
| F-R22 | Authored composition, not random scatter | Large readable masses, clusters/clearings, FG/MG/BG, navigable negative space, coherent silhouette hierarchy. |
| F-R23 | **Grounded placement / no pasted-on props** | Physical snap + visual embedding: contact, local terrain/material/vegetation transition, clustering and third-person readability. |
| F-R24 | Sky / Environment | Existing Sky/Skydome owner only; coherent world lighting, atmosphere and environment state. |
| F-R25 | Signature Landmark | At least one strong Claybound-compatible landmark. It need not be a Life Tree; pyramid/sci-fi/object/tree/other is valid. |
| F-R26 | Water / river / edge presentation | Representative water seam; no hanging ribbon river, pasted band or unsupported visual shortcut. |

### E · Authoring / persistence

| Freeze ID | Required outcome | Acceptance clamp |
|---|---|---|
| F-R27 | PLAY / BUILD / GOD | Same running product; no second editor/runtime. |
| F-R28 | Asset Librarian + direct authoring | Source-isolate then PLACE / MOVE / ROTATE / SCALE / surface snap real assets. |
| F-R29 | Terrain sculpt | Raise/Lower with ordered native stroke replay and correct collider/support result. |
| F-R30 | Layered state | Base Recipe → Canon/Authoring Override → Dynamic State → Player Overlay. Transfer ≠ Damage ≠ Construction/Rebuild. |
| F-R31 | Exact Save / fresh reload / import | Complete unload, fresh load, exact canonical persisted state; visible geometry, colliders/support, sculpt and RouteRecipe replay; invalid import preserves last-known-good. |

### F · Living / semantic / media systems

| Freeze ID | Required outcome | Acceptance clamp |
|---|---|---|
| F-R32 | Resident | At least two real 3D Residents in the island slice with one meaningful activity/reaction loop. |
| F-R33 | ChatterBox | Current real ChatterBox seam; EyeRig v6 + PetMouth/real Resident presentation; no PNG/cutout or coded Card placeholder. |
| F-R34 | Card + Almanac | One canonical acquire/inspect/provenance interaction, persisted/reloadable. |
| F-R35 | Billboard / HyperNormalisation | Real Billboard/media owner + real HyperNormalisation/read-along consumer. Placeholder images do not count. |
| F-R36 | **Real Quote Pool content** | Billboard consumes a bounded source-proven subset from PR #354 with quote ID/provenance/rights/FrizzleQuestion/Brain-Food facts; no invented filler content. |
| F-R37 | Audio / Jukebox | One Audio owner/AudioContext. Use the technically green Audio module through a tiny World context/event adapter; prove at least one environmental/POI transition. |
| F-R38 | Signature / Transition compatibility | Landmark/placeable seam plus the accepted Theatre-Curtain module can attach without creating second world/UI owners. |

### G · Acceptance / never-again guards

| Freeze ID | Required outcome | Acceptance clamp |
|---|---|---|
| F-R39 | **Early Visual/Physical Golden Gate** | Before broad feature fan-out: island silhouette, Surface contact, locomotion, Joyride road, water/bridge, one landmark, KFB Clay/Sky/light and first-frame composition are already product-valid. |
| F-R40 | Negative-Golden regression firewall | Engineering-slab roads, dangling ribbon water, fake/weak compulsory Life Tree, player-ground penetration, sparse scatter, source contamination and obvious pasted-on props are explicit FAIL patterns. |
| F-R41 | No-placeholder firewall | Fake Billboard, dummy Audio, generic Resident, coded Card art, generic UI/Curtain replacement, default materials or substitute branding never earn PASS. |
| F-R42 | Fresh module critics | Write-free fresh-context critics drive normal input, capture their own evidence and score required dimensions. |
| F-R43 | Whole-product critic | Different fresh critic runs continuous PLAY → explore/drive/fly → Resident/media interactions → BUILD/GOD → edit/sculpt → Save → full fresh reload → verify → PLAY. |
| F-R44 | Complete-matrix rule | Every REQUIRED row GREEN; no required score below threshold; zero unexplained errors. Otherwise **NO MVP**. |

## 2 · STRONGLY INCLUDE · same One-Shot target, quarantinable only if genuinely non-critical

These are intended in the same One-Shot because they are high-value and largely prepared. A problem here should be repaired proportionally; after two non-improving passes, Production Guard may quarantine only if the core product remains coherent and the item has not been promoted to REQUIRED by another row.

| Freeze ID | Capability | Current best input |
|---|---|---|
| F-S01 | Theatre Curtain **Claybound/KFB visual tune** | Accepted r3 physical/cloth donor; preserve kernel/momentum, adapt look rather than rebuild. |
| F-S02 | Backpack / universal Flight presentation | Existing Travel Flight owner + actor/equipment concept; propulsion VFX/SFX consume flight state. |
| F-S03 | Flight kinetics presentation | Speed lines/contrails, boost, bank/pitch body response; richer Blender poses later if necessary. |
| F-S04 | Resident Life / Reaction / Encounter | Existing semantic model + reaction matrix; routine/activity can stay deterministic. |
| F-S05 | Resident performance layers | Current #369 / Motion / EyeRig / Emanata inputs where source-ready. |
| F-S06 | Living-Toy authoring grammar | 13 scenario families / activity pool as design QA, no invented runtime IDs. |
| F-S07 | Dialogue authoring rules | Etherington + NIE: THEREFORE/BUT, SAID/MEANT/WANTED, silence, interruption, group witness selection. |
| F-S08 | Minimal Joyride HUD / Radio/Jukebox controls | Existing real consumers only; UI must not dominate. |
| F-S09 | Shared Clay materialize/dematerialize presentation seam | UFO Lab / transfer grammar; presentation only, durable state owners remain separate. |
| F-S10 | Bounded seeded procedural structure provider | Seed-World street/parcel/BuildingRecipe grammar behind Surface Truth + Track Core + Claybound gate; sparse use, not city-block mandate. |
| F-S11 | Environment construction subset | 3–6 exact Etherington/Style references chosen for actual island problems: Clouds / Environment Mass / grounding as needed. |
| F-S12 | Fluff Work activity donor | PR #356 clips if one chosen Resident activity benefits; no new clips by default. |

## 3 · OPTIONAL PROOF · valuable if cheap, never a substitute for required product

| Freeze ID | Capability | Rule |
|---|---|---|
| F-O01 | UFO tractor-beam event | PASS/TUNE donor; one bounded event may prove Clay transfer grammar. |
| F-O02 | One Build/Repair/Rebuild visual assembly | Useful proof of shared Clay transform grammar. |
| F-O03 | One harmless destructible prop/building section | May prove stable IDs/state; does not activate full Combat. |
| F-O04 | Life Tree | Valid landmark option only; never compulsory island schema. |
| F-O05 | Sound Words / Bubble / Emanata packs | Use only through real current presentation owners; curated packs are not automatically finished runtime assets. |
| F-O06 | Historian / Chronicler | Authoring/narration direction only; not a required new runtime system. |
| F-O07 | Surf Card / bathtub Flight carrier | Special Flight presentation after universal Flight works. |

## 4 · LATER · explicitly outside first Island MVP acceptance

- Full Combat Arena / Card-Hex Platformer.
- Full combat loop: enemies, health, rewards, Minigun/Rocket progression.
- Full destruction sandbox / destructible settlement.
- 130+ islands / complete Universe.
- Every Deck / Resident / Card / Billboard.
- Full quest/economy.
- Multiplayer/network backend.
- OSM second planner input.
- Mandatory Life Tree / six-sector rule for every island.
- Full Low-/High-Vibrational Fluff economy.
- Complex Cabrio seat/ear/hand kinetics.
- 720° spiral / full Skydrive spectacle.
- All three inter-island travel methods proven simultaneously.
- Full Environment-Atlas S14–S17 recovery if source remains missing.

## 5 · Combat / shooting donor arbitration

Full Combat remains LATER, but its reusable pieces stay visible.

- **Combat Arena remains the Combat product/ownership boundary** for enemies, health, rewards and full combat semantics.
- Combat Arena contains KayKit-character/ranged-combat integration work that remains donor input.
- **Seed World / Combat Mech POC is currently a strong candidate donor** for shooting presentation, Minigun/Rocket FX, explosion/destruction clouds, clay/dust presentation and bounded destruction mechanics.
- Georg's current product assessment prefers the Mech-PoC shooting/VFX feel over the currently remembered Combat-Arena implementation.
- This is **not yet a source-certified winner**. Before any shooting/VFX integration, show the exact relevant Combat-Arena and Mech-PoC source/behavior in isolation and classify `KEEP / ADAPT / REJECT`.
- The winning donor feeds the existing Combat/event/presentation owner; it does not create a second combat runtime.

## 6 · Inter-island travel architecture

Preserve three eventual connection modes without requiring three implementations in the first slice:

1. **Portal** — materialize/enter/return.
2. **Track / Joyride Highway** — Track-Core authored connection.
3. **Free Flight** — player-controlled Flight.

First Island MVP proves local Flight and a future connection/port contract. Multi-island expansion later proves actual cross-document handoff.

## 7 · One representative first-Island content target

The One-Shot should produce one coherent bounded island with:

- strong P0 Jog/Sprint/Slow-Walk/Backward/Cartoon-Jump feel;
- local Flight;
- simple Joyride road loop + sidewalk/POI street + bridge/water + modest race/fun section;
- Drive + enter/exit;
- 2 visually distinct scene zones;
- small authored POI cluster, not long city blocks;
- one strong Signature Landmark;
- two real Residents + one meaningful activity/reaction/dialogue loop;
- one real Billboard + bounded PR#354 quote rotation;
- one Card → Almanac interaction;
- one real Audio environmental/POI transition;
- Sky/Environment;
- KFB Clay + Claybound compatibility + grounding grammar;
- Curtain entry/transition compatibility and preferably the clay-tuned Curtain;
- PLAY / BUILD / GOD;
- source isolate/place/edit/snap + sculpt;
- exact Save → unload → fresh reload → PLAY;
- early Golden, module critics and whole-product critic.

## 8 · Mapping to previous 37-row matrix

Nothing is lost. Previous rows map as follows:

- MVP-001/018 → F-R03.
- MVP-002/022 → F-R05/F-R07.
- MVP-003/004/005/010 → F-R09–R12 plus F-R14.
- MVP-006/007/024 → F-R15–R16.
- MVP-008/032 → F-R20/R22/R23/R25 plus F-S10.
- MVP-009/023/031 → F-R19–R24.
- MVP-011–016 → F-R27–R31.
- MVP-017/019/020/021/037 → F-R04/R06/R08/R14.
- MVP-025 → F-R17/R18.
- MVP-026 → F-R32/R33.
- MVP-027 → F-R34.
- MVP-028 → F-R35/R36.
- MVP-029 → F-R37.
- MVP-030 → F-R25/R38 plus F-S01.
- MVP-033/034 → F-R07/R06/R44.
- MVP-035/036 → F-R42/R43.
- New explicit Georg additions: **Flight = F-R13**, Claybound = F-R20, Grounding = F-R23, Early Golden = F-R39, Negative Goldens = F-R40, No-placeholder = F-R41, Quote Pool real content = F-R36.

## 9 · Execution order inside the ONE_SHOT

This is one continuous product job, not Baby Slices:

1. **Foundation:** island/session/local frame, Surface Truth, IDs, persistence substrate.
2. **Player Golden:** locomotion, Cartoon Jump, camera, simple Joyride road/Drive, local Flight.
3. **Early Visual/Physical Golden Gate:** must pass before broad fan-out.
4. **Authoring/Persistence:** PLAY/BUILD/GOD, place/edit/snap, sculpt, exact fresh reload.
5. **Required KFB systems:** Residents/ChatterBox, Card/Almanac, Billboard+Quote Pool, Audio, Sky, Landmark/Curtain.
6. **Strong integrations:** Flight presentation, Resident reactions, Clay transform, bounded procedural structure where valuable.
7. **Performance/LOD.**
8. **Fresh module critics.**
9. **Different whole-product critic.**
10. Only full REQUIRED GREEN → Georg receives one candidate.

## 10 · Freeze change control

After this file is frozen:
- new ideas go to `OPTIONAL` or `LATER` by default;
- they do not silently enlarge REQUIRED scope;
- existing REQUIRED rows cannot disappear unless Georg explicitly says so;
- Work/WSA may not rewrite this matrix to match what it happened to build.


## 11 · Operational acceptance contracts v1

This section operationalizes the frozen REQUIRED rows without changing scope or classification. The machine-readable JSON is authoritative for these fields.

| ID | Phase | Owner | Readiness | Smallest missing delta | Acceptance proof | Forbidden shortcut |
| --- | --- | --- | --- | --- | --- | --- |
| F-R01 | 1_FOUNDATION | WB2 runtime/document/editor | **ADAPT** | Bind bounded island identity to the existing WB2 document/session lifecycle and reuse current recipe/editor/store contracts. | Create Island A, unload completely, create same-seed Island B, reload A; document identity and state remain independent. | Second island runtime/editor or schema-only storage detached from WB2. |
| F-R02 | 1_FOUNDATION | WB2 session + physics/world-frame owner | **MISSING_SEAM** | Introduce one island-local origin/frame shared by terrain, Track, objects, colliders, player and queries; replace seed-keyed mutable singleton behavior with document identity. | Two same-seed island documents coexist sequentially without shared mutable state; support/contact stays numerically stable after unload/reload. | Render-group offset while Rapier/Track remain global; seed used as document identity. |
| F-R03 | 1_FOUNDATION | Continuous Surface Truth owner | **ADAPT** | Finish one authoritative render/support/collision surface with river/village/Track/sculpt contributions reconciled. | Same sampled surface drives visible mesh, support and collider; normal-input traversal shows zero ground penetration and coherent road/bridge/water contact. | Separate visual terrain, support height and collider truth; hanging ribbon water or plate seams. |
| F-R04 | 1_FOUNDATION | Canonical WorldObjectId model under WB2 | **ADAPT** | Make authored matrices/state keyed by stable semantic IDs drive regenerated visible geometry and relevant colliders, including updates. | Edit a source-pinned object, stream/unload/reload, and recover the same ID, transform, visible placement and collision. | Render-instance index as durable identity; merged mesh identity loss. |
| F-R05 | 1_FOUNDATION | WB2 world runtime / streaming | **ADAPT** | Pin complete generator/source revision + finalized recipe/RouteRecipe; add explicit replacement load/disposal boundary for bounded island sessions. | Canonical export is identical at stored precision after full unload/fresh load; same seed with different document IDs stays isolated. | Reading mutable current recipe files on reload; additive restore that leaks old state. |
| F-R06 | 1_FOUNDATION | Core integration API / existing specialist owners | **ADAPT** | Expose typed/versioned seams for Surface, Track, WorldObject, persistence and specialist consumers; retain exception isolation. | Optional module failure is contained and ordinary PLAY boots; owner calls are observable without duplicate implementations. | Direct cross-module state mutation or duplicate owner created for convenience. |
| F-R07 | 7_PERFORMANCE | Runtime performance owners + central scheduler | **UNPROVEN** | Measure actual integrated island on target device; apply bounded LOD/instancing/update budgets and Clay distance strategy only where evidence requires. | Persist FPS/frame-time, draw calls, visible tris/material counts and no runaway allocations during Ground/Drive/Flight traversal. | Claiming performance from headless/preview only; optimizing the wrong endless-world architecture. |
| F-R08 | 1_FOUNDATION | Runtime + optional AI adapter | **READY_RULE_UNPROVEN_STACK** | Keep all required boot, movement, Residents' routine/activity and world reactions deterministic without mandatory LLM latency. | Cold boot and representative loop pass with AI adapter unavailable/disabled. | LLM required for movement, save/reload, routine activity, world boot or acceptance. |
| F-R09 | 2_PLAYER_GOLDEN | Single Ground movement/input owner | **READY_INPUT** | Reconcile current Ground consumer to binding controls without second listeners/writers. | Normal-input capture proves W/S forward/back, A/D turn, Q/E strafe, Shift sprint, Space jump, RMB camera, wheel zoom. | Parallel movement writer or historical control scheme silently reintroduced. |
| F-R10 | 2_PLAYER_GOLDEN | Motion SSOT #344 + Ground locomotion consumer | **ACCEPTANCE_TUNE** | Tune consumer speeds/playback from measured clips so default is Jog, Shift is faster Sprint, slow walk is deliberate, Backward is useful and stride-matched. | Continuous normal-input video at gameplay camera shows no visible skating/double-step; measured contact/cadence remains synchronized at each speed. | Speeding the root independently of gait; treating current Motion source readiness as runtime acceptance. |
| F-R11 | 2_PLAYER_GOLDEN | Motion SSOT + Ground physics/jump consumer | **ACCEPTANCE_TUNE** | Bind Jump_Start take-off to actual impulse, ballistic air to real trajectory, Jump_Land to actual support contact; add readable cartoon anticipation/compression. | Repeated jumps from idle and Jog/Sprint show anticipation→take-off→air→landing with no apex hold, pop, foot slide or early/late landing clip. | Scripted up/hold/down motion or animation timeline detached from physics. |
| F-R12 | 2_PLAYER_GOLDEN | Single camera owner | **KNOWN_FAIL_6_5** | Repair camera against current simple island Ground/Drive/Flight routes before reintroducing extreme spiral geometry. | Fresh critic normal-input traversal scores >=8.5 and records no head/geometry clipping, wrong-level track view, forced disorientation or lost subject. | Passing technical occlusion/up-vector probes as product camera acceptance. |
| F-R13 | 2_PLAYER_GOLDEN | Travel Globe Flight owner consumed by WB2 player/mode bridge | **READY_DONOR_ADAPT** | Reuse Travel flight physics/camera and accepted double-Space intent; mount same avatar/equipment presentation without second Flight solver. | Ground Jump on first Space; second fresh Space within 400 ms requests Flight; take-off, cruise, climb, descend, hover, boost, bank and intentional safe landing all work. | New flight physics/controller; both Ground and Flight listening/writing simultaneously. |
| F-R14 | 2_PLAYER_GOLDEN | Single mobility/activity arbitration owner | **ADAPT** | Unify explicit ownership tokens/handoffs for Ground, Drive, Flight, Dialogue and Activity using existing mode bridges. | Instrumentation shows exactly one authoritative movement and camera owner every frame through Ground→Drive→Ground→Flight→Ground and interaction transitions. | Implicit listener competition, teleport handoffs or duplicate camera writers. |
| F-R15 | 2_PLAYER_GOLDEN | Track Core construction + Joyride presentation + Surface Truth | **ADAPT** | Route ordinary road and race/fun section through Track Core profiles/sockets/contact, with Joyride visible adapter and Surface reconciliation. | Source-isolated Joyride donor and integrated road compare convincingly; road contact/support is Track-Core-derived and visually reads as KFB/Joyride. | Bespoke Bézier road owner, technical Track slab as final look, custom fallback plate accepted silently. |
| F-R16 | 2_PLAYER_GOLDEN | World route planner → Track Core → Surface Truth | **MISSING_INTEGRATED_PROOF** | Build one simple island loop with POI/village street or sidewalk, bridge/water crossing and modest race/fun segment. | Walk/Drive normal-input traversal completes loop and crossing without seam, folding, unsupported bridge end or camera-critical geometry. | 720° spiral/Race-Tube spectacle used to prove basic island road viability. |
| F-R17 | 2_PLAYER_GOLDEN | Existing Vehicle/Drive owner with Joyride donor | **KEEP_PLUS_TUNE** | Integrate current Drive on authored route; repair steering/collision/recovery only to the level needed for stable normal traversal. | Enter, accelerate, brake, reverse, steer, collide ordinarily, recover and continue driving; no stuck/tunnel/mode-corruption defects. | Calling historical J17/J14 physics final; rebuilding a second vehicle engine. |
| F-R18 | 2_PLAYER_GOLDEN | Mobility bridge + existing Ground/Drive/Flight owners | **MISSING_INTEGRATED_PROOF** | Preserve avatar/world pose, heading and safe support across Ground↔Drive and Ground↔Flight handoffs. | Continuous video performs Ground→Drive→Ground→Flight→Ground without teleport, duplicate input, orphan vehicle/avatar or camera discontinuity. | Separate mini-game scenes masquerading as seamless modes. |
| F-R19 | 3_EARLY_GOLDEN | KFB Clay presentation owner; family-specific source owners retained | **MISSING_INTEGRATION** | Apply K1/H0 Golden + K2/v10 routing per asset family with distance-scaled treatment and correct shadow/contact. | Source→Clay-adapted→integrated isolation evidence for terrain, road, building/prop and character sample; critic sees one KFB clay world. | Default KayKit material, universal one-size shader or clay_floor_001 stand-in promoted as final. |
| F-R20 | 3_EARLY_GOLDEN | Visual QA / current KFB Clay + source owners | **READY_RULE_NEEDS_GATE** | Apply Claybound compatibility review to every new/adapted custom family before integration. | Each family passes form/material/palette/contact/silhouette/scale/diegesis checks and does not read as imported from another game. | Boardgame/paper/fabric/custom asset accepted merely because available or easy to generate. |
| F-R21 | 3_EARLY_GOLDEN | Asset Librarian / provenance gate | **ADAPT** | Require original source-family isolation before visual adaptation and integration; retain source IDs/pins. | Evidence shows original source alone, adapted source, close identity proof and integrated view for every material visible family. | Loaded URL, filename or donor name used as proof the intended design survived. |
| F-R22 | 3_EARLY_GOLDEN | World recipe/content placement owner | **UNPROVEN_VISUAL** | Compose sparse/medium authored clusters and landmarks using hierarchy/negative space instead of uniform procedural scatter. | Gameplay-camera views show clear FG/MG/BG, routes/clearings, distinct zones and living-toy composition; critic >=8.5. | Bag-of-props scatter, long generic blocks or density used as substitute for composition. |
| F-R23 | 3_EARLY_GOLDEN | Surface Truth + content placement + visual QA | **MISSING_GATE** | Combine physical snap with local transition treatment: terrain/vegetation/material overlap, root/rock support and authored clusters. | Close and gameplay-distance evidence shows zero floating/sunk props and no sticker-like base seams on representative rock/tree/building/landmark. | y=groundAt alone treated as visual grounding. |
| F-R24 | 3_EARLY_GOLDEN | Existing Sky/Skydome/Environment owner | **ADAPT** | Consume one existing Environment owner and align island lighting/atmosphere/cloud presentation with KFB/Claybound look. | Day/environment state persists and critic sees coherent light, shadow, atmospheric depth and sky; no duplicate environment controller. | Second sky runtime or generic background color substituted for existing owner. |
| F-R25 | 3_EARLY_GOLDEN | Signature/Landmark adapter + source owner | **MISSING_INTEGRATION** | Choose one strong source-proven landmark family and integrate it through Claybound/source-isolation/grounding gates. | Landmark reads at distance and close range, grounds physically, survives save/reload and gives island a distinct silhouette. | Mandatory Life Tree, weak procedural centerpiece or unsupported giant prop. |
| F-R26 | 3_EARLY_GOLDEN | Surface/water presentation owner | **MISSING_INTEGRATION** | Implement one representative coherent water/river/coast/edge seam owned by Surface Truth and current visual presentation. | Ground/Drive/Flight views show coherent water contact, bridge/shore relation and island edge with no dangling band, z-fighting or unsupported waterfall ribbon. | Decorative ribbon/plane glued to terrain. |
| F-R27 | 4_AUTHORING_PERSISTENCE | Existing WB2 authoring/editor owner | **ADAPT** | Expose PLAY/BUILD/GOD in same runtime and preserve mode handoff without second editor. | Continuous session enters Build/God, edits world, returns to Play with player/collision/state intact. | Separate authoring app whose result is not the played world. |
| F-R28 | 4_AUTHORING_PERSISTENCE | Asset Librarian + WB2 editor/placement | **ADAPT** | Require source-isolated asset selection and real PLACE/MOVE/ROTATE/SCALE/SNAP through existing editor. | Place one pinned source object, transform/snap it, save/reload and retain source identity + exact transform. | Generic stand-in object or placement before source isolation is complete. |
| F-R29 | 4_AUTHORING_PERSISTENCE | WB2 terrain sculpt / Surface Truth | **ADAPT** | Serialize native ordered raise/lower strokes with validation and reconcile final evaluation order with Track-fit policy. | Overlapping raise/lower strokes replay exactly at stored precision after fresh reload; visible mesh, support and collider agree. | JSON-only delta claiming Save PASS without geometry/collider replay. |
| F-R30 | 4_AUTHORING_PERSISTENCE | Single WB2 persistence owner | **PARTIAL_MISSING_MODEL** | Persist Base Recipe, Canon/Authoring Override, Dynamic State and Player Overlay as distinct layers keyed by stable identity. | Editing/regeneration does not erase Canon overrides; dynamic/transfer/damage/build states roundtrip without conflating semantics. | One mutable scene blob where procedural regeneration silently overwrites authored truth. |
| F-R31 | 4_AUTHORING_PERSISTENCE | WB2 Scene/Store + recipe persistence | **MISSING_PRODUCT_PROOF** | Save complete pinned island document/RouteRecipe/sculpt/object/state; fully unload; fresh import/reload and replay. | Canonical export identical at named precision and visual/collider/support/authoring state matches; invalid import preserves last-known-good. | Same-session reload, registry-only equality or current-source lookup counted as exact persistence. |
| F-R32 | 5_REQUIRED_SYSTEMS | Existing Resident/Atlas owner | **ADAPT** | Integrate two real source-proven 3D Residents into one POI/activity/reaction loop using current state/POI semantics. | Residents persist, navigate/act/react visibly and recover to meaningful activity without requiring LLM. | Static decorative NPCs or generic substitute models. |
| F-R33 | 5_REQUIRED_SYSTEMS | Existing ChatterBox + EyeRig v6 + PetMouth + Resident owners | **TUNE_DONOR** | Consume real 3D Residents/Card context and current ChatterBox kernel; close EyeRig/PetMouth/real-Card and presentation fallback gaps. | One meaningful dialogue/Triplet/reaction in-world with real resident presentation, valid silence, no PNG/cutout/card-placeholder path. | Promoting PR357 wholesale as finished runtime or inventing second dialogue engine. |
| F-R34 | 5_REQUIRED_SYSTEMS | Canonical Card + Almanac owner | **ADAPT** | Integrate one canonical Card acquire/inspect/provenance record and Almanac representation into island context/persistence. | Acquire/inspect real card, verify canonical artwork/provenance, save/reload and re-open Almanac record intact. | Copied image with no canonical receipt/provenance relation. |
| F-R35 | 5_REQUIRED_SYSTEMS | Existing Billboard/MediaSurface + HyperNormalisation owner | **MISSING_CONSUMER** | Wire actual Billboard compositor/scheduler to real read-along/HyperNormalisation content loop in-world. | Billboard shows real source-backed media/quote sequence through actual consumer, responds/persists as designed and survives world reload. | Claude-coded placeholder image/texture or fake billboard panel. |
| F-R36 | 5_REQUIRED_SYSTEMS | Quote Curator PR354 data → Billboard consumer | **READY_DATA** | Select a bounded mapped/context-compatible subset from the researched pool and feed quote IDs/provenance/rights/FrizzleQuestion/Brain-Food to consumer. | Runtime quote rotation resolves source records exactly; no unverified quote promoted; repetition policy avoids immediate author/era/tone collapse. | Invented filler quotes, stripping provenance/rights, or bulk-mapping all 415 during runtime integration. |
| F-R37 | 5_REQUIRED_SYSTEMS | KFB Audio owner / PR365 module + tiny World adapter | **TECHNICAL_GREEN_ADAPTER_MISSING** | Inject existing AudioContext/SCORE destination and send only serialized world context/events to Audio module. | One environmental/POI transition with runtime-verified family, no second AudioContext/graph, no browser errors and TTS ducking authority retained. | World-side duplicate stem/BPM tables or independent mixer. |
| F-R38 | 5_REQUIRED_SYSTEMS | Signature/Landmark adapters + Theatre Curtain accepted donor | **MISSING_INTEGRATION** | Integrate signature/transition seam and attach accepted Curtain module compatibly; apply Claybound/KFB visual tune without replacing cloth kernel. | Curtain/loading or reveal transition works in actual game route and hands to island runtime cleanly; landmark/transition persists no duplicate UI/world owner. | Fake plaque/wordmark/SVG overlay or old rejected CPU curtain substituted. |
| F-R39 | 3_EARLY_GOLDEN | Integrator + independent visual/physical critic | **PROCESS_GATE_READY** | Run before feature fan-out on actual runtime once Player/Surface/Joyride/Clay/Sky/landmark/water core exists. | Fresh critic-owned screenshots/video certify island silhouette, contact, locomotion, road, water/bridge, landmark, Clay/Sky/light and first-frame composition >= required threshold. | Continuing broad integration on a visibly wrong foundation. |
| F-R40 | 3_EARLY_GOLDEN | Independent QA using Prototype Graveyard | **READY_REFERENCE** | Encode known failure classes into rubric and compare candidate against negative Goldens. | Critic explicitly checks and reports no engineering-slab roads, ribbon water, fake compulsory tree, player penetration, sparse scatter, contamination or pasted props. | Treating known historical fail pattern as cosmetic/nit. |
| F-R41 | ALL_PHASES | Production Guard + module owners | **READY_RULE** | Enforce real owner/real content at each integration row. | Source manifest shows no placeholder path satisfying a required row; critic verifies visible/runtime consumer is the intended owner/content. | Any placeholder, generic replacement branding/UI/content, dummy audio/media or substitute source passed as integration. |
| F-R42 | 8_CRITICS | Fresh-context independent module critics | **NOT_RUN** | Run read-only critics on required subsystems after integrated implementation, using actual app, normal inputs and critic-owned evidence. | Persist critic identity/prompt/head/video/screenshots/raw scores; every required dimension >=8.5 or explicitly repaired. | Builder self-score, builder screenshots as sole basis, or Georg used as debugger. |
| F-R43 | 9_WHOLE_PRODUCT_CRITIC | Different fresh whole-product critic | **NOT_RUN** | Drive one continuous product route through movement, Drive, Flight, living/media, authoring, save/unload/fresh reload and return to Play. | Critic-owned continuous video + evidence covers full gauntlet on exact candidate head with no required score below threshold and zero unexplained errors. | Averaging module PASSes into whole-product acceptance. |
| F-R44 | 10_PRODUCT_GATE | Production Guard + Georg final product authority | **RULE_READY_MATRIX_NOT_GREEN** | Aggregate only actual accepted proofs from F-R01–F-R43; no row may be inferred green. | Machine-readable matrix shows every REQUIRED row GREEN at named proof; only then candidate is routed to Georg as MVP candidate. | Near-MVP, Receiving-Core MVP, mostly-complete MVP or score averaging over a red row. |

### Operational rule

- `READY_*` means a donor/rule exists; it does **not** mean the product row is GREEN.
- `ADAPT` / `MISSING_*` / `TUNE_*` identify the smallest integration seam currently known.
- Only evidence from the actual receiving product can flip `status` from `NOT_GREEN` to `GREEN`.
- A fresh executor must resume by row ID and phase; it must not replace the frozen product contract with a shorter implementation checklist.
