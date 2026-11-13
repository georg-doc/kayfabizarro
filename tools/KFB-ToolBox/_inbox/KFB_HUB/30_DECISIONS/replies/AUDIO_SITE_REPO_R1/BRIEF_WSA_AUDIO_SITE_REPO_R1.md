# WSA-Work · Audio-Site einmal ins Repo · 13.11. (Georg q647: Ja)

**Ziel:** Neue Songs und SFX kommen künftig ohne WSA-Lauf auf die Audio-Site kfb-audio.frizzlebob.chatgpt.site. WS0 trägt sie als Datenzeile ein, WSA veröffentlicht nur noch den neuen Stand, wie bei der Spiel-Stage.

**Auftrag (einmalig):**
1. Den heutigen Quellcode der Audio-Site unverändert in den privaten Zweig `site/audio-src` von `georg-doc/KFB-Stunt-Car-Race` legen (Ordner `audio-site/`), mit kurzer README: Aufbau, Bauen, Veröffentlichen.
2. **Songs aus dem einen Katalog:** Die Song-Liste der Site wird beim Bauen aus `40_AUDIO/music_catalog_r1.json` im Zweig `assets/private` desselben Repos erzeugt (fester Commit je Bau, ohne Dropbox; WS0 hält ihn dort aktuell, `ingest_suno.py` schreibt ihn mit; V-841), kein zweiter Song-Katalog. Nur die Site-eigenen Listen (Radio-Sender, SFX-Gruppen, Schritte, BNWN-Clips) kommen in `audio-site/data/site-listen.json`. Felder wie heute; nichts Neues erfinden.
3. **Dateien wie heute:** Die Site lädt weiter aus `kayfabizarro` `kfb-audio`. Bitte in der README festhalten, welches Format sie dort erwartet (heute laut V-1329: −18 LUFS, AAC 128 kbit/s, 48 kHz), damit WS0 künftig genau so liefert.
4. Neuen Stand der Audio-Site aus genau diesem Zweig veröffentlichen, inhaltlich gleich wie heute (Prüfung: Songliste und Sender wie vorher).

**Danach (Ablauf ab jetzt):** Neue Songs liest WS0 wie bisher mit `ingest_suno.py` ein (Katalog), kodiert sie im Format aus der README und legt sie in `kfb-audio` ab; die vier offenen Songs (Warm Room Pulse, Mysterious Horizons, 2-6 Toy Soldiers March, 3-6 The Gilded Cage) sind der erste Lauf. WS0 meldet den Commit in PR #49; WSA holt und veröffentlicht, ohne Code zu ändern.

**Grenzen:** Spiel und Spiel-Stage bleiben unberührt; keine neue Site, kein Zugangsumbau; Audio-Dateien nicht umkodieren (Pegel wie geliefert).

**Rückgabe an WS0 in PR #49:** Zweig-SHA, Liste der ausgelagerten Site-Listen, wie die Song-Liste aus dem Katalog entsteht, veröffentlichte Version der Audio-Site, Kurzbeleg (Songliste und Sender wie vorher).
