# KFB Open World · Existing-System Integration Matrix · 2026-10-05

Status: **BINDING INPUT TO OPEN WORLD PRODUCTION RESET ONE-SHOT**
Owner: **KFB WorldBuilder / WB2 · PR #348**
Rule: **integrate proven existing KFB systems; do not replace them with stripped substitutes.**

The Open World One-Shot is not a bare terrain/village prototype.

The product must recover/build the world foundation **and close the integration seams to the KFB systems that already exist**.

## Integration classes

- **REQUIRED CORE** — must work in the final One-Shot candidate.
- **REQUIRED MODULE** — must be placeable/usable through the world/module model; not a second runtime.
- **CONSUMER/HOLD** — preserved and compatible, but does not block the Open World outcome.

---

## 1 · Player animation / locomotion · REQUIRED CORE

**Owner / SSOT**
- Motion PR #344 · `[CURRENT MOTION SSOT] KayKit-native locomotion Blender baseline`
- current PR #344 head observed: `dfb6b8a15b3f04c52f49825252fcaf60f45df51c`

**Existing WB2 consumer**
- `wb2-player.v1.js` · blob `f91c81a7c54ba447f2e8782d7e9f13164de6bba3`
- `KFB_KAYKIT_LOCO_SET_01.v1.json` · blob `7d83b294ba0422b2510bba1b53852fd0ccaba3b2`

Already present:
- Idle / Walk / Run / Sprint;
- native KayKit clips;
- speed anchors;
- one shared gait phase;
- max two neighbouring clips;
- existing jump-chain source inventory;
- learned KFB dance seam.

Existing acceptance value:
- max steady foot creep `0.044 m`;
- no pose pop / T-pose frame / double step at walk-run boundary.

**One-Shot rule**
Reconcile WB2 consumer with current Motion SSOT. Do not repick clips or replace native motion with generic procedural animation.

**Done**
Real-input walk/run/sprint/jump/camera/collision are critic-owned video evidence; no visible skating outside current measured contract.

---

## 2 · Modular Racetrack / Road / Stunt construction · REQUIRED CORE + AUTHORING MODULE

### Mechanism owner
**Track Core PR #219**
- current observed head: `3232a1070686896833d6b7942fcd631b9fa8cda6`
- one base Track Core;
- canonical slot/profile;
- RouteRecipe;
- CONNECT/socket semantics;
- Clothoid/flexible transitions;
- road/stunt/bridge/tunnel pieces delivered as data;
- geometry/contact ownership remains Track Core.

### Binding visible design
**JOYride J14 / T4 / K2**

Pinned visual donor:
`927a1b4bd2d1de6cf0479414e2e8ac1cb9d6509f`

Exact:
- `track-look.v5.js` · blob `7c0d248391c3eaf1887a0afc97ee02b25f6dec85`
- `road-markings.m1.js` · blob `68a0c21a2c68c0b7db72046146008b474979ec15`
- `transition-atlas.v1.js` · blob `cfef150a74060bfc6ff00ab049529d8710845bfc`

Visible contract:
- **one clay strand / Knetstrang** around the real drive surface;
- K2 clay material language;
- rounded clay barriers/band heads;
- Joyride marking language;
- transition atlas / patch transitions;
- no visible alpha/colour fade shortcuts;
- road/track integrated into world terrain;
- Track Core debug/engineering geometry is never final presentation.

**WorldBuilder role**
Expose modular Track pieces through the same authoring system:
- road;
- track;
- bridge;
- tunnel;
- ramp;
- loop/stunt pieces where current Track Core source supports them;
- connectors/sockets;
- RouteRecipe persistence.

The WorldBuilder **places/configures Track modules**; it does not become a second Track owner.

**Done**
A source-proven Joyride-style Track module can be placed/connected/saved/reloaded and traversed/driven in the authored world.

---

## 3 · Sky / Skydome / Environment · REQUIRED CORE + AUTHORING MODULE

**Do not create another sky owner.**

Baseline donor:
- `travel/KFB Travel Combat v25/terrain-v25/skydome-shader.js`
- current main blob `919ed27bb4ab5a6bb9b823421804d73cb5ae64bd`

Existing environment work:
- Travel sky presets / day-night / atmosphere / world moods / rain / starfield;
- SKY1/SKY3 EnvironmentHost family in
  `tools/KFB-ToolBox/_inbox/KFB Skydome Gates SKY3/KFB_SKYDOME_SKY3_SESSION_CUT_2026-10-01_r1/`

SKY3 remains source/tune evidence, not blanket accepted polish.

**WorldBuilder role**
A world recipe/environment profile can select/configure:
- sky shell;
- day/evening/night;
- weather;
- mood/palette;
- clouds;
- starfield/aurora/god-rays where current owner supports them;
- optional Spindle Sky as an Environment Element, not the terrain/world owner.

**Done**
Environment can be configured and persisted without creating a second render loop/sky owner; critic verifies horizon/seams, lighting readability and performance.

---

## 4 · Asset Librarian + direct world authoring · REQUIRED CORE

Current WB2:
- `wb2-studio.v1.js` · blob `4ede98a21053be8dfbd04f5edc7b1db646aea388`
- terrain sculpt `terrain-sculpt.js` · blob `182f7c42b709a00547a16cfe0040d5d636bdb680`

Keep:
- Asset Librarian / Registry source truth;
- source object isolation;
- place into same WB2 scene;
- shared editor;
- Move / Rotate / Scale;
- Place on Ground / Surface Snap;
- Raise / Lower;
- save/reload/import.

Expand curated placeables beyond only buildings/residents to:
- Building;
- Prop;
- Nature;
- Character/Resident Set;
- Billboard/Media;
- Track module;
- Environment/Sky profile;
- Signature module;
- performance/mini-scene.

No second Asset Librarian or editor.

---

## 5 · Clay Billboard / media surface · REQUIRED MODULE

Existing WB2 consumer:
- `wb2-billboards.v1.js` · blob `8cc21b9344bf0a23802eb2677f7a16e0f93cd506`
- native Clay Billboard geometry/compositor/scheduler already consumed by WB2.

Current media expansion:
- Billboard Quote Hypernormalisation PR #354
- current head observed: `a8660f1fa2083175f844a82ce5c4d136eb93189d`
- current PR is planning/data; do not falsely claim runtime exists.

**One-Shot integration target**
- Billboard is a placeable Media module in WorldBuilder;
- current Clay Billboard owner remains singular;
- canonical Card/deck visual content works;
- integrate at least one deterministic HyperNormalisation quote/read-along loop from the existing PR #354 schema/briefing without inventing a second Billboard engine;
- Billboard → Card/deck/world provenance remains intact.

**Done**
Place Billboard → save/reload → play-world scheduler/content works → critic sees correct clay body/source content and readable media behavior.

---

## 6 · Residents + animation + ChatterBox · REQUIRED MODULE

Existing WB2 Resident seam:
- `wb2-residents.v1.js` · blob `5a2041d8c70972d24312fe40f412b4b96bcc392f`

Current ChatterBox donor:
- PR #357 · head `886b8e58135553633dda13d0643dc5844078cb35`
- r2 donor remains **TUNE**, not accepted product truth.

Keep existing ChatterBox / Overworld semantic Triplet grammar.
Do not build a second dialogue engine.

**One-Shot target**
At least one real source-proven Resident placed through WorldBuilder:
- current native/approved motion;
- current EyeRig/PetMouth only where source integration is valid;
- ChatterBox triplet/dialogue in actual 3D world;
- no PNG/cutout fallback in the 3D product;
- dialogue bubble presentation uses the current ChatterBox clay design only after its TUNE defects are repaired/verified.

Do not require the old Golden Journey.

---

## 7 · Cards + Almanac / provenance · REQUIRED MODULE

Existing:
- `wb2-cards.v1.js` · blob `e49ab0dcf649fe059d921a0f7fb9d055c248b3b9`
- `wb2-almanac-fan.v1.js` · blob `429c3934634b65e5cfe4cf9de936e8d647a2a3c5`

Use canonical Card identity/art/provenance.
Do not replace with coded placeholder artwork.

**One-Shot target**
At least one canonical Card can:
- appear as world/media/Resident content;
- be acquired/inspected;
- appear in the Almanac/provenance view;
- survive save/reload.

This proves the existing fractal chain without forcing a four-island quest.

---

## 8 · Audio / musical world · REQUIRED CORE

Existing WB2 consumer:
- `wb2-musical-world.v1.js` · blob `4142a1d08130169a7a93f0ede34056f114022328`

Keep:
- one audio graph;
- current Jukebox/catalog source;
- semantic world/biome handoff;
- physical ambience;
- voice ducking;
- performance clock ownership where used.

**Done**
World traversal, authored modules and Resident/Billboard moments can reuse the one audio owner without duplicate transports or broken transitions.

---

## 9 · Vehicle / Drive · REQUIRED MODULE

Existing:
- `wb2-taxi.v1.js` · blob `1d7fbfa585eae773d7010bdf05560c0ce7ab5dee`
- J14 drive consumer;
- Track Core route samples;
- exclusive Ground ↔ Drive ownership handoff.

**One-Shot target**
At least one source-proven vehicle can enter/drive/exit on a Joyride-presented Track/road module using normal controls.

This is mobility validation, not a Combat/Racer product takeover.

---

## 10 · Signature / landmark modules · REQUIRED PLACEABLE FAMILY

Existing examples:
- Signature Life Tree recipe/runtime;
- Resident performance modules / Band / Disco;
- future authored mini-scenes.

Life Trees are no longer mandatory four-island topology.
They become **placeable/source-proven signature modules** available to authored worlds.

The world system must support landmarks without hard-coding one topology.

---

## 11 · Theatre Curtain / transition modules · REQUIRED COMPATIBILITY

Existing Theatre Curtain remains the physical transition/loading donor.

The Open World must not create a CSS/generic loading replacement.
Use the existing transition owner when a loading/instance/world reveal is required.

Do not make Curtain acceptance a blocker if the base world can stream without a transition.

---

## 12 · CONSUMER / HOLD

Not required to finish this Open World One-Shot:
- Combat Arena / Platformer;
- full four-island Golden Journey;
- full quest/economy system;
- multiplayer/network backend;
- every Resident;
- every Billboard quote/deck;
- every minigame.

But the architecture must keep their owner seams compatible.

---

# Final integrated product gate

The candidate sent to Georg is **not** accepted as a bare world generator or bare editor.

The Whole-Product Critic must encounter and verify in one continuous real-input run:

1. coherent open world;
2. native player locomotion/animation;
3. Sky/Environment;
4. Joyride-design modular Track/Road element;
5. real source building/props/nature;
6. WorldBuilder placement/edit/sculpt;
7. save/reload;
8. one vehicle drive on the Track/Road module;
9. one Clay Billboard/media surface;
10. one Resident with world-native animation/dialogue;
11. one canonical Card/Almanac provenance seam;
12. audio continuity;
13. return to free exploration.

Any module may be simple, but it must be **real, source-proven, integrated and persistent**.

No placeholder substitute may satisfy the gate.
