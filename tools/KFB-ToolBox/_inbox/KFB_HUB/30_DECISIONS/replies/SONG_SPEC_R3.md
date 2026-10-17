# KFB Suno song spec R3.1: the one binding song document (V-411) · 17.10.2026

**R3.4 (18.10., V-435, Georg FAIL "AI slop galore"):** C9 cold start made precise (intro beat 1 = deck title + thesis in plain words, then onboarding; outro = satirical, thought-provoking punch), **no object-acting** (things and abstractions don't act like people), anti-slop list (Layer Zero). Gate: `song_gate.py` C9/C13.
**R3.3 (17.10., V-424, Georg):** intro/outro as a tailored satirical frame (C9 new), openers and bridges follow the 5 KayfabeTips (B7 new), callbacks required (B7b), one refrain allowed (C11 new), opener distance across songs = 15 songs, intro types with a cooldown. Gate: `song_gate.py`.
**R3.2 (17.10., V-419):** the gate is now one shared script, `replies/song_gate.py` (E16); added A9 (meta cards), C9b (intro at least two beats), E16b deck notes for five more decks, §F (external critic); A5 quota without A7 spellings (WSA found the A5/A7 conflict on 9/11). Nothing else changed.
**R3.1 (17.10., after WSA R4):** added A6–A8 (brackets, numbers, game words), C12b (two tracks) and E16b (tone check).

**This file replaces every earlier summary.** Briefs link to it and never paraphrase it. Changes go into this file as a new version; they are not stacked as separate rules.
Golden example (format and tone): `replies/OPENER_ARC_R2/epistemic_sabotage.take05.final.suno.txt` (Georg's own version) + style `…take05.final.style.txt`. Style model: Trust 05 (`suno-track-format`, Georg 17.10.).

## A · Card lines (the base, V-266 / TRIPLET_SET_SPEC_R2, unchanged)
A1. One card = **exactly one line**. Name first (normal case, no brackets).
A2. **Only the card's words**: cardName, lore, power, plus image words from `artworkPrompt` (V-377). Grammar and cutting are allowed, with at most one Fluff-o-lect word per line. **No new verbs, images, events or jokes.**
A3. **Weighting (V-372):** the claim and story of the card come first. Power appears only as an aside or inversion, never recited as a rule. Dice values and rule labels are dropped.
A4. **Closure:** don't explain the card. 80–95 characters per line, sayable in one breath.
A5. `songLine` only where the printed text cannot be sung (German words, numbers, symbols). At most 10 % of lines, each one logged. **Spelled-out numbers and symbols under A7 do not count toward the 10 %.** Log them in `songlines.json` with `"rule":"A7"`. Only word rewrites count.
A6. **No brackets are spoken** ("The Unconscious (Das Unbewusste)" → "The Unconscious"; German subtitles, "(Strike)", "(The New Breed)" are dropped or worked into the sentence without brackets).
A7. **Numbers, times, amounts and symbols written out** as they are sung ("Seven A.M.", "three point two billion", "Nine-Eleven", "Rule Number One"), each logged as a songLine.
A8. **No game words in the line:** Actor, token, Scene, card effects, "equipped items", "Zerg rush" and the like are dropped (V-372: mechanics at most as an image, never as a term).
A9. **Meta cards** that are not playable (cover, manifesto, rule card, warning card) may be skipped. List each one in `songlines.json` → `metaSkipped` with its reason. All other cards stay.

## B · Opener layer
6. Short openers in front of some lines (about a third to a half). **Within a song each opener appears only once**; use a variation only from the same family, at least 10 lines apart. The identical opener must not appear in any of the **last 15 songs**. Source: `OPENER_ARC_R2/opener_pool_r2.py` (+ new ones in the pool's style, added to the pool).
7. **Openers and bridges between cards follow the 5 KayfabeTips** (`media/prompts/KAYFABE_TIPS_corpus_v1.md` on main, verbatim):
   1. Therefore / But, never and-then: every card follows from the previous one ("so", "which is why", "except", "until", "turns out") or twists it. **Non-verbatim**: "and then" is forbidden, the literal "therefore" appears at most once.
   2. Yes, and: build on the previous card instead of starting over.
   3. We follow people, not props: the card sells itself like a character with a want, a wound or a grudge (show it, spin it, sell it, V-373).
   4. The weirder the card, the straighter the face: no winking, no ironic distance.
   5. One real picture beats ten big ideas: image words from `artworkPrompt` (V-377).
   The card text itself stays exactly as in A; the bridge lives only in the opener.
7b. **Callbacks (Georg: "!"):** at least **two** openers call back to an earlier card (its name or image), and the outro calls back to an image from the intro.

## C · Frame
8. `[Spoken Word]` at the top. **A blank line between ALL beats:** every intro sentence, every card line, the outro.
9. **Intro and outro are the bracket tailored to the deck** (Georg's golden take05 as the model, without copying its wording):
   - **Intro = cold start / onboarding.** **Beat 1 names the deck plainly**: title words + the deck's thesis in one line, the way the golden says "Epistemic Sabotage: Let AI read your comic – not draw it!". Then 1–3 beats that bring the listener in: who is speaking, what we're doing here, what the satirical premise is, in concrete words and with direct address allowed. **No riddle or aphorism pairs, no question without an answer, no mood sentences without content.** Log the intro type (question · scene · found object · bold claim · confession · misdirection) as `introType`; it describes the form of beats 2–4, never beat 1.
   - **Two levels (Georg 18.10.):** a **stand-up intro for normies**: setup and punch the way a stand-up comedian opens a set, relatable, everyday, funny, understandable without prior knowledge. Plus **dog whistles for experts**: 1–3 precise insider references from the deck/lore/history (names, dates, terms, quotes) that only people in the know pick up and that reward them, without blocking the normies. Same in the outro.
   - **Outro = a satirical, thought-provoking punch.** A clear statement about power, money, media or us, the audience. Concrete and quotable, it may call back to the intro or the deck title. Then "Stay Fluffy!". No cryptic closing image, no aphorism.
   - Do not use the template "Welcome to …" or the label "Meta-Message"; FrizzleBob appears at most once (V-366).
9b. **The intro has at least two beats of its own.** Do not cut it to one line to make the deck fit; split it into two tracks instead (C12b).
10. Order follows the card numbers. "Page = stanza" means only a micro-arc built through openers, **not block formatting**.
11. **No running-gag shouts** (the "Blödsinn" FAIL). Apart from cards, no word appears more than twice. **Exception: one refrain/hook** when the character budget allows: at most 8 words, drawn from the deck title or thesis, appearing **at most 3 times** at stanza or page boundaries (may vary slightly). Log it as `refrain` in `songlines.json`; it does not count toward the repetition limits.
12. Ending: "Stay Fluffy!" on its own line. The whole song is under 5000 characters.
12b. **When a deck doesn't fit** (e.g. 60 cards × 80–95 characters), split it into **two tracks** at a page boundary (part 1/part 2), each with its own intro and outro. Do not drop cards and do not shorten lines below the spec (TRIPLET_SET_SPEC_R2 §4).

## C2 · No AI slop (V-435, KayfabeTips Layer Zero)
13a. **No object-acting:** in the intro, outro and openers, things and abstractions do not act like people (forbidden: "The ledger begins…", "A pocket watch is late…", "The ledger never stood trial", "the mind disputes"). People, figures and cards act; things are things. Card text (A) is exempt.
13b. **No slop words or cadences:** tapestry, testament, whisper(s), echo(es), symphony, delve, unravel, journey, "in the end", "little did", "a reminder that", "stands as", and stacked dramatic two-liners with no information. Check: could the sentence appear in any song at all? Then it is slop.

## D · Style (V-362)
13. Purely musical: genre fusion, production texture, one voice with attitude (or an explicit duet), 5–7 instruments, a groove word, BPM. No props, no job roles. Give two variants A and B.

## E · Process (V-361, V-411)
14. **Writer's room** writes and makes every change.
15. **Blind reviewer judges only:** scores, observations, and flags such as "line X sounds like a rulebook". **It suggests no text and changes nothing.**
16. **Mechanical gate before review and before the Hub:** `triplet_set_check.py` exit 0 (card words, length), **plus `song_gate.py lyrics` exit 0** (`replies/song_gate.py`; checks the frame, A2, A4–A9, B6, C8–C12 and E16b, with `--media <pdf.json>` for image words and `--corpus` for all earlier songs). Use only this one script. No per-deck copies, no private gates. If the script is wrong, report it to WS0; WS0 fixes it.
16b. **Tone check** (part of the gate): lines that touch on victims or on groups of people are checked against the deck notes (9/11: no hints about "who flew", e.g. no "remote flight tech"; 1001: no "cannibal" with "The Black Giant", sung as "The Giant"; Therapy: never against people who seek help).
   Deck notes R3.2: **Federal Kayfabe / Monopolies, Manipulation & Murder:** the satire aims at institutions, money mechanics and power. Personal names appear only as on the card, and the frame never adds ethnicity, religion or "bloodline" framing. **Geopolitical Thrillers & Conspiracy Theories:** the deck parodies conspiracy narratives (closing card "The Satire Sanity Shield"). The frame never states a claim as fact, especially about health, vaccines or groups, and never adds anything that singles out a group. **Romantic Kayfabe:** no line plays down a boundary being crossed. **Grimm Set 02:** none.
17. **Regression check:** compare against Georg's golden example (format, line length, share of card words). If it is worse, the song is not submitted.
18. One revision by the writers' room, then the song goes to Georg.

## F · External critic (V-419)
19. **Who:** a model instance outside the writer's room (separate GPT, or a separate Claude session with no room context). It gets **only** this file, the golden example, the card JSON (+ pdf.json) and the candidate. It does not get the room's drafts, the dossier or earlier versions (`blind: true`).
20. **Output:** exactly one JSON file per track, `<track>.critic.json`:
   `{"schema":"kfb.song-critic.v1","song":"<file>","critic":"<model/instance>","blind":true,"scores":{"cardTruth":1-5,"performance":1-5,"arc":1-5,"sayability":1-5,"tone":1-5,"styleFit":1-5},"flags":[{"beat":<number from 0>,"rule":"A3","observation":"≤25 words"}],"verdict":"pass|revise"}`
   No other fields and no replacement text. Quotes are allowed only from the candidate itself or from the card source (for card-truth flags); `song_gate.py critic … --source <deck.json> [<pdf.json>]`.
21. **Gate for the critic:** `song_gate.py critic <x.critic.json> --lyrics <track>` exit 0. Otherwise the critique is discarded and run again.
22. The writer's room works through the flags **once** (E18). Then `song_gate.py lyrics` again; a second critic pass only judges and changes nothing. Only then does the song go to WS0 → Georg.
