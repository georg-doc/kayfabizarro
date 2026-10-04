# KFB_JUKEBOX_CATALOG_01 · Audio Site

**Status:** IMPLEMENTATION_CANDIDATE · SITE_SOURCE_READY · HOST_PUBLISH_BLOCKED_BY_TOOL_GAP  
**Date:** 2026-10-04  
**Owner:** KFB Audio & Soundscape Baseline v1  
**Repo:** georg-doc/kayfabizarro  
**Branch:** chatgpt-web/kfb-jukebox-catalog-01-audio-site-2026-10-04  
**Outcome:** canonical Jukebox expansion + lean KFB Audio working Site source.  
**Cloudflare:** deliberately not used.

## Goal

Make all current KFB authored music discoverable through the existing canonical Jukebox and provide one lean Audio Site for catalog browsing, master playback, transition work, source-gap curation, upload intake and LLM prompt context.

## Source facts

- main base: `bf1b20d33d44eebb3bf6f7217c3d26c59a633a13`;
- RoadTrip-v2: 42 master MP3s;
- paired stem families: 12;
- Beetle-Wrestling Entrance 01 = 118 BPM / extended alternate;
- Beetle-Wrestling Entrance = 119 BPM / signature family;
- Surf Groove 3min = 100 BPM;
- exact new Jazz track is pending and is not a blocker.

## Protected boundaries

- no second Jukebox registry;
- no second runtime AudioContext/player;
- master recordings stay Ground Truth;
- stems remain source-only except individually certified donors;
- no cross-song pitched stem mixing by default;
- no Cloudflare iteration path;
- GPT Site publication must use Sites MCP when available; do not silently substitute another host.

## Done when

1. existing canonical Jukebox remains backward-compatible;
2. all 42 RoadTrip-v2 masters are registered;
3. all 12 stem-family dirs are declared and resolve;
4. Audio Site source renders a compact catalog, transition desk, soundscape gaps, intake and prompt context;
5. repository validator + browser QA pass;
6. Site source and an authenticated Site/Production-Control preview artifact are persisted.

## Exactly one next gate

`KFB_AUDIO_SITE_PUBLISH_01` — publish this proven source as a real GPT Site when Sites MCP is available, connect integrated Site Chat to the supplied context + KFB Production Control persistence, and verify the Site URL. No Cloudflare.
