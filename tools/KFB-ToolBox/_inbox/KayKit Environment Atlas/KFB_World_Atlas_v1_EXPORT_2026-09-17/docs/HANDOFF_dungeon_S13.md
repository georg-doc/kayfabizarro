# Übergabe · S13.2 Dungeon-Generator

Stand 2026-09-17. Lies zuerst `KayKit_Dungeon_Model_S13.html` (gemessenes Inventar + Fugenmodell +
Vertrag) und dieses Blatt. Dann bauen — nicht neu messen, die Zahlen sind belegt.

## Auftrag

Zufallsgenerator für **konsistente** Dungeons, BSP-Teilung, **8×8 Module**, **zwei Ebenen**,
**keine Requisiten** (Architektur zuerst — so von Georg entschieden). Vorbild für Aufbau und
Prüf-Denkweise: `KayKit_Hex_Realm_S11.html` + `KayKit_Hex_Tile_Model_S12.html`.

## Das mentale Modell in fünf Sätzen

1. **Die Fuge trägt das Merkmal, nicht die Kachel.** Boden = Zelle, Wand = eigenes Objekt auf der
   Kante zwischen zwei Zellen. Ein Dungeon ist ein Graph: Zellen Knoten, Fugen Kanten.
2. **Vier Fugenklassen:** `solid` · `door` (nur `wall_doorway`, die *einzige* begehbare) ·
   `gate` (`wall_gated`, sichtbar/gesperrt) · `open` (kein Objekt, beide Zellen im selben Raum).
   `wall_broken` und `wall_window_open` sind Sichtdurchlässe **ohne** Weg.
3. **Fugenliste ist ein Set mit Schlüssel `min(a,b)|max(a,b)`** — nicht Zellen × 4 Richtungen.
   Damit ist doppeltes Wandsetzen strukturell unmöglich statt nur geprüft.
4. **Kein `wall_end`, kein T, kein Kreuz.** Also müssen Wandzüge geschlossen sein und in
   `wall_corner` einlaufen. `wall_corner` sitzt auf einem **Gitterpunkt**, nicht auf einer Fuge.
   Daraus folgt BSP: nur achsparallele Rechtecke, nur rechte Winkel. Diagonale oder runde Räume
   sind mit diesem Pack **nicht baubar** — nicht „fast baubar".
5. **Solid-Varianten sind reine Varianz**, austauschbar ohne Folgen für den Wegegraph. Das ist der
   Hebel für Abwechslung, ohne Begehbarkeit anzufassen.

## Gemessene Zahlen (nicht neu messen)

| Größe | Wert |
|---|---|
| Modul | **4** (`floor_tile_large` 4×4), Deckfläche y = 0 |
| Wand | Länge **4** = genau eine Fuge · Höhe **4** · Dicke **1** · Pivot zentriert |
| Überstand | `wall_pillar` +0,50 · `wall_shelves` +0,37 · `wall_cracked` +0,26 — ragt in **eine** der beiden Zellen, dort kein Platz für Requisiten |
| `wall_corner` | 2,5 × 2,5, Gitterpunkt-Teil |
| Treppe | **`stairs_wood`** gewählt: Hub **4,05** ≈ Wandhöhe 4,00 (`stairs` hat 5,10 → verworfen). Lauf **6** = 1,5 Module → reservierter Streifen von **2** Zellen, Fuge an Fuß und Kopf `open`. **Treppe zuerst setzen, Rest darum lösen.** |
| Ebenenabstand | **4,05** (gemessener Hub, nicht die Wandhöhe angenommen) |
| Böden | 3 Materialien als ganzes Modul (tile, wood, dirt), nur **2** als Viertelmodul (tile, wood) |
| Stützen | `pillar` wandhoch (gliedert Räume) · `column` 1,40 = 35 % → trägt nichts, Deko |
| Inventar | 46 von 77 Kandidaten bestätigt; **fehlt:** wall_end, T, Kreuz, Tür als Objekt, Falle, Statue, Sarkophag, Altar, Käfig |

## Gates (Georgs Auswahl — als Zahlen in den Balken, wie in S11)

- jeder Raum erreichbar — Breitensuche über `door`/`open`, Inseln = 0
- kein freies Wandende — jedes Zugende in `wall_corner` oder auf einen Zug treffend
- keine zwei Objekte auf einer Fuge (folgt aus dem Set, trotzdem zählen)
- keine Requisite in einem Durchgang oder auf einer Wand
- jeder Raum ≥ 1 `torch_mounted` (im Inventar bestätigt)
- kein Raum < 2×2 Module · Gänge genau 1 Modul breit
- **Pixelprobe**: Draufsicht-Rendering, jede `door`-Fuge im Bild wirklich offen

## Bedienung (gewünscht)

Seed-Feld + Würfeln · Dichte-Schieber · Draufsicht-Plan neben der 3D-Ansicht · Fugen-Overlay
einblendbar · schrittweiser Aufbau (Räume → Gänge → Wände) · Recipe-JSON-Export wie S1/S11.

## Werkzeuge, die schon da sind

`lib/kit-lab.js` — `loadAsset` · `measure` · `makeViewer` · `auditFootprints` · `relaxOverlaps` ·
`auditClearance` · **`makeTopDownProbe`** (Pixelprobe auf assemblierte Szenen, klassifiziert über
Kanalverhältnisse) · **`repairTextures`** (braucht einen intakten Zwilling im *selben* Baum —
alle geladenen Knoten in einer bestehenden Bibliothek sammeln, sonst wirkungslos).
`tools/probe-dungeon-parts.html` — Inventar-Ladeversuch. `lib/hex-grid.js` — Vorbild: **eine**
Tabelle, alles andere abgeleitet.

## Drei Lehren, teuer bezahlt

1. **Masken-Audits prüfen den Solver gegen sich selbst.** In S11 blieb der Balken grün, während
   jede Kurve spiegelverkehrt lag. Nur die Pixelprobe auf die fertige Szene hat es gefunden.
2. **Achsenkonventionen kippen wiederholt** — dreimal an verschiedenen Stellen (UV-Scan,
   Pixel-Scan, SVG-Diagramm). Jede neue Darstellung braucht ihre **eigene** Gegenprobe gegen die
   Geometrie, nicht gegen die vorige Darstellung. Bodenwahrheit ohne Kamera: Vertex-Schwerpunkte.
3. **Keine Zahl im Text tippen.** Jede Zahl aus den Messdaten ableiten. Getippte Zahlen waren
   viermal falsch, auf einer Seite, deren These „gemessen, nicht angenommen" ist.

Ladeverhalten: begrenzte Gleichzeitigkeit (**vier** Ladeversuche parallel). Alles sequenziell
blockiert minutenlang, alles gleichzeitig sättigt den Hauptthread und die Seite bleibt weiß.
`requestAnimationFrame` als Zeichenpause ist schädlich — in unsichtbaren Rahmen gedrosselt.

## Danach geplant

Zugekaufte Pack-Teile („mental modellieren" nach demselben Muster: Inventar → Modell → Grenzen)
und KayKit NPCs/Monster mit Generatorlogik; Georg baut parallel einen Character-Atlas als Module.
Referenzbilder liegen im lokalen Ordner `reference/KayKit_PACKS_References_Scenes_Demos/`.
