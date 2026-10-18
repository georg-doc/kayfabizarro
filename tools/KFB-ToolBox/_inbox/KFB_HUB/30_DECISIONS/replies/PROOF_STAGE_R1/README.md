**v1.2.5 (18.10.):** Augen-Host ohne Kopf-Knochen sitzt immer in der Mitte der Anker (vorher nur bei Mehrfiguren-Dateien). Behebt: Einzelfigur mit gebackener Pose abseits des Ursprungs bekam beide Augen auf einen Anker (WSB-Meldung B11 r4).

**v1.2.4 (18.10.):** Meshes mit glTF-extras `kfb.castShadow=false` (am Mesh oder einem Elternknoten) sowie durchsichtige Materialien (Deckkraft < 0,5) werfen keinen Schatten mehr (Glas, Flüssigkeiten). Vorher warf die UFO-Glaskugel einen vollen Schatten mit Lichtbogen durch den Randspalt.

## v1.2.3 (18.10., WS0) · Mehrere Figuren je GLB
- Every subtree with its own eye anchors (`KFB_Eye_L/R/C_anchor`, `eye_anchor.l/r`, also with the GLTFLoader suffix `_1`, `_2` …) gets its own EyeRig v6 + E2 set. Figure root = the highest node above the anchors that repeats no side. One figure per file (or anchors directly under the root) works exactly as before; FrizzleBob and the B26 ninja render pixel-identical.
- All figures use the file's card (`--card`), or the existing anchor defaults. A subtree without a head bone gets its eye host at the centre of its anchors, turned to their gaze. The old host on the figure root could put both eyes on one anchor when the figure stood off the origin.
- All eye states (rest, half, closed) apply to all figures. `near_face` frames the main figure (the tallest). On a character file that is its head; on stage and prop files it is the upper third, as before.
- **G1 per figure:** each figure is measured alone (its own meshes occlude, the scenery does not), with the camera looking along its gaze. Every mounted figure needs ≥ 0.12 % of the frame per figure in eye pixels at rest. On stage and prop files with ≥ 2 figures, G1 is PASS/FAIL instead of N/A.
- The manifest lists the figures in `render.eyes.figures[]` and `render.eyePixels.perFigure[]` (rest/half/closed, camera, main figure).
- Tested on the B31 demo `KFB_Utopia_Baustelle_Demo.r1.glb` (`--type stage --card kayfabrick_bot_two.figure.r2.json`): 4/4 bots have eyes, PASS.

## v1.2 (18.10., WS0) · Rig-Maßstab, Schattensaum, Schweben
`proof-stage.html` and `render.mjs` now use `kfb-proof-stage.v1.2.js` + `vendor/kfb-stage-light.v1.1.js`. v1.1 stays frozen: `node render.mjs … --stage v1.1` (page `proof-stage.v1.1.html`); v1 as before.
- **scale_ref for stage/prop:** two real figures in clay (profile `character`, same light; FrizzleBob with its figure card: EyeRig v6 + E2 eyes at rest, card brows/nose/mouth) instead of the flat silhouette. Medium = FrizzleBob, Large = KayKit DemonLord (Rig_Large, purchased: local path in `sources.json` → `scale_ref`, never copied, renders private). Height = bind-pose bbox × 0.616 m/u; shown in their rig's own `Idle_A` clip (the bind pose is a T-pose).
  - With `extras.kfb.entrances[0]` (even `proof:false`): both stand in front of the entrance (Medium left, Large right, 0.2 m apart, 0.25 m out from `pos_u`), facing the camera; entrance turned to the camera. They stand on the highest flat surface under their feet and must not touch the object; otherwise they move further out along the entrance direction (the manifest lists the distance). Camera: the Large figure fills 45–55 % of the height, door in frame if possible, figures always whole.
  - Without an entrance: left of the object, as the old silhouette. Character proofs keep the v1.1 silhouette.
  - Caption `Größe: Medium-Rig 1,81 m · Large-Rig 2,85 m an der Tür` (or `daneben`). Manifest `scaleRef { medium_m, large_m, atEntrance, entranceId, figures[], door, camera, notes }`.
  - **Measured:** Medium FrizzleBob 2.941 u = **1.81 m** (hips 0.406 u = 0.25 m); Large DemonLord 4.619 u = **2.85 m** (with horns). Other Rig_Large figures for comparison: Mannequin_Large 3.98 u = 2.45 m, FrostGolem 4.16 u = 2.56 m, Clanker 3.79 u = 2.33 m.
- **Lineups (prop, footprint > 2.5 : 1):** front/¾/back framed on the content width; `side` is replaced by `detail_right` (right half), `near_face` = middle, `detail_low` = left half, whole items per half. For every prop `far` frames height and footprint at 40 %, always farther than the full views. In float pose the eye-level views use 1.5° elevation so the hover gap reads.
- **Shadow seam (G6):** three renders back faces into the shadow map, and normalBias lifted floor samples into the rounded underside of small items, so they read as lit. Light v1.1: front faces cast, the shadow box is fitted to the object and its cast shadow (not the cove), 4096², normalBias 1.5 texels. Contact AO per item (lineups) instead of one box. New gate **G6 Schattensaum**: front/threeq/side/back are compared with a no-bias reference; a lit cluster of 3 px or more inside the shadow core (3 px outline tolerance) fails the gate. `selfTest(gl)` in the light module checks spheres and boxes of 0.1, 0.3, 1 and 6 m at 1600 × 1200 for 0 px seam and 0 px acne; v1 settings fail it.
- **Door probe `tools/door.mjs`** (clear height from the GLB, for WSB):
  - `KFB_CHROME=<chrome-headless-shell> PROBE='{"H0":1.5,"KMAX":3,"KSTEP":0.1}' node tools/door.mjs <building.glb>`
  - Reads `extras.kfb.entrances[0]` (`pos_u`, `forward_xz`, `door` node) and prints a facade depth map plus the passage profile (floor / ceiling / clear every `KSTEP` m into the door).
  - Clear height = the smallest ceiling minus floor along the passage. `H0` must lie inside the opening (deep doors behind stairs: e.g. `H0 3`, `KMAX 15`, `KSTEP 0.5`).
  - Measured 18.10. after the WSB rescale (V-438, 02:48): Hungry Pelican lintel ≈ 2.25 m clear (2.17 m at ±0.3 m); Yelling Goblin inner door lintel ≈ 2.05 m (passage 2.2–2.8 m). Medium 1.81 m fits, Large ducks.
- **Float (V-437):** `--pose auto|float|ground` (default `auto`: props with a `KFB_Pickup` node float). The item centre sits at the Medium rig's hip height (0.25 m). Items taller than 2 × hip height are lifted to half height + 2 cm, so they do not touch the floor. In this pose G3 checks the hover height (±1 cm) instead of floor contact. Floating items get no contact AO.

## v1.1.1 (18.10., WS0)
- `render.mjs` defaults to all three eye states (rest, half, closed), so the sheet has no gaps.
- `detail_low`: if the entrance is blocked from the stage camera (e.g. the bento shrine behind the bowl), set `extras.kfb.entrances[0].proof = false`; the cell then shows "Detail unten" without the entrance. (A free entrance camera was tried and discarded; it ended up inside the geometry.)

# KFB Abnahme-Bühne v1.1 (`kfb-proof-stage.v1.1`) · how to use it

> **v1.1 (18.10.)** keeps everything from v1 and adds a dedicated layout for `--type stage` and `--type prop`: a **3 × 3 contact sheet with no empty cells**.
> - **Character:** views, sheet, gates, light, clay and eyes are unchanged. The v1 and v1.1 renders of the same input are byte-identical.
> - **Files:** `proof-stage.html` and `render.mjs` now use `kfb-proof-stage.v1.1.js`. v1 stays as `kfb-proof-stage.v1.js` + `proof-stage.v1.html`; select it with `node render.mjs … --stage v1`.
>
> | Stage / prop sheet (3 × 3) | | |
> |---|---|---|
> | front 0° | threeq 35° | side 90° |
> | back 180° | **top** (from above, 85°, footprint 80 %) | **detail high** = `near_face` (upper third, 60 %) |
> | **detail low** = `detail_low` (lower third, 60 %) | far (40 %) | scale_ref (FrizzleBob 1.81 m) |
>
> `detail_low` aims at the entrance when the root carries the extras `kfb.entrances[0]`, using the WSB B24 convention: `pos_u` in the root's parent frame, plus `forward_xz`. The object is turned so that the entrance faces the camera, and the caption reads "Detail unten · Eingang". Without an entrance, the view frames whatever stands in the lower third (legs, stairs, plinth).
>
> CLI default views: character = `front,threeq,side,back,near_face,far,scale_ref`; prop and stage = `front,threeq,side,back,top,near_face,detail_low,far,scale_ref`.

---
(v1 text follows; it still applies unless the v1.1 note above says otherwise)

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

## v1.2.6 (18.10.)
- Blickrichtung: Beide Augen schauen entlang der gemeinsamen Vorwärtsrichtung (Mittel der Anker-Normalen), nach innen gedreht um card converge. Vorher übernahm jedes Auge die Flächennormale seines Ankers – auf runden Köpfen (Orks, Monstrosity) schielten die Pupillen nach außen, converge wurde überschrieben. Beleg: Orc Brute B / Raider B near_face (scratchpad eye126), Spielzeugsoldat G1 PASS.
