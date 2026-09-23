# CHANGELOG · Claude Billboard / Media Residency Design

## 2026-09-23 · Prepared Claude Design slice

### USER DIRECTION
- prepare Billboard / Media Residency demo logic for Claude Design before runtime implementation;
- reuse physical billboard donors plus Card/PDF/Triplet/Collage presentation;
- keep the slice visually reviewable and small.

### REUSE
- Kenney/KFB billboard donors;
- Racer `buildBillboard()`;
- Racer `renderCardQuarter()`;
- PDF.js/Card CanvasTexture;
- ChatterBox/Triplet content owner.

### DESIGN GATE
One compact mini-diorama proving:
- CARD / PDF;
- TRIPLET;
- COLLAGE LOOP;
- optional DEFAULT → INSPECT → REVEAL concept.

### STATUS
Docs/design brief only. No runtime, browser test or public Stage.


## 2026-09-23 · First Claude Billboard output rejected

### HUMAN VERDICT
- first Claude Billboard candidate = **REJECTED · HARD FAIL**;
- scene judgement is obstructed by floating editor/readout UI;
- the central real Card does not render;
- the result does not prove the physical 3D donor from multiple useful angles.

### RULES LOADED
- `skills/session-entry-use-what-works_v1.md`
- `skills/chat/ANTI_SLOP_VISUAL_BRIEF_GUARDRAILS.md`

### RECOVERY
Added:
- `DONOR_LOCK_USE_WHAT_WORKS.md`
- `REJECTED_OUTPUT_RECOVERY_2026-09-23.md`
- `CLAUDE_RECOVERY_PROMPT.md`

### NEW GATE
`B0` = exact source proof only:
real Kenney billboard + real KFB Card via existing Racer `renderCardQuarter()` / `buildBillboard()`, minimal UI, front + both 3/4 angles.

No Triplet/Collage/Reveal before human acceptance.
