# Startzeitvergleich Straßennetz R04 · A/B/C · Mac mini · RETURN (WSB, 18.11.2026)

**Auftrag:** WS0 18.11. (Quelle `docs/roads-controls-r04/WSB_MEASURE.md` @b28f9c7d). Kein Merge, keine Site.

**Was gemessen wurde**
- **Heads** (je ein sauberer Arbeitsbaum, keine getrackten Änderungen):
  - A = Stamm `game/integration-r2` @`c9599274f25432a0b2aaf78cd1da490107495191`, ohne neue Schalter;
  - B = Kandidat `racer/roads-water-controls-r04` @`b28f9c7d9280f982347bce7dd970bf4cca2d4abe`, ohne neue Schalter (Off-Gegenprobe);
  - C = Kandidat @b28f9c7d mit `strassennetz=r1`. Wasser und racercontrols sind aus.
- **Gerät:** Mac mini Mac16,10 (Apple M4, 16 GB), macOS 26.3. Playwright 1.64.0 Chromium mit Metal (`--use-angle=metal`). Viewport 640 × 480.
  - Privater Teil @eb113fea. Ton aus (`mute`, Server `KFB_AUDIO=off`). Sonst lief nichts auf dem Rechner.
- **Bauart (für alle gleich):** `KFB_SPLIT=1 npx vite build --base ./` (Vite 8.3.4, je Stand 9 s, `dist` ≈ 1,0 GB).
  - Auslieferung mit `vite preview` (je Stand ein Server: A Port 5301, B/C Port 5302), gleiche Cache-Regeln (`Cache-Control: no-cache` + ETag).
  - Keine Entwicklungs-Paketierung.
- **Hash (alle):** `#m1,car=patch,world=endless,look=terrain3,sky=r1,debug,mute,fahrphysik=patch1,fahrprofil=r1,q=fast,vorlaufkappe=1,hour=15,tlapse=0,prefetch=0,ripple=0,loadprobe=r02,racer=<id>`.
  - Bei C kommt `,strassennetz=r1` dazu.
  - Saat wie voreingestellt, Startpunkt wie im Spiel.
- **Ablauf je Lauf** (frischer Browser-Kontext mit leerem HTTP-Cache und gelöschten `kfb.*`-Werten):
  1. Kalter Dokumentstart, dann 2 Spielsekunden Prüfung.
  2. Fahrt 1: ≥ 30 Spielsekunden Gas geradeaus ab Start, Nachladen während der Fahrt.
  3. Fernteleport per `setKind` nach x −1536, z 0 (für alle derselbe Punkt; bei C liegt dort Straße).
  4. Fahrt 2: ≥ 30 Spielsekunden ab dem Fernpunkt.
  5. Rückkehr zum Kaltpunkt.
  6. Warmstart: Neuladen im selben Kontext.
- **Runden:** 3 wechselnde Runden je Wagen (ABC, BCA, CAB). Davor je Stand ein verworfener Vorlauf. 18 gewertete Läufe, 0 Fehler, 0 Seitenfehler.
- **Zwei Maße:**
  - **Fahrbereit (außen)** gilt für alle drei gleich: `__kfbReady`, Modell OK mit richtiger Kennung, genau ein Wagenkörper, 4 Räder am Boden. Gezählt ab Navigation bzw. ab `setKind`.
  - **`loadprobe=r02`-Zeitleiste** gibt es nur bei B und C, denn **der Stamm @c9599274 hat `loadTimeline` nicht** (kein `src/m2/loadTimeline.js`). Gemessen bis `state` ready, dazu `cpu.colliderInstallMs` und `terrain.roadInfo()`.
- **Fahrt:** Spielzeit (`__kfbM2.clock.t`) und Uhrzeit alle 250 ms, keine feste Uhr-Wartefahrt.
  - Takt = Spielzeit / Uhrzeit, dazu der kleinste Takt in einem 5-s-Fenster und die verlorene Uhrzeit (Σ max(0, Uhr − Spiel)).
  - `__kfbDrive.perf` gibt Schritt und Collider in ms; `roadInfo` liefert built, lateBuilds und maxPrepareMs.

## Sechs Ladefälle je Vergleich · fahrbereit (außen), Sekunden · Median [Rohspanne aus 3]

| Wagen | Fall | A | B | C | B−A | C−B | C−A |
|---|---|---:|---:|---:|---:|---:|---:|
| Rennwagen (patch_vireo) | Kaltstart | 3.924 [3.923–3.995] | 4.039 [3.995–4.114] | 4.113 [4.041–4.184] | +0.12 | **+0.07** | +0.19 |
| Rennwagen | Fernteleport | 1.459 [1.446–1.704] | 1.554 [1.545–1.583] | 1.345 [1.088–1.357] | +0.10 | −0.21 | −0.11 |
| Rennwagen | Rückkehr | 0.549 [0.542–0.552] | 0.535 [0.533–0.542] | 0.545 [0.534–0.569] | −0.01 | +0.01 | −0.00 |
| Dieselpunk (crimson_flame_dragster) | Kaltstart | 3.994 [3.930–4.067] | 3.999 [3.942–4.027] | 4.065 [4.033–4.335] | +0.01 | **+0.07** | +0.07 |
| Dieselpunk | Fernteleport | 1.622 [1.597–1.659] | 1.606 [1.551–1.632] | 1.263 [1.140–1.417] | −0.02 | −0.34 | −0.36 |
| Dieselpunk | Rückkehr | 0.545 [0.541–0.553] | 0.548 [0.543–0.558] | 0.574 [0.555–0.583] | +0.00 | +0.03 | +0.03 |
| Rennwagen | Warmstart | 3.433 [3.244–3.814] | 3.807 [3.790–3.918] | 4.104 [3.975–4.209] | +0.37 | +0.30 | +0.67 |
| Dieselpunk | Warmstart | 3.876 [3.859–4.006] | 3.403 [3.187–3.866] | 4.083 [4.070–4.088] | −0.47 | +0.68 | +0.21 |

- In den 2 Spielsekunden nach fahrbereit liegt der Takt bei A 0,96–0,97, bei B und C 0,99–1,00.
- Keine Bodenverletzung, immer genau ein Körper.
- 4 Räder am Ende: alle 3/3, außer **A Diesel nach Fernteleport 0/3** (Kippeln am festen Fernpunkt wie schon beim Stamm in R02; bei B und C 3/3).
- Die Warmstarts streuen stark, z. B. B Diesel 3,19–3,87 s; daraus lässt sich kein Schluss auf ±0,3 s ziehen.

## loadprobe=r02-Zeitleiste B → C, ms · Median (Rohspannen in `data/auswertung_r04.md`)

| Wagen | Fall | Terrain | Terrain→Kollider | Kollider→Freigabe | Model-Load | Model-Prepare | vorbereitet→Draw | **Ruf→User-ready** |
|---|---|---|---|---|---|---|---|---|
| Rennwagen | kalt | 1445 → 711 | 0 → 0 | 33 → 53 | 300 → 1131 | 311 → 392 | 25 → 34 | **2708 → 3157 (+449)** |
| Rennwagen | fern | 772 → 288 | 65 → 136 | 7 → 41 | 0 → 0 | 1 → 1 | 17 → 83 | **869 → 573 (−296)** |
| Rennwagen | rück | 25 → 52 | 8 → 5 | 26 → 31 | 0 → 0 | 1 → 1 | 17 → 16 | **81 → 113 (+31)** |
| Rennwagen | warm | 1350 → 1619 | 0 → 0 | 26 → 31 | 225 → 406 | 452 → 420 | 41 → 35 | **2730 → 3248 (+518)** |
| Dieselpunk | kalt | 1446 → 719 | 0 → 0 | 33 → 50 | 340 → 1192 | 199 → 240 | 17 → 19 | **2671 → 3144 (+473)** |
| Dieselpunk | fern | 767 → 291 | 65 → 137 | 7 → 8 | 0 → 0 | 0 → 0 | 12 → 97 | **852 → 603 (−249)** |
| Dieselpunk | rück | 19 → 54 | 6 → 3 | 29 → 36 | 0 → 0 | 0 → 0 | 18 → 7 | **76 → 116 (+40)** |
| Dieselpunk | warm | 573 → 808 | 0 → 0 | 331 → 32 | 319 → 342 | 158 → 154 | 28 → 21 | **2588 → 3163 (+574)** |

- **Zeitleiste und Außenmaß widersprechen sich beim Start.** Die Zeitleiste zeigt +0,45 bis +0,57 s (kalt und warm), fahrbereit ab Navigation nur +0,07 s (kalt).
  - Die Lücke „fahrbereit minus Ruf→User-ready“ ist bei C kleiner: kalt 0,86–1,18 s gegen 1,27–1,42 s bei B.
  - Bei C beginnt die Zeitleiste also etwa 0,4 s früher nach der Navigation, und die Spanne wird um das länger, ohne dass der Wagen spürbar später fährt.
  - In der Spanne wird bei C das Gelände früher fertig (−0,73 s), das Modell-Laden dauert länger (+0,83 bis +0,85 s).
  - Die Ursache (andere Reihenfolge der Arbeit vor und nach dem Ruf) ist meine Deutung; dafür reicht diese Messung nicht.
- **Collider-Install-CPU** (gemeinsamer Terrain-/Straßenstrom): je Ladefall höchstens 4,4 ms gesamt bei B, bei C weniger (0–2,1 ms). Der größte Collider-Schritt in der Fahrt liegt bei 1,1–1,9 ms in A, B und C.
- **roadInfo bei C:**
  - Am Start 0 Straßenstücke gebaut.
  - Am Fernpunkt 6 gebaut, `maxPrepareMs` 14–16,6.
  - In der Fahrt ab Fernpunkt 20–44 gebaut.
  - `lateBuilds` immer 0.

## Fahrt ≥ 30 Spielsekunden · Takt = Spielzeit / Uhrzeit (Median aus 3)

| Wagen | Fahrt | Takt A / B / C | kleinster 5-s-Takt A / B / C | verlorene Uhrzeit in den ersten 5 Spiel-s A / B / C | Schritt max ms A / B / C | Straßen C built / late / maxPrepareMs |
|---|---|---|---|---|---|---|
| Rennwagen | ab Start | 0.999 / 0.997 / **0.980** | 0.996 / 0.983 / **0.889** | 0.04–0.06 / 0.22–0.25 / **0.75–0.83 s** | 3.1 / 1.9 / 14.1 | 0 / 0 / 0 |
| Rennwagen | ab Fernpunkt | 1.000 / 1.000 / 1.000 | 0.997 / 0.998 / 0.997 | 0.04–0.06 / 0.04–0.06 / 0.03–0.04 s | 3.2 / 2.5 / 3.7 | 44 / 0 / 16.6 |
| Dieselpunk | ab Start | 1.000 / 0.997 / **0.980** | 0.997 / 0.982 / **0.891** | 0.04–0.05 / 0.23–0.26 / **0.88–0.90 s** | 1.8 / 1.3 / 1.3 | 0 / 0 / 0 |
| Dieselpunk | ab Fernpunkt | 1.000 / 1.000 / 1.000 | 0.997 / 0.997 / 0.997 | 0.04 / 0.04–0.06 / 0.04 s | 2.8 / 3.0 / 3.2 | 20 / 0 / 14 |

- **Hänger kurz nach dem Start bei C:**
  - In allen 6 C-Läufen gibt es kurz nach dem Start einen Hänger von 0,3–0,5 s Uhrzeit. Er liegt 1,3–1,8 Spielsekunden nach Fahrtbeginn, also etwa 3,5 Spielsekunden nach fahrbereit; die Proben dort laufen mit Takt 0,1–0,4.
  - Zu dem Zeitpunkt ist noch kein Straßenstück gebaut (`built` 0). Der Hänger kommt also nicht vom Straßenstück-Aufbau, sondern von anderer Arbeit, die `strassennetz=r1` einschaltet.
  - Er steckt nicht im Fahrt-Takt von `__kfbDrive.perf` (Schritt max ≤ 14 ms).
- **B (aus) hat einen kleineren Hänger an derselben Stelle:** etwa 0,2 s, A nur 0,05 s.
- **Ab Fernpunkt ist der Takt bei allen 1,000.** Bei C werden während der Fahrt 20–44 Straßenstücke gebaut, ohne Spätbau und ohne verlorene Uhrzeit über A hinaus.

## Befund gegen das Ziel (Straßenschalter ≤ etwa 0,3 s zusätzlich beim Start, danach Takt 1,0)

- **Start (fahrbereit ab Navigation):** C−B **+0,07 s** bei beiden Wagen (kalt). Das liegt im Ziel.
  - Die Zeitleiste zeigt +0,45 bis +0,57 s; den Widerspruch erklärt der andere Startpunkt der Zeitleiste (siehe oben).
  - Warmstarts: +0,30 und +0,68 s bei großer Streuung, nicht belastbar.
- **Danach Takt 1,0:** **noch nicht erreicht.**
  - Etwa 3,5 s nach fahrbereit verliert C einmalig 0,75–0,90 s Uhrzeit gegen 0,22–0,26 s bei B. Der Takt fällt dabei im 5-s-Fenster auf 0,89, über 30 s auf 0,98.
  - Zählt man diesen Hänger zur Startzeit, kostet der Schalter etwa 0,07 + 0,6 ≈ **0,7 s** bis zum ruhigen Lauf, also mehr als 0,3 s.
- **Ab dem Fernpunkt mit echtem Straßenaufbau während der Fahrt:** Takt 1,000. Fernteleport C schneller als B (−0,21 / −0,34 s), Rückkehr +0,01 / +0,03 s.
- **Off-Gegenprobe B gegen A:** fast gleich.
  - Kalt +0,12 / +0,01 s, Fernteleport +0,10 / −0,02 s, Rückkehr gleich.
  - Kleiner Hänger nach dem Start: +0,2 s gegen A.
  - Warmstart gemischt (+0,37 / −0,47 s, streut).
  - Der Stamm hat direkt nach fahrbereit den etwas niedrigeren Takt (0,96 gegen 1,00).
- **Für WSA:** Die Stelle, die zu suchen ist, liegt etwa 3–4 Spielsekunden nach fahrbereit am Startpunkt, ohne gebautes Straßenstück: ein Einzelbild von 0,3–0,5 s.
  - Verdächtig sind ein nachgeschobener Konstruktor-/Generator-Schritt oder Shader-/Material-Kompilierung des Netzes.
  - Das ist eine Vermutung, nicht gemessen.

## Nicht gemacht
- R03 (`water=1,racerwater=r03`) und Controls (`racercontrols=r04`) jeweils gegen B fehlen noch. Das Messskript braucht dafür nur einen anderen Zusatz im Hash (etwa 25 min je Vergleich).
- Laut Reihenfolge kommt zuerst Ohren r1d. Auf Zuruf messe ich danach.

## Daten und Skripte
- **Rohdaten:** `data/r04_start_roh.json` (je Lauf alle Fälle mit vollständiger Zeitleiste inklusive marks/cpu/reasons, roadInfo und Fahrtproben alle 250 ms).
- **Auswertung:** `data/auswertung_r04.json` / `.md` (alle sieben Spannen mit Rohspannen).
- **Skripte:** `scripts/_wsb-r04-start.mjs` (Messung), `scripts/auswertung_r04.mjs`.
- **Arbeitsbäume:** `~/kfb_work/r04_a`, `~/kfb_work/r04_b` mit `dist`, nichts committet. Die Vorschau-Server werden nach der Rückgabe beendet.
