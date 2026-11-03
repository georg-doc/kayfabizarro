# WorldView Source Relations — Research-Only Register

**relation_schema_version:** `0.1.0`  
**status:** `dossier_editorial_candidates_pending_primary_passages`  
**date:** `2026-10-13`  
**owner:** Current Hidden Cosmology Atlas Editorial Research branch / Draft PR #394  
**reusability:** The data shape is project-neutral. No KFB Card, Triplet, comedy, performance character, monument, Borromean Dice or game mechanics are members of this source relation set.

## 1. What this data is

This register compares **positions represented in eight existing Gemini-authored author dossiers**, all text-read from Google Drive on 2026-10-13. They contain no primary-source interview URLs or exact page/timecodes in the extracted body. Consequently every relation below is a `DOSSIER_EDITORIAL_PARALLEL` or `DOSSIER_EDITORIAL_CONTRAST`, not a verified assertion that two original authors agree, disagree, cite or endorse one another.

**Nine distinguishable research/source identities are tracked**: eight dedicated author dossiers (Metzger, Icke, Liszt, Bramley, Farrell, Fitts, Jorjani, Wann) plus **Jesse Michels / American Alchemy** as interviewer/source discovery and possible separately documented personal-position author. A host's question and a guest's position are always distinct records.

## 2. Comparison candidates, not certified alliances or disagreements

| relation_id | subjects | shared question | contrast represented by the Gemini dossiers | relation_type | needed independent evidence |
| --- | --- | --- | --- | --- | --- |
| `WV-REL-001` | Kurt Metzger / David Icke | Who structures perceived social reality? | Social/institutional explanation vs consciousness and cosmology model | `DOSSIER_EDITORIAL_PARALLEL` | Source-specific claims from both speakers |
| `WV-REL-002` | Kurt Metzger / Catherine Austin Fitts | How are institutions connected with control? | Everyday institutional participation vs financial/institutional structure | `DOSSIER_EDITORIAL_PARALLEL` | Distinct primary statements and original actor terms |
| `WV-REL-003` | Kurt Metzger / William Bramley | How does hierarchy affect human behavior? | Contemporary institutional and sectarian analogy vs long historical Custodial account | `DOSSIER_EDITORIAL_PARALLEL` | Exact original speaker/book edition passages |
| `WV-REL-004` | David Icke / William Bramley | What is nonhuman agency? | Different named kinds/roles of alleged nonhuman entities; identity not presumed | `DOSSIER_EDITORIAL_COMPARISON` | Each original author's definitions and direct reference if claimed |
| `WV-REL-005` | David Icke / Jason Reza Jorjani | What changes the human condition? | Awareness/consciousness emphasis vs Promethean technological transcendence | `DOSSIER_EDITORIAL_CONTRAST` | Primary texts defining each outcome; exact contradiction still unverified |
| `WV-REL-006` | David Icke / Joseph P. Farrell | What explains concealed phenomena? | Perception/metaphysical vs technological-historical mechanisms | `DOSSIER_EDITORIAL_COMPARISON` | Original mechanisms, definitions and causal claims |
| `WV-REL-007` | Daniel Liszt / Joseph P. Farrell | Atlantis and alleged covert technologies | Overlapping topic families in different research formats | `DOSSIER_EDITORIAL_PARALLEL` | Episode and guest-turn citations; named works and dates |
| `WV-REL-008` | Daniel Liszt / Catherine Austin Fitts | Financial support for covert programs | Interview/disclosure history vs monetary/accounting explanatory chain | `DOSSIER_EDITORIAL_PARALLEL` | Original source passages from each; coappearance is not agreement |
| `WV-REL-009` | Joseph P. Farrell / Catherine Austin Fitts | Finance and technical infrastructure | Off-book finance vs proposed physical apparatus | `DOSSIER_EDITORIAL_PARALLEL` | Source passages; the indexed Solari event is an interview/program lead |
| `WV-REL-010` | Michael Wann / Daniel Liszt | How is historic space interpreted? | Sacred geography/time vs historical technology/secrecy | `DOSSIER_EDITORIAL_CONTRAST` | Two original explanations of comparable place/history phenomena |
| `WV-REL-011` | Michael Wann / Kurt Metzger | Social and symbolic conditioning | Place/calendar rituals vs media/institutional psychology | `DOSSIER_EDITORIAL_COMPARISON` | Primary source phrases, dates and scope |
| `WV-REL-012` | Jesse Michels / other authors | Interview/discovery relationship | American Alchemy as a source of guest statements, plus separable Michels-authored claims | `HOST_GUEST_SOURCE_DISCOVERY` | Specific episode, exact guest, host/guest timecodes |

Further pairs may be added **only when grounded in a source discovery or a documented editorial question**. Do not force a complete 9×9 matrix, artificial symmetry or generic narrative taxonomy.

## 3. Typed relation and provenance contract

Each unit: `relation_id, from_actor_id, from_actor_role, to_actor_id, to_actor_role, source_a_id, source_b_id, passage_a, passage_b, relation_type, originator, source_date, checked_revision, coverage_status`.

Allowed relation types: `DIRECT_SOURCE_CITATION`, `SHARED_PRIMARY_WORK`, `DOCUMENTED_INTERVIEW`, `SOURCE_AUTHOR_ASSERTED_LINK`, `DOSSIER_EDITORIAL_PARALLEL`, `DOSSIER_EDITORIAL_CONTRAST`, `HOST_GUEST_SOURCE_DISCOVERY`. Evidence and original authorship determine labels; a model-generated comparison cannot certify direct mutual reference.

Research source completeness: `DOC_DERIVED`, `PRIMARY_PASSAGES_PENDING`, `ONE_PRIMARY_PASSAGE_LOCATED`, `TWO_PRIMARY_PASSAGES_LOCATED`, `SOURCE_ALIGNED`; these reflect citation coverage only, not an evaluation of the worldview's truth or credibility.

## 4. Required review before strengthening a relation

1. Consult existing GitHub author Markdown, exact issue source packet and Google Doc donor to avoid duplicate baseline work.
2. Locate the first real author's original passage with speaker/work and timecode/page.
3. Locate the second real author's independent passage on a truly comparable proposition.
4. Determine whether any comparison is source-asserted or researcher-authored. Preserve disagreements in terminology and author-expressed certainty.
5. Append citations and reviewed source-unit IDs. Only then refine the relationship type.
6. Retain previous editorial comparison history; never silently overwrite or inflate its certainty.

**One next research evidence gate:** `WORLDVIEW_SOURCE_RELATION_RQ001_v0.1.0` — use existing Issue #395 for exact Metzger passages and one separately sourced counterpart. Independently, the first **KFB WorldView** plugin evaluation must confirm it inventories existing Docs/GitHub sources before proposing new research.
