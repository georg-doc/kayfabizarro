# KONSTRUKTIONSREGELN — mentale Modelle für Tiles, Units, Bauten, UI
Stand 2026-08-14 · gilt für `Nexus Village v3.dc.html` und alles ab v4 · Ergänzung zu
`BAUKASTEN-TinySwords.md` (Wie zeichne ich) — hier steht: **wie darf gebaut werden.**
Quellen: Tilemap Guide (Pixel Frog, `uploads/Tilemap Guide - Tiny Swords by Pixel Frog.pdf`),
`uploads/01_ASSETS_UND_URLS.md`, `uploads/02_UI_BAUKASTEN_TS.md`, `uploads/06_FALLEN_und_BEST_PRACTICES.md`,
`uploads/ui-kit-ts.js`.

---

## 0 Die vier mentalen Modelle

| Modell | Denkweise | Konsequenz |
|---|---|---|
| **Boden ist ein Raster** | Land/Sand/Wasser sind **Zustände von Zellen** (64 px), nie gemalte Formen | Autotile entscheidet die Kachel, nicht der Autor |
| **Aufbauten sind Stempel** | Foam, Shadow, Gebäude, Deko sind **Sprites auf** dem Raster (192 px zentriert) | nichts wird skaliert, nichts wird gezeichnet |
| **Units sind Punkte mit Fuß** | eine Unit ist eine Position am **Boden** + ein Blatt darüber | Sortierung, Kollision, Ziel = Fuß-Y |
| **UI ist eine eigene Ebene** | HUD kennt kein Weltraster; es kennt **Ecken 1:1 + gekachelte Kanten** | `border-image` ist untauglich (F9) — Canvas-Kit |

---

## 1 Tiles — Ebenen und Kachelwahl

Reihenfolge ist **nicht verhandelbar** (Guide, Layer 0–8):
```
0 BG-Wasser · 1 Water Foam · 2 Flat Ground · 3 Shadow · 4 Elevated
5 Shadow · 6 Elevated · 7 Shadow · 8 Elevated
```
- **Flat Ground** = 16 Kacheln (4×4-Blob). Zeile/Spalte 3 ist der **Single**-Fall.
- **Elevated Ground** = 24 Kacheln (16 Gras + 8 Klippe). Klippe gehört **immer** zur Elevated-Ebene,
  nie zum Flat Ground.
- **Foam** ist **kein** Autotile: 192-px-Stempel, mittig auf jede **Randzelle**; die Überlappung ist
  der Kranz (Falle: als Autotile gedacht → Küste bricht).
- **Shadow** ist ebenfalls ein 192-px-Stempel und existiert **nur unter Elevated**. Ohne Höhenstufe
  gibt es **keine** Shadow-Ebene (v3 hat keine).
- **Treppen** sitzen an der Klippenkante, nie frei im Gras; der Guide zeigt dazu ✗/✓-Fälle.
- **Sand/Wege** liegen als eigener Autotile-Block auf Flat Ground und sind ein **Zellzustand**:
  ein Weg ist eine Menge Zellen, keine Linie mit Breite.

**Zellregeln**
1. Eine Zelle hat **genau einen** Bodenzustand: Wasser | Land | Sand.
2. Wasserkante ⇒ Foam-Stempel. Keine Ausnahme.
3. Bäume/Deko nur, wenn **alle acht Nachbarn** Land sind (sonst steht es im Wasser).
4. Wege queren Wasser **nur** über eine Brücke; ohne Brücke endet der Weg an der Kante.

---

## 2 Globale Konstruktionsregeln für Bauten

**R1 · Eingang immer von unten.** Die Tür ist keine Zierde, sie ist ein Datum:
`door = { x: b.x, y: b.y + 96 }`, auf Zellmitte gerastet — **eine Zellreihe unter dem Sockel**.
Kein Eingang seitlich, keiner oben. Jedes Gebäude hat **genau einen**.

**R2 · Der Weg endet an der Tür, nicht an der Wand.** Für jede Tür ein Wegpunkt + eine Kante zum
nächstgelegenen Netz-Wegpunkt. Die Sandmaske folgt den Segmenten, also entsteht die Stichstraße von
selbst — **von unten** an die Tür.

**R3 · Keine Überlappungen.** Jedes Gebäude beansprucht eine **Anspruchsfläche** (Claim) in Zellen:
```
x0 = b.x − 0.42·h   x1 = b.x + 0.42·h
y0 = b.y − 0.95·h   y1 = b.y + 128        (Sockel + Türzone)
```
Claims dürfen sich **nicht schneiden**; Deko, Bäume, Zäune und Ressourcen liegen **außerhalb**.
Ein Schnitt ist ein **Befund** (Konsole), keine stille Korrektur — Layout ist Autorenarbeit.

**R4 · Massiv ist nur der Sockel.** Kollision ist eine flache Ellipse (`rx ≈ h·0.32`, `ry ≈ h·0.13`)
an der Basis. Größer gesperrt ⇒ niemand läuft **hinter** das Haus ⇒ die Tiefensortierung wird
unsichtbar. Aufprall = Abprall (Rückstoß, Hopser, Staub, **Route neu rechnen**).

**R5 · Ein Grundton pro Fraktion.** Bauten einfarbig (Default Blau) als **ein** Regler; Farbe
unterscheidet **Units**, nicht Häuser.

**R6 · Höfe sind Sand, nicht Gras.** Vor jedem Eingang eine Sandfläche (Hof) — sie erklärt, warum
dort gelaufen wird, und verbindet Tür und Netz sichtbar.

---

## 3 Units — mentales Modell

- **Ein Punkt am Boden** (`x, y` = Fuß) + Blatt darüber. Zeichnen: `y − disp·0.62`.
- **Maßstab 1** (F8). Größenunterschiede sind gezeichnete Absicht (Sheep 38 px, Troll 211 px),
  kein Normierungsfehler. Größenklassen sind **Daten** (Kollision, Trefferzone), kein Zeichenmaßstab.
- **Schatten bringt das Blatt mit.** Nie einen zweiten malen.
- **Sortierung nach Fuß-Y** — Units und Gebäude in **einer** Liste.
- **Jede Figur genau einmal**; Instanzen desselben Typs trennt die **Farbe**. Registry
  `agentId → (unit, color)`, stabil über Sessions.
- **Blätter vor Gebrauch messen.** Update 010 = 192 px; Free Pack **nicht zwingend** (F2/F28: wo Text
  und Datei sich widersprechen, gewinnt die Datei).
- **Ambience-Units** (Schafe, Träger) erzeugen **keine** Chronik-Einträge.
- **Zustand über dem Kopf, nie auf dem Boden.** Marken, Blasen, Namen sind Overlays in der
  Ink-Sprache; gemalte Bodenringe sind in einem Top-down-Set immer falsch (wie Unit-Schatten, Brunnen).

---

## 4 UI — mentales Modell

- **Ecken 1:1, Kanten kacheln, Mitte füllen.** `border-image` skaliert Ecken ⇒ untauglich (F9).
  Umsetzung über `ui-kit-ts.js` (Canvas), Maße **gemessen**, nicht aus Dateinamen geraten (F10).
- **Kein Upscale von Pixel-Grafik.** Ein Blatt, das zwei Zeilen nur hochskaliert trägt, wird nicht
  benutzt (Bug #35) — dann lieber eine ruhige Fläche.
- **Typo mittig in die gemessene innere Fläche**, nicht ins Sprite-Rechteck.
- **Progressive Disclosure:** Statuszeile + zwei Knöpfe sichtbar; Rest hinter Log/Settings;
  Gebäude-Meta erst on Hover/Click. Tab minifiziert alles außer Banner + Controls.
- **Icons aus dem Pack**, sonst in derselben Ink-Sprache (Outline ≥ 3 px, keine Hairlines).

---

## 5 Prüfliste vor jedem Commit
1. Claims schnittfrei? (Konsole leer)
2. Jede Tür genau eine, **unten**, mit Stichweg von unten?
3. Wegenetz zusammenhängend (Flood-Fill vom Hof), keine Sackgasse?
4. Jede Wasserkante mit Foam? Kein Baum mit Wassernachbar?
5. Shadow nur unter Elevated?
6. Jede Unit einmal, `scale = 1`, kein zweiter Schatten?
7. Nichts Gemaltes auf dem Boden, das kein Sprite ist?
8. HUD: Ecken 1:1, kein Upscale, Text in der gemessenen Fläche?
