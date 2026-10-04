# CHANGELOG · KFB Skydome + Environment

Additiv. Neueste Einträge oben. Frühere Einträge werden nicht umgeschrieben; ein späterer FAIL steht als eigener Eintrag.

## SKY3 · 2026-10-01 (Nachmittag) · Georg: »top!«

Neu: `lab-sky/cloud-family.v3.js`, `spindle-sky.v5.js` (Vertrag `kfb.environment.spindle-sky/0.3-candidate`), `env-host.v3.js`, `sky-gates.v3.js`, `KFB Skydome Gates SKY3.dc.html`.
- **Wolken-Familie v3** `kfb.sky.cloud-family/3-archetypes`: 13 Varianten, 6 Archetypen als Regeln über die 18 Donor-Lappen (Donor ×3, Kumulus, Stratus, Puff, Turm, Kette je ×2). Gleiche Feldlogik und dasselbe Material wie v2. Kehlen-AO 0,5 → 0,32. Turm erst als Stapel (las als Schneemann), jetzt Blumenkohl.
- **Spindel 0.3**: Mantel `himmel.v4` unverändert, dessen Halbkugel-Abschluss unsichtbar, `spindel.v4` nicht mehr gebaut. Je Ende ein auslaufender Trichter (Smoothstep-Profil, L 1,15 R, Ende 0,16 R, 0,4 u Überlapp in den Mantel), Karten laufen winkeltreu kleiner in die Nebelfarbe der End-Palette. End-Shader unten: Lava · Säure-See · Bubblegum · Wirbel. Oben: Himmel · Bubblegum · Aurora · Abendrot. Paletten: Shader-Vorgabe · Canyon/Bucht/O-Town (WORLDS aus Joyride J15, wörtlich) · Deck; Saat 1–4 (Farbton ±9°).
- Host: `setCaps` → `setSpindleEnds`. UI: Paletten-Panel um Spindel-Enden, Palette und Saat erweitert; Bildunterschriften in E0/E3.
- Prüfungen: eigene Deckungsprobe 360 Strahlen · 0 fehl · 0 jenseits far 120 (erster Lauf 3 Fehlstrahlen auf der Fuge → Überlapp). Lebenszyklus ×10 Δ 0, Leak ×4 Δ 0.
- Korrekturen unterwegs: End-Shader ohne Farbraum-Ausgabe (zu dunkel) — `colorspace_fragment` ergänzt (Dateiversion v4 → v5, v3/v4 gelöscht).

## SKY2 · 2026-10-01 (Mittag) · teilweise FAIL

Neu: `cloud-family.v2.js`, `planets.v1.js`, `spindle-sky.v2.js`, `env-host.v2.js`, `sky-gates.v2.js`, `KFB Skydome Gates SKY2.dc.html`.
- **Wolken v2** `kfb.sky.cloud-family/2-clay`: dieselben Donor-Lappen als ein geschlossenes Knetstück (Abstandsfeld je Ellipsoid → smin-Kehle → Tisch-Unterseite → Beulen → Surface Nets → Newton-Projektion, Normale = Gradient). Material: Profil `cloud` ungedämpft (v1 lief mit QUIET). Erster Lauf smin 0,055 las als Kartoffel → 0,022.
- **Planeten**: 11 × `Planet_N.gltf` aus dem Quaternius-Pack, Schicht `sky-planets` beim Host, Modi Aus/Original/Knete, 3 oder 6.
- **UI** nach Resident Atlas S15: Symbole für Paletten, Messwerte, Details, Nur Ansicht; Details als schwebender Inspektor.
- **Polkappen** (planar abgebildete Kartenrosette an beiden Polen) — **FAIL** laut Georg (»schlecht gebastelt, nicht beauftragt«). Ersetzt durch SKY3.
- Befund: v2 ist teurer als v1, nicht billiger (Vermutung »weniger Überzeichnung« nicht bestätigt).

## SKY1 · E0–E4 · 2026-10-01 (Nacht/Morgen)

Neu: `env-host.v1.js`, `cloud-family.v1.js`, `spindle-sky.v1.js`, `sky-gates.v1.js`, `KFB Skydome Gates SKY1.dc.html`; E4: `lab-hex/hex-island.v5.js` + `KFB Hex-Kosmos HX1 Sky.dc.html`.
- EnvironmentHost mit genau einem Besitzer für Uhr, Nebel, Licht, Tageszeit, Wetter, Schale.
- Jarlan-Donor per SHA-1 gepinnt, 18 Lappen in 3 Wolken gemessen; Familie v1 (6 Varianten, Rekombination, 3 LOD, Instancing).
- Drei Schalen, Hot-Switch, Leak ×10 Δ 0; Spindel aus den Combat-Donoren (sechs echte Karten), C29 bestanden.
- E4 in HX1: Schalen, Tageszeiten, Regen, Aurora/God Rays, Flare aus der Host-Sonne; Messreihe 0/4/12/24 (12 Wolken 77 ms gegen 46 ms, nicht isoliert).
