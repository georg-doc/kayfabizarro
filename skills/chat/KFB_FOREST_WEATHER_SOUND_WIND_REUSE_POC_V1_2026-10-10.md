# KFB Forest Island · Living Weather, Wind & Horror Soundscape POC v1.2
Date: 2026-10-10
Status: POST-MVP AUTHOR DESIGN + SOURCE DONOR AUDIT; DOCUMENTATION ONLY / NOT IMPLEMENTED
Owner: existing KFB Island Worldbuilder / Minigame planning on `planning/kfb-fluff-crafting-almanac-ideation-2026-10-09`
Receiving product: later Forest/Cabin/Werewolf Island; reusable Environment consumer across KFB islands.
Parent: `skills/chat/KFB_FOREST_CABIN_WEREWOLF_ISLAND_CHARACTER_COMEDY_V1_2026-10-10.md` (current v1.1).


> **GEORG UPDATE · 2026-10-10 · SNOW + FOG OF WAR + TINYSKIES NIGHT LAMP:** The **current execution handoff** is [KFB_FOREST_KISS_LIVING_WEATHER_LIGHT_EXECUTOR_BRIEF_2026-10-10.md](./KFB_FOREST_KISS_LIVING_WEATHER_LIGHT_EXECUTOR_BRIEF_2026-10-10.md). Author intent is deliberately **KISS snow and fog**, not simulation: cheap sparse snowflake visuals; existing atmosphere `fogNear/fogFar`; optional darkness with **TinySkies warm avatar-following point light** (KFB port `travel/wip/travel_globe_wsa/globe-v13/avatar-lamp.js`, blob `7c8029162d8b116aad975a81cd0c2f754999b370`). TinySkies `Game.ts` gives original `PointLight` and `CampsiteScene.ts` gives campfire light; this is **NOT a spotlight cone** and the globe light scale must be refit. The **light-radius night effect** provides suspense *instead of* a new stateful Fog-of-War system. Existing `avatar-lamp.js` explicitly says true persistent explored/unexplored masking is **not built**; KFB Overworld documents that idea, but it must be treated as a separate future World/Save/visibility feature, not claimed as donor-complete. No proof of TinySkies snowfall source port. TinySkies portals stay separate; Tornado remains entirely deferred. No new runtime task is authorized by this planning note.


> **GEORG KISS OVERRIDE · 2026-10-10 · CURRENT FIRST POC:** The first proof is **one real forest patch**: subtle GPU grass/bush/tree sway, existing TinySkies rain overlay, existing-owner fog and coherent KFB Audio ambient bed with one spatial close wolf growl OR distant scream. No new weather runtime, complex snow accumulation or physics. Snow remains a deferred simple flurry look check; lightning/thunder a later brief synchronized cue. TinySkies `WaterSpouts.ts` / `CarpetLeaves.ts` remain documented candidates **only**, but **TORNADO = DEFERRED** and carries no first-proof work, no physics/force adapter and no repair budget. If hard, leave it parked. **TinySkies portals** are also desirable, but are a **separate visual/closure donor**, not part of Forest weather POC: see `skills/chat/KFB_TINYSKIES_PORTAL_VISUAL_CLOSURE_DONORS_V1_2026-10-10.md`.


## 0. Outcome and creative reason
The Forest/Werewolf Island becomes a bounded, representative testing ground for **sound, wind-driven living vegetation, precipitation, mist/fog, snowfall, storm, lightning/thunder, and tornado/wind VFX**. In the scene, two genre-aware Hikers hear a distant scream, encounter a close unseen wolf growl, misread a wind-shaken bush, and confidently make bad choices despite reciting horror-survival rules. These are event/visual/sound triggers, NOT a new script pool/Triplet contract: Georg corrected the prior dialogue assumption; current independently managed pool Sheet and ChatterBox owner still govern actual lines.

All of this must eventually serve the **broader fragmented KFB island universe** with appropriate per-island look, weather, sound and varying motion; a gentle baseline breeze should make forests, shrubs and grass feel alive without hundreds of rigged actors.

## 1. Source-backed donor audit (current read, not verified runtime)
| Role | Exact inspected source | What it proves / doesn't prove |
|---|---|---|
| Rain | `georg-doc/tinyskies` `client/src/game/RainOverlay.ts`, blob `02e3e690b621c67052817fa4bb81d1bc65da8491`, and KFB Travel port `travel/KFB Travel Globe v13-1/globe-v13/rain-overlay.js`, blob `679defc912b2648a04778a3154ed9c0553dee30f` | Existing source rain streak/glass overlay; **not** accepted 3D volumetric raindrops or wet physics. The upstream source has `onLightningFlash` event hook, promising for one coordinated lightning→thunder beat. |
| Ambient sky/weather/fog | `skills/chat/recovery/KFB_ISLAND_MVP_INTEGRATION_CENSUS_2026-10-07.md` §Q (F-R24 remains Weather/Environment owner); existing KFB EnvHost with `setWeather(clear|rain)`, fog and day/night/mood | Real donor family exists; still not proof Forest's snow, localized mist or storms work inside current islands. No new WeatherManager. |
| GPU vegetation/wind | `travel/wip/travel_globe_wsa/globe-v13/ts-flora.js`, blob `3f9de0ee8624577ea85c73a3f101c00cfb4a38ee` | Actual wind in `onBeforeCompile` vertex deformation using shared `uTime/uWind/uAmp/uExp/uFreq`, `aHeight`, per-instance phase and `InstancedMesh`. Chunk culling matters: code documents old uncullable 1.36M triangle issue. Globe-relative normals and primitive shapes need adaptation to source-backed KFB island flora; not an accepted island effect. |
| Tornado / animated swirling funnel | **Original** `georg-doc/tinyskies`, `client/src/game/WaterSpouts.ts` on `cursor/globefly-multiplayer-globe-flight-game`, blob `0ceea2fce30a4562be3d0907229f592de674f3e5`. | **Source verified:** tapered twisting/swaying cylinder shader, seeded ocean-spout initial placement, three spouts, splash particle pool, velocity components with swirl/up/out motion, wandering on sphere, shoreline avoidance, player proximity check. This is an actual **waterspout** donor, NOT a verified land tornado with coherent force field, robust ground collision, object suction, damage or actor transport. User requested transfer of tornado + animated wind FX/physics; use this as candidate after isolating real rendered source. |
| Leaf/debris motion | Upstream `client/src/game/CarpetLeaves.ts`, blob `9c6b68e74865f3cc3dc687edffa3b19412ce8f00` | Source pooled fluttering particles, velocity, gravity, render shader; a leaf/wind behavior donor, not automatically a general tornado debris field. |
| Snow/fog | `travel/travel-v16/terrain-v16/voxel-terrain.js` contains `uFogDensity`; current Environment owner has fog. Existing audio inventory mentions snow footsteps, but audit did **not** verify real snowfall particle/deposition asset or local fog volume. | Fog base is source-backed; **snowflakes, persistent snow layers, local ground mist, snow interactions = SOURCE_REQUIRED/UNTESTED**. |
| Sound and original score | `skills/chat/workflows/KFB_AUDIO_SOUNDSCAPE_BASELINE_V1_2026-09-24/INVENTORY_AND_ARCHITECTURE.md` with existing buses `SCORE/LOCAL_AMBIENCE/GLOBAL_BED/WORLD_SFX/VOICE` and `RETURN.md` documenting historic accepted AUDIO-CAL | Existing mixer/ducking is owner. Do not spawn second AudioContext. Existing SFX bank first, then ElevenLabs sound-effects search or generation **as authoring candidate**, with explicit rights, provenance, license/terms, human audition and loudness/loop checks. |
| Lightning/thunder | The upstream RainOverlay includes light flash state and `onLightningFlash` callback; Audio soundscape inventory identifies need for near/far thunder variants | One common storm event may synchronize light, delayed near/far thunder and soundbed. Not yet a real tested 3D KFB storm effect. |

## 2. Shared environment conditions, not a competing engine
Candidate **data projection** from existing Environment/World author to renderer/VFX, flora and Audio consumers:
`weatherType(clear|rain|snow|mist|storm|tornado), intensity, windVector, gustProfile, timeOfDay, temperatureMood, visibility, eventSeed, islandBiome`.
Names are illustration, NOT an accepted API or new universal mandatory schema. There is only **one authority** for weather/time, one KFB Audio mixer, one VFX/light/wind consumer seam per approved owner, and existing Movement/Physics/World for actual forces, collision and terrain.

## 3. States to prototype in the Forest
1. **Breeze / quiet day**: slow bending of instance grass/bushes, near-still trunks, occasional leaves; soft Forest bed.
2. **Night + near/far sound**: distant scream / twig snap then nearby wolf growl with spatial direction and attenuated occlusion; score must allow real silence.
3. **Rain + wind**: source rain overlay + linked vegetation gust and sound bed; rain direction/color coherent with mood. Separate optional world-surface wetness proof.
4. **Thunderstorm**: light/sky flashes then temporally coherent thunder (delay linked to distance when possible); a tree/cabin briefly revealed in silhouette, wind strengthens, safe reduced-flash mode.
5. **Fog/mist**: low ground haze near campsite and global visibility change; preserve navigability, landmark readability, mobile performance and one owned fog/light stack.
6. **Snow/flurries**: moving flakes, snow ambience/muffled footsteps, winter palette; **do not claim accumulated snow or terrain material persistence** without genuine source/owner proof.
7. **Waterspout/tornado**: isolate true TinySkies WaterSpouts cylinder-twist/swirl particle presentation; propose a land-adapted KFB clay/wind-vortex treatment **only after source test**, with anchored collision volume and guarded optional interaction force. Could become a surreal environmental toy beat, not compulsory danger.

## 4. Physically coherent yet inexpensive wind/tornado decomposition
- **World weather event**: trigger/duration/strength/direction from existing Environment authority.
- **Vegetation response**: grouped/chunked instanced GPU bend rooted at support surface, height-weighted and per-instance phase. Near canopy more expressive, far trees low update/LOD; avoid rigidbody grass.
- **Visual wind field**: leaves, clay dust, air strokes, bent grass and swirling debris with pooled particles; reuse real TinySkies/Travel donors before any new emitter code.
- **Tornado funnel**: `WaterSpouts.ts` can contribute twisted/swaying funnel profile + particle velocities; the original motion is on a globe/ocean, so must be reanchored to bounded island support and styled without replacing original donor geometry by guess.
- **Physics impulses**: actual player/Resident/prop forces, drag, lift or tumble must be explicitly authorized through existing actor/physics/destruction owners. TinySkies `checkCollision` only checks radial proximity, not a true force simulation. Avoid uncontrolled tossing of player off floating island; define rescue/respawn and reduced-intensity variant.
- **Audio**: directional gust/hiss, foliage rustle, thunder and reactive Forest score on existing KFB buses. Silence often beats constant rumble.
- **Optional interaction**: tornado gently ruffles NPC hair/camp props, makes tent wobble or lifts leaves/Fluff visually; do not claim world damage, item awards or saved terrain change unless their authoritative owners commit.
- **Quality/performance**: culling, particle pooling, GPU motion, mobile low-FX, muted audio and reduced-motion/no-strobe. Measure draw calls and frame times before scaling to many islands.

## 5. KFB-wide reusable scenarios
- **Forest/Werewolf**: fog, tree creak, moonlit gust, wolf growl, sudden lightning, perhaps nonviolent cartoon spout.
- **Graveyard**: drifting ground mist, bare-branch sway, cold distant church bell, dancing skeletons reacting.
- **Vampire**: bat clouds, strong high-cliff wind, lightning silhouette of manor, contained mist.
- **Prison Maze**: wind through tall watchtower, searchlight through fog, rain during maze changes; guard uniforms/plumes reacting.
- **Frost Isles**: snow, wind gusts, drifting flakes and muted ambience; layered snow only with proof.
- **Protopia/Town**: mild default living breeze, grass and canopy under warm mood.
- **Demon**: ash/swirl and smoke, but not compulsory snow or global storms.
This is a stylistic menu, not a fixed moral-weather rule or mandatory per-island feature quota.

## 6. Story/music/SFX opportunities — not pool dialogue
At campsite, loud distant screaming and near growl can interrupt the Hikers' apparently expert plan, leading them to split up. A wind gust collapsing a tent pole looks like monster interference; the actual wolf is elsewhere. Thunder reveals a fleeting silhouette that the tourists confidently misidentify. These are **physical scene beats**, not canonical ChatterBox Triplets. Forest musical score should alternate cozy camp/cabin notes with sparse dark-comic unease, then drop out for meaningful environmental sound; no copied songs, no generic filler.
ElevenLabs can be an external SFX discovery/generation source, **not** authoritative source pool, player voice runtime, audio mixer or a replacement of existing KFB Audio. Curate recorded/generated sounds with IDs, human listening, loop/crossfade and license receipts.

## 7. Current KISS first proof / acceptance (NOT RUN)
Use **the linked executable source-first brief** as the current instruction, not the superseded shorter §7. The first actual host-based scene should show one authentic KayKit tree, bush group and cheap grass with GPU wind; a real rain overlay; a simple **sparse snowflake switch** (without accumulation and without claiming a preexisting TinySkies snow particle source); inexpensive existing **atmospheric fog**; **night + avatar point light** or campfire light as cheap horror visibility; one actually sourced and auditioned wolf growl or distant scream through existing KFB Audio. The same fixed-camera footage should compare clear/wind/rain/snow/fog/night lamp on-off, subject to target performance. Only after that consider one other island and optional thunder.
**True Fog-of-War = future optional separate World/Save exploration map gate, not part of this KISS scene.** A point light does not persist explored areas. **Tornado = DEFERRED**; **portals = SEPARATE**. Zero new owner, URL/Stage, MVP gate or runtime code until explicit authority.

## 8. Protection, recovery and next gate
Read main `skills/chat/START_HERE.md`, `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`, `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`, this Forest parent and current Fluff Return. Main Four-Island R4 NO MVP / pending A/B remains unchanged. No unauthorized R5, no new World/Environment/Audio/Physics owner, no new P0 or Stage/Site route. Creative proposals do not become global canon restrictions; use effects suited to each 3D medium.
After two non-improving repairs on the same optional seam, preserve and quarantine that seam. Current only **parent deferred gate** remains `MINIGAME_FLUFF_SOURCE_AND_OWNER_AUDIT`; add Weather/Forest donor subsection to that source/owner check after MVP and explicit Georg authorization.
