# Landmark World Style Bridge v1 · Pilot 06 RETURN · 2026-09-19

**Status:** DECISION + IMPLEMENTATION + STATIC/NUMERICAL TESTED RESULT · BROWSER/HUMAN REVIEW OPEN  
**Authoring owner:** `georg-doc/kayfabizarro/tools/img2threejs/`  
**Default landmark shape mode:** **City Grotesque**  
**Default landmark review environment:** **OSM City Lab**

## GOAL

Carry Georg's explicit decision forward: **Grotesque is now the default landmark view/style.**

The existing modular landmark set is presented through the same grotesque deformation language as the OSM City slice, while each landmark keeps a flexible, recognizable cartoon identity palette.

The authoring viewer can switch between:

- current OSM City Lab world context;
- current Travel/TinySkies-derived world context.

## DECISION

**GEORG DECISION · 2026-09-19**

> Grotesque is the default landmark style going forward.

Scope:

- applies to the landmark authoring/integration lane;
- closes the previous Grotesque-vs-Soft-Cubist baseline question;
- does **not** change OSM City Lab's own current `cartoonMassing.defaultMode = cartoon`;
- Soft Cubist remains an alternate/debug style, not the default.

**GEORG DECISION · 2026-09-19 — review environment**

> OSM City Lab is the default landmark-review environment.

Travel Verdant / Day remains available as an alternate world-context comparison. This changes only the review default; it does not remove or demote the Travel bridge.

## EXACT WORLD SOURCES

Recovered before implementation:

- `georg-doc/kayfabizarro@0f46003fa8ffd63c0b190c639a6a6c38bfec592b`
- `georg-doc/KFB-Stunt-Car-Race@de83868a4b1f06dc88730c564b2ebb63f9430d9d`
- `georg-doc/KFB-Travel-Globe@8614282aab2ced43bb5dda9fcf7abadf9768100a`

### OSM City

- City style blob `f129cca3041b55b84de26048dad7aef8fac8b292`
- material resolver `42cca129c5928f6178d0f7e1e0c06f7cc1a62b03`
- cartoon/grotesque deformer `d08c19fc45d98546b7ef2803f2ddbcb73b7f6782`
- viewer/world-light source `181edccab50c2b127b95370cc67da55e138b7a78`

Authoring bridge reproduces the current City Lab environment constants:

- background/fog `#c6d7dc`;
- fog 450 → 1200 m;
- Hemisphere `#ffffff / #58605b` intensity 2.2;
- sun `#fff2d6` intensity 2.7.

### Travel / TinySkies-derived current SSOT

- sky presets `04dd730ee735f064888e8472eff79583f17bebb0`
- world moods `2747a526e2aa38989c9c4052304da8733662b61c`
- biome domains `db3acf6ae6b7ebbc6cb4a7113a0d0fe782429d74`

Current Travel rules carried over:

- world mood changes **hue**, not saturation/lightness;
- Travel lights remain source-owned and are not recoloured by the landmark lane;
- atmosphere/fog/sky carries world mood;
- DAY / EVENING / NIGHT use the current TinySkies-derived multi-light rig.

Because `KFB-Travel-Globe` is private, the public authoring viewer consumes:

`styles/travel-visual-snapshot.v1.json`

This is explicitly a **derived, noncanonical, pinned snapshot**. Travel remains the sole owner.

Legacy donors are also pinned for later optional variants:

- old animated skydome donor `f747574d42835ffec335443dadc481f077e5dc2f`
- named Travel world-palettes donor `f6121ae41f00804a321592f60cdefb78206e76c6`

They do not override the current Travel sky/mood/biome owner.

## IMPLEMENTATION

### Pilot 06

[Landmark World Style viewer](../landmarks/pilot-06/index.html)

Current modular landmarks:

- Eiffel Tower
- Giza
- Stonehenge
- Pentagon
- Spasskaya
- Kremlin wall study

Default: **Grotesque**.

Paths:

- Eiffel / Giza / Stonehenge / Pentagon → existing generic City Grotesque deformation.
- Spasskaya / Kremlin → accepted Semantic Band Rig v2 + Grotesque.

Giza retains Voxel Steps and Boxel as explicit construction alternates.

### Colour system

[landmark-style-profiles.v1.json](../styles/landmark-style-profiles.v1.json)

Each landmark owns six flexible identity zones:

`structure / secondary / upper / accent / glazing / base`

Examples:

- Eiffel: oxidized/warm metal + gold accent;
- Giza: sand / limestone / terracotta;
- Stonehenge: mossy grey stone + warm accent;
- Pentagon: pale institutional stone + cool glazing;
- Spasskaya/Kremlin: red masonry + pale trim + green roof + gold accents;
- Cologne Cathedral: dark stone / roof / glazing profile prepared for modular migration.

World coupling is bounded. Travel mood/biome shifts hue relationships while the landmark keeps its own saturation/lightness.

### World bridge

[landmark-world-style.mjs](../styles/landmark-world-style.mjs)

- OSM context reproduces current City world constants.
- Travel context uses the pinned current sky gradients and exact light colours/intensities.
- Travel fog near/far values are scaled only for the metre-sized authoring frame; their current Travel ratios/look are retained. Actual Travel consumer must use host-owned environment values directly.
- Radial Travel sky follows the current `paintRadialSky` behaviour rather than inventing a new backdrop.

## TESTED RESULT

**1,354 / 1,354 current-GitHub-source checks PASS.**

The actual evaluation covered:

- Grotesque landmark default;
- unchanged OSM City default = cartoon;
- exact source pins;
- all six current modular landmark identity palettes;
- all 4 Travel moods × 4 biome positions × six material zones across all six landmarks;
- saturation/lightness preservation under world hue coupling;
- finite Grotesque geometry;
- unchanged triangle counts;
- preserved ground anchors;
- valid Travel biome-floor colour mapping;
- DAY / EVENING / NIGHT sky/light snapshot structure and key exact values;
- Pilot-06 viewer source syntax;
- Grotesque-selected UI and world controls;
- genius-loci catalogue uniqueness / implementation fields.

Current Grotesque triangle counts:

| Landmark | triangles |
| --- | ---: |
| Eiffel | 6,060 |
| Giza | 342 |
| Stonehenge | 1,596 |
| Pentagon | 11,384 |
| Spasskaya | 3,496 |
| Kremlin wall study | 5,008 |

[Evidence summary](../evidence/2026-09-19-landmark-world-style-v1/summary.json) · [OSM-default decision evidence](../evidence/2026-09-19-landmark-world-style-v1-1/summary.json)

Reproducible repository test:

`tests/check_landmark_world_style_v1.mjs`

## BROWSER / DEPLOYMENT BOUNDARY

Pilot 06 source is implemented, but this turn does not claim a new automated WebGL/browser PASS or fixed public Stage URL.

The previous human/browser acceptance of Band Rig v2 remains valid for that slice.

**PUBLIC DEPLOYMENT:** OPEN.

## COLOGNE CATHEDRAL

Dom v0.2 remains the accepted cartoon-style proof.

It is intentionally **not silently rewritten** into the generic deformation path. The next Dom slice should:

1. modularize its accepted geometry;
2. define semantic bands/groups;
3. use Grotesque as its default presentation;
4. calibrate real OSM identity / footprint / metres / height / yaw;
5. retain the existing Landmark Override fallback.

This remains the first recommended true OSM Golden Sample.

## GENIUS LOCI / ICONIC ARCHITECTURE PREPARED

[Human-readable catalogue](GENIUS_LOCI_CANDIDATES_2026-09-19.md)  
[Machine-readable catalogue](GENIUS_LOCI_CANDIDATES_V1.json)

### P1 prepared

- Acropolis / Parthenon
- Area 51 + crashed UFO
- Sagrada Família
- Sydney Opera House
- Atomium
- Gateway Arch

### P2 prepared

- St. Basil's
- Hagia Sophia
- Taj Mahal
- Colosseum
- Petra
- Mont-Saint-Michel
- Angkor Wat
- Chichén Itzá
- Machu Picchu
- Rapa Nui / Moai
- Golden Gate Bridge
- JFK / Dealey Plaza city-scenario slice

### P3 / biome geometry

- underwater Atlantis / original impossible-geometry architecture
- Devils Tower
- Uluru
- Guggenheim Bilbao

Each entry already carries:

- geometry problem;
- semantic rig idea;
- landmark colour identity;
- recommended Travel mood/biome/time showcase;
- source strategy.

## PROTECTED BOUNDARIES

Unchanged:

- OSM geographic truth;
- City S2 physics/collision geometry;
- Travel world ownership;
- Race contact/physics/camera/gameplay;
- Audio runtime;
- Registry/Librarian asset identity.

## NEXT IMPLEMENTATION ORDER

1. Pilot-06 human visual review.
2. Cologne Cathedral modular Grotesque + real OSM Golden Sample.
3. Acropolis — repeated semantic architecture.
4. Area 51/UFO — reactive scene-kit proof.
5. Sagrada Família or Sydney Opera House — hard non-box hero geometry.
6. Expand catalogue after those geometry families prove reusable.

## DECISION CLOSED / NEXT GATE

The review-environment question is closed: **OSM City Lab is the default**.

**Next gate:** open Pilot 06 in a real browser with its new OSM-default startup and visually check the full existing landmark set. If that passes, proceed to the modular Grotesque Cologne Cathedral as the first real OSM Golden Sample.
