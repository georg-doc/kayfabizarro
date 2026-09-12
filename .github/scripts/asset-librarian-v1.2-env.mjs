import { execFileSync } from 'node:child_process';
import path from 'node:path';

export const ROOT = process.cwd();
export const BASE_URL = process.env.LIBRARIAN_URL || 'http://127.0.0.1:8765/tools/asset_registry/librarian/';
export const ARTIFACT_DIR = path.join(ROOT, 'artifacts', 'asset-librarian-smoke', 'v1.2');
export const A = {
  orc: 'media/3D_Assets/KayKit_Mystery_Series6/1 - July 2023 - Orc Raider/character/OrcRaider.glb',
  orcTexture: 'media/3D_Assets/KayKit_Mystery_Series6/1 - July 2023 - Orc Raider/textures/orc_texture_A.png',
  rover: 'media/3D_Assets/SciFI_Ultimate Space Kit_Quaternius/Vehicles/GLTF/Rover_Round.gltf',
  medium: [
    'media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/Rig_Medium_General.glb',
    'media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/Rig_Medium_MovementBasic.glb',
    'media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/Rig_Medium_CombatMelee.glb',
  ],
  capsulePlayer: 'media/3D_Assets/KayKit_Mystery_Series6/CapsuleCarl/gltf/player.gltf',
  capsuleTexture: 'media/3D_Assets/KayKit_Mystery_Series6/CapsuleCarl/gltf/capsule_texture.png',
  characterTemplate: 'media/3D_Assets/KayKit_Mystery_Series6/CharacterTemplate/gltf/CharacterTemplate.glb',
  bath: 'media/3D_Assets/Bubbly_Bathroom_Tiny_Treats_1-1/Assets/gltf/bath.gltf',
  jetpack: 'media/3D_Assets/KayKit_Mystery_Series6/7 - January 2024 - Space Ranger/assets/gltf/SpaceRanger_Jetpack.gltf',
  audio: 'media/3D_Assets/Audio/S050C-ArcadeShooter/DryStereo/EnterArena.wav',
};
export function assert(condition, message) { if (!condition) throw new Error(message); }
export function findBrowser() {
  if (process.env.BROWSER_EXE) return process.env.BROWSER_EXE;
  return execFileSync('bash', ['-lc', 'command -v google-chrome-stable || command -v google-chrome || command -v chromium || command -v chromium-browser || true'], { encoding: 'utf8' }).trim();
}
