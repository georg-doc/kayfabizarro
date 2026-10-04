# FB-LIDS-LEVEL-FIX-01 · Why the clay lids cannot be set level, and the two-line fix

To: Claude Design (ToolBox Production-06). From: Coworker (Blender MCP lane), 2026-10-01.
Reviewed: `KFB_TOOLBOX_CLAUDE_DESIGN_SESSION_CUT_2026-09-30_r2` (main).
Measured in that cut, served locally in headless Chromium: actor `frizzlebob-earrig-v5`, rig eyes on, Georg's MEASURE eye values (dx 0.40, dy 0.21, ring 0.255, oval 1.06/1.04/0.98, tilt −25°, surface seat, turn 0), clay lids hinge / round.

Georg 30.09 / 01.10: "es gelang mir nicht, die neuen augenlider neutral auszurichten/rotieren".

## 1 · Result first

Two defects in `kfb-lib/clay-lids.v1.js` `_lvl()`. Together they make "neutral" unreachable.

1. **"Level" measures against the wrong reference.**
   - r2 levels the lid line to the line through both eyes, *projected into each eye's own plane*. The eyes are turned outward (yaw 25°) and tilted up (pitch 11°). A horizontal line projected into a turned and tilted plane is no longer horizontal.
   - At Georg's settings the lids end up **+5.4° outer corners up on both eyes**. The error grows with yaw × pitch.
   - The socket frame is already level: `socketEyes` builds X = UP × n. So the only thing to remove is the oval tilt.
2. **The roll slider is not mirrored.**
   - `roll` is added unchanged to both eyes, but the eye frames are not mirrored. Roll therefore turns both lids the same way on screen: one outer corner up, the other down.
   - A symmetric error (like the 5.4° above) cannot be corrected with it: roll −5° levels one eye and doubles the other.

Measured: the front-view angle of each lid line (x axis of `kfb-lid-tilt`, projected onto the face plane), + = outer corner up.

| State | Left eye | Right eye |
|---|---|---|
| clay, tilt follow (oval −25°) | −27.5° | −27.4° |
| clay, level (r2) | **+5.4°** | **+5.4°** |
| clay, level (r2), roll −5 | −0.2° | **+10.3°** |
| clay, level (r2), roll +5 | **+10.4°** | −0.2° |
| **clay, level (fix below)** | **−0.2°** | **−0.2°** |
| EyeRig shells, level | −0.3° | −0.3° |

Picture: `FB_LIDS_LEVEL_CHECK.jpg` (headless render, camera slightly above the face; the brows sit off because MEASURE eye values are applied to an actor whose brows were fitted to other anchors) (A follow · B level r2 · C level fixed · D shells follow · E shells level).

## 2 · Fix (replace `_lvl`)

```js
/* LIDS-04: 'level' = remove the oval tilt only. The socket frame (face-mount socketEyes: X = UP × n) is already level to the head;
   levelling to the line through both eyes projected into the turned/pitched eye plane added yaw×pitch error (+5.4° at yaw 25°, pitch 11°).
   roll is mirrored per eye: + = both outer corners up. */
_lvl(e, p) {
  const a = p.tilt !== 'follow' ? -(+e._kfbTilt || 0) : 0;
  return a + (e._sx || 1) * -1 * (+p.roll || 0) * Math.PI / 180;
}
```

Measured with this `_lvl` swapped in at runtime (same page, same values):

| Setup | Left | Right |
|---|---|---|
| level, roll 0 (turn 0, oval −25°) | −0.1° | −0.1° |
| level, roll +5 / −5 | +5.2° / −5.5° | +5.3° / −5.4° |
| level, turn 15 / turn 30 | 0.0° / −0.1° | 0.0° / −0.1° |
| level, oval tilt 0 | +0.1° | +0.1° |
| level, dx 0.52 (yaw 33°, pitch 12°) | −0.4° | −0.4° |

Keep "Normalize slant" resetting level + roll as in r2.

The Blender reference (FB-EYES-LIDS-02 `build.py`) levels the same way: lid frame (h0, v0, n) with h0 = up × n, i.e. the head's horizontal. This answers the question in HANDOVER_BLENDER_MCP §1.

## 3 · Acceptance (numbers, per eye, front-view lid-line angle)

| # | Setup | Pass |
|---|---|---|
| 1 | level, roll 0; turn 0 / 15 / 30; oval tilt 0 / −25; dx 0.345 / 0.52 | \|angle\| ≤ 0.5° on both eyes |
| 2 | level, roll +5 / −5 | both eyes +5° / −5° ± 0.5° (same sign on both) |
| 3 | follow | unchanged from r2 (the fix does not touch follow; measured −30.2° at dx 0.52 / oval −25°) |
| 4 | shells, level | unchanged (\|angle\| ≤ 0.5°) |
| 5 | emotes angry / sad | slant still moves the lids (mirrored, as today) |

## 4 · Other things seen in the r2 cut (not fixed here)

- TEST_REPORT: most new r2 items are NOT_RUN (lid level/roll, mouth-fit acceptance, full self-test, clean run).
- Full self-test, run here on a fresh profile (headless, 167 s): **36 / 38**. FAIL 22 "Stage dot → eye spacing" (dx 0.568 → 0.600, |∂p/∂dx| 0.485). FAIL 24 "Eye turn · side (frog) + inward": splay −0.5 turns the wrong way. Probably a side effect of the surface seat in FB-EYES-LIDS-02; please check it.
- Open lane gates from HANDOVER_BLENDER_MCP: the 12-step edge check for LIDS-02 §2.5 and the mouth-fit measurement on the GLB. Still open.
