# Deck-Paket · Pilot R1 (01.11.2026, V-1147)

Drei Decks aus dem Rollout-Desk: `forget_utopia`, `ignore_dystopia`, `embrace_protopia`. Quelle: Druck-PDF. Prüfskript: `deck_pack_check.py`, alle drei PASS.

| Deck | Modell | Token | Zeit | Bilder | Motiv prüfen | Schnitt-Hinweise |
|---|---|---:|---:|---:|---:|---:|
| `forget_utopia` | Sonnet | 142.823 | 4.0 min | 9.0 MB | 8 | 5 |
| `ignore_dystopia` | Sonnet | 145.320 | 4.4 min | 10.8 MB | 6 | 10 |
| `embrace_protopia` | Sonnet | 137.615 | 3.9 min | 10.2 MB | 5 | 2 |

Token: Anzeige der Teilsitzung. Die Zahl aus dem Analyzer-Piloten (rund 3 Mio.) enthält Cache-Lesezugriffe und ist nicht direkt vergleichbar; die Zeit schon (8,5 min → rund 4 min, weil mehrere Seiten je Schritt gelesen werden).

## Ablauf je Deck
1. `render_pdf.swift`: Seiten 1400 px für die Teilsitzung.
2. `vision_boxes.swift` auf den Seiten, `page_split.py`: Schnittlinien. Grundsatz glatte Viertelseite; die Linie wandert nur, wenn sonst Kartentext durchtrennt würde.
3. `bake_deck.py`: `karte`, `motiv`, Cover, Motiv-Vorschlag aus Apple Vision.
4. `crop_check.py`: steht der Text ganz im Viertel? Meldungen am Bild ansehen.
5. Teilsitzung nach `tools/kfb-deck-analyzer/AGENT_BRIEF_R1.md`: `pilot/<packId>.print.json`.
6. `build_pack.py`: `deck.json`, `prüfung.json`, `texte/`. `deck_pack_check.py`: Abschluss.

## Befunde
- Text: 168 Karten gesehen, 1 echte Abweichung (`ignore_dystopia` #46: im Druck „independently“), 4 Druckfehler vermerkt, 1 Karte ohne gedruckten Text (`ignore_dystopia` #9), 1 doppelter Titel (`embrace_protopia` #29 und #50 „The Open Question“).
- Layout: `ignore_dystopia` Seite 5 hat eine versetzte Spaltengrenze; die Registry-Regel „glattes Viertel“ schneidet dort Text ab. Das Spiel schneidet heute noch glatt.
- Bewertung: Zuordnung 4–5★→G1, 3★→G2, 1–2★→G3 trifft 74 von 168 Karten (44 %). Daraus wird grade noch nicht abgeleitet.
- Vision: Unter hoher Rechnerlast liefert die Texterkennung leer zurück. `vision_boxes.swift` bricht deshalb jetzt ab, statt still weiterzulaufen. Für B und C stammt der Text aus dem ersten Lauf, umgerechnet mit `merge_vision.py`.
