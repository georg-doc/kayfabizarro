# KARTENVIERTEL_FT_R1 · leicht (FT1-L)

WSB, 11.11.2026. Auf WS0-Nachfrage: Georg hält Low-Poly und Vereinfachen für die Richtung aller Gebäudeteile. Das hier ist die leichte Fassung des Fenster- und Tür-Bausatzes (V-1606). Die weiche Fassung FT1 bleibt unverändert daneben liegen.

## Was anders ist
- Keine Unterteilung (Subdivision) mehr. Die Rundung kommt nur noch aus der Fase: 2 Segmente, 1,7-mal so breit wie bisher. Die Lamellen der Läden haben nur eine Fase.
- Ohne Unterteilung sind keine Stützkanten mehr nötig.
- Gleich geblieben sind Hand-Unruhe (Rauschen und Scherung), Maße, Zonen (rahmen/blatt/scheibe), Ursprung Mitte Unterkante, Rückseite = Wand und Vorderseite +Z.
- Sichtbar ist nur, dass die Ecken der Öffnungen etwas eckiger sind. Der Knet-Eindruck bleibt.

## Dreiecke
Gesamt: vorher 95352, nachher 16716, das sind 17.5 %, also gut ein Sechstel statt des angebotenen Drittels.

| Teil | vorher FT1 | nachher FT1-L | Anteil | B × H × T (m) |
|---|---|---|---|---|
| Sprossenfenster 2×3 mit Bank (Wohnhaus_Fenster_A) | 6076 | 892 | 15 % | 1.00 × 1.85 × 0.148 |
| Sprossenfenster mit Oberlicht (Wohnhaus_Fenster_B) | 5852 | 872 | 15 % | 1.15 × 2.15 × 0.148 |
| Haustür mit Oberlicht (Wohnhaus_Tuer) | 6468 | 1316 | 20 % | 1.50 × 2.50 × 0.148 |
| Bandfenster 2-teilig (Buero_Fenster_A) | 3644 | 620 | 17 % | 1.20 × 1.65 × 0.131 |
| Bandfenster mit Kippflügel (Buero_Fenster_B) | 4828 | 780 | 16 % | 1.20 × 1.90 × 0.131 |
| Glastür 2-flüglig (Buero_Tuer) | 6748 | 1212 | 18 % | 1.80 × 2.65 × 0.148 |
| Industriefenster 4×5 (Fabrik_Fenster_A) | 13820 | 1748 | 13 % | 1.20 × 2.20 × 0.128 |
| Industriefenster mit Kippreihe (Fabrik_Fenster_B) | 10652 | 1428 | 13 % | 1.05 × 1.85 × 0.127 |
| Rolltor mit Fensterreihe (Fabrik_Tor) | 10588 | 2312 | 22 % | 2.00 × 2.90 × 0.148 |
| Fenster mit Lamellenläden (Vorstadt_Fenster_A) | 10900 | 2572 | 24 % | 1.78 × 1.74 × 0.142 |
| Fenster mit Brettläden (Vorstadt_Fenster_B) | 11260 | 2188 | 19 % | 1.97 × 2.01 × 0.143 |
| Tür mit Vordach-Kante (Vorstadt_Tuer) | 4516 | 776 | 17 % | 1.73 × 2.60 × 0.148 |

## QA
- Knet-Bühne (V-346), 14 Läufe: 12 Teile vorn und seitlich, die Reihe „Alle“ vorn und dreiviertel, dazu nachts vorn.
- G2, G3, G5 und G6 bestehen überall.
- G4: keine offenen Ränder. Die Warnungen betreffen nur gewollte Kleinteile (Lamellen, Knäufe, Griffe, Riegel), wie in FT1.
- GLB-Prüfung: Wurzel ohne Transform, x mittig, y ab 0, z von 0 bis zur Tiefe (höchstens 0,148 m), 12 von 12.
- Nachtbeleg: Die Scheiben leuchten warm als eigene Zone (V-1556).

## Dateien
- `glb/<Teil>.ft1l.glb` (12 Stück)
- `reihe_glb/` (Reihen je Gebäudeart und Alle, Tag und Nacht)
- `blend/KFB_FT_Bausatz.ft1l.blend`
- `teile.ft1l.json`
- `proof/` (teile, reihe, nacht)
- `FT1L_Vergleich_Wohnhaus_Buero.png` und `FT1L_Vergleich_Fabrik_Vorstadt.png`: je Teil vorher und nachher, vorn und seitlich, mit Dreieckszahlen
- `scripts/ft_leicht.py`: dasselbe Bauskript mit Schalter „leicht“; Aufruf `blender -b --python ft_leicht.py -- <out> [nacht]`
- `scripts/vgl.mjs`: baut die Vergleichsbögen

Nichts ins Spiel eingebaut, nichts gepusht.
