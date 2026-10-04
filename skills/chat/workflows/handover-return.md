# Workflow · Handover / Return

A durable return should answer:

- What exact repository / branch / commit was used?
- What changed?
- Which owners/contracts remained unchanged?
- What tests actually ran and in which environment?
- What visible/browser/human gates remain?
- What is DEFERRED or KNOWN BASELINE GAP?
- Where are screenshots/manifests/results?
- What is the next safe resume point?

Prefer a compact `RETURN.md` plus machine-readable manifest/results when useful. The repo should be sufficient for a fresh chat to resume without replaying the previous conversation.
