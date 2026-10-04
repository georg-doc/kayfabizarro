# Source Index · Claude Coworker Briefing Audit

**Status:** CURRENT SOURCE MAP  
**Rule:** Read original execution briefs before rescue corrections and postmortems. Do not let hindsight contaminate the literal-executor test.

---

# A · Birthday / Astra incident

## A1 · Original execution material

Repository: `georg-doc/KFB-Travel-Globe`

Read in this order first:

1. `_handover/BIRTHDAY_STARTSCREEN_ASTRA_2026-09-15/START_HERE.md`
2. `_handover/BIRTHDAY_STARTSCREEN_ASTRA_2026-09-15/SOURCES.md`
3. `_handover/BIRTHDAY_STARTSCREEN_ASTRA_2026-09-15/CHARACTER_PRESENTATION_ADDENDUM_2026-09-15.md`
4. `_handover/BIRTHDAY_STARTSCREEN_ASTRA_2026-09-15/PRESENTATION_QUALITY_ADDENDUM_2026-09-15.md`
5. `_handover/BIRTHDAY_STARTSCREEN_ASTRA_2026-09-15/DAILIES_AND_QUALITY_GATES_2026-09-15.md`

These are the documents whose wording must be judged as if you were a cold downstream executor.

## A2 · Actual downstream implementation that looked green on paper

Open PR:

`georg-doc/KFB-Travel-Globe#8`

Pinned incident head at onboarding creation:

`bbf78434aea3ea25e3f6d2ee4e8ec673af1cf2b8`

Important evidence on that branch:

- `qa/BIRTHDAY/RETURN.md`
- `qa/BIRTHDAY/DAILIES.md`
- `qa/BIRTHDAY/final-threshold.png`
- `qa/BIRTHDAY/final-desktop.png`
- `qa/BIRTHDAY/final-mobile.png`
- `qa/BIRTHDAY/correction-final-desktop.png`
- `qa/BIRTHDAY/correction-final-mobile.png`
- `qa/BIRTHDAY/correction-final-portrait.png`
- `qa/BIRTHDAY/performance-selected-desktop.png`
- `qa/BIRTHDAY/performance-selected-mobile.png`
- `qa/BIRTHDAY/sound-measurements.json`
- `qa/BIRTHDAY/sound-mix.wav`
- runtime under `site/birthday/`

Key counterexample to analyze: PR #8 reported multiple automated/critic PASSes, ten tests passing, clean console, actor clip binding and technical audio checks, while **Georg Freeplay had not happened** and the visible/user-facing result was rejected.

Do not infer `good product` from green QA labels. Treat the discrepancy itself as evidence.

## A3 · Rescue/correction chain

Only after reading A1/A2, read:

- `_handover/BIRTHDAY_STARTSCREEN_ASTRA_2026-09-15/CHARACTER_NAME_SCALE_CAMERA_CORRECTION_2026-09-15.md`
- `_handover/BIRTHDAY_STARTSCREEN_ASTRA_2026-09-15/SHADOW_LIGHTING_CORRECTION_2026-09-15.md`
- `_handover/BIRTHDAY_STARTSCREEN_ASTRA_2026-09-15/P0_EXPERIENCE_RESET_2026-09-15.md`
- `_handover/BIRTHDAY_STARTSCREEN_ASTRA_2026-09-15/BRIEFING_RED_TEAM_REVIEW_2026-09-15.md`
- `_handover/BIRTHDAY_STARTSCREEN_ASTRA_2026-09-15/RUN_NEXT_2026-09-15.md`

These are **rescue history**, not evidence that the original brief was adequate.

## A4 · Lead postmortem

Shared repo:

`skills/chat/recovery/POSTMORTEM_BIRTHDAY_BRIEFING_FAILURE_2026-09-15.md`

Challenge it. Identify what it still misses, overgeneralizes or diagnoses incorrectly.

---

# B · ToolBox UI/UX incident

Repository: `georg-doc/kayfabizarro`

## B1 · Functional/product source that should have been respected

Key historical/current source material:

- `tools/KFB-ToolBox/START_HERE.md`
- `tools/KFB-ToolBox/MASTERPLAN.md`
- `tools/KFB-ToolBox/KFB ToolBox (studio v17 - rigging v1 - animation v2)/WSA_2026-09-13/LIVING_frizzlegraft.md`
- actual `KFB FrankenStein Studio v17.dc.html` in that Studio tree

Important distinction to audit:

- Studio v17 = functional authoring source / existing product workflow
- Pilot = experiment/evidence
- Rigging Lab / CapsuleCarl = specialist workbench / QA fixture

## B2 · Failed upstream UI brief

Read first as the literal Design executor saw it:

`tools/KFB-ToolBox/_handover/UI_CRITIQUE_REWORK_WS0_2026-09-15/START_HERE.md`

The initial brief over-promoted the Pilot/Carl workflow and abstract workflow rail.

## B3 · Downstream design/prototype evidence

- `tools/KFB-ToolBox/_inbox/WS0_2026-09-15/unpacked/B_OBERFLAECHE/KFB ToolBox Pilot v1.dc.html`
- `tools/KFB-ToolBox/_inbox/WS0_2026-09-15/unpacked/B_OBERFLAECHE/KRITIK_UX_CARL_WEG_v1.md`
- `tools/KFB-ToolBox/_inbox/WS0_2026-09-15/unpacked/B_OBERFLAECHE/BERICHT_UI_PILOT_v1.md`
- `tools/KFB-ToolBox/_inbox/KFB ToolBox Stage First v3.zip`

The Stage First ZIP is intake evidence from the later design rescue. It should not be treated as canonical merely because it is newer.

## B4 · Rescue/correction chain

After B1-B3, read:

- `tools/KFB-ToolBox/_handover/UI_CRITIQUE_REWORK_WS0_2026-09-15/RUN_NEXT_CORRECTED_2026-09-15.md`
- `tools/KFB-ToolBox/_handover/UI_RESET_MINIMAL_STAGE_FIRST_2026-09-15/START_HERE.md`

Observed drift that must be traced back to briefing causes included:

- DocCheck-red/dark visual language despite Studio paper/light direction;
- Carl treated as UI/UX model;
- roster collapsed to four special characters;
- Talk/Voice/Bubbles omitted;
- stacked header/navigation rows;
- excessive explanatory/meta text;
- cards inside cards/panels;
- stage de-emphasized;
- progressive-disclosure language turning into clutter rather than simplicity.

## B5 · Lead postmortem

`skills/chat/recovery/POSTMORTEM_BRIEFING_DRIFT_TOOLBOX_UI_2026-09-15.md`

Again: challenge it rather than accepting its diagnosis automatically.

---

# C · Process / recovery / status discipline

Read:

- `skills/chat/RECOVERY_PATH.md`
- `skills/chat/recovery/CURRENT_LEAD_CHECKPOINT_2026-09-15.md`

Global rules relevant to your audit:

- GitHub state overrides chat recollection for implementation truth.
- Preserve owner/contracts; never silently replace them.
- Vertical slices should avoid architecture rabbit holes, but must not lose identity-bearing experience.
- Distinguish proposal, decision, implementation, tested result, Georg freeplay and archived history.

---

# D · Current Actor/Studio direction after the incidents

This is **not** part of the failed brief. It is current product intent that future templates should be capable of expressing cleanly.

Current direction:

- build next in **old Studio v17**, not in the new ToolBox shell;
- first reference actor = **GothGirl**;
- generic expandable Face-Part pools rather than GothGirl-specific hardcoding;
- each part family uses one common mechanism/parameter order;
- original source-character part is one selectable pool option alongside Studio donors;
- current examples: EyeRig with lashes/lids; larger pupils than FrizzleBob; dark lid shade; standard Studio noses + original model nose; Female Lips + other mouth options + original mouth; brows including currently defective Block Brows;
- later workspaces: Actor → Face → Pose → Motion → Voice → Stage;
- Pose needs rig handles/gizmos and contact calibration for e.g. stool + microphone;
- Motion/Performance later includes Dance, Presenter, seated Presenter, Guitar, War Drums;
- Stage later uses Travel-Dome-like geometry; Georg will provide a drawing before spatial assumptions are made;
- Asset Librarian should feed a contextual Resource Picker/Library Drawer rather than become another clutter-heavy Studio dashboard.

Relevant future-slice docs already persisted:

- `tools/KFB-ToolBox/_handover/PERFORMANCE_SUITE_2026-09-15/START_HERE.md`
- `tools/KFB-ToolBox/_handover/KAYKIT_COVERAGE_FRANKENSTEINING_CONCEPT_2026-09-15/START_HERE.md`
- `tools/KFB-ToolBox/_handover/ASSET_LIBRARIAN_STAGE_FIRST_INTEGRATION_2026-09-15.md` if present/current

Do not implement these during the audit.

---

# E · Evidence rule

When writing the autopsy, explicitly classify every observation as one of:

- source-supported requirement;
- observed implementation/evidence;
- Georg rejection/acceptance;
- your inference;
- your proposal.

Do not rewrite history to make the diagnosis cleaner.