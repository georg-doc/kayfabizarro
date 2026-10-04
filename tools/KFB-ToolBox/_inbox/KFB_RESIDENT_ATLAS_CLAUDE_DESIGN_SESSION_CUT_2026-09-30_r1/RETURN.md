# RETURN · Session Cut 2026-09-30 r1 · Resident Atlas S15

## Probleme zuerst

1. **Fight 02 ist ein Proof of Concept, noch nicht fertig.** Georgs Befunde F1–F6 in `docs/RESIDENT_FIGHT_SANDBOX_02/GEORG_FEEDBACK_2026-09-30.md`. Keiner davon ist behoben: Rücken an Rücken, Hammer im eigenen Körper, Brute durch die Seile, Staubwolke ohne Aktion und seitlich, liegende Figuren im Boden.
2. **Liegende Figuren, gemessen:** 30–62 % der Vertices liegen unter dem Boden, der Raider nach `standing_death_left` bei minY −0,82 m.
3. **Blickrichtung:** Katalog und Kampfdaten widersprechen sich bei `boxing_a` um rund 95°. Das ist die Ursache für den seitlichen Anlauf in der Staubwolke.
4. **Abnahme 3 bestand erst nach der Reparatur** (Rückstoß-Sperre). Roh waren es 0/16.
5. **Schulterwurf gegen die Trennungsregel:** Das Opfer wird 3,53 m geschoben. Das entscheidet Georg.
6. **Knet-Staub des Racers nicht gefunden.** Puff und Wolke sind neu gebaut.
7. **fps:** Georg sieht 20–30 fps im Zweikampf, flüssig. Das 50-fps-Budget im Diorama ist auf dem M1 nicht gemessen (siehe `docs/RESIDENT_CLAY_AR_01/OPEN_LATER.md`).
8. **Pins per Branch** (`georg-doc-patch-3`), kein Commit-SHA.

## Geliefert

- `KFB_Resident_Atlas_S15.html` (Entry) und `KFB_Resident_Atlas_S15_standalone.html` (eine Datei, 34 Module per Import-Map und 11 JSONs per fetch-Shim eingebettet).
- Fight Sandbox 02 (`lib/fight-sandbox-02.js`, `data/fight-sandbox-02.json`): Abnahme 1–6 ✓. Einzelheiten in `docs/RESIDENT_FIGHT_SANDBOX_02/RETURN.md`.
- Doku 3D-Inline-Editor: `docs/EDITOR_3D_INLINE_01.md` und `docs/SNAP_EDITOR_CONTRACT_01.md`.
- Georg-Feedback plus Blender-Punkte, geparkte S14-Punkte, additiver CHANGELOG.
- Evidence: vier Hit-Stop-Aufnahmen (eine je Paarung) und eine Übersicht.
