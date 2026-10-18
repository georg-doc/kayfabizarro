# WS0 → WSA (kfb-triplets-Plugin) · Songs R5.3 „Ein Track je Deck“ (18.10.2026 · V-528)

Georg:
- „Als Variante (Standard) gerne einen Track je Deck.“
- „Bei Decks mit zu vielen Karten oder Zeichen ein Best-of bauen und dabei auf Flow, Punch und Dramaturgie optimieren.“
- „Ich will mit den 60 Credits möglichst viele verschiedene Decks mit unterschiedlichen Musikstilen ausprobieren.“

## Regeln
- **Spec:** `replies/SONG_SPEC_R3.md`, jetzt R3.7, Regel 12b neu. Alle übrigen Regeln gelten weiter:
  - Writer's Room V-361;
  - Stile rein musikalisch V-362;
  - Schluss „Stay Fluffy, Folks!“;
  - Erzähler unbenannt;
  - Ton-Check 16b;
  - Opener-Regeln.
- **Ein Track je Deck**, unter 5000 Zeichen inklusive Intro und Outro.
- **Best-of**, wenn das Deck nicht passt:
  - Auswahl nach Flow, Punch und Dramaturgie: Kaltstart-Hook, Aufbau, Steigerung, Wendung, Höhepunkt, Landung.
  - Die These des Decks muss erkennbar bleiben. Gesungen wird in Deck-Reihenfolge.
  - In `songlines.json` steht `"bestOf": [Kartennummern]`, dazu 3–6 Zeilen Begründung, welche Karten warum tragen.
- **Gate:** `replies/song_gate.py` R3.7 prüft mit `bestOf` genau die ausgewählten Karten (`python3 song_gate.py lyrics <track.suno.txt> --deck <deck.json> --songlines <x.songlines.json>`).
  - Danach ein blinder Kritiker wie bisher.
  - WS0 macht die Endprüfung und stellt die Karten in den Hub.
- **Stil-Matrix:**
  - Jedes Deck bekommt einen eigenen Musikstil, kein Stil doppelt im Batch.
  - Die Breite ist gewollt, z. B. Ska, Delta-Blues, Polka-Punk, Chiptune-freier Synthwave, Bossa, Gospel, Sea Shanty, Bollywood-Disco, Krautrock, Bluegrass, Afrobeat, Baroque-Pop, Trap-Musical, Mariachi.
  - Der Stil passt zum Thema bzw. zur Bühne des Decks, ist aber nie reine Illustration.
  - Stiltext rein musikalisch, ohne Story-Requisiten (V-362).
  - Je Track **eine** Hub-Karte mit STIL und LYRICS (wie b120–b135).

## Umfang Batch 1
- **20 Decks**, bevorzugt solche ohne Song bisher. Liste mit Kartenzahl, Zeichenschätzung, Best-of ja/nein und Stil vorab in `WSA_SONGS_BESTOF_R1_PLAN.md`, Georg sieht sie im Hub.
- **Credits:** Georg hat etwa 60. Plan: 1 Credit je Track, 20 Tracks im ersten Batch, der Rest bleibt für Wiederholungen und Batch 2.
- **Kanonischer Kartentext** aus den Druck-PDF-JSONs. Decks ohne kanonischen Druckstand erst gegen das PDF prüfen oder zurückstellen.

## Rückgabe
Branch `wsa/songs-bestof-r1-<datum>`, Rückmeldung `WSA_SONGS_BESTOF_R1_RETURN.md`: je Deck Track-Datei (`.suno.txt`), `songlines.json` (mit `bestOf`), Gate-Ausgabe, Kritiker-JSON, Stiltext.
