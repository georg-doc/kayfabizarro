# HANDOVER → WSA · Knetwelt · K2 Knet-Werkzeuge + T3 v2 · 2026-09-28

**Status:** `ACCEPTED AS BASE` · **Von:** Claude Design · **An:** WSA-Lead · **Kopie:** Claude Coworker (Track Core)
**Georg 28.09.:** »top! das ist super! … dann gerne einchecken, ausbauen und weiter optimieren.«

## Was geliefert ist

- **Material `clay-material.v10`** (Nachfolger von v8 für neue Bühnen; v8 bleibt für H0, K1, K7, D1, T3 unverändert):
  - Druckfacetten laufen zur Zellgrenze aus. v8 kippte ganze Zellen: harte Polygonkanten, dunkle Scherben (Georgs Screenshot 27.09.).
  - Sechseck-Kachelung breiter gemischt (1,6 statt 3), Drehung ±22° um ein langsames Richtungsfeld statt voll zufällig.
  - Sechs Werkzeuge einzeln (`clay-relief.v4`): Fingerfächer, Spachtelzug, Falten, Daumendellen, Daumenstrich, Nudelholz; je Material Stärke, Größe (S/M/L = 0,5/1/2 × Handkachel 4,8 m), Abdeckung in Werkzeugzonen.
  - Alte Handspurkarte (v2) und Macro je Material schaltbar (`profile.legacy`). Fahrbahn behält ihr Straßenprofil.
  - Prüfansichten `uClayDebug`: 2 Kachelzellen · 3 Facetten · 4 Werkzeugzonen.
- **Mischungen je Klasse** `clay-toolmix.v1`: Türme/Häuser, Strang/Stützen, Gelände, Kronen/Büsche, Stämme, Fels, Wolken, Karts.
- **K2-Werkbank** mit Vergleich, Werkzeugtafel 6 × 3, Klassen-Proben, Regler je Werkzeug.
- **T3 v2** (`track-look.v4`): T3 in Geometrie, Welten und Kameras unverändert, Material K2.

## Befunde (gemessen, Pixelaufnahme je Schalter)

1. **Harte Kanten:** Facetten (Prüfansicht 3 zeigt ganze gekippte Polygone in v8, auslaufende Kerne in v10).
2. **Kreuzraster:** nicht die Fingerabdrücke (aus → bleibt), nicht das Feinkorn (aus → bleibt), sondern die Querriefen des Spachtelzugs (nur Spachtel an → Raster da). In v4 entfernt.
3. **Maserung auf Hügeln, dunkle Querstreifen am Strang:** Macro (v2-Karte in 1/7 Frequenz), aus → weg. Folgt jetzt dem Legacy-Schalter.

## Offen (Problem zuerst)

1. Die Fahrbahn trägt weiter die v2-Karte (feine Längsriefen). Bewusst nicht angefasst, weil Georg das Straßenprofil als »das einzig Gute« von T2 benannt hat. Eine Werkzeug-Mischung für die Fahrbahn wäre eine eigene, freizugebende Runde.
2. Die Rippen in der Kehre fransen die Silhouette des Wulstes aus (Geometrie, seit T3).
3. Mischungen sind nach Bildurteil gesetzt, nicht gemessen.
4. v10-Werkzeuge kosten bis zu 54 Texturlesungen je Pixel mehr (6 Werkzeuge × 3 Ebenen × 3 Kachel-Lesungen, Zonen sparen viel). Kein Race-Budget gemessen.
5. Aus T3 weiter offen: Helix-Etagen ohne Stützen dazwischen, Looping frei stehend, TN02 im Strang-Look.

## Für Integration

- Neue Bühnen importieren `clay-material.v10.js` + `clay-relief.v4.js` (Werkzeugkarten, 3 × 1024² RGBA, ≈ 1–3 s beim Start) + `clay-toolmix.v1.js`.
- Pro Material: `profile.tools = TOOLMIX.<klasse>`, `profile.legacy = 0`; Fahrbahn `legacy = 1` ohne Werkzeuge.
- Globale Werte wie T2/T3: Handmaß 1,5 m (k = 3), Kachel 4,8 m, Abdruckkachel 13,5 m.
