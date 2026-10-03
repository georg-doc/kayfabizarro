# AUDIO-STEM-BED-01 · START HERE

**Status:** PUBLIC_VERIFIED · HUMAN LISTENING PENDING  
**Date:** 2026-10-03  
**Owner:** KFB Audio & Soundscape Baseline v1  
**Repo:** `georg-doc/kayfabizarro`  
**Branch:** `chatgpt-web/audio-stem-bed-01-2026-10-03`  
**Draft PR:** #341  
**Public Stage:** `https://kayfabizarro.pages.dev/kfb-hub/stage/audio-stem-bed-01/`

## Goal

Prove the selected KFB music architecture with one already-musical Suno donor:

**Suno-authored performance → phase-locked stems → KFB runtime stem weighting.**

No note generation, no phrase slicing and no time-stretching in this gate.

## Donor

`Cyclical Warmth` · 76 BPM

Stems:
- Drums
- Bass
- Guitar
- Keyboard
- Percussion
- Strings
- Synth
- Brass

All eight remain on one source timeline.

## Runtime controls

- **ACTIVITY** — raises drums/percussion and slightly increases other active color.
- **ROAD-LIFT** — brings drums/bass/percussion/guitar forward without changing BPM or timeline.
- **NIGHT** — reduces rhythmic/high-presence layers, retains more synth/strings and gently lowers global cutoff.
- **VOICE FOCUS** — ducks harmony/color stems much harder than bass/groove and preserves timeline continuity.

## Evidence

Current branch head before metadata close:
`e8e3831342272ff60e3f1e1ce615238b3095ecf8`

Current-head QA:
- **22/22 source PASS**
- **19/19 Chromium/WebAudio PASS**
- run `37127242414`
- job `111214932398`
- artifact `11274659711`
- digest `sha256:583091c280e4695812860fda12fbe6a4364ba0ec2d27221e5af505c99d3bd020`

Public:
- publication `cloudflare-live@5943f7bbd6c768ea8c92d5c2010b0e07a16d0b5b`
- Pages check `111214744359`: **SUCCESS**
- public proof `37127139985 / 111214619612`
- **19/19 PASS**
- artifact `11275318621`
- digest `sha256:8bd1bcb61da7417363d8d73e6ab40c9e11636daef789cb78785dba85540e9438`

## Emotional donor expansion

Four new Suno prompt families are prepared in:
`SUNO_EMOTIONAL_RPG_DONORS_v1.md`

Coverage:
- Demon Lord / dark boss combat
- grief / NPC loss
- sunshine / festival / disco
- mystery / awe / ancient revelation

Generate masters first; stem only the winners.

## One next gate

**GEORG_AUDIO_STEM_BED_01**

Compare MASTER REFERENCE vs ADAPTIVE STEM BED and move Activity / Road-Lift / Night / Voice Focus.

Question:
**Does KFB gain useful gameplay control without making the authored music feel worse or obviously remixed?**
