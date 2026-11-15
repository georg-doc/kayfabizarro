Für Claude Design (Website-Chat) · Antwort zu Hero v7 und deinen Fragen · 15.11. (WS0, V-1794)

v7 ist ein großer Schritt: Die Tuschelinie aus Teil-Nummern und die Farbe, die im Raum liegen bleibt, sind genau richtig. Antworten der Reihe nach. Repo-Pfade ohne Angabe liegen in `georg-doc/KFB-Stunt-Car-Race`, Zweig `game/integration-r2`.

**Patch-Quelltext:** Liegt jetzt als Dateien vor: Zweig `ref/patch-spender-r1` @f96ece70 im selben Repo, Ordner `patchwork-quilt/`, `watercolour/`, `coloured-pencil/` (nur Text, Commits in `QUELLE.json`, MIT). Ganze Bausteine darfst du übernehmen: Raum und Lampe aus `patchwork-quilt/src/making/room.js`, den Staub im Lampenlicht aus `patchwork-quilt/src/making/work.js`. LICENSE und Copyright-Zeile gehen mit.

**SSOT-Antworten**
1. **Schnitt:** V-1766 gilt. Es sind acht Schnitte, vier Karten und 21 Schnipsel, an der hängenden Seite (Georg q681).
2. **Kanten-Startwert:** Wähle keinen eigenen. Deck-Karten bekommen ihren Startwert wie im Spiel über `createPackSource({ seedOf })` in `src/card-edge/kfb-card-pack.js` (Kartennummer → seed); Welt-Karten über `cardFor` in `src/world/cardIdentity.js`. Rahmen, Kante und Rückseite kommen aus demselben Kartenmodul (V-1348).
3. **Steuerung:** Quelle ist `src/hostKeys.js`. Kurz: WASD bewegen, Leertaste springen, Q/E seitlich (im Auto Drift), F fliegen. I ist die einzige Interaktionstaste (`ACTION_KEYS.interact`: aufheben, Truhe, Tür, Fahrzeug, reden), V-1474. Die Plätze im HUD stehen in `HUD_BELEGUNG_R1.md` im Register; dessen alte Tastenzeilen (E Kontext, Q Reise-Fächer) sind durch V-1474 ersetzt.
4. **Treffer:**
   - Werte je Waffe stehen in `src/data/combat/<waffe>Reference.r1.json`. Katana: `hitStopMs` 48 in `katanaReference.r1.json`.
   - Den Hit-Stop gibt es nur einmal, über `src/vendor/combat/hit-stop.v1.mjs`: eine Instanz, nur die Beteiligten halten an (V-567). Der Kamerastoß liegt in `src/m1/abilities.jsx`.
   - Wird FB getroffen, gibt es keinen Hit-Stop: Er zuckt im Oberkörper und die Knete staucht (`src/m1/fbTreffer.js`).
5. **Öffentlich:** Bis zur Veröffentlichung baust du alles privat, wie bisher. Figuren und Klänge laufen über das Modell- bzw. Audio-Manifest; die Einträge tauscht WS0 vor dem Veröffentlichen gegen freigegebene (V-470). Die Liste stimmt WS0 vor dem ersten Publish mit Georg ab.
6. **Ton-Kanon:**
   - Klinge: `src/audio/katanaPlan.r1.js`.
   - Karten- und Papier-Hero: die Schichten aus V-1235 in `src/audio/cueMap.js`. Die Rollen stehen in `40_AUDIO/elevenlabs_r1/card_reward_map.r3.json` (Zweig `assets/private`), der Zeitplan in `src/data/cards/kfb-card-hero.r1.json`.
   - Treffer je Waffe: `src/audio/<waffe>Plan.r1.js`. Wähle die Cues aus diesen Plänen, nicht nach Dateinamen.
7. **Soundbett:** Musik aus dem Musik-Katalog `40_AUDIO/music_catalog_r1.json` (Zweig `assets/private`), Raumton aus den Atmo-Betten in `src/audio/cueMap.js` (Gruppe atmo, z. B. `arena.haus.lueftung` mit Schleifenpunkten). Ein Audio-Kontext, Start nach der ersten Geste.
8. **Waffenleiter:** Dein Vorschlag als Tabelle ist willkommen: je Waffe ein Effekt, ein Geräusch und eine eigene Farbe. Die Effekte kommen aus den vorhandenen Treffer-Rezepten des Spiels, nicht selbst gebaut (V-1508). Grundlage sind die Reference- und Plan-Dateien oben. WS0 entscheidet.

**Mimik, Gesten, Clips**
- **Mimik für Nahaufnahmen:** Das Paket ist fertig, nutze es. Sechs Dateien gehören zusammen in **einen** Ordner, weil sie sich gegenseitig mit `./` laden:
  - `src/web/fb/fb_gesicht.v1.js` für Brauen, Lider, Ohren, Blick und 13 Mundformen.
  - `src/web/fb/kfb-haltung.v1.js` für Haltungen, Reaktionen und das Hinwenden zu einem Ziel.
  - `src/web/fb/kfb-choreo.v1.js` für das Format kfb.choreo/1 mit Gefühlen, Auslösern und Ereignissen.
  - `src/modules/ausdruck.js` für Ausdrücke und Stufen, Standard ist cartoon (Georg q684).
  - `src/modules/haltung.js` für Haltungen und Gefühle.
  - `50_BLENDER/FB_WEB_KANON_R1/web/fb_mund.v2.js` (Zweig `assets/private`).
  - Beispiele: `src/web/fb/choreo/fb_katana_schnitt.choreo.json` und die Probeseite `test/web/choreo_probe.html`. Sie lädt three über eine Importmap; den Pfad zu three passt du an.
  - Dein Wunsch übersetzt: Fokus vor dem Hieb = Gefühl `konzentration`, Grinsen danach = Pose `triumph`, Blick in die Kamera = Ziel Kamera mit `blickAuto`.
- **Luft-Kombo:** Kein neuer Clip nötig. Hänge die drei Hiebe in `kfb-choreo` als Spur hintereinander, mit Überblendung.
- **Dash 1 m:** Die Länge kommt aus dem vorhandenen Dash (0,20 m): mehrfach ketten oder den Wurzelweg skalieren. Es wird kein neuer Clip gebaut.
- **Wegstecken:** Bleibt wie in Nachtrag 4. Im Bestand gibt es kein echtes Wegstecken; „Klinge senken“ oder weglassen.
- **Gesten zum Erklären:** Die Gesprächsbibliothek hat 13 Clips, davon 11 Gesten und Reaktionen und 2 Sprech-Schleifen (`50_BLENDER/N35/out/talk_library_r2/KFB_Talk_Library_Rig_Medium.glb`, passt zu FB_WEB_KANON; Zweig `assets/private`), dazu `nicken`, `schulterzucken` und `doppeltake` in `haltung.js`. Karte hochhalten und Halten kommen mit den Kulturtechniken (WSB läuft gerade).
- **Knet-Anzug, Katana als Knete, Hammer:** gehen als nächster WSB-Auftrag raus, sobald die Kulturtechniken zurück sind. Bis dahin bleibt r1f.

**Räume und Escher (WSA):** Den Quellstand mit dem geschlossenen Escher-Kreis (R25) bekommst du über WSA als GitHub-Zweig. Lageplan, `setTime`/`setCamera`, die Wand als Kartenbogen und das Treffer-Ereignis der Zerstörungswand habe ich dort mit angefragt. WS0 meldet sich, sobald es da ist.

**Decks, Texte, Stimme**
- **Hero-Deck:** Bitte drei Kandidaten vorschlagen, je ein Standbild des Hero-Shots mit dem Deck, Dateiname = Deck. Georg wählt im Hub. Bis dahin Protopia.
- **Karten-JSON:** je Deck `registry/assets/v1/decks/<deckId>.json` (Karten, Essay, Song; Repo `georg-doc/kayfabizarro`, `main`, V-363). Nicht vom Bild abtippen.
- **Bauanleitung und Regeln:** Texte der heutigen Seite kayfabizarro.pages.dev wörtlich übernehmen (siehe Brief, Texte).
- **FBs Stimme:** FB-Zeilen schreibt Georg; du schreibst keine. Als Ton-Muster nur Georgs eigene Sätze: „Krazy. Kayfabizarro. … Cut along the dotted lines. Don't eat the cards. I'm a rabbit, not a cop.“ Sign-off „Stay fluffy.“
- **Meta-Erzählung und HeyGen-Wortzeiten:** kommen von Georg. Plane das Ende des Shots offen, mit Karten, die in den Raum fallen.

**Recherche:** Papier in Echtzeit, Kleber/Honig in WebGL, Stop-Motion-Bildraten und Ton in der Zeitlupe recherchiert WS0 jetzt und schickt dir eine kurze Zusammenfassung. Nicht-euklidische Räume folgen mit dem WSA-Stand.
