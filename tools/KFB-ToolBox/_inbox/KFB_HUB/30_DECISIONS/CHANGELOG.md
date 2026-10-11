# KFB Entscheidungen · Changelog (additiv, neueste oben, nie umschreiben)

## 2026-10-11 · Zwei FAILs
- V-123 Blender Island Form Kit 01 K1+K2 R1 FAIL; Georg hat Blender direkt neu gebrieft.
- V-124 WSA Protopia/Maker-Szene R1 FAIL (Zitat registriert, von WSA gemeldet nach V-122).

## 2026-10-11 · Blender Form Kit gestartet
- V-119: Georg hat die Freigabe an den Blender-Coworker weitergegeben; K1 + K2 laufen (zweite Baustelle neben C1b+C3). WSA nur Recherche.

## 2026-10-11 · levelSet Zwischenstand
- Zu V-116: Hirn/Darm/Niere gleich, Topologie 0/0/0 bei allen 8 Körpern, Dreiecke −60 %. Herz: Truncus-Rest (von O1 entfernt) per Feld-Maske entfernen (vorlagengetreu), helle Flecken mit geraden Kanten (Normalen/Farbe) beheben; Gefäßstümpfe als Befund mit Spielkamera-Bild. ?rkit=1 bootet mit 0 Warnungen.

## 2026-10-11 · Plan R1 gilt auch für WSA
- V-122 Georg: Plan R1 + Register maßgeblich gegenüber WSA-Router; Vier-Insel-A/B als Eingang für D/F. WSA bekommt START_HERE_STEERING.md. Antwort an Blender um Start K1+K2 ergänzt.

## 2026-10-11 · RKIT umgestellt
- Zu V-118/V-120 a: RKIT stoppt Widerlager-Paket und Bogenkette Town → Brocken → Protopia; Brücken-Dateien aus public/roadbeds nach retired/rkit-bridge_2026-10-11 (verschoben, nicht gelöscht); Bande am Ring gehört zur Strecke (J17, Lab). Gehweg/Bord Lauf 03 wartet auf Phase F.

## 2026-10-11 · Blender-Review: Persistenz-Lücken geschlossen
- Anlass: Blender-Coworker (Mac mini) fand: Plan R1 und Projektstand nicht auf GitHub, GitHub-Register nur bis V-084, kein Golden-Lieferant nach V-084, alte Besitzer-Tabelle bzw. RKIT-P2 nicht abgelöst, Georg-Entscheidungen nur in WSA-Returns.
- V-117 Dokument-Vorrang + Persistenz-Pflicht (GitHub bei jeder Änderung). V-118 RKIT nur Town, Rampen aus Track Core v0.14. V-119 Island Form Kit 01 als Golden-Lieferant. V-120 WSA-Entscheidungen übernommen (Brücke zwischen Inseln FAIL, Protopia/Maker getrennt, Gefängnismauern 1,6 m). V-121 Gefängnis-Greybox nach MVP-1.
- Plan R1 und PROJECT_STATE nachgeführt; START_HERE_STEERING.md und REVIEW_STEUERUNG_R1.md neu.

## 2026-10-11 · Organ-Vernetzung levelSet
- V-116 O1-Feld unverändert, Vernetzung per manifold-3d levelSet (Surface Nets war nicht mannigfaltig); Formgleichheit per Bild + Abstandsmaß; Pinches nur lokal bei Sichtbarkeit.

## 2026-10-11 · Leistungsziel neu
- V-115 Schranke ≥ 30 fps (3 Kameras), Ziel 60 später; Stufenwechsel mit Dither-Überblendung; Hebel 2 (Hero ≤ 350) verworfen (sichtbarer Sprung, kein Gewinn); Shader-Profil vor Render-Scale.

## 2026-10-11 · Nahband gemessen
- V-053 Nahband aus v10-eigenen Gewichten (Kanon 07.10. §8): Look gleich (Δ < 1/255), Übersicht 40,8 → 9,7 ms, nah bzw. mittel kaum besser. Steuerung: Nahband Standard; Hero-Stufe nur ≤ 350 lab (sonst O1-Light) ohne sichtbares Umspringen; Render-Scale zuletzt. Grundbau 7,7 s als späterer Punkt (Worker/Cache).

## 2026-10-11 · Tunnel per Mesh-Boolean
- V-114 manifold-3d (Apache-2.0) für den exakten Einbau der TC1-Tunnel in die Organ-Meshes; three-bvh-csg abgelehnt (keine Garantie für geschlossene Meshes).

## 2026-10-11 · C1b+C3 Zwischenstand Leistung
- Organ-Welt 22 fps gegen Spiel 36–56 fps; Ursache gemessen: clay-material v10 (Füllrate) kostet halbe Bildzeit. Dreiecke 176k ✓.
- Entscheidung Steuerung: V-053-Nahband (Umgebungs-Knete mit Nahband) zuerst messen und als Blatt v10 vs. Nahband an Georg; Render-Scale nur als letzter Hebel. Nebel danach eigener Punkt.

## 2026-10-11 · Tunnel-Pflicht für alle Inseln
- V-113 V-112-Regeln für alle Tunnel (Gebirge, Insel-Basis); durch die Basis mit Parkhaus-Logik nach oben bzw. unten, Vorlage J14-T4-Parkdeck (ZC).

## 2026-10-11 · Tunnel-Aufteilung
- Georg: Tunnel sauber ins Grundmesh einmodellieren, alle Mesh-Löcher fixen, keine lazy hacks; Prüfung offene Kanten 0 bzw. nicht-mannigfaltig 0 bzw. Durchblick-Test (in V-112).
- V-112 Tunnel: Bohrung aus O1 v7, Portal + Innenschale + Licht aus Joyride TC1 je Style.

## 2026-10-11 · Organe für MED-Welten
- V-111 Organ-Inseln bzw. -Attraktionen später für MED-Decks bzw. Fachgebiete; in C3 Vorlage, Inselmenge austauschbar für Phase D.

## 2026-10-11 · Protopia + Maker Space
- V-110 Farm- und Maker-Space-Insel mit Strecken-Anschluss (Brücke, Auffahrt, Rampe, Wendeschleife) als Referenz für C4 und Phase D; Look bleibt J17.

## 2026-10-11 · C1b+C3 Basis v7
- Zu V-109: Fork-Basis organ-islands.v7 im Ring-Modus (Strecke bytegleich v4; Georgs Fixes v5 Harnleiter glatt + Tunnel-Licht, v6 Durchdringungs-Check, v7 Mündung CUT_R 15). Attraktionen aus. Harnröhre entfällt seit v3 (Georg 03.10.), nichts zu reparieren. Tunnel-Licht als Pool (nächste 4) in light.ts.

## 2026-10-11 · C1b+C3 freigegeben
- V-109 neue Standard-Welt: O1-v4-Layout + J17-Look, v7-Mündung-Fix, Spawn auf Hex-Insel, alte Welt nur ?rkit=1. Harnröhre: v7 übernehmen oder als offenen Punkt melden.

## 2026-10-11 · C1a abgenommen
- Parity Lauf 4 grün (Spiel 10/10, Hub 9/9) mit V-107; Läufe 1–3 offen im REPORT (Fremdlast). Lichtkreis im Spiel belegt.
- Leistung: alte Hub-Welt 13,6–15,9 fps bei 618k Dreiecken (eigener Befund), Spiel ca. 50 fps. Vorgabe für C1b+C3: neue Standard-Welt ≥ Spiel-fps im selben Lauf, Ziel 60 fps, Richtwert ≤ 250k Dreiecke sichtbar.

## 2026-10-11 · Reihenfolge Phase C angepasst
- Zu V-103: C1b + C3 vor C2. Warum: Georg sieht bei jedem Test noch die alte Hub-Welt (FAIL-RKIT-Strecken); die J17-Strecke mit den Organ-Inseln wird zuerst die Standard-Welt, die alte bleibt nur unter ?rkit=1 (nichts gelöscht). C1a nimmt die Steuerung als technischen Gleichstand selbst ab; Bilder an Georg nur über die Steuerung.

## 2026-10-11 · Dystopia-Referenz
- V-108 Vulkanfestung bzw. Vulkanarena unter Blutmond als Dystopia-Referenz (Formen, Glut-Licht, Nachthimmel); Inselboden wie V-106 nicht übernehmen.

## 2026-10-11 · C1a gebaut, Parity in Sim-Zeit
- C1a: J17 1:1 als Lab-Seite (r186, offline, Δ 1,4–2,3/255 gegen Original); Squash .12/.18/.06 und Schienen-Kamera im Lab-FAHREN. r186: PCFSoft → PCF.
- V-107 Parity-Checks Hub 5/8 in Sim-Zeit, Leistung separat. Lichtkreis im Hub aus (Fix).

## 2026-10-11 · Mauer-Referenz Gefängnis-Insel
- V-106 TUNE: Inselboden der Blätter zu sehr drangeklebt; Inselkörper bleibt Schollen-Design (V-015).
- V-105 Gefängnis- bzw. Maze-Insel + Wall-Kit-Blatt als Mauer-Referenz mit Skins (A Stein, B Sci-Fi später); abgelegt unter docs/golden/candidates/prison-maze_2026-10-11/.

## 2026-10-11 · Farbe bestätigt, Übergang B
- V-102 PASS: schieferblaue Fahrbahn, orange Banden (ersetzt Wortlaut „orange Fahrbahn“ in V-010).
- V-104 Übergang Stadt ↔ Strecke: Variante B (17 m weiche Überlappung) als Arbeitshypothese; Seitenkamera-Blatt entfällt (Georg: weglassen).

## 2026-10-11 · C1 geteilt
- Zu V-103: C1a = J17 1:1 als eigene Lab-Seite (Spender unverändert, r186, offline, Gleichstand-Test; Squash + Schienen-Kamera im Lab-FAHREN). C1b = Szenen-Integration (ein Renderer bzw. Licht- bzw. Himmel-Besitzer) zusammen mit C3. Warum: J17-boot ist ein Monolith; 1:1-Übernahme statt Umbau. Spender-Ordner und Track Core bleiben lokal.

## 2026-10-11 · C0 geliefert
- V-095 Sichtvergleich A/B im Original-J14 (ein Blatt, kein Tuning): A und B ändern die Zone gegenüber dem Original, untereinander in der Verfolger-Kamera kaum unterscheidbar. Urteil bei Georg. V-102 im Original bestätigt (schieferblau, orange Banden). C1 läuft.

## 2026-10-11 · Phase-C-Vorlagen-Zeile freigegeben
- V-101 gebaut und geprüft (Nahtwerte ≤ Segmentschritt, Parity grün).
- V-103 Phase-C-Reihenfolge C0–C5; Deformer v2 draußen, Schienen-Kamera nur im Fahren, offline.
- V-102 (TBD, Georg): Fahrbahnfarbe wie J17 tatsächlich (schieferblau, orange Banden); Wortlaut V-010 zur Bestätigung.

## 2026-10-11 · A10 geliefert
- V-092, V-096, V-097 umgesetzt (Regen mit Tropfen, Flare, Aurora im Spielbild, Lichtkreis × Nachtgewicht, Zyklus). Parity grün.
- V-101 AUTO-Skydome mit Überblendung (Option a), Aurora 5°.

## 2026-10-11 · Tunnel-Styles
- V-100 Joyride-Tunnel-Styles (4+) 1:1, je Tunnel wählbar.

## 2026-10-11 · Anschluss-Arten
- V-099 Insel-Anschluss: Auf- bzw. Abfahrt, Tunnel mit Rampe nach oben, später Paternoster-Plattform.

## 2026-10-11 · Organ-Inseln als Vorlage
- V-098 Organ-Inseln bzw. Organ-Attraktionen Pflicht-Vorlage für C bis E; Export O1 v4 aus Claude Design angefragt.

## 2026-10-11 · A10 Entscheidungen
- V-097 Lichtkreis (WhackMan 1:1, × Nachtgewicht, Standard 60 %), Aurora-Elevation als Parameter. Parity-Einschwingzeit 3,0 s bestätigt.

## 2026-10-11 · Phase C freigegeben
- Georg: nach A10 startet Phase C Joyride-Rückgrat (V-010, V-095). Umgebungs-Knete (V-053) wird mit dem Bodenlook zusammengelegt, wo sinnvoll.

## 2026-10-11 · Licht-Kreis
- V-096 Licht-Kreis = TinySkies-Fog-of-War um den Spieler (Georg).

## 2026-10-11 · B2 Figuren-Auswahl geliefert
- V-061 umgesetzt: 67 spielbare Figuren, Wähler (Taste C bzw. FIGUR), Gruppen A PASS / B vorläufig (Large dx/dy) / C Kandidat / D Original-Augen / E FrizzleBob; V-053 Figuren-Knete = RA2 fine; V-090 Augen; OrcRaider-Textur zur Laufzeit (Registry-Angabe „embedded“ falsch); Farmer-Lid #f6c19d. Parity grün.
- Befund: Rig_Large hat keine Sprung-Clips und kein Running_B (Large-Sprint = Running_A ×1,3; Large 1,14 H/s). Legacy-Orks statisch mit Original-Augen.

## 2026-10-11 · TinySkies, Insel-Konzepte, Track-Core-Research
- V-092 TinySkies-Effekte (Regen-Tropfen, Aurora, Flare, Licht-Kreis) als A10 nach B2.
- V-093 Portale und Tornados TBD.
- V-094 Webchat-Insel-Konzepte als Eingang für Phase F.
- V-095 Track-Core-Übergangs-Research als Eingang für Phase C.

## 2026-10-11 · Augen-Regel, Unity-Inseln
- V-090 neuere Augen-Abnahme gilt (Georg bestätigt).
- V-091 Ufer, Claymation und Color-Themes auf Unity-Inseln: später prüfen.

## 2026-10-11 · Wasser und Figuren-Auswahl
- V-052 Wasser umgesetzt: fluid.js 1:1 (Texturen lokal). PondLand ohne echtes Becken → nur Fläche; volle Kette See plus Fluss mit Ufer auf `?stage=lake`; addPond/addRiver auf edits[] für Phase F. Parity grün, noch kein Wasser-Test.
- B2 freigegeben. Offene Georg-Frage: Augen Large (EYE-CLEANUP-01 vom 01.10. anchored vs. rig-large-reviewed vom 20.09. dx/dy); vorläufig gilt die neuere Abnahme.

## 2026-10-11 · Almanach R2
- V-043 umgesetzt (rechts, gerade, letzte 7 + „+N“, Overlay mit Raster, lazy). Parity grün.
- V-089 Deck → Welt vorläufig nach registry.role.

## 2026-10-11 · B0 geliefert
- Parity grün (game 10/10, hub 9/9): V-020, V-021, V-022, V-023, V-025, V-026, V-041, V-073 PASS. Ungeprüft: Zoom-zum-Cursor im God-Mode, Slider (nur Standbild).
- V-088 Kamera-Werte eingetragen.

## 2026-10-11 · Kamera-Slider-Vorlage
- V-025 präzisiert: Default-Kamera-Slider = RollerCoaster v11 „Pet-Position“ (Georg).

## 2026-10-11 · Kein neues Repo
- V-087 ersetzt V-073 Weg (a): kein `kfb-private-assets`. Cozy Tunes bleiben lokal im Lab; private Ablage später in einer bestehenden privaten Kiste, dann öffentlich löschen.

## 2026-10-11 · KFB-Münder, privates Repo
- V-086 KFB-Münder als optionaler Ersatz in der Figuren-JSON (Backlog).
- V-073 Weg (a) gewählt: privates Repo `kfb-private-assets` plus eigener Deploy-Schlüssel. Repo-Anlage über die GitHub-Integration verweigert (403), deshalb legt Georg das Repo an und trägt den Schlüssel ein.

## 2026-10-11 · Checkliste Georg
- V-085 Sprechblasen, Denkblasen, Comic-Wörter (TBD).
- V-073 Cozy Tunes: erst privat und im Spiel bzw. auf der GPT-Site 100 % verfügbar, dann öffentlich löschen. Lokale Lab-Kopie angelegt (`public/private-audio/`, gitignored, 24 Dateien, 194 MB).

## 2026-10-11 · Warum und Wann
- Jeder Eintrag hat jetzt „Warum“ (Grund) und „Gilt ab“ (Phase bzw. Zeitpunkt) zusätzlich zum Entscheidungsdatum. Georg: „why & when für decisions etc“.

## 2026-10-11 · Register angelegt
- `DECISIONS.md` und `decisions.json` (Schema `kfb.decisions/1`) aus `build_decisions.py` erzeugt: Teil A 46 Einträge (V-001 … V-084), Teil B 66 importierte Abnahmen aus STATUS- bzw. RETURN-Dateien.
- Nachgetragen aus Plan R1, PROJECT_STATE, Bestandsliste, Postmortems und den Chat-Entscheidungen vom 10. und 11.10. (Joyride-Goldstandard, WoW-Steuerung und -Kamera, Sprünge, HUD R3 mit Rucksack, Almanach, Insel-Thema, Wasser, Figuren-Auswahl, Studio-Übernahme, Lizenzen, TBD Interaktion).
- Pflichtregeln für jede Lab-Sitzung in `KFB Island Worldbuilder Lab/CLAUDE.md`.
- Georg: „und doku-pflicht für dich für alle decisions, designs etc -> living doc“, „additives changelog dazu“ → V-003, V-009.
