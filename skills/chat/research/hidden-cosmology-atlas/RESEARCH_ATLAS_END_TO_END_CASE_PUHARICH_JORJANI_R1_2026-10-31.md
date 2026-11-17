# KFB Research Atlas · End-to-End Source → Claim → Relation → Consumer Case R1
Date: 2026-10-31 · Existing **Hidden Cosmology Atlas Editorial Research** owner · `georg-doc/kayfabizarro` · `research/hidden-cosmology-atlas-2026-10-13` · Draft PR #394.
**Class:** CONCRETE WALKTHROUGH ON EXISTING RESEARCH OBJECTS, not a site implementation or independently listened-to recording. Purpose: establish one smallest complete provenance path before research-site authoring; no second research DB or new NIE writer.

## Input: exact existing source objects (not anonymous mock data)
1. `topics/jorjani-michels-trilogy-2025-2026/PUHARICH_1984_PRIMARY_SOURCE_RECOVERY_R2.md`: `JM-S16` = publisher-identified purported original **1984-07-02 Lily Dale** recording transcript, released **2026-09-16**; `JM-S17` = Acast reissue of **same** 30:01 recording; `JM-S19` = **2026-10-27** Michels/Jorjani interview excerpt, not a second Puharich source.
2. Original public source landing pages: https://thecosmicclock.substack.com/p/90-of-ufo-sightings-are-man-made and https://shows.acast.com/the-nine-tapes/episodes/90-of-ufo-sightings-are-man-made-rare-andrija-puharich-lectu; interview https://www.youtube.com/watch?v=QjU7FfTcACE.
3. Evidence ledger `JM-C19` (1984 publisher transcript attributes Puharich's **approximate 90% of UFO sightings as man-made** estimate); `JM-C21` (Jorjani 2026's **US-built close-encounter craft** retelling); `JM-C22` (**half of abductions staged**, secondary Jorjani attribution **without located first-person statement in inspected segment**).
4. Relations `JM-H09` (1984 source → 2026 reissue, source transmission), `JM-H10` (source asserts 90% sightings, not proof that claim true), `JM-W10` (noncausal textual scope shift). Existing `JM-C10` in the original R1 transcript audit remains unchanged.
5. Existing adjacent `topics/wcc-samosa-network-2026-10-29/RETURN.md`: independent **WCC/Moneyrex R4** topic (**46 sources, 50 claims**) showing how documentary vs alleged network transfers are guarded; not taken as evidence for Puharich/US saucer operations.
6. Existing KFB actor/worldview author homes: `authors/jason-reza-jorjani.md`; `sources/jesse-michels-american-alchemy.md`; `authors/README.md`. No completed `authors/andrija-puharich.md` currently established. Private full user Docs or NIE corpus are not included.

## The seven-step real research journey (observed data objects + exact UI requirement)
| Step | Input currently available | Concrete research action / response | Status |
|---|---|---|---|
| 1 DISCOVER | existing Jorjani/Michels topic Return, source ledger | Query `Puharich 90% 1984`. Find exact claim IDs/source URLs and the 1984 event vs 2026 reissue dates; don't launch duplicate research | **EXISTING_RECORDS_RESOLVE** (site search not built) |
| 2 OPEN SOURCE | `JM-S16` publisher transcript, `JM-S17` Acast audio listing | Display source in isolation with publication, event date, edition and read coverage. **No playback verification was performed**; source transcript indexed rather than direct audio read | **PUBLISHER_TEXT_INDEXED / AUDIO_UNVERIFIED** |
| 3 EXTRACT CLAIM | `JM-C19` | Show speaker, narrow proposition **all sightings → man-made**, original approximate hedge, episode/recording ID; keep author claim distinct from empirical prevalence | **SOURCE_ATTRIBUTION_NARROW** |
| 4 COMPARE | `JM-S19`, `JM-C21`, `JM-C22` | Side-by-side exact scope: `sightings` vs `close encounters`, `man-made` vs `US fleet`, plus a **second unsupported 50%-abduction claim**. Label 50% `OPEN_ORIGINAL` | **REAL_DOCUMENTED_SCOPE_SHIFT**, not resolved historical truth |
| 5 GRAPH | `JM-H09/H10`, `JM-W10` | Two visual layers: SOURCE_REPORTING directed relation; CONCEPTUAL_NONCAUSAL reinterpretation. Click edge reveals IDs, editorial actor and falsifier. No `CIA_FUNDED` edge added | **TYPED_GRAPH_LINKS_RESOLVE** (visualization not built) |
| 6 ROUTE / QUEUE | existing Atlas Return & R2 gate | New research action points to `PUHARICH_1984_AUDIO_AND_REMAINDER_ABDUCTION_CLAIM` with exact only-once source retrieval and audio segment proof needed. Site action should create a bounded GitHub source task via authorized Work/connector, **not yet executed** | **READY_FOR_WORK_HANDOFF** |
| 7 CONSUME | source/claim/edge IDs and intended medium | Produce a **read-only provenance packet** for historical essay, NotebookLM source bundle or NIE Story Thinking; game/Triplet remains separate approval/donor check. No actual in-game sentence or canonical Card source generated | **CONSUMER_PACKET_CONTRACT_READY**, not shipped |

## Proposed read-only packet example, using real IDs
```json
{
  "packet_id": "HCA-JM-PUHARICH-1984-R1",
  "source_revision": "resolve-from-exact-GitHub-branch-at-execution",
  "topic_path": "topics/jorjani-michels-trilogy-2025-2026/",
  "entity_ids": ["andrija-puharich", "jason-reza-jorjani", "jesse-michels-american-alchemy"],
  "source_ids": ["JM-S16", "JM-S17", "JM-S19"],
  "claim_ids": ["JM-C19", "JM-C21", "JM-C22"],
  "relation_ids": ["JM-H09", "JM-H10", "JM-W10"],
  "source_scope": {
    "recording_date_as_publisher_reports": "1984-07-02",
    "reissue_date": "2026-09-16",
    "audio_minutes_independently_listened": 0,
    "full_transcript_audio_alignment": "UNVERIFIED"
  },
  "claim_divergence": {
    "earlier": "Puharich estimate: around 90% of UFO sightings are man-made",
    "later": "Jorjani 2026: 90% of close encounters are US craft",
    "unresolved_addition": "Jorjani reports half of abductions staged; original not located"
  },
  "ready_for": ["source_critical_essay_outline", "notebooklm_source_list_proposal", "nie_analysis_request"],
  "not_ready_for": ["fact_verified_historical_financing", "canonical_kfb_dialogue", "audio_verified_quote"],
  "next_primary_gate": "PUHARICH_1984_AUDIO_AND_REMAINDER_ABDUCTION_CLAIM"
}
```
This is a **paper contract**; `source_revision` above is an explicit resolution instruction, not a fabricated commit SHA or operational API. The same identified sources used on Acast/Substack **must not** count as two independent corroborating historical witnesses.

## For KFB / NIE without overreach
`SourcePacket → selected source-grounded WorldviewLens → (separate) NIE ANALYZE/GENERATE/PLAY → existing canonical Resident/Card context → existing Triplet or dialogue authoring review`.
The user-owned **private NIE** is a separate intellectual-property owner. Public GitHub's `overworld/docs/NIE_ADAPTER_HOOK.md` is **ARCHITECTURE ONLY / NOT BUILT**; it already names `seed/source/faction/role/situation/relationship/mask/heat/language/bubble_type/length_budget/fallback/deadline_ms/context_budget` and `text/speaker/tell/bubble_type/emote_hint/timing_hint`. Do not promote private NIE contents, paths or full knowledge manifests to public GitHub. **ChatterBox** remains game presentation owner. A researcher may generate an analytical outline independently of an in-game LLM action.

## Acceptance definition for a future GPT Site
Human can click from “Puharich / 1984 lecture” to source listing to 3 claim cards to exact `JM-W10` link, inspect the unresolved 50%-abduction attribution, create one bounded research request and select one **draft** export without copying full private Dropbox text. Each real click/connector action requires separate runtime proof. This GitHub-only walk proves a source-consistent input path and a clear product test, **not a deployed working UI**.

**Actual verification in this chat:** exact existing GitHub source/R2 topic and cross-legacy files were inspected; private NIE design donor **read privately** via authenticated Dropbox connector, kept outside GitHub. No original audio played, no additional primary PDF page inspected, no new source claim promoted. One next research gate remains the original 1984 audio and missing staged-abduction attribution.
