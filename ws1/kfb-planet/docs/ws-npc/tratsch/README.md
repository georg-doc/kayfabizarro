# Karten-Tratsch · Stufe 0, Lauf 2 (tr1) · 24.10.2026

Headless Text-Simulation, ohne Spieländerung.

Georgs Urteil zu Lauf 1: „Der Tratsch ist okay, aber die Triplets sind falsch.“ Lauf 2 bringt neue Triplets, wählerischere Figuren und schärfere Blasen.

Konzept: `../KARTEN_TRATSCH_KONZEPT_R1.md`. Code: `src/npc/tratschSim.js`, `scripts/tratsch/stage0.mjs`. Unit-Test: `test/unit/tratschSim.mjs`.

Neu erzeugen:

```
python3 scripts/tratsch/sync-tratsch-data.py
node scripts/tratsch/stage0.mjs 7 10
```

## Dateien zum Lesen

| Lauf | Dramaturg | Rückfall ohne Triplet | MiB | Protokoll |
|---|---|---|---|---|
| **haupt** | an | roh = Titel + gedruckte Lore (Georg 23.10.) | aus | `protokoll_haupt_s7.md` |
| ohne-dramaturg | aus | roh | aus | `protokoll_ohne-dramaturg_s7.md` |
| ohne-roh | an | stumm (Vergleich) | aus | `protokoll_ohne-roh_s7.md` |
| mit-mib | an | roh | an, Auslöser ≥ 2 Übernahmen einer Karte an einem Tag | `protokoll_mit-mib_s7.md` |

- Kennzahlen je Lauf: `kennzahlen_<lauf>_s7.json`.
- Übersicht: `kennzahlen_uebersicht_s7.json`.
- Mehr-Seed-Prüfung (das belastbare Maß): `kennzahlen_seeds_1-10.json`.

## Was neu ist gegenüber Lauf 1

| | Lauf 1 | Lauf 2 |
|---|---|---|
| Triplets | t1 (verworfen) | **tr1** von Deck-Songs (ws-song/workshop-r1 @a428e091, Zeilen wie @636c9472): 11 Decks, 530 Zeilen, ganze Sätze, Titel im Satz, kein Doppelpunkt. Entwurf, Georg hat die Form an Mission Control #1–11 abgenickt. |
| Gesperrte Karten | – | 25 Karten (9/11, Geopolitical, Shadow Politics; SSOT S12) werden **nie** gesprochen, auch nicht roh. Sie kommen nicht ins Starter-Set und werden nicht weitergegeben. |
| Kartentext | cards.json + Druck-Sonderdateien | cards.json ist selbst die Druckfassung (mvp 2d236e2), identisch mit den tr1-Kartenquellen (geprüft) |
| Rückfall | „Titel: Power“ | **Titel + gedruckte Lore wörtlich**, own_clause-Opener davor, Power nie; im Protokoll „(roh)“ |
| Opener | – | nur Pool-Status POOL; Opener und Zeile ergeben einen Satz; kein Opener zweimal am Tag; Familienabstand ≥ 10; Frage und Behauptung im Wechsel; Einwurf nur in Debatten |
| BOGGLE | Lore | Lore-Sätze, die im gesprochenen Text noch **nicht** stecken; sonst bleibt die Nachfrage offen („…“) |
| Wählerischkeit | – | Faktor **satt** (−0,35 · log2(1 + fremde Decks)) und **Identität** (Anteil des eigenen Signatur-Decks < 0,5 → Abwehr fremder Karten) |
| Blasen | – | täglich aus dem BINGO-Graphen; Ruhe-Slots paaren bevorzugt innerhalb der Blase |

**Satzbild** (V-699, TRIPLET_SSOT_R1 §2b):
- Kartentitel in jeder Blase fett: 170 von 174 Titeln wurden im Text gefunden. Steht der Titel abgewandelt im Satz, bleibt er unmarkiert.
- Rufe fett in genau dieser Schreibweise: **Bingo!** · **Boggle...?** · **Bongo.** · **Blödsinn!** · **Humbug?!**
- Kursiv setzt die SIM nicht. Die Pointe einer Zeile erkennt sie nicht, und „höchstens eine Stelle“ erlaubt auch keine.

## Was ich gedreht habe, und warum

| Stellwert | vorher | jetzt | Grund |
|---|---|---|---|
| Dramaturg-Phasen je Tag | Aufbau 4, Konflikt 4, Ruhe 4 | **3 / 5 / 4** | Die Spannung erreichte ihr Phasenziel nicht innerhalb einer Phase. Eine höhere Dramaturg-Stärke (2,8 bzw. 3,4) half nicht. |
| Glättung α | 0,35 | **0,5** | wie oben, schneller folgen |
| Phasenziele | Konflikt 0,75, Ruhe 0,15 | **0,8 / 0,1** | Mit tr1 lag T13 im Raster bei 0,18. Mit schärferen Zielen 0,224; dabei bleiben Q, T14 und T8 im Ziel. |
| Roh-Abzug | 0,6 | **0,35** | Roh heißt jetzt: Lore wird erzählt, keine Regel vorgelesen (Lead). |
| MiB-Auslöser N | 3 | **2** (nur Vergleichslauf) | Wählerische Figuren übernehmen selten 3-mal dieselbe Karte an einem Tag. Mit N = 3 gab es fast keinen Einsatz. |
| Opener vor ganzen Sätzen | – | nur Satz-Opener (Pool-Feld `into_clause`/`clause_ok`) oder own_clause; Substantiv-Opener nur vor dem Titel im Rückfall („Did you hear of **The Maze**? You cannot leave.“) | Opener, die ein Substantiv verlangen, ergeben vor einem ganzen Satz Unsinn, z. B. „Let me tell you about The Happy Dagger is happy …“ (S8). Regel mit Deck-Songs abgestimmt (Pool @a428e091). |
| Rückfall-Lore | wörtlich | **bereinigt** wie SSOT `lore_fallback.py` (R1.2): Klammern, Etiketten mit Doppelpunkt und Stat-Angaben fallen weg, übrige Doppelpunkte werden zu Punkten; nur weglassen | Georg 24.10. |

## Kennzahlen

Mittel über Seeds 1–10, in Klammern die Spanne.

| # | Kriterium (Ziel) | haupt | ohne Dramaturg | ohne-roh | mit MiB |
|---|---|---|---|---|---|
| T1 | Determinismus (s7 bytegleich) | ✔ | ✔ | ✔ | ✔ |
| T2 | Karten je Figur und Tag (0,5–2) | **0,53** ✔ (0,34–0,82) | 0,35 ✘ | 0,58 ✔ | 0,45 ✘ |
| T3 | Blasen Q (≥ 0,3) | **0,35** ✔ (0,23–0,46) | 0,33 ✔ | 0,34 ✔ | 0,33 ✔ |
| T4 | kein Spam (≤ 1 je Begegnung, 0 nach Ablehnung, ≤ 2 je Karte und Tag) | ✔ | ✔ | ✔ | ✔ |
| T5 | Blase ≤ 140 Zeichen | max 138 ✔ | ✔ | ✔ | ✔ |
| T6 | Kartentreue 100 % (Opener + Zeile bzw. Titel + Lore) | ✔ | ✔ | ✔ | ✔ |
| T7 | Herkunft vollständig | ✔ | ✔ | ✔ | ✔ |
| T8 | Muster: Call ohne Zufall gleich (≥ 0,7) | **0,80** ✔ | 0,79 ✔ | 0,79 ✔ | 0,80 ✔ |
| T9 | kein Call > 60 % | max 0,49 ✔ | max 0,56 ✔ | max 0,48 ✔ | max 0,48 ✔ |
| T10 | Kosten (≤ 200 µs, ≤ 64 KB) | 28 µs · 26 KB ✔ | ✔ | ✔ | ✔ |
| T12 | Konflikt über Blasengrenzen je Tag | 12,1 | 10,8 | 11,8 | 11,8 |
| T13 | Spannung Konflikt − Ruhe (≥ 0,2) | **0,201** ✔ (0,02–0,34) | 0,01 | 0,23 ✔ | 0,23 ✔ |
| T14 | BINGO-Anteil je Tag 8–10 (≤ 0,6) | **0,44** ✔ (bis 0,64) | 0,32 | 0,45 | 0,48 |
| T15 | Anteil des eigenen Decks am Wissen, Mittel / niedrigste Figur | 0,61 / 0,34 | 0,69 / 0,40 | 0,59 / 0,33 | 0,65 / 0,37 |
| – | MiB-Einsätze je 10 Tage | – | – | – | 7,5 (1–13) |
| T11 | Georgs Urteil beim Lesen | offen | | | |

## Was man sieht

- **Das BINGO-Ende ist weg.** An Tag 8–10 zündet im Mittel weniger als die Hälfte (0,44). Blödsinn! und BOGGLE bleiben bis zum Schluss im Mix. In einzelnen Seeds steigt ein Tag bis 0,64.
- **Blasen und Konflikt zugleich:**
  - Q 0,35 bei einer klaren Spannungskurve (T13 0,201).
  - Konflikt über Blasengrenzen: 12,1 je Tag.
  - Ohne Dramaturg ist die Kurve flach (0,01), und es wandern weniger Karten (T2 0,35).
- **Identität:** Nach 10 Tagen stammen im Mittel 61 % des Wissens aus dem eigenen Deck. Die offenste Figur liegt bei 34 %. Wer viel fremdes Wissen hat, wird spürbar abwehrender (Faktoren „satt“ und „Identität“ im Protokoll).
- **Roh ist selten:** 530 der 561 Karten der 11 Decks haben eine tr1-Zeile. Im Hauptlauf sind 3 von 174 Erzählungen roh, BONGO fällt praktisch weg. „ohne-roh“ unterscheidet sich deshalb kaum.
- **MiB:** Opfer verlieren die Karte. Rebellische Umstehende merken sie sich erst recht und erzählen sie lieber, angepasste verstummen. MiB senkt das Tempo (T2 0,45).

## Für Deck-Songs bzw. WS0

- **Opener-Pool zu klein für tr1:** Von 27 POOL-Einträgen passen vor ganzen Sätzen nur 11.
  - Dazu gehören die 5 Satz-Opener, own_clause (Punkt, bei Szenenwechsel Komma) und Einwürfe.
  - Ausgeschlossen sind die übrigen into_title-Opener, die ein Substantiv verlangen, und die Kartenpassungs-Opener (Kartenart fehlt).
  - Folge im Protokoll: Jeder Opener kommt etwa einmal am Tag vor, jeden Tag dieselben.
  - Der größere Pool von WS0 (Status §26) sollte Satz-Opener bzw. eigene Kurzsätze enthalten.
- **Kein Erwiderungs-Opener im POOL:** Debatten laufen deshalb ohne Uptake-Opener.
- Die tr1-Zeilen passen zu 100 % zu ihren Karten (Titel im Satz, Prüfung `lineFits`).

## SIM-Aufstellung (keine Kanon-Zuordnung)

- Figuren: die 11 Figuren, die heute im Spiel stehen.
- Decks aus der Signatur-Liste (Georg 20.10.). Per Seed aus den übrigen tr1-Decks vergeben: Bots, orc_legacy_a/b und orc_brute (dessen Deck hat 0 Karten).
- Art, Haltung und Starter-Set (6 Karten, ohne gesperrte) per Seed.
