# WORLD-DRIVE-INTERACT-M2A · Return

## Ergebnis

Der erste produktive M2-Kernloop läuft in derselben Hürth-/KlayfaBizarro-Welt:

- zu Fuß zum sichtbaren Fahrzeug;
- `E` steigt ein, mit kurzer Cartoon-Squash-Reaktion;
- FrizzleBob sitzt sichtbar im Fahrzeug;
- W/S, A/D, Q/R, B, Shift und Leertaste bedienen die bewährte Race-PR-#10-Fahrphysik;
- Terrain und Gebäude bleiben World-r2-Quellen; die Fahrphysik erhält nur daraus abgeleitete Kontaktflächen;
- `E` setzt FrizzleBob an einem freien Punkt neben dem Fahrzeug ab;
- danach sind Ground und Flight weiter direkt nutzbar.

Es wurde keine Ersatz-Rennstrecke gebaut. Track Core bleibt `WAITING_SOURCE` für M2B.

## Exakte Quellen

- World M1: `40037597485436e185f129091be908786925341d`
- Race PR #10 / Free Roam: `406cd26f44f22811fe3b3a58776839be7ffb7b2c`
- Kenney `kart-oobi.glb`: `15e36b915c9bdfd7ff000d398418269e27c6ef9f`
- Vehicle Deformer v2: `f30b719a8c9da3e9ac90d4d9628c0691d676d1e9`
- Travel Modes PR #39: `e10a977501cd186fe1330e9d3fd1a7b5811beb3a`
- GitHub-Runtime-Checkpoint: `3a9375bba2acdcc448473f24838830ba92305277`
- R4-Publication-Checkpoint: `2e1978821a043cf604c8bc556493cae282a87a86`

## Automatische Prüfungen

- Browser Desktop + schmal, lokal: **34/34 PASS**
- Browser Desktop + schmal, feste öffentliche Stage: **34/34 PASS**
- 0 Seiten-/Konsolenfehler
- 0 fehlgeschlagene Requests
- 0 HTTP-Fehler

Diese Prüfungen belegen Packaging, Ladepfade und den formalen Moduswechsel. Sie belegen ausdrücklich **nicht** Spielbarkeit, flüssige Bewegung, korrekte Bodenhaftung oder akzeptable Ladezeit.

## 2026-09-27 · Georgs freier Spieltest

Aktueller Produktstatus: **`HUMAN_TUNE · NOT_PLAYABLE`**.

Kernblocker:

- Bewegung ist zu langsam, ruckelig und derzeit nicht spielbar;
- Ladezeit und Frametiming sind nicht akzeptabel;
- Bewegungs- und Zustandsanimationen sind sichtbar falsch oder falsch getaktet;
- das Fahrzeug sitzt nicht korrekt auf dem Boden;
- außerhalb der Straße fehlt eine lückenlose befahrbare Terrain-Kollision: auf Grünflächen und anderen Wegen fällt das Fahrzeug durch die Welt.

Nachrangig, aber dokumentiert:

- bekannte Schatten-/Hellkanten-Artefakte an Boulder und Props.

Die öffentliche Stage bleibt als reproduzierbarer Fehlerbeleg erhalten. Sie ist **keine** freigegebene spielbare MVP-Version.

## Status

`PUBLIC_ROUTE_PRESENT · AUTOMATED_BROWSER_PASS · HUMAN_TUNE_NOT_PLAYABLE`

Direkter Fehlerbeleg: <https://kayfabizarro.pages.dev/kfb-hub/stage/world/world-drive-interact-m2a/>

## WORLD-M2A-R1 · 2026-09-27

R1 wurde nach zwei Kandidaten regelkonform gestoppt. Der Kandidatenbranch ist nicht auf die feste Stage veröffentlicht.

Bestanden:

- der befahrbare Boden deckt jetzt die vollständige sichtbare Hürth-Zone von 716 × 716 m ab;
- das geparkte Fahrzeug wird bereits vor dem Einsteigen physikalisch gesetzt: 4/4 Radkontakte und 0,002–0,003 m sichtbarer Bodenabstand;
- eine automatisierte Offroad-Fahrt bewegte das Fahrzeug rund 24 m mit 4/4 Kontakten und ohne Fall/Recovery;
- Walk-Antritt und Zustandswechsel wurden beschleunigt;
- der beste gemessene Kaltstart bis zur Kontrolle lag bei 14,2 s und erfüllt damit das 15-s-Ziel;
- Paketprüfung: 23/23 PASS.

Noch nicht bestanden:

- Frame p95 liegt bei 84,4 ms zu Fuß und 89,4 ms fahrend statt höchstens 33,3 ms;
- der Renderpfad verbraucht etwa 46–71 ms pro Bild, während Movement, World-Update und UI jeweils deutlich unter 1 ms bleiben;
- die öffentliche Stage bleibt deshalb unverändert der bekannte Fehlerbeleg; R1 ist nur ein erhaltener Candidate.

Die priorisierte Kosten-/Nutzen-Entscheidung steht in `PERFORMANCE_VALUE_MATRIX.md`. Track S9/S4B, Emanata/Brick Fish und weitere neue GitHub-Inputs sind gesichert, aber ausdrücklich nicht in diesen Reparaturpass gezogen worden.

R1-Implementierungscheckpoint: `58297e79696fe60f805cb0bf894f1da9fa2beb7b`.

R1-Status: `CONTACT_AND_BOOT_PASS · RENDER_BUDGET_FAIL · CANDIDATE_PRESERVED · NOT_PUBLISHED`.

## WORLD-M2A-R2/R3 · 2026-09-27

R2 bestätigte Metal-Hardwarebeschleunigung und verwarf einen wirkungslosen Shader-Kandidaten. R3 setzt darauf genau eine räumliche Stadtstaffelung um:

- nahe Bereiche: akzeptierte elastische Gebäude samt heutiger Fassade;
- entfernte Bereiche: leichte Hülle aus echtem OSM-Grundriss und echter Quellhöhe, ohne einzelne Fenster/Türen und ohne Echtzeitschatten;
- 96-m-Bereiche mit 120/150-m-Umschaltspanne;
- keine zweite World-, Terrain-, Movement- oder Drive-Ownership;
- ein sauberer Slot für spätere echte KayKit-/Tiny-Treats-/Kenney-Fassadeninstanzen, aber noch keine erfundenen Ersatzteile.

Ergebnis: ca. 185–198 Tsd. statt 1,13 Mio. sichtbare Dreiecke. Idle/Walk/Drive p95 liegen bei 43,3/42,7/43,9 ms. Das ist ungefähr halb so teuer wie R1, bleibt aber oberhalb des 33,3-ms-Ziels. Der vollständige lokale Browserlauf besteht 34/34, das Paket 24/24. R3 wird nicht auf die feste Stage veröffentlicht.

R3-Implementierungscheckpoint: `342f06886f2dc1410a7d4b11d7cc0a5f150f9cd5`.

## WORLD-M2A-R4 · 2026-09-27

Der eine erlaubte Kandidat verbindet zwei bereits gemessene Hebel:

- Die 3D-Auflösung sinkt während Bewegung auf 0,65 (schmal 0,60) und stabilisiert sich 1,4 s nach Stillstand auf 0,86 (schmal 0,72). Das HUD bleibt scharf, weil nur der WebGL-Inhalt skaliert wird.
- Entfernte OSM-Stadthüllen behalten ihre Form und Farben, verwenden aber nicht den vollständigen Clay-Relief-Shader. Die nähere Welt behält den Hirnwelt-Knetlook.

Ergebnis: Paket **26/26**, Browser Desktop + schmal lokal **38/38** und auf der festen öffentlichen Stage erneut **38/38**, keine Seiten-/Request-/HTTP-Fehler. In den drei isolierten 8-s-Messläufen lagen Idle, Walk und Drive jeweils bei **16,7 ms p95**; das Ziel von höchstens 33,3 ms ist damit lokal erreicht. Die Qualitätsregel wechselte im Start/Stop-Test exakt `stable → moving → stable`, nicht frameweise.

R4-Implementierungscheckpoint: `1d803d177789fa834c5165fe36caa12fc26fe7c7`.

Status: `LOCAL PERFORMANCE PASS · PUBLIC BROWSER PASS · HUMAN FREE-PLAY PENDING`.

## Genau ein nächster Gate

Georgs freien Spieltest auf der unverändert veröffentlichten R4-Stage durchführen. Danach separat `FACADE-DONOR-01`: echte KayKit-/Kenney-Türen und -Fenster isoliert beweisen, skalieren/deformieren/umfärben und instanziert in die nahe Fassadenstufe einsetzen.
