# POSTMORTEM · C0-A1 Charming Kitchen

**Status:** `ARCHIVED_FAILED_CANDIDATE`

## SOURCE / target

User direction:

Build Dungeon-Generator equivalents from all KayKit and Tiny Treats packs through the pipeline:

`analyze packs → 3D previews/sample builds → Asset Librarian → Game Development Studio → ToolBox/Builder/Generator`

C0-A1 selected **Tiny Treats Charming Kitchen 1.1** as the first end-to-end pack proof.

Pack source:

- Pack ID: `tiny-treats-charming-kitchen-1-1-free`
- Registry source commit: `378b209355b13304e3cff656ec0806ca5b89df28`
- 118 GLTF models + 5 PNG textures
- source license: **CC0-1.0**
- frozen product head: `a5a8fcfb25e2ec89ab4346a812870d5b18bf91e6`

## ATTEMPTS

| Attempt | Change | Expected | Actual | Evidence | Decision |
|---|---|---|---|---|---|
| Initial implementation | Module-kit sidecars + Librarian workbench + GDS candidate + Stage wrapper | Browser Pack Workbench loads | Browser module parse failed before workbench ready | Run 35460732052 / artifact 10588634538 | retain data model, reject browser state |
| Repair pass 1 | repaired module wiring / alias path and attempted newline cleanup | remove browser syntax failure | syntax error remained at `app.js` CDP line 6 / col 60 | Run 35461123803 / artifact 10589419759 | insufficient repair |
| Diagnostic | CDP `Runtime.exceptionThrown` instrumentation | locate exact parser source | proved `app.js` as failing script | Run 35461123803 | evidence only |
| Repair pass 2 | replaced four literal `\n` tokens with real line breaks | valid browser module parse | first error moved; second invalid string now at `app.js` CDP line 174 / col 96 | Run 35461231731 / artifact 10589564787 | STOP per two-pass rule |

## WORKING PARTS

### Pack analysis

**PROVEN / repository-native**

- 118/118 models classified.
- 0 unclassified.
- lanes:
  - Build 69
  - Furnish 26
  - Story 23
- structural and furnishing families are explicit.
- exact source path / commit / blob refs retained.
- dependencies remain Registry-backed.
- no model/texture copies in module-kit or package roots.

### Derived module contract

Reusable candidate files:

- `PACK_PROFILE.json`
- `MODULE_LIBRARY.json`
- `GENERATOR_PROFILE.json`
- three `SAMPLE_RECIPES/*.json`

These are derived builder semantics, not a replacement Registry.

### GDS metadata

Reusable as metadata only:

- `game-ready/module-kits/tiny-treats-charming-kitchen-1-1-free/GAME_ASSET_PACKAGE.json`
- CC0 license source pinned.
- source references pinned.
- sealed package receipt correctly remains `NOT_RUN`.

## FAILURE EVIDENCE

### Browser gate

Runs #5 and #6 never reached the first sample-build assertion.

Run #5:
- workflow: `35461123803`
- head: `46415c979bf2ef3be1f24508304aab917c73866b`
- artifact: `10589419759`
- Chromium exception:
  - URL: `/tools/asset_registry/librarian/app.js`
  - CDP line 6, column 60
  - `SyntaxError: Invalid or unexpected token`

Run #6:
- workflow: `35461231731`
- head: `a5a8fcfb25e2ec89ab4346a812870d5b18bf91e6`
- artifact: `10589564787`
- Chromium exception:
  - URL: `/tools/asset_registry/librarian/app.js`
  - CDP line 174, column 96
  - `SyntaxError: Invalid or unexpected token`

Source inspection at frozen head proves lines 175–176 contain a JS single-quoted string split by a literal line break:

```js
$('copyHandoff').onclick = async () => copyText(JSON.stringify(await buildHandoff(), null, 2) + '
');
```

## PROVEN CAUSES

### P1 · unsafe text replacement damaged JavaScript source

**PROVEN.**

A broad replacement intended to convert accidentally stored literal `\n` tokens into actual newlines also converted an intentional `'\n'` JavaScript string escape into a real newline inside a single-quoted string.

Result: browser module parser failure.

### P2 · patching via textual replacement was too broad

**PROVEN.**

The same file contained both:
- accidental literal escape tokens between statements; and
- an intentional newline escape inside a string.

A global replacement could not safely distinguish them.

## TEST-HARNESS GAP

The workflow's `node --check tools/asset_registry/librarian/app.js` step reported success on run #6 while Chromium proved the checked candidate contains an invalid browser module string.

That contradiction is retained as **UNKNOWN / HARNESS GAP**. Do not use that Node step as authoritative browser syntax proof until the checkout/step behavior is independently explained.

## HYPOTHESES

- There may be no additional browser syntax defects after the proven line-175 string defect; **not tested**.
- The three sample recipes may render correctly once the shell boots; **not tested**.
- Module connector geometry may or may not align; **not tested**.

These are not promoted to facts.

## LESSONS LEARNED

### 1 · Derived grammar before generator was correct

Error avoided: jumping directly into another generator.  
Rule: keep Module Library + sample recipe gate before generator.  
Early test: 118/118 classification + one six-part wall sample.

### 2 · Existing UI shell reuse was correct, but the integration patch was too large

Error: pack workbench, aliases, samples and GDS direct selection landed before the smallest browser seam was proven.  
Rule: first integrate one read-only module-kit panel with one sample.  
Early test: boot existing Librarian + six exact wall assets only.

### 3 · Never globally replace escape sequences in JS source

Error: intentional string escape became invalid source.  
Rule: edit exact statements or use parser-aware/surgical changes.  
Early test: browser-import the changed module immediately after the first source mutation.

### 4 · Node syntax is not the acceptance gate

Error: green Node step coexisted with real Chromium parse failure.  
Rule: browser module import is required for browser-facing JS.  
Early test: minimal Chromium boot before 3D/sample work.

## PUBLIC DEPLOYMENT

None.

The fixed target `https://kayfabizarro.pages.dev/kfb-hub/stage/c0-a1-charming-kitchen/` was source-prepared only and was **never publicly verified**.

## GEORG ACCEPTANCE

Not requested because the candidate did not reach a reviewable browser state.
