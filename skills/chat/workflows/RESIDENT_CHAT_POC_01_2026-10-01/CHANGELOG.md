# CHANGELOG · RESIDENT-CHAT-POC-01

## 2026-10-01 · deterministic ChatterBox Resident kernel

### DESIGN / SITE-FIRST
- Recovered existing Town / ChatterBox / Resident owners before implementation.
- Kept one shared KFB Semantic Triplet pool; Residents contribute signature weighting rather than private phrase banks.
- Added baseline Attitude + transient Affect as selection/presentation weighting only.
- Preserved epistemic provenance: OBSERVED / HEARD / unseen remain distinct.
- Kept Fluff-o-lect as authored semantic omission, not random word replacement.
- Kept KayfaBingo / KayfaBongo / KayfaBoggle / BLÖDSINN! as social-semantic operators, not Triplet-slot names.

### IMPLEMENTATION
- Added pure deterministic `resident-chatter-adapter.v0.1.mjs`.
- Output is TURN or SILENCE only.
- No LLM/network dependency.
- No direct reward/POP, movement, camera, animation, bone, clip, canon or persistence writes.
- Borrowed Signature Triplets require explicit unlock/provenance and a speaker-specific transformed fallback.
- Existing owners remain unchanged: host/mob behavior = WHEN; ChatterBox content = WHAT; bubble modules = visible presentation.

### TESTED RESULT
- Exact implementation blob: `bc3cf5194747bcb71b2b93bcfdec349c9db710f2`.
- Exact test blob: `9af4260f24ab5eeec3656066c38c7962c5208fc9`.
- T01–T25: **25/25 PASS**.
- R01–R04: **4/4 PASS**.
- Total: **29/29 PASS**, 0 failures.
- GitHub Actions evidence: run `36853118451` SUCCESS on evidence head `8c43e23ac1b9cd2d36a1176e6836837db390cff0`.
- No browser/3D/Stage claim.

### ROUTING
- Draft PR: #305.
- Related Resident Social Memory / POI-AIDA / Signature Deck design remains Draft PR #272 and is not replaced.
- KFB Hub + `skills/chat/START_HERE.md` + global additive changelog now route to this kernel candidate.
- Stage: **NOT REQUIRED / NOT PUBLISHED**.

### NEXT GATE
**RESIDENT-CHAT-PRESENTATION-01** — feed deterministic adapter output into one isolated existing `NPC-CARD-SPEC-01` presentation fixture, replacing only its fixed local Triplet recipe. Preserve actors, mouths, gaze, bubbles, renderer, camera and ChatterBox timing ownership. No live LLM yet.
