# Claude Design Form Answers · KFB Cologne Race Slice C

These are the decisions for Claude's current gate form.

## 1 · The two visual authority boards

**Answer:** Georg will attach both boards directly to Claude Design.

Treat them as:
- `OPTION_C_VISUAL_AUTHORITY`
- `OPTION_A_VISUAL_AUTHORITY`

For the first build, **Option C is binding** for color/light/form language.

Do not start palette sampling until the attachments are visible.

## 2 · Filament donor: how to use it?

**Choose:**

> **Derive the SHAPE but re-proportion it to real Dom geography.**

Verified reference-only source:

- repo: `KilledByAPixel/SP13KTRA`
- revision: `166ad838`
- `code/levels.js` blob: `75189173db4f1e15537992c34590f6d8f34ce9b8`
- `code/skeleton.js` blob: `447ab3566a07420a94a08080a90dc46d04af1dbd`
- circuit: **FILAMENT / circuit index 1**

Allowed derived grammar:
- 7-corner kidney family;
- opening/start run under a dense-arch tunnel;
- tightening double-apex character;
- filleted authored polygon;
- route resampled by arc length;
- smooth/eased elevation rhythm.

**Do not copy:**
- source code;
- literal corner-coordinate table;
- original materials/assets;
- original scenery;
- original meshes;
- original numeric world scale.

Re-author an independent KFB route in Dom/Zentrum metres using the grammar above.

This is a **reference-only design donor**, not code intake.

## 3 · Dom/Zentrum geography

**Choose:**

> **A real Overpass/OSM export must exist before final world blockout.**

The repo now contains the exact query contract:
`DOM_ZENTRUM_OVERPASS.ql`

Expected intake file after the query is run:

`source/osm/dom-zentrum.overpass.json`

Rules:
- raw OSM data is saved unchanged;
- save source timestamp / endpoint / query SHA;
- label OSM as ODbL data;
- derive a compact consumer file separately;
- do not author fake OSM geometry;
- do not label hand-authored fallback coordinates as OSM.

Claude may proceed before that export only with:
- Filament grammar isolation;
- vehicle / HUD / billboard donor isolation;
- Track material prototypes;
- landmark donor isolation.

The **playable Dom Loop itself is blocked until real Dom/Zentrum OSM arrives**.

If Claude has working Overpass access, Claude may run the checked-in query and include the raw response in the handback. Work/ChatGPT will pin it in GitHub.

If not:
`MISSING_OSM_EXPORT: DOM_ZENTRUM`

## 4 · What Claude hands back

**Choose:**

> **Playable .dc.html + standalone build + RETURN/SOURCE/TEST evidence + exact GitHub metadata files ready to commit.**

Claude does not need GitHub write access.

Return folder:

```text
KFB_COLOGNE_OPTION_C_EXPORT/
  KFB Cologne Option C.dc.html
  standalone/
  RETURN.md
  SOURCE.json
  TEST_REPORT.md
  CHANGELOG.md
  STAGE_METADATA.json
  screenshots/
  evidence/
```

`STAGE_METADATA.json` must name:
- public coordination repo: `georg-doc/kayfabizarro`;
- intended branch: `claude/cologne-race-option-c-2026-09-20`;
- intended Stage route: `/kfb-hub/stage/stunt-world/cologne-option-c/`;
- build marker;
- exact donor pins;
- files to publish.

Work/ChatGPT performs branch/PR/Cloudflare publication and verification.

## 5 · Vehicles for Slice C

Do **not** invent a procedural stand-in.

Use these exact public assets first:

### Primary KayKit vehicle
`media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf/car_hatchback.gltf`

### Optional KayKit comparisons
`media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf/car_sedan.gltf`

`media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf/car_stationwagon.gltf`

KayKit City Builder registry pack:
`registry/assets/v1/packs/kaykit-city-builder-bits-1-0-free.json`
blob `c7e28545d4adc4ccff77467c18095deb12cbb0e6`.

Current deformer:
`tools/KFB-ToolBox/_inbox/KFB Vehicle Animation Lab v4/KFB_Vehicle_Lab_v4/lab-v7/vehicle-cartoon-deformer.v2.js`
blob `ce82a6265abb501f90ee841f8f7e522bc5862299`.

Current vehicle source list:
`.../lab-v7/registry-vehicles.v1.js`
blob `2a4a66d47aa12cc7d6a5c2888c02e2aedbb1dc0f`.

Also permitted for comparison after the KayKit car proves:
- `kenney_racing-kit/.../raceCarRed.glb`
- `kenney_car-kit/.../race-future.glb`
- `kenney_toy-car-kit/.../vehicle-racer.glb`

Pin every asset actually used.

## 6 · Billboard card art

**Choose:**

> **Use the real repo card pipeline; do not ask Georg for exported card fronts.**

Source of truth:
- `media/kfb/index.json` — `kfb-deck-registry/v2`, blob `af276a8b941a84a6b1856b9897dca196d1b7760a`
- `skills/SSOT_KFB_CardBuilder_PDF.md` — blob `122f6923fe78a58d0f188a5a0331d9d6ed270f4d`
- `overworld/overworld/card-art-2d.js` — blob `9485bdee2d8705a4d49db9616af3a797e76efa26`
- `travel/wip/travel_globe_wsa/globe-v13/sky-cards.js` — blob `d822abf334831a129e6be935e3ea82fd4bad60ac`

The existing contract already renders the real landscape PDF decks and crops their 2×2 cells.

Initial billboard random pool may use:
- KFB: `forget_utopia`, `ignore_dystopia`, `embrace_protopia`
- MED: `medkayfab_cardiology`, `medkayfab_emergency_medicine`, `medkayfab_histology`

Pick real `packId + cardNumber` values at runtime and record them in evidence.

If the PDF artwork pipeline is temporarily unavailable, the only accepted fallback is the **canonical real KFB card backside** already used by `sky-cards.js`.

No invented card fronts.

## 7 · Required pass-1 list

**Drop nothing, but keep each item proof-sized.**

Required in Slice C:

- **Tunnel** — one Filament-derived dense-arch/tunnel beat.
- **Rhine + water shader** — one visible Rhine segment with current TinySkies/Travel water language.
- **CCTV hero cameras** — exactly 2–3 source-backed hero camera placements.
- **Billboard** — minimum one real Kenney billboard with real repo card texture.
- **Propulsion orb** — ON/OFF, pulsing, speed/boost responsive.
- **HUD** — use current HUD v3 design rules; functional proof, not a fresh dashboard.
- **Close-orbit inspection camera** — mandatory due the TC-01 review failure.

Proof-sized means:
- one working example;
- no placeholder;
- no hidden fake;
- no full-system expansion unless required for that example.

## 8 · Anything else before start?

Yes. Respect the following:

1. **Public-repo coordination only.** The private Stunt Race repo is not a Claude dependency.
2. Use the public Race v0.8 mirror listed in `SOURCE_PINS.json`; do not build a second controller.
3. No current TC-01 black-ribbon / dense terrain-zone visual strategy.
4. No generic UI shell.
5. No random Kenney prop scatter.
6. Every donor must be shown/identified in isolation before integration.
7. Option C first. Option A starts only after Georg's C gate.

## 9 · Which design system?

**Use the custom KFB OPTION C · LIVING TOY design system.**

Not Material Design.  
Not Tailwind defaults.  
Not a generic racing-game UI kit.

Composition:

```text
TRACK        = TrackFlow
BUILDINGS    = BuildingElastic / soft OMS
LANDMARKS    = LandmarkElastic / hero deformation
VEHICLES     = current KFB Vehicle Cartoon Deformer
HUD          = current KFB Game HUD v3 rules
CARDS        = canonical KFB PDF/CardBuilder pipeline
WORLD LIGHT  = Option C reference board + TinySkies/Travel donor
OUTLINES     = restrained KFB Ink only where it improves readability
```

North Star:

> **THE WORLD AS A LIVING TOY**

Readability must come from hierarchy, silhouette, value contrast and motion cadence — not from making the world rigid.
