# CONTRACT.md · Ist-Stand der Eigentuemer (R0)

**Status:** IMPLEMENTATION · abgelesen am re-homed Baum, 2026-09-13
**Regel des Projekts:** eine Groesse, ein Eigentuemer. Wer sie braucht, bekommt sie hereingereicht.

Dies ist die **Kurzfassung fuer den Re-home**. Die ausfuehrliche, am Code abgelesene Fassung ist
`docs/v13/WIRT_v13.md` (§0–§11). R0 entwirft hier nichts neu.

| Groesse / Zustaendigkeit | Eigentuemer (Datei) | Uebergabe an andere Module |
|---|---|---|
| Weltmass, Saat, Gelaendeart | `globe-v13/globe-poc.js` (Wirt) | `radius`, `seed`, `terrainType` im Konstruktor |
| Kugelflaeche / gebackenes Netz | `globe-v13/globe.js` | `bodenMesh` |
| Bodenhoehe | `globe-v13/boden-lesung.js` | `bodenRadius(up)` — Funktion, nie Zahl |
| Hoehenfunktion (Rueckfall) | `globe-v13/globe-field.js` | `surfaceAltitudeAt`, ausdruecklich nur Rueckfall (±8 mm) |
| Kugelmathematik | `globe-v13/spherical-math.js` | direkt importiert |
| Flugbewegung / Spielerort | `globe-v13/carpet.js` **ausschliesslich** | `carpet.worldPos()`, `setPlayer(pos, alt)` |
| Flugeingaben | `globe-v13/flight-controls.js` | in den Wirt |
| Kamera | `globe-v13/camera-rig.js`, gehalten im Wirt | `setCamera(c)` |
| Kartentraeger (Karte als Fahrzeug) | `terrain-planets-v1/card-carrier.js` | Wirt haengt an |
| Passagier / Pet-Praesentation | `terrain-planets-v1/kfb-pets.js` + `globe-v13/pet-*.js` | `CubePet`/`PetLibrary`/`PetMotion`/`PetFace`/`PetMouth` (remote registriert) |
| Blattformat der Karten | `cardbuilder/kfb-card-format.js` | `CARD_AR`, `fitCell` — EINE Stelle |
| Kartenregister / Kartenraster | `terrain-planets-v1/card-registry.js` + `card-grids.json` | Zahlen nur in der JSON |
| Karten-Einsammeln / Choreografie | `globe-v13/sky-cards.js`, `card-flight.js`, `collect-hud.js` | `fx.fire('card.collect')` |
| Kartentuerme / Landmarken | `globe-v13/card-towers.js`, `globe-landmarks.js` | Belegung ueber `frei` |
| Belegung der Oberflaeche | `globe-v13/verteilung.js` | `frei(n, r)` herein, Eintrag ueber den Wirt |
| Portale | `globe-v13/portal.js` (+ `rift.png`) | `fx`-Kaskade, Wirt haengt an |
| Leichte Himmelsgegner / Feuer | `globe-v13/sky-enemies.js`, `sky-dice.js` | `setPlayer(pos, alt)` — eine Eingabe je Bild |
| Fahrzeugvertrag (Zusage vs. Ist) | `globe-v13/fahrzeug-vertrag.js` | 13 `VERBOTENE_FELDER` |
| Mech-Station | `globe-v13/mech-station.js` + `modules/kfb-mech-combat.js` | `?mech=0` schaltet ab |
| Tag/Nacht | `globe-v13/day-night.js` (`zyklus.nachtGewicht`) | `setNacht(w)` |
| Wetter / Atmosphaere / Himmel | `globe-v13/weltstimmungen.js`, `sky-atmosphere.js`, `sky-presets.js`, `rain-overlay.js` | Wirt |
| Licht / Tint / envMap | `globe-v13/pet-lighting.js`, `to-phong.js`, `light-budget.js` | `lighting.register(obj)` **nach** dem `add` |
| Ereignisse (EIN Eingang) | `globe-v13/fx-bus.js` + `fx-script.js` | `fx.fire(name, ctx)`, Kaskaden als Daten |
| Kamera-Erschuetterung | `globe-v13/trauma.js` (`GEWICHTE`) | ueber `fx` |
| HUD / Regler | `globe-v13/hud-flight.js`, `collect-hud.js`, `settings-panel.js`, `hud-frame.css` | Module deklarieren `params`, zeichnen kein UI |
| Audio | `globe-v13/travel-audio.js`, `tiny-audio.js`, `audio-switch.js` + `jukebox.json`/`sfx.json` | `T` Klang-Tor |
| Cartoon-Verformung (geteilt) | `kfb-cartoon-deform.js`, `kfb-deform-instanced.js` | Projektwurzel, von mehreren Linien benutzt |
| Prop-Namen / Asset-Index | `asset-repo.json` (986 Assets mit `ghUrl`) | gelesen von `globe-landmarks.js`, `sky-enemies.js` |
| Buehne / DOM-Wurzel | `buehne()` im Wirt (Funktion, wegen Shadow-Root-Neubau) | `mount` im Konstruktor |

## Grenzen, die R0 nicht anfasst

- Bewegung gehoert `carpet.js` (E-43). Kein Modul bringt ein Bewegungsfeld mit.
- `dt` kommt herein; keine eigene Uhr in `update` ohne begruendete Messung (PM-50).
- Ein Modul haengt sich nie selbst in die Szene.
- `?mech=0` · `?flora=0` · `?tsflora=0` · `?muenzen=0` · `?portale=n` · `?gegner=n` bleiben Teil des Vertrags.

## Fuer R1 relevant

Der Passagier ist heute ein **Cube-Pet**, geliefert von `terrain-planets-v1/kfb-pets.js` ueber die
fuenf remote registrierten Globalen. R1 tauscht **nur** diese Praesentation. Eigentuemer von
Reiseposition und Kartenbewegung bleibt der Globe — der Aktor bekommt Sitzrahmen, Tempo, Bank,
Pitch, Steig-Eingabe und `dt` herein und speist nichts zurueck.
