# Return · KFB Cologne Race Option C · Claude Design preparation

Date: 2026-09-20  
Status: **RECOVERED · OSM READY · OPTION-C VISUAL AUTHORITY PINNED · CLAUDE BRIEF READY · RUNTIME NOT STARTED**

## Repository / branch / PR

- repo: `georg-doc/kayfabizarro`
- branch: `planning/cologne-race-option-c-claude-r3-2026-09-20`
- Draft PR: **#134**
- source + evidence checkpoint before this Return file: `7c3d2da3cedfccef05f10d067691381452664958`
- final branch head is recorded in PR #134 metadata after this Return commit

## Outcome

Recovered the interrupted Cologne Race preparation and made the Claude Design Slice C self-contained from GitHub.

Claude now has:

- real cached / normalized Dom-Zentrum OSM data;
- a lightweight `CLAUDE_CONTEXT.json`;
- exact Dom/HBF/bridge/tunnel anchors;
- two exact pinned Option-C visual authority PNGs;
- current public Race/vehicle/HUD/card/Kenney source pins;
- a corrected FILAMENT #02 reference boundary;
- a copy-ready start prompt;
- a recovery file;
- a return template;
- a static consistency report;
- a KFB Hub briefing card.

No extra user upload is required to start Option C.

## Product direction fixed in this slice

### Priority

`Option-C visual language → cool playable Track → recognisable Cologne anchors → OSM context → exact OMS architecture fidelity`

### Track freedom

The first loop does not need to map 1:1 to Cologne streets.

Allowed:
- Kölner Ringe / mapped streets where useful;
- alleys;
- plazas / courtyards;
- rooftops;
- ramps;
- bridges;
- explicit elevated structures between or above buildings;
- Rhine-side / Rhine-overlook sections.

OSM anchors the real city. It does not dictate the Track centerline.

When the route leaves the ground, use explicit Track structures rather than raising terrain to support it.

## FILAMENT #02

Verified original:
- `KilledByAPixel/SP13KTRA@166ad838`
- `code/levels.js@75189173db4f1e15537992c34590f6d8f34ce9b8`
- second campaign circuit / human Track #02
- `LICENSE@1204dfb62806e7944aa43de449352081733486f3`
- license: **All rights reserved**

The brief now uses FILAMENT only as a benchmark for:
- memorable opening beat;
- compression / release;
- tunnel / arch moment;
- fast/open versus tight/technical contrast;
- speed readability;
- overhead silhouette.

The KFB route must be authored independently from blank.

No SP13KTRA source, route geometry, coordinate sequence, palette values, scale, meshes, materials, scenery or assets may be copied/adapted/derived.

## OSM data

Canonical:
`tools/osm-city-lab/data/dom-zentrum-v0/`

Claude entry:
`tools/osm-city-lab/data/dom-zentrum-v0/CLAUDE_CONTEXT.json`

Verified:
- OSM base timestamp: `2026-09-20T03:20:04Z`
- raw SHA-256: `8ab058da444eee7bd54c367aec770bbe10c4bef2ddda636cd95b886f5dca244c`
- raw elements: 145,967
- roads: 5,236
- driveable roads: 2,523
- buildings: 6,351
- railway ways: 665
- water lines: 6
- deterministic source/normalization gates: PASS
- © OpenStreetMap contributors · ODbL 1.0

## Option-C visual authority

Pinned on public main:

1. `travel/wip/travel_globe_wsa/_inbox/KFB Racer Option C - ChatGPT Image 20. Sept. 2026, 05_06_22 (1).png`  
   blob `59fd27fcb5dae48bc159093427a3e688cc83b6a4`

2. `travel/wip/travel_globe_wsa/_inbox/KFB Racer Option C - ChatGPT Image 20. Sept. 2026, 05_06_22 (2).png`  
   blob `ac0bf0064c8af8235a49b97d3b7e5e8196ed5579`

Option A authority is deferred until after Georg's C gate.

## Changed files in PR #134 at the evidence checkpoint

- `kfb-hub/index.html`
- `skills/chat/CHANGELOG.md`
- `skills/chat/START_HERE.md`
- `skills/chat/workflows/KFB_COLOGNE_RACE_OPTION_C_2026-09-20/CLAUDE_DESIGN_BRIEF.md`
- `skills/chat/workflows/KFB_COLOGNE_RACE_OPTION_C_2026-09-20/CLAUDE_START_PROMPT.md`
- `skills/chat/workflows/KFB_COLOGNE_RACE_OPTION_C_2026-09-20/DATA_READY.md`
- `skills/chat/workflows/KFB_COLOGNE_RACE_OPTION_C_2026-09-20/FILAMENT_REFERENCE.md`
- `skills/chat/workflows/KFB_COLOGNE_RACE_OPTION_C_2026-09-20/FORM_ANSWERS.md`
- `skills/chat/workflows/KFB_COLOGNE_RACE_OPTION_C_2026-09-20/RECOVERY.md`
- `skills/chat/workflows/KFB_COLOGNE_RACE_OPTION_C_2026-09-20/RETURN_TEMPLATE.md`
- `skills/chat/workflows/KFB_COLOGNE_RACE_OPTION_C_2026-09-20/SOURCE_PINS.json`
- `skills/chat/workflows/KFB_COLOGNE_RACE_OPTION_C_2026-09-20/START_HERE.md`
- `skills/chat/workflows/KFB_COLOGNE_RACE_OPTION_C_2026-09-20/TEST_REPORT.md`

This Return file is an additional handoff file.

## Tests actually run

Static/source-consistency:
**20 / 20 PASS**

See:
`TEST_REPORT.md`

Runtime:
- gameplay checks: 0
- browser checks: 0
- public Stage checks: 0
- screenshots: 0

Reason:
No Claude runtime export exists yet.

## Intended Stage route

`https://kayfabizarro.pages.dev/kfb-hub/stage/stunt-world/cologne-option-c/`

Status:
**INTENDED ONLY · NOT DEPLOYED · NOT PUBLIC_VERIFIED**

Do not present it as a working test link yet.

## Owners retained

- public coordination / briefing: `georg-doc/kayfabizarro`
- OSM data owner: existing `tools/osm-city-lab`
- Race movement/controller owner: existing Race owner / public v0.8 mirror for design proof
- final Race integration: WSA-owned after Georg design acceptance
- no second terrain/movement/controller/deployment owner introduced

## Unresolved / deferred

- Claude has not built Slice C yet.
- No playable Cologne runtime exists.
- No Stage candidate exists.
- No Georg visual/freeplay review yet.
- Option A visual authority + matched build are deferred until Option C review.
- Exact OMS architecture fidelity is deliberately secondary in this first design proof.

## Exactly one next gate

**Claude Design builds the first playable Option-C Dom Loop from the pinned Option-C boards + cached Dom/Zentrum OSM, with Track design prioritised over exact street/OMS mapping, then returns the complete export/evidence package for GitHub/Stage intake.**
