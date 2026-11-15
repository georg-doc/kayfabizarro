Für Claude Code (Blasen-Sitzung, von WS0 gesteuert, Remotion-Vorschau) · Sprechblasen R2: Papierkante ausbauen, Formlogik, Erzähler-Box, Antworten, Soundwords · 15.11. (Georg, V-1814)

**Kern (3 Zeilen):**
1. Georg hat „Papierkante“ gewählt (Hub q704). Diese Richtung wird jetzt weitergebaut.
2. Die Formen entstehen prozedural bei Endgröße aus Textmaß und Zeilenhöhe. Zufall nur geseedet je Blase und in festen Grenzen. Nie eine feste Form ungleichmäßig strecken oder stauchen.
3. Neu dazu: Erzähler-Box, Spieler-Antworten im Gespräch und besseres Design der Soundwords. Ergebnis als ein Formmodul in reinem JS (für Spiel-DOM, Website und Remotion) plus bewegte Vorschau in Remotion; noch kein Einbau ins Spiel.

**Grundlage:** der R1-Stand „Papierkante“ von WSA (GitHub `georg-doc/KFB-Stunt-Car-Race`, Commit b8f016d5, dort im Ordner `SPRECHBLASEN_BESTAND_R1` unter `replies`: `RETURN.md`, `paper-edge.mjs`, `bubble.mjs`, `DESIGN_NOTES.md`, `TEST_REPORT.md`; lesen mit `git show b8f016d5:<pfad>` im Stamm-Repo `~/kfb-ws0/stamm-wt`, vorher `source ~/kfb-ws0/_env.sh` für den Schlüssel, falls Dateien nachgeladen werden müssen), der Spiel-Renderer `src/bubbleLayer.js` mit `src/vendor/chatterbox-core.js` (Stamm `game/integration-r2`), die Remotion-Regeln im Skill kfb-video (Projekt `KFB_HUB/60_VIDEO/remotion/`), der Bestand `BESTAND.md` (mit `KONTAKTBOGEN_SPRECHBLASEN_BESTAND_R1.jpg`), die Blasen-SSOT `SPRECHBLASEN_SSOT_R2.md` (Zipfel 30/22 bei 900 px für alle Blasen), die Formregeln `SPEC_CARTOON_VFX_SHAPES_R1.md` §2.4 (beide in `replies/`) und die WS0-Recherche `RECHERCHE_BLASENFORM_R1.md` (Repo `georg-doc/kayfabizarro`, Zweig `docs/kfb-decisions-register-2026-10-11`, Ordner `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/SPRECHBLASEN_BESTAND_R1/`). Die Zahlen aus der Recherche sind Startwerte; wo die Spec andere Werte nennt, gilt die Spec.

**Bestand zuerst:** Im Kern `src/vendor/chatterbox-core.js` gibt es schon die Schrei-Form `shoutPath`, die Comic-Wörter-Bank `comicWord` (kfb.comic-word.v1) und die Erzählkästen `caption` und `kayfabulate`; eine Erzählerbox mit Ladezeilen gibt es im Ladevorhang (V-1300). Die Spieler-Antworten zeichnet heute `src/hud/talkLayer.js` · `createAnswerBubbles` (Spalte neben dem Kopf, ohne Farbpunkte, V-1099). R2 baut auf diesen Formen weiter und ersetzt sie nicht stillschweigend.

**Georgs Befunde (15.11.) und was daraus folgt:**
- **Schrei-Zacken:** Sie sollen regelmäßig-unregelmäßig über die ganze Kontur verteilt sein. Einzelne Zacken dürfen nie grotesk breit gezogen werden.
  - Vorschlag aus der Recherche: Grundform als Superellipse aus der Textbox. Die Zackenzahl richtet sich nach dem Umfang, etwa Umfang / (1,9 × Zeilenhöhe). Verteilt wird nach Bogenlänge mit begrenztem Jitter.
  - Die Zackenhöhe hängt nur von der Zeilenhöhe ab (0,75–1,3 × Grundhöhe), nie von der Boxgröße. Täler werden weich gerundet, der Text bleibt in seiner Schutzbox.
- **Gedankenblase:** Sie braucht eine Grundform, auf der die Bögen sitzen. Die Form gibt dem Inhalt Platz und hat Varianz, ohne Stauch- oder Streck-Artefakte.
  - Regeln aus der Spec §2.4: Körper eine Ellipse 1,4–1,7 : 1 eng um den Text, 7–12 Lobes (kleine Blasen 6–8, neu gebaut statt verkleinert), Rhythmus groß–klein–groß–klein–klein, Verhältnis groß : klein 1 : 0,5–0,75, Lobes nach außen gewölbt mit spitzen Einkerbungen, keine Halbkreise auf einem Kreis, nie gleichmäßige Scallops.
  - Die Lobes werden nach Bogenlänge auf der Ellipse verteilt, mit eigenem Seed je Blase, und füllen den Umfang genau.
  - Schweif: 3–4 Kreise, jeweils 0,6–0,7 × des vorigen, kleinster am Kopf, getrennt vom Körper, erster Kreis am nächsten kleinen Lobe.
- **Papierkante:** Die vier Ecken werden je Blase geseedet leicht versetzt und gekippt, das hält sie lebendig und nicht repetitiv. Der Zipfel ist Teil desselben Pfads, setzt mindestens eine Zeilenhöhe vom Eck an und reicht nie in die Textbox.
- **Erzähler-Box:** auf `caption`/`kayfabulate` aufbauen: Kasten ohne Zipfel an der Bildkante, im Papierkanten-Look, klar vom Sprechen unterscheidbar.
- **Spieler-Antworten:** auf `createAnswerBubbles` aufbauen, ohne Farbpunkte (V-1099). Im Gespräch wählt der Spieler aus einer Spalte von höchstens vier kleinen Papierkanten-Kästen neben seinem Kopf. Die aktive Antwort ist erkennbar, zum Beispiel leicht gedreht und angehoben. Die gewählte wird zur Spielerblase.
  - Bedienung: Maus und Tasten 1–4. Heute steuert I den Kontext-Knopf des Gesprächs (`src/hostKeys.js`, `src/npc/WissenHost.jsx` im Spiel-Repo).
- **Soundwords:** Das Design wirkt noch nicht gut.
  - Ausgangspunkt ist die Comic-Wörter-Bank `comicWord` im Kern (vier Klassen); im Spiel läuft heute nur „PLOPP!“ im Kampf (`src/vendor/combat/knet-fx.v1.mjs`).
  - Vorschlag: Einzelbuchstaben mit geseedeter Drehung und Größe, Bogen-Layout, kräftige Kontur, leichte Extrusion, dahinter ein Burst aus derselben Zacken-Logik wie der Schrei.

**Was weiter gilt:**
- Ein Blasen-Renderer, 2D im DOM (V-212).
- Englische Texte (V-650), Kartentitel fett (V-699).
- Papier als Grund (V-519). Zipfel 30/22 bei 900 px für alle Blasen (SPRECHBLASEN_SSOT_R2).
- Ohne Tusche-Umriss an Spielblasen (V-204, V-214). Weicht der Stil davon ab, benenne es offen, Georg entscheidet.

**Rückgabe:**
- Formmodul `src/hud/bubbles/bubbleForm.r2.js` auf eigenem Zweig `ws0/blasen-r2` (nicht im Stamm), mit Testseite, die „R1“ / „R2“ mit denselben Texten (kurz, mittel, lang) nebeneinander zeigt: Sprechen, Denken, Schreien, Flüstern, Erzähler-Box, Spieler-Antworten, Soundword.
- Remotion-Komposition mit dem Aufploppen und Timing derselben Fälle (ein kurzes MP4 je Fall).
- Je Fall ein Bild, JPG ≤ 2 MB, beschriftet „R1“ / „R2“, in `KFB_HUB/30_DECISIONS/replies/SPRECHBLASEN_R2/` mit RETURN.md.
- WS0 baut daraus die Hub-Karte und später den Einbau ins Spiel.
- Regeln für die Sitzung: keine breiten Suchen über Dropbox-Ordner, nur benannte Pfade; Plattenplatz vor jedem Render prüfen (`df -h ~`), ein Ausgabeordner; Server mit stop() beenden.
