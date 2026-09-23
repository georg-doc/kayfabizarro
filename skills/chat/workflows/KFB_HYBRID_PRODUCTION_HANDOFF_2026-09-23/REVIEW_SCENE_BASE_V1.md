# KFB Review Scene Base v1 · Webchat / Coworker

Status: **PREPARED SHARED REVIEW GRAMMAR · REUSE EXISTING DONORS**

## Für Georg

Ziel:
3D-Abnahmen sollen nicht jedes Mal in einem anderen künstlichen Test-Setup stattfinden.

Ein Webchat bekommt künftig möglichst dieselbe Review-Grundstruktur:
- echte Quelle;
- echte Texturen;
- echte relevante Umgebung;
- gleiche Kamera-/Bedienlogik;
- direkter 3D-Review im Chat;
- keine Screenshot-Abnahme als Ersatz für eine drehbare Szene.

## Existing donor

Primary accepted review harness:
`threejs-focus-review-v1`

Owner docs:
- `skills/chat/workflows/KFB_WEB_FIRST_EXECUTION_V1_2026-09-22/REVIEW_TEMPLATE_POOL.md`
- `review-templates/REGISTRY.json`

Do not create a second generic review framework.

## v1 additions

### A · Source isolate

If a donor/source object matters:
show it first unchanged in an isolated preset/view.

A loaded URL is not donor proof.

### B · Integrated scene

Second preset/view:
the object in the actual relevant host relationship.

### C · Camera grammar

Default:
- Orbit drag;
- Wheel/pinch zoom;
- Reset;
- 3–8 named camera presets only when they answer acceptance questions.

Camera presets are review evidence, not product camera ownership.

### D · Minimal review chrome

Allowed:
- title / source head;
- compact legend;
- camera presets;
- 2–6 relevant layer toggles;
- optional Diagnostics toggle.

Diagnostics OFF by default.

No floating dashboards covering the subject.

### E · Asset loading

Use exact pinned source URLs/refs.

No:
- guessed relative assets;
- replacement primitive;
- placeholder character;
- fake texture.

For ChatGPT review-host texture limitations:
consume the existing verified review adapter where relevant.

Fail closed:
`SOURCE <thing> FAILED`

### F · Environment truth

Do not use a generic terrain/light/shader when the acceptance question depends on the product environment.

Use one of:

1. **NEUTRAL CALIBRATION**
   - only when environment is irrelevant;
   - simple neutral ground + restrained light.

2. **OWNER ENVIRONMENT**
   - import/use the actual terrain/world/light owner needed for the decision.

Never replace the owner's terrain with a convenient different terrain shader and then call the result representative.

### G · Shadow rule

For 3D actor/prop acceptance:
prefer real scene lighting + actual 3D cast/receive shadow where performance permits.

No blurred fake circle as default substitute.

If shadow is review-only approximation:
label it.

### H · Review artifact persistence

Actual human-gate HTML:
- direct clickable in chat;
- committed in owner repo or retained CI artifact;
- source/runtime head recorded;
- SHA-256 recorded;
- human result recorded afterward.

### I · Self-test contract

Review may expose:
- ready marker;
- source loaded markers;
- renderer ready;
- expected object counts;
- named owner/module markers.

Self-test must not pretend to prove visual acceptance.

## Webchat setup block

Every 3D Web slice should state:

```
REVIEW_BASE: threejs-focus-review-v1
ENVIRONMENT: NEUTRAL_CALIBRATION | OWNER_ENVIRONMENT:<owner>
SOURCE_ISOLATE: required | not-required
ASSET_POLICY: exact pinned / fail-closed
TEXTURE_POLICY: canonical + verified review adapter only where needed
SHADOW: real 3D scene shadow unless explicitly out-of-scope
HUMAN_ARTIFACT: direct chat link + durable repo/CI storage
```

## Non-goals

This template does not become:
- terrain owner;
- camera owner;
- asset database;
- material owner;
- editor;
- physics engine.

It is inspection presentation only.
