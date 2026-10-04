# kfb-beam-v1 — Holo-Schleier

Die Verbindung zwischen einem Objekt am Boden und einer Fläche in der Luft. Vier Bahnen,
im Vertex-Shader ausgebeult, im Fragment-Shader als aufsteigende Schwaden aufgelöst.
Kein Kegel, keine Linien, keine Scanlines.

## Einbau

```js
import { createBeam } from './kfb-beam-v1/kfb-beam.js';
const beam = createBeam({ THREE, scene, gain: 0.85 });

// pro Frame
beam.update({
  ground: [c0, c1, c2, c3],   // vier Bodenecken, im Umlauf
  target: [k0, k1, k2, k3],   // vier Zielecken, aus der WELTMATRIX der Karte
  dt, time: t,
  gain: 0.85 * beam.distanceGain(cam.position.distanceTo(card.position)),
});
```

Die Zielecken müssen aus `applyMatrix4(card.matrixWorld)` kommen, nicht aus Position + Größe:
sonst läuft die Fläche einer gedrehten Karte nicht mit.

## Das eigentliche Problem war die Eckenzuordnung

Eine senkrechte Karte hat vier Ecken, die in XZ auf nur **zwei** Punkte fallen. Eine
Ecke-für-Ecke-Nachbarschaftssuche kann oben und unten dort nicht unterscheiden und kippt bei
etwa 90 Grad in eine Schleife — der Schleier verdreht sich sichtbar. Zwei Gegenmittel:

1. **Zyklus-erhaltende Zuordnung.** Geprüft werden nur die acht Permutationen, die den
   Eckenumlauf erhalten (4 Versätze × 2 Richtungen). Eine Verdrehung ist konstruktiv unmöglich.
2. **Hysterese + Nachlauf.** Rund um die Diagonale liegen zwei Zuordnungen fast gleichauf und
   die Kosten rauschen mit jedem Grad Drehung. Die gebrauchte Zuordnung bleibt, bis eine andere
   30 % besser ist; die Eckpunkte laufen ihren Zielen exponentiell nach (~0,2 s).

`measure().permutation` weist die aktive Zuordnung aus. Springt sie im Stand, ist die
Hysterese zu schwach.

## Sichtbarkeit

`distanceGain(dist, near = 26, span = 34)` — aus der Nähe darf der Schleier die Karte nicht
überdecken. Multiplikativ mit dem eigenen Aufdeck-Fortschritt verrechnen (im Lab: `p²`).

## Status

`TESTED RESULT` — läuft auf `KFB ToolBox Bench.dc.html`.
