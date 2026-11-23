# WSA integrated Slop production · R1

Owner: WSA authoring. Existing WS0 intake and Asset Librarian remain receiving owners; WS1 owns runtime. This extends the current SOP_INK_MONSTERS_R2, not a second catalog or runtime.

## One batch packet, captured before image work

Pin source head, SOP, actual reference PNGs and checksums. Record source identity keys and depiction IDs separately, names, gender reading, cell geometry, props, intended expression and the short comic premise. Record explicit pair/trio membership or zustand_von; row placement alone never creates a relationship. Record exact prompt and actual generation arguments after each call. Model and seed are UNKNOWN when the tool does not expose them; never invent seed variation.

Six unique actors use two female-read figures. For states/tier depictions record repeated identities explicitly; never count every depiction as a different person. Independent poses must also work outside a couple/trio. Preserve source designs, all versions and Georg verdicts.

## Parallel tasks with one integrating owner

1. Visual production: controlled native, reference-conditioned image jobs. Start with one pilot for a new format or risky change. After a format has Georg PASS, use small bounded batches, initially at most two independent jobs concurrently when the tool permits. Persist every result before the next batch. A timeout is UNKNOWN: inspect before retrying. Do not assume a submitted job completed.
2. Writing: while generation runs, a writer receives the same frozen packet and drafts one biography per identity, variant notes per depiction and a separate group note. English personality/backstory plus dry German FrizzleBob field note. Ground the proposal in actual prompt intent and SLOP_METANARRATIV_R1: HyperNorm residents, rigid rules, dissonance, pressure from Men in Black/Hunky & Dory, satire with heart. No invented visual facts, official deck mapping, voices or audio provenance. Mark all new prose DESIGN.
3. Technical preparation: validate IDs, cell/source links, image hashes, alpha, visible scale, boundaries, states and reciprocal relations. Use existing importer/rules/catalog fields. A metadata-only snapshot can prove structure, not missing image/prompt bytes.
4. Integration: one owner joins results, performs the semantic check against references, handles exceptions and publishes one coherent checkpoint. A reviewer checks a different writer's output; concrete repairs are rechecked. Only the integrator writes shared GitHub state.

These tasks were actually used for the present recovery: two writers split 248 identities; a third agent prepared validation and 54 group notes. All used the available inherited configuration. This record makes no pricing or speed guarantee. Use narrowly scoped packets instead of passing the entire production history to every worker.

## Masters and derivatives

The approved source sheet remains the design donor. Existing sheets have limited per-cell detail; enlargement does not recover it. For new catalogue-ready production, first approve a source-faithful individual native master, then derive game sprites, review sheets and gallery images from that approved master. Target dimensions are requests, not results: measure actual returned pixels. Match body height and baseline across derivatives while retaining intended silhouette differences; do not normalize by accessory height alone. Preserve aspect ratio.

Test alpha and edge specks on light, dark and checker backgrounds; inspect native size plus gameplay sizes. Review every split actor for clipping, disconnected details and readable white sclera/red iris/black pupil. Do not regenerate already approved identities in bulk until the master pilot preserves identity and passes technical QA. The present Frau Löffelrecht pilot is TUNE; it does not replace the accepted sheet and has no catalogue-master approval.

## Separate gates and receipts

- Georg image verdict: PASS/TUNE/FAIL per selected image. Image PASS never becomes text acceptance or clean-cutout certification.
- Text: DESIGN until explicitly approved; lore proposals and visual evidence remain separate.
- Technical: original bytes, geometry, alpha/scale and extraction checked; failed seams retained for targeted repair.
- Receiving: WS0 resolves canonical mappings and existing rules, imports actual assets, then records exact receiving head and file list. Source check-in alone is not runtime availability.
- Publication: the existing Library exporter, rebuild and publication follow receiving intake. Verify the actual published revision before claiming visibility. No auto-merge or Live promotion.

After PASS, close a batch once: update manifests, cards/overlay and relation graph, preserve prompt/media evidence, run the planning adapter and source checks, publish implementation, reread exact branch/files, then update evidence/Return. Avoid repeating whole-inventory scans after unchanged small checks. Original 531-ID writing task and later authoring supplement remain separate scopes.

## Current executable adapter

`pipeline/wsa_intake_plan.py` produces a derived handoff plan. It does not crop, upscale, import or publish. Its 23 tests cover strict PASS eligibility, exclusion handling, relations, source references and explicit biography-overlay schema acceptance. Use complete mode with materialized source PNGs and prompt records for actual source readiness; metadata-only is an explicit evidence hold. See pipeline/README.md.

The receiving roster now has an additive `karte.biografie` wrapper for eligible exact ID matches only: `v` contains prose and source identity, `src` points to this authoring overlay, `status` is DESIGN. Existing runtime data and prior card fields are preserved. `relation_group_keys` refer to this source projection, not newly invented canonical IDs. Unmapped identities wait for WS0; do not silently append them.
