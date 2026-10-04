# RETURN · KFB Fluff Work Motion Pack 01 · Briefing Ready

Status: **BRIEFING_READY · BLENDER PART 1 NEXT**  
Date: 2026-10-04  
Repo: `georg-doc/kayfabizarro`  
Branch: `planning/fluff-blender-slice-01-2026-10-04`

## What changed

The original Site-only Fluff brief was hardened for Blender MCP after executor review.

The slice is now explicitly **reuse-first**:

1. audition existing motions;
2. prove actor rigs;
3. show Medium / Large / High-Fluff / Low-Fluff in isolation;
4. complete the reuse matrix;
5. author only genuine gaps.

## Source findings locked into the brief

- Robot One = **Rig_Medium / 23 joints**.
- Robot Two = **Rig_Medium / 23 joints**.
- current `KayKit_Skeletons/Skeleton_Minion.glb` = **Rig_Medium** worker candidate.
- the older Disco Skeleton Minion is **Rig_Legacy** and is not the default worker source for this slice.
- `Rig_Large_Tools.glb` does **not** exist.
- Rig_Medium already provides reusable `Interact`, `PickUp`, `Throw`, `Work_*`, `Working_*`, `Holding_*`, `Hammering`, `Pickaxing`, `Sawing`, etc.
- the accepted KFB Motion Library already provides a two-rig Medium/Large base and a dance family.
- the Utopia Robot charging-station donor is real and exact:
  `media/3D_Assets/KayKit_Mystery_Series6/12 - June 2024 - Robot/assets/gltf/Robot_ChargingStation.gltf`.
- High/Low Fluff look must derive from the existing K1/K2 Knet toolchain, not an invented generic sphere style.
- Life-Tree pickup remains walk-over/proximity; no crouch/bend pickup action.

## Files

- `START_HERE.md` — binding Blender MCP executor brief.
- `REUSE_MATRIX.md` — mandatory role → existing clip / gap audit before authoring.
- `RETURN.md` — this checkpoint.

## Evidence / tests

This checkpoint is a source/briefing audit, not Blender output.

Verified by repository evidence:
- Motion Library source/Return read.
- Registry motion inventory read.
- Robot One / Robot Two rig evidence located.
- current Skeleton Minion Rig_Medium evidence located.
- Legacy Skeleton Minion conflict identified.
- missing `Rig_Large_Tools.glb` confirmed in Resident Atlas Recovery.
- exact Robot Charging Station source located.
- K1/K2 clay source path identified.

No animation was authored or runtime-tested by this chat.

## Blender Part 1 required return

Blender MCP returns:

- completed `REUSE_MATRIX.md`;
- Medium/Large audition evidence;
- Robot One / Robot Two / current Skeleton Minion evidence;
- High- and Low-Fluff isolated look probes;
- explicit list of genuine missing motions.

Only then does Blender proceed to Part 2 authoring.

## Exactly one next gate

**BLENDER PART 1 · SOURCE AUDITION + REUSE MATRIX**

No WorldBuilder implementation yet.


## 2026-10-04 · Mass Ladder / Bigger Picture update

The Blender brief now also carries the first-pass Fluff Mass Ladder:

- 6 Small Fluff → 1 Medium Fluff;
- 3 Medium Fluff → 1 Large Fluff;
- therefore 18 Small → 1 Large.

Default handling:
- one Rig_Medium rolls one Medium ball;
- one Rig_Large rolls one Large ball;
- 2–3 Rig_Medium may cooperatively roll/place one Large ball.

The resulting Medium/Large ball may preserve marbled color mixing from its source balls.

Optional motion/reference extensions added to the audit:
- cooperative Large-ball push;
- foot-driven roll;
- ball balance;
- ball dance;
- ball surf.

These are secondary variants. Blender must not delay the core roll/work pack for them.

Bigger-picture context is now explicit: Life Tree harvest → Fluff consolidation → rolling/work/dance → buildings/props/gifts/dungeons → damage/debris → recycling → Fluff again.

World/runtime ownership remains unchanged.
