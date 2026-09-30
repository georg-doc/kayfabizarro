# BACKLOG · Blender MCP lane · 2026-09-30

Georg decides the look and the order. **Owner** = who builds it. **Gate** = what has to happen first.

## Done (sprints, newest first)

| Sprint | Result | Handover |
|---|---|---|
| Animation Intake 06 | 25 clips, catalogue v6 (370), `forwardYawDeg` / `travelYawDeg`, `flightLabSet` | `media/3D_Assets/Animations/KFB_Motion_Library/RETURN_INTAKE_06.md` |
| Fight Sandbox 03 (data 0.3) | facing fix, follow-up re-facing, dust-cloud beat, lying lift, limb and hammer capsules, rig-scaled ring | `skills/chat/workflows/RESIDENT_FIGHT_SANDBOX_03_2026-09-30/` |
| FB Eye Socket + Clay Lids 01 | socket frame + hinge lids, built as a Blender reference; implemented in ToolBox P06 | `skills/chat/workflows/FB_EYE_SOCKET_CLAY_LIDS_01_2026-09-30/` |
| Fight Sandbox 02 | cartoon contact: shapes, knockback, 68 staging entries | `skills/chat/workflows/RESIDENT_FIGHT_SANDBOX_02_2026-09-30/` |
| Fight Sandbox 01 | exact-contact combos (superseded by 02/03) | `skills/chat/workflows/RESIDENT_FIGHT_SANDBOX_01_2026-09-29/` |
| Intake 05, Choreo Lab 01, AN-PERF-01 | packs, choreography rules, gift/march clips | earlier RETURNs in the Motion Library and workflows |

## Next (in this order unless Georg says otherwise)

| # | Item | Owner | Gate |
|---|---|---|---|
| N1 | Apply FIGHT_SANDBOX_03 in the Resident Atlas, then run acceptance 1–8 | Claude Design · Resident | none |
| N2 | Georg's picks: lying lift option (`liftM` / `liftBodyM` / headTuck) and the hammer pop | Georg | N1 |
| N3 | Georg's eye-socket look review in ToolBox P06; then set his values as defaults | Georg → Claude Design · ToolBox | none |
| N4 | **Rigging fixes (Georg 30.09), see R1–R3 below** | Blender MCP lane (analysis, reference) → ToolBox | none |
| N5 | Fight combos 04: boxing exchanges (jab_cross, body_jab_cross, dodging, footwork, taunt_b) and the surprise-uppercut pair alignment | Blender MCP lane | N1 |

## Rigging (Georg 30.09, FrizzleBob Ear Rig v5 in ToolBox P06)

| # | Item | Notes |
|---|---|---|
| R1 | Fit the mouth to the head shape, for all 3 mouths and all animations | The painted mouth `FB_Mouth_Smile` sticks out past the cheek in the ¾ view, and its soft decal edge reads as a grey smudge (P06 RETURN). |
| R2 | Irregular rounding of the clay lid rims | Suspected cause: the deformer or the hinge taper. Needs measurement against the Blender reference. |
| R3 | Make the claymation texture read more clearly (SSOT or tuned) | Knete K2 in P06 is on; the brows read weakly. The itch.io textures are not cleared for GitHub. |

## Backlog (later)

| Item | Notes |
|---|---|
| Rubber ropes that bounce fighters back | Georg 30.09. The ring is already rig-scaled in 0.3. |
| A proper hammer-swing clip | Next Mixamo intake: an overhead or great-weapon swing. |
| Surf clip for the flight lab | No surfing clip in the library; `skateboarding_c` is the stand-in. |
| Flight lab: banking and barrel roll on the travel-globe card backside | Studio / Animation Lab, with deformers and posing, starting from `flightLabSet`. |
| Shoulder throw for Raider pairs and mixed sizes | Today only Brute vs Brute, otherwise the dust cloud. |
| New fight clips (shove, tackle, body slam) | After Georg's Sandbox verdicts. |
| Brute hitting Raider high | Punches, kicks and the hammer miss above. Idea: crouch or lean variants. |
| `brow.turn` follow (29° ≈ 0.64) | Georg's call. |
| Repo-wide `facingYawDeg` consumer check | See HANDOVER open item 2. |

## Asset intake to evaluate (Georg 30.09; in Dropbox `BLENDER MCP/_inbox`, not on GitHub yet)

| Item | Where | Licence (as stated by the source) | Evaluate for | Then |
|---|---|---|---|---|
| Screaming Brain Studios **Tiny Texture Pack 1, 2, 3** (240 textures × 3 sizes = 720) | `_inbox/Textures/` (zip/rar, several sizes; https://screamingbrainstudios.itch.io/tiny-texture-pack-3, plus packs 1 and 2) | CC0 / public domain (itch page); check the licence file inside the archives | Clay/stylised surfaces for props, terrain, the track kit, and the ToolBox clay look (R3) | Unpack; dedupe across sizes (keep one size per use, check the GitHub folder limits: < 100 files and < 25 MB per upload); add an asset-registry entry; push to `media/` |
| Atomic Realm **Modular Roads · Base** (free: 27 models + source .blend; full pack $5) | `_inbox/[FREE] Modular Roads - Base/` (https://atomicrealm.itch.io/modular-roads) | Read the licence in the download or on the itch page before any push | Template for, or a replacement of parts of, our track/road kit (Track Core / RKIT): piece grammar, sockets, dimensions against our deck and kerb rules | Blender check of pieces and scale against the Track Core contract; decide template vs. replacement vs. buying the full pack (Georg) |
