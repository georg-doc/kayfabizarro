# KFB Audio Site

A lean working surface over existing KFB audio owners.

## Human-facing purpose

- browse and hear the canonical Jukebox;
- compare complete-master transitions;
- see available vs missing soundscape source categories;
- inspect new song/stem intake locally;
- build grounded requests for integrated Site Chat.

## Owner boundaries

- canonical song catalog: `media/3D_Assets/Sounds/jukebox.json`;
- shared source pool: `media/3D_Assets/Sounds/` + `media/3D_Assets/Audio/`;
- runtime playback stays consumer-owned (Travel donor already reads canonical Jukebox RAW-first);
- this Site never writes gameplay truth and does not introduce a second AudioContext.

## GPT Site state

The source is Site-ready, but this chat currently has no Sites MCP publish capability. Do not substitute Cloudflare.

The intended hosted Site adds integrated Chat using `site-chat-context.json` and authenticated KFB Production Control artifact persistence. The standalone source remains useful for catalog/play/mix/intake review without pretending that local file drops are already persisted.
