# KlayBound / Claybound Visual Benchmark · WSA Input · 2026-09-26

Status: **SOURCE INPUT · VISUAL BENCHMARK · NO RUNTIME PROMOTION**
Receiving owner: **existing WSA lead / existing World, Travel, Race and ToolBox owners**
Stage: **NONE · documentation/check-in only**

## Georg decision / intent

Claybound is now the current **visual comparison benchmark** for the desired soft, tactile, chunky clay-world direction.

The received **KFB KlayBound POC 01** is useful as a candidate/proof, but Georg explicitly rates it as **still sub-optimal compared with the new Claybound benchmark**.

This check-in does not promote the POC, replace WorldBuilder/Travel/Race owners, or authorize a Live/Stage publication.

## Exact inputs

### External benchmark

- Web build: https://claybound-56949.web.app/
- Reddit reference / developer post: https://www.reddit.com/r/playmygame/comments/1whbinx/claybound_cozy_platformer_where_everything_is/?tl=de

Treat these as **visual/interaction references**, not as an automatic code or asset donor. Any later source/code/asset reuse requires its own source and license check.

### KFB candidate POC

Repository:
`georg-doc/kayfabizarro`

Observed main head during this check-in:
`2dcfdc8f28d78ec64738b96cf7e66fa5f61b4153`

Candidate package:
`tools/KFB-ToolBox/_inbox/KFB KlayBound POC 01.zip`

Git blob:
`ef209b768ace72394b4216f3a7226892d3166821`

The package remains **intake/candidate evidence**, not a new ToolBox or World SSOT.

## Comparison axes for the next review

Use Claybound as a benchmark across the whole presentation system, not as a one-shader target:

1. **Silhouette / massing** — rounded, chunky, hand-shaped forms rather than clean low-poly blocks.
2. **Surface continuity** — tactile clay detail with coherent scale across large and small objects; avoid indiscriminate noise.
3. **Material + lighting** — matte/soft response, strong readable form and contact grounding, restrained plastic/specular feel.
4. **Form language / detail budget** — simple geometry may remain simple when silhouette, surface and light carry the quality.
5. **Camera / motion presentation** — calm readable framing and movement; compare the POC as an experience, not only as a still material sample.

These are review axes, not yet accepted implementation parameters.

## Protected boundaries

- WorldBuilder / Travel remain world, terrain, movement and productive persistence owners.
- Race remains track geometry, route, contact, physics, gameplay and camera owner for Race consumers.
- ToolBox may author/package reusable look modules but does not become the world/runtime owner.
- Existing Environment Profile / Material Profile separation remains intact until a named receiving slice proves otherwise.
- Do not copy Claybound branding, code or assets merely because the benchmark loads in the browser.
- Before integration, show the actual KFB source object / POC **in isolation** and prove what is being reused; an asset URL or loaded file is not visual-source proof.

## One next gate

**WSA / visual review only:** unpack and run KFB KlayBound POC 01 in isolation, capture the actual rendered result, then compare it against the Claybound benchmark on the five axes above and identify the **smallest 1–2 high-leverage changes** before any World/Race integration work starts.

No Stage publication and no owner transfer in this gate.
