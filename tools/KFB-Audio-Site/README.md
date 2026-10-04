# KFB Audio Site

A lean working surface over existing KFB audio owners.

## Human-facing purpose

- browse and hear the canonical Jukebox;
- compare complete-master transitions;
- see available vs missing soundscape source categories;
- inspect new song/stem intake locally;
- build grounded requests for integrated Site Chat.
- select and inspect the shared B/C/D music interaction targets;
- exercise smooth B ↔ C ↔ D transitions together with the existing TTS ducking seam.

## Owner boundaries

- canonical song catalog: `media/3D_Assets/Sounds/jukebox.json`;
- shared source pool: `media/3D_Assets/Sounds/` + `media/3D_Assets/Audio/`;
- runtime playback stays consumer-owned (Travel donor already reads canonical Jukebox RAW-first);
- this Site never writes gameplay truth and does not introduce a second AudioContext.
- `music-interaction-states.json` is the additive B/C/D contract; it keeps the current semantic roles and exposes a manual control plus a later World-context adapter.
- stems are `FUTURE_NOT_AVAILABLE`: target slots exist, audio mappings remain intentionally empty.

## Music interaction states

- `B · MOVEMENT / ADVENTURE` — higher energy/density, forward groove, readable transients;
- `C · STAYING / COZY EXPLORATION` — lower energy, softer percussion, more place and discovery space;
- `D · TALKING / SOCIAL INTERACTION` — discreet triplet/shuffle pulse, strong speech-space bias, existing TTS ducking still separate and active.

Manual selection lives in Mix. A future consumer may call:

`window.KFBAudioSite.musicContext.setState('D', { source: 'world-context-adapter', reason: 'resident-dialogue' })`

or emit `kfb:music-context`. The Site dispatches `kfb:music-context-change`. All audio gain ramps use the one AudioContext clock. World, Resident, POI and Billboard systems emit context only; they do not become audio owners.

## GPT Site state

The source is Site-ready, but this chat currently has no Sites MCP publish capability. Do not substitute Cloudflare.

The intended hosted Site adds integrated Chat using `site-chat-context.json` and authenticated KFB Production Control artifact persistence. The standalone source remains useful for catalog/play/mix/intake review without pretending that local file drops are already persisted.

## Prompt / chat donors

The Site package includes the existing KFB prompt families under `prompts/` plus `SITE_CHAT_INSTRUCTIONS.md`. `KFB_MUSIC_CONTEXT_STYLES_BCD_v1.md` adds the authored Base Style B, Cozy Style C and Conversation Style D packs. These are grounding/reference material for integrated GPT Site chat, not invented runtime metadata or placeholder audio.
