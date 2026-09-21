# HANDOVER — Nexus Village v3 (POC)

Stand: 2026-08-14 · Datei: `Nexus Village v3.dc.html` · Vorgänger: v2 (Tile-Logik, In-Game-UI), v1 (dunkle Chrome).
Quellen: Pixel-Frog-Tilemap-Guide, Fork `georg-doc/lietz-nexus`, Asset-Packs in `georg-doc/kayfabizarro`
unter `media/2D_Assets/Tiny Swords (Update 010|Free Pack|Enemy Pack)`.

## 1 Der Baukasten (mentales Modell)
Zwei getrennte Welten, die nie vermischt werden:

**A · Welt (Canvas, Weltkoordinaten, 64-px-Raster)**
Ebenen strikt nach Guide: `BG-Wasser → Water Foam → Flat Ground → (Shadow → Elevated Ground)*`.
Wir haben keine Elevation, also **keine Shadow-Ebene** — sie gehört laut Guide zur Elevated Ground.
- **Flat Ground** = 4×4-Blob-Autotile. Merksatz: **Spalte 0 links, 1 Mitte, 2 rechts, 3 einzeln;
  Zeile 0 oben, 1 Mitte, 2 unten, 3 einzeln.** `tileIdx(maske, c, r)` liefert das Paar.
  Grasblock ab Spalte 0, Sandblock ab Spalte 5 (`ATLAS.ground.blocks`).
- **Water Foam** ist **kein** Autotile, sondern ein **192-px-Stempel**, mittig auf jede
  Land-Randkachel gesetzt; die Überlappungen bilden den Kranz. 8 Frames, ~7 fps.
- Insel bleibt **konvex** (der 4×4-Satz hat keine Innenecken).
- Requisiten (Bäume, Büsche, Steine) stehen nur **vollständig im Inland** — alle acht Nachbarkacheln
  müssen Land sein, sonst steht der Baum im Wasser.
- Tiefensortierung nach **Fuß-Y**; Sprites bringen ihren Schatten mit, es wird **kein** zusätzlicher
  Schatten gemalt.

**B · HUD (DOM, Screenkoordinaten, Pergament-Panels)**
Alle Tafeln sind 9-Slice-`border-image` (`slice 64 fill`) + Assetfarbe als `background-color`, weil die
Mitte sonst optisch bricht. Buttons sind 3-Slice (`slice 0 64 fill`), Farben direkt aus den PNGs:
blau `rgb(140,195,196)`, rot `rgb(200,129,118)`, gelb `rgb(187,181,82)`, Pergament `rgb(204,184,141)`.
Schrift **Shantell Sans**, Text dunkelbraun auf Pergament (`#4a2c0c` / `#6b3f12` / `#836039`).

### ATLAS — die eine Tabelle
`ATLAS` im Logik-Kopf beschreibt jedes Blatt: `pack, path, frame[w,h], role, frames, fps`.
Rollen: `autotile4x4`, `autotile3x3`, `tile`, `strip`, `single`. `blit(g, key, frame, x, y, h)` zeichnet
einen Frame mit Fußpunkt-Anker, `frameOf(key, t, loop)` liefert den Index. Neues Asset = **ein**
ATLAS-Eintrag, der Loader zieht es automatisch. Das ist die Grundlage für den späteren Editor.

## 2 Neu in v3
- **Küste** korrekt (Foam-Stempel), keine Shadow-Ebene, keine Bäume im Wasser.
- **Wasser-Deko**: animierte Water Rocks (16 Frames) und eine Quietscheente (3 Frames).
- **Wolken** aus dem Free Pack driften über die Karte (7 Stück, unterschiedliche Größe/Tempo/Deckung).
- **Tageszeit** 0–24 h mit interpolierten Himmel-Keyframes (`SKY`): Nacht, Morgen, Tag, Abend + warme
  Fensterglut. Uhr im Banner, Button „Tageszeit" springt auf 07:30 / 12:00 / 19:00 / 22:30,
  Ratsstube hat Regler + „Uhr läuft/fest" (`clockSpeed` h pro Sekunde).
- **Particle FX** (Free Pack, Einzelreihen-Strips): Schmiede raucht dauerhaft, Ufer spritzt,
  **Wachturm brennt** solange ein Alarm offen ist, **Verwehren** setzt eine Explosion + Rauchwolken.
- **Gebäude on Hover** = Tooltip (Name, Nexus-Kategorie, Tätigkeit), **on Click** = Tafel mit
  Artefaktzahl, Ø Kritikalität, wer vor Ort ist und dem letzten Artefakt.
- **Unit-Schatten entfernt**, HUD-Tafeln verkleinert und auf einheitliche Rahmen (18 px) und
  Abstände gebracht; Chronik ist standardmäßig **zu**, damit das Dorf frei bleibt.
- Minimalzoom 0.42× (ganze Insel), Maximalzoom 2.6× (Sprite-Details).

## 3 Unverändert
Event-Vertrag (`emit()` ist der Adapter-Punkt), Häuser = Nexus-Kategorien, drei Quellen
(Artefakt-Mock / RSS-LLM / Szenario), Regler Ratsherr ↔ Freie Hand (≥ 70 % = autonom gesiegelt),
BFS-Pathfinding über das Wegenetz, Jukebox + Kenney-UI-SFX per Klick, alle Assets per raw-URL.

## 4 Backlog (bewusst offen)
- **Gegner-Angriffe**: Enemy Pack liegt bereit
  (`media/2D_Assets/Tiny Swords (Enemy Pack)`) — Goblins, Orks, Torch-Goblins, Kröten, Baumstumpf-Lager.
  Plan: Lager außerhalb der Insel, Züge auf dem Wegenetz, Angriff auf ein Haus = Nexus-Incident,
  Verteidigung = Freigabe/Autonomie. Braucht Kampf-Zustand und einen zweiten Sprite-Satz im ATLAS.
- **Elevation & Stairs**: Ebenenfolge und Regeln stehen im Guide (`Tilemap_Elevation.png`, Shadow-Versatz
  eine Kachel nach unten, Treppen nur an Klippen). `tileIdx`/`to3` tragen das direkt.
- **Editor** wie im Fork (`client/src/editor`): ATLAS + Masken + Wegenetz sind die Datenbasis;
  fehlt: Serialisierung der Maske und Drag-Platzierung.
- **Wetter** über Wolken hinaus (Regen/Nebel/Sturm), Tag-Nacht-abhängige Agenten-Rhythmen.
- Echter Nexus-Artefakt-Feed statt Mock.

## 5 Einbetten
```html
<dc-import name="Nexus Village v3" source="mock" autonomy="35" hint-size="100%,100%"></dc-import>
```
Props/Tweaks: `agentCount, source, autonomy, tempo, autoClock, nightMode, chronikOpen`.
Zoom und Kamera sind Ansichtszustand, keine Props.
