# KFB Production SOP

Status: CURRENT_REFERENCE v0.1
Scope: shared production method for ChatGPT/Astra and Claude Design

## 1. Find truth before acting

Read the current project/tool SSOT and current return first. GitHub state beats chat recollection. Historical docs are evidence, not automatic instructions.

## 2. Reuse before rebuild

Find and read the real donor. Record source repository, commit/blob and contract. Reuse unchanged when possible. Adapt only the smallest boundary needed. Never silently replace an owner.

## 3. Keep ownership singular

Every mutable concern needs one owner: movement, camera, actor, pose, material state, asset registry, deployment, etc. An adapter may translate state but must not become a second owner.

## 4. Prefer vertical playable slices

Do not grow architecture merely because a seam exists. Build enough to make a real, visible, testable slice. Defer generic systems until a concrete failure proves the need.

## 5. Separate claim classes

Use the vocabulary in `EVIDENCE_AND_STATUS.md`. Never promote donor evidence, numerical probes or synthetic tests to visible/browser/freeplay acceptance.

## 6. Measure visible problems before changing them

Numbers before adjectives where measurement is possible. For visible quality, collect screenshots/playback and name the actual failing read. Do not fix global exposure when only one local presentation path is wrong.

## 7. Preserve reversibility

New presentation paths and experimental modes should remain additive/reversible until accepted. Do not delete prior working paths during a replacement slice.

## 8. Keep docs resumable

At the end of a substantial slice update the current return/start docs so a fresh chat can continue from GitHub alone. Heavy history remains searchable, not mandatory startup reading.

## 9. Changelog additively

Do not rewrite history to make it look cleaner. Record `PROPOSAL`, `DECISION`, `IMPLEMENTATION`, `TESTED RESULT`, `DEFERRED`, `UNRESOLVED`, `SUPERSEDED`, `ARCHIVED HISTORY` as new entries.

## 10. Human visual authority

Anything whose acceptance depends on look, timing, feel, readability or play must be presented to Georg. Automation may support the judgment but does not replace it.
