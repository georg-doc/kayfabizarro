# B2B-P1 · Living Mockup / Collage Surface · Build Brief

Status: **READY TO START · HUMAN CHOICES LOCKED**
Date: 2026-09-25
Owner: **KFB ToolBox / Billboard Media Residency**
Base: accepted B2a + B2b research PR #211

## Locked human choices

- Source mix: **KFB + small curated CC0 pool**
- Default visual language: **mixed hypernormalisation**
- Architecture: **A+ CanvasTexture**
- No editor
- No live scraping
- No new media owner

## Read first

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `skills/session-entry-use-what-works_v1.md`
5. `tools/KFB-ToolBox/_handover/BILLBOARD_MEDIA_LIVING_2026-09-24.md`
6. `tools/KFB-ToolBox/_handover/BILLBOARD_B2B_RESEARCH_2026-09-25/OPTIONS_MEMO.md`
7. `tools/KFB-ToolBox/_handover/BILLBOARD_B2B_RESEARCH_2026-09-25/RECOVERY.md`
8. original Gate-1 collage donor: `.../BILLBOARD_B0_SOURCE_PROOF_2026-09-24/bb-scene.js`

## Outcome

Add one real `COLLAGE` mode to the accepted B2a billboard host.

Reuse the existing Gate-1 `drawCollageFace()` / `BillboardContent` donor instead of starting over.

Target pipeline:

`curated asset refs + text refs + recipe + seed → Canvas compositor → one CanvasTexture → accepted billboard face`

## P1 contents

### Pool
Start small:
- KFB card/detail/cover fragments;
- KFB/ChatterBox text fragments;
- **6–12 curated CC0 stills** max.

Preferred external source order:
1. Smithsonian Open Access CC0;
2. Library of Congress Free to Use and Reuse;
3. Chronicling America only where rights/provenance are explicit.

Persist every external file locally with:
- source URL;
- provider;
- title;
- creator/date if available;
- rights string + rights URL;
- retrievedAt;
- hash;
- tags/palette hint.

Runtime must consume local/registry facts only.

### Recipes
Maximum four:
- `HEADLINE_SHOCK`
- `POSTER_STACK`
- `SIGNAL_NOISE`
- `ARCHIVE_FEVER`

### Grades
Maximum four:
- `WARM_DIRTY`
- `COLD_PRINT`
- `ACID_FAIRGROUND`
- `MONO_PAPER`

### Treatments
Two only:
- `FLAT_COLLAGE`
- `LIVING_SCREEN`

`LIVING_SCREEN` may add restrained vignette / emissive feel / reflection streak / print-or-LED hint. Do not build a full post-processing stack.

### Sequencing
Use a seeded PRNG and deterministic no-repeat memory:
- no last-4 hero asset reuse;
- no last-2 recipe reuse;
- no same hero role twice;
- same seed reproduces same sequence;
- different seed differs visibly.

Do not use per-frame `Math.random()` for structural composition.

## Performance bounds

- one CanvasTexture;
- ~1024×576 or 1280×720;
- ≤5 image layers;
- ≤3 text layers;
- redraw on composition/treatment changes or a restrained 12–15 fps motion tick;
- no RenderTarget mini-scene in P1;
- no local VideoTexture layer in P1;
- no EffectComposer foundation.

## Protected

Must remain green:
- CARD;
- COVER;
- VIDEO INLINE;
- SLOGAN;
- accepted B2a front/rear iframe behavior;
- accepted billboard body/face owner.

Do not start:
- B2c Talking City Lights;
- B3 rounded body;
- Curtain C1.

## Proof

Show:
- existing four modes still work;
- COLLAGE front + 3/4 + rear;
- same seed same sequence;
- different seed visibly different;
- 30–45 s no immediate hero/recipe repetition;
- switching away stops collage update work;
- provenance manifest parses and all referenced local assets exist.

## Persistence

Checkpoint in small writes:
1. implementation;
2. tests/evidence;
3. Return/Recovery/CHANGELOG/Living/Hub metadata.

Timeout = UNKNOWN. Inspect branch/ref/files/workflow before any retry.

## Publication

When review-quality:
publish the exact multi-file result under a direct `kayfabizarro.pages.dev/kfb-hub/pruefen/...` route linked from KFB Hub, open it, verify the expected revision, then stop.

## Exactly one gate

**Georg reviews B2b-P1 mixed-hypernormalisation COLLAGE.**
