# KFB Visual Scene Atlas · Claude Design · ACCESS BRIDGE

**Date:** 2026-09-16  
**Status:** `TESTED ACCESS LIMIT / EXECUTION BRIDGE`  
**Scope:** Claude Design input access only. No Registry, ToolBox, runtime, compatibility or queue ownership.

## 1. Tested access limit

Claude Design reported and correctly stopped CQ-001 because the repository importer did not provide the primary GIF for visual inspection.

### TESTED RESULT · Claude Design import surface

- `Weapons- DEMO - BLASTER - GRIP - POSE August2026_UltraHeroTurboMan.gif` exists in `georg-doc/KFB-Stunt-Car-Race@main` but is `10,064,714` bytes and was skipped as oversized (>5 MiB).
- `.gif` did not appear as an importable type in the Design file-selection surface used for this job.
- `.gltf` / `.glb` likewise did not appear as importable source types in that surface.
- `BLASTER+GUN SETTING - contents (5).png` is small enough and was visually inspectable, but it is not a substitute for the GIF.

This is an access/tooling limit, not a failed visual-analysis result.

## 2. Canonical queue does not change

The canonical order remains:

1. CQ-001 · Ultra Turbo Hero Man
2. CQ-002 · Goth Girl
3. CQ-003 · Demon Lord

Do not skip CQ-001 merely because the repo importer cannot ingest the GIF.

## 3. Preferred bridge · direct attachment upload

For CQ-001–003, provide the original reference GIFs to Claude Design as **direct chat attachments**, not through repository import.

Recommended to attach all three at once so the same access interruption does not recur, while still executing only CQ-001 first:

1. `Weapons- DEMO - BLASTER - GRIP - POSE August2026_UltraHeroTurboMan.gif` — 10,064,714 bytes
2. `GothGirl.gif` — 9,151,334 bytes
3. `July2026_DemonLord.gif` — 16,281,019 bytes

Canonical reference mirror:

`georg-doc/KFB-Stunt-Car-Race/_inbox/KayKit_PACKS_References_Scenes_Demos/`

Canonical Dropbox source used by the Asset Atlas:

`/CLAUDE/KFB Stunt Car Race/reference/KayKit_PACKS_References_Scenes_Demos/`

Uploading all three does **not** authorize batch execution. After upload:

- execute CQ-001 only;
- return its three artifacts;
- stop for review before CQ-002 unless Georg explicitly requests a batch.

## 4. Fallback bridge · reduced frame packet

If direct GIF attachment is also rejected, create a bounded private frame packet from the original GIF rather than interpreting filenames.

Preferred packet per GIF:

- 12–20 representative PNG frames covering the full action sequence;
- one contact sheet for quick segmentation;
- a small text manifest containing original GIF filename, source path, frame index/time and derivation note.

Frame packets are **reference derivatives**, not new source masters. Keep them private / inside the existing private reference workflow. Do not publish Patreon/paid reference imagery publicly.

Do not choose only aesthetically attractive frames; preserve entry, action, transition and recovery beats.

## 5. 3D source models are not a CQ-001–003 blocker

The first three canonical jobs can reach:

- **L1 · visual annotation** from GIF/PNG references;
- **L2 · asset-matched** from supplied exact source paths + visual comparison confidence;

without importing the `.glb/.gltf` files into Claude Design.

The source-model links remain provenance and identity evidence.

### DECISION for this execution pass

Do **not** spend time converting or republishing `.glb/.gltf` merely to satisfy Claude Design's importer before L1/L2 are complete.

If later **L3 · static reconstruction** is desired and Claude Design still cannot ingest the models, hand the L1/L2 recipe to an existing 3D-capable owner (Astra / receiving runtime / appropriate KFB authoring surface) for reconstruction.

This preserves the owner model:

`Asset Librarian → visual packet → Claude Design L1/L2 → scene recipe → 3D-capable consumer L3/L5`

## 6. What the visible contents sheet proves

`BLASTER+GUN SETTING - contents (5).png` may be used as visual/source context for CQ-001.

Design has reported that it visibly contains:

- Series 7 / Character 2 contents presentation;
- character T-pose / props presentation;
- Blaster and Sword as separate visible props.

Treat those as `OBSERVED DEMO` only for the contents sheet itself.

The sheet does **not** establish the GIF's grip, hand contact, action pose or runtime attachment transform.

## 7. Resume text for Claude Design

After the direct GIF is attached, use:

> **TRACK: CANONICAL · Resume CQ-001.** The primary GIF is now provided as a direct attachment because repository import skipped the >5 MiB `.gif`. Use the existing CQ-001 packet and source links. Inspect the attached GIF frame-by-frame. Complete only CQ-001's three required return artifacts, then STOP for review. Do not require `.glb/.gltf` import for L1/L2 and do not infer compatibility or attachment transforms.

## 8. Stop rule

If the direct attachment itself still cannot be inspected frame-by-frame, stop again as `UNRESOLVED / ACCESS BLOCKER` and request the reduced PNG frame packet. Do not substitute the contents sheet or filename for the missing animation evidence.
