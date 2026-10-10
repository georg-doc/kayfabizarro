# R3 actual test report · WSA Work

This summarizes independent evidence; it does not accept the Builder's work.

Final isolated GLB SHA256 `df59928f0d45cbd0ea6669cd78be7adc3850a766000e537c0ab5d09c73cb622c`. Neutral SHA256 `1291d54fed33c86ff8edad6bbcdf96a8a1a97fcdb499ff90d4892cca6404190b`.

## Passed sampled isolated geometry

Blender5.2.2 clean reimport; Y-up GLB2; 45meshes, five imported role families,13,036triangles,max380 per actual part, zero cameras/lights. Every construction mesh closed after positional seam weld; zero nonmanifold edges. Actual mesh edge check finds no edge>75deg and length>.2H (max measured dihedral40.09277deg).

7,007 downward rays over seven longitudinal lines, including±5.46, measure eight tread objects, planar height sequence .62/1.28/1.87/2.55/3.16/3.81/4.41/5.08 and rise increments .62/.66/.59/.68/.61/.65/.60/.67. Worst sampled nearly-flat run1.4922>=1.456; landing3.826>=3.64. Sample pitch .01913; normal_z>.98. This is actual geometry sampling, not a swept player simulation.

Nine opposing BVH surface rays per support zone measure wall support overlaps~.12, shaft/foot~.13, cap/shaft~.12, crown supporting-wall overlap .07939–.09430. Exact neutral/styled vertex,polygon and triangle parity passes. Used GLB material colors are three Family-A values: #e6d4b5/#d1ba99/#b29c7d. #9e856b is an available donor palette role but not used in the isolated candidate; no four-used-material claim.

## Failed / bounded checks

Q6 **FAIL_CONTEXT_EXIT**: .26941–.55830lab drops at five exit positions vs .0728 limit. Q8 **PARTIAL**: all three donor affine instances match96/96 unique original positions; no sampled flat tread buried, but foot anchoring unresolved. Q3 visible unintended intersections requires visual review; construction support overlaps are deliberate, and context images retain visible triangular overlap seams. Q2 applies to actual masonry; no N/A shortcut.

Full independent Form Critic **FORM_FAIL**, scores8/8/9/8/6/7/8,avg7.7143,min6. Neutral G0 subset8.0 PASS retained. Separate styleScore7 applies only to Blender donor-probe surface, not K2 or Golden parity.

Runtime player/controller locomotion, K2 shader consumption, baked GLB microtexture, Golden parity, Georg A/B/FAIL and public-host checks **NOT_RUN / PENDING**. Site/Stage is not required for this isolated candidate. No merge or promotion.

See `qcheck_r3.json`, `export_validation_r3.json`, `tests/`, `critic/`, `FAILURE_RECOVERY_R3.md` and Guard route for precise evidence and authority. Lossless .json.gz raw data includes full ray lists; scripts reproduce the tests against actual source files. 1600x1000 native renders; labeled comparisons use 1600x540 two-panel QA layouts preserving camera/framing within panels. Source contact sheet1600x740 is a compact index, not a substitute for each full donor view.
