# Plan · Große WFC-Zellen und Gefängnis-Labyrinth · R1 · 04.11.2026 (WS-Verteiler)

Stand: nur Plan, gebaut wird nach dem Go von WS0 und erst, wenn Testlauf 5 auf der Stage läuft.

## Was schon da ist
- `src/modules/randomMaze`, wie es cascade/r4 nutzt:
  - Graph ist rein und Node-tauglich (`graph.mjs`).
  - Mauern sind abgerundete Kästen. Sie heben und senken sich über `update(dt, {walls})`. `blocked()` gibt es schon.
- Bisher gibt es nur das eckige Labyrinth. Das runde (polare) liegt erst als Python-Quelle vor (`source/kfb_prison_maze_graph.py`) und muss portiert werden.
- „Mauern als Gelände-Bänder“ (GREY Schritt B) gibt es zur Laufzeit noch nicht.

## Datenformat
**1. Ebene `gross` in `startWfc.r1.json`.** Sie wird vor den kleinen Plätzen geplant. Kleine Plätze meiden große Zellen über `meiden`.
```json
"gross": { "plaetze": { "max": 2, "abstand_m": 120, "r_m": [60, 140] },
  "klassen": {
    "viertel":    { "gewicht": 1, "r_m": 30, "saum_m": 24, "biome": { "stadt": 1.5, "*": 0.6 } },
    "labyrinth":  { "gewicht": 1, "r_m": 26, "saum_m": 10, "form": { "eckig": 0.5, "rund": 0.5 }, "pitch_m": 6.4, "platz_m": 6.6 },
    "leer":       { "gewicht": 1.5 } },
  "nachbar": { "viertel|labyrinth": 0.6, "labyrinth|labyrinth": 0.15, "viertel|viertel": 0.3 } }
```
- `nachbar` ist ein weicher Faktor auf das Gewicht. Das passt zur Pop-up-Regel, die WS0 verlangt: wahrscheinlich, nie fest. Fest ist nur die Platzfrage, also Fläche frei, flach genug und nicht am Weg (wie heute).

**2. Ergebnis je großer Zelle**, deterministisch aus der Saat:
`{ klasse, x, z, r, saum, saat, biome, yaw, form?, platz? }`
- `platz` beim Labyrinth = Mitte für das Panoptikum `{ x, z, r }`.

**3. Zufällige Begegnung in der Welt:** dasselbe Format.
- Quelle: neue seltene Klasse `labyrinth` in `einzelPlaetze.r1.json`, nur auf Rasterplätzen mit großem freiem Umkreis.

## Schnittstellen
**WS-Design bekommt:**
- Viertel: `{ saat, biome, x, z, r, saum, yaw }`, daraus macht WS-Design Grundriss und Kartenbau. Dazu ein Rückruf `belegt(x, z)`, damit Truhen und Deko nicht auf Gebäude fallen.
- Panoptikum: `platz { x, z, r }` und die Torrichtung.
- Den Mittelplatz hält der Graph frei (`courtyard`).

**WS1 bindet ein** (M1World und das Laden je Zelle gehören WS1):
- `planStart` liefert zusätzlich `gross[]`.
- `labyrinthR1.js` ist ein Host-Modul wie `craterR1.js`, Vertrag create/update/dispose. Darin:
  - `groundAt`
  - `blocked(p)`
  - `umbau(saat?)` lässt neue Mauern wachsen und alte sinken. Den Ablauf hat das Modul schon.
  - `hitTargets`
- Das Labyrinth als Startlevel heißt: Spieler startet am Tor.

**Mauer-Vorschlag:**
- Die Mauer ist ein eigenes Band-Netz, das dem Gelände folgt. Es trägt dasselbe Knete-Material, dieselben Farbbänder und dasselbe Licht-Rig wie das Gelände und ist 0,35 m eingesenkt.
- Das Höhenfeld selbst bleibt unverändert. Sonst müsste bei jedem Umbau das Gelände neu gebaut werden.

**Portalziele:**
- `portalZiel` bekommt den Rückruf `grossNear(x, z, r)`.
- Trifft ein Kandidat eine große Zelle, liegt der Ausgang an ihrem Eingang: Labyrinth-Tor bzw. Viertel-Rand, so wie heute bei Kartenzonen.

**Deko** setzt der Verteiler aus dem Bestand:
- Steine, Geröll, kahle Bäume aus Katalog, KayKit und Asset-Suche, vorher prüfen.
- Bevorzugt in Sackgassen, Ecken und am Mauerfuß, mit `fussOk`.
- Dunkle Pfützen sind flache Bodenflecken. Wer die baut (WS-Design oder Wasser), sagt WS0.

## Schalter
- `wfcgross=1`: große Zellen in der Start-WFC.
- `labyrinth=1`: Modul an. `labyrinth=eckig|rund` erzwingt die Form.
- `start=labyrinth`: Labyrinth als Startlevel.
- `begegnung=1`: seltene Labyrinthe in der Endlos-Welt.
- Prüfhilfe `labydbg`: Graph und Wege sichtbar.

## Reihenfolge nach dem Go
1. Runden Graph portieren, Tests für beide Formen.
2. Ebene `gross` in `startWfc`, Tests.
3. Band-Mauern plus Umbau, Beleg von vorn und von der Seite.
4. Deko.
5. Portal-Haken.
6. Übergabe an WS1 und WS-Design.

## Offen für WS0
- Wer baut die Pfützen?
- Startpunkt im Labyrinth: am Tor oder im Hof?
- Wer löst den Umbau im Spiel aus? Der Knopf des Zinnsoldaten, ein Takt oder ein Ereignis?
