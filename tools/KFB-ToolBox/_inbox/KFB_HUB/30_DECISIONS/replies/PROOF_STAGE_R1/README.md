# KFB Abnahme-Bühne v1 (`kfb-proof-stage.v1`) · how to use it

Every approval image from every workstation comes out of this one stage, the same way. Do not render acceptance images with your own light, clay, background or camera.

**Always identical:**
- **Light:** `vendor/kfb-stage-light.v1.js` (WS1, LIGHT_MODEL_R2), set to `MOODS_MESA` day. There is one sun (the only shadow caster), a hemisphere whose ground colour is the cove colour, one warm figure light from the camera side and contact AO. There is no rim light and no back light.
- **Tone mapping:** ACES Filmic at exposure 1, the same as the WS1 game path.
- **Clay:** `vendor/kfb-clay.v1.1.js`. Figures use the card's `material.clayProfile`, normally `character`. Props and stages use `midground`, with the FrizzleBob height as `scaleRef`. The seed comes from the card.
- **Backdrop:** a soft hollow-curve cove in a light, warm clay colour (`#f2e8d8`), with no relief.
- **Eyes:** KFB EyeRig v6 with the E2 lid skin, always.
- **Frame:** 1600 × 1200 at pixel ratio 1.
- **Units:** KayKit units × 0.616 m (V-345). Use `--units m` for files that are already in metres.

## Views and eye states

| View | Camera |
|---|---|
| `front` | 0°, the whole figure fills 80 % of the frame (height or width) |
| `threeq` | 35° |
| `side` | 90° |
| `back` | 180° |
| `near_face` | head (above the neck pivot, ears excluded, eyes included) fills 60 % of the frame height. For props: the upper third of the object |
| `far` | the figure fills 40 % of the frame height, at 20° |
| `scale_ref` | next to a flat FrizzleBob silhouette, 1.81 m tall |

The figure turns on a turntable. The camera, light and cove stay fixed, so every view gets the same light.

Eye states are `rest` (v6 rest 0.12 / 0.06), `half` and `closed`. Gaze is centred, with no blink and no idle motion.

## Gates (exit ≠ 0 on FAIL)

| Gate | Checks | Result |
|---|---|---|
| G1 | **Figures have eyes.** At least one eye, one E2 lid skin per eye, no visible v6 shells, and each eye has at least 0.12 % of the frame in visible pixels at `near_face` (a mask render, so it counts occlusion). A figure with no seat gets the red label **KEINE AUGEN-ANKER** in the page, and the export fails. | FAIL |
| G2 | **No missing textures or materials.** Catches a texture without an image, the glTF default material, a magenta material, NaN normals, more than 0.1 % zero-length normals, missing normals, and loader errors. | FAIL |
| G3 | **No floating or sinking.** The lowest point (skin applied) must be within ±1 cm of the floor. The figure stays exactly as authored and is never snapped to the floor. | FAIL |
| G4 | **Foreign parts and holes.** Reports bounding-box outliers, loose islands under 0.5 % of the volume, and open boundary edges. | warning only |
| G5 | **The clay module is active.** Every eligible material carries `kfb-clay.v1.1`. | FAIL |

**Eye seats** (`kfb-proof-eyes.v1.js`), first match wins:
1. **`KFB_Eye_L/R/C_anchor`** (WSB convention). The anchor sits at the eye centre, with +Z as the gaze. The radius comes from the card, either `eyeRig.anchors.<side>.radius` in the `anchors.frame` node or `eyeRig.settings.R`. The socket fit is `shellRadius / radius` (path A, V-422, eyeForward 0).
2. **`eye_anchor.l/r`** (EYE-CLEANUP convention). The anchor sits at the old cap, and its scale is the radius. The eye centre is r · (0.24 + inset · 1.15) behind it.
3. **Card `eyeRig.seat: "facehost"`** (FrizzleBob v5b). Uses facehost.v1 plus the card settings, and hides the original model eyes listed in `originals.remove`.

## CLI (Node + headless Chrome)

```bash
cd ~/Dropbox/CLAUDE/KFB_HUB/30_DECISIONS/replies/PROOF_STAGE_R1
export KFB_CHROME=~/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell
node render.mjs --id frizzlebob --out out/frizzlebob                        # id from sources.json (card + GLB)
node render.mjs --card ../FIGURES_R1/figures/lord_hunky.figure.json \
                --glb ../E2_ATTACH_R1/assets/variants/LordHunky_edge80.r4e.glb \
                --type character --views front,threeq,side,near_face,far,scale_ref --eyes rest,closed --out out/hunky
node render.mjs --glb ../../../50_BLENDER/B22/KFB_Billboard_Lamps.r2.glb --type prop --out out/lamps
```

**Defaults:** all 7 views; eyes `rest,closed`.

**Output on PASS:** `<id>_<view>_<eyes>.png` (props: `<id>_<view>.png`), `<id>_contact_sheet.png` (fixed 4 × 3 layout, captions in a bar under each image, gate chips in the header) and `proof_manifest.json`. The manifest holds:
- the input SHA-256 of the GLB and the card, and whether the GLB matches the card;
- the module versions and the sha256 of every vendored file;
- the gate results;
- the light and tone settings, the eye report and the eye pixels;
- the file hashes.

**On FAIL** (exit 1), only two files are written, with no approval PNGs:
- `proof_manifest.json`;
- `<id>_contact_sheet_FAIL.png`, marked "NICHT ABNAHMEFÄHIG", for diagnosis.

**Exit 2** means the file could not be loaded.

**Server:** the CLI starts its own server on an ephemeral port bound to 127.0.0.1 (never 5180/5192/8765), with KFB_HUB as the root, and closes it at the end. Files outside KFB_HUB are served only if the command line or `sources.json` names them, and nothing under `KFB Open World/` is ever served. Nothing in the output folder is deleted; leftovers from an earlier run are listed in `staleFilesInOut`.

**Dependencies:** playwright-core comes from the Lab's `node_modules` (read only), or from `KFB_PLAYWRIGHT_DIR=<folder with node_modules/playwright-core>`. three r180 loads from jsDelivr, so the run needs network access.

## Page (no Node needed)

```bash
cd ~/Dropbox/CLAUDE/KFB_HUB && python3 -m http.server 8790 --bind 127.0.0.1
# http://127.0.0.1:8790/30_DECISIONS/replies/PROOF_STAGE_R1/proof-stage.html            (pick a figure from the list)
# …/proof-stage.html?id=lord_hunky   ·   …/proof-stage.html?glb=hub:50_BLENDER/B22/KFB_Billboard_Lamps.r2.glb&type=prop
```

To check a file that is not in the list, drop in the GLB and, optionally, its `kfb.figure/1` card, choose the type and click **laden**. The right-hand panel shows the gates.

**Export buttons** (enabled only on PASS):
- **Bild exportieren** saves the current view.
- **Alle Ansichten + Kontaktbogen + Manifest** downloads the 12 contact-sheet views, the sheet and `proof_manifest.json`.

`sources.json` paths starting with `~/` work only through the CLI server. With `python3 -m http.server`, use the file picker for those.

## Per workstation

**WSB (Mac mini, Blender)**
1. Export the GLB with no baked clay, no own light and no displacement (V-340).
2. Figures carry the empties `KFB_Eye_L/R_anchor` (or `KFB_Eye_C_anchor` for one eye):
   - the origin sits at the eye centre;
   - +Z points along the gaze (glTF);
   - the parent is the head bone or the eyestalk;
   - put the radius on the card (`eyeRig.anchors.<side>.radius`, or `eyeRig.settings.R`).
3. Feet sit on y = 0, within ±1 cm.
4. Render the acceptance images:
   - **with Node:** run `node render.mjs --card <card> --glb <glb> --out <job>/renders/proof_stage/`. Add a line for the GLB to `sources.json` (the private flag stays local).
   - **without Node:** use the page and the **Alle Ansichten** button, then move the downloads into `<job>/renders/proof_stage/`.

   Blender renders are working images only, never approval images.

**WSA (web chat, page only)**
- Open `proof-stage.html`, served by WS0 or Georg, or load the GLB and card by drag and drop.
- Check the gates, then use **Alle Ansichten + Kontaktbogen + Manifest**.
- Hub cards get the contact sheet. A red **KEINE AUGEN-ANKER** label or any FAIL means: send it back to WSB, never take a screenshot of it.

**WS1**
- Use the CLI for preview links in CI, or the page.
- In-game previews use the same constants: `MOODS_MESA`, tod 1, `applyTone('aces', 1)`, `kfb-clay.v1.1`, and EyeRig v6 + E2 through the card.
- Vendor the files byte-identically. The sha256 values are in every manifest under `vendor`.

**WS0**
- Hub approvals show only `<id>_contact_sheet.png` from this stage.
- Before Georg sees a result, check the manifest: `status` PASS, `input.glbMatchesCard`, and `staleFilesInOut` empty.

## Files
- `proof-stage.html`: the page and `window.KFB_PROOF` (`load`, `render`, `sheet`, `manifest`, `info`).
- `kfb-proof-stage.v1.js`: the stage, gates, cameras, cove and contact sheet (`createProofStage`, `runGates`, `contactSheet`, `applyCardFaceParts`).
- `kfb-proof-eyes.v1.js`: eye seats and the EyeRig v6 + E2 mount (`findEyeSeat`, `mountEyes`, `LID_STATES`).
- `render.mjs`: the CLI.
- `sources.json`: card id → local GLB.
- `vendor/`: byte copies of:
  - `pet-eye-rig.v6`, `clay-skin-attach.v1` and `clay-eyelid.v1/v2/v3` from `E2_ATTACH_R1`;
  - `facehost.v1` from the Resident Atlas cut;
  - `kfb-stage-light.v1` (blob cd8bda8c);
  - `kfb-clay.v1.1` from `CLAY_SSOT_R1`.
- **Private assets** (KayKit Mystery / CharacterTemplate): the renders stay in `evidence/_privat/`, local only. Never publish them.
