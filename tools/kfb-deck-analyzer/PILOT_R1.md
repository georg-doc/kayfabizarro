# Deck-Analyzer Pilot R1 (27.10.2026)

Drei MVP-Decks vom Druck gelesen, wörtlich abgeschrieben und nach `GRADING_R1.md` bewertet (Georg 27.10.: fünf Kriterien, Sterne 1–5). Branch `data/kfb-deck-analyzer-r1` (Basis: Spielstand `ws1/karten-druck-spiel` @0c20db9 + batch8 @4d4b811).

## Token-Aufwand je Deck (gemessen)

Jedes Deck lief in einer eigenen Teilsitzung (Opus 5.5). Die Zahlen stammen aus deren Protokoll, summiert über alle Modellantworten.

| Deck | Karten | Dauer | Werkzeugaufrufe | Kontext am Ende | Tokens verarbeitet gesamt | davon Cache gelesen | neu geschrieben | Ausgabe |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `the_uruk_rumble` | 54 | 10:08 min | 44 | 201.634 | 3.431.807 | 3.051.213 | 321.796 | 58.746 |
| `anti_rules_toolkit` | 56 | 6:09 min | 33 | 166.106 | 2.480.061 | 2.313.339 | 130.354 | 36.326 |
| `geopolitical_thrillers_conspiracy_theories` | 56 | 9:18 min | 36 | 190.528 | 2.975.565 | 2.765.026 | 154.495 | 55.998 |
| **Mittel** | 55 | 8:32 min | 38 | ≈ 186.000 | **≈ 2,96 Mio.** | ≈ 2,71 Mio. | ≈ 202.000 | ≈ 50.000 |

- Rund 90 % sind Cache-Lesezugriffe: Der wachsende Verlauf wird bei jedem Schritt neu gelesen. Diese Zugriffe sind deutlich billiger als neue Tokens.
- Plan-Kontingent während des Piloten (alle drei parallel, dazu meine Steuerung):
  - 5-Stunden-Fenster: 6 % → 18 %
  - Woche: 90 % → 92 %
  - Andere Sitzungen liefen gleichzeitig, die Werte sind also eine **Obergrenze**: je Deck höchstens ≈ 4 % des 5-Stunden-Fensters bzw. ≈ 0,7 % der Woche.
- **Hochrechnung** (geschätzt, nicht gemessen): Ein voller Sichtlauf über alle 130 Decks braucht ≈ 130 × 0,7 % ≈ 90 % eines Wochenkontingents.
- **Sparpotenzial** (geschätzt 30–50 %): mehrere Seiten je Schritt lesen, weniger Zwischenschritte, die Bewertung im selben Durchgang schreiben (siehe Übergabe, Lessons Learned).
- Qualität: Stichproben am Seitenbild geprüft. Anti #1–4 (p02), Geo #3 (p02 BL) und Uruk #1–4 (p02) stimmen Wort für Wort mit dem Druck.

## Ergebnis je Deck

### `the_uruk_rumble`

- Karten: 54 · Titel geändert 2 · Power geändert 52 · Lore geändert 54 · neu 0 · nicht im Druck 0 · offen (printOpen) 23 · unverändert bestätigt 0
- Zuordnung: Registry-Zuordnung stimmt am Titel für Karten 1–52 (S. 2–14, TL/TR/BL/BR). Karten 53–54 liegen nicht im 2x2-Raster, sondern als Mini-Bonuskarten auf der Credit-Seite S. 15 (links oben bzw. links unten); Textquelle entsprechend p15 TL/BL.
- Bewertung: Deck 3★ (Ø 6.44 Punkte), Verteilung {'1': 0, '2': 3, '3': 35, '4': 11, '5': 5}. Fast jede Karte hat einen echten Epos-Kern (Tafel-Zitate, 13 Winde, Schimmelbrote, Tafel XII), und das Wrestling-Raster trägt bei Humbaba, Enlil und den Schimmelbroten. Viele Powers sind aber Satz statt Spielhandlung (besonders die „Power:“-Karten 41–52), und HP/Defense/Glory gibt es im Werteschema gar nicht.
- Top: Humbaba "The Jobber", The Moldy Loaves, Enlil "The Booker", Mayfly Philosophy, Rules of the Dead · Schwächste: The Bathing Spot, Etana's Eagle Rides, Adapa's Fish Shack: Don't Eat the Bread!
- Viral-Score 7: „The Moldy Loaves“ (Brotreihe als Schlafbeweis, „You can't argue with mold“) und Humbaba „the script said die“ funktionieren als Einzelbild ohne Vorwissen; das Deck braucht sonst etwas Epos-Kenntnis.
- Titeländerungen: #11 „Bull of Heaven "Gugalanna"“ → „Bull of Heaven "Gugalana"“; #54 „Adapa's Fish Snack, Don't Eat the Bread!“ → „Adapa's Fish Shack: Don't Eat the Bread!“
- Auffälligkeiten:
  - JSON hatte power und lore bei allen 54 Karten null; alle Power- und Lore-Texte sind hier neu vom Druck erfasst, ebenso alle stats.
  - Titelabweichungen: Karte 11 druckt „GUGALANA“ (JSON „Gugalanna“); Karte 54 druckt „ADAPA'S FISH SHACK: DON'T EAT THE BREAD!“ (JSON „Adapa's Fish Snack, Don't Eat the Bread!“); Karte 12 druckt „THE HAUNCH THROW”“ mit überzähligem schließendem Anführungszeichen.
  - Werteblock doppelt gedruckt (oben rechts und unten neben der Power) bei Karten 18, 25, 26, 30, 33, 34, 37, 38, 42, 46. Bei 26 (5/6/1 vs. 6/2/1), 37 (5/1/5 vs. 4/2/4) und 38 (A:6 vs. A:5) widersprechen sich die Zahlen; stats = oberer Satz, unterer in statsAlt. Bei 46 ist der untere Satz verwaschen. Entscheidung nötig, welcher Satz gilt.
  - Ab Karte 41 tragen die Power-Zeilen das Etikett „Power:“ vor dem Stichwort (Karten 41–52), davor nicht; wörtlich übernommen, Layout uneinheitlich.
  - Das GW-Logo unten rechts verdeckt auf jeder BR-Karte (4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52) das Ende der Lore-Zeile. Bei 4 ist das letzte Wort nicht lesbar (vermutlich „Gainax Ending“), sonst nur an den Oberlängen; printOpen jeweils gesetzt.
  - Glyphenfehler in der Ziffern-/Lore-Schrift: 5 erscheint als „S“ (Karten 10, 14, 16), i ohne Punkt (u. a. „GIlgamesh“, „untll“, „lIke“, „immedlately“), fehlende Doppelpunkte in „[A 2]“, „[A 3]“, „[A 4]“ (43, 47, 51), „Piot“ statt „Plot“ (25), schiefe Anführungszeichen um „Noah's Ark“ (38).
  - Powers verweisen auf Größen, die das Werteschema R/A/F nicht kennt: +2 Defense (3), HP (22, 33), Glory points (28), ein „Unknown“-Deck (27), Trap cards (20).
  - Inhaltliche Prüfpunkte: Karte 17 nennt 120 lb im Titel, aber 4 Talente in der Lore (deutlich schwerer); Karte 6 zeigt einen Anker in der Traumblase ohne Vorlage im Epos; Karte 38 nennt den Lärm als Flutgrund (Atrahasis, nicht Tafel XI).
  - Bonuskarten 53/54 haben weder Power noch Werte („?“); 54 trägt zusätzlich die Randnotiz „Bread may contain divine curses.“ außerhalb der Karte.
  - Sterne-Verteilung: 4+5 Sterne = 16/54 (30 %), 5 Sterne = 5/54 (9 %), innerhalb der Inflationsbremse.

### `anti_rules_toolkit`

- Karten: 56 · Titel geändert 0 · Power geändert 20 · Lore geändert 14 · neu 0 · nicht im Druck 0 · offen (printOpen) 0 · unverändert bestätigt 26
- Zuordnung: Registry-Zuordnung stimmt: p01 Manifest (kein Karteninhalt), Karten 1–56 auf p02–p15 in TL/TR/BL/BR, p16 Rückseite „PRINT. CUT. PLAY.“. Die auf main doppelte #51 war im Druck keine eigene Karte, sondern der doppelt gesetzte Titel auf #50; die Umnummerierung #52–57 → #51–56 passt zum Druck.
- Bewertung: Deck 3★ (Ø 5.57 Punkte), Verteilung {'1': 0, '2': 15, '3': 27, '4': 13, '5': 1}. Starke Bildpointen (Banane an der Tafel, schmelzender Pokal, Magritte-Pfeife, Sheriff of Nothing) und meist spielbare Powers, aber rund die Hälfte der Lore-Zeilen sind Notizen aus dem Designbriefing statt Sätze für Spieler, und Wissen steckt kaum drin.
- Top: The Correct Nonsense, The Lost Winner, Nervous Laughter, The Amnesia, The Dead Author · Schwächste: The Table, The Pot Plant, The Story Breaker
- Viral-Score 7: „The Correct Nonsense“ mit „2 + 2 = BANANA“ und dem Satz „If it makes no sense, it may be correct.“ würde geteilt, weil Bild und Satz ohne Spielkenntnis funktionieren.
- Titeländerungen: keine
- Auffälligkeiten:
  - Zuordnung Registry = Druck (coverOffset 1, trailingPages 1); 56 Karten im Druck, 56 im JSON, keine fehlt, keine zusätzlich.
  - #50 The Skill Issue: Titel im Druck doppelt nebeneinander, Karte hat zwei Bilder (Schwerthand und Zauberer) – Layoutfehler; keine zweite Karte.
  - Druck-/Glyphenfehler: #33 „Roweal:“ statt „Reveal:“ und ohne „Power:“-Etikett; #46 „Nost games“; #49 zweimal „NOOD“ statt „MOOD“; #30 „Blődsinn“ (ő); #36 „*really*“ mit Sternchen gedruckt.
  - Schrift-Etikett „Courier Prime“ ist auf #43 The Lab Coat und #44 The Dunce Cap mitgedruckt (weggelassen).
  - RAF-Kästen tragen auf keiner Karte Werte (stats leer); auf #21–25 und #29–32 sind Häkchen gedruckt (R, F, A oder A+F) – als statsMarks festgehalten.
  - Lore #1 und #13 sind identisch („Cry harder, Esq.“); im JSON stand bei #1 noch „Dry leader. Busy.“.
  - Doppelte Powers/Stichwörter: „Reset:“ auf #12 und #48; Schweigen als gültiger Zug auf #8 und #37; „Play when the table stalls“ auf #8 und #27.
  - Viele Lore-Zeilen sind Notizen aus dem Designbriefing statt Spielertext (#17, #19, #20, #21, #32, #37, #38, #39, #40, #41, #42, #47, #49, #50, #52) – größter Qualitätshebel des Decks.
  - Titel: alle 56 gleich wie im JSON. Inhaltlich weicht das JSON bei Power/Lore ab, u. a. #3 „consequences“, #4 „The Veto … Move … “optimal.”“ statt „The Meta …“, #17 „Editor … It is gone forever.“, #19 „hates“ statt „rejected“, #21 „one Anti-Rule“, #28 „just telling stories“, #32 „it succeeds“, #35, #45 „right now“, #15 „rule panic“, #31 „framings“, #38, #47 „Externalize responsibility.“, #48, #51 „Quest Die value by ±2“ / „If die tips“, #52 „Actor -> Stage -> Quest“. Das JSON-Kartenformat nutzt noch num/name statt cardNumber/cardName.
  - Seitenränder tragen Stempel (HUMBUG!, KayfaBOGGLE!, KayfaBINGO!, KayfaBONGO!, KayfaBIZARRO!, BLÖDSINN!, What the FLUFF?!) – keine Kartentitel.

### `geopolitical_thrillers_conspiracy_theories`

- Karten: 56 · Titel geändert 0 · Power geändert 35 · Lore geändert 23 · neu 0 · nicht im Druck 0 · offen (printOpen) 0 · unverändert bestätigt 13
- Zuordnung: Registry stimmt
- Bewertung: Deck 3★ (Ø 6.14 Punkte), Verteilung {'1': 0, '2': 5, '3': 33, '4': 16, '5': 2}. Stark, wo echte Geschichte trägt (Paperclip, Gladio, Gehlen, Hoover, Sunshine/Sea-Spray): Fakt, Bild und Mechanik greifen ineinander. Schwach, wo Verschwörungsbehauptungen ohne Brechung als Tatsache stehen (5G, Turbo Cancer, Scamdemic, SSRI, WHO) und wo Powers auf undefinierte Spielgrößen zeigen (quadrant, artifact cards, rebel energy). Hinweis: 4+5 Sterne bei 18/56 = 32 %, knapp über 30 %. Nach Nachprüfung belassen: die 4er stützen sich fast alle auf einen belegbaren Wissenskern (wissen 2) oder ein Bild, das die Pointe selbst trägt; 5 Sterne nur 2 Karten.
- Top: Operation Paperclip, Operation Gladio, The Imperial "New Hitler" Cast, The 21-Year Gaslight, The Island Honeypot · Schwächste: 5G & Blue Light Grids, The WHO Treaty, FrizzleBob's Freedom Bathrobe
- Viral-Score 6: Geteilt würde Operation Paperclip („"Never Again" quickly became "Well.. maybe just this once, for the space race."“) mit dem Schäferhund, der den NASA-Aufnäher auf die Wehrmachtsuniform klebt, weil es echte Geschichte als Pointe ist; Rothschild-Geier, Turbo Cancer und 5G machen das Deck aber angreifbar und bremsen die Weitergabe.
- Titeländerungen: keine
- Auffälligkeiten:
  - Zuordnung stimmt: Deckblatt p1, Karten 1–56 auf p2–p15 je TL, TR, BL, BR; alle 56 Titel passen zum JSON (Titel unverändert, gemischt geschrieben, daher kein cardNamePrint).
  - Keine Karte fehlt, keine ist doppelt; keine Stats gedruckt.
  - Power-Text weicht inhaltlich bei 28 Karten vom JSON ab, Lore bei 22; nur 18 Karten sind gleich (bis auf Anführungszeichen) (oft einzelne Wörter: z. B. #3 'discarded assets for 0 cost … wine', #12 'Bomb … 2 "Humanitarian" points', #33 'Hack …', #50 'Skip 5 turns'). JSON nach Druck nachziehen.
  - Schreibmaschinenschrift mit Glyphenfehlern vor allem auf p3 (#5–8: m als a/s, i als l, F als P, z. B. 'Pres Thought'), vereinzelt p4 (#10), p5 (#13 'poetwar') und p7 (#21 'Plezner Repcrt'). Transkribiert ist das gemeinte Wort, Original in printTypo.
  - Druckfehler: #43 'biding' statt hiding; #10 'Well..' mit zwei Punkten; #33 'wet' klein zwischen die Zeilen eingeflickt (Layoutfehler).
  - #22 Lore endet mit dem deutschen Wort 'Genial.' im englischen Text (steht auch im JSON, wirkt absichtlich).
  - Layout: p10–p15 tragen seitenlokale Etiketten 'CARD 1'–'CARD 4' (nicht die Decknummer, weggelassen). p5: Schwärzungsbalken direkt unter den Titeln von #13–#16 (Gestaltungselement; ob darunter Text gedacht war, ist nicht erkennbar). Jede Seite hat eine Kapitelzeile mit Untertitel (z. B. p2 'The Imperial Kindergarten', p3 'The Debt-Leash Ecosystem', p15 'EPISTEMIC SABOTAGE'), die im JSON fehlt.
  - Sachfehler im Druck: #12 NATO-Karte zeigt UN-Blauhelm und sagt 'peacekeepers wear blue' (NATO ≠ UN). #22 SSRIs ersetzen kein Lithium. #35 5G 'irradiates you' ist falsch.
  - Inhaltsrisiko: #3 Rothschild als Geier-Bankier mit Hauptbuch und Waterloo-Mythos bedient ein antisemitisches Bildmuster; #26, #28, #31, #35 erzählen Gesundheits-Falschbehauptungen (Scamdemic, Turbo Cancer, Mass Formation, 5G) ohne satirische Brechung als Fakt.
  - Weggelassen: Stempel/Sprechblasen (KayfaBINGO!, KayfaBONGO!, KayfaBIZARRO!, KayfaBOGGLE!, BLÖDSINN!, HUMBUG!, What the FLUFF?!, Stay fluffy!), GW-Signatur, Bildbeschriftungen (Blame the Commies., SAFE & EFFECTIVE, MK-ULTRA WAS A VIBE u. a.).

Die vollständige Vorher/Nachher-Liste je Karte steht in `logs/<packId>.apply.json`, die Rohtranskription mit Seite und Viertel in `pilot/<packId>.print.json`.

Titel: Im `cardName` stehen gerade Apostrophe und Anführungszeichen wie im Kanon vom 14.10., weil Spiel und Triplets Karten über den Titel zuordnen. Die Druckform steht in `cardNamePrint`.

## Für Georg zu entscheiden

1. **Uruk Rumble, doppelt gedruckte Werteblöcke** (#18, 25, 26, 30, 33, 34, 37, 38, 42, 46): Bei #26, #37 und #38 widersprechen sich die Zahlen. Eingetragen ist der obere Satz (`stats`), der untere steht in `statsAlt`. Welcher gilt?
2. **Geopolitical Thrillers, Inhaltsrisiko:**
   - #3 zeigt Rothschild als Geier-Bankier mit dem Waterloo-Mythos. Das ist ein antisemitisches Bildmuster.
   - #26, #28, #31 und #35 bringen Gesundheits-Falschbehauptungen (Scamdemic, Turbo Cancer, Mass Formation, 5G) ohne erkennbare satirische Brechung.
   - Für Marketing und die öffentliche Site ist das heikel. Ich habe es nur gemeldet; der Text steht wie gedruckt.
3. **Anti-Rules:** Rund 15 Lore-Zeilen sind Notizen aus dem Designbriefing („Plants in pots. Silent visual gags.“) statt Text für Spieler. Sie sind wie gedruckt übernommen. Hier liegt der größte Hebel für eine Überarbeitung.
4. **Wie weiter:** Sollen weitere Decks im gleichen Verfahren folgen? Kosten siehe oben.
