# NEXT GATE · E1

Do not repair E1 again on the current slice.

## Fresh QA-only gate

Start from the frozen E1 implementation without changing editor behavior.

Target:

`tools/world_atlas/source/KayKit_Dungeon_Generator_S13_2.html?e1proof=1`

Proof contract already exists in the page:

- `document.documentElement.dataset.e1Proof` must become `pass`;
- `window.__E1_PROOF.ok === true`;
- before → expected delta is +0.1 X;
- rebuild → restored transform equals expected;
- exactly one detail edit is present in the patch.

## Minimal harness correction

Use one module system only.

Preferred:

```js
import fs from 'node:fs';
```

with the CDP script executed as ESM, or use CommonJS with all awaits inside an async IIFE.

Do not change editor source merely to make the harness convenient.

## Exit rule

If the fresh QA-only slice proves the existing self-test:
- E1 may become browser-proven second host;
- then and only then plan extraction of the common edit core.

If the application itself returns `data-e1-proof="fail"`:
- inspect that one runtime assertion;
- preserve the current candidate and return the observed application failure.

No Resident / Scene Builder / Environment / Platformer expansion before this gate.
