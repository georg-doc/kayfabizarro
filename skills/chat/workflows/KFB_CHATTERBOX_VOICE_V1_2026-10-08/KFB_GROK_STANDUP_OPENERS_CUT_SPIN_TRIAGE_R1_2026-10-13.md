# KFB Triplets · Grok stand-up opener and Cut & Spin idea triage R1
Date: 2026-10-13 · Owner: existing KFB ChatterBox Voice/content Draft PR #379, branch `planning/kfb-chatterbox-voice-layer-v1-2026-10-08`.
Status: **INCOMING EDITORIAL RESEARCH / CATALOG PROPOSAL — NO PRODUCTION OPENERS ENABLED**.
Input: Georg-supplied German stand-up/improv opener memo and detailed English "Modular Knowledge Base". The memo calls some ideas "research-backed" but supplies no primary citations; treat as **ideation**, not externally verified findings or a complete writing mandate. Examples of named comedians are pointers to rhetorical patterns, not phrases or copyrighted routines to reprint in KFB.

## Binding invariant — what an opener may and may not do
- A self-contained **Card Beat**, potentially multiple very short sentences but **one physical script line per Card** separated by a blank line, is the independent unit. It may be shuffled without a Bridge. Card name is spoken, actual POWER and LORE are present and semantically related (for strict Triplet); no mandatory additional end punchline.
- An opener is **stage framing** in front of the original Card. It must be short and not replace the source's joke or artificially claim source history. A question like "Ever tasted" is permitted only for verified food-related Cards. `I once met` or `I went to a restaurant` assert **PERFORMER_FICTION**; these require explicit opt-in and cannot become Card canon.
- A **Set-level pivot** (e.g. "Anyway" or a meaningful silent pause) is neither an on-Card Triplet, nor automatically a causal inter-Card Bridge. "Speaking of" is a thematic link only when an actual shared source detail is demonstrated, otherwise the operation is `CUT/PAUSE`.
- `SREP`, `Rule of Three`, `Tag`, `Act-out`, `Callback`, `Misdirection` or `Escalation` are **optional** layers. No fake source elements to satisfy a template, no contrived punchline after a Card with a strong existing absurd ending.
- Crowd work, "I've never", fake local references, room energy and personal life stories are prohibited as uncontrolled static auto-content. Only genuine permitted situational input or explicitly fictional character-performance direction can unlock them.
- Beat can be **compact semantic** (POWER+LORE essence, may fail 90%-content retention) or **full-source recital** (Card title+full POWER+LORE; can be editorially flat). Neither becomes human-accepted comedy from structural tests alone. Track original-card word usage and source-information coverage separately. Fixed performance outro `Stay Fluffy!`; optional Fluffhead greeting once per set. Default audio intent **dry voice only**, no new music engine.

## Triage: KEEP / TUNE / CUT

| Grok idea | R1 classification | KFB action |
|---|---|---|
| "Do you know…", "Ever heard of…", rhetorical questions | **KEEP** | Source-neutral short opener; title spoken; existing runtime working |
| "Have you ever tasted…?" sensory opener | **KEEP WITH SOURCE GATE** | Food-source only, Cookie is genuine source-qualified |
| Brief premise / anecdote framing | **KEEP / TUNE** | 6–8 words is a heuristic, not a hard invariant; emit only if opener fits actual card |
| "I once met…" / restaurant order | **TUNE: EXPLICIT STAGE FICTION** | Person/food class and overt performer-fiction opt-in; no false original Lore |
| "Anyway" / "Speaking of" / thought pause | **KEEP AS SET REGIE** | Normal noncausal topic cut / actual shared sourced theme; never masquerades as state Bridge |
| Misdirection, expectation/reversal | **KEEP WHEN IN SOURCE** | Existing Power/Lore often contain the inversion; no new fact and no forced final payoff |
| SREP / 4-step escalation | **OPTIONAL** | Some cards are better single absurd facts; don't require four steps |
| Rule of Three | **OPTIONAL SOURCED ONLY** | Three authentic items or none; don't invent 2 ordinary examples |
| Callbacks / bookending | **OPTIONAL SOURCE-STATE** | Only reuse a named previous source Card/motif when previously spoken |
| Act-outs / pacing and room rhythm | **KEEP IN PERFORMANCE METADATA** | Persona, emphasis and pauses, not an unproven additional spoken gag |
| Crowd-work / real room observations | **BLOCKED FOR STATIC DECK OUTPUT** | Needs real current input, user permission, authentic source |
| "always get early guaranteed laugh" | **CUT AS GUARANTEE** | Outcome is uncertain; source fidelity and human listening decide |
| generic meta-commentary about the opener itself | **LOW PRIORITY / BLOCK DEFAULT** | Repetitive AI-adjacent filler, not a card fact or meaningful reframe |
| multi-agent/RAG for runtime improvisation | **NOT THIS EXECUTION** | One-time optional Web Chat research feeds editorial review, published candidate pool is LLM-free in-game |
| auto-generated unrelated tags/angry escalations | **CUT DEFAULT** | Invites AI slop and ungrounded extra incidents |

## Catalog created, not enabled
**Proposed source-first sidecar:** `data/KFB_STANDUP_OPENER_CUT_SPIN_CURATED_CANDIDATES_R1_2026-10-13.json`, Git blob `46a48327fca3a6e6606de63623e677aa6a6923cf`.
- Exactly **6 present** in existing `tools/assemble_standalone_card_beats_r1.cjs` blob `41db1d6a9f296a4fe6323894f50e3d6b1ee4a96d`: DIRECT, HEARD_OF, DO_YOU_KNOW, EVER_TASTED, I_ONCE_MET, RESTAURANT_ORDERED.
- Exactly **6 additional editorial candidates, not activated**: ANYONE_HEARD_OF, LET_ME_TELL_YOU_ABOUT, QUICK_QUESTION, YOU_KNOW_THE_THING_WITH, DID_YOU_EVER_TRY, WHAT_IF. The latter two remain **blocked until a source action/condition grammar exists**; a bracket placeholder with no source must never be spoken.
- Six set management candidates: THOUGHT_PAUSE, ANYWAY, SPEAKING_OF, THAT_REMNDS_ME (identifier pending spelling correction), CALLBACK, ROOM_OBSERVATION. None is a causal Bridge. ROOM_OBSERVATION blocked for static auto-Suno.
- Eight optional techniques/guards, including explicit `EXTRA_PUNCHLINE = NOT_REQUIRED`.

## Real checks
Checked current exact GitHub Opener module and source-pinned Card #10 `The Cookie of Causality` against proposed catalog in V8: **21/21 structural/source boundary assertions PASS**, verifying six existing runtime IDs and identical textual opener prefixes, six unenabled proposed IDs, preserved source fact gates, opt-in stage fiction, no default SREP/Punchline/Room work, separate pause/bridge forms, original source blob and fixed dry/cut separation contract.

**Not performed:** No new Opener runtime tests of proposed six (not enabled); no independent comedy criticism; no new Cookie DRY audio, Suno generated song or full deck human judgement; no private plugin release; no Audio Site, World, Billboard or Scenelet build. The additional `THAT_REMNDS_ME` proposed ID spelling should be normalized to `THAT_REMINDS_ME` when the future consumer is implemented; it is **not runtime-facing**. Do not silently claim changed code.

## One next gate
`KFB_STANDALONE_CARD_BEAT_R1_EDITORIAL_LISTENING_GATE` — use existing compact vs full-source Cookie and 2–3 SHORT source-compatible openers, dry spoken audio. Georg decides what makes a standalone bit both faithful and enjoyable, with no forced added joke, before activating further patterns or patching the existing private Triplets v0.1 plugin. No new Site or Work necessary for this content research checkpoint.
