# Cascade Sphere · Game-in-Game · Konzept R1 (V-968) · 28.10.2026

Grundlage: Georgs Vorgaben vom 28.10., das Web-Chat-Konzept (kayfabizarro, Branch `planning/kfb-game-feel-comic-motion-ideation-r1-2026-10-19`, Dateien CASCADE_SPHERE_MECH_OSM_CARD_MAZE_WS0_R1 und SWEET_SUPPLY_ASSETS_PLATFORMER_INTAKE_R3, PR 435) und Stefans Qiva-Papier „Abgrenzung zu verwandten Plattformen“ (17.10.2026). Dieses Papier ist die Vorlage für einen fast einmaligen Bau durch WSA. Es ersetzt den R0-Zuschnitt aus V-962 nicht, sondern erweitert ihn.

## 0 · In einem Satz
Ein kleines, entspanntes Action-, Zerstörungs-, Bau- und Tower-Defense-Spiel in einer surrealen Mindscape-Sphäre. Man fliegt frei mit Jetpack oder Mech über ein Labyrinth aus einem stilisierten Stadtgrundriss, lenkt Fluff-Ströme, zerlegt Goo-Gebäude in Kaskaden und baut Wege wieder auf. Leicht zu spielen wie Candy Crush, mit Wucht wie ein Actionspiel.

## 1 · Spielgefühl
- **Chill und fun, nicht schwer.** Kurze Runden (2–4 Minuten), sofortiges Feedback, keine Strafe für Ausprobieren. Jeder Klick hat eine sichtbare und hörbare Folge.
- **Zwei Modi, ein Kern.**
  - **Rettung:** Zerstörung und Verteidigung. Goo breitet sich aus, Fluff-Ströme stocken, man räumt frei und verteidigt.
  - **Bauen und Entdecken:** dieselben Teile, Regeln und Gizmos, ruhig. Man baut Strecken, schaut der Kaskade zu und probiert Varianten.
- **Saft statt Komplexität:** große Trümmer-Kaskaden, Knetpartikel, Fluff-Sog, basslastiger Klang. Die Regeln bleiben einfach.

## 2 · Spielkern (themenfrei, ein Datenmodell)
- **Spielfeld = Graph aus Zellen.** Drei Arten:
  - Zelle: Plattform, Gebäude oder Station.
  - Verbindung: Brücke, Leitung, Förderband oder Rohr.
  - Hindernis: Falle, Wand, Goo.
- **Ströme:** Fluff-Einheiten laufen von Quellen zu Zielen über freie Verbindungen (Wegesuche wie im WhackMan-Labyrinth).
- **Goo:** befällt Zellen, sperrt Verbindungen und breitet sich langsam aus. Gereinigt wird nach geltender Regel: jede Fluff-Farbe wäscht Geschwärztes frei (V-609, V-532).
- **Kaskade:** Zerstörte Zellen reißen abhängige Teile mit. Statik und Nachbarschaft kommen aus dem Seed-World-Zellschaden (`createDestruct`).
- **Bauen:** Gesammelter Fluff ist die Währung. Wiederaufbau läuft über `kfb-fluff-suck` Richtung `build`, Zerfall über `suck` (V-533, V-535).
- **Wächter (Tower Defense):** An freien Ankern stellt man Wächter auf, die Goo und Gegner selbstständig bekämpfen.
- **Erfolg = sichtbare Zustände:** wie viele Fluffs am Ziel, welche Knoten frei, wie viel Goo übrig. Daraus ergeben sich drei Sterne je Runde.
- **Themen sind nur Häute:**
  - Mech-Fabrik (Goo, Industrie),
  - Sweet Supply (Bäckerei-Lieferung, Tiny Treats),
  - später weitere (Stadtteil, Zirkus …).
  - Der Kern weiß nichts vom Thema.

## 3 · Steuerung (auch am Handy ohne Fummelei)
- **Frei fliegen** mit unserer Spielsteuerung (Jetpack bzw. Mech, Flugsignal und Flug-Zustände aus dem Hauptspiel).
- **Zeigen und tippen** löst Aktionen aus:
  - Tippen auf Goo oder Gegner: zielen und feuern (Gatling bzw. Blaster, Zielhilfe).
  - Tippen auf einen Bauplatz: bauen bzw. aktivieren (Hebel, Knopf, Weiche).
  - Tippen auf einen Anker: Greifhaken, man fliegt im Bogen dorthin.
  - Halten: Vorschau der Kaskade („was passiert, wenn …“), loslassen löst aus.
- **Am Handy:** ein Daumen für die Richtung, alles andere über Tippen. Die Kamera folgt von allein. Eine komplizierte Flugsteuerung ist nie nötig.

## 4 · Spielfeld-Generator (wiederverwendbar für die ganze prozedurale Welt)
1. **Grundriss:** ein kleiner OSM-Ausschnitt (Köln-Datensatz aus dem OSM City Lab), abstrahiert zum Straßengraphen. Er muss kein echtes Viertel sein, er liefert nur eine glaubwürdige Grundarchitektur. Alternativ ein Labyrinth aus dem WhackMan-Rezept (`wm-recipe.js`, `wm-maze.js`: MazeGraph, BFS, Tunnel) oder ein Dungeon-Generator.
2. **Raster:** Der Graph wird auf das gemeinsame Raster des KayKit Platformer Pack gelegt (Grundzelle 2 × 2 m, Inventar `replies/KAYKIT_PLATFORMER_INVENTAR_R1.md`).
3. **Wave Function Collapse:** Platformer-, Factory- und BlockBits-Teile als Kacheln mit Kanten-Regeln. WFC füllt das Raster, Höhen kommen aus OSM, fehlende werden gekennzeichnet genähert.
4. **Aufgaben setzen:** Quellen, Ziele, Goo-Herde, Bauplätze und Anker werden aus dem Graphen gewählt (Engstellen = spannende Knoten).
5. **Editor:** derselbe Generator mit Handeingriff (Teil tauschen, Aufgabe verschieben, Saat speichern). Damit entsteht auch der Bau- und Entdeckungsmodus.
6. **Ausgabe:** ein Spielfeld-Datensatz mit Saat. Derselbe Datensatz dient als Minigame-Ebene, als Ort in der offenen Welt, als Scenelet oder als Quest-Ebene.

## 5 · Welt und Look
- **Mindscape-Sphäre** aus der HyperNorm-Engine (H15) als Hülle: Himmel, Wabern, Klangbett. Das Labyrinth ist eine begrenzte Spielzone darin, keine zweite Weltphysik.
- **KFB-Karten in der Sphäre:** Zunächst bestehende Karten aus dem KI- und Technik-Umfeld (z. B. Roko's Basilisk) schweben zufällig durch die Mindscape und tragen das Thema. Eigene Qiva-Karten können später dazukommen.
- **Farblogik:** Farbrollen und Paletten aus `replies/COLOR_CONCEPT_R1.md`. Das Labyrinth-Gelände bekommt die Bänder des Spiel-Geländes (terrain3), damit Wege und Zonen lesbar sind.
- **Knete-Look** wie im Hauptspiel (Claymation, ein Licht-Rig). Der zufällig entdeckte GIF- bzw. Cel-Look bleibt Backlog (V-966).

## 6 · Was wir wiederverwenden (keine Neubauten)
| Baustein | Quelle |
|---|---|
| Combat Mech mit Minigun und Axt | Seed-World-POC, KayKit Mystery-Kit (`CombatMech_Axe.gltf`) |
| Zellschaden, Einsturz, Rekonstruktion | Seed-World `createDestruct`, `createWorld`, `createWeaponFX` (`sw-mech`, `sw-app` bleiben draußen) |
| Trümmer-Look, Effekt-Schichten | Spellspill-Referenz, `SPEC_CARTOON_VFX_SHAPES_R1` (V-499) |
| Zerfall und Aufbau | `kfb-fluff-suck` (`suck`/`build`) |
| Goo-Gebäude | Goo-Vorstadt- bzw. Goo-Varianten (K14), Blob-Corp-Tower |
| GPU-Partikel, Knetkugeln | Karten-Relief- und Kugel-Proben (R2/R3) |
| Jetpack, Flugsignal, Locomotion States, Waffen-Haltung | Hauptspiel `game/proc-world-ws0` (Abschluss-Build, V-965) |
| Bauteile | KayKit Platformer Pack (`assets/kaykit-platformer-r1`), Factory-Kit, BlockBits, Tiny Treats |
| Labyrinth | WhackMan v1 (`wm-recipe.js`, `wm-maze.js`) |
| Mindscape | HyperNorm H15 |

## 7 · Klang
- **Neu mit ElevenLabs (bestehendes `sfx_gen.py`):** Explosionen, Einstürze in Stufen (klein, mittel, Kaskade), Aufbau-Geräusche (Knete formt sich, Teile rasten ein), Greifhaken, Wächter, Goo. Kinoartig und basslastig, mit tiefem Druck und viel Raum, geschichtet aus Anschlag, Körper und Ausklang bzw. Trümmer (V-461).
- **Vorhanden:** Jetpack-Set `jetpack_diy_r2`, `debris_crash_r1`, Fahrgefühl- und HUD-Klänge.
- **Musik:** unsere Tracks und Klangbetten (Mindscape-Betten, Biom-Musik) als Ebenen, die mit der Spannung der Runde steigen bzw. fallen.

## 8 · Qiva als Metaerzählung (Stefan)
Qivas Begriffe werden zu Spielmechaniken. So erklärt das Minispiel Qiva nebenbei:

| Qiva | Im Spiel |
|---|---|
| Lagebild: wenige Situationen statt hunderter Meldungen | wenige leuchtende Brennpunkte im Labyrinth statt Dauer-Alarm |
| Shadow Impact: vor einer Änderung zeigen, was sie auslöst | Halten zeigt die Kaskade, bevor man schießt oder baut |
| Konjunktiv-Modus „Was wäre, wenn …“ | der Bau- und Entdeckungsmodus: Varianten ausprobieren, zurückdrehen |
| „Frage wird Wache“ | ein Wächter, der eine Stelle dauerhaft beobachtet (Tower Defense) |
| Rückverfolgbarkeit, Abweichungsregeln | Fluff-Ströme mit Stempel am Ziel; Abweichungen sichtbar als Goo |
| 60-Tage-Simulation „Kestrel Cloud“ | eine Kampagne: jede Runde ein Tag der fiktiven Firma |
| gemessene Treffsicherheit | Sterne und Trefferquote je Runde |

Für Stefan: ein abgeschlossenes Modul mit eigenem Zweig, README und einem Einstiegspunkt. Er kann es als Erklär- und Marketing-Schicht für Qiva nutzen und technisch mitbauen, ohne das Hauptspiel zu berühren. Das Papier vom 17.10. ist die bisher geprüfte Quelle; die übrigen Qiva-Unterlagen (Drehbuch, Simulationsbericht, Ablaufbilder) liegen in Georgs Dropbox und werden vor dem Kampagnen-Teil gelesen.

## 9 · Modulgrenzen
- `cascade-core`: reines Datenmodell und Regeln (Graph, Ströme, Goo, Kaskade, Bauen, Wächter). Deterministisch, ohne three.js, mit Golden-Test.
- `field-gen`: OSM- bzw. Labyrinth-Grundriss → Raster → WFC → Aufgaben, ausgegeben als Spielfeld-Datensatz mit Saat.
- `skin-*`: Aussehen je Thema (Mech-Fabrik, Sweet Supply).
- `play-input`: Fliegen plus Zeigen und Tippen, Greifhaken.
- `audio-cues`: Cue-Tabelle wie `src/audio/cueMap.js`.
- **Host:** Host-Vertrag nach `replies/KFB_HOST_CONTRACT_R3F_R1.md`. Einbau als Mindsphere, als Begegnung in der offenen Welt oder eigenständig (auch mobil).

## 10 · Zuschnitt des Baus durch WSA
- **Schritt 0, Designpaket vor dem Bau (V-740):** Moodboard, drei Stilbilder (Labyrinth von oben in der Sphäre, Kaskade mit Fluff-Sog, Sweet-Supply-Haut), die isolierten Quellen im Spiel-Look mit Kit-Knete. Georg nimmt ab.
- **Schritt 1, ein durchgehender Bau:** Kern, Generator (OSM-Ausschnitt plus WFC mit Platformer-Teilen), Mech-Haut, Rettungs-Modus, Steuerung, Klang mit den vorhandenen Sätzen. Danach Bau- und Entdeckungsmodus mit derselben Technik.
- **Schritt 2:** Sweet-Supply-Haut, neue ElevenLabs-Klänge, Karten in der Sphäre, Qiva-Kampagne.
- **Regeln:** höchstens zwei Runden je Schritt, keine Kritiker-Schleifen, nur vorhandene Clips, Abnahme im Spiel mit kurzen Clips.

## 11 · Offen für Georg (nur, wo er entscheiden muss)
1. Grundriss für die erste Ebene: echter OSM-Ausschnitt oder WhackMan-Labyrinth?
2. Spielfigur in der Sphäre: FrizzleBob mit Jetpack, Combat Mech oder beides im Wechsel?
3. Darf Stefan den Zweig sehen, sobald Schritt 1 steht?
