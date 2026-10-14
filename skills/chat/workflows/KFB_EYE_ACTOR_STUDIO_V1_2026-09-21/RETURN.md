# KFB Eye Actor Studio v1 · RETURN


## SOURCE EVIDENCE UPDATE · 2026-10-14 · VIDEO A TRANSCRIPT RECEIVED

Georg supplied the English timecoded (0:03–8:57) transcript for Jen Abbott's Blender cartoon eye-rig tutorial `y3Q3oD7A1kM`. Exact 13-row sequence and cautions are recorded in `CLAUDE_DESIGN_EYELID_MESH_RECOVERY_BRIEF_2026-10-14.md`: separate already-modelled eye/top/bottom objects; gaze `Track To` (-Y / Z); `Copy Rotation` X to both lids with `Invert X` on lower; lock Y/Z rotation; mirrored .L set; shared eye and lid master controllers; keyframes 1 / 25 / 35 / 45. Caption ambiguities ("Track 2"; "eyebones" at 7:03 during eyelid master parenting) explicitly flagged. **No eyelid mesh modelling/topology is demonstrated** and Blender's bone constraints are NOT adopted as a second KFB runtime. Source was user-provided timecoded text; origin as manual/auto captions not verified. Video B `hTl825DO-Aw` transcript **STILL PENDING**.

The prior Thin-Clay HUMAN VISUAL FAIL remains binding. No new mesh, source donor promotion, visual review, browser test, Site publication, merge or Live. Existing PR #159 donor owner + EyeRig v6 PR #104 consumer ownership unchanged. One next gate: `EYELID_VIDEO_B_TRANSCRIPT_INTAKE_THEN_CLAUDE_DESIGN`.

---


## HUMAN OVERRIDE · 2026-10-14 · THIN-CLAY GEOMETRY VISUAL FAIL

Georg has **REJECTED** the rendered `thin-clay-lid.v1.mjs` candidate: severe mesh destruction, visible cracks/tear edges and broken top surface. This overrides the earlier `SOURCE-ISOLATED CANDIDATE` presentation and any optimistic statement about geometry quality. The 30/30 structural checks only exercised narrow mesh-index invariants and **did not** prove usable/watertight-looking geometry; local central-pupil pixel counts do not certify full lid/iris/gaze occlusion. Candidate is preserved **NEGATIVE DONOR ONLY**, excluded from EyeRig-v6 actor consumption, tuning and Site integration. Do not repeat failed procedural patch loops.

Technical recovery direction: Claude Design should independently inspect actual original `clay-lid.v1.mjs` and `upper-lid-volume.v1.mjs`, the current eye geometry SSOT and both tutorial sources before designing a cleaner shared-shell lid. Full timecoded transcripts of the two requested tutorials have **not** been retrieved; the Jen Abbott creator-written tutorial was checked, and the RG3D video description only. Do **not** equate either with a verbatim transcript.

Source-backed transcript intake, failure analysis, strict topology / animation / QA assignment:
`skills/chat/workflows/KFB_EYE_ACTOR_STUDIO_V1_2026-09-21/CLAUDE_DESIGN_EYELID_MESH_RECOVERY_BRIEF_2026-10-14.md` (prepared and source read back).

**Status:** HUMAN VISUAL FAIL · RESEARCH/BRIEF PREPARED · NO CLAUDE DESIGN RUN · NO NEW TEST EXECUTION/SCREENSHOTS · NO SITE/STAGE.
**Owner:** Eye Actor Studio PR #159 geometry donor; ToolBox / EyeRig v6 PR #104 receiving owner. No second runtime or profile edits.
**One next gate:** `EYELID_VIDEO_TRANSCRIPTS_SOURCE_PIN_AND_CLAUDE_DESIGN_INTAKE`. Gather/verify video captions or timecoded evidence, then run the design build source-first. No merge/Live.

---


## CURRENT ADDITIVE · 2026-10-14 · THIN_CLAY_LID_SINGLE_EYE_PROOF · SOURCE-ISOLATED CANDIDATE

**Scope:** bounded geometry proof inside existing Eye Actor Studio donor owner / Draft PR #159; KFB ToolBox / EyeRig v6 / Batch PR #104 remains the *receiving* rig/profile owner. No replacement EyeRig, actor cleanup change, profile mutation, second face driver, merge or Live.

**Base:** current `clay-lid.v1.mjs` exact source blob `30201095b2f686ba3a78b8512e7cee37d07e30b7` (source-only isolation). The unmodified donor's default `upper=.56π, lower=.44π` overlaps in neutral, visibly occluding the pupil in the isolated VTK baseline. Existing `upper-lid-volume.v1.mjs` remains preserved.

**Candidate files:**
- `tools/KFB-ToolBox/eye-actor-studio-v1/thin-clay-lid.v1.mjs` — shared eye sphere / paired geometric clay shells, integrated rounded margin, independent upper/lower positions controlled by blink, thickness 0.085 eye radius; optional Three BufferGeometry adapter.
- `tools/KFB-ToolBox/eye-actor-studio-v1/tests/thin-clay-lid.test.mjs` — 30 structural assertions across open / half / closed, upper and lower (including index edge-manifold and closure overlap).
- `tools/KFB-ToolBox/eye-actor-studio-v1/thin-clay-proof.html` — explicit source-isolation WebGL2 fixture importing the actual `clay-lid.v1.mjs` donor and candidate. **Not browser-verified or published.**

**Executed local QA:** `node` geometry tests **30/30 PASS**; six CPU/VTK off-screen render views inspected (actual 3D mesh data: donor neutral, candidate neutral/half/closed/front/3⁄4); image-pixel QA: neutral pupil dark component 4640 px (76×76), closed 0 dark connected components ≥8 px in central 350×300 ROI; iris region neutral >0, closed=0. These are only local fixture results. The current PR source was read back after creation. No GitHub Actions suite rerun; no Stage or Site/browser verification. Headless Chromium WebGL initialisation failed (GPU EGL / SWANGLE), so record as **BROWSER UNVERIFIED**, not success.

**Known unresolved defect:** a conspicuous seam/crease along upper rear/side clay shell persists in the local 3D renders. Two non-improving visual smoothing passes ended; preserve this candidate, do not keep repair-looping or integrate it into approved actor profiles. Visual morphology is **TUNE / NOT HUMAN ACCEPTED**, even though closed-lid pupil masking and topological structure pass. Pupil radial test models an inset surface patch; protruding/independently animated pupils need separate negative QA. No FrizzleBob v5 head fit, KayKit character integration, motion-parity, or source-cleanup acceptance is claimed.

**Delivery:** owning GPT Site remains `https://kfb-eyerig-workbench.frizzlebob.chatgpt.site/`; **not updated**. Site-capable publisher needed for actual browser render of isolated original/candidate. No Cloudflare route required for this read-only proof.

**One next gate:** `EAS1_THIN_CLAY_ISOLATED_BROWSER_AND_UPPER_SEAM_REVIEW` — run the existing fixture in a real Site-capable browser, independently inspect upper seam + neutral + full pupil occlusion; repair only the smallest proven seam in the existing geometry owner before any EyeRig v6 consumer adoption. Preserve the previously open EAS1-MOTION-1 comparison.

---

**Date:** 2026-09-21  
**Status:** TECHNICAL BROWSER PASS · HOST MATRIX PASS · CARTOONSTYLE SKILL WIRED · RABBIT-EAR CANDIDATE PASS · GPT WORKBENCH · PUBLIC NOT VERIFIED · HUMAN GATE OPEN  
**Repo:** `georg-doc/kayfabizarro`  
**Branch:** `chatgpt-web/toolbox-eye-actor-studio-v1-2026-09-21`  
**Draft PR:** #159  
**Base main at branch creation:** `66d6d96b5e8f6ef8fb06a0888baa70d822fb9a69`  
**Tested head:** `64d16e754a3b149efa64f2b7f3045d42f32e4bca`

## Outcome

Eye Actor Studio v1 is now source-first and host-aware rather than a neutral-head-only experiment.

It preserves existing owners while adding a richer ToolBox authoring surface for:
- source host inspection;
- Eye Cluster authoring;
- Clay lids;
- scoped expressions;
- 3D emanata;
- Rabbit Ear donor A/B.

## Eye Actor core

Per eye:
- XYZ position;
- overall size;
- W/H/D;
- Pitch/Yaw/Roll;
- quaternion export;
- local gaze;
- independent lid state.

Eye count:
**1–4**.

Fixtures:
- frontal pair;
- unequal asymmetric pair;
- frog-side pair;
- single eye;
- three eyes;
- four eyes.

Acting:
- all / selected / primary pair;
- neutral / skeptical / tired / angry / surprised / selected-eye aim.

## Source hosts

Default:
**Legacy · Prototype Pete · template**

Proven host paths/families include:
- PrototypePete;
- Mannequin Medium / Large;
- Medium owner catalog;
- reviewed Large owner profiles;
- Legacy Skeletons;
- Legacy Jack/pumpkin;
- Legacy Dungeon modular bodies + 17-head catalog;
- Pencil short/long;
- Rubber / Eraser.

Browser-proofed examples:
- Mannequin Medium;
- GothGirl;
- Orc Brute;
- Skeleton Warrior;
- Jack;
- Dungeon Knight + Rogue Head C;
- Pencil B short;
- Eraser.

Existing owner catalogs/adapters were reused on their original paths; Eye Actor Studio did not create a second resident/profile database.

## Rabbit ears

A/B modes in the Studio:
- none;
- exact `ears.v2` donor;
- Cartoon Style v1 candidate.

Retained behavior owner:
`kfb.ears/0.2`.

Candidate styling:
- clean rounded outer toy/clay shell driven by donor-measured dimensions;
- wider visible rim;
- separate rounded inner-ear geometry;
- outer FrizzleBob `Main` zone: **#f2c93a**;
- inner `Main_Light` zone: **#e7b772**;
- dangle/pivot/placement unchanged from `ears.v2`.

Two visible repair passes were used:
1. independent inner panel fixed self-overlap;
2. donor-measured rounded outer shell removed the remaining faceted/torn tip.

No third repair pass was used.

Assistant visual status:
**CANDIDATE PASS**.

Georg acceptance:
**OPEN**.

## KFB 3D CartoonStyle skill draft

Expanded:
- `skills/KFB_3D_CartoonStyle_v1.md`
- `skills/KFB_3D_CartoonStyle_v1.html`

The interactive viewer starts with the exact Tiny Treats Charming Kitchen toaster donor and provides DO/DON'T examples. A hidden machine-readable LLM/WSA briefing contains onboarding, source links, boundaries and the additive problem→cause→repair→evidence method.

Status:
**EXPERIMENTAL**, not immutable canon.

## Tests

Authoritative run:
`35591372998`

- **51/51 static PASS**
- **10/10 syntax PASS**
- **53/53 desktop/mobile WebGL PASS**
- **0** failed resources
- **0** page/console errors

Artifact:
`10634917298`

Digest:
`sha256:18f9de169f5b3c6a3c6863a6e5de2b96d6506ef082e9ca4e30e4c93e5fdcc81b`

## GPT workbench

The current ChatGPT session has the fast sandbox/GPT workbench for design iteration without Cloudflare propagation delays.

It is a work surface, not KFB Stage and not PUBLIC_VERIFIED.

## Unresolved

- human review of Clay lids, especially lower-lid mass and extreme orientations;
- human review of Rabbit Ear silhouette/rim/inner-zone proportions;
- full `face > body > main` resolver across all host types;
- UV/texel-scale debug for textured hosts;
- Hunky/Dory;
- vehicle/other prop consumers.

## Stage

Intended:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-actor-studio/`

**PUBLIC_VERIFIED: NO.**

## Exactly one next gate

**EAS1-VIS-2 · Georg visual review in the GPT Studio of:**
1. source host → Eye Cluster;
2. Clay lids;
3. exact ears.v2 → Cartoon Ear v1 A/B.

Do not start Hunky/Dory or promote Live before that visual gate.


---

## 2026-09-21 · CORRECTION / REJECTION

The previous GPT mobile fallback is **REJECTED**.

Reason:
- it showed no real repository 3D asset;
- it replaced the 3D Eye Actor system with software-2D drawing;
- its eyelids read as tubes/strokes rather than volumetric cartoon/clay masses.

This fallback is not evidence and must not be reused.

The Rabbit Ear candidate documented earlier in this Return is also **REJECTED FOR DONOR MISMATCH**.

Correct ear donor, now repo-pinned:
`media/3D_Assets/KFB/Rabbit ears by Poly by Google - 1bLq_k5vHMt.glb`

Registry source:
- asset identity: repo-exact
- blob: `2d792ab62fb899cc67da2f24afa7ed27f305755c`
- pinned commit: `378b209355b13304e3cff656ec0806ca5b89df28`
- size: 11,180 bytes

The ear slice is parked until the Eye Studio lid gate passes.

### Current next gate

**EAS1-LID-1 · single real 3D eye + one real volumetric upper clay lid.**

Human question:

**Does the lid read as a thick clay/cartoon mass physically covering the eyeball, with a rounded outside and crisp eye-facing occlusion edge?**


---

## 2026-09-21 · GPT self-contained mobile recovery

The prior GPT HTML that depended on external Three.js scripts is **REJECTED** as a mobile work surface: iOS/GPT showed HTML/CSS but stayed at `Booting…` with an empty stage.

The replacement is:
`kfb-hub/stage/toolbox/eye-actor-studio/gpt-selfcontained/index.html`

Properties:
- classic inline JavaScript only;
- native WebGL;
- no CDN;
- no importmap;
- no module loader;
- no iframe;
- exact `Mannequin_Medium.glb` source compacted and embedded into the HTML;
- 6675 real source vertices / 20748 indices;
- Upper + Lower lids generated from one larger eye-enclosing shell;
- Neutral / Half / Full Blink / Skeptical / Slant / Concave / Convex / Frog;
- mobile-first controls.

Authoritative test:
- head `87c4f4158b2be40dd9e617e54e85397234d0452d`
- workflow run `35630127930`
- **16/16 browser PASS**
- desktop 1280×820
- mobile 390×844
- 0 external failed requests
- 0 page errors
- artifact `10653512609`
- digest `sha256:71e93057a3b5f38b7c295f5f97ba722020c4c889c6d1f32a90ceb5e33294497d`

This proves the GPT/mobile boot surface, not Georg visual acceptance of the lid shape.

Next gate:
**review the self-contained GPT site visually and tune the dual-lid shape only after Georg feedback.**


---

## 2026-09-21 · Lid Motion Lab · Slide / Sweep / Hybrid

The self-contained GPT/mobile workbench now compares three motion architectures on the **same shared-shell Upper/Lower lid geometry**:

- **Slide** — opening boundary moves; lid body stays mostly static.
- **Sweep** — lid front body rotates/deforms around an Eye Slot local X hinge axis.
- **Hybrid** — spherical sweep plus smaller boundary slide.

New author controls:
- `upperSweep`
- `lowerSweep`
- `hingeDepth`
- `canthusLock`

Default candidate:
**Hybrid**

Current defaults:
- upper sweep: 44°
- lower sweep: 30°
- hinge depth: 0.025
- canthus lock: 0.72

Technical evidence:
- tested head `6c25d5bf9a95571e41ad6402a6d18f3048b0e559`
- workflow run `35645949968`
- **34/34 browser PASS**
- desktop 1280×820
- mobile 390×844
- real embedded Mannequin Medium remains 6675 vertices
- Upper + Lower both present
- Slide/Sweep/Hybrid state proven
- Full Blink state proven in all three modes
- Frog yaw 78° preserved in Hybrid
- 0 external failed requests
- 0 page errors
- artifact `10660252892`
- digest `sha256:8b46eccaa6e9b3b513315cde27b8b2160b814094925112be58e29c14d4fde17f`

Assistant visual observation:
- **Slide** closes reliably but reads most like a shutter / simple cover mechanism.
- **Sweep** makes the lid bodies visibly travel around the globe and therefore gives more acting potential, but pure Sweep currently produces a more mechanical/offset seam at full closure.
- **Hybrid** preserves the globe-hugging motion while using a smaller boundary shift to achieve a cleaner closure. It is the current best candidate to continue.

This is not Georg acceptance.

Next gate:
**EAS1-MOTION-1 · Georg compares Slide / Sweep / Hybrid in the GPT site and selects the preferred motion basis before further expression tuning.**
