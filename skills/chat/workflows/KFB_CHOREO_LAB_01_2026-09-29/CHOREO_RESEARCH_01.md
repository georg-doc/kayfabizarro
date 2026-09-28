# KFB resident choreography · research notes 01 · 2026-09-29

Question from Georg: how do we build three kinds of resident interaction (gift handover, talk and argument including a speaker-corner monologue, cartoon brawls)? Which tool fits: the ToolBox Animation Studio, Blender MCP, a WSA work slice, web chats, Claude Design or Coworker? And are there Mixamo or engine plugins we could use?

Markers: **[verified]** means checked in a primary source or in our own data during this session. **[claim]** means not verified.

## 1 · Recommendation

Build **one choreography layer**, not three animation projects. A small scene contract (`kfb.choreo.v0`, see `CHOREO_LAB_01_RETURN.md`) sets out:

- two actors, their spacing and facing;
- one clip sequence per actor, with body-part layers;
- sync points (strike → reaction, handover, lid pop);
- prop sockets.

The clips already exist in the KFB Motion Library, 263 clips on Rig_Medium and Rig_Large. The missing part is how they are combined, and that is code, not new animation.

### Where each piece gets built

| Piece | Where | Why |
|---|---|---|
| Clip preparation, upper-body grafts, test renders | Blender MCP (this chat) | Headless bpy with the same bake pipeline as the library; renders can be checked before Georg sees them |
| Choreography player and editor (three.js) | ToolBox Animation Studio | This is where Georg fine-tunes timing, faces and reactions; it needs the same data at runtime |
| The player's user interface | Claude Design | Visual editor work |
| WSA slice, extra web chats | Not needed now | More coordination, no extra result |

## 2 · Mixamo and other sources

- **Mixamo has no two-person clips.** Paired moments have to be assembled from single clips with sync markers. [verified: library inventory, 263 clips, no paired set]
- **Give/receive clips are missing** from our library. Mixamo search terms to try: give, hand over, receive, present, offer, pick up. Whether Mixamo has a clean "handing over" clip is [claim] until someone searches it.
- **Cascadeur 2026.2** (Nekki, August 2026) adds animation layers and easing tools on top of its physics-assisted posing. It is the best candidate for hand-fixing single hits or handovers and exporting FBX back into the pipeline. [verified: CG Channel, AWN, Cascadeur blog] Licence tiers need a check before commercial use. [claim]
- **HY-Motion 1.0** (Tencent, open weights, December 2025) generates single-person motion from text.
  - Multi-person interaction is explicitly listed as not supported. [verified: Hugging Face model card]
  - It needs about 24–26 GB of GPU memory. [verified]
  - Clips are best up to about 5 seconds. [verified]
  - Output is an SMPL/SMPL-H skeleton, so it needs a retarget onto Rig_Medium/Rig_Large. [verified]
  - Licence: "tencent-hunyuan-community". Several earlier Hunyuan licences exclude the EU, UK and South Korea. Whether this one does was **not verified**. Georg is in Germany, so this must be checked before any use.
- **InterGen and InterMask** generate real two-person motion (hugs, boxing, handshakes).
  - InterGen code, weights and its InterHuman dataset are CC BY-NC-SA 4.0 (non-commercial), and redistributing the dataset is prohibited. [verified: GitHub README]
  - They are useful as reference and inspiration only, not for shipped clips (Gumroad PWYW counts as commercial).
- **DeepMotion SayMotion, Meshy, Motioneer and similar** are commercial text-to-motion services. Their quality and licence terms were not tested here. [claim]

## 3 · Runtime (three.js)

What the ToolBox player needs already exists in three.js:

- **Body-part layers.** A clip is split per body part by filtering its tracks by bone name, for example legs from a standing idle and torso plus arms from a seated talk clip. The mixer plays several actions at once, and a masked clip only drives its own bones. [verified: three.js forum, "Layers, Masking?"]
- **Additive blending** (`AnimationAction.blendMode`, `AnimationUtils.makeClipAdditive`) layers small accents, such as a head jolt on a hit, over any base clip. [verified: three.js docs and example]
- **Aim and stretch.** For a fist that has to reach a face, or hands that have to meet a box, the lab used a one-bone aim of the upper arm plus a forearm stretch. In three.js the same thing is a few lines on the bone quaternions. `CCDIKSolver` (three.js addons) is the fuller option. [claim: CCDIKSolver not re-checked this session]
- **Prop sockets.** Rig_Medium/Rig_Large already have `handslot.l` and `handslot.r` bones. A prop is parented to a socket and re-parented at a handover event. [verified: bone list]

## 4 · What the lab test showed

Numbers and pictures are in `CHOREO_LAB_01_RETURN.md`.

1. **Seated talk on standing legs works** as a bone-mask graft plus one spine correction, with no new rendering needed. The "upright" variant removes the seated forward lean. The "keep lean" variant reads as leaning in.
2. **Big chibi heads set the spacing.** A face sits 0.73 m ahead of the hips, but a fist reaches only 0.44 m. Faces then collide before fists connect. The cartoon answer is arm aim plus forearm stretch at the strike frame, and a personal-space rule that keeps heads apart.
3. **Reactions must be synced to the attacker's strike frame.** The reaction clip's own impact frame (detected from the head jolt) is placed on the attacker's strike frame.
4. **Some clips carry a lead-in.** "Surprise Uppercut" walks forward, turns about 150° and only then takes the hit. The player therefore starts it later (in-frame 30) and re-aims it at the partner.
5. **Lying poses need a body-axis rule for continuity.** When "getting up" follows a knockout, the head-to-hips axis is carried over, because the facing direction is not defined while lying.

## Sources

- [HY-Motion 1.0 model card (Hugging Face)](https://huggingface.co/tencent/HY-Motion-1.0)
- [InterGen (GitHub)](https://github.com/tr3e/InterGen) · [InterGen project page](https://tr3e.github.io/intergen-page/)
- [InterMask project page](https://gohar-malik.github.io/intermask/)
- [Awesome Human Interaction Motion Generation (paper list)](https://github.com/soraproducer/awesome-human-interaction-motion-generation)
- [Cascadeur 2026.2 with animation layers (CG Channel)](https://www.cgchannel.com/2026/08/nekki-releases-cascadeur-2026-2-with-animation-layers/) · [AWN](https://www.awn.com/news/cascadeur-ships-20262-animation-layers-and-3-new-languages) · [Cascadeur blog](https://cascadeur.com/blog/view/cascadeur-2026-2-animation-layers-easing-new-languages)
- [three.js additive animation example](https://threejs.org/examples/webgl_animation_skinning_additive_blending.html) · [three.js forum: layers and masking](https://discourse.threejs.org/t/layers-masking/26529) · [three.js issue #22713 (blend modes)](https://github.com/mrdoob/three.js/issues/22713)
- [DeepMotion SayMotion](https://www.deepmotion.com/saymotion) · [Meshy animation generator](https://www.meshy.ai/features/ai-animation-generator)
- [Mixamo alternatives overview (Cinevva, 2026)](https://app.cinevva.com/guides/free-character-animations-rigging)
