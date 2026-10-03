# KAYKIT-NATIVE-LOCOMOTION-BASELINE-01 · START HERE

Status: **PREPARED · NO RUNTIME · NO MIXAMO**
Date: 2026-10-03
Owner: KFB ToolBox / Animation-Motion authoring
Next executor: **Coworker / Blender MCP**
Draft PR: **#344**
Branch: `coworker/kaykit-native-locomotion-baseline-01-2026-10-03`
Parent recovery: PR #333 @ `18c56bcec5b9f6aab7a6dca71479421a65e8e9ca`

## Why this restart exists

The mixed-source ActionFigure browser freeplay passed technical automation but failed Georg's human motion review as a whole.

Observed HUMAN FAIL:
- step length does not match travel;
- visible wobble / jitter;
- arm pose reads too tight and intersects / presses into the torso;
- gait transitions are not clean;
- jump behaviour is not clean;
- animation timing itself reads jerky.

The conceptual mistake is now explicit:
**KayKit Character Animations 1.1 must be the primary locomotion source for KayKit ActionFigure / Rig_Medium.**
Mixamo / KFB Motion Library is supplementary only after a native-source gap is proven.

This restores the existing canonical rule in:
`tools/KFB-ToolBox/kfb-lib/locomotion-profiles.v1.js`
blob `3db9fbd482e6a527c417e79af826138ff28efa33`.

That file already states:
native KayKit roles are canonical; Mixamo / KFB Motion Library may not overwrite them.

## Exact source actor

`media/3D_Assets/KayKit_Mystery_Series6/6 - December 2023 - Action Figure/character/gltf/ActionFigure.glb`
blob `4785276defdb929cb397954eb74b76aecb84486b`

## Exact animation source

KayKit Character Animations 1.1 · Rig_Medium
commit `b97b5ac55df2724fae623992433685583eece51e`

First-pass GLBs only:
- `Rig_Medium_General.glb` · blob `5d16cb6815fc8371705147188813f851c10ba26a`
- `Rig_Medium_MovementBasic.glb` · blob `98e965e886ec539e80f8984a77a29b0c1c02e5e5`
- `Rig_Medium_MovementAdvanced.glb` · blob `f3ea309627f3ad76b92b85877ebc46f945cd4f1d`

## Existing native measurement donors

1. Canonical KayKit profile:
   `tools/KFB-ToolBox/kfb-lib/locomotion-profiles.v1.js`
   blob `3db9fbd482e6a527c417e79af826138ff28efa33`

2. Joyride J14 ActionFigure profile:
   `tools/KFB-ToolBox/_inbox/KFB_JOYRIDE_J14_CLAUDE_DESIGN_SESSION_CUT_2026-09-30_r1/evidence/j14-locomotion-profile.ActionFigure.json`
   blob `f88522de6a6b087d9ff4d609e8ad0238072a848c`

3. KCL-M1 ActionFigure measurements:
   `tools/KFB-ToolBox/kaykit-motion-lab-v1/evidence/KCL_M1_MEASURED_PROFILE_CANDIDATE.json`

Do not silently choose between J14/KCL speed measurements when they differ.

## Exactly one gate

**KAYKIT-NATIVE-BLENDER-BASELINE-01**

Goal:
prove which original KayKit Rig_Medium locomotion clips look and measure cleanly on the real ActionFigure **before** any controller, transition graph, runtime speed ladder or Mixamo gap-fill.

### Georg

**Du musst jetzt nichts tun.**

### What Georg receives next

One Blender review scene / review package showing the real ActionFigure with the original KayKit locomotion candidates on a grid, plus a KEEP / HOLD / REJECT table.

Only after that result do we decide which native clips become the actual game baseline.
