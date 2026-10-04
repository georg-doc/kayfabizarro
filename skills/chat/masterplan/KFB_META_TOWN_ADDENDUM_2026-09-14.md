# KFB Masterplan Addendum · Meta Index + Town

Status: CURRENT REFERENCE / MASTERPLAN ADDENDUM
Updated: 2026-09-14
Owner: Georg / KFB

## Why this addendum exists

WS0 supplied `skills/chat/meta/KFB_META_COMPENDIUM_v1.md`, a cross-module meta index intended to reduce concept drift. It is useful precisely because it says it is **not** a new canon or implementation SSOT.

The Town ideation thread now has a durable home at:

- `skills/chat/town/START_HERE.md`
- `skills/chat/town/LIVING_KFB_TOWN.md`

This addendum links those references into the production router without copying their content into the main Living Masterplan.

## Classification

### KFB Meta Compendium v1

`CURRENT_REFERENCE / INDEX ONLY`

Use it when a task spans several KFB modules, asks for meta-narrative continuity, or risks rebuilding an existing concept under a new name.

Do not use it as authority for:

- current code versions;
- current branch/PR state;
- current asset counts;
- whether a tool is actually runnable;
- project-specific ownership where the implementation SSOT says otherwise.

Those details are snapshots from the WS0 survey and may age quickly.

### KFB Town

`CURRENT_REFERENCE / LIVING CONCEPT`

The Town living document owns Town-specific J-decisions. Current North Star:

> A town on the craft table, built from game pieces, where every house is an attraction and none is merely a menu.

Town is a meta-narrative/social hub concept, not yet an implementation project. It may route into Travel, Combat Arena, Museum, Iceberg, ToolBox and other instances, but it does not silently absorb their runtime ownership.

## Useful cross-module directions retained from the WS0 input

### 1. One home per idea

The Meta Compendium reports repeated copies of Layer Zero, global-intent and Almanac material. Treat this as a real drift warning.

Direction:

- one canonical home for each canon/reference document;
- other locations become pointers or archived snapshots;
- do not launch a broad cleanup before the true canonical copy is verified;
- never delete historical copies merely to make the tree look tidy.

### 2. Reuse before rebuild applies to concepts as well as code

The Donor Registry protects implementation reuse. The Meta Compendium should perform the same routing function for world grammar, character roles and narrative mechanics.

Before creating a new dialogue, hub, presenter, card-navigation or world-memory system, check whether the idea already has a named home.

### 3. Deckverse loop is a product grammar, not a mandatory runtime pipeline

The WS0 input summarizes the loop as:

`Explore → Fight/Play/Race → Collect → Remember → Recombine → Perform → Progress → Travel`

Keep this as a useful high-level composition model. A vertical slice does not have to implement every stage.

Likewise the `Show it → Spin it → Sell it` beat grammar may inform cards/events without becoming a hard engine API unless a consumer explicitly adopts it.

### 4. Town is the current hub concept

The Town living document records the shift away from a carnival as total framing. Carnival/carny remains a register and historical source of Kayfabe, but not the whole world skin.

Town-specific accepted ideas live in the J-log, including:

- cutting mat / play-table ground;
- King Kayfabian in the tower;
- buildings made from play pieces;
- embodied tools;
- honest construction sites;
- short encounter beats;
- collectible retorts;
- text and animation selecting independently from shared encounter beats.

Do not duplicate these decisions into other masterplans. Link back to the Town living document.

### 5. ChatterBox/Journey/Overworld remain the first donor path for NPC interaction

The Town concept should not start a fresh global dialogue architecture.

The existing semantic-triplet / reader-closure grammar and Journey event context are the first reference points for:

- short NPC lines;
- memory of prior encounters/cards;
- player-selected retorts;
- speech-bubble presentation;
- event/beat separation from animation selection.

Any new Town encounter system must first state what existing donor it reuses and what seam is genuinely new.

### 6. ToolBox/Actor Platform is the actor-production path

Town NPCs may use KayKit/FrankenStein actors, but Town does not become a rigging authoring system. Actor identity, grafts, face/talk and reusable animation/fit data remain ToolBox concerns.

This distinction matters especially for recurring NPCs that may later appear in Combat, Travel, Podcast or Museum contexts.

## Corrections / caution against over-reading the compendium

The Meta Compendium intentionally contains snapshot labels such as historical Travel/Combat versions, Pet Studio ranges, ToolBox blocker state and Asset Librarian counts. These are context, not current truth.

Before using any such statement operationally:

1. open the relevant router node;
2. read the current implementation/tool SSOT;
3. verify current GitHub state;
4. classify the old statement as still valid, superseded or unresolved.

## Recommended next meta-maintenance

Do not create another central canon folder.

Instead, gradually turn duplicated canon copies into references only when a concrete session already touches that material. Record each consolidation additively in the router changelog.

First likely candidates when they next become active:

- Layer Zero;
- global intent/open brief;
- Infinite Comic master;
- FrizzleBob Almanac/backstory pointers.

No bulk migration is required for the Town ideation session.
