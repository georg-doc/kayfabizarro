# KFB Textur-Browser — Voll-Export 1:1

**Stand 2026-09-22** · Export-Kandidat für WSA-Chat-Review · kein GitHub-Push

Unveränderte Codebasis von `KFB Textur-Browser`. Byteweise identisch mit der Projektdatei.

## Start
```
python3 -m http.server 8000
# → http://localhost:8000/KFB%20Textur-Browser.dc.html
```
Webserver nötig. Internet nötig (three.js über unpkg, Diffuse-Texturen als `<img>` direkt
von `raw.githubusercontent.com`).

## Inhalt

| Pfad | Zeilen | Was |
|---|---|---|
| `KFB Textur-Browser.dc.html` | 536 | Anwendung: Kontaktbogen + A/B-Voxel-Vorschau, 12 Methoden |
| `support.js` | 1769 | DC-Laufzeit |
| `kfb-box-material.js` | 372 | Material-System für die Voxel-Vorschau |
| `kfb-ink-outline.js` | 173 | Screen-Space-Tusche für die Vorschau |
| `kfb-texture-catalog.json` | 541 Zeilen / 86 Einträge | Katalog: Diffuse-URLs, Slot, Bewertungsfeld |

`docs/bestand/` — Texturkonzept-Handover, Coworker-Katalogfixes, Rehome-Handover.

## Funktion laut Bestandsdoku
86 Diffuse-Texturen als Kontaktbogen, A/B-Vergleich am Voxel-Cluster, Bewertung wird lokal
gespeichert (`localStorage`) und als JSON exportiert.

## Was hier NICHT drin ist
Modelle, Animationsbibliotheken, Fonts, Audio (Regel 1). Die 86 Texturbilder selbst sind
externe SourceRefs (`<img src>` auf raw.githubusercontent.com), nicht kopiert.
