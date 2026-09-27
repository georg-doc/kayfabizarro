# WORLD-FLIGHT-CLAY-C0 · Test Report

Datum: 2026-09-27  
Status: `LOCAL_BROWSER_PASS · PUBLIC_UNKNOWN`

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

`browser-proof.mjs` → **36/36 PASS**

Browser: lokales Google Chrome, HTTP-Preview.  
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

Noch nicht ausgeführt. `PUBLIC_VERIFIED` bleibt false, bis die feste Cloudflare-Route mit dem erwarteten Source-Marker geöffnet wurde.
