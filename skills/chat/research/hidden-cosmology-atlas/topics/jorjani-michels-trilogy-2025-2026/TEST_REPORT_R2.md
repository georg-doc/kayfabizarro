# Jorjani × Michels · R2 Puharich Original-Lecture + Atlas Reader Roadmap QA
**2026-10-31 · Existing research owner · existing draft PR #394.**

## Actual code-mode source-document checks: 19/19 PASS
Checks run against **fresh GitHub readbacks** of:
- `PUHARICH_1984_PRIMARY_SOURCE_RECOVERY_R2.md`;
- `../../RESEARCH_WIKI_GRAPH_SITE_AND_DOSSIER_ROADMAP_R1_2026-10-31.md`.

Checks: source record count 6; claim count 8; documentary edge count 2; conceptual edge count 4; source IDs JM-S16..21 contiguous; claim IDs JM-C19..26 contiguous; source/claim IDs unique; 1984 event date distinct from 2026 publication date; distinct 90% sightings vs 50% staged abductions propositions; all new JM-S references resolve to local records; `causality:false` explicit; source audio not claimed listened; publisher transcript expressly indexed-text-only/no audio verification; roadmap declares existing owner and no new Site; four future named dossiers; existing Farrell/Liszt author masters reused; private Google Doc identifiers not exported; single next Puharich audio/remainder gate present. A first trial returned **18/19** because the checking expression looked for an absent *literal test string*, not a substantive evidence error; corrected test predicate and reran **19/19** without source-file modifications. These are **syntactic/documentary consistency checks only**.

## Counts and verified corpus
- **6** new `JM-S16..21` source/input records; 2 URLs distribute the **same** reissued Puharich recording, not two independent accounts.
- **8** new `JM-C19..26` atomic claim records; **2** narrow documentary/source-publication edges `JM-H09..10`; **4** noncausal `JM-W10..13` comparison edges.
- New topic cumulative with R1: **21 source IDs / 26 claims / 10 documentary-or-source-reporting relations / 13 noncausal comparison relations**, separate from WCC R4's **46 sources and 50 claims**.
- Historical audio tape reported **1984-07-02** by **2026-09-16** publisher; **0 original audio minutes listened**; publisher's transcript text retrieved as **web search-indexed content**, while full direct page-open gave **cache miss**. The partial speech context relevant to ~90% of all sightings was inspected in indexed text and faithfully paraphrased; full audio alignment and archive cassette/hash unverified. The remaining hours behind paywall **not accessed**; the 50%-abductions primary utterance **not verified**.
- 1 current biographical web HTML article (Psi Encyclopedia, Puharich) directly opened and read (211 indexed lines including 80–149 relevant); publisher/episode descriptions and original source snippets through search. **PDF screenshot pages inspected in this R2: 0**. The previous JM R1's separate 1978 original blackout PDF had 2 screenshot pages; not re-claimed as new R2 inspections.
- Google Drive private user Docs **not modified or exported** in this R2; no NotebookLM source sync, Work cloud browser navigation, Site, Cloudflare Stage, merged PR or Live claim.
- **0 code builds, 0 project CI workflows, 0 runtime/browser tests, 0 original media audio QA**. All source-readback GitHub file comparisons are separately logged by actual writer calls.

## Historical distinctions that survived the source comparison
Puharich's broader 1984 “~90% sightings from man-made spacecraft” statement is attributable in publisher-supplied 1984 transcript context, with explicit author estimate and no empirical validation. Jorjani 2026 uses narrower “close-encounter UFOs from US fleet” wording, which should NOT be backdated as Puharich's exact sentence. Jorjani's “half of abductions staged” is still **unrecovered in the original segment inspected**; neither confirmed nor disproven by absence from one public excerpt. Source-mentioned Tesla-derived scalar towers, German saucers, Geller and conspiracy anecdotes are **author assertions**, not technology/operational evidence. The separate documented career/Intelectron description does not establish Puharich co-founded MKUltra.

## Exactly one next gate
`PUHARICH_1984_AUDIO_AND_REMAINDER_ABDUCTION_CLAIM` — independently listen, timestamp and compare claimed original **30:01** Lily Dale recording plus accessible portions of the rest (rights permitting), specifically locate or reject **within actually inspected scope** the “half of abductions” quotation and record archival custody evidence. Preserve the candidate and stop without invented audio verification if direct playback fails. Owner/PR unchanged.
