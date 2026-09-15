# KFB Asset Librarian · Fresh Chat Onboarding

**Date:** 2026-09-15  
**Status:** CURRENT REENTRY / RECOVERY BRIEF. Not a new Registry or consumer SSOT.  
**Permanent product URL:** https://kayfabizarro.pages.dev/asset-librarian/

## One sentence

Recover from the already-merged **Asset Librarian v1.7** state, close its documentation/deploy evidence first, then continue only against a concrete Town/production need. Do **not** rebuild v1.6/v1.7 and do not turn browse categories into new Registry truth.

## Read first

1. `skills/chat/RECOVERY_PATH.md`
2. `tools/asset_registry/librarian/POSTMORTEM_CHAT_BREAK_2026-09-15.md`
3. this file
4. current `tools/asset_registry/librarian/index.html` + `app.js`
5. `asset-types.js` and `town-workbench.js` only when the next task touches browse classification or Town candidate assembly
6. current GitHub `main`, recent Asset Librarian commits and the latest Browser Smoke before making version/status claims

Do not start by reading all historical Librarian documentation front to back.

## Current implementation truth to verify, not rebuild

The recovered merge before the postmortem is:

`3f6e8dcc5d00ff642488f7e5e1c76cd6ad052f84`  
`Merge Asset Librarian v1.7 browse and filter pass`

At that implementation state:

- v1.6 Town Workbench is already merged;
- Town workbench exposes Environment, KayKit Character and same-collection Character Prop candidate lanes plus a local `kfb.town-scene-candidate.v1` Scene Plan;
- KayKit local/shared external motions can be auditioned on the selected character through that character's own Three.js mixer;
- binding coverage is measured and zero-track binding fails closed;
- GothGirl had a documented real-browser case with `Death_A` binding **69/69** tracks;
- v1.7 adds Primary Assets vs All Representations, paging / Show more, multiselect Type + Format filters, type badges and representation dedupe;
- v1.7 browsing types are **presentation heuristics**, not new Registry semantics;
- Asset Registry / Production Resource Registry and consumer owners remain authoritative;
- Town output remains `candidate-only`;
- Animation Lab owns final motion/attachment compatibility.

The v1.7 browser regression run recovered by the lead review is GitHub Actions run `34919321337`: SUCCESS across the retained v1/v1.3/v1.4/v1.5/v1.6 gates plus v1.7 browse/filter smoke.

## The actual chat-break edge

The code is ahead of the documentation. At recovery time:

- visible `index.html` / `app.js` are v1.7;
- `README.md` still describes v1.6;
- `CHANGELOG.md` stops at v1.6;
- `BUILD_MANIFEST.json` still says `1.6-town-workbench`;
- `RETURN.md` is older still.

**First task:** reconcile those documents with the already-merged implementation and current evidence. This is bookkeeping against source truth, not a feature rebuild.

Then verify the permanent Cloudflare product URL against the current main build and report deployment separately from browser CI. The old GitHub Pages job is not the deployment authority for this product.

## Current Town consumer context

Town's public cursor is `skills/chat/town/SESSION_CARD.md` S001 r022 plus the accepted `references/TOWN_S001_R017_R022_PUBLIC_DELTA.md` and explicitly named post-r022 inputs.

Useful current needs include:

- natural Travel terrain and scenery candidate assembly;
- KayKit characters and their exact source refs;
- same-collection props;
- motion audition/casting for concrete roles;
- showstage / ring / city / nature / vehicle candidates as needed by a named scene;
- Birthday Character Select work, including GothGirl/KayKit motion casting;
- D6 Birthday Radio audio discovery now that the source package is on `main`.

Do **not** respond to this by inventing a larger semantic taxonomy. Use the existing search, Type/Format browse heuristics, pack/path facts and Town candidate handoff first. Add a new workbench filter/lane only when a concrete task cannot be served cleanly by the current surface.

## Birthday Radio source package · IMPLEMENTATION

The six selected VOLE.wtf / Tom Kincaid recordings were imported successfully to `main` in commit:

`c2d6cf2b0c64a5a090bb96cb4b826c875dd52786` · `assets: import VOLE CC0 birthday radio`

Repository path:

`media/3D_Assets/Audio/Music/Birthday Radio - VOLE CC0/`

D6 mapping:

1. Jazz Trio
2. Church Organ
3. Reggae
4. Drum’n’Bass
5. 8-bit
6. Death Metal

The package contains the six MP3 files plus `README.md` and `MANIFEST.json`. The manifest records source URLs, byte sizes and SHA-256 hashes. The source page states the recordings are CC0/public domain and identifies Tom Kincaid as the audio creator.

**TESTED RESULT:** the one-shot GitHub Actions import run `34929626545` completed successfully and the resulting files were confirmed present in the repository. The temporary importer has been removed after the successful import.

**NOT YET TESTED:** whether the generated Registry → Live path has already indexed all six new audio files. The fresh Librarian chat should check that before adding any hardcoded UI. Do not hardcode the six files merely to make them appear.

## Ownership boundaries

- **Registry/indexer:** source facts and generated indexes.
- **Asset Librarian:** read-only discovery, preview, browse/workbench grouping and candidate handoff.
- **Town:** composition/design intent and later runtime consumption.
- **Animation Lab / ToolBox:** final actor, rig, motion, attachment and compatibility validation.
- **Travel / Stunt / Combat:** their own runtime suitability, physics and integration.

A successful Librarian preview is evidence for that preview path only. It is not automatic integration acceptance.

## Work style for this fresh chat

Bundle routine fixes. Do not ask Georg for separate approval for README, changelog, manifest and Return reconciliation when all changes merely describe already-tested code.

After documentation/deploy closure, take **one concrete next production slice**. Prefer a small complete user workflow over another broad classification pass.

Every return should distinguish:

- DECISION
- IMPLEMENTATION
- TESTED RESULT
- PUBLIC DEPLOYMENT
- GEORG ACCEPTANCE
- OPEN / UNRESOLVED

Do not collapse these into one `done` status.

## Suggested first return

Return one concise report with:

1. current main SHA;
2. reconciled visible version and docs;
3. browser smoke evidence actually checked;
4. permanent Cloudflare URL result actually checked;
5. whether the six Birthday Radio assets are visible through Registry → Live yet;
6. one proposed next Librarian slice tied to the current Town/Birthday workflow.

## Start prompt for a new chat

> Read `tools/asset_registry/librarian/ONBOARDING_FRESH_CHAT_2026-09-15.md` and its linked postmortem/recovery docs. Verify current `main` before acting. Do not rebuild v1.6/v1.7. First reconcile README, CHANGELOG, BUILD_MANIFEST and RETURN with the already-merged v1.7 source/test state and separately verify the permanent Cloudflare URL. Then verify whether the six imported Birthday Radio tracks are present through Registry → Live; do not hardcode them into Librarian source merely to make them appear. Preserve Registry and consumer ownership. After that, continue only with one concrete Town/Birthday production need; do not start another broad taxonomy pass.
