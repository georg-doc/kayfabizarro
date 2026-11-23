# WSA → existing WS0 intake: derived planning adapter

This candidate Python CLI reads authoring sources and writes one derived handoff plan. It creates no registry, canonical IDs, cropped/upscaled images, runtime data, game statistics, or publications. WS0/Asset Librarian remains the intake owner; existing game owners remain responsible for their own imports.

Python 3.9+; standard library. Pillow is optional and used only to measure existing PNG dimensions and whole-sheet effective alpha bounds. Those measurements do not prove safe per-actor extraction or visual quality. No source file is modified.

```sh
python3 wsa_intake_plan.py /absolute/source/root --metadata-only --output /absolute/handoff-plan.json
python3 wsa_intake_plan.py /absolute/complete/source/root --output /absolute/verified-handoff-plan.json
python3 wsa_intake_plan.py /absolute/complete/source/root --biography-overlay /absolute/biography.json --output /absolute/handoff-plan.json
python3 -m unittest discover -s /absolute/pipeline/folder -v
```

Source root must contain `SET_MANIFESTS_R1.json`, indexed manifests and their card files at original relative paths. Complete mode also requires the selected PNG and prompt-production records. File references are constrained to the source root, including resolved symlinks. The optional separate biography overlay is hashed and associated by explicit source keys; its content is never merged into or substituted for source canon. The author schema `kfb.slop-biographies/1` uses `records` with `identity_id` and DESIGN lore status; the explicit legacy form uses schema-less `cards` with `id` and DESIGN status. Unknown schemas, empty rosters and duplicate keys are rejected. Total/matched record counts are reported; no unknown keys are automatically applied.

Selection requires index `georg_status: PASS`, `intake_eligible: true`, and manifest `georg_status: PASS`, `intake.eligible: true`. Truthy strings do not pass. Excluded source prefixes and set IDs remain binding. Candidate and excluded index rows are retained without import selection. Source `image_status` remains independent from technical readiness.

Explicit `zustand_von` source keys aggregate depictions into identities; a state identity key does not need to be a depiction ID. Each state group must have at least two uniquely named states. Pairs must be reciprocal depiction references. Trios must contain exactly three members with the same explicit group and matching two-member peer lists. No relations are inferred from filenames, row placement, names, or class/career levels. Cross-set state groups/relations are checked across the selected inventory. No canonical mapping is fabricated.

Complete mode hashes PNG bytes against each manifest's closed image hash and requires every depiction to reference that image. Card membership, existing prompt evidence, cell geometry, duplicates and declared identity/depiction counts are checked. Existing cards using either `cards` or legacy `figuren` are supported. Source card statuses remain referenced as supplied; image PASS never promotes DESIGN writing to GEORG approval.

Readiness values:

- `EXCLUDED`: not selected by current acceptance/intake policy.
- `SOURCE_REPAIR_REQUIRED`: concrete contradictory source, missing required file in complete mode, hash mismatch or relation error. This never revokes image PASS.
- `METADATA_READY_EVIDENCE_PENDING`: metadata is consistent; media or prompt records are absent from this local snapshot. No hash, prompt or image proof is claimed for absent files.
- `READY_FOR_RECEIVING_OWNER_MAPPING`: local files and declared relations pass these checks; the receiving owner must still verify canonical mapping and catalog-master readiness.

Exit 0 means this planning run found no source repair errors. In metadata-only mode it explicitly does **not** mean media/import readiness. Exit 2 means at least one source needs repair. A structurally unreadable/missing index or malformed optional overlay raises a normal Python input error. This is a candidate planner, not a replacement for receiving-owner validation.

The next productive step belongs to WS0/Asset Librarian: fetch preserved media/prompt evidence at the pinned authoring head, verify it in complete mode, apply the existing canonical mapping, then perform the actual library intake. Only afterwards may the existing game `scripts/assets/ingest_popups.py`/`popup_regeln.r1.json`/`slop_roster.mjs` owner decide its game import. No live runtime or catalog update was performed here.
