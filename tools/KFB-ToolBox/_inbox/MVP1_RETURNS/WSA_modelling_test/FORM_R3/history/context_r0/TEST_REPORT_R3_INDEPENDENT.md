# Independent Integration Test · R3 neutral R1 recheck

Candidate SHA256: `1291d54fed33c86ff8edad6bbcdf96a8a1a97fcdb499ff90d4892cca6404190b`  
Replaces neutral R0 hash `4780ac63ecc35dc93f3f6ee5ce3510092bfffb6f4f3728b50af557935534235a`. R0 evidence retained by parent in `history/r0/tester`.

**Result: sampled G0 geometry gates PASS, with explicit scope limits. No overall Q, FORM, Golden or runtime acceptance claim.** No production file edited by tester.

## Actual measurements

Clean factory-empty Blender GLB import succeeds; GLB 2 / glTF 2 standard Y-up, Blender internal +Y travel / Z-up measured. 45 meshes, five imported `form_family` roles matching grammar: bearing 18, crown 10, tread 8, pillar 6, landing 3. 13,036 total triangles; maximum actual part 380 (<=20,000). Zero cameras/lights.

7,007 actual downward scene rays on x=-5.46,-5.3,-4,0,4,5.3,5.46 measure eight distinct tread objects and the landing. Top levels remain .62/1.28/1.87/2.55/3.16/3.81/4.41/5.08. Rise increments .62/.66/.59/.68/.61/.65/.60/.67 meet .59-.68 with 0.0001 numerical tolerance.

All seven sampled lines now meet minimum nearly-horizontal run 1.456 and landing 3.64. Worst tread flat run 1.4922, landing 3.8260. At x=-5.46 minimum tread run 1.5495; at +5.46 minimum 1.4922. Centerline minimum 1.5113, unchanged. Rays use normal_z>.98, longitudinal pitch .01913 Lab. Actual cross-sections span 10.92 at flat tread interiors. This is sampled geometric evidence, not an exhaustive swept character simulation.

Actual world-space BVH opposing-surface rays at nine interior positions per anatomy zone confirm all tested support relations. Wall/foundation overlap ~.12; newly split wall-upper/wall-lower overlap ~.12; pillar shaft/foot ~.13; cap/shaft ~.12. Crown-to-highest-wall overlap now .07939-.09430, replacing R0's .36-.91 thick penetration. Each sampled crown position has supporting actual wall geometry; positive gaps to lower, non-highest wall candidates are not mistaken for unsupported crowns.

## Measured R0 → R1 delta

- Mesh count 41→45, bearing family 14→18; all other family counts unchanged. Triangles 11,868→13,036, max per actual part stays380.
- Edge nearly-horizontal minimum run 1.2243→1.4922; landing 3.0608→3.8260. The prior sampled edge-envelope shortfall is resolved.
- Eight tread heights/rises and centerline runs unchanged.
- Actual sampled crown support penetration is now near-constant and shallow .07939-.09430 instead of .36-.91.

## Limits kept visible

Real donor-bound hill context Q8 **NOT_RUN**. Runtime player/collision controller **NOT_RUN**; no second runtime was invoked. KFB material/style **NOT_RUN**, neutral geometry only. Geometry tests cannot establish independent visible form criticism or Georg A/B/FAIL.

BVH reports contain sampled actual nearest-surface distances, raw lower-vertex downward diagnostics, and opposing-surface support interval rays. AABB proximity alone is never PASS. Exterior lower-vertex diagnostics can miss overlapping support tops; interior opposing-surface results supersede those raw diagnostics. Stand at Z=0 datum is measured for tread/landing/foundation geometry, but terrain contact is not claimed.

## Reproducible independent files

`R3_independent_validation.json`, `R3_independent_contacts.json`, `independent_qcheck_r3.json`, `validate_independent.py`, `contact_independent.py`. Untouched donor baselines remain separately recorded.

## One next gate

Production Guard evaluates revised neutral form and Independent Critic evidence before allowing material/hill completion. This test does not grant FORM PASS.

## Final styled/context extension · exact final product

Styled SHA256: `df59928f0d45cbd0ea6669cd78be7adc3850a766000e537c0ab5d09c73cb622c`. Neutral SHA remains `1291d54fed33c86ff8edad6bbcdf96a8a1a97fcdb499ff90d4892cca6404190b`. Mesh name sets, every vertex world position, polygon indices and triangle counts are **exactly identical** between the clean imported GLBs. Four imported linear base colors convert correctly to `#e6d4b5 / #d1ba99 / #b29c7d / #9e856b`; roughness .88. Procedural clay detail is not baked into GLB, as documented by builder; no retry of quarantined bake seam.

All 45 construction meshes have zero nonmanifold edges after1e-6 positional weld; no long edges (>0.2H) with dihedral >75deg, maximum measured40.09277deg.

Real KayKit hill source independently imported: source89 imported vertex records vs context95 because attribute seams split export records; **32 unique positions in both**. Every unique point equals the declared scale/translation to1e-4 Lab (maximum rounded nearest delta0). This is actual source fidelity evidence; no invented hill geometry is present.

**Context landing exit FAIL:** actual BVH downward surfaces at y17.97 give center terrain4.37113 while flat landing is5.08; drop0.70887 Lab =0.19474H, above0.02H contact limit. Left x=-5.46 drop0.64156; x=-4 drop0.65483. Right x=4 drop4.60032; x=5.46 has no terrain at exit. Terrain begins again further behind that right edge. Thus source-isolation/affine fidelity do not prove a continuous stair-to-hill landing.

No terrain lies above any of the tested nearly-flat walking surfaces (0 covered samples). Terrain side/foot embed is not established; Q8 has actual evidence and an explicit unresolved subgate, never N/A.

Q1–Q9 now recorded individually in `independent_qcheck_r3.json`; Q6 FAIL, Q3 visible-intersection judgment remains independent-critic-owned, Q8 partial. Runtime character locomotion remains **NOT_RUN**. Updated next gate: Guard decides whether the source-bound context seam requires one bounded affine placement repair or failure export; no geometry repair by tester.

Full raw extension: `FINAL_independent_extension.json`; reproducible script: `final_extension.py`. The dated neutral technical section above remains history; final overall status is **ISOLATED_GEOMETRY_PASS_CONTEXT_CONNECTION_FAIL**.
