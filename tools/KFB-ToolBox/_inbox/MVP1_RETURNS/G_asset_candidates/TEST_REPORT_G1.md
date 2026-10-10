# G1 · Source inventory test report · 2026-10-10

**Outcome:** first source-backed candidate round, **NOT** a visual donor acceptance or runtime integration.
**Owner:** KFB Island Worldbuilder Lab / G1 Inselkörper und Fels
**Repository:** `georg-doc/kayfabizarro`
**Branch:** `planning/kfb-mvp1-asset-candidates-2026-10-10`
**Source brief:** `sync/lab-rkit-2026-10-09@cbbc4be530f7c11449c67ab595c054a5c26ddbd7`

## Static inspection (real checks executed on branch JSON)
**18/18 PASS**: (1) `kfb.asset-candidates/1` + G1; (2) exactly six elements; (3) 3–5 candidates each; (4) unique IDs inside each element; (5) 29 total; (6) exact source path in registry shard; (7) exact file format in shard; (8) permitted source kind; (9) file path + format populated; (10) rank A/B/C; (11) license field; (12) no public paid-pack file URLs; (13) no raw private Dropbox paths for paid candidates; (14) polygons integer or null; (15) known triangles ≤20,000; (16) picked/null, note empty; (17) goldenRef false and referenceViews empty; (18) nonempty verdict and risk.

**16/16 selected registry candidates matched exact pack-shard source path + format.** **13** purchased-local candidates are named, not uploaded. Same physical source model can appear in different element groups intentionally (e.g. Kenney `rock_largeA`); unique IDs are required **within** an element, not across element groups.

Source donor inventory: private Dropbox listing confirms StreakByte `Floting Base.fbx`, `Backyard Base.fbx`, `Snow Base.fbx`, other original model names; prior Lab measurements document eight island bodies, with **576–9,991 triangles** across the eight base measurements. Those numbers are measurements of base meshes normalized to W=60, **not** native K2 H dimensions. Individual rock/mountain polygons remain `null` pending actual geometry inspection.

## Visual and acceptance checks · pending, not PASS
- **0** newly rendered, source-isolated candidate-model views in this session. Dropbox FBX preview for Port `Floting Base.fbx` and Backyard `Backyard Base.fbx` provided a file reference but **no thumbnail**.
- **0** K2 bbox/scale measurements in actual H; no verified source units.
- **0** material-recolor/edge/contact comparisons or blind critic ratings.
- **0** generated concept/reference PNGs; **0** GoldenRefs.
- **0** Georg selections. All `picked=null`.
- No Stage/Site/Cloudflare deployment requested or performed; no runtime or PR merge.

## Risks / exact next gate
The best Town source candidate remains an **A for isolated review**, not implementation acceptance. Protopia lacks a visually verified narrow high complete island. Next: isolate source objects `LPFI_PortLand/Floting Base.fbx` and `LPFL_BackyardLand/Backyard Base.fbx` in the existing Lab, render identical four-view sets and measure native dimensions against Town target `40 MC = 70.4 H`; then attach render evidence to G1 MD/JSON and update Recovery. Do not distribute purchased FBX.
