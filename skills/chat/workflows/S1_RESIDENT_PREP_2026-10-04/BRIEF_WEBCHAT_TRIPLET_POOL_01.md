# BRIEF · TRIPLET-POOL-01 · normal Web Chat with Georg · 2026-10-04

- From: Claude Coworker · For: a normal (low-cost) Web Chat working directly with Georg
- Type: content/data curation. **No runtime, no build, no new schema, no LLM integration.**
- Belongs to: slice S1 "two Residents talk about one Card" (`COORDINATION_PLAN_WSA_CLAUDE_2026-10-04.md`)
- Language: talk to Georg in German, short, plain. All Triplet content is English.

## 1 · Goal

Turn the 20 candidate Triplets into a first **reviewed** Resident pool that is big enough for one S1 scene: two Residents, one real Card, the player answering with the four social calls. Georg decides every line. Nothing becomes pool content without his "keep".

## 2 · Read first (GitHub `georg-doc/kayfabizarro`)

| What | Where |
|---|---|
| The 20 candidate Triplets + Resident profiles | `skills/chat/workflows/RESIDENT_CHAT_ENSEMBLE_01B_2026-10-01/src/resident-chat-ensemble-data.mjs` @`7c6522fb` (PR #310): `TRIPLET_POOL_SOURCE`, `RESIDENT_PROFILE_SOURCE` |
| Selection kernel (how lines are picked) | `skills/chat/workflows/RESIDENT_CHAT_POC_01_2026-10-01/src/resident-chatter-adapter.v0.1.mjs` @`5b595a07` (PR #305) |
| S1 prep: pair/Card options, lean cards v0.2 | branch `coworker/coordination-plan-2026-10-04`, folder `skills/chat/workflows/S1_RESIDENT_PREP_2026-10-04/` |
| Review stage (HTML) + this brief | same folder: `KFB_TRIPLET_POOL_REVIEW_STAGE_v1.html` |
| Triplet rules already decided | `skills/chat/town/LIVING_KFB_TOWN.md` J-13, J-14, §11.3, §12.1, §13.1 (D36); `skills/chat/masterplan/CHATTERBOX_TOURBUS_REUSE_2026-09-14.md` §5 |
| Triplet-as-rule note | branch `coworker/kfb-narrative-core-recon-01-2026-10-02`, `skills/chat/workflows/KFB_NARRATIVE_CORE_RECON_01_2026-10-02/TRIPLET_DIALOGUE_RULE_NOTE_2026-10-02.md` |
| Card text | `media/kfb/Deck_A_UTOPIA_-_Forget_Utopia_web_H.pdf.json`, `media/kfb/Deck_B_DYSTOPIA_-_ANATOMY_OF_A_TRAP_web_H.pdf.json` (fields `cardName`, `power`, `lore`, `artworkPrompt`) |

## 3 · Rules (do not re-decide)

- Shape `subject / connector / reframe`. **Each of the three parts carries meaning**; a bare connector is too thin; more weight is not more words. Keep a line at or below **15 words** (kernel default budget).
- The line **does not state the conclusion**. The gap belongs to the player (Town §11.3).
- **Koans and haikus are allowed. Calendar sayings, motivational aphorisms, arbitrary X-with-Y combinations, object-acting fillers and explained jokes are not** (Town §12.1, Georg 2026-10-03).
- Therefore/But is a thinking aid, not a word to print (D36).
- One shared pool. `signatureOf` means weight, not a catchphrase. A Resident must not become a catchphrase machine.
- Respect each profile's `speechAvoid` list (for example: no goth caricature, no circus puns, no prophecy voice).
- English only. **No Fluffolekt variants in this round** (Georg 2026-10-03).
- Social calls are the player's answer buttons. They are inputs: KayfaBINGO! lands and hands closure back · KayfaBONGO! keeps material from the previous line · KayfaBOGGLE? reframes the same material · BLÖDSINN! objects to the frame. They never link a Card.
- **Never present lines you wrote as accepted.** Every new line is `status: "CANDIDATE"` until Georg keeps it.

## 4 · What the review stage already showed (tested with the #305 logic, 2026-10-04)

Relation coverage of the 20 Triplets:

| | SYNERGY | CATEGORY_SHIFT | MISFIT | COLLISION | ESCALATION |
|---|---|---|---|---|---|
| global (4) | 0 | 1 | 1 | 1 | 1 |
| Lorekeeper (4) | 1 | 1 | 1 | 0 | 1 |
| Goth Girl (4) | 1 | 0 | 2 | 1 | 0 |
| Clown (4) | 0 | 2 | 0 | 0 | 2 |
| Witch (4) | 1 | 2 | 1 | 0 | 0 |

Consequences in play:
- **BLÖDSINN!** needs a COLLISION line. Clown and Witch have none, so they always fall back to the one global line `core.rule.01`.
- **KayfaBOGGLE?** needs a CATEGORY_SHIFT line that shares material with the previous line. Goth Girl has none of her own. On pair B (Witch × Clown, The Cortisol Economy) Clown stays **silent** on BOGGLE and BONGO because no line shares material.
- **KayfaBINGO!** prefers SYNERGY. Clown has none.
- None of the 20 is anchored in a Card, so the Card only nudges weights through tags.

## 5 · Tasks

1. **Apply Georg's review.** Georg marks keep / cut / change in the review stage and exports `KFB_TRIPLET_POOL_REVIEW_<date>.json`. Treat `cut` as removed. For `change`, propose a new version against his note. Do not argue the cuts.
2. **Pair and Card.** Ask Georg which option (A Goth Girl × Clown + The Standing Ovation, B Witch × Clown + The Cortisol Economy, C Goth Girl × Witch + The Doomsday Clock). Default A if he does not choose.
3. **Close the call gaps for the chosen pair.** Per Resident, aim for at least **2 SYNERGY, 2 CATEGORY_SHIFT, 2 COLLISION** plus lines in the relations of its `relationBias`, with tags that overlap the partner's tags so BONGO and BOGGLE can connect.
4. **Card-anchored lines.** Per Resident **3–4** lines anchored in the chosen Card: its claim (`power`), its mechanism (`lore`) or something visible on it (`artworkPrompt`). Do not quote the card text whole. Add `cardRef` (e.g. `forget_utopia#11`).
5. **Size limit.** At most **24 new candidates** per round. Quality over count.
6. **Hand-off.** Give Georg one JSON array that the review stage imports (tab Export / Import). Georg reviews there and exports again. Repeat at most twice per round.

## 6 · Entry format (exactly this)

```json
{
  "tripletId": "clown.card-ovation.01",
  "signatureOf": ["clown"],
  "subject": "…",
  "connector": "…",
  "reframe": "…",
  "relation": "SYNERGY | CATEGORY_SHIFT | MISFIT | COLLISION | ESCALATION",
  "tags": ["…", "…"],
  "cardRef": "forget_utopia#11",
  "anchor": { "subject": "card:power | card:lore | card:visible | clamp:<field> | prior", "reframe": "lens:<method or deck>" },
  "status": "CANDIDATE",
  "author": "webchat"
}
```

`tripletId` pattern: `<resident>.<topic>.<nn>` or `core.<topic>.<nn>`. The ellipses above are placeholders, not content.

## 7 · Self-check before handing over

- every slot has a concrete anchor; no slot repeats another;
- the line works as a reply to at least one social call;
- no conclusion stated; no explanation of the joke;
- not a calendar saying; not true anywhere and about nothing;
- respects `speechAvoid`; ≤ 15 words; English;
- distinct voices: Goth Girl's line would sound wrong in Clown's mouth and the other way round.

## 8 · Done when

Georg has one reviewed export where each Resident of the chosen pair has at least one kept line for each of the four social calls, plus at least two kept Card-anchored lines each. Claude Coworker then commits that export to GitHub as the first reviewed pool for S1.

## 9 · Not in this job

No build, no World Studio change, no schema change, no Fluffolekt, no dark secrets or backstories, no other Residents, no Production Control writes (the Claude connector is currently broken), no merge.
