# Kartenbewertung R1 (Georg 27.10.2026: 5 Kriterien, Sterne 1–5)

Gilt für jede Karte, die der Deck-Analyzer gegen den Druck liest. Bewertet wird die **gedruckte Karte** (Titel, Bild, Power, Lore), nicht das alte JSON.

## Fünf Kriterien, je 0–2 Punkte

| Kürzel | Frage | 0 | 1 | 2 |
|---|---|---|---|---|
| `pointe` | Trägt die Pointe? Titel, Bild und Text zusammen | kein Witz erkennbar oder nur Wortspiel im Titel | Witz da, aber erklärt sich selbst oder ist vorhersehbar | Pointe sitzt beim ersten Lesen, Bild und Text verstärken sich |
| `power` | Versteht man die Power ohne Erklärung? Spielbar? | unklar, fehlt oder nur Schlagwort | verständlich, aber vage („Gain advantage“) oder ohne Bezug zum Motiv | klare Handlung, spielbar, Mechanik spiegelt das Motiv |
| `lore` | Ist der Lore-Satz allein zitierbar (Marketing, Song)? | fehlt, Füllsatz oder Aufzählung | ordentlich, braucht aber die Karte als Kontext | steht allein, man würde ihn zitieren |
| `wissen` | Steckt ein echter Wissenskern drin (Fakt, Begriff, Mechanismus)? | keiner oder falsch | angedeutet, oberflächlich | konkret und richtig, man lernt etwas |
| `bild` | Passen Bild und Text zusammen? | Bild beliebig oder widerspricht | passt zum Thema, trägt aber nichts bei | Bild ist Teil der Pointe |

## Summe → Sterne

| Summe | Sterne |
|---:|---:|
| 9–10 | 5 |
| 7–8 | 4 |
| 5–6 | 3 |
| 3–4 | 2 |
| 0–2 | 1 |

## Gegen Inflation

- Erwartung je Deck: Mitte bei 3 Sternen. 5 Sterne sind die Ausnahme (Richtwert ≤ 10 % der Karten), 4 + 5 Sterne zusammen ≤ 30 %.
- Liegt ein Deck darüber: alle 4- und 5-Sterne-Karten noch einmal gegen die Tabelle prüfen, bevor es abgegeben wird. Bleibt es darüber, kurz begründen (`ratingNote` am Deck).
- Ein Kriterium bekommt 2 Punkte nur mit einem konkreten Grund. Im Zweifel 1.
- `reason` nennt das entscheidende Kriterium (was hebt oder senkt die Karte), ein bis zwei Sätze Klartext, keine Werbesprache.

## Felder

Karte (neu, das alte `grade` 1–3 bleibt unverändert, weil Spiel/Viewer es lesen):

```json
"rating": {"stars": 3, "scores": {"pointe": 2, "power": 1, "lore": 1, "wissen": 1, "bild": 1}, "reason": "…", "version": "R1", "ratedAt": "2026-10-27"}
```

Deck (neu, alte Felder bleiben, ersetzte Werte mit Suffix `Legacy`):

```json
"deckRating": {"stars": 3, "avgPoints": 5.6, "distribution": {"1": 2, "2": 9, "3": 30, "4": 12, "5": 3}, "reason": "…", "ratingNote": null, "version": "R1"}
```

- `topCards` / `worstCards` neu aus `rating` (höchste bzw. niedrigste Punkte, je 5 bzw. 3). Alte Listen in `topCardsLegacy` / `worstCardsLegacy`.
- `viralScore` neu (1–10) mit `viralReason` (ein Satz: welche Karte/welcher Satz würde geteilt und warum). Alter Wert in `viralScoreLegacy`.
