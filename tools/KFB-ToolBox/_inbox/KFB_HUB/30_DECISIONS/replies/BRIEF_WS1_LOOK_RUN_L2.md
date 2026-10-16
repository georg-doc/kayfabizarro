# Briefing WS1 · Look run L2 · warm diorama light, clay look for figures and vehicles, dieselpunk lineup

WS0 → WS1 · 16.10.2026 · V-340 (extends V-329 light L1; does not replace it). One long run in three steps, measured by you against the grid, **no reviewer rounds in between** (V-312). Do not reset M1 TUNE / M2; this runs alongside or right after, your call in WS1_STATUS.

## 0. Sources (all exist)
Register branch `docs/kfb-decisions-register-2026-10-11`, folder `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/`:
- `replies/BRIEF_WS1_LIGHT_R1.md` (L1, V-329) – stays the base: one light writer, `timeOfDay`, J17 day values, sun is the only shadow caster, 4–6 pooled shadowless PointLights, `practicals[]`, faces never receive shadows.
- `replies/WS0_KRAZY_KAT_LIGHT_FLUFF_ACTOR_INTENT_R1_2026-10-16.md` (Georg's new look intent, written by the web chat): warm Krazy Kat default, light identity per character, six Fluff colours.
- `replies/COLOR_HARMONY_R1/kfb-cartoon-palette.js` (V-305, the one colour generator) + V-331 answers.
- Clay look: `skills/chat/KFB_OPEN_WORLD_CLAY_SURFACE_CANON_2026-10-07.md` (main), clay material `tools/KFB-ToolBox/_inbox/KFB ToolBox Production-06/KFB_TOOLBOX_CLAUDE_DESIGN_SESSION_CUT_2026-09-30_r2/kfb-lib/clay/clay-material.v10.js` (main) and the Golden K1/H0 baseline on branch `work/clay-style-ssot-2026-10-01`. Look target remains Joyride J17 (V-010).
- Vehicles: branch `assets/meshy-arcade3-marble-vehicles3-2026-10-16` @9bd8e037, folder `media/3D_Assets/MeshyModels/vehicles/` – 13 racers `<id>_browser.v3.glb` + `<id>.kfb-vehicle.v3.json` (×1.5, V-321) and NEW `wasteland_beetle/` (Ödland-Käfer, V-323, bird stays on the roof, `entryMode: hop-in-hidden`, fused wheels with `kfb_wheel_*` hub anchors). Size sheet `05_v3_groessenvergleich.png`.

## 1. Step 1 · Light L1 + warm default + character light identity
1. Build L1 exactly as briefed (dialog scene FB + GothGirl with real card, Goblin Bank v2, Atlantis; day / golden hour / story night).
2. **Warm default (Georg's choice):** add look **B** next to the J17 control **A**. B = warm Krazy Kat stage: warmer sun, terracotta/ochre ground bounce in the hemisphere, coral-to-ochre sky, a cool blue/violet counter-accent in shadows or sky; all values still from V-305 roles (hue shift inside the generator, no second palette). The per-card story colour on the ground (V-331) stays. Printed card never tinted.
3. **Light identity per character** as data, not as extra lights: `lightIntent` per actor = `rimColor`, `rimStrength`, `fillTint`, `keyBias` (warm/cool), `priority`. Render it as a rim/fresnel term in the clay material plus a tint on the fill; the talking actor may borrow one pooled light for focus and give it back. Start profiles: FrizzleBob warm heroic rim, GothGirl violet mystical rim; story-mode presets (tragic cool fill, heroic warm angled key, mystical violet, forbidden wine, comic/absurd bright accent).

## 2. Step 2 · One clay look for figures and vehicles
Georg wants everything in the handmade clay look; KayKit default materials and Meshy's metal/gloss are not KFB clay.
1. One clay material profile from the canon (check v10 against the Golden K1/H0 and J17 before choosing; report which one and why). Matte (roughness high, metalness 0), soft thumb-print / modelling noise, clay rim from Step 1.
2. Apply to KayKit actors in the stage and to all Meshy vehicles. Meshy textures stay recognisable: palette pull at most 18 % (V-286 rule), no repaint.
3. No runtime mesh changes (V-336); only material/shader parameters.

## 3. Step 3 · Dieselpunk lineup
A lineup scene on one stage: all 14 vehicles + FrizzleBob + Orc Brute at the v3 scale, in day / golden hour / night, same camera marks. The M2 hop-in car (02 Flammen-Dragster) keeps working; ears may fold inside (V-321).

## 4. Acceptance grid (measure yourself; numbers in WS1_STATUS)
- G1 eyes, mouth, bubble, card edges and marginalia readable in every mood (L1).
- G2 no floating figures (contact shadows), < 0.1 % clipped figure pixels.
- G3 card pixels unchanged; Meshy textures ≥ 82 % original.
- G4 night: at least two local light islands, figures readable.
- G5 cost before/after: lights, shadow pass, draw calls, frametime; target 60 fps on Georg's M4; Step 2 adds ≤ 1 ms.
- G6 look B: sky/ground/hemi in the warm band, story ground colour still the card's story mode, one cool counter-accent visible.
- G7 rim identity visible on FB and GothGirl, faces still evenly lit.
- G8 no plastic or metal gloss on figures or vehicles (no specular hotspot brighter than the lit albedo).
- G9 FB, KayKit figure and one vehicle side by side read as one material family.
- G10 lineup: all 14 vehicles + FB + Orc at correct relative size (size sheet), three moods.

## 5. Delivery
Branch `ws1/preview` → `https://ws1-preview.kayfabizarro.pages.dev/` with URL flags for A/B and the lineup; one fixed image series (same cameras, 16:9 and 9:16) per step; one WS1_STATUS entry per step. Georg judges A|B and the clay look live. Not in this run: Fluff HUD and pickup flight (go into Claude Design HUD R4 first), alchemy, weather.
