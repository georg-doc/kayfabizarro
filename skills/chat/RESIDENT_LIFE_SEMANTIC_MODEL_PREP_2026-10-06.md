# KFB Resident Life · Semantic Model Prep · 2026-10-06

Status: **PROPOSAL · ARCHITECTURE PREP · NO RUNTIME WRITES**
Owner: **KFB Resident Life / Performance**
Receiving product later: **KFB Open World / WB2**
Current Open World writer: **Claude Coworker · protected**

This file turns the Resident planning vocabulary into concrete candidate records for the post-Coworker Architecture Freeze.

GitHub runtime state still outranks this proposal.

## 1 · Design rule

Keep four simulation axes separate:

1. **Identity / Profile**
2. **Affect**
3. **Activity / Intent**
4. **Encounter / Relationship**

Then derive **PerformanceCue** records for visible/audio presentation.

Do not store an animation name as the Resident's emotional truth.

## 2 · ResidentProfile candidate

```ts
type ResidentProfile = {
  residentId: string
  sourceResidentId?: string
  actorId: string
  rigFamily: string

  identity: {
    name: string
    roleTags: string[]
    factionTags?: string[]
    personalityTags?: string[]
  }

  bases: {
    homePoi?: string
    workPoi?: string
    socialPoi?: string[]
  }

  preferences: {
    activityWeights: Record<string, number>
    curiosityTags?: string[]
    sociality?: number       // 0..1
    helpfulness?: number     // 0..1
    routineRigidity?: number // 0..1
  }

  capabilities: string[]
  propRefs?: string[]
  chatterProfileRef?: string
  performanceProfileRef?: string

  durableMemoryPolicy: "light" | "selected-episodic"
}
```

Rules:
- source asset/rig truth stays with Resident Atlas / Registry.
- this record references owners; it does not duplicate asset metadata.
- one Atlas vignette may expose multiple runtime actors, e.g. `farmers → farmer_a / farmer_b`.

## 3 · AffectState candidate

```ts
type AffectState = {
  baselineMood: EmotionId
  primaryEmotion: EmotionId
  intensity: number   // 0..1
  arousal: number     // 0..1
  valence: number     // -1..1

  targetId?: string
  causeEventId?: string
  holdUntil?: number
  decayPerSecond?: number

  reactionPulse?: {
    kind: ReactionId
    intensity: number
    startedAt: number
    durationMs: number
  }
}
```

Affect is owned by Resident Life, not EyeRig, Audio, ChatterBox or Emanata.

## 4 · ActivityDefinition candidate

```ts
type ActivityDefinition = {
  id: string
  roleTags?: string[]
  requiredCapabilities?: string[]

  allowedPoiKinds: string[]
  requiredResourceKinds?: string[]
  requiredPropRoles?: string[]

  dayParts?: string[]
  weatherRules?: string[]

  basePriority: number
  interruptibility: "free" | "soft" | "hard"
  encounterPolicy: "allow" | "brief-only" | "deny"

  beats: ActivityBeat[]
  completion: {
    kind: "time" | "resource" | "event" | "repeat"
    target?: number | string
  }

  affectBias?: Partial<Record<EmotionId, number>>
}
```

Examples:
- `fluff.harvest`
- `fluff.transport`
- `archive.inspect-card`
- `stage.perform`
- `social.leisure`
- `repair.rebuild-section`

## 5 · ActivityInstance candidate

```ts
type ActivityInstance = {
  instanceId: string
  definitionId: string
  residentId: string

  startedAt: number
  currentBeat: string
  targetPoiId?: string
  targetObjectId?: string

  resourceIntent?: {
    kind: string
    quantity?: number
    direction: "acquire" | "carry" | "deposit" | "consume"
  }

  routeFamilyId?: string
  progress?: number

  suspendedByEncounterId?: string
  resumePolicy: "resume" | "replan" | "complete"
}
```

Transient progress does not necessarily belong in persistence.

## 6 · POI candidate

```ts
type ResidentPOI = {
  poiId: string
  kind:
    | "home"
    | "work"
    | "resource-source"
    | "market"
    | "archive"
    | "stage"
    | "social"
    | "repair-target"
    | "card"
    | "billboard"
    | "landmark"
    | "vista"

  worldAnchorRef: string

  affordances: string[]
  roleTags?: string[]
  resourceKinds?: string[]

  capacity?: number
  occupancyPolicy?: "exclusive" | "shared"

  curiosityValue?: number
  socialValue?: number

  schedule?: string[]
  enabledWhen?: string[]
}
```

World owns location/availability truth.
Resident Life only consumes it.

## 7 · Route family candidate

Residents should not replay one rigid waypoint path.

```ts
type RouteFamily = {
  routeFamilyId: string
  fromPoi: string
  toPoi: string
  variants: {
    id: string
    navHintRef?: string
    weight: number
    tags?: string[]
  }[]
  allowCuriosityDetour: boolean
  allowSocialDetour: boolean
}
```

Navigation remains the movement/path owner.

## 8 · EncounterRecord candidate

```ts
type EncounterRecord = {
  encounterId: string
  participants: string[]
  contextPoiId?: string
  startedAt: number

  reason:
    | "path-cross"
    | "shared-poi"
    | "player-approach"
    | "resource-opportunity"
    | "activity-help"
    | "event-reaction"

  relationshipBand: "unknown" | "familiar" | "friendly" | "close" | "tense"
  currentBeat: EncounterBeat

  offeredResource?: {
    kind: string
    quantity?: number
  }

  dialogueMode: "silent" | "acknowledge" | "short-line" | "triplet"
  result?: string
}
```

Eligibility score may use:
- task urgency;
- interruption policy;
- relationship/familiarity;
- cooldown;
- Affect;
- resource relevance;
- role/faction;
- POI context;
- player attention.

Silence is valid.

## 9 · Encounter beat grammar

Reusable beats:

```
approach
notice
orient
acknowledge
greet
offer
request
show
receive
inspect
share
help
react
agree
decline
disagree
thank
resolve
join
depart
resume
```

Not every encounter uses every beat.

## 10 · Relationship / light memory candidate

```ts
type RelationshipMemory = {
  residentId: string
  otherId: string

  familiarity: number
  affinity: number
  trust?: number

  lastEncounterAt?: number
  lastEncounterKind?: string

  recentImportantEvents: {
    kind: "gift" | "trade" | "help" | "conflict" | "card" | "fluff-share"
    refId: string
    valence: number
    importance: number
    at: number
  }[]

  summaryTags?: string[]
}
```

Default:
- all Residents may get lightweight familiarity/recent-event memory;
- deeper episodic/LLM-reflected memory remains optional and selected.

No explicit heart-meter UI is implied.

## 11 · SocialExchangeEvent

```ts
type SocialExchangeEvent = {
  eventId: string
  actorId: string
  targetId: string

  kind: "trade" | "gift" | "share-fluff" | "help"
  itemRef?: string
  resourceKind?: string
  quantity?: number

  poiId?: string
  result: "accepted" | "declined" | "partial"

  affectDelta?: {
    emotion: EmotionId
    amount: number
  }

  memoryImportance: number
}
```

This event may feed Affect, memory, dialogue and activity replanning.

## 12 · PerformanceCue relation

The detailed candidate lives in:
`skills/chat/RESIDENT_PERFORMANCE_EVENT_CONTRACT_PREP_2026-10-06.md`.

Semantic flow:

```
World fact / Resident intent / Encounter beat
              ↓
        Affect / Reaction
              ↓
        PerformanceCue
              ↓
 Pose + Proximity + Gesture + Micro-motion
 Face + Emanata + Bubble + Audio hook
```

## 13 · Persistence proposal

Persist durable identity/world consequences, not animation state.

Likely durable:
- resident profile reference;
- home/work assignment if authored;
- durable inventory/resources;
- relationship familiarity/important memory;
- selected activity commitments if necessary;
- Fluff/resource transfers;
- construction/damage/rebuild consequences.

Normally transient:
- current blink;
- current viseme;
- current gesture frame;
- current Emanatum;
- short reaction pulse;
- micro-lean;
- bubble animation.

Architecture Freeze must confirm actual owner/storage boundaries.

## 14 · LLM-free default

None of the records above requires an LLM.

Routine simulation can select:
- activity;
- POI;
- encounter eligibility;
- reaction;
- emotion transition;
- curated ChatterBox line/Triplet;
- performance recipe

deterministically / probabilistically from data.

LLM escalation remains optional for:
- free-text understanding;
- novel dialogue;
- reflection;
- unusual long-term planning;
- dynamic rumors/microstories.

## 15 · Exactly one next gate

Use the candidate fixture:
`skills/chat/RESIDENT_LIFE_VERTICAL_SLICE_FIXTURE_01_2026-10-06.json`

during the post-Coworker Architecture Freeze.

No runtime implementation before that gate.
