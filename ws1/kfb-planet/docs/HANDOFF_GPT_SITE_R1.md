# Übergabe WS1 → WS0/WSA · MVP-Site auf der GPT-Plattform · R1 · 22.10.2026

**Georg 22.10.:** Zielplattform ist die GPT-Site. Ein **WSA-Work-Job** setzt sie mit allen Features auf (Token sparen). Cloudflare Pages ist nur Rückfall (`docs/SITE_SETUP.md`, nicht eingerichtet). WS1 liefert Spiel und Build, WSA die Plattform.

## 1 · Quelle
- **Privates Repo** `georg-doc/KFB-Stunt-Car-Race`, Branch **`game/mvp-r1`**: Spiel-Schnappschuss aus WS1 (`kfb-planet` `ws1/mvp-r1`). Je neuem Stand ein Commit, WS1 meldet ihn.
- **Private Dateien** im selben Repo, Branch `assets/private`: Figuren K11/K12/B17/ORKBAND, Töne, Musik.
- Öffentlich bleibt nichts davon: nie nach `kayfabizarro`, nie in eine öffentliche Vorschau.

## 2 · Bauen (statisch)
```
npm ci && node scripts/site/build-site.mjs        # Node 22
```
- **`ASSETS_TOKEN`** (Lese-Token, nur Contents:Read auf KFB-Stunt-Car-Race): klont `assets/private` flach nach `.private-assets` und hängt es als `src/private` ein. Ohne Token entsteht ein Platzhalter-Build.
- Weitere Schalter:
  - `KFB_SITE_OUT` (Ausgabe, Standard `dist`);
  - `KFB_SITE_AUDIO=0` (ohne Ton);
  - `KFB_AUDIO_CACHE` (Ton-Zwischenspeicher).
- **Ausgabe `dist/`:**
  - `index.html` und `assets/*` (Hash-Namen, unveränderlich);
  - `kfb-audio/*` (WS-Audio `site-copy.mjs`: 341 Dateien, ~242 MB, davon Musik 228 MB, mit `index.json`);
  - `site-build.json` (Bericht);
  - `_headers` (Cloudflare-Format, bitte in Plattform-Caching übersetzen).
- **Größen (Probe 22.10.):**
  - Spiel 83 Dateien, 46 MB, größte Datei 6,75 MB;
  - Ton: keine Datei über 25 MiB.
  - Der Build bricht ab, wenn eine Datei 25 MiB überschreitet. Passt die Grenze der GPT-Plattform nicht, sag es WS1.
- **Freigabe:** Georg 22.10. über WS-Audio: „ja, alles darf auf die Site“ (Suno, gekaufte Cozy Tunes, ElevenLabs). Das gilt nur für die passwortgeschützte Site.

## 3 · Was die Site zur Laufzeit können muss
| # | Funktion | Warum | Vorlage (Cloudflare) |
|---|---|---|---|
| 1 | **Passwort für alle Pfade** (Seite, Dateien, Ton, /raw). Name `georg`, Passwort nur als Plattform-Secret, nie im Repo; ohne Secret gesperrt. | Georg: „erstmal KISS per PW, später E-Mail, wenn wir Spielstände haben“ | `functions/_middleware.js` (Basic-Auth, Hash-Vergleich) |
| 2 | **`/raw/<ref>/<pfad>`-Proxy** → `raw.githubusercontent.com/georg-doc/kayfabizarro/<ref>/<pfad>`; nur GET, nur dieses Repo, Cache (40-hex-Ref unveränderlich, sonst 10 min), optional Token (sobald kayfabizarro privat ist, V-599) | V-618: keine Laufzeit-Abrufe von GitHub im Browser. Das Bündel schreibt im Site-Build raw.githubusercontent und jsDelivr `gh/georg-doc/kayfabizarro@…` auf `/raw/…` um (`src/siteRaw.js`) | `functions/raw/[[path]].js` |
| 3 | **HTTP-Range** für `/kfb-audio/` | Die Jukebox streamt Musik; ohne Range geht es auch, aber Spulen ist langsam | statisch |
| 4 | **Eine Seite, Hash-Adressen** (`#m1,harvest,look=terrain3,world=probe`); keine Server-Routen nötig | – | – |
| 5 | **MIME-Typen** `.glb` model/gltf-binary, `.gltf`/`.json`, `.m4a`/`.mp3`/`.ogg`, `.png`/`.jpg`/`.webp` | GLTF- und Audio-Lader | – |
| 6 | **Externer Abruf erlaubt:** `cdn.jsdelivr.net/npm/pdfjs-dist` (öffentliches Paket, Kartenbilder) | – | – |

## 4 · Offene Fragen an WSA (Plattform)
1. Grenzen: je Datei, gesamt (~290 MB), Anzahl Dateien (~430)?
2. Edge-/Server-Funktionen für #1 und #2: Gibt es sie, und wie werden Secrets gesetzt?
3. Auslöser: Push auf `game/mvp-r1` oder ein Deploy-Befehl? Wer stößt an?
4. Adresse bzw. Domain und Tester-Zugang.

## 5 · Was WS1 als Nächstes liefert (jeweils neuer Commit auf `game/mvp-r1`)
- Fluffer 0,8 m (WS-NPC 5ae84c8) und neue Ton-Commits (WS-Audio) nachmergen.
- Startseite: Ladebalken, Steuerungshilfe, Ton- und Qualitätsregler; die Adresse ohne Hash landet im Spiel.
- Leistung: Qualitätsstufen (dpr 1 / 1,5 / 2), fps-Tabelle aus der Spielkamera, Ziel 60 fps auf Georgs Rechner.
- Kampf: Arena-Module (PR #24/#25/#27), Combat-AV-Prototypen, Baustein „eigener Tod“.
- Danach ein blinder Design- und Gameplay-Kritiker auf der laufenden Site.
