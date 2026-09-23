# Claude Coworker · Opus 5.5 Model Switch · 2026-09-23

Status: **RECOMMENDED · SAME CHAT · CHECKPOINT FIRST**

## Für Georg

Empfehlung:
**den bestehenden load-bearing Coworker-Chat behalten und auf Opus 5.5 umstellen.**

Nicht in einen neuen Chat wechseln.

Aber:
vor dem Modellwechsel soll der laufende 4.8-Stand einmal explizit gesichert werden, damit lokaler Workspace-/Build-Zustand nicht nur im Modellkontext lebt.

## Why

The current Coworker chat contains valuable live working context:
- ToolBox source verification;
- mounted Dropbox donor paths;
- roster extraction;
- real `edit-layer.js` API;
- current local build plan.

GitHub now contains the durable control-plane context, but not necessarily every uncommitted local workspace byte.

Therefore the model switch is treated like a small recovery transition.

## Before switching model

Ask current Opus 4.8 to do exactly one checkpoint:

1. report current branch/worktree;
2. list modified/untracked files;
3. commit the current safe implementation checkpoint if it is coherent;
4. otherwise write a tiny `MODEL_SWITCH_CHECKPOINT.md` on the current implementation branch containing:
   - exact local files changed;
   - what already runs;
   - what is untested;
   - exact next edit;
   - no speculative claims;
5. fetch exact branch head + checkpoint file;
6. stop.

Do not start a new feature in the same turn.

## Then switch in the SAME chat to Opus 5.5

Paste:

> @GitHub @Dropbox
>
> MODEL SWITCH RECOVERY.
>
> Continue this existing Coworker session after switching to Opus 5.5. Do not restart the ToolBox work and do not re-derive the project from chat history.
>
> Read current GitHub versions of:
> 1. `skills/chat/workflows/KFB_HYBRID_PRODUCTION_HANDOFF_2026-09-23/START_HERE.md`
> 2. `CURRENT_STATE.md`
> 3. `COWORKER_CONTROL_TOWER.md`
> 4. `COWORKER_CONTINUE_PROMPT.md`
> 5. the latest MODEL_SWITCH_CHECKPOINT / implementation Return on your current ToolBox branch
> 6. ToolBox PR #185 and current relevant WorldBuilder owner PRs.
>
> GitHub + the existing local workspace are authoritative. The old chat context is supporting context only.
>
> First reply in German with only:
> - what implementation state you recovered;
> - whether uncommitted local changes exist;
> - the exact next build step.
>
> Then continue the existing Source-Safe ToolBox Integration. Do not create a new architecture or new human micro-gate.
>
> Internal vertical slice is allowed. Human gate remains the full coherent ToolBox milestone.
>
> After each GitHub write, fetch exact branch head + intended files.
>
> No WSA, Cloudflare, merge or Live promotion unless a new explicit gate says so.

## After switch sanity

Opus 5.5 should confirm these facts without changing them:

- current ToolBox source-lock PR #185 remains the source owner;
- exact Stage-First + Studio + saved-pets donors remain the donor inputs;
- `media/3D_Assets/kfb-pets.json` is the verified Base-Pet contract source;
- accepted R2 editor remains the shared editor owner;
- free Scale already exists;
- internal Goth Girl vertical slice is not a Georg gate;
- final human milestone is the coherent Source-Safe ToolBox result.

If the new model contradicts one of these:
refresh GitHub before writing.

## Model policy

Use Opus-class reasoning for:
- control-tower decisions;
- source reconciliation;
- multi-file integration;
- hard Blender authoring/debugging;
- architecture review.

Use Sonnet-class execution where:
- brief is already CLOSED;
- task is visual/design bounded;
- extraction/repetition is cheap;
- failure cost is low.

Model choice does not override donor/owner discipline.
