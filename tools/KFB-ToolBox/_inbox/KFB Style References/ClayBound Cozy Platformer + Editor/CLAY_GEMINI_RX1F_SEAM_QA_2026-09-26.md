# CLAY-ASSET-01 · Gemini rx1f Seam QA · 2026-09-26

Status: **QA COMPLETE · NEEDS FIX FOR ASSET 1 · SOURCE PRESERVED**

Owner: **KFB ToolBox / ClayBound material exploration**  
Candidate producer: **Gemini**  
QA branch: `chatgpt-web/clay-gemini-seam-qa-2026-09-26`

## Source

- file: `Gemini_Generated_Image_rx1fvxrx1fvxrx1f.jpeg`
- repository path: `tools/KFB-ToolBox/_inbox/KFB Style References/ClayBound Cozy Platformer + Editor/Gemini_Generated_Image_rx1fvxrx1fvxrx1f.jpeg`
- Git blob: `d2ecee01172f0e87a47bde9d923eb7abfc3c0333`
- bytes: `3,100,820`
- decoded dimensions: **2048 × 2048**
- format/mode: **JPEG / RGB**
- decoded-file SHA-256: `7f6fe45b7553d892e686a519a11f3f51d70e7234008b3d9155b323d1b19cbb47`

## Automated edge evidence

GitHub Actions:
- workflow run: **36257239128**
- tested head: `eb3fc60bee9b8030b68d08dd27116e5aa229546b`
- job: **108446236219**
- result: **PASS**
- substantive QA steps: **6/6 PASS**
- evidence artifact: **10911321215**
- artifact name: `clay-gemini-rx1f-seam-qa`
- artifact digest: `sha256:bd61a384798c310fd7a87a4b337d6c3ae11b5a37d22d296dda6db96599349778`

Measured RGB edge continuity:

| Axis | Opposite-edge MAE | Mean ordinary adjacent-pixel MAE | Ratio | Classification |
|---|---:|---:|---:|---|
| X / left-right | 5.651855 | 4.157863 | **1.359317** | **BORDERLINE** |
| Y / top-bottom | 5.849284 | 5.350120 | **1.093300** | **LIKELY_CONTINUOUS** |

The ratio is a bounded QA heuristic: it compares the edge discontinuity to ordinary local image variation. It is **not** mathematical seamlessness certification. JPEG compression can also perturb boundary pixels.

## Visual evidence

The workflow produced:
- `repeat_3x3.jpg`
- `offset_center.jpg`
- `metrics.json`

The 3×3 repeat and center-offset image were inspected.

### Positive

- no catastrophic hard line appears across the horizontal repeat boundary;
- the source has convincing tactile clay micro/meso surface language;
- color/lighting is sufficiently even for a material-source candidate;
- the Y boundary behaves close to ordinary local variation.

### Blocking for Asset 1

The large pressed / smeared clay forms are highly recognizable when tiled. The same macro blobs repeat in a clear grid in the 3×3 preview.

This fails the current Asset-1 requirement:
**smooth matte clay base with restrained, non-dominant variation and no obvious repeating motif.**

The X edge is also only **BORDERLINE**, not a clean technical PASS.

## QA verdict

**CLAY-ASSET-01: NEEDS FIX**

Reason:
1. **repeat detectability / macro motif = FAIL for smooth base clay**;
2. **X periodic edge = BORDERLINE**;
3. Y periodic edge = technically plausible.

This does **not** mean the image is visually bad.

It is a strong donor/candidate for a later:
- compressed clay;
- kneaded clay;
- worked / hand-smeared clay

surface, where stronger meso forms are intentional.

Do not advance the queue because of this alternate candidate. The current human-approved / plugin candidate path remains separate.

## Repair guidance if this candidate is revisited

One bounded repair pass should:
- reduce macro relief amplitude;
- remove or break up the largest recognizable pressed blobs;
- preserve tactile fine irregularity;
- enforce stronger left/right periodic continuity;
- re-run 3×3 + center-offset + edge-ratio QA.

No repair is executed in this slice.

## Exactly one next gate

**Continue the current CLAY-ASSET-01 review path; do not promote Gemini rx1f as the smooth matte base texture.**
