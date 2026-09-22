# KFB Hybrid Surface Scene Lab v2 · START HERE

Status: **PREPARED · IMPLEMENTATION NOT STARTED**  
Date: 2026-09-22  
Owner: **KFB ToolBox / material-surface compatibility lab**  
Coordinator: Georg / KFB

## Read first

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `skills/chat/masterplan/KFB_3D_STYLE_SURFACE_SCALE_2026-09-22.md`
5. current ToolBox START/Recovery/Return
6. predecessor Hybrid Surface PR #164 and its public Stage

GitHub state overrides chat memory.

## Current proven predecessor

Draft PR: **#164**  
Branch: `chatgpt-web/toolbox-hybrid-surface-scene-2026-09-22`  
Public Stage:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/hybrid-surface-scene-lab/`

Exact proof cast:
- Legacy Orc A · Rig_Legacy
- ActionFigure · Rig_Medium
- GothGirl · Rig_Medium
- FrizzleBob Driver Graft · Rig_Medium
- Black Knight · Rig_Large

Exact room donor:
- World Atlas Dungeon promo recipe `CQ-S1_KAYKIT_DUNGEON_PROMO`

The predecessor is technically public-verified at 41/41. Georg's visual review is the reason for v2.

## Bounded v2 goal

Improve the real-asset proof without changing any consumer/runtime owner.

### Required changes

1. **Clay / grain materiality**
   - visibly stronger than v1;
   - broad macro variation;
   - fine granular/handmade surface tooth;
   - still preserve original base colors/maps.

2. **Preserve useful source gloss**
   - remove the global “everything becomes equally matte” behavior;
   - retain source roughness/specular character and modulate it;
   - do not start with a manual per-material exception matrix.

3. **Seam reduction**
   - the current visible projection/surface seam is a real visual defect;
   - explicitly compare modular joins and actor surfaces.

4. **Head-size-based cast scale**
   - do not normalize total body height;
   - measure head size / accepted head proxy;
   - Legacy should remain shorter than Medium when their heads are normalized;
   - preserve Large as a larger body class;
   - persist family scale factors from measurement.

5. **Same exact donors**
   - no generated stand-ins;
   - no replacement rabbit, knight, goth character or room.

## Protected boundary

Do not:
- replace `pet-surface.v1.js`;
- create another actor/rig owner;
- change gameplay/physics/movement;
- alter World Atlas Dungeon generation ownership;
- integrate into OSM/Race/Wreckman yet;
- merge predecessor PR #164 automatically;
- claim environment acceptance from the room proof.

## Required visible proof

Stage must provide:
- Original ↔ Hybrid v2 toggle;
- Cast-only view showing all five exact actor donors;
- Room-only view;
- integrated room + cast view;
- one diagnostic seam view if the seam is not obvious in the normal framing;
- recorded head-size measurements and final family scale factors.

## Test gate

Automated checks must cover:
- exact source IDs/paths;
- one shared surface texture/field;
- original base map/color preservation;
- source roughness not globally clamped to one value;
- no failed resources;
- no page/console errors;
- 832 px layout.

Automated PASS does not replace visual acceptance.

## Human gate

Georg judges:
1. does the material now read as clay/grain/handmade rather than merely less glossy?
2. is the seam sufficiently reduced?
3. do hair and armour retain useful material highlights?
4. does the Legacy/Medium/Large scale relationship look correct with head-size calibration?

## Named next gate after acceptance

**KFB Environment Style Lab** on one exact OSM/Race environment slice, using the rules in
`skills/chat/masterplan/KFB_3D_STYLE_SURFACE_SCALE_2026-09-22.md`.

That environment gate must cover Hürth/Ehrenfeld/Köln and RaceTrack Cologne sequencing without creating a second World/Race runtime.
