# KFB Voxel Zone S2 — Voll-Export 1:1

**Stand 2026-09-22** · Export-Kandidat für WSA-Chat-Review · kein GitHub-Push

Unveränderte Codebasis von `KFB Voxel Zone S2`. Byteweise identisch mit der Projektdatei,
keine Extraktion, keine Nacherzählung.

## Start

```
python3 -m http.server 8000
# → http://localhost:8000/KFB%20Voxel%20Zone%20S2.dc.html
```
Webserver nötig (ES-Module, `file://` scheitert an CORS). Internet nötig (three.js über
unpkg, Texturen über `raw.githubusercontent.com/georg-doc/kayfabizarro/main/`).

## Inhalt

| Pfad | Zeilen | Was |
|---|---|---|
| `KFB Voxel Zone S2.dc.html` | 454 | Anwendung: Template + `class Component`, 10 Methoden |
| `support.js` | 1769 | DC-Laufzeit — Umgebung, nicht Projektlogik |
| `kfb-box-material.js` | 372 | Material-System (`makeVariedBoxMaterial` u.a.) |
| `kfb-ink-outline.js` | 173 | Screen-Space-Tusche (Sobel über Tiefe + Normalen) |
| `asset-index.js` | 146 | Manifest-Loader, von `kfb-box-material.js` importiert |
| `terrain/world-context.js` | 291 | Weltkontext |

`docs/bestand/` — Art-Direction, Sprint-Bericht, Texturkonzept, unverändert aus `docs/`.

## Was hier NICHT drin ist

Modelle, Animationsbibliotheken, Fonts, Audio (Projektregel 1: SourceRefs, kein Asset-Kopieren).
