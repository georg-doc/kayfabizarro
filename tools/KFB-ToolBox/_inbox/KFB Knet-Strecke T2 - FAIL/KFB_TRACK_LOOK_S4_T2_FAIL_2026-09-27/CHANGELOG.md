# 2026-09-27 (8) · Knetwelt-Linie · S4 Track-Look FAILED, Postmortem, Export, Handover WSA

- Georg: T1/T2 im Look vollständig verworfen (Design, Palette, Cartoon-/Knet-Anatomie, Schildchen, Stützen, schlampig). Gut nur die Fahrbahn-Texturen.
- **Neu:** `POSTMORTEM_S4_T1_T2_TRACK_LOOK.md` (12 Befunde mit Beleg, 6 Wurzelursachen, Nie-wieder-Liste).
- **Export:** `export/KFB_TRACK_LOOK_S4_T2_FAIL_2026-09-27/` mit HANDOVER_WSA (Re-Briefing Design- & Art-Guidelines), NEXT_CHAT, Belegen, Technikstand.
- Onboarding für frischen Chat aktualisiert: kein Bau vor dem Re-Briefing.
- **Fahrbahn-Relief wiederhergestellt** (Georg: im Export nicht mehr da): Abdruck-Kachel 4,5 × k, Druckwellen 0,5, Detailweite 0,6, Handspuren 0,7, Fahrbahn-Rollen ohne Überschreibung, Stand 21:30.
- **T2 lud im ersten Export nicht** (Streuung vor `ctr`): behoben, Export neu gepackt.

# 2026-09-27 (7) · Knetwelt-Linie · T2 verworfen, Konzept »Knetstrang« zur Freigabe

- Georg: Design, Farben, Cartoon- und Knet-Look von T2 »totaler Fail«, Palette schlecht, wirkt wie Drahtgitter, schlampig; Banden-Schildchen »AI-Slop«. Gut: nur die Fahrbahn-Texturen.
- Sofort: Tafeln entfernt, Fahrbahn wieder mit vollem Straßenprofil, Kerb-Streifen beginnen auf Streifengrenzen, Richtung CB (Claybound-Palette), Streuung nach Rule of Three.
- **Konzept** `lab-track/KONZEPT_S4_KNETSTRANG.md`: drei Massen/Farben + ein Akzent, dick statt dünn, Bedeutung durch Form (Rippen, Prallwulst, Pfeilkerben), eine Handgröße, Welt statt leerer Tisch. Bau erst nach Freigabe (T3).

# 2026-09-27 (6) · Knetwelt-Linie · S4 Produktionspass AB (T2)

- **Rand neu: »Ein Guss«** (Georg: Banden kleinteilig, helle Kappe, Bauch-Verformung, riesige Knet-Artefakte verworfen). Hohlkehle + Randwulst + glatte Außenwand, zwei Farben je Welt, Kerb-Farbe nur innen in Kurven, Warntafeln außen, Cartoon-Stützen. Fahrflächen ohne Abdrücke/Druckstellen.

- **Nachtrag Georg:** doppelte rot-weiße Bande (Kerb + Wand nebeneinander) verworfen. Jetzt eine Bande je Stelle aus der Krümmung: Kerb-Streifen innen (R < 60 m), Warnblöcke außen (R < 35 m), sonst ruhig. Alle Meshes in Knete, auch Tunnel-Lichter; Detail trägt weiter.

- Georg: K7 als Checkpoint akzeptiert, keine weitere Politur und Bereinigung. Richtung AB: A Material/Licht/Knete, B Streckensprache, C Preset.
- **Neu:** `KFB Knet-Strecke T2.dc.html` → `lab-track/track-look.v2.js` + `track-kit.v2.js`. Szenen TD03, TN02 (Gotthard), Kanten-Atlas (18 Zeilen, Knetstärke-Vergleich).
- Übergänge als deterministische Knetflecken im Shader über (s, u); Reihen an Ereigniswechseln doppelt, damit nichts verwischt. Nahtansicht binär.
- TN02 aus `georg-doc-patch-2` geholt (`S9_RESPONSIVE_2026-09-27/tn02.graph.stream.json.gz`). Röhre aus `tunnelRings`, Beule ≤ 0,7 m, Hülle gemessen.
- **Befunde:** Bahn-Schulter effektiv 0,59–0,69 m (`sideL` 0,30–0,35) → Auslauf nur als Core-Wunsch zeigbar · Kappe 0,30 m am Kicker im Ist-Zustand · Stirnflächen als Fächer deckten den U-Querschnitt zu → echte Triangulation · FS01 SOURCE_REQUIRED · Profil-Nachrechnung: Seitenfaktor auch auf `shoulderDrop` (Prüfer), `barrierVis` < 1 nicht nachgebildet und so ausgewiesen.

# 2026-09-27 (5) · Knetwelt-Linie · K7 eingecheckt, S4 Track-Look gestartet (T1)

- **K7 Knet-HUD** von Georg abgenommen (»top!«), Session-Export `export/KFB_CLAYMATION_K7_KNET_HUD_2026-09-27/` mit K7, K1 und den Modulen. K1 läuft auf `clay-catalog.v5.js` (Namen unter dem Zeiger, »Alle Namen«).
- **S4 v2 Brief** (Track Core → Claude Design) angenommen. Streams nach `lab-track/data/` kopiert (TD03, Split-Seed), Referenz-Loader unverändert daneben.
- **Neu:** `KFB Knet-Strecke T1.dc.html` → `lab-track/track-look.v1.js`, Skin-Satz `lab-track/track-skins.v0.1.json` (`kfb.track-skins/0.1`, Optionen A/B/C, je Rolle Farbe + Knet-Rolle + Maßstab).
- Querschnitt je Fläche unterteilt: Kappe als Wulst (≤ 0,30 m), Rolle `kerb` auf der Schulter außerhalb road_L..road_R, Wandblöcke mit Fuge (B). Fugen gestaffelt nach b13 (Kappe −16…+2 m, Fahrbahn −3…+16 m).
- Knet-Geometrie in Stream-Koordinaten: Beulen außen 0,35 m, innen 0,12 m, unten 0,30 m, Daumendellen 8 cm, Absacken 35 % — jeweils × Stärke. Fahrbahn unverformt; Mittellinie gegen `p` wird gemessen.
- **Befunde:** `tn02.graph.stream.json.gz` und `fs01.graph.stream.json.gz` fehlen im ZIP (Tunnel- und Pad-Bilder blockiert) · kleinste Kappe 0,30 m am Kicker (i 2864, `barrierVis` 0,22).

# 2026-09-27 (4) · Knetwelt-Linie · Knet-HUD K7, Material v8

- **Neu:** `KFB Knet-HUD K7.dc.html` → `lab-clay/clay-hud.v1.js`. Schrift als Relief (Canvas → Höhenfeld), Platten mit Tuschrand, Federn für Sichtbarkeit/Hover/Druck/Stoß, Reaktion je Modus in `localStorage` `kfb-hud-k7`.
- Modelle per Byte-Abfrage geprüft (25 Pfade, alle 206): Rucksäcke Orc, Hoarder, Survivalist, Tiefling, Space-Ranger-Jetpack; Inventar aus KayKit, Kenney Holiday/Toy-Car, Platformer Kit, KFB-Krone. Donut und Popcorn-Box prozedural (kein Spender).
- **Material v8:** Handmaß (`uClayHand`) für Handspuren, Feinkorn, Abdrücke; Druckstellen/Kerben größer als eine Fingerkuppe werden flacher. K1 → `clay-catalog.v5.js` (Blasen als Platte mit gezielter Spitze/Perlen, Namen nur unter dem Zeiger), H0 → `brain-world.v8.js`.

# 2026-09-27 (3) · Knetwelt-Linie · Knet-Katalog K1

- **Neu:** `KFB Knet-Katalog K1.dc.html` → `lab-clay/clay-catalog.v3.js`. 20 Muster (Gelände, Tafelberg, Fahrbahn, Teich, 2 Häuser, Baum, Busch, Felsen, Laterne, Ampel, Hydrant, Bank, Wolke, Black Knight (Large), Farmer A (Medium), Taxi, Polizei, Sprech- und Denkblase) in Weltmaß.
- Blasen: Kugel-in-Kugel, kein Schatten, Tuschrand als umgedrehte Hülle, drehen sich zur Kamera, atmen.
- **Befunde (Pixel):** Druckstellen im Profil »Gelände Hintergrund« lesen auf dem flachen Tisch als Mondkrater → Tisch eigenes Profil, Tiefe nach Handmaß als K2 · Blasen waren doppelt so groß wie die Figur → 0,55 · Kamera auf die hintere Reihe verdeckt von Häusern → fester Blick von vorn.
- 36 fps in der Preview, 0,5 Mio. Dreiecke.

# 2026-09-27 (2) · Knetwelt-Linie · Clay Look Kit K1: Material v7 + Profile je Asset-Klasse

Georg: Knet-Mapping je Asset-Typ und Größe, Detail nach Entfernung, keine Wiederholung, mehr Kerben und Leben;
Klassen zuerst Gelände Vordergrund, Natur, Häuser, Straße; Spuren Kerben, Haarrisse, Druckstellen; Zoom bis Figur nah; 30 fps Laptop; Prüfung direkt in H0/D1.
Danach: Entwicklung primär in WorldBuilder, Racer, ToolBox → `PLAN_KFB_CLAY_LOOK_KIT.md`.

- **Neu:** `lab-clay/clay-material.v7.js`, `lab-clay/clay-profiles.v2.js` (10 Klassen). H0 → `brain-world.v7.js`, Regler Kerben, Haarrisse, Druckstellen, Farbunruhe, Bänderansicht.
- **Fingerprints 01:** cgbookcase CC0. Die `.meta` im joebinns-Repo sind nur Unity-Importeinstellungen.
- **Befunde (Pixel):** v5 kompilierte nicht (`patch` ist in GLSL ES 3 reserviert) → v6. Band »nah« nie erreicht → ×2,5 (v7). Risse lasen als Netz, Druckstellen zu dicht → Profile v2.
- **Offen:** Fingerabdrücke nach Handmaß (K2), D1 und M0 noch auf v4, Wasserkante zackig, Bildrate auf Laptop nicht gemessen.

# 2026-09-27 · Knetwelt-Linie · H0 Hirnwelt (lab-brain, neu) + How-to + Session-Export

Georgs Auftrag (eingesprochen): anatomisch korrektes Hirn als kleine Weltkugel im Knet-Look, Straßen,
Gebäude, Landmarken, KayKit-Medium- und -Large-Figuren, Wolken als Kugel-in-Kugel, Natur und Zivilisation
aus den anatomischen Strukturen. Georg: »begeistert … großartig«.

- **Gelände:** BodyParts3D 3.0 (DBCLS, CC BY-SA 2.1 JP), 44 STL-Netze, auf eine Würfelkugel gebacken
  (6 × 161², äußerster Strahltreffer, 98,9 % getroffen) → `lab-brain/brain-world.v1.bin/.json`.
- **Bühne:** `lab-brain/brain-world.v4.js` (v1–v3 gelöscht, kein Importer). Wasser als Schale unter der Hüllfläche,
  Straße per A* über die Grate, Brücken aus der Hüllkurve, Profil mit Knetwülsten.
- **Orte** nach Funktion: Stirnstadt, Motorik-Ring, Zentralfurche, Scheitelfelder, Sternwarte, Hörbühne,
  Mandelkern, Gedächtnisarchiv, Insel, Lebensbaum-Wald, Brückenlager, Balkenbrücke.
- **Figuren** nach Resident Atlas: 4 × Rig_Large, 10 × Rig_Medium, ein Maßstab 0,47. 8 KayKit-Autos.
- **Befunde:** Insula (FMA72977/8) erreicht die Oberfläche nicht, frei liegt Region 34/35 · leerer Anker → NaN-Kamera
  (abgefangen) · Gelände stieß durchs Band, jetzt über die ganze Breite geprüft · BodyParts3D hat keinen
  Gyrus frontalis inferior (Broca).
- **Neu:** `HOWTO_KFB_3D_Claymation_Diorama_Worldbuilding.md`, `ONBOARDING_frischer_chat_claymation.md`,
  `HANDOVER_WSA_claymation.md`. `LIVING_CLAY.md` neu gefasst mit Pflege-Regel (≤ 120 Zeilen).
- **Export:** `export/KFB_CLAYMATION_H0_HIRNWELT_2026-09-27/` + ZIP.


(Ältere Einträge: Projekt-CHANGELOG.md.)
