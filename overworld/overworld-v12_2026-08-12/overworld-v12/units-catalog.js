/* KFB Overworld — Einheiten-Katalog · ZUSAMMENGEFÜHRT WS0 → v10-Linie, 2026-08-09
   ---------------------------------------------------------------------------------------
   Fork-Stempel: Grundlage ist die WS0-Fassung aus dem v9-B-Export; sie ist gegen die
   v10-S5-Fassung des Leads **gediffed, nicht drübergeschrieben** (Review §2: »Ein Diff,
   kein blinder Überschreib«).

   Gemessen beim Zusammenführen:
     · Einheiten: 31 hier, 31 dort — **keine geht verloren, in keiner Richtung**
     · die vier Wächter-Clips sind da: minotaur · skull · panda · turtle (guard bzw. guardIn/Out).
       An ihnen hängt seit v10-S2d die Warnhaltung des Kartenwächters.
     · `pig` hat **nur idle + run** — das Schwein ist der neutrale Übungsgegner der
       Tutorial-Zone (V10-S3a) und darf keine Angriffsanimation bekommen, sonst schlägt es
       zurück, bevor die Lektion gesessen hat.

   Was diese Fassung zusätzlich mitbringt:
     · **Menschen-Avatare als Regel statt als Liste** — `HAV_BASE` + `humanAvatar(farbe, platz)`
       über die 25 Free-Pack-Blätter; jede Ritterklasse bekommt ihr Porträt aus einer Rechnung.
     · **Gegner-Avatare zugeordnet** — die Liste der ungeklärten Blätter schrumpft von 12 auf 6.
     · **Lancer und Monk spielbar** — `KNIGHT_CLASSES` 3 → 5. Ihr Blattwerk liegt im Free Pack
       und ist deshalb `strips` statt `rowsheet`: **das Blattformat entscheidet die Bauart,
       nicht die Fraktion.**

   Offen und bewusst so gelassen: der Monk »greift« mit seiner Heilung an (Free Pack hat für ihn
   kein Angriffsblatt). Die Wirkung ist ein eigener Slice, kein Katalog-Eintrag.
*/
/* KFB Overworld — Einheiten-Katalog (Vorarbeit für Charakterwahl + Enemy-Pack-Integration).
   Zwei Sheet-Formate:
   - "rowsheet": EIN Sheet mit Zeilen (Update-010-Troops, 192er-Zellen; Zeilen per probeRows,
     Zuordnung per rowMap wie im Spiel).
   - "strips":  EINE Datei je Animation, Frames horizontal (Enemy Pack + Free Pack; Frame-Breite
     per probeStrip, Fallback = Bildhöhe).
   Avatare: Enemy Pack liefert fertige Porträts; für alle anderen gilt Idle-Frame 0 als Avatar. */
(function(){
'use strict';
const S=window.OW_SRC;
if(!S)console.error('[units-catalog] asset-source.js fehlt — Assets laden nicht');
const RAW=S?S.a2d(''):'';   // Quelle: overworld/asset-source.js (eine Stelle)
const P10=RAW+'Tiny%20Swords%20(Update%20010)/';
const PFREE=RAW+'Tiny%20Swords%20(Free%20Pack)/';
const PEN=RAW+'Tiny%20Swords%20(Enemy%20Pack)/Enemy%20Pack/Enemies/';
const PAV=RAW+'Tiny%20Swords%20(Enemy%20Pack)/Enemy%20Avatars/';
/* Menschen-Avatare (Free Pack, 25 Blätter) — AM BILD GEPRÜFT, 2026-08-09.
   Beleg: scraps/avatare-25.png · scraps/avatare-16-25.png · scraps/avatar-vs-unit3.png
   (jedes Avatarblatt neben dem ersten Idle-Bild derselben Einheit, beides auf 150 px vergrößert).

   Fünf Blätter je Farbe, Blöcke in dieser Reihenfolge:
     01–05 Blau · 06–10 Rot · 11–15 Gelb · 16–20 Lila · 21–25 SCHWARZ (nicht »Grau«)

   Und innerhalb des Blocks — das ist der Teil, der bis heute FALSCH war:
     +0 Warrior  Federbusch, Schild, Schwert
     +1 Lancer   runder Topfhelm mit Kinnriemen
     +2 Archer   Kegelhelm mit Feder
     +3 Monk     kahle Krone, Haarkranz drum herum (von oben gesehen), keine Augen
     +4 Pawn     krauses Haar, Gesicht mit geschlossenen Augen

   Die alte Reihenfolge behauptete »Warrior · Archer · Pawn« und schob Lancer und Monk hinten
   an. Damit trug der Monk das Pawn-Blatt, der Pawn das Archer-Blatt und der Archer den
   Lancer-Helm — vier von fünf Klassen falsch, und keine davon so falsch, dass es beim
   Vorbeischauen auffällt. Genau deshalb steht jetzt die Merkmalsspalte dabei: wer das ändern
   will, muss vorher hinsehen. */
const HAV=RAW+'Tiny%20Swords%20(Free%20Pack)/UI%20Elements/UI%20Elements/Human%20Avatars/';
const HAV_BASE={Blue:1,Red:6,Yellow:11,Purple:16,Black:21};
/* Die Klasse nennt ihren Platz SELBST — kein Aufrufer zählt mehr Zahlen ab. Vorher stand an
   jeder Fundstelle eine nackte Ziffer (humanAvatar(c,1)), und eine nackte Ziffer kann man
   nicht falsch finden, nur falsch haben. */
const HAV_SLOT={warrior:0,lancer:1,archer:2,monk:3,pawn:4};
const humanAvatar=(color,cls)=>HAV+'Avatars_'
  +String((HAV_BASE[color]||1)+(typeof cls==='number'?cls:(HAV_SLOT[cls]||0)))
    .padStart(2,'0')+'.png';
const e=encodeURIComponent;
const en=(dir,file)=>PEN+dir.split('/').map(e).join('/')+'/'+e(file);

// ── Spielbare Einheiten (Charakterwahl: jede Einheit, jede Farbe) ──────────────
const KNIGHT_COLORS=['Blue','Red','Yellow','Purple'];
const FREE_COLORS=['Blue','Red','Yellow','Purple','Black'];
const playable={};
for(const c of KNIGHT_COLORS){
  playable['warrior_'+c.toLowerCase()]={name:'Warrior '+c,kind:'rowsheet',cell:192,faction:'Knights',
    avatar:humanAvatar(c,'warrior'),
    sheet:P10+`Factions/Knights/Troops/Warrior/${c}/Warrior_${c}.png`};
  playable['archer_'+c.toLowerCase()]={name:'Archer '+c,kind:'rowsheet',cell:192,faction:'Knights',ranged:true,
    avatar:humanAvatar(c,'archer'),
    sheet:P10+`Factions/Knights/Troops/Archer/${c}/Archer_${c==='Purple'?'Purlple':c}.png`, // Repo-Tippfehler!
    projectile:P10+'Factions/Knights/Troops/Archer/Arrow/Arrow.png',
    shot:{speed:540}};   // ein Pfeil ist das schnellste im Spiel
  playable['pawn_'+c.toLowerCase()]={name:'Pawn '+c,kind:'rowsheet',cell:192,faction:'Knights',
    avatar:humanAvatar(c,'pawn'),
    sheet:P10+`Factions/Knights/Troops/Pawn/${c}/Pawn_${c}.png`};
}
// Free Pack (eine Datei je Animation, 5 Farben inkl. Black) — für Schwarz-Varianten
for(const c of FREE_COLORS){
  playable['warrior_free_'+c.toLowerCase()]={name:'Warrior '+c+' (Free)',kind:'strips',faction:'Knights',
    /* Dieselbe Figur wie oben, nur aus dem Free Pack — also auch dasselbe Porträt. Dass hier
       bis 9.8. keins stand, lag am fehlenden Schwarz-Block: HAV_BASE kannte nur vier Farben,
       und ein Aufrufer, dem eine Farbe fehlt, faellt still auf Blau zurueck. Jetzt ist
       Black:21 eingetragen, und die Schwarz-Ritter tragen ihr eigenes Blatt. */
    avatar:humanAvatar(c,'warrior'),
    anims:{idle:PFREE+`Units/${c}%20Units/Warrior/Warrior_Idle.png`,
           run:PFREE+`Units/${c}%20Units/Warrior/Warrior_Run.png`,
           attack:PFREE+`Units/${c}%20Units/Warrior/Warrior_Attack1.png`,
           attack2:PFREE+`Units/${c}%20Units/Warrior/Warrior_Attack2.png`,
           guard:PFREE+`Units/${c}%20Units/Warrior/Warrior_Guard.png`}};
}

// ── Gegner (Enemy Pack, gekauft 2026-08-06) ────────────────────────────────────
// role: melee | ranged | boss | critter · biome: Vorschlag für Zonen-/Dungeon-Zuordnung
/* `projectile` ist das Blatt des Geschosses, `shot` seine ABSICHT (v11-U2): `speed` in px/s und
   `arc` als Wurfhöhe in Weltpixeln. Alles übrige misst shots.js am Blatt selbst (Bilderzahl,
   Ausrichtung) — nur was man nicht sehen kann, steht hier: dass eine Bombe GEWORFEN und ein Pfeil
   GESCHOSSEN wird. Ohne `shot` gilt flach mit 440 px/s. */
const enemies={
  torch_goblin_ep:{name:'Torch Goblin',role:'melee',biome:'camp',avatar:PAV+e('Torch Goblin.png'),
    anims:{idle:en('Goblin Raiders/Torch Goblin','Torch Goblin_Idle.png'),
           run:en('Goblin Raiders/Torch Goblin','Torch Goblin_Run.png'),
           attack:en('Goblin Raiders/Torch Goblin','Torch Goblin_Attack.png')}},
  spear_goblin:{name:'Spear Goblin',role:'melee',biome:'camp',avatar:PAV+e('Spear Goblin.png'),
    anims:{idle:en('Goblin Raiders/Spear Goblin','Spear Goblin_Idle.png'),
           run:en('Goblin Raiders/Spear Goblin','Spear Goblin_Run.png'),
           attack:en('Goblin Raiders/Spear Goblin','Spear Goblin_Attack Fast.png'),
           attack2:en('Goblin Raiders/Spear Goblin','Spear Goblin_Attack Strong.png')}},
  hex_shaman:{name:'Hex Shaman',role:'ranged',biome:'camp',avatar:PAV+e('Hex Shaman.png'),
    anims:{idle:en('Goblin Raiders/Hex Shaman','Hex Shaman_Idle.png'),
           run:en('Goblin Raiders/Hex Shaman','Hex Shaman_Run.png'),
           attack:en('Goblin Raiders/Hex Shaman','Hex Shaman_Attack.png'),
           cast:en('Goblin Raiders/Hex Shaman','Hex Shaman_Explosion Spell.png')},
    projectile:en('Goblin Raiders/Hex Shaman','Hex Shaman_Projectile.png'),
    fx:{explosion:en('Goblin Raiders/Hex Shaman','Hex Shaman_Explosion.png')}},
  pig_rider:{name:'Pig Rider',role:'melee',biome:'camp',
    anims:{idle:en('Goblin Raiders/Pig Rider Spear Goblin','Pig Rider_Idle.png'),
           run:en('Goblin Raiders/Pig Rider Spear Goblin','Pig Rider_Run.png'),
           attack:en('Goblin Raiders/Pig Rider Spear Goblin','Pig Rider_Attack.png')}},
  pig:{name:'Pig',role:'critter',biome:'camp',
    anims:{idle:en('Goblin Raiders/Pig','Pig_Idle.png'),run:en('Goblin Raiders/Pig','Pig_Run.png')}},
  bear:{name:'Bear',role:'melee',biome:'cave',avatar:PAV+e('Enemy Avatars_14.png'),
    anims:{idle:en('Caveborn/Bear','Bear_Idle.png'),run:en('Caveborn/Bear','Bear_Run.png'),
           attack:en('Caveborn/Bear','Bear_Attack.png')}},
  lizard:{name:'Lizard',role:'melee',biome:'cave',avatar:PAV+e('Enemy Avatars_13.png'),
    anims:{idle:en('Caveborn/Lizard','Lizard_Idle.png'),run:en('Caveborn/Lizard','Lizard_Run.png'),
           attack:en('Caveborn/Lizard','Lizard_Attack.png'),hit:en('Caveborn/Lizard','Lizard_Hit.png')}},
  snake:{name:'Snake',role:'melee',biome:'cave',avatar:PAV+e('Enemy Avatars_07.png'),
    anims:{idle:en('Caveborn/Snake','Snake_Idle.png'),run:en('Caveborn/Snake','Snake_Run.png'),
           attack:en('Caveborn/Snake','Snake_Attack.png')}},
  spider:{name:'Spider',role:'melee',biome:'cave',avatar:PAV+e('Enemy Avatars_11.png'),
    anims:{idle:en('Caveborn/Spider','Spider_Idle.png'),run:en('Caveborn/Spider','Spider_Run.png'),
           attack:en('Caveborn/Spider','Spider_Attack.png')}},
  turtle:{name:'Turtle',role:'melee',biome:'cave',avatar:PAV+e('Enemy Avatars_08.png'),
    anims:{idle:en('Caveborn/Turtle','Turtle_Idle.png'),run:en('Caveborn/Turtle','Turtle_Walk.png'),
           attack:en('Caveborn/Turtle','Turtle_Attack.png'),
           guardIn:en('Caveborn/Turtle','Turtle_Guard_In.png'),guardOut:en('Caveborn/Turtle','Turtle_Guard_Out.png')}},
  gnoll:{name:'Gnoll',role:'ranged',biome:'wilds',avatar:PAV+e('Enemy Avatars_10.png'),
    anims:{idle:en('Gnoll','Gnoll_Idle.png'),run:en('Gnoll','Gnoll_Walk.png'),
           attack:en('Gnoll','Gnoll_Throw.png'),hit:en('Gnoll','Gnoll_Hit.png')},
    projectile:en('Gnoll','Gnoll_Bone.png'),shot:{speed:340,arc:30}},   // ein Knochen fliegt im Bogen
  gnome:{name:'Gnome',role:'melee',biome:'wilds',avatar:PAV+e('Enemy Avatars_15.png'),
    anims:{idle:en('Gnome','Gnome_Idle.png'),run:en('Gnome','Gnome_Run.png'),
           attack:en('Gnome','Gnome_Attack.png')}},
  panda:{name:'Panda',role:'melee',biome:'wilds',avatar:PAV+e('Enemy Avatars_12.png'),
    anims:{idle:en('Panda','Panda_Idle.png'),run:en('Panda','Panda_Run.png'),
           attack:en('Panda','Panda_Attack.png'),guard:en('Panda','Panda_Guard.png')}},
  skull:{name:'Skull',role:'melee',biome:'dungeon',avatar:PAV+e('Enemy Avatars_01.png'),
    anims:{idle:en('Skull','Skull_Idle.png'),run:en('Skull','Skull_Run.png'),
           attack:en('Skull','Skull_Attack.png'),guard:en('Skull','Skull_Guard.png')}},
  thief:{name:'Thief',role:'melee',biome:'dungeon',avatar:PAV+e('Enemy Avatars_06.png'),
    anims:{idle:en('Thief','Thief_Idle.png'),run:en('Thief','Thief_Run.png'),
           attack:en('Thief','Thief_Attack.png')}},
  bomb_fish:{name:'Bomb Fish',role:'ranged',biome:'water',avatar:PAV+e('Bomb Fish.png'),
    anims:{idle:en('Pirate Fish/Bomb Fish','Bomb Fish_Idle.png'),run:en('Pirate Fish/Bomb Fish','Bomb Fish_Run.png'),
           attack:en('Pirate Fish/Bomb Fish','Bomb Fish_Shoot.png')},
    projectile:en('Pirate Fish/Bomb','Bomb_Spinning.png'),shot:{speed:300,arc:44}},   // Wurf, kein Schuss
  harpoon_shark:{name:'Harpoon Shark',role:'ranged',biome:'water',avatar:PAV+e('Harpoon Shark.png'),
    anims:{idle:en('Pirate Fish/Harpoon Shark','Harpoon Shark_Idle.png'),
           run:en('Pirate Fish/Harpoon Shark','Harpoon Shark_Run.png'),
           attack:en('Pirate Fish/Harpoon Shark','Harpoon Shark_Throw.png')},
    projectile:en('Pirate Fish/Harpoon Shark','Harpoon.png'),shot:{speed:480}},
  paddle_shark:{name:'Paddle Shark',role:'melee',biome:'water',avatar:PAV+e('Paddle Shark.png'),
    anims:{idle:en('Pirate Fish/Paddle Shark','Paddle Shark_Idle.png'),
           run:en('Pirate Fish/Paddle Shark','Paddle Shark_Run.png'),
           attack:en('Pirate Fish/Paddle Shark','Paddle Shark_Attack.png'),
           row:en('Pirate Fish/Paddle Shark','Paddle Shark_Row.png')}},
  minotaur:{name:'Minotaur',role:'boss',biome:'dungeon',avatar:PAV+e('Enemy Avatars_09.png'),
    anims:{idle:en('Minotaur','Minotaur_Idle.png'),run:en('Minotaur','Minotaur_Walk.png'),
           attack:en('Minotaur','Minotaur_Attack.png'),guard:en('Minotaur','Minotaur_Guard.png')}},
  troll:{name:'Troll',role:'boss',biome:'wilds',avatar:PAV+e('Enemy Avatars_16.png'),
    anims:{idle:en('Troll','Troll_Idle.png'),run:en('Troll','Troll_Walk.png'),
           windup:en('Troll','Troll_Windup.png'),attack:en('Troll','Troll_Attack.png'),
           recovery:en('Troll','Troll_Recovery.png'),dead:en('Troll','Troll_Dead.png')},
    parts:{club1:en('Troll','Troll_ClubPart1.png'),club2:en('Troll','Troll_ClubPart2.png')}},
};

// Uncle FrizzleBob — eigenes Sheet (Gemini, 2026-08-06), Vertrag liegt im Repo daneben.
// 192er-Zellen, Zeilen: 0 idle · 1 walk · 2 attack_wind · 3 attack_hit · 4 attack_recover.
// Der Angriff nimmt vorerst die Trefferzeile; die Kette wind→hit→recover ist ein eigener Slice.
playable.frizzlebob={name:'Uncle FrizzleBob',kind:'rowsheet',cell:192,faction:'KFB',
  sheet:RAW+'KFB_Custom/FrizzleBob_SpriteSheet_192.png',
  framesPerRow:[7,6,6,6,6],
  /* Gemessen am Blatt (2026-08-07): die Laufzeile zeigt nach **rechts** wie jedes Tiny-Swords-Blatt.
     Vorher stand hier `faceLeft:true` — geraten, und der Hase lief seither immer verkehrt. */
  // Zeile 0 ist eine DREHUNG (Front → Rücken → Seite), keine Ruhe: nur die Seitenansicht nehmen,
  // sonst dreht sich der Held ohne Eingabe im Kreis. [Zeile, Startspalte, Anzahl]
  // **Vorn** ist Spalte 0 der Drehung (Georg, 2026-08-06): FrizzleBob sieht den Spieler an, wenn er
  // ruht. Eine Fackel-Animation von vorn gibt es im Blatt nicht — die Drehung hat je Ansicht **ein**
  // Feld; ein flackerndes Front-Idle wäre also erfunden, nicht geladen.
  rows:{idle:[0,0,1],run:1,attack:[3,3]}};

// ── Kreaturen: die Welt als Spielzeug (V4-S2) ─────────────────────────────────
// Friedlich, aber nicht unantastbar. Wer sie erschlägt, bekommt keine Erfahrung,
// sondern einen Ruf — das ist der Spielmodus, den sich der Spieler selbst ausdenkt.
const critters={
  sheep:{name:'Sheep',role:'critter',sizeRel:0.34,peaceful:true,hp:12,
    anims:{idle:P10+'Resources/Sheep/HappySheep_Idle.png',
           run:P10+'Resources/Sheep/HappySheep_Bouncing.png'}},
};

// ── Requisiten / Bauten aus dem Enemy Pack (Zonen-Deko, Dungeon, Wasser) ───────
const props={
  cave:{name:'Cave',biome:'cave',url:en('Caveborn/Cave','Cave_Idle.png'),animated:true},
  goblin_hut:{name:'Goblin Hut',biome:'camp',url:en('Goblin Raiders/Goblin Hut','Goblin Hut.png')},
  wooden_fence:{name:'Wooden Fence (64er-Tile)',biome:'camp',url:en('Goblin Raiders/Wooden Fence','Wooden Fence_64x64 tile.png'),tile:64},
  fish_hut:{name:'Fish Hut',biome:'water',url:en('Pirate Fish/Fish Hut','Fish Hut.png')},
  pirate_tower_ground:{name:'Pirate Tower (Land)',biome:'water',url:en('Pirate Fish/Pirate Tower','Pirate Tower_Ground.png')},
  pirate_tower_water:{name:'Pirate Tower (Wasser)',biome:'water',url:en('Pirate Fish/Pirate Tower','Pirate Tower_Water.png')},
  boat:{name:'Boat',biome:'water',url:en('Pirate Fish/Boat','Boat_Idle.png'),animated:true},
  seahorse_boat:{name:'Seahorse Boat',biome:'water',url:en('Pirate Fish/Seahorse Boat','Seahorse Boat_Idle.png'),animated:true},
  dead_tree:{name:'Dead Tree',biome:'wilds',url:en('Root Troll','Dead Tree.png')},
  bones:[en('Root Troll','Bones_01.png'),en('Root Troll','Bones_02.png'),en('Root Troll','Bones_03.png')],
  skull_spikes:[en('Root Troll','Skull Spike_01.png'),en('Root Troll','Skull Spike_02.png')],
  cannon:{name:'Cannon (5 Richtungen)',biome:'water',urls:{
    right:en('Pirate Fish/Cannon','Cannon_Right.png'),up:en('Pirate Fish/Cannon','Cannon_Up.png'),
    down:en('Pirate Fish/Cannon','Cannon_Down.png'),upRight:en('Pirate Fish/Cannon','Cannon_UpRight.png'),
    downRight:en('Pirate Fish/Cannon','Cannon_DownRight.png'),ball:en('Pirate Fish/Cannon','Cannon_Ball.png')}},
};

// Körperhöhe RELATIV zum Helden (V2-S1). Die eine Stelle, an der Gegnergrößen entschieden werden —
// nicht die Pixelgröße der PNGs. Ohne Eintrag gilt die Vorgabe nach Rolle im unit-loader.
const SIZE_REL={pig:0.72,pig_rider:1.18,spear_goblin:0.95,torch_goblin_ep:0.92,hex_shaman:0.95,
  bear:1.22,lizard:0.9,snake:0.8,spider:0.78,turtle:0.86,
  gnoll:1,gnome:0.78,panda:1.12,skull:0.95,thief:0.95,
  bomb_fish:0.85,harpoon_shark:1,paddle_shark:1.05,minotaur:1.75,troll:1.95};
for(const k in SIZE_REL)if(enemies[k])enemies[k].sizeRel=SIZE_REL[k];
for(const k in enemies)enemies[k].id=k;

// ── Nummerierte Gegner-Avatare: ALLE ZWÖLF am Bild geklärt (2026-08-09) ────────────
// Beleg: scraps/gegner-avatare.png (alle zwölf Blätter) und scraps/gegner-zuordnung.png
// (jedes offene Blatt neben dem ersten Idle-Bild des Kandidaten, beides auf 130 px vergrößert).
//
//   01 Schädel, hohle Augen ............ skull       11 lila, acht Augen ......... spider
//   06 dunkle Kapuze, Glutaugen ........ thief       12 Strohhut, Bambusrand ..... panda
//   07 Schlangenkopf, Fänge ............ snake       13 grüne Echse, gelber Kamm .. lizard
//   08 grüner Panzer, Zacken ........... turtle      14 brauner Bär .............. bear
//   09 türkis, Hörner und Hauer ........ minotaur    15 rote Zipfelmütze, Bart ... gnome
//   10 braunes Fell, gelbes Auge ....... gnoll       16 grüner Unhold, rosa Nase .. troll
//
// KORRIGIERT: 12 hing am gnome — das Blatt zeigt aber den Strohhut des Panda. Der Gnom ist 15
// (Zipfelmütze). Ein Zahlendreher, den niemand sieht, solange man die Blätter nicht nebeneinander
// legt: beide sind klein, bunt und tragen etwas auf dem Kopf.
// NEU zugeordnet: 06 · 08 · 09 · 10 · 16 — vorher als »offen« geführt, obwohl jedes davon ein
// eindeutiges Gegenstück im Bestiarium hat. »Offen« hiess hier nur: noch nicht hingesehen.
//
// Ohne Avatarblatt bleiben genau ZWEI: pig und pig_rider. Sie behalten den Sprite-Kopf.
const avatarsUnmapped=[];   // leer: alle zwölf sind zugeordnet (siehe Tabelle oben)

/* Temperament je Gegnertyp (V4-S6, Masterplan §11). Nur Daten — die Zahlen dahinter stehen in
   mob-ai.js. Elite und Torwächter überschreiben das im Gehirn (elite/sentinel). */
const tempers={
  pig:'zombie', pig_rider:'brute', spear_goblin:'skirmisher', torch_goblin_ep:'skirmisher',
  hex_shaman:'kiter', bear:'brute', turtle:'brute', lizard:'skirmisher', snake:'kiter',
  spider:'skirmisher', gnome:'kiter', panda:'brute', thief:'skirmisher', skull:'zombie',
  gnoll:'skirmisher',
};

/* ── Wer spielbar ist: EINE Stelle (V6-S1, Georg 7.8.) ─────────────────────────
   Vorher stand die Liste dreimal — im Runner (Validierung), im HUD (Zyklus) und in den
   DC-Props. Drei Listen, die auseinanderlaufen, sobald eine Einheit dazukommt. Jetzt liest
   jeder von hier. Spielbar ist, was eine Ruheanimation hat; ein Angriff ist erwünscht, aber
   keine Bedingung — ein Schaf als Held ist Blödsinn, kein Fehler.
   Die Körpergröße bleibt die des Wesens (der Troll ist 1,95), sonst wäre die Wahl ein Kostüm.
   Bezugsgröße der Welt bleibt HERO_REF im Runner — die eine Zahl, an der das Bestiarium hängt. */
/* Monk und Lancer sind Ritterklassen wie die drei anderen — nur liegt ihr Blattwerk im Free Pack
   und ist deshalb `strips` statt `rowsheet`. Dass sie hier stehen, macht sie spielbar: `roster()`
   und damit `isHero` lesen genau diese Liste, und `heroDef` findet unter `<klasse>_<farbe>` den
   passenden Eintrag in `playable`. */
const KNIGHT_CLASSES={warrior:'Warrior',archer:'Archer',pawn:'Pawn',lancer:'Lancer',monk:'Monk'};
const GROUP_ORDER=['Knights','KFB','camp','cave','wilds','dungeon','water','critters'];

/* **Wie viele sind spielbar? DREISSIG** — gemessen 11.8. im laufenden Spiel (`roster().length`),
   nicht gezählt: 5 Ritterklassen · FrizzleBob · 3 Helden aus Einzelframes (rogue, knight, mage) ·
   20 Gegner · 1 Kreatur. Der Kopf dieser Datei nennt 31 — das ist die Zahl der Katalogeinträge aus
   dem Zusammenführen zweier Fassungen, nicht die Auswahl im Wahlblatt. Wer »31 Einheiten« aus einem
   Handover übernimmt, sucht eine Einheit, die es nicht gibt. Die Zahl steht an EINER Stelle, und
   das ist diese Funktion. */
function roster(){
  const L=[];
  const push=(id,label,group,x)=>L.push(Object.assign({id,label,group},x||{}));
  for(const k in KNIGHT_CLASSES)
    push(k,KNIGHT_CLASSES[k],'Knights',{colored:true,role:k==='archer'?'ranged':'melee',sizeRel:1,canAttack:true});
  push('frizzlebob','Uncle FrizzleBob','KFB',{role:'melee',sizeRel:1,canAttack:true});
  if(window.OW_HERO)for(const k of Object.keys(window.OW_HERO.HEROES))
    push(k,k.charAt(0).toUpperCase()+k.slice(1),'KFB',{role:'melee',sizeRel:1,canAttack:true});
  for(const k in enemies){const e=enemies[k];
    push(k,e.name,e.biome||'wilds',{role:e.role,sizeRel:e.sizeRel!=null?e.sizeRel:1,
      temper:tempers[k]||null,canAttack:!!(e.anims&&(e.anims.attack||e.anims.attack2))});}
  for(const k in critters){const c=critters[k];
    push(k,c.name,'critters',{role:'critter',sizeRel:c.sizeRel!=null?c.sizeRel:1,canAttack:false});}
  L.sort((a,b)=>GROUP_ORDER.indexOf(a.group)-GROUP_ORDER.indexOf(b.group));
  return L;
}
const isHero=id=>id==='random'||roster().some(r=>r.id===id);

/* Wer bei einer Gestaltwandlung in Frage kommt (V6-S13, Georg 7.8.): **alles außer den
   Heldenklassen** — die kennt man schon — und ohne FrizzleBob, dessen Blatt noch nicht rund
   läuft. Bleiben die Gegner und die Kreaturen: die Fraktionen, die man sonst nur bekämpft. */
const SHIFT_OUT=new Set(['warrior','archer','pawn','frizzlebob']);
function shiftPool(){
  return roster().filter(r=>!SHIFT_OUT.has(r.id)&&r.group!=='KFB').map(r=>r.id);
}

/* Katalog-Eintrag für einen Helden. Der Ladeschlüssel bekommt bei Gegnern ein ¦hero_¦ davor:
   derselbe Goblin als Mob und als Held sind ZWEI Einträge (role unterscheidet sich), und ein
   gemeinsamer Cache-Key hätte den zuerst geladenen für beide festgeschrieben. */
async function heroDef(id,color){
  const c=String(color||'Blue');
  const wrap=(key,def,extra)=>({id:key,def:Object.assign({},def,{role:'hero'},extra||{})});
  if(id==='random'){
    const pool=shiftPool();
    const pick=pool[Math.floor(Math.random()*pool.length)];
    return heroDef(pick,c);
  }
  if(KNIGHT_CLASSES[id]){
    const key=id+'_'+c.toLowerCase();
    return wrap(key,playable[key]||playable.warrior_blue,{sizeRel:1});
  }
  if(window.OW_HERO&&window.OW_HERO.HEROES[id])
    return wrap(id,await window.OW_HERO.def(id),{sizeRel:1});
  if(playable[id])return wrap(id,playable[id],{sizeRel:1});
  const src=enemies[id]||critters[id];
  if(src)return wrap('hero_'+id,src,{sizeRel:src.sizeRel!=null?src.sizeRel:1});
  return wrap('warrior_blue',playable.warrior_blue,{sizeRel:1});
}

// ── Free Pack: Lancer und Monk ────────────────────────────────────────────────
// Sie liegen NICHT in Update 010, sondern im Free Pack, und zwar als einzelne Streifen je
// Richtung (Lancer_Idle/Run + acht Angriffs-/Deckungsblätter, Monk Idle/Run/Heal). Deshalb sind
// sie `strips` wie die Gegner und nicht `rowsheet` wie die übrigen Ritter — das Blattformat
// entscheidet die Bauart, nicht die Fraktion. Angriff: beim Lancer der Rechts-Stoß, beim Monk
// die Heilung (er schlägt nicht; die Wirkung ist ein eigener Slice).
const FPU=RAW+'Tiny%20Swords%20(Free%20Pack)/Units/';
const fp=(color,dir,file)=>FPU+e(color+' Units')+'/'+e(dir)+'/'+e(file);
for(const c of KNIGHT_COLORS){
  playable['lancer_'+c.toLowerCase()]={name:'Lancer '+c,faction:'Knights',role:'melee',
    avatar:humanAvatar(c,'lancer'),
    anims:{idle:fp(c,'Lancer','Lancer_Idle.png'),run:fp(c,'Lancer','Lancer_Run.png'),
      attack:fp(c,'Lancer','Lancer_Right_Attack.png')}};
  playable['monk_'+c.toLowerCase()]={name:'Monk '+c,faction:'Knights',role:'support',
    avatar:humanAvatar(c,'monk'),
    anims:{idle:fp(c,'Monk','Idle.png'),run:fp(c,'Monk','Run.png'),
      attack:fp(c,'Monk','Heal.png')}};
}

window.OW_UNITS={playable,enemies,props,critters,tempers,avatarsUnmapped,HAV_SLOT,humanAvatar,
  roster,isHero,heroDef,shiftPool,KNIGHT_CLASSES,GROUP_ORDER,
  note:'strips: Frame-Breite per probeStrip (Fallback Bildhöhe) · rowsheet: 192er-Zellen, Zeilen per probeRows'};
})();
