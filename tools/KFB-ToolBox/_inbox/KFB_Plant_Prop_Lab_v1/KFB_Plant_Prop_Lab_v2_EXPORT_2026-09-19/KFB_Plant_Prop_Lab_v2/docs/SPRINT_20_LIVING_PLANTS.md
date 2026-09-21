# Sprint 20 · Living Plants — Geometriebindung, Bewegungsvorrat, Bühne

Vertrag vor Code. Nichts hiervon ist gebaut.
Vorgänger: S19 (Register-Grammatik, `docs/DESIGN_LINE_TOPFMUSTER.md`).
Der S19-Vertrag `docs/SPRINT_19_CARTOON_DEFORMER.md` bleibt offen und läuft parallel.

---

## A · Muster an die Topfgeometrie binden

**Befund.** Die Grammatik ist tragfähig, ihre Bindung an den Körper nicht. Der Shader
kennt vom Topf genau drei Zahlen: Umfang am Bounding-Box-Radius, Höhe, Innenradius.
Ein Topf ist aber kein Zylinder — er hat eine Flanke, einen Bauch, einen Kragen und einen
Fuss, und die Register müssten diesen Kanten folgen statt die Höhe blind in Prozente zu
teilen. Sichtbare Folgen heute:

- Bei konischen Töpfen ist das Motiv unten schmaler als oben; die Zelle ist nur an EINER
  Höhe quadratisch (dort, wo der Bounding-Box-Radius gilt).
- Der Kragen (Wulst über der Öffnung) wird vom Kantenband überdeckt statt ausgenutzt —
  er wäre die natürliche Grenze des obersten Registers.
- Der Fuss ist eine Prozentzahl (`v < 0,09`), keine gemessene Kante.
- Griffe, Füsschen und Rillen der Tiny-Treats-Töpfe bekommen dasselbe Muster wie die
  Wand; das Motiv läuft über eine Rille, als wäre sie nicht da.

**Vertrag.** Eine Silhouettenmessung vor dem Stilisieren: das Profil `r(y)` in N Stufen
aus der Geometrie abtasten, daraus ableiten
1. den **echten Umfang je Höhe** (Zellbreite folgt `r(y)`, nicht dem Maximum),
2. **Kantenkandidaten** als lokale Extrema und Krümmungssprünge von `r(y)`,
3. **Zonen** Fuss / Bauch / Kragen aus diesen Kanten, nicht aus Prozenten.
Registergrenzen rasten dann auf Kantenkandidaten ein, wenn einer in Reichweite liegt.

**Abnahmetore.** ⟶ jedes Register hat an seiner Ober- und Unterkante entweder eine
gemessene Geometriekante oder eine begründete Freilage · Zellbreiten-Streuung über die
Registerhöhe < 15 % · Profilmessung für alle 12 Töpfe im Bericht.

---

## B · Bewegungsvorrat statt einer Grundschwingung

**Befund.** Das Proprig kann wiegen, pulsieren und auf Wind reagieren. Es ist damit **zu
dezent** — man sieht, dass es lebt, aber man sieht ihm nicht zu. Es fehlt der Unterschied
zwischen Ruhe, Reaktion und Ausbruch.

**Vertrag.** Ein benannter Vorrat an Clips, jeder mit Dauer, Kurve und Kollisionsregel:

| Clip | Auslöser | Bemerkung |
|---|---|---|
| `idle` | dauernd | die heutige Grundschwingung, als Bodensatz |
| `breathe` | dauernd | aus dem S19-Vertrag; Skala statt Neigung |
| `wind` | Parameter | Richtung + Stärke, Blätter eilen dem Stamm nach |
| `shake` | Ereignis | kurzer Schüttler, Nachlauf |
| `interact` | Zeiger/Klick | Zuwendung, dann Rückfederung |
| `startle` | Ereignis | Anti-Antizipation: erst zurück, dann hoch |
| `wilt` / `perk` | Zustand | langsame Haltungsänderung, nicht zyklisch |

Clips überlagern sich additiv über eine Prioritätsregel; ein Ereignisclip unterbricht
`idle` nicht, er addiert sich darauf.

**Oberfläche.** Clip-Leiste unten im UI nach dem Vorbild des Animation Lab: Chips je Clip,
Klick spielt ab, Dauerclips rasten ein, Regler für Stärke. Die Leiste ist Teil der Schale,
nicht der Muster-Sektion.

**Abnahmetore.** ⟶ jeder Clip hat einen Messwert für Ausschlag und Dauer im Bericht ·
kein Clip verlässt den Freiraumradius · `idle` + Ereignisclip gleichzeitig ohne Sprung.

---

## C · Bühnen · Präsentation und Prüfung

Die Töpfe stehen heute auf einer grünen Scheibe. Für Abnahme und Präsentation brauchen
sie die Umgebungen, in denen sie später leben:

- **TinySkies / Travel-Globe-Terrain** — Pflanzen im Maßstab der Weltkarte; prüft die
  Maßstabsklassen (TABLETOP … LANDMARK) gegen echtes Gelände statt gegen eine Scheibe.
- **OMS-Grotesque-View** — die zweite Bildsprache. Prüft, ob die Register-Grammatik auch
  unter fremdem Licht und fremder Palette als eine Linie liest.

**Abnahmetore.** ⟶ derselbe Seed liefert in beiden Bühnen dieselbe Komposition ·
Lesbarkeit des Leitmotivs aus der Standardkameradistanz jeder Bühne belegt.

---

## Reihenfolge

1. **A** zuerst. Die Silhouettenmessung ist Eingang für alles Weitere, und B verschiebt
   Geometrie, die A vermessen will.
2. **B** danach, `breathe` als erster Clip (siehe S19-Vertrag: sichtbar korrekte
   Choreografie vor neuen Inhalten).
3. **C** zuletzt, als Abnahmebühne für A und B.

## Ausdrücklich nicht in S20

Fleischfresser, Pilze und Blumen (P2-Sondenauftrag aus `docs/BACKLOG_PLANT_PROP.md`),
echter verschränkter Stufenmäander, Untersetzer-Sonderstile.
