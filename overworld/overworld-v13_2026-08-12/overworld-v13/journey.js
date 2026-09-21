/* KFB Overworld — Journey (V2-S4)
   Save-Schema, Persistenz, Export/Import. Kanon: **die Welt wird nie gespeichert.**
   Gespeichert werden Seeds und Journey-Fakten; Terrain, Zonen und Bestiarium entstehen beim
   Laden neu aus `runSeed`. Was bleibt, sind die Karten, das Diary, der Ruf und der Held.

   Ein Save-Schema, nicht zwei (kein eigenes PageManifest — `pages[]` liegt hier drin).
   Jedes Feld hat einen Migrator-Pfad über `version`; ab dem ersten Export ist das Pflicht. */
(function(){
'use strict';
const VERSION='2.4.0';
const KEY='ow_journey';

/* Fraktionen = was es im Spiel wirklich gibt. Seit 2.2.0 alle **sechs** (Masterplan §15):
   Hof · Städter · die drei Biome · das Publikum. Ruf ist bidirektional.
   Die Liste ist die eine Wahrheit — factions.js liest sie, der Runner baut die Tabelle daraus. */
const FACTIONS=['kingCourt','townsfolk','camp','wilds','cave','audience'];

function emptySave(runSeed){
  return {
    version:VERSION,
    createdAt:new Date().toISOString(),
    runSeed,
    storyMode:'farce',
    pages:[{pageIndex:0,layoutId:'grid',pageSeed:String(runSeed)}],
    hero:{color:'Blue',lv:1,xp:0,slots:1,charges:2,unit:null,
      stats:{fluff:5,kayfabe:2,bizarro:3},unlocked:['monologue'],equipped:['monologue',null,null]},
    cards:{deckId:null,collected:[]},
    zones:{},           // zoneSeed → {cardN, cardTitle, biome, status}
    diary:[],
    reputation:FACTIONS.reduce((o,f)=>(o[f]=0,o),{}),
    infamyTags:[],
    quests:{active:[],completed:[],collapsed:[]},
    hallOfFame:[],
    afterglowMaterial:{narratorInputs:[],cardStories:{}},
  };
}

/* Migratoren: von alter Version auf VERSION. Fehlt einer, wird der Import abgelehnt —
   lieber ehrlich ablehnen als stumm halb laden. */
const MIGRATORS={
  /* 2.3.0 → 2.4.0 (v12-J1): die GEWÄHLTE EINHEIT gehört in den Spielstand. Bis hierher würfelte
     jeder Start einen Helden aus — wer sich eine Einheit ausgesucht hatte, verlor sie beim nächsten
     Laden, und mit ihr Körpermaß, Tempo und Reichweite. Alte Stände bekommen `null`: das heißt
     ausdrücklich »keine Wahl getroffen« und würfelt weiter wie bisher — eine Einheit zu erfinden,
     die der Spieler nie gewählt hat, wäre schlimmer als zu würfeln. */
  '2.3.0':s=>{
    s.hero=s.hero||{};
    if(s.hero.unit===undefined)s.hero.unit=null;
    s.version='2.4.0';
    return s;
  },
  /* 2.2.0 → 2.3.0: je Zone ein Feld `looted` (V5-S5). Eine geräumte Zone legt eine Lootbox auf den
     Boden; ohne dieses Feld wüsste ein geladener Stand nicht, ob die Kiste schon offen war — beim
     Laden stand sie entweder immer oder nie da. Alte Stände gelten als **geöffnet**: sie hatten die
     Karte bereits im Log, eine Kiste nachträglich hinzustellen wäre eine erfundene Belohnung. */
  '2.2.0':s=>{
    for(const k in (s.zones||{}))
      if(s.zones[k].status==='cleared'&&s.zones[k].looted==null)s.zones[k].looted=true;
    s.version='2.3.0';
    return s;
  },
  // 2.1.0 → 2.2.0: zwei Ruf-Schlüssel dazu (townsfolk, audience). Additiv, keine Daten verloren.
  '2.1.0':s=>{
    s.reputation=Object.assign({townsfolk:0,audience:0},s.reputation||{});
    s.version='2.2.0';
    return s;
  },
  // 2.0.0 → 2.1.0: die drei Ressourcen heißen jetzt nach der Marke (Georg, 6.8.)
  // Puste → Fluff („Stay fluffy") · Witz → Kayfabe · Schneid → Bizarro.
  '2.0.0':s=>{
    const st=(s.hero&&s.hero.stats)||{};
    s.hero.stats={fluff:st.puste!=null?st.puste:5,
      kayfabe:st.witz!=null?st.witz:2,
      bizarro:st.schneid!=null?st.schneid:3};
    s.version='2.1.0';
    return s;
  },
};

function migrate(s){
  let guard=0;
  while(s.version!==VERSION){
    const m=MIGRATORS[s.version];
    if(!m||++guard>8)return null;
    s=m(s);
  }
  return s;
}

function read(){
  try{
    const raw=localStorage.getItem(KEY);
    if(!raw)return null;
    return migrate(JSON.parse(raw));
  }catch(e){console.warn('[journey] read:',e.message);return null;}
}

function write(save){
  try{localStorage.setItem(KEY,JSON.stringify(save));return true;}
  catch(e){console.warn('[journey] write:',e.message);return false;}
}

function download(save,name){
  const blob=new Blob([JSON.stringify(save,null,2)],{type:'application/json'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=name||('kfb-journey-'+save.runSeed+'-'+Date.now()+'.json');
  document.body.appendChild(a);a.click();
  setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},400);
}

function pickFile(){
  return new Promise(res=>{
    const inp=document.createElement('input');
    inp.type='file';inp.accept='application/json,.json';
    inp.onchange=()=>{
      const f=inp.files&&inp.files[0];
      if(!f){res(null);return;}
      const fr=new FileReader();
      fr.onload=()=>{
        try{res(migrate(JSON.parse(fr.result)));}
        catch(e){console.warn('[journey] import:',e.message);res(null);}
      };
      fr.readAsText(f);
    };
    inp.click();
  });
}

window.OW_JOURNEY={VERSION,KEY,FACTIONS,emptySave,read,write,download,pickFile,migrate,
  note:'V2-S4 — Seeds + Journey-Fakten. Die Welt wird rehydriert, nie gespeichert.'};
})();
