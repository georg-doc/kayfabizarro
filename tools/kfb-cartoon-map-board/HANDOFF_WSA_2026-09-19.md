# WSA HANDOFF · KFB Cartoon Map Board P0.2 · 2026-09-19

Status vocabulary is explicit: **DECISION | IMPLEMENTATION | TESTED RESULT | PUBLIC DEPLOYMENT | GEORG ACCEPTANCE | OPEN**.

## GOAL

Hand the current **KFB Cartoon Map Board P0.2 Story Focus** to **WSA / Race integration lead** as a reviewed presentation/storytelling donor.

This handoff does **not** integrate it into Race, does not create a second world runtime, and does not change any existing movement, physics, collision, camera, progression, Card, rigging, audio or deployment owner.

## EXISTING OWNER

- **WSA / Race** remains integration lead.
- **KFB Cartoon Map Board** owns only map-board presentation, geographic-piece interaction and declarative story-anchor placement.
- **OSM City Lab** owns detailed city normalization / local-metre city geometry.
- **KFB Ink Canon + CardBuilder** keep card-outline and PDF/Card rendering ownership.
- **Asset Registry / central GitHub assets** keep asset identity and provenance.
- **Travel / Free Roam / Race** retain their existing world, movement, contact, camera and persistence owners.

## EXACT SOURCES / REVISIONS

Recovery snapshot before this handoff:

- `georg-doc/kayfabizarro@1e9318954c584e8af8498024fd1342e61b604faf`
- latest Map Board-specific implementation commit: `43dc6f45748aa62cec3bb3515aee868e1d0dc529`
- runtime build stamp: `p0.2-r7-solid-country-tiles`

Current source blobs at that recovery snapshot:

- `tools/kfb-cartoon-map-board/index.html` → `aac77aea10aca23b4b70c52a9da84a85b3dbfa08`
- `tools/kfb-cartoon-map-board/src/app.js` → `ec4ab3df7175bc2375e299f1e828982e05a1b8b4`
- `data/story-demo.v1.json` → `4a59e7106b5a98bad51894c475ee09f6246a5517` · schema `kfb-map-story/v1` · version `1.0.1`
- `data/europe-p0/SOURCE_SPEC.json` → `2f95d5e16360565aa6ad4797c4938a6f0ec7c5ab`
- `docs/STORY_FOCUS_P02.md` → `560d60bb6d7779e7257a7a229298f6445bd27457`
- `qa/public.mjs` → `f3c70d442e928af43807b5a7d2bf1b7f7aabd793`
- `README.md` → `8ac49aac873bf9927cc9235ce5d1d07d0680037f`
- `CHANGELOG.md` → `97b6f2a728cacf31b9f050802177a671d3bb822d`
- `RECOVERY.md` → `01abd62b926048bbe792f1f397761b1344c70e6c`

Race integration reference at handoff time:

- `georg-doc/KFB-Stunt-Car-Race@3d21812903b6d1c015252cddf386328d4cec4fb2`

Candidate fixed donor URL:

- `https://kayfabizarro.pages.dev/tools/kfb-cartoon-map-board/`

Hub pointer already exists under:

- `https://kayfabizarro.pages.dev/kfb-hub/free-roam/`

Neither URL is promoted here as a new Race SSOT.

## WHAT EXISTS

### IMPLEMENTATION

P0.2 currently provides:

- OSM-derived Europe country pieces from the OpenPlanetData country-boundary catalogue;
- individual extruded Three.js country tiles;
- KFB-style continuous Map BAND border ribbons with deterministic wobble and south-east weight bias;
- physical lighting/shadows;
- orbit + HERO/TOP/LOW camera presets;
- hover and selection lift;
- selected-country focus ring;
- smooth `FOCUS` camera action;
- `EXPLODE / RECOMBINE` with content remaining attached to geographic owners;
- declarative `NEXT STORY` sequence from `story-demo.v1.json`;
- actual KayKit Board Game Bits loaded from the central GitHub asset source;
- diagnostic build stamp and browser-report surface;
- a public Playwright proof script and GitHub Actions workflow.

### DECISION

The map board is a **presentation/story donor**, not a replacement for detailed OSM city geometry or any Race world/movement system.

At city scale, the hierarchy must hand detailed geometry back to `tools/osm-city-lab/`.

The KFB map border is a map-specific world-space adapter. It does not redefine the image-plane card-ink contract.

## PROTECTED BOUNDARIES

WSA review must preserve all of the following:

- no second Race/Travel world runtime;
- no second movement, physics, contact, collision, camera or recovery system;
- no replacement of OSM City Lab at detailed city scale;
- no replacement of KFB CardBuilder / PDF-card rendering;
- no promotion of the map-specific border ribbon into card-ink SSOT;
- no copied/rebuilt KayKit substitute assets when the GitHub asset already exists;
- no Live promotion from this donor review;
- no assumption that a fixed URL is deployed merely because source exists on GitHub.

## TESTED RESULT

Confirmed in the existing project record:

- JavaScript static syntax check: **PASS**.
- JSON/source-reference checks are encoded in the dedicated workflow.
- source readback on GitHub: **PASS**.
- exact browser proof script exists and checks:
  - fixed Cloudflare route;
  - exact runtime build identity;
  - complete Europe country load;
  - zero country failures;
  - all five story anchors;
  - KFB Ink capability;
  - `NEXT STORY`;
  - `EXPLODE`;
  - browser errors;
  - screenshots.

Not claimed in this handoff:

- a successful current Playwright run for build `p0.2-r7-solid-country-tiles`;
- current Cloudflare publication of the exact build;
- Georg visual acceptance.

Therefore:

- **IMPLEMENTATION:** present
- **STATIC TESTED RESULT:** PASS
- **REAL BROWSER TESTED RESULT:** OPEN / not verified here
- **PUBLIC DEPLOYMENT:** OPEN / not claimed
- **GEORG ACCEPTANCE:** OPEN

## OPEN POINTS / BACKLOG

Priority is intentionally ordered. Do not expand the first gate into a larger integration slice.

### P0.2-GATE · browser + visual acceptance

1. Run the existing public proof against the exact `p0.2-r7-solid-country-tiles` build.
2. Preserve evidence screenshots for HERO, story-focus and exploded states.
3. Confirm no countries are missing, split incorrectly or rendered hollow after the latest ring/topology fixes.
4. Georg visual review: board scale, palette, paper feel, border wobble, lower-right ink weight, tile thickness and KayKit marker scale.
5. Only after that review, classify P0.2 as a tested visual donor.

### P1 · deterministic / pinned source

6. Replace live boundary-catalogue dependency with a committed or otherwise revision-pinned Europe snapshot plus provenance and checksums.
7. Pin KayKit runtime asset revision instead of consuming mutable `main`.
8. Pin or capability-lock the KFB Ink import so a later `main` change cannot silently alter the donor.
9. Record payload sizes and boot timing, especially Nordic / island-heavy geometry.

### P2 · hierarchy contract

10. Add `continent -> country -> region -> city` drilldown without duplicating city ownership.
11. Define the exact transition payload that hands a chosen city/area to OSM City Lab.
12. Keep the Europe presentation projection out of collision/physics contracts.
13. Decide how islands, overseas territories, disputed/edge administrative geometries and multi-part countries are presented without falsifying OSM geometry.

### P3 · story presentation

14. Add route/arc overlays as presentation only.
15. Add multi-anchor sequences and timed focus/explode choreography.
16. Add source/evidence metadata to story anchors without turning demo story JSON into a global canon.
17. Keep normal attention budget compact; do not allow map callouts to become a second dialogue/UI runtime.

### P4 · KFB cards

18. Consume current `skills/kfb-embed-bundle v3/` before rendering real Cards.
19. Instantiate PDF/CardBuilder cards above map anchors; do not rebuild a map-local Card viewer.
20. Keep card ink on the image-plane contract while geographic borders remain map-world geometry.
21. Prove occlusion, camera-facing behavior and performance with multiple cards before broad rollout.

### P5 · authoring / persistence

22. Define save/load for map level, focus area, camera, story cursor, token placements and card anchors.
23. Keep any persistence contract separate from Race/Travel persistence until WSA explicitly accepts a seam.
24. Add authoring only after the viewer interaction and data hierarchy are accepted; do not turn P0.2 into an editor prematurely.

## DONOR VALUE FOR STUNT WORLD

Potential later reuse, subject to WSA acceptance:

- a world/region selection table before entering a driveable slice;
- map-level storytelling for Resident/Card chains;
- physical board-game visualisation of routes, evidence, events and surreal KFB world jumps;
- a high-level `Europe -> country -> region -> city` navigation donor that hands city execution to OSM City Lab;
- later KFB Card placement using the existing CardBuilder.

It should **not** become a navigation owner for the active drive loop merely because it can display geography.

## DONE WHEN

This handoff is complete when WSA can review one pinned donor package and can answer the single human gate below without reconstructing chat history.

No runtime merge into Race is requested by this handoff.

## EXACTLY ONE OPEN HUMAN REVIEW QUESTION

**WSA: Soll P0.2 als nicht-ownender Stunt-World-Map/Storytelling-Donor akzeptiert werden, mit dem festen Vertrag „administrative Board-Geometrie hier, detaillierte City-Geometrie ab City-Level zurück an OSM City Lab, Cards weiterhin über den bestehenden KFB CardBuilder“?**
