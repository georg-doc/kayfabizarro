# KFB Claude Coworker WS0 · Review HTML SOP

Purpose: token-light, zero-install human review without Cloudflare.

## Do not invent another review framework

Read on demand:

1. `skills/chat/workflows/KFB_WEB_FIRST_EXECUTION_V1_2026-09-22/REVIEW_TEMPLATE_POOL.md`
2. `skills/chat/workflows/KFB_WEB_FIRST_EXECUTION_V1_2026-09-22/review-templates/REGISTRY.json`
3. `skills/chat/workflows/KFB_WEB_FIRST_EXECUTION_V1_2026-09-22/LOCAL_PREVIEW_FIRST.md`

Default verified 3D harness:
`threejs-focus-review-v1`

Accepted source:
`georg-doc/KFB-Stunt-Car-Race`
PR #33
accepted harness origin:
`_handover/RACER_MVP_STABILIZATION_2026-09-23/TARCH-0/review/KFB_Racer_TARCH0_R1_review.html`

## Default use

Reuse the accepted harness and change only:
- title/source/scope;
- subject builder/data;
- camera presets;
- layer labels;
- gate-specific debug overlay;
- acceptance diagnostics.

Keep:
- compact panel grammar;
- camera interaction grammar;
- toggle grammar;
- responsive layout;
- source/status plaque.

## ChatGPT 3D texture host

Do not re-diagnose the known ChatGPT attachment texture issue.

Verified guidance currently lives on WorldBuilder PR #186:
branch:
`chatgpt-web/worldbuilder-toolbox-scene-authoring-2026-09-23`

verified head:
`e0a9327bcc6406ec3e093f57b14ec81569988406`

document:
`skills/chat/workflows/KFB_WEB_FIRST_EXECUTION_V1_2026-09-22/CHATGPT_HTML_TEXTURE_PREVIEW_LIMITATION_2026-09-23.md`

Human-verified review adapter:
`fetch → Blob → createImageBitmap → THREE.Texture`
with:
- `THREE.TextureLoader` fallback;
- `THREE.SRGBColorSpace`;
- `flipY = false` for glTF-style color maps;
- review-only cloned materials;
- exact donor map source shown in diagnostics.

This is a **review-host adapter**, not a product runtime mutation.

## Source-object rule

A loaded URL is not enough.

For identity-bearing assets:
1. show source object / donor set in isolation;
2. show exact source ref/path;
3. then show integration.

If the exact source fails:
show the failure.
Do not replace it with a primitive/sign/generic asset and call the review valid.

## Compound Resident / scene review

When a working compound donor exists, use the **whole donor set**.

Check:
- actor count;
- source identity;
- texture/material;
- pose;
- grounding;
- props;
- attachments;
- animation;
- save/export/reload where in scope.

Do not rebuild the set from prose merely to fit the review.

## Minimal status strip

Show only:
- review name;
- source head;
- current gate;
- PASS/FAIL/OPEN diagnostics required by the gate.

No dashboard ballast.

## Review artifact status

Before human review:
`HTML REVIEW · NOT PUBLIC`

After Georg accepts:
archive exact accepted artifact in the project owner repo with:
- source head;
- hash;
- acceptance note.

Do not add a harness to the shared pool unless Georg accepted the **review format itself** as reusable.

## No Cloudflare loop

Normal loop:
`GitHub checkpoint → Review HTML in chat → Georg → repair`

Cloudflare is deferred until a persistent/shared milestone is useful.

## Failure / timeout

Review HTML is presentation, not source truth.

On timeout:
- read branch head;
- verify source file;
- regenerate review only if needed.

After two failed repair passes on the same human gate:
stop and use failure recovery.
