# kfb-seeds-v1 — Karte wird Welt

Aus einer Karte wird eine Zone: Story-Modus, Palette, Füllung, Abnutzung, Grabenbreite,
Bodenstufen, Absenkung, Deckstärke. Deterministisch — gleiche Karte, gleiche Welt, immer.

Dieses Modul **erfindet nichts**. Der semantische Vektor (8 Dimensionen) und die Palette
kommen aus `world-context.js` (kfb-voxel-world-v1). Hier steht nur die Übersetzung.

## Die zentrale Einsicht: Basislinie statt Rohwert

Ohne Bezugsgröße gewinnt immer dieselbe Dimension. `power` ist in jedem Kartentext hoch, weil
die Lexika sich Alltagsverben teilen — jede Zone wäre `heroic`. Entscheidend ist nicht, welche
Dimension **groß** ist, sondern welche für **diese** Karte **auffällig** ist. Also: Abstand zum
Pool-Mittel, auf 0…1 gespreizt. 0,5 = durchschnittlich.

`measure().devSpread` weist aus, ob die Basislinie überhaupt Streuung erzeugt. Liegt der Wert
nahe 0, sind alle Zonen gleich und die Übersetzung ist wirkungslos.

## Zwei Durchgänge, nicht einer

Der Vektor hängt nicht am Story-Modus, die **Palette** aber schon. Also: erst Vektor holen,
daraus den Modus ableiten, dann die Welt endgültig bauen. Ein Durchgang liefert die Farben des
**vorherigen** Modus.

Aus demselben Grund kommt der Signatur-Seed aus der Kartenidentität (`packId` + Nummer), nicht
aus `wc.seed`: `wc.seed` hängt via `joinSeeds` am Modus, und der steht während der Ableitung
noch auf dem Wert der vorherigen Karte. Sonst wäre die Texturwahl von der Vorgeschichte abhängig.

## Die Übersetzungstabelle

| Zonenparameter | Steuernde Dimensionen |
|---|---|
| Abnutzung | +threat +melancholy +chaos −wonder −humor |
| Füllung | stärkste von threat→Säure, melancholy→Öl, wonder→Wasser, humor→Bubblegum, chaos→Schlacke |
| Textur | Bestand nach Abnutzung (CLEAN/DIRTY), Auswahl aus dem Identitäts-Seed |
| Grabenbreite | chaos |
| Bodenstufen | chaos |
| Absenkung | threat |
| Deckstärke | lore |
| Story-Modus | stärkste von melancholy/humor/chaos/power/wonder/threat |

`heightScale` und `motionAmplitude` stehen bewusst **nicht** in der Signatur: sie hängen am
Modus und kommen aus `wc.params`, nachdem der Modus feststeht.

## Einbau

```js
import { createCardSeeder } from './kfb-seeds-v1/kfb-card-seed.js';
import * as WC from './kfb-voxel-world-v1/world-context.js';

const seeder = createCardSeeder({ WC, toCard: (c) => ({
  cardNumber: c.n, cardName: c.title || c.t, power: c.power || c.p,
  lore: c.lore || c.l, gradeReason: c.deck || '', role: c.role,
}) });
seeder.buildBaseline(pool);            // einmal pro Deck
const { wc, mode, signature, top } = seeder.resolve(cardIndex, ['card-zone-lab']);
```

**Feldnamen sind kritisch.** `cardSemanticVector` erwartet `cardNumber / cardName / power /
lore` + Rolle. Kommt die Kompaktform (`t/p/l/g`) an, ist der Vektor leer — Biome, Palette und
Seed ändern sich dann pro Karte nie. Genau das war im Lab wochenlang der Fall.

## Status

`TESTED RESULT` — läuft auf `KFB ToolBox Bench.dc.html` gegen einen synthetischen
Acht-Karten-Pool, gemessene Streuung 0,367.
