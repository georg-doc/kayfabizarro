# NEXT GATE · WB-W0 · WORLD SCALE + TRAVERSABILITY PROOF

Quelle: Georg / WSA-Lead, 2026-09-24, Scope Correction nach `HUMAN_REJECTED_FOUNDATION` des WorldBuilder-v1-Slice-1. Festgehalten, **nicht begonnen**.

## Linie
```
globale Planet-/Zonenübersicht
        ↓
semantische Route / OSM-Strecke
        ↓
lokaler, kontinuierlicher Terrain-Korridor
        ↓
Gebäude, Landmarks, Residents und Props
        ↓
Licht, Farbe, Wetter und entfernungsgesteuerte Outline
```
Die Kugel ist die globale Orientierung — nicht der Massstab, auf dem Häuser und Figuren beliebig verstreut werden. Am Boden wird eine lokale, sauber verfeinerte Region sichtbar, die nahtlos an die Welt anschliesst.

## Auftrag · genau eine kleine spielbare Region
1. Den akzeptierten WB2-Terrain-/Editor-Owner weiterverwenden.
2. Prozedurale Terrain-Linie aus `TERRAIN_FIRST_RESET_2026-09-23.md` übernehmen: kontinuierliches Terrain, Biome-Blending, Hang-/Höhenregeln, lokale Erosionslogik.
3. Zuerst eine semantische Route mit freiem Korridor anlegen.
4. Gelände um die Route formen; Strasse/Weg nicht nachträglich auf ungeeignetes Terrain legen.
5. Alle Grössen aus echten Quellen: KayKit-Character, KayKit-Tür, Racer-Spurbreite, OSM-Grundriss.
6. Spawn, Route und Interaktionsflächen per Sperrzonen frei von Rocks, Props, Wasser und Gebäuden.
7. Nur ein Character, ein Haus, ein Landmark, wenige Props.
8. Ink Outline nur entfernungsabhängig und bildschirmbezogen. Keine dicken schwarzen Geometriehüllen; keine Terrain- oder Küstenzacken.
9. Keine zufällige Objektstreuung ohne Belegungs- und Abstandstest.
10. Kein Wetter, God Mode, mehrfacher Look-Switch, Asset-Massenimport oder UI-Polish in diesem Gate.

## PASS nur wenn
- der Character sicher startet;
- die Route vollständig begehbar ist;
- keine Figur und kein Gebäude Terrain/Props schneidet;
- Türen, Wege und Gebäude glaubwürdig zueinander skaliert sind;
- Küste und Terrain-Silhouette in Orbit- und Bodenansicht sauber bleiben;
- Orbit → Annäherung → Boden eine zusammenhängende Welt zeigt;
- alle Masse und verwendeten Quellen dokumentiert sind.

Erst danach: Fahrzeugtest, OSM-Zone, Gebäudegrammatik, Landmarks, Wetter, WorldBuilder-God-Mode.

## Nicht als Donor
- Hürth/Elastic-Grundlage (eingefroren, PR #194) — ausser Georg gibt sie ausdrücklich frei.
- WorldBuilder-v1-Slice-1-Code (`returns/WORLDBUILDER_V1_2026-09-24/code/`) — Failure-Evidence, nicht Basis.
