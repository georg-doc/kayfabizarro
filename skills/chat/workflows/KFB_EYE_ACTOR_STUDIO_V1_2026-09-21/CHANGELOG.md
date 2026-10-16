# KFB Eye Actor Studio v1 · CHANGELOG

## 2026-10-16 · Claude Design E1 TUNE · E2 PASS (Georg, V-348) · clay-eyelid intake + Node mesh test

Georg approved Claude Design's **E2 closed clay lid skin** as the KFB lid construction (V-348). E1 stays TUNE, and `thin-clay-lid.v1` stays NEGATIVE FIXTURE.

E2 is one sphere-topology skin around the eyeball (χ = 2), with the lid slit as the only opening. It has 31,360 triangles, and the topology is identical in every lid state. Lid edges follow EyeRig v6 (rest 55.6° / 59.6°). Lid corners are at 105° rest / 118° wide / 80° closed.

New, additive files under `tools/KFB-ToolBox/eye-actor-studio-v1/clay-eyelid/`:
- `clay-eyelid.v1.js` and `clay-eyelid.v2.js`
- `mesh-qa.v1.js`
- `eyelid-bench.v3.js`: v2 with the repo import paths, otherwise unchanged
- plain `index.html` workbench (no Claude Design shell)
- `RETURN_E1.md` and `RETURN_E2.md`
- `ALIEN_STALK_E2_PLAN.md`
- `tests/clay-eyelid-skin.test.mjs`

Donors and `pet-eye-rig.v6.js` are unchanged.

Node test 105/105 PASS. In every state (wide, rest, 25, 50, 75, closed):
- boundary edges 0 raw/welded, non-manifold 0, winding 0, χ = 2, 1 body, volume > 0
- self-intersection 0, degenerate 0, duplicate 0
- 31,360 triangles, index buffer byte-identical

The thin-clay negative control is caught: non-manifold 161, χ 261, degenerate 280, duplicate 118.

Browser figures from the Claude Design workbench, reproduced with the repo-layout `index.html` in Chrome 152:
- self-intersection 0 hits / 442,367 pairs
- min quality 0.026, clearance 1.20 % R
- pupil 0 px with the lid closed in 8 views × 5 gaze directions
- rest front pupil 5,088 px, back 0 px white

Next single gate: `E3-OVAL` (step 6: E2 skin under `e._lids` scaled by `eyeoval.v1`, then mesh + pixel + pupil-seat checks). After that comes `E4-RIG` (step 7: `attachClaySkin(rig)` hull, `_up/_lo` hidden not deleted). EyeRig v6 PR #104 receives only after both.

---

## 2026-10-14 · RG3D Video B transcript received; Claude Design source-first gate ready

Georg supplied second timed transcript as `Eingefügter Text(5).txt` (0:00–18:02), verified content is Raymond Gabriel RG3D, unlike accompanying pasted step-list copied from Video A. Timecoded Video B evidence added to `CLAUDE_DESIGN_EYELID_MESH_RECOVERY_BRIEF_2026-10-14.md`: texture alpha/UV projection; nested armature bones, separate cornea/eye vertex weights, IK/Copy Scale, L/R weight-group correction and 15:46–17:38 Lattice for oval eyeball adaptation. Video does not construct eyelids or prove their shared deformation; proposed simultaneous eye/lid ovalization remains HYPOTHESIS pending 3D proof. Video A rig-only control graph preserved. Both transcripts now received, caption origin unverified. Previous rejected thin-clay mesh remains NEGATIVE DONOR; no new Blender/browser/runtime tests, Site, Stage, merge or Live.

One next gate: `CLAUDE_DESIGN_KFB_EYELID_SOURCE_ISOLATION_AND_CLEAN_MESH_PROOF_01` under existing Eye Actor Studio PR #159, receiver EyeRig v6 PR #104 only after independent clean-mesh visual proof.

---



## 2026-10-14 · Video A transcript analyzed; Video B awaited

Received Georg's exact timecoded text for `y3Q3oD7A1kM` (0:03–8:57); committed a timed 11-step procedure and uncertainty classification to the existing Claude-Design mesh recovery brief. Evidence: independently movable gaze controller using `Track To` -Y / Z; top/bottom pre-existing lid meshes copy X rotation from a lid bone, lower inverted; Y/Z rotation locks; paired master eye/lid controls; neutral frame 1, gaze 25, closed 35, reopened 45. Critical exclusion: **the video teaches rigging, not mesh construction**, and cannot fix prior human-rejected lid tears. ASR uncertainty at 7:03: "eyebones" in eyelid master section. Video B not yet transcribed. No runtime/source edits, test executions, browser/site publish, merge or Live.

Next gate: `EYELID_VIDEO_B_TRANSCRIPT_INTAKE_THEN_CLAUDE_DESIGN`.

---


## 2026-10-14 · Georg HUMAN FAIL overrides previous thin-clay candidate · tutorial evidence intake

Georg explicitly rejected the previous thin-clay render: broken and torn upper mesh, visible cracks/artefacts, unacceptable surface. Previous 30/30 index-level checks are retained as limited diagnostic evidence only. `thin-clay-lid.v1.mjs` is now a **NEGATIVE FIXTURE**, not a usable eyelid donor; no more repair-loop tuning.

Read both original video references and accessible source evidence. Jen Abbott bone-rig video has a verified creator-written procedural companion (Track To gaze, Copy Rotation upper/lower, inverted lower X, master controllers, blink keys). RG3D oval-eye Blender video metadata/description is accessible, **not its transcript**; exact mechanics remain unverified. Neither requested full video transcript was retrieved, and none was invented.

Prepared `CLAUDE_DESIGN_EYELID_MESH_RECOVERY_BRIEF_2026-10-14.md` with strict transcript provenance gate, original donor isolation, explicit topology/winding/self-intersection/pupil-occlusion checks, and single-eye-first Claude Design route. No new code, visuals, suite, Site, Stage or runtime integration this turn. Eye Actor Studio PR #159 remains donor owner; EyeRig v6 PR #104 receiver.

Next: `EYELID_VIDEO_TRANSCRIPTS_SOURCE_PIN_AND_CLAUDE_DESIGN_INTAKE`. No merge or Live.

---


## 2026-10-14 · Thin-Clay Lid single-eye isolated candidate (TUNE)

New same-owner geometry candidate in `thin-clay-lid.v1.mjs`, 30/30 local Node structural checks; `tests/thin-clay-lid.test.mjs` and `thin-clay-proof.html` source-only + candidate browser fixture. Exact existing `clay-lid.v1.mjs` donor was separately rendered in isolation before the candidate and remains unchanged. Six CPU/VTK mesh views inspected. Full closure conceals the central pupil in that controlled fixture; original donor preset occludes the eye already in neutral.

Upper side/rear shell seam still visibly rough after two non-improving tuning passes. **NOT HUMAN VISUAL PASS; NOT INTEGRATED.** Headless Chromium/WebGL failed at GPU init, so browser/Site QA not run, no Site publication, no Cloudflare Stage, no character/FrizzleBob profile change. Repo remains `georg-doc/kayfabizarro`, PR #159, geometry owner Eye Actor Studio; ToolBox/EyeRig v6 PR #104 is only the future receiving consumer.

Next single gate: `EAS1_THIN_CLAY_ISOLATED_BROWSER_AND_UPPER_SEAM_REVIEW` (retain existing EAS1-MOTION-1 motion A/B review separately).

---

## 2026-09-21 · EAS1-A/B/C/D working candidate

Created fresh branch from main@66d6d96b5e8f6ef8fb06a0888baa70d822fb9a69.

Implemented:
- exact EyeRig v6 / BrowRig v2 / EyeOval v1 donor mode;
- Studio shell;
- Eye Cluster 1–4;
- per-eye position, size, W/H/D and Pitch/Yaw/Roll;
- asymmetric pair;
- frog-side pair;
- single / three / four-eye fixtures;
- Clay lids;
- scoped pose shelf;
- 3D sweat/soot preview;
- JSON export;
- desktop/mobile responsive authoring surface.

Evidence at cfead6b064a36075f3c360217ed42c92b065bec3:
- 20/20 static PASS;
- 4/4 syntax PASS;
- 22/22 desktop/mobile WebGL PASS;
- 0 failed resources;
- 0 page/console errors.

GPT/sandbox single-file mirror prepared for fast iteration without Cloudflare.

Open visual issue: Clay lids on extreme frog orientation remain heavy/rim-like.

Next: EAS1-VIS-1 human visual review in GPT workbench.


## 2026-09-21 · Source hosts + CartoonStyle + Rabbit Ear v1

Added source-first host browser using existing owners:
- PrototypePete default;
- modern Mannequin Medium/Large;
- Medium owner catalog;
- reviewed Large profiles;
- Legacy Skeletons / Jack / Witch / Orc;
- Dungeon modular body + 17-head owner catalog;
- Pencil / Rubber props.

Expanded and registered the experimental `KFB_3D_CartoonStyle_v1` skill + interactive HTML with hidden LLM/WSA brief.

Added Rabbit Ear donor A/B:
- exact `ears.v2`;
- candidate Cartoon v1.

Visual repair history:
1. scaled donor-mesh inner zone intersected at root → replaced by independent rounded inner panel;
2. donor outer topology still faceted/torn at tip → replaced visible shell with donor-measured rounded extruded silhouette while retaining ears.v2 placement/pivot/dangle.

Authoritative evidence at `64d16e754a3b149efa64f2b7f3045d42f32e4bca`:
- **51/51 static PASS**
- **10/10 syntax PASS**
- **53/53 browser PASS**
- 0 failed resources / page errors
- artifact `10634917298`

Assistant visual status for Ear v1: **CANDIDATE PASS**. Human acceptance remains open.

Next: **EAS1-VIS-2**.


## 2026-09-21 · REJECTED · mobile 2D fallback + wrong ear donor

User review rejected the latest GPT mobile fallback:
- no recognizable real KFB 3D asset;
- software Canvas simulation substituted for the actual Studio;
- lids read as tubes/lines rather than volumetric clay masses.

Also corrected Rabbit Ear source:
- previous Frizzlegraft/ears.v2-derived styling path was the wrong donor for the requested ear redesign;
- correct donor is repo-exact `Rabbit ears by Poly by Google - 1bLq_k5vHMt.glb`.

Action:
- park ears;
- add `EYELID_GEOMETRY_CONTRACT.v1.md`;
- reduce next build to one real 3D eye + one upper volumetric lid proof.

Next:
`EAS1-LID-1`.


## 2026-09-21 · Upper-lid visual reference pinned

User supplied the missing visual reference for the upper eyelid.

Interpretation locked:
- one closed thick rounded upper-lid mass;
- no tube/stroke/ridge;
- no thin shell as the Clay target;
- the visible lower edge is the end/cut boundary of that mass;
- slant / concave / convex modify this opening boundary while preserving the mass;
- real depth occlusion hides eyeball/pupil.

Next build is reduced to:
**one real 3D eyeball + one upper volumetric lid + front/3/4/side + neutral/cover/slant/concave/convex.**

No Full Studio UI until this passes.


## 2026-09-21 · Dual-lid construction clarified

User corrected the implementation strategy:

- do not isolate one upper lid as the primary build model;
- derive **Upper + Lower together** from one slightly larger eye-enclosing sphere/ellipsoid;
- split that shared volume at the eye opening;
- round the split edges;
- then animate the two halves independently.

This supersedes the earlier one-upper-lid-first build order.

Primary QA is now visual/occlusion-first:
**Do both lids read as two rounded halves of one eye-hugging volume and actually cover the eyeball?**


## 2026-09-21 · GPT self-contained mobile site · 16/16 PASS

Rejected the CDN/importmap GPT page after iOS/GPT showed `Booting…` and an empty stage.

Built a single-file native-WebGL replacement with embedded real Mannequin Medium source geometry and the shared-shell Upper + Lower lid demo.

A syntax defect in the first self-contained attempt (`catch` without `try`) was diagnosed from the browser timeout and repaired without changing eye/lid geometry.

Authoritative head `87c4f4158b2be40dd9e617e54e85397234d0452d`, run `35630127930`:
**16/16 desktop/mobile browser PASS**, 0 external requests, 0 page errors.

Artifact: `10653512609`.


## 2026-09-21 · Lid motion architecture · Sweep / Slide / Hybrid

User questioned the current cover-only motion: lids behave like shutters moving up/down and therefore may have limited expression range.

Decision:
- preserve `cover` as a style channel;
- add spherical `sweep` around an Eye Slot local hinge axis;
- keep canthi approximately anchored through deformation weights;
- add `hingeDepth` and `canthusLock`;
- compare Slide / Sweep / Hybrid in the same Studio.

Recommended default to test: **Hybrid**.


## 2026-09-21 · Lid Motion Lab · 34/34 PASS

Added `Slide | Sweep | Hybrid` to the self-contained GPT/mobile Eye Actor workbench without changing the source host or creating a second lid stack.

Sweep architecture:
- Eye-local X hinge axis;
- optional posterior `hingeDepth`;
- per-vertex sweep weighting;
- `canthusLock` reduces motion at the lid ends;
- Upper and Lower have separate maximum sweep angles.

Authoritative head:
`6c25d5bf9a95571e41ad6402a6d18f3048b0e559`

Run:
`35645949968`

Result:
**34/34 desktop/mobile browser PASS**, 0 external requests, 0 page errors.

Artifact:
`10660252892`.

Assistant visual comparison currently favors **Hybrid** over pure Slide or pure Sweep, but Georg visual selection remains the gate.
