# #369 Addendum 2 · Shared appear grammar + Fluff spell (culture mechanic)

- **Status:** FIRST PASS, accepted by Georg on 2026-10-07 as a basis. Fine-tuning comes later.
- **Executor:** Blender MCP on Georg's Mac Mini (Blender 5.2.2 LTS).
- **Writes:** additive to branch `blender/resident-performance-choreography-2026-10-07`.
- **Accepted scene untouched:** the accepted ground-handover scene (`369_GROUND_HANDOVER`, addendum 1) is not changed. The gift variant below lives in a linked copy.

## Boundaries

- no Open World / WB2 / PR #348 write;
- no merge, no Live promotion;
- no raw Mixamo FBX on GitHub;
- no itch.io clay textures on GitHub;
- `.blend` files stay in Dropbox.

## Idea: one visual logic for every item that arrives

Georg's rule: whether an item is unpacked from a gift or conjured by a spell, it must arrive with the same visual and metaphorical logic. `scripts/kfb_appear.py` is that shared grammar. A caller gives only:

| Per use | Gift | Spell |
|---|---|---|
| Source path of the clay ball | spat straight up out of the box mouth at the box's stretch frame | grows between the caster's hands, then shot forward like a fireball |
| Clay colour | ribbon colour of the gift (A1 `#f2b632`) | spell clay `#ef5a22` |
| Item | KFB card / Tiny Treats radio | Tiny Treats teapot |

Everything after the source path is identical:

1. **Arrive.** The ball is braked (ease-out) to the presentation point between the residents, with a catch squash.
2. **Morph.** The ball's own surface is pulled onto the item's outer hull.
   - This is a shape key, so it exports as a glTF morph target and the runtime can play it.
   - Thin items (cards) morph into a rounded clay slab instead, because a hull morph on a 2 cm card produced spikes.
3. **Colour wave.** The clay dissolves top-down with a glowing edge. The real item is underneath.
4. **Glow.** The item's own rim glow (inverted-hull shell, fresnel) fades in. A short light flash comes from the item itself.
5. **Crumbs.** A few clay crumbs fall off while the ball reshapes and colours.
6. **Float.** Zero-G hover with the same values as the loot reveal r8:
   - the launch spin decays to one turn per 200 f;
   - it tilts on two axes (0.28 rad over 97 f, 0.22 rad over 131 f);
   - it bobs (0.055 m over 74 f).
7. **Visibility.** Items are shown and hidden with scale keys only, so viewport, render and glTF agree.
   - Earlier passes used render-only hiding. The prop then stood visible in the viewport from frame 1, which broke the story.

Timing relative to arrival: morph −4…+14, colour +16…+28, glow +22…+34. All of it is overridable through keyword arguments of `build()`.

## Fluff spell (`scripts/kfb369_fluff_spell_r5.py`)

Scene `369_FLUFF_TRADE`, Farmer B (Rig_Medium) casts, Orc Brute (Rig_Large) watches. At 24 fps:

| Frames | Beat |
|---|---|
| 1–20 | Nothing is there yet. The Farmer goes into the magic ready stance (`kfb_idle_magic_standing_idle_a`). |
| 20–52 | Two-hand spell (`kfb_action_two_hand_spell_casting_a`, Motion Library, wrist-fixed). An orange clay ball grows between the circling hands, and clay crumbs are pulled in. |
| 56 | Push: the ball is shot forward. |
| 56–74 | It flies to the presentation point (x −0.7, z 1.55) between the residents and stops in mid-air. |
| 70–108 | Shared appear grammar: morph into the teapot (0.87 m), colour wave, rim glow, flash. |
| 96 / 108 | The Orc plays `kfb_idle_happy_a`; the Farmer plays KayKit `Cheering`. |

Clearance after arrival, measured from frame 90: teapot–Farmer ≥ 0.16 m, teapot–Orc ≥ 0.47 m.

**Clip audition.** Georg's Magic Locomotion Pack holds locomotion only, no spells. Spell sources found:

- in the Motion Library: `kfb_action_two_hand_spell_casting_a` (used), `kfb_action_casting_spell_a` and `kfb_action_fireball_a`;
- raw, not retargeted: `spell cast.fbx` (Great Sword Pack) and Quaternius UAL `Spell_Simple_*` (enter / idle loop / shoot / exit).

Audition sheet: `PREVIEWS/SPELL_AUDITION_farmer.jpg`.

### Rejected earlier passes (kept in Dropbox for reference)

- **r1:** knead on a picnic cooler, then throw a sandwich. Making and gifting were mixed; the hand motion and the flight were not in sync.
- **r2:** knead a ball on the ground, then pop to a teapot. The ball looked rubbery and pointed, and the item appeared without a cause.
- **r3:** shoot a lump at the ground. The prop was visible in the viewport from the start (render-only hiding), so the logic read backwards.

## Gift loot on the shared grammar (`scripts/kfb369_gift_appear.py`)

Scene `369_GROUND_HANDOVER_APPEAR` is a linked copy of the accepted scene:

- characters, gift box, box light and stars are shared and unchanged;
- the old loot rig is unlinked from the copy only;
- the card and radio are fresh copies (`GA_card`, `GA_radio`), with collections toggled per render.

The yellow clay ball is spat up at f249, arrives at f263 above the box (z 1.55), morphs (card: clay slab), colours at f279–291, then floats.

## Tune backlog (deferred)

| ID | Item |
|---|---|
| F1 | At the start of the spell clip the Farmer stands side-on, so the growing ball is partly hidden by her arm until about f46. |
| F2 | The clay teapot only hints at the spout and handle; the handle hole is closed. |
| F3 | The rim glow is subtle without bloom in the Fluff scene. |
| F4 | The spell clip holds the hands forward about 15 f after the push. |
| F5 | The gift reactions (cheer f278, happy f284) now fire slightly before the colour wave (f279–291). Retime on adoption. |
| T1–T5 | From addendum 1: foot-glued step-back, lid direction, Orc invite gesture, shrug look, real clay fracture. |

## Files

- `kfb_appear.py`: the shared appear grammar.
- `kfb369_fluff_spell_r5.py`: spell source plus a call to `build()`.
- `kfb369_gift_appear.py`: gift source plus a call to `build()`, in a linked scene copy.
- `../PREVIEWS/FLUFF_SPELL_r5_closeup.jpg`, `../PREVIEWS/FLUFF_SPELL_r5_wide.jpg`, `../PREVIEWS/GIFT_APPEAR_CARD_CAM1.jpg`, `../PREVIEWS/GIFT_APPEAR_RADIO_CAM1.jpg`, `../PREVIEWS/SPELL_AUDITION_farmer.jpg`

Blend copies (Dropbox `BLENDER MCP/RESIDENT_PERFORMANCE_369_2026-10-07/blend/`):

- `KFB369_fluff_spell_r5_appear.blend`
- `KFB369_gift_appear_r1.blend`
