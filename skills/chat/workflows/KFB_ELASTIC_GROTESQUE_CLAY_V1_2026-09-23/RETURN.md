# RETURN · KFB Elastic Grotesque Clay v1 · Hürth 01

Date: 2026-09-23
Status: **IMPLEMENTED · 16/16 BROWSER PASS · CHAT HTML READY · HUMAN VISUAL REVIEW PENDING · NOT PUBLIC**

## Slice

**Goal:** prove a reusable rounded/wonky KFB architecture language on one real Hürth OSM fixture before Blender-MCP production generalization.

**Owner:** existing **OSM City Lab presentation / KFB ToolBox authoring**.

Receiving Race / Travel / WorldBuilder owners remain unchanged.

## Git state

- repository: `georg-doc/kayfabizarro`
- branch: `chatgpt-web/elastic-grotesque-clay-huerth01-2026-09-23`
- Draft PR: **#194**
- base: `main@dca52479dad9c176acde6e7c7167dc133bf50bdd`
- browser-tested implementation head: `1db61b9c882e178000cf700a7d5f4d18ec03eba0`
- no merge
- no Live promotion

## What is implemented

A three-panel comparison on the same real source fixture:

1. **CLEAN OSM**
   - current footprint + current source height;
   - source-object isolation reference.

2. **CURRENT GROTESQUE**
   - imports and executes the existing City Lab `cartoon-city.js` donor;
   - uses the exact current `kfb-city-v0.json` Grotesque preset;
   - equal neutral camera in this comparison so geometry is not confused with the historical 76° Grotesque lens.

3. **ELASTIC GROTESQUE CLAY**
   - rounded source footprint;
   - continuous smooth lean / bend / belly / taper / twist;
   - small coherent block-level pull;
   - semantic roof cap using the source roof hint;
   - windows and door treated as protected detail objects rather than melted into the shell;
   - matte/high-roughness clay/model presentation.

The dropdown focuses each real building in all three panels.
`ISOLATE SOURCE` hides all other building masses so the actual source object can be compared before composition.

## Source truth

- Hürth normalized source: `tools/osm-city-lab/data/huerth-v0/normalized.json`
- pinned source blob: `936a5d990d2f394ae2bccbb4607d0821ca67a191`
- source spec blob: `9ec4c53f07b78113def073f649a8b4a014ada38e`
- fixture: 22 real OSM buildings
- browser context: 49 real nearby road parts

Current Grotesque donor:
- `tools/osm-city-lab/src/style/cartoon-city.js`
- blob `d08c19fc45d98546b7ef2803f2ddbcb73b7f6782`

Current City style:
- `tools/osm-city-lab/styles/kfb-city-v0.json`
- blob `f129cca3041b55b84de26048dad7aef8fac8b292`

## Protected boundaries retained

- OSM IDs unchanged.
- OSM footprints unchanged as source truth.
- source heights unchanged.
- S2/collision/export geometry unchanged.
- no movement owner created.
- no terrain owner created.
- no landmark owner replaced.
- no vehicle-deformer ownership moved.
- no source GLB edited.
- no Cel/outline dependency introduced.

## Changed files

Implementation:
- `tools/osm-city-lab/experiments/elastic-grotesque-clay-huerth01/index.html`
- `tools/osm-city-lab/experiments/elastic-grotesque-clay-huerth01/viewer.mjs`
- `tools/osm-city-lab/experiments/elastic-grotesque-clay-huerth01/elastic-grotesque-clay.mjs`
- `tools/osm-city-lab/experiments/elastic-grotesque-clay-huerth01/SOURCE.json`

Evidence:
- `tools/osm-city-lab/qa/elastic-grotesque-clay-huerth01.mjs`
- `.github/workflows/osm-elastic-grotesque-clay-huerth01.yml`

Briefing:
- `skills/chat/workflows/KFB_ELASTIC_GROTESQUE_CLAY_V1_2026-09-23/START_HERE.md`
- `skills/chat/workflows/KFB_ELASTIC_GROTESQUE_CLAY_V1_2026-09-23/STYLE_CONTRACT.md`
- this Return / Test Report / additive changelog.

## Tests / visible evidence

- GitHub browser run `35904415847`: **16/16 PASS**
- 3/3 WebGL2 contexts PASS
- page/console errors: **0**
- evidence artifact `10769948842`
- digest `sha256:fa8823edeeec10c6e25cb11b08c15d85a205e6ecb17c6c66c9c8f1236e71c9a9`
- block screenshot + isolated-source screenshot saved in artifact
- companion chat HTML: **11/11 bounded static checks PASS**

## What is deliberately still open

- **Visual acceptance:** automated tests cannot decide whether the degree of roundness/bend/belly/roof deformation is the right KFB look.
- **Clay microtexture:** this POC currently proves rounded volume, matte/high-roughness surface and model-like lighting. It does not yet fake fingerprints, sculpt/tool marks or a final clay normal/bump layer.
- **Detail grammar:** the candidate protects windows/door, but this first proof does not yet define the full façade module library.
- **Asset classes:** billboard and vehicle shape-style adapters remain the next later examples; they are not hidden scope in Hürth 01.
- **Blender MCP:** no Geometry-Nodes/Blender compiler is promoted until the form language passes the human visual gate.

## Stage/publication

Cloudflare Stage: **NOT PUBLISHED**.
This checkpoint intentionally uses the direct chat HTML + repository browser evidence first.

## Exactly one next gate

**GEORG HUMAN VISUAL GATE · HÜRth 01**

Compare especially:
- the whole block;
- isolated `way/371401492`;
- CLEAN → CURRENT GROTESQUE → ELASTIC.

Decision needed:
**continue this Elastic grammar / tune its intensity / reject the foundation.**

Only after that gate should the accepted grammar become a Blender-MCP / Geometry-Nodes production recipe.


## Handoff sync

Also updated on this same Draft branch:
- `skills/chat/START_HERE.md` — routes to this current human gate;
- `skills/chat/CHANGELOG.md` — additive cross-project record;
- `kfb-hub/index.html` — visible Hürth 01 review card, explicitly NOT PUBLIC.

Hub source sanity: **1/1 inline-script syntax PASS** and the new card ID is present.
