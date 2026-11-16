# Ende-Kaskade R1 · ein Treffer-bis-Verschwinden-Ablauf für alle Gegner (WS0, 16.11.2026, Georg q739/q740 + Chat)

**Auftrag (Georg):** Impact → Tod → Verschwinden → Fluff-Freisetzung besteht heute aus 5–6 verschiedenen Effekten und Konzepten (Zerfließen, Goo-Pfütze, Partikel, Splats, Fluffbälle …) und wirkt nicht mehr konsistent. Einmal sauber durchkonzipieren, durchdesignen und umsetzen. Regel seit V-1874: als **eine Kaskaden-Choreografie**, nicht als Einzelteile.

## Bestand (was heute nebeneinander läuft)
| Baustein | Datei | wer nutzt es | Problem |
|---|---|---|---|
| Goo-Tod der Slops (Georg 04.11.): Blob wird zum Spritzer, gleiche Stelle/Größe/Farbe, Krone, Pfütze, nasser Fleck, Perlen, Einsickern | `npc/slopGoo.js` | nur 2D-Slops | **das Vorbild** – genau Georgs Regel |
| Einsickern (verschwinden = zurückziehen/versinken, nie ausblenden) | `modules/einsickern.js` | Goo, Fluff-Kugeln | gut, gemeinsam |
| Tropfen-Kern (platzen, kullern, saugen) | `look/kfbTropfen.js` | Tinte, Truhe, Fluff-Sickern | gut, gemeinsam |
| Inkwave-Tinte am Boden (Zensur-Tinte, splat/loesen) | `look/tintenKarte.js` | Würfelmonster-Spucke | **Spielmechanik**, nicht Tod: im Tod falsch (dunkler Rand, helle Fläche, andere Farbe/Lage – q740) |
| Fluff-Burst (fluffpng-Klumpen) | `modules/orchard3d.js` | Bäume, Monster, Soldaten | erscheint ohne Bezug zum Körper, zu groß, wirkt wie Plastik |
| Soldaten: Sterbe-Clip, Fluff-Drop, beim Umfahren Puppe + Farbfleck (Ausblenden) | `world/arena/*` | Soldaten | Fleck blendet aus (gegen Einsickern), Fluff ohne Bezug |
| Würfelmonster: Death-Clip + Fluff + Tinte lösen; Umfahren-Kaskade mit Inkwave-Pfütze | `npc/darkFluffer.js` | Monster | zwei Wege, Pfütze passt nicht |

## Ein Ablauf (Ende-Kaskade), gilt für Slops, Würfelmonster, Soldaten (später KayKit-Gegner)
Alle Farben = **Körperfarbe der Figur** (aus ihrer Textur bzw. ihrem Ton). Alles an derselben Stelle wie der Körper.
1. **Treffer** – Trefferblitz der Ursache (Waffe/Wagen), Goo-Spritzer in Körperfarbe aus dem Trefferpunkt in Kraftrichtung (V-590), Stauchung/Treffer-Clip.
2. **Reaktion** – nach Ursache: Kampf = Sterbe-Clip/Umfallen; Wagen = Flug (Würfel ganzer Körper, Soldat Puppe), **eine** Landung mit Stauchung und Goo-Spritzer in Körperfarbe, kein Nachfedern.
3. **Platzen** – der Körper bläht sich kurz auf, zittert und dunkelt zur Goo-Farbe (Körperfarbe), dann wird er im selben Bild zum Goo-Hügel des Slop-Goo-Tods: gleiche Stelle, gleiche Größe, gleiche Farbe, der Körper wird hineingesaugt.
4. **Pfütze** – Krone fällt zur Pfütze in Körperfarbe auf dem Boden unter dem Körper; nasser Fleck dunkelt den Boden; Perlen setzen sich.
5. **Fluff** – beim Zusammenfallen der Krone steigen die Fluffbälle **aus der Pfütze**, zuerst in Pfützenfarbe überzogen, dann schütteln sie das Goo ab und werden bunt (ihre Story-Farbe); klein (r 0,06), matte Knete.
6. **Einsickern** – Pfütze und Perlen ziehen sich zur dicksten Stelle zurück und sinken ein, der nasse Fleck trocknet vom Rand; Fluff bleibt zum Einsammeln.

Nicht mehr im Tod: Inkwave-Splat und Ausblenden. Die Zensur-Tinte bleibt Spielmechanik (Spucke, Bremse) und wird beim Tod nur gelöst.

## Umsetzung
- Rezept je Ursache im Format `core/rezept.js` unter `src/data/choreo/` (Umfahren: `kreatur_umfahren.r2.json`), Marken treiben alles.
- Der Goo-Teil (Platzen, Pfütze, Perlen, Einsickern) ist `createSlopGoo` unverändert, aufgerufen mit Lage, Größe und Körperfarbe.
- Fluff-Überzug: `orchard3d.burst` bekommt eine Überzugsfarbe und Abschütteldauer je Kugel.
- Reihenfolge: Würfelmonster (Umfahren und Kampf) → Soldaten (Kampf-Tod nach Liegen, Umfahren: Puppe → Platzen statt Farbfleck) → Fluff-Look allgemein (Plastik → Knete, eigene Karte).

## Stand 16.11. spät (V-1875)
- Würfelmonster umgesetzt (endekaskade=r1): Kampf-Tod (`kreatur_tod.r2.json`) und Umfahren (`kreatur_umfahren.r2.json`), Goo = `createSlopGoo` je Gruppe mit Körperfarbe (`look/koerperFarbe.js`), Schnipsel und Spritzer in Körperfarbe (`slopGoo` neue Optionen `koerper`, `spritzer(…, farbe)`), Fluff-Überzug (`orchard3d.burst(…, { ueberzug })`).
- Takt-Lehre: der Slop-Goo hält vor dem ersten Bild 0,25 s (bei Slops reißt dort das Bild) → `goostart` 0,25 s vor `platzen`; ab `platzen` wird der Körper 0,12 s in die wachsende Krone gesaugt, dann `weg`. Keine Lücke ohne Körper und Goo.
- Nächste Schritte: Soldaten (Kampf-Tod nach dem Liegen, Umfahren: Puppe → Platzen statt Farbfleck, Goo in Soldatenfarbe = geschmolzenes Plastik), Fluff-Look (Plastik → Knete, eigene Karte), Treffer-Spritzer der Waffen an die Körperfarbe.
- Patch particle-physics (patch.gg/patch/particle-physics, MIT): Flüssigkeit/Gelee auf der GPU, aber nur WebGPU (unser Spiel rendert WebGL) → im Spiel nicht direkt; sinnvoll zum Vorrendern neuer Goo-Bildfolgen (Krone, Pfütze, Spritzer) als Atlas für `slopGoo`.
