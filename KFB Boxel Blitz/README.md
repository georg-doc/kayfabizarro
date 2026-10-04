# Session-Export · KFB Boxel Blitz v4 · 06.09.2026

Nur was in **dieser** Sitzung gebaut oder geändert wurde. Kein Gesamt-Projekt-Zip.

## Was drin ist

```
KFB Boxel Blitz v4.dc.html          Wirt (Deliverable)
boxelblitz-v4/dice.v4.js            Spielschicht — Wurfmodell, Verformung, Hitstop, Totzone
boxelblitz-v4/cube.v3.js            NEU · Fork von cube.v2: Materialmodell, Decke, Aufrichten
boxelblitz-v4/surfaces.v1.js        NEU · Eigentümer der sechs Restitutionen
cardbuilder/kfb-card-builder.js     GETEILT · additiv erweitert (Rückseite als Wartezustand)
github.md                           Repo-Anbindung (Vorbild, cannon-es, Skills)
docs/LIVING_boxelblitz_v4.md        SSOT der Baustelle, V4-S9 … V4-S36
docs/HOUSEKEEPING.md                Status je Artefakt, Clean-Run-Checkliste, Fix-Kandidaten
docs/00_SO_ARBEITEN_WIR.md          Arbeitsstandard (Referenz, unverändert)
captures/ (21 Bilder)               Abnahmebilder, eines je Scheibe
```

## Was NICHT drin ist, und warum

| Weggelassen | Grund |
|---|---|
| Standalone-HTML | gebaut (793 kB), aber **eine Skriptdatei lädt nicht** → 3D-Szene leer. Georgs Entscheidung: ohne. Fix-Kandidat in `HOUSEKEEPING.md` |
| 70 weitere Captures | `01-`/`02-`-Doppel aus mehrstufigen Aufnahmen |
| `cube.v1.js` · `cube.v2.js` | Rückwege, bleiben im Projekt |
| `boxelball-v1/` · `boxelblitz-v2/` | geteilter Ladeweg der eingefrorenen v1/v2 |
| Medien (GLB, Karten, Texturen) | laufen zur Laufzeit über ihre kanonischen Adressen |

## Der Stand in fünf Zeilen

1. **Der Würfel ist ein Würfel** und liegt flach — das Netz war in seiner Datei um 93° gekippt
   gespeichert (Hüllvolumen 17,5 → 8,1) und wurde zusätzlich auf die halbe Größe skaliert.
2. **Sechs Oberflächen statt einer Zahl** — Blatt 0,62 als Trampolin, Deck 0,30, Flanke 0,38,
   Bumper 0,92; jede trifft ihren Sollwert auf die dritte Stelle (Löser-Kennlinie invertiert).
3. **Das Wurfmodell ist Georgs Konzept:** Druckdauer → Sprunghöhe (gemessen 1,48 bei Soll 1,50 und
   2,69 bei 2,72), Zugweite → Tempo, Zug → Richtung. Die Höhe hängt **nicht** am Zug.
4. **Die Ladung zeigt sich am Würfel:** Stauchung linear 0 → 40 %, Kippung 0 → 14° gegen die
   Schussrichtung, Sohle in jedem Zustand auf 0,0000. Kein Overlay.
5. **Hitstop** 60 ms, scharf erst 25 ms nach dem Kontakt.

## Offen, in dieser Reihenfolge

1. **Kollision und Bumper** — Bumper-Boxel sollen reagieren und wachsen, echte Rampenphysik,
   Auflösung nach Impact-Stärke und Richtung. Georg: »er springt noch zu oft unmotiviert weiter.«
2. **Münder von Augen trennen** — drei Boxel mit Augen, drei mit großen Mündern, alle drei
   Mundvarianten je einmal; danach das Schlucken des Würfels.
3. **Farbpalette aus der Kartensaat** (`uploads/KFB_ColorPalettes_CardSeed_v1-2dea88c8.md`).
4. **Ring beim Aufprall** (Verstoß gegen `kfb-cartoon-animation_v2` §4.5 → Burst statt Ring) und
   **Nachschwingen** (Augen/Mund als Träger).
5. Standalone-Export reparieren · Zieldarstellung neu bauen (durchgehendes Band statt Strichkette,
   und die Vorhersage **gegen den geflogenen** Auftreffpunkt prüfen — die Prüfzahl fehlt noch).

## Erste Handlung im nächsten Chat

`docs/HOUSEKEEPING.md` lesen (v4-Abschnitt oben), dann die **Clean-Run-Checkliste** durchgehen.
Punkt 4 und 5 dort sind die Wächter über die zwei teuersten Funde dieser Sitzung:
`dev.klickProbe(0.45, 1, 0)` muss **Ladung 1,000** melden und `dev.ladeProbe(1,0,1,0)` **40 %**.
