# KFB Game Loop R7 · Play the Heel · Open Roles, Wrestling Masks and Fluff/Goo Balance
2026-10-29 · Georg creative steering · concept-only continuation

**STATUS: GEORG CREATIVE DIRECTION / ARCHITECTURE-OPEN FUTURE OPTION; NOT CURRENT MVP, NOT A RUNTIME BUILD OR V-NUMBER.**
**Lineage:** R3 Cards/world knowledge first; R4 relationship and reputation; R5 ordered Signal Memory; R6 tactile six-colour Fluff, Black Fluffer and optional alchemy. R7 adds the *freedom to perform from any side* without replacing the main Card-first exploration game.
**Owner:** existing KFB_HUB / `30_DECISIONS/replies` concept intake on Draft PR #460. Recipients later are existing Character/Player Actor, Resident/ChatterBox/Lean Memory, World/Save/Fluff, Combat, Card/Almanac, Motion, EyeRig and UI owners. **No second runtime, player controller, state store or faction AI.**
**Boundary:** World R4 remains STOP / NO MVP; full corruption, selectable antagonists, masks, alternative resource systems all OUT OF SCOPE for present runtime.

## 1 · Creative premise

Kayfabe is performed: one player may act as a "Face", another as a "Heel", and a third may change role mid-story. There is no mandated hero, permanently evil species, universal rehabilitation arc or single authoritative ending. **Readers/players provide closure** after seeing what characters do, claim, conceal and remember.

Potential selectable performers over the long term include actual source-ready KFB characters such as Demon Lord or a specific Men in Black and appropriate rigged props such as Pencil. **All models being playable is a long-range option, not a current entitlement:** player movement/contact/motion/camera/scale must pass per-character or per-prop source/rig capability acceptance. A "Pencil" prop character may need a native locomotion adapter rather than being treated as a medium humanoid; never silently substitute generic mesh/rig or spawn a second Player. Current Curtain Character Select MVP only names a *small* initial roster (FrizzleBob, Mannequin, Black Knight, optional GothGirl/ActionFigure). Preserve it.

## 2 · Four separate axes, not an alignment bar

| Axis | Real question | Concrete example | State owner / guard |
|---|---|---|---|
| **Character / Actor identity** | Who is physically under player control? | Demon Lord, Pencil, Men in Black, FrizzleBob | Existing Player Actor profile sourceRef/rig capabilities. Never consume the corresponding Resident instance. |
| **Kayfabe role / mask** | What public persona is performed now? | Face, Heel, Trickster, Outsider; masks are provisional roles, not fixed moral classes | Later authored costume/performance selection through current actor/prop attachment and presentation owner; no parallel player rig. |
| **Current condition** | What temporary physical/world effect is active? | Black-Fluff infection, tainted body/eyes, cleaned or uncleaned surroundings | Existing World/Combat/Effect and Save owners; condition separate from willingness and role. |
| **Actions, social consequences and interpretations** | What did this performer actually do, and who remembers it? | Suppress one quote, rescue a Fluffer, gift a Card, help an NPC, stage a deception | Existing event/encounter receipts, NPC social memory, reputation/knowledge, Card provenance. No automatic virtue or truth score. |

**Consequences are not neutralized by costume:** changing from Heel to Face cannot erase a witnessed act, stored Card handoff, damaged prop or relationship. Nor should a mask automatically make everyone hostile or every "evil" action succeed.

**Actor versus Resident safeguard:** same named source character may appear as a playable avatar and as a world Resident; their scene instances and memories must remain distinct. A selected actor neither deletes nor merges their Resident identity.

## 3 · Player paths: optional and combinable

- **Choose a role deliberately:** enter as a source-ready antagonist and pursue Card collecting, misinformation, propaganda performance, Goo manipulation, Fluff harvesting, or occasional sabotage *as game fiction*. Collecting Cards and engaging with different world views still offers travel invitations.
- **Temporarily become infected:** existing V-679 says the *first* player-infection experience is **brief stumbling/control errors followed by recovery**. A genuine "play the opposing side until healed" is explicitly LATER, separately authorized, with player agency, bounded condition handling and safe escape/recovery. Do not silently recast V-679 as already built.
- **Change role with a wrestling mask (future):** mask is an optional performed persona akin to wrestling's Face/Heel, not the same as the six-sided Story-Mode die (tragic, comic, absurd, heroic, mystical, forbidden). Story Mode changes a scene's tone; mask changes a *performed relationship to others*; actual social effects come from actions and observed responses.
- **Decline faction identification:** a player may wear no mask, alternate in a story or act inconsistently. Neither faction nor player must have omniscient knowledge of a role change.

### Possible diegetic situations (not planned fixed quests)
1. **Men in Black player:** stamps a specific Billboard/quote as classified, draws a black bar; another Resident discovers a missing citation. The player may defend, undo, exploit or confess the redaction. Original Card text stays canonical.
2. **Demon Lord player:** hosts a loud performance, intimidates the band or helps repair the stage. One crowd might celebrate the theatrical Heel, another object to a real property loss.
3. **Pencil player:** draws a route or exposes a covered word; may also fake a diagram. The intended readable mechanics depend on the genuine rigged PropActor capabilities.
4. **Infected player:** briefly loses precision and spreads limited taint as a story beat; later optional consciously chosen alternate-play mode is a distinct proposal. It must never become a no-exit loss of control.

## 4 · Fluff/Goo equilibrium: open resource architecture without economic inflation

**CURRENT established rule (V-583):** there are **six** source-mode Fluff colours; `dark_fluffer` is a **tainted world/presentation state**, NOT the seventh Fluff colour. Healing with a source-approved existing action can remove a small Goo patch and release finite coloured Fluff. Keep that current rule in any near-term receiving work.

**NEW R7 LONG-TERM QUESTION:** If players can adopt an antagonist role, what value does coloured Fluff versus dark/tainted matter provide in opposing activities? Preserve that design space but **do not mint a Black Wallet/currency now**.

| Candidate relationship | Light/colour-side interaction | Dark/taint-side interaction | Smallest shared underlying truth |
|---|---|---|---|
| **World condition first (preferred KISS)** | Reveal, repair, grow, return colour, release hidden content | Cover, distort, constrict, harvest, recontextualize | Source object plus local condition and actor action receipt; reversible when a real counteraction exists |
| **Asymmetric physical tool** | Collect/push/shape coloured Fluff, six-of-six optional Card alchemy | Apply/remap Goo patch, block visibility or change NPC affordance | Shared world/Fluff physics + presentation, not six-colour combat classes |
| **Separate shadow resource (defer)** | Colour tokens for specific options | A later **different resource/accounting proposal** if real play proves meaningful choice | Needs explicit WS0 economy decision, guard against seventh colour, duplicate resource and farm loops |

**Equilibrium is a dynamic contest of local conditions, not a mandatory 50:50 morality meter.** One locality might remain dark due to residents' actions; another may cycle between use and repair; a third might not participate at all. Dark-side actions should have meaningful outcomes and social consequences, not a hidden "wrong choice" penalty. Colour-side options should not guarantee moral authority or epistemic truth. A false claim can be uttered in a bright room; a correct Card quotation can appear under a dark mask.

**Metanarrative causality:** Hunky/Academy and Utopia's Fluff-harvest → manufacturing → break/recover cycle exists as a source-backed story proposal. Its interpretation is character-dependent, and the player may participate in either direction without inventing a new world economy.

## 5 · Existing architecture reception, no new owner

- **Player avatar**: `CURTAIN_CHARACTER_SELECT_MVP_2026-10-04.md` already uses one `player.actorProfileId`, rig-family motion capabilities and distinct Resident identity. A mask should be a presentation/role state referencing real wearable or attached objects, not another Actor/Character identity.
- **Role-aware Residents**: `WS0_GLOBAL_INTENT_ROLE_CONSCIOUS_RESIDENTS_R1_2026-10-15.md` authoring already distinguishes theatrical role masks from biography, knowledge and off-duty behaviour. Do not convert its role literacy into universal mind reading or forced confession.
- **Narration**: current `RESIDENT_KNOWLEDGE_PROFILE` / ChatterBox source-lock and Lean Memory store canonical Card refs and relevant events, not ethical truth. NPCs may praise, oppose, ignore or change opinion with actual context.
- **Save**: existing PLAYER_SAVE / Lean Event Memory / NPC Social Memory would later persist chosen actor, opted-in performed mask/role, transient condition where relevant, attributed acts, who witnessed what, world patch status and unresolved social promises. The *current owner* defines migrations; no authoring/runtime schema here.
- **Dark Fluffer**: `BRIEF_WS1_DARK_FLUFFER_R1.md` remains authoritative for first playable single infected Cube/patch/finite healing, with V-679 short control-loss first. Full player-side switching is a separate future scope, not a backdoor addition to that MVP.
- **Single runtime**: current World/WS1 owns scene/physics/player/world state; Combat Arena supplies source-backed combat donors only where the receiving product allows them. Existing Motion/EyeRig and prop attachment own masks/gestures, Card/Almanac owns canonical IDs. No Live/Stage or auto-merge.

## 6 · Future paper proof, not now

Compare the **same source-proven location, two canonical Cards and one NPC** from two player perspectives:
- Case A: player as their ordinary avatar with no mask reveals a covered quote and gains NPC recognition.
- Case B: player with a Heel mask (or eventually a source-ready Men in Black actor) chooses to redact the same quote. The NPC responds according to their Card knowledge, witnesses and relationship; the canonical Card remains unchanged, and the player can later expose it.
- Case C (separate): transient infected condition changes movement/performance briefly, then restores the existing player control, without confusing this with an opted-in Heel persona.

Success would mean: authentic actor still works; change of role/condition does not change Card truth or reset NPC memory; actions have contrasting tangible consequences; no forced good ending or permanent soft-lock; save/import reconstructs only actually meaningful state. Source objects/prop/masks must first be visually isolated, rig-validated and adopted by their actual owners.

**NOT RUN:** runtime tests 0; browser tests 0; player playtests 0; source-isolated mask/actor visual proofs 0. No current R4/R5 World restart, no new UI artwork generated.

## 7 · Decision status and one next gate

**ACCEPTED AS GEORG CREATIVE DIRECTION for this concept archive:** retain *open playable sides* and reader/player interpretative closure; do not impose universal moral alignment or make antagonist roles inaccessible by design.

**PROPOSAL / DEFERRED:** full roster, Men in Black/prop Actor acceptance, Heel/Face masks and exact behaviour, voluntary long-form infection, shadow currency or precise equilibrium formula. Six Fluff colours and `tainted` world state remain current source direction; no replacement.

**ONE NEXT GATE:** **WS0 register intake of R7 architecture-open player-role principle**, with an explicit note that the current World/Black-Fluffer first slice is unchanged. Later select one source-ready player Actor + one situation before authorizing any runtime or art.

## Sources inspected
- `skills/chat/KFB_GAME_BIGGER_PICTURE_REFERENCE_2026-10-04.md`: player closure, PULL DON'T GATE.
- `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/CURTAIN_CHARACTER_SELECT_MVP_2026-10-04.md`: small roster and single Actor profile.
- `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/WS0_GLOBAL_INTENT_ROLE_CONSCIOUS_RESIDENTS_R1_2026-10-15.md`: theatrical role awareness, distinct NPC agency.
- `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/BRIEF_WS1_DARK_FLUFFER_R1.md`: no seventh colour; cure-first current source.
- `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/BACKLOG_BLACKFLUFF_INFECTION_R1.md`: V-679 current short control-loss, later sideswitch.
- `skills/chat/recovery/WS1_DARK_FLUFFER_CORRUPTION_HUNT_HEAL_FOLLOWON_R1_2026-10-21.md` on PR #400: source/owner constraints, not implemented proof.
- `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/SITE_GODMODE_LEAN_MEMORY_ARCHITECTURE_2026-10-04.md`: existing save and memory owners.
- This PR's R3–R6 documents and Return.
