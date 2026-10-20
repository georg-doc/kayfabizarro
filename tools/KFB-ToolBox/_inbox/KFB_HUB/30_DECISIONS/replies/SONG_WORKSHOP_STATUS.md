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
