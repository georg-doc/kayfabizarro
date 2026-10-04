# WSA REBRIEF · MVP 1 / WorldBuilder recovery · 2026-10-04

Status: **BINDING RECOVERY OVERRIDE**
Execution mode: **ONE_SHOT PRODUCT RECOVERY**
Owner: **KFB WorldBuilder / WB2**
Repo: `georg-doc/kayfabizarro`
Draft PR: **#348**
Branch: `chatgpt-web/wb2-convergence-golden-corridor-01-2026-10-04`
Current observed branch head at rebrief: `565fff80bda7fe39fbed1f3589adaeb3325dda6c`
Frozen runtime evidence head: `4334151bfbf230d33ad459f61cc0da595c1191a2`
Frozen failure export head: `282e05e8f66a117a12165d9169cbc16de0e8fb7e`

## 0 · Product mandate

Stop treating the autonomous browser journey harness as the product.

The product mandate is:

> **Deliver a genuinely playable KFB WorldBuilder MVP 1 to Georg on one real Cloudflare Stage URL.**

MVP 1 means Georg can open it, enter the world, move the player, use the WorldBuilder/God Mode, manipulate/save/reload the world, walk to meaningful content, use the already-proven Drive/Taxi seam where functional, and inspect the source-clean four-island world.

The complete scripted Golden Journey remains an acceptance target, but **failure of the automation to navigate to an entity is not allowed to suppress delivery of an otherwise playable product**.

No Combat benchmark, no model comparison, no new platformer scope, no new audio showcase work until this recovery has a playable MVP 1 review surface.

## 1 · Exact failure analysis

### Error A · a harness failure was promoted to a product CORE blocker

The frozen failure export explicitly records:

- gate: `Driver key and real Ground Drive Ground transition`;
- latest failure: automation stopped near the taxi/Driver interaction;
- native nearest entity remained `town.driver` at 2.096835 m;
- the waypoint harness had accepted the last grid point `[-2,-22]`;
- diagnosis: endpoint tolerance + delayed native key release did not guarantee target identity.

Most important sentence already present in the frozen JSON:

> **"Test harness endpoint arrival failure; not proof the taxi runtime or bridge support failed."**

Therefore the failure classification was wrong.

The product did **not** prove "player cannot reach the taxi".
The test proved "the automated key-driving harness cannot reliably certify that it reached the intended interaction identity."

Those are different failures.

### Error B · prior real functional evidence was incorrectly subordinated to the latest harness regression

The failure recovery also records an earlier real browser proof:

- head `1876ba8746e3ddf836a22bb283a9720eaf23c4b0`;
- run `37196264077`;
- Ground → Drive → Ground = **PASS**;
- actual driven distance = **6.077702363804468 m**.

The later harness regression does not erase this.

Correct interpretation:

- Drive/Taxi seam has **prior functional evidence**;
- latest full-journey automation has **endpoint-arrival QA instability**;
- current product status is not "Drive broken" unless direct/manual/native reproduction proves that.

### Error C · the generic two-repair stop rule was applied at the wrong hierarchy

The External Critic contract says:

> after two non-improving passes on the same blocking seam: CORE blocker → freeze.

The mistake was not the existence of the stop rule.

The mistake was classifying a **test-driver / QA-observability seam** as a **CORE product seam** without independent product reproduction.

New binding interpretation for this recovery:

- two failed repairs of a **test harness** freeze that harness strategy;
- they do **not** freeze the game unless the same defect is reproduced in the product itself;
- only a confirmed player-visible/runtime blocker can freeze the whole product;
- when harness and product evidence disagree, preserve product evidence and replace/simplify the harness.

### Error D · the branch carried an explicit micro-slice instruction

`KFB_LOCO_WB2_PLAYER_01_BRIEF.md` says:

- "First checkpoint scope";
- explicitly excludes Jump / Drive / Residents / Combat / Curtain;
- then ends with:
  **"Exactly one next gate after PASS: WSA-RES-SET-01."**

That brief was valid as an internal implementation checkpoint before the later One-Shot override, but it remained on the receiving branch and directly encouraged a stop-and-handoff pattern.

It is now **historical internal evidence only**.

It must not be used as current execution authority.

### Error E · verification became larger than the product

The run accumulated:
- automated long-distance W/A/D route planning;
- waypoint crossing rules;
- key-release settling logic;
- nearest-entity assertions;
- full scripted journey automation;
- 61 planned source/detail/integrated captures;
- nine-dimension Whole-Game Critic;
- fresh-context journey import;
- extra musical-world/platformer showcase preparation.

These may be useful later.

They are not prerequisites for Georg to receive a **playable WorldBuilder MVP 1**.

The project spent effort making an autonomous QA robot traverse the world while Georg still had no public playable candidate.

That priority is reversed now.

### Error F · "no pseudo-human gates" was interpreted as "do not give Georg the product yet"

The purpose of no-pseudo-human-gates is to avoid asking Georg to approve technical diagnostics.

It does **not** mean withholding a meaningful playable milestone until every automation passes.

A real playable WorldBuilder MVP is exactly the kind of product milestone that warrants a human Stage.

## 2 · What is already KEEP

Do not rebuild these merely because the whole scripted journey did not pass:

- WB2 one world/renderer/edit/save owner;
- Town / Dystopia / Utopia / Protopia topology;
- Track Core graph / bridges / current road-support correction;
- source-clean replacement direction for the old Hürth/OSM visible foundation;
- current Player/Motion implementation;
- current source-clean world objects;
- Resident implementations already integrated on the branch;
- ChatterBox/Card implementation already integrated;
- Dystopia performance implementation already integrated;
- Utopia/Protopia implementation already integrated;
- Almanac/Lean Memory implementation already integrated;
- World Studio native GUI export/import/re-export proof;
- prior Ground→Drive→Ground proof;
- native loading/Enter path where already proven;
- current actual WorldBuilder edit/sculpt/save/import seams.

The current `ONE_SHOT_STATUS.json` already classifies many of these as IMPLEMENTED with full browser acceptance pending.

Treat "pending full acceptance" as exactly that. Do not delete/rebuild them.

## 3 · Immediate recovery objective

### MVP1-PLAYABLE-DELIVERY

Produce the smallest **representative integrated product**, not a diagnostic slice.

A human must be able to:

1. open the real Cloudflare Stage;
2. pass the real loading/Enter path;
3. control the Player in Town;
4. walk/run through actual source-clean world geometry;
5. interact with at least the first meaningful Resident/Clown;
6. enter WorldBuilder/God Mode;
7. select/place/edit one real source object;
8. perform one terrain sculpt/edit;
9. save/export;
10. reload or import and verify the edit remains;
11. optionally use the already-proven Taxi/Drive path if it remains functional in direct product testing;
12. freely explore rather than being held hostage by scripted bot navigation.

The four-island world must be visible and source-clean enough for product review.

This is a **playable WorldBuilder MVP**, not the final content-complete game.

## 4 · Recovery order

### R0 · recover current exact product state

Read current PR #348 head, Return, Recovery, Failure Recovery and `ONE_SHOT_STATUS.json`.

Classify current runtime facts:

- PRODUCT WORKS;
- PRODUCT DEFECT;
- HARNESS DEFECT;
- UNPROVEN;
- OPTIONAL.

Do not infer PRODUCT DEFECT from HARNESS DEFECT.

### R1 · boot and direct-control smoke

Use the actual product, not the scripted Golden Journey planner.

Prove only:
- boot/Enter;
- Player responds to direct input;
- ordinary Ground support works;
- camera works;
- no fatal browser error.

If available, use direct browser/manual-style input. Do not require the route planner.

### R2 · WorldBuilder/God Mode smoke

Prove the actual core authoring loop:
- Play ↔ Build/God Mode;
- select/place/edit real object;
- terrain edit;
- save/export;
- fresh reload/import;
- object + transform + sculpt preserved.

The existing 5/5 native Studio roundtrip is strong prior evidence. Reuse it; do not invent another editor.

### R3 · visual/source sanity

Confirm the old Hürth/OSM visible foundation is not back.

Use a **small representative visual/source audit**, not 61 captures:
- one Town overall view;
- one representative view of each satellite;
- one source-isolation proof for each currently visible defining family only if it has not already been proven.

Do not block Stage on exhaustive screenshot census.

### R4 · representative gameplay smoke

Test:
- first Resident/Clown interaction;
- one Card handoff;
- one optional Drive/Taxi handoff if direct product test works;
- one return to Ground.

If Taxi direct product use works but route automation cannot certify it, mark:
**PRODUCT PASS / AUTOMATED JOURNEY HARNESS HOLD**.

### R5 · publish MVP 1 Stage

When R1–R4 are product-usable and no fatal blocker exists:

publish the integrated candidate to:

`https://kayfabizarro.pages.dev/kfb-hub/stage/world-studio-mvp/`

Update KFB Hub in the same batch.
Open that exact URL and visibly verify the revision.

Then return it to Georg.

Do **not** wait for:
- full four-world scripted Golden Journey automation;
- all nine critic dimensions;
- 61 screenshots;
- full concert/dance completion;
- every Card courier beat;
- full CLI Studio gauntlet;
- autonomous bot traversal to every endpoint.

Those remain continuation QA/content gates after Georg has an actual product.

## 5 · Harness policy correction

The full Journey harness becomes **supplementary QA**.

It may:
- find regressions;
- measure deterministic flows;
- produce evidence.

It may not:
- become the movement owner;
- alter product semantics to make itself pass;
- classify its own navigation problem as proof the product is broken;
- block a meaningful human MVP Stage when core product interaction is directly usable.

If the route planner cannot reach an NPC after two repair attempts:

**freeze/quarantine the route planner method, not the WorldBuilder.**

A future harness may use:
- smaller local fixtures;
- deterministic state setup for QA only;
- direct isolated interaction tests;
- shorter representative paths;
provided it never fakes a product PASS.

## 6 · Scope freeze

Until MVP1-PLAYABLE-DELIVERY is PUBLIC_VERIFIED and handed to Georg:

**DO NOT ADD**
- Combat Platformer benchmark work;
- new Hex/Babel gameplay;
- Flight;
- new musical-world/platformer showcases;
- new Resident families;
- new meta-process;
- extra whole-game critic dimensions;
- new WorldBuilder architecture;
- new owner/runtime.

Use what is already implemented.

Fix only defects that prevent the playable WorldBuilder MVP.

## 7 · Stop condition correction

For this recovery, stop the entire product only if:

1. the actual product cannot boot;
2. direct human-style Player control is broken;
3. WorldBuilder edit/save/reload is broken and cannot be repaired in two product-level passes;
4. the visible source foundation has regressed to rejected legacy content;
5. a required current owner/source is genuinely missing;
6. publishing the current integrated product cannot be done without destructive owner replacement.

A failing full-journey bot, waypoint planner, endpoint classifier or screenshot census is **not** by itself a product stop condition.

## 8 · Required return

Do not return another "next internal step" proposal.

Return:
- exact repo / PR / branch / head;
- what is directly playable;
- what WorldBuilder operations work;
- direct Cloudflare Stage URL;
- public-browser verification;
- actual test counts;
- direct product screenshots;
- unresolved product defects;
- quarantined harness/automation defects;
- exactly one human gate:
  **Georg freeplays MVP 1 and reports product-level PASS / TUNE / FAIL.**

No auto-merge.
No Live promotion.
