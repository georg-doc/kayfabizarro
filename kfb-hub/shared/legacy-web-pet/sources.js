export const CHARACTER_PIN='eb48f50489b9e4903ec1e3d2fb1837605ce7d792';
export const LEGACY_PIN='10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0';
export const RAW='https://raw.githubusercontent.com/georg-doc/kayfabizarro';

export const RIG_PATH='media/3D_Assets/KayKit Legacy/KayKit Character Animations 1.2 - legacy/Animations/gltf/KayKit_AnimatedCharacter_v1.2.glb';
export const WARBAND_ROOT='media/3D_Assets/KayKit Legacy/Orc Warband - legacy/props/gltf/';

export const CHARACTERS={
  barbarian:{
    id:'barbarian',label:'Barbarian',
    path:'media/3D_Assets/KayKit Legacy/KayKit Dungeon Pack 1.0 2/Models/Characters/gltf/character_barbarian.gltf',
    bodyNode:'character_barbarianBody',headNode:'character_barbarianHead',
    leftArmNode:'character_barbarianArmLeft',rightArmNode:'character_barbarianArmRight'
  },
  knight:{
    id:'knight',label:'Knight',
    path:'media/3D_Assets/KayKit Legacy/KayKit Dungeon Pack 1.0 2/Models/Characters/gltf/character_knight.gltf',
    bodyNode:'character_knightBody',headNode:'character_knightHead',
    leftArmNode:'character_knightArmLeft',rightArmNode:'character_knightArmRight'
  },
  mage:{
    id:'mage',label:'Mage',
    path:'media/3D_Assets/KayKit Legacy/KayKit Dungeon Pack 1.0 2/Models/Characters/gltf/character_mage.gltf',
    bodyNode:'character_mageBody',headNode:'character_mageHead',
    leftArmNode:'character_mageArnLeft',rightArmNode:'character_mageArmRight'
  },
  rogue:{
    id:'rogue',label:'Rogue',
    path:'media/3D_Assets/KayKit Legacy/KayKit Dungeon Pack 1.0 2/Models/Characters/gltf/character_rogue.gltf',
    bodyNode:'character_rogueBody',headNode:'character_rogueHead',
    leftArmNode:'character_rogueArmLeft',rightArmNode:'character_rogueArmRight'
  }
};

export const CAMP={
  banner:{id:'banner',path:WARBAND_ROOT+'orc_banner.gltf.glb'},
  props:[
    {id:'sword',path:WARBAND_ROOT+'orc_sword.gltf.glb'},
    {id:'shield',path:WARBAND_ROOT+'orc_shield.gltf.glb'},
    {id:'hammeraxe',path:WARBAND_ROOT+'orc_hammerAxe.gltf.glb'}
  ]
};

export const CLICK_CLIPS=['Wave','Cheer','Dance','Hop','Roll','AttackSpinning','Interact','HeavyAttack'];
export const LOCOMOTION={idle:'Idle',walk:'Walk',run:'Run',hop:'Hop'};

export function rawUrl(pin,path){
  return encodeURI(`${RAW}/${pin}/${path}`);
}
export const RIG_URL=rawUrl(LEGACY_PIN,RIG_PATH);
