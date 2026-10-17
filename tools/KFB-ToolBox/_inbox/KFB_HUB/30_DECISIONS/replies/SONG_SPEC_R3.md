# KFB Suno song spec R3.1: the one binding song document (V-411) · 17.10.2026

**R3.1 (17.10., after WSA R4):** added A6–A8 (brackets, numbers, game words), C12b (two tracks) and E16b (tone check). Nothing else changed.

**This file replaces every earlier summary.** Briefs link to it and never paraphrase it. Changes go into this file as a new version; they are not stacked as separate rules.
Golden example (format and tone): `replies/OPENER_ARC_R2/epistemic_sabotage.take05.final.suno.txt` (Georg's own version) + style `…take05.final.style.txt`. Style model: Trust 05 (`suno-track-format`, Georg 17.10.).

## A · Card lines (the base, V-266 / TRIPLET_SET_SPEC_R2, unchanged)
A1. One card = **exactly one line**. Name first (normal case, no brackets).
A2. **Only the card's words**: cardName, lore, power, plus image words from `artworkPrompt` (V-377). Grammar and cutting are allowed, with at most one Fluff-o-lect word per line. **No new verbs, images, events or jokes.**
A3. **Weighting (V-372):** the claim and story of the card come first. Power appears only as an aside or inversion, never recited as a rule. Dice values and rule labels are dropped.
A4. **Closure:** don't explain the card. 80–95 characters per line, sayable in one breath.
A5. `songLine` only where the printed text cannot be sung (German words, numbers, symbols). At most 10 % of lines, each one logged.
A6. **No brackets are spoken** ("The Unconscious (Das Unbewusste)" → "The Unconscious"; German subtitles, "(Strike)", "(The New Breed)" are dropped or worked into the sentence without brackets).
A7. **Numbers, times, amounts and symbols written out** as they are sung ("Seven A.M.", "three point two billion", "Nine-Eleven", "Rule Number One"), each logged as a songLine.
A8. **No game words in the line:** Actor, token, Scene, card effects, "equipped items", "Zerg rush" and the like are dropped (V-372: mechanics at most as an image, never as a term).

## B · Opener layer
6. Short openers in front of some lines (about a third to a half), each used **only once** per song. Check them against all earlier songs.
7. The opener carries the card's performance (V-373): attitude, callback, escalation. The card text itself stays as in A.

## C · Frame
8. `[Spoken Word]` at the top. **A blank line between ALL beats:** every intro sentence, every card line, the outro.
9. The intro has its own idea drawn from the deck: no formula, no "Welcome to …" template, no Meta-Message, not a wrestling announcer. FrizzleBob appears at most once (V-366). Comic Card Karaoke is optional.
10. Order follows the card numbers. "Page = stanza" means only a micro-arc built through openers, **not block formatting**.
11. **No repeated hooks or shouts.** No word and no shout appears more than twice, and no running-gag shout.
12. Ending: "Stay Fluffy!" on its own line. The whole song is under 5000 characters.
12b. **When a deck doesn't fit** (e.g. 60 cards × 80–95 characters), split it into **two tracks** at a page boundary (part 1/part 2), each with its own intro and outro. Do not drop cards and do not shorten lines below the spec (TRIPLET_SET_SPEC_R2 §4).

## D · Style (V-362)
13. Purely musical: genre fusion, production texture, one voice with attitude (or an explicit duet), 5–7 instruments, a groove word, BPM. No props, no job roles. Give two variants A and B.

## E · Process (V-361, V-411)
14. **Writer's room** writes and makes every change.
15. **Blind reviewer judges only:** scores, observations, and flags such as "line X sounds like a rulebook". **It suggests no text and changes nothing.**
16. **Mechanical gate before review and before the Hub:** `triplet_set_check.py` exit 0 (card words, length), plus a format and hook check (blank line after every beat, no word or shout more than twice, under 5000).
16b. **Tone check** (part of the gate): lines that touch on victims or on groups of people are checked against the deck notes (9/11: no hints about "who flew", e.g. no "remote flight tech"; 1001: no "cannibal" with "The Black Giant", sung as "The Giant"; Therapy: never against people who seek help).
17. **Regression check:** compare against Georg's golden example (format, line length, share of card words). If it is worse, the song is not submitted.
18. One revision by the writers' room, then the song goes to Georg.
