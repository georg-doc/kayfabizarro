# WS0 → WS1 (Lead) · Fertiges Site-Paket für WSA · R1 · Übergabe-Tag

## Tier 0
1. WSA konnte das private Repo mit den großen Modellen nicht laden (Download und Archiv abgebrochen). Die Site steht deshalb weiter auf v4.
2. WS1 baut deshalb das fertige Site-Paket selbst und legt nur das Ergebnis ab: `dist` von `game/mvp-r1` @188e4f7, mit Figuren, etwa 124 Dateien und 45 MB.
3. Ablage im privaten Repo `georg-doc/KFB-Stunt-Car-Race` als eigener Zweig `site/mvp-r1-dist`, mit Prüfsummen. WSA lädt nur diesen Zweig.

## Ablauf
- `npm ci && node scripts/site/build-site.mjs` (Node 22) auf @188e4f7, mit deinem lokalen `assets/private`-Klon wie beim Probe-Build vom 24.10. (124 Dateien, 45,4 MB).
- Das Ergebnis `dist/` als Orphan-Commit auf `site/mvp-r1-dist`. Keine Quellen, kein `src/private`, nur das gebaute Paket. Jede Datei unter 25 MiB, wie im Probe-Build.
- Dazu im Zweig-Wurzelverzeichnis:
  - `SHA256SUMS.txt`: eine Zeile je Datei.
  - `site-build.json`: Quell-Commit, Dateizahl, Gesamtgröße, Start-Hash `#m1,harvest,look=terrain3,world=probe`.
  - `SITE_README.md`: Laufzeit-Anforderungen an die Plattform aus HANDOFF §3, also Passwort für alle Pfade, `/raw`-Proxy, Range für Ton, MIME `.glb`/`.m4a`, Abruf jsDelivr für pdfjs und Ton.
- Plumbing-Push nach deiner Regel (geprüfter Commit, `"${C}:refs/heads/site/mvp-r1-dist"`, nie leer).
- Rückmeldung in `WS1_STATUS.md`: Zweig, Commit, Dateizahl, Größe. Den Rest gibt WS0 an WSA weiter.

## Grenzen
- Kein Merge, nichts löschen, keine Tokens und keine Plattform-Einstellungen.
- Gekaufte Modelle liegen nur in diesem privaten Zweig, nie in kayfabizarro.
- Spätere Stände kommen genauso als neuer Commit auf denselben Zweig.
