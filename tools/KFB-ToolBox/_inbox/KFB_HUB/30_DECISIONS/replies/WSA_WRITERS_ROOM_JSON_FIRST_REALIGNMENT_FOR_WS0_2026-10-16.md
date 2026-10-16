# WSA → Claude Code WS0 · Writer's Room JSON-first realignment R1
**Date:** 2026-10-16  
**Status:** **GEORG SOURCE CLARIFICATION · WS0 ALIGNMENT REQUESTED** (not a new auto-approved V-decision; no new PR/merge).  
**Owner:** WS0 / KFB decisions register · **Product:** existing `kfb-triplets` Writer's Room, V-361/V-362/V-364/V-366/V-372/V-373/V-374/V-376.  
**Route:** `georg-doc/kayfabizarro` → `docs/kfb-decisions-register-2026-10-11` → `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/WSA_WRITERS_ROOM_JSON_FIRST_REALIGNMENT_FOR_WS0_2026-10-16.md`.

## Georg's correction to WSA

The previous WSA handoff made visual inspection of **all original PDF pages** a blanket mandatory gate before the independent blind review. Georg rejected that gate: **the card JSON is already present; use it**. A whole-deck song should **not** be blocked on manually rendering each PDF page.

**Operational source rule for reconciliation with WS0: JSON-FIRST, PDF-ON-EXCEPTION.**

1. **Canonical cards:** `registry/assets/v1/decks/<deckId>.json`, joined by `cardNumber`, owns canonical `cardName`, `lore`, `power`, original numbering and existing `page`/mapping flags. Never overwrite printed card truth with editorial song lines.
2. **Image motif descriptions:** the existing `media/kfb/<exact-PDF-name>.pdf.json` has `cards[].artworkPrompt` for these decks. Read its **subject/visual motif description** for inspiration, with an explicit `motifSource: "pdf-json.artworkPrompt"` and `visualVerified: false`. This is source-derived *descriptive metadata*, NOT an assertion that anyone viewed the physical printed drawing. Do not treat unrelated `gradeReason`, marketing, generated commentary, or image URLs as canonical card text; do not claim PDF-image verification.
3. **Printed page → stanza:** use verified `registry.page` where present. Where it is missing, an existing reviewed WS0 page/four-up dossier is acceptable **provisional structure** with `pageSource` and `mappingVerified:false`; proceed with the song, do not invent verified print mapping.
4. **SongLine:** V-372/V-373 remain intact. Each card sells its own claim, with `cardName` + `lore` + the *described* image motif as writer inputs; `power` is an occasional satirical aside, never a recited rule. Distinguish canonical card fields from creative output and log editorial changes.
5. **Exceptions only:** open the actual PDF **if a specific card lacks usable JSON, page mapping must be settled for an outcome-critical edit, the visual description appears inconsistent, or there is a documented contradictory print/source claim**. The doubtful card remains OPEN/provisional if needed. Do not escalate that single exception into a 13/14-page or whole-deck PDF gate.
6. **Next real editorial gate:** independent blind review sees **only** current lyrics and a short deck description, not rules, dossier, scores, or this handoff. Obtain genuine 1–10 song / stand-up / deck-faithfulness scores, three weaknesses, up to eight edits, and both V-372/V-373 questions; then **one** reviewer-driven `wr5` revision for Georg. Do not fabricate scores or claim independence when the same writer self-assesses.

## Verified data and exact source references

| Input | Pharaoh Piledriver | Trust & Betrayal |
| --- | --- | --- |
| Registry | `registry/assets/v1/decks/pharaoh_piledriver.json`, blob `8a4cb0f693684ec4609561993a97a0369e82041b` | `registry/assets/v1/decks/trust_and_betrayal.json`, blob `2ae1782f51aa4b61b21a692a8444daa6b29d9450` |
| Cards | **52** | **56** |
| Page field (registry) | **0/52** present; WS0 `wr1.dossier.md` gives provisional four-up groups, 13 stanzas | **56/56** mapped, pages 2–15; 14 stanzas |
| PDF-analysis JSON | `media/kfb/Pharaoh_Piledriver_-_ADD_web_ID.pdf.json`, blob `4a4e453be8225261d4e8801730b7826e0ef7b562` | `media/kfb/Uncle_FrizzleBobs_Kayfabizarro_Kards_TRUST_&_BETRAYAL_-_ADD_web.pdf.json`, blob `bb52f5bec375438ba41b9a1a1c2890d409b07d3e` |
| Existing `artworkPrompt` metadata | **52/52** | **56/56** |
| Current WR4 lyrics | 3,883 characters; 52 cards; **24/24 structural assertions** | 4,342 characters; 56 cards; **24/24 structural assertions** |
| Current branch/head | `songs/pharaoh_piledriver-wr4-2026-10-16` @ `adad67917982017d6f5843fd02d14513555221dc` | `songs/trust_and_betrayal-wr4-2026-10-16` @ `6b95fc51949e316bb6149f582201a705184d9ce5` |

**Real exception:** Trust & Betrayal card **#30, Heel-Face Turn**: current registry and PDF-analysis JSON have a POWER text but no LORE; the old WS0 `wr1.dossier.md` reports the printed card has title/values only. Flag just this discrepancy for a targeted check or WS0 source adjudication; the rest of the song can proceed to blind review. The `artworkPrompt` for #30 describes a wolf changing expression and offering a flower: useful as **descriptive motif metadata**, not as independently seen printed art.

**Technical vs human evidence:** both `wr4` song branches were committed and read back; 24/24 is static validation **per deck**, **not** PDF image QA and **not** independent creative review. Scores remain `PENDING`; `wr5` not created. The present song `cards.json` has null `imageMotif`; that gap can be backfilled *as sourced metadata* from the 108 existing descriptions without rerendering PDFs or rewriting the lyric candidates automatically.

## Where the current skill/brief conflicts

- The live `kfb-triplets` personal plugin is **v0.3.1** (`plugins_6accc59cff7481918f9113f65965335f`); its `writers-room-song/SKILL.md` currently says **imageMotif MUST come from seen PDF drawings** and explicitly excludes `artworkPrompt`. Its `compose-card-performance/references/songline-mode.md` also excludes `artworkPrompt`, even though the JSON already has it.
- `replies/BRIEF_WSA_WRITERS_ROOM_PLUGIN_R1.md` stage 1 says "**registry deck JSON + PDF page images**", and its V-372 summary says "**look at the PDF page**". That is now an *unnecessarily broad hard gate* in this specific WSA execution.
- Older song branch Returns say `SOURCE-PAGE VISUAL + INDEPENDENT BLIND REVIEW` as a coupled gate. **Do not construe the visual portion as a universal prerequisite**; these historical Returns stay traceable, but the receiving WS0 alignment must separate exceptional source QA from the real review gate.

## Exact WS0 reconciliation request

1. **ACK / TUNE / OBJECT** to the JSON-first source precedence and metadata provenance, especially whether `artworkPrompt` should be stored as raw text, a shorter `imageMotif`, or both. Do not portray this as a newly ratified V-number in the generated decisions register until WS0 has reconciled it.
2. Update the **same existing plugin**, if agreed: revise just `writers-room-song` and the additive `songline-mode.md` source policy to allow labeled PDF-JSON motif metadata, retain `visualVerified:false`, preserve spoken R2's original constraints, and avoid another plugin/runtime owner.
3. Retain immutable WR4 candidate commits. Optionally backfill `cards.json`'s motif *metadata* on the existing song branches with separate verified commits; do not overwrite lyrics or call them final before the reviewer.
4. Correct the next-gate wording in the two owning song Returns on their next planned milestone; **do not re-run 27 pages of PDF image inspection** just to enable reviewer dispatch.
5. Run or route the **genuinely independent** blind reviewer with the already-persisted handoffs; one revised `wr5` per deck after scores. Georg remains the human music gate.

## Return / boundaries
- **Deliverable of this slice:** WS0 receiving/reconciliation note plus a top-of-brief pointer, **not** rewritten song lyrics, not a plugin release, not a new V decision, and not a production acceptance.
- **GitHub branch:** current WS0 decisions owner `docs/kfb-decisions-register-2026-10-11`; exact final head is established by the write/readback, not guessed here.
- **Actual checks:** direct read of 2 registry JSONs + 2 PDF-analysis JSONs (52/56 entries, `artworkPrompt` all 108, mapping present 0/52 and 56/56); inspection of both current song Returns, current installed skill, the original WSA brief, and V-361–V-376 source rules. No tests or visual review newly performed against songs in this correction slice.
- **Open:** WS0 agreement/decision-register reconciliation, actual separate reviewer, targeted card #30 source answer, optional provisional Pharaoh page proof. No PR, no merge, no Site/Stage/Live.
- **Exactly one next gate:** **WS0 JSON-FIRST REALIGNMENT ACK + INDEPENDENT REVIEW DISPATCH**. Once WS0 agrees, update the plugin source/Returns at a normal phase boundary, then proceed to real scores and `wr5`.
