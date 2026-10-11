# KFB Music Collection · Discovery, Deck Seeds & Lean Memory/Journey v0.1

**Date:** 2026-10-11
**Status:** GEORG AUTHOR CONCEPT CORRECTION · SOURCE-MAPPED DESIGN INPUT · NOT IMPLEMENTED / NOT HUMAN GAMEPLAY ACCEPTED
**Owner / route:** existing KFB Island Worldbuilder / Fluff–Crafting–Almanac planning lane; receiving product existing KFB WorldBuilder / WB2 + KFB Audio/Jukebox + canonical player-save/Lean Memory/Journey
**Repo / branch:** `georg-doc/kayfabizarro` · `planning/kfb-fluff-crafting-almanac-ideation-2026-10-09`
**Outcome:** one unified, deck-seed-mapped personal music collection; discover tracks via NPC tape-deck/tape gifts, Orc Band complete performances, Disco events and driven RoadTrip/Track Core routes. All player discovery/ownership/playlist experiences persist via **the existing** PlayerSave + Lean Event Memory + Journey architecture. No new RoadTrip-only inventory, SongBook save format, audio runtime, Card owner or player progression owner.

> This corrects the earlier isolated RoadTrip Music Discovery v0.1 intake. RoadTrip is one **acquisition trigger**, not a separate collection or runtime. The author-specified content order is **Suno Songs FIRST**, **Cozy Tunes and other source-proven collections SECOND**. This is source/curation priority, not an instruction to auto-select an irrelevant Suno track over a well-authored context match.

## 1 · Existing source contracts / protected boundaries

- `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/SITE_GODMODE_LEAN_MEMORY_ARCHITECTURE_2026-10-04.md`: A `PLAYER_SAVE` authoritative current progression/collection state; B Lean Event Memory Ledger contains **song discoveries**; C NPC/Social Memory may reference shared song/Card facts and receipts; D Fractal Almanac/Journey is a player-facing **projection**, not a second collection truth; Player Journey Bundle export/import contains the above. No ChatGPT conversational memory as savegame.
- `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/GOLDEN_JOURNEY_MVP_2026-10-04.md`: verified authoring example, Demon Lord Afro-Strut 01 heard **to completion**, unlock `demon-afro-strut` + dance `kfb_dance_hip_hop_a`, MomentReceipt/provenance, optional Journey entry. Preserve this existing performance criterion.
- `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/DECK_WORLD_SEED_CARD_PIPELINE_2026-10-04.md`: canonical deck identities (Utopia `forget_utopia`, Dystopia `ignore_dystopia`, Protopia `embrace_protopia`), source-backed Card references `deckId + cardNumber`, no duplicate Card registry or replacement media identity.
- `skills/chat/KFB_OPEN_WORLD_ROAD_TRACK_CORE_CANON_2026-10-07.md` + `skills/chat/KFB_JOYRIDE_TRACK_MODULAR_INTEGRATION_SYSTEM_V0_1_2026-10-11.md`: Track Core owns compiled road/race route geometry and stable IDs; Drive/contact owner produces actual traversal facts; no music trigger in mesh compiler or parallel street spline. Current non-Hex island receiver unresolved; Protopia–Maker R1 human visual FAIL and Open World R4 STOP are not overridden.
- `skills/chat/workflows/KFB_AUDIO_SOUNDSCAPE_BASELINE_V1_2026-09-24/START_HERE.md`: shared KFB Audio mix/ducking and one AudioContext per host, existing Travel/Race JukeBox donors; no new audio transport.
- `kfb-hub/stunt-race/track-environment-lab/box-stop/radio.mjs`: canonical `media/3D_Assets/Sounds/jukebox.json` plus opt-in pinned RoadTrip v2 assets is source-code donor, not evidence that full song collection is integrated.
- `skills/chat/ASSET_LIBRARIAN_PRIVATE_AUDIO_INTAKE_PREP_2026-10-08.md`: Asset Librarian tracks canonical source logical `assetKey`, title, artist, collection, rights, duration when known, runtime/preview status; private audio binaries remain private. Confirmed secondary metadata example `Whispering Woods` / Pizza Doggy / `Cozy Tunes - The Classics`; not automatically approved as an actual in-game playback source. Source provenance and audio availability must be checked before binding.
- Existing Resident Atlas Orc Band and Disco use an authored shared song transport/playlist and performance contexts. Preserve their choreography and playback owners, do not implement a new rhythm clock.

## 2 · One personal collection / multiple acquisition routes

| Proposed acquisition source | Qualifying player event | Recorded provenance |
| --- | --- | --- |
| `NPC_TAPE_GIFT` | A real Resident gifts a song/tape or tape-deck music item in an accepted interaction; gift means one grant, no implicit listen-to-end requirement | `songId`, Resident/source, interaction, world location, gift/item ref if source-verified |
| `BAND_SONG_COMPLETED` | Player witnesses/hears the Orc Band's **entire actual song**; true valid complete-playback/session event | `songId`, Band performance/session, time/place/Resident refs |
| `DISCO_SONG_COMPLETED` | Proposed shared completion-based qualification for a real Disco song/performance (author named Disco collection channel; exact event semantics require owner proof) | `songId`, Disco venue/session/performer |
| `ROAD_SEGMENT_DRIVEN` | Actual qualifying Joyride Drive progress through authored Track Core corridor/route; no trigger from merely standing nearby | `songId`, route/segment and island IDs, real Drive passage |
| `RACE_FINISHED` / `ISLAND_CONNECTION_DRIVEN` | Accepted finish/lap result or actual departure→arrival traversal from existing source; optional author mapping only | `songId`, race result or source route endpoints |

**Important:** these are **concept labels only**, *not current runtime event enums or approved new APIs*. The current data/model owners translate them to existing events. No event may invent a song source, resident, audio playback, race timer, Track Core element or on-world attraction.

Multiple paths may reveal the same song. Deduplicate the **owned song** on canonical `songId`, not on event source. The same song may have multiple meaningful provenance events/receipts (NPC gift and later Band concert), but no duplicate reward, savebook copy, counters or item grant.

Current Golden Journey `demon-afro-strut` completion unlock, dance pairing, receipt and non-linear movement stay unchanged. Music rewards are optional exploration/progression, not a forced route through every island.

## 3 · Catalog vs collections vs deck-seeded playlists

**Canonical source catalog:** one source-backed logical `songId` / asset key, source file/private resolver, creator, pack/collection, metadata, rights/provenance and playable state. Sources prioritized by author: **(1) KFB-authored Suno songs / RoadTrip / original signature music; (2) curated Cozy Tunes etc.** No duplicate registry or copying private media to public CDN.

**Catalog collection / pack** means source provenance/family (`KFB RoadTrip JukeBox v2`, `Cozy Tunes - The Classics`, Band/Disco soundtrack pools etc.), not evidence of player ownership.

**Deck/Card-seed mapping** is an authored semantic many-to-many relation between source song IDs, primary/secondary `deckId`, optionally specific `deckId + cardNumber`, World/Resident/story/biome cues and authored collection weights. Keep source Card/PDF identity. No deterministic fantasy derivation of lyrics, titles, tags, or genre from deck seed alone; match/curate actual source music and retain provenance.

**Playlist / station** is a *read-only projection/curated sequence* of currently available tracks for the player: e.g. deck-seeded Dystopia/Utopia/Protopia, RoadTrip, Orc Band/Disco, cozy moods, plus later manually ordered favorites. Songs can appear in multiple playlists without duplicating collection ownership. Runtime music transport, ducking, audio permissions and one existing JukeBox remain authoritative.

**Personal music library** is the view of globally collected/unlocked canonical song IDs and collection metadata as reconstructed from existing PlayerSave and Lean Memory. A personal playlist's order/likes/selection are player preferences stored in the established save/Journey bundle (not a separate new runtime persistence engine). Do not conflate "source metadata exists" with "player collected it".

## 4 · Persistence contract — Georg clarification: ALL via Lean Memory / Journey

Use the **existing, explicitly layered canonical architecture**:
1. **PLAYER_SAVE** owns current unique unlocked/collected `songId` references, discovery/progression and user playlist/preferences (where available). The existing player save remains the single source of "what is owned now".
2. **LEAN EVENT MEMORY LEDGER** stores only meaningful facts: gift received, full performance heard, qualifying drive finished, song unlocked, card/deck association and relevant world/resident/session/route/source refs. One idempotent acquisition operation, append-style events and deterministic repeat handling. No duplicated audio blobs or large activity trace.
3. **NPC / SOCIAL MEMORY** may consume relevant gift/encounter receipts and known song references; no full transcript copied into memory and no second NPC inventory.
4. **FRACTAL ALMANAC / JOURNEY** projects the same receipts as lived stories: what song, where, from whom, which track, which deck/Card context, timestamp/session as valid, with optional screenshot/Hero Shot. Projections can be rebuilt; they do not establish independent unlock truth.
5. **PLAYER JOURNEY BUNDLE** export/save/import/fresh reload preserves all song IDs, real receipt provenance, deck mappings by referenced catalog/version, and playlist preferences; pin source and schema/version for repeatable reconstruction. Missing/private audio binary produces an honest unavailable/preview pending state **without deleting** earned collection proof.

**Illustrative logical event shape, NOT new schema:**

```json
{
  "kind": "MOMENT_RECEIPT",
  "source": "BAND_SONG_COMPLETED",
  "songId": "demon-afro-strut",
  "contextRef": "source-verified-event-reference",
  "deckId": "ignore_dystopia",
  "playerCollectionEffect": "UNLOCK_ONCE"
}
```

The string `source-verified-event-reference` above is schematic, **not** an implemented event identifier. The original Golden Journey source currently specifies `demon-afro-strut`; no new source/song IDs are invented. Track event IDs, identity, timestamps and schema fields must follow the actual receiving owner rather than this depiction.

## 5 · First integration pilot only when real host exists

Use one **already accepted** source-backed music/performance context (the Golden Demon Lord/Orc Band proof is the most concrete documented completion criterion), plus one real gift OR real drive route if those source interactions exist. Do not postpone a simple already-valid Band pilot until the presently unaccepted Protopia–Maker bridge is repaired. Equally, do not claim its Stage or scene exists from a planning paper.

Proposed automated checks once implemented:
- one complete real Band song → one song grant and one provenance receipt; premature stop/seek must not qualify;
- one accepted Resident gift → same owner/player collection, provenance points to giver, no duplicate upon re-interaction;
- an optional genuine Disco completion and valid Drive traversal follow same grant mechanism without new store;
- second acquisition path of the same song → still one unique unlocked song, optional second *distinct* meaningful Journey provenance;
- saved/exported/imported fresh session → same collection, playlist preference, source refs, deck mapping and Journey event;
- audio muted, unavailable/private or playback error must not falsify or erase a completed verified reward; differentiate proof-of-completion from volume/capability;
- retained compatibility with existing Golden Journey dance-move reward and source-mapped Card/Almanac.

All checks above are **PROPOSED**, with **0 new runtime/browser/independent-critic tests** in this design-only correction.

## 6 · Scope / author acceptance

**AUTHOR DIRECTION 2026-10-11:** RoadTrip music discovery, Resident tape-deck/tape gifts, full-song Orc Band listen, Disco sessions are acquisition modes of **one** song-collection model. Collections/playlists sort and map to canonical Card Deck seeds; Suno music is primary, Cozy Tunes etc secondary. **All player history, unlock and preference state uses the existing Lean Memory/Journey save architecture.**

No new SongBook owner, no new JukeBox/AudioContext, no second card deck renderer, no parallel NPC/gift progression, no forced Hex world, no R4/R5 restart. Implementation, candidate routes, source-performer tests and final gameplay acceptance remain outstanding.

**One next implementation evidence gate:** existing Audio/Progression/Lean Memory owner maps the already-authored **Golden Demon Lord/Orc Band song-to-end receipt** through exactly one persisted collection entry and recoverable Journey event; then reuse the same path for gift, Disco and RoadTrip when those real sources are available.
