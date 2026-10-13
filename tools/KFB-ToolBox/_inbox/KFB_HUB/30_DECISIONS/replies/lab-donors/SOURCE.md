# Lab-Spender für WS1 (14.10.2026)

Kopien aus dem Lab `~/Dropbox/CLAUDE/KFB Island Worldbuilder Lab` (kein Git-Repo; Hash = `git hash-object`). Nur lesen, als Vorlage für S5a (Sprechblasen-Ebene herauslösen, V-212).

| Datei | Lab-Pfad | Blob | Inhalt |
|---|---|---|---|
| `islands-npc.ts` | `src/world/organ/islands-npc.ts` | 13ad2738 | NPCs je Insel, Auslöser beim Aussteigen, `say()` / `layoutTri()` / `draw()` (Zeilen 71–107) = Plain-Blase mit Flip-Reveal (V-204), Triplet-Auswahl über `prepareResidentTurn` |
| `contact-blob.ts` | `src/play/contact-blob.ts` | 0182ccbd | Kontaktschatten (V-203), fast schon Modulvertrag |
| `CHATTER_VENDOR_SOURCE.md` | `src/chatter/vendor/SOURCE.md` | – | Herkunft der vendorten ChatterBox-Dateien |

**Imports von `islands-npc.ts`:**
- im Repo vorhanden: `chatterbox-core.js` = `tools/KFB-ToolBox/_inbox/KFB_CHATTERBOX_STUDIO_CLAUDE_DESIGN_SESSION_CUT_2026-10-05_r2/lib/chatterbox/chatterbox-core.js` @30558ae3; `resident-chatter-adapter.v0.1.mjs` und `resident-chat-ensemble-data.mjs` aus demselben Cut bzw. PR #305/#310;
- Lab-intern, nicht nötig für die Blase: `figure-b2`, `islands-v202`, `contact-blob`.

Bewertung (MODULE_INVENTORY_R1 §7b): HÜLLE, ½–1 Tag, `createBubbleLayer({host})` mit `show(anchorScreenXY, parts[], kind)` und `update(dt)` für den Host-Slot `#ui-bubbles`.
