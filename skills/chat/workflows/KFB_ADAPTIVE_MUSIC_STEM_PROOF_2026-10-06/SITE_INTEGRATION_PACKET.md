# SITE INTEGRATION PACKET · existing KFB Audio Site

Target: `https://kfb-audio.frizzlebob.chatgpt.site`
Mode: **PUBLISH/INTEGRATE INTO EXISTING SITE ONLY**
No new Site. No Cloudflare substitution.

## Host contract

The production Site must inject its already-owned WebAudio context:

```js
window.__KFB_ADAPTIVE_MUSIC_PROOF__.configureHost({
  audioContext: existingAudioContext,
  destination: existingMusicDestination
});
```

Expected diagnostic:
- `hostMode = INJECTED_EXISTING_CONTEXT`
- `contextCount = 0` from this module

The standalone fallback exists only for the isolated proof page.

## G proof

Use the real:
`KFB_G_COSMIC_ROADTRIP_ORCHESTRAL_01 Stems (120BPM)`

Expose:
- ROAD
- WIDE
- EPIC
- boundary: immediate / beat / bar / phrase

All stem sources start once on the same scheduled timeline.
Preset changes modify gains on that same timeline; they do not restart the track.

Do not run master + stem reconstruction simultaneously.

## D proof

Use:
`KFB CONVERSATION STYLE D · BASE Stems (94BPM)`

Existing Site TTS/voice-focus lifecycle remains owner.
On voice start:
- existing ducking remains active;
- call D Speech Focus;
- gentle music gain reduction;
- speech-band peaking EQ cut;
- role-specific reduction of drums/percussion/brass/guitar.

On voice end:
- restore the open D mix on the next configured safe boundary.

Music timeline must continue throughout.

## Runtime measurements required before acceptance

For both G and D:
1. decode every real stem;
2. report every decoded duration;
3. report max-min duration delta;
4. run at least one long playback/loop check for drift;
5. verify beat/bar/phrase scheduling against actual audible material;
6. confirm that the source-labelled Vocal/Other stems are classified by listening before enabling them.

If stem timelines are not actually compatible:
- do not force a false vertical-layer PASS;
- keep the source candidate;
- use master playback while re-export / stem remediation is decided.

## Site UI placement

Integrate into the existing **Mix / adaptive music** workflow.
Do not create a second mixer.
The current Catalog / Mix / Soundscape / Intake / Prompt Studio / Brief surfaces remain KEEP.
