# Paste-ready · WB1-P2R1 Surface Conformance Repair · Fresh Web Chat

@GitHub

Recover the current WorldBuilder P2 candidate from GitHub.

Read:

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `skills/chat/GATE_PROPORTIONALITY_TOKEN_BUDGET_PROTOCOL.md`
5. PR #180
6. `tools/KFB-ToolBox/world-building-preflight/surface-adapter/RETURN.md`
7. `tools/KFB-ToolBox/world-building-preflight/surface-adapter/HUMAN_REVIEW_2026-09-23.md`
8. `surface-core.mjs`, `recipe.mjs`, `demo.mjs`.

GitHub state overrides chat memory.

Current classification:

**WB1-P2 = TECHNICAL PASS · HUMAN FAIL · P3 HOLD**

Do not rerun P0/P1.

Do not discard the proven P2 logical recipe/addressing tests.

## One repair gate only

**WB1-P2R1 · visible surface conformance**

Human failure:

- rigid Hex cells collide/overlap on curved surfaces;
- route reads as a floating/separate debug strip;
- prop support/contact must be rechecked after repair;
- Ripple currently reads as debug FX and must not be confused with final Surface-FX look.

## Important root seam

Current P2 places each rigid Hex tile with one tangent frame at its center.

That proves local orientation mathematically but does not make a large flat tile conform to curvature.

Do not repair this with:
- random scale reductions;
- per-surface hand offsets;
- hiding overlaps;
- changing camera/light;
- creating separate Flat/Sphere/Torus recipes.

## Required bounded approach

Preserve one immutable logical recipe.

Build the smallest presentation seam that makes the same semantic cell patch visibly follow the host surface.

Preferred proof direction:

1. keep semantic Hex IDs / topology / owner data unchanged;
2. derive a surface-conforming visible patch from sampled adapter points, rather than treating the whole large GLTF tile as one rigid tangent plane;
3. keep real KayKit donor identity visible where meaningful, but do not force rigid source geometry to be the macro support surface if curvature makes that physically impossible;
4. route becomes a surface-aligned ribbon/strip built from centerline + local lateral tangent samples, not a round TubeGeometry;
5. prop remains rigid but uses measured local support/contact and local normal;
6. Ripple may stay a clearly labelled DEBUG FX for this gate if its points actually conform to the surface.

This is consistent with the existing architecture:
- semantic/local Hex = authoring/topology;
- continuous/surface-conforming macro support = visible terrain;
- rigid props = local support-frame consumers.

Do not invent a new World owner.

## Human proof

Return one zero-install Stage review showing the SAME fixture on:

- FLAT
- SPHERE
- TORUS

Georg should be able to answer only:

- Do the cells/patch read as one coherent attached surface?
- Does the route hug that surface instead of crossing/floating?
- Does the real prop sit on the local support?
- Any obvious flipped/up/global-Y errors?

No P3 / Claude Design in this chat.

No Work/WSA.

After one bounded repair pass:
- tests;
- Stage review;
- STOP for Georg.
