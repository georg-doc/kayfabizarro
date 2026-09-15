# KFB ToolBox / Design · Birthday Startscreen · Consumer Handoff

**Datum:** 15.09.2026  
**Status:** CURRENT INPUT / DESIGN + TOOLBOX HANDOFF. Kein Runtime-Release, keine Travel-Implementation.  
**Empfänger:** frischer Claude-Design-/ToolBox-Chat.  
**Consumer:** Travel/Astra Birthday Startscreen.  
**Grundsatz:** vorhandene Owner und Contracts bleiben unverändert.

**LATEST CORRECTION:** vor weiterer Arbeit `POST_RETURN_CORRECTIONS_2026-09-15.md` und `RETURN_BIRTHDAY_CONSUMER.md` lesen. Player-facing: **Uncle FrizzleBob** · **Little Miss Messy** (`GothGirl` source) · **Hihi Love-Hope**. Der aktuelle FrizzleBob-Export ist Candidate / not final.

## 1 · Auftrag in einem Satz

Liefere dem Birthday-Startscreen **wenige klar benannte, consumer-ready Actor-/Motion-/Prop-Eingaben** aus dem bereits gesicherten ToolBox-Quellstand, ohne Ergebnis A neu zu bauen und ohne die Travel-Szene selbst zu implementieren.

## 2 · Zuerst lesen

1. `tools/KFB-ToolBox/START_HERE.md`
2. `tools/KFB-ToolBox/_inbox/KFB_TOOLBOX_ZIP_INTAKE_2026-09-15.md`
3. `tools/KFB-ToolBox/_inbox/WS0_2026-09-15/START_HERE.md` — sobald als lesbare Datei verfügbar; sonst aus `KFB ToolBox.zip` lesen.
4. `FIELD_COVERAGE.md` + `RETURN_WSA.md` aus demselben WS0-Paket.
5. `unpacked/B_OBERFLAECHE/BERICHT_UI_PILOT_v1.md` und `KRITIK_UX_CARL_WEG_v1.md` nur für Ergebnis B.
6. `skills/chat/town/SESSION_CARD.md`
7. `skills/chat/town/references/TOWN_POST_R022_BIRTHDAY_STARTSCREEN_TRAVEL_HANDOFF_2026-09-15.md`
8. `tools/KFB-ToolBox/docs/CONTRACTS.md`

## 3 · Quellenstand nicht wieder aufrollen

### SOURCE INTAKE

Das neue Archiv `tools/KFB-ToolBox/_inbox/KFB ToolBox.zip` ist eine neue Inbox-Lieferung, nicht stiller Ersatz eines SSOTs.

Gemessener Archivstand:

- GitHub-Upload-Commit: `d3c16e3ae9758713cefc2acc9eec176268abaf28`
- Größe: `3,981,305` B
- SHA-256: `06ad617658208fb502d81b0cd28706761473a6138b5fea59db14235ca8446b27`
- 133 Dateien / ca. 6.67 MB unkomprimiert
- enthält den bisherigen A-Quellstand **plus** WS0-Return/QA/Feldabdeckung und einen getrennten `B_OBERFLAECHE`-Block.

Die `0 shared paths` des ZIP-Vergleichs sind **kein Inhaltsbeweis**, sondern Folge unterschiedlicher Archivwurzel: alter Export unter `export/UEBERGABE...`, neue Lieferung unter den beabsichtigten Repo-Pfaden `tools/KFB-ToolBox/_inbox/WS0_2026-09-15/...`.

### A / B bleiben getrennt

**A:** Source Closure / Kaltstart / Feldabdeckung. Nicht neu implementieren. Neue `FIELD_COVERAGE.md` gegen den bisherigen PARTIAL-Status lesen und nur echte noch offene Kanäle melden.

**B:** gemeinsamer UI-Pilot / Carl-UX-Kritik / LIBRARY-Streifen. Das ist ein eigenes Ergebnis. Für den Birthday-Consumer ist B **nicht Voraussetzung**, außer ein konkreter Actor-/Motion-Export ist ohne die Oberfläche nicht reproduzierbar erreichbar.

## 4 · P0-Lieferung für den Birthday-Startscreen

### 4.1 FrizzleBob

Liefere den vorhandenen FrizzleBob/Graft-Bauweg als Consumer-Eingang, nicht einen neuen Actor.

Erforderlich:

- genauer Reader/Mount und Profil-/Fixture-Pfad;
- ruhiger Stand/Idle;
- ein deutliches Focus/Hover-Verhalten;
- ein kurzer Select/Celebrate-Beat;
- Rückkehr in einen stabilen Restzustand;
- optional ein bereits funktionierender kurzer Groove/Dance, **nur wenn am realen Graft geprüft**;
- bestehender Look-/Eye-/Mouth-Owner bleibt eindeutig.

Kein neues Cockpit/Driver-Rig für diese Szene. Keine Travel-Bewegungslogik in ToolBox.

### 4.2 Little Miss Messy / source asset GothGirl

`GothGirl` bleibt Asset-/Librarian-Name; **Little Miss Messy** ist die aktuelle player-facing Rolle. Datei nicht umbenennen, wenn das Asset dadurch seine Registry-Identität verliert.

Erforderlich:

- exakte Asset-/Registry-Referenz;
- gemessene Rig-Familie;
- **kleines Casting**, nicht Motion-Masse:
  1. Idle/Rest
  2. Focus/Hover
  3. Select/Celebrate
  4. Rest/Recovery bzw. sauberer Rückweg
  5. ein Dance/Groove als P1-Kandidat
- pro ausgewähltem Clip Binding-Coverage am echten Rig; 0-Track-Cases fail closed.

Die Asset-Librarian-Motion-Preview ist Discovery-/Preview-Beleg. Animation Lab bleibt Owner der finalen Kompatibilitätsannahme.

### 4.3 Hihi Love-Hope

Für Mittwoch nur **inactive / Coming Soon**.

- vorhandene Cube-Pet-Identität/Contract referenzieren;
- keine neue Rigging-/Talk-/Dance-Arbeit als Voraussetzung;
- ein ruhiger sichtbarer Slot genügt.

### 4.4 EyeRig Speaker · P1

Der vorhandene EyeRig ist ein Donor für einen später expressiven Lautsprecher. Keine neue Augenarchitektur.

Wenn schnell reproduzierbar:

- Mount-/Reader-Pfad nennen;
- Pointer/active-actor look als vorhandene Capability kennzeichnen;
- keine Audio-Ownership übernehmen.

Wenn nicht sofort sauber konsumierbar, als P1 zurückstellen. Der Startscreen darf ohne Augenlautsprecher fertig werden.

## 5 · Nicht bauen

- kein Birthday-Startscreen in ToolBox;
- kein Terrain, Sky, Lighthouse, Audio-Mixer oder Fireworks;
- kein neuer globaler Actor Contract;
- keine komplette Dance Library;
- kein Motion-Retargeting auf Verdacht;
- kein Rebuild des bereits gelieferten A-Quellstands;
- kein flächendeckender UI-Rework als Voraussetzung des Birthday-Slices.

## 6 · Ergebnis B sinnvoll weiterführen

Nach dem P0-Consumer-Handoff kann Ergebnis B weiterlaufen. Der Birthday-Slice ist dabei ein guter **realer Workflow-Test**, aber keine Scope-Erweiterung:

`Select actor → inspect rig/motions → choose state clips → export/hand off → consumer mounts same actor/motions visibly equal`.

Wenn der UI-Pilot diese Kette nicht klar unterstützt, dokumentiere das als konkretes UX-Problem. Nicht die Consumer-Szene in den ToolBox-Piloten kopieren.

## 7 · Return Contract

Ein kompakter Return genügt:

| Item | exact source/config | consumer API/path | tested evidence | status |
|---|---|---|---|---|
| FrizzleBob | … | … | … | PASS/PARTIAL/OPEN |
| Little Miss Messy / GothGirl source | … | … | … | PASS/PARTIAL/OPEN |
| Idle | … | … | binding … | … |
| Focus | … | … | binding … | … |
| Select/Celebrate | … | … | binding … | … |
| Dance P1 | … | … | binding … | … |
| Hihi Love-Hope inactive | … | … | … | … |
| EyeRig Speaker P1 | … | … | … | … |

Zusätzlich:

- `FIELD_COVERAGE.md`: was ist nach neuer Lieferung jetzt PASS, was bleibt PARTIAL/OPEN?
- Ergebnis A und B separat benennen.
- keine pauschale Aussage `works everywhere` aus einem Lab-Test ableiten.

## 8 · Startprompt für den frischen Design/ToolBox-Chat

> Lies `tools/KFB-ToolBox/_handover/BIRTHDAY_STARTSCREEN_2026-09-15/START_HERE.md`. Prüfe den aktuellen GitHub-Stand und die neue Inbox-Lieferung `KFB ToolBox.zip`. Ergebnis A nicht neu bauen: lies `FIELD_COVERAGE.md` und `RETURN_WSA.md` und schließe nur echte offene Beleglücken. Für den Birthday-Consumer liefere dann Uncle FrizzleBob sowie Little Miss Messy / source asset GothGirl mit einem kleinen, real geprüften State-Casting (Idle, Focus/Hover, Select/Celebrate, Rest; Dance nur als P1) und Hihi Love-Hope als inaktiven Existing-Contract-Slot. ToolBox baut nicht die Travel-Szene. Ergebnis B/UI-Pilot bleibt separat und darf den Birthday-Slice nicht blockieren. Routineablage und Git-Sync selbstständig bündeln.

## 9 · Status

- **DECISION:** Birthday-Consumer braucht einen kleinen Actor-/Motion-Handoff, nicht die komplette ToolBox.
- **SOURCE INTAKE:** neues `KFB ToolBox.zip` liegt vor und enthält A + Feldabdeckung + getrennten B-Oberflächenblock.
- **IMPLEMENTATION:** keine neue Actor-/UI-Implementation durch dieses Dokument.
- **TESTED RESULT:** ZIP-Inventar gemessen; Actor-/Motion-Consumer-Handoff noch nicht neu geprüft.
- **UNRESOLVED:** konkrete final ausgewählte Motion-Dateien und ggf. EyeRig-Speaker-Mount bis Design/ToolBox-Return.
