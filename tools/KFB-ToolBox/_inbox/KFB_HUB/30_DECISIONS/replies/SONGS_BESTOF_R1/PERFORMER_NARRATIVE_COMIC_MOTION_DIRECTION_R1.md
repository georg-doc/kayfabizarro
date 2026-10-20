# WSA · Deck song dramaturgy × character performance × Comic Motion · R1
2026-10-20 · **GEORG CREATIVE STEERING / IMPLEMENTATION PROPOSAL**, not a new global canon or automatic checker amendment.

**Existing owner:** `kfb-triplets` Writer's Room / WSA-SONGS-BESTOF-R1. **Existing song branch:** `wsa/songs-bestof-r1-2026-10-18`. **Reference example:** [Alice isolated performance](ALICE_USER_EXEMPLAR_2026-10-20.md). **Binding song spec until separately reconciled:** `replies/SONG_SPEC_R3.md`, `song_gate.py` R3.7, V-528; WS0 final approval. No second music/runtime/Cards owner.

## Intent preserved from Georg
The Alice demo is **one author example**, not a universal framework, intro template, prescribed cast, genre or forced sequence. Each song and its opener/outro must be distinct to its deck, atmosphere, satire, thematic clusters, philosophical/cultural layers, and the named performing character's own view of the world. Possible *directions*, not mandatory categories: wrestling show, absurdist tale, conspiratorial transmission, bittersweet romantic confession. Avoid AI filler, interchangeable jokes, repeated opening phrases, generic host voice, rulebook recital and identical dramatic arcs.

**Core design principle:** Make the music a complete short performance in which named cards relate through cause, contradiction, reversal, callback and juxtaposition. One track per deck where possible, selective best-of for long decks according to dramatized meaning, **never** the first N cards by default. The printed card remains authoritative. Introductions contextualize the game and tell the audience what role to occupy when it serves the piece; they must not all be "welcome to the card game." The performer introduces their *own* number and may have an explicit identity, stance and manner of speaking. Original text and card voices remain separate: performer as frame/viewpoint, cards as evidence/opponents/agents. Neither should be forced into fixed impersonation patterns.

## Why Alice is instructive (descriptive, NOT six mandatory steps)
- Its direct audience address (`Yo! Are you fluffy?`) creates an act, not a textbook introduction; `you play the jury` gives the listener a situated part.
- The corporate meeting setup turns the Wonderland court into an understandable satirical analogy, while the hat/raven references reward informed listeners without excluding novices.
- Its linking beats generate causal comic editing: verdict → clandestine pardon, locked hall → cake/bottle size shifts, roses → concealment, riddle → tarts → nonsensical evidence.
- Intro and style work together: electro-swing band punctuation, low-register spoken performer and court-room entertainment feel connected; other decks require genuinely different sonic identities.
- The outro points back to the meeting/feedback theme. A possible creative improvement, **not an imposed replacement**, is to pay off the `you play the jury` promise: the audience's verdict is immaterial if sentence preceded trial.

## Scope of onboarding / understanding
Music creates **world, tone, relationships, player viewpoint**. It does **not** need to verbally teach all mechanics. Comic Motion can make the underlying Cut & Play medium legible across multiple episodes via occasional authentic printed card reveals, a hand-mediated cut/place/combine moment if it matches real analog rules, and the transformation into a comic scene/game representation. Do not invent analog mechanics in text or film just for explanatory clarity.

Do **not** make a static song slideshow of thirty generic card thumbnails. Use source-backed card/art objects with their preserved identities, and visual dramaturgy: sometimes a card close-up, sometimes a 2–3-panel gag, brief scenelet, confrontation, animated transition, or an intentional still. Mapping should be `deckId + cardNumber + lyric/beat span + verified source art + role + scene cue` for eventual `kfb.performance/1` / existing WSV/WS1/WS0 pipeline. Beat timestamps must come from **actual exported Suno stems/audio**, not from generated guesses. Keep graphics, subtitles and card titles legible, and avoid inventing a second card DB, comic runtime, audio mixer or voice pipeline.

## Flexible craft questions (not a hard template)
1. Who is performing, from what position, and why would **this** voice introduce **this** deck?
2. What is the audience meant to realize about the deck's social/philosophical proposition, without a lore lecture?
3. Which cards form a cause/effect/contradiction chain and which may be omitted from best-of without erasing the thesis?
4. What tonal and musical changes let a complex line breathe? Which source-backed image or printed card could carry the next bridge visually?
5. Can the end land a payoff specific to the opening **or deliberately subvert it**, rather than pasting on a catchphrase?

The questions aid editorial judgment; a song may legitimately use another dramaturgy entirely. Prefer a distinctive coherent piece over checklist conformance.

## Current gate conflicts — WS0 reconciliation required, do not secretly patch
- **C9 first-beat-title requirement:** Alice opens with an energetic audience address and names the deck afterward. Artistic example may be worthwhile but under current literal C9 is not automatically PASS.
- **Neutral/unnamed narrator:** Georg now expressly allows character-specific performers announcing *their* own number. The current R3.7 C9 restriction on fixed narrator/FrizzleBob must be reconciled with a verified role, not globally disabled without decision. Performer's lyrical voice/metadata and sonic-only Suno STYLE remain separable.
- **A6 bracket rule / C8 layout:** `[cheering crowd]` is a sound-production cue, not a spoken card line. Current gate may reject it; either represent it in the existing performance cue channel or WS0 authorizes an explicit stage-direction treatment.
- **D13 tempo/style:** Alice's submitted STYLE has no numeric BPM; it is not claimed to pass the current 100–130 BPM checker. Do not flatten the character of the groove merely to produce a numeric field.
- **A4 card line length and A2 source words:** The human example has not been measured against printed Alice card JSON/PDF. Preserve the authentic performance as a **donor**, and perform a separate source/gate pass on any final production track. Avoid optimizing away crucial storytelling to meet a length quota.
- **Creative distinctiveness vs automated compliance:** the mechanical gate can test source and structure but cannot decide whether a song is a compelling integrated work. Maintain separate independent critic + WS0 editorial decision, no forged scores.

## Production flow / boundaries
1. Retain full isolated Alice exemplar. WSA develops an individual performer-specific deck thesis and narrative chain based on printed source, then a short draft lyric/style for the named deck; no mechanical clone of Alice.
2. Check printed source and true best-of selection first. Retain the legacy/WS0 gate outputs *as factual evidence*; route any editorial/spec contradiction to WS0 without lowering rules unilaterally.
3. After source, lyrics and STYLE pass the authorized gate and blind independent critic, Georg chooses the actual Suno performance. Export chosen audio/mix and, when produced, stems for WS0/WSV/WS1 timing, lipsync, camera/card-billboard choreo. No assumption one generation consumes exactly one credit.
4. The Song Hub card can contain STYLE + LYRICS with authentic source/gate/review status. A later Comic Motion onboarding piece may reference the same song/card source. No Hub card is complete or live until WS0's real final check.
5. Retain batch 1's 20 candidate decks as planning inventory only. The existing ungated Biological Metropolis WR1 is **not rewritten or promoted** by this note.

**Single next gate:** WS0 reconciles C9/performance identity and nonspoken stage cues with Georg's exemplar before WSA locks the first song, while the actual R3.7 gate evidence for existing candidate remains outstanding.
