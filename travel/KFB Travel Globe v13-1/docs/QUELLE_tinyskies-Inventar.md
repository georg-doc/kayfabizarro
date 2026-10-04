# Quellenbericht · tinyskies-Inventar: Fahrzeuge, Travel Modes, FX, Mond und Weltraum

**Auftrag (Georg, 30.8.):** *„welche vehikel und travel modes/FX bietet tinyskies noch an…? was ist
mit den mond- und weltraum-sequenzen/modes/level dort…?"*

**Was das hier ist:** eine **Bestandsaufnahme**, kein Plan und kein Slice. Gelesen am 30.8. am
Branch `cursor/globefly-multiplayer-globe-flight-game`, Stand `2659a5cc987d`, über
`client/src/game/` — **78 Dateien**, das vollständige Verzeichnis. Was hier steht, ist an
Dateinamen, Dateigrößen und Fundstellen belegt; wo ich nur den Namen kenne und nicht den Inhalt,
steht es dabei. **tinyskies ist Benchmark, nicht Grundlage** — das gilt für dieses Dokument
besonders, weil die Liste zum Abschreiben verführt.

---

## 0 · Die Kurzfassung, in vier Sätzen

1. **Drei Fahrzeuge**, und die Quelle hat den Fahrzeug-Vertrag, den ich im Backlog für die
   Badewanne vorgeschlagen habe, **schon gebaut**: eine Feature-Tabelle je Fahrzeug.
2. **Zwei Welten**, nicht eine: die Kugel und der **Cosmic Void** — mit eigenem Zustand, eigener
   Übergangsblende und einer Liste von Systemen, die dort ABGESCHALTET werden.
3. **Der Mond ist keine Kulisse, sondern eine Bedrohung mit Uhr** — und fünf Feuerschalen mit
   Ewigen Flammen frieren ihn ein. Das ist die Endgame-Mechanik des Spiels.
4. **Die Menge ist der Punkt, nicht das Einzelteil:** rund 30 der 78 Dateien sind Welt-Leben und
   FX. Wer daraus eine Wunschliste macht, hat eine Wunschliste; wer zwei davon nimmt und richtig
   verdrahtet, hat ein Spiel.

---

## 1 · Fahrzeuge — drei, plus ein Vertrag, plus Tutorials

| Datei | Größe | Was es ist |
|---|---|---|
| `Carpet.ts` | 18 kB | der fliegende Teppich — **das haben wir 1:1** (`carpet.js`) |
| `CarpetMesh.ts` | 5 kB | sein Mesh (castet UND empfängt Schatten, siehe R1 in §06b) |
| `Boat.ts` | 8 kB | **das Boot** — Bewegungsmodell, bewusst noch NICHT gelesen (siehe Backlog) |
| `BoatMesh.ts` | 17 kB | Rumpf aus Planken + **Schaum-Wasserlinie als GEOMETRIE** |
| `Plane.ts` | 16 kB | **das Flugzeug** |
| `BiplaneMesh.ts` | 13 kB | Doppeldecker-Mesh |
| `PilotAvatar.ts` | 17 kB | die Figur IM Fahrzeug — unser Gegenstück ist das Pet auf der Karte |
| `vehicleColors.ts` | 1 kB | Farbpalette je Fahrzeug, an EINER Stelle |
| `NpcBoats.ts` · `NpcPlanes.ts` | 7 + 8 kB | dieselben Fahrzeuge als Statisten |
| `RemotePlane.ts` | 17 kB | dasselbe Fahrzeug als Mitspieler (Multiplayer) |

### ⭐ Der Befund, der für uns zählt: die Quelle hat den Fahrzeug-Vertrag schon

In `Game.ts` stehen drei Typen nebeneinander:

```
type Vehicle
type VehicleGameFeatures
type VehicleTutorialHints  ·  type VehicleTutorialStepId  ·  VEHICLE_TUTORIAL_STEPS[vehicle]
```

und im Frame-Loop steht die Zeile, um die es geht:

```
if (this.vehicleFeatures.speedLines && !this.inCosmicVoid) …
```

**Ein Fahrzeug ist dort keine Klasse mit Sonderfällen, sondern ein Eintrag in einer
Feature-Tabelle** — und der Frame-Loop fragt die Tabelle, nicht den Typ. Genau das habe ich im
Backlog für die Badewanne vorgeschlagen, ohne zu wissen, dass die Quelle es so löst. *Das ist die
beste Sorte Bestätigung: nicht „die machen es auch so", sondern „die Bauform hält drei Fahrzeuge,
und sie kostet eine Tabelle".*

Dazu: **jedes Fahrzeug bringt sein eigenes Tutorial mit** (`VEHICLE_TUTORIAL_STEPS`), als
Schrittliste in Daten. Für uns interessant, weil ein freispielbares Fahrzeug ohne Einführung
kein Geschenk ist, sondern eine Fehlbedienung.

**Was das für die Badewanne heißt:** der Vertrag im Backlog bekommt ein sechstes Feld —
`features` (welche FX dieses Fahrzeug überhaupt hat). Und er bekommt einen Beleg, dass er trägt.

---

## 2 · Travel Modes — es gibt zwei WELTEN, nicht mehrere Modi

Der Begriff „Travel Mode" trifft es nicht ganz: die Quelle hat keine Modus-Liste, sondern
**einen Weltzustand mit zwei Werten** — Kugel oder Void.

```
private inCosmicVoid = false;
private voidEntryInProgress = false;          // während der Blende
private coastCarpetDuringCosmicTransition;    // das Fahrzeug rollt weiter, während umgeblendet wird
doEnterCosmicVoid()  ·  exitCosmicVoid()
```

**Der Eintritt ist ein Portal-Durchflug**, kein Menü (`CarpetPortalSystem.ts` 19 kB,
`CosmicWorldPortal.ts` 13 kB — beide sind für Slice E schon zitiert: Trefferfläche 1,47× der
sichtbaren, „forgiving teleports").

### ⭐ Der lehrreichste Teil ist die ABSCHALTLISTE

Im Void werden systematisch Systeme stillgelegt, jedes mit einer eigenen Abfrage. Belegt im
Frame-Loop von `Game.ts`:

`speedLines` · `lensFlare` · `rainOverlay` · `npcPlanes` · `waterSpouts` · Twister-VFX ·
Portal-Interaktion · Moonstone-Fortschritt · und ein eigener Kamerazielwert (`voidCamTarget`).

Dafür kommen im Void eigene Systeme dazu: `VoidCarpetTrail.ts` (eine ANDERE Spur für dieselbe
Bewegung), `VoidMoths.ts` (31 kB), `VoidFlameShield.ts`, `VoidHearts.ts`,
`EternalFlameWorld.ts` — plus eine **inszenierte Einführung** mit gestaffelten Timern
(`scheduleCosmicVoidEternalFlameIntro`).

**Das ist eine Warnung und ein Muster in einem.** Warnung: rund **20 verstreute
`if (!this.inCosmicVoid)`-Abfragen** sind genau die Fehlerklasse, die dieses Projekt „zwei
Verwalter derselben Sache" nennt — ein Weltwechsel, der in zwanzig Modulen einzeln nachgezogen
werden muss. Muster: **ein zweiter Ort braucht nicht nur neue Inhalte, sondern eine LISTE dessen,
was dort nicht gilt.** Wenn wir je einen zweiten Ort bauen, gehört diese Liste in EINE Tabelle
(dasselbe Argument wie bei `vehicleFeatures`) und nicht in zwanzig `if`s.

⚠ Für uns ist der Void **nicht** der nächste Schritt. Unsere E-32-Entscheidung sagt ausdrücklich:
**Durchflug = Sprung auf DERSELBEN Kugel, weit entfernte Seite, kein Weltwechsel, kein Ladeschirm.**
Der Void ist der Beleg, dass die Entscheidung teuer erkauften Aufwand vermeidet.

---

## 3 · Mond und Weltraum — der Mond ist eine Uhr, kein Himmelskörper

Das ist die Antwort auf Georgs zweite Frage, und sie ist überraschender als erwartet.

| Datei | Größe | Rolle |
|---|---|---|
| `MoonThreat.ts` | **34 kB** | der Mond als **Bedrohung** — die größte Einzeldatei nach den zwei Monolithen und `SkyGremlins` |
| `Braziers.ts` | **37 kB** | fünf Feuerschalen, die angezündet werden |
| `EternalFlameBeams.ts` | 23 kB | Strahlen von den Feuerschalen **zum Mond** |
| `EternalFlameModel.ts` · `EternalFlameWorld.ts` | 5 + 8 kB | das Flammen-Modell, geteilt zwischen UI und Welt |
| `MeteorShower.ts` | 20 kB | Meteorschauer |
| `Aurora.ts` | 5 kB | Polarlicht |
| `Starfield.ts` | 8 kB | Sterne — **das haben wir 1:1** |

**Die Mechanik, aus den Fundstellen rekonstruiert:**

```
if (this.runFreeplayMode && !ws.moonFrozenByEternalFlames && this.moonThreat) …
const beams = new EternalFlameBeams(brazierPositions, moonPos);
if (newlyLitUsedEternalFlame && allFiveEternal) this.applyEternalFlamesMoonSave();
applyEternalFlamesMoonSave() → save({ moonFrozenByEternalFlames: true })
```

Also: **der Mond nähert sich (oder droht) im Freispiel-Modus, und wer alle FÜNF Feuerschalen mit
Ewigen Flammen anzündet, friert ihn dauerhaft ein** — der Zustand wird gespeichert. Die Strahlen
von den Schalen zum Mond sind die sichtbare Verbindung zwischen Ursache und Wirkung.

**Die Ewige Flamme ist die WÄHRUNG dafür**, und sie kommt aus den Quests:
`eternalFlameCount` wird erhöht durch Gremlin-König · Quallen-Set · dritte Paket-Lieferung ·
Boots-Mysterium-Oktopus · Rennen. Jede Quelle hat ihr eigenes `…Claimed`-Flag, damit sie nur
einmal zahlt. Belohnungs-Inszenierung: `eternalFlameUI.playKingLootSequence()`.

### Was daran wirklich interessant ist — und was nicht

**Nicht interessant für uns:** die Inhalte. Ein Mond, der die Welt bedroht, ist deren Geschichte,
nicht unsere. Kayfabizarro hat eine eigene (Karten sammeln, Decks, Kayfabe).

**Sehr interessant:** die **Bauform der Endgame-Klammer.** Sie besteht aus drei Teilen, und alle
drei fehlen uns komplett:

1. **Ein Druck mit Uhr** (der Mond) — ein Grund, warum man heute spielt und nicht irgendwann.
2. **Eine Währung, die aus mehreren Quellen kommt** (`eternalFlameCount` aus fünf verschiedenen
   Quests) — dadurch führt jede Aktivität in dieselbe Kasse.
3. **Ein sichtbares Ziel, das man mit dieser Währung bezahlt** (fünf Schalen), plus ein
   gespeicherter Endzustand.

*Bei uns gibt es Sammeln (Karten, Pop-Punkte) und keine Kasse, kein Ziel und keinen Druck. Das ist
keine Lücke im Code, sondern eine offene Design-Frage — und sie gehört zu Georg, nicht in einen
Slice.* Vorgemerkt als Frage, nicht als Aufgabe.

---

## 4 · FX und Welt-Leben — die vollständige Liste

**Was wir schon haben** (portiert oder eigen): `CarpetTrail` · `SpeedLines` · `CarpetLeaves` ·
`CarpetWake` · `CarpetDriftSmoke` · `Starfield` · `SkyPresets` · `DayNightCycle` · `RimLight` ·
`CameraRig` · `Carpet` · `FlightControls` · `SphericalMath` · `SimplexNoise` · `TerrainSurface` ·
`Landmarks` (Mechanik) · `FishCatchVfx` (nur die Kaskaden-Zeitachse).

**Noch nicht bei uns, nach Preis geordnet:**

| Billig und sofort sichtbar | Datei | Anmerkung |
|---|---|---|
| Kondensstreifen | `Contrails.ts` (5 kB) | im Backlog als „Fahrgefühl" schon genannt |
| Spur (generisch) | `Trail.ts` (4 kB) | Verwandter unseres `carpet-trail` |
| Gottesstrahlen | `GodRays.ts` (3 kB) | 3 kB — das billigste Stück Atmosphäre im ganzen Repo |
| Linsenreflex | `LensFlare.ts` (5 kB) | ⚠ Vorsicht: Blendeffekte fressen Cartoon-Lesbarkeit |
| Polarlicht | `Aurora.ts` (5 kB) | passt zu `frost` in Slice H |
| Regenbogen-Bogen | `RainbowArch.ts` (7 kB) | Kandidat als Durchflug-Ziel |
| Fahnen | `FlagSystem.ts` (13 kB) | **die Sway-Injektion, die unser Karten-Vorhang-Befund zitiert** |

| Mittel, verändert das Bild | Datei | Anmerkung |
|---|---|---|
| Regen-Overlay | `RainOverlay.ts` (11 kB) | Wetter als Bildschirmeffekt |
| Wasserfontänen | `WaterSpouts.ts` (13 kB) | 1500 Tropfen, **150 Partikel/s je Fontäne** |
| Glühwürmchen | `FireflyCluster.ts` (11 kB) | Nachtleben |
| Schwebende Laternen | `FloatingLanterns.ts` (9 kB) | passt gut zur Kartenwelt |
| Vogelschwarm | `BirdFlock.ts` (14 kB) | Himmel wird lebendig |
| Vulkan | `Volcano.ts` (20 kB) | Kandidat für `molten` (Slice H) |
| Meteorschauer | `MeteorShower.ts` (20 kB) | Himmelsereignis mit Uhr |

| Groß, eigene Systeme | Datei | Anmerkung |
|---|---|---|
| Himmelsquallen | `SkyJellyfish(+Mesh)` (19 + 14 kB) | eigene Kreatur mit Mesh |
| Ozeanfische | `OceanFish(+Mesh)` (37 + 21 kB) | plus Angel-Mechanik (`FishCatchVfx`) |
| Himmels-Gremlins | `SkyGremlins.ts` (**51 kB**) | Gegner + König + `GremlinHearts` |
| Feuerschalen | `Braziers.ts` (37 kB) | Endgame, siehe §3 |
| Campsite-Szene | `CampsiteScene.ts` (**47 kB**) + `CampsiteControls` + `CampsiteMarker` | **ein zweiter Ort mit eigener Steuerung** — Hub/Basis |
| Paketquest | `PackageQuest` + `PackageDialogue` (27 + 38 kB) | Quest MIT Dialogsystem |
| Rennen | `RaceManager.ts` (18 kB) | plus `Rings` + `RingCollectVFX` (15 + 11 kB) |
| Farbkugel-PvP | `PaintballSystem` + `PaintballSplash` (25 + 8 kB) | Mehrspieler-Kampf |
| Fortschritt | `ProgressionManager` + `UpgradeManager` (10 + 14 kB) | Upgrades mit Namen: `foam_surge`, `wake_rider` |
| Selfie-Quest | `CarpetLandmarkSelfieQuest.ts` (4 kB) | ⭐ **4 kB für eine ganze Quest** — Landmarke anfliegen, Bild machen |
| Touch | `TouchControls.ts` (16 kB) | Mobile |
| Capybara-Flammenschüsse | `CapybaraFlameShots.ts` (11 kB) | ihr Maskottchen schießt |

---

## 5 · Fünf Dinge, die ich mitnehmen würde — und eines, das ich nicht anfassen würde

**Mitnehmen (nach Verhältnis Wirkung zu Preis):**

1. **`vehicleFeatures` als Tabelle** (§1) — kostet fast nichts, entscheidet die Badewanne.
2. **`GodRays.ts`** — 3 kB Atmosphäre, und es passt zu jeder Weltstimmung.
3. **`CarpetLandmarkSelfieQuest.ts`** — 4 kB, und es ist das Muster für „eine Aufgabe, die aus
   dem vorhandenen Spiel besteht". Bei uns wäre es: eine bestimmte Karte im Vorbeiflug erwischen.
4. **`Contrails.ts`** — steht seit dem 29.8. im Backlog und ist immer noch billig.
5. **Die Endgame-Klammer als STRUKTUR** (§3), nicht als Inhalt: Druck + Währung + sichtbares Ziel.
   Das ist die einzige Zeile in diesem Dokument, die kein FX ist, und die wichtigste.

**Nicht anfassen, mit Grund:**

- **Den Cosmic Void als Bauform.** Zwanzig verstreute `if (!inCosmicVoid)` sind die Rechnung für
  einen zweiten Ort ohne zentrale Tabelle. Unsere E-32-Entscheidung (Sprung auf derselben Kugel)
  umgeht das absichtlich — und dieses Dokument ist der Beleg, dass sie richtig war.
- **`SkyGremlins` (51 kB) und `CampsiteScene` (47 kB)** sind keine Effekte, sondern Teilspiele.
  Wer sie „mal ansieht", liest einen Tag.
- **`LensFlare`** — technisch billig, gestalterisch teuer: Blendeffekte kosten Cartoon-Lesbarkeit,
  und wir haben in dieser Baureihe schon zweimal für „überstrahlt" bezahlt.

---

## 6 · Was noch NICHT gelesen ist

`Boat.ts` (**absichtlich** — erst entscheiden, ob Fahrzeuge nur Skins sind, siehe Backlog) ·
`MoonThreat.ts` (Mechanik nur aus Fundstellen rekonstruiert) · `Plane.ts` ·
`ProgressionManager.ts` · `UpgradeManager.ts` (nur zwei Upgrade-Namen belegt) ·
`CampsiteScene.ts` · `SkyGremlins.ts` · `PackageQuest.ts`. `Game.ts` (279 kB) und `Globe.ts`
(223 kB) bleiben Monolithen — daraus wird zitiert, nicht portiert.
