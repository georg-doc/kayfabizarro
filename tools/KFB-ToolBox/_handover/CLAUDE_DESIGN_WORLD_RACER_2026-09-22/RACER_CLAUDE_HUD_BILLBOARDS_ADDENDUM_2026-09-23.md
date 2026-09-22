# KFB Racer · Claude Design addendum · HUD Tokens + Roadside Billboards · 2026-09-23

Status: **CURRENT VISUAL AUTHORING ADDENDUM · CLAUDE DESIGN · NO RACE OWNER CHANGE**

## Current source lock

Race mirror:

`georg-doc/KFB-Stunt-Car-Race@cc62767161d9e1b7e0c98d924b1ad72b335e0b30`

Claude Design continues from its current editable Racer session.

Do not throw away the current HUD rebuild.

Georg reports the current Claude HUD direction as promising but not yet reviewed.

---

# A · HUD · keep the new composition, make it tunable

Current intended HUD composition:

- top-left: stopwatch icon + time, no redundant TIME label;
- top-right: LAP / BEST + settings button in a matching round frame;
- speedometer: no needle/ticks, thick progress ring + bright endpoint dot;
- speed large in center, KM/H below;
- bottom-right: map above, compact one-line radio below;
- radio/settings buttons: peach fill + dark thick rounded icons;
- sound icon: waves when on, X when muted.

Do not redesign the whole HUD again before Georg sees it.

## Required authoring seam

Move important visual/layout values out of scattered inline constants into one small presentation layer.

Candidate:

`kfb.racer-hud-theme/1`

Use either:

- CSS custom properties;
- or one `HUD_LAYOUT / HUD_THEME` object feeding CSS.

Expose at least:

- global inset/padding;
- top-left anchor;
- top-right anchor;
- map width/height;
- radio height/gap;
- speedometer size/ring thickness;
- icon button size;
- peach / ink / cream / panel colours;
- label/value typography sizes;
- corner radius;
- safe-area offsets;
- transparency/blur if any.

Do not put Race state/gameplay into this theme.

Race owns:

- lap;
- best;
- speed;
- music state;
- map state;
- settings state.

HUD theme owns only presentation.

## Required quick review presets

Allow compact A/B switching:

1. `HUD_CURRENT`
2. `HUD_CLAUDE_2026_09_23`
3. optional `HUD_TUNE` from token overrides.

No second HUD runtime.

## Check before Session Cut

Explicitly verify:

- checkpoint/pass cards at top-right still remain readable below the top strip;
- narrow viewport does not overlap radio/map/speedometer;
- settings button does not collide with LAP/BEST;
- radio title truncates gracefully;
- sound on/off icon reads at driving distance.

---

# B · Roadside Billboard system · source-backed, not invented

Use the supplied asset handoff:

`tools/KFB-ToolBox/_inbox/KFB Style References/BILLBOARDS & CheckPoints + Amapeln + Scheinwerfer - RACER -kfb-asset-handoff-animation-lab (9).json`

Source family already proven in the handoff:

- `billboard.glb`
- `billboardDouble_exclusive.glb`
- `billboardLow.glb`
- `billboardLower.glb`
- `overhead.glb`
- `overheadLights.glb`
- `bannerTowerRed.glb`
- `bannerTowerGreen.glb`
- related Kenney lights
- optional separate Poly billboard donor

## Important existing Racer donor

Option C-2 already contains:

`lab-v9/cologne-props.v1.js → buildBillboard()`

and:

`renderCardQuarter()`

This already proves:

- a real Kenney billboard source;
- route-relative placement;
- actual PDF.js/Card rendering;
- canvas texture → billboard panel.

Reuse/extend this path.

Do not create a second PDF renderer or billboard owner.

## B0 · source proof first

Before composing the road:

- show each candidate billboard variant alone;
- record its front/screen plane;
- verify orientation/pivot;
- verify which material/mesh is the visible board.

Loaded URL is not proof.

## B1 · first roadside proof

Place a small deterministic family only:

- 6–10 billboards total;
- 2–4 source variants;
- both sides of road where safe;
- no tunnel;
- no critical corner sightline;
- no collision intrusion.

Use deterministic seeded variation:

- side;
- small yaw variation;
- small scale variation;
- spacing jitter;
- occasional height variation.

Keep variation restrained.

These are roadside props, not obstacles.

## B2 · KFB page / card content

Reuse the existing PDF/Card Builder logic.

First content source:

- current KFB card/PDF sources already consumable by `renderCardQuarter()`.

For roadside advertising, unlike collectible cards:

**cover-crop is allowed.**

The driver only needs a strong readable fragment at speed.

Provide content modes:

- `FIT_CARD` — full readable card, for important/slow locations;
- `COVER_CROP` — fill board, crop edges;
- `DETAIL_CROP` — deliberate close fragment;
- later `COLLAGE_LOOP`.

Do not stretch artwork to the board aspect ratio.

Crop; do not distort.

## B3 · KFB cartoon advertising look

The billboard frame remains the real 3D donor.

Presentation may adapt to the active KFB palette:

- frame/body colour by semantic palette role;
- dark/black billboard baseline may remain where visually useful;
- small typographic/SVG overlay accents;
- restrained irregular rotation;
- retro fairground / carnival / western / hand-painted advertising rhythm;
- paper/cutout/collage feel;
- broad readable graphics for drive-by perception.

Do not turn every board into identical branding.

### Later optional content lane

Future `COLLAGE_LOOP` may mix:

- public-domain still fragments;
- KFB snippets;
- type cards;
- poster fragments;
- short looping screen content.

This later lane must record provenance for any external image source.

Do not block B1/B2 on this.

---

# C · Technical bugs Claude must NOT repair in this visual slice

Route these to the separate Web technical gate:

1. recurrent dark/brown surface/sightline near the early tunnel;
2. vehicle sometimes above / inside track;
3. engine/audio controls not reliably wired;
4. trail/speedline ribbons overlap/fold during some speeds + curves/sway.

Claude may record exact screenshots/camera states reproducing them.

Do not spend Claude context debugging physics/audio/trail math.

---

# D · Vehicle roster / Donut-orb propulsion · later feature gate

Georg wants later access to all Racer-ready vehicles, potentially including suitable spaceship/racer bodies.

Possible visual propulsion profile:

- existing pink Donut drive where appropriate;
- or a compact glowing rear Orb when Donut geometry is unsuitable.

Do not implement this before the technical Track/Ground/Audio/Trail gate is green.

Preserve existing vehicle selector / `setVehicle()` owner.

---

# Session Cut

At the next coherent checkpoint export:

- complete editable source;
- current HUD implementation;
- HUD theme/layout tokens;
- billboard source proofs;
- first roadside billboard proof if completed;
- screenshots;
- additive changelog;
- unresolved visual questions;
- exact source revision.

Do not claim runtime bug fixes from this visual slice.
