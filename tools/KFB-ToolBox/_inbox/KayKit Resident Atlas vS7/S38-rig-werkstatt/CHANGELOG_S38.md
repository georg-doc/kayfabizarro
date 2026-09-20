# Changelog-Auszug · S38

(Additiver Auszug aus `CHANGELOG.md` des Projekts. Ältere Scheiben bleiben dort stehen.)

## S38 · 2026-09-20 · Rig-Werkstatt S7 — Gliederpuppe, geteilte Editor-Schicht, Prüfstand

Ausführlich in `docs/RIG_WERKSTATT_S7.md`, Eye-Rig-Prüfung in
`docs/EYE_RIG_BATCH_REVIEW_S38.md`, Messwerkzeug `tools/eye-lid-color-probe.html`.
Neue Seite `KFB_Resident_Atlas_S7.html`; S6 bleibt unverändert stehen.

### Gebaut

- **`lib/edit-layer.js` — die Editor-Schicht als Bibliothek.** Zweiter Einbau des Mini-Editors aus
  der Raumstudie S21, und damit genau der Fall, für den `docs/EDITOR_LAYER.md` sie vorsieht:
  *„Beim zweiten Einbau wird aus dem Block `lib/edit-layer.js` — nicht vorher: eine Bibliothek aus
  einem einzigen Anwendungsfall ist geraten, nicht abgeleitet."* Übernommen statt neu erfunden:
  Auswahl auf `pointerup` mit 4-px-Schwelle, Picking nur auf Sichtbares, Werkzeugmenü am Objekt
  (✥ ⟳ ⤢ ⬓ ⊹ ✕), Raster, zwei Reichweiten.
- **Zwei begründete Abweichungen vom Raum-Standard.** Rasterschritt **0,05 statt 0,1** — dort ist
  die Bezugsgröße ein Raummodul von 4 Einheiten, hier eine Figur von 2,3, und 0,1 wären 4 % der
  Figurenhöhe. Dazu ein sechstes Feld **⊹ Welt/Lokal**: ein Ding in der Hand will in den Achsen
  der Hand gedreht werden.
- **EIN Anfasser für alles.** Requisiten, Bone-Posing und Puppe hängen an derselben
  `TransformControls`-Instanz und leihen sie über `borrow()`. `makeStudio(…, {noGizmo:true})`
  macht das Studio zur reinen Sammelstelle — was seine eigentliche Aufgabe ist.
- **`lib/rigwork.js` — die Gliederpuppe.** Sieben Anfasser, aus der Hierarchie abgeleitet statt
  aus einer Namensliste: Hände und Füße als IK-Ziele, Kopf und Brust als Dreh-Anfasser am Bone,
  Hüfte trägt die ganze Figur. Marker mit `depthTest:false` — Hüfte und Füße liegen im Körper,
  und ein Anfasser, den die eigene Figur verdeckt, ist keiner.
- **Boden-Haftung als festgehaltener Messwert**, nicht als Physik: die Weltposition beider
  Fußspitzen im Moment des Einrastens. Jede spätere Bewegung von Hüfte oder Oberkörper zieht die
  Beine per CCD auf genau diese zwei Punkte zurück.
- **Prüfstand und Stapel.** „Geprüft" ist ein Datum an den Korrekturen, kein Häkchen in einer
  zweiten Liste, und es reist im Bündel mit. Export einzeln / nur geprüfte / ganzer Stapel;
  der Import frisst das Bündel UND den alten S6-Einzel-Patch.
- **Kopieren in drei Stufen.** `navigator.clipboard` hängt am sicheren Kontext UND an der
  Berechtigung des einbettenden Rahmens; in einem fremden iframe lehnt sie ohne sichtbaren Grund
  ab. Stufe 2 ist `execCommand`, Stufe 3 legt den Text markiert ins Panel. Ein Knopf, der nichts
  tut und nichts sagt, ist schlimmer als kein Knopf.

### Gemessen

| Prüfung | Ergebnis |
|---|---|
| Anfasser auf Rig_Medium (Goth Girl) | 7/7 gefunden, keiner fehlt |
| Armkette | `upperarm.r > lowerarm.r > wrist.r` → Spitze `hand.r` |
| Boden-Haftung, Hüfte −0,25 | Fuß-Restfehler **0,0000**, Pin-y 0,1613 = Ist-y 0,1613 |
| Armziel 0,4565 außer Reichweite | Restfehler 0,4443, über drei Durchläufe stabil |
| Auswahl überlebt Kamerafahrt | `speaker` bleibt gewählt nach 40-px-Zug über Leerraum |
| Rasterdrehung am Testexport | micstand −28° → **62°** = exakt +90° auf 15°-Raster (Rasterung greift auf dem Delta) |
| Absetzen am Testexport | micstand y 0 → **0,004** — Unterkante auf der Fläche, nicht auf einer runden Zahl |

### Vier eigene Fehler in dieser Scheibe

1. **Die Lehre stand schon im eigenen Repo.** Der Anfasser war unbedienbar, weil der Szenen-Picker
   auf `pointerdown` lag: ein Anfasser-Pfeil steht neben dem Objekt in der LUFT, der Strahl trifft
   dort nichts, und „nichts getroffen" löste die Auswahl — der Griff hob sich selbst auf. Im
   `CHANGELOG` der Raumstudie steht seit demselben Tag *„Picking auf pointerup mit 4-px-Schwelle
   statt auf pointerdown"*. Ich habe dieselbe Stelle ein zweites Mal gebaut, ohne die eigene Notiz
   zu lesen.
2. **Die Spitzensuche sortierte nach Tiefe.** Damit war die Spitze jedes Fußes die ZEHE und jeder
   Hand das HANDGELENK — eine Kette, die am Handgelenk endet und an der Schulter nicht anfängt,
   erreicht nichts: gemessen 0,80 Restfehler auf einer 2,3 hohen Figur. Die Musterliste ist jetzt
   eine Rangfolge, die Tiefe entscheidet nur noch innerhalb eines Musters.
3. **`hidden` gegen das eigene Stylesheet verloren.** `#objmenu{display:flex}` schlägt
   `[hidden]{display:none}`; die Werkzeugleiste stand dauerhaft halb links aus dem Bild und gab
   der Seite 36 px Scrollhöhe. Derselbe Mechanismus wie der S35b-Befund an `#pick`/`#timeline`,
   nur andersherum — dort gewann ein Inline-Style, hier der eigene Eintrag.
4. **Der Werkstatt-Block stand hinter dem `await show(start)`.** Der erste Aufbau ruft
   `renderPuppet()`, und eine `const` aus einem späteren Modulabschnitt existiert dann noch
   nicht: `Cannot access 'COL' before initialization` — eine leere Seite, deren Ursache drei
   Bildschirme weiter unten steht.

### Eye-Rig-Batch Rig_Large · geprüft, nicht übernommen

Der gemeldete Stand („individuelle Werte übernommen, Lidfarben-Bug zentral gefixt, 95/95 sauber")
hält der Datei in zwei von drei Punkten nicht stand:

- **Die Lidfarbe ist bei allen vier dieselbe** — `baseColor "#b58f83"` auf Monstrosity, Black
  Knight, Demon Lord und Orc Brute, dazu `faceColor: null` und
  `faceColorSource: "generic-fallback-unverified"`. Entweder wirkt der Fix nur zur Laufzeit und
  der Export schreibt ein totes Feld, oder er hat diese vier nicht erreicht. Beides ist ein Befund.
- **„95/95 sauber" steht neben `sourceEyeCleanupVisuallyAccepted: false`** — viermal. Der
  ausgeschnittene Augenbereich ist die Bedingung, an der die Mit-/Ohne-Variante hängt; ein
  Prüfsatz, der sie nicht stellt, misst etwas anderes. Siebter Fall der Klasse „Testsatz mit
  einem Loch".
- **`pairConfidence: 0.7` ist eine Konstante.** Black Knight: 1 Kandidat, exakt gespiegelt.
  Demon Lord: 12 Kandidaten, acht davon mit identischen 35 Dreiecken. Monstrosity: das angenommene
  Paar liegt bei x [−0,064 / +0,104] — **nicht gespiegelt**, 6,4 % der Kopfbreite, obwohl der Modus
  `mirrored-front-pair` heißt.

Gegenmessung statt Gegenbehauptung: `tools/eye-lid-color-probe.html` misst die Gesichtsfarbe am
Modell (Kopf-Mesh aus dem Batch, vorderes Gesichtsband über die UVs, **Modalfarbe** statt
Mittelwert — eine flache Palette gemittelt ergibt eine Farbe, die im Blatt nicht vorkommt) und
stellt sie `#b58f83` gegenüber.

---

