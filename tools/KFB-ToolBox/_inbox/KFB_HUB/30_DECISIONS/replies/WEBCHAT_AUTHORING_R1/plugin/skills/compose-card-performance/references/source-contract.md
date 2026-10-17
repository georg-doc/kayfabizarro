# Source & narrative contract · KFB Triplets

## Authoritative inputs
Original KFB deck JSON and registry are the primary source. Example verified source at 2026-10-12:
- Repository: `georg-doc/kayfabizarro`.
- Deck: `media/kfb/Wrinkle_Rumble_-_ADD_web_ID.pdf.json`.
- Blob: `695e74af3bd8f0c0cbaa4bd88a57d637ed095f8c`.
- Card count: **48**, not 56 (from exact JSON `cards` array).
- Important: another deck may have 56/60/etc. Count the actual source and never generalize the Wrinkle count.
- Original card fields: `cardNumber`, `cardName`, `power`, `lore`, `artworkPrompt`; some `lore` values are null, and mechanical text can be in nonstandard field positions. Treat the actual JSON as truth; omit gaps rather than fill fiction.
- Page/quadrant follows `media/kfb/index.json` or real PDF mapping; don't assume `cardNumber % 4` equals a verified PDF crop. Never assert source artwork from artworkPrompt text alone.

## Compact creative source map
One CARD => one short spoken utterance carrying real source name/power/lore (source authorship distinguished from edits). Intro/outro are separate performance-scale cues. Card pairs may have typed `EDITORIAL` bridges. Each bridge describes an actual specific change: `obstruction`, `consequence`, `cost`, `reversal`, `escalation`, `callback`, `retaliation`, `emotional_pivot`, `rule_rewrite`, `juxtaposition-with-mechanism`. Phrase-only randomness is not sufficient.

SHOW IT / SPIN IT / SELL IT is a higher-scale performance progression and may be realized by successive Cards (Actor/POV → three Scene roles → Quest/Endpanel), without redefining a Triplet into three independent sentences. King Kayfabian's digital mini-game remains a separately deferred owner/gate.

### Example source truths, no new lore
- #17 The Skeleton of Waiter: force opponent to hum while you think; skip turn if they stop; Madame Foster still in craft aisle after three decades.
- #18 The Slide of Eternity: Gravity Trap, can't leave until roll a double; ride ends at death.
- #19 The Unanswered Riddle: player trivia question, hesitation freezes; winning means keeping on playing.

These are **condensed factual anchors** from original Card JSON; any joke/connector is editorial and must be marked as such.
