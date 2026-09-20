# KFB ToolBox — Übergabe an WSA Work Lead

**Stand 2026-09-21** · Absender: Claude Design · Lieferform: ZIP + Preview, **kein Push**
(KFB-Regel 6: Integration macht der Web Lead).

---

## Was geliefert wird

Fünf Module, herausgelöst aus **KFB Card Zone Lab v2**, plus eine Bank, die vier davon
wirklich mountet und ihre Zahlen ausweist.

| Modul | Inhalt | Status |
|---|---|---|
| `kfb-fluid-v1` | Wassergraben: Feld, Shader, Wanne, Fluss, Strömung, Blasen | TESTED RESULT |
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
`KFB ToolBox Bench.dc.html` mountet `kfb-fluid-v1`, `kfb-beam-v1`, `kfb-voxel-world-v1` und
`kfb-seeds-v1` per dynamischem Import aus `tools/KFB-ToolBox/` und rendert. Gemessen im
Browser (cell 3, halfX 24, halfZ 13.5, rows 3, Fluss an Breite 3, Stufen 0.60, Absenkung 0.0,
Seed 42, Modus mystical):

| Größe | Wert | Bedeutung |
|---|---|---|
| Grabenzellen | 274 | Ring + Flussbett |
| davon nass | 207 | speist Netz **und** Blasen — eine Quelle |
| davon Fluss | 88 | |
| Wasser-Quads | 207 | exakt = nasse Zellen → kein Quad ohne Zelle |
| Wasserlinie y | −0.750 | klassifizierend, auf SUB |
| gezeichnete Ebene y | −0.875 | Δ = −0.125 = SUB·0.25 → nie koplanar |
| Strömung max | 1.000 | Attribut kommt normiert im Shader an |
| Ufer-Kalibrierung | 0.598 | aus den echten Terrain-Uniforms gelesen |
| Seed-Streuung | 0.367 | Basislinie erzeugt Unterschiede |
| Seed-Modus | mystical | aus dem Vektor abgeleitet |

Die Gleichheit **nass = Quads** und die Differenz **Δ = SUB·0.25** sind die beiden Zahlen, an
denen man erkennt, ob das Modul intakt eingebaut wurde. Weichen sie ab, ist die Nass-Definition
dupliziert worden.

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
1. `kfb-cardstack-v1` gegen das Lab gegenprüfen (Aufdeck-Kurve, gestaffelte Einsätze).
2. Das Lab auf die Module umstellen. Solange die Inline-Fassung dort bleibt, gibt es zwei
   Wahrheiten (KFB-Regel 4) — die Module driften ab.
3. Die Wanne benutzt `MeshStandardMaterial`; das Lab benutzt `kfb-box-material.js`. Das Modul
   nimmt ein eigenes Material über `basinMaterial` entgegen, die Kalibrierung ist aber gegen
   den Standard-Pfad gemessen.
4. Mehrere Zonen auf einer Welt: `field.calmZones()` liefert drei Kreise pro Zone,
   `terrain.setZones()` nimmt insgesamt drei. Zwei Zonen gleichzeitig gehen so nicht.
5. Kein Dispose-Test. `gutter.dispose()` ist geschrieben, nie gelaufen.

---

## Was der Work Lead zuerst tun sollte

```
1. ZIP auspacken, tools/KFB-ToolBox/ nach <repo>/tools/KFB-ToolBox/ legen
2. KFB ToolBox Bench.dc.html öffnen → die Messtafel unten links muss Zahlen zeigen
3. "nass" und "Wasser-Quads" vergleichen — müssen gleich sein
4. Regler GRABEN und FLUSS-BREITE bewegen, Zahlen müssen mitgehen, keine Löcher im Wasser
5. erst dann integrieren
```

Zeigt Schritt 3 unterschiedliche Zahlen, ist irgendwo eine zweite Nass-Definition entstanden.
Nicht am Pixel korrigieren — die Grundlage prüfen (KFB-Regel 7).
