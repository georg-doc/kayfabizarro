# kfb-cardstack-v1 — Deck, Aufdecken, Sky-Card

Dieselbe Karte in drei Zuständen: als Stapel auf dem Boden, beim Aufklappen, als driftende
Sky-Card in der Luft.

## Warum eine Funktion für den ganzen Weg

`reveal.pose(p)` leitet aus **einem** Parameter (0…1) die vollständige Pose ab: Klappwinkel,
Biegung, Skalierung, Position. Zwei getrennte Animationen (erst klappen, dann fliegen) haben
immer eine Naht, und jede Störung dazwischen — Fenstergröße, Terrain-Neubau, Regleränderung —
lässt die Karte springen. Eine ableitende Funktion ist zu jedem Zeitpunkt konsistent und
jederzeit neu auswertbar.

## Die drei Zutaten

1. **Scharnier statt Mittelachse.** Der Pivot sitzt auf der Blattunterkante. Das Blatt klappt
   um seine Kante auf, nicht um seine Mitte.
2. **Biegung.** `patchBend()` schiebt einen `uBend`-Uniform per `onBeforeCompile` in ein
   Standardmaterial; die Verschiebung geht mit `uv.y²`, also sitzt sie oben und das Scharnier
   bleibt ruhig. Papier hat Gewicht.
3. **Gestaffelte Einsätze.** `reveal.stageWindows()` gibt vier Fortschrittswerte zurück:
   Sockel → Loch → Projektor → Würfel. Auf einem gemeinsamen Fenster kommen alle gleichzeitig
   an, und das liest als ein Ruck statt als Bühne, die sich öffnet.

## Vorder- oder Rückseite, nie beide

`setCardSide()` entscheidet am Vorzeichen der **Welt**-Normalen. Der Wechsel passiert dann
genau, wenn das Blatt von der Kante zu sehen ist — sichtbar ist er nie. Zwei gleichzeitig
sichtbare Seiten lesen als zweite Karte.

## Einbau

```js
import { createCardStack, createReveal, patchBend, tickSkyCard, setCardSide }
  from './kfb-cardstack-v1/kfb-card-stack.js';

const bend = { uBend: { value: 0 } };
patchBend(sheetMaterial, bend);   // vor dem ersten Render
patchBend(backMaterial, bend);

const stack  = createCardStack({ THREE, scene, width, height, x, z, baseY, steps: 3, sub: 0.5 });
stack.build();

const reveal = createReveal({ pivot, height, skyY: 34, deckX, deckZ, deckY, centerZ: -1.5, bend });
reveal.open();

// im Loop
reveal.tick(dt);
const { rise } = reveal.pose(reveal.p, { deckY: zone.topAt(deckX, deckZ) });
stack.poseTop(rise);
const w = reveal.stageWindows();
cube.position.y = cubeBaseY - (1 - w.cube) * CUBE_D * 2.8;
if (reveal.p >= 1) tickSkyCard(THREE, pivot, cam, { t, dt, skyY: 34, height, centerZ: -1.5 });
setCardSide(THREE, cardGroup, cam, [sheet, decal], backMesh);
```

## Status

`IMPLEMENTATION` — im Lab v2 laufend erprobt, als eigenständiges Modul **NOT_TESTED**.
Die Bench mountet es nicht (sie hat keinen CardBuilder). Erster Integrationsschritt:
im Lab die Inline-Fassung gegen dieses Modul tauschen und die Aufdeck-Kurve gegenprüfen.
