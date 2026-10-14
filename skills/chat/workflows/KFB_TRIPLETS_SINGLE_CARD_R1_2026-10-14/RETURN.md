# KFB Triplets single-card R1 · test/return · 2026-10-14
## Ownership and boundary
Existing private plugin `kfb-triplets` updated IN PLACE: **v0.1.1**, release `pluginrel_6acef889578881919b4e22df03825b62`. No new plugin, Site, Suno, audio, performances, Openers, Bridges, intros/outros, PR or merge. GitHub owner `georg-doc/kayfabizarro`, separate branch `editorial/kfb-triplets-single-card-r1-2026-10-14`.

## Pinned inputs
- Monomyth Mayhem cards 1–8: `media/kfb/Kayfabizarro_Monomyth_Mayhem_WEB_v1.pdf.json`, pinned main commit `ac9dbaed2e5966a537a4bb719e8cd847dcc5e099`, Git blob `5ef6057e322c42ff1dbe786f0670dc2abe20ca21`.
- Help I Am A Human cards 1–8: `media/kfb/Help_I_Am_A_Human_-_ADD_web.pdf.json`, same main commit, Git blob `14bbb1e043470bba1bf7c589163e3682109ea094`. Another distinct Human Nature Uncut file exists; not used. Source fields in sample JSON.

## Counts and gates
- Source sample coverage: 16/16 numbers 1–8 twice, with exact original title/POWER/LORE beside draft.
- Strict heuristic editorial self-check: **5 preliminary TRIPLET**, **11 NO_TRIPLET** (failed own checks), none Human Accepted.
- Actual `validateBeat` loaded from source of branch `ws1/r3f-frame` module `ws1/kfb-planet/src/vendor/triplet-pool-core.mjs` blob `517bb34bd64c968ebb4614a500460b55428b9257` via evaluated exact module function: **5/5 PASS**, zero core failures. Original cardNumber was supplied during invocation; candidate JSON has source cardNumber in the envelope. This proves core function checks on five candidates, NOT human semantic quality.
- Negative plain recital: **1/1 rejected** by own recital comparison (full POWER and LORE spoken verbatim in sequence). This is a narrow predicate test, not a full test-suite run.
- Historical 1001 Kayfabe Nights #5–7 R1: **0/3 executed**, exact historical R1 generated text was not retrieved; fixture is marked pending, never misreport PASS.
- Standalone `triplet-self-check.mjs` checked in and syntax regex repaired, but **0 actual Node runner executions**. Thus self-check regression suite NOT fully passed.
- Content-word % is heuristic and must receive editorial review for irregular inflection/stopwords. Metadata `EDITORIAL_CANDIDATE`, human acceptance PENDING. Do not promote rejected draft lines or invent replacements.

## Candidate distribution
Monomyth Mayhem #1, #3, #5, #6 = preliminary Triplets; #2, #4, #7, #8 = NO_TRIPLET. Help I Am A Human #6 = preliminary Triplet; #1–5, #7, #8 = NO_TRIPLET. Exact reasons, excerpts, ratios, evidence and slots in `sample-16.json`; rejected lines retained as `rejectedDraft` for editorial analysis, not playable beats.

## Known limits
The user asked for a sample of 16; it is present, but only five pass the current limited heuristic and core checks. The negative 1001 R1 fixture and executable full own-check suite need completion; some current slots are mechanically extracted (not guaranteed to represent truly independent SHOW/SPIN/SELL clauses); semantic performance remains Georg's gate. No Stage URL required.

## Next one gate
**GEORG_SINGLE_CARD_SAMPLE_R1_EDITORIAL_GATE** — Georg reviews five candidates and eleven rejections, corrects turn/content quality; only then run complete negative regression/runner and consider full deck. No full-deck work before human judgment.
