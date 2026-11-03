# KFB Research Atlas — Meta-Administrative GPT Site · Product & Work Brief R1
**Date:** 2026-10-31. **Decision:** `GEORG_APPROVES_GPT_SITE_DIRECTION_2026-10-31`. **This briefing is authorized; actual Site implementation/publication is not represented as complete.** Earlier conditional “maybe a Site later” in `RESEARCH_WIKI_GRAPH_SITE_AND_DOSSIER_ROADMAP_R1_2026-10-31.md` is superseded **only on the product-direction decision**. Repository ownership, source provenance and privacy boundaries remain unchanged.
**One owning research domain:** `georg-doc/kayfabizarro` → `skills/chat/research/hidden-cosmology-atlas/` → branch `research/hidden-cosmology-atlas-2026-10-13` → open Draft PR #394. **Site:** one proposed specialized **research/authoring front end** linked from the already canonical KFB Production Hub. No existing research-specific Site was identified in the examined site registry. **Do not create a second evidence master, game runtime, ChatterBox, or NIE copy.**
**Status:** `SITE_DIRECTION_APPROVED / SOURCE_BRIEF_PERSISTED / SITE_NOT_BUILT / SITE_NOT_PUBLISHED`.
**Language:** briefing/portable UI/source IDs English; direct discussion with Georg German. No fabricated publication route.

## 1. Product and authority
The Site is a **research meta-administration and orchestration workbench**, not merely a chatbot or a flashy network renderer. It should let Georg:
- search existing **GitHub authors, sources, topics, claims, institution dossiers and source-backed edges**;
- discover *related files in explicitly connected/authorized private Dropbox and Google Drive* and **stage** candidates for source-intake without mirroring full private content publicly;
- compare a source's original historical scope with later author quotations, rival sources, chronological events and Warburg semantic neighbors;
- create and track bounded **research jobs** for Work/Deep Research and additions to the *same* Atlas owner branch;
- maintain a navigable central register **pointing to** one author/institution/topic master, with progress/missing originals and crosslinks;
- prepare bounded, inspectable **Research Packets** for NIE, NotebookLM, article/essay authoring, KFB Triplets/dialogues, future card-index/editorial work or another independent project;
- see what is actually researched, private, proposed, committed and verified without a fake “Live” indicator.

**Ownership by layer (never overwrite across boundaries):**
```
Primary works / archival holdings / interviews
    ↓ faithful exact page or timestamp custody
GitHub Hidden Cosmology Atlas (source, atomic claim, typed relation, topic Return)
    ↓ read-only query + versioned packet IDs
Research Atlas GPT Site (navigation and permissioned task dispatch, no evidence master)
    ├─ Work / connected GitHub & Dropbox & Drive (bounded execution)
    ├─ NotebookLM / source list & document bundles (explicit, verified import only)
    ├─ NIE (user-owned private story-thinking system, separate schema & permissions)
    │     └─ independent ANALYZE | GENERATE | PLAY derivative
    └─ KFB editorial approval → canonical Card/Resident/Triplet owners
                                 → existing ChatterBox → Bubble / Emote / KFB Audio
```
The Site **does not own** the NIE's private knowledge base, NPC memories, game runtime, Card/Deck registry, source PDF art, ChatterBox timing, or actual Studio publication pipeline.

## 2. Verified donors and existing owners to reuse
**Research SSOT and registry:**
- `LIVING_HIDDEN_COSMOLOGY_ATLAS_v0.2.md` and `RETURN.md` on the same branch;
- `authors/README.md`, individual `authors/*.md`, `sources/jesse-michels-american-alchemy.md`, `relations/source-relations_v0.1.0.md`;
- `topics/wcc-samosa-network-2026-10-29/` (R4 ledger **46 source / 50 claim IDs**);
- `topics/jorjani-michels-trilogy-2025-2026/` (R2 ledger **21 sources / 26 claims**, with Puharich 1984 publisher recording, audio **unverified**).
- `ATLAS_ENTITY_REGISTRY_VIEW_R1_2026-10-31.json`: **derived** pointer view, currently **14 entity entries / 2 topic links**; 8 source-gapped existing authors, host/publisher Jesse, 4 proposed dossier subjects (Puharich has source-topic entry, Swann/Brown/Tesla in backlog), institutional WCC. This is **not a new editable author-claim DB**.

**Existing research process and reading contracts:** `WORLDVIEW_RESEARCH_CORE_v1.0.0.md`, `MULTI_DOC_AUTHOR_WORLDVIEW_NETWORK_WORKFLOW_R2_2026-10-13.md`, `HEXAGONAL_SEMANTIC_CONSTELLATIONS_R1_2026-10-13.md`, source-only WorldView plugin, Deep Research Atlas skill. Host vs interviewee quote boundary required.

**NIE and game receiving donors, not owned by this Site:**
- Actual public KFB donor `overworld/docs/NIE_ADAPTER_HOOK.md` explicitly **ARCHITECTURE HOOK / NOT BUILT**, `seed/source/faction/role/situation/relationship/mask/heat/language/bubble_type/length_budget/fallback/deadline_ms/context_budget` → `text/speaker/tell/bubble_type/emote_hint/timing_hint`. Historical proposed deadline ~700 ms and context budgets are not enforced by this research Site.
- `skills/chat/masterplan/CHATTERBOX_TOURBUS_REUSE_2026-09-14.md` and `skills/chat/research/hidden-cosmology-atlas/WORLDVIEW_PERFORMANCE_SITE_CONCEPT_R1_2026-10-13.md` set NIE → authored fictional mask → existing ChatterBox/Resident → Bubble/TTS, with canonical `deckId + cardNumber` for KFB Cards.
- `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/DECK_WORLD_SEED_CARD_PIPELINE_2026-10-04.md`: canonical Card source/semantic seed; no second card system.
- **Private NIE donor actually located/read through connected Dropbox** in this chat: user-owned graph design and the separate Story Thinking canvas. It explicitly restricts full NIE knowledge corpus to **local/private only**. Therefore **DO NOT commit private NIE files, local paths, full graph manifest, module descriptions or private document IDs** into public GitHub; use only public-contract semantics and user-authorized **redacted Lite-feed** if a later closed-workspace visual proof needs it. Historical designs/prototypes are donors, not current deployed site proof.
- `skills/chat/KFB_SITE_SURFACE_REGISTRY_2026-10-04.json`: current **KFB Production Hub** is canonical human front door; tools may have specialized GPT Sites but never become a second dashboard or Site/research SSOT. The research Site is a specialized tool **linked from the Hub after publication**, not a replacement Hub or an arbitrary unverified URL.

## 3. One screen, clearly different tasks, not generic dashboard chrome
**Proposed navigation by *work*, not decorative widgets**:
- **Investigate**: search across author, institution, topic, original work, direct source and individual claim. Results display direct source IDs, date, accessible repository path, private-source lock and exact research status. Search **source archive first**, external web second only for uncovered gaps.
- **Evidence**: source object **in isolation** first; then side-by-side original excerpt/edition vs later interview attribution vs independently sourced contradiction. Show event date vs publication/release date, page or timestamp, whether transcription/image/audio was actually checked. Name guest/host/editor/montage voice separately.
- **Atlas / Relations**: Wiki-style entity detail + backlinks and *toggleable typed* documentary graph versus source-assertion graph versus **noncausal Warburg neighbors**. Relation details show direction, source IDs, scope, editor and falsifier. Avoid omniscient force-graph spaghetti, use ego-network around chosen question/subject with progressive expansion.
- **Research Queue**: one named bounded question, prior completed source IDs and open original, source-access route and nonduplicative Work handoff. Status is visibly `DISCOVERED → SOURCE_READ → CLAIM_DRAFT → REVIEW_PENDING → GH_COMMITTED_AND_READBACK`; independent source truth is **never** implied by workflow status.
- **Dossier Register**: central **derived** author/institution/host/theme directory; distinguish `SOURCE_RESEARCH_ONLY`, `AUTHOR_DOSSIER_EXISTING`, `PROPOSED_INTAKE`, `PRIVATE_DONOR`, `READY_FOR_EXTERNAL_CONSUMER`. Editing a master routes to its correct source owner, not an arbitrary site-local record.
- **NIE / Export Desk**: select an exact versioned Research Packet, a use case and downstream owner; show what is actually supported by claims and what is **interpretation or authored fiction**. Outputs include research memo, historical essay outline, critical comparison, NotebookLM source/URL list, fictional NPC/worldview lens, source-constrained draft Triplet and future **Card-index proposal**. No auto-publishing into games; each consumer audits source fidelity and preserves canonical IDs.

**Small-first MVP UI:** Investigate + Evidence + Relations + one Research Queue action + one read-only export. Entity Register behind a compact searchable index. NIE and NotebookLM outputs can initially be **prepared packets** with copy/export, not fictitious working pipelines. Do **not** spend first slice building graph animation, fully automated agents or a generic ChatGPT-like message pane.

## 4. Connector and local-folder capability: honest implementation contract
**What is available to this ChatGPT conversation:** connected **GitHub** API can inspect and commit owner-branch files; connected **Dropbox** and **Google Drive** can search/read authorized resources. ChatGPT Work can use connected apps as a task executor where available and allowed. This is **not proof** that an independently deployed GPT Site automatically inherits these connectors.

**Connection stages for each provider:** `NOT_CONNECTED`, `CONNECTED_READ`, `AUTHORIZED_WRITE` if truly granted, `REQUESTED`, `RESULT_RECEIVED`, `SOURCE_CHECKED`, `PERSISTED_VERIFIED`, and `ERROR/UNKNOWN` as observed. Never render “Dropbox indexed”, “GitHub committed”, “NotebookLM synced”, “NIE running” merely because user clicked. Do not store API tokens in JS or write sensitive private data to a public repo.

**Intended orchestrated search operation** (illustrative request contract, **not deployed API**):
```json
{"jobType":"ATLAS_CROSS_SOURCE_DISCOVERY",
 "query":"Puharich 1984 man-made UFO statement",
 "scope":{"githubBranch":"research/hidden-cosmology-atlas-2026-10-13",
          "authorizedProviders":["github","dropbox","google_drive"]},
 "alreadyCoveredSourceIds":["JM-S16","JM-S17","JM-S19"],
 "privacy":{"publicGitHubWrite":"PROVENANCE_ONLY","originalPrivateSourceAccess":"AUTHORIZED_ONLY"},
 "desiredOutput":"SOURCE_GAP_REPORT_AND_PROPOSED_CLAIMS"}
```
Do **not** assume remote Site javascript can traverse `/Mac` or `/Dropbox` paths merely because their names appear in the linked Dropbox cloud account. A *synced Dropbox folder visible through Dropbox API* is an **authorized remote file**, not raw local OS access; true local-only files need user desktop/Work computer bridge with explicit consent and real implementation. Avoid silently syncing private NIE corpus or publishing private source metadata.

**Work dispatch seam:** Site can present copyable bounded Work handoff/job packet while no verified Site→Work execution API exists. If a host-native action is later available, integrate it with real authorization, completion ID and readback. Otherwise choose a manual Work job; never implement an inert fake “Run research” button or claim background jobs occurred.

**GitHub mutation seam:** Only user-authorized research updates in existing branch, compare source commit/revision before writing, write source→evidence→Return, then read branch head and intended files. Direct Site authoring should require a real connected write-capable component and reviewer rules. A site-local draft is `NOT_COMMITTED`.

## 5. A truthful end-to-end acceptance reference — no invented source cards
Use [Puharich–Jorjani complete case](RESEARCH_ATLAS_END_TO_END_CASE_PUHARICH_JORJANI_R1_2026-10-31.md), **not dummy fixtures**.
- Search `Puharich` → actual topic → `JM-S16` purported 1984 transcript (publisher 2026-09-16).
- Open source in isolation with **audio minutes checked = 0**; open original external URL.
- Show `JM-C19`: Puharich ~90% **all UFO sightings man-made**, as publisher-attributed claim.
- Compare `JM-C21`: Jorjani 2026 ~90% **close encounters from US fleet**; show exact changed subject/denominator.
- Show `JM-C22`: **half staged abductions** remains `ORIGINAL_NOT_RECOVERED` in inspected text; retain uncertainty.
- Graph: `JM-H09` publication transmission, `JM-H10` author assertion, `JM-W10` noncausal scope change; no fabricated `WCC_FUNDS_PUHARICH` edge.
- Prepare a bounded Work original-audio research request; statuses stop at **PREPARED** unless someone executed the provider action.
- Select **historical essay/critical research** export and **NIE ANALYZE proposal**; both show sources/claims and exact GitHub revision, and may be inspected without creating a KFB game Card or purported author voice.

**Acceptance matrix for the FIRST usable Site milestone (not claimed passed):**
| Gate | Exact proof required | Fail condition |
|---|---|---|
| A Source Fidelity | A real source object isolated; public URL, authorship, edition, event/release dates and coverage visibly correct | Loaded URL or synthetic placeholder represented as inspected original |
| B Claim Precision | JM-C19, JM-C21 and JM-C22 separated with changed denominator and unresolved original highlighted | Unverified 50% promoted to fact; speaker/host conflated |
| C Typed Relations | 2 documentary/source-report and 1 noncausal edge clickable with source IDs/falsifiers | Graph implies funding/cause from conceptual neighbor |
| D Register | Known 8 author files, source host, candidate Puharich and WCC/topic pointers resolve without duplicates | New parallel editable author/claim master |
| E Work Boundary | Job handoff actually readable; no fake connector success; real GitHub writes independently verified if performed | “Submitted”, “synced”, “saved” or “run” without provider receipt |
| F Cross-Context Export | Packet resolves `JM-S/ C/ H/ W` references and contains provenance and absent-source flags | Fiction/Triplet flattened into a historical quotation |
| G Privacy | No private NIE full graph, private Google Doc IDs/content or Dropbox-local file paths in public Site payload | Unreviewed private sync/public leak |
| H Presentation | Reused source-proven KFB UI/graph donors shown in isolation and tested; no replacement branding | Generic admin template, invented art/avatars or unreadable graph |
| I Publication | Real GPT Site deployment and direct URL opened with correct revision; subsequently Hub link; Cloudflare only if formal requested | GitHub PR interpreted as public/live Site |

## 6. NIE, NPC worldviews and outputs — precise owner handshake
**Research output** should have `sourceRevision, topicId, entityIds, sourceIds, claimIds, relationIds, sourceLimitations, authorStatements, editorialInterpretation, unresolved, usageRights`. Downstream **NIE Story Thinking** may evaluate meaningful conflict, viewpoint asymmetry, institutional incentives, mythic motifs and plausible causal sequences, but this remains a **derivative analysis of source-grounded claims**, not new historical evidence.

**Mode and output classification:**
- `ANALYZE`: compare documented claims, narratives, rhetorical shifts, how a story frames or reframes evidence; produce analytic brief or narrative diagnostics.
- `GENERATE`: create derivative essay structure, conflict arcs, scene choices or original satirical propositions **labelled as editorial fiction**.
- `PLAY`: prepare a source-backed worldview *lens* plus canonical KFB Resident/card state for **existing** game presentation owner; no direct source→NPC runtime shortcut.
- `NOTEBOOKLM_SOURCE_SET`: curate public URLs or rights-cleared private Drive documents, correct source names/revisions; **import/refresh remains unverified until notebook actually shows sources**.
- `CARD_INDEX_DRAFT`: propose cards/metadata keyed to actual existing card registry or mark `NEW_CARD_CANDIDATE`; only existing canonical Card owner can create/change official cards.
- `TRIPLET_DRAFT`: source-grounded Subject → Connector → Reframe / contradiction with explicit attribution map, actual speech and performance separately drafted. Existing Triplet/ChatterBox/Resident owners approve; never invent a quote or force all scenes into three phrases.

**NPC long-term knowledge:** keep an external `worldviewLensRef + evidencePacketRef + authoredCard/DeckRef + localRelationship/context` pointer, not gigabytes of raw Puharich, Tesla, Jorjani or Farrell files inside each NPC. Retrieve bounded passage sets when needed, subject to current memory/context budgets, and hand a short beat to ChatterBox without blocking game frames; on timeout preserve the existing `OW_PHRASES` fallback and silence when valid. This is a **future boundary design**, not evidence that the current game already queries NIE or the Site.

**Warburg/Gabriel:** keep textual and visual neighbor views as explicit editorial explorations; field-of-sense criteria vary by source object and are not a six-way universal truth grid.

## 7. Source/visual selection and experience
Do **not** design generic UI chrome for a source archive. Reuse verified KFB design-system donors (existing KFB Hub and source-proven editorial/graph explorations) **after inspecting source object in isolation**. The previously discovered **private NIE Graph Viz handover** can guide an *authorized closed-workspace* design proof using **redacted Lite-feed only**, not the private full 219-node corpus exported to GitHub. No false claim that any donor visually passed current tests.

UX should prioritize **click-to-evidence**, searchable tags and reversible graph exploration over full-screen animation. A graph only appears when the clicked relation has a source and typed status. Single high-information page may show source, excerpt, claims, edges, history and export; it must work in a plain list view without motion. Show narrow readable text excerpts rather than turning research into a circus of faceless bubbles.

## 8. Proposed delivery phases, roles and real stop conditions
**This chat only authors this brief and evidence-contract files. It does not build or publish a GPT Site.**

- **Phase A · Source data wire-up:** independent executor loads exact branch/PR, passes **one-case Puharich** read-only source/claim/edge + central registry resolution and reports exact source revision / missing originals. No new database. In Work/Code environment, generate any **derived** index in memory or as reviewable output; originals stay GitHub.
- **Phase B · Small genuine research reader:** Site-capable executor creates/updates one **specialist Research Atlas GPT Site** only after checking Site registry and demonstrating reused source design donors in isolation. Minimal Investigate/Evidence/Relations/Queue/Export, using actual source objects, not placeholders. Site URL identity must be recorded only after publication and direct browser proof. Research Site is linked from existing KFB Production Hub after success; Hub remains the only cross-KFB dashboard/front door.
- **Phase C · Authorization-aware Work dispatch:** real connected provider source search and bounded research job *only where a tested action exists*. Otherwise explicit PREPARED HANDOFF, no fake running indicator; GitHub persisted checkpoints require exact branch readbacks.
- **Phase D · NIE + KFB consumer packet handoff:** verified read-only analyst export, then separate private NIE intake and existing game Triplet/Card/Resident receiver acceptance. Do not require all of Phase D to demonstrate Phase B's reader value.
- **Phase E · Later cross-domain expansion:** user-approved dossiers Puharich, Ingo Swann, Thomas Townsend Brown, Nikola Tesla; enrich existing Farrell and Liszt rather than fork. Graph complexity after at least two grounded topic families. No mandatory Neo4j, no unbounded “autonomous agent” runtime.

**Execution-role split for substantial implementation:** one Site-capable Builder/Integrator only writes Site; independent Integration Tester checks actual data/clicks; independent Critic evaluates source fidelity/visual product; Production Guard determines REPAIR/QUARANTINE/STOP; Georg only sees concrete product gate when a real reader has been published. A failed data/source fetch does not manufacture success or force a new runtime architecture.

**Formal Stage/promotion:** For Site-capable product, GPT Site is primary per `CHAT_GITHUB_KFB_STAGE_WORKFLOW.md` and `KFB_SITES_FIRST_DELIVERY_POLICY_2026-10-04.md`. **No Stage URL at briefing stage.** If later formal KFB-Hub Cloudflare acceptance mirror is required, it must be a direct `https://kayfabizarro.pages.dev/...` page linked in existing Hub, opened to visually verify correct revision; no GitHub Pages/githack/raw/local acceptance link. No automatic merge or Live.

## 9. Ready-to-run Work / Sites implementation start
> **Executor:** ChatGPT Work / Sites-capable implementation environment, single writer and independent tester. **Repo:** `georg-doc/kayfabizarro`; owner branch `research/hidden-cosmology-atlas-2026-10-13`, Draft PR #394. **Read first:** `skills/chat/START_HERE.md`, `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`, `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`, current `skills/chat/research/hidden-cosmology-atlas/RETURN.md`, this brief, `ATLAS_ENTITY_REGISTRY_VIEW_R1_2026-10-31.json`, `RESEARCH_ATLAS_END_TO_END_CASE_PUHARICH_JORJANI_R1_2026-10-31.md`, existing `WORLDVIEW_PERFORMANCE_SITE_CONCEPT_R1_2026-10-13.md` and `overworld/docs/NIE_ADAPTER_HOOK.md`. **Outcome:** one source-true read-only Meta-Admin Site prototype for the real Puharich case with central entity register, evidence-vs-interpretation graph and a non-inert Work job handoff (or visibly PREPARED_ONLY), then one source-grounded export. **Donors:** inspect real KFB Hub/graph design source objects in isolation first; only use private NIE sanitized Lite-feed in authorized closed workspace; no public corpus duplication. **Checks:** exact GitHub reader revision, real `JM-S16, JM-C19/C21/C22, JM-H09/H10, JM-W10` visibility, privacy, mobile/desktop, auth error, no false connector status, direct GPT Site URL open after publish. **Return:** exact Site project/version/URL if published, screenshots/browser evidence, GitHub branch head, code/tests, blocked/untested, source/Hub registry pointer updated only when truthful. **Stop condition:** usable narrow source-accurate reader or explicit proven blocker; no generic new game runtime, no auto-merge or Live.
 
## 10. ONE next productive implementation gate
`RESEARCH_ATLAS_SITE_PUHARICH_EVIDENCE_READER_01`: demonstrate the real source `JM-S16` → `JM-C19/C21/C22` → `JM-H09/H10/JM-W10` → bounded Research Packet, with provenance/private-source protection, in the actual Site-capable product environment. **Georg's product-direction gate is already decided: SITE YES.** No further abstract architecture approval is needed. Keep the historical `PUHARICH_1984_AUDIO_AND_REMAINDER_ABDUCTION_CLAIM` as a separately tracked **original-research** gate; the first reader must show it OPEN, not block an accurate read-only Site.
