# LOOK-TORSION-01 · TEST REPORT

Status: **ENGINEERING PASS · HUMAN RESULT RECORDED · ARCHITECTURE PASS ONLY**  
Date: 2026-09-27  
Owner: **OSM City Lab presentation / KFB ToolBox authoring**  
Branch: `chatgpt-web/look-torsion-01-2026-09-27`

## Protected boundary

- Frozen Hürth R2 from PR #194 was neither edited nor imported.
- No collision/runtime owner was changed.
- Blender / Geometry Nodes was not used: the browser-native source mesh plus the existing `cartoon-city.js#deformPoint` donor was sufficient to prove the architecture.

## Candidate history

### Pass 1 · Cathedral donor

Implementation head: `3781340f360469fe152003f94f573b2663feb6e4`  
Workflow run: `36286404664`  
Artifact: `10920408822`  
Result: **41/41 automated checks PASS**.

The Kölner Dom donor (`way/4532022`, 157.38 m) proved the deformation math, 24 vertical segments, zero base drift and shared-field application across roof/body meshes. Manual screenshot review rejected it as the final visual proof because the near-rotational symmetry of the twin towers made geometric torsion too hard to read at a glance. This candidate is superseded, not promoted.

### Pass 2 · Tall elongated OSM source mass

Implementation head: `0ebc3837f74ecc6565fb557d9b4b670de61fdc20`  
Workflow run: `36286925929`  
Browser job: `108529321601`  
Artifact: `10919709921`  
Artifact digest: `sha256:27614f1b09afadd7a6a4658b10bd896a78ba32db7e886949c4e0a2af976c0db0`  
Result: **45/45 automated checks PASS**.

Source:
- cached Cologne OSM `way/23574173`;
- height: **46.5 m**;
- exact cached footprint: **18 unique points**;
- normalized source blob: `14d3f09da6e14fb7f5dc9478f78be9f876bffab9`;
- no runtime OSM fetch.

Geometry:
- **24 vertical steps**, 1.9375 m per band;
- one indexed mesh;
- side wall top ring and roof boundary reuse the same vertex indices;
- roof/body therefore share the exact final deformed boundary;
- base drift B = **0 m**;
- base drift C = **0 m**.

Torsion ranges:
- ordinary / low building: **2.6°**;
- hero default: **9.5°**;
- City GROTESQUE donor reference: **11°**;
- current LandmarkElastic evidence reference: **13.2°**.

At the 11° interaction checkpoint the measured top probe displacement is **4.130330718 m** while base drift remains zero.

Browser:
- Source WebGL2 PASS;
- Elastic WebGL2 PASS;
- Elastic+Torsion WebGL2 PASS;
- no page errors;
- no console errors;
- neutral/simple lighting;
- shadows disabled;
- camera skew starts OFF;
- toggling camera skew does not change geometry revision or active geometric torsion.

Evidence screenshots in the workflow artifact:
- `01-abc-neutral-hero.png` — A/B/C at 9.5° hero default;
- `02-c-low-building-range.png` — same A/B with C reduced to 2.6°.

Manual engineering screenshot review:
- A → B remains intentionally modest, showing bend/lean/taper without torsion;
- A/B → C at 9.5° is visibly different on the elongated footprint and reads as cumulative geometric torsion rather than camera skew;
- 2.6° is visibly subtler, preserving a usable ordinary-building range;
- the Stage was sufficient as engineering evidence; Georg later closed the standalone human gate as **ARCHITECTURE PASS ONLY**, not visual acceptance.

## Gate

Engineering gate: **PASS**.  
Human result: **ARCHITECTURE PASS ONLY** — retain the geometric torsion mechanism, anchored base and shared roof/body field.

This does **not** accept the isolated grey rendering as WorldBuilder/look truth, does not accept its lighting/shadows/materials, and does not set a final universal torsion calibration. Known shadow/light defects remain open. The standalone human gate is closed; no further torsion review site is required.

Next meaningful evaluation belongs inside the next clean/current WorldBuilder/world-presentation candidate with the real scene/camera and shared shadow/lighting corrections.


## Public Cloudflare gate

Publication branch:
- `cloudflare-live@00e632e062c4de0ba9d6c65eadda5ec2cc652b3b`.

Cloudflare Pages:
- check `108530649024`;
- conclusion: **SUCCESS**;
- deployment id: `ce88d3ee-3e58-4408-a921-0196d078c041`;
- completion: `2026-09-27T02:03:48Z`.

Public proof workflow:
- run `36287292857`;
- attempt 1 reached the old KayfaBizarro root fallback at `02:02:13Z`, before the Cloudflare deployment completed; no candidate/source repair was made;
- unchanged attempt 2 started only after the deployment check was confirmed;
- job `108530790350`: **SUCCESS**;
- exact public route checks: **19/19 PASS**;
- status: **PUBLIC_VERIFIED · HUMAN PENDING**;
- page/console errors: **0**;
- exact Stage route opened with LOOK-TORSION-01 title/source marker;
- KFB Hub Stage opened with exactly one LOOK-TORSION-01 card and the direct child link.

Public artifact:
- `10920134639`;
- digest `sha256:0c4df894cd1daa5a4c32f07204f8425f8253e20535802e06481fb7977dae6b4f`;
- `01-public-abc-hero.png`;
- `02-public-landmark-range.png`;
- `03-hub-stage-card.png`.

Direct human route:
https://kayfabizarro.pages.dev/kfb-hub/stage/look-torsion-01/

Standalone human gate: **CLOSED**. The direct Stage remains historical engineering evidence only. No merge or Live promotion has been performed.
