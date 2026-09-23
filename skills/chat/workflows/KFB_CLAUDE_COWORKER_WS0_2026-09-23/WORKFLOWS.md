# KFB Claude Coworker WS0 · Workflows

Use exactly one workflow per slice.

---

## A · Code Review

Use when Georg/Web asks:
- “review this PR”;
- “sanity check this implementation”;
- “find regression risks”.

### Read

1. exact PR/branch head;
2. changed files / diff;
3. current project Return/Recovery;
4. only the owner contracts touched by the diff;
5. tests/evidence already claimed.

### Review order

1. owner/contract violations;
2. regressions / state loss;
3. wrong donor / replacement source;
4. broken import/export or persistence;
5. test gaps;
6. review-artifact fidelity;
7. only then maintainability/readability.

Avoid style nits unless they create a real maintenance or correctness risk.

### Output

Use `templates/CODE_REVIEW.md`.

Severity:
- `BLOCKER`
- `SHOULD_FIX`
- `NOTE`
- `NO_FINDING`

A review does not change product status.

---

## B · Integration Proposal

Use when multiple accepted/current lanes may need to connect.

Examples:
- ToolBox ↔ WorldBuilder ↔ Resident Atlas;
- Travel ↔ Racer;
- Animation/Motion ↔ scene authoring;
- accepted Web/Claude outputs → WSA integration.

### Read

For each lane:
- exact current head;
- current Return;
- one relevant owner/contract.

Do not read historical implementation trees unless a current seam points there.

### Produce

Use `templates/INTEGRATION_PROPOSAL.md`.

Required:
- source heads;
- existing owners;
- proposed seam;
- dependency order;
- what remains independent;
- conflicts;
- proposed WSA/Work slice;
- Review HTML gate;
- rollback/stop condition.

Initial status:
`PROPOSAL`.

Web Lead reviews and either:
- rejects;
- edits;
- marks `WEB_ALIGNED`.

Only a `WEB_ALIGNED` proposal may be converted to `WSA_READY`.

### No implementation in the same pass

Planning and implementation stay separate unless Georg explicitly asks for both and the implementation has its own Slice Card.

---

## C · Bounded Productive Slice

Use only when Georg/Web gives or approves a filled `templates/SLICE_CARD.md`.

### Preflight

Verify:
- owner repo;
- base/head;
- named branch;
- closed file roster;
- one done condition;
- tests;
- review surface;
- stop condition.

If target head moved materially:
stop and refresh the card.

### Checkpoints

1. **Implementation**
   - smallest working change;
   - no unrelated cleanup.
2. **Evidence**
   - named tests;
   - Review HTML if visual;
   - actual counts.
3. **Handoff**
   - project Return/changelog;
   - Coworker Return pointer;
   - one next gate.

After every write:
fetch exact branch head + intended files.

### Review loop

For visual work:
`CODE → GITHUB → REVIEW.html → GEORG → FIX → REVIEW.html`

No Cloudflare in this loop.

### End states

- `READY_FOR_HUMAN_REVIEW`
- `PASS_PENDING_OWNER_PROMOTION`
- `BLOCKED`
- `FAILURE_RECOVERY`

Never self-promote to Live/merged.

---

## D · WSA Slice Preparation

This is a special output of Integration Proposal.

Prepare WSA only when the missing capability is real.

Good WSA slice:
> Take exact prepared heads A/B. Perform one cross-repo integration/packaging/browser action. Do not redesign. Run one named smoke gate. On failure preserve evidence and stop.

Bad WSA slice:
> Explore the repo and figure out how to integrate everything.

WSA inputs should already contain:
- exact heads;
- file roster;
- known owners;
- already-passing tests;
- human-reviewed visual source where relevant;
- one success check;
- one stop condition.

---

## E · Sprint Check-in

Use when Georg asks for a concise cross-project checkpoint.

Read:
- `CURRENT_SPRINTS.md`;
- current PR heads only;
- current Returns if heads changed.

Return:
- lane;
- current gate;
- waiting on whom;
- conflict/dependency;
- recommended next action.

Do not implement during a check-in unless a separate Slice Card is authorized.
