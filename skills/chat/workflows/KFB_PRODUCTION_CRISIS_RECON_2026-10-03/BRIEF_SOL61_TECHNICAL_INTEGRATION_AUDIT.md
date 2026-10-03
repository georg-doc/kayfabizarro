# Brief · KFB technical integration and playability audit

Executor: **Codex/Work · GPT-6.1 Sol · High reasoning**  
Mode: **read-only**  
Owner: Georg / KFB  
Return language: German, plain language first

## Start message

> Review the current KFB GitHub state as a read-only technical integration audit. Start at `skills/chat/workflows/KFB_PRODUCTION_CRISIS_RECON_2026-10-03/START_HERE.md` on the supplied branch, read `SOURCE_SCOPE.md` and use `COMMON_RETURN_SCHEMA.md`. Do not merge, edit runtime code, deploy, close branches or invent a new owner. Establish what is actually playable, identify the real owners and dependencies, and propose the smallest safe route to four playable vertical slices: Ground/Drive Travel, Combat, procedural Environment and Town/NPC interaction.

## Product question

Why has KFB repeatedly produced technically green candidates without a coherent playable game loop, and what is the smallest safe integration path that ends this?

## Audit the actual product, not document volume

Determine:

1. What can Georg genuinely play today without debug panels, manual clip buttons or hidden setup?
2. Which current runtime owns world generation, ground movement, driving, flight, combat, residents, dialogue/memory, audio, VFX and rendering?
3. Which donors or candidates are accepted but not consumed by those owners?
4. Where do two systems currently write the same state or duplicate the same responsibility?
5. Which current tests verify behaviour that matters to a player, and which only verify files, syntax or isolated harnesses?
6. Which performance findings are measured in representative play and which are estimates or isolated benches?
7. Which dependencies must be fixed before integration, and which can be quarantined without blocking play?

## Required product targets

Design the minimum implementation packet for each target. Do not implement it during this audit.

### A · Ground and Drive

One uncluttered playable island. The same visible player character:

- moves with KayKit-native locomotion first;
- changes naturally between idle, walk, run, sprint and jump where native clips exist;
- uses measured timing and stride rather than speed guessing;
- approaches the KayKit Cabrio, enters, drives and exits;
- returns to the same ground controller after exiting.

Debug selectors and manual animation buttons are not the player interface and do not satisfy this target.

### B · Combat

The same player on a simple arena area:

- fights three to five KayKit enemies;
- uses the existing ranged/combat owner rather than a second combat system;
- exercises animation, clay/cartoon VFX, impacts and procedural sound under load;
- returns to normal movement after combat.

### C · Environment

One connected procedural island with:

- a coherent upper surface and rock underside;
- one useful road/track segment integrated into the terrain;
- space for driving, walking, residents and combat;
- current clay/style and palette rules;
- representative props/buildings without duplicating the world owner;
- a measured performance envelope under actual movement and combat.

The logical hex grid may remain planning data, but visible hex columns are not required.

### D · Living Town

Four residents in the same world:

- daily activity hooks;
- Triplet-based dialogue in English;
- gift, shared dance, object throw/Brick Fish and later melee hooks;
- ChatterBox/Lean Memory-compatible state;
- a first card-delivery interaction connected to KFB cards and Kayfabulation rules.

Do not reduce this target to a generic chatbot or a dialogue panel.

## Required return

Follow `COMMON_RETURN_SCHEMA.md` and add:

- a one-page playable-truth table;
- a system owner map with exactly one owner per mutable concern;
- a dependency diagram for the four targets;
- the ten highest-impact blockers in priority order;
- one bounded build brief for each target;
- a proposed integration branch sequence that starts from current `main` and extracts only accepted work;
- regression gates that test player-visible behaviour, not just files and counters;
- an explicit list of work that should stop, be archived or remain research-only.

## Cost and escalation rule

Use High reasoning for the first audit. Do not escalate to Astra merely because the repository is large. Recommend Astra only if a high-impact architectural disagreement remains after the independent Claude audit and cannot be resolved from evidence.

## Done when

Georg can read the first page and understand:

- what game exists now;
- why integration has failed;
- which four playable results come next;
- who builds each one;
- what he must decide before work restarts.

