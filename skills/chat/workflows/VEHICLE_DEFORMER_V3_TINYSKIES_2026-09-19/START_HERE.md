# Vehicle Lab v3 · TinySkies / Travel flight bridge

Status: **APPROVED BRIEFING · IMPLEMENTATION NOT STARTED**  
Owner: ToolBox authoring; receiving runtimes remain Race and Travel.

## Product ladder

### C0 · accepted baseline

Real OSM city data plus the existing, already tested Free-Roam driving base. Roads, open city floor,
buildings and driving physics stay intact.

### C1 · next playable candidate

C0 plus:

- the current selectable vehicle set;
- the presentation-only Cartoon Vehicle Deformer v2;
- TinySkies/Travel-derived terrain, light, palette, atmosphere and landmark language;
- OSM buildings interpreted in the same visual family as the observatory, houses and lighthouse;
- one clean drive-to-flight transition candidate.

C1 is a Stage candidate until Georg has driven it. It must not overwrite the current Live route.

## Source order

1. Current GitHub state and owner contracts.
2. Vehicle Deformer Lab v2 intake under `tools/KFB-ToolBox/_inbox/`.
3. Travel Globe sources under `travel/wip/travel_globe_wsa/`.
4. TinySkies donor `dannylimanseta/tinyskies@2659a5cc987d7e4a4c5aa7e79c86a1626ad75df6`.
5. OSM C0 receiver in `georg-doc/KFB-Stunt-Car-Race`.

Reuse measured code and ratios. Do not reconstruct working behavior from prose or screenshots.

## Vehicle Lab v3 assignment for Claude Design

Produce a complete editable export, not screenshots and not a second driving runtime.

### Tab 1 · Drive

Keep v2 behavior and its 23 sequences. Preserve the one-way signal seam:

`speed · longAccel · lateral · bank · drift · railImpact · landing`

The lab may show the response. It may not own world position, collision, grip or recovery.

### Tab 2 · Flight

Build the missing flight family in three bounded passes:

1. **Measured frame:** span, fuselage length, wing plane, hull center and forward axis.
2. **Flight response:** roll, pitch and yaw around the measured frame. Bank is derived from speed
   and curve; it is not a second arbitrary pose control.
3. **Cartoon response:** `FLIGHT_LIGHT` profile plus gust, impact, pull-out and touchdown as spring
   impulses. Test at least six fixtures, including the smallest paper plane and largest spaceship.

### Tab 3 · Drive ↔ flight bridge

Use the existing `steer → susp → spin` wheel hierarchy. One 0–1 transition value jointly controls
wheel fold, ride height and thrust direction. The first candidates are the three Space Trucks.
No second model is required for the first proof.

### Visual study strip

Add three reproducible looks on the same scene and camera:

- TinySkies daylight;
- KFB grotesque daylight;
- strange/fractal dusk.

For each look expose only the useful recipe: palette, key/fill/rim, fog/atmosphere, water/terrain
material, building massing and outline treatment. No permanent developer dashboard in normal use.

## C1 world interpretation

OSM remains the geographic skeleton. TinySkies/Travel supplies the visual grammar:

- roads and building footprints remain geographically true;
- roofs, towers, observatory, lighthouse and houses share one modular silhouette family;
- color and light are global presets rather than per-asset patchwork;
- shaders stay bounded and readable on mobile;
- visual deformation never replaces the simpler collision shell.

## Required return

Return one folder with:

- full source and entry HTML;
- additive changelog;
- exact source pins;
- list of intentionally changed v2 files;
- browser test notes for Drive, Flight and transition;
- screenshots from one fixed camera for the three visual looks;
- explicit `IMPLEMENTED / TESTED / OPEN / GEORG ACCEPTANCE` separation.

Do not claim a flight PASS from loading a model or showing a flight tab.

## Acceptance path

1. Lab: one ground car and six flight fixtures.
2. C1 OSM Stage: accelerate, brake, turn, drift, jump/land; physics remains C0.
3. Travel Stage: take off, curve with derived bank, land, return to ground mode.
4. Mobile: open Stage URL, choose candidate and start without GitHub or desktop setup.
5. Georg accepts the candidate before promotion from Stage to Live.
