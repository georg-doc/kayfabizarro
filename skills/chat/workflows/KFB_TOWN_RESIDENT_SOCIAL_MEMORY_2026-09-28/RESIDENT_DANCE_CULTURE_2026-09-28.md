# KFB Resident Dance Culture · Common Bounce + Signature Moves + Player Learning · 2026-09-28

Status: **DESIGN PERSISTENCE · SOURCE-BACKED DIRECTION · NOT RUNTIME IMPLEMENTED**  
Owner: **KFB Town Resident Social Memory**  
Branch: `chatgpt-web/town-resident-social-memory-2026-09-28`

## 1 · Direction

Music and dancing are a shared KFB social behavior alongside Brick Fish / Red Herring play.

All Residents/characters should be able to participate in music and dance scenes where their current actor family permits it.

The system should produce three layers:

1. **Common Groove** — a shared simple bounce that makes a crowd immediately look musically connected.
2. **Signature Move** — one recognizable resident-specific dance move or short phrase.
3. **Learned Move** — the player can discover/learn a Resident's signature and later perform it through the existing action/interface layer.

This is not a new animation runtime, inventory, save system or dialogue system.

## 2 · Current source-backed foundations

### Motion Library

Current KFB Motion Library v2b contains:
- **179** catalogued clips total;
- dedicated `dance` libraries for both `Rig_Medium` and `Rig_Large`;
- **24 dance entries**;
- most dance clips are loopable;
- many are in-place;
- travel/root behavior is explicitly catalogued and can be stripped by the runtime when an in-place consumer needs it.

Current dance sources include:
- Breakdance Uprock;
- Chicken Dance;
- Maraschino Step;
- Twerk;
- Hip Hop A/B/C;
- Hokey Pokey;
- House A/B;
- Jazz Dancing;
- Kip Up;
- Left Shimmy;
- Locking Hip Hop;
- Moonwalk;
- Northern Soul Spin;
- Samba;
- Slide Hip Hop;
- Step Hip Hop;
- Swing;
- two Thriller Part 3 sources;
- Twist;
- Wave Hip Hop.

A Signature Move does **not** need one unique FBX per Resident. Long source dances may expose one or more beat-aligned reusable **motion slices** without copying the source binary.

### Resident Disco

The existing Resident Disco candidate already proves:
- one music transport for the whole scene;
- `beatPos = (songTime - phase) * bpm / 60`;
- a mixed ensemble of Legacy, Rig_Medium and Rig_Large actors;
- source-backed per-character dance pairings;
- beat offsets;
- grouped choreography;
- travel-removal for ensemble use;
- a roaming/bouncing Skeleton Minion;
- FrizzleBob as DJ/MC;
- dance scheduling over a multi-bar phrase.

### Orc Band

The Orc Band candidate already proves:
- one shared beat clock from real measured audio;
- accepted Legacy Orc B `bounce` as leader action;
- an 8-beat performance unit;
- a local footprint measured across the bounce;
- music-driven performer actions;
- a generated trumpet groove responding to leader height/location and the song.

The Orc leader bounce is therefore the strongest current **behavioral donor** for the desired shared KFB crowd bounce. It is not automatically reusable skeletal animation.

### Player Journey / Meta

Production Architecture v3 STRAND M already assigns durable cross-mode player progression to **Player Journey / Meta**.

Candidate durable domains already include:
- inventory;
- songs/media unlocks;
- NPC encounter facts;
- gift/reward facts;
- replay/choreography refs;
- other semantic journey facts.

Dance collection should extend this owner rather than create a second skill inventory.

## 3 · Common Groove · working term: Common Bounce

The Common Bounce is the default musical body response.

Desired visual idea from Georg:
- vertical bounce;
- small rhythmic hops;
- optional little circular/orbiting movement;
- clearly driven by beat and musical energy;
- simple enough that many characters can do it together;
- expressive enough to make a silent crowd feel like one musical culture.

Semantic action:

```text
dance.common_bounce
```

It should be available by default to Residents and to the player where the current actor family supports a compatible implementation.

### 3.1 · Rig-family implementations

Do not force one binary animation across incompatible actor families.

**Rig_Legacy**
- behavioral donor: Orc Band leader `orb.bounce`;
- Skeleton Minion Disco bounce/roam is a second current donor;
- rigid-part performers may use family-specific body/head/arm transforms.

**Rig_Medium / Rig_Large**
- Animation Studio should author/admit one compatible common-bounce motion/profile for both current KayKit rig families;
- reuse an admitted dance source where possible;
- use a lightweight additive hip/body/head bounce only when it remains inside current animation ownership;
- do not turn arbitrary root translation into movement ownership.

**Cube Pets / non-humanoids**
- map the same semantic action to PetMotion / node-procedural hop, squash, lean, spin or equivalent;
- do not retarget humanoid dance bones onto Cube Pets.

Other actor families receive adapters only when they have a real compatible motion mechanism.

## 4 · Music response

One scene music transport remains truth.

Suggested performance inputs:

```ts
type DanceMusicContext = {
  beatPos: number
  bar: number
  beatInBar: number
  section?: 'intro' | 'verse' | 'chorus' | 'break' | 'outro'
  energy?: 'low' | 'medium' | 'high'
  accent?: boolean
}
```

The Common Bounce can respond through:
- hop height;
- squash/stretch amount where the actor family supports it;
- body bob;
- head nod;
- small sway;
- optional local circle/orbit choreography;
- stronger downbeat accents.

Do not continuously distort calibrated clip playback rate simply to chase loudness.

For a dance event, local circle/orbit motion belongs to the **performance choreography around the dance anchor**, not to general World navigation.

Outside a dance event, the common groove should normally remain in-place.

## 5 · Signature Dance Move

Each Resident should eventually have one authored **Signature Move**.

This is a character identity mapping, not a random clip roll.

Suggested contract:

```ts
type ResidentDanceProfile = {
  residentId: string

  musicAffinity: 'normal' | 'high' | 'very-high'

  commonGroove: {
    semantic: 'dance.common_bounce'
    implementationRef?: string
  }

  signature: {
    moveId: string
    motionRef: string
    slice?: {
      startBeat: number
      beats: number
    }
    styleProfileRef?: string
  }

  socialRole?: 'anchor' | 'caller' | 'responder' | 'wildcard'
  learnable: boolean
}
```

All KFB Residents can remain music-positive while expressing it differently:
- stiff;
- loose;
- athletic;
- heavy;
- theatrical;
- tiny hopping;
- awkward;
- show-off;
- deadpan.

The Signature Move is where this difference becomes collectible.

## 6 · Motion slices instead of one file per Resident

Several current Motion Library dances are long enough to contain multiple readable phrases.

Animation Studio should therefore support a **beat-aligned motion slice**:

```ts
{
  motionRef: 'kfb_dance_house_a',
  startBeat: 16,
  beats: 8,
  loopMode: 'phrase'
}
```

The recipe references the existing source clip.
It does not duplicate FBX/GLB bytes.

Benefits:
- many more unique signatures from the existing 24 dance sources;
- smaller, more readable player moves;
- easier group scheduling;
- exact phrase boundaries;
- no giant new animation intake merely to give every Resident a different name.

A slice must still be visually checked for:
- clean start/end;
- foot contact;
- facing;
- root travel;
- loopability or clean return into Common Bounce.

## 7 · First existing pairing pool

Resident Disco already contains useful audition pairings.

These are **candidate mappings, not final signatures**:

| Resident | Existing Disco candidates | First signature audition |
| --- | --- | --- |
| Avian Swordsman | Wave Hip Hop · Step Hip Hop · Locking Hip Hop | Wave / athletic phrase |
| Protagonist_A teen | House B · Slide Hip Hop | House/Slide phrase |
| Officer Doppel-Denk / Toy Soldier | Chicken Dance · House A | Chicken/rigid comic phrase |
| Witch | Samba · Wave Hip Hop · House A | Samba/flowing phrase |
| Black Knight | House A · Slide Hip Hop · Locking Hip Hop | Locking/heavy phrase |
| Monstrosity | Slide Hip Hop · House B · Wave · Step | Step/weighty phrase |
| Demon Lord | Hip Hop A · Step · Locking | theatrical Hip-Hop phrase |
| FrizzleBob DJ/MC | Hip Hop A · Wave · Locking | MC/show-off phrase |
| Skeleton Minion | Legacy bounce + legacy motion pool | hop/roam phrase |
| Orc Band Leader | accepted Legacy `orb.bounce` | exaggerated circle/bounce variant later |

Animation Studio should audition these before assigning the rest of the Resident roster.

Do not force one-to-one uniqueness by assigning a visibly bad motion. A different beat slice/style profile of the same good source is preferable to a mismatched clip.

## 8 · Solo dance grammar

A Resident should not instantly spam the Signature Move whenever music is audible.

Default working grammar:

```text
hear / notice music
→ Common Bounce
→ stay in groove
→ optional Signature Move on phrase boundary
→ Common Bounce
→ optional reaction / social beat
→ continue or leave
```

Possible short pattern:

```text
G G G S
```

where:
- `G` = Common Groove phrase;
- `S` = Signature phrase.

Signature frequency can vary by character:
- show-off Resident: more frequent;
- shy/deadpan Resident: rare;
- musician: may coordinate Signature with chorus or solo;
- Officer Doppel-Denk: may dance, notice disorder, interrupt himself, then reluctantly rejoin.

No exact universal bar count is canon yet.

## 9 · Group dance grammar

Group scenes should share rhythm without becoming cloned synchronized mannequins.

Working phrase vocabulary:

```text
G = Common Bounce
S(A) = Resident A Signature
H = shared group hit/accent
R = local roam/circle choreography
C = call-and-response
```

Example eight-bar structure:

```text
G · G · S(A) · G
G · S(B) · H · G
```

Possible larger-group behavior:
- everybody enters through Common Bounce;
- one or two Residents take a Signature phrase;
- nearby Residents remain on groove;
- another Resident answers on the next phrase;
- chorus/downbeat can trigger one shared hit;
- phase offsets, facing and bounce amplitude keep the group organic;
- local orbit/roam stays bounded around the dance anchor.

The same pattern works:
- solo;
- pair;
- small group;
- Disco;
- Orc Band audience;
- street music;
- spontaneous Town encounter.

## 10 · Brick Fish and dance can coexist

Brick Fish should not suspend the musical culture.

Example:

```text
group dancing
→ Brick Fish hits Resident B
→ BONK / heart Reaction Choreography
→ one social retort
→ B re-enters Common Bounce on next legal beat/bar
→ Signature schedule continues
```

This becomes an important proof that Residents return to their previous activity rather than collapsing to generic Idle.

Officer Doppel-Denk creates a useful conflict:
- he likes dancing too;
- he notices a Brick Fish exchange;
- duty/authority motivation interrupts the dance;
- other Residents may laugh at his intervention;
- after the beat resolves he can resume the Common Bounce or patrol.

## 11 · Dance as a POI / AIDA driver

Music itself becomes a semantic POI/event source.

Useful POIs:
- live band;
- Disco;
- speaker/radio;
- musician Resident;
- dancing Resident;
- player dancing;
- temporary street performance;
- dance floor / stage.

Resident AIDA:

```text
ATTENTION
hears/sees music

INTEREST
music affinity + current goal + social availability

EXPECTATION
"there is a dance/social opportunity"

INTERACTION
approach / join / watch / call another Resident

REACTION
Common Bounce / Signature / applause / retort / Brick Fish gag

MEMORY
only meaningful shared performance or learned/teaching event

RETURN
resume prior routine or remain in the music event
```

No LLM call is required for the dance scheduler.

## 12 · Player learning / collection

Dance Moves should use **Player Journey / Meta** as the durable owner.

They are similar to props/cards in provenance and collection, but a learned movement should **not consume a Backpack slot**.

Suggested states:

```text
UNKNOWN
→ DISCOVERED
→ LEARNED / PERFORMABLE
```

### Discover

A player can discover a Signature Move by:
- watching a complete readable phrase;
- asking/interacting with the Resident where supported;
- joining a dance scene.

Semantic event:

```ts
dance.discover({
  moveId,
  teacherResidentId,
  sourceEventRef,
  method: 'observe' | 'join' | 'teach'
})
```

### Learn

Preferred interaction:
- player enters Common Bounce near the Resident;
- Resident performs Signature;
- player stays/joins for one phrase;
- move becomes performable.

Semantic event:

```ts
dance.learn({
  moveId,
  teacherResidentId,
  sourceEventRef,
  method: 'join'
})
```

Accessibility / low-friction option:
a complete observation may also unlock the move when the consumer chooses that rule. Do not force a rhythm-game score as a universal requirement.

Provenance should remember:
- which Resident taught it;
- where;
- during which music/event;
- whether it was observed, joined or explicitly taught.

No duplicate unlock reward on replay.

## 13 · Player performance

The player starts with Common Bounce so group participation works immediately.

Learned Signature Moves become available through the existing adaptive action/interface layer.

Semantic request:

```ts
dance.perform({ moveId })
```

The interface may later expose:
- one quick Dance button for Common Bounce;
- hold/open for learned Signature Moves;
- a Move wheel / action palette;
- contextual prompts near a dancing Resident.

The exact UI belongs to the Adaptive HUD/action owner, not this design document.

## 14 · Actor compatibility for learned moves

The player's collected **move identity** is semantic.

Do not assume every current avatar uses the same skeleton.

Example:

```text
learned move: officer-chicken-phrase
→ Rig_Medium player: exact compatible motion slice
→ Rig_Large player: corresponding Rig_Large library motion slice
→ CubePet player: semantic PetMotion interpretation only if intentionally authored
→ unsupported actor: move remains collected but cannot currently perform it
```

This preserves collection across character switching without forcing invalid retargets.

## 15 · Almanac / Journey presentation

The Full Almanac can later expose a **Moves / Dances** collection alongside other Journey history.

Useful item facts:
- move name;
- teacher Resident;
- source dance/motion;
- learned location/event;
- compatible current actor families;
- replay/audition;
- optional music association.

This is provenance and memory, not a Pokémon-style completion percentage requirement.

## 16 · Learned moves become social tokens

A learned Signature Move should remain meaningful after unlock.

When the player performs a learned move inside another actor's attention field, emit a semantic performance event:

```ts
dance.signature.perform({
  performerId,
  moveId,
  originResidentId,
  witnessIds,
  sourceEventRef
})
```

The original teacher may recognize their own move and select a character-specific reaction intent:
- join;
- approve;
- correct;
- challenge / answer with another move;
- parody;
- deadpan-ignore;
- recall the original teaching event.

Other Residents may recognize the move only when their authored knowledge or memory provenance supports it. No omniscient global recognition.

This can open a tiny bounded `dance_exchange` social thread:

```text
player performs learned Signature
→ teacher notices / remembers
→ teacher reaction or answer move
→ optional one-beat player response
→ thread closes
→ both return to groove / prior activity
```

This makes dance collection function like reusable retorts and meaningful props: an acquired thing can later change an encounter instead of merely filling a collection screen.

The teacher's subjective memory may store that the player learned/used the move when the outcome is socially meaningful. Player Journey remains the authoritative owner of the unlock itself.

## 17 · Animation Studio work

Animation Studio is the correct place to build the mappings.

Needed authoring support:
1. filter Motion Library to `dance`;
2. audition actor + exact source motion;
3. set/preview beat alignment;
4. mark motion slice start + length;
5. preview in-place/travel handling;
6. audition transition Common Bounce → Signature → Common Bounce;
7. save `ResidentDanceProfile`;
8. test both Rig_Medium and Rig_Large where relevant;
9. expose Legacy/Pet adapters through their actual owner mechanisms;
10. export mapping refs, not copied binaries.

This should be integrated with the existing animation/motion catalogue rather than becoming a standalone Dance Studio runtime.

## 18 · First productive proof

A later integrated proof can use:

Actors:
- Officer Doppel-Denk / Toy Soldier;
- one second current Resident;
- player actor.

Music:
- current band/disco transport.

Required sequence:

```text
music becomes active
→ both Residents enter Common Bounce
→ Resident A performs Signature
→ player watches: DISCOVERED
→ player joins Common Bounce
→ Resident A performs Signature again
→ player receives LEARNED
→ player triggers learned move
→ Brick Fish interrupts Resident B
→ reaction resolves
→ B returns to Common Bounce on beat
→ group continues
```

Evidence:
- one music transport;
- no duplicate AnimationMixer owner;
- no duplicate Player Journey owner;
- one durable dance unlock;
- provenance teacher/event retained;
- group stays rhythmically coherent;
- Signature insert does not break Common Bounce return;
- Brick Fish interruption returns correctly;
- actor compatibility is explicit.

## 19 · First mapping principle

Every Resident should eventually answer:

```text
What do I do when music starts?
What is my Signature Move?
How often do I show it?
How do I invite/respond to others?
Can the player learn it from me?
How do I return after interruption?
```

That character-specific answer is part of the same Resident identity layer as:
- routine;
- attention bias;
- motivations;
- reaction deck;
- memory salience.

## One next gate

Do **not** start a second runtime.

Add this Dance Culture contract to the current Resident Social Memory design stack. When Animation Studio mapping is available, produce the first small resident mapping set and feed it into the existing **RESIDENT-SOCIAL-MEMORY-01** receiving-world proof rather than creating an isolated Dance acceptance page.
