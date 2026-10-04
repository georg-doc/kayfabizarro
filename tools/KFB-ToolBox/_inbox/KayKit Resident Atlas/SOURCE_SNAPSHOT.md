# SOURCE_SNAPSHOT · KFB_Resident_Atlas_S6

| Feld | Wert |
|---|---|
| Projektname | KFB Resident Atlas · S6 (Claude-Design-Projekttitel aktuell: „Copy of KayKit Atlas Preflight Access") |
| Exportzeitpunkt | 2026-09-17 |
| Exportrevision | 2026-09-17-r1 |
| Ausgangsrevision (Git) | **unbekannt** — dieses Design-Projekt ist kein Git-Arbeitsverzeichnis. Es gibt keinen Commit-SHA für den Projektstand. |
| Sprintstand | S32 (additiver Changelog, 32 Einträge) |
| Residents | 21 |
| Rig-Klassen | Rig_Medium, Rig_Large, Rig_Legacy |
| Asset-Referenzen | 119 Modellpfade + 2 Textur-Overrides (siehe `docs/ASSET_MANIFEST.json`) |
| Asset-Pins | `891eadf0…` (Assets), `aa16a777…` (Animationen), `10a7fdce…` (Legacy), `main` (Mixed Bag 1) |

## Enthaltene Funktionen

- Resident-Auswahl über 21 Vignetten plus Ensemble-Ansicht (alle auf einer Bodenebene, ohne Höhen-Normalisierung).
- Datengetriebene Rezepte: Aktor, Habitat, bis zu sechs Signatur-Slots, promo-extras, optionale Vergleichsobjekte.
- Attachment-Mechaniken: Identität, `push`/`pushAxis`, `aim`/`axis`/`roll`/`grip` (Weltrichtung), `slotAxis`/`slotRoll` (Achsen-Zuordnung, posen-fest), `paw` (Pfoten-Anker für Legacy-Teilfiguren), `pull` (zweiter Arm per CCD), `hold` (Instrument im Körperraum mit Armnachführung), `on` (Stapel), `sitOn`, `float`.
- Pose aus der geteilten Clip-Bibliothek (119 Clips, 7 Sets) oder pack-eigenen Wurzeln; Schicht-Posen über Bone-Subtree-Teilung; Bindungsquote je Clip.
- Motion-Audition über alle Figuren einer Vignette, mit Bindungsquote je Figur und Warnung bei konstruktiv gehaltenen Instrumenten.
- Farbvarianten über Textur-Tausch auf der Instanz (`skin`).
- Studio: Anfasser (Verschieben/Drehen), Bone-Posing, Korrektursammlung pro Resident mit Export als `<resident>.studio-patch.json`.
- Enthüllungs-Zeitleiste (Toy Soldier), Referenzbild-Blende, Ebenen-Schalter mit Neuverteilung, Tag/Golden-Hour, Draufsicht/Raster, Key-Art-Kamera mit manueller Override-Option.
- Prozedurale Zusatzbewegung: `strumClip` (additiv, Achse per Probedrehung gemessen), `reachChain` (CCD mit berichtetem Restfehler).
- Messsonden unter `tools/` als eigenständige Seiten.

## Assets: per Entscheidung extern

Die 3D-Modelle, ihre `.bin`-Puffer und Texturen sind **absichtlich** nicht im Paket. Alle Assets via GitHub, gepinnt auf die vier Revisionen oben; zentrale Quelle `georg-doc/kayfabizarro/media/3D_Assets/`. `docs/ASSET_MANIFEST.json` führt alle 121 Referenzen mit Pfad, Pin und Laufzeit-URL (`availability: REMOTE_ONLY`). Das Paket ist damit online-portabel und nicht offline-fähig.