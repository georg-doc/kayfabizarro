# KFB Feynman Tutor / Shared Adaptive Learning Core · Academy Adapter Note v0.1

**Status:** PLANNING ADDENDUM · NO NEW TUTOR RUNTIME · 2026-10-09
**Academy owner:** KFB AI Game Art Academy / Maker Space. Shared learning-policy owner: `SHARED_ADAPTIVE_LEARNING_ENGINE_V01_2026-10-09` in KFB Production Control.
**Source of truth:** Production Control shared core artifact `c36abe79-a560-4a7f-8286-256784aec1a9` (SHA-256 `a4c2ab12715ffaaddb3e648c5ba6b7aa2105b2a2d804313db99603e193e28ac5`) and domain-adapter contract `cfe2ce46-2b95-431d-afa6-8c4655636b06` (SHA-256 `fc59684a97133c43c85e16b71bb41b8978c82fe8e5d845d1240ad3ec62e3687b`).
**Existing Academy Production Control decision:** `b42a44df-a21c-4281-9592-e6a397868639`. **Current Academy gate remains `ACADEMY_MAKERSPACE_VISUAL_SOURCE_PROOF_R1`.**

## Separation of responsibilities

The core handles: starter-level prior, 3–5 calibrated diagnostic probes (proposed thin-runner policy), ACQUIRE/RETRIEVE/APPLY/BUILD/TRANSFER scheduling, Feynman teach-back, spaced recapture, evidence tiers, retention/readiness and optionally a rank projection.

The **KFB adapter** maps these to actual Blender/Three.js/material/rigging tasks, authoring artifacts and verifiable rendered/tool evidence; it does not own the world renderer, rig/asset store, material language, UI billboard, speech/audio graph, or Academy Site user state.

The **DocCheck adapter** owns medical anchors, authoritative medical rubrics/truth and safety, STT clarification before grading and medical application/transfer. The core does not silently carry KFB evaluation rubrics into DocCheck or vice versa.

Do **not** spin up a shared runtime service. Core is a portable policy/data contract. Domain-specific runtimes and learner records remain separate.

## KFB Maker Space lesson lifecycle

1. **RECAPTURE** prior skill without prompt; starter level is an unverified prior until diagnostics.
2. **SEE** an actual source-isolated demo, e.g. existing KFB `misc_controls_drag` or accepted rig/material donor.
3. **EXPLAIN** the mechanism in the learner's words; ask for predicted effects before showing controls.
4. **MODIFY** a parameter or transform with actual tool state.
5. **BUILD** one independently reproduced object/rig/shader/scene.
6. **SHOW** the resulting rendered, inspectable or recorded evidence on existing KFB MediaSurface.
7. **RECAP** later through retrieval, with separate readiness decay and rank.

A lesson/slide is an interactive object with `SEE, EXPLAIN, MODIFY, BUILD, SHOW, RECAP` fields, not a set of static slides. Future immersive and standalone modes consume the same task, without introducing separate learning engines.

## Evidence levels — per individual skill node

`E0 UNSEEN` → `E1 EXPOSED` → `E2 SUPPORTED` → `E3 INDEPENDENT` → `E4 APPLY/BUILD` → `E5 TRANSFER/TEACH/DEFEND`.

Only tool-/artifact-verified work can claim higher practical levels when the tool is a required evaluator. Text self-report or a plausible verbal description is not evidence that Blender was inspected or a rig built. Record **observer + method + artifact URI/ref + task rubric + timestamp + verdict + limitations** for each promoted evidence level. If no Blender MCP or other actual observation route is active, label the build check UNVERIFIED; allow a reflective text session without fabricating E4/E5 proof.

Starter levels (e.g. Blender intermediate, Three.js familiar, rigging beginner) calibrate node priors, never grant E3/E4 automatically.

## Optional gamified projection

`Cadet → Navigator → Specialist → Captain → Commander`; this is *not* a replacement for per-node mastery or readiness. Ranks reflect demonstrated retained integrated capabilities; review-due or decayed readiness may coexist with an acquired higher rank.

## Character / tutor presentation

FrizzleBob v5, current Cube Pet and KayKit are **candidate visual/character donors, not automatically interchangeable or accepted new runtime owners**. Determine exact current FrizzleBob/Resident/Pet source and visually isolate the real character before adopting a tutor representation. The older Cube Academy phone/cube UI remains historical only. Voice presentation must consume the existing ChatterBox/Audio owner, never a second voice or audio graph.

The tutor should respond to learner actions and contextual evidence: diagnose one misconception, give one bounded next experiment, request teach-back, compare with a rubric, and recapture later. A character animation by itself is not evidence of tutoring.

## Optional shared runner follow-up (not the current gate)

Future executable verification may accept `topic + self-declared starter level + objective + session duration`, generate 3–5 adaptive probes, then yield calibrated skill nodes and an initial ACQUIRE/RETRIEVE/APPLY/BUILD/TRANSFER session. Cross-domain test cases: RAAS in DocCheck and Blender Shader/Rigging in KFB. Test the same policy runner with **different domain truth/evidence adapters**; do not mix medical data, credentials, learner state or engine runtimes.

**Routing invariant:** next Academy gate stays `ACADEMY_MAKERSPACE_VISUAL_SOURCE_PROOF_R1`. Runner implementation is a subsequent separately bounded choice; no parallel World/Academy runtime, no merge, no Site promotion.
