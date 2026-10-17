# Brief WS1 · Long run R2 (Georg AFK, computer on): camera → modules + E2 → fluff harvest → colour script · 17.10.2026

**Tier 0 (3 lines):**
1. Branches, not main (V-400). Each stage gets its own test row and is green before the next stage starts. After each stage: preview + build.json (the staging site picks it up automatically).
2. Build only what the linked specs say. If something is unclear: STOP, write it in WS1_STATUS, and continue with the next stage.
3. Figures only via figure card + E2 module; light only via the stage-light module; proofs in clay without overlays (V-346/V-383).

**Block: order and acceptance criteria**

0. **b98 first (short):** analyse the impact of making the repo private on your pipeline (§76+1 in WS1_STATUS, change nothing).

1. **Camera (b82, V-408): stage C1**
   - Build exactly as in WS0_TO_WS1 "Kamera: ruckelfrei …" (17.10.).
   - Follow camera with lazy glide-back.
   - God mode: orbit 360°, zoom to cursor, panning, focus by click.
   - Update after the physics interpolation, smoothDamp, no `lerp(dt*k)`.
   - Gate:
     - jitter ≤ 1 px at 60 fps, ≤ 2 px at 30 fps;
     - orbit around a standing and a moving car without jumps;
     - zoom to cursor ≤ 2 % deviation;
     - a short video clip.

2. **Modules + E2 (b90, V-409/V-422): stage C2**
   - Ship the stage-light module and the figure-card loader as packages (two consumers are waiting: Dramatis Personae, ToolBox studio).
   - Load the aliens via figure card with **E2 lids**: `replies/E2_ATTACH_R1/clay-skin-attach.v1.js`, eyeForward 0, fit from the recipe.
   - Use the **80° sockets**: `replies/E2_ATTACH_R1/assets/variants/*_edge80.r4e.glb`.
   - Hide the v6 lid shells completely.
   - Gate:
     - Lord Hunky + Lady Dory on the stage, front, ¾ and side × lids rest/50 %/closed, compared with `proof_r1e.html?edge=80`;
     - 0 px pupil with lids closed.

3. **Slice 1 fluff harvest, mechanics (V-368/V-371/V-423): stage C3**
   - Fluff on trees following **placement grammar R2** (`replies/SPEC_PLACEMENT_GRAMMAR_R2.md`, you are code owner; anchors from WSB B2 `kaykit-tree-fluff-anchors.v1.json`).
   - **Hit rule:** on average 3 punches / 2 shots / 1 explosion hit empty a tree. Staggered drops: first 1–2, then 3–4, then all.
   - Balls in 6 colours **bounce, roll and come to rest** with plausible physics and stay until collected (collision with the terrain, no sinking in, sleep after settling).
   - Collect on contact; save state.
   - **UI only as a placeholder** (counter in a corner). The real harvest UI comes with Georg's HUD ZIP.
   - The placeholder for the brass knuckles is the fist; for shots, a simple projectile.
   - Ground colour: skip saturated greens (WSB finding on B7).
   - Gate:
     - 3 zones, measured values (hits per tree, balls per stage, resting time, sink-in 0);
     - clay proof video;
     - perf ≥ 55 fps.

4. **Colour script (b81, V-406): stage C4**
   - Joyride A/B/C with colour speckles stone by stone, using the **B9 stone IDs** (`COLOR_1` in the WSB copies; Cologne Cathedral not yet).
   - Gate: an image row per stage, no hard edge (V-403 speckle).

**Not in this run:** Kayfabrick bots / aggro / combat (V-426: after Slice 1 + HUD ZIP), harvest UI, merge to main.

**Report per stage:** a new § in WS1_STATUS (at most one page) with measured values, preview link and open questions to WS0.
