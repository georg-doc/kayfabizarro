# FIGURES_R1 · figure cards (kfb.figure/1) · WS0 · 17.10.2026 · V-391

There is one source of truth per character. Stages, proof pages, WSB renders and the Figure Workshop load **only** `figures/<id>.figure.json`, and never a raw KayKit or Meshy GLB. If a card is missing, or has no eye rig, the loader refuses the figure visibly.

## Files in this folder
- `FIGURE_SCHEMA_R1.md`: fields and rules (one page)
- `kfb.figure-1.schema.json`: the machine schema
- `figures/*.figure.json`: 13 draft cards
- `CHARACTER_SCHEMA_R1.md` / `characters/`: **not written yet** (scope extension kfb.character/1 still open, see the report)

Search covered:
- 519 GitHub branches (fetched 17.10.);
- KFB_HUB;
- Island Worldbuilder Lab (`public/assets/figures-b2`, `docs/`);
- the Resident Atlas cuts;
- `MeshyModels/_blender_run_r1`.

Not touched: `KFB Open World/`. Nothing was pushed.

## Overview
"Loader" is the result of the rule check (`FIGURE_SCHEMA_R1.md` rule 2) applied to the draft card.

| Figure | Card | Status | Loader | Missing for approval | Source paths (main ones) |
|---|---|---|---|---|---|
| FrizzleBob | `figures/frizzlebob.figure.json` | **approved** (V-240, V-245 "fb passt so") | ok | clay proof pair front / ¾ / side under the stage-light module; FB v5b GLB not on main | `replies/actors/frizzlebob.georg-2026-10-14.kfb-pets.json` (sha 07a316cb…); GLB `tools/KFB-ToolBox/ear-rig/glb/FB_TEMPLATE_LOOK_v5b.glb` @23615cff (georg-doc-patch-3); v5d candidate on `assets/kfb-blender-run-r1-2026-10-16` |
| Mummy_A | `figures/mummy_a.figure.json` | candidate | ok | image with EyeRig v6 + clay (never existed); V-201 squint check; mouth set; voice assignment | `georg-doc-patch-3: skills/chat/workflows/EYE_CLEANUP_01_2026-10-01/{glb/Mummy_A_NoEyes.glb, eye-cleanup-01.json}`; Lab `figures-b2/mummy_a` (byte-identical); eye values `rig-medium-default.v0.json` (Georg, 19.09.) |
| Mummy_B | `figures/mummy_b.figure.json` | candidate | ok | same as Mummy_A | same as Mummy_A (`Mummy_B_NoEyes.glb`) |
| Orc Brute | `figures/orc_brute.figure.json` | candidate (body: "Orc passt", V-346) | ok | Georg saves the eye setting in the Figure Workshop (r4 run, V-353); clay proof | `assets/kfb-blender-run-r1-2026-10-16: …/Orc Brute/OrcBrute.kfb-eyes.r1.glb` + `blender_run_r1/reports/build_orc_eyes.json`; eye values `figures-b2/eye-profiles/rig-large-reviewed.v1.json#orc-brute` (Georg, 20.09.) |
| GothGirl | `figures/gothgirl.figure.json` | candidate (casting PASS V-269, voice PASS V-308) | ok | Georg PASS on GothGirl_NoEyes; eye setting A or B; mouth decision; clay | `georg-doc-patch-3: …/GothGirl_NoEyes.glb` + `EYE_CLEANUP_02/eye-cleanup-02.json`; Georg's own save `tools/KFB-ToolBox/_inbox/KFB Elisa B-Day Reference+Mockups/kfb-pet-gothgirl.json` (16.09.) |
| Lord Hunky | `figures/lord_hunky.figure.json` | candidate (r4 TUNE accepted V-353, eye socket approved 15.10.) | ok | Figure Workshop r4 run + Georg's tune/save (V-317); E2 in the socket; brows later | `assets/kfb-blender-run-r1-2026-10-16: media/3D_Assets/MeshyModels/alien_figures_toolbox_r1/{LordHunky_RigMedium.toolbox.r4.glb, lordhunky-headpart-r4…kfb-pets.json}` |
| Lady Dory | `figures/lady_dory.figure.json` | candidate (as Hunky) | ok | same as Hunky; centre stalk `side "L"`; shellRadius 1.014 R; status of the head-oval job | same branch, `LadyDory_RigMedium.toolbox.r4.glb` + `ladydory-headpart-r4…` |
| Norman | `figures/norman.figure.json` | **open-design** (V-380) | ok* | site proof Source only → Face candidate; Georg gate NORMAN_TOOLBOX_SITE_FINE_TUNE_01; voice; baked texture instead of runtime texclean | `toolbox/eye-rig-batch-2026-09-18 @d1900457: tools/KFB-ToolBox/eye-rig-batch/data/{norman.prototype-profile.v0.json, norman-mouth-r3.v1.json}`; body `Prototype Bits/Character/Dummy.glb` (main) |
| Brain-Cyborg | `figures/brain_cyborg.figure.json` | **open-design** (V-349 TBD) | REFUSE (not built) | everything: aliens PASS first, story, Blender build | `MeshyModels/Meshy Community/bodyparts3d-brain-review.glb` (sha 01c5271f…, CC BY-SA DBCLS) |
| Witch (extra) | `figures/witch.figure.json` | candidate (cleanup PASS 01.10.) | ok | eye-rig image + clay; V-201 check | EYE_CLEANUP_01 (patch-3) |
| Monstrosity (extra) | `figures/monstrosity.figure.json` | candidate (Georg eye profile 20.09., provisional) | ok | cleanup PASS, anchored setting, clay | `rig-large-reviewed.v1.json`; EYE_CLEANUP_02 `Monstrosity_NoEyes.glb` |
| Demon Lord (extra) | `figures/demon_lord.figure.json` | candidate (as Monstrosity) | ok | same as Monstrosity | same, `DemonLord_NoEyes.glb` |
| Black Knight (extra) | `figures/black_knight.figure.json` | candidate | REFUSE (raw GLB) | Blender eye cleanup + anchors | `rig-large-reviewed.v1.json#black-knight` |

\* Norman passes the checks, but its body is still the raw GLB plus a runtime texture clean (`originals.method = runtime-texture`, a V-336 risk).

**Approved:** only FrizzleBob, as a whole figure. Partial approvals:
- Mummies, Witch and Orc: body/cleanup;
- Hunky/Dory: head seat (TUNE), socket and mouth swap;
- GothGirl: casting and voice.

**Georg's saved eye settings found:**
- FrizzleBob (ToolBox export, 14.10.);
- Medium class default (19.09.);
- GothGirl (Pet Studio, 16.09.);
- Rig_Large set (20.09.): Orc, Monstrosity, Demon Lord, Black Knight.

**Not found:** a saved setting for the mummies, Norman, Hunky/Dory (values from WS0/Claude Design) or the Witch (class default only). The review file `uploads/EYE_CLEANUP_01_review.json` was not found either; the PASS of 01.10. is known only from an agent report (`MUMMY_01_RETURN.md`, round 6) and `data/cast.js:144`.

## Main gaps
1. **The V-201 eye failure is unsolved.** Every KayKit card (mummies, GothGirl, Witch) carries exactly the V-200 values that failed on 13.10.: eyes squinted outward and had no gaze. The anchor normals point about 22–26° outward. The converge sign, v6 kinetics/life and the Studio 1:1 template still have to be built before any image goes to Georg.
2. **Nothing face-ready is on main.** The NoEyes GLBs (patch-3), the Orc/alien r4 (asset branch) and FB v5b (patch-3/ws1) are all off main. Main has only raw KayKit files. Georg's yes is needed to move them.
3. **No clay proof with an eye rig exists for any figure.** Every proof is without clay or without a rig (V-346.6, F1, F3).
4. **No Georg save** exists in the Figure Workshop for Orc, Hunky, Dory, GothGirl or the mummies.
5. **Refusal in code** (loader + QA test) is not built yet. Owners: WS1 for stages, WSA work for the Figure Workshop.
6. **Runtime removal still in use:**
   - WS1 loads the raw GothGirl through `kaykit-eye-adapter`;
   - Norman uses runtime texclean;
   - the Large profiles used FaceHost removal.

   All of these must move to baked GLBs (V-336).

## Questions for Georg (one click each: image → PASS / TUNE / REJECT)
| # | Figure | Image(s) | Question |
|---|---|---|---|
| G1 | Mummy_A + Mummy_B | **to be created:** WSB close-up pair front + ¾, EyeRig v6 on the EYE-CLEANUP-01 anchors, clay (ANTWORT_WS0 17.10.) | Are these the mummy eyes? (lid colour Mummy_A = black band `#111618`, Mummy_B = skin `#f6bd99`) |
| G2 | GothGirl | **to be created:** two images side by side: A = Medium default (V-200), B = your Pet Studio save 16.09. (bigger, glossy eyes, lashes, decal mouth "female") | A or B? Keep the painted mouth or use the decal mouth? |
| G3 | GothGirl | `georg-doc-patch-3: skills/chat/workflows/EYE_CLEANUP_02_2026-10-02/eye-cleanup-02_contact.png` (GothGirl row) | Eye cleanup PASS? (only the eye caps removed; brows, nose, mouth kept) |
| G4 | Orc Brute | `assets/kfb-blender-run-r1-2026-10-16: media/3D_Assets/MeshyModels/blender_run_r2/proofs/orc/OrcBrute_r2_01…03_*_KFB-Augen_Knete.png` (KFB eyes + clay + teeth) | Are these the images you meant by "Orc passt" (V-346)? If yes, the Orc eye values are approved. |
| G5 | Mummies (voices) | `figures-b2/mummy_a`, `mummy_b` front images | Male voice = Mummy_B (light, brow), female voice = Mummy_A (dark band)? |
| G6 | Lord Hunky / Lady Dory | Figure Workshop after the r4 run (Hub b61), front / ¾ with clay | Tune the eyes and save; then card status = approved |
| G7 | FrizzleBob | clay pair front / ¾ / side (WS1, stage-light module) | FB with clay: PASS? (closes FB completely) |
| G8 | FrizzleBob ears | `assets/kfb-blender-run-r1-2026-10-16: media/3D_Assets/MeshyModels/blender_run_r2/proofs/fb/FB_v5b_v5d_01…06` | Stay with v5b, or switch to v5d? |
| G9 | Norman | site candidate (Source only → Face candidate, clay) | TUNE / APPROVE / REJECT (gate NORMAN_TOOLBOX_SITE_FINE_TUNE_01) |
| G10 | all | — | Status rule: are `candidate` figures allowed on staging and in proofs with a tag outside the image, and `open-design` only in the Figure Workshop? |
| G11 | NoEyes GLBs | — | Your yes to move Mummy_A/B, Witch, GothGirl and Orc (kfb-eyes.r1) next to the originals on main? |
