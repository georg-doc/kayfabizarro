# Für WS0 · Straßennetz + R03/R04 als eine Integrationsübergabe · 18.11.2026

**Funktionen geprüft; +0,3-s-/Takt-1,0-Leistungsabnahme steht aus. Bitte jetzt mit diesem Head WSBs gepaarten M4-Vergleich anfordern. Erst danach entscheidet WS0 über Merge oder gezielten Leistungsfix. Keine Site-Veröffentlichung. Georg muss nichts vorbereiten.**

## Kandidat

- Repository: georg-doc/KFB-Stunt-Car-Race
- Branch: **racer/roads-water-controls-r04**
- Verifizierter HEAD: **b28f9c7d9280f982347bce7dd970bf4cca2d4abe**
- Parent/Stamm: **c9599274f25432a0b2aaf78cd1da490107495191**
- Letzter Laufzeitcode: **db4cffc90cea4b7eba0e460b0bd79881c5960b32**
- Browser-Fahrstand: **a34d67cda34b73bd86656745daf3cf46e35a3263**. Letzter Code ändert ausschließlich Straßen-Callback-Kompatibilität, nachgewiesen exakt gleiche 34 Core-Routen-Samplearrays und 328 Terrain-/Straßenabfragen. Fahrer-/Wasser-/Physikcode unverändert; Belegstände werden nicht umetikettiert.
- [Draft PR142](https://github.com/georg-doc/KFB-Stunt-Car-Race/pull/142)
- [Return mit allen Zahlen, Grenzen und geänderten Besitzern](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/b28f9c7d9280f982347bce7dd970bf4cca2d4abe/docs/roads-controls-r04/RETURN.md)
- [HOST_CONTRACT / Schalter](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/b28f9c7d9280f982347bce7dd970bf4cca2d4abe/docs/roads-controls-r04/HOST_CONTRACT.md)
- [Claude Design: feste Abschnitts-IDs](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/b28f9c7d9280f982347bce7dd970bf4cca2d4abe/docs/roads-controls-r04/ROAD_SECTION_IDS.md)
- [WSB-M4-Messauftrag A/B/C](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/b28f9c7d9280f982347bce7dd970bf4cca2d4abe/docs/roads-controls-r04/WSB_MEASURE.md)
- [SUMMARY + Rohberichte/Sichtbelege](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/b28f9c7d9280f982347bce7dd970bf4cca2d4abe/docs/roads-controls-r04/evidence/SUMMARY.json)

Alter PR139/Zweig @ec555e47473b19b49385a4b846cc80c3960f1c5e bleibt unverändert als Recovery. Aktueller Kandidat direkt auf c959, keine alte divergierte Geschichte in den Stamm gemischt. R02-/Host-Key-Fixes des Stamms erhalten. R02s WSB-Messung in LADEWEG_R02/RETURN_ladeweg_r02.md ist gelesen: gleichartiger R02-Vergleich alle sechs gleich oder besser; Straßenmehrlast war separat. R02 ist übernommen, keine erneute R02-Freigabe angefordert.

## Was sich ändert

1. **Straßen nur lokal vorbereiten:** kein synchroner kompletter Fernblick, keine durch ferne Straßen erzwungene 64-m-Verfeinerung. Nahplan zuerst, bestehende Frames/Geländezeilen danach; derselbe reale Support-/Kollider-Startschutz bleibt autoritativ.
2. **Tile-Geometrie:** pro Feature/Kachel nur nötige originale Core-Stationen und Markierungsreihen; globale Musteranker/Originalvertices erhalten. 3166 Teilvertices exakt gegen das vollständige Original; getestetes 100-m-Surface weniger als ein Drittel der Gesamtvertices. Ganzes Feature vorher bis 214,77 ms, aktuelle kontrollierte Tile-Probe max 34,30 ms; unterschiedliche Last, kein gepaarter Leistungsbenchmark.
3. **Weniger Abfragearbeit:** begrenzter Cache unveränderlicher Straßenproben, Belegung ohne komplette Linienpakete, exakt blockierte Original-Endpunkte vor teurer Kompilierung verwerfen. Vollfeature-Callback-Vertrag für andere Hosts erhalten.
4. **Schaltbares R03:** ursprüngliche hydroEndless.js/hydroWater.js bytegleich zum Stamm. R03-Varianten separat, nur ausgewählt; keine zweite Welt. Patch-Wasseradapter aus: keinerlei Hostzugriffe, kein M2STATE.water, keine FX.
5. **R04:** bestehenden Boost-R2-Spender aus PR134 @9531ecfd an denselben Patch-Körper gehängt, hinter eigenem Schalter. Schub/Verbrauch/Feedback gekoppelt, freier Drift-Turbo ohne manuellen Verbrauch. Drift/Haftung/Getriebe/Sprung/Flip/Input/Audio-Besitzer bleiben bestehen.

## Schalter

| Schalter | Anschluss |
|---|---|
| strassennetz=r1 | Straßenwahrheit, Terrain/Reservierung, Geometrie/Kollider, Asphalt |
| water=1,racerwater=r03 | vorhandener Wasserbesitzer mit R03-Lifecycle + Patch-Adapter |
| water=1 ohne racerwater | unveränderter ursprünglicher Stamm-Wasserpfad |
| racercontrols=r04 | vorhandener Boost-R2 mit appliziertem FX-/Ton-Zustand |
| debug,loadprobe=r02 | bestehende Messzugänge, kein weiterer Welt-Schritt |
| buehne=r1 | bestehende Kampfbühne für R04/S01 |

Ohne Straßenschalter keine Netzinstanz/Geometrie/Kollider/Höhenänderung, native Off-Dreiecke identisch. Ohne R03 und Controls-Schalter bleibt der entsprechende Stamm-Pfad erhalten. Echte komplette Startzeit-Off-Parität ist Teil des folgenden M4-Vergleichs, nicht bereits als gemessen ausgegeben.

## Claude Design: jetzt feste Nummern

Dauerhaft speichern: **strassenUm(x,z,r).sections[].id**.
Format: kfb-road-section/1:<seed>:<encodeURIComponent(routeId)>:<floor(s/32)>.
Dazu routeId, section, s0/s1, width und materialCode. s = absolute Core-Station. Radius, Abfrageposition, Kachel und Cache ändern den Schlüssel nicht. **lines[].id bleibt ein Abfragefragment, kein persistenter Feldschlüssel.** Andere Topologie/Stationierung benötigt explizite Migration.

## Tests und Spieltakt

[CI44201986629](https://github.com/georg-doc/KFB-Stunt-Car-Race/actions/runs/44201986629), Job134458154186, Runtime db4: **170/170 grün**, 0 bekannt rot, 0 Rückfall. Keine Ausnahmen/Policy-Abschaltung. Split-Build grün **19,13 s**; kein Publish, eigenes temporäres 1,3-GiB-Baupaket entfernt.

Native Gruppen: Controls 7/7 (u.a. echter umgedrehter Körper, Rückwärts-/Vorwärtswechsel, gehaltene Sprungtaste, abgeschaltetes R03 ohne Hostzugriff), Boost 9/9, Straßen 5/5, Patch-Wasser 12/12, Streaming 8/8, Terrain 7/7, Shared-Roads 10/10.

Beide Originalwagen auf derselben vorhandenen buehne=r1: **20/20 Fälle** für Beschleunigung, Drift, freien und manuellen Boost, Rückwärts-/Vorwärtswechsel, echten Hang, Flip-Rettung und sichere Rückkehr. Rückwärts Renn -19,56 m/s, Diesel -14,30 m/s. Keine neuen Positionen/Geschwindigkeiten während der Fahrabschnitte; nur vorhandener Owner-Prüfport.

Echte water=1-Nachladung: **10/10 Fälle** (Fluss, quellpegelqualifizierter See, Fenster-/Kachelgrenze, Rückkehr); 0 erfasste Bodenverletzungen/Seitenfehler, Rückkehr jeweils 4 Räder/dry, Pegelnaht Delta 0 m, je 373 reservierte Straßenproben trocken. Fehlerhafte erste Prüfstartorte und Nachprüfungen vollständig erhalten.

| Abschnitt · Spiel/Uhr | Rennwagen | Diesel |
|---|---:|---:|
| Beschleunigung |0,321|0,451|
| Drift |0,822|0,654|
| freier Turbo |0,584|0,601|
| manueller Boost |0,826|0,876|
| Rückwärts |0,927|1,001|
| Terrain bergauf |1,003|1,014|
| Fluss |0,837|0,879|
| See |1,004|0,999|
| Wasser-Kachelwechsel |0,716|0,673|

Alle Zeitbedingungen nach M1-Spielzeit/Zuständen. Lokale IAB-Portraitansicht, Shared-Dependencies/private Originalmodelle, mute/KFB_AUDIO=off. Keine M4-Leistungsabnahme und keine gleichartige A/B-Messung.

Ladespannen aus echtem R02-Port (Renn/Diesel, ms): Terrain 2253/1528,70; Terrain→Kollider 9,80/6,60; Kollider→Physik 19,70/13,50; Model-Load 1081,80/1023,20; Model-Prepare 4435,20/571,60; vorbereitet→Draw 120,80/39,80; Ruf→User-ready 12479,50/6497,00. Straßenfeatures am ursprünglichen Start 0, aber Nah-/Fern-Gelände aktiv. Kollider-CPU ist gemeinsamer Terrain-/Straßenstrom.

## Pflichtgate vor Merge

**+0,3 s und anschließender Takt 1,0 sind noch NICHT abgenommen.** Lokale Last/Wasserslices überschreiten Budgets; ein kleiner Generator-Schritt garantiert keine harte Maximaldauer. WSB bitte jetzt gepaart messen: A Stamm c959, B Kandidat alle neuen Schalter aus, C Kandidat strassennetz=r1; beide Wagen, identische Paketierung/Cache/Seed/Auflösung, nichts parallel. Wasser/Controls separat. Vorhandene M4-Methode aus Kanal51 wiederverwenden.

Danach WS0-Review/Übernahme oder gezielter Leistungsfix, anschließend R05. Kein unabhängiger Produkt-PASS durch Builder. Hardware-Tasten/Touch/Fokus und subjektive Feinabstimmung nicht neu abgenommen; normale Kamera nicht retuned (Controls-Rückkehrbild mit nahem Dachfahrer ist kein Kamera-PASS). Turm-Vorlauf wartet weiter auf geprüftes WSB-Originalbündel zuerst Crimson, gemeinsames Kampfsystem.

Git-Spiegel-Fetch war mangels Transportanmeldung nicht möglich; bestehender Cache über GitHub + vollständige Source-Hashprüfung aktualisiert, lokale andere Arbeit getrennt erhalten, kein Vollklon/Token-Fallback. Keine Site/Live-Promotion; Site16 unverändert.
