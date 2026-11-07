# Actual adapter checks · 2026-11-05

Environment: system `python3` (Python 3.9), Pillow available. All work stayed inside this pipeline candidate folder. No GitHub writes, image edits, generation or imports were performed.

- `python3 -m unittest discover -s output/slop-integrator-20261105/pipeline -v`: **18/18 PASS**.
- Current-source metadata run: `python3 output/slop-integrator-20261105/pipeline/wsa_intake_plan.py output/slop-integrator-20261105/source --metadata-only --output output/slop-integrator-20261105/pipeline/METADATA_HANDOFF_PLAN.json`: **exit 0**.
- Input snapshot supplied by root: `georg-doc/kayfabizarro`, branch `assets/ws0-ink-miners-2026-11-04`, head `46ad5a152087762ab3521613a3fd7f26075e1aa4`.
- **51 indexed PASS sheets; 49 selected sheets, 294 depictions, 236 explicit source identities; 2 PASS sheets excluded; 0 metadata source errors.** All 49 selected sheets are `METADATA_READY_EVIDENCE_PENDING`, because this snapshot intentionally omits PNG/prompt-production bytes. No complete media verification was claimed.

Tests exercise excluded PASS, strict booleans, state identity aggregation, dangling state group, non-reciprocal pair, broken trio, valid pair/trio, image hash mismatch, unlisted depiction image, root path escape, absent prompt text, duplicate cell, legacy `figuren` cards, separate biography overlay, and metadata-only evidence separation including path containment.

Limitations: these are adapter counterexamples and a current-source metadata integration run, not independent acceptance, visual QA, safe-crop proof, catalog publication or game ingestion. Alpha bounds refer to whole sheets only. Canonical mapping and catalog-master readiness require receiving-owner evidence. DESIGN biography text retains its supplied provenance and has not received Georg text approval.

Next owner action: WS0/Asset Librarian completes evidence-backed intake through existing owners; game issue #51 remains downstream until that import is actually accepted.
