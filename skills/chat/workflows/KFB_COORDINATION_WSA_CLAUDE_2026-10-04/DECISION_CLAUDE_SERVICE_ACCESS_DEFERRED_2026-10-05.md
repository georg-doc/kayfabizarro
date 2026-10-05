# Decision · Claude service access deferred · 2026-10-05

Status: **HOLD · TOO COMPLEX FOR CURRENT PRODUCT WORK**

Georg's decision:

- Do not configure the three-value Claude/Sites service-access chain now.
- Do not generate or rotate a Sites bypass token.
- Do not set the two Production Control environment values.
- Do not deploy Site source candidate `cfe4c7917b90acaabd3fdc36565df2051fad0faf`.
- Do not make Production Control public.
- Preserve the tested candidate and handover as dormant recovery material only.

Reason: the connector setup adds password-manager, Sites-token, Site-environment, owner-ID and Claude-connector administration before any product work can continue. That cost is disproportionate to the coordination benefit.

## Current shared channel

Use GitHub as the practical JIRA-equivalent because both WSA/Codex and Claude Coworker can already read and write the coordination repository.

Minimal operating model:

1. One GitHub Issue or one existing workflow folder per real product slice.
2. The issue title states product + visible outcome.
3. The issue body or `BRIEF.md` is the complete start packet.
4. The executor posts exactly one final status comment or `RETURN.md` with result, direct review link, open blocker and one next gate.
5. Labels are limited to `P0`, `P1`, `parallel`, `waiting-human`, `blocked`, `done`.
6. Product source stays in its current owner repository and branch. Coordination does not create another runtime owner.
7. No mandatory Production Control, Hub, router or registry update between slices.

GitHub Projects, a custom dashboard and a new Site are not required. They may be reconsidered only if the plain Issue/folder workflow itself becomes a demonstrated bottleneck.

Exactly one next gate: **return to the next visible product test/build; use GitHub only for the brief and Return.**
