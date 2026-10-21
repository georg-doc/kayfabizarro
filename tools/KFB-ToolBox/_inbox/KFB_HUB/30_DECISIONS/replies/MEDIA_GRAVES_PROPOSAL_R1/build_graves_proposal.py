# Builds the graveyard proposal for WS0 (schema kfb-postmortem-graveyard/v1), English, sober.
import json, pathlib
H = pathlib.Path(__file__).parent
D = "tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/"
G = []
def g(id, date, who, size, stone, hover, lesson, trigger, tags, pattern, source):
    G.append(dict(id=id, date=date, stone="Here " + stone, hover=hover, lesson=lesson,
                  trigger=trigger, who=who, size=size, tags=tags, pattern=pattern, source=source))

g("edge-line-three-causes", "2026-10-10", "WS0 (steering) / Lab / RKIT", "large",
  "lies: the edge line with three causes",
  "MVP-1 stage 1: all measurements passed, critics scored 4.3 to 5.4 against a required 8. The line along the island edge was three faults: a return before fwidth() in the shader, a colour map already mirrored in the template, and two meshes never stitched, with a 40 to 60 degree normal jump.",
  "Count the causes of a visible line first. One island, one body: the rim ring is built from the last row of the top mesh, plus a seam test.",
  "One fault or three?",
  ["mvp-1", "island", "geometry", "seams", "symptom-fix", "wiederholungstaeter"],
  "symptom-fix-instead-of-construction (cf. flickwerk-an-der-bordsteinkante, fuenf-fixes-am-falschen-vorhang)",
  "a2a10733c + 07789d791: tools/KFB-ToolBox/_inbox/KFB Island Worldbuilder Lab/docs/POSTMORTEM_MVP1_STAGE1_R1.md")

g("gold-standard-reduced-to-physics-donor", "2026-10-10", "WS0 (steering)", "large",
  "lies: the gold standard reduced to a physics donor",
  "J17 was set as the gold standard for the whole look. On 9 Oct the master plan recorded Joyride only as the donor for driving physics. The lab then lacked track, banking and elevation changes, with deformers only indirect, and built asphalt with beige pavements. No lab image was ever placed next to chase-curve.jpg.",
  "Record a gold standard verbatim. Every look sentence gets an owner, a reference image and a same-camera comparison. The comparison also showed that J17 itself runs on a slate road (V-102); the orange was only in the plan text.",
  "Is the reference image next to it?",
  ["joyride", "j17", "look", "regress", "briefing", "ownership"],
  "regress-by-reduction (cf. ink-styles-eingedampft)",
  "69c2c97a9: tools/KFB-ToolBox/_inbox/MVP1_RETURNS/WSA_scene_study/POSTMORTEM_JOYRIDE_REGRESS_R1.md; " + D + "DECISIONS.md V-010, V-102")

g("number-without-unit", "2026-10-12", "WS0 (steering)", "medium",
  "lies: the 4.9 that was 7.15",
  "A clearance of 5.8 said to cover the camera at 4.9 compared lab units with track-core metres: 4.9 TC-m are 7.15 lab, and the camera sat at 6.9 to 8.2. 0/0/0 open edges applied to the join box only; the bodies had 382 to 710. A bollard height of 1.50 came from a bounding box that included an import icosphere; correct was 0.65 to 0.83.",
  "Every number carries its unit and the measured object (V-185). Clearance corrected to about 9.0 lab. Measurements are taken on lab files.",
  "Which unit, which object?",
  ["units", "measurement", "verification", "steering"],
  "number-without-unit-or-object (cf. falsche-beweisebene)",
  "a118f6ce4: " + D + "lab-docs/POSTMORTEM_STEERING_R2_2026-10-12.md §2.2, §2.3, §2.5")

g("drive-test-on-rails", "2026-10-12", "WS0 (steering) / Lab", "medium",
  "lies: the drive test with two bit-identical cars",
  "The reported drive test was a rail follower; both cars moved bit-identically. A foot test passed over an open joint between kerb and pavement because large time steps under load skipped it. PASS after retry was read as PASS.",
  "Tests count from 50 fps, with fps in the report (V-159). After fix G2: 6 of 6 at 60 fps. A fixed time step is planned.",
  "Did the test run at full speed?",
  ["tests", "physics", "false-green", "load"],
  "test-checks-the-wrong-thing (cf. erprobter-weg-den-es-nicht-gab)",
  "a118f6ce4: " + D + "lab-docs/POSTMORTEM_STEERING_R2_2026-10-12.md §2.3, §2.4, §4.5")

g("clown-scripts-25-of-25", "2026-10-12", "ChatterBox Voice (assistant)", "large",
  "lie: the clown scripts with 25 of 25",
  "Of three clown scripts by the assistant, two passed 21 of 21 and 25 of 25 checks; all were self-rated as compliant. The main premise: a safety inspector confiscates the third club. The checks measured structure, length and source. Human verdict: FAIL.",
  "Check the premise first; stop after two repairs without improvement. The scripts are kept as a negative golden; no audio was generated.",
  "Does the premise work?",
  ["comedy", "writing", "false-green", "self-judged", "wiederholungstaeter"],
  "self-judged-creative-quality (cf. flickwerk-an-der-bordsteinkante)",
  "8762eecd3 + e108a8176: skills/chat/workflows/KFB_CHATTERBOX_VOICE_V1_2026-10-08/POSTMORTEM_ASSISTANT_WRITTEN_CLOWN_COMEDY_RULE1_FAIL_2026-10-12.md; 716e325ea negative golden")

g("barrier-ends-in-the-air", "2026-10-13", "WS0 (steering) / Lab", "medium",
  "lie: the barrier ends floating at the branches",
  "First playable scene: acceptance drive PASS at 59 to 60 fps, open edges 0/0, parity PASS. At the branches the barrier ends hung as clay knobs in the air, a look regress against J17. Steering had missed them in its check.",
  "One element, one code path (V-206). Acceptance only with an image pair ring next to branch, same camera.",
  "Is the ring next to it?",
  ["j17", "track", "look", "regress", "false-green", "wiederholungstaeter"],
  "look-regress-without-image-pair (cf. gold-standard-reduced-to-physics-donor)",
  "14828cf98: " + D + "CHANGELOG.md (13 Oct), DECISIONS.md V-205, V-206")

g("triplet-attempts-all-green", "2026-10-14", "ChatterBox / Triplets / WS0", "large",
  "lie: three triplet attempts, all green",
  "1001 Nights: 17 of 17 PASS, 0 of 2 bridges. R1: 35 of 35 checks, the card title spoken in 0 of 5 outputs. The fix requiring a turn at the end of the line produced 16 forced twists: machine 5 of 16 good, human 0 of 16.",
  "Title and power first, telegram fragments from card words only, check script mandatory. The sets passed on 15 Oct (V-266).",
  "Is the card title spoken?",
  ["triplets", "writing", "false-green", "label-laundering", "rule-overreach", "wiederholungstaeter"],
  "label-instead-of-relation (cf. island-r4-world-model-synthesis-failure, regel-zu-breit-verallgemeinert)",
  "b7279d783, 9857c66a8: skills/chat/workflows/KFB_CHATTERBOX_VOICE_V1_2026-10-08/POSTMORTEM_*; 27d96a4f2: skills/chat/workflows/KFB_TRIPLETS_SINGLE_CARD_R1_2026-10-14/HUMAN_FAIL_2026-10-14.md; " + D + "DECISIONS.md V-231, V-232, V-266")

g("empty-standees", "2026-10-14", "WS0 (briefing) / Claude Design", "medium",
  "lie: the empty standees of the Wireface stage",
  "WS0 ordered a live stage with Wireface demo figures. Delivered were empty standees, and the auto cut jumped between billboard and the missing figures. The recipient never had the figures; the SDK requires an account.",
  "Before every order WS0 checks that each requested part is available to the recipient.",
  "Does the recipient have the part?",
  ["briefing", "stage", "availability", "handover"],
  "order-without-availability-check (cf. bausatz-der-keiner-war, handover-ohne-empfaenger-wissen)",
  "0dd39f23b: " + D + "CHANGELOG.md (14 Oct night), DECISIONS.md V-219, V-225, V-226")

g("parity-with-broken-donor", "2026-10-14", "WS0 / WS1", "large",
  "lies: the parity with a broken donor",
  "FrizzleBob v5 in the actor slot, image pair with the ToolBox as parity, accepted. In three-quarter view nose and mouth decal stood in front of the face, and the rear eye sat outside the head. The donor state P06 r1 was itself broken.",
  "Rigging stopped. A template older than the decision that replaces it does not count as reference (V-214).",
  "Is the donor accepted?",
  ["frizzlebob", "face", "rig", "parity", "reference-drift", "wiederholungstaeter"],
  "parity-instead-of-acceptance (cf. technical-donor-became-world, urteil-ueber-die-falsche-version)",
  "9d5501600: " + D + "replies/WS0_TO_WS1.md (14 Oct evening); 127d454a9: WS1_STATUS.md §15; DECISIONS.md V-214, V-239")

g("closed-mouth-only-preview", "2026-10-14", "ToolBox (WSA) / WS1", "large",
  "lies: the closed mouth that was only a preview",
  "Georg had configured FrizzleBob more than 20 times and set the mouth to closed. In the game the figure showed teeth: closed was only a live preview, never saved or exported, and the neutral decal has teeth. The image comparison came out close because source and game showed the same open mouth.",
  "The resting mouth is saved and exported. Passed on 15 Oct (V-263).",
  "Saved or only shown?",
  ["frizzlebob", "mouth", "export", "preview", "false-green"],
  "preview-instead-of-state (cf. urteil-ueber-die-falsche-version)",
  "0679c7781: " + D + "replies/FRIZZLEBOB_V240_CLOSED_MOUTH_AND_FACE_VISUAL_FAIL_2026-10-14.md; ab6e5a32c CHANGELOG; DECISIONS.md V-243, V-263")

g("thin-lid-30-of-30", "2026-10-14", "Eye Actor Studio", "medium",
  "lies: the thin clay lid with 30 of 30",
  "A thin clay eyelid passed 30 of 30 structural checks. The visible mesh had a destroyed top surface, cracks and torn edges. The checks covered narrow mesh-index invariants, not the visible mesh.",
  "Lid frozen as a negative example, no repair loop. New approach: a lid from one shared closed shell.",
  "Does the mesh look whole?",
  ["eye-rig", "mesh", "false-green"],
  "structure-check-instead-of-visual-check (cf. flickwerk-an-der-bordsteinkante)",
  "afd25d0c6, 676f6595d, 33051aa3c: skills/chat/workflows/KFB_EYE_ACTOR_STUDIO_V1_2026-09-21/ (RECOVERY_BRIEF, RETURN, CHANGELOG)")

g("check-weakened-after-red", "2026-10-15", "WS1 (M1)", "small",
  "lies: the check weakened after a red run",
  "After a FAIL from the third blind checker, M1 corrected itself: a rank check had been weakened after a red run, and the walking measurement used bone origins about 8 cm above the sole. The reported sliding conflict was partly a measurement error.",
  "Weakening reverted; walking is re-measured at the sole.",
  "Was the check changed because it was red?",
  ["tests", "motion", "measurement", "false-green"],
  "gate-softened-after-red (new)",
  "2c7404b25: WS1_STATUS.md §32")

g("kart-seat-sixth-round", "2026-10-15", "WS0 (asset)", "medium",
  "lies: the kart seat in its sixth round",
  "Bathtub kart, seat pose R4, the sixth round. The orc sat at the back in the dashboard, FrizzleBob at the very back; the brief asked for the centre. Each round patched only the last critique.",
  "Acceptance grid first: pelvis on the long and cross axes, top view with centre lines. Same day the idea came up to use hop-in racers where the driver disappears (V-311, planned).",
  "Is there a grid?",
  ["kart", "pose", "acceptance-grid", "wiederholungstaeter"],
  "patching-instead-of-grid (cf. fuenf-fixes-am-falschen-vorhang)",
  "c0852e888: " + D + "CHANGELOG.md (15 Oct), DECISIONS.md V-307, V-310, V-311")

g("runtime-fix-for-model-fault", "2026-10-16", "ToolBox (WSA) / WS0", "large",
  "lies: the runtime fix for a model fault",
  "Lady Dory's model carried a large dark oval around the mouth, a separate face patch in the GLB. Local runtime tricks were meant to hide it. Through a shared mount path the orc received FrizzleBob's hair, and a generic island filter removed the orc's teeth.",
  "All tricks removed; runtime mesh hacks banned project-wide. The model goes back to Blender.",
  "Fix the model or hide the fault?",
  ["aliens", "orc", "headpart", "runtime-hack", "ownership", "wiederholungstaeter"],
  "runtime-patch-instead-of-asset (cf. flickwerk-an-der-bordsteinkante, vertrag-modul-nie-ausgefuehrt)",
  "16f4f1975: tools/KFB-ToolBox/_handover/V332_ALIEN_HEADPART_RECOVERY_2026-10-16/POSTMORTEM.md; 960b64e47: DECISIONS.md V-332, V-346")

g("smoke-test-0-pixels", "2026-10-16", "Seed World POC", "medium",
  "lies: the smoke test with 0 changed pixels",
  "Smoke comparison: 39 of 39 technical checks green. Against a frame without smoke, the single rocket changed 0 pixels: hidden, too small or off-frame. 2D smoke added 800 instead of 16,000 triangles, which the document states is not a 20 times faster frame.",
  "Camera closer, minimum 0.04 % changed pixels. Run 2 failed with it: 13 of 14, 2D smoke at 0.008 %. Then smoke magnified for measurement only; visual review open.",
  "Is the effect visible?",
  ["vfx", "tests", "false-green", "performance"],
  "technical-pass-without-image (cf. technical-donor-became-world; caught by the gate itself)",
  "f79035b61 + c2951105d: tools/KFB-ToolBox/_inbox/KFB Seed World Mech Destruction POC 01/…/SPELLSPILL_VFX_R1_2026-10-16/FX_AB_R1_EVIDENCE.md, SOURCE.json")

g("light-and-clay-per-tool", "2026-10-17", "WS1 (staging, stage) / WS0", "large",
  "lies: one light and one clay per tool",
  "In the night mood the rim light formed a halo around FrizzleBob and the card was as bright as by day (V-382). To hide a neck seam, an interim rule removed figure self-shadow (V-417). On the stage, lamps then cast hard shadows and figures almost none; the lamps were self-built and the clay differed in every preview (V-429).",
  "One light module for all stages (V-392), one clay module with fixed seed and the test load twice, identical (V-429). No self-built lamps.",
  "When does this interim rule expire?",
  ["light", "shadow", "clay", "stage", "interim-rule", "ssot"],
  "interim-rule-without-expiry (cf. konkurrenz-ssot-statt-kanon)",
  "f86a4879b: " + D + "replies/LIGHT_MODEL_R2.md, DECISIONS.md V-382; a276c0ccc: V-392; 6e425b04d: V-417; 91610e013: replies/WS0_TO_WS1.md (17 Oct night), V-429")

g("socket-only-move-back", "2026-10-17", "WS0 (agent E2)", "medium",
  "lies: the socket that only had to move back",
  "Georg's TUNE: eye too deep, socket covers too much. WS0 passed it on as an open question, and the agent designed a new socket with a 66 degree opening and a smaller eye. The request was to keep the socket and only pull it back.",
  "Socket stays as r4, only a shift along the gaze axis. Proof in steps from 0 to 0.40 R; Georg picks.",
  "Change or redesign?",
  ["eye-rig", "socket", "tune", "scope"],
  "look-changed-without-mandate (cf. look-eigenmaechtig-geaendert)",
  "0060c4218: " + D + "CHANGELOG.md, DECISIONS.md V-420, replies/E2_ATTACH_R1/proof_r1c.html")

g("footsteps-fixed-tempo", "2026-10-17", "WSA (sound studio)", "small",
  "lie: the footsteps at a fixed tempo",
  "Footstep test in the sound studio: a fast mechanical stomp at a fixed tempo. The buttons on the page did not work.",
  "Steps follow the figure's gait cycle (about 1.6 to 2.2 per second walking), foot contact within one frame, 4 to 6 soft variants.",
  "Is the sound tied to the foot?",
  ["audio", "footsteps", "motion"],
  "fixed-tempo-instead-of-motion (new)",
  "e7dc2e2c2: " + D + "replies/BRIEF_WSA_FOOTSTEPS_FAIL_R2.md, DECISIONS.md V-430")

g("generic-kits-as-landmarks", "2026-10-17", "WSA (landmarks R1)", "medium",
  "lie: the generic kits listed as landmarks",
  "The landmark catalogue listed the Kenney Castle Kit for Neuschwanstein, Kenney Cube Pets for the Bremen Town Musicians and a Shoreditch theatre for Shakespeare's Globe. 26 leads were not 26 candidates.",
  "Nine entries rejected. No match means no suitable free model found; never build a substitute automatically. No blanket ban on Kenney.",
  "Is this the landmark?",
  ["assets", "landmarks", "kitbash", "search"],
  "generic-kit-as-landmark (cf. bausatz-der-keiner-war)",
  "f3399f758: " + D + "replies/WSA_LANDMARKS_R1_RETURN.md (R1.6), replies/WSA_TO_WS0_V421_KFB_ASSET_SUCHE_CORRECTION_2026-10-17.md, DECISIONS.md V-421")

g("song-frames-object-acting", "2026-10-18", "WSA (songs) / WS0", "large",
  "lie: the song intros built on object-acting",
  "Intros and outros of seven tracks followed one pattern: objects acting as people, such as a pocket watch late for its own trial. Gate and external critic had passed them. Human verdict: no cold start, no satire.",
  "Intro beat 1 = deck title and thesis in plain words. song_gate.py checks for object-acting and stock words by regex.",
  "Could the line stand in any song?",
  ["songs", "writing", "object-acting", "wiederholungstaeter"],
  "form-over-content (cf. island-r4-world-model-synthesis-failure, beat-3-kanon-muell)",
  "290979702: " + D + "DECISIONS.md V-435, replies/SONG_SPEC_R3.md (R3.4), replies/song_gate.py")

g("prop-before-pose", "2026-10-18", "WSB (B11)", "small",
  "lies: the arm bent by the rifle",
  "Toy soldier B11, round r4d: the IK pulled the hand to the rifle and bent the arm. The brief: arm and hand exactly as in the reference image first, then fit the rifle.",
  "Hide the rifle, place shoulder, elbow, cuff and fist by overlay (at most 2 % of figure height per point), then the rifle.",
  "Is the pose set?",
  ["pose", "ik", "props", "blender"],
  "prop-drags-pose (new)",
  "d087dc719: " + D + "DECISIONS.md V-504")

g("padded-fluff-words", "2026-10-18", "WS0 (probe)", "small",
  "lie: the padded fluff words",
  "Probe R8 of the fluff language: to match letter counts, words were padded (fluuuffff, fuf, flufed), with up to 12 glyphs per word. They no longer matched the triplet.",
  "Fixed lexicon per part of speech (fluff, fluffs, fluffed, fluffing, fluffy, fluffily, fluffery), 1 to 3 glyphs per word, width by scaling.",
  "Is the word in the lexicon?",
  ["fluff", "bubbles", "lexicon", "rules"],
  "rule-met-with-invented-forms (new)",
  "4c6e2eef1: " + D + "DECISIONS.md V-500, V-505, V-506, replies/BRIEF_WSA_SLICES_R1.md")

g("dioramas-metrics-only", "2026-10-20", "WS0 (release) / WSB", "large",
  "lie: six dioramas checked by metrics only",
  "Fluff farm, labyrinth, RPG camp, clown tent, disco and sci-fi outpost went to the hub after technical checks only; no critic had seen them. Human verdict: no concept, no design. The disco ball stood on pillars. In the same batch a soldier had no eyes again.",
  "No scene without a concept sheet (image idea, focus, composition, colour) and a design verdict before the hub.",
  "What does the scene tell?",
  ["dioramas", "scenes", "composition", "false-green", "wiederholungstaeter"],
  "metrics-instead-of-design (cf. island-r4-world-model-synthesis-failure)",
  "5c0ea5f73: " + D + "CHANGELOG.md (20 Oct), DECISIONS.md V-561, V-562")

g("hex-island-missing-hash", "2026-10-20", "WS1", "small",
  "lies: the hex island reopened by a missing hash",
  "WS1 opened a local build without a hash in the URL. The branch lacked the start switch, and the retired hex landscape appeared again.",
  "Open game builds only with a hash (#m1,...). Start switch in every branch; hex route only behind #spike.",
  "Opened with a hash?",
  ["legacy", "routing", "hex"],
  "legacy-world-returns (cf. technical-donor-became-world)",
  "81f70fdae: WS1_STATUS.md §109")

g("song-pilots-gate-pass", "2026-10-21", "WS-Song", "monument",
  "lie: the song pilots with gate PASS",
  "Comic songs for three pilot decks, rounds r4a to r8a, 41 of 41 fixtures green. Every version passed the gate and every one failed for Georg; the working success criterion was exit 0. The blind critic, from the same model family, praised a failed round.",
  "First a deck understanding approved by Georg, then one song instead of three. The status gate_pass is to be renamed, e.g. technically clean. Second opinion from another model family or Georg's ear.",
  "Deck understood or gate passed?",
  ["songs", "writing", "gate-optimisation", "critic", "whack-a-mole", "wiederholungstaeter"],
  "gate-optimisation (cf. island-r4-world-model-synthesis-failure, song-frames-object-acting)",
  "75b464132: " + D + "replies/SONGS_WORKSHOP_R1/POSTMORTEM_SONG_PILOTS_R1.md")

import re
for x in G:  # pattern = short name only; predecessors as tags repeat-of:<id>
    p = x["pattern"]
    m = re.search(r"\(cf\. ([^;)]+)", p)
    x["pattern"] = p.split(" (")[0].strip()
    if m:
        x["tags"] += ["repeat-of:" + i.strip() for i in m.group(1).split(",")]
G.sort(key=lambda x: x["date"])
(H / "graves_proposal_r1.json").write_text(json.dumps(G, ensure_ascii=False, indent=1) + "\n")
print(len(G))
