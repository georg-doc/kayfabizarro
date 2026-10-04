# Onboarding · KFB Travel Combat v25 → v26 (für einen frischen Chat)

Dieses Dokument ist der Einstieg. Wer es gelesen hat, kann in v26 weiterbauen, ohne die
Vorgeschichte zu kennen. Reihenfolge: **was das Ding ist** → **wo die Nähte sitzen** →
**wie man es startet und prüft** → **was man nicht anfassen darf**.

---

## 0 · Was das ist

Ein Browser-Spielprototyp: ein Pet/Mech reist durch Voxel-Terrain, am Boden und im Flug, und
kämpft gegen Sky-Mobs. Kein Bundler, kein Build. Ein `.dc.html` als Wirt, daneben ein Ordner
`terrain-v25/` mit ES-Modulen, die per `import` geladen werden. three.js 0.160, klassisches WebGL.

| Artefakt | Rolle |
|---|---|
| `KFB Travel Combat v25.dc.html` | Wirt. Lädt Module, hält Modus-Umschaltung, Panel, Konsole. |
| `terrain-v25/travel-poc.js` | Der Kern. Szene, Loop, Modi (`ground`/`fly`), globales `__travelPOC`. |
| `terrain-v25/combat-host.js` | Kampfwirt. Waffen, Ziele, Emitter, Vektorfabriken, Proben. |
| `terrain-v25/pet-kinetics.js` | Bewegung der Figur: Bob, Stauchung, Kadenz, Schrittmaß. |
| `terrain-v25/voxel-terrain.js` | Welt aus Würfeln. Instanziert, `edge3.jpg` als Kachel. |
| `terrain-v25/settings-schema.js` | Alle Regler. 86 kB, die Wahrheit über jeden Zahlenwert. |
| `docs/CHANGELOG_v25.md` | Jede Änderung als „Naht" mit Nummer, Datum, Versionsmarker. |
| `docs/SPRINT_v25.md` | Der Sprint, der v25 gebaut hat. Enthält den Clean-Run (§4). |

**v24 existiert noch** (`terrain-v24/`, eigenes DC) und bleibt eingefroren. Er ist der
Vergleichsmaßstab. Achtung: einige Module teilen sich beide Fassungen — eine Änderung dort ist
in v24 **sichtbar**. Wer v24 als Vorher-Bild braucht, ändert geteilte Module nicht blind.

---

## 1 · Wo die Nähte sitzen

„Naht" heißt in diesem Projekt: eine abgeschlossene Änderung mit Nummer im Changelog und einem
Versionsmarker (`v25.2a` … `v25.2s`) im Quelltext. Man findet jede Änderung, indem man den Marker
sucht. Die letzten Nähte, die man kennen muss:

**Naht 179 (v25.2r) — Renn-Bob und ein vergifteter Pool.** Zwei Funde in einem:

1. Die Kadenz blieb beim Sprint gleich (2,00–2,01 Zyklen/s), nur die Amplitude stieg um 50 %.
   Das ergibt einen Pogo-Stick, keinen Lauf. Neu: niedrigere Amplitude (0,055), mehr Stauchung
   (0,075), längere Flugphase. Live stellbar: `petKin.setBob('run', v)` / `setBob('hang', v)`,
   Zustand lesen mit `petKin.bobReport()`.
2. `shots.update` lag **hinter** dem `isWalk()`-Ausstieg. Beim Landen froren fliegende Schüsse
   ein, und beide Pools (48 Schüsse, 64 Sprites) blieben danach dauerhaft belegt. Jetzt wird
   immer getaktet, am Boden ohne Trefferwelt.

**Naht 178 (v25.2q) — Kollision und Sprung** am Boden repariert.

**Naht 177b — die Treppe.** Felsstufen-Maße; siehe `SPRINT_v25.md` §5.

**Naht ~170 — `ground-shadow.js`.** Trägt als einziges Modul der Änderungsliste keinen
Versionsmarker. Wer dort sucht, sucht nach dem Dateinamen, nicht nach `v25.2`.

**v25.2s (heute) — Pfad-Hygiene `edge3.jpg`.** Die kanonische RAW-URL zeigte auf
`media/3D_Assets/Textures/edge3.jpg` und antwortete mit 404. Die Datei liegt tatsächlich unter
`travel/travel-v16/terrain-v16/edge3.jpg`. In allen drei Modulen (`voxel-terrain`, `voxel-glyphs`,
`hud-cube`) korrigiert. Ladekette bleibt: **lokaler Spiegel zuerst, RAW-URL als Rückfall** — in der
Vorschau spart das den Netzweg, im Standalone greift der Rückfall.

---

## 2 · Starten und prüfen

DC öffnen. Der Clean-Run steht vollständig in `docs/SPRINT_v25.md` §4 — dort stehen die Zeilen,
die die Konsole zeigen **muss**. Wenn eine fehlt, ist etwas kaputt, bevor man irgendetwas anderes
untersucht.

Alles Weitere läuft über Proben in der Konsole. Sie sind das Rückgrat dieses Projekts: **eine
Behauptung über das Spiel wird gemessen, nicht geschätzt.**

```js
await __travelPOC.fpsprobe(5)   // fps über 5 s. Braucht ein FOKUSSIERTES Fenster.
combat.poolprobe(6)             // Pool-Auslastung über 6 Würfe. Erwartung: 10,6 Kreise/Wurf.
combat.kapselprobe(10)          // 10 Würfe auf ein lebendes Ziel, Schaden null.
petKin.bobReport()              // Bob-Zustand: Kadenz, Amplitude, Stauchung, Flugphase.
```

**Die Falle, an der zwei Sitzungen verloren gingen:** `requestAnimationFrame` liefert **null
Frames**, wenn das Fenster nicht im Vordergrund ist. Eine Messung im Hintergrund ist keine
schlechte Messung, sondern gar keine. Beide Proben verweigern sich deshalb selbst, wenn sie zu
wenig Daten haben — eine Probe, die eine Zahl nennt, hat auch gemessen.

**Die zweite Falle:** `combat.kapselprobe` gab einmal ein stilles **0 von 10** ab. Die Waffe war
in Ordnung; die Probe fing den `isWalk()`-Ausstieg ab und maß nichts. Ein 0-Ergebnis aus einer
Probe ist erst dann ein Befund, wenn man weiß, dass die Probe überhaupt gelaufen ist. Nachlesen:
`SPRINT_v25.md` §2 — der Abschnitt heißt „Der Befund, der die Waffe gerettet hat".

---

## 3 · Regeln, die dieses Projekt sich gegeben hat

1. **Zahlen statt Adjektive.** „Wirkt zu klein" wird zu einer Messung, bevor daran geschraubt
   wird. Der Maßstabs-Befund in §3/§5 des Sprints ist das Musterbeispiel: Georg hatte recht, und
   die Rechnung sagte um welchen Faktor.
2. **Parameter in den Wirt, nicht in das Modul.** Wenn v25 einen anderen Wert braucht als v24,
   ist das ein `params`-Wert beim Aufruf — keine zweite Fassung des Moduls.
3. **Kein Wert wird gerundet weitergereicht.** 10,6 kommt aus `0,28 × 34 / 0,9`. Wer 11 schreibt,
   verliert die Herleitung.
4. **Jede Änderung wird eine Naht.** Nummer, Datum, Versionsmarker im Code. Sonst ist sie in zwei
   Wochen nicht auffindbar.
5. **Sichtbares kann nur Georg abnehmen.** Bob, Trefferreaktion, Schrittmaß-Gefühl: dafür gibt es
   keine Messung, die das Urteil ersetzt. Solche Punkte werden vorgelegt, nicht entschieden.

---

## 4 · Was v26 als Erstes zu klären hat

Die vier offenen Urteile und die zwei ungelesenen Zahlen stehen in **`SPRINT_v26.md`**, dort mit
Begründung und Aufwand. Der erste Eintrag ist die einzige Frage, die wirklich blockiert:
**Sky-Karten §8 — ein Deck pro Zone oder alle drei durchmischt.**
