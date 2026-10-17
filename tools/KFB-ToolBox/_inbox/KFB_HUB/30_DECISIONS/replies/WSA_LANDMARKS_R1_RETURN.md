# WSA → WS0 · Landmark candidates R1 · V-421 · 2026-10-17

## ADDITIVE R1.7 · KFB Asset Suche → automatic original 3D asset GitHub intake · 2026-10-17

**DONE FOR TWO REAL CC0 SOURCES / SITE SEARCH BRIDGE STILL OPEN.** Georg instructs that licence-checked KFB Asset Suche TOP candidates be downloaded and copied directly into the canonical KFB GitHub 3D Assets root without his manual handling. Canonical path: `media/3D_Assets/KFB_Landmark_Candidates/`. Existing Asset Registry and Asset Librarian retain authority; this is candidate storage, not runtime integration, user choice, K1 look approval or Live release.

**Real import proof:** two genuine, independently source-isolated CC0 landmark models are now committed to this GitHub research branch: [Stonehenge source folder](https://github.com/georg-doc/kayfabizarro/tree/research/v421-landmark-source-clay-proof-2026-10-17/media/3D_Assets/KFB_Landmark_Candidates/stonehenge/stonehenge_oga_cc0) (original `.blend1` bytes under the interoperable `.blend` filename, original texture, 2 files / 2,926,170 bytes) and [El Castillo source folder](https://github.com/georg-doc/kayfabizarro/tree/research/v421-landmark-source-clay-proof-2026-10-17/media/3D_Assets/KFB_Landmark_Candidates/chichen_itza/chichen_el_castillo_oga_cc0) (original FBX and all six original material maps, 7 files / 39,292,272 bytes). Each has SOURCE.json plus CREDITS.md with original URL, creator, SPDX/attribution, source hash, per-file hashes and candidate-only status. No Kenney/generic substitutes promoted.

**Actual CI:** [initial live import #39070404364](https://github.com/georg-doc/kayfabizarro/actions/runs/39070404364) SUCCESS: 13/13 security tests, two original public CC0 ZIP downloads, verified original ZIP and selected model hashes, 9/9 original files confirmed after GitHub push. [Idempotence repeat #39070593906](https://github.com/georg-doc/kayfabizarro/actions/runs/39070593906) SUCCESS: 15/15 security tests, zero duplicate commits/files, 9/9 committed original digests reverified. [Earlier #39070352882](https://github.com/georg-doc/kayfabizarro/actions/runs/39070352882) FAIL on sparse-checkout staging; corrected with `git add --sparse` and not counted as passing.

**Existing-owner implementation:** `tools/asset_registry/kfb_asset_suche_auto_import.py` reuses `unpack_asset_pack._validate_members`; `.github/workflows/kfb-asset-suche-github-intake.yml` runs on changes to verified import requests; `tools/asset_registry/tests/test_kfb_asset_suche_auto_import.py` has 15 security/idempotence cases; `replies/V421_SOURCE_PROOF/KFB_ASSET_SUCHE_AUTO_IMPORT_R1.json` contains two vetted sources. The full dedicated handoff is [WSA_TO_WS0_V421_KFB_ASSET_SUCHE_AUTO_GITHUB_IMPORT_R1.md](WSA_TO_WS0_V421_KFB_ASSET_SUCHE_AUTO_GITHUB_IMPORT_R1.md). All original file SHA256s and license metadata are preserved. CC0 and CC-BY allowed only with positive identity/source and license evidence; NC, paid, private, unverified and generic-kit substitute sources denied. Actual initial branch import is not an auto merge to main.

**Boundary:** KFB external 3d-assets.search_assets/get_asset MCP is not exposed in this WSA Web Chat. The two initial OpenGameArt models were source-verified externally, not discovered via MCP. The import workflow is genuinely automatic after a *reviewed and hash-pinned source request* is committed, but the GPT Asset Librarian's own search-result → GitHub intake request bridge and Site selection view remain unimplemented/unverified. Do not claim end-to-end Site-click integration or main Registry readiness. 0 Georg choices, 0 accepted KFB clay, 0 new game/runtime/UI/Stage/Live publication.

**SINGLE NEXT GATE:** `WS0_KFB_ASSET_SUCHE_TO_VERIFIED_AUTO_IMPORT_IN_EXISTING_LIBRARIAN` — WS0 connects a real KFB Asset Suche result to the existing validated GitHub intake request, checks one new free original source auto-import and exposes source/credit links in the *same* Asset Librarian. Georg never handles model ZIP uploads; Georg only chooses among verified original monument models. WSB K1 after selection, WS1 placement later.

---
## ADDITIVE R1.6 · Georg: **KFB Asset Suche** first, no generic kitbash replacements · 2026-10-17

**STATUS: GEORG CORRECTION / SOURCE-SELECTION POLICY; NOT NEW 3D SEARCH RESULT.** Georg has explicitly rejected the proposal to substitute Kenney / other generic castle, animal, temple or theatre pieces for **Neuschwanstein and other actual world landmarks**, especially if this leads to crude angular „rounding“ produced by Claude. **Generic-kit assembly in place of a named landmark is FAIL by default** unless Georg authorizes a specific build separately. The exact requested search name is **„KFB Asset Suche“**.

**Canonical corrective source:** [WSA_TO_WS0_V421_KFB_ASSET_SUCHE_CORRECTION_2026-10-17.md](WSA_TO_WS0_V421_KFB_ASSET_SUCHE_CORRECTION_2026-10-17.md). Search flow: first current KFB Asset Librarian/Registry, and the already selected cross-source `3d-assets` MCP `search_assets` → `get_asset` (`~/Dropbox/CLAUDE/.mcp.json` / `https://3d.shep.bot/mcp`) by a **tool-capable** executor. Source identity, licence, original isolated model and geometry evidence precede Georg's choice. Existing Asset Librarian is the **one owner of the choice tab**. If the exact landmark has no suitable free source, return `NO_SUITABLE_FREE_LANDMARK_MODEL_FOUND`, do not auto-create a castle or replace it with unrelated donor geometry. Source alone is enough for preliminary choice with an external `Knete folgt` label; WSB K1 real clay only after Georg's explicit selection, and WS1 placement much later.

**Catalogue correction actually persisted:** `WSA_LANDMARKS_R1_CANDIDATES.json` now R1.6, **ten groups / 26 historical source-and-donor leads, NOT 26 suitable landmark candidates**. Exactly **nine generic/wrong-landmark reference entries** marked `REJECTED_FOR_LANDMARK_SHORTLIST_GENERIC_OR_WRONG_LOCATION_DONOR` and `NOT_ELIGIBLE_FOR_MONUMENT_SELECTION`: `neu-kit`, `gl-kenney`, `neu-simple`, `br-pets`, `br-proto`, `ur-kit`, `ur-temple-kit`, `bo-temple-kit`, `gl-shoreditch`. They remain **auditable historical research** (and may be useful for unrelated ordinary props) but are not selectable, may not count toward the requested 2–3 **appropriate monument candidates per location**, and cannot be silently forwarded as WSB landmarks. The one verified KFB Stonehenge prototype and actual external monument meshes are **not** excluded by a blanket ban.

**Testing actually run:** 10/10 targeted machine-readable invariants PASS (JSON schema, 10 groups, 26 historical rows unchanged, 9 blocked exact IDs, 5 preexisting verified meshes retained, license fields preserved, 0 selectable Site candidates, no new unverified source-search claim, owner unchanged). **New `3d-assets` calls: 0** — this web-chat environment still lacks direct access to the remote MCP. **New 3D file downloads/renderings: 0; code/game changes: 0; new asset library view / Site / Stage / merge: 0.** The previous [5 original-source proof job #39068894022](https://github.com/georg-doc/kayfabizarro/actions/runs/39068894022) remains historical evidence, not evidence that five named landmarks were found.

**Central-register clarification for WS0:** the older branch-local „WS0 V-424 source-only“ annotation must not invent/override the formal `DECISIONS.md` V-424, which on the WS0 register currently denotes SONG_SPEC R3.3. This correction is recorded as a V-421 Georg addendum; **WS0** alone may number it separately.

**ONE NEXT GATE: `WS0_V421_KFB_ASSET_SUCHE_EXACT_LANDMARK_SEARCH`.** WS0 adopts the exact requested wording and routes a real query via the connected KFB Asset Suche to existing KFB assets + external free model sources, focusing on Neuschwanstein, Bremen, Ur, Globe and Borobudur. Only genuine identity-matched sources are eligible for the existing Asset Librarian source-choice view, not a fabricated kitbash.

---

## ADDITIVE R1.5 · WS0 V-424 source-only donor intake (Modular Temple + Simple Castle) · 2026-10-17

**RESEARCH PROOF ONLY · five distinct genuine CC0 source objects isolated · zero true KFB K1-Clay renders · zero Georg selections.** This is the fourth V-421 briefing treated as an incremental research continuation, **not a new R1, second authoring owner or runtime**. Current WS0 V-424 takes precedence over the older briefing: an *unaltered original-model render* suffices for Georg's preliminary source decision, with a separate UI caption `Knete folgt`. V-429 requires a central `kfb-clay.v1` for accepted KFB materials. Previous white/flat material comparisons remain rejected diagnostics; WSB makes the actual rounded/coloured K1 clay look only **after Georg chooses**.

### Two genuinely downloaded public-domain source donors, not heritage replicas

| Model / author | Original file and rights | Measured Blender geometry | Isolated source |
|---|---|---:|---|
| **Modular Temple**, Keith at Fertile Soil Productions | [OpenGameArt original](https://opengameart.org/content/modular-temple-3d-models) · **CC0** · original public `modular_temple_collection.zip`; selected `Modular Temple/Pillar_Large_Arch.obj` | **196 triangles / 196 faces**; single pillar arch donor only | [Unmodified source render](V421_SOURCE_PROOF/evidence/modular_temple_fertile_cc0/source-isolation.png) |
| **Simple Castle**, TitaniumFalcon | [OpenGameArt original](https://opengameart.org/content/simple-castle) · **CC0** · directly downloaded `SimpleCastle.blend` | **2,414 triangles / 1,087 faces**, complete small toy-fortress silhouette | [Unmodified source render](V421_SOURCE_PROOF/evidence/simple_castle_titanium_cc0/source-isolation.png) |

Both mesh files were imported into a headless real Blender session, isolated, and their 600×600 original-only PNGs visually inspected without added graphics or labels. Each archive/direct-file SHA256, selected source SHA256, original-image SHA256, geometric metrics and model provenance are in [V421_SOURCE_PROOF/evidence/MANIFEST.json](V421_SOURCE_PROOF/evidence/MANIFEST.json). The two originals are **not KFB clay previews**; no new faux-clay renders were generated. The previous three genuine source-object proofs (Stonehenge 640 triangles, Kenney square tower 176, El Castillo 10,218) remain intact; source models themselves were not committed to public GitHub.

**Exact source role:** Modular Temple's isolated `Pillar_Large_Arch.obj` is an arch *component*, **not** the Ziggurat of Ur or Borobudur. Its one real source proof is referenced by two separate catalogue records, `ur-temple-kit` and `bo-temple-kit`, never counted as two imported model proofs. Simple Castle is a generic stylized fortress **not Neuschwanstein**; `neu-simple` is a construction/composition donor only, not a selectable authentic castle source. All three new records are marked `CONSTRUCTION_DONOR_ONLY_NOT_A_COMPLETED_LANDMARK`, with no enabled Georg monument choice.

### CI and persistence

- Successful real Blender source-only job: [GitHub Actions #39068894022](https://github.com/georg-doc/kayfabizarro/actions/runs/39068894022) **SUCCESS** including original downloads, 5/5 mesh imports and source-only images, source-check, GitHub research-branch evidence checkpoint and hash audit. Two new source original PNGs and the extended five-source manifest read back from the exact research branch after the run.
- Prior repair history retained, **not counted as successful**: [#39068503198](https://github.com/georg-doc/kayfabizarro/actions/runs/39068503198) imported all five but evidence push was rejected after WS0 concurrently changed the head to apply V-424. [#39068776703](https://github.com/georg-doc/kayfabizarro/actions/runs/39068776703) produced all five original renders and a successful artifact but failed the old render exit-condition because it still expected fake-clay status; checkout step was skipped. Both precise seams were corrected without force-push, branch reset or replaying WS0 decisions.
- `WSA_LANDMARKS_R1_CANDIDATES.json` updated **R1.5** from 23 to **26 source/donor records across the same ten places**; each place now has 2–3 leads. **Five distinct real CC0 model sources** are measured; some sources are referenced across multiple places. Remaining **19 entries have no independently verified mesh**, 0 KFB real clay-accepted previews and 0 enabled UI selections.
- Checks: **9/9 contract assertions** for group count, 2–3 entries/group, existing WS0 V-424 policy, new source-IDs and proven mesh hashes, fail-closed selection and no extra pseudo-clay. 5/5 real downloaded sources isolated in CI; two new source PNGs opened and visually inspected locally.
- No 3d-assets MCP calls: external `3d.shep.bot/mcp` is configured in Dropbox but is not directly connected in this ChatGPT tool runtime. Direct public CC0 sources used instead; Sketchfab/Fab/CGTrader licence-specific downloads remain pending.
- No new landmarks/geography built, no Source-to-runtime integration, no new cloud/Meshy assets, no Material/Lighting owner, no UI/Site/Cloudflare/Live/merge or Georg selection. Existing Story/deck/genius-loci hooks and free six-colour zone/biome/card-deck rule are preserved.

**ONE NEXT GATE: `WS0_V421_REVIEW_ORIGINAL_SOURCE_CANDIDATES_THEN_ASSET_LIBRARIAN_EXISTING_SITE_VIEW`.** WS0 reviews source-object identity and donor suitability, prioritizes authentic *monument* models among the remaining leads, and routes the source-only candidate cards to the existing Asset Librarian Site-capable owner with a separate `Knete folgt` caption. Georg chooses a proven exact original; only then WSB K1/rounding followed by separate WS1 placement. No new Site owner or public Stage is authorised by this research slice.

---

## ADDITIVE R1.3 · third true CC0 source, El Castillo; WS0 repeat-brief reconciliation · 2026-10-17

**Research evidence milestone, not KFB clay acceptance or Georg choice.** The repeated V-421 WS0 brief is already represented by 10 landmark groups / 23 source-and-donor leads from R1/R1.2; do not restart/recreate the same candidate register or PR. Current WS0 steering after the older brief remains **PR #418 TUNE · 'keine Pseudo-Knete, Knete macht WSB'**. Research-material previews are diagnostic only. The user-stated six-colour zone/biome/deck assignment rule from R1.2 remains binding.

### New independently downloaded and measured 3D source

- **Chichén Itzá · El Castillo** — OpenGameArt author `elopez7`, explicitly **CC0** with requested creator credit **Esteban Lopez**: https://opengameart.org/content/chichen-itza-el-castillo . Original archive `chichenitza.zip` was actually downloaded in GitHub Actions; archive SHA256 `bc4f0caf2b3b88cab18019bf4679f41556f2d805a10033714e38c95f9a140163`. Exact chosen model `ElCastillo.fbx`, original SHA256 `a275298cb2f8acb9ceaf8e3831ffee49ad9d7b839ec7475af0572a07091de644`.
- Real Blender isolated import measured **1 mesh, 10,218 triangles, 5,175 polygons**. Original source and neutral clay-material **diagnostic** images actually rendered, visually inspected as the real stepped El Castillo silhouette without overlays: [source-isolated original](V421_SOURCE_PROOF/evidence/chichen_el_castillo_oga_cc0/source-isolation.png) and [single-material source diagnostic](V421_SOURCE_PROOF/evidence/chichen_el_castillo_oga_cc0/clay-preview.png). Both originals and screenshots SHA256-pinned in [MANIFEST.json](V421_SOURCE_PROOF/evidence/MANIFEST.json). The actual model is **not yet an accepted KFB Clay stylization** and does **not prove the Ball Court**.
- Successful source-check and evidence persistence: [Actions #39067916203](https://github.com/georg-doc/kayfabizarro/actions/runs/39067916203) **SUCCESS**, all relevant job steps passed. Earlier concurrent Actions #39067898555 was **FAIL** because its previous proof checkpoint still asserted exactly two sources; it nonetheless successfully imported/rasterized all three geometries. The corrected subsequent run passed and persisted third-model image evidence. The failed run is not concealed or counted as PASS.

### Source-catalogue clarification: Moai Pa'a Pa'a is not a field of stone moai

The WS0 quick-check says Museo Nacional de Historia Natural de Chile **Moai Pa'a Pa'a** CC0. That name occurs in its [Rapa Nui Sketchfab collection](https://sketchfab.com/MNHNcl/collections/rapa-nui-32fc2791899042f093d0e2d61211019d); it refers to an **anthropomorphic wooden ritual figurine class**, not the iconic monumental stone Moai heads/statues used as the proposed walkable Rapa Nui field (see [one sculpture's description](https://www.3dgo.app/models/printables/1771384)). A separate [CC0 Wikimedia photograph](https://commons.wikimedia.org/wiki/File:Moai_pa'a_pa'a_(flat_female_figure),_Rappa_Nui_(Easter_Island),_Bishop_Museum.JPG) **does not establish that the 3D Sketchfab model is CC0**. The registry's monumental Moai entry remains distinct: Museo "Moai" listed CC BY in source research. Verify an exact 3D object/model page and its own licence, not a museum name or photo license. **Do not substitute the wooden artefact for the landmark source without Georg deciding to use it as a secondary ritual prop.**

### Current state / acceptance boundary

- Registry `WSA_LANDMARKS_R1_CANDIDATES.json` rev **R1.3** has 10 geographic landmarks, 23 entries; **3 distinct actual source objects isolated** (Stonehenge, Kenney `tower-square.glb` construction donor, El Castillo). Kenney source is referenced for two kitbash families, **not** two separate imported proof objects.
- 3 source-object + 3 material diagnostics = 6 actual PNG evidence images; these remain flat material research proofs **not** WSB final Clay; 0 candidate selections; 0 integrated scene / new UI / new GPT Site or Stage; 0 new runtime owners.
- Evidence assertions for R1.3 JSON state: **8/8** schema, group/source totals, 3 source objects, exact El Castillo triangles and source image pin, fail-closed selection, no Site UI change.
- Remaining up to 20 distinct catalogue leads without independently imported source-specific visual proof, and all final Clay approval gates, are OPEN. Some are category donors, not complete landmark models. Sketchfab/Fab file access may require external authentication; only direct public page permissions and exact licence can be claimed unless source binaries are retrieved.

**SINGLE NEXT GATE (unchanged): `WS0_V421_VISUAL_SOURCE_REVIEW_AND_REMAINING_PREVIEWS`.** WS0 verifies actual source/provenance and decides which of the 10 environments deserve WSB Clay source-previews first. A model must be shown alone before integration, and palette assignments remain driven by the accepted six colours of the target zone/biome/deck. Georg, not WSA, selects and later authorises WSB retopo/WS1 placement.

---

## ADDITIVE R1.2 · Georg's six-colour surreal environment direction · 2026-10-17

**GEORG STYLE CORRECTION (V-421 addendum; no new WS0 V-number):** All environment/landmark/vegetation/sky props may use **any of the six colours defined by their zone, biome or card deck**. The total KFB diorama must be surreal yet chromatically coherent; natural object colours are **optional**, not fixed rules. Georg's explicit examples are **purple/violet clouds (missing source asset)**, **light-blue/cyan tree trunks**, and **yellow tree canopies**. Use only palette colours actually present for the current zone/biome/deck, not a new independent RGB source, random material colour or hardcoded purple/yellow. Distinguish the six palette slots from the six Fluff story modes.

**Technical scope:** The accepted V-305 Joyride/J17-derived `kfb-cartoon-palette.js` is still the *single palette/harmony generator*. Its conventional role defaults (cream cloud, brown trunk, green/orange leaf) do **not** constrain subsequent **scene composition** and object-to-palette-role assignment. StoryMode, host lighting, fog and colour authority remain unchanged. No shader/material/runtime changes in this research slice.

**Clouds gap:** Purple clouds are a requested *real 3D visual element* not yet available in the source-verified asset/model roster for this effort. Find the existing sky/cloud owner and authentic cloud source/donor in a separately authorized look/world-dressing slice, and show the real source in isolation; no placeholder cloud blobs and no painted-on graphics.

**WS0 latest precedence:** The current steering changelog calls **PR #418 TUNE: "keine Pseudo-Knete, Knete macht WSB"**. Thus the two Blender flat-material "clay" source proofs in R1.1 count as **source geometry/import evidence, NOT an accepted KFB claymation look**. Real clay stylization/material/rounding belongs to WSB after selection and authorization. V-346 visual acceptance remains OPEN, and V-383 continues to forbid overlays on images.

Full user-facing and machine-facing rule: [LANDMARK_CHROMATIC_DIORAMA_STYLE_R1.md](V421_SOURCE_PROOF/LANDMARK_CHROMATIC_DIORAMA_STYLE_R1.md) and `WSA_LANDMARKS_R1_CANDIDATES.json` revision `R1.2-georg-chromatic-surreal-style`, applied to **all ten groups** without changing the 23 source leads, their rights, evidence or blocked selection. JSON contract check 7/7 PASS after save. No cloud generated; no Site/Asset Library/Stage/WS1 update; no merge.

**Unchanged one next gate:** `WS0_V421_VISUAL_SOURCE_REVIEW_AND_REMAINING_PREVIEWS`. WS0/WSB apply this rule while assessing the pending sources and preparing actual clay concept previews, then Georg chooses from proven options. No extra human gate created by this note.

---

## ADDITIVE R1.1 · two verified CC0 source objects and clay previews · 2026-10-17

**STATUS: SOURCE PROOF PASS 2/2 · 4 REAL BLENDER IMAGES PERSISTED · GEORG SELECTION STILL BLOCKED.** This milestone replaces the earlier `0 renders` status *only for the two specific source objects documented here*; the original R1 discovery log below is preserved for provenance.

### Sources actually downloaded, isolated and rendered

| Reference | Genuine upstream downloaded file | Measured geometry | Original / Clay |
| --- | --- | ---: | --- |
| Stonehenge OpenDungeons by eugeneloza · CC0 | `Stonehenge.zip` archive SHA256 `1c3b5e0206c35eebfbf89985c21adc3472487288d6347ee8ad283c29ef6054bc`; selected `Stonehengebed.blend1` source SHA256 `a172911fdeadf25567e61fc2da2cfb42e19ad614c1c2c82f43be77c1d160e045` | **640 triangles, 320 mesh faces** | [isolated original](V421_SOURCE_PROOF/evidence/stonehenge_oga_cc0/source-isolation.png) · [unaltered clay render](V421_SOURCE_PROOF/evidence/stonehenge_oga_cc0/clay-preview.png) |
| Kenney Castle Kit · CC0 | `kenney_castle-kit.zip` archive SHA256 `921f3f73927bb23106cae34bc21d5ab4b033a9fc120475e96f714a406e3169df`; selected `Models/GLB format/tower-square.glb` SHA256 `ae2e4f11247fef4e8e550011c20bc1862839cd4cfd21590aec9781ae0fbbbc7f` | **176 triangles, 176 mesh faces** | [isolated original](V421_SOURCE_PROOF/evidence/kenney_castle_cc0/source-isolation.png) · [unaltered clay render](V421_SOURCE_PROOF/evidence/kenney_castle_cc0/clay-preview.png) |

Public page evidence: [OpenGameArt Stonehenge](https://opengameart.org/node/30878) (eugeneloza, CC0), [Kenney Castle Kit](https://opengameart.org/content/castle-kit) (Kenney, CC0, ZIP itself contains `License.txt`). Original 2D texture from Stonehenge preview was part of author's CC0 distribution. Only metadata and four proof PNGs, **not full source ZIP meshes**, were committed into the research branch. No private/purchased material. Source-image proof uses actual input materials, Clay proof uses replacement material **only**, not recreated geometry and **zero text/labels over the images**.

The Kenney `tower-square.glb` is only a **source-owned modular castle-kit piece**, not a Neuschwanstein, Globe Theatre or Bremen statue. Same pack facts are attached to the Neuschwanstein/Globe construction-source leads without misrepresenting a completed landmark.

### Actual run and verification

- [GitHub Actions SUCCESS run 39044683249](https://github.com/georg-doc/kayfabizarro/actions/runs/39044683249): Blender headless source isolation + material-only Clay for **2 of 2 imported real meshes**; four PNGs produced; measured polygon and triangle counts compared to source. All job steps success; actual CI assertion passed.
- [GitHub Actions SUCCESS persistence run 39044954699](https://github.com/georg-doc/kayfabizarro/actions/runs/39044954699): same real source QA plus **4 preview PNGs and a MANIFEST** written to research branch (evidence head `1c486e133a9c3e069f7205c3acd9528c896f932c`), then exact branch/readback of manifest and both clay images. Two downloaded CC0 ZIP hashes pinned; 228 Kenney interchange-model files found in FBX/GLB/OBJ.
- Local independent archive/audit examination: 2/2 source proofs, 4 PNG files actually opened/visually checked (Stonehenge source and Clay, Kenney source and Clay), 6/6 JSON gate invariants PASS. No fake "whole building" model or source variants.
- Previous intentional fail-closed runs (not silently erased): [39044326027](https://github.com/georg-doc/kayfabizarro/actions/runs/39044326027) full 6GB checkout, [39044400866](https://github.com/georg-doc/kayfabizarro/actions/runs/39044400866) Blender missing Python numpy, [39044509158](https://github.com/georg-doc/kayfabizarro/actions/runs/39044509158) optional OpenImageDenoiser not in apt build. Resolved: sparse checkout, apt Python NumPy, denoising disabled, Blender backup `.blend1` file import. Not reported as successful runs.
- Targeted machine-readable JSON R1.1 keeps **10 landmark groups / 23 total records / 2 distinct inspected source objects / 0 select-enabled**. 3 references share 2 proven CC0 sources because Kenney Castle Kit is reused as a construction donor. **21 of 23 records still lack a source-specific clay proof**; Globe and Neuschwanstein are not "completed" merely from the kit component.

**Not done:** WS0 has not reviewed these four visuals, Georg has not selected, other 21 candidates have not been downloaded/isolated/rendered, `Landmark-Kandidaten` Asset Librarian view and `Auswählen` button are not built, no public Site/Stage/Live test, no deck or world placement, no merge.

**ONE NEXT GATE: `WS0_V421_VISUAL_SOURCE_REVIEW_AND_REMAINING_PREVIEWS`.** WS0 reviews the two source-isolated original/Clay pairs against V-346 and V-383, then an equipped WSA/WSB asset researcher repeats the verified CC0 import/rights/source-provenance process for the remaining direct/CC-BY models (Sketchfab auth and no-AI rules are still open) **before any Georg-facing selection UI**. Only Georg may choose a landmark; WSB retopo and WS1 placement remain separate later slices.

---

**STATUS: RESEARCH PARTIAL / SOURCE DISCOVERY ONLY — NO CLAY PREVIEWS, NO GEORG SELECTION, NO ASSET-LIBRARY VIEW DEPLOYMENT.** Only free-source listings recorded. No GLBs downloaded, no source-isolated images, no physical assets imported. This Return and its machine-readable sibling are **agent/WS0 research material, not a Georg-ready choice card**.

## Owner, constraints and source of truth

- Repo: `georg-doc/kayfabizarro`; branch: `docs/kfb-decisions-register-2026-10-11`. Existing research/register handoff. Do not merge or publish.
- Named authoring owner: `tools/img2threejs/`, existing landmark style bridge; existing Asset Librarian owns eventual choice view. OSM City, Travel, Camera, Palette and WS1 remain unchanged.
- Read first: `skills/chat/START_HERE.md`, `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`, `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`.
- Source contract: `tools/osm-city-lab/docs/LANDMARK_OVERRIDES.md` blob `f9aea1cffb447aa6ede45d47452de4b467be76a2`; Landmark Return `tools/img2threejs/docs/LANDMARK_WORLD_STYLE_V1_RETURN_2026-09-19.md` blob `da2eed58435772f1a4cc19a88488197ade191acf`; Genius Loci catalogue `tools/img2threejs/docs/GENIUS_LOCI_CANDIDATES_2026-09-19.md` blob `c2f4116eedebb435029854e3e3d5fcd29f8e6454`.
- Colors: accepted V-305 `replies/COLOR_HARMONY_R1/kfb-cartoon-palette.js` (blob `ab328bc0fda4bc5b918e0e08a88e51df445282db`), use role-based palette and existing City Grotesque default. Only Stonehenge uses known specific prepared hex from existing `landmark-style-profiles.v1.json`; no new hex palette accepted.
- Explicit exclusions retained: Giza, Portal Ruin, Akashic Library, Atlantis, Cologne, amphitheatre, Mesa/Canyon, Goblin Bank, Dystopia/Utopia, comic broadcast, jungle computer, cat/glass, clown, victims/memorial sites and Mount Rushmore. No license fee or private asset goes into public repo.

## Result and corrections

**10/10 planned places present as groups; 23 source/donor entries; CC0 / CC BY / KFB-own source only.** The two or three entries per place include construction-kit/reference donors where no direct reusable model could be verified. **Do not mislabel a kit, a different theatre or relief scan as the finished attraction.**

Key findings:
1. **Stonehenge reuse-first.** Actual existing Pilot-06 KFB model has **1,596 triangles** in owner Return, plus an external OpenGameArt **CC0** 4-piece set reported at **640 triangles**. External replacement not warranted by this research alone.
2. **Bremen is still source-scarce.** Kenney Cube Pets and Prototype Kit are CC0 material/build donors, NOT verified Bremen monument or the four-animal ensemble; direct sculpt would require later authorized WSB work.
3. **Globe donor caveat.** CC-BY Shoreditch Theatre (6,400 triangles) is an Elizabethan predecessor, **not Shakespeare's Globe**. The Kenney CC0 Castle Kit is construction material only.
4. **Moai correction.** The Museo Nacional de Historia Natural de Chile Moai listing is **CC BY**, not CC0 despite WS0's quick lead. Do not propagate a CC0 attribution claim.
5. **High mesh costs.** Neuschwanstein source 1.5M triangles, Babel alternative 3.8M, Borobudur candidate 1.2M; none are gameplay-ready. Ur 44.7k, Babel lightweight 65.2k, Liberty 1.7k/21.2k, Moai 252/1.5k are alternative ranges; all numbers are **source listing triangle metrics**, not mesh-inspected polygon counts.
6. **Restricted/uncertain.** CC-BY-NC Chichén and Ur listings intentionally excluded. Borobudur relief is marked NoAI: never pass into Meshy. Borobudur Meshy-generated architecture needs source provenance inspection before any ingestion; CC BY label alone is insufficient.

### Candidate inventory

| Rank | Landmark | Sources/donors, licence, reported triangle counts and role |
|---:|---|---|
| 1 | Stonehenge | KFB Pilot-06 Stonehenge (KFB own; 1,596 tris; existing_owner_donor); 4-piece Stonehenge [OpenDungeons] (CC0-1.0; 640 tris; site_model); Stonehenge by neosearch (CC-BY-4.0; 504 tris; site_model) |
| 2 | Bremen Town Musicians | Kenney Cube Pets (CC0-1.0; Triangles offen; construction_kit_only); Kenney Prototype Kit (CC0-1.0; Triangles offen; construction_kit_only) |
| 3 | Neuschwanstein | Kenney Castle Kit (CC0-1.0; Triangles offen; construction_kit_only); Neuschwanstein Castle, Bavaria, Germany (CC-BY-4.0; 1,500,000 tris; site_model) |
| 4 | Ziggurat of Ur | Ziggurat (CC-BY-4.0; 44,700 tris; site_model); Kenney Prototype Kit (CC0-1.0; Triangles offen; construction_kit_only) |
| 5 | Tower of Babel — Bruegel form | Tower of Babel (CC-BY-4.0; 65,200 tris; site_model); Tower of Babel (CC-BY-4.0; 3,800,000 tris; site_model) |
| 6 | Globe Theatre | Shoreditch Theatre (CC-BY-4.0; 6,400 tris; architectural_reference_donor); Kenney Castle Kit (CC0-1.0; Triangles offen; construction_kit_only) |
| 7 | Moai · Rapa Nui | Stylized Low Poly Moai (CC-BY-4.0; 252 tris; site_model); Moai — Museo Nacional de Historia Natural de Chile (CC-BY-4.0; 171,400 tris; cultural_reference_donor); Low Poly Moai (CC-BY-4.0; 1,500 tris; site_model) |
| 8 | Statue of Liberty / Liberty Island | Statue of Liberty (CC-BY-4.0; 1,700 tris; site_model); Statue of Liberty (CC-BY-4.0; 21,200 tris; site_model); Statue of Liberty (CC-BY-4.0; 56,900 tris; site_model) |
| 9 | Chichén Itzá · El Castillo + ball court | Chichén Itzá — El Castillo (CC0-1.0; Triangles offen; site_model); Chichen Itza Yucatan Photogrammetry Test (CC-BY-4.0; 228,900 tris; cultural_reference_donor) |
| 10 | Borobudur | Borobudur Temple Complex (CC-BY-4.0; 1,200,000 tris; site_model); Borobudur 3rd Floor Relief Pictograph (CC-BY-4.0; 50,000 tris; detail_reference_only) |

## Detailed per-candidate provenance and Clay notes

Every direct source URL below is a lead from a third-party listing, not downloaded file proof. CC-BY author, licence and link are recorded in the JSON; resulting retopo would additionally require a modification statement. Listed `downloadable: true` means the page offered download, possibly subject to authentication; it does **not** mean files or formats were actually downloaded or validated. Source thumbnail is unknown. No thumbnails are silently substituted for a clay preview.

### 1. Stonehenge

Decks: `woad_and_warriors`, `platos_dungeon_raid_*`. Genius loci: Druid as ring announcer, solstice main event.

Clay/Catoonification: Reuse existing KFB grouped monoliths; oversize upright stones, rounded lintels; palette existing Stonehenge structure #969789, moss #71796e, gold accent #c7a65e.

- **KFB Pilot-06 Stonehenge** — KFB-OWN-SOURCE; Urheber/Credit: KFB img2threejs. [Originalquelle](https://github.com/georg-doc/kayfabizarro/blob/main/tools/img2threejs/landmarks/pilot-06/index.html). 1,596 source-listed triangles. Download listing: internal source; not directly downloadable as vendor model. **Files/Formate:** not inspected / unknown. **Original thumbnail:** not validated. **Clay preview:** NOT RENDERED. Reuse-first. Internal source reports 1,596 triangles; third-party sublicensing not inferred.
- **4-piece Stonehenge [OpenDungeons]** — CC0-1.0; Urheber/Credit: eugeneloza. [Originalquelle](https://opengameart.org/node/30878). 640 source-listed triangles. Download listing: yes. **Files/Formate:** not inspected / unknown. **Original thumbnail:** not validated. **Clay preview:** NOT RENDERED. OpenGameArt Stonehenge.zip; 392 vertices / 320 faces. Zip internals uninspected.
- **Stonehenge by neosearch** — CC-BY-4.0; Urheber/Credit: neosearch. [Originalquelle](https://sketchfab.com/3d-models/stonehenge-50fbd4391bbc4c2ebe09537c22eb858e). 504 source-listed triangles. Download listing: yes. **Files/Formate:** not inspected / unknown. **Original thumbnail:** not validated. **Clay preview:** NOT RENDERED. Sketchfab listing; downloadable subject to site access.

### 2. Bremen Town Musicians

Decks: `grimms_kayfabe_legends_expansion_set_02`, `the_bards_barnyard_beatdown`. Genius loci: Donkey/dog/cat/rooster tag-team stack, robber house heel lair.

Clay/Catoonification: Four exaggerated stacked animals, rounded feet, deliberately readable silhouettes; earth cream and warm character colours from V-305 palette, no hardcoded new palette.

- **Kenney Cube Pets** — CC0-1.0; Urheber/Credit: Kenney. [Originalquelle](https://kenney.nl/assets/cube-pets). Triangle count unknown. Download listing: yes. **Files/Formate:** not inspected / unknown. **Original thumbnail:** not validated. **Clay preview:** NOT RENDERED. NOT a Bremen statue. Animal roster and four requested silhouettes require archive inspection.
- **Kenney Prototype Kit** — CC0-1.0; Urheber/Credit: Kenney. [Originalquelle](https://kenney.nl/assets/prototype-kit). Triangle count unknown. Download listing: yes. **Files/Formate:** not inspected / unknown. **Original thumbnail:** not validated. **Clay preview:** NOT RENDERED. NOT a statue model; blocks/pedestal/robber-house scaffold only. No direct statue asset verified.

### 3. Neuschwanstein

Decks: `grimms_kayfabe_legends_expansion_set_02`, `nibelungen_booster_pack_design`. Genius loci: Ludwig II dream booker; theatrical tower tour and Wagner/Nibelungen mural cards.

Clay/Catoonification: Reduce to stepped towers, big turrets and balcony; caramel-cream stone, periwinkle roofs, warm gold accent proposed through V-305.

- **Kenney Castle Kit** — CC0-1.0; Urheber/Credit: Kenney. [Originalquelle](https://kenney.nl/assets/castle-kit). Triangle count unknown. Download listing: yes. **Files/Formate:** not inspected / unknown. **Original thumbnail:** not validated. **Clay preview:** NOT RENDERED. 75-model architectural kit; NOT a faithful Neuschwanstein asset.
- **Neuschwanstein Castle, Bavaria, Germany** — CC-BY-4.0; Urheber/Credit: Brian Trepanier. [Originalquelle](https://sketchfab.com/3d-models/neuschwanstein-castle-bavaria-germany-7d6d970009724dbda4fc5c5ffa303577). 1,500,000 source-listed triangles. Download listing: yes. **Files/Formate:** not inspected / unknown. **Original thumbnail:** not validated. **Clay preview:** NOT RENDERED. Extremely heavy; source listing only, photogrammetry/attribution of original geometry not checked. Restrictions: DECIMATION_REQUIRED

### 4. Ziggurat of Ur

Decks: `the_uruk_rumble`. Genius loci: Gilgamesh stair-arena, clay-tablet announcements.

Clay/Catoonification: Broad hero stairs, 3 bold platform tiers, playable steps; baked-earth terracotta and warm sand from V-305.

- **Ziggurat** — CC-BY-4.0; Urheber/Credit: History Builds. [Originalquelle](https://sketchfab.com/3d-models/ziggurat-f2ffb4bd5200400eac37fbce5c010ef0). 44,700 source-listed triangles. Download listing: yes. **Files/Formate:** not inspected / unknown. **Original thumbnail:** not validated. **Clay preview:** NOT RENDERED. Visual/site identity to confirm as Ziggurat of Ur, not automatically Ur reconstruction.
- **Kenney Prototype Kit** — CC0-1.0; Urheber/Credit: Kenney. [Originalquelle](https://kenney.nl/assets/prototype-kit). Triangle count unknown. Download listing: yes. **Files/Formate:** not inspected / unknown. **Original thumbnail:** not validated. **Clay preview:** NOT RENDERED. Stepped construction donor, not historical digital scan.

### 5. Tower of Babel — Bruegel form

Decks: `epistemic_sabotage`, `unspoken_systems_kayfabizarro_meta_deck_01`. Genius loci: Polyglot Parrot at summit; floors disagree about card languages.

Clay/Catoonification: Open, offset concentric galleries with oversized arches; warm ochre masonry, muted teal shadow role, ochre-gold accent via V-305.

- **Tower of Babel** — CC-BY-4.0; Urheber/Credit: loiz. [Originalquelle](https://sketchfab.com/3d-models/tower-of-babel-a4e601c636b842879cd7eea15). 65,200 source-listed triangles. Download listing: yes. **Files/Formate:** not inspected / unknown. **Original thumbnail:** not validated. **Clay preview:** NOT RENDERED. Bruegel likeness requires visual source-isolated check; 56.3k source vertices.
- **Tower of Babel** — CC-BY-4.0; Urheber/Credit: AlvaroL. [Originalquelle](https://sketchfab.com/3d-models/tower-of-babel-13b66768d08f4e3ca59a04210c1d0b15). 3,800,000 source-listed triangles. Download listing: yes. **Files/Formate:** not inspected / unknown. **Original thumbnail:** not validated. **Clay preview:** NOT RENDERED. Heavy source; flatten shell and replace repetitive arches with reusable modular modules. Restrictions: DECIMATION_REQUIRED

### 6. Globe Theatre

Decks: `shakespearean_animal_beatdown`, `uncle_frizzlebob_s_tragic_flaws_shakespeare`. Genius loci: Wooden O as wrestling ring; Bard as manager.

Clay/Catoonification: Radial timber ring, open roof and audience tiers, oversized stage; timber honey/cream and red cloth accent via V-305.

- **Shoreditch Theatre** — CC-BY-4.0; Urheber/Credit: novusod. [Originalquelle](https://sketchfab.com/3d-models/shoreditch-theatre-30cc5fe94bd949c3b165e2d2409cb3c5). 6,400 source-listed triangles. Download listing: yes. **Files/Formate:** not inspected / unknown. **Original thumbnail:** not validated. **Clay preview:** NOT RENDERED. Historically different predecessor, NOT the actual Globe; roof/wall grammar only.
- **Kenney Castle Kit** — CC0-1.0; Urheber/Credit: Kenney. [Originalquelle](https://kenney.nl/assets/castle-kit). Triangle count unknown. Download listing: yes. **Files/Formate:** not inspected / unknown. **Original thumbnail:** not validated. **Clay preview:** NOT RENDERED. Generic timber-like building donor; not Globe Theatre geometry.

### 7. Moai · Rapa Nui

Decks: `forget_utopia`, `ignore_dystopia`, `embrace_protopia`. Genius loci: Moai talk back; avoid deterministic collapse myth.

Clay/Catoonification: Rounded monumental faces and three distinct expressions, grounded plinth; volcanic stone charcoal, mineral cream edge and island vegetation from host roles.

- **Stylized Low Poly Moai** — CC-BY-4.0; Urheber/Credit: leunamanuelgc. [Originalquelle](https://sketchfab.com/3d-models/stylized-low-poly-moai-976a26a8e0e94b3f90b26992ace92af5). 252 source-listed triangles. Download listing: yes. **Files/Formate:** not inspected / unknown. **Original thumbnail:** not validated. **Clay preview:** NOT RENDERED. Best lightweight cartoon donor.
- **Moai — Museo Nacional de Historia Natural de Chile** — CC-BY-4.0; Urheber/Credit: Museo Nacional de Historia Natural de Chile. [Originalquelle](https://sketchfab.com/3d-models/moai-7099390468214c2dbcf283454e7b5c8a). 171,400 source-listed triangles. Download listing: yes. **Files/Formate:** not inspected / unknown. **Original thumbnail:** not validated. **Clay preview:** NOT RENDERED. The museum listing is CC BY, NOT CC0. Cultural contextualization and source respect required; not a generic Moai field scan.
- **Low Poly Moai** — CC-BY-4.0; Urheber/Credit: XzavierStuffs. [Originalquelle](https://sketchfab.com/3d-models/low-poly-moai-a6613687895d4eb0a778242083ebb824). 1,500 source-listed triangles. Download listing: yes. **Files/Formate:** not inspected / unknown. **Original thumbnail:** not validated. **Clay preview:** NOT RENDERED. Alternative lightweight silhouette.

### 8. Statue of Liberty / Liberty Island

Decks: `federal_kayfabe`, `kayfabizzaro_politics`. Genius loci: Torch as loan lamp, island as a Fed vault.

Clay/Catoonification: Make crown, torch and pedestal read at a distance; oxidized mint-patina, warm cream pedestal, restrained gold flame from V-305.

- **Statue of Liberty** — CC-BY-4.0; Urheber/Credit: Polskaball. [Originalquelle](https://sketchfab.com/3d-models/statue-of-liberty-8789c44648254d6fba0608439daf25d3). 1,700 source-listed triangles. Download listing: yes. **Files/Formate:** not inspected / unknown. **Original thumbnail:** not validated. **Clay preview:** NOT RENDERED. Island/terrain absent; stage composition later.
- **Statue of Liberty** — CC-BY-4.0; Urheber/Credit: Crafteri. [Originalquelle](https://sketchfab.com/3d-models/statue-of-liberty-de104ba657a14df099bde10cd9bbf4f2). 21,200 source-listed triangles. Download listing: yes. **Files/Formate:** not inspected / unknown. **Original thumbnail:** not validated. **Clay preview:** NOT RENDERED. Island/terrain absent; city-island geometry not verified.
- **Statue of Liberty** — CC-BY-4.0; Urheber/Credit: Gravity Jack. [Originalquelle](https://sketchfab.com/3d-models/statue-of-liberty-84094e8d5e724b5c882cf576ca12e44e). 56,900 source-listed triangles. Download listing: yes. **Files/Formate:** not inspected / unknown. **Original thumbnail:** not validated. **Clay preview:** NOT RENDERED. Detail baseline; costlier retopo.

### 9. Chichén Itzá · El Castillo + ball court

Decks: `sonic_warfare_music_history_01`, `combat_arena_mvp_4`. Genius loci: Stair chirp as quetzal; Maya ballcourt separate arena.

Clay/Catoonification: Stepped temple with outsized ball-court rings, feathered serpent motif; limestone cream, verdant shadow and clay red accents from V-305.

- **Chichén Itzá — El Castillo** — CC0-1.0; Urheber/Credit: elopez7 / Esteban Lopez. [Originalquelle](https://opengameart.org/content/chichen-itza-el-castillo). Triangle count unknown. Download listing: yes. **Files/Formate:** not inspected / unknown. **Original thumbnail:** not validated. **Clay preview:** NOT RENDERED. OpenGameArt chichenitza.zip (34.2MB), pyramid/temple; polygon count and archive internals NOT inspected.
- **Chichen Itza Yucatan Photogrammetry Test** — CC-BY-4.0; Urheber/Credit: Nick G. Gizelis. [Originalquelle](https://sketchfab.com/3d-models/chichen-itza-yucatan-photogrammetry-test-cadcd48c10cb404da78e293256c7fac5). 228,900 source-listed triangles. Download listing: yes. **Files/Formate:** not inspected / unknown. **Original thumbnail:** not validated. **Clay preview:** NOT RENDERED. High-poly reference; ball court absent/unverified.

### 10. Borobudur

Decks: `kreative_kayfab_creative_hero_journey`, `kayfabizarro_monomyth_mayhem`. Genius loci: Pilgrim's mandala path; stupas as stage checkpoints.

Clay/Catoonification: Keep 3-tier mandala walk, oversized bells, broad stairs; volcanic-grey stone, cream relief and warm clay accents through V-305.

- **Borobudur Temple Complex** — CC-BY-4.0; Urheber/Credit: czepedas. [Originalquelle](https://sketchfab.com/3d-models/borobudur-temple-complex-da47fe2900bc4e3b81fef8e6f10c4f5d). 1,200,000 source-listed triangles. Download listing: yes. **Files/Formate:** not inspected / unknown. **Original thumbnail:** not validated. **Clay preview:** NOT RENDERED. Source says Meshy generated; license alone does NOT prove underlying architectural source ownership; source provenance audit needed. Restrictions: SOURCE_PROVENANCE_RECHECK, DECIMATION_REQUIRED
- **Borobudur 3rd Floor Relief Pictograph** — CC-BY-4.0; Urheber/Credit: PHAC. [Originalquelle](https://sketchfab.com/3d-models/borobudur-3rd-floor-relief-pictograph-2c49eeb628684757b8f0f87165a12007). 50,000 source-listed triangles. Download listing: yes. **Files/Formate:** not inspected / unknown. **Original thumbnail:** not validated. **Clay preview:** NOT RENDERED. Relief, NOT complete temple. Creator NoAI restriction: do not feed mesh to Meshy or other AI; manual Blender source review only. Restrictions: NO_AI_USE, NOT_FULL_TEMPLE


## Clay/asset process: intentionally not passed

- V-346: each **specific source model** needs isolated visual proof, a Blender clay-material or authorised Meshy retexture preview, then a WS0 check **before Georg sees an actionable candidate**.
- V-383: do not paint arrows, badges, labels, or any other artwork **over the preview image**; UI text must live outside image bounds.
- MCP external 3D search: exact Dropbox `/CLAUDE/.mcp.json` points to `https://3d.shep.bot/mcp`. This chat did **not** have callable `search_assets` or `get_asset`; **0 MCP calls**, no claim of access through local Claude or Mac mini.
- Web-listed asset archive internals and exact formats not read; geometry counts unknown where source withheld data. Screenshot count = **0**; clay renders = **0**; candidate selection enabled = **0**.
- Source isolation gate requires URL + downloaded file metadata/format + true object silhouette + CC0/CC BY and relevant upstream rights + triangle report. Then original isolated object, clay preview, and independent WS0 check. No live scene insertion.

## Existing Asset Library · future view spec only (V-390)

Existing Site owner is the current **KFB Asset Librarian**, not a new tool. Add a `Landmark-Kandidaten` view **only after** preview assets and owner integration are authorised. View consumes `kfb.landmark-candidates/1`; each entry displays separate labelled fields for creator/licence, source link, format, triangle metric, clay notes, original thumbnail, **unaltered standalone clay preview**, and an `Auswählen` button. Until a per-source isolated preview and permission/rights proof exists, the button is disabled and the entry is `HOLD_PREVIEW_AND_RIGHTS_GATES`. No new storage, camera, asset renderer, Site or cloud mirror. The private Site URL's new view path is *not yet implemented or verified*.

## Validation evidence — genuinely run

- GitHub file create/read-back: JSON persisted and exact branch head/file fetched.
- Native read-back JSON assertions: **7/7 PASS** (json_parse=1; ten_landmarks=1; unique_source_ids=1; allowed_licenses=1; selection_gated=1; source_urls=1; attribution_recorded=1).
- External source binaries opened: **0**. Browser 3D visual tests: **0**. Clay previews: **0**. Georg decisions: **0**. CI runs: **0**.
- Site deploys: **0**; Asset-Library changes: **0**; PR opened: **0**; Stage/Live: **0**; GitHub merges: **0**.

## Additive R1 research changelog

- Registered ten planned environments and 23 license-scoped source or reusable donor leads with group stories, deck hooks and future clay direction.
- Corrected Stonehenge duplicate work, museum Moai CC-BY claim, Globe/Shoresditch geographic mismatch and Bremen missing source.
- Locked choice state until real isolated clay previews exist, preserving named existing owners.
- UI only described; no application change and no Cloudflare stage required by source-research task.

**ONE NEXT GATE: `WSA_V421_ACTUAL_ASSET_RETRIEVAL_SOURCE_ISOLATION_CLAY_PREVIEW`.** A tool-capable WSA/owner executor uses real `3d-assets.search_assets → get_asset` or authorised direct downloads, checks each proposed source/credit and true formats/geometry, renders isolated source then *unmodified* clay previews, and has WS0 check them. Only then expose enabled `Auswählen` within the existing Asset Librarian to Georg; Georg's selection subsequently unlocks a separate WSB Blender retopo job and later WS1 placement. No assumed human acceptance.

## V-424 · WS0 source-only choice policy · 17.10.2026
- **DECISION from WS0:** For Georg's preliminary landmark-source choice, an honest isolated **original-model render** with creator/licence/format/geometry and the UI text `Knete folgt` is sufficient. Previously exported white untextured pseudo-clay images are **REJECTED as KFB clay**, kept only as negative/diagnostic evidence. Do not generate substitute pseudo-clay or paint overlays on source images.
- **OWNER:** KFB Asset Librarian (existing Site) receives the `Landmark-Kandidaten` view with `Auswählen`, preserving the existing registry / decisions owner; no second selection backend. The original render and model-identity checks are prerequisites to enabling Georg's source-choice button. WSB applies **actual K1 clay, rounded edges, and existing zone six-colour palette in Blender only after selection**, then a separate visual review. No Stage/site publication without exact verification.
- **SOURCE PROOF:** current PR #418 has three distinct genuine CC0 objects, not the prior two: a Stonehenge source of four stone groups, Kenney Castle Kit's single square tower (construction donor, NOT Neuschwanstein or Globe), and Chichén Itzá El Castillo (actual temple, NOT ballcourt). 23 leads total, **20 remain without standalone model-specific proof**. These source proof PNGs are unmodified original model renders, not final KFB Clay. All three shared physical file SHA values remain in `V421_SOURCE_PROOF/evidence/MANIFEST.json`.
- **IMPLEMENTED THIS SLICE:** updated only source-choice policy + per-record states in candidate registry `R1.4`; retained all 23 source records and prior diagnostics; added `WS0_V424_SOURCE_ONLY_REVIEW_DELTA.md` and this Return. 0 new source downloads, 0 new renders, 0 UI edits, 0 new runtime/Cloudflare/GPT Site publication, 0 Georg selections; draft PR stays open.
- **NEXT SINGLE GATE:** V421 original-source evidence for 20 remaining model leads followed by Site-capable Asset Librarian `Landmark-Kandidaten` consumer integration and Georg source selection. WSB K1 begins only after chosen candidate.

## V-424 executable source-render queue · source unique
- Added `V421_SOURCE_PROOF/V424_ORIGINAL_SOURCE_RENDER_QUEUE.json` as a deterministic grouping of the existing candidate register, no source data invented. **20 genuinely distinct source URLs pending** representing **22 unrendered candidate references**, because two shared donor URLs each appear twice (Kenney Prototype Kit and Modular Temple). Total register: 26 candidate references, 23 distinct upstream source URLs, three distinct source objects isolated across four references. The older term “23 leads / 20 pending” counts distinct source URLs, not per-landmark candidate entries.
- Each queue item retains exact upstream URL, claimed license/creator, donor-vs-monument role, source-listing constraints and flags; actual archive SHA/model/triangles/render remain null/false until independently proven. Do not treat queue generation as 20 visual proofs. No new downloads, Blender source renders, UI writes, 3D/LLM transforms, final K1 previews or Georg selections in this milestone.
- One next gate stays: real licensed source retrieval/render for 20 unique URL inputs, followed by existing Asset Librarian `Landmark-Kandidaten` source-choice UI with honest `Knete folgt` labels and exact Site verification. WSB real clay after Georg chooses.
