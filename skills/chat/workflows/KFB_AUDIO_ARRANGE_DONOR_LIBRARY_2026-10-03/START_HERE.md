# KFB AUDIO DONOR LIBRARY · START HERE

**Status:** CENSUS PASS · ARCHITECTURE DECISION READY  
**Date:** 2026-10-03  
**Owner:** KFB Audio & Soundscape Baseline v1  
**Repo:** `georg-doc/kayfabizarro`  
**Branch:** `chatgpt-web/audio-arrange-donor-library-2026-10-03`  
**Base:** `main@be9a2a8a8c96ab1bdb652709e3b65068399b103b`

## Purpose

Classify the current Suno master+stem donor library after AUDIO-ARRANGE-01 proved that stem-based runtime playback preserves musical quality while enabling game control.

This slice does not publish a new Stage.

## Core decision

Use a **Suno-authored adaptive stem bed** architecture:

1. Suno remains the authoring-time composer/session performer.
2. Winning masters are stem-separated.
3. KFB runtime plays one stem family phase-locked.
4. Gameplay modulates stem gains/effects/ducking.
5. Donor families crossfade at musical boundaries.
6. Horizontal phrase slicing is optional later, not required to prove adaptive music.

This preserves the musical quality of authored Suno material while giving KFB more control than TinySkies-style whole-track crossfading.

## Read

1. `DONOR_REPORT.md`
2. `RECOVERY.md`
3. `RETURN.md`

## One next gate

**AUDIO-STEM-BED-01 · Adaptive Suno Stem Bed**

Prototype one phase-locked stem family with semantic controls for density/road/night/voice focus, then add musically bounded crossfade between donor families.
