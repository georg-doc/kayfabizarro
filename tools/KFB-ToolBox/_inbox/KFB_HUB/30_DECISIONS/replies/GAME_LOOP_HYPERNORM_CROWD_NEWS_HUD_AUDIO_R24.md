# KFB Game Loop R24 · HyperNorm Crowd / BNWN Radio Vignettes / Destruction Chorus
2026-11-01 · Georg creative direction + bounded concept elaboration · **NOT IMPLEMENTATION, NOT A NEW RUNTIME OWNER**

**Existing concept owner:** KFB_HUB / 30_DECISIONS/replies, same Draft PR #460 on `planning/kfb-game-loop-fluff-economy-r2-2026-10-29`. Receiving contracts unchanged: WB2 World/Destruction + source damage receipts; Resident Life / NPC scheduling; Combat Arena MobBrain + Gunfight; ChatterBox/Triplets/EyeRig; current HUD/Radio; Media/HeyGen/Video; single KFB Audio mixer and VoiceProfile/ElevenLabs provider; Card Registry / Almanac / Lean Event Memory. WS0/Georg accepts the creative intent before owner-implemented proof.

## 1 · Greater intent: consequences release people, not just particles
**“You choose something. Ride the consequences.”** When a player disrupts or damages a HyperNormalised building, an authentic world-state event may release **Fluff, debris and a small number of occupants**. They were doing ordinary things, consuming upbeat official media or performing comfortable propaganda slogans. Their responses are *situated*: startled, relieved, angry about their interrupted routine, curious, pleading, laughing, helping with repairs, fleeing, or a few becoming genuinely hostile. A sweet fixed Happy Face can contrast comically with an irritated body/voice. A Resident is not evil just because they were inside a HyperNorm institution; a friendly slogan is not evidence the speaker agrees privately.

**Keep Chill & Fun:** playful cardboard/clay physical comedy, surprise, varied outcomes, easy disengagement, readable routes. Combat is an optional local response mode, **not** an ideology-correction mechanic. The player may shoot an actually hostile cartoon mob through existing Combat rules *when engaged*, run away, watch residents escape, help repair or ignore the incident. No blanket enemy flag for all evacuated Residents; no rewards for silencing a certain opinion.

## 2 · User-visible media: source-owned radio-near avatar vignette
Georg asks for a small **HeyGen avatar / vignette frame near the existing Radio HUD** with a possible comic speech bubble and a distinctive **news-ticker typeface** for Mizzie / **Brave New World News (BNWN)** commentary, including context-aware Destruction inserts.

**Proposed presentation states**, not a new UI implementation:
- **Silent radio:** normal compact existing radio. No dormant empty television frame or fake streamer UI.
- **News cue:** a small physically framed/accepted radio-adjacent video cameo **when an approved clip exists**. Consumes *existing* HUD layout/event and original HeyGen source aspect/alpha; not a generic new widget, forced full-screen overlay or replacement source brand.
- **Headline:** a one-line BNWN news ticker in a **visually source-aligned, compact digital/period-news font**. Current `hud-flight/kfb-hud.js` radio donor already uses a pixel-style ticker via `F_PIX = VT323` and has `setTrack`/`setSource` APIs: **reuse/compare its real visuals in isolation before extending**, no assumption that the HUD donor is integrated in current WB2. A 1950s newsreel-inspired headline may require editorial font study; do not claim VT323 matches the final BNWN design automatically.
- **Bubble optional:** if avatar is explicitly speaking, attach one **existing ChatterBox speech/caption grammar**, not a second speech-bubble writer. Bubble may be replaced by subtitles in narrow/mobile view; preserve legibility and action.
- **Exit/focus:** a short timed appearance, accessible captions/mute, avoid covering target/locomotion; clear automatically, allow skip; no auto-started unlicensed/uncleared video or looping every time a damage cell breaks.

**Source caveat:** User reports real HeyGen **Mizzie** clips and **Karavatar** creator-avatar material; their exact current source IDs/rights and media-owner acceptance **were not located in R22/R23 source search**. Do not invent or replace them. The avatar must be shown and reviewed from the **actual source object/video in isolation** before composite HUD integration. News inserts remain a **consumer of authored source footage**, not a second avatar generator.

## 3 · Resident crowd as witnessed Destruction aftereffect
**Event source of truth:** only WB2/Destruction supplies confirmed `damage/partial collapse/full collapse/repair/transfer` and stable building/world-object ID. Damage to a facade does **not** imply whole-building destruction, an occupied building, casualties or actual loot. An event-driven resident layer can react only when a source-backed building has occupancy/Resident associations, not spawn a new infinite population from any broken mesh.

**Candidate bounded chain, NOT new event/schema:** `CONFIRMED WORLD CHANGE → AFFECTED/NEARBY RESIDENT SET → RESIDENT-LIFE REACTION → VISIBLE EXIT/FLEE/OBJECT/HELP/HOSTILE CHOICE → OPTIONAL COMBAT/LOOT → EVENT RECEIPT → MEDIA/CROWD SOUND BEATS`.

Re-use `RESIDENT_REACTION_ENCOUNTER_MATRIX_PREP_2026-10-06.md` exactly as a planning donor:
- `BUILDING_COLLAPSE_OBSERVED` already names **flee / inspect / help / replan** and an optional shout with world-impact audio owner;
- `ACTIVITY_INTERRUPTED` already names annoyed/worried vs attentive and **resume/replan** according to actual role;
- one high-priority Affect pulse; EyeRig, pose, motion, micro-gesture, emote/Emanata and ChatterBox are presentations, **not separate state writers**.

**Possible resident behaviors** depend on personality/job/witnessed facts/actual threat:
`exit_building` → `scatter/flee` | `complain/quote slogan` | `seek help/repair` | `recover original routine` | `defend property/engage hostile`. A happy smile can persist on an angry person, but avoid everyone shouting the exact same sentence in a loop. Tripping is a bounded, recoverable cartoon stunt with safe collision and no player-softlock; any fake fall/damage has to remain presentation until the combat/world owner confirms damage.

**Instancing strategy:** dozens of *individually animated skinned* NPCs are **not** automatically cheap just because models can share geometry or material. `THREE.InstancedMesh` alone does not provide independently animated skeletons, unique AI, hitboxes and interaction. **Proposal for later performance pilot:** few near, interactive real Rig_Medium Residents with authentic skinned clips; distant lightweight instances / baked motion / billboards only if actual sourced visual quality is acceptable; pool/recycle and cap active panic/hostile agents, cull by distance, avoid multiple simulation updates per same Resident. Source-backed Mannequin_Medium is proven as a **Motion review fixture**, not an accepted crowd/Combat actor; Large has **separate source and native-clip coverage** (no blind Medium retargeting). Norman variants mentioned by Georg require source/asset verification; do not manufacture character identity.

**Two kinds of entities:**
- Persistent authored Residents retain source identity, home/POI, relationships and Lean Memory; if evacuated they do not get duplicated or reset on replay.
- Background *crowd extras* may be event-scoped pooled visual/collision actors where an accepted building actually has that population role; no false canonical biographies or infinite world population. Their state is recycled and not treated as permanent NPC opinions.

## 4 · Card loot and comic hostile mobs
Possible event response: a genuine source Card/lootbox was being kept in a building or protected by its inhabitants. When disrupted, the Card may become **accessible**, someone may try to protect it, or the nearby crowd may flee; source-aware guard reactions are not automatically villainous. Card remains **one canonical `deckId:cardNumber`**, unique provenance/Almanac receipt; it is never minted every time the building is hit or the box reopened. Loot boxes may also contain mundane props or Fluff; avoid compulsory killing to reach world-knowledge Card content. A player can **sneak, negotiate, trade, distract, help, flee or engage** where those affordances exist.

An actual hostile subset may attack with source-proven **MobBrain → Gunfight** and current World physics; no second projectile/damage controller, no new ideologically keyed enemy-class filter. Defeat results use the existing combat lifecycle, safe clear/respawn rules and cartoon-appropriate consequences; don't silently classify a person as “hostile” because they repeat establishment or dissent slogans.

## 5 · Propaganda chorus: Triplets + ElevenLabs voice acting
Suggested in-world *quote pool* includes Georg's supplied phrases **“Trust the experts,” “Follow the science,” “Protect our democracy”** and optional rival self-branded independence/counter-slogans. Each is an **attributed fictional utterance**, not a universal truth, official endorsement or target for partisan persuasion. Character voice, urgency, ironic context and recent exposure determine whether a phrase is shouted, mechanically repeated, doubted, cut off, commercially pitched or ignored. **Show It → Spin It → Sell It** is a semantic source grammar, not compulsory robotic three-line output.

**Voice production:** create a small human-reviewed, ethically/rights-cleared **ElevenLabs multi-voice pre-recorded library** for source-approved lines and vocalizations, with expressive but distinct reads (sincere retail optimism, outraged interruption, panicked yelp, baffled compliance, conspiratorial whisper). Keep **voiceProfile** and exact line/card/source IDs, variant/take, language, duration, priority/volume/spatialization, license/use rights and phonetic QC with existing voice asset owner; don't impersonate real politicians or news presenters without consent. Reuse `KFB_NEXT_RUNTIME_MVP_VOICE_ACCEPTANCE_2026-10-08.md`: actual ElevenLabs Roger/Siren Social Calls exist as **candidate** inputs; ElevenLabs optional, never a runtime dependency and bulk generation waits for casting. **Resemble Chatterbox-TTS is a distinct provider, not the game's ChatterBox semantic dialogue owner**.

**Audio playback:** only existing KFB Audio/PR #365 mixer handles one AudioContext, SFX and ducking. Entity shouts are positional/foreground cues with per-event concurrency and anti-repeat, not 30 equally loud VO channels. One salient voice foreground; a few mixed lower-level crowd layers/distant walla and panning with limits, current impact/wood/smash/Fluff FX own their respective audio cues. No generated TTS/per-hit ElevenLabs calls during destruction hot path. If VO missing, a real bubble/gesture/sound may suffice; no fake assets.

## 6 · Time-coded Destruction cascade (“Ride the Consequences”)
**Conceptual sequence (timing authored later, not claimed tested):**
- World confirms hit and relevant building damage → existing physics/Destruction VFX + primary impact.
- After actual entrance/egress viability: near occupants look up/step out, a few scatter, shout, tripping/anger as source/rig allows; synchronized sound/animation **on event beats**.
- On confirmed major collapse: extra debris/Fluff, survivors scatter or a bounded hostile group engages if context supports it; some NPCs complain about disruption of their comfortable HyperNorm consumer ritual.
- Optional BNWN/Mizzie avatar vignette/ticker **later** comments on the **confirmed event**, chooses a contextually relevant existing approved segment with cooldown and speaker attribution.
- Lean Memory records actual significant resident actions/relationships/source Card acquisition and stable world change; no durable memory of every scream/collision frame.

The legacy `travel/KFB Travel Globe v13-1/globe-v13/fx-bus.js` embodies **event → time-delayed beats, one owner per FX actor, bounded cascade**. It's a timing **donor**, not a new master FX bus in WB2. The Seed World Mech Destruction POC has bounded cell/debris pools but is **not current live World acceptance**. The existing audio owner handles mix/headroom/ducking and voice/caption sync. News should not preempt critical combat sounds.

**Non-repetition:** reuse source-verified authored voice sets and news segments with context/cooldown/voice variety; soft quotas for rapid repeated building hits, skip inserts where irrelevant; no infinite scripts/clip synthesis by mobs.

## 7 · One small later proof, not a large redesign
Candidate experiment **if/when WS0 and receiving owners authorize**:
one source-approved existing building with one real entry, **2–3** source-verified Mannequin_Medium-derived *visible residents* (not automatically three Combat agents), one building-damage event, and two observable outcomes from the SAME world event: one flees and one complains about a consumer-media interruption. Only if current Gunfight/MobBrain consumer is ready, **one** verified optional hostile actor. One genuine Card/loot receipt; one authentic radio-near avatar clip/BNWN ticker **only if Mizzie source and media rights available**. One source-verified ElevenLabs voice clip with one audible crowd layer, impact SFX and speech bubble if audio unavailable. Verify physical egress, source-object isolation, source Card provenance and one-time grant, run budget, actual lip/eye/motion, safe respawn/reload, audio duck/priority, 3D/mobile visibility, no repeated news spam.

**This is a fixture proposal, not tests performed or a new target quota.**

## 8 · Editorial guardrails / current evidence
This is **fictional KFB cartoon combat/propaganda satire**. In-world residents can quote antagonistic slogans or complain about player disruption; no prescribed anti- or pro-establishment ideology, no hidden player opinion model. “Conflict is King” allows complaint, retreat and coercive action without forcing combat or making Card knowledge a reward for harming NPCs. Preserve participant humanity and interpretive closure. Don't conflate actor voice and narrator truth.

Actual GitHub sources reviewed: `R23` + Return and current global Bigger Picture; World frozen NO MVP; `RESIDENT_REACTION_ENCOUNTER_MATRIX_PREP`; Resident Life candidate; current Motion/Character Select; Combat Arena MobBrain/Gunfight precheck; HUD radio with `VT323` ticker (donor not certified integrated); KFB Audio baseline; Voice acceptance (ElevenLabs optional, 166 source line IDs and historic 13/13 adapter test **not R24 tests**); Voice Layer handover; Travel FX timing and Seed World Destruction donor.

**Source IDs not yet verified here:** actual HeyGen Mizzie/BNWN clip files, avatar/vignette artwork/frame, accepted Norman source/variant, Rig_Large Mannequin animation parity, current World building occupancy integration, final radio-HUD crop and ElevenLabs recordings for proposed mob calls.

**R24 checks:** GitHub source research and exact write/readback only; **runtime 0, browser 0, gameplay 0, visual donor isolation 0, audio audition 0**. No new code, model, image, voice, video, public Stage/Site/Live, Hub/router/SSOT or another owner. R9–R11 remain previous local-only drafts, not included here.

**Exactly one next gate:** **Georg/WS0 editorial intake of the R24 combined “Destruction→occupant crowd reactions→optional hostile Combat + source-owned BNWN Radio HUD/voice cascade”** and decide whether a single source-pinned *non-live* fixture belongs under the existing World/Resident/Media/Audio owners. No automatic promotion or merge.
