# CHANGELOG.md — KFB/MED Deck Viewer

Additiv. Neue Einträge oben anhängen, bestehende nie umschreiben oder löschen.

## 2026-10-09 — Deck Viewer v5 · canonical deep links

- v4 was verified as the donor and remains preserved; `KFB Deck Viewer v5.dc.html` is the new candidate.
- Shared corpus adapter now reads the deterministic v2 deck projection from `media/kfb/index.json`.
- Real PDF page counts replace manifest guesses: 130 decks / 1,915 pages / 6,985 card rows.
- Stable `?deck=&card=` and `?deck=&page=` routing plus browser-history handling.
- Exact `kfb.card-ref/1` copy labels for verified mappings.
- Fail-closed behavior for 23 unsafe mappings: full pages remain visible, card crops are disabled and labeled unverified.
- Mission Control card 56 acceptance deep-link resolves to page 15 with zero console errors in Chromium.

## 2026-09-13 — Kanonische PDFs/Assets via GitHub geladen

- 7 der 8 Test-Matrix-PDFs (`pdfs/*.pdf`) durch kanonische Bytes aus
  `raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/kfb/` ersetzt:
  deck_a_utopia, deck_b_dystopia, deck_c_protopia, epistemic_sabotage,
  medkayfab_cardiology, medkayfab_emergency, medkayfab_pharmacology (→ Pharmacology_01).
- `worlds_fair_conspiracy.pdf` bleibt lokal/ungeklärt — kein "World's Fair"-Deck mehr in
  der aktuellen 130-Decks-Registry. Offen für Georgs Entscheidung.
- `assets/d6-*.svg` durch kanonische Kopie aus `media/kfb/d6-*.svg` ersetzt (identisch,
  jetzt mit belegter Herkunft).
- Passende `.pdf.json`-Kartenmetadaten für die vier Deck-A/B/C/Epistemic-Sabotage-PDFs
  zusätzlich unter `media/kfb/` roh mitgeführt (Herkunftsbeleg, nicht der Viewer-Input —
  der bleibt `decks/*.json`).

## 2026-08-04 — Deck Viewer v4: Full View + Standalone-Export

- `KFB Deck Viewer v4.dc.html` neu: sechste Ansicht **Full View** vor dem Coverflow — Blatt
  füllt den Schirm, waagerechte Endlosreihe (`wrap()`), Klick öffnet den Titel-Kasten,
  Doppelklick öffnet das Deck. Nur die Fokus-Seite rendert in `FULL_IMG = IMG_W` (1200 px),
  Nachbarblätter auf 60 % Deckkraft — pdf.js sonst zu langsam für mehrere Großseiten gleichzeitig.
- Schere global gefixt: harter Bildwechsel PNG/GIF statt Überblendung, korrektes
  Seitenverhältnis, kein Quetschen mehr.
- Kopfzeile responsive gestuft: Zähler < 1120 px, Stapel < 900 px, Wortmarke < 620 px
  ausgeblendet; Avatar bleibt; `flex: 0 0 auto` verhindert Verschieben.
- Standalone-Kette ergänzt: `KFB Deck Viewer v4 -standalone src-.dc.html` (Metas +
  `window.__resources`-Verdrahtung für Avatar/Schere/Kartenrücken) → `super_inline_html` →
  `exports/KFB Deck Viewer v4 standalone.html` (1,5 MB). pdf.js und der 130-Comic-Korpus
  bleiben live vom Netz (RAW-GitHub + CDN), bewusst nicht eingebettet.
- `deckviewer/*.js` (deck-meta, deck-edit, deck-draft, kfb-corpus, ink-frame, kfb-ink-canon)
  unverändert — v3 und v4 teilen sich dieselben Module.
- `HOUSEKEEPING.md` neu angelegt: Status je Artefakt + Clean-Run-Checkliste.
- `CLAUDE.md` um v4-Abschnitt (Full View, Standalone-Rezept) nachgezogen.
- v3-Zweig (`KFB Deck Viewer v3.dc.html`) unverändert als Referenz eingefroren.
