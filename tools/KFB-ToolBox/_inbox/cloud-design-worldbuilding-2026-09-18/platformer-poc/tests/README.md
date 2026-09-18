# tests/

Kein Framework, kein Build — die Sonden fahren die echte Laufzeit im Browser.

## Benutzen

1. `index.html` öffnen und warten, bis die Insel steht.
2. Konsole:

```js
const t = await import('./tests/probe.js');
await t.probeAll();          // oder einzeln: probeChill(12), probeGame(), probeBouncer(), probeActors()
```

Die Ergebnisse werden zurückgegeben und als JSON geloggt.

## Was die Sonden prüfen

| Sonde | Frage |
|---|---|
| `probeChill(n)` | Landet ein assistierter Sprung dort, wo der Assist es angekündigt hat? |
| `probeGame(pairs)` | Trägt ein manueller Sprung mit Anlauf über die Lücke? |
| `probeBouncer()` | Erreicht der Bouncer die Combat Arena? |
| `probeActors()` | Mounten die vier Nachweis-Adapter, und was melden sie? |

## Warum Tasten statt `player.input`

Der Loop liest jedes Bild die gedrückten Tasten und überschreibt `player.input`. Wer das Feld
direkt setzt, misst sein eigenes Setzen und nicht das Spiel. Die Sonden schicken deshalb
echte `KeyboardEvent`s.

## Grenzen

Die Sonden setzen die Figur für manuelle Sprünge auf eine Startposition und laufen aus dem
Stand an — ein Mensch kettet Sprünge mit Restgeschwindigkeit. Ein FAIL in `probeGame` ist
deshalb erst dann ein Physikbefund, wenn genug Anlaufstrecke da war (siehe TEST_REPORT).
