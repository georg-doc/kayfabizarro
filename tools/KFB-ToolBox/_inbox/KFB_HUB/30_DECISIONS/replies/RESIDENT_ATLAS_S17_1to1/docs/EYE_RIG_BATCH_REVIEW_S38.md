# Eye-Rig-Batch Rig_Large · Prüfung gegen die Daten

Stand 2026-09-20. Gegenstand: `tools/KFB-ToolBox/_inbox/eye-rig-large.batch.json`
(`kfb.eye-profile-batch/0.2-candidate`, vier Profile: monstrosity, black-knight, demon-lord,
orc-brute). Werkzeug dieser Prüfung: `tools/eye-lid-color-probe.html`.

Die Meldung zum Batch lautete: individuelle Werte übernommen, Lidfarben-Bug zentral gefixt,
intern 95/95 Checks sauber. Zwei der drei Aussagen halten der Datei nicht stand.

## 1 · Die Lidfarbe ist bei allen vier dieselbe

```
monstrosity   eye.baseColor "#b58f83"   sourceFace.faceColor null   faceColorSource generic-fallback-unverified
black-knight  eye.baseColor "#b58f83"   sourceFace.faceColor null   faceColorSource generic-fallback-unverified
demon-lord    eye.baseColor "#b58f83"   sourceFace.faceColor null   faceColorSource generic-fallback-unverified
orc-brute     eye.baseColor "#b58f83"   sourceFace.faceColor null   faceColorSource generic-fallback-unverified
```

Derselbe rosa Hautton, um den es beim Fix ging — auf einem **gehelmten** Black Knight und auf
einem Demon Lord. `lidColorMode` steht überall auf `face-base-darkened`, aber die Basis, die
abgedunkelt wird, ist der gemeinsame Rückfallwert.

Damit gibt es genau zwei Möglichkeiten, und beide sind Befunde:
- Der Fix wirkt nur zur **Laufzeit** und der Export schreibt ein totes Feld → **der Export ist
  falsch**, und jeder Abnehmer, der die Datei liest statt das Werkzeug zu öffnen, bekommt Rosa.
- Der Fix hat **diese vier nicht erreicht** → die Meldung ist falsch.

Ein drittes „vielleicht stimmt es ja doch" gibt es nicht: `faceColorSource` sagt selbst, dass die
Farbe nicht verifiziert ist.

**Gegenmessung statt Gegenbehauptung:** `tools/eye-lid-color-probe.html` lädt die vier Köpfe am
Batch-Commit `986699c8`, sucht das Kopf-Mesh über den Namen aus dem Batch
(`Monstrosity_Head` …), tastet das vordere Gesichtsband über die UVs ab und meldet die
**Modalfarbe** — nicht den Mittelwert: eine KayKit-Palette ist flach, ein Mittelwert mischt zwei
Paletteneinträge zu einer Farbe, die im Blatt nicht vorkommt. Ausgegeben werden Material-Farbe,
gemessene Gesichtsfarbe, die um 0,82 abgedunkelte Lidfarbe und der RGB-Abstand zu `#b58f83`.

## 2 · „95/95 Checks sauber" neben `sourceEyeCleanupVisuallyAccepted: false`

Dieses Feld steht bei **allen vier** auf `false`. Der ausgeschnittene Augenbereich im Quell-Mesh
ist die Bedingung, an der die ganze Mit-/Ohne-Variante hängt — liegt das neue Auge nicht exakt
über dem alten, entstehen genau die Artefakte, wegen derer ausgeschnitten wird. Ein Prüfsatz, der
95 von 95 grün meldet und diese Frage nicht stellt, misst etwas anderes als das, worauf es
ankommt. Das ist in diesem Projekt der siebte Fall derselben Klasse („Testsatz mit einem Loch");
die Regel dazu steht seit S28 geschrieben.

## 3 · `pairConfidence: 0.7` ist eine Konstante, keine Messung

Dieselbe Zahl bei vier völlig unterschiedlichen Beweislagen:

| Figur | Inseln | Kandidaten | angenommenes Paar (x) | Spiegelabweichung | Lesart |
|---|---|---|---|---|---|
| black-knight | 6 | **1** | ±0,318 | 0,000 | nahe Gewissheit |
| orc-brute | 34 | 3 | ±0,167 | 0,000 | belastbar |
| demon-lord | 30 | **12** | ±0,082 | 0,000 | Griff aus acht gleichen 35-Dreieck-Inseln (z 0,658–0,693) |
| monstrosity | 33 | 6 | −0,064 / **+0,104** | **0,040 = 6,4 % der Kopfbreite** | verletzt den eigenen Modus |

Monstrosity ist der harte Fall: `removalMode` heißt `mirrored-front-pair`, und das angenommene
Paar ist nicht gespiegelt. Die Regel dafür ist in S37 schon formuliert — *ein Richtungsleser muss
seine Größenordnung nennen*. Für einen Detektor gilt dasselbe: 1 von 1 und 1 von 12 dürfen nicht
dieselbe Zahl tragen.

## 4 · Zwei Klassen-Saatgüter in einem Datensatz

`calibration.classSeed` → `./rig-medium-default.v0.json`, `inheritance.classSeed` →
`data/rig-large-default.v0.json`, im selben Rig_Large-Profil, viermal. Dazu `classDefault: null`
und ein `calibrationStart`, das sich selbst als „NOT an accepted Rig_Large default" bezeichnet.
Es gibt also vier freigegebene Figuren und keinen Klassenwert — obwohl genau diese vier die Belege
dafür wären.

Nebenbefund: nur `monstrosity` trägt eine `measuredSuggestion` (dx 0,3023 · dy 0,06389 ·
ring 0,0978). Der freigegebene `dy` ist −0,275, also **0,339 entfernt** von der Messung. Die
Politik `EXPLICIT_SUGGESTION_ONLY_NEVER_AUTO_APPLY` ist richtig, aber bei drei Figuren ohne
Messung und einer mit 0,339 Abstand kann niemand sagen, ob die Handwerte eine schlechte Messung
korrigieren oder eine andere Absicht ausdrücken.

## Reihenfolge für den nächsten Durchgang

1. Lidfarbe je Figur aus der Messung setzen und `faceColorSource` auf den tatsächlichen Weg
   umstellen (`material-color` oder `texel-face-band`). Solange dort
   `generic-fallback-unverified` steht, ist `baseColor` eine Behauptung mit Hex-Wert.
2. `pairConfidence` aus der Kandidatenlage **rechnen**: Kandidatenzahl, Spiegelabweichung in
   Prozent der Kopfbreite, Dreiecksgleichheit. Monstrosity fällt dann von selbst auf.
3. `sourceEyeCleanupVisuallyAccepted` in den Prüfsatz aufnehmen — ein Profil mit `false` darf
   nicht `ADJUSTED_APPROVED` sein.
4. Erst danach der Mit-/Ohne-Schalter. Er ist billig, sobald der Ausschnitt abgenommen ist, und
   wertlos, solange er es nicht ist.
5. Rig_Large-Klassenwert aus den vier freigegebenen Profilen ableiten, `classSeed` vereinheitlichen.
