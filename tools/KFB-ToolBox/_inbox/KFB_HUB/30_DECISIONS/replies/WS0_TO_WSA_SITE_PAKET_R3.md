# WS0 → WSA work · Nachtrag zum Site-Paket R2 · R3 mit neuen Spielteilen · 25.10.

## Tier 0
1. **Erst R2 fertig einbinden, prüfen und veröffentlichen** wie im letzten Auftrag (b214). Danach dieses R3, auf dieselbe Weise.
2. **Paket R3:** privates Repo `georg-doc/KFB-Stunt-Car-Race`, Zweig `site/mvp-r3-dist` @98c40295587727d6f5df0297d8c45425ece519ee, 626 Dateien plus `SHA256SUMS.txt`, `site-build.json`, `SITE_README.md`, etwa 68 MB, keine Datei über 25 MiB.
3. **Neu, alles hinter Schaltern:** Auto live rufen und verlassen (`mount=live`, Taste X) und die HyperNorm-Sphäre H15 (`h15=1`, eigene Seite unter `h15/`) und Georgs HeyGen-Clips (Fahrzeug beim Rufen, Orakel-Ort mit `loci=1`, Ordner `heygen/`). Der Standard ohne Schalter bleibt wie in R2.

## Ablauf
- Laden Datei für Datei nach `SHA256SUMS.txt`, mit Wiederholung bei Abbruch.
- Die Plattform-Anforderungen und die Prüfliste stehen in `SITE_README.md`. Neu ist der Ordner `h15/`: hinter dem Passwort, MIME für `.html`/`.js`, externer Abruf von three.js (jsDelivr), Google Fonts, Wikisource und archive.org.
- Testadresse für Georg: `#m1,harvest,look=terrain3,world=probe,hud=3d,mount=live,h15=1,loci=1`
- Return mit Adresse, Commit, Prüfliste und fps. Blockiert etwas: BLOCKED mit Ursache und kleinstem fehlenden Teil.

## Grenzen
Keine neue Site, kein Merge, nichts löschen, keine Tokens von Georg.
