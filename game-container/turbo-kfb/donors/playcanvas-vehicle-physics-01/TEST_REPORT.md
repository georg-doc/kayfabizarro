# PlayCanvas Vehicle Physics Donor-01 · TEST REPORT

Date: 2026-09-29  
Owner: `georg-doc/kayfabizarro`  
Branch: `chatgpt-web/playcanvas-donor-01-2026-09-29`

## Goal

Put the real PlayCanvas Vehicle Physics donor on board unchanged before any KFB look, texture, track or physics modification.

No primitive replacement world was created.

## Source identity

User fork:
- project: `KFB Joyride 01`
- PlayCanvas project id: `1609943`
- forked from project: `643289`
- fork scene: `2608057`
- project-export ZIP: `/CLAUDE/KFB Joyride 01_2026_9_29-15_8_46.zip`
- ZIP size: `52,054,796` bytes
- Dropbox content hash: `07920bc1a4a6f06c8ec66b229676386f4386618e8fc5a93b8af7e47274d10781`

Exact public runtime donor:
- share: `https://playcanv.as/p/CxgnAp22/`
- runtime: `https://playcanv.as/apps/BfRjx709/index.html`
- title: `Vehicle Physics`

## Source runtime probe

Run: `36603881007`  
Job: `109527828039`  
Conclusion: **SUCCESS**

Observed:
- 1280×720 canvas
- PlayCanvas app booted
- `Car Physics` present
- `Follow Camera` present
- W held 1.8 s moved the vehicle `8.996585162084834` units in that headless run
- R returned the vehicle to within `0.47520045503867314` units of the sampled start state
- page errors: 0
- console errors: 0
- 44 unique runtime responses observed
- 42 responses came from the exact app root

Artifact:
- id: `11049334271`
- digest: `sha256:1451391fb80ebe827a9d7513c87a6f3ac70069632685a4728545ac70c7687172`

## Exact runtime mirror

Mirror run: `36603978546`  
Job: `109528171433`  
Conclusion: **SUCCESS**

Captured from the actual running donor:
- runtime files: **42**
- runtime bytes: **22,054,130**
- capture errors: **0**

The immutable mirror includes the actual loaded:
- `index.html`
- `config.json`
- scene JSON
- `__game-scripts.js`
- PlayCanvas engine
- Ammo WASM/loader
- Basis WASM/loader
- Buggy GLB/material/texture assets
- Desert GLB/material/texture assets
- cubemap/sky assets
- UI/runtime support files

Per-file source URL, byte size and SHA-256 are recorded in:
`static/KFB_DONOR_MIRROR.json`

Mirror artifact:
- id: `11050587473`
- digest: `sha256:8607105d7c188c5a7274a01d05062956fbe80fc40120e81de0384f1f2da6f021`

## Self-host parity

Run: `36604195908`  
Job: `109528909467`  
Conclusion: **SUCCESS**

**11/11 PASS**
1. Vehicle Physics title
2. app boot
3. Car Physics
4. Follow Camera
5. Car Graphics
6. Light
7. W moves
8. R reset
9. page errors = 0
10. console errors = 0
11. request failures = 0

Measured in that run:
- W displacement: `2.254484273560014`
- R reset distance: `0.9180603850463713`

Timing-dependent headless displacement is not used as a source-equality metric. Runtime source equality is established by the captured files/hashes; the browser checks prove the mirrored runtime remains functional.

Artifact:
- id: `11049659392`
- digest: `sha256:342f129d64853a2c24843a9c9042815fb55338260bbd40c138b8492ba4e5d924`

## Stage source equality

Stage route source on the donor branch reuses the exact mirror blobs.

Selected exact blob checks:
- `index.html`: `6d765c109e6cc05c4a022406b725592aa8f78e94`
- `config.json`: `4af22d2200dbb87834a3bbc007bf9333e4b2da4b`
- `playcanvas-stable.min.js`: `c4befd2fde7e1cd5cbb96920e9cf2cfc7fff8be3`
- Ammo WASM: `d4b4916828de815cd23582a746de02efe8d2b734`

Publication commit:
`cloudflare-live@db0fabff71b9bb8943184628b7c7d697ba48cd3b`

The publication tree references the donor-stage blobs directly; it does not rebuild them.

## Public KFB Stage proof

Direct route:

`https://kayfabizarro.pages.dev/kfb-hub/stage/playcanvas-donor-01/`

Run: `36604921730`  
Attempt: `1`  
Job: `109531386518`  
Conclusion: **SUCCESS**

**11/11 PASS**
1. exact SOURCE marker
2. title
3. Car Physics
4. Follow Camera
5. Car Graphics
6. W moves
7. R reset
8. KFB Hub card
9. page errors = 0
10. console errors = 0
11. request failures = 0

Measured:
- public W displacement: `1.8006198198674221`
- public reset distance: `0.7586868495664318`

Artifact:
- id: `11051400015`
- digest: `sha256:7996aa46bcdadbd359667254a52df09b2d2277d64035393233f5b92bfe4d7f37`

## Result

**SOURCE-EXACT DONOR MIRROR · LOCAL PASS · PUBLIC_VERIFIED**

No KFB look, texture, vehicle tuning, camera tuning or world replacement has been applied.

## Exactly one next gate

**PC-LOOK-01 · TEXTURE / MATERIAL ONLY**

Keep:
- vehicle physics
- suspension
- controls
- camera
- reset
- scene geometry

locked.

Change only visual material/texture inputs first, with Donor-01 retained as immutable comparison.
