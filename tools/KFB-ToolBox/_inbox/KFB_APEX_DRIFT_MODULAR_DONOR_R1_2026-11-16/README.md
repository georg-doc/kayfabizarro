# Apex Drift → KFB modular scenery donor R1

Exact original: micha-ostrowski/apex-drift, MIT, commit224734fe7a064a5483f2c8c6bf3ca8a8d0676d82. Source access and rights verified2026-11-16. Preserve original/LICENSE and CREDITS. The old SOURCE_ACCESS_FAILURE recovery is superseded for these code-only files.

## Ready modules

`adapters/parts.js`: `createApexPart(kind, options)` returns a Three Group grounded at localY0, with provenance in userData. Kinds: `warehouse`, `hangar`, `container`, `crane`, `lamp`. Options: stable `id`, optional supplied KFB `material`, container `color`, `subdivide` (defaults false; original low-poly topology). All original modules remain unchanged. This is an explicit KFB extraction, not a claim that Apex originally exported individual factories.

`bindExistingKfbBend(root,{seed,mode,limits})` reuses the EXISTING whole-kit deformation handle, source-pinned below. Add all facade/details before binding so they share the same reference frame. Call `update(time)` from the existing host tick. Source isolation then KFB-bent warehouse were actually browser-rendered; all five source forms inspected. Current proof is visual only: no silently deformed physics or exported geometry.

`approvedFacadeTexture(canvasOrFrame)` and `addApprovedFacade(root,texture,options)` accept an already-approved HyperNormalisation output. They do not fetch media or create a collage engine. Static frame must have curator `use=true`; ongoing canvas owner remains Curator. No H16 activation or private media export occurred. The receiving facade and shell must later share the canonical deformation/contact policy.

## Existing owners (read before integration)

- Building router: kayfabizarro@a9143605b1463df36c0e57d7092d5253d7e7b721, `tools/KFB-ToolBox/docs/CLAY_BUILDING_FACADE_ROUTER.md`, blobc5aa9cb6a5f7f2131fa3f0644c61c29c61bb113f. S5 / WorldBuilder building owner, K2v10 material baseline.
- Actual kit deformer copied unchanged to adapters/vendor: `travel/wip/travel_globe_wsa/kfb-cartoon-deform.js`, blob22d1d537915ad7e552dbfa942ac3dd8c291886f2 at that same pin. API applyCartoonDeform; bend/lean are fractions of height, twist degrees. Fewer than4Y rings use its existing tilt/taper fallback; request subdivisions for smooth bends. No second deformer created.
- Elastic Grotesque V2 building path: pin0c59e92d9d8688f5a88cd309ae8891dcd174c2fc, `tools/osm-city-lab/experiments/elastic-grotesque-clay-huerth01/elastic-grotesque-clay.mjs`, blob75c3d794b9341a7074038594b467f91d153486c6. Consumes building footprint/height/roof and keeps shell/roof/details on the same field. This owner decides a later real grotesque high-rise, not this intake adapter.
- HyperNormalisation H15: pin5eb6aeb38748327e86de7d2903202baadc1f7059, `tools/KFB-ToolBox/_inbox/KFB_Billboard_Kaleidoscope_H15_Mindscape_2026-10-25/`; DOKU blob1172c18e496295ad29363b2a5952bb7593b1bdd4. Existing `faceEl` is1024×512 Canvas. Consume that or approved H14 bake; no H15 sphere renderer or extra audio context.

## Integration boundary

No skyscraper/cityscape generator exists in this Apex source. Warehouses/hangars are the original simple boxes; cranes are its tall structures. Grotesque high-rises and HyperNormal facades are future KFB designs using these verified parts and existing owners. Do not substitute Apex road model/layCentreline for Track Core. Do not mount a second scene/world/renderer/clock/audio runtime. For scenery themes, original buildScenery is preserved with its import closure, but is not adopted into the Racer Site.

Actual proof: standalone source forms for five parts, original warehouse vs existing KFB deformation, browser errors[], source hashes, syntax and part-contract checks. Final packet is SOURCE READY / MODULAR CANDIDATE, not a full KFB city or physical-building acceptance. See INTEGRATION_HANDOFF.md and SOURCE_LOCK.json for exact source closure and caveats (original texture Math.random, omitted rocks/audio/binaries).

Next productive use: Claude Design opens these original forms, applies existing KFB materials/deformer and one approved facade to one building; preserve silhouette and source/adapter distinction. Full city layout remains with its owning future slice.
