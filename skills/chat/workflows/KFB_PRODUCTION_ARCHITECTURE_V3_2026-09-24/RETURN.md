# RETURN · KFB Production Architecture v3 · IK / execution dispatch / WSA mount prepared · 2026-09-24

Status: **ARCHITECTURE CANDIDATE READY · 13 STRANDS / 79 JOBS · 158/158 PASS · UNMERGED · NO LIVE PROMOTION**

## Exact state before this Return write

- Repo: `georg-doc/kayfabizarro`
- Branch: `chatgpt-web/production-architecture-v3-2026-09-24`
- Draft PR: **#204**
- Base: `main@9431dcb8da0158a75d0988d52fc1e7a49aac21f1`
- validated architecture/source checkpoint: `aaf2c6b4972e78f737b8711e2a3ad5b1b1a7c062`
- pre-Return architecture head: `aae947a251231d84e62999c374d30ca39cf83ad9`
- public Stage created by this architecture slice: **no**
- Cloudflare Live promotion: **not authorized**
- existing public Hub remains: `https://kayfabizarro.pages.dev/kfb-hub/`

## Current production map

**13 primary strands · 79 copy-ready jobs · 36 READY · 43 dependency-gated HOLD**

1. ToolBox Authoring Platform
2. Animation & Residents
3. WorldBuilder / God Mode
4. Racer → World
5. Quick 3D Review
6. Combat / Duel Choreography
7. Cube Pets / Actor Identity
8. Travel Modes / World Surfaces
9. Vertical Worlds · Babel / Hex / Card Towers
10. Town / ChatterBox / Living NPCs
11. Shared Stage / Transitions / FX
12. **Card Zones / Card Objects**
13. **Player Meta / Fractal Almanac / Adaptive Interface**

Hub presentation remains strand-first with job cards collapsed by default.

## Card Zones / Card Objects

### Binding source hierarchy

**Behavior authority**
`tools/KFB-ToolBox/_inbox/KFB Card Zone Lab v2/card-zone-lab-v2-full_2026-09-22/KFB Card Zone Lab v2.dc.html`
blob `e7bb09e49b2a885eb076e8c43c0ff561a9cebb72`.

The actual source still contains:
- `buildFluidSurface`;
- `buildProjection / updateProjection`;
- `buildCardCube / refreshArtFace / snapQuat / tickCube / faceToCamera`;
- `buildStack / prepReveal / poseCard / tickReveal / tickCard / setCardSide`.

**Reusable fluid source**
`tools/KFB-ToolBox/_inbox/KFB StoryMap v1/kfb-fluid-v2/card-zone-v2-fluid-source.js`
blob `97e3e0813cb5693a64863482ab96a601e88f5104`.

StoryMap Housekeeping explicitly marks this source **AKTIV · source-locked real Card Zone Lab v2 donor · current water shader**.

**Do not promote old extraction**
StoryMap explicitly marks `kfb-fluid-v1/` **DEAD**, deleted as a diminished form of the real donor.

The older ToolBox module map remains useful seam/method evidence only.

### Preserved product modules

The new strand explicitly protects:
- animated moat / ponds / river / flow;
- mandatory real water texture path `waterdudv.jpg` + `water.jpg`;
- 3D Card Stack / Deck;
- unfold/reveal;
- Beam / projector;
- six-face Card Cube;
- Face Focus / real card/PDF/detail surface;
- card-seeded story/palette/fluid/wear/texture/moat parameters.

### Architecture

Reusable water is split conceptually into:
- **Fluid Surface** — exact shader/material/timing/flow contract;
- **Card-Zone Hydrology** — local moat/river/pond geometry/field.

Therefore WorldBuilder may use the Fluid Surface for other water without importing the whole Card Zone.

WorldBuilder places Card Zone recipes as content. It does not become the Card Zone/card-progression owner.

### New jobs

READY:
- `CZ-FLUID-01`
- `CZ-CARD-PRESENT-01`
- `CZ-CUBE-01`

Prepared:
- `CZ-RECIPE-01`
- `CZ-WORLD-01`
- `CZ-PROD-01`

The final milestone is:
```
walk/drive to Card Zone
→ animated fluid
→ real 3D stack
→ Beam/unfold reveal
→ Card Cube/Face Focus
→ collect
→ Player Journey records card
→ Almanac updates
→ reload preserves it
```

## Player Meta / Fractal Almanac / Adaptive Interface

### Data-model donor

`overworld/overworld/journey.js`
blob `ad58ef4239254f42a994ada3e729dd820fa1806c`.

It already proves:
- versioned save schema;
- migrations;
- JSON import/export;
- collected cards;
- Diary;
- reputation;
- quests;
- hero/unlocks;
- zones / semantic Journey facts.

It is reused as the **data-model donor**, not as a reason to resurrect old Overworld runtime.

### One durable Player Journey

The new cross-mode meta owner will hold/reduce durable player facts such as:
- cards/decks collected;
- Diary/events;
- quests/discoveries;
- NPC encounter/reputation facts;
- POP;
- inventory;
- song/media unlocks;
- vehicles/travel unlocks;
- gifts/rewards;
- replay/cutscene refs.

Consumers emit semantic events:
`card.collect`, `pop.award`, `inventory.add`, `gift.receive`, `song.unlock`, `race.stunt.complete`, `combat.encounter.win`.

**Authored WorldBuilder world saves remain separate from Player Journey state.**

### Fractal Almanac

The Almanac is explicitly more than Card Inventory:
- collection;
- Diary;
- Story Editor direction;
- Quest Memory;
- Replay Library;
- Progress/Journey map;
- Journey Archive;
- personal Infinite Canvas.

Ordinary gameplay direction:
**real-card Almanac fan upper-right**.

The lightweight fan opens the Almanac overlay.

The deeper/immersive Almanac may reuse the historical walked-chamber experience. Inside immersive Almanac, ordinary gameplay HUD is suppressed except minimal return/exit; its intentional non-dashboard/no-minimap quality is preserved.

### 20-slot Backpack

Georg's current product direction:
**20 visible carry slots**.

The exact old ideation source/implementation was not recovered in current GitHub/Dropbox search.

Status is honestly:
`USER_DIRECTION · HISTORICAL_SOURCE_NOT_YET_PINNED`.

This does not block implementing the current decision under the new Player Journey contract.

Cards normally go to Almanac/collection.
Physical/usable gifts/items may occupy Backpack slots.

### Universal POP

Current Travel donor:
`travel/wip/travel_globe_wsa/globe-v13/collect-hud.js`
blob `e73aec107a9d3cf811a025ccbe6b2730e21fcfe5`.

It already proves the visible card fan + local POP feedback, but its `popScore` is local runtime state.

New rule:
**durable POP belongs to Player Journey**.

Race / Combat / Travel / Town / Card Zone emit `pop.award`; the same balance is displayed across modes.

POP remains KFB progression/reaction currency, not plausibility/truth.

### Radio / music

Collected/unlocked songs, active track and media preferences become Player Meta refs/state.

Race's current Radio is a presentation donor, not a separate music account.

Game SFX ownership stays separate; Radio/media does not replace semantic SFX/audio owners.

### Adaptive HUD

Current Race HUD v3 donor:
`kfb-hub/stage/stunt-world/hud-game-v3/SOURCE.json`
blob `affb1ba1d175351fa5d7b30474afb4c421f4dd83`.

Useful donor rules:
- Tacho retained;
- Radio = large controls + volume;
- Almanac = real landscape Cards;
- Minimap = actual Race route only.

New shell is provider-based.

Examples:
- WALK/WORLD → Almanac + POP + Backpack + compact Radio + optional real world navigation;
- DRIVE/RACE → same meta plus Tacho + actual-route minimap + driving Radio;
- COMBAT → same meta reduced plus Combat-owned encounter status;
- FLIGHT/BOAT → only real implemented mode instruments/navigation;
- ALMANAC IMMERSIVE → ordinary gameplay HUD hidden.

**No fake universal minimap or filler instrument.**

### Interface grammar / authoring UI

Measured current shared Resident inline menu:
- **28×28 CSS px buttons**
- **13 px glyphs**
- symbols `✥ ⟳ ⤢ ⬓ ⊹ ✕`.

Georg finding:
functions are learned by position more than icon recognition.

New `UI-GRAMMAR-01` keeps the accepted `edit-layer.js` behavior and changes presentation only:
- context-local inline controls;
- normal ~40–44 px hit target;
- ~20–24 px recognizable icon;
- clear active state;
- tooltip = action + shortcut;
- optional labels in learning/expanded mode;
- same semantics in ToolBox + WorldBuilder;
- no giant permanent toolbar in the field of view.

Player HUD and authoring UI share visual tokens/icon semantics/state language, but remain distinct surfaces.

### New jobs

READY:
- `META-JOURNEY-01`
- `META-HUD-01`
- `UI-GRAMMAR-01`

Prepared:
- `META-ALMANAC-01`
- `META-INVENTORY-01`
- `META-POP-01`
- `META-RADIO-01`
- `META-NAV-01`
- `META-PROD-01`

## Validation

**158/158 architecture/source checks PASS.**

New source facts revalidated:
- Card Zone full source blob `e7bb09e49b2a885eb076e8c43c0ff561a9cebb72`;
- Card Zone CODE_MAP blob `7953203a1c3be80d719db5c62136924c8c475753`;
- exact fluid-v2 donor `97e3e0813cb5693a64863482ab96a601e88f5104`;
- StoryMap Housekeeping `f2656b5cc42539ec28bb2cc6f96b524bc8d51a64`;
- Journey donor `ad58ef4239254f42a994ada3e729dd820fa1806c`;
- Travel Card/POP HUD `e73aec107a9d3cf811a025ccbe6b2730e21fcfe5`;
- Race HUD v3 source `affb1ba1d175351fa5d7b30474afb4c421f4dd83`;
- Game Design Almanac/Lean Memory concept `f7528e5d9a54cfd71f68cab1223c1916a2cc97c2`;
- shared edit-layer `c15a200ba8615d55f9d3ae26616e0a8ceba8dc01`;
- current Resident UI `20ef6153dcd4819fb6929a3c87e0e539aecdf4a3`.

## P2 Skills / Runtime Contracts consolidation

Current planning/census source:
`SKILLS_RUNTIME_CONSOLIDATION_2026-09-24.md`.

This is a **P2 compatibility/hygiene lane**, not a fourteenth product runtime and not a blocker for current P0/P1 execution.

### Confirmed current/legacy split

- `skills/EMBED_CUBE_PET_FULL_v2.2.md` remains a valid compatibility/current recipe for the **24 canonical CubePets**, but must no longer be presented as the universal KFB actor embed.
- `tools/KFB-ToolBox/kfb-rigs-embed-v3/EMBED_KFB_RIGS_v3.md` is the current non-CubePet embed donor for FrizzleBob Graft and CapsuleCarl/Wissens-Pilli; native KayKit/GothGirl actors remain with their current FaceHost/EyeRig/profile owners.
- Current Wissens-Pilli/Carl routing preserves source-mouth cleanup, `red` mouth set, one face owner and material-zone configuration.
- Current Actor Platform direction explicitly forbids consumer-specific face/mouth/eye forks.

### Card/PDF current direction

Reuse two complementary owners rather than building a third viewer:

- `skills/kfb-card-builder.js` + Card/PDF SSOT = canonical KFB card crop/render/silhouette/Ink;
- Deck Viewer v4 + `deckviewer/kfb-corpus.js` = performant PDF loading, IndexedDB/page caches, bounded rendering and editorial presentation modes.

Viewer v4's useful existing presentation vocabulary includes Reader / Gallery / Stack / Coverflow / Full View / Deck.

The Fractal Almanac consumes that viewer/runtime and adds Journey/Hero-shot/replay context above it.

Blind exact page-quarter crop is **not** universal across KFB PDFs. Known deck metadata/default/auto-resolver owns grid offsets/gaps; consumers do not implement crop math.

### Ink

Current `kfb-ink-canon.js` `family:'band'` is already the desired continuous closed ink ring/ribbon:
one shared contour + variable feather/taper + one `fill()`.

No second “RING” Ink canon will be invented due to terminology.

Future `INK-3D-ADAPTER-01` derives:
- surface ribbons for shoreline/map/road/track boundaries;
- tube/rope extrusion for physical lines such as wrestling ropes;
- clean card outer-silhouette edges without wireframe/per-triangle/double-grid artifacts.

### Talk / bubbles / materials

The PetStudio history is not uniformly dead. Active donor behavior remains relevant for:
- visemes / current rich PetMouth;
- speech/talk timelines;
- speech/thought bubble shapes;
- idle/acting behavior.

The ToolBox final milestone now explicitly requires:
- Mouth / Viseme / Talk;
- Voice request/media seam;
- Speech + Thought Bubbles;
- Material Zone Color/Hex/Copy/Reset;
- Texture/Surface access through current material/Asset-Librarian owners;
- Card/PDF viewing where the authoring context uses card content.

Current ToolBox UI brief already documents the proper Colorpicker/Hex/Copy behavior.
Universal per-zone texture assignment remains a real implementation gap, not a solved feature.

### Registry/root hygiene

Current `skills/SOT_REGISTRY.md` is materially stale (2026-07-24) and still points general Pet embedding toward the old CubePet instruction.

Also flagged for census:
- `skills/kfb-embed-bundle/`;
- `skills/kfb-embed-bundle v3/`;
- binary GLBs sitting directly in `skills/`.

Nothing is moved or deleted until the consumer/import scan proves safety.

### Prepared P2 jobs

READY:
- `SKILLS-CENSUS-01`

HOLD:
- `SKILLS-CURRENT-01`
- `SKILLS-ARCHIVE-01`
- `CARD-VIEWER-CORE-01`
- `INK-3D-ADAPTER-01`

The Hub priority rule keeps P2 READY work out of the default Today view while P0/P1 work exists.

## Character / Resident production workflow

Current workflow source:
`CHARACTER_RESIDENT_PRODUCTION_WORKFLOW_2026-09-24.md`.

### Everyday authoring owner

Resident Atlas / ToolBox is the default surface for:
- static pose;
- Bone adjustments;
- IK/puppet hand/foot placement;
- prop fit;
- root/scene transform;
- reusable Resident scene composition;
- Studio patch save/import/export.

Current Resident Atlas S7 already proves those capabilities.

### Blender boundary

Blender MCP is now explicitly reserved for:
- genuinely new time-based motion;
- external/Mixamo retarget;
- multi-frame clip repair;
- skeleton/weights/topology changes;
- custom head/body derivatives;
- Action/NLA bake/export.

A static wrist angle, rifle fit, drum placement or scene layout is not a Blender-first job.

### Pose → Blender seam

A browser-authored Studio Patch may become the reference/key pose for Blender.

Preferred route:
```
Georg poses in Resident Atlas
→ export target/contact pose
→ Blender MCP applies it to the same skeleton as a reference
→ author only the time-varying correction
→ bake reusable Action
→ return Action to Motion Library
→ browser reuses it
```

This avoids requiring Georg to manipulate Blender bones directly.

### KayfaBizarros

Current preferred form is a **baseplate-free Resident Performance Module** rather than one monolithic stage GLB.

It references:
- accepted Orc B leader;
- accepted Orc Raider guitarist;
- Orc Brute drummer;
- Wardrum/sticks;
- optional local props;
- songRef/BPM/phase;
- action refs;
- pose patches;
- local transforms.

The host Tavern/Town/WorldBuilder scene supplies the support surface.

For the drummer:
- browser creates the accepted contact/reference pose first;
- constant correction may stay as Studio patch;
- only a genuinely time-varying correction goes back to Blender;
- automatic arm-to-drum solving remains rejected.

### Legacy

Generic “rerig Legacy” is not a valid next job.
Rig_Legacy + native clips already exist.

Blender is used only for:
- one selected custom Legacy derivative;
- an external motion missing from Legacy;
- geometry/weight repair.

Existing Legacy assembly, EyeRig, pose, props and scene authoring stay browser-owned.

### Frizzle-Orc Actor Family Factory

Prepared future Blender job:
`BLENDER-ACTOR-FAMILY-01`.

Goal:
the same visible Frizzle-Orc identity across:
- Rig_Medium;
- Rig_Large;
- Rig_Legacy.

Destination rigs remain their existing families.
Prefer head/identity grafts onto destination rigs over whole-skeleton warps.

Current blockers are only exact source pins:
- Frizzle-Orc 3 Rig-Warp;
- selected Medium/Large/Legacy bodies;
- blank Legacy/template head;
- requested accessories.

### Named marching/rifle Resident

The exact “Musknacker” actor source is not pinned under that name.
Do not silently substitute another actor.

Once pinned:
browser owns rifle fit + pose + scene.
Only a genuinely missing march clip goes through Blender/Mixamo and returns to the Motion Library.

### New jobs

READY:
- `RESIDENT-BAND-MODULE-01`
- `POSE-TO-BLENDER-01`

HOLD:
- `BLENDER-ACTOR-FAMILY-01`
- `BLENDER-MOTION-02`
- `LEGACY-CUSTOM-ACTOR-01`

Current RKIT/track Blender work is not interrupted by these jobs.

## IK parity · Three.js CCD donor

User-supplied donor:
`mrdoob/three.js/examples/webgl_animation_skinning_ik.html`.

Current KFB Resident Atlas S7 runs Three.js `0.184.0`; the same upstream CCD solver exists on the matching `r184` line.

Source comparison found a credible technical reason why the upstream example may feel more stable:

- current KFB `reachChain()` is a custom unconstrained CCD-like solver;
- the current hand chain is typically constructed proximal→distal;
- current solve has no per-link `rotationMin/rotationMax`;
- no per-step `minAngle/maxAngle`;
- no axis limitation;
- no blend factor;
- upstream `CCDIKSolver` supports all of those and its example arm chain is distal→proximal;
- upstream also contains a small-angle early-out intended to reduce vibration.

This matches the known KFB failure class where contact error improves while arm anatomy/torsion becomes worse.

Prepared READY job:
`IK-CCDIK-PARITY-01`.

Execution:
`WEB_DEEP · ChatGPT Web · GPT-5.6 Sol · high reasoning · HIGH budget`.

Required comparison:
A current KFB solver · B raw upstream CCD · C constrained upstream CCD, on the same Rig_Medium and Orc Brute sources.

The current Resident Puppet UI, shared edit-layer and Studio Patch persistence remain owners until the direct visual A/B proves a better solve path.

## Executor / model / reasoning / budget routing

Current policy:
`EXECUTION_DISPATCH_POLICY_2026-09-24.md`.

Every one of the 79 catalog jobs now carries:
- primary executor;
- stable execution profile;
- current recommended model;
- normalized reasoning level;
- budget band;
- optional secondary/escalation profile.

Current primary profile distribution:
- `WEB_FAST`: 5
- `WEB_STANDARD`: 40
- `WEB_DEEP`: 29
- `BLENDER_STANDARD`: 3
- `BLENDER_DEEP`: 2

Budget rule:
- start with the lowest profile that can actually execute the job;
- normal Web implementation = GPT-5.6 Sol Medium;
- difficult solver/physics/architecture = GPT-5.6 Sol High;
- normal Claude Design/Cowork/Blender work = Claude Sonnet 5;
- Cowork is not a default GitHub/briefing executor;
- Work is capability escalation only;
- Opus 5.5 is a named deep escalation only, not a default;
- after two failed repair passes on the same gate, stop/recover rather than escalating indefinitely.

**79/79 jobs have no Work default.**
**No catalog job uses Cowork as its primary execution profile.**

## WSA / Hub mount preparation

Prepared handoff:
`WSA_HUB_V3_MOUNT_HANDOFF_2026-09-24.md`.

Existing Hub owner remains:
- Draft PR #202;
- branch `work/hub-ctrl-01-2026-09-24`;
- current owner of the public KFB Hub / Production Desk / never-empty recovery.

Mount execution profile:
`WEB_STANDARD · GPT-5.6 Sol · medium reasoning · STANDARD budget`.

**Work is not required for the mount.**
**Cowork is not required for the mount.**

The mount must preserve two separate surfaces:

1. existing operational lanes / Today:
   LOOK_AT · RUNNING · CAN_START · WAITING · live reviews/freshness;
2. additive v3 self-service catalog:
   13 strand cards → READY/HOLD jobs → copy-ready prompt + executor/model/reasoning/budget.

Do not replace `lanes.json` with 79 jobs.
Do not create a second Hub.

Prompt text is resolved from `promptSection` in:
- `STRAND_BRIEFINGS.md`;
- `SELF_SERVICE_BRIEFINGS.md`.

The Hub should not manually duplicate 79 prompt bodies.

## Architecture-chat recovery

Prepared:
`ARCHITECTURE_CHAT_HANDOFF_2026-09-24.md`.

A replacement planning chat should read GitHub state and continue this role as:
- architecture/owner/dependency steward;
- self-service briefing maintainer;
- execution/budget dispatcher;
- WSA/Hub handoff preparer.

It should **not** become the implementation bottleneck and should not regenerate routine briefings after every completed product job.

## Public Hub boundary

The expanded **13-strand / 79-job** catalog is prepared for the existing **HUB-CTRL PR #202**.

This branch does not:
- fork Hub ownership;
- publish a second Hub;
- promote Cloudflare Live;
- merge product runtimes.

## Unresolved

- exact historical source for the old 20-slot Backpack sketch remains unpinned;
- Card Zone fluid-v2 is source-authoritative, but its reusable WorldBuilder consumer has not yet been visually accepted;
- current Race HUD v3 remains a donor/candidate, not global HUD acceptance;
- Player Journey consolidation is specified but not yet implemented;
- public Hub does not yet display the new Card Zone / Player Meta strands.

## Exactly one architecture gate

**HUB-V3-MOUNT**

Existing HUB-CTRL mounts the v3 self-service catalog additively while preserving its existing operational Today lanes. The 13 strand cards expose current READY/HOLD jobs; the full 79-job map appears only on expansion.

Product work may already start directly from the READY briefs without waiting for that public mount.
