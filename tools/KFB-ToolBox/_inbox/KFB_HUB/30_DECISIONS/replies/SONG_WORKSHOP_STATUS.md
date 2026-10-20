# SONG_WORKSHOP_STATUS · WS-Song · Comic Performance Workshop R1 (V-576)

**Owner:** WS-Song (eigene Claude-Code-Sitzung auf Georgs Mac, getrennt vom Spielcode).
**Branch:** `ws-song/workshop-r1` ab `wsa/songs-bestof-r1-2026-10-18` (@6180ad2).
- Nur lokal committet, **nicht gepusht**: Push erst nach WS0-Go, Deploy-Key nur mit Georgs direkter Bestätigung.
- Keine Suno-Credits, kein Audio.

## §1 · 20.10.2026 · Spec + Gate R4 (Tier 0, Schritt 1)
**Neu:**
- `replies/SONG_SPEC_R4.md`: Matrix V-576 umgesetzt.
- `replies/song_gate.py`: R4.1, ein Skript.
  - Unterbefehle: `lyrics`, `style` (`--batch`), `critic` (v1 + v2) und `album`.
  - Stufen: FAIL, WARN, REVIEW und INFO.
- `replies/SONG_GATE_R4_FIXTURES/`: `python3 run_fixtures.py` → **34/34**.

**Was R4 hart prüft:**
- Mapping `cardNumber` → Beat-Spanne mit wörtlichem `cardText` aus der eigenen Karte.
- Echte Karten-IDs, `bestOf` mit Begründung.
- deckId und Titel in den Metadaten, Quell-Pins (sha256).
- `visualVerified:false` ohne Beleg.
- Unter 5.000 Zeichen.
- Keine gesungenen Klammern; Cues nur als Tag aus der Whitelist oder als Sidecar.
- Performer = echte Registry-Karte.
- STYLE ohne Namen.
- Hauptgenre im Batch nicht doppelt.

**Was R4 nur meldet (WARN/REVIEW):** Titel im ersten Beat, 80–95 Zeichen, BPM, Opener-Quoten, Intro-Typ-Cooldown, Callbacks, Wortwiederholung.

**Fixtures (Pflichtfälle aus dem Brief):**
- Titel weggelassen = PASS.
- Falsche Karte, vertauschte Karte und falsches Deck = FAIL.
- Über 5.000 Zeichen = FAIL.

**Regression:** Grimms r5.2, Dream Wrestling r4.6, Carnival r4.6 und Metropolis WR1 bestehen unter R4 wie unter R3.7.

**R2 unangetastet:** `triplet_set_check.py` mit sha256 `e04de05a…` wird im Fixture-Lauf geprüft.

**R4.1 (Nachschärfung nach den ersten Kritiker-Läufen):**
- Satzzeichen am Ende eines Zitats werden ignoriert.
- „swap“ ist in der Antwort auf `transferable` erlaubt.
- „e.g.“, „instead“ und Co. bleiben verboten.

**Altbefund:** `the_carnival_of_unsolved_problems_therapy.r4.6.critic.json` fällt schon unter R3.7 durch (Zitat „I'm FrizzleBob, your carny rabbit“ steht nicht im Song). Deshalb ist Grimms die Messlatte.

## §2 · 20.10.2026 · Piloten (Tier 0, Schritt 2)
Ordner: `replies/SONGS_WORKSHOP_R1/<deckId>/`. Je Pilot liegen dort:
- Draft, `.suno.txt` (Songtext) und `.style.txt` (A/B);
- `.songlines.json` (kfb.songlines.r4) und `.synopsis.txt` (neutral, für den Kritiker);
- `.gate.txt` (Befehle, Exit-Codes, Gate- und Quell-Hashes);
- `.critic.json` (v2) und `.dossier.md`.

Werkzeuge: `build_track.py` (Draft → Text + Songlines) und `gate_report.py`.

| Track | Performer (Karte) | Form | STYLE A / B | Zeichen | Karten | Gate | Kritiker v2 |
|---|---|---|---|---|---|---|---|
| **Messlatte** Grimms Set 02 r5.2 | – (neutral, R3) | Märchen als Wrestling-Promo | balkan / disco | 4987 | 52/52 | PASS (Titel-Weg) | READY_FOR_WS0 · 1× ja, 4× teilweise, nicht übertragbar |
| The Biological Metropolis r4a | The Brain (#6) | Pressekonferenz des Körpers; eigene Karte als Wendepunkt | funk 104 / big beat 122 | 2897 | 19/32 Best-of | PASS | **READY_FOR_WS0** · 3× ja, 2× teilweise, nicht übertragbar |
| Big Bad Brain Wrestling r4a | The Jobber (#4) | Beichte auf geliehener Einzugsmusik; wählt am Ende, wer ihn besiegt | glam rock 118 / boom-bap 100 | 2969 | 20/56 Best-of | PASS | **READY_FOR_WS0** · 3× ja, 2× teilweise, nicht übertragbar (3. Lauf; 2 Läufe vom Gate verworfen) |
| Embrace Protopia r4a | The Invitation (#17) | eine Woche: Flyer, Türen, Samstag an der Bank | highlife 112 / cumbia 104 | 3472 | 24/56 Best-of | PASS | REVISE · übertragbar = ja (Schema „Name: Definition“) |
| Embrace Protopia **r4b** | The Invitation (#17) | dieselbe Woche, Karten ohne Titel in die Erzählung verwoben; Sessel doom/saved aus Karte 46 | wie r4a | 3283 | 24/56 Best-of | PASS | **READY_FOR_WS0** · 5× ja, 1× teilweise (Outro), nicht übertragbar |

**Album (nicht blind, `song_gate.py album`):**
- drei Performer, drei Hauptgenres (funk, rock, afro), drei BPM-Lagen, drei Formen (Pressekonferenz, Beichte, Wochenchronik);
- keine Gleichheit bei Eröffnung oder Schluss → PASS.

**Redaktionelle Notiz:** Protopia war zuerst eine Versammlung mit Tagesordnung, zu nah an der Pressekonferenz. Ich habe es vor der ersten Kritik umgebaut.

**Befund für WS0/Georg (alle gültigen Kritiken, auch die Messlatte):** „Stay Fluffy, Folks!“ wirkt ohne Vorwissen als unvorbereitetes Anhängsel.
- Die Zeile ist hart nach R3.6 (Georg 18.10.) und bleibt unverändert.
- Ob ein Performer sie vorbereiten darf (z. B. „fluffy“ früher im Song), entscheidet Georg.

**Wiederkehrender Kritikpunkt:** Das Kadenzmuster „Kartenname: Definition“ wirkt wie ein Glossar.
- Metropolis und Brain Wrestling bestehen trotzdem.
- Protopia r4b zeigt: Karten ohne Titel, wörtlich in die Erzählung verwoben, tragen besser (r4a REVISE → r4b 5× ja). Kandidat für eine Schreibregel ab der nächsten Gruppe.

## §3 · Offen / nächste Schritte
1. **WS0:**
   - ACK/TUNE auf SONG_SPEC_R4 und Gate R4.1;
   - Freigabe zum Push von `ws-song/workshop-r1`;
   - Ton-Einträge (E16b) für die drei Pilot-Decks fehlen noch (Gate meldet INFO).
2. **Georg in Suno:**
   - Er hört und wählt je Pilot STYLE A oder B (Metropolis, Brain Wrestling, Protopia r4b).
   - Credits erst nach seiner Wahl; der Verbrauch wird nur nach Bestätigung durch den Anbieter gezählt.
3. **WS0-Frage:**
   - Der SUGGEST-Wortfilter des Kritiker-Gates ist grob. Drei Läufe wurden verworfen: Protopia 1 („e.g.“), Brain Wrestling 1 (Muster in Anführungszeichen) und Brain Wrestling 2 (nur ein beschreibendes „instead of“).
   - Ein Vorschlag liegt nicht vor, das Gate bleibt streng, bis WS0 entscheidet.
4. **Später:**
   - Comic-Motion-Mapping je Song (Karte → Beat → Panel) als eigene Datei. Die Zuordnung Karte → Beat liegt schon in den Songlines.
   - Zeitmarken erst aus echtem Suno-Audio bzw. den Stems.
5. **Weitere Decks:** in Gruppen von 3–5 nach demselben Ablauf, danach jeweils der Album-Vergleich.

## §4 · 20.10.2026 · Writers' Room als Werkbank (Artefakt)
**Seite:** https://claude.ai/artifact/9bSQcnqNd91qKXfhra5puM (privat; Teilen über das Share-Menü).

**Was die Seite kann:**
- Songs ansehen, bearbeiten und speichern, mit Versionen.
- Die Karten des Decks mit „Einfügen“ übernehmen.
- Text, Style A/B und Titel für Suno kopieren.
- Suno-Einstellungen festhalten (Weirdness, Style Influence, Vocal Gender, Exclude) sowie Takes mit Bewertung.
- Gate- und Kritikerstand anzeigen, mit Hinweis, ob das Gate noch für den aktuellen Text gilt.
- Regeln (hart/Richtwert/Handwerk/offen) und Lessons pflegen; die Album-Ansicht zeigt Dubletten.

**Speicherstand:**
- 60 Songs: 3 Piloten mit Gate und Kritik, 17 aus WSA-Batch 1, 27 neu ausgewählt, 13 Bestand R3 mit alten Texten;
- 60 Kartensätze, 26 Regeln und 6 Lessons.

**Auswahl der 27 neuen Decks:**
- Rating 9 bevorzugt, verifizierte Zuordnung bevorzugt;
- witzige oder zugängliche Decks, Bandbreite über Mythos, Geschichte, Musik, Alltagskomik, Literatur und Politik;
- Medizin bewusst nur mit 4 von 38 Decks;
- Quellkonflikte und unverifizierte Zuordnungen sind am Song als Flag markiert.

**ChatGPT-Brücke ohne Sync-Instanz:**
- Prompt-Paket aus der Seite kopieren (Regeln, Karten, Entwurf, festes Antwortformat), in ChatGPT einfügen und die Antwort unter „Import“ zurückholen.
- Direktes Schreiben von ChatGPT in den Speicher ist nicht möglich, weil er eine Claude-Anmeldung braucht.

**Claude in der Seite:** „Ideen mit Claude“ läuft über claude.ai, ohne Code-Instanz.

**Gate-Schritt (Claude Code):**
1. Songs mit `needsGate` lesen.
2. Die Karten-Zuordnung (songlines r4) ableiten.
3. `song_gate.py` und den Kritiker laufen lassen.
4. `gate`/`critic` zurückschreiben und `needsGate` löschen.

**Suno (Recherche 20.10.):**
- keine offizielle API und kein offizieller MCP; die Nutzungsbedingungen verbieten automatisierten Zugriff;
- inoffizielle Wrapper würden das Konto gefährden;
- also von Hand. Limits: Lyrics 5.000, Style 1.000, Titel 100 Zeichen. Stems erst im Premier-Plan.

## §5 · 20.10.2026 · Writers' Room: Export und Integrationsvorbereitung (WSA-Vorschlag)
**Paket:** `replies/WRITERS_ROOM_R1/`, siehe `RETURN.md` und `WRITERS_ROOM_INTEGRATION_PLAN_R1.md`.

**Phase A:**
- Export aller 153 Dokumente, Manifest 155/155;
- Karten 60/60 MATCH gegen die Registry;
- Klassen: 3 Kandidaten mit Gate, 13 Altbestand R3, 44 Planungsplätze.

**Phase B (erster Abgleich):**
- 5 Decks mit Parallelmaterial in #379, als offen markiert;
- kein Audio im Repo;
- Wiederverwendung aus KFB Audio #365 festgelegt: Lesepfad über die Contents API, Writeback mit `expectedBlob`, Default nur ACCEPTED.

**Pilot:** BBBW-Feed `kfb.song.writers-room-feed/1`.

**Nächster Gate:** `WS0_WRITERS_ROOM_EXPORT_ACK_R1`, danach Push nur mit Georgs Bestätigung.

## §6 · 20.10.2026 · Bewohner-Prinzip (Georg) + Spec/Gate R4.2
**Georgs Klarstellung:**
- Der Song gehört dem Bewohner-NPC des Decks, der ihn im Diorama-Zuhause performt.
- Die Ansprache ist offen, die Karten treten fraktal auf.
- Keine Stand-up-Bühne.

**60 Bewohner-Vorschläge:**
- Figuren aus dem Asset-Katalog inklusive Texturvarianten; Duos wie Mumien, Orks, Werwolf, 4GTN.
- Georg hat sie am 20.10. bestätigt, im Writers' Room stehen sie auf BESTÄTIGT.
- Datei: `WRITERS_ROOM_R1/RESIDENT_PROPOSALS_R1.json`.

**Spec und Gate:**
- SONG_SPEC_R4 → R4.2: Abschnitt B (Bewohner).
- Gate R4.2: C9B Bewohner gegen Katalog; C9R Bühnenformeln und Publikums-Cues als REVIEW.
- Kritiker v3 mit zwei neuen Fragen. Fixtures 41/41.

**Prozess und Fahrplan für WS0:** `SONG_WORKSHOP_PROCESS.md`.

**Nächster Schritt:** die drei Piloten als Bewohner-Performance (r5).

## §7 · 20.10.2026 · Piloten als Bewohner-Performance (r5a), Kritik läuft
| Track | Bewohner | Zuhause / Mittel | STYLE A / B | Zeichen | Karten | Gate R4.2 |
|---|---|---|---|---|---|---|
| Metropolis r5a | Combat Mech (alt) | Kanzel, Abteilungen melden sich per Bordsprechanlage als Tiere aus ihren Kartenbildern; das Eulen-Memo ist die Wendung | funk 104 / big beat 122 | 3384 | 19 | PASS |
| Brain Wrestling r5a | Action Figure | Spielzeugkiste, Kopfwechsel = Kartenwechsel; endet mit der einzigen Wahl des Jobbers | glam rock 118 / boom-bap 100 | 3283 | 20 | PASS |
| Protopia r5a | Farmer A | Kleingarten; Tiere aus den Kartenbildern sind Nachbarn und sagen ihre Karte | highlife 112 / cumbia 104 | 3542 | 23 | PASS |

**Kein Saalpublikum:**
- keine Bühnenformeln, keine Crowd-Cues außer `[Bell]` in der Spielzeugkiste;
- die Ansprache funktioniert mit und ohne Zuhörer: „Or nobody did …“, „If nobody came …“, „or nobody is and the box just creaked“.

**Album-Notiz (nicht blind):** Alle drei nutzen Figuren aus den Kartenbildern als fraktale Kartenstimmen, das ist KFB-Bildsprache. Der Mechanismus ist jeweils ein anderer: Bordsprechanlage, Kopfwechsel, Gartenbesuch. Das wird beobachtet, damit es kein Schema wird.

**Nächster Schritt:**
1. Kritik v3 auswerten (läuft, blind, frisch).
2. Höchstens eine Revision.
3. Dann Georg in Suno.

## §8 · 20.10.2026 · Piloten r5 abgeschlossen (Bewohner-Performance, Kritik v3)
| Track | Bewohner | Gate R4.2 | Kritik v3 (8 Fragen) | Ergebnis |
|---|---|---|---|---|
| Metropolis **r5a** | Combat Mech (alt) | PASS · 3384 Zeichen · 19 Karten | 7× ja, Outro teilweise, nicht übertragbar | **READY_FOR_WS0** |
| Brain Wrestling **r5a** | Action Figure | PASS · 3283 Zeichen · 20 Karten | 6× ja, Outro und fraktale Karten teilweise, nicht übertragbar | **READY_FOR_WS0** |
| Protopia r5a | Farmer A | PASS | gültige Kritik: REVISE (fractalCards nein, übertragbar ja) | überarbeitet |
| Protopia **r5b** | Farmer A | PASS · 4258 Zeichen · 23 Karten | 6× ja, Outro teilweise, fractalCards ja, nicht übertragbar | **READY_FOR_WS0** |

**Belege und Prozess:**
- Je Track liegen `*.gate.txt` und `*.critic.json` im Repo.
- Eine Protopia-r5a-Kritik wurde verworfen (Flag über 30 Wörter) und liegt als `*.critic.discarded1.json` daneben.
- Die beiden Kritiken zu Protopia r5a gingen auseinander (READY gegen REVISE). Gilt nur als Signal; Georgs Ohr und WS0 entscheiden.

**Lehren (im Writers' Room als Lessons l08–l10):**
- Fraktal heißt: Die eigene Natur der Figur ist ihre Karte.
- Ein Kritiker ist eine Stimme, kein Urteil.
- Die offene Ansprache trägt, aber nicht als Formel wiederholen.

**Writers' Room und Export:**
- Die drei Piloten stehen als r5 im Writers' Room; die Bühnenfassungen r4 liegen im Versionsverlauf.
- Export `WRITERS_ROOM_R1/export_2026-10-20b/`: 164 Dokumente, Karten 60/60 MATCH, Gate gilt für den gespeicherten Text.
- Der Pilot-Feed BBBW ist auf r5a aktualisiert (`supersedes` r4a).

**Offen bei allen dreien:** Das Outro wird nur wegen „Stay Fluffy, Folks!“ als „teilweise“ bewertet. Die Frage liegt bei Georg (darf der Bewohner es vorbereiten?).

**Nächster Schritt:**
1. Georg hört die drei Piloten in Suno: Text und Style A/B aus dem Writers' Room kopieren, Takes dort festhalten.
2. Danach die erste Gruppe aus WSA-Batch 1 (3–5 Decks) nach dem r5-Muster.

## §9 · 20.10.2026 · Georgs Urteil zu Metropolis r5a: „AI slop“ → Klartext-Regel, Metropolis r5b
**Georg:**
- r5a ist schwer verständlich, Object-Acting, Leerphrasen, besonders am Schluss („Every colossus … thinks it is marching … marched by a badger with a drum … Listen to the drum“).
- Der Koloss war als Idee gut. Metaphern, Allegorien und Karten müssen aber satirisch, interessant und provokant aufgelöst werden, mit Handelndem, Verantwortung und Alltagsbezug.
- Keine Leerstellen wie „Somebody climbed into my cockpit“.

**Ursachen:**
- drei Bildebenen übereinander;
- Kartenbild-Details, die man ohne Bild nicht versteht;
- Rätselsätze und ein Aphorismus-Schluss;
- Gate-Regex zu eng; Blind-Kritiker aus derselben Modellfamilie hat es gelobt (7× ja).

**Neue harte Regeln (Writers' Room r31/r32):**
- Klartext und Auflösung jeder Allegorie;
- ein Bildrahmen pro Song;
- Kartenbilder nur, wenn der Satz ohne Bild trägt.

**Metropolis r5b** (die eine Revision):
- Pilot hinter den Augen, Joysticks ohne Anschluss.
- Jede Karte bekommt eine Alltagspointe mit Verantwortlichem: Smartwatch-Trophäe, Atemcoach für 90 Euro, Seminar verkauft Intuition, Firma feuert Whistleblower, Meeting zum toten Projekt, Humoralist mit Podcast.
- Outro: die einzigen mit Kontrolle sind die Joystick-Verkäufer (Tracker, Coaches, Wunderpulver), und sie kontrollieren dein Geld.
- Gate R4.2 PASS (3106 Zeichen, 15 Karten).

**Nächster Schritt:**
1. Georgs Urteil zu r5b.
2. Dann dieselbe Prüfung für Brain Wrestling r5a und Protopia r5b (Tierbeschreibungen aus Kartenbildern, Spruch-Schlüsse).
3. Gate um Aphorismus-Schluss-, Parolen- und „denkende Objekte“-Muster erweitern.
4. Zweitkritik aus anderer Modellfamilie (ChatGPT) einführen.

**§9 Nachtrag (Georg):**
- Das Outro braucht keinen Adressaten.
- Es soll ein satirisches KFB-Bild von Gesellschaft, Ideologie oder Torheit zeichnen, zum Nachdenken bringen, musikalisch gefällig bis schräg sein und neugierig aufs Spielen mit Freunden machen (Writers' Room r33).

**Metropolis r5b, neues Outro:**
- eine ganze Stadt von Piloten an unverbundenen Joysticks, „Rush hour looks exactly the same“;
- dann: zweiunddreißig Abteilungen in einem Deck, mit Freunden ausschneiden und herausfinden, wer bei euch die Stadt regiert.
- Gate PASS (3148 Zeichen).

## §10 · 20.10.2026 · Combat Mech als Cyborg-Cop (Georg: A) + Dramatis Personae
**Georgs Vorgabe:**
- Die Karteninhalte sind der Kern; dazu die Garnitur, eine tragikomische Rolle der Figur.
- Combat Mech ist ein leicht dystopischer Cyborg-Cop im Utopia/Dystopia-Realm, mit Ideologien, Fehlannahmen und verkürzten Perspektiven, mit tiefen Wahrheiten, satirischen Brüchen und einer subtilen Fehlerschleife.
- Kein proprietäres KFB-Storytelling.
- Den Aufbau entwickeln wir gemeinsam mit den Dramatis Personae.

**Metropolis r6a:**
- Entwurf mit Alice-Mechanik (Karte = Beat mit Name, Bild und Behauptung) und Cop-Brücken; 33 % eigener Text.
- Gate PASS.
- Als Arbeitsmaterial für die Figur, noch nicht zur Kritik.

**Dramatis Personae gefunden:**
- `FIGURES_R1/characters/` (11 Sheets, `kfb.character/1`) und `figures/` (13 Figure Cards).

**Combat-Mech-Sheet:**
- Neu als Vorschlag: `SONGS_WORKSHOP_R1/personae/combat_mech.character.proposal.json` (8 GEORG, 36 DESIGN, 7 SOURCE, 20 todo).
- Zusatzfeld `worldview` vorgeschlagen.

**Abgleich Bewohnerliste ↔ Dramatis Personae:**
- `personae/RESIDENT_DP_ALIGNMENT_R1.md` mit 5 Konflikten zur Entscheidung (4GTN, 4GTN Forgotten, Goth Girl, FrizzleBob, Norman).

**Nächster Schritt:**
1. Georg liest die DESIGN-Felder des Combat-Mech-Sheets gegen und entscheidet die Konflikte 1–5.
2. Danach wird Metropolis aus dem Sheet heraus fertig geschrieben und von einem Kritiker aus einer anderen Modellfamilie geprüft.

## §11 · 20.10.2026 · Figuren-Kanon von Georg (4GTN, Forgotten, Lord Hunky, Norman) → Dramatis-Personae-Patch
**Georg (Chat):**
- **4GTN:**
  - CEO von Utopia; Transhumanismus, Dark Enlightenment, Technocracy Inc., Überwachungskapitalismus.
  - Katana als Kampfwaffe (wie Ninja).
  - Eingesetzt von der Galactic Academy, um fügsame, glückliche NPCs (Idiocracy) für die Fluff-Ernte nach Utopia zu locken und zu Cyborgs zu machen.
  - Arbeitet mit/für Lord Hunky, mit widersprüchlichen Vorgaben der kafkaesken Academy im Zentrum der Galaxie.
- **Lord Hunky:** verbannter, gescheiterter Terraformer der Academy.
- **4GTN Forgotten:** die grüne Moos-Variante als Vorläufermodell, Rogue Robot und „guter“ Zwilling im Protopia-Maker-Space; Multiversum-Logik, „conflict is king“.
- **Norman:** gut für Bullshit Jobs und What Work Was For.

**Persistiert (additiv, Vorschlagsweg):**
- `SONGS_WORKSHOP_R1/personae/PERSONAE_PATCH_R1.json`: Feld-Patches mit GEORG-Status, Basis = Register @6efe383 (sha256 je Datei).
- Fertige Vorschlags-Dokumente `*.character.proposal.json` für 4GTN, Forgotten, Lord Hunky und Norman.
- Beziehungen vom 17.10. bleiben erhalten und werden ergänzt.

**Konflikt markiert:** 4GTN `performance.props` war am 17.10. leer, `styleNote` lautet „no samurai stereotype“. Das Katana ist als Waffe eingetragen, das Styling bleibt neutral; Georg bestätigt.

**Norman:** im Writers' Room und in der Bewohnerliste eingetragen. Gate R4.2 kennt Figuren aus den Dramatis Personae ohne Katalogmodell (Norman, Lord Hunky, Lady Dory, Brain-Cyborg); Fixtures 41/41.

**Combat Mech:** offene Frage ergänzt, ob Unit Nine ein umgewandelter NPC ist, Utopias Sicherheitsdienst oder beides.

**Nächster Schritt:**
1. Georg bestätigt die Konflikte #1/#2 (4GTN → Forget Utopia, Forgotten → Protopia) und das Katana.
2. Dann der Weg in die Register-Dramatis-Personae (ToolBox-Proposal-Branch oder WS0).

## §12 · 20.10.2026 · Georg zu FrizzleBob, Goth Girl und Caveman
**FrizzleBob:** Meta-Figur und vorerst der Default-Spieler-Avatar. Patch: `story.metaStatus` und `story.playerRole`.
- *Ego Mania:* FB spielt dort den Spieler, nicht den Bewohner.
- *Mission Control:* zurück auf VORSCHLAG (Bewohner offen).
- Konflikt markiert: Sheet-Feld „MC of every deck song (stand-up opener)“ gegen das Bewohner-Prinzip.

**Goth Girl:** Dark Psychology, Okkultes, Sarkasmus, Conspiracy, Psyops. Patch: `story.background` und `cards.worldviewTags`. Deck-Kandidaten stehen im Alignment unter #3.

**Caveman:** neues Sheet `caveman.character.proposal.json`.
- Ureinwohner des Multiversums; im Fluff Incident von Lord Hunky aus Knetgummi geformt.
- Frau angeblich mit dem Vampir durchgebrannt.
- Sein kritisches Denken lässt Hunkys Ernte- und Clayforming-Pläne scheitern.

**Lord Hunky:** Patch ergänzt: `story.fluffIncident`, `story.failedPlans`, Beziehung zum Caveman.

**Writers' Room:** beide FB-Songs aktualisiert (Version 4), alte Werte bleiben erhalten.

**Offen bei Georg:**
1. Caveman-Deck: `philosopher_dungeon_raid` ist nicht unter den 60, `platos_dungeon_raid_v05` schon. Zu Dionysos gibt es im Registry nichts.
2. Mission-Control-Bewohner.
3. Goth-Girl-Decks.
4. #1/#2 (4GTN-Tausch).
5. Katana.

## §13 · 20.10.2026 · Lorekeeper für Mission Control, Toy Soldier, Einzigartigkeit
**Georg (Vorschläge):**
- Lorekeeper als Bewohner von Mission Control (Guide, Mentor, Meta-Figur, Questgeber).
- Toy Soldier für geopolitische Decks, aber nicht für alle: jeder Song, jedes Deck und jede Figur möglichst einzigartig.

**Umgesetzt (als VORSCHLAG):**
- Writers' Room: Mission Control → Lorekeeper (v5), FrizzleBob unter `previousPerformers`.
- Philosophy (v4) ist offen.
- Bewohnerliste nachgezogen.

**Im Alignment ergänzt:**
- #6 Caveman: Kette Philosophy ← Caveman.
- #7 Toy Soldier: Vorschlag *Power Pyramid Plumbing*.
- Einzigartigkeits-Audit: 9 Modelle mehrfach belegt.

**Nächster Schritt:** Georg entscheidet:
1. Kette Lorekeeper/Caveman;
2. wohin der Toy Soldier geht und wer *Symphonic Savagery* übernimmt;
3. welche Mehrfachbelegungen aufgelöst werden.

Danach Writers' Room auf BESTÄTIGT setzen.

## §14 · 20.10.2026 · Signatur-Decks über alle 134 Decks
**Georg:** Basis sind die 130+ Decks auf GitHub. Jede Figur bekommt zuerst ein Signatur-Deck; Varianten folgen später für schwächere Decks.

**Ergebnis:** `SONGS_WORKSHOP_R1/signature/SIGNATURE_DECKS_R1.{json,md}`.
- 62 Figuren bzw. feste Duos, jedes Deck genau einmal vergeben (per Skript geprüft).
- Herkunft der Zuordnungen:
  - 13 aus Georgs Aussagen;
  - 24 aus der bestätigten Bewohnerliste;
  - 25 neue Vorschläge.
- Nicht vergeben:
  - 16 Decks für Varianten später;
  - 45 MedKayfab-Decks (Frage an Georg);
  - 5 Doppelversionen;
  - 1 sensibles Deck;
  - 4 Dateien ohne Karten.

**Writers' Room:** noch nicht umgestellt. Nach Georgs OK werden die Songs von „60 Decks“ auf „Signatur-Decks“ umgestellt; die alten Einträge bleiben als Historie erhalten.

**Nächster Schritt:** Georg prüft die 25 Vorschläge und klärt die MedKayfab-Frage.

## §15 · 20.10.2026 · Signatur-Decks freigegeben, Writers' Room umgestellt
**Georg:** „ja, gefällt mir – können wir so machen“.

**Umgesetzt:**
- **Writers' Room:** 70 Songs. Davon sind 62 Signatur-Songs (Bewohner BESTÄTIGT, je Song ein Feld `signature`); 10 neue Decks samt Karten (Welle 3 „Signatur neu“).
- **Welle 8 „Varianten später“:** 8 Decks. Ihre bisherige Figur hat jetzt ein eigenes Signatur-Deck; *What Work Was For* bleibt Normans Zweitdeck.
- **Zuhause/Meta:** Wo die Figur gewechselt hat, sind Zuhause und Meta mit „(Vorschlag)“ markiert. Die alte Belegung steht unter `resident.previous`.
- **Seite:** Version 3, mit den Wellen 3 und 8 als Filter.
- **Export:** `WRITERS_ROOM_R1/export_2026-10-20c` mit 185 Dokumenten; Karten 70/70 MATCH.
- **Prüfung:** Signatur-Check 62/62 ohne Abweichung.

**Alignment-Konflikte:** #1–#7 sind damit aufgelöst. Offen bleibt nur die Katana-Notiz.

**Nächster Schritt:** Texte schreiben, zuerst die Piloten:
1. Metropolis r6a fertigstellen (Combat Mech);
2. BBBW und Protopia nach Klartext-Regeln überarbeiten; Protopia hat jetzt 4GTN Forgotten als Bewohner.

Danach Batches über die Signatur-Songs, zuerst die 10 neuen.

**Offene Fragen an Georg:**
- MedKayfab: eigenes Ensemble oder Varianten?
- Was passiert mit dem sensiblen Bücher-Deck?

## §16 · 20.10.2026 · Piloten nach Alice-Mechanik + Klartext (Signatur-Bewohner)
**Neue Fassungen** (alle Gate R4.2 PASS, `SONGS_WORKSHOP_R1/<deck>/<deck>.<rev>.*`):

| Deck | Fassung | Bewohner | Zeichen | Karten |
|---|---|---|---:|---:|
| The Biological Metropolis | r6b | Combat Mech als Cyborg-Cop | 3282 | 21 |
| Embrace Protopia | r6a | 4GTN Forgotten, abgekündigtes Vorgängermodell im Repair-Café | 2832 | 20 |
| Big Bad Brain Wrestling | r6a | Actionfigur mit Wechselköpfen | 2213 | 21 |

**Muster** (aus Georgs Alice-Vorlage, nicht kopiert):
- Karte = Name + Behauptung; das Bild nur, wo der Satz es ohne Bild trägt.
- Kurze kausale Verbinder zwischen den Karten.
- Ein Alltagsvergleich am Anfang, den das Outro mit Kartenbildern auflöst:
  - Metropolis: Manager → Pressesprecher, Beschwerden kommen 500 ms zu spät.
  - Protopia: Handy nicht mehr unterstützt → „Support ended … still open Saturdays“.
  - BBBW: Meeting mit vorab entschiedenem Plan → Montag als Probe, „the booker answers next season“.

**Offen:**
- Eigentext liegt bei 37–38 % (Richtwert ≤ 30 %, WARN): Das sind die Einwürfe des Bewohners. Georgs Ohr entscheidet, ob sie tragen.
- Writers' Room: Die drei Songs stehen auf `gate_pass` (v6); die alten Fassungen liegen unter `versions`. Die Kritik ist ausstehend.

**Nächster Schritt:** Georg liest bzw. hört die Piloten (Suno nur durch Georg). Danach kommen die 10 neuen Signatur-Songs.

## §17 · 20.10.2026 · Georg verwirft die Piloten aus §16
**Georg:** „viel zu viel bemühtes Erklärbär-pseudo-satire-cliché storytelling … triviale AI-slop-Phrasen und Scaffolding aus jeder Zeile.“

**Diagnose (WS-Song):** Ich habe das Gerüst aus Georgs Alice als Schablone über alle drei Songs gelegt:
- Einstieg mit Alltags-Analogie „Ever …? Congratulations …“;
- Schluss „… welcome, of course“;
- Doppelpunkt-Verbinder vor jeder Karte;
- Kommentarpointe hinter jeder Karte;
- ein Outro, das die Satire erklärt.

Das Gate lässt das durch, weil es solche Muster nicht als Slop kennt.

**Folgen:**
- Lesson l12 im Writers' Room.
- Die drei Songs stehen dort wieder auf `draft`.
- Kein weiterer Vollsong ohne vorherige kurze Probe, die Georg sieht.
- Gate-Kandidaten (für WS0, nicht umgesetzt):
  - „Congratulations“ und „of course“ im Outro als REVIEW;
  - Kommentar-Post nach mehr als einem Drittel der Karten als WARN.

## §18 · 20.10.2026 · Zurück zum Golden Sample (take05) – BBBW r7a als Probe
**Georg:** Pures Vorlesen ist die alte FAIL-Richtung. Gefordert sind Connective Flow, Mini-Brücken, Insider-Callbacks und Cadence. Dafür gibt es schon das Golden Sample `OPENER_ARC_R2/epistemic_sabotage.take05.final.suno.txt`.

**WS-Song:** Ich hatte take05 und SONG_SPEC_R3 §B6/B7/C9 nicht als Grundlage genommen; das war ein Regress.

**BBBW r7a:** im take05-Takt gebaut, Gate PASS, 1961 Zeichen, 24 Karten, Eigentext 17 %.
- Kartenzeilen im Telegrammstil, Mini-Opener mit 1–4 Wörtern (Click, SMACK!, THUD., Too much/Too little, Ow. For real., Shh., Two point nine nine.).
- Beat 1 = Titel + These, Outro = Rückruf auf das Intro.

**Nächster Schritt:** Georgs Urteil zu r7a. Danach Metropolis und Protopia im selben Takt.

## §19 · 20.10.2026 · BBBW r7b: Stand-up-Anekdote mit Cartoon-Kausalität
**Georg zu r7a:** „nein“. Gefordert ist plausible Cartoon-Kausalität wie bei South Park: therefore/but, aber nicht wörtlich. Der Träger dafür ist die anekdotische Stand-up-Routine („My neighbor raised a … / So I had to … / Meanwhile …“). Quellen: KayfabeTips Tip 1 und Tell-Frame (`media/prompts/KAYFABE_TIPS_corpus_v1.md`), dazu Georgs NotebookLM und Google-Doc (ohne Login nicht lesbar).

**r7b (Probe):** Die Actionfigur erzählt, wie der Junge, dem sie gehört, im Wohnzimmer eine Liga betreibt.
- Jede Karte ist das nächste verursachte oder verdrehte Ereignis; Akteure sind die Schwester, Mom, der Hund und der Cousin.
- Rückrufe: Der Hund liefert erst die Konserven-Crowd und dann die echte Verletzung; der verlorene Arm kommt im Outro wieder.
- Gate PASS, 2011 Zeichen, 17 Karten. Eigentext 50 % (WARN, Richtwert ≤ 30 %). Mit der Routine steigt der Anteil; WS0 sollte den Richtwert für diese Form neu bewerten.

**Nächster Schritt:** Georgs Urteil zu r7b.

## §20 · 21.10.2026 · Muster bestätigt („gefällt mir schon ganz gut“) → Metropolis und Protopia nachgezogen
**Georg zu BBBW r7b:** „gefällt mir schon ganz gut“. Georg hat außerdem eine Gemini-Zusammenfassung seines NotebookLM übergeben (Beat-Grammatiken BG-1–8, Operatoren OP/UP/FW, Fallbacks). Sie liegt als Referenz in `SONGS_WORKSHOP_R1/MODULAR_COMEDY_RESEARCH_SUMMARY_R1.md`; über eine Spec-Aufnahme entscheidet WS0.

**Neu, beide Gate PASS:**

| Deck | Fassung | Bewohner | Zeichen | Karten | Eigentext |
|---|---|---|---:|---:|---:|
| The Biological Metropolis | r7a | Cyborg-Cop, erste Nachtschicht | 3028 | 19 | 40 % |
| Embrace Protopia | r7a | The Forgotten eröffnet ein Repair-Café | 3247 | 19 | 39 % |

- **Metropolis:** Kette Dachs → Lunge → U-Bahn → Katzen → Mäuse → Riot-Ratten → Feuer → Polizeihund → Spinne → Krebs → Archiv → Captain → Eulen. Outro: „minigun still loaded, city still fine without me“.
- **Protopia:** Opossum → Waschbär → Leguan/Tür → Schildkröte → Dachs → Eber gegen den Berater des Zwillings → Pelikan → vier Vögel → Oktopus → Igel → Quokka → Taube → Krähe gegen das Utopia-Schild → Kröte → Maulwurf → goldene Pfote. Outro: Tür/Samstag.

**Writers' Room:** alle drei Songs v8 auf `gate_pass`; die verworfenen r6-Fassungen liegen unter `versions`. Neu ist Lesson l13 (Anekdote + Cartoon-Kausalität).

**Hinweis an WS0:** Diese Form trägt 39–50 % Eigentext; der Richtwert ≤ 30 % (A2 WARN) passt dazu nicht.

**Nächster Schritt:** Georgs Urteil zu Metropolis und Protopia r7a, danach die 10 neuen Signatur-Songs.
