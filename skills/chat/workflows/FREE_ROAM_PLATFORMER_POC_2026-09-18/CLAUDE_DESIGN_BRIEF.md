# KFB Free Roam · Platformer Hub POC · Claude Design Brief

> **CURRENT RECOVERY OVERRIDE · 2026-09-18:** The first Claude Design Project-Island composition is **STRUCTURAL / VISUAL FAIL** as a kit reconstruction, while viewer/UI/camera code may remain donor material. Before any further Project Island polish, Claude Design must follow [PLATFORMER_KIT_MENTAL_MODEL.md](PLATFORMER_KIT_MENTAL_MODEL.md) and [CLAUDE_DESIGN_RECOVERY_REBRIEF.md](CLAUDE_DESIGN_RECOVERY_REBRIEF.md): **Asset Atlas S0 → source Preview reconstruction S1 → measured platform grammar S2 → movement S3 → actor adapters S4 → Project Island S5**. Audio is frozen/out of scope for this recovery pass.

**Date:** 2026-09-18  
**Status:** DESIGN / IMPLEMENTATION BRIEF · CLAUDE DESIGN EXPORT ONLY  
**Target public family:** `https://kayfabizarro.pages.dev/kfb-hub/free-roam/`  
**Important:** Claude Design cannot push to GitHub. Deliver a clean ZIP + preview. Web Lead integrates later.

---

## 0 · Product idea

Build a browser-first **KFB Free Roam Platformer Hub POC**.

The player jumps from platform to platform through a playful floating KFB “project island” world. The same application is both:

1. a small platformer game / animation laboratory;
2. a visual entry point into KFB Hub projects, tools and characters.

Two player-facing modes share one level, one collision world and one animation system:

### CHILL & FUN

Low-fail, low-friction exploration.

- highlight one or more plausible next landing platforms;
- generous coyote time / jump buffering;
- optional assisted jump arc;
- automatically choose a suitable jump presentation from the current actor’s verified animation adapter;
- if the player misses badly, rescue/return to the last safe platform instead of a punitive fail loop;
- focus on movement feel, character acting and discovery.

### KFB GAME MODE

Manual platforming on the same geometry.

- player owns approach speed and takeoff;
- hazards/pickups/checkpoints may matter;
- falling returns to the last checkpoint/safe platform;
- no hard “game over” requirement for the POC;
- challenge comes from platform spacing, timing, hazards and route choices.

The mode switch changes **assist policy / scoring / fail handling**, not the underlying actor source, animation owner or platform collision world.

---

## 1 · Existing Free Roam must not be overwritten

Current public Free Roam already exists and is tested:

`https://kayfabizarro.pages.dev/kfb-hub/free-roam/`

Current published vehicle candidate:

`fr-s04-01`

It is a Drive / reverse / Travel-contact POC with separate versioning and evidence.

Claude Design must **not** replace, edit or reinterpret that public source.

Build this as a standalone candidate package, proposed product id:

`KFB_FREE_ROAM_PLATFORMER_POC_v0`

Later the Web Lead decides whether it becomes:

- a new `versions/<id>/` release;
- the visual front layer of the Free Roam navigator;
- or a sibling route.

No direct publish claim from Claude Design.

---

## 2 · Primary asset source · exact Platformer pack

Primary geometry / mechanics source:

```text
georg-doc/kayfabizarro
media/3D_Assets/Platformer Game Kit - Dec 2021/
```

Current KFB source pin at brief creation:

`e4ed1625c6c783e7fe900026daab37c8df394c5c`

Use that exact source identity in the package manifest.

Important identity boundary:

The KFB Registry contains this as structural pack:

`platformer-game-kit-dec-2021`

Do **not** relabel it as the current official KayKit Platformer Pack. Existing KFB documentation says current-pack equivalence is unresolved.

### Useful source families already present

- Character
- Cubes
- Enemies
- Level and Mechanics
- Modular Platforms
- Nature
- Powerups and Pickups

The source tree currently contains 113 glTF files.

Examples useful to the POC:

- modular grass/dirt platform pieces;
- Bouncer;
- bridges;
- cannon / cannonball;
- door / lever;
- fences;
- Goal_Flag;
- Hazard_Saw;
- Hazard_SpikeTrap;
- Spikes;
- SpikyBall;
- stairs;
- pipes;
- tower;
- Coin;
- Gems;
- Heart;
- Key;
- Star;
- Thunder;
- Platformer enemies: Bee, Crab, Enemy, Skull.

Use primarily this pack for the **world / platform / mechanics visual language**.

Do not replace it with unrelated generic assets just because they are easier.

---

## 3 · Default Platformer actor · real embedded clips

Default source:

`media/3D_Assets/Platformer Game Kit - Dec 2021/Character/glTF/Character.gltf`

The file has a real skinned armature and these embedded animation clips:

```text
Death
Duck
HitReact
Idle
Idle_Gun
Idle_Shoot
Jump
Jump_Idle
Jump_Land
No
Punch
Run
Run_Gun
Run_Shoot
Walk
Walk_Gun
Wave
Yes
```

This actor is the **reference control** for the first working platformer.

The application must be playable with this actor even if every external KFB actor fails to load.

Do not rename or invent additional source clips.

---

## 4 · KFB actors · Project-Island breadth, not a reduced demo roster

The long-term KFB idea is not a five-character demo.

The selectable / inhabitable cast should be **registry-driven and extensible**, reflecting the Project Island direction:

- KayKit characters and residents;
- Skeleton / Worker / NPC families;
- “enemy-looking” figures may also be residents / interactable characters;
- Resident Atlas cast;
- KFB-specific actors / rigs.

Do not hardcode a permanent small roster.

For performance:

- lazy-load roster entries;
- mount only the selected player plus a bounded number of visible NPCs;
- dispose mixers / faces / loaders correctly;
- do not preload every KayKit character into memory.

### First required actor proofs

The exported POC must prove at least:

1. Platformer default Character;
2. one ordinary KayKit / Resident Atlas biped;
3. FrizzleBob / Graft;
4. CapsuleCarl.

Additional residents may appear as static/idle platform inhabitants if their real sources load correctly.

---

## 5 · FrizzleBob · use the public KFB Rig Embed v3 reader

Do not recreate FrizzleBob’s eyes, face or rig manually.

Public donor:

`tools/KFB-ToolBox/kfb-rigs-embed-v3/`

Read first:

`EMBED_KFB_RIGS_v3.md`

Required reader:

```text
frizzlegraft-v1/graft-mount.v1.js
→ mountGraft()
```

Contract:

`contracts/kfb-pet-graft-driver.v4.json`

The embed reader returns the complete figure / face / EyeRig / mouth / update lifecycle.

For gameplay animation, prefer:

`animation:'host'`

so the Platformer runtime owns exactly one animation mixer and can drive the verified KayKit motion clips.

Motion source family:

```text
media/3D_Assets/KayKit_Character_Animations_1.1/
Animations/gltf/Rig_Medium/
```

Relevant sets include:

- MovementBasic
- MovementAdvanced
- General
- Simulation
- Tools
- CombatMelee
- CombatRanged
- Special

Do not assume clip compatibility merely from naming. Build an actor adapter and report what actually binds.

---

## 6 · CapsuleCarl · special non-biped actor

Public reader:

```text
tools/KFB-ToolBox/kfb-rigs-embed-v3/
lab-v6/carlrig-mount.v1.js
→ mountCarl()
```

Contract:

`contracts/kfb-carl-rig-v6.json`

Important:

CapsuleCarl has **no KayKit skeleton / no bones**.

Do not bind KayKit locomotion clips to Carl.

Carl movement must use a bounded procedural presentation adapter, for example:

- squash/stretch;
- hop;
- anticipation;
- airborne tilt;
- impact/recovery;
- breathing / idle.

Carl still shares the same platformer physics / world movement owner. His presentation follows gameplay state; it does not write a second position solver.

---

## 7 · Actor animation adapter · shared semantic states

Build one semantic gameplay state layer, for example:

```text
IDLE
WALK
RUN
DUCK / DIP
JUMP_START
AIRBORNE
LAND
HIT
EMOTE
```

Each actor adapter maps those states to **real supported presentation**.

### Platformer Character

Use its own embedded clips.

### KayKit Rig_Medium / residents

Use only verified compatible clips from the real animation sources.

Do not assume:

`Walking_A → Walking_B → Running_A → Running_B`

is automatically a speed ladder.

That remains an explicit movement experiment.

Likewise, use `Jump_Full_Short` / `Jump_Full_Long` only if the selected actor/source actually contains and binds them.

### Carl

Procedural presentation only.

### Manual Motion Lab

Keep a small collapsible diagnostic drawer:

- actor;
- current semantic state;
- current actual clip / procedural presentation;
- manual clip dropdown where available;
- playback speed;
- current horizontal speed;
- airborne / grounded;
- assisted target id.

Manual clip selection is a diagnosis tool, not the normal gameplay controller.

---

## 8 · Controls

Default POC should preserve KFB learnings rather than silently redefine every input.

Suggested first preset:

```text
W / S      forward / back
A / D      turn
Q / E      strafe
Shift      run / faster movement
Space      jump
Ctrl or C  duck / dip where supported
LMB drag   free orbit
wheel      zoom
RMB        look / camera interaction only if it does not conflict
F          recenter camera
R          rescue / return to last safe platform (diagnostic)
```

If Claude Design strongly prefers camera-relative WASD for the Platformer feel, implement it as a second explicit input preset:

`PLATFORMER_CAMERA_RELATIVE`

Do not silently change the shared default.

Display controls in one compact help overlay.

---

## 9 · Free orbit camera

Required:

- third-person target-follow camera;
- full user orbit;
- zoom;
- recenter;
- preserve orbit while actor moves;
- no automatic 180° flip when landing or changing direction;
- camera does not own player movement.

For the POC, full collision avoidance is optional.

But camera must not clip so badly that jump readability becomes unusable.

---

## 10 · Platform graph and jump model

Represent platforms as explicit nodes with:

- id;
- world transform;
- walkable bounds;
- landing bounds;
- neighbours / plausible jump candidates;
- optional project portal;
- optional resident / pickup / hazard;
- style/theme.

Do not rely only on visual distance guessing every frame.

### Plausible jump target score

The POC may score candidate targets from:

- horizontal distance;
- height delta;
- forward cone / facing;
- current velocity;
- obstacle clearance;
- selected actor movement profile.

Expose this score in LAB diagnostics if useful.

---

## 11 · Chill & Fun jump behaviour

Goal:

**fun transitions without dexterity punishment.**

When one or more plausible targets exist:

- subtly highlight the best next target;
- optionally show 2–3 alternatives;
- Space chooses the highlighted target if assist is enabled;
- actor turns/anticipates;
- use a computed jump trajectory;
- synchronize animation phases to takeoff / airborne / landing;
- guarantee landing only while the target remains valid;
- if the target becomes invalid, cancel or revert safely;
- rescue on fall to last safe platform.

The assist should not teleport instantly.

The player should still see:

```text
anticipation
→ takeoff
→ visible arc
→ airborne acting
→ landing
→ recovery
```

### Optional “Flow Hop”

A secondary Chill option may automatically nominate the next plausible target after landing.

Do not make the whole game autoplay by default.

---

## 12 · KFB Game Mode

Same world / actors / clips.

Differences:

- no guaranteed target landing;
- player controls approach and takeoff;
- platform geometry and hazards matter;
- pickups / checkpoints active;
- falling respawns;
- optional score / time / route progress.

First POC mechanics may use the existing Platformer pack:

- Coin / Gems / Star;
- Heart as recovery/bonus;
- Bouncer;
- spikes / saw;
- simple enemies;
- Goal_Flag / door / key.

Do not add a giant combat system.

Punch / HitReact may be demonstrated if already available, but Combat Arena remains the owner of real combat semantics.

---

## 13 · Hub / Project Island layer

The world should visually function as a **KFB Project Hub**.

Use a central safe project island / platform cluster plus satellite platforms.

Potential platform/portal themes:

- World / Travel;
- Free Roam / Drive;
- Stunt Race / BOX1;
- Resident Atlas;
- World Atlas;
- ToolBox / Animation;
- Combat Arena;
- later OSM City pilots.

The actual Web Lead will reconcile URLs during integration.

In Claude ZIP, keep links in a candidate data file, e.g.:

`data/hub-portals.json`

Do not scrape the public Hub as runtime source.

### Portal interaction

A platform may have:

- title/sign;
- project icon / simple label;
- resident;
- pickup;
- portal / button.

Player-facing UI must be English.

---

## 14 · Character selection / Project Island cast

Provide a compact actor picker that can stay collapsed during play.

Minimum categories:

```text
Platformer
KFB
Residents
KayKit
Legacy
Special
```

Roster data should be manifest-driven.

Use explicit GitHub SourceRefs.

Do not permanently reduce the available cast to the four smoke-test actors.

Project-Island principle:

**all KayKit characters / packs may become KFB inhabitants, not just combat enemies.**

The Platformer POC may show a bounded subset at one time, but the data architecture must remain expandable.

---

## 15 · Platformer pack level language

Use the 2021 Platformer pack first.

Suggested visual structure:

- Grass/Dirt modular platforms;
- bridges;
- stairs;
- pipes;
- bouncers;
- cubes / crates / question and exclamation blocks;
- floating nature islands;
- small towers / doors / levers;
- pickups;
- selected hazards.

Create a visually coherent 3D layout.

Do not turn it into a flat 2D side scroller.

Use height, curved camera paths, overlapping depth layers and platform clusters.

---

## 16 · Visual direction

KFB style:

- clean low-poly;
- readable silhouettes;
- playful scale variation;
- warm/cool platform clusters;
- restrained fog / depth;
- simple readable lighting;
- cartoon timing;
- no generic neon sci-fi UI;
- no visual clutter over gameplay.

The UI should evolve from the **existing Free Roam navigator’s clarity**, but the game remains visually dominant.

Avoid a permanent engineering dashboard.

Diagnostics go into one collapsible LAB drawer.

---

## 17 · Sound / VFX

Keep minimal and modular.

Allowed first POC:

- jump;
- land;
- pickup;
- bouncer;
- rescue;
- portal;
- subtle ambient/music loop if already available from KFB source.

VFX:

- landing puff;
- pickup sparkle;
- target highlight;
- jump trail only if subtle;
- portal response.

Do not create a second permanent KFB audio engine.

Return SFX/VFX as event mappings, not gameplay owners.

---

## 18 · Save / persistence for the POC

Local candidate state may persist:

- selected actor;
- selected mode;
- last safe platform;
- unlocked/collected POC pickups;
- camera preference;
- input preset.

Namespace it explicitly, e.g.:

`kfb.free-roam.platformer-poc.v0`

Never call `localStorage.clear()`.

Do not claim compatibility with Travel/Race saves.

---

## 19 · Required implementation slices inside the Claude project

### P0 · Platformer default actor

- scene;
- platforms;
- collisions;
- free orbit;
- walk/run/duck/jump/land;
- Chill assist;
- Game mode;
- rescue.

### P1 · KFB actor adapters

- FrizzleBob Graft;
- CapsuleCarl;
- one Resident/KayKit biped;
- actor switch without duplicate mixers / faces.

### P2 · Hub layer

- project platforms / portals;
- actor picker;
- pickups;
- compact Hub UI;
- recovery/back links represented as candidate data.

Do not start broad combat, vehicles, OSM or Travel integration inside this Claude package.

---

## 20 · Tests expected in Claude preview

Report actual tests separately.

At minimum:

### Boot

- cold start;
- WebGL visible;
- no uncaught errors.

### Default Platformer actor

- Idle;
- Walk;
- Run;
- Duck;
- Jump;
- Airborne;
- Land;
- manual clip dropdown.

### Platforming

- 10 assisted Chill jumps;
- at least 5 manual Game-mode jumps;
- low→high;
- high→low;
- short gap;
- longer gap;
- fall + rescue;
- Bouncer.

### Camera

- orbit while idle;
- orbit while moving;
- zoom;
- recenter;
- narrow viewport.

### Actors

- Platformer Character;
- FrizzleBob;
- Carl;
- one resident biped;
- switch actor repeatedly;
- no duplicate mixer / face / requestAnimationFrame owner.

### Modes

- Chill→Game→Chill without reload;
- same platform graph;
- no stale assisted target after mode change.

### Lifecycle

- blur / focus;
- pause;
- reload;
- restore selected actor/mode;
- disposal of replaced actor.

Not run = NOT_TESTED.

---

# 21 · ZIP EXPORT CONTRACT · VERY IMPORTANT

Claude Design cannot push to GitHub.

Final deliverable is:

`KFB_Free_Roam_Platformer_POC_v0_EXPORT_2026-09-18.zip`

## Include

```text
KFB_Free_Roam_Platformer_POC_v0/
  START_HERE.md
  README.md
  index.html
  src/
  data/
  docs/
    ARCHITECTURE.md
    ASSET_MANIFEST.json
    ACTOR_ADAPTERS.md
    TEST_REPORT.md
    KNOWN_ISSUES.md
    RECOVERY.md
  tests/
  EXPORT_MANIFEST.json
  FEATURE_PARITY.md
  CHANGELOG.md
```

Include all editable source needed to run the candidate.

## Do NOT include ballast

Do not include:

- `node_modules/`;
- package caches;
- build caches;
- duplicated `dist/` if source itself is directly runnable;
- duplicate copies of KayKit / KFB model assets already on GitHub;
- duplicate animation libraries;
- font binaries;
- videos unless specifically required as test evidence;
- dozens of screenshots;
- source ZIP inside the export ZIP;
- stale predecessor projects;
- unrelated Claude metadata;
- Birthday material;
- OSM / Race / Travel source trees.

If a generated screenshot is useful, include at most a very small evidence set and list it in the manifest.

## Existing assets

All existing KFB/KayKit assets remain remote GitHub SourceRefs.

The export manifest must list:

- repo;
- path;
- revision / pin;
- role;
- whether loaded successfully in preview.

If Claude creates any genuinely new visual/audio asset not already on GitHub:

put it under:

`NEW_ASSETS_FOR_GITHUB_IMPORT/`

and list it explicitly in `EXPORT_MANIFEST.json`.

Do not silently treat Claude-generated assets as canonical.

## Export honesty

Return:

```text
SOURCE
DECISION
IMPLEMENTATION
TESTED RESULT
EXPORT
PUBLIC DEPLOYMENT
GEORG ACCEPTANCE
OPEN
ARCHIVED HISTORY
```

`PUBLIC DEPLOYMENT` should be `NOT PERFORMED` unless Claude truly has one.

`GEORG ACCEPTANCE` remains `OPEN`.

---

## 22 · Final return to Georg

Provide:

1. ZIP download;
2. browser preview;
3. exact entry HTML;
4. export file count + size;
5. source completeness statement;
6. GitHub asset source list;
7. actor adapters actually tested;
8. gameplay states actually tested;
9. Chill/Game tests actually run;
10. mobile/narrow status;
11. known gaps;
12. no-GitHub-push statement.

No terminal instructions for Georg.

---

## 23 · Non-goals

Not in this Claude slice:

- replace existing Free Drive;
- global Travel integration;
- Walk↔Drive;
- full Combat Arena;
- full OSM city;
- all 43 vehicles;
- platformer multiplayer;
- giant quest system;
- universal animation engine;
- new Asset Registry;
- full Project Island canon implementation.

This POC should produce **modular movement/animation/camera/platforming evidence** that later feeds the real KFB integration.


---

## 24 · Optional later donor · Living Plant scenic actors

The prepared Plant Prop Lab may later supply scenic modules to Project Island:

`skills/chat/workflows/PLANT_PROP_LAB_2026-09-18/START_HERE.md`

Possible uses:
- giant potted botanical landmarks;
- alien Quaternius plant compositions;
- ambient swaying plant props;
- EyeRig-based “aware” plants that blink/look at the player;
- plant clusters marking project portals or jump destinations.

This is **not required for the current Platformer POC export**.

If later consumed:
- use exact GitHub PlantRecipe/package refs;
- do not fork EyeRig;
- plant animation remains presentation over Platformer/world state;
- do not turn every scenic plant into a gameplay character;
- platform support/collision remains owned by the Platformer/consumer world.
