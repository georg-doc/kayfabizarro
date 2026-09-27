# WORLD-FLIGHT-CLAY-C0 · Return

## Ergebnis

Der erste spielbare World-Integrationsschnitt läuft unter der festen KFB-Stage-URL im echten Browser. Er verbindet die akzeptierte Hürth-Welt mit genau zwei neuen, reversiblen Adaptern und einem vorhandenen Track-Rezept:

- zu Fuß und frei fliegen in derselben Welt;
- Original und Clay direkt vergleichen;
- ST01 als geschlossenes Track-Modul mit 10,8–21,6 m Breite, Rampe und Ein-/Ausgang sehen;
- Terrain, OSM-Boden, Track, Bürgersteige, Bordsteine und Gebäude gemeinsam in einer Clay-Farbrichtung beurteilen;
- kompakte Oberfläche; Erklärung und Quellen erst hinter dem Info-Symbol.

## Bewusst nicht enthalten

- Der Track ist in C0 ein Maßstabs- und Weltbau-Modul, noch keine neue Fahrphysik oder vollständige Track-Kollision.
- Clay ist ein reversibler Look-Test, noch kein finaler Materialstandard.
- Dellen, Gummi-Bounce, Gebäudesprung und Welt-Idle gehören zum separaten `REACTIVE-CLAY-WORLD-R0`.
- Kein OSM-Redesign, keine zweite Kamera, kein zweiter Renderer und kein Ersatz für bestehende Runtime-Owner.

## Quellen und Owner

- World r2 Runtime: `58028b07d7618926c40ffaec3bd4053dc88c0efd`
- ClayBound Donor: `e1f693347fd0049deb9f7ef89ee85341bd9f355d`
- Track-Rezept: `2026-09-19.st01.1`
- Implementierung: `5af56ee0a8c9fc1ef581911dffc7eb431efddd72`

## Tatsächliche Prüfungen

- Syntax: 6/6 PASS
- Paket/Owner-Schutz: 41/41 PASS
- Browser Desktop + schmal: 36/36 PASS
- 0 Konsolenfehler
- 0 fehlgeschlagene Requests
- 0 HTTP-Fehler

## Veröffentlichung

Veröffentlicht aus `cloudflare-live@e4b04d3eb8187728e1c5eaf0e3a0303be93e7c6b` und auf der exakten Route im echten Browser erneut mit **36/36 PASS** geprüft:

`https://kayfabizarro.pages.dev/kfb-hub/stage/world/world-flight-clay-c0/`

## Genau ein nächster Gate

Georg: `PASS` oder `TUNE` für Fluggefühl, Track-Platzierung und Clay-Richtung. Erst danach folgt ein eigener, begrenzter Slice für Fahrbetrieb oder reaktive Knetwelt.
