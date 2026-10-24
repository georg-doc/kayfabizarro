# Übernahmekarte · Deck-Songs („KFB Deck-Songs neu“, frischer Song-Chat)
Stand 24.10.2026 · Format nach `sessions/lead.md` (V-713). Diese Karte ist ein Schnappschuss. Das Logbuch ist `replies/SONG_WORKSHOP_STATUS.md`; die neuesten Abschnitte stehen unten (§23–§32).

## 1 · Auftrag und Grenzen
- **Owner von:**
  - Deck-Songs (Text, STYLE-Vorschlag) und Triplet-Sets bzw. Kartenzeilen je Deck (t1, t4, tr1);
  - Code und Daten in `replies/SSOT_SPOKEN_LINES/` (Lint, Lore-Bereinigung, tr1-Index, Sperrlisten);
  - Opener-Pool nach Haltung und Satzbau (`OPENER_POOL_BY_STANCE_R1`);
  - Writers' Room (Songs, Lessons).
- **Nicht Owner von:**
  - Regeln und Register: WS0 (`TRIPLET_SSOT_R1.md` V-698/699/700, `SUNO_SSOT_R1.md` V-689); Regeländerungen nur als Vorschlag an WS0;
  - Tratsch-Laufzeit und Ruf-Grammatik (WS-NPC);
  - Spiel und Bühnen-Dialog (WS1-Lead);
  - Kartendaten (`media/kfb`, WS1/WS0).
- **Nie:**
  - Suno-Credits oder Audio ohne Georg;
  - etwas auf `main`;
  - nicht additive Pushes;
  - Gate- oder Lint-PASS als Qualität melden;
  - Georg als Boten benutzen.

## 2 · Repo, Zweig, Stand
| Was | Wo |
|---|---|
| Arbeitsstand | `~/kfb-ws1/song/kayfabizarro` (sparse, blobless, direkt, kein Worktree), Zweig `ws-song/workshop-r1` @8c3163ce |
| Pfadpräfix | `R = tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies` |
| Push (additiv, Georg erlaubt) | `git -c credential.helper= -c credential.helper='!'"$HOME/kfb-ws1/bin/gh auth git-credential" push -q origin ws-song/workshop-r1`; vorher `fetch` + `rebase` auf `origin/ws-song/workshop-r1`, danach `ls-remote` = lokal prüfen. Commit-Identität `georg-doc <georg.vonwestphalen@doccheck.com>` |
| Writers' Room | https://claude.ai/artifact/9bSQcnqNd91qKXfhra5puM (Collections `songs`(+`versions`), `cards`, `rules`, `lessons` l01–l19). Ordnung: Welle 0 = vier t4-Piloten; Batch 1 ab Platz 5; Metropolis und MedKayfab in Welle 8 („MED/Körper – später“) |
| Regeln (WS0) | `docs/kfb-decisions-register-2026-10-11` → `R/TRIPLET_SSOT_R1.md`, `R/SUNO_SSOT_R1.md` |
| Kartenquelle | **PDF führt.** Druckdaten = `src/data/cards.json` (kfb-planet, Basis `media/kfb @52adc8f1` + Druckfassung Ego Mania/Mission Control/#59), Kopien in `R/SSOT_SPOKEN_LINES/tr1_cards/` |

## 3 · Bauen und prüfen
- **Kartenzeilen:**

  ```bash
  python3 R/SSOT_SPOKEN_LINES/spoken_line_lint.py <cards.json> <lines.csv> --mode tratsch|song|set
  ```

  0 FAIL ist Pflicht. FAIL bei Doppelpunkt, Klammern, fremden Wörtern, fehlendem Titel, „and then“ und Dubletten. WARN bei Semikolon, Telegrammstil, Mechanik, Länge, Lore-Kopie und Deck-Schablone.
- **Zusätzlich:** `R/triplet_set_check.py` (Kartenwörter; die WS0-Fassung mit V-700 liegt auf dem Register-Zweig).
- **Songs:**

  ```bash
  python3 R/SONGS_WORKSHOP_R1/build_baukasten_song.py <deck>/<deck>.t4.lines.py
  ```

  Das erzeugt `suno.txt`, `triplets.csv` und `lines.json`. Optional danach `gate_report.py` (`song_gate.py` R4.2) und `make_marked.py`.
- **Rückfall-Lore:** `R/SSOT_SPOKEN_LINES/lore_fallback.py` → `clean_lore(title, lore)`.
- **PDF lesen:** Seiten mit Swift/PDFKit rendern (kein poppler auf dem Mac); das Skript steht im Scratchpad bzw. lässt sich nachbauen.
- **Qualität:** prüft nur Georgs Ohr. Vorher jede Zeile laut lesen, einmal mit Opener davor.

## 4 · Laufende Aufträge (Quelle)
- **t4-Songs** (Georg 23.10.: BBBW „passt, Tune später“): BBBW, Embrace Protopia, Bullshit Jobs Uncut, Jung and Shinn. Offen ist der Tune; dabei die restlichen „Titel: …“-Stellen nach V-700 bereinigen.
- **tr1-Tratsch** (Georg 24.10.): 14 Decks mit 697 Zeilen in `R/SSOT_SPOKEN_LINES/TR1_INDEX.json`. Trio Utopia/Dystopia/Protopia laut WS1-Lead im Spiel hinter `lines=tr1`, Abnahme bei Georg. 25 Karten gesperrt (`*.tr1.blocked.json`).
- **WSA-Batch 1 (15 Decks, t1):** pragmatisch als Basis übernommen (Georg 23.10.: „weder Sätze noch Triplets“). Überarbeitung deckweise nach Baukasten, erst nach Georgs Tune an den Piloten.
- **An WS0:**
  - §30: SSOT_SPOKEN_LINES als Code und Daten; acht fehlende Punkte im TRIPLET_SSOT, darunter Rückfall b, Lore-Bereinigung, Dialog A/B, Opener-Einbettung, Sperrliste und „and then“.
  - §31: Opener-Streichungen, Audit, Feld `ending` („What if …?“).
  - §26: großer Opener-Pool aus NotebookLM und Docs.
  - §29: Specs sollen auf das SSOT verweisen.

## 5 · Offen bei Georg bzw. WS0
- **Georg:**
  - Freigabe der 20 Satz-Opener (`into_clause`, z. B. Rumor has it, Turns out) und der 4 Erwiderungen (You said, You call that, That is not, Exactly. And if). Ohne sie hat der Tratsch vor tr1 nur 9 Opener.
  - tr1 für `ai_kayfabe` und `pharaoh_piledriver` (WS1b, Orakel bzw. Urwaldruine)?
  - Sperrliste der 25 Karten bestätigen.
  - Tune der vier t4-Songs.
- **WS0:**
  - §30/§31 übernehmen oder verwerfen;
  - „You with the card in your hand“ aus `opener_pool_r2.py` streichen (Georg);
  - Ruf-Bedeutungen (Georg 24.10., WS1 §162) ins Register;
  - Registry gegen Druck (Ego Mania, Mission Control, Brain Flipper #59) nach main.

## 6 · Sonderregeln (Verweise, nicht abschreiben)
- `R/SONGS_WORKSHOP_R1/ONBOARDING_SONG_WRITING_R1.md` (zuerst lesen), `POSTMORTEM_SONG_PILOTS_R1.md`, `POSTMORTEM_OPENER_TRIPLET_R2.md`.
- `R/TRIPLET_SSOT_R1.md` (V-698/699/700) und `R/SUNO_SSOT_R1.md` (V-689) sind maßgeblich. Ergänzungsvorschläge stehen in `R/SSOT_SPOKEN_LINES/VORSCHLAG_AN_WS0_R1.md`.
- Erst eine Probe von 8–10 Zeilen an Georg, dann skalieren.
- Keine Satzschablone. Kein „Titel:“. Opener bettet ein.
- Kein Klischee- oder Asset-Witz. Heikle Karten sperren.
- Writers' Room: alte Fassung immer unter `versions` ablegen. Lessons nachtragen.

## 7 · Nächster sinnvoller Schritt
Georgs Freigabe der Satz-Opener einholen und an WS-NPC weitergeben. Danach die vier t4-Songs tunen (Doppelpunkt-Stellen) und mit Georg einen Song nach Suno bringen; Credits nur durch Georg. Erst dann Batch 1 deckweise nach Baukasten überarbeiten.
