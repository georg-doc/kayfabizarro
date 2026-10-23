# SSOT_SPOKEN_LINES · Code und Daten zum Triplet-SSOT · R1.3 · 24.10.2026
**Maßgeblich sind:**
- **`replies/TRIPLET_SSOT_R1.md`** (WS0, V-698, mit V-699 Satzbild in Sprechblasen und V-700 „ganze Sätze, kein Doppelpunkt“);
- **`replies/SUNO_SSOT_R1.md`** (V-689);
- `TRIPLET_SET_SPEC_R2.md` und `SONG_SPEC_R3.md`.

Dieser Ordner schreibt **keine** Regeln ab. Er liefert Code und Daten, die diese Regeln umsetzen bzw. prüfen. Was im Triplet-SSOT noch fehlt, steht als Vorschlag in `VORSCHLAG_AN_WS0_R1.md`. Verbindlich wird es erst, wenn WS0 es übernimmt (über Gate und Prüfer).

| Datei | Zweck | setzt um |
|---|---|---|
| `spoken_line_lint.py` | Prüfskript für Kartenzeilen. FAIL bei Doppelpunkt, Klammern, fremden Wörtern, fehlendem Titel, „and then“ und Dubletten; WARN bei Semikolon, Telegramm, Mechanik, Länge, Lore-Kopie und Deck-Schablone. Hygiene, kein Qualitätsbeweis. | V-700, V-266, V-372, KayfabeTip 1; Vorschlag §0.6/§0.8 |
| `lore_fallback.py` | `clean_lore(title, lore)`: Lore-Bereinigung für den Rückfall (Klammern, Etiketten, „Power: N“, Doppelpunkte) | Georg 24.10.; Vorschlag §0.1/§0.2 |
| `TR1_INDEX.json` | Tratsch-Triplets tr1 je Deck: Pfade zu lines.csv, blocked.json und Kartenquelle, dazu die Laufzeitregeln | Georg 24.10. „mach die 11 Tratsch-Decks so“ |
| `tr1_cards/*.cards.json` | Druck-Kartenquellen der tr1-Decks (PDF führt, V-242/V-696) | V-696 |
| `../SONGS_WORKSHOP_R1/<deck>/<deck>.tr1.lines.csv` | eine Kartenzeile je Karte (Entwurf, nicht abgenommen) | TRIPLET_SSOT §2 |
| `../SONGS_WORKSHOP_R1/<deck>/<deck>.tr1.blocked.json` | gesperrte Karten (nie sprechen) | Vorschlag §0.5 |
| `../SONGS_WORKSHOP_R1/OPENER_POOL_BY_STANCE_R1.json` | Opener nach Haltung und Satzbau (nur Status POOL ist freigegeben) | V-218, V-325; Vorschlag §0.4 |
| `checks.json` | Zuordnung Lint-Check → Quelle (V-Nummer oder Vorschlag) | – |
| `VORSCHLAG_AN_WS0_R1.md` | Ergänzungen, die im Triplet-SSOT fehlen, mit Beispielen und Lessons | Vorschlag |

**Aufruf**

```bash
python3 spoken_line_lint.py <cards.json> <lines.csv> --mode tratsch|song|set
```

```bash
python3 lore_fallback.py
```

Der Lint muss 0 FAIL zeigen. V-699 (fette Titel, Rufe in fester Schreibweise) gilt nur für angezeigte Blasen; die Daten hier sind Klartext ohne Markup. Das Markup setzt die Anzeige.

**Änderungen:** Regeländerungen nur im Triplet-SSOT (WS0). Hier ändert sich nur Code und Daten, mit Eintrag im Workshop-Status.
