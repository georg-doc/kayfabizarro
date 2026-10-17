# Brief WSA work · Dramatis Personae R1 (V-399) · 17.10.2026

**Tier 0:** figures only from their figure card (KFB eye rig + clay) · light only from the stage light module · a known failure means stop and report to WS0. **Your block:** [Figure] + [Georg-facing] from `replies/KNOWN_FAILURES.md`.

## Goal
One place for all characters: 3D model in the preview next to the character sheet, live search, editable by Georg, persisted on GitHub. **No new tool:** this becomes a **tab "Dramatis Personae" in the Asset Library** (TOOL_MAP place 5). Appearance tuning (eyes, brows, mouth) stays in the **Figure workshop**. Both read and write the same character files.

## Sources (truth)
- `replies/FIGURES_R1/characters/<id>.character.json` (kfb.character/1, V-394/V-398)
- `replies/FIGURES_R1/figures/<id>.figure.json` (kfb.figure/1, V-391/V-395)
- Schemas: `CHARACTER_SCHEMA_R1.md`, `FIGURE_SCHEMA_R1.md`. Sources: `CHARACTER_SOURCES.md`.

Every value has `{v, src, status}`. The page always shows the status (GEORG / SOURCE / DESIGN / PREFILL / todo) and any `conflicts[]` visibly.

## Stages
1. **R1 read-only (first):**
   - Gallery of all characters with live search (name, alias, archetype, deck, story mode).
   - Per character: 3D preview from the figure card (with eye rig + clay, otherwise a red notice "card incomplete"), plus the sheet in tabs: Story · Personality · Dialogue (signature triplets, voice sample from `voice_casting.r1.json`) · Cards · Memory/relationships (schema) · Performance (clips, light per story mode) · Sources and conflicts.
2. **R2 editing (Georg):**
   - Form fields for name, aliases, colours, render style/texture (alternatives listed explicitly), assigned decks, traits, background story, and relationship templates to the player.
   - Saving creates a **change proposal** (commit on a branch `characters/edit-<id>-<date>`, no merge); status changes to GEORG for the edited values.
   - Appearance fields jump via deep link (same id) into the Figure workshop and save back from there into `figure.json`.
3. **R3 authoring via web chat:**
   - "Ask the web chat" button per character, which hands over the sheet as context.
   - The answer comes back as a change proposal in the same format.
   - Note for the plugin workflow (V-376): character sheets are an input for triplets and dialogue.

## Rules
- Nothing is overwritten without status `GEORG`. Conflicts stay visible until Georg decides.
- Clean image (V-383); characters only from their cards, never raw GLBs (V-391).
- Persistence only through GitHub (branch + commit). WS0 reviews and takes it over.

## Return
Tab link (staging), screenshots of the gallery and one sheet (FrizzleBob, Lord Hunky), and the list of characters with an incomplete card.
