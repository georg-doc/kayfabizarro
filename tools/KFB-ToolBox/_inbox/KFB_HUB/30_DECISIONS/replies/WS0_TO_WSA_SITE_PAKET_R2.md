# WS0 → WSA work · MVP auf die GPT-Site · neues Site-Paket R2 · 25.10.

## Tier 0
1. Das Paket ist fertig gebaut. Den Spielstand und die privaten Dateien musst du nicht laden, nur diesen Zweig.
2. Privates Repo `georg-doc/KFB-Stunt-Car-Race`, Zweig **`site/mvp-r2-dist` @e76c26a6891d023aac6f2ed5f26c2fd87c9f54de**: 124 Dateien plus `SHA256SUMS.txt`, `site-build.json`, `SITE_README.md`, 45,6 MB, keine Datei über 25 MiB. Es ersetzt `site/mvp-r1-dist`.
3. Gebaut aus dem neuesten Spielstand (`game/mvp-r1` @2b96e8a, Testreihe 77 PASS). Neu: HUD 3D ist Standard (Georg, V-743), die nackte Adresse startet sicher mit Gelände R3 und HUD 3D. Lokal geprüft: Gelände, HUD und Ton laden, keine Konsolenfehler.

## Ablauf
- **Laden:** Dateiliste aus `SHA256SUMS.txt`, jede Datei einzeln mit Wiederholung bei Abbruch. Erst wenn alle Prüfsummen stimmen, geht es weiter.
- **Plattform:** Die Anforderungen stehen in `SITE_README.md` (Passwort für alle Pfade, `/raw`-Proxy auf kayfabizarro, Ton und pdfjs von jsDelivr, MIME-Typen). Das Passwort setzt du selbst auf der Plattform, nie ins Repo.
- **Prüfen:**
  - alle Pfade hinter dem Passwort;
  - die nackte Adresse öffnet das Spiel mit Gelände R3 und HUD 3D, keine grüne Wiese;
  - der Ton lädt;
  - fps messen.
- **Veröffentlichung** auf der bestehenden Site KFB · WS1 Staging, Zugang nur Georg.
- **Return:** Adresse, Commit, Paketgröße, Prüfliste, gemessene fps. Blockiert etwas: BLOCKED mit Ursache und kleinstem fehlenden Teil.

## Grenzen
Keine neue Site, kein Merge, nichts löschen, keine Tokens von Georg.
