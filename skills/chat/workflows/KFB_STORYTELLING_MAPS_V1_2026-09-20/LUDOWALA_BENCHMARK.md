# Benchmark · Ludo Wala → KFB Storytelling Maps

Status: **CURRENT REFERENCE · CONCEPT/UX BENCHMARK ONLY**
Reviewed: 2026-09-20
Source: `https://ludowala.app/`

No code, branding or proprietary assets are copied.

## Publicly observable/product claims reviewed

The current public site describes:

- classic Ludo rebuilt in full 3D;
- dynamic light and shadow;
- physically animated die that tumbles, bounces and settles;
- drag-to-orbit and pinch/scroll zoom;
- wide-screen classic table view;
- upright-phone view closer to top-down;
- touch-first responsive HUD;
- theatrical "toy shelf" actions whose spectacle does not alter canonical token positions;
- most small sounds synthesized with WebAudio, with recorded sounds reserved for a few signature events;
- boards/worlds as swappable presentation layers.

The public page was used as benchmark evidence. No reverse-engineering of private implementation is claimed.

## What matters for KFB

### 1. The board is the scene

The strongest lesson is not "make a 3D board". It is:

> treat the board as a physical place the camera can inhabit.

For KFB:
- maps are surfaces with thickness/shadow;
- 2D images become shallow 3D story objects;
- dice and standees have weight;
- FrizzleBob can literally walk across the information space.

### 2. Semantic state and spectacle are separate

Ludo Wala explicitly describes theatrical strikes that throw pieces around and then restore them to their logical squares.

KFB should generalize this:

```text
semantic anchor
  stays true

presentation transform
  may hop / fly / wobble / topple temporarily

recovery
  returns to semantic truth unless the story beat changes it
```

This is ideal for:
- satirical impacts;
- cards blown aside and restored;
- dice collisions;
- exaggerated map transitions;
- chapter-specific spectacle that must not corrupt authored story state.

### 3. Responsive cinematography beats responsive chrome

Portrait and landscape should not merely rearrange buttons.

KFB camera adaptation:

```text
LANDSCAPE
wide oblique table
lateral routes
side-by-side standees
more environmental context

PORTRAIT
higher elevation / more top-down
one focal standee
fewer labels
vertical composition
compact drawer controls
```

### 4. Tactility from a few systems

Immersion can come from a constrained set:

- actual depth;
- contact shadows;
- die physics;
- small board-contact sound;
- focused camera;
- short impact reaction;
- clear recovery.

This is preferable to permanent particles and UI motion.

### 5. Eye candy needs lulls

KFB adds a stronger editorial rhythm than a board game:

```text
quiet establish
→ one surprising motion
→ contact / punch
→ short follow-through
→ visual silence
→ narration / reframe
```

A 2–3 minute cut-scene needs contrast between noisy and calm passages.

## KFB camera shot bank

Initial shot families for experimentation:

1. **Table Establish** — full board, slow settling orbit.
2. **Atlas Top** — readable near-top-down map.
3. **Route Chase** — camera follows guide along a path.
4. **Standee Reveal** — shallow push as card rises from base.
5. **Card Face** — close enough to read media, with physical frame visible.
6. **Die Follow** — short tracking shot during throw; cut before dizziness.
7. **Impact Reaction** — low 3/4 around die/standee contact.
8. **Pullback Joke** — reveal wider absurd board context.
9. **Lull Hold** — static/near-static composition during narration.
10. **Chapter Bridge** — map slides/explodes/recombines under one stable camera target.

All durations and angles are starting hypotheses, not canon.

## KFB 2D-collage architecture

A collage should be constructed as staged planes:

```text
map surface y=0
route / graphic overlays y≈small
background image plane y≈small
standee cards / cutouts y>surface
guide actor true 3D
atmospheric VFX above contact plane
```

Use enough depth for:
- parallax;
- occlusion;
- contact shadow;
- camera passage.

Do not turn every image into a thick extruded object.

## Do not copy

- Ludo Wala board layout;
- branded toy shelf;
- named weapon set;
- art;
- UI styling;
- proprietary world/board assets;
- exact camera choreography from any trailer.

We take interaction principles and physical-tabletop thinking only.
