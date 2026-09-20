# LIVING HANDOVER · WORKSPACE A
## KFB Stunt-Car Racing / Card Parkour / Fractal Journey

**Stand:** 09.09.2026  
**Status:** Konzept- und Architekturvorbereitung. **Noch kein Produktionsbriefing.**  
**Zweck:** Handover für den Lead in Workspace A und gemeinsame Arbeitsgrundlage für die nächste Konzeptphase.  
**Arbeitsweise:** erst Gesamtmodell und Architektur klären, dann Umsetzung an Astra / Codex / Claude Coworker übergeben. Keine künstliche Zerlegung in Microservices. Produktionsplanung und Slice-Schnitt bleiben zunächst offen.

---

## 0 · Ein Satz

Ein offenes, cartooniges Third-Person-Stunt-Racing-Spiel im KayfaBizarro-Universum, in dem FrizzleBob mit modularen Fahrzeugen über und durch KFB-Karten fährt, springt, driftet, kollidiert und spektakuläre Karten-Parkours absolviert; gespielte Karten, Decks, Fahrzeuge und Ereignisse werden Teil seiner persönlichen Journey und des Fractal Almanac.

---

## 1 · Warum dieses Modul existiert

Das Stunt-Car-Modul soll drei Dinge zugleich leisten:

1. **Action und Flow:** Fahren, Springen, Driften, Crashs, Cartoon-Destruction, starke VFX/SFX und physische Spielereien.
2. **KFB-Karten als Weltmaterial:** Karten sind nicht nur UI oder Loot, sondern Straßenstücke, Rampen, Loopings, Portale, Sprungflächen und narrative Bausteine.
3. **Journey / Metanarration:** Ein Run ist Teil einer größeren Reise. FrizzleBob entdeckt Decks, Welten, Regeln, Karten und Zusammenhänge und trägt sie in seinen Fractal Almanac ein.

Das Spiel soll nicht primär kompetitiv oder scoregetrieben sein. Es darf spektakulär sein, aber die Grundstimmung bleibt **chill, curious, playful, offbeat**.

---

## 2 · Designpfeiler

### 2.1 Card-as-World
Die Karte ist ein physisches Weltobjekt. Sie kann sein:

- Straße oder Plattform,
- Rampe,
- Brücke,
- Kurve,
- Loop,
- Wandfahrt,
- Sprungfläche,
- Portal,
- Belohnungsfläche,
- Teil einer größeren Karten-Sequenz.

Mehrere Karten können in Leserichtung zu einer Strecke verbunden werden. Ein 2×2-Kartenblock kann eine Kurve, ein Sprungsegment oder eine kleine Stunt-Sequenz bilden.

### 2.2 Cartoon Kinetics
Nicht Simulation um ihrer selbst willen. Physik dient Lesbarkeit, Spaß und Choreographie.

Gesucht sind:

- Gewicht und Trägheit,
- klare Beschleunigung,
- Squash/Stretch und Body-Deformer,
- lesbare Sprünge,
- kontrollierbarer Drift,
- harte, juicy Landungen,
- glaubwürdige Crash-Reaktionen,
- kurze sekundäre Wobble-/Suspension-Reaktionen.

Referenzgefühl: Arcade-Racing, Stunt-Games, Cartoon-Shooter-Kinetik und physische Spielzeuglogik; nicht Motorsport-Simulation.

### 2.3 Spectacle with Recovery
Jeder große Moment braucht:

**Anlauf → Aktion → Impact → Nachschwingen → Erholung.**

Explosionen, Sprünge, Barrel Rolls, Karten-Collapse und Fahrzeugtreffer dürfen laut sein, müssen danach aber wieder in einen lesbaren Fahrzustand zurückfinden.

### 2.4 Reuse what already works
Wo vorhandene KFB-Slices bereits funktionieren, werden sie **gelesen und übernommen**, nicht neu erfunden.

Besonders relevant:

- Travel / Surf-Card-Flugphysik,
- Arena-FrizzleBob als Hauptcharakter,
- Cartoon-Deformer und Bewegung,
- Card-Zones / Sky-Cards,
- Cutscene- und Gatter-Experimente,
- Pet-/Frankensteining-Stack,
- Boxel-/Pinball-/Impact-VFX,
- Jukebox / Soundscape,
- Fractal Almanac / Quest Cards,
- Session Import / Export.

---

## 3 · Kernfantasie

FrizzleBob fährt nicht einfach Rennen.

Er **surft, rast, springt und crasht durch Kartenwelten**.

Eine typische Sequenz:

1. Auswahl einer Welt oder eines Decks.
2. Anflug / Einstieg über Travel oder Cutscene.
3. Fahrzeug wird in Garage oder Spawn-Szene bereitgestellt.
4. Strecke besteht teilweise aus KFB-Karten und modularen World-Props.
5. FrizzleBob fährt durch eine Serie von Stunts, Gegnern, Portalen und Karten-Segmenten.
6. Bestimmte Karten werden durch saubere Passage, Kollision, Jump, Quest oder Destruction freigespielt.
7. Erfolgreiche Abschnitte lösen Cutscenes, Karten-Reveals oder Reward-Momente aus.
8. Rückkehr in Garage / Afterglow.
9. Karten, Fahrzeugteile und Ereignisse wandern in den Fractal Almanac und Session-State.

---

## 4 · Fahrzeugidee

### 4.1 Nicht ein Auto, sondern ein Fahrzeug-Framework
FrizzleBob soll in mehreren Fahrzeugklassen funktionieren können, ohne für jede Klasse als eigener Charakter gebaut zu werden.

Arbeitshypothese:

- Cartoon-Car / Buggy,
- Mad-Max-artiger Stunt-Wagen,
- kleiner Panzer / Armed Vehicle,
- Mecha-Runner,
- Hover-/Air-Hockey-artiges Vehicle,
- Surf-Card / Flight Vehicle.

FrizzleBob kann bei passenden Fahrzeugen **bis zur Hüfte** als Fahrer eingesetzt werden. Das passt zur bestehenden Frankensteining-Logik und spart vollständige neue Character-Rigs.

### 4.2 Customizing
Customizing soll viel wahrgenommenen Wert bei geringer Systemtiefe liefern:

- Farbe / Skin,
- Aufkleber / Emblem,
- Räder / Ketten / Hover-Base,
- Front- oder Heckmodul,
- Waffenmodul,
- Booster,
- kleine Accessoires.

Keine komplexe Fahrzeugbau-Simulation. Ziel ist etwa: **80 % des Customizing-Gefühls mit 20 % der Komplexität.**

### 4.3 D6-Progressionsidee
Sechs klar unterscheidbare Fahrzeug- oder Antriebsmodi können später als fraktales D6-Motiv genutzt werden.

Beispielhafte Kategorien, noch nicht festgelegt:

1. Grip
2. Drift
3. Jump
4. Boost
5. Hover
6. Wild / Chaos

Das ist eine Designoption, kein bestehender Contract.

---

## 5 · Card Parkour

### 5.1 Karten als Rampen
Eine Karte kann leicht geneigt als Rampe dienen. Mehrere Karten bilden:

- große Sprünge,
- Double-Jumps,
- Halfpipe-artige Formen,
- Loopings,
- Corkscrews,
- Wallrides,
- gebrochene Brücken,
- schwebende Stufen.

### 5.2 Möbius-Idee
Ein Möbius-artiger Track passt konzeptionell sehr gut zu KayfaBizarro:

- visuell paradox,
- medienreflexiv,
- physisch überraschend,
- Karten-Vorder- und Rückseite können Teil derselben Bewegung werden.

Das muss nicht mathematisch perfekt sein. Entscheidend ist die **wahrgenommene unmögliche Strecke**.

### 5.3 Karten hinter dem Spieler
Eine reizvolle Reward-/Destruction-Variante:

- Karte erfolgreich durchfahren,
- Karte zählt als gesammelt / geklärt,
- hinter FrizzleBob löst sie sich, klappt weg, zerfällt oder explodiert,
- der Track wird dadurch sichtbar „verbraucht“.

Das verbindet Progress, Spektakel und Karten-Sammellogik.

---

## 6 · Welt und Streckenstruktur

Nicht nur eine lineare Rennstrecke.

### 6.1 Offene Stunt-Zone
Bevorzugtes Grundmodell:

- weiter Horizont,
- große lesbare Landmarken,
- mehrere mögliche Routen,
- einzelne Card-Parkour-Segmente,
- Stunt-Orte und Portale,
- optionale Gegner / Events,
- Rückwege statt harter Dead Ends.

### 6.2 Sphärischer Horizont
Die Tiny-Skies-Idee ist attraktiv für:

- kleine Planeten,
- gekrümmten Horizont,
- visuell endliche, aber gefühlt offene Welten,
- schnelle Orientierung,
- starkes Toy-World-Gefühl.

Alternative: flache große Cartoon-Landschaft mit absichtlich überzeichnetem Horizont.

Beides bleibt offen, bis Fahrgefühl und Kamera geprüft wurden.

### 6.3 Modularität
Die Strecke soll aus wenigen, wiederverwendbaren Bauteilklassen zusammengesetzt werden können:

- Gerade,
- Kurve,
- Rampe,
- Gap,
- Loop,
- Wallride,
- Portal,
- Arena,
- Reward-Zone,
- Garage / Hub.

Nicht als starres Track-Editor-System vorgeben. Claude/Astra dürfen die konkrete technische Struktur planen.

---

## 7 · Kamera

### 7.1 Hauptmodus
Third Person hinter und leicht über dem Fahrzeug.

Die Kamera muss:

- Geschwindigkeit vermitteln,
- Landepunkt lesbar halten,
- bei Sprüngen nicht unkontrolliert schwingen,
- bei Barrel Rolls und Loops Orientierung behalten,
- beim Drift nicht zu stark gegensteuern,
- bei Crashs kurz reagieren und wieder sauber recovern.

### 7.2 Cinematic Hand-off
Bei markanten Stunts darf die Kamera kurz stärker choreographiert werden:

- kleiner FOV-Push,
- kurzer seitlicher Orbit,
- Landing-Cut,
- Zeitdehnung,
- Recovery zurück in Player-Cam.

Cutscene und Gameplay sollen ineinander übergehen, nicht wie zwei getrennte Programme wirken.

---

## 8 · Bewegung und Physik

Architektonisch wichtig, ohne die Implementierung schon festzulegen:

### 8.1 Ein physischer Eigentümer
Fahrzeugposition, Rotation, Geschwindigkeit und Kontakt müssen von **einem** Physiksystem besessen werden.

Cartoon-Deformation, Suspension, Squash/Stretch, Lean und Wobble sind visuelle Additionen und dürfen die physikalische Grundpose nicht überschreiben.

### 8.2 Fahrzustände
Mindestens konzeptionell unterscheidbar:

- grounded,
- accelerating,
- braking,
- drifting,
- airborne,
- landing,
- crashing,
- recovering,
- boosting.

Diese Zustände müssen nicht als große State Machine gebaut werden. Sie sind die Bewegungsbegriffe, die Animation, VFX, SFX und Kamera gemeinsam verstehen müssen.

### 8.3 Sprung
Ein guter Sprung braucht:

- klaren Takeoff,
- kontrollierbaren Bogen,
- optionale Air-Control,
- lesbare Fahrzeugneigung,
- starke Landing-Antizipation,
- Impact,
- Suspension-/Body-Rebound.

### 8.4 Cartoon-Deformer
Bestehende KFB-Deformer-Logik soll wiederverwendet werden:

- Beschleunigung → Stretch,
- Bremsung → Compression,
- Drift → seitlicher Lean / Shear,
- Takeoff → kurze Extension,
- Landing → Squash,
- Crash → asymmetrischer Deformer + Wobble,
- Recovery → gedämpftes Zurückfedern.

---

## 9 · Combat und Gegner

Combat ist optionaler Teil der Fahrt, nicht das einzige Ziel.

Mögliche Gegnerfamilien:

- Gedankenpolizei,
- Zensurbrigade,
- Ink-Monster-Fahrzeuge,
- bewaffnete Cartoon-Cars,
- Panzer,
- Drohnen,
- Helikopter,
- Mecha-Gegner.

Das Design darf offbeat und etwas unheimlich sein, aber nicht in generische Military-Optik kippen.

### 9.1 Fahrzeugwaffen
Waffen sind einfache, stark lesbare Module:

- Pencil Gun,
- Eraser Blast,
- Ink Shot,
- Card Shard,
- Rocket / Cartoon Missile,
- Wild-Modul.

Wichtig sind Muzzle-, Hit-, Impact- und Destruction-Choreographie. Der bestehende Combat-Arena-Stand ist als Referenz für Timing, Deformer und VFX relevant.

---

## 10 · Destruction

Cartoon-Destruction ist ein eigener Reiz des Moduls.

Mögliche Ebenen:

- Props zerbrechen,
- Gegner-Fahrzeuge verlieren Teile,
- Karten-Segmente klappen / reißen / dissolven,
- Staub, Splitter, Papierfetzen, Ink, Blumen,
- kurze Explosionen,
- physische Trümmer nur dort, wo sie den Flow nicht stören.

Ziel ist **lesbares Spektakel**, nicht maximale Partikelzahl.

---

## 11 · VFX-Architektur

VFX sollen funktional gruppiert werden, nicht als unverbundene Effektbibliothek.

### Bewegung
- Speedlines
- Booster
- Drift trail
- Tire / hover trail
- Air streaks

### Kontakt
- Dust
- Sparks
- Ink hit
- Card-paper burst
- debris

### Combat
- muzzle flash
- projectile trail
- hit flash
- impact burst
- explosion

### Reward
- flowers
- confetti-like card fragments
- glow
- card reveal
- reward beam

### World / Portal
- Gatter
- shader beam
- warp
- gate ripple
- sky-card beacon

Jeder Effekt soll an einen **klaren Anlass** gekoppelt sein.

---

## 12 · SFX und Musik

Audio ist Teil der Fahrphysik.

### Fahrzeug
- Motor / Antrieb,
- Beschleunigung,
- Drift,
- Landung,
- Karosserie-Wobble,
- Booster,
- Crash.

### Combat
- Schuss,
- Muzzle,
- Impact,
- Explosion,
- Gegner-Death.

### Karten
- Papier / Card slap,
- Reveal,
- Collect,
- Portal,
- Almanac.

### Musik
Deck- oder Welt-Soundscape kann seed-basiert gewählt werden. Jukebox und bestehende Soundscape-Systeme sind wiederverwendbare Kandidaten.

Wichtig: SFX-Kaskaden sollen musikalisch stapelbar sein, ohne den Mix zuzumüllen.

---

## 13 · Garage / Workshop als Home Base

Die Garage ist mehr als ein Menü.

Sie kann enthalten:

- Fahrzeugauswahl,
- Skins,
- Waffen,
- Booster,
- kleinere Frankensteining-Module,
- Fractal Almanac,
- Session Import / Export,
- Quest Cards,
- Travel-Auswahl,
- Afterglow.

Visuell:

- improvisierte KFB-Werkstatt,
- Kenney-/Cartoon-Fabrik- und Pipeline-Assets,
- Werkbank,
- Tuschefass,
- Bleistift,
- Karten,
- Abendlicht,
- FrizzleBob in Ruhepose.

Die Garage ist ein geeigneter Ort für **Belohnung, Reflexion und Vorbereitung**.

---

## 14 · Afterglow

Nach einem Run:

- Fahrzeug steht in der Garage oder vor der Landschaft,
- Abendsonne / warme Beleuchtung,
- FrizzleBob entspannt,
- Fractal Almanac liegt auf Tisch / Werkbank,
- neu erspielte Karten werden gezeigt,
- Journey kann kurz zusammengefasst werden,
- optional TTS / FrizzleBob-Kommentar,
- Boxel-Jam / Musikvisualizer als kleines spielbares Afterglow-Element.

Damit schließt die Action in einen ruhigen Zustand zurück.

---

## 15 · Fractal Almanac / Journey Memory

Der Almanac ist die persönliche Langzeitspur des Spielers.

Speicherbare Ereignisse können sein:

- gespielte Karte,
- gespieltes Deck,
- Quest,
- Fahrzeug,
- freigeschaltetes Modul,
- markanter Stunt,
- Gegner / Boss,
- gewählte Route,
- besondere Karten-Kombination,
- Cutscene / Replay.

Die Session kann zunächst als JSON exportiert und importiert werden.

Kein Backend-Zwang.

---

## 16 · Lean Memory / FrizzleBob als lernender Avatar

FrizzleBob muss nicht von Beginn an alles wissen.

Er kann im Verlauf:

- Decks kennenlernen,
- Kartenbeziehungen erkennen,
- wiederkehrende Figuren benennen,
- frühere Runs kommentieren,
- eigene Closure bilden,
- Quest-Verbindungen herstellen.

LLM-Calls sind hierfür später möglich, aber nicht notwendig, um das Grundspiel lauffähig zu machen.

Die Architektur soll daher **Ereignisse und Story-Metadaten speicherbar machen**, ohne den Fahrkern von einem LLM abhängig zu machen.

---

## 17 · Cutscenes

Cutscenes sind kurze Übergangs- und Reward-Instrumente.

Kandidaten:

- Calling FrizzleBob,
- Fahrzeug fährt aus Garage,
- Gatter-Sprung,
- Surf-Card-Travel,
- Deck Arrival,
- Card Unlock,
- Quest Progress,
- Boss / Major Event,
- Deck Clear,
- Garage Return,
- Afterglow.

Sie dürfen technisch aufwendiger gerendert werden als das permanente Gameplay, solange der Übergang zurück sauber bleibt.

---

## 18 · Beziehung zu Travel

Travel und Stunt-Racing sind verwandt, aber nicht identisch.

**Travel besitzt:**
- Welt-/Deck-Auswahl,
- Sky-Cards,
- Flug,
- Gatter,
- Zonen,
- Reisegefühl.

**Stunt-Racing besitzt:**
- Ground Vehicle,
- Track,
- Jump,
- Drift,
- Collision,
- Destruction,
- Combat,
- Garage Rewards.

Beide können dieselben Deck-/Card-Daten, Cutscene-Sprache, Character-Rigs und Almanac-Daten nutzen.

---

## 19 · Beziehung zu Boxel Blitz / Pinball

Boxel Blitz bleibt ein eigenes Spielgefühl.

Aber wiederverwendbar sind:

- farbige Juiciness,
- Bumper-Logik,
- Impact-Kaskaden,
- Blüten,
- SFX-Leitern,
- Card Reveal,
- „Welt als Spielzeug“.

Im Stunt-Modul könnten Boxel später als Bonus-Arena, Garage-Spielzeug oder Afterglow-Jam auftreten.

Kein Zwang zur direkten Integration in die Fahrzeugphysik.

---

## 20 · Architekturprinzipien für Workspace A

### 20.1 Kein Microservice-Denken
Wir definieren **Verantwortungsbereiche**, keine Produktionszerlegung.

### 20.2 Ein Eigentümer je bewegter Grundgröße
Insbesondere:

- Vehicle physics,
- Camera,
- Track / world geometry,
- card progression,
- session state,
- audio mix.

Visuelle Systeme dürfen diese Größen lesen und additiv interpretieren, nicht parallel besitzen.

### 20.3 Datengetrieben, aber nicht datenverliebt
Kartendaten können Seeds liefern für:

- Farbwelt,
- Props,
- Wetter / Himmel,
- Musik,
- Gegnerfamilien,
- Reward-VFX.

Aber die Karte soll nicht tausend Parameter generieren. Wenige starke Ableitungen reichen.

### 20.4 Vorhandene Assets als produktiver Vorteil
Frankensteining ist nicht Provisorium, sondern Teil der Produktionssprache.

### 20.5 Prototyp muss spielbar sein
Der erste ernsthafte Stand muss bereits:

- fahren,
- springen,
- landen,
- mindestens eine Kartenrampe nutzen,
- eine Reward-/Collect-Sequenz haben,
- mit FrizzleBob funktionieren.

Keine Architektur ohne Spielgefühl.

---

## 21 · Was Workspace A als Nächstes klären sollte

### A · Core Driving Model
- Welches Fahrgefühl?
- Wie stark Arcade vs. physikalisch?
- Welche Rolle hat Drift?
- Wie viel Air-Control?
- Wie stark darf Cartoon-Deformation sein?

### B · Track / Card Construction
- Wie werden Kartenstücke im Raum verbunden?
- Welche standardisierten Segmenttypen reichen?
- Wie entstehen Loop / Möbius / Wallride?
- Welche Kollisionsflächen gehören zur Karte, welche zu Hilfsgeometrie?

### C · Camera
- Hauptkamera
- Sprungkamera
- Loop / Barrel Roll
- Crash / Recovery
- Cinematic Hand-offs

### D · Vehicle Contract
- Welche Daten braucht jedes Fahrzeug?
- Welche Mounts für FrizzleBob?
- Welche Slots für Waffen / Booster / Wheels?
- Welche Animations- und Deformer-Kanäle?

### E · Event Contract
Ein kleines gemeinsames Ereignisvokabular für:

- takeoff
- land
- drift
- boost
- hit
- destroy
- collect
- cardClear
- questProgress
- portal
- cutscene

Damit können VFX, Audio, Camera, Almanac und Cutscenes auf dieselben Momente reagieren.

### F · Session / Journey
- minimaler JSON-State,
- Card History,
- Deck Progress,
- Vehicle Unlocks,
- Quest Progress,
- Replay-/Cutscene-Hinweise.

---

## 22 · Noch ausdrücklich offen

Diese Punkte sind **keine Entscheidung**:

- flache Welt oder kleine sphärische Planeten,
- echtes Racing mit Gegnerpositionen oder primär Stunt-Run,
- Zeitrennen ja/nein,
- Health / Damage,
- Fahrzeuge zerstörbar oder nur cartoonig beschädigt,
- Open World vs. große Hub-Zone mit einzelnen Stunt-Pfaden,
- Möbius-Track als echte Geometrie oder visuelle Illusion,
- sechs D6-Antriebsmodi,
- LLM-Integration während des Runs,
- Umfang des Combat,
- Fahrzeug-Inventar / Loot-Tiefe.

Sie sollen im nächsten Konzeptpass entschieden oder bewusst vertagt werden.

---

## 23 · Anti-Rabbit-Hole-Regel

Das Ziel des nächsten Schritts ist **nicht**, ein komplettes Indie-Racing-Game zu spezifizieren.

Das Ziel ist ein Architekturmodell, mit dem Astra / Codex / Claude Coworker einen **spielbaren, visuell überzeugenden KFB-Stunt-Prototypen** bauen können, ohne:

- den vorhandenen KFB-Stack neu zu erfinden,
- eine übergroße technische Infrastruktur vorzuziehen,
- die Produktionsplanung vorwegzunehmen,
- oder das eigentliche Fahrgefühl hinter Systemdesign zu verlieren.

**KISS bleibt bindend.**

---

## 24 · Definition des nächsten Handover-Meilensteins

Workspace A ist bereit für die Umsetzungsübergabe, wenn diese fünf Dinge klar sind:

1. **Driving Model** in einem verständlichen Bewegungsmodell.
2. **Card Track Model** mit 6–10 klaren Streckenbausteinen.
3. **Vehicle Contract** für mindestens Car + Mecha + Surf/Flight-Variante.
4. **Event Vocabulary** für VFX/SFX/Camera/Progress.
5. **One-run Vertical Slice** als Ablauf vom Spawn bis zum Afterglow.

Erst danach wird daraus das eigentliche Briefing für Astra / Codex / Claude Coworker.

---

## 25 · Arbeitsauftrag für die nächste Session in diesem Chat

**Thema:** Stunt-Car Racing konkretisieren.

Empfohlene Reihenfolge:

1. Fahrgefühl und Physikmodell.
2. Karten als Track-Geometrie.
3. Fahrzeug- und FrizzleBob-Montage.
4. Kamera.
5. Stunts und Parkour.
6. Combat / Destruction.
7. VFX / SFX.
8. Garage / Rewards.
9. Session / Almanac.
10. Vertical Slice.

Keine Produktionsaufteilung, solange das Modell nicht steht.


---

## 26 · Asset Direction Update · Platformer Game Kit priorisieren

**Datum:** 09.09.2026 · **Konzept-Nachtrag.**

Für die visuelle und funktionale Grundsprache soll das vorhandene Paket
**`media/3D_Assets/Platformer Game Kit - Dec 2021`** gegenüber gröberen oder texturlastigeren
Asset-Familien bevorzugt geprüft werden, wenn mehrere passende Kandidaten vorhanden sind.

Grund:
- Character, Gegner, Pickups und Mechanik-Props liegen bereits in derselben Designfamilie.
- Die Formen lesen cute, klar, leicht offbeat und cartoonig.
- Der Hauptcharakter FrizzleBob basiert bereits auf dem Character dieses Pakets.
- Dadurch kann dieselbe Formensprache Platformer, Stunt, Pickups und Hub stärker zusammenhalten.

**Noch offen:** Urheber/Serie/Lizenz des Pakets sind in dieser Runde nicht verifiziert. Vor einer
Produktionsfreigabe muss die Herkunft geklärt werden.

### Direkt bestätigte Kandidaten aus dem Paket

**Prio A · sofort für KFB prüfen**
- `Character.gltf` / `Character_Gun.gltf` — FrizzleBob-Basis.
- `Coin.gltf` — Default-Kandidat für die bisherige generische Münze.
- `Gem_Blue.gltf`, `Gem_Green.gltf`, `Gem_Pink.gltf` — sehr gute Kandidaten für die bereits
  diskutierte farbige Crystal-/Collection-Sprache.
- `Bouncer.gltf` — Kandidat für Stunt-Kicker, Bounce-Pad, Kartensprung oder Garage-Teststand.
- `Cannon.gltf` + `Cannonball.gltf` — Cartoon-Action, Track-Gimmick, Weapon-/Workshop-Prop.
- `Bridge_Modular.gltf` + `Bridge_Modular_Center.gltf` — Stunt-/Track-Verbindung und Weltbau.
- `Goal_Flag.gltf` — Checkpoint / Ziel / Challenge Marker.
- `Arrow*.gltf` — Track Guidance, Tutorial und diegetische Wegweisung.

**Prio B · Stunt-/Hazard-Library**
- `Hazard_Cylinder.gltf`
- `Hazard_Saw.gltf`
- `Hazard_SpikeTrap.gltf`
- `Spikes.gltf`
- `SpikyBall.gltf`
- `Stairs.gltf`
- `Pipe_90.gltf`, `Pipe_Straight.gltf`, `Pipe_T.gltf`, `Pipe_End.gltf`

Diese Objekte eignen sich als modularer Stunt-Park, Hindernisse, Timing-Gates, Workshop-Rohre und
Cartoon-Destruction-Props.

**Prio C · Belohnung / Progress**
- `Heart*`
- `Key.gltf`
- `Star*`
- `Thunder.gltf`
- `Chest.gltf`

Die Priorität liegt zunächst unter Coin/Gems, weil KFB nicht automatisch die klassische
Platformer-Symbolik übernehmen soll.

### Modular Platforms

Das Paket besitzt zusätzlich eine eigene **Modular-Platforms-Familie** mit Dirt-/Grass-Cubes,
Center-/Corner-/Side-Varianten und Tall-Varianten. Diese eignen sich als:
- Testlandschaft,
- Garage-/Workshop-Sockel,
- kleine Stunt-Inszenierungen,
- Übergangselemente zwischen Karten und Weltgeometrie.

Für das eigentliche Card-Stunt-Modul sollen sie **nicht die Karten-Geometrie ersetzen**. Karten
bleiben der primäre KFB-spezifische Track-Baustein.

---

## 27 · Asset-Mapping für Car Racing / Stunt / Track

Die zentrale Asset-Bibliothek umfasst laut aktuellem Projekt-Handover **10.466 Einträge**
(5.435 Bilder, 1.460 Tondateien, 3.571 Modelle) und enthält pro Eintrag bereits einen fertigen
Lade-URL. Sie ist damit die richtige Quelle für die spätere vollständige Kandidaten-Sichtung.

**Wichtig:** Die große JSON-Datei ließ sich in dieser Runde über den GitHub-Connector nicht direkt
als Ganzes lesen. Deshalb ist die folgende Map zweistufig:

### A · Verifizierte Kandidaten
Direkt aus dem Platformer Game Kit:

| Cluster | Assets | Priorität | Einsatz |
|---|---|---:|---|
| Character | Character / Character_Gun | A | FrizzleBob, Driver Insert |
| Pickups | Coin | A | Default Coin / Reward |
| Collectibles | Gem Blue/Green/Pink | A | Crystals / Collection |
| Stunt | Bouncer | A | Kicker / Jump Pad |
| Track | Bridge Modular / Center | A | Verbindungen / Stunt-Brücken |
| Guidance | Arrow / Side / Up | A | Track Guidance |
| Goal | Goal Flag | A | Checkpoint / Challenge |
| Action | Cannon / Cannonball | A | Track-Gimmick / Combat |
| Hazard | Saw / SpikeTrap / SpikyBall / Spikes | B | Hindernisse |
| Workshop | Pipes / Lever | B | Garage / Factory / Mechanik |
| Reward | Chest / Key / Star / Thunder | B | optionale Unlocks |

### B · Noch aus Asset Library zu clustern

Für den vollständigen Stunt-Racing-Pass soll die Asset Library gezielt nach diesen Kategorien
gemappt werden:

1. **Cars / Vehicles**
   - car
   - kart
   - buggy
   - truck
   - van
   - racing
   - offroad
   - tank
   - hover
   - helicopter
   - drone
   - mech

2. **Track / Stunt**
   - road
   - track
   - ramp
   - bridge
   - loop
   - tube
   - pipe
   - rail
   - barrier
   - cone
   - checkpoint
   - gate

3. **Garage / Workshop**
   - garage
   - factory
   - pipeline
   - conveyor
   - crane
   - tool
   - workbench
   - workshop
   - machine
   - fuel

4. **Destruction / Combat**
   - barrel
   - crate
   - explosive
   - bomb
   - missile
   - cannon
   - turret
   - debris
   - wreck

5. **World / Dressing**
   - desert
   - city
   - industrial
   - rocks
   - signs
   - plants
   - lamps
   - fences

6. **Reward / Cute Language**
   - coin
   - gem
   - crystal
   - flower
   - star
   - heart
   - key
   - chest

### Priorisierungsregel

**Prio A**
Direkt einsetzbar, stilistisch nah an FrizzleBob, klarer Nutzen für den ersten Vertical Slice.

**Prio B**
Guter Rohstoff, braucht aber Frankensteining, Materialanpassung oder klaren Kontext.

**Prio C**
Nur Flavor / spätere Weltvariation.

**Referenz**
Nicht direkt produktiv verwenden, aber als Bewegungs-, Track- oder VFX-Vorbild lesen.

---

## 28 · Stilregel Asset-Familien

Bei funktional gleichwertigen Assets wird zunächst bevorzugt:

1. **Platformer Game Kit Dec 2021** — cute, klar, offbeat, FrizzleBob-nah.
2. **vergleichbar leichte Cartoon-Familien** aus der Asset Library.
3. **Kenney**, wenn die Form besser lesbar oder modularer ist.
4. **Quaternius-/texturlastigere Sets** nur dort, wo die höhere Detaildichte wirklich trägt.

Das ist **keine globale Verbotsregel**. Track, Fahrzeuge, Werkstatt und Welt dürfen aus mehreren
Paketen Frankensteining betreiben. Entscheidend ist, dass Material, Palette, Scale und Cartoon-
Deformer sie wieder in dieselbe KFB-Sprache ziehen.
