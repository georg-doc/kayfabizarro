# HOUSEKEEPING.md — KFB/MED Deck Viewer

Living-Status je Artefakt. Statuswerte: `AKTIV` · `FROZEN` · `SUPERSEDED` · `DEAD` · `ASSET`.
Nichts wird gelöscht ohne Georgs ausdrückliche Freigabe, jeder Schritt einzeln.

_Letzter Stand: 2026-08-04 (Session „Deck Viewer v4 / Full View + Standalone")_

## Deliverables

| Artefakt | Status | Notiz |
|---|---|---|
| `KFB Deck Viewer v4.dc.html` | **AKTIV** | v3 + Full View, responsive Kopfzeile, Scherenfix |
| `exports/KFB Deck Viewer v4 standalone.html` | **AKTIV** | Single-File-Build 1,5 MB, Netz nötig (pdf.js + Korpus) |
| `KFB Deck Viewer v4 -standalone src-.dc.html` | SUPERSEDED | Zwischenstufe für den Bundler, reproduzierbar aus v4 |
| `KFB Deck Viewer v3.dc.html` | **FROZEN** | Georgs Export v3.2, Referenz — nicht anfassen |
| `KFB Deck Viewer.dc.html` (v1) | SUPERSEDED | v1-Zweig, Deck-Picker + Testmatrix |
| `kfb-viewer.js` (v1.1.0) | SUPERSEDED | gehört zum v1-Zweig, von v3/v4 NICHT importiert |
| `KFB Gameplay Stage.dc.html` | AKTIV | eigenständiger Prototyp, unabhängig vom Viewer |
| `KFB Living Illustration Lab.dc.html` + `kfb-living.js` | AKTIV | eigener Zweig, außerhalb dieser Session |

## Geteilte Module — nie als tot einstufen

| Modul | Status | Importiert von |
|---|---|---|
| `deckviewer/deck-meta.js` | **AKTIV · GETEILT** | v3, v4 |
| `deckviewer/deck-edit.js` | **AKTIV · GETEILT** | v3, v4 |
| `deckviewer/deck-draft.js` | **AKTIV · GETEILT** | v3, v4 |
| `deckviewer/kfb-corpus.js` | **AKTIV · GETEILT** | v3, v4 — pdf.js-Loader + Registry + Kachel-Cache |
| `deckviewer/ink-frame.js` | **AKTIV · GETEILT** | v3, v4 (module) |
| `deckviewer/kfb-ink-canon.js` | **AKTIV · GETEILT** | von ink-frame referenziert |

## Assets & Daten

| Pfad | Status | Notiz |
|---|---|---|
| Korpus `media/kfb/index.json` + PDFs | **ASSET · kanonisch im Repo** | RAW-URL, nie einbetten |
| Avatar, `scissors_open.png`, `scissors.gif`, Kartenrücken | **ASSET · RAW-URL** | im Standalone via `ext-resource-dependency` inlined |
| `pdfs/*.pdf` + `decks/*.json` | ASSET | v1-Testmatrix, lokal |
| `assets/d6-*.svg` | ASSET | Gameplay Stage |
| `uploads/` | ASSET · Archiv | Original-Uploads, nie exportieren |
| `exports/*_standalone.html` (v1, ~18 MB) | SUPERSEDED | schwer — gehört auf Platte/Repo, nicht ins Zip |
| `screenshots/` | ASSET | Abnahme-Captures |

## Clean-Run-Checkliste (v4)

1. `KFB Deck Viewer v4.dc.html` öffnen → Boot-Zeile, dann Korpus 130 Decks / 1914 Seiten.
2. Alle sechs Ansichten durchklicken: Reader · Galerie · Stapel · Coverflow · **Full View** · Deck.
3. Full View: waagerecht scrollen über den Umbruch hinaus (`wrap()` greift), Klick = Kasten, Doppelklick = Deck.
4. Kopfzeile bei 1120 / 900 / 620 px prüfen — Icons fallen weg, Avatar bleibt, nichts verschiebt sich.
5. Schnittkante: Regler bewegen, GIF/Standbild wechselt hart, Schere nicht gequetscht.
6. Standalone: `super_inline_html` auf `… -standalone src-.dc.html`; die `%23n`-Warnung ist ein Fehlalarm (Filter-Fragment in der Korn-Data-URI).
7. Kein `./assets/...` im v4-Code — alle Assets absolute RAW-URL.

## Cleanup-Kandidaten (benannt, NICHT ausgeführt)

- `KFB Deck Viewer v4 -standalone src-.dc.html` — nach Abnahme löschbar.
- v1-Zweig (`KFB Deck Viewer.dc.html`, `kfb-viewer.js`, `exports/*_standalone.html`) — SUPERSEDED, Georgs Call.
- `uploads/` schwere PDFs — gehören per RAW-URL, nicht ins Projekt.
