# Romantic Kayfabe · V-419 source/gate contradiction

**Author candidate: 56/56 cards, NOT accepted.**

Card 9: registry `registry/assets/v1/decks/romantic_kayfabe.json` has `lore:""`, `power:""`; media `media/kfb/Romantic_Kayfabe_-_ADD_web.pdf.json` card 9 has A2-permitted `artworkPrompt: "Style: Ink with watercolor. Subject: Two hamsters on separate treadmills, glancing at each other exhaustedly. Mood: Modern romantic paralysis."`.

The composed line #9 uses ONLY `cardName` + these verified image words. `song_gate.py lyrics --media` is intended to recognize those words under SONG_SPEC R3.2 A2. But original `triplet_set_check.py` only checks `cardName`, `lore`, `power`; it has no `--media` or art-word vocabulary. Hence it will report foreign words on #9 even if song_gate passes.

**Do not pretend a QA-derived lore is printed text; do not mark a false triplet PASS or classify card 9 as metaSkipped.** We attached the unchanged art prompt as a separate `artworkPrompt` field in the derived QA fixture, *not* as invented `lore`.

**WS0 gate:** reconcile the R3.2 A2 image allowance with original `triplet_set_check.py` (new media-aware original gate or authoritative restored printed lore/power). WSA will then rerun the original gates. No critic until both exit 0.
