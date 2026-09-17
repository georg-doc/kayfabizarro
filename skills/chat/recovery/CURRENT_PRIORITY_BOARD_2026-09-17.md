# CURRENT PRIORITY · 2026-09-17

**Status:** CURRENT EXECUTION BOARD · GitHub/project SSOTs override this summary.

## P0 · Travel Ground gate

Use:

`https://kayfabizarro.pages.dev/travel/wip/travel_globe_wsa/world-builder/?wb0=1&ground=8`

Human checks:

- Fernando forward;
- Mech: hold W → Space → LAND → locomotion, without visible landing glide;
- Monstrosity W / Shift+W cadence;
- LMB short click remains free, LMB drag orbits;
- RMB look remains;
- no regression to the already-positive terrain/card support result.

Do not turn this into another movement-polish loop if the gate carries.

## P0 · Atlas site promotion

Source intake is present and reviewed:

- `tools/KFB-ToolBox/_inbox/KayKit Resident Atlas/`
- `tools/KFB-ToolBox/_inbox/KayKit Environment Atlas/KFB_World_Atlas_v1_EXPORT_2026-09-17/`

Promotion branch:

`atlas/site-promotion-recovery-2026-09-17`

Candidate routes after merge/deploy:

- `/resident-atlas-s6/`
- `/world-atlas/`

Rules:

- original inbox exports remain unchanged;
- existing assets always come from GitHub when available;
- no duplicate model store;
- promoted runtime asset URLs are pinned to GitHub revision `8948a06b75cb18c970599afb29b6a772315fad0e`; the unchanged inbox exports retain their historical `main` references as provenance;
- preview/site success is not Travel or Animation L5.

## P1 · First Travel Atlas consumer slice

After Ground gate + Atlas browser QA:

one resident ensemble + one environment/landmark/path composition in the real Travel Ground world.

Compare the same composition as:

1. visible hex base;
2. terrain-seated/inset base;
3. no visible hex base.

Required proof:

`place → save → reload → walk from terrain onto/into the authored place → reach resident/landmark → preserve transforms/material calibration`.

Do not mass-import the Atlas before this slice works.

## P1 · Interaction + narrow Combat donor

After the authored-place proof:

`walk there → select/interact → visible response → narrow Combat action/target → return to free exploration`.

Ground, Movement Lab and Combat ownership stay separate.

## P2 · Dungeon consumer proof

Donor:

`KayKit_Dungeon_Generator_S13_2.html`
+ `dungeon-grid.js`
+ `dungeon-light.js`.

First proof only:

`entrance → walkable room/corridor → exit`.

Do not claim until Travel proves:

- actor wall collision;
- support/floor selection;
- level/stockwerk handling;
- door clearance;
- camera behavior;
- return point.

The donor's 108 generated-layout checks are useful L4 evidence, not Travel begehbar/L5 evidence.

## Parallel ToolBox lane

Keep the reviewed WS0 source baseline and current Stage-First direction:

`Actor · Face · Pose · Motion · Voice · Stage`.

Atlas previews may feed Stage/Resource Picker later, but they do not replace the ToolBox implementation cursor or Registry/Librarian ownership.

## Recovery

Read:

1. `CURRENT_LEAD_CHECKPOINT_2026-09-17.md`
2. `tools/KFB-ToolBox/_handover/ATLAS_INTAKE_2026-09-17/START_HERE.md`
3. Travel: `ATLAS_PORTABILITY_SPRINT_2026-09-17.md`
4. current project SSOT before any implementation.

No Bash/terminal action is required from Georg for this sequence.
