# H15 Mindscape · Slice M1 · Rückgabe (24.10.2026)

Datei: `KFB Billboard Kaleidoscope H15 Mindscape.dc.html` (Kopie von H14, H14 unverändert).

- **Ziel:** H13/H14-Engine als begehbare 360°-Sphäre, ein Renderer, Takt aus dem bestehenden `tick()`.
- **Eigentümer:** H-Reihe Billboard Kaleidoscope.
- **Quelle:** H14 im Projekt; three.js 0.160.0 über jsDelivr.
- **Geschützte Grenze:** H14, Engine-Planung, Songform, Bake unverändert. Nur additiv: Abschnitt Mindscape, `msInit/msRender/msDispose`, zwei Zeilen im `tick/step`, `LS_KEY` auf h15.
- **Fertig, wenn:** Wand, Schalen und Autopilot sichtbar, fps gemessen im UI.

## Was gebaut ist
- Innenwand: die laufende Engine-Fläche 1024×512 als Textur, zweimal gespiegelt um 360° (keine Naht), Band ±55°, Pole dunkel.
- Zwei Schalen (r 6,5 und 4,2) aus derselben Fläche, zeitversetzt (0,26 s; B als Nachbild-Akkumulation), nur helle Teile sichtbar (Luma-Key). Drehung, Neigung und Sprung je Schnitt aus `hash(seed, cycle, shot)`.
- Kamera: Ziehen = Umsehen mit Nachlauf. Autopilot: Drift im Inneren (Parallaxe zu den Schalen), Gierrate nach Sektionsenergie, FOV-Puls auf Kick (wenn Jukebox läuft). Doppelklick/„Immersiv“ = Vollbild.

## TESTED RESULT (Claude-Design-Preview, 24.10.)
- Läuft, keine Abbrüche; 3D 45–74 fps gemessen im Preview-Fenster (Anzeige im UI).
- Sichtprüfung in Arbeitsgröße: Wand allein (Schalen aus) und mit Schalen, Sektionen BUILD/DROP/OUTRO.
- Korrektur nach Sicht: Schale B additiv brannte auf hellen Paletten weiß aus → normale Mischung.

## NOT_TESTED
Mobil/Touch, Mittelklasse-Laptop, Jukebox-Kopplung in 3D (Kick → FOV), Bake-Lauf in H15.

## OPEN
Boden (Knetkugel-Karte aus `proben/`), schwebende Dinge (Röhre, Tür, KFB-Auge über bestehende Rigs), Betreten/Umstülpen, Rabbit-Hole-Übergänge, Clip-Schnipsel als Material-Ebene der Engine.

GEORG ACCEPTANCE: offen.
