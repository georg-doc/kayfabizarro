# Registry-Generator: Extraseiten hinten – R1 (15.10.2026)

Georg hat freigegeben, den Generator so zu reparieren, dass `anti_rules_toolkit` wieder Seite und Viertel bekommt. Basis: `a71de421` (`REGISTRY_TITLE_CASE_R1.md`).

## Befund

`tools/asset_registry/decks.py` misst `pdfPages − ceil(Karten/4)` und akzeptiert nur die Ergebnisse 0 und 1. Bei `anti_rules_toolkit` ergibt das 16 − 14 = 2. Diese Zahl zählt aber die Extraseiten vorne und hinten zusammen. Am PDF geprüft: S. 1 ist das Deckblatt, die Karten stehen auf S. 2–15, S. 16 ist die Rückseite („PRINT. CUT. PLAY.“). Richtig ist also coverOffset **1** (wie in `media/kfb/index.json`) plus 1 Seite hinten. Hätte der Generator einfach Offset 2 akzeptiert, stünde jede Karte eine Seite zu weit hinten, und es hätten sich 12 weitere Decks mitgeändert.

## Änderung

- `media/kfb/index.json`: neues optionales Feld `"trailingPages": 1`, nur bei `anti_rules_toolkit`.
- `tools/asset_registry/decks.py`: Steht `trailingPages` beim Deck und gilt `coverOffset + ceil(Karten/4) + trailingPages == pdfPages`, dann ist die Zuordnung `verified`, mit dem coverOffset aus `index.json`. `coverOffsetStatus` ist dann `manifest-checked` statt `measured`. Decks ohne das Feld laufen wie vorher.
- `registry/assets/v1/decks/` neu erzeugt (Kartendaten von `eade4aec` + das neue Feld, `sourceCommit` weiter `eade4aec`, damit alle anderen Decks unverändert bleiben).

## Prüfung

- Gegenprobe: Der alte Generator auf `eade4aec` ergibt alle 134 Dateien Byte für Byte gleich mit `a71de421`.
- Neuer Lauf: Es ändern sich nur `anti_rules_toolkit.json`, `cards.jsonl` (nur die 56 Zeilen dieses Decks: `page`, `quadrant`, `mappingVerified`), `index.json` (nur Eintrag `anti_rules_toolkit`: `mappingStatus`, `coverOffsetStatus`) und `qa-report.json` (`unverifiedMappings` 24 → 23). Alle anderen 129 Deck-Dateien und `town.json` sind Byte für Byte gleich.
- `anti_rules_toolkit`: 56/56 Karten mit Seite 2–15 und Viertel. Am gerenderten PDF geprüft: #1 The Rules Lawyer → S. 2 oben links, #50 The Skill Issue → S. 14 oben rechts, #53 Stay Fluffy → S. 15 oben links, #56 The End → S. 15 unten rechts. Alles stimmt.
- `tools/asset_registry/tests/test_ar3.py`: 4/4 OK.

## Offen

Weitere Decks mit Extraseiten (z. B. die 4 Decks mit coverOffset 2 aus `MAPPING_FIX_R1.md`, die mit 3–4 gemessen werden) können dasselbe Feld bekommen, sobald ihre Seiten am PDF geprüft sind. Das ist hier bewusst nicht gemacht.
