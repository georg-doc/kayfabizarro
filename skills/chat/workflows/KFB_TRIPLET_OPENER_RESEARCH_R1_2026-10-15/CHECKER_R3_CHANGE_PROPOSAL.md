# Proposed R2 → R3 checker change · WS0 REVIEW ONLY

**DO NOT APPLY WITHOUT GEORG PASS AND WS0 CHANGE AUTHORIZATION.** This document proposes a code change to the existing `triplet_set_check.py`, not a replacement checker or second Triplet owner. Current R2 checker remains blob `095846ba2896a83d1b8747066978e7f05b6d7164` on the WS0 decisions register.

## Proposed minimal staged diff (illustrative; not applied)

```diff
--- a/replies/triplet_set_check.py
+++ b/replies/triplet_set_check.py
@@
 OPENERS = ["Welcome to", "Remember", "You know", ...]  # original literal list UNCHANGED
+# R3 is a reviewed sidecar; IDs must appear in a separately committed
+# GEORG_APPROVED_IDS manifest before any candidate enters an effective pool.
+# Never load all candidates merely because they are present on GitHub.
+# R3_APPROVED = load_reviewed_subset(candidate_json, approved_ids_manifest)
+# effective_openers = OPENERS + [r['literal'] for r in R3_APPROVED]
@@
 FAMILIES = { ... }   # existing five overlapping R2 groups UNCHANGED
 FAMILY_GAP = 10
+# family_by_opener from R3_APPROVED; preserve legacy overlapping group
+# checks AND require 10 card positions between any same R3 provenance family.
+# Reject repeated literals across R2+R3 for a given track.
@@
-        if op not in OPENERS:
+        if op not in effective_openers:  # ONLY AFTER HUMAN/WS0 GATE
             ...
+# Validate approved R3 cardClassAllowed against verified per-card semantic tags.
+# Without a verified tag: fail closed for class-specific R3 openers.
+# Validate exact CSV spoken_text == opener + ' ' + unchanged triplet.
+# Count complete Suno serialize of header + intro + all card beats + outro,
+# blank lines; require < 5000 on all exported track variants.
+# Attribution-risk HIGH requires explicit human approval; no source assertion.
```

### Non-negotiable review criteria
The pseudo-ellipsis above intentionally does **not** form a directly applicable diff; WS0 must implement against its currently fetched R2 checker after Georg approval. The self-contained `R3_CHECKER_PROPOSAL.py` provides code-level validation scaffolding for candidate ID/class/family/join/cost; the `TEST_REPRODUCTION_R3.md` specifies the exact serialization used for track budget simulation. This is **not a release artifact**. Do not use a runtime LLM, rewrite any Triplet, change card source fields, or silently add special punctuation/slots. Confirm current WS0 head before any later patch.
