# WORLD-M2A-R4 · Adaptive Auflösung + Clay-Distanzbudget

## Ziel

Die bestehende World-M2A-Runtime erreicht beim Laufen und Fahren p95 ≤ 33,3 ms, ohne den Clay-Look oder die Hürth-Welt zu entfernen.

## Source Lock

- Repo: `georg-doc/kayfabizarro`
- Basis: Draft PR #260
- Head: `69d7910cde4275131f6701416c26d9cab3937ba5`
- Owner bleiben unverändert: World r2, World M1 und Race PR #10.
- Kein neuer World-, Terrain-, Movement-, Camera- oder Drive-Owner.

## Gemessener Ausgangspunkt

- R1: Walk/Drive p95 84,4/89,4 ms; ca. 1,13 Mio. Dreiecke.
- R3: Walk/Drive p95 42,7/43,9 ms; ca. 185–198 Tsd. Dreiecke.
- Ohne Schatten: 41,6 ms. Ohne Stadt: 39,9 ms.
- Pixelratio 0,6: 26,3 ms. Das ist der klare nächste Hebel.

## Genau ein Kandidat

Eine adaptive Qualitätsregel, keine Sammlung unabhängiger Schalter:

1. Beim Laufen/Fahren und auf kleinen Viewports Pixelratio begrenzen.
2. Im Stillstand nur langsam und stabil auf eine höhere Stufe zurückkehren; kein sichtbares Pumpen.
3. Volles Clay-Relief nur in der Nahstufe; entfernte City Shells behalten Farbe/Form, aber vereinfachtes Material.
4. UI und Text bleiben in nativer CSS-Auflösung.
5. Qualitätsschritte und aktuelle Stufe im Messreport ausgeben.

## Harte Grenzen

- Nicht die Stadt löschen.
- Nicht Clay komplett abschalten.
- Keine neuen Features, Assets, Tracks, NPCs oder HUDs.
- Keine Stage-/Live-Promotion vor p95 ≤ 33,3 ms und sichtbarer Bildruhe.
- Nach einem Kandidaten messen und stoppen.

## Erfolg

- Paket- und Browserfolge bleiben grün.
- Desktop und schmaler Viewport ohne Lade-/Konsolenfehler.
- Walk und Drive jeweils p95 ≤ 33,3 ms.
- Clay-Look in der Nähe sichtbar erhalten.
- Kein Flackern an der City-LOD-Naht.
- Danach Georgs freier Spieltest.

## Danach, separat

`FACADE-DONOR-01`: KayKit und Tiny Treats zuerst, Kenney für fehlende Teile. Echte Türen, Fenster, Vordächer und Schilder isoliert zeigen; dann Geometrie/Material teilen und pro Instanz skalieren, leicht verformen und umfärben. Keine Einzelbauteile in der Ferne.
