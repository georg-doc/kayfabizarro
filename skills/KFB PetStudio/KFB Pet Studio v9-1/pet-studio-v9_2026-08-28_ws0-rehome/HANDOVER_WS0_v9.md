# HANDOVER — KFB Pet Studio v9 → v10

**Für:** WS0, ein externes LLM, oder mein eigenes nächstes Ich in einem frischen Chat.
**Stand:** 2026-08-27 (WS1) · Sitzungsschnitt `export/pet-studio-v9_2026-08-27/`

---

## 0 · Lies in dieser Reihenfolge

1. **Dieses Blatt** — die Regel, die Fallen, das Offene.
2. **`KFB Pet Studio v9 SESSION_LIVING.dc.html`** — was GILT, mit Zahlen. Im Browser öffnen.
3. **`docs/CHANGELOG_studio.md`**, Eintrag **V9-S1** oben — wie es dazu kam, mit allen Fehlanläufen.
4. **`SPRINT_v10.md`** — was als Nächstes gebaut wird, in Reihenfolge, mit Abnahmezahl je Scheibe.
5. **`ONBOARDING_ext-LLM.md`** — nur wenn du KEIN Vorwissen über dieses Projekt hast.

Gebaut wird an **`KFB Pet Studio v9.dc.html`**. **v8 ist eingefroren** und bleibt Vergleichsmaßstab.
Messgriff im laufenden Studio: `window.__STUDIO9` (die Namen `__STUDIO5…8` zeigen auf dieselbe
Instanz, damit alte Abnahmeskripte laufen).

---

## 1 · Die eine Regel dieser Runde

> **Ein Ding sagt selbst, was es ist — im Namen, nicht im Bild.**

Sie ist zweimal bezahlt worden, beide Male am selben Tag:

- Der **Kontaktsaum** sah neben dem echten 3D-Schatten wie ein zweiter Schatten aus. Georg:
  »das könnte uns in Teufels Küche bringen, wenn das irgendeine andere KI oder ein anderer Nutzer
  anschaut und für einen REGULÄREN SCHATTEN hält«. Man sieht den Unterschied im Bild **nicht** —
  also steht er jetzt im Szenengraph: `kfb-pad-contact-seam-NICHT-DER-SCHATTEN`, mit Rolle,
  Nicht-Rolle und Verweis auf den echten Stempel in `userData.kfb`. Und er ist **aus im Default**.
- Die **Anker-Kreuze** standen im Standardbild. Eine Ablesehilfe im Default wird als Teil des
  Designs **nachgebaut, nicht hinterfragt**. Jetzt aus, Schalter mit Zusatz im Label.

Wer in v10 eine Hilfsfläche, eine Marke oder eine Messhilfe baut: **Name + `userData` + aus im
Default.** Das kostet drei Zeilen und spart eine Nacht.

---

## 2 · Fünf Fallen, in dieser Nacht bezahlt

**F1 · Eine notierte Regel ist keine gezogene.** R14 (»eine fremde Uhr hat eine fremde
Lebensdauer«) stand im Changelog, und der Zeichner hing trotzdem an genau einer drosselbaren Uhr.
Der Ersatz-Takt saß **hinter einem Riegel** (`if (this._tWired) return`), wurde also genau einmal
bewaffnet und war nach einem Unmount fort. Gemessen: **0 gezeichnete Pixel** bei frischem Laden,
während der Zeichner korrekt war. Heute drei Wege: idempotenter Takt (nie hinter einem Riegel) ·
direkter Anstoß bei jeder Zustandsänderung · Termin aus dem Render, solange nichts gezeichnet ist.

**F2 · Eine Vorschau, die nicht neu geladen hat, beweist nichts.** Drei Messrunden liefen gegen
eine alte Fassung: `typeof _tailBeat` war `undefined`, obwohl die Methode in der Datei stand. Der
Beweis kostet eine Zeile — `String(this.animate).indexOf('_tailBeat')`. Schwesterregel zu
**R1** (»Anwesenheit ist keine Gleichheit«).

**F3 · Ein Regler, der sich über die Hälfte seines Wegs nicht auswirkt, ist kein Regler.** Zweimal
in einer Nacht: der Art-Schalter (ein gespeicherter Zug überschrieb die Art-Vorgaben für immer) und
die Ansatz-Regler auf runden Formen (siehe F4).

**F4 · Eine Zusage im Modulkopf ist eine Behauptung, bis sie auf der KRUMMEN Form gemessen ist.**
»`a`, `b` = Anteil der Kantenlänge« galt nur für Geraden: die erste Fassung löste beide Ansätze auf
**einem** Segment auf, und auf dem 16-Punkt-Oval deckt das unterste Segment nur ~45,5…61,7 px der
90 px Breite. Gemessen: `round` lieferte für `a .10/b .90` und `a .30/b .70` **dieselbe** Spanne
16,28 px, ein Fuß klebte über den ganzen Reglerweg auf 45,5. Heute läuft `crossLowest()` die ganze
Kontur ab und nimmt die tiefste Kreuzung; die Füße dürfen auf verschiedenen Segmenten liegen.

**F5 · Kürzel im Gespräch sind Kosten, nicht Ersparnis.** »S1« war für Georg unlesbar (»was ist
S1?«), und »Füße« war mein Wort für den Bubble-Ansatz — ausgerechnet in der Runde, in der das Pet
echte Füße als Anker bekommt. Ein Wort, zwei Dinge. Kürzel leben im Changelog, nicht im Chat.

---

## 3 · Was gebaut ist, und wo die Naht sitzt

| Modul | Rolle | Naht nach draußen |
|---|---|---|
| `studio-v9/pad-contract.v1.js` | der Block `pad`: `kind` · `anchors` (7, gemessen) · `base` · `audio` | `apply(THREE, pet, root)` misst und schreibt; `anchorWorld()` liefert einen Anker in Weltkoordinaten |
| `studio-v9/pad-base.v1.js` | Kontaktsaum, Tuschekante, Klick-Ring, Landestaub | `createPadBase({THREE, scene, gnd})` · `update({footWorld, footR, edge})` · `pulse()` · `dust()` |
| `studio-v9/bubble-tail.v1.js` | Ansatz und Spitze als eigenes Bauteil | `splice(pts, box, tail)` gibt eine Kontur zurück, die jeder Zeichner malen kann |

**Wichtig für den Einbau in SpinballCast:** alle drei Module sind **reine Bauteile** — sie kennen
kein Studio, keine Bühne, keinen Tab. Was das Studio tut, ist Verkabelung; die Zahlen und die
Geometrie stehen in den Modulen. Wer sie in eine Sendung einhängt, ruft dieselben vier Funktionen.

**Die Anker in Kürze:** Einheit ist die **Grundform-Höhe (cubeH)**, Ursprung die **Fußmitte**,
`+z` ist die **Blickrichtung**. Sieben Punkte: `foot` `hip` `handL` `handR` `head` `mouth` `bubble`.
Gemessen am Hasen: Hüfte y 0,214 · Hände ±0,51/0,54 bei y 0,727 · Scheitel 1,32 · Mund z 0,522 ·
Bubble 1,68.

---

## 4 · Offene Altschulden, die NICHT aus dieser Runde stammen

1. **Vier Rückläufer ins Repo** aus V8-A, unverändert offen — plus die drei v9-Module.
2. **16 Schriftschnitte** (5,1 MB) liegen nur lokal und werden relativ eingebunden. Jedes
   Standalone zeigt deshalb Ersatzschriften. Ins Repo, dann `@font-face` auf RAW-URL.
3. **`cubeH` gegen `byCube`** — eine gemessene Kante schlägt ein gepflegtes Feld. v9 macht die
   Abweichung **sichtbar** (`cubeCheck`, Schwelle 2 %), löst sie aber nicht. Gehört in die
   Messschicht, nicht in `ground-contract`.
4. **Körperwürfel gleich groß?** Georgs Entscheidung steht aus (WS0s Stand sagt nein,
   `PET_FILL bunny 0,351`; Georgs Ansage sagt ja).

---

## 5 · Was NICHT angefasst werden darf

- **`KFB Pet Studio v8.dc.html`** und alles unter **`studio-v7/`** / **`studio-v8/`** — eingefroren.
  v9 hat kein Modul dort geändert; das ist der Grund, warum ein Vergleich noch möglich ist.
- **`bubble-shaper.v3.js`** insbesondere: der Zipfel-Befund darin ist beschrieben, aber **bewusst
  nicht repariert**. Der Ersatz lebt daneben. Wer beides gleichzeitig ändert, verliert den Maßstab.
- **`KFB Pet Podcast v5.dc.html`** und die SpinballCast-Stände — anderer Strang, eigene Verträge.
