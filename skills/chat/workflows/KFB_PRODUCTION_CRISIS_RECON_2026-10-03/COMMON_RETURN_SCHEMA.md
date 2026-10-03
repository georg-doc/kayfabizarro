# Common return format for the crisis audits

Both independent audits use this structure so they can be compared without another archaeology pass.

## 1. What is true now

Maximum one page. Plain German. State what is genuinely playable, what is only a tool/test/donor and what is not built.

## 2. What went wrong

Group causes, do not narrate every commit. Separate:

- product/priority drift;
- owner/architecture drift;
- source/SSOT drift;
- branch/merge/check-in failures;
- test/acceptance failures;
- communication failures.

## 3. What should happen next

Give an ordered recovery list. Every item includes executor, one bounded outcome, protected boundaries, proof and the visible result for Georg.

## 4. What Georg must decide

Maximum seven decisions. Each decision includes:

- the question in ordinary language;
- why it matters now;
- two or three meaningful choices;
- the reviewer's recommended default;
- visual context or a direct source link where relevant.

Do not ask Georg to choose between hashes, branch names, libraries or implementation details unless the choice changes the product.

## Required appendices

- evidence links;
- current owner map;
- conflict list;
- unresolved unknowns;
- technical identifiers and measurements;
- proposed status for each inspected candidate: `KEEP`, `EXTRACT`, `REPAIR`, `ARCHIVE`, `BLOCKED` or `UNKNOWN`.

## Stop conditions

- Do not fix findings during the audit.
- Do not merge, close, delete, deploy or promote anything.
- Do not create a replacement owner or SSOT.
- If two sources conflict, report the conflict and its product impact.
- If a source cannot be accessed, mark it unknown; do not reconstruct it from chat memory.
