# KFB Free Roam · fester Testeinstieg

**Feste Adresse:** https://kayfabizarro.pages.dev/kfb-hub/free-roam/

Dieser Navigator gehört zum vorhandenen KFB Hub. Race bleibt Implementierungs-SSOT für den Free-Drive-Spender; Travel behält Welt/Modus/Save, Arena Combat, ToolBox/Atlas ihre Authoring-Owner. Kein neues Framework und keine neue Asset-Registry.

## Versionierung

`releases.json` führt genau einen aktuellen Zeiger und alle veröffentlichten Free-Roam-Versionen. Versionsordner unter `versions/<id>/` nach Veröffentlichung nicht für neues Verhalten überschreiben. Neue Runtime = neue ID und zusätzlicher Eintrag. Zurückrollen heißt Zeiger auf vorhandenen Kandidaten zurückstellen, nicht fremdes main zurücksetzen. Spieler-Saves werden nicht automatisch zwischen den verlinkten Apps oder Origins übertragen.

World/Ground=8, BOX1/v0.8, Resident S6 und World Atlas bleiben separat als aktuelle Owner-Einstiege erreichbar. Sie sind keine unveränderlichen historischen Snapshots. FR-S04-01 bietet zusätzlich neuen Input und rohen Slice-04-Input auf derselben Physik und demselben Terrain; dies ist nicht die unveränderte vollständige alte Insel-Runtime.

## FR-S04-01 · Implementierung und Beweis

Quelle: Race d98600ef52c9f1fc28bd93bcbbe8f6f177eece37; Run 35356984356, Artefakt 10552591312. 9/9 reine Inputprüfungen und 19/19 Chromium-Prüfungen bestanden. Tatsächliche Travel-Terrainquelle, 255 Kontakt-Dreiecke, 81 trockene Supportproben. Früherer MIME-Fehler und erster zu küstennaher Standort bleiben in Race/evidence/history bzw. den Runs als Vorgeschichte erhalten; keine falsche globale Regression daraus ableiten.

Spenderphysik wird aus unverändertem race/src/physics.js über den Race-Builder abgeleitet. Originale Kart-Assets werden von gepinntem GitHub geladen. Die hier enthaltenen JS-Module sind ein kuratierter öffentlicher Runtime-Mirror, keine zweite Arbeitsquelle oder Modellablage. Änderungen am Verhalten zuerst im Race-Owner implementieren/testen, dann als neue Version ausliefern.

`PROVENANCE.json` enthält die Source-Dateihashes. `MIRROR.json` benennt genau eine Transportabweichung: physics.js ohne abschließendes LF; Anhängen eines LF ergibt exakt den Source-Hash. Keine Funktion ist geändert. Die Public-QA prüft alle tatsächlichen Bytes zusätzlich und führt den Browserablauf auf der wirklichen KFB-Cloudflare-URL aus.

Noch nicht umgesetzt: Ein-/Aussteigen, Fahrer-/Charakterwechsel in diesem Probehost, Park-/Save-Restore, City-Quartier, Combat-Anschluss, globales sphärisches DRIVE und vollwertige Integration im laufenden Travel-Host. Kein neuer Audio- oder Deformer-PASS. Native ChatGPT-Site nicht erzeugt; kein Ersatzhost.

## Additiver Changelog

2026-09-18 · USER DECISION: fester aktueller/älterer Testeinstieg und Slice-04-Fortsetzung. Navigator mit d7381f87 angelegt; Cloudflare-Check 105633001349 erfolgreich. FR-S04-01 aus getestetem Race-Kandidaten vorbereitet; Public-Mirror und wiederverwendbarer URL-/Byte-/Browsercheck hinzugefügt. Source-Test ist kein Public-/Human-PASS. Public-Resultat im Actions-Artefakt `free-roam-public-proof`; menschliche Abnahme bleibt offen.
