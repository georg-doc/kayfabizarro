# DESIGN_SPEC · T3 Knetstrang · 2026-09-27

Quelle der Wahrheit für Zahlen: `lab-track/track-look.v3.js` (`WORLDS`, `sideProfile`, Stützen-`lathe`).

## Massen und Farben je Welt

| Masse | A Claybound-Canyon | B Bikini-Bucht | C O-Town |
|---|---|---|---|
| Himmel (flach) | #96bede | #8fd6ec | #a8d8b9 |
| Fahrbahn Straße | #566680 | #5f7f9a | #6a6e8f |
| Fahrbahn Bahn | #3d4a60 | #3e5d7c | #4a4d6e |
| Strang (Kehle, Wulst, Bauch, Stützen) | #ef5a22 | #f2708a | #e9b53b |
| Tisch | #8b68c7 | #f0cf7e | #3aa596 |
| Hügel | #a582d9 · #7b5bb8 | #5cc3bf · #46adb2 | #2f8f83 · #4cb5a5 |
| Türme | #ef5a22 · #e8743a | #9a6fd0 · #b08ae0 | #c9508f · #e0679f |
| Laub | #1f7a3e · #2f8a45 · #cdc666 | #8fcf45 · #5fb84a · #f7a1c4 | #f08a2c · #f5b041 · #c9508f |
| Stamm | #8a5a3a | #c9895a | #6b4a8a |
| Fels | #e2d0bc | #9a6fd0 | #e0679f |
| Wolken | #e2d0bc | #fff4e2 | #f3ead8 |
| Akzent Boost (nur Spielzustand) | #f2b632 | #f7d23c | #fff06a |

A folgt der gemessenen Claybound-Palette (`PALETTES.claybound`). Canyon-Fahrbahn nach Graustufen-Prüfung abgedunkelt (Strang und Fahrbahn waren gleich hell).

## Formregeln (umgesetzt)

- **Querschnitt je Seite:** Fahrbahnkante → Hohlkehle (Tiefe = shoulderDrop) → Randwulst, Radius r = 0,55 × (barrierH + shoulderDrop), 0,14–1,25 m, Oberkante = Wandhöhe → Außenflanke mit leichtem Bauch → Unterseite ≥ 0,7 m unter Fahrbahn. Sanfte Welle am Wulst ±6 %.
- **Kurve innen:** Querrippen, Abstand 3,5 m, Höhe bis 0,26 m in der Kehle, bis 12 % am unteren Wulst. Ab Radius ≈ 125 m, voll ab ≈ 45 m.
- **Kurve außen eng:** Prallwulst r × 1,32, Oberkante + 0,3 m. Ab Radius ≈ 70 m, voll ab 25 m.
- **Offene Enden:** Querwulst r = 0,48 m unter der Lippe, bündig mit der Fahrbahn.
- **Boost-Pfeile:** je Magnet-Balken ein Winkel, Breite = span × Fahrbahnbreite, Spitze ≤ 2 m, Tiefe 0,95 m, glänzende Knete (knetbar).
- **Stützen:** Durchmesser = h/3 (2,4–4,6 m), Elefantenfuß 1,6 × Schaft, Taille 0,86, Bauch 1,06, Kissen an Gliedfugen 1,26, Kapitell 1,42. Glieder = h / (3,6 × d). Ab h > 14 m zwei Beine mit Knetbrücke je Fuge. Neigung ≤ 3°. Abstand 16 m, in Kurven 11 m. Nicht im Looping, nicht über tieferer Fahrbahn.
- **Welt:** Tisch mit rundem Rand; 22 Hügel (gedrückt, schief geschoben); 12 schiefe Türme aus 3–5 Kissenblöcken; 52 Dreiergruppen (Baum mit krummem Stamm + Kugel-in-Kugel-Krone, zwei Büsche, ein Fels) im Abstand 20–95 m zur Strecke; 14 Wolken.
- **Knetspuren:** Handmaß 1,5 m für alles (k = 3). Keine Druckstellen, Kerben, Risse auf Strang, Türmen, Tisch. Fahrbahn behält das Straßenprofil.
- **Übergang Straße ↔ Bahn:** Knetflecken über (s, u), Zelle 1,7 m, Fenster −10 … +14 m, dunkler Fleckenrand.
