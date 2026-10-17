# GitHub proposals from normal web chat

Repo georg-doc/kayfabizarro. Register docs/kfb-decisions-register-2026-10-11. Root tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/.
Do not use a local shell or require Work for normal edits. Use available native GitHub tools with their actual schemas.

1. Fetch register ref and commit/tree, then every target at that exact commit. Record blob SHA (null only for a verified missing new file). Resolve current character IDs from real directory listings; no guessed body/model/clip references.
2. Present the intended change in chat. On user request to save a proposal, allocate one stable proposalId: snake_case subject plus date and a random 12–32 hex suffix; retain it for retries. Branch: characters/edit-<id>-YYYY-MM-DD-<suffix> or scenes/edit-<id>-YYYY-MM-DD-<suffix>.
3. Fetch that exact branch. Existing branch with the same receipt ID/base/changed documents is a retry: read and reconcile; do not start over. Existing unrelated branch: choose a new unique suffix before writing, never force it.
4. Create only a new branch from the exact register base with the native create-new-branch operation. Read it back before editing. Do not assume create-only collision semantics if the tool is ambiguous: it must reject an existing branch rather than update it. The published acceptance report records the actual collision probe. If the executing host offers only unverified upsert semantics, stop that write and preserve UNSAVED draft; do not request an agent token as a workaround.
5. Construct the full candidate documents from the read base, with only authorized edits. Character: preserve untouched fields, conflicts, provenance and figureRef; no figure tuning, memory instance data or blanket approval. A supplied value is GEORG; authored ideas stay DESIGN until expressly adopted. Existing changed leaves keep their prior value/source/status in conflicts. Scene documents follow scenes.md.
6. Add receipt at WEBCHAT_AUTHORING_R1/proposals/<proposalId>.proposal.json:
schema kfb.webchat-proposal/1, id, kind character|scenelet|diorama, subjectId, state PROPOSAL, intent (plain user request), baseCommit (40 hex), baseBlobs (target path -> 40 hex or verified null), targets (exact candidate paths), changes (path, pointer, before, after, reason), conflicts (unresolved array), createdAt (ISO timestamp), and provenance (source refs). Optional technical test records must explicitly say testOnly:true and never appear as Georg-authored fiction.
7. Create tree from base tree with only the declared target documents and receipt. Create commit with the verified branch head as parent. Before exposing the update, re-fetch register target blobs: if a target changed, rebuild from the latest base and preserve conflicting changes. Changes elsewhere do not require rewriting source history.
8. Update only the proposal branch via expected_sha lease, force false. Read exact branch and intended files; compare full contents, receipt ID, candidate schema, parents and changed-file roster. If returned ref or content differs, no success claim.
9. Timeout = UNKNOWN. Fetch exact deterministic branch, commit and receipt before retry. Never blindly repeat create/update or erase another user's edit. A partial write is not a completed save.
10. Return GitHub branch/diff and Site preview:
https://kfb-asset-librarian.frizzlebob.chatgpt.site/?view=dramatis-personae&proposalRef=<URL-encoded branch>&character=<id>
For scene-only proposal omit character, use the Scenelets and Dioramen sheet tab on related characters or its global list.
No PR/merge is needed for the ordinary save; WS0 reviews the branch. Create a PR only if Georg or the owner explicitly requests it. The regular register view remains unchanged until WS0 takes over.
