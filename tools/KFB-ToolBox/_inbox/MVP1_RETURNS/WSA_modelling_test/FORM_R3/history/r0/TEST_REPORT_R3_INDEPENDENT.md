# Independent Integration Test · R3 neutral G0

Candidate: `KFB_TOWN_CASTLE_STAIRS_FORM_R3.glb`  
SHA256: `4780ac63ecc35dc93f3f6ee5ce3510092bfffb6f4f3728b50af557935534235a`  
Role: independent tester; no production geometry edited. Tested clean GLB import, not the builder's live scene. Validation date: 2026-10-11.

## Result

**CONDITIONAL technical evidence; no overall Q PASS, FORM PASS or Golden claim.** Clean GLB import and format, eight real tread hits, centerline minimum run and podest, rise range, actual part triangle budgets and five semantic family metadata roles are supported. Full-width conservative flat walkability, real hill contact, player locomotion and final material quality remain separate.

## Measured

- GLB 2, glTF 2, declared standard Y-up. Import produces the intended +Y travel and Z-up internal surface; no cameras/lights. 647,292 bytes.
- 41 meshes; 11,868 triangles total; maximum actual part 380 triangles (all <=20,000).
- Five imported semantic family values, matching grammar counts: tread 8, bearing 14, crown 10, pillar 6, landing 3. These are construction roles; mesh count is not a family gate.
- 7,007 downward scene raycasts over seven longitudinal lines. Center top heights: .62 / 1.28 / 1.87 / 2.55 / 3.16 / 3.81 / 4.41 / 5.08. Actual rises: .62 / .66 / .59 / .68 / .61 / .65 / .60 / .67 (0.0001 floating-point tolerance).
- Centerline nearly horizontal surface extents: 1.6070 / 1.7217 / 1.5113 / 1.7791 / 1.6452 / 1.6643 / 1.5687 / 1.7026. Landing 3.8260. Sampling pitch .01913 Lab; nearly horizontal means normal_z > .98. Heights remain constant throughout each plateau.
- Rays at x=-5.46 and +5.46 hit every tread and landing at interior positions: a 10.92 Lab-wide cross section exists. Tread mesh X bounding width is 11.32, but bounding width alone is not claimed as clearance.
- Actual top normal is +Z on R3, unlike the R1/R2 donor top normals (-Z). Independent donor hashes match brief.
- Separate BVH actual-surface contact report measures wall/foundation overlap ~.12, pillar shaft/foot ~.13, cap/shaft ~.12. At nine interior sample points per anatomy component, crowns overlap supporting walls by .36-.91 Lab. This is solid overlap evidence, not a masonry/stability simulation. All tread/landing/foundation bodies reach ground datum Z=0; real ground mesh contact is not inferred.

## Scope limits / unresolved items

At the ±5.46 edge lines, rounded contour/bevel regions shorten the nearly horizontal tread lengths to 1.2243–1.4156; landing 3.0608. At ±4 all tread flat runs remain >=1.4922 and landing 3.8260. Thus the centerline passes the specified minimum run/podest; a full-width rectangular nearly-horizontal envelope does not. Nominal geometric tread depth is a different measure. This evidence must remain visible to the Guard instead of becoming a broad walkability PASS.

The BVH closest-surface report uses actual mesh vertices and surfaces. Broad-phase AABB pairs are retained only as candidate selection evidence. Downward rays from exterior bottom vertices can miss interpenetrating support tops; those rays are raw diagnostics, not unsupported-body verdicts. The opposing-surface interior rays supersede them for wall/pillar/crown anatomy contact.

Hill context Q8: **NOT_RUN** (actual donor context absent at G0). Runtime character/controller locomotion: **NOT_RUN**; actual collision surfaces are sampled but no player physics owner was invoked. Material/style: **NOT_RUN**, candidate deliberately neutral. Independent visible critic and Georg A/B/FAIL are separate gates.

## Evidence files

- `R3_independent_validation.json`: clean import, object triangle/bounds/properties, all raw rays and centerline plateaus.
- `R3_independent_contacts.json`: actual nearest-surface distances, raw bottom rays and opposing-support interval rays.
- `independent_qcheck_r3.json`: concise measured gates and limits.
- `R1_independent_baseline.json` / `R2_independent_baseline.json`: untouched donor evidence.
- `validate_independent.py` / `contact_independent.py`: tester-owned reproducible scripts.

## One next gate

Guard evaluates neutral form plus this technical edge-envelope limitation before material or hill integration. This tester does not grant FORM PASS.
