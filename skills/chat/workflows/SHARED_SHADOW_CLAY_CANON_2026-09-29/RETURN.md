# RETURN · SHARED-SHADOW-CLAY-CANON-01

Date: 2026-09-29  
Status: **CANDIDATE · DOCS/ROUTING REPAIR ONLY · RUNTIME UNCHANGED**

## Exact source state

- Repo: `georg-doc/kayfabizarro`
- Base: `main@2602ff6c980894405e970d22e45f7db76da0e1a7`
- Branch: `chatgpt-web/shared-shadow-clay-canon-2026-09-29`
- Draft PR: **#290 · SHARED-SHADOW-CLAY-CANON-01 · canonical routing repair**
- Evidence head immediately before this Return commit: `7bbdec70e17f3da98d884dee696be5bded9aa3d4`
- S5 source branch/pin: `georg-doc-patch-2@3232a1070686896833d6b7942fcd631b9fa8cda6`

The exact final branch head is verified in PR #290 metadata after the Return commit; this file does not attempt to self-embed its own commit SHA.

## What was found

1. The shared shadow/contact solution **was persisted**, but only under session-cut / Inbox paths.
2. The intended stable path `tools/KFB-ToolBox/docs/LESSONS_SHADOWS.md` was missing on main even though other design docs already referred to that location.
3. WB-D2 already contained the accepted world-scale contact fix: fitted/following shadow box, texel snapping, tight near/far, texel-relative normalBias and sunk wall bases.
4. World Integration r2 already contained global `FACADE_RULE`, `FACE_NORMALS`, support behavior and the explicit warning that restoring literal `normalBias = 0.9` would be a regression.
5. S5 Building / Façade Clay Adapter is fully present and structurally clear, but **branch-local** on `georg-doc-patch-2`; a main-only search falsely makes it look absent.
6. S5 is one material generation behind current clay canon: its 27.09 H0 material references predate K2 28.09. New stages use K2 `clay-material.v10` + current relief/toolmix; accepted H0 stays frozen on v8.
7. LOOK-TORSION remains architecture-pass only: cumulative height-dependent torsion, anchored base, shared roof/body final deformation and role/height-dependent magnitude survive; no final universal angle or proxy lighting/shadow acceptance.
8. Current World Core R0A on main is a **visual donor candidate only**. It uses K2 v10 plus `transition-atlas.v1 bend()` for its candidate façade rhythm and does not become a second universal deformation owner.
9. The R0A design footer points at a nonexistent `export/.../START_HERE.md`; the actual handover exists as the sibling root `START_HERE.md`.

## What changed

- added `tools/KFB-ToolBox/docs/LESSONS_SHADOWS.md`;
- added `tools/KFB-ToolBox/docs/CLAY_BUILDING_FACADE_ROUTER.md`;
- updated `skills/chat/START_HERE.md` to route fresh chats to those two stable docs;
- appended `tools/KFB-ToolBox/CHANGELOG.md`;
- appended `skills/chat/CHANGELOG.md`;
- added this bounded workflow `START_HERE.md`, `TEST_REPORT.md`, and `RETURN.md`;
- updated GitHub issue #247 with recovered known-source context while keeping it OPEN.

No runtime source, renderer, deformer, WorldBuilder, OSM presenter, clay material module, Track/Race code or asset was changed.

## Evidence / tests

- GitHub source-resolution audit: **19 / 19 PASS**
- failed checks: **0**
- each branch write was read back from the exact branch and compared against base;
- negative checks explicitly confirmed:
  - stable shadow docs path absent on main before PR #290 merge;
  - S5 path absent on main but present at its pinned branch.
- direct post-audit readback also confirmed the R0A stale footer-path correction in the new router.

Full evidence: `TEST_REPORT.md`.

## Human / public surface

- Browser screenshots: **N/A** — docs/routing only.
- Cloudflare Stage: **NONE**.
- Direct Stage URL: **NONE**.
- Live promotion: **NONE**.
- KFB Hub card/task: **NONE ADDED**. This intentionally follows the no-pseudo-human-gate policy; there is no visual/product decision to review for a documentation repair.
- Existing runtime gate remains issue **#247 GLOBAL-SHADOW-CONTACT-ARTIFACT-FIX**.

## Unresolved

- PR #290 is not merged; until it is merged, the new stable ToolBox docs exist on the branch, not on main.
- S5 remains branch-local on `georg-doc-patch-2`; the router now makes that explicit rather than pretending main contains it.
- Issue #247 still needs actual consumption in the existing rendering/presentation owner plus integrated regression proof.
- World Core R0A remains whatever current GitHub says at review time; this repair does not promote it.
- No performance architecture was chosen for H0/K2 preprocessing/material cost.

## Exactly one next gate

**Review/merge Draft PR #290.**  
After that, issue #247 should implement/consume the stable shadow recipe through the existing shared rendering/presentation owner and verify one representative integrated scene rather than rediscovering the fix.
