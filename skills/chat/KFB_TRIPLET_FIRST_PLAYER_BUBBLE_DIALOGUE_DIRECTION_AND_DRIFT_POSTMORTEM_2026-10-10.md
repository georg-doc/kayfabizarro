# KFB · Triplet-first Player/NPC Bubble Dialogue · Direction + Drift Postmortem
Date: 2026-10-10
Status: GEORG DIRECTION · AUTHORING ONLY · NO RUNTIME AUTHORIZATION
Receiving owner: existing KFB ChatterBox / Resident authoring and Social Edge/Triplet lineage.
Adjacent concurrent owner: Prison/Minigame planning, including Toy Soldier voice/Triplet seed.
Branch: planning/kfb-fluff-crafting-almanac-ideation-2026-10-09

## Georg decision — semantic triplets are primary
The earlier MVP-1 “20 resident dialogue lines” batch is **retained as optional situational/scripted dialogue candidate**, not a Triplet implementation and not the standard NPC dialogue layer. Never silently convert it into runtime canon.

Triplets are three *semantically substantial* pool-fed components, not a two-part sentence where the middle is only “is”. Existing grammar: `subject → connector → reframe`. Connector must contribute a relation/qualification, for example `Freedom / is ultimately / the greatest virtue`. Strong, sometimes surprising connector/verb and an interpretable relation matter more than a rigid per-token minimum. English is the public game language.

Selection is driven by grounded character/player/world perception, meaningful neighbourhoods (Warburg), character-specific Sinnfelder/registers (Gabriel), thought moves, and Social Edge relationship context. Build the interpretation gap for player closure; do not explain the joke. Sources include canonical Card JSON and actual PDF/Card visuals (distinct authorities), current billboard/quote content, actual character/actor visuals including prominent features/accessories, observed world/action context, memory and relationship receipts. No invented visual claims or ungrounded source assets.

Shared semantic pools; speaker signatures are weights/provenance rather than exclusive private pools or mandatory catchphrases. Social modes can cover Buddy Banter, Clown Roast, Dark Heel, Toy Soldier Needle and deeper hurtful antagonistic banter with context/relationship safeguards; reuse existing Social Edge canon. Character/player worldview, era/sociolect, visual and humor lane change selection and reading. Fluff-o-lect is an optional *later* obfuscation/transformation (initially OFF) of at most a bounded fragment, never an excuse to mask poor semantic triplets.

## In-world single-bubble UI direction (proposal, not built)
Usually 1 NPC bubble when interacting; at most 2 visible NPC bubbles in range. Short triplet readability is an acceptance property, not general 1–2 long sentences.
Existing KayfaBINGO / KayfaBOGGLE / KayfaBONGO should be selectable *within* the bubble/dialogue scene; BLÖDSINN! is LEAVE/ESCAPE, **not** a fourth competing response or mandatory NPC spoken label. Preserve actual existing operator semantics; this paragraph does not redefine them.
After player click, the **player character's own bubble** can render a short, profile-weighted semantic Triplet selected/transformed from that response lane, Monkey-Island-style. This is a proposed UX behavior, not confirmed implementation; avoid second dialogue state owner. Bubble text remains authoritative when muted. Silence remains valid. Existing ChatterBox, player controls, social call and audio owners stay authoritative.

## Candidate mathematical authoring model — nonbinding
`T=(S,C,R)`; with context `X` and speaker profile `P`, sample/curate:
`score(T|X,P) = groundedness + semantic_fertility + speaker_signature + relation_fit + social_edge_fit + comic_readability - repetition - overexplanation - unsupported_claims`.
No coefficients or quantitative thresholds have been approved. This is a review vocabulary, not runtime formula. Allow creative inversion and incongruity, but do not confuse random adjacency with productive contrast.

Example candidate only, *not* confirmed source-backed visual:
`Free will / comes with / a winding key` (Toy Soldier actor-key visibility must be proven before a visual-grounded claim).
Review as three *editable columns* with optional source anchor, character bias, relation class and brief context. PASS/TUNE/FAIL can apply to whole triplets and individual components.

## Mini-postmortem · B_chat_mvp1-dialog
**Observed drift:** initial brief asked for 20 NPC lines, 1–2 sentences, `speaker/situation/de/en/source` and a Monkey Island style; it failed to encode three reusable pooled fragments or the closure/gutter architecture. Execution complied with the surface instruction rather than checking current Triplet lineage. Follow-up wrongly interpreted “triplets” as 3-turn dialogue.
**Root causes:** incomplete handoff contract **plus** failure of receiving assistant to recover current ChatterBox/Sinnfeld spec before producing dialogue.
**Impact:** generic, often too-long scripted one-liners with low source anchoring; no mathematical/semantic combinatorics or player bubble feedback.
**Disposition:** quarantine the 20 lines as NONPRIMARY_SCRIPTED_DIALOGUE_CANDIDATE; not deleted, not accepted as game dialogue, not placed in active Triplet pools.
**Prevention:** every future dialogue brief must say `TRIPLET_FIRST subject/connector/reframe`, show editable three-part specimens, name source-backed context and profile/weighting, prove bubble legibility and closure, distinguish scripted quest instructions as exceptions, and avoid authoring on a stale brief alone.

## Explicit concurrent-lane boundary
Read most recent `KFB_GLOBAL_SINNFELD_GOOD_NEIGHBOURHOOD_TRIPLET_AUDIT_2026-10-10.md`, `KFB_CHARACTER_SINNFELD_REGISTER_PROFILE_SCHEMA_V0_1_2026-10-10.json` and `KFB_PRISON_TOY_SOLDIER_TRIPLET_POOL_V0_1_2026-10-10.json` **from their current branch revisions** before future authoring. This note does not overwrite those files, the 33-entry Toy Soldier seed, or any active web-chat authoring.

## Next one gate
`TRIPLET_FIRST_BUBBLE_REVIEW_01`: review curated Lorekeeper/Farmersfrau/Toy Soldier triplets in-chat using 3-column PASS/TUNE/FAIL, with explicit source anchors and NPC-to-player bubble response examples. No runtime/site/Stage/merge/Live until separately authorized and owner-accepted.
