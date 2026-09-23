# KFB Production Packet · Template

Status: TEMPLATE
Purpose: one closed handoff for Coworker / Claude Design / WSA

## 0 · Packet status

Evaluate against:
`CLOSED_PACKET_CRITERIA.md`

Status:
`OPEN_SOURCE | OPEN_MEASUREMENT | OPEN_OWNER | OPEN_PRODUCT_DECISION | CLOSED | CLOSED_WITH_HUMAN_GATE`

Productive Claude/Coworker/WSA execution starts only from:
`CLOSED` or `CLOSED_WITH_HUMAN_GATE`.

## Für Georg

Dieses Paket soll verhindern, dass ein neues Tool wieder bei null anfängt.

Es enthält nur:
- was gebaut werden soll;
- welche funktionierenden Teile unverändert benutzt werden;
- welche Messdaten schon bekannt sind;
- welche eine sichtbare/produktive Änderung gewünscht ist;
- was du am Ende beurteilen sollst.

## 1 · Outcome

One sentence:

`<What coherent usable artifact should exist after this slice?>`

## 2 · Receiving owner

Repo:
Project/tool owner:
Current Return:
Current head:

## 3 · Working donors

| Role | Exact repo/ref | File/module | Evidence | May change? |
|---|---|---|---|---|
| primary donor | | | | NO / seam only |
| secondary donor | | | | |
| visual donor | | | | |

If a donor works, apply Design Donor Lock.

## 4 · D0 proof

Donor unchanged proof:
Artifact/screenshot/runtime:
Source head/blob:
What is proven:

If already human accepted, cite that decision.
Do not require Georg to reapprove the same unchanged donor.

## 5 · Measurements / source facts

Measurement packet:
`<path>`

Only list values relevant to this slice.

Do not remeasure accepted values from screenshots.

## 6 · Existing accepted components

- 
- 
- 

These are inputs, not redesign targets.

## 7 · Protected owners

Do not replace:
- runtime owner:
- movement/physics:
- camera:
- actor/rig:
- animation:
- asset truth:
- persistence:
- deployment:

## 8 · Seam

```
[FORK]
exact donor:

[COPY]
exact reused module/data:

[NAHT]
first new object/code/state:

[UNCHANGED]
systems that must stay donor-equivalent:
```

## 9 · One delta family

This production pass may change:

`<one coherent family: presentation / attachment / scene composition / transition / etc.>`

It may not silently change:
- source identity;
- runtime class;
- unrelated UI;
- owner architecture;
- already accepted measurements.

## 10 · Executor

Choose one:

- `COWORKER` — code/integration/persistence/tests;
- `CLAUDE_DESIGN` — coherent visual authoring;
- `WEB` — small source/status/repair;
- `WSA` — named unavailable capability only.

Why:

## 11 · Closed file / artifact roster

Expected source files:
- 

Expected output:
- editable source/session;
- review artifact;
- tests/evidence;
- Return.

## 12 · Internal checks

These do not normally require Georg:
- donor identity;
- exact source refs;
- measurement replay;
- static/unit tests;
- reversible integration checks.

## 13 · Human milestone

Direct clickable artifact:
`<must be delivered in same chat>`

Ask Georg at most 1–3 questions:

1.
2.
3.

Do not ask him to decode technical statuses.

## 14 · Stop condition

Stop if:
- donor cannot be reproduced;
- source identity changes;
- owner conflict appears;
- accepted behavior disappears;
- two repair passes fail.

## 15 · WSA escalation

WSA-only capability needed:
`NONE` by default.

If non-empty, explain why Coworker/Web cannot finish it.

## Return

First plain language:
- what now works;
- what Georg should look at;
- what happens next.

Then:
- repo/branch/PR/head;
- tests;
- changed files;
- unresolved items.


## Recipient guesswork check

Before handoff answer YES/NO:

- Can the recipient identify every required source without searching?
- Can the recipient execute without estimating missing measurements?
- Are accepted components explicitly locked?
- Is the one seam named?
- Is the one coherent outcome named?
- Are remaining human decisions explicit rather than omitted?

If any required execution answer is NO:
the packet is not CLOSED.
