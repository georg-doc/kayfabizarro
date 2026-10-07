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
