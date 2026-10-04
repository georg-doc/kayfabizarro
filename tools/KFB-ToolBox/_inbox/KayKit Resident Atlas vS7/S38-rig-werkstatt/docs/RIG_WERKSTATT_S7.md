# Rig-Werkstatt · S7

Stand 2026-09-20. Dateien: `KFB_Resident_Atlas_S7.html` · `lib/edit-layer.js` · `lib/rigwork.js` ·
Erweiterungen in `lib/studio.js`.
Vorbild für die IK-Bedienform: three.js `webgl_animation_skinning_ik`. Vorbild und verbindlicher
Standard für die Editor-Bedienung: `docs/EDITOR_LAYER.md` aus der Raumstudie S21.

## lib/edit-layer.js — zweiter Einbau, also Bibliothek

Der Editor-Standard sagt: „Beim **zweiten** Einbau wird aus dem Block `lib/edit-layer.js` — nicht
vorher: eine Bibliothek aus einem einzigen Anwendungsfall ist geraten, nicht abgeleitet." Das hier
ist der zweite Einbau, also ist die Bibliothek fällig. Übernommen statt neu erfunden: Auswahl auf
`pointerup` mit 4-px-Schwelle, Picking nur auf Sichtbares, Werkzeugmenü am Objekt mit sechs
Feldern, Raster, zwei Reichweiten.

Zwei bewusste Abweichungen, beide begründet: Rasterschritt **0,05 statt 0,1** (dort ist die
Bezugsgröße ein Raummodul von 4 Einheiten, hier eine Figur von 2,3 — 0,1 wären 4 % der Figurenhöhe
und für ein Mikrofon in der Hand zu grob), und ein zusätzliches Feld **⊹ Welt/Lokal**, weil ein
Ding in der Hand in den Achsen der Hand gedreht werden will, nicht in denen der Welt.

**EIN Anfasser für alles.** Requisiten, Bones und die Puppe hängen an derselben
`TransformControls`-Instanz; wer sie braucht, leiht sie über `borrow()`. Das Studio bekommt dafür
`makeStudio(…, { noGizmo: true })` und ist dann nur noch die Sammelstelle — was seine eigentliche
Aufgabe ist.

## Was dazugekommen ist

**Gliederpuppe.** Sieben Anfasser, aus der HIERARCHIE abgeleitet statt aus einer Namensliste:
Hand links/rechts und Fuß links/rechts als IK-Kugeln, Kopf und Brust als Dreh-Oktaeder direkt am
Bone, Hüfte als Würfel, der die ganze Figur trägt. Alle Marker mit `depthTest:false` — Hüfte und
Füße liegen im Körper, und ein Anfasser, den die eigene Figur verdeckt, ist keiner.

**Boden-Haftung.** Kein Schalter auf eine Physik, sondern ein festgehaltener Messwert: die
Weltposition beider Fußspitzen im Moment des Einrastens. Jede spätere Bewegung von Hüfte oder
Oberkörper zieht die Beine per CCD auf genau diese zwei Punkte zurück.

**Requisiten.** Der bestehende Objekt-Anfasser bekommt drei Griffe dazu: Achsenraum Welt/Lokal
(für ein Ding in der Hand ist die Hand der richtige Raum, nicht die Welt), *Absetzen* (senkrechter
Strahl auf die nächste Fläche darunter, ohne Treffer ist der Boden die Fläche und das wird gesagt),
und *Auf Recipe zurück* gegen einen Grundstand, der VOR dem Auftragen gesammelter Korrekturen
gemerkt wird.

**Prüfstand.** `geprüft` ist ein Datum an den Korrekturen, kein Häkchen in einer zweiten Liste, und
es reist im Bündel mit. Export einzeln / nur geprüfte / ganzer Stapel; Import akzeptiert das Bündel
UND den alten Einzel-Patch aus S6.

## Gemessen

| Prüfung | Ergebnis |
|---|---|
| Anfasser auf Goth Girl (Rig_Medium) | 7/7 gefunden, keiner fehlt |
| Armkette | `upperarm.r > lowerarm.r > wrist.r` → Spitze `hand.r` |
| Boden-Haftung: Hüfte −0,25 | Fuß-Restfehler **0,0000**, Pin-y 0,1613 = Ist-y 0,1613 |
| Armziel 0,4565 außer Reichweite | Restfehler 0,4443, über drei Durchläufe stabil — die Kette ist gestreckt, und das steht als Zahl da statt als schöner Pose |
| Auf Boden setzen (sitzende Figur) | −0,5628; Box3 hätte hier die Bind-Pose gemessen, gerechnet wird auf der posierten Haut |

## Drei eigene Fehler in diesem Slice

1. **Die Spitzensuche sortierte nach Tiefe.** Damit war die Spitze jedes Fußes die ZEHE und jeder
   Hand das HANDGELENK — und eine Kette, die am Handgelenk endet und an der Schulter nicht
   anfängt, erreicht nichts: gemessen 0,80 Restfehler auf einer 2,3 hohen Figur, weil nur der
   Unterarm drehen durfte. Die Musterliste ist jetzt eine RANGFOLGE (`hand` vor `wrist`,
   `foot` vor `toe`), die Tiefe entscheidet nur noch innerhalb eines Musters. Arme laufen über
   3 Glieder bis zur Schulter, Beine bewusst nur über 2 — ein drittes Glied wäre die Hüfte, und
   dann verschiebt ein Fußgriff die ganze Figur.
2. **Der Anfasser löste sich im Moment des Zugreifens** — und das war kein Schönheitsfehler,
   sondern „Anfasser funktionieren nicht". Der Szenen-Picker lag auf `pointerdown` und raycastete
   gegen die Figur. Ein Pfeil des Anfassers steht aber neben dem Objekt in der LUFT: der Strahl
   trifft dort nichts, und „nichts getroffen" hieß „Auswahl lösen". Zwei getrennte
   `TransformControls` auf demselben Canvas haben es verschärft. Die Lehre stand seit dem
   2026-09-20 im eigenen Repo (`CHANGELOG` der Raumstudie: *„Picking auf `pointerup` mit
   4-px-Schwelle statt auf `pointerdown`: der Raycast klaute vorher die ersten Frames jedes
   Orbit-Drags"*) — ich habe sie nicht gelesen, bevor ich dieselbe Stelle ein zweites Mal gebaut
   habe. Gemessen nach dem Umbau: Auswahl `speaker` überlebt eine 40-px-Kamerafahrt über Leerraum.
3. **Der Werkstatt-Block stand hinter dem `await show(start)`.** Der erste Aufbau ruft
   `renderPuppet()`, und eine `const` aus einem späteren Modulabschnitt existiert zu dem
   Zeitpunkt nicht. Sichtbar als `Cannot access 'COL' before initialization` — eine leere Seite,
   deren Ursache drei Bildschirme weiter unten steht.

## Offen

- Kein Ellbogen-/Knie-Pol: CCD wählt die Beugerichtung selbst und kann kippen. Sichtbar, nicht
  gemessen; ein Pol-Ziel ist der nächste Schritt, falls es stört.
- Kopf und Brust drehen am Bone, ohne `lookAt`-Ziel. Ein Blickziel bräuchte die Blickachse der
  Figur, und die ist auf diesen Rigs nicht gemessen (siehe die Richtungsleser-Regel aus S37).
- Der Pack-Browser mit Live-Suche (Schritt 3) fehlt noch. Material dafür ist seit dem Sync vom
  2026-09-20 da: Furniture Bits, Restaurant Bits, Space Base Bits, Medieval Builder, Tiny Treats.

---

## Abnahme am Testexport (2026-09-20)

Georgs Export `goth-girl.atlas-recipe.json`, gelesen statt geglaubt:

| Knoten | Rezept (data/cast.js) | Export | gewertet |
|---|---|---|---|
| `micstand` | p [0,8 / 0,12] · r **−28°** | p [1,05 / 0,004 / 0,65] · r **62°** | **Handkorrektur, in `studioPatch.nodes`** |
| `speaker` | p [−0,85 / −0,05] · r 14° | identisch | **nicht bewegt** |
| `microphone` | an `handslot.r`, `optional: true` | lokal 0/0/0, r 0 | **unberührt und ausgeschaltet** |
| `stool`, `gothgirl` | — | unverändert (y 0,3187 = Sitzausrichtung aus dem Bau) | in Ordnung |

Drei Dinge, die diese Zahlen belegen:
- **Das Rasterdrehen funktioniert.** −28° → 62° sind exakt **+90°** auf einem 15°-Raster. Die
  Rasterung greift auf dem DELTA, nicht auf dem Absolutwert — deshalb ist 62 kein Vielfaches von
  15 und trotzdem gerastert.
- **Das Absetzen funktioniert.** y 0 → 0,004: die Unterkante liegt auf der Fläche, nicht auf einer
  runden Zahl. Ein gerasterter Wert wäre hier das Warnzeichen gewesen.
- **Nur was angefasst wurde, steht im Patch.** `speaker` ist im `placements`-Block (Ist-Zustand
  der Szene), aber nicht in `studioPatch` (Handkorrekturen). Die beiden Blöcke sagen
  Verschiedenes, und das ist Absicht.

Offen aus Georgs Ansage: die **Lautsprecherbox nach rechts** ist noch nicht gesetzt, und das
**Handmikro** ist weiterhin die ausgeschaltete Promo-Abweichung — wer es drehen will, muss es erst
über „Optional" zuschalten.

## Nächste Slices, in dieser Reihenfolge

**E2a · Pol-Ziele für Ellbogen und Knie.** Der einzige echte Mangel der Puppe: CCD wählt die
Beugerichtung selbst und kann kippen. Ein Pol-Marker je Kette, als dritter Handle-Typ, kostet
wenig und beendet das einzige „sieht manchmal falsch aus".

**E2b · Blickziel.** Kopf und Brust drehen heute am Bone. Ein `lookAt` braucht die Blickachse der
Figur, und die ist auf diesen Rigs **nicht gemessen** — nach der S37-Regel erst messen (mit
genannter Größenordnung), dann bauen. Verwandt mit dem Eye-Rig: dort ist die Blickrichtung schon
ein Adapter.

**E3 · Pack-Browser mit Live-Suche.** Der dritte Schritt aus Georgs Plan. Material ist seit dem
Sync vom 2026-09-20 da: Furniture Bits (53 glTF), Restaurant Bits (144), Space Base Bits (57),
Medieval Builder (226 glb), Tiny Treats Baked Goods (32). Suchfeld + Filter nach Pack, Klick setzt
das Teil vor die Kamera, danach übernimmt die Editor-Schicht. Erst hier lohnt sich ein
Registry-Zugriff statt einer festen Liste.

**E4 · Sitzen und Greifen** (der Vertrag aus `docs/EDITOR_LAYER.md`): Einrasten auf einer
gemessenen Sitzfläche, Hand auf ein angeklicktes Ziel. Das Greifen ist mit der Puppe im Prinzip
gebaut — es fehlt nur „Ziel anklicken statt Marker ziehen".

**E5 · Eye-Rig-Einbau.** Erst wenn `docs/EYE_RIG_BATCH_REVIEW_S38.md` Punkt 1–3 abgearbeitet
sind. Dann als Schalter „Augen an/aus" je Resident in derselben Sammelstelle wie die übrigen
Korrekturen, damit eine Stilvariante exportierbar ist wie eine Pose.

**Aufräumen, wenn die Schicht ein drittes Mal eingebaut wird:** `lib/edit-layer.js` in die
ToolBox heben und in der Raumstudie den kopierten Block dagegen tauschen. Vorher nicht — zwei
Einbauten sind die Ableitung, drei wären die Bestätigung.
