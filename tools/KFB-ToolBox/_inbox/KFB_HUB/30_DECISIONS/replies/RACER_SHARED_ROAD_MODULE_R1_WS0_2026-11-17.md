# Für WS0 · Gemeinsames Straßenmodul R1 · 17.11.2026

**Geliefert:** deterministisches, kachelweise nachladbares Straßennetz im bestehenden Racer, mit bündigen Geländeschultern und einer gemeinsamen Quelle für Linien, Breiten, Kreuzungen, Höhen und Untergrund. Beide echten KFB-Orte und die Rundstrecke bleiben erhalten. Die Kayfabrick-Zufahrt verbindet sie nach Westen mit dem äußeren Netz; ein unmodellierter östlicher Schnitt durch die Rennrunde wird vermieden.

[Private Racer-Site · Version 11](https://kfb-racer-open-world.frizzlebob.chatgpt.site) · Startpunkt **„Weiterfahrt · westliches Straßennetz“** · Werkstatt `2026-11-17.7`.

## Lieferung und genaue Revision

Repository `georg-doc/KFB-Stunt-Car-Race`, Zweig `racer/kern-r1`, Paket `_inbox/RACER_SHARED_ROADS_R1_2026-11-17/`. Quellen-/Beleg-Commit `4be90cf2f5aff9ca3125e3f409abe22dace82462`; der finale Paket-Return ergänzt die Veröffentlichungsquittung ohne weiteren Gameplay-Patch. Kein PR, Main-Merge oder Live-Promote.

[Modul und HOST_CONTRACT](https://github.com/georg-doc/KFB-Stunt-Car-Race/tree/4be90cf2f5aff9ca3125e3f409abe22dace82462/_inbox/RACER_SHARED_ROADS_R1_2026-11-17/src/modules/roadNetwork) · [Tests und Guard](https://github.com/georg-doc/KFB-Stunt-Car-Race/tree/4be90cf2f5aff9ca3125e3f409abe22dace82462/_inbox/RACER_SHARED_ROADS_R1_2026-11-17/evidence/road-module-r1) · [Ausführliche Übergabe](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/4be90cf2f5aff9ca3125e3f409abe22dace82462/_inbox/RACER_SHARED_ROADS_R1_2026-11-17/public/project/ROAD_MODULE_R1_HANDOFF_2026-11-17.md)

Native Site main: `92603fa9214e2cb2d71dd41597828eb8da9cebb3`.
Saved version: `appgprj_6afb696ed0748191adfb37df6e9cdac8~appgver_f4f3700cb6388191acface31524273e8` (Version 11).
Deployment: `appgdep_6afbd0f9cbe88191af9e3d6e6d8d423c`, succeeded `2026-11-17T03:59:04.086093+00:00`.
Quellen-/Archiv-Provenienz und genaue private Host-Revision sind geprüft; Audience unverändert privat.

## Aufnahme in den vorhandenen Stamm

1. `createRoadNetwork({seed,baseHeight})` bekommt die stabile, noch unveränderte Grundhöhe. 1024m-Makrozellen erzeugen native Core-ROUNDABOUT/CONNECT-Konstruktionen. Der gelieferte Core ist byteidentisch mit `cascade/r4/donors/track-core.v012.mjs`, Blob `1bcf7ad3a384a57d7caf83488c436f4c4835346f`: nur den Import auf diesen vorhandenen Besitzer richten.
2. `strassenUm(x,z,r)` liefert echte Linien, Breiten, Asphalt-Materialcode und Kreuzungen mit Arm-Sockets. Getrennte Ausschnitte bleiben getrennte Polylinien mit `routeId`/`segmentRange`. Claude `claude/umgebung-r1`, Verteiler und Props lesen dieselben Daten.
3. `terrainContribution(x,z,rawY)` liefert Höhe, Einfluss, Datum und Materialcode für den einen Gelände-Besitzer. Racer-Strings aus `surfaceAt` dürfen das objektwertige Stamm-Terrain-API nicht ersetzen; über den vorhandenen Materialbesitzer übersetzen.
4. Inspektionsstand: `game/integration-r2@ce01bf76fa211e20b3d6babdf9b2c8edc2badc57`. `reserveOpening`/`gelaendeOeffnung` schneiden höchstens vier rechteckige Lukenlöcher. Sie sind **kein Straßen-Schneisen-API**. WS0 ergänzt den Höhenbeitrag in der einen `endlessHeight`-Komposition und baut Bild- und Kollisionsblätter zusammen neu auf. Native `onRebuildRect`, `onSwap`, `colliderDiff` anbinden; keine Loch-Rechtecke entlang von Straßen aneinanderreihen.
5. `viertelZufahrt` bleibt die bündige/Sprenkel-Referenz. Erhöhte Bordsteine und Banden gehören ausschließlich `src/modules/kfb-curb/`. Der Racer nutzt für gewöhnliche Straßen keinen erhöhten Zusatzrand.

Das reine Modul besitzt weder Renderer noch Welt-Schritt, Fahrzeug, Kamera oder AudioContext. Der separate Racer-Adapter folgt dem vorhandenen 64m-Gelände-Lader. Sichtbild und Collider verwenden dieselben Dreiecke. Dreiecke gehören nach ihrem Mittelpunkt genau einer Kachel; Randpunkte können überstehen, daher den dokumentierten Lade-/Collider-Saum behalten. Entfernung und `dispose` geben ausschließlich eigene Ressourcen frei.

## Tatsächliche Prüfungen

**14 native Gruppen + 2 gezielte Ressourcenprüfungen PASS, Guard CONTINUE.** Die letzte Material-/Textur-Aufräumänderung hat einen getrennten Nachweis; kein behaupteter vollständiger Neulauf.

Enthalten sind Seed-/Ladefolge und Cache-Verdrängung, negative Koordinaten, 3582 Quellsegmente, 27 Node-Zielpunkte, 57 Bild-/Kontaktproben, vier echte Vireo-/Crimson-Überfahrten, G-Rückkehr auf eine neue Straße und Dolls-R2-Aufprall mit 629,42 Ns → Aufstehen/Laufen am selben Körper. Entladen/Wiederladen sowie eigene Collider, Geometrien, Materialien und Texturfreigabe sind geprüft. Alte nicht mehr passende Fixture-Annahmen bleiben als Fehler separat erhalten.

Echter lokaler WebGL-Browser: äußeres Netz mit 112 km/h und vier Radkontakten, 121 → 132 Kacheln, alte Kacheln entfernt; G landet auf der neuen Straße. Keine App-/Konsolenfehler. Sechs private Host-HTTP-Prüfungen bestätigen Werkstatt, Vertrag, Übergabe und aktuelle Spiel-Dateien. Kein Geräte-FPS-, menschlicher Look- oder authentifizierter Host-Spiel-PASS.

**Ein nächstes Gate:** aktuelle Stamm-Kandidatenfassung mit einem Straßen-, Gelände- und Bordstein-Besitzer; ein echter Gelände-Blattwechsel plus Patch1-Fahrt vom Gelände über die bündige Schulter auf die Straße. Danach breitere Seed-/Actor-Prüfung. Vor Aktivierung in einer Welt mit Flüssen/Siedlungen sind deren Belegungs- und Konfliktregeln anzuschließen. Brücken, Tunnel und neue Orte sind nicht Teil von R1.

Fahrzeugprofile, Kampfbühne, Badewanne und Speedlines bleiben getrennte Folgeaufträge. Hub-Karte und Main-Aufnahme liegen bei WS0. Georg muss keine Quellen nachreichen.
