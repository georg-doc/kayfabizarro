# KFB Entscheidungen · Changelog (additiv, neueste oben, nie umschreiben)

## 2026-10-14 · Host-Vertrag R3F R1.1
- V-211: replies/KFB_HOST_CONTRACT_R3F_R1.md ins Register; Nachträge für R1.2: fiber exakt pinnen, Sprechblasen als Host-DOM-Slot (chatterbox-core 1:1).

## 2026-10-14 · Arbeitsregeln R1
- KFB_WORKING_RULES_R1.md: 26 bewährte Regeln aus zwei Wochen Lab (Vorlage zuerst, derselbe Code-Pfad, Bildpaare, Parity/Replay, blinder Kritiker, externes Audit, unabhängige Gegenprüfung, Register + Changelog, GitHub SSOT, Post-Mortems, glanceable Fragen, Single-three, Cache, Speicherwächter, Dialog nur aus Pool, plain Blasen). In START_HERE verlinkt, für WS1 und Strang B.

## 2026-10-14 · Racetrack-Baukasten für R3F vorgemerkt
- V-210 (TBD): R3F-Track-Baukasten mit sauberer Physik/Steuerung/Architektur nach dem Karten-Dialog-MVP; Quellen SP13KTRA, KFB-Stunt-Car-Race/_inbox, Rapier, Track Core als Datenmodell; zuerst Spezifikation.

## 2026-10-14 · Neue Ausrichtung: Karten-Dialog zuerst
- V-209: Fokus ChatterBox/karten-basierter Dialog mit Wireface (PR #355/#365/#379); kein Racetrack nötig, J17 nur Look-Referenz; Spielrahmen WS1 (R3F); Worldbuilding prozedural + God-Mode, KFB-Landmarks als Eingang; Lab wird Teilelager. Georg: Drift Q/E im Auto vertauscht bzw. kaputt (Regress, nicht mehr gefixt).

## 2026-10-13 · J17 als Grundlinie, zwei Stränge
- V-207: MVP = J17 1:1 + fertige Blender-Stücke als Erweiterung; Abzweige von der Joyride-Platte zu den Inseln; J17-Parcours = KFB Town (später God-Mode); ersetzt Organ-Ring-Welt als Basis. Später Platte organisch oder Meta-Kubus mit Dungeons/Etagen.
- V-208: Strang A J17-Welt (Lab, kein React-Umbau), Strang B Karten-Dialog-Modul (Triplets, Opener, Billboards) nach Modulvertrag; WS1-R3F-Slice getrennt (KFB_SLICE_INTEGRATIONSPLAN_R1), teilt nur Module; GitHub SSOT, Drive/NotebookLM nur Lese-Spiegel.

## 2026-10-13 · Fertig vor Vorlage
- V-206: nur fertige, gegen Referenz geprüfte Stände an Georg; Vorlage = derselbe Code-Pfad, nie Nachbau; ein J17-Pfad für alle Strecken; Track-Baukasten wird vor weiteren Inseln fertig gemacht (Stückliste, Bildpaar je Stück); Steuerung lässt Abweichungen nicht durch.

## 2026-10-13 · Insel-Zweige FAIL, Server neu
- V-205 FAIL: Knubbel-Bandenenden an den Insel-Abzweigungen, Strecken-Look Regress gegenüber J17/Ring. Fix mit C4c-Nase und gleichem J17-Profil, Abnahme nur Bildpaar gleiche Kamera. Steuerung hatte die Knubbel bei der Bildprüfung übersehen.
- 5192 war nach App-Neustart aus (Watchdog-Tab weg); neuer Watchdog-Tab gestartet.

## 2026-10-13 · V-202 erste Spielszene geliefert
- Hinter ?islands=1: Ring → PondLand (Witch + Clown) → Forest (Lorekeeper + Goth Girl) → Ring, Triplets aus dem Pool (#305/#310), Plain-Blasen (V-204), Suno je Insel, Räder auf der Fahrbahn + Kontaktflecken (V-203), Props geerdet. Abnahmefahrt PASS 59–60 fps, open-edges 0/0, Parity PASS. Steuerung geprüft: lesbar, läuft; bekannt: Lorekeeper und Goth Girl stehen zu dicht bzw. überlappen, Tür an der PondLand-Bank blockiert. Wartet auf Georgs Daumen.

## 2026-10-13 · Modul-Inventur für R3F-Slice
- replies/MODULE_INVENTORY_R1.md (+ proofs/) nach Georgs BRIEF_MODULE_INVENTORY_R1: Card Viewer (3 Wege, Datenweg geprüft), Clay v10 (HÜLLE, geprüft), Table Diorama (VORLAGE, Karten flach, eigenes three 0.160), Skydome (HÜLLE, geprüft), Env-Host (HÜLLE, besitzt Fog/BG/Licht), Seed World (HÜLLE, geprüft ohne Worker), KayKit-Clips (PASST), LOCO_SET kanonisch FEHLT, Blase V-204 (HÜLLE), chatter-2d nicht nutzen. Single-three- und pdf.js-Versionskonflikte notiert, 6 Fragen an Georg.

## 2026-10-13 · Sprechblasen Plain
- V-204 Sprechblasen Plain ohne Outline/Ink, gut lesbar, leichter Schatten ohne zweite Ebene bzw. doppelte Pfeilspitze; ab V-202.

## 2026-10-13 · S5 Speicher fertig
- manifold-WASM 2 647 → 381 MB (ohne Cache) bzw. 16 MB (mit Cache); HUD-Rucksack-Miniatur kostete ≈ 13 fps → jetzt 60 statt 46–52 fps bei 1280×800; Pro-Bild-Allokationen raus; Ring-/Graph-Checks aus dem Cache (−0,9 s). Alle Prüfungen grün.
- Augen-Ursache (V-201): Mount übernimmt Anker-Drehung (14–55° nach außen) → Schielen; im Lab fehlen blink, life, kinetics, oval, Tracking, Blickziele. Studio „KFB Batch EyeRig Atlas“ live unter kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-rig-batch/. Such-Protokoll Lab docs/concepts/EYE_RESTORE_SEARCH_R1.md; Slice später.

## 2026-10-13 · Bodenkontakt
- V-203 Auto und Props: sauberer Bodenkontakt und Schatten (kein Schweben, kein abgelöster Schatten), Teil der V-202-Abnahme.

## 2026-10-13 · V-202 Vorlage freigegeben
- Erste Spielszene: StreakByte-Demo-Inseln 07 PondLand (A) und 08 Forest (B), je ein Zweig per verallgemeinertem c4cCompile (EXIT/LEVEL_RAMP/ENTRY); NPCs PondLand Clown + Witch, Forest Goth-Girl (+ Lorekeeper nur als fertige Figur); Original-KayKit-Augen; Triplets aus RUNTIME_POOL (PR #310) über prepareResidentTurn (PR #305), DOM-Blase nach Formatvertrag; Suno-Track je Insel. Hinter ?islands=1. Beach erst nach Georgs Daumen. S5 fertig gebaut, Prüfreihe läuft.

## 2026-10-13 · Game-Design-Briefing für Web-Chat
- replies/BRIEF_WEBCHAT_GAME_DESIGN_R1.md: Georg klärt im Web-Chat Kern-Loop, Kartenspiel-Verbindung, Kern-Mechaniken (Kulturmechaniken), erste vertikale Scheibe ohne Schwundversion, Testfragen, Weglass-Liste. Ergebnis „KFB Game Design Kern R1“ wird Vorgabe für die Bau-Schritte. V-202 läuft parallel weiter.

## 2026-10-13 · Kurswechsel vertikale Scheibe
- V-202: Insel für Insel in voller Qualität statt Breite. Nach S5: erste Spielszene (2–3 vorhandene Inseln an den Ring, NPCs mit Triplet-Sprechblase, Suno je Insel, Original-KayKit-Augen). S6, Editor/Maker, Dungeon, Agenten, Fragenlisten ruhen bis Georg gespielt hat.

## 2026-10-13 · Augen weiter FAIL
- V-201: Augen nach Umbau nicht Georgs Augen, schielen nach außen, Blick-Leerlauf fehlt vermutlich. Stand einchecken, weiter mit S5; danach Slice Augen-Wiederherstellung 1:1 aus dem Eye-Rig-Studio, Abnahme nur Paar Studio | Spiel.

## 2026-10-13 · V-199 fertig, spielbar
- Strafen mit echten KayKit-Strafe-Clips (Medium lädt MovementAdvanced, S = rückwärts; Large gleitet mit walk-Clip), Einsteigen Leertaste + I (Georgs georgI-Schema 30.09.), Hinweis im Inselschild, Kleckse/Steine/Köpfe/Zwickel begehbar (steil nur Wand über stepMax), Hüpfer nur an echten Kanten, nie beim Gehen. Alle Tests ≥ 50 fps grün. Hinweis: Blick nahe Bucht headless 40–46 fps bei 1280×800 → in S5. Weiter V-200, dann S5.

## 2026-10-13 · V-200 Ursache Augen
- Spiel lädt pet-eye-rig.v6 mit Standardwerten (pupil .5, gloss .85, inset 0, converge 0); Georgs 19.09-Konfiguration (eye-rig-medium.batch-1.json, V-061) wurde nie gelesen; Farmer aus EYE-CLEANUP-02 (nur Kandidat). Steuerung: Sitz EYE-CLEANUP-01 + Georgs 19.09-Werte als Standard, Large mit rig-large-reviewed, Lid = Haut (V-090); Batch-Datei ins Lab; BASELINE-Lücke schließen.

## 2026-10-13 · V-199 Ursachen und Freigabe
- Strafen: Travel-Core nullt Seitwärts ohne Strafe-Clip → echte KayKit-Strafe-Clips aus S9 vorziehen. Einsteigen = Leertaste (J17), Hinweis „␣ Einsteigen/Aussteigen“ im Inselschild. „Hügel“ = Knet-Kleckse, Kantensteine, Ring-Köpfe, Zwickel nicht in der Lauf-Oberfläche → aufnehmen. Hüpfen: Bordsteinkanten beim Gehen weich hochsteigen statt Hüpfer. S5 halb (WASM kalt 2,65 → 0,38 GB, warm 6,6 s), danach fortsetzen.

## 2026-10-13 · Augen nicht abgenommen
- V-200 FAIL: Eye-Rigs im Spiel sind nicht Georgs abgenommene Fassung (V-061, V-090 EYE-CLEANUP-01); in den Spielbarkeits-Slice aufgenommen, Abnahme per Nahbild-Vergleich.

## 2026-10-13 · Flackern PASS, Spielbarkeits-Befunde
- V-198 flk=1 PASS → Standard. V-199 Georg: Strafen nur mit Vorwärts (gegen V-022), Einsteigen geht nicht, Figur läuft durch Hügel, Hüpfen beim Gehen komisch (TUNE). Steuerung: kurzer Spielbarkeits-Slice vor S5.

## 2026-10-13 · S2 Flackern + S3 Ladezeit
- Ladezeit 48,2 → 7,0 s (Neuladen 6,7): Lab-Inseln/Wolken im Organ-Modus aus, inhaltsadressierter Ergebnis-Cache (levelSet, TC1-Booleans, Knet-Karten) in ~/Library/Caches/kfb-lab/organ, alle 1017 Meshes byte-gleich. Warm ≤ 5 s noch offen, später.
- Flacker-Paket hinter ?flk=1 (dynres nur ein Abwärtsschritt, LOD-Hysterese, Rippe nur nah, near/polygonOffset); Probe DPR 2 + CPU × 4 PASS. Georg-Abnahme offen (d24). Weiter S5 Speicher, dann S6.

## 2026-10-13 · Maker offen
- V-197 Maker so frei wie möglich: eigene Heimatinsel/Welt, für andere sichtbar, gemeinsames Bauen; jetzt nur Architektur offenhalten (Welt-Vertrag R2: Welt je Spieler, teilbar, Op-Log für gemeinsames Bauen), Bau nach dem spielbaren MVP. Maker-Fragen d21–d23 damit beantwortet.

## 2026-10-13 · Welt-Vertrag R1
- replies/WORLD_CONTRACT_R1.md + 7 Schemas + DELTA.md (V-188/V-194): Hülle kfb.world/1, 18 Ops mit Gegen-Befehl, Undo/Redo, Rechte god/maker/player, Veröffentlichen per Antrag + Georg-Freigabe, Snap ohne Hex. Prototyp ~/Developer/kfb-world-ops: 34/34 Tests grün, Track Core runGraphChecks echt. Delta Top: editor.ts schreibt direkt (L), WorldSpec in localStorage (M), edits[] leer und Rundweg verliert Felder (M), Strecken-Graph im Code (M–L), scene-study /1 → /2 (S). Steuerung entscheidet: God-Mode-Welten zusätzlich als Dateien im KFB_HUB (V-191); Mauer-Raster aus dem bestehenden Mauer-Baukasten (V-105/V-106) übernehmen. 3 Maker-Fragen ins open-decisions-JSON (nach MVP).

## 2026-10-13 · Haltebucht geparkt, 5192 dauerhaft
- V-196 Haltebucht so übernommen, kein weiteres Feilen; später im Strecken-Konzept-TUNE.
- Lab-Server 5192 war 12.10. 02:20–13.10. aus (Vorschau-Server der Bau-Sitzung endet mit Zugende). Jetzt hält ein Watchdog-Tab im Terminal-Panel der Steuerung 5192 dauerhaft; Sitzungen starten 5192 nicht mehr aus der Vorschau.

## 2026-10-13 · Georgs Antworten umgesetzt
- V-192 Aufräumen erledigt (43 MB in ~/.Trash/KFB-cleanup_2026-10-13), Pläne/Briefs archiviert (Lab docs/retired, replies/archiv), Reihenfolge S2 → S3 → S5 → S6 → S7 → S8, Lorekeeper nicht modellieren. V-193 Dungeon in drei Varianten. V-194 God-Mode vs. Maker getrennt, Hex Legacy, Vorbereitungs-Agent (Vertrag kfb.world/1, Delta, Undo-Prototyp) gestartet. V-195 NPC-Proof TUNE; Vergleichsfragen nur mit großen Bildern. open-decisions-JSON aktualisiert (offen: d03 Bucht mit neuem Bild, d17–d20 werden neu gestellt).

## 2026-10-12 · S1 fertig: C4c ist Standard
- Bau-Sitzung V-183: Auto in der Bucht (Band auf Buchtseite verbreitert, Parkposition 0,25 m im Bordstein), Blocklinie, Zebra 3 Balken, Spalt gefüllt (LAB PATCH L), Bucht-Ende bereinigt; C4c Standard (?c4c=0 = C4b). open-edges 0/0, Parity PASS, Fuß- und Fahrtests grün. PROJECT_STATE aufgeräumt. Bild replies/V183_BAY/, d03 und Slices im open-decisions-JSON aktualisiert. Weiter S2 + S3.

## 2026-10-12 · Perspektive Production-Ansicht
- Georg: Die Production-/Meta-Ansicht soll später auch in der produktiven/Beta-GPT-Site KFB Worldbuilder/Game erscheinen. Übergabe §5 + V-191 ergänzt: Hub-Bereich datengetrieben aus open-decisions-JSON.

## 2026-10-12 · Übergabe an WSA Production Hub
- V-191 (löst V-189 ab): offene Entscheidungen (20), Briefings und Slices zentral auf WSAs Production Hub. replies/HANDOVER_WSA_PRODUCTION_HUB_R1.md + replies/open-decisions-2026-10-12.json; Antworten zurück als replies/GEORG_ANSWERS_<Datum>.json. Steuerpult-Fehler (Syntax) behoben, Seite bleibt nur als Archiv.

## 2026-10-12 · Dungeon-POC Schritt 1, 5192-Ausfall
- replies/DUNGEON_POC_R1/ (V-182): fahrbare Runde mit k2b, Cicada, J17-Kamera; WhackMan-Grundriss, KayKit-Dungeon-Pack; lichte Höhe ≥ 12,24 lab, Rampe 8,00 %, 0 Wandtreffer, Median 59,9 fps. Probleme: zwei gerade Rampen statt Spindel, eckige Haarnadeln R 8,8 (3,4 g), Sims, Licht zu hell, Track Core nicht benutzt. 3 Fragen ins Steuerpult.
- Lab-Server 5192 war ca. 00:50 und erneut um 01:09 weg (u. a. pkill -f vite eines POC-Agenten); Bau-Sitzung hat neu gestartet. Regel: Agenten beenden nur eigene PIDs.

## 2026-10-12 · NPC Performance Proof R1
- replies/NPC_PERFORMANCE_PROOF_R1/ (V-187): Clown, 8 s, seek(t) pixelgleich über zwei Läufe (auch rückwärts), Fußkontakt 0,0000 dank Oberkörper-Maske, Start=Ende, Augen/Kopf/Rumpf Frame 1/4/10. Schwach: Zweifel liest sich kaum, Mischbild in v2, Gesicht dünn. Projekt ~/Developer/kfb-npc-proof (Port 5195). 3 Fragen mit Kontaktbögen ins Steuerpult.

## 2026-10-12 · Modulkarte Worldbuilder R1
- replies/WORLDBUILDER_MODULE_MAP_R1.md (V-188): 38 Lab-Module, 24 Spender, 16 Live-Seiten (Einstieg /kfb-hub/). Wiederverwendbar: Insel-Rezept kfb.island-config/1, Track Core compileGraph/Checks, J17/TC1, Travel-Core/k2b, Kamera, HUD, Wasser, Klang, WB2-Sculpt, Resident-Atlas-Edit-Layer, Librarian. Lücken: Editor ohne Undo/Snap/Pinsel, edits[] leer, world-layout nur geplant, kein Zieh-Streckeneditor, scene-study /1 statt /2. Vorschlag kfb.world/1 + Befehle/Undo + Rechte je Modus. 7 Fragen ins Steuerpult.

## 2026-10-12 · Replay-Harness-Spezifikation
- replies/REPLAY_HARNESS_SPEC_R1.md: Ursachen (ein Sim-Schritt pro Bild, dt Wanduhr ≤ 50 ms, Walker prüft den Weg nicht, fps-Gate nur Mittelwert, Tests über Wanduhr-Tasten), Zielentwurf, 8 Migrationsschritte (6–9 Tage), Risiko Physik-Abgleich offline in Node. V-190 regelt Übergang von V-159. Nebenbefund vendor/SOURCE.md veraltet. Slice S6 im Steuerpult ergänzt.

## 2026-10-12 · Steuerpult, Housekeeping, Modulkarte
- V-189 Steuerpult (privates Artifact https://claude.ai/artifact/WxG16gvt7LNrBXxYkAhr9d, Quelle STEUERPULT.html): Reiter Entscheidungen (7 offene Fragen, Klick + Notiz, Steuerung liest aus) und Masterplan (Phasen A–H, Slices S1–S12 aus Plan R1 §5).
- Housekeeping: Register-Querverweise (18 Einträge), Plan R1 §2h–§2l + §5 Slices, START_HERE, Acceptance-Index, POSTMORTEM_STEERING_R2.
- V-188 Modulkarte Worldbuilder (Agent läuft).

## 2026-10-12 · Housekeeping: Register-Check, Plan R1 + Slices, START_HERE, Post-Mortem R2
- Register-Check: alle 150 Einträge in DECISIONS.md und decisions.json, Warum/Wann vollständig, V-160 … V-187 alle im CHANGELOG. Querverweise additiv ergänzt („[12.10.: → …]“) an V-010, V-024, V-033, V-050, V-060, V-071, V-073, V-118, V-119, V-123, V-156, V-166, V-168, V-169, V-171, V-174, V-175, V-182 (u. a. V-175 (3) → V-185, V-169 Einheit TC-m → V-185, V-166/V-168/V-171 → V-183). Neu erzeugt.
- Plan R1: Stand bis V-187; neu §2h Rhythmus/Billboards/Freiraum, §2i Banden-Enden und Audit-Reihenfolge, §2j Motion, §2k Dungeon, §2l Prozess 12.10.; §3 offen aktualisiert; §5 „Nächste Slices (Stand 12.10.)“ mit 12 Slices (Besitzer, Voraussetzung, Abnahme, V-Nummern, Lab 5192 vs. parallel).
- START_HERE: Aufträge 12.10. (Bau C4c-Folgen → V-171 Punkte 2–3; RKIT pausiert; Blender R4 im eigenen Branch; WSA pausiert bis V-178; Fable02/WSO Clip-Katalog geliefert; Hintergrund Dungeon-POC Schritt 1 + NPC Performance Proof R1). Vorrang-Liste unverändert.
- Post-Mortem R2 (Lab docs/POSTMORTEM_STEERING_R2_2026-10-12.md): acht Fälle (Banden, Einheiten, ungeprüfte Behauptungen, Fußtest unter Last, Bezugsmaße, Ladezeit/Flackern, Lizenz-Floskeln, Persistenz), Ursachen Steuerung zuerst, Lessons-Tabelle. sync_github.sh spiegelt jetzt alle Lab-POSTMORTEM_*.md.
- ACCEPTANCE_INDEX neu erzeugt (66 Abnahmen).

## 2026-10-12 · Dungeon-POC Schritt 1 gestartet, NPC Performance Proof vorgemerkt
- Agent baut Dungeon-Blockout (V-182) getrennt vom Lab: ~/Developer/kfb-dungeon-poc, Port 5194, Lab nur gelesen, Speicher-Wächter. Lieferung replies/DUNGEON_POC_R1/.
- V-187 (TBD) NPC Performance Proof R1 als nächster One-Shot.

## 2026-10-12 · Clip-Katalog R1 (Fable02/WSO)
- replies/WSO_CLIP_CATALOG_R1.md + clip-catalog.json: 16 GLB, 290 Clips gemessen (139 Medium, 34 Large bestätigt), Tags als Vorschlag, Zuordnung zu Zuständen, Emotionen, Survival Kit, Kulturmechaniken. Top 20 fürs MVP: 17 im Lab, 3 aus der Motion Library nachladen (später, Bau-Sitzung nach V-171). Lücken: Flug, Beifahrer, Sprech-Clip, Geschenke, Kayfabulieren, Paar-Tanz, Lesen.
- V-186 Motion Library 01 Abnahme 24.09. nachgetragen. Offen an Georg: Strafe-Clips vorhanden vs. V-022.

## 2026-10-12 · Dungeon-Machbarkeit, Einheiten-Korrektur
- replies/DUNGEON_TRACK_FEASIBILITY_R1.md: JA MIT UMBAU (Kit-Faktor K2 × 1,6, Gänge 3 Zellen = 17,6 lab für NARROW-Fahrbahn, Wände 2 Module = 12,8 lab, Etage 12,8, Rampe 8 % ≈ 160–300 lab oder Spindel R ≈ 25,5; Donor WhackMan v1 + S13.2 dungeon-grid.js; Lücken: runde Innenecken, Rampen-/Spindelraum, breites Portal, Dungeon-Skin im Core, Deckenlicht). POC nach V-171 Punkt 1–3 als eigene Sitzung.
- V-185 Korrektur V-175 (3): Kamera-Freiraum 4,9 ist TC-m (= 7,15 lab); Durchfahrtshöhe = max(5,8 lab, Lab-Kamera + 0,5), vorläufig ≈ 9,0 lab.

## 2026-10-12 · WSA-Auftrag Clip-Katalog vorbereitet
- replies/BRIEF_WSA_CLIP_CATALOG_R1.md für einen frischen WSA-Chat: alle KayKit-/Quaternius-Clips messen, Tag-Schema der Motion Matrix, Zuordnung zu Leitfaden-Zuständen, Survival Kit und Kulturmechaniken (V-177, V-181). Unabhängig vom Fable-Review.

## 2026-10-12 · Banden PASS, Schluss mit Lizenz-Floskeln
- V-183 Banden-Enden C4c v2 PASS (konzeptionelles TUNE später); Auto in die Bucht, Zebra 3 Balken, Spalt füllen; C4c wird Standard.
- V-184 Lizenz/öffentlich geklärt: keine Disclaimer mehr in Briefs/Berichten, nur neue Fälle in einer Zeile. START_HERE angepasst.
- Machbarkeits-Agent Dungeon-Track (V-182) gestartet. Review via Fable 5.1 läuft auf dem Mac mini (Georg).

## 2026-10-12 · Banden-Enden v2, Dungeon-Idee
- Bau-Sitzung C4c v2 (?c4c=1): Strang je Seite geteilt + J17-strangCap, alle 12 Enden geschlossen ohne Kehle, offene Kanten 0/0, Parity PASS. Haltebucht ist geometrisch da (+3,0 breit, 24 m, Verjüngung 19,2), liest sich nicht, weil das Auto in Fahrbahnmitte steht. Georg vorgelegt: Auto in die Bucht, Zebra, Spalt.
- V-182 (TBD) Idee Dungeon-Track mit KayKit-Dungeon-Pack: erst Machbarkeit, POC nach V-171 Punkt 1–3.

## 2026-10-11 · WSA Rhythmus-Inventur abgenommen
- 199 Kandidaten, 187 CC0. Steuerung wählt: Tiny Treats street_lantern + KayKit streetlight (town), KayKit post_lantern (Land), KayKit torch/torch_lit (stone/mesa), KayKit arch_gate (Eingangstor), Kenney sign-highway als Schilderbrücken-Form, RKIT-Poller. Leitpfosten + Cosmic-Pylonen fehlen → später RKIT-Knete. WSA pausiert bis Audit-Gegenprüfung V-178 (replies/STEERING_REPLY_WSA_RHYTHM_R1.md).

## 2026-10-11 · Brick-Fish und Kayfabulieren erklärt
- Georg: Brick-Fish-Wurf = Krazy-Kat-Logik mit Red-Herring-Meta-Ebene (NPCs bzw. Spieler am Kopf getroffen); Kayfabulieren steht in den KFB-Regeln (kayfabizarro.pages.dev/#kfb), Quest King Kayfabian. Beides nach MVP (zu V-181), MOTION_GUIDE §3f ergänzt.

## 2026-10-11 · Kulturmechaniken definiert
- V-181 Geschenke, Tanz, Debatte, Rauferei, Brick-Fish, Kayfabe/Kayfabulieren, Fluff ernten/formen/zerstören, Lesen. MOTION_GUIDE_R1 §3f mit vorhandenen Bezügen; Brick-Fish und Kayfabulieren nicht in den Docs gefunden.

## 2026-10-11 · Squash bei Stürzen
- V-180 Stürze/Wipeouts dürfen kurz stärker stauchen als 8 % (volumenerhaltend, Erholung auf 1,0); Grenze am Demo.

## 2026-10-11 · Motion-Leitfaden v0.2, C4c-Banden Zwischenstand
- V-179 Georg: Squash ≤ 8 % erlaubt, Emanata als Knet-Plättchen, Brauen jetzt ins Lab, Mixamo nutzen (nie öffentlich), Flug-400-ms-Fenster gilt. MOTION_GUIDE_R1 v0.2 mit Nachtrag §1d (THE_BIZARRO_MOTION_MATRIX: Survival Kit MVP 1, Augen→Kopf→Körper, Tag-Schema; H&D Runtime Strategy: Fake-Lip-Sync, Emotion als Datum, Alltags-Register). Neue offene Frage: Squash bei Stürzen über 8 %?
- Bau-Sitzung V-171 Punkt 1: C4c hinter ?c4c=1, geschlossene Knet-Köpfe, offene Kanten Standard 0, Fahr- und Fußtests grün, Palette V-174 umgesetzt. Offen: dunkle Kehle an mehreren Enden → Steuerung: getrennter Sweep je Seite jetzt, vor Flackern; Haltebucht-Bild neu (Schrägbild).

## 2026-10-11 · Motion-Leitfaden R1, WSA-Gegenprüfung terminiert
- V-177 MOTION_GUIDE_R1.md v0.1 (Motion-Director-Agent, blind gestartet): Bestand (Gangwerte gait_v157, travel-core.j17, car-hop, Eye-Rig v6, Acting Lab v0.4, ToolBox Brauen/Mund, Motion Library v6), 4-Kanal-Modell, 8-Emotionen-Matrix, Triplet-Takt-Kopplung, 5 NPC-Vorlagen, Demo-Plan D1–D5; alle Frame-Werte Vorschlag. Ungelesen: THE_BIZARRO_MOTION_MATRIX.pdf, H&D Runtime Animation Strategy.pdf.
- V-178 WSA prüft das Architektur-Audit gegen, nach V-171 Punkt 1–3.
- KFB Mesa Design (2 Bilder) = byte-gleich mit CC1/CC2 (REFS_COCONINO), nicht neu abgelegt; Georg gefragt.

## 2026-10-11 · Style-Guide-Antworten, Akashic-Referenzen, WSA Licht C
- V-175 Georg „1–5 ok“: Zieltempo bei Testfahrten messen, Δt per Race-Testfahrt in 3 Stufen, Durchfahrtshöhe 5,8, über der Fahrbahn nur Cover + Titel, fehlende Rhythmus-Modelle erst im Bestand suchen.
- V-176 KFB Akashic Library (replies/REFS_AKASHIC_2026-10-11, README mit Halluzinations-Liste): Stil, Stimmung, Strecken-Integration PASS; Szenerie weniger komplex.
- WSA Teil C Licht abgenommen (J17-Sonne 48,99°). Steuerung: ein Lichtvergleich J17-Tag + E50 über den vorhandenen Adapter, durch die Bau-Sitzung nach Banden + Flackern, hinter URL-Schalter. Nächster WSA-Auftrag: Bestandssuche Rhythmus- und Schildermodelle (replies/STEERING_REPLY_WSA_C_R1.md).

## 2026-10-11 · 3D Style Guide v0.2
- STYLE_GUIDE_3D_R1.md v0.2: V-174 eingearbeitet (§4 Banden J17, §5 S/M/L + Unterseiten nach IB1–3/CR3/ME2, §6/§7 country/mesa-Variante, Cosmic Glow-Standard); neu §6b Rhythmus-Elemente je Skin (Abstand = Zielgeschwindigkeit × Δt, zwei Höhenlagen unter/über Kamera) [V-172] und §6c Billboards + Insel-Eingangsschilder [V-173]. Δt-Werte und Platzierungsdetails als AD-Vorschlag markiert. Neue offene Fragen: Zielgeschwindigkeit je Zone in Lab-Einheiten, Δt-Werte, Durchfahrtshöhe 4,9 vs. 5,8, Inhalt über der Fahrbahn, Billboard-Größe in K2, fehlende Modelle (Fackeln, Leitpfosten, Pylonen).

## 2026-10-11 · dist/ entfernt
- Georg „YES“: alter Lab-Build-Ordner dist/ (76 MB, enthielt StreakByte-Assets) in den Papierkorb verschoben (~/.Trash/KFB-Lab-dist_2026-10-11); dist/ bleibt gitignored.

## 2026-10-11 · Style-Guide-Fragen beantwortet
- V-174 Bandenfarben vereinheitlichen (J17), Mesa-Strecke als Landstraßen-Skin-Variante, Cosmic Glow-Standard + Neon auf Cosmic-Inseln, J17 als Licht-Maßstab, S/M/L mit Tunnel-Bergen ≥ L.

## 2026-10-11 · Rhythmus-Elemente und Billboards
- V-172 Stakkato-Elemente je Skin (Lichter, Fackeln/Laternen/Pfähle, Licht-Pylonen). V-173 Billboards quer über der Strecke an ruhigen Stellen bzw. als Insel-Eingangsschilder. Art Director ergänzt den Style Guide.

## 2026-10-11 · Architektur-Audit, Spiral-Prüfung
- Externes Audit R1 (replies/AUDIT_ARCH_R1.md): Ladezeit = Neuberechnung je Aufruf, Flackern belegt durch dynres-Sprung, Banden offen/kollabiert, dist/ mit StreakByte nicht ignoriert (jetzt ignoriert), Tests bildratenabhängig. V-171 Prioritäten an die Bau-Sitzung.
- Track Core 0.16.10 spiral_clearance (td03 mit Stufen ≥ 20,74, ohne ≥ 23,53).

## 2026-10-11 · 3D Style Guide v0.1
- STYLE_GUIDE_3D_R1.md (Art-Director-Synthese aus Register, Plan, Referenzen; keine neuen Entscheidungen; 12 offene Fragen §10). Auf GitHub gespiegelt.

## 2026-10-11 · Kamera tiefer in engen Räumen (später)
- V-170 Kamera-Absenkung für Minenschächte bzw. niedrige Tunnel als späteres Kamera-Modul; Deckenhöhe als Strecken-Daten.

## 2026-10-11 · Spiral-Freiraum gemessen
- RKIT: td03-Spirale (auch in J17/P1 B/td05) 3,35 statt nötig 4,9 → FAIL; O1-Ring PASS. Prüfung spiral_clearance freigegeben; neue/genutzte Spiralen steiler (Georgs Richtung), J17-Referenz unverändert.

## 2026-10-11 · Spiralen höher
- V-169 Steighöhe je Umlauf ≥ Kamerahöhe + Hülle + Marge; Core-Prüfung + Kamera-Test.

## 2026-10-11 · Plan R1 + Projektstand nachgeführt, Lab-Code-Schnappschuss
- Plan R1: neue Abschnitte 2e Strecken-Baukasten mit Skins, 2f Inselkörper + Referenz-Bibliothek, 2g Klang; Phase C Status. PROJECT_STATE „Stand 11.10. spät“. Lab-Code + Text-Doku (ohne private/lizenzierte Teile) auf Branch sync/lab-snapshot-2026-10-11; Lab-.gitignore um StreakByte/MegaKit Pro/Decks ergänzt. Externes Architektur-Audit gestartet.

## 2026-10-11 · Abschlüsse rund + Rubble
- V-168 alle Schnittflächen/Mesh-Abschlüsse als gerundete Claymation-Form, ggf. Rubble (wie halboffene Insel-Szenen, Dungeon-Ruinen-Wände).

## 2026-10-11 · Coconino-Mesas für Blender
- V-167 CC1 (Mesa-Module M01–M03) + CC2 (Inseln J1/J2) als Blender-Auftrag R4 (vor R3). Abgelegt replies/REFS_COCONINO_2026-10-11/, Brief replies/BRIEF_BLENDER_COCONINO_R4.md (auch im Blender-Branch).

## 2026-10-11 · Georg live: Banden FAIL, Laden, Flackern
- Live-Test: zerrissene J17-Banden am Hub (FAIL, vermutlich C4c-Arbeitsstand), Laden 40–60 s, Flackern im Stand, Haltebucht nicht gefunden. V-166 Standardansicht nur geprüfter Stand. Organe als Platzhalter ok (V-127).

## 2026-10-11 · Cosmic-Look, Mesa-Insel, Steinbrücken später
- V-163 Cosmic = Neon-Vibe aus CO1/CO2 (ohne halluzinierte Elemente). V-164 Mesa-/Krazy-Kat-Coconino-Insel (ME1/ME2). V-165 Steinbrücken später für Antike-Inseln. Abgelegt replies/REFS_COSMIC_MESA_2026-10-11/.

## 2026-10-11 · Bank B TUNE, Budget
- V-162 Bank B TUNE 5–6/10 (Bergmasse um Tunnel zu dünn, Unterseite/Terrain „draufgelegt“, Strecke wenig organisch), passt erstmal. Georg: 20 % Nutzungsbudget verbraucht → Berichte bündeln.

## 2026-10-11 · Lab auf Track Core 0.16.9
- Teil 0 gegen v0.12 Δ 0; Gore/U-Turn 1:1 aus Core-Daten; nur noch track-core-0.16.9 im Lab. RKIT pausiert.

## 2026-10-11 · Poller endgültig, Track Core 0.16.9
- Poller-Parität PASS. Core-Fix moduleDeck (Gore/Nase an EXIT/ENTRY auf langen Strecken falsch), 22/22 + Regressionen, Ströme identisch; Ersatz 0.16.8→0.16.9 im Lab.

## 2026-10-11 · Poller geliefert (vorläufig)
- rkit_poller.parts.glb (0,85, lichte Weite 1,80), Q1–Q9 PASS; Lab-Parität steht aus (Spiel-Seite lädt gerade nicht, MVP baut an src). Icosphere = Blender-Import-Knochenform, keine falsche Datei.

## 2026-10-11 · Icosphere: Lab nicht betroffen
- Lab-Farmer-Dateien ohne Icosphere; Figuren-Maße aus Konstanten (FIG_SCALE 1,6, H 3,64) bzw. Knochen. RKIT nutzt künftig nur Lab-Figurdateien.

## 2026-10-11 · Poller-Höhe korrigiert, Icosphere-Fund
- RKIT: Hüfte 1,50 war falsch (Farmer-A-Modell enthält Hilfskörper „Icosphere“ in der Bounding-Box). Richtig 0,65–0,83 lab → Poller 0,85 hoch, Ø 0,50→0,44, lichte Weite 1,80. Lab prüft, ob Figuren-Maße irgendwo die Icosphere mitmessen.

## 2026-10-11 · Poller
- Kein Poller im Bestand (Lab-Suche + externe CC0-Suche nur realistisch/KI). Platzrand vorerst bündig ohne Poller; RKIT baut Poller als Town-Ausstattung im Lauf-03-Stil (Vorlagen-Zeile vorab). Zebra M2 1:1 je Zweig.

## 2026-10-11 · C4c freigegeben
- Erste Aus-/Auffahrt am Hex-Hub: compileGraph EXIT/ENTRY (RACE-Zweig), LEVEL_RAMP 0,6 m statt B5, J17-Übergang Variante B vor dem Platz, Bande endet mit strangCap, auf dem Platz bündig mit Pollern (Bestand). V-161 Weichen-Wechsel nach Seitenlage + Assist.

## 2026-10-11 · C4b fertig
- Organ-Welt auf Track Core 0.16.8 (LAB PATCH 15, Rollback ?core=012), Teil 0 bitgleich, Fahrt rundengleich, Fuß 60 fps PASS, parity PASS. Treppen v2 ohne Hüpfer (Füße kurz unter Trittkante → Kritiker). Alte Vendor-Kopien archivieren statt löschen.

## 2026-10-11 · Track Core 0.16.8
- trailStairs nach V-160 (0,30/1,3 bzw. 0,22/0,889 aus minTreadByRiser, Masonry A nur Look, 0,45 nie), 27/27, bitgleich. Folge fürs Layout: Treppen flach und lang, steile Wege brauchen Serpentinen.

## 2026-10-11 · Treppen nach Walker
- V-157-Treppentest: 0,444/0,889 → Jog/Sprint hüpfen (J17-Auto-Hüpfer summiert voraus). V-160 Treppen 0,30/1,3 (bzw. 0,22/0,889), kein Walker-Patch.

## 2026-10-11 · Bank B geliefert
- Tunnel im prozeduralen Inselkörper (ein Feld, ein levelSet, 0/0, Durchsicht 0, Freiraum ok, M und L). Tunnel-Technik passt; Inselkörper weit von IB2/IB3/CR3 (glatt, Fels als Splitter, Berg als Kappe). An Georg; Inselkörper-Arbeit pausiert bis zu seinem Urteil; Bau-Sitzung weiter mit C4b/C4c.

## 2026-10-11 · V-138 mit neuem GLB
- Bei 60 fps: RKIT-Bett allein lässt eine 0,05–0,1-Lücke vor dem Bord bei s≈119 (an RKIT, nicht eilig); mit Lab-Tasche G2 zusätzlich 0 Löcher, Fußtest PASS. Beide Lösungen aktiv.

## 2026-10-11 · hex_b7 Fuge an der Quelle behoben
- RKIT: Gehweg-Bett füllt Fuge Bord↔Platten (neuer sha 18a7dbc70243, Q1–Q9 PASS, alter Stand gesichert). LAB PATCH G2 bleibt optional; Lab prüft im nächsten Fußtest.

## 2026-10-11 · V-153 nach V-159 bestätigt
- Hatchback-Fußtest bei 60 fps grün; Fußtest-Skript schreibt fps/fpsOk. Fahrtest-Runden laufen in festen Physik-Schritten (bildratenunabhängig).

## 2026-10-11 · Haltebucht nachgebessert, falsches PASS korrigiert
- V-138-TUNE geliefert (Gehweg-Ende mit Knet-Zungen und eingesunkenen Kantensteinen, gewölbte Kleckse); an Georg. Korrektur: Fußtests V-138/V-153 von nachmittags waren falsch PASS (Fuge Bord↔Gehweg, unter Last übersprungen); Fix LAB PATCH G2, Fußtest bei 60 fps 6/6, parity PASS. V-159 Fuß-/Fahrtests nur ≥ 50 fps.

## 2026-10-11 · Vendor 0.16.7 im Lab
- Lab-Vendor: 0.16.1/0.16.2/0.16.3/0.16.7 (0.16.5 privat archiviert); gait_v157.json mit wallTan; Treppen-Fußtest-Anker in docs/handoff/rkit_trail_stairs_foottest_v1.json. RKIT pausiert.

## 2026-10-11 · Track Core 0.16.7
- trail mit gemessenen Gangwerten (Trittsteine jog ≤ 2,034, hop ≤ 2,705; Stufe 0,444/0,889), D4 DIRT|MOUNTAIN, HIGHWAY→DIRT eigener Fehler; trail 24/24, dirt 30/30, bitgleich. wallTan fehlt als Zahl in gait_v157.json → MVP-Sitzung trägt nach. RKIT pausiert.

## 2026-10-11 · WSA R2 abgenommen, Licht-Studie beauftragt
- WSA Look-Spec R2 (TD/CS/CR, skin inkl. trail) abgenommen; 17 der 19 Fragen bereits durch V-154/V-157/V-158 beantwortet (Zuordnung replies/STEERING_REPLY_WSA_R2.md). Nächster WSA-Auftrag: Szenen-Studie C Licht (J17-Tageslicht, Abend V-050, Tunnel-Innenlicht).

## 2026-10-11 · KayKit-Faktor, Gangwerte
- V-153 umgesetzt (Hatchback 5,40 × 2,80, breitestes Auto Cicada 3,11), Fahrtest 3 Autos alle Läufe 0 Fehler, Fußtest 6/6. V-157 gemessen (jog-Schritt 2,03 → Trittsteine nach jog). game Check 4 kippt unter Last (Notiz).

## 2026-10-11 · trail-Bibliothek
- Track Core 0.16.6: trailProfile/Stairs/SteppingStones/Footbridge/Transition/Checks (12 %, Masonry-A-Stufen, Abstand = gemessene Schrittlänge, Fehler ohne gait), 19/19, Graphen identisch; Test-gait markiert, Lab-Vendor erst mit echten Werten. DIRT|MOUNTAIN ergänzt (20 m), HIGHWAY|DIRT bleibt verboten (über Landstraße).

## 2026-10-11 · Haltebucht TUNE, Pfad 12 %
- V-138 Lieferung = TUNE (Gehweg-Ende gerade, Tropfen flach; Georg: die zwei Punkte reichen). V-158 Pfade ≤ 12 % ohne Stufen.

## 2026-10-11 · Tunnel PASS, Berg TUNE
- V-130 PASS (Portale + Innen 1:1). V-156 Berg/Hügel-Wirt schlecht modelliert → echte Inselkörper nach V-142/V-152. V-157 Trittstein-Abstand aus Medium-Rig-Locomotion messen.

## 2026-10-11 · walkOuter geliefert
- hex_b7.parts.json mit walkOuter (53 Punkte, ±0,0001 gegen GLB), GLB unverändert, parity PASS. RKIT wartet auf Georg (trail A/B).

## 2026-10-11 · V-138 geliefert, V-130 Bank A
- Haltebucht mit RKIT-Bürgersteig 1:1, Knet-Schüttung, Kachel-Kerbe gefüllt, Fußtest 6/6, parity PASS (Wiederholung unter Last). Bank A: 4 Looks im Feld, Profil arch/rect/round, Portal + Innen 1:1 an beiden Enden, 0/0/0, Freiraum ≥ 0,308. Beides an Georg. Offen: Gehweg-Ende gerade, Tropfen flach; race_tube im Hügel statt frei.

## 2026-10-11 · DIRT gebaut, Geh-Netz-Besitz
- Track Core 0.16.5 DIRT (D1–D3 Übergänge, Berm ≤ 35°, Schotter-Arme, Enden Wiese/Hof/Gatter), test-dirt 27/27, Bestand graph-identisch. V-155 Geh-Netz gehört dem Lab-Layout, Core TRAIL = Bauteile + Prüfungen. Offen an Georg: trail-Steigung ohne Stufen, Trittstein-Abstand.

## 2026-10-11 · Banden-Übergang B gebaut, DIRT R1a freigegeben
- Track Core 0.16.4: q.edge inner/outer nach J17-Schwellen, Anlauf ≥ 8 m, bitgleich (88/88). DIRT R1a: Welt-Maßstab (1,705), Ausnahme RACE|DIRT, Übergänge 20 m nur auf Geraden, Berm-Lippe über width/offset ≤ 35°, nur Schotter-Arme.

## 2026-10-11 · Updates an WSA und Blender
- WSA-Brief R2 um V-153/V-154 ergänzt; Blender-Branch Nachtrag R3c (Schnee = Insel, Stützmauern talseitig aus Mauer-Baukasten, Berginsel CR3 als zusätzliche Referenz).

## 2026-10-11 · Offene Katalog-Fragen beantwortet
- V-154 „alle Vorschläge ok“ (Antworten R2); offen nur Steinviadukt auf Inseln + Cosmic-Look. RKIT: #4 B (q.edge) und DIRT freigegeben.

## 2026-10-11 · Skin-Schnittstelle 0.16.3 komplett
- Schritt 5: Modul-Skins (EXIT/ENTRY/PIT/WEICHE), Kanten-Enden mit Kappenform nach tatsächlicher Kante, Familien-Übergänge mit Skin-Paar; 83/83, bitgleich. 0.16.3 als privater Vendor für C4b/C4c angeboten. RKIT pausiert bis Georgs Antworten.

## 2026-10-11 · Skin-Schritt 3 + Freigabe 5
- Markierungen als Daten (Pfeile nur EXIT/ENTRY/FORK/JOIN/Kreisel-Ausfahrt, Ringspuren nur ausdrücklich, Scheitel-Kerb race R ≤ 45 ≥ 8 m); 73/73, bitgleich. Schritt 5 (Modul-Skins, Kanten-Enden, Übergänge als Daten) freigegeben.

## 2026-10-11 · Autobreiten
- RKIT-Messung: breitestes registriertes Auto KayKit-Hatchback 3,26 (durch Einzel-Strecken auf 6,28). V-153 gemeinsamer KayKit-Faktor → 2,80; Grenze bleibt 1,705. Cicada-FBX BODY 90° gedreht → Lab prüft.

## 2026-10-11 · CR im Katalog, V-143 präzisiert
- CR1–CR4 im RKIT-Katalog (trail reserviert, Geh-Netz fehlt im Core, Aufwand L); 12 neue CR-Fragen. V-143 präzisiert: Welt-Knoten-Abstand nach breitestem registrierten Spiel-Auto (V-126) + 0,15, Renn-Hülle bleibt für RACE; RKIT misst.

## 2026-10-11 · Skin-Schritt 4, Banden-Übergang-Vorschlag
- Kappen je Skin (race J17-Kopf, town Bordkopf, country verge_end), town-Splitter erhaben 0,35; 58/58, Ströme bitgleich. Schritt 3 Markierungen freigegeben.
- #4: J17 hat den Übergang schon (track-look v5:191–216, krümmungsabhängig, ±8 m geglättet); bei R 25 innen nur 5 m Anlauf. Varianten A (J17 so) / B (q.edge-Daten mit ≥ 8 m Anlauf) / C (Geometrie, nicht empfohlen) an Georg.

## 2026-10-11 · Alle Autos auf allen Skins; Berg/Land/Pfad-Blätter
- V-152 Fahrzeug und Skin unabhängig; CR1–CR4 (Berg-Schotter, Fußwege/Wanderpfade als Skin trail, Berginsel, Landstraße-Kit) abgelegt replies/REFS_COUNTRY_TUNNEL_2026-10-11/. Inselbasis-Hinweis an Blender (keine einzelnen Felskugeln).

## 2026-10-11 · Skin-Schritt 2, DIRT-Vorlage
- node.skin race/town/country/dirt/cosmic (dirt/cosmic reserviert mit Fehler), test-skin 48/48, Geometrie unverändert. Schritt 4 (Kappen je Skin) freigegeben. DIRT-Vorlage (Familie DIRT 10,8, Berm atan(v²/gR) gedeckelt) wartet auf Georg (A Fahrzeug, B 35°, C Knoten); 12 CS-Fragen + HIGHWAY an Georg.

## 2026-10-11 · WSA Look-Spec R1 abgenommen, R2 beauftragt
- R1: 9 Rundkurs-Module mit J17-Quellen (13/13 bytegleich J16-r2, 115 Zeilenverweise, Maße ×1,46), ehrliche Lücken (kein J17-Kreisel-/EXIT-Gore-Verbraucher). R2: town → Übergänge → country → dirt → cosmic (nur Quellen), nach V-150/V-151.
- Spiegel-Skript: WSA-Dateien in replies/ werden nie aus lokalen Kopien überschrieben (Schutz nach Fehlgriff).

## 2026-10-11 · 21 Fragen beantwortet
- V-150 Vorschläge angenommen; Berm/Wandfahrt + Sandkurven befahrbar; offen #4 Banden-Übergang, Cosmic-Look. V-151 Cartoon-Stunt-Race mit chill & fun Assist als Standard, später normal/hard.

## 2026-10-11 · Skin-Schritt 1 + Katalog-Abgleich
- Track Core 0.16.3-s1: Kreisel-Arme erben Familie (Welt-Kreisel ändern sich gewollt, Race bitgleich), test-skin 32/32. Katalog TD1–TD5: Renn-Kern vollständig; Straße fehlen Bordabsenkung, Straße→Platz, erhabene Mittelinsel; DIRT größter Block (L). 21 Fragen „uneindeutig“ an Georg. Schritt 2 freigegeben mit Skins race/town/country/dirt/cosmic (dirt/cosmic Platzhalter).

## 2026-10-11 · Stadt-, Land- und Cosmic-Blätter
- V-149 CS1 Inselstraßen (Bord/Gehweg), CS2 Landstraße/Schotter, CS3 Cosmic Highway; Skins race/town/country/dirt/cosmic. Abgelegt replies/REFS_CITY_STREETS_2026-10-11/.

## 2026-10-11 · Bilder prüfen, bei Unklarheit fragen
- V-148 Logik generierter Referenzbilder im Detail prüfen und im KFB-Stil umsetzen; uneindeutig → nachfragen, nicht erfinden. In START_HERE und Lab-CLAUDE.md.

## 2026-10-11 · Race-track-details-Katalog
- V-147 fünf Georg-Blätter (Renn-Kern, Straße, Schotter, Übergänge, Fortgeschritten) als Modul-/Skin-Katalog; Skins race/town/dirt, Cosmic Highway folgt. Abgelegt replies/REFS_TRACK_DETAILS_2026-10-11/.

## 2026-10-11 · Skin-Schnittstelle freigegeben
- RKIT: RACE-Kreisel existiert schon (durchgehende Banden); Lücke ist der TOWN-Kreisel. 8 Rundkurs-Module abgeglichen (vorhanden/teilweise). Freigegeben: Track Core 0.16.3 mit Knoten = logic + skin (race|town), Arme erben Einfahrts-Familie, Endkappen/Splitter je Skin, Markierungen als Daten; skins[] mit benannten Schichten nach V-146.

## 2026-10-11 · Skin-Schichtung = Bestand
- V-146 Schichtung (Slots, Skins, Markierung, Edge-Atlas, Rubble) existiert: Track Core SLOTS/SKINS, S4-v2-Brief, REFERENCE_ANALYSIS 27.09. (Reddit-Trailer), SPEC_EDGE_RUBBLE_GRAMMAR_R1, J17 v5. Basis für die Skin-Schnittstelle; keine neue Recherche.

## 2026-10-11 · Wendeschleife fertig
- Track Core 0.16.2: einarmiger Kreisel (Wendeweg-Radius 11–12,3), turntable-Anker, Prüfgrenze Welt 1,705 für Kreisel und Kreuzung (V-143), 17/17, Gleichstand bitgleich. Befund: Kreisel-Arme erben die Familie nicht → Skin-Schnittstelle (V-145).

## 2026-10-11 · Skins für Strecken-Module
- V-145 Kreisel/Wendeschleife und Anschluss-Module in zwei Skins (Renn-Look RACE + Stadtstraße TOWN), eine Logik; später Eisenbahn/Rollercoaster.

## 2026-10-11 · WSA-Handoff V-141, neuer WSA-Auftrag
- WSA hat das Datenpaket für den Lab-Import übergeben (15 Tests PASS, kein Lab-src). Importer = Lab Phase E/F.
- Neuer WSA-Auftrag (Recherche): J17-Look-Spezifikation je Strecken-Modul aus V-144 (replies/BRIEF_WSA_TRACK_MODULE_LOOK_SPEC_R1.md).

## 2026-10-11 · Rundkurs-Baukasten-Referenz
- V-144 Vulkaninsel + Rundkurs-Baukasten als Logik-/Modul-Referenz (Look bleibt J17); Inselbasis bestätigt V-142. Abgelegt replies/REFS_RUNDKURS_2026-10-11/.

## 2026-10-11 · Kreisel-Prüfgrenze
- V-143 Kreisel-Wegabstand wie Kreuzung (Familien-Fahrzeugbreite) + 0,15 Marge (V-032); RACE unverändert. Einarm-Wendeschleife Ausrundung ≥ 20, turntable-Anker.

## 2026-10-11 · LEVEL_RAMP fertig
- Track Core 0.16.2: LEVEL_RAMP 16/16 (RACE/TOWN, max 4,8 %, Halteplatte eben, Anker exakt), Teil-0-Gleichstand bitgleich, alle Suiten unverändert.

## 2026-10-11 · LEVEL_RAMP + Wendeschleife freigegeben
- RKIT baut in Track Core 0.16.2: Makro LEVEL_RAMP (≤ 8 %, ebene Halteplatte, Endrahmen auf Anker) und einarmige Kreisel-Größenregel + Szenerie-Anker turntable (V-110, V-134). Such-Protokoll: keine fertige Form in den Quellen. Nach jedem Schritt Teil-0-Gleichstand; Vendor-Wechsel im Lab abgestimmt.

## 2026-10-11 · Gehweg Haltebucht geliefert (RKIT)
- V-138 (b): hex_b7.parts.glb (177 Teile), Q1–Q9 PASS; Gehweg volle Breite mit Querreihen („kürzen statt biegen“). Einbinden durch Bau-Sitzung. RKIT als Nächstes: Vorlagen-Zeilen Ebenen-Rampe + Wendeschleife.

## 2026-10-11 · Sperrliste Lab-src
- Keine Überschneidung Bau-Sitzung ↔ WSA (tsc sauber, parity PASS nach Wiederholung; Check 4 Jitter unter Last knapp). Sperrliste für WSA in START_HERE und WSA-Antwort. B7-Strom an RKIT übergeben.

## 2026-10-11 · Inselboden-Referenzen an Blender
- V-142 drei Georg-Referenzen (Knet-Erdkörper, eingebettete Felsbrocken, überquellendes Moos, dünne Wurzeln) als Basis-Vorbild; Brief R3 an Blender (replies/BRIEF_BLENDER_INSELBODEN_R3.md + REFS_INSELBODEN_2026-10-11/).

## 2026-10-11 · EXIT/ENTRY auf RACE PASS
- RKIT 19/19 (Track Core unverändert): RACE-Aus-/Einfahrt, Gleichstand Hauptstrecke 0, Gore/Nase, Rampe mit CONNECT auf Ebene; B6-Zone ohne Geometrie-Änderung. Für C4c im Lab: Banden-Enden an Bruchfugen, Gore/Nase im J17-Look, Randlinien im Übergang; Astbreite 4,0 m bis Fahrtest anders zeigt.

## 2026-10-11 · Klick PASS
- V-137 auf PASS (Georg: „klick ist weg, passt“).

## 2026-10-11 · Gehweg-Weg (b), Hörprobe
- V-138 Weg (b): Lab exportiert B7-Strom, RKIT baut Bord/Gehweg/Kantensteine nach Lauf 03 (Q1–Q9), Lab macht Bordtasche, Knet-Übergang, Kacheln, Fußtest. Hörprobe nach Klick-Fix an Georg.

## 2026-10-11 · RKIT Such-Protokoll, Race-Exit-Tests
- RKIT korrigiert B6: vorhanden (J14 ZA / J17-Atlas, RACE-Strom läuft weiter, Bord/Bande als Look-Schicht). Wendeschleife, Ebenen-Rampe, Einschnitt, Spindel-Ausfahrten bleiben teilweise (Bausteine gelistet). Freigegeben: nur Tests für EXIT/ENTRY auf RACE + B6-Zone.

## 2026-10-11 · WSA-Schema bestätigt
- V-141 kfb.scene-study/2 bestätigt (Antwort replies/STEERING_REPLY_WSA_SCHEMA_R1.md, war liegen geblieben). WSA hat Lab-src (editor.ts, spec.ts, scene-study.ts) mit Georgs OK erweitert → künftige Lab-src-Patches nur nach Vorlagen-Zeile an die Steuerung. SCALE_CONTRACT_K2 Status auf verbindlich (V-060) nachgezogen.

## 2026-10-11 · Klick behoben (V-137)
- Ursache gemessen: Loop-Naht der Motor-MP3 (alle 1,588 s unter Gas) + Bandenkontakt-Flackern + Pegel-Sprünge je Frame. Behoben: 60-ms-Equal-Power-Loop, Rampen τ 30 ms, Hysterese 80/150 ms. Nachher 0 Klicks (Gas/Leerlauf). Hör-Mitschnitt für Georg angefordert.

## 2026-10-11 · Track Core Teil 0 PASS
- v0.12 ↔ 0.16.1 bitgleich (O1-Ring, J17 p1b.v2, td03); neu nur 5 Spur-Felder ohne RACE-Wirkung. 0.16.1 als privater Vendor im Lab (vendor/private, gitignored). Gemeinsames MODULES.md-Schema (Geometrie RKIT, Look Lab).
- Befund für Georg: track-core.v012.mjs liegt schon öffentlich auf main (J14-Cut, Organ-Attraktion C2) und im WSA-Branch (PROTOPIA_MAKER_TRACK_R1/independent). Entscheidung offen, ob das so bleiben darf.

## 2026-10-11 · Use what works
- V-140 „Fehlt“-Meldungen nur mit Such-Protokoll; Steuerung prüft vor Weitergabe. In Lab-CLAUDE.md und START_HERE ergänzt.

## 2026-10-11 · Track → Straße existiert
- V-139 Georg: Übergang Rennstrecke ↔ Straße ist in Joyride vorhanden (J14 T4 ZA, J17 transition-atlas + ROAD_APPLY, V-104 B) → 1:1, kein Entwurf. Meine Rückfrage war falsch.

## 2026-10-11 · Haltebucht-Gehfläche
- V-138 Georg: orange Plattform = zu breite Bande; stattdessen Bürgersteig mit gemauerter Bordsteinkante (RKIT Lauf 03 / B7 TOWN_BAY), weicher Übergang auf die Insel.

## 2026-10-11 · RKIT-Lückenliste (V-134)
- Alle Strecken stammen aus Track Core v0.12; 0.16.1 ist Nachfolger. Vorhanden: Grundstrecke, Brücke im Raum, EXIT/ENTRY (HIGHWAY), Straße über Platz, Kreisel. Teilweise: Ebenen-Rampe, Wendeschleife (einarmiger ROUNDABOUT, TOWN-Abstand rot), Spindel (td03 ohne Ausfahrten), Tunnel mit Rampe. Fehlt: B6 race ↔ world (Georgs Entwurf), Paternoster.
- Freigabe: RKIT macht Teil 0 (Gleichstand ≤ 1 mm + Katalog-Felder), dann EXIT/ENTRY auf RACE; MVP-Sitzung baut C4b darauf, nicht doppelt.

## 2026-10-11 · Sound TUNE, geschlossene Insel
- V-137 Sound okay, Schmatz-/Klick-Geräusch stört (TUNE). V-136 Inseln = ein geschlossenes Mesh. Leerer Blender-Ordner „3D ASSETS/BLENDER MCP“ lokal nicht vorhanden (nichts zu löschen).

## 2026-10-11 · Georg zurück: Himmel, Sprünge, Strecken-Module, Blender
- V-132 Weltraum-Himmel (KFB-Wolken, ferne Inseln, surreale Planeten, Knet-Asteroiden; später Käse-Mond, TinySkies-Sonnen). V-133 Sprung-Lücken bleiben. V-134 fehlende Strecken-Teile modular, nahtlos, konsistent (Track Core RKIT + Look Lab). V-135 Bildblätter verfälschen Inselbasis (Blender-Klötze). Mitschnitt hört Georg später.

## 2026-10-11 · C4a fertig, V-130-Vorlage freigegeben
- C4a: B7-Haltebucht (Track Core 0.16.1, J17-Querschnitt), Gehflächen-Suche repariert, Fußtest 6/6 Kachelpunkte; alter Fußtest hatte verdrehtes Lenkvorzeichen (R2-Befund „Hex unerreichbar“ gestrichen). Böschungsrand noch gerade → organisch vor C4c. Plattform-Farbe offen bei Georg.
- V-130-Vorlage: Profil {look, profile} mit Ring aus Core v0.12, Portal + Innen 1:1 aus tunnelParts an beiden Enden, Knet-Fuß per Feld-smin; Prüfbank ?bench=tc1 (A) + StreakByte-Insel mit Berg (B), bei Naht-Fehlern Stopp und Scholle als Plan B.

## 2026-10-11 · Drohnen = RollerCoaster-Drones; Blender K1 R2
- V-131 „Drohnen“ = Klang-Drones aus RollerCoaster v11 (später 1:1 nachziehen); Soundbed passt erstmal.
- Blender K1 R2 (Ziel M1, Wurzeln gestrichen): blinder Kritiker 5 / 5,5 / 4, nach 2 Runden gestoppt; Blender in der Cloud gebaut, weil Blender MCP auf dem Mac mini hängt. Offen bei Georg: Blatt, Block-Bauweise vs. „ein geschlossenes Mesh“.

## 2026-10-11 · Tunnel-Prototyp TUNE
- V-130 Georg: Joyride-Tunnel-Ein-/Ausgänge (4 Varianten inkl. Rechteck) fehlen. Referenz tc1-looks.v3.jpg; Rechteckprofil existiert (Core v0.12 tunnelLooks). Neue Probe am Hirn mit allen 4 Portal-Bausätzen an beiden Enden, dann Stopp. Georg: Rechteck-Tunnel als Profil baubar (Profil getrennt vom Look). Prüfwirt statt Hirn: TC1-Knethügel 1:1 + ein MVP-Inselkörper per Adapter.

## 2026-10-11 · VFX/SFX eingebaut, C4 freigegeben
- V-128/V-129 eingebaut: J17-Motor, Jingles, Kontakt-Engine, Kenney-CC0, Tunnel-Hall, J17-Knet-Partikel, Radio wechselt beim Einsteigen auf Suno RoadTrip; Kosten im Rauschen. Mitschnitt an Georg. Nebel-Farbe jetzt CPU-seitig aus dem Kuppelbild (GPU-Zurücklesen ließ Frames hängen; Korrektur der Bau-Sitzung).
- C4 freigegeben: C4a B7-Haltebucht am Hex-Hub + Fußzugang → C4b Ring über Track Core 0.16.1 (≤ 1 mm sonst Stopp) → C4c erste Ausfahrt EXIT/Rampe/ENTRY im J17-Look. Wendeschleife offen bei Georg; Parkdeck-Tunnel Phase E/F.

## 2026-10-11 · M2-Zone und Nebel-Kosten
- M2 Streckenzone bio −1 (J17-treu: weiße Randlinie 0,6 m, keine Mittellinie/Zebras) als Standard; Boost-Pfeile 1:1 v5, Dichte unter J17 (Kritiker-Eindruck kam von der Standbild-Kamera). Nebel-Horizontprobe asynchron (0,2 ms Median). Checkpoints = Beginn Insel-Stück, Ziel = Start/Ziel-Naht.

## 2026-10-11 · Prototyp Tunnel im Feld
- Hirn + race_tube (?tunnelField=hirn): Ring weich aus dem O1-Feld geschnitten, ein levelSet, TC1-Bänder/Lampen auf der Feldwand, Tonsockel unter dem Deck. Körper offen 0 / Mehrfachkanten 0 (Hero + Light), Durchsicht 0, Q5-Ketten kürzer (max 21 m statt 51 m). Bauzeit 53,7 s (Farbzuordnung unoptimiert). Wartet auf Georgs Urteil vor dem Ausrollen.

## 2026-10-11 · Fahrtest R2 abgenommen
- Echter k2b-Fahrtest (nur Tasten, 8 Läufe, 2 Autos, assist 0/0,8, Boost, Randlauf, je Runde + 200 m über Start/Ziel): 0 unter Deck/hängen/Bande/rescue, Landungen 3/3, Kamera 0 Clips. Fahrzeugabhängig nur über Breite (k2b hat mehr nicht). Befund: Hex-Fläche zu Fuß unerreichbar → C4. Nebel wirkt jetzt (fogFar 0,95 × far, Farbe aus Kuppel-Horizont).

## 2026-10-11 · Konzept C1b-C3 R1 (Steuerung)
- REPORT r2 korrigiert (Körper verschweißt 0 offene Kanten, aber 2/18/11 Mehrfachkanten; „Schlitz“ = O1-Wasserfläche; Fahrtest k2b-Tasten mit assist, nicht fahrzeugabhängig; Dock-Test unecht).
- Freigegeben: echter Fahrtest zuerst; Tunnel-im-Feld als Prototyp an einem Körper + race_tube (generisch, Mesh→Feld-Adapter benennen), dann Stopp für Georg; rect-Ring aus Core v0.12; J17-Tagwerte als Strecken-Tag-Preset; Markierungen nach J17-Messung; Nebel. An Georg: Innen-Mauerwerk/Minen-Licht, Himmel „cosmic“, Sprunglücken, Lampenschild.

## 2026-10-11 · Kritiker C1b-C3-r2: FAIL, zurück zum Konzept
- Blinde Kritiker (V-125): 3D + Baukasten 5,14 (T4 3 → laut Protokoll Konzept statt Reparatur), Design 4,5 (D3 3); harte Schnitte gesehen. Hauptbefunde: Portale stehen vor dem Körper (Plattenrand, Geisterbogen, Messerkanten-Platte), Loch entlang der Tunnellinie im Hirn, Strecke speert in die Hub-Seite, stone_rect = stone_arch innen, Mine ohne Holzrahmen, Teal-Stich, unbeleuchtete Tunnel.
- Bericht-Ehrlichkeit: REPORT „0/0/0, 1 Bauteil“ galt nur für die Join-Box; Körper haben 382–710 offene Kanten. Fahrtest war ein Schienen-Folger (beide Autos bitgleich), kein k2b-Beweis. Bau-Sitzung korrigiert REPORT und liefert ein Konzeptblatt; Georg entscheidet.

## 2026-10-11 · C1b+C3 Lieferung R1 geprüft
- Fahrtest grün (Runde 10,58 km, 0× unter Fahrbahn/hängen/Bande, Nähte 0 m), V-112-Prüfungen 0/0/0 für 4 Styles × 4 Körper, Parity PASS.
- Steuerung: Platzhalter-Organe mit einfachem Material (V-127/V-115: 35/59/56 fps), Parity Check 1 Sim-Zeit. Vor Kritiker: ringförmiger Spalt Röhre ↔ Bohrung schließen, Tunnel-Licht wie J17 (jetzt teal/braun), Q5-Kehlen. Pfeiler entfallen (Strecke schwebt).

## 2026-10-11 · VFX/SFX-Vorlagen freigegeben
- Zu V-128/V-129: 1:1 Motor (cologne-audio.v1 createEngineBed), Jingles (J17), Kontakt-Engine + Kenney-CC0 (Stunt Car Race), Knet-Partikel clay-vfx.v1, j10-Effekte + Tempo-FOV nur im FAHREN; Suno-Radio über song-transport. Neu: Tunnel-Hall (Convolver, nur Motor/SFX). Nein: Fahrtwind. Drohnen: kein Code/Asset vorhanden → Georg fragen.

## 2026-10-11 · Suno fürs Fahren
- V-129 Suno RoadTrip JukeBox v2 beim Fahren (lokal privat kopiert), Cozy Tunes für Inseln; Racer-SFX und Drohnen dazu.

## 2026-10-11 · Cosmic Roadtrip
- V-128 Joyride-VFX/SFX + Soundbed bzw. Radio in der Strecken-Welt, damit Georg das „chill & fun cosmic roadtrip“-Gefühl testen kann.

## 2026-10-11 · Organe out of scope
- V-127 Organ-Inseln für MVP out of scope (später medizinisch-cartoonig nachmodellieren); jetzt nur Platzhalter-Körper, keine Formarbeit mehr; Fokus Strecke + Module.

## 2026-10-11 · levelSet Nachbesserungen
- Zu V-116: Truncus-Rest per Feld-Maske (Herz max 0,59 Zellen), helle Flecken behoben (Farbe von SN-Ecken, refine 1,5 Zellen; Dreiecke wieder ≈ SN). Light-Stufe = vereinfachter Hero-levelSet (Aorta-Löcher im O1-Light-Feld), Rückweg ?lsLight=own. Bauzeit 15,1 s.

## 2026-10-11 · Fahrzeuge
- V-126 nur registrierte Retro- und KayKit-Autos (geschlossen), kein Cabrio, auch nicht das J17-Cabrio im Lab.

## 2026-10-11 · Strecke + Module mit zwei Kritikern
- V-125 Georg: Rennstrecke und alle Module sauber bauen und mit korrekter Physik befahrbar (automatische Fahrtest-Runde), je Lieferung Kritiker 3D/Baukasten-Logik + Design-Kritiker; max. 2 Reparaturrunden.

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
