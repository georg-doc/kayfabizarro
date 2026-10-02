# Source audit · Legacy RPG Rigging Lab

## Exact pack facts

- KayKit Dungeon Pack 1.0 legacy source is already admitted under `media/3D_Assets/KayKit Legacy/`.
- Four direct character sources are static GLTFs with **0 skins / 0 embedded animations**.
- All four expose Body, Head, ArmLeft and ArmRight as rigid parts. Mage's source contains the literal typo `character_mageArnLeft`; the adapter normalizes it rather than rewriting the asset.
- Character-specific Hat/Hair/Helmet parts are separate nodes and are kept during assembly.
- Body/clothing appearance is mostly material-authored inside the body/arm meshes; there is no source-backed standalone clothing file set in this pack.
- The pack contains 12 alternate named class heads plus a skull source.
- The pack contains 24 tiered weapons: Sword, Shield, Axe, Double Axe, Hammer, Crossbow, Staff and Dagger × common/uncommon/rare.
- Arrow, empty/half/full quivers and Spell Book are separate prop sources.

## Rig donor

`KayKit_AnimatedCharacter_v1.2.glb` was structurally inspected from the exact Dropbox source copy matching the repository donor path.

Joints:

`Body · Head · armLeft · handSlotLeft · armRight · handSlotRight`

Embedded clips (30):

`Attack(1h) · AttackCombo · AttackSpinning · BasePose · Block · Cheer · Climbing · Dance · DashBack · DashFront · DashLeft · DashRight · Defeat · HeavyAttack · Hop · Idle · Interact · Jump · LayingDownIdle · PickUp · Roll · Run · Shoot(1h) · Shoot(2h) · Shoot(2h)Bow · Shooting(1h) · Shooting(2h) · Throw · Walk · Wave`

## Donors reused

The assembly math follows the existing Resident Atlas `legacyAssemble`: preserve each rigid source part's bind-world matrix, parent it to the matching donor bone and multiply by the donor `boneInverse`. No hand-entered body offsets are introduced.

Held props follow the Resident Atlas legacy finding: attach to the rigid arm bone at a measured far-tip/paw point. Attaching to the animated `handSlot` would visibly separate the prop from a rigid arm block in some clips.

Eye authoring reuses existing EyeRig v6. `LegacyFaceHost` is the only new face adapter because the existing arbitrary-biped FaceHost correctly returns unsupported for unskinned static source heads.

## Evidence boundary

Source structure and exact catalog paths are source-backed. Eye profile values remain `AUTO_CANDIDATE` until visual review. Pencil/CapsuleCarl/Eraser reuse is a future consumer proposal, not a compatibility claim.
