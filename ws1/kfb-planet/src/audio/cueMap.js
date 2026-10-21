// WS-Audio R1 (V-598) · Zuordnung Spiel-Ereignis → vorhandener Ton (nur echte Aufnahmen/ElevenLabs, nichts synthetisiert, V-448).
// owner: 'racer' = WSA-Racer (Motor-Gitter L1–L5, Flug P01–P06, F/H), 'combat' = WSA-Kampf (C01–C18), 'bank' = ElevenLabs-Satz über die Tonbank,
//        'ambience' = kfb-ambience.v1 (CC0, V-458), 'steps' = Schritte Audio Site 0.7.6, 'music' = Jukebox. gap = Ton fehlt (Liste an WS0).
// bank-Einträge: set = elevenlabs_r1/<set>, base = Dateistamm (Varianten _a/_b/_c werden gewechselt), gain (linear, zusätzlich zur Normalisierung), bus
// Dark Fluffer 0,8 m statt 1,1 m (WS0 V-616, Georg 21.10.: kleiner, passend zu KayKit) → Klänge 4 % höher (kleinerer Körper)
export const FLUFFER_PITCH = 1.04
export const CUES = Object.freeze({
  // ── Boden-Fahrt (M2EVENTS aus k2t / vehicleRig) ─────────────────────────────────────────────────────────────
  'drive.motor': { owner: 'racer', file: 'L1_idle · L2_low · L3_mid · L4_high · L5_overrun (Gitter nach Drehzahl, Schubabschaltung)', note: 'Drehzahl/Gang aus vehicleRig' },
  'drive.shift': { owner: 'racer', file: 'O1_upshift · O4_downshift_blip · O2b/O2c backfire' },
  'drive.overrun': { owner: 'racer', file: 'crackle-1…4 (Gas weg bei hoher Drehzahl)' },
  'drive.boost': { owner: 'racer', file: 'O5_boost (Boden) · P04_boost_ignite_a/b (Flug)' },
  'vehicle.driftBoost': { owner: 'racer', file: 'O5_boost' },
  'vehicle.takeoff': { owner: 'racer', file: 'F4_takeoff' },
  'vehicle.launch': { owner: 'racer', file: 'F4_takeoff' },
  'vehicle.fly': { owner: 'racer', file: 'F4_takeoff' },
  'vehicle.landing.hard': { owner: 'bank', set: 'debris_crash_r1', base: 'K03_belly_landing', gain: 0.8, loud: true },
  'vehicle.landing.soft': { owner: 'bank', set: 'debris_crash_r1', base: 'D06_dust_settle', gain: 0.55 },
  'vehicle.land': { owner: 'bank', set: 'debris_crash_r1', files: ['D05_fluff_land_a', 'D05_fluff_land_b'], gain: 0.6 },
  'vehicle.railImpact.hard': { owner: 'bank', set: 'debris_crash_r1', base: 'K01_car_crunch', gain: 0.85, loud: true },
  'vehicle.railImpact.soft': { owner: 'bank', set: 'debris_crash_r1', base: 'K06_cartoon_bonk', gain: 0.6 },
  'vehicle.nudge': { owner: 'bank', set: 'debris_crash_r1', base: 'K06_cartoon_bonk', gain: 0.35 },
  'vehicle.twoWheel': { owner: 'bank', set: 'debris_crash_r1', base: 'K02_wing_scrape', gain: 0.5 },
  'vehicle.trick': { owner: 'bank', set: 'throwables_r1', base: 'T03_throw_whoosh', gain: 0.6 },
  'vehicle.respawn': { owner: 'bank', set: 'beam_ufo_r2', base: 'B14_teleport_in', gain: 0.55 },
  // WS0 ws_audio_gaps_r1 (21.10., −16 LUFS): Untergrund unter dem Racer (Schleifen nach Tempo), Drift, Bremse
  'drive.surface.grass': { owner: 'bank', set: 'ws_audio_gaps_r1', files: ['R01_hover_over_grass_loop'], gain: 0.55, loop: true },
  'drive.surface.sand': { owner: 'bank', set: 'ws_audio_gaps_r1', files: ['R02_hover_over_sand_loop'], gain: 0.55, loop: true },
  'drive.surface.rock': { owner: 'bank', set: 'combat_av_fix_r2', files: ['R03_hover_over_rock_loop_v3'], gain: 0.55, loop: true, note: 'R03 v3 (lauter)' },
  'drive.surface.water': { owner: 'bank', set: 'ws_audio_gaps_r1', files: ['R04_hover_over_water_loop'], gain: 0.6, loop: true },
  'drive.drift': { owner: 'bank', set: 'ws_audio_gaps_r1', files: ['R05_drift_slide_loop'], gain: 0.7, loop: true, note: 'Rutschwinkel aus Lage gegen Fahrtrichtung' },
  'vehicle.driftCharge': { owner: 'bank', set: 'ws_audio_gaps_r1', files: ['R06_drift_charge'], gain: 0.6 },
  'vehicle.brake': { owner: 'bank', set: 'ws_audio_gaps_r1', files: ['R07_hover_brake_hiss'], gain: 0.7 },
  // ── Flug ───────────────────────────────────────────────────────────────────────────────────────────────────
  'fly.car': { owner: 'racer', file: 'P01_jet_thrust (thrust) · P02_turbine_fan (fan) · P05_antigrav_hum (Schweben) + P03_exhaust_rumble + F3_wind_rush_loop' },
  'fly.foot': { owner: 'racer', file: 'P05_antigrav_hum_loop_a/b + P02 + F3_wind_rush_loop nach Tempo (FrizzleBob-Schwebeflug)' },
  'fly.crash': { owner: 'bank', set: 'debris_crash_r1', base: 'K04_jetpack_tumble', gain: 0.8, loud: true },
  // ── Zu Fuß ─────────────────────────────────────────────────────────────────────────────────────────────────
  'foot.step': { owner: 'steps', file: 'digital-grass · foley-concrete (Platz) · sand · wet-clay (am Wasser) – Audio Site 0.7.6' },
  'foot.wade': { owner: 'bank', set: 'ws_audio_gaps_r1', base: 'S01_wading_steps', gain: 0.6, note: 'Schritte im Wasser (Fluss/Ufer)' },
  'foot.jump': { owner: 'bank', set: 'combat_av_fix_r3', base: 'L14_jump_hop', gain: 0.55, note: 'L14 Hüpfer (V-615)' },
  'foot.land': { owner: 'bank', set: 'creatures_r1', base: 'C01_clay_body_fall', gain: 0.5 },
  // ── Kampf (Obstgarten-Aktionen V/B/N; K10-Adapter für Arena-Module) ───────────────────────────────────────
  'combat.punch': { owner: 'combat', file: 'C03 brass_knuckles (Treffer) + C04 swing_whoosh · C12 tree_shake' },
  'combat.swing': { owner: 'combat', file: 'C04_swing_whoosh (kein Ziel)' },
  'combat.shoot': { owner: 'combat', file: 'C05_blaster_primary_a/b/c' },
  'combat.boltImpact': { owner: 'bank', set: 'combat_av_fix_r1', files: ['blaste_X07_bolt_impact_clay_a_v2', 'blaste_X07_bolt_impact_clay_b_v2'], gain: 0.7, note: 'WS0-Neuaufnahme X07 v2' },
  'combat.blast': { owner: 'combat', file: 'C08_explosion_small + C15_wood_splinter (Baum)' },
  'k10.fire': { owner: 'combat', file: 'C05 blaster · C06 rocket_launch (je Waffe)' },
  'k10.cast': { owner: 'bank', set: 'throwables_r1', base: 'T03_throw_whoosh', gain: 0.6 },
  'k10.release': { owner: 'bank', set: 'throwables_r1', base: 'T11_brickfish_throw', gain: 0.6 },
  'k10.contact': { owner: 'combat', file: 'C01/C02 punch · C10 hit_confirm · Material C15/C16/C17' },
  'k10.weaponDrop': { owner: 'bank', set: 'combat_av_fix_r1', files: ['L10_weapon_drop'], gain: 0.7, note: 'Combat-AV L10' },
  'k10.bomb': { owner: 'bank', set: 'throwables_r1', base: 'T05_cartoon_explosion', gain: 0.9, loud: true },
  'k10.fuse': { owner: 'bank', set: 'throwables_r1', base: 'T02_bomb_fuse_sizzle', gain: 0.5 },
  'k10.detonate': { owner: 'bank', set: 'detonator_r1', base: 'D04_big_boom', gain: 0.9, loud: true },
  // ── Combat-AV R1 (VFX/SFX-Sitzung, Prototyp ws1/combat-av-r1 @d408688, Bericht research/audits/COMBAT_AV_R1.md): Abgang je Waffe in Ebenen ──
  // files = genau die Dateien des Prototyps (statt Variantenwechsel über base); Pegel/Versatz/Tonhöhe stehen in LAUNCH unten
  'av.C05ab': { owner: 'bank', set: 'combat_r1', files: ['C05_blaster_primary_a', 'C05_blaster_primary_b'] },
  'av.C05c': { owner: 'bank', set: 'combat_r1', files: ['C05_blaster_primary_c'] },
  'av.C05ca': { owner: 'bank', set: 'combat_r1', files: ['C05_blaster_primary_c', 'C05_blaster_primary_a'] },
  'av.C05abc': { owner: 'bank', set: 'combat_r1', files: ['C05_blaster_primary_a', 'C05_blaster_primary_b', 'C05_blaster_primary_c'] },
  'av.X01': { owner: 'bank', set: 'blaster_r1', files: ['X01_blaster_shot_a', 'X01_blaster_shot_b'] },
  'av.X09a': { owner: 'bank', set: 'blaster_r1', files: ['X09_bolt_flyby_a'] },
  'av.X09ab': { owner: 'bank', set: 'blaster_r1', files: ['X09_bolt_flyby_a', 'X09_bolt_flyby_b'] },
  'av.X03': { owner: 'bank', set: 'blaster_r1', files: ['X03_charged_shot_a', 'X03_charged_shot_b'] },
  'av.M01ab': { owner: 'bank', set: 'melee_destruction_r1', files: ['M01_blade_whoosh_a', 'M01_blade_whoosh_b'] },
  'av.M01b': { owner: 'bank', set: 'melee_destruction_r1', files: ['M01_blade_whoosh_b'] },
  'av.T03a': { owner: 'bank', set: 'throwables_r1', files: ['T03_throw_whoosh_a'] },
  'av.T03b': { owner: 'bank', set: 'throwables_r1', files: ['T03_throw_whoosh_b'] },
  'av.enemy': { owner: 'bank', set: 'combat_r1', files: ['C04_swing_whoosh_a', 'C04_swing_whoosh_b'] },
  'av.gatlingLoop': { owner: 'bank', set: 'blaster_r1', base: 'X02_blaster_burst_loop', note: 'Gatling-Feuerstoß als Schleife (loopKeep), Combat-AV „nächster Schritt“' },
  'k10.bombThrow': { owner: 'bank', set: 'ws_audio_gaps_r1', files: ['K02_bomb_throw'], gain: 0.8 },
  'k10.rocketLoop': { owner: 'bank', set: 'ws_audio_gaps_r1', files: ['K01_rocket_flight_loop'], gain: 0.6, loop: true, note: 'Raketenflug (travel.rocket), sobald die Arena ihn meldet' },
  'impact.metal': { owner: 'bank', set: 'combat_av_fix_r1', files: ['ws_aud_K03_impact_metal_v2'], gain: 0.8, note: 'K03 v2' },
  'impact.glass': { owner: 'bank', set: 'ws_audio_gaps_r1', files: ['K04_impact_glass'], gain: 0.8 },
  'impact.clay': { owner: 'bank', set: 'ws_audio_gaps_r1', files: ['K05_impact_clay'], gain: 0.8 },
  'impact.domino': { owner: 'bank', set: 'ws_audio_gaps_r1', files: ['K07_domino_single'], gain: 0.8 },
  'debris.tail': { owner: 'bank', set: 'ws_audio_gaps_r1', files: ['K06_debris_tail'], gain: 0.6 },
  'tree.leaves': { owner: 'bank', set: 'ws_audio_gaps_r1', files: ['K08_leaves_burst'], gain: 0.7 },
  'k10.crossbowRelease': { owner: 'bank', set: 'combat_av_fix_r1', files: ['L02_crossbow_release'], gain: 1, note: 'Combat-AV L2' },
  'k10.arrowHit': { owner: 'bank', set: 'combat_av_fix_r1', files: ['L03_arrow_hit_body'], gain: 0.8, note: 'L3' },
  'k10.magicCast': { owner: 'bank', set: 'combat_av_fix_r1', files: ['L04_magic_cast'], gain: 0.9, note: 'L4' },
  'k10.magicHit': { owner: 'bank', set: 'combat_av_fix_r1', files: ['L05_magic_hit_clay'], gain: 0.8, note: 'L5' },
  'k10.diceFlick': { owner: 'bank', set: 'combat_av_fix_r1', files: ['L06_dice_flick'], gain: 0.8, note: 'L6' },
  'k10.mobBite': { owner: 'bank', set: 'combat_av_fix_r1', files: ['L07_mob_bite'], gain: 0.8, note: 'L7' },
  'k10.mobWindup': { owner: 'bank', set: 'combat_av_fix_r1', files: ['L13_mob_windup'], gain: 0.7, note: 'L13 Gegner holt aus (Ankündigung ≥ 250 ms)' },
  'k10.gatlingUp': { owner: 'bank', set: 'combat_av_fix_r1', files: ['L11_gatling_spin_up'], gain: 0.6 },
  'k10.gatlingSpin': { owner: 'bank', set: 'combat_av_fix_r1', files: ['L11_gatling_spin_loop'], gain: 0.45, loop: true },
  'k10.gatlingDown': { owner: 'bank', set: 'combat_av_fix_r1', files: ['L11_gatling_spin_down'], gain: 0.55 },
  'k10.shieldBlock': { owner: 'bank', set: 'combat_av_fix_r2', files: ['M04_shield_block_a_v3'], gain: 0.8, note: 'M04 v3' },
  'k10.smokeCloud': { owner: 'bank', set: 'throwables_r1', base: 'T08_smoke_puff_cloud', gain: 0.45 },
  'tree.fruit': { owner: 'bank', set: 'combat_av_fix_r2', files: ['F08_fruit_drop_bounce_a_v3'], gain: 0.6, note: 'F08 v3: Frucht/Fluff fällt nach Baumtreffer' },
  'ui.gameOver': { owner: 'bank', set: 'combat_av_fix_r3', base: 'L15_bloedsinn_stinger', gain: 0.8, bus: 'ui', note: 'L15 Blödsinn-Stinger (V-615), sobald es ein Ende-Ereignis gibt' },
  'k10.smoke': { owner: 'bank', set: 'combat_av_fix_r1', files: ['L12_smoke_pop_short'], gain: 0.85, note: 'Combat-AV L12 (+ T08 Rauchwolke als Ausklang)' },
  'k10.jump': { owner: 'bank', set: 'combat_av_fix_r3', base: 'L14_jump_hop', gain: 0.5 },
  'k10.land': { owner: 'bank', set: 'melee_destruction_r1', files: ['M07_land_thud_puff'], gain: 0.5 },
  'k10.playerHurt': { owner: 'bank', set: 'combat_av_fix_r1', files: ['L08_player_hurt'], gain: 0.8, note: 'Combat-AV L8 Bonk' },
  'k10.kill': { owner: 'bank', set: 'combat_av_fix_r1', files: ['L09_mob_pop_to_skull'], gain: 0.85, note: 'Combat-AV L9 Kill-Pop + Schädel-Klack' },
  'k10.bowRelease': { owner: 'bank', set: 'combat_av_fix_r1', files: ['L01_bow_release'], gain: 1, note: 'Combat-AV L1' },
  // ── Saugarm (kfb-fluff-suck, vorhandener suckAudio) ───────────────────────────────────────────────────────
  'suck.charge': { owner: 'suck', file: 'S01_suck_start + S02_suck_loop' }, 'suck.plop': { owner: 'suck', file: 'S03 Baum · S04 Boden · S05 Wasser' }, 'suck.swallow': { owner: 'suck', file: 'S06_slurp_in' },
  // ── Dark Fluffer (WS-NPC Phase C, Ereignisse aus flufferSim.events) ───────────────────────────────────────
  'fluffer.windup': { owner: 'bank', set: 'dark_fluffer_r1', base: 'DF01_windup_gurgle', gain: 0.8, pitch: FLUFFER_PITCH },
  'fluffer.spit': { owner: 'bank', set: 'dark_fluffer_r1', base: 'DF02_goo_spit', gain: 0.85, pitch: FLUFFER_PITCH },
  'fluffer.impact': { owner: 'bank', set: 'dark_fluffer_r1', base: 'DF03_goo_splat', gain: 0.8, pitch: FLUFFER_PITCH },
  'fluffer.taint': { owner: 'bank', set: 'combat_av_fix_r2', files: ['DF04_goo_patch_ooze_v3'], gain: 0.5, pitch: FLUFFER_PITCH },
  'fluffer.drop': { owner: 'bank', set: 'dark_fluffer_r1', base: 'DF05_tainted_fluff_thud', gain: 0.8, pitch: FLUFFER_PITCH },
  'fluffer.sink': { owner: 'bank', set: 'dark_fluffer_r1', base: 'DF06_tainted_fluff_sink', gain: 0.6, pitch: FLUFFER_PITCH },
  'fluffer.hop': { owner: 'bank', set: 'dark_fluffer_r1', base: 'DF07_fluffer_hop', gain: 0.5, pitch: FLUFFER_PITCH },
  'fluffer.grumble': { owner: 'bank', set: 'dark_fluffer_r1', base: 'DF08_fluffer_grumble', gain: 0.6, pitch: FLUFFER_PITCH },
  'fluffer.healed': { owner: 'bank', set: 'dark_fluffer_r1', base: 'DF09_heal_transform', gain: 0.85, pitch: FLUFFER_PITCH },
  'fluffer.eyes': { owner: 'bank', set: 'combat_av_fix_r2', files: ['DF10_eyes_pop_white_v3'], gain: 0.8, pitch: FLUFFER_PITCH },
  'fluffer.happy': { owner: 'bank', set: 'dark_fluffer_r1', base: 'DF11_healed_happy_squeak', gain: 0.75, pitch: FLUFFER_PITCH },
  'fluffer.burst': { owner: 'bank', set: 'dark_fluffer_r1', base: 'DF12_colorful_fluff_release', gain: 0.85, pitch: FLUFFER_PITCH },
  'fluffer.fade': { owner: 'bank', set: 'dark_fluffer_r1', base: 'DF14_patch_cleanse', gain: 0.5, pitch: FLUFFER_PITCH },
  // ── NPC-Gruppen (WS-NPC Phase D: mods.groups.events() – hit/aggro/ko/awake/calm/fluff für skeleton_patrol, toy_squad, bot_crew) ──────────────
  'npc.toyTick': { owner: 'bank', set: 'npc_steps_r1', files: ['N06_windup_key_tick_loop'], gain: 0.3, loop: true, note: 'N06 Aufziehschlüssel, solange der Trupp geht' },
  'npc.fluffGlide': { owner: 'bank', set: 'npc_steps_r1', files: ['N08_dark_fluffer_goo_glide_loop'], gain: 0.35, loop: true, pitch: FLUFFER_PITCH, note: 'N08 Goo zwischen den Hüpfern (nur feindlich)' },
  'fluffer.hopHealed': { owner: 'bank', set: 'npc_steps_r1', files: ['N09_fluffer_hop_healed'], gain: 0.5, pitch: FLUFFER_PITCH, note: 'N09 geheilter Hüpfer' },
  'npc.botAngry': { owner: 'bank', set: 'npc_steps_r1', files: ['N10_bot_angry_beep'], gain: 0.7 },
  'npc.clayGetUp': { owner: 'bank', set: 'npc_steps_r1', files: ['N11_clay_getting_up'], gain: 0.6 },
  'npc.boneCollapse': { owner: 'bank', set: 'npc_steps_r1', files: ['N12_skeleton_bone_collapse'], gain: 0.75 },
  'npc.toyCall': { owner: 'bank', set: 'npc_steps_r1', files: ['N13_toysoldier_call'], gain: 0.6 },
  'npc.botBeep': { owner: 'bank', set: 'npc_steps_r1', files: ['N14_bot_beep_plain'], gain: 0.5 },
  'npc.bandCrowd': { owner: 'bank', set: 'npc_steps_r1', files: ['N15_orc_band_crowd_murmur_loop'], gain: 0.25, loop: true, bus: 'atmo', note: 'N15 Publikum an der Band (leise Schleife in Hörweite)' },
  'npc.heavyGrass': { owner: 'bank', set: 'heavy_steps_r1', base: 'H01_stomp_grass', gain: 0.45, note: 'Large-Rig (V-607)' },
  'npc.heavyStone': { owner: 'bank', set: 'heavy_steps_r1', base: 'H02_stomp_stone', gain: 0.45 },
  'npc.heavySand': { owner: 'bank', set: 'heavy_steps_r1', files: ['H03_stomp_sand_a'], gain: 0.45 },
  'npc.heavyWood': { owner: 'bank', set: 'heavy_steps_r1', files: ['H04_stomp_wood_a'], gain: 0.45 },
  'npc.heavyArmor': { owner: 'bank', set: 'heavy_steps_r1', files: ['H05_armor_clank_step'], gain: 0.35 },
  'npc.heavyLand': { owner: 'bank', set: 'heavy_steps_r1', files: ['H06_dust_puff_landing'], gain: 0.7 },
  'npc.skelClatter': { owner: 'bank', set: 'creatures_r1', base: 'C06_skeleton_clatter', gain: 0.7 },
  'npc.clubWindup': { owner: 'bank', set: 'melee_destruction_r1', files: ['M02_club_whoosh_heavy'], gain: 0.5 },
  'npc.bodyFall': { owner: 'bank', set: 'creatures_r1', base: 'C01_clay_body_fall', gain: 0.6 },
  'npc.dizzy': { owner: 'bank', set: 'melee_destruction_r1', files: ['M08_dizzy_stars'], gain: 0.45 },
  'npc.getUp': { owner: 'bank', set: 'melee_destruction_r1', files: ['M09_getting_up_rustle'], gain: 0.6 },
  'npc.toyHit': { owner: 'bank', set: 'debris_crash_r1', base: 'D04_toy_plastic_bounce', gain: 0.7 },
  'npc.toyBonk': { owner: 'bank', set: 'debris_crash_r1', base: 'K06_cartoon_bonk', gain: 0.6 },
  'npc.toyDraw': { owner: 'bank', set: 'blaster_r1', base: 'X06_holster_draw', gain: 0.6 },
  'npc.botServo': { owner: 'bank', set: 'creatures_r1', base: 'C08_bot_servo', gain: 0.6 },
  'npc.fluff': { owner: 'bank', set: 'fluff_economy_r1', base: 'E05_fluff_scatter', gain: 0.55 },
  // ── Schritte und Hüpfer der NPCs (WS-NPC: groups.steps(), npc.steps(), fluffer.hops() – Sohlen-Kontakt aus der Animation) ──────────────────
  // set 'site:footsteps' = Audio-Site-Bänke (Kenney CC0 / Chequered Ink, LICENCES.md) unter /@kfb-audio/site/footsteps/assets/, Dateien mit Endung
  'npc.stepGrass': { owner: 'bank', set: 'npc_steps_r1', base: 'N01_clay_step_grass', gain: 0.4, note: 'N01 Knete auf Gras' },
  'npc.stepPath': { owner: 'bank', set: 'npc_steps_r1', base: 'N02_clay_step_sand', gain: 0.4, note: 'N02 Sand/Weg' },
  'npc.stepStone': { owner: 'bank', set: 'npc_steps_r1', base: 'N03_clay_step_rock', gain: 0.4, note: 'N03 Fels/Platz' },
  'npc.stepSkel': { owner: 'bank', set: 'npc_steps_r1', files: ['N04_skeleton_step_tock'], gain: 0.4, note: 'N04 Knochen-Tock' },
  'npc.stepToy': { owner: 'bank', set: 'npc_steps_r1', files: ['N05_toysoldier_march'], gain: 0.38, note: 'N05 Plastik-Marschtritt' },
  'npc.stepBot': { owner: 'bank', set: 'npc_steps_r1', files: ['N07_bot_step_metal'], gain: 0.4, note: 'N07 Metall-Stapfen' },
  // ── UI / Belohnung ──────────────────────────────────────────────────────────────────────────────────────────
  'ui.collect': { owner: 'bank', set: 'reward_r1b', base: 'R06b_fluff_collect', gain: 0.5, bus: 'ui' },
  'ui.pickup': { owner: 'bank', set: 'reward_r1b', base: 'R01b_card_pickup', gain: 0.55, bus: 'ui' },
  // ── Atmo (kfb-ambience.v1, V-458) ───────────────────────────────────────────────────────────────────────────
  'atmo.bed': { owner: 'ambience', file: 'meadow-1/2 (Tag) · wind-1/2 (Nacht) · pond-1/2 (am See) · wave-1…4 (am Meer)' },
  'atmo.fauna': { owner: 'ambience', file: 'bird-1…6 · chirp-1…3 · cricket-1…3 · frog-1…3 (Zufall, Tageszeit)' },
  'atmo.water': { owner: 'ambience', file: 'river-long (Fluss) · waterfall (Fall) · wave-1…4 (Meer) – positional am nächsten Wasser' },
  'atmo.farm': { owner: 'bank', set: 'farm_r1', base: 'F01_farm_morning_atmos', gain: 0.35, bus: 'atmo', loop: true, note: 'positional an den drei Obstgärten (Morgen/Tag)' },
  'atmo.coast': { owner: 'bank', set: 'ws_audio_gaps_r1', files: ['A02_coastal_birds_loop'], gain: 0.35, bus: 'atmo', loop: true, note: 'am Meer (Biom beach)' },
  // Wetter und Tageszeit für die Biom-Fahrt (WS1b V-619): Regen/Donner kommen zuerst aus kfb-ambience (weather, ambienceLightning); diese Töne ergänzen
  'weather.rain': { owner: 'bank', set: 'weather_time_r1', files: ['W06_rain_loop'], gain: 0.4, bus: 'atmo', loop: true, note: 'nur Ersatz, wenn kfb-ambience keinen Regen spielt' },
  'weather.rainOnset': { owner: 'bank', set: 'weather_time_r1', files: ['W04_rain_onset_a'], gain: 0.6, bus: 'atmo', note: 'Übergang trocken → Regen' },
  'weather.thunder': { owner: 'bank', set: 'weather_time_r1', base: 'W05_thunder_soft', gain: 0.7, bus: 'atmo', note: 'ferner Donner ohne sichtbaren Blitz (mit Blitz: ambienceLightning)' },
  'time.dawn': { owner: 'bank', set: 'weather_time_r1', files: ['W01_dawn_birds'], gain: 0.3, bus: 'atmo', loop: true },
  'time.dusk': { owner: 'bank', set: 'weather_time_r1', files: ['W02_dusk_crickets'], gain: 0.3, bus: 'atmo', loop: true },
  'time.night': { owner: 'bank', set: 'weather_time_r1', files: ['W03_night_calm'], gain: 0.3, bus: 'atmo', loop: true },
  'atmo.weather': { owner: 'gap', note: 'Wetter: das Spiel hat (noch) kein Wetter – Regen/Gewitter liegen bereit (rain-1…4, thunder, A03_thunder_dry, W04–W06); A01 Dschungel-Nacht wartet auf ein Dschungel-Biom' },
  'atmo.dioramas': { owner: 'gap', note: 'Dioramen (A01–A07 Friedhof, Hexe, Werkstatt …) – auf dem Probe-Gelände noch keine Diorama-Orte' },
  'atmo.residents': { owner: 'gap', note: 'Bewohner-Tätigkeiten (farm, alchemy, creatures) – Bewohner kommen mit WS-NPC; Töne liegen bereit' },
  // ── Musik ───────────────────────────────────────────────────────────────────────────────────────────────────
  'music.drive': { owner: 'music', file: 'music/suno-roadtrip-jukebox-v2 (Zufallsfolge, Überblendung)' },
  'music.foot': { owner: 'music', file: 'music/cozy-tunes-classics (Zufallsfolge, Überblendung)' },
})
// Schritt-Bänke der Audio Site, die die Laufzeit lädt (Spieler zu Fuß)
export const STEP_SURFACES = Object.freeze(['digital-grass', 'foley-concrete', 'sand', 'wet-clay', 'foley-gravel'])
export const bankCues = () => Object.entries(CUES).filter(([, c]) => c.owner === 'bank')
// Dark-Fluffer-Ereignis (flufferSim.events: windup, spit, impact, taint, drop, healed, burst, fade, gone) → Folge von Cues mit Versatz (s)
export const FLUFFER_SEQUENCE = Object.freeze({
  windup: [['fluffer.windup', 0]], spit: [['fluffer.spit', 0]], impact: [['fluffer.impact', 0]], taint: [['fluffer.taint', 0.15]],
  drop: [['fluffer.drop', 0], ['fluffer.sink', 0.5]], healed: [['fluffer.healed', 0], ['fluffer.eyes', 0.55], ['fluffer.happy', 0.9]],
  burst: [['fluffer.burst', 0]], fade: [['fluffer.fade', 0]], hop: [['fluffer.hop', 0]], grumble: [['fluffer.grumble', 0]],
})
// Combat-AV R1: Waffe (Arena-Figur bzw. Waffenart) → Abgangs-Cue, wie _launchCue() im Prototyp (gunfight.v2.js)
export const WEAPON_LAUNCH = Object.freeze({ pistol: 'pistol', blaster: 'blaster', 'action-rifle': 'rifle', rifle: 'rifle', 'soldier-r3d': 'rifle', soldier: 'rifle', gatling: 'gatling', crossbow: 'crossbow',
  smoke: 'smoke', bomb: 'throw', dice: 'dice', grenade: 'throw', blade: 'melee', sword: 'melee', fist: 'melee', melee: 'melee', wand: 'magic', staff: 'magic', 'skeleton-staff': 'magic', magic: 'magic', bow: 'bow', 'bow-a': 'bow', throw: 'throw' })
// Ebenen je Abgang: [cue, Versatz s, Pegel, Tonhöhe] (Anschlag 0 ms, Körper +10/+20 ms, Ausklang +60…90 ms) – Pegel aus kfb-arena-sfx.v4.json r2
export const LAUNCH = Object.freeze({
  pistol: [['av.C05ab', 0, 1.0, 1], ['av.X09a', 0.06, 0.228, 1]],
  blaster: [['av.X01', 0, 1.0, 1], ['av.C05c', 0.01, 0.475, 1], ['av.X09a', 0.07, 0.228, 1]],
  rifle: [['av.C05ca', 0, 1.0, 0.85], ['av.X09a', 0.06, 0.266, 1]],
  gatling: [['av.C05abc', 0, 0.418, 1.25]],
  crossbow: [['k10.crossbowRelease', 0, 1, 1]], // L2 (vorher Platzhalter M01+T03)
  bow: [['k10.bowRelease', 0, 1, 1]], // L1
  magic: [['k10.magicCast', 0, 1, 1], ['av.X09ab', 0.09, 0.266, 1]], // L4 + Flug-Ausklang
  dice: [['k10.diceFlick', 0, 1, 1]], // L6 (Arena-Standard launch.dice)
  melee: [['av.M01ab', 0, 1.0, 1]],
  throw: [['av.T03a', 0, 1.0, 1]],
  smoke: [['av.T03a', 0, 1.0, 1]], // Rauchbombe: Wurf; beim Aufschlag L12 + T08
})
export const MATERIAL_IMPACT = Object.freeze({ metal: 'impact.metal', glass: 'impact.glass', clay: 'impact.clay', domino: 'impact.domino' }) // WS0 K03–K05, K07
export const ENEMY_GAIN = 0.4 // Gegner-Bus 0,4 (Combat-AV r2, Regel R3: Gegner ≥ 6 dB unter dem eigenen Schuss)
export const weaponKind = (w) => { const k = String(w || '').toLowerCase(); return WEAPON_LAUNCH[k] || Object.entries(WEAPON_LAUNCH).find(([id]) => k.includes(id))?.[1] || (/rocket|launcher/.test(k) ? 'rocket' : null) }
// K10-Ereignis der Arena-Module → Ton-Plan (rein, Node-geprüft). e: { type: fire | cast | raise | release | contact | weaponDrop | jump | land | kill | windup | block,
//   weapon, side: 'player' | 'enemy', target ('player' = Spieler getroffen), energy 0..1, explosive, material, confirmed, position }
// Plan: { layers: [[cue, at, gain, rate]], combat?: Familie für den WSA-Kampf, material, loop?: 'gatling', confirm, swingFirst? }
export function k10Plan(e) {
  const kind = weaponKind(e?.weapon), enemy = e?.side === 'enemy', energy = Number.isFinite(e?.energy) ? e.energy : 0.6, scale = (L, g) => L.map(([c, at, gain, rate]) => [c, at, gain * g, rate])
  switch (e?.type) {
    case 'fire': case 'raise':
      if (enemy) return { layers: [['av.enemy', 0, ENEMY_GAIN, 1]] }                        // Gegnerwurf = Whoosh, leiser (statt Arcade-Kanone)
      if (kind === 'rocket') return { layers: [], combat: 'rocketLaunch' }
      return { layers: (LAUNCH[kind] || LAUNCH[e.type === 'raise' ? 'magic' : 'pistol']).slice(), loop: kind === 'gatling' ? 'gatling' : null } // unbekannte Waffe → Pistole
    case 'cast': return { layers: enemy ? [['av.enemy', 0, ENEMY_GAIN, 1]] : LAUNCH.magic.slice() }
    case 'release': return kind === 'throw' || /bomb|grenade|smoke/i.test(String(e.weapon)) ? { layers: scale([['k10.bombThrow', 0, 1, 1], ['k10.fuse', 0.25, 1, 1]], enemy ? ENEMY_GAIN : 1) } : { layers: [['k10.release', 0, enemy ? ENEMY_GAIN : 1, 1]] }
    case 'contact': {
      const onPlayer = e.target === 'player' || enemy, confirm = !!e.confirmed && !onPlayer // confirm.hit nur bei eigenen Treffern auf Gegner
      if (/smoke/i.test(String(e.weapon))) return { layers: [['k10.smoke', 0, 1, 1], ['k10.smokeCloud', 0.12, 1, 1]] } // L12 Pop + T08 Wolke
      const mat = MATERIAL_IMPACT[e.material] ? [[MATERIAL_IMPACT[e.material], 0.01, 1, 1]] : []
      if (e.explosive) return { layers: [...mat, ['debris.tail', 0.35, 1, 1]], combat: energy > 0.65 ? 'explosionLarge' : 'explosionSmall', material: e.material, confirm }
      if (onPlayer) return { layers: /bite|chomp|mob/i.test(String(e.weapon)) ? [['k10.mobBite', 0, 1, 1], ['k10.playerHurt', 0.06, 1, 1]] : [['k10.playerHurt', 0, 1, 1]], confirm: false } // L7 Biss · L8 Bonk
      if (kind === 'melee' || !kind) return { layers: mat, combat: energy > 0.6 ? 'punchHeavy' : /knuckle/i.test(String(e.weapon)) ? 'knuckles' : 'punchLight', confirm, swingFirst: kind === 'melee' }
      if (kind === 'bow' || kind === 'crossbow') return { layers: [['k10.arrowHit', 0, 1, 1], ...mat], confirm } // L3
      if (kind === 'magic') return { layers: [['k10.magicHit', 0, 1, 1], ...mat], confirm } // L5
      return { layers: [['combat.boltImpact', 0, 1, 1], ...mat], confirm }
    }
    case 'weaponDrop': return { layers: [['k10.weaponDrop', 0, 1, 1]] }
    case 'jump': return { layers: [['k10.jump', 0, enemy ? ENEMY_GAIN : 1, 1]] }
    case 'land': return { layers: [['k10.land', 0, enemy ? ENEMY_GAIN : 1, 1]] }
    case 'kill': return { layers: [['k10.kill', 0, 1, 1]] } // L9 Kill-Pop + Schädel
    case 'windup': return { layers: [['k10.mobWindup', 0, enemy ? 0.9 : 0.7, 1]] } // L13 Ankündigung vor dem Gegnerwurf
    case 'block': return { layers: [['k10.shieldBlock', 0, 1, 1]] }
    default: return null
  }
}

// NPC-Gruppen-Ereignis → Ton: [cue | 'combat:<Familie>', Versatz s, Pegel]; Trefferstufe n hebt den Treffer an (n = 1, 2, 3 …). Gruppe verrät die Figur.
export const GROUP_SOUNDS = Object.freeze({
  skeleton_patrol: { hit: [['npc.skelClatter', 0, 0.8]], aggro: [['npc.skelClatter', 0, 1], ['npc.clubWindup', 0.12, 0.8]], ko: [['npc.skelClatter', 0, 0.6], ['npc.boneCollapse', 0.1, 1], ['npc.dizzy', 0.6, 1]],
    awake: [['npc.getUp', 0, 1], ['npc.skelClatter', 0.2, 0.5]], calm: [['npc.skelClatter', 0, 0.35]], fluff: [['npc.fluff', 0, 1]] },
  toy_squad: { hit: [['npc.toyHit', 0, 0.9]], aggro: [['npc.toyCall', 0, 1], ['npc.toyDraw', 0.25, 0.9]], ko: [['npc.toyBonk', 0, 1], ['npc.toyHit', 0.18, 0.7], ['npc.dizzy', 0.5, 1]],
    awake: [['npc.clayGetUp', 0, 1]], calm: [['npc.toyDraw', 0, 0.45]], fluff: [['npc.fluff', 0, 1]] },
  bot_crew: { hit: [['npc.botServo', 0, 0.9]], aggro: [['npc.botAngry', 0, 1], ['combat:botAngry', 0.2, 0.6]], ko: [['combat:botCollapse', 0, 0.9], ['npc.dizzy', 0.6, 1]],
    awake: [['npc.botServo', 0, 1], ['npc.clayGetUp', 0.15, 0.7]], calm: [['npc.botBeep', 0, 0.6]], fluff: [['npc.fluff', 0, 1]] },
})
export const GROUP_TYPES = Object.freeze(['hit', 'aggro', 'ko', 'awake', 'calm', 'fluff'])
export function groupPlan(e) {
  const g = GROUP_SOUNDS[e?.group]; const L = g?.[e?.type]; if (!L) return null
  const boost = e.type === 'hit' ? Math.min(1.35, 0.85 + 0.15 * (Number.isFinite(e.n) ? e.n : 1)) : 1
  return L.map(([c, at, gain]) => [c, at, gain * boost])
}
// Schlüssel zum Entdoppeln (WS-NPC): group|type|id|t, bei fluff der tag
export const groupKey = (e) => (e.type === 'fluff' && e.tag ? 'fluff|' + e.tag : [e.group, e.type, e.id, e.t].join('|'))

// Schritt eines NPC → Cue: Gruppen nach Figur, Bewohner nach Boden (Untergrund wie stepSurface: Platz = Stein, Sand/Ufer = Weg, sonst Gras)
export const GROUP_STEP = Object.freeze({ skeleton_patrol: 'npc.stepSkel', toy_squad: 'npc.stepToy', bot_crew: 'npc.stepBot' })
export function npcStepCue(e, surface = 'digital-grass') {
  if (e?.rig === 'large' || e?.heavy) return surface === 'foley-concrete' ? 'npc.heavyStone' : surface === 'sand' || surface === 'foley-gravel' || surface === 'wet-clay' ? 'npc.heavySand' : 'npc.heavyGrass' // V-607 Large-Rig: stampfen
  if (e?.group) return GROUP_STEP[e.group] || null
  return surface === 'foley-concrete' ? 'npc.stepStone' : surface === 'sand' || surface === 'foley-gravel' || surface === 'wet-clay' ? 'npc.stepPath' : 'npc.stepGrass'
}
export const stepKey = (e) => (e.foot ? [e.id, e.foot, e.t].join('|') : [e.id, e.t].join('|'))
export const NPC_STEP_RANGE = 35 // m: weiter weg unhörbar → nicht spielen (Stimmen sparen)
