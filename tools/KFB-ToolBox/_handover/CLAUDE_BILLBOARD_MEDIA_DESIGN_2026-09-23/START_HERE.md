# START HERE · Claude Billboard / Media Residency Design · 2026-09-23

**Status:** PREPARED CLAUDE DESIGN SLICE · NO RUNTIME BUILD  
**Owner:** KFB ToolBox / Billboard Media Scene presentation  
**Branch:** `chatgpt-web/claude-billboard-media-design-2026-09-23`  
**Base:** `main@8b2b8ec901f27307a8cf0f4097e030020cdf196c`

## Outcome

Produce one visually coherent **Billboard / Media Residency Scene** design prototype that can later be implemented as a reusable Scene Lab / World-Life module.

The design must reuse existing KFB donors rather than invent a second billboard or PDF renderer.

## Read first

1. `CLAUDE_DESIGN_BRIEF.md`
2. current:
   - `tools/KFB-ToolBox/_handover/CLAUDE_DESIGN_WORLD_RACER_2026-09-22/RACER_CLAUDE_HUD_BILLBOARDS_ADDENDUM_2026-09-23.md`
   - `tools/KFB-ToolBox/_inbox/KFB Cologne Race Option C-2/lab-v9/cologne-props.v1.js`
   - `skills/chat/masterplan/CHATTERBOX_TOURBUS_REUSE_2026-09-14.md`
3. planning source:
   - `tools/KFB-ToolBox/_handover/RESIDENT_STORY_ZONE_IDEATION_2026-09-22/BILLBOARD_MEDIA_SCENE_v0.json`

## Fixed donor facts

Existing physical billboard family already exists:

- Kenney `billboard.glb`
- `billboardDouble_exclusive.glb`
- `billboardLow.glb`
- `billboardLower.glb`
- `overhead.glb`
- `overheadLights.glb`
- `bannerTowerRed.glb`
- `bannerTowerGreen.glb`
- KFB Poly billboard donor

Existing Racer code already proves:

- `buildBillboard()`
- `renderCardQuarter()`
- PDF.js/Card rendering
- CanvasTexture → measured billboard surface

Do not rebuild these foundations.

## First Claude design gate

Design **one compact mini-diorama** with:

- one real billboard family donor as the hero object;
- clean small procedural terrain patch;
- 2–3 scenic props/rocks;
- optional small lamp/CCTV/light;
- one measured screen/content surface;
- visible switching between:
  - CARD / PDF;
  - TRIPLET;
  - COLLAGE LOOP.

No video or async LLM required in this first pass.

## Visual tone

KFB roadside media:

- retro roadside / motel / carnival / drive-in energy;
- paper/cutout/collage language;
- bold readable type;
- slightly irregular, not sleek corporate UI;
- physical 3D sign remains visible as an object in the world;
- no generic floating dashboard.

## Hard boundary

This is a **visual/design slice**, not a WorldBuilder/runtime rewrite.

Claude must not:

- build a second billboard owner;
- build a second PDF renderer;
- build a second ChatterBox;
- create a new world/terrain runtime;
- create full video/broadcast infrastructure;
- solve current central model/texture loader problems.

## One next gate

Claude returns a coherent design/export showing the same physical billboard in the three content modes above.

Human visual review decides whether the scene language is accepted before any runtime implementation.
