/* KFB Overworld — Relief (rel-v1.0, V8-S3)
   **Das Relief steckt nicht im Diffuse.** Am 8.8. gemessen, weil Georg sagte, die Texturen seien
   weg. Sie waren nie sichtbar:

     Ground049A (Gras)      diffuse Korn  2,57   normal Korn 18,75
     forest_ground_05       diffuse Korn  3,42   ao     Korn 23,68
     Ground071 (Sand)       diffuse Korn 16,98   ← das einzige mit Struktur im Diffuse

   Bei `a: 0.30` bleibt von 2,57 nichts übrig. Der Fehler war nicht die Deckung, sondern die Karte:
   ein Diffuse ist **Farbe**, ein Normal ist **Form**. Wer Form will, muss sie beleuchten.

   Und die zweite Lehre steht schon in `ground-paint.js`: **eine Schicht darf nur Helligkeit
   modulieren**, sonst kippt der Farbton (Georgs »giftig gelbgrün«). Also gibt dieses Modul immer
   eine **entfärbte Leinwand mit Mittelwert 128** zurück — für `overlay`/`soft-light` ist 128 das
   Nichts. Die Farbe gehört weiter dem Blatt darunter.

   Die Karte wird **je Material gemessen, nicht gewählt.** Bei Gras liegt das Relief im Normal, bei
   Waldboden in der AO — eine feste Wahl wäre wieder geraten (dieselbe Falle wie der Kachelindex im
   Dungeon Editor). Also: alle Kandidaten laden, Korn messen, die körnigste nehmen, die Wahl
   berichten. Wer nichts findet, gibt `null` zurück und der Aufrufer bleibt beim Diffuse —
   **auf »läuft« gaten, nie auf »existiert«.**

   Lichtrichtung: **von oben links**, dieselbe wie die ganze Welt (§21.2, abgelesen am gebackenen
   Tiny-Swords-Schatten). Eine Lichtquelle für alles, sonst zerfällt die Szene. */
(function(){
'use strict';
/* Einmal ist einmal — siehe `ground-paint.js`: die Helmet-Skripte laufen beim zweiten Mount erneut
   und würden hier die gemessenen Karten wegwerfen. Eine neue Version darf übernehmen, dieselbe nicht. */
if(window.OW_RELIEF&&window.OW_RELIEF.version==='rel-v1.3'){
  console.log('[relief] schon geladen — zweite Ausführung übersprungen');
  return;
}

const B=()=>window.OW_SRC?OW_SRC.a3d('Textures/'):'';
/* Die Kandidaten. **Belegt im Bestand, nicht erfunden** — und deshalb genau einer je Art.
   Bis zum 8.8. standen hier 14 Schreibweisen, seriell abgefragt. Gemessen: **4 existieren, 10 nicht**;
   ein Treffer kommt in 1–2 ms, ein Fehlschlag kostet **347–521 ms**. Kalt hat das Relief damit
   **36 Sekunden** gebraucht — und solange es nicht steht, sperrt `reliefSettled` den Kachel-Cache,
   also lief die Welt die ganze Zeit flach. Genau das Symptom, das V8-S3 beheben sollte.
   Die Zahlen im Changelog (171–535 ms) waren **warm** gemessen und unterboten den ersten Lauf um zwei
   Größenordnungen.

   Zwei Änderungen, die zusammengehören: **auf die belegten Namen kürzen** und **parallel laden**.
   Der alte Kommentar (»was nicht lädt, fällt aus — deshalb dürfen es ruhig mehrere Schreibweisen
   sein«) galt nur für paralleles Laden; seriell kostet jede ungenutzte Schreibweise eine halbe
   Sekunde. `ALT` bleibt als dokumentierte Reserve stehen und wird **nur** befragt, wenn die belegten
   Namen für ein Material nichts finden — dann auch parallel. */
const CAND=[
  {kind:'normal', suf:['_normal.jpg']},
  {kind:'ao',     suf:['_ao.jpg']},
  {kind:'rough',  suf:['_roughness.jpg']},
];
/* Reserve für Blätter, die anders benannt sind. Kostet nur, wenn oben nichts trifft. */
const ALT=[
  {kind:'normal', suf:['_nor.jpg','_normalGL.jpg','_normal.png']},
  {kind:'ao',     suf:['_ambientOcclusion.jpg','_occlusion.jpg','_ao.png']},
  {kind:'rough',  suf:['_rough.jpg']},
  {kind:'height', suf:['_height.jpg','_disp.jpg','_displacement.jpg']},
];
/* Licht aus dem Kanon: oben links, flach einfallend. Normalisiert. */
const L=(()=>{const v=[-0.62,-0.62,0.48],n=Math.hypot(...v);return v.map(c=>c/n);})();

const VER='rel-v1.3';
const cache={},probes={};
let probeMs=0, firstBuildMs=null, firstBuildT0=null;
let SAMPLE=96;                  // Kantenlänge für die Messung — klein reicht, das Korn ist lokal
/* **Unter dieser Schwelle wird nichts aufgelegt.** Am 8.8. gemessen: `clay_floor_001` hat in jeder
   Karte nur Korn 4,67, `Paper004` 7,51 — eine Reliefschicht ohne Korn ist eine graue Fläche, und
   `overlay` mit einer grauen Fläche drückt das Bild zusammen statt es zu heben (`waste` wurde
   messbar flacher: 1,90 → 1,14). Ein Material ohne Relief bekommt keines. */
let MIN_SD=8;

function load(u){return new Promise((res,rej)=>{const i=new Image();i.crossOrigin='anonymous';
  i.onload=()=>res(i);i.onerror=()=>rej(new Error(u));i.src=u;});}

/* Korn = Standardabweichung der Helligkeit auf einem heruntergerechneten Ausschnitt. Nicht der
   Kontrast des ganzen Blattes (den macht eine Vignette groß), sondern die lokale Unruhe. */
function grain(img){
  const c=document.createElement('canvas');c.width=c.height=SAMPLE;
  const x=c.getContext('2d',{willReadFrequently:true});
  x.drawImage(img,0,0,SAMPLE,SAMPLE);
  const p=x.getImageData(0,0,SAMPLE,SAMPLE).data;
  let s=0,q=0,n=0;
  for(let i=0;i<p.length;i+=4){
    const l=p[i]*0.299+p[i+1]*0.587+p[i+2]*0.114;
    s+=l;q+=l*l;n++;
  }
  const m=s/n;
  return Math.sqrt(Math.max(0,q/n-m*m));
}

/* Alle Kandidaten eines Materials **parallel** laden und messen. Ergebnis wird gemerkt, damit die
   Messung nicht je Kachel neu läuft. */
async function probe(name){
  if(probes[name])return probes[name];
  const t0=performance.now();
  const tryList=async list=>{
    /* Ein Netzzugriff je URL, alle gleichzeitig. Ein Fehlschlag ist erlaubt und liefert `null` —
       er hält niemanden auf, weil niemand auf ihn wartet. */
    const jobs=[];
    for(const c of list)for(const s of c.suf)
      jobs.push(load(B()+encodeURI(name+'/'+name+s))
        .then(img=>({kind:c.kind,suf:s,img}))
        .catch(()=>null));
    const got=(await Promise.all(jobs)).filter(Boolean);
    // je Art der erste Treffer in der Reihenfolge der Liste
    const byKind={};
    for(const c of list)for(const s of c.suf){
      if(byKind[c.kind])continue;
      const hit=got.find(g=>g.kind===c.kind&&g.suf===s);
      if(hit)byKind[c.kind]=hit;
    }
    return Object.values(byKind);
  };
  let found=await tryList(CAND);
  /* Reserve nur, wenn die belegten Namen leer ausgehen. Auf **Ergebnis** gaten, nicht auf Verdacht. */
  if(!found.length)found=await tryList(ALT);
  /* Diffuse mitmessen, damit die Wahl eine Gegenprobe hat — und damit ein Material wie Sand
     (diffuse 21,15) bei seiner eigenen Karte bleiben darf. */
  let dif=null;
  try{const i=await load(B()+encodeURI(name+'/'+name+'_diffuse.jpg'));
      dif={kind:'diffuse',suf:'_diffuse.jpg',img:i};}catch(e){}
  for(const f of found)f.sd=+grain(f.img).toFixed(2);
  if(dif)dif.sd=+grain(dif.img).toFixed(2);
  found.sort((a,b)=>b.sd-a.sd);
  const ms=+(performance.now()-t0).toFixed(1);
  probeMs+=ms;
  const r={name,maps:found.map(f=>({kind:f.kind,sd:f.sd})),
    diffuse:dif?dif.sd:null,best:found[0]||null,dif,ms};
  probes[name]=r;
  console.log('[relief]',name,'· diffuse',dif?dif.sd:'—',
    '·',found.map(f=>f.kind+' '+f.sd).join(' · ')||'keine Zusatzkarte',
    '→',r.best?r.best.kind:'nichts','·',ms+' ms');
  return r;
}

/* Normal-Map beleuchten: n·L. Ergebnis ist eine Graustufe um 128 — das ist Form, nicht Farbe.
   Die Grünachse kann invertiert sein (OpenGL gegen DirectX). Statt zu wählen: **beide rechnen und
   die Variante nehmen, deren Licht oben links heller ist** — das ist prüfbar, eine Konvention
   auswendig zu wissen ist es nicht. */
function fromNormal(img,size,gain){
  const c=document.createElement('canvas');c.width=c.height=size;
  const x=c.getContext('2d',{willReadFrequently:true});
  x.drawImage(img,0,0,size,size);
  const d=x.getImageData(0,0,size,size),p=d.data;
  const g=gain==null?1:gain;
  // erst mit +Y rechnen, Helligkeitsschwerpunkt oben links gegen unten rechts prüfen
  const shade=new Float32Array(size*size);
  let tlA=0,brA=0,tlB=0,brB=0;
  for(let j=0;j<size;j++)for(let i=0;i<size;i++){
    const o=(j*size+i)*4;
    const nx=(p[o]/127.5)-1, ny=(p[o+1]/127.5)-1, nz=(p[o+2]/127.5)-1;
    const a=nx*L[0]+ny*L[1]+nz*L[2];
    const b=nx*L[0]-ny*L[1]+nz*L[2];
    shade[j*size+i]=a;
    const near=(i<size*0.3&&j<size*0.3), far=(i>size*0.7&&j>size*0.7);
    if(near){tlA+=a;tlB+=b;} else if(far){brA+=a;brB+=b;}
  }
  const flipY=(tlB-brB)>(tlA-brA);   // die Variante mit mehr Licht oben links gewinnt
  if(flipY)for(let j=0;j<size;j++)for(let i=0;i<size;i++){
    const o=(j*size+i)*4;
    const nx=(p[o]/127.5)-1, ny=(p[o+1]/127.5)-1, nz=(p[o+2]/127.5)-1;
    shade[j*size+i]=nx*L[0]-ny*L[1]+nz*L[2];
  }
  // auf 128 zentrieren und mit gain spreizen
  let s=0;for(let i=0;i<shade.length;i++)s+=shade[i];
  const m=s/shade.length;
  for(let i=0;i<shade.length;i++){
    const v=Math.max(0,Math.min(255,128+(shade[i]-m)*127*g));
    const o=i*4;p[o]=p[o+1]=p[o+2]=v;p[o+3]=255;
  }
  x.putImageData(d,0,0);
  c._flipY=flipY;
  return c;
}

/* AO, Roughness, Height: schon Graustufen. Nur entfärben, auf 128 zentrieren, spreizen. */
function fromGray(img,size,gain){
  const c=document.createElement('canvas');c.width=c.height=size;
  const x=c.getContext('2d',{willReadFrequently:true});
  x.drawImage(img,0,0,size,size);
  const d=x.getImageData(0,0,size,size),p=d.data;
  const g=gain==null?1:gain;
  let s=0;const n=p.length/4;
  const lum=new Float32Array(n);
  for(let i=0;i<n;i++){
    const o=i*4;
    const l=p[o]*0.299+p[o+1]*0.587+p[o+2]*0.114;
    lum[i]=l;s+=l;
  }
  const m=s/n;
  for(let i=0;i<n;i++){
    const v=Math.max(0,Math.min(255,128+(lum[i]-m)*g));
    const o=i*4;p[o]=p[o+1]=p[o+2]=v;p[o+3]=255;
  }
  x.putImageData(d,0,0);
  return c;
}

/* Die eine Schnittstelle: gib mir das Relief eines Materials als Leinwand.
   `null` heißt: es gibt keine, bleib beim Diffuse. */
async function build(name,size,opt){
  const o=opt||{};
  if(firstBuildT0==null)firstBuildT0=performance.now();
  const key=name+':'+size+':'+(o.gain||1)+':'+(o.prefer||'auto');
  if(cache[key])return cache[key];
  const t0=performance.now();
  const pr=await probe(name);
  let pick=pr.best;
  if(o.prefer&&o.prefer!=='auto'){
    const want=(pr.dif&&o.prefer==='diffuse')?pr.dif:null;
    pick=want||null;
  }
  /* Gegenprobe: hat das Diffuse mehr Korn als jede Zusatzkarte, gewinnt es. Sand (16,98) soll nicht
     gegen eine glatte Normal-Map getauscht werden, nur weil eine existiert. */
  if(!pick||(pr.dif&&pr.dif.sd>=(pick.sd||0)))pick=pr.dif&&pr.dif.sd>=(pick?pick.sd:0)?pr.dif:pick;
  if(!pick){firstBuildMs=+(performance.now()-firstBuildT0).toFixed(1);return null;}
  if(pick.sd<MIN_SD){
    console.log('[relief]',name,'· beste Karte',pick.kind,pick.sd,'< Schwelle',MIN_SD,
      '→ kein Relief (eine graue Fläche macht flacher, nicht plastischer)');
    cache[key]=null;
    firstBuildMs=+(performance.now()-firstBuildT0).toFixed(1);
    return null;
  }
  const canvas=pick.kind==='normal'
    ? fromNormal(pick.img,size,o.gain)
    : fromGray(pick.img,size,o.gain);
  const out={canvas,kind:pick.kind,sd:pick.sd,diffuseSd:pr.diffuse,
    grainOut:+grain(canvas).toFixed(2),flipY:!!canvas._flipY,
    ms:+(performance.now()-t0).toFixed(1),maps:pr.maps};
  cache[key]=out;
  firstBuildMs=+(performance.now()-firstBuildT0).toFixed(1);
  console.log('[relief]',name,'→',out.kind,'· Korn',out.sd,'→ nach Aufbereitung',out.grainOut,
    out.flipY?'· Grünachse gedreht':'', '·',out.ms+' ms');
  return out;
}

function report(){
  return {version:VER,light:L.map(v=>+v.toFixed(2)),minSd:MIN_SD,
    /* **Die kalte Zahl.** Bis zum 8.8. berichtete dieses Modul nur die Dauer je Material — und die
       war nach dem ersten Lauf warm, also winzig. Wer nur die sah, hielt 36 Sekunden für 200 ms.
       `probeMs` ist die Summe der Netzsuche, `firstBuildMs` die Gesamtdauer bis zum letzten Relief. */
    probeMs:+probeMs.toFixed(1), firstBuildMs,
    urlsJeMaterial:CAND.reduce((n,c)=>n+c.suf.length,0)+1,
    probed:Object.keys(probes).length,built:Object.keys(cache).filter(k=>cache[k]).length,
    skipped:Object.keys(cache).filter(k=>!cache[k]).length,
    picks:Object.keys(cache).filter(k=>cache[k]).map(k=>({key:k,kind:cache[k].kind,sd:cache[k].sd,
      out:cache[k].grainOut,diffuse:cache[k].diffuseSd}))};
}

window.OW_RELIEF={version:VER,build,probe,report,fromNormal,fromGray,grain,L,CAND,
  get sample(){return SAMPLE;},set sample(v){SAMPLE=Math.max(32,v|0);},
  get minSd(){return MIN_SD;},set minSd(v){MIN_SD=+v||0;for(const k of Object.keys(cache))delete cache[k];},
  note:'Relief aus der Karte, die es wirklich trägt — je Material gemessen (Gras: normal 18,75, '+
       'Waldboden: ao 23,68, Sand: diffuse 16,98). Gibt immer eine entfärbte Leinwand um 128 zurück: '+
       'eine Schicht darf nur Helligkeit modulieren, sonst kippt der Farbton.'};
})();
