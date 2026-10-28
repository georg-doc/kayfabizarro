# Bell Resonance R6 · Exact existing KayKit donors / audio acquisition attempt
Date 2026-10-28 | Mode: bounded RESEARCH / SOURCE EVIDENCE | Owner: KFB Audio Site #365, immersive pending #455, research Draft PR #458
No new runtime, Site, AudioContext, search index, or Stage.

## 1 · Global Asset Librarian reused, not duplicated
Read current Asset Registry manifest on `georg-doc/kayfabizarro/main`: total 16,726 source records; 7,819 model-3d, 6,686 image-2d, 2,221 audio. Main changes dynamically; this is a snapshot, not a durable total.
Current Asset Librarian source `tools/asset_registry/librarian/` is the existing, candidate-only Registry viewer/search, not a verified external all-web 3D marketplace crawler. Source-priority is existing KFB tracked objects then independent CC/PD external mesh donors only when needed. No direct Asset Librarian app action was available; this R6 used exact GitHub source-level search and glTF parse plus corroborating Dropbox original-file metadata, not authenticated Librarian web UI.
The exact KayKit Holiday Bits source pack's CC0 statement lives in `media/3D_Assets/KayKit_Holiday_Bits_1.0_FREE/LICENSE_SOURCE.md`. Use source evidence; don't infer all KayKit assets share one license.

## 2 · Source geometry inspection: original glTF JSON, NOT 3D screen isolation
Two exact original main-branch glTF files fetched and parsed with their current Git blobs:
- `media/3D_Assets/KayKit_Holiday_Bits_1.0_FREE/Assets/gltf/bell.gltf` (Git blob ead5b108e4752abb250d935782c59c69e446075a). Distinct nodes `bell`, `bell_ring`, `bell_clapper`; corresponding meshes are independent. Body 302 vertex-position records and 384 indexed triangles; 720 triangles total (body 384, ring 192, clapper 144). Source `bell.bin` 22,016 bytes and `holiday_bits_texture.png`.
- `.../bell_decorated.gltf` (Git blob a6644ad415a8289de55e3f05fb115c26eb8b9965). Nodes `bell_decorated`, `bell_decorated_ring`, `bell_decorated_clapper`. Body 914 position records, 1,080 indexed triangles; 1,416 triangles total. Source `bell_decorated.bin` 45,776 bytes, same `holiday_bits_texture.png`.
Both contain three mesh objects, indexed triangle primitives, single external binary buffer, source texture, and hierarchical clapper/ring children. Both **lack skin/animation tracks**. Their local geometry accessor body bbox deltas, in **unverified asset units**, are 0.80604×0.82877×0.80604 and 0.80604×0.90348×0.91579. Do not call these meters or assume the clapper's child transform is the dynamic hinge pivot.
Read of two original asset source metadata paths, two Dropbox copies of matching .bin files (22,016 and 45,776 bytes) and corroborating .gltf files confirms accessibility in user's Dropbox. The actual external buffer bytes could not be transferred from GitHub/Dropbox into the local visual tool: GitHub binary endpoints are blocked for non-text, Dropbox temp links could be generated but container download requires previously opened URL. Therefore **no original KayKit source was visually rendered, and no mesh watertightness, interior surface, pivot or physical contact proof was performed**. Existing R4 parametric GLB is NOT a substitute for isolated actual KayKit donor.

## 3 · Executed source assertions
12/12 on source glTF JSON: for each of two donor files (1) exactly three original mesh objects; (2) distinct clapper and ring node; (3) all indexed triangle primitive counts divisible by 3 with uint16 accessor; (4) single buffer and texture; (5) no explicit animation or skin; (6) hierarchical parent/children. These tests validate the fetched text-file structures ONLY. Binary topology/geometry and rendered visual are NOT checked; 0 glTF original model screenshots.

## 4 · Recording acquisition, external rights
Public source page rechecked:
- https://commons.wikimedia.org/wiki/File:Churchbells.ogg — public domain authored by Natalie, Leverkusen, 29 Apr 2007, 48.2 sec; ~2.16 MB OGG. Original audio URL was clicked; browser classified it application/ogg unsupported; container download denied because URL was not treated as a successful opened media page. 0 bytes captured.
- https://commons.wikimedia.org/wiki/File:St._Matthias_Trier_Kirchenglocken.ogg — CC0 declared by Helge Klaus Rieder, 29 Nov 2016, 3:32 min OGG; exact page rights verified; binary not acquired.
- https://freesound.org/people/Sadiquecat/sounds/852491/ — exact WAV page CC0 but account login required for original download; location metadata conflicts Rouvenac vs Albi, cannot treat it as a confirmed paired indoor/outdoor recording.
Additional potential open MP3: https://sfxjar.com/church-bells/ lists five clips credited BigSoundBank under CC0, including single church bell at https://sfxjar.com/audio/0830.mp3 and 17s church bell https://sfxjar.com/audio/0135.mp3. Their audio links returned unsupported media via web reader; direct download helper failed. Aggregator license-page statement is a lead; exact BigSoundBank primary source identity/permission must be confirmed before adoption.
Web text and public file page availability is not a source audition and **0 original audio binaries or spectra were obtained**. Do not ask to buy licenses for correctly CC0/PD recordings; preserving per-file author, license receipt and content hash is still required.

## 5 · Scientific direction (not a test claim)
2024/25 thesis: https://www.vut.cz/en/students/final-thesis/detail/165785?zp_id=165785 uses experimentally measured sound partials to tune two FEM model complexities (bell alone vs bell + suspension).
2021 Heritage Science https://www.nature.com/articles/s40494-021-00620-2 integrates scanned geometry, a solid FE mesh, elastic eigenmode extraction and sound synthesis.
2007 University of Padova research https://www.research.unipd.it/handle/11577/2450026 compares FEA partials with measured values for five cast bells.
Keep distinct (A) large-scale yoke/clapper swing/contact, (B) bell body's small elastic spatial eigenvectors and damping, (C) sound radiation and location propagation. A 3D render mesh is not automatically a watertight FEM solid, and sound FFT cannot by itself yield its 3D mode shapes. Main deliverable requires a true 3D source object, physical wall/strike location and measured-vs-calculated mode error before audio-reactive visualization. R3 pseudo-2D presentation remains rejected.

## Outcome / next gate
Actual: 2 original glTF structures read, 12/12 structural assertions PASS, pack license read, Dropbox original file copy metadata checked, 2 Commons audio rights pages and a Freesound page verified, 0 real source bytes ingested, 0 donor source renderings, 0 3D mesh topology/FE, 0 browser listening, 0 Site change.
One next gate: **KFB_BELL_R6_SOURCE_BINARY_TRANSFER_ORIGINAL_DONOR_VISUAL_PROOF** — obtain exact original KFB `bell.bin`/`bell_decorated.bin` in a geometry-capable environment, render each ORIGINAL source in isolation and prove clapper/interior/mesh; independently obtain first authentic CC0/PD audio file with verified bytes. If the provider transfer remains blocked, preserve evidence and assign to WS0/Asset Librarian source-capable path rather than fabricating new geometry.
