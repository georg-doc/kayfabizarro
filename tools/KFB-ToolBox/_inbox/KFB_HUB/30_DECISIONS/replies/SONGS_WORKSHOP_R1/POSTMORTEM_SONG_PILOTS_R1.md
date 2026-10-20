# Post-Mortem · WS-Song Piloten R1 (r4a–r8a) · 21.10.2026
**An:** WS0 · **Von:** WS-Song (Claude-Code-Sitzung, Branch `ws-song/workshop-r1`) · **Anlass:** Georgs Urteil zu den Piloten r8a am 21.10.:

> „wieder ein total FAIL!!!! … ohne Sinn und Verstand, ohne Konzept und mentale Modelle, ohne Wortwitz und Intellekt, ohne Flow und Cadence, ohne Witz oder Esprit, ohne Menschlichkeit und Herzensbildung, ohne Humor und Sinn für Ironie, ohne Seele und Weltgeist, ohne Verständnis und Respekt für das Comic-Deck, ohne Storytelling und Dramaturgie, ohne Aussage und Intent, ohne Character Personality und World Building … einfach lazy und heuristisch whack-a-mole linguistic guesswork irgendwelchen AI slop vor die Karten gerotzt.“

**Ergebnis in einem Satz:** WS-Song hat in neun Fassungsrunden über zwei Tage keinen einzigen brauchbaren Songtext geliefert. Alle Fassungen haben das Gate bestanden; das Gate misst die Qualität, um die es geht, aber nicht. Keine Fassung geht zu Suno.

---

## 1 · Was gefordert war
Laut Brief `BRIEF_SONG_WORKSHOP_R1.md` (V-576) war ein Comic-Performance-Song je Deck gefordert, im Sinne von Georgs Vorbildern:
- `SONGS_BESTOF_R1/ALICE_USER_EXEMPLAR_2026-10-20.md`
- `OPENER_ARC_R2/epistemic_sabotage.take05.final.suno.txt`
- die Triplet-Goldens in `TRIPLET_SET_SPEC_R2.md`

Was zu einem solchen Song gehört:
- eine Figur mit Weltsicht, die ihr Deck performt;
- Karten, die als Charaktere ihre Behauptung verkaufen;
- verbunden durch Ursache, Widerspruch, Umkehr und Callback (KayfabeTip 1, „therefore/but, never and-then“);
- Wortwitz, Ironie und eine Aussage, die das Deck respektiert und zum Spielen mit Freunden einlädt.

## 2 · Verlauf (Fassungen und Georgs Urteile)
| Runde | Commit | Was WS-Song gebaut hat | Georgs Urteil |
|---|---|---|---|
| r4a | 2177f8f | Bühnen-/Stand-up-Rahmen („Good morning“, Pressesprecher) | Kein Publikum und keine Stand-up-Bühne; das Deck performt sein Bewohner im Diorama |
| r5a | 573a636 | Bewohner-Monologe; Tiere aus dem Kartenbild „leben“ ihre Karte | „übelster AI slop und object acting, Leerphrasen gerade am Ende“ |
| r5b | 10050c7–ea06b88 | Outro dreimal umgebaut | „zu lang und didaktisch“, „viel zu abstrakt“, Intro schwächer als die Karten |
| r6a | c5397ae | „Alice-Mechanik“; Combat Mech als Cockpit-Pilot | „falsche Richtung, funktioniert nicht im Game/Comic Motion“. Der Mech ist eine Figur im Kampfanzug und kein Cockpit; das Artwork war nicht angesehen worden |
| r6b/r6a | e31f6ef | Alice-Gerüst als Schablone über alle drei Decks (Analogie-Einstieg, „Congratulations“, „… of course“-Schluss, Pointe hinter jeder Karte) | „bemühtes Erklärbär-Pseudo-Satire-Cliché-Storytelling, AI-Slop-Phrasen und Scaffolding aus jeder Zeile“ |
| Vorschlag | – | Karten fast pur vorlesen | „sehr ärgerlicher Regress … zehnmal als FAIL-Richtung gebrieft“: kein Flow, keine Bridges, keine Callbacks |
| r7a | 8c95d16 | take05-Takt: Telegramm-Kartenzeilen, Mini-Opener (Click, SMACK!, THUD.) | „nein“: es fehlt plausible Cartoon-Kausalität (South Park) und die anekdotische Routine |
| r7b/r7a | 83c82e6, 141dd11 | Stand-up-Anekdote (Junge, Schwester, Hund …) | BBBW „gefällt mir schon ganz gut“; Metropolis/Protopia „viel zu viel eigene Bastelei“ |
| r8a | a239f9b | Dieselben Geschichten, Brücken auf 1–3 Wörter gekürzt | **„total FAIL“** (siehe oben) |

Daneben ist Infrastruktur entstanden, die Georg angenommen hat (§6). Gemessen an der eigentlichen Aufgabe, einem guten Songtext, war die Quote null.

## 3 · Ursachen (ehrlich, ohne Entlastung)
**3.1 Kein Verstehen vor dem Schreiben.**
- Für kein Deck wurde erarbeitet, was es sagt:
  - These und Satireziel;
  - die mentalen Modelle der Karten (bei BBBW: Kayfabe als Arbeitsteilung von Lüge und echtem Schmerz);
  - welche Karten einander bedingen, widersprechen oder umdrehen;
  - wer der Bewohner ist und warum gerade er dieses Deck erzählt.
- Die Karten wurden als Wortmaterial behandelt, das durch ein Gate muss, nicht als Comic-Deck mit eigener Intelligenz.
- Die Brücken entstanden deshalb aus Bildassoziationen („Badger unplugged:“, „Fish tank!“, „Dog on tape:“) statt aus dem Sinn der Karten.

**3.2 Gate-Optimierung statt Werk.**
- Das Erfolgskriterium war faktisch `exit 0`. A2 (nur Kartenwörter) und A4 (80–95 Zeichen) haben die Kartenzeilen zu Schnipseln gemacht.
- „Card truth“ (Wortherkunft) wurde mit „card understanding“ (Sinn) verwechselt.
- Ein Gate-PASS wurde Georg mehrfach wie ein Qualitätssignal gemeldet.

**3.3 Whack-a-mole statt Diagnose.**
- Jede Kritik wurde als neue Oberflächenregel umgesetzt: kürzer, keine Analogie, Brücken mit 1–3 Wörtern, Anekdote.
- Das Problem dahinter blieb unverstanden. Ergebnis war ein Pendeln zwischen Extremen: Gerüst → pures Vorlesen → Anekdote → Telegramm. Keines davon hatte Konzept.

**3.4 Vorhandenes Wissen nicht zuerst gelesen.** Folgende Quellen lagen im Repo und wurden erst gelesen, nachdem Georg sie einfordern musste:
- `SONG_SPEC_R3.md` (§B6/B7: KayfabeTips als Brückenlogik, Callbacks; §C9: zwei Ebenen, Normies und Dog Whistles);
- `OPENER_ARC_R2/…take05.final.suno.txt` (Golden Sample) und `opener_pool_r2.py`;
- `SONGS_BESTOF_R1/PERFORMER_NARRATIVE_COMIC_MOTION_DIRECTION_R1.md` (Dramaturgie: cause, contradiction, reversal, callback);
- `media/prompts/KAYFABE_TIPS_corpus_v1.md` (main);
- `TRIPLET_SET_SPEC_R2.md` (was eine Kartenzeile ist: Titel + Power-Begriff, Telegramm-Verdichtung);
- Georgs NotebookLM „KFB Modular Comedy Standup & Storytelling Research“.

Georg musste längst Gebrieftes erneut erklären. Das ist genau die „stille Post“, die er ausdrücklich nicht will.

**3.5 Annahmen statt Prüfung.**
- Combat Mech wurde nach dem Namen als Cockpit-Mech geschrieben.
- 60 Bewohner wurden vorgeschlagen, ohne die Dramatis Personae zu lesen.
- Die Kartenteile wurden „Triplets“ genannt, sind aber keine nach Spec R2.

**3.6 Selbstbewertung im eigenen Saft.**
- Der Blind-Kritiker war dieselbe Modellfamilie und hat r5a-Slop als „individuell“ gelobt.
- Eine Zweitmeinung aus einer anderen Familie oder Georgs Ohr wurde nicht vor die Abgabe gestellt.

**3.7 Breite vor Tiefe.**
- Drei Piloten liefen parallel, dazu Writers' Room, 60er-Set, Signatur-Decks und Exporte.
- Es gab keinen einzelnen Song, an dem das Konzept zuerst sauber durchdacht und mit Georg abgestimmt wurde.

**3.8 Eigene Sprachmuster.** Ohne Deckverständnis füllt das Modell Lücken mit seinen Standardkadenzen:
- Doppelpunkt-Verbinder vor jeder Karte;
- Setup/Punch-Floskeln;
- Analogie-Einstieg;
- „of course“-Schlüsse;
- Mikro-Plots aus Requisiten.

Kein Regelwerk fängt das ab, solange das Verstehen fehlt.

## 4 · Was das Gate nicht kann (für WS0)
`song_gate.py` R4.2 prüft Herkunft, Länge, Rahmen, Wiederholung und eine Slop-Wortliste. Es kann nicht prüfen:
- Sinn und Konzept;
- Kausalität zwischen Karten;
- Witz, Ironie und Figurenstimme;
- Respekt vor dem Deck.

Alle neun gescheiterten Fassungen hatten PASS.

Kandidaten für WS0, ausdrücklich als Hygiene und nicht als Qualitätsbeweis:
- (a) Gerüstmuster als REVIEW: Analogie-Einstieg „Ever …?“, „Congratulations“, „… of course“-Schluss, Doppelpunkt-Verbinder vor mehr als der Hälfte der Karten, Kommentar-Post nach mehr als einem Drittel der Karten.
- (b) Der Eigentext-Richtwert A2 ≤ 30 % passt nicht zu allen Formen; er sollte an die Form gebunden sein, statt pauschal zu gelten.
- (c) Kartenzeilen sollten KFB Triplets nach `TRIPLET_SET_SPEC_R2` sein (kuratiert, mit `triplet_set_check.py`), keine Ad-hoc-Lore-Auszüge.
- (d) Der Gate-PASS darf nie als Qualitätsstatus erscheinen. Im Writers' Room heißt der Status `gate_pass`; das sollte z. B. „technisch sauber“ heißen.

## 5 · Status der Artefakte
- **Piloten** (BBBW, Metropolis, Protopia): alle Fassungen r4a–r8a sind **FAIL**. Im Writers' Room stehen sie auf `draft` mit Vermerk; die Fassungen liegen unter `versions`.
  - BBBW r7b war die einzige Fassung mit „gefällt mir schon ganz gut“. Sie ist Zwischenstand, keine Freigabe.
- **Kein** Text geht zu Suno. Keine Credits wurden verbraucht, kein Audio wurde erzeugt.
- **Gate, Spec und Fixtures:** `song_gate.py` R4.2, `SONG_SPEC_R4.md` R4.2, 41/41 Fixtures. Technisch intakt, inhaltlich unzureichend (§4).

## 6 · Was trägt und bleiben kann
- **Signatur-Decks R1:** Georg hat sie bestätigt („gefällt mir, können wir so machen“). 62 Figuren haben je genau ein Deck aus 134 Registry-Decks (`signature/SIGNATURE_DECKS_R1.{json,md}`).
- **Dramatis-Personae-Patches mit Georgs Kanon:**
  - 4GTN/Utopia, Forgotten/Protopia, Lord Hunky/Academy;
  - Norman, FrizzleBob als Meta-Figur und Spieler-Avatar;
  - Goth Girl, Caveman (neues Sheet).
  - Ablage: `personae/PERSONAE_PATCH_R1.json` und `*.proposal.json`.
- **Writers' Room** (Artefakt `9bSQcnqNd91qKXfhra5puM`): Editor, Versionen, Lessons l01–l15, markierte Ansicht. Die Exporte liegen unter `WRITERS_ROOM_R1/export_*`.
- **Referenzen:** `MODULAR_COMEDY_RESEARCH_SUMMARY_R1.md` (Georgs NotebookLM) und `make_marked.py` (Markierung Karte/Brücke/Rahmen).

## 7 · Empfehlung an WS0
1. **WS-Song schreibt in dieser Sitzung keine Songtexte mehr.** Ein frischer Chat übernimmt mit `ONBOARDING_SONG_WRITING_R1.md`.
2. **Verstehen vor Schreiben:** Für jedes Deck entsteht zuerst ein **Deck-Verständnis** (Inhalt siehe unten), und Georg nickt es ab, bevor eine Zeile Songtext entsteht.
   - Was das Deck sagt und wen es aufs Korn nimmt.
   - Die Kartenfamilien und ihre innere Logik: welche Karte welche auslöst, widerlegt oder umdreht.
   - Die Insider-Schicht.
   - Die Weltsicht und tragikomische Rolle des Bewohners.
   - Wo der Witz des Decks schon in den Karten steckt.
3. **Ein Song, nicht drei.** Erst kommt eine Probe von 5–6 Beats und Georgs Urteil, dann der Rest. Benchmarks sind Georgs eigene Beispiele (Alice, take05, Triplet-Goldens), nicht das Gate.
4. **Kartenzeilen sind KFB Triplets** (Spec R2, kuratiert oder neu nach Spec, mit `triplet_set_check.py`). Brücken entstehen aus dem Sinn der Karten (KayfabeTip 1), nicht aus Requisiten-Assoziationen.
5. **Zweitmeinung aus anderer Modellfamilie** (ChatGPT über das Prompt-Paket) oder Georgs Ohr **vor** jeder Abgabe. Claude-Kritiker dienen nur der Hygiene.
6. **Klären, wem das Textschreiben gehört:** WSA, ein frischer Claude-Chat, ChatGPT oder Georg mit Assistenz. WS-Song liefert Werkzeuge (Gate, Markierung, Writers' Room, Signatur-Decks), aber offenbar nicht das Handwerk.

## 8 · Nächster Schritt
WS0 entscheidet über §7.1 und §7.6. Der frische Chat beginnt mit dem Onboarding. Seine erste Aufgabe ist das Deck-Verständnis für **einen** Pilot (Vorschlag: Big Bad Brain Wrestling, weil r7b die beste Annäherung war), nicht ein Songtext.
