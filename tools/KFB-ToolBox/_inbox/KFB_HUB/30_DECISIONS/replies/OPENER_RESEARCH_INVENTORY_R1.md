# OPENER_RESEARCH_INVENTORY_R1

Stand 14.10.2026. Anlass V-218: Georg findet den Pool zu dünn und klischeehaft. Das hier ist eine reine Inventur, ohne neuen Opener-Text. Erstellt vom Inventur-Agenten der Steuerung, abgelegt von WS0.

## 0 · Kurzfazit
- **Es gibt deutlich mehr Recherche, als im Pool steckt.**
- **Hauptquelle** ist das Perplexity-Doc „KFB Modular Storytelling Research: Openers, Fourth-Wall Sockets & Bridge-Free Beats“ (Drive, 13.10.). Es enthält 43 Operatoren (25 OP, 10 UP, 8 FW) und 8 Beat-Grammatiken (BG-1–8).
- **Woher der 14er-Pool kommt:** fast nur aus dem Grok-Memo (6 Runtime-Opener, 6 vorgeschlagene). HAVE_YOU_HEARD und EVER_HEARD_BEFORE sind Test-Einträge aus dem WSA-Hot-Reload-Test, keine Recherche.
- **Was davon im Pool fehlt:** **kein** Uptake- und **kein** Fourth-Wall-Operator, **keine** Beat-Grammatik.
- **NotebookLM:** Die Inhalte wurden nie gelesen. Über Drive sind sie nicht zugänglich.
- **Grok-Memo:** liegt nicht im Original vor (im Repo `originalTextStoredVerbatim: false`).
- **TV Tropes:** nur als Deck-Format (Worlds Fair, Fun & Gag) und als Komik-Theorie (NIE). Eine Zuordnung von Tropes zu Openern gibt es nirgends.
- **Ort- und Situations-Opener:** nur als Ansätze (OP-12, OP-13, OP-23, BG-6, BG-7, RULE1-HOOK). Es gibt keine Sammlung je Karte.
- **„Did you hear of …“:** steht in keiner Quelle.

## 1 · Suchprotokoll (kurz)
- **Repo:** PR #379 (`4f71423`), Ordner `skills/chat/workflows/KFB_CHATTERBOX_VOICE_V1_2026-10-08/` mit 127 Dateien, das ist der Hauptfundort. Außerdem #365, #394, #355, #354, main sowie die Branches curator, ensemble01b und gamelab, dort nur Dateinamen und gezielte Lektüre. Lücke: Der Klon ist partiell; ein Volltext über alle 378 PR-Refs war nicht möglich.
- **Lokal:** KFB_HUB; der NIE-Ordner mit 608 md-Dateien, darin Komik-Dateien gelesen; Downloads (M95 Comedy, Worlds Fair TVTropes Kompendium, fun_gag_tropes). Vier Trope-PDFs ohne Textlayer waren nicht lesbar.
- **Google Drive:**
  - Perplexity-Doc `1w9dRLIK…` vollständig gelesen.
  - Fun & Gag Tropes und Worlds Fair TVTropes gelesen.
  - „GPT Instructions for Humor, Satire, and Jokes“ und „Storytelling & Jokes“ (2013) gelesen.
  - Gefunden, aber nicht gelesen: „Workshop: Writing Unique, Satirical Comedy With ChatGPT“, „FrizzleBob Satirical Writing Guide“, „NotebookLM – Satirical Podcast Instruction Sheet“, „Develop Character Personality“.
- **Nicht zugänglich:** das NotebookLM-Notebook selbst, das Grok-Original, die Trope-Bild-PDFs, die 22 Belegquellen im Perplexity-Doc (ungeprüft).

Abkürzungen:
- V = `skills/chat/workflows/KFB_CHATTERBOX_VOICE_V1_2026-10-08/` @ PR #379 `4f71423`
- P43 = V/`data/KFB_PERPLEXITY_MODULAR_STORYTELLING_43_OPERATOR_RESEARCH_CATALOG_R1_2026-10-13.json`
- GDOC = Drive-Doc `1w9dRLIK5rnO1nnv8K3VVxd4i8k2eWat0-YG9gzZwUuc`
- GROK = V/`KFB_GROK_STANDUP_OPENERS_CUT_SPIN_TRIAGE_R1_2026-10-13.md`
- CUR = V/`data/KFB_STANDUP_OPENER_CUT_SPIN_CURATED_CANDIDATES_R1_2026-10-13.json`
- TRI = V/`KFB_MODULAR_STORYTELLING_RESEARCH_SOURCE_TRIAGE_AND_WORLDVIEW_ADAPTER_R1_2026-10-13.md`
- ASM = V/`tools/assemble_standalone_card_beats_r1.cjs`
- RULE1 = V/`RULE1_SUNO_HOOK_PUNCHLINE_CONTRACT_R0_2_2026-10-12.md`
- NIE-C / NIE-H = NIE `genre/comedy_satire_craft.md` / `comedy_satire_humor_mechanics.md`
- TIPS = `media/prompts/KAYFABE_TIPS_corpus_v1.md` @ main

## 2 · Katalog der recherchierten Formen
Status „Quelle“ = Urteil des Quellenautors (KEEP/TUNE), **kein Georg-Urteil**. Alle P43-Records sind `UNREVIEWED_RESEARCH_CANDIDATE`, `runtimeEnabled:false`.

### 2.1 Perplexity-Operatoren (P43 / GDOC B)

**Familie 1 · Audience-Recognition**

| ID | Muster | Beispiel | Status |
|---|---|---|---|
| OP-01 | Do you know [subject]? | Do you know the Cookie of Causality? | KEEP · MVP-10 · im Pool |
| OP-02 | Ever heard of [subject]? | Ever heard of a home at the bottom of an abyss? | KEEP · im Pool |
| OP-03 | Have you ever [experience]? | Have you ever been promised safety? | TUNE |
| OP-04 | You look like someone who [assumption]. | You look like someone who collects bad ideas. | TUNE, Risiko |
| OP-05 | You, with the [object/action]. | You, with the Card still in your hand. | KEEP · live |

**Familie 2 · Curiosity und Revelation**

| ID | Muster | Beispiel | Status |
|---|---|---|---|
| OP-06 | Let me tell you about [subject]. | Let me tell you about the Abyss Home. | KEEP · MVP-10 · im Pool |
| OP-07 | Here's something nobody asked for. | … the damage stays. | KEEP |
| OP-08 | This one has a rule. | … restart the fight, keep the damage. | KEEP · MVP-10 |
| OP-09 | The official explanation is [X]. | … that the home is safe. | KEEP · Next-4 |
| OP-10 | Nobody warned us about [X]. | … the almost. | TUNE |

**Familie 3 · Personal Story** (nur mit freigegebener Biografie oder markierter Fiktion)

| ID | Muster | Beispiel | Status |
|---|---|---|---|
| OP-11 | I once met [person]. | I once met a Resident who collected alarms. | TUNE · im Pool |
| OP-12 | The other day, [event]. | The other day, I tried to leave a safe place. | TUNE |
| OP-13 | I went to [place]. | I went to the bottom of the Abyss. | TUNE · **einzige reine Orts-Form** |
| OP-14 | I used to believe [claim]. | I used to believe safety meant nothing happened. | KEEP |

**Familie 4 · Premise und Expectation**

| ID | Muster | Beispiel | Status |
|---|---|---|---|
| OP-15 | The thing about [X] is… | … almost ending is that it can continue. | KEEP |
| OP-16 | You would think [expectation]. | … an abyss home would be dangerous. | KEEP · MVP-10 · Enthymem |
| OP-17 | Everyone agrees that [X]. | … alarms mean safety. | TUNE |
| OP-18 | There are two kinds of people: [A] and [B]. | … restart conflicts / keep the damage. | TUNE |
| OP-19 | This is not a metaphor. Unfortunately. | … The damage remains. | KEEP |

**Familie 5 · Reset, Pivot, Pause** (Set-Ebene)

| ID | Muster | Status |
|---|---|---|
| OP-20 | Anyway. | KEEP · MVP-10 |
| OP-21 | Before we continue… | KEEP |
| OP-22 | Which brings us to… | KEEP |
| OP-23 | Meanwhile, elsewhere… | KEEP · Next-4 |
| OP-24 | No — wait. | KEEP |
| OP-25 | [beat] … [silence] | KEEP · MVP-10 |

**Familie 6 · Uptake und Retort** (Kern für „Spieler plus Dialogpartner“)

| ID | Muster | Beispiel | Status |
|---|---|---|---|
| UP-01 | You said ‘[word].’ | You said ‘safe.’ | KEEP · MVP-10 |
| UP-02 | You call that [X]? | You call that safety? | KEEP · MVP-10 |
| UP-03 | Exactly. And if [claim], then… | … alarms renew, then safety renews too. | KEEP · MVP-10 |
| UP-04 | That is not [X]. That is [Y]. | That is not safety. That is storage. | KEEP · Next-4 |
| UP-05 | Fair. But… | … the damage did not ask permission. | KEEP |
| UP-06 | No. + neue Prämisse | No. The Cookie does not negotiate. | KEEP |
| UP-07 | So what you mean is [distortion]. | … keep hitting it until it becomes history. | TUNE |
| UP-08 | [Repeated key term]? | ‘Almost’? | KEEP |
| UP-09 | [looks at player] … | Blick auf die Karte, Pause | KEEP · live |
| UP-10 | And then it gets worse. | And then the alarm renews. | KEEP |

**Familie 7 · Fourth Wall und Player Address**

| ID | Muster | Beispiel | Status |
|---|---|---|---|
| FW-01 | You played [Card]. | You played the Cookie. | KEEP · MVP-10 |
| FW-02 | You wanted [expectation]. | You wanted a clean restart. | KEEP |
| FW-03 | This Card is doing [rule] whether you like it or not. | … keeping the damage … | KEEP |
| FW-04 | Agree, or tell me why not. | … why the abyss is not home. | KEEP · Next-4 |
| FW-05 | I am performing a Card. The Card does not care. | … The Cookie does not care. | KEEP |
| FW-06 | You know something I do not. | You know what you selected … | TUNE |
| FW-07 | Reading this out of order? Good. | … So is the abyss. | KEEP |
| FW-08 | The deck says [rule]. | The deck says the fight restarts. | KEEP |

### 2.2 Beat-Grammatiken (nur GDOC C, nicht im Repo-JSON)
- **BG-1** Opener → Source Material → Consequence
- **BG-2** Question → Source-Based Answer
- **BG-3** Premise → Unexpected but Sourced Result
- **BG-4** Source Detail → Contradiction
- **BG-5** Audience Remark → Character-Specific Reinterpretation
- **BG-6** Situation → Changed Stakes
- **BG-7** Show It → Spin It → Sell It
- **BG-8** Assertion → Silence → Changed Implication

Dazu aus GDOC D die Player Interruption Patterns: Heckle challenge, Objection, Category correction, Frame change, Silence bait, Asymmetric knowledge, Two-character debate. Und der Debatten-Operator: Source proposition → Worldview interpretation → Counterparty uptake → Changed premise.

### 2.3 Grok-Memo, wie im Repo triagiert (GROK / CUR)
- **KEEP:** Do you know / Ever heard of / rhetorische Fragen.
- **Mit Bedingung:** Ever tasted nur mit Food-Gate. Brief premise KEEP/TUNE. I once met und Restaurant nur als ausdrückliche Bühnenfiktion.
- **Set-Regie:** Anyway / Speaking of / Denkpause.
- **Wenn in der Quelle:** Misdirection.
- **Optional:** SREP, Rule of Three, Callback.
- **Nur als Metadaten:** Act-outs.
- **Blockiert:** Crowd Work.
- **Cut:** „guaranteed laugh“, Auto-Tags, Wut-Eskalation.
- **Laufzeit-Regel (ASM Z. 258–261):** Bei Deck-Automatik sind nur DIRECT, HEARD_OF und DO_YOU_KNOW erlaubt. Die drei 56er-Sets nutzen fast nur DIRECT.

### 2.4 RULE1 Hook-Familien (Suno-Stand-up)
- **Familien:** HOOK („the performer wants something and something visible is wrong“), SUBJECT, CONNECTOR_CONFLICT, REFRAME, PUNCHLINE, CALLBACK, SILENCE/ACTION. Der Hook kommt in den ersten 0–5 s.
- **Postmortem Clown:** Die Prämisse war das Problem, nicht die Labels. Eine Prämisse braucht einen konkreten Wunsch, eine beobachtete Situation, ein Requisit und eine Handlung.

### 2.5 KFB-Erzählregeln (TIPS @ main)
- Therefore/But statt and-then.
- Yes, and.
- People, not props.
- „The weirder the card, the straighter your face.“
- **„One real picture beats ten big ideas.“** Das stützt Georgs Ort/Bild-Notiz.
- Der Tell-Frame „I am [actor], and [s1], but [s2], therefore [s3], so in the end [quest].“
- Improv: Endowment, Heighten don't widen, Specificity, Callback.

### 2.6 Stand-up-Strukturen (NIE)
- **Witz-Bau:** Setup → Build → Punch → Tag. Die 3-Sekunden-Regel.
- **Zwei Sprecher:** A Setup / B falsche Antwort / A Punch.
- **Techniken:** Anekdote, Beobachtung, Timing, direkte Ansprache, Eskalation. Stand-up Structure Design in 7 Schritten. Recognition, Reversal, Self-Deprecation. Manzai (Boke/Tsukkomi) und Rakugo.
- **Anti-Patterns:** Meta-Kommentar, AI-Symmetrie, Callback-Abhängigkeit, Erklären.

### 2.7 Improv-Deck (main)
- Karten mit Opener-Bezug: #7 Spontaneous Spark, #8 Reincorporation, #6 Sudden Tilt, #21–24 Status, #41 Questions Only, #43 Genre Shift, #44 Blind Line, #46 Space Jump, #49 Objection (Yes, But…).
- Die Fehlformen #9–20 eignen sich als Negativliste.

### 2.8 Ältere Komik-Docs (Drive)
- **„GPT Instructions for Humor …“:** listet überstrapazierte Templates als Anti-Pattern auf, darunter „What's the deal with X?“, „X is just like Y, except…“ und „First time?“. Positiv: Understatement und absurde Ideen mit extremem Ernst vortragen.
- **„Storytelling & Jokes“ (2013):** vertraute Setups, Good News/Bad News, Dreiergruppe, Pointe am Ende, Story Spine.

## 3 · TV Tropes
- **NIE:** Rule of Funny, Toon Physics, Amusing Injuries, Crosses the Line Twice, Running Gag u. a. Gedacht als Diagnose, **nicht** als Opener.
- **Worlds Fair TVTropes Kompendium und Fun & Gag Tropes:** Deck-Inhalte im Trope-Format. Kein Opener-Bezug.
- **PR #379 RETURN Z. 336:** Ein Clown-Take, der auf Allerwelts-Tropes beruht, bekam TUNE (Negativbeispiel).
- **Ergebnis:** Keine zugängliche Quelle ordnet Tropes Openern zu.

## 4 · Vergleich mit dem 14er-Pool
- **„heard of“-Cluster, 5 von 14:** HEARD_OF, ANYONE_HEARD_OF, QUICK_QUESTION, HAVE_YOU_HEARD, EVER_HEARD_BEFORE. Das ist eine einzige Form, OP-02. Zur Recognition-Familie gehören insgesamt 7 von 14.
- **Alle 14 haben nur den Slot `{title}`.** Keiner hat einen Slot für Ort, Situation, Erwartung, Regel oder das Wort des Vorredners.
- **Was fehlt:**
  - Revelation (OP-07–10) und Premise (OP-15–19);
  - die gesamte Uptake-Familie (UP-01–10) und die gesamte Fourth-Wall-Familie (FW-01–08);
  - Reset/Pivot (OP-20–25);
  - die Beat-Grammatiken BG-1–8;
  - RULE1-HOOK;
  - die Laufzeit-Regeln mit Cooldown (drei direkte Ansprachen hintereinander = Fehler).
- **Georgs Notizen gegen den Befund:**
  - Ort/Bild: nur Ansätze (OP-12, OP-13, OP-23, BG-6, BG-7, RULE1-HOOK, TIPS 5), keine Ortsliste je Karte.
  - „Did you hear of …“: in keiner Quelle. Für den Partner passen UP-01–10, BG-5 und GDOC D „Two-character debate“.
  - Kartenkontext für Beats: gestützt durch GROK, TRI und BG-1–8.
- **Vorschlag (Struktur):** Slot-Typen über `{title}` hinaus (Ort, Erwartung, Regel, Vorredner-Wort), jeder mit Quellen-Pflicht. Der Cluster wird zu einer Grundform plus Uptake-Antwort des Partners.

## 5 · Lücken und Fragen an Georg
1. **NotebookLM:** Notizen und Chats exportieren, falls dort Opener- bzw. Stand-up-Material liegt. Der Recherche- und Berichts-Prompt dafür ist bereitgestellt.
2. **Grok-Memo:** Liegt das Original (deutsches Stand-up/Improv-Memo, englische „Modular Knowledge Base“) noch irgendwo?
3. **TV Tropes:** Gab es eine eigene Trope-Liste für Opener? Gefunden wurden nur Decks und Bild-PDFs ohne Text.
4. **Orte:** Dürfen NPCs Orts-Szenen frei erfinden („I went to …“), oder nur Orte, die auf der Karte stehen?
5. **„heard of“-Cluster:** Sollen die Varianten zu einer Grundform „Did you hear of …“ plus Partner-Uptake zusammengelegt werden?
