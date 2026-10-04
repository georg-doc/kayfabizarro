# Post Mortem · ToolBox v1.0.0 → v1.1.0

**2026-09-21** · Auslöser: Georg, »DAS IST NICHT DER SHADER AUS KFB Card Zone Lab v2«, mit
Screenshot des Labs (Säure, forbidden-Palette) und Verweis auf `use-what-works_v1`.

---

## Was falsch war

Drei Abweichungen, alle in dieselbe Richtung: ich habe die Vorlage **verstanden und
nachgeschrieben**, statt sie zu kopieren und die Naht zu benennen.

### 1. Abgeschalteten Code eingeschaltet — Regel 2, Anti-Pattern »Kopie von etwas, das aus war«

`kfb-fluid-shader.js` v1.0.0, Fragment-Shader.

Die Quelle (`KFB Card Zone Lab v2.dc.html#buildFluidSurface`) hat:

```glsl
float u = 0.5;
float shore = min(smoothstep(0.0, 0.22, u), smoothstep(1.0, 0.78, u));   // == 1
float foam  = smoothstep(0.55, 0.95, wave2) * (1.0 - shore);             // == 0
```

`u` ist seit dem Ausbau des Shader-Beschnitts eine Konstante. Der Schaum ist damit
konstruktiv null — toter Code im Bild. Ich habe daraus `foam = smoothstep(...) * uFoam`
mit Standardwert 1 gemacht. Das Modul hatte grauen Schaum, den das Lab nie hatte.

Es sah wie eine Aufräumarbeit aus. Es war eine Erfindung.

### 2. Der Shader-Pfad ohne Texturen ist ein anderer Shader — Regel 3, nicht hingesehen

Das Lab lädt zwei Texturen aus dem Repo:

```
media/3D_Assets/KFB/waterdudv.jpg   → uDudv
media/3D_Assets/KFB/water.jpg       → uMap, uHasMap = 1
```

Die Bank v1.0.0 lud **keine**. Ich hatte sie im README als »optional« bezeichnet, weil der
Code ohne sie nicht abstürzt. Das ist die falsche Frage. Ohne `uDudv` liefert `texture2D`
Null, `duv` wird zur Konstanten `-0.3` und die gesamte Verzerrung fällt weg. Ohne `uMap`
ist `tex` konstant `1.0` und die Struktur fehlt. Übrig bleibt ein flaches Rauschfeld.

Genau das war auf meinem Screenshot zu sehen — und ich habe ihn als Beweis geliefert.

### 3. Die Wanne mit anderem Material gebaut — Regel 1, Theorie über Vorlage

`kfb-gutter.js` v1.0.0 nahm `MeshStandardMaterial`, weil ich die Abhängigkeit zu
`kfb-box-material.js` vermeiden wollte (»das Modul soll eigenständig sein«). Das Lab baut
mit `makeVariedBoxMaterial` + `makeBoxGeometry` + `writeVariation` — Streifen, Bänder,
Materialvariation. Die Eigenständigkeit war meine Theorie, das Bild war die Vorlage.

Nebenwirkung: die Ufer-Kalibrierung war gegen einen Materialpfad gemessen, den das Lab
nicht benutzt.

---

## Was es gekostet hat

Eine Runde. Georg musste den Fehler auf dem Bild sehen, das ich als Beweis eingereicht hatte.

Das ist teurer, als es klingt: der gelieferte Export, die Messtafel und das HANDOVER haben
alle korrekt gemessen — **die falsche Sache**. Zellzahlen, Wasserlinie und Strömung stimmten
und stimmen. Sie sagen nichts darüber, ob der Shader derselbe ist.

---

## Was richtig war

- Die Trennung Feld/Darstellung. `kfb-fluid-field.js` ist unverändert geblieben; die
  Feldmathematik war wirklich kopiert, inklusive der Kommentare zu den fünf Fehlern.
- Die Messtafel. Sie hat die Regression zwar nicht gefangen, aber sie hat nach der Reparatur
  in einem Blick gezeigt, dass die Texturen jetzt hängen — `wasser-texturen: dudv+map geladen`.
- Der Beam. Zyklus-erhaltende Zuordnung und Hysterese sind Zeile für Zeile aus der Quelle.

---

## Was daraus als Prüfung bleibt

Die Messtafel prüfte nur Geometrie. Zwei Zeilen kamen dazu, die den **Shader-Pfad** prüfen:

| Zeile | Bedeutung |
|---|---|
| `wasser-texturen` | `FEHLEN` heißt: falscher Shader-Pfad, egal wie das Bild wirkt |
| `wannen-material` | `MeshStandard` heißt: nicht der Lab-Pfad |

Das ist Regel 6 in klein: die Quelle hat keine Log-Ausgabe, also wird eine ihrer
Bedingungen ausgegeben und verglichen.

**Die allgemeine Lehre**: eine Messung, die nur das prüft, was ich ohnehin beherrsche, ist
keine Messung. Sie ist Beruhigung. Dieselbe Diagnose steht schon im
`KFB_HEX_ATLAS_FAILURE_HANDOFF_2026-09-20` — Messwerkzeuge, die Kantenketten zählen,
während der Fehler in der Bestandsauswahl liegt. Zweites Auftreten desselben Musters.

---

## [CHANGELOG] v1.0.0 → v1.1.0

**additiv**
- `loadFluidTextures(THREE, {dudvUrl, mapUrl})` — lädt beide Repo-Texturen wie `loadTex` im Lab
- `gutter.ready()` / `mountFluidSystem({ textures })` — Nachladen, standardmäßig an
- `mountFluidSystem({ boxKit })` — `kfb-box-material.js` durchreichen; die Wanne baut dann
  exakt wie im Lab (`makeVariedBoxMaterial`, `makeBoxGeometry`, `writeVariation`)
- `measure().textures` und `measure().basin`
- Uniforms `uMoat`, `uZ` (im Lab vorhanden, im Fragment deklariert, nicht gelesen)

**unverändert**
- `kfb-fluid-field.js`, `kfb-bubbles.js`, `kfb-beam-v1`, `kfb-seeds-v1`, `kfb-voxel-world-v1`
- Vertex-Shader (war schon wortgleich)
- die gesamte Feld- und Niveaumathematik

**entfernt**
- `uFoam` — der Schaum ist wieder tot, wie in der Quelle
- `uFlowGain` — im Lab nicht vorhanden

## [NAHT]

`kfb-fluid-shader.js`: der GLSL-Text ist unverändert aus der Quelle; eigen sind nur die
Fabrikfunktion drumherum und `loadFluidTextures()`. Die Grenze läuft an der schließenden
Klammer von `FLUID_FRAG`.

`kfb-gutter.js#createGutter`: Materialwahl und `writeVariation` sind aus dem Lab
(`buildMoat`, `layoutMoat`); eigen ist die `boxKit`-Weiche für den Fall, dass das Kit fehlt.

## [BEWEIS]

Das Lab hat keine Log-Zeile, an der eine Kopie zu erkennen wäre. Stattdessen drei Bedingungen
der Quelle, die auf der Bank wieder erscheinen müssen:

```
wasser-texturen   dudv+map geladen
wannen-material   kfb-box-material
ebene y (Δ)       -0.875 (-0.125)      = SUB · 0.25
davon nass 202  ==  wasser-quads 202
```

Bild: `screenshots/01-beweis.png` (Säure), `02-beweis.png` (Wasser, gleiche Szene),
`03-beweis.png` (Aufsicht).

**Was auf dem Bild jetzt anders ist als vorher:** die Säure leuchtet und hat wandernde
Schlieren, statt als stumpfe Fläche dazuliegen; die Wannenwände tragen Streifen und
Helligkeitsvariation statt einer einzigen Grauabstufung; der graue Schaumsaum ist weg.
