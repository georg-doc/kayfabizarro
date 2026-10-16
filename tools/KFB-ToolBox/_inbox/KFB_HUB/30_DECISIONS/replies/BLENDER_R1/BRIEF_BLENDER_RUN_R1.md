# Briefing · Blender run R1 · alien repair, Orc eyes, FrizzleBob Meshy ears, expressive appendages

WS0 Blender MCP run (Claude Code on Georg's Mac) · planned 17.10.2026 · V-336, V-338.
Since V-336, structural figure work (topology, sockets, anchors, bone rest pose, mesh separation, rigging, Frankensteining) is done here in Blender, **before** anything goes into the ToolBox. The ToolBox (WSA work) only integrates and checks. No runtime mesh hacks anywhere.

## 0. Guard rails (read first)
- Blender only headless (`-b`) with a watchdog/time limit per job; ≥ 40 GB free before starting (`df -h ~`), check swap. One heavy job at a time. (A Q-check once took Blender to 71 GB and filled the disk.)
- Never touch `~/Dropbox/CLAUDE/KFB Open World/`, never port 5180, never stop Lab 5192.
- Keep bone names, hierarchy, skinning, rest pose and morph targets unless the task says otherwise. No clips added or changed.
- Each output: new GLB next to the old one (never overwrite), structure report (hierarchy, bones, morphs, tri count), front + 3/4 proof images. I look at every image myself before anything reaches Georg.
- GitHub: new branch `assets/kfb-blender-run-r1-2026-10-17`, plumbing commits, guard against an empty commit hash before every push.

## A · Lady Dory, Lord Hunky, Orc Brute (WSA handoff, binding)
Full task list: `tools/KFB-ToolBox/_handover/V332_ALIEN_HEADPART_RECOVERY_2026-10-16/BLENDER_MCP_HANDOFF.md` on branch `feat/headpart-v332-acceptance-2026-10-16` (with `POSTMORTEM.md`). Inputs: `assets/kfb-alien-figures-toolbox-2026-10-15` @9b1917ad, folder `media/3D_Assets/MeshyModels/alien_figures_toolbox_r1/`; local masters `~/Dropbox/CLAUDE/MeshyModels/_alien_figures_toolbox_r1/`, `_alien_head_parts_r1/`, `_frankenstein_eyes_r1/`.
1. **Lady Dory:** closed, clean oval head; integrate the jagged separate `LadyDory_Mund_Clay` patch into the head surface (it came from WS0's head build – our defect); clean normals; keep the baked socket shell (1.10 R, 58° opening, rolled rim 0.075 R); socket and `KFB_Eye_C_anchor` coaxial and frontal (+Z); keep `KFB_Mouth_anchor`, hierarchy, skin, `neckTaper`.
2. **Lord Hunky:** check against `reference/LordHunky_04_Gesicht_nah.png` / `_08_Ausdruecke.png`; both sockets free of any flap geometry; eye anchors coaxial; stalk rest pose mirror-symmetric (no baked rotation that the dangle must undo – cause of the right-stalk kink).
3. **Orc Brute** (`media/3D_Assets/KayKit_Mystery_Series6/2 - August 2025 - Orc Brute/OrcBrute.glb`): keep mesh mouth, teeth, brows, head, all body parts; identify the two original eyes by hand (no "front symmetric island pair" heuristic) and either remove them with clean closed surfaces or export them as `KFB_OriginalEye_L/R`; add `KFB_Eye_L/R_anchor` frontal (+Z); no FrizzleBob hair, no decal mouth.
Proofs exactly as listed in the handoff (Dory without decal and with GPT A `closed`; eyes open/half/closed; Hunky stalks at rest and after a head turn; Orc with full teeth).

## B · FrizzleBob ears from the Meshy model (variant, Georg 16.10.)
Georg likes the ears of the Meshy FrizzleBob: their shape, and that one ear has a **bitten-out corner** at the tip (he always wanted that for FB). See `replies/BLENDER_R1/ref/fb_meshy_ears_head.jpg` (in that render the bite is on the ear on the viewer's right).
- Donor: `~/Dropbox/CLAUDE/MeshyModels/FrizzleBob_Meshy_01_YellowClayRabbitBallHands.glb` (27.8 MB, 1.90 tall; rigged biped FBX in `Meshy_AI_YellowClayRabbitBallH_biped/`).
- Target: current FrizzleBob v5b `tools/KFB-ToolBox/ear-rig/glb/FB_TEMPLATE_LOOK_v5b.glb` at commit `93abbf22d14335e517cac75cc79bf2022af45ee3` (Rig_Medium + ear rig, scale A 0.616381042 m/unit).
- **B1 ears:** cut the two Meshy ears, retopologise to a clean, light mesh (keep the inner groove and the bite), fit them onto FB v5b's ear sockets, skin them to FB's existing ear bone chain (same names, ≥ 3 bones per ear so they can bend and flop). Colour = FB's clay yellow, no Meshy texture seams. Output `FB_TEMPLATE_LOOK_v5c_meshyears.glb`.
- **B2 head (optional, only if B1 is clean):** a second variant with the Meshy head's basic form (round head + hair tuft) on FB v5b, keeping every face contract: eye anchors, mouth anchor, brow positions, ear sockets, head bone. Output `FB_TEMPLATE_LOOK_v5c_meshyhead.glb`. If any anchor cannot stay coaxial, stop and report instead of forcing it.
- Proof: v5b | v5c side by side, front, 3/4, side, plus ears bent forward/back by ±40° on the bones (no tearing at the root).
- v5b stays the default until Georg picks a variant.

## C · Expressive appendages – step 1 (architecture, Georg 16.10.)
Ears, antennae and eye stalks are future **actors**: they will show surprise, joy, doubt etc. inside the expression choreography (posture, gesture, eyes, asymmetric brows; see `replies/CONCEPTS_FLUFF_MINIGAMES_R1/source/KFB_GAME_BIGGER_PICTURE_REFERENCE_2026-10-04.md` "…ears as ACTORS"). Step 1 now is only the groundwork:
1. **Material stiffness per type** (different for ears, antennae, eye stalks). Start values from what already works (ear-dangle.v1.js):
   | type | stiffness | damping | maxDeg | feel |
   |---|---|---|---|---|
   | `ear` (FB, 3 bones) | 60 / 38 / 24 | 7 / 5 / 3.5 | 40 / 65 / 80 | soft, floppy tip |
   | `antenna` (Dory) | 26 | 3.2 | 32 | springy, whippy |
   | `eyestalk` (Hunky, Dory) | 45 | 5.5 | 18 | firmer, the eye stays readable |
2. **Blender part (this run):** every appendage gets a clean bone chain with consistent names (`ear.l/r.01–03`, `antenna.l/r.01–02`, `eyestalk.l/r/c.01–02`), rest pose straight and symmetric, root weights soft so a bend never tears the mesh.
3. **Recipe/ToolBox part (later, WSA work, after this run returns):** each `dangle.parts[]` entry carries `type: ear | antenna | eyestalk` and `side`; the ToolBox reads one profile table by type (values above) and lets Georg tune per figure. Later the same parts get named expression poses (perk, droop, flick, twitch, asymmetric) that the choreography layer (V-298) can call. Not in this run.

## D · Order and report
A (Dory → Hunky → Orc) → B1 → C2 → B2 if time. Report in German into `replies/WS0_BLENDER_RUN_R1_REPORT.md` with paths, commit, numbers and the proof images; Hub entries only after I have checked every image.
