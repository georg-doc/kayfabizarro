> **2026-09-18 STATUS OVERRIDE:** Sections 1–3 (archetype/revelation concepts) remain reference. The Birthday-Radio execution framing is **ARCHIVED HISTORY** because the full Birthday 2026 slice failed and is no longer current. Existing audio files remain valid repository assets/provenance; they are not a current production priority by virtue of this document.

# KFB Town · Post-r022 input · Archetypes, revelation artifact and Birthday Radio

**Date:** 2026-09-15  
**Status:** ADDITIVE DIRECTION / PROPOSAL. No runtime release and no new Town revision number.  
**Base:** `SESSION_CARD.md` S001 r022 + `TOWN_S001_R017_R022_PUBLIC_DELTA.md`.

This file captures new design input after the r022 public cut without rewriting the accepted r022 delta. Existing project/runtime owners remain unchanged.

## 1 · Archetype correction: FrizzleBob is primarily Herald / Guide

**DIRECTION:** FrizzleBob should be treated primarily as **Herald / Guide**, not as Town's fixed Trickster.

This better matches his Carny/guide role, Tourbus function and his use as a figure who moves the player between Cards, characters, places and perspectives. He may still perform trickster behavior in a scene, but **Trickster is a movable dramatic function**, not FrizzleBob's exclusive or defining slot.

Provisional functional map:

| Function | Current direction |
|---|---|
| Hero / Seeker | current Player Actor |
| Herald / Guide | **FrizzleBob** |
| Mentor | **Lorekeeper** |
| Ruler | **King Kayfabian / Paladin** |
| Threshold Guardian | **Offica Doppeldenk** as bureaucratic variant; Black Knight may fill the function situationally |
| Shapeshifter | Man / Werewolf |
| Trickster | movable function; no single permanent owner |
| Shadow | relational function; no permanent “evil character” slot |
| Ally | changing buddies / companions |
| Elixir | visible Card/artifact plus the Closure created from the encounter/journey |

This is narrative role mapping, not a new NPC state machine.

## 2 · Offica Doppeldenk

**DIRECTION:** Offica Doppeldenk is a bureaucratic Threshold Guardian whose comic power comes from **over-interpreting small or imagined authority**, not from being an actually powerful tyrant.

Working characterization:

- subject / loyalist;
- denunciator;
- self-appointed keeper of order;
- ignorant confidence;
- incorrectly used official language;
- small power gestures maximally overplayed.

The intended loop is behavioral rather than explanatory: Offica cites King Kayfabian, hassles someone, is outwitted, reports the affair with complete confidence and can remain blind to the contradiction in front of him.

**Candidate-only:** a Nutcracker-like actor silhouette is a plausible visual donor because of its rigid/institutional stance. Do not promote a specific Nutcracker asset until the Asset Librarian/Workbench has pinned and reviewed the actual source candidate.

Black Knight is no longer forced to be Town's default Threshold Guardian. He may still occupy that role in a particular encounter.

## 3 · Revelation artifact / “They Live” glasses

**PROPOSAL / DESIGN DIRECTION:** a pair of sunglasses can act as **Threshold Artifact + Revelation**: the world stays the same world, but gains a second readable layer.

Possible effects include:

- desaturated/sepia alternate view;
- hidden or re-read billboard messages;
- alternate Card interpretation cues;
- an “Emperor has no clothes” reveal for King Kayfabian.

The King reveal should be an alternate presentation of the same actor/identity, not a new King character or a second ruler state. Exact body/rig treatment remains ToolBox/actor work if this slice is ever accepted for production.

The important design property is scarcity: not every player needs the artifact. Finding it can open an additional epistemic layer rather than a mandatory global UI filter.

No shader, postprocess, item acquisition or alternate King rig is claimed built by this document.

## 4 · Birthday Radio · six concrete source tracks

**DECISION / DIRECTION:** the birthday radio uses six selected recordings from VOLE.wtf's “Happy Birthday To You” collection, one per D6 face:

1. Jazz Trio
2. Church Organ
3. Reggae
4. Drum’n’Bass
5. 8-bit
6. Death Metal

Source collection: https://vole.wtf/happy-birthday/  
Audio creator: **Tom Kincaid**.  
Source-stated license: **CC0 / Public Domain**; attribution is not required by the source but is appreciated.

Repository package:

`media/3D_Assets/Audio/Music/Birthday Radio - VOLE CC0/`

The per-file package manifest is the repository provenance source once the import has completed. The D6 face mapping is a KFB presentation decision, not metadata from VOLE.

### Initial interaction direction

Keep the first Birthday slice simple:

- six discrete tracks;
- visible style/track name rather than invented station branding;
- six D6 positions;
- later tap/swipe/flip input may select or randomize a face;
- browser audio starts only after a user gesture;
- the radio is not a new global audio owner; the consuming scene owns playback according to its existing audio contract.

Audio-reactive speaker bounce and colored-letter movement remain presentation proposals. They may use the running audio signal as input, but should not create gameplay physics or a second soundtrack state machine.

## 5 · Relation to Hero's Journey / return

The revelation artifact strengthens the existing return logic: the player can return to the same Town with a new Card, object or perspective and read already-familiar things differently.

“Return with the Elixir” therefore does not require a separate reward currency. The Elixir can be the collected artifact/Card **plus the Closure that changes how the player now reads the world**.

## 6 · Status boundaries

- **DIRECTION:** FrizzleBob primary Herald/Guide; Trickster movable; Offica as bureaucratic Threshold Guardian direction; six-track D6 Birthday Radio selection.
- **PROPOSAL:** exact sunglasses visual treatment, hidden-message implementation, King alternate-presentation rig, Nutcracker actor candidate, audio-reactive speaker/letter treatment.
- **IMPLEMENTATION:** none of the narrative/archetype items in this file. The audio asset import is tracked separately by its repository package/commit.
- **TESTED RESULT:** none for Town runtime from this document.
- **PRESERVED OWNERS:** Town design; Asset Librarian candidate discovery; ToolBox/Animation Lab actor/rig/motion; Travel world/lighting; consumer scene audio ownership.
