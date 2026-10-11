# Note to the steering session (Claude Code) · islands, track, MVP-1 drift risks · R1

Date: 2026-10-11. From: Blender-Coworker (Mac mini, Blender 5.2.2 via MCP). Requested by Georg, who wants you to see this directly and steer against it.
Scope: read-only review of GitHub on 2026-10-11, plus an offer of Blender work that needs your coordination before anything is built.
Nothing in the Lab, the MVP or any other branch was changed.

## 1 · Defects and risks first

Each point carries its evidence. "Not found in …" means exactly that, and nothing more.

1. **Plan R1 is not readable by other sessions.**
   - Register V-002, V-005 and V-009 make `docs/KFB_WORLDBUILDER_PLAN_R1.md` the governing plan.
   - Not found in:
     - `tools/KFB-ToolBox/_inbox/KFB Island Worldbuilder Lab/docs/` on `sync/lab-rkit-2026-10-09` (head `cbbc4be`);
     - `docs/kfb-decisions-register-2026-10-11`;
     - the Lab folder copy on the Mac mini.
   - The newest `PROJECT_STATE.md` on GitHub (10.10.) predates the register. So any session other than yours still works from Masterplan R2.1 and Weg A. That is the "each session builds its own world" pattern from `POSTMORTEM_MVP1_STAGE1_R1.md` §3.3.
   - **Request:** push Plan R1 and a current PROJECT_STATE next to the register. Add a line in the register saying which docs are superseded.
2. **The golden-reference supplier is gone.**
   - Postmortem §5.1 (Weg A) relies on Claude Design for golden references of the basics: edge, transition, street edge with kerb, stone arch with abutment niche, pier clods.
   - V-084 (FAIL): Claude Design builds no more 3D geometry.
   - No returns found under `MVP1_RETURNS/F_claude-design_islands/`.
   - The root cause "we build from text, not from images" (postmortem §3.1) is therefore still open for the islands.
   - **Request:** name who now supplies golden references for island edge, underside and road-to-island transition. The Blender offer in §3 could fill this gap, but only if you agree.
3. **Look ownership after V-010 / V-014.**
   - `POSTMORTEM_JOYRIDE_REGRESS_R1.md` §3.2 names the cause: the owner table in Masterplan §4 ("roads, transitions, bridges, race pieces → RKIT") overruled the look sentence.
   - RKIT `RETURN_GATE1B.md` still lists `RKIT_R3_P2_NETWORK_FAMILIES_AND_STRUCTURES` as its next gate.
   - **Request:** confirm that the Masterplan §4 owner table is rewritten, and that RKIT P2 is cancelled or re-scoped to "Town only, Joyride outside". If not, the next RKIT run will rebuild the regress.
4. **Islands are Georg's design (V-002, V-080, V-081).** Any island geometry from Blender must be options and references for Georg and for the Lab generator. It must never become a second island runtime or a finished world.
5. **Roots under the islands collide with an earlier decision.** Georg now asks for an underside like a "tree torn out with its roots" or a "blasted earth clod". On 03.10 he rejected Scholle v6 ("Würste") and the critic's "dripping tendrils" (postmortem §3.5).
   - Roots can easily read as sausages again.
   - Georg should see both directions side by side before anyone wires either into the Lab. Do not decide this from text.
6. **Scale check on my own work.** The Prison Maze greybox (`blender-mcp/prison-maze-greybox-2026-10-10`) is built in metres with a 2.17 m resident. K2 says H = 3.64 and plans in MC.
   - Before any Lab use, the Prison greybox needs a K2 conversion.
   - Its bridge socket must be replaced by a Track Core `ENTRY`/`EXIT`; no own socket logic.
   - I will do this on request; nothing is wired today.
7. **Ramps already exist; do not let anyone rebuild them.** Track Core v0.14 has `EXIT`/`ENTRY`, `DIVERGE`/`CONVERGE`, gore areas and flush ramp edges (`RETURN_GATE1B.md`). Georg's "cosmic superhighway" with on/off ramps and turnarounds is therefore a Track Core + Joyride-look job (V-001 "template first").
   - Open items from Gate 1b that block clean island connections:
     - the terrain cut in the island owner (`a1b.terrain_request.json`);
     - the Town→Highway width transition at 1:11 instead of 1:25;
     - the tight turning radius at the island junction.
   - A turnaround loop is not in Track Core v0.14. Not found; please confirm.

## 2 · What I see working

- The register (V-001…V-084), the CHANGELOG and the two postmortems name the real causes and do not hide them.
- "Two strands at most" and "Georg designs, sessions build tools" are the right counter-measures.
- The seam fix (Scholle top ring generated from the last row of the top mesh, plus an automatic seam test) attacks the construction, not the symptom.
- The remaining risk is mostly item 1: the rules exist, but only one session can read the plan that applies them.

## 3 · Offer: Island Form Kit 01 (Blender, waits for your OK)

Purpose: **images and measured geometry instead of text rules.** Georg chooses; the Lab generator matches.

**Fixed for all parts:**
- K2 units (H = 3.64, MC);
- Joyride J17 look;
- KFB eyes on every resident in a render;
- one closed mesh per island;
- the measurements from `ISLAND_ANATOMY_RULES.md` as a check.

| Part | What Blender delivers | Template first (V-001) | Not doing |
| --- | --- | --- | --- |
| **K1 · Underside study** | One-body islands (top, edge and underside from one mesh). Three underside families: (a) anatomy baseline (measured taper, stalactite field); (b) blasted clod (strata bands, fracture facets, a few embedded cellar, pipe and tunnel pieces); (c) root ball (few, thick, short roots set into the strata, to test against the v6 "Würste" fail). Each as a GLB plus an ortho sheet (top, side, front, underside 3/4) with car and resident for scale, and anatomy numbers against the measured ranges. | Scholle v7 and the Lab R2D generator: please name the exact source files so I start from them, not from scratch. | no Lab wiring, no new terrain owner |
| **K2 · Silhouette line-up** | 6 outlines (round, long, crescent, stepped plateau, spire, twin) × widths S/M/L in MC, on one board at fixed scale. | Masterplan island sizes (Town ≈ 40×40 MC, Protopia 20–28 MC) | no island layout or world placement (Georg, God-Mode) |
| **K3 · Transition golden references** | Island edge with a Track Core road lying on it (as in Gate 1b), in J17 look. Three seam treatments: transition stripe pattern; hidden seam under a grate or cattle-guard; clay lip. Stills from the J17 `chase-curve` camera, so they can sit next to `chase-curve.jpg`. | Track Core v0.14 GLB export, `kfb.road-bed/1`, J17 reference images: please name the paths | no ramp or road geometry of its own |
| **K4 · Landmark kitbash sheets** (later) | One landmark per island from KayKit/Kenney: Town castle, Protopia hermit hill, Dystopia spires, Utopia factory stack, Prison lighthouse (exists). Production sheet with parts list and dimensions. | KayKit > Tiny Treats > Quaternius > Kenney (V-070) | no buildings for Town (V-080) |

Order if you agree: K1 + K2 on one board → Georg chooses → K3 → K4.
Delivery: an additive branch `blender-mcp/island-form-kit-01-2026-10-11`, with stills and boards only. Purchased assets stay local (V-071).

## 4 · Questions for you (answer here or through Georg)

1. Where is Plan R1, and which docs does it supersede?
2. May the Blender-Coworker supply golden references K1–K3 for the islands (filling the Claude Design gap of Weg A)?
3. Exact source paths: Scholle v7 / R2D generator, Track Core v0.14 export, J17 `chase-curve.jpg` / `chase-straight.jpg`.
4. Is a turnaround loop planned in Track Core? If so, who owns it?
5. Is the Prison greybox wanted in the Lab after MVP-1? If so, I convert it to K2 and replace its socket with a Track Core `ENTRY`.

## Sources (read 2026-10-11)

- `docs/kfb-decisions-register-2026-10-11`: `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/DECISIONS.md` (V-001…V-084), `CHANGELOG.md`
- `sync/lab-rkit-2026-10-09`: Lab `docs/POSTMORTEM_MVP1_STAGE1_R1.md`, `docs/MVP1_DONOR_AND_MODEL_MAP_R1.md`, `docs/ISLAND_ANATOMY_RULES.md`, `docs/PROJECT_STATE.md`, `docs/KFB_MASTERPLAN_MVP_DRIVE_LOOP_R2.md`
- `wsa/kfb-scene-study-2026-10-10`: `tools/KFB-ToolBox/_inbox/MVP1_RETURNS/WSA_scene_study/POSTMORTEM_JOYRIDE_REGRESS_R1.md`
- `blender/rkit-r3-p1-junction-profiles-2026-10-08`: `…/RKIT_R3_BLENDER_MCP_CONSTRUCTION_2026-10-08/production_gate1b/docs/RETURN_GATE1B.md`
- `blender-mcp/prison-maze-greybox-2026-10-10`: `skills/chat/workflows/KFB_PRISON_MAZE_GREYBOX_2026-10-10/`
