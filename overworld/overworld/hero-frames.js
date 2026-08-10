/* KFB Overworld — Helden aus Einzelframes (hf-v1.0, V5-S7, Masterplan §19)
   Die drei Helden (Rogue · Knight · Mage) liegen als **Einzelframes** im Repo — 105 · 94 · 116 PNGs.
   Der Unit-Loader will Streifen. Also legt dieses Modul die Frames zur Laufzeit **einmal** zu einem
   Streifen je Animation zusammen und gibt Leinwände zurück, keine URLs.

   Drei Dinge, die dabei zählen:
   1. **Nummern werden gelesen, nicht gezählt.** Rogue ¦Idle¦ hat 17 Dateien, nummeriert 1…18 —
      ¦idle11.png¦ fehlt. Wer von der Anzahl auf die Nummern schließt, lädt eine 404 und bekommt ein
      Loch im Lauf. Die Reihenfolge kommt aus den vorhandenen Nummern, aufsteigend sortiert.
   2. **Nur laden, was gebraucht wird.** Fünf Zustände (¦idle · run · attack · hit · dead¦) statt aller
      dreizehn Ordner: 46 Anfragen statt 105. Der Rest steht im Vertrag und wartet auf seinen Ort
      (¦High_Jump¦ und ¦Climb¦ gehören in die Seitenansicht, §19.1).
   3. **Der Streifen ist ein Zwischenprodukt, kein Ziel.** §19.3 will die Blätter **im Repo**; solange
      es sie nicht gibt, ist das hier der ehrliche Weg — mit einer Zahl, die die Kosten nennt.

   Frames sind quadratisch (Rogue 128 × 128, gemessen); der Streifen ist N · 128 × 128. */
(function(){
'use strict';
/* Der Vertrag: Animation → Ordner + die Nummern, die es WIRKLICH gibt. Lücken sind vermerkt, damit
   niemand sie „korrigiert". Reihenfolge = Reihenfolge im Streifen. */
const HEROES={
  rogue:{pack:'KFB Rogue',size:128,fps:{idle:8,run:12,attack:14,hit:10,dead:9},
    /* Die Dateinamen sind NICHT einheitlich: ¦idle1.png¦ · ¦run1.png¦ · ¦hurt1.png¦ · ¦death1.png¦
       klein, aber ¦Attack1.png¦ **groß**. Geprüft, nicht angenommen — mit ¦attack1.png¦ lud der
       ganze Angriff nicht, und zwar still. Und es ist keine Regel, sondern eine Eigenschaft **dieses**
       Packs: Knight und Mage schreiben alles klein. Drei Packs, drei Namensregeln — deshalb steht
       jeder Name im Vertrag. */
    lead:{idle:'idle',run:'run',attack:'Attack',hit:'hurt',dead:'death'},
    frames:{
      idle:{dir:'Idle',n:[1,2,3,4,5,6,7,8,9,10,12,13,14,15,16,17,18]},  // 11 fehlt im Repo
      run:{dir:'Run',n:[1,2,3,4,5,6,7,8]},
      attack:{dir:'Attack',n:[1,2,3,4,5,6,7]},
      hit:{dir:'Hurt',n:[1,2,3,4]},
      dead:{dir:'Death',n:[1,2,3,4,5,6,7,8,9,10]},
    },
    // im Vertrag, aber noch ohne Ort (§19.1): Attack_Extra 11 · High_Jump 12 · Jump 7 · Climb 4 ·
    // Push 4 · Run_Attack 8 · Walk 6 · Walk_Attack 6
  },
  /* Der Knight ist der **Amplitude**-Held (§19): Wucht, `Attack_Extra`, `High_Jump`. Sein `Attack`
     ist die unangenehmste Stelle im ganzen Pack — **vier** Dateien, `attack0 · attack1 · attack2 ·
     attack4`: die Nummerierung fängt bei **0** an und **3 fehlt**. Wer hier zählt, lädt zwei 404. */
  knight:{pack:'KFB Knight',size:128,fps:{idle:7,run:10,attack:13,hit:12,dead:8},
    lead:{idle:'idle',run:'run',attack:'attack',hit:'hurt',dead:'death'},
    frames:{
      idle:{dir:'Idle',n:[1,2,3,4,5,6,7,8,9,10,11,12]},
      run:{dir:'Run',n:[1,2,3,4,5,6,7,8]},
      attack:{dir:'Attack',n:[0,1,2,4]},        // 3 fehlt im Repo
      hit:{dir:'Hurt',n:[1,2,3,4]},
      dead:{dir:'Death',n:[1,2,3,4,5,6,7,8,9,10]},
    },
    // im Vertrag, ohne Ort: Attack_Extra 8 (Wucht) · High_Jump 12 · Jump 7 · Climb 4 · Push 4 ·
    // Run_Attack 8 · Walk 6 · Walk_Attack 6
  },
  /* Der Mage ist **Resonanz** (§19): Echo statt Wucht. Er hat zwei Ordner, die kein anderer hat —
     `Fire` (9) und `Fire_Extra` (9). `Fire` ist hier der Angriff; `Attack` (Stab) bleibt im Vertrag
     für den Nahkampf. `Attack_Extra` zählt ab **0** (0…6) — schon wieder eine andere Regel. */
  mage:{pack:'KFB Mage',size:128,fps:{idle:6,run:10,attack:11,hit:12,dead:8},
    lead:{idle:'idle',run:'run',attack:'fire',hit:'hurt',dead:'death'},
    frames:{
      idle:{dir:'Idle',n:[1,2,3,4,5,6,7,8,9,10,11,12,13,14]},
      run:{dir:'Run',n:[1,2,3,4,5,6,7,8]},
      attack:{dir:'Fire',n:[1,2,3,4,5,6,7,8,9]},
      hit:{dir:'Hurt',n:[1,2,3,4]},
      dead:{dir:'Death',n:[1,2,3,4,5,6,7,8,9,10]},
    },
    // im Vertrag, ohne Ort: Fire_Extra 9 (Echo) · Attack 7 (Stab) · Attack_Extra 7 (ab 0!) ·
    // High_Jump 12 · Jump 7 · Climb 4 · Push 4 · Run_Attack 8 · Walk 6 · Walk_Attack 6
  },
};

const cache={};
function loadImg(u){
  if(window.OW_LOADER)return window.OW_LOADER.loadImg(u);
  return new Promise((ok,no)=>{const i=new Image();i.crossOrigin='anonymous';
    i.onload=()=>ok(i);i.onerror=()=>no(new Error('load failed'));i.src=u;});
}
const url=(pack,dir,file)=>(window.OW_SRC?OW_SRC.a2d(''):'')+pack+'/'+dir+'/'+file;

/* Sechs Anfragen gleichzeitig — mehr macht die Ladeleiste nicht schneller, nur die Warteschlange
   länger (dieselbe Regel wie beim Browser). */
async function pool(list,fn,width){
  const out=new Array(list.length);let i=0;
  await Promise.all(Array.from({length:Math.min(width||6,list.length)},async()=>{
    while(i<list.length){const k=i++;out[k]=await fn(list[k],k);}
  }));
  return out;
}

async function build(heroId){
  if(cache[heroId])return cache[heroId];
  const H=HEROES[heroId];
  if(!H)throw new Error('[hero-frames] unbekannter Held: '+heroId);
  const t0=performance.now();
  const anims={};let got=0,miss=0;
  for(const key in H.frames){
    const spec=H.frames[key],stem=H.lead[key]||key;
    const imgs=await pool(spec.n,async n=>{
      try{return await loadImg(url(H.pack,spec.dir,stem+n+'.png'));}
      catch(e){miss++;return null;}
    });
    const ok=imgs.filter(Boolean);
    if(!ok.length){console.warn('[hero-frames]',heroId,key,'kein Frame geladen');continue;}
    got+=ok.length;
    const S=H.size;
    const cv=document.createElement('canvas');
    cv.width=S*ok.length;cv.height=S;
    const g=cv.getContext('2d');g.imageSmoothingEnabled=false;
    ok.forEach((im,k)=>g.drawImage(im,0,0,im.width,im.height,k*S,0,S,S));
    anims[key]=cv;
  }
  const built={id:heroId,pack:H.pack,size:H.size,anims,
    frames:Object.keys(anims).reduce((o,k)=>(o[k]=anims[k].width/H.size,o),{}),
    requests:got+miss,ms:Math.round(performance.now()-t0)};
  console.log('[hero-frames]',heroId,'·',Object.keys(anims).map(k=>k+':'+built.frames[k]).join(' '),
    '·',built.requests,'Anfragen'+(miss?' ('+miss+' fehlgeschlagen)':''),'·',built.ms+'ms');
  cache[heroId]=built;
  return built;
}

/* Fertige Definition für den Unit-Loader: Streifen als Leinwände, FPS je Animation aus dem Vertrag. */
async function def(heroId,extra){
  const b=await build(heroId);
  const H=HEROES[heroId];
  return Object.assign({name:heroId,role:'hero',sizeRel:1,anims:b.anims,fps:H.fps,frameW:H.size,
    faceLeft:false,shadow:'ellipse'},extra||{});
}

window.OW_HERO={version:'hf-v1.0',HEROES,build,def,
  get cache(){return cache;},
  note:'Einzelframes → ein Streifen je Animation. Nummern gelesen (Rogue Idle: 11 fehlt), nicht gezählt.'};
})();
