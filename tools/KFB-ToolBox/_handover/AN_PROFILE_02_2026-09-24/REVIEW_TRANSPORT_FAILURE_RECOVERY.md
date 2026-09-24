# AN-PROFILE-02 · Chat Review Transport Failure Recovery

Date: 2026-09-24  
Status: **DC-BASED CHAT TRANSPORT FROZEN · ARCHIVED_FAILED_CANDIDATE · PLAIN THREE.JS REVIEW IS THE SMALLER NEXT GATE**

## Scope

This recovery record concerns only the **Chat HTML review transport**.

The AN-PROFILE-02 product/runtime implementation remains separate and previously passed its repository/browser integration suite. No product/runtime rollback is implied by this review-transport failure.

## Attempt 1 · wrapper around exact `.dc.html`

Artifact:
`AN_PROFILE_02_REVIEW.html`

Approach:
- fetch exact CI-tested `KFB Animation Lab v3.dc.html`;
- put it into an iframe `srcdoc`;
- preserve the exact runtime revision.

Human observation:
**FAIL** — Georg saw raw placeholders / variables such as the DC template bindings instead of a rendered UI.

Observed interpretation:
the proprietary DC runtime did not render the `x-dc` template in the Chat attachment transport.

## Attempt 2 · inline the exact DC runtime

Artifact:
`AN_PROFILE_02_REVIEW_v2.html`

Approach:
- fetch the same exact `.dc.html`;
- fetch exact sibling `support.js`;
- inline that runtime before mounting the same source.

Human observation:
**FAIL** — Chat reported: `In der Visualisierung ist ein Fehler aufgetreten`.

What is proven:
- the second transport still fails in the Chat artifact visualization surface.

What is **not** proven:
- the exact internal sandbox/CSP/eval/blob/import mechanism that caused the visualization failure.

Likely incompatibility is recorded only as a hypothesis because the DC runtime uses dynamic runtime behavior that is not needed for the product itself.

## Stop rule

This is the second failed repair pass on the same DC-based Chat review transport.

Therefore:
- do not attempt a third DC-wrapper variation;
- preserve these two attempts as failed transport candidates;
- do not reinterpret their failure as an Animation Studio runtime failure.

## Smaller recovery gate

Use a **purpose-built plain Three.js review surface** that consumes the real sources directly:

- real `Mannequin_Medium.glb` / `Mannequin_Large.glb` from the same KayKit source lineage used by Animation Lab v3;
- real 33-clip KFB Motion Library GLBs from AN-PROFILE-01 / PR #197;
- real `kfb.motion-catalog.v1`;
- real `kfb.motion-profile-catalog/1.0`;
- ordinary DOM controls + Three.js only;
- no `x-dc`, `{{...}}`, DC compiler, React wrapper, fallback actor, proxy animation or copied motion metadata.

Current source:
`tools/KFB-ToolBox/stage-first/review/an-profile-02-review.html`

This review page is a **review adapter**, not a second ToolBox runtime or Animation Studio owner.

## Acceptance proof for the smaller gate

Browser smoke must prove:
1. real WebGL canvas renders;
2. Medium loads 33/33 real clips;
3. Large loads 33/33 real clips;
4. measured Data is visible;
5. Large foot contacts remain `UNKNOWN_NOT_MEASURED`;
6. `kfb_climb_to_top_a` exposes `endsOnTop @ 1`;
7. no page errors;
8. no failed source/module requests.

Only after that proof should the plain review HTML be handed to Georg.
