# KFB × ClayBound · NotebookLM 3D Character Production Demo

Status: **DEMO BRIEF PREPARED · NOT RUN · NO STAGE**  
Date: 2026-09-26  
Owner: **KFB / ToolBox visual exploration**  
Visual donor: **ClayBound / KlayBound POC**  
Runtime change: **none**

## Outcome

Run a deliberately low-effort NotebookLM experiment to see whether a small KFB source pack can produce a coherent **15-slide 3D Character Design Production Deck** in the supplied ClayBound / handcrafted claymation language.

The experiment should answer three practical questions:

1. Does NotebookLM preserve recognizable KFB character identity?
2. Do the supplied ClayBound screenshots materially steer form, material and surface language?
3. Can the deck include useful **seamless texture concepts/prompts** as part of a real 3D character-production page instead of merely describing “clay style”?

## Minimal source pack

Do **not** create extra PDFs, turnarounds or documentation for Demo 1.

Upload only:

1. `NOTEBOOKLM_SOURCE_TEXT.md` from this folder.
2. The three available KFB `.glb` models, **if NotebookLM accepts them as sources**.
3. The existing ClayBound screenshots from the parent reference folder.

If NotebookLM rejects the GLBs or clearly does not use their visual content:
- add only one or two existing screenshots per model from a 3D viewer;
- do not build new PDFs;
- do not create a separate model-sheet workflow just for this test.

Optional only if already available:
- existing animation GIFs / visual animation references;
- an existing KFB content source for a later content-specific run.

## Demo 1 · source set

**Required**
- source text;
- ClayBound screenshots.

**Experimental**
- 3 × KFB GLB.

**Fallback**
- existing screenshots of the GLBs.

The small source set is intentional. Do not dilute the test with unrelated claymation references.

## Target output

NotebookLM should create a **15-slide visual-development / production deck** covering:

1. Character Hero / Design Target
2. Source Character DNA
3. KFB → Clay Translation
4. Shape Language
5. Head & Face
6. Expression Range
7. Body & Pose Language
8. Clay Material System
9. Seamless Clay Textures
10. Secondary Seamless Materials
11. Texture Production Sheet
12. Material Zone Map
13. Claymation / Motion Behaviour
14. KFB Application
15. Final Production Board

The full wording for the NotebookLM source is in `NOTEBOOKLM_SOURCE_TEXT.md`.

## Texture objective

The texture section should not become a generic moodboard.

It should define or propose a small production-ready library such as:
- smooth matte clay;
- fine handcrafted clay;
- lightly worked/compressed clay;
- felt or woven textile where relevant;
- soft matte rubber where relevant;
- paper/cardboard where relevant.

Each texture should be framed as a real 3D material input:
- seamless x/y;
- no border;
- no central object;
- no directional lighting gradient;
- no obvious repeating motif;
- no fake fingerprint cliché;
- subtle enough for animation.

## Visual guardrails

Preserve the actual KFB character.

ClayBound is a **style/material donor**, not a replacement character design.

Avoid:
- generic Pixar-like redesign;
- generic mobile-game mascot styling;
- glossy plastic toy surfaces;
- fake fingerprints;
- obvious procedural noise;
- random dirt/scratches;
- decorative UI chrome;
- unrelated branding.

## Evidence to save after the experiment

If the result is useful, save:
- exported deck or screenshots;
- exact source set actually used;
- short note on whether GLB input was accepted/used;
- strongest 2–3 texture outputs or prompts;
- one-line verdict for each of the three test questions above.

No KFB runtime, Stage route or Live surface is changed by this demo brief.

## Donor references

- ClayBound Style Reference folder:  
  https://github.com/georg-doc/kayfabizarro/tree/main/tools/KFB-ToolBox/_inbox/KFB%20Style%20References/ClayBound%20Cozy%20Platformer%20%2B%20Editor
- KFB KlayBound POC 01:  
  https://github.com/georg-doc/kayfabizarro/blob/main/tools/KFB-ToolBox/_inbox/KFB%20KlayBound%20POC%2001.zip
- Technical ClayBound research / POC:  
  https://github.com/georg-doc/kayfabizarro/tree/main/tools/KFB-ToolBox/_inbox/KFB%20Style%20References/ClayBound%20Cozy%20Platformer%20%2B%20Editor/KFB%20ClayBound-Perplexity%20v1


## NotebookLM prompts

- **Deep Research first:** [PROMPT_B_DEEP_RESEARCH.md](./PROMPT_B_DEEP_RESEARCH.md)  
  Use this to deconstruct the ClayBound look into geometry, seamless textures, Blender shader logic, lighting, animation-safe material rules and a reproducible KFB pipeline.
- **Production Deck second:** [PROMPT_A_PRODUCTION_DECK.md](./PROMPT_A_PRODUCTION_DECK.md)  
  Use this after the Deep Research result has been added back to NotebookLM as a source. It explicitly prioritizes production-ready seamless texture packs, Blender node/shader specs, material parameters, lighting specs, file/package structure and QA over redesigned character illustrations.
- **Base source text:** [NOTEBOOKLM_SOURCE_TEXT.md](./NOTEBOOKLM_SOURCE_TEXT.md)

### Recommended sequence

1. Upload the minimal source set and ClayBound screenshots.
2. Run `PROMPT_B_DEEP_RESEARCH.md`.
3. Add the resulting Deep Research report to the notebook as an additional source.
4. Run `PROMPT_A_PRODUCTION_DECK.md`.
5. Save the useful texture/shader/material outputs and the generated deck for review.

## Next gate

**Run Demo 1 with the minimal source set and preserve the result for visual review.**
