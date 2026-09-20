# Asset Librarian · KayKit Bits Bundle 1 · reconciliation brief

Status: READY AFTER ASSET BRANCH REVIEW
Owner: the existing KFB Asset Librarian and Asset Registry
Package branch: `asset/kaykit-bits-bundle1-2026-09-20`
Package root: `media/3D_Assets/KayKit_Bits_Bundle1/`

## Outcome

Make the purchased KayKit Bits Bundle 1 easy to find and safe to consume without deleting, moving or silently replacing any existing FREE-pack asset.

The bundle contains six intact namespaces:

1. City Builder Bits
2. Furniture Bits
3. Halloween Bits
4. Prototype Bits
5. Restaurant Bits
6. Space Base Bits

The admitted browser/runtime package contains 628 GLTF files with all 628 paired BIN files, 3 GLB files, 20 canonical PNG textures, 22 JPG content/sample boards and the original CC0 license. FBX, OBJ, MTL, Blender/authoring content, URL shortcuts and duplicate export-folder textures are intentionally absent.

## Read first

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `media/3D_Assets/KayKit_Bits_Bundle1/_KFB_ADMISSION.json`
5. `media/3D_Assets/KayKit_Bits_Bundle1/License.txt`
6. the current Asset Librarian onboarding, registry schema and resource smoke tests

GitHub state overrides chat memory. Use the existing Librarian; do not create a second catalog or copy models into a new tool folder.

## Hard guardrails

- Do not delete or relocate bundle files in this slice.
- Do not deduplicate by filename, display name or visual guess.
- Exact duplicates require a content hash match and both source paths in the report.
- Similar names with different hashes are separate versions until a human chooses otherwise.
- Preserve the purchased bundle path as provenance even when an existing FREE asset is byte-identical.
- A working URL is not proof of a working asset: load representative real GLTF/GLB objects and their textures in the existing preview.
- Do not generate replacement thumbnails when the supplied content/sample boards or the real model preview already answer the question.

## Mini-sprints

Run these as separate branches/PR checkpoints if a web chat is doing the work.

### KBB-1 · Registry inventory

- Read the manifest and enumerate the six pack roots.
- Produce stable package IDs and model IDs from relative paths.
- Record format, paired BIN, texture dependencies, pack, subfolder and license.
- Return exact counts and any broken reference as `MISSING_ASSET`.

Gate: 628/628 GLTF buffer pairs resolve and all 3 GLBs load.

### KBB-2 · Duplicate report

- Compare content hashes against current KayKit FREE-package registry paths.
- Classify each candidate as `EXACT_DUPLICATE`, `RELATED_VERSION` or `NEW`.
- Keep both paths in the report; propose aliases only.
- No deletion, move or canonical switch.

Gate: human-readable report grouped by the six packs, with exact evidence for every proposed duplicate.

### KBB-3 · Human discovery

- Add aliases for “KayKit Bits Bundle 1”, “Bits Bundle”, and each of the six pack names.
- Add one direct bundle view and one filter per included pack.
- Make supplied JPG boards and representative real-model previews visible.
- Search results must show source pack and duplicate status without technical slug hunting.

Gate: desktop and mobile can reach every pack in at most two actions.

### KBB-4 · Consumer recipe bridge

- Export small read-only selections for City/road, furniture/interior, Halloween, prototype/character, restaurant and space-base use cases.
- Recipes contain registry IDs and source URLs; they do not copy binaries.
- Keep World/Race, Dungeon, Resident and ToolBox runtime ownership outside the Librarian.

Gate: one selected asset from each pack resolves in a consumer-neutral preview.

### KBB-5 · Promotion

- Run current registry, resource and browser smoke tests.
- Open the exact Cloudflare Librarian route and direct bundle view.
- Return branch, PR, exact head, registry revision, counts, screenshots/browser proof and unresolved duplicates.
- Ask one human gate: accept aliases/canonical suggestions, or keep both entries.

## Required return

- exact repo/branch/PR/head;
- registry and report files changed;
- admitted and discovered counts per pack;
- exact duplicate count and related-version count;
- real preview/resource test results;
- fixed Cloudflare URL linked from the KFB Hub;
- no-deletion statement;
- one next human gate.
