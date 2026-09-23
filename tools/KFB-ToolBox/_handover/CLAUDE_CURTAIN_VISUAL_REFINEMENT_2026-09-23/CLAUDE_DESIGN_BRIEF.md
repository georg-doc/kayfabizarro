# Claude Design Brief · Theatre Curtain visual refinement

## Task

Refine the already-proven Theatre Curtain v1/Core v2 **visually only**.

Do not redesign the transition system or cloth simulation.

## Preserve

Keep the current donor's:
- two cloth panels;
- Verlet cloth foundation;
- constraints;
- weighted hem;
- wind;
- open/close state concept;
- four KFB fabric sets;
- module API/ownership.

## Design targets

### A · Cartoon support hardware

Redesign only the presentation of:
- top rod / rail;
- end caps;
- brackets;
- rings/hooks.

Desired style:
- chunky;
- rounded;
- simplified;
- toy-like;
- readable at normal game-camera distance;
- closer to KFB/KayKit proportions than realistic theatre engineering.

Avoid:
- thin realistic metal fittings;
- tiny hardware;
- ornate realism;
- generic gold-opera-house styling.

### B · Proper side-pull opening

The opening must read as a real theatrical side reveal:

`CLOSED → PULLING → SIDE-GATHER → TIED/SWAG → OPEN`

Visual goal:
- left panel sweeps left;
- right panel sweeps right;
- lower/mid cloth follows outward;
- centre opening grows cleanly;
- gathered mass ends near side/lower-third rather than only bunching along the top rail.

This is the missing choreography.

### C · Tieback / swag

Prepare a recognisable lower-third tieback state.

Possible visual mechanism:
- broad cord;
- simple tassel;
- chunky loop;
- stylized hook/peg.

The mechanism is explanatory, not simulation-heavy.

Do not make the curtain look permanently cinched when closed.

### D · Crease cleanup

Inspect strong gathering poses.

Current problem:
- unnatural straight/line-like creases can appear under strong bending/gathering.

Design intent:
- broad soft folds;
- fewer needle-thin lines;
- readable cloth mass;
- no texture trick hiding geometry defects.

### E · Fabric texture direction

Keep current fabrics for the first pass.

After geometry/motion is accepted, prepare optional later mood:
- older theatre textile;
- slightly worn;
- faded;
- patched;
- restrained holes/burn wear only as later surface detail.

Do not spend the first pass on distress texture.

## Required design views

Return:
1. CLOSED front/3/4 view;
2. MID-PULL;
3. FULL SIDE-GATHER / TIED;
4. hardware close-up;
5. silhouette comparison old vs refined;
6. one reduced-motion/open-state concept.

## Hard boundaries

Claude must not:
- replace the cloth engine;
- convert it to CSS/SVG/video;
- create a new renderer;
- own host loading/gameplay;
- start Race/Travel/Combat adapters;
- add giant loading UI;
- use burn holes to mask bad gathering.

## Human gate

Georg reviews only:
- cartoon hardware;
- side-pull readability;
- swag/tieback silhouette;
- cloth crease quality;
- whether it feels KFB rather than realistic theatre décor.

Only after approval should Web/Game Dev Studio implement the minimal donor-compatible geometry/motion changes.
