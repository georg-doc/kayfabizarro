# COLOR-01 · KFB Clay Palette, Biome, Light und Mood Contract v1

Status: **DIRECTION LOCKED · PRESETS REQUIRE VISUAL CALIBRATION**

## North Star

Bunt, lebendig, harmonisch-schräg: ClayBound/Hirnwelt/T3 `Knetstrang`; Rocko × SpongeBob × Wallace & Gromit × Mario Kart. Nicht blass, nicht generisches Toon-Shading und nicht zufällige Farben pro Objekt.

## Bestehender technischer Donor

`KFB Cologne Race Option C-2/lab-v9/cologne-palette.v1.js` bleibt der Farbrechen-Donor:

- OKLCH statt HSL;
- Helligkeit/Chroma der gemessenen Rollen bleiben erhalten;
- deterministische Seeds;
- Zonenfamilien statt unabhängiger Zufallsfarben;
- importierbares/exportierbares JSON;
- Mittelstreifen gelb und Außenstreifen orange-gelb bleiben in einem festen Verkehrsfarbenband;
- HUD erbt dieselbe Palette.

## Hierarchie

Die sichtbare Farbe entsteht in genau dieser Reihenfolge:

`Golden Base → globaler Seed → Biome → Zone/Card → time/weather mood → interaction accent`

Spätere Ebenen dürfen Rollen modulieren, aber nicht semantisch vertauschen. Fahrbahn bleibt Fahrbahn; Markierung bleibt lesbar; Wasser bleibt von befahrbarer Fläche unterscheidbar.

## Semantische Rollen

### World

- `terrain.near`, `terrain.far`, `grass`, `soil`, `rock`, `water`, `foam`, `sky.high/mid/low`, `fog`.
- `road.bed`, `road.sidewalk`, `road.curb`, `road.centerLine`, `road.outerLine`, `road.runoff`.
- `building.wall`, `building.roof`, `building.window`, `building.door`, `building.trim`, `building.landmark`.
- `nature.trunk`, `nature.foliage`, `nature.flower`, `nature.fence`.

### Actor / Vehicle / Prop

- `actor.skin/fur`, `actor.hair`, `actor.cloth.primary/secondary`, `actor.accent`.
- `vehicle.body`, `vehicle.trim`, `vehicle.tire`, `vehicle.glass`, `vehicle.light`.
- `prop.body`, `prop.detail`, `prop.emissive`.

### UI / Gameplay

- `ui.ink`, `ui.panel`, `ui.primary`, `ui.secondary`, `ui.warning`, `ui.success`.
- HP: `<20% red`, `20–80% yellow`, `>80% green`; nicht seed-randomisiert.
- Interaction/quest/accent darf pulsieren, behält aber Kontrast- und Accessibility-Grenzen.

## KayKit-/Kenney-Farbmapping

1. Quellmaterialien inventarisieren und ihre Farben in OKLCH messen.
2. Jede Quellfarbe einer semantischen Rolle zuordnen.
3. `KAYKIT_NATIVE` erhält relative Helligkeit/Chroma als Baseline.
4. Mood verschiebt Familien gemeinsam; keine pauschale Tint-Matrix über alle Materialien.
5. Marken-/Identity-Farben und bewiesene Character-Zonen bleiben geschützt.

## Biome

Ein Biome ist keine vollständige Palette, sondern eine kleine Modulation:

- `hueShiftDeg` je Familie;
- `lightnessDelta`, `chromaScale`;
- Material-/Clay-Profil-Overrides;
- Fog, sky, key/fill/rim, water/foam;
- VFX-Partikel-Preset;
- optional Props/Vegetation-Familien.

Start-Biomes:

1. `O_TOWN_CLAY` – warme Walls, türkis/grüne Kontrapunkte, lila/korallige Akzente.
2. `CANYON_GOLD` – Terrakotta, Honig, petrolfarbene Schatten, trockener Staub.
3. `BIKINI_AQUA` – Aqua/Teal, Koralle, Sandgelb, violette Tiefen.
4. `HIRNWELT_DAY` – H0 Golden Sample für Terrain/Häuser/Characters.
5. `KAYKIT_NATIVE_CLAY` – Quellfarben mit Clay-Material, minimale Familienverschiebung.

Die Namen sind Preset-IDs; Werte werden in COLOR-01 visuell kalibriert und danach gepinnt.

## Time / Weather / Lighting

- `day`: klare Lesbarkeit, weiches Key/Fill, kontrollierte Kontakt- und Formschatten.
- `golden`: warmes Key, kühler Fill, keine orange Volltönung.
- `dusk`: farbiger Himmel, Characters/Fahrbahn bleiben erkennbar.
- `night-readable`: dunkler Hintergrund, aber Mindest-Key/Fill auf Actor, Straße, Interaktion und Landmark; nie „schwarzer Testmodus“.
- `rain`: geringere Chroma, kühlere Reflexe, nasse Akzente; Fahrbahn-/Markierungskontrast bleibt.

Schatten-/Hellkanten-Artefakte werden nicht als Mood akzeptiert. Normal bias, shadow map, tone mapping und Relief-Frequenz müssen je Distanzband zusammen geprüft werden.

## Shader-/Performance-Regeln

- Nah: volles Clay-Relief und semantische Materialdetails.
- Mittel: weniger Grain/Print/Crack, gleiche Farbrollen.
- Fern: raues vereinfachtes Material ohne volles Relief; Form/Palette bleiben.
- UI/CSS bleibt native Auflösung; adaptive Pixelratio betrifft nur WebGL.
- keine dynamische Shader-Neukompilation pro Objekt/Seed; Presets teilen Materialvarianten.

## JSON-Vertrag

Schema `kfb.palette-mood/1`:

```json
{
  "schema": "kfb.palette-mood/1",
  "id": "o-town-clay-day",
  "seed": 43129,
  "scheme": "split",
  "goldenBase": "claybound-hirnwelt-v1",
  "biome": "O_TOWN_CLAY",
  "time": "day",
  "weather": "clear",
  "roles": {},
  "lighting": {
    "key": "#ffd38a",
    "fill": "#72b9c9",
    "rim": "#ff7c70",
    "exposure": 1,
    "fog": "#9fd0c8"
  },
  "clayProfiles": {
    "terrain": "terrainFg",
    "buildings": "house",
    "road": "road",
    "characters": "figure",
    "vehicles": "vehicle"
  }
}
```

## COLOR-01 Abnahme

- fünf Presets, derselbe Seed reproduziert exakt dieselben Werte;
- je Preset World/Track, Character, Vehicle und HUD im selben Frame;
- Original/KayKit Native/Clay A/B;
- day/dusk/night-readable/rain;
- Fahrbahnmarkierungen, HP und Interaktionsfarben bestehen Kontrastprüfung;
- Import/Export Roundtrip;
- keine unlesbaren oder zufällig clashenden Einzelobjekte;
- Messwerte plus Screenshots nah/mittel/fern; finale Wahl durch Georg im realen World-/ToolBox-Kontext, nicht in einer isolierten Farbtabelle.

