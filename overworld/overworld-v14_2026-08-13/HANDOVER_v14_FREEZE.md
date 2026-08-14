# HANDOVER — Overworld v14, FROZEN (2026-08-14)

Für den Coworker und für jeden frischen Chat. Ein Blatt, das ohne Rückfragen arbeitsfähig macht.
Kurzfassung: **v14 ist ein Prüf- und Reparaturlauf, kein Feature-Sprint. Er ist fertig und wird
eingefroren.** Der Feature-Wunsch (Lebendigkeit zwischen den Zonen) ist v15.

---

## 1 · Was dieser Stand ist

| | |
|---|---|
| Arbeitsstand | `KFB Overworld v14.dc.html` (49 Skriptpfade → `./overworld-v14/`) |
| Prüfbare Auslieferung | `export/overworld-v14_2026-08-13/KFB-Overworld-v14-standalone.html` (846 kB, eine Datei) |
| Vergleichsmaßstab | `KFB Overworld v13.dc.html` + `overworld-v13/` — SUPERSEDED, **nicht löschen** |
| Vorgeschichte | `HOUSEKEEPING.md` §4z (V1 »Besitz der Fenster«), diese Sitzung §4z-C |
| Sprintplan | `docs/overworld-v14/SPRINT_overworld-v14.md` |
| Zahlen | `docs/overworld-v14/MESSUNG_v14_2026-08-14.md` |

**Der Runner (`overworld-game-v10.js`) gehört WS1.** Von hier gehen Änderungen daran als Diff, nie
als stiller Fork (`github.md` → »Nicht von hier ändern«). Alles unten Beschriebene liegt in WS0.

## 2 · Was in dieser Sitzung passiert ist

### C0 · Der Befund »jeder Klick läuft nach rechts« — Umgebungsartefakt, kein Spielfehler

Georg, 13.8.: im Vorschau-Reiter läuft die Einheit nach dem ersten Klick dauerhaft nach rechts; **A**
hält sie nur, solange die Taste unten ist. In der Chat-Vorschau nicht. **Im v13-Standalone nicht.**
Ein Klick in die Browserzeile beendet es.

Der Code schließt die naheliegenden Erklärungen aus:

- `travelPoint` **teleportiert** und räumt Ziel, Pfad und Angriffsziel — kein Dauerlauf.
- `overworld-game-v10.js:641`: **jeder Linksklick leert `keys`.** Eine hängende Taste kann es
  folglich gar nicht sein.
- Direkt darüber, Zeile 640: `window.focus()` mit dem Kommentar *„Chat/Panel stiehlt ihn — danach
  kamen keine keyups mehr an"*. Genau das benimmt sich in einem **verschachtelten** Vorschau-Rahmen
  falsch: der Fokus springt in den inneren Rahmen, `keyup` wird woanders ausgeliefert.

**Bewertung:** Artefakt der Vorschau-Verschachtelung. Kein Eingriff — ein Umbau am Fokusverhalten
des Runners wäre ein WS1-Diff für einen Fehler, der in keiner echten Umgebung auftritt.

**Falls es doch je in einer echten Umgebung auftritt**, liegt das Meßgerät bereit:
`overworld-v14/input-truth.js` (`input-truth-1.0`, unsichtbar bis man es ruft).

- **Umschalt+I** zeigt die Tafel unten links.
- Zeile **GESPENSTERTASTE** = eine Taste steht in `keys`, ist aber körperlich nicht unten
  (verschlucktes `keyup`) — der Beweis in einem Blick.
- **ERSTE URSACHE** friert den ersten unsauberen Schreibvorgang samt Datei und Zeile ein;
  `keydown … AUS CODE` entlarvt Skripte, die Tasten verschicken (`bench.js` tut das legitim).
- Konsole: `OW_INPUT.bericht()` · `OW_INPUT.frei()`. Ausbauen = eine `<script>`-Zeile aus der
  DC-Datei nehmen, sonst nichts. Es ändert **kein** Verhalten.

### C1 · Overlay-Disziplin: Fenster schließen nur über X

`overworld-v14/hud-v7.js`, `mkWin()`: der Hintergrund-Schließer `if(e.target===w)zu()` ist
**entfernt**. Ausstieg ist **X** und **Esc** (`OW_WINS.esc()`).

Zwei Gründe, beide im Code als Kommentar hinterlassen:

1. Nicht abgesprochen — ein Fehlklick soll keine Sitzung wegräumen (Abnahme Georg, 13.8.).
2. Er war ohnehin defekt: im Shadow-DOM nennt `e.target` von außerhalb den **Wirt**, nicht das
   getroffene Kind — der Vergleich traf also auch bei Klicks **ins** Fenster zu. Genau das hat sich
   „unbeabsichtigt" angefühlt. Wer das Verhalten je zurückwill, prüft `e.composedPath()[0]===w`.

**Bewußt nicht angefaßt** (dort ist Wegklicken beabsichtigt, Entscheidung offen):
`bubble-ts.js:570` (Sprechblase) · `reveal-2d.js:137` (Aufdeck-Overlay).

### C2 · Messung

Chrome-Grundlinie steht in `MESSUNG_v14_2026-08-14.md`. Zwei Sätze daraus:
**60 fps, kein Bild über 33 ms** — und **Zeichnen = 1 ms = 6 % des Bildes**, der Engpaß liegt also
nicht dort, wo man ihn vermutet. Deshalb wurde **nichts** optimiert: Georgs Beschwerde gilt Firefox,
und Firefox ist noch nicht gemessen.

## 3 · Die eine offene Aufgabe an diesem Stand

**Bench in Firefox laufen lassen** — Anleitung Schritt für Schritt in
`MESSUNG_v14_2026-08-14.md` §4. Ergebnis sind zwei Dateien (Firefox + Chrome, dieselbe
Standalone-Datei, eigener Reiter). Damit ist in zwei Minuten entschieden, ob die **3 129
Schattenzeichnungen pro 210 Bilder** der Täter sind oder ob die Last in `step`/KI liegt.

Erst danach wird gebaut. Vorher ist jede Optimierung geraten.

## 4 · v15 — was schon feststeht

Aus Georgs Wunschliste (13.8.), nach Reihenfolge:

1. **Leistung nach Befund** — die Schicht, die die Firefox-Messung benennt. Dazu ein **Kampf-Lauf**
   für `bench.js`: `atkFrames 0` heißt, „performante Fights" sind bis heute **unbelegt**.
2. **Lebendigkeit zwischen den Karten-Zonen** — Mob-Zonen in vernünftiger Verteilung, natürliche
   Patrouillenpfade, Einzel-Mobs mit Zweck (nach Ressourcen suchen: Goldnuggets etc.).
   Vorbedingung: die Mob-Zahl steigt. Bei 32 Mobs ist gemessen — **vorher** messen, wo die Kurve
   kippt, sonst wird die Lebendigkeit zum Ruckelgrund.
3. **Zufalls-Test aller Mob-Einheiten** — jede Einheit einmal in Bewegung und im Kampf gesehen.
4. Aus §4z offen: **C3** (Ablage über dem Kopf, drei Coworker-Nachzüge) · **P2** (Streifen-Bäcker,
   `footY` ist der Vertrag) · **C4**. Und die Entscheidung, ob die Mob-Übersicht des gelöschten
   dunklen Blattes (Körperhöhe · Hieb · Lauf) als Papier zurückkommt.

## 5 · Regeln, die in diesem Workspace gelten

- Assets **immer** per GitHub-RAW, nie relativ (`./assets/…`) — der Standalone-Export hat kein
  Nachbarverzeichnis; relativ heißt dort schwarzer Schirm.
- Der Runner gehört WS1: Diff, kein Fork.
- Schreibweisen sind Kanon: **KayfaBINGO · KayfaBONGO · KayfaBOGGLE**, zweiter Teil in
  Großbuchstaben. IDs im Code bleiben klein (`bingo`, `bongo`, `boggle`).
- Gemessen wird, wo es weh tut, nicht wo es bequem ist: eine Messung ohne Fokus im Rahmen ist eine
  **Untergrenze** und markiert sich selbst als `vertrauenswuerdig: false`.
