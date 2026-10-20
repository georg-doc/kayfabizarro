# Onboarding · KFB Deck-Songs schreiben (für einen frischen Chat) · R1 · 21.10.2026
Lies dieses Dokument ganz, bevor du irgendetwas schreibst. Es fasst zusammen, was Georg in vielen Runden gebrieft hat und woran die Vorgänger-Sitzung gescheitert ist (`POSTMORTEM_SONG_PILOTS_R1.md`).

## 0 · Kurz
- **Projekt:** KayfaBizarro (KFB), ein Comic-Kartenspiel; Repo `georg-doc/kayfabizarro` (öffentlich).
- **Aufgabe:** je Deck ein Spoken-Word-Song (Suno), den der Bewohner des Decks in seinem Diorama performt.
- **Auftraggeber und einziger Richter über Qualität:** Georg. WS0 koordiniert und entscheidet Spec-Fragen.
- **Arbeitszweig:** `ws-song/workshop-r1`. Pfadpräfix `R = tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies`.

## 1 · Harte Regeln
- Keine Suno-Credits und kein Audio ohne Georg; er hört und wählt.
- Nichts auf `main`. Pushes nur additiv auf `ws-song/workshop-r1`, wenn die Sitzung das von Georg erlaubt bekommt. Den Deploy-Key nur mit Georgs direkter Bestätigung.
- Georg nicht als Boten nutzen. Erst lesen, was im Repo liegt, dann fragen.
- Ein Gate-PASS ist **kein** Qualitätsbeweis. Melde ihn nie als „fertig“ oder „gut“.

## 2 · Pflichtlektüre (in dieser Reihenfolge, vor dem ersten Satz)
1. `R/SONGS_WORKSHOP_R1/POSTMORTEM_SONG_PILOTS_R1.md`: was alles schiefging und warum.
2. `R/SONGS_BESTOF_R1/ALICE_USER_EXEMPLAR_2026-10-20.md`: Georgs eigener Song, eine Referenz und **keine Schablone**.
3. `R/OPENER_ARC_R2/epistemic_sabotage.take05.final.suno.txt` + `.style.txt`: Georgs Golden Sample für Takt und Mini-Opener.
4. `R/TRIPLET_SET_SPEC_R2.md`: was eine Kartenzeile (KFB Triplet) ist, mit Georgs Goldens.
5. `media/prompts/KAYFABE_TIPS_corpus_v1.md` (auf `main`): die 5 KayfabeTips, vor allem Tip 1 („therefore/but, never and-then“), Tip 3 („we follow people, not props“), Tip 4 („the weirder the card, the straighter the face“).
6. `R/SONGS_BESTOF_R1/PERFORMER_NARRATIVE_COMIC_MOTION_DIRECTION_R1.md`: Dramaturgie (cause, contradiction, reversal, callback, juxtaposition).
7. `R/SONGS_WORKSHOP_R1/MODULAR_COMEDY_RESEARCH_SUMMARY_R1.md`: Georgs NotebookLM, mit Beat-Grammatiken, Openern und Fallbacks.
8. `R/SONG_SPEC_R3.md` §B6/B7/C9/C13 und `R/SONG_SPEC_R4.md` (R4.2): Regeln und Gate-Grundlage.
9. **Das Deck selbst:** das Karten-PDF bzw. `media/kfb/<Deck>.pdf.json` (Name, Lore, Power, Bild), die Registry `registry/assets/v1/decks/<deckId>.json` und der Bewohner aus `R/SONGS_WORKSHOP_R1/signature/SIGNATURE_DECKS_R1.md` und den Dramatis Personae (`R/FIGURES_R1/characters/*.character.json` + `R/SONGS_WORKSHOP_R1/personae/*`).

## 3 · Was ein KFB-Deck-Song ist (Georgs Worte, gesammelt)
- Der **Bewohner** (NPC des Decks) performt in seinem Diorama-Zuhause, für wen auch immer da ist: andere Bewohner oder nur den Spieler. Keine Stand-up-Bühne, kein Saalpublikum, keine „Good morning / Ladies and gentlemen“.
- Die **Karten sind Charaktere** mit einer Behauptung: „show it, spin it, sell it“. Sie tragen den Witz. Die Figur ist „Garnitur“ mit tragikomischer Rolle: Ideologien, Fehlannahmen, verkürzte Perspektiven, tiefe Wahrheiten, satirische Brüche, subtile persönliche Failure-Loops. Kein Abdriften in proprietäres KFB-Storytelling.
- **Connective Flow:** Mini-Opener und Mikro-Brücken verbinden die Karten mit **plausibler Cartoon-Kausalität** wie bei South Park (therefore/but, nicht wörtlich, nie „and then“). Dazu kommen Insider-Callbacks, Flow und Cadence.
- **Brücken sind kurz:** 1–3 Wörter, je weniger, desto besser (weniger Slop-Gefahr). Die Kausalität muss aus dem **Sinn** der Karten kommen, nicht aus Requisiten-Assoziationen.
- **Stand-up-anekdotische Routine** als Träger: „My neighbor raised a … / So I had to … / Meanwhile …“. Sie bleibt knapp und nur so viel, wie der Flow braucht.
- **Intro:** Beat 1 nennt Decktitel und These in Klartext; danach höchstens eine kurze Bewohner-Zeile.
- **Outro:** ohne Adressaten nötig. Es ist ein satirisches KFB-Bild von Gesellschaft, Ideologie oder menschlicher Torheit, regt zum Nachdenken an, klingt musikalisch gefällig bis schräg und macht neugierig, das Deck mit Freunden zu spielen. Nicht belehrend, nicht abstrakt, keine Parole, kein Aphorismus.
- **Musik** ist immer tanzbar (100–130 BPM). Genres rotieren; kein trauriger Jazz-Club.
- **Ein Track pro Deck**, unter 5000 Zeichen. Für lange Decks ein dramaturgisches Best-of, nie „die ersten N Karten“.

## 4 · FAIL-Katalog (alles schon passiert, nichts davon wiederholen)
| FAIL | Beispiel aus den Piloten |
|---|---|
| AI-Slop, Object-Acting, Leerphrasen | „Every colossus in every square thinks it is marching …“ |
| Gestapelte Metaphern, Kartenbild beschrieben, das man ohne Bild nicht versteht | „the beaver … the raccoon steals the eraser …“ |
| Aphorismus- oder Parolen-Schluss | „Listen to the drum.“ |
| Didaktisches oder abstraktes Outro | „Somebody at your table will fight for the chair.“ |
| Erklärbär-Gerüst als Schablone | „Ever asked for the manager…? Congratulations …“, „… of course“-Schluss, Pointe hinter jeder Karte |
| Karten nur vorlesen ohne Flow | reine Kartenliste |
| Zu viel eigene Bastelei | ganze Erzählsätze vor jeder Karte |
| Assoziative Mini-Plots ohne Kartensinn | „Badger unplugged:“, „Fish tank!“, „Dog on tape:“ |
| Figur aus dem Namen geraten | Combat Mech als Cockpit-Pilot; er ist eine Figur im Kampfanzug mit Jetpack, Minigun und Axt |
| Bewohner ohne Dramatis Personae vorgeschlagen | 60er-Liste vor dem Abgleich |
| Kartenzeilen „Triplets“ genannt, ohne Spec R2 | Lore-Auszüge plus Bildwörter |
| Gate-PASS als Qualität gemeldet | „alle Gate PASS“ |
| Whack-a-mole: Kritik als Oberflächenregel umgesetzt | Pendeln Gerüst → Vorlesen → Anekdote → Telegramm |

## 5 · Arbeitsweise
1. **Deck verstehen** (schriftlich, kurz, für Georg), ohne eine Zeile Songtext:
   - These und Satireziel des Decks.
   - Die mentalen Modelle, die es spielt.
   - Kartenfamilien und ihre innere Logik: welche Karte welche auslöst, widerlegt oder umdreht. Daraus ergibt sich die Kette.
   - Wo der Witz schon in den Karten steckt.
   - Die Insider-Schicht (Dog Whistles für Kenner).
   - Der Bewohner: Weltsicht, Fehlannahme, Failure-Loop, warum gerade er.
   - Ein Satz zur Aussage des Outros.
2. Georg kommentiert. Erst danach geht es weiter.
3. **Probe:** 5–6 Beats mit Intro-Satz, einer Kartenkette und einem Outro-Entwurf. Georg urteilt.
4. **Song:** Kartenzeilen als KFB Triplets nach Spec R2 (kuratiert oder neu, geprüft mit `R/triplet_set_check.py`), Brücken aus der Kausalkette, ein Style A/B.
5. **Hygiene:** zuerst `song_gate.py`, dann `make_marked.py` (markierte Ansicht für Georg), dann eine Zweitmeinung aus einer anderen Modellfamilie.
6. **Writers' Room:** Fassung speichern, die alte unter `versions` ablegen. Den Projektstand in `R/SONG_WORKSHOP_STATUS.md` fortschreiben.

## 6 · Werkzeuge (Pfade relativ zu `R/SONGS_WORKSHOP_R1/`)
- `build_track.py <deck>/<deck>.<rev>.draft.json` erzeugt `suno.txt`, `songlines.json` und `synopsis`.
  - Beats: `"Text"`, `{"tag": "Bell"}` oder `{"card": n, "pre": "...", "text": "<nur Kartenwörter>", "post": "..."}`.
- `gate_report.py <deck>/<deck>.<rev>` schreibt `*.gate.txt` (`song_gate.py` R4.2 mit `--media` und `--corpus`).
- `make_marked.py <draft.json>` erzeugt die Markierung Karte/Brücke/Rahmen (`kfb.song.marked/1`). Sie ist im Writers' Room als „Markierte Ansicht“ sichtbar.
- **Writers' Room:** Artefakt https://claude.ai/artifact/9bSQcnqNd91qKXfhra5puM mit den Collections `songs` (+`versions`), `cards`, `rules`, `lessons` und `meta`. Export mit `../WRITERS_ROOM_R1/export_writers_room.py`.
- **Push** (nur mit Georgs Erlaubnis in deiner Sitzung):

```bash
git -c credential.helper= -c credential.helper='!'"$HOME/kfb-ws1/bin/gh auth git-credential" push -q origin ws-song/workshop-r1
```

  Danach Remote gegen lokal prüfen. Commit-Identität `georg-doc <georg.vonwestphalen@doccheck.com>`. Lokaler Klon: `~/kfb-ws1/song/kayfabizarro` (sparse, blobless).

## 7 · Stand (21.10.2026)
- **Signatur-Decks R1:** bestätigt. 62 Figuren haben je genau ein Deck. Dazu kommen 16 Decks für Varianten später, 45 MedKayfab-Decks offen und ein sensibles Deck (`suppressed_book_deck`) ohne Figur.
- **Bewohner-Kanon** (Georg): 4GTN = CEO von Utopia; Forgotten = Vorläufer und „guter“ Zwilling in Protopia; Lord Hunky = gescheiterter Terraformer der Academy; Norman = Arbeits-Decks; FrizzleBob = Meta-Figur und Spieler-Avatar (kein Bewohner); Lorekeeper = Mission Control (Questgeber); Goth Girl = Dark Psychology, Okkultes, Sarkasmus, Conspiracy, Psyops; Caveman = Knet-Ureinwohner, kritischer Denker, Frau angeblich mit dem Vampir durchgebrannt.
  - Quelle: `personae/PERSONAE_PATCH_R1.json`.
- **Piloten:** BBBW, Metropolis und Protopia sind in allen Fassungen r4a–r8a FAIL. BBBW r7b kam am nächsten heran (Georg: „gefällt mir schon ganz gut“), ist aber nicht freigegeben.
- **Offene Fragen an Georg:**
  - MedKayfab-Ensemble;
  - das sensible Bücher-Deck;
  - Katana bei 4GTN gegen die Styling-Notiz vom 17.10.;
  - Aussprache von „4GTN“.
- **Offen bei WS0:** wem das Textschreiben gehört; Gate-Hygiene-Kandidaten (Postmortem §4).

## 8 · Erste Aufgabe für den frischen Chat
Lies §2 vollständig. Schreib dann für **Big Bad Brain Wrestling** (Bewohner: Actionfigur mit Wechselköpfen) das Deck-Verständnis nach §5.1 und leg es Georg vor. **Noch keinen Songtext.**
