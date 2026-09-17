# KFB Lead · Current Recovery Checkpoint · 17.09.2026

**Status:** CURRENT RECOVERY POINTER · no runtime SSOT.

Read first:

1. `skills/chat/RECOVERY_PATH.md`
2. verify the current GitHub head of the project/tool actually being worked on
3. use `skills/chat/REGISTRY.json` to route to that project's own SSOT/recovery file

## Current execution cursors

### Stunt Car Race · Track Lab lane

Human recovery page:
`https://kayfabizarro.pages.dev/kfb-hub/stunt-race.html`

Project SSOT:
`georg-doc/KFB-Stunt-Car-Race`

Project recovery:
`RECOVERY.md`

Current experimental lane:
`ChatGPT_web/track-lab/`

Current decision, 2026-09-17:
- Georg manually tested the standalone true-WebGL Track Lab through v0.5 and wants this direction pursued.
- Human qualitative result: cleaner and more immediately fun than the prior Stunt Race approach even in raw form.
- This promotes the **direction / next development lane**, not the Track Lab as a replacement production runtime.
- Existing movement/contact, camera, progress and WSA integration ownership remain in force.
- KayKit City Builder cars are accepted Track Lab fixtures/candidates; the previously documented Rover 01 production-shell preference is not silently replaced.
- `DEMO AUTO` is inspection help only; stunt guidance remains the zonal `free → capture → commit → release → recover` contract.

Recovery order:
`KFB-Stunt-Car-Race/RECOVERY.md` → `ChatGPT_web/track-lab/LIVING_MASTERPLAN.md` → `WIP_STATUS.json` → `V05_SOURCE_SNAPSHOT.md` → actual current `race/` contracts before integration.

Next gate:
productionize the Flow Loop/core and forgiving controls/rubber contact, then add arbitrary-3D transported route frames; the first spectacular gameplay expansion is exactly one real vertical loop with safe bypass.

### ToolBox lane

Continue only from the currently tested/promoted ToolBox source baseline. Do not rebuild working modules from prose. Keep owner boundaries explicit.

### Travel / World Builder lane

Human recovery page:
`https://kayfabizarro.pages.dev/kfb-hub/travel-world.html`

Implementation SSOT:
`georg-doc/KFB-Travel-Globe`

Current public runtime / Ground Movement Lab:
`https://kayfabizarro.pages.dev/travel/wip/travel_globe_wsa/world-builder/?wb0=1`

GitHub Pages fallback:
`https://georg-doc.github.io/kayfabizarro/travel/wip/travel_globe_wsa/world-builder/?wb0=1`

Parallel authoring-UX POC:
`https://kayfabizarro.pages.dev/travel/wip/travel_globe_wsa/world/`

Current runtime evidence, 2026-09-17:
- WB0 Ground owns spherical movement in Ground mode; Flight remains Travel-owned.
- Controls: W/S move, A/D turn, Q/E strafe, Shift run, Space jump.
- Movement comparison is implemented for ActionFigure / Rig_Medium, Monstrosity / Rig_Large and Legacy Orc Warband compatibility with explicit animated-Legacy fallback.
- Travel PR #17 merged; static CI 28/28 PASS + build PASS + verify PASS.
- Public movement-lab mirror commit `e0c250147ee67adafbf00a73c91e2d916ee8961e`; GitHub Pages deployment completed successfully.
- **Human browser/gameplay acceptance remains pending.** Static PASS does not promote animation quality, movement feel or Legacy direct binding.

Parallel `/world/` rule:
- `/world/` is POC/design donor only: object composer, route lab, resident prefab lab and seed/scatter experiments may move faster there.
- `/world/` does not own terrain, movement, Registry truth, animation compatibility or productive persistence.
- Candidate output flows `/world/ POC → Candidate World Recipe → Travel validation → optional promotion`.
- Always verify current Travel `main`; the `/world/` chat may have advanced the repo beyond the last Movement Lab merge without replacing it.

Birthday/Fable history:
Rejected Birthday/Fable visual directions remain archived history only. They do not define the current World Builder path.

### DocCheck · SimBlood lane

Human recovery page:
`https://kayfabizarro.pages.dev/kfb-hub/sim-blood.html`

Current POC:
`https://kayfabizarro.pages.dev/kfb-hub/sim-blood-poc/index.html`

Current project SSOT:
`https://github.com/georg-doc/doccheck/tree/main/sim-blood`

Recovery:
`https://github.com/georg-doc/doccheck/blob/main/sim-blood/RECOVERY.md`

Machine-readable current WIPs:
`https://github.com/georg-doc/doccheck/blob/main/sim-blood/WIP_STATUS.json`

Current SimBlood architecture:

```text
Morphology Engine
→ typed cell pools + recipes + Field Composer

Microscope Engine
→ circular viewport + smooth pan + continuous zoom + focus

Workflow Engine
→ Explore / Compare / Cell ID / Differential / Tele-Hematology Case
```

Current SimBlood WIPs:
- **P0 Field Composer / interaction** — current field is live; latest patch fixes reported high-magnification cursor-anchor drift by using one canvas coordinate basis for wheel/pinch zoom; Georg re-review pending
- **P0 Cell Asset Injection** — first three Acevedo/PBC segmented-neutrophil candidates are now wired through the image-backed asset seam with procedural fallback; only one candidate visually inspected so far; all remain unpromoted
- **P0 Reference/assets** — Wave 1 complete for POC guidance; production rights/validation remain open
- **P1 CytoDiff** — `CONDITIONAL_GO` R&D benchmark; must not delay the real-cell comparison
- **P1 Tele-Hematology** — workflow/use-case concept ready; later consumer of typed field truth

Current interaction correction commit:
`893c529fdf14c3925be208a7ae4e4a3c234692cf`

Current cell candidate set:
`sim-blood/assets/runtime-pool/neutrophil-candidates.v0.2.json`

Rights basis for injected PBC candidates:
Acevedo et al. 2020 Mendeley dataset · `CC BY 4.0`; raw GitHub image paths are temporary delivery mirrors only, not the license authority.

DocCheck visual convention:
`#cc0033` as a restrained UI accent only; never tint microscopy imagery.

## Existing owner discipline

- project/tool SSOTs beat this checkpoint
- Stunt Race remains its own implementation SSOT; Track Lab is an experimental accepted lane until integrated through project contracts
- Travel remains world/runtime SSOT; `/world/` remains a candidate-authoring POC, not a second runtime owner
- ToolBox/Studio contracts are not silently replaced
- Asset Librarian remains discovery/provenance, not compatibility owner
- SimBlood owns its own morphology/field/microscope/workflow contracts under `georg-doc/doccheck/sim-blood/`

## Recovery sentence

> Start from the current project SSOT, not chat history. For Travel/World work, open the Hub Travel recovery page, verify current `KFB-Travel-Globe/main`, then choose the productive `/world-builder/` runtime lane or the candidate-only `/world/` authoring lane without mixing their ownership. For Stunt Race, open the Hub Stunt recovery page or read `RECOVERY.md` → Track Lab `LIVING_MASTERPLAN.md` → `WIP_STATUS.json`; for SimBlood, open the Hub recovery page or read `START_HERE.md` → `RECOVERY.md` → `WIP_STATUS.json` → Living Addendum → `RETURN.md`. Continue only the named active WIP and leave Living/Change/Return/WIP state resumable on GitHub.
