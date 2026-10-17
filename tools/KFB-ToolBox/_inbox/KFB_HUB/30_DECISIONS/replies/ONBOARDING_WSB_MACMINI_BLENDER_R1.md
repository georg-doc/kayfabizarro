# Onboarding WSB · Mac mini Blender workstation (V-384) · 17.10.2026

You are **WSB**, a Claude Code session on Georg's Mac mini with a free Blender instance and the Blender MCP. You build and check 3D assets for KFB (Kayfabizarro, a cartoon claymation driving game in three.js). WS0 (steering, MacBook) gives the jobs, reviews them and pushes to GitHub. WS1 builds the game. Georg is creative lead: he dictates, gives PASS/TUNE/FAIL, and cannot run terminals or servers.

## 0 · Check first (5 minutes, record in RETURN)
1. Blender runs with the MCP add-on: list scene objects.
2. Dropbox is synced: `~/Dropbox/CLAUDE/KFB_HUB/` exists, and `30_DECISIONS/DECISIONS.md` is from today.
3. Disk: `df -h ~`. Start heavy work only with **≥ 40 GB free**. Check swap with `sysctl vm.swapusage`.
4. Assets: read-only from Dropbox, or `~/Developer/kayfabizarro-publish` if that clone exists there. Otherwise WS0 provides the files in the job folder.

## 0b · Tools
- **Free 3D asset search:** MCP server `3d-assets` comes from the project file `~/Dropbox/CLAUDE/.mcp.json` (confirm once at session start, then call `search_assets`, `get_asset`, and download the bundle). Fallback: REST https://3d.shep.bot. Do not use the ChatGPT side. Prefer CC0, record the licence, and run external finds through Asset Library intake (V-404).

## 1 · Read first
- **Tier 0 (always):** figures only from their figure card, with KFB eye rig + clay (V-391) · light and shadow only from the stage light module (V-392; until it exists, your fluff stage, no back light) · known failure again → stop and report to WS0.
- **Your blocks** from `replies/KNOWN_FAILURES.md`: [Figure] and [Stage/light]. Read only these two.
- `KFB_HUB/30_DECISIONS/START_HERE_STEERING.md` and `ARCHITECTURE_R1.md`
- in `DECISIONS.md`: V-336 (figures in Blender, no runtime mesh hacks), V-346 (proofs always with clay material), V-369 (rounded cut edges), V-353 (aliens), V-359 and V-365 (duet)
- `replies/BLENDER_R1/BRIEF_BLENDER_RUN_R1.md`, the previous run, for style and guard rails

## 2 · Guard rails
- **Memory:** heavy checks (Q checks, batch exports, render loops) run **headless** with a watchdog: ≤ 600 s and ≤ 16 GB RAM per process. Blender once grew to 71 GB and filled the disk through swap. Kill only your own PIDs. Light modelling work may run in the MCP instance.
- **Proofs:** always with the KFB clay material (K1/H0 `clay-material.v8` + `clay-profiles.v2`, profile `figure` / `vehicle` / `prop`; three.js adapter in `replies/CLAUDE_DESIGN_STAGE_LIVE_R1/vendor/k1/`, used for proofs the same way as in Blender run R1 (branch `assets/kfb-blender-run-r1-2026-10-16`, see its RETURN)). Never plain KayKit/Meshy materials. 1920 px, clean image without overlays (V-383).
- **Write only to** `~/Dropbox/CLAUDE/KFB_HUB/50_BLENDER/<job-id>/`: GLB, renders, `RETURN.md`, scripts. No git push. WS0 checks and pushes.
- Never touch `~/Dropbox/CLAUDE/KFB Open World/`. Never use port 5180. Don't kill Lab 5192. No credentials. Nothing purchased or private goes into public files. No license boilerplate.
- **World logic first:** every new object needs a one-line story (who, what, why). Keep it organic and claymation, no hard cuts.
- **RETURN.md per job:** what was done, measured values, file list, open points, and an honest NOT_RUN for anything not tested.

## 3 · Job queue (in order; each job is its own folder)
| ID | Job | Why | Output |
|---|---|---|---|
| **B1** | **Motion Library on the KayKit mummies:** apply `media/3D_Assets/Animations/KFB_Motion_Library/KFB_Motion_Library_Rig_Medium.glb` to `Mummy_A`/`Mummy_B` (Rig_Medium; **with KFB eye rig**: `Mummy_A/B_NoEyes.glb` from EYE-CLEANUP-01 + EyeRig v6; never the raw KayKit mummies). The clips are `kfb_dance_hip_hop_a`, `kfb_dance_slide_hip_hop_a`, `kfb_dance_wave_hip_hop_a`, `kfb_dance_house_a` and `kfb_idle_happy_a`. Check for broken limbs, sliding feet and penetration. Measure each clip's natural tempo and give the playback factor for 118 BPM. | Performance duet P1; the data is ready, but nobody has checked the clips on the mummies | contact sheet with 4 frames per clip, both mummies with clay; `tempo.json` |
| **B2** | **Fluff anchors on KayKit trees:** for every tree in `KayKit_Forest_Nature_Pack_1.0_FREE` (including snow variants), 6–12 anchor points on the outside of the canopy where clay balls can hang. Use the surface normal and leave space. | Slice 1 fluff harvest (V-368) | `kaykit-tree-fluff-anchors.v1.json` (model → points + normals); proof with six coloured balls in the V-292 colours, with clay |
| **B3** | **Rounded cut edges for kit dioramas:** a recipe (Blender script) that gives KayKit/Tiny Treats pieces soft, ruin-like clay edges at cuts and open sides (bevel, then a gentle shrink-wrap or clay-blob cap). First example: a half-open satire snack bar from the KayKit clown (Mystery Series 6), City Builder Bits and Tiny Treats. | Landmarks without Meshy (V-369) | recipe script + GLB + 3 renders (total, near cut edge, next to a Meshy landmark for comparison) |
| **B4** | **Chests with eyes:** KayKit Dungeon Pack chests (common, rare, mimic). Lid pivot set correctly, `KFB_Eye_L/R_anchor` in front (+Z) on the lid, mouth zone marked. Keep the mimic teeth. | Slice 2 (V-369, idea: runaway mimic chest) | GLBs with anchors + proof with clay |
| **B5** | **Space Ranger head turn:** analyse in `media/3D_Assets/KayKit_Mystery_Series6/7 - January 2024 - Space Ranger/SOURCE/SpaceRanger_Source.blend` how the Space Ranger turns its head on the collar (bones, pivot, limits). Write a 1:1 transfer recipe for the aliens. | Aliens r4 TUNE (V-353) | analysis md + bone/pivot table + 3-angle render |
| B6 (later) | **Light reference for Light Model R2:** stage + billboard + FrizzleBob at day, gold and night as a target image, built on R2 after WS0's audit | V-382 | only when WS0 assigns it |

## 4 · Report
After each job: `RETURN.md` in the job folder, plus a one-line status in `50_BLENDER/STATUS.md` (newest on top). WS0 reads the Dropbox folder. Ask questions to WS0 in STATUS.md, then continue with the next independent job (V-375).


## B7 · Jungle computer (Meshy, Georg 17.10., V-397), new job, priority after B1 re-render
Source: `~/Dropbox/CLAUDE/MeshyModels/Meshy_AI_jungle_computer_diora_1017014450_image-to-3d-texture.glb` (≈ 7.0 M triangles, far too heavy).
1. **Browser version** the way the Meshy stages were done: source isolation, decimated to ≤ 80 k triangles (LOD1 ≤ 25 k), texture kept, base on y = 0, scale in WS0 metres; `footprint` + `edgePalette` as in `kfb.stage-edges/1`.
2. **Find the monitor screen:** rectangle (centre, normal, width/height, aspect ratio) as `kfb_screen_frame` / `kfb_screen_slot` anchors, as for Goblin Bank. Compare with the card format.
3. **Two frame variants on the screen, built in Blender with clay** (V-369, rounded edges):
   - **A: stone frame** in the stone colour of the monitor housing, with cracks and joints. Two vertical bars fill the screen to card format, set in front of the monitor like an artefact.
   - **B: wooden frame**, 4 cartoon-carpentered beams, slightly overhanging, rounded, wood tone of the trees with a light grain, lashed with rope. Story: the devotees built a holder for the sacred card.
   - In both, the card or a Hypernormalisation screen goes in the slot behind it (mask).
   - Two renders each: wide and close.
4. **Eye anchors for the computer** (it is a character, a diegetic meta-artefact): suggestion is the red round lens on the right as one big eye (cyclops). Alternatively the stone mask above the monitor with two eyes. Set `KFB_Eye_*_anchor` frontal and render with EyeRig v6 + clay.
Output in `50_BLENDER/B7/` + RETURN. WS0 then puts A against B in the Hub as a one-click question for Georg.

## B9 · Stone IDs for colour flecks (Georg 17.10., V-406), runs inside the B8 pass
Per diorama GLB (amphitheatre first, then the Meshy stages), add a second vertex colour attribute **`COLOR_1` (RGBA8)**:
- **R + G = stone/part ID** (16 bit: R = low byte, G = high byte). Each recognisable stone or part island gets its own ID, uniformly distributed (no gradient across neighbours).
- **B = role**: 0 ground · 1 towers/arches · 2 tiers/steps · 3 rock · 4 frame · 5 accent/props.
- **A = 255.**
Record the channels in the stage descriptor (`kfb.stage-descriptor/1`, field `vertexChannels: {COLOR_1: {id: "RG16", role: "B"}}`). Detect islands from the original mesh (connectivity + edge creases/UV islands), not from the decimated mesh. Proof: ID map rendered in false colour plus role map. WS1 then picks per ID in the speckle module (V-403) the role colour or a fleck colour, seedable and organic.

## B10 · Brain-Cyborg body (V-349/V-409), after B5 (Space Ranger head turn)
Build the brain head in the Space Ranger collar: brain from `~/Dropbox/CLAUDE/MeshyModels/Meshy Community/bodyparts3d-brain-review.glb` (BodyParts3D, **CC BY-SA**, so record attribution and licence in the RETURN and the card), darker brain skin tone in clay, seated exactly in the collar following the B5 recipe (no neck, collar visible). Eye sockets for E2 lids (V-348) with `KFB_Eye_*_anchor` facing front, brow anchors, and a mouth zone for the first new cartoon mouth. Output: GLB + `brain_cyborg.figure.json` draft + clay proofs front/¾/side. Then WSA adds it to ToolBox-Studio.

## B11 · Toy-soldier cops "Ordnungshüter" (Georg 17.10., V-412), after B10
**Donors (use what works):** KayKit Mystery Series 6 "Toy Soldier" (`media/3D_Assets/KayKit_Mystery_Series6/6 - December 2025 - Toy Soldier/`, including `ToySoldier_Rifle` and `_Trumpet`), the eye-ready base `ToySoldier_NoEyes.glb` (Lab `public/assets/figures-b2/toysoldier/`, from EYE-CLEANUP), and the voice cast already exists (toy-soldier, am_eric).
**Story (confirmed by Georg 17.10.):** wind-up toy-soldier cops, the clay world's patrol for "order". They march fixed routes, salute rules nobody explains, and their rank is the number on their cap. Satire on kayfabe order.
**Design:**
- **Classic US police cap** (peaked cap) with a **gold star** and a **number in the middle** (rank or instance 1–n). The number is a variant parameter (texture/decal or a separate number mesh), set in the figure card as `variant.rank`.
- **Uniform:** blue-black police uniform mixed with **nutcracker design** (gold buttons, frogging and epaulettes, small red or gold accents). Clay look, few big shapes.
- **Rifle shouldered** (rifle from the pack, attached to the shoulder/hand bone).
- Eyes: KFB eye rig on the NoEyes base (anchors). Mouth and moustache only as the card specifies; remove only the eyes (F2).
**Animation:** marching/patrolling with the rifle shouldered: stiff legs, one arm swinging, a short halt and salute. First check the Motion Library and KayKit clips. If nothing fits, build one marching clip in Blender (Rig_Medium, loopable) and a salute clip.
**Output:** GLB (+ rank variants 1–3 as proof), `toy_soldier_cop.figure.json` draft, clay proofs front/¾/side, a short march clip render. Then WSA adds them to ToolBox-Studio.

## B12 · "Man in Black" (Georg 17.10., V-413), after B11
**Build:** in Blender (V-336, no runtime mesh hacks; the Frankensteining Studio is retired). Base is a KayKit Rig_Medium body (Adventurers 2.0, `media/3D_Assets/KayKit_Adventurers_2.0_FREE/Characters/`; the head/body pick goes in the RETURN). On top, modelled as clay with few big shapes: a **black suit** (jacket, trousers), a **white shirt** (visible collar and front), a **dark tie**, and **sunglasses 1:1 from the KayKit Driver** (`media/3D_Assets/KayKit_Mystery_Series6/2 - August 2023 - Driver/character/gltf/Driver.glb`) as a removable variant. With glasses on, the KFB eyes are hidden or sit deeper in the head so nothing pokes through (check this in the RETURN).
**Suit as an outfit kit (V-414), first for Rig_Medium** (Georg 17.10.: Medium first, a Large version later): build jacket, shirt, tie and trousers as separate, swappable parts with variant parameters, so the same suit also serves bankers (pinstripe, pocket square), politicians (lapel pin/flag, red tie), CEOs (open collar or bright tie). A Rig_Large version comes later (not for 4GTN for now). Variant list in the figure card.
Eyes: KFB eye rig (anchors). The sunglasses variant may cover the eyes; the eye rig stays underneath for close-ups without glasses.
**Story (confirmed by Georg 17.10.):** agents of the cover-up. They show up where aliens (Lord Hunky, Lady Dory) or UFO traces appear, and they "erase" what happened (link to the Cosmic Grift deck: UFO File, Majestic 12). Satire on official kayfabe.
**Output:** GLB, `man_in_black.figure.json` draft, clay proofs front/¾/side with and without glasses. Then WSA adds it to ToolBox-Studio.

## B13 · 4GTN twins (Georg 17.10., V-415): no longer a comparison, decided
**4GTN = Utopia CEO**, **4GTN_Forgotten = the twin banished from Utopia**, maker space helper. Allegory: transhumanism vs. co-creation, tragicomic.
- **4GTN (CEO):** source `…/KayKit_Mystery_Series6/7 - January 2026 - 4GTN/4GTN.glb`. A clean, polished upgrade look in clay, **no suit for now** (Georg 17.10.). 4GTN is **Rig_Large**. Neutral style, no samurai stereotype. KFB eye rig anchors (remove only the eyes).
- **4GTN_Forgotten (twin):** `4GTN_Forgotten.glb`. Overgrown, mossy and repaired, keep the nature traces. Eye rig anchors; props for the maker space helper (tool, solder iron or similar from KayKit packs) optional.
- Output: both GLBs, `4gtn_ceo.figure.json` + `4gtn_forgotten.figure.json` drafts, clay proofs front/¾ next to each other ("twin picture"). Then WSA adds them to ToolBox-Studio.

## B14 · Lady Dory: round head oval + repair the lower head (Georg 17.10., V-417), **PRIORITY: before everything else**
Georg's screenshot from ToolBox-Studio: Dory's head oval is not rounded, and the lower head has defective shading and a seam (mouth area / underside). This was already Blender run R1 part A ("closed, clean oval head; integrate the jagged mouth patch into the head surface; clean normals"). It is evidently not fully done in r4.
- Source: `media/3D_Assets/MeshyModels/alien_figures_toolbox_r1/LadyDory_RigMedium.toolbox.r4.glb` (branch `assets/kfb-blender-run-r1-2026-10-16`).
- Make the head a **soft, closed oval** (no flat or dented areas, no facets). Close the **lower head and mouth area seamlessly**: one surface, clean normals, no hard edge, no shading jumps.
- ~~Socket shell to 1.10 R~~ **cancelled (V-420):** the socket shape stays exactly as in r4. Later the socket only moves rigidly backward by d R (d comes from WS0 after Georg chooses).
- Proof with clay: front/¾/side/underside close-up, before vs. after. Output `LadyDory_RigMedium.toolbox.r5.glb` + RETURN.
