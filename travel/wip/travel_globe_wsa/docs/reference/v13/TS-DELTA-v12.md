# TS-Delta · KFB Travel Globe v12 → tinyskies

Stand 3.9.2026 · Quelle `georg-doc/tinyskies@2659a5cc987d`, Branch `cursor/globefly-multiplayer-globe-flight-game`
Gezählt: **78 Module** in `client/src/game`, **16** in `client/src/ui` · unser Zweig: **80 Module** in `globe-v12`.

Diese Datei ist der Übergabestand für die nächste Sitzung. Sie sagt, was schon steht, was fehlt,
und in welcher Reihenfolge sich das Fehlende lohnt — **nach Wirkung je Aufwand, nicht nach
Dateigröße**. Sie behauptet nichts über Code, den ich nicht gelesen habe; wo ich nur den Dateinamen
kenne, steht das dabei.

---

## 1 · Was schon portiert ist

| Quelle | Bei uns | Anmerkung |
| --- | --- | --- |
| `SimplexNoise` · `TerrainSurface` · `Globe` | `simplex-noise` · `terrain-surface` · `globe` | inkl. Ozean-Shader, Höhenbänder, Biom-Tönung |
| `SphericalMath` | `spherical-math` | Quaternionen-Flug, singularitätsfrei |
| `Carpet` · `CarpetMesh/Leaves/Trail/Wake/DriftSmoke` | gleichnamig | + unsere Erweiterung: Schweben (H) |
| `CameraRig` · `FlightControls` | `camera-rig` · `flight-controls` | + Pfeil-runter belegt |
| `Game.ts` Intro (2933–3110) | `intro-flight` | 3.9. 1:1 nachgebaut, eine Kurve, Großkreis-Slerp |
| `DayNightCycle` · `SkyPresets` | `day-night` · `sky-presets` | 195-s-Zyklus, 24 interpolierte Werte |
| `RimLight` | `rim-light` | Fresnel-Saum, geteilte Randfarbe |
| `Aurora` · `GodRays` | `sky-atmosphere` | seit 1.9. (v7), zeichengleich; Sonnenabstand 13,15 statt Lampenposition · **3.9. abends: stand hier fälschlich unter „fehlt"** |
| `LensFlare` | `lens-flare` | |
| `RainOverlay` | `rain-overlay` | inkl. `getRainWeight` |
| `Landmarks` | `globe-landmarks` | + Kit-Maßstab, AO, Zonenplanung |
| `CarpetPortalSystem` · `CosmicWorldPortal` (teilweise) | `portal` | Durchflug ja, Void-Welt nein |
| `SkyGremlins` | `sky-enemies` | Ziele ja, Herzen/Schaden nein |
| `Rings` · `RingCollectVFX` | `muenzen` | 3.9. übernommen: Timing, Ausbruch |
| `HUD` (Teile) | `collect-hud` · `hud-flight` | Fächer, Pop-Zähler, Fluglage |

**Eigenständig, ohne Vorbild:** Karten-Teppich (56 Terrain-Karten), Karten-Türme, Sky-Cards,
Würfel, Mech-Station, Erzähler, Weltstimmungen, Kit-Maßstab, Streuungsschicht, TS-Vegetation.

---

## 2 · Was fehlt — nach Wirkung je Aufwand

### Stufe A · kleine Dateien, sofortige Wirkung auf Atmosphäre
Das ist die Stufe, die das Bild verändert, ohne dass ein System dazukommt.

> **Korrektur 3.9. abends:** `GodRays` stand hier als erste Zeile. Falsch — es ist seit 1.9. in
> `sky-atmosphere.js` portiert, verdrahtet (Panel: „God-ray strength", Weiß-Tor) und gemessen. Ich hatte
> die Quelle gezählt, nicht unseren Bestand gelesen. Zeile entfernt statt korrigiert (§4, Regel 2).

| Quelle | kB | Was es tut | Warum zuerst |
| --- | --- | --- | --- |
| ~~`Contrails.ts`~~ | 4,8 | **portiert 3.9. abends → `globe-v13/contrails.js`** (1:1; Ansatz an den Teppich-Hinterecken statt Flügelspitzen, deklariert) | erledigt |
| `FireflyCluster.ts` | 10,6 | Glühwürmchen-Schwärme | die Nacht ist bei uns dunkel und leer; das ist der billigste Lebendigkeits-Gewinn |
| `FloatingLanterns.ts` | 9,1 | aufsteigende Laternen | dito, und es passt zum KFB-Ton |
| `BirdFlock.ts` | 13,7 | Vogelschwarm mit Formation | Tag-Gegenstück zu den Glühwürmchen |

### Stufe B · Ereignisse, die eine Reise zu einer Reise machen
Hier kommt Dramaturgie dazu — jedes Stück ist für sich spielbar.

| Quelle | kB | Was es tut | Anmerkung |
| --- | --- | --- | --- |
| `MeteorShower.ts` | 20,1 | Meteoritenschauer als Nachtereignis | Ereignis mit Vorwarnung, Einschlag, Nachglühen |
| `SkyJellyfish.ts` + `Mesh` | 32,2 | schwebende Quallen im Himmel | **passt von allen Quell-Modulen am besten zu Kayfabizarro** — surreal, ohne Erklärung |
| `FlagSystem.ts` | 13,3 | Fahnen an Landmarken | löst zugleich unser offenes Problem: der Wahrzeichen-Satz ist auf eine Silhouette runter |
| `Braziers.ts` | 36,9 | anzündbare Feuerschalen, „rise from the earth"-Reveal | erste echte INTERAKTION mit der Welt außer Sammeln |

### Stufe C · Systeme — eigener Bau, eigene Sitzung
Nicht schwerer zu portieren, aber sie ziehen Zustand, HUD und Fortschritt nach sich.

| Quelle | kB | Was es tut |
| --- | --- | --- |
| `MoonThreat.ts` | 33,6 | der Weltuhr-Antagonist: ein Mond, der näher kommt, samt Kinematik und Endphase. Das ist der Grund, warum eine tinyskies-Runde einen Bogen hat |
| `CampsiteScene/Marker/Controls` | 72,2 | Heimatlager: Landen, Aussteigen, Bodenszene |
| `EternalFlame*` (3 Dateien) | 36,1 | Endspiel-Ort |
| `UpgradeManager` · `ProgressionManager` · `LevelUpCards` | ~25 | Fortschritt, Stufenaufstieg, Kartenwahl |
| `RaceManager` | ~12 | Zeitrennen |
| Fahrzeuge: `Boat*`, `Biplane*`, `Npc*` | ~55 | Boot und Doppeldecker als Alternativen zum Teppich |

### Bewusst NICHT übernehmen
- `VoidMoths`, `VoidHearts`, `GremlinHearts` — hängen an der Void-Welt, die wir nicht haben.
- `FishCatchVfx`, `CarpetLandmarkSelfieQuest` — Quest-Mechanik ohne Gegenstück bei uns.
- Netzwerk (`SocketClient`, `StateSync`, `Lobby`) — Mehrspieler ist kein Ziel dieses Zweigs.

---

## 3 · Offene Baustellen aus v12 (unabhängig von der Quelle)

1. **Wahrzeichen-Satz auf eine Silhouette runter.** Turm, Mühle, Markt sind raus (grau-braun);
   nur der Zauberturm bleibt, 13 Bauplätze stehen leer. Zwei Wege: neue Modelle, oder die drei in
   die aktuelle Palette umlackieren. `FlagSystem` (Stufe B) wäre der dritte.
2. **Licht- und Farb-Environments für KFB.** Die Quelle hat drei Presets à 24 Werte plus einen
   zweiten Regler (`moonProgress`), der alles Richtung Nacht zieht. Georgs Richtung: psychedelisch-
   surreal, harmonische Paletten, **kein Tusche-Look**. Vorschlag: 3–4 zusätzliche Presets mit
   eigener Logik in denselben Blender — harmonisch bleibt es durch die Interpolation, surreal wird
   es durch die Endpunkte.
3. **Fels-Ausnahme steht, Wahrzeichen-Ersatz nicht.** Die Felsfamilie wurde am 3.9. um 1,75
   angehoben (Median 0,60 → 1,01 Baumhöhen, Verhältnisse erhalten, Deckel 2,2). `?fels=1` gibt
   den kit-treuen Zustand zurück.
4. **Gegner und Props.** Behoben am 3.9., aber die Klasse bleibt offen: Gegner halten Abstand zum
   GELÄNDE (`surfaceAltitudeAt`), nicht zu PROPS (`bodenRadius`). Vulkane sind jetzt Sperrzonen,
   um die herumgeflogen wird — Türme, Portale und Landmarken sind es NICHT. Wer das sauber will,
   gibt den Gegnern denselben Belegungsleser, den die Streuung schon benutzt.
5. **Die atmende Welt** (Georgs Kernidee, 3.9.): Deck + Seed als Quelle einer Geografie, die je
   Reise anders ist und sich WÄHREND der Reise nach Zonen ändert. Bausteine liegen alle vor und
   sind seed-getrieben; es fehlt eine Instanz, die aus dem Deck liest und die Regler setzt
   (`welt-partitur.js`). **Offene Entscheidung vor dem Bau:** bestimmt die Karte die Geografie
   (Kartentyp → Biom) oder färbt sie nur (Geografie bleibt Seed, Karte dreht Palette/Wetter)?

---

## 4 · Arbeitsregeln, die sich in dieser Sitzung bewährt haben

- **Erst messen, dann drehen.** Jede Beschwerde dieser Sitzung hatte eine Zahl als Ursache, und in
  drei von fünf Fällen war meine erste Vermutung falsch (Bremse, Karten im Wasser, Intro-Ruck).
- **Ein falscher Kommentar ist teurer als ein Fehler.** Zweimal habe ich eine Ursache behauptet,
  die die Messung widerlegt hat; beide Kommentare sind entfernt statt korrigiert.
- **Wer eine Klasse ablöst, sucht ALLE ihre Quellen.** Die Kit-Pflanzen lagen in zwei Modulen.
- **Einen Eintrag aus einem gewichteten Satz zu nehmen entfernt seine Plätze nicht — es verteilt
  sie um.** 720 identische Felsen waren die Quittung.
- **Eine Größe oder Farbe ist keine Eigenschaft des Objekts, sondern seiner Nachbarschaft.**
  Gilt für die grau-braunen Bauten wie für die Felsen.
- **Zwei Stellen, die dasselbe bestimmen, sind eine zu viel** — Münz-Aufrichtung, Kamera-Posen,
  Tempo-Sockel: dieselbe Fehlerklasse in drei Farben.
