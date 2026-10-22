# Return · WFC-01 / Blender Landmarks / Render Contract · 2026-09-28

Status: `BRIEFING PACKAGE READY · NO RUNTIME IMPLEMENTATION`

## Result

This bounded planning slice reconciles the current clay sources and the new Track Core v0.11 contract.

- **K2 remains accepted**: `KFB_CLAYMATION_K2_KNET_WERKZEUGE_2026-09-28` is the retained material/tool base.
- **T3 v2 remains a donor.**
- **S1 road v1-v3 is quarantined as a design failure.** Only its explicitly documented techniques survive; it is not a visual baseline.
- **Track Core v0.11 is consumed, not replaced.** WFC/Blender use its `seeds.wfc`, sockets and staggered layer windows while drive/contact geometry remains owner-protected.
- **WFC-01** is specified as a small deterministic editor-time filler outside the protected playable corridor.
- **Blender MCP** is scoped to source-proven landmarks, façade kits and WFC geometry donors.
- **KFB Render Contract R0** establishes one global answer for shadow detachment, bright/dark contact rims and clay-detail aliasing instead of per-scene bias guesses.

## Files

- `START_HERE.md`
- `CLAUDE_DESIGN_BRIEF_WFC_01.md`
- `BLENDER_MCP_LANDMARKS_CLAY.md`
- `KFB_RENDER_CONTRACT_R0.md`
- this `RETURN.md`

## Verification actually performed

- all created files were fetched back from the exact branch after each GitHub write;
- K2 accepted status and S1 failure boundaries were reconciled against their current GitHub packages;
- Track Core v0.11 Return and transition JSON were checked on `georg-doc-patch-2`;
- no runtime, browser, performance or Stage tests were run because this slice only prepares bounded executor contracts.

## Explicit holds

- pit-lane edge-line crossing;
- floating pit-box markings;
- city curb appearance versus full-height barrier collision;
- S1 road look and T3-v3 markings;
- global render preset implementation and consumer migrations.

## Next gate

`RENDER-R0 · Shared diagnostic + preset adapter`

Implement the global face/actor/prop/architecture/terrain shadow presets and Near/Mid/Far clay tiers once in the shared diagnostic scene, then prove the adapter first in World M2. WFC-01A and Blender BL-LM-01 remain ready but must consume the resulting preset instead of adding scene-specific workarounds.


---

## Additive research check · 2026-10-22 · Hybrid OSM / Goo / Resident + engine options

**Status: RESEARCH / PROPOSAL ONLY · NO RUNTIME IMPLEMENTATION / NO ENGINE DECISION.**

New additive research: [RESEARCH_HYBRID_OSM_GOO_RESIDENT_ENGINE_2026-10-22.md](RESEARCH_HYBRID_OSM_GOO_RESIDENT_ENGINE_2026-10-22.md).

- Verified the current WFC-01 contract is already an **editor-time constrained filler**: reuse it for local city/biome/landmark-adjacent composition rather than building an independent world solver. Preserve source-isolated K2/T3-v2 and existing no-build corridor/sockets, ID/seed, bounds, retries and fallback rules.
- Proposes the sequence **story/POI causal graph → OSM/source-pinned fixed anchors + Continuous Surface Truth + Track Core → WFC allowed-space arrangement → static bake/LOD → Resident Atlas/Life dynamic activities → separately authorized Goo state/presentation**. Runtime infection is NOT proven; Goo remains a proposed layer until an existing/authorized owner is identified.
- Reviewed official Godot 4 Web/export/render limitations and Godot/PlayCanvas/Babylon capabilities. **Decision: none**. Current recommendation: preserve existing Three.js / WorldBuilder / Race / Audio owners; consider Godot only as a later export-parity benchmark for a fixed scene packet, not as a new engine/runtime or migration now.
- Existing WFC-01 technical next gate remains **RENDER-R0**; higher World R4 remains STOPPED, and Four-Island Story A/B + Georg gate remains authoritative. Neither older Track Core v0.11 pins nor this research supersede current source/runtime contracts.
- **Executed here:** repository and public documentation read; no code/runtime/browser/performance tests, no visual source isolation, no Site/Cloudflare publication, no merge/Live. One research file + this additive Return entry only.

**One next WFC-01 gate unchanged:** `RENDER-R0 · shared diagnostic + preset adapter` before any WFC-01A implementation; World runtime remains gated by current Four-Island story/Georg decision.
