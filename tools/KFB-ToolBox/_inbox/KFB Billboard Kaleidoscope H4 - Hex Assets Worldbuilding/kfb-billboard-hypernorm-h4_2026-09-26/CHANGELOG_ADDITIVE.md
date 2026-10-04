# CHANGELOG (additiv) · Billboard Hypernormalisation

Ältere Einträge bleiben stehen. Neues wird unten angehängt.

## 2026-09-26 · B2b-P1 Sichtprüfung
- SOURCE: PR #211, Runtime-Head `2348c069a99b57149d6a2685496b5ce1b40ebe1a`, 19 Dateien 1:1 kopiert nach `KFB_Billboard_B2b_P1_frozen_2348c06/`.
- DECISION: Option B, Sichtprüfung ohne Repair Pass 3.
- GEORG ACCEPTANCE: **TUNE (Konzept)**. P1 ist City-Lights-Rotation, keine Hypernormalisation. Echte PD-Quellen statt Kenney-Previews, Typo muss gesetzt sein.

## 2026-09-26 · H1 Montage-Engine
- IMPLEMENTATION: `KFB Billboard Hypernormalisation H1.dc.html`. 2:1-Tafel wie Film geschnitten, Material von `tile.loc.gov`.
- GEORG ACCEPTANCE: **REJECT** als Bildsprache, zu generisch und zu wiederholend. Bleibt Baumaterial.

## 2026-09-26 · H2 Art Direction
- IMPLEMENTATION: `KFB Billboard Art Direction H2.dc.html`. Drei Richtungen als Standbilder, jede mit eigenen Regeln.
- GEORG ACCEPTANCE: Mischung aus 1a + 1b + 1c freigegeben (Archivfoto, historische Zeichnung, prozedurale Muster, Typografie in mehreren Stilen).

## 2026-09-26 · H3 Kaleidoskop-Engine
- IMPLEMENTATION: `KFB Billboard Kaleidoscope H3.dc.html`. Register aus Druck, Schirm, Schrift und Rechenkunst in Feldern.
- GEORG ACCEPTANCE: **TUNE**. Konstruktion zu sichtbar (umrandete Kreise, Quadranten), Medienmix zu schwach, zu statisch. Gewünscht: Musikvideo, Kaleidoskop, Übergänge, Kamerafahrten, abwechslungsreiche Typo, größere Musterbibliothek. „Typography is art.“

## 2026-09-26 · H4 Kaleidoskop-Engine, Musikvideo-Logik
- DECISION: Ebenen statt Felder, eine Kamera statt Ken Burns, Songform statt gleichmäßigem Takt, Auswahl nach Unähnlichkeit.
- IMPLEMENTATION: `KFB Billboard Kaleidoscope H4.dc.html`. Canvas-2D-Compositor, 2,5D-Kamera über drei Tiefenebenen, 8 Basen, 6 Mittelebenen, 11 Typo-Behandlungen, 16 Schnitte, 10 Muster, 10 Kamerafahrten, 9 Übergänge, 9 Paletten, 4 Songformen, 6 Kontexte, K = 10 Kandidaten. Entfernt: Randkreise, Rahmen, sichtbare Konstruktion.
- TESTED RESULT: Sichtprüfung in der Claude-Design-Preview (`evidence/0*-h4*.jpg`); fps, Ähnlichkeitswert und Kombinationszahl werden live angezeigt, aber nicht als Zahlenreihe protokolliert. NOT_TESTED: 3D-Tafel, Mittelklasse-Laptop, Mobil, Stage-Ursprung (CORS).
- GEORG ACCEPTANCE: **PASS** (2026-09-26), „PASS für jetzt, kann später noch optimiert werden.“

## 2026-09-26 · Session-Cut (dieses Paket)
- Sprint-Plan `docs/SPRINT_billboard-hypernorm.md`, Briefing `docs/BRIEFING_fresh-chat_billboard-H5.md`, `HANDOVER_WSA.md`, `CONCEPT_H4.md`, `PROVENANCE_LOC_H4.json`.
- H4-Befund: GEORG ACCEPTANCE von OPEN auf PASS gesetzt. Sonst keine Codeänderung.
- EXPORT: ZIP dieses Ordners. PUBLIC DEPLOYMENT: keins.
