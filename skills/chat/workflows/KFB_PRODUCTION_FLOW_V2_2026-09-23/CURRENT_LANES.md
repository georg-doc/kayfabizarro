# KFB Production Flow v2 · Current Lanes · 2026-09-23

Status: SNAPSHOT · refresh exact PR/head before action

## Für Georg

Aktuell sind die wichtigsten Spuren so:

- **WorldBuilder:** funktionale Basis + neuer Editor sind akzeptiert. Als Nächstes Terrain modellieren (anheben/absenken), nicht noch mehr Editor-Microtests.
- **ToolBox:** noch nicht bereit für einen neuen großen Claude-Design-Lauf; echte Resident-Sets/Quellen müssen sauber konsolidiert werden.
- **Travel:** die Figuren-/Kartenrelation ist akzeptiert. Jetzt geht es nur noch um die Bedienung „einmal Space = Sprung, zweimal schnell = Flug“.
- **Racer:** technisch bei R3c; neuer geschlossener Track-Körper und runde Rahmen sind fertig, Sichtprüfung offen.
- **Curtain:** Claude-2D/SVG-Versuch verworfen. Erst den echten funktionierenden Vorhang unverändert wiederherstellen.

## WorldBuilder

Repo:
`georg-doc/kayfabizarro`

PR:
`#186`

Head:
`7267185cdbdc60e576b946ee589f0b2e932c8c8b`

Human state:
- R1 functional terrain/resident foundation: **PASS**
- R2 shared inline editor: **PASS**
- Move / Rotate / free Scale / Drop / World-Local / Save-Reload: **PASS**

R3:
uniform `−/+` scale convenience exists as optional candidate.
It is explicitly **non-blocking**.

Current next functional gate:
**WB2 Terrain Sculpting**
- Raise;
- Lower;
- radius;
- strength;
- smooth falloff;
- undo/clear;
- save/reload.

Production implication:
WorldBuilder is now a stable enough functional base for a coherent later visual/Claude pass.

## ToolBox

Repo:
`georg-doc/kayfabizarro`

PR:
`#185`

Head:
`2833674b36be707fa4d14c8b532faee78ef3ba28`

Current issue:
rejected Claude Round-1 used wrong/stale actor sources.

Current P0:
complete Resident-set portability using real sets:
- Goth Girl;
- Orc Warband;
- Animatronic.

Do not reopen the known ChatGPT texture-host diagnosis.

Production implication:
before a new Claude visual session, Web/Coworker should create one coherent ToolBox Production Packet with:
- current actor/source roster;
- accepted shared editor;
- one real Resident set;
- actual persistence seam;
- forbidden rebuild list.

## Claude Coworker WS0

Prior control-plane PR:
`#187`

Head:
`3ae2b8a22dbf75beeb044844df5dc1a880642263`

Useful proof:
- token-light code review works;
- integration planning is useful;
- direct clickable review delivery rule is useful.

Problem:
its current-gate text is stale relative to later WorldBuilder/Travel progress.

Production Flow v2 supersedes it as the **current coordination direction** once this consolidation is accepted.

Do not continue production from old PR #187 status text without refreshing project heads.

## Travel

Repo:
`georg-doc/KFB-Travel-Globe`

Current PR:
`#38`

Branch:
`chatgpt-web/travel-mode-bridge-tmb2-double-space-2026-09-23`

Head:
`1976c6c813161013b7c97bf5de55f71575a175ef`

Technical state:
- **119 PASS**
- build PASS
- verify PASS

Already accepted from TMB-1E:
- ActionFigure / Rig_Medium;
- Orc Brute / Rig_Large;
- Warband Orc B / Rig_Legacy;
- 2.0× rider candidate;
- CardCarrier unchanged.

Current human question:
choose smallest comfortable double-Space window:
- 240 ms;
- 320 ms;
- 400 ms.

Do not reopen accepted TMB-1E visuals.
TMB-3 landing remains later.

## Racer

Repo:
`georg-doc/KFB-Stunt-Car-Race`

PR:
`#33`

Branch:
`chat/racer-tarch0-sp13ktra-2026-09-23`

Head:
`f8f29f7b742e0b18fd9887398cd6bb4b7c320a32`

Current runtime/test head:
`b48ba46bb23e656cad968cb347bde7aa4bd445c4`

Technical state:
**17/17 PASS**

Current R3c:
- one closed cyclic track body;
- complete underside;
- side skirts;
- rounded structural supports;
- rounded TubeGeometry TARCH frames;
- old flat/boxy primary forms removed.

Current human question:
does the new Track body / rounded-frame anatomy now read coherently?

Still later:
- vehicle grounding/contact;
- hard-curve jitter;
- trails/speedlines;
- jump/landing.

## Theatre Curtain / Design Donor Lock

Repo:
`georg-doc/kayfabizarro`

PR:
`#189`

Head:
`dfd39255811e6f5b7cdde4092beb753d2b40713b`

Rejected:
Claude flat 2D/SVG-style reconstruction.

Status:
`ARCHIVED_FAILED_CANDIDATE`

Exact donor:
`chat/gds-theatre-curtain-v1-2026-09-20`

Runtime:
`game-ready/theatre-curtain-v1/runtime/kfb-theatre-curtain.mjs`

Next:
**D0 donor restore only.**

No redesign until exact donor is visibly back.

## Current production recommendation

Do not launch one giant cross-project build.

Use three tracks:

### A · Productive
WorldBuilder WB2 via Coworker/Web as a bounded functional slice.

### B · Human preference
Travel TMB-2 timing and Racer R3c visual review.

### C · Source recovery
Curtain D0 and ToolBox source/Resident consolidation.

After A/C are stable:
prepare one coherent ToolBox/WorldBuilder Production Packet for Claude Design rather than another chain of micro briefs.
