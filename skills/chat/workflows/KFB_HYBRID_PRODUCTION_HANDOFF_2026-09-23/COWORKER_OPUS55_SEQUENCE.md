# KFB Coworker · Opus 5.5 Transition + Production Sequence · 2026-09-23

Status: **PASTE-READY MASTER SEQUENCE**

## Für Georg

Use this order in the existing load-bearing Coworker chat.

Do not open a new Coworker chat unless the existing one becomes unusable.

---

# STEP 0 · still on Opus 4.8 · checkpoint

Paste:

> @GitHub @Dropbox
>
> BEFORE MODEL SWITCH:
> create one recovery checkpoint for the current ToolBox build.
>
> Do not start new implementation.
>
> Please:
> 1. report current branch/worktree;
> 2. list modified/untracked files;
> 3. if the current implementation checkpoint is coherent, commit it;
> 4. otherwise write `MODEL_SWITCH_CHECKPOINT.md` on the current implementation branch with:
>    - exact changed files;
>    - what currently runs;
>    - what is untested;
>    - exact next edit;
> 5. fetch exact branch head + checkpoint file after the write;
> 6. STOP and tell me it is safe to switch model.
>
> No redesign, no new gate.

Wait until Coworker confirms the checkpoint is persisted.

---

# STEP 1 · switch SAME chat to Opus 5.5

Use Claude UI model switch.

Accept that the new model rereads context.

Then paste:

> @GitHub @Dropbox
>
> MODEL SWITCH RECOVERY.
>
> Continue this existing Coworker session after switching to Opus 5.5.
> Do not restart the ToolBox work and do not re-derive the project from chat history.
>
> Read current GitHub versions of:
> 1. `skills/chat/workflows/KFB_HYBRID_PRODUCTION_HANDOFF_2026-09-23/START_HERE.md`
> 2. `CURRENT_STATE.md`
> 3. `COWORKER_CONTROL_TOWER.md`
> 4. `COWORKER_CONTINUE_PROMPT.md`
> 5. the latest `MODEL_SWITCH_CHECKPOINT.md` / current implementation Return
> 6. current ToolBox PR #185 and relevant WorldBuilder owner PRs.
>
> GitHub + the existing local workspace are authoritative.
>
> First reply only:
> - recovered implementation state;
> - whether uncommitted local changes exist;
> - exact next step.
>
> Do not write yet.

Expected:
one short recovery report.

---

# STEP 2 · build Production Desk v0 + same-repo Auto-Sync

After recovery is correct, paste:

> @GitHub
>
> Build the current KFB Production Desk control-plane slice.
>
> Read:
> - `PRODUCTION_DESK_V0_BRIEF.md`
> - `PRODUCTION_DESK_AUTOSYNC_V1.md`
> - `PRODUCTION_DESK_STATE.json`
> - `COWORKER_PRODUCTION_DESK_START.md`
> - current KFB Hub source only as navigation/UI donor, not as truth.
>
> Reuse the proven Asset Librarian live-registry pattern:
> source changes → deterministic generated registry → bot branch → manifest → live polling.
>
> Phase 1 in this slice:
> - same-repo `kayfabizarro` automatic production registry;
> - generated `registry/production/v1`;
> - reviewable `bot/production-desk-update` branch;
> - LIVE/CANONICAL Desk mode;
> - visible sourceCommit / last sync / stale state;
> - 60–90 s best-effort polling;
> - compact non-developer UI;
> - current brief copy actions;
> - Human Review / Running / Can Start in Parallel / Waiting.
>
> Do NOT fake cross-private-repo live state.
> Travel/Racer remain LAST_KNOWN/VERIFY_CURRENT until a cross-repo GitHub App/token or status-dispatch mechanism is explicitly configured.
>
> Return:
> - `KFB_PRODUCTION_DESK_V0.html`;
> - generated registry/state;
> - workflow/builder;
> - tests;
> - short Return;
> - direct clickable artifact in chat;
> - durable GitHub artifact.
>
> No Cloudflare required.
> No merge/Live.
>
> After this control-plane slice, STOP and report readiness to resume ToolBox.

---

# STEP 3 · resume current ToolBox build

After Production Desk v0 is technically usable, paste:

> @GitHub @Dropbox
>
> Resume the existing ToolBox Source-Safe Integration from the recovered local workspace.
>
> Do not restart source archaeology.
>
> Your internal faithful vertical slice is approved:
> Stage-First shell + real roster + accepted R2 editor + Goth Girl + Save/Reload.
>
> That is NOT a Georg gate.
>
> If internally green, continue to the full coherent milestone:
> - current FrizzleBob Driver Graft;
> - full actual Studio roster;
> - saved Cube-Pet 1.2.9 user state;
> - Goth Girl;
> - Orc Warband;
> - Animatronic;
> - Move / Rotate / Scale / Drop;
> - Save / Reload;
> - fail-closed missing-source behavior.
>
> Return ONE coherent clickable ToolBox review artifact and persist it durably.
>
> Ask Georg only:
> 1. Is this finally the correct actor/scene basis?
> 2. Does Actor → Stage/Resident → Messen → Save/Reload feel like one ToolBox?
> 3. Is there a visible blocker before the next coherent design/world pass?

---

# STEP 4 · Coworker current-lane check-in

After Georg reviews ToolBox, paste:

> @GitHub @Dropbox
>
> Do one current-lane check-in only.
> Do not implement all lanes.
>
> Refresh:
> - Production Desk registry;
> - WorldBuilder #190;
> - Travel #38;
> - Racer #33;
> - Blender/Warband latest Return;
> - Hürth/form-language #194;
> - Curtain #189;
> - Billboard #188;
> - VFX/SFX Consolidation lane.
>
> Return in plain German:
>
> 1. What is production-ready now?
> 2. What still needs Georg?
> 3. What can run in parallel?
> 4. What is the next ONE coherent MVP?
> 5. Does anything genuinely need WSA?
>
> If no capability gap:
> say exactly `WSA NOT YET NEEDED`.
>
> Evaluate these candidates but choose only one:
> - HYBRID-PROD-MVP-01: accepted Blender Resident → ToolBox/WorldBuilder runtime;
> - WORLD-GOD-01: Globe/God View → local WorldBuilder authoring;
> - Racer Anatomy Foundation;
> - another candidate only if current evidence makes it clearly better.

Do not implement the selected MVP until Georg accepts it.

---

# PARALLEL LANE A · VFX Webchat

May run while Coworker does ToolBox.

Open a separate bounded Webchat with:
`VFX_SFX_WEBCHAT_START.md`

First gate:
VFX-01 donor Review Bank.

SFX remains second.

Production Desk should list this lane as:
`CAN START IN PARALLEL`.

---

# PARALLEL LANE B · Blender Warband

Continue current Blender session.

Use:
- Performance Animation Pilot for drumming/guitar/task mechanics;
- existing Warband source facts;
- current Blender scene.

Do not restart.

Return next meaningful candidate as:
Blend + script where practical + GLB + preview + measurement/Return.

---

# PREPARED WORLD DIRECTION · not active until chosen

Read:
`WORLDBUILDER_GOD_MODE_V0.md`

Target:
Globe overview / God View
→ smooth TinySkies-derived approach
→ local WorldBuilder terrain authoring
→ Asset Librarian search/place
→ Resident/OSM/Race/Card-Zone layers
→ shared in-place editor
→ Save/Reload
→ pull back to globe.

Do not build before the current ToolBox/WB2/form-language gates justify it.

---

# WSA

Use:
`COWORKER_WSA_SYNC_BRIDGE.md`

Do not start Work/WSA automatically.

Only after Coworker has:
- a CLOSED packet;
- exact input heads;
- one named missing capability;
- one smoke gate.

GitHub is the sync bus.

---

# Human review standard

For every visual gate:
- direct clickable artifact in chat;
- durable GitHub/CI storage;
- exact source/runtime head;
- 1–3 plain-language questions;
- ACCEPT / TUNE / REJECT persisted.

Use:
`REVIEW_SCENE_BASE_V1.md`
for 3D Web review surfaces.
