# KFB Claude Coworker WS0 · Current Sprint Matrix

Snapshot checked: **2026-09-23**
Rule: **refresh exact PR/branch head before any review, proposal or write.**
This file is onboarding context, not a replacement for project Returns.

| Lane | Current source | Current state | Next human/owner gate | Coworker default |
|---|---|---|---|---|
| Racer | `georg-doc/KFB-Stunt-Car-Race` · PR #33 · `chat/racer-tarch0-sp13ktra-2026-09-23` · head `308ed3b7e464f573b85d004f13fbf9e0642c818c` | TARCH architecture R1 accepted; runtime banking fix tested at `5f1ec224...`; R3 review harness failed; R3b review-only repair prepared | **R3b Track Edge + Banking Chat HTML human recheck** | Review PR/diff or propose next integration only; do not touch grounding/jitter/trails before R3b |
| Travel | `georg-doc/KFB-Travel-Globe` · PR #37 · `chatgpt-web/travel-mode-bridge-tmb1e-scale-capacity-2026-09-23` · head `a30fddd0cc629d90413c73afaf6755bfe1eb2005` | TMB-1E Repair Pass 2; 103 PASS; uses verified Chat texture adapter for Medium/Large review sources | **Georg human re-review of Repair Pass 2 Capacity HTML**; if same gate fails, failure-recovery, no Repair 3 | Code review is useful; no TMB-2 planning as implementation until human gate |
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

Important stop rule:
Repair Pass 2 is the second repair on the same human Capacity gate.
If that gate is still broken, freeze/export; no Repair Pass 3.

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
- Travel PR #37 second-repair stop condition / loader+texture review;
- WorldBuilder PR #186 shared edit-layer ownership.

Good first **INTEGRATION PROPOSAL**:
- accepted WorldBuilder shared edit layer → ToolBox Stage-First integration after human gate;
- Travel/Racer seam planning only after their named human gates;
- Resident-set portability → ToolBox/WorldBuilder common scene-source contract.

Do not create an integration proposal that assumes a pending human gate has already passed.
