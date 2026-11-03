# KFB Cascade Sphere R8 — 4GTN Rig_Large Boss Encounter and Future Boss Family
**2026-10-28 · GEORG USER IDEA + VERIFIED SOURCE INVENTORY + PROPOSED GAME DESIGN ONLY.**
**Owner:** same existing WS0 KFB_HUB Game Design, Draft PR #435 / planning/kfb-game-feel-comic-motion-ideation-r1-2026-10-19. No new Game/Combat/Camera/Player/Audio/World/Character rig owner. WS1/WS1b only productive R3F host, after actual active source/API confirmation. Keep R1–R7 and one next existing platformer asset/level source gate; optional boss is not an L01 blocker.

## 1. Georg's idea and game design opportunity
- Put the authentic KayKit Mystery Monthly **4GTN** into the Prototype Factory Maze/Cascade Sphere as **Rig_Large boss/end-of-level encounter** against the flying Combat Mech; later let other KayKit characters and KFB actor rigs including FrizzleBob enter the **same boss scenario** with approved attack/interaction capabilities.
- Later introduce other bosses and level-ending opponents by swapping source-pinned boss actors/animation families and authored action recipes, **not by cloning a new combat engine or custom boss physics**.
- Keep the game tactile, chill, cartoon-clay, accessible to different player types; boss should be a physical puzzle/opponent, not a compulsory brutal bullet-sponge or lengthy RPG. Same authored Maze/Fluff path graph, selective destructible sockets, Combat HitEvent and source-backed Goo/MaterialZone profiles.
- The original 4GTN lore: forgotten planetary scout that observes biomes and inhabitants and hibernates until colleagues arrive; opens a surreal KFB reading of a stranded planet guardian/hypernormalised machine. This is background inspiration, not an established KFB canon story.
- Proposed first boss: **The Forgotten Scout** — one short optional post-L03 boss arena/goal variant or a terminal encounter after a level. It should be testable independently of original L01–L03 campaign. Avoid turning the whole Mini-Game into hard action combat.

## 2. Actual official and KFB source evidence, not guessed rigs
Primary creator: https://www.patreon.com/kaylousberg/posts/january-2026-of-147072938 (published Jan 1, 2026) and https://www.kaylousberg.com/patreon-characters/series-6. Patreon says 4GTN is a planetary scout, supports separate KayKit Character Animations and includes source assets. Official animation pack supports Rig_Large separately from Rig_Medium: https://kaylousberg.com/game-assets/character-animations.

Direct GitHub main directory check: `media/3D_Assets/KayKit_Mystery_Series6/7 - January 2026 - 4GTN/`
- `4GTN.glb` — **896,580 bytes**, Git blob `fa7a7e418ba90703fdabaf272867a46dda5047ab`.
- `4GTN_Forgotten.glb` — **1,205,036 bytes**, blob `a514ef273142a90fa35e9e4c1cdbfd58f900b93f`.
- `4GTN_texture.png` — common source texture, 26,742 bytes.
- `gltf/4GTN_Katana.gltf` + `.bin` + source texture — exact source-prop already in repo.
- KayKit Character Animations 1.1 current main `Animations/gltf/Rig_Large/`: `Rig_Large_General.glb`, `Rig_Large_MovementBasic.glb`, `Rig_Large_MovementAdvanced.glb`, `Rig_Large_CombatMelee.glb`, `Rig_Large_Simulation.glb`, `Rig_Large_Special.glb` (6 source files present; exact clip counts per set pending run-time / animation library sample).
- `tools/KFB-ToolBox/_inbox/KFB_RESIDENT_ATLAS_SESSION_CUT_2026-10-04_r1/data/eye-rig/rig-large-actors.v0.json`: both 4GTN and Forgotten explicitly source-pinned as Rig_Large with **23 joints**; note joint count alone does not determine Medium vs Large.
- Same Atlas `docs/ATLAS_NEXT_SLICES.md` and `CHANGELOG.md` (S34): **Rig_Large 34 documented clips**; Rig_Medium clips may bind bone names but yield deform/ground penetration. Atlas measured head bone y 3.086 and posed height 4.014 with Large Idle_A, versus head 1.223 and posed height 2.619/ground -0.347 with Medium Idle_A. This is historical source QA, not a new runtime test.
- Source difference: Forgotten is a second model with overgrown mesh parts including distinct `4GTN_Forgotten_Hat`, not simple texture variant; both share the original texture. Historical Atlas dimensions: bind pose about 5.698 × 4.156 × 1.425 vs depth 1.749 for Forgotten. Intermediate geometry morph/reveal not present as source clip; visual swap requires a *compatible grounded presentation* and independent fit test.
- **Original material zones:** separate emissive glow-strip meshes `*_2` with `4GTN_glow` alongside source `*_1` base meshes/material `4GTN`. Named-mesh irregularities across variants are documented (e.g. `4GTN_Right_1`), so NO blanket substring regex assumptions for hitzones, glow, arm attachments or material selectors.
- **Source weapon** `4GTN_Katana.gltf` has a Resident Atlas fit on `handslot.r` in Rig_Large `Melee_2H_Idle`; fit is a source-/preview-specific donor, not accepted boss weapon contact, attack collider or hit animation.
- **No claim** the boss AI, hitbox, giant scale, large-rig animation montage, beam projectile, gameplay interaction or actual source 3D boss scene is already integrated in WS1.

## 3. First playable boss concept — 2–3 minutes, bounded and optional
**Encounter:** The Forgotten Scout guards a small two-route relay in an authored KayKit Factory Maze or a later OSM-styled neighborhood. Its sensor field is connected to two visible control sockets. The Mech can fly around it, switch a route, intercept a pulse with a source-verified panel, and hit one brief *accepted vulnerability socket* during an exposed window. Robot is a towering source-real character, not a scaled-up arbitrary replacement mesh. In Chill, reaching and disabling the control/overload nodes can resolve the encounter without damage farming.

**Proposed beat structure** (concept levels, not actual 4GTN source actions):
1. **DORMANT / AWAKEN**: source 4GTN_Forgotten or 4GTN with slow Large idle, low emissive glow, visible sensor/quest context. Player sees original route and the optional friendly Fluff supply objective. Start/activate a control node; no artificial hit-from-nowhere.
2. **SCAN / TELEGRAPH**: Robot marks a small, readable target line/zone; *one* slow scan/sweep to avoid by flight/cover or redirect via an existing switch. Source glow strips brighten only as a presentation effect; no new automatic gameplay state from intensity.
3. **DISRUPT / EXPOSE**: One accepted boss action temporarily closes an authored graph connector or exposes a control socket. Player uses existing Combat `ShotEvent → HitEvent` to hit a specifically added opt-in `bossWeakpointSocket`, or chooses an existing terrain switch/Fluff delivery to deactivate/cleanse the signal. A hit changes one damage/phase state once. No destructible source GLB by default.
4. **SETTLE / RESOLVE**: robot soft-squashes/staggers, field/Goo clears, the original Fluff route resumes, the player receives one owner-authoritative result and can return. In Chill a restored/dormant robot is preferred to a corpse/explosive robot, but Combat mode may show source-appropriate stunning/defeat.

**P0 mechanical limits** (candidate, to be judged in play): one boss actor, one existing single player Mech, two arena control sockets, one scan/telegraph pattern, one contact/hit/react window, no spawns or one small Fluff wave, no hard kill timer, restartable 90–180 s boss run. Everything optional to launch of L01–L03. Only later add katana swipe, a second telegraphed attack, attack cooldown choices and variants.

**Chill/playful presentation:** a giant Rig_Large robot with source glow-strips, soft inertial/wobble settling, one low-frequency scanner hum, gentle physical contact on Mech/ground, small particle/soft puff instead of screen-wide weapon explosions. Use KFB 3D canon source and R5 presentation-cue approach; camera preserves real movement owner and visible boss silhouette without constant shaking.

## 4. Universal BossEncounter candidate, not second combat stack
**One reusable data recipe** with:
- `bossActorRef` = exact pinned GLB asset path/sha + `rigFamily:Rig_Large` + source scale/bind pose; `weaponAssetRef` optional and exact source-authorized.
- `bossRole/arenaRef` = existing authored L01–L03/World host encounter ID and stable node/socket refs; player actor can be Combat Mech or other KFB character only if its **existing movement/Combat capability** is known.
- `phases/phaseTransitions` = tiny pure boss encounter state, `DORMANT → SCAN → EXPOSED → STABILIZED/DEFEATED`. Phase facts are authored by existing Combat/World/Wave host clock/accepted events, not by shader or animation time.
- `actions` = low-cost authored `SCAN_TELEGRAPH`, `ROUTE_INTERRUPTED`, `BOSS_WEAKPOINT_HIT_ACCEPTED`, `ROUTE_REPAIRED`; boss itself reuses the existing Combat Arena attack/defense and World graph if actually supported in the receiving API.
- `visualCueBindings` = source `4GTN_glow` mesh-only tint/pulse on safe per-instance material clone, body+Katana sourced Large clips, R5 soft reaction cue after accepted phase change; hitbox is independently anchored and validated (visible light strips are NOT hitboxes).
- `objective` = bring a source-authored route back online, survive one predictable scan, and resolve one exposure. Combat OR puzzle route can exist; do not let only melee combat permanently gate mobile or other avatar classes.
- `save/result` = one idempotent encounter receipt through existing World/PlayerSave; no second Wallet, respawn economy or global boss manager.
- `performance` = one skinned large boss with 23 bones and original emissive mesh strips; measure cost including shadows, cloned meshes, IK, VFX, audio with target mobile profile. Instancing individual skinned bosses is NOT assumed.
- `future ` (post-P0): variant `4GTN_Forgotten` as first skin/source-actor swap requires real source collision/fit QA. Multiple bosses become data+clips+telegraphs over one combat/event runtime, not new Boss AI services.

**Boss cannot require a global extra logic author:** route disruption and weakpoint callbacks are authored as one bounded encounter consumer of existing game events. Prototyping pure boss phases is allowed as a data fixture only; it may not become a parallel Combat damage authority.

## 5. Animation/rig/asset validation plan
A. **Source isolation:** Use current KFB Asset Librarian / existing Rig_Large Atlas viewer. Original 4GTN and Forgotten GLBs + Katana exact branch pins, inspect material slots/emissive glow child meshes, source bind pose, skeleton clone and animations. Actual game target is faithful source model, not substitute humanoid.
B. **Rig proof:** Load only `Rig_Large_*` clips for rig-large 4GTN, source-select `Idle_A`/supported attack/strike/hit/stagger, freeze/transition safely; measure lowest foot contact and shadow at posed height. Compare direct normal/forgotten variants. **Do not reuse Rig_Medium** from Combat Mech just because joint names match.
C. **Weapon proof:** verify original Katana handslot attachment and tested source animation/attack clip *before* adding real collision. If absent/awkward, defer Katana to visible signature prop while boss uses scan/slow pulse route interactions.
D. **Target and movement:** explicit opt-in weakpoint socket attached to a measured source node (do not assume glow mesh or root center). Attack telegraph, overlap/dodge/contact and source melee safety tested under existing WS1/Combat host.
E. **Interaction player variants:** define source-safe capability tiers rather than bespoke separate boss logic. Mech = fly + original minigun/possible Axe. Future KayKit actors = melee/tap/ground movement from their actual existing host capabilities. FB = rig/source-specific movement, with same authorized intent `interact/hit/switch`, not an invented gun/jetpack. Every actor gets an actual reachable objective.
F. **FX/audio:** soften fight and respect existing KFB Audio Site/buses; character glow material is a discrete zone, optional colorband shader can affect selected glow strips without destroying source body/lighting; source scene at original fit and gameplay scale must be visually proven.

## 6. Gates/QA and explicit deferrals
**Proposed additional independent Work validation F37–F44:**
- F37 source 4GTN and Forgotten original GLB + Katana correct exact path/material identity, one screenshot pair at real target camera.
- F38 separate Rig_Large, source-validated clips, no Medium-clip collapse or foot penetration, all transitions clean.
- F39 real source glow-strip mesh/material targeted effect only, no global body re-color, and reduced-motion readability.
- F40 actual scanner telegraph safely readable, interrupt and one phase change factual, no VFX-authored hit.
- F41 accepted Combat hit to verified weakpoint counted once; wrong mesh hits ignored by boss state.
- F42 existing maze route graph updates causally (interrupt, redirect, stabilize) with same seed/event timeline replay; packet counts not FX.
- F43 player actor swap for an ACTUALLY supported alternative KFB actor: objective reachable without assuming mech flight/minigun; if none supported, mark deferred not claimed pass.
- F44 mobile/desktop motion/sound/perf measured, 1 source-authentic 90–180 s fight clip, safe return/result receipt, no duplicated boss/controller/Audio owner.

**No new runtime/browser/actual GLB decoded animation tests in this pass.** The source directories and historical Atlas tests were read, not rerun. Boss is a future optional **post-L03 or end-of-level** experience; initial L01 first-source gate unchanged. Source Rig_Large is well documented, but clone, animation, large rig collision and genuine attack behavior remain to be proven in receiving owner.

**ONE next gate remains WS0_PLATFORMER_ASSET_INTAKE_AND_L01_SOURCE_GATE.** WS0 may record the 4GTN boss donor NOW and source-isolate its existing GLB/Rig_Large/Glow later alongside mandatory L01 source objects; do not inflate or block L01 by mandatory Boss AI. After C1–C3 real game proof, authorize one bounded optional boss trial in the same WS1/Combat owner.
