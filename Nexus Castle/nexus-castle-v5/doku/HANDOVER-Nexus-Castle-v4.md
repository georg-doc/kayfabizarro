# HANDOVER — Nexus Castle v4 (Terrain & Units) + v5 (Raids)

Stand: 2026-08-14 · Basis: `Nexus Village v3.dc.html` (eingecheckt, v3.12) · Regelwissen:
`BAUKASTEN-TinySwords.md` · Verlauf: `CHANGELOG-Nexus-Village.md`

## Entscheidungen aus dieser Runde
- **Alle drei Packs sind erlaubt** (Update 010 · Free Pack · Enemy Pack). Trennlinie ist nicht das
  Pack, sondern die **Rolle**: Agenten aus Knights (010 + Free), Gegner ausschließlich Enemy Pack,
  UI-Flächen aus **einem** UI-Satz (nicht mischen).
- **Kein Boden-Schriftzug.** Statt „neXus" als Glyphe: eine geplante **Burganlage**.
- **Typo:** Shantell (UI/Fließtext) + `pottymouth_bb` (nur Sprechblasen). Irish Grover gestrichen.
- **Raids sind v5**, nicht v4.

## v4 — Aufgabe 1: Castle-Terrain mit mentalem Modell
Karte als **Anlage**, nicht als Streusiedlung. Ebenen bleiben wie im Baukasten (BG-Wasser → Foam →
Flat Ground → Elevated + Shadow), darüber eine neue Schicht **„Anlage"**:

| Element | Asset | Regel |
|---|---|---|
| Burghof (Zentrum) | Castle_Blue (010) | Burg auf **Elevated Ground**, Hof davor als Sand-Plateau |
| Tore/Eingänge | Gate + Door-Sprites | jedes Gebäude hat **genau einen** Eingang; Weg endet **am Tor**, nie an der Wand |
| Mauern/Zäune | Fences (010) | Zäune begrenzen Höfe und Weiden, nie Wege |
| Wege | Sand-Autotile | Wegenetz **zusammenhängend**: Flood-Fill vom Hof, jede Sackgasse wird angebunden oder entfernt |
| Brücken | Bridge (010) | Wege queren Wasser **nur** über Brücken |
| Weiden | Sheep (Free) | Schafe grasen in Zaunfeldern, eigene kleine Trampelpfade |
| Ressourcen | Gold/Wood/Meat (Free, **animiert**) | Ressourcen-Sprites als **visuelle Metapher** für Artefakt-Kategorien — Gold = Kosten, Holz = Build, Fleisch = Party |
| Grundton | Recolor (nicht Tint) | alle Bauten in **einem** Grundton, Default Blau, als ein Regler |

**Wasser-Lager (Enemy Pack):** Flöße/Boote und Fischer-Gegner in der See, Lager auf kleinen Inseln
mit 4+ Wasserkacheln Abstand zur Hauptinsel. Für v4 nur **Platzierung und Sprites** (statisch, ggf.
als Slice), Verhalten kommt in v5. Auch **Boote für Agenten** mitplanen (Flows über Wasser).

## v4 — Aufgabe 2: Units
- **Alle drei Packs**, jede Figur **nur einmal**; Registry `agentId → unit` (stabil über Sessions).
- Farbe unterscheidet Instanzen desselben Typs — Bauten bleiben einfarbig, **Units dürfen vierfarbig**.
- Free-Pack-Blätter (Lancer, Monk, Pawn-Varianten) **vor Gebrauch messen**: Frame-Größe, Zeilen,
  Idle/Walk-Reihen in den ATLAS eintragen (Falle: 010 = 192 px, Free ≠ zwingend gleich).
- Schafe und Ressourcen-Träger als **eigene Nicht-Agenten-Units** (Ambience, keine Chronik-Einträge).

## v4 — Aufgabe 3: UI-Flächen richtig bauen
Der Kern des offenen Punkts: **Flächen aus UI-Tiles statt CSS-Upscale.** Kanon:
Ecken **1:1**, Kanten **gekachelt**, Mitte gefüllt — das kann `border-image` nicht (skaliert Ecken),
deshalb **Canvas-UI-Kit** (`ui-kit-ts.js`, liegt im Projekt) als HUD-Renderer, Typo mittig in die
**gemessene innere Fläche** gesetzt (nicht ins Sprite-Rechteck). Erst dann darf das Ribbon zurück.

## v5 — Raids
Gegner-Lager greifen die Burg an; ein Raid = **ein kritisches Ereignis** (hohe `criticality`), der
Abwehrkampf ist die Dorf-Darstellung eines Alarms, `Approve/Deny` ist der Freigabe-Beat, der Regler
Mensch↔Autonomie entscheidet, ob die Agenten selbst verteidigen. Braucht Kampfzustand,
Ziel-Priorisierung, Tod/Respawn, Lager-Spawns — eigene Runde.
