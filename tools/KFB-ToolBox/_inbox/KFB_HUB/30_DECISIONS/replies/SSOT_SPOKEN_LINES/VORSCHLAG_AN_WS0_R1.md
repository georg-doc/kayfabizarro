# Vorschlag an WS0 · Ergänzungen zu TRIPLET_SSOT_R1 (V-698) · R1.2 · 24.10.2026

> **Status: VORSCHLAG, nicht verbindlich.** Maßgeblich ist `replies/TRIPLET_SSOT_R1.md` (WS0, V-698, mit V-699/V-700) bzw. `SUNO_SSOT_R1.md` (V-689). Dieses Dokument sammelt, was Georg 21.–24.10. im Song-Workshop entschieden bzw. korrigiert hat und **im TRIPLET_SSOT noch fehlt** (Liste in §0). WS0 übernimmt es dort oder verwirft es; dieses Dokument kopiert keine bereits dort stehende Regel neu als Quelle.

## 0 · Was im TRIPLET_SSOT_R1 noch fehlt (Kurzliste für WS0)
1. **Rückfall ohne Triplet = Titel + bereinigte gedruckte Lore, Power nie** (Georg 23.10. „b“, 24.10. via WS1). TRIPLET_SSOT §2 sagt noch „Kartentext roh“. → §5, §5b, §5c unten; Code `lore_fallback.py`.
2. **Lore-Bereinigung:** Klammern, Doppelpunkt-Etiketten (Titel/Versalien), „Power: N“ weg (Georg 24.10. Ja). → §5c.
3. **Bühnen-Dialog A/B:** A = POOL-Opener + Triplet bzw. Titel; B = Ruf/Erwiderung + Nachlegen bzw. bereinigte Lore. → §5b.
4. **Opener bettet ein:** Opener + Kartenzeile = ein Satz; nie zwei lose Wörter, nie Ballast-Satz davor; Satzbau into_title / own_clause (mit Punkt/Komma, kein Doppelpunkt) / interjection; Haltungen. → S8, §4; Daten `OPENER_POOL_BY_STANCE_R1.json`.
5. **Sperrliste für heikle Karten** (nie sprechen, auch nicht roh). → S12; Daten `*.tr1.blocked.json`.
6. **„and then“ = FAIL** in Kartenzeilen (KayfabeTip 1). → Lint.
7. **Nur Hörerwissen, absurd statt Klischee** (S10/S11) und **Song-Form t4** (Best-of, eingebettete Opener, Uptake-Kette, keine erzwungene Storyline; Georg 23.10. „passt, Tune später“).
8. **Prüfskript-Lücken:** Fragewörter (why/how) und ausgeschriebene Zahlen als Grammatik; Titelprüfung ohne Level-/Mode-Präfixe, Untertitel, Klammern, Ziffern, Initialen.

---

**Was das ist:** die eine Quelle für alles, was in KayfaBizarro Karten spricht:
- Deck-Songs (Suno);
- Triplet-Sets;
- Chatterbox;
- Karten-Tratsch zwischen Figuren (WS-NPC);
- Narrator und Ride-Narrator (WS1).

**Warum:** Georg hat dieselben Fehler „zigmal“ korrigieren müssen, in WS0, WSA, WS1 und im Song-Workshop. Ab jetzt gilt **nur dieses Modul**. Specs, Briefs und Prompts verweisen hierher und kopieren keine Regeln.
**Bestandteile:**

| Datei | Inhalt |
|---|---|
| `README.md` | Regeln, Formate, Beispiele, Lessons (dieses Dokument) |
| `rules.json` | dieselben Regeln maschinenlesbar (ID, Stufe, Prüfung, Quelle) |
| `TR1_INDEX.json`, `tr1_cards/` | Tratsch-Triplets tr1: Index (Pfade, Rückfall-, Sperr- und Opener-Regeln zur Laufzeit) und Druck-Kartenquellen |
| `lore_fallback.py` | Lore-Bereinigung für den Rückfall (§5c) |
| `spoken_line_lint.py` | Prüfskript für alle automatisch prüfbaren Regeln (Hygiene, kein Qualitätsbeweis) |
| `../SONGS_WORKSHOP_R1/OPENER_POOL_BY_STANCE_R1.json` | Opener-Pool nach Haltung und Satzbau |
| `../BAUKASTEN_SPOKEN_LINES_SSOT_R1.md` | Herleitung des Fünf-Schichten-Modells (geht in diesem Modul auf) |
| `../SONGS_WORKSHOP_R1/POSTMORTEM_SONG_PILOTS_R1.md`, `POSTMORTEM_OPENER_TRIPLET_R2.md` | wie es zu den Regeln kam |

**Ändern:** nur über WS0 mit Georgs Okay. Jede Änderung bekommt eine neue Revision (R1.1 …) und einen Eintrag in §9.

---

## 1 · Fünf Schichten
| # | Schicht | Aufgabe |
|---|---|---|
| 1 | **Karte** | Wahrheit. **Das PDF führt immer** (Georg 23.10.); die JSONs werden nachgezogen. |
| 2 | **Triplet** | Die feste Zeile je Karte: die Aussage der Karte als Satz. |
| 3 | **Opener** | Bettet die Zeile in eine Sprechhandlung ein: Gerücht, Frage, Theorie, Begegnung, Beobachtung, Erwiderung. |
| 4 | **Verbindung** | Fluss zwischen Zeilen: Uptake des letzten Worts, deshalb/aber. Nur Song und Dialog. |
| 5 | **Rahmen** | Intro und Outro aus gedrucktem Deck-Material. Nur Song. |

## 2 · Harte Regeln (FAIL)
Kürzel: **L** = vom Lint geprüft, **G** = nur Georgs Ohr bzw. eine Zweitmeinung.

| ID | Regel | Prüfung |
|---|---|---|
| S1 | **Kein Doppelpunkt, nie „Titel: …“.** Der Titel steht im Satz, als Subjekt, Objekt oder Ort. Doppelpunkt-Etiketten klingen in Suno nicht. | L |
| S2 | **Ganze Sätze, kurz, prägnant, Comic-Stil, mit Flow.** Weglassungen sind erwünscht, Fragmente und Telegrammstil nicht („shuffle, redraw, minus one“, „victory moved back“). | L (Warnung) + G |
| S3 | **Keine Satzschablone.** Die Satzform kommt aus der Karte: Aussage, Befehl, Frage mit Antwort, Titel vorn, mitten oder hinten. Über ein Deck wechseln die Formen. | L (Deck-Statistik) + G |
| S4 | **Nicht vorlesen.** Die Zeile verkauft die Behauptung der Karte und endet auf ihrer Pointe. Lore nicht der Reihe nach abschreiben. | G (L warnt bei fast identischer Lore) |
| S5 | **Nur Kartenwörter plus Grammatik.** Keine neuen Verben, Bilder, Fakten oder Witze in der Kartenzeile; höchstens ein Fluff-o-lect-Wort. | L |
| S6 | **Regelmechanik nie als Regel** (damage, roll, turn, draw, discard, token …). Höchstens als Bild. Die Power wird im Tratsch-Rückfall nie gesprochen. | L (Warnung) + G |
| S7 | **Keine Klammern.** Ziffern und Symbole ausschreiben oder weglassen; „&“ wird „and“. | L |
| S8 | **Opener bettet ein.** Opener und Zeile bilden **einen** Satz („Rumor has it The Maze …“). Nie zwei lose Wörter davor („Badger unplugged:“), nie ein eigener Erzählsatz als Ballast davor. | G |
| S9 | **Kein Opener doppelt** pro Song, Dialog bzw. Tag; Familienabstand ≥ 10; Frage und Behauptung wechseln. | L (Opener-Spalte) / Laufzeit |
| S10 | **Nur was der Hörer kennt.** Keine Witze aus Asset-Wissen (Wechselköpfe, Texturen) und keine Bildbeschreibungen, die man ohne Bild nicht versteht. | G |
| S11 | **Absurd statt Klischee.** Kein Büro-, HR- oder Sitcom-Register; der Stoff kommt aus dem Deck. | G |
| S12 | **Tonfall bei heiklen Decks.** Karten, die sich nicht als Parodie sprechen lassen (antisemitische oder Blutlinien-Mythen, Gesundheits- und Impfbehauptungen, Great Replacement, Opfer von Anschlägen und Missbrauch, reale Personen mit Tatvorwurf), stehen in `<deck>.tr1.blocked.json` und werden **nie** gesprochen, auch nicht als Rückfall roh. 9/11: Satire auf Geld und Institutionen, keine „wer flog“-Hinweise. Verschwörungsdecks: nie eine Behauptung als Tatsache. Personennamen nur wie auf der Karte. Therapie: nie gegen Hilfesuchende. | G |
| S13 | **Gate-PASS bzw. Lint-0-FAIL ist kein Qualitätsbeweis** und wird nie als „fertig“ oder „gut“ gemeldet. | – |

## 3 · Richtwerte (WARN)
| ID | Richtwert |
|---|---|
| W1 | Zeilenlänge 50–100 Zeichen. Tratsch höchstens 110 (Blase ≤ 140 mit Opener), Song höchstens 120. |
| W2 | Höchstens 70 % der Zeilen eines Decks beginnen mit dem Titel. Kein Folgewort nach dem Titel in mehr als 25 % der Zeilen (z. B. „is a“). |
| W3 | Kein Semikolon; lieber zwei kurze Sätze. |
| W4 | Kartentext-Anteil: Triplet-Set ≥ 90 %, Song ≈ 70–80 % (Opener kosten Wörter). |

## 4 · Opener (Schicht 3)
- **Pool:** `OPENER_POOL_BY_STANCE_R1.json`. Freigegeben ist nur Status **POOL**; alles andere sind Kandidaten bis zur Freigabe durch Georg bzw. WS0. Den großen Pool aus Georgs NotebookLM und den Docs stellt WS0 zusammen (Status §26).
- **Haltungen:** Gerücht, Begegnung, Fundstück, Anekdote, Frage, Theorie, Behauptung, Beobachtung, Erwiderung, Ansprache, Rückruf, Zweifel/Wende, Steigerung, Meta, Szenenwechsel.
- **Satzbau:**
  - `into_title` läuft direkt in den Titel: „Did you hear about …“, „I once met …“, „Rumor has it …“.
  - `own_clause` ist ein eigener Kurzsatz **mit Punkt oder Komma, nicht mit Doppelpunkt** (S1): „My diary says it. …“, „Overheard at the bakery, …“.
  - `interjection` ist ein Einwurf mit Komma; sparsam.
- **Kartenpassung:** „I once met“ nur vor Figuren, „Ever tasted“ nur vor Essbarem, „I found a“ nur vor Objekten.
- **Erwiderung** (Uptake: „You said …“, „You call that …“) nur als Antwort, also in Debatte, Kette oder Song-Uptake.

## 5 · Formate
| | Tratsch / Chatterbox | Triplet-Set | Deck-Song |
|---|---|---|---|
| Karten | einzeln je Beat | alle Karten des Decks | **Best-of** (≈ 40–45 bei 56 Karten), nie die ersten N |
| Triplet | fest je Karte | fest je Karte | fest je Karte, für den Song eingebettet |
| Opener | **zur Laufzeit** aus dem POOL, rotierend | optional | **jede Karte** eingebettet |
| Verbindung | Dialog-Uptake, BINGO/BOGGLE/Blödsinn | – | Uptake-Kette, keine erzwungene Storyline |
| BOGGLE-Nachlegen | der Teil der Karte, den das Triplet **nicht** enthält; nie denselben Text zweimal | – | – |
| **Rückfall ohne abgenommenes Triplet** | **Titel + gedruckte Lore wörtlich, mit POOL-Opener; Power nie;** im Protokoll „roh“ (Georg 23.10., b) | – | – |
| Rahmen | – | Intro und Outro gedruckt | Intro = Decktitel + These; Outro gedruckt oder Callback; „Stay Fluffy, Folks!“ |
| Länge | Blase ≤ 140 Zeichen | < 5000 Zeichen | < 5000 Zeichen |

## 5b · Bühnen-Dialog mit zwei Sprechern A/B (Spiel; Georg 24.10.)
Die Power wird **nie** gesprochen. Eine Blase enthält genau einen Satz bzw. Sprechakt (≤ 140 Zeichen).

| Fall | A (Erzähler/Tratschmaul) | B (Gegenüber) |
|---|---|---|
| **Karte mit tr1-Triplet** | POOL-Opener + Triplet als **ein** Satz („Rumor has it The Maze …“) | Reaktion: Social Call (BINGO/BOGGLE/Blödsinn!), optional mit Erwiderungs-Opener. **Bei BOGGLE legt B nach:** den Teil der Karte, den das Triplet nicht enthält (bereinigte Lore, §5c). Nie denselben Text wie A. Wenn das Triplet die Lore schon ganz enthält, kein Nachlegen, nur der Call. |
| **Karte ohne tr1 (Rückfall b)** | POOL-Opener + **Titel** als ein Satz, meist als Frage oder Gerücht: „Did you hear about The Heel Promoter?“ · „I once met The Heel Promoter.“ | **Bereinigte gedruckte Lore wörtlich** (§5c): „He thinks the roster is disposable. He's wrong.“ |
| **Karte in `blocked.json`** | wird nicht gezogen | – |

**Opener im Dialog:**
- **A:** Status POOL. Haltung Gerücht, Frage, Begegnung, Theorie, Beobachtung oder Behauptung. Satzbau `into_title`, d. h. der Opener läuft direkt in den Titel, oder `own_clause` mit Punkt oder Komma.
- **B:** nur **Erwiderung** (Uptake: „You said …“, „You call that …“, „That is not …“), oder gar kein Opener. Nie ein Opener, der einen Titel braucht.
- Kein Opener zweimal pro Szene bzw. Spieltag. Frage und Behauptung bei A abwechseln. Kartenpassung beachten („I once met“ nur vor Figuren).
- Rollen nie tauschen: A nennt die Karte, B kommentiert sie bzw. legt nach.

## 5c · Lore-Bereinigung für den Rückfall (Georg 24.10.)
Referenzfunktion: `lore_fallback.py → clean_lore(title, lore)`. Entfernt werden:
1. Klammerzusätze („(the commodity)“, „[R:1]“);
2. führende Etiketten mit Doppelpunkt, also der Titel selbst („THE HEEL PROMOTER: …“) oder ein Versalien-Label („PAPER BULLETS: …“);
3. Stat- und Power-Angaben („Power: 100“);
4. restliche Doppelpunkte, die zu Punkten werden (S1).

Beispiel (1001 Kayfabe Nights):
„THE HEEL PROMOTER: He thinks the roster is disposable. He's wrong. Power: 100.“ → „He thinks the roster is disposable. He's wrong.“

Ziffern bleiben in der Textblase wörtlich; Audio bzw. TTS schreibt sie aus (S7).

## 6 · Beispiele
**Gut (Georg 24.10., Mission Control):**
- Find an exit to The Maze? Spoilers, there is no outside.
- At the Broken Bridge you cannot pass until the developers finish coding the next zone.
- In Kill Enemies to Open you are the janitor of death.
- Escape Sequence runs you away from danger until you reach safety, and safety is a cutscene.

**Gut (Song, BBBW t4, eingebettet, Georg „passt, Tune später“):**
- Ever notice how The Babyface uses high-flying moves because audiences cheer for that? A slave to approval.
- Rumor has it The Jobber exists to make the other guy look good.

**FAIL, alles schon passiert:**

| Zeile | Regel |
|---|---|
| Escape Sequence: run away from danger … | S1 Etikett |
| The Maze, cognitive loop: shuffle, redraw, minus one. | S1, S2 Telegramm |
| Level Goal is a goalpost shift: you …, and … (dieselbe Form in jeder Zeile) | S3 Schablone |
| Mass Monster-Slaughter, the grindset: repetitive labor is fun when it's violent! | S1, S4 vorgelesen |
| Badger unplugged: The … / Sister yawns: The … | S8 lose Wörter |
| So I stay in bed all day: The Lazy Genius, … | S8 Ballast, S1 |
| First day at work … HR sent in … | S11 Klischee |
| … one real scar painted on all four heads. | S10 Asset-Wissen |
| The Bachelor: PAPER BULLETS: Deal damage based on the number of words … | S1, S6, S7 |

## 7 · Ablauf (für jede Sitzung, die Kartenzeilen schreibt)
1. Dieses README lesen. Bei Songs zusätzlich Onboarding und Post-Mortems.
2. Deck verstehen: These, worüber sich die Karten lustig machen, Kartenlogik. Kartentext aus dem **PDF**.
3. **Erst eine Probe** von 8–10 Zeilen an Georg, erst dann skalieren. Breite vor Abnahme ist ein bekannter Fehler.
4. Schreiben, dann `spoken_line_lint.py` (0 FAIL Pflicht, Schablonen-WARN muss weg), dann jede Zeile laut lesen, einmal mit Opener davor.
5. Abgabe ohne Qualitätsbehauptung (S13). Georgs Ohr entscheidet.

## 8 · Lessons learned (Kurzfassung)
1. Regeln einzeln zu optimieren erzeugt Pendeln zwischen Extremen (vorgelesen ↔ Nebenhandlung). Deshalb das Schichtenmodell.
2. Kritik wird nach ihrer Absicht umgesetzt, nicht nach dem Wortlaut. „Keine zwei Wörter davor“ hieß nie „keine Opener“.
3. Eine neue Schablone ersetzt eine alte Schablone (Etikett → „X is a Y: you …“). Die Form kommt aus der Karte.
4. Was Suno nicht trägt, trägt auch im Spiel nicht: Doppelpunkte, Fragmente, Labels.
5. Daten: Das PDF führt; Registry und JSON können abweichen (Nummern, Wortlaut, ganze Karten).
6. Messwerte (Lint, Gate, Quote) sind Hygiene. Qualität misst nur das Ohr.

## 9 · Änderungsverlauf
- **R1.2 (24.10.2026):** §5b Bühnen-Dialog A/B, §5c Lore-Bereinigung (`lore_fallback.py`), Georg via WS1-Lead (WS0-Status §157).
- **R1.1 (24.10.2026):** Lint: Ziffern und Initialen im Titel nicht verlangt, ausgeschriebene Zahlen erlaubt, „and then“ = FAIL. S12: gesperrte Karten (`blocked.json`) nie sprechen. `TR1_INDEX.json` für Tratsch-Laufzeit, Kartenquellen unter `tr1_cards/`.
- **R1 (24.10.2026):** Modul angelegt aus Baukasten R1.2, Post-Mortems R1/R2 und Georgs Korrekturen vom 21.–24.10. (Doppelpunkt, Fragmente, Schablone, Rückfall b, PDF führt).
