# KFB Stunt World · Stage public mirror

Implementation SSOT: `georg-doc/KFB-Stunt-Car-Race`.

This directory is a public deployment mirror of the tested continuous OSM City Drive corridor. It is not a second movement, physics, camera, geography or gameplay owner.

Tested Race runtime commit: `d2529e634952f25d691d68873801b2651125ac0c`  
Browser evidence commit: `7208b4167df6fbea62703177301473eb841522d7`

Public runtime files are byte-identical to the tested Race revision. The only additional file with behavior is the Stage `index.html` redirect/pointer.

Corridor donor remains pinned by the Race recipe to `georg-doc/kayfabizarro@3db2c786152fd4d77ca33a63effd2a9db9c1d4c1`.

## Public browser proof

Canonical URL:

`https://kayfabizarro.pages.dev/kfb-hub/stage/stunt-world/`

Official main proof:

- commit: `d78fa862262184aa0ed172ed42e10db6e3705c71`;
- workflow: `35416057009`;
- job: `105824845921`;
- result: **29/29 PASS**;
- all **9/9** public runtime files matched their tested Race SHA-256 values;
- public WebGL boot: **2852 ms**;
- Hürth corridor join: mapped road, **4/4** C0 wheel contacts;
- public short drive: **6.406 m**;
- no new recovery/run;
- no console/page errors;
- no failed HTTP assets;
- evidence artifact: `10575592864`.

This promotes the mirror to **PUBLIC STAGE BROWSER PASS**. It does not promote ownership: Race remains the implementation SSOT and Free Roam C0 remains the physical owner.

Still open: human full-route drive, physical mobile QA, Live promotion, Landmark Group Rig runtime and audio integration.
