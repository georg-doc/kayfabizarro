# Postmortem · Bad Briefing Drift · ToolBox UI · 2026-09-15

**Status:** ARCHIVED INCIDENT + CURRENT LESSONS LEARNED  
**Scope:** project-wide briefing discipline, triggered by the KFB ToolBox UI/UX rework incident  
**Audience:** ChatGPT Lead, future chats, Astra/WSA handoff authors, Claude/Desktop Design brief authors

## 1 · Incident in one sentence

A Lead briefing compressed the ToolBox problem too early around the **Pilot/Carl workflow** and the abstract rail `Select → Shape & Look → Attach & Fit → Motion & Talk → Export`, instead of first anchoring the redesign in the **full KFB FrankenStein Studio v17 feature model, roster and visual language**. That made a DocCheck-red / dark / Carl-centred / four-character redesign a rational downstream interpretation and burned implementation/design tokens before the error was caught.

## 2 · Impact

### Observed

- Desktop Design started treating the **Pilot/Carl surface as the UI/UX model**.
- A **DocCheck-red header/chrome** was carried forward even though the active Studio has its own KFB paper/light language.
- A **dark default** was proposed, contrary to the intended Paper / Light default.
- The five-step workflow abstraction started replacing rather than orienting the actual Studio information architecture.
- **Talk / Voice / Speech Bubbles** were initially absent from the rework direction.
- The character roster was collapsed to **four custom/special figures**, while the real character layer includes the full Cube-Pet roster and current Studio/custom figures.
- The design had to stop, re-inventory Studio v17 and ask a second round of structural questions.
- Tokens/session budget were spent undoing a direction that should have been prevented at briefing time.

### Not caused by Desktop Design

The downstream model followed the supplied frame. The primary failure was **upstream briefing quality**: the briefing gave an insufficiently constrained source hierarchy and promoted a prototype/test workflow beyond its legitimate role.

## 3 · What was wrong in the briefing

### Failure A · Wrong primary design source

The briefing said, in effect, “take the working ToolBox Pilot v1 as the starting point”. That was too strong.

Correct hierarchy:

1. **KFB FrankenStein Studio v17** = primary functional workflow + current Studio visual-language source.
2. Existing contracts / session / reader owners = implementation truth.
3. Pilot v1 = UX experiment and evidence source.
4. Carl Rigging Lab = specialist workbench / regression fixture.
5. CapsuleCarl = one test actor, never the product information architecture.

**Lesson:** A prototype can prove interaction findings without becoming the design model.

### Failure B · Test fixture promoted to UX model

Carl was useful because it exposed 21 zones, brow/nose/mouth controls and reader behaviour. That does **not** make “configure Carl” the representative ToolBox journey.

The real Studio must support heterogeneous residents and flows: Graft/FrizzleBob, Cube-Pets, Carl, Rolli, Recherchi, Motion, Voice, Talk/Bubbles, measurement, export/import and future consumers.

**Lesson:** Distinguish `QA fixture` from `primary user model` explicitly in every UI brief.

### Failure C · Workflow abstraction promoted into information architecture

`Select → Shape & Look → Attach & Fit → Motion & Talk → Export` was useful as a **wayfinding abstraction**. The briefing did not state strongly enough that it must not replace the Studio's real tabs and 39 inventoried sections.

Current correction:

- Primary Studio nav remains `Body · Face · Motion · Voice · Messen`.
- Workflow rail may exist only as secondary wayfinding/status.
- Progressive disclosure may regroup controls, but **39/39 Studio sections require an explicit old→new mapping**.

**Lesson:** Never allow a conceptual journey map to silently become the feature inventory.

### Failure D · Visual language inferred from the wrong artifact

The Pilot used DocCheck-derived chrome and red. The active Studio explicitly has a separate **paper/light KFB visual language**. The briefing failed to make the visual source hierarchy explicit.

Current correction:

- **Paper / Light = default.**
- no DocCheck-red header/chrome;
- no Dark default;
- KFB Studio visual language is the starting point;
- alternate themes/palettes are optional, not the product identity.

**Lesson:** Every UI brief needs a named **visual source of truth**, not merely a functional source.

### Failure E · Omission became accidental de-scope

Talk, Voice and Speech Bubbles were present in the source ecosystem, but not elevated as hard first-class requirements in the first rework brief. The downstream redesign therefore omitted them.

**Lesson:** “Preserve existing functionality” is too weak. For complex tools, require a **coverage matrix** before redesign implementation.

### Failure F · Responsive intent was not specified as a primary workflow strongly enough

The actual need is frequent split-screen authoring. Responsive behaviour is therefore a design input, not merely a final viewport smoke test.

Current correction:

- split-screen around ~832 px is a **primary design target**;
- stage must remain usable;
- palettes/panels toggle, stack or drawer rather than compressing into unusable columns;
- progressive disclosure must support this workflow.

**Lesson:** A known dominant viewport/work context belongs in the design contract, not only QA.

### Failure G · Roster scope silently collapsed

The briefing did not state the roster contract strongly enough. Downstream design surfaced only four custom/special residents.

Known source facts include a **24-character Cube-Pet layer** plus current Studio/custom figures and Graft/specialist residents.

Current correction:

- roster is driven by actual Studio/session/contract state;
- tuned/custom/recent figures may be first;
- all current characters remain discoverable/selectable;
- search/filter must include collapsed items;
- a hardcoded four-character subset is FAIL.

**Lesson:** Whenever a source contains a collection, state both the **full collection contract** and any allowed prioritisation. “Show favourites first” must never be interpreted as “only favourites exist”.

## 4 · Root cause

The Lead optimized for producing a useful handoff quickly and **abstracted before completing source inventory**.

Specifically:

- the Pilot report was fresh and easy to summarize;
- Studio v17 had not been re-read deeply enough before writing the UI brief;
- tested technical facts about Carl/Pilot were mistaken for sufficient product-design context;
- “reuse before rebuild” was over-applied to the visible prototype rather than to the underlying contracts and proven interaction findings;
- negative constraints were incomplete (`do not use DocCheck visual language`, `Carl is not UX model`, `do not replace Studio tabs`, `do not omit any Studio section`, `do not collapse the roster`).

This was a **Lead briefing failure**, not a downstream implementation failure.

## 5 · Why the first briefing looked plausible

Bad briefings are dangerous when they are not obviously bad.

The first brief contained many individually correct facts:

- Pilot v1 existed and worked;
- Carl/Graft mounted;
- workflow ordering was useful;
- material-zone UX needed repair;
- responsive QA was needed;
- Birthday casting was a good consumer case.

The failure came from **hierarchy and omission**, not fabrication.

A briefing can therefore be factually accurate line by line and still be product-wrong.

## 6 · Briefing anti-patterns

### Anti-pattern 1 · “Latest thing = source of truth”

A recently tested prototype is not automatically the design SSOT.

### Anti-pattern 2 · “One successful test case = primary user model”

A fixture can prove mechanics without representing the product population.

### Anti-pattern 3 · “Journey map = navigation”

A useful conceptual flow may sit above real feature navigation; it does not automatically replace it.

### Anti-pattern 4 · “Preserve everything” without inventory

LLMs cannot preserve what the briefing never enumerates or requires them to inventory.

### Anti-pattern 5 · “Responsive later”

If split-screen/mobile is a dominant use context, postponing it changes the architecture of the UI.

### Anti-pattern 6 · Positive instructions without negative clamps

“Use the Pilot” needed the counterweight “do not inherit DocCheck chrome, Carl-centric IA or reduced roster”.

### Anti-pattern 7 · Feature examples mistaken for exhaustive scope

Naming Carl, Graft and Birthday casting as examples without stating full roster/section coverage invited narrowing.

### Anti-pattern 8 · Starting implementation before a coverage artifact exists

For redesigns, a short mapping document is cheaper than repairing a wrong shell.

## 7 · Mandatory preflight before future redesign briefings

Before sending a redesign/rework task, the Lead must answer these eight questions from current GitHub evidence:

1. **Implementation source:** What file/repo is the real current product/work file?
2. **Functional source:** Which artifact defines the complete capability set?
3. **Visual source:** Which artifact defines the desired visual language?
4. **Prototype status:** Which artifacts are experiments/evidence only?
5. **Fixture status:** Which actors/scenes are QA fixtures rather than UX models?
6. **Inventory:** What complete tabs/sections/collections must survive?
7. **Primary contexts:** What real viewport/workflow contexts must shape the design?
8. **Owner boundaries:** What must the redesign not re-own or silently replace?

If any answer is missing, **do not yet issue an implementation brief**. Issue an inventory/critique task first.

## 8 · Mandatory coverage gates for UI rework

For a substantial existing UI, require before implementation:

### Feature coverage

`old feature/section → new location → preserved | regrouped | progressive | deferred`

Every source item accounted for.

### Population coverage

`source collection → total current population → visible priority subset → path to all`

No collection silently collapsed.

### Visual inheritance

`keep / reject / optional`

Explicitly state theme, chrome, typography, spacing language and what historical visual systems are **not** to inherit.

### Workflow contexts

List actual target contexts before layout implementation: full desktop, split-screen, tablet/mobile if relevant.

## 9 · Stop-gates that save tokens

Stop downstream work immediately when any of these appear:

- a prototype-specific visual language becomes global without explicit decision;
- a QA fixture becomes the main navigation model;
- feature count/roster count suddenly drops;
- a current first-class capability disappears from screenshots;
- a primary use context is deferred as “responsive later”;
- the new UI invents a second data/session/reader owner;
- a downstream agent asks questions that reveal the source hierarchy was never established.

A five-minute stop is cheaper than another design pass.

## 10 · Better briefing structure

For future KFB handoffs use this order:

1. **Outcome** — one sentence.
2. **Source hierarchy** — implementation, functional, visual, prototype, fixture.
3. **Preserve inventory** — complete feature/population contract.
4. **User decisions** — explicit current product intent.
5. **Allowed changes**.
6. **Forbidden inheritance / negative clamps**.
7. **Primary workflows/viewports**.
8. **Acceptance evidence**.
9. **Return contract**.
10. **Only then** implementation prompt.

Do not lead with the newest prototype unless it is actually the approved product model.

## 11 · Token-economy lesson

The goal is not the shortest briefing. The goal is the **smallest briefing that prevents an expensive wrong branch**.

A few hundred tokens spent on:

- source hierarchy;
- full inventory;
- negative clamps;
- coverage matrix;

are cheaper than thousands of tokens spent generating, critiquing and undoing a polished but misframed implementation.

For design work, **coverage before craft**.

## 12 · Current ToolBox correction

Current execution correction:

`tools/KFB-ToolBox/_handover/UI_CRITIQUE_REWORK_WS0_2026-09-15/RUN_NEXT_CORRECTED_2026-09-15.md`

It establishes:

- Studio v17 as UI/UX model;
- Paper/Light default;
- Studio tabs primary;
- workflow band secondary;
- 39/39 section coverage;
- full roster coverage including all 24 Cube-Pets;
- Talk/Voice/Bubbles first-class;
- split-screen as primary workflow;
- Carl as regression fixture only.

## 13 · Accountability / status

- **FAIL / ARCHIVED HISTORY:** first ToolBox UI rework briefing was insufficiently constrained and caused design drift/token waste.
- **DECISION:** source hierarchy + inventory + negative clamps are mandatory for future redesign briefs.
- **DECISION:** prototypes and QA fixtures must be labelled as such before downstream work.
- **IMPLEMENTATION:** corrected ToolBox execution entry created separately.
- **TESTED RESULT:** none for the corrected redesign yet.
- **LESSON FOR FUTURE CHATS:** GitHub recovery should include this incident when authoring substantial redesign/rework briefs.