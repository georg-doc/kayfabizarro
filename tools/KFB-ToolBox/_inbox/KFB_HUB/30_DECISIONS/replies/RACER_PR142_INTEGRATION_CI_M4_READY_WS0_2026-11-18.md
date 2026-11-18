# WSA Racer → WS0 · PR142 konfliktfrei, CI grün, M4 bereit ·18.11.2026

Georgs Auftrag erledigt: aktuellen Stamm in PR142 abgleichen, neue CI und Übergabe für euren M4-Abgleich. **Bitte WSB jetzt den unten verlinkten Messauftrag geben. Georg muss nichts vorbereiten.** Keine Site-Veröffentlichung und kein Main-Merge durch WSA.

## Exakter Kandidat

- Repository `georg-doc/KFB-Stunt-Car-Race`, Zweig `racer/roads-water-controls-r04`, [Draft PR142](https://github.com/georg-doc/KFB-Stunt-Car-Race/pull/142).
- **Aktueller Übergabe-Head ac781084e40fcf59856116f39c34d51acf7d1ca8**. Frische CI [44216040053](https://github.com/georg-doc/KFB-Stunt-Car-Race/actions/runs/44216040053):173/173 grün,0bekannt rot/0Rückfälle.
- Geprüfter Code-/Runtime-Head **915ae54933c8bbca4a75b7bee78ba403c1b86e2e**, zusätzlich CI [44214972371](https://github.com/georg-doc/KFB-Stunt-Car-Race/actions/runs/44214972371):173/173 grün. Danach nur Dokumentation/Belege.
- Eingearbeiteter aktueller Stamm **84ae5f0fee6f08529dd7b0347ca0e07b5dde6bb1**. Echter Zwei-Eltern-Merge297d5d127e44d6c13a6ec0d2d3d5ddf05ce89b47 aus bisherigem Kandidat45fd420a und Stamm84ae5f0. Kandidat ist13Commits vor dem Stamm,0dahinter, gemeinsamer Vergleichs-Mergebase ist84ae5f0. PR meldet mergeable=true.

[Aktueller Integrations-Return](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/ac781084e40fcf59856116f39c34d51acf7d1ca8/docs/performance-r05/integration/RETURN.md) · [M4-Messauftrag](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/ac781084e40fcf59856116f39c34d51acf7d1ca8/docs/performance-r05/integration/M4_MEASURE.md) · [Belege/Logs](https://github.com/georg-doc/KFB-Stunt-Car-Race/tree/ac781084e40fcf59856116f39c34d51acf7d1ca8/docs/performance-r05/integration/evidence) · [Living Roadmap](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/ac781084e40fcf59856116f39c34d51acf7d1ca8/docs/racer-roadmap-r2/ROADMAP.md).

## Was zusammengeführt/repariert ist

flags.js, M1World.jsx und EndlessDrive.jsx ließen sich textuell zusammenführen; ein echter Konflikt in endlessTerrain.js. Unser gestaffelter Gelände-/Vorbau-/Prioritäts-/Startschutz bleibt, originaler Patchworld-Handle plus bedingtes Update aus dem Stamm laufen im selben Terrainbesitzer. Neue Billboard-/Umgebungs-/Windmodule, alle unverändert übernehmbaren Stamm-Blobs und unsere R03/R04/R05-Anschlüsse erhalten. Keine neuen Bewegungseigentümer, keine Steuerungs-/Physik-Retunes.

Zusätzlich hat die bestehende Umgebungsprüfung eine reale Vertragslücke gefunden (34/35): Die Belegungsdatei fehlte für die Racer-Schicht `roads`. Sie steht jetzt nach Flüssen und vor Karten, genau wie der vorhandene Terrainbesitzer sie registriert. Alte Schichtnamen und relative Reihenfolge bleiben; laufende Positionsnummern ab Einfügung +1, keine Änderung der stabilen Straßenabschnitts-IDs. Alte vorgeschlagene `strasse`-Planung erhalten, kein zweiter Straßenerzeuger. Abgrenzung der Stamm-Schichten nach Mitgliedschaft statt harter9er-Grenze; somit bleibt Wasser auch nach der neuen Position geschützt.

`test/unit/racerEnvironmentR05.mjs` nimmt die vorhandenen35Umgebungstests und3reale Anschlussfälle dauerhaft in CI auf: echte Terrain-Belegung mit/ohne roads, Felder/Dioramen/Szenen meiden die echte Straße, alte Schichten bei aus, tatsächlicher Patchworld-Update am gestaffelten Gelände. **38/38 grün**. Keine Ausnahme/Skip hinzugefügt.

## Belege und Grenzen

Lokal nach Zusammenführung: Rekorder7/7, Ressourcen3/3, Gelände-Ladeweg7/7, gemeinsame Straßen10/10 einschließlich beider Wagen an realer Schulter/Kachelgrenze,38Umgebung-/Anschlussfälle, statischer Vertrag. Mehrdatei-Build13,79s grün;23aktuelle Originalasset-Blobs lokal gegen Git-SHA verifiziert. Eigene2,77GB regenerierbare Builds nach Logsicherung entfernt. Bestehende Source-Kopie/private Quellen/Abhängigkeiten erhalten; keine neue Fullclone-Kopie.

Historische R05-Langfahrten bleiben am3853bd-Runtime-Head; nicht als neue Fahrmessung dieses Abgleichs ausgegeben. CI/native Belege qualifizieren Integration technisch. Einzelspitzen, Gesamtheap/Leckfreiheit,60FPS und M4-Ziel bleiben offen; keine neue visuelle/akustische Abnahme optionaler Umgebungs-Schalter. Keine öffentliche Route geändert.

## Eine nächste Aktion: M4-Vergleich durch WSB, danach WS0

Basis84ae5f0 vs Kandidatac781084. Je patch_vireo/crimson_flame_dragster: A=Stamm, B=Kandidat aus, C=Kandidat strassennetz=r1. Gleiche Bauart/Seed/Start/Look/Sky/Qualität/Viewport/Cachepolitik. Mindestens3wechselnde Runden, kalt/warm/Teleport/Rückkehr getrennt, Spielzeit plus Uhr protokollieren.

**Wichtig: rec=0 in allen3reinen Straßenvergleichsfällen**, damit debug+Straße nur im Kandidaten nicht zusätzlich den automatischen R05-Rekorder aktiviert. Danach separater QA-Smoke ohne rec-Schalter; falls Aufzeichnungsmodus verglichen wird, rec=1 für alle3 und getrennt berichten. Alte Rekorder-FPS zählt Physik-Callbacks; echte Renderzeit und gemeinsame Spieluhr verwenden.

Bestehende loadprobe=r02-Aufteilung, Collider-Install-CPU, roadInfo-Bau/lateBuilds, tatsächliche Bild-p95/p99/Max, Nachladeruckler und optionalen Heap mitführen. Ziel unverändert +≈0,3s Straßenstart/Takt1,0, kein Vorweg-PASS. Wasser/Controls danach separat wie im Messauftrag. Rückgabe an WS0 mit Heads/Schaltern/Rohzeiten, dann unabhängige Integrationsentscheidung.
