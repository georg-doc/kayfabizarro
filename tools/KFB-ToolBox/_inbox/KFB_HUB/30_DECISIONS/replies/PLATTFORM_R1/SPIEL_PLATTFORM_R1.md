# Spiel-Plattform R1 · Ein Repo, zwei Ausgaben, Code-Wort-Presets (WS0 22.11., Georg)

**Georg 22.11.:** spielbar ohne Claude-Konto als eine HTML-Seite; ein Link für alle, das Code-Wort wählt die Konfiguration (z. B. Aqua-Spiel für die Kollegen, Buchmaschine im Infinite Room für Andreas, Open World für Beta-Tester) und legt den Spieler an; Spielstände und Hall of Fame mit Statistiken je Lauf; GPT-Site als Hauptplattform (Persistenz, Backend), Claude-Artefakt fürs gemeinsame Vibe-Coden; GitHub als Single Source of Truth.

## Ein Modell
1. **Quelle:** das Spiel-Repo (game/integration-r2). Alle Module (Aqua, Ride, Mixer, Buchmaschine, Kammer, Open World) hängen hinter Schaltern, wie heute.
2. **Zwei Builds aus derselben Quelle:** `build:artefakt` (eine Seite, Material eingebettet bzw. als Artefakt-Dateien) und `build:gpt-site` (statische Seite plus Backend der GPT-Site). Kein Inhalt lebt nur in einer Ausgabe.
3. **Code-Wort = Preset** (Konzept „Shareable Game Scenes“, kayfabizarro #478): Eingabefeld beim Start. Das Wort wird auf ein Preset abgebildet (Schalter, Startort, Kamera, Look, Musik, Spielmodus). Keine echte Sicherheit, nur eine Tür für Leute mit Link und Wort. Presets als Daten (`src/data/presets/*.json`), auch per Link-Anker (`#szene=…`) aufrufbar.
4. **Spieler und Spielstand:** Beim ersten Start ein Spielername (frei gewählt), dann Spielstand und Läufe unter Code-Wort + Name.
5. **Speicher hinter einer Schnittstelle:** `spielstand.save/load`, `ruhm.eintragen/liste` mit Adaptern:
   - GPT-Site: Backend der Site (Hauptplattform, Hall of Fame für alle, auch ohne Claude-Konto, soweit die Site Gäste zulässt; zu prüfen).
   - Claude-Artefakt: Artefakt-Datenbank (geteilt, aber nur für angemeldete Claude-Nutzer) bzw. Browser-Speicher als Rückfall.
   - Grenze: Ein Artefakt darf keine fremden Server erreichen. Artefakt und GPT-Site haben deshalb getrennte Spielstände; Abgleich höchstens über das Repo, nicht live.
6. **Hall of Fame:** Punkte (Muscheln), Modus, Fisch, Zeit, Treffer, Tode, Ride bis Ende ja/nein; Bestenliste je Modus; persönliche Statistik je Spieler.

## Reihenfolge
1. Heute Abend (Integrations-Slice): Aqua komplett mit Ride und Mixer, Code-Wort-Feld mit zwei Presets (aqua, buchmaschine), Spielername, Spielstand und Hall of Fame über die Schnittstelle, Adapter Browser-Speicher + Artefakt-Datenbank. Ausgabe als Artefakt für Markus (öffentlicher Link + Code-Wort, wenn ohne Konto).
2. Danach WSA Work: GPT-Site-Ausgabe mit Backend-Adapter, gleiche Presets, Sync aus dem Repo.

## Entscheidung Georg (Hub)
- Ausgabe für morgen: Artefakt mit öffentlichem Link + Code-Wort (Hall of Fame nur pro Browser bzw. für Claude-Nutzer) oder gleich GPT-Site (abhängig davon, ob Gäste ohne Konto zugreifen können).
