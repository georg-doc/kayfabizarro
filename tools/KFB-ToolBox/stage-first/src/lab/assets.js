/* lab/assets.js · KFB Animation Lab v1 · data only, no three.
   Roster + real KayKit animation packs. Assets by RAW URL, source documented in SOURCE_PATHS.md.
   Every path below is taken from kfb-asset-library.json — nothing inferred from pack names. */
/* Pinned revision. Every path below was checked against this SHA before pinning — 94 distinct
   paths, all present, report in export/SourcePin_b97b5ac5.json. Re-pin only with lab/verify-sources.js. */
export const REVISION = 'b97b5ac55df2724fae623992433685583eece51e';
export const RAW = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/' + REVISION + '/';
export const url = (p) => RAW + encodeURI(p);

const MS6 = 'media/3D_Assets/KayKit_Mystery_Series6/';
const ADV = 'media/3D_Assets/KayKit_Adventurers_2.0_FREE/Characters/gltf/';
const SKL = 'media/3D_Assets/KayKit_Skeletons/characters/gltf/';
const MAN = 'media/3D_Assets/KayKit_Character_Animations_1.1/Mannequin Character/characters/';

export const GROUPS = [
  { id: 'ms6', label: 'Mystery Series · 2025/26' },
  { id: 'ms4', label: 'Mystery Series · 2023/24' },
  { id: 'adventurers', label: 'Adventurers' },
  { id: 'skeletons', label: 'Skeletons' },
  { id: 'mannequin', label: 'Mannequin' },
];

export const CHARACTERS = [
  { id: 'lorekeeper', group: 'ms6', label: 'Lorekeeper', month: 'Jul 2025', path: MS6 + '1 - July 2025 - Lorekeeper/Lorekeeper.glb' },
  { id: 'orcbrute', group: 'ms6', label: 'Orc Brute', month: 'Aug 2025', path: MS6 + '2 - August 2025 - Orc Brute/OrcBrute.glb' },
  { id: 'cleric', group: 'ms6', label: 'Cleric', month: 'Sep 2025', path: MS6 + '3 - September 2025 - Cleric/Cleric.glb' },
  { id: 'monstrosity', group: 'ms6', label: 'Monstrosity', month: 'Oct 2025', path: MS6 + '4 - October 2025 - Monstrosity/Monstrosity.glb' },
  { id: 'plantwarrior', group: 'ms6', label: 'Plant Warrior', month: 'Nov 2025', path: MS6 + '5 - November 2025 - Plant Warrior/PlantWarrior.glb' },
  { id: 'toysoldier', group: 'ms6', label: 'Toy Soldier', month: 'Dec 2025', path: MS6 + '6 - December 2025 - Toy Soldier/ToySoldier.glb' },
  { id: '4gtn', group: 'ms6', label: '4GTN', month: 'Jan 2026', path: MS6 + '7 - January 2026 - 4GTN/4GTN.glb' },
  { id: '4gtn_forgotten', group: 'ms6', label: '4GTN Forgotten', month: 'Jan 2026', path: MS6 + '7 - January 2026 - 4GTN/4GTN_Forgotten.glb' },
  { id: 'hoarder', group: 'ms6', label: 'Hoarder', month: 'Feb 2026', path: MS6 + '8 - February 2026 - Hoarder/Hoarder.glb' },
  { id: 'avian', group: 'ms6', label: 'Avian Swordsman', month: 'Mar 2026', path: MS6 + '9 - March 2026 - Avian Swordsman/AvianSwordsman.glb' },
  { id: 'marksman', group: 'ms6', label: 'Marksman', month: 'Apr 2026', path: MS6 + '10 - April 2026 - Marksman/Marksman.glb' },
  { id: 'magicalgirl', group: 'ms6', label: 'Magical Girl', month: 'May 2026', path: MS6 + '11 - May 2026 - Magical Girl/MagicalGirl.glb' },
  { id: 'farmer_a', group: 'ms6', label: 'Farmer A', month: 'Jun 2026', path: MS6 + '12 - June 2026 - Farmers/Farmer_A.glb' },
  { id: 'farmer_b', group: 'ms6', label: 'Farmer B', month: 'Jun 2026', path: MS6 + '12 - June 2026 - Farmers/Farmer_B.glb' },

  { id: 'ms4_orcraider', group: 'ms4', label: 'Orc Raider', month: 'Jul 2023', path: MS6 + '1 - July 2023 - Orc Raider/character/OrcRaider.glb', tex: ['media/3D_Assets/KayKit_Mystery_Series6/1 - July 2023 - Orc Raider/textures/orc_texture_A.png', 'media/3D_Assets/KayKit_Mystery_Series6/1 - July 2023 - Orc Raider/textures/orc_texture_B.png'] },
  { id: 'ms4_driver', group: 'ms4', label: 'Driver', month: 'Aug 2023', path: MS6 + '2 - August 2023 - Driver/character/gltf/Driver.glb', tex: ['media/3D_Assets/KayKit_Mystery_Series6/2 - August 2023 - Driver/textures/driver_texture.png', 'media/3D_Assets/KayKit_Mystery_Series6/2 - August 2023 - Driver/textures/driver_texture_B.png'] },
  { id: 'ms4_monster', group: 'ms4', label: 'Monster', month: 'Sep 2023', path: MS6 + '3 - September 2023 - Monster Costume/character/gltf/Monster.glb', tex: ['media/3D_Assets/KayKit_Mystery_Series6/3 - September 2023 - Monster Costume/textures/monstercostume_texture_A.png', 'media/3D_Assets/KayKit_Mystery_Series6/3 - September 2023 - Monster Costume/textures/monstercostume_texture_B.png'] },
  { id: 'ms4_monstercostume', group: 'ms4', label: 'Monster Costume', month: 'Sep 2023', path: MS6 + '3 - September 2023 - Monster Costume/character/gltf/MonsterCostume.glb', tex: ['media/3D_Assets/KayKit_Mystery_Series6/3 - September 2023 - Monster Costume/textures/monstercostume_texture_A.png', 'media/3D_Assets/KayKit_Mystery_Series6/3 - September 2023 - Monster Costume/textures/monstercostume_texture_C.png'] },
  { id: 'ms4_werewolf_man', group: 'ms4', label: 'Werewolf Man', month: 'Oct 2023', path: MS6 + '4 - October 2023 - Werewolf/characters/gltf/Werewolf_Man.glb', tex: ['media/3D_Assets/KayKit_Mystery_Series6/4 - October 2023 - Werewolf/textures/werewolf_A.png', 'media/3D_Assets/KayKit_Mystery_Series6/4 - October 2023 - Werewolf/textures/werewolf_B.png'] },
  { id: 'ms4_werewolf_wolf', group: 'ms4', label: 'Werewolf Wolf', month: 'Oct 2023', path: MS6 + '4 - October 2023 - Werewolf/characters/gltf/Werewolf_Wolf.glb', tex: ['media/3D_Assets/KayKit_Mystery_Series6/4 - October 2023 - Werewolf/textures/werewolf_A.png', 'media/3D_Assets/KayKit_Mystery_Series6/4 - October 2023 - Werewolf/textures/werewolf_B.png'] },
  { id: 'ms4_animatronic_normal', group: 'ms4', label: 'Animatronic Normal', month: 'Nov 2023', path: MS6 + '5 - November 2023 - Animatronic/characters/gltf/Animatronic_Normal.glb', tex: ['media/3D_Assets/KayKit_Mystery_Series6/5 - November 2023 - Animatronic/textures/animatronic_A.png', 'media/3D_Assets/KayKit_Mystery_Series6/5 - November 2023 - Animatronic/textures/animatronic_B.png'] },
  { id: 'ms4_animatronic_creepy', group: 'ms4', label: 'Animatronic Creepy', month: 'Nov 2023', path: MS6 + '5 - November 2023 - Animatronic/characters/gltf/Animatronic_Creepy.glb', tex: ['media/3D_Assets/KayKit_Mystery_Series6/5 - November 2023 - Animatronic/textures/animatronic_B.png', 'media/3D_Assets/KayKit_Mystery_Series6/5 - November 2023 - Animatronic/textures/animatronic_A.png'] },
  { id: 'ms4_actionfigure', group: 'ms4', label: 'Action Figure', month: 'Dec 2023', path: MS6 + '6 - December 2023 - Action Figure/character/gltf/ActionFigure.glb', tex: ['media/3D_Assets/KayKit_Mystery_Series6/6 - December 2023 - Action Figure/textures/actionfigure_texture.png'] },
  { id: 'ms4_spaceranger', group: 'ms4', label: 'Space Ranger', month: 'Jan 2024', path: MS6 + '7 - January 2024 - Space Ranger/character/SpaceRanger.glb', tex: ['media/3D_Assets/KayKit_Mystery_Series6/7 - January 2024 - Space Ranger/texture/spaceranger_texture.png'] },
  { id: 'ms4_spaceranger_flight', group: 'ms4', label: 'Space Ranger Flight', month: 'Jan 2024', path: MS6 + '7 - January 2024 - Space Ranger/character/SpaceRanger_FlightMode.glb', tex: ['media/3D_Assets/KayKit_Mystery_Series6/7 - January 2024 - Space Ranger/texture/spaceranger_texture.png'] },
  { id: 'ms4_ninja', group: 'ms4', label: 'Ninja', month: 'Feb 2024', path: MS6 + '8 - February 2024 - Ninja/character/Ninja.glb', tex: ['media/3D_Assets/KayKit_Mystery_Series6/8 - February 2024 - Ninja/texture/ninja_texture_A.png', 'media/3D_Assets/KayKit_Mystery_Series6/8 - February 2024 - Ninja/texture/ninja_texture_B.png'] },
  { id: 'ms4_survivalist', group: 'ms4', label: 'Survivalist', month: 'Mar 2024', path: MS6 + '9 - March 2024 - Survivalist/character/Survivalist.glb', tex: ['media/3D_Assets/KayKit_Mystery_Series6/9 - March 2024 - Survivalist/texture/survivalist_texture.png'] },
  { id: 'ms4_paladin', group: 'ms4', label: 'Paladin', month: 'Apr 2024', path: MS6 + '10 - April 2024 - Paladin/characters/gltf/Paladin.glb', tex: ['media/3D_Assets/KayKit_Mystery_Series6/10 - April 2024 - Paladin/textures/paladin_texture_A.png', 'media/3D_Assets/KayKit_Mystery_Series6/10 - April 2024 - Paladin/textures/paladin_texture_B.png'] },
  { id: 'ms4_paladin_helmet', group: 'ms4', label: 'Paladin with Helmet', month: 'Apr 2024', path: MS6 + '10 - April 2024 - Paladin/characters/gltf/Paladin_with_Helmet.glb', tex: ['media/3D_Assets/KayKit_Mystery_Series6/10 - April 2024 - Paladin/textures/paladin_texture_A.png', 'media/3D_Assets/KayKit_Mystery_Series6/10 - April 2024 - Paladin/textures/paladin_texture_B.png'] },
  { id: 'ms4_clown', group: 'ms4', label: 'Clown', month: 'May 2024', path: MS6 + '11 - May 2024 - Clown/characters/Clown.glb', tex: ['media/3D_Assets/KayKit_Mystery_Series6/11 - May 2024 - Clown/textures/clown_texture.png'] },
  { id: 'ms4_robot_one', group: 'ms4', label: 'Robot One', month: 'Jun 2024', path: MS6 + '12 - June 2024 - Robot/characters/Robot_One.glb', tex: ['media/3D_Assets/KayKit_Mystery_Series6/12 - June 2024 - Robot/textures/robot_texture.png', 'media/3D_Assets/KayKit_Mystery_Series6/12 - June 2024 - Robot/textures/robot_texture_alt.png'] },
  { id: 'ms4_robot_two', group: 'ms4', label: 'Robot Two', month: 'Jun 2024', path: MS6 + '12 - June 2024 - Robot/characters/Robot_Two.glb', tex: ['media/3D_Assets/KayKit_Mystery_Series6/12 - June 2024 - Robot/textures/robot_texture.png', 'media/3D_Assets/KayKit_Mystery_Series6/12 - June 2024 - Robot/textures/robot_texture_alt.png'] },

  { id: 'adv_barbarian', group: 'adventurers', label: 'Barbarian', month: 'Adventurers 2.0', path: ADV + 'Barbarian.glb', tex: ['media/3D_Assets/KayKit_Adventurers_2.0_FREE/Characters/gltf/barbarian_texture.png'] },
  { id: 'adv_knight', group: 'adventurers', label: 'Knight', month: 'Adventurers 2.0', path: ADV + 'Knight.glb', tex: ['media/3D_Assets/KayKit_Adventurers_2.0_FREE/Characters/gltf/knight_texture.png'] },
  { id: 'adv_mage', group: 'adventurers', label: 'Mage', month: 'Adventurers 2.0', path: ADV + 'Mage.glb', tex: ['media/3D_Assets/KayKit_Adventurers_2.0_FREE/Characters/gltf/mage_texture.png'] },
  { id: 'adv_ranger', group: 'adventurers', label: 'Ranger', month: 'Adventurers 2.0', path: ADV + 'Ranger.glb', tex: ['media/3D_Assets/KayKit_Adventurers_2.0_FREE/Characters/gltf/ranger_texture.png'] },
  { id: 'adv_rogue', group: 'adventurers', label: 'Rogue', month: 'Adventurers 2.0', path: ADV + 'Rogue.glb', tex: ['media/3D_Assets/KayKit_Adventurers_2.0_FREE/Characters/gltf/rogue_texture.png'] },
  { id: 'adv_rogue_hooded', group: 'adventurers', label: 'Rogue Hooded', month: 'Adventurers 2.0', path: ADV + 'Rogue_Hooded.glb', tex: ['media/3D_Assets/KayKit_Adventurers_2.0_FREE/Characters/gltf/rogue_texture.png'] },

  { id: 'skl_warrior', group: 'skeletons', label: 'Skeleton Warrior', month: 'Skeletons', path: SKL + 'Skeleton_Warrior.glb', tex: ['media/3D_Assets/KayKit_Skeletons/characters/gltf/skeleton_texture.png'] },
  { id: 'skl_rogue', group: 'skeletons', label: 'Skeleton Rogue', month: 'Skeletons', path: SKL + 'Skeleton_Rogue.glb', tex: ['media/3D_Assets/KayKit_Skeletons/characters/gltf/skeleton_texture.png'] },
  { id: 'skl_mage', group: 'skeletons', label: 'Skeleton Mage', month: 'Skeletons', path: SKL + 'Skeleton_Mage.glb', tex: ['media/3D_Assets/KayKit_Skeletons/characters/gltf/skeleton_texture.png'] },
  { id: 'skl_minion', group: 'skeletons', label: 'Skeleton Minion', month: 'Skeletons', path: SKL + 'Skeleton_Minion.glb', tex: ['media/3D_Assets/KayKit_Skeletons/characters/gltf/skeleton_texture.png'] },

  { id: 'man_medium', group: 'mannequin', label: 'Mannequin Medium', month: 'reference rig', path: MAN + 'Mannequin_Medium.glb', tex: ['media/3D_Assets/KayKit_Character_Animations_1.1/Mannequin Character/Textures/mannequin_texture.png'] },
  { id: 'man_large', group: 'mannequin', label: 'Mannequin Large', month: 'reference rig', path: MAN + 'Mannequin_Large.glb', tex: ['media/3D_Assets/KayKit_Character_Animations_1.1/Mannequin Character/Textures/mannequin_texture.png'] },
];

const ANIM = 'media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/';
export const RIGS = ['Medium', 'Large'];

/* Canonical animation library: KayKit Character Animations 1.1, 14 pack GLBs. */
export const PACKS = [
  { key: 'MovementBasic', family: 'movement', rigs: ['Medium', 'Large'] },
  { key: 'MovementAdvanced', family: 'movement', rigs: ['Medium', 'Large'] },
  { key: 'General', family: 'social', rigs: ['Medium', 'Large'] },
  { key: 'Simulation', family: 'sim', rigs: ['Medium', 'Large'] },
  { key: 'Tools', family: 'tools', rigs: ['Medium'] },
  { key: 'CombatMelee', family: 'melee', rigs: ['Medium', 'Large'] },
  { key: 'CombatRanged', family: 'ranged', rigs: ['Medium'] },
  { key: 'Special', family: 'special', rigs: ['Medium', 'Large'] },
];
export const packPath = (rig, key) => ANIM + 'Rig_' + rig + '/Rig_' + rig + '_' + key + '.glb';

/* Duplicate pack copies that ship inside the character packs. Separate files, so they may differ.
   The audit measures them and reports them; they stay out of the clip bar to keep it unambiguous. */
export const VARIANT_PACKS = [
  { key: 'Adventurers/General', rig: 'Medium', path: 'media/3D_Assets/KayKit_Adventurers_2.0_FREE/Animations/gltf/Rig_Medium/Rig_Medium_General.glb' },
  { key: 'Adventurers/MovementBasic', rig: 'Medium', path: 'media/3D_Assets/KayKit_Adventurers_2.0_FREE/Animations/gltf/Rig_Medium/Rig_Medium_MovementBasic.glb' },
  { key: 'Skeletons/General', rig: 'Medium', path: 'media/3D_Assets/KayKit_Skeletons/Animations/gltf/Rig_Medium/Rig_Medium_General.glb' },
  { key: 'Skeletons/MovementBasic', rig: 'Medium', path: 'media/3D_Assets/KayKit_Skeletons/Animations/gltf/Rig_Medium/Rig_Medium_MovementBasic.glb' },
  { key: 'MysterySeries/General', rig: 'Medium', path: MS6 + 'Animations/gltf/Rig_Medium/Rig_Medium_General.glb' },
  { key: 'MysterySeries/MovementBasic', rig: 'Medium', path: MS6 + 'Animations/gltf/Rig_Medium/Rig_Medium_MovementBasic.glb' },
  { key: 'MysterySeries/General', rig: 'Large', path: MS6 + 'Animations/gltf/Rig_Large/Rig_Large_General.glb' },
  { key: 'MysterySeries/MovementBasic', rig: 'Large', path: MS6 + 'Animations/gltf/Rig_Large/Rig_Large_MovementBasic.glb' },
];

export const FAMILIES = [
  { id: 'movement', label: 'Movement' },
  { id: 'social', label: 'Social' },
  { id: 'sim', label: 'Simulation' },
  { id: 'tools', label: 'Tools' },
  { id: 'melee', label: 'Melee' },
  { id: 'ranged', label: 'Ranged' },
  { id: 'special', label: 'Special' },
  { id: 'embedded', label: 'Embedded' },
];
export const familyOf = (pack) => (pack === 'embedded' ? 'embedded' : (PACKS.find((p) => p.key === pack) || {}).family || 'special');

/* Some packs ship the colour atlas next to the model instead of inside it — those models load white.
   `tex` lists the real texture files for such a character, first one is applied to every material that has no map.
   Paths verified against kfb-asset-library (7); nothing is derived from a naming pattern. */

/* Semantic KFB states — data, not clip names. Filled in Sprint 4 from the measured inventory. */
export const KFB_STATES = ['Idle', 'Walk', 'Run', 'Jump', 'SitVehicle', 'SitRelaxed', 'Wave', 'Cheer', 'Interact', 'Hit', 'Recover', 'ToyShoot', 'Melee', 'Work', 'Dance', 'EnterVehicle', 'ExitVehicle', 'DriveIdle', 'DriveSteerLeft', 'DriveSteerRight', 'DriveBrake', 'DriveAccelerate', 'DriveAirborneBrace', 'DriveLandingReact'];
