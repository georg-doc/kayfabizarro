# WSA Review Package · KFB Landmark / img2threejs Lane · 2026-09-19

**Purpose:** one review/check-in package for the existing WSA integration lead.  
**Authoring lane:** `georg-doc/kayfabizarro/tools/img2threejs/`  
**Race integration SSOT:** `georg-doc/KFB-Stunt-Car-Race`  
**Status:** HANDOFF READY · WSA REVIEW OPEN · no automatic Runtime promotion.

## GOAL

Hand over the complete current landmark-authoring state, including accepted work, rejected history, exact source pins, actual tests, visual evidence, open integration seams and backlog.

No new feature implementation is started by this document.

## EXISTING OWNER

- **WSA remains Race integration lead.**
- City Lab owns OSM geography, local metre projection, City presentation style and Landmark Override.
- Registry/Librarian owns asset identity.
- Travel/Free Roam owns movement, terrain contact and persistence.
- Race owns driving, contact, physics, camera and gameplay.
- Audio remains with its existing owner.
- `tools/img2threejs/` is an authoring/donor lane only.

## EXACT SOURCES / REVISIONS

Recovered immediately before this package:

- `georg-doc/kayfabizarro@e29bfe2956717fcd306110c9ba4e15bedee53c2e`
- `georg-doc/KFB-Stunt-Car-Race@5dad939a19e76963f3cfe4cbce35211058befaa7`

Current relevant source blobs:

| Source | Blob |
| --- | --- |
| Pilot-05 slice | `2de74134bd2f9e27d24736458ef1845e6e6e371f` |
| Band Rig v2 | `f0c0e5a805d0f0c43444d246e396645dc5c969ed` |
| Three band adapter | `4eb64ee12ca86c7394c6a8d9df28adee6f9aa1e3` |
| Band living-toy reactor | `016cafdb5df2715114deef9bf134e3136efda2dd` |
| Pilot-05 viewer | `6e2691f229b4e991c4ff8c3168c0797846864a2c` |
| Pilot-05 HTML | `ee88122492e30b3801819ea62f7ecb1551403146` |
| Band Rig v2 QA | `c5417f7919a6e87619fc5a66177ce58a7b7d4515` |
| Evidence summary | `eebfa17704012fb10c92d5399858efd442a53047` |
| Visual Evidence | `9a0a071a885b34644a22722eb303470d2d8e5aff` |
| Current Band Rig return | `5842de5c52890aa5b5f58fda8ba465456cdff0c2` |
| Living Toy ideation | `663254fcbd03cfc7fd5f27c30d15284a845cbcc0` |
| City Landmark Override contract | `f9aea1cffb447aa6ede45d47452de4b467be76a2` |
| City cartoon deformer | `d08c19fc45d98546b7ef2803f2ddbcb73b7f6782` |
| City palette / presets | `f129cca3041b55b84de26048dad7aef8fac8b292` |
| Current GLB exporter | `ad63b2ac6282b97df08f54b24bcf0cf3d4aa1891` |

## PROTECTED BOUNDARIES

- Pilot 04 / v1.2 remains rejected history; do not revive it as current attachment logic.
- Accepted Dom v0.2 remains unchanged.
- City S2 collision/export geometry remains undeformed.
- No OSM landmark manifest entry is created by this handoff.
- No collision, bumper force, restitution, vehicle impulse or auto-drive behaviour is created here.
- No second Audio engine or beat runtime is created.
- No new movement/camera/persistence owner is created.
- Experimental work stays outside Live until an explicit Stage/consumer slice accepts it.

## CURRENT STATUS MATRIX

| Slice | Status | Human status |
| --- | --- | --- |
| Dom v0.2 cartoon proof | IMPLEMENTATION + TESTED RESULT | **GEORG ACCEPTANCE** for cartoon abstraction/material direction; OSM accuracy still open |
| Pilot 01 · Eiffel / Giza / Stonehenge | IMPLEMENTATION + numerical/GLB TESTED RESULT | no final per-landmark acceptance |
| Pilot 02 · Pentagon / Spasskaya / Kremlin wall | IMPLEMENTATION + numerical/GLB TESTED RESULT | no final pack acceptance |
| Pilot 03 · Grotesque / Soft Cubist / Giza Voxel/Boxel | IMPLEMENTATION + TESTED RESULT | **DECISION: Grotesque is landmark default** |
| Pilot 04 · Clock sockets / Rig v1.x | **ARCHIVED FAILED HISTORY** | rejected by Georg screenshots |
| Pilot 05 · Semantic Band Rig v2 | IMPLEMENTATION + STATIC/NUMERICAL + CPU VISUAL TESTED RESULT | **GEORG ACCEPTANCE on 2026-09-19:** “das klappt” / “sieht richtig cool aus” |
| Pilot 06 · Grotesque World Style / OSM + Travel | IMPLEMENTATION + 1,354/1,354 TESTED RESULT | human visual review OPEN |
| OSM/City integration | OPEN | not integrated |
| Race/Travel contact integration | OPEN | not implemented |
| Audio-driven beat integration | OPEN | not implemented |
| Public Stage deployment | OPEN | no fixed Pilot-05 Stage URL claimed |

**Acceptance boundary:** Georg's Band Rig v2 acceptance remains valid. **New DECISION on 2026-09-19: City Grotesque is the default landmark deformation profile.** Soft Cubist remains an alternate/debug mode. This still is not a Race/OSM integration acceptance, and it does not change the OSM City Lab's own current `cartoon` default.

## CURRENT IMPLEMENTATION

Pilot 05 uses four semantic affine bands:

```text
lower   0 → 30.2 m
clock   30.2 → 46.475 m
belfry  46.475 → 53.6 m
tent    53.6 → 71 m
```

The key invariant is simple:

> `clock-stage` and every `clock-*` component share exactly the same clock-band transform.

This replaced the failed socket architecture where abstract sockets and the rendered coarse host diverged.

The Three.js review path retains real scene groups / pivots for the bands, allowing later presentation reactions without reassigning physics ownership.

## ACTUAL TESTS / EVIDENCE

### Band Rig v2

**159 / 159 current-source checks PASS.**

Spasskaya:
- 3,496 triangles;
- min Y = 0;
- source host/clock standoff = 0.080 m;
- City Grotesque standoff ≈ 0.071586 m on all four faces;
- max transformed mount error ≈ 2.13e-15 m;
- Soft Cubist standoff ≈ 0.084910 m;
- max transformed mount error ≈ 1.31e-15 m.

Kremlin wall:
- 5,008 triangles;
- min Y = 0;
- max mount error ≈ 2.07e-15 / 2.16e-15 m.

The QA first reproduces the rejected v1.2 host miss before validating v2.

### Visual evidence

- deterministic CPU z-buffer/triangle raster from the exact generated production vertices;
- same-camera before/after stored on GitHub;
- front/right/oblique views inspected during production;
- user subsequently opened the final standalone in a real browser and explicitly accepted that the fix works and looks right.

Agent-side automated WebGL capture remains open because Chromium EGL/ANGLE initialization failed in the tool environment. Do not rewrite that as automated browser evidence.

### Earlier evidence retained

- Dom v0.2: 53/53 geometry/static checks;
- Pilot 01: 111/111 geometry/export/placement-guard checks;
- Pilot 02: 176/176 numerical/export checks;
- Pilot 03: 60 source/numerical/syntax checks;
- Pilot 04: retained only as rejected history / diagnostic donor.

## IMPORTANT EXPORT LIMIT

The current GLB exporter is still the Pilot-01 material-zone exporter. It calls `mergeZones(asset)`, so it **does not preserve the semantic Band Rig hierarchy as GLTF nodes**.

Therefore:

- exported visible geometry is useful;
- Band Rig semantic hierarchy is currently an authoring/runtime-source contract;
- preserving `lower / clock / belfry / tent` in GLB is an explicit backlog item, not a completed feature.

## WSA REVIEW CHECKLIST

1. Read this package, then the current [World Style v1 RETURN](LANDMARK_WORLD_STYLE_V1_RETURN_2026-09-19.md), Band Rig v2 RETURN and Visual Evidence.
2. Open Pilot 05 from a static host / local served repo and compare:
   - Band Rig v2 vs Legacy point deform;
   - City Grotesque vs Soft Cubist;
   - normal material palette vs semantic-band debug palette.
3. Treat the current band hierarchy as donor presentation structure, not physics.
4. Review the proposed receiver seams below before assigning any Race/Travel integration.
5. Keep Pilot 04/v1.2 as failure history; do not patch forward from the socket model.


## WORLD STYLE BRIDGE ADDENDUM · 2026-09-19

Current authoring implementation: [Pilot 06](../landmarks/pilot-06/index.html) · [RETURN](LANDMARK_WORLD_STYLE_V1_RETURN_2026-09-19.md) · [1,354/1,354 evidence](../evidence/2026-09-19-landmark-world-style-v1/summary.json).

The current modular set (Eiffel, Giza, Stonehenge, Pentagon, Spasskaya, Kremlin wall study) now opens Grotesque-first with landmark-specific cartoon palettes. The viewer can consume either current OSM City presentation constants or a pinned noncanonical snapshot of the current private Travel/TinySkies-derived sky/light/mood/biome values. Travel remains the owner.

Prepared next-geometry catalogue: [GENIUS_LOCI_CANDIDATES_2026-09-19.md](GENIUS_LOCI_CANDIDATES_2026-09-19.md).

## OPEN POINTS / BACKLOG

### P0 · review / product gate

- **OPEN:** WSA technical review of Band Rig v2 source and receiver boundary.
- **DECISION:** landmark deformation baseline = **City Grotesque**. Soft Cubist remains alternate/debug.
- **OPEN:** visually review Pilot 06 in Travel Verdant/Day and OSM City contexts.
- **OPEN:** automated real-browser/WebGL regression on a usable browser runner.
- **OPEN:** fixed public Stage URL for Pilot 05 if/when WSA wants shared review outside the source/download path.

### P1 · integration foundation

- **OPEN:** generalize the semantic rig from Spasskaya-specific part-name rules into a small declarative landmark rig manifest.
- **OPEN:** semantic GLB/export path that preserves band/group names and pivots instead of flattening only by material zone.
- **OPEN:** first true OSM Golden Sample: Cologne Cathedral with verified OSM identity, footprint centroid, real metre scale, yaw/orientation, height calibration and existing Landmark Override fallback behaviour.
- **OPEN:** consumer load/fallback test: do not hide the OSM base building until replacement load + fit validation succeeds.
- **OPEN:** LOD/performance rules for hero landmarks vs district buildings.
- **OPEN:** mobile/Safari/iOS visual and lifecycle tests.

### P1 · surface / material language

- **OPEN:** one bounded surface pass using existing `skills/kfb-box-material.js`.
- **OPEN:** use the verified `media/3D_Assets/KFB/edge3.jpg` as edge/bevel treatment where appropriate.
- **OPEN:** compare paper / cardboard / clay / stone procedural families.
- **OPEN:** weathering / grime / vertical streaks / edge wear after geometry and scale are stable.
- **OPEN:** keep geometry deformation, construction grammar and surface style as separate switches.

### P1 · Living Toy World receiver seams

North Star remains:

> **the world as a breathing, living toy**

Current reactor is presentation-only. Future receiver work:

- **OPEN:** consume real beat / bar / intensity / band-energy signals from the existing Audio owner rather than generating a second music runtime.
- **OPEN:** define normalized landmark reaction inputs: `idle`, `beat`, `impact`, optional bass/mid/treble.
- **OPEN:** instance-friendly environment reactor for OSM buildings / props with bounded animation cost.
- **OPEN:** mode lifecycle: idle ↔ disco ↔ stunt race ↔ biome-specific vibe.

### P1 · Race / parcours / pinball contact seam

- **OPEN:** receiver-side collision/contact prototype under the existing Race/Travel contact owner.
- **OPEN:** define bumper/contact volume independently from the deformed presentation mesh.
- **OPEN:** validate rebound strength / curve, controller stability, cooldown and anti-stuck behaviour.
- **OPEN:** impact → presentation reactor event seam.
- **OPEN:** impact → existing Audio/FX owner event seam.
- **OPEN:** auto-drive/support behaviour only after contact physics proves stable.
- **OPEN:** persistence/mode reset so reactive landmarks cannot corrupt saved world state.

### P2 · construction variants

- **OPEN:** Giza Voxel Steps material proof.
- **OPEN:** Boxel / brick-toy look with optional studs only after performance check.
- **OPEN:** reuse existing voxel/edge material donors; no second voxel shader unless the existing path proves insufficient.
- **OPEN:** determine whether voxel/boxel is a per-landmark variant, a world mode, or both.

### P2 · landmark expansion

Existing candidates:
- Cologne Cathedral — accepted style proof, needs real OSM calibration;
- Eiffel Tower;
- Giza;
- Stonehenge;
- Pentagon;
- Spasskaya / Kremlin wall study.

Next proposed scenery:
- **Acropolis / Athens** — clean historic grouped-architecture proof;
- **Area 51 + crashed UFO** — public geography + explicitly surreal/fictional underground/base layer; strong living-toy/reactive candidate;
- **JFK / Dealey-style route** — source-backed city/scenario slice using City Lab; speculative/conspiracy overlays kept separate from geographic truth;
- **Underwater Atlantis** — biome / general impossible-geometry architecture, not reproduction of a specific Escher artwork.

### P3 · broader world-system follow-up

- **OPEN:** insert accepted landmarks through the existing Hürth → corridor → Ehrenfeld world architecture where geographically or surrealistically intended.
- **OPEN:** explicit distinction between real geographic landmark overrides and deliberate surreal KFB placements.
- **OPEN:** add landmark catalogue / review metadata only after Registry/Librarian owner agrees on the source contract.
- **OPEN:** fixed Stage navigator entry should point at the accepted consumer; it must not become a second runtime or SSOT.

## RECOVERY ORDER FOR WSA

`KFB-Stunt-Car-Race/AGENTS.md → RECOVERY.md → latest WSA checkpoint → this Race handoff pointer → pinned kayfabizarro Review Package → Pilot-05 RETURN → evidence → source`.

Do not reconstruct the landmark donor from prose; consume the pinned source.

## DONE WHEN — HANDOFF

- source, tests, evidence and failed history are identified;
- Georg's current visual acceptance is recorded with its boundary;
- all known open integration seams and backlog items are explicit;
- WSA receives a pinned Race-side pointer;
- no owner or runtime is silently replaced.

## EXACTLY ONE OPEN HUMAN REVIEW QUESTION

**For landmark-review pages, should the default environment be Travel Verdant / Day or OSM City Lab?**
