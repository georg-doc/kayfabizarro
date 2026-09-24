# NPC-CARD-SPEC-01 · Resident Card Speculation Scene · RETURN

Date: 2026-09-24 · Executor: Claude Design · Status: `CANDIDATE · BROWSER-RENDERED · GEORG VISUAL REVIEW OPEN`
Supersedes the STOP in `NPC-CARD-SPEC-01_SOURCE_RETURN.md` (Georg resolved the two open source questions on 2026-09-24).

## Artifact
- Review: `NPC Card Speculation Scene.dc.html` (host: renderer, lights, floor, camera, card loading)
- Recipe: `npc-card-spec-01/resident-card-speculation.recipe.json` (the thin Resident Scene recipe)
- Runner: `npc-card-spec-01/resident-scene.mjs` → `mountResidentScene({THREE, GLTFLoader, parent, camera, overlay, recipe, getCardCanvas})`
- Tweaks: view `scene | actor-a | actor-b | mouths` (isolation lanes) · variant 0/1 (Triplet pool) · rootX / rootYaw (moves the whole vignette) · hostFloor · showProof
- Host seam: `window.NPCCardSpecScene.seek(t)` replays the beat clock deterministically (review/agents)

## Sources (exact)
**Actor A · "FrizzleBobrick" = FrizzleBob Driver Graft** (Georg, 2026-09-24)
- Reader `tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/graft-mount.v1.js#mountGraft` @ `5650b6c54d8789b20ea80abe857688173d506d3b` (jsDelivr)
- Contract `contracts/kfb-pet-graft-driver.v4.json` (blob f202a1c2), entry `graft-driver`, `animation:'own'`
- Mouth/talk owner: `graft.mouth` = PetMouth v1 (`petstudio-v9/studio-v3/pet-mouth.v1.js`), set male · Eyes: `graft.rig` = EyeRig v6
- Caller override (copy only): `graft.weapon.on=false`

**Actor B · GothGirl** (EYE_RIG_BATCH path, Georg's pick)
- GLB `media/3D_Assets/KayKit_Mystery_Series6/GothGirl/characters/GothGirl.glb` @ 5650b6c · Idle_A from `…/Rig_Medium/Rig_Medium_General.glb`
- Eye cleanup `eye-rig-batch/lib/source-face-cleanup.v1.js` (components 2+3, guard 12) + `kaykit-eye-adapter.v1.js` + `data/gothgirl.seed.json` — branch `toolbox/eye-rig-batch-2026-09-18` (PR #104), copied unchanged into `npc-card-spec-01/donor/eye-rig-batch/`
- Mouth owner: PetMouth v1, params `kfb-pet-gothgirl.json#pets[gothgirl].mouth` (set female), on a facehost re-centred on the face shell (goth-biped.v1 "Falle 2", Dropbox `KFB ToolBox Stage v1/…/goth-biped.v1.js`)
- Source-mouth paint-over: `lab-v6/texclean.js#paintOverRegion`, box from goth-biped `GOTH.mouthBoxLocal`, fill = ring median around the box
- Finding: 2+3 (EYE_RIG_BATCH) and 6+7 (goth-biped) are the same 69-tri eye pair under two orderings. No real conflict.

**Card** — `kfb-viewer.js` v1.1.0 `KayfabizarroViewer.loadDeck().getCardCanvas(0)` · `pdfs/deck_b_dystopia.pdf` + `decks/deck_b_dystopia.json` · card #0 "The Doomsday Clock" · back `frizzlegraft-v1/kfb-card-backside.png`

## Pet Podcast v5 mechanisms reused
- Two presenters ↔ one shared Card object composition
- Gaze rule "rig owns the number, others send impulses": `setGazeFollow + pointTo` once per beat, released after `hold` (gaze.v5 lesson)
- Speech bubbles: `podcast-v5/bubble-shaper.v2.js` (`shapeForBox`, `paintBubble`, `inkPenFor`, `fontOf`) + `bubble-shapes.json` rect/round, ink canon `kfb-ink-canon.js`. Thought beat = the existing `whisper` voice (dashed pen), not a new cloud.
- Speaker turns and talk timing via `mouth.talk(on/off)`, rest mouth via `setRest(emote)`
- Persona and Card commentary seams, as recipe data

## Deliberately NOT reused
Podcast floor/stage/ground stamp, camera director, transcript column (`transcript.v5`), wordmark, microphones, LLM research tooling, pinball/game runtime, PetFace (not present on Graft/KayKit actors).

## Ownership proof (in-scene "Owners" panel)
EyeRig ×2 (one per actor) · PetMouth ×2 · mixer ×2 (graft-biped own, one AnimationMixer on GothGirl) · one bubble drawer · no new renderer, no persistence. Root `resident-scene · …` contains exactly 3 children (A, B, card). No baseplate: the shadow floor belongs to the host.

## Round 2 · 2026-09-24 (Georg feedback)
- GothGirl source mouth: the crescent was modeled geometry (recess). Now flattened in memory with `flattenMouthRecess`, which uses the method of `lab-v4/carlrig.js#flattenRecesses`. The difference: a quadratic surface fitted to the face ring below the nose, instead of Carl's capsule, which does not fit a head. Then texclean with the ring skin tone. The file is untouched.
- Female mouth lower: `mouthOverride.dy` −0.40 → −0.56 (plus lift .10).
- Card: height 0.92 → 1.2 u at 1700 px, centred behind the residents. Residents at x ±1.5 / yaw ±30°, so they overlap its edges.
- Motion: KFB Motion Library Rig_Medium (Dropbox `BLENDER MCP/MOTION_LIB/KFB_Motion_Library_Rig_Medium.glb`, 33 clips, 69 tracks) copied to `npc-card-spec-01/motion/`. One mixer per actor (Graft now `animation:'host'`). Idle = breathing a/b. Talk = `kfb_idle_happy_a` (**stand-in: the library has no talk clip**). Reactions: A laugh → dismiss (Rejected) on the counter, B wistful (Sad Idle) on the thought.

## Visible TUNE items
1. Resolved in round 2 (recess flattened). Check the 3/4 silhouette of the mouth ring.
1b. **Talk clip missing** in the Motion Library. Happy Idle stands in. For short lines, idle↔talk switching may read twitchy.
2. GothGirl mouth `lift` .04 → .10 (recipe `mouthOverride`). At .04 the decal sits behind the real face surface.
3. Two facehosts on GothGirl: the eyes use the head-bone box (seed calibration), the mouth uses the face shell (profile calibration). Reconcile once EYE_RIG_BATCH moves to the face-shell host.
4. GothGirl `zoneMap` recolour (profile) not applied. KayKit texture colours stay.
5. Voice: text-length clock only (no audio). Body: Idle clips only, no speaker gesture clips yet.
6. Gaze amplitude divisor 0.9 rad and actor yaw ±36° set by eye. Pupils saturate on partner looks.
7. Card read size at 1× is small (~140–220 px wide). Inspect (click or button) zooms in.
8. Hidden preview panes park rAF (pdf.js and loop). The host falls back to a timer while hidden. Human review needs a visible tab.

## Next integration gate (one)
Georg reviews the scene in a visible tab (scene + actor-a + actor-b + mouths): **are both mouths/faces accepted as the Resident talk look, including TUNE 1?** Only after that, mount the recipe into one KFB Town / WorldBuilder host through `mountResidentScene`.
