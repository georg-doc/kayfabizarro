# ONBOARDING — neuer Chat (Nexus Castle)

**Stand: 14.08.2026 — v4 ist abgeschlossen.** Nächster Strang ist **v5 (Raids)**.
Dieser Text ist der Einstieg: Stand, erste Aufgabe, Lesereihenfolge, Housekeeping.

## Erste Aufgabe im neuen Chat

**Nachmessen, was in v4.8 nicht abgenommen wurde.** Die vier Leistungsbefunde der letzten Runde
(Kollisionsraster, React-Takt, `devicePixelRatio`, Baum-Prüfung) sind aus dem Code hergeleitet und in
ihrer Größenordnung gerechnet — aber die Vorschau antwortete zuletzt auf keine Messung mehr, auch
triviale Abfragen liefen in den Timeout. Also: Seite öffnen, `document.visibilityState` prüfen, dann
Bildrate und Zeichenbefehle je Frame messen. Danach entscheiden, ob der Atlas (Ladezeit) oder Raids
(Inhalt) dran ist.

Beim ersten Blick auf das Bild mitprüfen:

- Sitzen die **Leylines**? Dünner Strich (Bauch 2,6 px), Tapering nur an echten Netzenden, zwei
  wandernde Punkte je Kante. Optisch nie abgenommen — die Fassung davor war zu dominant und die
  Fassung davor falsch (gefüllte Bänder).
- Welches **Gebäude** fällt perspektivisch raus? Der User hat es benannt, ich habe es nicht
  identifiziert. Vermutlich Schmiede oder Wachturm — nachfragen statt raten.
- Läuft es **abends und nachts** genauso flüssig wie mittags? Himmel-Tint und Nacht-Glut hatten bis
  zuletzt kein Sichtfenster; das ist behoben, aber ungemessen.

## Lesereihenfolge

1. `HANDOVER-Nexus-Castle-v5.md` — was v4 kann, was v5 soll, alle offenen Baustellen.
2. `BAUKASTEN-Konstruktionsregeln.md` — globale Regeln R1–R6: Eingang von unten, keine
   Überlappungen, Sockel-Kollision, Zellregeln, Prüfliste. **Vor dem Bauen lesen.**
3. `BAUKASTEN-TinySwords.md` — mentale Modelle und HowTos: Terrain-Ebenen, 4×4-Autotile-Tabelle,
   Foam und Schatten als Stempel, Units, 9-Slice/3-Slice, ATLAS, FX, Tageszeit, Fallen. Dazu die drei
   Abschnitte, die in v4 dazugekommen sind: **Karten-Daten**, **Leylines**, **Leistungsregeln**.
4. `CHANGELOG-Nexus-Village.md` — additiver Verlauf mit Bugnummern bis #67 und den Lehren dazu.
   Neue Runde = neuer Eintrag oben, nie umschreiben.
5. `github.md` — Repos, Pfade, letzter Sync.

## Dateien

- `Nexus Castle v4.dc.html` — aktueller Stand, ~3200 Zeilen. Für v5 **kopieren**, nicht überschreiben.
- `Nexus Village v3/v2/v1.dc.html` — ältere Stände, nur zum Nachschlagen.
- `HANDOVER-Nexus-Castle-v4.md`, `HANDOVER-Nexus-Village-v3.md` — Vorgänger-Handovers.
- Vorlage/Briefing: `uploads/HANDOVER_Nexus-Village_Coworker-Kickoff.md`.

## Assets

Alles per raw-URL aus `georg-doc/kayfabizarro` (`media/2D_Assets/...`, dazu die Skills unter
`skills/`) und `georg-doc/lietz-nexus`. **Nichts dauerhaft ins Projekt kopieren** — Messkopien nach
Gebrauch löschen. Genaue Pfade und alle gemessenen Blattmaße stehen im Baukasten; die Framezahlen sind
gemessen, nicht geraten (Idle- und Run-Blatt derselben Einheit haben oft verschiedene Framezahlen).

## Housekeeping (jede Runde)

- Änderungen, gefundene Bugs und Lehren in den **Changelog** (additiv, neuer Eintrag oben).
- Regelwissen (Assets, Slices, Tile-Logik, Leistung) in den **Baukasten**, nicht in den Changelog.
- `github.md` `## Last sync` aktualisieren, wenn aus einem Repo gelesen oder importiert wurde.
- Handover nur bei echtem Versionssprung neu schreiben.

## Verbindliche User-Entscheidungen

Pixel-Dorf statt Dashboard-Chrome · alle Prozesse als In-Game-UI · Shantell Sans · Tileset-Logik strikt
nach Pixel-Frog-Guide · Overlays dürfen das Dorf nicht zudecken · Units bringen ihren Schatten mit ·
Partikel-FX gern absurd, aber **nie hinter einer intakten Fassade** · Gegner-Raids sind v5, nicht
halbfertig einbauen · bei Leistungsfragen ist eine pragmatische Lösung ausdrücklich erlaubt.
