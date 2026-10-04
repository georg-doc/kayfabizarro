# NPC-CARD-SPEC-01 · Resident Card Speculation Scene — Source Return (STOP)

Date: 2026-09-24 · Executor: Claude Design · Status: `STOPPED_AT_SOURCE_GATE` — no scene built.

## Actor A · "FrizzleBobrick" → `SOURCE_REQUIRED`

Searched, zero hits for `bobrick` (name, path, content):
- GitHub `georg-doc/kayfabizarro@main` (c049cae386e1): full-tree filename scan (10 179 files); bounded code search in `skills/chat/`, `kfb-hub/`, `tools/KFB-ToolBox/`.
- Dropbox `/CLAUDE/`: filename scan + content grep in 2D Animation Studio, Cartoon Studio, WorldBuilder, FrankenStein Lab, ToolBox Studio Rig Anim, Pet Studio, Animation Lab, Living Illustration (partly bounded at 500 files).

Candidates that exist but may NOT be substituted per brief without Georg's confirmation:
1. `skills/KFB PetStudio/.../petstudio-v9/studio-v12/frizzlebob.v4a.js` (Pet Studio v12 FrizzleBob, blob b1470bef0d61)
2. FrizzleBob Driver Graft — `tools/KFB-ToolBox/kfb-rigs-embed-v3/contracts/kfb-pet-graft-driver.v4.json` + `frizzlegraft-v1/graft-mount.v1.js` (explicitly excluded by brief)
3. KayKit Motion Lab v1 "FrizzleBob · Driver Graft · Rig_Medium" (same actor as 2)

Needed: exact file/path/commit of FrizzleBobrick + its mouth/talk owner.

## Actor B · GothGirl → `PARTIAL`

Resolved:
- Asset: `media/3D_Assets/KayKit_Mystery_Series6/GothGirl/characters/GothGirl.glb` (blob b56f67e4ddb7), Rig_Medium, clips from `Animations/gltf/Rig_Medium/{General,MovementBasic}.glb`.
- Profile: `tools/KFB-ToolBox/_inbox/KFB Elisa B-Day Reference+Mockups/kfb-pet-gothgirl.json` (kfb.pets/1 v1.2.9, contract 1.3.0) — eye anchor .49/.32, pupil .34, mouth set `female`, size .58, dy −.40.
- EyeRig owner: `kfb-rigs-embed-v3/petstudio-v9/studio-v12/pet-eye-rig.v6.js` via `frizzlegraft-v1/facehost.v1.js`.
- Mouth owner candidate: `pet-mouth.v1.js` (blob d18c95cc5d8f), FrizzelBob-Mouth_01.

Blocking:
- Profile note names build path `frizzlegraft-v1/goth-biped.v1.js` — not found in GitHub.
- Eye-cleanup conflict: profile says islands 6+7; `EYE_RIG_BATCH_2026-09-18/START_HERE.md` says 2+3 is current, 6+7 = diagnostic history.
- Source-mouth removal is `texclean`; EYE_RIG_BATCH lists KayKit mouth as `MOUTH_GRAFT_CANDIDATE`, not a proven owner. Risk: painted mouth shows under KFB mouth.

## Card → `RESOLVED`

Owner in this project: `kfb-viewer.js` (v1.1.0, headless `KayfabizarroViewer.loadDeck`) + `pdfs/*.pdf` (8 test decks, pdf.js 3.11.174). No new renderer needed.

## Next gate (one)

Georg names the exact FrizzleBobrick source + mouth owner, and confirms which GothGirl build path (goth-biped.v1.js location, or EYE_RIG_BATCH 2+3 + texclean) is current. Then: isolation proofs for both actors → scene.
