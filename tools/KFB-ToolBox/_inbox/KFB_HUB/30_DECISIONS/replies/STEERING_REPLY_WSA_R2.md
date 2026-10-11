# Antwort der Steuerung an WSA · Look-Spec R2 (11.10.2026)

**R2 abgenommen.** TD1–TD5, CS1–CS3, CR1–CR4 zugeordnet, `skin` inkl. `trail`, Cosmic als reine Quellenliste. Sauber.

## Deine 19 Fragen: fast alle schon von Georg beantwortet
Bitte `replies/STEERING_ANSWERS_TD_R2.md` (V-154) lesen; R2 ist offenbar vor diesem Update entstanden. Zuordnung:

| Nr. | Antwort |
|---|---|
| 1 Banden innen/außen | V-154: Variante B, q.edge, Anlauf ≥ 8 m, J17-Schwellen (RKIT 0.16.4 gebaut) |
| 2 Haifischzähne | V-154: bei town Haifischzähne, sonst Strichlinie |
| 3 Zebra am Kreisel | V-154: eine Autolänge vor der Wartelinie, nur Arme mit Gehweg |
| 4 Planke/Zaun | V-154: optional je Abschnitt, Standard Kurven/Hänge; Zaun an Weiden/Höfen |
| 5 Belagswechsel in Kurve | V-154: nicht in Kurven, nur Geraden ~20 m (RKIT erzwingt das als Fehler) |
| 6 Land-Y | V-154: als EXIT |
| 7 Ausstattung | V-154: Insel-Ausstattung im Lab, Core nur Anker |
| 8 Energie-Kante | V-154: die Bande leuchtet; Form/Stärke = Cosmic-Look, **offen bei Georg** |
| 9 Cosmic-Stützen | V-154: im All keine Stützen, nur auf Asteroiden-Inseln |
| 10 Y im All | V-154: FORK ohne Kreuzungsverkehr |
| 11 HIGHWAY | V-154: Skin country, Kappen bande_head |
| 12 Berm 35° | V-154: bestätigt (RKIT 0.16.5 gebaut) |
| 13 Schotter-Knoten | V-154: zuerst nur Schotter-Arme (gebaut) |
| 14 Dirt-Ende | V-150 #12: Wiese, Hof oder Gatter |
| 15 trail-Maße | V-157/V-158: gemessene Gangwerte Medium-Rig, ≤ 12 % ohne Stufen; RKIT-trail-Bibliothek 0.16.6 |
| 16 Tunnel-Gehweg | V-154: erhöhter Steg mit Geländer im Straßentunnel |
| 17 trail und Autos | V-154: trail = Geh-Netz, keine Autos; Netz gehört dem Lab-Layout (V-155) |
| 18 Stützmauer | V-154: talseitig, Mauer-Baukasten V-105 |
| 19 Haltebucht Land | V-154: bündig mit Kies, ohne Bord; Sackgasse immer mit Wendeschleife (V-150 #7) |

Offen bleiben nur: **Cosmic-Look** und **Steinviadukt auf Inseln**. Bitte R2 nicht nachbessern, nur im Kopf auf V-154 verweisen.

## Nächster Auftrag: Szenen-Studie Teil C · Licht (Recherche, kein Bau, kein Lab-src)
Aus `BRIEF_WSA_SCENE_STUDY_R1.md` §3, fokussiert:
1. **J17-Tageslicht als Strecken-Welt-Preset**: echte Werte aus J17 (Hemi Himmel/Boden, Sonne Farbe/Stärke/Höhe/Azimut, Tonemapping, Nebel), mit Quelle und Zeile; Vergleich mit dem Lab-Preset (day-night.js ist einziger Schreiber).
2. **Abend-Preset TUNE (V-050)**: „zu orange und zu dunkel“: Belege aus J17/KayKit/Quaternius-Previews, was ein Abend in diesem Stil heller und weniger orange macht (Werte, nicht Bilder).
3. **Tunnel-Innenlicht**: TC1-Lampen/Emission als Quelle; was in J17 die creme-rote Röhre lesbar macht.
Ergebnis: `replies/WSA_LIGHT_STUDY_C_R1.md` + `light-presets.json` (Vorschlag), alle Zahlen mit Quelle, ehrlich gemessen/geschätzt.
