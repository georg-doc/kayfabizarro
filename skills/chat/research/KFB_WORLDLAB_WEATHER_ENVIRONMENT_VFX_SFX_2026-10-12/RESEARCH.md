# KFB World Lab · Free Weather / Environment / VFX / SFX Donor Research · 2026-10-12

**Mode:** RESEARCH, source-first, documentation only. **Outcome:** a reusable, license-conscious, ranked intake catalog for the existing World Lab / Sky / VFX / Audio owners. **NOT ADOPTED:** no new shader, code dependency, weather runtime, audio engine, extracted media, Stage/Site or Live.
**Repository:** georg-doc/kayfabizarro. **Research branch:** research/kfb-worldlab-weather-environment-vfx-sfx-2026-10-12.
**External public-source review date:** 2026-10-12. This is a research classification, not runtime, package integrity, browser or listening verification.

## 0. Owner and project facts (current GitHub, not memory)

- WorldBuilder/WB2 and island geometry stay blocked by Island R4 human F-R39 FAIL: no MVP, no Golden baseline, no R5/runtime authorization. See skills/chat/recovery/POSTMORTEM_ISLAND_MVP_R4_WORLD_MODEL_SYNTHESIS_FAILURE_2026-10-08.md and skills/chat/recovery/KFB_FOUR_ISLAND_STORY_RECOVERY_2026-10-08.md.
- The existing Sky/Environment integration donor is the SKY3 cut at tools/KFB-ToolBox/_inbox/KFB Skydome Gates SKY3/KFB_SKYDOME_SKY3_SESSION_CUT_2026-10-01_r1/. START_HERE and docs/RETURN_SKY1 describe a single EnvironmentHost, one scene/renderer/update loop/fog writer, time, rain, Aurora, God Rays, Lens Flare, stars, shell choices and a source-backed clay cloud family. This is a **candidate donor**, not a newly accepted production sky. The v3 cloud family is TUNE, not Golden; source-isolation and perf are open. Do not copy the old Hex integration as architecture (Hex was later rejected as macro terrain owner).
- Important inherited evidence: SKY3 cloud/E4 measurements included 12 clouds at 77 ms versus 46 ms without clouds in one HX1 preview; large screen coverage/Clay fragment cost suspected. This is not a target-device benchmark. Additional rain/fog/transparency passes must be budgeted conservatively.
- Existing VFX-01 source-isolated review already contains Brackeys VFX, FreeHitVfx, cartoon smoke, Tiny Swords, explosions_smoke, Kenney smoke particles, Combat Ink Atlas/recipes and Boxel audio-feedback. Source: tools/KFB-ToolBox/_inbox/KFB_VFX_01_REVIEW/RETURN_VFX_01.md. Do not re-download/duplicate source banks or choose visual family without inspecting the actual image/animation isolated.
- Existing Audio baseline (skills/chat/workflows/KFB_AUDIO_SOUNDSCAPE_BASELINE_V1_2026-09-24/START_HERE.md) has one AudioContext/mix owner; audio asset source: media/3D_Assets/Audio/ and media/3D_Assets/Sounds/. Travel owns wind/gust/rumble/Jukebox; the common vocabulary includes WORLD_SFX, LOCAL_AMBIENCE and GLOBAL_BED. Never start a second mixer/AudioContext or obscure speech.
- Creative reference: existing four-world recovery KFB Town / Dystopia / Utopia / Protopia, and KFB Clay Golden/style canon. Effect choice is subordinate to the island's authored place, activities and causal micro-story. Not an excuse for generic scenery or random shader spectacle.
- Stage route **not required** for this documentation-only research. No Cloudflare or GPT Site publication and no hub/router mutation.

## 1. What low effort actually means

**L0 Already in KFB:** reuse a verified, existing module or asset without new dependency; still requires source, visual or audio check. **L1 Download and configure:** CC0 image/sprite/audio with metadata and a thin existing-owner mapping, no new renderer. **L2 Adapt one isolated donor:** small import/shader/adapter or texture conversion, target FPS and lifecycle proof required. **L3 Framework or generation instructions:** API/renderer migration, build system, second owner or major changes. Not eligible for no-effort selection.

**Disposition:** P0 = inspect/reuse existing; P1 = free low-friction intake; P2 = bounded technical inspiration only; HOLD = restrictions or incompatible costs. Licenses describe the upstream source, not an authorization to repackage files whose licenses/contents were not individually checked.

## 2. Ranked candidates · authoritative upstream links

| ID | Category | Resource / upstream source | Rights, reviewed | Effort / route | Candidate decision |
|---|---|---|---|---|---|
| K01 | SKY/WX | [KFB SKY3 cut](https://github.com/georg-doc/kayfabizarro/tree/main/tools/KFB-ToolBox/_inbox/KFB%20Skydome%20Gates%20SKY3/KFB_SKYDOME_SKY3_SESSION_CUT_2026-10-01_r1) | Internal source, existing KFB integration contract | L0 / P0 | **KEEP as existing owner candidate**, v3 cloud TUNE; no shadow runtime clone |
| K02 | WX | Travel rain-overlay / day-night / world-moods, documented in [SKY3 source Return](https://github.com/georg-doc/kayfabizarro/blob/main/tools/KFB-ToolBox/_inbox/KFB%20Skydome%20Gates%20SKY3/KFB_SKYDOME_SKY3_SESSION_CUT_2026-10-01_r1/docs/RETURN_SKY1.md) | Internal pinned Travel source; rights per each stored original | L0 / P0 | **REUSE first** for rain/night/gust/mood; never write independent sun/fog |
| K03 | VFX | [Existing KFB VFX-01 bank](https://github.com/georg-doc/kayfabizarro/tree/main/tools/KFB-ToolBox/_inbox/KFB_VFX_01_REVIEW) | Internal bank; per-origin licenses need spot-check | L0 / P0 | **REUSE & ISOLATE** real texture/source sprites before adopting |
| K04 | SFX | [Existing KFB audio baseline](https://github.com/georg-doc/kayfabizarro/blob/main/skills/chat/workflows/KFB_AUDIO_SOUNDSCAPE_BASELINE_V1_2026-09-24/START_HERE.md) | Existing KFB media/contract | L0 / P0 | **REUSE** mixer/ducking/ambient roles; fill true gaps only |
| E01 | VFX | [Kenney Particle Pack](https://kenney.nl/assets/particle-pack) | **CC0** official, 80 x 512px assets | L1 / P1 | **TOP external**, precipitation/air motes/sparkle/impact accents as billboard sprite sheet/particles; source-fidelity visual check |
| E02 | VFX | [Kenney Smoke Particles](https://kenney.nl/assets/smoke-particles) | **CC0** official, 70 files | L0 if already in KFB / P0 | **DUPLICATE GUARD:** KFB VFX-01 already lists a Kenney smoke bank; map source blobs first |
| E03 | SKY/LIGHT | [Poly Haven CC0 HDRIs](https://polyhaven.com/hdris), example [Overcast Soil Pure Sky](https://polyhaven.com/a/overcast_soil_puresky) | **CC0** official FAQ/license; example free sky HDRI | L1–2 / P1 | **USE as reference/IBL probe**, 1K/2K for calibration only; do not swap authored Clay Sky or use heavy 16K at runtime |
| E04 | ENV | [ambientCG](https://ambientcg.com/) | **CC0** source-reported, per asset | L1 / P1 | Subtle snow/rock/wet earth material/microtexture reference; no full PBR replacement of KFB clay |
| E05 | SFX | [OpenGameArt Rain (loopable)](https://opengameart.org/content/rain-loopable) | **CC0** asset page; 4 rain loops 25–45s, OGG/MP3 downloads | L1 / P1 | **TOP SFX** rain bed crossfade under existing LOCAL_AMBIENCE; waveform/loudness/loop points must be checked |
| E06 | SFX | [OpenGameArt wind1](https://opengameart.org/content/wind1) | **CC0** asset page | L1 / P1 | Gust/wind bed candidate; compare against Travel's already existing wind |
| E07 | SFX | [OpenGameArt wind whoosh loop](https://opengameart.org/content/wind-whoosh-loop) | **CC0** asset page; OGG loop | L1 / P1 | Movement wind / exposed track or storm accent, no continuous duplicate friction noise |
| E08 | SFX | [OpenGameArt rain and thunders](https://opengameart.org/content/rain-and-thunders) | **CC0** asset page, OGG ambience | L1 / P1 | Single storm ambient bed; distinguish music/atmosphere from discrete thunder cue |
| E09 | SFX | [OpenGameArt Water Waves](https://opengameart.org/content/water-waves) | **CC0** asset page; 4 FLAC samples | L2 / P1 | Shores/bridge/island water ambience; FLAC may need decode/transcode to OGG |
| E10 | SFX | [OpenGameArt 42 Snow and Gravel Footsteps](https://opengameart.org/content/42-snow-and-gravel-footsteps) | **CC0** asset page; 7z source/FLAC reported | L2 / P1 | Snow/gravel contact sounds, footfall event timing owned by locomotion; convert rather than runtime loading unsupported format |
| E11 | SFX | [Kenney Impact Sounds](https://kenney.nl/assets/impact-sounds) | **CC0** official, 130 sounds | L1 / P1 | Small environmental/contact accents after checking shared KFB bank for duplicates |
| E12 | SFX | [Kenney Sci-fi Sounds](https://kenney.nl/assets/sci-fi-sounds) | **CC0** official, 70 sounds | L1 / P1 | Area-51 / UFO / portal environmental accent; thematic restraint and no unnecessary synthetic tone |
| E13 | ENV/FX | [three.js Sky example](https://threejs.org/examples/webgl_shaders_sky.html) and [upstream MIT license](https://github.com/mrdoob/three.js/blob/dev/LICENSE) | **MIT** project; verify individual example headers | L2 / P2 | Atmospheric reference **only**: current SKY3 is the integration authority |
| E14 | ENV/FX | [pmndrs/drei-vanilla](https://github.com/pmndrs/drei-vanilla) | **MIT**, official LICENSE; Clouds/Sparkles/Stars/Caustics | L2–3 / P2 | Inspect individual pure-Three donor only; do not bring in a second sky or scene rig |
| E15 | WX | [CK42BB procedural-weather-threejs](https://github.com/CK42BB/procedural-weather-threejs) | **MIT**, repository README; GLSL/WGSL weather recipes | **L3** / P2 | **SPECIFICATION/SKILL DONOR, NOT DROP-IN LIBRARY**. Rain/snow/fog/lightning/dust/aurora/12 state definitions are documented; performance claims untested; new state machine would conflict with single EnvironmentHost |
| E16 | VFX | [three.quarks](https://github.com/Alchemist0823/three.quarks) | **MIT** README; general Three.js particle library + editor | **L3** / HOLD | Good architecture and authoring reference, but overkill for no-effort weather; cannot silently become universal VFX runtime |
| E17 | POST | [pmndrs/postprocessing](https://github.com/pmndrs/postprocessing) | **Zlib** upstream; includes Bloom, God Rays, Shock Wave, Outline, LUT | L2–3 / HOLD | Most FX already have donors; only evaluate isolated effect inside current single composer after style/perf proof |
| E18 | VFX | [OpenGameArt rain_overlay.png](https://opengameart.org/content/rain-1) | **CC0** asset page | L1 / P2 | Minimal transparent weather overlay if existing Travel rain fails a specific case; source-first, avoid second camera overlay |
| E19 | SFX | [Mixkit Free Sound Effects](https://mixkit.co/free-sound-effects/) | **Custom Mixkit SFX license**, game use permitted, **standalone/stock/source redistribution prohibited** | L1 consumption / HOLD for asset-vendoring | Only when usage and downloadable game package conform; not a generic redistributable stock SFX mirror |
| E20 | SFX | [Sonniss GDC bundle](https://sonniss.com/gdc-bundle-license/) | **Custom EULA v2 effective 2026-08-27** | L2–3 / HOLD | Large specialized option; commercial end-product terms can be useful, but not assume CC0 or freely redistributable raw KFB files |
| E21 | SKY | [pmndrs/sky](https://github.com/pmndrs/sky) | public project, package-specific rights require dependency check | **L3** / HOLD | WebGPU-only TSL, three >=0.185; incompatible with a no-effort WebGL Sky enhancement; no second runtime |

**Source verification scope:** the external links were investigated as public upstream pages; the KFB paths were read from GitHub. Individual binaries were **not downloaded, decoded or listened to**, and code packages were **not imported/run**. Repository descriptions/performance budgets are upstream claims, not measured KFB results. Existing KFB VFX review source isolation does not transfer automatic PASS to any newly proposed effect.

### License policy / important traps

- **CC0 source media:** simplest to vendor into the KFB asset pool with URL, author, downloaded filename, source license, exact hash, and an entry in the existing asset registry. A public catalog entry alone is not a verified blob.
- **MIT or Zlib code:** include notices/attribution as the applicable license requires; verify transitive bundled content and any per-file copyright notices.
- **OpenGameArt is mixed-license:** use only specifically checked CC0 *item pages* (E05–E10/E18), not arbitrary collection members. A lookalike [Thunder, rain and wind](https://opengameart.org/content/thunder-rain-and-wind) is GPL 2/3, **not CC0**.
- **Mixkit SFX vs Mixkit Music:** distinct licenses. [Mixkit SFX](https://mixkit.co/license/modal/sfxFree/) permits game usage but forbids standalone stock redistribution; [Mixkit Music Free](https://mixkit.co/license/modal/musicFree/) explicitly disallows video games. Do not confuse them.
- **Sonniss** offers its own EULA, not CC0; review bundle/license version and permitted derivative redistribution before adoption.
- **No wholesale asset pack import** until checked against the existing media library and byte/pin/provenance rules; no direct runtime hotlinking to third-party audio/image URLs.

## 3. Minimal candidate effect palette (creative mappings, not canon or preset implementation)

| KFB situation | Existing first | Optional CC0 addition | Avoid |
|---|---|---|---|
| KFB Town / cozy/day → showers | SKY3 time/fog/Travel rain; KFB Audio owner | E05 rain loop, E01 modest droplets on local exposed patch | Whole-screen rain texture overpowering craft surface; blanket LUT |
| Protopia outdoors / morning mist | existing light/fog + Clay palette; 3D cloud from current SKY3 donor | E06 wind and E03 low-resolution overcast HDRI **for calibration only** | Photorealistic skybox as replacement Clay-world style |
| Dystopia / storm and dust | existing sky + local semantic state | E01/e18 only for a distinct isolated dust/precipitation need; E08 thunder bed | Copying E15 12-state weather controller; huge particles |
| Utopia / engineered/alien weather | existing one-owner sky/mood; restrained local emissive FX | E12 Sci-fi SFX or single VFX-01 ink/circle family after isolated display | Generic neon postprocessing, second FX pipeline |
| Joyride road / wet surface | source-authored surface state, Track Core physics unchanged | E11 contact impact, E05 background rain | Wet-looking shader that changes friction, handling or contact truth |
| Snow / high peak | existing fog/world scene owner | E10 snow contact sounds, E01 sparse local flakes | Snow coverage as fake terrain/contact; imported 40k particles by default |
| Coast / cave / Library scenelet | existing terrain/water and Audio local-ambience routing | E09 wave textures/audio only with place-specific reason | Loop on every biome or non-diegetic audio clutter |

The four creative mappings are editorial suggestions, not new island lore, acceptance specs or an authority to deviate from the Four-Island Story Vision A/B gate. Asset family must be shown *in isolation* before placement. For each material/FX, compare to K1/H0 Golden and K2/v10; no generic default physically realistic water/sky pass.

## 4. Recommended zero-rebuild integration order (executor, **not authorization**)

1. **Internal no-download census:** for K01/K02/K03/K04 list exact current source module/blob/audio filenames and corresponding capabilities (rain, cloud, stars, fog, local SFX). Check KFB asset registry for E01/E02/E11/E12 duplicates. No imports yet.
2. **One optional isolated mini-fixture per category:** show the actual existing Travel rain and the E01 *real* sprite on plain gray cards side-by-side, plus a source-isolated Kenney smoke frame sheet; make a dry/rain scene toggle consuming the existing EnvironmentHost weather fact. Do not build an independent WeatherManager.
3. **Audio A/B using the real KFB mixer:** choose a single E05 rain clip against existing travel wind and a voice cue, preserve silence/mute and exact loop length, compare speech ducking and click/gap at loop boundaries. Keep all audio on current GLOBAL_BED/LOCAL_AMBIENCE/WORLD_SFX buses, no second AudioContext.
4. **Special effects only after that:** one local snow/dust or thunder cue; visual PERF before integrating. Require LOD/visibility caps for transparent FX and avoid a redundant full-screen composer.
5. **Version/pin only successful individual assets:** store source page/license file, SHA-256/size, local media path and content attribution where needed, update existing asset metadata once; never vendor entire external framework by default.

**Suggested first measurable 3-scenario gate for a future authorized executor:** (A) dry→rain→dry without a second sun/fog owner; (B) rain loop with speech + mute/duck; (C) isolated smoke/dust source object to Clay-context screenshot. Record GPU median/draw calls/source hashes, speaker listening review, and a source-isolation image. These are **NOT RUN** here and must not be reported as tests passed.

## 5. Research exclusions / source truth

- No acceptance claim for E15's README numbers (up to 100K GPU particles or sub-five draw calls); the repo contains **a Claude Code skill/reference text**, not an already integrated browser weather implementation.
- No new Sky shader just because external atmospheric packages look impressive. KFB already has rich SKY3/Travel source and known performance issues.
- No import of a whole postprocessing stack to achieve a single fog/rain look.
- No naive use of OpenGameArt collection-level licenses or asset-site search listings.
- No synthetic placeholder SFX when exact sounds already live in KFB's audio pool.
- No GitHub Pages, githack, raw CDN, local-file or offsite browser page reported as KFB Stage acceptance.
- No owner/branch/PR substitution for WorldBuilder R4 or Four-Island vision.
- No image/video/audio hearing or visual PASS was conducted in this research.

## 6. Sources and continuation

- Upstream vendor and item URLs are in the candidate table. Machine-readable inventory: SOURCES.json alongside this report.
- Internal owner docs: SKY3 START_HERE.md and docs/RETURN_SKY1.md, KFB VFX-01 RETURN, Audio Baseline START_HERE.md, Island R4 Postmortem, Four-Island Story Recovery + Design Brief.
- **One next gate:** future existing-owner executor performs the **KFB WEATHER/SFX THREE-SCENARIO SOURCE-ISOLATION AUDIT**, using K01–K04 first and E01/E05 only if the existing bank lacks a suitable original. Research itself needs no Georg acceptance gate.
