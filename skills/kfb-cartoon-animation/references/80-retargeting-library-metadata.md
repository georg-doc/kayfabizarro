# Retargeting, Motion Libraries and Metadata

## Source object first

A loaded file path or asset URL is not proof the actual donor motion/design was used.

Before integration:
1. identify source file/revision;
2. inspect the source actor/clip in isolation;
3. verify skeleton/clip identity;
4. record provenance;
5. only then adapt.

## Retargeting

Retargeting must resolve:
- source skeleton;
- target skeleton;
- rest/bind pose;
- bone correspondence;
- axis/orientation;
- scale;
- root;
- twist bones;
- hands/feet;
- props/attachments.

Do not call a clip compatible because it loads.

## Retarget validation

Check:
- hips/root trajectory;
- foot contact;
- knee/elbow orientation;
- shoulder/clavicle behavior;
- hand/weapon orientation;
- head/neck;
- scale;
- loop seam;
- extreme poses;
- contact markers.

## Motion library role

A large library is candidate coverage, not automatic semantic truth.

Each clip should have metadata sufficient to answer:
- what role;
- which rig family;
- direction;
- gait/travel mode;
- loop;
- root-motion type;
- natural/reference speed;
- accepted playback range;
- contact/phase;
- start/end foot where relevant;
- turn amount;
- authored facing;
- additive suitability;
- bone-mask compatibility;
- IK/warp allowance;
- interruptibility;
- style tags;
- technical versus human acceptance;
- provenance/evidence.

## Naming

Canonical IDs should be:
- stable;
- machine-readable;
- semantic enough to search;
- independent from temporary UI labels.

Preserve original source name in provenance when canonicalizing.

## Duplicate handling

Do not inflate libraries with renamed duplicates.
Detect:
- exact binary duplicate;
- same animation under different package;
- mirrored/retargeted derivative;
- intentionally distinct variant.

Record the relationship.

## Missing coverage

Use explicit states:
- MISSING;
- PENDING_SOURCE;
- TECHNICAL_HOLD;
- UNMAPPED;
- HUMAN_LOOK_OPEN.

Never fabricate a substitute and silently mark complete.

## Acceptance layers

Distinguish:
- source verified;
- technically retargeted;
- measured;
- runtime integrated;
- browser/playback proven;
- human visual accepted.

## Metadata versus GLB

glTF stores animation channels/samplers.
Semantic gameplay metadata normally lives alongside it in a project-owned catalog/contract.

Do not invent a second catalog when a current project catalog exists.
