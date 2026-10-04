# START_HERE · KFB Joyride J14 · Reisemodi · Session Cut 2026-09-30 r1

**Status:** DESIGN PROOF · CANDIDATE. Kein GitHub-Push, kein Cloudflare, keine Stage, keine Owner-Änderung.

## Entry Point
`KFB Joyride J14 · Travel Modes.dc.html` (Design Component, braucht `support.js` im selben Ordner).

## Vor dem ersten Start: zwei Dateien zusammensetzen (ZIP-Grenze 2 MB)
Die zwei großen Laufzeitdateien liegen als Teile bei. Ohne Zusammensetzen fehlt die Strecke.
```sh
cat lab-track/data/p1a-j14.stream.json.part0* > lab-track/data/p1a-j14.stream.json
cat ref/clay-joebinns/Fingerprints01_3K.png.part0* > ref/clay-joebinns/Fingerprints01_3K.png
shasum -a 256 lab-track/data/p1a-j14.stream.json ref/clay-joebinns/Fingerprints01_3K.png
# erwartet 4258c08f702cca3be77dde66d80ac66d5c65d760a48e51b088d005143cc5be09  und  4f5ada12ccddcd62e8b660b254eec9614b50ff1376ebc579ad693db9e66b94cf
```
Windows: `copy /b lab-track\data\p1a-j14.stream.json.part01+…part06 lab-track\data\p1a-j14.stream.json`.
Die Fingerabdruck-Textur ist optional (Fallback im Code); der Stream ist Pflicht.

## Starten
Ordner über einen lokalen Webserver ausliefern (ES-Module, fetch): `npx serve .` oder `python3 -m http.server`, dann den Entry Point öffnen. Online nötig: unpkg (three 0.160, React), Google Fonts, jsDelivr/raw.githubusercontent (KayKit-Figuren, Clips, Autos, Radio) — siehe `SOURCE.json`.

## Bedienung
Auto: W/S Gas/Bremse · A/D lenken · Q/E Drift · Shift Boost · Leer hüpfen · **I aussteigen** (< 0,5 m/s) · R zurück · C Kamera.
Zu Fuß: W laufen · Shift Sprint-Kandidat · Strg+W gehen · S rückwärts · A/D drehen · Q/E seitlich · Leer springen · **I einsteigen** (≤ 3,5 m).
Burger-Menü: Proben A/B/C (20 s), Runde automatisch, Spur als JSON, Figur ActionFigure/Black Knight, Physik K2B/K2.

## Lesereihenfolge
`HANDOVER.md` → `CURRENT_STATE.md` → `TEST_REPORT.md` → `RETURN.md` → `evidence/`.
