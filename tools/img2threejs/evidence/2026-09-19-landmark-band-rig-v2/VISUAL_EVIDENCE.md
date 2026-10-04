# Visual Evidence · Landmark Band Rig v2 · 2026-09-19

**Evidence class:** CPU raster from exact generated production vertices + numerical host-face checks.  
**Not claimed:** WebGL/browser screenshot PASS.

## Failure reproduced

The previous Pilot-04 v1.2 socket rig was re-evaluated against the **actual rendered clock-stage triangles**, not only against its own abstract socket frame.

Measured v1.2 socket → intended rendered host-face distances in City Grotesque:

- front: **2.162 m**
- right: **3.784 m**
- back: **2.436 m**
- left: **3.457 m**

This explains Georg's screenshot: the clocks were rigid objects, but their sockets were not on the rendered host.

## Before / after

![Same source geometry and camera: v1.2 sockets vs Band Rig v2](before-after.jpg)

The image is a deterministic CPU raster from the exact generated vertices. It is **not** an AI image, design mockup or manually repositioned reconstruction.

Left: the old v1.2 socket implementation.  
Right: Band Rig v2, where `clock-stage` and all four `clock-*` parts share the same semantic affine transform.

## Multi-view visual review

Additional local evidence was rendered from the same current Band Rig v2 vertices in:

- front view;
- right view;
- oblique view;
- semantic-band debug colours.

These were inspected in-session. Front and side clock faces remain on their host faces.

The downloadable/chat evidence files are:

- `bandrig2_z_front.png`
- `bandrig2_z_right.png`
- `bandrig2_z_oblique.png`
- `bandrig2_bands.png`

Only the compact before/after JPEG is checked into GitHub to keep this evidence slice small.

## Numerical attachment proof

Source clock back-plane standoff from the source clock-stage is **0.080 m**.

Spasskaya · City Grotesque Band Rig v2:

- front: 0.071586 m
- right: 0.071586 m
- back: 0.071586 m
- left: 0.071586 m
- maximum deviation from the expected transformed standoff: **2.13e-15 m**

Spasskaya · Soft Cubist:

- approximately 0.084910 m on all four faces
- maximum transformed-standoff error: **1.31e-15 m**

Ground minimum remains **Y = 0**.

## Browser probe

A real Chromium/WebGL screenshot was attempted in the agent container. EGL/ANGLE initialization failed before a valid WebGL frame could be produced. That failure was not bypassed or renamed as a browser PASS.

Therefore:

- generated geometry proof: **PASS**
- CPU visual proof: **PASS**
- browser/WebGL proof in the agent environment: **OPEN**
- Georg visual acceptance: **OPEN**
