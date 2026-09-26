# RETURN · KFB ClayBound Asset Pipeline · 2026-09-26

Status: **REVIEW · ASSET 01 ACCEPTED · ASSET 03 TWO-PASS RECOVERY COMPLETE · NO STAGE / LIVE**

Repo: `georg-doc/kayfabizarro`  
Branch: `claude/claybound-blender-lane-plan-2026-09-26`  
PR: **#228**  
Owner: **KFB ToolBox / ClayBound material exploration**  
Receiving lane: **Blender / Blender MCP**

## Outcome

The existing ClayBound Blender plan now has a source-safe raster handoff instead of an implicit image-generation assumption.

Persisted:
- Asset 01 human acceptance;
- Asset 02 explicit deferral;
- Asset 03 r2 technical candidate;
- Asset 03 r3 failure evidence;
- deterministic r2 source generator;
- per-asset manifest;
- Blender MCP consumption contract;
- complete two-pass failure-recovery packet.

No KFB runtime, source GLB, rig, material slots, Stage or Live owner was changed.

## Asset 01

**Smooth matte clay · r1**

- 1024×1024 RGB PNG
- SHA-256 `fb952516a6c77448b7107486256798ca201629a3c2fac4397121906dd3c04ea5`
- tile edge equality: **2/2 PASS** · LR 0.00 MAE · TB 0.00 MAE
- Georg: **HUMAN_ACCEPTED**
- Blender state: **NOT YET PROVEN**

## Asset 03

**Rough / porous clay · rough handmade modelling / meso-height**

### r2 · current review candidate
- 2048×2048 16-bit grayscale PNG
- Non-Color relative height
- SHA-256 `f1d3cf4e5bd0b65e9a7d3d61c38b119efa25270e5905ddd36a50796e02f28e69`
- tile criteria: **4/4 PASS**
  - X seam/local 0.898
  - Y seam/local 0.941
  - half-offset X 1.104
  - half-offset Y 1.268
  - threshold < 1.35
- visual status: **HUMAN LOOK OPEN**

### r3 · recovery evidence
- SHA-256 `1b1a595ac8c6c88e52a42bea97a43f804fa6bf3dcfdb1e2176f8e7acc612fe8f`
- broad sculpt/kneading direction improved
- tile criteria: **2/4 PASS · 2/4 FAIL**
- X seam/local 2.123 · FAIL
- Y seam/local 2.079 · FAIL
- half-offset X 1.265 · PASS
- half-offset Y 1.184 · PASS
- state: **DO NOT USE IN BLENDER**

Two repair passes were spent. The slice is frozen.

## Evidence / tests

- Asset 01 edge checks: **2/2 PASS**
- Asset 03 r2 tile criteria: **4/4 PASS**
- Asset 03 r3 tile criteria: **2/4 PASS · 2 FAIL**
- failure-recovery text packet: **7/7 files present**
- Blender 5.2 material tests: **0 run**
- GLB/runtime parity tests: **0 run**
- Stage/browser tests: **0 run**; no Stage exists for this slice

Generator note:
- exact r2 source recipe and pinned authoring library versions are persisted;
- a local exact-reproduction rerun was attempted in this chat runtime but produced no output within the execution window, so **no reproduction-run success is claimed**;
- the reviewed original PNG SHA above remains the byte identity for the human gate.

## Blender MCP

Use:
`BLENDER_MCP_BRIEF.md`

Critical rule:
Asset 03 may be loaded only after Georg's human PASS. Then use it as **Non-Color Height → Bump**, preserve material slots/rig ownership, and prove the smallest copy-only CLAY-B0/B1 case. r3 is never an input.

## Binary storage

The exact PNGs remain review artifacts from this ChatGPT run. They were not guessed into Dropbox and were not assigned a new repository binary owner.

Dropbox title-only recon found multiple historical ToolBox folders but **no unambiguous ClayBound production destination**. Therefore Dropbox remained read-only.

After human acceptance, route the exact byte-identical asset into the existing approved Asset Librarian / production destination.

## Hub / publication

Stage route: **NONE**  
Cloudflare publish: **NONE**  
Live promotion: **NONE**

The existing HUB-CTRL #202 ClayBound lane must point to this PR/Return as the current review state; it remains the Hub/publication owner.

## Exactly one next gate

**GEORG HUMAN REVIEW · Asset 03 r2 look.**

PASS → one isolated Blender CLAY-B0/B1 proof.  
TUNE/REJECT → fresh Asset-03 slice from r3 sculpt language + PR #173 periodic seam donor; no r4 patch here.
