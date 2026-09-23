# REJECTED OUTPUT / FAILURE RECOVERY · 2026-09-23

## Human verdict

**REJECTED · HARD FAIL**

The current Claude Design result is not an acceptable refinement of Theatre Curtain v1.

## Visible evidence from Georg's screenshot

The shown candidate visibly contains:

- a flat framed curtain presentation;
- repeated 2D-looking vertical stripe/fold bands;
- slider-driven `openPercent`;
- UI text stating:
  `Ziehen simuliert eine unsichtbare Kordel — keine Kordel-/Tassel-Geometrie.`

It does **not** visibly reproduce the proven donor's:

- physical two-panel cloth behaviour;
- real 3D fold response;
- Verlet/inertia motion;
- rail/ring motion relationship;
- physical open/close gathering.

## Rule violated

`skills/session-entry-use-what-works_v1.md`

Relevant rules:

- Rule 1: working build beats theory;
- Rule 2: reimplementation is a new procedure;
- Rule 3: output must visibly prove the source;
- Rule 4: do not keep patching the wrong version;
- Rule 6: source behaviour/output must reappear.

The Core-v2 brief also explicitly said:

> Do not rebuild it as CSS, SVG, a video, a flat plane or a second cloth engine.

## Recovery decision

**Do not repair this Claude candidate.**

It is discarded as a source lineage.

The next Claude attempt must begin from:

`chat/gds-theatre-curtain-v1-2026-09-20`

specifically:

`game-ready/theatre-curtain-v1/runtime/kfb-theatre-curtain.mjs`

## Recovery sequence

### R0 · exact donor only

No design work.

Show the exact existing v1 curtain running unchanged.

Acceptance:
- physical two-panel cloth visible;
- folds move physically;
- open/close gathers the real cloth;
- rail/rings visible;
- one existing fabric shown;
- donor runtime snapshot/behaviour is present.

### R1 · human donor confirmation

Georg confirms:

> Yes, this is the actual working v1 curtain.

Without this sentence/decision, stop.

### R2 · one visual delta only

After R1 choose **one**:
- cartoon rod/hardware; or
- side-pull/tieback choreography; or
- crease artifact repair.

Do not modify all three at once.

### R3 · compare source vs refined

Show:
- exact donor;
- refined version;
- same camera/pose/state.

State one visible difference.

## Explicitly banned until donor gate passes

- SVG
- CSS cloth
- Canvas 2D cloth
- flat geometry substitute
- new curtain engine
- new opening system
- invisible-cord mock
- generic theatre mockup

## Preserve candidate

The rejected Claude candidate may remain in Claude project history only as **failure evidence**.

It must never become a donor or implementation source.
