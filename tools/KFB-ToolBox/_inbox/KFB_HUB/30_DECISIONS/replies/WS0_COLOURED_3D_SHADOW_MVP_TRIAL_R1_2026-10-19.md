# WS0 intake · Farbige echte 3D-Schatten im bestehenden MVP · R1
Datum: 19.10.2026 · Quelle: Georgs ausdrückliche Zustimmung und Eincheck-Auftrag im KFB-Hub-Chat, ca. 20:14 CEST.
Status: DESIGN DIRECTION ACCEPTED FOR TRIAL / IMPLEMENTATION AND VISUAL ACCEPTANCE OPEN.
Owner: WS0 (Steuerung/Registrierung), bestehender WS1/WS1b MVP- und Licht-Owner (Umsetzung). Kein neuer Runtime-Owner.
Receiving route: kfb-planet combo/r2; öffentlicher Quellspiegel georg-doc/kayfabizarro, ws1/combo-r2; Status/Handover ws1/r3f-frame. Beim Start aktuellen WS1b-Head erneut auflösen.

## Georgs Auftrag und verbindliche Absicht
Georg möchte den Ansatz im bestehenden MVP ausprobieren. Er berichtet, DS1 habe bereits einen ähnlichen Proof-of-Concept gebaut. Vor neuer Entwicklung zuerst diesen Kandidaten lokalisieren, isoliert zeigen und auf Wiederverwendung prüfen.
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

DS1-Suchstand: DS1 in der GitHub-Default-Branch-Suche, Register DECISIONS.md und replies-Verzeichnis nicht eindeutig als der genannte POC identifiziert. Diese begrenzte Suche beweist keine Abwesenheit; lokale Design-Sitzung, Dropbox/Exports und Hub-Eingänge durch WS0 prüfen. Kein Source-Isolation- oder Donor-PASS behauptet.

## Kleiner Auftrag an WS0 → WS1b
1. WS0 registriert Georgs neue Richtung im eigenen build_decisions.py-Weg mit neuer V-Nummer und ordnet die Probe im bestehenden Look-Backlog ein. Diese Intake-Datei vergibt keine fremde V-Nummer und ändert keine Prioritäten laufender Jobs.
2. DS1-POC und aktuellen gemeinsamen Lichtpfad prüfen; Vorlagen-Zeile: tatsächlicher Pfad/Head, was übernommen wird, kleinster neuer Parameter-/Shader-Anteil.
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
Geprüfte Dokumente: oben benannt. Ausgeführte Runtime-/Browser-/Performance-Tests: 0. Neue Screenshots/Clips: 0. DS1-POC: UNRESOLVED, user-reported.
Offen: DS1-Pfad/Head, aktueller WS1b-Head, konkrete farbige Schattenkomposition im vorhandenen Lichtmaterial, sichtbarer MVP-Vergleich.
Genau ein nächster Schritt: WS0 pinnt DS1-Kandidat + aktuellen Licht-Owner und gibt WS1b die reversible A/B-Probe im bestehenden MVP.

## Additiver Changelog
- 19.10.2026 R1: Georgs Zustimmung zur MVP-Probe aufgenommen; echte mitbewegte 3D-Schatten, Palettenfarbe, harte Kanten möglich, keine runden Fake-Shadows. DS1 zuerst prüfen. Vordergrund-Farbmasse getrennt. Bestehende Licht-/MVP-Owner und Regression-Gates bleiben.
