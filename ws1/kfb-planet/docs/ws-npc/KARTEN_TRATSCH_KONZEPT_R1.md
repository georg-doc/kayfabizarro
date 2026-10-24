# Karten-Tratsch · Konzept R1

Sitzung WS-NPC · 23.10.2026 · Auftrag: WS1-Lead („Karten-Tratsch“, Georg 23.10., mit Nachtrag zu BONGO, BOGGLE und HUMBUG).

Status: **Von Georg freigegeben (23.10.). Stufe 0 ist gebaut und gerechnet**: Ergebnis in `tratsch/README.md`.

**Georgs Entscheidungen zu §9 (23.10.):** „das passt so“ zu den Empfehlungen des Leads.

1. Signatur-Liste geht über WS0 ins Register. Bots und Orc Brute bleiben offen, in der SIM per Seed.
2. Starter-Set wird später kuratiert, in der SIM per Seed.
3. Rückfall a (roh, BONGO-anfällig). Stufe 0 rechnet b zum Vergleich.
4. Triplet-Sets werden je Set abgenommen, Kriterium ist die 90-%-Regel. Im Spiel bis dahin nur mit Vorschalter.
5. Blödsinn! heißt „abgelehnt“.
6. HUMBUG = Blitzdingsen, also Löschen (später auch partiell).
   - Auslöser: eine Karte verbreitet sich zu schnell (≥ N Übernahmen an einem Tag).
   - Umstehende reagieren gegenläufig.
   - Der Spieler ruft kein HUMBUG.
   - Stufe 0: Hauptlauf ohne MiB, Vergleich mit MiB.
7. KafKaBONDO! ist ein Artefakt, wird ignoriert. KayfaBIZARRO! ist ein FrizzleBob-Ausruf ohne Tratsch-Funktion.
8. Tratsch-Art kommt aus den Figurenblättern, sonst über Georg bzw. WS0; in der SIM per Seed.
9. Es tratschen alle mit Register-ID.
10. Ein Spieler-BINGO gibt dem Erzähler einen Statusschub, und die Karte geht ins Journal.

---

## 1 · Worum es geht

Jede Figur trägt Karten als Weltwissen. Am Anfang kennt sie nur wenige davon.

Figuren erzählen einander und dem Spieler Triplets aus ihren Karten. Das passiert immer wieder und gemischt, wenn eine Figur mehrere Decks kennt: *Show it, spin it, sell it.*

Der Hörer antwortet mit einem **Social Call**. Jeder Call hat eine eigene Folge für das Weltbild (Herleitung in §2.4):

| Call | Folge im Tratsch | Kurz |
|---|---|---|
| **KayfaBINGO!** | Der Hörer übernimmt die Karte mit Herkunft. | übernommen |
| **KayfaBOGGLE!** | Eine Nachfrage, keine Wertung. Der Erzähler antwortet in 1–2 Sätzen, danach wird neu entschieden. | vertieft |
| **KayfaBONGO!** | Der Erzähler hat die Karte „roh“ gebracht (Power wie eine Regel). Er muss als Geschichte nachlegen. | nacherzählt |
| **Blödsinn!** | Abgelehnt, weil es nicht in das Weltbild des Hörers passt. Die Karte wandert nicht. | abgelehnt |
| **HUMBUG!** | Eingriff der Kayfabe Men in Black (V-530): Blitzdingsen. Die Karte wird aus dem Kopf gelöscht. | gelöscht |

Ob eine Karte „zündet“, hängt bewusst **nicht** am Inhalt, sondern an der sozialen Dynamik (§4). Der Spieler sieht zu, ruft selbst Calls, bringt Karten ein und komplettiert die Decks der Figuren.

**Georgs Entscheidungen (23.10.), hier vorausgesetzt:**

1. **Text decodiert:** Die Sprechblase zeigt Klartext. Fluff-o-lect und die Pottymouth-Glyphen kommen später.
2. **Kein inhaltliches Matching:** keine Schlagwort- oder Themen-Verknüpfung zwischen Karten.
   - Die Dissonanz ist gewollt.
   - „Kognitive Dissonanz als Kayfabizarro-Resonanzraum“ ist auch der Titel einer KI-Lesart im Deck Epistemic Sabotage (`media/kfb/Epistemic_Sabotage_…pdf.json`).
3. **Stufen:**
   - 0 Daten
   - 1 sichtbare Tratsch-Szene
   - 2 Debatte
   - 3 Spieler
   - 4 emergente Weltbilder

   Davor kommt **Stufe 0 als Text-Simulation**.

---

## 2 · Datenstand (geprüft 23.10., mit Quellen)

### 2.1 Karten

- Die Spiel-Kartenquelle ist `src/data/cards.json`: 130 Decks, 6816 Karten.
  - Je Karte: Deck, Nummer, Name, Power, Lore.
  - Stand: Druck V-242, media/kfb @52adc8f1.
  - Wörtlich übernommen. S5b nutzt diese Quelle schon heute.
- Jede Karte hat ein Lore.
  - Median 84 Zeichen, p90 124, Maximum 204.
  - 85,8 % haben höchstens 2 Sätze, 95,5 % höchstens 140 Zeichen.
- Autor ist Georg von Westphalen („GvW“ auf jeder Kartenseite). Das Werk ist der Deck-Titel.

### 2.2 Triplets

Quelle sind Deck-Songs und Song Workshop; Zweig `ws-song/workshop-r1` @fef39c08 in kayfabizarro; Pfad `…/30_DECISIONS/replies/SONGS_WORKSHOP_R1/<deck>/<deck>.t1.triplets.csv`.

**Bestand:**
- 16 Decks mit Set t1 und insgesamt 867 Karten-Triplets, **je Karte genau eines**:
  - BBBW (512880ed)
  - WSA-Batch 1 mit 15 Decks (07392e08)
- Spalten der CSV: `line_no, kind (card|intro|outro), card_number, opener (leer), triplet`.
- Alle 16 Decks stehen auch in `cards.json`.

**Status:**
- Keines ist von Georg abgenickt. Im Writers' Room stehen alle als `draft`.
- Prüfberichte (SONG_WORKSHOP_STATUS §24):
  - 0 FAIL: 10 Decks, darunter BBBW (97 % Kartentext), Mission Control, Ego Mania, Woad and Warriors.
  - Rot: 6 Decks, darunter platos_dungeon_raid_hero_set_01 mit 56 FAIL („Titel fehlt“).
- Ältere Sets nach TRIPLET_SET_SPEC_R2 (13 Decks, mit Openern) liegen in `replies/TRIPLET_SETS_R2/`.

**Regeln:**
- Verbindliche Spec ist `TRIPLET_SET_SPEC_R2.md` (V-266) mit `triplet_set_check.py`:
  - Titel vorn, mit der Power verschmolzen
  - nur Kartenwörter, verdichten durch Weglassen
  - 8–20 Wörter
- Georgs Zusatz vom 21.10. „≥ 90 % Kartentext, nichts vor die Zeilen“ steht nur in der Commit-Nachricht 07392e08 und als Lesson l17. In einer Spec steht er nicht. Gemessen wird er mit `make_marked.py`.

**Länge, über alle 867 gemessen:**

| | Zeichen | Wörter |
|---|---|---|
| Median | 83 | 13 |
| p90 | 96 | 17 |
| Maximum | 134 | 22 |

**Datenabweichungen:**
- Ego Mania: Der Druck hat 48 Karten, die Registry 56.
- Mission Control: Die Karten 37–56 weichen ab.
- Die t1-Sets folgen dem Druck, mit eigenen `print_cards`-Dateien.

### 2.3 Figur → Deck

Quelle ist `SONGS_WORKSHOP_R1/signature/SIGNATURE_DECKS_R1.json`:
- 62 Figuren bzw. feste Duos, je genau ein Signatur-Deck.
- Listen-Status **BESTÄTIGT**, Georg 20.10.: „ja, gefällt mir – können wir so machen“.
- Je Eintrag gibt es zusätzlich eine Grundlage: `BESTÄTIGT`, `GEORG`, `GEORG-IDEE` oder `VORSCHLAG`.
- FrizzleBob ist Meta-Figur bzw. Spieler-Avatar und hat kein Signatur-Deck.

Im Register CHARACTERS_R1 stehen die Felder `signatureDeck` aber noch auf `todo`. Die Liste ist dort nicht übernommen. Das Register ist die SSOT; Übernahme durch WS0, siehe §9.

**Figuren, die heute im Spiel stehen:**

| Spielfigur (Register-ID) | Signatur-Deck | Grundlage | Karten | Triplet-Set |
|---|---|---|---|---|
| lorekeeper | frizzlebob_s_mission_control | GEORG-IDEE | 56 | t1 (0 FAIL, Druckabweichung 37–56) |
| farmer_b | the_bards_barnyard_beatdown | BESTÄTIGT | 49 | – |
| skeleton_warrior | sonic_warfare_music_history_01 | VORSCHLAG | 40 | – |
| skeleton_rogue | the_kayfabe_money_trail_9_11 | VORSCHLAG | 60 | – |
| skeleton_mage | symphonic_savagery | VORSCHLAG | 56 | – |
| toy_soldier | geopolitical_thrillers_conspiracy_theories | GEORG-IDEE | 56 | – |
| orc_brute (Band, Drummer) | the_uruk_rumble | BESTÄTIGT | **0 in cards.json** | – |
| orc_raider (Band, Gitarre) | shadow_politics | BESTÄTIGT | 48 | – |
| kayfabrick_bot (Bots) | **keine Zeile**; in der Liste steht nur Robot Two → ignore_dystopia (VORSCHLAG) | – | – | – |

Folge: **Von den Spielfiguren hat heute nur der Lorekeeper Triplets.** Damit wird die Rückfall-Frage (§3.1) entscheidend.

### 2.4 Social Calls: Herleitung

**Freestyle-Regeln v18-4** (main, `Kayfabizarro_Freestyle_Rules_v18-4.md`, Blob 38186727), §8 „Social Feedback — Did You Sell It?“.

Die Calls kommen nach einer Story, bevor der Nächste dran ist:

| Call | Regeltext |
|---|---|
| BINGO | „That landed. Spontaneous, no explanation needed.“ |
| BONGO | Eine Power wurde als Mechanik aufgelöst („I deal 3 damage“), sie wird als Story neu erzählt. |
| BOGGLE | „One concrete question — not a judgment, a gap.“ Antwort in 1–2 Sätzen, dann geht es weiter. |
| Blödsinn! | Eine Regel wurde gebrochen; die Mehrheit entscheidet. |

Laut FAQ stapeln BINGO und BOGGLE; bei einem Zusammenstoß gewinnt Blödsinn! gegen BINGO.

**Die Calls als Karten** (Deck kayfabizarro_improv_comedy, `cards.json`):

| Karte | Power |
|---|---|
| #37 KayfaBINGO! | „validate another player's perfect, spontaneous narrative beat“ |
| #38 KayfaBONGO! | „uses game mechanics instead of storytelling … restate it as a narrative event“ |
| #39 KayfaBOGGLE! | „exactly one concrete question about a narrative gap … answer in 1–2 sentences“ |

**Blödsinn!** im Deck kreative_kayfab_creative_hero_journey #41 „Blödsinn! (The Whistle)“:
- Power: „Call BS on a story gap. Force a rewrite.“
- Lore: „That's nonsense. That's Humbug.“
- Georgs Tratsch-Vision setzt Blödsinn! als „abgelehnt“. Ich folge ihr und nenne die Abweichung zur Klärung in §9.

**HUMBUG!:**
- **V-530** (RULE, Georg 18.10., Kayfabe Men in Black): „Blitzdingsen: als Intervention im Triplet-Dialog (dramaturgisch vor Reveal oder Closure) Ruf ‚Humbug!' als Comic-Wort (gebogen, ohne Sprechblase), weißer Blitzstrahl auf die Kopfmitte“.
  - Danach fällt das Opfer, steht auf und läuft orientierungslos.
  - Ablauf eines Einsatzes in `BRIEF_WSB_B40_BLOBCORP_TOWER_R1.md`: Turm, Agenten, Befragen, Humbug, Abzug.
- Weitere Karten:
  - the_kayfabizarro_manifesto_cover_up #4 „The Official Seal of Humbug“, Lore: „Authority is just an expensive piece of wax.“
  - Kompendium #60 „KayfaHUMBUG!“: „Stop the game. The line was crossed.“ Lore: „The safety valve.“

**Marker auf den Karten** (Epistemic Sabotage, Seitenhinweise im Karten-JSON):
- KayfaBIZARRO! auf S. 1 und 10; es ist auch ein FrizzleBob-Ausruf (CS-56) und steht im Lore von „Uncle FrizzleBob“.
- KafKaBONDO! auf S. 6.
- Für **KafKaBONDO!** ist **keine Bedeutung** belegt. Gesucht habe ich in Repo, Regeln und Karten → §9.

**Abbildung im Tratsch, mit Begründung** (folgt dem Vorschlag des Leads, mit zwei Anpassungen):

- **BOGGLE vertieft:** Der Erzähler antwortet mit dem **Lore derselben Karte, wörtlich**.
  - Begründung: Je Karte gibt es heute genau **ein** Triplet, ein zweites zur selben Karte existiert nicht.
  - Das Lore ist meist genau die verlangten „1–2 Sätze“ (85,8 %) und ist S5b-konform.
  - Danach wird über die Übernahme neu entschieden.
- **BONGO ist das Qualitäts-Tor:** Bringt der Erzähler die Karte roh (Rückfall-Text `Name: Power`, weil kein Triplet existiert), kann der Hörer BONGO rufen.
  - Der Erzähler muss dann als Geschichte nachlegen: mit dem Triplet, falls es eines gibt.
  - Gibt es keines, verstummt er („…“), und die Karte wandert nicht.
  - Das verbindet die Rückfall-Frage mit der Regel: Rohe Karten werden selten übernommen.
- **HUMBUG** ist **kein Hörer-Call unter Gleichen**, sondern ein Eingriff einer Autorität. Nach V-530 bedeutet er **Löschen**: Das Opfer verliert die Karte aus dem Weltbild, mit einem Vermerk „gelöscht von MiB“.
  - Die Lesart des Leads (gegenläufige Wirkung je Figurenart, Streisand-Effekt) passt als Wirkung auf die **Umstehenden**: Wer zusieht, merkt sich die Karte erst recht (Rebellen- und Verschwörungs-Arten) oder erzählt sie nicht mehr weiter (Angepasste).
  - Ob das so gilt und **was** einen MiB-Einsatz auslöst, entscheidet Georg (§9). Ich erfinde keinen Auslöser.

### 2.5 Was es im Spiel schon gibt

- **Gerücht D2:** Ereignis-Gerüchte (`npcMemory.tell`), ein Schritt, nur Selbsterlebtes.
- **Spielstand:** `kfb.world-save/1` mit Belegen (`told` nur einen Schritt; je Figur 16, gesamt 256).
- **Blasen:** S5b zeigt nur ausgegebene Zeilen, also ACCEPTED-Pool-Zeilen oder Kartentext wörtlich. Eine Vorschau gibt es nur mit Schalter (F-3a).
- **Zurufe des Spielers:** `poolReader.js` mit `KayfaBINGO!`, `KayfaBOGGLE?`, `KayfaBONGO!`, `BLÖDSINN!`. **HUMBUG fehlt** und wäre ein Spieler-Zuruf nur, wenn Georg das will.
- **Begegnungen:** Tagespläne (`npcDay`), Begegnungstabellen, Blase 60 m.
- **Register-IDs:** Alle Spielfiguren tragen `characterId` (4251479).

---

## 3 · Datenmodell

### 3.1 Karte und Text in der Blase

Die Karte ist `deckId#n` aus `cards.json`. Der Text in der Blase, Rangfolge:

1. **Triplet** aus dem gepinnten Set (Pfad und Blob gepinnt wie der Pool-Leser B13).
   - Im Spiel nur, wenn das Set abgenickt ist.
   - Bis dahin nur mit Vorschalter `tratsch=preview` (wie F-3a).
2. **Rückfall, offen (§9):**
   - **a) Kartentext wörtlich** `Name: Power`, wie S5b heute. Er ist „roh“ und BONGO-anfällig, siehe §2.4.
   - **b) kein Text, die Figur schweigt.** Das ist die Empfehlung des Song Workshop: „Ohne geprüftes Triplet keine Sprechblase“.
   - Mit b) tratscht im Spiel heute nur der Lorekeeper.
3. Bei BOGGLE: **Lore wörtlich** derselben Karte.
4. Sonst „…“.

Das Spiel erzeugt keinen Text, keine Brücken, keine Opener (S5b).

Die Stufe-0-Simulation zeigt t1-Triplets auch ohne Abnahme, weil sie ein Prüf-Protokoll ist und kein Spiel.

### 3.2 Weltbild einer Figur

`Wissen[figur] = Menge von { card, from, chain, day, via, conviction }`

| Feld | Inhalt |
|---|---|
| `from` | `start`, Figur-ID oder `player` |
| `chain` | Herkunftskette, höchstens 3 Glieder; der Ursprung bleibt erhalten |
| `via` | `bingo`, `boggle-bingo` oder `bongo-bingo` |
| `conviction` | 0–3. Startkarten haben 3; übernommen gilt Erzähler minus 1, mindestens 1 (wie D2) |

Zusätzlich:
- **Ablehnungen** `{ card, from }`: Derselbe Erzähler erzählt dieselbe Karte nicht noch einmal demselben Hörer.
- **Gelöscht** `{ card, by: 'mib', day }`: Eine gelöschte Karte kommt erst über eine **andere** Quelle wieder.
- **Beziehung** `rel(a, b)` −3…+3 und **Status** `status(a)` 0…3: werden aus den Belegen abgeleitet, nicht gespeichert.
- **Art der Figur:** `Tratschmaul | Skeptiker | Übertreiber | Schweiger`, für HUMBUG zusätzlich `angepasst | rebellisch`. Herkunft siehe §9.

### 3.3 Decks und Starter-Set

- Decks einer Figur: das Signatur-Deck aus §2.3, später weitere (Zweitdeck bzw. Varianten in der Liste).
- Starter-Set: 6 Karten je Figur. Das Verfahren entscheidet Georg:
  - a) die ersten 6 des Signatur-Decks
  - b) 6 per Figuren-Seed
  - c) kuratiert von WS0
- Fehlende Karten sind Sammelziele des Spielers (Stufe 4).

---

## 4 · Soziale Dynamik ohne Inhalt

**Vorbilder**, auf die Mechanik reduziert:

- **Comme il Faut / Prom Week** (McCoy u. a., 2011): Ob eine soziale Handlung gelingt, folgt aus gewichteten sozialen Regeln über Beziehung, Status, Eigenschaften und Vorgeschichte. Gespeichert werden soziale Fakten, kein Inhalt.
- **Crusader Kings:** Eigenschaften verschieben die Meinung, die Meinung entscheidet über Annahme.
- **Dwarf Fortress:** Gerüchte tragen ihre Quelle („heard from …“) und reisen über Begegnungen.
- **Meme-Ausbreitung:**
  - komplexe Ansteckung (Centola): Mehrfache Begegnung aus verschiedenen Quellen erhöht die Übernahme.
  - Homophilie (McPherson u. a.)
  - begrenztes Vertrauen (Deffuant / Hegselmann-Krause)
  - Daraus entstehen Blasen.

**Wert des Hörers H für die Erzählung von E** (nur Zustände, nie Kartentext):

```
s = w_rel · rel(H,E)            Beziehung
  + w_sta · status(E)           wer es sagt (wie viele E schon überzeugt hat, gestuft)
  + w_rep · rep(H,card)         wie oft H die Karte schon gehört hat, von verschiedenen Erzählern (gedeckelt)
  + w_bub · overlap(H,E)        Blasen-Nähe: Jaccard der gekannten Karten (zentriert −0,5…+0,5)
  + w_raw · raw                 −, wenn roh erzählt (Rückfall-Text statt Triplet)
  + art(H)                      Skeptiker −, Tratschmaul +, Übertreiber +, Schweiger 0
  + w_rnd · rnd(seed, Tag, H, E, card)   Zufall, Anteil gedeckelt (T8)
```

**Ablauf eines Austauschs** (höchstens ein Nachlegen):

1. Ist die Erzählung roh und `s` unter `θ_bongo` → **BONGO**. Der Erzähler legt das Triplet nach, gibt es keines, verstummt er. Neu bewerten ohne `w_raw`.
2. `s ≥ θ_hi` → **BINGO**: Die Karte wandert, `rel` +, `status(E)` +.
3. `θ_lo ≤ s < θ_hi` → **BOGGLE**: Der Erzähler antwortet mit dem Lore. Neu bewerten mit `s + δ`, dann BINGO oder Blödsinn!.
4. `s < θ_lo` → **Blödsinn!**: `rel` −, Ablehnung notiert.
5. **HUMBUG** liegt außerhalb dieser Kette. Es ist ein MiB-Ereignis mit eigenem Auslöser (§9); Folge siehe §2.4.

**Warum Muster entstehen, nicht Rauschen:**
- Status bringt Meinungsführer hervor.
- Nähe → BINGO → mehr Nähe: daraus werden Blasen.
- Mehrfach Gehörtes setzt sich durch: daraus werden Moden.
- Das Protokoll druckt **zu jedem Call die Faktoren** (§6).

**Was erzählt wird:**
- Eine Karte aus dem eigenen Wissen, gewichtet nach `conviction`, Neuheit und Signatur-Deck, gemischt über alle gekannten Decks.
- Kein Themenbezug.
- Ein Übertreiber erzählt Übernommenes mit voller Überzeugung weiter.

Die Werte `w_*`, `θ_*` und `δ` sind Stellschrauben. Sie werden am Protokoll mit Georg abgestimmt und nicht vorab festgelegt.

---

## 4b · Dramaturg („Conflict is king!“, Georg 23.10.)

Vorbilder: AI Director (Left 4 Dead), Storyteller (RimWorld), Drama-Manager (Façade).

**Was er tut:**
- Er führt eine Spannung τ, einen gleitenden Mittelwert des Konflikts je Austausch:
  - Blödsinn! 1
  - BOGGLE 0,5
  - BONGO 0,4
  - BINGO 0,1
  - plus Debattenrunden
  - über Blasengrenzen ×1,2
- Er wechselt je Spieltag die Phasen mit Zielspannung: **Aufbau** (0,4) → **Konflikt** (0,75) → **Ruhe** (0,15).
- Liegt τ unter dem Ziel, sucht er Konflikt. Darüber beruhigt er.

**Wie er eingreift (nur in die Auswahl, nie in die Bewertung):**
- **Wer wem begegnet:** Paare werden nach Konfliktpotenzial gewichtet. Grundlage sind nur Zustände: andere Gruppe, gestörte Beziehung, kaum geteilte Karten.
- **Welche Karte erzählt wird:**
  - Konflikt: umstrittene Karten (schon abgelehnt, gerade in Mode).
  - Ruhe: Karten, die der Kreis des Hörers schon kennt.
- **Debatte:** Im Konflikt über eine Blasengrenze erzählen beide abwechselnd eigene Karten, bis zu 3 Runden, Ende bei Blödsinn!. Ohne Dramaturg gibt es nur zufällige Gegenrede nach Blödsinn!.

Die Calls bleiben bei der sozialen Bewertung (§4). Deshalb bleiben die Muster erkennbar (T8).

**Stellwerte seit Lauf 2** (Lead 23.10.: T13 ist eine technische Stellschraube):
- Phasen je Tag sind jetzt Aufbau 3, Konflikt 5, Ruhe 4 Slots, vorher 4/4/4.
- Die Glättung α ist 0,5, vorher 0,35.
- Grund: Mit 4 Slots und α 0,35 erreichte die Spannung ihr Phasenziel nicht innerhalb einer Phase. Eine höhere Dramaturg-Stärke (2,8 bzw. 3,4) half nicht.
- Raster über die Seeds 1–10, Mittel: T13 stieg von 0,153 auf 0,217, bei Q 0,35, T14 0,37 und T8 0,82.

**Neue Kriterien:**
- T12 Konflikt über Blasengrenzen je Tag (Blödsinn!, BOGGLE, Debatten).
- T13 Spannungskurve: mittlere Spannung in Konflikt-Slots minus Ruhe-Slots, Ziel ≥ 0,2.

---

## 5 · Stufen

| Stufe | Inhalt | Ergebnis |
|---|---|---|
| **0 · Text-Simulation** (zuerst) | headless, rein; N Figuren, M Spieltage; Begegnungen nach den heutigen Tagesplänen bzw. einer Prüf-Aufstellung | Tratsch-Protokoll (§6), Kennzahlen (§7) |
| 1 · Daten | Zuordnung und Starter-Set nach Georgs Entscheid, Triplet-Leser gepinnt, Wissen im Spielstand `/2` | Daten im Spiel |
| 2 · Tratsch-Szene | Begegnung in der Blase: Erzähl-Blase, Call als Comic-Wort; Ereignis für WS-Audio | sichtbar, höchstens 1 Austausch je Begegnung |
| 3 · Debatte | Zwei Figuren wechseln sich ab (je eigene Karte, kein Bezug), Umstehende rufen; Ende nach k Runden oder bei Blödsinn! | Dissonanz als Szene |
| 4 · Spieler | zuhören (Karte ins Journal), eigene Zurufe, Karten an Figuren geben, Decks komplettieren | Spieler-Aufgabe |
| 5 · Weltbilder | Blasen und Meinungsführer emergent, MiB als eigene Kraft | — |

---

## 6 · Stufe 0: Tratsch-Protokoll

Beispiel des Formats, Platzhalter statt echter Daten:

```
Tag 3 · Seed 7 · Figuren 8 · Decks: Signatur-Liste (SIM-Aufstellung, keine Kanon-Zuordnung)
─────────────────────────────────────────────────────────────
09:12  lorekeeper → farmer_b   [frizzlebob_s_mission_control #4]  (Triplet)
       „<Triplet wörtlich aus dem Set>“
       KayfaBOGGLE!  (rel +1 · Status 2 · gehört 0× · Nähe +0,1 · Skeptiker −1 · Zufall +0,2 = 0,9)  → vertieft
       Lore: „<Lore wörtlich>“  → KayfaBINGO! (1,4)  → übernommen · Kette: lorekeeper · Überzeugung 2
11:40  farmer_b → toy_soldier  [the_bards_barnyard_beatdown #12]  (roh: Name: Power)
       KayfaBONGO! (−0,6)  → kein Triplet → verstummt · nicht gewandert
14:05  MiB-Einsatz (Auslöser: <Georgs Regel>) · HUMBUG! → farmer_b  → gelöscht: frizzlebob_s_mission_control #4
       Umstehend: skeleton_rogue (rebellisch) → merkt sich die Karte · toy_soldier (angepasst) → erzählt sie nicht weiter
─────────────────────────────────────────────────────────────
Tagesbilanz: 6 Erzählungen · BINGO 2 · BOGGLE 1 · BONGO 1 · Blödsinn 1 · HUMBUG 1 · 2 Karten gewandert · 1 gelöscht
Blasen: {lorekeeper, farmer_b} teilen 9 Karten · Überzeuger: lorekeeper 2/3
```

**Ausgabe:** `docs/ws-npc/tratsch/protokoll_<seed>.md` plus `kennzahlen_<seed>.json`.

**Aufstellung für Stufe 0:**
- Decks laut Signatur-Liste.
- Wo dort nichts steht (Bots), und für Arten bzw. Starter-Sets: per Seed. Ausdrücklich markiert als **„SIM, keine Kanon-Zuordnung“**, in einer eigenen Datei. Nichts davon geht ins Spiel.
- Zwei Läufe zum Vergleich: Rückfall a (Kartentext roh) und b (Schweigen).

---

## 7 · Prüfkriterien

Messbar, je Lauf in `kennzahlen.json`.

| # | Kriterium | Messung | Vorschlag Ziel (Stellwert für Georg) |
|---|---|---|---|
| T1 | Determinismus | gleicher Seed und gleiche Eingaben ergeben ein bytegleiches Protokoll (sha256) | 100 % |
| T2 | Tempo | übernommene Karten je Figur und Spieltag | 0,5–2 |
| T3 | Blasen | Modularität Q des BINGO-Graphen nach 10 Tagen; Anteil Übernahmen über Blasengrenzen | Q ≥ 0,3 und quer ≥ 5 % |
| T4 | Kein Spam | Erzählungen je Begegnung; dieselbe Karte an denselben Hörer; dieselbe Karte je Erzähler und Tag | ≤ 1 (+ 1 Nachlegen) · 0 nach Blödsinn! · ≤ 2 |
| T5 | Lesbarkeit der Blase | Zeichen und Wörter; Standzeit | ≤ 140 Zeichen bzw. ≤ 24 Wörter (alle 867 Triplets erfüllen das, Lore zu 95,5 %); Standzeit ≥ Wörter / 3 s |
| T6 | Kartentreue | jede Blase ist Triplet aus dem gepinnten Set oder wörtlicher Kartentext bzw. Lore | 100 % |
| T7 | Herkunft | jede übernommene Karte hat from, chain (≤ 3), Deck, Autor, Werk | 100 % |
| T8 | Muster erkennbar | Anteil der Calls, die ohne Zufallsanteil gleich ausfielen | ≥ 70 % |
| T9 | Call-Mischung | Anteile BINGO / BOGGLE / BONGO / Blödsinn je 10 Tage | jeder Call kommt vor; keiner > 60 % |
| T10 | Kosten | Rechenzeit je Austausch; Spielstand-Größe nach 30 Tagen | ≤ 0,2 ms; ≤ 64 KB; keine Arbeit je Bild |
| T11 | Lesbarkeit des Protokolls | Georg liest ein Protokoll über 10 Tage | Georgs Urteil |

Die Zielwerte sind Vorschläge. Georg stellt sie nach dem ersten Protokoll ein.

---

## 8 · Spielstand: Bedarf an kfb.world-save/2

Das Schema gehört dem Lead.

```
cards: {
  v: 1,
  known:    [ { f: figureId, c: "deckIdx:n", from: figureId|"player"|"start", chain: [figureId ≤3], day, via: "b"|"bb"|"ob", k: 0..3 } ],
  rejected: [ { f, c, from } ],
  wiped:    [ { f, c, day } ],        // HUMBUG (MiB)
  heard:    [ { f, c, n } ]           // „gehört von verschiedenen“, für rep(); gedeckelt
}
```

- **Starter-Sets werden nicht gespeichert.** Sie folgen aus Zuordnung und Seed. Gespeichert werden nur Abweichungen.
- **Ketten told-of-told:** `chain` mit bis zu 3 Gliedern. Das ist die Erweiterung gegenüber `/1`.
- **Kappen** (Vorschlag):

  | Bereich | Je Figur | Gesamt |
  |---|---|---|
  | known | 128 | 2048 |
  | rejected | 64 | — |
  | wiped | 32 | — |
  | heard | 64 | — |

  Das sind ≤ 64 KB nach 30 Tagen; Prüfung über T10.
- Beziehung und Status werden abgeleitet. Nur IDs, kein Freitext.
- Ereignis-Gerüchte aus D2 bleiben in `npc.receipts`.

---

## 9 · Offene Entscheidungen (Georg bzw. WS0)

1. **Signatur-Decks ins Register:** Die bestätigte Liste aus §2.3 ist im Register noch `todo`.
   - Übernimmt WS0 sie?
   - Gelten Einträge mit Grundlage `VORSCHLAG` (z. B. die Skelette) schon?
   - Welches Deck haben die Kayfabrick-Bots? In der Liste stehen sie nicht.
   - the_uruk_rumble (Orc Brute) hat in `cards.json` keine Karten.
2. **Starter-Set:** a) erste 6, b) per Seed, c) kuratiert?
3. **Rückfall ohne Triplet:**
   - a) Kartentext roh (S5b-Stand, BONGO-anfällig)
   - b) Schweigen (Empfehlung Song Workshop)
   - Mit b) tratscht heute nur der Lorekeeper, bis weitere Sets fertig sind.
4. **Triplet-Sets:** Keines ist abgenickt. Wird je Set abgenommen, und gilt dabei die 90-%-Regel als Kriterium? Bis dahin im Spiel nur mit Vorschalter.
5. **Blödsinn!:** im Tratsch „abgelehnt“ (Georgs Vision) statt „Regel gebrochen“ (v18-4)?
6. **HUMBUG!:**
   - Gilt die Lesart „Blitzdingsen = löschen“ (V-530)?
   - Was löst einen MiB-Einsatz im Tratsch aus? Z. B. eine Karte, die sich zu schnell verbreitet, oder Karten bestimmter Decks. Ich erfinde keinen Auslöser.
   - Wirkt er gegenläufig auf Umstehende (Streisand)?
   - Darf auch der Spieler HUMBUG rufen?
7. **KafKaBONDO!** (Epistemic Sabotage S. 6): Bedeutung? Nirgends belegt.
   - **KayfaBIZARRO!**: im Tratsch ein Ausruf (z. B. FrizzleBob als Zuhörer), oder ohne Funktion?
8. **Art je Figur** (Tratschmaul, Skeptiker, Übertreiber, Schweiger, angepasst, rebellisch): aus den Figurenblättern (personality meist `todo`) oder durch Georg bzw. WS0?
9. **Wer tratscht:** Bewohner, Gruppen (Skelette, Soldaten, Bots), Band? Vorschlag: alle mit Register-ID; Gruppen nach außen nur über Begegnungen.
10. **Spieler-Calls:** Zählt ein BINGO des Spielers wie eine Stimme oder als Statusschub für den Erzähler?

---

## 10 · Abstimmungen

| Mit | Stand |
|---|---|
| Deck-Songs | Antwort 23.10. eingearbeitet (§2.2, §2.4). |
| Song Workshop | Antwort 23.10. eingearbeitet (§2.2, §2.3, §3.1). Die Triplet-Sets gehören jetzt der frischen Song-Sitzung bzw. WSA. |
| WS-Audio | Ab Stufe 2 Ereignisse wie greet: `{ type: 'tratsch', id, characterId, card, call, at, t }` und `mib_humbug`. Abstimmung mit Stufe 2. |
| Lead | Schema `/2` (§8), Abnahme-Seite für das Protokoll, Fragen §9 an Georg bzw. WS0. |
