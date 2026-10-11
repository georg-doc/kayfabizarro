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


---

## 7 · ADDITIVE GEORG AUTHOR DIRECTION · v0.2 · Personal Radio, User Tracks and Context Soundtrack · 2026-10-11

**Status:** approved authoring DIRECTION for *future capability*; design/data-only handoff, no current source integration, no uploaded player MP3, no executable host acceptance. This is an in-place extension of the same KFB Music Collection owner, **not** a second Jukebox or second inventory. Earlier section 3's "playlist/station is a read-only projection" still describes **auto-generated/deck-curated stations**; it is now refined: **personal playlists are player-editable save preferences**, assembled from source-backed KFB songs and optional personal media references. The player does not author the global canonical asset catalog or card-seed mapping by editing a personal playlist.

### 7.1 · Three player-facing playback modes

| Concept mode (names are UX suggestions, not implemented enums) | What the player hears | Island/track/situation transition | Persistence |
| --- | --- | --- | --- |
| **KFB Soundtrack / AUTO** | Existing KFB context-selected score: island/biome, road/race, weather or dramatic/world event; source-backed Suno signature tracks first, then curated Cozy Tunes / secondary pack when appropriate, plus valid silence | Score selector follows existing World/Audio \`AUDIO / JUKEBOX_CONTEXT\`, WorldRecipe/deck tags and event signals; no hard-coded geography in HUD | Current selected mode and optional score preferences in existing \`PLAYER_SAVE\` |
| **My Radio / MANUAL** | Player's chosen station or editable custom playlist: collected KFB songs and, later, valid personal MP3/direct media URLs or authorized private media | User playlist remains authoritative across island/track changes. World soundscape and local diegetic sources remain spatial/available; no forced global score retune | Selected playlist, order, favorites, repeat/shuffle/mute/level and references via PlayerSave/Journey Bundle |
| **My Mix / HYBRID** | Mixed **sequence** of collected KFB and user-provided songs, with authored/personal weights or player order; optionally contextual KFB moments where the player allows them | Context can suggest/queue KFB tracks or opt-in briefly take focus for a meaningful scene, then return to the personal playlist/position; do not override player choice silently | Mode, personal mix order/weights and whether meaningful scene takeover is enabled via PlayerSave |

**Terminology:** *mix* defaults to a combined playlist/queue, NOT two arbitrary full MP3s overlaid and not stem separation. True score stems/adaptive layer mixing require specifically curated compatible files/beat maps, user-authorized AUDIO acceptance, licensing and one existing music transport. Do not pretend a user MP3 has stems/BPM/crossfade synchronization.

### 7.2 · Context input mapping stays with current World + Audio owners

World/experience context signals (proposals to map to existing contracts; **not** new runtime enums):
- World/biome/primary \`deckId\` and optional \`cardRefs\` (Town, Dystopia \`ignore_dystopia\`, Utopia \`forget_utopia\`, Protopia \`embrace_protopia\`), plus themed satellite only when source-approved;
- Track Core route/segment \`RouteRecipe\` ID and Drive state (ROAD vs RACE profile), but Track Core never selects/plays songs or stores audio;
- player state and journey/dramaturgy beats, weather/time/low-stress vs action, named World Pulse/event context only if *existing owner emits* a real accepted signal;
- actual Resident performance/Orc Band/Disco scenelets supply foreground \`DIEGETIC_MUSIC\` rather than generic SCORE; positional attenuation and valid silence are meaningful;
- scripted signature song selects a real source asset; no automatic generative soundtrack claim or invented narrative event.

**Contextual music selector** is a small, existing-audio-owner policy choosing real playable canonical song refs from relevant authored deck/scene stations. No second audio registry, tempo/scene clock, audio output bus, soundtrack graph or Track Core metadata owner. *Suno-first* is selection/curation priority, not a universal force-play rule. Fall back to compatible existing collection or silence when no valid source matches. Do not introduce generic UI themes or fake track posters.

### 7.3 · Theatrical focus and player control (read existing KFB Audio precedence)

The original KFB Audio contract has semantic buses:
\`VOICE | UI | PLAYER_CRITICAL | WORLD_SFX | DIEGETIC_MUSIC | SCORE | LOCAL_AMBIENCE | GLOBAL_BED\`; preserve **one host AudioContext and mixer**.

- **Narration/dialogue focus and critical SFX** remain intelligible and duck music/ambience via existing Audio owner (not by pausing the player timeline). Local performance and scene focus can change relative DIEGETIC_MUSIC vs SCORE priority.
- **AUTO:** context selects/fades SCORE on real changes; avoid restart/churn at small boundary oscillations. Short hold/cooldown, eligible transition/crossfade only where existing owner supports it and has suitable sources. Respect silence and the original soundscape.
- **MANUAL:** own radio/playlist is foreground music. Existing environmental sounds remain; audible local band/disco is still a real world emitter, but automatic world-score switches should not steal the player's personal radio.
- **HYBRID:** user chooses whether an authored world event is (a) ambience/duck only, (b) gentle score insertion/queue next, or (c) a temporary foreground takeover with safe restoration. This is an explicit preference, not an inferred override. No two competing full music transports.
- **Exiting focus/event:** restore the previous queue, cursor and playback state when the underlying owner can; never duplicate or restart a song to fake preservation. A blocked stream reports unavailable and can move to a fallback / user action.
- **Muting:** muting radio/global score never destroys song ownership or receipts. An Orc Band full-listen discovery event must still prove a genuinely valid complete performance/listening criterion (per existing Golden Journey); a private URL listened to in My Radio does **not** create a KFB performance receipt.
- Preserve browser user-gesture unlock, background/suspend/resume semantics, controls accessible on desktop/mobile and not forced autoplays.

### 7.4 · Later player-supplied music inputs — user library vs global KFB catalog

**User intent:** players may later add their **own songs/playlists**, starting with direct **MP3/audio HTTPS URLs** (or equivalent verified playable source), or optionally local/private-file intake if its real existing owner supports it. They may hear those tracks in HUD/Radio and compose mixed playlists with earned KFB songs.

**SOURCE TYPES and boundaries:**

1. **Canonical KFB song** — author-curated and source/license/asset-pinned by the existing Asset Librarian/JukeBox catalog; earnable via NPC/Orc/Disco/RoadTrip. Source-owned \`songId\`; collection unlock truth in PlayerSave.
2. **Player-supplied URL** — private-to-player *media reference* and metadata (name, display artist optional, HTTPS URL/normalized safe reference, resolver state, optional tags). It is **not** a global KFB song ID, not automatically deck canon, not a collectible reward, not advertised to other players and not a source of NPC story truth. Store personal refs in existing player library/save, optionally mapped to player's playlists/deck labels.
3. **Future local file / private upload** — explicit player-driven import only; local browser File/Blob preview may not persist across browsers/reloads, so never claim durable replay from an ephemeral object URL. A durable private binary must use an authorized existing private intake/source resolver (Production Inbox/Asset Librarian plan is a donor, not yet a player-audio feature). No unsolicited file uploads or public CDN publication. File permission and cross-device portability require tested owner flow.

**Direct URL eligibility** must be browser-tested, not guessed from ".mp3" spelling:
- Only player-submitted **HTTPS** for external streams in first concept; reject \`javascript:\`, \`data:\`, \`file:\`, arbitrary redirects, plaintext HTTP, unsupported media types/invalid streams. Treat pasted URLs and titles as untrusted; don't render unsanitized HTML or execute media metadata.
- A webpage/share link (Spotify, YouTube, SoundCloud page, DRM/proprietary player) is **not** a usable direct MP3 automatically. No unapproved downloading, account tokens, credential scraping or cross-platform ripping. An authorized provider adapter, if later wanted, requires separate real integration.
- The actual player browser must be able to fetch/decode/play the resource. **CORS matters especially when using \`MediaElementAudioSourceNode\` in the existing Web Audio mixer**: a remote file may play in a bare HTML audio element but be silent/blocked by Web Audio cross-origin policy. Validate URL, redirects, correct media response and CORS/mixer compatibility before marking available. No server-side proxy to bypass restrictions, and no access to local/private network endpoints.
- Do not store access tokens, signed private credentials or secrets embedded in URLs in canonical game save/export. Show "source unavailable / reconnect / replace URL", retain playlist entry metadata and player preference without faking playback. A user may delete/revoke any personal media reference and its playlist use.
- Runtime metadata and credit/rights follow the original source. Public KFB distribution of player music is **out of scope**; user may add only media they can legitimately access/use. No automated public rehosting.
- A remote source failing HTTP/CORS/expiration should be displayed as unavailable, skipped/fallback with clear UI, not erase the personal playlist or KFB music collection. Resume and offline guarantees only for actually retained/authorized files.
- Do not fetch remote URLs on every world-tick and do not leak player-private playlist URLs to Residents, shared room telemetry, public Almanac/Card exports or server logs by default.

### 7.5 · HUD, radio and playlist authoring contract

**Verified source donor:** \`tools/KFB-ToolBox/_inbox/KFB HUD Flight Board - Flight VFX/KFB_HUD_FLIGHT_SESSION_CUT_2026-10-09_r1/hud-flight/kfb-hud.js\` exposes \`radio.on('music'|'play'|'prev'|'next'|'playlist', fn)\`, \`radio.setPlaylists\`, \`radio.setTrack\`, \`radio.setSource\`, \`setPlaying\`, etc.; it is currently **a presentation source, not proof of active World JukeBox integration**. Retain its HUD visual identity/input router; user controls are delegated to existing KFB Audio music owner.

Suggested narrow expansion *only when authorized in the active product*: a compact station mode choice **AUTO / MY RADIO / MY MIX** within this existing radio, a way to select playlists and a separate collection/library manager for adding URLs, assigning own tags, ordering/removing items, and marking favorites. Do not crowd the drive HUD with URL edit forms. No replacement branding, generic dashboard, or new full-screen mixer by default.

- **Curated auto stations:** read-only KFB-authored/deck-seed projections; source/rights remain global canonical catalog; track must be collected if station is presented as *personal unlocked* library, but an authored ambient score may be audible without collection unlock.
- **Personal playlist:** editable set/ordering of canonical collected KFB song refs + validated personal media refs, with player display name and optional deck/biome tags. Song can be in multiple personal playlists with one actual ownership record.
- **Playlist/source selection** never changes the underlying world score/Resident choreography truth or generates progression events.
- **Mix modes** are player preferences, not new \`Quest\` or \`WorldObject\` truth.

### 7.6 · Lean Memory, Journey and portability update

Use the same **authoritative \`PLAYER_SAVE\` + \`LEAN EVENT MEMORY LEDGER\` + \`FRACTAL ALMANAC/JOURNEY\`** architecture from section 4:
- \`PLAYER_SAVE\` current preferences: chosen mode, current station/playlist ref, user playlist order, song references, shuffle/repeat/mix preferences, event focus behavior and optionally persisted cursor/seek position *if the actual transport supports it*. No duplicated binary. Portable play counts are optional, not a spammy ledger.
- \`LEAN EVENT MEMORY\`: KFB earned song unlocks, NPC gift, performance heard, RoadTrip collected + meaningful playlist-creation/edit milestones *only if editorially valuable*. **Do not emit a MomentReceipt for every shuffle, volume change, pause or every user-URL attempt**. User media added is a private-library change, not automatically a diegetic song discovery or earned Card.
- \`NPC MEMORY\`: references only real shared social/performance events, not a user's private audio history without explicit authorization.
- \`JOURNEY/ALMANAC\`: displays earned KFB songs and meaningful RoadTrip/Orc/NPC discovery sources. Can show personal playlists in a *private player view* but not convert custom MP3s into KFB lore/Card canon.
- \`PLAYER JOURNEY BUNDLE\`: include sanitized personal playlists/user media *references* + source resolver availability and KFB source pins, **not** remote song bytes, local ObjectURLs, bearer tokens, or private access data. On import, mark unresolved refs unavailable and retain playlist/order/metadata until repaired; avoid claiming a cross-device download automatically occurs.
- Preserve collection integrity if one playlist item is missing, unavailable or removed, and preserve the Golden Demon Lord complete-listen source event unchanged.

### 7.7 · Sequenced build plan and conditional acceptance

**Phase P0 — Already-authored Golden collection proof (no new scope):** existing Golden Demon Lord/Orc Band full-song completion → ONE canonical song grant + MomentReceipt → save/export/import/reload + Journey. Preserve dance unlock. This remains the immediate gate for music collection integration.

**Phase P1 — Minimal context radio integration:** source-backed KFB Audio AUTO and existing HUD selection on a real accepted world/Drive surface; a valid context changes a real score; player can choose manual collected KFB playlist and return AUTO; no second player/music owner; diegetic performance + speech ducking remain coherent.

**Phase P2 — Later user library:** one legitimate playable direct HTTPS MP3 media URL added to an editable personal playlist, tested in the browser's actual AudioContext; persist sanitized reference + user title, save/export/import/fresh reload, unavailable failure state; no global music catalog mutation or unwanted upload. This is **future scope**, not a new MVP blocking row.

**Phase P3 — Hybrid sequences/mix and optional private upload:** player-created mix of one collected KFB song + one working external/user media ref; consecutive transport, clean fallback, durable preference; opt-in event context insert/takeover and restore; later private-file intake only with real existing private owner. Optional compatible stem layering only by later explicit approval.

**Proposed acceptance assertions once separately authorized, NONE run in this planning slice:**
1. AUTO Dystopia→Protopia real contextual switch, no phantom unlock or wrong deck source.
2. MANUAL chosen personal playlist persists across island and Track Core changes; remains spatial band audible by scene policy.
3. HYBRID combines KFB and own song in queue with deterministic shuffle/skip; event changes only per saved user preference and returns to previous song/position without duplicate transport.
4. One authorized direct MP3 URL can be played through real target browser/mixer; hostile/bad CORS/signed-expired/proprietary webpage links fail visibly and never falsify play.
5. PlayerSave/Journey export/fresh import recovers custom playlist ordering, mode, sanitized media reference; lost URL only marks source unavailable.
6. Audio muted never deletes collection; Orc Band end-of-song event remains the only qualified original Golden reward; personal MP3 cannot spoof it.
7. Sound voice focus ducking, valid silence, one AudioContext, old HUD/Drive/World inputs unchanged.

**Exactly one next active integration gate is unchanged:** existing Golden Demon Lord/Orc Band full-song→single collected song+MomentReceipt→PlayerSave/Lean Memory/Journey export/import proof. AUTO/user URL/HYBRID remain sequenced future enhancements; no automatic new R4/R5, Stage, user-profile asset upload or Live publication. No PR or runtime tests authorized by this author-design addendum.
