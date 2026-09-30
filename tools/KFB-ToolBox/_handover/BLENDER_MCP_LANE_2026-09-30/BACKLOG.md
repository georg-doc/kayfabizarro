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
| R1 | Fit the mouth to the head shape, for all 3 mouths and all animations | **Brief delivered:** `skills/chat/workflows/FB_MOUTH_FIT_01_2026-09-30/`. The model mouth is a flat card that PartRig moves rigidly; its corners float up to 17.8 cm off the skin. Fix: conform it to the skin after each placement change. Next: ToolBox implements, then Georg judges. |
| R2 | Irregular rounding of the clay lid rims | Suspected cause: the deformer or the hinge taper. Needs measurement against the Blender reference. |
| R3 | Make the claymation texture read more clearly (SSOT or tuned) | Knete K2 in P06 is on; the brows read weakly. The itch.io textures are not cleared for GitHub. |
| R2+ | **FB-EYES-LIDS-02 · brief delivered:** `skills/chat/workflows/FB_EYES_LIDS_02_2026-09-30/`. Next: ToolBox implements (acceptance 1–9), then Georg judges the four combinations. | Deliverable: Blender reference + ToolBox brief. (a) Eye seat `surface` becomes the default; it already re-seats the eye along the head normal when the eye is moved outward, so it fits other head shapes; `turnL/turnR` become one mirrored `turn` offset plus optional per-eye fine tune; optional brow follow. (b) Lids: hinge becomes the default. (c) Keep the sliding "two half-sphere caps" mechanism as `mech: 'slide'`, rebuilt cleanly on the same socket frame (the rim is a constant-latitude line, no S-bend or kink at the corners; opening is a band with parallel edges; gives a different expression for other characters). (d) Lid edge profile as a separate field, independent of the mechanism: `lip: 'round'` (default, FrizzleBob) or `'cut'` (thick claymation lid with a hard, slightly chamfered edge, Wallace & Gromit style). Build and document all four combinations now; use hinge + round today. |
| R4 | **Floppy ears · brief delivered:** `skills/chat/workflows/FB_EARS_FLOPPY_01_2026-09-30/` (wind wired, gravity dead zone `sagFrom`, idle `bob`, presets Perky / Floppy / Rag). Next: Animation Lab + ToolBox implement (acceptance 1–6), then Georg picks the preset. | Georg's ears are on the Floppy preset (dangle 1.5), but `gravity` = 0 (the "cartoon stiff" default), so the ears always spring back to their rest pose relative to the head and never flop forward when he bends over. Idle bobbing only comes from body acceleration, which is tiny in idle. The wind/flutter factor exists, but ears only flutter if the scene feeds the travel velocity (racer: vehicle speed) into `ear-dangle.v1`: write that as an input contract. Plan: Blender check on the real model (bend forward, idle, wind), then three fixed presets (stiff / floppy / wind) with start values instead of free slider tuning. |
| R5 | **Brows: stroke brows become legacy; tube brows become the standard** | Georg 30.09. The older brows follow the KFB ink-outline stroke; their stroke taper is not mirrored per side, so the right brow always comes out smaller and does not match the thick left one (fix: taper inner → outer on both sides, mirrored). Declare stroke brows (and stroke beards) legacy. Standard: one parametric 3D tube (spine curve + radius profile + cross-section squash + rounded caps), like the current block brows. The same tube covers block brows (FrizzleBob), fine brows (e.g. female characters, small radius) and bushy brows, and conforms to the skin like the mouth (FB-MOUTH-FIT-01). |
| R6 | Beards (later, not now) | Stroke beards become legacy. New beards are modelled volumes (walrus moustache etc.), taken from good existing character references and restyled to our look, not a bar stroke. |
| R7 | **One rigging system for all characters** (extension step) | Georg 30.09: bring the animated KFB face (KFB googly eyes as signature eyes, animated tube brows, rig mouth) to the KayKit characters, residents and legacy characters. Catch: KayKit faces are painted into the head texture (black pupils with a highlight, static brows and mouth). Each character first needs a "blank face" texture variant with the painted face removed, which is the main per-character cost. Proposal: opt-in per character (`face: 'native' | 'kfb'`), pilot on 2–3 characters, then roll out. Keep the native painted faces available so not everyone looks the same. |

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
| Screaming Brain Studios **Tiny Texture Pack 1, 2, 3** (240 textures × 3 sizes = 720) | `_inbox/Textures/` (zip/rar, several sizes; https://screamingbrainstudios.itch.io/tiny-texture-pack-3, plus packs 1 and 2) | CC0 / public domain (itch page); check the licence file inside the archives | Clay/stylised surfaces for props, terrain, the track kit, and the ToolBox clay look (R3) | **Georg 30.09: prefer the smaller sizes (performance).** Unpack; dedupe across sizes (keep one size per use, check the GitHub folder limits: < 100 files and < 25 MB per upload); add an asset-registry entry; push to `media/` |
| Atomic Realm **Modular Roads · Base** (free: 27 models + source .blend; full pack $5) | `_inbox/[FREE] Modular Roads - Base/` (https://atomicrealm.itch.io/modular-roads) | Read the licence in the download or on the itch page before any push | **Georg 30.09: worth a look.** Focus: (1) the dirt-track pieces and their dirt-to-grass transition textures (very well solved); (2) track pieces as an addition to our kit, restyled to our look; (3) the road-sign set, for the satirical Kayfabe driving school with a sign forest to drive around. Also: piece grammar, sockets and dimensions checked against our deck and kerb rules (Track Core / RKIT) | Blender check of pieces and scale against the Track Core contract; decide template vs. replacement vs. buying the full pack (Georg) |
