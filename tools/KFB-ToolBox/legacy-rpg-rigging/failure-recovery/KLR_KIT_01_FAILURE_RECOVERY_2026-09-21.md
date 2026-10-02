# KLR-KIT-01 · Failure Recovery Export

**Date:** 2026-09-21  
**Status:** ARCHIVED_FAILED_BROWSER_INTEGRATION_CANDIDATE · PURE CORE SALVAGEABLE  
**Owner:** KFB ToolBox / Rigging  
**Repo:** `georg-doc/kayfabizarro`  
**Working branch:** `chatgpt-web/toolbox-legacy-rpg-rigging-2026-09-21`  
**Frozen candidate branch:** `chatgpt-web/klr-kit-01-failed-2026-09-21`  
**Frozen candidate head:** `e3a06e3451637a8b447192113cab43f3ece84cd8`  
**Draft PR:** #155

## 1 · What KLR-KIT-01 attempted

One shared Legacy appearance/assembly Baukasten for:

- Combat Arena monsters/enemies;
- KFB WhackMan player/ghost presentation;
- later KFB games.

Shared candidate scope:

- strict `LegacyActorRecipe`;
- caller-owned seeded RNG;
- deterministic body/head/held-item selection;
- no gameplay fields;
- no `Math.random()`;
- existing Legacy assembly as the only actor construction path;
- small Seed → Recipe authoring surface in the existing Legacy Lab.

## 2 · Preserved source

Core candidate:

`tools/KFB-ToolBox/legacy-rpg-rigging/lib/legacy-actor-recipe.v1.js`

Schema:

`kfb.legacy-actor-recipe/0.1-candidate`

Authoring integration:

- `app.js`
- `index.html`
- `styles.css`

Tests:

- `tests/actor-recipe.test.mjs`
- `kit-proof.mjs`
- `.github/workflows/toolbox-legacy-actor-kit-test.yml`

Design/owner contract:

`docs/LEGACY_ACTOR_KIT_RANDOMIZER_KLR_KIT_01.md`

## 3 · Proven salvage

### Existing Legacy base remains proven separately

Exact tested base head:

`5b2fa78220ec4127c1b761c4d7f7a8304dfb11e9`

Evidence:

- KLR-SYNC-01: **41/41 PASS** · run `35550320886`;
- full Legacy browser/WebGL: **44/44 PASS** · run `35550320883`;
- 0 failed browser resources;
- 0 page/console errors.

The KLR-KIT failure does not invalidate those earlier tests.

### KLR-KIT pure/static core

Second KLR-KIT run:
`35551084074`

Contract phase passed completely:

- static/source suite: **33/33 PASS**;
- pure ActorRecipe suite: **16/16 PASS**;
- JS syntax: PASS.

The pure suite proves:

- manual recipe validation;
- exact source revision pinning;
- same seed → same recipe/key;
- multiple seeds → multiple recipes;
- strict body/head filters;
- strict weapon-family/tier filters;
- source props can participate when explicitly enabled;
- duplicate held item rejected by default;
- unknown ids/families fail closed;
- missing or out-of-range RNG fails closed;
- gameplay fields rejected;
- unknown top-level fields rejected;
- source revision tampering rejected;
- recipe key contains appearance/source identity only.

## 4 · Browser attempts

### Attempt 1

Run:
`35550795805`

Initial browser boot passed:

- HTTP;
- READY;
- randomizer UI exists;
- WebGL canvas.

Then the first seeded assembly never reached Ready within the timeout.

The proof did not yet expose the runtime error.

### Attempt 2

Run:
`35551084074`

The proof was narrowed to:

1. alternate head, no weapon: `gate-16`;
2. embedded/default head, no weapon: `gate-75`;
3. simple sword case: `gate-33`.

Initial source isolate settled successfully.

The first recipe failed immediately with:

```text
ASSEMBLY FAILED
$(...).forEach is not a function
```

Exact root cause in the frozen candidate:

`syncModeButtons()` contains:

```js
$('[data-mode]').forEach(...)
```

instead of the previously working:

```js
$$('[data-mode]').forEach(...)
```

## 5 · Proven cause

This regression was introduced while inserting `applyActorRecipe()`.

The code-edit operation used JavaScript `String.replace()` with a replacement string containing the existing `$$` selector helper. In replacement-string semantics, `$$` is interpreted as a literal single `$`.

Therefore the pre-existing working source:

`$$('[data-mode]')`

was accidentally rewritten to:

`$('[data-mode]')`.

This is a tooling/edit regression in KLR-KIT integration.

It is **not** evidence of:

- bad Legacy character sources;
- bad Mage Head C;
- bad Rig_Legacy assembly;
- bad randomizer determinism;
- bad Combat compatibility;
- bad WhackMan compatibility.

## 6 · Owner boundaries retained

Combat Arena current receiving evidence:

- PR #5 head `954f2db7484dc566e468e5ce89b0d95940d97537`;
- PR #7 head `6df5d4cd3b5e17bacb32438beac528a37c943bb0`.

Combat keeps MobBrain, movement, spawn, mixer lifecycle, hit/contact, damage, death and drops.

WhackMan has no GitHub runtime owner yet. Dropbox currently contains one concept/research input:

`/CLAUDE/KFB WhackMan/KFB WhackMan - Perplexity.md`

No Maze/Ghost/Player runtime is created by this failed candidate.

## 7 · Public state

No KLR-KIT runtime is published to Cloudflare.

The intended Legacy Stage remains **NOT PUBLIC_VERIFIED**.

## 8 · Exactly one next gate

**KLR-KIT-F1 · selector regression isolation**

Fresh bounded slice only.

Do not restore the multi-seed proof yet.

1. start from the frozen candidate;
2. restore only the selector helper seam so `syncModeButtons()` uses the collection helper;
3. run static contracts;
4. run exactly one browser recipe: `gate-16` (Knight + Rogue Head C, no held item);
5. require Ready + correct recipe/body/head identity + zero browser errors.

Only after KLR-KIT-F1 passes may the three-seed KLR-KIT browser matrix resume.
