# G0 Dependency Trace

## Intended G1 dependency direction

```text
Ground PR #294 ── actor pose / locomotion
        │
        ├── boundary handoff adapter (new, state transfer only)
        │
Race v0.8 + FR-S04-02 ── vehicle pose / contact / feel
        │
        ├── KayKit car_hatchback visual
        └── J14 P1a pad/track geometry
```

There is no reverse import from Race into Ground, no import from J14/J15 drive loops, and no Hex/WFC dependency in G1.

## Race source read-back

| File | Direct imports | Local data URLs | Finding |
|---|---|---|---|
| `feel-lab-v08.mjs` | `three`, `GLTFLoader`, `race-track-adapter.mjs` | Flow recipe, Race flow config, Race feel config | No OSM; host is route/feel source. It offers KayKit and Kenney visuals, so G1 must select KayKit and omit the Kenney map. |
| `race-track-adapter.mjs` | none | none | Track recipe adapter only; no movement writer. |
| `free-roam/site/physics.js` | Rapier, `world.js` | none | Physical pose/contact owner; no OSM. |
| `free-roam/site/drive-intent.mjs` | none | none | Semantic input adapter; no world writer. |
| `free-roam/site/world.js` | none | none | Shared world/contact declarations; includes legacy Kenney world candidates, so G1 may not import its presentation inventory wholesale. |

## Forbidden dependency test

G1 must fail its static gate if the receiver imports or references:

- OSM, R0B, R6, M2A or `wb2d-app.js`;
- Kenney vehicle meshes;
- J14 `kfb-drive.k2.js`, `kfb-drive.k2b.js`, `kfb-drive.k3.js` or its Flight candidate;
- J15 Travel/input logic;
- a second Ground transform writer or a second Drive vehicle-pose writer.

The Free Roam `world.js` file is source evidence for contact, not permission to pull its full environment or Kenney presentation into G1.
