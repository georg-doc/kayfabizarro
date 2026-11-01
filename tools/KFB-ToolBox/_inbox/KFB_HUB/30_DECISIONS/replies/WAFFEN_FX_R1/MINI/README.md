# Hänger der ersten Explosion · Mac mini · game/waffen-fx-r1 @ca62e6ba, fx=r2 · 01.11.
Aufruf: `npx vite build --outDir dist-ton` mit den Ton-Wurzeln aus `scripts/audio/remote.json`, dann fünfmal `PW_GPU=1 FX_BOOM=2 node test/waffen-fx.mini.mjs miniN`, je frischer Browserstart, Bomben bei rund 1,2 und 9,2 s.
`waffen-fx.mini.mjs` ist `test/waffen-fx.mjs` mit `FF = /usr/bin/true`, weil das feste ffmpeg hier fehlt. Sonst unverändert, der Mitschnitt läuft weiter mit.

| Lauf | Bilder | Median ms | p99 ms | längste Lücke ms | über 150 ms | über 45 ms in 2,5 s nach Bombe 2 |
|---|---|---|---|---|---|---|
| 1 | 1025 | 17 | 21 | 162 | 1× bei rund 1,3 s, also an Bombe 1 | keine |
| 2 | 1035 | 17 | 19 | 24 | keine | keine |
| 3 | 1034 | 17 | 19 | 38 | keine | keine |
| 4 | 1033 | 17 | 20 | 35 | keine | keine |
| 5 | 1035 | 17 | 19 | 120 | keine | keine |

Grenzen: Der Test hält nur Lücken über 150 ms mit Zeit fest und die 2,5 s nach der letzten Bombe. Die längste Lücke in Lauf 5 lässt sich deshalb nicht sicher Bombe 1 zuordnen, sie ist eine Obergrenze. Die Zeit von Lauf 1 ist aus dem Laufende zurückgerechnet. Lauf 1 war der erste nach dem Build.
