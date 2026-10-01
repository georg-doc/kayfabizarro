# KFB Billboard 3D Presentation SSOT/WIP

Status: **CURRENT WIP CONTRACT v0.1 · NOT YET INTEGRATED**  
Date: 2026-10-01  
Owner: Billboard 3D presentation adapter  
Content/engine owner: B1/B2a, defined in `KFB_BILLBOARD_CONTENT_ENGINE_SSOT_WIP.md`

This contract owns physical Billboard bodies, face sockets, mappings and visual variants. It never schedules content, renders PDFs, rotates media or owns playback.

## Protected sources

- B1 keeps Kenney body/posts/frame provenance and its measured face.
- B2a keeps media surface, fit, embed and front/rear ownership.
- `KFB_WORLD_BILLBOARD_CLAY01 ... r2` supplies the current **TUNE/ready** Plain body, stand, face geometry and embed sockets.
- TV and Highway remain optional physical variants, not separate engines.
- Clay comes only through `KFB_CLAYMATION_STYLE_SSOT.md` and its Golden Sample Matrix.

Always show each real source unchanged before adapting it. A loaded URL is not donor proof.

## One face-socket contract

Every carrier exposes named `BillboardFaceSocket` data: stable `faceId` and front/rear role, local transform/normal, measured width/height/aspect, UV basis/orientation/safe region, supported path (`webglTexture`, `canvasTexture`, `css3dEmbed`, `decal`), occlusion/collider policy, LOD class and caller-provided palette/material roles.

An embed binding connects `contentRef + faceSocket + fit + renderMode`. It contains no timer or selection logic.

## Required physical families

### 1 · Claymation Billboard

Use r2 Plain as donor. Simplify ornaments where they harm silhouette, distance readability or instancing. Apply the Clay SSOT at the correct scale: restrained marks, grounded contact, no bright seams, fake base plate or generic recolour. Island/deck palette is caller-owned.

### 2 · Cardboard standee / Pappaufsteller

Build a deliberately flat physical object: die-cut or rectangular printed front, visible light cardboard thickness/edge, folded rear brace/feet or slot stand, optional small clay base only when required, and distinct front/rear roles. It may be character-, card-, slogan- or motif-shaped and consumes the same responsive output through its socket.

### 3 · Mapping onto an existing 3D model

Support named mesh/UV face sockets, bounded decals/projectors and existing screen meshes. Do not add a media engine to the model. The adapter measures the target, creates the socket and hands that measurement to responsive composition. Source identity, rig, collider and gameplay owner remain intact.

## Responsive physical behaviour

- The model reports its real face; it does not stretch its body to fit content.
- Safe areas and crop come from the engine contract.
- Near: full approved media path.
- Middle: cached texture/signature with the same palette/topic identity.
- Far: simple atlas/emissive/signature state; no active video, PDF or uncontrolled CSS3D.
- LOD changes never flip UVs, mirror the rear or restart the scheduler.

## Clay, colour, contact

Read the Clay SSOT, Golden Matrix and `LESSONS_SHADOWS.md`. Billboard models consume island/deck palette and Joyride-style transition roles but do not own them. Validate contact across the whole footprint: no floating feet, bright seams, clipped shadows, terrain poke-through or plinth hiding a failure.

Required Golden candidates are r2 Plain Clay body, one cardboard standee and one mapped verified 3D model, each beside its unchanged source with front, right three-quarter, back and contact views.

## Performance rules

- Share geometry/materials and instance static families when sources permit.
- Cache composed face textures; do not clone canvases/videos per identical instance.
- Put animated/embed faces under explicit visibility and distance budgets.
- Measure 0 / 1 / 4 / 8 / 16 visible Billboards.
- Report triangles, draw calls, active media surfaces, texture memory, update cost and visible frame timing for identical cameras.

## Acceptance proof

The reduced island shows the **same B1/B2a triplet** on r2 Plain Clay, a cardboard standee and one mapped existing 3D model. For each: unchanged source, front, right three-quarter, back, near/middle/far, contact/shadow and safe-area overlay. Prove the rear never mirrors, model switching creates no second ticker and source loss preserves a bounded non-empty surface.

## Handoff rule

Do not export 50 MB design packages. Canonical models and media live at pinned GitHub paths. A handoff contains recipe, socket manifest, changed code, compact screenshots and Return; target **≤5 MB**, hard limit **10 MB**.

## Next gate

`WSA-BILLBOARD-ISLAND-INTEGRATION-01` consumes this in PR #300 only after the three-carrier proof and companion engine tests pass. This document does not claim Stage, Live or runtime integration.
