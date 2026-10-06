# Backlog — Venedig 3D

## KFB-Spuren (Stand 07.10.2026)
- **KFB Destruction VFX Grammar** — PAUSIERT, wartet auf Referenzbilder in `uploads/`. Stand: `vfx-grammar/STATUS.md`
- **P1 UFO Tractor Beam Event Lab** — V1 06.10.2026, r2 Beam-Überarbeitung 07.10.2026, wartet auf PASS/TUNE/FAIL + Audio-Abnahme. `KFB UFO Tractor Beam Event Lab.dc.html`, Return: `ufo-event-lab/RETURN.md`, Übergabe WSA: `ufo-event-lab/HANDOVER_WSA_2026-10-07.md`, Session-ZIP: `export/KFB_UFO_TRACTOR_BEAM_EVENT_LAB_2026-10-07/`
- **Später: Destruction / Terraforming Beam** — gleiche UFO-/Beam-Schicht, Zerstörung mit Seed-World-Destruction-Logik, Umkehrung als Aufbau absurder Strukturen. Notiz: `ufo-event-lab/BRIEF.md` · Ausblick
- Seed World Mech Destruction POC 01 — Doku in `seedworld/docs/`

## Referenzen (vom Nutzer)
- Venice rebuilt by mathematics — https://www.reddit.com/r/3Dmodeling/comments/1mxdqbj/venice_rebuilt_by_mathematics/
- ArtStation Artwork — https://www.artstation.com/artwork/oJAEl4
- three-geospatial (Atmosphäre, Geodaten) — https://github.com/takram-design-engineering/three-geospatial
- browser-flight-simulator (Flugsteuerung) — https://github.com/beutton/browser-flight-simulator

## Gebaut
- Slice 1: Kernstadt, Canal Grande, ~13.000 Häuser, 17 POI, Flug + Gondel, Tageszeit, Murano-Glas-UI, Klang
- Slice 2: Zeitschichten 1500 / 1750 / Heute mit Überblendung; Dossiers (Zeitleiste, Grundriss-Schaubild, Lagunenkarte) für Rialto, Salute, Arsenale
- Slice 3: Lagune — Murano, Burano, Mazzorbo, Torcello, San Michele, Lido, Sant'Erasmo; 6 neue POI; Lagunen-Überblick; Burano mit farbigen Häusern; Torcello in 1500 dicht bebaut, heute fast leer

- Slice 4: Innenräume — Piazza San Marco zu Fuß (Procuratie, Ala Napoleonica), Innenraum der Basilica San Marco mit 5 Hotspots, Schaubildern und zwei Bildplätzen

- Slice 5: Dossiers für alle 23 Orte, 13 Schaubild-Typen (Bogen, Achteck, Werftbecken, griechisches Kreuz, Turmschnitt, Palastfassade, Zifferblatt, Kirchenschiff, Saalbau, Zuschauerraum, Torso-Aufriss, Glasofen-Schnitt, Friedhofsraster, schiefer Turm, Nehrungsprofil, Zollspitze)

- Slice 6: Kanalfahrten — vier Routen (Canal Grande, Arsenale, Giudecca-Kanal, Lagune nach Murano) mit Etappen-Kapiteln, Autopilot und freier Fahrt, Routenkarte mit Fortschritt, Brücken über den Rios; Routen sind in die Karte als Wasser eingeschnitten

## Dokumentation (Stand 16.08.2026)
- README.md — Überblick, Architektur, Grenzen
- HANDOVER.md — Onboarding, Rezepte, Fallen, v2-Spuren
- DATENSTRATEGIE.md, KONZEPT-VOXEL.md, KONZEPT-SURREAL.md, KONZEPT-FUNDSTUECKE.md, KONZEPT-KFB-DECK.md, BRIEFING-ECO-ESSAY.md

## Offen
- Google Photorealistic 3D Tiles direkt in der Szene (statt Deep-Links): braucht einen Google-Maps-API-Key mit aktivierter Map Tiles API und ein Billing-Konto — ohne Key nicht baubar. Umsetzung dann als zweite Weltebene, umschaltbar neben der historischen Karte.
- Zweiter Innenraum (Frari-Schiff oder Scuola San Rocco)
- Bildplätze im Innenraum mit echtem Material füllen
- Gondel-Netz über Nebenkanäle, Abzweigungen wählbar
- Prozedurale Fassaden-Detaillierung (Gotik-Maßwerk, Schornsteine, Balkone)
- Echte Umrisse aus OSM-Daten statt approximierter Polygone
- Vaporetto-Linien und Handelsrouten als Karten-Overlay
- Bild-/Videomaterial für POI-Dossiers (muss geliefert werden — nicht generierbar)

## QA-Lauf v1 (16.08.2026)
Automatisch gemessen im Browser, 108 Render-Checks plus Datenprüfung.

Bestanden:
- 23/23 Orte haben ein Dossier mit plan-Typ, 3 Kennzahlen, >=5 Zeitleisten-Einträgen, Zeitschicht-Text für 1500/1750/2026, planLabels — in DE und EN
- 23 POI-Basistexte: 3 Absätze, alle Quellen-Links mit gültiger URL, DE und EN
- I18N symmetrisch (34/34 Schlüssel)
- 4 Touren: Punktzahl, bilinguale Etappen, at-Werte in [0,1]
- 16 Schaubild-Typen x 2 Sprachen: keine Ausnahme, kein leeres Bild, kein Randüberlauf
- 23 Minikarten x 2 Sprachen + 4 Routenkarten bei 4 Fortschrittswerten: fehlerfrei
- Kein Debug-Rest im Projektcode (console.log, TODO, window.__)

Bekannt und beabsichtigt:
- Stadt-Minikarten zeigen Randtinte rechts (86–114 px): die Lagunen-Inseln laufen aus dem Kartenausschnitt heraus. Kartografisch normal, kein Fehler.

Cleanup offen (kosmetisch, kein Fehlverhalten):
- Uneinheitliche Namen für dieselbe Sache über Dateien hinweg (poi / place / spot)
- Farbtabellen doppelt in Kartenzeichnung und Szene
- venice-world.js ist die größte Datei und könnte Szene / Steuerung / Klang trennen
