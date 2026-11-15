Für WSA (Sprechblasen-Chat) · Sprechblasen R2: Papierkante ausbauen, Formlogik, Erzähler-Box, Antworten, Soundwords · 15.11. (Georg, V-1814)

**Kern (3 Zeilen):**
1. Georg hat „Papierkante“ gewählt (Hub q704). Diese Richtung wird jetzt weitergebaut.
2. Die Formen entstehen prozedural bei Endgröße aus Textmaß und Zeilenhöhe. Zufall nur geseedet je Blase und in festen Grenzen. Nie eine feste Form ungleichmäßig strecken oder stauchen.
3. Neu dazu: Erzähler-Box, Spieler-Antworten im Gespräch und besseres Design der Soundwords. Ergebnis wieder als lauffähiger Vergleich, noch kein Einbau ins Spiel.

**Grundlage:** dein R1-Stand (`replies/SPRECHBLASEN_BESTAND_R1/RETURN.md` im Repo `georg-doc/KFB-Stunt-Car-Race` @b8f016d5), dazu die WS0-Recherche `RECHERCHE_BLASENFORM_R1.md` (Repo `georg-doc/kayfabizarro`, Zweig `docs/kfb-decisions-register-2026-10-11`, Ordner `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/SPRECHBLASEN_BESTAND_R1/`). Mit „(Wissen)“ markierte Werte sind Startwerte.

**Georgs Befunde (15.11.) und was daraus folgt:**
- **Schrei-Zacken:** Sie sollen regelmäßig-unregelmäßig über die ganze Kontur verteilt sein. Einzelne Zacken dürfen nie grotesk breit gezogen werden.
  - Vorschlag aus der Recherche: Grundform als Superellipse aus der Textbox. Die Zackenzahl richtet sich nach dem Umfang, etwa Umfang / (1,9 × Zeilenhöhe). Verteilt wird nach Bogenlänge mit begrenztem Jitter.
  - Die Zackenhöhe hängt nur von der Zeilenhöhe ab (0,75–1,3 × Grundhöhe), nie von der Boxgröße. Täler werden weich gerundet, der Text bleibt in seiner Schutzbox.
- **Gedankenblase:** Sie braucht eine Grundform, auf der die Bögen sitzen. Die Form gibt dem Inhalt Platz und hat Varianz, ohne Stauch- oder Streck-Artefakte.
  - Vorschlag: Superellipse um den Text, Bögen nach Bogenlänge mit Radius 0,8–1,25 × Grundradius, die Radien gemeinsam so skaliert, dass sie den Umfang genau füllen, leichte Überlappung.
  - Drei Schweif-Kreise zum Kopf.
- **Papierkante:** Die vier Ecken werden je Blase geseedet leicht versetzt und gekippt, das hält sie lebendig und nicht repetitiv. Der Zipfel ist Teil desselben Pfads, setzt mindestens eine Zeilenhöhe vom Eck an und reicht nie in die Textbox.
- **Erzähler-Box:** Kasten ohne Zipfel an der Bildkante, im selben Papier-Look, klar vom Sprechen unterscheidbar.
- **Spieler-Antworten:** Im Gespräch wählt der Spieler aus einer Spalte von höchstens vier kleinen Papierkanten-Kästen neben seinem Kopf. Die aktive Antwort ist erkennbar, zum Beispiel leicht gedreht und angehoben. Die gewählte wird zur Spielerblase.
  - Bedienung: Maus und Tasten 1–4. Heute steuert I den Kontext-Knopf des Gesprächs (`src/hostKeys.js`, `src/npc/WissenHost.jsx` im Spiel-Repo).
- **Soundwords:** Das Design wirkt noch nicht gut.
  - Vorschlag: Einzelbuchstaben mit geseedeter Drehung und Größe, Bogen-Layout, kräftige Kontur, leichte Extrusion, dahinter ein Burst aus derselben Zacken-Logik wie der Schrei.
  - Comic-Wörter gibt es heute nur als „PLOPP!“ im Kampf (`src/vendor/combat/knet-fx.v1.mjs`).

**Was weiter gilt:**
- Ein Blasen-Renderer, 2D im DOM (V-212).
- Englische Texte (V-650), Kartentitel fett (V-699).
- Papier als Grund (V-519).
- Ohne Tusche-Umriss an Spielblasen (V-204, V-214). Weicht dein Stil davon ab, benenne es offen, Georg entscheidet.

**Rückgabe:** lauffähiger Vergleich „R1“ / „R2“ mit denselben Texten (kurz, mittel, lang). Gezeigt werden Sprechen, Denken, Schreien, Flüstern, Erzähler-Box, Spieler-Antworten und Soundword. Dazu je ein Bild, JPG ≤ 2 MB, beschriftet „R1“ / „R2“, und RETURN.md wie in R1 im Repo. WS0 baut daraus die Hub-Karte und später den Einbau ins Spiel.
