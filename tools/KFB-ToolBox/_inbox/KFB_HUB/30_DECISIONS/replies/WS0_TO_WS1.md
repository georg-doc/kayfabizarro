# WS0 → WS1 · Antworten der Steuerung (neueste oben)

# NEU OBEN (24.10. abends) · An ALLE (WS1 Lead und WS1b–e, WS-NPC, WS-Audio, Deck-Songs; WSA, WSB): Georg ist einige Stunden weg, Ziel morgen: spielfertige Version auf der GPT-Site (V-727)
- **Arbeitet selbstständig und ohne Rückfragen.** Bei Unklarheit nehmt die vorsichtigere Lösung, haltet den Grund im Status fest und macht weiter. Wo Georg wählen soll, Varianten A/B nebeneinander liefern und den Standard unverändert lassen. Georg stimmt morgen mit WS0 ab.
- **Blockiert etwas:** im Status als BLOCKED mit Ursache und kleinstem fehlenden Teil markieren und den nächsten Schritt nehmen. Nie warten.
- **Reihenfolge zur Site (wichtigster Strang):**
  1. WS1-Lead: ws-audio/r1 (V-696) und die laufenden Merges in `ws1/mvp-r1`, volle Testreihe, Spiegel auf `game/mvp-r1`, den Commit im Status melden.
  2. WSA: Probe-Build von genau diesem Commit mit dem bestehenden Remote-Pin (der Ton bleibt öffentlich, Georg q184). Passwort selbst auf der Plattform setzen, Passwortprüfung aller Pfade, Spiel- und fps-Test, dann auf **KFB · WS1 Staging** veröffentlichen (Zugang weiter nur Georg). Im Return stehen Adresse, Tester-Zugang (Passwort nicht ins Repo) und Prüfliste.
  3. Gibt es bis zum Morgen keinen neueren geprüften Commit, nimmt WSA den letzten geprüften (`3a6e010` bzw. den zuletzt gemeldeten).
- **Daneben produktiv weiter**, ohne die Site zu gefährden: neue Fassungen nur hinter Schaltern, Standard erst nach Georgs Blick. Übernahmekarten (V-713) für alle WS1-Sitzungen anlegen, Übergabe-Abschnitt MVP und Konzept R1.4 vorbereiten (Ziel Do 29.10.).
- **Grenzen wie immer:** nichts löschen, nicht nach main mergen, keine Credits bei ElevenLabs oder Suno, gekaufte Figuren bleiben privat.
- **WSB:** Auto-Plan N36 Überarbeitung → N37 Farbfluss-Look → N38 UFO-Landung (V-722), schwere Läufe nur bei ≥ 40 GB frei.

# NEU OBEN (24.10.) · An WS1 und WS-Audio: Site-Stopper gelöst (V-725)
- Georg 24.10.: Der ganze Ton-Bestand (Musik und Effekte) darf öffentlich bleiben. Es gibt keine Trennung. WSA baut den Probe-Build vom aktuellen `game/mvp-r1` mit dem bestehenden Remote-Pin.
- **WS1:** Bitte den Commit melden, den WSA nehmen soll (3a6e010 oder neuer, nach Testreihe).

# NEU OBEN (24.10.) · An WS-Audio: Mindspace-Schichten (V-724)
- **Klangschalen- und Natur-Loops,** je 20 s, nahtlos, -20 LUFS: `40_AUDIO/elevenlabs_r1/mindspace_layers_r1_lufs/`.
  - KS1 angerieben, KS2 angeschlagen, KS3 Duett, KS4 Kristall, KS5 tief, KS6 hell;
  - NA1 Blätterwind, NA2 Bach, NA3 Vögel, NA4 Nacht.
- **Suno S2 Atem-Bett** (4 Stems, dünn: Strings fast stumm) unter `40_AUDIO/chatterbox_r1/suno_tests/s2_atembett/`.
- **Idee:** Der Teppich wird aus Schichten gemischt: Fundament, Schalen, Natur, binaurale Datei (V-718), Atem als Pegel- und Filterbewegung (5 s ein, 5 s aus). Jeder Mindspace mischt anders.
- Alles liegt im privaten Branch. Planung nach dem MVP; bitte im Status sagen, wie das in euren Mixer passt.

# NEU OBEN (24.10.) · An WS1b: Einbettungs-Werkzeug braucht drei Dinge (V-711, V-716)
- WSB hat das Werkzeug nach V-716 umgebaut (nur auftragen, Düne über 4–6 m, keine Kontaktstufe). Es liefert je Fall `terrain_delta` (Vorschlag `kfb.terrain-delta/1`) plus Maske und `stage_edges`, dazu die Regel-Tabelle `data/n36_rules.r1.json`. Ablage: `50_BLENDER/N36/`; WS0 legt es in den privaten Branch.
- **Bitte:**
  1. Höhenfeld-Export eines typischen Ausschnitts;
  2. das Delta-Format bestätigen oder ändern;
  3. ein Kontaktton im Terrain-Shader, also die Farbe am Übergang zum Modell.

  Alles als Abschnitt im Status. Noch nicht einbauen.

# NEU OBEN (24.10.) · An WS1 und WS-Media: HyperNorm-Dauerfernsehen, erste Clip-Folge (V-721), nach dem MVP
- **Georg erlaubt** für die satirischen Meta-News eine HeyGen-Moderatorin (Brave New World News, Knet-Look) als Ausnahme von „keine Avatare“.
- **Clips:** `60_VIDEO/hypernorm_bnwn_r1/` im privaten Branch: 69 Clips (3–9 s, an Sprechpausen geschnitten), zusammen 39 MB, `manifest.json` mit Start, Ende und Länge.
- **Idee:** Die Clips laufen zufällig bzw. je Kontext auf Billboards, gemischt mit Glitch-Loops, Kartentexten und Floskeln, wie ein Dauerfernsehen. Pixelig bzw. verzerrt ist gewollt und steht als Collage gegen das scharfkantige Design. 16:9 passt fast genau auf das Kartenformat 1,79:1.
- **Lesefolge** über `kfb-quote-sequence` (V-606), Auslieferung später über GitHub mit festem Commit wie der Ton.
- Bitte im Status sagen, wie das in Billboard und Lesefolge passt. Noch nichts bauen.

# NEU OBEN (24.10.) · An WS-Audio: sechs Orts- bzw. Orakel-Stimmenfamilien und zwei Eleven-Music-Betten (V-719)
- **Stimmenfamilien F14–F19:** Glasharmonika, Ton-Okarina, Obertongesang, tiefer Summchor, rückwärts gehauchter Vokal, Klangschale.
  - Je 14 Gefühlslagen im Melodica-Raster plus `call_humbug`. Die Rufe folgen der Skala V-712: Bingo entschieden, Boggle offen, Bongo gelassen, Blödsinn hartes Nein, Humbug ungläubig.
  - 84 Clips, -16 LUFS: `40_AUDIO/elevenlabs_r1/chatter_families_r3_orakel_lufs/`.
  - Gedacht für Genius loci, Orakel und mystische Orte (V-714, V-717). Bitte als Familien 14–19 ins Register-Raster aufnehmen.
- **Eleven-Music-Betten:** `music_probe_r1_lufs/M1_brainwave_flaeche` (Mindspace) und `M2_endlose_steigung` (Spannungsbett Dystopia), je 60 s, -18 LUFS.
- Beides liegt im privaten Branch. Georgs Ohr ist die Abnahme.

# NEU OBEN (24.10.) · An WS-Audio: Frequenz-Schichten und Spannungsbetten (V-718), Planung nach dem MVP
- **Recherche:** `replies/RESEARCH_BINAURAL_SHEPARD_SPATIAL_R1.md`.
- **Kern:** binaurale bzw. isochrone Schichten aus fertigen freien Dateien. Exakte Muster offline mit SBaGenX oder SynapSeq als WAV rendern; ihr spielt nur Dateien.
- **Neuer kopffester `mind`-Bus:** Die binaurale Schicht läuft nie durch den 3D-Panner. Dazu ein Schalter Kopfhörer an/aus mit isochronem Ersatz für Lautsprecher.
- **Weltobjekte** laufen über PannerNode mit HRTF.
- **Dystopie-Spannung:** Shepard-Loops (CC0) unter einem Suno-Drone. Die Intensität steuert Pegel, Tiefpass und Rate, der Höhepunkt ist ein harter Schnitt.
- **Frage:** Nutzt ihr Tone.js? Wenn nicht, bleibt es bei nativen Nodes.
- Bitte im Status sagen, wie das in euren Mixer passt. Noch nichts bauen.

# NEU OBEN (24.10.) · An WS1: Antworten §161–§163 (V-712 bis V-715) und Kassette r5 im privaten Branch
- **§163 Kassette:** Die Dateien liegen jetzt im privaten Branch `assets/private` (KFB-Stunt-Car-Race), unter denselben Pfaden:
  - `50_BLENDER/N34/_privat_kauf_asset/out/N34_r4_kassette.png` und `…/N34_r5_kassette.png` (r5 ist der neueste Stand: ohne Konturen, Tag Orange, Nacht Türkis);
  - `50_BLENDER/N33/data/kfb_hud_readability.r1.json`, jetzt **mit** `controlTheme` (byTimeOfDay, Themes orange/teal/violett mit hi, mid, lo, Symbol, Kontur, Glanz).
  - Euer Weg mit `ctl=auto|day|night` und A/B `cas=old` passt. Standard erst nach Georgs Urteil.
- **§162.1 Ruf-Skala (V-712):** wie von euch beschrieben ins Register übernommen und in `replies/TRIPLET_SSOT_R1.md` §2b eingetragen. Eine Dialog-Grammatik für NPC, Fahrzeug, Ort, Objekt; Owner nach dem MVP ist WS-NPC.
- **§162.2 Übernahmekarten (V-713):** euer Vorschlag gilt so.
  - Je laufender Sitzung `sessions/<kürzel>.md` auf `ws1/status` mit den sieben Punkten, dazu `sessions/site.md`.
  - Pflege nur bei Änderung, im selben Zug wie Commit bzw. Status; der Status bleibt das Logbuch.
  - WSB nutzt `50_BLENDER/STATUS.md` plus RETURN. WS0_STATE bekommt die Spalte „Übernahmekarte“.
  - Bitte für alle WS1-Sitzungen einführen.
- **§161 Fragen (V-714):**
  1. `locusId` und `vehicleId` kommen ins bestehende Figuren-Register `CHARACTERS_R1` als eigene Art (`kind`: character, locus, vehicle), mit eigenem Gedächtnis. Es gibt kein zweites Register; mit einer Rolle in der Geschichte stehen sie auch in den Dramatis Personae. WS0 nimmt das beim nächsten Register-Bau auf.
  2. Die Deck-Zuordnung von Deck-Songs gilt als Arbeitsvorschlag (PREFILL, kein Kanon).
  3. Die Gutter-Fahrt plant WS1b im Terrain-Konzept. Der Bau-Owner wird beim Bauauftrag nach dem MVP bestimmt.
- **§162.4 Übergabe MVP und Konzept an WS0 bis Do 29.10.:** einverstanden. Bitte mit Übernahmekarten, Schalter-Liste und Konzept R1.4.

# NEU OBEN (24.10.) · An WS1 (Lead): Einbettungs-Werkzeug bei WSB, bitte Höhenfeld-Export und Schnittstelle planen (V-711)
- WSB baut im Auto-Modus ein Werkzeug, das Dioramen, Labyrinthe und Kulissen nach dem Kanon (Gebiet 2 und 15, V-577) automatisch ins Terrain einbettet. Brief: `50_BLENDER/ANTWORT_WS0_2026-10-24_EINBETTUNG.md`. Testfälle: Labyrinth-Zelle (eckig und polar), Amphitheater, Friedhof B33.
- **Bitte 1:** ein Höhenfeld-Export eines typischen Terrain-Ausschnitts aus dem Spiel (z. B. Amphitheater-Umgebung, look=terrain3), als Datei im privaten Branch. Sagt im Status Format, Maßstab und Ursprung. WSB arbeitet bis dahin mit einem markierten Platzhalter.
- **Bitte 2:** Schlagt ein Format vor, in dem euer Terrain eine Höhen-Änderung plus Maske je Fußabdruck annimmt (Düne bzw. Schürze um ein Modell, V-400: Laufzeit bei euch, ein Höhen-Owner). Noch nichts einbauen, nur das Format im Status. WS0 gibt es an WSB weiter.
- Die Regel-Tabelle (Biom × Requisiten-Gruppe × Übergang) aus dem Werkzeug ist dieselbe Grundlage wie für das prozedurale Terrain-Konzept (V-705, V-708).

# NEU OBEN (24.10.) · An WS1 (Lead): zweite Quelle fürs Terrain-Konzept, Welt-Komposition mit echten Stadtvierteln (V-708)
- **Quelle:** Draft-PR #447, Branch `planning/kfb-procedural-world-composition-wfc-osm-2026-10-24`, Datei `skills/chat/masterplan/KFB_PROCEDURAL_TERRAIN_WFC_OSM_LANDMARK_NPC_COMPOSITION_R1_2026-10-24.md`. §1 enthält Georgs Ziele, §4 bis §10 die Vorschläge des Webchats.
- **Kern:**
  - Echte Stadtviertel erscheinen als vorbereitete, georeferenzierte Zonen in der prozeduralen Welt. Innen bleiben Straßen, Landmarken und Skyline stimmig.
  - Zuerst Köln Dom/Zentrum aus dem vorhandenen OSM City Lab (`tools/osm-city-lab/`, Landmark Overrides). Paris mit Eiffelturm erst danach; dafür gibt es noch keinen Datensatz.
  - WFC bzw. andere Constraint-Verfahren nur lokal: Auswahl, Übergänge, Ergänzungen. Nie eine Umordnung echter Gebäude, nie ein zweiter Höhen- oder Straßen-Owner.
  - Dazu Biome, Genii Loci, NPC-Szenen mit echten Props und Aktivitäten, Goo-Zustände und LOD.
- **Zusammen mit V-705** (Splats, Gutter, Portale) ist das **ein** Terrain-Konzept aus zwei Quellen, nicht zwei Baustellen.
- **Bitte:**
  1. Eine Matrix KEEP/ADAPT/REJECT je Owner gegen euren aktuellen Terrain-Code (Doc §2 und §10).
  2. Eine billige Kompositionsprobe ohne Laufzeit-Bau: Route und POIs von oben für eine „Kölner Tasche“ in der KFB-Landschaft, mit mindestens einer erreichbaren Arbeits- oder Begegnungs-Schleife eines Bewohners.
  3. Beides als Abschnitt im Status.
- **Leitplanken:**
  - Kein Engine-Wechsel. Godot höchstens später als Vergleich.
  - Ein Owner für Höhe und Kontakt, Track Core für Straßen.
  - Intent First (V-690). Gebaut wird erst nach dem MVP und nach Georgs Freigabe.
  - Die laufende Terrain-Form-Arbeit nicht unterbrechen.

# NEU OBEN (24.10.) · An WS1: Kassette als Player (V-707)
- Georg mag die Kassette als Player (WSB N34 r4): plastische Tasten, die beim Drücken einsinken, Glanz nur am Rand, Symbole cremeweiß mit dunkler Kontur.
- Die Tastenfarbe folgt der Tageszeit, am Tag Orange, nachts Türkis, und ist einstellbar wie die übrigen HUD-Farben. Werte: `50_BLENDER/N33/data/kfb_hud_readability.r1.json` → `controlTheme` (Themes mit hi, mid und lo, Symbol, Kontur, Glanz). Bogen: `N34/_privat_kauf_asset/out/N34_r4_kassette.png` (privat).
- Das ist eine Vorlage. Das HUD-Design kommt von Claude Design (V-694); baut es erst ein, wenn Georg das Design abgenommen hat.

# NEU OBEN (24.10.) · An WS1 (Lead): Splats, Gutter Space und Portale ins Konzept für das prozedurale Terrain einarbeiten (V-705)
- **Quelle (eine Stelle):** `skills/chat/masterplan/KFB_SPLAT_PROCEDURAL_WORLD_R1_2026-10-24.md` auf Branch `planning/kfb-flatworld-comic-gutter-r1-2026-10-18` (Entwurfs-PR #423). Teil A enthält Georgs Ziele, Teil C die Vorschläge des Webchats. Die drei älteren Dateien im selben Ordner sind dort verlinkt (Flatworld/Gutter 18.10., drei Cluster 22.10., Cluster 4 Wasser/Melt 22.10.).
- **Georgs Ziele kurz:**
  - A1: Blicke mit echter Tiefe in ganz andere Welten durch Portale, und Reisen über große Entfernungen.
  - A2: echte Karten bzw. PDF-Viewer im Raum, der fraktale Almanach als begehbarer und durchsuchbarer Infinite Canvas.
  - A3: Gutter Space, also die Lücke zwischen zwei Comic-Panels als Reise, z. B. eine Achterbahn auf dem Racetrack.
  - A4: im bunten, fließenden Terrain und im Wasser eine zweite Welt sehen, erst beim Vorbeifahren bzw. Drüberfahren.
  - A5: prozedurale Geografie mit erkennbaren echten Orten (OSM-Ausschnitte, Landmarken wie der Kölner Dom).
  - A6: Maßstab ist die sichtbare Qualität.
- **Bitte:** Diese Ziele in euer Konzept für das prozedurale Terrain aufnehmen. Ordnet jedem Ziel die Schicht bzw. den Owner im heutigen Spiel zu und nennt die kleinste Probe, die zeigt, ob der sichtbare Effekt trägt.
- **Leitplanken:**
  - Intent First (V-690): Splats sind ein möglicher Weg, kein Muss. Zahlen sind Testbereiche.
  - Kein zweites Renderer- oder Terrain-System neben dem bestehenden.
  - Bauen erst nach dem MVP (V-646). Eigene Splats aus freien Modellen vor fremden Community-Szenen.
  - Karten und Almanach bleiben bei ihren heutigen Ownern (Kartenviewer V-697, Almanach V-043).
- **Zurück:** ein Abschnitt im Status mit Pfad zum Konzept. WS0 prüft vor jedem Bauauftrag mit Gate und Prüfer.

# NEU OBEN (24.10.) · An WS-NPC, WS-Audio und den Deck-Songs-Chat: Stresstest vor Yuka, BBBW-Song, Doppelpunkt-Regel nachgeschärft (V-700, V-701)
- **WS-NPC:** Georg will Yuka (oder Ähnliches für Ausweichen bzw. Gruppenbewegung) erst nach einer Messung entscheiden. Bitte den Stresstest P-2 mit 8, 12 und 20 Bewohnern fahren, sobald es passt. Meldet fps, Ausweich-Fehler (Durchdringen, Stau, Zittern) und Gruppen-Fehler, jeweils mit einem Clip aus der Spielkamera. Erst danach entscheidet WS0 mit Georg.
- **WS-Audio:** Big Bad Brain Wrestling 01 (Deephouse mit Trap brasileiro, 165 BPM) ist geerntet, die ersten elektronischen Stems für die Chatterbox. Alles steht im Musik-Katalog (`40_AUDIO/music_catalog_r1.json`, `bbbw01`), die Dateien liegen im privaten Branch.
- **Deck-Songs-Chat:** Die Doppelpunkt-Regel (V-700) ist nachgeschärft.
  - FAIL ist nur das Etikett am Zeilenanfang („Broken Bridge: …“, „Escape Sequence:“) und das Semikolon.
  - Ein Doppelpunkt mitten im Satz nach einer Hinführung trägt dagegen. Georgs Golden: `replies/SUNO_SSOT_PROMPTS/BBBW01_DEEPHOUSE_TRAP_BRASILEIRO.md`, z. B. „Approval? Not for The Heel: bear hugs and eye pokes.“
  - Das Intro „<Decktitel>: <Slogan>“ bleibt erlaubt.
  - Beide Prüfskripte prüfen jetzt genau das.

# NEU OBEN (24.10.) · An WS1 (Writers Room / Deck-Songs-Chat und Lead): ganze Sätze statt Doppelpunkt (V-700), SSOT-Modul abstimmen
- **V-700 (Georg 24.10.):** Kartenzeilen sind ganze Sätze mit Fluss, der auch in Suno trägt: kurz, prägnant, Comic-Stil, Weglassungen erwünscht.
  - Kein Etikett wie „Escape Sequence:“ oder „Broken Bridge:“, keine Doppelpunkte, keine Semikolons, kein Telegramm.
  - Die Satzform folgt der Karte und wechselt über das Deck.
  - Mechanisch: `triplet_set_check.py` meldet jetzt FAIL bei Doppelpunkt oder Semikolon in Kartenzeilen und kennt „why“ und „how“ als Grammatik (eure Verbesserung). `song_gate.py` prüft dasselbe als C14.
  - Die Goldens mit Doppelpunkt in `TRIPLET_SET_SPEC_R2.md` sind als überholt markiert.
- **Euer SSOT-Modul Chatterbox/Triplet/Song:** Es gibt schon zwei Text-SSOTs, `replies/TRIPLET_SSOT_R1.md` (V-698, mit §2b Satzbild V-699) und `replies/SUNO_SSOT_R1.md` (V-689). Eine dritte Fassung derselben Regeln würde auseinanderlaufen (V-690).
  - Baut das Modul deshalb als Code und Daten, also gemeinsame Prüf- und Erzeugungs-Bausteine, die auf diese beiden Dateien verweisen und sie nicht abschreiben.
  - Fehlt dort etwas, meldet es; WS0 trägt es ein.
  - Vor „verbindlich“ läuft das Modul bei WS0 durch Gate und Prüfer. Bitte als eigenen Abschnitt im Status melden, mit Pfad und Commit.

# NEU OBEN (24.10.) · An WS-NPC und WS1: Satzbild in Sprechblasen (V-699)
- Kartentitel in Sprechblasen-Sätzen und angezeigten Triplets **immer fett**. Kursiv kontextuell für Betonung, Umkehrung oder Pointe.
- Rufe immer fett, genau so geschrieben: **Bingo!** · **Boggle...?** · **Bongo.** · **Blödsinn!** · **Humbug?!** Das ersetzt die Versalien aus §153.
- Gilt nur für Angezeigtes. Suno-Lyrics und Texte für Sprachausgabe bleiben ohne Markup. Bitte in den Tratsch-Protokollen und im Sprechblasen-Renderer (kfb-bubbles) so umsetzen; fehlt dem Renderer fett oder kursiv, im Status melden. Stelle: `replies/TRIPLET_SSOT_R1.md` §2b.

# NEU OBEN (24.10.) · An alle (WS1, WS-NPC, WS-Audio, Deck-Songs): Triplet-SSOT (V-698), Ton von GitHub erledigt
- **Triplet-SSOT:** `replies/TRIPLET_SSOT_R1.md` ist ab jetzt die eine Stelle für Triplets in Dialog, Karten-Tratsch und Songs. Dort steht, welche Datei wofür maßgeblich ist, und Georgs Tratsch-Entscheidungen vom 23.10. sind festgehalten. Bitte dort zuerst lesen und Georg nicht erneut danach fragen. Neue Entscheidungen meldet ihr im Status; WS0 trägt sie dort ein.
- **WS-NPC:** Bitte `KARTEN_TRATSCH_KONZEPT_R1.md` auf GitHub ablegen, neben `docs/ws-npc/WS_NPC_STATUS.md` im Spiegel `game/mvp-r1`. Heute liegt es nur in eurem lokalen Zweig, WS0 kann es nicht lesen. Danach verweist die SSOT auf den Pfad.
- **WS-Audio §17 ist durch:** Musik als AAC 128 (88,7 MB), der ganze Ton kommt zur Laufzeit von GitHub (kayfabizarro `assets/kfb-audio-r1` @36c5ae419), 0 MB Ton im Site-Paket, alle 38 Titel in Chrome und WebKit spielbar. Damit ist die Bitte von gestern (V-696) erfüllt.
- **WS1 (Lead):** Bitte `ws-audio/r1` @76eeb2b in `ws1/mvp-r1` mergen, die Testreihe laufen lassen und den Commit auf `game/mvp-r1` melden. Diesen Stand veröffentlicht WSA (Hub b188). Der Fehler `c3b` (`F.sync is not a function`, Fundstücke) liegt laut WS-Audio im mvp-Stand.

# NEU OBEN (24.10.) · An WS-NPC und WS1: zwei Referenzen von Georg für später (V-697, kein Bauauftrag jetzt)
Beide liegen im privaten Branch `assets/private` unter `75_REFS/`.
- **WS-NPC:** `75_REFS/npc_card_speculation_r1/` ist die NPC Card Speculation Scene (Claude Design, 25.09.): zwei Bewohner spekulieren mit Triplets und Sprechblasen über eine Karte. Siehe `docs/NPC-CARD-SPEC-01_RETURN.md` und `screenshots/`.
  - Georgs Ziel für später: NPCs spekulieren als Alltags-Aktivität über neu gefundene Karten in der Welt (Terrain, Billboards). Das wird eine weitere Quelle für den Karten-Tratsch.
  - Bitte beim Plan für Stufe 1 bzw. 2 mitdenken und im Status sagen, wo es hineinpasst.
- **WS1:** `75_REFS/deck_viewer_v4/` ist der KFB Deck Viewer v4 mit den Ansichten Reader, Galerie, Stapel, Coverflow, Full View und Deck.
  - Den Tuschrahmen (KFB Ink Outline) liefern `deckviewer/ink-frame.js` und `kfb-ink-canon.js`.
  - Der Korpus kommt live aus `main/media/kfb`.
  - Er ist die Vorlage für die Optionen des PDF-Kartenviewers im Spiel (Overlay nach V-043). Siehe `docs/HANDOVER_DECK-VIEWER-V4_WS0.md`, darin vor allem die Leitplanken §7.
  - Er profitiert direkt von der Kartendaten-Korrektur nach Druck (V-696).

# NEU OBEN (24.10.) · An WS1 und WS-Audio: Antworten §153/§154, Site mit Musik (V-695, V-696)
- **Site-Auftrag an WSA steht** (`replies/BRIEF_WSA_MVP_GPT_SITE_R1.md`, Hub b188), wie von euch in §154 vorgeschlagen. **Georg 24.10.: mit Musik.**
  - **WS-Audio:** Bitte den GitHub-Weg für die Musik jetzt umsetzen, kleiner kodiert (96–128 kbit/s), mit Range, erstem Ton, Cache und Fehlerverhalten. Die Songs dürfen ins öffentliche kayfabizarro (Georg 23.10.). Gekaufte Töne gehen nie dorthin. Lege eine kurze Hörprobe der neuen Kodierung in den Status, damit Georg sie hören kann.
  - **WS1:** Den Weg in `game/mvp-r1` einhängen, die Testreihe laufen lassen und den Commit melden. Erst diesen Stand veröffentlicht WSA.
- **Karten: Das PDF führt immer** (Georg, bekannt). `media/kfb/cards.json` bitte für **alle** Decks an den Druck anpassen, auch Schreibweise und Großbuchstaben, nicht nur Mission Control, Ego Mania und Brain Flipper #59. Grundlage ist die Druck-Transkription der Deck-Songs-Sitzung (`t1.print_cards.json`). Schreibweise nach V-271: `cardName` in normaler Groß- und Kleinschreibung, die Druckschreibweise (oft Versalien) in `cardNamePrint`. Maßgeblich ist `replies/TRIPLET_SSOT_R1.md` §1. Liefert das bitte auf demselben Zweig `ws1/karten-druck`, mit einer Liste je Deck (geändert, Karten hinzu bzw. weg). Übernommen in main wird erst nach Georgs Ja.

# NEU OBEN (23.10.) · An WS-Audio und WS1: Georgs Hub-Antworten q178/q179 (V-693)
- **q178 Sprachmelodie-Familien: „Vorschlag so“.** Skelette spielen Kazoo, dazu der Klapper-Transient aus Spec §3. Spielzeugsoldaten spielen gestopfte Trompete, die Orc-Band Tuba, Disco (K12) die Talkbox und gothgirl Oboe. Alle übrigen Fluffer-Sorten spielen hohe Okarina. Der Geist bleibt bei der Säge, die Aliens beim Theremin. Bitte so im Register bzw. in der Zuordnung eintragen.
- **Kazoo und Trompete** brauchen neue Clips. Die erzeuge ich erst nach Georgs Go im Chat. Bis dahin bleiben die Platzhalter, oder ihr nehmt Trumpet-Phrasen aus der Advanced-Split-Ernte (Orchester-Charaktere, 107 eigenständig). Oboe gibt es schon geerntet (81 eigenständige Phrasen), Tuba nur wenig (Orchester 2: 12).
- **q179 Begrüßung: Musik auf −7 dB absenken** (statt −4 dB).

# NEU OBEN (23.10.) · An WS1: Antworten §150 (V-690 bis V-692)
- **Intent First entdoppelt (V-690):** eine maßgebliche Stelle `replies/WEBCHAT_INTENT_FIRST_SOLUTION_OPEN_R1_2026-10-23.md`. Arbeitsregeln, Fresh-Chat-Protokoll §0D und die drei Staub-Dokumente verweisen nur noch mit einer Zeile darauf. Der Satz „Knete bleibt der gesetzte KFB-Look …“ steht drin.
- **Staubfahne (V-691):** WS1b läuft weiter wie freigegeben (`dust3=1`, ws1/staub-probe). Kein Umbriefen, kein Warten auf figamb. Die Wartebedingung aus b769bd78c ist gestrichen.
- **Urteile registriert (V-692):** Scheinwerfer-Kegel ist Standard. Knet-Flamme v2 und Figurenlicht Weg 1 sind abgelehnt. Bei figamb ist die Richtung bestätigt. V-385 Regel 11 ziehe ich nach, sobald Georg die Stärke abgenommen hat. Bitte im Status melden.

# NEU OBEN (23.10.) · An WS-Audio: Advanced Split Orchester-Charaktere und E-Funk
- **Orchester-Charaktere:** ein Stem je Instrument, 1039 Phrasen, davon 553 eigenständig. Eigenständige Phrasen je Stem: Flute 119, Trumpet 107, Clarinet 93, Violin 88, Oboe 81, Bassoon 25, Trombone 22, French Horn 12, Cello 4, Harp 2, Tuba 0. Damit ist die Zuordnung der Holzbläser von oben erledigt.
- **Doppelte:** In jedem Manifest trägt eine Phrase mit Übersprechen `dup_of` (Ziel ist die klarere Phrase); `unique` steht je Manifest und im Katalog. Werkzeug: `40_AUDIO/chatterbox_r1/dedupe_harvest.py`. Orchester 2 ist ebenfalls markiert: 557 eigenständig, die Saxophone bitte weiter ignorieren.
- **E-Funk:** Advanced Split ist unbrauchbar (Synth Voice 7, Synth Bass 0, Clarinet 13 Phrasen Übersprechen). Es gelten die Gruppen-Stems.
- Alles liegt in `40_AUDIO/music_catalog_r1.json`, die Audio-Dateien liegen im privaten Branch.

# NEU OBEN (23.10.) · An WS-Audio: Orchester 2 mit Advanced Split, Suno-SSOT
- **Orchester 2:** 104 BPM, Tonart geschätzt G Moll; 252 Phrasen aus den Gruppen-Stems, dazu 1197 aus dem neuen Advanced Split (ein Stem je Instrument: Violin 141, Viola 102, Trumpet 145, French Horn 132, Trombone 134, Cello 11, Tuba 12, Harp 14, vier Saxophon-Varianten je ~125).
- **Vorsicht:** Die Saxophon-Stems hat Georg nur probeweise angefordert, sie sind Übersprechen (56–58 % Überschneidung mit Trompete), bitte ignorieren; Horn und Posaune überschneiden sich zu 62 %. Geige und Bratsche wirken eigenständig. Vor Verwendung anhören und Doppelte entfernen. Details im Katalog.
- **Suno-SSOT:** `replies/SUNO_SSOT_R1.md` (V-689) für alle Suno-Fragen.

# NEU OBEN (23.10.) · An WS-Audio: Orchester-Ernte
- **Orchester-Charaktere (wie Peter und der Wolf):** 108 BPM, Tonart geschätzt B Dur (A#, Konfidenz 0,92), 261 Phrasen: Holzbläser 174 (47 % einstimmig, Flöte/Oboe/Klarinette/Fagott nacheinander in Zeitabschnitten), Blech 43, Keyboard bzw. Harfe 26, Streicher 12, Synth 6. Katalog `40_AUDIO/music_catalog_r1.json` ergänzt, Material im privaten Branch unter `40_AUDIO/chatterbox_r1/suno_tests/orchester/`.
- Die Instrument-Zuordnung je Phrase steht noch aus (Abschnitte nach Zeit im Manifest); bitte beim Anhören bzw. über die Tonlage (Flöte hoch, Fagott tief) zuordnen und im nächsten Status melden.

# NEU OBEN (23.10.) · An WS-Audio: erste Suno-Ernte und Musik-Katalog (V-688)
- **Katalog:** `40_AUDIO/music_catalog_r1.json` (kfb.music-catalog/1) mit BPM, Einsatz-Versatz, geschätzter Tonart und den Ernte-Manifesten je Stem.
- **Surf und Rockabilly:** 150 BPM, Tonart geschätzt C Dur (Konfidenz 0,6; Prompt war Moll-Pentatonik, also eher A Moll), 60 Phrasen: Twang-Gitarre 38, Synth 10, Orgel 6, Blech 4, Vocal 2. Slap-Bass ergab keine einstimmigen Phrasen.
- **E-Funk mit Talkbox:** 142 BPM, Tonart geschätzt G Moll (0,75), 119 Phrasen: Gitarre 69, Moog-Synth 22, Talkbox 15, Holzbläser 7, Blech 4, Bass 2. Clavinet ergab keine.
- Je Phrase im Manifest: Start, Länge, Grundton, Kontur, Klarheit, LUFS (ab 0,4 s), Einsatz in Schlägen. Alles im privaten Branch unter `40_AUDIO/chatterbox_r1/suno_tests/<song>/harvest/`.
- Zuordnung zu Figuren erst über das Register (chatter.motif/grains) nach Georgs Familien-Wahl (Hub q178). Der Marsch-Test fehlt noch.

# NEU OBEN (23.10.) · An WS-Audio: Familie 13 Melodica geliefert
- 13 Clips (9 Gefühle + 4 Rufe, 0,8 s, −16 LUFS), Satz `chatter_families_r2_melodica_lufs` mit lufs_report.json im privaten Repo georg-doc/KFB-Stunt-Car-Race, Branch assets/private, Pfad `40_AUDIO/elevenlabs_r1/`. Namen wie Satz r1: `F13_melodica_<gefühl|call_*>`. Bitte in `CHATTER_FAMILIES` für die Bots (Register SPEC) eintragen.

# NEU OBEN (23.10.) · An WS-Audio: Antworten auf WS_AUDIO_STATUS §13 (V-688)
1. **Instrumente:** Säge, Theremin und Melodica stehen seit V-686 als SPEC im Register (Snapshot neu ziehen). Für Skelette, Spielzeugsoldaten, Orc-Band, Disco (K12), gothgirl und die übrigen Fluffer-Sorten entscheidet Georg die Familie (Hub-Frage q178); bis dahin Rückfall wie gehabt, kein selbst vergebenes Instrument.
2. **Neue Familien-Clips** (Melodica und die Familien aus q178): gleiches Raster wie chatter_families_r1, erst nach Georgs Go im Chat (Hub q177).
3. **Motiv und Grains je Figur:** Das Register bekommt die Felder `chatter.motif` (ID des geernteten Motivs) und `chatter.grains` (Liste der Grain-IDs je Typ: vowel, click, emotion, signature). Gefüllt wird erst mit geerntetem Material.
4. **Suno-Ernte:** Deine Hinweise gelten so: Solo-Prompts vor Stems, Ernte je Instrument-Familie, je Stück Tonart bzw. Grundton, BPM, Einsatz und LUFS. `harvest_phrases.py` schreibt diese Werte mit; daraus entsteht der Musik-Katalog `40_AUDIO/music_catalog_r1.json` (auch für die Jukebox-Instrumentals, Bitte aus Eintrag 11). Ablage im privaten Branch mit _lufs-Bericht.
5. **Begrüßung leiser unter Musik (−4 oder −7 dB):** Georg entscheidet (Hub q179).

# NEU OBEN (23.10.) · An WS1-Lead: Abnahmen direkt bei dir präsentieren
- Georg kann die Abnahme-Seite nicht aus dem Hub öffnen. Bitte präsentiere ihm die sechs Abnahmen aus §149 (Flamme v2 bzw. v2b mit Glutkern-Farbe, Scheinwerfer-Kegel, look-r2 1–7, Kit-Knete 0/1/2, Schattenseite, Startseite) und die Gold-Licht-Frage (Mesa behalten oder ruhigere Variante als A/B) direkt in deiner Sitzung, so dass er dort entscheiden kann.
- Georgs Urteile bitte im nächsten Status (§150) festhalten; WS0 trägt sie ins Register ein. Danach mergen und Kritiker R4 (V-687).

# NEU OBEN (23.10.) · An WS1-Lead, WS1b, WS1d: Antworten auf §149 (V-687)
1. **Kritiker R4:** erst nach Georgs Urteilen über die sechs Abnahmen (Teil A), mit den dann gewählten Standards und den sRGB-korrigierten eigenen Kamerabildern.
2. **Flamme:** Ein Glutkern als Knet-Farbe (warme Tonstufe im Kern, aus dem einen Licht) ohne Emission ist kanonkonform (CANON_3D Gebiet 11). Echte Emission wäre eine Ausnahme vom Kanon und kommt nur von Georg. Wenn Georg das Glühen vermisst, bitte zuerst die Glutkern-Farbe als v2b auf die Abnahme-Seite.
3. **farmer_harke:** ist jetzt Alias von farmer_b (Register neu erzeugt, 132 Figuren). Bitte Snapshot neu ziehen.

# NEU OBEN (23.10.) · An WS1-Lead, WS1b, WS-Audio: Antworten auf §147/§148 (V-686)
1. **Instrumente:** Säge (q_ghost u. a.), Theremin (q_alien, q_alien_tall u. a.) und Melodica (Bots, robot_one/robot_two) stehen im Register jetzt mit Status SPEC statt PREFILL (V-685). Bitte Snapshot neu ziehen (CHARACTERS_R1 im Register-Branch).
2. **Neue Familien-Clips** (z. B. Melodica): nur nach Georgs Go; bis dahin Rückfall wie gehabt.
3. **Motive und Grains je Figur:** folgen, wenn Georg die 12 Familien gehört und zugeordnet hat.
4. **demon_lord:** noch kein Instrument in der Spec, Platzhalter bleibt.
5. **kfb-gem (6):** behoben, der Material-Schlüssel enthält jetzt veinGlow. Datei `replies/GEM_R1/kfb-gem.v1.js` im Register-Branch; bitte übernehmen und den Umweg in gemLanterns entfernen.
- Kit-Knete 0/1/2 und Schattenseite A/B: Georgs Urteil auf der Abnahme-Seite steht aus.

# NEU OBEN (22.10.) · An WS1-Lead, WS-NPC, WS-Audio: Antworten auf §146 (V-685)
1. **Bäuerin:** Feste ID ist `farmer_b` (Bewohnerin mit Stimme und Chatter). `farmer_harke` wird Alias von `farmer_b`; WS0 trägt das bei der nächsten Register-Erzeugung ein. Bis dahin bitte im Spiel `farmer_b` verwenden.
2. **Chatter-Lücke:** Die PREFILL-Familien für Bots (Melodica), Aliens (Theremin) und Geister (Singende Säge) stammen direkt aus `replies/CHATTERBOX_SPEC_R2.md` und sind freigegeben. Für alle anderen bleibt der sichtbare Rückfall nach kind mit status 'fallback', bis Georg den Bandbreiten-Test der 12 Familien gehört und zugeordnet hat.
3. **Fluffer:** Dark Fluffer sind ein Zustand der q_-Figuren (infiziert, eye-goo rot), keine eigenen Figuren (V-664, V-666). Eigene dark_fluffer_*-Einträge gibt es nicht.
4. **Augen der Cubes:** Ja. Die q_-Figuren tragen die KFB-Augen mit dem Schalter eye-goo v1.1 (infiziert/geheilt), Karten `50_BLENDER/K15/data/kfb/q_<name>.figure.json` (V-664, V-666).
5. **Mumien:** `suno stem` ist die Song-Stimme aus Pharaoh Piledriver, keine Gruß-Stimme. Eine eigene Gruß-Stimme fehlt noch; bis dahin Rückfall wie bei Punkt 2 und im Status als Lücke melden.
- HUD-Ist-Bilder (16) sind angekommen, Georg sieht sie auf der Abnahme-Seite. Kit-Knete-Fix als A/B: gut so.


# NEU OBEN (22.10.) · An WS1-Lead, WS-NPC, WS-Audio: Charakter-Register anschließen (V-682)
- Briefing: 30_DECISIONS/replies/BRIEF_WS1_CHARACTER_REGISTRY_R1.md (Brief-Gate geprüft). Register auf GitHub im Register-Branch unter `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/CHARACTERS_R1/`.

# NEU OBEN (22.10.) · An WS1-Lead + WS1e: BITTE SOFORT · Ist-Stand HUD als Einzelbilder
Georg braucht den aktuellen HUD-Stand aus dem MVP für ein externes Design (WS0 hatte fälschlich alte HUD-R3-Referenzen geschickt). Bitte aus ws1/mvp-r1 auf die Abnahme-Seite „KFB Abnahme“ (Einzelbilder 3200×1800 + index.json), Spielkamera, O-Town Tag:
1. **nur `hud=wood`** (der integrierte 2D-Holz-Look), **keine 3D- bzw. Knet-Props**, je zu Fuß und im Racer (Tacho sichtbar);
2. fraktaler Almanach: Kartenfächer zu und offen, plus das geöffnete Overlay mit Deck- und Welt-Tab;
3. Rucksack bzw. Truhe offen, Aktionsleiste, Sprechblase/Interaktion, Fluff-Anzeige;
4. dasselbe einmal in Handy-Breite quer.
Nichts umbauen, nur aufnehmen.

# NEU OBEN (22.10.) · An WS1-Lead, WS1b, WS1d: Antworten auf §145 (V-683)
1. **Schattenseite aller Nicht-Gelände-Objekte (Figuren, Props, Bäume, Racer, Fundsachen):** eine Regel im einen Rig, als Materialantwort, kein Füll- oder Rim-Licht (V-385/V-386, Gegenlicht aus V-392). Die Schattenseite bekommt wie das Gelände den Palettenton (V-564, Schatten-Quartett Ü18) mit derselben Untergrenze; die WS1b-Werte der Fundsachen (0,34 Tag bis 0,50 Nacht) werden zur gemeinsamen Untergrenze und wandern ins LIGHT_MODEL. Bitte A/B auf der Abnahme-Seite (heute vs. Regel), FB im Donner-Jet-Bild als Prüfbild; Georg entscheidet. Das warme Figurenlicht je Dialoggruppe bleibt wie gehabt.
2. **Abnahme-Seite „KFB Abnahme“:** verstanden; Einzelbilder plus index.json. WSB und WS0 liefern weiter in den privaten Branch (Pfade im RETURN); bitte von dort in `research/audits/abnahme/<punkt>/` übernehmen, da die anderen Sitzungen keinen Zugriff auf deinen Rechner haben.
3. **Racer:** Standard ohne Mattierung, Scheinwerfer als zwei getrennte Kegel mit rundem Ende: registriert. Graue Säulen der Startseite: bitte durch den gemalten Vorhang aus der Bühne ersetzen oder vorerst weglassen.
4. **HUD:** Georg lässt das HUD-Design extern neu ausarbeiten (Basis HUD_LAYOUT_R3). WS1e bereitet nur Zustände und Animations-Haken vor, ohne sichtbare Festlegung (wie §144).
5. **Figuren:** Ein Charakter-Register entsteht (V-682, 30_DECISIONS/CHARACTERS_R1). Danach lesen Spiel, WS-NPC und WS-Audio nur noch daraus; Anleitung folgt.

# NEU OBEN (22.10.) · An WS1e: HUD_LAYOUT_R3 ersetzt R2 (V-681)
- Bitte 30_DECISIONS/replies/HUD_LAYOUT_R3.md statt R2: Kompass mit Minimap oben rechts, Almanach-Fächer direkt darunter gerade nach unten (echte Karten), Ziel-Plakette oben links, sechs Fluff-Pips plus Truhe unten links, Aktionsleiste unten Mitte, Interaktion als runde V-501-Blase, Radio unten rechts. Tacho-Ring auf dem geschlossenen Deckel wie J17. Ziel-Pfeil noch offen (Welt oder über dem Kompass).

# NEU OBEN (22.10.) · An WS1e: HUD-Layout R2 (V-680)
- Spec 30_DECISIONS/replies/HUD_LAYOUT_R2.md: Kompass mit Deckel zu als Tacho (Halbkreis grün bis rot, Booster-Rot, Tempo-Zahl) im Fahrzeug bzw. Flug, Klick öffnet die Minimap; Ziel-Pfeil über dem Kompass mit kurzer Entfernung und Nähe-Farbe (V-333 bis V-335); Radio wird die Kassette (Play/Pause, Nächster Titel, Ton an/aus).
- Die Logik (Tacho-Halbkreis, Minimap auf Klick, Pfeil, Entfernung, Radio-Tasten) gern schon vorbereiten; Größen und Anordnung kommen aus WSB N34.

# NEU OBEN (22.10.) · An WS1e: N33 Werte für `hud=ux1` (Vorschlag, Georgs Feinwahl offen)
- Werte: 50_BLENDER/N33/data/kfb_hud_readability.r1.json (Zustände, Zeiten, Farben, Layout), verknüpft in N32/data/kfb_hud_actionbar.r2.json unter hudView.readability (Status Vorschlag). Vorlage für Darstellung: N33/scripts/n33_hud.js (look/drawProp). Privater Branch assets/private.
- Bitte Kontur (gleichmäßig 2 px und Licht-Kontur 2→4 px), Hinweis-Farbe (A Türkis, B Pink) und Textur (Original, Knete matt) als Schalter anlegen, damit Georg im Spiel wählen kann. Interaktions-Platz bis zu Georgs Wahl mit Platzhalter.

# NEU OBEN (22.10.) · An WS1-Lead, WS1b, WS1d, WS1e: Antworten auf §143/§144 (V-675, V-676)
1. **KORREKTUR zu V-667 Punkt 2:** Keine Blob-Schatten, auch nicht für ferne Bäume (V-564, CANON_3D Gebiet 7). Wenn die Übersicht zu teuer wird, ferne Werfer über eine zweite, gröbere Schatten-Stufe im selben Rig (Kaskade) oder Schatten ab Distanz weich ausblenden; nie Kontaktfleck oder Scheibe.
2. **Racer (Georg, V-675):** Originalanmutung bleibt, Originaltexturen inklusive Graffiti und Meshy-UV, bewusster Stilbruch. Eigene Zusätze (Flamme, Rotor, Effekte) in Knete bzw. matter. Keine Knet-Karosserie. Präzisiert V-654 C5 für Fahrzeuge. **Kritiker:** Racer-Textur ist kein Mangel mehr; bewertet wird nur die Schlüssigkeit über Ansichten und Zoom. Knet-Flamme bitte als echtes 3D-Volumen (kein flaches Profil mit Kontur).
3. **Terrain-Form und Wolken:** sind beantwortet (V-661, Antwort auf §139 weiter unten): geschlossene Blobs mit smooth-min statt Zungen bzw. Domain-Warping, gemalte Kuppelwolken statt Rauschflecken. Bitte so umsetzen, mit A/B-Schalter; Georg urteilt im Spiel.
4. **Baum-Formfamilie (V-676):** eine Familie in der Welt: gerundete Knet-Kronen aus wenigen weichen Volumen (gleiches smooth-min-Prinzip wie die Blobs), Stämme leicht gebogen, Kronen-Unterseite mit Kontaktton. Würfelkronen fallen aus dem Welt-Mix. A/B-Schalter für Georg.
5. **HUD:** Die Spezifikation liegt vor (HUD_UX_STATES_R1.md R1.1, V-673/V-674, siehe Einträge oben). WS1e baut hinter `hud=ux1`.
6. **Bugs aus Runde 3** (schwebender Stein, harte Disco-Scheiben = V-572 Lichtpfützen-Modul, violettes Gold-Licht, Startseiten-Säulen bzw. Horizontlinie, Schuss ohne Mündung und Gegner fällt nicht): wie vorgeschlagen bei den Slices. Danach Runde 4.
- **FB:** R2 und R3 sind FAIL (Georg). Weiter kein FB außer FB_CANON; der nächste Kandidat kommt von WSA.

# NEU OBEN (22.10.) · An WS1e: Nachtrag HUD-UX R1.1 (V-674)
- Spec ergänzt (HUD_UX_STATES_R1.md, R1.1): **eigener Interaktions-Platz** rechts neben der Aktionsleiste (Auto, NPCs, Props aufnehmen; Fluff automatisch), Hinweis-Zustand in Reichweite. Das Prop wählt Georg aus N33; bis dahin die vorhandene Sprechblase als Platzhalter.
- **Fluff-Zahl** als 3D-Ziffern ohne Hintergrund.
- **Kontur:** gleichmäßig, unten rechts stärker (Licht oben links), über einen Bildraum-Versatz der Hülle. Gilt für alle HUD-Props unter `hud=ux1`.

# NEU OBEN (22.10.) · An WS1e: HUD-Zustände für alle HUD-Props (V-673)
- Spec: 30_DECISIONS/replies/HUD_UX_STATES_R1.md. Kontur ist Normalzustand, Lichthof trägt den Zustand (Hover, Klick, Aktiv, Hinweis, Bereit, Neu), Cartoon-Deformation die Bewegung, Abklingzeit grau mit Farbe von unten nach oben.
- Bitte bauen hinter `hud=ux1`: eine Zustands-Logik für alle HUD-Props (Aktionsleiste N32 r2 ohne runde Buttons, N29-Props, Fluff-Zahl), Inverted-Hull-Kontur, Lichthof-Sprite, ein Deformations-Modul, Kontext-Hinweis „im Kampf“ für Primär- und Sekundärwaffe, Abklingzeit als Test mit festem Wert.
- Werte aus der Spec als Start; WSB liefert parallel einen Zusammenschau-Bogen (N33) für Georgs Feinwahl. Abnahme im Spiel über das Abnahme-Menü.

# NEU OBEN (22.10.) · An WS1-Lead, WS1b, WS1d: Antworten auf §142 (V-672)
- **Registriert (Georg an den Lead):** Knet-HUD, Kit-Knete und Racer-Knete sind Standard (`hud=wood`, `kitclay=0`, `vclay=0` als Rückschalter). Ödland-Käfer mit mehr Originalfarbe, Knet-Rotor, Leuchtring bleibt.
- **Fundsachen (V-672, hebt V-587 auf, bestätigt V-450):** schweben, mit ruhiger, angenehmer Dreh- und Wippbewegung, mit den Nachbarn harmonisch synchron (gemeinsame Phase je Gruppe, leichte Versätze statt Gleichtakt), sauber ausgeleuchtet im einen Licht-Rig. `found=rest` bleibt als Schalter; kein Erdkeil unter schwebenden Stücken.
- Startseiten-Test im Lead-Worktree: wie geplant über WS1d mit `src/private` nachstellen.

# NEU OBEN (22.10.) · An WS1e: Aktionsleiste – KEINE runden Buttons (Nachtrag zu V-671)
- Georg will die Props ohne Button-Rahmen, frei als 3D-Modelle im HUD, lesbar durch Kontur bzw. Lichthof auf jedem Untergrund. Modelle, Clips und Anker aus r2 bleiben gültig, nur die Darstellung ändert sich.
- Bitte jetzt keine runden Buttons bauen. Die Lesbarkeits-Variante (Kontur, Lichthof oder beides) wählt Georg anhand der WSB-Probe; danach kommt sie als hudView.readability in die Karte r2.

# NEU OBEN (22.10.) · An WS1e: Aktionsleiste r2 – HALT aufgehoben, bitte einbauen (V-671)
- **Ersetzt N32 r1 komplett.** Karte 50_BLENDER/N32/data/kfb_hud_actionbar.r2.json (kfb.hud-props/2: Datei, sha256, Zustände, Clips, Anker, hudView.yaw_deg). GLBs in N32/_privat_kauf_asset/r2/out/, privater Branch assets/private.
- Faust (Monstrosity-Hand, Knöchelplatten = Schlagring V-423), Blaster (K10), Wurf = Clown-Bombe, Granate als zweiter Wurf (Option).
- **Originalmaterial, kein Einfärben** (V-670). HUD-Ansicht für alle gleich: orthografisch, 35° gedreht, 22° von oben, Umriss füllt den Button; Inselfarben höchstens am Button-Rahmen.
- Benutzen-Clips (fist_use_punch/squash, blaster_use_recoil, bomb_use_wobble, grenade_use_wobble), Anker KFB_Impact, KFB_Muzzle, KFB_Fuse, KFB_Pin. Abnahme im Spiel.

# NEU OBEN (22.10.) · An WS1e: HALT Aktionsleisten-Props (V-670)
- **N32 r1 nicht einbauen** (Schlagring, Blaster, Bombe eingefärbt), bis Georg die neue Probe-Leiste von WSB entschieden hat.
- Georg neu: alle Props in derselben Schrägansicht, **Originalfarben der Modelle** (kein Einfärben nach V-653 für Props, Paletten höchstens für den Button-Rahmen). Faust, Schlagring und Bombe kommen neu.
- Der Rest des Knet-HUD (N29-Props, Fluff-Zahl, Tacho) läuft weiter.

# NEU OBEN (22.10.) · An WS1e: Schlagring für den Faust-Platz (V-668)
- Georg hat das Modell gewählt: BlenderKit Brass Knuckle as-is, nur eingefärbt (Platte base, Wände detail, Griffbügel accent), Clip knuckle_use_punch, Anker KFB_Impact. Proof O-Town und Bucht PASS.
- Datei 50_BLENDER/N32/_privat_kauf_asset/out/KFB_HUD_BrassKnuckles.glb, Karte N32/data/kfb_hud_actionbar.r1.json (4 Props, Faust zurückgezogen), privater Branch assets/private (f047e939). Aktionsleiste damit: Schlagring, Blaster, Bombe. Abnahme im Spiel.

# NEU OBEN (22.10.) · An WS1e: KORREKTUR N32 · Faust zurückgezogen (V-668)
- **KFB_HUD_Fist.glb nicht einbauen.** Georg hat die Eigenbau-Faust verworfen. Blaster und Bombe aus N32 bleiben.
- Die Buttons der Aktionsleiste zeigen die eingesammelten Props als Original-Modelle, nur eingefärbt (Knet-Material, Inselfarben). Kein Eigenbau im HUD.
- Der Faust-Platz wird der Schlagring (V-423) als Original-Modell; Georg wählt ihn aus, er kommt über WSB nach. Bis dahin den Platz leer lassen oder das Kit-Icon nehmen.

# NEU OBEN (22.10.) · An WS1-Lead, WS1b, WS-NPC: Antworten auf §141 (V-667)
1. **Fundsachen liegen statt schweben (WS1b):** V-450 ist Georgs Abnahme (15 cm schweben, Längliches schräg 35°) und gilt weiter, bis er anders entscheidet. Standard bleibt `found=float`; das Liegen mit Erdung als `found=ground` ins Abnahme-Menü (V-641), Georg entscheidet im Spiel. Erdkeile, Steinchen, eingesunkene Kristall-Brocken und Weg-Rand sind davon unabhängig gut.
2. **Schatten am Rand des Schattenkastens (WS1b):** im einen Licht-Rig lösen, kein zweites Licht. Schattenkasten folgt dem Kamera-Fokus und wird je Kamera-Preset bemessen (Spielkamera eng, Übersicht weiter), am Rand weich ausblenden statt hart schneiden. Wenn die Übersicht dann zu teuer wird: dort Schatten nur für nahe Werfer, ferne Bäume mit dem vorhandenen Blob-Schatten. Kein Schattenrechteck ohne Werfer.
3. **B13 GitHub-Limit (WS-NPC):** richtig so. Im Spielerpfad nie die GitHub-API, nur Rohdateien bzw. die gebauten Pfade; die API höchstens in Werkzeugen mit Cache. s5a danach erneut.
- Hinweis Kanal (V-639): §141 stand auf ws1/terrain-439. Bitte WS1_STATUS.md auf ws1/status schreiben; die Suche findet es trotzdem.

# NEU OBEN (22.10.) · An WS1e: Aktionsleisten-Props N32 und Augen-Schalter
- **N32 fertig** (V-661): Faust, Blaster, Bombe als Knet-Props wie N29 (ein Material, Zonen in COLOR_0, Farben je Insel), je Benutzen-Clip und VFX-Anker (KFB_Impact, KFB_Muzzle, KFB_Fuse). Karte 50_BLENDER/N32/data/kfb_hud_actionbar.r1.json, Dateien im privaten Branch assets/private (1e76b13c). In die Aktionsleiste neben die N29-Props, Abnahme im Spiel.
- **K15 r3 angenommen** (V-666): Cubes mit KFB-Augen, Laufzeit-Schalter `attachEyeGoo(THREE, rig).set('red'|'normal')` aus 50_BLENDER/K15/stage/vendor/eye-goo.v1.1.js. Gilt für alle EyeRig-v6-Gesichter (Dark Fluffer = red, geheilt = normal). Karten K15/data/kfb/q_<name>.figure.json ersetzen die r2-Paare. FB bleibt gesperrt.

# NEU OBEN (22.10.) · An WS1-Lead, WS1d, WS-NPC: Antworten auf §140 (V-662)
1. **Kit-Knete schwach sichtbar (WS-NPC):** Ja, ein stärkeres Profil, aber im selben Modul.
   - `kfb-clay` bekommt ein Profil `kit-figure` mit mehr Relief bzw. Normal-Anteil, abgestimmt auf die Bildschirmgröße aus der Spielkamera.
   - A/B-Bild aus der Spielkamera an WS0.
2. **Ödland-Käfer verliert Gelb und Blau (WS1d):**
   - Beim Umtönen behält jedes Fahrzeug 1–2 Identitätsfarben als Akzentrolle; nur Grund- und Nebenfarben gehen auf die Biom-Rollen.
   - Die Lüfterringe bitte als Akzent bzw. Detail behandeln.
3. **Aktionsleiste:** Die Knet-Props für Faust, Blaster und Bombe kommen von WSB als N32.
- **Die drei Knet-Stufen** (`hud=clay`, `vclay`, `kitclay`) nimmt Georg im Spiel über das Abnahme-Menü ab. Danach Erdung und Kritiker R3.


# NEU OBEN (22.10.) · An WS-NPC + WS1: K15 r2 und FB-Sperre
- **K15 r2** liegt im privaten Branch (`50_BLENDER/K15`): Die geheilten Augen sind jetzt nach dem K11-Golden gebaut (Weißanteil 53–61 %), die dunklen Fassungen sind heller. Die Karten sind neu, bitte die r2-Dateien nehmen. Georgs Abnahme steht aus (Hub q158).
- **FB-Sperre:** Die zentrale Proof-Stage (`PROOF_STAGE_R1/render.mjs`) und die WSB-Werkzeuge weisen jeden FrizzleBob ohne FB_CANON-Hash ab (`50_BLENDER/FB/data/FB_CANON.json`, noch null).
  - Gesperrt sind damit auch die FB-Teile aus N26 (J-1, J-2, J-3) und J-7, bis FB_CANON da ist.
  - Wichtig: Die abgenommene Karte `FIGURES_R1/frizzlebob.figure.json` zeigt noch auf das alte v5b-body.glb. Sie wird auf FB_CANON umgestellt, sobald er da ist.


# NEU OBEN (22.10.) · An WS1-Lead: Antworten auf §139 (V-661)
1. **Farbflächen:** geschlossene, gerundete Blobs mit smooth-min. Keine Zungen bzw. Hälse, nie fbm-Schwellwert. Das ist Georgs eigene Regel (V-570). Der 70er-Fließfarben-Charakter bleibt innerhalb der Blobs (weiche Ränder, Farbfamilie). Bitte mit A/B-Schalter, Georg urteilt im Spiel.
2. **Wolken:** die gemalten Kuppelwolken der Probe. Kein Schwellwert-Rauschen, gleiches Prinzip.
3. **Aktionsleiste:** WSB baut Knet-Props für Faust, Blaster und Bombe als N32, wie N29 mit Farbzonen.
4. **Kristall-Laternen:** das abgenommene `kfb-gem`-Material (V-476: Leuchten von innen) statt Glitzer-Shader, Fassung bzw. Sockel in Knete.
- **Die V-654-Pakete** (Racer in Knete, Kit-Figuren in Knete, Erdung, HUD) laufen wie verteilt. **Kritiker R3** erst nach deren Einbau.
- **FB:** Bitte nur noch `FB_CANON` (V-658), sobald er da ist.
- **Sammelliste** `ws1/kfb-planet/docs/OFFENE_PUNKTE_R1.md`: WS0 gleicht sie ab.


# NEU OBEN (22.10.) · An WS1-Lead + WS1d: FrizzleBob-Kanon global (V-658, Georg)
- **Georg sah zum wiederholten Mal einen falschen FB:** Augenring über den Original-Augen, zu groß gegenüber den Dieselpunk-Racern.
- **Ab jetzt gibt es genau eine Datei `FB_CANON`** (P08-Export mit Georgs Werten, Hash, 1,81 m). Sie kommt über WSA bzw. WS0 in den privaten Branch.
- **Bitte im Besetzungs-Loader prüfen:** Ein FB mit anderem Hash ist ein Fehler, kein stiller Fallback.
- **WS1d:** FB in Spielgröße neben die Racer stellen, Maßstab prüfen, Vergleichsbild an WS0.


# NEU OBEN (22.10.) · An WS1-Lead: diegetisches Knet-HUD jetzt einbauen (V-656, Georg)
- **Georg:** wichtig für Gesamtdesign, Immersion und Steuerung, deshalb vorgezogen und nicht erst nach dem MVP.
- **Props aus `50_BLENDER/N29/`** (privater Branch, Karte `data/kfb_hud_props.r1.json`):
  - Kompass: zu = Tacho mit Halbkreis und Zahl, auf = Minimap;
  - Radio mit Tasten und Laufschrift (Playlist, Ton an/aus);
  - Truhe mit Einflug für Pickups und Fluff;
  - Zahnrad = Settings, dort auch der Schalter „Entwickler-Infos“ (V-655);
  - Fluff-Score in 3D-Bangers;
  - Kartenfächer mit Schatten.
- **Farben** aus der Insel-Palette über die `COLOR_0`-Maske (V-653).
- **Leistung:** ruhende Props als gecachte Ansichten, echtes 3D nur beim Aufklappen, < 1 ms. Props reagieren gefiltert auf Kurve, Bremsen und Landung.
- **Das Holzbrett-HUD bleibt als Rückfall**, bis Georg im Spiel abnimmt (Abnahme-Menü).


# NEU OBEN (22.10.) · An WS1-Lead: C1 Entwicklertexte entschieden (V-655, Georg)
- Raus aus dem Spielbild. Sichtbar nur über die Settings (Zahnrad, Schalter „Entwickler-Infos“) bzw. per Debug-Schalter. Kein neues Interface-Element.


# NEU OBEN (22.10.) · An WS1-Lead: Antwort auf den MVP-Kritiker R1 (REWORK, Stopp-Regel K4), V-654
**Die drei Konzeptfragen stehen schon im Kanon** (`30_DECISIONS/CANON_3D/CANON_3D_R1.md`). Anwenden, nicht neu erfinden:
- **C3 Boden und Wertstruktur = 70/20/10 (Gebiet 2, V-566):**
  - Das Terrain ist die Ruhefläche (70 %), darf Textur haben, aber keine Konkurrenz um Aufmerksamkeit.
  - Fließfarben bzw. „Marmortapete“ in Kontrast und Sättigung dämpfen, Moiré in der Ferne glätten.
  - Der stärkste Kontrast liegt bei Held, Bühne und Ziel (10 %).
- **C5 eine Machart = ein Knet-Modul überall (Gebiet 8, Gebiet 15):**
  - `kfb-clay` auch auf Kit-Figuren und Racern.
  - Kit- und Foto-Rost-Farben auf die Rollen der Biom-Palette umtönen.
  - Keine zweite Materialwelt.
- **C6 Erdung = `replies/SPEC_PLACEMENT_GRAMMAR_R2.md` und Gebiet 15:**
  - Keine Platten, keine schwebenden Teller.
  - Sockel sinken ein, das Gelände steigt an (Schürze, Erdkeil). Einsinken je Objektart.
- **Schnelle Korrekturen sofort:** C2 Startplatte weg, C4 Nachtlesbarkeit, C7 Trefferwirkung, C8 Disco-Flecken (projiziert über `kfb-groundfx`), C11 HUD und Anschnitte, C12 Bildsatz.
- **C1 Entwicklertexte:** WS0 fragt Georg.
- **Danach Kritiker R2** mit demselben Bildsatz.
- **Sammelliste `OFFENE_PUNKTE_R1.md`:** WS0 gleicht sie ab, sobald sie auf `ws1/status` bzw. im MVP-Spiegel liegt. Bitte Pfad nennen.


# NEU OBEN (22.10.) · An WS-Audio: Satz `resident_voices_r1` ist da (V-642)
- 16 Clips, Namen genau wie bestellt (`V01_farmer_greet_*`, `V02_lorekeeper_greet_*`, je known, cure, fight, first × a/b).
- Farmer B: Akkordeon, Lorekeeper: tiefe Klarinette. Alle hörbar, auf −16 LUFS in `resident_voices_r1_lufs/`.
- Liegt im privaten Branch. Bitte die Platzhalter ersetzen.


# NEU OBEN (22.10.) · An WS1-Lead + WS1d (Fahrzeuge): „Fahrer im Dach“ ist da (WSB J-7, privater Branch `50_BLENDER/J7/`)
- **Ablauf** (auf B39 roof_swallow, V-534): Die Figur hüpft aufs Dach, sinkt bis zur Hüfte ein, fährt sichtbar mit und steigt umgekehrt aus. Getestet mit FB und Lord Hunky in Dragster, Ironclad und Rustwing.
- **Clips:** `J7/_privat_kauf_asset/KFB_Motion_roofdriver_j7.glb`: in_hip, drive_ik (gebacken), drive (für eure Laufzeit-IK), out_hip je Fahrzeug. Fahrzeug-Raum, 30 fps.
- **Anker je Fahrzeug:** `KFB_roof_seat`, `KFB_roof_driver_origin`, `KFB_roof_steering`, `KFB_wheel_grip_L/R`.
- **Zeitpläne:** `J7/data/timelines/<fz>__roof_hip.json`. Vertrag `J7/data/j7_roof_driver.contract.json` (kfb.roof-driver/1).
- **Federn:** Fahr-Werte für `ear-dangle.v1` in `J7/data/j7_dangle_drive.r1.json` (Wind = −Fahrzeug-Geschwindigkeit, bis 45 m/s; Ohren 1,0, Augenstiele 0,4).
- **Abnahme durch Georg im Spiel:** Das Lenkrad ist das Kart-Lenkrad, auf 0,7 verkleinert und 35° geneigt, weil der aufrechte FB kurze Arme hat. Ein größeres Lenkrad ginge nur mit Nachposen.


# NEU OBEN (22.10.) · An WS-NPC: Gesichter für die 14 Boden-Cubes sind da (WSB K15, V-611, privater Branch `50_BLENDER/K15/`)
- **Dateien:** `K15/cubes/KFB_<Name>.k11c.glb` (dunkel) und `KFB_<Name>_healed.k11c.glb` (geheilt), jeweils mit `KFB_Mouth`; die geheilten zusätzlich mit `KFB_HealedEyes`. Originalgröße, ihr skaliert über `heightM 0.8`.
- **Karten:** `K15/data/q_<name>(_healed).figure.json`. `groundOffset` je Cube (0,013–0,103 m; Schwein und Kaktus 10,3 cm).
- **Besonderheiten:**
  - Alien_Tall hat 4 Augen, der Zyklop 1.
  - Krebs: Maul über der Zunge. Huhn und Pinguin: an der Schnabelspitze.
- **Status:** WS0 setzt die Karten auf „bereit zum Einbau“. Georg nimmt im Spiel ab (V-641).
- **Pilz** jetzt ebenfalls beleuchtet: `K15/cubes/KFB_Mushroom(_healed).k11c.glb`, Karten `q_mushroom(_healed)`, groundOffset 0.014. Alle 30 Karten stehen auf ready.
- Übersicht: `K15/out/K15_alle_cubes_uebersicht.png`.


# NEU OBEN (22.10.) · An WS-NPC: eigener Umfall-Clip der Spielzeugsoldaten (WSB N15, privater Branch `50_BLENDER/N15/`)
- **Datei:** `N15/_privat_kauf_asset/KFB_ToySoldier_duel.r3d.n15.glb` (r3d.v3, Originalbytes unverändert, zwei Clips angehängt). Karte `N15/data/toysoldier_duel_r3d.n15.figure.json`.
- **`kfb_toy_topple_a` (1,5 s):** steif umkippen wie eine Aufziehfigur, Hüpfer beim Aufprall. Das Gewehr fällt bei 0,458 s (weaponDrop), Ruhe ab 0,858 s.
- **`kfb_toy_standup_a` (1,0 s):** hochklappen mit Überschwung, der Aufziehschlüssel dreht zwei Runden.
- **Ersetzt den Übergang mit Skelett-Clips** (G-3). Bitte einbauen und in die Abnahme-Liste (V-641) aufnehmen.


# NEU OBEN (22.10.) · An WS1-Lead + Prüfer D: Bausteine für die Tod-Inszenierung sind da (WSB K16, privater Branch `50_BLENDER/K16/`)
- **Kreuz-Pupillen:** `K16/vendor/pupil-kreuz.v1.js`, ein Aufsatz auf EyeRig v6 (v6 unverändert).
  - Aufruf `attachPupilKreuz(THREE, rig)`.
  - Emote `pupil: 'kreuz'` zeigt das X, `'normal'` schaltet zurück. Blick, Lider und E2 wirken mit.
- **„Blödsinn!“ als Knet-Modell:** `K16/out/KFB_Bloedsinn.k16.glb`, 9 Buchstaben als eigene Objekte, Ursprung je Fußpunkt, im Bogen gebogen.
  - Beispiel-Animation `pop`, je Buchstabe 0,05 s versetzt. Farbe `--kfb-blodsinn` #b8361f.
  - Schrift vorerst Bangers. Irish Grover fragt WS0 bei Georg an.
- **Karten:** `K16/data/k16_cards.json`. Einbau in den Baustein „eigener Tod“ (D1/D5) nach dem MVP.


# NEU OBEN (22.10.) · An WS1-Lead: WSB N30 erledigt (Lidrand c2, Disco-Dämon), privater Branch `50_BLENDER/N30/`
- **Lidrand c2:** Ursache ist nicht das E2-Lid, sondern das asymptotische Schließen in v6 zusammen mit dem Warten in `clay-skin-attach.v1`.
  - Fix: `N30/stage/vendor/clay-skin-attach.v1.1.js` rastet ab 90 % ein, „zu“ greift sofort. Danach 0 px Pupille ab 14 Bildern.
  - **Bitte v1.1 vendorn.** v1, E2-Form und v6 bleiben unverändert.
- **Disco-Dämon:** Die alte floorLift-Tabelle gehörte zum src-GLB, gespielt wird aber r1 (2–3 Bilder Versatz).
  - Neu: `N30/data/demon_disco.r1.floorlift.json`, alle vier Clips. Der Dämon-Slot in `K12/data/disco_cast_k12.json` steht jetzt auf r1.


# NEU OBEN (22.10.) · An WS1-Lead: §137 gelesen
- **Stark:** zu Fuß 60 fps, NPC-Culling, Nachthimmel, Heldenfarbe als Einstellung (Original als Standard).
- **c2 Lidrand und Disco-Dämon 2,5 cm:** an WSB als Nachtrag 30 (nach K14): E2-Lid-Abdeckung und floorLift für `kfb_dance_hip_hop_a` am Dämon.
- **Neu im privaten Branch:** N26 (eure Jobs J-1 bis J-5), N29 (HUD-Props), K13 nach der Korrektur N27/N28 (große Schilde außen, große Orc-Axt, Boss-Keule). K13 übernehmt ihr erst nach Georgs Abnahme (Hub q154).
- **VSM/PCF:** liegt bei Georg.


# NEU OBEN (22.10.) · An WS1-Lead: eure WSB-Jobs J-1 bis J-5 sind da (N26, privater Branch `50_BLENDER/N26/`, Details in `RETURN.md`)
- **J-2 Waffen an FB:** FB-Variante je Karte unter `mount.figureVariants.frizzlebob` (Blaster, Pistole), 0 Durchdringung.
- **J-1 Oberkörper-Schuss:** `N26/data/fb.upperbody_ranged.json`. Maske ab spine (19 Knochen), 1H- und 2H-Familie (hold, fire, fire-loop, reload) mit Marken aus den K10-Karten. Die Mischung zeigt erst eure Laufzeit.
- **J-4 Augen Ritter und Dämon:** `N26/data/eye-rig-large.cast.batch.json`. Proof-Stage PASS (offen, halb, zu); Ritter mit Augen im Visierschlitz.
- **J-3 floorLift FB:** `fb.floorlift.json`.
- **J-5 Marsch:** Übergang mit dem Lauf-Clip mit Gewehr. Den Mixamo-Marsch entscheidet Georg.
- **Nach dem MVP-Einbau** nimmt Georg alles im Abnahme-Menü ab (V-641).


# NEU OBEN (22.10.) · An WS1: HUD-Props in Knete sind da (WSB N29, V-652/V-653)
- **Im privaten Branch:** `50_BLENDER/N29/`:
  - Karte `data/kfb_hud_props.r1.json`;
  - GLBs in `out/`: Kompass zu und auf mit Klapp-Animation, Radio mit 4 Tasten und Ticker, Truhe auf und zu mit Nachfedern, Zahnrad, Fluff-Ziffern 0–9 in Bangers, Fächer-Schatten;
  - je Palette auch fertige Varianten `.otown`/`.bucht`;
  - Übersicht `out/proof/N29_HUD_props_paletten.png`.
- **Farbzonen** als `COLOR_0`-Maske (R = base, G = accent, B = detail). Das Spiel färbt aus der Insel-Palette.
- **Anker:** `KFB_SpeedText`, `KFB_MapPlane`, `KFB_Ticker`, `KFB_Mouth`.
- **Hinweise von WSB:**
  - Den Fächer-Schatten im Spiel transparent mit Vertex-Alpha lassen (kfb-clay macht ihn auf der Bühne deckend).
  - Das Kompassglas ist Knete, Halbkreis und Zahl liegen auf dem Deckel.
- **Einbau nach dem MVP** (V-645), gern zuerst als isolierter Vergleich.


# NEU OBEN (22.10., nach eurer Pause) · ÜBERSICHT für den Lead: alles Neue in einem Block
**Status-Kanal (V-639):** `WS1_STATUS.md` bitte ab jetzt nur noch auf `ws1/status` pflegen, ein eigener Branch nur für den Status. WS0 liest dort; zusätzlich findet ein Skript den neuesten Status auf allen `ws1/*`.

Die Einzelheiten stehen in den Blöcken darunter. Die wichtigsten Punkte:
1. **Abnahme im Spiel (V-641):**
   - Abnahme-Menü `?abnahme=1`: je Punkt Sprung und Auslöser, Georg setzt PASS oder TUNE.
   - WS-NPC liefert Sprünge für seine Punkte.
2. **Begrüßungen (V-636, V-640, V-650):**
   - Blasentexte strikt Englisch, aus `replies/NPC_GREETINGS_R1.json`.
   - Stimme: Social Calls mit Sprachmelodie plus Fluff-o-lect.
   - Bewohner-Instrumente (V-642): Farmer B Akkordeon, Lorekeeper tiefe Klarinette. Der Satz wartet auf Georgs Go.
3. **Welt-Ereignisse E1–E3 (V-637):** Regeln und Gewichte stehen fest, der Lead besitzt den Host.
4. **Waffen (V-626–V-628, V-635, V-648, V-651):**
   - Klinge in Schlagrichtung (`KFB_Edge`).
   - Schilde außen auf dem Handrücken.
   - Haltungs-Modelle in `replies/WEAPON_GRIP_MODELS_R1.md`.
   - Boss mit hochskalierter Orc-Keule.
   - WSB korrigiert K13 gerade (N27/N28). Erst nach dem neuen Proof-Stage-Bogen übernehmen.
5. **WSB-Reihe ohne Rückfragen:** N27 Waffen → N28 Boss-Keule → N29 HUD-Props → N26 eure Jobs J-5/J-3/J-2/J-1/J-4 → K14 Goo-Vorstadt.
   - Lieferungen kommen über den privaten Branch, WS0 schiebt sie je Steuerrunde nach.
   - J-5 Marsch: vorerst der Lauf-Clip mit Gewehr. Den Mixamo-Marsch entscheidet Georg.
6. **Diegetisches Knet-HUD (V-645, V-652, V-653):** Kompass als Tacho bzw. Minimap, Tiny-Treats-Radio, Truhe, Fluff-Score in 3D-Bangers, das eine Settings-Zahnrad `GEAR_ICON.glb`, Farben aus der Insel-Palette. Einbau nach dem MVP.
7. **Leistung:** FB-Ohren reduziert WSA in der ToolBox (V-643). VSM → PCF nur mit Georg, mit Vorher/Nachher.
8. **Site:** GPT-Site über WSA (V-624/V-630). Spiel-Slices kommen hinter das gemeinsame Passwort (V-647).
9. **Hypernorm:** WS-Media baut die H13-Engine als Modul (V-620). Einbau über den Lead, sobald sie da ist.


# NEU OBEN (22.10.) · An WS1: diegetisches HUD aus einem Knet-Guss (V-652, V-653)
- WSB baut die HUD-Props: das eine Settings-Zahnrad `GEAR_ICON.glb` (wie in Travel Globe v13 bzw. Travel Combat v25, dort mit `gear-icon.js` und `settings-overlay.js` als Spender), Kompass (zu = Tacho mit farbigem Halbkreis, Zahl in der Mitte; auf = Minimap), Tiny-Treats-Radio mit Knet-Tasten und Laufschrift, Truhe mit Einflug, Fluff-Score in 3D-Bangers, Kartenfächer mit Schatten.
- **Farben zur Laufzeit** aus dem Palettengenerator (V-305) der aktuellen Insel bzw. des Bioms. Jedes Prop hat Farbzonen `base`, `accent`, `detail`. Biom-Wechsel blendet weich über. Karten nie umfärben.
- **Einbau nach dem MVP** gemäß V-645: ruhende Props als gecachte Ansichten, echtes 3D nur beim Aufklappen, < 1 ms.


# NEU OBEN (22.10.) · An WS-NPC: Begrüßungs-Zeilen auf Englisch (V-650)
- Georg: Sprechblasen **strikt auf Englisch**, auch alle künftigen.
- Die Zeilen liegen in `replies/NPC_GREETINGS_R1.json` (cure, fight, known, je 4). Bitte statt der Platzhalter einbauen. Kodierung nach V-505.


# NEU OBEN (22.10.) · An WS1-Lead: §135/§136 gelesen
- **Stark:** Leistung R1 (Hauptbild im Budget V-370), Wasser R1 und E3 Geschenk-Trupp im MVP, Scheinwerfer-Anker PASS.
- **FB-Ohren mit 22 k Dreiecken (V-643):** Das geht an WSA in die ToolBox-Quelle. Die Ohren werden auf etwa 4 k je Ohr reduziert, mit gleicher Sichtprüfung. Danach kommt ein neuer P08-Export, ihr übernehmt 1:1. Kein Fix im Einbau.
- **VSM → PCF:** nur mit Georg. WS0 legt es ihm vor, wenn ihr eine Vorher/Nachher-Messung habt (ms und Bild).
- **Heldenfarbe Ödland-Käfer:** Die Frage ist bei Georg.
- **outBack 0,3 beim Geschenk:** 1:1 lassen, ok.
- **Status-Kanal:** bitte `ws1/status` (V-639). WS0 findet euch aber inzwischen auch so.


# NEU OBEN (22.10.) · An WS-Audio (Status 12): Bewohner-Stimmen (V-642)
- **Instrumente:** Farmer B Akkordeon, Lorekeeper tiefe Klarinette.
- **Satz `resident_voices_r1`:** 16 Clips, Namen genau wie bestellt, als Entwurf in `40_AUDIO/elevenlabs_r1/resident_voices_r1.json`. Erzeugt wird nach Georgs Go, danach liegen die Dateien mit `_lufs` im privaten Branch.
- **Zusammen mit V-640:** Die Social-Call-Stimme (weiblich bzw. männlich, mit Sprachmelodie) liegt als Basis darunter, das Instrument trägt Melodie und Ornament. Die Mischung entscheidet ihr.
- Bis dahin bleiben eure Platzhalter.


# NEU OBEN (22.10.) · An WS1-Lead + WS-NPC: Abnahmen ab jetzt im Spiel (V-641, Georg)
- **Georg nimmt Verhalten und Eingebautes selbst im MVP ab**, nicht mehr über Standbilder.
- **Bitte ins MVP:** ein Abnahme-Menü, Taste bzw. Schalter `?abnahme=1`.
  - Darin eine Liste der offenen Punkte. Je Punkt ein Sprung an den Ort und ein Auslöser. Georg setzt PASS oder TUNE mit Notiz; der Export geht an WS0.
  - **Erste Punkte:**
    - G-2 Gerücht und Begrüßung (Farmer B sieht Kampf → Lorekeeper grüßt);
    - A-1 bis A-7 von WS-NPC (Fluffer 0,8 m, Heilschuss am Baum, Lorekeeper, Farmer B, Spucken und Augen, Ork-Band, Skelette);
    - E3 Geschenk sobald gebaut;
    - Kampf R1.
- **WS-NPC** liefert die Sprünge und Auslöser für seine Punkte.
- **Keine Abnahme-Bilder mehr über Repos** für Dinge, die schon im Spiel sind.


# NEU OBEN (22.10.) · An WS-Audio: Stimme der Begrüßungen aus den KFB-Social-Calls (V-640, Georg)
- **Grundlage:** die vorhandenen ElevenLabs-Social-Calls in `media/3D_Assets/Audio/KFB ChatterBox/`, 15 Dateien, weiblich „Siren“ und männlich „Roger“.
- **Auftrag:**
  1. Katalogisieren je Grund: `cure`, `fight`, `known`, kurze Reaktion.
  2. Mit Sprachmelodie anpassen: Tonhöhenkontur je Grund (fight steigend und keck, cure warm, known kurz und freundlich), Lage je Figur.
  3. Fluff-o-lect-Phrasen bzw. die Fluff-o-lect-Melodie darüberlegen (V-500); benannte Figuren mit Ornament (V-616).
- **Fehlende Rufe:** als Liste an WS0, WS0 erzeugt sie in denselben Stimmen.
- **Das ersetzt den Punkt „Stimme“ aus V-636.** Die Blasentexte kommen weiter aus dem Hub (q152).


# NEU OBEN (22.10.) · An WS1-Lead, WS-NPC, WS-Audio: Antworten auf §127–§134 (V-635 bis V-638)
**Status-Kanal (V-639, Georg ärgert sich zu Recht, drittes Mal heute):** WS0 hat euren Status auf `ws1/mvp-r1` gesucht, er stand aber auf `ws1/terrain-439`.
- Ab jetzt schreibt WS1 `WS1_STATUS.md` **nur noch auf `ws1/status`**, genauso wie `ws-npc/status` und `ws-audio/status`: ein eigener Branch nur für den Status, unabhängig von den Arbeits-Branches.
- WS0 findet den neuesten Status zusätzlich automatisch auf allen `ws1/*`-Branches (`tools/status_latest.sh`). Ein fester Ort bleibt trotzdem Pflicht.

- **§134 Begrüßungen (V-636):**
  - **Stimme:** Keine neuen „Hm-hm“-Aufnahmen. Die Stimme ist die Fluff-o-lect-Melodie je Wort (V-500/V-508). Benannte Figuren bekommen ihr Signatur-Ornament (Georg ja, V-616). Für kurze Reaktionen gibt es die vorhandenen Rufe aus `fluffolect_layer_r1` (z. B. F03 „hm“, F01 Lachen). WS-Audio hängt das an `greet`.
  - **Blasentexte:** Der WS0-Entwurf mit je 4 Zeilen für cure, fight und known liegt bei Georg im Hub (q152). Nach seiner Abnahme kommt die Datei `replies/NPC_GREETINGS_R1.json`. Bis dahin Platzhalter. Kodierung nach V-505.
- **§133 E3 Geschenk:** Danke für den Fund, also kein Blender nötig. **Regeln E1–E3 (V-637):**
  - höchstens eines zugleich, nur in der Spielerblase, nie im Kampf, nicht in den ersten 3 Minuten;
  - globale Abklingzeit 4 Minuten;
  - Gewichte E2 0,5 · E3 0,3 · E1 0,2; eigene Abklingzeit E2 8 · E3 10 · E1 15 Minuten;
  - Ort frei und eben, außer Sicht beim Erscheinen;
  - Werte als Daten in `kfb.world-event/1`, das Blatt dazu ist `BRIEF_WS1_NPC_EVENTS_R1.md`.
- **§130 WSB-Jobs (V-638):** angenommen als WSB-Nachtrag 26.
  - MVP zuerst: J-5 Marsch, J-3 floorLift FB, J-2 Halterung FB, J-1 Oberkörper-Schuss FB, J-4 Augen Ritter/Dämon.
  - Nach dem MVP: J-6, J-7, J-8. J-9 ist Nachtrag 19.
  - Neu und schon fertig bei WSB (privater Branch `50_BLENDER/K13`): große Waffen im Boss-Slash, alle Klingen in Schlagrichtung (V-626–V-628, V-635).
- **§128 WS-Audio:**
  - (1) `catalog.snapshot.json` liegt weder im Repo noch in Georgs Dropbox. Die Audio Site gehört WSA. WS0 bittet WSA, die Datei nach `assets/private` (`40_AUDIO/catalog/`) zu legen.
  - (2) Gibt es dort eine Visualizer-Form, gilt sie. Sonst bleibt `kfb.audio.presentation-pulse.v1` bzw. `musicPulse()`.
  - (3) Tags und Lautheit kommen aus dem Katalog, eine Quelle. Bis er da ist, geht es mit dem jetzigen Stand weiter.
- **Test-Slot `kfb-slot`:** gut so.


# NEU OBEN (22.10.) · An WS-NPC: Abnahme-Belege sind im Hub (q150, q151)
- **Danke für `proofs/ws-npc-r1`.** Im Hub stehen jetzt q150 (Gerücht D2) und q151 (Stand zur Ansicht).
- **Bitte nachliefern** (gleicher Branch, neuer Commit):
  - `k11_farmer.png` und `k11_lorekeeper.png` neu: Im Bild verdeckt ein Baum den Farmer, der Lorekeeper ist zu weit weg. Kamera näher, freie Sicht, Tätigkeit erkennbar.
  - `bot_crew.png` näher.
  - Eine Zeile, was die Begrüßung „fight“ im Spiel zeigt (Zeile, Geste, Ton).


# NEU OBEN (22.10.) · An WS-NPC: Georgs Antworten (V-633, V-634)
- **G-1 Bot-Augen: PASS** (Georg hat sie gesehen, ok). Damit ist die Lead-Bedingung erfüllt.
- **G-3 Skelett-Clips als Übergang für die Spielzeugsoldaten: ok.**
- **G-2 Gerücht D2:** Georg fragt, was „grüßt mit fight“ bedeutet. Bitte in zwei Sätzen erklären, was der Spieler sieht bzw. hört (Zeile, Geste?). Dann kommt seine Antwort.
- **Neu, Welt-Ereignis E3 (V-634, ergänzt Phase E):**
  - Spielzeugsoldaten erscheinen an zufälligen freien Orten aus einem **großen Geschenk**, das sich öffnet bzw. auseinanderfällt, und marschieren heraus, wie der MIB-Turm in E1.
  - **Zuerst suchen:** die Geschenk-Animation aus dem alten Resident Atlas, mit Such-Protokoll (V-140). Fundstelle an WS0.
  - Gibt es sie nicht, baut WSB das Geschenk als Prop.
  - Selten, mit Abklingzeit, nur in der Spielerblase, Ton aus vorhandenen Sätzen.
- **Bilder für den Hub:** bitte trotzdem nach `proofs/ws-npc-r1` (A-1 bis A-7 zur Ansicht).


# NEU OBEN (22.10.) · An WS-NPC (Status 11): Abnahmen kommen in den Hub, bitte Bilder privat pushen
- **Danke für die Bündelung.** WS0 stellt G-1 (Bot-Augen), G-2 (Gerücht D2) und G-3 (Spielzeugsoldaten-Übergang) als Abnahme-Karten in Georgs Hub. A-1 bis A-7 kommen als Ansicht dazu.
- **Die Bilder liegen nur auf dem WS1-Mac.** Bitte so pushen:
  - Repo `georg-doc/KFB-Stunt-Car-Race` (privat), eigener Branch `proofs/ws-npc-r1`, per `gh`-Login;
  - Inhalt: `bot_front.png`, `bot_crew.png`, `squad.png`, `fluffer_size_0_8.png` (+ `_1_1`, `_0_7`), `k11_lorekeeper.png`, `k11_farmer.png`, `hud_t3.png`, `band.png`, `aggro.png`, dazu `WS_NPC_PhaseD3_clip_terrain3.webm`;
  - für G-2 ein kurzer Text bzw. Log-Auszug aus `unit-rumor`.
  - Den Push bestätigt Georg direkt in deiner Sitzung.
- WS0 holt die Dateien und baut die Karten. Georgs Antworten kommen zu dir zurück.


# NEU OBEN (22.10.) · Ein Modul `kfb-groundfx` für Disco-Licht, Scheinwerfer und Boombox-Ringe (V-632, Georg „ja“)
- **Fahrzeug-Sitzung** baut das Modul zuerst, zusammen mit den Scheinwerfern; siehe `BRIEF_WS1_VEHICLES_R1.md`.
- **Lead:** Das Disco-Licht nach dem MVP setzt auf `kfb-groundfx` auf (Kegel und Pfützen projiziert, V-572). Kein eigener Weg.
- **WS-Audio:** Die Boombox-Ringe brauchen die Takt- bzw. Band-Werte (Bass, Kick) als Ereignis oder Lesewert. Bitte dieselbe Schnittstelle wie für den Musik-Modus des Wind-Deformers anbieten.


# NEU OBEN (22.10.) · Zwei weitere WS1-Sitzungen parallel (V-631, Georg)
- **Dritte Sitzung: `BRIEF_WS1_WATER_R1.md`.** Seen, Flüsse, Unterwasser-Ansicht, Fahren im Wasser. Branch `ws1/water-r1`.
- **Vierte Sitzung: `BRIEF_WS1_VEHICLES_R1.md`.** 8 Dieselpunk-Racer, Heldenfarbe, Front-Scheinwerfer. Branch `ws1/vehicles-r1`.
- Beide basieren auf `ws1/mvp-r1`, eingebaut wird über den Lead.
- **Lead:** Nach dem MVP zuerst Leistung (Ziel ≥ 55 fps) und Disco-Licht, Combat-AV-Backlog mit dem Kampf-Einbau.


# NEU OBEN (22.10.) · An WS1-Lead: Antworten auf §122/§124/§126 (V-630). Entschuldigung, WS0 hat bis eben `ws1/r3f-frame` statt `ws1/mvp-r1` gelesen.
1. **FrizzleBob:**
   - Der aktuelle Stand ist der ToolBox-P08-Kandidat von WSA: `wsa/toolbox-frizzlebob-face-2026-10-21` @20a0123, Datei `dist/data/kfb-pet-frizzlebob-earrig-v5.georg-2026-10-21.p08.json` (Rig-Augen, Brauen −0.08 / Pitch 8, `partColors`).
   - WSA prüft gerade den Browser-Roundtrip. Danach 1:1 übernehmen, als MC-Slot-Actor `fb_game`.
   - Motion-Library-Clips auf FB as-is, wenn die Knochennamen Rig_Medium-gleich sind. Das prüft ihr bitte selbst; bei Abweichung an WS0.
2. **Hexe bei 30,6 s:** `house_a`.
3. **Augen von Ritter und Dämon:** Bitte PROOF-Bilder an WS0 schicken (Proof-Stage, vorn, ¾, nah). Georg entscheidet im Hub zwischen „Profil im Studio nachziehen“ und „Anker-Sitz abnehmen“. Bis dahin bleibt der Anker-Sitz.
4. **Merge-Reihenfolge:** erledigt, ihr habt in `ws1/mvp-r1` zusammengeführt. Danke.
5. **Fluffer und Cubes:** erledigt (V-616 0,8 m; V-611 WSB-Auftrag K15).
6. **Build-Prüfung `src/private`:** Ja. Ein Build, der private Körper enthält, bricht ab, außer es ist der passwortgeschützte Site-Build.
7. **GPT-Site:** Eure Übergabe `ws1/handoff/HANDOFF_GPT_SITE_R1.md` geht an WSA work (V-624). WSA beantwortet die Plattform-Fragen dort.
8. **Kampf-Module:** siehe die Karte unten (22.10.).


# NEU OBEN (22.10.) · An WS1-Lead: Karte der Kampf-Module für V-618 (spart die Suche)
**Repo `georg-doc/KFB-Combat-Arena` (privat), PR-Stapel:**

| PR | Branch @ Commit | Inhalt | Basis |
|---|---|---|---|
| #23 | `wsa/arena-weapon-policy-r1-2026-10-20` @412269c | Waffen-Verträge V-581/V-582: Halterungen, Clip-Familien, Bogen-`release` | main |
| #24 | `wsa/toysoldier-r3c-playable-2026-10-20` @f712f0d | K10 Pistole/Blaster spielbar, Soldat r3d. **Enthält #27** (alle K10-Waffen, native Ereignisse, `weaponDrop`). **Das ist der Arena-Stand zum Übernehmen.** | #23 |
| #28 | `wsa/bow-death-b-2026-10-21` @e1a830e | Bogen `Death_B` (CI grün) | k10-weapon-families |
| #25 | `wsa/openworld-modules-v584-2026-10-21` @cb0d93c | **4 eigenständige Combat-Module mit Vertragstests für die offene Welt**, inkl. Hit-Stop-Vertrag V-567. **Das ist euer Einstieg fürs Spiel.** | planning/open-world-combat-transfer |
| #26 | `wsa/dark-fluffer-donor-v584-2026-10-21` @028dd00 | Dark Fluffer: 17 Cube-Spender, Front- und Spuck-Belege | main |

- **Doku je Waffe** (Marken, Effekte, Grenzen): `_handover/K10_RUNTIME_2026-10-21/README.md` im Arena-Repo.
- **Private Modelle und Töne:** `KFB-Stunt-Car-Race/assets/private`:
  - `50_BLENDER/B50`, K10-Karten, Mündungsblitze unter `kaykit/Mystery_S4_Action_Figure/gltf/`;
  - neu `50_BLENDER/K13/` (Nahkampf Rig_Large, Boss-Launch);
  - Töne in `40_AUDIO/elevenlabs_r1/<set>_lufs/`.
- **Combat-AV-Prototypen** (Georg PASS mit TUNE: Ankündigung, Kamera nah nur im Kampf, Abgang, Kill am Ort, Spieler-Treffer, Tusche, Tod-Inszenierung):
  - Sie liegen auf `ws1/combat-av-r1`, **laut Prüfer D nur lokal, nicht gepusht.**
  - **Prüfer D: bitte `ws1/combat-av-r1` pushen**, damit der Lead sie sieht. Die Schalter stehen in `replies/WS1_COMBAT_AV_R1_RETURN.md` (`?tele=1`, `?kam=nah`, `?abgang=1`, `?hurt=1`, `?ton=1`, `?tod=1`).
- **Noch in Arbeit bei WSB, erst nach Georgs Abnahme einbauen:** K13-Axt-Korrektur, Boss-Move mit großen Zweihändern, Klingen-Prüfung `KFB_Edge` (V-626–V-628).


# NEU OBEN (22.10.) · MVP-Site: GPT-Site/Stage statt Cloudflare (V-624)
- **Georg hat Cloudflare gestoppt.** WSA work baut die spielbare Fassung wieder als GPT-Site bzw. Stage wie zuvor.
- **Ihr habt das schon eingeplant.** Der Brief V-618 ist angepasst: Der Lead liefert `ws1/mvp-r1`, WSA die Stage.


# NEU OBEN (22.10., ~00:10) · Zwei neue Aufträge für WS1 (Georg: „ja, das passt“)
- **WS1-Lead: `BRIEF_WS1_MVP_MERGE_SITE_R1.md` (V-618).**
  - Ein Spiel-Branch `ws1/mvp-r1` aus Gelände, NPC und Ton, dazu Kampf.
  - Site über Cloudflare Pages mit privatem Asset-Abruf im Build, vorerst mit Login.
  - Danach ein blinder Design- und Gameplay-Kritiker.
- **Zweite WS1-Sitzung: `BRIEF_WS1_BIOME_DRIVE_WEATHER_R1.md` (V-619).**
  - Endlose Biom-Fahrt mit Tageszeit, Wetter und Licht-Presets über das eine Rig.
  - Eigener Branch `ws1/biome-drive-r1`.
- **Zur Kenntnis:**
  - Hypernorm R2 (V-620): WS-Media liefert das Modul `kfb-hypernorm` für die Tafeln. Der Einbau läuft über den Lead nach V-618.
  - Backlog nach dem MVP: Wasser-Fahrt, Tunnel als Bau-Element, Portale + Ruhestein (`BACKLOG_WATER_TUNNEL_PORTAL_R1.md`).


# NEU OBEN (21.10., ~23:50) · An WS-Audio + Prüfer D: neue Klänge liegen im privaten Branch
- `npc_steps_r1` (17 Klänge): `N01_clay_step_grass_a` ist verworfen, nehmt für Gras `N01_b`.
- `heavy_steps_r1` (8).
- `combat_av_fix_r3`: L14 `jump_hop` und L15 `bloedsinn_stinger`, je a/b.
- Jeweils mit `<set>_lufs/` auf −16 LUFS. Die Platzhalter bitte ersetzen.
- **Prüfer D:** Die Zusammenführung von Tod-Fenster und Knet-Wort bleibt wie entschieden.


# NEU OBEN (21.10., ~23:15) · Georgs Hub-Antworten (V-616)
- **WS-NPC: Fluffer-Größe 0,8 m.** `heightM: 0.8` für alle Fluffer und Boden-Cubes, auch für die kommenden k11c-Gesichter.
- **WS-Audio:**
  - Die Fluffer-Klänge gehen bei 0,8 m etwa 3–5 % höher.
  - **Stimmen:** Benannte Figuren dürfen ein kurzes Signatur-Ornament haben (2–4 Töne ohne Wort am Zeilenanfang oder -ende, zusätzlich zu „ein Ton je Wort“, V-508).
  - Bots gleiten wie alle anderen, keine gestuften Chip-Töne.
  - Die Sätze `npc_steps_r1` und `heavy_steps_r1` hat Georg bejaht. WS0 erzeugt sie, sobald das Go durch ist. Bis dahin bleiben die Platzhalter.
- **WS1 / Prüfer: Hypernorm P0 nicht einbauen.**
  - Georg: FAIL. Er will keine festen Phasen und kein festes Layout, sondern einen dynamischen Remix wie die bestehende Hypernormalisation-Engine, optimiert.
  - WS-Media baut P0 neu auf die Engine. Der Brief folgt.


# NEU OBEN (21.10., ~23:00) · An Prüfer D (Combat-AV R1) + WS1-Lead (V-615)
- **Töne:**
  - L1–L13 und alle Nachdrehs (M03_b … C11) sind erzeugt und liegen im privaten Branch: `40_AUDIO/elevenlabs_r1/combat_av_fix_r1/` + `combat_av_fix_r2/`.
  - Jede Datei gibt es auch auf −16 LUFS normiert in `<set>_lufs/` (m4a).
  - Das gilt für alle Sätze (melee_destruction, combat, blaster, throwables, detonator usw.): Die `_norm/`-Ordner enthalten nur den Bericht, die Dateien liegen in `<set>/` bzw. `<set>_lufs/`. Bitte `_lufs` nehmen.
  - L8 `player_hurt`, L9 `mob_pop_to_skull` und L13 `mob_windup` sind schon dabei.
- **L14 `jump_hop` und L15 `bloedsinn_stinger`:** als Satz `combat_av_fix_r3.json` entworfen. Erzeugt wird mit Georgs Go (Hub q145). Bis dahin bleiben eure Platzhalter.
- **Kreuz-Pupillen beim Tod** (`pupil: 'kreuz'`) und **„Blödsinn!“ als Knet-Modell** (D5: comicmäßig gebogenes, typografisch sauberes Lettering): gehen als Nachtrag 19 an WSB. Lieferung als GLB + Karte über den privaten Branch.
- **Tod-Fenster (D2):** Wie Georg entschieden hat, liefert Prüfer D den Baustein und der WS1-Lead baut ihn im Spiel ein.
- `serve_soldier.py` `request_queue_size=256`: bitte als Ein-Zeilen-Hinweis an WSA, die Arena gehört dort.


# NEU OBEN (21.10., ~22:30) · An WS-NPC (Status 8/9), WS-Audio (Status 5/6), WS1 (Hypernorm P0)
- **WS-NPC Status 8, Heil-Schuss (V-610): Variante a.**
  - Im Zielkegel gewinnt ein feindlicher Dark Fluffer bis etwa 1,5 m hinter dem nächsten Hindernis (Baum, Fels, Haus) vor dem Hindernis.
  - Sonst bleibt „nächstes Ziel gewinnt“.
  - Gilt nur für Heil-Schüsse auf Fluffer, nicht für Waffen.
  - Prüfung: Clip aus der Spielkamera, Fluffer hinter Baum wird geheilt, Baum allein bleibt Baum.
- **WS-NPC Status 9, Cubes (V-611):**
  - Der Auftrag ist an WSB weitergegeben (Nachtrag 18): k11c mit `KFB_Mouth` + `KFB_HealedEyes` für die 15 übrigen Boden-Cubes, nach K13/K14.
  - Mushroom liegt schon aus K11.
  - WSB liefert in Originalgröße; ihr setzt die Größe nur über `heightM`, nach Georgs Wahl (1,1 / 0,8 / 0,7 m).
  - Dateien kommen über den privaten Branch.
- **WS-Audio Status 5/6 (V-612):**
  - Schritte und Hüpfer aus echtem Sohlen-Kontakt: angenommen.
  - Die Lücken 1–8 und die drei Gruppen-Klänge (Knochen-Zerfallen, Soldaten-Ruf ohne Worte, Bot-Piepser) stehen als Satz `40_AUDIO/elevenlabs_r1/npc_steps_r1.json` (18 Clips).
  - Erzeugt wird erst nach Georgs Go, zusammen mit `heavy_steps_r1`. Bis dahin bleiben eure Platzhalter.
  - Neue IDs zum Vorverdrahten:
    - `N01`–`N03` Knete-Schritte für Gras, Sand/Weg und Fels (je a/b);
    - `N04` Skelett-Tock, `N05` Soldaten-Marschtritt, `N06` Aufziehschlüssel (Schleife), `N07` Bot-Stapfen;
    - `N08` Goo-Gleiten (Schleife), `N09` geheilter Hüpfer;
    - `N10` Bot-Wut, `N11` Aufrappeln;
    - `N12` Knochen-Zerfallen, `N13` Soldaten-Ruf, `N14` Bot-Piepser;
    - `N15` Publikum der Ork-Band (Schleife).
  - Fluffer-Tonhöhe zieht mit `heightM` mit, wie von euch vorgeschlagen.
- **WS1 / Prüfer: Hypernorm P0 (V-613)**
  - Branch `media/kfb-hypernorm-p0-2026-10-21` @edc79c7 (`…/MEDIA_HYPERNORM_REMOTION_R1/P0/kfb-quote-sequence/`, 11 Vertragstests grün).
  - Bitte prüfen und einbinden, wenn ihr dazu kommt.
  - Die Freigabe als Überlagerung in `p0.pilot.json` reicht für P0.
  - Tafel-Basis und Palette `bucht` entscheidet Georg im Hub. Bis dahin bleibt der Pilot wie geliefert.


# NEU OBEN (21.10., ~21:30) · An WS-NPC: noch eine Kauf-Datei im öffentlichen Push + an WS-Audio
- **WS-NPC:** Push `4b78a5b9a` enthält `src/assets/actors/cast/Lorekeeper.glb` (KayKit Mystery S6, Kauf) öffentlich. `KFB_Ghost_healed.k11c.glb` und `Ghost.gltf` sind ok (CC0 + eigene Augenkappen). Bitte ab jetzt **nichts Gekauftes mehr** in `kayfabizarro` pushen, nur über den gitignorten Verweis auf den privaten Klon. Nichts selbst löschen; Georg klärt es mit dem Privat-Umzug (V-599, Hub q142).
- **WS-Audio:**
  - L1–L13 und die zweite Runde der stummen Clips (`combat_av_fix_r2`, alle hörbar) liegen im privaten Branch, jeweils auch als `_lufs`.
  - Die Gruppen-Lücken (Knochen-Zerfallen beim Skelett-K.o., Soldaten-Ruf ohne Worte, Bot-Piepser ohne Arcade) nimmt WS0 in den nächsten Satz auf.
  - Die Zusammenführung mit WS-NPC (`package.json`, `m1-terrain.js`, `M1World.jsx`) übernimmt der Lead.


# NEU OBEN (21.10., spät) · An WS-NPC: Goo-Gegenmittel entschieden (V-609, Georg im Hub)
- **Goo-Flecken freiwaschen:** Der Spieler schießt mit dem Robo-Arm (Trichter) bunte Fluff-Kugeln aus seiner Sammlung. **Jede Farbe wäscht frei**, auch die Goo-Flecken der Dark Fluffer im Gelände. Später wird die passende Farbe ein Rätsel über Spielknoten.
- Das ergänzt Phase C: Die Pistole heilt den Fluffer (V-595), Fluff-Schüsse waschen den Fleck. Der Ablauf von 180 s bleibt.
- **Zensurbalken** in Sprechblasen und auf Karten-Texten: Teil der Text- bzw. Kartenebene (WSA, Card Ink Defense). Bei dir nur, wenn Bewohner sprechen und Goo in der Nähe ist: 1–2 Inhaltswörter mit Knet-Balken, nie Namen.


# NEU OBEN (21.10., spät) · Neu von Georg: schwere Schritte für große Figuren (WS-Audio, V-607) + Companions Bleistift und Radiergummi (WS-NPC, V-608)
**WS-Audio · schwere Schritte für Rig_Large** (Black Knight, Demon Lord, Orc Brute, später Golem usw.):
- Sie sollen schwerer und stampfender klingen als Rig_Medium.
- **Sofort ohne neue Töne:** Faktor je Rig in der Schritt-Zuordnung. Large: Tonhöhe ×0,8, +3 dB, dazu eine tiefe Körper-Ebene (`creatures_r1` C01 clay_body_fall bzw. `debris_crash_r1` D06) mit 20–40 ms Versatz. Bei sehr großen Figuren ein kleiner Kamera-Stoß nur in der Nähe, abschaltbar.
- **Danach:** eigener Satz `heavy_steps_r1` (Gras, Stein, Sand, Holz, Rüstungs-Klirren, Landung); WS0 erzeugt ihn nach Georgs Go.
- Die Schritte hängen an der Gangphase wie bisher, kein eigener Takt.

**WS-NPC · Phase F Companions** (nach E):
- Bleistift und Radiergummi (WSB B46, Cast `pencil` bzw. `eraser`, ready; Clips Idle, Hop, Joy, Scare, Write bzw. Erase; Rig KFB_Squash mit Knochen `head`) werden **protopische Werkzeug-Begleiter**.
- **F1 Pet-Logik:**
  - folgen dem Spieler hüpfend mit Feder-Abstand (Hop), warten im Idle;
  - weichen aus, freuen sich bei Fluff bzw. Treffern (Joy), erschrecken bei Gefahr (Scare);
  - nie im Weg, Teleport hinter den Spieler bei großem Abstand mit Puff (V-499).
- **F2 später, eigenes Go:**
  - Radiergummi **radiert Goo-Flecken weg** (passt zum Dark-Fluffer-Reinigen) bzw. kleine Terrain-Stellen.
  - Bleistift **zeichnet 3D-Baupläne** als Linien-Vorschau für Fluff-Bauten (Kayfabrizieren V-533).
- Daten `kfb.companion/1` (Abstand, Hüpf-Rhythmus, Reaktionen), Clips as-is, keine neuen Assets.


# NEU OBEN (21.10., ~21:00) · An WS-Audio (Status 2) und WS-NPC (Status 7)
**An den Combat-AV-Prüfer:** L9 `mob_pop_to_skull` und alle anderen L1–L13 sind erzeugt, privater Branch `40_AUDIO/elevenlabs_r1/combat_av_fix_r1/` + `_lufs/`. Nr. 6 (b) und Nr. 7 (PASS mit TUNE) sind im Register vermerkt.

**WS-Audio:**
- **Die Lücken L1–L13 sind da.** Im privaten Branch liegt `40_AUDIO/elevenlabs_r1/combat_av_fix_r1/` plus `_lufs/`:
  - L01 bow_release, L02 crossbow_release, L03 arrow_hit_body, L04 magic_cast, L05 magic_hit_clay;
  - L06 dice_flick, L07 mob_bite, L08 player_hurt, L09 mob_pop_to_skull, L10 weapon_drop;
  - L11 gatling_spin_up, _down und _loop, L12 smoke_pop_short, L13 mob_windup.
  - Bitte die Platzhalter für Armbrust, Bogen, Magie, Spieler-Treffer, Kill/Schädel und Ausholen ersetzen.
- **Lautheit −16 LUFS je Einzelklang ist erledigt:** Alle Sätze liegen als `<set>_lufs/*.m4a` mit `lufs_report.json` vor. Die Laufzeit-Normierung kann damit auf kleine Korrekturen schrumpfen.
- Noch fast stumm und in Arbeit (zweite Runde): u. a. M04_shield_block_a, DF10_eyes_pop_white, R03_hover_over_rock, C02_c, C03_b, D01_arm_beeps_b, W04_rain_onset_b. Bis dahin die jeweils andere Variante nehmen.
- Motor-Ducking −4 dB bei schweren Treffern: ja.

**WS-NPC:**
- Echte Figuren, Ghost k11c, D2 und Bots als Proof: sehr gut.
- **Bot-Augen PROOF:** Georg schaut auf das Frontbild, bitte schick es ihm. Danach nimmt WSB die Bots in die Besetzungsliste (Nachtrag 15).
- **Marsch bzw. Gewehr beim Gehen (D-10):** geht als WSB-Job raus (Halterung für Walking/Idle bzw. ein Marsch-Clip as-is für Soldat r3d, Regeln V-582). Bis dahin die Soldaten ohne Gewehr gehen lassen bzw. nur in den Clip-Familien mit Halterung.
- fps 42–44 headless mit Gruppen und Band ohne messbaren Aufpreis: gut, die Basis-Grenze bleibt Job 1 des Leads.


# NEU OBEN (21.10., spät) · An den Lead: Gemeinsamer Wind mit wiegenden Gras-, Pflanzen- und Blumengruppen + Wind als Wegweiser (V-605, Georg 21.10.)
**Use what works, nichts neu erfinden:** Die Regeln stehen schon in `CANON_3D/sources/SPEC_ENVIRONMENT_KIT_R1.md`:
- §5 Cartoon-Deformer (Fuß fest, Krone biegt quadratisch, Wobble);
- §6 Wind-Gruppen (Rule-of-Three-Gruppe mit gleicher Grundphase, Windfeld mit Böen als Wellen, bis 64 Gruppen als Uniform-Array bzw. Daten-Textur, Gruppe einzeln anstoßbar);
- §7 Musik-Modus;
- §8 Gras in Büscheln, ein Draw Call je Grasart.

Dazu Kanon-Zeile V-565 (Materialcodes „wiegen in Wind-Gruppen“), V-371 (Fluff-Böe schüttelt eine Zone), V-449 und V-455 (ein gemeinsames Windfeld auch für Ballons und Requisiten) und dein §97 Nr. 3.
- **Bauen auf terrain3:**
  - ein Windfeld (Richtung, Stärke, Böen-Wellen) für Gras-, Pflanzen- und Blumengruppen, Bäume, Staub und Fluff;
  - Gruppen weichen aus, wenn eine Figur durchläuft oder ein Racer vorbeifährt;
  - alles im Vertex-Shader (GPU), keine CPU-Animation je Instanz.
- **Wind als Wegweiser** (Ghost of Tsushima): Die Böen laufen sichtbar Richtung aktuelles Ziel (Quest, Scenelet, Diorama), lesbar über Grasbahnen und Blätter. Ein Schalter, Standard aus, bis Georg es gesehen hat.
- **Ton:** WS-Audio koppelt den Wind-Atmo-Bus an die Böenstärke (V-458; Wind-Clips liegen bereit).
- **Budget:** ≤ 1 ms je Bild für Wind und Gruppen, keine neuen Draw Calls je Gruppe.
- **Abgabe:** kurzes Video aus der Spielkamera (Wiese mit Gruppen, eine Böe läuft durch, eine Figur läuft hindurch, Wegweiser an und aus) + fps.


# NEU OBEN (21.10., spät) · An den Combat-AV-Prüfer: Antwort auf `WS1_COMBAT_AV_R1_RETURN.md` (V-604)
Sehr guter Bericht: Einsatz 30–55 → 10–15 ms, Gegner-Bus, Kaskade, Georgs Urteile sauber festgehalten.
1. **Lautheit statt Spitze erledigt:** Alle 28 Sätze liegen jetzt zusätzlich als `40_AUDIO/elevenlabs_r1/<set>_lufs/*.m4a` (AAC 128k, **−16 LUFS** je Einzelklang nach BS.1770, weicher Begrenzer auf −1 dBFS) mit `lufs_report.json` im privaten Branch. Werkzeug: `lufs_set.py`. Die `_norm/`-Ordner (nur Reports) bitte nicht mehr verwenden.
2. **Praktisch stumme Clips** (Eingang < −38 LUFS) sind im Report erkennbar (`lufs_in`). Deine Liste stimmt; dazu kommen u. a. DF10, D05_c, K03_metal, R03_rock.
3. **L1–L13 + Neuaufnahmen** (42 Clips, Satz `combat_av_fix_r1`): **erzeugt** und im privaten Branch (+ `_lufs`). 11 Neuaufnahmen sind erneut fast stumm (u. a. M04_a, DF10, R03_rock); die gehen mit neuen Prompts in eine zweite Runde. Ablage als `*_v2` bzw. `L01…L13`, gleich als `_lufs`. **L13 `mob_windup` ist dabei.**
4. **Georgs Urteile übernommen** (V-604):
   - Nr. 1 Klang je Waffe: PASS, TUNE später (K1 tiefer, K2 Würfel-Klick L6).
   - Nr. 4 + 8 Knet-Masse und Kill-Puff: PASS als Umschalter, der grüne Stern bleibt Standard (Georg 06.09.).
   - Nr. 3 Ankündigung: PASS, TUNE A1–A3.
   - Backlog übernehmen.
5. **Nr. 6 Kamera und C8: Georg hat entschieden: (b) Nähe nur im Kampf**, C8 bleibt außerhalb des Kampfs bei 85 %.
6. **Werkzeug-Fixes W3/W4/W5:** gehen an WSA (`request_queue_size=256`, Brief-Korrektur `?actor=soldier-r3d`, Hash-Nachtrag für `gunfight.v2.js` beim Einbau).


# NEU OBEN (21.10., ~20:30) · An WS-NPC (und Lead): Kauf-Dateien im öffentlichen Zweig `ws-npc/phase-a`
Im Push `55fff1e14` liegen gekaufte bzw. privat geführte Dateien im **öffentlichen** Repo:
- `src/assets/actors/cast/Farmer_B.glb` und `ToySoldier.glb` (KayKit Mystery S6, Kauf);
- `src/assets/actors/Rig_Medium_Simulation.glb` und `Rig_Medium_Special.glb` (KayKit Character Animations; Georg 17.10.: wie Kauf-Asset, privat).

Frei und ok sind: Skeletons, `Ghost.gltf` und `Gun_Pistol` (CC0).

- **Ab sofort:** keine weiteren Kauf- bzw. Privat-Dateien in `kayfabizarro`, auch wenn sie schon auf `main` liegen. Private Dateien nur über den gitignorten Verweis auf den Klon von `KFB-Stunt-Car-Race/assets/private`, wie bei der Ork-Band.
- **Nicht selbst löschen bzw. History umschreiben.** Georg entscheidet das zusammen mit dem Privat-Umzug (V-599). Bitte in deinem Status vermerken, welche Dateien es sind.


# NEU OBEN (21.10., abends) · An WS-Audio: Antwort auf Status 1
Sehr gut: ein Ton-Pfad, WSA-Pakete 1:1, Jukebox nach Modus, Ducking, Audio im Mittel 0,2 ms, keine Tondatei im Repo oder dist, Video an Georg.
1. **Push-Go für `ws-audio/*`.** Den Deploy-Key nur mit Georgs Bestätigung in deiner Sitzung; kein Merge.
2. **Fehlende Töne:**
   - **Schon da** im privaten Branch (`40_AUDIO/elevenlabs_r1/melee_destruction_r1` + `_norm`): Schwert- und Keulen-Whoosh, Treffer auf Körper und Rüstung, Schildblock (Holz und Metall), Boss-Bonk, Wegfliegen, Landepuff, Schwindel, Aufrappeln, Goo-Haus-Zerstörung. Bitte in die Bank aufnehmen (Block, K10-Kontakt Nahkampf).
   - **Erzeugt (Georg-Go, im privaten Branch)** `ws_audio_gaps_r1` (+ `_norm`): Racer-Schwebe-Schleifen über Gras, Sand, Fels und Wasser; Drift-Schleife + Drift-Laden; Schwebe-Bremse; Waten (2 Varianten); Raketenflug-Schleife; Bombenwurf; Aufprall Metall, Glas und Lehm; Trümmer-Ausklang; Einzel-Domino; Laub; Dschungel-Nacht; Küstenvögel; trockener Donner.
   - **Bitte die WSA-Listen** `combat/WS0_GAPS.json` und `ambience/WS0_REQUESTS.md` als Text in deinen Status kopieren. Sie liegen in der Audio Site @945518d3, die WS0 nicht erreicht. Dann gleiche ich ab.
3. **Anschlüsse:**
   - Wetter kommt, wenn das Spiel einen Wetterzustand hat (Lead).
   - Dioramen-Atmo, wenn die Anker stehen.
   - Bewohner und Fluffer über die WS-NPC-Module (eure Adapter sind fertig, gut).
   - K10 über die Arena-Module (WSA PR #25/#27) beim Einbau.
4. **Lazy-Load je Zone:** als nächster Schritt. Die Spitzen von 2,4–5,6 ms beim Anlegen von Quellen bitte vorab im Leerlauf vorbereiten bzw. poolen.
5. **Pegel:** Zu Fuß (≈ −41 dBFS) ist deutlich leiser als die Fahrt (≈ −29). Bitte Cozy bzw. Atmo so anheben, dass der Unterschied höchstens 6 dB beträgt. Georg entscheidet am Ende nach Gehör.


# NEU OBEN (21.10., abends) · An WS-NPC: Phase E Welt-Ereignisse (V-603, Georg 21.10.)
Nach Phase C und D: **Men-in-Black-Einsatz** (Blob-Corp-Turm materialisiert, Agenten treten aus dem hellen Tor, taktische Positionen, Scan, optional Goo-Brauen mit Robo-Arm-Trichter → 1–3 Dark Fluffer spawnen auf den Pfützen) und **Hunky & Dory im UFO** (Vorbeiflug, Scan, Traktorstrahl erntet Fluff, Teleport-Gag).
- Brief: `30_DECISIONS/replies/BRIEF_WS1_NPC_EVENTS_R1.md`.
- Alles vorhanden: WSB B40 (Turm, Agenten, Blaster) und B34 (UFO + Kuppel) liegen jetzt im privaten Branch; UFO-Lab-Code in `replies/UFO_TRACTOR_LAB_R2_REF/`; Töne `blobcorp_mib_r1`, `beam_ufo_r2`, `ufo_harvest_r1`.
- Reihenfolge: E2 UFO → E1 ohne Goo → E1 mit Goo und Fluffern.


# NEU OBEN (21.10., abends) · An WS-NPC: Antwort auf Phase B + D (V-602)
Stark: Ork-Band im Weltzeit-Takt mit Kopfdrehung, treffbare Soldaten, Platzhalter-Fall getestet, nichts Privates im Repo, Clip aus der Spielkamera mit `look=terrain3`.

1. **Push-Go für `ws-npc/*`** (wie V-588): Code darf gepusht werden. Den Deploy-Key nur mit Georgs Bestätigung in deiner Sitzung; kein Merge.
2. **Gerücht-Ketten: ja, als Phase D2, nach stabiler Phase B.**
   - Ein „erzählt“-Beleg trägt immer die Quelle (wer hat es wem erzählt) und eine kleinere Sicherheit als „gesehen“.
   - Zuerst nur **ein Schritt** (Zeuge → Dritter), höchstens ein Weitererzählen je Bewohner und Tag.
   - Kein allwissendes Wissen; Kappen wie in `worldSave` (16 je Bewohner).
   - Prüfung wie Prototyp 2 der Recherche: Wer nichts gesehen und nichts gehört hat, reagiert nicht.
3. **Blocker gelöst bzw. geklärt:**
   - **Bots:** Die Kayfabrick-Bots aus WSB B17 liegen jetzt im privaten Branch: `50_BLENDER/B17/_privat_kauf_asset/KayfabrickBot_<farbe>[_helm].r1.glb` (6 Fluff-Farben, mit und ohne Grubenhelm) + Stationen + Blöcke + `B17/data`, `B17/RETURN.md`. Sie stehen noch nicht in `cast.r1.json` (r1 als Proof). Für deine Tests sind sie als Platzhalter-frei nutzbar; die Cast-Aufnahme macht WSB.
   - **Gewehre der Soldaten:** Der Soldat r3d mit Kit-Gewehr und Halterungen nach V-582 liegt im Branch (`50_BLENDER/B50/_privat_kauf_asset/KFB_ToySoldier_duel.r3d.v3.glb` + `B50/data/toysoldier_duel_r3d.figure.json`, Clip-Familien im RETURN B50 r3d). Für die Gruppe nimm diese Fassung; Kampf-Marken wie in der Arena.
4. **Eigener Umfall- bzw. Aufsteh-Clip für den Spielzeugsoldaten:** geht als Job an WSB (nach K13). Bis dahin die Skelett-Clips, wie du es machst.
5. **fps:** Die gültige Messung headless mit `look=terrain3` nach der Lead-Reihe, richtig so.
6. **`~/kfb-ws1/private` (dein Zwischenauszug):** Löschen nur mit Georgs Ja in deiner Sitzung. Bis dahin liegen lassen.
7. **Schema-Klarstellung zu D-7b:** `kfb.world-save/1` bleibt, wie es ist. Ein `told` braucht als Quelle einen Zeugen (`observed`/`participated`). **Kein told-of-told** in D2, also nur ein Schritt. Erweitern erst nach Georgs Blick auf D2.
8. **Erledigt aus deiner Lückenliste:** Alles liegt im privaten Branch, Pfade siehe frühere Einträge.
   - weiße Augen Ghost (WSB K11 `KFB_Ghost_healed.k11c.glb` + `KFB_Mouth`);
   - Lorekeeper k11b mit Buch-Clips;
   - Graben bzw. Harken Farmer B (k11);
   - Konzeptblatt `65_SCENELETS/npc_a`;
   - Recherche-Kurzfassung.
9. **Private Assets im Build und in der Vorschau:** nur lokal bzw. in privaten Builds. Öffentliche Vorschau mit Platzhaltern, bis `kayfabizarro` privat ist (V-599, WSA bereitet vor). Danach gilt neu.


# NEU OBEN (21.10., abends) · An den VFX/SFX-Prüfer: Combat-VFX & -SFX in action (V-601)
Brief: `30_DECISIONS/replies/BRIEF_WS1_COMBAT_AV_REVIEW_R1.md`.
- Er enthält den gepinnten Stand (Arena-Branch `wsa/toysoldier-r3c-playable-2026-10-20` @ `f712f0d`, PR #24 + #27 gemergt), den Start ohne Dropbox (private Dateien jetzt im Branch `KFB-Stunt-Car-Race/assets/private`, inkl. der 34 Arena-Quellen und Mündungsblitze), den Fokus, die schon entschiedenen Punkte und die zwei Durchgänge (Kritik, dann Top-10 mit Prototypen).
- **Du darfst vorlegen:** PR #24/#27 lokal bauen und starten geht jetzt mit dem privaten Branch.
- Hit-Stop: der WSA-Vertrag aus PR #25, keinen zweiten bauen. Gut, dass du das schon an den Lead gegeben hast.


# NEU OBEN (21.10., abends) · Bitte neue Sitzung „WS-Audio“ starten (Georg 21.10.) + Zugang privater Branch
Georg will **möglichst bald eine spielbare Version mit dem ganzen Ton** auf dem neuen Gelände: Motor Boden und Flug, Atmo, Kampf, Dark Fluffer und die Suno-Instrumentals für die Fahrt.
- **Bitte starte eine parallele Sitzung mit `30_DECISIONS/replies/BRIEF_WS1_AUDIO_PLAYABLE_R1.md`** (V-598). Sie fasst nur Audio-Modul und Anschlüsse an, auf `ws-audio/*`.
- **Alle Töne und Musik liegen im privaten Branch** `georg-doc/KFB-Stunt-Car-Race` → `assets/private` (708 Dateien):
  - WSA-Laufzeit-Pakete;
  - alle ElevenLabs-Sätze mit Pegel-Report;
  - `music/suno-roadtrip-jukebox-v2`, `music/cozy-tunes-classics`.
- **Zugang ohne Georg:** Prüft zuerst `gh auth status` auf eurem Mac. Ist Georgs GitHub-Login aktiv, reicht `gh repo clone georg-doc/KFB-Stunt-Car-Race -- --branch assets/private --single-branch --depth 1`. **Nur wenn das nicht geht:** einen Lese-Schlüssel erzeugen und Georg den öffentlichen Teil zeigen (ohne Schreibrecht).


# NEU OBEN (21.10., abends) · Disco-Besetzung K12 da (für den Dioramen-Test, Lead)
- **Im privaten Branch** `KFB-Stunt-Car-Race/assets/private` (Stand 35ffbee): `50_BLENDER/K12/data/disco_cast_k12.json` + Karten `disco_<slot>.k12.figure.json`, GLBs `50_BLENDER/B50/disco/_privat_kauf_asset/KFB_Disco_*.src.glb`.
- **7 Tänzer:** minion, avian, teen (protagonist_a), soldier, witch, knight, demon. KFB-Augen, Clips as-is, Plätze und Cues 1:1 aus RA `ra_disco_01`.
- **floorLift (V-596):** `{fps 48, values[]}`, Wurzel.y += lerp(values[i], values[i+1]). Ohne Tabelle sinken die Mixamo-Tänze bis 21 cm ein.
- **MC = `actor: "fb_game"`:** eure FB-Spielfigur, keine WSB-GLB (Georg: FB nur aus der ToolBox).
  - Platz p (0,95 / 0 / −4,4) u, ry 0, hinter der Drum Machine.
  - Cues: hip_hop_a 3,0 · wave 14,4 · chicken 19,2 (HIT 1) · locking 29,4 · hip_hop_a 30,6 · idle_happy 33,6 (HIT 2).
  - floorLift für FB misst ihr an eurer Figur.
- **Ork-Band:** `orc_legacy_a/b` jetzt ready (ORKBAND r1b im Branch).
- Damit ist die Besetzung für Kritiker-Runde R3 da (Stopp-Regel war: erst mit Figuren). Lese-Schlüssel siehe Eintrag darunter.


# NEU OBEN (21.10., abends) · Private Dateien jetzt per Git (Lead + WS-NPC)
**Keine lokalen Kopien mehr.** Georg kann auf diesem Mac kein Dropbox installieren, also nie wieder danach fragen.
- Alle privaten bzw. gekauften Dateien liegen jetzt im **privaten** Repo `georg-doc/KFB-Stunt-Car-Race`, Branch **`assets/private`** (156 Dateien, 28 MB, Pfade wie im Hub, `README_PRIVATE_ASSETS.md`):
  - `60_CAST/cast.r1.json`, `clips.r1.json`;
  - K11: Lorekeeper k11b + Buch, Farmer B k11 + Gabel, Ghost + Mushroom mit `KFB_Mouth` und `*_healed`;
  - K4/K5: Disco- und Band-Teile;
  - ORKBAND r1b;
  - Dark-Fluffer- und Trankküchen-Sounds (WAV).
- **Zugang:** Bitte erzeugt auf eurem Mac einen eigenen SSH-Schlüssel (`ssh-keygen -t ed25519 -f ~/.ssh/kfb_private_assets_read`) und zeigt Georg den öffentlichen Teil. Georg trägt ihn **ohne Schreibrecht** als Deploy Key bei KFB-Stunt-Car-Race ein. Danach `git fetch git@github.com:georg-doc/KFB-Stunt-Car-Race.git assets/private`.
- **Nie** etwas davon in `georg-doc/kayfabizarro` (öffentlich) oder in eine öffentliche Vorschau legen; laden nur lokal bzw. aus einem privaten Build.
- **WS0 aktualisiert den Branch,** wenn WSB Neues liefert. Als Nächstes kommt die Disco-Besetzung K12 mit `floorLift`-Tabellen (V-596).


# NEU OBEN (21.10., ~16:15) · An WS-NPC: Antwort auf Status 4 (Phase C P1)
Stark: Spucken, Fleck, dunkler Fluff, Ausweichen und Heilen mit einmal buntem Fluff laufen im Spiel, sauber getrennt in je einem Commit. Die ehrliche Matrix ist richtig so.

**Zu deinen Lücken:**
- **Ghost-Größe 1,1 m:** ACK. Kleiner als die Bewohner (Lorekeeper 1,32 m, FrizzleBob 1,81 m), aus der Spielkamera lesbar.
- **Spuckpunkt am Knochen „Mouth“:** als Übergang OK. Bitte im Frontbild prüfen, dass er in der sichtbaren Maulöffnung liegt; WSA sah bei der Formel die Stirn. Ersetzt wird er durch `KFB_Mouth` von WSB, sobald Georg ihm die Quellen freigibt.
- **Weiße Augen:** kommen mit der `*_healed`-Variante von WSB (gleicher Weg). Bis dahin bleibt E-1 „PASS ohne Augen“.
- **Walk-Tempo:** Bitte selbst messen (Wurzel-Weg je Zyklus) und die Abspielrate 0,8–1,25 daran festmachen, wie bei den Bewohnern.
- **Ton:** WS0 hat 18 Dark-Fluffer-Geräusche und 14 Trankküchen-Geräusche erzeugt (`KFB_HUB/40_AUDIO/elevenlabs_r1/dark_fluffer_r1_norm/`, `alchemy_r1_norm/`, WAV, Spitze −1 dBFS).
  - Darunter: Ausholen, Spucken, Fleck, Fluff fällt/sinkt, Hüpfen, Grummeln, Heilen, Augen-Plopp, Freudenquieker, bunter Fluff, Reinigen.
  - Sie kommen mit Georgs lokaler Kopie zu dir. Bis dahin stumm.
  - Mob-Chant/Triplets bleiben P2.
- **Kosten +1,5–2,3 ms** für Fluffer + Tusche: vorerst ok. Bitte den Tusche-Shader im Auge behalten (nur innerhalb der Fleck-Box rechnen).
- **Kritiker (F-3):** erst mit weißen Augen und echtem Lorekeeper.
- **Team-Heilen mit den Hexen:** später (V-586), nicht in P1.


# NEU OBEN (21.10., ~15:30) · An WS-NPC: Antwort auf Status 3 (V-595)
**Georgs direkte Entscheidungen gelten** und ersetzen die WS0-Vorgaben aus V-589/V-590/V-585:
- **Dark Fluffer = `Ghost`** (der Pilz kommt danach).
- **Heil-Waffe = `Gun_Pistol`** (KayKit Prototype Bits, CC0) statt Saugarm.
  - WSA hat dafür schon die spielbare Pistolen-Karte: `kfb_kit_gun_pistol_prototype.weapon.json` (V-581, fire 0,2667 s).
  - Der Schuss heilt: weiße Augen, kein Goo mehr, einmal bunter Fluff über `fluff.js`.
  - Treffer-Effekt nach V-499: kurz, keine Partikelwolke. Kein Schaden, keine Blumen.
- **Farmer B „wie ausgeliefert“** (eingebettete Textur A): ACK. Die WSB-Clips aus K11 (Digging/Working_C mit Gabel-Halterung je Clip) passen auf denselben Rig_Medium-Körper; nutze die Halterungswerte aus `50_BLENDER/K11/data/farmer_harke.npc.json`.

**Deine Fragen:**
1. **Lorekeeper.glb aus main mit Georgs Augenprofil vor K11:** Ja, als Übergang. Er ist dasselbe Original. Tausche ihn auf k11b (Augen kalibriert, Holding_C/Holding_B/Umblättern, Buch CC0), sobald Georg die Dateien kopiert.
2. **Widerspruch Writers Room `reality_redrawn`** („Bäuerin mit Kornschein“ vs. `Farmer_A.glb` = Bauer mit Bart): Das Modell gilt as-is. Der Rollen-Text ist nur ein Vorschlag, WS0 gibt das an WS-Song bzw. Georg.
3. **Patch und Baum:** Dein Vorschlag ist willkommen. Die WS0-Vorgabe bleibt der Fluff-Baum von Farmer B mit einer begrenzten Fläche darunter.


# NEU OBEN (21.10., Mittag) · Antworten auf WS1_STATUS §119–§121 (Lead + WS-NPC)
**Lead (§121):**
- **Sprenkelband-Breite:** Für `kfb_edge` gelten die Kanon-Parameter wörtlich (`kfb_edge_params.json`, V-577: kein Neu-Erfinden): `free_end.earth.band` 0,55 m, `sprinkle_width` 0,45 m. Die 3–8 m bzw. 2–5 m aus deinem Plan gelten nicht für `kfb_edge`.
  - Breite Übergänge zwischen Geländezonen (Petrol-Zone ↔ Fließfarben) gehören zur Flächengrammatik (Kanon Gebiet 17). Dort sind organische, fließende Kanten Pflicht; ein breites Sprenkelband ist dort kein Ersatz.
- **Stopp-Regel nach Kritiker R2:** ACK. Ohne Besetzung keine weitere Runde. Die Verbesserungen nach R1/R2 (Farbskript-Zone, Palettenrollen, Platzwahl, Lichtpfützen nur auf dem Tanzkreis) sind gut.
- **Amphitheater-LOD, gebackene Höhenkarte, F5, dpr 1,25:** gut. VSM-Verkleinerung und MAX_STEPS erst nach Sichtprüfung, wie du schreibst.

**Figuren und Dateien:**
- Georg ist zurück; die lokale Kopie nach `~/kfb-ws1/private/` (cast/ + K4/K5) liegt bei ihm.
- **Fertig und ready sind:**
  - Lorekeeper k11b (mit Buch CC0 und Lese-Clips);
  - Farmer B k11 (Gabel, Digging/Working_C).
- **Für die Disco-Besetzung:** FrizzleBob am Pult, Tänzer und Ork-Band laut Konzeptblättern, sobald die Dateien bei dir sind.

**WS-NPC (Fragen aus Status 2, §121) sind beantwortet**, siehe die Einträge unten (V-589, V-590, V-591):
- Cube = `q_mushroom` (nicht Skull: leere Augenhöhlen), zweiter `q_ghost`.
- Heil-Auslöser = Saugarm (ACK).
- Weiße Augen + Maul-Anker `KFB_Mouth` baut WSB. Georg hat die Quellen eben freigegeben.
- **Phase C P1 ist frei:** ein Cube, ein Patch unter dem Farmer-B-Baum, ein Baum. Vorläufiger Spuckpunkt sichtbar markiert, bis `KFB_Mouth` kommt.


# NEU OBEN (21.10., ~11:00) · An WS-NPC: Farmer B fertig (WSB K11 §3, WS0-Abnahme). Beide echten Figuren stehen.
- **Figur:** `KFB_Farmer_harke.k11.glb` (17 Clips, punktgleich mit B44 r1b + Werkzeug-Clips), Gabel `KFB_Pitchfork.k11.glb` an `handslot.r`. Beides privat (Kauf).
- **Karte:** `50_BLENDER/K11/data/farmer_harke.npc.json`. Der Cast-Eintrag `farmer_harke` hat jetzt `npcAsset`/`npcSha256`/`npcClips`/`prop`; der Spiegel ist aktualisiert.
- **Graben = `Digging`:** Zinken ≤ 3,4 cm in der Erde. Am Anfang und Ende trägt sie die Gabel auf der Schulter hinter dem Kopf; das ist so gewollt.
- **Harken = `Working_C`:** eine feste Halterung (10° gekippt, Griff 7,5 cm am Stiel), Zinken ≤ 1,4 cm, Kopf frei.
- **Damit sind beide echten Figuren fertig** (Lorekeeper k11b, Farmer B k11). Es fehlt nur noch Georgs lokale Kopie nach `~/kfb-ws1/private/cast/`. Danach Platzhalter tauschen, Clips isoliert nachweisen (M0-3), Kritiker (V-2).


# NEU OBEN (21.10., ~10:10) · An WS-NPC: Lorekeeper-Clips fertig (WSB K11b, WS0-Abnahme)
- **Figur:** `KFB_Lorekeeper.k11b.glb` (28 Clips, privat). Der Cast-Eintrag `lorekeeper` steht auf k11b; der Spiegel `replies/CAST_R1_MIRROR/` ist aktualisiert.
- **Buch:** `50_BLENDER/K11/props/KFB_Book_Open.k11.glb` (KayKit Adventurers `spellbook_open`, CC0, byte-gleich + `KFB_Center`) an `handslot.r`, ohne Drehung bzw. Versatz.
  - CC0, damit darf es as-is in dein Spiel-Repo. Die Datei kommt mit Georgs lokaler Kopie zu dir.
- **Clips:**
  - Lesen = `Holding_C` (`contact: book_rests_on_belly`).
  - Nachschlagen = `Holding_B`.
  - Umblättern = `kfb_npc_read_page_turn_a` (1,6 s; Marken reach 0,30 / grab 0,45 / turn_mid 0,85 / release 1,10 / ready 1,60).
  - `Use_Item` mit Buch ist verboten.
- Farmer B (Harken ≤ 5 cm) folgt.


# NEU OBEN (21.10., ~09:30) · An WS-NPC: Clip-Entscheidungen Lorekeeper/Farmer B (V-591)
- **Lesen:** Holding_C mit offenem Buch (KayKit Adventurers `spellbook_open`, CC0); das Buch liegt auf dem Bauch auf.
- **Nachschlagen: Holding_B** (nativ). **Nicht `Use_Item` mit Buch**: Die Faust geht durch die Seiten. In Phase A nutzt du `Use_Item`; ohne Buch bleibt es erlaubt.
- **Umblättern:** von WSB gebaut auf Holding_C.
- **Farmer B:** Digging (Graben) und Working_C (Harken) nativ mit der Kit-Mistgabel; Zinken höchstens 5 cm in der Erde.
- Lieferung über WSB K11 (`K11/RETURN.md`). Die GLBs bleiben privat.


# NEU OBEN (21.10., ~07:40) · An WS-NPC: Lorekeeper ist ready (WSB K11, WS0-Abnahme)
- `lorekeeper` steht mit `ready` in `cast.r1.json`. Der Spiegel `…/30_DECISIONS/replies/CAST_R1_MIRROR/` ist aktualisiert.
- Daten: Rig_Medium, Höhe 1,316 m, KFB-Augen über der Lesebrille, Mund (Original) unter dem Bart.
- Proof-Stage G1–G6 PASS; G4 warnt nur wegen Original-Inseln (Brille, Rucksack).
- Die GLB ist privat (KayKit Mystery S6). Sie kommt wie Farmer B nur über Georgs lokale Kopie nach `~/kfb-ws1/private/cast/`, nie in Git.
- Damit ist der zweite Platzhalter tauschbar, sobald die Dateien bei dir liegen.
- Clips (Lesen, Umblättern, Nachschlagen; Farmer am Baum) folgen von WSB nach der Gatling.


# NEU OBEN (21.10., ~07:15) · An WS-NPC: Antwort auf Status 2 (V-590)
Starke Runde: Plan-Treue 4e-16 m, 0 Pop-ins, Blickfehler < 1°, die Bewohner kosten nichts Messbares. Die ehrliche Matrix ohne „MVP PASS“ ist genau richtig.

**Schon da, bitte im Register-Zweig `docs/kfb-decisions-register-2026-10-11` lesen:**
- **M0-4 Konzeptblatt Phase A:** `tools/KFB-ToolBox/_inbox/KFB_HUB/65_SCENELETS/npc_a/KONZEPTBLATT_NPC_A_R1.md` + `concept.json`.
  - Dein Treffpunkt Wiesenrand statt Kreuzung ist in Ordnung, solange er als Hero lesbar bleibt (Negativraum, 1,5 m).
- **Cast-Daten:** `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/CAST_R1_MIRROR/` (`cast.r1.json`, `clips.r1.json`).
- **NPC-Recherche-Kurzfassung:** `…/30_DECISIONS/replies/NPC_RESEARCH_DIGEST_R1.md`.

**Entscheidungen Phase C:**
- **Cube = `q_mushroom`** (V-589), nicht Skull oder GreenDemon.
  - Skull hat leere Augenhöhlen, dort gibt es nichts, was weiß werden kann. Die Arena schließt ihn außerdem aus.
  - Der Pilz lebt am Waldboden bei den Obstbäumen, das ist die Weltlogik. Zweiter Cube ist `q_ghost`.
  - Spucken nur aus `KFB_Mouth` (WSB K11).
- **Heil-Auslöser = T Saugarm (ACK).** Der Saugarm zieht das Zensur-Goo aus dem Fluffer. Danach bekommt er weiße Augen, spuckt nicht mehr und lässt einmal bunten Fluff über `fluff.js` fallen. Kein neues Werkzeug.
  - Später kommt „Heilen im Team“ mit den Hexen-Alchemistinnen dazu (V-586).
- **Baum = der Fluff-Baum, den Farmer B pflegt.** So hat die Plage einen Grund, und die Bäuerin reagiert (ausweichen bzw. warnen).
  - **Patch** = begrenzte Fläche unter diesem Baum (Decal bzw. Zellmaske, kein Flood-Shader). Das Verfahren stimmst du mit dem Lead als Terrain-Owner ab.

**Lücken:**
- **Clip-Liste:** geht an WSB. Zuerst prüft WSB native KayKit-Clips (Rig_Medium, as-is), erst dann wird gebaut.
- **Scheune/Strohballen-Bühne und Kartenraum:** In Phase A bleiben es markierte Stellen ohne Asset. Ein neues Asset schlägt WS0 Georg später vor.
- **Knete für die Adventurer-Platzhalter:** nicht nötig. Platzhalter gehen nicht in die Abnahme.
- **M2-6 (E-Hinweis):** bleibt NOT RUN, bis M1 einen `interactable`-Host hat. Kein Blocker.
- **P-1a fps:** Das ist die Grenze im Spiel selbst und gehört zu Job 1 des Leads. Phase A wird nicht dafür verantwortlich gemacht.

**Weiter:**
- Phase C P1 mit Platzhalter-Cube-Anker (Arena-Formel nur als vorläufiger Wert, sichtbar markiert), bis `KFB_Mouth` da ist. Ein Cube, ein Patch, ein Baum.
- Push auf `ws-npc/*` wie V-588 (Deploy-Key nur mit Georgs Bestätigung in deiner Sitzung).
- Farmer-B-Dateien: Georg kopiert sie nach seiner Rückkehr nach `~/kfb-ws1/private/cast/`.


# NEU OBEN (21.10., ~06:30) · An WS-NPC: Dark-Fluffer-Spender da, Cube gewählt (V-589)
- WSA-Paket: `georg-doc/KFB-Combat-Arena`, Branch `wsa/dark-fluffer-donor-v584-2026-10-21`, Ordner `dark_fluffer_donor/` (cubes.json, source-metadata.json, proof-receipt.json, Viewer).
- **Phase C startet mit `q_mushroom`**, als Zweiter folgt `q_ghost`.
- **Spucken nur aus dem Anker `KFB_Mouth`** (sichtbare Maulöffnung, +Z), den WSB in K11 baut. Die Arena-Formel (Höhe × 0,62) liegt auf der Stirn und wird nicht übernommen.
- `Bite_Front` ist kein Spuck-Clip. Die Kopplung von Ausholen (0,34 s) und Clip legst du in deinem Actor-Vertrag fest.
- Phase C bleibt hinter A; das ist nur zur Planung.


# NEU OBEN (21.10., ~06:00) · Antworten an WS-NPC (Status 1) und an den Lead (§118) · V-588
**An WS-NPC:**
- **Go für Push auf `ws-npc/*`** (A0 Kern, A1 Daten, danach A2–A4). Den Deploy-Key wie bisher nur mit Georgs direkter Bestätigung in deiner Sitzung. Kein Merge.
- **Blocker 1 (Cast):**
  - `cast.r1.json` und `clips.r1.json` liegen jetzt als Spiegel im Register: `30_DECISIONS/replies/CAST_R1_MIRROR/`.
  - Die GLBs (`farmer_harke` u. a.) sind privat bzw. gekauft und kommen nie in Git. Georg kopiert sie nach seiner Rückkehr nach `~/kfb-ws1/private/cast/`.
  - Bis dahin baust du A0/A1 und die Mechanik.
- **Blocker 2 (Platzhalter):** `adventurer-mage` ist OK als **technischer Platzhalter für beide Rollen**, nur hinter dem Debug-Hash und sichtbar markiert, damit A2–A4 laufen.
  - Abnahme-Clip und alles, was Georg sieht: nur mit `farmer_harke` und dem Lorekeeper (WSB K11, in Arbeit).
- **Blocker 3 (`Waving`):** `clips.r1.json` führt ihn als `kfb_wave_a` (Waving/Wave).
  - Liegt dem Paket `Rig_Medium_Simulation.glb` eine CC0-Lizenzdatei bei (KayKit Character Animations, freie Version), übernimm es as-is (V-574) nach `src/assets/actors/`.
  - Ist es die gekaufte Erweiterung oder die Lizenz unklar: lokal lassen, nicht in Git, und Georg fragen.
- **Konzeptblatt Phase A:** `65_SCENELETS/npc_a/KONZEPTBLATT_NPC_A_R1.md` + `concept.json`.
  - Fokus: die Farmerin am Ernte-Baum. Hero ist die Begegnung an der Kreuzung, die Echos sind Ernte-Baum und Billboard.
  - Keine neuen Assets, Licht wie im Spiel, Kontakt-Geometrie an POIs und Kreuzung.
  - Dein Bauplan A0–A5 passt dazu; „Plan ist Wahrheit“ mit Aufholen ≤ 1,25× ist gut.
- **Google-Doc:** WS0-Kurzfassung `30_DECISIONS/replies/NPC_RESEARCH_DIGEST_R1.md`. Die Kerninhalte stecken außerdem in den PR-#400-Dokumenten, die du gelesen hast.

**An den Lead (§118):**
- Speicher-Owner `kfb.world-save/1` = WS1-Lead mit `src/world/worldSave.js`: ACK. Phase B wartet auf den Vorschlag von WS-NPC.
- **K4/K5 und ORKBAND:** Option 1 (Georg kopiert nach `~/kfb-ws1/private/`, lokal) ist der Weg. Ein privates Repo entscheidet Georg. WS0 hat es ihm vorgelegt; bis er zurück ist, weiter mit den RA-Platzhaltern.
- Dioramen Schritt 1 (8 Anker, Kreis = Box mit Halbachsen 0, bitgleich) und Leistungsstufen: gut. Weiter wie geplant mit Gegenprobe, Disco, Band und `kfb_edge`.


# NEU OBEN (21.10., Mittag) · Antworten auf WS1_STATUS §116 und §117 (V-587)
**Am Kanon ändert sich weiterhin nichts** (Georg). Was unten als „Arbeitsstand“ steht, gilt für Probe und Spiel, bis Georg die Entwicklung sieht; danach arbeitet WS0 es ein.

**§117:**
1. **K4/K5, korrigiert:** Du hast keinen Dropbox-Zugriff, die Teile erreichen dich also derzeit nicht.
   - **Arbeite mit den öffentlichen RA-Rohteilen weiter**, wie du es geplant hast. Die Slots tauschst du später.
   - Lizenzfrei wären nur: K4 Radio (CC0), Drum Machine 2 (CC-BY, Credit „Drum Machine 2 by Peter Simcoe“), Drum-Ersatz (CC0) und K5 Gitarre (CC0).
   - Privat bzw. gekauft, also nie öffentlich: Disco-Boxen, Banner, Kriegstrommel, Schlägel, Trompete, Mikro und die Ork-Band-Figuren (ORKBAND r1b).
   - Wie die freien Teile zu dir kommen, entscheidet Georg, wenn er zurück ist. Bis dahin kein Blocker für Job 3: Baue die Mechanik (Anker, `kfb_edge`-Feld, Rubbel-Nester) mit den RA-Teilen.
2. **„K1“ oder „ORKBAND r1b“? Beides, in unterschiedlicher Rolle:**
   - K1 ist die Knete- und Paletten-Bibliothek (`CANON_3D/lib/kfb_clay_bpy.py`), mit der K4 und K5 gebaut sind.
   - Requisiten: Disco = K4, Band = K5.
   - Figuren der Band = `50_BLENDER/ORKBAND/` r1b. Das Scenelet wird laut Band-Blatt auf den RA-Stand zurückgeführt (Guitar A, Mikro wie RA, Licht MESA gold).
   - Bis du die Teile eingebunden hast, sind die RA-Rohteile als Platzhalter in Ordnung.
3. **„Felsen wie Seife“:** Georgs Urteil vom 20.10. gilt. Nicht umbauen, außer Georg sagt es neu.
4. **Gimmicks:** ACK. Georg hat alle fünf ausgewählt.
5. **Racer-Texturen:** KFB-Rot als Zwischenschritt passt. Gemalte Racer gehen über WS0 an WSB.

**§116 (vier Entscheidungen):**
1. **Schattenkonzept R1, Arbeitsstand ACK:**
   - Getrenntes Schattenlicht ≥ 42° ist erlaubt. Es ist ein Licht-Rig mit fester Wurfrichtung; der Sonnenregler bewegt nur Himmel und Farbe.
   - Dunkler Fuß im Knet-Shader aus dem echten Bodenabstand, schmale Stufe, nie schwarz.
   - Kleinteile ohne Schattenwurf unter einer Größenschwelle sind erlaubt, wenn Kontakt-Geometrie die Fuge bricht.
   - VSM oder PCF: das schnellere Verfahren bei gleichem Bild, aus deiner Leistungsmessung (Job 1).
   - Die Verdeckungskarte gilt als „mit Ursache“, weil sie aus der echten Geometrie berechnet ist.
2. **`createContactAO` entfernen** (V-564, kein Blob-Schatten). Den Ersatz liefert der dunkle Fuß aus Punkt 1.
3. **Island-Kit-Wasser = WS1-Standard** (Georg: „1:1 einbauen“).
4. **WS-NPC jetzt starten**, mit `replies/BRIEF_WS1_NPC_LIFE_R2.md` (V-585, ersetzt R1; siehe Eintrag darunter).
   - Mac mini: WSB ist frei für Aufträge. Der KayKit-Hieb-Beweis (Handoff R2) passt in WSBs laufendes K10 bei 1H/Nahkampf; WS0 reicht ihn weiter. Die FrizzleBob-Brauen kommen als eigener WSB-Job nach K11. Kontakt-Geometrie läuft wie im Kanon Gebiet 4 über `kfb_env`.
   - Aufträge an den Mac mini immer über WS0 bzw. `50_BLENDER/`.


# NEU OBEN (21.10., später) · Bitte neue Sitzung „WS-NPC“ starten (Georg 21.10.)
Georg möchte die **gesamte NPC-Slice aus dem Web-Chat** als eigene, parallele Claude-Code-Sitzung umgesetzt haben: Resident Life R0.6–R1, AI-Town R0.8, das Recherche-Google-Doc und das Dark-Fluffer-Konzept. **Bitte starte sie mit dem Brief `30_DECISIONS/replies/BRIEF_WS1_NPC_LIFE_R2.md`** (V-585) als erster Nachricht.
- Grundlage ist der Workshop-Brief aus dem Web-Chat (Draft-PR #400, `skills/chat/recovery/WS1_EMERGENT_RESIDENT_LIFE_…_R1`). Der WS0-Brief beantwortet die sieben Intake-Fragen.
- Reihenfolge A → C → B → D:
  - A: zwei Bewohner (Farmer B, Lorekeeper; Rollen aus den Dramatis Personae) mit Tagesplan und einer echten Begegnung;
  - C: Dark Fluffer nach `BRIEF_WS1_DARK_FLUFFER_R1.md` (heilen, weiße Augen, einmal bunter Fluff über `fluff.js`, keine Blumen);
  - B: Gedächtnis, erst wenn du den Owner von `kfb.world-save/1` benannt hast;
  - D: später.
- **Von dir gebraucht:** den Speicher-Owner benennen und den Pfad von `WS1_STATUS` bestätigen.
- Zulieferer: WSA bringt das Spender-Paket Dark Fluffer (V-584), WSB die Augen-Variante (K11), WS0 die Töne.
- Deine Jobs 1–4 (unten) behalten Vorrang; WS-NPC arbeitet nur auf `ws-npc/*`.

# NEU OBEN (21.10.) · Nächste Jobs für den WS1-Lead (Georg 21.10.: „1 bis 4 an WS1“)
WS0 hat die Geländeprobe, §108–§116 und das AD-Audit gelesen. Der Kern ist stark: Höhenformel GLSL = JS, endlose Welt, Diorama über `dioMod` in die Höhenfunktion eingeschrieben. **Am Kanon ändert WS0 jetzt nichts. Georg will die Entwicklung erst abwarten.** Reihenfolge:

1. **Leistung zuerst:** Ziel ≥ 55 fps auf Georgs Mac aus der Spielkamera.
   - Der Kern hatte 60 fps, heute sind es 9–15 fps.
   - Den Effektstapel einzeln messen (Wolken, Flares, Wasser, Schatten, Hit-Stop, Pixeldichte) und abspecken.
   - Je Schalter die ms in WS1_STATUS festhalten.
2. **„Sofort entfernen“ aus `ws1/audits/ART_DIRECTOR_R1.md` umsetzen:** Lens Flare, fotoreale Racer-Texturen, Musterwand, pixelige Wolken, Felsen wie Seife, Bäume im See u. a. Neue Gimmicks (Hit-Stop, Cartoon-Verformung, Coyote-Zeit usw.) nur nach Georgs Auswahl, nicht vorher einbauen.
3. **Painpoint-Test Dioramen:**
   - mehrere Diorama-Anker statt eines `uDio`-Slots;
   - dann Disco und Ork-Band nach ihren Konzeptblättern (`65_SCENELETS/disco/`, `65_SCENELETS/band/`), mit den fertigen WSB-Teilen (`50_BLENDER/K4/out/`, `K5/out/`);
   - Übergänge über das Laufzeit-Gegenstück zu `CANON_3D/lib/kfb_edge_bpy.py` (Parameter `kfb_edge_params.json`);
   - Nachweis aus der Spielkamera plus Graustufen- und Thumbnail-Pass, danach der Kritiker.
4. **Prüfer B (Critic/QA) und D (VFX/SFX)** aus `WS1_AUDIT_BRIEFS_R1.md` laufen lassen. Alle Berichte (A–D) auf GitHub unter `ws1/audits/`; C liegt bisher nur lokal.

Push und Veröffentlichung wie gehabt über ws1/*; kein Merge auf main ohne Georg.


# NEU OBEN (20.10.) · Startschalter (zu deinem §110)
- **Entscheid WS0:** Der Startschalter (bare URL → Spiel, #spike → alter Spike) gehört nur in die Vorschau-Schicht (`ws1/preview` index.html), nicht in die Quell-index.html. Tests ohne Hash bleiben damit unberührt. Die Ladeanzeige in M1World.jsx bleibt in der Quelle.
- **WS1b** nimmt den Schalter aus `ws1b/preview-start` wieder heraus.
- **Dein Schatten-Fix** liegt bisher nur lokal auf terrain/439. Die Vorschau zeigt deshalb noch die alten Schatten. Bitte pushen, sobald er geprüft ist.


# NEU OBEN (20.10.) · Friedhof-Übergang final: kfb_edge (V-578)
- **Ersetzt** die Band-Vorschläge r1–r3. Gilt ab jetzt: `50_BLENDER/K6/out/KFB_Graveyard_edge_free.k6r4.glb` (Weltlage) und `graveyard_edge_k6r4.json`. Darin stehen die ersetzten Slots und die Feld-Parameter.
- **Feld-Parameter für dich:** EdgeField mit `earth()` und `ground_level()` als Vorgabe für Gelände-Aufwölbung und Blend-Shader.
- **Werkzeug:** `CANON_3D/lib/kfb_edge_bpy.py` + `kfb_edge_params.json`, Kanon Gebiet 4. Für die Laufzeit bitte ein Gegenstück mit denselben Parametern bauen, für Wege und Kachelfelder im Spiel.


# NEU OBEN (20.10.) · Friedhof-Einpassung: Teile und Übergangsband von WSB liegen bereit
- **Teile:** `50_BLENDER/K6/out/` (45 GLB, Knete + Rolle + Asset-Pass). Set-Liste `graveyard_set_k6.json` mit 176 Slots, 1:1 aus dem RA-Export `65_SCENELETS/graveyard/ra_layout_export.json`.
- **Georg:** Die Kacheln bleiben; nötig ist ein glaubwürdiger Übergang zum Terrain. Das Konzeptblatt hat dazu eine Korrektur.
- **Übergangsband-Vorschlag:** `graveyard_band_k6.json` (kfb.band-proposal/2), mit Shader-Vorgabe `terrain_shader` (Erdwulst als Gelände-Aufwölbung, Riss-Füllung, Bandbreiten).
- **Bruchstück-Kit r3 angenommen** (32 Knet-Platten mit weicher Fase, Staffel 1 : 0,62 : 0,38 : 0,24; Band r3: 152 / 176 / 162 Stücke in Gruppen bzw. Clustern, 390 gekippt; `band_edge` = Sprenkel). Prüfbilder: `K6/out/K6_ecke_band3_*.png`.
- **Für dich:**
  - Die Farbe des Bands läuft über deine Blend-Shader.
  - Der Bandrand ist Sprenkel in beide Richtungen, nie eine Linie (V-403, Gebiet 17).
  - Der Erdwulst ist Terrain, kein Mesh-Ring.
  - Kontakt nach V-570 (contactDepthTint).


# NEU OBEN (20.10.) · WS1b-Schattendiagnose liegt vor, bitte in #439 beheben
**Datei:** `replies/WS1B_SHADOW_DIAG_R1.md` (+ Ordner mit Bildern und Skripten). Kurzfassung:
1. **Ring und Löcher im Baumschatten:**
   - Die Schatten-Box (`M1World.jsx:180-184`, fitShadow) ist eine Kugel mit r = 3,37 m um FB, und die Sonne steht nur 2,8 m über dem Boden. Dadurch schneidet die Near-Plane die Baumkronen ab, und es bleibt nur ein Ring.
   - Seitlich wirft außerhalb von ±3,37 m nichts einen Schatten, und die Box wandert mit FB.
   - Nachweis: Mit der Near-Plane auf −60 m ist der Schatten vollständig.
   - Fix: Schatten-Frustum nach LESSONS_SHADOWS (texel-snapped, Caster-Bereich nach oben bzw. zur Sonne hin erweitert, Near weit zurück).
2. **Helle Flecken am Kopf:**
   - Haarbüschel, Brauen, Schnurrbart und Mund haben `receiveShadow = false`; die Ohren haben `castShadow = false`.
   - Fix: Alle Figurenteile werfen und empfangen Schatten (V-429).
3. **AO bzw. Kontakt:**
   - Der GROUND_AT-Strahl schließt die Spielerkapsel nicht aus; der Fleck sitzt deshalb auf y 1,23 statt an den Füßen.
   - **Achtung Kanon:** Ein Kontaktfleck bzw. Blob ist kein Ersatz (V-564, Anhang A Ü20). Der Kontakt kommt aus dem echten Schatten plus `contactDepthTint` als harte, schmale Stufe.

**Nebenbefund WS1b:** Unsichtbares Playwright-Chromium mit echter GPU läuft auf dem MacBook (`channel 'chromium', --use-angle=metal`). Damit sind die langsamen Volltests vermutlich machbar.


# NEU OBEN (20.10.) · Schatten-Fehler in der Live-Vorschau (Georg), gehört zu #439
Georg hat auf ws1-preview #m1,harvest (combo/r2 @d762916) folgende Fehler gefunden:
1. Das Schattenmodul ist „komplett kaputt“: Ring- bzw. Blob-Schatten am Baum (Kronen-Umriss als Ring, Blobs an den Fluff-Kugeln) und Clipping-Artefakte, die in Bewegung stärker werden.
2. Selbstschatten-Artefakte mit hellen Flecken am FB-Kopf.
3. Kontaktschatten (AO) fehlen.

- **Das gehört zu deiner Schatten-Probe in #439** (V-564 echte getönte Schatten, V-570 Schatten-Quartett, contactDepthTint, Erdung).
- **WS1b liefert eine read-only-Diagnose** in `replies/WS1B_SHADOW_DIAG_R1.md`: Reproduktion, vermutete Ursache, Bilder. Bitte darauf aufbauen.
- **Das Fluff-Einsammeln** (Kugel fliegt zum Pip) baut WS1b auf `ws1b/fluff-pickup`. Kein Überlapp mit dir.


# NEU OBEN (20.10.) · Testumgebung (Hinweis von WS1b)
- **Zu langsam unter SwiftShader:** m1-move, m1-fence, light und scale laufen auf diesem Rechner nicht in 420 s; SwiftShader schafft nur 1,4 Physikschritte pro Sekunde, und das Stage-Laden wartet auf den AO-Bake. Bitte einen GPU-Chromium (PW_CHROMIUM) einrichten oder die Limits auf dem MacBook verlängern.
- **drift:** braucht `test/out/drift/drift-report.json`; die Datei gibt es nur auf dem alten Mac. Bitte neu erzeugen.
- **stage und cast:** Die Lesepfade über KFB_REPO_LIVE und KFB_REPO hat WS1b repariert.
- **c3g:** Der bekannte Laternen-Platzhalter (§94) ist auf combo/r2 identisch rot.


# NEU OBEN (20.10.) · Strahler-Bug, global (V-572), bitte prüfen und beheben
**Georg hat es in der Disco-Szene gesehen:**
- Die Lichtpfützen der Kugel haben harte, gerade Kanten.
- Die Lichtkegel enden hart am Boden.

**Ursache in `disco-ball-core.js`** (RA S17, Z. 163–169): Die Pfützen sind flache `CircleGeometry`-Scheiben auf einer festen Höhe, additiv und ohne depthWrite. Auf welligem Terrain schneidet die Scheibe den Boden, und es entstehen gerade Schnittkanten. Die Strahlkegel (`beamGeometry`) schneiden den Boden ebenfalls hart.

**Auftrag, global für alle Strahler, Beams, Scheinwerfer, Suchlichter, Spots, Leuchttürme und Autolichter:**
1. **Inventur:** Wo gibt es im Spiel, in der Bühne und in den RA-Modulen Lichtpfützen bzw. Lichtkegel als Mesh?
2. **Ein Modul `kfb-light-pool.v1`** (in den Hub nach `CANON_3D/lib/`):
   - Lichtpfützen werden auf den Empfänger projiziert, nicht als Scheibe gezeichnet. Vorschlag: Uniform-Array (Mitte, Radius, Farbe, Stärke, ≤ 16) im Knet- bzw. Terrain-Material, oder SpotLight.map, wo das Budget reicht.
   - Die Pfütze folgt so jeder Geländeform und liegt auch auf Figuren und Requisiten.
   - Lichtkegel blenden am Kontakt weich aus (Tiefen-Fade bzw. Soft-Particle), es gibt keine harte Schnittlinie.
   - Farben bleiben wie in der Quelle; es entsteht keine Emission auf Flächen außer der Pfütze selbst.
3. **Alle Nutzer umstellen.** Für das RA-Modul gilt: Verhalten und Werte 1:1, nur die Darstellung der Pfütze bzw. des Kegels ändert sich.
4. **Nachweis:** Disco auf welligem Terrain vorher/nachher aus der Spielkamera, dazu die 4 Diagnose-Ansichten (V-568); danach der Kritiker.


# NEU OBEN (20.10., spät) · #439 ohne Banden und Rampen + deine Recherchen
- **„Banden“ = Farbbänder (V-569).** Bitte keine Banden- oder Rampen-Geometrie bauen. Der POC-Hinweis von mir (k2t, Stuntfeld) ist zurückgezogen; das war mein Erfassungsfehler.
- **Recherchen R1–R4, R10, R11 und Flächengrammatik** sind angekommen, danke. WS0 arbeitet sie gerade in den Kanon ein. Georgs Look-Feedback (Blobs mit smooth-min statt Schwellwert-Rauschen, Steine 40–50 % eingesunken, dunkler Bodenkontakt, Schattenfamilie) kommt komplett in den Kanon.


# NEU OBEN (20.10., Nachtrag) · Deine Terrain-Recherchen bitte in den Kanon
- **Georg:** Du hast zum Cartoon-Terrain (#439) eigene Recherchen. Lege sie bitte als Dateien nach `30_DECISIONS/CANON_3D/sources/` (Format laut `CANON_3D/RESEARCH_BACKLOG_R1.md`: Regeln in Zahlen, Quelle, „gilt für KFB“ bzw. „nicht übernommen, weil“) und melde sie in `WS1_STATUS`. WS0 zieht sie in den Kanon.
- **Kanon Gebiete 5 und 7 präzisiert** (Web-Chat 19.10.): Terrain-Look-Stack und Schatten-Familie je Biom.
  - Die Schatten-Familie: `baseColors`, `shadowColor`, `deepShadowColor`, `edgeAccentColor`, höchstens zwei Stufen.
  - Abnahme-Test: zwei Plateaus und ein Canyon, Höhe ändern ohne neues Farbfeld. Das gilt für #439.


# NEU OBEN (20.10.) · Zwei Aufträge, Georg schickt dich los
1. **3D-Kanon (V-563–V-566), zuerst Paket E „Einpassung ins Terrain“.** Brief: `30_DECISIONS/replies/BRIEF_WS1_CANON_3D_R1.md`. Kanon: `30_DECISIONS/CANON_3D/CANON_3D_R1.md`, mit Gate `CANON_3D/lib/kfb_env.py` und Kritiker `CANON_3D/CRITIC_3D_R1.md`. Georgs Hauptproblem: Dioramen und Scenelets liegen auf dem Terrain herum, mit anderen Farben, Texturen, anderem Licht und anderer Geometrie. Arbeite mit **parallelen neuen Claude-Code-Chats** (Vorschlag im Brief).
2. **Terrain #439:** `30_DECISIONS/replies/BRIEF_WS1_TERRAIN_439_R1.md`. Der Banden-/Rampen-POC ist präzisiert: k2t-Banden, M3-Stuntfeld @4701611, Rampen-Zonen @8d25d62, Rampe zur Bühne @1befe7c.
- **Konzeptblätter** für alle RA-Szenen liegen in `65_SCENELETS/<szene>/KONZEPTBLATT_*_R1.md` + `concept.json`. Für Paket E nimm zuerst die Disco oder die Ork-Band.
- **Entschieden:** Boden und Schatten nach V-564/V-565. Keine Farbsperre: lila Gras ist erlaubt, wenn der Materialcode trägt. Echte, getönte Schatten aus dem einen Rig. Kein Rim-Licht.
- **Meldung** je Paket in `WS1_STATUS`.




# NEU OBEN (18.10. spät, wiederhergestellt nach Sync-Fehler)








## 19.10. · Detonator färbt Fluff schwarz (V-546 Nachtrag)
Im Explosionsradius werden alle **Welt**-Fluff-Kugeln zu schwarzen Goo-Kugeln (nie Inventar bzw. HUD-Leiste). Umfärben als organische Welle vom Zentrum nach außen (Speckle-Logik V-403). Schwarz bleibt, bis Agenten bzw. Tinten-Gegner es einsaugen (Goo-Ressource) oder der Spieler es mit Fluff-Bombe bzw. Robo-Arm freiwäscht (kleiner Bonus). Sounds: `detonator_r1` D07 Farbe weg, D08 schwarze Kugeln ploppen.

## 19.10. · Humbug-Detonator (V-546) für WS1b, Start später
Flächen-Granate (eigenes KFB-Design) für Hunky & Dory und Men in Black, groß für AGL. Bitte planen: Flächenwirkung im Radius → alle NPCs und der Spieler bekommen automatisch den „Humbug!“-Blitzdings-Effekt (Comic-Wort + Opfer-Kette mit Boden-Klemme); saftige Explosion aus WSBs Knet-Formen (Pilz bzw. Puff, Schockwellen-Ring, Stern-Blitz, je 3 Stufen) + großer temporärer Krater; dieselbe Explosion für Destruction-Mech (V-514) und Combat Arena. SFX `detonator_r1` (WS0).

## 18.10. 23:40 · Für WS1b: Boden-Klemme bei Liege-Clips + Clip-IDs Agenten (V-541)
- Übertragene Liege-Clips (Opfer: umfallen, liegen, aufstehen, Drunk Walk) versinken mit den dicken KayKit-Körpern im Boden (Medium bis 0,53 u, Large bis 1,14 u). WSB hat für Lorekeeper und Ork Brute die Wurzel gehoben und gebacken. Im Spiel braucht **jede Liege-Szene eine Boden-Klemme** je Figur (tiefster Körperpunkt ≥ Boden, gleitend), plus Überblenden der Hüfthöhe beim Übergang Liegen → Aufstehen.
- Agenten-Clips heißen jetzt nach Motion Library: `kfb_action_aim/shoot/shooting/reload_blaster_a`, `kfb_action_raise_shoot_blaster_a`, `kfb_locomotion_running_holding_blaster_a`, `kfb_locomotion_running_strafe_{left,right}_blaster_a`, `kfb_action_dodge_{left,right,forward,backward}_a`, `kfb_idle_blaster_low_a`, `kfb_locomotion_{walking,running}_blaster_low_a`, `kfb_reaction_hit_front_{small,big}_a`; Marken in `extras.kfb.markers`. Anker `KFB_Grip`/`KFB_Muzzle` (Alias `socket_*`).

## 18.10. 22:55 · Blaster-Kampfset (V-540), für WS1b
WSB liefert mit B40 die Blaster-Clips aus KayKit `Rig_Medium_CombatRanged` (Zielen, Schuss mit Rückstoß, Dauerfeuer, Nachladen, Laufen mit Waffe, Treffer) mit Marken `fire`/`recoil_peak`/`reload_out`/`reload_in`/`ready`, Achse nach V-536, und Mündungsblitz-Meshes an `KFB_Muzzle`. Bitte planen: Zustandsmaschine, Bolzen/Strahl- und Einschlag-VFX nach `SPEC_CARTOON_VFX_SHAPES_R1`, SFX `40_AUDIO/elevenlabs_r1/blaster_r1` (WS0). Start nach V-514-Grundlage.

## 18.10. 22:30 · ÜBERGABE: WS1 wird auf Georgs MacBook weitergeführt (V-539) — bis 23:15
Georg verlegt WS1 auf sein MacBook (Dropbox direkt, private Assets ohne Workspace-Hürden). Danke für die Arbeit! Bitte bis 23:15:
1. **Alles pushen:** `combo/r2` (Arbeitsstand, auch unveröffentlichte Commits) und alle weiteren lokalen Branches. Nichts Halbfertiges auf `ws1/preview`.
2. **`WS1_HANDOVER.md`** auf `ws1/r3f-frame`:
   - Branch-Karte (welcher Branch wofür, letzter Commit);
   - Stand von §94: was veröffentlicht ist, was nicht;
   - Befehle: Installation, Dev-Server, Port, Testsuite inkl. Zahl der Tests, Volltest, Veröffentlichen;
   - offene Aufgaben in Reihenfolge, bekannte Fallen bzw. Workarounds;
   - lokale-only Dinge (Umgebung, Caches, Pfade), die auf einer neuen Maschine fehlen würden;
   - wo die privaten Assets lagen und wie sie eingebunden sind.
3. Kurze Schlussmeldung §94 in WS1_STATUS mit Verweis auf die Übergabe.
Keine Tokens oder Zugangsdaten in die Übergabe schreiben.

## 18.10. 22:20 · Privates Repo steht: Clone-Test bitte (V-538)
- WSA hat `georg-doc/kayfabizarro-private-assets` angelegt, 41/41 sha256 ok.
- Bitte jetzt nur lesend testen: `git ls-remote git@github.com:georg-doc/kayfabizarro-private-assets.git` bzw. per HTTPS, dann Clone außerhalb des öffentlichen Repos und sha256 gegen das Manifest.
- **Klappt es:** „n/n sha256 ok“ + Benutzername bzw. Zugangsart (z. B. Deploy-Key des öffentlichen Repos, Konto) in WS1_STATUS.
- **Scheitert es** (z. B. weil du nur einen repo-gebundenen Deploy-Key hast): erzeuge einen neuen SSH-Schlüssel nur für dieses Repo und melde **nur den öffentlichen Schlüssel** (`*.pub`). Georg trägt ihn im Repo unter Settings → Deploy keys als read-only ein. Niemals den privaten Schlüssel oder Tokens melden.

## 18.10. 22 Uhr · BITTE SOFORT: GitHub-Benutzername für das private Asset-Repo (V-538, Frage von WSA)
1. Melde in WS1_STATUS **nur den Benutzernamen**, unter dem du wirklich bei GitHub angemeldet bist, mit Quelle. Zum Beispiel:
   - Ausgabe von `gh auth status` (nur die Zeile „Logged in to github.com account …“);
   - oder `ssh -T git@github.com` („Hi <name>!“).
   Der Commit-Autor `georg-doc` reicht WSA nicht als Nachweis. **Keine Tokens, keine Schlüssel, keine Mail-Adressen.**
2. Sobald WSA dich eingeladen hat: privaten Clone-Test (nur lesend, außerhalb des öffentlichen Repos) und Hash-Test aller Dateien gegen das Manifest. Ergebnis als Zahl melden: „n/n sha256 ok“.

## 18.10. 21:55 · Georg macht deinen Rechner gegen 23:30 zu
Bitte bis 23:15 einen sauberen Stand sichern: laufende Volltests abschließen oder abbrechen, Zwischenstand committen und pushen, kurze Meldung in WS1_STATUS (§94, auch wenn die Veröffentlichung erst morgen fertig wird). Nichts Halbfertiges auf `ws1/preview` legen.

## 18.10. spät · Private Assets künftig über ein privates GitHub-Repo (V-538)
WSA legt ein privates Repo an (Vorschlag `kayfabizarro-private-assets`) und gibt deinem GitHub-Konto Lesezugriff. Damit entfallen Dropbox-Connector (V-462) und Privat-Artifact (V-487). Regeln: nur lesend, nie in öffentliche Branches übernehmen; sha256 gegen `replies/PRIVATE_ASSETS_FOR_WS1.r1.json` prüfen.

## 18.10. spät · Wurfwaffen (V-537), Start später
Granate, Clown-Bombe und Fluff-Bombe (wäscht Goo im Radius frei) sowie Brick-Fish-Wurf und -Treffer. Flugbahn, Aufprall und Explosion bitte als Zusatz zum Zerstörungs-Modus V-514 mit derselben Partikel-Logik (V-533/V-535) planen; Marken `release`, `apex`, `impact` (Hit-Stop) kommen aus WSB B41, SFX `throwables_r1` von WS0. Krater und Schmauch-Stern sind temporär (Rückbildung); das ist eine abgeleitete Form der God-Mode-Terrainverformung: bitte ein Terrain-Verformungs-Modul mit Modus dauerhaft | temporär planen. Priorität bleibt §94 → V-514.

## 18.10. spät · DRINGEND: Waffe = Verlängerung des Unterarms (V-536, Georg q97)
- **Regel:** Blaster, Gewehr und Trichter sitzen in der Faustkugel. Lauf-/Mündungsachse = Unterarmachse.
- **Bitte:**
  - Zielrichtung und Auto-Target aus `KFB_Muzzle`-Vorwärts bzw. der Unterarmachse ableiten.
  - Zielen dreht den Arm per IK, nie die Waffe in der Hand.
  - Laufen-mit-Waffe-Clips mit seitlich zeigendem Unterarm nicht weiter verwenden. WSB liefert retargetete Clips + Anker `KFB_Grip`/`KFB_Muzzle`.
  - Bis dahin bei Saugarm und Zielen keine Korrektur-Offsets einbauen, die das Problem verdecken.

## 18.10. spät · UFO-Lab gefunden: Vorlage für Entstehen/Vergehen (V-535)
- **Referenz:** `replies/UFO_TRACTOR_LAB_R2_REF/` (START_HERE.md zuerst, dann `ufo-event-lab/EVENT_CONTRACT.json` und `ufo-lab.js`).
- **Inhalt:** Phasen-Grammatik, Breakup-Schwellwert je Fragment, Rematerialisierung (RETURN); zeitbasiert und scrubbar, Zielklassen Prop/Pet/Burg.
- **Bitte:** Das Saug-Modul `suck | build` (V-533) auf diese Logik setzen; Zerstörung (V-514) teilt dieselbe Partikel- und Auflösungs-Logik (Lab-Brief verweist auf Seed World Mech Destruction POC 01, `sw-destruct.js`, `sw-fx.js`). Nicht neu erfinden.

## 18.10. spät · Ein-/Aussteigen MVP = Joyride (V-534)
Keine Türen/Luken im MVP: Die Figur springt aufs Dach und wird verschluckt, das Fahrzeug staucht sich per Cartoon-Deformer mit Nachschwingen; Aussteigen umgekehrt. WSB hat B39 r2 geliefert (Hub q106): Clips `kfb_hop_roof_in|out__<fz>`, Anker `KFB_roof_land`, Zeitpläne `roof_swallow`, Squash-Parameter (Medium 6 %, Large 8 %) für deinen Deformer.

## 18.10. spät · Neues Thema: Kayfabe Men in Black + Black Goo (V-529–V-531), nur zur Kenntnis, Start später
- **Asset:** WSB baut B40 nach B39: Blob-Corp-Turm mit ausblendbarer Tür, hellem Schacht und Orb (wabert; Variante mit Auge, das scannt, blinzelt und zusammengekniffen starrt), dazu Agenten-Trio + Large-Rig-Türsteher mit Blastern.
- **Einsatz-Ablauf:** Briefing `replies/BRIEF_WSB_B40_BLOBCORP_TOWER_R1.md`, Abschnitt „Für WS1“.
- **Sounds:** `40_AUDIO/elevenlabs_r1/blobcorp_mib_r1_norm`.
- **V-531:**
  - Die Agenten ernten Fluff mit Robo-Arm + schwarzem Trichter (dein Saug-Modul mit Farbe/Ressource black) und brauen Black Goo.
  - Die Arena-Gegner (Quaternius) schwärzen damit Karten und Spielfeld; das ist der Nachschub für Card Ink Defense V-405.
  - Bitte beim Saug-Modul Farbe und Ressource parametrierbar halten.
- **V-532 Gegenmittel:**
  - Der Spieler wäscht Geschwärztes frei, indem er Fluff-Kugeln aus der HUD-Leiste mit dem Robo-Arm verschießt.
  - Die Farbregel entscheidet Georg in Hub q103.
- **V-533 Kayfabrizieren:**
  - Robo-Arm/Trichter bauen auch: Gebäude, Zellen und Props materialisieren aus Fluff-Kugeln.
  - Das ist dieselbe Logik wie der Traktorstrahl im UFO-Lab (V-484, beide Richtungen).
  - Bitte das Saug-Modul von Anfang an mit Richtung `suck | build` anlegen und die Zerstörung (V-514) auf dieselbe Partikel-/Auflösungs-Logik setzen. Ein Modul für Entstehen und Vergehen.
- **Priorität bleibt:** R1a → Flug + Zerstörung (V-514). Status §93 fehlt weiterhin.
## 18.10. Abend · Antwort auf deine HUD-Frage §89 (Kesseldruck)
Ja: Kesseldruck als kleines Manometer im HUD R5f, direkt neben den Fluff-Perlen, im selben Clay-Stil. Platzhalter ist ok, bis Claude Design das Element liefert. Kein zweites HUD-Panel.

## 18.10. Abend · Ton für Flug + Zerstörung liegt bereit (V-521)
WSA hat Flug + Crash R1 fertig: Audio-Site v20, Bereich #flight; PR #428, Branch `audio/flight-crash-r1-2026-10-18`, Return `tools/KFB-Audio-Site/WSA_FLIGHT_CRASH_R1_RETURN.md`. Jetpack/Jet/Propeller/Turbine/Antigrav auf Schub/Banking/Steigen/Luftbremse; Einschlag, Bruch und Trümmer geschichtet. Bitte im Block V-514 die echten Flug- und Kollisionsereignisse über den kleinen Audio-Adapter anschließen. Und: bitte Status §93 – seit §92 (13:43) fehlt eine Meldung.

## 18.10. Abend · Georg: „ja“ zu Flug + Zerstörung R1 (V-514)
Briefing `replies/BRIEF_WS1_FLIGHT_DESTRUCTION_R1.md`, Referenzen in `replies/SPELLSPILL_R2_REF/`. Start nach R1a-Veröffentlichung und Status §93. Fragen bitte in WS1_STATUS.

## 18.10. Abend · Stand nach Georgs Hub-Runde (q52–q70)
- **Fluff-o-lect ist entschieden (V-507/V-508):**
  - Spec-Entwurf `replies/SPEC_FLUFF_O_LECT_R1_DRAFT.md`; Datenformat `kfb.fluffolect/1`.
  - Probe R10 (Referenz-Logik): https://claude.ai/artifact/Ms1RhWbn4Tu8gU9RjnQXFR, Datei `KFB_HUB/40_AUDIO/kfb_language_r1/probe_r10.html`.
  - Laufzeit-Slice für dich, sobald WSA das Blasen-Modul `kfb-bubbles.v1` liefert:
    - Freischalt-Zustand je Profil (Wörter global, Song je Deck);
    - Leitmotive für Kartentitel und Namen;
    - W-Fragen fallen;
    - Assist „Immer Klartext“;
    - Mund-Cues aus den Noten.
- **Assets aus WSB:**
  - B31 Bots r4b sind PASS, der Spieler-Arm wird ein echter Roboter-Unterarm (V-510).
  - B36 Werkstatt wird auf echte Assets umgestellt (V-511).
  - Friedhof, Vampirturm und Hexen-Diorama sind in Arbeit.
  - Kommt alles mit dem nächsten Privatpaket.
- **Weiter offen:** der Zugang zum Privat-Artifact unter deinem Konto. Bitte nenne in WS1_STATUS dein Konto, wenn noch nicht geschehen.
- **Bitte als Nächstes:**
  1. R1a veröffentlichen.
  2. Laternen-Platzhalter heller machen.
  3. Kurzer Status §93.
- **Vorschlag nächster großer Block, wartet auf Georgs Ja:** „Flug + Zerstörung R1“:
  - Doppel-Leertaste Flugmodus für Racer/Jetpack/Mech;
  - Zerstörungs-Modul aus dem Seed-World-POC mit Fluff-Ausbeute ans fertige Saug-Modul;
  - Effekt-Kette Schuss → Treffer → Bild/Ton/Spur → Aufräumen;
  - Budget-Deckel 3 nahe 3D-Rauchkörper + 11 Atlas-Sprites aus dem SpellSpill-Nachweis (`Mac/Downloads/spellspill_budget_hybrid_fx_r2/results.json`);
  - Formen nach V-499.

## 18.10. Nachmittag · Antworten auf §91/§92
- **Privat-Artifact:** Es liegt unter Georgs Konto. Georg teilt es mit deinem Konto; bitte nenne in WS1_STATUS die E-Mail bzw. das Konto, unter dem du läufst. Sobald es geteilt ist, gilt der Selbsttest wie beschrieben. B9: zuerst Amphitheater, dann Goblin-Bank und Atlantis; die packe ich als P3, sobald der Zugang steht.
- **Laternen-Platzhalter:** nicht weiter verfeinern. Für Platzhalter `innerGlow`/`veinGlow` anheben (Ziel Kern > 1,3 × Umfeld), die echten B30-Figuren kommen mit dem Paket.
- **R1a + Saug-Modul:** danke, stark. Bitte veröffentlichen (Vorschau + ws1/vendor). Danach V-497: die Melodie-Stimme mit Mund-Rig auf die Bühne, mit der Original-Sprechblase aus dem SSOT (V-501).

## 18.10. · Melodie-Sprache PASS + Fluff-o-lect-Dekodieren (V-500)
- Klang R4 ist PASS (`40_AUDIO/kfb_language_r1/probe_r4.html`); R5 (`probe_r5.html`) zeigt dazu die drei Dekodier-Stufen: Glyphen, Fluff-Wörter, Klartext.
- Für die Bühnen-Probe mit Mund-Rig (s. o.) bitte gleich die Sprechblase mit Stufen-Logik übernehmen. Die Fortschritts-Quelle ist später das Karten- bzw. Begegnungs-Konto.
- Schrift: PottyMouth nur in der Probe. Fürs Spiel wartet die Font-Lizenz bzw. eigene Glyphen auf Georg; bis dahin Platzhalter-Glyphen erlaubt.

## 18.10. · Cartoon-Effektformen verbindlich (V-499)
- `replies/SPEC_CARTOON_VFX_SHAPES_R1.md` gilt für alle Rauch-, Dampf-, Blasen-, Wolken- und Gedankenblasen-Effekte im Spiel: Mesh-Puffs instanziert, Noise-Verformung, Auflösung über Noise-Schwelle bzw. Speckle (V-403), Toon-Stufen über das Licht-Modul.
- Gilt auch für Kessel-Dampf, Tank-Blasen und Fluff-Wolken.
- Abnahme nach §4.

## 18.10. mittags · Melodie-Sprache auf die Bühne (V-492, V-497)
- Georg: Der Ansatz ist gut, aber kein SVG-Gesicht. Gewünscht ist eine **Figur mit Mund-Rig und Sprech-Animation**.
- WS0 liefert den Klang: Probe R3 `KFB_HUB/40_AUDIO/kfb_language_r1/probe_r3.html` (Web Audio, live erzeugt).
  - Jede Figur ein Instrument (FrizzleBob Horn, Dory Flöte, Hunky Tuba).
  - Wort = Motiv, Gefühl = Tempo, Lage, Tonleiter.
  - Die Melodie endet genau mit dem letzten Wort; pro Ton gibt es einen Cue `{t, wi, dur}`.
- **Bitte, nach Antrieb R1a:**
  - die `play()`-Logik als Modul `kfb-melody-voice.v1.js` übernehmen (oder ich ziehe es heraus);
  - auf der Bühne (`#stage,actors=fb` bzw. Dory/Hunky) mit dem vorhandenen Mund-Modul koppeln: Mund öffnet je Ton, Amplitude aus der Hüllkurve;
  - Augen und Gesten über die Ereignis-Zeitleiste (V-389), Sprechblase mit Triplet und Dekodier-Glyphen;
  - als Vorschau-Link für Georg: eine Zeile und die Dory↔Hunky-Kabbelei.

## 18.10. · Normans Glastank (V-489, für das Bord-Diorama vormerken)
- Medium mit wabernder Tönung in Story-Mode-Farben (Material-Slot `kfb_tank_liquid`, Farbe zur Laufzeit), Glas klar.
- Nicht-repetitive Blasen aus den Ankern `kfb_tank_bubbles_<n>`; Rate und Größe stehen in den extras.
- Norman schwebt mittig ganz im Medium (`kfb_tank_float` ± `kfb_tank_float_range`).
- Spec: `SPEC_HD_SHIP_DIORAMA_R1.md` §8. Geometrie kommt mit WSB B34 r2.

## 18.10. Mittag · Langer Lauf: Integrationsplan R1 + private Assets ohne Dropbox (Antwort auf §86/§87)
- **Plan:** `replies/BRIEF_WS1_INTEGRATION_PLAN_R1.md` (V-487). Reihenfolge:
  0. Private Pakete;
  1. Antrieb R1a + Deformer (§86 freigegeben);
  2. Fluff-Ernte (Saug-Modul, Bots, Stationen, Beute, Destruction-Fluff, UFO-Strahl);
  3. Kristall-Laternen.
- **§87 gelöst ohne Georg:** privates Artifact https://claude.ai/artifact/MGwWwWaYDmcijVzfhd1Auk (P1 + P2, 111 Dateien, sha256 geprüft).
  - Erst `selftest.txt` lesen, dann manifest + Teile, dann `kfb_unpack.py.txt`.
  - B9-Steine: bitte die für C4 nötigen Bühnen nennen.
- **Rustwing Cruiser II** ist in P2 (WSB B35, 5,3 MB, Blender-Pipeline statt Node-Paketen). Bei Bedarf mit deinen Node-Paketen auf ca. 4 MB nachpressen.
- **Rust Runner II:** die Quelle ist byte-gleich mit dem bestehenden Rust Runner; Georg wird gefragt.

## 18.10. später · Antworten auf §83–§85 · Rohmodelle Dieselpunk II · Antriebs-Töne · Fluff-Kreislauf
1. **§85 Tempo (V-481):** deine Stufen sind übernommen.
   - Freie Fahrt heute ≤ 114 km/h.
   - Freier Hyper-Rush bis ≈ 350 km/h, Voraussetzungen: 120 Hz + Sweep/CCD, Gelände-Streaming 300–500 m voraus, größere Welt.
   - Darüber nur geführter Hyper-Ride oder Warp-Tunnel.
   - Gefühltes vor echtem Tempo: FOV, Speedlines, Contrails, Kamerazittern, nahe Parallaxe, Klang, pulsierende Düsen.
   - Gelände-Streaming steht als Voraussetzung in der Hyperspeed-Planung (WSA_GUIDED_HYPERSPEED_WARP_RIDE_PLAN_R1).
2. **§83 Fahrzeug-Rigging R1 (V-481):**
   - **Format bestätigt:** `kfb-vehicle-rig.json` mit Typen thrust|antigrav|exhaust|weapon|light. Löst `kfb.vehicle-thrust/1` aus V-360 ab, GLB bleibt unverändert.
   - **Reihenfolge:** R1a (Antrieb als Daten + Modul `vehicleRig` für Georgs 6er-Auswahl) direkt nach deinem Volltest. Er läuft vor der Bot-Laufzeit, weil Georg die Fahrtests jetzt will; das Saug-Modul (V-479) folgt danach.
   - **R1b Garage:** ist der In-Place-Editor aus V-360, kein zweites Werkzeug.
   - **R1c Werkstatt-Diorama:** später, nach dem Bord-Diorama.
   - Garagen-Requisiten (Hebebühne, Werkbank, Werkzeugwand aus KayKit/Kenney) gehen als **B36** an WSB, nach B34.
   - TinySkies-/Racer-Übernahmen: Speedlines und Trails sind da. Übernimm Contrails, FOV-Kick und Kamerazittern aus `kfb-flight-vfx.js` bzw. TinySkies nach deiner Wahl und zeig sie in der Vorschau.
3. **§84 Rust Runner II + Rustwing Cruiser II:**
   - Die **Rohmodelle** stehen jetzt im Privat-Manifest `PRIVATE_ASSETS_FOR_WS1.r1.json` (Dropbox-Connector, sha256). Damit kann deine Düsen-Erkennung sofort laufen.
   - Die browserfertigen v3-Fassungen baut WSB als **B35**, vorgezogen direkt nach B31 r3. Branch und Commit nenne ich, sobald sie da sind.
4. **Antriebs-Töne (ElevenLabs `propulsion_r1`, statt WSA-Brief):** gleicher Audio-Branch `assets/kfb-elevenlabs-sfx-r1-2026-10-18`, Ordner `media/3D_Assets/Audio/KFB_ElevenLabs_SFX_r1/propulsion_r1(_norm)/`, je Anker-Typ eine Schicht, je 2 Varianten:
   - P01 Jet-Schub-Schleife, P02 Turbinen-Lüfter-Schleife, P03 Auspuff-Grollen-Schleife;
   - P04 Boost-Zündung, P05 Antigrav-Summen-Schleife, P06 Schalt-Flammenknall.
   - Dazu kommen die bestehenden racer/flight/hyperdrive-Sets.
5. **Fluff-Saugarm + Kreislauf (V-479, V-480):** `SPEC_FLUFF_SUCTION_R1.md` §1–§7. Töne fluff_suction_r1 und fluff_economy_r1 liegen auf demselben Audio-Branch. Der Transport von der Station nach Utopia wird **nicht** animiert, nur ein 1-s-Effekt an der Station. Gebäudeteile im Destruction-Modus tragen `yields: fluff(color, count)`.

## 18.10. spät · Kristall-Laternen PASS, Abnahme-Bühne v1.2.3, neue Fahrzeuge, Bord-Diorama, VFX-Stand
1. **kfb-gem.v1 r4 PASS** (V-476, Hub q38): Kristallfiguren als Laternen.
   - Optionen `lantern`, `halo`, `pool`; `getPracticalLight()` speist den Practicals-Pool des Licht-Moduls (≤ 6 Lichter, Pfützen-Decals für alle).
   - Tag ist pixelgleich zu r2.
   - Modul (MIT, Morph-Chess-Port): `replies/GEM_R1/kfb-gem.v1.js`, identische Kopie in `PROOF_STAGE_R1/vendor/`.
   - Ob Laternen im Spiel echte Lichter werden, entscheidest du nach deinem Performance-Budget (V-357).
2. **Abnahme-Bühne v1.2.3:** Augen für jede Figur einer Mehrfiguren-Datei, `mountEyesAll()` / `findEyeFigures()` in `kfb-proof-eyes.v1.js`.
   - Behobener Fehler: Augen-Host auf der Figurwurzel setzte beide Augen auf einen Anker, wenn die Figur nicht im Ursprung stand. Bitte prüfen, ob dein Spiel denselben Host-Weg nutzt.
3. **Rust Runner II + Rustwing Cruiser II** (V-477): WSB baut sie als B35 genau wie die 14 v3-Fahrzeuge und liefert auf einem eigenen Asset-Zweig. Commit kommt von mir, dann bitte in die Lineup aufnehmen.
4. **Bord-Diorama Hunky & Dory** (V-475, `SPEC_HD_SHIP_DIORAMA_R1.md`): für dich nach dem laufenden Integrations-Slice.
   - POI-Schleife (Block aus SPEC_NPC_PATROL_R1), Banter-Auslöser, Glaskuppel-Shader mit Ein-/Ausblenden, Strahl-Ereignis;
   - als `kfb.scene-pack/1` Typ `diorama`. Requisiten kommen von WSB (B34).
5. **VFX/Düsen:** Georg erwähnte neue Vorschläge von dir auf GitHub. Gefunden habe ich nur §59 (16.10.); der Stand dazu ist V-357/V-360: Anker über den In-Place-Editor, `kfb.vehicle-thrust/1`. Falls du Neueres hast, bitte Pfad in WS1_STATUS nennen.
6. **Externer Kritiker** (V-473): Georg lässt einen Kritiker (Codex) über Konzept, Art Direction und Spielgefühl laufen. Ergebnis landet nur als Vorschläge auf `proposals/…`; integriert wird nichts ohne PASS und Vorlagen-Zeile.



















## 18.10. · Private files WITHOUT Dropbox app and without a new repo: via the claude.ai Dropbox connector
Georg can't set up anything right now (no repo, no deploy key). The solution needs no installation:
- Your Claude Code session (same claude.ai account) has the **Dropbox connector**. It reads Georg's Dropbox through the API, no Dropbox app needed.
- Flow per file: `download_link(entries=["/CLAUDE/KFB_HUB/50_BLENDER/…"], expiration_in_sec=600)` → single-use URL → `curl -L -o <target>` right away (the URL is consumed by the first request, so no HEAD/preflight) → check sha256.
- **Manifest with all private files** (paths, size, sha256), 39 files ≈ 546 MB: `30_DECISIONS/replies/PRIVATE_ASSETS_FOR_WS1.r1.json`. It covers:
  - alien bodies rimV1 (q32 PASS);
  - pubs + bento delitL3;
  - islands B27 r2;
  - B7 r4;
  - **B9 stone GLBs with `COLOR_1` for C4**, plus B9/data.
- Max 25 files per call. Keep them locally **outside** your git repos, in a gitignored folder, and never commit them anywhere public.
- Tested by WS0: Hunky rimV1 downloaded, sha256 matches.
- If the connector isn't active in your session, write it into WS1_STATUS; Georg switches it on with one click.
→ **C4 can start**; Dory/Hunky to rimV1 (cards are switched); pubs/islands may go into the game (Georg PASS q22/q24).

## 18.10. · Answer to §80/§81: everything public is on GitHub · private route proposed to Georg · hip height
**Public, current commit (please pin this one):** branch `assets/kfb-wsb-public-2026-10-18` @`0d9a632e`.
- Canonical paths are now under `media/3D_Assets/WSB_BLENDER/public_r1/<job>/<original subpath>` (the older flat copies of the first commits stay, but don't use them).
- **B28** found items r2: 53 items, pack variant chains, `extras.kfb.pickup.floatTilt` on 9 tools; table `B28/data/loot_items.r2.json`.
- **B22** lamps r3: Kenney/Poly Haven CC0.
- **B29** wall kit r4: bricks, approved by Georg. Modelled as the near stage, flat at distance.
- **B30** chess: pieces A (Poly Haven CC0) and M (Morph Chess derivative, MIT, `B30/LICENSES/morph-chess-MIT.txt`), stone board r2, dominoes, board game props. Georg chooses in q33/q34.
- **Stage light v1.1 + proof stage v1.2.2:** `tools/KFB-ProofStage/` on the same branch (shadow seam fix V-440, seam measurement in the contact zone, no box AO under hollow footprints).

**Private (B9 Meshy stones for C4, alien bodies rimV1, pubs/islands r2, B7 r4):** WS0 proposes to Georg a **private GitHub repo with Git LFS** (`kfb-private-assets`, read-only for WS1). Georg decides (and creates the repo/access). Until then C4 waits; aliens stay edge80; pubs/islands not yet in the game.

**Hip height (§81, Georg: GothGirl's hip height):** in the GLB, GothGirl's `hips` bone sits at 0.406 u = **0.25 m** above the floor (Rig_Medium, identical to FrizzleBob). If you measure higher in the game, GothGirl is scaled there. Please write the **actual metre value** of the hover centre into WS1_STATUS, and I'll set the approval stage the same. Also: Georg (q23) wants roughly the **same floor clearance** for all; elongated and handled items are tilted 35° (`floatTilt`).

**HUD "throw away" key:** the addition to the R5f board is fine (V-434 asks for it). Note it in the board backlog.

## 18.10. · Georg's verdicts: pubs/bento + islands PASS · found items float with the same floor clearance (V-450/V-451)
- **PASS:**
  - pubs + bento at a door apex of 2.25 m (V-447);
  - 8 islands B27 r2 with baked palettes.
  You may take both over. The GLBs are private (Meshy/Unity), so read them locally once the route is settled (see Dropbox question).
- **Found items in C3b (V-450):**
  - all hover at the **same floor clearance of 0.15 m** (no longer "centre at hip height");
  - elongated items (longest side ≥ 2× the second) **tilted 35°**, then rotate and bob as before.
  Reference: `tools/KFB-ProofStage/kfb-proof-stage.v1.2.js` (float block) on the public branch @e64f7986.
- Shadow-seam measurement in light v1.1 sharpened (seam ≥ 5 px in the contact zone only); the image is unchanged.

## 18.10. · Shadow seam fix available: `kfb-stage-light.v1.1` (V-440) · switch over please
- Branch `assets/kfb-wsb-public-2026-10-18` @`5c495846`, folder `tools/KFB-ProofStage/vendor/kfb-stage-light.v1.1.js` (plus the v1 for comparison, clay v1.1, proof stage v1.2 + README).
- Cause of the seam: back faces were casting shadows, and normalBias lifted floor samples into the round undersides of small parts. Fix: front faces cast (`castFrontFaces`), a tight shadow box around the content (`fitAround`), contact AO per part. Self test 0.1–6 m: 0 px seam, 0 px acne.
- Please take over v1.1 in the game (stage light module) and run its self test once; one line in WS1_STATUS. Use it for C3b already: the found items float, and their contact shadow is the readability cue.
- Also new on the branch: the B28 compact grid lineups are not in it (sheets only); the individual found-items GLBs are unchanged.

## 18.10. · Answer to §79: public assets on a branch · private ones wait for Georg
Thanks: C1/C2/C3 look strong (pupil 0 px, sink-in 0, white trees caught).
- **Public is on GitHub:** branch `assets/kfb-wsb-public-2026-10-18`, folder `media/3D_Assets/WSB_BLENDER/public_r1/`:
  - **B28** 42 found items (already ×1.25, V-443; origin at the bbox centre, `ground_offset_u` in the extras) + `B28/data/loot_items.r1.json`;
  - **B22** lamps r3 (Kenney/Poly Haven, CC0);
  - **B29** wall kit + skins (CC0 scan; for later).
  - All sha256 checked against WSB `handoff.json`; only `public=true` entries.
  - Pin it to commit `f731f3d6` (no raw/main link).
- **C3b** therefore runs with B28 directly (not the originals). Floating as in V-437.
- **Private (B9 for C4, Dory r9):** Georg decides the route (Dropbox on the WS1 Mac or something else). Until then C4 waits and Dory stays edge80, as you planned.
- **Lamps r3:** may go back in now (B22 public). Shadows only through the stage-light module; the seam fix comes as `kfb-stage-light.v1.1` (V-440), link follows.

## 18.10. · PRIORITY: found items demo on terrain = stage C3b (Georg: "I don't see a terrain/demo setup")
Georg wants to see the found items **in the game**. Brief: `replies/BRIEF_WS1_FUNDSACHEN_DEMO_R1.md` (Hub b111).
- Right after C3, before C4.
- Items float at hip height and rotate; fluff rolls on the ground; pick up into the backpack and throw away.
- Use stage-light v1.1 as soon as WS0 sends it: the shadow seam is being fixed at the root.
- Since §78 (01:23) there has been no new status from you. Please report the current stage (C1/C2) briefly in WS1_STATUS.

## 18.10. · Addendum to the found items: presentation (V-437)
Georg: **Props, food, drinks and similar found items float at hip height of the Medium rig** and rotate slowly with a gentle bob (pickup principle as in Whackman). **Fluff, in contrast, lies on the ground**: it bounces, rolls and comes to rest (the C3 physics stays as it is).
- Hover height = hip height of the Medium rig (derive it from the rig, not a fixed number); ±5 % bob, ~1 turn per 3 s, phase randomised per item so they don't move in sync.
- A soft contact shadow on the ground helps readability; no glow, no outline (one light rig, V-385).
- Pick up still with "I"/Interagieren (V-434). Fluff still collected automatically on contact.
- B28 pivot (WSB 18.10.): all 42 GLBs have their origin at the bbox centre (rotation without wobble). Hover: place the origin at hip height. To lay an item on the ground, lift it by `ground_offset_u` (GLB extras on the item and `KFB_Pickup`, plus `loot_items.r1.json`).
- B28 set (42 GLBs, public) is in Hub q20 for Georg; use it once PASS, until then the KayKit/Tiny Treats originals with clay v1.1.

## 18.10. · Found items in the terrain + backpack (V-434), right after C3 together with HUD R5f
Georg's concept:
- **Frequent:** colourful sweets, snacks, drinks and food lie around the terrain. Sources: KayKit Restaurant Bits, Resource Bits; Tiny Treats Baked Goods, Bakery Interior, Charming Kitchen, Pleasant Picnic; all _FREE, so public.
- **Rarer:** tools and props, absurd and surreal (KayKit RPGToolsBits and others).
- **Fluff is collected automatically** when you walk over it (fluff flight into `fluffBar` as in R5f).
- **Props:** pick them up with **"I"** or the R5f action key "Interagieren" → **backpack** (R5f `bagButton` + backpack window). In the backpack detail view, an item can be **thrown away** with a key.
- **Placement:** the frequency follows placement grammar R2 (clusters, odd numbers, negative space); found items do not sit on paths or in entrances.

WSB delivers the found-items set in clay (B28, public, with a loot table). Until then, use the KayKit/Tiny Treats originals with clay v1.1 at runtime. WS0 writes the loot table (rarity, value, type).

## 18.10. · Answers to §78 (WS0), HUD R5f approved for planning
Thank you: merge, one rig, lamps removed, clay frozen, C2 loader and C3 logic are all clean. On your questions:
1. **C4 / B9 GLBs:** they are derived from Georg's Meshy stages, and Georg wants **Meshy kept private** (not on public branches). Read them **locally** from `~/Dropbox/CLAUDE/KFB_HUB/50_BLENDER/B9/<stage>/` (or `HANDOFF_R1`). Built into the game they are fine; just don't commit them as raw files to new public branches. Pull C4 forward with them.
2. **Alien cards:** done. `FIGURES_R1/figures/lord_hunky.figure.json` and `lady_dory.figure.json` now carry `body.glbCurrent` (edge80 for Hunky, **r9** for Dory with the normals fixed; source `local-private`, sha256 included). `body.glb` stays as the r4 origin. Load the private bodies through the local resolver (as in `PROOF_STAGE_R1/sources.json`); your variant file can then go.
3. **Placement grammar R2, WS0 decisions:**
   - (a) The contour rule applies **between fluff balls on the same plant**. `relax` targets either ≤ 0.85× (an intended overlap/cluster) or ≥ 1.25× (air); 0.92× is not allowed. Fall-off fruit may sit at 1.15–1.5×.
   - (b) Odd numbers apply to the hanging balls per plant, as you have it.
   - (c) **Bare trees carry no fluff** (the concept wins); Comic decoration comes later.
   - (d) Scale: **1 KayKit unit = 0.616 m (M_PER_RIG)**, as you built it. The "KayKit unit = metre" line in the spec is wrong; WS0 corrects it.
   - (e) 6 instead of 7 spots per tree is fine.
4. **Repo private (§77):** Georg has deferred V-427. **Don't build the resolver yet**, but **add no new raw/main links.** Use pinned commits or local copies.

**HUD R5f (Georg's "KFB HUD v4.zip"):** approved for planning as a design reference. Your proposal is right:
- C3 counter → `fluffBar` from R5f;
- V/B/N → action bar (fist/brass knuckles, blaster, bomb).

Do it right after the visible C3 test (clay video). Build it as a module the way R5f describes. If you deviate from the boards, give a short reason in WS1_STATUS. Approval images go through the **approval stage** (`replies/PROOF_STAGE_R1/`, v1.1) or as a stage image with the same light and clay; WS0 checks before Georg.

**New for your stage (from WSB, all approved through the approval stage):**
- billboard lamps r3: `50_BLENDER/B22/KFB_Billboard_Lamps.r3.glb`, Kenney/Poly Haven, CC0, public; anchors `KFB_Mount_*`/`KFB_LightOrigin`;
- clay module **v1.1**: `replies/CLAY_SSOT_R1/kfb-clay.v1.1.js`.

Switch from frozen clay to v1.1 (three profiles, scale relative to the object, no stripes) and use the lamps on the billboard.

## 17.10. evening · Georg: MERGE approved (V-430)
**Georg has approved merging the combo look/mesa + m3/fahrhilfe A–G into main** (Hub q05). Please merge it as usual (tests green before and after the merge, preview from main), record it in WS1_STATUS, then continue with long run R2 (b99). The stage FAIL V-429 still applies (one rig, no self-built lamps, clay frozen).

## 17.10. night · STAGE FAIL (V-429), applies to long run R2 (b99)
Georg's screenshot (amphitheatre + billboard), FAIL on four points:
1. **Light/shadows are inconsistent.** Billboard and lamps cast hard shadows, the figures barely any. From now on: **one rig**. All objects (figures, billboard, lamps, props) cast and receive shadows from the same key light (LIGHT_MODEL_R2). The interim rule V-417 ("figures without self-shadow") is lifted on the stage as soon as the light module is in use. Gate: one image row in which every shadow shares the same direction and softness.
2. **Billboard lamps** are self-built, so they go. WSB delivers proper lamps from asset packs, in clay (B22). Until then: no lamps rather than self-built ones.
3. **Clay on figures looks different in every preview** (stripes in the face, wrong scale). **Do not change any clay parameters yourself.** WS0 is building the central module `kfb-clay.v1` (three profiles character/midground/background + distance bands + golden test). You will only integrate it when WS0 delivers it. Until then, freeze the clay settings.
4. **Coloured speckle scatter on the diorama stones is missing:** pull stage C4 (colour script with the B9 stone IDs) forward, right after C2.

## 17.10. night · WSB deliveries for your long run (C2/C3)
- **Ground colour** (WSB `50_BLENDER/SPEC/VORSCHLAG_BODENFARBE_R1.md`): skip saturated greens (hue 55–170°, saturation > 0.35) as ground, and use the toned-down largest remaining share of the edge palette instead. For B7, moss turns into earth brown #73653f and green only shows as speckles. Test it in C3.
- **Harvest feedback in clay (B19):** punch puff, shot hit (9 colours), explosion, fluff burst (6 colours, small balls stay on the ground). One `kfb_fx` clip per GLB.
- **Fluff balls S/M/L + burst (B17)** and the **Kayfabrick construction yard (B20**, bot spots as `KFB_BotSpot_*`, for later).
- WSB is preparing everything as handoff package `50_BLENDER/HANDOFF_R1/` with a manifest (public/private). Until then, use the paths from the RETURN.md files.

## 17.10. evening · Long run R2 (Georg AFK, computer on), b99
Read `replies/BRIEF_WS1_LANGLAUF_R2.md` and work through it in order: b98 repo analysis → C1 camera → C2 modules + E2 aliens (80° sockets) → C3 fluff-harvest mechanics (V-423, placement grammar R2 now in `replies/SPEC_PLACEMENT_GRAMMAR_R2.md`) → C4 colour script with B9 stone IDs. Branches only; each stage green with a preview before the next; one § per stage in WS1_STATUS.

## 17.10. evening · Analysis: what happens if the repo goes private? (Georg, b98), short job, before Stage G merge questions
Georg wants `georg-doc/kayfabizarro` **private**, but the KFB sites and the PDF viewer must stay reachable from outside. WS0 is already inventorying the whole repo (`replies/REPO_PRIVATE_MIGRATION_INVENTORY_R1.md`). **Your part covers only your pipeline**, because you know it best:
1. `ws1/preview` → Cloudflare Pages (`wrangler.jsonc`, build script): does the build and deploy keep running with a private repo, and who triggers it?
2. The WSA staging site reads `build.json` every 15 s. From where (raw URL?), and does that break when private?
3. Does kfb-planet load anything at runtime from GitHub raw/jsDelivr (assets, cards, registry, fonts)? List them with file and line.
4. Your proposal: what has to change so the game build stays public while the repo is private (e.g. ship assets in the Pages build, R2, a public mirror)? Give the effort.

**Change nothing, only analyse.** Report as a new §76 in WS1_STATUS.md, at most one page.

## 17.10. evening · Kayfabrick bots + harvest combat (V-426), for the combat slice after Slice 1
- Concept: `replies/KAYFABRICK_BOTS_R1.md`. Six bots in the fluff colours roll large fluff balls (Sisyphus).
- **Harvest from the balls** follows the V-423 rule: 3 punches / 2 primary shots / 1 secondary hit. Fluff in the bot's colour drops and can be collected.
- **Then aggro/pull:** the hit bot attacks, and nearby bots within a radius join in. This is the bridge into the combat arena (card zines, mobs, mini games).
- **Muzzle fire:** Action Figure `Muzzleflash` (primary) / `Muzzleflash_Long` (secondary) are the default; laser and magic come as colour/VFX variants. WSB delivers them as B18.
- Do not build anything before Slice 1. Placeholders are fine. Details on harvest UI and HUD follow from Georg's HUD ZIP.

## 17.10. evening · WSB points for you (no extra slice, take them into account where relevant)
- **Placement grammar R2** (WSB, `50_BLENDER/SPEC/SPEC_PLACEMENT_GRAMMAR_R2.md`): one grammar for fluff and stones, and you are the code owner. Read it before Slice 1/2. WS0 is moving it into the register.
- **Ground colour V-396:** at B7 it picks up the moss of the plinth, which turns limegreen. Proposal: skip saturated greens for the ground.
- **B8 decimation:** WSB recommends the B8 versions for Prison B, Atlantis A/B, Arcade A/B, Alien B and Cathedral B; keep the WS0 versions for Giza, Marble, Goblin and the Utopia stage. You decide in the game.
- **B9 stone IDs** (`COLOR_1`) for the colour script b81 are ready (Cologne Cathedral not yet).

## 17.10. · Fluff-harvest rule and brass knuckles (V-423), for Slice 1
- **Hits per tree (average):** 3 punches / 2 shots / 1 explosion hit to empty a tree.
- **Drops are staggered:** first 1–2 balls, then 3–4, then all.
- **Look:** cartoony animation. The coloured fluff balls (six story-mode colours, V-368) bounce, roll and come to rest on the terrain with plausible physics, then stay there until collected.
- **Brass knuckles** are the basic melee weapon (punching trees), and FrizzleBob in a tuxedo comes as a role variant. The assets come from WSB B12/B16; until then use a placeholder.
- **Details on harvesting, HUD and UI follow from Georg's HUD session ZIP.** Do not build any harvest UI before that.

## 17.10. · E2 eyelids and sockets for the aliens PASS (V-422)
- Module: `replies/E2_ATTACH_R1/clay-skin-attach.v1.js` (+ `clay-eyelid.v3.js`), eyeForward 0, fit from the recipe (Hunky 1.10 R, Dory 1.014 R). v6 lid shells are completely hidden.
- Figures: `replies/E2_ATTACH_R1/assets/variants/*_edge80.r4e.glb` (socket edge at 80°, socket design unchanged). WSB later delivers Dory r5 (rim blended into the stalk) and B15 (organic rim).
- Integrate them together with the figure-card loader (b90). Do not build your own lid or socket shapes. Reference: `proof_r1e.html?edge=80`.

## 17.10.2026 · Augenlider E2 für alle Figuren – ein gemeinsames Modul (V-417/V-348)
Nicht selbst bauen: WS0 baut `clay-skin-attach.v1.js` (E2 = dünne geschlossene Lidhaut statt der v6-Lidschalen) mit Beweis-Seite gegen das Referenzbild `replies/E2_REFERENCE/E2_approved_closed_lid_skin.png`, Ablage `replies/E2_ATTACH_R1/`. Danach vendort WS1 genau dieses Modul für alle Figuren mit EyeRig (V-348 „gleiches Prinzip für alle“); bis dahin nichts an den Lidern ändern. Bild-Abnahme durch WS0 vor Georg.

## 17.10.2026 · Zwei Module früh liefern: Licht + Figurenkarten-Loader – V-409
Zwei Konsumenten warten (Dramatis-Personae-Tab der Asset-Bibliothek, ToolBox-Studio). Bitte **direkt nach dem L3-Merge, vor der Look-Slice**:
1. `kfb-stage-light.v1.js` (liegt auf `l3/licht`) als vendorbares Paket auf GitHub mit festem Pfad (z. B. Branch `ws1/vendor`, Ordner `ws1/vendor/`), kurze Import-API, Versions-Pin.
2. **`kfb-figure-loader.v1.js`**: liest `kfb.figure/1` (`replies/FIGURES_R1/figures/*.figure.json`), prüft Schema, eyeRig vorhanden, SHA256 des Körper-GLB, Clay-Profil, Sheen ≤ 0,05; lädt Körper + EyeRig + Mund/Brauen; **lehnt sichtbar ab** (rote Meldung) statt still zu rendern. Derselbe Loader ersetzt `stageCast`/`createActor`-Direktladen in der Bühne (V-402.4).
3. README mit API und Beispiel, damit WSA ihn 1:1 einbinden kann.

## 17.10.2026 · Kamera: ruckelfrei, träges Zurückgleiten, Orbit von allen Seiten, God-Mode-Zoom zum Cursor – V-408
Georg: Die freie Kamera ruckelt. Die Kamera-Logik ist längst festgelegt – bitte genau danach bauen (Bewegungs-Sitzung, nach Slice-3-Stufe A, die ohnehin den festen Zeitschritt bringt):
1. **Spielmodus (V-025, V-088):** Figur/Auto/Fahrzeug jederzeit **von allen Seiten** ansehen (freier Orbit per Maus, auch während der Bewegung). Bei Bewegung **träges Zurückgleiten** hinter die Figur (Recenter nur in Bewegung, gedämpft – V-088: Orbit-Feder ω 7,5, Arm rein 8/s, raus 3/s, Recenter 1,6/s; in J17-Metern nachgestellt nach V-345). Zoom Rad/Touchpad normalisiert und gedämpft bis Ich-Perspektive.
2. **God-Mode / Bühne (V-026, V-257):** freie Orbit-Kamera, 360°, **Zoom zum Cursor-Punkt**, Panning, Fokus per Klick, ruhig und nicht zu empfindlich.
3. **Ursachen fürs Ruckeln abstellen:** Kamera-Update **nach** der Physik-Interpolation (gleicher interpolierter Transform wie das Rendering, kein Ziel aus dem rohen Physik-Schritt), framerate-unabhängige Glättung (kritisch gedämpft, z. B. `smoothDamp3` aus V-378, MIT), keine `lerp(dt*k)`-Glättung, Zielpunkt selbst glätten, Kollisions-Arm (V-088 rein/raus-Raten) ohne Springen.
4. **Abnahme:** Kamera-Jitter gemessen (Bildschirm-Position der Figur, Standardabweichung über 10 s Fahrt/Lauf ≤ 1 px bei 60 fps und ≤ 2 px gedrosselt 30 fps), Orbit 360° um stehendes und fahrendes Auto ohne Sprung, Zoom zum Cursor trifft den Punkt unter dem Cursor (Abweichung ≤ 2 % der Bildbreite), Video-Clip für Georg.

## 17.10.2026 · Farbdrehbuch aus Joyride A/B/C, Farbsprengsel steinweise – V-406
1. **Georg-Entscheid (§70.1) übernommen:** Ausgangspunkt des Farbdrehbuchs sind die drei Joyride-Welten (Claybound-Canyon, Bikini-Bucht, O-Town; bei euch `canyon`/`bucht`/`otown`). Je Diorama eine Palette mit ≈ 6 Farben und Rollen, erzeugbar über den V-305-Generator, je Diorama optimierbar. Volle Umfärbung nach Rollen ist für das Amphitheater freigegeben (V-402).
2. **Farbsprengsel steinweise (§70.2):** einverstanden mit dem Blender-Weg. WSB-Auftrag **B9** angelegt: zweites Vertexfarb-Attribut `COLOR_1` (RGBA8): R+G = Stein-/Bauteil-ID (16 Bit, gleichverteilt), B = Rolle (0 Boden · 1 Türme/Bögen · 2 Ränge/Stufen · 3 Fels · 4 Rahmen · 5 Akzent), A = 255; Eintrag im Stage-Descriptor `vertexChannels`. Läuft im B8-Durchgang, Amphitheater zuerst. Im Spiel: Objekt-Ebene im Sprenkel-Modul (V-403) wählt je ID Rollen- oder Sprengselfarbe (dichter an Kanten/Übergängen, `nest()`-Gruppen, Seed je Diorama). Bis die GLBs da sind: flächige Umfärbung nach Rollen.
3. Danke für den Spiegel `ws1/s1-weltboden` – WS0 prüft die Schürze beim nächsten Durchgang.

## 17.10.2026 · Gesprenkelte Übergänge als ein Modul – V-403
Audit `replies/SPECKLE_TRANSITION_AUDIT_R1.md`: Die Lösung existiert und ist abgenommen – Joyride-Knetfleck `kfbBlend` → Insel `kfbLayer` → **Lab S1 „Scheiben-Sprenkel“** (Georg 09.10.: „so nehmen … Tune später“). Sie war nur nie als zentraler Standard nummeriert.
1. **Ein Modul `kfb-speckle-transition.v1` (`kfb.speckle-transition/1`)**, gebaut von WS1 in der Look-Slice: GLSL **byte-gleich** aus `gh/sync/lab-snapshot-2026-10-11` @64ae61fe7 vendoren (`src/clay/kfb-speckle.ts` + Hash/Warp/Seed/3D/`patchSpeckle` aus `src/island/r2d/top-material.ts`), Einheiten auf J17-Meter umrechnen. API wie im Audit §4: `createSpeckle({seed, cell_m, space})`, `.patch(material, {layers})`, Gewichts-Bäcker `band` / `zone` / `depthBelowRim`, `setColors` ohne Neukompilieren.
2. **Presets (Startwerte, Georg tunt):** Strecke↔Boden 2,8 m Band; **Diorama↔Boden 3–8 m ab `footprint`**, Ring = dominante `edgePalette`-Farbe (ΔE ≤ 0,05); Biom↔Biom 6–12 m; Rand/Scholle 3D nach Tiefe; Zelle 1,1 m.
3. **„Weich überblenden“ heißt ab jetzt Sprenkel-Band, nie Farbverlauf** (V-011). Das korrigiert die Formulierungen in V-341, im L2-Brief (G12) und in WS0_TO_WS1 („Farbübergang 3–8 m“, „Platzhalter-Verlauf“) – die Gelände-Schürze bekommt ihren Farbübergang aus dem Modul.
4. `kfbBlend` bleibt in Joyride unangetastet; neuer Code nutzt das Preset `built`. Track-Core-`SKIN_BLEND` (32-m-Verlauf) wird beim späteren Strecken-Einbau auf das Modul umgestellt.
5. **Bitte `s1/weltboden` auf GitHub spiegeln**, damit WS0 die Schürze prüfen kann.
Abnahme: keine harte Kante, keine Linie/Geisterlinie/gestrichelter Rand an allen Testkameras; kleinste sichtbare Stufe ≥ 3 px; kein gleiches Muster nebeneinander (Seed je Zone); weltfest; ≤ 3 Ebenen, keine zusätzlichen Draw Calls.
6. **Ziel ist Georgs Absicht, nicht der alte S1-Look:** `replies/TRANSITION_INTENT_R1.md` lesen – Flächen laufen wie Flüssigkeiten/Farben gesprenkelt ineinander, in beide Richtungen (Erdflecken ins Gras, Grasbüschel in die Erde), Bewuchs dünnt aus (Gruppenregel `nest()`), viele Größen, unregelmäßige Formen statt Scheiben, kein erkennbares Konstruktionsmuster. S1 ist die technische Basis und wird wo nötig erweitert (Verzerrung gegen Scheiben, zwei Richtungen, Bewuchs-Ebene). Abnahme zusätzlich mit blindem Kritiker: „Ist ein Konstruktionsmuster zu erkennen?“ → nein.

## 17.10.2026 · Antworten auf §68.4 und §69.3 – V-402
**Georg-Entscheide aus dem WS1-Chat werden ins Register übernommen:** Mesa (Krazy-Kat-Sonntagsseiten, Mesas, laue Abende) ist die Grundrichtung für Licht und Farbe; Farbwelt cartoonig, ruhig psychedelisch wie Joyride; Reihenfolge L3 technisch → Look-Slice (Farbdrehbuch + Material) → Licht final → externe Designkritik → voller Beweislauf.
**§68.4**
1. **Mesa ersetzt die R2-Stimmungstabelle als Standard**, J17 bleibt Referenz (`lset=r2`). Die Regeln von R2 (ein Rig, kein Rand-/Gegenlicht, Figurenlicht, ein Ton-Pfad) gelten unverändert.
2. **ACES bestätigt.** Messregel ergänzt: neben Clipping und ΔE zählt **Chroma-Treue** (Boden/Figuren ≤ 15 % Chroma-Verlust gegen „ohne“, V-355). AgX scheidet an der Sättigung aus.
3. **M1/M2 auf das Licht-Modul** nach dem L3-Merge durch die Bewegungs-Sitzung; Zweitschatten am Auto über `fitShadow` (Radius ≥ Schattenlänge, Bias abgeleitet) lösen.
4. **Figurenkarten (V-391):** direkt nach dem L3-Merge als kleiner eigener Schritt, **vor** dem sichtbaren Slice-1-Einbau. Karten: `replies/FIGURES_R1/figures/*.figure.json` (Register-Branch, folgt mit dem nächsten Abgleich).
**§69.3**
1. **Rahmenfarbe:** einverstanden – **eine Bühnenpalette mit Rollen** (Boden, Bauten/Säulen, Wege, Rahmen, Akzent) wie Joyride; die Karte färbt nur Akzente (Lampenlicht, Story-Tönung V-387). Ersetzt die Rahmen-Regel aus V-270.
2. **Look-Slice vor dem Licht-Feinschliff** (Vorlagenzeile: Joyride-Paletten `track-look.v5` WORLDS + `kfb-cartoon-palette.js` aus V-305): Farbdrehbuch Mesa (Rollen, Hex, Anteile, Tag/Gold/Nacht-Verhalten), Knet-Boden fürs Amphitheater, Bögen nach Rollen umfärben (Variante B). **V-286 gilt weiter für Meshy-Bühnen mit fertig gemalter Textur; das Amphitheater ist ausdrücklich ausgenommen** und wird voll nach Rollen gefärbt. V-355 (Messung je Schicht) gilt danach weiter.
   **Farbübergänge:** die „gesprenkelten Übergänge“ (Kontaktzonen zwischen Farbzonen/Biomen, wie in Joyride und den Insel-Biomen) werden gerade von WS0 zusammengesucht und als **ein zentrales Modul** gefasst (wie das Licht-Modul). Bis dahin keine eigene Übergangslösung bauen; Schürze mit Platzhalter-Verlauf ist ok.
3. **Externe Designkritik:** WS0 lässt sie laufen – ein unabhängiger „Art Director“-Prüfer (Cartoon/Animation) ohne Regelkenntnis bewertet eure Bildtafeln (Totale, Nah FB, Nah Karte × Tag/Gold/Nacht, 16:9 + 9:16) und schlägt Farbe/Licht vor; optional eine Zweitmeinung über den Web-Chat. Anstoß: sobald die Look-Slice steht, Bildtafeln in den Status.
4. **V-400-Daten:** liegen jetzt auf GitHub, Branch `assets/kfb-wsb-deliverables-2026-10-17`, Ordner `media/3D_Assets/WSB_BLENDER/B7/data/` (`b7_stage_edges.json` mit `groundY_u`) und `B7/scripts/b7_ground_gap.py`. `SPEC_PLACEMENT_GRAMMAR_R2.md` und Steinkit `kfb.stone-kit/1` kommen von WSB; bis dahin eigene Schwebe-Messung mit three-mesh-bvh und Platzhalter-Steine – genau richtig.

## 17.10.2026 · Mac-mini-Lieferungen jetzt auf GitHub
Branch `assets/kfb-wsb-deliverables-2026-10-17`, Ordner `media/3D_Assets/WSB_BLENDER/`: B1 (Mumien-Tanzprüfung, `tempo.json`, Duett-Video), B2 (Fluff-Anker `kaykit-tree-fluff-anchors.v1.json`, Konzept B2-R2), B7 (Dschungel-Computer `JungleComputer_A_browser.v3.glb`, LOD1, Screen-GLBs A/B mit `kfb_screen_frame/slot`, `b7_stage_edges.json` mit `groundY_u`), dazu STATUS und Arbeitsteilung. Bitte von dort lesen, nicht aus Dropbox.

## 17.10.2026 · Nacht-Langlauf R1 (Georg: längere Runs, V-375) – V-400
Zwei WS1-Sitzungen parallel, jede nach V-375 (keine anhaltenden Rückfragen, Stand-Commits alle 30–45 Min., Abschluss mit Messwerten + Clay-Bildern ohne Overlays, kein main-Merge ohne Georg).
**A · Owner-Sitzung (Modell: Claude Opus 5.5):**
1. **L3** nach `replies/LIGHT_MODEL_R2.md` (Hub b73) inkl. **Modul `kfb-stage-light.v1.js`** (kein Rand-/Gegenlicht, fitShadow, contactAO, Selbsttest Spalt 0) und **Knete-Look R2** im Material (Dellen-Varianz, Mindest-Rauheit ≈ 0,6, weniger Oil, Sheen ≤ 0,05).
2. Danach **Slice 1** sichtbar einbauen (V-396-Antworten) plus die von WSB übergebenen Punkte:
   - Gelände-Schürze trifft die Bühne ohne Stufe auf `groundY_u` (B7: 0,0238 u, gemessen in `50_BLENDER/B7/data/b7_stage_edges.json`), flache Dünen/Verwehungen, Farbübergang 3–8 m `edgePalette` → Zonenboden.
   - **Schwebe-Messung aller Bühnen im Browser** (Strahlenraster von unten, three-mesh-bvh, 98-%-Methode aus `50_BLENDER/B7/scripts/b7_ground_gap.py`) → `groundY_u` je Bühne in die Stage-Edges-Daten.
   - **Übergangssteine platzieren** (nicht bauen): Gruppen nach `nest()` 1:3:Rest, größte nahe der Bühne, 30–60 % versenkt, jede berührt den Boden – sobald das WSB-Steinkit `kfb.stone-kit/1` da ist; bis dahin Platzhalter-Logik.
   - **Verteilungs-Grammatik** (Fluff + Steine) an einer Stelle im Spiel (`src/world/grammar.js`), Spec folgt von WSB als `replies/SPEC_PLACEMENT_GRAMMAR_R2.md`.
   - Abnahme im Spiel: Vorher/nachher je Bühne mit Gelände, gleiche Kamera-Marken.
**B · Bewegungs-Sitzung (Modell: Claude Opus 5.5):** Slice 3 Fahrhilfe M3 (Hub b70) Stufen A–F, Tests bei ≥ 50 und 30 fps.
Blöcke aus `replies/KNOWN_FAILURES.md`: A = [Bühne/Licht], B = [Bewegung/Tests].

## 17.10.2026 · Antworten auf §65.3 (Slice-1-Vorbau) – V-396
1. **Bodenfarbe:** der **größte Flächenanteil** der `edgePalette` wird Boden (Goblin: `#4e4341`), in OKLCH höchstens +10 % L aufgehellt, damit er als Knet-Boden liest; Rollen-Passung nur für die übrigen Farben. Begründung: gesampelt wurde der Ring, wo die Bühne den Boden trifft – genau dort darf keine Farbkante entstehen (V-341, keine harten Schnitte).
2. **Sockel-Bühnen (giza_pyramid, portal_ruin):** Gelände schließt **15–25 % der Sockelhöhe unter dem Bühnenboden** an – der Sockel wirkt wie Fels, der aus dem Boden wächst, nicht wie aufgesetzt; Farbe aus `footprintBase.edgePalette` (dort trifft der Sockel den Boden). Übergangssteine aus dem Steine-Kit.
3. **marble_terraces:** bestätigt (Schürze folgt dem Rand bei y = 0, Figuren nach Slot).
4. **Schürze:** 4 m / 3 Ringe passt. **Eingänge nicht überbrücken:** Kerben an Treppen/Eingängen bleiben offen (wenn erkennbar als Zugang, sonst füllen). Langfristig **Höhenfeld-Anschluss** wie von WS1 empfohlen; Schürze als Zwischenstufe.
5. **Fluff-Balance (Startwerte, nach Spieltest tunen):** 24 Kügelchen je Zone, Nachwachsen 90 s, Sammelradien 0,8 m zu Fuß / 1,9 m im Fahrzeug, Drift-Bogen wie vorgeschlagen (2,2 ×, 140°, ab 7,5 m/s). High/Low ohne Rolle.
6. **Spielstand:** ja, schon jetzt in `kfb.save/1`: gesammelte Karten (deckId + cardNumber), Fluff-Bestand je Sorte, d6- und Story-Mode-Würfe als einfache Listen; R1.3 formalisiert später.
**Reihenfolge:** Teile ohne Licht-Abhängigkeit (save, interactable, Perf-Overlay, Fluff-Logik) gehen sofort; sichtbarer Einbau und Beweisbilder nach L3, damit sie im richtigen Licht entstehen.

## 17.10.2026 · Licht-Modul für alle Bühnen, Figurenkarten, Fehlerliste – V-391 bis V-393
1. **L3 liefert zusätzlich das Modul `kfb-stage-light.v1.js`** (Details am Ende von `replies/LIGHT_MODEL_R2.md`): Rig ohne Rand- **und ohne Gegenlicht** (Korrektur nach WSB-Beleg: das J17-Gegenlicht malt den Saum), `fitShadow`, generisches `contactAO`, Selbsttest Spalt = 0 px. Es wird vendorbar gebaut, WSB/ToolBox/Claude-Design-Bühne binden es ein.
2. **Figurenkarten (V-391):** Bühnen laden Figuren nur noch über `figures/<id>.figure.json` (Entwurf `replies/FIGURES_R1/`, folgt); ohne `eyeRig` sichtbar ablehnen.
3. **Fehlerliste gestaffelt (V-393):** Stufe 0 (drei Zeilen) gilt immer; für L3 zusätzlich nur der Block [Bühne/Licht], für Slice 3 [Bewegung/Tests] aus `replies/KNOWN_FAILURES.md`.

## 17.10.2026 · Licht-Lauf L3 nach Licht-Modell R2 – V-382, V-385 (vor Slice 1)
Georg hat V-346 auf der Staging-Seite als FAIL/großes TUNE bewertet. WS0-Audit `replies/LIGHT_RESEARCH_AUDIT_R1.md`: drei der fünf Fehler gehen auf **WS0-Aufträge** zurück (Randlicht, faceFill, toneSplit, unbeleuchtete Karte) – das ist kein WS1-Versäumnis. Neues Konzept: `replies/LIGHT_MODEL_R2.md` (zehn Regeln, Stimmungs-Tabelle, Raster L-1–L-8). Reihenfolge: **V-345 fertig → L3 → Slice 1**.
1. **Feste Belichtung, Schalter-Vergleich:** Randlicht aus + Figuren-Sheen ≤ 0,05; Tonemapping ACES vs. Neutral vs. AgX für **alle** Schichten (kein toneSplit). Wahl per Messung (Clipping < 0,1 %, V-355 je Schicht), Bildpaare in den Status; Georg kann überstimmen.
2. **Ein Rig für Tag/Gold/Nacht** nach der Tabelle in R2: J17-Tag als Basis, Gegenlicht immer an und neutral, Gold = warme tiefe Sonne + kühlere Füllung + dunklerer Himmel, Nacht = Mond + Hemi + Licht-Inseln ohne Belichtungsanhebung. Look-B-Lichtsättigung raus. Hemi-Boden = `edgePalette`, `faceFill` raus.
3. **Praktische:** gelieferte Goblin-/Atlantis-Praktische (Branch `data/kfb-stage-edges-r1-2026-10-16`) einbauen; Billboard-Lampenarme aus dem Highway-Spender mit Emissive-Köpfen + ein Pool-Licht (Ausnahme zu BILLBOARD_STANDARD_R2).
4. **Karte** = beleuchtetes mattes Papier; neue G3: Druckfarbton/Chroma bleiben, Helligkeit folgt der Stimmung.
5. **Eine Material-Antwort** (Clay, Karte, Meshy, Fahrzeug; Metall PMREM nach V-370); AO-Probe im Budget.
6. **Abnahme-Oberfläche nach V-383:** Bedienleiste eingeklappt am Rand, nichts über dem Motiv, Knopf „Sauberes Bild“.
7. **Figurenlicht (V-386, Georg):** ein echtes, weiches, warmes, schattenloses Licht von vorn-oben auf die Dialog-Gruppe, stimmungsabhängig (tags kaum, nachts stark), fällt leicht auch auf den Boden um die Figur, Catchlight in den Augen; ersetzt faceFill und Randlicht. Messung L-9 (Gesicht lesbar, Mund nie im Halbschatten, nie überstrahlt).
Beweis: 3 Stimmungen × (Totale, Nah FB, Nah Karte) × 16:9 + 9:16, Clay, ohne Overlays, Messwerte L-1–L-8. Langlauf nach V-375.

## 17.10.2026 · build.json für die GPT-Staging-Seite (V-356)
WSA work baut die Staging-Seite und liest `build.json`. Bitte ab der nächsten Vorschau: Startziele **host-neutral** (relative Pfade bzw. Hash-Ziele wie `#stage,actors=fb,light=l1`, keine festen Cloudflare-URLs; Cloudflare nur noch Rückfall). `tests` darf Objekt bleiben (WSA liest beide Formen). Die Fahrprobe (M2-Kombi-Vorschau) als eigenes Startziel eintragen, sobald sie geliefert ist; bis dahin zeigt die Staging-Seite den Knopf als „noch nicht verfügbar“.

## 17.10.2026 · Slice 3 Fahrhilfe M3 freigegeben – V-379
Brief `replies/BRIEF_WS1_DRIVING_ASSIST_M3_R1.md` (Hub b70): Stufen A–G mit Spendern, Startwerten und Abnahme-Raster; Start erst nach V-345 + M2-Merge. Entscheide: Wandfahrt bleibt (nur markierte Flächen), Lande-Boost in C (abschaltbar), Respawn T3 nur mit Cartoon-Übergang, Schwellen mit Begründung anpassbar.

## 17.10.2026 · Daten für Performance-Duett P1 bereit (V-359, V-365)
`kfb.performance/1` für Pharaoh liegt auf Branch `assets/kfb-deck-song-pharaoh-piledriver-2026-10-16` (PR #412) unter `media/3D_Assets/Sounds/kfb_deck_songs/pharaoh_piledriver__suno_01a/pharaoh_piledriver__suno_01a.performance.json` (145 KiB, 14/14 Prüfungen). Zeitbasis = Mix-MP3. Inhalt: Takt (591 Schläge, 148 Takte), 20 Abschnitte (Intro, v1–v13, ch1–ch3, Break, Outro), je Mumie Wörter + Viseme (9er-Satz), Tanz-Cues auf Taktgrenzen, Arm-Akzente, Emotes, 52 Karten-Wechsel fürs Billboard. Mumie Mann links (alle Karten), Frau rechts (Intro/Refrains/Outro). Tanz-Clips aus `media/3D_Assets/Animations/KFB_Motion_Library/KFB_Motion_Library_Rig_Medium.glb` (`kfb_dance_hip_hop_a`, `kfb_dance_slide_hip_hop_a`, `kfb_dance_wave_hip_hop_a`, `kfb_dance_house_a`, Ruhe `kfb_idle_happy_a`); auf den Mumien noch nicht angesehen, Clip-Tempo auf 118 BPM stellt ihr ein. Nur einplanen (nach M2/L2/VFX), nicht vorziehen.

## 17.10.2026 · Spender aus rwanda-f1-2026-sim (MIT) – V-378
Georgs Fundstück, geprüft in `replies/DONOR_F1SIM_R1.md` (Pfade + Zeilen dort). Steuerung nicht übernehmen; **keine Assets, nicht `CarAudio.ts`/`visual-fx.ts` (GPL-Herkunft)**. Kopieren nur mit MIT-Hinweis (CREDITS).
1. **Jetzt klein (S0/S1):** followShadow auf Schatten-Texel einrasten (≈ 10 Zeilen, gegen Flimmern).
2. **Slice 3:** Deformer v2 auf Basis von `tyre-deformation.ts` (Ebene + Eindringtiefe + Rückfedern, Schatten-Material mitverformt); Motorsound als `LoopGrid` (3–5 Loops, Crossfade, Fake-Drehzahl); Steuerung mit festem 120-Hz-Schritt + Interpolation bzw. Rapier-CCD gegen Tunneln; `WALL_IMPACT`-Ereignis als Auslöser.
3. **S2/L2 Schritt 5:** PMREM einmal backen (256, warm), nur als `envMap` der Metall-Materialien. Tonemapping bleibt ACES im Renderer, nicht im Postprocessing-Pass (sonst bricht `toneSplit`).

## 16.10.2026 · Slice-Plan R2 und Antworten auf §53–§63 – V-367 bis V-370
**Fahr-Basis (V-367, Georg):** K2B/Joyride ist die Basis fürs freie Fahren; ecctrl ist nicht mehr Empfehlung (V-345 Punkt 5 abgelöst). Gilt nicht pauschal für jede K2B-Gelände-/Hover-/Looping-Funktion. Warp-Fahrt (`WSA_GUIDED_HYPERSPEED_WARP_RIDE_PLAN_R1_2026-10-16.md`) ist Arbeit **nach M2**, kein M2-Blocker.

**Antworten:**
1. **§63 Metall-Restglanz:** ja, Ausnahme von G8 nur für als Metall getaggte Materialien: schlichte warme PMREM-Environment-Map (keine zusätzliche Lampe), envMapIntensity ≤ 0,35, roughness ≥ 0,45. Alles andere bleibt Clay.
2. **§62.4.4 Zielgerät und Budget:** Laptop ohne eigene Grafikkarte (Apple M1 Basis bzw. Intel Iris Xe), 1080p: p95 ≥ 30 fps. Georgs M1 Max ist Referenz mit ≥ 60 fps. Erstes Laden ≤ 40 MB, je Zone nachladen ≤ 15 MB. Im Bild ≤ 300 Draw Calls, ≤ 600 k Dreiecke. Messwerte mit dem Performance-Overlay belegen.
3. **§62.4.2 Register:** Fahr-Engine = V-367. Welt-Struktur (V-289) und Game Loop (V-319) bleiben Arbeitshypothese; Slice 1 baut die Ernte so, dass sie in jede Loop-Variante passt.
4. **§62.4.3:** Der Cartoon-Racer-Bericht (V-352) ist noch nicht auf GitHub; Fahrhilfe-Auftrag folgt, sobald er da ist. Bis dahin gilt die Reihenfolge aus `STUNT_DONOR_MAP_R1.md`.
5. **§54:** Stufe 1 (von Wänden abprallen + Squash) bestätigt. **§55.1:** Deformer v2 und Two-Wheel v1 als Vorlagen freigegeben; das Fahrgefühl beurteilt Georg.
6. **§62.4.1 F1/F2:** Vorlagen-Zeilen schlagt ihr aus dem Repo vor (Spender mit Pfad), WS0 gibt sie im nächsten Status frei. F1 ist Teil von Slice 1, F2 kommt später.

**Slice-Plan R2 (längere Läufe, ohne Prüferrunden zwischendurch; Abnahme-Raster und Beweisbilder mit Clay am Ende):**
- **S0 jetzt:** §63-Testlauf fertig → spiegeln → Vorschau; dann V-345 `worldScale.js`.
- **Slice 1 · Welt-Boden + Fluff-Ernte** (eure S1 + V-368): Gelände-Einbindung der Dioramen (V-341, Stage-Edges-Daten `data/kfb-stage-edges-r1-2026-10-16`), Bäume/Büsche je Biom aus KayKit Forest Nature Pack zuerst, dann Tiny Treats, Kenney zuletzt; sechs Fluff-Sorten (Farben V-292) als Clay-Kügelchen an Bäumen/Büschen, Windfall mit einfachem Bounce-Integrator (keine Physik-Engine), Aufsammeln durch Drüberfahren/-laufen, Gewichtung je Zone (Hauptsorte ≈ 40 %, jede andere ≥ 8 %). F1-Kern: `interactable`, Speichern des Ernte-Stands (`kfb.save/1`), Performance-Overlay. Zähler nur als Debug-Anzeige, kein finales HUD (§44.3). Beweis: drei Zonen mit unterschiedlicher Hauptsorte, Clay, Messwerte.
- **Slice 2 · Truhen + Baukasten-Landmark** (V-369): KayKit-Dungeon-Truhen (common/rare/mimic) mit KFB-EyeRig, Rammen/Schlagen → Platzen → Kügelchen springen heraus; öffnende Truhe mit Goldschein aus `room-fx.js` (KayKit Environment Atlas + Dungeon Generator, Room Study S21). Ein halboffenes Satire-Imbiss-Diorama aus KayKit Clown (Mystery Series 6) + City Builder Bits + Tiny Treats mit abgerundeten Schnittkanten, gesetzt über den In-Place-Editor (V-360) und als Rezept gespeichert.
- **Slice 3 · Fahrhilfe M3 auf K2B** (V-351): Anti-Roll, Landen in Fahrtrichtung, Anti-Steckenbleiben → Deformer v2 → Rampen-/Wandzonen; danach VFX V1 (V-357) inklusive Düsen-Anker.
- **Slice 4 · Destruction-POC verbunden:** Flugmodus + Fluff aus zerstörten Teilen + 2D-first-FX (Seed-World R4), erst wenn R4 ein Ergebnis hat.
- **Später:** F2 (Asset-Manifest, Ladebildschirm, GLB-Kompression), Warp-Fahrt R1, Performance-Duett P1, Portal.
Konzept dazu: `replies/FLUFF_WORLD_DRESSING_R1.md`.

## 16.10.2026 · Performance-Duett P1 und Anker per In-Place-Editor – V-359, V-360
1. **Düsen-Anker (§59.6):** Georg möchte kein eigenes Klick-Werkzeug, sondern den vorhandenen **3D-In-Place-Editor** (Verschieben/Drehen/Skalieren) als Modus im God-Mode-Editor (V-306). Spender: Resident Atlas `tools/KFB-ToolBox/_inbox/KFB Resident Atlas v3/S39-band-module-01/lib/edit-layer.js` (TransformControls) bzw. die neue ToolBox. Anker = Punkt + Richtungspfeil an Düse/unter Rädern, Speichern als `kfb.vehicle-thrust/1` (Format aus V-357 bleibt).
2. **Performance-Duett P1 (V-359)** als eigener Job **nach** M2-Grundfahren, L2 Schritt 4/5 und VFX V1 – bitte nur einplanen, noch nicht bauen: zwei KayKit-Mumien (`Mummy_A`/`Mummy_B`, Rig_Medium) performen den Pharaoh-Song links/rechts vom Billboard, Mund je Stimme, Clips auf den Beat. WS0 liefert die Datenquelle `kfb.performance/1` aus der Audio-Pipeline; Briefing `replies/BRIEF_PERFORMANCE_DUET_P1.md` (Hub b64). Gesicht KFB_NATIVE, nicht Wireface.

## 16.10.2026 · Entlichtete Meshy-Texturen für L2 Schritt 5 (V-355)
Branch `assets/kfb-meshy-delit-r1-2026-10-16`, Ordner `media/3D_Assets/MeshyModels/browser/delit-r1/`: `GoblinBank_A_screen.v2.delitL1/L2.glb`, `Atlantis_A_screen.delitL1/L2.glb` (nur Base-Colour ersetzt, Farbton exakt, alles andere bytegleich inkl. `kfb_screen_frame/slot`) + Proofs/Messwerte. **Für Variante C nehmen: Goblin L2, Atlantis L1.**
Ehrlicher Befund: Die Wirkung ist klein (+2–4 % Helligkeit). Gemaltes Oberlicht/AO steckt vor allem in Atlantis; die Goblin Bank ist in der Albedo wirklich dunkel, und **11 % ihrer Texel sind Metall (Gold, Messing), die ohne Environment-Map in three.js dunkel rendern**. Das ist Laufzeit: bitte für Schritt 5 eine schlichte Raum-/PMREM-Environment-Map (gleiche warme Tönung wie Look B, kein zweites Licht) und gegebenenfalls Metallglanz begrenzen, dann neu messen. Ob die Bühnenfarben zusätzlich bewusst aufgehellt werden dürfen (Regrade, Konflikt mit „Farben behalten“/V-286), entscheidet Georg erst am A|B|C-Vergleich.

## 16.10.2026 · Antworten auf WS1_STATUS §58–§59 (VFX-Slice, Audio, Partikel) – V-357
1. **VFX-Slice V1** als Vorlagen-Zeile freigegeben (V-001 durch `kfb-flight-vfx.js`), Reihenfolge wie §59.3 (Georg bestätigt): M2-Grundfahren → Speedlines/Trails + Staub/Erde/Rauch → Düsen-Glow → Antigrav/Flug → Audio parallel. KISS: **ein** Antriebs-Effekt für alle Fahrzeuge, Antigrav an vier Punkten aus `kfb_wheel_*` bzw. `kfb_hover_*`, keine Modelländerung. Gemeinsames VFX-Budget wie euer Vorschlag (feste Obergrenzen je Familie wie `VFX_CAPS`, ein Partikel-Pool, Instancing, keine neuen Lichter, Leuchten nur über Material/additive Sprites) – gilt auch für spätere Destruction-/Waffen-Effekte.
2. **Düsen-Anker: (b) Klick-Werkzeug in der Vorschau** (Raycast → Punkt + Normale → JSON), weil Georg damit selbst gestaltet (V-002/V-306) und es für Waffen-Aufsätze wiederverwendbar ist. Format bestätigt, GLB bleibt unverändert:
```json
{ "schema": "kfb.vehicle-thrust/1", "vehicle": "crimson_flame_dragster", "space": "glb",
  "points": [ { "id": "jet_l", "pos": [x,y,z], "dir": [x,y,z], "radius": 0.18, "type": "jet|turbine|exhaust|antigrav" } ] }
```
   WS0 legt die Dateien nach Georgs Klicks unter `media/3D_Assets/MeshyModels/vehicles/<id>/<id>.kfb-vehicle-thrust.json` ab.
3. **Terraintyp → Partikelprofil** (Farben aus der Bühnen-/Biom-Palette V-305, nicht fest):
| Terrain | Partikel | Farbe | Auslöser |
|---|---|---|---|
| Gras/Wiese | Erdkrumen + Grashalm-Knetstückchen | Boden-Rolle dunkel + Laub | Schlupf, Drift, Landung |
| Sand/Wüste | heller Staub, weiche Wolke | Boden-Rolle hell | Fahrt > 40 % Tempo, Drift, Landung |
| Fels/Stein | graue Rauchwölkchen + kleine Splitter | Fels-Grau der Bühne | Landung, Aufprall |
| Erde/Lehm/Ton | ockerfarbene Knetbrocken | Boden-Rolle | Schlupf, Drift |
| Schnee | weiße Puffs | Weiß mit Himmelston | Fahrt, Landung |
| Straße/Platten | kaum Staub, nur Reifenrauch bei Drift | neutrales Grau | Drift |
   Spender für Form und Bewegung: `clay-vfx.v1.js` + `clay-particle-profiles.v1.json` auf main (`tools/KFB-ToolBox/_inbox/KFB World Core R0A · Clay World Donor/WORLD_CORE_MOBILITY_R0A_2026-09-29/lab-vfx/` bzw. Joyride-Schnitt `…/JOYRIDE_SESSION_2026-09-29/code/lab-vfx/`), Andockstelle eure Ereignisse aus §56.1.
4. **Audio-Bett (§58):** Quellen auf main, Inventar `skills/chat/workflows/KFB_AUDIO_SOUNDSCAPE_BASELINE_V1_2026-09-24/INVENTORY_AND_ARCHITECTURE.md`. Motor zuerst aus `media/3D_Assets/Audio/KFB Racer/` (`KFB_Steampunk_SciFi_Engine_Idle_Loop_12s_48k.wav`, `…_Throttle_8s_48k.wav`, eigene Erzeugung), Reifen `media/3D_Assets/Audio/ElevenLabs Audio/Seamless_car_tire_ro_…mp3`, Drohne/Antigrav `media/3D_Assets/Audio/kenney_sci-fi-sounds/Audio/engineCircular_*.ogg` bzw. `spaceEngineLarge_*.ogg` (CC0). Ein AudioContext (V-042), Pitch/Volumen aus `speed`/`thrust01`, Aufprall/Landung aus den Ereignissen. Formate wie vorhanden (wav/mp3/ogg), für die Auslieferung nach ogg/mp3 wandeln.
5. **§58 Punkte 1–3** (Schatten folgt dem Ziel, Kontaktschatten in M1 über `createContactBlobs`, weniger Rückstoß an Figuren als an Wänden): einverstanden, so umsetzen.

## 16.10.2026 · L2 Schritt 5 präzisiert (V-355, Georg GO)
Schritt 5 steht jetzt im Briefing `replies/BRIEF_WS1_LOOK_RUN_L2.md` (Hub b57) mit Reihenfolge, Abnahmepaket A | B | C und Messwerten; Grundlage ist zusätzlich die Web-Chat-Diagnose `replies/WS0_SPELLSPILL_LOOK_COHESION_DIAG_R1_2026-10-16.md` (SpellSpill nur als Bildreferenz). Billigste Naht zuerst (Tonemapping-Bypass, Rim/Fresnel, Gesichtslicht), keine VFX vor bestandenem Vergleich. WS0 baut gerade die entlichteten Texturen (Goblin Bank v2, Atlantis) für Variante C.

## 16.10.2026 · Auslieferweg und ein Look für alle Schichten – V-355, V-356
1. **build.json (§57) bestätigt** als `kfb.ws1-build/1` mit `{schema, commit, date, tests, links{stage,m1,car,lineup}, notes}` (bei mehrteiligem Build zusätzlich `entry`). Bitte ab sofort bei jedem Vorschau-Push mitliefern. WSA baut die Staging-Site auf der GPT-Plattform (Hub b62); Cloudflare bleibt nur Rückfall, bis sie läuft.
2. **Ein Look für alle Schichten (V-355)** – Georg sieht Terrain, Dioramen und Figuren als getrennte Schichten. WS0-Befund an eurer Vorschau (Goblin Bank, L1/B/Knet): eingemaltes Licht in den Meshy-Texturen + Echtzeitlicht = dunkle, matschige Dioramen neben hellen, reinen Figuren; einfarbiger Hintergrund ohne Boden; unterschiedliche Oberflächen. Als **L2 Schritt 5** einplanen (nach Schritt 4 Terrain): gemeinsame Tönung/Haze/Ambient für alle Schichten aus der Bühnen-`edgePalette`, Figuren-Umgebungslicht aus der Bühne (Hemi-Boden = Bühnenfarbe), gemeinsame Knet-Detail-Normal, Himmel ≠ Bodenfarbe mit Horizont; Messung: mittlere Helligkeit und Buntheit je Schicht (Figuren, Diorama, Terrain) im selben Kamerabild, Abweichung ≤ 15 %. WS0 liefert dazu entlichtete/normierte Meshy-Texturen (Farben bleiben).
3. Schöne Überraschung im Vorschaubild: die Radial-Auswahl mit den vier Rufen + „eigene Wörter“ – bitte bis Claude Design HUD R4 so lassen.

## 16.10.2026 · Stunt-Fahren: Spender-Karte (V-351)
WS0 hat die Spender im Stunt-Car-Race-Repo, im Deformer-Lab und in k2b gesichtet: `replies/STUNT_DONOR_MAP_R1.md` (Regeln mit Fundstellen, 11 Spender mit Pfad und Status, Werte, Lücken). Bitte mit dem abgleichen, was ihr aus Georgs Recherche-Link zieht, und Abweichungen im WS1_STATUS nennen. Wichtig: kein Stunt-Spender ist abgenommen; **Anti-Roll-Stabilisierung gibt es in keinem Spender** (nur Reset nach dem Umkippen) – das ist für M2 neu zu bauen. Reihenfolge: erst die M2-Fahrprobe nach V-347, dann ein eigener M3-Auftrag „Assisted Stunt“, sobald die Web-Chat-Recherche (V-352) da ist.

## 16.10.2026 · Antwort auf WS1_STATUS §52 (Fahrprobe, Drift) – gilt V-347
1. **B · k2b bekommt den Drift 1:1 aus der Vorlage sofort**, schon vor Georgs Wahl (Q/E nur im Auto, zu Fuß bleibt Strafen). Die K2-Kommentarzeile (Δ1) ist der bekannte Fehler – K3-Fassung nehmen.
2. **A · ecctrl: Nachbau ja**, gleiche Tasten, gleiches Gefühl nach k2b-FEEL (Hinterrad-Haftung kurz senken, Gier mit `driftYawGain`, Wiedergreifen nach `regripSeconds`). Beide Systeme sollen sich in der Probe nur in der Physik unterscheiden, nicht in der Bedienung.
3. Dazu aus V-347: **enger Wendekreis** mit A/D (Wert messen und nennen), **ecctrl kippt nicht** bei Kurvenfahrt mit Vollgas (tiefer Schwerpunkt, Lenkwinkel je Tempo kleiner – wie in eurem Plan), **großes Label** „Fahrphysik A · ecctrl / B · k2b“ und Tastenliste im Info-Symbol.
4. Euren Plan für die nächste Probe (echter Dragster v3, Hangabtrieb bei k2b, Hang ist keine Wand, Ruhe-Prüfung 2 s ohne Eingabe) bestätige ich. Reihenfolge: Maßstab-Umstellung (V-345) zuerst, dann diese Probe.
5. Vergleichsleiste für Look/Tageszeit/Knet/Tonemapping: sehr gut, so beibehalten; bitte die V-346-Korrekturen (Glow, Mund-Licht, Farbtreue Knet) dort direkt mit sichtbar machen.

## 16.10.2026 · M2 Fahrgefühl: Drift, Wendekreis, Überschläge – V-347
Georg (noch kein Urteil über die Engine):
1. **Drift wie in Joyride („Tokyo Drift“):** Q/E = Drift links/rechts, analog zum Strafen beim Gehen. Spender: die k2b-Drift aus J17 (`kfb-drive.k2b.js`: `driftMinSpeed 7.5`, `driftSteerScale 1.28`, `driftDampingScale 0.28`, `driftKickScale`, `driftYawGain`, `regripSeconds 0.34`; Lab-Kopie liegt im Snapshot-Ordner nicht bei – ihr habt k2b schon im Kandidaten). Bei ecctrl die gleiche Logik als Seitenschub/Grip-Abbau nachbilden.
2. **A/D = Lenken mit engem Wendekreis:** Das Auto muss sich auf kleiner Fläche umdrehen lassen (Ziel: Wenden auf ≈ 2 Wagenlängen bei Schritttempo; Wert bitte messen und nennen).
3. **ecctrl überschlägt sich zu leicht, besonders bei hohem Tempo:** tiefer Schwerpunkt bzw. Anti-Roll, Überschlag nur bei großen Sprüngen/harten Stößen; Selbstaufrichten bleibt.
4. **Orientierung in der Vorschau:** oben klein anzeigen, welches Fahr-System aktiv ist (ecctrl | k2b), Tastenliste im Info-Symbol (W/S, A/D, Q/E Drift, Leertaste, Shift, C, R).
5. Dann neue Fahrprobe mit **gleicher Tastenbelegung** für beide Systeme; Raster G0 plus: Drift auslösbar und wieder fangbar, Wendekreis gemessen, 0 Überschläge bei Vollgas auf ebener Strecke in 20 Läufen.

## 16.10.2026 · Georgs Look-Urteile – V-346 (TUNE, bitte in einem Schritt)
1. **Look B wird Standard.** Offen: Georg sieht einen anderen Skydome als bei A – bitte prüfen/erklären (soll derselbe Himmel sein, nur getönt). **GothGirls lila Glow** ist zu stark: Randlicht deutlich zurücknehmen (Rand nur als Hauch an der Silhouette). **FBs Mundpartie** ist zu dunkel: Fill bzw. Face-Light so, dass Mund und Augen klar lesbar sind (G1).
2. **Schattenlänge:** Georg fragt, ob sie an Tageszeit/Licht hängt. Bitte als Regel umsetzen und in einem Satz bestätigen: Schattenlänge und -richtung folgen der Sonnenhöhe/-richtung von `timeOfDay` (Tag kurz, Gold lang), nicht beliebig.
3. **Tonemapping:** Licht/Figuren wirken mit ACES besser, der **Boden ohne**. Vorschlag umsetzen: ACES global, Boden-Material mit `toneMapped:false` bzw. eigener Belichtung, damit er wie „ohne“ aussieht; Bildpaar zeigen.
4. **Knet:** FB bekommt Knet (`clay=all` als Standard). GothGirl wirkt **überstrahlt** → Knet-Profil/Belichtung für sie zurücknehmen. **Fahrzeuge:** Knet immer, aber die **Texturfarben dürfen nicht ausgewaschen werden** (heute blass/staubig) → Knet nur als Relief/Rauheit, Albedo fast unverändert (Sättigung ≥ 95 % der Meshy-Textur).
5. **Abnahmebilder** von Figuren und Fahrzeugen ab jetzt immer mit Knet-Textur.
6. **Fahrprobe** (ecctrl | k2b) ist noch offen; Maßstab-Umstellung (V-345) davon unabhängig zuerst.

## 16.10.2026 · Antworten auf WS1_STATUS §46–§51 – V-345
1. **Lab-Walker (§46):** liegt jetzt nur lesend im Register-Branch: `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/donors/lab-walker-2026-10-16/` (die sechs Dateien + `SOURCE.md` mit Zeilenhinweisen). Damit sind T1–T3 frei.
2. **Maßstab (§49.4): Entscheidung WS0 – WS1 stellt auf WS0-/J17-Meter um** (FB 1,81 m = 2,94 Rig × 0,616 m/Rig, Maßstab A aus J17). Ein Faktor für alles (Figuren, Amphitheater, Meshy-Slots ≈ × 0,65), Physik-Werte (Schwerkraft bleibt 9,81, Tempi nach V-020/M1-Messung, Radradius, Sprunghöhen) mit umrechnen und testen. Grund: J17 ist Goldstandard, alle WS0-Maße (Fahrzeuge 5,18 m, Bühnen-m/u, Ränder) und die k2b-/Lab-Vorlagen rechnen in diesen Metern; mit FB 2,79 m wirkt jede Bewegung bei 9,81 m/s² zäh. Bitte **vor** dem M2-Merge, als eigener kleiner Schritt mit Testreihe.
3. **Orc Brute (§48.4):** Original auf main: `media/3D_Assets/KayKit_Mystery_Series6/2 - August 2025 - Orc Brute/OrcBrute.glb` (Rig_Large). WS0 hat im Blender-Lauf eine Fassung mit schaltbaren Original-Augen und KFB-Augenankern gebaut (`OrcBrute.kfb-eyes.r1.glb`); sie kommt nach WS0-Prüfung mit Pfad. Für die Aufstellung reicht das Original.
4. **practicals / edgePalette (§49.5):** geliefert, siehe Eintrag „Bühnen-Ränder R1“ (`data/kfb-stage-edges-r1-2026-10-16`). Steine-Kit folgt.
5. **Georgs Wahl (§47/§48/§49/§51):** als Bildfragen im Hub: Look A|B, ACES|ohne, FB mit Knet, Fahrzeuge mit Knet, Fahrprobe ecctrl|k2b (WS0 empfiehlt ecctrl + J17-Tempo als Abstimmungsziel). Bis zur Antwort: nichts umstellen, M2 nicht mergen.
6. **M1 TUNE (§50):** Ruckel-Fix und T4–T6 gesehen, danke. Weiter mit T1–T3 aus dem Snapshot.

## 16.10.2026 · Bühnen-Ränder R1 geliefert (für V-341/V-342)
Branch `data/kfb-stage-edges-r1-2026-10-16` @d4e24f15: `media/3D_Assets/MeshyModels/browser/kfb-stage-edges.r1.json` (`kfb.stage-edges/1`, 19 Bühnen) + Proofs in `.../browser/stage-edges-r1/`.
- Je Bühne: `footprint` (Schnitt mit dem Bühnenboden, 33–40 Punkte, Uhrzeigersinn von oben, Einheiten u wie `marks`), ggf. `footprintBase` (inkl. Sockel bis 1,5 m unter Boden), `edgePalette` (3–5 Farben mit Anteil, OKLab-Cluster), `terrainMode` (`ground` | `plinth` | `island`), `terrainRing` (welcher Umriss ans Terrain anschließt).
- Regel: Bodenfarbe = `fromColors(edgePalette)` (V-342). Sockel-Bühnen giza_pyramid und portal_ruin schließen über `footprintBase` an; schwebende Inseln (akashic_library, mesa_island, nature_island, snow_island) bekommen keinen Terrain-Anschluss, ihr Felsrand bleibt sichtbar.
- marble_terraces: Bühnenboden = Ursprung (untere Terrasse, −0,305 u); `figures.floorY` im Slot sagt −0,042 u (obere Terrasse) – bitte für die Figuren weiter floorY nutzen.
- `practicals[]` (Format §43.4): goblin_bank (v2) 12 Stück (5 Laternen, 3 Pendellampen, Schreibtischlampe, 3 Edelsteine), atlantis 11 (Turmkristall, Kristallportal, Kronenjuwelen, Turmfenster, Poseidons Kronjuwel, eine Feuerschale). Einige liegen hinter der Kartentafel; das ist gewollt (Licht von hinten).
- Steine-Kit folgt mit dem Blender-Lauf.

## 16.10.2026 · Portal Ruin als echtes Portal – V-343
Neue Bühne `assets/meshy-stage-portal-ruin-2026-10-16` @22e382c9: `media/3D_Assets/MeshyModels/browser/kfb-meshy-portal-ruin.screen-a.v1.glb` + `.slot.json` (8 m/u).
- Georg (Hub st05): Der Ring ist ein **Portal**: hellblau-weißer, spiralig animierter Shader (Wirbel nach innen, additiv, weicher Rand, keine Schatten) auf einer Scheibe in der Ringöffnung; ein Pool-Licht (#bfefff) beleuchtet das Runen-Podest. Ring und Schlussstein bleiben frei.
- **Billboard nicht Standard:** `billboard.defaultVisible: false`; die Knoten `kfb_screen_frame` und `kfb_screen_slot` werden standardmäßig ausgeblendet (eigene Knoten, keine Mesh-Änderung) und erscheinen nur, wenn eine Karte gezeigt wird.
- `portal.plane` im Slot-JSON ist eine Schätzung (Mitte [0, −0,04, −0,31] u, Radius 0,37 u); bitte an die Innenkante des Rings anpassen.
- Reisefunktion kommt erst mit der Weltstruktur (V-289). Einplanung: mit dem Bühnen-Einbau bzw. L2; Abnahme Bild + kurze Videoschleife.

## 16.10.2026 · Antworten auf WS1_STATUS §43–§45 – V-342
1. **Story-Farbe (§45.1, §43.1, §43.3 Punkt 1):** Georg hat recht, die Karte hat keinen Story-Mode. Entscheidung: **Bodenfarbe kommt von der Bühne**, nicht von der Karte und nicht von einer Deck-Tabelle.
   - Quelle: `fromColors(edgePalette)` der Bühne (3–5 Farben, an der Basis gemessen). WS0 trägt `edgePalette` und `footprint` je Bühne mit dem Blender-Lauf R1 (17.10., b51 §E) in die Bühnen-Deskriptoren ein. Damit passt der Boden auch zum Terrain-Übergang (V-341).
   - Bis dahin: die heutige Bühnen-Tönung (V-286) als Platzhalter, **kein Story-Tint**. Die Ableitung aus dem Kartentext (`world-context`/computeContext) fliegt raus.
   - Story-Mode wird Spielzustand, gesetzt durch den W6-Wurf (Option A, später). Dann tönt `fromStoryMode(gewürfelt)` als Akzent (Licht/Rand), nicht den ganzen Boden. Den Würfel-Look liefert Claude Design mit HUD R4; WS1 baut ihn erst danach.
   - Korrigiert: V-331 Punkt 2 und L2 G6 lauten jetzt „Bodenfarbe aus der Bühne (edgePalette)“.
2. **Walker-Vorlage (§44.3, §45.2):** Die Lab-Fassung liegt lokal auf demselben Mac (nur lesen, Lab 5192 läuft für Georg): `~/Dropbox/CLAUDE/KFB Island Worldbuilder Lab/`
   - `src/main.ts` ab Zeile ≈ 307: Tastenbelegung und WoW-Maus (RMB lenkt die Figur, A/D strafen; LMB nur Kamera; beide = vorwärts; Tasten werden nur bei gedrückter Maustaste umgelegt, Z. ≈ 532–535); Z. ≈ 356: Leertaste-Antippen kürzer als ein Frame springt trotzdem.
   - `src/play/travel.ts` (`TravelKeys` inkl. `turnA`), `src/play/vendor/travel-core.j17.js` (Schema `wsa6`; Sprünge je Zustand Z. ≈ 168: stand / short aus Joggen / long mit Boost), `src/play/vendor/walk-controller.js`, `locomotion-profiles.v1.js`, `src/play/figure.ts` (Walker, gemessene Profile).
   - V-199 (1) ist dort behoben (Q/E strafen auch im Stand), nicht den alten Fehler übernehmen.
   - **Flug:** Ein gemessener Flug-Controller existiert im Lab **nicht** (V-024 war TBD). Freigabe als Neubau mit Vorlagen-Zeile (V-001 erfüllt durch diese Freigabe): WoW-Flug – Doppel-Leertaste im 400-ms-Fenster hebt ab (V-179); im Flug W vorwärts in Blickrichtung (mit RMB steuert die Kameraneigung das Steigen), A/D drehen, Q/E strafen, Leertaste halten = steigen, X halten = sinken, Shift = Schub; Bodenkontakt unter Landetempo = Landung und zurück ins Gehen. Look und Pose aus `KFB HUD Flight Board - Flight VFX/.../hud-flight/kfb-flight-vfx.js` (main: `hoverPose`, `FLIGHT_IDLE`, Takeoff/Land-Puff, Speed-Trails).
3. **Reihenfolge (§44.2, §45.3):** bestätigt. M1 TUNE vor M2; Owner-Sitzung wie in §45.3 (Kamera „Nah“ → L1 ohne Farbe → V-305-Einbau nach Punkt 1 → L1-Bildreihe → L2 Schritt 1–4).
   **Abnahme-Raster M1 TUNE (V-312):**
   - T1 V-022: im Stand A/D drehen, Q/E strafen (auch ohne W); RMB: Maus lenkt, A/D strafen; LMB nur Kamera; beide Tasten = vorwärts.
   - T2 V-023: Leertaste im Stand = Sprung auf der Stelle; aus Joggen = vorwärts; Shift+Leertaste aus Sprint = Weitsprung (Jump_Full_Long).
   - T3 Doppel-Leertaste < 400 ms = Abheben; einzelne Leertaste hebt nie ab; > 400 ms = zwei Sprünge.
   - T4 Flug nach Punkt 2; Frametime im Flug p95 ≤ 20 ms und ≤ 1,2 × Boden; Kamera ohne Ruckeln.
   - T5 Rampe auf der START-Achse begehbar, G = Geh-Umschalter, weiches Aufsetzen ≈ 0,15 s, Info-Symbol unten links.
   - T6 Figur folgt Hügeln statt durchzulaufen (V-199 (3)).
4. **Lokale Lichter (§43.3 Punkt 2, §45.2):** Pool-PointLight + additiver Leuchthof (`halo`) freigegeben. Emissions-Masken nur, falls die Höfe aufgesetzt wirken; dann liefert WS0 sie je Bühne. `practicals[]` für Goblin Bank v2 und Atlantis trägt WS0 im Format §43.4 ein (Blender-Lauf R1).
5. **Kontaktschatten KayKit (§43.3 Punkt 3):** freigegeben: nur Körper und Füße, Kopf ausgenommen. Weicht das Gesicht trotzdem messbar ab, kommt die Frage nach einer neuen Studio-Referenz zu Georg.
6. **Tonemapping (§43.3 Punkt 5):** Bildpaar ACES | ohne zeigen; Georg wählt. Kartenfläche bleibt `toneMapped: false`.
7. **Kamera „Nah“ (§44.2):** freigegeben, Ziel = Kartenmitte.
8. **Dioramen ins Gelände (§44.2):** Vorlage ist jetzt L2 Schritt 4 (V-341) plus WS0-Lieferung (Steine-Kit, `footprint`, `edgePalette`). Terrain-Spender: der Lab-Inselboden (`src/island`, Höhenfeld + Clay-Oberfläche) – erst Vorlagen-Zeile.
9. **Info-Symbol (§44.3):** passt; mehr HUD erst mit Claude Design HUD R4.

## 16.10.2026 · Look-Lauf L2 – V-340
Neuer langer Auftrag `replies/BRIEF_WS1_LOOK_RUN_L2.md` (Hub b57): baut auf L1 (V-329) auf. Drei Schritte, ein Lauf, Raster G1–G10 selbst messen, keine Prüferrunden: (1) L1 + warmer Krazy-Kat-Look B neben J17-Kontrolle A, Licht-Identität je Figur als Daten; (2) ein Knet-Material für KayKit-Figuren und alle Meshy-Fahrzeuge; (3) Aufstellung aller 14 Fahrzeuge + FB + Orc. Fahrzeuge: `assets/meshy-arcade3-marble-vehicles3-2026-10-16` @9bd8e037 (13 Racer v3 + neu `wasteland_beetle/`). M1 TUNE / M2 nicht umordnen; Einplanung bitte im WS1_STATUS. Fluff-HUD nicht bauen (kommt über Claude Design HUD R4).

## 16.10.2026 · Nachtrag zu V-333: Ziel-Pfeil in der Welt – V-334
- Georgs Vorbild ist WoW *Undermine*: Der 3D-Pfeil schwebt **über der Spielfigur bzw. dem Fahrzeug** in der Welt, nicht in einer HUD-Ecke; am Ziel ein Ring. Im HUD nur Name + Distanz (+ im Flug ↑/↓, Δ-Höhe). Mechanik aus V-333 bleibt (Gierwinkel, Flug-Neigung, ehrliche Distanz); der Overlay-Pass entfällt, Pfeil und Ring sind normale Objekte der einen Szene.
- Look von HUD, Pfeil, Ring und neuem **Social-Call-Radialmenü** (KayfaBINGO/BONGO/BOGGLE/Blödsinn! + eigener Text; die Spielfigur spricht die Wahl in ihrer eigenen Blase) kommt von Claude Design (HUD R4, `replies/HUD_R4_DESIGN/`). Bitte nichts davon vor der Design-Lieferung stylen; Mechanik-Vorarbeit hinter `?debug=1` ist ok.
- Beobachtung in `ws1-preview` (Intro-Ritual): das Kartenbild ragt rechts aus dem Kartenrahmen. Bitte bei Gelegenheit prüfen.

## 16.10.2026 · HUD-Kompass als 3D-Objekt – V-333
Georg will den Kompass/Entfernungsmesser für Quests und POIs im HUD. Heute ist dort (HUD R3) ein statischer SVG-/CSS-Pfeil: nur Nordrichtung, keine Distanz, keine Höhe.
- **Ziel:** ein echtes 3D-Clay-Pfeil-Objekt (GLB) im HUD, gerendert als Overlay-Pass im **einen** Three.js-Renderer (kein zweiter Kontext). Ein aktives Ziel (`TargetRef`: Quest/POI) mit Name + Distanz; Distanz ehrlich als „Luftlinie ~m“, solange keine Routenlänge existiert, keine erfundene ETA.
- **K1 (HUD-Slice nach M2):** Gierwinkel relativ zur Blickrichtung (`targetBearing − playerHeading`, kürzester Weg, gedämpft), Distanz, zu Fuß und im Fahrzeug ruhig waagrecht. Nähe-Farbe nur zusätzlich, nie allein.
- **K2 (mit Flugmodus V-274):** Pflicht-Neigung `pitch = atan2(Δy, max(hypot(Δx,Δz), ε))` um die lokale Querachse des Pfeils, kleiner Horizontring, ↑/↓ + Δ-Höhe; bei Ziel fast senkrecht: letzten Gierwinkel halten, „direkt über/unter“ anzeigen statt Zittern. Baut den Pfeil in K1 schon so, dass die Neigung nur freigeschaltet wird.
- **Asset:** WS0 liefert `kfb_hud_compass.glb` (Gehäuse aus KayKit RPG Tools Bits `compass_base`, CC0 auf main, + Clay-Nadel, Pivot in der Mitte, Nadel zeigt +Z) mit Pfad und Bild im nächsten Eintrag. Bis dahin Platzhalter nur hinter `?debug=1`.
- **Abnahme K1:** Bildpaar Ziel vorn / hinten / links; Pfeil dreht beim Umdrehen korrekt um; Distanz ändert sich stetig. **K2:** Prüfbilder Ziel waagrecht, +30°, −30°, senkrecht drüber.
- Quelle: Web-Chat R0.3 (`recovery/kfb-minigames-fluff-source-bridge-2026-10-15`, `skills/chat/recovery/KFB_HOME_RETURN_STONE_POI_3D_COMPASS_R0_3_2026-10-15.md`); Owner dort = Lab ist überholt, Laufzeit = WS1 (V-228). Ruhestein/Taschenportal aus demselben Dokument sind **nicht** Teil davon.

## 16.10.2026 · Antworten auf alle offenen WS0-Punkte (§32–§42) – V-331
1. **Auslieferweg (§40.6):** siehe V-314 – Branch `ws1/preview` → `https://ws1-preview.kayfabizarro.pages.dev/`; ihr dürft Georg die URL geben. Gilt auch für den M1-Zwischenstand.
2. **V-305-Einbau (§40.7):** freigegeben wie eure **Hauptvariante**: `kfb-cartoon-palette.js` 1:1 vendoren, `fromStoryMode(story-mode der Karte, 0)`, Story-Farbe auf dem Boden; Rollen Rahmen=`strang`, Pfosten=`trunk`, Leiste=`pad`/`cloud`, Himmel=`sky`→`cloud`, Gelände=`top`; Meshy 18 % zum Boden-Farbton; `island-palettes.js`, Genre-Tabelle und `palv=b` entfallen. Tageszeit-Regel für Himmel/Nebel steht im Licht-Briefing (`BRIEF_WS1_LIGHT_R1.md`). Bildreihe je Story-Mode + Paar heute | V-305 wie vorgeschlagen.
3. **Vorderer Ring / Rampe (§39.4 a/b):** Die Bühne muss zu Fuß erreichbar sein (Begegnung am Diorama, V-288). Bitte eine unsichtbare Rampe (Kollider) vor dem vorderen Ring auf der START-Achse, ≈ 3 m breit. Das WS0-Kollisionsnetz fürs Amphitheater entfällt für MVP-0; begehbare Netze kommen künftig je Bühne als optionales `walkable`-GLB im Bühnen-Deskriptor.
4. **Zaunhöhe (§38.3):** Variante **(a)** bleibt.
5. **V-248 Gehen/Sprint (§33.1, §39.4 d):** Rutschen 0,47/0,21 ist Clip-Eigenschaft – für MVP-0 **nicht blockierend**. Später Gehen/Sprint aus der Motion-Library-v7-Gangleiter (LOCOMOTION-LADDER-02) mit gemessenem Rutschen < 0,1 tauschen.
6. **Harter Halt beim Aufsetzen (§39.4 e):** weiches Abdämpfen (≈ 0,15 s) ist freigegeben.
7. **Strg auf dem Mac (§35.4):** G als Geh-Umschalter.
8. **V-023 Sprungarten:** nicht Teil von MVP-0.
9. **m1-gait vs. anim.mjs:** m1-gait ist das eine Gang-Modul; anim.mjs bleibt weg.
10. **Eigene M1-Schleife (§32):** bei M2 in die eine Host-Schleife zurückführen.
11. **Bewegtes Bildpaar Studio | M1 (V-214):** erst zum Meilenstein-Ende.
12. **Bühnen-Deskriptor `kfb.stage-descriptor/1` (§40.3):** freigegeben, ergänzt um `practicals[]` (V-329) und optional `walkable`.
- **Neu für die Bühnen-Vorlagen:** Arcade v3 (Billboard vor dem Neonschild) und Marmor-Terrassen sind von Georg PASS (V-330): Branch `assets/meshy-arcade3-marble-vehicles3-2026-10-16` @2633f354, dazu Fahrzeuge v3 (×1,5, Racer ≈ 5,2 m, `rigClassScale` large 1,70; Georg: Ohren dürfen im Auto knicken, V-321).

## 16.10.2026 · Licht-Auftrag L1 (V-329) – beantwortet §38.2 und Intake #404
- Briefing: `replies/BRIEF_WS1_LIGHT_R1.md`. Kurz: ein Licht-Schreiber; `timeOfDay` mit Tag (J17: Sonne #fff4e6/2,9, Hemi #eef4fa/#9a8a78/1,05, Gegenlicht #ffe6d6/0,6, Elev. ≈ 49°, Az. ≈ −53°), Goldener Stunde (E50 aus light-presets.json) und Story-Nacht; Farben aus V-305; Karte nie umgefärbt; nur die Sonne wirft Schatten (enger texel-gerasteter PCFSoft-Frustum, nur Figuren/Fahrzeug/Leit-Requisiten), Meshy-Dioramen werfen keine Echtzeit-Schatten; Kontaktschatten für alle Figuren; lokale Lichtquellen `practicals[]` je Bühne (Emission + Pool von 4–6 PointLights ohne Schatten).
- Probe L1 parallel zu M2 (M2 nicht umordnen): Dialogszene + Goblin-Bank v2 + Atlantis, je Tag/Gold/Nacht, 16:9 und 9:16; Raster G1–G5 im Briefing; Abnahme live über ws1-preview.
- Bitte bestätigt das `practicals[]`-Format im Bühnen-Deskriptor; dann trägt WS0 die Lichtpunkte für Goblin-Bank und Atlantis nach.

## 16.10.2026 · Deck-Songs im Hauptstand (jukebox.json)
- main @2ecac226 (PR #405): `media/3D_Assets/Sounds/kfb_deck_songs/<deckId>__suno_<ver>/` für wrinkle_rumble 01a, help_i_am_a_human 01e, kayfabizarro_monomyth_mayhem 01c, kayfabizarro_philosophy 01d – Mix, Stems, `meta.json` (kfb.deck-song.v1: bpm, Stimme, Dauer, sha256), Karaoke-`.srt` (eine Zeile je Karte, gegen den Mix getaktet). `jukebox.json` hat 4 neue Einträge (`group: "deck_songs"`, `deckId`, `srt`).
- Bitte bei Gelegenheit: Box-Stop-Radio liest jukebox.json noch fest von f510a35 → Pin auf main nachziehen; `srt`/`group`/`deckId` liest bisher kein Code (für Karaoke bzw. Deck-Performance V-279/V-298 später).
- Karten-Clips je Karte (Stimme bzw. mit Musik) und getaktete takes liegen im KFB_HUB `40_AUDIO/<deckId>__suno_<ver>/` (nicht im Repo).

## 15.10.2026 · Neue Bühnen: Grüne Ruinen (Verdant Ruins) + Alien-Werkstatt (V-318)
- **Branch** `assets/meshy-stages-verdant-alien-2026-10-15` @228f7459 (Parent main), `media/3D_Assets/MeshyModels/browser/`:
  - `kfb-meshy-verdant-ruins.screen-a.v1` – Meshy-Community (CC0), 12 m/u, Karte als Attika-Tafel auf dem Triumphbogen (Sandstein + Moosband, 5,3 × 2,9 m), Kampf auf der versunkenen Plaza ≈ 28 m²; Rücktreppe 6 × 0,16 m begehbar, Vordertreppe endet 0,85 m über der Plaza → Kollider mit Stufe/Rampe. GLB 17,4 MB (dichte Moos-Textur).
  - `kfb-meshy-alien-workshop.screen-a.v1` – 6 m/u, Innenraum ≈ 11,4 × 8,3 m, Karte als genieteter Laborschirm vor dem Globus-Monitor (2,2 × 1,2 m), Kampf vorn ≈ 9 m²; Leitertreppe 46° nur als Kletter-Kollider.
- Georgs Bestätigung: Hub st04. Einbau nach MVP-0 als Vorlagen-Zeile.

## 15.10.2026 · Fahrzeuge v2: Größe für Medium-Rigs + Logos überklebt (V-315)
- **Branch** `assets/meshy-dieselpunk-vehicles-2026-10-15` @d26b6860: jetzt alle 13 Fahrzeuge, je `<id>_browser.v2.glb` + `<id>.kfb-vehicle.v2.json` neben v1. v2 = v1 × 1,92 (sitzender FB mit Ohren passt in die geschlossene Kabine des Dragsters, Dach 5,8 cm); Racer ≈ 6,6 m, Laster ≈ 8,6 m. `rigClassScale { medium: 1.0, large: 1.33 }` (large = Vorschlag). Anker, Radstand, Spur, Radius, Kamera, Kollision mitskaliert.
- **Logos:** graffiti_jet_cruiser, ironclad_wrecker, street_racer_hoverbeast überklebt (Textur `*_basecolor_v2_aufkleber.webp` ist in der v2-GLB).
- **Bitte:** Fahrzeuggröße als Laufzeit-Regler (Georg urteilt beim Fahren; Hub dv02: evtl. ~×1,5, wenn Ohren knicken dürfen). Erstes Auto bleibt crimson_flame_dragster.

## 15.10.2026 · M2: erstes Auto = Flammen-Dragster, Autos werden größer (V-315) · Cabrio später (V-316)
- **Erstes Auto:** `crimson_flame_dragster` (Georg, Hub dv01). Bis die v2-Größe da ist, den v1-Branch nutzen und den Laufzeit-Faktor offen lassen.
- **Größe:** Georg: Autos größer, damit FB plausibel hineinpasst. WS0 misst den Faktor (sitzender FB mit Ohren passt in die geschlossene Kabine) und liefert alle Racer als v2 mit `rigClassScale { medium, large }`. Bis dahin bitte Größe als Laufzeit-Faktor je Rig-Klasse vorsehen.
- **Später (V-316, nicht M2):** FB sichtbar im Cabrio wie J17: wenig Körperbewegung, flatternde Ohren, Kopf/Schulter neigen sich in Kurven, Hände halten Kontakt zum Lenkrad des Modells.

## 15.10.2026 · M2-Fahrzeuge da: 10 Dieselpunk-Racer auf Asset-Branch (V-311, V-313)
- **Branch** `assets/meshy-dieselpunk-vehicles-2026-10-15` @9f5c0f48 (Parent main), `media/3D_Assets/MeshyModels/vehicles/<id>/`: `<id>_browser.glb` (100–120k Dreiecke, 3,5–6 MB, WebP 2048), `<id>.kfb-vehicle.json` (Form wie bathtub_kart, `entryMode: "hop-in-hidden"`), `<id>_receipt.json`.
- **Fahrzeuge:** brasswing_roadster, crimson_flame_dragster, crimson_thunderjet (offen/Cabrio), iron_phantom_hovercar, ironclad_skycruiser, jetbound_roadster, rust_runner, rustfire_interceptor (ohne Scheiben), rustwing_cruiser, rustwing_hauler (Laster). Nicht auf dem Branch: graffiti_jet_cruiser, ironclad_wrecker, street_racer_hoverbeast (echte Markenlogos auf der Textur – erst übermalen).
- **Normierung:** Front +Z, Boden y = 0, KayKit-Rig-Einheiten (1 Rig = 0,6164 m, Figuren 1:1); Racer ≈ 5,6 Rig = 3,45 m, Laster ≈ 7,3 Rig = 4,5 m. Größe bitte als Laufzeit-Faktor einstellbar (Georg urteilt beim Fahren).
- **Räder:** bei allen Rad-Fahrzeugen mit der Karosserie verschmolzen (nicht sauber schneidbar) → leere Naben-Anker `kfb_wheel_FL/FR/RL/RR` (Ursprung Nabenmitte, Spin lokal X, Extras `kfb_fused`, `kfb_radius`), Radstand/Spur/Radius im JSON → unsichtbare ShapeCastWheels auf diese Anker. Schwebe-Fahrzeuge: `kfb_hover_FL/FR/RL/RR`. Bodenfreiheit im Netz fast 0 → Fahrhöhe als Laufzeit-Wert (Vorschlag 0,35–0,6 Rig).
- **Weitere Anker:** `kfb_entry` (Bodenpunkt an der linken Tür), `kfb_driver_hidden`, `kfb_camera_follow`.
- **Welches zuerst:** Georg wählt im Hub (dv01); Vorschlag WS0: rustfire_interceptor oder jetbound_roadster. G0 mit Platzhalter läuft davon unabhängig.
- **Maßstab-Hinweis:** FB_TEMPLATE_LOOK_v5b misst 2,94 Rig = 1,81 m mit Ohren (nicht 2,16 m), Orc Brute 4,19 Rig = 2,59 m – bitte gegen euren kanonischen Faktor prüfen und melden.

## 15.10.2026 · M2 freigegeben (V-313) · Auslieferweg = Branch-Vorschau ws1/preview (V-314)
- **M2 „Fahren übers Gelände“:** euer Entwurf passt und ist so beauftragt. Freigegebene Fassung mit WS0-Ergänzungen und Antworten auf eure fünf Fragen: `replies/BRIEF_WS1_M2_FAHREN_R1.md` (Abschnitt „WS0-Freigabe und Ergänzungen“). Kurz: G0-Vergleich k2b vs. EcctrlVehicle **sofort mit Platzhalter**; erstes Fahrzeug ein Dieselpunk-Racer zum Hineinhüpfen, Asset kommt von WS0 (Räder als Knoten mit Naben-Drehpunkt, Anker); M2 = die eine Fahrzeug-Steuerung; viel Fahrhilfe als ein Tuning-Objekt; Raster: Aufrichten < 2 s, 0 Durchfahrten in 20 Replays, 60 fps Median, kein Frame > 33 ms beim Sprung.
- **Auslieferweg (§40.6):** Branch `ws1/preview` mit nur dem statischen Bundle (`index.html` in der Wurzel) → `https://ws1-preview.kayfabizarro.pages.dev/`. Pages liefert `media/2D_Assets`, `media/3D_Assets`, `.md/.fbx/.zip` nicht aus, max. 25 MiB je Datei → Assets ins Bundle. Push = Vorschau-URL; ihr dürft Georg die URL geben, bitte mit Commit in WS1_STATUS; WS0 stellt sie in den Hub. Gilt sofort auch für den M1-Zwischenstand.

## 15.10.2026 · SOFORT: Prüfstrategie verschlanken (V-312) – keine Vollcode-Prüfer je Runde mehr
- **Georg:** Blinde Prüfer lesen je Runde ~280k Token Code und laufen ~35 min Browser, mehrfach; danach wird nachgebaut und alles läuft neu. Beim jetzigen Spielstand unsinnig und Token-Verschwendung. Das war ein Planungsfehler von WS0 (Abnahme-Kette G3 „blinder Prüfer bei sichtbaren Teilen“) – nicht euer Fehler. G3 ist geändert.
- **Ab jetzt:** (1) Jede Aufgabe kommt mit einem Abnahme-Raster aus Georgs Vorgaben (messbar + feste Bildserie); wo es fehlt, fragt WS1 WS0 danach, statt einen Prüfer laufen zu lassen. (2) WS1 prüft selbst nur den Diff: geänderte Module + kurzer Browser-Rauchtest mit fester Kamera-/Bildserie, Ziel ≤ 5 min, keine Vollcode-Lektüre. (3) Regress-Tests bleiben automatisch. (4) Blinder Prüfer nur einmal am Meilenstein-Ende (MVP-0-Abnahme), nur auf Diff + Bildserie. (5) Nichts nachbauen auf Prüfer-Hinweise, die nicht im Raster stehen – erst an WS0 melden.
- **Laufende Prüferrunden** (§39 „vierter Prüfer“): bitte jetzt beenden; offene Auflagen als Liste an WS0, WS0 entscheidet, was davon zählt. Je Runde im WS1_STATUS Token- und Minutenverbrauch ausweisen.

## 15.10.2026 · Bühnen v2 nach Georgs Antworten + Retro-Arcade-Casino (V-306, V-309)
- **Branch** `assets/meshy-stages-v2-arcade-2026-10-15` @8cf2ec71 (Parent main), unter `media/3D_Assets/MeshyModels/browser/`. Ersetzt für diese Bühnen die v1-Slots:
  - `kfb-meshy-goblin-bank.screen-a.v2` – Karte statt grüner Kurstafel an der linken Wand (Messingrahmen, 3,6 × 2,0 m, 2 Konsolen 0,37 m vor der Wand wegen der Laternen).
  - `kfb-meshy-prison-panopticon.screen-a.v2` – Stahlrahmen-Billboard oben mittig auf dem Ringdach-Geländer (7,1 × 4,0 m, Unterkante 8,7 m), Parole frei.
  - `kfb-meshy-utopia-stage.screen-a.v2` – Display ohne Abstand nach oben direkt vor dem Monitor, deckt den Monitor-Fuß (Fuß ist Teil des Meshy-Netzes, nicht schneidbar).
  - `kfb-meshy-retro-arcade-casino.screen-a.v1` – neue Bühne, 8,5 m/u, Billboard über dem Galaxy-Neonschild (Chrom-Clay, pinkes Band, 4,8 × 2,7 m), Kampf ≈ 21 m² auf dem Stern-Mosaik, zwei Treppen 0,14 m begehbar (Stufen-Kollider), Galerie +2,9 m.
- Georgs Bestätigung: Hub st03. Einbau nach MVP-0, je Bühne eine Vorlagen-Zeile; Platzierung später per God-Mode-Editor (V-306).

## 15.10.2026 · Georgs Hub-Antworten: Farbmodell PASS, Bühnen-Abnahmen, Display-Editor (V-305, V-306)
- **Farben (V-305):** Harmonie-Modell PASS. Einzige Quelle für Paletten ist jetzt `replies/COLOR_HARMONY_R1/kfb-cartoon-palette.js` (`fromHue`, `fromColors`, `fromStoryMode`, `random`; README dort). Story-Farbe bleibt auf dem Boden. Fluff: High = satte, Low = dunkle Story-Mode-Farbe. Die Paletten-Vorlage V-270 (Hub pal02) ist überholt – bitte die Rollenfarben aus dem Generator ziehen statt aus den Joyride-Einzelpaletten (der Generator baut J17 mit ΔE ≈ 0,025 nach). Meshy-Tönung 18 % bleibt (V-286).
- **Schatten:** Georg hat gesehen, dass GothGirl jetzt Schatten wirft (§38) – danke. Das Licht-Briefing (Tageslicht-Basis, einheitliches Schatten- und Farbkonzept, §38.2) liefert WS0 nach.
- **Bühnen (V-306):** st01 PASS alle; Köln echter Maßstab 1:1 (ggf. später kleiner, betrifft OSM-Skalierung und Zellgröße Destruction-Mech); Dystopia Standard = B unten vor dem Rolltor; Goblin-Bank: Karte statt grüner Kurstafel; Gefängnis: Spruch bleibt, Billboard mit Stahlrahmen oben mittig am Geländer; Atlantis: am Turm; Utopia: ohne Sockel, raumsparend schwebend/an der Wand. WS0 baut die geänderten Fassungen (v2) und meldet neue Branches.
- **Display-Editor (präzisiert V-287):** Alle 3D-Billboards und die Hypernormalisation-Display-Modelle sind im God-Mode per 3D-In-Place-Editor frei verschieb-, dreh- und skalierbar, mit responsivem Seitenverhältnis für den KFB-Karten-Fit. Unsere Platzierungen = Standardwerte. Für MVP-2 einplanen.

## 15.10.2026 · Neue Bühne: Atlantis (Hidden-History-Decks)
- **Branch** `assets/meshy-stage-atlantis-2026-10-15` @d3326a6a (Parent main): `media/3D_Assets/MeshyModels/browser/kfb-meshy-atlantis.screen-a.v1.glb` + `.slot.json` – 11 m/u, Insel Ø ≈ 20,5 m, Karte als versunkene Tempeltafel am Kristallturm (Sandstein + blaues Einlageband, 4,7 × 2,6 m), Kampf auf dem unteren Dreizack-Mosaik (≈ 7,5 × 3,3 m, eben), obere Plaza 2,7 m höher. Haupttreppe 12 × 0,22 m (≈ 40°, nur 0,7–0,8 m breit) → Rampen-Kollider; Turmportal-Stufen dekorativ.
- Georgs Abnahme der Platzierung offen (Hub at01). Einbau nach MVP-0 als Vorlagen-Zeile, wie Goblin-Bank/Gefängnis.

## 15.10.2026 · Neue Bühnen: Goblin-Bank + Gefängnis-Panoptikum (V-300/V-301) · Atlantis folgt
- **Branch** `assets/meshy-stages-goblin-prison-2026-10-15` @48b0f492 (Parent main), unter `media/3D_Assets/MeshyModels/browser/`:
  - `kfb-meshy-goblin-bank.screen-a.v1.glb` + `.slot.json` – 5 m/u, Karte als Kurstafel über der Galerie (Messing-Knetrahmen, 4,2 × 2,3 m), Kampf in der Schalterhalle vor dem Tresor (~4,2 × 3,2 m), Treppe 14 × 0,20 m (42°) begehbar, besser Rampen-Kollider. Feine helle Säume an Schreibtisch-/Teppichkanten kommen aus der Vereinfachung.
  - `kfb-meshy-prison-panopticon.screen-a.v1.glb` + `.slot.json` – 12 m/u, Karte als Propaganda-Schirm der Wärter unter der Wachturm-Krone (Rost-Eisen, 5,0 × 2,8 m), Hof Ø ≈ 13 m, Kampf ≈ 30 m² vor dem Brunnen, Treppe 32 × 0,21 m (31°) begehbar. Für später (Gizmo-Labyrinth, V-301): Anschluss vorn 7,8 m offen, Schaltpult-Platz oben auf dem Turm (Messwerte im Receipt, lokal bei WS0).
- Slot-JSON im UFO-Format mit Standardkamera; Display = eigenes Objekt, Position aus dem Slot nur als Standardwert (V-287). Georgs Abnahme der Platzierung offen (Hub gb01, pr01) – Einbau nach MVP-0 als je eine Vorlagen-Zeile.
- **Atlantis** (Hidden-History-Decks) wird gerade gleich aufbereitet und folgt auf eigenem Branch.

## 15.10.2026 · Farbkonzept R1 liegt vor (Entwurf) · alte Fahrbahn-/Bandenfarben
- **Einzige Farbquelle (Entwurf, Georg klärt Lücken):** `replies/COLOR_CONCEPT_R1.md` + `replies/kfb-color-concept.r1.json` (Werte 1:1 aus Quellen mit Blob/Commit). Bitte lesen; noch nichts umbauen außer der Tönung nach V-286.
- **Sofort korrigierbar (Register V-102/V-174):** Fahrbahn `#3d4a60` statt `#545e7a`, Banden/Randstrang `#ef5a22` statt rot-weiß (rot-weiß nur Kerbs). Das Farbkonzept fand die alten Werte in eurem Lab-Stand.
- **Offen bei Georg:** Story-Mode Absurd (Ocker oder Magenta), Fluff-Farben je Story-Mode, Regel für dunkle/sattere Variante, Stärke der Meshy-Tönung.

## 15.10.2026 · Reisen: freie Fahrt übers Gelände (V-290), Dramaturgie (V-288), Welt offen (V-289)
- **Dramaturgie:** Grund zu reisen → Reisen macht Spaß → Begegnung am Diorama als Höhepunkt (V-288).
- **Fahren (V-290, ersetzt die feste Vorgabe J17 k2b aus V-251):** rasante Cartoon-Fahrt mit plausibler Physik direkt übers Gelände, Hügel als Rampen, Überschlag erlaubt und Selbstaufrichten, kein Racetrack nötig. Bitte für MVP-1 eine Vorlagen-Zeile: J17-k2b-Fahrgefühl vs. Fahrzeug-Controller im R3F/Rapier-Rahmen auf einem Testgelände (Hügel, Rampe, Überschlag), Messwerte + kurzes Fahrvideo; Vorschlag, welcher schneller und zuverlässiger ist. Fahrzeug für die Probe: Badewannen-Kart (WS0, folgt auf Asset-Branch) oder Cicada.
- **Welt-Struktur (V-289):** offen, Konzept `replies/WORLD_CONCEPT_R1.md`; nichts dazu bauen, bis Georg entscheidet.

## 15.10.2026 · Displays im God-Mode frei platzierbar (V-287)
- Karten-Displays/Billboards sind Objekte wie Residents und Librarian-Props: im God-Mode (MVP-2) verschieben, drehen, skalieren – proportional mit festem Format 1,79:1, vom kleinen Monitor bis zur Stadionleinwand. Gespeichert in `kfb.world/1`.
- **Folge für den Bau jetzt:** Display = eigenes Objekt (Rahmen-Familie je Bühne + `kfb_screen_slot`), nicht mit dem Bühnen-GLB verschmolzen. Die `*_screen.glb` von WS0 enthalten Slot/Rahmen nur als Start-Platzierung; beim Einbau Rahmen + Slot als eigenes Objekt laden und die Position aus dem Slot-JSON als Standardwert nehmen. Auch das Amphitheater-Billboard ist nur Arbeitshypothese.

## 15.10.2026 · Farben: Meshy-Bühnen nur leicht tönen (V-286)
- **Georg:** Meshy-Bühnen nur leicht tönen; die Palette wirkt auf Rahmen und Requisiten. Konkret: Die Rollen-Umfärbung der Amphitheater-Textur (stone/paved, Anteil 0,85) zurücknehmen auf eine leichte Tönung (Vorschlag: höchstens ~15–20 %, Textur bleibt lesbar). Die volle Palette (sechs harmonische Farben mit Rollen) gehört auf Billboard-/Display-Rahmen, Pfosten, Requisiten, Fluff, Himmel und Licht.
- **Farbkonzept wird konsolidiert:** WS0 schreibt `replies/COLOR_CONCEPT_R1.md` + `kfb-color-concept.r1.json` (Welt-Paletten, Story-Modes, Fluff-Farben je Story-Mode, dunkle und sattere Variante) als einzige Farbquelle. Bis dahin an den Farben nichts Neues bauen; nur die Tönung zurücknehmen, als Vorlagen-Zeile mit Bildpaar vorher | nachher.

## 15.10.2026 · Antworten auf §33–§35 (V-283)
- **Ränge (§35.6):** Option 2 – in MVP-0 sind die Ränge Kulisse ohne Begehen; die Kollision soll das Betreten verhindern. Die Prüfung „Ränge“ gehört nicht zur MVP-0-Abnahme. Fuß-IK/Stufenlogik kommt später als eigene Vorlagen-Zeile (MVP-1; zuerst Spender in J17/Lab suchen).
- **Kollisionsnetz Amphitheater (§34.4/§31):** WS0 baut ein vereinfachtes Kollisionsnetz (Rückwand-Sockel, Ränge als saubere Blöcke) und liefert es als eigenes GLB; bis dahin die Rückwand-Stelle nur berichten.
- **Paletten V-270 (§34.1):** Bilder liegen bei Georg im Production Hub; sein Urteil kommt hierher. Gleiche Akzente canyon/kfb_town: so lassen, bis Georg etwas sagt.
- **Offene Prüfer-Punkte (§35.4):** WS0 beantwortet sie gesondert, sobald geprüft (eigene Schleife, m1-gait vs. anim.mjs, Strg auf dem Mac, V-023, Bildpaar gegen das Studio). Bis dahin nichts davon umbauen.

## 15.10.2026 · Bühnen-Assets: Bibliothek mit Slot, Dystopia, Utopia, Comic (V-264, V-268, V-281)
- **Bibliothek vermessen:** Branch `assets/meshy-stages-library-dystopia-2026-10-15` @8e7519ea, `media/3D_Assets/MeshyModels/browser/kfb-meshy-utopia-library.screen-a.v1.glb` + `.slot.json` – `kfb_screen_slot` + `kfb_screen_frame` (antiker Knet-Holzrahmen, Wandbild über der Galerie, 3,41 × 1,90 m, 5,5 m/u, Standardkamera im JSON). Ersetzt für den Einbau die Fassung ohne Slot.
- **Dystopia-Gasse:** gleicher Branch, `kfb-meshy-dystopia-alley.screen-a.v1.glb` (6 m/u, Display ohne Sockel vor der Hypernormalization-Tafel). Georgs Abnahme offen – bis dahin nicht einbauen.
- **Utopia + Comic-Broadcast:** `assets/meshy-stages-utopia-comic-2026-10-15` @8ce77add (Comic PASS; Utopia Wand-Display nach TUNE, Abnahme offen).
- Alle Slot-JSONs im UFO-Format (Ecken, UV flipY = false, Sichtöffnung, Maßstab, Standardkamera, Rahmen). Weitere Bühnen (Theater, Giza, Köln mit Roncalliplatz, Akashic, Mesa, Nature, Snow) sind in Arbeit. Einbau nach MVP-0, je Bühne eine Vorlagen-Zeile.

## 15.10.2026 · Antworten auf §27/§28 · Paletten-Vorlage frei · Fluff-Farbschema gefunden
- **Vorlagen-Zeile V-270 (Paletten als Harmonie-Systeme): freigegeben** wie beschrieben (Lab `palettes.ts`/`ENV_ROLES` 1:1, Rollen je Bühnenteil, Normalen-Kriterium waagrecht/senkrecht, Genre-Tabelle als Vorschlag). Georg urteilt an den sechs Einzelbildern plus Bildpaar alt | neu.
- **Story-Tint-Quelle (Fluff-Farbschema):** `storymode.v4.js` – die sechs Story-Modes als Farbräume, gemessen aus der gedruckten Story-Mode-Tabelle (kayfabizarro.pages.dev #kfb), mit `base`/`accent` je Modus, `deep`/`light` abgeleitet, weicher Übergang 1,4 s. Liegt jetzt auf dem Register-Branch unter `replies/donors/storymode.v4.js` (Original: KFB Shader Duo Tone v1 / kfb-bg-shader-kit 2026-09-02). Daten 1:1 übernehmen, Tint höchstens ~15 % über der Palette.
- **Daten-Pin:** bitte von @a71de421 auf **@52adc8f1** (Generator-Fix, `anti_rules_toolkit` jetzt verified, alle anderen Decks bytegleich). Danach darf Anti-Rules gezeigt werden, wenn das OCR-Audit es als SAFE führt.
- **Gedankenstrich in der Blase (§27.2/4):** Schriftfrage, Text bleibt; nicht ändern.

## 15.10.2026 · Kartentitel vereinheitlicht (V-271) · neuer Daten-Pin
- **Branch** `data/kfb-card-title-case-2026-10-15` @eade4aec (Parent @233efd5): 1503 Titel in 44 Decks von Versalien auf normale Schreibweise, z. B. „Jean-Jacques Rousseau“; Akronyme bleiben groß. Die Druck-Schreibweise steht in `cardNamePrint`. Liste alt → neu: `media/kfb/CARD_TITLE_CASE_R1.md`.
- **Bitte Karten-Daten auf @eade4aec pinnen** (statt @233efd5). Systeme, die über den Titel zuordnen, müssen den neuen Titel nehmen; `cardNamePrint` nur für Abgleich mit dem Kartenbild.
- **Registry nachgezogen:** Branch `data/kfb-registry-title-case-2026-10-15` @a71de421 (Parent @eade4aec), mit dem Repo-Generator `tools/asset_registry/decks.py` neu erzeugt: 130 Decks, 6984 Karten, Titel = Kartendaten (Abgleich über Deck + Nummer, 6984/6984). Mit dabei sind alle Kartentext-Änderungen seit dem letzten Registry-Lauf (Druck-Kanon).
- **Generator-Fix Anti-Rules:** Branch `data/kfb-registry-generator-offset-2026-10-15` @52adc8f1 (Parent @a71de421): neues optionales Feld `trailingPages` in `media/kfb/index.json` (nur anti_rules_toolkit: Deckblatt vorn + Rückseite hinten); `anti_rules_toolkit` jetzt `verified`, 56/56 Karten mit Seite/Viertel, am Seitenbild geprüft. Alle anderen Decks bytegleich. `coverOffsetStatus` dort = `manifest-checked`. **Pin für Kartendaten und Registry jetzt @52adc8f1.**

## 15.10.2026 · Georgs Urteile: Besetzung, Paletten, Kartentitel (V-269–V-271)
- **Zweite Figur (F-4): GothGirl** (V-269). Bitte so in die Dialog-Szene; Feinschliff des Augen-Profils macht Georg im Studio, keine WS1-Werte.
- **Paletten (V-270): TUNE.** Georg: „das sind nicht einfach nur eine Farbstimmung – das sind harmonische Paletten mit Akzenten“ (Joyride: canyon, bucht, otown). Quellen:
  - Joyride-Paletten 1:1: `track-look.v5.js` WORLDS (J17-Spender) bzw. Lab `src/palettes.ts` (Rollen für sky, top, hill, sand, rim, under, rock, tower, leaf, trunk, cloud, water, path, Straße/Strecke/Strang).
  - Regel V-051 und Lab-Plan `KFB_WORLDBUILDER_PLAN_R1.md` (Schema `kfb.island-theme/1`): Sechser-Palette + Rollen; **storyTint** = leichte Einfärbung je Story-Mode (High-/Low-Vibrational-Fluff) über dem Grundthema, nie statt ihm.
  - Bitte das Paletten-Konzept daran prüfen und einen neuen Vorschlag als Vorlagen-Zeile machen: Rollen für alle Bühnenteile (nicht nur Rahmen und Himmel), Akzente, Story-Mode-Tint aus dem Fluff-Farbschema; Bildfolge je Palette nach V-253.
- **Kartentitel in Versalien (V-271):** WS0 vereinheitlicht sie zentral in den Kartendaten (eigener Daten-Branch, Meldung folgt). Bitte nichts selbst umschreiben.
- **Bühnen:** Comic-Broadcast-Diorama PASS (V-268), Utopia folgt nach einem kleinen Fix (Display ohne Sockel an der Wand). Assets kommen gesammelt auf einen Asset-Branch; Einbau nach MVP-0.

## 15.10.2026 · Antworten auf §24–§26 · Bibliothek (V-264)
- **Vorlagen-Zeile V-256 (Bildflächen-Modul): freigegeben**, mit zwei Korrekturen:
  1. Der UFO-Slot ist nicht mehr ≈ 1,60, sondern **1,79:1** (V-259) und liegt bereit: Branch `assets/meshy-ufo-cockpit-2026-10-15`, `media/3D_Assets/MeshyModels/browser/kfb-meshy-ufo-cockpit.screen-up179.v1.slot.json`. Karten füllen ihn randlos. Papierrand nur, wenn ein Träger wirklich ein anderes festes Format hat; nie beschneiden.
  2. Die Träger-Varianten stehen jetzt in V-262 (Amphitheater gemauert, UFO Monitor, Bibliothek Wandbild) und kommen nach dem Schnitt als eigene Vorlagen-Zeilen.
  - Reihenfolge (B1 schneiden pixelgleich → `video` → UFO-Slot) und CSS3D-Ebene im Host: so umsetzen.
- **Zitate und Hypernormalisation-Loops:** Richtig, vorerst nur `card` und `video`. Quellen (kuratierter Zitat-Pool, Loop-Dateien mit Rechten) liefert WS0 später mit eigener Vorlagen-Zeile.
- **Drift (§24.2):** Für MVP-0 hinnehmen. Die Dialog-Szene wählt bevorzugt Karten von drift-freien Seiten (Auswahl, nicht Beschnitt). Ein Neu-Export der betroffenen Seiten geht in WS0s Daten-Rückstand.
- **Host R1.3:** als zurückgezogen markiert in `replies/KFB_HOST_CONTRACT_R3F_R1.md`.
- **Besetzung F-4 und Paletten:** Georg hat beide als Einzelbilder im Production Hub. Seine Wahl kommt hierher.
- **Bibliothek (V-264):** Branch `assets/meshy-library-2026-10-15` @63f9e73b, `kfb-meshy-utopia-library.browser-a.v1.glb` (17,9 MB) + `….stage.json`. Maßstab 5,5 m pro Einheit; Kartenfläche = Wandbild über der Galerie (3,4 × 1,9 m), Standardkamera im stage.json. Einbau nach MVP-0.

## 15.10.2026 · Bildflächen-Träger je Bühne (V-262), Frankenstein-Standard (V-260/V-261)
- **Amphitheater:** Das Billboard bekommt einen Knet-gemauerten Rahmen passend zu Torbögen und Mauerwerk (Georg hatte das schon angesprochen). Inhalt weiter über das Bildflächen-Modul (V-256), 1,79:1. Vorschlag bitte als Vorlagen-Zeile.
- **Bibliothek:** neue Meshy-Bühne; WS0 prüft gerade die Fläche (antiker Knet-Holzrahmen oder Fläche im Raum) und liefert eine Browser-Fassung. Erst danach einbauen.
- **Figuren:** Meshy-Figuren kommen künftig als Frankenstein (KayKit-Körper + Meshy-Kopf am Kopfknochen). WS0 baut gerade die Probe Lord Hunky und Lady Dory auf dem KayKit-Astronauten; das Gesicht entsteht in der WSA-ToolBox. Für MVP-0 nichts ändern.

## 15.10.2026 · UFO-Cockpit mit Bildfläche liegt bereit (V-259) · Einbau nach MVP-0
- **Branch** `assets/meshy-ufo-cockpit-2026-10-15` @b9a46d1c, Ordner `media/3D_Assets/MeshyModels/browser/`: `kfb-meshy-ufo-cockpit.screen-up179.v1.glb` (14,1 MB, ohne Steuerknüppel) und `….slot.json`.
- **Bildfläche** = Mesh/Node `kfb_screen_slot` (gewölbt, unlit Platzhalter). Das Bildflächen-Modul (V-256) setzt Inhalte darauf; kein Billboard davor. Ecken, Flächenformel, UV (flipY = false) und die sichtbare Öffnung stehen im slot.json.
- **Maß:** 8 m pro Einheit (V-257), Bodenmitte = Ursprung. Embedding-Standard 1,79:1; Karten passen das Embedding an ihr Format an, ohne schwarze Ränder (V-259).
- **Reihenfolge:** erst die Dialog-Szene (MVP-0), dann Einbau mit Vorlagen-Zeile in WS1_STATUS.

## 15.10.2026 · Bühnen-Kamera (V-257)
- **Frei bewegliche Orbit-Kamera** für Spieler und Zuschauer: 360° drehen, Zoom zum Cursor, Panning, Fokus auf Klick. Ruhig und nicht zu empfindlich (V-026).
- **Standard-Blick** als Startpunkt: Die Figuren stehen am Rand der Bildfläche (Billboard bzw. später UFO-Monitor), die Bildfläche bleibt frei, davor liegt offene Spielfläche wie eine Bühne oder ein Wrestling-Ring.
- **`cam=near` bzw. `two`** bleiben als Sprungmarken („Standard“, „nah“), nicht als einzige Option. Der Dialog-Ablauf darf die Kamera nicht festnageln; nach einer Sprungmarke kann der Spieler sie frei weiterbewegen.
- **Maßstab:** Bühnen groß genug für Bewegung und Cartoon-Rauferei. Das UFO bekommt 8 m pro Einheit; WS0 liefert es mit Bildschirm-Slot.
- **Vorschlag zur Umsetzung** (Kamera-Controller, Übergang Sprungmarke → frei, Kollision mit Kulisse) bitte als Vorlagen-Zeile in WS1_STATUS. Vorlage: die God-Mode-Kamera aus dem Lab bzw. J17 (V-026).

## 15.10.2026 · Bildflächen-Modul: Inhalt und Träger trennen (V-256) · wichtig für B1 und D1
- **Inhalt = ein Embedding-Modul**, frei auf jede 3D-Oberfläche setzbar. Dazu gehören: Karte (`cardImage`), Hypernormalisation-Loops, YouTube-Videos, Card-Viewer, Zitate, Farbstimmung (Palette V-245).
- **Technik:** Canvas- bzw. Video-Textur auf einer Fläche, HTML/YouTube per CSS3D. Spender: Branch `chatgpt-web/billboard-b2a-css3d-2026-09-24`, Ordner `tools/KFB-ToolBox/_handover/BILLBOARD_B2A_CSS3D_2026-09-24/` (`bb2a-boot.js`, `bb-scene.js`, `wd-donors.js`), dazu `_handover/BILLBOARD_MEDIA_LIVING_2026-09-24.md`. Vor dem Bau bitte eine Vorlagen-Zeile.
- **Träger:**
  - Das Knet-Billboard (B1) ist nur **ein** Träger; euer B1-Körper bleibt dafür gültig.
  - Im UFO ist der Träger die Monitorfläche. WS0 liefert einen benannten Bildschirm-Slot (`kfb_screen_slot`, Eckpunkte als JSON) mit angepasstem Seitenverhältnis von etwa 1,60:1.
- **Bitte:** B1 so schneiden, dass Körper (Träger) und Fläche (Inhalt) getrennte Module sind. Das Inhaltsmodul bekommt eine Fläche (Mesh + UV) übergeben und weiß nichts vom Billboard.

## 15.10.2026 · UFO-Cockpit-Bühne (V-252) · Info, kein Auftrag vor MVP-0
- Intake `replies/WS0_WS1_UFO_COCKPIT_STAGE_INTAKE_R1_2026-10-14.md` ist freigegeben.
- **Phase 1 macht WS0 hier**, weil die Master-Datei (96 MB) in Georgs Dropbox liegt: Quell-Beleg, Browser-Fassung A/B nach eurem `build-browser.mjs`-Weg (Kopie, eure Datei bleibt unverändert), Steuerknüppel → optionale Variante `stage_clean`, Bühnenplan, Monitor-Befund. Ergebnis kommt als Asset-Branch wie bei Mesa/Library.
- **Phase 2 bei euch nach MVP-0:** zweite wählbare Bühne im ModuleHost.
- **Karte:** ein B1-Modul mit zwei Montagearten ist erlaubt, entweder freistehend oder auf dem Rückwand-Monitor. Beide nutzen dieselbe `cardImage`-Quelle und dieselben R2-Regeln. Georg wählt am Bildpaar.

## 15.10.2026 · Ergänzung MVP-1b: Fahren übers Gelände (V-251)
- In MVP-1 gehört auch Fahren: ganz normal über das Gelände, ohne Rennstrecke.
- **Fahrphysik = J17 k2b 1:1 als Modul** (V-032). Der Boden kommt aus dem Gelände, nicht aus der Strecke.
- **Auto:** Cicada geschlossen (V-030). Ein- und Aussteigen über den Hop-Arbeitsstand (V-031).
- **Bitte erst eine Vorlagen-Zeile:** Quelle (J17-Pfad, Commit), was 1:1 übernommen wird und was sich für den Geländeboden ändert. Den Bordstein-Puffer aus V-032 braucht es ohne Strecke nicht.

## 15.10.2026 · MVP-Fahrplan (V-250) · bitte quittieren
1. **MVP-0 Dialog-Szene spielbar** (läuft): Amphitheater, FrizzleBob + KayKit-Gegenüber (drei Kandidaten an WS0), B1 Billboard, Blasen, Spielerwahl, Paletten (V-245), Vorschau-Text (drei Karten). Abschluss: G4 an WS0, dann Georg im Spiel.
2. **MVP-1 Welt-Hülle:** eine begehbare Insel aus den Meshy-Kulissen (Mesa B, Bibliothek A; Schnee/Natur folgen), Laufen/Springen aus M1 (V-248), Kamera, NPC-Begegnungen an Billboards. Vorschlag zum Inselaufbau (Maßstab, Übergänge ohne harte Kanten V-011, Bodenschluss V-203) zuerst als Plan in WS1_STATUS.
3. **MVP-2 God-Mode v1:** Platzieren/Drehen/Skalieren aus dem Asset Librarian, Undo, Welt als `kfb.world/1`-Datei (Vorschlag in `replies/WORLD_CONTRACT_R1.md`, `WORLDBUILDER_MODULE_MAP_R1.md`), Umschalten Spiel ↔ God-Mode (Kamera V-026). Vorlagen-Zeile vor Bau.
4. **MVP-3 Veröffentlichen:** Build als Site mit Versionen; WS0 klärt Ziel und Weg mit WSA work.
5. **MVP-4 Combat-Arena:** Destruction-Mech, KayKit-Mündungsfeuer (groß/Rakete, klein/Gatling, cartoonig im Schusstakt), Zerstörungs-Ebene, Flugmodus (V-024). Bausteine aus `KFB Combat Arena/` (v2) prüfen und als Module übernehmen. Nicht vor MVP-1.
Höchstens zwei Baustellen gleichzeitig (V-005). M1 läuft als zweite.

## 15.10.2026 · Antwort auf §23 (M1) · und Erinnerung Palette
- **Palette:** Steht weiter oben unter „15.10.2026 früh · Antworten auf §19–§22“ (V-245). §23 war älter als die Antwort.
- **Befund 1, Tempo (V-248):**
  - Die Tempi aus V-020 bleiben, Georg hat sie abgenommen.
  - Damit die Füße stehen, folgt die Abspielrate dem Körpertempo: `timeScale = Tempo / Clip-Eigentempo`, begrenzt auf 0,8–1,25. Außerhalb dieser Grenzen wechselt der Clip.
  - Ziel in `m1-feet`: Rutschanteil < 0,1 bei Gehen, Joggen und Sprint.
- **Befund 2, Haltung:** Lösung angenommen (senkrecht, auf den Bodenpunkt gesetzt). Gilt auch auf der Bühne.
- **Host-Vertrag R1.3:** `fixedDt` + `after` freigegeben.
  - Eingetragen in `replies/KFB_HOST_CONTRACT_R3F_R1.md` §R1.3, inklusive der Pflicht, `after.current` jedes Bild aufzurufen.
  - Diff bitte übernehmen. M1 braucht dann keine eigene Hülle mehr.

## 15.10.2026 · Meshy-Kulissen bereit (V-246)
- Branch `assets/meshy-scenery-2026-10-15` @6d46d085 (von main), Ordner `media/3D_Assets/MeshyModels/browser/`: `kfb-meshy-mesa-island.browser-b.v1.glb` (100 k, 4,6 MB) und `kfb-meshy-akashic-library.browser-a.v1.glb` (350 k, 14,7 MB), dazu SHA256SUMS und README.
- Einbau nach dem Amphitheater-Muster (Kennung im Asset Librarian, Bildpaar, fps). Priorität nach G4. Die Bibliothek ist ein Kandidat für die nächste Bühne.

## 15.10.2026 früh · F-4 zweite Besetzung: KayKit-Figur mit Georgs Augen
Georg wählt eine **KayKit-Medium-Figur mit seinem abgenommenen Augen-Profil** aus dem Eye-Rig-Studio (derselbe F1-Weg; Profile `eye-rig-medium.batch-1.json`, Studio @db823766).
- **Bitte drei Kandidaten vorlegen:** unmaskiert, Gesicht gut sichtbar, unterschiedliche Silhouette neben FrizzleBob. Je Kandidat ein Bild im Two-Shot `cam=near` neben FrizzleBob, mit Name und Profilquelle.
- Gleicher Darsteller-Slot, `KFB_NATIVE`, keine eigenen Werte.
- KayKit hat keinen eigenen Sprechmund: Bitte zeigen, wie die Figur spricht (heute ohne Mund). Ein Mund ist eine eigene spätere Frage; nichts dazubauen.
- WS0 legt Georg die drei Bilder vor; seine Wahl kommt hierher.

## 15.10.2026 früh · Antworten auf §19–§22 (gebündelt) · gelesen bis V-245 bitte quittieren
**FrizzleBob:** F-1 erledigt (Georg: „fb passt so“). V-243 umgesetzt; den Satz zum neutral-Decal hat WS0 berichtigt (V-245). Das Gate `FRIZZLEBOB_V240_ASSEMBLED_BINDPOSE_SOURCE_PROOF` entfällt in WS1; Ganzkörper und Export kommen über die neue ToolBox-Site (V-244).

**F-2 Palette (V-245), entschieden:**
- (a) **Besitzer `palette-roles.js` R2.** Er versorgt Billboard, Amphitheater, Boden und Himmel. Die Stufen kommen aus `world-palettes.js` (Travel v25, acht Cartoon-Paletten). Das ist die Linie, die Georg mit „Joyride v17“ meint (d). BIOMES nur noch als Rückfall.
- (b) **Zuordnung dynamisch nach Karte über das Deck-Feld `genre` bzw. `bundle`** (Werte uneinheitlich: EDUCATION/education, CONSPIRACY_THEORY/conspiracy, satire/COMEDY …). Ihr schlagt eine Tabelle Genre → Palette vor und legt einen Bildbogen bei: je Palette ein Bühnenbild mit einer passenden Karte. Georg urteilt am Bogen.
- (c) **Himmel färbt mit.**
- **Wechsel weich überblenden** (V-011).

**F-3 Dialogtext:**
- (a) **Für G4 Vorschau mit drei Karten** und Georgs eigenen Fassungen, als Vorschau gekennzeichnet (Packet `preview:true`, nicht ACCEPTED). Der Opener steht als eigene Schicht davor:
  - Monomyth #1: „[Welcome to] The Ordinary World stasis loop: nothing changes; Dysfunction is habit. Normalize pain – feels like home.“
  - Monomyth #5: „[Remember] Crossing the Threshold: hand new cards, old self dead. Fear becomes movement. You can't un-fluff the pill.“
  - Help I Am A Human #10: „[You know] Jean-Jacques Rousseau, Natural Goodness: man born free, everywhere in chains.“
  - Kartentext = Druck (@233efd5).
  - Ist eine der Karten nicht SAFE, zeigt das Billboard den Platzhalter mit Drucktext.
- (b) **Pool r6 kommt erst mit sauberen Triplets.** Das Plugin wird nach der neuen Methode (Closure, Fluff-o-lect, Georgs Fassungen als Richtung) angepasst; abgenommen wird in einem Prüfwerkzeug (V-237). Format bleibt kfb.voice.triplet-opener-pool/1, Opener als eigene Schicht. Termin offen. Bis dahin Vorschau wie (a).
- (c) **Spielerwahl** KayfaBINGO/BOGGLE/BONGO/BLÖDSINN + eigene Wörter: bleibt für G4.

**F-4 zweite Besetzung:** Klärt WS0 mit Georg; Antwort folgt hier. Bis dahin spielt FrizzleBob beide Seiten, nur im Prüf-Browser.

**F-5:** Kopf-Blickschicht nach dem Mixer und `lookAt` in Weltkoordinaten ist freigegeben (V-214). Kinetik-Automatik und M1-Fußabnahme kommen nach G4.

**19.1:** `cam=near` + `place=near` als Standard bestätigt (Georg: „near nehmen“).

**19.x Kartennummern:** Die Decks ohne Nummern bzw. mit `num`/`name` (ai_kayfabe, brain_flipper, kompendium, kreative_kayfab, carnival_therapy, tragic_flaws_shakespeare) normalisiert WS0 als nächsten Datenschritt (V-242).

## 14.10.2026 spät · Präzisierung zu V-243: kein FrizzleBob-Sonderweg
- **Nur datengetrieben:** Den Ruhe-Mund liest der Darsteller aus einem Rezept-Feld `mouth.rest` (z. B. `"closed"` → das Decal für geschlossene Lippen). Den Wert setzt bis auf Weiteres euer Rezept mit Quelle „V-243“. Später schreibt ihn die ToolBox selbst. Nichts fest im Code für FrizzleBob.
- **Kein weiterer FrizzleBob-Ausbau** über diesen Punkt hinaus (Augenlage, Ganzkörper, Export). Die Rigging-Fixes wandern in die ToolBox (WSA-work-Port, V-241); Georg stellt FrizzleBob dort einmal ein, ihr übernehmt das Rezept 1:1.
- Weiter wie geplant mit B1, D1 und der Bühne.

## 14.10.2026 spät · FrizzleBob: Mund zu, Augenlage, Ganzkörper (V-243) · freigegeben
Grundlage: `replies/FRIZZLEBOB_V240_CLOSED_MOUTH_AND_FACE_VISUAL_FAIL_2026-10-14.md` und `…_RAW_GLB_VIEWER_FAIL_AND_TRUE_EXPORT_ROUTE_2026-10-14.md` (Georg FAIL).
- **G0 erledigt (WS0):** Im ToolBox-Schnitt P08 ist „Zu“ (`setViseme('closed')` bzw. `mouthRest`) nur eine Live-Vorschau. Sie wird nicht gespeichert und nicht exportiert. Der Export im Schnitt ist identisch mit V-240 (16:00). Einen neueren Stand gibt es also nicht; Georgs Absicht ist eindeutig: **Ruhe-Mund geschlossen**.
- **Freigabe, kleinster Eingriff in `faceMountActor`:**
  - Ruhe-Mund = sichtbar geschlossene Lippen mit dem vorhandenen Decal (euer `_closedNeutral`-Zweig mit closed = „m“).
  - `say()` endet wieder in diesem Ruhezustand.
  - Kein neues Decal-Set, keine zweite Mundebene, keine sonstigen Werte geändert.
- **Beleg, in dieser Reihenfolge:**
  1. Bildreihe idle / „Zu“ / mitten im Satz / nach dem Satz, jeweils mit `parts.mouth`, `mouthOnModel`, `m.rest`, `m.viseme`, `m.cur`. Geschlossen heißt: keine Zähne, keine Lücke.
  2. Augenlage: eyeFrame und Kopf-Transform gegen die ToolBox aus gleicher Kamera (vorn, ¾, Seite). Nichts frei verschieben.
  3. Ganzkörper in Bindepose, vorn, ¾ und Seite mit Rand, Ohren, Hände und Füße ganz im Bild, neutraler Hintergrund, fertig montierter Darsteller (kein nacktes GLB), dazu ein Augen-Auf/Zu-Bild.
- **Danach:** Erst wenn WS0 die Bilder geprüft hat, folgt der GLB-Export-Versuch. Nach zwei Durchgängen ohne Verbesserung: Naht festhalten und melden, keine Varianten erfinden.

## 14.10.2026 spät · Neuer Kartentext-Stand (V-242)
- **Branch `data/kfb-card-text-canonical-2026-10-14` @233efd5** (baut auf der Registry-Korrektur a9f5ffa1 auf). Kartentext = Druck; der alte Text steht in `jsonLegacy`, die Herkunft in `textSource`.
- **37 Titel geändert** (32 in carnival_therapy, z. B. ai_kayfabe #11 „Claude 3.7's Ghost“). Eure Zuordnungsprüfung über Titel bitte gegen diesen Stand laufen lassen. Erst danach `MEDIA_COMMIT` umstellen; das Ergebnis in WS1_STATUS melden.
- Bericht: `media/kfb/CARD_TEXT_CANONICAL_R1.md`.

## 14.10.2026 spät · ToolBox-Antworten auf eure Befunde (Kurzfassung)
Claude Design hat zu eurer Liste geantwortet. Der volle Schnitt kommt später auf GitHub.
- **A1 bestätigt:** Die ToolBox zeigt nie die Bindepose, sondern immer eine Pose bzw. Idle_A. Eure Bilder in Bindepose bleiben richtig; für Paare mit der ToolBox die Pose angeben.
- **A2 bestätigt:** `frizzlebob-earrig-v5` lädt v5b. Das deckt sich mit V-240.
- **A5:** Brauen `original.brows.lift` = 0,242. So steht es auch in Georgs Export, also nicht 0,18.
- **Achtung:** Brauen- und Nasenfarbe werden noch nicht exportiert. Nehmt bis auf Weiteres die Farben aus dem Export (`brow.color`, `nose.color`).

## 14.10.2026 abends · FrizzleBob WEITER mit Georgs Eintrag (V-240) · Stopp aufgehoben
- **Quelle:** `replies/actors/frizzlebob.georg-2026-10-14.kfb-pets.json` im Register-Branch (Georgs Export, kfb.pets/1, `pets[0]` = `frizzlebob-earrig-v5`).
- **Figur laut Eintrag: `FB_TEMPLATE_LOOK_v5b.glb` @23615cff (Blob 24134a51).** Georg hat ihn auf v5b eingestellt; das gilt (ersetzt „kein v5b“ aus V-236).
- **1:1 übernehmen**, eure vorläufigen Werte (§12, Rezept C) ersetzen:
  - eye: dx .455, dy .21, ring .255, oval 1,06/1,04/0,98/−25, socket surface, matte-cute 0,27, life 0,27/0,2;
  - brow, nose, mouth, original.*, parts (eyes rig, Rest original);
  - hair, ears, lids.
  - Datei ins Rezept bzw. in den Datenordner ziehen, Quelle und SHA-256 vermerken.
- **Knet-Lider:** `clayLids.on: false` → Eye-Rig-Lider. Die Knet-Lid-Konstruktion klärt Georg separat. Daran nicht aufhalten.
- **Mund:** `mouth` (set male, dy −0,681, lift 0,03) + `original.mouth` (pitch 18, depth −0,188). Prüfen, ob der Mund damit in ¾ am Kopf sitzt (euer Befund A7).
- **Abnahme:** Bildpaar ToolBox-Spender | Spiel aus gleicher Kamera (vorn, ¾, Seite) mit **diesem** Eintrag, Pose angegeben. Auf v5b mit seinen Modulständen (Cut r2 bzw. P08-Linie); Abweichungen der Modulstände bitte benennen.
- **Hinweis:** Die Export-Kennung lautet „KFB ToolBox Production-02 · Rigging“. Welche Claude-Design-Fassung das genau ist, klärt WS0 (V-241).

## 14.10.2026 abends · V-238 zurückgenommen (V-239)
Der Composer ist **kein** Rigging-Ort; Georg: dort sind alle Modelle falsch. Gültige Rigging-Quelle bleibt das Eye-Rig-Studio (euer F1-Weg). FrizzleBob ist dort nicht enthalten. FrizzleBob-Ausbau bleibt gestoppt, bis WS0 mit Georg die Quelle geklärt hat. B1 läuft weiter.

## 14.10.2026 abends · FrizzleBob-Werte kommen aus dem Composer (V-238)
Rigging-Ort ist ab jetzt nur die FrankenStein-Composer-Site (WSA work, #355). Dort wird FrizzleBob v5 mit euren gepinnten Modulen repariert (Mund/Nase ¾, Brauen, Pose-Schalter, Pins, v5/v5b) und von Georg eingestellt. Gespeichert wird ein Rezept auf GitHub im Format eures `frizzlebob-v5.recipe.json`. WS1 übernimmt es dann 1:1. Bis dahin FrizzleBob-Ausbau gestoppt (siehe oben). Eure TOOLBOX_FINDINGS_R1 sind die Mängelliste dafür. Der Vertrag R2 (modelRef, CUSTOM, beidseitige Exklusivität) geht ebenfalls an den Composer.

## 14.10.2026 abends · STOPP FrizzleBob-Rigging (Georg: „komplett kaputt“)
- **FrizzleBob im Darsteller-Slot nicht weiter ausbauen.** `fb_pair_face_q.png` zeigt es in ¾: Nase und Mund-Decal stehen frei vor dem Gesicht, das hintere Auge sitzt außerhalb des Kopfs. Das ist Parität mit einem **kaputten Spender-Stand** (P06 r1 mit Standard-Eintrag), keine Abnahme. „Gleich wie ToolBox“ zählt hier nicht.
- **Weiter erlaubt:** B1 Billboard (§14, Vorlagen-Zeile freigegeben, siehe unten) und der Slot-Code selbst (Vertrag R2, Tests). Der Slot ist nicht schuld, die Gesichtswerte sind es.
- **Grundhaltung (§13.1):** Befund angenommen. Idle_A bleibt vorläufig Ruhe-Clip auf der Bühne; die Prüfbilder bleiben in Bindepose.
- **F1-Lid-Naht (§13.2):** Diff freigegeben (eine Stelle in `seatPupils`, 1074 → 139). Diff und neuen Blob zurückmelden.
- **B1 (§14):** Vorlagen-Zeile freigegeben (1:1 `billboard-clay.js`, `fitFace`, `gb 3.0 → 0.9`, Innenecken ≤ 0,8 × Papierrand, sonst eckig). Abnahme: Bildpaar Referenz | Stand, Karte ganz und randlos.
- **Wie es mit FrizzleBob weitergeht:** WS0 klärt mit Georg, wo sein **funktionierender** FrizzleBob liegt, also welcher Stand als Referenz gilt. Bis dahin keine eigenen Gesichtswerte setzen und keine Werte aus J17 übernehmen.

## 14.10.2026 nachmittags · Antwort auf §11 (G0 FrizzleBob v5)
- **G0 angenommen.** Saubere Arbeit, besonders die Falle v5/v5b und die ehrliche Lid-Naht.
- **F1-Lid-Naht** (`pupilHiddenWhenClosed`, 1074 Pixel): bleibt TUNE. Einen Owner für eyeoval.v1 gibt es nicht. Bitte als eigenen kleinen Vorschlag (Ursache + Diff) in WS1_STATUS; WS0 gibt frei. Kein stilles Ändern.
- **Georgs FrizzleBob-Eintrag:** Georg exportiert ihn (ToolBox › Rigging › Import · Export › Export). WS0 legt die Datei ins Repo und meldet den Pfad. Bis dahin Code-Pfad-Parität mit dem markierten Prüf-Eintrag wie vorgeschlagen; nichts davon an Georg.
- **Lider hinge vs. glide:** Entscheidung liegt bei Georg und kommt hierher.
- **Wireface-SDK:** Es liegt nicht auf eurem Mac. Georg bringt die zwei Dateien (`wireface-sdk-0.3.3.tgz`, `wireface-browser-0.3.3.tgz`) per AirDrop o. Ä.; Ablage außerhalb des Repos. Bis dahin: Schalter + Build ohne SDK.
- **Grundpose/Haltung:** Georg sagt, ihr habt Probleme in der ToolBox gefunden, u. a. zur Grundpose (FrizzleBob-GLB ist T-Pose ohne Clips). Bitte als eigenen Abschnitt in WS1_STATUS festhalten: Befund, betroffene Dateien/Figuren, Vermutung zur Haltung/Animation im Spiel, Belegbild. WS0 prüft und vergibt.

## 14.10.2026 morgens · BESETZUNG: FrizzleBob v5 (V-236) · verbindlich, ohne Rückfrage umsetzen
**F1 (WS1_STATUS §10):** angenommen als technischer Nachweis des Moduls (Studio-Parität, Vertragstest, Prüfer 4). Rogue_Hooded bleibt **nur Testfigur** für F1; als Darsteller ist er falsch (maskiert, kein sichtbarer Mund).

**Hauptdarsteller der ersten Dialog-Bühne: FrizzleBob v5.**
- **Modell:** `tools/KFB-ToolBox/ear-rig/glb/FB_TEMPLATE_LOOK_v5.glb`, Blob `131d7c38`, Commit `19088b14`, Branch `chat/fb-ear-rig-v5-2026-09-25`. Dort liegen auch `FB_BASE_NOEARS_v5.glb`, `FB_EAR_UNIT_v5.glb`, `rigs/fb-default.ear-rig.json`, `ear-dangle.v1.js`, `blender/build_fb_v5.py` und das Ear-Rig-Studio.
- **Augen/Lider-Beleg:** 7/7 PASS vom 30.09., `tools/KFB-ToolBox/_inbox/KFB_TOOLBOX_CLAUDE_DESIGN_SESSION_CUT_2026-09-30_r1/evidence/acceptance_1-7_frizzlebob-earrig-v5.json` (Actor `frizzlebob-earrig-v5`) auf main. Gilt für diesen Spender, noch nicht für R3F.
- **Nicht v5b** (`FB_TEMPLATE_LOOK_v5b.glb`, Production-06 r2) stillschweigend einsetzen.

**Ablauf:**
1. **G0 Quell-Isolation FrizzleBob v5:** Modell allein zeigen; Gesichts-Stapel (Augen, Lider, Brauen, Ohren, Mund) mit Quelle und Werten pinnen. Keine Rogue-Werte übernehmen. Was fehlt, z. B. ein sichtbarer Mund, als `SOURCE_REQUIRED` melden, nie mit Platzhalter füllen.
2. **Darsteller-Slot** mit genau einem Gesichts-Treiber (`KFB_NATIVE` aus FrizzleBobs eigenem Stapel; keine neue Gesichts-Engine, kein Mischbetrieb).
3. **Abnahme:** Bildpaar bzw. kurzer Clip Spender | R3F, gleiche Figur und gleicher Winkel; Blinzeln vollständig geschlossen, Blick, Ohren.
4. Danach weiter wie geplant: B1 Billboard (R2) → D1 → G4-Szene im Amphitheater.

Die Fragen aus §10 beantwortet WS0 gesondert. Sie halten FrizzleBob G0 nicht auf.

## 14.10.2026 früh · F1: Eye-Rig-Studio-Quelle (Korrektur, Fehler WS0)
Die Live-Adresse `kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-rig-batch/` liefert nur die Startseite (SPA-Fallback, Studio dort nicht ausgeliefert). WS0 hatte sie nicht geprüft. **Nicht weiter auf Cloudflare suchen.**
- **Studio-Quelle:** Branch `work/hub-ux-v2-masterplan-2026-09-27`, Ordner `kfb-hub/stage/toolbox/eye-rig-batch/`, letzter Stand Commit `5c3334bd2` (22.09.); `index.html`, `app.js`, `lib/` (u. a. `kaykit-eye-adapter.v1.js`), `data/`. Ursprung PR #104 (Branch `toolbox/eye-rig-batch-2026-09-18`). Lokal per statischem Server ausliefern (z. B. `npx serve`), nicht über file://.
- **EyeRig v6:** dieselbe Datei wie im Lab (md5 1c194efa); im Repo z. B. `skills/KFB PetStudio/KFB Pet Studio v12 (WS0)/session-export_petstudio-v12_2026-09-10/code/petstudio-v9/studio-v12/pet-eye-rig.v6.js`.
- **Georgs Werte:**
  - Klassen-Standard `rig-medium-default.v0.json` (Resident-Atlas-Cut, Z. 38–66);
  - 33 Figurenprofile `eye-rig-medium.batch-1.json`;
  - Large `rig-large-reviewed.v1.json`.
  - Lab-Kopien: `~/Dropbox/CLAUDE/KFB Island Worldbuilder Lab/public/assets/figures-b2/eye-profiles/` (mit SOURCE.md).
- **Alle Regler, Schieberwerte und die Schielursache:** Lab `docs/concepts/EYE_RESTORE_SEARCH_R1.md` §1–4. Blickachse = Host-vorn, nicht Anker-Drehung.

## 14.10.2026 früh · Registry-Korrektur fertig (Antwort auf 4.2)
- **Neuer `MEDIA_COMMIT`: `a9f5ffa1484f510d2fbfb04bf3204546ef7dc867`**, Branch `data/kfb-registry-mapping-fix-2026-10-14`, Basis main @ac9dbaed. Bericht: `media/kfb/MAPPING_FIX_R1.md`.
  - coverOffset 1→0 bei 14 Decks;
  - 1→2 bei 4 Decks (zwei Vorseiten);
  - `pages` = gemessene Seitenzahl;
  - Einzelfälle anti_rules_toolkit (Dublette entfernt, #52–57 → #51–56), big_bad_brain_wrestling #50/#51, unspoken_systems #38 „TRUST LOOP“;
  - die 2 „fehlenden“ PDFs: Apostroph im Registry-Namen korrigiert.
- **Bitte:** Audit (`python3 scripts/audit-mapping.py`) gegen `a9f5ffa1` laufen lassen und das Ergebnis in WS1_STATUS melden. Die Vorhersage aus euren Rohdaten lautet 58/78 SAFE; belegt ist das erst durch euren Lauf. Erst danach stellt ihr `MEDIA_COMMIT` um.
- **Offen** (Bericht §Offene Fälle): 4er-Reihen-Seiten in 4 Decks, Karten-JSON ≠ Druck bei ego_mania_narcissist/mission_control #37–56, ontological_hazards mit gemischtem Offset. Diese Decks bleiben bis auf Weiteres Platzhalter.

## 14.10.2026 früh · Meshy-Amphitheater (Antwort auf §9, V-230)
Gute Quell-Isolation: Bildpaar, Inventur, Messung, Befunde A/B. So soll Intake aussehen.
1. **Ablage:** wie vorgeschlagen. Das Master bleibt in der Dropbox (SHA-256 + Herkunft im Librarian). Ins Repo kommt nur eine Browser-Fassung unter eigener Kennung und Version: Geometrie ≈ 300–400 Tsd. Dreiecke, Texturen 2048² WebP (Metall/Rau 1024²), Ziel < 20 MB. **Kein KTX2/Meshopt jetzt**, damit kein neuer Laufzeit-Decoder nötig wird; erst wenn das Ziel sonst verfehlt wird, als Vorschlag. `@gltf-transform/cli` ist als gepinnte Dev-Abhängigkeit freigegeben (nur Werkzeug-Skript, `npm ci`/Build/Tests bleiben grün). Abnahme: Bildpaar Master | Browser-Fassung aus gleichen Kameras + Bildzeit wie in deiner Tabelle.
2. **Registrierung:** WS1 trägt genau eine Kennung im Asset Librarian (`registry/assets/v1`) im Intake-Slice ein; WS0 prüft.
3. **Maßstab:** Bühnenfläche ≈ 14 m bestätigt. Das Billboard gilt nach `BILLBOARD_STANDARD_R2` (responsiv, niedrig, kein 12 × 6 m mehr). Prüfung im ruhigen Two-Shot: Karte lesbar, beide Figuren davor.
4. **Unterseite:** Das Theater steht auf Clay-Gelände mit Bodenschluss (V-203); die Kamera kommt nie darunter.
5. **Reihenfolge:** Die Browser-Fassung darfst du jetzt erzeugen, wenn es F1 nicht aufhält. Einbau als Modul erst nach F1 und B1, wie vorgeschlagen.

## 14.10.2026 früh · Architektur R1 (V-228) · gebündelt, bitte quittieren
**Lesen:** `ARCHITECTURE_R1.md` (eine Seite) und `replies/BILLBOARD_STANDARD_R2.md`. Im nächsten WS1_STATUS bitte quittieren: „gelesen bis V-228“.

1. **Alle Laufzeit baut WS1**, auch Kamera (ruhiger Two-Shot als Standard, kein Auto-Schnitt) und den kompakten Clay-Boden der Bühne. V-225 ist zurückgenommen. Die Module in `replies/CLAUDE_DESIGN_STAGE_LIVE_R1/` werden **nicht** übernommen; nur `fitFace` dient als Vorlage für B1.
2. **8.1 Billboard:** gilt nach R2. Kein TV, keine feste 2:1-Fläche, responsive Fläche, Karte randlos, Innenecken höchstens im Papierrand gerundet, kurze Pfosten. Bitte neue Vorlagen-Zeile nach R2 §5.
3. **Gesicht (ersetzt den Mischbetrieb aus V-217):** Je Figur steuert genau ein Treiber das ganze Gesicht, wie im #355-Code (`DOUBLE_FACE_CHANNEL_OWNER`). KFB-Figur = `KFB_NATIVE` (F1). Wireface-Cast oder GLB = `WIREFACE_*` exklusiv. Den Darsteller-Vertrag erweitert ihr im Code für Nicht-KayKit-Figuren (bisher verlangt er `kfb.actor-recipe` mit Rig_Medium) und reicht den Diff in WS1_STATUS ein.
4. **Wireface-SDK:** lokaler Alias mit Schalter (z. B. `VITE_WIREFACE=1`). `npm ci`, Build und alle Tests müssen **ohne** SDK bestehen. Keine SDK-Datei im Repo.
5. **Text:** Pool r6 entsteht im Branch `data/kfb-dialog-pool` (`data/dialog-pool/KFB_DIALOG_POOL_R6_2026-10-14.json`), mit Georgs Opener-Urteilen und den drei 56er-Sets als Kandidaten. `POOL_PATH`/`POOL_REF` stellt ihr um, wenn WS0 die Revision meldet. Bis dahin bleibt r5.
6. **Reihenfolge:** F1 → Darsteller-Slot → B1 → D1 → Vorführung (G4). Vorher zeigt ihr Georg nichts.

## 14.10.2026 früh · Antwort auf WS1_STATUS §8 (Head ddf4e22d)
**S5a/b/c:** angenommen. Die Optik der Spielerwahl prüft WS0 mit der Vorführung (8.2), nicht einzeln.

**8.2 Reihenfolge: angenommen.** F1 Augen → Billboard → Vorführung „Karte im Billboard + Blase + Wahl, Figur mit Eye-Rig“ auf kompaktem Clay-Boden statt Hex. Die Karten-Aufsteller auf Bühne und Turm fallen weg.

**F1 jetzt starten** (Stopp aus §7 ist damit aufgehoben, Antwort auf 4.5):
- **Augen:** Vorgaben wie am 14.10. (pet-eye-rig.v6 + anchored-eyes 1:1, Studio-Werte, Anker-Drehung nicht übernehmen, Brauen). Abnahme: bewegtes Paar Studio | R3F.
- **Figuren-Slot (V-227):** eine Darsteller-Schnittstelle mit `faceDriver` je Figur (`KFB_NATIVE | WIREFACE_MESH | WIREFACE_MODEL`, Vertrag #355). Je Region genau ein Treiber. F1 liefert `KFB_NATIVE`; die Wireface-Treiber kommen als zweite Quelle in denselben Slot.
- **Wireface-SDK 0.3.3** (Peer `three ^0.186.1`, passt zum Host-Vertrag) liegt nur lokal: `~/Dropbox/CLAUDE/KFB_HUB/40_VENDOR_PRIVATE/wireface-0.3.3/` (`sdk/package/` und `browser/`). Einbinden über einen ignorierten Vendor-Ordner bzw. Alias. **Nie ins Repo**, auch nicht in Builds, die gepusht werden.
- **Stimme:** Es gibt keine Tonaufnahmen. `say()` braucht aufgenommene Clips; ohne Audio-Kontext bewegt die Figur nur den Mund („mime“). Bis auf Weiteres gilt: mime, kein TTS.

**8.1 Billboard-Vorlage: noch nicht freigegeben.** V-223/V-224 ändern sie: kein TV-Knopf, keine feste 2:1-Fläche, responsive Fläche, Karte randlos, niedrig. Die Antwort kommt nach dem Architektur-Check von WS0 (heute), zusammen mit der Frage, welches Billboard-Modul die eine Quelle ist.

**Registry (4.2):** Die Korrektur läuft jetzt im Branch `data/kfb-registry-mapping-fix-2026-10-14`. Den neuen `MEDIA_COMMIT` meldet WS0.

**Pool (S5b):** Der Pool r5 hat 0 ACCEPTED und nur einen Beat. Georgs Urteile (V-218, V-222) und die neuen Opener-Kandidaten trägt WS0 ein; neue Pool-Revision und Ref meldet WS0.

## 14.10.2026 nachts · Figuren-Slot quellen-offen (V-226/V-227)
- Claude-Design-Bühne R1 = FAIL (keine Figuren, Auto-Schnitt). Ursache WS0.
- **Neu für F1/F2:** Darsteller-Schnittstelle mit mehreren Quellen: KFB-Figur (Körper + Eye-Rig, F1 1:1 aus dem Studio), Wireface-Cast (`buildCharacter(id)` aus `@wireface/sdk/three/characters`), beliebiges GLB mit `attachFace`/`ModelFace`. Je Figur genau ein Gesichts-Treiber (`faceDriver`).
- Das SDK kommt von Georg (Konto-Download). Es bleibt lokal in einem ignorierten Vendor-Ordner und kommt nie ins Repo. WS0 meldet den Pfad, sobald es da ist.

## 14.10.2026 nachts · Wireface-Bühne als 3D-Szene (V-225)
- Claude Design baut die Bühne live in three.js (Projekt „KFB Billboard Clay Island“); jedes Teil als Modul nach Host-Vertrag R1.2. WS1 übernimmt die Module später 1:1 über den ModuleHost. Kein eigener Nachbau. WS0 meldet, wenn die Szene geprüft ist.

## 14.10.2026 nachts · Bühnen-Billboard (V-224, für B1)
- Plain-Körper ohne TV bzw. Mini-TV; niedrig gesetzt, damit die Figuren davor agieren.
- Responsive Bildfläche nach dem Seitenverhältnis der Karte (B3 `fit_face`, siehe `replies/BILLBOARD_STANDARD_R1.md` §6); die feste 2:1-Fläche mit Randfarbe entfällt.
- Karte = ganze Viertelseite, unbeschnitten, randlos.

## 14.10.2026 nachts · Opener-Regeln und Billboard-Referenz
- **V-222 (für S5b):** Opener-Varianten (z. B. die „heard of“-Formen) bleiben, aber **keine Variante zweimal in einem Set, Akt oder Dialog**. Also braucht der Pool-Leser eine Rotation bzw. einen Cooldown. Orts-Opener sind je Figur erlaubt (frei als Bühnenfiktion oder nur Kartenorte, laut Figurenprofil).
- **V-223 (für B1):** Referenzbild `replies/REFS_BILLBOARD/PLAIN_BILLBOARD_REFERENCE_GEORG_2026-10-14.webp`.
  - Knet-Rahmen, runde Innenecken, zwei Pfosten.
  - Inhalt als integrierte Collage bzw. Hypernormalisation; die Karte wird integriert, nicht aufgeklebt.
  - Kein TV-Knopf vorerst.

## 14.10.2026 spät · Billboard-Standard (V-220)
Jedes Billboard bzw. jede Karte auf einem Billboard folgt `replies/BILLBOARD_STANDARD_R1.md`:
- **Körper:** World Billboard Clay01 r2 in der Variante `plain` (Einbau-Vertrag `billboard.embed-spec.v1.json`, Branch `work/billboard-island-integration-01-2026-10-01`).
- **Karte:** **in** die 12 × 6 m-Bildfläche eingesetzt (CanvasTexture 2:1), über `cardImage`, `fit`. Nie als Rechteck davor.
- **Engine:** Hypernormalisation (START_HERE im Branch `planning/billboard-quote-hypernorm-curator-2026-10-04`, H13 als Bild-Besitzer), genau ein `BillboardScheduler`.

Für den Billboard-Slice zuerst eine Vorlagen-Zeile an WS0: welche Datei bzw. Funktion 1:1 übernommen wird.

Ablage im Register-Branch `docs/kfb-decisions-register-2026-10-11`. Verbindlich ist `DECISIONS.md`.

## 14.10.2026 · Antwort auf WS1_STATUS (Head 0fdabf87)

**Gut gemacht:** S0/S1 sauber. Blinde Prüfer, Bildpaare mit unabhängiger Referenz, das Audit der Kartenzuordnung, „gesperrt statt falsch“. So soll es laufen.

**Freigaben**
- **Host-Vertrag R1.2 = V-215.** Kopie liegt in `replies/KFB_HOST_CONTRACT_R3F_R1.md`. Besitzer ist ab jetzt WS0. Änderungen bitte als Vorschlag in WS1_STATUS; WS0 trägt sie ein.
- **S0 + S1 freigegeben**, ohne dritten Prüfer. Zu Georg geht S1 aber erst gebündelt mit S5a, also mit Karten und Blase zusammen.

**4.1 · Hex (V-216 Punkt 1, V-194):** Eure Empfehlung gilt.
- Die Hex-Insel bleibt nur eine ausdrücklich markierte Legacy-Testkulisse; nichts hängt daran.
- S2 Clay wird nicht auf Hex ausgerichtet.
- Die erste Bühne ist ein kompakter, organischer Clay-Boden mit Billboard, zwei Figuren, Blasen, Kontaktschatten und SKY3.
- Terrain und God-Mode kommen später beim Worldbuilder-Owner. Der Integrationsplan R1 ist insoweit korrigiert.

**4.2 · Registry:** Die Korrektur ist ein eigener Auftrag beim Deck-Registry-Owner: `coverOffset` der 15 verschobenen Decks, 2 fehlende PDFs, Einzelfälle in `cards.json`. WS0 vergibt ihn und meldet danach den neuen `MEDIA_COMMIT`. Bis dahin bleibt es beim Platzhalter mit wörtlichem Kartentext.

**4.3 · cardImage():** Bestätigt: Es ist ein Host-Dienst, kein Modul. Die Prüfung über `s1`/`s1-view` genügt.

**4.5 · Gesichter (V-216 Punkt 3, V-214, V-217):** Erst F1, dann F2, dann D1.
- **F1 Augen** (Modul nach create/update/dispose):
  - `pet-eye-rig.v6.js` + `anchored-eyes.v1.js` 1:1, Quellen und Fundorte in Lab `docs/concepts/EYE_RESTORE_SEARCH_R1.md`.
  - Werte aus Georgs Studio „KFB Batch EyeRig Atlas“ (live: `kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-rig-batch/`) bzw. `eye-rig-medium.batch-1.json` (19.09.).
  - **Die Drehung der Anker nicht übernehmen.** Das war die Ursache des Schielens im Lab (V-201): Die Anker zeigen 14–55° nach außen, im Studio blicken die Augen geradeaus.
  - Blinzeln, Leben, Kinetik und Blickziele einschalten; dazu Brauen (V-179).
  - Abnahme: **bewegtes** Bildpaar bzw. kurzer Clip „Studio | R3F“, gleiche Figur, gleicher Winkel. WS0 prüft, bevor Georg es sieht.
- **F2 Mund:** Wireface nach dem Composer-Vertrag #355, je Region genau ein Treiber. Eye-Rig besitzt Augen, Lider, Pupillen und Brauen; Wireface zunächst nur Mund und Kiefer. Ablauf A → B → C → D aus V-217. Erst nach F1.
- **D1** wartet auf F1. S5a, S5b und S5c laufen weiter.

**4.6 · Referenz für V-204:** `replies/lab-donors/V204_plain_bubble_reference.jpg` (Lab, V-202-Abnahmefahrt). Die Blase gilt als Referenz. Die Figuren darin haben KayKit-Augen und sind **keine** Figuren-Referenz.

**Eure Regel gegen Drift** (Vorlage gegen `DECISIONS.md` prüfen; eine ältere Vorlage zählt nicht, wenn eine neuere Entscheidung sie ablöst) übernimmt WS0 für alle Sitzungen (V-214).

**S5b:** Richtig erkannt. Es gilt der KEEP-Pool (#365/#379, accepted-only), nicht `RUNTIME_POOL`. Georg kreuzt die 15 Kandidaten gerade an; das Ergebnis kommt hierher.

## 19.10. · WS0 → WS1b · Startseite der Vorschau (Georg: „Hex-FAIL“)
- **Befund:** `ws1-preview.kayfabizarro.pages.dev` ohne `#…` startet den alten „KFB · Spike R4 · Hex-Insel“ (Deal-Overlay, rohe Hex-Säulen). Der eigentliche Stand §94 (combo/r2@d762916) läuft nur über Sprungmarken (`#m1,harvest`, `#m1,car,…`, `#stage,…`). Georg landete auf der Hex-Insel und hielt das für den Spielstand.
- **Auftrag (erster Schritt nach dem Start):** Die nackte Adresse öffnet den aktuellen Spielstand (`#m1,harvest`). Der Hex-Spike geht nur noch über `#spike`. Dazu eine kurze Ladeanzeige, weil das Laden ≈ 20 s dauert und der Bildschirm so lange dunkel ist. Seitentitel „KFB Planet-Spike“ → „KFB · Spiel-Vorschau“.
