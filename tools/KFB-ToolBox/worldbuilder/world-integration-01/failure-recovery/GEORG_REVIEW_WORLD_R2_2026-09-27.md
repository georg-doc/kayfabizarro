# GEORG REVIEW · WORLD r2 · 2026-09-27

Status: **TUNE / PROCEED · CURRENT WORLD GATE CLOSED**

Reviewed surface:
https://kayfabizarro.pages.dev/kfb-hub/stage/world/world-r2/

Source runtime under review:
`58028b07d7618926c40ffaec3bd4053dc88c0efd`

Stage package PR:
`#234 · wsa/world-r2-stage-prep-2026-09-26`

## Georg result

The current World r2 visual/world direction is accepted far enough to continue.

This is intentionally **TUNE / PROCEED**, not exhaustive acceptance of movement, camera or final performance.

Do not hold the World pipeline for another presentation-only acceptance loop.

## Accepted now

- overall World r2 visual direction;
- current Hürth / Cologne world presentation as a continuation foundation;
- Edit/Play direction is sufficient to proceed;
- no architecture reset requested.

## Non-blocking global follow-up · shadow/contact artifacts

Recurring 3D shadow/contact artifacts remain visible across KFB scenes and should be handled as a **global rendering follow-up**, not as a blocker for this World gate.

Observed in Georg's 2026-09-27 screenshot:
- foreground rock/prop shows an uneven / clipped-looking ground-contact shadow rather than one clean continuous contact;
- similar historical symptoms occur on buildings, figures and props;
- roof/overhang areas can show bright leakage below the roof followed by striped/banded shadow artifacts near the lower edge.

Working label:
`GLOBAL-SHADOW-CONTACT-ARTIFACT-FIX`

Scope for that later owner:
- shadow-map clipping / bias / normal-bias / contact seam;
- caster/receiver grounding;
- near-ground and under-roof leakage/banding;
- solve once in the shared rendering/presentation owner where possible, not per prop/building.

Do **not** turn this into a blocking micro-slice before the next productive World integration.

## Deferred tuning · performance / controls / movement

Georg reports the current review surface feels sluggish/choppy enough that detailed judgment of the following is unreliable:
- Orbit camera zoom / rapid inspection;
- walking traversal speed;
- animation timing while moving;
- general responsiveness.

This may be machine-specific, review-surface-specific or implementation-related. It is **not classified as an architecture failure now**.

Defer the meaningful tuning judgment until:
- the WorldBuilder is available in a more representative/live integrated environment;
- movement can be experienced at normal production performance;
- Travel Mode is integrated enough to expose the real mobility experience.

If the same problems remain there, open a bounded performance/control tuning slice from measured evidence.

Working label:
`WORLD-PERF-CONTROLS-TUNING-LATER`

## Screenshot evidence

Chat attachment:
`Bildschirmfoto 2026-09-27 um 04.05.10.png`
Dimensions reported by the source attachment: **1766 × 862**.

The durable observation from the image is recorded above so this review does not depend on chat recovery.

## Production instruction

- continue quickly;
- no unnecessary Cloudflare/publication loop for this feedback;
- no new pseudo-review artifact;
- preserve the feedback in GitHub before proceeding;
- later tuning happens in the real integrated owner surface.

## Next productive gate

**WB-ZONE-SEAM-01**

Consume the proven baked Cologne World Zone through the current WorldBuilder host while preserving:
- WorldBuilder as local-world/editor/persistence owner;
- OSM City Lab / World Zone Bake as geographic + normalized/baked zone truth;
- Zone manifest ref + transform persistence;
- separate Landmark Modules;
- no runtime Overpass;
- no second world/runtime owner.

The global shadow follow-up and later performance/control tuning remain non-blocking parallel backlog items.
