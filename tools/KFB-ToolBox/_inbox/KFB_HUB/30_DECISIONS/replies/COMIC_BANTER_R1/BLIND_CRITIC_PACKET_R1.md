# Independent blind critic packet · C.O.M.I.C. banter R1

**Status: AWAITING INDEPENDENT CRITIC — no verdict fabricated.** The creative author must not adjudicate their own lines. The critic receives only this packet, `banter_r1.md`, the current `SPEC_HD_SHIP_DIORAMA_R1.md` §1/§4, `TRIPLET_SET_SPEC_R2.md`, and the three original printed card JSONs named below. Do not use previous writer-side discussion, explanatory briefs, or suggested repairs as source truth.

## Task for the independent reader

Review all 12 complete rounds (36 utterances). Each round is **Dory jab → Hunky excuse → Dory or Hunky punch** in the alien lens of their five-millennia-old marriage on C.O.M.I.C. Judge the actual dialogue, not its technical gate.

1. Character identity: Does Dory provoke with pointed wit and an Academy/ex-socialite/sympathetic perspective? Is Hunky pompous/overworked with recognizable evasions? Are the three beats a believable conflict, or just three separately recited card fragments?
2. Punch quality: Does beat 3 transform the stakes or expose a contradiction? Flag `NO_PUNCH` when it merely restates a card.
3. Printed-card fidelity: Every spoken word beyond minimal grammar must derive from **that round's** `cardName`, `power` or `lore`. No imported sentence, lore, card mechanic or world fact. The script gate detects unknown tokens but not incoherent recombinations.
4. Sayability: Is each move performable in one breath, 8–20 words where possible, and does the title front-load sound like dialogue instead of an audiobook index?
5. Scene context: Labels (POIs, dish/report) are unspoken metadata. Judge whether an actual shared on-ship situation is intelligible *without inventing spoken words*.

For each round return `PASS | TUNE | FAIL` and **specific observations with round number and quoted offending beat**. End with an overall `PASS | TUNE | FAIL`, the **top 3 repeat-pattern weaknesses**, and at most one minimal next editorial pass. Do not rewrite text as the critic. Preserve DESIGN status; no canon acceptance implied. If the strict card lexicon prevents real banter, state that production conflict explicitly; do not improve perceived quality by breaking the source rule.

## Inputs

- `banter_r1.md` (36 moves)
- `banter_r1.json` (source card IDs, each 3-beat round and descriptive POI)
- `monomyth.check-input.csv`, `cosmic.check-input.csv`, `philosophy.check-input.csv`
- `media/kfb/Kayfabizarro_Monomyth_Mayhem_WEB_v1.pdf.json`
- `media/kfb/Cosmic_Grift_-_Dark_Journalism_-_ADD_web_ID.pdf.json`
- `media/kfb/Kayfabizarro_Philosophy_-_ADD_web.pdf.json`

Mechanical gate evidence is separate: GitHub Actions run 39130822601 (36 card lines PASS, 0 FAIL, all three invocations exit 0) at commit e3bf6e43ba35d98fd2f19ac126a9f69e8b30f775. This is not a narrative quality score.
