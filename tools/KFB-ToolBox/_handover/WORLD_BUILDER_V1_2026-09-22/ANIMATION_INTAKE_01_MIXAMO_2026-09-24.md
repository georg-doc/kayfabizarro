# KFB Animation Intake 01 · Mixamo → catalog → Animation Lab v2 · 2026-09-24

Status: **DECIDED BY GEORG 2026-09-24** (storage rule §2 accepted)
Georg: the Mixamo clips fit very well and are usable almost 1:1, incl. a differentiated climb (over the edge, then on top). Take them all in, catalogue them, and make them usable in the new ToolBox so they can be used directly in the Claude Design WorldBuilder project.

## 1 · Source

Dropbox (private, stays the raw archive):
`/CLAUDE/Frizzlebob fractal almanac BRIEFING anchor v2/3D TableDiorama KFB + PET Editor + PDF VIewer/3D ASSETS/BLENDER MCP/_inbox/`

33 FBX, ~30 MB:

| Group | Files |
|---|---|
| Locomotion | Walk Backward, Run Forward, Run Backward, Sad Walk |
| Climb | Climbing, Climbing (1), Climbing To Top |
| Idle / mood | Breathing Idle (×2), Happy Idle, Sad Idle, Defeat Idle, Injured Idle, Kneeling Idle, Ninja Idle, Orc Idle, Laughing, Rejected |
| Dance | Hip Hop Dancing, Locking Hip Hop, Slide Hip Hop, Step Hip Hop, Wave Hip Hop, House Dancing (×2), Samba Dancing, Chicken Dance, ORC BRUTE Thriller Part 3 |
| Music | Guitar Playing (×3), Playing Drums |
| Action | Fireball |

Duplicates "(1)/(2)" are variants until measured otherwise; keep all, mark the best one.

## 2 · Storage rule (the public/private question)

Mixamo terms: clips may be used royalty-free inside finished games; the **raw files** may not be redistributed as assets. So:

- **Raw FBX: never on GitHub.** They stay in Dropbox.
- **Runtime clips** (retargeted onto KayKit Rig_Medium / Rig_Large, baked into KFB GLB animation libraries): live in the public repo as part of the game at
  `media/3D_Assets/Animations/KFB_Motion_Library/` with a `NOTICE.md`: "Mixamo-derived motion, retargeted for Kayfabizarro; runtime part of the game; not licensed for reuse or redistribution."
- No "Mixamo pack" framing, no download page, no README inviting reuse.
- Keeps everything readable for Claude, Claude Design, ChatGPT and jsDelivr; no private-repo barrier.

## 2b · Step 0 · Eyes on by default

Georg: before the animation work, every character gets its default eye rig.

- Eyes are a runtime layer (EyeRig v6 + FaceHost), not baked in Blender. Owner/tool: KFB Batch EyeRig Atlas `kfb-hub/stage/toolbox/eye-rig-batch/` (PR #104).
- Profiles to consume: `data/rig-medium-default.v0.json` (Medium class default, 27 actors), `data/rig-large-reviewed.v1.json` (4 reviewed Large), `data/rig-legacy-default.v0.json` + `rig-legacy-auto.v1.json` + `rig-legacy-heads.v0.json` (17 Legacy heads).
- **Legacy page exists but is not reviewable yet** (`kfb-hub/stage/toolbox/eye-rig-batch/legacy/`, checked 24.09 in Chrome): it opens head-only with the painted source eyes, shows `0/17 mounted`, toolbar labels are unreadable (dark on dark); eyes appear only after pressing "Measure + mount EyeRig v6". Only the 17 Dungeon-Pack heads are in it.
- **Legacy completion slice (browser, not Blender)** before Georg reviews:
  1. eyes mounted automatically on load; readable toolbar;
  2. full figures, not heads (Dungeon kit via the existing `legacyAssemble()` in `tools/resident_atlas_s6/lib/atlas.js`, Body/Head/armLeft/armRight on `LEGACY_RIG`);
  3. all Legacy characters in the roster (`media/3D_Assets/KayKit Legacy/`, intake `KAYKIT_LEGACY_INTAKE_2026-09-18.json`):
     - **Dungeon Pack 1.0 = the only modular kit** (heads/bodies/arms swappable; mini versions of current characters) → assemble via `legacyAssemble()`;
     - **complete characters, not kits**: Legacy Character Pack – Skeletons 1.0, Spooktober 1.1 (Jack, Witch), Orc Warband – legacy → load as whole figures, no part swapping;
  4. **head-based scale**: calibrate each Legacy figure so its head matches the Rig_Medium head size (the Warband orcs currently read too big because the head is not the scale basis); store the factor per figure, never edit the source GLTF;
  5. then Georg reviews once and sets the Legacy default.
- Animation Lab v2 and WorldBuilder mount each actor with its approved profile by default (eyes on); a toggle may switch them off. No second eye implementation.
- Later, separate slice: eye rigs for vehicles in the ToolBox (same EyeRig owner, vehicle FaceHost).
- Blender contact sheets may stay eyeless; that is expected.

## 3 · Part A · Blender chat (local, Blender MCP)

Reuse the already working retarget path (ORB guitar/dance work, PRs #192/#195; Rig_Medium has 23 bones without `neck`). Do not invent a new retarget.

Per FBX:
1. import, measure (frames, fps, duration, loop yes/no, root motion yes/no, in-place or travelling);
2. retarget to **Rig_Medium** and **Rig_Large** (skip a rig only with a measured reason);
3. name the action `kfb_<group>_<name>_<variant>` (e.g. `kfb_climb_to_top_a`);
4. render a small contact sheet (6 frames) per clip per rig.

Export per rig **one** GLB animation library (armature + actions, no mesh):
`KFB_Motion_Library_Rig_Medium.glb`, `KFB_Motion_Library_Rig_Large.glb`.

Catalogue `KFB_Motion_Library.catalog.json`, schema `kfb.motion-catalog.v1`, one entry per clip:
`id, label_de, group, rigs[], durationSec, fps, loop, rootMotion (in-place | travel), travelMetersPerCycle, contacts (feet/hands where measured), bestVariant (true/false), sourceFbx (file name only), notes`.

Climb gets extra fields: `ledgeHeightM` (measured), `endsOnTop` (true for Climbing To Top) so the world can trigger it at an edge.

Return: the two GLBs + catalogue + contact sheets + `NOTICE.md` → committed to `media/3D_Assets/Animations/KFB_Motion_Library/` (keep under 100 files / 25 MB per folder). One short `RETURN.md` with what was measured.

## 4 · Part B · Animation Lab v2 inside the ToolBox (Claude Design)

Fork, don't rebuild: KayKit Motion Lab v1
`kfb-hub/stage/toolbox/kaykit-motion-lab-v1/` (index.html, lab.mjs; 87/87 public checks; actors FrizzleBob, GothGirl, Black Knight).

Add:
- load `KFB_Motion_Library.catalog.json` + the two library GLBs;
- browse by group, search by name, show best variant first;
- preview any clip on any compatible actor (Medium: FrizzleBob, GothGirl, Orc Raider; Large: Black Knight, Orc Brute);
- play / pause / scrub / speed / loop, crossfade between two clips;
- "in place" vs "travelling" preview (ground grid moves for travelling clips);
- a **Use in WorldBuilder** button that copies the clip id; the WorldBuilder walker reads clips by id from the same catalogue.

Done when Georg can open the lab, find "Climbing To Top", watch it on FrizzleBob and on the Orc Brute, and copy its id.

## 5 · Order

1. Legacy completion slice (§2b), then Georg's one review; Medium/Large eye defaults already exist. Eyes need no Blender batch.
2. Blender chat runs Part A (can start now; independent of Claude Design).
3. Claude Design WorldBuilder v1 walks first with existing KayKit clips; as soon as the catalogue exists, it switches to catalogue ids.
4. Animation Lab v2 (Part B) in the same Claude Design project or right after.

## 6 · Start text for the Blender MCP chat (Part A only)

```
Read georg-doc/kayfabizarro main: tools/KFB-ToolBox/_handover/WORLD_BUILDER_V1_2026-09-22/ANIMATION_INTAKE_01_MIXAMO_2026-09-24.md. Do Part A (§3) only: the 33 Mixamo FBX in Dropbox BLENDER MCP/_inbox → measure, retarget to Rig_Medium and Rig_Large with the retarget path that already worked for the Orc band (PRs #192/#195), export the two KFB_Motion_Library GLBs + catalogue + contact sheets + NOTICE.md, commit to media/3D_Assets/Animations/KFB_Motion_Library/. Raw FBX never go to GitHub. Eyes are not your job (runtime EyeRig). Report per clip one line: name, rigs, loop, in-place/travel. Then stop.
```
