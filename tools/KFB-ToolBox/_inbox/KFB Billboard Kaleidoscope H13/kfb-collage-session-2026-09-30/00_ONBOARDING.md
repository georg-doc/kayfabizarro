# Onboarding · frischer Chat · KFB Billboard Kaleidoscope (H13)

Stand 30.09.2026 · Auftraggeber Georg · Claude-Design-Arm von Kayfabizarro.
Lies diese Datei zuerst. Dann `CLAUDE.md`, `WORKFLOW.md`, `github.md`.

## Kaltstart-Satz zum Kopieren

> Lies `CLAUDE.md`, `WORKFLOW.md` und `export/kfb-collage-session-2026-09-30/00_ONBOARDING.md`. H13 (`KFB Billboard Kaleidoscope H13.dc.html`) ist der Referenzstand und bleibt unverändert. Weiterbau nur als H14-Kopie, genau ein Slice aus `SPRINTPLAN.md`, vorher die fünf Zeilen (Ziel · Eigentümer · Quelle · Geschützte Grenze · Fertig, wenn). Changelog additiv, Tests ehrlich (`NOT_TESTED` wo nicht gelaufen), eine offene Frage.

## Was das Projekt ist

Eine endlose, musikgetriebene Billboard-Collage. Ebenen aus drei Materialquellen (Library of Congress, Public-Domain-Manifest, echte KFB-Karten), darüber Typografie, Akten, Fraktale, Hypno-Muster, Formeln und Moleküle. Kamera, Schrift, Korn, Blitze und Farbe reagieren auf Musik. Fläche: Canvas 1024×512 (2:1), noch nicht auf der 3D-Tafel.

## Stand in einem Absatz

H4 war der erste PASS (26.09.). Die Collage-Engine v0 (`collage-engine/`) wurde parallel gebaut statt auf H4 und ist **FAILED CANDIDATE** (`collage-engine/FAIL_2026-09-30.md`). Seitdem wird ausschließlich schichtweise auf H4 aufgebaut: H5 bis H13, jede Stufe eine Kopie der vorigen. **H13 ist der aktuelle Stand** (siehe `DOKU_H5-H13.md`).

## Dateien, die zählen

| Datei | Rolle |
|---|---|
| `KFB Billboard Kaleidoscope H13.dc.html` | Referenzstand. Nicht ändern. |
| `KFB Billboard Kaleidoscope H4…H12.dc.html` | Vorstufen, Historie. Nicht ändern. |
| `data/h6-card-crops.json` | Kartenausschnitte für H6+. |
| `export_public_domain/BRIEFING_PD_POOL_R2_R3.md`, `…R4.md` | Aufträge an den Web-Chat zur Pool-Befüllung. |
| `export_public_domain/TODO_WSA_img2threejs.md` | Offener WSA-Testauftrag. |
| `docs/SPRINT_billboard-hypernorm.md`, `docs/BRIEFING_fresh-chat_billboard-H5.md` | Ursprungssprint (G0 entschieden: D1 GLSL erlaubt, D2 nur „No known restrictions“, D3 Film → KayKit → Karten). |
| `collage-engine/` | FAILED CANDIDATE. Nur der Pool-Code (Manifest 0.2, Pin, `minEdge`) bleibt gültig. |

## Harte Regeln für dieses Thema

1. **H13 nicht verändern.** Neues kommt als H14-Kopie.
2. **Nicht neben H4 bauen.** Die Engine v0 scheiterte genau daran: unabhängige Zufallswürfel über Schrift, Effekt, Palette und Text erzeugen Generator-Look. Kombinationen sind entschieden oder aus einem Bestand gezogen, nicht gewürfelt.
3. **Einmaligkeit ist kein Qualitätsbeweis.** „289 von 300 Kombinationen einmalig“ wurde als Erfolg berichtet und war keiner. Hinsehen: Screenshot in Arbeitsgröße, isoliert (Regel 7).
4. **Keine Asset-Kopien.** Module über jsDelivr am Commit-Pin, Daten über raw. Pins in `DOKU_H5-H13.md` §Pins.
5. **Keine Figuren, Rigs, Augen nachbauen** (Regel 4). Figuren kommen über `mountGraft()` / `mountCarl()`.
6. **Text aus geschriebenem Bestand** (Kartentexte, Triplets), nicht aus Wortkombinatorik.
7. **Claude Design pusht nicht.** Lieferung = ZIP + Preview. Integration macht der Web Lead / WSA.
8. Doku und Kommentare Deutsch, sichtbare UI Englisch.

## Erster Schritt im neuen Chat

1. `SPRINTPLAN.md` lesen, Slice mit Georg wählen (Vorschlag: **S-A Statischer Billboard-Render**, unabhängig von R3/R4).
2. Fünf Zeilen aufschreiben und von Georg bestätigen lassen.
3. H13 als H14 kopieren, ein Slice, Screenshot vorher und nachher.
4. Lieferung: ZIP, Changelog, gelaufene Tests, eine offene Frage.

## Berichtsformat

`SOURCE | DECISION | IMPLEMENTATION | TESTED RESULT | EXPORT | PUBLIC DEPLOYMENT | GEORG ACCEPTANCE | OPEN`. Nicht Gelaufenes heißt `NOT_TESTED`.

## Hinweis zur Belegbarkeit dieses Pakets

Dokumentation und Sprintplanung wurden am 30.09.2026 aus dem Projektstand (README, FAIL-Protokoll, Briefings, `github.md`, H13-Quelltext) und dem Sitzungsprotokoll zusammengestellt. **Die Tests von H5–H13 wurden dabei nicht erneut ausgeführt.** Ihr Status steht in `DOKU_H5-H13.md` als „berichtet“, nicht als „erneut geprüft“.
