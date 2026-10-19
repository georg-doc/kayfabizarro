# CURRENT SCOPE CORRECTION · Gesamtkonzept Motion / Playable Comic / Cartoon-Look · R1.1
19.10.2026, Georg ca. 20:16 CEST: **Es geht um das ganze Konzept, nicht nur um Schatten. Der vorhandene POC stammt von WS1 und liegt auf GitHub.**
Die ursprüngliche Eingrenzung dieser Datei und von Issue #439 auf Schatten war zu eng. Dateiname bleibt als stabiler historischer Link erhalten; dieser Abschnitt ist der aktuelle Auftrag.

## Gesamtauftrag an WS0
Das vollständige Konzept dieses Chats als zusammenhängende KFB-Art-Direction und Motion-Probe im **bestehenden MVP** aufnehmen. Die Schatten sind eine verbindliche Teilanforderung, nicht das Produktziel.
1. **KFB-Bewegungsregie:** lesbare Haltungen, gezielte Antizipation, Handlung, Reaktion und Recovery; bewusst gesetzte Pausen und Pointen. Nur die szenisch wichtigen Teile bewegen. Kein obligatorisches Dauerwabern, Hintergrundpulsieren oder pauschaler Bounce. Lineare/mechanische Bewegung und harte Schnitte bleiben bewusst nutzbare Mittel.
2. **Limited Animation / Stop-Motion:** kontinuierliche Darstellung gegen gehaltene visuelle Posen vergleichen (12/24 als Kandidaten, kein globaler Pflichtwert). Kamera, Steuerung, Physik, Root-Position und Ereigniszeit bleiben reaktionsfähig. Augen/Mund nach bestehendem Darsteller- und Performance-Vertrag. Sichtbare Figur und Schatten aus derselben präsentierten Pose ableiten, kein Nachlaufen des Schattens.
3. **Cartoon-/Diorama-Look:** klare Farbflächen, vorhandene Biom-/Bühnenpalette, bestehende KFB-Materialidentität und Outlines beibehalten; keine automatisch eingeführten Gradienten oder fremden SaaS-/Launch-Stile. Vordere dunklere Terrain-Farbmasse als separat schaltbare Look-Option. Geometriebasierte farbige Schlagschatten folgen Figur/Racer/Props und realen Empfangsflächen, auch bei harten Kanten; Details im ursprünglichen Teil unten.
4. **Zeitsteuerung und Prüfung:** soweit im aktuellen Owner vorhanden reproduzierbare Zeit-/Frame-Auswahl wiederverwenden; Animation an entscheidenden Zeitpunkten und in Bewegung kontrollieren. Ein seek(t)-Prinzip ist eine Referenz für kontrollierbare Darstellung/Video, kein Auftrag, die Spielsimulation durch eine zweite Timeline zu ersetzen.
5. **Spiel und Video sinnvoll verbinden:** Posen, Lesbarkeit, Choreografie und Quellenidentität gemeinsam denken. WS1b bleibt Spiel-Owner; **WSV ist bereits Video-/Remotion-Owner**. Deck-Song-/Comic-Clip aus echten Karten, Zeichnungen bzw. aufgenommenen MVP-Szenen bleibt eine mögliche Ausgabe desselben Gestaltungsansatzes; kein zweites Video-Studio und keine ungefragte parallele Produktionsbaustelle.
6. **Gezielter Donor-Einsatz aus der geposteten Liste:** LottieFiles/motion-design-skill (Timing/Staging, pauschale Regeln filtern), greensock/gsap-skills (Web-Choreografie, wenn zum bestehenden Stack passend), remotion-dev/skills (Video über WSV), kaventro/motion-designer (Präsentationsfilm-Kandidat), Lob0Garou/opus-visual-motion-engine (deterministische Zeitsteuerung/Render-QA als Kandidat). Nicht alle 20 Pakete installieren oder neue Laufzeit-Dependencies ohne Bedarf aufnehmen. Die Quellen wurden im Chat selektiv gelesen; keine KFB-Integration oder vollständige Code-/Qualitätsprüfung behauptet.

## Bereits vorhandene KFB-Konzeptquellen: wiederverwenden
- WS1_STATUS.md §97 auf ws1/r3f-frame: zehn Game-Feel-Hebel, u. a. Stop-Motion, Hit-Stop, Kamera-Dither, Fotomodus, Replay, Helligkeits-/Silhouettenprüfung. Das sind dort ausdrücklich **Vorschläge**, nicht der Beleg für den von Georg genannten gebauten POC.
- Bestehende Draft PR #435: https://github.com/georg-doc/kayfabizarro/pull/435
  Branch planning/kfb-game-feel-comic-motion-ideation-r1-2026-10-19,
  replies/KFB_GAME_FEEL_COMIC_MOTION_R1/{CONCEPT_R1.md,RETURN.md,MINIGAME_RECOVERY_WS0_WS1_ALIGNMENT_R1.md}.
  Hier frisch gelesen: klare Pose-/Simulations-Trennung, bestehende Hit-Stop-Donoren, Handlung→Reaktion vor Effektliste, WSV als bestehender Video-Owner. Neue Richtung daran anschließen; kein Ersatzkonzept eröffnen.
- WS1 GitHub-Bestand ebenfalls lesend geprüft: Status/Handover, ws1/combo-r2 Verzeichnisse ws1/kfb-planet/{src,scripts,test} und ws1/proofs. Gemeinsame Lichtbasis/Look-Probes sind dokumentiert, doch der **exakte von Georg gemeinte Gesamt-POC ist in dieser Sitzung noch nicht eindeutig gepinnt**. Nicht mit dem Licht-Modul oder §97 gleichsetzen.
- **Korrektur der Urheberschaft:** WS1, nicht DS1. Von Georg bestätigter Fundort GitHub. Keine Dropbox-/DS1-Suche als nächste Aufgabe.

## Ein nächster produktiver Schritt / Umfang
**WS0 pinnt WS1s vorhandenen GitHub-POC und lässt WS1b daraus eine kurze zusammenhängende A/B-Sequenz im bestehenden MVP ausführen:** vorhandene Figur/Racer und Szene, Haltung→Aktion→Reaktion→Pause, kontinuierliche gegen selektiv gehaltene Posen, stimmiger Cartoon-Look inklusive bewegter farbiger 3D-Schatten. Derselbe Quellinhalt, Kamera und Licht; keine neue generische Demowelt.
Kein Auftrag, die zehn Game-Feel-Ideen oder alle 20 Repos auf einmal umzusetzen. Auswahl durch vorhandenen WS0/WS1b-Owner am gebauten POC. Optionaler Video-Export später über WSV.
Beweis: kurze vollständige Bewegungssequenz + gleiche Schlüsselbilder A/B, Kontakt/Schatten synchron, Augen/Mund lesbar, Steuerung/Ereignisse unverzögert, tatsächlich gemessene GPU-Differenz. WS0 prüft, Georg beurteilt die Gesamtwirkung.

## Return / Additiver Changelog R1.1
Georgs zwei Korrekturen übernommen: **WS1/GitHub** und **Gesamtkonzept statt Schatten-Slice**. Bestehende PR #435 frisch gelesen und angeschlossen. Eincheck bleibt Auftrag/Designrichtung, keine Runtime-Implementierung.
Tatsächlich ausgeführte Runtime-/Browser-/Performance-Tests: **0**. Neue Screenshots/Clips: **0**. Exakter WS1-Gesamt-POC-Pfad: **noch nicht identifiziert**, als gezielte WS0-GitHub-Quellenklärung offen.
Vorherige Schatten-Spezifikation bleibt unten als Teilanforderung erhalten. Kein neuer Owner und keine Veröffentlichung aus diesem Dokument.

---

# WS0 intake · Farbige echte 3D-Schatten im bestehenden MVP · R1
Datum: 19.10.2026 · Quelle: Georgs ausdrückliche Zustimmung und Eincheck-Auftrag im KFB-Hub-Chat, ca. 20:14 CEST.
Status: DESIGN DIRECTION ACCEPTED FOR TRIAL / IMPLEMENTATION AND VISUAL ACCEPTANCE OPEN.
Owner: WS0 (Steuerung/Registrierung), bestehender WS1/WS1b MVP- und Licht-Owner (Umsetzung). Kein neuer Runtime-Owner.
Receiving route: kfb-planet combo/r2; öffentlicher Quellspiegel georg-doc/kayfabizarro, ws1/combo-r2; Status/Handover ws1/r3f-frame. Beim Start aktuellen WS1b-Head erneut auflösen.

## Georgs Auftrag und verbindliche Absicht
Georg möchte den Ansatz im bestehenden MVP ausprobieren. Er berichtet, WS1 habe bereits einen ähnlichen Proof-of-Concept gebaut. Vor neuer Entwicklung zuerst diesen Kandidaten lokalisieren, isoliert zeigen und auf Wiederverwendung prüfen.
Kernkorrektur: Vereinfachung betrifft die sichtbare Gestaltung, nicht die Bindung des Schattens an die bewegte 3D-Geometrie. Ein zurückbleibender, eingefrorener oder nur angehefteter Schatten wirkt buggy und wie ein Fake-Shadow.
- Echte geometriebasierte 3D-Schlagschatten für Figuren, Racer und Props aus dem vorhandenen gemeinsamen Key/Rig. Schatten folgen Position, Orientierung, Pose, Animation und realen Empfangsflächen.
- Schattenfarbe aus vorhandener Biom-/Terrain-/Bühnenpalette (V-305, edgePalette); im Ocker-/Wüstenbeispiel ein passendes warmes Braun. Kein pauschales Schwarz oder neutrales Grau. Schatten dürfen dunkler sein; Farbe, Kontrast und Lesbarkeit werden im Bild beurteilt, keine neue feste Hex-Palette.
- Einfache, flächige Cartoon-Darstellung; auch harte Kanten sind ausdrücklich willkommen. Keine dekorativen Gradienten als Standard.
- Überlagerungen kontrollieren: kein mehrfaches Abdunkeln bis Schwarz, keine schwebenden dunklen Ringe oder wandernden Ersatzkreise.
- Keine gebastelten runden Blob-/Scheibenschatten als Ersatz für den echten 3D-Schatten.
- Die zusätzliche dunklere Farbmasse im unteren/vorderen Bildbereich ist eine kompositorische Terrain-/Look-Option. Sie ersetzt keine Objektschatten. Technische Lösung offen, keine verpflichtende Screen-Space-Maske.

## Aktuelle Quellen und Wiederverwendung
Frisch gelesen auf Register-Branch docs/kfb-decisions-register-2026-10-11:
- ARCHITECTURE_R1.md (WS0 steuert, nur WS1 integriert Spiel-Laufzeit).
- KFB_WORKING_RULES_R1.md; DECISIONS.md: V-305, V-385/392, V-403, V-429, V-440/447, V-539.
- replies/LIGHT_MODEL_R2.md und replies/BRIEF_WS1_LOOK_RUN_L2.md: ein Rig, ein Ton-Pfad, gleiche Beleuchtungslogik; vorhandene ältere Briefs nur nach aktuellen Korrekturen anwenden.
- replies/BRIEF_WS1B_TAKEOVER_R1.md.
Frisch gelesen auf ws1/r3f-frame: WS1_STATUS.md §§94–97 und WS1_HANDOVER.md.
Die Übergabe nennt combo/r2 @d762916, Spiegel @15d6727 und Licht v1.1 als vorhandene Basis. Dies sind dort berichtete historische Stände, kein hier neu geprüfter aktueller Runtime-Head.
V-429 hebt die Zwischenregel ohne Figureneigenschatten auf. V-440/447 korrigiert Bias/Frustum für kleine und große Objekte. Die alte Formel normalBias = 1,5 × Texel aus LIGHT_MODEL_R2 nicht blind wieder einführen.

WS1-Suchstand: WS1 in der GitHub-Default-Branch-Suche, Register DECISIONS.md und replies-Verzeichnis nicht eindeutig als der genannte POC identifiziert. Diese begrenzte Suche beweist keine Abwesenheit; lokale Design-Sitzung, Dropbox/Exports und Hub-Eingänge durch WS0 prüfen. Kein Source-Isolation- oder Donor-PASS behauptet.

## Kleiner Auftrag an WS0 → WS1b
1. WS0 registriert Georgs neue Richtung im eigenen build_decisions.py-Weg mit neuer V-Nummer und ordnet die Probe im bestehenden Look-Backlog ein. Diese Intake-Datei vergibt keine fremde V-Nummer und ändert keine Prioritäten laufender Jobs.
2. WS1-POC und aktuellen gemeinsamen Lichtpfad prüfen; Vorlagen-Zeile: tatsächlicher Pfad/Head, was übernommen wird, kleinster neuer Parameter-/Shader-Anteil.
3. Eine reversible Probe im bestehenden MVP hinter vorhandenem Look-/Debug-Schalter: Ausgangslook A gegen farbigen 3D-Schatten B, gleiche echte Figur, Racer, Kamera und Licht. Kein zweiter Renderer, Schatten-/Animations-Owner oder separates Demospiel. Keine neuen Figuren-/Rig-/UI-Entwürfe.
4. Vordergrund-Farbmasse erst nach der Schattenprobe als separat schaltbare Variante beurteilen, damit ihre Wirkung zuordenbar bleibt.

## Sichtbarer Prüfauftrag (noch NICHT ausgeführt)
- Gehen/Laufen und Arm-/Körperanimation: Schattenform und Lage folgen der tatsächlich gezeigten Pose ohne Versatz. Bei späterem Stop-Motion-Pose-Sampling Figur und Schatten synchron aus derselben präsentierten Pose; Physik/Steuerung nicht heruntertakten.
- Sprung/Landung: Projektion bleibt auf realen Empfangsflächen, Abstand/Form ändern sich nachvollziehbar; kein Schatten, der mit der Figur in der Luft klebt.
- Racer: Fahren, Lenken, Neigen/Sprung mit echter aktueller Fahrzeuggeometrie.
- Hang/Kante/Prop und zwei überlappende Schatten: keine Projektion durch Luft, keine Kreise, keine schwarze Überlagerung.
- Standbild und Bewegung: kein Peter-Panning, Saum, Akne oder Texturflimmern; bestehendes G6 und größenrobusten Licht-Selbsttest verwenden.
- Mindestens Ocker-/Braunterrain und eine zweite tatsächlich vorhandene Palette; Tag/Gold/Nacht nach bestehendem Rig, Gesicht/Augen lesbar.
- Identische Vorher/Nachher-Kameras plus kurzer Bewegungsclip. GPU-/Framezeit-Differenz auf Georgs Gerät sichtbar messen; keine erfundene fps-Garantie.
- WS0 prüft gegen Georgs Wortlaut, danach Georgs TUNE/PASS/FAIL am bestehenden MVP. Kein neuer öffentlicher Stage-Auftrag aus dieser Notiz.

## Return / Nachweis
Ergebnis dieses Einchecks: konkrete Richtung und begrenzter MVP-Prüfauftrag für WS0 gesichert; hier keine Runtime-Änderung.
Geprüfte Dokumente: oben benannt. Ausgeführte Runtime-/Browser-/Performance-Tests: 0. Neue Screenshots/Clips: 0. WS1-POC: UNRESOLVED, user-reported.
Offen: WS1-Pfad/Head, aktueller WS1b-Head, konkrete farbige Schattenkomposition im vorhandenen Lichtmaterial, sichtbarer MVP-Vergleich.
Genau ein nächster Schritt: WS0 pinnt WS1-Kandidat + aktuellen Licht-Owner und gibt WS1b die reversible A/B-Probe im bestehenden MVP.

## Additiver Changelog
- 19.10.2026 R1: Georgs Zustimmung zur MVP-Probe aufgenommen; echte mitbewegte 3D-Schatten, Palettenfarbe, harte Kanten möglich, keine runden Fake-Shadows. WS1 zuerst prüfen. Vordergrund-Farbmasse getrennt. Bestehende Licht-/MVP-Owner und Regression-Gates bleiben.
