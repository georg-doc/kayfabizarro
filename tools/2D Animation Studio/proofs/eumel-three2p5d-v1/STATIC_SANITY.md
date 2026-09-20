# Eumel three2p5d v1 · Static Sanity · 2026-09-20

Status: **TESTED RESULT · STATIC ONLY**

PASS:
- shared SVG→texture renderer module parses;
- Eumel three2p5d adapter parses;
- proof app parses with top-level await/module wrapper;
- neutral bind JSON parses;
- adapter resolves the shared renderer path;
- proof page resolves the shared EyeRig2D script path;
- proof app references the source-exact Eumel component SVG;
- proof app references the measured neutral-bind JSON.

Pinned source inputs:
- EUMEL_SOURCE_COMPONENTS.svg blob: `457bca8a76bd156ba627763098f0dcfc9a54edc1`
- neutral_bind_pose.json blob: `3f080dc26b74e3f2b9ae6283aff18a26347a0782`

## What the implementation now attempts

- rasterize selected source-exact SVG groups without editing source paths;
- mount them as z-layered Three.js planes;
- use measured neutral leg hip anchors/rest corrections;
- put the source shadow onto a world-space ground plane;
- support upright-yaw-billboard and world-facing-upright;
- drive local neutral/idle/look/walk/hop presentation;
- reuse the shared EyeRig semantic adapter on Three.js wrapper groups.

## Still NOT_TESTED

- actual browser SVG rasterization;
- texture alpha/crop correctness;
- neutral-bind visual fidelity;
- hip attachment under animation;
- ground-shadow read;
- yaw billboard feel;
- dispose/leak behavior;
- mobile/split-screen;
- Cloudflare publication;
- Georg visual acceptance.

Next gate: real browser load of the neutral proof page.
