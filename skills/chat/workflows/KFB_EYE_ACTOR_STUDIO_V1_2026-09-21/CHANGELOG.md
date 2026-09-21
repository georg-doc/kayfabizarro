# KFB Eye Actor Studio v1 · CHANGELOG

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
