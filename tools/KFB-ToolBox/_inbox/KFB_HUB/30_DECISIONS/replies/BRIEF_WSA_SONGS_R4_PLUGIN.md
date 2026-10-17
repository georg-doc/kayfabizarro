# Brief WSA · Rebuild of five deck songs through the triplet plugin (R4, V-410/V-411) · 17.10.2026

**Tool:** the existing `kfb-triplets` plugin (skills `compose-card-performance` + `writers-room-song`, coupled workflow V-376).
**The only binding source for the rules:** `replies/SONG_SPEC_R3.md` on the register branch `docs/kfb-decisions-register-2026-10-11` (folder `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/`). Read it word for word and do not summarise it.
**Golden example (format, tone, blank lines):** `replies/OPENER_ARC_R2/epistemic_sabotage.take05.final.suno.txt` + `.style.txt`. Style model: Trust 05 (in SONG_SPEC_R3 §D).
**Do not copy:** `replies/SONGS_R3/*/` is the FAILED round (invented gags, block format, "Blödsinn" shouts). Use the dossiers there only as research context: deck thesis, sources, page table, image motifs.

## Decks
| deckId | Card truth | Note |
|---|---|---|
| `1001_kayfabe_nights` | registry + `media/kfb/1001_Kayfabe_Nights_-_ADD_web_ID.pdf.json` | – |
| `frizzlebob_bloedsinnland_alice` (provisional) | no JSON. The card texts were read from the PDF by OCR: `replies/SONGS_R3/frizzlebob_bloedsinnland_alice/*.dossier.md` (card inventory) | No "Blödsinn" running gag; the word appears at most twice |
| `the_kayfabe_money_trail_9_11` | registry + pdf.json | Humane tone, satire aimed at money, power and media, never at victims; no hints about "who flew" |
| `the_carnival_of_unsolved_problems_therapy` | registry + pdf.json | Warm, never mocking people who seek help |
| `dream_wrestling_with_kayfabe_freud` | registry + pdf.json | – |

## Process (SONG_SPEC_R3 §E)
1. Card lines from the card's words only (§A), openers as their own layer (§B), frame (§C), **a blank line after every beat**.
2. **Mechanical gate:** `triplet_set_check.py` exit 0, plus the format/hook check (blank lines, no word or shout more than twice, under 5000). Only then the review.
3. **Blind review judges only** (scores, observations, flags) and proposes no text. Use a separate reviewer GPT, or WS0 runs it.
4. One revision by the plugin, then compare against the golden example (§E 17).

## Output
New branch per deck, `songs/<deckId>-r4-2026-10-17`, with `<deckId>.r4.suno.txt`, `.style.txt` (A+B), `.check.txt` (gate output), `.songlines.json` (≤ 10 %), `.blindreview.md`. In the chat: STYLE A + LYRICS as two code blocks. WS0 then takes it into the Hub.
