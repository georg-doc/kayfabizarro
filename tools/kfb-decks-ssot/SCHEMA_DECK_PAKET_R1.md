# Deck-Paket · Schema R1 (V-1147, V-363, Auftrag WS0 01.11.2026)

Ein Ordner je Deck: `decks-ssot/<packId>/`. Spiel, Viewer, Almanach und Rollout-Desk lesen dasselbe Paket.

```
decks-ssot/<packId>/
  deck.json        Kartentext (Druck), Bewertung, Bildverweise, Motiv-Rechteck, Prüfstand, Altwerte
  bilder/cover.webp
  bilder/karte/NN.webp   Viertelseite aus dem Druck-PDF, rund 1366 px, nichts beschnitten
  bilder/motiv/NN.webp   Motiv-Ausschnitt, längste Seite rund 700 px
  texte/<kanal>.md       Kanäle und Suno aus dem Rollout-Desk (nur Decks mit Freigabe für Marketing)
  texte/status.json      Status je Kanal
  prüfung.json     Prüfer-Ergebnis, Herkunft (PDF, Seite, Viertel, Prüfsumme), Textänderungen, Widersprüche
```

## deck.json

| Feld | Inhalt |
| --- | --- |
| `schema` | `kfb.deck-paket/1` |
| `packId`, `title`, `role`, `question` | Kennung wie in `media/kfb/index.json` und im Spiel (`deckId`) |
| `quelle` | `{druckPdf, sha256, seiten, coverOffset, jsonStand}`; das Druck-PDF führt beim Text |
| `bewertung` | `deckRating` (GRADING_R1), `topCards`, `worstCards`, `viralScore` + `viralReason` |
| `marketing` | Deck-Werte aus dem Rollout: `viralScoreAlt`, `overallScore`, `coverScore`, `g1Anteil`, `hashtags`, `tier`; überschreiben keine Kartenwerte |
| `verweise` | `{video, songs, tratsch}` als Verweise, keine Kopien |
| `cover` | `bilder/cover.webp` |
| `cards[]` | siehe unten |

## Karte

| Feld | Inhalt |
| --- | --- |
| `cid` | `cid:<packId>:<nr>`, wie `cardRelief.js` es im Spiel speichert |
| `n` | Kartennummer (`cardNumber`) |
| `cardName`, `cardNamePrint` | Titelschreibung V-271; Druckform nur, wenn sie abweicht |
| `power`, `lore` | Druckfassung; `stats` wenn gedruckt |
| `grade` | 1–3, unverändert aus dem Bestand, Spiel und Viewer lesen es |
| `rating` | `{stars, scores{pointe,power,lore,wissen,bild}, reason, version, ratedAt}` |
| `bilder` | `{karte, motiv}` relative Pfade |
| `motiv` | `{rect:[x,y,w,h], quelle, guete}`, Anteile der Karte, Ursprung oben links |
| `herkunft` | `{seite, viertel, rect}` im Druck-PDF |
| `pruefstand` | `{text, method, checkedAt, printTypo, printOpen}`; `text`: `gesehen` oder `offen` |
| `jsonLegacy` | Altwerte `{cardName, power, lore}`, nur wenn der Druck abweicht |

## prüfung.json

`{ergebnis, geprueftAm, zaehlung{…}, befunde[], textAenderungen[], widersprueche[], stichproben[], kosten{modell, tokens, minuten}, bilder{bytes, kartenKB, motivKB}}`

## Regeln

- Druck-PDF führt beim Kartentext. Original-PDFs bleiben unverändert.
- Keine Textänderung ohne Eintrag in `textAenderungen`, Altwerte bleiben in `jsonLegacy`.
- `grade`, Sterne und Marketing-Scores stehen nebeneinander, Widersprüche werden gelistet, nicht gemittelt.
- ROT-Decks bekommen kein `texte/`.
- `media/kfb` bleibt auf diesem Zweig unverändert; der Spielanschluss kommt später (WS1).

Prüfung: `python3 tools/kfb-decks-ssot/deck_pack_check.py decks-ssot/<packId>`
