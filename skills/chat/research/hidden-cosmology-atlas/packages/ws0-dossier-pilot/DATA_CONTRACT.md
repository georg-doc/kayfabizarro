# WS0 additive dossier contract — pilot v1

Exactly one JSON per theme, under the existing Atlas owner. The canonical card registry and decks-ssot remain unchanged. The Atlas is an editorial source owner, not a second card runtime. Projection adapters may read these records after acceptance.

Required fields: id, deckId, cardRefs[{cid,cardNumber,registryPath,sourceRevision,joinStatus}], derivedFrom, layers{card,sources,interpretation,brainfood,solutionWatch}, claims[{id,statement,status,sourceIds,reviewScope}], formats, checkedAt, reviewer. Every sourceId resolves in sources.json. Source receipts carry URL, exact locator, readScope, kind, independenceGroup and review date. Prior NB01/NB02 references remain external provenance, never independent corroboration by repetition.

The five WS0 layers coexist with V-363 stages L0 sources → L1 essay → L2 existing deck → L3 existing cards → L4 song/performance. No canonical registry schema is extended before review. Future adapters consume stable IDs and pinned revisions, append new evidence, preserve earlier revisions, and distinguish source claim from editorial voice.

Dialogue contract (not implemented): request card/topic ID + permitted source scope + desired depth; return answer segments with claim/source IDs and passage locators, or an explicit unknown. Retrieval/access control and any model key live on a server. Static Site capability does not itself supply an LLM, private-source retrieval or a game integration. No keys embedded in game/browser assets. No hosted dialogue endpoint, BYOK or live NPC is claimed here.

Conceptual relations: surveillance→basilisk (different kinds of coercion); basilisk→sealed room (imagined inevitability); sealed room→surveillance (recovering bounded agency). These are editorial teaching comparisons, not historical influence or coordination edges.

## Card motif handoff for WS0

For each card, carry the source visual description beside lore and power, with exact donor field, revision and inspection status. Resolve deck ID and card number and check name before reuse. [Verified example and voice review](WS0-01-VOICE-REVIEW.md).

## V-1258 · Accepted editorial contract

Join card to deck ID, card number and source revision. Retain the source visual field name and its verbatim text beside the printed PDF locator and the actual inspection scope. Base each tip on an identifiable detail and label whether the detail comes from the print or the design description. The game line is English. A German read-aloud version is a separate editorial field. Each Solution Watch takes 5–10 minutes, yields a result the reader can check and closes with the boundary of that result.
