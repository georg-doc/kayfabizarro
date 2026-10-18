# WS0 → WSA work · Footsteps PASS (V-448): Foley + Digital as the standard, handover to the game · 18.10.2026

**Georg (18.10., Audio Site 0.7.6):** "Foley & Digital are my preferences → PASS."

**Tier 0:**
1. **Standard surfaces = the supplied banks Foley (carpet, concrete, gravel, vinyl) and Digital (grass, gravel, snow, wood).** Synthetic Wood/Cozy/carpet-wood stay only as fallbacks. The contact timing of 0.7.5 stays unchanged.
2. Map each surface to KFB ground types (material codes of the terrain), e.g. clay/meadow → Digital grass, path → Foley gravel, stage/wood → Digital wood, stone/diorama → Foley concrete, interior → Foley carpet/vinyl, snow island → Digital snow. Write it as one table into `CONSUMER.md`; WS0 checks.
3. Fix the first load: load the banks lazily per surface (only the active surface plus its neighbours), no sequential 8-second cold start.

**Licence (important):**
- The 400 Sounds Pack (Chequered Ink) is **not CC0**. Built into the game is allowed; redistributing the unchanged files is not.
- So add no further raw WAVs to public branches. The files already on `main` stay where they are until Georg's repo decision (V-427/V-433), and WS0 notes them in the inventory.
- In the game, ship only through the consumer seam (processed, bundled), not as a downloadable sound folder.

**Next:**
- The consumer seam `dist/footsteps/consumer.mjs` goes to WS1 for C3b (found items demo, walking on terrain). WS1 integrates; Audio stays the owner.
- **ElevenLabs motor set (b69) is free:** produce it reduced (1 variant, 6-s loop). Georg starts it with his own credits; the key never goes into a repo, log or chat.

**Report:** RETURN with the surface table, load times (cold/warm) and the WS1 handover note.
