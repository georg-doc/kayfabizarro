# RETURN · PROOF_STAGE_R1 · **v1.1: layout for stages and props** (WS0 · 18.10.2026)

**Brief (WS0, Georg):** the sheet for `--type stage` / `prop` had 5 empty grey cells; he wants a uniform presentation with no gaps. **Done.**

## What changed
- **New module:** `kfb-proof-stage.v1.1.js`, a copy of v1 plus the changes below. v1 stays untouched (`kfb-proof-stage.v1.js`, and the page copy `proof-stage.v1.html`; select it with `render.mjs --stage v1`).
- **New views:**
  - `top`: from above at 85°, the footprint fills 80 % of the frame.
  - `detail_low`: the lower third, 60 % of the frame height. It aims at the entrance from the root extras `kfb.entrances[0]` (B24 convention), and the object turns so that the entrance faces the camera. Without an entrance, the view frames whatever stands in the lower third.
  - `near_face` on stages and props remains "Detail oben" (upper third).
- **Contact sheet** for stage/prop: fixed **3 × 3** (front, threeq, side / back, top, detail high / detail low, far, scale_ref), larger tiles (624 × 468), no empty cells. `PROP_SLOTS` and `slotsFor(type)` are exported.
- **CLI and page:** default views per type (`DEFAULT_VIEWS`). The page's "Alle Ansichten" button uses the matching layout.
- **The character layout is unchanged.** I checked this on the same input (FB): the v1 page and the v1.1 page give byte-identical PNGs.
- **Small fix:** the G3 caption now reads "steht" (standing) for anything within ±1 cm. v1 said "schwebt" (floating) for +0.00 cm; v1 itself is unchanged.

## Test: the four B24 pubs (`--type stage`, private → `evidence/_privat/`)

| Pub | Height | G2 | G3 | G4 | G5 | Status | Entrance detail |
|---|---|---|---|---|---|---|---|
| Fat Mermaid | 10.10 m | PASS | 0.00 cm | WARN (2 small LOW islands) | PASS | **PASS** | door + steps |
| Yelling Goblin | 23.25 m | PASS | −0.00 cm | WARN (1 island) | PASS | **PASS** | stairs + "Ale Grub Fights" sign |
| Salty Bite | 19.08 m | PASS | −0.00 cm | PASS | PASS | **PASS** | shark mouth + stairs |
| Hungry Pelican | 11.40 m | PASS | −0.00 cm | WARN (1 island, 2 open edges) | PASS | **PASS** | arched door + steps |

- **Contact sheets:** `evidence/_privat/pub_<Name>_contact_sheet.png`; all views and manifests are in `evidence/_privat/pubs/<Name>/`.
- **Public prop check:** billboard r3 (the current `sources.json` entry) → `evidence/billboard_lamps_v1.1_contact_sheet.png`, PASS, 3 × 3 with no empty cells.
- **My image check:** all 9 cells are filled in every sheet, with the same light and cove. The `top` view shows roof and footprint, and the entrance details are readable. The pubs keep their Meshy textures, with `midground` clay laid over them.

## Noticed (not changed by me)
`sources.json` was updated by someone else at 00:27: FrizzleBob now uses `50_BLENDER/FB/…_kfbanchors.glb` (private) with its own card, Lady Dory uses r9 (normals fixed), and the billboard uses r3 (raised). The public v1 evidence `evidence/frizzlebob/` therefore still shows the older public FB v5b (card-facehost seat). `--id frizzlebob` now renders the private anchor version.

## Open points (v1.1)
- The pubs have no card. The seed is the file name and there is no displayName, so the title shows the file name. A stage/prop card (`kfb.stage/1`?) would supply name, seed and approval status. **WS0 decision.**
- `detail_low` without an entrance is generic (lower third). If props get an anchor such as `KFB_Detail_anchor`, it could be aimed at directly.

---

# RETURN · PROOF_STAGE_R1 · KFB Abnahme-Bühne v1 (WS0 · 17./18.10.2026)

**Brief:** Georg 17.10.: "Ich will eine einheitliche und repräsentative Darstellung aller Abnahmen!" (one uniform, representative presentation for all approvals) and "Wieso haben die Modelle keine Augen?" (why do the models have no eyes?).

**Result:** one page plus one headless CLI that drive the same code. Every figure gets the KFB EyeRig v6 with the E2 lid skin. Light, tone, clay, cove, cameras and frame are fixed. There are five automatic gates, and the export fails on any FAIL. Each run writes one contact sheet in a fixed layout and a manifest with SHA-256 hashes.

I tested 6 assets plus 2 control cases. 5 figures pass. 2 real asset defects were found, and the gates stopped them:
- **Lady Dory r7** has 519 zero-length normals.
- **The billboard** sinks 3.7 cm into the floor.

A figure without anchors gets the red "KEINE AUGEN-ANKER" label, and the export ends with exit 1. Two runs produce byte-identical files.

Nothing was pushed, no settings were changed, nothing was deleted, and no file in another tool was touched. All new files are in this folder; `vendor/` holds byte copies. `KFB Open World/` was not touched. Port 8765 was not touched; every test run used its own ephemeral 127.0.0.1 server, which closes when the run ends.

## 1 · What was built

| File | Purpose |
|---|---|
| `proof-stage.html` | The page: a figure list (`sources.json`), a file picker for GLB + card, view and eye buttons, a live 1600 × 1200 canvas, the gate panel, the red **KEINE AUGEN-ANKER** label, and export buttons that work only on PASS. `window.KFB_PROOF = { load, render, sheet, manifest, info }` is what the CLI drives. |
| `kfb-proof-stage.v1.js` | The stage, documented below. |
| `kfb-proof-eyes.v1.js` | Seat detection (`findEyeSeat`). The mount (`mountEyes`) uses EyeRig v6 + `clay-skin-attach.v1` (E2, eyeForward 0, fit from the card). Lid colour is the card value as is. Lids get `character` clay. |
| `render.mjs` | The CLI: Node + playwright-core + chrome-headless-shell (`KFB_CHROME`), the same harness as the CLAY_SSOT golden test. |
| `sources.json` | Local resolver from card id to GLB. The card's `body.glb.path` is a repo path and cannot be loaded locally. |
| `vendor/` | Byte copies. The sha256 of each copy is in every manifest. |
| `README.md` | Usage for WSB, WSA, WS1 and WS0. |

**`kfb-proof-stage.v1.js` (`createProofStage`, `runGates`, `contactSheet`, `applyCardFaceParts`)**
- **Light:** `kfb-stage-light.v1`, `MOODS_MESA` day (tod 1). One sun is the only shadow caster (PCF soft, `fitShadow`); figures cast and receive shadows. The hemisphere ground uses the cove colour. One warm figure light comes from the camera side. Contact AO sits on the real floor footprint.
- **Tone:** `applyTone(renderer, 'aces', 1)`, the WS1 path (RETURN CLAY_SSOT_R1 §2, LIGHT_MODEL_R2 rule 5).
- **Clay:** `kfb-clay.v1.1`, profile by type, seed from the card.
- **Cove:** a soft hollow curve made of floor, quarter round and wall, in light warm clay `#f2e8d8` with relief off.
- **Turntable:** the figure turns; camera, light and cove stay fixed.
- **Cameras:** `front` / `threeq` 35° / `side` 90° / `back` 180° fill 80 % of the frame. `near_face` fills 60 % of the frame height with the head above the neck pivot (ears excluded). `far` fills 40 %. `scale_ref` places the figure next to a flat FrizzleBob silhouette of 1.81 m.
- **Units:** KayKit units × 0.616 m (V-345).
- **Determinism:** a seeded `Math.random`, because EyeRig v6 draws its timers from it.

**Card face parts:** the stage uses the same maths as the ToolBox (partrig.v1 + face-mount.v1). Brows, nose and mouth on original meshes get the card transform. If the card has no transform, the stage reads the card's own `source`, a kfb.pets export. The painted mouth is then projected onto the skin (`conformOriginalMouth`), so it does not stand off the face in ¾ and side views.

**CLI:** `node render.mjs --card <figure.json | id> [--glb <path>] [--type character|prop|stage] [--views …] [--eyes rest,half,closed] [--units kaykit|m] --out <dir>`
- Exit 0 means PASS. Exit 1 means a gate FAILed; only the manifest and `<id>_contact_sheet_FAIL.png` are written, with no approval PNGs. Exit 2 means a load error.
- Details are in README.md.

## 2 · Test results (headless chrome-headless-shell 1234, ANGLE Metal, Apple M1 Max · three r180)

| Asset (GLB) | Seat | Height | G1 eyes: visible pixels per eye at `near_face` (min) | G2 | G3 lowest point | G4 | G5 clay | Status |
|---|---|---|---|---|---|---|---|---|
| **FrizzleBob** v5b (= card sha 0675942b) | card-facehost (approved setting V-240/245) | 1.812 m | 30 629 / 30 612 (1 152) | PASS | −0.03 cm | WARN (open brows/mouth edges) | 11/11 | **PASS** |
| **GothGirl** NoEyes (= card sha 3016e4b6) | eye-anchor (`eye_anchor.l/r`, r 0.073 u) | 1.362 m | 9 435 / 9 604 | PASS | −0.00 cm | WARN | 6/6 | **PASS** |
| **Lord Hunky** edge80 r4e (≠ card r4) | kfb-anchor; card radius in frame LordHunky_Head; fit 0.9734 (1.10 R) | 1.187 m | 46 202 / 46 201 | PASS | −0.00 cm | WARN | 8/8 | **PASS** |
| **Lady Dory** r7, B14 final (≠ card r4) | kfb-anchor; one eye; fit 0.8968 (1.014 R) | 1.216 m | 49 745 (2 304) | **FAIL: 519 zero-length normals** in LadyDory_Head_mesh (also in r5; r4/edge80 are clean; checked in the raw GLB data) | −0.00 cm | WARN | 7/7 | **FAIL** (exit 1) |
| Lady Dory edge80 r4e (reference) | as above | 1.216 m | 49 671 | PASS | −0.00 cm | WARN | 7/7 | **PASS** |
| **Suit** `Suit_CT_agent.r3` (B12 card `suit_ct.figure.r3.json`) | kfb-anchor; card `settings.R` 0.09 | 1.347 m | 16 442 / 16 945 | PASS | −0.03 cm | PASS | 6/6 | **PASS** |
| **Prop** `KFB_Billboard_Lamps.r2` (B22) | none (prop, N/A) | 2.725 m | N/A | PASS | **−3.70 cm (sinks)** | WARN | 13/13 midground | **FAIL** (exit 1) |
| Control: raw `GothGirl.glb`, no card | none | 1.362 m | **KEINE AUGEN-ANKER** | PASS | −0.00 cm | WARN | 6/6 | **FAIL** (exit 1; red label in the page) |

- **Determinism:** I ran FrizzleBob twice (22 files: 21 views + sheet). All 22 PNGs are byte-identical (sha256).
- **No silent eyeless render:** every figure with eyes shows them in all 21 views (`rest`, `half`, `closed`), with no v6 shells visible and one E2 lid skin per eye.

**My own image check:**
- Eyes are present on every PASS figure in all views, and the closed E2 lids are clean, in clay and in the lid colour from the card.
- The clay is visible, with soft thumb dents and no stripes.
- There are no grey patches.
- The light is the same in every image: sun from the front left, shadow to the back right, the same cove tone.
- `scale_ref` shows real sizes. Hunky (1.19 m), Dory (1.22 m), Suit (1.35 m) and Goth (1.36 m) stand next to the FrizzleBob silhouette (1.81 m).

## 3 · Evidence (`evidence/`)
**Public** (CC0 / own assets):
- `frizzlebob_contact_sheet.png` and `frizzlebob/` (21 PNGs + manifest);
- `billboard_lamps_contact_sheet_FAIL.png` and `billboard_lamps/` (manifest);
- `ui_page_frizzlebob.png` (the page with gates);
- `*.log` (CLI output).

**Private** (Mystery Series / CharacterTemplate, local only, never publish):
- `_privat/<id>_contact_sheet.png` for gothgirl, lord_hunky, suit_ct_agent and lady_dory_edge80_r4e;
- `_privat/lady_dory_r7_contact_sheet_FAIL.png`;
- `_privat/no_anchor_GothGirl_raw_contact_sheet_FAIL.png` and `_privat/ui_page_no_anchor_GothGirl_raw.png` (the red label);
- `_privat/<id>/` (all views + manifests).

## 4 · Open points
1. **Lady Dory r7/r5 (WSB B14):** 519 zero-length normals in the head mesh, introduced with the r5 head fixes. **WSB:** in Blender, run Merge by Distance and remove degenerate faces, recompute normals, and export again. Until then, the stage blocks r7. edge80 r4e passes.
2. **Billboard lamps r2 (WSB B22):** the legs reach 3.7 cm below y = 0. The fix is either to lift by 3.7 cm, or, if the legs are meant to sink into the ground, for WS0 to add a card field (e.g. `placement.groundEmbed_m`) that the stage then respects. **WS0 decision.**
3. **The FrizzleBob card is incomplete:** `FIGURES_R1/figures/frizzlebob.figure.json` carries only the brow transform. Nose (scale 1.4, lift 0.218, depth −0.032) and mouth (scale 1.34, lift 0.1, depth −0.188, pitch 18) come today from the card's source export `actors/frizzlebob.georg-2026-10-14.kfb-pets.json#pets[0].original`, and the manifest says so (`faceTransformsFrom`). **WS0:** copy them onto the card.
4. **FB eyes and mouth, partly:**
   - The eye oval (eyeoval.v1: w 1.06, h 1.04, tilt −25) and the mouth rest texture "closed" (mouth sets R3) are not ported, so FB's eyes are round and the mouth shows the model's smile.
   - FB has no `KFB_Eye_*_anchor` in its GLB; the seat comes from the card (facehost).
   - **Proposal:** WSB bakes `KFB_Eye_L/R_anchor` into FB as well, so all figures use one seat type.
5. **Cards vs files:** the Hunky card points to r4 (in use: edge80 r4e, V-422/V-430); the Dory card points to r4 (handoff final: r7). The manifest flags this with `glbMatchesCard: false`. **WS0:** update the cards. The suit card is a local B12 card that is not in FIGURES_R1.
6. **Bind pose only (T-pose).** Idle clips are private (KayKit Character Animations) or missing. A later option is a pose from `card.performance` with a fixed frame.
7. **G4 warns on almost every KayKit/Meshy asset** (open part edges, many small islands). That is information, not a failure. Thresholds per type can come later.
8. **The page export button was not run headless**, because browsers block downloads. It uses the same code path as the CLI (`render`, `sheet`, `manifest`).
9. **GothGirl_NoEyes.glb lives outside KFB_HUB** (in the Lab). The CLI reaches it through its allow-list; with a plain `python3 -m http.server`, only drag and drop works. The GLB belongs on the asset branch.
10. three r180 loads from jsDelivr (network needed), as in every existing proof.
11. **Not yet approved by Georg:** the look (cove tone, framing, clay v1.1).

## Short summary
One acceptance stage now covers every workstation, as a page and as `render.mjs`. It uses one light (Mesa day, ACES 1), one clay (v1.1), one neutral cove, fixed cameras, 1600 × 1200, and always KFB eyes with E2 lids. Five gates run, and the export stops on FAIL. FrizzleBob, GothGirl, Lord Hunky, the suit and Dory edge80 pass with eyes in every view. Dory r7 (broken normals) and the billboard (sinks 3.7 cm) are correctly blocked, and a figure without eye anchors gets the red label and exit 1. Contact sheets are in `evidence/` (private ones in `evidence/_privat/`).
