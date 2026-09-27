# Georg response · K7 / Track Look T1 · 2026-09-27

## Decision

**Proceed with A+B as one production grammar.**

- **A · Hirnwelt** is the default KlayfaBizarro material, light and world identity.
- **B · Race** supplies the readable track semantics: kerbs, barrier blocks, runoff and high-contrast hazard/route cues.
- **C · Toy** is not the production base. Keep it only as an optional seeded/minigame preset.

This is one Track Core with state-driven skins, not two roads or a second geometry owner.

## K7

The K7 session export is accepted as a recovery/checkpoint package. Do not spend another design pass on K7 now. The omitted fingerprint texture must remain a canonical external/source-pinned dependency rather than being duplicated just to fit the package.

## T1 findings

Keep:

- TD03 exactly as the current Track Core source;
- overview, close-up and 25 m/s ride cameras;
- greyscale, joint view and measured surface values;
- rounded barrier tops;
- shoulder kerb outside the driving surface;
- the three-step handmade control.

Correction:

- the **road/contact surface remains geometrically unchanged**;
- handmade deformation is presentation-only on eligible barriers, tubes, kerbs and scenery;
- palette changes stay data-driven in `track-skins.v0.1.json`;
- the current colour fades are not the production transition. Replace them with deterministic discrete clay patches/clumps over route-space `s` and normalized lateral space;
- do not silently thicken the 0.30 m kicker barrier cap. Record the required cap width as a Track-Core parameter request, then show the best legal treatment on current geometry.

## Data recovery

The tunnel input is already on the current GitHub owner branch:

`skills/chat/workflows/KFB_TRACK_CORE_SLICE_2026-09-26/S9_RESPONSIVE_2026-09-27/tn02.graph.stream.json.gz`

Pinned branch/head:

`georg-doc/kayfabizarro · georg-doc-patch-2@f74f840311b122f5e8872a84fb71629212f44471`

Direct GitHub source:

https://github.com/georg-doc/kayfabizarro/blob/georg-doc-patch-2/skills/chat/workflows/KFB_TRACK_CORE_SLICE_2026-09-26/S9_RESPONSIVE_2026-09-27/tn02.graph.stream.json.gz

The compiled `fs01.graph.stream.json.gz` is genuinely absent. Its exact source layout is present at:

`skills/chat/workflows/KFB_TRACK_CORE_SLICE_2026-09-26/S8_TUNNELS_2026-09-27/track-core/layout/fs01.mjs`

Do not invent or approximate the FS01 stream. Mark only that part `SOURCE_REQUIRED`; it does not block the TD03 edge atlas or TN02 tunnel work.

## Next bounded design pass

Deliver now:

1. **Edge atlas**
   - pale clay city curb + sidewalk;
   - race kerb: flat / rumble / sausage;
   - race barrier blocks;
   - open verge;
   - grass / gravel / sand runoff;
   - ditch / berm;
   - guardrail / catch fence;
   - bridge parapet;
   - tunnel service strip.

2. **First four transitions**
   - city/OSM street ↔ race;
   - race ↔ gravel/sand runoff;
   - road ↔ ramp/loop/kicker;
   - open road ↔ tunnel portal.

3. **Patch-scatter proof**
   - no visible alpha or colour gradient;
   - deterministic patches;
   - surface role and edge role may transition at different timings;
   - route/contact geometry stays unchanged.

4. **Look application**
   - A/Hirnwelt on terrain, ordinary street, sidewalk and base clay;
   - B/Race only where the route state needs legibility or hazard emphasis;
   - colours remain configurable/seedable rather than baked into geometry.

5. **Evidence**
   - total / near / 25 m/s ride views;
   - greyscale legibility;
   - joint view;
   - one barrier/tube handmade-strength comparison;
   - TN02: one portal and one tunnel family from the real source.

Defer without blocking this pass:

- FS01 practice pads until the exact stream is exported;
- b11 split/merge if no compiled stream is currently mounted;
- reactive dents/VFX/SFX to S4B;
- building façades to S5.

## Guardrails

- no replacement Track Core;
- no second mesh/contact owner;
- no road deformation;
- no placeholder tunnel or practice course;
- no Kenney/KayKit road geometry;
- no generic neon Cosmic style;
- no new review site;
- defects first in Return.

## Return

Update the existing additive T1/K7 Return with:

- exact artifact/source paths;
- A+B decision applied;
- what changed in the atlas and JSON;
- missing FS01 classified `SOURCE_REQUIRED`;
- thin cap classified as a Track-Core parameter request;
- screenshots;
- one next productive design step.

Proceed without another A/B/C question.
