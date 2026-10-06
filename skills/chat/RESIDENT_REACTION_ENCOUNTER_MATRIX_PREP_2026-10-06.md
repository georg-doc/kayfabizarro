# KFB Resident Reaction / Encounter Matrix · PREP · 2026-10-06

Status: **PROPOSAL · NO OPEN-WORLD RUNTIME WRITES**
Owner: **KFB Resident Life / Performance**
Receiving product later: **KFB Open World / WB2**
Current Open World writer: **Claude Coworker · protected**

Machine-readable companion:
`skills/chat/RESIDENT_REACTION_ENCOUNTER_MATRIX_PREP_2026-10-06.json`

## 1 · Purpose

Define common semantic reactions before runtime integration.

Each event maps:

```
semantic event
→ Affect delta / reaction pulse
→ Pose + Proximity
→ Gesture + Micro-motion
→ Face
→ optional Emanatum
→ Bubble / dialogue mode
→ Audio hook
→ Resume / Replan / Join / Exit
```

The event is the truth.
The presentation recipe is a consumer.

No row below requires an LLM.

## 2 · Global rules

- Affect belongs to Resident Life.
- Pose/Gesture/Face/Emanata/Bubble/Audio read the state/event.
- Emanata never write state.
- Max one primary Emanatum per Resident at a time.
- Silence is always a valid dialogue outcome.
- A reaction must define recovery.
- Physical safety / locomotion outranks presentation.
- Encounter spatial staging may request step-in/out but navigation/path ownership remains external.
- A short reaction pulse may temporarily overlay a slower mood/activity state.
- Durable memory records the meaningful social/world event, not animation frames.

## 3 · Priority bands

Recommended semantic priority:

- **100 · safety / immediate danger**
- **90 · strong world consequence**
- **80 · explicit player/social interruption**
- **70 · resource exchange / important reaction**
- **60 · curiosity / discovery**
- **50 · ordinary social contact**
- **30 · ambient/idle expression**

Higher priority may suppress or defer a lower reaction.

## 4 · Core world / daily-life reactions

### PLAYER_APPROACHED
Default:
- Affect: curious / attentive;
- Pose: orient/open;
- Proximity: hold, optionally small step-in;
- Gesture: acknowledge/wave if appropriate;
- Emanata: optional question;
- Dialogue: silence, greeting or short line;
- Next: encounter or resume.

### FRIEND_ENCOUNTERED
Default:
- Affect: pleased / affectionate;
- Pose: open;
- Proximity: small step-in if safe;
- Gesture: nod/wave;
- Emanata: usually none; heart only for stronger warmth;
- Dialogue: short greeting or silence;
- Next: brief social beat then resume/join.

### GIFT_OFFERED
Receiver:
- Affect: curiosity → surprise;
- Pose: attentive/open;
- Proximity: orient toward giver;
- Gesture: receive/inspect;
- Emanata: optional exclamation;
- Dialogue: optional acknowledgement;
- Next: accept/decline branch.

### GIFT_RECEIVED
Receiver:
- Affect: gratitude / joy;
- Pose: open-soft;
- Gesture: receive + thank/nod;
- Emanata: optional heart/sparkle;
- Dialogue: short thanks or silence;
- Durable: social exchange + memory importance.

### TRADE_ACCEPTED
Both:
- Affect: pleased;
- Pose: open-neutral;
- Gesture: exchange / inspect;
- Emanata: optional sparkle;
- Dialogue: optional short acknowledgement;
- Durable: inventory/resource transfer.

### TRADE_DECLINED
Default:
- Affect: mild disappointment / neutral recovery;
- Pose: small lean-back / close;
- Gesture: small shake or retract offer;
- Emanata: optional question or none;
- Dialogue: short decline or silence;
- Next: resume activity without hostility by default.

### FLUFF_SHARED
Receiver:
- Affect: grateful;
- Pose: open;
- Gesture: receive/carry;
- Emanata: heart or sparkle only if emotionally meaningful;
- Durable: Fluff transfer + social memory.

### FLUFF_SPILLED
Carrier / nearby:
- Affect: surprise → worry/annoyance;
- Pose: recoil then lean/inspect;
- Gesture: inspect / collect;
- Emanata: exclamation then sweat-drop if needed;
- Dialogue: none required;
- Next: collect/recover/replan.

### CARD_DISCOVERED
Default:
- Affect: curiosity / surprise;
- Pose: orient + forward lean;
- Gesture: inspect/point;
- Emanata: question or exclamation;
- Dialogue: optional Card-anchored short line;
- Audio: discovery accent through Audio owner;
- Next: inspect or resume.

### BILLBOARD_CHANGED
Default:
- Affect: curiosity / suspicion / amusement depending Resident profile;
- Pose: orient;
- Gesture: inspect;
- Emanata: optional question;
- Dialogue: optional short reaction;
- Next: return to route or start short social beat.

### BUILDING_COLLAPSE_OBSERVED
Default:
- Priority: high;
- Affect: surprise/fear/worry;
- Pose: recoil / step-out if safe;
- Gesture: inspect / point / help-ready;
- Emanata: exclamation or sweat-drop;
- Dialogue: optional exclamation, never required;
- Audio: world impact owner + reaction accent only;
- Next: flee, inspect, help, or replan according to role.

### REPAIR_COMPLETED
Workers / observers:
- Affect: relief / pride / joy;
- Pose: upright/open;
- Gesture: inspect + celebrate/nod;
- Emanata: sparkle optional;
- Dialogue: optional short acknowledgement;
- Next: seek next task / resume schedule.

### ACTIVITY_INTERRUPTED
Default:
- Affect depends on urgency and relationship:
  - low urgency + friend → attentive;
  - high urgency → annoyed/worried;
- Pose: orient without breaking foot contact;
- Gesture: acknowledge or decline;
- Dialogue: silence / brief-only;
- Next: resume, replan, or enter encounter.

### HELP_RECEIVED
Default:
- Affect: relief / gratitude;
- Pose: open-soft;
- Gesture: nod / thanks / shared-task transition;
- Emanata: heart or sparkle optional;
- Durable: help memory event.

### DISAGREEMENT
Default:
- Affect: doubt / annoyance;
- Pose: guarded/asymmetric;
- Proximity: hold or small step-out;
- Gesture: shake/shrug/dismissive accent;
- Emanata: question or anger-tick only when intensity warrants;
- Dialogue: short counter / Triplet only if context warrants;
- Next: resolve, leave, or continue task.

### PRAISE_OR_APPLAUSE_RECEIVED
Default:
- Affect: pleased / proud / embarrassed depending profile;
- Pose: upright/open or shy/closed;
- Gesture: acknowledge/bow/wave;
- Emanata: sparkle / heart / sweat-drop depending reaction;
- Dialogue: optional thanks;
- Next: resume performance/activity.

## 5 · ChatterBox social-call reactions · LAB ONLY

PR #357 already treats the four calls as ChatterBox experiments.
Do not promote these semantics to global world canon without explicit decision.

### KayfaBINGO!
Current lab intent:
- landed / continue or deepen.
Suggested performance:
- small positive settle;
- nod / open pose;
- optional sparkle;
- no mandatory line.

### KayfaBOGGLE?
Current lab intent:
- reframe / clarification.
Suggested performance:
- curious/suspicious;
- head tilt + slight lean;
- optional question Emanatum;
- gaze holds target.

### KayfaBONGO!
Current lab intent:
- hold/challenge/reformulate material.
Suggested performance:
- attentive/guarded;
- slight lean-in or hand-open challenge;
- no automatic anger;
- optional question Emanatum.

### BLÖDSINN!
Current lab intent:
- contradiction / semantic or rule break.
Suggested performance:
- surprise → annoyance;
- recoil or guarded pose;
- dismissive gesture;
- optional exclamation/anger-tick;
- Critic/Repair routing belongs to ChatterBox tooling, not Resident body runtime.

## 6 · Distance-readability rule

At distance, the primary read should come from:

1. Base Pose / silhouette
2. Orientation / Proximity
3. Large Gesture
4. Optional Emanatum

Fine face details are near-camera enrichment, not the only emotional carrier.

## 7 · Reaction recovery

Every reaction ends in one of:

- `RESUME_ACTIVITY`
- `REPLAN_ACTIVITY`
- `ENTER_ENCOUNTER`
- `JOIN_ACTIVITY`
- `LEAVE_AREA`
- `SEEK_HELP`
- `START_REPAIR`
- `INSPECT_TARGET`

The renderer does not decide this outcome.

## 8 · First acceptance chain

Use the existing 3-Resident fixture.

### Farmer_B → Lorekeeper Fluff-share
```
PATH_CROSS
→ NOTICE
→ ORIENT
→ FLUFF_SHARED
→ Lorekeeper SURPRISE
→ Lorekeeper GRATITUDE
→ Farmer PLEASED
→ short acknowledgement or silence
→ both RESUME_ACTIVITY
```

### Fluff spill during Farmer routine
```
FLUFF_SPILLED
→ SURPRISE
→ recoil/exclamation
→ WORRY
→ lean/inspect + optional sweat-drop
→ collect/recover
→ RESUME or REPLAN
```

### Player approaches Goth Girl
```
PLAYER_APPROACHED
→ CURIOUS
→ orient / attentive pose
→ optional question Emanatum
→ greeting or ChatterBox Triplet
→ player response
→ AMUSED / ANNOYED / ATTENTIVE
→ resolve
→ RESUME stage activity
```

### Lorekeeper sees new Card/Billboard
```
CARD_DISCOVERED or BILLBOARD_CHANGED
→ CURIOUS
→ orient / lean-forward / head-tilt
→ inspect
→ optional question Emanatum
→ optional Card-anchored short line
→ RESUME or continue inspection
```

## 9 · Architecture Freeze questions

The post-Coworker review must confirm:

- exact semantic event bus/API;
- event priority/arbitration;
- whether reaction pulses are stored inside AffectState or separate;
- pose/root adjustment limits;
- navigation ownership for step-in/out;
- bubble/Emanata protected-area API;
- Audio hook interface;
- cooldown owner;
- relationship-memory write point;
- simulation LOD thresholds;
- persistence of world/social consequences only.

## 10 · Next gate

**Coworker exact RETURN → Work/WSA Architecture Freeze validates this matrix against the real runtime.**

No Open World implementation now.
