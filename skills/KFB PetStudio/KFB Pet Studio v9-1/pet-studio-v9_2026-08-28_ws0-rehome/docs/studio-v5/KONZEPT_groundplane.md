# KONZEPT — Bodenplatte und veränderliche Schatten
### für Pet Pinball, flache 2D-Projektion und Cube-Pets · Entwurf 2026-08-25 (WS1)

Anlass: Georgs Mockup »Pet shadow Debate v01«. Darin stehen zwei Pets auf einer grünen Platte,
darunter liegen rosa Ellipsen, dahinter eine Karte — und drei Systeme reden über dieselbe Sache.
Genau das ist die Frage: **wer besitzt welche Aussage?**

---

## 1 Der Befund am Mockup

Im Bild treffen drei Dinge aufeinander, die alle »Boden« behaupten:

1. die **grüne Platte** (die Spielfläche, perspektivisch gekippt),
2. die **rosa Ellipsen** unter den Pets (AOE-Marker oder Schatten? — nicht entscheidbar),
3. der **Kontaktschatten** aus dem 3D-Licht (beim Hasen im Studio sichtbar, hier verdeckt).

Dazu kommt das Schlüssellicht, das die Gesichter lesbar macht. Vier Absender, zwei Aussagen —
darum wirkt es unruhig, nicht weil eine Zahl falsch ist.

## 2 Die Regel, aus der alles folgt

> **Das Licht macht das Gesicht. Der Boden macht die Lage.**

Zwei getrennte Aufgaben, und keine der beiden darf die andere miterzählen:

| Aussage | Wer sie macht | Wer sie NICHT macht |
|---|---|---|
| »So sieht das Gesicht aus« | Schlüssellicht + Fülllicht (Richtung, Farbe, Flackern) | der Bodenschatten |
| »Hier stehe ich, so hoch« | Kontaktschatten (Größe + Deckung) | das Licht |
| »Hier wirkt etwas« (AOE, Zone, Treffer) | Boden-Decal mit eigener Farbe | der Schatten |
| »So ist die Stimmung« | Hintergrund + Lichtfarbe | die Bodenplatte |

Der teure Fehler wäre, Höhe **zweimal** zu erzählen: wenn der Kontaktschatten kleiner wird *und*
das Licht anders fällt, springt die Figur beim Hüpfen zweimal — und im flachen 2D-Blick, wo es keine
Perspektive gibt, liest man es als Fehler.

## 3 Vier Schichten, vier Eigentümer

Von unten nach oben. Jede Schicht hat **einen** Schreiber:

```
┌─ 4 · PETS + KARTEN ──────────── Cube-Pets, Karten, Scheren, Würfel
├─ 3 · KONTAKTSCHATTEN ────────── ein Decal je Figur (Ellipse), Größe aus body.radius
├─ 2 · BODEN-FX ───────────────── AOE, Zonen, Treffer-Ringe, Glut  (eigene Farben, additiv)
└─ 1 · BODENPLATTE ───────────── Papier · unsichtbar · Karte · Farbfläche
```

**1 Bodenplatte.** Eine Ebene, vier Modi: `paper` (Papierton, nimmt Schatten an) · `invisible`
(nimmt nur Schatten an, sonst durchsichtig — für die flache 2D-Projektion und PNG-Export) ·
`card` (eine KFB-Karte liegt als Boden, wie im Overworld-Kartenfeld) · `flat` (Volltonfläche wie das
Grün im Mockup). Sie wird **nicht** vom Schlüssellicht beleuchtet — ihre Helligkeit kommt aus ihrer
eigenen Farbe. Damit kann sie mit dem Gesichtslicht gar nicht konkurrieren.

**2 Boden-FX.** Dieselbe Ebene, aber eigene Decals: AOE-Ringe, Zonenfelder, Einschlagringe, Glut.
Sie sind **Daten**, keine Lichter: Mitte, Radius, Farbe, Puls, Lebensdauer. Deshalb funktionieren sie
in 2D wie in 3D und lassen sich vom Spiel abfragen (»steht das Pet im Ring?« ist ein Abstand, keine
Beleuchtungsfrage). Georgs rosa Ellipsen gehören hierher — und dann sind sie eindeutig AOE und
nicht Schatten.

**3 Kontaktschatten.** Ein weiches Oval je Figur, **kein** Lichtschatten. Es liest zwei Zahlen:

- Größe = `body.radius` × Faktor (die **Silhouette**, nicht die Grundform — Flügel und Ohren werfen
  Schatten, auch wenn sie beim Maßstab nicht mitzählen),
- Deckung und Größe fallen mit der Höhe über dem Boden: am Boden 100 %, bei einer Grundform-Höhe
  darüber etwa 45 % Deckung und 130 % Größe.

Weil er ein Decal ist, überlebt er den flachen Blick, den PNG-Export mit Transparenz und die
Papier-Optik. Der 3D-Wurfschatten bleibt daneben möglich, ist aber **standardmäßig aus**.

**4 Wurfschatten (optional).** Nur wenn die Szene eine Lichtrichtung *erzählen* will — Kerze,
Scheinwerfer, Lagerfeuer. Dann gilt: Wurfschatten **weich und schwach** (er ist Atmosphäre), der
Kontaktschatten bleibt unverändert (er ist Information). Nie beide auf voller Stärke.

## 4 Kerzenlicht und Verwandte als Presets

Das Studio hat schon vier Stimmungen (`tag` · `daemmerung` · `nacht` · `untergrund`). Kerze ist die
fünfte und zeigt, wie das Modell trägt: sie ändert **nur** die Lichtseite.

| Preset | Schlüssellicht | Wurfschatten | Kontaktschatten | Boden |
|---|---|---|---|---|
| `tag` | weiß, hoch, ruhig | aus | 100 % | Papier |
| `kerze` | warm (2000 K), tief, **Flackern** 6–9 Hz, ±8 % | weich an, 25 % | **unverändert** | Papier, leicht warm getönt |
| `spot` | hart von vorn oben | an, 40 % | unverändert | dunkler, Rand abfallend |
| `untergrund` | kalt von unten | aus | 120 %, weicher | dunkel |
| `flat2d` | flach von vorn, kein Modelling | aus | unverändert | unsichtbar |

Die Spalte, die nie wackelt, ist die dritte. **Das ist der ganze Trick:** die Lage der Figur wird von
der Stimmung nicht angetastet, sonst hüpft das Spielfeld, wenn man die Kerze anzündet.

## 5 Vertragsfelder (Vorschlag)

Der Boden ist eine Eigenschaft der **Zone**, nicht des Pets — deshalb ein eigener Block, kein
`pets[]`-Feld. Aus dem Pet kommt nur eine Zahl, und die steht schon im Vertrag (`body.radius`).

```json
"ground": {
  "plane":  { "mode": "paper", "tint": "#efe6d3", "size": 40, "y": 0 },
  "shadow": { "mode": "decal", "opacity": 0.32, "soft": 0.55, "scale": 1.15,
              "liftFade": 0.55, "cast": { "on": false, "opacity": 0.25, "blur": 3 } },
  "fx":     { "aoe": { "color": "#ff5fd0", "opacity": 0.5, "pulse": 0.8 },
              "hit": { "color": "#b8361f", "life": 0.4 } },
  "light":  { "preset": "tag", "flicker": 0 }
}
```

`shadow.mode`: `decal` (Standard) · `cast` · `both`. `liftFade` ist der Anteil, um den die Deckung
über eine Grundform-Höhe abfällt — eine Zahl für »so hoch springt es und so weit verliert der
Schatten«.

## 6 Was daran zu messen ist (Abnahme)

1. **Zwei Pets mit gleicher Grundform werfen gleich große Kontaktschatten** — auch wenn eines Flügel
   hat. (Prüft, ob `radius` und nicht `cubeH` die Größe macht. Gemessen: Pinguin `spanWarn` 1,52 — er
   ist der Testfall.)
2. **Kerze an/aus verschiebt den Kontaktschatten um 0 px.** Die Lage darf sich nicht ändern.
3. **Ein Pet, das eine Grundform-Höhe hoch hüpft**, hat 45 % ± 5 % Deckung und 130 % Größe.
4. **Bodenplatte `invisible` + PNG-Export**: Figur freigestellt, Schatten halbtransparent erhalten.
5. **AOE-Ring und Kontaktschatten überlagern sich sichtbar getrennt** — zwei Farben, nicht ein Matsch.
6. Flacher 2D-Blick: kein Höhenversatz zwischen Decal und Fuß (der Fußpunkt ist gemessen, nicht der
   Rahmen — die Falle aus Travel §21.5).

## 7 Offene Entscheidungen für Georg

1. **Sind die rosa Ellipsen im Mockup AOE oder Schatten?** Nach diesem Modell wären sie AOE (Schicht 2)
   und der Schatten läge als graues Oval darunter/darüber. Umgekehrt geht auch — aber nur eines.
2. **Liegt das AOE unter oder über dem Kontaktschatten?** Darunter heißt: der Schatten gewinnt, das
   Feld wirkt wie bemalter Boden. Darüber heißt: das Feld leuchtet, die Figur schwebt optisch.
3. **Soll die Bodenplatte im Pinball die Karte tragen** (wie im Mockup) oder eine Volltonfläche sein,
   auf der die Karte als eigenes Objekt liegt? Das entscheidet, ob die Karte Schatten annimmt.
4. **Kerze: Flackern auf dem Licht oder auf dem Wurfschatten?** Beides zusammen ist zu viel — das
   Auge liest Flackern am Rand des Schattens stärker als in der Fläche.

## 8 Wo es gebaut würde

Ein Modul `studio-v5/ground-plane.v1.js` (Platte + Decal-Verwaltung, ohne 3D-Abhängigkeit außer
three), eingehängt zuerst im Studio (dort ist die Abnahme am Bild schnell), dann in Pinball und
Podcast — dieselbe Naht wie beim Shaper: **ein Modul, zwei Leinwände, keine DOM-IDs.**
Der Studio-Schatten (`_shadowPlane`, `ShadowMaterial` auf einer 40×40-Ebene) wird dabei sein erster
Kunde, nicht ein Konkurrent.
