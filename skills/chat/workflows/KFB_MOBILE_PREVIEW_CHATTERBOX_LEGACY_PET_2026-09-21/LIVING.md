# KFB Mobile Preview + ChatterBox / Legacy Web Pet · LIVING

Status vocabulary in this file:
`USER_DIRECTION` · `SOURCE_FACT` · `PROPOSAL` · `DECISION` · `IMPLEMENTED` · `TESTED` · `PUBLIC_VERIFIED` · `HUMAN_ACCEPTED`

This is the persistent ideation record for the mobile preview / Legacy Web Pet / ChatterBox consumer lane. It is additive. Later turns append; earlier entries are not rewritten to simulate certainty.

---

## 2026-09-21 · Turn 001 · lane bootstrap

### USER_DIRECTION

Georg wants this chat to be the KFB **mobile preview rendering / ideation chat** with GitHub synchronization on every substantive turn.

The lane should be useful for:
- mobile rendering and layout review;
- KFB Hub Stage previews;
- Legacy Web Pet / Legacy rig experiments;
- trying the existing ChatterBox and Triplet lineage in that context;
- later reuse by the Chrome extension without turning this chat into a second extension runtime owner.

### SOURCE_FACT · Legacy Web Pet

Current source slice:
- Draft PR #157;
- branch `chatgpt-web/legacy-web-pet-v0-2026-09-21`;
- current PR head at bootstrap: `4e26e04ab1e95e6e36001ebb14ce66be95d91570`;
- tested Web runtime head: `f41c59a8178bf77266c0f776f2e20a7948ee6223`;
- Web/Hub evidence: 15/15 static + 12/12 WebGL PASS;
- MV3 build PASS;
- arbitrary-page extension ready gate failed twice and is frozen;
- next extension gate remains `LWP-EXT-F1` observability only.

Current `main` observed at bootstrap:
`ce514192d2647a8e4882a7f3f010665a4a3964e7`.

PR #157 and main are diverged. No silent rebase or source rewrite is authorized by this chat.

### SOURCE_FACT · ChatterBox

Located current-reference routing says ChatterBox is **not** a missing monolith. Existing donors already cover:
- static faction content;
- source selection / chatter runtime;
- bubble layout;
- bubble drawing/presentation;
- identity and scheduling donors;
- a documented NIE hook that is still only a hook.

The existing role chain is:
`NIE → Performance Mask → ChatterBox → Bubble / Emote / TTS`.

The receiving host keeps movement, collision, gameplay, actor state and page interaction.

### SOURCE_FACT · concrete phrase donor

`overworld/overworld/chatter-phrases.js` contains real static source data.

Examples of existing named pools:
- `kingCourt`
- `townsfolk`
- `camp`
- `wilds`
- `cave`
- `frost`
- `shore`
- `dungeon`

It also contains:
- short `idle`, `antwort`, `frage`, `philo`, `spott`, `handel` lists;
- source-fragment templates under `ueber`;
- a faction-specific `SYNTHESE` table;
- sparse activity thoughts under `TAETIGKEIT`.

The source itself explicitly says variety should come from **source × faction × occasion**, not from hundreds of scripted lines.

### SOURCE_FACT · three-beat synthesis

The existing source describes a three-speaker pattern:
- speaker A: proposition;
- speaker B: counter;
- speaker C: synthesis/action.

The causal closure should happen in the listener rather than being explained with a literal “therefore”.

This is directly useful as a test fixture, but it is not permission to turn a single Web Pet into a constant joke machine.

### SOURCE_FACT · bubble donor

The located v13 bubble donor includes:
- measured text layout;
- five named registers in the code path (`speech`, `thought`, `shout`, `whisper`, `kayfabulate`);
- text-derived sizing;
- one interactive bubble path;
- a donor world cap of two bubbles;
- measured reveal/hold timing data.

These are donor facts, not automatic mobile defaults.

### SOURCE_FACT · Triplet terminology

Current reuse notes distinguish:
- semantic roles: `Subject / Connector / Reframe`;
- performance arc: `SHOW IT → SPIN IT → SELL IT`;
- KFB labels/IDs: `bingo / bongo / boggle`.

Known canonical v13 spellings:
**KayfaBINGO · KayfaBONGO · KayfaBOGGLE**.

The original uploaded `KFB_TOURBUS_MEDIA_TRIPLETS_FRANKENSTEINING_v2` is provenance-indexed but not available as a normal current repo file. Missing pool bytes must not be reconstructed from memory.

### DECISION · branch / owner / route

Owner remains:
**KFB ToolBox / Legacy Web Pet presentation adapter**.

This chat branch:
`chatgpt-web/mobile-preview-chatterbox-legacy-pet-2026-09-21`.

The branch is stacked on PR #157 instead of modifying the frozen source branch directly.

Primary product Stage route remains:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/legacy-web-pet/`.

Possible nested preview harness:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/legacy-web-pet/mobile-preview/`.

Neither is claimed PUBLIC_VERIFIED here.

### DECISION · mobile viewport

Primary acceptance viewport:
**390 × 844**.

Secondary fixtures:
- 430 × 932 portrait;
- 844 × 390 landscape.

Mobile is a first-class view, not desktop shrunk after the fact.

### PROPOSAL · interaction translation

Desktop:
- left click = action;
- right click = settings;
- camp click = home.

Mobile proposal:
- tap pet = same existing action;
- long-press pet/camp = same settings action;
- tap camp = same home action.

No visible generic settings chrome should be added to the final overlay merely because right-click is unavailable.

### PROPOSAL · first ChatterBox behavior

For the first integrated mobile experiment:
- no LLM;
- no TTS requirement;
- one bubble at a time;
- deterministic source selection for review;
- no permanent ambient chatter;
- text comes from the located static phrase donor;
- actor identity and ChatterBox content remain separate until a real voice/profile source is pinned.

Candidate first event:
**tap pet → real Legacy action → short existing ChatterBox line or thought**.

This is intentionally smaller than a full three-speaker Triplet.

### PROPOSAL · Triplet lab

A later Stage-only lab may show:
1. source/proposition;
2. counter;
3. existing `SYNTHESE` line.

It should preserve player closure and remain presentation-only.

The strongest version is likely a **three-actor rig preview** later, where each beat has a visible performer, rather than forcing all three beats through one pet. That requires a separate bounded actor-instance experiment and is not current implementation status.

### DECISION · donor-first gate

Before integrating ChatterBox bubbles with the pet, the exact selected v13 bubble donor must be rendered **in isolation at 390×844** and visually evidenced.

Only after that proof may an adapter place the same design over the Legacy Web Pet.

### PROPOSAL · useful preview-harness controls

Debug-only Stage controls may expose:
- viewport preset;
- deterministic seed;
- chosen phrase pool;
- chosen bubble register;
- pet/camp/bubble hitboxes;
- current Legacy animation;
- last ChatterBox source;
- safe-area / visualViewport bounds.

These controls are laboratory instrumentation, not product UI.

### UNRESOLVED

- extension content-script/frame boot boundary is still unknown;
- current Cloudflare Stage for Legacy Web Pet is not PUBLIC_VERIFIED;
- current PR #157 preview build has a Cloudflare build failure at its latest head;
- no mobile browser evidence exists yet;
- no ChatterBox donor isolation screenshot exists yet;
- no exact original Triplet upload bytes are present as a normal repo source.

### NEXT GATE

**MOB-0 · source-isolated ChatterBox mobile donor proof.**

Do only:
- exact chosen v13 bubble donor;
- 390×844;
- deterministic fixture strings from the existing static phrase donor;
- screenshot + source revision;
- no Legacy Web Pet runtime modification yet.
