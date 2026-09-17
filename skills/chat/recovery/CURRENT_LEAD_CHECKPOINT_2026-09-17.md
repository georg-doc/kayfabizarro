# KFB Lead · Current Recovery Checkpoint · 17.09.2026

**Status:** CURRENT RECOVERY POINTER · no runtime SSOT.

Read first:

1. `skills/chat/RECOVERY_PATH.md`
2. verify the current GitHub head of the project/tool actually being worked on
3. use `skills/chat/REGISTRY.json` to route to that project's own SSOT/recovery file

## Current execution cursors

### Stunt Car Race · Track Lab lane

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

### World / Birthday lane

Rejected Fable visual directions remain history only. Resume from real Travel + Georg references + real assets; visual/freeplay acceptance remains Georg's gate.

### DocCheck · SimBlood lane

Human recovery page:
`https://kayfabizarro.pages.dev/kfb-hub/sim-blood.html`

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
→ circular viewport + pan + zoom + focus

Workflow Engine
→ Explore / Compare / Cell ID / Differential / Tele-Hematology Case
```

Current SimBlood WIPs:
- **P0 Field Composer POC** — IMPLEMENTED; normal typed RBC/WBC/platelet field with pan, 40×/100×, focus and cell truth; browser/freeplay acceptance pending
- **P0 Reference/assets** — Wave 1 complete for POC guidance; production rights/validation remain open
- **P1 CytoDiff** — `CONDITIONAL_GO` R&D benchmark; must not delay MVP0
- **P1 Tele-Hematology** — workflow/use-case concept ready; later consumer of typed field truth

Current Field Composer entry:
`https://github.com/georg-doc/doccheck/tree/main/sim-blood/app/field-composer-poc`

DocCheck visual convention:
`#cc0033` as a restrained UI accent only; never tint microscopy imagery.

## Existing owner discipline

- project/tool SSOTs beat this checkpoint
- Stunt Race remains its own implementation SSOT; Track Lab is an experimental accepted lane until integrated through project contracts
- Travel remains world/runtime SSOT
- ToolBox/Studio contracts are not silently replaced
- Asset Librarian remains discovery/provenance, not compatibility owner
- SimBlood owns its own morphology/field/microscope/workflow contracts under `georg-doc/doccheck/sim-blood/`

## Recovery sentence

> Start from the current project SSOT, not chat history. For Stunt Race, read `RECOVERY.md` → Track Lab `LIVING_MASTERPLAN.md` → `WIP_STATUS.json` and preserve production owners; for SimBlood, open the Hub recovery page or read `START_HERE.md` → `RECOVERY.md` → `WIP_STATUS.json` → `RETURN.md`. Continue only the named active WIP and leave Living/Change/Return/WIP state resumable on GitHub.
