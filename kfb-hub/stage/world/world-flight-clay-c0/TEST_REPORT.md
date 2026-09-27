# WORLD-FLIGHT-CLAY-C0 · Test Report

Datum: 2026-09-27  
Status: `PUBLIC_VERIFIED`

## Paket

`package-proof.mjs` → **41/41 PASS**

Geprüft wurden unter anderem:

- 23 akzeptierte World-r2-Runtime-Dateien byte-identisch;
- ClayBound-Donor byte-identisch;
- genau eine WorldBuilder-Runtime;
- ST01-Revision und Breitenklassen;
- vorhandener Play-/Ground-/Placement-Owner bleibt zuständig;
- reversible Clay-Materialien;
- kein zweiter Renderer oder Kamera-Owner;
- keine Placeholder- oder Ersatzbranding-Logik.

## Browser

`browser-proof.mjs` → **36/36 PASS** lokal und **36/36 PASS** auf der festen öffentlichen Stage

Browser: Google Chrome, zunächst lokale HTTP-Preview und danach dieselbe Sequenz auf Cloudflare.
Ansichten: 1280 × 820 und 390 × 844.

Je Ansicht geprüft:

- Hürth-Welt bootet;
- Track-Rezept `2026-09-19.st01.1` mit 181 Samples;
- Ein-/Ausgang und Breiten 10,8–21,6 m;
- Start zu Fuß / Original;
- Controls sichtbar und kein horizontaler Überlauf;
- Flugmodus nutzt dieselbe Welt und steigt tatsächlich;
- Clay sichtbar und reversibel;
- World-r2-Kollision bleibt Owner;
- variable Gebäudehöhen vorhanden;
- Inline-Dokumentation öffnet;
- Rückkehr zu Fuß / Original;
- 0 Konsolenfehler, 0 Request-Fehler, 0 HTTP-Fehler.

## Öffentlicher Beweis

`https://kayfabizarro.pages.dev/kfb-hub/stage/world/world-flight-clay-c0/?build=e4b04d3e`

- Source-Marker `WORLD-FLIGHT-CLAY-C0` sichtbar;
- erwarteter Stage-Titel sichtbar;
- Desktop + schmal erneut **36/36 PASS**;
- 0 Konsolenfehler, 0 fehlgeschlagene Requests, 0 HTTP-Fehler;
- Publication-Head: `e4b04d3eb8187728e1c5eaf0e3a0303be93e7c6b`.
