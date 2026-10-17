# MVP Travel Integration · readiness recon and tomorrow runbook

Status: **DRAFT PLANNING · NO RUNTIME OR LIVE PROMOTION**  
Date: 2026-09-20  
Planning owner: KFB Integration Lead  
Source branch: `codex/mvp-travel-readiness-2026-09-20`  
Proposed implementation owner: **KFB Stunt Car Race / WSA**  
Proposed future Stage: `https://kayfabizarro.pages.dev/kfb-hub/stage/stunt-world/mvp-travel-01/`

## Outcome

Tomorrow's first productive MVP slice is **one travel loop**, not a universe merge:

> Start in the current OSM Race world → drive one short designed route → perceive world palette, road contact and soundscape → operate the compact HUD → reset safely → return to Hub.

Combat, ToolBox, Dungeon and portals remain separately testable contributors. They must not be folded into the Race runtime in the first pass.

## Fresh GitHub recon

| Line | Current fact | Meaning |
|---|---|---|
| KFB Hub main | `26c00b98a60ec6346810f6777c1b7873600e1767` | Current shared router baseline. |
| KFB Hub live branch | `5b30825672e21546b9a36db56fe6ce35b31cc9b5` | Separate publish lineage; a main commit is not automatically a verified live Hub view. |
| Race main | `9de75c733824720f913f3060be392859e9c5a260` | Base for the Travel/Race implementation. |
| Race PR #30 | Draft, mergeable | HUD v4 is a **brief only**; it has no runtime implementation or human acceptance yet. |
| Race PR #24 | Draft, mergeable | TE-01 is a tested OSM-depth/KFB-Ink candidate; motion/art acceptance remains open. |
| Race PR #29 | Frozen | Its voxel terrain is the wrong substrate for this Travel/TinySkies line. Do not revive it. |
| Combat main | `f6a59ad15b9ffcf3164b0ab013f223962b63f61f` | Existing playable Arena stays untouched. |
| Combat PR #6 | Open, mergeable | CA2 plan and actor contract are prepared; it does not change the playable Arena. |
| Hub PR #128 | Open, mergeable | Adds CA2 cards/briefs, but cards are not canonical or guaranteed visible until it is rebased, reviewed, merged and published from the exact current Hub source. |
| CA2 Stage PRs #130/#135/#137 | Draft, mergeable | Isolated proofs; not runtime integration. #137 also has a recorded branch Pages build failure, so its exact public marker must be rechecked before consumption. |

## What is ready now

### Travel / Race

- The OSM Race host is the first real playable world.
- Contact and semantic audio already have dedicated Race evidence lines (A2 contact FX, A3 soundscape donor, RoadTrip radio intake).
- The current colour target is the Cologne race family: warm vermilion/orange atmosphere, teal track, gold guidance, dark charcoal/brown shadow and restrained red vehicle accents.
- TinySkies/Travel is the macro-world reference. Its globe/terrain source must be shown in isolation before a track is actually deformed onto it.
- Voxel remains a valid later instance-world technique, but is explicitly not the macro Travel substrate for this slice.

### Combat

- CA2-01 Actor Selector/Profile reports public browser evidence for Driver, GothGirl and Legacy **profiles only**.
- CA2-02 has a measured ranged profile; its pitch correction was frozen after two bounded repairs. Do not add a third blind Euler adjustment. It needs one externally authored transform against the frozen Aim frame.
- CA2-03 identifies a real Skeleton Warrior and a second enemy candidate; its state-playback work is an adapter proof. Arena HP, damage, rewards, respawn and three-slot mob ownership remain with WSA.
- Therefore a Dungeon Raid can consume a Skeleton only after the exact CA2 source/animation evidence is accepted and integrated by the Arena owner.

### ToolBox / Dungeon

- EyeRig Batch is a ToolBox candidate: Rig_Medium → measured FaceHost → EyeRig v6 → front/three-quarter/side human gate. It is not a mass-apply operation.
- The existing S13.2 generator remains Dungeon layout/two-level/recipe owner. Dungeon rooms use the original KayKit Dungeon pack; Tiny Treats belong to separate Bakery/Kitchen venues.
- No ToolBox, Dungeon or Combat runtime is a dependency for the first Travel loop.

## The one MVP slice for tomorrow

### Name

`MVP-TRAVEL-01 · OSM Race world loop`

### Exact boundaries

**Include**

1. Current Race main as the implementation base.
2. One OSM route already supported by the current Race host.
3. One measured world contract: palette, sky/fog, road/terrain contrast, one landmark/contour treatment.
4. Existing A2/A3 semantic audio events: road surface, speed/wind, engine/boost, one safe contact cue.
5. The current HUD direction from PR #30, implemented only as a bounded styling pass in the actual Race runtime: compact speed/tacho, real minimap route, real Almanac cards, no fake score/waypoint.
6. Desktop and mobile freeplay, reset/rescue, and Hub return.

**Exclude**

- spherical TrackPatch / Travel Globe deformation;
- Voxel terrain;
- new building generation;
- Combat actor lifecycle, weapons, Dungeon, portals and NPC dialogue;
- vehicle/character rig changes;
- generic dashboard chrome or placeholder assets.

### Required ownership

| Concern | Owner |
|---|---|
| OSM route, contact, vehicle, reset, minimap | Race runtime |
| palette/light/semantic OSM presentation | Race World module |
| audio event routing and master mix | one Race audio owner |
| HUD anchors and real data | Race HUD owner |
| public Stage mirror | KFB Hub publish handoff |
| human art/freeplay acceptance | Georg |

### Acceptance loop

- Load the exact public Stage URL.
- Drive for two minutes on desktop; check track readability, ground, one contact response and reset.
- Repeat basic controls on mobile.
- Toggle/inspect the actual HUD: no fake values, no blocked field of view, no lost touch controls.
- Confirm that sound starts only through an explicit player gesture and that radio/music does not mask safety/contact cues.
- One visual choice only: “This is the Race-world direction” or a named correction. Do not open a new redesign loop.

### Deliverables

- one Race branch and one implementation PR;
- `RETURN.md`, `SOURCE.json`, `TEST_REPORT.md`, additive `CHANGELOG.md`;
- exact Race commit, exact Hub mirror commit and fixed Cloudflare URL;
- desktop + mobile screenshots from the real Stage;
- browser tests that include source marker, map route, reset, HUD real-data markers, audio event routing and zero page/resource errors;
- one human gate.

## Recommended model allocation

**Sol** is sufficient for bounded, isolated preparation:

- source/PR reconciliation;
- Hub card manifest validation;
- Audio semantic-map inventory;
- ToolBox profile/source reports;
- tests, evidence packaging and Return documents.

Use **one Astra slice** for `MVP-TRAVEL-01`: it crosses Race route/contact, visual world contract, audio routing and HUD anchors while preserving existing owners. It should have the fixed boundaries above and no adjacent “nice to have” work.

Do not run Astra and Sol against the same Race runtime files. Sol finishes receipts and isolated checks first; Astra consumes only their pinned outputs.

## Blocking / sequencing order

1. **Hub reconciliation:** decide PR #128 disposition; rebase against current Hub main before merge. Do not manually copy its old `index.html` into live.
2. **Race source gate:** pin current Race main and verify which exact public OSM route is the first MVP route.
3. **HUD v4 implementation:** one actual runtime pass from PR #30’s approved brief, not a new mockup.
4. **MVP-TRAVEL-01 Stage:** build, test, public marker, mobile/desktop evidence, human gate.
5. **Combat:** only after its own reviews, WSA consumes CA2 profiles in the existing Arena.
6. **Dungeon Raid:** only after the accepted Combat enemy/actor handoff.
7. **Portal contract:** later; first a neutral Hub return link, then a door/portal visual.

## What is easy to miss

- “published on a branch” and “shown in the public Hub” are distinct facts;
- a public Stage with browser passes is still not human gameplay/art acceptance;
- no audio acceptance exists until an actual gesture-started mix is heard in the Race loop;
- no Combat readiness exists until the WSA consumes profiles inside the real Arena;
- TE-01 and CA2-02 have explicit human visual gates; do not paper over them with test counts;
- the Hub must render one manifest from current main. It cannot reliably become a write target for external chats without a controlled intake contract.
