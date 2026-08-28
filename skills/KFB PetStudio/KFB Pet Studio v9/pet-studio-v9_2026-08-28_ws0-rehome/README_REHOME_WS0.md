# Re-Home WS0 — KFB Pet Studio v9

**Paket:** `pet-studio-v9_2026-08-28_ws0-rehome` · **Stand:** 28.08.2026 (WS1)
**Zweck:** Das Studio v9 an einem zweiten Arbeitsplatz aufsetzen — vollständiger Ladeweg,
alle Dokumente, zwei Standalones zum Ansehen.

---

## In dieser Reihenfolge lesen

1. **`docs/POST_MORTEM_re-home_pflichtlektuere.md`** — fünf Regeln, alle in einer Nacht bezahlt.
   Regel 1 hat dieses Paket gebaut: *ein Import-Check prüft Gleichheit, nie Anwesenheit.*
2. **`ONBOARDING_ext-LLM.md`** — wenn du das Projekt nicht kennst.
3. **`HANDOVER_WS0_v9.md`** — was v9 kann, was gilt, was offen ist.
4. **`SPRINT_v10.md`** — die nächste Runde in Reihenfolge.
5. **`KFB Pet Studio v9 SESSION_LIVING - standalone.html`** — ein Doppelklick, kein Server:
   das Living Document, was gilt und warum.
6. **`docs/CHANGELOG_studio.md`** — Eintrag **V9-S1** oben, mit allen Messzahlen.

---

## Nur ansehen · benutzen

| Ich will … | Datei |
|---|---|
| es kurz ansehen, ohne Server | `KFB Pet Studio v9 - standalone.html` (5,1 MB, ein Doppelklick) |
| das Living Document lesen | `KFB Pet Studio v9 SESSION_LIVING - standalone.html` (303 KB) |
| **daran bauen** | `KFB Pet Studio v9.dc.html` über einen **lokalen Server** öffnen |

Warum ein Server: die Module sind ES-Module, `file://` scheitert an CORS. Z. B.
`python3 -m http.server 8000` im Paketordner, dann
`http://localhost:8000/KFB%20Pet%20Studio%20v9.dc.html`.

⚠ **Im Studio-Standalone ist der Bubbles-Tab aus.** Die Blasenmodule werden zur Laufzeit über einen
gerechneten Pfad geladen (`await import(_abs('./…'))`) — was ein Bündler nicht sieht, kann er nicht
einpacken. Gemessen, mit der Zeile aus der Konsole:
`[studio-v8] Shaper aus: Failed to fetch dynamically imported module … bubble-shaper.v3.js`.
*Das Standalone ist zum ANSEHEN, der Ordner ist zum BENUTZEN.* Sauber lösen heißt: die Importe
statisch schreiben — eigene Scheibe, steht im Sprintplan.

---

## Was in diesem Paket geprüft ist

Vor dem Packen byteweise gegen den Arbeitsplatz verglichen und der Ladeweg aufgelöst:

- **34 von 34** Code- und Dokumentdateien **byteidentisch** mit WS1.
- **48 relative Referenzen** in 20 Code-Dateien aufgelöst, **0 fehlend**.
- Zwei gewollte Abweichungen: das SESSION_LIVING trägt ein Vorschaubild-Template für den Bündler,
  `docs/HOUSEKEEPING_root.md` ist die Wurzel-Fassung (im Projekt liegt daneben eine zweite unter
  `docs/`, deshalb der Namenszusatz).

**Ein echter Fund dabei:** `podcast-v2/bubbles.v5.js` (10.620 Zeichen) fehlte im Sitzungsschnitt vom
27.08. — es ist ein **statischer** Import in `studio-v7/bubble-shaper.v3.js` (`INK`, `inkWidthFor`).
Ohne die Datei bricht der Shaper. Sie ist jetzt drin. Genau diese Fehlerklasse hat im August eine
ganze Nacht gekostet.

**Die Schriften sind diesmal dabei** — 17 Schnitte, 5,08 MB, relativ eingebunden über
`./fonts/`. Das war die älteste Altschuld des Projekts: ohne sie zeigt jede Fassung
Ersatzschriften. Der Weg zur Auflösung bleibt derselbe (ins Repo hoch, `@font-face` auf RAW-URL);
für den Umzug reicht der Ordner.

---

## Umfang

| Gruppe | Größe |
|---|---|
| Anwendung + Standalones (Wurzel) | 5.941 KB |
| `fonts/` (17 Schnitte) | 5.206 KB |
| `studio-v3/` `studio-v7/` `studio-v8/` `studio-v9/` | 339 KB |
| `podcast-v2/` | 38 KB |
| `docs/` (16 Dokumente) | 210 KB |
| **gesamt** | **11,46 MB · 64 Dateien** |

---

## Vier Dinge, die zur Laufzeit aus dem Netz kommen

3D-Modelle, Himmel und der Pet-Vertrag (`kfb-pets.json` **v1.2.8**) kommen über RAW-URLs aus dem
Repo. Ohne Netz startet das Studio, zeigt aber kein Pet.
`studio-v3/kfb-pets.json` im Paket ist der **Rückweg** (v1.2.7), **nicht die Quelle** — wer ihn für
die Wahrheit hält, dreht drei Pinguin-Werte zurück.

---

## Clean-Run (fünf Minuten)

1. Ordner entpacken, lokalen Server starten, `KFB Pet Studio v9.dc.html` öffnen.
2. Konsole: erwartet **drei** Zeilen, **kein** Fehler —
   `[studio-v8] Start: repo v1.2.8 → …` ·
   `[GC] bunny · Ebene 2.000 × Füllung 0.600 / Grundform 0.7475 → Maßstab 1.6054 · Fuß 0.2599` ·
   eine `[GUARD]`-Warnung, falls Sitzungs-Entwürfe vorliegen (gewollt: der Wächter meldet, was ein
   Entwurf gegenüber dem Repo überstimmt).
3. Pad-Tab → »Measure anchors« → **7 Anker**, `[PAD]`-Zeile in der Konsole.
4. Bubbles-Tab → »Tail« → »Open the tail bench«: die Blase **malt sofort**, Fußzeile mit echten
   Zahlen, »Zeichnungen 1 · Geometrie-Änderungen 1«.
5. Spitze ziehen: Ansätze bleiben stehen, nur `tip` ändert sich, ein Zug = **eine**
   Geometrie-Änderung. Danach Ruhe → **0** weitere Zeichnungen.
6. Art wechseln `speech → scream`: die Spanne ändert sich **14,4 → 9,81 px**. Bleibt sie gleich, ist
   der gespeicherte Zipfel nicht verworfen worden.
7. `thought` wählen: **kein** Zipfel, keine Anfasser, und die Fußzeile sagt das.

---

## Zwei Dinge nicht anfassen

- **`studio-v7/`, `studio-v8/` sind eingefroren.** In v9 fiel dort kein Byte.
- **`bubble-shaper.v3.js` hat einen bekannten Befund** (der Zipfel wird darin *gesucht* statt
  *gesetzt*). Der Ersatz liegt daneben als `studio-v9/bubble-tail.v1.js`. Nicht reparieren — sonst
  ist der Vergleichsmaßstab weg.
