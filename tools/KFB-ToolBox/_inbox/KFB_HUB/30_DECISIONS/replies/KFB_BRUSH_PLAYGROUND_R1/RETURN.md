# KFB Brush Playground R1 · Return / additive checkpoint
2026-10-21 · DESIGN PERSISTED · NOT IMPLEMENTED · NOT DEPLOYED

## Exact owner / repository
- Owner: existing KFB ToolBox / asset-authoring intake via WS0; proposed product does not create new 3D or animation runtime owner.
- Repo: georg-doc/kayfabizarro
- Branch: planning/kfb-brush-playground-r1-2026-10-21
- Branch base main: c746a9567e0ea20a24b8969fe9130ac0756e7a7e
- Draft PR: none opened.
- Implementation document: PRODUCT_AND_REMOTION_PLAN_R1.md in same folder.
- Recorded implementation checkpoint: 4dafce81868d320d1287c7255936429e37448f0d; exact file GitHub readback confirmed (blob a76003c772adec69c7b5d824c43ce1658802f875, 7829 chars). Final verified branch head must be fetched after this Return write.

## What is actually established
- User approved full browser paint editor concept: three example Procreate brush simulations, real drawing/PNG export, later optional Comic (Re)Motion bridge.
- Added Dropbox catalog source /DEV BRUSHES: shared-link metadata verified (folder, public audience, editable access, downloads allowed). Exactly 100 immediate entries obtained from first page, has_more=true, so count incomplete. No mass fetch or file publication. Link is a source pointer only and its edit access must not be embedded into browser app.
- Source comparison: p5.brush/standalone WebGL2/no p5 runtime and MIT donation; no visual proof. Three sample Procreate archives only private uploads.
- Explicit optional stroke replay/frame exporter for existing Comic (Re)Motion owner; no assumed remotion.dev dependency.
- Data rights: no uploads of original commercial brush files or derived texture tips into public GitHub or distributed web bundles.

## Checks and remaining gates
- GitHub document: 1/1 exact readback confirmed at first checkpoint.
- Dropbox: 1 link metadata lookup; 1 page of 100 entries, incomplete; no exhaustive scan.
- Brush archive presence: 3 user-uploaded references, no public distributable source.
- Build/tests 0; source-isolated original-brush renders 0; browser tests 0; device checks 0; animation renders 0; Site/Stage 0; merge 0.
- No modification of KFB Hub/router because no newly accepted product route, P0 gate, or canonical URL changed.
- Open: confirm ToolBox and comic animation exact owning modules/SSOT, privacy/proprietary brush extraction limits, p5.brush fidelity, on-device pressure/tilt behavior.
- **Only next gate:** WS0 identifies receiving owner/modules and approves a tiny private CRAYONIC→draw/undo/PNG vertical slice with actual visual parity tests, followed later by catalog/animation phases.

## Additive R1.1 verification · 2026-10-21
- User-added private `GvW_Comic_Ink_Brushes_02.brushset` checked as ZIP: 21,637,576 bytes; 213 members; 21 active `Brush.archive`, 21 matching Reset archives, 21 active Shape images, 1 active Grain image, brushset.plist; 21 active archive headers verify binary plist signature.
- Connected Dropbox metadata read for historical `Georg's Procreate MEGAPACK Brushes & Swatches  In Order`, shared folder; no listing/pagination, no assumed item count, no uploads.
- PLAN R1.1 additive update GitHub commit `82070a8df5f111394743e476428aafb756240350`, exact branch HEAD and updated file content readback verified. No public assets, no canonical Hub route changes.
- Tests actually run for addition: 1 ZIP format check, 1 ZIP inventory, 21/21 binary-plist signature inspections, 1 Dropbox shared-link lookup, 1 GitHub exact content verification. Runtime/renderer/brush import implementation, browser/device/Comic Motion tests = 0.
- Next gate UNCHANGED: WS0 selects existing receiving owner and approves private CRAYONIC draw/undo/PNG implementation with original-tip isolation; then brushset importer and multi-source provenance catalog; Comic (Re)Motion later.

## Additive R1.2 · Notion inventory, 2026-10-21
- Read via connected Notion: Knowledge Base, historical MegaPack Wiki and 3 exact database schemas (Brushes, Sets, Swatches), plus a legacy GeorgBrush.clubX page. Notion = editorial / metadata authority; Dropbox = binary source; georgbrush.club = existing public shop/brand owner. These are source discoveries, no bulk DB row export, no current 2,000 record verification.
- Plan updated @6e3ee5c85f77394f40c83839a03cd63044101ec2, exact GitHub readback PASS. Prior 2020 pack counts and price are historical only, do not advertise them as current.
- Existing brand/site untouched; no Notion write, no storefront modification, no brush binary copied, no Site/Stage. Browser/editor/Comic Motion tests 0.
- Next gate remains WS0 receiver plus private CRAYONIC draw/undo/PNG visual-proof slice, including one Notion brush→set→private source identity check.

## R1.4 · 2026-10-21 · Editor source candidate
Added prototype/index.html (local brush shape import, pointer drawing, undo/redo, PNG export), and TEST_REPORT_R1.md. GitHub source readback verified. Actual browser and private-brush runtime checks: 0. Current code is an unaccepted prototype; no public release or brush binaries. Next: existing ToolBox owner runs real isolated CRAYONIC import, stroke, undo and PNG browser tests, and fixes documented limitations before any user acceptance.

## R1.5 · 2026-10-21 · Claude Code workshop · local CRAYONIC editor tested
- Mode BOUNDED_SLICE · implementation + browser test. Base `7a1e73ecb07bcbacd0518499a52aabb6373abc74`; implementation commit and final head are named in the checkpoint line below.
- Result: **local MVP candidate, all automated checks PASS** (unit 28/0, Chromium 17/0). Not "Procreate parity", not accepted by Georg yet, not public, no PR, no merge, no deployment.
- Delivered: private local `.brush` import with in-browser `Brush.archive` decode; original Shape rendering with source isolation; pressure, tilt, speed, rotation, scatter, spacing, taper and glaze simulation from decoded values (editable, labelled HEURISTIC); color, size, opacity, eraser; deterministic undo/redo/clear; transparent and paper PNG export; comparison against each file's own Procreate preview stroke.
- Fidelity truth: CRAYONIC silhouette IoU 0.867 / mean α 0.472 vs 0.484, texture flatter because Procreate's built-in charcoal grain is not in the file (labelled substitute). PASTEL holdout ~30 % too light. ACRYLOID's bristle look (rolling grain) is not simulated.
- Protection kept: no brush binaries, shapes, grains, thumbnails or isolation screenshots in Git (private evidence in `~/kfb-ws1/brush-evidence-private/run6/`); ToolBox and animation owners untouched; no second runtime, Site, branding, georgbrush.club or Notion change.
- Files: `prototype/index.html`, `prototype/brush-core.js`, `prototype/vendor/fflate-0.8.3.umd.js` + `FFLATE_LICENSE.txt`, `prototype/tests/unit.mjs`, `prototype/tests/browser.mjs`, `prototype/README.md`, `evidence/*` (5 public-safe files), `TEST_REPORT_R1.md` (R1.5), `CHANGELOG.md` (new, additive), this Return.
- Open: Safari/iPad + Apple Pencil on hardware; Georg draws with CRAYONIC and judges against Procreate; real grain (Georg-supplied grain image or approved substitute); `.brushset`, catalog, Notion and Comic (Re)Motion stay deferred.
- **One next gate:** Georg opens `prototype/index.html` locally (double-click), imports `The_CRAYONIC (1).brush`, draws with mouse and ideally iPad/Pencil, and returns PASS / TUNE / FAIL on the CRAYONIC look against Procreate.
- Checkpoint: implementation + evidence commit `0d2affcb81c76d3d46b3a1d407d026379d8f06c5`, pushed and read back via `git ls-remote` (branch head matched). This line is a follow-up docs commit; the final head is reported in chat.

## R1.6 · 2026-10-21 · .brushset, Procreate 5 curves, grain replace, sessions · moved to tools/brush-playground
- Georg on R1.5: “funktioniert schon sehr gut, auch die Speed-Sensitivität ist gut”; drawn strokes and export may stay in the repo; “gerne weiter”, everything persisted on GitHub, and “nicht so tief ablegen”.
- **New location:** `tools/brush-playground/` (editor, core, vendor, tests, public evidence, README). Planning docs (this Return, plan, test report, changelog) stay here because briefs route here.
- Georg placed his private brushes (5 × `.brush`, `GvW_Comic_Ink_Brushes_02.brushset`) plus one PDF in `Demo Brushes/` in this folder. They are **not committed** (public repo; brief protection rule); a local `.gitignore` here protects them. Moving them to `tools/brush-playground/brushes/` was blocked by the session's permission guard, so Georg moves the folder himself (Finder) or approves the move. Tests find both places.
- Georg also gave a Dropbox shared link for the brushset; it carries a share key and is therefore **not written into this public repo** (kept locally).
- Result: unit 37/0, Chromium 24/0. Real set imports 21/21 in ~2 s with name and order; median silhouette IoU over the set 0.864, median abs opacity error 0.032. Weak brushes and the DRUCKER 2.1 grain seam are listed in TEST_REPORT_R1.md R1.6.
- No PR, merge, deployment, Site, Notion or georgbrush.club change. ToolBox and animation ownership unchanged.
- **One next gate:** Georg opens `tools/brush-playground/index.html`, imports the Comic Ink set, draws with 3–4 favourite brushes (ideally iPad/Pencil) and names which ones feel wrong; those become the next fidelity seams.
- Checkpoint: R1.6 implementation commit `846d638e953283aec1e53fc300dec5e63a917efe`, pushed and verified with `git ls-remote`; this line is a follow-up docs commit.

## R1.7 · 2026-10-21 · Procreate-style interface (blueprint, KFB skin) + palettes
- Georg: brushes may move to `brushes/` (done: `tools/brush-playground/brushes/`, git-ignored, incl. the PDF he had placed there); UI as close to Procreate as possible but as a blueprint, settings after Procreate's menus and palettes.
- Delivered: Procreate layout (canvas, Actions, Paint/Erase/Colour, size/opacity sidebar with eyedropper, Brush Library with previews, Brush Studio with Procreate's 12 sections and status labels per control, drawing pad, colour Disc/Value/Palettes, `.swatches` import/export) in KFB design-system colours with own icons. Code split into engine.js / ui.js / index.html.
- Result: unit 41/0, Chromium 31/0. Not checked: iPad/Pencil hardware, Safari, a real Procreate `.swatches` export.
- No PR, merge, deployment, Site, Notion or georgbrush.club change.
- **One next gate:** Georg opens `tools/brush-playground/index.html`, uses Library → Studio → Colour like in Procreate and names what feels wrong or missing (layers are the obvious next candidate).
- Checkpoint: R1.7 implementation commit `86d1a600f651733782e976610d40f8f7155fbeb2`, pushed and verified with `git ls-remote`; this line is a follow-up docs commit.

## R1.8 · 2026-10-22 · Layers
- Georg: “ja, mach mit Ebenen weiter”.
- Delivered: up to 16 layers + background colour, Procreate-style Layers panel (thumbnail, name, blend letter, visibility; opacity, 16 blend modes, alpha lock, up/down, duplicate, merge down, clear, delete), every layer action undoable, copy-on-write checkpoints, blend modes computed against the paper, layered PNG/session export (`session/2`, `session/1` still loads).
- Result: unit 41/0, Chromium 37/0 (6 new layer tests). No PR, merge, deployment, Site, Notion or georgbrush.club change.
- **One next gate:** Georg draws a small comic panel with ink on one layer and colour (Multiply) on another and says what is missing compared to his Procreate routine (candidates: clipping mask, reference layer, drag reorder, selection/transform).
