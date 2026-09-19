# TinySkies terrain × OSM × landmarks × Grotesque · cohesion study · 2026-09-19

**Status:** SOURCE REVIEW + KFB DESIGN CONTRACT  
**Default landmark deformation:** City Grotesque  
**Default review environment:** OSM City Lab  
**Future terrain/world donor:** TinySkies / KFB Travel — host-owned

## What TinySkies actually does well

The useful lesson is not “copy these exact colours”. It is **how objects belong to one world**.

### 1 · Objects keep simple local identities

TinySkies houses are warm plaster / stone frames / coloured domes / wood doors / warm windows. The lighthouse is mostly pale tower + red bands + dark metal + warm lantern. The observatory is stone + cool dome + dark slit + blue windows.

Those palettes are small and readable.

### 2 · The world, not each object, owns time of day

`Game.applyDayNightPreset()` updates the sky gradient, fog, hemisphere light, ambient light, two suns, two fills, back light, atmosphere glow, cloud opacity, ocean colours and the shared rim colour.

That is the core integration rule KFB should reuse:

> **Do not repaint every OSM building and landmark for sunset/night. Change the world light/sky/fog/rim together and let the local palettes respond naturally.**

### 3 · Shared Fresnel/rim ties unrelated props together

TinySkies has one `globalRimColor`. Many materials use a rim shader patch, and the current sky preset updates that shared colour.

That means a lighthouse, observatory, vehicle and other props can remain locally coloured while still receiving the same “time of day” edge language.

For KFB this is especially useful because Grotesque silhouette deformation and KFB Ink can stay independent from world lighting:

- Grotesque = shape;
- KFB Ink = outline/mechanics;
- global rim/light = world cohesion.

### 4 · Emissive details are local accents

Village windows carry a warm emissive role. The lighthouse lantern has a warm emissive housing plus additive glow.

KFB equivalent:

- OSM windows / signs / lamps can have deterministic warm/cool emissive roles;
- landmark glazing/accent zones can opt in;
- the whole facade should not glow.

### 5 · Terrain contact is authored, not accidental

TinySkies repeatedly samples the actual terrain surface and sinks props slightly into it. The observatory intentionally uses a deeper buried foundation on uneven terrain.

This should become mandatory for KFB TinySkies terrain + OSM/landmark integration:

`surface sample → foundation depth → placed object`

No visual floating. Hero landmarks may need a deeper hidden foundation or terrain pad.

### 6 · Genius loci affects placement

TinySkies places:

- lighthouses on low coastal ground with high surrounding-water ratio;
- observatories on elevated ground and away from other landmarks;
- villages on moderate land elevations.

That is directly relevant to KFB procedural scenery. A “genius loci” is not only a model; it is a **placement relationship to terrain**.

## Weather: important limitation

Current TinySkies rain behaviour confirmed from source:

- dynamic `rainWeight`;
- RainOverlay;
- rain audio;
- rain dampens some ambience.

What is **not** confirmed in the reviewed source:

- wet-building albedo;
- roughness/specular rain response;
- rain-driven landmark recolouring.

Therefore KFB should not claim those as TinySkies behaviour.

A later KFB wetness pass can be useful, but it should be a separate extension/gate.

## KFB target architecture

### WorldAppearanceState — one host state

The receiver world owns:

```text
time weights
weather / rain
sky
fog
light rig
rim colour
cloud/atmosphere state
```

OSM buildings, landmarks, props and vehicles consume it.

### Terrain

TinySkies-like KFB terrain should provide:

- terrain height/surface query;
- biome palette family;
- roughness/slope classification;
- weather exposure;
- optional water/coast relation.

### OSM buildings

Recommended TinySkies-like treatment:

- unique footprint geometry remains OSM-derived;
- deterministic class/roof/accent palette;
- flat-shaded lit material;
- shared world rim;
- warm/cool emissive window role where appropriate;
- repeated secondary environment objects may be instanced;
- do not flatten the whole city to one hue.

### Landmarks

Landmarks use the same world material/light contract as OSM, but preserve stronger identity.

Examples:

- Dom: dark stone / cool glazing / restrained warm accent;
- Eiffel: warm oxidized metal;
- Giza: sand/limestone;
- Spasskaya: red / pale trim / green roof / gold.

No private “hero key light” by default. The landmark should look special because of silhouette, scale, palette and local emissive details, not because it lives in a different lighting universe.

## Day/night behaviour

Recommended first pass:

- keep base albedo stable;
- interpolate world lights/fog/sky/rim;
- keep local emissive accents;
- optionally expose a **visibility/gain** control for windows/signs, but do not require it for the donor-match baseline.

This is much more robust than baking separate DAY / NIGHT landmark colour sets.

## Weather behaviour

### Baseline

- same object albedo;
- same shared world light/rim contract;
- rain particles/overlay;
- rain ambience;
- host fog/cloud changes if available.

### Deferred KFB extension

One global `wetness` scalar could later drive:

- lower roughness;
- slightly stronger specular;
- subtle albedo darkening;
- road/puddle treatment.

That should be tested as one world-level response, not hand-tuned per landmark.

## Why this fits Grotesque

Grotesque deformation changes silhouette and local massing. TinySkies-style world lighting then treats the result exactly like any other object.

This avoids the common failure mode:

> grotesque building geometry + unrelated “special landmark material” + unrelated light = collage.

Target:

> **same weather, same sky, same rim, same fog, same terrain contact — different local identity.**

## Recommended implementation order

1. Keep Pilot 06 OSM City Lab as the default review environment.
2. Build modular Grotesque Cologne Cathedral and calibrate real OSM placement.
3. Add a shared world-rim/material adapter for OSM + landmarks.
4. Build one TinySkies-terrain Stage with:
   - one OSM block cluster;
   - one hero landmark;
   - one lighthouse/observatory-like KFB prop;
   - DAY / EVENING / NIGHT;
   - rain on/off.
5. Only after the world reads as one coherent toy world, add wetness/weather material extensions.

## North Star

> **The world as a breathing, living toy — with one atmosphere, not a pile of separately lit assets.**
