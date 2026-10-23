> **Aufgegangen in `SSOT_SPOKEN_LINES/README.md` (R1, 24.10.2026).** Dieses Dokument bleibt als Herleitung; verbindlich ist das Modul.

# Baukasten · gesprochene Kartenzeilen (Chatterbox, Triplets, Songs) · SSOT-Vorschlag R1 · 23.10.2026
**R1.2 (24.10.):** §2.2 kein Doppelpunkt hinter dem Titel, Titel steht im Satz; §2.2b keine Satzschablone über das Deck (Georg 24.10.). Folge: Die t4-Songs (BBBW, Protopia, Bullshit Jobs, Jung and Shinn) enthalten noch „Titel: …“-Stellen und werden im Tune danach bereinigt.
**R1.1 (23.10.):** §2.3 „Telegramm-Takte“ ersetzt durch „ganze Sätze mit Flow, keine Fragmente“ (Georg zu den Tratsch-Triplets).
**Status:** Vorschlag an WS0 als gemeinsame Quelle für alles, was Karten spricht. Grundlage sind Georgs Urteile vom 21.–23.10. Referenz ist BBBW t4 (Georg 23.10.: „das passt, mit Tune später“).
**Gilt für:**
- Chatterbox und Karten-Tratsch (einzelne Beats, Dialog);
- Triplet-Sets (je Deck);
- Deck-Songs (Suno).

**Ersetzt nichts stillschweigend:** `TRIPLET_SET_SPEC_R2.md`, `SONG_SPEC_R4.md` und `OPENER_ARC_MODEL_R1.md` gelten weiter. Wo dieses Dokument von ihnen abweicht, steht es in §6 als Auftrag an WS0.
**Warum es das braucht:** siehe `SONGS_WORKSHOP_R1/POSTMORTEM_OPENER_TRIPLET_R2.md`. Dieselben Fehler sind in WS0, WSA und im Song-Workshop mehrfach passiert.

---

## 1 · Fünf Schichten
Jede gesprochene Kartenzeile wird aus Schichten gebaut. Jede Schicht hat genau eine Aufgabe. Fehler entstehen, wenn eine Schicht die Aufgabe einer anderen übernimmt oder fehlt.

| # | Schicht | Aufgabe | Wer schreibt | Quelle der Wörter |
|---|---|---|---|---|
| 1 | **Karte** | Wahrheit: Titel, Power, Lore, Bild | niemand, nur lesen | **Druck** (gedrucktes PDF); Kartendaten `media/kfb @52adc8f1` (V-242) |
| 2 | **Triplet** | die Aussage der Karte: Behauptung und Pointe | Writer | nur Kartenwörter plus Grammatik |
| 3 | **Opener** | bettet die Aussage in eine Sprechhandlung ein: Gerücht, Frage, Theorie, Begegnung, Beobachtung | Writer bzw. Laufzeit aus dem Pool | Opener-Pool (§3) |
| 4 | **Verbindung** | macht aus Zeilen einen Fluss: Uptake, Kontrast, deshalb/aber, Callback | Writer (Song) bzw. Dialog-Engine (Tratsch) | das Wort der Vorzeile, Kartenlogik |
| 5 | **Rahmen** | Anfang und Ende: Decktitel und These, Schluss | Writer | gedrucktes Deck-Material |

## 2 · Schicht 2: das Triplet (je Karte eine feste Aussage)
1. **Ein Satz mit Aussage, nicht vorgelesen.** Den Lore-Text nicht der Reihe nach abschreiben. Die Karte behauptet etwas über sich (show it, spin it, sell it).
2. **Der Titel steht im Satz, nie als Etikett.** **Kein Doppelpunkt hinter dem Titel** und keine Label-Struktur („Escape Sequence: …“, „Broken Bridge: …“). Das klingt in Suno nicht und führt zu FAILs (Georg 24.10., „schon 100-mal gesagt“). Der Titel ist Subjekt, Objekt oder Ort im Satz: „Escape Sequence runs you away from danger …“, „At the Broken Bridge you cannot pass …“, „Find an exit to The Maze? Spoilers, there is no outside.“ Normale Schreibweise, eigener Artikel, keine Klammern.
2b. **Keine Satzschablone über das Deck.** Die Satzform kommt aus der Karte: Befehl, Frage, Behauptung, Titel vorn, in der Mitte oder hinten. Über ein Deck wechseln die Formen. Kurz, prägnant, Comic-Stil, Weglassungen erwünscht, aber mit Flow, der auch in Suno trägt.
3. **Ganze Sätze mit Flow, keine Fragmente** (Georg 23.10. zu den Tratsch-Triplets: „die alten Fragmente, keine Sätze, kein Flow“). Keine Komma-Ketten aus Stichworten („shuffle, redraw, minus one“), keine Partizip-Reste („victory moved back“). Verdichtet wird durch Weglassen ganzer Satzteile, nicht durch Telegrammstil. (Eine feste Satzform über alle Karten ist wieder eine Schablone, siehe 2b; Beispiel: „Find an exit to The Maze? Spoilers, there is no outside.“)
4. **Die Pointe der Karte steht am Ende** und kommt von der Karte („A slave to approval.“, „Strength? No, gullibility.“).
5. **Nur Kartenwörter plus Grammatik**, höchstens ein Fluff-o-lect-Wort. Mechanik nur als Bild. Spielbegriffe, Würfelwerte, Ziffern und Sonderzeichen fallen weg oder werden ausgeschrieben.
6. **Muss allein als Satz funktionieren.** Prüffrage: Versteht jemand ohne Karte, wer was tut? Fragmente wie „The Lazy Genius, hands in pockets: the apathy makes them furious.“ funktionieren nicht ohne Einbettung (Schicht 3).
7. **Druck schlägt JSON.** Kartennummern und Wortlaut nach dem Druck; Abweichungen je Deck notieren.

## 3 · Schicht 3: der Opener (Einbettung)
**Kern (Georg 23.10.):** Der Opener ist ein **Stand-up-Opener, der den Karteninhalt einbettet**. Opener und Karte bilden **einen** Satz bzw. Sprechakt. Er ist keine Vorsilbe aus zwei losen Wörtern und keine Nebenhandlung davor.

| richtig (einbetten) | falsch |
|---|---|
| *Ever notice how The Babyface uses high-flying moves because audiences cheer for that? A slave to approval.* | zwei lose Wörter: *Badger unplugged: The …*, *Sister yawns: The …* |
| *Rumor has it The Jobber exists to make the other guy look good. Only control: who defeats you.* | eigener Erzählsatz davor: *So I stay in bed all day: The Lazy Genius, …* (Ballast) |
| *What if The Finger Poke was a test of strength? No, a test of gullibility.* | Pool-Phrase im Takt jeder dritten Zeile (*Remember … You know … What if …*) |
| *I once met The Master Seller: reel back, limp to the ring, make them believe. I believed.* | Klischee-Register: Büro, HR, Chef, Praktikant |

**Haltungen** (Stand-up, Georg 23.10.):
- Gerücht und Klatsch;
- Begegnung;
- Fundstück;
- Frage;
- wilde Theorie bzw. Spekulation über die Bedeutung;
- Behauptung;
- Beobachtung;
- Erwiderung (Uptake);
- Ansprache;
- Rückruf;
- Zweifel/Wende;
- Steigerung;
- Meta;
- Szenenwechsel.

Frage und Behauptung wechseln sich ab.

**Satzbau** je Opener:
- `into_title` läuft direkt in den Titel: „Did you hear about The …?“
- `own_clause` ist ein kurzer eigener Satz mit Punkt oder Komma (nie Doppelpunkt), dann folgt die Karte: „My diary says so. The …“
- `interjection` ist ein Einwurf: „Anyway, The …“

**Regeln:**
- Kein Opener zweimal pro Song bzw. Dialog. Familienabstand ≥ 10.
- Der Opener passt zur Karte: „I once met“ nur vor Figuren, „Ever tasted“ nur vor Essbarem, „I found a“ nur vor Objekten.
- Absurd und surreal statt Klischee.
- Keine Witze aus Wissen, das der Hörer nicht hat (Asset-Details, Texturen, Wechselköpfe).
- Things don't act (C13a). Figuren und Karten handeln.

**Pool:** `SONGS_WORKSHOP_R1/OPENER_POOL_BY_STANCE_R1.json` (Schema `kfb.opener-pool.stance/1`, 105 Einträge). Nur Status POOL ist freigegeben. Erweiterung aus Georgs NotebookLM und den Docs übernimmt WS0 (Status §26).

## 4 · Schicht 4: die Verbindung (Song und Dialog)
- **Uptake:** Die nächste Zeile greift das letzte Wort oder Bild auf.
  - „…who defeats you.“ → „Who defeats you? Usually The Immovable Object…“
  - „…makes them furious.“ → „Furious people are easy prey for The Exotic…“
- **Kontrast, Folge, Umkehr** aus dem Kartensinn (KayfabeTip 1: therefore/but, nie „and then“). Die Kette ergibt sich aus der Logik des Decks: was eine Karte auslöst, widerlegt oder umdreht. Sie entsteht nicht aus Requisiten-Assoziationen.
- **Callbacks:** Das Deck hat oft eigene, z. B. dieselbe Lore auf zwei Karten oder derselbe Name. Erst die nutzen, dann eigene.
- **Keine erzwungene Storyline.** Ein durchgehender Erzählfaden ist möglich, aber kein Muss. Für Chatterbox und Tratsch gibt es ausdrücklich keinen Faden.

## 5 · Anwendung je Format
| | Chatterbox / Karten-Tratsch | Triplet-Set | Deck-Song |
|---|---|---|---|
| Karten | einzeln, je Beat | alle Karten des Decks | **Best-of** (≈ 40–45 bei 56 Karten), nie die ersten N |
| Schicht 2 Triplet | fest je Karte | fest je Karte | fest je Karte |
| Schicht 3 Opener | **zur Laufzeit** aus dem Pool, rotierend, Sperrzeit, Haltung passend zum Moment | optional (Basis ohne) | **jede Karte** eingebettet |
| Schicht 4 Verbindung | Dialog-Uptake (Erwiderung), BINGO/BOGGLE/Blödsinn | – | Uptake-Kette über den Track |
| Schicht 5 Rahmen | – | Intro und Outro gedruckt | Intro = Decktitel + These; Outro gedruckt oder als Callback; „Stay Fluffy, Folks!“ |
| Kartentext-Anteil | Triplet 100 % Karte | ≥ 90 % | ≈ 70–80 % (Opener kosten Wörter) |
| Länge | ≤ 140 Zeichen je Blase (WS-NPC T5) | < 5000 Zeichen | < 5000 Zeichen |

**Rückfall im Tratsch (Georg 23.10., Entscheidung b):** Hat eine Karte noch kein abgenommenes Triplet, sagt die Figur **Titel + gedruckte Lore wörtlich**, mit Opener aus dem POOL davor; im Protokoll als „roh“ markiert. **Die Power wird nie gesprochen** (Regelmechanik).

## 6 · Aufträge an WS0 (Spec- und Gate-Abgleich)
1. **Diesen Baukasten als SSOT übernehmen.** `TRIPLET_SET_SPEC_R2`, `SONG_SPEC_R4` und `OPENER_ARC_MODEL_R1` darauf verweisen lassen statt Regeln zu duplizieren.
2. **`triplet_set_check.py`, Titelprüfung:** Level- und Mode-Präfixe („Lvl 1:“, „Mode 3:“), Untertitel nach „–“ und Klammerzusätze nicht verlangen (Georg 21.10.: nichts vor die Zeilen, was den Flow killt). Ausgeschriebene Zahlen und Zeichen („Eight and a Half“, „and“, „versus“) als A7-Schreibweise zulassen.
3. **Opener-Schicht prüfbar machen**, als Hygiene, nicht als Qualitätsbeweis:
   - kein Opener doppelt;
   - Satzbau vorhanden;
   - keine zwei Zeilen hintereinander mit derselben Haltung;
   - Warnung bei Opener ohne Verb und unter 3 Wörtern (das Muster mit zwei losen Wörtern).
4. **Großer Opener- und Routinen-Pool** aus NotebookLM und den Docs (Status §26) ins Schema `kfb.opener-pool.stance/1`.
5. **Registry gegen Druck:**
   - BBBW 50/51 und Anti-Rules 51–56 sind im Song-Klon korrigiert.
   - Brain Flipper #59 fehlt in den Kartendaten.
   - Bei Ego Mania und Mission Control zeigt das PDF ab #37 andere Karten.
6. **Batch 1 (15 Decks, t1):** pragmatisch als Basis übernommen (Georg 23.10.). Die Überarbeitung nach diesem Baukasten erfolgt deckweise, erst nach Georgs Tune an BBBW t4.
7. **Gate-PASS ist kein Qualitätsstatus.** Flow, Einbettung und Witz prüft nur Georgs Ohr bzw. eine Zweitmeinung.

## 7 · Quellen
- Georg im Song-Workshop-Chat, 21.–23.10.2026; Writers' Room Lessons l12–l18.
- `TRIPLET_SET_SPEC_R2.md` (Goldens), `TRIPLET_METHOD_FROM_WRINKLE_R1.md`, `TRIPLET_CLOSURE_CONTRACT_DRAFT_R1.md`.
- `OPENER_ARC_R1/OPENER_ARC_MODEL_R1.md`, `OPENER_RESEARCH_INVENTORY_R1.md` (Perplexity P43: OP/UP/FW, BG-1..8), `OPENER_ARC_R2/opener_pool_r2.py`.
- `SONGS_WORKSHOP_R1/MODULAR_COMEDY_RESEARCH_SUMMARY_R1.md` (NotebookLM).
- `media/prompts/KAYFABE_TIPS_corpus_v1.md` (main).
- Golden take05 (`OPENER_ARC_R2/epistemic_sabotage.take05.final.suno.txt`), Alice-Exemplar.
- Referenz BBBW t4: `SONGS_WORKSHOP_R1/big_bad_brain_wrestling/big_bad_brain_wrestling.t4.*`.
