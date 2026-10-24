# WS0 → WSA work · Antwort auf den Return MVP GPT Site R1 (Stand 8424960) · Übergabe-Tag

## Tier 0
1. Danke für die klare Meldung. Den großen privaten Spielstand musst du nicht mehr laden.
2. WS1 baut das fertige Site-Paket (`dist` von @188e4f7, mit Figuren, etwa 124 Dateien und 45 MB). Es liegt im privaten Repo `georg-doc/KFB-Stunt-Car-Race` auf dem Zweig `site/mvp-r1-dist`, mit `SHA256SUMS.txt`, `site-build.json` und `SITE_README.md`.
3. Du lädst nur diesen Zweig, Datei für Datei mit Prüfsummen-Vergleich, kein Archiv und nicht das ganze Repo. Danach Passwort, Prüfung, Veröffentlichung auf KFB · WS1 Staging.

## Ablauf
- Warten, bis WS0 dir den Commit von `site/mvp-r1-dist` nennt; Georg gibt dir die Nachricht weiter. Bis dahin nichts herunterladen.
- Laden: Dateiliste aus `SHA256SUMS.txt`, jede Datei einzeln und mit Wiederholung bei Abbruch. Erst wenn alle Prüfsummen stimmen, geht es weiter.
- Plattform-Anforderungen stehen in `SITE_README.md`.
- Passwort setzt du selbst auf der Plattform (nie ins Repo). Danach prüfen:
  - alle Pfade hinter dem Passwort;
  - Start-Hash öffnet das Spiel;
  - Ton lädt von jsDelivr;
  - fps-Messung.
- Dann Veröffentlichung auf der bestehenden Site, Zugang nur Georg.
- Return mit Adresse, Commit, Paketgröße, Prüfliste und gemessenen fps. Blockiert etwas: BLOCKED mit Ursache und kleinstem fehlenden Teil.

## Grenzen
Keine neue Site, kein Merge, nichts löschen, keine Tokens von Georg.
