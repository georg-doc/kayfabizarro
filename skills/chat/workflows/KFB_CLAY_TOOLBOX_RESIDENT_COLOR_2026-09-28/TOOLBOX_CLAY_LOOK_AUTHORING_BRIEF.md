# CLAY-TOOL-01 · ToolBox Clay Look Authoring

## Auftrag

Erweitere die **bestehende ToolBox Production-03-Oberfläche** um ein Clay-Look-Modul. Kein UI-Neubau. Das Modul macht die akzeptierten H0/K1/T3-Parameter auffindbar, vergleichbar und exportierbar.

## Verbindliche Donors

- `KFB Knet-Strecke T3 .../lab-clay/clay-material.v8.js`
- `KFB Knet-Strecke T3 .../lab-clay/clay-profiles.v2.js`
- `KFB Knet-Strecke T3 .../lab-clay/clay-relief.v2.js`
- K1 Knet-Katalog als visuelle Klassen-/Distanzprobe
- H0 Hirnwelt als Golden Sample für große Weltflächen, Häuser und Characters
- ToolBox Production-03 als UI-/Studio-Owner

## Oberfläche

Ein kompakter Bereich `Clay / Look`, standardmäßig eingeklappt:

- `Original | Clay` A/B;
- Asset-Klasse: `terrainFg`, `terrainBg`, `nature`, `house`, `road`, `figure`, `vehicle`, `prop`, `water`, `cloud`;
- Profil-Preset, nicht Einzelmesh-Literal;
- Handmaß/Relief-Stärke, Grain, Facet, Crease, Print, Gouge, Crack, Dent;
- `Preview distance`: nah / mittel / fern;
- `Quality`: production / balanced / low;
- Palette/Mood/Seed aus `kfb.palette-mood/1`;
- Licht: day / golden / dusk / night-readable / rain;
- JSON import/export.

Die Bühne bleibt dominant. Ausführliche Messungen, Quellpins, Changelog und LLM-Felder liegen hinter dem bestehenden Info-/Docs-Toggle.

## Regeln

1. Weltmaß statt Textur-Pixelmaß: Finger-/Dellenfrequenz bleibt bei Skalierung plausibel.
2. `terrainBg` und entfernte City-Shells nutzen vereinfachtes Relief. Der R4-Performancebeweis bleibt gültig.
3. Fahr-/Kontaktgeometrie wird durch den Look nicht deformiert. Clay-Form ist Presentation oder vorgebackener Visual Mesh.
4. Original-Materialien bleiben reversibel erreichbar.
5. Source-Mesh zuerst isoliert zeigen; erst danach Materialadapter.
6. Keine generischen Ersatzmaterialien, wenn der echte Donor geladen werden kann.

## Export

Schema `kfb.clay-look-profile/1`:

```json
{
  "schema": "kfb.clay-look-profile/1",
  "id": "house-hirnwelt-v1",
  "assetClass": "house",
  "donor": {
    "material": "clay-material.v8.js",
    "profile": "clay-profiles.v2.js#house"
  },
  "surface": {
    "handScaleM": 0.5,
    "relief": 1,
    "grain": 1,
    "facet": 1,
    "crease": 1,
    "print": 0.8,
    "gouge": 0.4,
    "crack": 0.22,
    "dent": 0.3
  },
  "distanceBudget": {
    "near": "full",
    "mid": "reduced",
    "far": "rough-only"
  },
  "paletteRef": "mood://hirnwelt-day/seed-43129"
}
```

## Abnahme

- je ein echter Source-Donor für Character, Vehicle, House, Road und Terrain;
- Original/Clay ohne Neuladen vergleichbar;
- nah/mittel/fern zeigen kontrolliert weniger Reliefkosten;
- Import → Export ist deterministisch;
- kein UI-Overflow in 390 px;
- keine zweite Renderer-, Mixer- oder Material-Ownership;
- Performancevergleich mit sichtbaren Dreiecken, Draw Calls, Pixelratio und p95 – Messwerte in Doku, nicht dauerhaft im FOV.

## Stop

Nach einem funktionierenden Profileditor und fünf Source-Proofs. Kein Consumer-Einbau in diesem Slice.

