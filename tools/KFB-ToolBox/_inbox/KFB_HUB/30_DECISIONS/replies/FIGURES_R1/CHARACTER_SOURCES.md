# Character sources · kfb.character/1 R1 (WS0, 17.10.2026, V-394)

The source IDs `CS-xx` are used in `characters/*.character.json` (`src`) and in `CHARACTER_SCHEMA_R1.md`.

- **Repo paths:** given as `path @ branch (commit, date)`. Repo = `georg-doc/kayfabizarro`, refs fetched 17.10.
- **Local paths:** relative to `~/Dropbox/CLAUDE/` unless marked otherwise.
- **Booklet paths:** relative to `~/Dropbox/(DB) CS 2020 Krazy Karnikl/Krazy Kayfabizarro/PACKAGES & BOOKLETS/`. In those paths, `MD/` = `MD BOOKLETS (drafts)/` and `NIE/` = `fractal-almanac/MD NARRATIVE INTELLIGENCE ENGINE/`.

Read-only search. `KFB Open World/` was not touched and nothing was pushed.

## KFB_HUB (register and WS0 replies)
| ID | Path | Date | Gist |
|---|---|---|---|
| CS-01 | `KFB_HUB/30_DECISIONS/DECISIONS.md` | 17.10. | Register. Entries used here: V-218/V-222/V-229 (openers, place-scene policy per figure), V-231–V-235/V-266/V-275 (triplet rules), V-261/V-267 (alien suits, Rig_Medium), V-269 (GothGirl in F-4), V-294 (UFO TARDIS hub, abduction), V-295 (Hunky/Dory names and mishearings), V-298 (3–4 beat-timed dance moves), V-308/V-324 (voices), V-320 (kart), V-344 (FB stand-up intro), V-349 (Brain-Cyborg), V-359/V-365 (Pharaoh duet), V-380 (Norman), V-386/V-387 (character light), V-394/V-395 |
| CS-02 | `…/replies/FIGURES_R1/figures/*.figure.json` | 17.10. | Figure cards (appearance), with aliases, role, voice and performance hints |
| CS-03 | `…/replies/voice_casting.r1.json` (+ `VOICE_CASTING_R1.md`) | 15.10. | Kokoro casting for 34 figures: FB am_michael, GothGirl bf_emma, Hunky onyx60+george40, Dory isabella60+bella40, Orc fenrir50+lewis50, plus golden lines. No entry for the mummies, Norman or Brain-Cyborg |
| CS-04 | `…/replies/META_NARRATIVE_R1.md` | 15.10. | Fluff-Genesis canon classes (fixed / proposal / open) for Hunky, Dory, Academy and UFO, plus 7 open questions |
| CS-05 | `…/replies/WS0_GLOBAL_INTENT_ROLE_CONSCIOUS_RESIDENTS_R1_2026-10-15.md` | 15.10. | "Cosmic casting" world logic (role knowingly played with full heart), on-duty / off-duty registers, Orc vs toy soldier test concept |
| CS-06 | `…/replies/LIGHT_MODEL_R2.md` | 17.10. | Rule 11 (warm character light), B1 light per story mode (Comic … Forbidden), B2 spot / follow / disco |
| CS-07 | `…/replies/WSO_CLIP_CATALOG_R1.md` + `WSO_CLIP_CATALOG_R1/clip-catalog.json` | 16.10. | Clip names (KayKit 1.1, KFB Motion Library M+L): dances `kfb_dance_*`, `kfb_idle_orc_a`, emotion map |
| CS-08 | `KFB_HUB/30_DECISIONS/MOTION_GUIDE_R1.md` | 16.10. | gait_v157 values, `applyEmote`, `presentationHints` per resident, FB 47 bones (ear acting) |
| CS-09 | `KFB_HUB/40_AUDIO/pharaoh_piledriver__suno_01a/performance/pharaoh_piledriver__suno_01a.performance.json` | 17.10. | kfb.performance/1: mummy_male / mummy_female stem roles and clip cues per bar |
| CS-10 | `…/replies/BRIEF_PERFORMANCE_DUET_P1.md` | 16.10. | P1 mummy duet: male = light skin and male hairline, female = dark face and white eyes; mouth per voice; KFB_NATIVE face |
| CS-11 | `…/replies/TRIPLET_SET_SPEC_R2.md` | 15.10. | Triplet rule R2 (opener pool, "Welcome to", "Stay Fluffy!") |
| CS-12 | `…/replies/BRIEF_WSA_NORMAN_TOOLBOX_R1.md` | 17.10. | Norman ToolBox brief; asks for a story note "world logic first" (CtP, crash-test dummy, alien test subject) |

## Repo `georg-doc/kayfabizarro`
| ID | Path @ ref | Date | Gist |
|---|---|---|---|
| CS-20 | `skills/chat/workflows/S1_RESIDENT_PREP_2026-10-04/resident-lean-card.v0.2.schema.json` + `residents/goth-girl.card.json` @ coworker/coordination-plan-2026-10-04 (7fce186d6) | 05.10. | **Structural basis.** `kfb.resident-lean-card/0.2`: body, archetype{jungDrive, journeyFunction, frictionEngine}, clamps (H&D shape), cards, speech, social, memory; fields {v, src, status}. GothGirl filled |
| CS-21 | `skills/chat/workflows/KFB_TOWN_RESIDENT_SOCIAL_MEMORY_2026-09-28/RESIDENT_BASE24_ARCHETYPE_MAP_2026-09-29.md` @ chatgpt-web/town-resident-social-memory-2026-09-28 (3dc71f0d2) | 29.09. | Base-24 archetypes: FB = Herald/Guide (outside the 24), GothGirl #06, Orc Brute #21. Also the lean-card field list (§8) |
| CS-22 | `…/RESIDENT_SIGNATURE_DECKS_2026-09-28.md`, same branch | 28.09. | `ResidentDeckProfile` (signatureDeckRef, stance, signatureCardRefs, deckGoal); "deck knowledge is not Lean Memory" |
| CS-23 | `…/RESIDENT_DANCE_CULTURE_2026-09-28.md`, same branch | 28.09. | Dance auditions: FB DJ/MC Hip Hop A · Wave · Locking; Orc Band leader `orb.bounce` |
| CS-24 | `skills/chat/workflows/KFB_CHATTERBOX_TRIPLET_CURATOR_2026-10-04/TRIPLET_POOL_SEED_20.json` @ planning/chatterbox-triplet-curator-site-2026-10-04 (886b8e581) | 05.10. | Signature pool `signatureOf`, `residentWeights`, operators bingo / bongo / boggle / bloedsinn. Signatures exist only for lorekeeper, goth-girl, clown and witch |
| CS-25 | `tools/KFB-ToolBox/_inbox/KFB_CHATTERBOX_STUDIO_CLAUDE_DESIGN_SESSION_CUT_2026-10-05_r2/lib/triplet-stage/donor/resident-chat-ensemble-data.mjs` @ main (30558ae3b); Lab copy `src/chatter/vendor/` (13.10.) | 05.10. | `kfb.resident-conversation-profiles/0.1-candidate`: GothGirl authoring, attitude, knowledgePolicy, chatterBoxAdapter (presentationHints), 4 signature triplets |
| CS-26 | `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/SITE_GODMODE_LEAN_MEMORY_ARCHITECTURE_2026-10-04.md` @ main (d7db7db70) | 04.10. | Lean Memory layers A–F (§10) and persistence schemas PLAYER_SAVE … JOURNEY_ENTRY (§11); Fractal Almanac HUD (§12) |
| CS-27 | `…/GOLDEN_JOURNEY_MVP_2026-10-04.md` @ main (3271450d6) | 04.10. | Golden journey example: Demon Lord song heard to the end → MomentReceipt / Journey entry |
| CS-28 | `skills/chat/KFB_MUSIC_COLLECTION_DISCOVERY_LEAN_JOURNEY_V0_1_2026-10-11.md` @ commit cb4e9ec1c (planning/kfb-fluff-crafting-almanac-ideation-2026-10-09) | 11.10. | Lean Memory Journey: all discoveries via Lean Memory / Journey; NPC_TAPE_GIFT, BAND_SONG_COMPLETED (concept labels) |
| CS-29 | `kfb-hub/stage/town/resident-social-memory-01/resident-social-memory.mjs` @ work/resident-social-memory-01-2026-09-28 (75a845018) | 28.09. | Runtime `kfb.resident-social-memory/1`: per-resident memory, thread, interactions, journey-event receipts |
| CS-30 | `skills/chat/recovery/KFB_FOUR_ISLAND_STORY_RECOVERY_2026-10-08.md` @ main (45e4905b5) | 08.10. | Georg clarification §7.1: Hunky = evil alien overlord / reality janitor (Fluff harvest), Dory = former high-socialite partner. §4.2 Orc Band singer |
| CS-31 | `skills/chat/UFO_HUNKY_DORY_WORLD_EVENT_PREP_2026-10-06.md` @ main (1a87cddf9) | 06.10. | UFO world event (arrive, beam, abduct, return); Hunky/Dory may stay offscreen in V1 |
| CS-32 | `skills/chat/workflows/KFB_CHATTERBOX_VOICE_V1_2026-10-08/` @ planning/kfb-chatterbox-voice-layer-v1-2026-10-08 (4f7142356, PR #379) | 14.10. | Voice layer (real-pool adapter). Listed only, not read in this pass |
| CS-33 | `tools/KFB-ToolBox/eye-rig-batch/docs/WS0_HANDOFF_NORMAN_2026-10-17.md` @ toolbox/eye-rig-batch-2026-09-18 (5af47c0da) | 17.10. | Norman: canonical series role from CtP / Hunky & Dory; crash-test dummy look is only a starting point |
| CS-34 | `tools/KFB-ToolBox/_inbox/KFB Elisa B-Day Reference+Mockups/kfb-pet-gothgirl.json` @ main (3fa839760) | 16.09. | Georg's GothGirl Pet Studio save (Elisa birthday set) |
| CS-35 | `media/kfb/{Pharaoh_Piledriver, FrizzleBob_s_Mission_Control, FrizzleBob_s_Ego_Mania_NARCISSIST, FrizzleBob_s_KayfaBizarro_Kompendium_ELENDER_WICHT_INSULTS}*.pdf(.json)` @ main | — | Deck files exist. No `sonic_slaughterhouse` deck file found under that name |

## Local Dropbox
| ID | Path | Date | Gist |
|---|---|---|---|
| CS-40 | `hunky-dory/BRIEFING.md` | 17.05. | `hd-character/v1` (meta, voice, psychology{failure_loop, trigger_words, defense_mechanism}, relationship{pair_id, dynamic_axes, baseline_heat}, emergence); hunky.json / dory.json values; running_memory.json; Authority Report |
| CS-41 | `CritEngine/inbox/HUNKY_DORY_CtP-JSON-v6-5-2.json` + `HUNKY_DORY_CtP-YAML-v6-5-2.yaml` | 27.05. | Cancel This Planet v6.5.2: roles, voices, triggers and archetypes for hunky / dory / norman (+ GodGPT, MephistoBro); relationship_dynamics; meta_conflict_awareness; ironic_victory_conditions; character_state_machine |
| CS-42 | `KFB_RESIDENT_ATLAS_SESSION_CUT_2026-10-04_r1/data/cast.js` | 04.10. | Resident Atlas cast: townRole, habitatIntent, activity, relationships. Covers goth-girl, orc-brute, mummy (NPC_SETTINGS_01 · MUMMY-01), prototype-pete, … |
| CS-43 | `KFB Island Worldbuilder Lab/src/island/spec.ts` | 11.10. | Pyramid island: Mummy_A sits on the sarcophagus, Mummy_B holds the ankh (Atlas S17 MUMMY-01); KFB Town deck `frizzlebob_s_mission_control` (zone deck, not FB's) |
| CS-44 | `KFB Island Worldbuilder Lab/docs/SPEC_CHARACTER_INTEGRITY_R1.md` | 09.10. | Earlier proposal `kfb.character-card/1` (personality ref, voice chatterbox id, per-world variants). Predecessor of this schema |
| CS-45 | `KFB Island Worldbuilder Lab/docs/KFB_LEBENSSCHICHT_PLAN_R1.md` | 12.10. | activities[], repertoire[], beat bus; memory only in the save game (`relationshipBand`) |
| CS-46 | `KFB Island Worldbuilder Lab/src/world/organ/islands-npc.ts` + `public/assets/figures-b2/catalog.json` | 13.10. / 11.10. | Island NPC runtime: GothGirl bubble tint `#9a7cc4`, runtime memory of the last 4 triplets; figure lid/skin colours |
| CS-47 | Skill `anthropic-skills:frizzlebob-kayfabizarro` (`SKILL.md`, local-agent-mode skills plugin) | — | FB voice engine: 7 modes /fixer /analyst /carny /bedside /rapgod /mensch /snark; Layer Zero bans |
| CS-48 | `Frizzlebob fractal almanac BRIEFING anchor v2/3D TableDiorama KFB + PET Editor + PDF VIewer/LIVING_KFB_MED_UNIVERSE.md` | 25.07. | FB worlds: Fairground Hub host, Doc FrizzleBob (MED, private IP), Elisa PolyGarden |

## PACKAGES & BOOKLETS
| ID | Path | Date | Gist |
|---|---|---|---|
| CS-50 | `MD/02 kayfabizarro_frizzleBob-almanac_v01.md` | 01.03. | Almanac foreword: persona title, "Howdy, friend. Uncle FrizzleBob here.", Almanac as time capsules, "Stay fluffy. BLÖDSINN." |
| CS-51 | `MD/02 README - FrizzleBob's Fractal Almanac v4.0.md` | 11.02. | Same identity; "Dispatches from the Infinite Canvas" |
| CS-52 | `NIE/engine_prompts/frizzlebob_modes/frizzlebob_overview.md` | 08.03. | FB v2.9 (20 modes, dials, Rent Rule); Hunky = technocratic alien administrator, Dory = empathic alien saboteur |
| CS-53 | `NIE/engine_prompts/mnemosyne_quill_flows.md` | 07.03. | FB = metaphysical rabbit detective, "FrizzleBob out."; Flow 7 Hunky-Dory dialogue (panels, Katzenjammer footer) |
| CS-54 | `MD/KAYFABIZARRO PROMPTS v3.0/KAYFABIZARRO_KOMPENDIUM_SYSTEM_PROMPT_v3.md` | 15.04. | FB = yellow cartoon rabbit, dry, observational, parentheses signature; rendering rule |
| CS-55 | `MD/KAYFABIZARRO PROMPTS v3.0/MEDKAYFAB_MASTER_PROMPT_v3.md` | 15.04. | Doc FrizzleBob: lab coat, narrator / mentor / Master of the Arena, "Stay Fluffy." |
| CS-56 | `MD/KAYFABIZARRO PROMPTS v3.0/KAYFABIZARRO_NOTEBOOKLM_SLIDE_PROMPT_v3.md` | 15.04. | FB exclamations: KayfaBIZARRO! / BLÖDSINN! / HUMBUG! / KayfaBINGO! / What the FLUFF?! |
| CS-57 | `2026-05-23_NIE-Handover-for-Opus.md` | 23.05. | CtP mapping LordHunky (overlord) / LadyDory (witness) / NormanNPC (inquisitor) |
| CS-58 | `MD/45 FrizzleBob’s_Fractal_Almanac menschenbilder.md` | 17.02. | Themes: brain as computer, transhumanism. Thematic donor for Brain-Cyborg, not a character |
| CS-59 | `MD/42 COMIC SEMINAR Erlangen 2026 … v4.0.md` | 16.02. | "Hilfe, ich bin ein Mensch" cast (rabbit/Locke, cat/Rousseau, bear/Hobbes, wolf/Machiavelli, owl/Socrates). None of the 9 characters |

## Lab docs (Worldbuilder Lab)
| ID | Path | Date | Gist |
|---|---|---|---|
| CS-60 | `KFB Island Worldbuilder Lab/docs/content-atlas/ATLAS_A_DECKS_KORPUS.md` §5.5 | 09.10. | Points to `FRIZZLEBOB_CHARACTER_BIBLE_v1.md` LOCK (yellow rabbit, cheeky, anti-cute, never humanoid, dungarees). The Bible file itself was not found locally |
| CS-61 | `KFB Island Worldbuilder Lab/docs/PROJECT_STATE.md` l.121 | 12.10. | The Bible's "FB is the only recurring figure" rule applies only to comics and decks |

## Not found (searched)
- Bios for GothGirl, the mummies, Orc Brute, Norman (KFB) and Brain-Cyborg.
- Per-character light presets: only the global B1 table exists.
- Assigned signature decks for anyone except the GothGirl candidate.
- Kokoro voices for the mummies, Norman and Brain-Cyborg.
- Any personality material on the mummies in the booklets.
- "Lead Memory": the only hit is V-394. All sources say **Lean** Memory, so "Lead" is probably a voice-input mishearing.
