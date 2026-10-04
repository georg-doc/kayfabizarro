# KFB img2threejs · Arbeitsbereich

**Stand:** 2026-09-19 · **Owner:** Georg / KFB  
**WSA Review Package:** [Landmarks · full handoff + backlog](docs/WSA_REVIEW_PACKAGE_LANDMARKS_2026-09-19.md)  
**Aktueller Return:** [Grotesque World Style Bridge v1](docs/LANDMARK_WORLD_STYLE_V1_RETURN_2026-09-19.md)  
**Slice:** [Pilot 06 · bounded style bridge](landmarks/pilot-06/SLICE.md)  
**Aktuelle Evidenz:** [World Style v1 · 1354/1354](evidence/2026-09-19-landmark-world-style-v1/summary.json)  
**Vorherige akzeptierte Rig-Evidenz:** [Band Rig v2](docs/LANDMARK_BAND_RIG_V2_RETURN_2026-09-19.md)  
**Ideation:** [Living Toy World / Reactive Landmarks](docs/IDEATION_LIVING_TOY_WORLD_2026-09-19.md)

## Aktuell

**GEORG DECISION — landmark default:** **City Grotesque** is now the default landmark view/style. Soft Cubist remains an alternate/debug mode. This decision applies to the landmark lane only; the OSM City Lab keeps its own current default `cartoon` mode unchanged.

**Default review environment:** **OSM City Lab**. Travel Verdant / Day remains an alternate comparison mode.

**TinySkies × OSM integrated source candidate:** source PR [#110](https://github.com/georg-doc/kayfabizarro/pull/110) · tested runtime `aa28a743628699271c94c1911af23d0564c6f3cc` remains **27/27 static + 19/19 Chromium PASS**. The Cloudflare public gate failed twice on publication/marker issues, so human Stage review is currently **BLOCKED**. [Failure recovery + one next gate](landmarks/pilot-08/failure-recovery/START_HERE.md).

**Pilot 06 · World Style Bridge v1:** Eiffel, Giza, Stonehenge, Pentagon, Spasskaya and the Kremlin wall study now share the Grotesque default and flexible landmark-specific cartoon palettes. The review viewer can place them in either the exact current OSM City presentation context or a pinned current Travel/TinySkies-derived sky/light/biome context.

**Pilot 05 · Semantic Band Rig v2: IMPLEMENTATION + STATIC/NUMERICAL + CPU VISUAL TESTED RESULT.**

Pilot 04 / v1.2 is **REJECTED FAILURE HISTORY** for the attachment problem. Its clocks stayed rigid relative to abstract sockets, but those sockets were measured **2.162–3.784 m away from the actually rendered clock-stage faces** in City Grotesque.

Band Rig v2 removes that socket seam entirely. The tower is split into four semantic assemblies:

- `lower`
- `clock`
- `belfry`
- `tent`

The visible `clock-stage`, all four clock assemblies, gables, pinnacles and the lower hip roof share **one exact affine clock-band transform**. Therefore host and clocks cannot diverge through separate deformation math.

The lower band keeps horizontal X/Z basis vectors so the authored ground remains exactly **Y=0**.

## Test result

Current Pilot-06 source evaluation: **1,354/1,354 PASS**.

This includes all current modular landmarks in Grotesque, all Travel moods/biomes, palette saturation/lightness preservation, current OSM/Travel source pins and viewer/style contracts.

Band Rig v2 remains separately tested at **159/159 PASS**.

Key values:

- Spasskaya: **3,496 triangles**, min Y = **0**
- Kremlin wall study: **5,008 triangles**, min Y = **0**
- source clock standoff from clock-stage: **0.080 m**
- City Grotesque Band Rig v2 standoff: ~**0.071586 m** on all four faces
- max transformed-standoff error: ~**2.13e-15 m**
- Soft Cubist standoff: ~**0.084910 m**
- max error: ~**1.31e-15 m**

The previous v1.2 failure is deliberately reproduced by the new QA before the replacement path is tested.

## Visual evidence

A deterministic CPU z-buffer/triangle renderer consumed the **exact generated production vertices**.

- [Before / after proof](evidence/2026-09-19-landmark-band-rig-v2/before-after.jpg)
- [Evidence notes](evidence/2026-09-19-landmark-band-rig-v2/VISUAL_EVIDENCE.md)

Same source geometry + same camera: v1.2 visibly detaches clocks; Band Rig v2 keeps front/side clock assemblies on the host.

A Chromium/WebGL probe was also attempted, but EGL/ANGLE initialization failed in the agent environment. Therefore CPU visual evidence is PASS; a new agent-side WebGL/browser PASS is **not claimed**.

## Öffnen

- [Pilot 06 · Grotesque World Style / OSM + Travel](landmarks/pilot-06/index.html)
- [Pilot 05 · Semantic Band Rig v2](landmarks/pilot-05/index.html)
- [Pilot 04 · rejected attachment history / living-toy donor](landmarks/pilot-04/index.html)
- [Pilot 03 · Grotesque / Soft Cubist / Giza Voxel](landmarks/pilot-03/index.html)
- [Pilot 02 · Landmark Pack](landmarks/pilot-02/index.html)
- [Pilot 01 · Eiffel / Giza / Stonehenge](landmarks/pilot-01/index.html)
- [Dom v0.2 · accepted cartoon-style proof](prototypes/koelner-dom/v0.2/index.html)

GitHub displays HTML as source. The viewer needs JavaScript/WebGL and Three.js 0.160.0.

## Living Toy World

North Star:

> **the world as a breathing, living toy**

Band Rig v2 preserves actual scene groups/pivots per semantic band for future presentation reactions. A bounded preview reactor supports idle breathing, synthetic disco pulses and impact reactions.

These remain **presentation signals only**. No Audio engine, vehicle bounce, collision, movement, terrain or persistence owner is created. `bumperProfile` remains proposal metadata until a receiver-side Race/Travel contact slice implements and validates it.

## Recovery

1. Read `skills/chat/START_HERE.md`, registry and relevant SOP.
2. Read [Pilot-05 Slice](landmarks/pilot-05/SLICE.md).
3. Read [Visual Evidence](evidence/2026-09-19-landmark-band-rig-v2/VISUAL_EVIDENCE.md) and [summary](evidence/2026-09-19-landmark-band-rig-v2/summary.json).
4. Treat Pilot 04/v1.2 as rejected attachment history, not the current solution.
5. Visually review Pilot 06 starting in **OSM City Lab**; use Travel Verdant/Day as the alternate comparison context.
6. Pilot 08 source runtime is retained; do **not** rebuild it. First complete the marker-only public recovery gate in [Pilot 08 failure recovery](landmarks/pilot-08/failure-recovery/START_HERE.md).
7. Only after public PASS + Georg review: real Cologne Cathedral OSM Golden Sample; then Acropolis / Area 51.

## Zuständigkeiten

City Lab owns geography, local metre projection, City style and Landmark Override. Registry/Librarian owns asset identity. Travel/Free Roam owns movement, terrain contact and persistence. Race owns driving/contact/physics/camera/gameplay. Audio stays with its existing owner.

Pilot 05 is an additive authoring/presentation donor and replaces none of those owners.
