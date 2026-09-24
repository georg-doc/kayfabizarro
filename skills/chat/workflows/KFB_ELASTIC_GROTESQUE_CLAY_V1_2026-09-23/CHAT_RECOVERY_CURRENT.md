# CHAT RECOVERY CURRENT · KFB Elastic Grotesque Clay · Hürth 01

Updated: **2026-09-24**  
Status: **CURRENT CHAT CURSOR · KEEP THIS SHORT AND CURRENT**  
Owner: **OSM City Lab presentation / KFB ToolBox authoring**

## CURRENT

- Repo: `georg-doc/kayfabizarro`
- Branch: `chatgpt-web/elastic-grotesque-clay-huerth01-2026-09-23`
- Draft PR: **#194**
- Exact branch head: **READ PR #194 / branch ref before every write**
- Canonical browser-tested V2 runtime/source checkpoint:
  `0c59e92d9d8688f5a88cd309ae8891dcd174c2fc`
- Evidence:
  - **21/21 PASS**
  - **3/3 WebGL2**
  - **0 page/console errors**
  - run `35909757979`
  - artifact `10772592799`

## CURRENT VISUAL DIRECTION

**KFB Elastic Grotesque Clay V2**

- wonky 90s-cartoon spatial grammar;
- coherent neighbour/group warp;
- rounded / bowed / leaning continuous volumes;
- non-parallel roof planes;
- sparse irregular tall/narrow windows;
- varied doors;
- continuous curved road / curb / path ribbons;
- handmade/clay model substrate;
- systemic `KFB_WONKY_90S_CLAY_V1` palette.

Accepted benchmark remains pinned in:
- `STYLE_BENCHMARK.md`
- `benchmark/KFB_EGC_STYLE_BENCHMARK_2026-09-23.jpg`

## REJECTED / DO NOT USE AS DESIGN TRUTH

1. Old generic City-Lab `GROTESQUE` as continuation basis.
   - comparison evidence only.

2. Hürth 01 V1 as continuation basis.
   - superseded by V2.

3. The simplified self-contained Canvas chat mirror created to avoid permission dialogs.
   - **REJECTED AS VISUAL REVIEW AUTHORITY**
   - it is a transport/debug artifact only;
   - its reduced renderer visibly misrepresented building geometry, facade details and proportions;
   - do not tune or generalize from it.

4. Any return to:
   - box extrusion;
   - stacked cubist offsets;
   - generic low-poly;
   - Gothic dressing;
   - random independent per-building distortion.

Treat these as **REGRESSION** unless Georg explicitly reopens them.

## SHORT NEXT STEPS

1. **Do not rewrite the renderer.**
   Recover/show the **actual V2 browser evidence** from the tested runtime/artifact.

2. Compare actual V2 against the accepted benchmark:
   - whole block;
   - isolated source building;
   - windows/doors;
   - roof deformation;
   - smooth road/curb ribbons;
   - palette.

3. Georg decides:
   **ACCEPT / TUNE ONCE / REJECT**.

4. Only after ACCEPT:
   create the exact **Blender-MCP / Geometry-Nodes production recipe** from the accepted V2 grammar.

5. KayKit enterable doors/interiors stay **DEFERRED / source-first**.

## RECOVERY AFTER CHAT LOSS / TIMEOUT

Read in this order:

1. `CHAT_RECOVERY_CURRENT.md`
2. `LEAD_OVERRIDE_2026-09-24.md`
3. `START_HERE.md`
4. `STYLE_BENCHMARK.md`
5. `STYLE_CONTRACT.md`
6. `RETURN.md`
7. PR **#194** latest head
8. `tools/osm-city-lab/experiments/elastic-grotesque-clay-huerth01/`

Then resume from the single gate below. Do **not** reconstruct from chat memory.

## EXACTLY ONE NEXT GATE

**GEORG HUMAN VISUAL REVIEW · ACTUAL HÜRTH 01 V2 THREE.JS RESULT**

The next useful evidence is the real tested V2 output, not another substitute preview.

## PORTABLE EXACT-V2 FIX · CURRENT

The correct chat-preview repair is now implemented as:
`tools/osm-city-lab/experiments/elastic-grotesque-clay-huerth01/HUERTH01_V2_PORTABLE.html`

Implementation commit:
`51960375b1ba474720de7128502bfd8c9d66f64b`

This is **not** the rejected Canvas substitute renderer.
It bundles the actual tested V2 application from runtime/source head
`0c59e92d9d8688f5a88cd309ae8891dcd174c2fc` into one HTML:
- exact V2 viewer logic;
- exact Elastic V2 geometry helpers;
- exact current Grotesque donor helpers;
- exact Hürth normalized JSON;
- exact KFB City style JSON;
- Three.js r160;
- OrbitControls.

Transport checks already PASS:
- no iframe;
- no external script tag;
- no import map;
- no module script;
- no viewer fetch();
- no remaining module import seam.

**Browser parity / portable WebGL QA is PENDING.**
Do not claim portable PASS until that workflow is green.

Correct next action:
run/confirm the portable browser QA, then give Georg this exact bundled V2 HTML for in-chat review.
No screenshots and no renderer rewrite are required for the human review path.

## CURRENT AFTER TUNE ONCE · 2026-09-24

- Human verdict on unchanged V2: **TUNE ONCE**.
- Final tuned runtime head:
  `75b3c460ac37aac57cb5d9e96260517c5b4cf68d`
- Final browser run:
  `35945185715` · **29/29 PASS** · **3/3 WebGL2** · **0 page/console errors**
- Artifact:
  `10786850367`
- Digest:
  `sha256:716bfcab9dc6f4ed0180e0fd148b7a1494efca796bbe49746de762b0f8a900b0`

Four tune points implemented, Elastic only:
1. doors/windows use final bowed-shell surface frame and sit flush/inset;
2. shadow setup uses tight fit + `bias=0` + `normalBias=.04`;
3. road junctions close with same-colour asphalt patches at real shared OSM node IDs; no curb/path junction discs;
4. roofs use a small uniform overhang from the final wall-top outline.

Unchanged:
- V2 form grammar;
- `KFB_WONKY_90S_CLAY_V1`;
- OSM source/collision truth;
- comparison panels;
- Clean / Cartoon / Grotesque remain switchable and browser-booted unchanged.

Review wrapper:
`https://kayfabizarro.pages.dev/kfb-hub/pruefen/huerth-look/`

Publication source:
- `cloudflare-live` wrapper base pin = `75b3c460…`
- wrapper commit = `96d1e75796e051ec6aa91dc26d25c01aafbd4ea3`
- Hub update = `de20e4cb8ddc3bf146d8e289251b145847dddc23`

**PUBLIC_VERIFIED is not claimed by this chat** because the current tool cannot retrieve `kayfabizarro.pages.dev`. Georg's direct real-Chrome open is the current visual/public gate.

### Exactly one next gate

**GEORG HUMAN REVIEW · TUNED HÜRTH 01 V2**

Decision:
`ACCEPT / REJECT`

After ACCEPT only:
continue `LOOK_COMPOSITION_01_2026-09-24.md` (LC-01).

## CURRENT R2 · 2026-09-24

- Human input: `HUMAN_RESULT_HUERTH01_V2_R2_2026-09-24.md`
- Runtime head: `4cc496e79af80c7f8419ffb14f7f5d8daeb0b679`
- Browser run: `35947303053`
- **38/38 PASS · 3/3 WebGL2 · 0 errors**
- Artifact: `10787192998`
- Digest: `sha256:aa193dff031169bcfef73c9eb381b6d80a3b5099243818994b999a755073e0a0`

R2 visual state:
1. Roof = explicit small eave over final deformed wall top.
2. Curb/path junction = path connector below asphalt + same-colour asphalt node patch covering full curb half-width.
3. Shadow = 4096 fitted map, bias `.0002`, normalBias `.055`, roof no-receive; before/after evidence uses V2 run `35909757979` vs R2 run `35947303053`.
4. Details = **193** total across eligible facades, all on final bowed wall frames.
5. Palette = exact Racer Cologne `makePalette()` donor:
   - repo `georg-doc/KFB-Stunt-Car-Race`
   - commit `cc80f4a1c6c509db9668df79fd53b13cee093a9d`
   - file `KFB Cologne Race Option C-3/lab-v9/cologne-palette.v1.js`
   - blob `38246785ec2c9089737b2a195673a3ad4c07bdf8`
   - selected deterministic R2 scheme `komplementaer`, seed `2821914198`.

Story/Card truth:
- StoryMode/card semantics remain the existing `world-context.js` owner;
- R2 did not receive a concrete story mode or card triplet, so it does not invent one;
- later LC-01/consumer binding may drive the same Racer generator from that existing context.

Review:
`https://kayfabizarro.pages.dev/kfb-hub/pruefen/huerth-look/`

`cloudflare-live` wrapper base is pinned to `4cc496e7…`.

PUBLIC_VERIFIED is not claimed by this chat because the Pages URL cannot be retrieved by the current web tool. Human real-Chrome open is the gate.

### Exactly one next gate

**GEORG: ACCEPT / REJECT R2.**

After ACCEPT only:
`LOOK_COMPOSITION_01_2026-09-24.md`.

## CURRENT AFTER HUMAN R2 FAIL · 2026-09-24

Status: **ARCHIVED_FAILED_CANDIDATE · IMPLEMENTATION STOPPED**

Human evidence:
- `Bildschirmfoto 2026-09-24 um 04.37.11.png`
- `Bildschirmfoto 2026-09-24 um 04.35.57.png`
- `Bildschirmfoto 2026-09-24 um 04.35.43.png`

Formal recovery:
`FAILURE_RECOVERY_HUERTH01_R2_2026-09-24.md`

### Failed repair lineage

- unchanged V2 donor/reference: `0c59e92d9d8688f5a88cd309ae8891dcd174c2fc`
- R1 failed repair: `75b3c460ac37aac57cb5d9e96260517c5b4cf68d`
- R2 failed repair runtime: `4cc496e79af80c7f8419ffb14f7f5d8daeb0b679`
- R2 browser run: `35947303053`
- automated result: **38/38 PASS · 3/3 WebGL2 · 0 errors**
- human result: **FAIL**

This proves again that automated/browser boot PASS != Georg visual PASS.

### What is visibly still wrong

1. light/shadow hard boundaries remain;
2. road/curb/path reads as patched overlapping pieces and creates new junction artefacts;
3. roof/body still reads as separate lid + block instead of one designed object;
4. facade colour/detail distribution is seeded but not yet compositionally designed.

### Hard stop

**NO R3 PATCH PASS ON THIS FOUNDATION.**

Do not:
- add another junction circle/disc/patch;
- change renderOrder / Y-offset / polygonOffset to hide another road seam;
- do another shadow-bias-only repair;
- scatter more windows/doors randomly;
- enlarge the roof again without redesigning the shared roof/body boundary.

### Salvage / keep

- real Hürth OSM source and fixture;
- Elastic V2 continuous form grammar;
- final-wall surface-frame attachment idea;
- CLEAN / CARTOON / GROTESQUE switchability;
- exact Racer Cologne palette donor:
  `KFB Cologne Race Option C-3/lab-v9/cologne-palette.v1.js`
  @ `cc80f4a1c6c509db9668df79fd53b13cee093a9d`;
- existing WorldContext `STORY_PALETTES` / card-seed owner.

### Exactly one next gate

**RESEARCH + ISOLATED ARCHITECTURE PROOF**

Before any city-block implementation:
1. research known facade rhythm / asymmetric balance / repetition-with-variation / colour-hierarchy patterns;
2. define one single-owner road/path topology with shared intersection edges;
3. prove one isolated roof/body union under neutral lighting;
4. then decide whether a fresh implementation slice is warranted.

Resume by reading this file, then:
`FAILURE_RECOVERY_HUERTH01_R2_2026-09-24.md`.

Do not resume from R2 code as if it were a current candidate.

## RESEARCH COMPLETE · 2026-09-24

Research document:
`DESIGN_PATTERN_RESEARCH_2026-09-24.md`

Key findings now locked:
- facade design = rhythm + repetition with meaningful variation, Gestalt grouping and asymmetrical balance; **not independent RNG**;
- colour = one block-level harmonic palette + hierarchy, not per-building random colour picks;
- roof/body = shared eave boundary / welded or guaranteed shared seam, proven under neutral material first;
- roads/paths = **buffer → boolean union/difference → one planar arrangement → triangulate**, not overlapping ribbons + patches;
- R2 `sun.shadow.radius=2` is a documented Three.js banding risk; shadow retuning must move to an isolated one-house test.

No runtime/code implementation has been started after the R2 freeze.

### Exactly one next gate

Create only three isolated architecture proofs:
A. one T-junction from a single unioned planar topology;
B. one bowed house with shared/welded roof-body eave under neutral lighting;
C. six simple facades showing deterministic rhythm families + colour hierarchy.

No Hürth block R3 until A/B/C pass visually.
