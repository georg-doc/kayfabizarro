# Claude Design · Racer HUD + Billboard System · CURRENT START · 2026-09-26

**Use this in a fresh Claude Design chat inside the existing Racer project.**

Status: **STARTABLE NOW · PRODUCTIVE VISUAL SLICE · NO TRACK-CORE DEPENDENCY**

## Read first

1. current project/session source available inside the Racer Claude Design project;
2. canonical detail brief:
   `tools/KFB-ToolBox/_handover/CLAUDE_DESIGN_WORLD_RACER_2026-09-22/RACER_CLAUDE_HUD_BILLBOARDS_ADDENDUM_2026-09-23.md`
3. current Track Core planning only for boundaries:
   PR #219 / `skills/chat/workflows/KFB_TRACK_CORE_SLICE_2026-09-26/START_HERE.md`
4. current Cross-Mode HUD / 3D Navigation addendum:
   `RACER_CROSS_MODE_3D_HUD_NAV_ADDENDUM_2026-09-26.md`

Do not reopen the blocked Playable Track R0 slice.

## Current product context override

The 2026-09-23 HUD/Billboard detail brief remains the design specification, with these current corrections:

- Track geometry / route composition is now downstream of Track Core and is **out of scope here**.
- Do not repair Race contact, grounding, physics, trail/speedline, audio or route logic in Claude Design.
- Billboard B2b-P1 is currently a frozen Web recovery candidate on PR #211 (39/40). It is **not a prerequisite** for this visual slice.
- Use the already-proven PDF/Card content path for billboard readability/design. B2b collage content may be considered later after its separate human/technical gate.
- Do not create a second billboard renderer, PDF renderer, Race owner or track system.

## Outcome

Produce one coherent Racer presentation system that can later mount onto the proven Track Core:

### A · HUD presentation system

Keep/refine the accepted-promising composition from the detail brief:
- stopwatch/time;
- LAP/BEST/settings;
- ring speedometer;
- map + compact radio;
- sound/settings icon language.

Move presentation values into one compact `HUD_THEME / HUD_LAYOUT` or CSS custom-property seam.

Provide:
- current;
- Claude tuned;
- optional tune variant.

Prove desktop + narrow/mobile layout without collisions.

### A2 · Adaptive WALK / DRIVE / FLIGHT + 3D navigation

Apply `RACER_CROSS_MODE_3D_HUD_NAV_ADDENDUM_2026-09-26.md` without creating a second HUD runtime.

Required direction:
- shared HUD grammar, mode-specific visibility/providers;
- Tacho/Race telemetry only in DRIVE/RACE;
- WALK and FLIGHT show only real available instruments;
- exact proven Factory `arrow.glb` is first-choice 3D navigator and must be shown in isolation before integration;
- place the navigator in a shallow 3D near-world layer close to the Mini-map, with perspective/parallax instead of a fixed 2D icon;
- DRIVE points to the real next route decision when available; FLIGHT can use yaw + pitch to the real 3D target vector;
- Radar/sensor is conditional on a real provider and must never invent contacts;
- keep the central road/flight corridor visually clear.

Prove WALK / DRIVE / FLIGHT on desktop plus DRIVE / FLIGHT on narrow/mobile.

### B · Source-backed billboard family

Before composition, show the actual source billboard objects in isolation.

Reuse the existing Kenney billboard/overhead/banner family and existing Racer billboard/Card/PDF route.

Define the visual system:
- frame/body treatment;
- screen/panel treatment;
- KFB palette relationship;
- FIT_CARD / COVER_CROP / DETAIL_CROP;
- readable drive-by typography/graphic scale;
- restrained variation.

### C · Small neutral composition proof

Use a neutral/test road fixture or the current available Racer fixture only as a **presentation harness**.

Show 6–10 billboard placements to test:
- scale;
- viewing distance;
- left/right readability;
- spacing rhythm;
- crop modes;
- HUD coexistence.

Do **not** claim this as final Cologne route dressing and do not hard-wire positions to a route that Track Core may replace.

## Explicitly out of scope

- Playable Track R0;
- Track Core visual transition grammar;
- route geometry;
- new road pieces;
- final Cologne/OSM composition;
- physics/contact/grounding;
- trail/speedline fixes;
- engine/audio fixes;
- B2b lifecycle repair;
- vehicle roster / Donut-orb propulsion;
- Stage/Live publication.

## Deliverable

Export a complete Session Cut / ZIP with:
- current editable source;
- HUD token/theme seam;
- isolated billboard source proof;
- billboard presentation system;
- neutral 6–10-board composition proof;
- desktop/narrow screenshots;
- `SOURCE.json`;
- additive `CHANGELOG.md`;
- `RETURN.md`;
- unresolved design questions.

Do not spend the session on blocker/status discussion. Build this bounded visual slice.

## Exactly one human gate

**GEORG · Racer HUD + Billboard visual review: PASS / TUNE / REJECT.**
