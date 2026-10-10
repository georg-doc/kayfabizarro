# BRIEF · KFB Production Hub Resident / Story Overlay v2

Executor for future implementation: **ChatGPT Work/WSA**
Execution mode now: **BOUNDED_SLICE · PREP ONLY**
Owner: **KFB Production Hub**
Issue: **#370**

## 1. Why this is a good side quest

The Hub already contains the thin end of the desired idea. The correct move is to expand the existing Presenter into a consumer of canonical KFB modules.

The resulting feature can serve four practical purposes at once:

1. **visual regression / character look check** — which model, face/eyes, rig and motions are actually current;
2. **interaction lab** — test animation selection, eye/face reactions, bubbles and browser TTS without entering a large world;
3. **project guide** — surface current status, next gate and provenance through a character instead of another dashboard card;
4. **behind-the-scenes archive** — tell the real project history from GitHub decisions, Returns, failures and recovered donors.

The same Presenter can later become an embeddable/bookmarklet module, but that is downstream.

## 2. Verified donor matrix

| Capability | Exact donor/source | Current use |
|---|---|---|
| Hub shell / behavior | `HUB_SHELL_DATA_STYLE_CONTRACT_2026-10-06.md` + accepted Hub v2 donor | Receiving owner |
| Resident Overlay | `.../code/hub-recovery/resident-overlay.v1.js` | **Primary code donor** |
| FrizzleBob current 3D | `FB_TEMPLATE_LOOK_v5.glb` + ToolBox graft/face/ear owners | **Primary FrizzleBob source** |
| Medium/Large residents | Resident Atlas S17 / canonical KayKit files | actor source registry |
| Legacy residents | Resident Atlas S17 legacy assembly | later actor source registry |
| Motion | KFB Motion Library / existing Rig libraries | animation owner |
| Eye/face | existing EyeRig/PetMouth/ToolBox modules | presentation adapter only |
| Band | `RESIDENT_BAND_MODULE_01.md` + `lib/band-module.js` | optional performance module |
| Disco | `RESIDENT_DISCO_CD_01.md` + host song transport | later performance module |
| ChatterBox presentation | ChatterBox Studio v2 | bubble/timing presentation donor |
| Browser TTS | ChatterBox v2 `tts-follow` + `speechSynthesis` | voice adapter |
| Hub live data | `main/kfb-hub/current-board.json` | status source, not story archive |
| Hub live style | `main/kfb-hub/hub-live.css` | appearance only |
| Long history | Git commits, Issues/PRs, `skills/chat/CHANGELOG.md`, project Returns/Recovery | story corpus source |

## 3. Source-object isolation requirement

Before a future implementation consumes a visual/3D donor, the executor must show that donor in isolation.

Minimum isolation proofs:
- current FrizzleBob v5 source in its canonical ToolBox/rig viewer;
- one Rig_Medium Resident Atlas actor;
- one Rig_Large Resident Atlas actor;
- one Rig_Legacy actor before Legacy support is enabled;
- Resident Band Module 01 by itself before Hub mounting;
- ChatterBox bubble/TTS presentation by itself before Hub mounting.

A URL loading successfully is not donor-design proof.

## 4. Presenter v2 module contract

Recommended conceptual API, not implementation truth:

```js
mountKfbPresenter({
  host,
  actorSource,
  presentationSource,
  storySource,
  mode: 'character' | 'status' | 'story' | 'performance',
  permissions: {
    mutateProject: false,
    mutateActorSource: false
  }
})
```

Presenter responsibilities:
- mount/dismount;
- viewport-safe positioning;
- actor selection;
- play canonical clips;
- request face/eye/presentation states through adapters;
- render bubbles;
- invoke browser TTS only from user action or explicit playback;
- expose provenance for every visible story/status answer;
- mount optional performance consumers.

Presenter must **not** own:
- model files;
- rigs;
- motion clips;
- face/eye canonical configuration;
- story truth;
- project TODO truth;
- song transport;
- dialogue-generation policy for the world.

## 5. Actor registry

Move from the hard-coded 3-actor prototype toward a read-only registry entry shape:

```json
{
  "id": "frizzlebob",
  "label": "FrizzleBob",
  "rigFamily": "medium",
  "sourceOwner": "ToolBox / FrizzleBob v5",
  "modelRef": "canonical pinned source",
  "mountAdapter": "graft",
  "motionProfile": "canonical profile id",
  "faceAdapter": "existing owner",
  "eyeAdapter": "existing owner",
  "capabilities": ["idle","oneShot","talk","eye","face"],
  "provenance": []
}
```

The registry is a *pointer layer*. It never copies the canonical asset.

## 6. Clay / shadow presentation

The original overlay already uses a real three.js cast shadow, which is preferable to a fake ellipse.

For the requested Clay Floor look:
- do not invent a local texture;
- use the current KFB Clay/Surface canon when implementation starts;
- the Presenter owns only its local floor receiver / material adapter;
- if the real `clay_floor_001` or successor is used, source-isolate and pin it;
- preserve transparent overlay behavior so the Hub remains readable.

The visual target is “small character physically standing on the Hub surface”, not a floating web widget.

## 7. Character animation lab inside the Hub

A compact developer mode can expose:
- actor;
- rig family;
- current source/pin;
- current clip;
- clip search;
- one-shot play;
- idle;
- face/eye state;
- TTS voice;
- shadow/clay toggle;
- source link.

This should be a developer drawer, not permanent dashboard chrome.

The normal user view should remain character-first.

## 8. Status / next-TODO dialogue

A click can request a compact answer built from **current GitHub/Hub owner truth**.

Recommended response object:

```json
{
  "intent": "next-gate",
  "speaker": "frizzlebob",
  "text": "Resident choreography is first; Shield Fit follows unless it becomes outcome-critical.",
  "sources": [
    {"kind":"github","ref":"issue:369"},
    {"kind":"github","ref":"skills/chat/START_HERE.md"}
  ],
  "freshness": "2026-10-07T...",
  "tts": true
}
```

LLM use belongs behind this structured retrieval layer:
1. retrieve current facts;
2. constrain answer to retrieved facts;
3. optionally voice/style the answer as the selected character;
4. retain source links.

No free-form “project manager hallucination” mode.

## 9. Storytelling engine

The story engine has two layers:

### A. factual corpus
Normalized, machine-readable events with provenance.

### B. narrative projections
The same events can be rendered as:
- chronological technical history;
- “making of” / behind-the-scenes;
- Hero's Journey;
- postmortem trail;
- “roads not taken”;
- character-guided tour;
- component genealogy (“where did this module come from?”).

Narrative framing never edits the source event.

## 10. Hero's Journey use

Use Hero's Journey as a **view**, not as a claim that every engineering event naturally fits Campbell.

Suggested project-scale beats:
1. Ordinary World — early KFB experiments / separate prototypes;
2. Call — desire for a coherent playable/authorable KFB world;
3. Refusal / Fragmentation — parallel tools, duplicated runtime ideas, brittle handoffs;
4. Mentor / Rules — SSOTs, source isolation, one-owner contracts;
5. Threshold — Stage/Site workflows and reusable modules;
6. Tests / Allies / Enemies — Resident Atlas, ToolBox, WorldBuilder, ChatterBox, audio, critics;
7. Approach — One-Shot integration / architecture freeze;
8. Ordeal — regressions, rollbacks, failed candidates, postmortems;
9. Reward — recovered donors and proven modules;
10. Road Back — integration of authoring/persistence/performance;
11. Resurrection — coherent KFB product rather than demo collection;
12. Return — open/free-to-play project plus transparent making-of archive.

Each chapter must link to exact evidence; “drama” is presentation, not a substitute for facts.

## 11. Project history extraction pipeline

Recommended deterministic first pass:

1. enumerate Git tags/commits by time;
2. collect `skills/chat/CHANGELOG.md` entries;
3. collect project/workflow `RETURN.md`, `RECOVERY.md`, `POSTMORTEM*.md`;
4. collect Issues/PR titles, states, milestone decisions and Georg feedback;
5. normalize events to `PROJECT_STORY_CORPUS_SCHEMA.json`;
6. deduplicate repeated handoff summaries;
7. assign systems/tags/actors;
8. assign optional story-beat labels;
9. run source-link validation;
10. only then allow LLM condensation or narration.

## 12. Band / music mini-player

First candidate is the existing Resident Band Module 01.

Requirements:
- mount module, do not reconstruct it;
- one existing host song clock;
- preserve source actors and clip ownership;
- compact transport may proxy play/pause/beat position;
- show current module provenance;
- performance can be dragged with or anchored near Presenter;
- no audio autoplay;
- browser user gesture still gates sound.

Disco is a later second consumer because it already has a broader ensemble and lighting budget.

## 13. Bookmarklet / embeddable future

Treat Bookmarklet as an adapter:

`same Presenter core → bookmarklet bootstrap → page-safe mount`

Constraints:
- no destructive DOM ownership;
- one high-z isolated root;
- Shadow DOM preferred for CSS isolation;
- reversible unload;
- no page navigation interception;
- no credential scraping;
- no arbitrary page mutation.

A “Destroy Any Website”-style toy may be explored later as a separate opt-in toy/sandbox. It is explicitly not part of this Product Hub integration.

## 14. Phased implementation

### Phase 0 · source isolation
No Hub writes. Show exact donors.

### Phase 1 · Presenter v2
Generalize actor registry and inspection, retain v1.1 semantics.

### Phase 2 · ChatterBox/TTS adapter
One source-backed static fixture, then live current-status retrieval.

### Phase 3 · Story corpus prototype
Generate a bounded first corpus from one historical period and validate provenance.

### Phase 4 · Story mode
Triplet/bubble/TTS playback over factual corpus.

### Phase 5 · performance consumer
Mount Band Module 01.

### Phase 6 · bookmarklet
Only after Hub Presenter passes.

## 15. Acceptance

A future implementation is successful when:
- accepted Hub affordances remain unchanged;
- FrizzleBob v5 and at least Medium/Large canonical actors load from their real sources;
- actor clip playback is source-backed;
- shadow/clay presentation visibly grounds the actor;
- one source-backed Hub status answer appears in ChatterBox form and can be spoken by browser TTS;
- one story event can open its exact GitHub evidence;
- no duplicate runtime owner exists;
- optional Band consumer mounts without creating a second song clock.

No human gate is created by this planning packet.
