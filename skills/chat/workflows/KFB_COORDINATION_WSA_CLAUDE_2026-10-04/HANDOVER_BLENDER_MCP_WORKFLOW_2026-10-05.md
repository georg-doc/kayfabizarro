# HANDOVER → Blender MCP lane · new workflow · 2026-10-05

- From: Claude Coworker (production lead), on Georg's request
- For: the Blender MCP lane (Claude Cowork with Blender)
- Talk to Georg in German, short, plain, no jargon, no meta talk. Files for other chats in English.

## 1 · What changed (Georg + WSA, 2026-10-05)

**GitHub issues are now the job list.** No Production Control round, no Hub/router/registry round between jobs.

- One GitHub issue per real product job in `georg-doc/kayfabizarro`: goal, brief link, test link.
- Six labels only: `P0` · `P1` · `parallel` · `waiting-human` · `blocked` · `done`.
- Claude Coworker writes the brief → the executing lane (WSA/Codex, Claude Design, or **Blender MCP**) does the job → Claude Coworker reviews the Return → Georg says in plain words what works; that becomes PASS / TUNE / FAIL.
- **Production Control** stays as a private archive but is **no longer a required channel**. The Claude service access to it is on HOLD (`DECISION_CLAUDE_SERVICE_ACCESS_DEFERRED_2026-10-05.md` in this folder). The `kfb-production-control` plugin skills (`checkin`, `recover`, `session-cut`) cannot reach it from Claude; do not try.
- The Claude GitHub connector now has **read and write** access (the "Claude Github MCP Connector" app is installed for this repo and for `KFB-Combat-Arena`). Branches and files can be written directly; no upload-page workaround needed.

## 2 · How the Blender lane works from now on

1. **Only work on an open issue** that names the Blender lane. If Georg asks for Blender work without an issue, ask Claude Coworker (or Georg) to open one first; one line is enough.
2. **Branch per job:** `blender-mcp/<job-slug>-<date>`. Small checkpoints; after every write, read back the branch head and the intended files.
3. **Return:** one `RETURN.md` in the job folder plus one comment on the issue with: what was built, real tests/measurements, files and SHA, open look decisions for Georg, exactly one next gate. Then set the label to `waiting-human` if Georg must look, otherwise leave it for Claude's review.
4. **Georg's review in Blender:** open the result directly in his running Blender so he can orbit it himself (his stated preference), instead of render loops or HTML viewers.
5. **Unchanged rules:** Blender lane = measurement, clip bakes, data files, Blender reference builds. **No runtime owner.** Raw FBX never on GitHub. Earlier library files stay byte-identical; new data is additive. No merge, no Stage/Live promotion. Stop after two failed repairs on the same gate.

## 3 · Current lane state

| Item | State | What happens |
|---|---|---|
| **Fluff Work Motion Pack 01** (PR #356, branch `planning/fluff-blender-slice-01-2026-10-04`, head `9124366b`) | Blender Part 3 complete; Medium 17 clips, Large 13; no new clip required | Next gate is a **runtime consumer proof** by another lane, not Blender. Reopen Blender only if that runtime proves a motion defect. Two look decisions are open for Georg (Robot One + Large ball: clay dent vs. head-up pose; marble: 6 loud vs. 3 calmer colours); they get an issue when Georg wants to decide. |
| **LOCOMOTION-LADDER-01** (branch `coworker/locomotion-ladder-01-brief-2026-10-03`, copy in Dropbox `BLENDER MCP/_inbox`) | **HOLD** | World Studio already uses its own KayKit locomotion set, and the work map forbids a new general locomotion project. Reactivated only if Georg's World Studio freeplay (issue #360) shows walking/running defects, and then narrowed to the set World Studio uses. Do not start it from the inbox copy. |
| Motion Library v6 (370 clips) | delivered | Source for future consumer-driven motion work. |

## 4 · Current open issues (for orientation)

- #360 · W1 · World Studio: vier Inseln frei spielen — `P0`, `waiting-human`
- #361 · C1 · Card-Hex Combat: einen Durchlauf spielen — `P0`, `waiting-human`
- #362 · S1-Design · Triplet-Bühne mit Sprechblasen + Triplet-Review (Claude Design) — `parallel`, `waiting-human`

None of them is a Blender job right now.

## Exactly one next gate

No active Blender job. The lane waits for an issue that names it (most likely: a motion defect found in #360 or in the Fluff runtime proof).
