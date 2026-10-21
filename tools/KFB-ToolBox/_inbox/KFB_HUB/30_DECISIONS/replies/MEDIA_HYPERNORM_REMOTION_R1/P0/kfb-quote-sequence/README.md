# kfb-quote-sequence · R1 (V-606)

Hypernormalisation-Lesefolge als zustandsloses Modul: ein Modul, zwei Ausgaben (Spiel und Remotion). Owner Modul: WS-Media. Einbau ins Spiel: WS1. Remotion-Ausgabe: WS-Media.

## Herkunft
Grammatik, Phasen, Schrift und Malen 1:1 aus Clay Stage R2 (`code/KFB_Billboard_Family_v1/sequence.js` @7d6a8496e, Georg 09.10.: „passt so mit TUNE für später“). Gesichtspalette aus `stage.js`/`palette-roles.js` R2, Seeds aus `world-context.js` @5b523eb. Die R2-Quellen liegen gepinnt unter `test/fixtures/`.

Bewusste Abweichungen von R2:
- Kein Laden über raw: Pool kommt als Daten herein.
- Nur freigegebene Zitate laufen: `quote.status` ∈ {APPROVED_PRIVATE, APPROVED_PUBLIC} und `rights.status = PUBLIC_DOMAIN_CONFIRMED`.
- `quoteId` gilt über alle freigegebenen Zitate (Pilot pinnt Wilde, das einem anderen Deck zugeordnet ist).
- Spielliste: mehrere Zitate hintereinander, Zeit läuft im Kreis (`playlist`, `sample`, `loopMs`).
- Kontext je Zitat (`recipe.ctx`): Kontextzeile nach R2-Formel aus dem eigenen Deck des Zitats, Karte als Basis nur, wenn das Zitat zum Deck der Tafel gehört.
- `PHASES` listet die vollständige Phasenfolge (mit resolve und turn); R2 exportierte nur die Pin-Phasen.

## Schnittstelle
```js
import { paint, sample, loopMs, facePal, withApprovals, FONT_LOADS } from './kfb-quote-sequence.js'
const recipe = { quotes: withApprovals(pool.quotes, approvals), pal: facePal(stops), ctxLine, lod: 'near' | 'mid', base /* Bildquelle, z. B. Karte */ }
paint(ctx2d, W, H, nowMs, recipe)   // Provider-Vertrag CLAY-01 §2; Uhr vom Host
```
Fonts vor dem ersten Malen laden (`FONT_LOADS`): Bodoni Moda, Big Shoulders Display, Archivo, IBM Plex Mono (OFL).

## Für den Einbau (WS1)
- Inhaltsart `quote` in `surfaceContent.js`, hinter privatem Schalter (V-606), Canvas2D 1,79:1 (V-259).
- Nah: live, gedrosselt (z. B. 15 Bilder/s, Uhr vom einen Scheduler). Fern: eingefrorenes Bild (letzter Stand der Textur), beim Näherkommen wieder live. Kein Video-Loop.
- `lod: 'mid'` ist die Fern-Grammatik aus R2 (große Einzelphrase).
- Palette: Vorschlag `facePal(stopsFromEnvRoles(ENV_ROLES[id]))` mit `id` aus `stagePaletteFor(card)`, Stops `[earth[2], accent[2], accent[0]]`; Entscheidung WS1.
- `base`: im Pilot die Karte der Tafel (H13 ist auf der Spiel-Tafel nicht verbunden).

## Pilot P0
`p0.pilot.json` + `data/pool.p0.verbatim.json`: drei Zitate (Thoreau, Morris, Wilde), Georgs Freigabe als Überlagerung (`APPROVED_PRIVATE`), Tafel im Knet-Amphitheater mit Karte „The Glossy Horizon“, Palette `otown`.

## Tests
```
node --test modules/kfb-quote-sequence/test/contract.test.mjs
```
11 Vertragstests: Malen Aufruf für Aufruf gleich R2 (nah/fern, 1024×512, 1,79:1), Phrasen und Zeitleiste gleich R2, Palette gleich R2, Auswahl deterministisch und gleich R2, nur Freigegebenes läuft, keine Uhr/kein Zufall/kein Netz, nur die vier Schriften, G7 ≤ 3 Helligkeitssprünge pro Sekunde (mit Karte als Basis), Loop schließt nahtlos, Lesbarkeit der Palette für alle Inseln, pinTime/contextCard gleich R2.

Übergabe an WS1: `UEBERGABE_P0.md`. Credits: `data/credits.p0.json`.
