# KFB Claude Coworker WS0 · Current Sprint Matrix

Snapshot checked: **2026-09-23**
Rule: **refresh exact PR/branch head before any review, proposal or write.**
This file is onboarding context, not a replacement for project Returns.

| Lane | Current source | Current state | Next human/owner gate | Coworker default |
|---|---|---|---|---|
| Racer | `georg-doc/KFB-Stunt-Car-Race` · PR #33 · `chat/racer-tarch0-sp13ktra-2026-09-23` · head `308ed3b7e464f573b85d004f13fbf9e0642c818c` | TARCH architecture R1 accepted; runtime banking fix tested at `5f1ec224...`; R3 review harness failed; R3b review-only repair prepared | **R3b Track Edge + Banking Chat HTML human recheck** | Review PR/diff or propose next integration only; do not touch grounding/jitter/trails before R3b |
| Travel | `georg-doc/KFB-Travel-Globe` · PR #37 · accepted head `603f2a9e8fb2c8efd1008ed67607cf7a712de0bd` | **TMB-1E HUMAN ACCEPTED / CLOSED**; 2.0× rider candidate accepted for Medium/Large/Legacy capacity; CardCarrier unchanged | **TMB-2 · Ground → Flight Double-Space intent / ownership handoff proof** | Refresh the next TMB-2 branch/PR when created; do not reopen TMB-1E or start landing/TMB-3 |
| ToolBox source lock | `georg-doc/kayfabizarro` · PR #185 · `chatgpt-web/toolbox-source-lock-2026-09-23` · head `2833674b36be707fa4d14c8b532faee78ef3ba28` | Claude Round 1 rejected; texture workaround consumed; Resident-set portability is current P0 in existing chat | Goth Girl / Orc Warband / Animatronic set review; then FrizzleBob lineages + full roster | Review/integration planning okay; Claude Design rebuild remains HOLD |
| WorldBuilder | `georg-doc/kayfabizarro` · PR #186 · `chatgpt-web/worldbuilder-toolbox-scene-authoring-2026-09-23` · head `37b7498181dc4c83b9e7a40962922c003bd20cfd` | R1 functional foundation human PASS; R2 promoted shared inline edit layer; 32/32 static/integration PASS, browser human review pending | Georg tests mini-menu + position/rotation/scale Save/Reload | Strong candidate for code review and later ToolBox integration proposal; no Claude Design/Orc integration yet |

## Racer source to read when reviewing

Current Return:
`georg-doc/KFB-Stunt-Car-Race`
branch:
`chat/racer-tarch0-sp13ktra-2026-09-23`
path:
`_handover/RACER_MVP_STABILIZATION_2026-09-23/TARCH-0/RETURN.md`

Important review lesson:
the R3 failure was the **review harness**, not proof the runtime road disappeared.

Keep review-layer defects separate from runtime defects.

## Travel source to read when reviewing

Current Return:
`georg-doc/KFB-Travel-Globe`
branch:
`chatgpt-web/travel-mode-bridge-tmb1e-scale-capacity-2026-09-23`
path:
`_handover/TRAVEL_MODE_BRIDGE_V1_2026-09-23/TMB1E_RETURN.md`

Current result:
TMB-1E was human accepted on PR #37 and is closed as a review gate.
Carry forward the accepted 2.0× rider relation and the existing CardCarrier.
Next is TMB-2 Ground → Flight Double-Space ownership handoff; TMB-3 landing remains HOLD.

## Shared review facts

Verified review harness:
`threejs-focus-review-v1`

Shared review pool:
`skills/chat/workflows/KFB_WEB_FIRST_EXECUTION_V1_2026-09-22/REVIEW_TEMPLATE_POOL.md`

Verified ChatGPT texture-host workaround:
WorldBuilder PR #186 / `e0a9327bcc6406ec3e093f57b14ec81569988406`.

## Coworker WS0 test opportunities

Good first **REVIEW**:
- Racer PR #33 R3b separation of review defect vs runtime;
- Travel PR #37 as an example of a successful two-pass review repair now closed by human acceptance;
- WorldBuilder PR #186 shared edit-layer ownership.

Good first **INTEGRATION PROPOSAL**:
- accepted WorldBuilder shared edit layer → ToolBox Stage-First integration after human gate;
- Travel/Racer seam planning only from their freshly checked current gates; Travel has advanced to TMB-2;
- Resident-set portability → ToolBox/WorldBuilder common scene-source contract.

Do not create an integration proposal that assumes a pending human gate has already passed.
