# RKIT · Breite der registrierten Spiel-Autos (V-126) für die Welt-Knoten-Grenze (V-143-Ergänzung) (R1)

Stand 2026-10-11 · nur Messung und Vorschlag, nichts umgebaut

## Messung

**Wie gemessen**
- Blender headless, Bounding-Box je Mesh in Modell-Einheiten.
- Danach skaliert wie im Lab:
  - Retro: `src/island/island.ts:58`, Länge 6,0 lab;
  - KayKit: `src/play/drive.ts:44`, Länge = `joyride.j06.json` `vehicles.len` 4,3 × RACE_W 1,46 = 6,278 lab.
- Welt-Familien (town / country) rechnen in K2- bzw. Lab-Einheiten (H 3,64, MC 6,4); `KFB_VEHICLE` 3,11 = Cicada.

| Auto | Modell L × B × H | Lab-Länge | **Lab-Breite** | Lab-Höhe |
|---|---|---|---|---|
| Retro Cicada (Standard, V-030) | 3,74 × 1,94 × 1,87 | 6,0 | **3,11** | 3,00 |
| Retro Cruiser | 4,47 × 2,11 × 1,90 | 6,0 | 2,83 | 2,55 |
| Retro Carrier | 4,61 × 2,12 × 2,23 | 6,0 | 2,76 | 2,90 |
| KayKit sedan / stationwagon / taxi / police | 0,938 × 0,419 | 6,278 | 2,80 | 2,47–2,91 |
| **KayKit hatchback** | 0,806 × 0,419 × 0,369 | 6,278 | **3,26** | 2,87 |

**Hinweise zur Messung**
- Das Cicada-FBX hat einen um 90° gedrehten BODY-Knoten gegenüber Rädern und Lampen. Die Maße stammen aus dem BODY, geprüft an den Rädern (Spur ±0,96).
- Der Hatchback ist im Modell kürzer (0,806). Die Lab-Regel skaliert jedes KayKit-Auto auf dieselbe Länge, deshalb wird er breiter als die anderen.

## Folge für die Grenze

- Das breiteste Auto ist der KayKit-Hatchback mit 3,26.
- Grenze: 3,263 / 2 + 0,15 = **1,781**, bisher 1,705.

| Knoten (Insel 16, Standard) | NPC-Abstand | bei 1,781 |
|---|---|---|
| TOWN / DRIVING_SCHOOL: Kreisel 1, 3 und 4 Arme | 1,885–1,941 | ok |
| TOWN / DRIVING_SCHOOL: Kreuzung T / X | 2,0 | ok |
| **COUNTRY / MOUNTAIN: Kreisel 3 und 4 Arme** | **1,753** | **rot** |
| COUNTRY / MOUNTAIN: Kreisel 1 Arm | 1,818 | ok |
| COUNTRY / MOUNTAIN: Kreuzung T / X | 1,875 | ok |
| HIGHWAY: alle | 2,25–5,34 | ok |

## Vorschlag (Entscheidung Steuerung bzw. Georg)

| | Weg | Wirkung |
|---|---|---|
| **1 (Empfehlung)** | KayKit-Autos mit **einem** gemeinsamen Faktor skalieren (Faktor des Sedan), statt jedes auf 4,3 m Länge zu ziehen | Hatchback 5,40 lang, 2,80 breit, so wie im Modell gedacht. Das breiteste Auto bleibt Cicada 3,11, Grenze 1,705. Kein Kreisel wird rot. Änderung im Lab (`loadKayKitCar`, eine Zeile), nicht im Core. |
| 2 | Hatchback aus der Liste nehmen | wie 1, ein Auto weniger |
| 3 | Grenze 1,781 und Landstraßen-Spur breiter (COUNTRY / MOUNTAIN lane NARROW 3,75 → STANDARD 4,0) | Kreisel wieder grün (Abstand steigt etwa um 0,125). Ändert alle Landstraßen-Ströme, also Teil 0 und Weltstraßen. |
