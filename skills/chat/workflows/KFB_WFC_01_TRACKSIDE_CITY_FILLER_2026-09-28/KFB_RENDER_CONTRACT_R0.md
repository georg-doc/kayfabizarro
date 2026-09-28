# KFB Render Contract R0 · Contact Shadows, Clipping and Clay Detail

Status: `BINDING REBRIEF · IMPLEMENTATION SLICE REQUIRED`  
Applies to: WorldBuilder, Racer/Travel, Combat, Resident Atlas, ToolBox previews and future WFC output  
Owner: one shared KFB render-preset module; consuming runtimes retain scene/gameplay ownership

## Why this is global

The repeated defect is not an isolated boulder or building error. The current evidence shows two coupled classes:

1. **shadow detachment / peter-panning** — dark or bright rims under eyebrows, props and buildings because one oversized directional-shadow volume and guessed bias values are used across very different scales;
2. **clay-detail aliasing** — high-frequency relief/normal/displacement reads as stripes, moiré or crawling noise in motion and at rest.

Every slice tuning its own `bias`, `normalBias`, shadow camera and texture density guarantees drift. Values such as `normalBias = 0.15` are not a reusable fix.

## Architectural rule

Create one versioned preset contract, consumed by all hosts:

`kfb.render-preset/1`

It owns only presentation policy and measured presets. It does **not** own scene graph, camera controls, world layout, physics, materials authored by K2, or gameplay.

No runtime may silently override the shared preset. A local exception must be named, measured and written to the scene's Return.

## Shadow policy

### Scale classes

Every caster/receiver declares one class:

- `FACE`: eyes, eyelids, eyebrows, mouth and small attachments;
- `ACTOR`: residents, player characters, backpacks and handheld props;
- `PROP`: rocks, furniture, vehicles and trackside pieces;
- `ARCHITECTURE`: buildings, bridges and landmarks;
- `TERRAIN`: road, sidewalk, ground and terrain receivers.

Face shadows are never tuned with the architecture preset.

### Tight shadow volume

- Fit the directional-light shadow camera to the active gameplay envelope, not the entire loaded world.
- Quantize/stabilize the fitted volume in light space to prevent shimmer.
- Architecture outside the active envelope uses baked, blob/contact or no dynamic shadow according to LOD.
- Never enlarge the shadow box merely because distant scenery is loaded.

### Bias calibration

- Calibrate `bias` and `normalBias` against actual world units and texel size for each scale class.
- Prefer the smallest value that removes acne in a neutral diagnostic scene.
- A detached contact edge, bright rim or floating shadow is an automatic FAIL.
- Do not fix missing ground contact with arbitrary object translation.
- Keep collision/ground truth independent of the presentation mesh.

### Contact strategy

- Near actors/vehicles: dynamic primary shadow plus a subtle bounded contact component when required.
- Mid props/architecture: shared low-cost shadow policy.
- Far scenery: no dynamic shadow or a baked/analytic proxy.
- Transparent/decal/eyebrow meshes get an explicit caster/receiver policy; they do not inherit blindly.

## Clay surface policy

Use K2 as the accepted material language, but tier its cost and frequency.

| Tier | Use | Surface detail |
|---|---|---|
| Near | hero actor/prop and nearby ground | full K2 relief within measured screen-space limit |
| Mid | normal gameplay scenery | reduced normal/roughness; no dense micro-displacement |
| Far | skyline/background/fast travel | palette and broad form only |

Rules:

- relief frequency is selected by expected screen-space size, not texture-image size alone;
- generate and use mipmaps; use bounded anisotropy only where oblique road/ground views need it;
- reduce normal strength before detail becomes sub-pixel;
- no unique high-resolution clay texture per object;
- no full K2 toolmix on repeated WFC filler;
- texture arrays/atlases and instanced material parameters are preferred;
- distant clay identity comes from silhouette, palette and broad dents, not scratches.

## Required diagnostic scene

One shared scene must contain:

- face/eyebrow close-up;
- actor on ground;
- boulder/prop;
- vehicle;
- building corner;
- road/curb/sidewalk;
- near, mid and far instances of the same clay material;
- day, low-angle and night/lighted presets;
- still camera and slow pan.

Capture:

- beauty;
- shadow map / caster classes;
- normals;
- depth;
- material tier;
- overdraw or draw-call summary where available.

## Acceptance gates

At the direct gameplay route and narrow viewport:

- no bright rim where a shadow is expected;
- no detached dark contact band;
- no actor/vehicle visibly floating;
- no moiré/striping at rest;
- no crawling clay detail during camera or actor movement;
- no shadow popping inside the active gameplay envelope;
- stable ground contact for walk, drive, jump and idle;
- reported GPU/frame cost does not regress beyond the slice's agreed budget.

Test at minimum:

- desktop high preset;
- desktop/mobile fallback preset;
- camera close to ground;
- orbit below actor/prop where the tool supports it;
- movement through one WorldBuilder zone transition.

## Fallback ladder

1. reduce shadow casters and active shadow envelope;
2. step material from Near to Mid/Far;
3. disable micro-displacement, then dense normal detail;
4. lower shadow resolution only after fitting the volume;
5. replace distant dynamic shadows with analytic/baked proxies;
6. preserve silhouettes, palette and gameplay before surface noise.

## First implementation slice

`RENDER-R0 · Shared diagnostic + preset adapter`

- extract current shadow/light/material settings from World M2, Resident Atlas and one Racer/Track preview;
- build the shared diagnostic scene;
- derive the first FACE / ACTOR / PROP / ARCHITECTURE presets;
- implement one adapter without changing runtime ownership;
- prove Original/Clay and near/mid/far;
- integrate first into World M2, then reuse unchanged in other consumers.

Do not tune every production scene in this slice. Prove the contract once, then migrate consumers one at a time.

## Protected boundaries

- no new renderer;
- no second camera owner;
- no K2 material redesign;
- no geometry remodeling as a substitute for fixing the shadow setup;
- no per-scene magic numbers;
- no claim of global PASS until World, Resident and Racer each consume the same versioned preset and pass their direct browser routes.
