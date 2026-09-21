# KFB ToolBox — Übergabe an WSA Work Lead

**Stand 2026-09-21 · v1.1.0** · Absender: Claude Design · Lieferform: ZIP + Preview,
**kein Push** (KFB-Regel 6: Integration macht der Web Lead).

> **v1.0.0 war ein Nachbau des Fluid-Shaders, kein Kopiat.** Georg hat es am Bild erkannt.
> Behoben in v1.1.0: GLSL wortgleich, Schaum wieder tot, Repo-Texturen werden geladen, Wanne
> baut mit `kfb-box-material`. Vollständige Aufarbeitung in `POSTMORTEM_2026-09-21_SHADER.md`.

---

## Was geliefert wird

Fünf Module, herausgelöst aus **KFB Card Zone Lab v2**, plus eine Bank, die vier davon
wirklich mountet und ihre Zahlen ausweist.

| Modul | Inhalt | Status |
|---|---|---|
| `kfb-fluid-v1` **1.1.0** | Wassergraben: Feld, Shader, Wanne, Fluss, Strömung, Blasen | TESTED RESULT |
| `kfb-beam-v1` | Holo-Schleier zwischen Boden und Karte | TESTED RESULT |
| `kfb-seeds-v1` | Karte → Welt: Modus, Palette, Zonensignatur | TESTED RESULT |
| `kfb-voxel-world-v1` | Terrain v10 + Weltkontext, unverändert gespiegelt | SOURCE |
| `kfb-cardstack-v1` | Deck, Aufdeck-Animation, Sky-Card | **NOT_TESTED** |

Beweisträger: `KFB ToolBox Bench.dc.html` (Projektwurzel).

---

## Ehrlichkeitsformat

**SOURCE**
`KFB Card Zone Lab v2.dc.html` (2.586 Zeilen, Projektwurzel), `terrain-v10/voxel-terrain.js`,
`terrain-v10/world-context.js`. Vollständig gelesen, nicht aus dem Gedächtnis rekonstruiert.

**DECISION**
Herauslösen statt Kopieren des Labs. Es existieren bereits drei Voll-Exporte
(`export/card-zone-lab-v1…v3`) — ein vierter hätte nichts hinzugefügt. Der Wert liegt darin,
dass die Systeme jetzt **einzeln** einbaubar sind, mit benannten Verträgen und ohne die
Component-Klasse des Labs.

Zweite Entscheidung: **Feldmathematik von der Darstellung trennen.** `kfb-fluid-field.js`
braucht kein three.js. Zellzahlen, Wasserlinie und Strömungsvektoren sind damit messbar, ohne
einen Renderer zu starten — KFB-Regel 3 wird dadurch billig statt aufwendig.

**IMPLEMENTATION**
Fünf Modulordner, 10 JS-Dateien, 5 READMEs, diese Übergabe, `MODULE_MAP.md`,
`INTEGRATION.md`, `CONTRACTS.md`. Doku und Kommentare Deutsch, öffentliche Bezeichner
Englisch (Projektregel).

**TESTED RESULT**
`KFB ToolBox Bench.dc.html` mountet `kfb-fluid-v1`, `kfb-beam-v1`, `kfb-voxel-world-v1`,
`kfb-seeds-v1` und `kfb-box-material.js` per dynamischem Import und rendert. Gemessen im
Browser (cell 3, halfX 24, halfZ 13.5, rows 3, Fluss an Breite 3, Stufen 0.60, Absenkung 0.0,
Seed 42, Modus forbidden, Füllung Säure):

| Größe | Wert | Bedeutung |
|---|---|---|
| fps | 116–120 | |
| Grabenzellen | 274 | Ring + Flussbett |
| davon nass | 202 | speist Netz **und** Blasen — eine Quelle |
| davon Fluss | 88 | |
| Wasser-Quads | 202 | exakt = nasse Zellen → kein Quad ohne Zelle |
| Wasserlinie y | −0.750 | klassifizierend, auf SUB |
| gezeichnete Ebene y | −0.875 | Δ = −0.125 = SUB·0.25 → nie koplanar |
| Strömung max | 1.000 | Attribut kommt normiert im Shader an |
| **Wasser-Texturen** | **dudv+map geladen** | `FEHLEN` = falscher Shader-Pfad |
| **Wannen-Material** | **kfb-box-material** | `MeshStandard` = nicht der Lab-Pfad |
| Ufer-Kalibrierung | 0.598 | aus den echten Terrain-Uniforms gelesen |
| Seed-Streuung | 0.367 | Basislinie erzeugt Unterschiede |
| Seed-Modus | mystical | aus dem Vektor abgeleitet |

Vier Zahlen sind der Gesundheitstest. **nass = Quads** und **Δ = SUB·0.25** prüfen die
Geometrie; **Wasser-Texturen** und **Wannen-Material** prüfen den Shader-Pfad. Die letzten
beiden gab es in v1.0.0 nicht — deshalb hat die Messtafel den Nachbau nicht gefangen.

Bilder: `screenshots/01-beweis.png` (Säure), `02-beweis.png` (Wasser, gleiche Szene),
`03-beweis.png` (Aufsicht).

**Nicht getestet:** `kfb-cardstack-v1`. Die Bank hat keinen CardBuilder und damit keine echte
Karte. Der Code ist 1:1 die im Lab laufende Logik, aber als Modul nie ausgeführt.
Kein Test auf: Mobile, Safari, mehrere Zonen gleichzeitig, Terrain-Neubau unter laufendem
Wasser, Speicherverhalten über Minuten.

**EXPORT**
ZIP mit `tools/KFB-ToolBox/` + Bench + Doku. Keine Modelle, keine Animationsbibliotheken,
keine Fonts, kein Audio (KFB-Regel 1). Die beiden Wassertexturen sind SourceRefs, keine Kopien.

**PUBLIC DEPLOYMENT**
Keins.

**GEORG ACCEPTANCE**
Offen.

**OPEN**
0. Die übrigen Module sind nicht Zeile für Zeile gegen die Quelle gehalten worden — nur
   `kfb-fluid-v1` wurde nach dem Fund nachgeprüft. `kfb-beam-v1` und `kfb-seeds-v1`
   gelten bis zum Gegentest als **wahrscheinlich, nicht bewiesen**.
1. `kfb-cardstack-v1` gegen das Lab gegenprüfen (Aufdeck-Kurve, gestaffelte Einsätze).
2. Das Lab auf die Module umstellen. Solange die Inline-Fassung dort bleibt, gibt es zwei
   Wahrheiten (KFB-Regel 4) — die Module driften ab.
3. `kfb-box-material.js` liegt im Projekt an der Wurzel, nicht in der ToolBox. Im Repo muss
   der `boxKit`-Import auf die kanonische Fassung zeigen — keine zweite Kopie anlegen.
4. Mehrere Zonen auf einer Welt: `field.calmZones()` liefert drei Kreise pro Zone,
   `terrain.setZones()` nimmt insgesamt drei. Zwei Zonen gleichzeitig gehen so nicht.
5. Kein Dispose-Test. `gutter.dispose()` ist geschrieben, nie gelaufen.

---

## Was der Work Lead zuerst tun sollte

```
1. ZIP auspacken, tools/KFB-ToolBox/ nach <repo>/tools/KFB-ToolBox/ legen
2. KFB ToolBox Bench.dc.html öffnen → Messtafel unten links
3. "wasser-texturen" muss "dudv+map geladen" zeigen (braucht ein paar Sekunden)
4. "wannen-material" muss "kfb-box-material" zeigen
5. "davon nass" und "wasser-quads" vergleichen — müssen gleich sein
6. Regler GRABEN und FLUSS-BREITE bewegen, Zahlen müssen mitgehen, keine Löcher im Wasser
7. erst dann integrieren
```

Zeigt Schritt 5 unterschiedliche Zahlen, ist irgendwo eine zweite Nass-Definition entstanden.
Zeigt Schritt 3 »FEHLEN«, rendert der Shader einen anderen Pfad — dann ist das Bild nicht das
Lab-Bild, egal wie es wirkt. Nicht am Pixel korrigieren, die Grundlage prüfen (KFB-Regel 7).
