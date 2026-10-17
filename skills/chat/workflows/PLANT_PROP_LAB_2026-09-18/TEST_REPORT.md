# KFB Plant Prop Lab · Wobbleflora/Crazy-Cat art-direction documentation audit · 2026-10-12

**Mode:** source and documentation text audit only; **NOT a 3D browser, renderer, audio or visible design test.**
**Repo:** georg-doc/kayfabizarro; **branch:** research/kfb-worldlab-weather-environment-vfx-sfx-2026-10-12, existing Draft PR #389.
**Owner:** existing KFB Plant Prop Lab / Living Plants. **Result:** documentation and source-owner consistency checks **27/27 PASS** (26 literal text checks passed first run; one `rootedNotImplemented` check returned false because it expected different wording. The reread showed the same explicit not-implemented condition in different wording; check adapted to actual text and verified in a 7/7 focused recheck). No code/runtime repair was made.

## Actual sources read (current main for source modules)

1. `tools/KFB-ToolBox/_inbox/KFB_Plant_Prop_Lab_v1/KFB_Plant_Prop_Lab_v2_EXPORT_2026-09-19/KFB_Plant_Prop_Lab_v2/src/plant-recipe.js` — pot containers in existing recipe; no verified potless variant.
2. Same package `src/plant-pattern.js` — `composeBands()` register-based pot ornament, existing CELL_LIMITS 3–10 loud / <=16 quiet, existing palettes and `paletteForBiome()`.
3. Same package `src/plant-rig.js` — `makePropRig` native pivot/wind/spring.
4. Same package `src/plant-eyes.js` — existing KFB EyeRig v6 adapter.
5. `docs/SPRINT_19_CARTOON_DEFORMER.md`, `docs/SPRINT_20_LIVING_PLANTS.md` — contract before code / explicit not built.
6. Owner workflow `START_HERE.md`, `CHANGELOG.md`, new `RETURN.md`, new `WOBBLEFLORA_CRAZY_CAT_POT_STYLE_DIRECTION_2026-10-12.md`, and World Lab carrier Wobbleflora concept and RETURN.

## Checks run and passed (27)

- Correct Plant Lab owner; owner START_HERE recovery route; owner Return exists; owner changelog additive.
- World Lab Wobbleflora research concept links back to owner; World Lab Return routes ownership correctly.
- Distinct potted, rooted, and mixed concepts represented; rooted/potless genuinely marked not implemented.
- No runtime represented as built; actual existing recipe emits pot containers, not fictional potless switch; source text acknowledges this.
- Current S19 `composeBands` used, 3–10 loud/16 quiet ceiling and biome palettes preserved; 3–5 loud motif target stated as **candidate only**, not modified code thresholds.
- Actual native `makePropRig` and `loadEyeRig` / EyeRig-v6 adapter source routes documented.
- S19/S20 proposed deformation/clip contracts unbuilt; parent World Lab weather source-isolation gate retained.
- Plant Lab first optional visual gate is PPL POT-MACRO SOURCE A/B with original source isolated, fixed seed/camera; no public Stage claim; no runtime change; WorldBuilder R4 STOPPED/no R5.

## Actual non-results and deferred measurements

- **0** new source assets created/modified.
- **0** geometry deformer or tube animations implemented; **0** potless placement adapters implemented.
- **0** new visual source-isolation images/contact sheets; **0** web browser motion or EyeRig proof runs.
- **0** target mobile frame time/FPS/draw-call/audio tests; **0** newly executed CI tests.
- **0** Site publication, Cloudflare Stage, Live promotion or merge.
- Existing S18/S19 historical numbers and recipe/asset integrity were read as source, **not newly measured**.

The **only recommended next Plant Lab gate** is source-isolated original S19 pot/pattern A/B vs larger macro ornament at fixed seed, camera and distance before any Wobbleflora implementation. This remains optional and does not block the separate World Lab Weather/SFX gate.
