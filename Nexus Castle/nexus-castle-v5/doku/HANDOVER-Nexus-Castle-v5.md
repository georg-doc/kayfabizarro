# HANDOVER — Nexus Castle v5

Stand: 14.08.2026, Abschluss von **v4**. Datei: `Nexus Castle v4.dc.html` (~3200 Zeilen).
Für v5 eine **Kopie** anlegen (`Nexus Castle v5.dc.html`) und dort weiterbauen — v4 bleibt lesbar.

## Was v4 kann

**Dorf.** Tiny-Swords-Terrain in drei Höhenstufen mit Autotile, Klippen, Treppe, Foam und Schatten.
Ritter-Burg mit Vorplatz, Häuser mit Türen, Wege als Sandmaske, Requisiten, Wasser-Deko, Tageszeit
mit Tint und Fensterlicht.

**Agenten als Helden.** Sieben Einheiten laufen das Wegenetz, arbeiten an Häusern, warten auf Freigabe
(Blase mit Ausrufezeichen), tragen Ressourcen. Approval-Karte, Chronik, Rat, Ampel.

**Wirtschaft.** Holz, Gold, Fleisch mit Abbau-Orten, Trägern, Vorratsstapeln und **Abbaustufen**
(Goldader schrumpft, Baum wird zum Stumpf, Regeneration).

**Fraktionen.** Sieben Fraktionen mit Kader, Lager und Revier (Nexus, Goblin Raiders, Pirate Fish,
Caveborn, Goblins 010, Einzelgänger, Goldmine). Kader-Editor je Held.

**Leylines.** Das Wegenetz als Tuschebahn mit wandernden Punkten, schaltbar (Taste **L**).

**Editor** (Taste **E**). Höhen malen, Gebäude ziehen, Wegpunkte und Kanten, Abbau-Orte, Spawn,
Requisiten, Kader. Undo/Redo 20 tief. Karten-Slots in `localStorage` und JSON-Export/Import
(MapConfig v1 aus Agent-Quest, ergänzt um `nodes`, `decorations`, `camps`).

**Prüfungen R1–R5** laufen nach jedem Editor-Schritt und melden Befunde ins Panel.

## Vor dem ersten Handgriff lesen

1. `BAUKASTEN-Konstruktionsregeln.md` — R1–R6, Sockel-Kollision, Zellregeln.
2. `BAUKASTEN-TinySwords.md` — Terrain-Ebenen, Autotile, Units, Slices, ATLAS, **Karten-Daten**,
   **Leylines**, **Leistungsregeln**. Die letzten drei Abschnitte sind für v5 die wichtigsten.
3. `CHANGELOG-Nexus-Village.md` — Bugnummern bis #67 und die Lehren dazu. Neueste Runde oben.

## Fahrplan (konsolidiert, Stand 14.08.2026)

Aus der Abschluss-Ansage des Users sortiert. Reihenfolge ist eine **Empfehlung**, keine Festlegung —
die Begründung steht jeweils dabei.

### v5 — „saubere Mappe, die Stefan präsentieren kann"

Der User hat das Ziel selbst benannt: erst eine vorzeigbare Karte, danach Details im Editor. Alles
hier zahlt darauf ein, und nichts davon braucht neue Systeme.

1. **Wege wirklich verbinden.** Es gibt Wegstücke, die aneinander vorbeilaufen und keine Verbindung
   bieten, dazu abgebrochene Stummel und fehlende Sandfelder. `segCrossesClaim()` und die Türfelder
   sind aus v4.5 da, aber **Anschluss** ist ungeprüft: eine Kante kann gemalt sein, ohne dass der
   Graph zusammenhängt. Kandidat für eine neue Prüfung (R6: „jeder Wegpunkt erreicht den Marktplatz").
2. **Ein Weg hinauf zur Burg.** Aktuell keine echte Anbindung nach oben — „dass da auch ein bisschen
   was passiert". Braucht Treppe plus Kante plus Türfeld, alle drei Teile existieren.
3. **Treppe von der Seite** und mehr Höhenvielfalt. Ausdrücklich als Editor-Arbeit gedacht („was ich
   im Editor bauen will"), also: erst prüfen, ob die Werkzeuge das hergeben, dann fehlende ergänzen.
4. **Mehr Türme und Bauten** hinstellen. Reine Platzierung, sobald 1–3 stehen.
5. **Platzierungsvorschläge im Editor.** „Vor die Tür könnte ein Weg zum Marktplatz." Die Regeln
   R1/R2 stehen — der Editor kann sie als **Vorschlag** anbieten statt nur als Befund.

### Nach der Card Zone — Raids (Ansage des Users, v5-Reihenfolge geändert)

Eigene Scheibe, ausdrücklich **nicht halbfertig** einbauen.

- **Beschädigte Fassungen zuerst.** Der brennende, einstürzende Turm ist noch gar nicht im Register.
  v4.5 hat den Partikeleffekt am **intakten** Wachturm entfernt, weil ein intaktes Dach nicht brennt —
  ein Zustand braucht seine Fassung, nicht nur einen Effekt. Der User schlägt das als eigene Scheibe vor.
- **Gegner ziehen los.** Die Fraktions-Einheiten stehen und atmen (Ansage v4.4). Ein Raid braucht Weg
  aus dem Revier, Ziel, Rückweg.
- **Kampf oder Bedrohung?** Zu klären: Kampf zeigen oder nur die **Drohung** (Gegner am Rand, Alarm in
  der Ampel, Helden ziehen sich zurück). Das Zweite passt besser zum Agenten-Bild.
- **Ampel und Chronik** haben den Alarm schon; ein Raid läuft dort auf, nicht in einem neuen Panel.

### v5-Kandidat — anfassbare Leylines („Gummitwist")

Neuer Wunsch, spielerisch zuerst, später funktional: die wandernden Punkte **greifbar** machen, Bahnen
neu legen, Knoten miteinander verbinden — und wenn man beim Ziehen keinen echten Punkt trifft, soll die
Linie sich spannen und **zurückschnalzen**.

Warum das klein ist: die Geometrie liegt schon vor (`_ley` mit `pts`/`wid` je Kante), der Editor kann
Wegpunkte und Kanten bereits setzen und verbinden, und `snapWalkable()` entscheidet schon, wo ein Punkt
liegen darf. Zu bauen ist im Kern das **Greifen** (Treffertest gegen `leyAt()`) und das Zurückschnalzen
(eine Feder auf der Auslenkung, die `leyOff()` heute statisch berechnet). Das ist zugleich die
natürliche Brücke zur Card Zone: dort werden Feeds verbunden, hier lernt man die Gestik dafür.

### v6 — Card Zone oben links (vorgezogen vor Raids)

Der grösste neue Block, vom User selbst nach v6 gelegt. Neue Karten erscheinen oben links, ziehen die
**Aufmerksamkeit von Agenten und Gegnern** auf sich; die Figuren versammeln sich „wie um einen
Kühlschrank" und **interpretieren in kurzen Dialogen**, was diese Karte in ihrer Landschaft bedeutet.
Die Karte stellt gleichzeitig das JSON-Objekt dar und ist der Anlass für Mikro-Interaktionen.
Eingebunden über die **standardisierte Ink-Outline**.

**Ausbaustufen, wie der User sie beschreibt:** das Card-Embed kann später ein **Nexus-PDF-Embed** sein,
über das die Units — Menschen **und** Gegner vereint — mit wechselnden Kommentaren aus einem Pool oder
vom LLM in Sprechblasen kommentieren, emergent-humorvoll bis absurd. Danach ein **Gedächtnis**:
Wiedererkennen von Karte, Slide oder PDF und Bezug zu bereits Gesehenem — später auch
YouTube-Transkripte oder eine URL-/RSS-Quelle als Saat.

Das sind drei Systeme auf einmal — Karten-UI im Ink-Kanon, ein Aufmerksamkeits-/Versammlungsverhalten
und ein Dialogsystem. Quellen dafür:
- `skills/EMBED_KFB_CardBuilder_Ink_FULL_v1.md` — Card-Zone-Embeds.
- `skills/SSOT_Card_Ink_Outline_v2.md` — Ink-Linien, Panel-/Karten- und Button-Outlines.
  Projektkopie: `uploads/KFB Baukasten v1/onboarding-tinyswords_2026-08-14/03_INK_OUTLINE_KANON_v2.md`.

### Weiter im Rückstand (unverändert offen)

- **Wetter-Regler** neben der Tageszeit-Wahl (Regen, Schnee, Nebel). Die Uhr ist schon ein Knopf mit
  Day/Night/Cycle; der Platz daneben ist dafür gedacht.
- **Aktivitäten an Tageszeiten koppeln** (Units arbeiten tags, schlafen nachts).
- **Sidescroller-Assets** als bewusster Stilbruch:
  `media/2D_Assets/TreasureHunters`, `Pirate_Bomb`, `Kings_and_Pigs` (letzterer im Repo derzeit leer).
- **KFB-Ink für die UI** (Panels, Karten, Buttons). Die Leylines folgen dem Kanon schon, die UI nicht.
- **Sprite-Fusion-Konverter** (fremde Tilemap-Exporte einlesen) — seit v4.3 offen.
- **Atlas statt 40 Einzel-Requests** — grösster Hebel für die Ladezeit.

## Offene Baustellen aus v4 (ehrlich)

- **Ladezeit über 10 s.** 40+ Sprite-Blätter einzeln per raw-URL. Ein Atlas ist der grosse Hebel.
  Betrifft den Aufbau, nicht die Bildrate.
- **Leistung nicht am Bild abgenommen.** Die vier Befunde aus v4.8 (Kollisionsraster, React-Takt, dpr,
  Baum-Prüfung) sind aus dem Code hergeleitet und gerechnet, nicht gemessen — die Vorschau antwortete
  auf keine Messung mehr. Erste Aufgabe in v5: **im laufenden Bild nachmessen.**
- **Optik der Leylines nie abgenommen.** Weder ich noch der Prüfer konnten in einer verborgenen
  Vorschau einen Frame erzwingen. Beim ersten Blick prüfen, ob Strichbreite und Punkte sitzen.
- **Stufige Sandkanten.** Die Maske ist 64-px-gerastert, Diagonalen wirken treppig. Braucht eine
  Zwischenkachel-Ebene.
- **Ein Gebäude fällt perspektivisch raus** (User-Befund, von mir nicht identifiziert — Schmiede oder
  Wachturm? beim ersten Blick klären).
- **Screenshots verloren.** Ich habe beim Aufräumen `screenshots/` komplett gelöscht (72 Dateien);
  die Verweise in `QA-Nexus-Village-v3.md` und im Changelog zeigen ins Leere. Belege zum aktuellen
  Stand lassen sich neu aufnehmen, die alten Bug-Zustände sind weg.

## Regeln, die nicht verhandelbar sind

- **Was der Editor anfassen kann, ist Daten** (`mapLvl`, `mapNodes`, `mapDeco`, `mapCamps`, `kader`).
  `buildWorld()` darf nichts davon neu auswürfeln.
- **Ein Schreibweg pro Ziel**: Positionen über `snapWalkable()`, Serialisierung über
  `mapConfig()`/`applyConfig()`, Handlungsmeldung über `edDo()`, `edDirty = true` nach jedem Schritt.
- **Befund statt stummer Korrektur.** Prüfungen melden, sie reparieren nicht.
- **Pro Frame nichts Langes.** Neue Schleife → Sichtfenster und Index prüfen (Leistungsregeln).
- **Nur Inline-Styles**, Template-Holes nur Dotted-Paths, Klassenfelder nie `props`/`state`/`refs`.
