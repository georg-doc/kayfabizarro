# KFB MVP Focus Plan · 2026-09-24 evening

Status: **CURRENT PRODUCT FOCUS · no automatic merge/Live promotion**

Focus: **World Building · Resident Scenes · ToolBox · Car Racer**

### Current WorldBuilder gate · WB2 accepted → Claude Design

WB2 terrain sculpting and interaction are **GEORG HUMAN PASS** at PR #190 head `ec52eb746be8c1a0e6f3f3d62857ed4b3121b284`.

Before expanding mobility, execute the already-prepared `TERRAIN_EDITOR_CLAUDE_DESIGN_AFTER_WEB_2026-09-23.md` handoff:
- reduce/collapse redundant side-panel editor controls/copy;
- keep object transforms inline;
- keep Terrain Sculpt compact;
- maximize 3D FOV;
- integrate existing WorldDesign/environment look controls;
- preserve Save/Reload and all owner seams.

Smooth and Flatten/Set Height remain later separate Web slices.

### Intake update · WB-D2 + Resident S40 · 2026-09-25

- WB-D2 now supplies the latest World presentation candidate: Cologne/Hürth/Alstädten, facade-rule v1, shadow fix, street names and homebase. It does **not** replace WB2 or World Zone truth. After WB2 Design/Rehome, next gate is `WB-ZONE-SEAM-01`.
- Resident Disco S40 is already a candidate runtime, not a future design brief. Bridge it into current owners; do not rebuild it. Its 8-song rotation/tempo maps, Disco Ball, collision and DJ/MC are intake candidates with explicit pin/transport/downbeat gaps.

## MVP 1 · WorldBuilder Mobility Playground
One WorldBuilder world with source-proven Ground · Drive · Flight · Boat/Water · Plane/Air · Freefall/Parachute only where real support exists.

Ground motion consumes shared states:
Idle · Walk · Run · source-backed fast-run/Sprint · backward/strafe · Jump Start/Air/Land · crouch/sneak/crawl.

One movement writer; animation follows state/speed. Prepared: `WB-MOBILITY-MVP-01`.

## MVP 2 · Hürth → Cologne Streets → Race Track
Hürth → committed/baked OSM corridor/street zones → Cologne → visible ramp/service connector → `TRACK_A_STUNT_8`.

The Track socket now knows about RKIT-08/09 **by reference only**: LOOP_REAL, LOOP_SLIM, LOOP_MAG_HERO, LOOP_MAG_CASCADE and SKYRAMP-01. Nothing is driven yet.

Gate order is binding:
1. Race drives **LOOP_REAL** first in the existing Rapier host;
2. Race reports measured entry speed/minimum load and capture→commit→release→recover;
3. only then may the other stunt modules proceed;
4. **no WorldBuilder placement of RKIT-08/09 before that gate**.

No invented geography. Streets use Travel/WorldBuilder Drive; explicit Track entry hands contact/gameplay to Race. Prepared: `WB-HUERTH-COLOGNE-RACE-MVP-01`.

## MVP 3 · ToolBox Production + Motion Intake
Stage-First becomes the daily front door **without losing useful Pet/FrankenStein Studio v17+ capabilities**.

Includes semantic State/Action Animation Lab, Melee/Duel mode, direct compatible-FBX Motion Intake and Blender exception queue only when technically required.

Prepared: `TB-V17-INTEGRATION-01`, `MOTION-INTAKE-DIRECT-01`; existing `TB-ANIM-01`, `COMBAT-DUEL-01`, `TB-PROD-01` sharpened.

## MVP 4 · FrizzleBob Body Family → Resident House
One FrizzleBob identity across 2–4 real modern KayKit destination bodies. Preserve destination rigs; browser graft first; Blender only for selected variant if mesh/weights require it.

Then Georg selects one and authors a Resident House/interior through existing Scene Studio/WorldBuilder. Prepared: `ACTOR-FB-BODY-FAMILY-01`.

## MVP 5 · Living Residents KISS
AI Town mechanics donor only:
`activity → notice → one intent → host-valid approach → NPC-LIFE beat → ChatterBox → optional Card/gift → leave/resume → Journey event truth`.

3 Residents. No dialog tree, relationship bars, new global memory DB or mandatory LLM. Optional low-frequency Observer/Almanac reflection supplies meta-narration.

Prepared: `NPC-AITOWN-KISS-01` after NPC-LIFE visible/human gate.

## Parallel Resident performance fixture
`RES-DISCO-01` is READY on the same owners: real Legacy/Medium/Large cast + current dance actions + one music clock. It should use direct Motion Intake for future simple compatible FBX additions.

## Recommended sequence
Parallel now:
1. WB2-DESIGN-REFINE-01 · Claude Design UI/WorldDesign refinement on accepted WB2;
2. WB-ZONE-SEAM + WorldBuilder/Travel modes;
3. MOTION-INTAKE-DIRECT-01;
4. TB-V17-INTEGRATION-01;
5. ACTOR-FB-BODY-FAMILY-01;
6. Race drives RKIT-08 **LOOP_REAL** first in Rapier; TRACK_A/world stunt placement waits on that measured gate;
7. RES-DISCO-A source/motion audition.

Then:
8. Hürth→Cologne→Track;
9. Living Residents KISS after NPC-LIFE review;
10. Georg's FrizzleBob-house Resident Scene.

Work/WSA stays idle unless an executor proves a capability gap.
