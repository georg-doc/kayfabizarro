# CLAUDE.md — Projekt-Onboarding (KFB/MED Deck Viewer)

Immersiver, embeddable + standalone PDF-Viewer für KayfaBizarro/MedKayfab „Cut & Play"-Comic-Card-Decks (Querformat-PDF, 2×2-Kartenraster pro Seite) + Gameplay-Sim-Prototyp.

**Spec des Auftraggebers (Georg):** `uploads/KAYFABIZARRO_VIEWER_HANDOVER.md` — dessen §0 („Nicht verhandelbar") gilt weiter: Layout wird ARITHMETISCH abgeleitet (kein CV), Card-Mode = Center-Cut + Regler, nur CSS+Canvas (kein WebGL), Paper-Theme default, Modul bleibt single-file vanilla JS ohne Build-Step.

## Stand seit 2026-08-04 — Deck Viewer v3/v4

Georgs Export v3.2 liegt jetzt 1:1 im Projekt und ist der aktive Zweig:

- `KFB Deck Viewer v3.dc.html` + `deckviewer/*.js` — unveraenderter Export v3.2 (Reader ·
  Galerie · Stapel · Coverflow; Korpus kommt live aus `raw.githubusercontent.com`,
  `docs/README_v3_export.md`). Nicht anfassen, das ist die Referenz.
- `KFB Deck Viewer v4.dc.html` — v3 plus **Full-View**: Knopf in der Kopfzeile links vor dem
  Coverflow, ein Blatt fuellt den Schirm, die Reihe laeuft waagerecht endlos im Kreis
  (`wrap()`), Klick = Kasten, Doppelklick = Deck, Schnittkante waagerecht wie im Coverflow.
  Lesegroesse nur fuer den Brennpunkt (`FULL_IMG = IMG_W`) — pdf.js rechnet auf dem
  Oberflaechenfaden, drei grosse Blaetter auf einmal legen die Seite still. Nachbarblaetter
  laufen auf 60 % Deckkraft, der Kasten mit Deck- und Kartentitel kommt erst auf Klick und
  liegt ueber allem. Kopfzeile faellt gestuft: Zaehler < 1120 px, Stapel < 900 px, Wortmarke
  < 620 px; Avatar bleibt, `flex: 0 0 auto` verhindert das Schieben.
- `KFB Deck Viewer v4 -standalone src-.dc.html` + `exports/KFB Deck Viewer v4 standalone.html` —
  Einzeldatei (1,5 MB). Die drei in JS verdrahteten Bilder (Schere PNG/GIF, Kartenruecken)
  haengen an `ext-resource-dependency`-Metas und werden ueber `window.__resources` gelesen,
  mit RAW-URL als Rueckfall. Netz bleibt noetig: pdf.js und der Korpus kommen live.
- `HOUSEKEEPING.md` — Status je Artefakt plus Clean-Run-Checkliste. Vor jedem Export nachziehen.
- Der aeltere v1-Zweig (unten) liegt weiter daneben, ist aber nicht mehr die Baustelle.

## Dateikarte (v1-Zweig)

- `kfb-viewer.js` — DAS Modul (v1.1.0). `KayfabizarroViewer.mount(el, opts)` + headless `.loadDeck(opts)`. Shadow-DOM-gescoped. Änderungen hier betreffen beide Pages.
- `KFB Deck Viewer.dc.html` — Deck-Picker (Testmatrix / GitHub-Discovery / Upload) + Viewer, EN/DE.
- `KFB Gameplay Stage.dc.html` — „Story Table": Quest-Slot + D6-Tracker, 3 Scene-Slots, Actor-Slot (Player 1–6). Agent-Kontext: `window.KFBStageContext`.
- `pdfs/*.pdf` + `decks/*.json` — 8 Test-Decks (kanonische Pfade). `uploads/` = Original-Uploads, nur Archiv.
- `assets/d6-*.svg` — Georgs D6-Faces (in der Stage zusätzlich als Data-URI generiert, `diceSrc(n)`).
- `exports/*_standalone.html` — Single-File-Builds (~18 MB, 4 Decks via fetch-Shim eingebettet; `window.__KFB_EMBEDDED` filtert die Deck-Listen).
- `docs/KFB_VIEWER_V1_DOKU.md` (vollständige API/Architektur) · `docs/BACKLOG.md` · `docs/HANDOVER_CLAUDE_COWORKER.md`.

## Design-System (Paper)

BG `#F4EFE6` · Fläche `#FBF8F1` · Ink `#26221C` · Muted `#7B7368` · Akzent Rust `#A6512E` · Grün `#5E8C61` (Actor/JSON-Signal) · Würfel `#F3EAD3`/`#1F1A14`. Font: **Archivo** (Google Fonts) + `ui-monospace`-Stack für Meta/Badges. Chrome leise, Karte ist der Star.

## Testmatrix-Kurzinfo

A/B/C + 3× MedKayfab = Standard (56 Karten + Cover = 15 Seiten ✓). Epistemic Sabotage + World's Fair = Abweichler (60 Karten, 15 Seiten → `needs-review`; Banner-„Apply" = Cover-Flip rekonziliert). Reading-Order row-major an Deck B verifiziert („The Doomsday Clock" oben links auf S. 2).

## Fallstricke

- pdf.js kommt gepinnt von cdnjs (3.11.174) — Netz nötig, auch in Standalone-Builds. Der Worker wird als same-origin Blob geladen; **`isEvalSupported:false` niemals setzen** (Renderzeit explodiert auf pattern-lastigen Seiten, z. B. World's-Fair-Cover: 54 ms vs. >45 s).
- `uploads/`-Dateinamen enthalten Leerzeichen/Klammern → `run_script` kann `(1)`-Pfade nicht lesen und der HTML-Bundler bettet sie nicht ein. Deshalb existiert `pdfs/` mit sauberen Namen — **neue Assets immer clean benennen**.
- Standalone-Rebuild: `super_inline_html` auf die DC-Page, danach fetch-Shim + Base64-Assets per `run_script` nach `<head>` injizieren (Dateilimit 20 MB ⇒ 4 Decks). Rezept in Doku §5.
- MedKayfab-PDFs (WEB_v1) ≠ JSON-Edition (ADD web); World's-Fair-JSON-Reihenfolge ≠ Seitenreihenfolge — bekannte Deck-Issues, siehe Doku §7.
- Viewer-Einstellungen persistieren in localStorage (`kfb-viewer:prefs`, `kfb-viewer:deck:*`) — beim Testen dran denken, nie fremde Keys löschen.
