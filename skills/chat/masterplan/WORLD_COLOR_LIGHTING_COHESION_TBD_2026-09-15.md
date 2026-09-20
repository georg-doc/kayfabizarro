# TBD · World Color & Lighting Cohesion Pass

**Date:** 2026-09-15  
**Status:** TO BE DISCUSSED / design and rendering pass, no implementation.  
**Source:** Georg, current KFB Town design session; intended handoff to the Travel-Globe planning chat.  
**Owner boundary:** Travel remains owner of world/terrain/sky/lighting implementation. Town is a consumer of the later Travel look contract. This document does not create a second renderer, lighting owner or material SSOT.

## Problem

Different asset families can read as if they came from different games even when they share one scene. The mismatch can come from several layers at once: different material values and baked colors, different texture brightness/saturation, missing or different normals, roughness/emissive differences, scale differences, changing light/fog setups and character-specific color choices. A shared Directional Light alone therefore does not guarantee a coherent world look.

## Goal

Create a KFB world in which KayKit, Kenney, Quaternius, KFB rigs, vehicles and VFX belong together under the same lighting system while still allowing strong local moods: sunset, Graveyard candles, Area-51 night, neon/alien light, caves, aurora and similar local atmospheres.

## Principle

Do **not** force every asset pack to the same RGB values. Define one shared **World Lighting / Color Response** and allow only small calibrated per-asset or per-pack-family corrections.

## Proposed separation

### 1 · World Light Rig

One central time-of-day / weather / mood owner for sun, sky, ambient or hemisphere light, fog, rim/fill and, where appropriate, shared night weights.

### 2 · Local Lights

Grave lights, torches, projector, UFO, Jumbotron and similar sources may add local color. They do not replace the global material/light truth.

### 3 · Asset Calibration

Per asset or pack family expose only a small calibration surface, for example exposure, tint, saturation, roughness response, emissive response and, where needed, scale correction. No private light rig per pack.

### 4 · Character Palette

FrizzleBob, Driver Graft and later signature characters get a defined reference palette that is checked under multiple shared lighting states. The current Driver color treatment remains provisional until it is calibrated against the world. Do not make FrizzleBob independently “pretty” in each game by default.

### 5 · Mood Presets instead of per-location lighting systems

Examples: `day`, `golden-hour`, `dusk`, `graveyard-night`, `alien-night`. All use the same base architecture and change only named parameters. Locations can add local sources on top of the preset.

## Reference set for every mood

Use the same small comparison cast in every lighting state:

- one KayKit character;
- FrizzleBob / Driver Graft;
- one Kenney building or prop;
- one Quaternius prop;
- one vehicle;
- vegetation;
- one bright and one dark Card / MediaSurface.

Do not evaluate only “looks nice”. Check explicitly:

- are skin, eyes and facial features still readable?
- do black/dark characters collapse into silhouettes?
- do light pastel areas clip or burn out at sunset?
- do pack colors remain distinct without looking disconnected?
- do all materials respond plausibly to the same sun?
- do local lights remain visible without breaking the palette apart?

## Graveyard example

Global dusk provides form and orientation. Grave lights and torches create only local warm islands. They may tint nearby faces and stone slightly, but they do not own the entire Graveyard lighting setup.

## Sunset example

Warm sun plus cooler sky/ambient fill. Shadows therefore remain readable instead of collapsing to black, and different asset packs retain legible local color.

## FrizzleBob / Driver

Define one shared character reference palette and test it in Travel, Combat and Flight against the same reference moods. Game-specific deviations are then deliberate, named mood overrides rather than unrelated color fixes.

## No implementation choice yet

It is still **UNRESOLVED** whether the main correction comes from light, material adapters, asset calibration, color grading or a combination. First measure where the visible mismatch actually originates in a small comparison scene.

**Color grading comes last.** A global LUT/post-process may gently pull a coherent scene together after material/light response is sound. It must not hide two models reacting fundamentally differently to the same light.

## Recommended next design test

Build one **KFB Look Calibration Stage** with roughly five to eight representative assets and three lighting states:

1. Day
2. Golden Hour
3. Graveyard Night

Only after that stage carries should its named parameters move into Travel/Town. This is a calibration slice, not a general world editor.

## Town dependency

Town consumes the later Travel look contract instead of inventing independent lighting rules for Farm, Graveyard, Area 51, Maker Space or other habitats. Town locations choose mood presets and local light sources while retaining the same underlying color-response logic.

## Relation to current Town direction

Current public Town state is `SESSION_CARD.md` S001 r022 plus `references/TOWN_S001_R017_R022_PUBLIC_DELTA.md`: natural Travel terrain is the active Town basis; cutting-mat/table ground is historical for the active direction. This TBD adds a look-cohesion question to that handoff but does not alter Town cast, geography, Card provenance, showstage, speech budget or consumer ownership.

## Status vocabulary

- **DECISION / DIRECTION from Georg:** shared world-level color/light response; per-pack calibration should stay small; Town should consume Travel's later look contract; color grading is last rather than a masking first step.
- **PROPOSAL:** the exact five-part separation and the three-state KFB Look Calibration Stage as the first implementation-oriented comparison slice.
- **UNRESOLVED:** exact parameter schema, renderer/material-adapter technique, whether/how a LUT is used, numeric ranges and the final set of mood presets.
- **NOT TESTED:** no comparison scene, browser pass, material measurements, LUT, Travel integration or cross-game FrizzleBob calibration has been performed by this documentation update.
