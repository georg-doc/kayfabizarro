# WSA request · self-contained Claude Design brief for KFB WorldBuilder v1 · 2026-09-24

Status: **CLOSED PACKET · REQUESTED BY GEORG**
Reason: Georg rejected Coworker's `START_CLAUDE_DESIGN_WORLDBUILDER_V1.md` as a "Schwundform": a list of paths and fragments; a fresh Claude Design chat cannot know what TinySkies is, what each donor looks like or why decisions were taken.

## Task

Write ONE self-contained Claude Design brief that a fresh chat with zero prior knowledge can build from. Replace `tools/KFB-ToolBox/_handover/WORLD_BUILDER_V1_2026-09-22/START_CLAUDE_DESIGN_WORLDBUILDER_V1.md` on `main` (keep its decisions; it is only too thin). Also refresh the copy in `tools/KFB-ToolBox/_inbox/KFB WorldBuilder Claude Design/`.

Must contain, in prose, not just paths:

1. What Kayfabizarro is and what WorldBuilder v1 is for (2–3 paragraphs).
2. Every donor explained: what it is, what it looks like, what exactly to take, what not; live review URLs and exact pinned paths. At least:
   - WB1 scene editor + WB2 terrain sculpt + shared `edit-layer.js` (accepted by Georg);
   - ZyFou/ProceduralTerrains Planet mode (`planetBundle.js`, `PlanetWorld` cube-sphere, MIT);
   - **TinySkies**: what it is (origin, what it looks like), what we keep (sky dome, clouds, weather, day/night, world moods, light rig, camera-flight idea) and what is rejected and why (faceted polygon globe; three-part camera flight; Travel Globe polygon anatomy cannot take the racetrack);
   - WorldDesign Lab (triplanar RGB palette "Derek", macro texture, cel shading, KFB ink) and why it was built (to replace the polygon look with a clean procedural cartoon surface);
   - Elastic Grotesque Clay + view switch (Elastic default; Clean/Cartoon/Grotesque stay switchable);
   - colour system: story mode, card seeds, random harmonic palettes as in KFB Racer Cologne (`KFB-Stunt-Car-Race`, name file + commit);
   - eye rigs (EyeRig Atlas; Medium/Large done, Legacy pending; only Dungeon 1.0 is a kit);
   - Mixamo motion catalogue (`ANIMATION_INTAKE_01_MIXAMO_2026-09-24.md`).
3. Georg's decisions and rejections with the reason: Travel Globe out as base, no polygon look, GitHub only SSOT, review via wrapper pages under `kfb-hub/pruefen/`, no single-file bundles or simplified mirrors.
4. **Hürth status (Georg 24.09):** latest tune R2 = FAIL. None of the three bugs fixed (roof overhang, road/curb seams, shadow banding); road rework made it worse (new artifacts and gaps). Palette part works and is kept. Use V2 geometry @`0c59e92d` + working palette; do not take R2 road changes; list the three bugs as open. Source: `HUMAN_RESULT_HUERTH01_V2_R3_2026-09-24.md` on the #194 branch.
5. Technical traps you found (TinySkies needs global THREE and relative sky-presets; jsDelivr pins; WebGPU vs WebGL; etc.).
6. Done-when list Georg can check by looking (incl. planet seen from outside without facets; one continuous camera move globe → ground).

Read `CURRENT_STATE_2026-09-24_WSA.md` and the private Travel/Racer repos for facts. No implementation. Commit, report the URL, stop.
