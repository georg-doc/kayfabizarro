#!/usr/bin/env python3
"""Baut decisions.json + DECISIONS.md. Handgepflegte Einträge stehen in ENTRIES (nur ergänzen, nie umschreiben;
Ersetzen über 'supersedes'). Teil B importiert automatisch Georgs PASS/TUNE/FAIL aus ACCEPTANCE_INDEX (Skript im Lab)."""
import json, os, re, subprocess, datetime
H = os.path.dirname(os.path.abspath(__file__))
LAB = os.path.expanduser('~/Dropbox/CLAUDE/KFB Island Worldbuilder Lab')
E = []
def d(id, date, area, verdict, text, owner='Lab', check='ungeprüft', source='Chat Steuer-Sitzung', values=None, supersedes=None):
    E.append(dict(id=id, date=date, area=area, verdict=verdict, text=text, values=values or {}, owner=owner, check=check, source=source, supersedes=supersedes))
# --- Prozess ---
d('V-001','2026-10-10','Prozess','RULE','USE WHAT WORKS: Vorlage zuerst; Nachbau ohne Freigabe = nicht bestanden.', 'alle', 'Vorlage-zuerst-Zeile je Teil', 'docs/MVP1_DONOR_AND_MODEL_MAP_R1.md §0')
d('V-002','2026-10-10','Prozess','RULE','Georg gestaltet, wir bauen Werkzeuge (God-Mode-Editor); keine Kritiker-Endlosschleifen, Abnahme durch Georg im Spiel.', 'Steuerung', 'Plan R1 §0', 'docs/KFB_WORLDBUILDER_PLAN_R1.md')
d('V-003','2026-10-11','Prozess','RULE','Entscheidungen leben hier (30_DECISIONS) mit PASS/TUNE/FAIL; sofort eintragen und mit Nummer bestätigen; Prüfung vor jeder Lieferung.', 'Steuerung', 'tools/parity + Bericht listet ungeprüfte V-Nummern')
d('V-004','2026-10-10','Prozess','RULE','Agenten-Briefings verweisen zuerst auf PASS/TUNE/FAIL bzw. ACCEPTANCE_INDEX; „nicht gefunden in …“ statt „gibt es nicht“.', 'Steuerung')
d('V-005','2026-10-10','Prozess','RULE','Höchstens zwei Baustellen gleichzeitig; Plan R1 ist maßgeblich.', 'Steuerung', 'Plan R1')
d('V-006','2026-10-10','Prozess','RULE','Disk-Regel: ≥ 40 GB frei vor schweren Läufen, Blender nur headless mit Watchdog.', 'alle')
d('V-007','2026-10-10','Prozess','RULE','Georg nie um Git-Bedienung bitten; Dateien als Links bzw. Karten liefern.', 'Steuerung')
d('V-008','2026-10-10','Prozess','RULE','Token sparen: Standbilder statt Video, wo es reicht; keine breiten Suchen.', 'alle')
d('V-009','2026-10-11','Prozess','RULE','Doku-Pflicht für die Steuerung: alle Entscheidungen, Designs und Vorgaben sofort ins Living Doc (diese Datei + Plan R1) plus additiver CHANGELOG.md (neueste oben, nie umschreiben), mit Nummer bestätigen.', 'Steuerung', 'jede Antwort mit neuer Vorgabe nennt die V-Nummer')
# --- Look ---
d('V-010','2026-10-10','Look','PASS','Joyride J17 ist Goldstandard für den Gesamt-Look: Strecke, rote Banden, orange Fahrbahn, Cartoon-Deformer, Kamera, Paletten. „absoluter Goldstandard … gesetzt“.', 'Lab', 'Bildvergleich gegen J17 pictures/chase-*.jpg', 'docs/POSTMORTEM_JOYRIDE_REGRESS_R1.md')
d('V-011','2026-10-10','Look','RULE','Keine harten Schnitte bzw. sichtbaren Kanten an Übergängen; organische Knet-Cartoon-Logik.', 'alle', 'Q8/Fugen-Test')
d('V-012','2026-10-10','Look','RULE','Diorama-Materialmix erlaubt (Knete, Balsa, Pappe, Kork, Filz, Moos); nie konstruiert oder repetitiv.', 'alle', 'Bild')
d('V-013','2026-10-10','Look','RULE','Generierte Bildblätter sind Stil-Richtung („Serviervorschlag“), nicht Pflicht-Abbild; bauarm, stilisierter Claymation.', 'alle', 'Bild')
d('V-014','2026-10-10','Look','FAIL','RKIT-Test-Hub in Vorschauen (quergestellte Teilbanden, flacher Asphalt, Gehwegplatten, Nicht-Joyride-Muster).', 'Lab', 'Vorschau-Bühne = Demo-Insel; ?rkit=1 nur Debug')
d('V-015','2026-10-10','Look','RULE','Weltlogik zuerst: jedes Element braucht eine Geschichte (wer, was, warum); Inseln = Schollen der zersprengten Erde.', 'alle')
# --- Steuerung / Kamera ---
d('V-020','2026-10-10','Steuerung','PASS','W = Joggen (Running_A ≈ 1,40 H/s), Shift+W = Sprint (Running_B ×1,3 ≈ 2,22 H/s), Strg+W = Gehen. „passt so erstmal“.', 'Lab', 'parity: gait', 'docs/critic/lab-stage2/2026-10-10_08/REPORT.md', {'jog_H_s':1.40,'sprint_H_s':2.22,'walk_H_s':0.29})
d('V-021','2026-10-11','Steuerung','RULE','Nur EIN Gangschema (J17-Travel-Core) für alle Spiel-Einstiege; walk.ts stillgelegt.', 'Lab', 'parity: beide Einstiege')
d('V-022','2026-10-11','Steuerung','RULE','WoW-Schema: ohne Maus A/D drehen, Q/E strafen; RMB = Maus lenkt Figur, A/D strafen; LMB = nur Kamera; beide = vorwärts.', 'Lab', 'parity: mouse-steer')
d('V-023','2026-10-11','Steuerung','RULE','Sprung: Leertaste im Stand = auf der Stelle; aus Joggen = vorwärts; Shift+Leertaste aus Sprint = Weitsprung (Jump_Full_Long).', 'Lab', 'parity: jumps')
d('V-024','2026-10-11','Steuerung','TBD','Doppel-Leertaste = Flug-Modus bzw. Jetpack (WoW-Logik, schon gemessen) – später.', 'Lab')
d('V-025','2026-10-11','Kamera','RULE','Spielmodus: Zoom Rad/Touchpad (normalisiert, gedämpft) bis Ich-Perspektive; träges Recenter hinter die Figur bei Bewegung; Default-Position per Slider (Vorlage: RollerCoaster v11, Slider „Pet-Position“, Georg 11.10.).', 'Lab', 'parity: camera')
d('V-026','2026-10-11','Kamera','RULE','God-Mode: Zoom zum Cursor, nicht zu empfindlich; Orbit ohne Ruckeln (geglätteter Arm).', 'Lab', 'parity: camera-calm ≤ 0,05 lab/Frame')
d('V-027','2026-10-10','Kamera','RULE','Verdeckung: Auto 35 % Dither; Sicht-Loch mit Knetrand Option für Gebäude.', 'Lab')
# --- Fahren / Auto ---
d('V-030','2026-10-10','Auto','PASS','MVP-1 fährt geschlossenes Retro-Auto (Cicada), Figur beim Fahren unsichtbar; Cabrio nach dem MVP.', 'Lab', 'parity: default car', 'Masterplan §3')
d('V-031','2026-10-10','Auto','TUNE','Ein- und Aussteigen (Hop) als Arbeitsstand: „etwa 30 % … so nehmen, bevor wir uns verkünsteln“; Rückfall Überblenden.', 'Lab')
d('V-032','2026-10-10','Fahren','RULE','Fahrphysik = J17 k2b bytegleich; Auto vor dem Bordstein halten (Band = Bord − ½ Breite − 0,15).', 'Lab', 'md5 k2b')
d('V-033','2026-10-10','Animation','TBD','Cartoon-Prinzipien Anticipation, Impact, Recovery (Nachfedern nach dem Hop); Hut-Artefakte ggf. metanarrativ.', 'Lab')
# --- HUD / Klang / Almanach ---
d('V-040','2026-10-10','HUD','PASS','HUD = Claude-Design-HUD R3 komplett inkl. Rucksack-Overlay und Jukebox-Daten; KEIN Joyride-HUD. Ohne Rucksack nicht abnahmefähig. Spiel↔God-Mode-Plakette.', 'Lab', 'Bild + md5 vendor', 'docs/critic/lab-hud/2026-10-10_01/')
d('V-041','2026-10-10','HUD','RULE','Keine Messdaten bzw. Debug-Werte im Spiel (nur ?debug=1).', 'Lab', 'parity: no-debug')
d('V-042','2026-10-10','Klang','RULE','Ein AudioContext, Insel-Bett je Insel, Radio im HUD; Radio auch zu Fuß, wenn das Kassettenradio im Rucksack ist.', 'Lab', 'Bericht', 'docs/critic/lab-sound/2026-10-10_01/')
d('V-043','2026-10-11','Almanach','RULE','Fächer rechts, senkrecht gerade nach unten, letzte 7 + „+N“; Klick → Overlay mit Deck/Welt-Reitern und Raster der Viertel → Viewer.', 'Lab', 'Bild')
# --- Licht / Himmel / Farben / Wasser ---
d('V-050','2026-10-10','Licht','TUNE','Licht-Profile Tag/Abend/Nacht/Innen aus SKY3; Abend zu orange und zu dunkel.', 'Lab', 'Bild', 'docs/critic/lab-sky/2026-10-10_01/')
d('V-051','2026-10-10','Farben','RULE','Insel-Thema = Sechser-Palette aus Joyride (canyon, bucht, otown + Ableitungen) + Licht + Klang + Biom + Story-Tint; ein Generierungsschritt (God-Mode, Generator, Spieler).', 'Lab', 'Schema kfb.island-theme/1')
d('V-052','2026-10-10','Wasser','PASS','Claude-Design-Wasser F0–F2 inkl. Ufergelände und aller Fixes (keine Haarlinien, Faltung, Säume, Kantenartefakte). „auf keinen Fall verlieren“.', 'Lab', 'Bild', 'donors/kfb-island-kit-r2-2026-10-08/STATUS.md')
d('V-053','2026-10-10','Knete','RULE','Figuren: dezentes Resident-Atlas-Profil (fine); Umgebung: Kanon 07.10. mit Nahband.', 'Lab', 'parity: clay-profile', 'docs/BASELINE_ACCEPTED_R1.md §4')
# --- Figuren ---
d('V-060','2026-10-10','Figuren','RULE','Figuren werden nie skaliert; Maßstab K2 (H = 3,64).', 'alle', 'parity: scale')
d('V-061','2026-10-10','Figuren','RULE','Figuren-Auswahl: alle KayKit Medium/Large/Legacy, FB v4/v3/v5, alle Textur- und Farbvarianten, KFB-Eye-Rig in Georgs gespeicherter Konfiguration.', 'Lab', 'Kontaktbogen + Tabelle')
d('V-062','2026-10-10','Figuren','RULE','Studio-Übernahme 1:1: kein Regler, keine Einstellung geht verloren (inkl. Viseme aus Frankenstein- bzw. Patch-Studio).', 'Lab', 'Regler-Inventur')
# --- Assets / Lizenzen ---
d('V-070','2026-10-10','Assets','RULE','Quellen-Reihenfolge: KayKit > Tiny Treats > Quaternius (Natur) > Kenney.', 'alle')
d('V-071','2026-10-10','Lizenz','RULE','Gekaufte Assets (StreakByte, Unity, Cozy Tunes) und private Audio-Dateien nie in ein öffentliches Repo.', 'alle', 'Push-Prüfung', 'docs/KFB_PROJEKTKONTEXT.md')
d('V-072','2026-10-10','Assets','RULE','Freie Asset-Branches (CC0/eigene Inhalte) darf die Steuerung bei grünen Checks selbst nach main mergen.', 'Steuerung')
d('V-073','2026-10-11','Lizenz','RULE','Cozy Tunes: zuerst ins private Repo bzw. private Auslieferung, im Spiel 100 % verfügbar (auch auf der GPT-Site als späterer Ziel-Plattform); erst danach aus dem öffentlichen Repo löschen.', 'Steuerung', 'Spiel lädt lokal (public/private-audio); Löschung erst nach Nachweis')
# --- Inseln / Editor ---
d('V-080','2026-10-10','Inseln','RULE','Die 8 StreakByte-Demo-Inseln bleiben, wie sie sind; keine davon ist KFB Town (baut Georg selbst).', 'Lab')
d('V-081','2026-10-10','Editor','RULE','God-Mode-Editor: Terrain-Pinsel, Asset-Overlay (Librarian), Resident-Atlas-Inline-Editor mit Snap/Ground, Muster-Pinsel, Terrain-Painter mit Dots-Übergang, Insel-Thema.', 'Lab', 'Plan F')
d('V-082','2026-10-10','Editor','TBD','Fluff-Zonen (Baum füllen, Mine/Terrain graben, Beete, Angeln) – später.', 'Lab')
d('V-083','2026-10-11','Interaktion','TBD','Tab-Ziel, Angriff per Maustaste, Fluff abschießen/abklopfen mit Zerstörung und Nachwachsen, Action-Bar 1–6 – später.', 'Lab')
d('V-085','2026-10-11','Comic-UI','TBD','Sprechblasen, Denkblasen und Comic-Wörter (Lautmalerei) im Spiel – auf die Checkliste.', 'Lab', 'Plan', 'Georg Checkliste 11.10.')
d('V-086','2026-10-11','Figuren','TBD','KFB-Münder (neu gerundet) als optionaler Ersatz für die KayKit-Original-Münder; zusammen mit Stimme und allem anderen in der Figuren-JSON (Figuren-Karte). Backlog bzw. Toolbox in-world.', 'Lab', 'Plan H', 'Georg 11.10.')
d('V-087','2026-10-11','Lizenz','RULE','Kein neues Repo. Cozy Tunes bleiben vorerst lokal im Lab (public/private-audio, gitignored); Spiel läuft damit. Private Ablage später in einer bestehenden privaten Kiste (z. B. KFB-Stunt-Car-Race), erst dann öffentliche Kopie löschen. Kein Token-Aufwand jetzt.', 'Steuerung', 'Spiel lädt lokal', 'Georg 11.10.', supersedes='V-073 Weg (a)')
d('V-088','2026-10-11','Kamera','PASS','Kamera-Werte B0 (Messung, parity grün): Orbit-Feder ω 7,5; Arm rein 8/s, raus 3/s, ≤ 7,5 lab/s; Recenter 1,6/s nur in Bewegung; Zoom 0,12 (POV) bzw. 0,55–2,8, POV-Auge 0,92 H, Zoomschritt exp(Δ·0,0012) mit Δ ±120; Kamera nie unter Füße + 0,25 H; Weitsprung-Absprung 1,15×; Default-Slider 0,2 = heutiger Arm (Zoom 1,0).', 'Lab', 'tools/parity (B0: game 10/10, hub 9/9)', 'docs/critic/lab-parity/2026-10-11_B0/REPORT.md')
d('V-089','2026-10-11','Almanach','RULE','Almanach-Welt-Reiter: Deck → Welt nach registry.role (FORGET → Utopia, IGNORE → Dystopia, EMBRACE → Protopia). Vorläufig, Georg kann widersprechen.', 'Lab', 'Bild', 'docs/critic/lab-almanac/2026-10-11_02/REPORT.md')
d('V-090','2026-10-11','Figuren','PASS','Augen: Bei widersprüchlichen Abnahmen gilt die neuere (EYE-CLEANUP-01 vom 01.10., anchored, Lid = Haut der Figur) vor rig-large-reviewed vom 20.09. (dx/dy); Large ohne neueren Eintrag behalten dx/dy, markiert.', 'Lab', 'Kontaktbogen B2', 'Georg 11.10.')
d('V-091','2026-10-11','Inseln','TBD','Später prüfen, ob bzw. wie Ufer-Design (Wasser plus Ufergelände), Claymation und Color-Themes auf die Unity-Inseln (StreakByte) übertragen werden.', 'Lab', 'Plan', 'Georg 11.10.')
d('V-092','2026-10-11','Himmel','RULE','TinySkies-Effekte verfügbar: Tageszeiten, Regen mit Tropfen auf dem Bildschirm, Auroras, Blenden- bzw. Lens-Flare-Effekte, TinySkies-Licht-Kreis-Logik. SKY3 ist vendored; Regen, Aurora, Flare und Licht-Kreis sind noch nicht verdrahtet bzw. nicht geprüft.', 'Lab', 'Standbilder je Effekt', 'Georg 11.10.; docs/critic/lab-sky/2026-10-10_01/REPORT.md')
d('V-093','2026-10-11','Himmel','TBD','Portale und Tornados (KISS) aus TinySkies, über Chat angemeldet.', 'Lab', 'Plan', 'Georg 11.10.')
d('V-094','2026-10-11','Inseln','RULE','Webchat-Konzepte für weitere Custom- bzw. God-Mode-Inseln (Storytelling, Bewohner, Design, WIP auf GitHub) sind Eingang für Georgs Insel-Bau; Claude Design dafür höchstens 2D nach Priorität (V-084).', 'Steuerung', 'Plan F', 'Georg 11.10.')
d('V-095','2026-10-11','Strecke','RULE','Track-Core-Übergangs-Research (Stadtstraße → Rennstrecke, J14 T4, Varianten A/B, Branch research/kfb-track-core-transition-rail-2026-10-10) ist Eingang für Phase C; zuerst Sichtvergleich A/B im Original-J14-Renderer, keine Parameter-Optimierung vorher.', 'Lab bzw. Research', 'A/B-Standbilder', 'Webchat-Update 10.10.')
d('V-096','2026-10-11','Himmel','RULE','„Licht-Kreis“ = TinySkies-Fog-of-War: beleuchteter Bereich um den Spieler, vor allem nachts sichtbar (aus der Webchat-TS-Analyse). Teil von A10, nur 1:1 aus vorhandener Vorlage.', 'Lab', 'Standbild Nacht', 'Georg 11.10.')
d('V-097','2026-10-11','Himmel','RULE','Lichtkreis = WhackMan-Fog-of-War 1:1 (PointLight an der Figur, 39,4 lab, 0,7 H, decay 1,6); Slider 0–100 %, Standard 60 %, effektiv × Nachtgewicht (Lab-Ergänzung); kein Ring, keine Vignette. Aurora-Elevation als Thema-Parameter, Standard im oberen Bilddrittel der Spielkamera (LAB PATCH).', 'Lab', 'Standbilder A10', 'Steuerung 11.10. nach Georgs Klärung (V-096)')
d('V-098','2026-10-11','Strecke','RULE','KFB Organ-Inseln bzw. Organ-Attraktionen (Claude Design, Joyride-J15-Strecke durch schwebende Inseln mit Tunneln, Loopings, steilen Stücken mit Fahrhilfe bzw. Booster, Portalen, Kamera-Presets) sind Pflicht-Vorlage für Phase C, D und E. Lokaler Cut 03.10.; neuere Fassung O1 v4 nur in Claude Design (Export nötig).', 'Lab', 'Vorlage-zuerst-Zeile Phase C', 'Georg 11.10.; KFB Organ-Attraktion C2/')
d('V-099','2026-10-11','Strecke','RULE','Anschluss-Arten einer Insel an die Strecke: (1) Auf- bzw. Abfahrt, (2) Tunnel durch die Insel (Gebirgsinseln, Durchfahrten) mit Ausfahrt per Rampe nach oben auf den Inselboden, (3) später Paternoster-Plattform. Im Strecken-Editor als wählbarer Anschluss-Typ je Anker.', 'Lab', 'Plan E', 'Georg 11.10.')
d('V-100','2026-10-11','Strecke','RULE','Tunnel-Looks: die 4+ Tunnel-Styles aus den Joyride-Slices (u. a. J15 Tunnel-Looks) 1:1 übernehmen und je Tunnel wählbar machen (Strecken-Editor).', 'Lab', 'Standbild je Style', 'Georg 11.10.')
d('V-101','2026-10-11','Himmel','RULE','Im AUTO-Tageslauf folgt der Skydome per Überblendung zweier Dome-Ebenen (keine harten Schnitte); LAB-Ergänzung, Vendor unverändert. Aurora-Elevation Standard 5° (gemessen).', 'Lab', 'Standbild Dämmerung', 'docs/critic/lab-sky/2026-10-11_A10/REPORT.md')
d('V-102','2026-10-11','Look','PASS','Fahrbahnfarbe wie J17 tatsächlich gebaut: schieferblaue Fahrbahn #3d4a60, orange-rote Knete-Banden bzw. Randstrang #ef5a22 (pictures/chase-curve.jpg). Ersetzt den Wortlaut „orange Fahrbahn“ in V-010 (stammte aus dem Masterplan-Text). Georg 11.10.: „schieferblau mit orangen Banden passt“.', 'Lab', 'Gleichstand-Bild gegen chase-curve/straight/tunnel', 'docs/PHASE_C_DONORS_R1.md')
d('V-103','2026-10-11','Strecke','RULE','Phase-C-Reihenfolge: C0 Sichtvergleich A/B im Original-J14-T4 (nur Standbilder, ein Blatt) → C1 J17 1:1 im Lab (p1b.v2, track-look v5, tc1 race_tube, Schienen-Kamera nur im FAHREN, Squash J17 .12/.18/.06 statt drive.ts) mit Gleichstand-Test → C2 Brücke Track Core 0.16 → v5 → C3 O1-v4-Inseln im Raum, Tunnel als Anschluss-Typ je Anker, Style je Tunnel → C4 Ausfahrt per Rampe auf den Inselboden (neu) → C5 Umgebungs-Knete mit Nahband zusammen mit Bodenlook. Deformer v2 bleibt draußen (keine Georg-Abnahme); Booster bzw. Fahrhilfe später; alles offline mit lokalen Kopien; Lauf-Kamera bleibt.', 'Steuerung', 'parity + Gleichstand je Schritt', 'docs/PHASE_C_DONORS_R1.md')
d('V-104','2026-10-11','Strecke','RULE','Übergang Stadtstraße ↔ Rennstrecke (V-095): Variante B als Arbeitshypothese – Bordstein und orange Bande laufen auf rund 17 m nebeneinander und blenden weich über (statt Übergabe an einem Punkt wie bei A). Georg: „minor issue“; kein Seitenkamera-Blatt.', 'Steuerung', 'Standbild beim Einbau (C3/E)', 'docs/critic/lab-track/2026-10-11_C0/REPORT.md')
d('V-105','2026-10-11','Insel','RULE','Gefängnis- bzw. Maze-Insel (rund und eckig) plus Wall-Kit-Blatt = Mauer-Referenz: modularer Mauer-Baukasten (gerade, Ecken, T, Kreuz, Endkappe, Tor, kaputt, Brüstung, Pfeiler, Treppe, Brücke, Wachturm-Module) mit austauschbaren Skins: A Stein, B Sci-Fi später. Stil-Richtung, keine Pixel-Vorgabe; erst Bestand prüfen, Georg setzt im Insel-Editor.', 'Lab', 'Standbild gegen Blatt beim Einbau', 'docs/golden/candidates/prison-maze_2026-10-11/')
d('V-106','2026-10-11','Insel','TUNE','Inselboden bzw. Unterseite der Gefängnis-Insel-Blätter: zu sehr drangeklebt (Fels- und Erdklumpen angesetzt) statt Schollen-Design. Inselkörper folgt der Scholle (V-015, Scholle v7: ein Stück zersprengte Erde); aus den Blättern gilt nur Mauer bzw. Oberseite.', 'Lab', 'Standbild Seitenansicht gegen Scholle v7', 'Georg 11.10.')
d('V-107','2026-10-11','Prüfung','RULE','Parity-Bewegungs-Checks (Hub 5 Recenter, 8 beide Tasten) messen in Sim-Zeit (Taste gehalten, bis die Schrittsumme 2,0 bzw. 1,5 s erreicht), Kriterien unverändert. Leistung separat: fps-Median Hub und Spiel im sichtbaren Browser plus Dreieckszahl; Hub unter 60 fps = eigener Befund.', 'Lab', 'tools/parity', 'docs/critic/lab-track/2026-10-11_C1a/REPORT.md')
d('V-108','2026-10-11','Biom','RULE','Dystopia-Referenz: Vulkanfestung (Tag) und Vulkanarena unter Blutmond (Nacht). Basaltnadeln mit glühenden Lavarissen, Fackel-Pfeiler, Bühne, Thron, Pentagramm-Ring; Licht über Emission (Lava, Fackeln), nachts Blutmond-Himmel. Mauer- bzw. Treppenteile als Dystopia-Skin des Mauer-Baukastens (V-105). Inselboden wie V-106 nicht übernehmen; Thron-Figur ist keine KFB-Figur.', 'Lab', 'Standbild gegen Blatt beim Biom-Einbau', 'docs/golden/candidates/dystopia-vulkan_2026-10-11/')
d('V-109','2026-10-11','Strecke','RULE','Neue Standard-Welt (C1b+C3): O1-v4-Layout (4 Organ-Inseln als SDF-Körper + Hex-Hub-Insel, Ring Track Core v0.12) mit J17-Strecken-Look (Fahrbahn, Strang bzw. Banden, Pfeiler) statt O1-Strang; Tunnel wie O1 plus v7-Mündung-Fix; TC1-Style je Tunnel. Ein Renderer bzw. Licht bzw. Himmel (LAB PATCH nur Host-Teil). Spawn zu Fuß auf der Hex-Insel, Farmer Standardfigur; alte RKIT-Welt nur ?rkit=1. Leistung: Strecke in Stücken + LOD, Organe Light, Hex instanziert.', 'Lab', 'Blatt + parity + Leistung vorher/nachher', 'Steuerung 11.10.')
d('V-110','2026-10-11','Insel','RULE','Protopia-Farm- und Maker-Space-Insel mit Strecken-Anschluss (M1 maßgeblich): Brücke frei im Raum, Auffahrt auf Bodenhöhe, auf der Insel Straße durch den Platz, Rampe nach oben auf eine Ebene, Wendeschleife um Drehscheibe. Referenz für V-099 Typ 1 und C4. Strecken-Look bleibt J17 (V-102); Inselboden wie V-106 nicht übernehmen.', 'Lab', 'Standbild gegen Blatt bei C4 bzw. Phase D', 'docs/golden/candidates/protopia-makerspace_2026-10-11/')
d('V-111','2026-10-11','Welten','RULE','Organ-Inseln bzw. Organ-Attraktionen werden später für die MED-Decks bzw. -Welten bzw. Fachgebiete genutzt (Deck → Welt über registry.role, V-089). In C3 dienen sie als Vorlage für Ring, Tunnel und Inseln im Raum; die Inselmenge bleibt austauschbar, sodass Phase D die 8 StreakByte-Inseln einsetzt.', 'Lab', 'Inselmenge als Daten austauschbar', 'Georg 11.10.')
d('V-112','2026-10-11','Strecke','RULE','Tunnel = O1-v7-Bohrung (sauber „durchgebohrt“, 1:1) + Joyride-TC1-Portal (Ein- und Ausgang), Innenschale und Beleuchtung je Style (V-100, Standard race_tube). O1-Ton-Torus höchstens als weiche Naht zwischen Portal und Organ-Oberfläche (V-011). Pflicht: sauber ins Grundmesh einmodelliert (SDF vereinigen bzw. abziehen, gemeinsam vernetzen), alle Mesh-Löcher gefixt, keine lazy hacks (kein aufgesetztes Portal, keine Stopfen, kein z-fighting).', 'Lab', 'je Organ: offene Kanten 0, nicht-mannigfaltig 0, Durchblick-Test, Standbild je Portal-Style + Innenansicht', 'Georg 11.10.')
d('V-113','2026-10-11','Strecke','RULE','Die Tunnel-Pflicht aus V-112 (sauber ins Grundmesh, keine Löcher, keine lazy hacks, gleiche Prüfungen) gilt für alle Tunnel: Gebirgs-Inseln und Tunnel durch die Insel-Basis. Durch die Basis mit Auf- bzw. Abfahrt nach oben bzw. unten im Inneren nach Parkhaus-Logik (Rampen bzw. Spindel zwischen Ebenen); Vorlage zuerst: Joyride J14 T4 Parkdeck (Zone ZC). Ergänzt V-099 Typ 2.', 'Lab', 'wie V-112 + Standbild je Ebene', 'Georg 11.10.')
d('V-114','2026-10-11','Technik','RULE','Tunnel-Einbau (V-112) per exaktem Mesh-Boolean mit manifold-3d (Apache-2.0, gepinnt, offline vendored, WASM lokal): Bohrung O1 v7 im SDF, TC1-Teile je Style als geschlossene Körper, Union mit dem Organ zu einem geschlossenen Mesh; O1-Torus entfällt, Ton-Naht per kleiner Kehle nach Bild. Laufzeit-Boolean wegen Strecken-Editor (E).', 'Lab', 'V-112-Prüfungen + Bauzeit je Tunnel', 'Steuerung 11.10.')
d('V-115','2026-10-11','Leistung','RULE','Organ- bzw. Strecken-Welt: Liefer-Schranke ≥ 30 fps im sichtbaren Fenster (nah, mittel, Übersicht), Ziel 60 fps in späterem Optimierungs-Durchgang. Reihenfolge der Hebel: Nahband (drin) → Stufenwechsel 900/1000 mit 1-s-Dither-Überblendung (kein Umspringen) → Shader-Profil clay v10nb mit Gleichstand Δ ≤ 1/255 → erst dann Render-Scale (mit Blatt). Ersetzt die Vorgabe „≥ Spiel-fps“ (Spiel hat keine Gelände-Knete).', 'Lab', 'fps 3 Kameras + Gleichstand', 'Steuerung 11.10.')
d('V-116','2026-10-11','Technik','RULE','Organ-Körper werden aus dem unveränderten O1-Feld (v7) mit manifold-3d levelSet statt Surface Nets vernetzt (Surface Nets ist nicht mannigfaltig, Boolean unmöglich). Formgleichheit per Standbild + Abstandsmaß (max ≤ 0,5 Zelle); Dreiecke möglichst wie bisher. Pflicht topologisch 0/0/0; Pinches nur lokal schließen, wenn sichtbar. Bauzeit > 3 s ok, später vorab backen bzw. cachen.', 'Lab', 'Topologie-Prüfung + Abstandsmaß + Standbilder', 'Steuerung 11.10.')
d('V-117','2026-10-11','Prozess','RULE','Dokument-Vorrang: maßgeblich sind DECISIONS.md, Lab docs/KFB_WORLDBUILDER_PLAN_R1.md und Lab docs/PROJECT_STATE.md. Abgelöst: Masterplan R2/R2.1 (insb. §4 Besitzer-Tabelle und §7), Weg A (Postmortem MVP-1 §5.1, Golden-Referenzen von Claude Design), MVP_DRIVE_LOOP_R1_PLAN.md, STAGE1_R2D_PORT_PLAN.md. Persistenz-Pflicht: Register, Plan, Projektstand und START_HERE_STEERING.md werden bei jeder Register-Änderung auf GitHub (Branch docs/kfb-decisions-register-2026-10-11) mitgeschoben.', 'Steuerung', 'GitHub-Stand = lokaler Stand (Kopf-V-Nummer gleich)', 'Blender-Review NOTE_TO_STEERING_SESSION_R1 §1.1')
d('V-118','2026-10-11','Strecke','RULE','RKIT nur noch innerhalb von Georgs Town (Bordsteine, Gehwege). Strecken, Übergänge, Brücken und Rampen zwischen Inseln = Track Core + J17-Look im Lab. RKIT-Gate R3 P2 „Network Families and Structures“ ist auf „nur Town, Joyride außerhalb“ umgestellt. Rampen: Track Core v0.14 EXIT/ENTRY, DIVERGE/CONVERGE, Gore-Flächen sind Vorlage, kein Nachbau. Wendeschleife fehlt im Track Core (TBD, Besitzer Track Core).', 'Steuerung', 'Vorlagen-Zeile C4', 'Blender-Review §1.3, §1.7; Postmortem Joyride §4.2')
d('V-119','2026-10-11','Insel','RULE','Golden-Referenzen für Insel-Rand, Unterseite und Übergang Straße → Insel liefert der Blender-Coworker (Island Form Kit 01): K1 Unterseiten-Familien (Anatomie-Basis, gesprengte Scholle, Wurzelballen gegen v6-„Würste“, nebeneinander) + K2 Silhouetten auf einem Blatt → Georg wählt → K3 Übergänge in J17-Kamera → K4 später. Nur Optionen und Referenzen in K2-Einheiten, keine Laufzeit, kein zweiter Insel-Besitzer. Ersetzt Weg A (Claude Design, V-084).', 'Blender-Coworker', 'Blatt K1+K2, Georg-Wahl', 'Blender-Review §1.2, §3')
d('V-120','2026-10-11','Insel','RULE','Aus WSA-Returns übernommen (dort von Georg entschieden, bisher nicht im Register): (a) gemauerte bzw. Pfeiler-Brücke zwischen Inseln FAIL; Steinbrücken nur auf Inseln; zwischen Inseln die schwebende J17-Strecke mit Ein- und Ausfahrt an der Inselkante. (b) Protopia und Maker Space sind zwei getrennte Inseln mit direkter Auf- bzw. Abfahrt. (c) Gefängnis-Labyrinth: Standardmauern 1,6 m plus ausgewählte höhere Zellenmodule (Höhe offen; Umrechnung in K2 vor Lab-Einsatz).', 'Steuerung (Abgleich)', '-', 'planning/kfb-fluff-crafting-almanac-ideation-2026-10-09 Router 11.10.; planning/kfb-g4-stairs-reference-2026-10-10 @5047ba3')
d('V-121','2026-10-11','Insel','TBD','Gefängnis-Greybox (Blender, Meter, Figur 2,17 m) erst nach MVP-1 ins Lab: dann Umrechnung in K2 (H = 3,64) und Brücken-Sockel durch Track-Core-ENTRY ersetzen; auf Anfrage der Steuerung.', 'Blender-Coworker', 'K2-Maßprüfung', 'Blender-Review §1.6')
d('V-122','2026-10-11','Prozess','RULE','Plan R1 und dieses Register gelten auch gegenüber dem WSA-Router (planning/kfb-fluff-crafting-almanac-ideation-2026-10-09). Der Vier-Insel-Story-A/B-Vergleich (Town, Dystopia, Utopia, Protopia) ist Design-Eingang für Phase D/F, kein Tor für das Lab; „Open World R4 = STOP“ betrifft das Lab nicht. WSA arbeitet ab START_HERE_STEERING.md und meldet Georg-Entscheidungen zur Registrierung an die Steuerung.', 'Steuerung', 'WSA-Returns verweisen auf V-Nummern', 'Georg 11.10.: „Plan R1 gilt, gib WSA die Startseite“')
d('V-123','2026-10-11','Insel','FAIL','Island Form Kit 01 · K1 Unterseiten + K2 Silhouetten R1 (Blender, aus Scholle-v7-Port generiert): FAIL. Georg hat Blender direkt neu gebrieft; der neue Auftrag steht im nächsten Blender-Return und wird dann hier ergänzt.', 'Blender-Coworker', '-', 'blender-mcp/island-form-kit-01-2026-10-11 @6e1dd5a; Georg 11.10.: „war ein fail“')
d('V-124','2026-10-11','Szene','FAIL','Protopia/Maker-Szene R1 (WSA, zusammengesetzt aus Spender-Assets): FAIL. Georg: „Das sieht jetzt aus wie eine visualisierte Asset-Sammlung, also super schlampig zusammengebaut und irgendwie kein Storytelling, keine Architektur, keine Übergänge.“ „Also sowas möchte ich eigentlich nicht mehr sehen.“ Technische Spender-Prüfungen retten keine Szenen-Abnahme.', 'WSA', '-', 'replies/WSA_ACK_V122_AND_SCENE_FAIL_2026-10-11.md; planning/kfb-fluff-crafting-almanac-ideation-2026-10-09 @2cf76e4')
d('V-125','2026-10-11','Strecke','RULE','Georg (afk-Auftrag): Rennstrecke und alle Module sauber bauen: Fahrbahn, Strang bzw. Banden, Pfeiler, Markierungen, Tunnel-Styles mit Portal bzw. Innenschale bzw. Licht, Docks bzw. Anschlüsse, danach C4 Auf- und Abfahrten (Track-Core-EXIT/ENTRY). Je Lieferung zwei blinde Kritiker als frische Instanzen: (1) 3D-Modelling + Strecken-Baukasten-Logik (geschlossene Meshes, Anschlüsse, Nähte, Track-Core-Regeln, Q1–Q9), (2) Design (J17-Goldstandard, Storytelling, Übergänge, V-011). Pflicht: sauber und mit korrekter Physik befahrbar (Joyride k2b, bytegleich): automatische Runde über den ganzen Ring inkl. Tunnel und Rampen ohne Durchfallen, Hängenbleiben, Sprung an Nähten oder Kamera in der Wand. Höchstens 2 Reparaturrunden, dann Stopp und Georg.', 'Steuerung', 'qcheck + Fahrtest-Runde + 2 Kritiker-Berichte', 'Georg 11.10.')
d('V-126','2026-10-11','Auto','RULE','Fahrzeuge für Strecke und Fahrtest: registrierte Retro-Autos (Standard Cicada, V-030) und KayKit-Autos, geschlossen; kein Cabrio (auch nicht das J17-Cabrio außerhalb der J17-Referenzseite). Fahrphysik k2b je Fahrzeug, Figur beim Fahren unsichtbar.', 'Lab', 'Fahrtest mit je einem Retro- und KayKit-Auto', 'Georg 11.10.: „ohne cabrio, reg. retro & kaykit cars erstmal reicht“')
d('V-127','2026-10-11','Welten','RULE','Organ-Inseln für MVP out of scope: Sie müssen später medizinisch-cartoonig plausibel nachmodelliert werden (MED-Welten, V-111). Im MVP sind sie nur Platzhalter-Körper für Ring, Tunnel und Anschlüsse; keine weitere Arbeit an ihrer Form. Lieferbar sind Strecke und Module (V-125); der Design-Kritiker bewertet die Organ-Form nicht. Phase D tauscht das Insel-Set.', 'Steuerung', 'Kritiker-Briefing markiert Organe als Platzhalter', 'Georg 11.10.')
d('V-128','2026-10-11','Klang','RULE','In der Strecken-Welt Joyride-VFX und -SFX 1:1 integrieren (z. B. Motor, Reifen, Bandenkontakt, Tunnel, Fahr-Effekte, soweit in J16/J17 vorhanden) plus Soundbed bzw. Radio (V-042, ein AudioContext). Ziel: Georg testet das „chill & fun cosmic roadtrip“-Gefühl. Vorlage zuerst; Leistung V-115 bleibt Schranke.', 'Lab', 'Liste Effekt → Quelle; Fahrt mit Ton; fps', 'Georg 11.10.')
d('V-129','2026-10-11','Klang','RULE','Beim Fahren laufen Georgs Suno-Tunes (RoadTrip JukeBox v2, 15 Tracks, lokal in public/private-audio/suno-roadtrip-jukebox-v2/, privat); Cozy Tunes sind für die Inseln. Dazu Racer-SFX und Drohnen aus den Joyride- bzw. Race-Vorlagen. Stems (u. a. Cosmic Roadtrip Orchestral) später für adaptiven Mix.', 'Lab', 'Fahrt mit Suno-Radio + SFX im Mitschnitt', 'Georg 11.10.: „vor allem meine suno tunes will ich fahren hören – cozy tunes sind eher islands“; „und die racer SFX, drohnen etc“')
d('V-084','2026-10-10','Claude Design','FAIL','Town-Massemodell R1: Claude Design baut keine 3D-Geometrie mehr.', 'Steuerung', '-', 'docs/critic/claude-design/town-massemodell-r1-FAIL_2026-10-10/')
# --- WARUM und WANN (Georg 11.10.: „why & when für decisions“) ---
# WANN = Datum der Entscheidung (Feld date) + ab wann bzw. in welcher Phase sie gilt (applies).
WHY = {
 'V-001':('Nachbauten haben Abgenommenes verloren und Fehler doppelt gebaut (Post-Mortem Stufe 1).','sofort, jede Sitzung'),
 'V-002':('LLM-Gestaltung scheitert an Komposition und Raum; Georgs Geschmack ist der Maßstab, Werkzeuge können wir.','ab Plan R1'),
 'V-003':('Entscheidungen gingen in Fließtext verloren; der Ordner 30_DECISIONS war vereinbart und blieb leer.','ab 11.10.'),
 'V-004':('Ein Agent meldete „kein Zitat“ trotz PASS-Spalte; schlechtes Briefing kostete Tokens und Vertrauen.','jede Recherche'),
 'V-005':('Zu viele parallele Baustellen, keine wurde fertig.','ab Plan R1'),
 'V-006':('Ein Blender-Lauf blähte sich auf 71 GB auf und füllte die Platte.','jeder schwere Lauf'),
 'V-007':('Git- bzw. CI-Rückfragen überfordern und frustrieren; tiefe Pfade sind im Finder nicht klickbar.','immer'),
 'V-008':('17 % des Limits verbrannt ohne sichtbaren Fortschritt.','ab 11.10.'),
 'V-009':('Damit kein Design und keine Entscheidung mehr verloren geht; Living Doc statt Chat-Gedächtnis.','ab 11.10., jede Antwort'),
 'V-010':('Joyride war gesetzt; eng gestellte Frage („nur Physik“) führte zum Regress auf RKIT-Platten.','sofort; Phase C Rückgrat'),
 'V-011':('Sichtbare Nähte bzw. Geisterlinien waren der häufigste Bildfehler.','immer'),
 'V-012':('Handgebauter Diorama-Look statt CAD; Materialmix macht es lebendig.','immer'),
 'V-013':('Bildgenerierung zeigt Ideale, die nicht 1:1 baubar sind; Kritiker-Schleifen zum Nachbilden sind teuer.','ab 10.10.'),
 'V-014':('Test-Hub-Reste wirken wie Bastelarbeit und verfälschen jede Abnahme.','ab 10.10., jede Vorschau'),
 'V-015':('Elemente ohne Geschichte wirken beliebig (Mittelalter-Generik).','immer'),
 'V-020':('Gehen als Standard war zu langsam; Georgs dokumentierte Werte aus game_r5.','ab Probe 6'),
 'V-021':('Zwei Pfade (walk.ts vs. Travel-Core) erzeugten den Regress im Spiel.','ab B0'),
 'V-022':('Vertrautes Schema; Georg will WoW-Gefühl.','ab B0'),
 'V-023':('Sprünge müssen zum Bewegungszustand passen.','ab B0'),
 'V-024':('Flug kommt später; Taste wird freigehalten.','später'),
 'V-025':('Orientierung und Komfort wie in WoW.','ab B0'),
 'V-026':('Orbit ruckelte, Zoom zu empfindlich.','ab B0'),
 'V-027':('Figur muss sichtbar bleiben.','ab Stufe 2'),
 'V-030':('Cabrio bringt Ein-/Ausstieg, Lenkrad und Kamera-Komplexität ohne MVP-Gewinn.','MVP-1'),
 'V-031':('Details später; erst Environment sauber.','MVP-1'),
 'V-032':('Abgenommenes Fahrgefühl; Bordstein-Stöße sagten nichts aus.','ab Probe 6'),
 'V-033':('Cartoon-Qualität kommt nach der Grundstruktur.','später'),
 'V-040':('Das gestaltete HUD mit Rucksack existierte schon; Joyride-HUD wäre Rückschritt.','ab Phase A'),
 'V-041':('Cleanes Interface statt Messdaten im Spiel.','ab Phase A'),
 'V-042':('Klang je Insel und Radio als Spielgefühl; Radio als Rucksack-Gegenstand ist Weltlogik.','ab Phase A'),
 'V-043':('Skalierbar für tausende Karten.','ab Phase A'),
 'V-050':('Tag-Nacht-Grundlage; Abend braucht Feintuning.','ab Phase A'),
 'V-051':('Farben, Licht und Klang gehören zusammen und sollen generierbar sein.','ab Phase A, Generator in F'),
 'V-052':('Gut funktionierender Slice, nicht wieder verlieren.','Phase B+'),
 'V-053':('Figur zu grob, Umgebung ohne Knete – Drift gegen den Kanon.','Phase B'),
 'V-060':('Figuren-Proportionen sind festgelegt; Welt passt sich an.','immer'),
 'V-061':('Qualitätskontrolle für Knete, Augen, Licht je Figurenklasse.','Phase B2'),
 'V-062':('Frühere Ports verloren Regler (z. B. Viseme).','Phase H'),
 'V-070':('KayKit, Tiny Treats und Quaternius passen zum Cartoon-Look, Kenney ist generischer.','immer'),
 'V-071':('Lizenz bzw. EULA.','immer'),
 'V-072':('Georg will keine Klick-Aufträge für reine Asset-Merges.','immer'),
 'V-080':('Studieren und nutzen statt umbauen; Town ist Georgs eigene Insel.','ab 10.10.'),
 'V-081':('Georg gestaltet selbst schneller und besser.','Phase F'),
 'V-082':('Spielmechanik Fluff, später.','nach F'),
 'V-083':('Chill-&-Fun-Interaktion, später.','nach F'),
 'V-073':('Gekaufte Musik darf nicht öffentlich liegen, muss aber im Spiel und auf der GPT-Site laufen.','sofort'),
 'V-085':('Comic-Storytelling-Kern von KFB (Tenth Art); Vorlagen: Overworld v13 Blasen-Formen und Bubble-Fixtures, Comic-Baukasten.','mit ChatterBox bzw. Stimmen-Phase'),
 'V-086':('Lesbarere Cartoon-Gesichter; eine Figuren-Karte als einzige Quelle für Aussehen, Augen, Mund und Stimme.','Backlog, mit Studio-Übernahme H'),
 'V-087':('Georg will keine neuen Repos und keinen Aufwand jetzt; Ablage-Aufräumen später gebündelt.','ab 11.10.'),
 'V-088':('Gemessene Werte zu V-020–V-026, damit sie nicht wieder abrutschen.','ab B0'),
 'V-089':('Welt-Reiter brauchen eine eindeutige Zuordnung; Deck-Rollen passen zu den Welten.','ab Almanach R2'),
 'V-090':('Zwei Abnahmen widersprachen sich; die jüngere spiegelt Georgs aktuellen Stand.','ab B2'),
 'V-091':('Die Unity-Inseln bleiben vorerst, wie sie sind (V-080); ein späterer Angleich an den KFB-Look ist offen.','später'),
 'V-092':('Lichtstimmung lebt von Wetter- und Himmelseffekten; die Vorlagen existieren schon.','nach B2 als A10'),
 'V-093':('Spielerische Himmelsphänomene, später.','später'),
 'V-094':('Konzepte existieren; Georg baut Inseln selbst im Editor.','Phase F'),
 'V-095':('Bande und Gehweg laufen sonst räumlich aneinander vorbei; erst sehen, dann tunen.','Phase C'),
 'V-096':('Nachtstimmung mit Fokus auf den Spieler wie in TinySkies.','A10'),
 'V-097':('Nachts Fokus auf den Spieler wie in TinySkies; Aurora war in der Spielkamera nicht sichtbar.','A10'),
 'V-098':('Dort ist „Inseln im Raum plus Strecke plus Tunnel“ schon gelöst; nicht neu erfinden.','Phase C bis E'),
 'V-099':('Tunnel sind in den Organ-Inseln schon gelöst und passen zu Gebirgsinseln; Paternoster als spielerische Variante.','Phase C bis E, Paternoster später'),
 'V-100':('Die Tunnel-Looks sind in Joyride schon gestaltet und abgenommen; nicht neu erfinden.','Phase C bis E'),
 'V-101':('Der statische Dome passte im Zyklus nicht zur Tageszeit; ein harter Wechsel verletzt V-011.','ab A10'),
 'V-102':('Goldstandard heißt J17 so, wie es gebaut und abgenommen ist; der Gleichstand-Test gegen chase-curve.jpg ginge mit oranger Fahrbahn nie auf.','ab Phase C1'),
 'V-103':('Vorlage zuerst und Goldstandard zuerst: erst sehen (C0), dann J17 1:1 (C1), erst danach Neues (C4) – so kein Nachbau ohne Freigabe.','Phase C'),
 'V-104':('Weiche Überlappung entspricht V-011 (keine harten Schnitte); A übergibt an fast einem Punkt.','ab Einbau Stadt-Anschluss'),
 'V-105':('Mauern bzw. Labyrinthe brauchen einen festen Baukasten mit Rastermaß; Skins erlauben Themen-Inseln ohne Neubau.','Phase D/F'),
 'V-106':('Angeklebte Unterseiten widersprechen der Weltlogik: Inseln sind Schollen der zersprengten Erde, kein Sockel mit Deko.','sofort; Phase D/F/G'),
 'V-107':('Headless lief der Hub mit 12–17 fps; der 50-ms-Schrittdeckel verlangsamte die Simulation und ließ Checks zufällig kippen. Sim-Zeit trennt Logik von Rechnerlast, Leistung wird trotzdem gemessen.','ab C1a'),
 'V-108':('Dystopia hatte bisher nur Palette und Pflanzenliste aus R2D; jetzt gibt es ein Bild für Formen, Glut-Licht und Nachthimmel.','Phase D/F/G'),
 'V-109':('Georg will die alte FAIL-Welt nicht mehr sehen; O1 hat Inseln, Tunnel und Ring schon gelöst, J17 den Look – beides 1:1 statt Neubau.','ab C1b/C3'),
 'V-110':('Erstes Bild, das zeigt, wie die Strecke auf einer Insel ankommt und weiterläuft; bisher gab es nur Tunnel bzw. Docks (O1).','C4, Phase D/E'),
 'V-111':('Organe passen inhaltlich zu Medizin-Themen; die Hauptwelt bekommt die StreakByte-Inseln und eigene KFB-Inseln.','ab Phase D/E'),
 'V-112':('Die Organ-Tunnel sind nach Tuning sauber gebohrt, aber ohne Portal, Innenleben und Licht; genau das hat Joyride gestaltet.','ab C3'),
 'V-113':('Gleiche Qualitätsregel überall; Parkhaus-Rampen verbinden Strecke und Inselebenen ohne Paternoster.','C4, Phase E/F'),
 'V-114':('TC1-Teile (0,3–2,5 m) sind feiner als das Organ-Feld (2,8–3,6 m Zellen); SDF-Vereinigung würde den TC1-Look wegschmelzen. manifold-3d garantiert geschlossene Ausgabe.','ab C3'),
 'V-115':('Hero-≤-350 brachte nichts und sprang sichtbar (Light ist eine andere Form); der Knete-Shader füllt den Bildschirm. Ehrliche Schranke statt unfairem Vergleich, Look bleibt.','ab C3'),
 'V-116':('Die O1-Körper haben nicht-mannigfaltige Kanten (Herz 151); ohne geschlossene Körper ist Georgs Pflicht „keine Löcher, keine Hacks“ nicht erfüllbar. Gleiches Feld = gleiche Form.','ab C3'),
 'V-117':('Blender-Review: Plan R1 und aktueller Projektstand waren für andere Sitzungen unsichtbar, GitHub-Register endete bei V-084 – „jede Sitzung baut ihre Welt“ drohte erneut.','sofort'),
 'V-118':('Die alte Besitzer-Tabelle schlug den Look-Satz und führte zum Joyride-Regress; RKIT-P2 hätte ihn wiederholt.','sofort'),
 'V-119':('Nach V-084 fehlte ein Lieferant für Golden-Referenzen; Ursache „Bauen aus Text statt Bild“ blieb offen.','ab 11.10.'),
 'V-120':('Zwei Planungs-Systeme drifteten: Georg-Entscheidungen standen nur in WSA-Returns.','sofort'),
 'V-121':('Greybox ist in Metern gebaut; ohne K2 und Track-Core-Anschluss würde sie eine zweite Maß- bzw. Sockel-Logik einführen.','nach MVP-1'),
 'V-122':('Zwei Planungs-Systeme mit verschiedenen Toren führen zu Drift; ein Plan, ein Register.','sofort'),
 'V-123':('Flache grüne Platte auf glattem Kegel, ausgefranste Öffnungen, Wurzeln wie Stoßzähne: wieder aus Text bzw. Regeln generiert statt aus echten Vorbildern.','sofort'),
 'V-124':('Asset-Sammlung ohne Architektur, Geschichte und Übergänge; Georg will so etwas nicht mehr sehen.','sofort'),
 'V-125':('Strecke ist das Rückgrat; zwei getrennte Blicke (Technik und Design) verhindern, dass ein technischer PASS einen Look-FAIL verdeckt (V-124).','ab C1b/C3'),
 'V-126':('Bestätigt V-030; das J17-Original fährt ein Cabrio, das darf nicht durch die 1:1-Übernahme ins Lab rutschen.','ab C1b/C3'),
 'V-127':('Organe sind inhaltlich MED-Stoff und brauchen eigenes Nachmodellieren; Aufwand jetzt gehört in Strecke und Module.','sofort'),
 'V-128':('Das Fahrgefühl entsteht erst mit Ton und Effekten; Joyride hat beides schon gestaltet.','mit C1b/C3 bzw. direkt danach'),
 'V-129':('Fahren und Insel-Leben haben verschiedene Stimmungen; die Roadtrip-Tracks wurden dafür gemacht.','mit V-128'),
 'V-084':('Prozedurale Primitive können keine Claymation; Regress.','ab 10.10.'),
}
for e in E:
    w = WHY.get(e['id'], ('', ''))
    e['why'], e['applies'] = w
# --- Teil B: automatisch aus ACCEPTANCE_INDEX ---
idx = os.path.join(LAB, 'docs/ACCEPTANCE_INDEX.md')
subprocess.run(['python3', os.path.join(LAB, 'tools/acceptance/build_index.py')], stdout=open(idx, 'w'), stderr=subprocess.DEVNULL)
imp = []
for l in open(idx, encoding='utf-8'):
    m = re.match(r'\| `(.+?)` \| (.*?) \| (.*) \|$', l.strip())
    if m and m.group(1) != 'Datei:Zeile': imp.append(dict(source=m.group(1), part=m.group(2), georg=m.group(3)))
json.dump(dict(schema='kfb.decisions/1', updated=str(datetime.date.today()), entries=E, imported_acceptance=imp), open(os.path.join(H, 'decisions.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
md = ['# KFB Entscheidungen (PASS / TUNE / FAIL / RULE / TBD)', '', f'Stand {datetime.date.today()} · erzeugt aus `build_decisions.py` · Teil A handgepflegt (nur ergänzen), Teil B automatisch aus den STATUS- bzw. RETURN-Dateien.', '', '## A · Entscheidungen und Vorgaben', '', '| Nr | Datum | Gilt ab | Bereich | Urteil | Vorgabe | Warum | Besitzer | Prüfung | Quelle |', '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |']
for e in E: md.append(f"| {e['id']} | {e['date']} | {e['applies']} | {e['area']} | **{e['verdict']}** | {e['text']} | {e['why']} | {e['owner']} | {e['check']} | {e['source']} |")
md += ['', f'## B · Abnahmen aus Projektdateien ({len(imp)})', '', '| Datei:Zeile | Teil | Georg |', '| --- | --- | --- |']
md += [f"| `{r['source']}` | {r['part']} | {r['georg']} |" for r in imp]
open(os.path.join(H, 'DECISIONS.md'), 'w', encoding='utf-8').write('\n'.join(md) + '\n')
print(len(E), 'Einträge,', len(imp), 'importiert')
