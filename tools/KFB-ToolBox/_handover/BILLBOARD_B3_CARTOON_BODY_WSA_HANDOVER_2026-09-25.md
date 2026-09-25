# BILLBOARD B3 · Rounded Cartoon 3D Body · WSA / Blender MCP Handover

Status: **PREPARED · NOT STARTED · B2B RESEARCH RUNS FIRST**
Date: 2026-09-25
Owner to receive: **WSA / ToolBox 3D authoring**; **Blender MCP** is allowed if real mesh/topology work is the cleanest route.
Current media owner: **KFB ToolBox / Billboard Media Residency**
Source branch: `chatgpt-web/billboard-b2a-css3d-2026-09-24`
Accepted media checkpoint: B2a / PR **#199**

## Intent

Build a more rounded, cartoon 3D billboard body without replacing the accepted billboard/media system.

The current Kenney donor works functionally but its body/support reads too hard-edged and utilitarian. The next body should feel more like a hand-built KFB cartoon prop: rounder silhouette, chunkier/softer frame and supports, slightly imperfect/asymmetric where useful, while still reading instantly as the same billboard.

This is **body/model work only**. It must not become a second media runtime.

## Protected source / contracts

Start from the accepted donor, never a generic replacement:

`media/3D_Assets/kenney_racing-kit/Models/GLTF format/billboard.glb`

Pinned donor commit:
`378b209355b13304e3cff656ec0806ca5b89df28`

Accepted media-face truth:
- measured B0 face: **4.20 × 2.10 world units**;
- content-fit holder scaling from B1 remains valid;
- B2a inline YouTube/CSS3D remains valid;
- final B2a runtime: `89065825448846beb2649082fc0c1bf25df20ccb`;
- rear-side contract: CSS3D media is front-only; the 3D billboard body owns the backside;
- current public reference: https://kayfabizarro.pages.dev/kfb-hub/pruefen/billboard-b2a/.

Do not change:
- card / cover / slogan content owners;
- CSS3D YouTube owner;
- face aspect contract;
- front/rear media semantics;
- KFB card registry/PDF runtime;
- camera/orbit owner.

## Style references already in KFB

Use these as **design-language references**, not as replacement owners:

1. **KFB Elastic / Grotesque / Clay direction**
   - `tools/osm-city-lab/experiments/elastic-grotesque-clay-huerth01/elastic-grotesque-clay.mjs`
   - accepted V2 geometry reference at `0c59e92d9d8688f5a88cd309ae8891dcd174c2fc`.
   - Take the principle: softened/elastic masses, fewer razor-straight seams, readable silhouette.

2. **KFB hand-built cartoon staging direction**
   - skewed/asymmetric physical geometry;
   - strong silhouette;
   - 1990s hand-built cartoon staging is a reference language, not an asset/style copy target.

## WSA decision rule

### Web/Three first only if:
- the accepted Kenney mesh can be made convincingly rounder with a small non-destructive deformation/material pass;
- silhouette and backside remain structurally clean;
- no topology surgery is required.

### Blender MCP preferred if:
- frame corners/posts/support feet need true rounded/chunky topology;
- silhouette needs authored bulges/tapers/asymmetry;
- the backside/casing should become a coherent solid object;
- a reusable GLB should replace ad-hoc runtime deformation.

Blender MCP is therefore **allowed but not mandatory**.

## Required first gate: source-object comparison

Before integration:
1. show the exact accepted Kenney billboard in isolation;
2. show one rounded-cartoon candidate beside it;
3. same camera, same scale, front / 3/4 / side / rear;
4. keep the media face rectangle/anchor measurable and unchanged;
5. no card/video content needed in this first comparison.

A loaded asset URL is not proof. Show the actual source object and candidate visibly.

## Target anatomy

Keep:
- one clear media face;
- one coherent rear casing/body;
- two/support structure if still visually useful;
- stable feet/contact;
- readable side thickness.

Tune:
- round frame corners / softer edge radii;
- slightly chunkier frame;
- softer/chunkier posts/supports;
- less perfectly mechanical joins;
- possibly subtle taper/bulge/asymmetry;
- rear casing should read as one cartoon prop, not a thin plane.

Avoid:
- generic glossy ad-tech kiosk;
- sci-fi chrome;
- inflatable toy look;
- excessive bevel noise;
- replacing the billboard with a new brand/object;
- changing media aspect to make the body easier.

## Integration gate after body acceptance

Only after Georg accepts the isolated body:
- bind the existing B1/B2a measured media face to the new body;
- prove CARD / COVER / VIDEO INLINE / SLOGAN still work;
- prove rear view still hides CSS3D video;
- Save/registry metadata may point to the new authored GLB, but media owners remain unchanged.

## Deliverables

Return:
- exact source and candidate GLB/Blend path;
- Blender MCP or Web method used;
- before/after front / 3/4 / side / rear screenshots;
- measured face dimensions and anchor transform;
- changed files;
- tests/evidence;
- unresolved items;
- one next gate.

Do not merge or promote Live automatically.

## Scheduling note for WSA

This handover is **prepared only**. Georg asked to continue first with **B2b Living Mockup / Collage research/options**. Keep B3 visible in WSA/Production Desk, but do not start modeling until the media-surface research choice is recorded or Georg explicitly starts B3 in parallel.
