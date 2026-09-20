# KFB Travel v16 — Session-Export 2026-08-12

Dieser Ordner ist **vollständig lauffähig und vollständig lesbar**: er enthält den Betrieb, die
Werkzeuge und die Dokumentation, die ein frischer Chat oder ein Coworker braucht, ohne Rückfragen.

## Sofort loslegen

**Spielen / testen:** `index.html` über einen statischen Server öffnen — nicht per Doppelklick.
ES-Module brauchen `http(s)://`, `file://` blockiert sie.

```
python3 -m http.server 8080      # dann http://localhost:8080/
```

Auf GitHub Pages: den Ordnerinhalt ins Repo, Pages auf den Zweig zeigen lassen, fertig. **Es gibt
kein Standalone-HTML** — der Bundler des Design-Werkzeugs ist blockiert (Naht 101, sieben Umgehungen
gemessen), und für Pages braucht es ihn nicht. Für Performance-Messung ist die getrennte Fassung
sogar die richtige: sie zeigt Ladezeiten und Cache-Treffer je Modul.

**Lesen — in dieser Reihenfolge:**

1. `docs/HANDOVER_WS_2026-08-12.md` **§A** — das Onboarding. Clean-Run in acht Handgriffen, die
   sechs Workspace-Regeln, und wo man **nicht** anfängt.
2. `HOUSEKEEPING.md` **§4x** — was AKTIV, FROZEN, GETEILT ist. Die Statusspalte ist die Wahrheit.
3. `docs/SPRINT_travel-v16.md` — Fahrplan L1–L4 und was bewusst **nicht** gemacht wurde.
4. `docs/CHANGELOG_v16.md` — jede Änderung mit Messwert, dazu die Nähte 102–122.

## Was drin ist

| | |
|---|---|
| `index.html` | die Betriebsfassung (Vollbild, Ladeschirm mit echter Startzeit, **0 Boot-Fehler**) |
| `terrain-v16/` | 57 Module + `edge3.jpg` + 4 JSON — der ganze Code |
| `themes/kfb-shell.css` | die Bühne, **einmal** — `index.html` und das DC binden sie ein (Naht 122) |
| `themes/kfb-med.css` | Wortmarke und Panel-Typografie |
| `asset-repo.json` | Index für die Kenney-Props (986 Assets mit RAW-URL) |
| `KFB Travel v16.dc.html` | dieselbe Welt im Design-Werkzeug |
| `KFB Travel Testliste.dc.html` | 27 Testpunkte mit Erwartungswerten, JSON rein/raus |
| `docs/` | Sprint · Changelog · Handover/Onboarding · Asset-Auftrag für ChatGPT |
| `scraps/` | Abnahme-Belege (Stufung, Farbwelten, Ringwellen, Props) |

## Was NICHT drin ist, und warum

- **GLB-Modelle und Texturen.** Sie kommen zur Laufzeit über `raw.githubusercontent.com`
  (Workspace-Regel: nichts Schweres ins Repo). **Offline fehlen die Props** — dann streuen die
  grauen Blöcke weiter, die Landschaft ist ärmer, nicht leer. Das ist Absicht, nicht Versäumnis.
- **`terrain-v13/14/15`.** FROZEN, Vergleichsmaßstab, gehören ins Projekt statt in einen Export.
- **Ein Standalone-HTML.** Siehe oben.

## Testen — die eine Regel

**Ein Ergebnis ohne den Parametersatz, der es erzeugt hat, ist eine Anekdote.** Das ist keine
Ordnungsliebe: in v16 hat ein späterer Slice den Weltseed gewürfelt und damit die Abnahme eines
früheren still ungültig gemacht (Naht 115).

Der Weg: im Spiel **Tab** → *Varianten & Test* → *Parametersatz sichern*, dann
`KFB Travel Testliste.dc.html` → *Aus dem Spiel holen*. Beide müssen von **derselben Adresse**
laufen, sonst teilen sie den Speicher nicht — dann von Hand einkleben.

*Regler würfeln* schüttelt die Grenzen durch und **lässt den Seed stehen**: man ändert Regler ODER
Welt, nie beides, sonst weiß niemand, welches gewirkt hat.

## Stand

**Gebaut:** L1 Stufung (Stufengröße als Ort-Merkmal) · L2 Farbwelten als Ort + Atem · L2d Ringwellen
· L3 Kenney-Props mit Bodenbewegung, Bodenfarbe und Squash am Würfel-Bob · S60d Würfel auf 120° ·
T1 Parametersatz und Testliste.

**Offen:** F2 Boost-Grammatik · F3 Kamera am Tempo · F4 den Drift sehen · L3e Aufbau in Scheiben
(20–24 ms je Chunk-Wechsel) · Variante B (Wellen färben ein) und daran hängend das Wetter ·
v17 Kartengitter. Vollständig in `docs/HANDOVER_WS_2026-08-12.md` §E.

**~20 Regler warten auf ein Urteil** — die Liste steht in der Testliste rechts unten.
