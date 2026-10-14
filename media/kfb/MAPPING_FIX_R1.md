# Kartenzuordnung Registry – Korrektur R1 (14.10.2026)

Basis: `main` @ `ac9dbaed` (der Stand, den WS1 geprüft hat). Geändert: `media/kfb/index.json` und drei Karten-JSONs in `media/kfb/`. Keine PDFs, keine Bilder.

## Methode

1. **Vorher:** WS1-Audit (`ws1/kfb-planet/src/data/mapping-audit.json`, Branch `ws1/r3f-frame`). Einmal unverändert nachgelaufen: 45 von 78 SAFE, Status bei allen 78 Decks gleich, bei 5 Decks ±1 Karte OCR-Schwankung.
2. **Regel aus den Karten-JSONs** (`pageCount`, `cardCount`): `pageCount × 4 = cardCount` → coverOffset 0; `pageCount = cardCount/4 + 1` → coverOffset 1; sonst Sonderfall.
3. **Belege aus WS1-Rohdaten** (`ws1/kfb-planet/test/audit/<deck>.json`, OCR je Viertel, nur gelesen): für jeden Kartennamen das Viertel suchen, in dem er steht, und daraus Seite und Offset ablesen.
4. **Nachher:** die korrigierte Registry gegen dieselben WS1-Rohdaten bewertet, mit derselben Bewertung wie WS1 (`--rescore`-Logik), **ohne neuen OCR-Lauf**. Das ist eine Vorhersage. Endgültig wird es erst mit WS1s neuem Lauf (`python3 scripts/audit-mapping.py`) auf diesem Commit.

Aus den Rohdaten nicht prüfbar sind die erste Kartenseite der Decks auf Offset 0 und die letzte Kartenseite der Decks auf Offset 2, weil der WS1-Lauf diese Seiten nicht gelesen hat. Diese Karten zählen in der Vorhersage als nicht freigegeben.

## Änderungen

| Deck | Änderung | Audit vorher (WS1) | Vorhersage nachher |
|---|---|---|---|
| `1001_kayfabe_nights` | coverOffset 1→0, pages 16→15 | UNSAFE 0/53 | SAFE 53/56 |
| `cosmic_grift_dark_journalism` | coverOffset 1→0, pages 16→15 | UNSAFE 0/56 | SAFE 52/56 |
| `epistemic_sabotage` | coverOffset 1→0, pages 16→15 | UNSAFE 0/56 | SAFE 56/56 |
| `jung_and_shinn_a_guide_to_cosmic_cringe` | coverOffset 1→0, pages 16→15 | UNSAFE 0/56 | UNSAFE 46/56 (Zuordnung stimmt, siehe offen) |
| `kayfabizarro_improv_comedy` | coverOffset 1→0, pages 16→15 | UNSAFE 0/56 | UNSAFE 32/56 (Zuordnung stimmt, siehe offen) |
| `kayfabizarro_pulitzer_punk` | coverOffset 1→0, pages 16→15 | UNSAFE 0/56 | SAFE 54/55 |
| `reality_redrawn` | coverOffset 1→0, pages 16→15 | UNSAFE 0/56 | SAFE 54/56 |
| `museum_of_modern_mess` | coverOffset 1→0, pages 16→13 | UNSAFE 0/48 | SAFE 47/48 |
| `nibelungen_booster_pack_design` | coverOffset 1→0, pages 16→15 | UNSAFE 0/56 | SAFE 55/56 |
| `shadow_monopoly_blackrock_vanguard_co` | coverOffset 1→0, pages 16→15 | UNSAFE 0/56 | UNSAFE 44/56 (Seiten 6+8 andere Anordnung) |
| `the_biology_of_rebellion_hilfe_ich_bin_ein_mensc` | coverOffset 1→0, pages 10→9 | UNSAFE 0/32 | SAFE 32/32 |
| `the_carnival_of_unsolved_problems_therapy` | coverOffset 1→0, pages 13→12 | UNSAFE 0/44 | SAFE 43/44 |
| `the_biological_metropolis` | coverOffset 1→0 | UNSAFE 0/32 | UNSAFE 23/28 (Zuordnung stimmt, siehe offen) |
| `federal_kayfabe` | coverOffset 1→0, pages 16→15 | UNSAFE 0/56 | UNSAFE 39/56 (siehe offen) |
| `frizzlebob_s_kayfabizarro_kompendium_elender_wic` | coverOffset 1→2, pages 16→18 | UNSAFE 0/60 | SAFE 52/56 |
| `help_i_am_a_human` | coverOffset 1→2, pages 15→18 | UNSAFE 0/56 | SAFE 49/52 |
| `grimms_kayfabe_legends_expansion_set_02` | coverOffset 1→2, pages 14→16 | UNSAFE 0/52 | SAFE 42/48 |
| `suppressed_book_deck` | coverOffset 1→2 | UNSAFE 0/20 | SAFE 15/16 |
| `anti_rules_toolkit` | Doppelte Karte #51 „The Skill Issue“ entfernt, #52–57 → #51–56, cardCount 57→56 | UNSAFE 39/57 | UNSAFE 44/56 (Zuordnung stimmt, siehe offen) |
| `big_bad_brain_wrestling` | #50 = „The Steel Steps“, #51 = „The Ring Post“ (wie gedruckt: TR, BL) | SAFE 51/56 | SAFE 53/56 |
| `unspoken_systems_kayfabizarro_meta_deck_01` | #38 Titel „TIGHT LOOP“ → „TRUST LOOP“ (wie gedruckt) | UNSAFE 46/56 | UNSAFE 47/56 (siehe offen) |
| `platos_dungeon_raid_hero_set_01` | `pdf` mit typografischem Apostroph (’), wie die Datei im Repo heißt | 404 | nicht prüfbar (keine Rohdaten), WS1-Lauf nötig |
| `geopolitical_thrillers_conspiracy_theories` | `pdf` mit typografischem Apostroph (’), wie die Datei im Repo heißt | 404 | nicht prüfbar (keine Rohdaten), WS1-Lauf nötig |

`pages` = Seitenzahl des PDFs, wie WS1 sie mit PDFKit gemessen hat. Die beiden PDFs mit Apostroph sind Byte für Byte gleich mit den lokalen Original-PDFs (gleicher git-Blob-Hash).

**Summe (Vorhersage):** SAFE 45 → 58 von 78, freigegebene Karten 2344 → 2950.

## Offen (mit Grund)

**Zuordnung stimmt, die Prüfung erkennt den Titel aber nicht sicher.** In den Rohdaten steht der eigene Titel jeweils im erwarteten Viertel. Er geht verloren, weil Seitenüberschriften davor stehen, weil der Titel über zwei Zeilen läuft oder unter den sieben gelesenen Zeilen liegt, oder weil Stempelwörter auf jeder Karte zugleich Kartennamen sind (KayfaBOGGLE!, BLÖDSINN!, „Blödsinn!“):
- `anti_rules_toolkit`. Außerdem ein Druckfehler auf #50, der Titel steht dort doppelt.
- `bullshit_jobs_uncut`
- `jung_and_shinn_a_guide_to_cosmic_cringe`
- `kayfabizarro_improv_comedy`. Dazu tragen die Leerkarten #57/#58 im Druck „[ Write Name Here ]“ statt ihres JSON-Namens.
- `kayfabizarro_monomyth_mayhem`. Bei #45 „The Sword“ ist der Druck unklar, er zeigt „THE TOOL…“.
- `the_biological_metropolis`. Die Regel aus dem JSON ergäbe Offset 1 (9 Seiten, 32 Karten), die Extraseite liegt aber hinten.
- `unspoken_systems_kayfabizarro_meta_deck_01`. Der Titel steht unten in der Karte. Außerdem weichen POWER/LORE im JSON im ganzen Deck vom Druck ab.

Hier hilft keine Datenkorrektur. Gebraucht wird eine bessere Prüfung oder ein Blick auf die Bilder.

**Andere Seitenanordnung (4 Karten in einer Reihe statt 2×2).** Das 2×2-Raster schneidet diese Karten durch. Die Registry-Regel kann das nicht ausdrücken, dafür bräuchte es eine Ausnahme je Seite. Diese Karten bleiben gesperrt:
- `deep_state_plumbing`: Packseiten 2, 6, 8, 14, also #1–4, #17–20, #25–28, #49–52
- `observation_underground`: Seiten 3 und 5, also #9–12 und #17–20
- `shadow_monopoly_blackrock_vanguard_co`: Seiten 6 und 8, also #21–24 und #29–32
- `romantic_kayfabe`: Seite 15, also #53–56. Das Deck ist trotzdem SAFE.

**Karten-JSON passt nicht zum Druck.** Hier muss der Daten-Eigentümer neu erfassen, denn Titel werden nicht erfunden:
- `frizzlebob_s_ego_mania_narcissist`: #37–56 sind im Druck andere Karten (z. B. „The Cross-Bearing Donkey“, „The Bandaged Leech“).
- `frizzlebob_s_mission_control`: #37–56 sind im Druck andere Karten (z. B. „100% Completion“, „Challenge Run“).
- `federal_kayfabe`: Offset 0 ist belegt. Mehrere JSON-Titel weichen aber vom Druck ab (z. B. „Alexander Hamilton's Ghost“ / „…CURSE“, „Andrew Jackson Kills a Bank“ / „…BANK SLAYER“). Dazu ragen die Titel der unteren Reihe ins Nachbarviertel. Die Titel bleiben unverändert, bis jemand die Bilder geprüft hat.

**Kein einheitlicher Offset.** `kayfabizarros_ontological_hazards`: #1–12 stehen auf Offset 1, dann folgt eine Extraseite (Seite 5), ab #13 gilt Offset 2. Einzelne Karten (#2, #5, #43–47) stehen woanders. Lösbar nur mit neuer Reihenfolge im JSON oder einer Ausnahme je Seite.

**Kein Standard-Kartendeck** (laut JSON-Notizen):
- `philosopher_dungeon_raid`: Szenario-Heft, nur die Seiten 3 und 14 sind 2×2.
- `the_importance_of_being_kayfab_earnest`: eine Karte pro Seite.
- `shakespearean_animal_beatdown`: Mischheft, nur 7 Karten erfasst.
- `the_uruk_rumble`: POWER/LORE im JSON leer, deshalb ohne Karten im WS1-Pool. Die Regel (15 Seiten, 52 + 2 Bonuskarten) passt zu Offset 1.

## Hinweise für Folgesysteme

- Die Asset Registry (`tools/asset_registry/decks.py`, läuft nach Merge auf `main`) misst coverOffset selbst als `pdfPages − ceil(Karten/4)` und überschreibt damit `index.json`, wenn das Ergebnis 0 oder 1 ist. Bei `the_biological_metropolis` ergibt das 1, richtig ist 0. Decks mit coverOffset 2 kommen dort als „unverified“ ohne Seite/Viertel an.
- `anti_rules_toolkit` #51–56 haben neue Nummern. Wer Karten über Deck + Nummer anspricht, bekommt damit jetzt das richtige Bild.
- `media/kfb/kfb-index.json` (alte 4-Deck-Liste) führt `sonic_slaughterhouse` mit derselben PDF wie `epistemic_sabotage` und coverOffset 1. Nicht geändert.
- Die Regel aus Schritt 2 trifft bei 57 von 78 Decks den Registry-Wert. Die übrigen 21 sind Sonderfälle (Extraseiten, fehlendes `pageCount`, Nicht-Standard-Decks); `the_biological_metropolis` ist oben erklärt.
