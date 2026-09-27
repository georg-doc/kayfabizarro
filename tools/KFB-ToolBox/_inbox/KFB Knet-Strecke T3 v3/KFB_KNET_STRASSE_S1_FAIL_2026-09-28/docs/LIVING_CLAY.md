# LIVING_CLAY · Knetwelt-Linie (Claymation-Look)

Stand 2026-09-27 (6) · das eine Stand-Dokument dieser Linie. Plan für den Einsatz in WorldBuilder, Racer, ToolBox: `PLAN_KFB_CLAY_LOOK_KIT.md`. Ein frischer Chat liest zuerst
`ONBOARDING_frischer_chat_claymation.md`, dann dieses, dann `CLAUDE.md`.
Verfahren und Zahlen: `HOWTO_KFB_3D_Claymation_Diorama_Worldbuilding.md`. Verlauf: `CHANGELOG.md` (nur oberste Einträge lesen).

## Pflege-Regel (hält dieses Dokument klein)

- Höchstens **120 Zeilen / 10 kB**. Wird es größer, wandert der älteste Abschnitt »Stand je Scheibe« nach
  `docs/archive/LIVING_CLAY_<datum>.md` und hier bleibt eine Zeile mit Verweis.
- Je Scheibe **höchstens 8 Zeilen**: Einstieg, was sie zeigt, Georgs Urteil, offene Punkte.
- Begründungen, Zahlenreihen und Befund-Geschichten gehören in den `CHANGELOG.md` (additiv, oben neu)
  oder ins How-to, nicht hierher.
- Eine Zeile »Offen« wird gestrichen, wenn sie erledigt ist; erledigt steht im Changelog.

## Stand je Scheibe

**S1 Knet-Straße v1–v3 · FAILED** (28.09.) — Postmortem `POSTMORTEM_S1_KNET_STRASSE.md`, Export `export/KFB_KNET_STRASSE_S1_FAIL_2026-09-28/`, Handover an WSA (Re-Briefing mit Bildvorlagen je Bauteil). Georg: nur die Eindellungen sind okay; Schatten-/Clipping-Bug zurück. T3 v3 (Markierungen) mit zurückgestellt. Kein Bau an S1 bis zum Re-Briefing.

Stand vor dem Urteil, zur Nachvollziehbarkeit: **S1 v3 · Knet-Straße** (28.09.) — `KFB Knet-Strasse S1 v3.dc.html` → `lab-track/road-scene.v3.js` (v1, v2 bleiben als Stand).
Straßenarchitektur: Fahrbahn → Rinne (0,3 m, dunkler) → Bordstein als EIN Zug (Fuß 0,2 m unter Fahrbahn, senkrechte Ansicht, Rundkopf r 0,14, Fugen alle 1,5 m als Kerbe) → Gehweg bündig hinter dem Bordsteinkopf. Am Zebra läuft der Bordstein durch. Georg zu v2: Bordsteine »draufgesetzt«, Gehweg mit eigener Kante.
Markierung »Knetwurst« (S 0,3 · M 0,6 · L 1,2 m, 5 cm, runde Enden, 1,5-m-Raster, Knubbel an Treffpunkten), Farben je Welt aus `ROADPAL`, KayKit-Möbel per Vertex-Atlasfarbe auf die Palette, Ampel-Blick gemessen, Laternenarm aus Kopf- gegen Fußschwerpunkt.
Linien-Artefakte gemessen: Risse/Kerben/Spachtel aus → bleiben; Falten (Voronoi-Grenzen der Facetten) aus → weg. Fahrbahn ohne Falten, Mischung road3 kräftiger (Fächer 0,9). Offen: Fächer auf der Fahrbahn evtl. zu dicht · Fugen fein.

**T3 v3 · Markierungen auf dem Stream** (28.09.) — `KFB Knet-Strecke T3 v3.dc.html` → `lab-track/track-look.v5.js`. Knetwürste in (s, u) gebaut und über die Stream-Rahmen gebogen: Straße je Welt (Canyon Stadt · Bucht Welle + Perlen · O-Town Zickzack), Bahn Rennrand M, Magnet Boost-Winkel an den Stream-Balken, Looping zwei Leitbänder L + Punkte M. Werkzeugkarten v5 (auch K2).
Offen: Georgs Urteil · Winkel an Kurven leicht gezahnt · Infokarte zeigt die Welt nur nach Klick.

**K2 · Knet-Werkzeuge** (28.09., Georg: »top! das ist super«, eingecheckt) — `KFB Knet-Werkzeuge K2.dc.html` → `lab-clay/clay-tools.v1.js`, Material `clay-material.v10.js`, Werkzeugkarten `clay-relief.v4.js`, Mischungen `clay-toolmix.v1.js`.
Harte Kanten: Druckfacetten (ganze Zelle gekippt) → Kippung läuft zur Grenze aus; Kachelzellen breiter gemischt, ±22° um ein Richtungsfeld. Sechs Werkzeuge × S/M/L × Stärke × Abdeckung in Zonen.
Kreuzraster gemessen: nicht die Fingerabdrücke (aus → bleibt), sondern die Querriefen des Spachtelzugs (nur Spachtel an → Raster). v4 ohne Querriefen. Maserung auf Hügeln und dunkle Querstreifen am Strang kamen aus Macro (v2-Karte in 1/7 Frequenz) → folgt jetzt dem Legacy-Schalter je Material.
Mischungen gesetzt: Türme, Strang, Gelände, Kronen, Stämme, Fels, Wolken, Karts; Proben vorn in K2. T3 auf K2: `KFB Knet-Strecke T3 v2.dc.html` → `track-look.v4.js`, Fahrbahn unverändert (legacy 1).
Offen: Fahrbahn-Straßenprofil trägt weiter die v2-Karte (feine Längsriefen, bewusst nicht angefasst) · Rippen der Kehre fransen die Wulst-Silhouette aus · Mischungen nach Bildurteil gesetzt, nicht gemessen.

**T3 · Knetstrang** (27.09. nachts, Georg: »Top! wir haben endlich ein Design … sehr coole und ausbaufähige Basis«) — `KFB Knet-Strecke T3.dc.html` → `lab-track/track-look.v3.js` (eigene Bühne, nichts aus track-kit.v2). Richtung Georg: bunt, harmonisch-schräg, Rocko × SpongeBob × Wallace & Gromit × Mario Kart.
Ein Strang je Welt (Kehle + Wulst + Bauch + Stützen, eine Farbe), Fahrbahn exakt aus TD03 mit Straßenprofil k = 3, Straße↔Bahn als Knetflecken. Rippen innen, Prallwulst außen (bis +0,3 m über Wandhöhe), Lippe als Querwulst, Boost-Pfeile als Knetplatten.
Stützen: Elefantenfuß, Taille, Bauch, Kapitell; > 14 m doppelt mit Brücke, gestapelte Glieder. Welt: Hügel, schiefe Türme, krumme Kugelbäume, Dreiergruppen, Wolken, 3 Karts. Welten A Canyon · B Bikini-Bucht · C O-Town.
Offen: Rippen lesen noch nicht als Rippen (Kehle in der Kehre zu schmal) · Helix-Etagen ohne Stützen dazwischen · Looping frei stehend. Export `export/KFB_TRACK_LOOK_S4_T3_KNETSTRANG_2026-09-27/`, Handover an WSA.

**S4 Track-Look T1/T2 · FAILED** (27.09., abgelöst durch T3) — Postmortem `POSTMORTEM_S4_T1_T2_TRACK_LOOK.md`, Export `export/KFB_TRACK_LOOK_S4_T2_FAIL_2026-09-27/`, Handover an WSA für Re-Briefing der Design- & Art-Guidelines. Kein Bau bis dahin.

**T2 → Konzept (nicht freigegeben)** (27.09. spät): Georg verwirft Design, Palette, Banden und Schildchen von T2 (»AI-Slop«, »wie Drahtgitter«, »schlampig«); gut waren nur die Fahrbahn-Texturen. Neues Prinzip »Knetstrang« in `lab-track/KONZEPT_S4_KNETSTRANG.md`, erst nach Freigabe bauen (T3, frischer Chat). Rampe: bauchige Form über Core-Geometrie.

**T2 · Knet-Strecke AB** (27.09., S4 Phase A Produktionspass) — `KFB Knet-Strecke T2.dc.html` → `lab-track/track-look.v2.js` + `track-kit.v2.js`, Satz `track-skins.v0.1.json` (`production: AB`).
Georg: A ist Grundlage (Material, Licht, Knettextur), B liefert Streckensprache, C nur Preset. Szenen TD03, TN02 (Gotthard-Portal aus dem Stream), Kanten-Atlas (18 Zeilen).
Übergänge als Knetflecken über (s, u), keine Verläufe. Rand »Ein Guss«: Hohlkehle + Randwulst als ein Körper, zwei Farben je Welt, Kerb-Farbe nur innen in Kurven, Warntafeln außen, Cartoon-Stützen; Fahrflächen ohne Abdrücke. Vier Übergangsfamilien je Eintritt/Mitte/gesetzt. Fahrbahn unverformt.
Rückgabe: `lab-track/RETURN_S4_PHASE_A.md` (Probleme zuerst, Core-Wünsche). Offen: Schulter der Bahn 0,59–0,69 m (Core-Wunsch Auslauf) · Kappe 0,30 m am Kicker (Core-Wunsch capMin) · FS01 SOURCE_REQUIRED · b11, S4B, S5 außerhalb.

**T1 · Knet-Strecke** (27.09.) — `KFB Knet-Strecke T1.dc.html` → `lab-track/track-look.v1.js`. Optionen A/B/C als Stand vor Georgs Richtung, unverändert.

**K7 · Knet-HUD** (27.09.) — `KFB Knet-HUD K7.dc.html` → `lab-clay/clay-hud.v1.js` (Material v8, HUD-Profil in px).
Ein HUD für Start, Race, Walk, Combat, Flug: Wortmarke als Knetschild (Spender `v17/frizzlegraft-v1/wordmark.v1.js`), Zeit, Runde, Position, Tacho (HUD-v4-Rampe), HP-Balken (rot < 20 %, gelb, grün > 80 %),
Pop-Score mit Popcorn-Box und ploppenden Körnern, Rucksack-Knopf + Inventar 20 Plätze, 6 Aktions-Slots (leer unsichtbar), Countdown, Einstellungen mit Knet-Reglern.
Reaktion je Modus (Leerlauf, Kinetik, Musik-Puls aus Analyser), Schalter »Ruhig«. Georg: »top!«, eingecheckt (Export `export/KFB_CLAYMATION_K7_KNET_HUD_2026-09-27/`).
Offen: Pop-Score, Rucksack-Geschenke, HP an echtes Spiel (Racer-Loop, Arena) · Musik-Puls auf Jukebox · Minikarte/Almanach/Radio aus HUD v4 · Blasen mit Text.

**K1 · Knet-Katalog** (27.09.) — `KFB Knet-Katalog K1.dc.html` → `lab-clay/clay-catalog.v5.js` (Material v8 mit Handmaß, Profile v2).
20 Muster in Weltmaß auf einem Knet-Tisch, je Klasse, anklickbar, Abstand fern/mittel/nah, Profil je Muster tauschbar, alle Regler.
Blasen v4: Knetplatten, Spitze/Perlen zielen jedes Bild auf den Kopfknochen. Namen nur unter dem Zeiger, Schalter »Alle Namen«. Offen: große Druckstellen lesen auf Flächen als Krater
(Tisch hat eigenes ruhiges Profil; Tiefe nach Handmaß → K2) · Blasen ohne Text · Knet-HUD fürs Race folgt.

**H0 · Hirnwelt** (27.09., Georg: »begeistert … großartig«) — `KFB Hirnwelt H0.dc.html` → `lab-brain/brain-world.v8.js` (Material v8, Profile).
BodyParts3D-Hirn (44 Netze) als kleine Knetwelt: Gyri Hügel, Sulci Flüsse, Straße auf den Graten mit Brücken,
12 Orte nach Funktion der Region, 14 Figuren (4 Large, 10 Medium) aus dem Resident Atlas, 8 Autos, Mitfahr-Kamera.
Quellen `lab-brain/SOURCES.md`. Offen: Ladezeit ≈ 40 s · Orte-Kamera bei der Sternwarte zu nah · Figuren nicht
gegen die Straße geprüft (Demon Lord steht am Rand) · eine Runde, keine Kreuzungen · Broca fehlt in der Quelle.

**M0 · Knet-Medizin** (26.09.) — `KFB Knet-Medizin M0.dc.html` → `lab-med/med-probe.v3.js`. Molekül (PubChem),
Herz (BodyParts3D, 12 Strukturen), Erythrozyt (Evans & Fung). Knetgrad 0–100 mit gemessener Formabweichung.
Slice `export/doccheck-slice/Knet-Medizin/`. Offen: Herzkammern ohne eigene Netze · Leukozyten für Sim-Blood.

**D1 · Knet-Probe** (26.09., Georg: »top! guter erster POC«) — `KFB Knet-Probe D1.dc.html` → `lab-clay/clay-probe.v5.js`.
Plateau aus Kissenziegeln, KayKit-Häuser, Kenney-Fahrbahn und -Rennwagen, CapsuleCarl, Wolke, Knetmasse, Tafelberge.
Jede Schicht schaltbar. Konzept: `KFB Knetwelt Look-Konzept.dc.html`. Offen: Tafelberge sind Kästen · Kenney-Auto wird gelb.

## Module (aktiv)

| Datei | Rolle |
|---|---|
| `lab-clay/clay-material.v10.js` + `clay-relief.v4.js` + `clay-toolmix.v1.js` | K2: Facetten weich, Kachelung mit Richtungsfeld, Werkzeuge einzeln in Zonen, Legacy je Material, Prüfansichten 2–4, Mischungen je Klasse |
| `lab-track/track-look.v4.js` | Bühne T3 v2 (T3 auf Material K2) |
| `lab-track/road-scene.v3.js` + `clay-toolmix.v2.js` + `clay-relief.v5.js` | Bühne S1 v3 (Knet-Straße): Bordstein-Zug, Rinne, Knetwurst, ROADPAL (v1, v2 als Stand) |
| `lab-track/track-look.v5.js` | Bühne T3 v3 (Markierungen auf TD03) |
| `lab-clay/clay-tools.v1.js` | Bühne K2 (Knet-Werkzeuge) |
| `lab-track/track-look.v3.js` | Bühne T3 (Knetstrang), Material v8 |
| `lab-clay/clay-material.v8.js` | Knet-Material: Handmaß (feste Fingergröße), Profile, Entfernungsbänder, Sechseck-Kachelung, Kerben, Haarrisse, Druckstellen (H0) |
| `lab-clay/clay-profiles.v2.js` | ein Profil je Asset-Klasse |
| `lab-clay/clay-hud.v1.js` | Bühne K7 (Knet-HUD) |
| `lab-clay/clay-catalog.v5.js` | Bühne K1 (Knet-Katalog) |
| `lab-track/track-look.v2.js` + `track-kit.v2.js` | Bühne T2 und Bausteine (Flecken-Material, Zustände, Tunnel mountain, Atlas) |
| `lab-track/track-skins.v0.1.json` | Skin-Satz `kfb.track-skins/0.1`, Produktion AB |
| `lab-track/track-look.v1.js` | Bühne T1 (Optionen A/B/C) |
| `lab-track/stream-to-three.mjs` | Referenz-Loader des Track Core, unverändert |
| `lab-clay/clay-material.v4.js` | Vorgänger, noch von D1 und M0 importiert |
| `lab-clay/clay-relief.v2.js` | Gradientkarte der Handspuren (RG) und Feinkorn (BA) |
| `lab-clay/clay-soften.v1.js` | Vorstufe: unterteilen, verschweißen, Taubin, Beulen |
| `lab-clay/clay-probe.v5.js` | Bühne D1 |
| `lab-brain/brain-world.v8.js` + `brain-world.v1.bin/.json` | Bühne H0 und gebackenes Gelände |
| `lab-med/med-probe.v3.js` | Bühne M0 |

Superseded, kein Importer: `clay-material.v9`, `clay-relief.v3` (K2 erste Fassung), `clay-catalog.v3–v4`, `clay-probe.v1–v4`, `clay-material.v1–v3`, `clay-relief.v1`, `brain-world.v1–v6`, `clay-material.v5–v6`, `clay-profiles.v1` (gelöscht).

## Entscheidungen Georg

- Relief über den Modelle-Weg für alles (Stempelkarte, Facetten, Abdrücke). Palette Claybound, Option C als Schalter.
- Häuser bleiben KayKit + Vorstufe (»exakt diese Cartoon-Optik«), nicht nachmodellieren.
- Kugel-in-Kugel als Muster für Wolken und Bäume behalten.
- Straßenführung über Grate mit Brücken und Flüsse in den Furchen sind abgenommen.
- CC BY-SA (BodyParts3D) ist in Ordnung. Kein Stop-Motion vorerst.
- Panel im Stil `kfb-hub/index.html`, nicht DocCheck (Konzept-Dokumente bleiben DocCheck).

## Offen (linienweit)

- TUNE: Default-Reglerstand aus Georgs Einstellungen übernehmen.
- OPEN: Vorstufe offline als `.glb` backen (Ladezeit H0, Bildrate D2).
- OPEN: Figuren ohne KFB-Augen-Rig.
- DEFERRED: KlayfaBizarro-Kollisionen (Gummi federt zurück, Knete bleibt verformt).
- ERLEDIGT 27.09.: Fingerprints 01 ist laut cgbookcase CC0. Die `.meta` im joebinns-Repo sind nur Unity-Importeinstellungen (sRGB, Mipmaps, max. 2048, Repeat), keine Nutzungsvorgabe.

## Nächstes Gate

S4 Phase A Produktionspass geliefert (T2), gestoppt für Georgs Review. Nächste Schritte nur auf Zuruf: Core-Wünsche einarbeiten, weitere Tunnelfamilien, FS01 wenn der Stream da ist.
Danach wieder offen: **D2** Cologne im Knet-Look · **H1** Hirnwelt mit Kreuzungen · **M1** Erythrozyt · Kit K2–K6 (`PLAN_KFB_CLAY_LOOK_KIT.md`).
