# UI_NOTES · for the WSA port (Georg 14.10., not built)

The port is 1:1. These points are the next design job **after** the port and must not be mixed into it.

1. **Tabs and workflow steps are tangled.** Studio and Rigging both carry rigging options (face/body). Record which tools, views and workflow steps exist, and which elements belong in which view. Then cut one clean flow: Actor → Body → Face parts → Motion → Export.
2. **Each element is its own body** with its own inspector (colour, form, position, material), as in the earlier FrankenStein Studio: head, eyes, lids, brows, nose, mouth, moustache, ears, hair. Click a part on the stage and exactly that part opens.
3. **Colours are hard to find.** Skin and hair are in Studio › Body › Colour zones. Lid, brows and nose are each in their own Rigging part (model brows/nose since 14.10.). Add one colour overview per figure in a single place, on top of the per-part controls.
4. **The bottom bar is too thick** (Emotes · Viseme · Anim). Make it slimmer or collapsible.
5. **ToolBox = exactly one tool router** (skills/chat/KFB_SURFACE_HIERARCHY_CURRENT_2026-10-06.md). The WSA site must not become a second hub.
6. **Saving:** GitHub instead of localStorage (V-241). Store the kfb.pets/1 export as a file per actor; A2 and A13b need resolving first.
