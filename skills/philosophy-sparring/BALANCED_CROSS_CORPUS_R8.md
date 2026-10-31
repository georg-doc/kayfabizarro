# R8 · Balanced Cross-Corpus Meta-Analysis (Public Protocol Only)

Status: **CURRENT METHOD PROPOSAL / STATIC TEST ONLY / NO HUMAN ACCEPTANCE**  
Owner: `skills/philosophy-sparring` (existing owner). No separate KFB Author Dossier owner, no runtime integration.  
Privacy: **NO private manuscript names, private excerpts, personal thought-style matrices, exact personal citations, author identity or private Drive links** in this public document.

## Purpose

A sequence of essays can lead an LLM to mistake the most recent or most emotional topic for the defining intellectual style of the author. This produces **recency bias, topic bias, genre confounding and a misleading intellectual persona**. An independent prior review of each original, followed by a cross-document matrix with counterexamples, is the remedy.

## Operative source list

Only source metadata kept in private user-controlled storage:

`source_id | user_declared_role (ORIGINAL / AUTHOR_REVISION / DERIVATIVE) | private_path | date_confidence | scope | permissions`.

An adaptation never counts as an additional independent original. Authored text, editorial editing and assistant rewriting must be labeled separately. Avoid presenting chronology based solely on filenames or file timestamps as a definitive intellectual evolution.

## Eight-axis same-template review for *each* original

1. **Argument architecture:** initial distinction, main thesis, intermediate dependencies, normative pivot, final implications; include located textual evidence.
2. **Kinds of inference:** empirical, historical, conceptual, hermeneutical, normative, theological, clinical; identify unargued bridge claims and contradictions, not merely rhetorically named oppositions.
3. **Language selection:** principal written language, Latin/English or other technical vocabulary, translation choices; do not infer permanent preferences.
4. **Diction and syntax:** clause structure, self-repair, connectors, reformulations, question density, sentence rhythm; compare within genre and text length.
5. **Rhetorical action:** question as request versus premise test, contrast, metaphor, exemplum, source transition, ironic or polemical function.
6. **Text tone and subtext:** stated urgency, cautious qualifications, polemical passage, hope or resignation **as properties of the prose**; no emotional, clinical or psychological state inference.
7. **Source and tradition practice:** explicitly named authorities and works, citation roles, primary vs secondary, source completeness, evidence verification; reference does not imply endorsement or 'favorite thinker'.
8. **Dialog implications and disconfirming evidence:** what the assistant should do next, what would be an overfit, a concrete counterexample from another passage, uncertainty and needed author confirmation.

Keep these categories in the exact same order for all originals; record 'not observed / cannot determine' rather than fill gaps with guesses. Short texts are neither less original nor inherently less complex; long texts may show more instances just because they are longer.

## Consolidation with opposition and uncertainty

For each cross-corpus pattern retain:

```yaml
pattern_id: CROSS-001
textual_observation: ""
supporting_source_ids: []
supporting_sections: []
counterexample_source_ids: []
possible_genre_or_date_confound: ""
classification: "O1|O2|I1|P1|X"
inference_limits: ""
assistant_behavior: ""
user_or_author_confirmed: false
safe_storage: "private_only"
```

- `O1`: directly visible in one original.
- `O2`: recurring across two or more independently designated originals, with explicit exceptions.
- `I1`: interpretive relationship or subtext hypothesis, not authorial self-description.
- `P1`: a **specific person's explicitly stated feedback**; user/editor feedback must not be misattributed to the writer.
- `X`: unverified, dependent on other versions, missing context or uncertain source.

No fixed numerical weighting favors newer sources. Evidence quality, independent attestation and genuine counterexamples decide. A one-off high-value argumentative innovation remains worth discussing without claiming a recurring style.

## Cross-essay intellectual traditions

Create a **source-role matrix**, not a fan or adherence list:

`Author/work → which manuscript → quoted or alluded? → specific argument role → exact source checked? → agreeing, opposing or reframing? → original edition? → confidence`.

Tradition labels are **proposals** until directly substantiated. Dissent from a doctrinal institution is not proof of secular ideology; use of a school as an external critical framework is not an unqualified allegiance.

## Conversational consequences

- Follow the actual argumentative movement, not a topical tag.
- Respect a rigorous German register and long syntactic movements without imitation or style policing; use the user's actual conversational preferences when available.
- Before asking, discard obvious textbook dialectics; advance one consequence that changes a normative or evidential burden.
- The author might be tentative in one genre and forceful in another; avoid automatic praise, affirmation, provocation or artificially hopeful endings.
- With new texts, **rerun the full symmetric cross-corpus matrix** and test earlier patterns for exceptions; do not append only a topical note.
- An author-specific profile can be used in future ChatGPT/Claude chats only from a genuinely accessible **private** file with user consent. A public GitHub URL does not expose its contents and creates no cross-model memory.

## Evidence, release and privacy

A detailed six-original corpus comparison was produced privately and stored in an owner-only document outside GitHub. Its source details, author name, private publication history and source-specific findings are not included here, and cannot be reconstructed reliably from this method alone.

No Stage, public site, runtime, KFB game avatar or new author-dossier owner. Static checks validate only presence and consistency of these instructions; source-grounded dialogue and author-feedback evaluations remain outstanding.

## Synthetic tests

G22 = recency/topic-bias rejection; G23 = stylistic variability and non-diagnostic subtext; G24 = private storage/consent boundary. Evaluate them only through real conversations; no fabricated acceptance.
