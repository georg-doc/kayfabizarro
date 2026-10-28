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
- **Schritt 0, Designpaket vor dem Bau (V-740):** Moodboard, drei Stilbilder (Labyrinth von oben in der Sphäre, Kaskade mit Fluff-Sog, Sweet-Supply-Haut), die isolierten Quellen im Spiel-Look mit Kit-Knete. Georg nimmt ab.
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
