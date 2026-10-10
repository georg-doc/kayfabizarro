# KFB Forest · KISS Living Weather, Snow, Darkness & Light · Executor Brief
Date: 2026-10-10 · Status: SOURCE-READ PREPARATION; **NOT EXECUTED / NOT ACCEPTED**
Owner: existing Island Worldbuilder / Environment + KFB Audio / Resident Atlas, coordinated through the **existing** post-MVP Forest concept owner.
Branch: `planning/kfb-fluff-crafting-almanac-ideation-2026-10-09`
Parent docs:
- `skills/chat/KFB_FOREST_CABIN_WEREWOLF_ISLAND_CHARACTER_COMEDY_V1_2026-10-10.md` (Forest v1.1, dialogue correction binding)
- `skills/chat/KFB_FOREST_WEATHER_SOUND_WIND_REUSE_POC_V1_2026-10-10.md` (Weather v1.1, Tornado DEFERRED)
- `skills/chat/KFB_FRAGMENTED_ISLAND_GALAXY_META_BIOMES_VISUAL_GRAMMAR_V1_2026-10-10.md`
- `skills/chat/KFB_TINYSKIES_PORTAL_VISUAL_CLOSURE_DONORS_V1_2026-10-10.md` (separate portals, NOT in this POC).

## Decision / scope
Prepare **one small source-derived forest clearing** in the approved host, not a new island runtime. Prefer a recognizable existing KayKit forest-clearing donor over generating generic procedurally green terrain. Atmospheric life comes from:
- **Gentle wind:** a few real tree/bush/grass families with many instanced grass tufts; no rigid-body vegetation.
- **Rain:** existing TinySkies-derived overlay.
- **Snow:** simple sparse low-cost falling flake layer, optional winter-tinted palette and sound; not physically accumulated/deposited snow. A source-accepted TinySkies snow particle port is **NOT established** (do not falsely claim it); use any already approved cheap source or a strictly bounded renderer-owned presentation change.
- **Atmospheric fog:** existing sky/fog distance color near/far; no volumetric raymarching or expensive particle fog.
- **Darkness + light / faux Fog-of-War:** reuse real warm near-player point lamp donor and/or localized campfire lighting to reveal nearby objects in a darker scene. **The lit radius is NOT actual game-state/map discovery Fog of War.** It provides the intended immediate night suspense without introducing exploration state.
- **Audio:** one forest ambience and **one** curated wolf growl OR distant scream as distance-aware emitter via existing KFB Audio (existing SFX catalog first; ElevenLabs discovery/generation only after gap confirmed, license and audition); keep silence and speech audibility.
Tornado = **DEFERRED** entirely. Portal visuals = **SEPARATE** donor, not part of scene, travel or transition logic.
No extra weather manager, no second world, second renderer, AudioContext, physics owner or substitute branding.

## Verified source facts / isolation checklist
1. `tools/world_atlas/source/scenes/forest-clearing.js` blob `52bb0800429ea008e5e139c98bb73cad9bc64f3a` lists 105 real KayKit Forest Nature Pack 1.0 FREE GLTF models (20 trees, 22 bushes, 20 grass, 43 rocks). Isolate true chosen tree/bush/grass on turntable before using; verify original colors/sizes/pivot/packing.
2. `travel/wip/travel_globe_wsa/globe-v13/ts-flora.js` blob `3f9de0ee8624577ea85c73a3f101c00cfb4a38ee`: existing per-instance phase, height-weighted wind vertex shader, InstancedMesh chunks/culling. Current source built on sphere, so **adapt to local floating island frame** only within owning World/Environment integration.
3. `travel/KFB Travel Globe v13-1/globe-v13/rain-overlay.js` blob `679defc912b2648a04778a3154ed9c0553dee30f`: source-backed overlay (screen wet streaks/droplets) originally from TinySkies `client/src/game/RainOverlay.ts` blob `02e3e690b621c67052817fa4bb81d1bc65da8491`. Does not prove physical rain; stop at cheap rain look.
4. **LIGHT / NIGHT** `travel/wip/travel_globe_wsa/globe-v13/avatar-lamp.js` blob `7c8029162d8b116aad975a81cd0c2f754999b370` is a local KFB port taken from TinySkies `client/src/game/Game.ts`: warm `PointLight(0xeec4a8, 0, 6.5, 1.25)`, placed relative to avatar and scaled by **one externally-owned night weight** (documented upstream 0.38 max). **Not a SpotLight cone**; perceived light circle results from falloff and globe terrain. Globe source values are NOT calibrated for a small planar/fragment island — treat scale and reach as candidates, not fixed canon.
5. **CAMPFIRE** TinySkies `client/src/game/CampsiteScene.ts` blob `4449f9aa42ee8f83d518fc72a9b3d87afcfa5207`: actual campfire `PointLight`, flickering shader/fire and expensive optional 4 radial spot shadow sources on desktop; for KISS use ONE warm source; do not copy the four shadow spotlights or the entire campsite runtime. Existing KayKit Hiker Tent source remains unchanged.
6. **FOG** TinySkies `client/src/game/SkyPresets.ts` blob `dfbab3f733eed74cc281df47a3e44967c1c7b2eb` and `DayNightCycle.ts` blob `dd485092e574037f9782f9ef68f7649e8e100287` own source fog color/near/far blending. Existing KFB EnvironmentHost remains presenter/owner; no second `scene.fog` writer in the game.
7. **FOW DIFFERENCE** KFB `travel/wip/travel_globe_wsa/globe-v13/avatar-lamp.js` explicitly says real Fog of War visibility/discovery mask is *NOT BUILT*. The earlier `overworld/docs/LIVING_CONCEPT_overworld.md` and `overworld/docs/ChatGPT_Living_Concept_v23.md` include cheap snow particles, fog/fog-of-war and circular player visibility as **working concept**, not runtime proof. Keep exploration-history/mapping under existing World/Save owner and out of this initial slice.
8. `skills/chat/workflows/KFB_AUDIO_SOUNDSCAPE_BASELINE_V1_2026-09-24/INVENTORY_AND_ARCHITECTURE.md` documents existing GLOBAL_BED / LOCAL_AMBIENCE / WORLD_SFX / SCORE / VOICE buses, speech ducking, no timeline restart. Sound-generation origin, auditioned quality, source rights and asset metadata must be evidenced.

## Single proof recipe, no required new app
A. **Isolation:** show one actual KayKit tree, one bush and grass geometry with source identifier and screenshots; show existing Light / Rain / Fog source behavior alone before composition.
B. **Small clearing:** reuse an authentic island/terrain host; place one tree, 2–3 shrubs and small grass patches anchored to Surface Truth. No substitute terrain that looks like a flat green floor, no autonomous second World.
C. **Wind:** implement modest asynchronous phase sway on the real plants by donor-derived instancing/shader adaptation; roots stationary, correct normals, repeatable seed, no collision change. Show still/wind frames from same camera.
D. **Weather:** toggle clear/rain; cheap sparse snowfall for 1 short test; fog near/far change. Render actual state each time from same camera; low-FX option.
E. **Night reveal:** same scene at night with ONE warm avatar light (optional campfire via existing source), compare **lamp on/off**. The player sees nearby details; distant areas remain naturally dark. Verify plausible direction/falloff, readable player/landmark, no fake persistent cartographic reveals.
F. **Horror sound:** add spatial howl **or** scream to one world location and one approved ambience bed, compare approach/retreat audibility with mixer ducking. Don't supply fabricated audio or link placeholder URLs. If no approved file, mark `SFX_SOURCE_REQUIRED` and complete visual parts.
G. **Portability only after local proof:** test same breeze parameter on a Graveyard or Town plant donor without rewriting the host; otherwise preserve honest `NOT_TESTED`.

## Evidence / gates
One reusable **before/after proof** with exact asset ids and source look in isolation; fixed-camera screenshots/capture for still/breeze/rain/snow/fog/night-lamp; render timing/draw calls/memory on named target desktop/mobile and silent/audio sanity checks; cleanup, no double AudioContext, no second light/time/weather state; a concise `RETURN` with `PASS / FAIL / NOT_TESTED` for each.
No exact FPS threshold invented in this brief; use the owning acceptance matrix, and avoid a pass claim without actual target visual/performance evidence.
Weather prototype may be prepared after the current Four-Island visual A/B gate and explicit integration authority; until then this remains **a preparatory brief only**.

## Why the first pass deliberately does NOT build true Fog-of-War
Stateful "unknown/seen/visited" masking would require land/prop minimap or camera visibility masks, per-island discovery coordinates, Save/replay and accessibility rules. This would be disproportionate for a tiny spooky forest proof. It is separately meaningful later for maze/dungeon/wilderness exploration, but never implicitly created by the point lamp.
Use local darkness/light as a **playable presentation substitute**, not a misrepresented implementation of persistent cartography.

## Story cue / no new dialogue schema
Two Hikers explicitly know "don't split up", but an unexpected growl and sudden lamp shadow make each decide to check a different side of the tent; they rationalize the split while the wind visibly bends the same bushes they misinterpret. Visual/sound beat first. The existing ChatterBox/Pool Sheet owner supplies any actual dialogue after source review. No invented Triplet JSON or new bubble format.
