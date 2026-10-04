# Pet Studio v10 · Rolli ist ein Bewohner

**29.08.2026.** Gebaut nach zwei Fehlversuchen, die beide Georg gestoppt hat. Was jetzt steht, steht
an **einer** Stelle: im Studio.

---

## Der Stand in einem Satz

`petstudio-v9/KFB Pet Studio v10.dc.html` ist ein Fork von v9, und **Rolli steht darin in derselben
Liste wie die 24 Pets** — mit Studio-Kamera samt Orbit, Studio-Licht, Skydome, Sprechblase, allen
Reitern, und **Augen und Mund kommen aus denselben Bausteinen wie bei jedem Pet**.

---

## Runde 2 · Georgs drei Bildbefunde (29.08.)

Drei Meldungen, alle drei berechtigt, alle drei am Bild gefunden — nicht an Zahlen.

### 1 · »Zwei überlappende Blätter« — das GLB bringt sein eigenes mit

Gemessen am geladenen Mesh: **62 Dreiecke, 52 liegen auf dem Zylinder, 10 reichen bis Radius 0,216**
bei Rollenradius 0,115. Das ist ein Blatt, das vorn an der Tangente ansetzt und 0,183 unter die Achse
fällt — und das simulierte Blatt startet an **derselben** Stelle, 4 mm davor.

Georgs `SPEC.clip` sollte das lösen, konnte es aber per Konstruktion nicht: die Ebene schneidet, was
**unter der unteren Tangente** liegt, und lässt genau das Stück zwischen Achse und Tangente stehen —
die Hälfte, die man sieht. Eine Fläche gegen eine Form, dieselbe Klasse Fehler wie beim Schatten in
Podcast v3.

Jetzt entscheidet die Geometrie: ein Dreieck, dessen **Schwerpunkt** weiter als 1,03 × Radius von der
Achse liegt, gehört zum Blatt. Der Schwerpunkt und nicht ein Eckpunkt — die Übergangsdreiecke haben
Punkte auf beiden Seiten, und wer sie mitnimmt, reißt ein Loch in den Zylinder. Gemessen nach dem
Trennen: **Rolle 0,325 … 1,275 Welt = Achse ± Radius, exakt.**

**⚠ Falle, die nur die Messung zeigte:** die Hüllkiste einer Geometrie kommt aus **allen**
Eckpunkten, nicht aus den benutzten. Nach dem Trennen lagen die Blatt-Eckpunkte noch im Puffer,
unsichtbar, aber gezählt — die Kiste reichte weiter bis 0,045, wo die Rolle bei 0,325 endet. Das
fällt nicht im Bild auf, sondern beim **Rahmen**: die Kamera holt ihren Ausschnitt aus dieser Kiste.
Also wird sie über die benutzten Eckpunkte selbst gesetzt.

### 2 · »Mund funktioniert nicht« — er war ein zweiter Mund

Rolli hatte eine eigene gebogene Schale und eine **Fassade**, die die Reiter-Aufrufe darauf umbog.
Die Schale saß richtig, aber die Reiter griffen ins Leere.

Der Befund beim Nachlesen: **`PetMouth` tastet jeden seiner 52 Punkte auf die Körperfläche ab** — er
kann die Rollenwölbung von selbst, wenn man ihm die Rolle als Fläche gibt. Also: Schale und Fassade
weg, und das Modul liefert stattdessen **zwei unsichtbare Flächen**, auf die der Wirt seine eigenen
Bausteine setzt — die Stiel-Box für die Augen, den **Rollenmantel** für den Mund.

Abgenommen über den echten Bedienweg (Knöpfe klicken, Textur ablesen):
`closed → M · open → Aa · wide → Ee · round → Oh · smile → Neutral`. Das rote Set hat kein Grinsen,
das Lächeln trägt der Mundwinkel — wie im Vertrag des Munds vorgesehen.

**⚠ Falle, teuer, wenn man sie nicht kennt:** `PetMouth` liest seine Einheit U aus der halben
y-Ausdehnung der **Geometrie**-Hüllkiste. Die Zylinderachse muss darum **in der Geometrie** gedreht
werden, nicht am Mesh — am Mesh gedreht wäre U die halbe Länge (0,137) statt der Radius (0,115), und
der Höhenregler würde den Mund **seitlich** schieben.

**⚠ Und:** die Flächen sind `opacity: 0`, nicht `visible = false`. Ein unsichtbares Elternteil
versteckt seine Kinder mit, und das Gesicht ist ein Kind.

Die Reglerspanne für die Mundhöhe war **−1,0 … +0,15** — gebaut für Cube-Pets, deren Mund unter der
Mitte sitzt. Rollis Lippe sitzt bei **+0,52** (aus Georgs `a0` 1,02 rad: cos = 0,52), also braucht
die Spanne die andere Hälfte: jetzt **−1,0 … +0,9**.

### 3 · »Sind die Augen exakt die gleichen wie bei den Pets?« — nein, waren sie nicht

Dieselbe Klasse, andere Einstellung. Das Modul baute sein Rig mit einem **zweiten Wertesatz**: graue
Lidfarbe statt der Farbe aus dem Pet, eigenes Blinzeln statt der Sitzungseinstellung, keine Kinetik,
kein Ausdruck mit Asymmetrie, keine Wimpern aus der Bibliothek.

Jetzt gibt es den Bauweg **einmal** — `_buildEyeRig(ch, pet)` —, und der Aufrufer bringt nur mit,
**worauf** das Rig sitzt. Georgs getunte Werte (dx 1,22 · dy 0,02 · ring 0,62 · track 0,24) kommen
dabei aus dem Vertrag des Moduls, nicht aus einer Kopie in der Pet-Liste: ein Eigentümer je Zahl.

Abnahme über den echten Bedienweg, hin und zurück: Rolli → Bunny → Rolli. Rolli hält Augen auf dem
Stiel und das rote Set (size 0,72 · dy 0,52), Bunny hält Cube-Augen und sein eigenes `male`-Set
(size 0,44 · dy −0,69), das Cube-Pet tritt ab und wieder auf, keine Boot-Fehler.

---

## Was wo liegt

| Was | Wo |
|---|---|
| Das Studio | `petstudio-v9/KFB Pet Studio v10.dc.html` (Fork von v9, v9 unangetastet) |
| Rolli als Modul | `petstudio-v9/studio-v10/KloRolli.js` — `SPEC`, `Cloth`, `PaperSheet`, fünf Teile |
| Herkunft der Bauteile | `petstudio-v9/studio-v10/klo-rolli-buehne-v2.REFERENZ.js` (nur Nachlesen) |
| Georgs Übergabe | `docs/petstudio-v10/HANDOVER-KloRolli-PetStudio-v10.md` |
| Das Modell | `media/3D_Assets/Toilet Paper Roll.glb`, Zweitquelle `kayfabizarro.pages.dev` |

## Die drei Nähte, an denen v10 sich von v9 unterscheidet

1. **`_buildRoster()`** hängt einen Eintrag `klo-rolli` mit **einem** neuen Feld an: `kind: 'hanging'`.
   Mehr braucht die Unterscheidung nicht — daran erkennt der Ladeweg, dass hier gebaut und nicht
   geladen wird.
2. **`loadPet()`** verzweigt in der ersten Zeile des `try`: ein Hängender geht nach `_loadHanging()`,
   ein Cube-Pet läuft weiter wie in v9. Beim Zurückwechseln tritt der Hängende ab
   (`_disposeHanging()`), das Cube-Pet wird wieder sichtbar.
3. **`animate()`** tickt zusätzlich `this.rolli.update(dt)` — seine eigene Uhr für Pendel, Blatt und
   Riss. Augenrig und Mund tickt weiter die Bühne, wie bei jedem Pet.

Dazu **zwei geteilte Stellen**, additiv geändert: `_buildEyeRig(ch, pet)` ist aus dem Cube-Pet-Zweig
herausgezogen und gilt jetzt für beide, und `_mountMouth(ch)` nimmt die Fläche als Parameter (ohne
Parameter unverändert das Cube-Pet). Ein Mund gehört zu **einer** Fläche — beim Wechsel wird er
darum verworfen und neu gesetzt, sonst tastet er weiter eine Fläche ab, die nicht mehr im Bild ist.

## Was das Modul dazubekommen hat

`KloRolli.js` baute in `mount()` vorher **nur das Papier**; Rolle, Nagel, Augen und Mund standen in
`SPEC`, gebaut wurden sie nur in der Bühne. Wer das Modul einhängte, bekam ein Blatt in der Luft.
Jetzt baut `mount()` alle fünf Teile in der Reihenfolge aus Georgs Übergabe, verbatim übernommen mit
Zeilenangaben (Bühne Z. 525 · 612 · 632 · 658). Dazu:

* `mount()` kehrt **sofort** zurück, das Laden läuft in `this.ready` — auf ein Ereignis warten, nie
  auf eine Uhr (Falle dieser Laufzeit).
* `setViseme(name)` lädt eine der zwölf Formen bei Bedarf nach, `setMouthShape` rechnet die Schale
  neu, `setEyes` schreibt über die öffentliche Schnittstelle des Rigs, `look(nx, ny)` gibt den Blick
  an den Zeiger.
* `report()` gibt zurück, was **geladen** und was **gemessen** wurde — inklusive `glbErrors`, damit
  ein Ersatz im Bild nicht stumm bleibt.
* `_hostTicksRig`: die Bühne tickt das Augenrig, das Modul lässt es dann liegen — sonst zwei Ticks
  pro Bild.
* Der Nagel hängt an `parent`, nicht am Pendel: er darf nicht mitschwingen.

## ⚠ Was für einen Hängenden bewusst NICHT läuft

`_applyStage`, `_measureNow` und `_padMeasure` setzen ein Cube-Pet mit Sohle voraus — Grundform-Kante,
Silhouette, Fußschatten. Ein Hängender hat davon nichts (Vertrag: `contact: 'none'`). Sie bleiben aus,
und das steht im Code, damit niemand sie für vergessen hält.

## Nächste Scheiben

1. **Zug und Riss als Geste** — `pull`/`tear` sind da (die **Rate** entscheidet, nicht der Weg), es
   fehlt die Bedienung im Studio. Dazu Georgs Regie: was mit dem abgerissenen Blatt passiert, gehört
   dem Wirt (`onReleased`), nicht dem Modul.
2. **Die Sprechblase kontextuell** — Georg, 29.08.: sie soll wie die anderen Reiter **nur im
   passenden Zusammenhang** erscheinen, nicht dauernd im Bild stehen (im Bild verdeckt »Bingo!«
   gerade das linke Auge). Steht bisher **in keinem** v10-Papier, darum hier notiert. Georgs
   KloRolli-Übergabe §5 sagt dazu: die Blase gehört ins Pet-Rig, nicht in Rolli — sie ist für jedes
   Pet dieselbe.
3. **`report()` zurück in den Pad-Block** — die gemessenen Zahlen liegen bereit (Rollenbreite,
   Halterhöhe, Nagel-Pivot, Blattmaße, Modell-Blatt), der Pad-Reiter muss sie schreiben. Georgs
   Bedingung aus der Übergabe.
4. **Das Bad als Material** — Zahnbürste mit Augenrig, Badewanne mit Mund. Erst dort zahlt sich das
   `facing`-Feld aus Vertrag 2.2 aus: ein langer dünner Körper und eine hohle Schale stellen die
   Frage »wo ist vorn« wirklich.
5. **Look-Entscheidungen, die Georg gehören:** das Blatt hängt bei halbem Zug bis unter die
   Bodenhöhe (−0,42) — so lassen oder kürzer? Und die Augen sitzen laut Vertrag **über** der Rolle
   (Wackelaugen auf Stielen); im Bild berühren sie den Halter.
