# Fresh Chat · KFB ToolBox · Onboarding (16.09.2026, nach Abnahme P0)

GitHub-Stand schlägt Chat-Erinnerung. Vokabular: SOURCE · DECISION · IMPLEMENTATION · TESTED RESULT · GEORG ACCEPTANCE · CANDIDATE CONTRACT DELTA · ARCHIVED HISTORY.

## Stand
- **Arbeitsbasis (GEORG ACCEPTANCE: ACCEPTED FOR WORKING BASELINE):** `tools/KFB-ToolBox/stage-first/src/KFB ToolBox Stage-First v1.dc.html` — Studio-v18-Logik auf WS0-Quellbaum, Stage-First-Shell (Actor · Face · Pose · Motion · Voice · Stage). Nicht bug-frei, nicht visuell final; kein Redesign angefordert.
- **Prüfstand:** `stage-first/qa/Stage-First QA.dc.html` → »Run 13 checks«. 13/13 PASS mit (7).zip-Profilen und mit den Repo-Eingangsprofilen (`window.__QA_PROFILES='repo-inbox/'`). Sitzung wird gesichert/restauriert/nachgemessen.
- **Consumer-Profile (CURRENT TESTED CONSUMER PROFILE INPUT, kfb.pets/1, NICHT kanonisch):** `tools/KFB-ToolBox/_inbox/KFB Elisa B-Day Reference+Mockups/kfb-pet-gothgirl.json` · `kfb-pet-hihi.json`. Nicht vereinfachen, nicht nach `media/3D_Assets/kfb-pets.json` heben.
- **Return + Matrizen:** `stage-first/RETURN_STAGE_FIRST_P0_2026-09-16.md` (Source Map, Promotion-Matrix, 12 Contract-Deltas klassifiziert, Tested Result, F-1…F-8). Hashes: `stage-first/SOURCE_MAP.json`.
- **Offen, akzeptiert:** F-6 Meßfelder (`ground.*`, `body.*`, `pad.anchors`) werden beim Laden neu gemessen · F-7 Studio-Handler schreiben Entwürfe beim Messen · F-8 unveränderter Entwurf `gothgirl` in Georgs Sitzung — **bleibt**, kein »Discard drafts«, keine Sitzungsbereinigung.
- **Git:** Connector hat nur Leserecht (403). Checkpoint-ZIP + `stage-first/PUSH.md`; nach Georgs Push SHA in `SOURCE_MAP.json` und `github.md` nachtragen. Top-Level-Doku: `stage-first/DOC_RECONCILIATION_PROPOSAL.md` additiv einarbeiten.

## Nachtrag 17.09.2026 · Casting-Probe
Georgs Befund »rest und dance nicht funktional« behoben — nur in `_handover/BIRTHDAY_STARTSCREEN_2026-09-15/qa/casting-probe.html`. Rest ist eine eigene Bodenhaltung (Sit_Floor_Down → Sit_Floor_Idle → Sit_Floor_StandUp), Dance spielt den gemessenen Ersatz `Skeletons_Taunt_Longer` und sagt das. `anim-map.v1.js` unverändert (Dance dort weiter MISSING) — die Übernahme in den kanonischen Vertrag ist ein CANDIDATE CONTRACT DELTA, kein Fakt. Belege: `qa/09…11-*.jpg`, Werte in `qa/casting-probe.json#fix_2026_09_17`.

## Nachtrag 17.09.2026 · Cube-Pet-Gesicht · richtiger FB-Vertrag
Georgs zwei Befunde behoben, weiterhin nur in `_handover/BIRTHDAY_STARTSCREEN_2026-09-15/qa/casting-probe.html`:
- **Cube-Pet (Hihi)** hatte kein Augen-Rig und keinen Mund, weil der Slot das GLB roh lud. Jetzt derselbe Bauweg wie im Studio v17/v18 (`_buildEyeRig` + `_mountMouth`): `pet-library.v6.js#Character.load({face})` → `pet-eye-rig.v6.js#EyeRig` → `pet-mouth.v1.js#PetMouth`, Lidfarbe aus der Colormap abgetastet. Kein Modul geändert, nichts nachgebaut. Maße kommen aus den globalen Vertragsblöcken (am Hasen getunt) — ein `pets[]`-Eintrag für `cat` fehlt und gehört ins Studio.
- **FB-Vertrag**: der Prüfstand lud die alte Fixture (petVersion 4). Vorgabe ist jetzt `profiles/kfb-pet-graft-driver.georg-2026-09-17.json` (kfb.pets/1 v1.2.9 · meta 1.3.0 · petVersion 9); `?contract=georg15` / `?contract=fixture` bleiben als Vergleich.
- Belege: `qa/12-cube-eyerig.jpg`, `qa/13-cube-mouth-talk.jpg`, Werte in `qa/casting-probe.json#fix_2026_09_17b`.

## Nachtrag 17.09.2026 (20:4x) · Augenquellen-Regel — JETZT IM QUELLBAUM
`studio-v3/eye-source-guard.v1.js` liegt im Quellbaum, `SETS.animals.mods` führt kein `googly` mehr, `loadPet` wirft bei zwei Quellen. Für jede neue Zone: Wächter importieren, `loadOpts(lib.face)` laden, `assertSingleEyeSource` nach dem Rig. Volle Regel: `_handover/BIRTHDAY_STARTSCREEN_2026-09-15/EYE_SOURCE_RULE.md` §4.

## Nachtrag 17.09.2026 (19:04) · Augenquellen-Regel (Befund, historisch)
Ein Cube-Pet hat **drei** mögliche Augenquellen: Kenneys Schalen im body-Mesh · `MODS.googly` aus `pet-library.v6.js` · unser `EyeRig v6`. Sie mischen sich still, weil `SETS.animals.mods = ['googly','emotes']` die Set-Vorgabe ist — `Character.load` **ohne `mods: []`** liefert ein doppeltes Rig (Georgs Befund am Bild). Regel, Erkennung und Aufrufform: `_handover/BIRTHDAY_STARTSCREEN_2026-09-15/EYE_SOURCE_RULE.md`, Wächter `qa/eye-source-guard.v1.js` (CANDIDATE). Wer ein Pet-Gesicht baut, ruft `loadOpts(lib.face)` + `assertSingleEyeSource(ch,{rig,expected:'eyerig'})`. **Offen:** Übernahme in den ausgelieferten Embed und Umdrehen der Set-Vorgabe (CANDIDATE CONTRACT DELTA).

## Nächster Slice (NOT STARTED)
`Pose → Props → Stage` auf denselben Actors/Verträgen, gleiche Shell, kein zweiter Rewrite. Vorher: Doku-Pointer truthful, Commit-SHA eingetragen. Später eigener Korrektheits-Slice: `preview/select ≠ create dirty draft`.

## Nicht tun
Pet-Library-Migration · neue Registry · neuer Animationsvertrag · World/Birthday-Szene (Fable 5 läuft parallel) · Module umbenennen/verschieben · kanonische Verträge während Closure ändern.
