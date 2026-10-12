# KFB Plant Prop Lab · Wobbleflora + Crazy-Cat ceramic pot style · Georg art-direction update · 2026-10-12

**Owner:** existing KFB Plant Prop Lab / Living Plants, source/authoring only. **Document carrier:** existing Research Draft PR #389, branch `research/kfb-worldlab-weather-environment-vfx-sfx-2026-10-12`. **Status:** GEORG DESIGN DIRECTION CAPTURED / IMPLEMENTATION PROPOSAL · NOT BUILT · NOT VISUALLY ACCEPTED. Not a new plant engine, character rig, weather owner, stage, design canon for the Four-Island World or runtime build authorization.

## 1. Georg's two corrections (preserved)

1. Wobbleflora must work **equally well in decorative flowerpots and directly rooted in the ground**. The family should compose freely with ordinary KFB Plants (potted flowers/cacti, oversized/alien flora, eyed living props), retaining Crazy-Cat exaggeration and variation. Potted is **not** a secondary fallback; pot and potless are both first-class *authoring intent*. Existing PlantRecipe currently constructs pots; potless implementation is **not** claimed.
2. Current pot ornaments should become **larger, clearer, less fine-grained**, nearer the colorful, hand-painted, Mexican-inspired ceramic/folk-art graphic rhythm used in the Crazy-Cat references. Keep the visual identity lively and cartoon-readable; do not grow a dense wallpaper of small repeated motifs.

## 2. Verified current Plant Lab source and what must remain

Read before changes:
- `skills/chat/workflows/PLANT_PROP_LAB_2026-09-18/START_HERE.md` and `MENTAL_MODEL.md`: existing PlantRecipe → container/plant/rig → optional EyeRig → consumer placement, with stable source refs and no world transform ownership.
- Original Plant Prop Lab v2 package: `tools/KFB-ToolBox/_inbox/KFB_Plant_Prop_Lab_v1/KFB_Plant_Prop_Lab_v2_EXPORT_2026-09-19/KFB_Plant_Prop_Lab_v2/`.
- `src/plant-recipe.js`: code currently emits pot/saucer containers and cannot be described as supporting potless instances. Retain existing deterministic seed, source identity and roundtrip.
- `src/plant-rig.js`: transform/pivot spring, wind, and crown follow-through; no new rig owner.
- `src/plant-eyes.js`: adapter onto existing KFB EyeRig v6; face positions `pot/crown/float`, actual tube/face bend attachment **needs isolated proof**.
- `src/plant-pattern.js` / `docs/DESIGN_LINE_TOPFMUSTER.md`: S19 implemented *register grammar*, **not** original dense S18 cell tiling. One loud register, 3–10 loud shapes, quiet up to 16 by code `CELL_LIMITS`, registries driven by aspect, 12 biome palettes, shared dark outline and measured base/motif contrast (>=2.6). Default `density:7`. S19's own code names Mexican Talavera/Oaxaca and Crazy-Cat/Herriman sources; no new motif inventory is necessary without an actual design gap.
- `docs/SPRINT_19_CARTOON_DEFORMER.md` and `docs/SPRINT_20_LIVING_PLANTS.md`: proposed *future* true shape deform and named animation clips, **not implemented**; do not conflate with present pivot rig.
- `docs/BACKLOG_PLANT_PROP.md`: P0 source revision pinning and pot overlaps remain unresolved; pot-scale and source truth must be preserved.

## 3. Shared PlantRecipe identity with two placement embodiments

**Common concept:** one `Wobbleflora` plant family, parameterized tubular stem/arms/cactus branches + native Plant rig, optional EyeRig v6, Stable Seed and BIOME palette. Two **proposed** container modes:

- **POTTED:** Use the original *measured* Tiny Treats pot/saucer source, with proper plant insertion depth, soil, rim, rigid PotRoot, root sway above the soil only. The decorative pot is itself a strong design object; the lively plant may be plain or accent-colored. For a giant pot, respect authored `GARDEN/LANDMARK` scale. Do not scale/deform rim/soil when the tube buckles.
- **GROUND_ROOTED:** Same tubular plant form and motion/eyes, no pot mesh or saucer. The actual world owner supplies stable terrain placement/contact. The Plant Lab can author a compatible candidate recipe / local anchor adapter, **not** become a terrain, collision, persistence or world-identity owner. Source module does not yet support this; avoid making up a currently runnable potless toggle.
- **MIXED:** Scene/group recipe may hold two potted and one rooted plant, or existing ordinary plants plus one Wobbleflora. Avoid identical clones: vary tube height/arm count, species proportions, motion seed, ornaments and group-order deterministically. Source/authoring sameness, consumer-owned placement.
- Eye placement is independently authored (`plant crown` first for the living tube; `pot` remains an existing option when relevant); don't duplicate two faces by default. Eyeballs follow the deformed local face host, not the stationary pot or global camera arbitrarily.

## 4. Big-pattern Crazy-Cat art direction (additive to S19, not replacement)

**Keep S19's register system.** Do **not** return to a tiny square cell atlas, procedural tile wallpaper, numerous motifs of equal visual weight, or a new palette/shader/style owner.

Design rule:
- **One hero ornament per pot** — broad, decisive motif in one main register; secondary register(s) are sparse and quiet. Use negative space deliberately. The pot silhouette, belly, rim and foot determine motif placement (existing planned S20 `r(y)` profile measurement still unbuilt).
- **Fewer, larger repetitions** of existing `raute`, `zahn`, `kreuzblume`, `schuppe`, `punkt`, or broad `welle/greca`; favor broad painted diamonds, stepped bands, oversized petals/sunlike shapes and bold scallops over many little marks. Keep single common contour weight, not a sharp vector tile-grid.
- **Color:** Keep current palettes `talavera/terracotta/chili/jade/cobalt/clay/melon/orchid/...`, their clear color roles and `paletteForBiome()`. Cream/light ground, strong cobalt/turquoise/terracotta/ochre contrasts, one accent and nearly black ink-like frame where appropriate. Dark-ground `invert` is already supported. Any more saturated new palette is a separate measured design proposal, not automatically adopted.
- **Hand-painted rhythm rather than randomness:** Small controlled register-boundary and glyph-center wobble/variance from existing parameters, fixed seed, no frame-random texture, distressed grunge or generic ethnic sticker art. Do not reproduce a particular indigenous/Talavera pattern; use high-level ceramic form language without claiming cultural provenance.
- **Balance with plant:** If the plant is dramatically deforming/eyed, the pot graphic should support—not compete with—the eyes and silhouette. A plain or almost plain pot can be right for the most saturated Wobbleflora; strongest graphic pot for simpler green stem. Avoid decorative overload in three-pot groups.

**Candidate LOOKDEV tuning ranges — NOT an implemented code/config revision:**
- Main/loud register: compare **3–5 large glyph repeats** around the pot instead of the current allowed 3–10. Optionally **one main 45–60%-of-visible-body register** (the current S19 guide is 35–50% of height); preserve natural pot boundaries, don't force percentages onto all shapes.
- Secondary patterns: compare **0–1 quiet companion register** plus simple rim/foot accents against existing multi-register/default variants. Leave a generous visibly uninterrupted background region.
- Test an ultra-simple **broad single wave** and **large staggered stepped/diamond** option; do not add new motif generators before testing current glyphs larger.
- These are **proposed art-direction presets/test ranges only**. Retain all existing S19 backward-compatible `CELL_LIMITS`, six pattern gates, seed roundtrip, 12 palettes and palettes-by-biome until an independent visual/product test justifies a precise change.

## 5. One bounded visual proof, if later authorized in the Plant Lab owner

Use **actual original** source pot/plant objects and current pattern shader; show originals isolated first. The same fixed-camera, fixed-seed test presents:
1. **A:** current v2 decorated pot with an original planted specimen, at original current motif density.
2. **B:** *same pot and seed*, candidate macro-register preset only; compare near view **and actual consumer camera distance/mobile-scale**. It must look hand-painted, not become illegible/noisy at middle distance.
3. **C:** same authored Wobbleflora tube geometry with native motion and EyeRig v6 inside B pot. Deformer/buckle remains NOT_RUN unless separately built; for earliest proof use current rig without claiming real cloth.
4. **D:** exact same Wobbleflora form, ground-rooted via receiving terrain placement owner, not a Plant Lab-improvised world root. If terrain consumer unavailable, document POTTED proof now and mark GROUNDED=NOT_RUN, never fake integration.
5. **E (later):** two decorative potted Wobbleflora and one rooted tube, with fixed-seed wind / beat / La-Ola. Only when A–D pass source isolation.

Acceptance questions for Georg: **Does the ornament read as a bold painted image from the intended world camera? Does the pot support the plant/eyes rather than compete? Can exactly the same flora family convincingly inhabit pot and soil?** Keep four light/biome checks, contour/contrast, proper source asset, pot silhouette boundaries and rig/face attachments visible. Record true screenshots/contact sheet and frame/performance numbers when run; neither URL loads nor generated pictures prove reuse.

## 6. Handoff / state

**Mode:** additive art direction + authoring proposal, not executable code. **Owner:** KFB Plant Prop Lab, using existing v2 source and S19/S20 direction. **Branch/PR carrier:** `research/kfb-worldlab-weather-environment-vfx-sfx-2026-10-12`, Draft #389; subsequent implementation to be separately routed to existing Plant Lab owner. **Preserve:** WorldBuilder Island R4 STOPPED / F-R39 FAIL / no MVP/no R5; single SKY3/Travel wind, KFB Audio clock/mixer, EyeRig v6, asset registry and actual world placement owners. No new Stage/Site/Live or acceptance URL.

**Next one optional Plant Lab gate (later, not a blocker for World Lab):** source-isolated **S19 pot pattern MACRO A/B with fixed source/seed/camera**. Only after its visual assessment proceed to a potted Wobbleflora motion proof, then rooted/mixed group. Existing World Lab weather/VFX/SFX research gate is unchanged.
