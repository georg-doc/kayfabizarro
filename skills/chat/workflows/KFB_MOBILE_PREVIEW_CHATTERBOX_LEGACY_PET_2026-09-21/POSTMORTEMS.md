# KFB Mobile Preview / Toy Form · additive postmortems

Do not rewrite old failures. Append a dated entry when a visible result teaches a reusable rule.

## 2026-09-21 · Form-slop pre-mortem / recurring failure pattern

Observed user problem: generated KFB props and landmarks repeatedly drift toward hard 90-degree edges, thin components and excessive small geometry. The result may be technically valid but stops reading as a coherent toy/clay world.

### Failure pattern

- realistic object decomposition is mistaken for identity;
- bevels are treated as tiny cleanup instead of visible mass;
- every real architectural feature becomes a mesh part;
- thin rods / lattice survive even when unreadable at map/mobile distance;
- material polish is attempted before silhouette is right;
- low-poly becomes faceted/hard rather than chunky/soft.

### Corrective rule

When the first read is wrong, repair in this order:
1. delete secondary parts;
2. enlarge major masses;
3. increase visible corner radius;
4. thicken supports;
5. restore only one missing iconic feature;
6. only then tune material.

Do not solve a massing failure with texture, AO, UI framing or more geometry.

### Guardrail

A technically green build can still fail the visual gate. Current City Grotesque and accepted landmark work remain valid donors; this Toy/Clay language is an additive candidate until visually accepted.


## 2026-09-21 · Eye Actor Studio · stale debug-state browser race

### Observed

EAS-0 run `35557045766` passed the whole desktop EyeRig/Clay path but mobile reported:
`four clay lids 0`.

### Cause

The Studio had already completed the synchronous mode rebuild and set DOM mode/ready to `clay`, while the browser test immediately read `window.__KFB_EYE_ACTOR_STUDIO__` before the next animation frame republished the diagnostic object.

This was an observability race. It was not evidence that Clay geometry disappeared on mobile.

### Repair

Wait on the actual published diagnostic state:
- `mode === clay`;
- `clayLidCount === 4`.

No geometry or runtime behavior changed.

### Result

Run `35557143481`:
**20/20 static · 5/5 syntax · 24/24 browser PASS**.

### Reusable rule

A DOM ready marker and a frame-published diagnostic object are two different clocks. Browser evidence must wait for the state it intends to assert, not a nearby earlier marker.
