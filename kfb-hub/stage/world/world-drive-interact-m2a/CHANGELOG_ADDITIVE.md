# WORLD-DRIVE-INTERACT-M2A · Additive Changelog

## 2026-09-27 · productive Drive + E integration

- World M1 ohne Ersatzwelt übernommen;
- exakte Free-Roam-Physik und Drive-Intent aus Race PR #10 bytegleich paketiert;
- ein bewährtes Kenney-Fahrzeug samt Vehicle Deformer v2 integriert;
- World-Terrain und OSM-Gebäude in Kontaktflächen für den bestehenden Drive-Owner übersetzt;
- `E` als gemeinsamen Interaktions-Key eingeführt; Ground-Strafe rechts auf `R` verschoben;
- sichtbaren Cartoon-Einstieg, Fahrer und sicheren Ausstieg ergänzt;
- Ground, Drive und Flight mit jeweils genau einem Movement-/Camera-Owner verbunden;
- Desktop und Narrow Browser 28/28 PASS;
- Track Core ausdrücklich nicht durch einen Proxy ersetzt.
- Hirnwelt-H0-Knete als sichtbaren Standard gesetzt; Original bleibt reversibel per Toggle oder `?look=original`.
- 2026-09-27 · Feste Cloudflare-Stage publiziert und im echten Browser erneut mit 34/34 Prüfungen auf Desktop und schmalem Viewport bestätigt.

## 2026-09-27 · Human free-play override

- Georgs Urteil als `HUMAN_TUNE · NOT_PLAYABLE` aufgenommen;
- automatischen 34/34-PASS auf technische Lade-/Ablauf-Evidence begrenzt;
- langsame/ruckelige Bewegung, Ladezeit/Frametiming, Animationstiming, Fahrzeug-Bodenniveau und fehlende Offroad-Terrainkollision als Kernblocker erfasst;
- Boulder-/Prop-Schattenartefakt als nachrangigen sichtbaren Bug erfasst;
- öffentlichen Stand als reproduzierbaren Fehlerbeleg erhalten;
- genau einen begrenzten nächsten Gate gesetzt: `WORLD-M2A-R1`.

## 2026-09-27 · R3 City Shell LOD

- Stadt in räumliche 96-m-Bereiche geteilt;
- nahe Gebäude mit akzeptierter elastischer Form und Fassade erhalten;
- entfernte Gebäude auf leichte OSM-Grundriss-/Quellhöhen-Hüllen reduziert;
- Fassadendetails und volle Gebäudegruppen nur in Spielernähe gezeichnet;
- Umschaltspanne 120/150 m gegen sichtbares Flattern ergänzt;
- Clay-Umschaltung respektiert unsichtbare LOD-Materialien;
- Paket 24/24 und lokaler Browser Desktop/schmal 34/34 PASS;
- sichtbare Last auf ca. 185–198 Tsd. Dreiecke gesenkt;
- p95 Idle/Walk/Drive auf 43,3/42,7/43,9 ms gesenkt, Ziel 33,3 ms noch verfehlt;
- Pixelratio-Diagnose als nächsten Haupthebel belegt; Kandidat nicht veröffentlicht.

## 2026-09-27 · R4 Adaptive Resolution + Clay Distance Budget

- WebGL-Auflösung auf 0,65 während Bewegung und 0,86 nach 1,4 s Stillstand gestaffelt; schmale Ansichten nutzen 0,60/0,72;
- Zustandswechsel mit Haltezeit versehen, damit die Bildqualität nicht frameweise pumpt;
- HTML-/HUD-Oberfläche von der internen 3D-Auflösung unberührt gelassen;
- entfernte Stadt-Hüllen auf einfaches raues Knetmaterial ohne vollständiges Relief begrenzt;
- R3-Stadt-LOD auch für das R4-Profil aktiv gehalten;
- Paket 26/26 und Browser Desktop/schmal 38/38 PASS;
- p95 Idle/Walk/Drive jeweils 16,7 ms, damit Ziel ≤ 33,3 ms lokal bestanden;
- Kandidat als eigener Branch gesichert; Public-Stage erst im nächsten Publication-Gate.
- exakt diesen R4-Unterordner auf `cloudflare-live@2e1978821a043cf604c8bc556493cae282a87a86` veröffentlicht;
- feste Cloudflare-Stage danach erneut Desktop + schmal mit **38/38 PASS** geprüft; keine Seiten-, Request- oder HTTP-Fehler;
- Produktstatus auf `PUBLIC BROWSER PASS · HUMAN FREE-PLAY PENDING` gesetzt.
