# GIZMO_MAZE_RECOVERY_R1 · Gefängnis-Labyrinth, Gizmo-Wände, Generator, Comic-Vorlage

Stand 2026-10-15 · WS0 · Recherche (nur gelesen, nichts gebaut).
Kennzeichnung: **[QUELLE]** = steht so in einer Datei (Fundort angegeben) · **[GEORG 15.10.]** = Georgs Erinnerung von heute (Sprachnotiz) · **[OFFEN]** = nicht belegt oder Vermutung.

Abkürzungen für Fundorte:
- **PLAN** = Repo `georg-doc/kayfabizarro`, Branch `planning/kfb-fluff-crafting-almanac-ideation-2026-10-09` @ `b75faea9`, Ordner `skills/chat/`. Lokale 1:1-Kopien: `KFB_HUB/30_DECISIONS/replies/CONCEPTS_FLUFF_MINIGAMES_R1/source/`.
- **GREY** = Branch `blender-mcp/prison-maze-greybox-2026-10-10` @ `bb3e4d9e`, Ordner `skills/chat/workflows/KFB_PRISON_MAZE_GREYBOX_2026-10-10/`. Lokale Kopie: `Frizzlebob fractal almanac BRIEFING anchor v2/3D TableDiorama KFB + PET Editor + PDF VIewer/3D ASSETS/BLENDER MCP/PRISON_MAZE_GREYBOX_2026-10-10/`.
- **LAB** = „KFB Frankensteining Lab“, Repo `main` @ `af5ebf2e` (angelegt 05.09.), Pfad `skills/KFB Setup Game Design/KFB_Frankensteining_Lab (1).html`, Abschnitt **10b · Torus-Welten**. Gleiche Datei lokal: `~/Dropbox/CLAUDE/KFB Setup Game Design/KFB_Frankensteining_Lab (1).html` (03.09.); ältere Fassung `KFB Travel Globe/Franksteining Lab - TravelGlobe - Export/KFB_Frankensteining_Lab.html` (29.08.).
- **REG** = `KFB_HUB/30_DECISIONS/DECISIONS.md`.

---

## Kurzbefund

- Ein **eigenes Gizmo-Konzept** (YouTube-Tutorials, Gizmos zum prozeduralen Weltenbau) steht **in keiner Datei**. Das Wort „Gizmo“ steht im Zusammenhang mit dem Labyrinth nur in **V-300**, und V-300 wurde heute nach Georgs Angabe eingetragen. Sonst gibt es „Gizmo“ nur als Editor-Werkzeug (Verschiebe- und Dreh-Griff, `edit-layer.js`, „Papier-Gizmo“). [QUELLE] REG V-300; Dropbox-weite Suche.
- **Inhaltlich** ist fast alles andere da: Mauern wachsen aus dem Gelände, der Zinnsoldat drückt den Knopf, der Generator ist rund und eckig (Incompetech, CC0), die Krazy-Kat-Begründung und der Labyrinth-Gefängnisplanet von **Franquin**.
- „Frank K.“ ist laut Quelle sehr wahrscheinlich **Franquin**, nicht Kafka. Kafka steht nur als Stil-Etikett („kafkaesk“) in den Quellen.

---

## 1. Was die Gizmo-Idee genau ist (wie geschrieben)

- [GEORG 15.10.] Die Gizmo-Idee kommt aus YouTube-Tutorials, in denen man mit Gizmos prozedurale Welten baut. Die Mauern sind Gizmos.
- [QUELLE] REG V-300 (15.10., TBD): „Georg baut eine Gefängniszelle als Panoptikum; sie soll mit der Maze-Idee, dem Labyrinth-Generator und Gizmo-Wänden zusammen genutzt werden (Anschluss an V-105/V-120 Gefängnis-Labyrinth und Konzepte v0.8/v0.9). Der Gizmo-Gedanke bleibt Teil der Planung.“
- [QUELLE] REG V-209 (14.10.), Punkt 4: „Worldbuilding-Ansatz: prozedural sauber und für Georg als Worldbuilder/God-Mode nutzbar“. Das ist der nächste schriftliche Anker für „prozedurale Welt mit Werkzeugen“, nennt aber keine Gizmos.
- [OFFEN] Kein YouTube-Link, kein Tutorial-Name, kein Werkzeug (z. B. Blender Geometry Nodes, Unity-Gizmos, Houdini) ist irgendwo notiert. Ebenfalls offen: Ist ein Gizmo hier der Editor-Griff, an dem Georg eine Mauer aus dem Boden zieht, oder ein platzierbarer Generator-Baustein (Spline bzw. Volumen, das Gelände formt)?
- [QUELLE] Ohne Bezug zum Labyrinth gibt es „Gizmo“ nur als Editor-Griff. `KFB WorldBuilder Claude Design/START_CLAUDE_DESIGN_WORLDBUILDER_V1.md`: „Never add a second picker or second transform gizmo.“ `replies/WORLDBUILDER_MODULE_MAP_R1.md`: „Platzieren + Gizmo + Undo“ (V-081) und „Welt-Layout und Anordnungs-Gizmo (Phase D)“.

## 2. Labyrinth-Generator (rund und eckig, gemeinfrei)

- [QUELLE] PLAN `KFB_PRISON_MAZE_FLOATING_ISLAND_TERRAIN_TOWER_V0_9_2026-10-10.md` (Commit `2b81e9fec`), Abschnitt „Maze algorithm donor“:
  - „Kevin MacLeod / Incompetech Maze Generator: https://incompetech.com/gallimaufry/incompetech-maze.html“
  - „Page describes CC0 downloadable utility; Prim, Kruskal, Wilson, Recursive Backtracker.“
- **Name:** Incompetech Maze Generator. **Autor:** Kevin MacLeod. **Lizenz laut Seite:** CC0. **URL:** siehe oben.
- [QUELLE] Vorbehalt in derselben Datei: Übernahme erst nach Prüfung des Download-Codes und der Lizenz. Die Abbildung auf Ring- bzw. Polar-Graphen ist ein eigener Schritt.
- [QUELLE] PLAN `KFB_BLENDER_MCP_PRISON_MAZE_GREYBOX_HANDOVER_2026-10-10.md` wiederholt den Vorbehalt: „recorded URL/CC0 is not proof of integrated script“.
- [QUELLE] Tatsächlich gebaut wurde ein **eigener** Generator, nicht Incompetech: GREY `RETURN_PRISON_B_PORT_MAZE.md`, „Perfect mazes (recursive backtracker …), seeded, repeatable“, Datei `kfb_prison_maze_graph.py`, quadratisch und polar (Ringe und Speichen), je Seed 1–3.
- [QUELLE] Zweiter, älterer Generator-Bezug im LAB: `ctx-o1/toroidal-maze` („keine Lizenz, also Vollschutz … Kein Code“). Das Verfahren nach Jamis Buck gilt dort als frei.
- [OFFEN] Ob der Incompetech-Code je heruntergeladen und geprüft wurde, ist nicht belegt. Ob „rund“ bei Incompetech wirklich ein Kreis-Labyrinth ist, steht nicht in den Quellen (Georg erinnert es so).

## 3. Mauern = hochgezogenes Gelände mit Mauertextur

- [GEORG 15.10.] Die Mauern sind einfach hochgezogenes Terrain, das eine Mauertextur bekommt.
- [QUELLE] PLAN v0.9: „old walls descend and new walls grow from terrain“. In der Drei-Schichten-Hypothese steht: „Maze walls and cell/fence inserts: terrain-colored raised/extruded ribbons or sectors with seams/clay bevels; graph topology determines openings“. Außerdem: „visibly raise/lower ground-derived walls“.
- [QUELLE] PLAN v0.9 grenzt ab: „Do not silently flatten the whole island or require square Dungeon-wall modules.“
- [QUELLE] PLAN Return `KFB_FLUFF_CRAFTING_ALMANAC_LAYER_RETURN_2026-10-09.md` (Zeile 282 @ `b75faea9`): „stable underside/support + mutable upper terrain + topology-driven raised-ground walls“, „explicitly a hypothesis, not acceptance“.
- [QUELLE] GREY Schritt B: Die Mauern sind eigene Meshes, die dem Gelände folgen (Raycast alle 0,35 m), 1,6 m hoch und 0,35 m eingesenkt. Material: Erd-Seiten mit Gras-Deckel (sieht aus wie hochgezogener Boden).
- [QUELLE] GREY Schritt C: „Brick walls“ mit UV entlang der Mauer und prozeduralem Ziegel ohne Verzerrung. Die Erd-Variante bleibt als `style='earth'` erhalten. Das kommt Georgs Bild „Gelände plus Mauertextur“ am nächsten.
- [QUELLE] Becken bzw. Hügel ist ein Shape-Key-Regler (`BASIN_DEPTH_2m5`): dasselbe Labyrinth auf Kessel oder Hügel.

## 4. Zinnsoldat am Schaltpult: Umbau per Knopfdruck

- [GEORG 15.10.] Ein Zinnsoldat kann das Labyrinth am Schaltpult per Knopfdruck umbauen. Die Insassen stecken in einem sisyphoshaften, kafkaesken, Krazy-Kat-artigen Gefängniszustand.
- [QUELLE] PLAN v0.9: „Non-negotiable creative intent of this concept: a living, visibly reconfigurable maze, controlled by a Toy Soldier button from the tower, not a static procedural layout.“
- [QUELLE] Ablauf laut PLAN v0.9: Knopf → Seed → nächster Graph → Prüfung → sichtbares Heben und Senken der Mauern → Wegfindung aktualisieren → Reaktion der Insassen → Zustand speichern.
- [QUELLE] PLAN Return Zeile 260: „No.1 = Chief Warden operates red Maze-reconfigure button from tower console“. Dazu kobaltblaue Uniform, weißer Federbusch, Nummer am Hut.
- [QUELLE] PLAN `KFB_PRISON_MAZE_SOURCE_OWNER_AUDIT_AND_CLAUDE_DESIGN_BRIEF_V1_1_2026-10-10.md`: „large red reconfigure button, theatrical button press and immediate visible maze morphing“.
- [QUELLE] Sisyphos-Motiv, PLAN-Handover: „dramatic almost-escape and tower-button reset“. PLAN v0.9: „Sisyphus-Ariadne-Minos motifs“.
- [QUELLE] Krazy-Kat-Begründung im LAB (Ahnenreihe): „In Coconino County wechselt die Landschaft zwischen zwei Panels derselben Szene, ohne Erklärung. Ein Labyrinth, dessen Wände sich neu erzeugen, ist genau das, nur prozedural.“
- [QUELLE] Umbau-Beweis als Bild: GREY `B_RECONFIG_BOARD.png`, drei Seeds je Layout, gleiche Insel, gleicher Hof und gleiches Tor. Die Animation des Umbaus ist nicht gebaut.
- [QUELLE] Kafka steht nur als Ton-Etikett („Kafkaesque Prison escort procession“, „kafkaesque institution“). Ein Verweis auf ein Kafka-Werk kommt nicht vor.

## 5. Rennstrecke als Gizmo

- [GEORG 15.10.] Die Rennstrecke war ebenfalls als Gizmo gedacht.
- [QUELLE] Zur Rennstrecke gibt es am Gefängnis nur einen **Anschluss-Sockel**. GREY `RETURN_PRISON_C_ISLAND.md`: „the racetrack attaching at the far end“, `SOCKET_bridge_end_main`. REG V-121: „Brücken-Sockel durch Track-Core-ENTRY ersetzen“.
- **Nicht gefunden:** „Rennstrecke als Gizmo“ bzw. „Strecke formt Gelände“ als Idee ist in keiner Datei belegt.
- [QUELLE] Verwandt: V-167 (Coconino) „J17-Track ins Gelände eingebettet, keine Pfeiler“. V-290: „Rampen setzt Georg oder modelliert sie aus dem Terrain“.
- [OFFEN] Die Gizmo-Strecke ist bisher nur Georgs Erinnerung.

## 6. Comic-Vorlage („Frank K.“)

- [GEORG 15.10.] Ein dunkler „Gedanken-Comic“ von „Frank K.“: Ein Sträfling wird auf einem Planeten abgesetzt, der ein einziges riesiges Labyrinth ist.
- [QUELLE] LAB, Abschnitt 10b, Tabelle „Ahnenreihe, genau“: „**Franquin** · Der Labyrinth-Gefängnisplanet. Passt ohne Zwang nach innen, wo die Geometrie ohnehin enger wird.“ Am selben Ort: „Ein Labyrinth-Gefängnis gehört dann selbstverständlich nach innen, wo die Gänge sich drängen.“
- **Identifikation:** „Frank K.“ ist sehr wahrscheinlich **André Franquin**, der Zeichner von Gaston und Spirou. „Franquin“ wurde vermutlich als „Frank K.“ transkribiert. Kafka ist es laut Quelle nicht.
- [OFFEN] Der **Titel** steht nirgends. Plausible Vermutung, nicht belegt: ein Strip aus Franquins schwarzhumoriger Reihe *Idées noires* (deutsch „Schwarze Gedanken“). Das würde Georgs Wort „Gedanken-Comic“ erklären. Das muss Georg oder eine Recherche bestätigen.
- [QUELLE] Georg kennt Franquin gut. `gvw/VaultGvW/audio/youtube_channel_index.md` listet eigene Franquin-Fan-Art-Videos (2016).

## 7. Zugehörige Entscheidungen (V-Nummern)

| V | Datum | Status | Inhalt (kurz) |
|---|---|---|---|
| V-105 | 11.10. | RULE | Gefängnis- bzw. Maze-Insel rund und eckig plus **Wall-Kit-Blatt**: modularer Mauer-Baukasten mit Skins. Quelle: `docs/golden/candidates/prison-maze_2026-10-11/`, im Repo auf Branch `docs/kfb-decisions-register-2026-10-11` unter `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/lab-docs/golden/prison-maze_2026-10-11/` (P1 rund, P2 eckig, P3 Wall-Kit). |
| V-106 | 11.10. | TUNE | Unterseite der Gefängnis-Blätter angeklebt. Der Inselkörper folgt der Scholle (V-015). |
| V-108 | 11.10. | RULE | Dystopia-Skin des Mauer-Baukastens. |
| V-120 | 11.10. | RULE | (c) Gefängnis-Labyrinth: Standardmauern 1,6 m plus höhere Zellenmodule. |
| V-121 | 11.10. | TBD | Gefängnis-Greybox erst nach MVP-1 ins Lab (K2, Track-Core-ENTRY). |
| V-209 | 14.10. | RULE | Kein Racetrack nötig. Worldbuilding prozedural und für God-Mode nutzbar. |
| V-290 | 15.10. | RULE | Kein Racetrack als Voraussetzung. Rampen aus dem Terrain. |
| V-300 | 15.10. | TBD | Panoptikum-Zelle plus Labyrinth-Generator plus **Gizmo-Wände**: ein Strang. |

[QUELLE] Weitere Bezüge ohne V-Nummer: v0.8 (Gefängnis-Insel, `7b32e0dce`), v0.9 (`2b81e9fec`), Turm-Donor-Priorität v1.0 (Kenney Tower Defense → Pirate → KayKit Hexagon), Quellen-Audit v1.1, Blender-Handover und Greybox A/B/C.

## 8. Widersprüche

1. **Bauweise der Mauern.** V-105 legt einen modularen Mauer-Baukasten fest (gerade, Ecke, T, Kreuz, Tor …, mit Rastermaß und Skins). v0.9 und Georg 15.10. wollen Mauern aus hochgezogenem Gelände; v0.9 sagt ausdrücklich „not require square Dungeon-wall modules“. Beides ist vereinbar (Gelände-Mauer als Form, Kit-Teile nur für Tor, Turm und Pfeiler), muss aber entschieden werden. [OFFEN]
2. **Generator.** Notiert ist Incompetech (CC0). Gebaut wurde ein eigenes Backtracker-Skript. Im LAB steht dagegen `toroidal-maze` (ohne Lizenz) bzw. das Verfahren nach Jamis Buck.
3. **Greybox-Mauern** sind eigene Meshes auf dem Gelände, nicht das Gelände selbst. Georgs Bild ist Gelände, das hochgezogen wird.
4. **Rennstrecke.** Greybox und V-121 sehen einen Strecken-Anschluss am Gefängnis vor. V-209 und V-290 sagen „kein Racetrack nötig“. Die „Gizmo-Strecke“ ist nicht beschrieben.
5. **Ausweglosigkeit.** Das LAB sagt: „Labyrinth darf kein Tor sein“, Sackgassen sind Türen, Fliegen ignoriert die Wand. Das Gefängnis-Konzept will einen sisyphoshaften Zustand. v0.9 löst das so: Insassen-Schleife ja, für den Spieler „avoid automatic unwinnable player loops“ und freiwilliger Einstieg.
6. **Besetzung.** In v0.8 ist der Black Knight der Insasse. In v0.9 sind es Frost-Orks, und der Black Knight bleibt Leibwächter.
7. **Inselkörper.** v0.9 und die Greybox nutzen eine Port-Insel mit „torn wedge underside“. V-106 verlangt das Schollen-Design (V-015).

## 9. Was fehlt

- Ein schriftliches Gizmo-Konzept: Quelle (YouTube-Tutorial, Kanal, Werkzeug), Definition des Gizmos und Zusammenspiel mit dem God-Mode-Editor. [OFFEN]
- Rennstrecke als Gizmo: nichts geschrieben. [OFFEN]
- Titel und Band des Franquin-Comics; Bestätigung, dass „Frank K.“ = Franquin. [OFFEN]
- Prüfung des Incompetech-Codes (Download, Lizenz, Ausgabeformat, wirklich rund?). [OFFEN]
- Eine Animation des Umbaus (Mauern senken bzw. heben) und ein Knopf-Pult. Bisher gibt es nur Standbilder mit drei Seeds. [QUELLE] GREY
- Georgs Panoptikum-Zelle (V-300): „folgt von Georg“. Noch nicht eingegangen. [QUELLE] REG V-300
- Georgs Wahl aus Greybox B und C (Mauerhöhe niedrig oder hoch, rund oder eckig, Kessel oder Hügel, Turmfarbe). In den gelesenen Dateien steht keine Entscheidung. [OFFEN]

## Durchsucht

- Repo: PLAN, GREY, `docs/kfb-decisions-register-2026-10-11`, `recovery/kfb-minigames-fluff-source-bridge-2026-10-15`, `main` (Markdown unter `skills/` und `docs/`) sowie geänderte Textdateien auf 97 Branches `planning/*`, `research/*`, `wsa/*`, `design/*`, `data/*` und `chatgpt-web/*` (procedural/terrain/world-kernel/toolbox).
- Dropbox `~/Dropbox/CLAUDE/` (ohne `KFB Open World/`), das Greybox-Verzeichnis, die Hub-Register und `replies/`.
- Claude-Code-Sitzungen (Volltextsuche) und Notion: kein Treffer zu Gizmo bzw. Labyrinth.
