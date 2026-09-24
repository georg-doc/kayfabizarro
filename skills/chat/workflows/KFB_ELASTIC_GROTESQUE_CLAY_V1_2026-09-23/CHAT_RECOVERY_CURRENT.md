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
