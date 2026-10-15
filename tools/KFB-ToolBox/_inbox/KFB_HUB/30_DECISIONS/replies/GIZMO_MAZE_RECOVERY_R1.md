# GIZMO_MAZE_RECOVERY_R1 · Gefängnis-Labyrinth, Gizmo-Wände, Generator, Comic-Vorlage

Stand 2026-10-15 · WS0 · Recherche (nur gelesen, nichts gebaut).
Kennzeichnung: **[QUELLE]** = steht so in einer Datei (Fundort angegeben) · **[GEORG 15.10.]** = Georgs Erinnerung von heute (Sprachnotiz) · **[OFFEN]** = nicht belegt oder Vermutung.

Abkürzungen für Fundorte:
- **GIZ-T** = Repo `georg-doc/KFB-Stunt-Car-Race` (privat), Branch `planning/track-gizmo-pilot-2026-10-12` @ `1d68ae80`, Draft-PR #43, Ordner `ChatGPT_web/track-lab/gizmo-pilot-01/`. Dateien: `TRACK_GIZMO_PILOT_PLAN_2026-10-12.md`, `RETURN.md`, `CHANGELOG.md`, `TEST_MATRIX.json`.
- **GIZ-S** = Repo `georg-doc/kayfabizarro`, Branch `planning/kfb-skin-stack-nature-intake-2026-10-12` @ `e7c8c31b`, Ordner `skills/chat/research/`. Dateien: `KFB_SKIN_STACK_WALL_TRACK_NATURE_V0_1_2026-10-12.md`, `…_RETURN_…`, `…_CHANGELOG_…`.
- **PLAN** = Branch `planning/kfb-fluff-crafting-almanac-ideation-2026-10-09` @ `b75faea9`, Ordner `skills/chat/`. Lokale 1:1-Kopien: `KFB_HUB/30_DECISIONS/replies/CONCEPTS_FLUFF_MINIGAMES_R1/source/`.
- **GREY** = Branch `blender-mcp/prison-maze-greybox-2026-10-10` @ `bb3e4d9e`, Ordner `skills/chat/workflows/KFB_PRISON_MAZE_GREYBOX_2026-10-10/`. Lokale Kopie: `…/3D ASSETS/BLENDER MCP/PRISON_MAZE_GREYBOX_2026-10-10/`.
- **LAB** = „KFB Frankensteining Lab“, `main` @ `af5ebf2e` (05.09.), Pfad `skills/KFB Setup Game Design/KFB_Frankensteining_Lab (1).html`, Abschnitt **10b · Torus-Welten**. Lokal: `~/Dropbox/CLAUDE/KFB Setup Game Design/KFB_Frankensteining_Lab (1).html` (03.09.).
- **REG** = `KFB_HUB/30_DECISIONS/DECISIONS.md`.

---

## Kurzbefund

- **Die Gizmo-Idee ist gefunden.** Am **12.10.** gab es eine Planungsrunde (Web-Chat, im Repo als `ChatGPT_web` abgelegt) über **Blender-Geometry-Nodes-Gizmos** für drei Dinge: Strecke, Gefängnis-Labyrinth und Insel-Form-Kit. Daraus entstanden zwei Pläne: GIZ-T (Strecke, umgesetzt als Plan) und GIZ-S (Mauern, Strecke, Natur). [QUELLE] GIZ-T `CHANGELOG.md`: „Georg asked for GitHub and Site persistence of Track Core Gizmos plan after discussing Geometry Nodes gizmos for Track, Prison Maze and Island Form Kit.“
- Notierte Quelle der Idee ist **eine Reddit-Diskussion** in r/geometrynodes, nicht YouTube (siehe §1).
- Maze und Insel wurden am 12.10. **ausdrücklich zurückgestellt**. Nur die Strecke bekam einen Pilot-Plan. [QUELLE] GIZ-T `CHANGELOG.md`: „deferred potential Maze/Island adapters“.
- Der Rest ist ebenfalls belegt: Mauern wachsen aus dem Gelände, der Zinnsoldat drückt den Knopf, der Generator ist rund und eckig (Incompetech, CC0). Die Comic-Vorlage ist **Franquins** „Labyrinth-Gefängnisplanet“; „Frank K.“ ist sehr wahrscheinlich Franquin, nicht Kafka.

---

## 1. Was die Gizmo-Idee genau ist (wie geschrieben)

- [GEORG 15.10.] Die Gizmo-Idee kommt aus YouTube-Tutorials, in denen man mit Gizmos prozedurale Welten baut. Die Mauern sind Gizmos.
- [QUELLE] GIZ-T Plan, „Source truth“ Punkt 4: „Blender GN Gizmos / Reddit discussion: https://www.reddit.com/r/geometrynodes/s/vJfxENnxjS · concept donor only, no adopted third-party node tree, UI or authored geometry.“
- [QUELLE] GIZ-S: „Blender GN Gizmos donor: built-in Linear/Dial/Transform; instances/scatter are authoring controls, not runtime semantics. No dependency on the Reddit author's unpublished node graph.“
- **Kern der Idee, wie geschrieben:**
  - In Blender bekommt ein Bauteil sichtbare Griffe (Gizmos: Linear, Drehrad, Transform). Mit diesen Griffen verändert Georg Werte, und die Geometrie baut sich prozedural neu.
  - Der Griff ist nur ein Werkzeug zum Erstellen. Maßgeblich bleibt das Rezept des jeweiligen Besitzers (Strecke: Track Core RouteRecipe; Mauer: Maze-Graph; Gelände: World/Surface). [QUELLE] GIZ-T: „Blender source gizmo (visual handle, authoring only) → typed adjustment to ONE existing Track Core RouteRecipe piece → core.compileRecipe“.
- [QUELLE] GIZ-S `CHANGELOG`: „Georg accepts architecture separating Geometry Gizmos, mesh family, material/texture and scatter. Wall and Race skin proposals recorded.“ (12.10.)
- [QUELLE] Vier-Schichten-Vertrag in GIZ-S:
  1. Form/Topologie-Rezept
  2. sichtbare Mesh-Familie
  3. Oberfläche/Material
  4. Dekoration/Streuung
- [QUELLE] Natur-Gizmos in GIZ-S: N1 Hainrand, N2 Dichte/Abstand, N3 Arten/Jahreszeit, N4 Kronengröße, N5 Hangmaske, N6 Wind, N7 Saison/Sci-Fi. Status jeweils „accepted as authoring *proposal*“.
- [QUELLE] REG V-300 (15.10., TBD): „… mit der Maze-Idee, dem Labyrinth-Generator und Gizmo-Wänden zusammen genutzt werden … Der Gizmo-Gedanke bleibt Teil der Planung.“
- [OFFEN] **YouTube:** Ein YouTube-Tutorial ist nirgends verlinkt. Notiert ist nur der Reddit-Link. Vielleicht verweist der Reddit-Beitrag auf ein Video; das wurde nicht geprüft.
- Abgrenzung: Ohne Bezug zum Labyrinth gibt es „Gizmo“ im Projekt auch als Editor-Griff (Verschiebe-, Dreh- und Skalier-Gizmo im ToolBox/WorldBuilder, `edit-layer.js`). Das ist **eine andere Sache**.

## 2. Labyrinth-Generator (rund und eckig, gemeinfrei)

- [QUELLE] PLAN `KFB_PRISON_MAZE_FLOATING_ISLAND_TERRAIN_TOWER_V0_9_2026-10-10.md` (`2b81e9fec`), „Maze algorithm donor“:
  - „Kevin MacLeod / Incompetech Maze Generator: https://incompetech.com/gallimaufry/incompetech-maze.html“
  - „Page describes CC0 downloadable utility; Prim, Kruskal, Wilson, Recursive Backtracker.“
- **Name:** Incompetech Maze Generator. **Autor:** Kevin MacLeod. **Lizenz laut Seite:** CC0. **URL:** siehe oben.
- [QUELLE] Vorbehalt in derselben Datei: erst Download-Code und Lizenz prüfen. Die Abbildung auf Ring- bzw. Polar-Graph ist ein eigener Schritt. Der PLAN-Handover wiederholt das: „recorded URL/CC0 is not proof of integrated script“.
- [QUELLE] Gebaut wurde ein **eigener** Generator, nicht Incompetech. GREY `RETURN_PRISON_B_PORT_MAZE.md`: „Perfect mazes (recursive backtracker …), seeded, repeatable“, Datei `kfb_prison_maze_graph.py`, quadratisch und polar, Seeds 1–3.
- [QUELLE] Älterer Bezug im LAB: `ctx-o1/toroidal-maze` („keine Lizenz, also Vollschutz … Kein Code“). Das Verfahren nach Jamis Buck gilt als frei.
- [OFFEN] Ob der Incompetech-Code je heruntergeladen und geprüft wurde, ist nicht belegt.

## 3. Mauern = hochgezogenes Gelände mit Mauertextur

- [GEORG 15.10.] Die Mauern sind hochgezogenes Terrain, das eine Mauertextur bekommt.
- [QUELLE] PLAN v0.9:
  - „old walls descend and new walls grow from terrain“
  - „Maze walls …: terrain-colored raised/extruded ribbons or sectors with seams/clay bevels; graph topology determines openings“
  - „Do not … require square Dungeon-wall modules.“
- [QUELLE] PLAN Return (Zeile 282): „stable underside/support + mutable upper terrain + topology-driven raised-ground walls“, „explicitly a hypothesis“.
- [QUELLE] GREY Schritt B: Die Mauern folgen dem Gelände per Raycast, 1,6 m hoch, 0,35 m eingesenkt, mit Erd-Seiten und Gras-Deckel. Becken bzw. Hügel stellt ein Shape-Key-Regler `BASIN_DEPTH_2m5` ein.
- [QUELLE] GREY Schritt C: Ziegel-Mauern, UV entlang der Mauer (u = Meter längs, v = Welthöhe), prozeduraler Ziegel ohne Verzerrung auf geraden, gebogenen und schrägen Mauern. Die Erd-Variante bleibt als `style='earth'`.
- [QUELLE] GIZ-S zu Mauern:
  - Skin W1 „Clay stone wall“ und W2 „Sci-fi wall“, jeweils „Maze graph/seams/passage widths, slope, ground contact unchanged“.
  - Der Prison-Maze-Branch gilt als Besitzer: „Existing graph, curved/grade-adaptive wall UVs and brick material are preserved.“
  - Erster Prüfschritt: G1 „keep one existing Prison Maze wall geometry and stable graph; compare original brick vs candidate clay presentation“.

## 4. Zinnsoldat am Schaltpult: Umbau per Knopfdruck

- [GEORG 15.10.] Ein Zinnsoldat baut das Labyrinth am Schaltpult per Knopfdruck um. Die Insassen stecken in einem sisyphoshaften, kafkaesken, Krazy-Kat-artigen Gefängniszustand.
- [QUELLE] PLAN v0.9: „Non-negotiable creative intent of this concept: a living, visibly reconfigurable maze, controlled by a Toy Soldier button from the tower, not a static procedural layout.“
- [QUELLE] Ablauf laut PLAN v0.9: Knopf → Seed bzw. nächster Graph → Prüfung → Mauern sichtbar heben und senken → Wegfindung aktualisieren → Insassen reagieren → speichern.
- [QUELLE] PLAN Return (Zeile 260): „No.1 = Chief Warden operates red Maze-reconfigure button from tower console“. Dazu kobaltblaue Uniform, weißer Federbusch, Hutnummer.
- [QUELLE] PLAN `KFB_PRISON_MAZE_SOURCE_OWNER_AUDIT_AND_CLAUDE_DESIGN_BRIEF_V1_1_2026-10-10.md`: „large red reconfigure button, theatrical button press and immediate visible maze morphing“.
- [QUELLE] Sisyphos-Motiv, PLAN-Handover: „dramatic almost-escape and tower-button reset“. PLAN v0.9: „Sisyphus-Ariadne-Minos motifs“.
- [QUELLE] Krazy-Kat-Begründung im LAB: „In Coconino County wechselt die Landschaft zwischen zwei Panels derselben Szene, ohne Erklärung. Ein Labyrinth, dessen Wände sich neu erzeugen, ist genau das, nur prozedural.“
- [QUELLE] Umbau-Beweis als Bild: GREY `B_RECONFIG_BOARD.png` mit drei Seeds je Layout. Eine Animation gibt es nicht.
- [QUELLE] Kafka steht nur als Ton-Etikett („Kafkaesque Prison escort procession“, „kafkaesque institution“). Ein Kafka-Werk wird nirgends genannt.

## 5. Rennstrecke als Gizmo

- [GEORG 15.10.] Die Rennstrecke war ebenfalls als Gizmo gedacht.
- **[QUELLE] Gefunden.** GIZ-T, Draft-PR #43 „Planning: Track Core Blender Gizmo Pilot 01 (radius, rise, bank)“, 12.10.:
  - Drei Blender-Griffe auf einem vorhandenen Track-Core-v0.14-Abschnitt: **G01 Kurvenradius**, **G02 Steigung (rise)**, **G03 Querneigung (bankDeg)**.
  - Exportiert wird ein Rezept-Patch, kein Blender-Mesh. Track Core baut die Strecke neu.
  - Nächstes Gate: `TRACK_GIZMO_SOURCE_AND_RECIPE_ROUNDTRIP_R1` (nicht gestartet).
- [QUELLE] GIZ-S: T1 „Clay/Joyride track“, T2 „Sci-fi track“ als Skins. „Existing Race Draft PR #43 Track Gizmos and unmerged Track Core v0.14 are donors only“.
- [QUELLE] Am Gefängnis selbst gibt es nur einen Strecken-Sockel. GREY `RETURN_PRISON_C_ISLAND.md`: `SOCKET_bridge_end_main`. REG V-121: „Brücken-Sockel durch Track-Core-ENTRY ersetzen“.

## 6. Comic-Vorlage („Frank K.“)

- [GEORG 15.10.] Dunkler „Gedanken-Comic“ von „Frank K.“: Ein Sträfling wird auf einem Planeten abgesetzt, der ein einziges Labyrinth ist.
- [QUELLE] LAB, Abschnitt 10b, Tabelle „Ahnenreihe, genau“: „**Franquin** · Der Labyrinth-Gefängnisplanet. Passt ohne Zwang nach innen, wo die Geometrie ohnehin enger wird.“ Am selben Ort: „Ein Labyrinth-Gefängnis gehört dann selbstverständlich nach innen, wo die Gänge sich drängen.“
- **Identifikation:** „Frank K.“ ist sehr wahrscheinlich **André Franquin**; die Transkription hat „Franquin“ vermutlich zu „Frank K.“ gemacht. Kafka ist laut Quelle nicht gemeint.
- [OFFEN] Ein **Titel** steht nirgends. Plausibel, aber nicht belegt: ein Strip aus Franquins schwarzhumoriger Reihe *Idées noires* (deutsch „Schwarze Gedanken“). Das würde „Gedanken-Comic“ erklären. Bestätigen muss das Georg oder eine Recherche.
- [QUELLE] Georg kennt Franquin gut: `gvw/VaultGvW/audio/youtube_channel_index.md` listet eigene Franquin-Fan-Art-Videos (2016).

## 7. Zugehörige Entscheidungen (V-Nummern)

| V | Datum | Status | Inhalt (kurz) |
|---|---|---|---|
| V-105 | 11.10. | RULE | Maze-Insel rund und eckig plus **Wall-Kit-Blatt**: modularer Mauer-Baukasten mit Skins. Bilder auf Branch `docs/kfb-decisions-register-2026-10-11`, Pfad `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/lab-docs/golden/prison-maze_2026-10-11/` (P1 rund, P2 eckig, P3 Wall-Kit). |
| V-106 | 11.10. | TUNE | Unterseite der Gefängnis-Blätter angeklebt. Der Inselkörper folgt der Scholle (V-015). |
| V-108 | 11.10. | RULE | Dystopia-Skin des Mauer-Baukastens. |
| V-120 | 11.10. | RULE | (c) Gefängnis-Labyrinth: Standardmauern 1,6 m plus höhere Zellenmodule. |
| V-121 | 11.10. | TBD | Gefängnis-Greybox erst nach MVP-1 ins Lab (K2, Track-Core-ENTRY). |
| V-209 | 14.10. | RULE | Kein Racetrack nötig. Worldbuilding „prozedural sauber und für Georg als Worldbuilder/God-Mode nutzbar“. |
| V-290 | 15.10. | RULE | Kein Racetrack als Voraussetzung. Rampen aus dem Terrain. |
| V-300 | 15.10. | TBD | Panoptikum-Zelle plus Labyrinth-Generator plus **Gizmo-Wände**: ein Strang. |

- [OFFEN] Die Gizmo-Entscheidung vom 12.10. („Georg accepts architecture separating Geometry Gizmos …“, GIZ-S) hat **keine V-Nummer** im Register. Vorschlag: nachtragen bzw. an V-300 anhängen. Bestätigung durch Georg nötig.

## 8. Widersprüche

1. **YouTube oder Reddit.** Georg erinnert YouTube-Tutorials. Notiert ist nur ein Reddit-Beitrag (r/geometrynodes).
2. **Maze-Gizmo zurückgestellt.** Am 12.10. wurden die Maze- und Insel-Adapter „deferred“; nur die Strecke bekam einen Plan. V-300 (15.10.) holt die Gizmo-Wände wieder in die Planung.
3. **Gelände-Mauer oder Mauer-Mesh.** Georg sagt: Mauer = hochgezogenes Gelände. Die Greybox baut eigene Mauer-Meshes auf dem Gelände. GIZ-S behandelt Mauern als Graph plus Skin und schließt aus, dass ein Skin Topologie oder Bodenkontakt ändert.
4. **Bauweise.** V-105 legt einen modularen Wall-Kit mit Rastermaß fest. v0.9 sagt „not require square Dungeon-wall modules“.
5. **Generator.** Notiert ist Incompetech (CC0). Gebaut wurde ein eigenes Backtracker-Skript. Im LAB steht dagegen `toroidal-maze` (ohne Lizenz).
6. **Rennstrecke.** Der Strecken-Gizmo-Pilot (12.10.) und der Gefängnis-Sockel stehen gegen V-209 (14.10., „Kein Racetrack nötig“, „Racetrack-Design nicht erhaltenswert“) und V-290. Der Gizmo-Gedanke für Straßen und Rampen bleibt aber sinnvoll (V-290: „Rampen … aus dem Terrain“).
7. **Ausweglosigkeit.** Das LAB sagt: „Labyrinth darf kein Tor sein“ und Fliegen ignoriert Wände. Das Gefängnis will einen sisyphoshaften Zustand. v0.9 löst das so: Insassen-Schleife ja, für den Spieler keine „unwinnable loops“.
8. **Besetzung.** In v0.8 ist der Black Knight der Insasse. In v0.9 sind es Frost-Orks, und der Black Knight ist Leibwächter.
9. **Inselkörper.** Greybox und v0.9 nutzen eine Port-Insel mit „torn wedge underside“. V-106 verlangt das Schollen-Design.

## 9. Was fehlt

- Ein YouTube-Link bzw. -Tutorial, falls es eines gibt. Ebenso der Inhalt des Reddit-Beitrags (nicht geöffnet). [OFFEN]
- Ein Maze-Gizmo-Plan: Welche Griffe hätte die Gelände-Mauer (Höhe, Breite, Seed, rund/eckig, Kessel/Hügel)? Vergleichbar wären G01–G03 für die Strecke. Dazu gibt es nichts. [OFFEN]
- Ein Insel-Form-Kit-Gizmo: am 12.10. besprochen, nicht ausgearbeitet. [OFFEN]
- Umsetzung des Strecken-Pilots: Gate `TRACK_GIZMO_SOURCE_AND_RECIPE_ROUNDTRIP_R1` nicht gelaufen; PR #43 ist Draft. [QUELLE] GIZ-T
- Titel und Band des Franquin-Comics. [OFFEN]
- Prüfung des Incompetech-Codes. [OFFEN]
- Animation des Umbaus und Knopf-Pult. Bisher gibt es nur Standbilder. [QUELLE] GREY
- Georgs Panoptikum-Zelle (V-300): „folgt von Georg“. [QUELLE] REG
- Georgs Wahl aus Greybox B und C (Mauerhöhe, rund oder eckig, Kessel oder Hügel, Turmfarbe): in den gelesenen Dateien nicht entschieden. [OFFEN]

## Durchsucht

- Repo `kayfabizarro`: PLAN, GREY, GIZ-S, `blender-mcp/island-form-kit-01-2026-10-11`, `docs/kfb-decisions-register-2026-10-11`, `recovery/kfb-minigames-fluff-source-bridge-2026-10-15`, `main` (Markdown unter `skills/` und `docs/`) sowie geänderte Textdateien auf 97 Branches `planning/*`, `research/*`, `wsa/*`, `design/*`, `data/*` und `chatgpt-web/*` (Auswahl).
- Repo `KFB-Stunt-Car-Race`: PR #43 über den GitHub-Connector (nur gelesen).
- Dropbox `~/Dropbox/CLAUDE/` (ohne `KFB Open World/`), das Greybox-Verzeichnis, die Hub-Register und `replies/`.
- Claude-Code-Sitzungen (Volltextsuche) und Notion: kein Treffer.
