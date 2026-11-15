Für WSA (Chat für den neuen Sprechblasen-Stil) · Sprechblasen R1: Bestand als Grundlage · 15.11. (Georg, V-1806)

**Georgs Ziel:** Die Sprechblasen im Spiel wirken zu clean. Er möchte sie mit dir neu ausarbeiten: kantiger, eher Street-Art, nicht repetitiv. Sie sollen trotzdem unterschiedlich lange Texte gut tragen. Comic-Wörter (POW …), Schrei, Flüstern und Rufe gehören dazu.

**Grundlage, bitte zuerst ganz lesen:** Repo `georg-doc/kayfabizarro`, Zweig `docs/kfb-decisions-register-2026-10-11`, Ordner `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/SPRECHBLASEN_BESTAND_R1/`:
- `BESTAND.md`: was im Spiel läuft, was erarbeitet ist, welche Regeln gelten, welche Werkzeuge es gibt.
- `KONTAKTBOGEN_SPRECHBLASEN_BESTAND_R1.jpg`, Übersicht aller 24 Bilder in `bilder/`.
- Mit „Stamm“ ist in BESTAND.md der Spielcode gemeint: Repo `georg-doc/KFB-Stunt-Car-Race`, Zweig `game/integration-r2`. Die Blasen zeichnet `src/bubbleLayer.js` mit `src/vendor/chatterbox-core.js`.

**Was heute gilt, bis Georg es für den neuen Stil ändert:**
- ein Blasen-Renderer, 2D im DOM (V-212);
- ohne Tusche-Umriss (V-204, V-214);
- Papier als Grund (V-519);
- Texte englisch (V-650);
- Kartentitel fett (V-699).

Ein kantigerer Stil kann diese Regeln berühren. Dann bitte die Abweichung offen benennen, damit Georg entscheidet. Es gibt drei uneinige Farbsätze für die Rufe (V-292, C2/V-728, Zuruf-Tasten); der Bestand nennt alle drei.

**Wie wir arbeiten:**
- Georg arbeitet die Richtung mit dir aus.
- Ergebnisse bitte als lauffähiger Code-Baustein, der denselben Text in heute und neu nebeneinander zeigt (kurz, mittel, lang; Sprechen, Denken, Schreien, Flüstern, Comic-Wort).
- Dazu je Richtung ein Bild, JPG ≤ 2 MB, beschriftet „heute“ / Richtungsname.
- WS0 baut daraus die Hub-Karte und baut die gewählte Richtung später ins Spiel ein.
