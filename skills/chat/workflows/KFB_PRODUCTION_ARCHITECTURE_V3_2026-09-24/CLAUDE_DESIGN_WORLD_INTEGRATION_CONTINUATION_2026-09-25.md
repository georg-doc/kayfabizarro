# Claude Design · World Integration Continuation · 2026-09-25

Status: **READY · CONTINUE CURRENT CANDIDATE · DO NOT REBUILD**
Executor: Claude Design
Receiving owner: WorldBuilder / Web-GitHub Bridge
Current architecture: PR #204

## Outcome

Continue the existing **WORLD-INTEGRATION-01** candidate that Georg has given a **PROCEED PASS**.

Do not create another WorldBuilder, terrain editor, locomotion engine, OSM pipeline or world shell.

The current candidate already proves the desired product direction:
- real Hürth world profile;
- accepted WB2 terrain/object authoring in that same world;
- same `kfb-worldbuilder-scene` Save/Reload state;
- Play reads the edited world.

This continuation makes the world feel like one coherent game environment rather than a stitched lab:
1. correct shared ground locomotion presentation;
2. global OSM building/facade/shadow quality;
3. preserve direct in-world editing;
4. keep clear seams for later Flight, OSM corridor and Race modules.

## Read first

1. Current Session Cut:
   `tools/KFB-ToolBox/_inbox/KFB_WORLD_INTEGRATION_01_CLAUDE_DESIGN_SESSION_CUT_2026-09-25_r1/`
2. Its:
   - `START_HERE.md`
   - `HANDOVER.md`
   - `SOURCE.json`
   - `RETURN.md`
   - active `CHANGELOG.md`
3. Current masterplan:
   `MVP_FOCUS_PLAN_2026-09-24.md`
4. Shared presentation rules:
   `WORLD_RESIDENT_PRESENTATION_RULES_2026-09-25.md`
5. Accepted WB2 owner:
   PR #190 @ `ec52eb746be8c1a0e6f3f3d62857ed4b3121b284`
6. Current ToolBox Production-01 Session Cut, for the consumer seam only:
   `tools/KFB-ToolBox/_inbox/KFB ToolBox Production-01/KFB_TOOLBOX_CLAUDE_DESIGN_SESSION_CUT_2026-09-25_r1/`

## Hard owner boundaries

- Terrain / Sculpt / Object Edit / Persistence = accepted WB2 WorldBuilder.
- Geographic truth = OSM City Lab / World Zone.
- Ordinary OSM building presentation = shared World/OSM presenter.
- Landmark geometry = landmark owners.
- Movement / physics = World/Travel active-mode owner.
- Canonical animation-state/profile truth = ToolBox Animation Lab.
- WorldBuilder is a **consumer** of locomotion state/profile facts.
- Race physics/contact = Race owner after explicit handoff.
- Resident modules = consumers placed on host terrain; no mandatory baseplate.

No second owner.

---

# A · Preserve the accepted world/editor product

Do not regress:

- PLAY ↔ EDIT in the same world;
- Raise / Lower;
- radius via wheel/touchpad;
- fast Orbit/Edit switching;
- Object Move / Rotate / Scale / Drop;
- Save;
- Reload;
- continue playing the edited world.

A standalone editor page is FAIL.

A visually similar editor using different scene state is FAIL.

---

# B · Ground locomotion · shared consumer implementation

The current local World candidate may contain transition logic, but it must not become the canonical locomotion owner.

## Canonical base source

Use **KayKit Character Animations** as the default player-locomotion vocabulary.

Build the World consumer around semantic states, not filenames.

Required source-backed state inventory:

- `idle`
- `walk`
- `walk.fast` only if source-backed or explicitly documented as calibrated playback variant
- `run`
- `sprint` / fast-run only if source-backed
- `backward`
- `strafe.left`
- `strafe.right`
- `jump.start`
- `jump.air` / fall
- `jump.land`
- `crouch`
- `sneak`
- `crawl`

Do not invent a fake distinct clip when the source pack has none.

If a tier is a playback-rate variant rather than a separate clip, label it honestly.

## Movement rule

**World movement owns translation and trajectory. Animation follows movement state and speed.**

For each active ground state expose/consume:

- semantic role;
- source clip id;
- playback rate;
- measured/canonical cycle duration;
- stride/cadence relation;
- expected world speed;
- loop policy;
- contact facts;
- transition in/out.

Goal:
feet and world displacement read as one motion.

No obvious foot sliding.

## Jump

Use a real state chain:

`Jump Start → Air/Fall → Jump Land`

Physics owns vertical travel.

The clip does not teleport the actor.

Landing transition comes from real grounded/contact state.

## Transitions

Provide clear source-backed transitions across:

`Idle → Walk → faster Walk / Run → Sprint`

and back down again.

Use modest hysteresis/dead zones so speed jitter does not flicker states.

Do not build a second Animation Lab UI inside WorldBuilder.

World UI may expose only small diagnostic state labels while tuning.

## FrizzleBob graft / outline

Preserve one actor owner.

Fix presentation so:
- hidden/replaced original head does not keep an Ink/outline silhouette;
- outline follows visible geometry only;
- graft + host read as one actor.

Do not solve this by adding duplicate heads or a second outline renderer.

---

# C · OSM building presentation · apply globally

Use:
`WORLD_RESIDENT_PRESENTATION_RULES_2026-09-25.md`.

## Facades

WB-D2 already proves:
`FACADE_RULE v1`

Promote its logic as the starting ordinary-building rule across zones.

Required characteristics:
- deterministic windows/doors;
- small size variation;
- small placement offsets;
- mild asymmetry;
- seed/building-stable results;
- avoid sterile identical grids.

Apply to:
- Hürth / Alstädten;
- Cologne ordinary building stock;
- Cologne city-centre surroundings.

Do **not** blindly overwrite Dom/Hbf landmark geometry.

## Roof / light artefacts

Reuse the existing WB-D1 repair donor:
- `orientEG`;
- `FrontSide`;
- `shadowSide Back`;
- `normalBias 0.9`;
- concave-footprint flat-roof fallback where required.

This is a global presenter rule, not a Hürth special case.

## Contact / shadow quality gate

Inspect representative buildings for:
- bright band directly under roof;
- irregular dark strip at wall/ground edge;
- shadow acne;
- contact shadow detached from object;
- shadow-camera near/far clipping;
- buildings/props appearing to float;
- terrain/support height mismatch.

Do not hide failures with fake plates.

---

# D · Environment presentation

Use the current WorldBuilder / Travel-compatible sky and light family already present in WORLD-INTEGRATION-01.

Do not replace it with a generic lab sky.

Integrated demo/Resident fixtures placed into the world should inherit:
- current sky;
- current light profile;
- actual terrain/support;
- actual shadow rules.

No forced rectangular baseplate.

---

# E · Blender MCP route input · prepared seam only

Georg is separately building additional route/track pieces with Blender MCP.

Current spoken route note:
`VOICE_INPUT_UNCERTAIN: "Lüt" → Dom → "Müllheim"/Mülheim → "SAG"/SAE`.

GitHub currently confirms:
- Dom/centre sources exist;
- Mülheim / SAE (Carlswerkstr. 11c) was previously documented as **no OSM cache yet**;
- the literal name `Lüt` is not resolved in current GitHub search.

Therefore:

- do not guess or rename these endpoints;
- do not invent road geometry;
- do not substitute another route;
- wait for the exact Blender MCP export / repo pin before importing those pieces.

When the export arrives:
- show each source module in isolation first;
- classify real-road/geographic pieces versus authored Track/connector pieces;
- OSM remains geographic truth;
- Blender/RKIT may own engineered geometry/modules;
- WorldBuilder only places accepted modules on explicit sockets.

This route work must not block the current locomotion + OSM-presentation gate.

---

# F · Do not implement yet

Keep seams ready but do not expand this pass into:

- new Flight controller;
- new CardCarrier;
- Drive/Boat physics;
- Race contact/physics;
- full Hürth→Cologne→SAE corridor bake;
- new Resident system;
- new Animation Lab;
- new terrain tools.

Ground → animated Card Flight remains the prepared next Travel gate after shared ground locomotion is stable.

---

# Human gate

One coherent WORLD-INTEGRATION continuation candidate.

Georg should be able to:

1. load the existing Hürth world;
2. walk;
3. accelerate through the source-backed ground movement tiers;
4. run/sprint without obvious foot sliding;
5. jump with Start/Air/Land;
6. return to Idle cleanly;
7. switch to Edit;
8. sculpt terrain;
9. move an object;
10. save/reload;
11. continue playing;
12. inspect several ordinary OSM houses and see consistent facade variation;
13. inspect roof/wall/ground contact without the known bright seam / floating-shadow artefacts.

No exhaustive OSM corridor or Race test in this gate.

## Return

Do not publish Live.

At the end run:

`/session-zip`

Return the complete current candidate, Handover, active Changelog, SOURCE, tests/evidence, open issues and exactly one next gate.

Exactly one next gate:
**GEORG REVIEW · SHARED GROUND LOCOMOTION + GLOBAL OSM PRESENTATION IN THE REAL WORLD.**
