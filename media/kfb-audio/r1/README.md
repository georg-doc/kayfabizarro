# KFB Ton R1 · Laufzeit-Ablage für das Spiel (Kayfabizarro)

Diese Dateien lädt das Spiel zur Laufzeit über jsDelivr (`cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@<commit>/media/kfb-audio/r1/`), Rückfall raw.githubusercontent, mit festem Commit (`scripts/audio/remote.json` im Spiel-Repo). Veröffentlicht mit Georgs Freigabe vom 23.10.2026 (Musik und Effekte öffentlich).

- `music/suno/`: Georgs eigene Suno-Titel (RoadTrip JukeBox v2), AAC-LC 128 kbit/s.
- `music/cozy/`: Cozy Tunes Classics (Asset-Pack, Creator-Credits wie beim Pack angegeben), AAC-LC 128 kbit/s.
- `el/`: ElevenLabs-Sätze aus KFB (Kampf, Fluffer, Bewohner, Chatterbox-Familien …), Pegel in `index.json`.
- `wsa/`: Racer- und Kampf-Pakete der KFB Audio Site.
- `site/`: Atmo und Schritte der KFB Audio Site (Lizenzen in `site/*/LICENCES.md`).

Erzeugt mit `scripts/audio/encode-music.mjs` und `scripts/audio/site-copy.mjs --publish` (WS-Audio). Nicht von Hand ändern; neue Fassung = neuer Commit, neuer Pin.
