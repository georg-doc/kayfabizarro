# Donor Analysis · KFB Table v6 → KFB Storytelling Maps v1

Status: **CURRENT REFERENCE / DONOR ANALYSIS**
Date: 2026-09-20
Owner: KFB Storytelling Maps direction over `tools/kfb-cartoon-map-board/`

## 1. Evidence boundary

This analysis uses three source classes and keeps them separate.

### A · User-supplied KFB Table v6 wrapper

Attachment metadata is recorded in:

`tools/kfb-cartoon-map-board/_inbox/kfb-table-v6/SOURCE_NOTE.md`

The uploaded HTML is a wrapper, not the full app. It loads:

- `support.js`
- `pet-library.v6.js`
- `kfb-table.v6.js`

via relative paths.

Therefore the exact internal functions, state machine and renderer implementation of `kfb-table.v6.js` are **not** claimed here.

### B · Current/public KFB rules in GitHub

Primary current rule source reviewed:

`Kayfabizarro_Freestyle_Rules_v18-4.md`

Related public/hub source:

`kayfabizarro_freestyle_hub_v18-4.md`

The public site `#kfb` presents the same core grammar.

### C · Historical Gameplay Stage implementation docs

Reviewed:

- `KFB Comic Card Deck Viewer v4 (WS0)/KFB Gameplay Stage.dc.html`
- `KFB Comic Card Deck Viewer v4 (WS0)/docs/KFB_VIEWER_V1_DOKU.md`
- `KFB Comic Card Deck Viewer v4 (WS0)/docs/BACKLOG.md`

These prove a prior structured Story Table and agent seam, but are not automatically the current runtime owner.

---

## 2. What the uploaded v6 wrapper actually proves

The wrapper exposes a configurable 3D-table presentation component:

`<x-import component-from-global-scope="kfb-table" from="./kfb-table.v6.js" ...>`

### Visual / presentation controls

Verified wrapper props:

- `look`: `papier | cel`
- `pet`: `frizzlebob | ailiza | stefain | dochainer | kaifabster | nadaia`
- `wash`: story-mode color wash strength
- `lean`: backward lean of raised cut-out cards
- `jitter`: handmade placement jitter
- `outline`: experimental screen-space ink amount
- `obias`: bottom bias for screen-space outline
- `oboil`: wonky outline jitter
- `silo`: silhouette-only outline
- `collide`: forwarded and defaulted true in `renderVals()`, but not exposed in the uploaded editor-props block

This already separates several useful concerns:

```text
game/story state
≠
table look
≠
pet/narrator identity
≠
cut-out posing
≠
ink treatment
```

That separation is worth preserving.

### Visible product grammar from the supplied screenshot

The visible v6 table includes:

- physical desk / cutting-mat diorama;
- card deck;
- Actor card;
- three Scene slots;
- Quest card;
- Quest-progress die;
- Story-Mode die;
- narrator/pet;
- explicit turn rail:
  `DRAW → ROLL → PLAY → TELL → CALLS → MOVE`;
- narrator beat panel;
- raised flat cards / cut-outs.

This aligns closely with the current Freestyle rules and is therefore a strong **presentation donor** even though the runtime JS is currently unlocated.

---

## 3. Current rule kernel worth preserving

The current Freestyle rules define a compact story game, not a tactical score game.

### State

```text
1–6 players
shared draw pile / discard
one Character per player
shared Quest card
Quest Die 1–6
three shared Scene slots
one Story-Mode roll per turn
social-call feedback
```

### Turn

```text
DRAW
→ ROLL Story Mode
→ PLAY Scene or Character Switch
→ TELL in character
→ CALLS / table feedback
→ MOVE Quest Die
```

The current Story Modes are:

1. Tragic
2. Comic
3. Absurd
4. Heroic
5. Mystical
6. Forbidden

Quest Die remains dramaturgical state, not a score:
- 1–2 Act I
- 3–4 Act II
- 5 Ordeal
- 6 Finale

Social calls:
- KayfaBINGO
- KayfaBONGO
- KayfaBOGGLE
- Blödsinn!

Important current-rule property:

> Powers are narrative invitations, not a calculator/combat sub-rule.

Also:

> No win condition and no score are required by the core game.

This matters for Storytelling Maps: a physical board/map can become a presentation and encounter surface without silently changing the Freestyle rules into a conventional tactics game.

---

## 4. Historical digital Story Table already had the right data seam

The prior Gameplay Stage proved a serializable context:

```json
{
  "players": 2,
  "activePlayer": 1,
  "questProgress": 3,
  "quest": { "cardName": "…" },
  "scenes": [null, {"cardName":"…"}, {"cardName":"…"}],
  "actors": [
    {"player":1,"card":{"cardName":"…"}},
    {"player":2,"card":null}
  ]
}
```

and exposed it as:

`window.KFBStageContext`

The existing documentation explicitly anticipated an agent reading that context and generating story beats / card suggestions.

That is the strongest bridge from Table v6 into Storytelling Maps.

### Decision

Do **not** create a second incompatible "map game context".

Extend the existing conceptual seam:

`KFBStageContext → KFBStageContext v2 candidate`

while keeping the old core fields readable.

---

## 5. What should be reused from KFB Table v6

### Reuse as product grammar

- physical table/diorama framing;
- three Scene positions;
- Quest + Quest Die;
- Story-Mode die;
- Actor presentation;
- narrator strip / beat presentation;
- explicit turn stepper;
- raised card/cut-out staging;
- pet/narrator identity as a swappable presentation actor;
- story-color wash;
- handmade lean/jitter.

### Reuse as architecture concept

- state is separate from visual appearance;
- narrator can observe the table;
- dice are persistent visible state objects;
- cards have semantic roles despite using one common card pool.

### Do not copy blindly

- legacy v6 ink implementation: current Ink owners supersede old v6 line behavior;
- unlocated `kfb-table.v6.js` internals;
- any one-off layout constants tied to the old desk;
- any assumption that Cube Pets are the only narrator/player representation.

---

## 6. How this maps to Storytelling Maps

```text
KFB Rule Kernel
   ↓ emits game/story events
KFBStageContext v2
   ↓
Storytelling Maps Presentation
├── Map / Board
├── Scene anchors
├── Actor standees
├── Quest standee
├── Story/Quest dice
├── Player avatar(s)
├── FrizzleBob / pet narrator
├── Camera
├── VFX/SFX
└── captions / narration
```

The same rule state can be presented as:

- classic desk diorama;
- Europe map;
- Mediterranean Odyssey map;
- KFB World zone map;
- galaxy board;
- deliberately absurd crossover board.

The rules do not need to know whether the Scene slots are drawn on felt, pinned to France, orbiting a moon or sitting inside "4D chess with bowling balls".

---

## 7. Key distinction for future avatars

Current rules have a **Character card**.

The future 3D client also has a **Player Avatar**.

These must not be collapsed.

```text
Player
├── PlayerAvatar
│   ├── KayKit character
│   ├── Cube Pet
│   └── future Frankensteining rig
└── StoryActorCard
    └── current in-fiction Character
```

A KayKit knight can represent Georg at the table while Georg's active Character card is "The Frozen Watcher". That separation prevents gameplay identity from becoming dependent on one 3D rig.

---

## 8. High-level conclusion

KFB Table v6 should be treated as a **valuable physical-presentation and turn-grammar donor**, not as the codebase to resurrect wholesale.

The modern path is:

```text
current Freestyle rules
+ existing KFBStageContext idea
+ current Map Board
+ exact KayKit tabletop pieces
+ current animation/audio/VFX owners
= KFB Storytelling Maps gameplay layer
```

The missing v6 runtime source is not a blocker for T2 Media Standee or for extracting a new small rule kernel later.
