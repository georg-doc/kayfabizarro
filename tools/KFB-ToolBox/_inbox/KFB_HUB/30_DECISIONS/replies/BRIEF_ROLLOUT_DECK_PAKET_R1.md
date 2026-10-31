# Auftrag Deck Rollout · Deck-Paket Pilot · WS0 · 01.11.2026 (V-1153, V-1147, V-363)
Georg hat `replies/KONZEPT_DECK_PAKET_R1.md` (in `KFB_HUB/30_DECISIONS`) freigegeben: „Ja, Pilot starten“. Lies es zuerst. Du bist Eigentümer des Deck-Pakets, weil Pipeline und Desk bei dir laufen. Der Deck-Analyzer-Prozess zieht zu dir.

**Lesen:** `replies/DECK_ANALYZER_UEBERGABE_R1.md`, `replies/TRIPLET_SSOT_R1.md` §1, im Repo `georg-doc/kayfabizarro` Zweig `data/kfb-deck-analyzer-r1`: `tools/kfb-deck-analyzer/GRADING_R1.md`, `AGENT_BRIEF_R1.md`, `DECK_ABGLEICH_R1.md`.

**Regeln:** Das Druck-PDF führt beim Kartentext. Original-PDFs bleiben unverändert. Keine Textänderung ohne Protokoll, Altwerte bleiben erhalten. ROT-Decks bekommen kein Marketing. Merge nach `main` nur mit Georg. Georgs Prototyp-Ordner liest du nur.

**Platz (V-1146):** Die Platte ist knapp. Je Lauf ein Deck holen, backen, hochladen, lokal abräumen. Keine Repo-Kopien und keine Bildstapel in der Dropbox, keine volle Kopie von `kayfabizarro`: Worktree mit Sparse Checkout und `--filter=blob:none`.

**Pilot, deine drei Decks, dann Stopp:**
1. **Schema und Prüfskript** auf Zweig `data/kfb-decks-ssot` vom Stand `data/kfb-deck-analyzer-r1`: `deck.json`, Bilder, Texte, `prüfung.json`, Kennung `cid:<deck>:<nr>`, wie das Spiel sie nutzt. Schau in `src/data/cards.json` auf `game/integration-r2`, was das Spiel erwartet.
2. **Backen per Skript ohne Modell:** `karte` rund 1366 px und `motiv` rund 700 px als WebP aus dem Druck-PDF, Cover. Motiv-Rechteck automatisch vorschlagen, Stichprobe selbst ansehen. Erste Werkzeuge: dein `render_pdf.swift`, Probe `replies/KARTEN_KUGEL_PROBE_R1`.
3. **Text und Bewertung:** Nur was im Abgleich noch ungeprüft ist, mit Sonnet je Deck, Stichprobe am Bild. Sterne nach GRADING_R1. Liste, wo `grade`, Sterne und deine Scores einander widersprechen; nicht mitteln. Marketing-Scores bleiben Deck-Werte.
4. **Topaz-Test an einem Deck:** Vorhandenes Topaz Gigapixel für eine schärfere Viewer-Größe. Vergleich am selben Kartenausschnitt. Es darf keine Buchstaben erfinden; sonst entfällt die Stufe.
5. **Desk zeigt das Paket**, damit Georg dort prüft.

**Rückgabe an WS0, dann Stopp:** Zweig, Commit, Prüfergebnis. Je Deck Modell, Token, Zeit und Größe; Hochrechnung auf alle Decks. Vorschlag zum Datei-Host mit Begründung. Offene Fragen an Georg in einfachen Worten. Spielanschluss macht WS1 später.
