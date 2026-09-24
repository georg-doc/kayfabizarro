# TB05-DELTA-01 answer + ToolBox Source-Safe 01 route · Coworker (Opus 5.5) · 2026-09-23

Technical note for chats. Georg gets the plain-language summary in the Coworker chat.

## 1 · Packet gap: the Georg-accepted functional baseline was not pinned

`TOOLBOX_SOURCE_SAFE_INTEGRATION_01.md` pins the Stage-First **Concept** (42,850 B static mockup, visual donor)
and **Studio v18** (642,417 B, roster source). It does not mention:

`/CLAUDE/KFB ToolBox v0.5/KFB-ToolBox/stage-first/src/KFB ToolBox Stage-First v1.dc.html` (673,039 B,
sha256 `08f9108a6a2a556d0e1e2e34ce564842062a4fdd77a80fb1020a8e723b688fba`)

= Studio-v18 logic fork on the WS0 source tree + Stage-First shell (one header, stage = surface, context palette,
Actor popover Browse→Preview→Accept/Revert). `stage-first/CHANGELOG.stage-first.md`:
**2026-09-16 · GEORG ACCEPTANCE: ACCEPTED FOR WORKING BASELINE** (no final-look claim; `Pose → Props → Stage` not started).
Roster measured 35 (`roster.length === 35`) in Sprint 01 Slice A.

Decision (use what works, packet §13 owners unchanged): Source-Safe 01 builds **on this accepted baseline**,
aligns its shell to the Concept (Body · Face · Motion · Voice · Messen + Actor ▾ + Stage ▾), and adds only
the packet's missing seams (Messen/R2 edit-layer, Stage ▾ Resident presets, Driver-Graft default, pets 1.2.9 state,
scene-patch Save/Reload). No second roster, no rebuilt Studio logic.

## 2 · TB05-DELTA-01 · what the v0.5 export actually changed

Diff `stage-first/src` (current, 90 files) vs `_handover/EXPORT_STAGE_FIRST_V1_2026-09-17/.../src` (91 files):

| File | 09-17 export | current | Change |
|---|---|---|---|
| `KFB ToolBox Stage-First v1.dc.html` | 671,783 | 673,039 | 17 `@font-face` URLs `main` → commit `eabc8725…` + one comment |
| `KFB FrankenStein Studio v18.dc.html` | 641,161 | 642,417 | same font pinning |
| `frizzlegraft-v1/ears.v2.js` | 9,583 | 10,492 | `FB_URL` local copy → pinned repo `FrizzleBob_Yellow.gltf` (blob `e0a757ec…`) |
| `frizzlegraft-v1/headgraft.v1.js` | 21,088 | 21,997 | same |
| `petstudio-v9/assets/models/FrizzleBob_Yellow.gltf` | present | removed | local copy dropped (no longer loaded) |

= exactly **Sprint 01 Slice A (portability pinning, 2026-09-18)**, each change documented in-code with a RÜCKWEG.
No functional/runtime logic change. Full per-file sha256: `STAGE_FIRST_SRC_MANIFEST_2026-09-23.json`.
The packet's Studio v18 content-hash (`b87457d6…`) is this pinned 642,417 B file.

Open from Sprint 01 (unchanged): Slice A remaining `main` URLs (12 paths, `PROMOTION_MANIFEST.json#openPins`);
Slice B promotion into `tools/KFB-ToolBox/stage-first/`; Slice C browser candidate; Slice D functional gate.

## 3 · Delivery constraint (why GitHub write is now the unlock)

The sheet is a dc-runtime document (`support.js`) that loads ~40 ES modules via `import()` relative to
`window.__KFB_MODBASE`. ES modules need HTTP (no `file://`), and `raw.githubusercontent` serves `text/plain`
(rejected for module scripts). `__KFB_MODBASE` was designed as the standalone anchor ("Repo/Serve-URL").

Zero-install review path:
1. promote the lean `stage-first/src` tree to `tools/KFB-ToolBox/stage-first/src/` (Slice B, ~3.4 MB, 90 files);
2. review HTML = one file (sheet + inlined `support.js`) with `__KFB_MODBASE =
   https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@<commit>/tools/KFB-ToolBox/stage-first/src/petstudio-v9/`
   (jsDelivr serves correct MIME, pinned by commit — pattern already used by `media/3D_Assets/kfb-pets.js`);
3. Coworker then tests in Georg's real Chrome (Claude-in-Chrome) before handing it over.

Blocker: Coworker's GitHub integration returns `403 Resource not accessible by integration` on
`POST /git/refs`, `POST /git/trees`, `PUT /contents` (same finding as ToolBox CHANGELOG 2026-09-15).
Either Georg grants the Claude GitHub App `Contents: Read and write` on `kayfabizarro`, or Web pushes step 1.

## 4 · Build order after the tree is on GitHub (internal, not Georg gates)

1. Boot current v1 via jsDelivr anchor in Chrome, record console/resource errors (Slice C).
2. Shell → Concept alignment (Body · Face · Motion · Voice · Messen; Stage ▾; Actor ▾ incl. 11 residents + 24 base pets + saved 1.2.9).
3. Default actor = `graft-driver` via `mountGraft()` (PR #185 blobs `a84b2c92` / `f202a1c2`).
4. Messen = R2 `edit-layer.js` (`c97b3537`), host adapter over the Stage root; persistence `kfb.scene-patch.v1` (pos/rot/scale).
5. Stage ▾ = neutral · Goth Girl · Orc Warband · Animatronic from Resident Atlas @ `10f661a5`
   (Goth seat +0.319; Animatronic guitar relation; Orc: show failure if attachments do not resolve — no eyeballing).
6. Save → Reload → continue editing; fail-closed on missing sources.
7. Chrome run of the §16 ten-step flow, then ONE review artifact to Georg.
