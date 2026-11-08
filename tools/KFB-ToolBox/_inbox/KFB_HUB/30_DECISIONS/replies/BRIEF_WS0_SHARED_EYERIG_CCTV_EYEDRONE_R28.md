# WS0 INTAKE BRIEF · R28 Shared EyeRig CCTV + Propeller Eye Drone
2026-11-01 · Production-ready conceptual handoff, NOT a build request or Game Development Studio seal

**Named owner:** KFB_HUB / 30_DECISIONS/replies conceptual R28; accountable editorial human: **Georg / WS0**. **Existing receiving technical owner** only after WS0 gate: canonical ToolBox EyeRig/FaceHost + source Asset/Prop + WB2 World/Motion + one KFB Audio/VFX. Exact current source branches/consumer must be verified by WS0 rather than assumed.
**Repo:** `georg-doc/kayfabizarro`
**Head branch:** `planning/kfb-game-loop-fluff-economy-r2-2026-10-29`
**Draft PR:** #460; base `docs/kfb-decisions-register-2026-10-11`. **No merge, no Live.**
**Main design SSOT for this conceptual session:** `GAME_LOOP_SHARED_EYERIG_CCTV_EYEDRONE_R28.md`. Supporting canonical design: `GAME_LOOP_SHARED_EYERIG_AGGRO_HEAL_SKYDOME_R26.md`, `GAME_LOOP_SHARED_EYERIG_EXPRESSION_MODIFIERS_R27.md`, `GAME_LOOP_HYPERNORM_CROWD_NEWS_HUD_AUDIO_R24.md`, exact R24–R27 Returns; central Bigger Picture unchanged.

## Product goal
Two surveillance props/characters that are **visually unmistakable KFB** and consume **ONE** canonical EyeRig. An actual source CCTV body rotates pan/tilt while its EyeRig pupil fine-tracks real event targets. A small cartoon flying eye hovers with an actually rotating **top propeller** and uses the same gaze, blink, Goo alert, healing and expression semantics. Both can appear in scenelets, the Kayfabe Mindprison, town/buildings, late MIB orb/sky receivers. No generic UI replacement, separately authored fake eye assembly or new physics/AI/drone runtime. **Natural wing-flapping flight explicitly out of MVP.**

## A. Verified source candidates — do not download/replace blindly
| Family | Exact source | Proof status / next check |
| --- | --- | --- |
| CCTV P0 | `media/3D_Assets/kenney_racing-kit/Models/GLTF format/camera_exclusive.glb` | Source used in historical `KFB Cologne Race Option C-2/lab-v9/cologne-props.v1.js` `buildCCTV`; donor-isolation.html exists; **fresh original 3D shot and source lens region needed**; historical output not published/live |
| CCTV alternative | `media/3D_Assets/KFB/Camera by Kai Fan - 1pI-40LVzWX.glb` | Registry asset only, not established CCTV look; isolate before promoting |
| Rotor P0 | `media/3D_Assets/KFB/Propeller by Poly by Google - 7IXU7duFN7t.glb` | Registry 34,232 B; source source-used by Cologne Race `lab-v9/drive-mods.v1.js` `buildPropeller` with axis/hub measurements. Same file confirmed in Dropbox at `/Mac/Documents/Codex/2026-09-28/hi/work/kayfabizarro-import/media/3D_Assets/KFB/Propeller by Poly by Google - 7IXU7duFN7t.glb` |
| Drone alternative | Dropbox `/Mac/Downloads/VR DRONE by Dave404 - 580fbWUqqbh.glb` | Metadata: 1,023,364 B (2026-10-28); **shape, eye compatibility and license not yet visually inspected**. Use only if helps, do not assume approved |
| Canonical EyeRig | `tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/pet-eye-rig.v6.js` | Verified real EyeRig with eyeFrame, blink/pupil/eyelids; current build expects a valid body/head/FaceHost |
| FaceHost/anchors | `tools/KFB-ToolBox/_inbox/KFB_RESIDENT_ATLAS_SESSION_CUT_2026-10-04_r1/lib/frizzlegraft/anchored-eyes.v1.js` | Existing measured-anchor pattern; sky/orb monocular adapter **not already proven** |

**Dropbox search boundary:** targeted title-only CCTV/camera/security searches did **not** reveal an unambiguous source CCTV GLB, only screenshots, generic cameras and code. Thus start with verified GitHub Kenney source. The user has other collected CCTV models; request precise folder reference **only if needed** for a better alternative after Kenney source comparison.

## B. Work order and evidence gates
### G0 — WS0 EDITORIAL ACK (one current human gate; no consumer work until ACK)
- Read source-linked R26/R27/R28 and current Golden/World/Actor/Prop owner state; explicitly choose **Kenney CCTV + Poly top-propeller EyeDrone** for first **source-isolation comparison**; prefer canonical eye as visible Drone body.
- Confirm CCTV and Drone are **different hosts of the same EyeRig**, neither a new NPC AI nor a Sky system. Winged version **P2/DEFER**.
- Verify whether an actual source CCTV shell retains a recognisable camera silhouette if the lens is replaced with eyeball; don't demand unnatural fit.
- **Result:** written WS0 ACCEPT/TUNE/REJECT with exact receiving owner/branch, no auto-Golden change.

### G1 — SOURCE-OBJECT PROOF (requires G0)
- Render the **unchanged original Kenney camera** alone, actual source geometry front/side/3/4, source pixel/texture, lens location, axes, dimensions. Record exact file SHA and screenshot(s).
- Render **unchanged original Poly propeller** alone; source screenshot, hub/rotational axis and correct physical scale. Crosscheck pre-measured donor `drive-mods.v1.js` rather than rewriting it.
- Optional VR Drone source separately; only show it if source shape, rights and actual mounting improve the preferred character.
- Review licenses/redistribution and visual matching; a successful asset URL load is **not** design proof.
- **Gate:** reviewer can recognize each actual donor in isolation. If Kenney is not a viable eye housing, choose one **existing authentic** alternative; stop rather than author generic fake CCTV.

### G2 — SINGLE EYE HOST PROOF (after actual source isolation)
- Use one canonical EyeRig/FaceHost owner to attach eye to measured CCTV lens; verify genuine lens spatial placement and pan/tilt body gimbal vs pupil fine-look.
- For Drone, use same canonical eye as main visible character + a physically grounded rotor from the measured source, with gentle hover/bob/yaw; actual World/Motion owner drives position, propeller donor drives carrier-local animation only.
- **Technical seam:** `Host (worldTransform, sourceHeadOrLensAnchor, yaw/pitch limits) + EyeRig (eyeFrame, gaze, eyelids, expressions)`. A monocular giant eye requires an approved profile; do not fork the eye code. No private mesh-child traversal.
- **Gate:** side-by-side one CCTV + one Drone source render; original geometry visible, gaze follows a target; target behind the camera produces host turn and only then pupil fine-track.

### G3 — THE SMALLEST SOURCE-BACKED SCENE (after G2)
- A three-beat ChatterBox Scenelet: camera watches NPC speaker → turns to pointed-at **real source Card/prop** → returns; listener need not act. **No global scanning brain**.
- A short EyeDrone route: hover stationary → yaw to visible object → short forward drift → return; rotor start/stop/idle under existing Audio owner. Compare actual actor/eye source on-screen.
- One R26 goo/aggro look; one R27 X or spiral only if existing EyeRig source-owner has first rendered/accepted it. Do not claim that metadata `fx:'spiral'` equals finished visual.
- **Gate:** short real frames/video from source object, CPU/GPU frame-time sampled, mobile/reduced-motion accessibility, proper unloading and no duplicate scenegraph/mixers.

### G4 — FUTURE WORLD CONSUMER / NOT PART OF THIS R28 DOCS SLICE
- Only after G0–G3, authorized actual WB2 owner may place a CCTV into prison/hypernorm building and a small drone into existing patrol/Scenelet/POI. World owns movement/collisions/IDs, Combat owns threat, Resident/ChatterBox owns behaviors, EyeRig presents and Audio owns sound.
- If public human acceptance needed later, **use named product acceptance surface**. For an explicitly formal Cloudflare/public Stage test only, route direct `https://kayfabizarro.pages.dev/…` from the KFB Hub and open it at the exact expected revision; no GitHub Pages/githack/local success claim.
- Wings/flapping/swarm/air combat/fully generated surveillance media stay backlog.

## C. Acceptance checks (actual counts must be recorded by future owner)
| Check | What passes |
| --- | --- |
| Source identity | Original camera and rotor clearly visible alone with exact hash/geometry/rights |
| Eye owner | One EyeRig v6 source, full lid/blink/pupil control, host mount measured |
| Pan/tilt and gaze | CCTV turns physically first when needed, pupils then fine-adjust; no silent clipping |
| Hover/rotor | Physical top prop actually spins; eye stays oriented while body hover/yaw updates |
| State isolation | Goo/aggro and heal only present real states; no cross-instance shared material leak |
| Performance | no second animation loop, no constant per-frame target reasoning, observable frame budget |
| Sound & access | one mixer, soft rotor/servo sound, accessible mute and reduced-motion |
| Scenelet integration | source Card gesture causes one bounded targeted look, then returns to idle |
| Owner/reload | one WB2 world writer, no persistent phantom drones, future save/restore when integrated |

**Current counts:** 0 executed runtime tests / 0 browser tests / 0 user playtests / 0 3D source-isolated screenshot checks / 0 audio auditions. Repository text source audits and exact GitHub readbacks are document evidence, NOT these tests.

## D. Technical risks / stop rules
- Exact existing current camera/sky/scene host might not match historical Cologne Race source; **verify current owner and branch before any copy**.
- Source `camera_exclusive.glb` may be race track camera, not the style of a cute CCTV; source proof decides.
- Native EyeRig is built to fit a head and **two eyes**; the single large EyeDrone and camera lens need measured host/monocular adaptation by canonical owner. Do not hide that complexity behind generic objects.
- Source Poly propeller rotor donor can be reused; don't let it write World velocity or replace flight controls. No wing simulation in MVP.
- Dave404/Poly/other sources require exact rights audit for redistribution before Stage.
- **Two non-improving repair passes on the same noncritical seam:** stop and preserve seam evidence; continue parent creative outcome or export failure recovery if production-critical according to current Production Guard. Do not silently turn the entire concept into a second app.

## E. Handoff and continuity
- R28 concept and this WS0 briefing remain on the **same** Draft PR #460, preserving R2–R8 / R12–R27 history and without inventing R9–R11 branch content.
- Write an additive changelog and a complete R28 Return with final repo/branch/PR/head, sources and 0-performed test counts. No Hub/router edit for routine concept-only work, and no publication claim.
- **Only one next WS0 gate:** accept/tune/reject **Kenney CCTV and Poly top-rotor EyeDrone as two source-backed shared EyeRig hosts**, authorize G1 **source-object isolation** and name the current receiving owner/branch. Don't start G2–G4 until the proper prior gate is evidenced.
