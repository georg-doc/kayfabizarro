# SESSION EXPORT · WORKSPACE A · KFB GAME DESIGN / CINEMATICS / JOURNEY / MINIGAMES

**Stand:** 09.09.2026  
**Empfänger:** Workspace A / Lead  
**Zweck:** Vollständiger konzeptioneller Handover dieser Session.  
**Status:** Living Handover. Enthält Entscheidungen, Arbeitshypothesen, technische Befunde, offene Fragen und Side-Branches.  
**Nicht enthalten:** konkrete Produktionsorchestrierung, Agentenaufteilung, Sprintplanung oder Microservice-Zerlegung. Die Umsetzung soll später gemeinsam mit Astra / Codex / Claude Coworker aus diesem Problemraum geplant werden.


## CANON SOURCES · PRIORITÄT FÜR ZUKÜNFTIGE CHATS / WORKSPACES

**Aktualisiert:** 09.09.2026

Für KFB-Regeln, Rituale, Social Calls, Schreibweisen und player-facing Semantik gilt:

1. **Veröffentlichte Online-Regeln:** `https://kayfabizarro.pages.dev/#kfb` — primäre player-facing Kanonreferenz. Bei Widerspruch zu älteren Regeldateien nicht stillschweigend die Repo-Version übernehmen. Die Online-Fassung war beim Update dieses Exports technisch nicht zuverlässig abrufbar; ihr aktueller Wortlaut wurde deshalb nicht rekonstruiert oder behauptet.
2. **Aktuelle explizite Kanon-/Glossar-Dateien im Repo** — für Schreibweisen, IDs, technische Semantik und dokumentierte Kanonentscheidungen.
3. **Aktuelle Living Documents / Masterplan** — für konzeptionelle Erweiterungen, sofern sie dem aktuellen Regelkanon nicht widersprechen.
4. **Ältere Rules, Overworld-Dokumente und Prototypen** — Designhistorie und Spenderquellen, aber keine automatische Kanonquelle.

### Kanon-Schutzregel

Vor jeder digitalen Ableitung eines KFB-Rituals oder kanonischen Begriffs zuerst die aktuelle Online-Regelreferenz prüfen, wenn erreichbar; danach aktuelle Kanon-/Glossarquellen. Versionskonflikte offen markieren statt eigenmächtig harmonisieren. Insbesondere `SHOW IT → SPIN IT → SELL IT`, Social Calls, Closure, POP, Quest und D6-Strukturen nicht aus mehreren historischen Ständen zu einer neuen Grammatik zusammenmischen.

Die in diesem Export dokumentierte Korrektur `SHOW IT → SPIN IT → SELL IT` bleibt bestehen. Die genaue Beziehung dieser digitalen/performativen Grammatik zum in älteren Repo-Regeln dokumentierten `Name It → Claim It → Power It` muss gegen die aktuelle Online-Fassung geprüft werden, bevor daraus ein neuer Contract gebaut wird.


---

# 0 · Executive Summary

In dieser Session hat sich aus mehreren bestehenden KFB-Prototypen ein deutlich zusammenhängenderes Metagame-Modell ergeben.

Der Kern ist nicht mehr „ein einzelnes Game“, sondern ein **Deckverse**, in dem FrizzleBob durch KFB- und lizenzierte Kartenwelten reist, unterschiedliche Spielmodi erlebt, Karten freispielt, Quests „kayfabuliert“, Cutscenes aus seinen tatsächlichen Erlebnissen erzeugt und seine persönliche Journey im **Fractal Almanac** speichert.

Die wichtigsten zusammengeführten Ebenen sind:

1. **Travel / Sky Cards** als räumliche Deck-Auswahl und interdimensionales Reisen.
2. **Combat Arena** als Third-Person-Action-Slice.
3. **Boxel Blitz / Cube Cascade** als chilliges Karten-Reveal-Spiel und späterer Afterglow-Jam.
4. **Card Stunt / Vehicular Action** als Racing-, Parkour-, Destruction- und Vehicle-Branch.
5. **Fractal Almanac** als Sammlung, Journey Memory, Story Editor, Replay Library und Save-Metapher.
6. **Quest / Kayfabulation** als 5-Card-Storymechanik: Actor + 3+ Scenes + Quest → performative Cutscene.
7. **Cinematic System** als verbindende Sprache zwischen Gameplay, Deck-Auswahl, Progress, Story und Rewards.
8. **Garage / Workshop / Afterglow** als Heimat zwischen den Welten.
9. **Lean Memory** als JSON-basierte Session-Persistenz plus subjektives FrizzleBob-Memory.
10. **Frankensteining** als bewusste Produktions- und Stilmethodik: vorhandene Assets, Rigs, Karten, VFX, Shader, Track- und Hub-Experimente werden collageartig zu neuen Spielräumen kombiniert.

Die zentrale Gesamtformel lautet derzeit:

> **Explore → Fight / Play / Race → Collect → Remember → Recombine → Perform → Progress → Travel**

Und auf der kleineren Game-Feel-Ebene:

> **Flick / Drive / Shoot → Consequence → Cascade → Discovery → Reveal → Reward**

---

# 1 · Arbeitsprinzipien dieser Session

## 1.1 Living Document statt Produktionsplan

Das Living Document beschreibt:

- was das Spiel ist,
- welche Erfahrung gesucht wird,
- welche Mechaniken und Systeme wir erarbeitet haben,
- welche architektonischen Invarianten relevant sind,
- welche Hypothesen offen bleiben.

Es soll **nicht** vorschreiben:

- welches Modell was baut,
- Agentenrollen,
- Produktionswellen,
- konkrete Slice-Reihenfolge,
- Microservices,
- ECS,
- Dateistruktur,
- Integratorrollen,
- „erst X, dann Y“-Produktionsregeln.

Die Produktionsplanung soll später Claude/Astra/Coworker mitverantworten.

## 1.2 KISS

Wiederkehrender Grundsatz:

- keine Systemtiefe, die nicht unmittelbar Spielgefühl oder Wiederverwendung bringt,
- vorhandene funktionierende Prototypen lesen und nutzen,
- visuelle Illusionen und choreographierte Tricks sind erlaubt und erwünscht,
- keine technische Vollsimulation nur aus Eleganzgründen.

## 1.3 Ein Eigentümer je Grundgröße

Wichtig für alle Physik-/Animationsthemen:

- physische Position/Rotation/Geschwindigkeit besitzt genau ein System,
- Deformer, Musik, VFX, Kamera und Animation lesen diese Werte und addieren visuelle Interpretation,
- keine konkurrierenden Schreiber auf derselben Wahrheit.

---

# 2 · KFB Cube Cascade / Boxel Blitz · konsolidiertes Spielkonzept

## 2.1 Core Fantasy

Ein farbiges, bouncy, cartooniges Boxel-Spielfeld verdeckt eine Karte. Ein oder mehrere Würfel werden geschnipst / geschossen / gerollt. Boxels reagieren über Seitenfunktionen, Bounces, Redirects, Dissolves und Kaskaden. Die verborgene Karte wird nach und nach freigelegt.

Core Loop:

> **Flick / Roll → Consequence → Cascade → Discovery → Reveal → Reward → Next Level**

## 2.2 Spielraum

- rechteckiges 3D-Spielfeld,
- Default-Kamera kann fast 2D wirken,
- tatsächlicher Spielraum bleibt 3D,
- unsichtbare Seitenwände und Decke,
- Energiefeld-Blitze machen unsichtbare Grenzen bei Kontakt sichtbar,
- Boxels können unterschiedliche Höhen besitzen,
- Lücken legen die darunterliegende Karte frei,
- Würfel kann durch Lücken fallen und auf der Kartenebene weiterrollen oder trampoline-artig zurückfedern.

## 2.3 Würfel / Flick

- Start mit 1 D6,
- später bis max. 3 aktive Würfel,
- z. B. Rot / Gelb / Blau als Multiball,
- Druckdauer steuert Sprunghöhe,
- Zugweite steuert horizontale Geschwindigkeit / Reichweite,
- Zugrichtung steuert Azimut,
- der Würfel wird beim Laden sichtbar gestaucht,
- Zug kann zusätzlich Lean/Anticipation erzeugen,
- Release erzeugt Rebound / Stretch,
- Würfel bleibt bei normalen Kontakten sichtbar,
- vertikale Schüsse inklusive Wand-/Deckenkontakten sind erwünscht.

## 2.4 Sechs Boxel-Seiten · Arbeitshypothese

Noch nicht endgültig:

1. **Dissolve**  
   Boxel löst sich und legt Karte frei.

2. **Bumper**  
   starker Bounce, Cartoon-Deformer, möglicher Impuls auf Nachbarn.

3. **Redirect**  
   lenkt den Würfel um.

4. **Wild / Spawn**  
   erzeugt zusätzlichen Würfel oder speziellen Kaskadeneffekt.

5. **Mouth / Portal**  
   schluckt, leitet um oder spuckt Würfel neu aus.

6. **Eyes / Special**  
   Personality / Tracking, Funktion noch offen.

Farben können Funktionen codieren, aber seed-basiert pro Karte in harmonischer Palette variieren.

## 2.5 Visible Roll-through

Nicht jeder Kontakt soll harter Bounce sein.

Ein Würfel kann über Boxel rollen. Dabei:

- Boxel wird ggf. kurz transparent,
- Würfel bleibt sichtbar,
- Boxel dreht / pendelt nach,
- eine Kette von Boxels reagiert entlang der Flugbahn,
- daraus entsteht ein visueller Nachklang.

## 2.6 Nachbar-Kaskaden

Bumper-/Impact-Kontakte dürfen wie eine Newton-Kette wirken:

- getroffener Boxel deformiert,
- 1–3 Nachbarn in Impaktrichtung schwingen mit,
- nicht als Vollsimulation, sondern cartoonig verzögerte Reaktion.

Dissolve kann zusätzlich orthogonal 4 Nachbar-Boxels betreffen.

## 2.7 Vertical Growth / Tower Cascades

Neue wichtige Dimension:

- Boxel sind nicht auf eine Ebene beschränkt,
- Treffer / Seiten / Kaskaden können Boxel neu spawnen,
- neue Boxel können unter vorhandenen Boxels erscheinen und diese anheben,
- temporäre 3D-Türme / Jenga-Strukturen entstehen,
- Türme wackeln und reagieren cartoonig,
- Treffer oben / Mitte / unten kann unterschiedliche Collapse-Folgen erzeugen,
- genaue Kollapsregeln bleiben offen.

Damit ist das Spielfeld ein **temporär selbstorganisierender 3D-Spielraum**, nicht nur eine Oberfläche.

---

# 3 · Boxel Blitz · technische Physikbefunde aus Code Review

## 3.1 Gute Basis

Aktueller v4/v5-Ansatz:

- Cannon-es als physikalische Wahrheit,
- echter Box-Body,
- Quaternion-Rotation,
- Angular Velocity,
- feste Physikschritte,
- getrennte Oberflächenmaterialien,
- gemessene Restitutionskennlinien,
- statische Physik-Oberfläche vs. sichtbare Oberkante getrennt.

Das sollte nicht neu geschrieben werden.

## 3.2 Abschussmodell

Aktuelles mentale Modell:

- Charge → vertikale Geschwindigkeit,
- Drag Distance → horizontale Geschwindigkeit,
- Drag Direction → Richtung,
- daraus entsteht ballistische Kurve.

Das ist ein bewusst gameplay-kalibriertes Hybridmodell, nicht reine Physiksimulation.

## 3.3 Deformer

Zwei Kanäle:

- Event-Deformation: Launch / Impact / Landing / Bumper,
- kinetische Deformation aus tatsächlicher Geschwindigkeit.

Aktueller Flug-Stretch ist bewusst stark reduziert / aus, weil zu viel Jelly-Charakter entstand.

Gute Regel:

> Cartoon-Deformer soll Kinetik lesbar machen, nicht den Würfel in Gummi verwandeln.

## 3.4 Contact / Impact SSOT · empfohlene nächste Architekturidee

Später sinnvoll:

```text
ContactResult
- point
- normal
- surface
- cell
- impactSpeed
- impactEnergy
```

Diese eine Kontaktbeschreibung könnte dann genutzt werden von:

- Gameplay,
- Deformer,
- Hitstop,
- VFX,
- SFX,
- Boxel Reaction,
- Zielhilfe.

## 3.5 Zielhilfe

Zielhilfe ist noch nicht sauber gelöst.

Gesucht:

- dünne weiße gestrichelte ballistische Kurve,
- keine Kreise entlang der Kurve,
- nur **erster** physischer Aufschlagpunkt,
- Zielkreuz liegt auf Kontaktfläche,
- auf Boden horizontal,
- auf Wand perspektivisch an Wand ausgerichtet,
- auf Decke entsprechend gedreht.

Wichtig: nicht nur mathematische Mittelpunkt-Parabel, sondern tatsächlicher erster Kontakt des Würfelvolumens.

---

# 4 · Farbpalette / Card Seed

## 4.1 Grundidee

Keine unabhängige Zufallsfarbe pro Boxel.

Stattdessen:

> **erst harmonische Palette erzeugen, dann Boxels daraus verteilen.**

## 4.2 Bevorzugter Farbraum

OKLCH statt RGB/HSL, weil Helligkeit und Chroma wahrnehmungsnäher kontrollierbar sind.

## 4.3 Harmonie-Familien

Seed-basierte Auswahl aus z. B.:

- analogous,
- triadic,
- split complementary,
- near complementary.

## 4.4 Card Seed

Card JSON kann deterministisch steuern:

- base hue,
- harmony family,
- Chroma,
- Lightness,
- Boxel-Verteilung,
- Rare Accent,
- Background/Gutter Shader,
- VFX Accent.

Die gleiche Karte bekommt damit eine wiedererkennbare visuelle DNA.

## 4.5 Style Envelope

Nicht alle mathematisch harmonischen Paletten sind KFB.

Bevorzugt:

- mittlere bis höhere Lightness,
- klare Candy-/Rubber-Farben,
- moderate Chroma,
- keine muddy Browns als Default,
- keine ungezügelte Neon-Sättigung,
- kleiner weird Accent erlaubt.

---

# 5 · Combat Arena · Review und zentrale Schlussfolgerungen

## 5.1 Gesamtbefund

Technisch näher an einem guten System als visuell an einem guten Cartoon Shooter.

Größte Lücke ist nicht Physik, sondern:

- Timing,
- Choreographie,
- Animation-to-VFX-Kopplung,
- Muzzle / Hit / Death Beat,
- SFX-Layering.

Benchmark:

- Super Mario / Nintendo-artige Klarheit,
- gute Indie-Cartoon-Shooter,
- nicht realistische Military-Simulation.

## 5.2 Combat als Beat

Ein guter Schuss:

> **Intent → Anticipation → Fire Marker → Muzzle → Projectile → Contact → Hitstop → Deform → Recovery**

Nicht bloß:

> Input → Projektil → Schaden.

## 5.3 Fire Marker

Shoot-Clips sollten einen echten Fire Event Marker besitzen.

Dann:

- Animation erreicht Fire Marker,
- Muzzle FX,
- Shot SFX,
- Projectile Spawn,
- Recoil-Deformer.

Nicht über Clipdauer-Prozentsatz schätzen.

## 5.4 Muzzle

Muzzle braucht:

- Position,
- Richtung,
- sehr kurzen Scale Punch,
- Recoil,
- kurze Nachwirkung / Trail / Smoke,
- synchrone Audio-Spitze.

## 5.5 Hit / Impact

Drei Stufen:

1. Contact Flash
2. Body Reaction
3. Debris / Secondary Motion

Hitstop kommt **nach** sichtbarer kausaler Reaktion.

## 5.6 Death

Death sollte keine sofortige Boolean-Entfernung sein.

Besser:

> hit → recoil → death pose → exaggeration → dissolve/pop → reward drop

Reward Cube sollte aus der Death-Choreographie „herauskommen“.

## 5.7 Spawn

Gegner nicht einfach sichtbar schalten.

Besser:

> telegraph → squash/pop → settle → idle

## 5.8 Enemy Telegraph

Vor Gegner-Schuss:

- stop,
- aim/look,
- anticipation,
- fire,
- recoil,
- resume.

Combat soll lesbar bleiben.

---

# 6 · Cozy / Restoration Layer für Combat und Metagame

Die Erweiterung soll nicht als „weibliche Mechanik“ verstanden werden, sondern als zweite Motivationsachse:

- Sammeln,
- Entdecken,
- Pflegen,
- Wiederherstellen,
- Zugehörigkeit,
- Cozy Payoff.

## 6.1 Card Restoration

Nach Clear wird Welt sichtbar schöner:

- Blumen,
- Pflanzen,
- Pilze,
- kleine Critters,
- Kristalle,
- Mini-Props,
- NPCs kehren zurück.

## 6.2 Crystals statt nur Coins

Farbenreiche Gems eignen sich besser als generische Goldcoins.

Sie können sein:

- simple Pickups,
- Lore Fragments,
- Card Fragments,
- hübsche visuelle Rewards.

## 6.3 Tiny Friends

Kleine freundliche Wesen können nach Clears erscheinen, ohne Relationship-System:

- winken,
- herumstehen,
- später im Hub wieder auftauchen.

## 6.4 Meta-Narration

FrizzleBob kämpft nicht primär „um zu gewinnen“, sondern:

> **um wieder Spielraum herzustellen.**

Positive Pole:

- Play,
- Curiosity,
- Surprise,
- Flow,
- Freedom,
- Chill,
- Friendship.

---

# 7 · Cinematic System · Grundmodell

Cutscenes sollen keine isolierten Filme sein, sondern eine **wiederverwendbare Echtzeit-Cinematic-Grammatik**.

## 7.1 Cinematic-Ebenen

1. **World Entry**
2. **Card Transition**
3. **Milestone Beats**
4. **Character Interstitials**
5. **Big Cinematics**
6. **Quest / Kayfabulation Performance**

## 7.2 typische Dauer

- Card Enter/Clear: 1–2 s
- Loading / FrizzleBob Interstitial: 1–5 s
- 4-Card Milestone: 2–4 s
- Chapter Beat: 4–7 s
- Deck Enter: 6–10 s
- Deck Clear: 10–15 s

## 7.3 Realtime statt Video

Bevorzugt:

```text
Cinematic
- Environment
- Camera Rig
- Actors
- Props
- Card Rig
- Portal Rig
- FX Rig
- Audio
- Timeline
```

Deck / Card / Palette / Companion werden als Daten eingespeist.

## 7.4 Runtime vs Hero

**Game Cinematic**
- kurz,
- performant,
- skippable,
- gleiche Runtime.

**Hero Cinematic**
- Deck Opening / Completion,
- Trailer / Marketing,
- mehr PostFX,
- Motion Blur,
- DOF,
- höhere Renderqualität möglich.

---

# 8 · Surf Card / Travel als Cinematic Backbone

## 8.1 Cardback als Vehicle

KFB-Kartenrückseite ist FrizzleBobs interdimensionales Surf-Vehicle.

FrizzleBob steht darauf wie auf einem Surfboard und reist zwischen Welten.

## 8.2 Travel Beat Grammar

1. SEE
2. AIM
3. CHARGE
4. PUNCH
5. TRANSFORM
6. LAND

## 8.3 Camera Families

- rear chase,
- side surf,
- front reverse,
- board cam,
- orbit,
- fly-by.

## 8.4 Shared Physics

Spielbarer Flug und Cutscene-Flug sollten möglichst dieselbe Vehicle-Logik verwenden.

Autopilot ist dann nicht zweite Fake-Physik, sondern erzeugt dieselben Inputs wie der Spieler.

---

# 9 · Sky Cards / World Select

Travel-v16 enthält bereits zentrale Ideen:

- Karten floaten im Himmel,
- Zero-G-Drift,
- träge Ausrichtung zum Spieler / Kamera,
- Cards als räumliche Ziele,
- Portal-/Dissolve-Verhalten,
- Autopilot-Annäherung,
- Boost / Barrel Roll.

## 9.1 World Select als Raum

Deck-Auswahl kann physisch erfolgen:

- Covers / Sky Cards schweben im Raum,
- undiscovered / discovered / active / cleared werden über Glow/Beam/Fog markiert,
- Fokus / Doppelklick / Durchflug kann Auswahl auslösen,
- Autopilot übernimmt Anflug,
- Card wird zum Gatter / Portal,
- Travel / Loading / Deck Entry werden eins.

## 9.2 Hierarchie statt 56 Biome

Nicht jede Card braucht vollständiges eigenes Biom.

Besser:

- **Deck = große Weltidentität**
- **Card Group = lokale Stimmung**
- **Card = Seed / Accent / Props**

---

# 10 · Spatial Collage / Hubs

KFB muss keine einzige konsistente Weltarchitektur vortäuschen.

Unterschiedliche Raumgrammatiken sind erlaubt, wenn sie durch Character, Cards, Camera und Transitions zusammengehalten werden.

Kandidaten:

- Sky Nexus,
- Rule Library,
- Rotating Cube Rooms,
- Falling Cube Transition,
- Card Stack / Spindle Arena,
- Portal Tunnel,
- Garage / Workshop,
- Small Spherical Worlds,
- Rollercoaster Travel.

Das ist bewusst eine **spielbare Collage**.

---

# 11 · Fractal Almanac

## 11.1 Funktion

Nicht nur Card Inventory.

Der Fractal Almanac ist:

- Sammlung,
- Diary,
- Story Editor,
- Quest Memory,
- Replay Library,
- Progress Map,
- Journey Archive,
- persönliches Infinite Canvas.

## 11.2 Hero’s Journey

Der Almanac kann Reiseentwicklung sichtbar machen, ohne starre Campbell-Mechanik zu erzwingen.

---

# 12 · Quest Cards / Kayfabulation

Bestehender Overworld-Kern:

> **Actor Card + Scene 1 + Scene 2 + Scene 3 + Quest Card**

Quest Card gibt den narrativen Endpunkt vor.

Spieler sammelt Scene Cards und kann deren Reihenfolge variieren.

## 12.1 Kayfabulation

Spieler komponiert:

- Actor,
- 3+ Scenes,
- Quest.

Dann wird daraus eine **performative Cutscene**.

## 12.2 Cutscene als Re-enactment

Nicht nur Reward Screen.

Mögliche Bausteine:

- Card Background,
- Player / Arena Bot,
- Props,
- Combat Replay Snippets,
- Speech Bubbles,
- Pencil Scribbles,
- Speedlines,
- Portal Cuts,
- Scale Tricks,
- Audience / King Reactions.

## 12.3 King Kayfabian

King ist:

- Questgeber,
- Booker,
- Director,
- Evaluator der Kayfabulation.

Der Spieler ist:

> **Explorer → Collector → Editor → Performer**

---

# 13 · Lean Memory / Session Export

## 13.1 Persistenz

Zunächst bewusst lean:

- Single Page Application,
- Session/Journey als JSON exportieren,
- JSON später wieder importieren,
- kein Backend-Zwang.

## 13.2 Was gespeichert wird

Nicht Frames, sondern semantische Ereignisse:

- visited decks,
- won cards,
- accepted quests,
- bosses / monsters,
- vehicles,
- notable stunts,
- player choices,
- selected scene order,
- cutscenes,
- closures,
- discoveries.

## 13.3 Memory-Schichten

### Hard Memory
deterministische Fakten.

### Interpretive Memory
verdichtete Muster / Bedeutung.

### Character Memory
FrizzleBobs subjektive Interpretation.

Wichtig:

> objektiver Game State ≠ FrizzleBobs Sicht.

Er darf lernen, irren, revidieren.

---

# 14 · FrizzleBob als lernender Avatar

FrizzleBob beginnt nicht allwissend.

Er kennt:

- Grundsteuerung,
- seine Weltphysik,
- einige Regeln,
- seine Persönlichkeit.

Er kennt nicht zwingend:

- was mit den Deckwelten passiert ist,
- welche Deutung „richtig“ ist,
- was Kartenbeziehungen bedeuten.

Spieler und FrizzleBob entdecken gemeinsam.

LLM kann später FrizzleBob helfen:

- Session interpretieren,
- Closure formulieren,
- eigene Storybeats erkennen,
- frühere Erfahrungen erinnern,
- persönliche Kommentare generieren.

Aber Gameplay-State bleibt deterministisch.

---

# 15 · Dystopia → Utopia → Protopia

Als optionaler kuratierter Campaign Arc:

1. Dystopia  
   FrizzleBob erwacht ohne klare Erinnerung.

2. Utopia  
   Gegenbewegung / scheinbare Lösung.

3. Protopia  
   erster Major Milestone; keine perfekte Endwelt, sondern Weiterentwicklung.

Danach / daneben offenes Deckverse.

Nicht als Zwangspfad festlegen.

---

# 16 · Deckverse / Galaxies

130+ bestehende Decks plus weitere Cluster lassen sich besser als Deckverse strukturieren als als eine geografische Open World.

Modell:

```text
GALAXY
→ CLUSTER
→ DECK
→ CARD
→ SCENE
→ EVENT
```

Mögliche Cluster:

- History,
- Conspiracy,
- Medicine,
- Philosophy,
- Satire,
- Games,
- Politics,
- Personal,
- Improv,
- Science,
- Dystopia/Utopia/Protopia.

---

# 17 · Garage / Workshop / Home Base

## 17.1 Funktion

Garage kann sein:

- Fahrzeug- und Loadout-Ort,
- Frankensteining-Werkbank,
- Character Hub,
- Fractal Almanac Ort,
- Save / Import / Export,
- Quest Hub,
- Jukebox,
- Afterglow.

## 17.2 Werkbank

Keine komplexe Fahrzeugkonstruktion.

Wenige Sockets:

- Body,
- Drive,
- Front Tool/Weapon,
- Top Tool/Weapon,
- Rear/Boost,
- Skin/Color.

Ziel:

> **80 % Customizing-Gefühl mit 20 % Komplexität.**

## 17.3 Mechanical Presentation

Reale 3D-Assets können Montage inszenieren:

- Greifarm,
- Förderband,
- Schrauben,
- Lackieren,
- Weapon Attach,
- Testlauf.

Frankensteining wird Minigame / Toy, nicht nur Dev Tool.

---

# 18 · D6 Drive Families

Arbeitshypothese:

1. Rubber
2. Rocket
3. Drift
4. Heavy
5. Hover
6. Wild / Bizarro

Nicht primär Stats, sondern unterschiedliche Feel-Profile:

- Acceleration,
- Steering,
- Suspension,
- Jump,
- Drift,
- Camera,
- Deformer,
- Audio.

---

# 19 · Afterglow

## 19.1 Mood

Nach Run:

- Golden Hour / Sunset,
- FrizzleBob entspannt,
- Cocktail statt Gun,
- Vehicle daneben,
- Tisch / Werkbank,
- Tuschefass,
- Pencil / Eraser,
- Fractal Almanac als Underground-Fanzine,
- Jukebox / Soundscape.

## 19.2 Afterglow Reflection

Session recap aus:

- Hard Memory,
- Card Content,
- Player Choices,
- FrizzleBob Memory.

Optional per Browser-TTS.

## 19.3 Save als Diegese

Statt nur „Export JSON“:

- **Pack up Journey**
- Almanac schließt,
- Journey wird exportiert.

Beim Import:

- **Open an old Journey**
- Almanac klappt auf.

---

# 20 · Boxel Jam / Afterglow Dancefloor

Neue Wiederverwendung von Boxel Blitz.

## 20.1 Grundidee

Dasselbe Boxel-Bett wird nicht als Level, sondern als:

- Musikvisualizer,
- Dancefloor,
- spielbares Toy,
- Cozy Afterglow Element.

## 20.2 Reaktionen

Musik kann beeinflussen:

- Höhe,
- leichte Neigung,
- Glow,
- Farbe,
- Wellen / Ripples,
- Muster.

Physik bleibt eigener Eigentümer.

## 20.3 Interaktion

Spieler kann D6 hineinschnipsen.

Treffer erzeugen:

- Blumen,
- Tonfolgen,
- Farbkaskaden,
- Augen-/Mund-Reaktionen,
- harmlose Bounce-Ketten.

Kein Score muss dominant sein.

## 20.4 Referenzmischung

Keine Genre-Kopie, sondern Bewegungsqualitäten aus:

- Pinball,
- Billard,
- Boule,
- Air Hockey,
- Candy Crush,
- Tetris,
- Schach.

---

# 21 · Card Stunt / Vehicular Action Branch

## 21.1 Neue Definition

Nicht klassisches „Racing“.

Besser:

> **KFB Stunt / Vehicular Action Playground**

Mischung aus:

- Stunt Racing,
- Vehicular Combat,
- Arcade Racing,
- Destruction Playground,
- Exploration,
- Card Parkour.

## 21.2 Cards are Track Geometry

Die wichtigste KFB-spezifische Idee.

Cards können sein:

- Straße,
- Rampe,
- Loop,
- Bridge,
- Gate,
- Wallride,
- Breakable,
- Portal.

Ein 2×2-Comicseitenblock kann in Leserichtung als physische Route erlebt werden.

> **Panel sequence becomes trajectory.**

## 21.3 Möbius Card Track

Hero Experiment:

- Karte/Track bildet Möbius-artige Route,
- Vorder- und Rückseite werden spielbar,
- Form und Kartenmedium verschmelzen.

Nicht mathematische Perfektion, sondern überzeugende Raumillusion.

---

# 22 · Vehicles / Frankensteining

## 22.1 Vehicle Families

Mögliche Toys:

- Buggy,
- Car,
- Tank,
- Mech,
- Hovercraft,
- Helicopter,
- Drone,
- Surf Card.

## 22.2 FrizzleBob Driver Socket

FrizzleBob kann als Upper-Body-Insert in unterschiedliche Vehicles eingesetzt werden.

Benötigt:

- standardized driver mount,
- head/eye tracking,
- steering / recoil,
- body lean,
- landing reaction,
- camera look.

## 22.3 Vehicle Swapping

Runs können Toys wechseln:

> Car → Crash → Eject → Mech → Jump → Helicopter / Surf.

Das ist interessanter als reines Pre-Race Loadout.

---

# 23 · Racing / Stunt Physics · Architekturfragen für nächste Phase

Noch auszuarbeiten:

- Fahrgefühl / Arcade vs Physik,
- Acceleration / Brake,
- Steering,
- Drift,
- Suspension,
- Air Control,
- Jump Curve,
- Landing,
- Crash,
- Recovery,
- Camera.

Grundsatz:

> Fahrzeugphysik besitzt Pose; Cartoon-Deformer interpretiert sie.

---

# 24 · Cartoon Destruction

Keine Vollsimulation.

Drei Ebenen:

### Cosmetic Damage
- dents,
- smoke,
- sparks,
- wobble.

### Breakables
- vorbereitete Fragmente.

### Hero Destruction
- ausgewählte große Sequenzen:
  - Tank explodiert,
  - Tower fällt,
  - Kartenbrücke reißt,
  - Gate implodiert,
  - Mech verliert Arm.

---

# 25 · VFX Lab · projektweiter Bedarf

Projektweit soll eine gemeinsame hochwertige Cartoon-VFX-Sprache entstehen:

- muzzle,
- impact,
- explosion,
- fire,
- smoke,
- debris,
- energy,
- dust,
- speed,
- dissolve.

Empfohlene Mix-Technik:

- flipbook sprites,
- instanced particles,
- simple geometry,
- shader planes / meshes,
- physisches Debris nur selektiv.

Explosion ist ein Beat, kein Emittieren von Partikeln:

> contact → white flash → core expansion → fire shape → debris → smoke → settle

---

# 26 · Small Worlds / Curved Horizon

Stunt / Travel kann von leicht gekrümmtem Horizont profitieren:

- kleine sphärische Welten,
- Toy-World-Gefühl,
- Sprünge aus / über Horizont,
- Track erscheint dramatisch aus Krümmung.

Tiny-Skies-artige Makroebene ist ein möglicher Spender, aber keine technische Verpflichtung.

---

# 27 · Rollercoaster Branch

Vorhandene Rollercoaster-Idee:

- Fahrzeug / Pad fährt entlang dynamisch konfigurierbarer Schienen,
- kann als Guided Travel oder Minigame dienen,
- mögliches Bindeglied zwischen Travel und Stunt.

Kein eigener Vollmodus nötig, solange er als räumlicher Trick nützlich ist.

---

# 28 · Asset Direction · Platformer Game Kit priorisieren

Repo:
`media/3D_Assets/Platformer Game Kit - Dec 2021`

Dieses Paket passt stilistisch gut zu FrizzleBob:

- cute,
- klar,
- offbeat,
- cartoonig,
- weniger grob als manche Kenney-Sets,
- weniger texturlastig als manche Quaternius-Pakete.

Urheber/Serie/Lizenz noch verifizieren.

## 28.1 bestätigte Kandidaten

**Character**
- Character.gltf
- Character_Gun.gltf

**Pickups**
- Coin.gltf
- Gem_Blue.gltf
- Gem_Green.gltf
- Gem_Pink.gltf
- Heart*
- Key
- Star*
- Thunder

**Stunt / Mechanics**
- Bouncer
- Bridge_Modular
- Bridge_Modular_Center
- Cannon
- Cannonball
- Goal_Flag
- Arrow / Arrow_Side / Arrow_Up
- Hazard_Cylinder
- Hazard_Saw
- Hazard_SpikeTrap
- Spikes
- SpikyBall
- Stairs
- Pipes
- Lever

**Modular Platforms**
- Dirt / Grass Cubes,
- Center / Corner / Side,
- Tall Variants.

## 28.2 Stilpriorität

Wenn funktional gleichwertig:

1. Platformer Game Kit Dec 2021
2. ähnlich leichte Cartoon-Familien
3. Kenney, wenn modular / lesbarer
4. texturlastigere Quaternius-Sets nur, wenn Detail wirklich trägt

Keine Verbotsregel. Frankensteining bleibt gewollt.

---

# 29 · Asset Library · Racing / Stunt Mapping

Zentrale Asset Library:
`skills/KFB Setup Game Design/kfb-asset-library (5).json`

Projekt-Handover nennt:
- 10.466 Einträge
- 5.435 Bilder
- 1.460 Audio
- 3.571 Modelle
- jeweils fertiger URL.

Für vollständigen Stunt-Pass gezielt clustern:

## Vehicles
car, kart, buggy, truck, van, racing, offroad, tank, hover, helicopter, drone, mech

## Track
road, track, ramp, bridge, loop, tube, pipe, rail, barrier, cone, checkpoint, gate

## Workshop
garage, factory, pipeline, conveyor, crane, tool, workbench, workshop, machine, fuel

## Destruction
barrel, crate, explosive, bomb, missile, cannon, turret, debris, wreck

## World
desert, city, industrial, rocks, signs, plants, lamps, fences

## Rewards
coin, gem, crystal, flower, star, heart, key, chest

Priorität:
- A = direkt für Vertical Slice
- B = gutes Frankensteining-Rohmaterial
- C = Flavor / später
- Reference = nur Vorbild

---

# 30 · Pencil / Eraser / Tool Pets

Pencil und Eraser eignen sich als wiederkehrende Companion-/Tool-Pets.

Minimaler Frankensteining-Ansatz:

> Object + Eyes + Pupil Tracking + Squash + Tilt + Blink = Character

Pencil kann:
- zeichnen,
- Pfade markieren,
- Portale umranden,
- Loading kritzeln.

Eraser kann:
- löschen,
- Transition freirubbeln,
- Enemy Residue entfernen,
- Comedy Companion sein.

Kann später als kleiner Pet-Studio-Slice vorbereitet werden.

---

# 31 · Meta-Narrative Klammer

FrizzleBob ist kein klassischer Retter.

Er ist eher:

- Surfer,
- Trickster,
- Troubleshooter,
- Street Artist,
- interdimensionaler Hausmeister.

Er reist in Welten, in denen etwas zu starr, monoton, kontrolliert oder blockiert geworden ist.

Seine Funktion:

> **Spielraum wiederherstellen.**

Gegner können verschiedene Formen von Stasis verkörpern:

- Bürokratie,
- Langeweile,
- Dogmatismus,
- Algorithmus-Schleifen,
- Gruppendenken,
- Spam,
- übertriebene Ernsthaftigkeit,
- Chaos ohne Spielregeln.

Das hält die Metaklammer offen für eigene und lizenzierte Welten.

---

# 32 · Gesamte Cinematic Journey eines Decks · Zielbild

Möglicher Ablauf:

1. Hub / Almanac
2. Deck / World Select über Sky Cards
3. Autopilot-Anflug
4. Surf / Portal Entry
5. Deck Opening
6. Card / Level Play
7. Micro Card Clear
8. 4-Card Milestone
9. Chapter Beat
10. Quest Progress
11. Return Travel
12. Kayfabulation
13. Quest Cutscene / Performance
14. Push / Unlock
15. Deck Clear
16. Afterglow
17. Almanac / Memory / Export

---

# 33 · Architektur · was fest genug ist

Keine Microservices.

Aber diese **fachlichen Wahrheiten** sollten später architektonisch sauber werden:

## Shared Content
- Cards / Deck JSON
- Seeds
- Asset Manifest
- Quest / Scene / Actor metadata

## Shared Journey State
- current deck/card
- progress
- cards won
- quest state
- vehicles
- discoveries
- memory
- cinematics

## Shared Event Vocabulary
z. B.:
- takeoff
- land
- boost
- drift
- fire
- hit
- destroy
- collect
- cardClear
- questProgress
- portal
- cinematic
- afterglow

Damit können VFX, Audio, Camera, Almanac und Cutscenes dieselben Ereignisse verstehen.

## Shared Character
Arena-FrizzleBob / driver / surfer / walker sollte so weit sinnvoll aus demselben Character-Rig abgeleitet werden.

---

# 34 · Offene Designfragen

Diese Punkte sollen Workspace A bewusst noch prüfen:

### Boxel
- finale sechs Faces?
- Eyes funktional oder Personality-only?
- max. Multiball?
- Tower collapse rules?
- Afterglow Jam mit echten Frequenzbändern oder Beat-Mustern?

### Travel
- Doppelklick vs Durchflug vs beides?
- frei navigierbarer Nexus oder Kampagnen-Fog?
- welche Sky-Card-Statusdarstellung?

### Cinematics
- welche Beats sind wirklich wiederverwendbar?
- welche Sequenzen Runtime, welche Hero?
- wie Golden Moments aus Gameplay speichern?

### Almanac
- physischer Cube-Hub?
- Fanzine UI?
- Replay-Tiefe?
- wieviel FrizzleBob-Memory bleibt im JSON?

### Racing
- Open Stunt Zone vs lineare Track-Slices?
- curved horizon?
- echte Gegner-Rennen oder primär Stunt?
- Health / Damage?
- Fahrzeuge zerstörbar?
- D6 Drive Families?
- Card Track echte Physik oder unsichtbare Hilfsgeometrie?

### Workshop
- welche Sockets reichen?
- welche Teile sind rein kosmetisch?
- wie werden Dev-Tools als Toy vereinfacht?

---

# 35 · Source Anchors / Repo-Orte

Diese Session bezog sich insbesondere auf:

- `KFB Boxel Blitz`
- `KFB Combat Arena`
- `travel/travel-v16`
- `overworld`
- `skills/KFB Setup Game Design/KFB_Frankensteining_Lab (1).html`
- `skills/KFB Setup Game Design/kfb-asset-library (5).json`
- `media/3D_Assets/Platformer Game Kit - Dec 2021`
- **Primäre player-facing Kanonreferenz:** KFB Rules: `https://kayfabizarro.pages.dev/#kfb`

Zusätzliche bereits erzeugte Session-Dokumente:

- `KFB_Cube_Cascade_Game_Living_Document_v1.0.docx`
- `LIVING_boxelblitz_v5_afterglow_addendum.md`
- `HANDOVER_Workspace_A_KFB_Stunt_Car_Racing_Living_v1_1.md`

---

# 36 · Was Workspace A mit diesem Export tun soll

Dieser Export ist **kein Auftrag, sofort alles zu bauen**.

Er dient als vollständige Konzeptquelle.

Die nächste sinnvolle Lead-Aufgabe ist:

1. Gesamtmodell lesen und Widersprüche markieren.
2. Bestehende Prototypen als Spenderkarte erfassen.
3. Shared Invariants definieren.
4. Für den **Card Stunt / Racing Branch** das Driving Model konkretisieren.
5. Parallel prüfen, welche Cinematic-, Travel-, Almanac- und Memory-Verträge dabei schon gemeinsam genutzt werden sollten.
6. Erst danach Umsetzungsbriefing für Astra / Codex / Claude Coworker formulieren.

Wichtig:
- kein künstliches Microservice-Design,
- keine Produktionsplanung aus diesem Dokument ableiten, bevor das Bewegungs- und Datenmodell klar ist,
- vorhandene Slices zuerst messen / verstehen,
- FrizzleBob, Cards und Journey als verbindende Ebene behandeln.

---

# 37 · North Star

> **KFB ist kein einzelnes Genre. Es ist ein spielbares Infinite Canvas aus Cards, Worlds, Toys, Journeys und Performances.**

FrizzleBob reist darin nicht durch ein Menü, sondern durch Räume.

Cards sind nicht nur Content, sondern:
- Welt,
- Track,
- Quest,
- Erinnerung,
- Bühne,
- Portal,
- Reward.

Der Fractal Almanac hält zusammen, was der Spieler daraus gemacht hat.

Und Cutscenes sind nicht Unterbrechungen des Spiels, sondern die Stellen, an denen das Spiel seine eigene Journey kurz **aufführt**.

---

# 38 · KANON-KORREKTUR · SHOW IT → SPIN IT → SELL IT

**Diese Korrektur überschreibt `SHOW → SPIN → CALL` aus der Diskussion. `CALL IT` ist kein dritter Beat.**

Die kanonische performative Dreierstruktur lautet:

> **SHOW IT → SPIN IT → SELL IT**

**SHOW IT** macht Card/Figur/Behauptung wahrnehmbar.  
**SPIN IT** setzt sie in Perspektive, Behauptung, Geschichte oder Verbindung.  
**SELL IT** ist der Wrestling-Kayfabe-Commit: die gesetzte Realität so performen, dass sie beim Publikum landet.

Erst **danach** folgen Closure, Social Call und gegebenenfalls POP:

```text
CARD / OFFER
→ SHOW IT
→ SPIN IT
→ SELL IT
→ AUDIENCE RESPONSE
→ CLOSURE / SOCIAL CALL / POP
→ CONSEQUENCE / MEMORY
```

POP bleibt getrennt: Progressions-/Reaktionswährung mit der Doppelbedeutung Popcorn und Wrestling-Pop. Eine D6-Plausibilitäts-, Curiosity- oder Appeal-Skala ist ebenfalls nachgelagerte Reaktion/Journey Evidence und **kein Ersatz für SELL IT**.

## Schutzregel gegen Drift

Kanonische KFB-Rituale dürfen in digitalen Ableitungen nicht frei paraphrasiert oder durch UX-Shorthand ersetzt werden. Vor einer neuen Mechanik prüfen: Ritual/Performance, Closure, Social Feedback, Progressionszustand und kanonische Begriffe. Insbesondere gilt:

- `SHOW IT → SPIN IT → SELL IT` bleibt als Einheit erhalten.
- `SELL IT` ≠ `CALL IT`.
- Social Calls kommen nach der Performance.
- Closure ist Bedeutungsbeitrag, nicht automatisch Lob, Wahrheit oder Score.
- POP ist nicht Plausibilität.

# 39 · Ritualebenen und Social Calls · Quellenstand

> **Kanon-Hinweis:** Die dort genannten Repo-Fassungen sind Vergleichs-/Historienquellen. Für eine endgültige player-facing Festlegung hat die aktuelle Online-Fassung unter `https://kayfabizarro.pages.dev/#kfb` Vorrang.

Die aktuellen Repo-Quellen zeigen zwei verwandte, aber nicht identische Ritualebenen, die nicht stillschweigend verschmolzen werden dürfen.

**Freestyle Rules v18.4:** Intro Ritual `Name It → Claim It → Power It`; nach der Story folgt ausdrücklich `Social Feedback — Did You Sell It?`. Dort stehen `KayfaBINGO`, `KayfaBONGO`, `KayfaBOGGLE`, `BLÖDSINN!`.

**Digitale Story-/Pet-/Overworld-Grammatik:** Mehrere aktuelle Dokumente verwenden ausdrücklich `SHOW IT → SPIN IT → SELL IT`; der Overworld-Entwurf nennt außerdem `SHOW IT → SPIN IT → SELL IT → QUEST`.

**Lead-Aufgabe:** Im nächsten Kanon-Pass explizit dokumentieren, wie `Name/Claim/Power` und `Show/Spin/Sell` zueinander stehen. Bis dahin bleiben beide erhalten; keine erfundene Harmonisierung.

Aktuelle Overworld-Schreibweisen sind `KayfaBINGO`, `KayfaBONGO`, `KayfaBOGGLE`, `BLÖDSINN!`; ältere Quellen enthalten Varianten.

# 40 · Conspiracy/Card Closure · korrigierte Grammatik

```text
SHOW IT
→ SPIN IT
→ SELL IT
→ SOCIAL / PERSONAL RESPONSE
   ├─ Closure
   ├─ Social Call
   ├─ POP
   └─ optionale D6-Einschätzung
→ optional CHECK / EVIDENCE
→ optional RE-CLOSURE / RE-RATING
→ KEEP / ALMANAC
```

Damit kann eine Conspiracy Card erst auftreten, interpretiert und performativ verkauft werden. Erst danach bewertet Spieler/Tisch/Publikum sie. Evidence bleibt wiederum eine getrennte Ebene.

# 41 · Social Call Totem / Oracle

Neue Ideennotiz: Social Calls und D6-Reaktionen können als personalisierbares **sechsstufiges 3D-Totem** erscheinen.

```text
[ HEAD 6 ]
[ HEAD 5 ]
[ HEAD 4 ]
[ HEAD 3 ]
[ HEAD 2 ]
[ HEAD 1 ]
   CARD
```

Jede Ebene kann eigenes Face/Mask, Farbe, Eye Rig, Flapper Mouth, Squash/Bounce und Reaktion besitzen. Technisch/gestalterisch darf dies aus der Boxel-Sprache hervorgehen: stackbare Grundkörper, Augen, Münder, vertikale Kaskaden und Farbvarianten. Die sichtbare Form kann jedoch als fiktionalisierte Cartoon-Maske, Monsterkopf oder geschnitztes Fantasy-Objekt interpretiert werden statt als nackter Cube.

Die sechs Slots können D6-Skala, sechs Reaktionen, sechs Personas oder sechs Closure-Stimmen tragen; genaue Semantik bleibt offen.

Der Spieler kann Köpfe/Masken/Farben/Augen/Münder sammeln und sein Oracle zusammenbauen. Dadurch kann dasselbe Objekt Reaction Interface, Social-Call-Visualizer, Companion, Journey-Souvenir, Workshop-Customizing und Afterglow-Toy sein.

**Oracle Beat:** Card → Show/Spin/Sell → Köpfe erwachen → Augen richten sich aus → ausgewählte Ebene reagiert mit Mouth/Bounce/Glow → Social Call oder D6-Reaktion.

Fiktionale Buddy-/Oracle-Reaktion bleibt getrennt von realen Community-Daten und evidenzbasierter Bewertung.

# 42 · Totem Builder / Afterglow / Minecraft-lite

Kein vollständiges Minecraft. Nur robuste Verben:

`stack · rotate · swap · paint · attach face · attach eyes/mouth · activate`

Damit können Workshop/Afterglow kleine Totems, Maskentürme, Boxel-Treppen oder Portal-Sockel erzeugen. Mögliche Funktionen: Tourbus-/Garage-Deko, Iceberg-Oracle, Social-Call-Encounter, Quest-Marker oder diegetische Transition.

Beispiele:
- Treppe nach unten → tieferer Iceberg
- Treppe nach oben → neue Card Zone
- Turm → Quest/Oracle
- Portal-Sockel → anderes Deck

# 43 · Fraktale KFB-Invariante

Die digitalen Module bleiben nur kohärent, wenn die KFB-Grundgrammatik als Invariante behandelt wird:

```text
OFFER / CARD
→ PERFORMANCE
→ AUDIENCE / CLOSURE
→ CONSEQUENCE
→ MEMORY
→ RECOMBINATION
```

Konkreter:

```text
SHOW IT
→ SPIN IT
→ SELL IT
→ SOCIAL CALL / POP / CLOSURE
→ ALMANAC
→ KAYFABULATION
→ CUTSCENE / QUEST
```

Combat, Travel, Iceberg, Boxel, Workshop, Totem, Quest und Cinematics dürfen diese Struktur unterschiedlich inszenieren, aber nicht semantisch umsortieren.

**Lead-Regel:** Wenn eine neue Mechanik einen kanonischen KFB-Begriff verwendet, vor dem Bau dessen Rolle im Grundspiel prüfen. UX-Vereinfachung darf die fraktale Logik nicht verändern.
