# HOUSEKEEPING · living (Stand 2026-09-25) · additiv zu 2026-09-24

Status: `AKTIV` · `FROZEN` · `SUPERSEDED` · `DEAD` · `ASSET` · **geteilt** = von mehreren Deliverables importiert

## Cologne World Shell · WB-D2 · Sprint 1 (Session 2026-09-25)
| Artefakt | Status |
|---|---|
| `KFB WB-D1 · Cologne World Shell.dc.html` | AKTIV · Kandidat, Georg 25.09.: „top!“ |
| `wd1-boot.js` · `wd1-seam.js` · `wd1-city.js` · `wd1-names.js` (neu) · `wd1-landmark.js` · `wd1-water.js` | AKTIV |
| `fixtures/cologne-dom-crop-v0.json` | FROZEN |
| `fixtures/huerth-crop-v0.json` | FROZEN · neu |
| `fixtures/huerth-alstaedten-v0.json` | FROZEN · neu · Regelabweichung (OSM-Abruf in Claude Design), Re-Cache durch OSM City Lab offen |
| `fixtures/raw/alstaedten-osmapi-v0.json` | ASSET · 2,2 MB · nicht im Export · Upload-Kandidat |
| `w0-region.js` · `w0-ink.js` | AKTIV · **geteilt** (WB-W0, WB-D1/D2) · unverändert |
| `export/SESSION_2026-09-24_WB-D1/` | SUPERSEDED durch `export/SESSION_2026-09-25_WB-D2/` (Docs additiv übernommen) |

## Aufräum-Kandidaten (nur benannt, nichts ausgeführt)
- `screenshots/` · ~38 Arbeits-Captures (w0-*, wb1-*, check*, inspect*, alst-check*) → löschen, zwei Belege liegen im Export unter `evidence/`.
- `uploads/Bildschirmfoto 2026-09-25 um 03.53.32.png` · `… 04.21.38.png` → verarbeitet, löschbar.
- `export/SESSION_2026-09-24_WB-D1/` → nach Georgs OK löschen (superseded).
- `fixtures/raw/` → nach Upload ins Repo löschen.

## Pfad-Hygiene
- Fixtures laufen über `./fixtures/…` (relativ). Im Chat-Projekt ok; für Standalone/Live → RAW-URL nach Repo-Upload. **Fix-Kandidat.**
- Donoren, three.js, Fonts: bereits RAW/CDN-URLs.

## Clean-Run-Checkliste WB-D2
- [ ] Drei Zonen laden (Köln Dom/Hbf · Hürth · Hürth-Alstädten), Log ohne ✗
- [ ] Hausfüße ohne hellen Streifen, Schatten sitzt an der Wand (Straßen- und Top-Kamera)
- [ ] Alstädten: Start auf home, Ring + Schild Stotzheimer Str. 26
- [ ] Street names off / on road / signs / both live
- [ ] Facade: 0 Gebäude ohne Detail
- [ ] Köln: Clean-Run-Checkliste WB-D1 weiterhin grün
