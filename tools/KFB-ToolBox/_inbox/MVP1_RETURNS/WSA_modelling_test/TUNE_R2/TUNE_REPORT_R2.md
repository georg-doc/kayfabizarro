# TUNE REPORT · KFB Town Castle Clay Stairs R2

Date: 2026-10-10  
Source: `WSA_modelling_test` R1 at `f954817c97e368099b5e8aa8d6fce35cc9da94d8`  
Target branch: `wsa/kfb-modelling-test-stairs-2026-10-10`

## Result

R2 preserves the five original WSA mesh identities, eight steps, landing, width and walkability. The two existing lower buttress meshes were reshaped into higher, broad-capped front pedestals. Their tops now sit visibly above the adjacent cheek-wall level.

The fixed-camera renders use a restrained procedural Family-A clay surface to test KFB form and material direction. The GLB itself uses explicit, safe Family-A runtime base colors. No extra props, modular stones or additional geometry were introduced.

## Measured tune

| Measure | R2 |
|---|---:|
| Adjacent wall top at foot | 2.46 lab |
| Left pedestal nominal height | 3.30 lab |
| Right pedestal nominal height | 3.18 lab |
| Left over wall | 0.84 lab / 0.2308 H |
| Right over wall | 0.72 lab / 0.1978 H |
| Meshes | 5 |
| Triangles | 4,568 / 20,000 |
| GLB size | 324,004 bytes |
| GLB SHA-256 | `82a20339c39e6e93a71a389dbb39978b7362b562e52999d90539039b131ebb28` |

## Preserved invariants

- same five exact mesh names;
- eight rises `0.59–0.68 lab`;
- actual minimum tread depth `1.6024 lab`;
- landing depth `4.00 lab`;
- clear width `10.92 lab = 3 H`;
- y-up GLB;
- no cameras or lights in GLB;
- no non-manifold edges.

## Material evidence and boundary

The Blender renders use large-scale color variation plus restrained surface bump to test the KFB clay direction. For reliable runtime export, the GLB uses direct Family-A base colors:

- light `#e6d4b5`;
- mid `#d1ba99`;
- warm `#b29c7d`;
- deep `#9e856b`.

Generated image-texture export produced black pixels after two non-improving repair attempts. That smallest seam was frozen. The strategy switched to procedural render evidence plus explicit runtime colors. Therefore R2 does **not** claim a baked runtime clay microtexture; it proves the form hierarchy and visual material direction without hiding this limitation.

## Evidence

- `renders/01_frontal.jpg` through `08_right_end.jpg`: final R2 views, 1600 × 1000.
- `comparisons/01_frontal_R1-left_R2-right.jpg`: identical frontal camera.
- `comparisons/02_three_quarter_top_R1-left_R2-right.jpg`: identical 3/4 camera.
- `qcheck.json`: geometry and Q1–Q9 metrics plus pedestal hierarchy check.
- `export_validation_r2.json`: clean-scene GLB import, mesh identity and material-color proof.
- `build_stairs_r2.py`: reproducible build.

## Verdict boundary

Technical checks and the requested pedestal hierarchy are satisfied. No overall visual PASS or Golden status is claimed. The external critic and Georg decide whether the KFB material/form direction is sufficient.
