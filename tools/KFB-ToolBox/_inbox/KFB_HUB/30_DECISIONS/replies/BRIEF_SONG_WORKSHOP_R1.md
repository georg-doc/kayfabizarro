# BRIEF · KFB Comic Performance Workshop (Songs) · R1 · 2026-10-20 · WS0
**Register:** V-576 (WS0-ACK zur Regel-Abstimmung), aufbauend auf V-361, V-362, V-374, V-376.
**Owner:** eine neue, eigene Claude-Code-Sitzung „WS-Song“, die Georg im WS1-Umfeld startet (Token-Budget). Sie arbeitet getrennt vom Spielcode.

**Tier 0**
1. Gestandardisiert wird der Produktionsablauf, nicht das Kunstwerk. Kartentreue ist hart, die Dramaturgie frei; jedes Deck ist ein eigenständiges musikalisches Werk, gesungen von einem Performer mit eigener Persönlichkeit.
2. **Zuerst SONG_SPEC_R4 + song_gate.py R4** nach der Entscheidungsmatrix unten, mit Fixtures. R2 (gesprochene Triplets) samt Checker bleibt unangetastet.
3. **Dann die Piloten:**
   - ein bestehender, quellengestützter Song als Messlatte;
   - danach drei bewusst verschiedene Performances: The Biological Metropolis, Big Bad Brain Wrestling, Embrace Protopia.
   - Georgs Alice-Song ist Referenz, keine Schablone.
   - Jeder Song geht durch Gate und Blind-Kritiker; danach entscheidet Georg in Suno.

## Block
**Quellen:**
- WSA-Branch `wsa/songs-bestof-r1-2026-10-18`, Ordner `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/SONGS_BESTOF_R1/`. Dort liegen `WORK_CODE_COMIC_PERFORMANCE_WORKSHOP_R1.md`, `WS0_SONG_WORKSHOP_RULE_RECONCILIATION_REQUEST_R1.md`, `ALICE_USER_EXEMPLAR_2026-10-20.md` und `PERFORMER_NARRATIVE_COMIC_MOTION_DIRECTION_R1.md`.
- Im Register: `replies/SONG_SPEC_R3.md`, `replies/song_gate.py`, `replies/SONG_CRITIC_PROMPT_R1.md`, `replies/SONG_CRITICS_R1…R3/`.

**WS0-Entscheidungsmatrix (ACK mit TUNE):**

| Punkt | Entscheid |
|---|---|
| Decktitel im ersten Beat (C9) | **ACK:** optional. Die Deck-Identität entsteht durch den Performer (in einem späteren Beat, im Titel oder im Outro). Hart bleiben Deck-ID und Titel in Metadaten bzw. Hub und die gepinnte Quelle. |
| Kartentitel je Beat (A1/C10) | **ACK:** Den Titel auszusprechen ist eine künstlerische Wahl. **Hart:** Mapping `cardNumber` → Lyric-Beat-Spanne, nur echte Karten-IDs, bestOf dokumentiert. |
| 80–95 Zeichen je Kartenzeile (A4) | **TUNE:** Richtwert, wird zu WARN. **Hart:** < 5.000 Zeichen gesamt (Unicode-`len()`). |
| Benannter KFB-Performer statt neutralem Erzähler | **ACK**, nur verifizierte KFB-Figuren. STYLE bleibt rein musikalisch (V-362). |
| Klammer-Cues (A6) | **TUNE:** Bühnen-, Publikums- und Instrumental-Cues als Sidecar bzw. Whitelist-Tag, nie im gesungenen Text. |
| BPM 100–130, Genre-Rotation | **TUNE:** Präferenz auf Albumebene; Ausnahmen mit hörbarem Zweck dokumentieren. Hart: Hauptgenres im Batch wiederholen sich nicht. |
| Opener-Zahlen, Intro-Typen, Callback-Quoten | **ACK:** Das sind redaktionelle Signale (WARN bzw. REVIEW), keine Quoten. |
| Quellenbild-Nachweis | JSON zuerst, PDF nur im Ausnahmefall; beschreibende Motive als `visualVerified:false`. Die kanonischen Kartenfelder sind unveränderlich. |

**Gate-Architektur:**
- Harte Quell- und Formfehler bleiben FAIL; stilistische Zahlenmuster werden WARN bzw. REVIEW.
- Ein Checker, versioniert (R4), kein Schatten-Parser.
- Fixtures: Titel weggelassen ist PASS; falsche Karte bzw. falsches Deck ist FAIL; über 5.000 Zeichen ist FAIL.

**Blind-Kritiker:**
- Neues versioniertes Schema `kfb.song-critic.v2`, die Performance-Kritik; v1 bleibt.
- Frischer, isolierter Prozess. Er sieht nur den eingereichten Kandidaten und eine neutrale Einordnung. Er schreibt keinen Ersatztext.
- **Leitfragen:**
  - Funktioniert die Nummer ohne Vorwissen?
  - Hat der Performer Persönlichkeit?
  - Entsteht eine Geschichte zwischen den Karten?
  - Sind Satire, Konflikt und Arrangement individuell?
  - Landet das Outro?
  - Wäre der Text mit wenigen Änderungen auf ein anderes Deck übertragbar? Das ist ein Warnzeichen.
- **Quellenprüfung** ist ein getrennter Test.
- **Nach je 3–5 Tracks** folgt ein Album-Diversitätsvergleich (nicht blind).

**Regeln:**
- Arbeit auf einem eigenen Branch `ws-song/workshop-r1` ab dem WSA-Song-Branch; nichts auf main.
- Push nur nach WS0-Go; Deploy-Key nur mit Georgs direkter Bestätigung in deiner Sitzung.
- Keine Suno-Credits und keine Audio-Erzeugung ohne Georg; er hört und wählt.
- Meldung je Pilot: Songtext, STYLE, Gate-Report, Kritiker-JSON und kurzer Status in `replies/SONG_WORKSHOP_STATUS.md`.
- Später **Comic Motion:** Performance-Mapping (Karte → Beat → Panel) als Datei je Song, damit WSV bzw. WS1 es nutzen können.
