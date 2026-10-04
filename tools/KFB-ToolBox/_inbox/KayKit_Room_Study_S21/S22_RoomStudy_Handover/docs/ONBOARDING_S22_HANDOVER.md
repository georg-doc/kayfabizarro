# Onboarding · neuer Chat · S22 nach der erfolglosen Session

**Lies zuerst:** `docs/POSTMORTEM_S22_CONSOLIDATED.md` (die vier Fails dieser Session, Regel R4,
fünf Verbesserungsvorschläge) — dann `docs/POSTMORTEM_R08_S22.md` (Details R08 + R03), dann
`docs/WALL_NODES_S22.md` und `docs/MENTAL_MODEL_DIORAMA.md` (die zwei Bauverträge, weiter gültig).

## Stand in einem Satz

Drei Räume abgenommen (R02, R07, R09), zwei nicht (R08 abgebrochen, R03 falsch) — Ursache beide
Male: neue Bauteile wurden nach Namen/Dokument-Zitat angenommen statt vorher isoliert angesehen.

## Was funktioniert und nicht mehr angefasst werden muss

- `KayKit_Room_Study_S21.html` lädt fehlerfrei, Räume R02/R07/R08/R09/R03 alle im Room-Switcher.
- Inline-3D-Editor (`TransformControls`): Verschieben/Drehen/Gruppe/Raster/Absetzen/
  **Kollisionsfrei** (neu, S22) — Architekturteile (`p.fest`) sind davon ausgenommen.
- **Ablage-Export/Import** (neu, S22): rohes JSON der Handkorrekturen pro Raum, unabhängig vom
  Rezept-Code-Export („Patch kopieren").
- `lib/dungeon-grid.js`: `nodeFrame()` (Knotenregel für Endstück/T/Kreuz/Ecke, S22, gemessen) —
  gültig, nicht anfassen ohne neue Messung.
- Zwei-Ebenen-Mechanik in `buildRoom()`: `boden.ober` (Teilfläche bei y=`kit.HUB`),
  `props[].level`, `props[].fest` — der MECHANISMUS ist geprüft richtig (Ebenenabstand korrekt
  gemessen aus `stairs_wood`-Hub, Entzerrer-Ausnahme funktioniert). Was falsch ist, ist NICHT der
  Mechanismus, sondern die BAUTEILE, die R03 hineingesetzt hat (siehe unten).

## Was offen/falsch ist

1. **R03 Brüstung/Treppe.** `barrier`, `barrier_corner`, `stairs_wood` sehen im Bau aus wie eine
   verbogene Stahlträgerkonstruktion bzw. ein freistehendes Holzdach — NICHT wie ein Geländer
   oder eine Treppe. Vermutlich falsche Rotation/Anker, vielleicht auch falsche Namensannahme.
   **Vor jedem weiteren Versuch:** die drei Teile EINZELN ansehen (leerer Raum, nur das eine
   Teil, Kamera drauf) — siehe Regel R4 und Vorschlag 1 im konsolidierten Postmortem. Erst wenn
   klar ist, wie sie wirklich aussehen, weiterbauen — sonst wiederholt sich Fail 4.
2. **R08.** Abgebrochen. Grundriss (drei Ecken, Tür, T-Pfeiler als `wall_doorway_sides`) bleibt
   im Code stehen, Treppe/Requisiten-Auflage sind falsch. Nicht weiter von Hand im Rezept
   korrigieren — Georgs Vorgabe ist Handplatzierung im Editor.
3. **Zentrale Editor-Komponente.** Der Inline-Editor sitzt noch lokal in
   `KayKit_Room_Study_S21.html`. Umzug in eine zentrale, seitenübergreifende Komponente ist
   Deliverable, nicht gebaut (Umfang in `docs/POSTMORTEM_R08_S22.md`, Abschnitt „Nebenbefund").
4. **Sprint-22-Restliste** (`docs/SPRINT_22_ROOMS.md`): R05 Schatzkammer, R12
   Vier-Räume-Schnitt — noch nicht begonnen.

## Sofort-Empfehlung für den nächsten Schritt

Nicht sofort weiterbauen. Erst:
- Regel R4 einmal ausführen (isolierte Ansicht) für `barrier`, `barrier_corner`, `stairs_wood`,
  bevor R03 noch einmal angefasst wird.
- Dann entscheiden: R03 im EDITOR von Hand fertig platzieren (Vorschlag 5) statt im Rezept zu
  raten, und den Patch danach in den Code übernehmen.
- R08 bleibt auf Eis, bis derselbe Editor-Workflow für Treppen/Requisiten dort geübt ist.

## Dateikarte (nur das Nötigste)

| Datei | Rolle |
|---|---|
| `KayKit_Room_Study_S21.html` | Bau-Bühne: Rezept bauen, Editor, Prüfungen, Vorlagenvergleich |
| `lib/room-recipes.js` | `ROOMS[]` (R02/R07/R08/R09/R03) + `buildRoom()` |
| `lib/dungeon-grid.js` | Geometrie-Messfunktionen (`wallFrame`, `nodeFrame`, `stairFrame`, …) |
| `docs/POSTMORTEM_S22_CONSOLIDATED.md` | **Diese Session, konsolidiert** — zuerst lesen |
| `docs/POSTMORTEM_R08_S22.md` | Details R08 (3 Fails) und R03 (Fail 4, `fest`-Flag) |
| `docs/SPRINT_22_ROOMS.md` | Sprintliste, Status je Raum, mitgenommene Lehren |
| `docs/WALL_NODES_S22.md` · `docs/MENTAL_MODEL_DIORAMA.md` | Bauverträge, weiter gültig |
