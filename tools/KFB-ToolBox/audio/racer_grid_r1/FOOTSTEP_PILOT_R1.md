> **WSA ACK / V-389 implementation override · 2026-10-17:** Current user authorized the micro-proof in the EXISTING KFB Audio Site, no paid generation. It is implemented and privately deployed as Site source 0.7.2 / saved version 12, with real Mannequin_Medium (not ActionFigure), Walking_A/Running_A, three licensed donor banks and support-owned landing. 259 source/unit/evidence assertions PASS; 7 local interactive browser observations PASS; exact hosted visible check is BLOCKED_LOGIN, not HUMAN_ACCEPTED. Full current owner Return: [`tools/KFB-Audio-Site/RETURN.md`](../../../KFB-Audio-Site/RETURN.md). URL: https://kfb-audio.frizzlebob.chatgpt.site/#footsteps. This supersedes the historical research-only/no-runtime restriction below only for this bounded Audio Site slice. Both motor batches and paid clay pilot remain HOLD. No World/WB2/PR #348 writes. Next gate only: `GEORG_FOOTSTEP_MICRO_PROOF_REVIEW`.

# V-378 R2 · Locomotion Footstep Pilot R1 · KFB Audio + Motion

Date: **2026-10-17**. Mode: **BOUNDED DESIGN/RESEARCH SLICE ONLY; NO SOUND CREATED AND NO RUNTIME ADAPTER IMPLEMENTED**. All proposed schemas below are opt-in contracts, not new current KFB canon.

## Decision · footstep-first, not a 48-motor-audition detour

Georg wants **warm, substantial, muted footfalls** that stay unobtrusive over sustained movement; real terrain differences; correct cadence for Walk/Jog/Run/Sprint, strafe, and Jump/Land; a genuinely small paid ElevenLabs workflow validation where KFB lacks a signature sound. The prior V-378 R1 48-file motor batch **remains ON HOLD**. The R2 Motor/Hyperspeed grid and prompts remain preserved for a later small focused sci-fi/Racer batch, not discarded.

**Recommended first technical proof:** one existing Rig_Medium actor (ActionFigure if currently available) walking, running and landing across **grass / concrete / gravel / soft-clay**, with KFB's measured contact-phase donor feeding **the existing audio owner**. First validate using existing sources; no laborious 26-file audio audition. For the missing clay signature, propose a one-click, capped **6-output / 280-credit** Sound Effects v2 trial *after authenticated paid generation is specifically approved*. If there is no key yet, test all event timing with the real existing donor files, no fake sounds.

## Binding current KFB sources / provenance

- Root KFB animation skill: `skills/kfb-cartoon-animation/SKILL.md`; references `20-locomotion-gaits-transitions.md` and `50-runtime-state-blending-warping.md`. Physics/ground/velocity owns movement, not this sound module; animation phase and planted foot drive sound **timing**, the current audio owner drives playback.
- Measured donor `tools/KFB-ToolBox/_inbox/KFB_TOOLBOX_CLAUDE_DESIGN_SESSION_CUT_2026-10-01_r1/kfb-lib/locomotion-profiles.v1.js`. It measures 60Hz clip foot height/stance intervals and exports `contacts['foot.l/r'].planted`, `cadenceSpm`, `stepsPerCycle`, `strideLength`, `events.firstPlant/takeoff/touchdown`. The adapter **must derive both foot-entry events from the full planted intervals**, because `firstPlant` is not a full per-step event stream. The exported events are measured proposals; cannot pretend real source clips contain audio notifies.
- `kfb-hub/stage/toolbox/kaykit-motion-lab-v1/PROFILE_PROPOSALS.json` includes Rig_Medium `Walking_A` (reference speed ~0.611), `Running_A` (~2.480), phase-aligned Walk→Run donor, and proposed Jump clips. **Sprint and Jog must be semantically mapped only if actual source/profile exists**. `Running_B` is HOLD; no fake sprint source.
- `media/3D_Assets/Animations/KFB_Motion_Library/RETURN.md` contains additional measured animations for Medium/Large; do not assume their cadence/contact matches the KayKit primary family.
- Ground/Flight transport: `tools/KFB-ToolBox/_handover/TRAVEL_MODE_BRIDGE_V1_2026-09-23/START_HERE.md`. Ground controller owns `grounded`, slope/support and jump; Flight may not emit footfalls. Jump touch-down must come from authoritative support state, not a cosmetic `Jump_Land` animation playing.
- Audio SSOT `skills/chat/workflows/KFB_AUDIO_SOUNDSCAPE_BASELINE_V1_2026-09-24/START_HERE.md`; site owner `tools/KFB-Audio-Site` PR #350; accepted AUDIO-CAL-01. **One AudioContext, voice ducking, player-critical SFX, spatial world SFX, valid silence, no duplicate soundbed owner**.
- Existing shared `media/3D_Assets/Audio/sfx.json` maps `step` to generic `impactGeneric_light_002.ogg` and `land` to `impactGeneric_light_000.ogg`; these are **fallback events**, not source proof that per-material footstep playback exists.

## Actual existing sound bank (source paths verified on GitHub, no listening claims)

The complete exact mapping is in `FOOTSTEP_PILOT_R1.json`. Available candidates:
- Grass: five `kenney_impact-sounds/Audio/footstep_grass_000..004.ogg`.
- Concrete: four `Footsteps/foley_footstep_concrete_1..4.wav` plus Kenney concrete `000..004`.
- Gravel: four `Footsteps/foley_footstep_gravel_1..4.wav` plus four digital synthesized gravel variants.
- Wood: Kenney wood `000..004` and four digital wood candidates.
- Snow: Kenney snow `000..004` and four digital snow candidates.
- Carpet: Kenney carpet `000..004`, but blob SHA reveals pairs `001 == 002` and `003 == 004`; no claim of five unique sample sounds. Alternative four foley carpet WAVs.
- Vinyl, grass digital, snow digital also exist; not all need to be loaded in pilot.
- **Gap:** purpose-built dry soft-clay footstep family and chunky clay landing. Avoid generating more grass, generic hard impacts, or existing Sci-Fi layers first. Exact license for non-Kenney Foley/400-Sounds assets must be verified before production use.

## Architecture · sound attached to contact, not to an arbitrary timer

`authoritative movement/physics → animation semantic gait & clip playback rate/phase → measured foot stance-entry marker → foot world support/material lookup → dedupe/weight gate → existing Audio SFX router → existing AudioContext`

One audio event on **left or right foot entering genuine grounded stance**. One shot, **no looping footsteps**, except valid ambience/motor beds. Follow clip phase after time-warp and phase sync; do not use a fixed “0.35 s per step” timer. Speed determines selected gait/cadence through the existing Motion owner. It only influences subtle sample energy; never starts a separate locomotion clock. Foot world position, not actor pivot, determines which material gets sampled at an edge or seam. World/Cube/MacroCell or surface collider must supply **authoritative `surfaceTag`**, independent from clay presentation shader/visual UV complexity; when absent use a documented fallback/silence, not invented materials.

Proposed envelope (not implemented):
```js
{
  event: 'kfb:motion-foot-contact',
  actorId, foot: 'left' | 'right',
  motionClip, cycleIndex, contactPhase, eventId,
  worldFootPosition, surfaceTag,
  grounded, actualSpeed, contactLoad,
  blendWeight?, rigFamily?, verticalImpactSpeed?, travelMode?
}
```
**Event de-duplication:** foot + cycle + eventId; during Walk→Run crossfade choose one authoritative phase-aligned contact; prevent triggering both blended clips. Re-arm only after swing/release. Squelch/slip texture may follow friction separately, never as high-rate foot repeats. No events in idle with planted stationary feet; zero steps in airborne or Flight; halt steps when speed ~0 despite animation playback. On physical touchdown emit **one `LAND`** using vertical speed and contactLoad, and suppress overlapping nearest footstep within a small calibrated window. Avoid double sound at start/stop or reversal. Actor weight/rig scale modulates gain/EQ only within tuned limits, not by picking different unrelated packs.

## Sound production SOP · non-fatiguing Clay sound family
1. **Source/identity:** dry, isolated one-shot foot impacts, no rhythm loop, no long tails, no squeaky arcade chime or exaggerated rubber boing. Bass/low-mid mass, smooth transient, modest texture that identifies ground; reduce harsh >2–4 kHz resonances after listening, but do not hardcode one equalizer for all terrain.
2. **Sample bank:** rotate 4–5 true unique samples per material with seeded no-immediate-repeat. Small pitch/level drift allowed only after test; example proposal ±3% pitch and ±1.5 dB, never changes cadence or foot phase. Do not use identical consecutive files or the same original rendered sound with fake rename.
3. **States:** Walk: soft compressed contact; Walk.fast/Jog: contact moves closer, slightly firmer; Run: shorter but weightier; Sprint: firmer not piercing; Sneak: faint; Land: separate soft/hard contact envelope based on actual impact; Jump.air: silence. Distinct gaits require actual rig clips, not invented “jog” or “sprint” assets.
4. **Runtime mix:** PLAYER_CRITICAL (local player) / WORLD_SFX (NPC feet) on pre-existing bus and voice ducking; spatial emitters only for world positions and NPCs; limit simultaneous NPC footstep polyphony; never drown narrator and Jukebox B/C/D beds.
5. **QA:** per-surface clear but subtle distinction; 30–60s continuous run non-fatiguing; clip phase contact drift <= one rendered frame where deterministic; transitions produce no double-step; air silent; landing exactly once; seamless existing music, voice ducking and user-gesture playback. Test at low/normal system volume on speakers/headphones; this is a **later integration proof**, not something this audit claims accomplished.

## Free and open donor research (donor-only, no copying)
- [Godot Material Footsteps](https://github.com/developer-benny-zhu/godot-material-footsteps) (MIT per upstream): map material metadata/GridMap/Terrain3D and select randomized clips with fallback. **Design/logic donor only; Godot code cannot be dropped into Three.js**.
- [dropecho/unity_footstep](https://github.com/dropecho/unity_footstep): event vs automatic footstep detection, surface material and terrain texture routing. **Architecture donor; inspect license before code reuse**.
- [Johnz86/locomotion-godot](https://github.com/Johnz86/locomotion-godot): teaching model on foot placement, contact and root motion; asset licensing separate. **No adoption**.
- [OpenGameArt Fantozzi Footsteps](https://opengameart.org/content/fantozzis-footsteps-grasssand-stone): 12 isolated single steps, source says CC0; supplement only if KFB stock fails.
- [OpenGameArt 42 Snow and Gravel Footsteps](https://opengameart.org/content/42-snow-and-gravel-footsteps): external CC0 candidate, no immediate import.
- [Godot animation audio track docs](https://docs.godotengine.org/en/stable/tutorials/animation/animation_tree.html) and [Three.js AnimationMixer docs](https://threejs.org/docs/pages/AnimationMixer.html): algorithmic reference; our measured marker bridge is KFB-native.

## First demonstration, minimal scope
**Before paid generation:** use existing (grass/concrete/gravel) samples and same actual rig clip, show camera-visible foot phase and calibrated SFX in a tiny isolated Motion/Audio fixture. No new game movement controller or public Stage unless a meaningful human audible review becomes necessary.

**One optionally paid process-test batch (not authorized yet):** `FOOTSTEP_PILOT_R1.json` lists **4 × 1.0 s clay steps + 2 × 1.5 s clay landings**, **6 output files / 7 seconds / ~280 credits** at 40 credits/second, `loop=false`. Each HTTP POST saves one audio file and metadata; credit cap 280 planned (allow no unbounded retries). These are candidate one-shots, not declared “done” until real response/hash/codec/length and paired visual+audio test succeed.

**Later Racer/SciFi:** use this same secret-safe, SHA/resume, credit-manifest and Audio Site intake workflow for `H04 hyperspeed sustain`, `M04/M05 steady motor` and other truly missing R2 roles. No requirement for a laborious manual audition of 26 files before the first small creative batch; source audit already avoids duplicate generation.

## Named next gate
`WS0_LOCOMOTION_FOOT_CONTACT_ADAPTER_MICRO_PROOF`: isolated **real** Rig_Medium marker → 3 existing material banks → walking/running/jump landing via pre-existing audio owner. Only after a working contact event seam may WS0 request permission for the 6-file 280-credit clay sound pilot. Preserve PR #413 as Draft, no runtime writes in this research slice and no new Site, merge or Live.
