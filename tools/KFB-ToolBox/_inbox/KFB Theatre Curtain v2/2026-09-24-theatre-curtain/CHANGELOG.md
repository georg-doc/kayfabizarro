# CHANGELOG.md — KFB/MED Deck Viewer

Additiv. Neue Einträge oben anhängen, bestehende nie umschreiben oder löschen.

## 2026-09-24 — Theatre Curtain v2: WebGPU-Donor-Cloth ×2, rot, geschlossen/offen getunt

- Auf Georgs Vorschlag: `mrdoob/three.js` `examples/webgpu_compute_cloth.html` (Commit
  `7300402f96c23bfa2174ffc0da01fb4e277d33da`) als zwei unabhängige Panel-Instanzen dupliziert,
  Sim/Compute-Shader/Material-Technik unverändert übernommen — nur Farbe auf KFB-Rot (`#8c3f37`)
  geändert, plus Spiegelung (rechtes Panel) und eine seitliche Zug-Uniform für die fixierte
  Schienen-Reihe (ersetzt den Donor-Sphere-Collider-Mechanismus fürs Auf-/Zuziehen).
  Neu: `KFB Theatre Curtain v2.html`.
- Normal-Flip-Bug beim gespiegelten Panel gefunden und gefixt (Analytic-Normal-Vorzeichen
  invertiert sich durch die X-Spiegelung, dadurch war das rechte Panel cremefarben statt rot).
- Auf Nutzer-Feedback: Vorhang höher/größer (clothHeight 1→1.9, breiter 1→1.15), Kamera angehoben,
  Panels überlappen leicht am Zentrum (railGap -0.06) für lückenlosen geschlossenen Zustand,
  Steifigkeit erhöht + Wind-Uniform reduziert für einen geraderen, weniger bauchigen Faltenfall.
  Kein Streifen-/Flicker-Artefakt (gleiche texturlose Sheen+HDR-Technik wie der Donor).
- Fünf gescheiterte Fixversuche am v1-CPU-Verlet-Port + volle Root-Cause-Analyse:
  `docs/POSTMORTEM_2026-09-24_theatre-curtain-stripe-artifact.md`,
  Neustart-Anleitung: `docs/HANDOVER_THEATRE_CURTAIN_FRESH_START.md` (jetzt umgesetzt).

## 2026-09-24 — Theatre Curtain v1: Abbruch CPU-Verlet-Ansatz, Neustart auf WebGPU-Donor

- Recovery-Prompt umgesetzt: SVG/CSS-Curtain-Versuch hart ersetzt durch den echten v1-Donor
  (`georg-doc/kayfabizarro@chat/gds-theatre-curtain-v1-2026-09-20`,
  `game-ready/theatre-curtain-v1/runtime/kfb-theatre-curtain.mjs`), gemountet in
  `KFB Theatre Curtain.dc.html`.
- Tieback/Bulge-Refinement ergänzt (TIE/UNTIE, kontinuierliche Bulge-Kurve statt harter
  Kordel-Pin-Reihe), HUD-Hide-Toggle, hellere Beleuchtung.
- Fünf aufeinanderfolgende Fixversuche gegen ein Streifen-/Flicker-Artefakt bei Bewegung
  (Anisotropie, alternierende Mesh-Diagonale, Sheen/normalScale-Tuning, analytische
  Vertex-Normalen, Entfernen von normalMap/roughnessMap) — keiner hat das Problem auf
  Original-Niveau gelöst.
- 1:1-Vergleichsmount des offiziellen `mrdoob/three.js` `examples/webgpu_compute_cloth.html`
  (Commit `7300402f96c23bfa2174ffc0da01fb4e277d33da`) als `Three.js Donor - webgpu_compute_cloth.html`
  — läuft streifenfrei, weil es *keine* Textur verwendet (nur Volltonfarbe + Sheen + HDR-Reflexion)
  und Normalen analytisch pro Quad berechnet statt per `computeVertexNormals()`.
- **Reißleine gezogen:** CPU-Verlet-+-Textur-Architektur wird nicht weiter gepatcht. Vollständige
  Analyse in `docs/POSTMORTEM_2026-09-24_theatre-curtain-stripe-artifact.md`, Neustart-Anleitung in
  `docs/HANDOVER_THEATRE_CURTAIN_FRESH_START.md`. Nächster Schritt (neuer Chat): den bewiesenen
  WebGPU-Donor selbst duplizieren/rot einfärben statt seine Eigenschaften im CPU-Port nachzubauen.

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
