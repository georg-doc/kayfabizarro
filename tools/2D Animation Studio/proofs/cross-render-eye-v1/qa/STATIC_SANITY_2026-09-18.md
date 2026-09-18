# Cross-Render Eye Proof · Static Sanity · 2026-09-18

Status: **TESTED RESULT · STATIC ONLY**

Checks on branch `toolbox/cross-render-eye-proof-2026-09-18`:

- proof `app.js` parse: **PASS**
- shared `eye-sequence-runner.v1.js` parse: **PASS**
- shared `eye-rig-2d-adapter.v1.js` parse: **PASS**
- `eye-clips.v1.json` parse: **PASS**
- `PROOF_MANIFEST.json` parse: **PASS**
- modifier-atlas manifest parse: **PASS**
- exact sequence equals:
  `neutral → blink → look_left → look_right → surprised → thinking → neutral`: **PASS**
- 3D manifest actor declares `Rig_Medium`, 23 joints: **PASS**
- 2D manifest pins the accepted Illustrator-source blob: **PASS**

Pinned implementation blobs at this check:

- proof app: `224567ff7cd3a4669358bb3e489ee1ca90cca951`
- sequence runner: `68ef2545350893c3bbe8f5a9b671bb0b1e7fc554`
- 2D adapter: `efdb170652fdef18b2c2f4a1942669139d0891a6`
- shared clips: `8f374d444f521e4c7320b70aa5853daa86f6bf79`

## Evidence boundary

This does **not** prove:

- Cloudflare route availability;
- Three.js/Graft network imports at runtime;
- visible 2D/3D synchronization;
- eyeFrame debug markers in both renderers;
- Georg visual acceptance.

Those remain browser gates.
