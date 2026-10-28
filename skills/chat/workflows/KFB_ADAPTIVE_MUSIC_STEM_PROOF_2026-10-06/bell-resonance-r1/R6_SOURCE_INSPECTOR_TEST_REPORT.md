# Bell Resonance R6 · Original-donor inspector and source access test report
Date: 2026-10-28 | BOUNDED RESEARCH, NO SITE/ASSET INTAKE
Repo georg-doc/kayfabizarro · Existing Audio owner #365 · Immersive source #455 · Research Draft PR #458.

## Source-origin structural inspection
Two exact KayKit Holiday Bits `.gltf` source text objects fetched from GitHub, with two related binary-source filenames and pack license sidecar read; Dropbox checked presence/byte size of original matching `.gltf` and `.bin` copies.
- Normal: bell/bell_ring/bell_clapper, body 302 vertices, 384 triangles; 720 triangles total; `bell.bin` 22016 bytes.
- Decorated: bell_decorated/body_ring/clapper, body 914 vertices, 1080 triangles; 1416 triangles total; `bell_decorated.bin` 45776 bytes.
- **12/12 original glTF JSON structure assertions PASS**, six each: 3 original mesh objects, clapper+ring distinct, index accessors triangle-aligned, one source buffer/texture, no embedded rig, parent-child scene hierarchy. Original mesh topology/inner wall remains untested without binary.
- Exact local glTF body bbox deltas (asset units, NOT metres): normal [0.80604,0.82877,0.80604]; decorated [0.80604,0.90348,0.91579]. Does NOT validate bell-rib thickness, clapper pivot or FEM-grade topology.

## Read-only source-isolation inspector prepared
- Source: `r6/inspect_original_bell.py` version in GitHub (Python numpy+trimesh+vtk). Requires original `.gltf`, referenced `.bin` and source texture or full GLB. Fails closed with SOURCE_REQUIRED if bytes absent. When sources are available, loads geometry and scene node transforms, captures four isolated neutral-material source renders, reports per-mesh triangles/bounds and watertight flag. No generated replacement geometry and no AudioContext.
- Local counterpart package **KFB_BELL_R6_ORIGINAL_DONOR_INSPECTOR.zip**, sha256 `7d209461149553ad08cc70fc94914730341a8457ab9aaa79995ac2ca762ed326`; Python tool + README + JSON checks, available only in conversation, not uploaded as asset to the audio/site registry.
- Local tool fixture: source-missing refusal PASS, existing *synthetic R4 model* GLB load+4 3D renders PASS, same R4 model exported as glTF with buffers then load+4 renders PASS, 3-mesh read count in both formats PASS, no audio/FEM owner PASS: **5/5 local fixture assertions PASS**. Local Python bytecode compile PASS.
- Important technical limitation: the Github source file was saved/read back but is **not independently executed on a source-capable GitHub runner**. 5/5 refers to local sibling implementation; the above synthetic control images are not accepted proof of original KayKit donor.

## Authentic recordings
- Wikimedia Commons Leverkusen churchbells (PD Natalie) and Trier St Matthias (CC0 Helge Klaus Rieder) source pages verified, original OGG source transfer failed (web media unsupported; container network/download denied).
- Freesound Rouvenac audio CC0 page verified but original WAV requires account login; associated site metadata Rouvenac/Albi conflict remains.
- Third research lead: SFX Jar BigSoundBank CC0 aggregate https://sfxjar.com/church-bells/ offers single bell and several peals, but MP3 original links cannot be fetched by this environment; upstream original and quality need individual review.
- Actual original audio file bytes downloaded **0**, measured real bell spectra **0**, human ear verified recordings **0**.

## Not attempted / not passed
No authentic 3D source-object solo screenshots from KayKit; 0 watertightness/actual FEM verification of KayKit, 0 3D ringing rig test, 0 own source audio accepted, 0 real Site/browser/World tests, 0 Stage/Live/merge.

## Single next gate
`KFB_BELL_R6_SOURCE_BINARY_TRANSFER_ORIGINAL_DONOR_VISUAL_PROOF` — execute read-only source inspector on ORIGINAL KayKit glTF + bin + texture using WS0 / a source-capable environment; record original isolated screenshots and truthfully classify the mesh; obtain one original CC0/PD bell recording with correct bytes, license evidence and checksum. The current Audio MVP #365/#455 retains the only production mixer/runtime.
