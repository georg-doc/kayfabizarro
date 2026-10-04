# START HIER · KFB Cologne Race · Option C · Handoff an Workspace A

Schlanker Export ohne Screenshots. Einstiegspunkt: `KFB Cologne Race Option C.dc.html`
(öffnet direkt im Browser, lädt `lab-v9/cologne-stage.v1.js` als ES-Modul).

## Reihenfolge zum Lesen

1. `docs/RETURN.md` — was gebaut ist, was fehlt, Quellen-Pins (Stand 2026-09-20, Grundgerüst).
2. `docs/POSTMORTEM_2026-09-22.md` — **zuerst hier, wenn etwas kaputt aussieht.** Drei
   konkrete Fehlerketten mit Ursache und Messweg: Kamera durch Gebäude, die "braune Fläche"
   vor dem Tunnel (Sichtachse, keine Kollision), Bruchkanten an Bögen.
3. `docs/CHANGELOG.md` — chronologisch, jede Runde mit Vorher/Nachher.
4. `docs/MODULES_AND_DONORS.md` — jeder Donor mit Besitzer, Rolle, Bytegröße, Entscheidung.
5. `docs/TEST_REPORT.md`, `docs/STAGE_METADATA.json`, `docs/SOURCE.json` — maschinenlesbare
   Belege.
6. `github.md` — Repo-Zuordnung, Sync-Stand, Screen-Map (welche Datei aus welcher Repo-Quelle).

## Code

- `KFB Cologne Race Option C.dc.html` — die Design Component. Template + Logik + `data-props`
  (Tweaks: `startCamera`, `paletteMode`, `paletteSeed`, `driveColorFromPalette`, `orbColor`).
- `lab-v9/cologne-stage.v1.js` — Bühne: Reihenfolge des Aufbaus, Kamera-Loop, Korridor-Schrubber,
  Palette-Boot. Lesen zuerst.
- `lab-v9/cologne-route.v1.js` — Dom Loop, Kontrollpunkte, Spline, Heldenkameras.
- `lab-v9/cologne-track.v1.js` — Fahrbahn, Schultern, Markierungen, Tunnel, Kaskade.
- `lab-v9/cologne-world.v1.js` — OSM-Gebäude, Rhein, Boden, Durchfahrten-Logik.
- `lab-v9/cologne-landmarks.v1.js` — Kölner Landmarken (Dom separat in `cologne-world.v1.js`),
  Freistellungs-Hebel gegen die Strecke.
- `lab-v9/cologne-play.v1.js` — Bewegung (Race v0.8 Spiegel), Kameramodi, `railClamp()`.
- `lab-v9/cologne-drive.v1.js` — Antrieb (Donut/Würfel/Orb), Spuren.
- `lab-v9/cologne-gates.v1.js` — Start/Ziel, Checkpoint-Tore, Jingles.
- `lab-v9/cologne-sky.v1.js` — Himmel, Planeten, Himmelswürfel.
- `lab-v9/cologne-palette.v1.js` — Farbpaletten-Generator (OKLCH, `kfb-palette/v1` JSON).
- `lab-v9/cologne-audio.v1.js`, `cologne-props.v1.js` — Motor-Loop/Musik, Requisiten (Billboard,
  CCTV, Kartenbild).
- `lab-v9/option-c-style.v1.js` — die gemessene Farbautorität (Anker für die Palette).

## Offene Punkte (aus RETURN.md, unverändert)

Vehicle-Deformer nicht verdrahtet, Dom-Längsachse 18 % kurz, kein Standalone-Single-File
(ES-Module-Importmap verhindert es — siehe `docs/standalone-README.md`), `normalized.json`
wird komplett geladen (7,2 MB), keine Fensterdetails an Gebäuden, keine Gegner-KI.

## Nächstes Gate

Georgs visuelle/Freeplay-Abnahme von Option C. Siehe `docs/RETURN.md` Abschnitt „Exactly one
next gate".
