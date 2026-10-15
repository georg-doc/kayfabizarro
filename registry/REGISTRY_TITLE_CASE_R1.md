# Registry: Kartentitel nach V-271 – R1 (15.10.2026)

Georg hat am 15.10. freigegeben: Die Registry-Kopien der Kartentitel werden nach **V-271** (Kartentitel von Versalien auf Titelschreibung, siehe `media/kfb/CARD_TITLE_CASE_R1.md`) neu erzeugt. Sonderfälle bleiben, wie sie sind.

Basis: `data/kfb-card-title-case-2026-10-15` @ `eade4aec`. Darin ist der Registry-Mapping-Fix `data/kfb-registry-mapping-fix-2026-10-14` @ `a9f5ffa1` schon enthalten (Vorfahre von `eade4aec`). Er wird mitgenommen und nicht überschrieben.

## Was neu erzeugt wurde

Nur `registry/assets/v1/decks/` (134 Dateien): `index.json`, `town.json`, `qa-report.json`, `cards.jsonl` und 130 Deck-Dateien `<deckId>.json`. Andere Dateien unter `registry/` enthalten keine Kartentitel (geprüft mit `git grep` nach `cardName` und Beispieltiteln) und bleiben unverändert.

## Wie

- Generator aus dem Repo: `tools/asset_registry/decks.py` (`build_decks`), Schreiblogik wie `tools/asset_registry/generate_decks.py`. Code unverändert.
- Eingabe: `media/kfb/` von `eade4aec`, per `git archive` in ein Scratch-Verzeichnis ausgepackt (kein Checkout). `tracked_paths` aus `git ls-tree eade4aec`, `sourceCommit` = `eade4aec9c9f…`.
- Gegenprobe vorher: Derselbe Lauf auf dem alten Quell-Commit `073b79c3` (Stand der bisherigen Registry) ergibt alle 134 Dateien **Byte für Byte gleich** mit der Registry in `eade4aec`. Der Generator ist also reproduzierbar, und die Änderungen unten kommen nur aus den Kartendaten.

## Zählung

- 130 Decks, **6984 Karten** (vorher 6985; `anti_rules_toolkit` #51 doppelt entfernt durch `a9f5ffa1`, #52–57 → #51–56).
- Kartentitel geändert: **1548** Datensätze je Kopie (Deck-Datei und `cards.jsonl`).
  - **1503** reine Groß-/Kleinschreibung (V-271, = Zahl in `CARD_TITLE_CASE_R1.md`).
  - 45 Textänderungen aus den Kartendaten seit `073b79c3` (Drucktext-Kanonisierung `CARD_TEXT_CANONICAL_R1.md`, Mapping-Fix `MAPPING_FIX_R1.md`), z. B. `anti_rules_toolkit` #51–56 neu nummeriert, `big_bad_brain_wrestling` #50/#51 getauscht, 30 Titel in `the_carnival_of_unsolved_problems_therapy`.
- Weil der Generator den ganzen Datenstand abbildet, kommen auch diese Änderungen der Kartendaten seit dem letzten Registry-Lauf (`073b79c3`) mit: `lore` 581, `power` 542, `grade` 4 Karten; `coverOffset` 5 Decks (aus `index.json` von `a9f5ffa1`), `indexPages` 16 Decks, PDF-Pfade mit typografischem Apostroph bei 2 Decks (`geopolitical_thrillers_conspiracy_theories`, `platos_dungeon_raid_hero_set_01`), Registry-Probleme 2 → 0 (`DECK_PATH_NORMALIZED` entfällt).
- `anti_rules_toolkit` steht jetzt auf `mappingStatus: unverified` (56 Karten, gemessener Offset 2; der Generator akzeptiert nur 0/1, wie in `MAPPING_FIX_R1.md` beschrieben). Seite/Viertel dieser 56 Karten sind dadurch `null`.

## Prüfung

Unabhängig vom Generator: Jeder Titel in den Deck-Dateien und in `cards.jsonl` wurde mit dem Titel in der Kartendatei (`cardName`, sonst `name`) für dasselbe Deck + dieselbe Kartennummer verglichen. Abgleich nie über den Titel.

- Deck-Dateien: 6984/6984 gleich, 0 abweichend.
- `cards.jsonl`: 6984/6984 gleich, 0 abweichend.
- Nicht zuordenbar: keine (kein Registry-Datensatz ohne Kartendaten, keine Karte ohne Registry-Datensatz, keine doppelte Deck + Nummer).
- Sonderfälle unverändert in Versalien: `programming_the_whole_child` #27 USAID, #40 OECD / PISA, #41 UNESCO; `project_gateway_kayfabe` #53 COINTELPRO.

## Nicht enthalten

`cardNamePrint` (1503 Karten in den Kartendaten) steht nicht in der Registry. Das Kartenformat der Registry legt der Generator fest (`kfb.card-ref/1` und Deck-Karten mit `cardName`), und Registry-Dateien werden nicht von Hand bearbeitet. Wer die gedruckte Schreibweise in der Registry braucht, muss sie in `tools/asset_registry/decks.py` ergänzen.
