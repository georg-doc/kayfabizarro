# Changelog · KFB Asset Librarian

## v1.7 hotfix candidate · Orc Raider texture fallback · 2026-09-23

### Cause
- `OrcRaider.glb` loads its geometry/skin correctly but its material `orc_texture_A` has no texture map.
- the real source image exists beside the pack at `../textures/orc_texture_A.png`;
- the existing FrizzleBob/Graft owner had already measured and repaired this exact KayKit packaging anomaly;
- Librarian v1.7 detail/gallery previews used direct `GLTFLoader` only, so the model rendered white.

### Fix
- add one shared read-only `texture-fallback.js` preview helper;
- only inspect mesh materials that have no `map` and whose material name looks texture-backed;
- try nearby source-relative `textures/` / `texture/` locations using the existing pinned/raw source URL;
- apply sRGB + KayKit-friendly nearest magnification;
- use the same helper for detail preview and Gallery thumbnail;
- do not mutate Registry facts, source assets or consumer handoffs.

### Regression evidence prepared
- static browser-contract test covers the helper and both preview consumers;
- v1.7 browser smoke opens the real Orc Raider and requires a reported texture fallback;
- browser smoke captures a dedicated Orc Raider evidence screenshot;
- workflow syntax-checks the new helper.

### Status
Implementation candidate on dedicated branch. No public-site promotion claimed until CI/browser evidence passes and the exact Cloudflare route is re-opened.


## v1.6 Town Workbench · 2026-09-15

### Decision
- Add a KFB Town working view instead of creating a new asset database or semantic tagging system.
- Keep repository files and generated Registry facts authoritative; `Nature`, `Buildings`, `Space` and `Prop` remain UI/workbench groupings.
- Keep Animation Lab v2 as owner of final KayKit motion compatibility and attachment/runtime integration.
- Keep all Town outputs `candidate-only`.

### Implementation
- new `Town` production tab with Environment, KayKit Characters and Character Props lanes
- first-choice Nature ranking for KayKit Forest/Nature and Kenney Nature
- Buildings/Town and Space/Sci-fi working filters plus pack/source filtering
- repository-true Quaternius Space Kit handling (`scifi-ultimate-space-kit-quaternius`)
- Mystery Series prioritization and explicit `Rig_Small` / `Rig_Medium` / `Rig_Large` character filtering
- structural same-collection prop view in Town and character detail
- local Scene Plan with Environment + Character + Prop slots (`kfb.town-scene-candidate.v1`)
- direct local/shared KayKit motion selector in the selected character preview
- external source clip playback through the selected character's own Three.js mixer
- measured track-binding coverage; zero bindings fail closed
- v1.6 real-browser regression gate added without removing v1–v1.5 gates

### Tested result
Real Chrome 152 / WebGL 2, Live Registry:
- Town Nature view: 631 candidates; first page 18
- KayKit character view: 79 candidates; Mystery Series access including GothGirl PASS
- Buildings/Town filter: 1,003 candidates PASS
- Quaternius Space Kit view PASS
- GothGirl same-collection `GothGirl_Microphone` prop PASS
- 165 concrete local/shared motion preview choices exposed for GothGirl
- `Death_A` from local `Rig_Medium_General.glb`: **69 / 69 tracks bound and playback started**
- `kfb.town-scene-candidate.v1` remains candidate-only
- console errors: 0
- runtime exceptions: 0
- all prior browser regression gates v1 / v1.3 / v1.4 / v1.5 PASS

Browser run: `34914515885`  
Evidence artifact SHA256: `aac14624e0dc0b3f72a3616f514e29d3cceb5b0b681f14d827387fd68dcdce00`

### Preserved
- asset-file source truth and generated Registry ownership
- Live / Canonical Registry modes
- existing Selection + `kfb.asset-handoff.v1`
- Actors / Rigs / Motions / FX resource owners
- ToolBox owner readers for existing custom rigs
- Animation Lab v2 final compatibility ownership
- no Registry, asset, roster or consumer-runtime write path added

## v1.2 Core · 2026-09-12

### Decision
- Daily-use static site first; no LLM dependency.
- Reuse canonical Registry and tested Three.js browser.

### Implementation
- collection + review queue filters
- list/card result views
- exact identity/provenance
- dependency navigation
- richer rig/skeleton facts
- 3D controls and clip selector
- image and audio previews
- persistent local Selection Tray
- candidate-only consumer handoff retained
- dedicated WSA six-task acceptance gate

### Tested result
- existing v1 Chrome/WebGL regression PASS
- v1.2 T1–T6 acceptance PASS in Chrome 152 / WebGL 2
- 0 console errors / 0 runtime exceptions
- six task screenshots + machine-readable `result.json` uploaded by CI

### Preserved
- Registry/indexer owners
- consumer profiles and owner boundaries
- v1 browser WebGL regression test
- v1.1 LLM/OpenAI code, untouched and not required
