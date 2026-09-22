# SPEC — `terrain-v10/voxel-terrain.js` · KANONISCH ab 2026-07-26

Die drei Zusätze aus dem Card-Zone-Fork sind **übernommen**. Diese Datei IST jetzt das kanonische v10;
es gibt keinen Fork mehr zu spiegeln. Alle drei sind additiv und mit Default rückwärtskompatibel:
bestehende Aufrufer (Travel v9/v10, Voxel Zone S1/S2) verhalten sich unverändert.

Vorgänger dieses Dokuments: `PATCH_v10_terrain.md` (beschrieb 1 + 2 noch als Fork).

---

## 1 `heightStep` — D6-Unterteilung

Die Oberfläche rastete auf ganze Cubes, Höhenunterschiede lasen deshalb als Treppe statt als Gelände.
Sechs Stufen pro Cube (die D6-Logik) ergeben natürliche Übergänge — und erst damit ist flaches Wasser
überhaupt darstellbar.

```js
const STEP = opts.heightStep || CELL;              // Default = CELL = altes Verhalten
const h = Math.round(heightAt(wx, wz) / STEP) * STEP;   // in surfaceInfo()
```

Aufruf: `createVoxelTerrain({ THREE, worldContext, heightStep: CELL / 6 })`

## 2 `setCarve(rect)` — Aussparung für ein Zonen-Plateau

Die Card Zone setzt ihr eigenes Plateau; ohne Aussparung stehen Terrain-Cubes darin. Die Instanzen
bleiben im Buffer (Instanzzahl konstant, kein Rebake der Chunk-Struktur) und werden auf 0 skaliert.

```js
setCarve({ x, z, hx, hz })   // Halbmaße PRO ACHSE
setCarve(null)               // Aussparung löschen
```

**Halbmaße pro Achse sind Pflicht.** Ein gemeinsames Pad stanzt die kurze Achse zu weit aus — das war
die Ursache der Löcher zwischen Zone und Terrain.

## 3 `setCarvePath(pts, breite)` — Flusslauf *(neu in dieser Runde)*

Derselbe Vertrag, offene Kurve: alles im Abstand ≤ breite/2 zur Polyline wird ausgespart. Rechteck und
Pfad gelten **gleichzeitig** — die Zone stanzt ihr Plateau, der Fluss seinen Lauf.

```js
setCarvePath([[x0,z0],[x1,z1],…], breite)
setCarvePath(null)
carvedAt(x, z)      // → bool, für Aufrufer, die dieselbe Menge brauchen
pathDistAt(x, z)    // → Abstand zur Kurve (Infinity ohne Pfad)
```

`carvedAt` und `pathDistAt` sind bewusst nach außen gegeben: wer das Flussbett füllt, muss **exakt**
dieselbe Menge treffen wie der Carve. Zwei getrennt gerechnete Radien haben in der Entwicklung
überlappende Cubes und flackernde Deckflächen erzeugt.

## Was NICHT geändert wurde

`uZone[4]` (Ruhezonen), `uFlow`, Wasser-als-Farbe (§3 des Briefs), Palette, Fog, `groundHeightAt`,
`recenter`, Chunk-Grid, Streuung. Die Card Zone dockt an, sie schreibt nicht um.

## Für Aufrufer, die mitziehen wollen

- **Nichts tun** genügt: ohne `heightStep` und ohne Carve ist das Verhalten identisch.
- Wer feineres Gelände will: `heightStep: CELL / 6`. Achtung, `groundHeightAt` liefert dann Werte
  auf dem feineren Raster — alles, was darauf aufsetzt (Props, Anker, Wasserlinien), muss dieselbe
  Rasterweite benutzen, sonst schweben Objekte einen Sechstel-Cube über oder unter dem Boden.
- Wer Wasser plant: die Wasserebene NIE auf das Höhenraster legen (siehe HANDOVER, Abschnitt Wasser).
