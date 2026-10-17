# WSA (web chat) · Edit character sheets directly (interim R2, V-416) · 17.10.2026
Georg can extend characters in the web chat right away, so the updates show up immediately in the Dramatis Personae tab.

**How:**
1. Georg tells the web chat what changes for which character (name, story, traits, decks, relationships, colours …).
2. WSA writes it **directly** into `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/FIGURES_R1/characters/<id>.character.json` on the register branch `docs/kfb-decisions-register-2026-10-11`, one commit per change.
3. Each changed value gets `"status":"GEORG"`, `"src":"Georg via Web-Chat <date>"`. Old values are not overwritten silently. A displaced earlier value goes into `conflicts[]` with its source.
4. Appearance (eyes, brows, mouth, body) stays in the figure card (`figures/<id>.figure.json`) and in ToolBox-Studio. In the character sheet, change only `appearance` references, colour or texture notes.
5. Dramatis Personae reads from GitHub, so after a reload the change is visible.
6. WS0 reviews afterwards and reports back if anything clashes. No PR is needed; it lives on the register branch.

**Never:** invent values Georg did not say (mark them as PREFILL/DESIGN and confirm them in the chat), or create new character files without a figure card (exception: when Georg explicitly asks for one).
