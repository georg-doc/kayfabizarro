# KFB Production Flow v2 · Current Lanes · 2026-09-23

Status: SNAPSHOT · refresh exact PR/head before action

## Für Georg

Aktuell sind die wichtigsten Spuren so:

- **WorldBuilder:** funktionale Basis + neuer Editor sind akzeptiert. Als Nächstes Terrain modellieren (anheben/absenken), nicht noch mehr Editor-Microtests.
- **ToolBox:** noch nicht bereit für einen neuen großen Claude-Design-Lauf; echte Resident-Sets/Quellen müssen sauber konsolidiert werden.
- **Travel:** TMB-2 ist jetzt akzeptiert: einmal Space = Sprung, zweites frisches Space innerhalb von **400 ms** = Flight. Kein aktueller Human-Gate; TMB-3 Landing bleibt HOLD.
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

PR:
`#38`

Branch:
`chatgpt-web/travel-mode-bridge-tmb2-double-space-2026-09-23`

Current branch head after acceptance docs:
`08147fb4a6726f4c0248ff79ade67eec24afdbca`

Accepted runtime default commit:
`bf0f94362ec8724cc80a4695830622837242ced9`

Accepted review/test head:
`73f6cad995278dd71d961ac8542c1f812c37cfbc`

Human state:
**TMB-2 ACCEPTED · 400 ms**

Behavior:
- first Space = immediate Ground jump;
- second fresh Space within 400 ms = `REQUEST_FLIGHT`;
- same second Space does not leak into Flight action;
- later Flight-owned Space remains unchanged.

Post-decision CI:
- run `35893561660`;
- **119/119 PASS**;
- build PASS;
- verify PASS;
- artifact `10766056654`.

Already accepted from TMB-1E:
- 2.0× rider candidate;
- native rig-class proportions;
- CardCarrier unchanged.

Current product state:
**no open Travel human gate.**

TMB-3 intentional landing:
**HOLD until Georg explicitly opens it.**

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
Racer visual review only. Travel TMB-2 timing is closed at 400 ms.

### C · Source recovery
Curtain D0 and ToolBox source/Resident consolidation.

After A/C are stable:
prepare one coherent ToolBox/WorldBuilder Production Packet for Claude Design rather than another chain of micro briefs.


## Current override · Blender / WB2 / Racer R3d

This block supersedes older snapshot lines above where they differ.

### Blender MCP

PR:
`georg-doc/kayfabizarro#192`

Head:
`b49fb6e1adde070d658e1cc21dadb3294164cb29`

Status:
- Clown JUG-P1 authored in Blender 5.2.2 LTS through Blender MCP;
- reproducible script;
- GLB export;
- Preview GIF;
- numerical deformed-mesh clearance checks;
- Georg visual PASS ~80 %;
- browser/three.js playback not yet tested.

Current authoring continuation:
Orc Warband performance is actively being built in Blender.

Production rule:
use `BLENDER_MCP_PRODUCTION_ONBOARDING.md`; do not restart the current Warband scene.

### WorldBuilder

Current WB2 PR:
`#190`

Head:
`8922d4b1329fbd47b8754db9dd04ca6b9eb0ee9e`

Status:
- terrain sculpt implementation candidate;
- 24/24 sculpt math/geometry PASS;
- 33/33 source/review contract PASS;
- human Chat HTML review pending.

WB1/R2 shared editor remains accepted.

### Racer

PR #33 current head at latest check:
`382047219b394de61074031d6968e3fabe86ed7c`

R3d architecture cleanup code is present on the current branch:
- one closed volumetric track/barrier profile;
- duplicate wall/cap/lane-band owners removed;
- complete underside;
- thick rounded TARCH frames;
- deep ground follows actual void contour.

Important:
Racer Return/PR body still partly describes R3c; refresh current R3d evidence before a human gate.

Blender remains a **possible visual-mesh compiler fallback/A-B**, not the Racer route/contact owner.
