# Opener-Dramaturgie · Modell R1 (16.10.2026)

**Status:** Vorschlag WS0 zu V-325 (Georg 16.10.). Ersetzt in `TRIPLET_SET_SPEC_R2.md` nur den Satz „so viele Zeilen mit Opener … gleichmäßig verteilt“. Alles andere aus R2 gilt weiter: Kartenzeilen nur aus Kartenwörtern, Opener als eigene Schicht, jeder Opener höchstens einmal pro Track, Familienabstand ≥ 10, Track < 5000 Zeichen.
**Probe:** Epistemic Sabotage, `epistemic_sabotage.arc1.*` (nur freigegebener Pool, exakter Checker 0 FAIL) und `epistemic_sabotage.arc1-anek.*` (dieselbe Fassung mit 4 Anekdoten-Openern, wartet auf Pool-Freigabe).
**Quellen:** Georgs Opener-Recherche R3 (Branch `research/kfb-triplet-opener-diversity-r1-2026-10-15` @0362e46e7: 64 Kandidaten, 18er-Shortlist), `OPENER_RESEARCH_INVENTORY_R1.md` (BG-1..8), `META_NARRATIVE_R1.md`, Global Intent R1–R1.8, FrizzleBob-Stimmpalette, V-327.

## 0 · Kurzfassung
1. **Wer spricht:** Uncle FrizzleBob als unzuverlässiger Chronist und Marktschreier. Er spricht den Spieler an, der die Karte in der Hand hat. Der Opener zeigt sein Verhältnis zur Karte (woher er davon weiß, wie er sie vorführt). Die Karte erklärt er nie.
2. **Bogen:** Hook 6–8 %, Setup 15–20 %, Komplikation 10–15 %, Wende 5–8 %, Steigerung 25–35 %, Krise 7–10 %, Höhepunkt 12–15 %, Auflösung 6–8 %, dann „Stay Fluffy!“. Die Abschnitte werden auf die Seiten bzw. Themen des Decks gelegt, denn die Kartenreihenfolge ist fest.
3. **Neun Funktionsklassen:** Ansprache, Frage/Wiedererkennen, Rahmung/Anekdote, Rückruf, Zweifel/Wende, Prämisse/Ironie, Steigerung, Meta, Entlastung/Überleitung. Eine Matrix legt fest, welche Klasse in welchen Abschnitt gehört.
4. **Dichte folgt dem Bogen:** dünn im Setup (10–25 %), dicht in Krise und Höhepunkt (50–100 %). Vor der Krise oder Wende steht genau eine bewusste Stille von 5–8 Zeilen; sie ist die längste Lücke im Track.
5. **Mittel:** ein Anekdoten-Faden über den Track (3–5 Stationen von der Pflanzung bis zur Einlösung), ein Rückruf, bei dem sich der Erzähler falsch erinnern darf (V-327), Ironie-Kontakt (Opener widerspricht der Karte), Buchstützen am Anfang und am Ende.
6. **Regeln:** Opener nach Funktion statt nach Zeilenplan. Jeder Opener muss zur Karte passen. Familienabstand ≥ 10 bleibt als Untergrenze. Mit keinem anderen Track mehr als 3 gleiche Paare aus Zeile und Opener. Kartenzeilen bleiben bytegleich, außer Satzzeichen.
7. **Katalog:** die 27 Pool-Opener, Georgs 5 Anekdoten-Formen, die 18er-Shortlist der Recherche und eine Auswahl aus der zweiten Runde, jeweils mit Klasse, Risiko und Beispiel. „A politician once said“ steht auf HOLD.
8. **Aus der Recherche:** Den Scheduler (Opener auf jede dritte Zeile nach Punktzahl) übernehmen wir nicht. Übernommen werden die Kandidaten und die Beat-Grammatiken BG-1..8, und zwar als Zeilentypen.

## 1 · Befund (warum V-325)
- Acht Decks aus Batch 8 (cosmic_grift, epistemic_sabotage, monopolies, nibelungen, observation_underground, pharaoh_piledriver, trust_and_betrayal, tragic_flaws), in allen Versionen v1 bis v3, haben **denselben Plan**: Zeile 3 „Remember“, 6 „You know“, 9 „What if“, 12 „Anyway“, 15 „No wait“, 18 „Before we continue“ … alle drei Zeilen, immer gleiche Reihenfolge. Gemessen über alle `takes.csv` in `TRIPLET_SETS_R2/`.
- Die Folgen sind hörbar. Bei Epistemic Sabotage v2 kommt „Remember“ in Zeile 3, obwohl es noch nichts zu erinnern gibt. „No wait“ korrigiert in Zeile 15 nichts. „Not a metaphor“ steht vor dem Staring Lemur, und genau dort ist es eine Metapher.
- Die Goldens (Monomyth Mayhem, Philosophy, Help I Am a Human, Wrinkle Rumble) sind von Hand gesetzt, ihre Lücken sind unregelmäßig. Aber auch sie folgen keinem Bogen; die Opener stehen dort, wo sie zur Karte passen.

## 2 · Erzählhaltung
- **Sprecher:** Uncle FrizzleBob, Deck-MC im Carny-Register. Er hält jede Karte hoch wie ein Marktschreier und ist zugleich Chronist mit wackligen Quellen: Hörensagen, ein Buch, ein Lügner, den er „once met“, ein Tagebuch, in das jemand anderes geschrieben hat. Die Unzuverlässigkeit steckt in den Openern. Die Kartenzeilen bleiben die gedruckte Wahrheit des Decks.
- **Adressat:** der Spieler am Tisch, „You with the card in your hand“. Bei Workshop-Decks wie Epistemic Sabotage sind das die Comic-Leute mit dem Deck vor sich. Wir sprechen nie zu einem anonymen Publikum.
- **Rollenbewusst (Global Intent R1):** FrizzleBob weiß, dass er ein Deck aufführt; dafür gibt es die Meta-Klasse („The deck insists on“). Er erklärt das aber nicht und macht keine KI-Meta-Witze.
- **Closure beim Hörer (R1.5, R1.8):** Der Opener verbindet nicht und zieht keine Moral. Was zwischen Opener und Karte fehlt, ergänzt der Hörer.
- **V-327:** Unvollkommenheit ist Charme. Der Erzähler darf sich falsch erinnern („Remember“ vor einer Karte, die so noch nie vorkam), und ein Faden muss sich nicht auflösen.
- **Bühnenfiktion, kein Beleg:** Buch, Freund, Tagebuch und Zettel sind erfundene Rahmen des Erzählers. Kein Opener gibt sich als echtes Zitat, als echte Quelle oder als Kartenfakt aus (Recherche R3, Firewall Punkt 2–3).
- **Georg ist nicht die Stimme dieses Tracks.** Georg bleibt der Chronist im Loriot-Ton der Begleittexte; die beiden werden nicht vermischt.

## 3 · Bogen-Schablone für einen Track (50–60 Kartenzeilen)

| Abschnitt | Anteil | bei 50 / 56 / 60 Karten | Opener-Dichte | Aufgabe |
|---|---|---|---|---|
| Intro (1 Zeile) | fest | 1 | kein Opener | Hook-Frage oder Slogan aus gedrucktem Material |
| Hook | 6–8 % | 3–4 / 4 / 4–5 | 40–60 % | klärt, wer spricht und zu wem; erster Ironie-Kontakt |
| Setup | 15–20 % | 8–10 / 9–11 / 9–12 | 10–25 % | Welt und Werkzeuge; Anekdoten-Faden wird gepflanzt |
| Komplikation | 10–15 % | 5–7 / 6–8 / 6–9 | 30–40 % | erstes Problem; Erzähler wird unzuverlässig |
| Wende (Midpoint) | 5–8 % | 3–4 / 3–4 / 3–5 | 25–50 %, mind. 1 Wende-Marker | die Frage des Tracks dreht sich |
| Steigerung | 25–35 % | 13–17 / 14–19 / 15–21 | 25–35 %, steigend, gerechnet ohne die Stille | Druck nimmt zu; endet in der bewussten Stille |
| Krise | 7–10 % | 4–5 / 4–6 / 4–6 | 60–100 % | dunkelster Punkt; Geständnis, „not a metaphor“ |
| Höhepunkt | 12–15 % | 6–7 / 7–8 / 7–9 | 40–60 % | Einlösung: Rückruf, Faden-Ende, Meta |
| Auflösung | 6–8 % | 3–4 / 3–4 / 4–5 | 20–35 % | Entlastung, Ausatmen |
| Outro | fest | 1 | kein Opener | „Stay Fluffy!“ |

**Anpassen an das Deck:**
1. Erst die Seiten bzw. Themenblöcke des Decks lesen (`notes` im Deck-JSON, gedruckte Seitentitel). Jeder Abschnitt beginnt an einer Seitengrenze, wenn eine in der Nähe liegt.
2. Die Karte der **Wende** suchen (wo die Frage des Decks kippt), dann die **Krise** (dunkelste Karte bzw. Seite) und den **Höhepunkt** (Antwort oder Gegenschlag des Decks).
3. Abschnitte dürfen um ±50 % gedehnt werden, wenn das Deck es verlangt, z. B. eine lange Steigerung bei fünf Prompt-Seiten. Die Reihenfolge der Abschnitte bleibt.
4. Gesamtzahl der Opener: etwa ein Drittel der Kartenzeilen bleibt als grobe Budget-Größe (R2), aber **ungleich verteilt**.

## 4 · Opener-Funktionsklassen

| Klasse | Erzählfunktion | Pool (freigegeben) | Kandidaten (nicht freigegeben) |
|---|---|---|---|
| **A · Ansprache** | holt den Spieler an den Tisch, macht ihn zum Handelnden | You with the card in your hand · You played · Did you ever try · Welcome to | From the back row: |
| **Q · Frage / Wiedererkennen** | setzt geteiltes Wissen voraus („kennst du doch“) | You know · Do you know · Have you heard of · Did you hear of · You know the thing with · Ever tasted (nur Essbares) | I heard a rumor about |
| **F · Rahmung / Anekdote** | sagt, woher der Erzähler die Karte kennt; trägt den Faden | Let me tell you about · I once met (nur Figuren) | A friend told me about · I read a book about · I found a note saying: · My diary says: · Someone wrote in my diary: · I saw a film about · I saw a painting of · On the back of a napkin: · An unsigned letter said: · My aunt used to say: · In my old sketchbook: |
| **R · Rückruf** | holt Früheres zurück; darf sich irren | Remember | I think I remember |
| **D · Zweifel / Wende** | Erzähler korrigiert oder gesteht | No wait · I used to believe | But the margin reads: · Hold that thought: |
| **P · Prämisse / Ironie** | stellt eine Behauptung neben die Karte; oft Widerspruch | Everyone agrees · The thing about · What if | – |
| **E · Steigerung** | erhöht den Druck, kündigt Härte an | Nobody warned us about · This one has a rule · Here is something nobody asked for | – |
| **M · Meta** | Deck bzw. Bühne wird sichtbar, ohne Erklärung | The deck insists on · Not a metaphor | Backstage someone muttered: |
| **X · Entlastung / Überleitung** | Pause, Szenenwechsel, Ausatmen | Anyway · Which brings us to · Meanwhile elsewhere · Before we continue | – |

## 5 · Zuordnung Klassen → Bogenabschnitte
● = Hauptklasse, ○ = möglich, – = vermeiden

| Abschnitt | A | Q | F | R | D | P | E | M | X |
|---|---|---|---|---|---|---|---|---|---|
| Hook | ● | ○ | – | – | – | ● | – | ○ | – |
| Setup | ○ | ● | ● (Pflanzung) | – | – | ○ | – | – | ○ |
| Komplikation | – | ○ | ● | – | ● | ○ | ● | – | – |
| Wende | – | – | ○ | – | ● | ● | – | – | ● |
| Steigerung | ● | ● | ○ | – | ○ | ○ | ● | ○ | ○ (vor der Stille) |
| Krise | – | ○ | – | – | ● | – | ● | ● | – |
| Höhepunkt | ○ | – | ● (Einlösung) | ● | – | ● | ○ | ● | – |
| Auflösung | ○ | – | ○ | ○ | – | – | – | – | ● |

Warum so: Rückruf ist erst sinnvoll, wenn es etwas zu erinnern gibt, also nie im Hook. Entlastung („Anyway“) mitten in der Krise nimmt der Krise die Luft. Steigerung im Setup verpufft, weil noch nichts auf dem Spiel steht.

**Beat-Grammatiken der Recherche als Zeilentypen:**
- BG-1 Opener → Quelle → Folge: die Normalzeile.
- BG-2 Frage → Antwort aus der Quelle: Klasse Q.
- BG-3 Prämisse → unerwartetes, belegtes Ergebnis: Klasse P.
- BG-4 Detail → Widerspruch: Ironie-Kontakt.
- BG-5 Zuruf → Umdeutung: Klasse A.
- BG-6 Situation → veränderte Lage: Wende.
- BG-7 Show → Spin → Sell: Carny-Hook.
- BG-8 Behauptung → Stille → veränderte Bedeutung: die bewusste Stille.

## 6 · Wiederkehrende Mittel
1. **Anekdoten-Faden.** 3–5 Rahmungs-Opener über den Track verteilt, die zusammen eine kleine Geschichte des Erzählers erzählen. Pflanzung im Setup, Echo in der Komplikation, Einlösung im Höhepunkt. Bewährtes Muster für Epistemic Sabotage ist der **Quellenverfall**: Hörensagen („A friend told me about“) → Begegnung mit dem Lügner („I once met“) → Buch („I read a book about“) → Tagebuch, in das jemand anderes geschrieben hat → gefundener Zettel, der die Karte selbst ist. Der Faden muss sich nicht auflösen (V-327). Die Einlösung liegt darin, dass der Hörer das Muster bemerkt.
2. **Rückruf.** „Remember“ steht vor einer Karte, die eine frühere spiegelt, oft die im Intro gestellte Frage. Der Erzähler darf sich dabei irren: Er nennt die Zwillingskarte statt der, die wirklich kam. Der Hörer erkennt das Echo am Kartentext.
3. **Bewusste Stille.** Einmal pro Track 5–8 Zeilen ohne Opener, direkt vor der Krise oder der Wende. Die Stille ist die längste Lücke im Track; keine andere Lücke ist länger als 5 Zeilen. Der Opener davor darf die Stille ankündigen („Before we continue“). Am stärksten wirkt sie, wenn eine Karte in der Stille sie begründet.
4. **Ironie-Kontakt.** Ein Opener behauptet das Gegenteil dessen, was die Karte zeigt („Everyone agrees“ vor dem falschen Freund-oder-Feind-Duell). Höchstens zweimal pro Track, sonst wird es ein Tick.
5. **Buchstützen.** Die erste Kartenzeile mit Ansprache, die letzte ohne Opener (oder umgekehrt). Viele Decks haben eigene FrizzleBob-Karten am Anfang und am Ende; dort trägt die Karte die Klammer selbst.
6. **Ernste Karten.** Vor Krieg, Tod und Ausbeutung nur D oder M, ohne Witz. „Not a metaphor“ gehört dorthin, wo die Karte wörtlich gemeint ist.

## 7 · Regeln
- **R1 · Funktion vor Position.** Jeder Opener hat in der `arc-map` eine Begründung (Abschnitt, Funktion, Kartenpassung). Es gibt keinen Zeilenplan. Prüfbar: Die Lücken zwischen Openern haben mindestens vier verschiedene Längen, und kein Schritt größer als 1 wiederholt sich mehr als dreimal hintereinander. Aufeinanderfolgende Zeilen mit Opener (Schritt 1) sind Dichte, kein Plan. (arc1: Lücken 1, 2, 3, 4, 5, 8; der Schritt 4 kommt höchstens dreimal hintereinander.)
- **R2 · Kein geteiltes Muster.** Ein Track teilt mit keinem anderen Track mehr als **3 Paare aus Zeile und Opener**. Die ersten fünf Opener in ihrer Reihenfolge stimmen mit keinem anderen Track überein. (Messung für arc1: höchstens 1 gleiches Paar mit irgendeinem Track in `TRIPLET_SETS_R2/`; null mit Epistemic v1/v2.)
- **R3 · Kartenpassung.** Grammatik und Inhalt müssen mit der vollen Kartenzeile funktionieren, nicht nur mit dem Titel. Bestehende Sperren gelten: „I once met“ nur vor Personen bzw. Figuren (Tierfiguren eines Decks zählen als Figuren), „Ever tasted“ nur vor Essbarem, „You played“ nur vor spielbaren Karten. Neue Rahmungen nur für die Kartenklassen aus der Recherche (`cardClassAllowed`, siehe §8), z. B. „I found a note saying:“ vor Objekt- oder Textkarten.
- **R4 · Familienabstand ≥ 10** bleibt als Untergrenze (V-280). Neue Familien schlagen wir mit dem Katalog vor: told, read, diary, found, film/art, memory.
- **R5 · Dichte folgt dem Bogen** (§3). Setup dünn, Krise und Höhepunkt dicht, genau eine Stille, die die längste Lücke ist. „Gleichmäßig verteilt“ (R2) entfällt.
- **R6 · Kartenzeilen bytegleich.** Geändert wird nur ein Satzzeichen, wenn ein Opener dazukommt oder wegfällt (Frage-Opener braucht „?“, ohne ihn wird daraus „.“). Jede Änderung steht in der `arc-map`.
- **R7 · Budget:** Track < 5000 Zeichen einschließlich Intro und Outro. Lange Opener (> 25 Zeichen) höchstens dreimal pro Track.
- **R8 · Kein Erklären, keine Moral.** Opener sind Bühnenfiktion des Erzählers, nie Beleg oder echtes Zitat.
- **R9 · Jeder Opener höchstens einmal pro Track** (R2, unverändert).
- **R10 · Hochrisiko.** Rahmungen mit Amts- oder Zeugenstimme (Politiker, Pressemitteilung, Dokumentarfilm, Zeuge) bleiben auf HOLD. Sie stehen nie vor Karten zu realen Konflikten, Personen oder Vorwürfen.

## 8 · Erweiterter Opener-Katalog
Status: **POOL** = im Checker freigegeben. **GEORG** = Georgs Wunsch vom 16.10., braucht Freigabe (V-Nummer). **SL** = Shortlist R3, nicht freigegeben. **R2** = zweite Runde R3, nicht freigegeben. **HOLD** = nicht verwenden.
Die Beispiele sind echte Kartenzeilen aus Epistemic Sabotage v2 bzw. arc1; Beispiele mit GEORG/SL/R2 sind **unfreigegebene Hörproben**.

### 8.1 Georgs Anekdoten-Formen (neu)
| Opener (Literal) | Klasse | Status | Kartenpassung | Risiko | Beispiel |
|---|---|---|---|---|---|
| A friend told me about · Variante „A friend told me recently:“ | F | GEORG (= SL OPR3_017) | Person, Idee, Ereignis, Objekt, System | niedrig; Hörensagen, kein Zitat | A friend told me about The Boombox Bat, Silent panels into multi-layered audio play; story escapes page. |
| I read a book about · Variante „I read in a book:“ | F | GEORG (= SL OPR3_001) | Idee, Person, Ereignis, Objekt, Institution | niedrig; nie ein echtes Buch nennen | I read a book about The Monolithic Data-Whale, tool shifts power to you or away from you. |
| I found a note saying: | F | GEORG (= SL NEW_019) | Objekt, Text, Idee, Ereignis; am besten vor einer Karte, die selbst ein Zettel ist | niedrig | I found a note saying: The Elephant's Post-it, 200 pages so they remember one panel forever. |
| Someone wrote in my diary: | F/D | GEORG (= R2 OPR3_029) | Idee, Ereignis, Person, Szene | niedrig; trägt Zweifel am eigenen Gedächtnis | Someone wrote in my diary: The Silver-Haired Time-Fox, time, only critic that cannot be argued with. |
| My diary says: | F | GEORG/SL OPR3_028 | wie oben | niedrig; Familie „diary“ mit der Zeile darüber | My diary says: The Facepalming Ostrich, growth measured by severity of future embarrassment. |
| A politician once said: | – | **HOLD** (Recherche: HIGH, OPR3_042) | keine sichere Klasse | hoch: wirkt wie ein echtes Zitat und Beleg für Satire-Vorwürfe | – nicht in der Probe. Bei Epistemic Sabotage wäre ein erfundenes Politikerzitat genau die Lüge, vor der der Lying Fox-Bot warnt. |

### 8.2 Weitere Recherche-Kandidaten
| Opener | Klasse | Status | Kartenpassung | Risiko / Hinweis |
|---|---|---|---|---|
| I saw a film about | F | SL OPR3_007 | Person, Ereignis, Ort, Objekt, Szene | niedrig |
| I saw a painting of | F | SL OPR3_012 | Person, Objekt, Ort, Szene | niedrig; stark in Comic- und Kunstdecks |
| I heard a rumor about | Q/F | SL OPR3_023 | Person, Ereignis, Idee, System, Institution | niedrig; Familie „told“ |
| A note under my door: | F | SL OPR3_034 | Person, Ereignis, Idee, Objekt, Text | niedrig; Familie „found“ |
| On the back of a napkin: | F | SL OPR3_036 | wie oben | niedrig; Familie „found“ |
| I think I remember | R | SL OPR3_045 | Person, Objekt, Ereignis, Idee, Ort | niedrig; ideal für Fehlerinnerung (V-327) |
| I dreamed about | F | SL OPR3_046 | wie oben | niedrig |
| Backstage someone muttered: | M | SL OPR3_050 | Person, Objekt, Ereignis, Idee, Szene | niedrig; 28 Zeichen |
| A scratched sign read: | F | SL OPR3_057 | Objekt, Ort, Text | niedrig |
| My aunt used to say: | F | SL OPR3_061 | Person, Ereignis, Ort, Mythos; **nicht** vor Objekten | niedrig |
| From the back row: | A | SL NEW_028 | Person, Objekt, Ereignis, Idee, Szene | niedrig; Zuruf aus dem Publikum |
| An unsigned letter said: | F | SL NEW_043 | Person, Ereignis, Idee, Objekt | niedrig; 25 Zeichen |
| Someone scratched into the wall: | F | SL NEW_049 | Person, Idee, Ereignis, Objekt, Ort | niedrig; 33 Zeichen, teuer |
| Inside the case file: | F | SL NEW_058 | Person, Ereignis, Objekt | **hoch**: Aktenstimme, wie R10 |
| In my old sketchbook: | F | R2 OPR3_030 | Idee, Person, Ereignis, Objekt, Szene | niedrig; passt zu Comic-Decks |
| But the margin reads: | D | R2 OPR3_074 | breit | niedrig; Wende-Opener |
| Hold that thought: | X | R2 NEW_040 | breit | niedrig; kann die Stille ankündigen |

### 8.3 Freigegebener Pool (27), nach Klasse
- **A:** You with the card in your hand · You played · Did you ever try · Welcome to
- **Q:** You know · Do you know · You know the thing with · Have you heard of · Did you hear of · Ever tasted
- **F:** Let me tell you about · I once met
- **R:** Remember
- **D:** No wait · I used to believe
- **P:** Everyone agrees · The thing about · What if
- **E:** Nobody warned us about · This one has a rule · Here is something nobody asked for
- **M:** The deck insists on · Not a metaphor
- **X:** Anyway · Which brings us to · Meanwhile elsewhere · Before we continue

### 8.4 Vorschlag neue Familien (für Checker `FAMILIES`, erst nach Freigabe)
told: A friend told me about / I heard a rumor about / My neighbor mentioned · read: I read a book about / A footnote mentioned / A library copy mentioned · diary: My diary says / Someone wrote in my diary / In my old sketchbook · found: I found a note saying / A note under my door / On the back of a napkin / I found this scrap. Literale ohne Schluss-Doppelpunkt; der Doppelpunkt ist Verbindungszeichen in `spoken_text`, wie bei „Not a metaphor:“.

## 9 · Ablauf je Deck
1. Seitenstruktur lesen und auf die Bogenabschnitte legen (§3).
2. Wende-, Krisen- und Höhepunkt-Karte bestimmen; die Stille vor die Krise legen.
3. Faden-Karten wählen (3–5) und eine Rückruf-Karte, die eine frühere Karte oder die Intro-Frage spiegelt.
4. Opener nach Klasse und Kartenpassung setzen (§4, §5), Familienabstand prüfen.
5. Budget rechnen (< 5000). Wenn es nicht passt, zuerst Opener im Setup und in der Auflösung streichen, nie in der Krise.
6. `arc-map.md` schreiben, exakten Checker laufen lassen (0 FAIL), Muster-Abgleich nach R2 mit allen Tracks.

## 10 · Offen für Georg / WS0
1. **Pool-Erweiterung:** die 4 Anekdoten-Opener der Probe (A friend told me about, I read a book about, Someone wrote in my diary, I found a note saying) plus Familien in den Checker aufnehmen. Dafür braucht es eine V-Nummer. Danach wird `arc1-anek` die Abgabefassung.
2. **Intro ohne Teaser-Titel:** In arc1 besteht das Intro nur aus Decktitel und gedrucktem Slogan (13 Wörter). Die R2-Vorgabe nennt zusätzlich 2–3 Kartentitel; mit Titeln wären es mehr als 15 Wörter. Freigeben oder zurück zu Titeln.
3. **Spec-Satz ersetzen:** „gleichmäßig verteilt“ in R2 durch R5 (Dichte folgt dem Bogen).
4. **Checker-Ergänzung (Vorschlag):** Muster-Abgleich nach R2 und Lückenprüfung nach R1/R5 als Warnung, nicht als FAIL. In R1 nicht gebaut.
