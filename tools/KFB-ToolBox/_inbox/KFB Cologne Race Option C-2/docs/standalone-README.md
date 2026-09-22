# standalone · KFB Cologne Race Option C

**Der Build ist verzeichnisbasiert, nicht eine Datei.** Das ist eine Messung, keine Bequemlichkeit:

Ein Einzeldatei-Bundle wurde gebaut (133 KB) und im Browser geprüft. Es lädt nicht. Die Bühne
ist ein ES-Modulgraph mit einer `importmap` für `three` und relativen Importen nach
`./lab-v9/`; werden diese Module in den Dokumentenkörper eingebettet, verlieren sie ihren
Auflösungspunkt und beide Modulskripte scheitern still. Ein Bundle auszuliefern, das die
Startmaske zeigt und nie weiterkommt, wäre ein "existiert"-Beweis statt eines "läuft"-Beweises.

## Was stattdessen ausgeliefert wird

Genau die Dateien, die auch die Stage-Route bedienen wird:

```
KFB Cologne Race Option C.dc.html     ← direkt im Browser zu öffnen
support.js                            ← Laufzeit, liegt daneben
lab-v9/option-c-style.v1.js
lab-v9/cologne-route.v1.js
lab-v9/cologne-track.v1.js
lab-v9/cologne-world.v1.js
lab-v9/cologne-play.v1.js
lab-v9/cologne-props.v1.js
lab-v9/cologne-stage.v1.js
tools/osm-city-lab/data/dom-zentrum-v0/CLAUDE_CONTEXT.json   ← optional, sonst RAW-Pin
```

Über einen beliebigen statischen Server ausliefern und die `.dc.html` öffnen.
Datei-URLs (`file://`) funktionieren nicht — ES-Module und `fetch` brauchen eine Herkunft.

## Netzabhängigkeiten zur Laufzeit

- `three@0.160.0` von unpkg, `pdfjs-dist@4.7.76` von jsdelivr
- die gepinnten KFB-Spender über `raw.githubusercontent.com`, Pin
  `2ff8b350beefe02912bbff6eeeead3882e583d08`

Auf der Stage-Route kann der Pin gegen gleichherkünftige Pfade getauscht werden; die Konstante
steht an einer Stelle, in `lab-v9/cologne-world.v1.js`.
