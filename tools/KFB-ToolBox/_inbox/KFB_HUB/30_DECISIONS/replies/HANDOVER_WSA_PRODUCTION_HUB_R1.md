# Übergabe an WSA Work · Production Hub / Control Sites R1 (12.10.2026)

Von der Steuer-Sitzung (Claude Code), Auftrag Georg: Alle offenen Entscheidungen, Briefings und nächsten Schritte sollen **zentral auf deinen Production-Hub- bzw. Control-Sites bei ChatGPT** liegen, wie bisher alles. Das claude.ai-Steuerpult entfällt; der Inhalt kommt vollständig hierher.

Alle Pfade gelten relativ zu `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/` im Branch `docs/kfb-decisions-register-2026-10-11`.

## 1 · Was du tust
1. Lege auf dem Production Hub einen Bereich **„KFB Worldbuilder · offene Entscheidungen“** an. Darin stehen die 20 Fragen aus `replies/open-decisions-2026-10-12.json`, jeweils mit Kontext, Optionen, Bild (Pfad im Branch) und einem Notizfeld für Georg.
2. Lege einen Bereich **„Nächste Schritte“** mit den Slices S1–S12 an (gleiche Datei, Feld `slices`), mit Besitzer, Voraussetzung, Abnahme und Status.
3. Lege einen Bereich **„Offene Briefings“** an (Liste unten, §3).
4. **Rückweg:** Georgs Antworten legst du als `replies/GEORG_ANSWERS_<JJJJ-MM-TT>.json` in den Branch, mit dem Schema `{"schema":"kfb.georg-answers/1","answers":[{"id":"d03-bay","answer":"Erledigt","note":"…","date":"…"}]}`. Die Steuerung trägt daraus V-Nummern ein und aktualisiert Plan und Slices. Danach bekommst du die neue Liste.
5. **Wahrheit bleibt das Register** (`DECISIONS.md`, `CHANGELOG.md`). Der Hub ist Ansicht und Eingabe. Zeigt der Hub etwas anderes als das Register, gilt das Register.

## 2 · Lesen zuerst
- `START_HERE_STEERING.md`: Vorrang, Zuständigkeiten.
- `DECISIONS.md` (V-001 … V-190) und `CHANGELOG.md` (neueste oben).
- `lab-docs/KFB_WORLDBUILDER_PLAN_R1.md`: Masterplan, §5 Slices, §2h–§2l neu.
- `lab-docs/POSTMORTEM_STEERING_R2_2026-10-12.md`: Lessons Learned.

## 3 · Offene Briefings und Aufträge
| Auftrag | Wer | Stand | Datei |
|---|---|---|---|
| Gegenprüfung Architektur-Audit | WSA | wartet auf S1–S3 + frischen Code-Schnappschuss (V-178) | `replies/AUDIT_ARCH_R1.md` |
| Szenen-Studie Teil B (StreakByte-Inseln) | WSA | wartet auf Georgs ZIP | Brief Szenen-Studie R1 (Lab `deliveries/BRIEF_WSA_SCENE_STUDY_R1.md`) |
| Blender R4 Coconino-Mesas, dann R3 Inselboden | Blender (Mac mini) | eigener Branch, läuft bei Bedarf | `replies/BRIEF_BLENDER_COCONINO_R4.md`, `replies/BRIEF_BLENDER_INSELBODEN_R3.md` |
| C4c-Folgen, dann Flackern und Ladezeit | Lab-Bau-Sitzung | läuft (S1 → S2 → S3) | `lab-docs/PROJECT_STATE.md` |
| Lichtvergleich J17 / E50 | Lab-Bau-Sitzung | nach S2 | `replies/STEERING_REPLY_WSA_C_R1.md` |
| Rhythmus-Paket und Billboards | Lab-Bau-Sitzung | nach S3; Durchfahrt ≈ 9,0 lab (V-185) | `replies/STEERING_REPLY_WSA_RHYTHM_R1.md`, `STYLE_GUIDE_3D_R1.md` §6b/§6c |
| Motion ins Lab (Clips, Brauen) | Lab-Bau-Sitzung | nach S3 | `MOTION_GUIDE_R1.md`, `replies/WSO_CLIP_CATALOG_R1.md` |
| Deterministische Tests (Replay) | Lab-Bau-Sitzung | S6 | `replies/REPLAY_HARNESS_SPEC_R1.md` (V-190) |
| Dungeon-POC Schritt 2 | POC-Agent | wartet auf d18–d20 | `replies/DUNGEON_POC_R1/REPORT.md`, `replies/DUNGEON_TRACK_FEASIBILITY_R1.md` |
| NPC Performance Proof Folge-Schritt | Motion-Agent | wartet auf d15–d17 | `replies/NPC_PERFORMANCE_PROOF_R1/REPORT.md` |
| Worldbuilder-Module vorbereiten | Steuerung | wartet auf d08 | `replies/WORLDBUILDER_MODULE_MAP_R1.md` |
| RKIT (Track Core) | RKIT | pausiert; später Leitpfosten, Cosmic-Pylonen, runde Dungeon-Innenecken | `replies/RKIT_*` |

## 4 · Regeln für die Darstellung
- Kurz und lesbar für Georg; Bilder groß; die Empfehlung der Steuerung steht, wo vorhanden, im Kontext.
- Keine Lizenz- oder „kein Bau“-Floskeln (V-184).
- Keine neuen Entscheidungen erfinden; Fragen nur aus der JSON-Datei oder von der Steuerung.

## Offene Entscheidungen (20)

| ID | Bezug | Frage | Optionen | Bild |
|---|---|---|---|---|
| d01-trash | Aufräumen | Alte Arbeitsstände in den Papierkorb? | Ja, alles / Nur die WIP-Ordner / Nein | – |
| d02-archive | Aufräumen | Überholte Dokumente archivieren? | Ja, archivieren / Nein | – |
| d03-bay | V-138 | Haltebucht: erledigt oder weiter TUNE? | Erledigt / Nach dem Umbau nochmal ansehen | – |
| d04-order | V-171 | Licht und Rhythmus vor Speicher und Tests? | Technik zuerst (S5, S6) / Licht und Rhythmus vorziehen (S7, S8) | – |
| d05-dungeon | V-182 | Wo liegt die Dungeon-Strecke? | Durch eine Insel / Eigene Dungeon-Insel / Frei im Raum / Alle drei als Varianten | – |
| d06-trackcore | V-071 | Track Core v0.12 liegt öffentlich auf main | Mit neuem Commit entfernen / So lassen / Später klären | – |
| d07-librarian | V-176 | Wer ist der Bibliothekar der Akashic Library? | Bestehende Figur (Name in Notiz) / Neue Figur, später / Weglassen | – |
| d08-prep | V-188 | Vorbereitung Worldbuilder-Module jetzt starten? | Ja, als Agent starten / Später | – |
| d09-maker | V-188 · nach MVP | Was meinst du mit Maker Island? | Maker-Space-Insel als Bauort / Bau-Modus auf eigenen Inseln / Beides | – |
| d10-makerscope | V-188 · nach MVP | Was dürfen Spieler im Maker-Modus? | Nur Teile auf ein Hex-Raster / Teile frei mit Snap an Strecke und Mauer / Auch Gelände und Strecke ändern | – |
| d11-share | V-188 · nach MVP | Maker-Bauten teilen? | Lokal / Veröffentlichen mit Freigabe | – |
| d12-worldfile | V-188 | Eine Welt-Datei oder eine je Insel? | Eine Hülle (Empfehlung) / Datei je Insel + Layout | – |
| d13-makerui | V-188 · nach MVP | Maker-Modus im Spiel oder als eigene Seite? | Schalter im Spiel / Eigene Seite | – |
| d14-worldstudio | V-188 | Was ist „KFB World Studio MVP1“? | Spender, prüfen lassen / Nicht relevant | – |
| d15-npc-v1 | V-187 | NPC Performance Proof: Urteil zum Clown (v1) | PASS / TUNE / FAIL | `NPC_PERFORMANCE_PROOF_R1/contact_v1.jpg` |
| d16-npc-v2 | V-187 | Nachgetimte Version v2: besser oder schlechter? | v1 besser / v2 besser / Beide zu still | `NPC_PERFORMANCE_PROOF_R1/contact_v2.jpg` |
| d17-npc-next | V-187 · S12 | Nächster Motion-Schritt | Zweifel deutlicher machen / Auf Brauen und Mund warten / D1 und D4 als Nächstes | – |
| d18-dungeon-blockout | V-182 | Dungeon-Blockout: Richtung stimmt? | PASS / TUNE / FAIL | `DUNGEON_POC_R1/S1_chase_fackelgang.jpg` |
| d19-dungeon-ramps | V-182 · S11 | Rampen: Spindel oder zwei gerade Rampen? | Zwei gerade Rampen reichen / Spindel in Schritt 2 / Beides als Varianten | `DUNGEON_POC_R1/S3_draufsicht_layout.jpg` |
| d20-dungeon-corners | V-182 · S11 | Haarnadeln: eckig lassen oder runde Innenecken bauen? | Eckig lassen (Geisterbahn) / Runde Innenecken bauen / Beides, je nach Strecke | `DUNGEON_POC_R1/S4_chase_haarnadel.jpg` |

Den vollen Kontext je Frage enthält `open-decisions-2026-10-12.json` (Feld `context`).

## Slices (Plan R1 §5)

| # | Slice | Besitzer | Voraussetzung | Abnahme | Server | Status |
|---|---|---|---|---|---|---|
| S1 | C4c-Folgen: Auto in die Bucht, Randlinie, Zebra 3 Balken, Spalt füllen; dann C4c als Standard | Bau-Sitzung | – | Parity PASS, offene Kanten 0/0, Tests ≥ 50 fps, Standbild Bucht | Lab 5192 | läuft |
| S2 | Flacker-Paket (dynres, LOD-Hysterese, Rippe nur nah) | Bau-Sitzung | S1 | Flicker-Probe: kein Bildpaar über 0,5 % | Lab 5192 | als Nächstes |
| S3 | Insel-Cache: fertige Körper zwischenspeichern | Bau-Sitzung | S2 | kalt ≤ 15 s, warm ≤ 5 s, Parity unverändert | Lab 5192 | wartet |
| S4 | WSA-Gegenprüfung des Audits am reparierten Stand | WSA | S1–S3, frischer Code-Schnappschuss | Gegenprüfung R1 ohne Schlussfolgerungen der Steuerung | Parallel | wartet |
| S5 | Speicher: manifold delete, Caches leeren, Debug nur mit Schalter | Bau-Sitzung | S3 | Heap vorher/nachher gemessen | Lab 5192 | wartet |
| S6 | Vendors entkoppeln, deterministische Tests, lokales Git | Bau-Sitzung | S5; Bauanleitung REPLAY_HARNESS_SPEC_R1 (8 Schritte, 6–9 Tage); vorher vendor/SOURCE.md nachziehen | 3× gleiche Hashes, einmal mit CPU × 4; k2b byte-gleich | Lab 5192 | wartet |
| S7 | Lichtvergleich J17-Tag / E50 | Bau-Sitzung | frei ab S2 | 3 Standbilder gleiche Kamera + Tunnel; dein Urteil | Lab 5192 | wartet |
| S8 | Rhythmus-Paket: Kamera-Freiraum messen, Tempo loggen, Δt-Serie; dann Laternen, Fackeln, Tor, Billboards | Bau-Sitzung | S3; Modell-Auswahl steht | Messwert in lab; Standbild-Serien je Skin | Lab 5192 | wartet |
| S9 | Motion ins Lab: 3 Library-Clips, Seitwärts-Clips, Brauen | Bau-Sitzung | S1–S3 | Parity PASS, Kontaktbogen je Clip | Lab 5192 | wartet |
| S10 | Blender R4 Coconino-Mesas M01–M03, dann Insel J1 | Blender (Mac mini) | Brief R4 | Blatt gegen CC1/CC2, ein geschlossenes Mesh | Parallel | wartet |
| S11 | Dungeon-POC Schritt 2: Labyrinth über Adapter | Dungeon-Agent (Port 5194) | Schritt 1 läuft gerade | Draufsicht mit Fahrlinie, Tests ≥ 50 fps | Parallel | wartet |
| S12 | NPC Performance Proof: nächster Schritt | Motion-Agent | R1 läuft gerade | reproduzierbar, Kontaktbögen, Fußkontakt | Parallel | wartet |