# TEST REPORT · World Atlas Inline Detail Editor E1 · 2026-09-20

Status: **20/20 STATIC / CONTRACT PASS · BROWSER PROOF HARNESS-BLOCKED**

Repository: `georg-doc/kayfabizarro`  
Branch: `world-atlas/inline-detail-editor-e1-2026-09-20`

## What changed

Only:

`tools/world_atlas/source/KayKit_Dungeon_Generator_S13_2.html`

No change to:
- `source/lib/dungeon-grid.js`;
- `source/lib/kit-lab.js`;
- the Asset Registry;
- Travel / Race / Combat;
- generator topology, BSP, seams, floors, walls, corners or stairs.

## Actual checks

**20/20 PASS**

1. TransformControls importmap present.
2. TransformControls module import present.
3. Editor UI button present.
4. Object-attached menu present.
5. Detail-patch panel present.
6. Editable contract limited to `torch` / `candle`.
7. Structural generator-ownership note present in source.
8. Translation snap = 0.1.
9. Rotation snap = 15°.
10. OrbitControls disabled during gizmo drag.
11. Local scratch namespace present.
12. Patch schema = `kfb.dungeon-detail-patch/0.1`.
13. Edited node transform is written back to the current placement record.
14. Restore rejects a stored patch if asset identity changed.
15. Floor-drop action is candle-only.
16. Stored edits restore before derived light positions are rebuilt.
17. Debug/QA API exposes editor state and first editable selection.
18. Shared modules remain unchanged.
19. Module script body parses after static imports are stripped and top-level await is wrapped in async scope.
20. Branch delta at this checkpoint contains only the generator HTML.

## What this does NOT prove

- no Chromium interaction run yet;
- no GLTF/network load proof on this branch;
- no pointer/gizmo interaction proof;
- no actual localStorage reload proof;
- no screenshot;
- no Cloudflare publication;
- no Georg visual acceptance.

## Next gate

One bounded browser test only:

`A1 -> Editor ON -> first editable detail -> move/rotate -> patch appears -> rebuild -> same transform restored`.

If that passes, E1 is the second real host and the next separate slice may extract the genuinely shared edit core.


## Browser proof attempts · frozen after two harness failures

The original static result remains **20/20 PASS**.

### Attempt 1
- run: `35487119077`
- job: `106015440253`
- local server: PASS
- real page/WebGL: loaded
- harness: FAIL
- cause: Chrome `--dump-dom --virtual-time-budget` did not terminate because the page intentionally maintains render/timer loops; outer timeout exited 124.
- application editor assertion: **NOT OBSERVED**

### Attempt 2
- run: `35487373804`
- job: `106016124834`
- local server: PASS
- Chrome remote-debugging process: started
- harness: FAIL before application polling
- cause: Node 22 `ERR_AMBIGUOUS_MODULE_SYNTAX` from CommonJS `require()` plus top-level `await`.
- application editor assertion: **NOT OBSERVED**

### Classification

`BROWSER = NOT_TESTED`

The candidate is frozen because two repair passes were consumed on the same proof gate. This is not evidence that the editor failed.

Recovery:
`INLINE_EDITOR_E1_FAILURE_RECOVERY_2026-09-20/START_HERE.md`

No third browser retry in this slice.
