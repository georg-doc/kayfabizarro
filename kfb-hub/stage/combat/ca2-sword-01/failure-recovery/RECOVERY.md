# CA2-SWORD-01 · Cloudflare publication failure recovery

Status: **PUBLIC PROOF FAILED ×2 · CANDIDATE PRESERVED · HUMAN VISUAL GATE BLOCKED**  
Date: 2026-09-22

## Scope

This recovery concerns only publication / public browser verification of the already implemented CA2-SWORD-01 visual gate.

It does **not** invalidate the Combat implementation.

Implementation owner remains:

- repo: `georg-doc/KFB-Combat-Arena`
- PR: #7
- branch: `chatgpt-web/ca2-04-melee-vfx-sfx-2026-09-20`
- tested implementation head: `c04f0fffeb8cd90b48d70a2787c9ef1ca75ee725`
- implementation CI: **98/98 PASS**
- portable build: **234 files**
- re-home: **172 preserved / 66 verified / routes PASS**

## Preserved public candidate

Expected human route:

`https://kayfabizarro.pages.dev/kfb-hub/stage/combat/ca2-sword-01/`

Stage source exists in `georg-doc/kayfabizarro`:

- `kfb-hub/stage/combat/ca2-sword-01/index.html`
- `kfb-hub/stage/combat/ca2-sword-01/SOURCE.json`

The wrapper is deliberately thin. It imports the exact tested Combat runtime from:

`https://cdn.jsdelivr.net/gh/georg-doc/KFB-Combat-Arena@c04f0fffeb8cd90b48d70a2787c9ef1ca75ee725/slices/ca2-melee-lab/lab.mjs`

No second Combat runtime owner was created.

Publication branch at the two public proof attempts:

`cloudflare-live@aded73787d96b2a540cd928006b33d2b95cfca4e`

The exact Stage index, SOURCE marker and Hub link are present on that branch.

## Public proof attempt 1

GitHub Actions:

- run: `35672704030`
- attempt: 1
- job: `106572514291`
- conclusion: **FAIL**
- artifact: `10672111627`
- artifact digest: `sha256:88ac37958f69941f08da4509e17286241d70a42e51201c60b2e2afd458f09611`

Observed:

- request to `.../ca2-sword-01/SOURCE.json`
- HTTP: **200**
- expected: JSON marker with `id = CA2-SWORD-01-VIS`
- actual: KFB Hub fallback HTML beginning with `<!-- KFB H...`
- parser error:
  `SyntaxError: Unexpected token '<' ... is not valid JSON`

Because the marker failed before application boot, no Sword screenshots or runtime snapshot were claimed.

## Public proof attempt 2

The failed job was rerun once on the **same publication head**, with no implementation or Stage code changes.

GitHub Actions:

- run: `35672704030`
- attempt: 2
- job: `106573050384`
- conclusion: **FAIL**
- artifact: `10671063958`
- artifact digest: `sha256:6f9acb36520341b3cb6e2a73a88e500fb2b2f7cacb564edd4b19624bcd4c27d7`

Observed result is identical:

- `SOURCE.json` HTTP **200**
- body is Hub fallback HTML rather than the pinned JSON marker
- same `Unexpected token '<'` JSON parse failure
- application boot not reached
- no visual/public PASS claimed

## Evidence boundary

What is proven:

- CA2-SWORD-01 implementation is repository/CI green.
- the exact Stage source files exist on `main`;
- the same exact Stage files exist on `cloudflare-live`;
- the public child route does **not** currently expose the expected SOURCE marker;
- two independent public browser attempts reproduce the same fallback behavior.

What is **not** proven:

- that the public Sword-01 route is live;
- that the public route boots WebGL;
- Blade mount quality;
- body clearance in the rendered public candidate;
- strike readability;
- Georg human acceptance.

## Failure classification

`CLOUDFLARE_CHILD_ROUTE_FALLBACK · PUBLICATION_BOUNDARY_UNKNOWN`

The available evidence does not justify guessing whether the remaining fault is deployment propagation, route configuration, Cloudflare project state, or another publication-layer rule.

Do not repair the Combat runtime to address this failure.

## Stop rule

This gate has failed twice.

Per KFB two-pass rule:

- **STOP**
- preserve this candidate;
- do not attempt a third publication repair in this slice;
- do not replace the route with GitHub Pages, githack, raw CDN or ChatGPT Sites;
- do not call the route live/public-verified.

## Salvage

Everything below remains valid and reusable:

- exact Skeleton Warrior source;
- exact Skeleton Blade source;
- real Rig_Medium 1H attack clip;
- non-overlap spacing;
- swept contact;
- AttackLedger;
- Orbit/Fight diagnostic;
- Stage wrapper source;
- public QA workflow and artifacts.

## Exactly one next gate

**CA2-SWORD-01-PUB-F1 · publication observability only**

When the publication lane is reopened, inspect the Cloudflare publication/router state for this exact child route and marker **before** any new Combat or Stage rendering changes.

Expected first proof:

> `https://kayfabizarro.pages.dev/kfb-hub/stage/combat/ca2-sword-01/SOURCE.json` returns the pinned JSON marker rather than Hub fallback HTML.

Only after that marker passes should the existing browser QA be rerun.

Human visual gate remains:

> exact Blade mount + non-overlap + readable real 1H strike.

No merge. No Live promotion.
