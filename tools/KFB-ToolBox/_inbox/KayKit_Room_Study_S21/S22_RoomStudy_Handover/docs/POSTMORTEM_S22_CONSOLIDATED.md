# Postmortem S22 · konsolidiert — eine erfolglose Session

Georgs Einordnung: diese Session war **objektiv nicht erfolgreich**. Vier Fails in Folge, alle
mit derselben Wurzel. Dieses Dokument fasst zusammen, statt die Einzel-Postmortems zu wiederholen
(Details in `docs/POSTMORTEM_R08_S22.md`).

## Die vier Fails, eine Ursache

| # | Raum | Was falsch war | Ursache |
|---|---|---|---|
| 1 | R08 | Treppe schräg/nicht in der Ecke, T-Pfeiler falsch, Bodenplatte falsch — 3 Korrekturrunden, dann Abbruch | Koordinaten/Rotation für neue Bauteile GERATEN, nicht gemessen |
| 2 | R09 | Grundriss komplett leer (Wände „beidseitig gedeckt") im ersten Entwurf | Grundfläche zu klein für nicht-halbierbare Teile zwischen zwei Knoten — inzwischen gefixt |
| 3 | R03 (Runde 1) | Brüstung verzogen, wirkte ohne Bodenanschluss | Entzerrer verschob Architekturteile wie Requisiten — gefixt (`fest`-Flag) |
| 4 | R03 (Runde 2) | **Brüstung ist eine verbogene Stahlträger-Konstruktion, Treppe ein freistehendes Holzdach — beides ohne jeden Bezug zur Vorlage, kein Bodenanschluss** | Die Teile `barrier`, `barrier_corner`, `stairs_wood` wurden NIE isoliert angesehen — nur nach Namen und Doku-Zitat aus `docs/HANDOFF_dungeon_S13.md` angenommen, wie sie aussehen. Basisgeometrie nicht gemessen, nicht mal angeschaut. |

**Fail 4 ist der schwerste**, weil er die Grundannahme der ganzen Session widerlegt: „Regel R3 —
Rotation durchprobieren, nicht raten" reicht NICHT, wenn schon die Annahme über die FORM des
Bauteils falsch ist. Man kann die Rotation eines Stahlträgers nicht so drehen, dass er wie ein
Geländer aussieht.

## Was das für die Methode bedeutet

Jede bisherige Regel (R1 Achsparallel, R2 Bodenkontakt, R3 Rotation durchprobieren) setzt voraus,
dass das Bauteil selbst schon einmal GESEHEN wurde. Das war für `wall_endcap`, `wall_Tsplit`
etc. in S22 der Fall (`tools/probe-wall-nodes.html`) — für `stairs_wood`, `barrier`,
`barrier_corner`, `wall_doorway_sides` war es das NICHT. Sie wurden aus Namen und einem
Dokument-Zitat vermutet.

**Neue Regel R4: kein neues Bauteil in einen Raum, ohne es vorher isoliert gesehen zu haben.**
Ein Screenshot des Teils allein (Kamera drauf, kein Kontext) ist Pflicht, bevor es in ein Rezept
kommt — dieselbe Disziplin wie `tools/probe-wall-nodes.html`, nur ohne die Messrechnung, wenn
reine Form/Grösse genug ist.

## Status am Ende der Session

- R02, R07, R09: **abgenommen**.
- R08: **abgebrochen**, nicht abgenommen.
- R03: **nicht abgenommen** — Grundstruktur (zwei Ebenen, `kit.HUB`-Messung) ist ein echter
  Fortschritt und bleibt im Code, aber Brüstung und Treppe sind falsch und müssen mit R4 neu
  angegangen werden.
- Editor-Ergänzungen (Kollisionsfrei, Ablage-Export/Import) sind fertig und funktionieren
  unabhängig von den Raum-Fails.

## Fünf Dinge, an die wir noch nicht gedacht haben

Georgs Auftrag: proaktiv Reibung für genau diese Art Sackgasse abbauen, nicht nur den nächsten
Bug fixen.

1. **Teile-Steckbrief vor jedem Rezept.** Ein `tools/probe-part.html`, das EIN Bauteil isoliert
   lädt, aus drei Standardwinkeln screenshottet und Box + Achsen dazuschreibt — ein
   Pflicht-Zwischenschritt, technisch erzwungen (das Rezept referenziert eine
   `docs/parts/<name>.md`-Datei, die es ohne diesen Schritt nicht gibt), nicht nur eine Regel
   auf Zuruf.
2. **Diff-Screenshot gegen die letzte gute Version.** Vor jedem „fertig"-Ruf: Screenshot des
   Raums VOR der Änderung neben Screenshot NACH der Änderung, automatisch nebeneinandergelegt —
   eine verzogene Brüstung wäre im Vergleich sofort aufgefallen, auch ohne die Vorlage danebenzuhalten.
3. **Ein Architektur/Requisite-Flag von Anfang an, nicht erst nach dem Schaden.** `fest` kam erst
   NACH Fail 3 — ein Bauteil-Katalog, der jeden Namen von vornherein als `wand`, `boden`,
   `architektur` oder `beweglich` klassifiziert (eine Zeile Metadaten je Teil), hätte den
   Entzerrer-Bug unmöglich gemacht, statt ihn zu reparieren.
4. **Abbruch-Budget pro Raum, vorher festgelegt.** „Drei Korrekturrunden sind ein Signal" stand
   schon im ersten Postmortem — aber erst NACH drei Runden. Eine Zahl VOR dem Bau (z. B. „zwei
   Versuche, dann Editor statt Code") hätte R03 Runde 2 verhindert, nicht erst benannt.
5. **Der Editor zuerst, das Rezept danach.** Für genau die Bauteile, die wiederholt schiefgehen
   (Treppe, Brüstung — beide mit eigener Achse/Anschluss, kein einfacher Quader), ist
   Freihand-Platzieren im jetzt fertigen Inline-Editor nachweislich zuverlässiger als
   Koordinaten schreiben. Die Reihenfolge sollte umgedreht werden: SO EIN Teil erst im Editor
   von Hand an die Wand setzen, DANN den Patch ins Rezept übernehmen (`Patch kopieren`) — nicht
   umgekehrt raten und hoffen.
