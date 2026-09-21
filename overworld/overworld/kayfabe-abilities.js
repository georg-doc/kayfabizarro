/* KFB Overworld — Kayfabe Abilities (V2-S3)
   Reine Registry: Daten, Rarity, Drop-Tabellen. Die Effekt-Handler wohnen im Spiel
   (overworld-game.js, EFFECTS) — hier steht nur, WAS eine Ability ist, nie WIE sie wirkt.

   Kanon: Rarity = Regelbruch-Grad, nicht Zahlen-Multiplikator. Karten sind Beweisstücke,
   Abilities sind das, was Karten freischalten — nie Werte.

   Sprache: EN (UI-Sprache des Runners; Puste/Witz/Schneid bleiben Eigennamen wie Kayfabe). */
(function(){
'use strict';

/* Rarity-Töne (V4-S3c): eine Quelle für Slot-Punkt, Floater und Diary. Sie müssen auf drei
   Untergründen lesbar sein — Papier (#d9bd93), Gras und der blaue Knopf — deshalb dunkel und
   satt statt pastellig. Vorher waren sie für das dunkle Panel gemischt (bis 1,78:1). */
const RARITY={
  common:{label:'Common',color:'#41504a',order:0},
  uncommon:{label:'Uncommon',color:'#17663a',order:1},
  rare:{label:'Rare',color:'#1f4f8f',order:2},
  epic:{label:'Epic',color:'#6a3a9e',order:3},
  legendary:{label:'Legendary',color:'#7a4d0c',order:4},
};

const ABILITIES={
  monologue:{id:'monologue',key:'MON',title:'Unrequested Monologue',rarity:'common',
    trigger:'active',cost:1,busy:0.8,
    effect:{type:'freeze',power:1,target:'all',seconds:1.2,range:420},
    hint:'Everything stops. Nobody asked.',
    say:'Let me start at the beginning.',
    diary:'Nobody asked for this speech. Everyone listened.'},

  kant:{id:'kant',key:'KANT',title:'Kantian Objection',rarity:'common',
    trigger:'onFightStart',cost:1,fights:3,
    effect:{type:'distract',power:1,target:'all',seconds:1.6,range:400},
    hint:'Enemies hesitate when the next 3 fights begin.',
    say:'Act only on that maxim…',
    diary:'He quoted the Critique of Pure Reason. The goblins were confused.'},

  chair:{id:'chair',key:'CHAIR',title:'The Chair Enters',rarity:'uncommon',
    trigger:'active',cost:1,busy:1.6,
    effect:{type:'heal',power:1,target:'self'},
    hint:'Sit down mid-battle. Restores 1 Fluff, leaves you wide open.',
    say:'One moment.',
    diary:'In the middle of the battle he sat down. It was not weakness.'},

  gutter_bridge:{id:'gutter_bridge',key:'GUT',title:'Gutter Ethics',rarity:'uncommon',
    trigger:'active',cost:1,
    effect:{type:'bridge',power:3,target:'zone',seconds:7,span:9},
    hint:'Ink a walkable bridge across the gutter ahead.',
    say:'The gap is a matter of interpretation.',
    diary:'The gap between two panels became walkable.'},

  fourth_wall:{id:'fourth_wall',key:'4TH',title:'Fourth Wall, Please Open',rarity:'uncommon',
    trigger:'active',cost:1,busy:0.6,
    effect:{type:'meta',power:2,target:'all',seconds:3,range:640},
    hint:'Address an audience nobody can see. Everything holds still.',
    say:'You there. Behind the panel.',
    diary:'He turned to an audience nobody could see. It turned back.'},

  peer_review:{id:'peer_review',key:'PEER',title:'Peer Review',rarity:'rare',
    trigger:'onFightStart',cost:1,fights:1,
    effect:{type:'mark',power:3,target:'nearest',range:520},
    hint:'Mark the toughest enemy nearby. Every third hit stuns it.',
    say:'Three reviewers. One verdict.',
    diary:'Three reviewers agreed. The critique was devastating.'},
};

const ORDER=['monologue','kant','chair','gutter_bridge','fourth_wall','peer_review'];

// Verteilung der Rarity, WENN etwas droppt (Spec §4) + wie oft überhaupt etwas droppt
const DROPS={
  mob:{chance:0.14,table:{common:70,uncommon:25,rare:5}},
  elite:{chance:0.6,table:{common:30,uncommon:40,rare:25,epic:5}},
  zone:{chance:1,table:{uncommon:40,rare:40,epic:15,legendary:5}},
  boss:{chance:1,table:{uncommon:15,rare:50,epic:30,legendary:5}},
  secret:{chance:1,table:{common:50,uncommon:30,rare:15,epic:4,legendary:1}},
};

function rollRarity(source,r){
  const d=DROPS[source]||DROPS.mob;
  let sum=0;for(const k in d.table)sum+=d.table[k];
  let acc=0,pick=r*sum;
  for(const k in d.table){acc+=d.table[k];if(pick<acc)return k;}
  return 'common';
}

/* Würfelt einen Drop für eine Quelle. `owned` = bereits freigeschaltete IDs.
   Liefert die Ability oder null (nichts gedroppt / alles der Rarity schon vorhanden).
   Rückweg eingebaut: gibt es nichts in der gewürfelten Rarity, wird EINMAL nach unten
   ausgewichen — nie stumm nach oben (sonst regnet es Legendaries). */
function rollDrop(source,r1,r2,owned){
  const d=DROPS[source]||DROPS.mob;
  if(r1>d.chance)return null;
  const want=rollRarity(source,r2);
  const tiers=Object.keys(RARITY).sort((a,b)=>RARITY[a].order-RARITY[b].order);
  const start=tiers.indexOf(want);
  for(let step=0;step<=start;step++){
    const tier=tiers[start-step];
    const pool=ORDER.filter(id=>ABILITIES[id].rarity===tier&&owned.indexOf(id)<0);
    if(pool.length)return ABILITIES[pool[Math.floor(r1/d.chance*pool.length)%pool.length]];
  }
  return null;
}

window.OW_KAYFABE={RARITY,ABILITIES,ORDER,DROPS,rollRarity,rollDrop,
  note:'V2-S3 — Registry + Rarity-Drops. Effekt-Handler liegen im Spiel (EFFECTS).'};
})();
