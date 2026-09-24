# AI Town → KFB Residents · Donor Evaluation · 2026-09-24

Status: **CURRENT RESEARCH / DONOR DECISION · AI-TOWN IS NOT A KFB RUNTIME**

## Source inspected
- KFB fork: `georg-doc/ai-town@2693ed6973e3461204385c9d11fb3aca4e8e3a7a`
- upstream: `a16z-infra/ai-town`
- upstream main observed 2026-09-24: `8e05997f2409275669c8344b84a51692e83f3f33`
- license: MIT
- observed upstream delta: six commits, mainly maintenance/conversation-layer work rather than a different simulation architecture.

Read: `ARCHITECTURE.md`, `convex/aiTown/agent.ts`, conversation membership/movement, agent memory/schema and constants.

## Decision
**Reuse AI Town's small semantic state-machine lessons; do not import Convex, Pixi, AI Town's world engine, global memory DB or autonomous-dialogue stack as another KFB owner.**

KFB already owns:
- movement/world legality → WorldBuilder/Travel host;
- actors/scenes/motion presentation → Resident Atlas / ToolBox;
- semantic encounters → NPC-LIFE-01;
- text → ChatterBox / Triplets;
- durable experienced facts → Player Journey;
- cards/rewards → their current owners;
- combat truth → Combat.

## Useful donor mechanisms

### One world-state writer
AI Town's engine is the exclusive mutator; agents return inputs. KFB equivalent:
`intent → host legality → semantic beat/input → existing owner executes`.

### Tiny agent loop
Useful shape:
`free → choose one intent → approach → participate briefly → leave → remember/resume`.
A seeded deterministic chooser is enough. A live LLM is not required.

### Explicit social state
AI Town separates invitation / walking over / participating. KFB keeps its own vocabulary but preserves the principle: social contact has a small explicit state instead of teleporting into dialogue.

### One high-level operation
One active Resident intent:
`activity | approach | encounter | performance | travel | combat-handoff`.
Animation, bubbles and audio may render concurrently; they do not compete for semantic intent.

### Memory ranking
AI Town's relevance + importance + recency ranking is a useful optional heuristic **over Journey facts a Resident could actually know**. It does not justify a second KFB vector-memory database or relationship-points system.

### Reflection → KFB meta-narration
AI Town reflection inspires an optional low-frequency **Observer / Almanac reflection**:
semantic event log → occasional Afterglow / Almanac / narrator recap.

This is a KFB extension, not an AI Town built-in narrator. It may not rewrite event truth or award POP/rewards.

## Do not port
Convex backend · Pixi UI · AI Town tick/persistence architecture · exact two-person restriction · mandatory autonomous LLM dialogue · relationship DB · required embeddings · AI Town character prompts · its map/pathfinding runtime.

## First KFB proof
Prepared `NPC-AITOWN-KISS-01`:
3 real Residents in one small house/street scene, one authored activity each, seeded intent chooser, host-owned movement, NPC-LIFE beats, ChatterBox text, Journey-filtered facts, one Card/gift/world event and optional Observer recap.

Acceptance = emergent combinations from a small vocabulary, not endless conversation.
