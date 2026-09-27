# WSA planning note · Persist before reply · 2026-09-27

Status: **BINDING PLANNING INPUT · PROCESS HARDENING**

## Trigger

During the World r2 human review, Georg supplied actionable feedback and the current Web chat had an authorized GitHub connector plus an existing owner branch/PR.

The chat nevertheless first returned paste-ready GitHub/WSA text instead of performing the authorized persistence.

Georg flagged this as dangerous because the extra conversational turn creates a needless timeout window: if the Web chat dies after prose but before the GitHub write, the only current copy of the decision may remain in transient chat state.

## Assessment

The existing KFB workflow was **not unclear about whether persistence was required**:
- same-handoff Return/changelog/Hub state was already required;
- GitHub was already the SSOT;
- the slice already had a named owner/branch.

The missing explicit rule was **ordering**:
it did not say strongly enough that authorized persistence must occur **before** a long user-facing closure response.

This has now been corrected on current `main` in:
- `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md → 3B Persist before replying`;
- `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md → 3A Persist closure before chat prose`;
- additive `skills/chat/CHANGELOG.md`.

Current canonical hardening head when this note was written:
`902649a02015b7b1b5f7bb59867b78a386aa9221`.

## WSA / Work planning rule

For future Web/GitHub production slices, plan the closure path as part of execution, not as an optional follow-up turn.

Required order:

`human feedback / result`
→ `owner Return / review / next-gate write`
→ `verify exact GitHub ref + file`
→ `required WSA / Hub source note`
→ `short chat confirmation`

Do not design a productive Web slice around:
1. long prose answer;
2. paste-ready GitHub text;
3. “shall I check this in?”;
4. actual persistence in a later turn.

When GitHub persistence is already authorized and connector access exists, that pattern is a production anti-pattern.

## Timeout / budget implication

This is not cosmetic chat style. It is a reliability and token-budget rule.

Benefits:
- shrinks the unpersisted decision window;
- reduces lost-Web-chat recovery;
- prevents duplicated human explanation;
- reduces WSA reconstruction work;
- keeps Work budget for actual cross-owner decisions rather than reconstructing closure state.

If the GitHub write itself times out:
- state = `UNKNOWN`;
- inspect exact ref/file first;
- keep the interim chat response minimal;
- retry only when absence is proven.

## World r2 example now secured

World r2 review is persisted on PR #234 as:
**TUNE / PROCEED · human gate closed**.

Durable review:
`tools/KFB-ToolBox/worldbuilder/world-integration-01/failure-recovery/GEORG_REVIEW_WORLD_R2_2026-09-27.md`

Non-blocking follow-ups:
- `GLOBAL-SHADOW-CONTACT-ARTIFACT-FIX`;
- `WORLD-PERF-CONTROLS-TUNING-LATER`.

Next productive World gate:
`WB-ZONE-SEAM-01`.

## Planning consequence

WSA should treat **persist-before-reply** as part of the default dispatch template for Web/GitHub slices and not create another meta-review or Cloudflare gate for adopting this rule.
