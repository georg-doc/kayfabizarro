# SITE INTEGRATION PACKET · existing KFB Audio Site

## 2026-10-12 · Card Performance self-service publication receipt

- existing URL: https://kfb-audio.frizzlebob.chatgpt.site
- project: `appgprj_6ac1c73dc28881919123106bd6d3e90e`
- source marker: `0.6.0`
- source commit: `e1a1637395855ae59e6bd73aa36a2da93b2e5365`
- version: `9`
- version id: `appgprj_6ac1c73dc28881919123106bd6d3e90e~appgver_225a4be325ac819190d6fcfd6e3bc9e2`
- deployment: `appgdep_6accacccd79c8191be9c35ff35736f35` · succeeded
- archive: `sha256:55628a1abf77b17e9a628bc79bdcbe7dc7276dff1fb5853a3cdcbabb9c9483af`
- Voice content revision: `audio-site-preview-r3-card-11-tune`
- two post-deploy data updates: PASS
- extra Site publishes after setup: 0
- next gate: owner-visible Reload + DRY/D listening only

---
Target: `https://kfb-audio.frizzlebob.chatgpt.site`
Mode: **INTEGRATED AND PUBLISHED IN THE EXISTING SITE ONLY**
Site source: `0.3` / runtime query `0.3.1`

No new Site, Hub write, Cloudflare substitution, second mixer or second player was created.

## Product placement

The existing Mix remains owner. One compact `Adaptive stem proof` panel now sits between the existing B/C/D state controls and Transition desk using the Site's existing panels, buttons, metrics, typography and sticky player.

Catalog / Mix / Soundscape / Intake / Prompt Studio / Brief remain intact.

## Host contract

The production module is stricter than the standalone harness:

- it requires the existing Site AudioContext;
- it requires the existing `SCORE` bus as destination;
- it creates zero AudioContexts;
- it reports `INJECTED_EXISTING_CONTEXT`;
- it uses `AudioContext.currentTime` through one MusicClock;
- it contains no fallback runtime owner.

Public interfaces:

```js
window.KFBAudioSite.musicContext.setState('D', {
  source: 'world-context-adapter',
  context: { billboardId, residentId }
});

await window.KFBAudioSite.adaptiveMusic.startDeck('D');
window.KFBAudioSite.adaptiveMusic.setBoundary('NEXT_BAR');
window.KFBAudioSite.adaptiveMusic.getSnapshot();
```

Events:
- inbound state: `kfb:music-context`;
- outbound state: `kfb:music-context-change`;
- existing voice focus: `kfb:voice-focus`;
- proof diagnostics: `kfb:adaptive-music-change`.

The next World MVP, including POI/Resident/Billboard work, emits context only. It must not instantiate WebAudio, choose a second clock or write mixer truth.

## G proof

Real source: `KFB_G_COSMIC_ROADTRIP_ORCHESTRAL_01 Stems (120BPM)`.

Available:
- ROAD / WIDE / EPIC;
- Immediate / Beat / Bar / Phrase;
- one scheduled stem start;
- gain-only preset changes;
- same epoch through transitions;
- shared shortest-duration loop end;
- master and stem reconstruction are mutually exclusive.

## D proof

Real source: `KFB CONVERSATION STYLE D · BASE Stems (94BPM)`.

The existing TTS lifecycle remains owner. D adds:
- moderate local music reduction;
- 2.2 kHz speech-band EQ space;
- role restraint for Drums / Percussion / Brass / Guitar and lighter restraint elsewhere;
- safe-boundary restoration;
- no pause or source restart.

## B/C/D distinction

Generic B/C/D future stem slots remain metadata-only and contain no placeholder audio. PR #365 separately admits only the real G and D proof families. Starting the D proof also selects context state D; G is not silently re-labelled as state B.

## Publication receipt

- project id: `appgprj_6ac1c73dc28881919123106bd6d3e90e`
- source commit: `fd9d8cd7f85289d8d3a1fc7bd11dd7298bbc63bc`
- version number: `5`
- version id: `appgprj_6ac1c73dc28881919123106bd6d3e90e~appgver_2f797958900c8191b0683a08c761c531`
- deployment id: `appgdep_6ac4624c87a4819182bea35b9dd08301`
- deployment: `succeeded`
- archive hash: `sha256:4da189215cf45a5f61cba457a1619eeadf10621a08e015bf558b2a1d513b7c85`

The only remaining gate is Georg's subjective listening pass for G Road/Wide/Epic and D open/TTS/open, including whether any currently muted Suno-labelled layer should ever be admitted.
