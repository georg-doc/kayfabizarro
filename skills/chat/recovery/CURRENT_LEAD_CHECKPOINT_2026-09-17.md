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

Public Track Lab:
`https://kayfabizarro.pages.dev/kfb-hub/stunt-race/track-lab/`

Project SSOT:
`georg-doc/KFB-Stunt-Car-Race`

Project recovery:
`RECOVERY.md`

Current experimental lane:
`ChatGPT_web/track-lab/`

Current gate, 2026-09-17:
- Georg manually accepted the standalone true-WebGL Track Lab v0.5 **direction** after freeplay, reporting cleaner behavior and more immediate play/fun than the prior Stunt Race approach.
- T1/T2 v0.6 remains the frozen feel candidate; it is **not being retuned for A0**.
- World/Atlas A0 alignment is accepted. Current proof is `Flow Loop v0.6 → A0 RecipeEnvelope → thin Race Adapter → same Track Core / same Race-owned feel → Human Freeplay → Race-specific L5`.
- Canonical Flow Loop recipe revision is `2026-09-17.t1t2.a0.2`; shared recipe contains geometry/Surface/Connector/slot semantics only.
- Acceleration, steering, grip/lateral response, Rubber Rail behavior, recovery, Guided Driving and camera remain Race-local.
- The thin adapter explicitly rejects `flow` / `flowTuning` if they appear in the shared A0 recipe.
- Current public recipe mirror has the same Git blob SHA as the canonical private recipe: `de9b372b90af0ff0cd2723c2fc2dac2771fd7648`.
- T3 transported-frame work is retained as an `EXPERIMENTAL GEOMETRY SPIKE`, but is parked as a gate until the T1/T2 A0 human freeplay passes.
- KayKit City Builder cars are Track Lab fixtures/candidates; Rover 01 production-shell preference is not silently replaced.
- `DEMO AUTO` remains inspection help only; stunt guidance remains `free → capture → commit → release → recover`.
- Future rig/composite vehicles + inertial FrizzleBob driver + wind-reactive ears remain an explicit presentation constraint, OUT OF SCOPE for the current gate and non-destructive to physics ownership.

Shared cross-project handoff seam:
`skills/chat/masterplan/KFB_ASSEMBLY_CONTRACT_A0_2026-09-17.md`

Recovery order:
`KFB-Stunt-Car-Race/RECOVERY.md` → `ChatGPT_web/track-lab/WIP_STATUS.json` → `A0_CONSUMER_PROOF_RETURN_2026-09-17.md` → `FLOW_LOOP_RECIPE_A0.json` → actual current `race/` contracts before integration.

Next gate:
Georg freeplays **Flow Loop · A0 → Race Adapter**. If feel is preserved, Race records its own L5 for that recipe revision, freezes T1/T2 feel and then resumes T3 as the next accepted geometry gate. Only after T3: one true vertical loop + safe bypass.

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
`https://kayfabizarro.pages.dev/kfb-hub/sim-blood-poc/`

Management viewer:
`https://kayfabizarro.pages.dev/kfb-hub/sim-blood-management/`

Current project SSOT:
`https://github.com/georg-doc/doccheck/tree/main/sim-blood`

Masterplan:
`https://github.com/georg-doc/doccheck/blob/main/sim-blood/MASTERPLAN.md`

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
- **P0 WBC visual lane** — real/open WBC injection direction accepted by Georg as convincing enough to continue; exact 3×3 candidate review and local normalization remain pending.
- **P0 RBC/platelet proof** — new next lane. Target normal RBC `8–12` variants and platelets `6–8` variants before broad pathology expansion.
- **Asset rule** — source-edge-adjacent cells are allowed only if the full biological contour exists; truncated candidates become `EDGE_CLIPPED_REJECT`; missing production morphology is not generatively fabricated.
- **P1 Management brief** — Frank viewer prepared; it is a derived projection from WIP/Return/Changelog/Masterplan and must be refreshed immediately before presentation.
- **P1 CytoDiff** — `CONDITIONAL_GO` R&D benchmark; must not delay real-cell/RBC proof.
- **P1 Tele-Hematology** — workflow/use-case concept ready; later consumer of typed field truth.

Current sequence:
`WBC review → accepted WBC localization → normal RBC proof → platelet proof → Normal/IDA/TMA calibration → first workflow mode`.

DocCheck visual convention:
`#cc0033` as a restrained UI accent only; never tint microscopy imagery.

## Existing owner discipline

- project/tool SSOTs beat this checkpoint
- Stunt Race remains its own implementation SSOT; Track Lab is an experimental accepted lane until integrated through project contracts
- Assembly A0 is handoff semantics only, not a new runtime owner
- Travel remains world/runtime SSOT; `/world/` remains a candidate-authoring POC, not a second runtime owner
- ToolBox/Studio contracts are not silently replaced
- Asset Librarian remains discovery/provenance, not compatibility owner
- SimBlood owns its own morphology/field/microscope/workflow contracts under `georg-doc/doccheck/sim-blood/`

## Recovery sentence

> Start from the current project SSOT, not chat history. For Travel/World work, open the Hub Travel recovery page, verify current `KFB-Travel-Globe/main`, then choose the productive `/world-builder/` runtime lane or the candidate-only `/world/` authoring lane without mixing their ownership. For Stunt Race, open the Hub Stunt recovery page or read `RECOVERY.md` → `WIP_STATUS.json` → `A0_CONSUMER_PROOF_RETURN_2026-09-17.md`; the current gate is human freeplay of the A0 Flow Loop before T3 is promoted. For SimBlood, open the Hub recovery page or read `START_HERE.md` → `RECOVERY.md` → `MASTERPLAN.md` → `WIP_STATUS.json` → latest Living Addendum → `RETURN.md`; current P0 is exact WBC review followed by normal RBC/platelet proof, with the Frank management viewer refreshed only from those source documents.
