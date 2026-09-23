# KFB Production Flow v2 · Closed Packet Criteria

Status: **BINDING DEFINITION FOR PRODUCTIVE HANDOFF**

## Für Georg

Ein Produktionspaket ist erst dann „geschlossen“, wenn Claude/Coworker **nicht mehr raten oder suchen müssen**.

Das heißt nicht, dass jede Datei hineinkopiert wird.

Es heißt:
- jede benötigte Quelle ist exakt verlinkt/gepinnt;
- bekannte Messdaten sind angegeben;
- akzeptierte Teile sind als akzeptiert markiert;
- die eine neue Aufgabe ist klar;
- offene Produktentscheidungen sind ausdrücklich benannt.

## CLOSED = all checks pass

### C1 · Exact sources

Every required donor/input has:
- repo;
- branch/ref or immutable commit;
- exact file/module;
- blob SHA where identity matters.

No:
- “use the latest one”;
- “the rabbit from the old build”;
- screenshots as source identity.

### C2 · Source proof

For each identity-bearing donor:
- unchanged donor proof exists;
- or prior human acceptance is cited.

Recipient does not need to rediscover whether this is the correct donor.

### C3 · Measurements/source facts

All values needed to perform the task are either:
- inside the packet; or
- referenced by exact immutable measurement/evidence file.

Examples:
- scale;
- axes;
- pivot;
- grip/attachment;
- contact point;
- rig/clip;
- material/texture path;
- timing/BPM;
- camera framing.

No eyeballing from screenshots.

### C4 · Accepted state

Packet explicitly says what is already accepted and must not be reopened.

Example:
- WorldBuilder R2 shared editor = accepted;
- Travel TMB-1E rider relation = accepted;
- Theatre Curtain SVG candidate = rejected.

### C5 · Owners protected

Packet names the owners the recipient may consume but not replace.

At minimum when relevant:
- runtime;
- scene;
- movement/physics;
- camera;
- actor/rig;
- animation;
- asset truth;
- persistence.

### C6 · One seam

The exact integration seam is named.

Use:
`[FORK] / [COPY] / [NAHT] / [UNCHANGED]`

Recipient does not choose a new architecture.

### C7 · One coherent outcome

The packet describes one useful artifact/milestone.

Not:
- “improve ToolBox”;
- “make it nicer”;
- “integrate everything”.

Good:
- “Stage-First ToolBox using current real roster + accepted shared editor + one complete Resident set + Save/Reload.”

### C8 · Closed file/artifact roster

Expected editable inputs and outputs are named.

Recipient knows:
- what may change;
- what is protected;
- what must be returned.

### C9 · No hidden research task

The recipient must not need to:
- search for a missing donor;
- determine which source is canonical;
- infer measurements;
- choose between conflicting owners;
- find the current human decision in old chats.

If any of those are required:
packet is `OPEN`, not `CLOSED`.

### C10 · Explicit remaining decisions

A packet may still contain a human/product choice, but it must be explicit.

Example:
`Human decision at end: choose 240 / 320 / 400 ms.`

That is not a missing source.

### C11 · Review delivery defined

Packet states:
- expected review artifact;
- 1–3 questions for Georg;
- direct clickable delivery in the same chat.

### C12 · Stop condition

Recipient knows when to stop instead of inventing around a gap.

Examples:
- donor cannot be reproduced;
- owner conflict;
- required source missing;
- accepted behavior disappears;
- two repair passes fail.

## Result vocabulary

`CLOSED`
All required execution facts exist.

`CLOSED_WITH_HUMAN_GATE`
Execution facts complete; one explicit visible/feel/product decision remains for Georg at the end.

`OPEN_SOURCE`
A required donor/source is unresolved.

`OPEN_MEASUREMENT`
A required value/profile is missing.

`OPEN_OWNER`
Ownership/seam conflict unresolved.

`OPEN_PRODUCT_DECISION`
Work cannot proceed without Georg choosing between product directions.

## Handoff rule

Claude Design / Coworker / WSA may start productive work only from:
- `CLOSED`; or
- `CLOSED_WITH_HUMAN_GATE`.

If the packet is OPEN:
return the missing field.
Do not fill it by guessing.

## Token rule

Do not duplicate entire donor source trees into the packet.

Prefer:
- exact immutable references;
- compact measurement tables;
- exact accepted-state notes.

“Closed” means **zero required guessing**, not “one giant document”.
