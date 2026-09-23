# Blender MCP Animation POC · Clown 3-Club Cascade · 2026-09-23

Status: **POC · HUMAN VISUAL PASS (~80 %, cartoon-plausible) · candidate method, not a new runtime owner**

## What this proves

Posing and animating a KayKit character with its own props can be done directly in Blender via the Blender MCP connector (Cowork → local Blender 5.2.2 LTS), driven by the same attachment rules the Resident Atlas already established in three.js. One session went from a plain scene to a checked, looping animation.

Result: KayKit Clown (Rig_Medium) juggles three KayKit juggling pins in a 3-club cascade, 48 frames @ 24 fps, pins held in the fist by the identity rule.

Georg, 2026-09-23, after the viewport preview:
> absolutely believable within cartoon logic · ~80 % · usable as-is, also for the Resident scenery; fine-tuning later.

## Why it matters for production

Proposal (not yet a decision): use this Blender lane for pose/animation authoring in upcoming slices instead of rebuilding the same motion via Claude Design HTML and merging it per slice. Expected benefit: fewer tokens, faster iteration, a real DCC timeline, GLB out.

## Read next

- `RETURN.md` — exact sources, method, measurements, open gates, router writeback text
- `SOURCE.json` — machine-readable pins and metrics
- `kfb_blender_juggle_cascade3.py` — reproducible script (tested from the clean scene)

## Owner boundaries

- Owns: this POC's Blender authoring recipe and its evidence.
- Does **not** own: Animation Lab runtime/playback, Resident Atlas placement, Asset Librarian truth, KayKit source assets, FrankenStein actor/look state.
- Consumer for acceptance: Animation Lab (per the handoff contract: visual playback, pose/orientation, retarget compatibility).

## Exactly one next gate

**JUG-P2 · GLB playback check in an existing three.js consumer (Resident Atlas or Animation Lab), human HTML review.**
