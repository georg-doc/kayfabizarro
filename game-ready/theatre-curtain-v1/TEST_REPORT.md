# KFB Theatre Curtain v1 · TEST REPORT

**Date:** 2026-09-20  
**Owner:** KFB Game Dev Studio  
**Branch:** `chat/gds-theatre-curtain-v1-2026-09-20`  
**Draft PR:** #114

## Tested source

Runtime implementation checkpoint:
`4e2de202f82b0f0d7dfa3241d6f0416a84eb15d0`

Deterministic test-wait repair:
`3bdfdd2e9de648871102d91c89612a5b7ee3c4ab`

Pinned Three.js donor:
`7300402f96c23bfa2174ffc0da01fb4e277d33da`
→ `examples/webgpu_compute_cloth.html`
→ blob `0b3c18d87ac0d2428e6a558b6d09889e425dd537`

## Final automated evidence

Workflow run:
`35479125591`

### Local browser proof

Job:
`105993572063`

Result:
**22/22 PASS**

Covered:

1. HTTP 200
2. bench ready
3. no bench error
4. CPU Verlet/WebGL fallback active
5. two curtain panels
6. 14 visible attachment rings
7. exact default `velour_velvet` fabric
8. exact implementation/donor pins
9. module API seam
10. canvas mounted
11. opening reaches full side gather
12. open-rest state
13. impact applied
14. real `rough_linen` switch
15. closing returns openProgress to 0
16. closed-wind state
17. reset returns closed idle
18. reset progress 0
19. isolated donor route HTTP 200
20. donor commit pin visible
21. no failed main resources
22. no page/console errors

Artifact:
`10595067437`

Digest:
`sha256:9ea22f1e7c72e5c6b7e355e145497b80db483c9f45857654dcead97d20b2df23`

### Public Cloudflare browser proof

Job:
`105993698226`

Exact route:
`https://kayfabizarro.pages.dev/kfb-hub/stage/game-dev-studio/theatre-curtain-v1/`

Result:
**25/25 PASS**

Additional public checks include:

- exact `curtain-v1-2026-09-20-r1` deployment marker;
- carried local 22/22 evidence;
- public Stage HTTP 200;
- exact donor pin;
- real `hessian_230` fabric switch;
- open/impact/close/reset executed on the public route;
- isolated public donor route HTTP 200;
- zero failed public resources;
- zero public browser errors.

Artifact:
`10594504795`

Digest:
`sha256:35909487ab9e8eb805801d3a5a71b92dfb0a7ec0dcdbc8f5434a23f435ad1e88`

## Preserved failed evidence

Earlier run:
`35476179739`

Local job:
`105985699864`

Observed failure:

`openProgress` had already reached `0`, but the proof used a fixed 350 ms wait and then required `state === 'closed-wind'`. On that runner the state was still correctly `closing`.

This did **not** establish a runtime/cloth failure.

Repair:

- replaced the fixed 350 ms delay with a deterministic wait for `state === 'closed-wind'`;
- commit `3bdfdd2e9de648871102d91c89612a5b7ee3c4ab`;
- no curtain runtime/material/physics code changed.

The unchanged curtain runtime then passed both local and public browser gates.

## What automation does not prove

Automation does not approve:

- visual weight;
- fold quality;
- theatrical gathering;
- perceived gravity;
- idle-wind taste;
- red/fabric choice;
- impact feel;
- suitability for a specific consumer scene.

Those remain the human gate.

## Exactly one next gate

Georg reviews the isolated curtain on the fixed public Stage and decides whether the cloth look/physics are a suitable foundation before any aging, tieback/swag, card-breach/dissolve or consumer integration work.
