# Stand v10 und was als Nächstes kommt — 9. August 2026

## 1 · Was heute dazugekommen ist (S5–S20)

| Slice | Kern |
|---|---|
| **S5** BLÖDSINN!-Regie | Tod ist ein Ereignis: Blinken → zackiger Flug → Landung. Kein Teleport |
| **S6a–h** Fortschritt | Sechs Werte · Fluff abgeleitet · **POP** statt XP · kein Level. Fünf HUD-Kopien derselben Liste beseitigt |
| **S7** Anti-Rules-Raster | Seite-1-Typ gemessen (Zelle 1,712), Befund: das Deck hat mehr als ein Seitenlayout |
| **S8a–c** Kante der Kartenzone | *Karte · Feder · Wasser · dünne Feder*, ohne Streifen. Schatten bleibt auf dem Blatt |
| **S9** Sprechblase | Aus Pet Studio v4 portiert, **bedienbar**: sechs Knöpfe |
| **S10** Fraktions-Phrasen | Acht Stimmen; die Quelle wird **durch** die Stimme gesprochen, nicht zitiert |
| **S11** Wegelagerer | Übungsgegner abseits der Wege |
| **S12–14** Feinschliff | Etikett 1 px, Schatten, Denkblase atmet, Schrittlänge (Boden je Bild 11,95 → 5,94) |
| **S15** Gestrichelte Feder | Preset `card-dash`: dieselbe Feder, unterbrochen. Bauchung und Feder identisch zur vollen Kante |
| **S16** Kartenrückseiten | 2×2 aus Seite 16, geschnitten mit dem **Vorderseiten**-Raster |
| **S17** Mini-Story | Sechs Anlässe, Beats von außen (NIE). `reveal` 1,6 s nach `win` |
| **S18a/b** ChatterBox S1 | Geometrie vor Streaming · Schrei (Bangers, Zacken) · Denkblasen für Tiere |
| **S19a–d** Blasenbudget | Max 2 in der Welt, 1 je Zone, Eskalation bis 4, darüber nackte Glyphs |
| **S20** Identität | Name + Titel + **Ruf-Schmähung** mit Namen. −3 schmäht, −9 greift an |

## 2 · Offen — bei uns, in Reihenfolge

1. **Wiseguy** (ChatterBox §11). Witzpool, Nachbarn hassen ihn, Rechtsklick-Menü, ausweichendes
   Duell mit **hartem Ende** (3 Fehlschläge oder 8 s → Puff; ein Treffer möglich, wenn man ihn in
   die Ecke treibt). Alle Bausteine liegen: Blase, Knöpfe, Emotes, Budget.
2. **Timing-Feinschliff** (ChatterBox S1 §6). 15 CPS, Mindeststandzeit, Antwortverzögerung,
   Pointen-Pause. Braucht das Timing-Lab, nicht nur Zahlen.
3. **Fluff-Leiste aus WS0s Baukasten** — wartet auf `ui-kit-ts.js` und `ui-slices.json`.
4. **Name/Titel-Fenster** — `setName`/`setTitel` liegen bereit, Oberfläche gehört zu WS0 (Paket 3).
5. **Signatur-Shader je Terrain** (`docs/SSOT_Waber_Shader.md`) — liegt seit v10-S2 still.
6. **`byPage`-Kartenraster** — entschieden, KISS-vertagt bis es weh tut.
7. **Terrain-Schnittlinien und Schere** — das `card-dash`-Preset trägt beides, es fehlt der Ort.

## 3 · Konzept-Slices für ChatGPT und Coworker (parallel, ohne Code)

Fünf Aufträge, die **hier nichts blockieren** und deren Ergebnis direkt einbaubar ist. Alle nach
derselben Grenze: **Inhalt und Struktur dort, Laufzeit hier.**

### K1 · Titel-Katalog
Fünf Titel stehen, das ist zu wenig für ein Sammelobjekt. Gebraucht: **20–30 Titel** mit je einer
Bedingung, die aus dem Spielstand ablesbar ist (`hunt`, `collected`, `rep`, `shouts`, Zonen, Decks).
Register: KFB-satirisch, kurz genug für die HUD-Zeile (≤ 28 Zeichen). **Keine Boni, keine Zahlen.**
Die interessante Frage: welche Titel sind **peinlich** statt ruhmreich? Ein Titel, den man nicht
zeigen will, ist mehr wert als einer, den jeder trägt.

### K2 · Schmährufe je Fraktion
Sechs Register liegen als Muster vor, je drei bis vier Zeilen. Gebraucht: **je sechs**, plus zwei
neue Lagen (Publikum, Hofwache). Die Regel: `{who}` ist die Stelle für »Titel Name«, und der Satz
muss **auch ohne Titel** funktionieren. Und: **Steigerung**. Bei Ruf −3 klingt es anders als bei −9,
kurz vor dem Angriff. Zwei Stufen je Fraktion wären das Ziel.

### K3 · Der Witzpool (Wiseguy)
Nicht brillante Witze, sondern **flaches Material mit gutem Timing** (Fips-Asmussen-Logik). Ein
Auftrag mit drei Teilen: (a) 30–40 kurze Witze je nach Fraktion, (b) das **Duell-Geplänkel** —
was ruft er beim Ausweichen, in Steigerung über drei Runden, (c) der Abgangssatz vor dem Puff.
Länge: eine Blase, nie zwei.

### K4 · Deck → Avatar-Skin (Trophäen-Mapping)
Georgs Idee vom 9.8.: jedes gekaufte Deck schaltet einen Avatar-Skin frei. Gebraucht ist **nicht**
der Code, sondern die **Zuordnung**: welches Deck, welcher Skin, welche Rolle spielt er im
Meta-Narrativ dieser Welt. Und die Frage, die vorher zu klären ist: ist der Skin **kosmetisch**
(dann Trophäe, K1-konform) oder **narrativ** (dann Teil der Zonen-Mini-Story) — oder beides, und
wie hält man das auseinander?

### K5 · Mini-Story-Beats für die Tutorial-Zone
Das Gerüst (S17) läuft, der Inhalt fehlt. Gebraucht: **eine vollständige Zone** mit Beats für alle
sechs Anlässe (`enter · guard · fight · win · reveal · leave`), Skelett/Graveyard, plus zwei
Alternativ-Beats je Anlass für den zweiten Besuch. Das ist der Testfall, an dem sich zeigt, ob sechs
Anlässe reichen — und die Antwort darauf ist wertvoller als weitere Konzeptseiten.

**Reihenfolge, wenn ihr wählen müsst:** K5 vor K3 vor K2 vor K1 vor K4. K5 beantwortet eine offene
Frage, K3 baut den nächsten Slice hier, die anderen füllen auf.

**Stay fluffy.**
