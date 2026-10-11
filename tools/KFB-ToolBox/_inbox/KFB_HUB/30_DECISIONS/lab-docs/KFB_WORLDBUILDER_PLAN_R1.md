# KFB Worldbuilder · Plan R1 (ersetzt die Stufenfolge des Masterplans R2 für MVP-1)

Stand: 12.10.2026 (nachgeführt bis V-187, neu §2h–§2l und §5) · vorher 11.10.2026 abends (bis V-168) · 10.10.2026 spät · Steuer-Sitzung · Grundlage: Georgs Entscheidungen vom 10.10., `BASELINE_ACCEPTED_R1.md`, `BACKBONE_EDITOR_DONORS_R1.md`, `POSTMORTEM_JOYRIDE_REGRESS_R1.md`

## 0 · Grundsätze

1. **Joyride J17 ist Goldstandard** für den Gesamt-Look: Strecke, orange Banden, schieferblaue Fahrbahn (V-102), Cartoon-Deformer, Kamera, Paletten.
2. **Georg gestaltet, wir bauen Werkzeuge.** Inseln, Komposition und Town entstehen im Editor durch Georg. Wir liefern Werkzeuge, Regeln und Spielbarkeit.
3. **Vorlage zuerst:** Vor jedem Teil kommt eine Vorlage-zuerst-Zeile an die Steuerung. Übernahme geht 1:1; Neubau nur mit Begründung.
4. **Kein stiller Drift:** `baseline.accepted.json` plus automatische Gleichstand-Tests vor jeder Lieferung.
5. **Höchstens zwei Baustellen gleichzeitig.** Abnahme durch Georg im Spiel (Spiel-URL, kurzes Video, Standbilder), keine Kritiker-Schleifen.
6. **Lizenzen:** Gekaufte Inseln, Unity-Assets und private Audio-Dateien bleiben lokal. (12.10.: geklärt; keine Floskeln mehr, nur neue Fälle in einer Zeile [V-184].)

## 1 · Phasen

| Phase | Inhalt | Vorlagen (1:1) | Neu | Größe | Abnahme |
| --- | --- | --- | --- | --- | --- |
| **A · Oberfläche, Klang, Almanach, Licht** (läuft) | (5) HUD R3 mit Rucksack-Overlay und God-Mode-Schalter · (6) Audio-Bed je Insel plus Radio · (7) Almanach-Fächer mit PDF-Previews · (8+9) Licht-Profile Tag/Abend/Nacht/Innen plus Tag-Nacht-Regler, Glow-Emission, **Skydome mit allen Varianten** (SKY3 globe-v13, TinySkies, Spindel, Claude-Design-Wolken), **Insel-Farben** als Joyride-6er-Presets am Insel-Thema | HUD R3 (Claude Design), cologne-audio.v1, song-transport, Joyride- bzw. Overworld-v13-Fächer, wd-light.js, TinySkies | God-Mode-Plakette, Inventarliste, Insel-Klang-Zuordnung | M | je Teil im Spiel |
| **B · Gleichstand** | Figuren-Knete auf Resident-Atlas-Profil `fine`, Umgebungs-Knete nach K2-Kanon mit Nahband, Augen-Lidfarbe, Kamera (Rad-Zoom, RMB-Orbit, Sperr-Modus), Gleichstand-Tests für alle Baseline-Blöcke | Clay-Kanon 07.10., Resident Atlas, sw-mech-Kamera | Test-Suite `tools/parity/` | M | Tests grün, Bilder Figur und Boden nah |
| **B2 · Figuren-Auswahl als Spieler (Georg 10.10.)** | Alle registrierten KayKit-Figuren spielbar und wählbar: Medium-Rig, Large-Rig und, soweit vorhanden, Legacy. Dazu FrizzleBob v4, v3 (Graft-Rig) und v5 (eigene Ohren auf angepasster KayKit-Basis). **Alle mit KFB-Eye-Rig in Georgs gespeicherter Konfiguration.** Zweck: Spiel und Qualitätskontrolle (Knete, Augen, Farbe und Licht mit Terrain, Locomotion; Orbit von allen Seiten). Legacy bzw. Large ohne passende Clips zeigen Idle bzw. das nächste passende Set, ehrlich markiert. **Alle Textur- und Farbvarianten je Figur wählbar** (z. B. kleiner und großer Ork, Hiker usw.); vorher prüfen, dass alle Texturen vorhanden sind. Bekannter Fehler: Der Medium-Rig-Ork erscheint im Asset Librarian ohne Textur (Texturpfad bzw. Atlas prüfen, im Librarian und im Lab). | Resident Atlas (Figuren-Karten, Eye-Rig v6, anchored-eyes), Character-Select bzw. Vorhang (Clay Stage R2), FB-v5-Karte | Auswahlliste im HUD- bzw. God-Mode-Stil | M | Georg spielt jede Klasse einmal |
| **B+ · Wasser (Pflicht, Georg 10.10.)** | Claude-Design-Wasser-Shader übernehmen: fließendes Wasser bzw. Flüsse und Seen mit Tiefe (`donors/kfb-island-kit-r2-2026-10-08/KFB_Island_Kit_R1/kit/fluid.js`, F0–F2 PASS). **Inklusive des geformten Geländes drumherum:** See als Geländesenke (`lakeHAt`, `heightField`), weiche Wasserlinie per Marching Squares (`waterline`), Fluss als Rinne (`flowPath`, `lakeRiver`: Gelände = min(See, Rinne)), ein Netz für See und Fluss (`fieldWater`), Uferschaum (`uShoreFoam`), Deckkraft nach Tiefe.
**Alle Fixes mitnehmen:** F0.4 Hash ohne sin (keine Haarlinien), F0.5–F0.7 (keine Faltung), F1.2 (kein weißer Saum bzw. keine TinySkies-Linien), F2.1 (am Schnittrand kein Wasser unter der Böschung, keine dunklen bzw. schwarzen Kantenartefakte).
Doku: `donors/kfb-island-kit-r2-2026-10-08/STATUS.md` (F0–F2: Georg-Abnahme PASS) und `CHANGELOG_ADDITIVE.md` (2026-10-08). In Szene gesetzt auf den Demo-Inseln mit Wasser und als Wasser-Werkzeug im Insel-Editor (F). Darf nicht verloren gehen. | fluid.js 1:1 | Einbau, r186-Check | M | Georg sieht Fluss und See mit Tiefe im Spiel |
| **C · Joyride-Rückgrat** (läuft) | Reihenfolge V-103, geändert 11.10.: **C0** ✓ Übergang A/B (V-095 → V-104 B) · **C1a** ✓ J17 1:1 als Lab-Seite, Squash + Schienen-Kamera im FAHREN · **C1b+C3** (läuft) neue Standard-Welt: O1-v7-Ring + Organ-Inseln + Hex-Hub mit J17-Look (V-109, V-111), Tunnel = O1-Bohrung + TC1-Portal/Innenschale/Licht, geschlossen per manifold-3d (V-112–V-116), Leistung ≥ 30 fps (V-115) · **C2** Brücke Track Core 0.16 → v5 · **C4a** ✓ Haltebucht B7 + RKIT-Bürgersteig (V-138, TUNE nachgebessert) · **C4b** ✓ Track Core 0.16.9 im Lab, Teil 0 bitgleich · **C4c** (läuft) erste Aus-/Auffahrt am Hub: EXIT/ENTRY, LEVEL_RAMP, J17-Übergang B vor dem Platz, Poller, Weichen-Wechsel nach Seitenlage (V-161) · **C5** Umgebungs-Knete Nahband (V-053, im Organ-Bereich schon Standard) | J17 (p1b.v2, track-look v5, tc1), Organ-Inseln v7 (Ring-Modus), Track Core 0.14/0.16.1 | LAB-Host-Patch, Nahband-Kopie, Boolean-Einbau | M–L | Lab-Bild neben J17 `chase-curve` bzw. `chase-straight`; Blatt je Schritt |
| **D · Archipel im Raum** | Die 8 Demo-Inseln als ganze Szenen (Maßstab je Szene über die Tür- bzw. Bank-Regel), Anordnungs-Werkzeug im Orbit (greifen, verschieben, heben, drehen), Speichern als `kfb.world-layout/1`; erster Vorschlag nach Raumregeln (Höhenstufen, Gruppen, Überschneidung der Silhouetten) | demo-scenes.ts | Anordnungs-Gizmo, Layout-Datei | M | Georg ordnet selbst an |
| **E · Strecken-Editor** | Punkte im Raum setzen bzw. ziehen → Track-Core-Spline im Joyride-Look; Anschlüsse mit Auf- und Abfahrt an Insel-Ankern; hin, um und vorbei; sofort befahrbar | Track Core 0.16.1 (Rampen, Ein- und Ausfahrt), k2b | Zieh-Editor (der vorhandene Streckenbauer kann nur Stücklisten) | L | Georg fährt eine Runde |
| **F · Insel-Editor (God-Mode)** | Grundkörper (Scholle oder StreakByte-Basis), Terrain-Pinsel (WB2-Sculpt), Asset-Overlay mit Live-Suche und Vorschau (Librarian-Index; KayKit, Tiny Treats, Quaternius), Inline-Editor mit Snap und Ground (Resident Atlas), Muster-Pinsel (WB2-Strich plus nest/fan plus `scene-rules.json`), **Insel-Thema** (siehe §2), **Terrain-Painter** (Pinsel mit Radius wie der Terrain-Editor, Übergang als Dots- bzw. Sprenkel-Muster S1, Farbe per Color-Picker aus dem Toolbox-Studio, Auswahl aus der Insel-Palette; vom Webchat als God-Mode- bzw. Maker-Space-Feature angemeldet), Speichern und „Spielen“ | Resident-Atlas-Editor (0.184), WB2-Sculpt, grounding.ts, Librarian-JSONL | Muster-Pinsel-Adapter, Thema-Panel | L | Georg baut eine Taverne bzw. eine erste Insel |
| **H · Studio-Übernahme 1:1 (Georg 10.10.)** | Eye-Rig-Studio mit Ausdrücken und allen Reglern, Viseme bzw. Laute, Gesichtsmodule. **Kein einziger Regler und keine Einstellung darf verloren gehen.** Vorher eine Funktionsinventur über Toolbox, Frankenstein-Studio und Patch-Studio (dort waren Teile schon verdrahtet, z. B. die Viseme, die in der Toolbox nur teilweise umgesetzt sind). Index zuerst: `ACCEPTANCE_INDEX.md` plus PASS/TUNE/FAIL. Einbau in den God-Mode schrittweise. | Toolbox, Frankenstein-Studio, Patch-Studio, Resident Atlas | Inventur-Tabelle je Regler: Quelle → Lab | L | Georg vergleicht Regler-Liste und ein Gesicht vorher/nachher |
| **G · Prozedurale bzw. zufällige Inseln** | Ein Generierungsschritt aus Grundkörper, Terrain, Biom, Insel-Thema und Regeln; auch für Spieler-Inseln | F plus scene-rules | Generator | M | Georg bewertet 5 Zufallsinseln |

**Stand C (12.10.):** C4c Banden-Enden v2 PASS [V-183]. Folgen laufen: Auto in die Haltebucht, Zebra mit 3 Balken, Spalt bis zur Nase füllen; danach wird C4c Standardansicht. Dann V-171 Punkt 2 (Flackern) und Punkt 3 (Insel-Cache). Reihenfolge siehe §5.

**Parallel:**
- Blender-Coworker (Mac mini): Island Form Kit 01, K1 Unterseiten + K2 Silhouetten → Georg wählt → K3 Übergänge (V-119). Nur Referenzen, keine Laufzeit.
- WSA-Studie Szene, Biom und Licht → `scene-rules.json` als Eingang für F und G (Recherche, kein Bau).
- Georg baut KFB Town im Editor, sobald F steht.

## 2 · Insel-Thema (Georg 10.10.): ein Generierungsschritt, überall gleich

Schema `kfb.island-theme/1`, gespeichert im Insel-Rezept:
- **palette:** Sechser-Kombination (6 Farben) plus Zuordnung zu den Rollen in `ENV_ROLES`.
  - Basis ist das Joyride-Farbschema mit seinen zwei abgeleiteten Schemata (`track-look.v5` WORLDS: canyon, bucht, otown).
  - **Generator:** zufällig harmonisch oder aus 2–3 vorgegebenen Farben die passenden Cartoon-Farben ergänzen (Harmonie-Regeln aus den Joyride-Kombinationen ableiten); Feintuning später.
- **light:** Profil aus Phase A8 (Tag, Abend, Nacht, Innen) plus Zeit.
- **sound:** Ambience bzw. Sender aus Phase A6.
- **biome:** Asset-Klassen und Dichte (aus `scene-rules.json`).
- **storyTint:** leichte Einfärbung je Story-Mode (High- bzw. Low-Vibrational-Fluff), über dem Grundthema der Insel (z. B. O-Town), nie statt ihm.

Genutzt wird das Thema im God-Mode (Panel), im Generator (G) und für Spieler-Inseln. Ein Owner, keine zweite Farbtabelle: Die alte Tabelle `PALETTES` und `palette-roles.js` (Clay Stage) werden in `ENV_ROLES` zusammengeführt (Phase B).

## 2b · Fluff-Zonen im God-Mode (perspektivisch, Georg 10.10.)

- **Baum anklicken** → er wird mit Fluff-Kügelchen gefüllt. Erst eine **bunte Mischung** als Cartoon-Akzent, bewusst auffällig, auch außerhalb der Insel-Palette, damit der Spieler erkennt: Hier gibt es Fluff. Die Wirkung der Farben bzw. die Alchemie kommt später.
- **Terrain bzw. Mine markieren** → dort kann man mit Bombe oder Schäufelchen nach Fluff graben.
- **Felder bzw. Beete** → Fluff ernten, Fluff-Möhrchen pflanzen.
- **Wasserflächen** → Fluff-Angeln (KayKit-Animationen Fishing_Cast bis Catch auf Rig_Medium_Tools sind vorhanden; Angel-Mesh fehlt).
- Speicherung als Zonen im Insel-Rezept (`nodes` bzw. `zones`, Art, Fläche bzw. Objekt-ID). Der Spielzustand (was schon geerntet ist) bleibt im Spielstand, nie im Rezept. Siehe Erinnerung „Fluff-Ernte“ und `6b` im Masterplan.
- Einordnung: nach Phase F als F+; die Datenstruktur `zones` wird in F schon vorgesehen.

## 2c · TBD später: Interaktion, Schuss, Action-Bar (Georg 11.10.)

- **Chill & Fun, Ziel-Hilfe:** Tab wechselt durch sichtbare Ziele bzw. Gegner (WoW-Logik). Angriff, Schuss bzw. Schlag per Maustaste (vermutlich rechts, zu klären) auf das Ziel. Vorlage: Combat Arena.
- **Derselbe Mechanismus für die Welt:** Fluff-Kugel vom Baum klopfen bzw. boxen oder per Blaster bzw. Gun abschießen. Je nach Waffe Übergang zur Zerstörung (Raketen-Explosion → Baum weg, kahl bzw. verkohlt). Danach zeitgesteuerte Regeneration mit Animation bzw. Übergang zum nachgewachsenen Baum, an dem wieder Fluff wächst bzw. als Fallobst fällt.
- **Action-Bar 1–6:** klein, nicht störend im Sichtfeld, für Waffenwechsel, Potions, Flugmodus usw. Nur befüllte Slots werden angezeigt. Später entsperrbar bzw. verschiebbar.
- **Doppel-Leertaste:** Flug-Modus bzw. Jetpack (WoW-Logik, schon gemessen).
- Einordnung: nach Phase F bzw. mit den Fluff-Zonen (2b). Der HUD-R3-Stil gilt.

## 2d · Mauer-Baukasten mit Skins (Georg 11.10., V-105/V-106)

Referenz: `docs/golden/candidates/prison-maze_2026-10-11/` (Gefängnis- bzw. Maze-Insel rund und eckig, Wall-Kit-Blatt).
- **Module:** gerade (2 bzw. 1 Einheit), Innen- und Außenecke, T, Kreuz, Endkappe, Tor mit Fallgitter, kaputt, Brüstung, Pfeiler, Treppe bzw. Rampe, Brücke bzw. Schwelle; Wachturm-Module; Requisiten. Festes Rastermaß.
- **Skins:** A Stein (Blatt), B Sci-Fi (später), weitere je Insel-Thema (§2). Gleiche Module, andere Haut.
- **Vorlage zuerst:** Bestand prüfen (KayKit > Tiny Treats > Quaternius > Kenney); Georg setzt die Teile im Insel-Editor (F), der Generator (G) kann Labyrinthe auslegen.
- **Nicht übernehmen:** der Inselboden der Blätter (TUNE, zu sehr drangeklebt). Inselkörper bleibt Scholle (V-015).

## 2e · Strecken-Baukasten mit Skins (Georg 11.10., V-134 … V-161)

Ein System: **Logik** (Plan, Wege-Graph, Sockel, Anker, Prüfungen) im Track Core (RKIT, privat), **Skin** (Querschnitt, Kanten, Markierung, Kappen, Palette) je Familie, **Look** im Lab. Alle Autos fahren alle Skins (V-152). Leitprinzip chill & fun Assist (V-151).
- **Skins:** race (J17, V-102) · town (gemauerter Bord + Gehweg, Lauf 03) · country (Landstraße, HIGHWAY dazu) · dirt (Schotter, Berm ≤ 35°) · trail (Geh-Netz, nur Fuß, Netz gehört dem Lab-Layout V-155) · cosmic (Neon-Vibe V-163, reserviert) · später rail/coaster.
- **Track Core 0.16.9 (Stand 11.10.):** Kreisel/Kreuzung mit node.skin, Arme erben Familie, Prüfgrenze Welt 1,705 (V-143/V-153), EXIT/ENTRY auf RACE, LEVEL_RAMP ≤ 8 %, Wendeschleife (1-Arm-Kreisel + turntable-Anker), Markierungen als Daten (Pfeile nur EXIT/ENTRY/FORK/JOIN/Kreisel-Aus, Scheitel-Kerb R ≤ 45), Kanten-Enden mit Kappenform, Übergänge mit Skin-Paar, q.edge Banden-Übergang ≥ 8 m, DIRT D1–D4, trail-Bibliothek mit gemessenen Gangwerten (Treppe 0,30/1,3 nach Walker, V-160; Trittsteine nach jog-Schritt, V-157; Pfade ≤ 12 %, V-158), Poller.
- **Katalog:** Georgs Blätter RK2, TD1–TD5, CS1–CS3, CR1–CR4 (replies/REFS_*), RKIT-Abgleich `RKIT_CATALOG_TD_R1.md`, Look-Spezifikation WSA R1/R2, Antworten V-150/V-154.
- **Abschlüsse:** alle Schnittflächen gerundet in Claymation-Form, ggf. Rubble (V-168).
- **Tunnel:** O1-Bohrung bzw. Feld-Tunnel + TC1-Portale/Innenausbau 1:1, Profil arch|rect getrennt vom Look (V-130 PASS); Tunnel-Berge echt modelliert, mindestens L (offen).
  - 12.10.: „Tunnel-Berge mindestens L“ ist mit V-174 (5) entschieden.

## 2f · Inselkörper und Referenz-Bibliothek (Georg 11.10.)

- **Inselkörper:** zusammenhängende Erdmasse, Fels als Teil der Masse, Moos über der Kante, dünne Wurzeln ok, nie aufgesetzte Felskugeln, ein geschlossenes Mesh (V-106, V-136, V-142, V-152). Prozedural bisher 5–6/10 (V-162). **Modelliert Blender** nach Georgs Referenzen (V-167 Coconino-Mesas R4 vor R3 Inselboden); das Lab setzt Strecke und Tunnel ein.
- **Themen-Inseln (Referenzen, Stil-Richtung):** Gefängnis-Maze + Mauer-Baukasten (V-105), Dystopia-Vulkan (V-108), Protopia-Farm + Maker Space (V-110), Organe → MED-Welten (V-111, im MVP Platzhalter V-127), Mesa/Coconino (V-164/V-167), Cosmic Highway (V-163), Antike mit Steinbrücken (V-165).
- **Bilder prüfen, nicht erfinden (V-148); use what works (V-140).**

## 2g · Klang und Fahrgefühl (V-128 … V-137)

J17-Motor, Jingles, Kontakt-Engine, Kenney-CC0, Knet-Partikel, Tunnel-Hall; Radio beim Fahren = Georgs Suno RoadTrip JukeBox, zu Fuß Insel-Bett/Cozy; RollerCoaster-Drone-Bett später (V-131).

## 2h · Strecken-Skins: Rhythmus, Billboards, Freiraum (Georg 11./12.10., V-172 … V-176, V-185)

- **Rhythmus-Elemente** an der Strecke für Tempogefühl, je Skin im passenden Stil [V-172]. Abstand = Zielgeschwindigkeit × Δt (Style Guide §6b).
- **Billboards** quer über der Strecke nur an ruhigen Stellen und als Insel-Eingangsschilder [V-173]. Über der Fahrbahn nur Deck-Cover + kurzer Titel; volle Zitat-Sequenz nur an Billboards mit Halt [V-175 (4)].
- **Bandenfarben** im Lab auf J17 vereinheitlicht, Rot-Weiß nur für Kerbs [V-174 (1)]. Mesa-Strecke als Landstraßen-Variante (grau + rot-weißer Kerb) [V-174 (2)]. Cosmic: Glow-Kanten als Standard, voller Neon nur auf Cosmic-Inseln [V-174 (3)]. J17 bleibt Licht-Maßstab [V-174 (4)].
- **Messen statt schätzen:** Zielgeschwindigkeit je Zone bei normalen k2b-Testfahrten mitloggen; Δt-Vorschlag zuerst als Race-Testfahrt in drei Stufen [V-175 (1)(2)].
- **Freiraum (korrigiert):** Durchfahrtshöhe für Billboards, Schilderbrücken, Tunnel- und Dungeon-Decken = max(5,8 lab, Lab-Kamera-Maximum + 0,5), vorläufig ≈ 9,0 lab; Endwert misst die Bau-Sitzung [V-185, korrigiert V-175 (3)]. Alle Freiraum-Angaben mit Einheit (lab bzw. TC-m).
- **Modelle:** WSA-Inventur abgenommen; erste Kandidaten Tiny Treats `street_lantern`, KayKit `streetlight`, `post_lantern`, `torch`/`torch_lit`, `arch_gate`, Kenney `sign-highway` als Form, RKIT-Poller (replies/STEERING_REPLY_WSA_RHYTHM_R1.md). Leitpfosten und Cosmic-Pylonen nicht gefunden → später RKIT-Knete [V-175 (5)].
- **Referenz:** KFB Akashic Library AK1–AK4 für Stil und Strecken-Integration, keine Bauvorlage [V-176].

## 2i · Banden-Enden und Audit-Reihenfolge (V-166, V-168, V-171, V-178, V-183)

- **Standardansicht** zeigt nur den letzten geprüften Stand; Arbeit hinter URL-Schalter [V-166].
- **Banden-Enden C4c v2 PASS:** geschlossene Knet-Köpfe, Strang je Seite, offene Kanten 0/0 [V-183, V-168]. Großes konzeptionelles TUNE später.
- **Audit-Reihenfolge** [V-171]: 1 Bandenenden ✓ → 2 Flacker-Paket → 3 Insel-Cache (warm ≤ 5 s) → 4 Speicher → 5 private Vendors entkoppeln → 6 deterministische Tests → 7 lokales Git + Vendor-Prüfskript. Aufteilung main.ts mit Phase E. Abnahme je Punkt laut replies/AUDIT_ARCH_R1.md §7.
- **WSA-Gegenprüfung** des Audits erst nach Punkt 1–3, nur mit Branch-Link und Fragen [V-178].

## 2j · Motion und Animation (V-177, V-179 … V-181, V-186, V-187)

- **Leitfaden:** `30_DECISIONS/MOTION_GUIDE_R1.md` v0.2. Bestand zuerst, dann Konzept, Demos nur mit Georgs Okay [V-177].
- **Regeln:** Squash an Figuren ≤ 8 %, volumenerhaltend [V-179 (1)]; Stürze kurz stärker, Grenze am Demo [V-180]. Emanata als Knet-Plättchen. Brauen (brow-rig.v2) jetzt ins Lab, Mund später. Mixamo-Clips auf KayKit nutzen. Flug: 400-ms-Fenster für die zweite Leertaste [V-179].
- **Kulturmechaniken** (Geschenke, Tanz, Debatte, Rauferei, Brick-Fish, Kayfabulieren, Fluff, Lesen) sind die Acting-Anlässe; Details nur von Georg bzw. aus Konzepten [V-181].
- **Clip-Katalog R1** (WSO/Fable02, replies/WSO_CLIP_CATALOG_R1.md): 290 Clips gemessen, Top 20 fürs MVP, 17 davon im Lab, 3 aus der Motion Library nachladen. Lücken: Flug, Beifahrer, Sprech-Clip, Geschenke, Kayfabulieren, Paar-Tanz, Lesen.
- **KFB Motion Library 01** als Ganzes abgenommen (24.09.) [V-186].
- **NPC Performance Proof R1** (TBD): ein Resident, 8-s-Performance, seek(t)-reproduzierbar, Kontaktbögen [V-187].
- Offen: Strafe-Clips vorhanden vs. V-022.

## 2k · Dungeon-Strecke (Idee Georg 12.10., V-182)

- Strecke durch KayKit-Dungeon-Gänge, 2–n Etagen nach Parkhaus-Logik, Fackeln, Truhen, Gitterfenster [V-182, TBD].
- **Machbarkeit:** JA MIT UMBAU (replies/DUNGEON_TRACK_FEASIBILITY_R1.md). Kit-Faktor bleibt K2 × 1,6; Gänge 3 Zellen = 17,6 lab; Wände 2 Module = 12,8 lab; Etage 12,8 lab; Rampe ≤ 8 %. Lücken: runde Innenecken, Rampen-/Spindelraum, breites Portal, Dungeon-Skin im Core, Deckenlicht. Decken-Freiraum nach V-185.
- **POC:** eigene Sitzung, `~/Developer/kfb-dungeon-poc`, Port 5194, Lab nur gelesen. Schritt 1 Maß-Gang läuft; Schritte 2–5 laut Machbarkeit §6.
- Später: Kamera-Absenkung in niedrigen Räumen als eigenes Modul [V-170].

## 2l · Prozess-Regeln 12.10. (V-184)

- Lizenz und öffentlich/privat sind geklärt. Keine Lizenz- bzw. Public-Floskeln in Briefs, Berichten, Antworten. Nur ein neuer, ungeklärter Fall, in einer Zeile [V-184].
- Freiraum- und Maßangaben immer mit Einheit [V-185].

## 3 · Offen bei Georg

- Stand 12.10.: Banden-Live-FAIL ist geschlossen [V-183]; Laden und Flackern = V-171 Punkte 2–3. Tunnel-Berge ≥ L entschieden [V-174 (5)]. Cozy Tunes: Weg entschieden [V-087]. Neu offen: Strafe-Clips vs. V-022 (Clip-Katalog §7); Dungeon-Fragen (Strecken-Klasse RACE oder Welt, Dungeon in einer Insel oder frei; Machbarkeit §7); Track Core v0.12 öffentlich auf main (REVIEW_STEUERUNG_R1 Nr. 8); Lichtvergleich J17-Tag/E50 (Urteil nach Bildern).
- Stand 11.10. abends: Haltebucht nach Nachbesserung (PASS/TUNE/FAIL); Tunnel-Berge mindestens L; Live-Befunde Banden FAIL, Laden 40–60 s, Flackern (in Arbeit, V-166).

- 10 Fragen aus `BASELINE_ACCEPTED_R1.md` §2; die Empfehlungen gelten, bis Georg anders entscheidet.
- Cozy Tunes (Pizza Doggy) liegen öffentlich auf GitHub ohne Lizenzdatei: Lizenz klären, gegebenenfalls ins private Repo.
- Screenshots der 8 gekauften Inseln privat an WSA: ja oder nein.

## 4 · Auf Eis

R2D- bzw. Scholle-Eigenbau als Insel-Gestaltung (bleibt nur als Grundkörper-Option), Fels-Bausatz-Runden, Steinbogen-Brücke, Claude Design (3D), WSA-Treppen-Test, Cabrio (post-MVP).

## 5 · Nächste Slices (Stand 12.10.)

Reihenfolge = Priorität. **Lab 5192** = braucht den geteilten Lab-Dev-Server, nur eine Sitzung zur Zeit, Arbeit hinter URL-Schalter [V-166]. **Parallel** = ohne Lab-Server, darf neben den Lab-Slices laufen. Höchstens zwei Bau-Baustellen gleichzeitig [V-005].

| # | Slice | Besitzer | Voraussetzung | Abnahme | V | Server |
| --- | --- | --- | --- | --- | --- | --- |
| S1 | C4c-Folgen: Auto in die Haltebucht (lat ≈ 8,2), Randlinie dort unterbrochen, Zebra 3 Balken, Spalt bis zur Nase gefüllt; dann C4c als Standardansicht | Bau-Sitzung | läuft | Parity PASS, offene Kanten 0/0, Fuß- und Fahrtest ≥ 50 fps, Standbild Bucht | V-183, V-166, V-159 | Lab 5192 |
| S2 | Flacker-Paket (dynres, LOD-Hysterese, Rippe nur nah, near/polygonOffset); begonnen hinter `?flk=1` | Bau-Sitzung | S1 | Flicker-Probe DPR 2 + CPU-Drossel × 4: kein Bildpaar über 0,5 % (Audit §7 #2) | V-171 (2) | Lab 5192 |
| S3 | Insel-Cache: fertige Körper nach dem Boolean cachen, Lab-Inseln im Organ-Modus nicht bauen | Bau-Sitzung | S2 | kalt ≤ 15 s, warm ≤ 5 s bei `?hub=1&play=game`, Parity unverändert (Audit §7 #1) | V-171 (3) | Lab 5192 |
| S4 | WSA-Gegenprüfung des Audits am reparierten Stand | WSA (Steuerung schickt Branch-Link + Fragen) | S1–S3, Code-Schnappschuss auf GitHub | WSA-Gegenprüfung R1, ohne Schlussfolgerungen der Steuerung | V-178 | Parallel |
| S5 | Speicher: manifold `delete()`, heroCache leeren, Debug-Felder nur mit `?debug=1`, Pro-Bild-Allokationen raus | Bau-Sitzung | S3 | JS- und WASM-Heap vorher/nachher gemessen (Audit §7 #7) | V-171 (4) | Lab 5192 |
| S6 | Private Vendors entkoppeln → deterministische Tests (`fixedDt`, Sim-Zeit) → lokales Git + Vendor-Prüfskript | Bau-Sitzung | S5 | Klon ohne `vendor/private` startet; dreimal gleiches Testergebnis mit CPU × 4; Diff je Lieferung (Audit §7 #5, #6, #8) | V-171 (5–7) | Lab 5192 |
| S7 | Lichtvergleich J17-Tag / E50 über den vorhandenen Adapter, hinter URL-Schalter | Bau-Sitzung | frei ab S2 (replies/STEERING_REPLY_WSA_C_R1.md); Grundlage WSA_LIGHT_STUDY_C_R1 | 3 Standbilder gleiche Kamera, Exposure 1 (Abend bisher, E50, J17-Tag) + Tunnel-Durchgang; Georg PASS/TUNE/FAIL | V-050, V-174 (4) | Lab 5192 |
| S8 | Rhythmus-Paket: Lab-Kamera-Maximum messen (Endwert Durchfahrtshöhe), Zieltempo je Zone loggen, Δt-Serie Race; danach Laternen, Fackeln, Eingangstor, Schilderbrücke und Billboards setzen | Bau-Sitzung | S3; Modell-Auswahl aus STEERING_REPLY_WSA_RHYTHM_R1 | Messwert in lab; Standbild-Serie 3 Δt-Stufen; Fahrt-Standbilder je Skin; K2-Höhenprüfung | V-172, V-173, V-175, V-185 | Lab 5192 |
| S9 | Motion ins Lab: 3 Motion-Library-Clips nachladen (Clip-Katalog Top 20), Brauen brow-rig.v2; Strafe-Clips nur nach Georgs Antwort zu V-022 | Bau-Sitzung | V-171 Punkte 1–3 (S1–S3) | Parity PASS, Kontaktbogen je Clip, Eye-Rig unbeschädigt | V-179, V-186, V-022 | Lab 5192 |
| S10 | Blender R4 Coconino-Mesas M01–M03, dann Insel J1; danach R3 Inselboden | Blender-Coworker (eigener Branch) | Brief R4; ≥ 40 GB frei, headless + Watchdog | Blatt M01–M03 gegen CC1, dann J1 gegen CC2; ein geschlossenes Mesh | V-167, V-142, V-136, V-006 | Parallel |
| S11 | Dungeon-POC Schritt 2: Labyrinth aus WhackMan-Rezept über Adapter auf 3 × 3 MC | Dungeon-POC-Agent (Port 5194) | Schritt 1 Maß-Gang mit Standbild S1; Georgs Antwort zur Strecken-Klasse (Machbarkeit §7 Frage 2) | Standbild S2 Draufsicht mit Fahrlinie; Prüfungen ≥ 50 fps | V-182, V-185 | Parallel |
| S12 | NPC Performance Proof: Folge-Schritt nach Georgs Urteil zu R1 | Motion-Agent | R1 geliefert und beurteilt | seek(t)-reproduzierbar, Kontaktbögen, Fußkontakt, EyeRig/PetMouth unbeschädigt | V-187, V-177 | Parallel (eigener Port, nicht 5180/5192) |

**Danach (Warteschlange, ohne Reihenfolge):** Weltraum-Himmel [V-132] · RollerCoaster-Drone-Bett [V-131] · Kamera-Absenkung in niedrigen Räumen, zusammen mit Dungeon bzw. Minen-Tunnel [V-170] · Leitpfosten und Cosmic-Pylonen als RKIT-Knete (RKIT pausiert) [V-175 (5)] · C2 Brücke Track Core → v5 · C5 · Aufteilung main.ts mit Phase E [V-171].

**Offene Fragen zur Reihenfolge:**
- S7 und S8 sind freigegeben „nach Banden und Flackern“ bzw. nach Bestandssuche. Ob sie vor S5/S6 vorgezogen werden, entscheidet Georg bzw. die Steuerung; V-171 nennt nur die Technik-Reihenfolge.
- S4 braucht einen frischen Lab-Code-Schnappschuss auf GitHub (zuletzt `sync/lab-snapshot-2026-10-11`).
