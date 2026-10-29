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
- **Kamera (Georg 29.10., V-987):** Third-Person-Verfolgerkamera über der Schulter mit Fadenkreuz wie im Hauptspiel bzw. im Seed-World-POC (Flug, Minigun auf 1, Raketen auf 2). Die Draufsicht der Stilbilder ist nur Übersicht bzw. Lagebild (z. B. kurz beim Rundenstart oder als Zoom-out), nicht die Spielkamera. Spielbare Referenz: `KFB_HUB/75_REFS/seedworld_poc01/SeedWorld_Mech_Destruction_POC01.html` (Kopie der Standalone-Datei aus kayfabizarro `tools/KFB-ToolBox/_inbox/KFB Seed World Mech Destruction POC 01/`).
- **Frei fliegen** mit unserer Spielsteuerung (Jetpack bzw. Mech, Flugsignal und Flug-Zustände aus dem Hauptspiel).
- **Zeigen und tippen** löst Aktionen aus:
  - Tippen auf Goo oder Gegner: zielen und feuern (Gatling bzw. Blaster, Zielhilfe).
  - Tippen auf einen Bauplatz: bauen bzw. aktivieren (Hebel, Knopf, Weiche).
  - Tippen auf einen Anker: Greifhaken, man fliegt im Bogen dorthin.
  - Halten: Vorschau der Kaskade („was passiert, wenn …“), loslassen löst aus.
- **Am Handy:** ein Daumen für die Richtung, alles andere über Tippen. Die Kamera folgt von allein. Eine komplizierte Flugsteuerung ist nie nötig.

## 4a · Neu ab 29.10. (Georg, V-988): Ebene 1 auf dem KFB Random Maze statt OSM
- **Warum:** Die OSM-Struktur direkt als Spielpfad zu nehmen ergibt keine lesbare Bahn (WSA-Befund nach dem ersten Mechanik-Test, Georgs Kritik). Spielbahnen entstehen aus Bewegung, Höhenwechseln und klaren Entscheidungen.
- **Topologie = Labyrinth** aus dem Random-Maze-Modul (V-984): rund oder eckig, aus Saat, garantiert lösbar. Ein paar gezielte Schleifen ergeben Alternativrouten. Gänge sind Fluff-Wege und Strom-Leitungen.
- **Mauern sind Gizmo-Wände:** aus dem Gelände hochgezogen, mit Ziegel-Struktur, zerstörbar (Durchbruch = Abkürzung bzw. Umleitung des Fluff-Flusses) und neu wachsend (Umbau per Knopf später).
- **Gebäude als Blöcke in Labyrinth-Zellen:** etwas kleinere Goo-Gebäude bzw. Zerstörungs-Blöcke (Seed-World-Zellen) um einen **zentralen Hauptort** in der Mitte: Turm (Glocke, MiB-Wachturm, Panoptikum), Dom, alter Stiefel, Riesen-Donut. Das wählt Georg je Ebene.
- **Platformer-Teile nur als Funktionen:** Weichen, Schalter, Förderbänder, Brücken über Mauern, eine Rampe für den Höhenwechsel. Sie sind blau markiert und klar bedienbar.
- **Erste Teststrecke klein und komponiert:** Start → Fluff-Sammelstelle → Goo-Hindernis → Weiche → Ziel, ein Höhenwechsel, eine Alternativroute. Aus der Schulterkamera gut lesbar. WFC und Regel-Ableitung erst danach.
- **Doppelnutzen:** Das Maze-Modul wird als eigenständiges Host-Modul gebaut und danach ins Hauptspiel übernommen (Zufallsbegegnung bzw. Minigame-Spielplatz, V-984). OSM und Köln bleiben eine spätere Variante bzw. der Rahmen um das Labyrinth.

## 4b · HUD (Georg 29.10., V-989)
Das Knete-HUD des Hauptspiels wird übernommen und angepasst, nicht neu gebaut. Quellen in `game/proc-world-ws0`:
- `src/HudClay.jsx` (HUD 3D, Aktionsleiste R14 als Standard),
- `src/vendor/hud/hud-r4/` bzw. `hud-r5/`,
- Icons R2 und die Wagen-Icons im gleichen Stil.

**Belegung im Minigame:**
- Waffen-Slots: Gatling (Fluff, 1), Raketen (2).
- Aktions-Knöpfe: Greifhaken, Bauen bzw. Aktivieren, Umleiten (Weiche).
- Anzeigen: Fluff-Vorrat, Fluffs am Ziel, Goo-Rest. Mit Bell Defense zusätzlich die Glocken-Integrität.

Fehlende Icons im selben Stil (Icon-Bühne mit Knete) kommen über WSB bzw. die bestehende Icon-Bühne. Es gibt keine selbst gezeichneten SVG-Icons. Am Handy werden die Knöpfe zu den Tipp-Zielen (§3).

## 4c · Sprechblasen (Georg 29.10., V-992)
Die KFB-Sprechblasen des Hauptspiels werden als Modul übernommen, nicht nachgebaut. Quellen in `game/proc-world-ws0`:
- `src/bubbleLayer.js` (genau ein Blasen-Renderer, V-204/V-212),
- `src/bubbleAnchors.js`, `src/bubbleAvoid.js`, `src/BubbleHost.jsx`,
- `src/vendor/chatterbox-core.js` (Layout 1:1 aus ChatterBox Studio).

Was das Modul mitbringt:
- **Zipfel-Logik:** Der Zipfel zeigt immer auf die Kopfmitte des Sprechers, sein Ansatz wandert über den Rand (V-887). Blasen stehen nie über Köpfen.
- **Schrift und Tokens:** Shantell Sans mit fett gesetzten Tokens.
- **Blasenarten:** Sprech- und Denkblase.
- **Verhalten:** Flip-Reveal mit 520 ms Staffelung, Ausweichen vor anderen Blasen und dem HUD, Spielerwahl im selben Blasenkörper.

**Nutzung im Minigame:**
- Tool-Tips an Funktionsteilen (Weiche, Schalter, Bauplatz),
- Reaktionen der Fluffs und Bewohner,
- FrizzleBobs Lagebild vor der Runde (§8),
- Boss-Sprüche (4GTN).

Texte kommen aus dem Triplet- bzw. Chatter-Bestand. Spieltexte sind englisch.

## 4 · Spielfeld-Generator (wiederverwendbar für die ganze prozedurale Welt; R9-Abgleich, V-978)
1. **Grundriss aus OSM (spätere Köln-Variante; Ebene 1 siehe §4a):** ein kleiner Kölner Ausschnitt über das KFB OSM City Lab (kayfabizarro `tools/osm-city-lab/`). Es behält Straßenachsen, OSM-IDs und Gebäudegrundrisse und zeichnet Straßen als zusammenhängende Streifen mit Knoten-Patches. Stufe „Cartoon“ (vereinfachte, leicht verformte Fassaden), nicht „Clean“ oder „Grotesque“. **Brücken sind keine Kreuzungen:** Zwei Wege ohne gemeinsamen OSM-Knoten bleiben getrennt, eine Brücke führt über einen Weg hinweg. Genau das macht das Labyrinth interessant.
1b. **Alternative Grundrisse (später, V-984):** Derselbe Generator nimmt auch ein Labyrinth aus dem KFB-Random-Maze-Modul (rund, eckig, zufällig; Mauern aus dem Gelände hochgezogen, Ziegel) an. Für Ebene 1 bleibt es beim OSM-Ausschnitt.
2. **Die Stadt bleibt Stadt:** Straßen und Gebäude sind die räumliche Grundlage. Sie werden nicht aus Platformer-Kacheln nachgebaut.
3. **KayKit-Teile als Funktionen:** Platformer-, Factory- und BlockBits-Teile kommen nur dort hin, wo sie eine Aufgabe haben:
   - Förderband zwischen zwei Gebäuden,
   - Rampe auf einem Dach,
   - Schalter an einer Brücke,
   - reparierbare Leitung an einer Goo-Fassade.

   Plätze dafür sucht WFC bzw. eine Regel-Platzierung auf dem 2 × 2-m-Raster (Inventar `replies/KAYKIT_PLATFORMER_INVENTAR_R1.md`, Anschlüsse aus dem Platformer-Atlas R6/R7). Die Teile behalten ihre Form (V-574).
4. **Aufgaben setzen:** Quellen, Ziele, Goo-Herde, Bauplätze und Anker kommen aus dem Straßengraphen. Engstellen und Brücken sind die spannenden Knoten.
5. **Editor:** derselbe Generator mit Handeingriff (Teil tauschen, Aufgabe verschieben, Saat speichern). Damit entsteht auch der Bau- und Entdeckungsmodus.
6. **Ausgabe:** ein Spielfeld-Datensatz mit Saat. Derselbe Datensatz dient als Minigame-Ebene, als Ort in der offenen Welt, als Scenelet oder als Quest-Ebene.

## 5 · Welt und Look (vier Ebenen, R9)
1. **Gelände und Farbwelt:** der Farbband-Shader `terrain3` aus unserem Spiel (`src/look/terrain3.js`, `look=terrain3`): Domain-Warping, Fließbänder, Paletten, Höhenverteilung, Palettenschatten, Zeit-Animation. Boden und geeignete Plattformflächen dürfen fließen. Wege, Schalter, Gegner und alles Interaktive bleibt ruhig und lesbar.
2. **Stadtarchitektur:** OSM-Grundrisse, Straßen, Brücken, Landmarken-Anker, Cartoon-Fassaden im Knete-Kanon.
3. **Spielbare KayKit-Teile:** Plattformen, Rampen, Förderbänder, Schalter, Hindernisse, Props, alle unverändert.
4. **KFB-Material- und Ereignisschicht:** Knete, ausgewählte animierte Farbflächen, Black Goo, Ink, Zerstörung und Aufbau.

**Fassaden-Adapter:** `terrain3` färbt ein ganzes Material nach Weltkoordinaten und Höhe. Auf senkrechten Fassaden ergibt das nicht von selbst den gewünschten Look. Ein kleiner Adapter übernimmt Palette und Animationszeit von `terrain3`, färbt aber nur ausgewählte Dach-, Wand- oder Plattformzonen (Materialzonen-Atlas KayKit R7). Erster Vergleich im Designpaket: dieselbe Plattform nativ und mit Farbband-Zone.
**Hülle:** Mindscape-Sphäre aus der HyperNorm-Engine (H15); das Labyrinth ist eine begrenzte Spielzone darin, keine zweite Weltphysik. KFB-Karten aus dem KI- und Technik-Umfeld (z. B. Roko's Basilisk) schweben darin. Ein Licht-Rig und Knete wie im Hauptspiel. Der zufällig entdeckte GIF- bzw. Cel-Look bleibt Backlog (V-966).
**Quellen:** im Konzept-Ordner (PR 435, Head 83ab8b86) CASCADE_SPHERE_R9_WS1_ENVIRONMENT_OSM_TERRAIN3_KAYKIT_CROSSWALK, die Environment-Matrix (JSON) und der Quellenbericht. Offene WS1-Fragen zu Flächenform, Licht und Performance von `terrain3` gelten auch hier.

## 6 · Was wir wiederverwenden (keine Neubauten)
| Baustein | Quelle |
|---|---|
| Combat Mech mit Minigun und Axt | Seed-World-POC, KayKit Mystery-Kit (`CombatMech_Axe.gltf`) |
| Zellschaden, Einsturz, Rekonstruktion | Seed-World `createDestruct`, `createWorld`, `createWeaponFX` (`sw-mech`, `sw-app` bleiben draußen) |
| Trümmer-Look, Effekt-Schichten | Spellspill-Referenz, `SPEC_CARTOON_VFX_SHAPES_R1` (V-499) |
| Zerfall und Aufbau | `kfb-fluff-suck` (`suck`/`build`) |
| Goo-Gebäude | **Goo-Vorstadt K14, entschieden** (V-597, V-625, V-629, V-660, V-677, q168): Kenney City Kits Commercial/Industrial/Suburban als Utopia-Blöcke; befallene Häuser in **Graustufen** (die Farbe ist gestohlen und kommt mit dem Fluff zurück); Goo **herabfließend** (Variante b) im Block-Material als Waber-Shader wie das Gelände in dunklen Farben, dazu feine **Ink-Flüsse** (kostenneutral); Fensterlicht als Verlauf blutrot→orange→gelb. Kein schwarzer Knetklumpen auf dem Dach. Quellen: `50_BLENDER/K14/RETURN.md`, Skript `scripts/k14_build_r4.py`, Bögen `out/r3`, `out/r4`. Blob-Corp-Tower (B40) als Hauptort möglich. |
| GPU-Partikel, Knetkugeln | Karten-Relief- und Kugel-Proben (R2/R3) |
| Jetpack, Flugsignal, Locomotion States, Waffen-Haltung | Hauptspiel `game/proc-world-ws0` (Abschluss-Build, V-965) |
| Bauteile | KayKit Platformer Pack (`assets/kaykit-platformer-r1`), Factory-Kit, BlockBits, Tiny Treats |
| Labyrinth | WhackMan v1 (`wm-recipe.js`, `wm-maze.js`) |
| Mindscape | HyperNorm H15 |

## 6b · Effekt-Baukasten für Waffen und Zerstörung (Georg 28.10., V-974)
Ein gemeinsames Modul `fx-burst`, das das Hauptspiel später übernimmt. Es spielt Effekte über **ein** Ereignis ab, z. B. `burst(art, ort, stärke, richtung)`, und nutzt nur vorhandene Bausteine:
- **Rauchfahne** aus dem Spiel: `src/modules/dustTrail.js` (GPU-Ringpuffer, viele kleine, fast durchsichtige Partikel).
- **Aufprall-Kugeln** (Staub, Erde, Stein): `src/world/landingDebris.js`.
- **Splitter und Brocken:** Steinkit v4 wie in `src/world/ImpactDebris.jsx`, dazu Spellspill-Trümmerformen (V-499).
- **Fluff-Partikel und Sog:** `kfb-fluff-suck`.
- **Mündungsfeuer** primär und sekundär aus der Combat Arena: `src/vendor/combat/muzzle-fx.v1.mjs` mit `muzzle-sources.v1.mjs`, Mündungsanker `KFB_Muzzle`. Die offene Achsfrage aus dem Mündungs-Return R3 (+Z gegen +Y) klärt das Quellen-Gate mit einem Bild.

**Schummeln erlaubt und gewollt:** Beim Zerfall einer Zelle verdeckt der Effekt im Moment größter Dichte (Rauch, Fluff, Explosion) das Modell. Darunter wird das Modell ausgeblendet bzw. geschrumpft, und Trümmerteile aus dem Kit fliegen heraus. Es gibt kein echtes Zerbrechen der Geometrie. Beim Aufbau läuft es umgekehrt: Fluff-Wolke, darin wächst das Teil (`build`).

**Vorgaben je Ereignis** (Werte als Daten, Darstellung getrennt von der Simulation wie §10b):
- Treffer klein,
- Zelle zerfällt,
- Kaskade (Kettenzerfall mit Takt),
- Goo platzt,
- Aufbau,
- Schuss primär und sekundär.

Größe, Anzahl und Lebensdauer kommen aus der Stärke. Die Formen folgen `SPEC_CARTOON_VFX_SHAPES_R1`: eine Masse mit Ausbuchtungen, zwei bis drei Töne, Lebenszyklus.

**2D-Effekte aus dem Bestand (V-977):** kayfabizarro `media/3D_Assets/FX_Visual/`:
- `brackeys_vfx_bundle/` (`predrawn/` gezeichnete Flipbooks, `particles/` Partikel-Texturen),
- `kenney_smoke-particles/` (weiche Rauchwolken),
- `FreeHitVfx/` (Treffer-Effekte mit `presets/`),
- `Beams_BinbunVFX/` (Strahlen, z. B. Scanner von 4GTN, MIB-Blitz),
- `VFX Mysterious Objec - 192x192/` (Portal und Magie).

Die Pixel-Sprites in `explosions_smoke/` passen nicht zum Knete-Look, höchstens als winzige Funken. Selbst gebaute SVG- oder Code-Formen nur als cartooniger Stütz-Layer, nie als Haupteffekt. 3D-Knete (Kugeln, Kit-Trümmer, GPU-Rauch) trägt, 2D-Flipbooks geben Blitz, Feuerball und Ring dazu.
**Vorhandene VFX-Kataloge aus Claude Design (zuerst nutzen):**
- **VFX-Werkbank v13 / FX-Foundation** (Export 06.09.2026, Dropbox `KFB Pet Studio/KFB Mech Slice v11 - KFB VFX Werkbank v13/fx-foundation-v13_2026-09-06/`; Module im Repo KFB-Combat-Arena `modules/`):
  - `kfb-vfx-recipes.js` mit der Grammatik muzzle/travel/surface/cascade, also genau die Kaskade;
  - `kfb-combat-atlas.js` (Ink-Atlas), `kfb-fx-sprites.js` (Alpha-Sprites), `kfb-fx-trails.js`, `kfb-fx-flame.js`, `kfb-hit-response.js`;
  - `kfb-sfx-layers.js`, `kfb-mech-audio.js`.
  - Bauanleitung: `docs/EINBAU_fx-foundation_v13.md` (vier Schichten, zwölf Gates).
  - `fx-burst` baut auf diesen Rezepten auf, statt neu anzufangen.
- **KFB VFX-01 Review Bank** (Dropbox `KFB_VFX_01_REVIEW/`, RETURN_VFX_01.md): Spender-Zensus mit echten Texturen. Zusätzlich zu FX_Visual kommen vor:
  - `media/2D_Assets/free-cartoon-smoke-effects-asset-pack/` (fünf Cartoon-Rauch-Familien),
  - `media/2D_Assets/Tiny Swords (Free Pack)/Particle FX/` (Staub, Explosion, Feuer).
  - Georgs Wahl, welche Familien nach KFB aussehen, steht dort noch offen und kommt ins Designpaket.

**Lücke (nur falls die Kataloge nicht reichen):** ein gezeichnetes Cartoon-Explosions-Flipbook im passenden Stil. Kandidaten aus der 3D-Asset-Suche: „Free Cartoon Explosion frames“ (Sons of Welder, itch.io) und „Cartoon Combat VFX – Free Sample“ (G@mingAssets, itch.io). Download erst nach Georgs Ja.
**Benchmarks fürs Designpaket:** https://www.reddit.com/r/aigamedev/comments/1xf7px0/i_started_vibe_coding_games_2_weeks_ago_i_cant/ und https://www.reddit.com/r/GamePhysics/comments/1xe2unl/spellspill_added_a_slowmotion_spell_to_my_magicka/ (Spellspill: Zeitlupe, Trümmer, Schichten).

## 6c · Erster Boss: 4GTN „The Forgotten Scout“ (Web-Chat R8, Georg 28.10., V-975)
- **Quelle:** KayKit-Roboter 4GTN, schon im Bestand als Rig_Large-Figur (23 Knochen), dazu `4GTN_Forgotten.glb` (überwachsene Fassung mit eigener Geometrie) und ein Katana. Leuchtstreifen liegen auf eigenen Glow-Meshes. Animation nur mit der eigenen Large-Clip-Familie (34 Clips); Medium-Clips verformen ihn falsch. Bis auf das Pulsen der Leuchtstreifen (Shader wie bei den Jetpack-Tanks, V-972) gibt es keine neuen Animationen.
- **Ablauf (90–180 s, optionaler Abschluss einer Ebene):**
  1. Erwachen: Leuchtstreifen pulsieren, er blockiert eine Fluff-Route.
  2. Scanner-Schwenk: langsam, klar angekündigt; ausweichen, Deckung oder eine Weiche umlegen.
  3. Offen: Ein Kontrollknoten ist kurz frei, Treffer mit der Gatling oder Stabilisieren per Fluff-Umleitung.
  4. Ruhe: Er taumelt cartoonig und kommt zur Ruhe, die Versorgung läuft wieder.
- **Heilen statt töten (Georg):** Der Sieg ist eine Heilung nach der Goo- bzw. Black-Fluffer-Logik (Fluff wäscht Geschwärztes frei, V-609, V-532). 4GTN wird zur Natur- bzw. Moos-Fassung `4GTN_Forgotten` und bleibt als Begleiter: Später kämpft er als Roboter-Buddy bzw. Waffe gegen höherstufige Fluff-Gegner und andere Themen-Bosse. Der Zustand bleibt im Encounter-Gedächtnis.
- **Gleicher Boss für alle Spielerfiguren:** Nur die erlaubten Aktionen wechseln (fliegen und schießen, springen, Schalter).
- **Reihenfolge:** Erst muss der Kern laufen (erste Ebene). 4GTN, Forgotten, Katana und die Large-Clips kommen schon ins Quellen-Gate (isoliert, Glow-Meshes sichtbar). Gebaut wird der Boss als eigener Schritt danach. Katana-Angriff und weitere Muster kommen später.
- **Quellen:** im Konzept-Ordner (PR 435, Head 4d4aa7ab) CASCADE_SPHERE_R8_4GTN_LARGE_RIG_BOSS_WS0, das Boss-Rezept (JSON) und der Quellenbericht. Prüffälle F-37 bis F-44 aus dem Work-Brief gelten.

## 6d · Option: Bell Defense (Web-Chat „Bell Resonance“, V-982)
- **Idee:** Eine große Glocke (Klang-Referenz Petersglocke im Kölner Dom, Schlagton c⁰) ist Landmarke, zu verteidigendes Ziel und Waffe zugleich. Sie ersetzt einen ohnehin vorgesehenen Ziel- bzw. Versorgungsknoten, es gibt keinen neuen Modus.
- **KISS:** ein Wert, Glockenintegrität 0–100. Black-Fluff-Treffer senken ihn, umgeleiteter freundlicher Fluff repariert. Daraus folgen Lautstärke, Dämpfung bzw. Ausklang des Läutens sowie Stärke und Reichweite der Schutzwelle (Fläche um die Glocke). Die Tonhöhe bleibt erkennbar. Bei 0 fällt die Glocke aus.
- **Erste Fassung:** eine Glocke, zwei Fluff-Routen, ein Black-Goo-Angriffsstrom, zwei Handlungen (abwehren oder Fluff zur Reparatur umleiten), eine zweite Welle als Probe. Schutzwelle mit sechs farbigen Segmenten für die Story-Modes, zunächst eine einzige Wirkung; Farbzuordnung bleibt bei WS0.
- **Ort: Kölner Dom (Georg).** Der Dom liegt im Kölner OSM-Ausschnitt. Als Landmarke dient unser farbiges Meshy-Modell, Browser-Fassungen in Dropbox `MeshyModels/_browser/cologne_cathedral/`: `KoelnerDom_B_simpler.glb` für das Spiel, `KoelnerDom_A_faithful.glb` und `KoelnerDom_Roncalliplatz_A_screen.glb` zum Vergleich; Quelle WSB-Job B8. Zwei Plätze für die Glocke kommen als Stilbilder ins Designpaket:
  - **A (Georg 28.10.: so ins Designpaket):** ein offener Glockenstuhl auf dem Roncalliplatz vor dem Südturm, wo die echte Petersglocke hängt. Das Dom-Modell bleibt unverändert (V-574). Die Glocke ist von allen Seiten und am Handy gut zu sehen und erreichbar. Kandidat aus der 3D-Asset-Suche: „Hung Bell“ (3dassets.dev, CC0, glb, mit Schwing-Animation); Reserve „High-poly church bell“ (OpenGameArt).
  - **B (später):** ein geöffnetes Schallfenster im Südturm mit sichtbarer Glocke. Das wäre ein Eingriff ins Modell und damit ein WSB-Auftrag mit Konzeptblatt.
- **Entscheidung:** Georg wählt im Designpaket, ob die Glocke das Ziel der ersten Ebene wird. Der R3-Kern bleibt bis dahin unverändert.
- **Quellen:** im Konzept-Ordner (PR 435, Head 350eccd7) CASCADE_SPHERE_BELL_DEFENSE_KISS_WS0_OPTION_R1, Regelrezept (JSON) und Prüfbericht.
- **Für das Hauptspiel (Georg):** Glocken, Klangschalen und Ripple-Wellen auch als KFB-Landmarken mit räumlichem Klang in der offenen Welt (Klangbetten je Thema, Slice I6 bzw. danach).

## 7 · Klang
- **Neu mit ElevenLabs (bestehendes `sfx_gen.py`):** Explosionen, Einstürze in Stufen (klein, mittel, Kaskade), Aufbau-Geräusche (Knete formt sich, Teile rasten ein), Greifhaken, Wächter, Goo. Kinoartig und basslastig, mit tiefem Druck und viel Raum, geschichtet aus Anschlag, Körper und Ausklang bzw. Trümmer (V-461).
- **Vorhanden:** Jetpack-Set `jetpack_diy_r2`, `debris_crash_r1`, Fahrgefühl- und HUD-Klänge.
- **Spielmusik-Kandidat (Georg 29.10., V-993):** Suno „Shepard Ascent“ (instrumental, 228 s, Mix + 9 Stems in assets/private `40_AUDIO/suno_r2/shepard_ascent/`). Die Shepard-Steigerung passt zur Kaskade: Stems je nach Spannung zu- und wegschalten.
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
| Kommandozentrale mit Live-Netzwerk-Graph | das Labyrinth selbst ist der lebende Netzwerk-Graph der Firma |
| „Firmen-DNA“, Logo-Q aus Doppelhelix (Crimson #D81A1D, Hellgrau #F4F4F5) | Saat der Ebene = DNA der Firma; Qiva-Haut mit Helix-Leitungen in Crimson/Hellgrau |
| Firmen-Stimme: kurzes gesprochenes Lagebild | FrizzleBob gibt vor jeder Runde ein gesprochenes Lagebild |
| „Jede Intervention bleibt beim Menschen, Freigabe“ | große Eingriffe (Sprengung, Umbau) brauchen einen Bestätigungs-Tipp |
| „Wir beobachten Systeme, nicht Menschen“ | Fluffs sind Ströme, keine Figuren mit Namen; der Wächter schaut auf Knoten |
| gemessene Treffsicherheit | Sterne und Trefferquote je Runde |

**Kampagne nach Stefans „Drehbuch Simulation Qiva 2026 V2“** (24 Tage bei der fiktiven Firma Kestrel Cloud, fünf Erzählstränge). Jeder Strang wird eine Ebenen-Art:

| Strang im Drehbuch | Ebenen-Art |
|---|---|
| A · flaky Tests, Reverts, „Test ist wieder rot, ignoriere“ | flackernde Goo-Herde, die immer wieder aufploppen; ein Wächter beruhigt sie |
| B · Umbau des Rechnungsdienstes auf eine Event-Queue | Förderband umleiten; Halten zeigt vorher die Kaskade (Shadow Impact) |
| C · persönliche Daten in Debug-Logs | vergiftete Fluff-Ströme herausfiltern, bevor sie das Ziel erreichen |
| D · Datenbank-Migrationen, Sperren, verzögerte Rechnungen | Brücke im Umbau: Strom kurz umleiten, im „Wartungsfenster“ bauen |
| E · Freitags-Ausfall plus Anbieter-Störung „Nordwind Cloud“ | Boss-Welle: große Kaskade plus Sturm von außen, danach Aufräum-Runde (Post-Mortem) |

Die vier Aufnahme-Pausen des Drehbuchs (Wache und Lagebild, Shadow Impact, Compliance-Lücke, Konjunktiv-Frage) werden kurze Zwischenszenen mit FrizzleBob als Erzähler.

Für Stefan: ein abgeschlossenes Modul mit eigenem Zweig, README und einem Einstiegspunkt. Er kann es als Erklär- und Marketing-Schicht für Qiva nutzen und technisch mitbauen, ohne das Hauptspiel zu berühren. Gelesen: Investoren-Papier (17.10.), Drehbuch V2 und QIVA_FULL_CONTEXT.md Abschnitt 0a (Produkt, Marke, Checkpoints 45–57). Noch zu lesen vor dem Kampagnen-Teil: QIVA_FULL_CONTEXT.md, Simulationsbericht, Testing-Doku, Ablaufbilder (Dropbox-Ordner „Stefan Lietz CV and AI Projects“).

## 9 · Modulgrenzen
- `cascade-core`: reines Datenmodell und Regeln (Graph, Ströme, Goo, Kaskade, Bauen, Wächter). Deterministisch, ohne three.js, mit Golden-Test.
- `field-gen`: OSM- bzw. Labyrinth-Grundriss → Raster → WFC → Aufgaben, ausgegeben als Spielfeld-Datensatz mit Saat.
- `skin-*`: Aussehen je Thema (Mech-Fabrik, Sweet Supply).
- `play-input`: Fliegen plus Zeigen und Tippen, Greifhaken.
- `audio-cues`: Cue-Tabelle wie `src/audio/cueMap.js`.
- **Host:** Host-Vertrag nach `replies/KFB_HOST_CONTRACT_R3F_R1.md`. Einbau als Mindsphere, als Begegnung in der offenen Welt oder eigenständig (auch mobil).

## 10 · Zuschnitt des Baus durch WSA
- **Schritt 0, Designpaket vor dem Bau (V-740):** Moodboard, drei Stilbilder (Labyrinth von oben in der Sphäre, Kaskade mit Fluff-Sog, Sweet-Supply-Haut) plus Plattform nativ gegen Farbband-Zone, die isolierten Quellen im Spiel-Look mit Kit-Knete. Georg nimmt ab.
- **Schritt 1, ein durchgehender Bau:** Kern, Generator (OSM-Ausschnitt plus WFC mit Platformer-Teilen), Mech-Haut, Rettungs-Modus, Steuerung, Klang mit den vorhandenen Sätzen. Danach Bau- und Entdeckungsmodus mit derselben Technik.
- **Schritt 2:** Sweet-Supply-Haut, neue ElevenLabs-Klänge, Karten in der Sphäre, Qiva-Kampagne.
- **Regeln:** höchstens zwei Runden je Schritt, keine Kritiker-Schleifen, nur vorhandene Clips, Abnahme im Spiel mit kurzen Clips.

## 10b · Feel und Feedback (Web-Chat R5, übernommen)
- **Simulation und Darstellung getrennt:** Ein Ereignis wie „Weiche nach Norden geöffnet“ ist sofort Spielzustand. Eine eigene Darstellungsschicht entscheidet, ob die Weiche wippt, ein Fluff hüpft oder ein Klonk ertönt. Animationen ändern nie den Spielzustand. Deshalb läuft dieselbe Simulation mit Factory-, Sweet-Supply- oder Mindscape-Haut.
- **Fünf Reaktionsmuster** (Cue-Tabelle nach R5, umgesetzt mit `fluffSuck.js` Squash & Stretch, dem Cartoon-Motion-Kanon und `SPEC_CARTOON_VFX_SHAPES_R1`):
  - Weiche: staucht, überschwingt, federt.
  - Fluff umgeleitet: zögert, neigt sich, Bounce, erst am nächsten gültigen Knoten.
  - Goo getroffen: zieht sich zusammen, wabbelt, Plopp.
  - Reparatur: Knete wächst auf und setzt sich.
  - Dachschalter: Marshmallow-Verformung.
- **Erste Ebene Pflicht:** nur elastische Weiche, eine Fluff-Reaktion, ein kurzer Klang. Goo, Aufblas-Reparatur und Marshmallow folgen in Ebene 2 und 3.
- **WFC mit Grenzen:** Große surreale Objekte (halb geschmolzener Kaffeebecher, schlafendes Wesen) stehen auf Landmarken-Plätzen. Wird so ein Objekt selbst Brücke oder Schalter, braucht es dieselben geprüften Anschlüsse, Kollisionsflächen und Interaktionspunkte wie ein normales Modul. Lesbarkeit am Handy geht vor.
- **Abnahme:** die 18 technischen Prüffälle aus dem Web-Chat-Integrationsbrief R4 plus F-19 bis F-24:
  - genau eine Hebelanimation je Schaltung,
  - Fluff reagiert am gültigen Knoten,
  - keine doppelten Klänge bei Doppel-Eingabe oder Reset,
  - verständlich ohne Ton und mit reduzierter Bewegung,
  - Häute ändern keine Regeln,
  - Wirkung auf Desktop und Handy gemessen.
- **Quellen:** im Konzept-Ordner KFB_GAME_FEEL_COMIC_MOTION_R1 (PR 435, Head 4d4aa7ab; R5-Stand 363f8730): CASCADE_SPHERE_R4_WORK_INTEGRATION_BRIEF, CASCADE_SPHERE_R5_CHILL_CARTOON_FEEL_WS0_ADDENDUM, CASCADE_SPHERE_R5_PRESENTATION_CUE_CANDIDATE (JSON). Animationszeiten und Klangdateien sind Vorschläge, zugeordnet wird aus dem KFB-Bestand.

## 11 · Georgs Entscheidungen (28.10.)
1. **Grundriss:** ein echter OSM-Ausschnitt, gern stilisiert und vereinfacht.
2. **Spielfigur:** zuerst FrizzleBob mit Jetpack und Gatling. Später Combat Mech und alle KayKit-Figuren mit Medium- und Large-Rig (Figurenwahl wie im Hauptspiel).
3. **Stefan:** darf den Zweig sehen. Produktion läuft nur über unsere Repos, nicht über seine Dropbox. Für Stefan wird der Stand als eigene GPT-Site bereitgestellt.
4. **Architektur:** möglichst dieselbe modulare Architektur wie die MVP-Haupt-Slices (Host-Vertrag, Module mit create/update/dispose, Site-Paket wie `site/mvp-r3-dist`), damit Minigame und Hauptspiel gegenseitig Plug-and-Play nutzbar sind.
