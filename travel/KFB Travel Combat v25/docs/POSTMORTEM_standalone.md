# Post-mortem · Der Standalone-Export, dreimal abgebrochen

Datum: 2026-09-09. Betrifft: drei abgebrochene Antworten beim Versuch, aus v25 eine einzelne
lauffähige HTML-Datei zu machen. Kein Code ging verloren, aber ein halber Arbeitstag.

---

## 1 · Was passiert ist

Dreimal derselbe Ablauf: Auftrag angenommen, Manifest bestätigt, Bau begonnen — und mitten in der
Ausgabe Abbruch, ohne verwertbares Ergebnis. Beim dritten Mal berechtigt die Frage: „was läuft hier
falsch?"

## 2 · Die Ursache

**Der Standalone wurde in die Antwort geschrieben statt in eine Datei.**

Ein Standalone von v25 bedeutet: 69 Dateien aus `terrain-v25/` plus der Wirt in **eine** Datei. Die
Größenordnung:

| Posten | Umfang |
|---|---|
| `settings-schema.js` | 86 kB |
| `academy-cards.js` | 46 kB |
| `arrival.js` · `prop-scatter.js` · `hud-cube.js` · `card-carrier.js` | je 26–33 kB |
| Rest (~60 Module) | zusammen mehrere hundert kB |
| **Summe** | **deutlich über 600 kB Quelltext** |

Jede Antwort hat ein Ausgabelimit. Es liegt um mehr als eine Größenordnung unter dem, was hier
nötig wäre. Der Abbruch war deshalb kein Zufall, keine Störung und kein Fehler auf deiner Seite —
er war die zwangsläufige Folge des gewählten Wegs. Der zweite und dritte Versuch waren dieselbe
Wette auf dieselbe Wand.

**Der Fehler hinter dem Fehler:** nach dem ersten Abbruch hätte die Methode wechseln müssen, nicht
der Anlauf. Stattdessen wurde zweimal dasselbe versucht, weil der Abbruch wie ein Zufall aussah.
Ein zweiter identischer Versuch nach einem Abbruch ist kein Wiederholungsversuch, sondern ein
Versäumnis in der Diagnose.

## 3 · Der Weg, der funktioniert

**Dateien werden geschrieben, nicht ausgegeben.** Ein Skript liest die 69 Module aus dem Projekt,
setzt sie zusammen und speichert das Ergebnis. Durch den Chat läuft dabei nur die Anweisung — ein
paar Zeilen — und am Ende eine Zeile Bestätigung. Der Quelltext selbst passiert die Antwort nie.

Genau so ist heute alles andere entstanden: Codebasis kopiert, drei Dokumente geschrieben,
`edge3.jpg` in drei Modulen umgehängt — vier Aufrufe, kein Abbruch.

## 4 · Was der Standalone technisch braucht

Vor dem nächsten Anlauf müssen drei Dinge geklärt sein. Sie sind der eigentliche Grund, warum
dieser Export mehr ist als „Dateien aneinanderhängen":

**(a) ES-Module lassen sich nicht einfach hintereinanderlegen.** Die Module laden sich gegenseitig
per `import './pet-kinetics.js'`. In einer einzelnen Datei gibt es diese Pfade nicht mehr. Es
braucht entweder Blob-URLs mit einer Importkarte oder eine Umschreibung jedes `import`-Aufrufs.
Falsch gemacht heißt: die Datei öffnet, und die Konsole ist voll.

**(b) `import.meta.url` verliert seinen Sinn.** Mehrere Module bestimmen darüber ihren Nachbarpfad
— unter anderem die drei Textur-Module. Im Standalone zeigt das auf die Bündeldatei selbst. Genau
daran hing der `edge3.jpg`-Fund von heute: `voxel-glyphs.js` hatte **nur** den lokalen Pfad und
wäre im Standalone stumm texturlos geblieben. Das ist repariert — aber es ist die Sorte Fehler, die
ein Bündel erzeugt, und die zweite dieser Sorte findet man nur, indem man das Bündel wirklich öffnet.

**(c) Schweres bleibt draußen.** GLBs, Skydome, `kfb-asset-library.json` (4,3 MB) laufen per
RAW-URL. Das ist bereits so und muss so bleiben; sonst wird aus einer Datei ein Archiv.

## 5 · Bauplan für den nächsten Anlauf

1. Einen schlanken Wirt `index.html` neben `terrain-v25/` legen (kein DC — der Wirt trägt
   Bündel-Logik, die im DC nichts zu suchen hat).
2. Bündeln mit dem dafür gebauten Werkzeug statt von Hand: es löst (a) und (b) und schreibt das
   Ergebnis als Datei.
3. **Das Ergebnis öffnen und die Konsole lesen.** Ein ungeöffnetes Bündel ist eine Behauptung.
   Prüfliste: Clean-Run aus `SPRINT_v25.md` §4 · Voxel-Glyphen tragen Textur · Terrain tragt Textur
   · HUD-Würfel trägt Textur · `petKin.bobReport()` antwortet.
4. Erst dann hochladen.

Aufwand realistisch: **ein Anlauf mit offener Konsole**, nicht drei Anläufe ins Blaue. Der Grund,
warum dieser Anlauf heute nicht mehr stattfindet, ist Punkt 3 — er braucht dein Fenster, so wie
`fpsprobe` und `poolprobe` auch.

## 6 · Was daraus als Regel bleibt

1. **Nichts Großes durch den Chat schicken.** Alles ab etwa einer Bildschirmseite Code wird per
   Skript in eine Datei geschrieben.
2. **Nach einem Abbruch die Methode wechseln, nicht den Anlauf.** Zweimal dasselbe versuchen ist
   keine Hartnäckigkeit.
3. **Ein Bündel gilt erst als gebaut, wenn es geöffnet wurde.** Bei Bündeln versagen Dinge
   lautlos — texturlose Glyphen stehen in keinem Log.
4. **Sagen, wenn ein Weg nicht trägt**, statt ihn zu beginnen und mittendrin zu enden.
