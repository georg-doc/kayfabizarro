# KFB Webchat authoring R1

Owner: existing KFB Triplets plugin for authoring; Asset Library / Dramatis Personae for reading; ToolBox-Studio for visual tuning. GitHub is the only source store. No new Site, plugin identity or runtime.

Georg 18.10.2026 authorizes character, scenelet and diorama authoring through normal web chat, versioned GitHub change proposals, existing Site update and WS0 handoff.
This newest instruction supersedes BRIEF_WSA_CHARACTER_EDITS_R2 V-416 direct-register writes for this workflow.

Existing canonical character files stay FIGURES_R1/characters/<id>.character.json and appearance stays figures/<id>.figure.json. Editorial concepts use WEBCHAT_AUTHORING_R1/scenelets/ and dioramas/. They are descriptions and pinned references, not executable world scenes.
The plugin's references/github-proposals.md and references/scenes.md define proposal receipts and editorial fields. Code-free routine authoring means the chat uses connected GitHub tools; the plugin itself grants no credentials or permission. No hidden deploy per text edit.

Proposal branches: characters/edit-<id>-YYYY-MM-DD-<nonce> or scenes/edit-<id>-YYYY-MM-DD-<nonce>. No automatic merge. Existing cards/facts/conflicts survive; DESIGN is not GEORG. Missing models/cards remain todo and 3D stays locked.
Dramatis Personae can read a proposal branch via proposalRef query, visibly separated from register. It must never show cached register content as a successfully fetched proposal. On failure it retains the known prior view and explicitly marks the requested proposal unavailable.
Accepted register content appears through GitHub Refresh. A proposal is not accepted content; WS0 takes it over after review. Unsupported new runtime behavior and asset generation remain production, not routine content updates.

No Site-side connector declaration is needed for this read-only proposal view. The unrelated Site save connector block remains open.
