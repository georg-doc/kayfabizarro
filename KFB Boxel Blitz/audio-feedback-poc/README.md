# KFB Boxel Blitz · Audio Feedback POC

**Status:** IMPLEMENTED POC · PHYSICS UNCHANGED · HUMAN AUDIO/VFX REVIEW OPEN

## Goal

Prove a reusable arcade/cartoon feedback grammar without changing Boxel Blitz v4 physics:

- pickup;
- power up;
- power down;
- checkpoint ladder;
- cascade ladder.

The sound vocabulary comes from the existing KFB audio library and the already-authored `kfb-pinball-sfx/v1` direction.

## Owner boundary

This folder does not edit:

- `KFB Boxel Blitz v4.dc.html`;
- `boxelblitz-v4/dice.v4.js`;
- `boxelblitz-v4/cube.v3.js`;
- `boxelblitz-v4/surfaces.v1.js`.

It is a presentation/audio POC only.

## Exact audio pin

`georg-doc/kayfabizarro@d78fa862262184aa0ed172ed42e10db6e3705c71`

Runtime families:

- `Retro/coin.wav`
- `Retro/power_up.wav`
- `Retro/power_down.wav`
- Kenney Pizzicato / Steel jingles
- Match Three xylophone ladder 1–10
- Match Three synth ladder 1–10

## Interaction

Tap/click the 3D Boxels. Checkpoint and Cascade advance through ten-step tone sequences and wrap after MAX.

The VFX is a small squash/stretch + particle burst. No gameplay consequence is implied.
