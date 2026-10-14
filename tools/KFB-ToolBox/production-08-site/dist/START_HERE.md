# KFB ToolBox · Source Cut 2026-10-14 r1

**Project:** KFB ToolBox (Claude Design project »KFB ToolBox«)
**Entry:** `KFB ToolBox Production-08.dc.html`. UI header »KFB ToolBox«, screen label »ToolBox Production-08«.
**Export label:** The Rigging export still writes `meta.exportedBy: "KFB ToolBox Production-02 · Rigging"`. That string dates from P02 and was never updated (KNOWN_ISSUES A13). The project is Production-08.
**Purpose:** a 1:1 source cut for the WSA port (decision V-241, save to GitHub instead of localStorage). No new features and no behaviour change in this cut.
**three.js:** 0.160.0 via import map from unpkg (`three` + `three/addons/`).

## Running it
- Open `KFB ToolBox Production-08.dc.html` over HTTP from this folder, e.g. `python3 -m http.server 8000`. Opening the file directly (file://) does not work. `support.js` is the Design Component runtime and must sit next to the HTML.
- Network needed: unpkg (three), cdn.jsdelivr.net and raw.githubusercontent.com (pinned owner modules and models, see below).

## Tabs (top bar)
| Tab | What it does |
|---|---|
| **Studio** | Actor ▾ / Stage ▾. Inspector sections Body (material, surface scale, colour zones, contact shadow, test light), Face, Pose (IK pins on the stage, pose-rig.v1), Scene (3D editor: select, move/rotate/scale, drop, snap, undo), Fit (CARD_SURF seam). Save / Reload. |
| **Animation Lab** | Clip audition on the current actor: Motion Library v1/v3 + KayKit stock. Scrub with measured foot contacts, roles, locomotion profiles, 24 game states (anim-map.v1), strip of 8 frames, contact correction via IK, motion-profile export. |
| **Rigging** | Parts: Eyes · Brows · Nose · Mouth · Moustache · Hair · Ears · Body · Import · Export. Every face owner slider, source per part (rig · model · off), lid style (EyeRig shells · thin · clay incl. hinge/slide/flap/skin), acceptance runs, ear physics, hair tufts, body shape, rig JSON import/export (kfb.pets/1). |
| **Library** | Animation Library V1: 204 clips from the Motion Library v3 manifest, cards with contact sheets, search/filter, inspector, editorial patch (separate localStorage key), drop zone »Animation ausprobieren« (local only). |
| Bottom bar | Emotes · Viseme · Anim, visible on every tab. |
| »…« panel | Self-tests (ToolBox + Library), source status per module, »Reset to fixture«. |

## Local modules (in this cut)
| File | Version / schema | Origin |
|---|---|---|
| kfb-lib/face-mount.v1.js | kfb.face-mount/1 | ToolBox own. graft-mount.v1 steps 3–4 on facehost.v1 @8922d4b1; socket seat, partrig, mountPetFace |
| kfb-lib/clay-lids.v1.js | kfb.clay-lids/0.3 | ToolBox own. Donor PR #159 `tools/KFB-ToolBox/eye-actor-studio-v1/upper-lid-volume.v1.mjs` (branch chatgpt-web/toolbox-eye-actor-studio-v1-2026-09-21). 14.10.: mech flap + skin (A). Frozen earlier states in kfb-lib/_ref/ |
| kfb-lib/ear-dangle.v1.js | — | PR #214 owner @19088b14 + FB-EARS-FLOPPY-01 additions (sagFrom, sagShare, per-bone limits, bob, wind). Original: _ref/ear-dangle.v1.pr214.js |
| kfb-lib/ear-base.v1.js | — | ToolBox own (ear root base bone) |
| kfb-lib/pose-rig.v1.js | kfb.pose/0.1 | Owner fix 25.09. of `tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v13/pose-rig.v1.js` @8922d4b1 (wrist-aware chains, public IK) |
| kfb-lib/locomotion-profiles.v1.js | — | ToolBox own (P01 r2), measured on KayKit_Character_Animations_1.1 @b97b5ac5 |
| kfb-lib/anim-map.v1.js | — | 1:1 copy of `skills/KFB PetStudio/KFB FrankenStein Studio 16/KFB-v16/frizzlegraft-v1/anim-map.v1.js` @main (read at 2be8d874) |
| kfb-lib/pet-library.v6.js | — | Copy of `stage-first/src/petstudio-v9/studio-v3/pet-library.v6.js` @eabc8725. PET_BASE points to main (A6) |
| kfb-lib/pet-eye-rig.v6.js | — | Copy of studio-v12 @eabc8725. **Not on the load path:** P08 loads the pinned EyeRig from jsDelivr |
| kfb-lib/hair-tufts.v1.js | kfb.hair-tufts/0.1 | ToolBox own. Donor FrizzleBob_Yellow.gltf @eabc8725. 14.10.: tufts cast no shadow |
| kfb-lib/lipsync-text.v1.js | kfb.lipsync-track/0.1 | ToolBox own (text → 13 decals) |
| kfb-lib/body-shape.v1.js | kfb.body-shape/0.1 | ToolBox own |
| kfb-lib/body-surface.v2.js | kfb.body-surface/0.2 | ToolBox own (BODY-02 + family »Knete · K2«). Imports clay/clay-material.v10, clay-relief.v2/v4 |
| kfb-lib/body-surface.v1.js | — | Previous version, **not on the load path** |
| kfb-lib/clay/* | — | K2 clay (clay-material.v10, clay-profiles.v2, clay-relief.v2/v4, clay-toolmix.v1), from the Joyride cut 29.09. See clay/ASSET_REFS.md |
| kfb-lib/contact-ao.v1.js | — | ToolBox own P06 (Joyride F2, LESSONS_SHADOWS PR #290) |
| kfb-lib/edit-layer.v2.js · snap.v1.js · grounding.v1.js | — | P07 · from Resident Atlas S15 (local, not yet in the repo) |
| kfb-lib/anim-library.v1.js | kfb.animation-editorial-patch/1 | ToolBox own (P05) |
| kfb-lib/librarian-motion-projection.v1.js | — | ToolBox own; contract from `tools/asset_registry/librarian/*` @4fa08271 |
| kfb-lib/_ref/* | frozen | Comparison references for the acceptance runs (do not edit) |

## Remote modules (pinned, not in this cut)
All from `georg-doc/kayfabizarro`, loaded via cdn.jsdelivr.net/gh or raw.githubusercontent.com:
- @8922d4b1329fbd47b8754db9dd04ca6b9eb0ee9e: `tools/KFB-ToolBox/lib/edit-layer.js` · `tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/graft-mount.v1.js` and its chain (facehost.v1, eyeoval.v1, headzones.v1, …) · `…/petstudio-v9/studio-v12/pet-eye-rig.v6.js` (+ brow-rig.v2, pet-nose.v2, pet-moustache.v1 in studio-v12) · `…/studio-v3/pet-mouth.v1.js` · `…/lab-v6/partrig.v1.js` · graft profile `tools/KFB-ToolBox/_handover/BIRTHDAY_STARTSCREEN_2026-09-15/profiles/kfb-pet-graft-driver.georg-2026-09-15.json` · `tools/resident_atlas/scenes/`
- @19088b14 (PR #214): `tools/KFB-ToolBox/ear-rig/rigs/fb-default.ear-rig.json`, `glb/FB_TEMPLATE_LOOK_v5.glb`
- @23615cff (georg-doc-patch-3): `tools/KFB-ToolBox/ear-rig/glb/FB_TEMPLATE_LOOK_v5b.glb`
- @b64d7edc: S39 band module + data, wd-sky.js
- Motion Library 01 @032c9d50 · Motion Library v3 @4fa08271 (PR #275) · KayKit stock @b97b5ac5 · Legacy @10a7fdce · Orc Brute @891eadf0 · hair donor @eabc8725
- **Unpinned (main):** mouth decals `media/3D_Assets/Textures/FrizzelBob-Mouth_01/` (+ FemaleMouth_01, RedMouth_01) via pet-mouth.v1 MOUTH_BASE; Cube Pets `media/3D_Assets/GLB_cube-pets/` via pet-library PET_BASE (A6)

## Not in this cut (size)
- `kfb-lib/clay/Fingerprints01_3K.png` (4,699,482 bytes > 2 MB). Source: joebinns/clay @e8d2a792cc45 (see clay/ASSET_REFS.md; also georg-doc/clay). Without it, K2 runs without fingerprints (the UI says so).
- All GLB/GLTF models are remote references only (ACTORS.md).

## Also in this cut
- `data/kfb-pet-frizzlebob-earrig-v5.georg-2026-10-14.json`: Georg's current Rigging export (kfb.pets/1), taken from his live view 14.10. 16:20Z (A3).
- `data/FB_V5_RIG_BASELINE_2026-10-14.json`: the same actor as a workspace snapshot (actor profile + rig entry) plus measured eye positions.
- `Lid Reference.dc.html`: lid reference A/B/C × 6 expressions (Georg chose A for FB v5; final lid to come from Blender).
- `handover/BLENDER_BRIEF_FB_LIDS_A_2026-10-14.md`, `handover/HANDOVER_CLAUDE_CODE_TOOLBOX_2026-10-14.md`, `UI_NOTES.md` (UI / navigation for the WSA port).
- `docs/`: LESSONS_SHADOWS, project rules, github.md (repo association and sync history).
- `CHECKSUMS.sha256`, `MANIFEST.json`.

## Checks run for this cut
- **Boot from this folder** (Claude Design preview, 14.10. 16:3x Z): the page renders. Console shows one `[error] {}` without content; the project version shows the same error, not investigated. The `never resolved` warnings are template placeholders before the first render (harmless).
- Secret scan (GitHub/OpenAI/AWS tokens, signed URL tokens): 0 hits. No file over 2 MB.
- SHA-256 for every file: `CHECKSUMS.sha256`. Size and list: `MANIFEST.json`.
- **NOT_RUN:** ToolBox self-test, Library self-test, acceptance runs (Rigging), editor checks E1–E9.
