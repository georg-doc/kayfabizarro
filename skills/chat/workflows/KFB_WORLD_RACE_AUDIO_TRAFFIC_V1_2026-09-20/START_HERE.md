# KFB World/Race/Audio/Traffic · Claude Design briefing

Status: READY FOR DESIGN / INTEGRATION PREP · no runtime promotion
Date: 2026-09-20
Owner: Race/Travel integration lead; Race engine remains the runtime owner.
Human test surface: https://kayfabizarro.pages.dev/kfb-hub/stunt-race/track-environment-lab/?world=facility&seed=KFB-1842&audio=roadtrip-v2

## Outcome

One small, playable World/Race candidate. The existing driving engine, controls and vehicle animation handoff remain intact. The candidate adds a coherent TinySkies/Travel world grammar, selectable verified vehicles, layered Racer audio and a separate visual traffic proof. It is not a rewrite of the driving engine, OSM loader or HUD.

## Read first

1. `skills/session-entry-use-what-works_v1.md`
2. `skills/chat/ANTI_SLOP_VISUAL_BRIEF_GUARDRAILS.md`
3. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
4. Race repository current `RECOVERY.md`, `RETURN.md` and named slice brief.
5. Travel Globe terrain owner and TC-01 return. TinySkies/Travel is the macro-world donor; Voxel is not.
6. Audio pack: `media/3D_Assets/Audio/KFB Racer/`.

## Exact audio inventory to start from

- `KFB_V8_Muscle_Idle_Loop_12s_48k.wav`
- `KFB_V8_Load_Loop_10s_48k.wav`
- `KFB_V8_Rev_Sweep_8s_48k.wav`
- `KFB_Steampunk_SciFi_Engine_Idle_Loop_12s_48k.wav`
- `KFB_Steampunk_SciFi_Engine_Throttle_8s_48k.wav`
- short MP3 variants are intake only until auditioned, named and approved.

Do not replace existing contact, surface, wind, landing, skid, radio/Jukebox or semantic soundscape owners. Map the new engine material into that system through a narrow engine-audio adapter.

## Design rules

- The current Race engine owns driving, track contact, controls, animation timing and vehicle state.
- TinySkies/Travel contributes terrain shape, water, time of day, rain, fog/light and colour logic. Reuse the current owner; do not copy a second terrain engine into Race.
- OSM supplies place/route data. Race turns only the selected route corridor into a drivable seam.
- All vehicle choices are real, named profiles with proven source, animation, ground contact and cleanup. Unknown vehicles remain visibly unavailable; no proxy car.
- HUD is a later integration seam. Do not create generic panels, replacement branding, black information boxes or placeholder instruments.
- Every visible object must be a real donor or a deliberately authored KFB object with a stated owner.

## Claude Design task

Create a design/export package, not a standalone replacement game:

1. Define a four-part world palette: coast/water, city-industrial, canyon/highland, strange-fractal. Each has ground, sky, fog, rain response, landmark contrast and night readability.
2. Show the same short road/OSM corridor at morning, rain, dusk and night. The road, shoulder, terrain and water must feel like one world.
3. Draft a compact vehicle selector using only verified vehicle cards and an explicit “needs profile proof” state for everything else.
4. Define audio roles: engine idle/load/rev, surface/tyres, wind, collision/scrape, jump/landing, world ambience, radio/Jukebox. Radio remains independent of the world soundscape.
5. Make a separate non-player-traffic proof: 3–5 clearly readable vehicles looping on authored route ribbons, with light donut/drift gestures, engine/tyre/VFX accents and safe despawn. It is visual background traffic only: no race ranking, no opponent AI, no collision authority.
6. Return a single named scene recipe: palette token values, donor list, world mode presets, traffic route records and asset/profile references.

The traffic reference may borrow the legibility of arcade racing such as SP13KTRA/Mario Kart, but no code, assets or gameplay systems are imported from those projects.

## Acceptance gates

- Source objects are shown in isolation before composition.
- One exact vehicle must drive with existing controls and existing animation handoff unchanged.
- Engine audio crossfades are audible without duplicating or fighting the contact/SFX system.
- Rain/day/night affects existing world light/fog/surface seams rather than a full-screen filter.
- Traffic stays out of player ownership and can be toggled off.
- Desktop and mobile screenshots keep the road corridor and touch area readable.
- Direct Cloudflare Stage URL passes before any Live promotion.

## Explicit non-goals

No new driving engine, no generic HUD, no procedural city rebuild, no new race logic, no production promotion by Claude Design, and no unverified vehicle appearing selectable.

## Return packet

Commit/branch, exact donor files, selected vehicle profiles, audio mapping table, direct Stage URL, desktop/mobile proof, test counts, unresolved seams and one human visual gate.
