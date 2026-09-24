repo: georg-doc/kayfabizarro
branch: chat/gds-theatre-curtain-v1-2026-09-20
path: game-ready/theatre-curtain-v1/, kfb-hub/stage/game-dev-studio/theatre-curtain-v1/, tools/KFB-ToolBox/kfb-rigs-embed-v3/, tools/KFB-ToolBox/eye-rig-batch/
secondary_repo: mrdoob/three.js@master (read-only reference: examples/webgpu_compute_cloth.html)

## Last sync
date: 2026-09-24T19:22:11Z
commit: 5650b6c54d8789b20ea80abe857688173d506d3b (rigs pin used by NPC-CARD-SPEC-01; eye-rig-batch files from branch toolbox/eye-rig-batch-2026-09-18)

### Updated in this project
- NPC-CARD-SPEC-01: built `NPC Card Speculation Scene.dc.html` + thin recipe/runner under `npc-card-spec-01/`. FrizzleBob Driver Graft comes in via `mountGraft` (jsDelivr, pinned). GothGirl comes in via the EYE_RIG_BATCH cleanup and eye adapter, plus the profile's PetMouth.
- Copied unchanged donors into `npc-card-spec-01/donor/`: eye-rig-batch lib + gothgirl seed, kfb-pet-gothgirl.json, podcast-v5 bubble shaper/shapes (Dropbox), kfb-ink-canon.js.
- Return: `docs/NPC-CARD-SPEC-01_RETURN.md`.
- Round 2: read `lab-v4/carlrig.js#flattenRecesses` @5650b6c (method reused for the GothGirl mouth recess). KFB Motion Library Rig_Medium came from Dropbox, not GitHub.

## Sync history
- 2026-09-23T23:22:58Z — Theatre Curtain v1 runtime copied + evolved in-project; three.js cloth donor mounted read-only; prior SVG/CSS curtain hard-reset.

## Screen map
| Project screen | Repo source |
|---|---|
| NPC Card Speculation Scene.dc.html | kfb-rigs-embed-v3@5650b6c: frizzlegraft-v1/graft-mount.v1.js, facehost.v1.js, petstudio-v9/studio-v3/pet-mouth.v1.js, lab-v6/texclean.js, contracts/kfb-pet-graft-driver.v4.json · eye-rig-batch@toolbox/eye-rig-batch-2026-09-18: lib/kaykit-eye-adapter.v1.js, lib/source-face-cleanup.v1.js, lib/face-color-sampler.v1.js, data/gothgirl.seed.json · tools/KFB-ToolBox/_inbox/KFB Elisa B-Day Reference+Mockups/kfb-pet-gothgirl.json · media/3D_Assets/KayKit_Mystery_Series6/GothGirl/ |
| KFB Theatre Curtain.dc.html | georg-doc/kayfabizarro@chat/gds-theatre-curtain-v1-2026-09-20: game-ready/theatre-curtain-v1/runtime/kfb-theatre-curtain.mjs (base, then extended in-project); kfb-hub/stage/game-dev-studio/theatre-curtain-v1/index.html + lab.mjs (control-bar/wiring reference only, not copied as files) |
| Three.js Donor - webgpu_compute_cloth.html | mrdoob/three.js@master: examples/webgpu_compute_cloth.html (read via github_read_files, mounted verbatim except CSS/HDR asset paths pointed at threejs.org) |
