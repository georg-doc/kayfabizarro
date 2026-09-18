# KFB Free Roam · tatsächlicher öffentlicher Prüfstand

**18.09.2026 · FR-S04-01 · IMPLEMENTED / PUBLIC BROWSER PASS / HUMAN REVIEW OPEN**

## Fester Einstieg und erste Version

- Dauerhafter Testeinstieg: https://kayfabizarro.pages.dev/kfb-hub/free-roam/
- Unveränderliche erste Fahrzeugfassung: https://kayfabizarro.pages.dev/kfb-hub/free-roam/versions/fr-s04-01/
- Implementierung / Recovery: https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/main/ChatGPT_web/free-roam/RETURN.md

Der Navigator hat einen aktuellen Release-Zeiger und eine Liste veröffentlichter Versionen. Neue Free-Roam-Fassungen bekommen eigene Versionspfade; ältere veröffentlichte Pfade bleiben erhalten. Aktuell gibt es genau eine neue Free-Roam-Version. Daneben stehen die bestehenden World/Ground8-, BOX1/v0.8-, Resident-S6- und World-Atlas-Einstiege. Diese Owner-Einstiege folgen ihren aktuellen Fassungen und sind keine eingefrorenen historischen Snapshots. Es gibt keinen automatischen Figuren-/Fahrzeug-/Save-Transfer zwischen diesen Anwendungen.

## Tatsächlich ausgeführter Public-Test

**48/48 Prüfungen PASS** auf der tatsächlichen KFB-Cloudflare-Adresse, kein Ersatzhost und kein localhost-PASS als Public-PASS umbenannt.

Run: https://github.com/georg-doc/kayfabizarro/actions/runs/35358106388

Job: `105642348266` · Artefakt: `10553581108` / `free-roam-public-proof` · erstellt `2026-09-18T14:48:50Z`.

Originales ZIP SHA-256: `bc5eb818dfd4671e1130edd5ff8702b38f49e32895d25a449dd337c128aac886`.
Originales `public.json` SHA-256: `117ffa396a4016a31fdd1b995873fa88490ba7ca62390a41765edbb47cfd0529`.

Das Artefakt wurde heruntergeladen, seine Prüfsumme bestätigt, `public.json` vollständig ausgewertet und Navigator-/Narrow-Screenshots angesehen. Der Report enthält genau 48 bestandene Checks und keine Script-/Console-Fehler. 48 ist die Gesamtzahl aus Quellen-, Auslieferungs-, Navigations- und Browserprüfungen, nicht 48 verschiedene Fahrmanöver.

Abdeckung: Deployment-Marker, je elf Source-Identitäts- und ausgelieferte Byteprüfungen, aktueller Navigator-Zeiger, vier Vergleichslinks, WebGL-Kaltstart, Startfreigabe, vier Suspension-Kontakte auf gebackenem Terrain, Vorwärtsfahrt, Bremsen/Rückwärtsfahrt, begrenztes Rückwärtstempo ohne Boost, physische Lenkantwort rückwärts, Pause/Input-Clear, lokaler Reset, alter/neuer Inputvergleich auf derselben Physik, kontaktgebundener Hop, Blur, begrenzter Up-Fehler, schmales Viewport und Rückweg zum Navigator. Vergleichslinks wurden auf Vorhandensein geprüft; die vollständigen anderen Apps sind dadurch nicht neu abgenommen.

Der wiederverwendbare Prüfer liegt unter `qa/public.mjs`; Workflow `.github/workflows/free-roam-public.yml`. Screenshots und vollständiger Report liegen im benannten Actions-Artefakt. Die Version selbst bleibt unverändert; dieser Bericht aktualisiert die getrennte Auslieferungsevidenz gegenüber dem beim Packaging noch offenen Public-Status in `MIRROR.json`.

## Quellen- und Implementierungsstand

Race-Quelle: `d98600ef52c9f1fc28bd93bcbbe8f6f177eece37`.
Race PR #5 / Merge: `04256ecb817e5d0e2e57a2476039294c26ceab79`.
Public PR #57 / geprüfter Auslieferungsmerge: `f044d7908d967e1cf8056b2f831a7d30529b1fda`.

Vorgelagerter Source-Test: 9/9 reine Inputtests und 19/19 Chromium/WebGL-Browserchecks bestanden, Race Run `35356984356`, Artefakt `10552591312`. Seine ZIP-Prüfsumme ist `ca0f5ec15bfd7cd89f3c663e4078c3f13bc50352b844f8f1a6bda34a8bce50a1`.

Eine echte vorhandene Slice-04-/Rapier-Fahrzeugphysik wurde quellengepinnt für ein ausdrücklich begrenztes Fixture adaptiert. Produktions-`race/src/physics.js` und BOX1/v0.8 wurden nicht geändert. Der echte Travel-Terrainbäcker liefert Darstellung und Kontaktgeometrie: 255 transformierte trockene Originaldreiecke; 81 trockene Bodenproben im/am Testbereich. Kein Ersatzplanet und keine neue Höhenfunktion.

Die erste laufende Quellprobe lag trotz ihrer eng begrenzten grünen Tests zu nah an Wasser. Screenshot-Review führte zur neuen trockenen Standortauswahl und erneuter Prüfung; die alte Fassung wurde nicht veröffentlicht. Der vorherige MIME-Bootfehler wurde durch Same-Origin-Packaging unveränderter Travel-JS-Quellen behoben. Beide Befunde bleiben als datierte Testhistorie erhalten.

Transportabweichung ausdrücklich dokumentiert: Im öffentlichen `physics.js` fehlt gegenüber dem generierten Source-Paket nur das letzte LF-Byte. Anhängen dieses einen Bytes ergibt den exakten Source-Hash. `MIRROR.json` erklärt den Unterschied; Public-QA bestätigt Source-Äquivalenz und tatsächliche ausgelieferte Bytes getrennt. Andere getestete Runtime-Dateien stimmen exakt überein. Keine unzutreffende pauschale Byteidentitätsbehauptung.

## Was Georg jetzt testen kann

`Play current candidate → Start driving → W → S halten → rückwärts mit A/D lenken → B bremsen → Inputprofil wechseln und vergleichen`.

W/S vor/zurück; A/D lenken; Q/E Drift; Shift Vorwärtsboost; Space Hop; B Bremse; R Reset. Pause sowie Orbit-/Follow-Kamera sind über sichtbare Buttons erreichbar. Der neue Input hat Brems-/Neutralphase vor dem Richtungswechsel und ein eigenes Rückwärtslimit. Das alternative rohe Slice-04-Inputprofil läuft auf derselben Physik und demselben Gelände, nicht als vollständige unveränderte alte Insel-Runtime.

Die neue Probe enthält einen originalen GitHub-Kart und zwei Eingabeprofile. Die umfangreichere Fahrzeug-/Deformerwahl bleibt in BOX1, Charakter-/Movementwahl in World/Ground8 und Resident Atlas erreichbar. Keine in der Probe nicht vorhandene Fahrer- oder Fahrzeugauswahl behaupten.

## Grenzen und nächster Receiver

**Noch offen:** menschliches Urteil zu Lenkung/Rangieren/Fahrgefühl, vollständige Drift-/Boostabstimmung, längeres Freeplay und physische Mobilgeräte. Das schmale Chromium-Viewport ist kein Gerätetest; auf kleiner Fläche bleibt die HUD-Platzierung ein Reviewpunkt.

**Nicht umgesetzt durch diese Version:** Ein-/Aussteigen, Fahrer-/Charakterwechsel in der neuen Probe, geparkter Wagen plus Save/Reload, vollständiges City-Quartier, Combat-Anschluss, Audio/BOX1-Deformertransfer und Integration in den laufenden Travel-Host. Feste lokale -Y-Gravitation mit sichtbarer Radius-16-Grenze und vorgeschlagenem 3-Grad-Up-Budget ist nur ein begrenzter Kontaktversuch, keine global gültige sphärische DRIVE-Lösung.

Nächste benannte Naht: vorhandene Travel-Welt/Modusbrücke, ein aktiver Bewegungsowner, sichere Übergabe derselben Figur zum geparkten Wagen und zurück, danach Zustand wiederherstellen. Keine dritte Engine und kein neuer Welt-/Save-Owner.

Native ChatGPT-Site: nicht erzeugt, entsprechendes Werkzeug in dieser Session nicht verfügbar. KFB-Cloudflare-Auslieferung: tatsächlich geprüft wie oben. Die fehlende native Site wird nicht durch Download, iframe oder Ersatzhost als erfüllt dargestellt. Bestehende Owner, Human-Gates und der aktive Astra-r3-Brief bleiben unverändert; kein großer Astra-Lauf gestartet.
