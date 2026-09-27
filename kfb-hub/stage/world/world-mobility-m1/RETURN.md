# WORLD-MOBILITY-M1 · Return

## Ergebnis

Der unbrauchbare gefaltete Track-Dummy ist vollständig entfernt. Die akzeptierte Hürth-/Clay-Welt besitzt jetzt einen produktiven Ground/Flight-Übergang aus den vorhandenen World- und Travel-Ownern:

- zu Fuß mit der bestehenden World-r2-Bewegung und ihrem Bodenbezug;
- erster Druck auf Leertaste: der vorhandene World-Sprung;
- zweiter frischer Druck innerhalb von 400 ms: Wechsel in den Flugmodus;
- Flug auf dem echten Travel-Card-Carrier statt dauerhaftem `jump.air`;
- Rückkehr zu Fuß in dieselbe Welt mit sauberem Owner-Wechsel;
- Original/Clay bleibt direkt reversibel;
- der von Georg akzeptierte Hirnwelt-H0-Look ist auf Gelände, Straßen, Gehwege, Dächer und Fassaden übertragen;
- drei Reliefmaßstäbe trennen grobe Hausknete, mittlere Weltoberflächen und feine kleine Objekte;
- keine Track-Ersatzgeometrie und kein neuer Race-Owner.

## Verwendete Quellen

- World r2 Runtime: `58028b07d7618926c40ffaec3bd4053dc88c0efd`
- Travel Modes 01 Runtime: `f5ea32f817403cda0e30a426e70f37db8ce03d66`
- ClayBound-Präsentation: nur noch technischer Alt-Donor, nicht das visuelle Ziel
- Hirnwelt H0: `tools/KFB-ToolBox/_inbox/KFB_CLAYMATION_H0_HIRNWELT_2026-09-27`
- H0-Module: `clay-material.v4.js`, `clay-relief.v2.js`, `clay-soften.v1.js`
- M1/H0 Implementierung: `52027a5d4701e284b49e5b9b106ce18596050de8`

## Tatsächliche Prüfungen

- Paket- und Owner-Schutz: **43/43 PASS**
- Browser lokal, Desktop + schmal: **40/40 PASS**
- Ground → erster Sprung → zweiter Druck → Flight: PASS
- echter Travel-Carrier sichtbar und aktiv: PASS
- Flight-Bewegung und Höhenänderung: PASS
- Rückkehr zu Ground: PASS
- Original/Knete reversibel: PASS
- Hirnwelt-H0-Material und Relief in drei Maßstäben: PASS
- keine Laufzeit-Weichzeichnung und kein Clay-Preprocessing auf Figuren: PASS
- gefalteter Track vollständig abwesend: PASS
- 0 Seiten-/Konsolenfehler
- 0 fehlgeschlagene Requests oder HTTP-Fehler

## Status

`LOCAL_BROWSER_PASS · PUBLIC_ROUTE_FALLBACK · CANDIDATE_PRESERVED`

Der exakte Ordner wurde auf `cloudflare-live@e10745def24c1dde96ef36b474cea0b90dc1b237` veröffentlicht und mit 41 Dateien zurückgelesen. Die öffentliche URL lieferte bei drei echten Browseraufrufen jedoch weiterhin die allgemeine KayfaBizarro-Root-Seite statt M1. Deshalb kein `PUBLIC_VERIFIED`:

`https://kayfabizarro.pages.dev/kfb-hub/stage/world/world-mobility-m1/`

Kein weiterer Rebuild wurde gestartet. Der geprüfte Kandidat und der Publication-Commit bleiben erhalten; der Fehler liegt an Route/Deployment, nicht an einem neuen World-Runtime-Befund.

## Kein künstlicher Human Gate

Georgs `PROCEED PASS` für World/Flight sowie seine Wahl von Hirnwelt H0 als visuelle Richtung sind umgesetzt. M1 verlangt keine weitere Tabellenabnahme.

## Genau ein nächster produktiver Schritt

Den echten Race-Track-Core als Daten-/Runtime-Owner anschließen und daraus eine erste modellierte Stadtzelle mit Fahrbahn, hellen Fugen-Bordsteinen, abgesetztem Knet-Gehweg und Grünanschluss bauen. Die jetzige H0-Fassung liefert Material und Oberflächenwirkung; sie behauptet noch keine physisch modellierte Bordstein-/Gehweg-Geometrie.
