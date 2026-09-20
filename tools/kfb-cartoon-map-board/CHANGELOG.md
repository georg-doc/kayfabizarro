# Changelog · KFB Cartoon Map Board

## 2026-09-18 · P0

### DECISION
- New additive tool folder: `tools/kfb-cartoon-map-board/`.
- Do not repurpose `osm-city-lab` or `world_atlas`; consume their contracts/donors instead.
- Preserve `kfb-ink-canon.js` as card-ink SSOT; world-space geographic borders are implemented as a map adapter, not a replacement canon.
- Use actual KayKit BoardGameBits from the central GitHub asset repository.

### IMPLEMENTATION
- Added Europe 3D board shell and Three.js orbit viewer.
- Added OSM-derived country GeoJSON resolver through OpenPlanetData v2 catalogue.
- Added independent country extrusions, selection lift, explode/recombine, country labels and camera presets.
- Added filled Map BAND ribbon with deterministic wobble and south-east edge weighting.
- Added actual KayKit GLTF markers for Berlin, Paris, Rome, Warsaw and London.
- Added ink / relief controls and explicit OSM attribution.

### TESTED RESULT
- `node --check src/app.js`: PASS.
- Browser/WebGL visual run: NOT YET RUN.
- Public Pages deployment: NOT YET VERIFIED.
- Georg acceptance: OPEN.


## 2026-09-18 · P0.2 Story Focus

### DECISION
- Story anchors are declarative demo content, not card canon.
- KayKit map content must remain registered to its geographic owner during explode/recombine.
- Live-boundary provenance is made explicit in `data/europe-p0/SOURCE_SPEC.json`; this is not yet a pinned snapshot.

### IMPLEMENTATION
- Added deterministic paper texture generation.
- Added hover feedback and selected-country focus ring.
- Added smooth camera choreography plus `FOCUS` and `NEXT STORY`.
- Added `data/story-demo.v1.json` as a data-driven content-anchor manifest.
- Reparented KayKit markers to their country tiles and counter-scaled marker Y against the HEIGHT presentation control.
- Added P0.2 story-focus documentation.

### TESTED RESULT
- GitHub source readback confirms the P0.2 files are on `main`.
- GitHub Pages build/deployment workflow has been triggered for the new commits; that is separate from the canonical Cloudflare `kayfabizarro.pages.dev` deployment.
- Browser/WebGL execution of P0.2: NOT YET CLAIMED.
- Cloudflare public deployment: NOT YET VERIFIED.
- Georg visual acceptance: OPEN.


## 2026-09-20 · Tactical Game Map v1 planning

### DECISION
- Use KayKit BoardGameBits as the physical tabletop grammar for Map Board tactical/story presentation.
- Reuse exact `playerstand_*` and `playercard_*` donors for upright media standees.
- Reuse exact KayKit D4/D6/D8/D20 where available.
- KayKit does not provide D10/D12 in this pack; prefer the pinned Three.js/Cannon `3d-dice/dice-box-threejs` donor for the missing dice/result physics seam.
- Use `skills/kfb-cartoon-animation_v2.md` for standee hop, squash/stretch, impact wobble, knockdown and recovery.
- Media content (info boards, photos, public figures/politicians) is a data surface; the mechanics do not rank political actors.

### PLANNED SLICES
- T1 exact donor isolation.
- T2 media standee adapter.
- T3 standee motion.
- T4 D20 collision.
- T5 unified RPG dice set.
- T6 Map / Near East integration.

### STATUS
- Donor audit: COMPLETE.
- Runtime implementation: NOT STARTED.
- Current public Map Board Stage: unchanged.
- Next gate: T1 exact donor isolation page.


## 2026-09-20 · KFB Storytelling Maps v1 + T1 donor isolation

### DIRECTION
- "KFB Storytelling Maps v1" becomes the umbrella product direction over this existing Map Board owner.
- Target consumers: world/zone/galaxy maps, tactical board scenes, cinematic story maps, cut-scenes and later one manifest-based editor.
- Ludowala is benchmarked for tabletop/camera/tactility principles only; no proprietary source is reused.
- Odyssey is prepared as the first 2–3 minute cinematic POC after standee prerequisites.

### IMPLEMENTATION
- Added T1 donor-isolation lab under `tools/kfb-cartoon-map-board/tactical-lab/t1-donor-isolation/`.
- Added Stage mirror source at `kfb-hub/stage/storytelling-maps/t1-donors/`.
- T1 shows exact KayKit playerstand, exact KayKit playercard, exact KayKit D20 and the pinned external Three/Cannon D10 donor separately.
- Added responsive/mobile-landscape lab layout and machine-readable runtime report.
- Added public-proof workflow source.

### ASSET / AUDIO / VFX ROUTING
- Board/Card SFX reuse the central `Audio/Card and Board` WAV family.
- VFX reuse central Brackeys/Kenney/explosions_smoke/FreeHit donors.
- FrizzleBob guide remains the existing Driver Graft / Rig_Medium consumer candidate.

### STATUS
- Source implementation: COMMITTED candidate after write/readback.
- Public Stage: OPEN until exact Cloudflare proof.
- Human donor identity: OPEN.
- Next gate: T1 donor identity only.

## 2026-09-20 · Storytelling Maps T1 PUBLIC_VERIFIED

### TESTED RESULT
- exact Cloudflare Stage: `https://kayfabizarro.pages.dev/kfb-hub/stage/storytelling-maps/t1-donors/`
- public Chromium proof: **9/9 PASS**
- exact KayKit donors: **3/3 loaded**
- external Three/Cannon D10 donor: ready
- D10 roll: PASS
- page/script errors: **0**
- failed HTTP requests: **0**
- desktop + mobile-landscape screenshots captured
- run/job: `35522576654` / `106109086411`
- artifact: `10608862542` · `sha256:eeafbfab2b3cd8b0a79d0588537740129f5749ef7518fe5effbe30a3f7eed787`
- publication commit: `ea77610ba57b3ed5aa8f045978643d8a8030b3ba`

### STATUS
- T1 technical/public gate: **PASS**
- Georg donor identity: **OPEN**
- T2 Media Standee: blocked on Georg review
- Live: unchanged


## 2026-09-20 · T2 exact KayKit Media Standee

### IMPLEMENTATION
- exact `playerstand_red.gltf` + `playercard_knight_red.gltf`;
- original `boardgame` frame material retained;
- only `red_knight` front-art material replaced;
- Portrait native orientation;
- Landscape uses the same exact card geometry rotated 90° plus media remap;
- calibration-only front texture; no political/story media;
- reversible MEDIA / ORIGINAL switch;
- responsive desktop/mobile-landscape lab.

### TESTED RESULT
- exact Stage: `https://kayfabizarro.pages.dev/kfb-hub/stage/storytelling-maps/t2-media-standee/`
- browser checks: **13/13 PASS**
- Portrait ready: PASS
- Landscape ready: PASS
- frame preserved: true / true
- front replacement: one binding / one binding
- MEDIA → ORIGINAL → MEDIA: PASS
- page/script errors: 0
- failed HTTP requests: 0
- run/job: `35523870018` / `106112519588`
- artifact: `10609178985` · `sha256:e94c04a8de1eb0f6b7431e2790e64382a7e68904d5df76c7fdd1a54e3b6fbc7a`
- runtime publication: `2eb9235f075e29b2eaced4ee76485d0c2ed4aeb4`

### STATUS
- T2 technical/public gate: PASS
- Georg Portrait/Landscape choice: OPEN
- T3 motion: blocked on that human gate
- Live: unchanged


## 2026-09-20 · Responsive CardRig / Storytelling visual-system direction

### USER DECISION
- Both Portrait and Landscape remain first-class.
- A media motif may never render as a visible square/rectangle in front of a rounded standee.
- Arbitrary aspect ratios require corner-preserving donor-mesh deformation.
- Existing visual systems must be reused before any new palette/sky/viewer/FX/animation stack is authored.

### SOURCE FACT
Exact `playercard_knight_red.gltf`:
- outer `boardgame` primitive: 96 vertices, bounds x ±0.600 · y 0…1.500;
- `red_knight` front primitive: 40 vertices, bounds x ±0.574359 · y 0.025641…1.474359.

This supports using the existing inset front geometry instead of an overlay plane.

### DESIGN CONTRACTS
- `CARD_RIG_V1.md`
- `VISUAL_MOTION_SYSTEM_V1.md`
- `CLAUDE_DESIGN_BRIEF_VISUAL_LAB_V1.md`
- `WSA_PROP_RIG_PLANNING_NOTE.md`

### PROP-RIG PLAN
Investigate a shared legless PropActor class using the proven six-bone Rig_Legacy where clips are visually compatible, with the CapsuleCarl procedural semantic-state lane as an alternative. Pencil/eraser/EyeRig props belong to the same future compatibility proof, not a separate animation stack.

### STATUS
T2's 13/13 browser PASS remains technical evidence only. The responsive visual contract is not accepted until VL1 proves the rounded CardRig from oblique views.


## 2026-09-20 · Storytelling Map Animator v1 planning package

### DIRECTION
The existing Cartoon Map Board is the runtime/presentation owner for the planned Animator.

Prepared Claude Design contract covers:
- arbitrary GeoJSON / public boundaries;
- OSM City Lab adapters;
- puzzle-piece country/region motion;
- flat/table/flyover/dive/popup cameras;
- add/fill/remove/raise/stand-up/explode/assemble actions;
- later semantic VFX presets (ripple/burn/bomb/hurricane etc.);
- Hürth/Ehrenfeld/Cologne drilldown;
- Grotesque landmark donor integration;
- papercraft/cutout/popup-diorama presentation;
- manifest-first authoring.

### OWNER BOUNDARIES
No second OSM, Landmark, PDF/Card, FX or Curtain runtime.

Game Dev Studio Theatre Curtain PR #114 remains a separate reusable dependency.

### NEXT MAP-ANIMATOR GATE
SMA1 only: existing Europe pieces + reversible map motion/camera + one real landmark donor + one reused ripple.


## 2026-09-20 · Map Animator planning routing proof

- Claude Design brief + donor matrix + planning Return prepared on `planning/storytelling-map-animator-v1-2026-09-20`.
- KFB Hub briefing/ToDo publicly verified: **6/6 PASS**.
- Public Hub: `https://kayfabizarro.pages.dev/kfb-hub/`
- run/job: `35537569069` / `106149219477`
- artifact: `10613653218`
- Animator runtime: **NOT STARTED**
- Animator Stage target: **NOT DEPLOYED / NOT PUBLIC_VERIFIED**
- next Map Animator gate: SMA1 only.
