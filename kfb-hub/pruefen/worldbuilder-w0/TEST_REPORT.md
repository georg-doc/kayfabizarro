# Browser test · WB-W0 source-lock

Date: 2026-09-24  
Surface: local HTTP package at the same path shape as the public review route

## Result

- Built-in world gates: **10/10 PASS**
- JavaScript syntax: **9/9 PASS**
- Source metadata JSON: **PASS**
- Runtime page errors: **0 observed**
- Route run: **PASS**
- Door-threshold run: **PASS**

The built-in ramp deliberately reports 30° and 35° as FAIL. This is expected evidence for the measured 25° walk limit, not a failing release gate.

## Browser warnings retained as evidence

- Three.js warns that `PCFSoftShadowMap` is deprecated.
- Three.js repeatedly warns that a texture is marked for update without image data. This correlates with the known black-rendering KayKit tree/material issue and remains `HOLD`; the source-lock does not guess a replacement material.

## Scope

This test proves that the copied package retains the same measured WB-W0 behaviour. It does not approve the visual HOLDs or promote the candidate to the production WorldBuilder.
