# KFB · Splat Examples R1 · visual reference and comparison register

**2026-10-24 · Source checked / private previsual studies created · PARTIAL visual evidence — not real 3DGS browser benchmark**  
**Owning project:** existing Infinite Canvas / Flatworld/Gutter Space design lane, `georg-doc/kayfabizarro`, branch `planning/kfb-flatworld-comic-gutter-r1-2026-10-18`, Draft PR #423.  
**Upstream brief:** `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/BRIEF_WEBCHAT_SPLAT_EXAMPLES_R1.md` **on** `docs/kfb-decisions-register-2026-10-11` (V-646/647), 2026-10-22.  
**Intent-first source:** `skills/chat/masterplan/KFB_SPLAT_PROCEDURAL_WORLD_R1_2026-10-24.md`; methods remain `INTENT FIRST · SOLUTION OPEN · EVIDENCE BEFORE PRESCRIPTION`.  
**Scope:** **ONLY VISUAL EXAMPLES / SOURCE DISCOVERY. NO MVP BUILD, NO INTEGRATION, NO NEW RUNTIME/SITE/STAGE, NO MERGE.**

## Reality check / what is and is not delivered

**10 external interactive real Gaussian Splat scene pages** were checked through source page text for creator/title, provider-displayed file size, and page-displayed download/license badge when present. Each link opens the independent **SuperSplat viewer**; this is **not** a screenshot/render from the KFB browser, nor proof of our KFB style.

**10 original, privately delivered, 1600×900 PNG paired concept stills** compare a cheap **A1 procedurally generated 2D gradient/shader-style** image on the left with a **synthetic A2 view-projected anisotropic 3D Gaussian-primitive field** on the right. **The two sides share a creative theme, NOT identical source geometry or capture.** They therefore illustrate competing visual languages; **they do not constitute a source-matched performance or quality winner**. The synthetic right-hand images are explicitly **NOT** pretrained 3DGS reconstructions, third-party source scenes, Spark GPU renders or SuperSplat Viewer frames. Created locally in Python/NumPy/Pillow, with measured local render timings.

**Private export to Georg:** chat attachment `KFB_SPLAT_EXAMPLES_R1_PRIVATE.zip` (not in this public GitHub repo), containing `index.html`, `contact_sheet.png`, ten `1600×900` pairs, `measurement_data.json` and `README_PRIVATE.md`. No claim of a persistent external URL, public GitHub asset or a browser-accessible owner site. External creator scene bytes, screenshots and model files were **not downloaded**.

**Key unfulfilled part of the source brief:** browser GPU WebGL2/Spark render and SuperSplat screenshot capture **NOT POSSIBLE / NOT VERIFIED** in this execution environment. Headless Chromium navigation to file and localhost was blocked (`ERR_BLOCKED_BY_ADMINISTRATOR`), and `getContext('webgl2')` on a set-content page was false. Consequently **real browser FPS, asset transfer/load duration and same-camera A1/A2 3DGS benchmarks remain UNKNOWN**. Do not convert CPU render milliseconds to FPS or invent browser values. The private synthetic stills are **previsualization**, not technical acceptance.

## Ten individually sourced examples and private comparisons

**Column interpretation:** size = published SuperSplat scene size, **not** measured download bytes; “CPU A1/A2” = local offline *still-image creation time*, **not** renderer GPU frame time; browser FPS/load = **UNKNOWN for every row**; the image filename is inside the private ZIP, **not** checked into GitHub.

| # | Theme / intended perceptual study | Real interactive splat source (creator) | License badge on source page | Provider size | Private synthetic A1 shader / A2 Gaussian still | Local CPU A1 / A2 (ms) | Browser FPS / load |
| --- | --- | --- | --- | ---: | --- | ---: | --- |
| 01 | **Water:** sight through an apparent shoreline/depth window | [JKU Wasseruhr](https://superspl.at/scene/fbb2ef6e) · michael_f | Download **CC BY 4.0** | 34.24 MB | `01_water_shore.png` | 247.15 / 474.42 | **UNKNOWN / UNKNOWN** |
| 02 | **Underwater:** submerged architectural depth, passing above water | [Lago di Barcis](https://superspl.at/scene/94a939d7) · ethan3111 | Download **CC BY 4.0** | 164.56 MB | `02_underwater.png` | 121.07 / 275.52 | **UNKNOWN / UNKNOWN** |
| 03 | **Vortex:** moving-view spiral/funnel optical effect | [Tornado — synthetic Gaussian splat](https://superspl.at/scene/34cef7dd) · dabadan | Download **CC BY 4.0** | 4.95 MB | `03_vortex.png` | 93.51 / 141.81 | **UNKNOWN / UNKNOWN** |
| 04 | **Fog:** dispersed soft particles, layered woodland haze | [Procedurally generated cloud](https://superspl.at/scene/f99bb0fb) · plan8 | Download **CC BY 4.0** | 418.24 KB | `04_fog.png` | 59.47 / 480.45 | **UNKNOWN / UNKNOWN** |
| 05 | **Cloud:** translucent stylized vapor, volumetric silhouette | [Disney Cloud](https://superspl.at/scene/35b8dbe8) · misha_m | Download **CC BY 4.0** | 1.66 MB | `05_cloud.png` | 128.87 / 1391.82 | **UNKNOWN / UNKNOWN** |
| 06 | **Crystal:** mineral faceting, refraction expectations vs learned appearance | [Vanadinite – Morocco](https://superspl.at/scene/ccd38341) · doudoid | **Not verified**; view only | 8.17 MB | `06_crystal.png` | 111.71 / 141.63 | **UNKNOWN / UNKNOWN** |
| 07 | **Cartoon:** clay-toy-like shape preservation and stylization | [Cute Strawberry Girl Cartoon Character](https://superspl.at/scene/f5fff845) · seeget3d | Download **CC BY 4.0** | 6.76 MB | `07_cartoon.png` | 51.57 / 323.73 | **UNKNOWN / UNKNOWN** |
| 08 | **Portal:** passage/view into another spatial architecture | [Portal Villa San Lorenzo](https://superspl.at/scene/e85e89a6) · robertlt702 | Download **CC BY 4.0** | 83 MB | `08_portal.png` | 139.30 / 254.76 | **UNKNOWN / UNKNOWN** |
| 09 | **Melt-terrain / illusion:** visually discontinuous colorful volumetric sky/world | [Black Mirror world](https://superspl.at/scene/86fcd5cc) · plan8 | Download **CC BY 4.0** | 148.98 KB | `09_melt_terrain.png` | 70.58 / 327.22 | **UNKNOWN / UNKNOWN** |
| 10 | **Gutter Space / optical perception:** impossible/altered visual space | [Doors of Perception](https://superspl.at/scene/a6df26f1) · braincraft-dev, Nabiha & Thom | **Not verified**; view only | 57.24 MB | `10_gutter_space.png` | 115.69 / 195.71 | **UNKNOWN / UNKNOWN** |

**Reference relevance is intentionally loose:** e.g. Lago di Barcis is a real surface lake, **not** a photographed underwater ruin, and Portal Villa San Lorenzo is an architectural reconstruction called “Portal”, **not** a magical inter-realm doorway. The private synthetic visions address Georg's **desired KFB outcome** without falsifying what the linked scan actually shows. Likewise a Vanadinite mineral scan does not validate photoreal glass refraction or animated crystals. Do not imply the reference pages show our drawings.

**Rights:** Code-license and asset-license are separate. For CC BY 4.0, keep author attribution and change indications if files are later reused. A source showing no explicit downloadable license is VIEW ONLY. No third-party imagery or source splat binary has been republished in this gallery. The ten private synthetic stills and numeric render-data file are original studies, not transformations of those vendor assets.

## Measurement protocol and status

- **Original private stills:** 10/10 `1600×900` PNG pairs, `contact_sheet.png`, HTML index, data JSON; private zip output ~3.86 MB. Static image assets measured from generated files, not provider CDN.
- **Local code:** Python/NumPy/Pillow reference generator, no external imported donor or texture. A2 uses 3D positions and anisotropic Gaussian footprints projected into the camera and alpha composited; it is **not** trained photo-based 3DGS, true Spark or a GPU shader benchmark. The illustrative A1 does not use identical 3D scene source geometry, so it is **not** a controlled image-quality A/B test.
- **Actual CPU numbers:** in row cells above, wall-clock still-generation duration with the executed code, varying substantially with primitive count and image size; **do not** infer a runtime target frame budget from them.
- **GPU, WebGL/WebGPU, browser FPS, third-party download/load timing and 10-second real viewer flythroughs:** **0 successful tests, no numbers**. External sources were read, not navigated interactively. No KFB game screenshot or browser proof.
- **Spark compatibility, three.js/R3F integration, live water representation, Depth/Occlusion, physically plausible refraction, camera parallax and source-donor isolation:** **NOT TESTED**.
- **Preview quality:** creative possibility study only; no KFB visual PASS or license/import approval. User's target image and examples, not whichever technology produced the prettiest thumbnail, determine a later comparison.

## Related existing KFB work

- [Intent-first splat / procedural world atlas](KFB_SPLAT_PROCEDURAL_WORLD_R1_2026-10-24.md) — user goals vs alternatives, all concepts, links, source/visual gaps.
- [Water/Melt-Terrain Cluster 4 brief](KFB_CLUSTER4_WATER_MELT_TERRAIN_SPLAT_WS0_WSA_BRIEF_R1_2026-10-22.md) — A0 existing surface / A1 cheap mesh or shader / A2 real splat **future** source-matched comparison.
- [Gutter Space / Portal / Almanac clusters](KFB_GUTTER_SPACE_SPLAT_PORTAL_ALMANAC_R1_2026-10-22.md).
- [Flatworld project Return](KFB_FLATWORLD_COMIC_GUTTER_RETURN_2026-10-18.md).
- [Binding WS0 brief](https://github.com/georg-doc/kayfabizarro/blob/docs/kfb-decisions-register-2026-10-11/tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/BRIEF_WEBCHAT_SPLAT_EXAMPLES_R1.md).

**One next gate:** WS0 assesses these **view-only** real-source links and the explicitly synthetic private studies; a true source-matched 3DGS-vs-simple-shader performance/visual proof can only be claimed when a browser-capable existing owner isolates actual licensed scene bytes, renders matching camera viewpoints and records measured browser FPS/load. **No implementation approved here.**

### Additive record

2026-10-24 — 10 real external viewer sources indexed with provenance/license/size (two licenses unknown); 10 privately delivered synthetic two-up 1600px stills; local CPU time data provided; exact browser benchmark limitation recorded. No new runtime, game owner, Stage or merge.
