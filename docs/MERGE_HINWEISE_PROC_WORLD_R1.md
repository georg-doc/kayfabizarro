# Merge-Hinweise: `game/mvp-r1` → `game/proc-world-ws0` · R1

Stand 27.10.2026, WS1 Lead für WS0 · Analyse ohne Eingriff in euren Zweig

**Lage:** `game/proc-world-ws0` @5fb46e7 (V-861) mit `game/mvp-r1` @9a95ea9 (= WS1 mvp e88689c, neu gespiegelt am 27.10.). Gemeinsame Basis 2b96e8a.
- Probe-Merge mit `git merge-tree`, ohne Commit: **17 Konflikte in 4 Dateien**. Alles andere mischt sich automatisch, auch HUD (`HudClay.jsx`), `cueMap.js`, S3-Szenen und Disco-Besetzung.
- Gegenüber dem vorigen Spiegel (@e7c4ce3) kommt nur die Disco-Besetzung dazu (WS-NPC 55e2a11). Die Konfliktliste ist dieselbe.

Nachstellen:
```
git merge-tree --write-tree --name-only origin/game/proc-world-ws0 origin/game/mvp-r1
```

## Ursache: zwei Wege für S1 „Auto rufen“
| | WS0 (`proc-world-ws0`) | WS1 (`mvp-r1`, WS1d) |
|---|---|---|
| Schalter | `mount=live` | `travel=1` |
| Zustand | `CAR_LIVE { on, at, set, summons, dismounts }`, `summonCar()` / `dismountCar()` / `toggleCar()` in `M1World.jsx` | `travelState.js` (eine Zustandsmaschine zu Fuß, Auto, Flug), `TRAVEL_SM`, `travelClick()`, `<TravelHost>` |
| Abfrage „fährt gerade“ | `CAR_LIVE.on` | `carLive()` aus `M2Car.jsx` (`M2_ON \|\| TRAVEL.car`) |
| M2Car-Prop | `at={CAR_LIVE.at}`, `key` je Ruf | `travel={…}` |
| Extras | Fall ins Bild (V-825 `summon=classic`), KnuckleBob-Begrüßung (V-810), Fahrzeug-Seele, `carKick` | Fluff-Saugen bzw. Entstehen (`travelFluff.js`, Richtung build/suck), Vorwärmen (`prewarmRacer`), `carYaw` |

**Empfehlung Lead:**
- WS0 baut S1 laut V-756 selbst. Deshalb bleibt euer `mount=live`/`CAR_LIVE` die Basis.
- Damit der übrige WS1-Code (HUD, Ton, Telemetrie) ohne Umbau weiterläuft, gebt `carLive` als Alias heraus: `export const carLive = () => CAR_LIVE.on`.
  - Achtung: Im Moment wohnt `carLive` in `M2Car.jsx`, `CAR_LIVE` in `M1World.jsx`.
  - Vorschlag: `CAR_LIVE` und `carLive` in ein kleines Modul (z. B. `src/m1/carLive.js`), damit es keinen Import-Kreis M1World ↔ M2Car gibt.
- `travel=1` und `travelState.js` kann man stehen lassen (nur hinter dem Schalter) oder entfernen; das entscheidet ihr.
- Was davon wertvoll ist und in euren Weg gehört:
  - Fluff-Effekt beim Erscheinen und Verschwinden (`travelFluff.js`);
  - Lese-Haken `travelState()` für das Fahrzeug-Symbol im HUD (WS1e);
  - `prewarmRacer`, damit der erste Ruf ohne Shader-Ruckler kommt.

## Konflikt für Konflikt

### `src/m2/M2Car.jsx` (4)
1. **`RACER_FLY` / `WATER_WORLD` (Zeile ~121):** eure Zeilen nehmen (V-822: Racer-Flug Standard, `fly=0` schaltet ab). `TRAVEL_ON`, `TRAVEL`, `carLive` aus unserer Seite nur übernehmen, wenn ihr `travel=1` behaltet; sonst `carLive` als Alias, siehe oben.
2. **Signatur `M2Car({ player, at })` gegen `({ player, travel })`:** eure (`at`). Unser `travel`-Objekt nur bei behaltenem Schalter, dann beide Props.
3. **`M2STATE.carPos/carKick` gegen `carPos/carYaw`:** **beides** (Vereinigung). `carKick` braucht die Kuppel (V-835), `carYaw` nutzt unsere Kamera bzw. Telemetrie.
4. **Kamera/Speedlines (Zeile ~437):** eure Fassung (V-825 Steiggeschwindigkeit, Boost-FOV). Unsere Seite hat dort nichts Neues außer dem Travel-Fall; prüfen, dass `loadModel()`/`freeze` beim Live-Ruf wie bei euch laufen.

### `src/m1/M1World.jsx` (7)
1. **Importe (Zeile 25):** Vereinigung. Eure Welt-Importe (HyperSphere, MindSphere, GeniusLocus, PopupKulisse, RoadsideBoards, ImpactDebris, clipPip, vehicleSoul, seeThrough, LocusTrigger) und aus unseren `prewarmRacer`, `M2EVENTS`. `createTravelState`/`createTravelFluff` nur mit `travel=1`.
2. **S1-Block (Zeile 336):** euer `CAR_LIVE`/`summonCar`/`SeeThrough`. Unser `TRAVEL_SM` nur bei behaltenem Schalter.
3. **`telemetry` (Zeile 380): unbedingt unsere Fassung.**
   - Sie liefert zu Fuß im Schwungflug Tempo und Höhe über Grund (`footFlightTelemetry`, `src/m1/hudTelemetry.js`). Das ist **Georgs Entscheid „Säule zu Fuß, Höhe über Grund“** (25.10., HUD Paket 7).
   - `carLive()` dort durch `CAR_LIVE.on` bzw. den Alias ersetzen.
   - Eure Fassung gibt zu Fuß `null`, dann ist die Säule beim Fußflug leer.
4. **`mode`/`setMode`/`travelState` (Zeile 391):** euer `setMode` mit `MOUNT_LIVE`. Dazu **unseren Lese-Haken `travelState`**, notfalls als `null`, damit das HUD-Fahrzeug-Symbol nicht ins Leere greift.
5. **`collector` (Zeile 411):** gleichwertig; `CAR_LIVE.on` oder Alias.
6. **`fitTarget` (Zeile 494):** gleichwertig; `CAR_LIVE.on` oder Alias.
7. **JSX (Zeile 838):** eure Zeilen (live gerufenes Auto mit `key`, Werbetafeln, Genius Loci, Kuppel, H15, LocusTrigger). Unser `<TravelHost>` nur mit `travel=1`.

### `src/audio/kfbAudio.js` (3), Owner WS-Audio bzw. WS0 (V-841)
1. **Importe (Zeile 20):** Vereinigung beider Listen; unsere Seite bringt zusätzliche Namen aus `audioLogic`/`cueMap` mit, z. B. die Biom-Musik.
2. **`createRacer` (Zeile 135):** eure Fassung mit `ENGINE_OFFLOAD` (Motor ohne Last, V-807) behalten. Ziel-Bus prüfen: bei euch `G.buses.sfx`, bei uns ein eigener `G.buses.racer` (WS-Audio, Motor getrennt regelbar). Gibt es den Bus bei euch nicht mehr (V-841 Audio-Routing), `sfx` lassen. Sonst `racer` nehmen, damit der Regler „Motor“ wirkt.
3. **`stats()` (Zeile 614):** Vereinigung der Felder (unsere Seite: `racer.gain`, eure: `loops` u. a.). Nur Diagnose, kein Verhalten.

### `src/audio/AudioHost.jsx` (3)
1. **`unlock` (Zeile 42):** eure (`preload({ car: true })`, V-807: auch das live gerufene Auto hat Ton).
2. **Fahrzeug-Ereignisse (Zeile 55):** eure (abonniert immer, dazu Fahrzeug-Seele V-810). Unser Kommentar sagt dasselbe; nichts geht verloren.
3. **`expose('Audio', …)` (Zeile 164):** Vereinigung (`captureStream` von euch, `worldBiome` u. a. von uns).

## Nach dem Merge prüfen (Vorschlag)
- `npm run build`, dann `contract-static`, `hud-3d`, `hud-clay`, `s1-travel` (nur mit `travel=1`), `audio`, `talk`, `scenes`.
- Mit Site-Hash: zu Fuß fliegen → HUD-Säule zeigt Tempo und Höhe über Grund; Auto live rufen → Motor-Ton sofort; Aussteigen → Säule wieder zu Fuß.
- Wer den Merge macht: ihr. Der Lead mergt nichts in `game/proc-world-ws0`.
