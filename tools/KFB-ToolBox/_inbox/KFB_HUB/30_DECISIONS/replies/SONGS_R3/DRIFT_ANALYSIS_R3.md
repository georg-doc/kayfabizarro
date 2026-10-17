# Drift analysis Songs R3 (Georg 17.10.: "the new texts break our rules again", "the Blödsinn shouting is a FAIL") · V-410

## What is wrong (checked against the 5 wr2 texts)
1. **Format:** card lines sit in blocks of 4 with no blank line in between, and the intro is one block of 9–12 lines. The binding spec (TRIPLET_SET_SPEC_R2 §Set structure 3, and Georg's take 05) says: **one card = exactly one line, with a blank line between every beat** (intro sentences, every card line, outro).
2. **Card lines invented instead of taken from the card:** jokes, images and events that are not on the card ("Golden bone, baby!", "Goo-goo, ga-ga!", "Every table is your mom", wrestling patter). The spec says: **use only the card's words** (grammar and cutting are allowed, plus at most one Fluff-o-lect word), no new verbs, images or events, closure instead of explanation, 80–95 characters per line.
3. **songLine as the norm:** 26–51 songLines per deck, which means almost every line was rewritten. V-364 meant: only where printed text breaks when spoken.
4. **Repeated hooks:** "Blödsinn!" shouted again and again (Alice, FAIL), "(Aha!)" runners, gang shouts. That is repetitive and pulls the focus away from the cards.
5. Intros partly sound like a wrestling announcer ("Live from the Madness Arena…"), which contradicts V-344 (stand-up, not an announcer).

## Cause chain (WS0's fault)
1. **My brief R3 left out the base spec.** I summarised the rules from the last few days (V-361–V-377, all additions) from memory. TRIPLET_SET_SPEC_R2 (V-266: card words, one line per card, blank lines, character budget) and Georg's take-05 format were not in it. The additions were read as a replacement.
2. **V-372 was worded ambiguously.** "Page = stanza, blank line between stanzas" contradicts "blank line between all beats". I did not reconcile the two.
3. **V-373 was misread.** "Every card performs itself" was taken as licence to rewrite the card as invented first-person comedy. It is meant as delivery and as openers, not as new content.
4. **The blind review was set up without limits.** A reviewer who doesn't know the rules optimises for gags and suggested rewriting card lines. I passed those suggestions on as the brief (in R2 I had still restricted card lines to "flag only").
5. **No check before posting to the Hub.** I counted characters and FrizzleBob mentions. I did not run `triplet_set_check.py` and did not check the format.

## Correction (V-410)
- **The base spec stays binding** for every card line: TRIPLET_SET_SPEC_R2 (card words, one line, blank line between all beats, closure, 80–95 characters). V-372/V-373 change only the weighting: power as an aside instead of at the front, motif words from `artworkPrompt` allowed, the card speaking for itself through delivery and opener. **No invented content.**
- **"Page = stanza"** means order and a micro-arc through openers, **not** block formatting.
- **songLine only** for passages that cannot be sung (target ≤ 10 % of lines).
- **No repeated hooks or shouts.** No word or shout appears more than twice in a song, and none as a running gag.
- **Blind review** may only edit intro, openers and outro. It may only *flag* card lines.
- **Before the Hub:** run `triplet_set_check.py` (exit 0 required), check the format (blank line after every beat), and confirm that no repeated hook appears.
- Hub b83–b87 marked FAIL. They will be rebuilt from the card triplets.
