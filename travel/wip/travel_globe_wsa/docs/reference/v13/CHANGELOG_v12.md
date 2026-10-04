# CHANGELOG · KFB Travel Globe v12 — FROZEN seit 2026-09-03 (abends)

Zweig aus v11 (2./3.9.2026). Gemessen gegen `globe-v11/`: **2 neue Module, 14 geänderte, 70 unverändert.**
Jede Zeile hier hat eine Stelle im Code, die sie belegt; wer sie sucht, nimmt **G** und das Suchwort `v12`.

## Neu

| Datei | Was | Quelle |
| --- | --- | --- |
| `ts-flora.js` | Vegetation **gebaut statt geladen**: AO in der Vertexfarbe, Fresnel-Saum, Wind je Höhe, Dichtefeld, Sichtweite je Raumkachel. EINE Uhr für den Wind aller Pflanzen | tinyskies-Art, eigener Bau |
| `muenzen.js` | Goldene Münzen als Durchflug-Sammelgut (+1 Pop). Timing 1:1 `Rings.ts`, Ausbruch `RingCollectVFX.ts`, Sammelradius großzügig auf Ansage | tinyskies, gelesen 3.9. |

## Geändert

- **`globe-landmarks.js`** — Kit-Pflanzen aus BEIDEN Sätzen raus (`pflanzen: false`, `?kits=1` stellt sie her). Grau-braune Bauten raus (Burg, Turm, Mühle, Markt) und die stehende Riesenmünze; ihre Plätze bleiben **leer**, statt umverteilt zu werden. Nur der Zauberturm bleibt, 13 Bauplätze offen.
- **`kit-massstab.js`** — die deklarierte **Fels-Ausnahme**: ×1,75 auf die Familie, Verhältnisse erhalten, Deckel 2,2 Bäume. Gemessen vorher: 308 Stücke, keines im Wasser, Median 0,60 Baumhöhen → jetzt 1,01, größter Brocken 1,42. `?fels=1` = kit-treu.
- **`sky-enemies.js`** — **Sperrzonen**: Gegner halten Abstand zum Gelände (`surfaceAltitudeAt`), nicht zu Props; sie flogen durch Kegel und Lavafahne. Vulkane sind jetzt Zonen (Fahne 0,45 + Puffer 0,18 = 0,63), waagerecht umflogen, nie überstiegen (Fehler vom 31.8.). Jagen-Regression repariert: `g.heading = laufKurs` nur noch im Patrouillieren. Prüfhaken `_pruefSetze/_pruefLese` (kein Spielweg).
  Messung: nächste Annäherung 0,524 u, Höhe über Grund 0,20–0,32 im Band, Jagd 199/200 Bilder mit intaktem Blick.
- **`intro-flight.js`** — 1:1 nach `Game.ts` 2933–3110: EINE Dauer, EINE Kurve, Großkreis-Slerp. Die alte Fassung hatte vier Kurven auf drei Uhren — das war der Ruck. `slerpUnitVectors` nie mit `out === b`.
- **`carpet.js`** — **Schweben (H)**, deklarierte Erweiterung: Tempo bis 0 in der aktuellen Höhe, Pfeil-hoch/-runter als Höhenversatz nur im Schweben. Tempo-Sockel ist ein ZIEL, kein Riegel; der Sockel kommt nach dem ersten Bremsen nicht zurück. Anzeige-Größe für das Tempo ist nicht `speedRatio`.
- **`flight-controls.js`** — H (verbraucht beim Lesen), Pfeil-runter belegt (descend).
- **`karten-teppich.js`** — Meeresspiegel gilt **je Eckpunkt**, nicht je Karte (Karten „unter dem Wasser").
- **`settings-panel.js`** — `hidden` steht am Element, nicht nur in der Variablen (Intro zeigte Settings).
- **`hud-frame.css`** — Tempo-Zahl überlagernd auf dem Zahnrad („auf/über, nicht darüber").
- **`collect-hud.js`** · **`komposition.js`** · **`globe-poc.js`** (Verdrahtung, Panel-Zeilen `Coin gate (v12)`, `Hover (H)`, Sperrzonen einmalig anmelden, `?fels` `?kits`).
- **`flora.js`** · **`flora-pruefstand.js`** · **`portal.js`** — nur Pfade `globe-v11/` → `globe-v12/`.

## Adresszeile

`?fels=1` Felsen kit-treu · `?kits=1` Kit-Pflanzen zurück · `?flora=0` Flora aus · `?regen=0.9` / `?regen=0` (v11).

## Was v12 nicht gelöst hat

Steht in `docs/TS-DELTA-v12.md §3`: Wahrzeichen-Silhouette (13 leere Plätze) · Farb-Environments · Gegner kennen Vulkane, aber nicht Türme/Portale/Landmarken · die atmende Welt (Entscheidung offen: bestimmt die Karte die Geografie oder färbt sie nur?).

## Lehren (aus §4 dort, hier nur die Kurzform)

Erst messen, dann drehen · ein falscher Kommentar ist teurer als ein Fehler · wer eine Klasse ablöst, sucht ALLE ihre Quellen · einen Eintrag aus einem gewichteten Satz nehmen verteilt seine Plätze um · Größe und Farbe sind Eigenschaften der Nachbarschaft · zwei Stellen, die dasselbe bestimmen, sind eine zu viel.
