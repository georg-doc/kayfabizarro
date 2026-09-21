# KFB Eye Actor Studio v1 · Eyelid Geometry Contract v1

**Status:** CURRENT CORRECTION CONTRACT · MUST PASS BEFORE FURTHER EYE-STUDIO VISUAL WORK  
**Date:** 2026-09-21  
**Owner:** KFB ToolBox / Eye Actor Studio  
**User direction:** eyelids are actors and must read as real volumetric cartoon/clay forms.

## 1. What an eyelid is

An eyelid is **not**:
- a tube;
- a line;
- an eyebrow-like stroke;
- a flat sticker;
- a thin spherical shell barely offset from the eyeball;
- a decorative ring around the eye.

An eyelid **is** a volumetric 3D mass that sits over the eyeball and physically occludes it.

Each eye has four independently controllable eyelid actors across the pair:
- left upper;
- left lower;
- right upper;
- right lower.

For 3–4-eye clusters, each Eye Slot may own its own upper/lower pair.

## 2. Required visual read

Think of a clay/cartoon eyelid as a soft piece of material wrapped over the eyeball:

- the **outside** is thick, rounded and soft;
- the **inside/back surface** follows the eyeball closely;
- the **visible eye-facing margin** creates a clear, harder occlusion edge;
- the lid has visible side/end mass at the canthi;
- the eyeball disappears naturally behind the lid.

Shorthand:

> **outside soft · inside crisp · real volume · real occlusion**

The lid should read like a thick clay flap/cap sliding over the sphere, not like a painted stripe.

## 3. Geometry model

For each eyelid, build a closed volumetric patch in Eye Slot local space.

### 3.1 Inner surface
The inner surface conforms to the eyeball/ellipsoid with a small clearance:
- no z-fighting;
- no gap large enough to look detached;
- no pupil or sclera visible through the lid.

### 3.2 Outer surface
The outer surface is offset outward from the eye along the local surface normal.

Thickness is intentional and visible.

It may vary:
- thicker through the central body;
- softly tapered toward the left/right canthi;
- never collapsed to zero except where explicitly designed.

### 3.3 Margin / occlusion edge
The opening edge is the defining eyelid boundary.

It must:
- be continuous;
- be visibly firmer/crisper than the outer clay surface;
- remain attached to the volumetric body;
- naturally occlude eyeball/pupil geometry through depth, not through a fake drawn line.

### 3.4 Side walls / end caps
The volume must close around the margin/canthi.

No open shell edges.
No paper-thin cross section.

## 4. Opening curve

The visible opening is controlled by the eyelid margin curve, not by scaling a tube.

Per upper/lower lid:
- `open` / `cover`
- `thickness`
- `roundness`
- `slant`
- `curve` = concave ↔ convex
- `bulge`
- `pinch` / canthus shaping
- optional local offset

### Slant
Tilts the opening edge.

### Concave / convex
Changes the **shape of the opening boundary** while preserving lid volume.

This must not flatten the entire eyelid or turn it into a ribbon.

## 5. Blink / closure

Blinking is a movement of the volumetric lid over the eyeball.

It is **not**:
- scaling the lid flat;
- moving a stroke across the eye;
- drawing a line.

During closure:
- upper and lower lid margins sweep across the eyeball;
- their body volume follows;
- pupil/sclera disappear behind them;
- at full closure the margins meet or overlap slightly;
- the result reads as a real closed clay/cartoon eye seam.

Upper and lower lids remain independently controllable.

## 6. Pupil and eyeball relation

The pupil may have its own volume.

Hard rule:
- pupil/iris geometry must remain behind the eyelid margin;
- no pupil poking through lids;
- no brow/eyelid intersections;
- gaze must stay local to the Eye Slot's 3D orientation.

Depth/occlusion should solve this naturally.

## 7. Eye Slot transform

Pitch/Yaw/Roll, position and W/H/D apply to the **entire Eye Actor**:
- eyeball;
- pupil;
- upper lid;
- lower lid;
- optional brow anchor.

The eyelid geometry stays correct for:
- frontal eyes;
- frog-like side eyes;
- strongly rolled/slanted eyes;
- asymmetric eye sizes;
- 1–4 eye clusters.

## 8. Material/color inheritance

Default lid material source:

**face > body > main color**

Lids belong visually to the face unless explicitly overridden.

For textured hosts:
- same material family as face;
- same texture scale / texel density;
- same orientation logic where possible;
- no independent random lid texture.

Brows follow the same default inheritance family.

## 9. Debug views

The Studio must provide a geometry debug that can independently show:

1. eyeball;
2. pupil;
3. upper lid volume;
4. lower lid volume;
5. inner conforming surface;
6. outer clay surface;
7. occlusion margin;
8. side/end caps.

Useful debug states:
- natural material;
- material zones;
- translucent lid volume;
- margin edge emphasis;
- pupil/lid collision;
- UV/texel check.

## 10. Minimum acceptance fixtures

Before any Hunky/Dory or ears work:

### Fixture A · frontal pair
- neutral;
- half blink;
- full blink;
- skeptical asymmetry.

### Fixture B · asymmetric eyes
- different eye sizes;
- lids preserve correct thickness on both.

### Fixture C · frog-side eyes
- ±60–90° yaw;
- lids remain volumetric and attached;
- no wedge/ribbon illusion.

### Fixture D · three/four eyes
- each slot owns valid upper/lower lid volume;
- selected-eye blink works.

### Fixture E · concave / convex
- same eye;
- same lid thickness;
- only opening-boundary curvature changes.

## 11. Explicitly rejected implementations

### REJECTED · GPT mobile software-2D fallback
The 2026-09-21 mobile-safe Canvas fallback drew eye/lid approximations instead of rendering the real 3D system.

It is not Eye Actor Studio evidence and must not be reused.

### REJECTED · tube/stroke lids
Any eyelid rendered as a tube, line, capsule stroke or brow-like curve is outside this contract.

### REJECTED · nearly-flat shell lids as the Clay target
The old EyeRig sphere-shell behavior remains useful as a behavior donor/reference, but it is not the Claymation lid visual target.

## 12. Build order from here

1. exact real 3D host in viewer;
2. exact eyeball/pupil;
3. one upper volumetric lid only;
4. prove outer thickness + inner conforming surface + crisp margin;
5. add lower lid;
6. prove closure;
7. add slant;
8. add concave/convex margin;
9. prove asymmetry;
10. prove frog orientation;
11. only then restore 3–4-eye cluster controls.

Do not rebuild the full Studio UI before the single-eye volumetric lid proof is visually correct.

## 13. Human gate

The first human question is only:

> **Does one upper eyelid read as a real thick clay/cartoon mass covering the eyeball, with a soft rounded outside and a crisp eye-facing occlusion edge?**

Nothing else advances until that is yes.


## 14. User visual reference · Upper Lid · 2026-09-21

The user supplied a visual reference in the current chat showing the intended **upper eyelid construction**.

This reference overrides any prior interpretation that produced tubes, strokes, thin shell rims or decorative arcs.

### Reference read

The upper lid is one **closed, thick, rounded cap/block of soft facial material** sitting over the upper part of the eyeball.

The key shape logic is:

1. **One continuous outer mass**
   - full 3D volume;
   - broad rounded top/front surface;
   - rounded left/right side mass;
   - visibly thicker than a shell.

2. **One lower opening boundary**
   - the visible lid edge is simply where this volume ends and the eyeball becomes visible;
   - it is **not** a second tube, spline, ridge or outline object;
   - it may be horizontal, slanted, concave or convex.

3. **The boundary cuts through a thick mass**
   - changing slant/curve changes the lower contour;
   - it must not collapse the upper mass into a ribbon;
   - thickness above the opening remains obvious.

4. **Real occlusion**
   - the lid body sits in front of the eyeball;
   - sclera/pupil disappear behind the lid through normal depth;
   - no painted masking trick.

5. **Rounded clay/cartoon exterior**
   - exterior edges are softened;
   - top corners and side transitions are broad and rounded;
   - the form should read as molded/clay facial tissue, not hard-surface geometry.

### Correct mental model

Do **not** think:
`sphere + line`

Do **not** think:
`sphere + thin spherical shell`

Think:

`eyeball behind a thick rounded facial cap whose lower cutout defines the eye opening`

### Parameterization implied by the reference

For the first upper-lid proof, expose only:

- `cover` — vertical amount of eyeball covered;
- `slant` — angle of lower opening edge;
- `curve` — concave ↔ flat ↔ convex opening edge;
- `thickness` — depth/body thickness of the lid mass;
- `roundness` — softness of outer cap corners;
- `bulge` — central outward fullness.

Do not add more controls until this six-parameter model visually matches the reference.

### First build target

One real 3D eyeball.
One upper lid only.

Required views:
- front;
- 3/4;
- side.

Required variants:
- neutral/open;
- more covered;
- slanted;
- concave;
- convex.

No lower lid, brow, multi-eye cluster, emanata, ears or character-specific styling in this proof.

### Human acceptance question

> **Does this look like the same construction principle as the supplied reference: one thick, rounded upper-lid mass whose lower edge defines the eye opening?**
