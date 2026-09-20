/* KFB Overworld — Cartoon-Verformung 2D (V4-S8, Masterplan §17).
   Grundlage: skills/cartoon-motion_v1.md — die zwölf Prinzipien, real-time übersetzt.

   DIE EINE REGEL: verformt wird im BILD, nie in der Physik. Ort, Kollision, Gehirn und Treffer
   rechnen unverformt weiter; hier entstehen nur Zahlen für `ctx.transform`. Kein Effekt kann
   die Spiellogik verbiegen — und ein abgeschaltetes Modul ändert am Spiel nichts.

   Drei Kanäle je Einheit, alle als Feder-Dämpfer mit Überschwingen:
     sq    Squash (+ = gestaucht, − = gestreckt) · flächenerhaltend: sx = 1/sy (2D, nicht 1/√ wie 3D)
     lean  Neigung (Schrägstellung in x, an der Bewegungsrichtung)
     spin  Restdrehung um den Fußpunkt

   Sieben Anlässe (§17.2): step · land · hit · bump · stumble · cast · streak.
   Grenzen (§17.3): |Skalierung| ≤ 12 % · Drehung ≤ 6° · Dauer ≤ 0,3 s · Extrem 1–3 Frames.
   Zwei Ebenen statt Rig (§17.4): der Sprite und ein Akzent (Staub, Sternchen, Ausruf) mit 0,12 s Verzug. */
(function(){
'use strict';

const CAP={sq:0.09,lean:0.055,spin:4*Math.PI/180};   // knapp unter dem, was als Fehler gelesen wird
const SPRING={sq:{k:190,d:12},lean:{k:150,d:13},spin:{k:120,d:11}};
const STEP_DIST=34;          // ein Bob je 34 gelaufene Pixel — an der Strecke, nicht an der Uhr
const STUMBLE_EVERY=520;     // frühestens nach so vielen Pixeln wieder (Held)
const STUMBLE_CHANCE=0.16;
const MOB_STUMBLE_EVERY=1400,MOB_STUMBLE_CHANCE=0.05;  // Mobs stolpern selten — sonst ist es Klamauk

/* Anlässe: [sq, lean, spin, Akzent]. Positive sq = stauchen, negative = strecken. */
const POKES={
  step:   {sq:0.018,lean:0.012,spin:0.0,   accent:null},
  land:   {sq:0.11, lean:0,    spin:0.0,   accent:'dust'},
  hit:    {sq:0.085,lean:0.03, spin:0.22,  accent:'stars'},
  bump:   {sq:0.10, lean:0.06, spin:0.30,  accent:'dust'},
  stumble:{sq:0.04, lean:0.085,spin:0.50,  accent:'excl'},
  cast:   {sq:-0.07,lean:0,    spin:0.0,   accent:null},   // Anticipation: erst strecken
  streak: {sq:-0.10,lean:0,    spin:0.6,   accent:'stars'},
};

const clamp=(v,c)=>v<-c?-c:(v>c?c:v);
let pokes={},heroPokes={},frames=0,deformed=0,peakSq=0,peakSpin=0,enabled=true,heroRef=null;

function cm(u){
  if(!u.cm)u.cm={sq:0,vsq:0,lean:0,vlean:0,spin:0,vspin:0,
    px:u.x,py:u.y,dist:0,stepAt:0,stumbleAt:-999,acc:null,accT:0,accDelay:0,accKind:null,dirx:1};
  return u.cm;
}
/* Ein Stoß, kein Zustand: die Feder erledigt den Verlauf. `force` skaliert (1 = Vorgabe). */
function poke(u,kind,force,dirx){
  if(!enabled||!u)return;
  const p=POKES[kind];if(!p)return;
  const c=cm(u),f=force==null?1:Math.max(0,Math.min(2.2,force));
  const sgn=dirx!=null?(dirx<0?-1:1):(c.dirx||1);
  /* Stoß als Geschwindigkeit, nicht als Zustand. Die Faktoren sind so gewählt, dass ein leichter
     Treffer sichtbar KLEINER ausfällt als ein schwerer (Differenzierung statt Dauer-Anschlag). */
  c.vsq  += p.sq*f*18;
  c.vlean+= p.lean*f*20*sgn;
  c.vspin+= p.spin*f*2.4*sgn;
  if(p.accent){c.accKind=p.accent;c.accDelay=0.12;c.accT=0;}  // Akzent kommt NACH dem Körper
  pokes[kind]=(pokes[kind]||0)+1;
  if(u===heroRef)heroPokes[kind]=(heroPokes[kind]||0)+1;
}
/* Feder-Dämpfer je Kanal + Schrittzähler an der gelaufenen Strecke. */
function update(u,dt,g){
  if(!u||u.hp<=0&&u!==(g&&g.hero))return;
  const c=cm(u);
  const moved=Math.hypot(u.x-c.px,u.y-c.py);
  if(moved>0.01)c.dirx=u.face||(u.x>c.px?1:-1);
  c.px=u.x;c.py=u.y;
  if(moved>0.01){
    c.dist+=moved;
    if(c.dist-c.stepAt>STEP_DIST){
      c.stepAt=c.dist;
      poke(u,'step',1,u.face);
      const isHero=u===heroRef;
      const every=isHero?STUMBLE_EVERY:MOB_STUMBLE_EVERY,chance=isHero?STUMBLE_CHANCE:MOB_STUMBLE_CHANCE;
      // Stolpern: selten, mit Mindestabstand — Überraschung, kein Dauerzustand
      if(u.stumbles!==false&&c.dist-c.stumbleAt>every&&Math.random()<chance){
        c.stumbleAt=c.dist;poke(u,'stumble',1,u.face);
        if(g&&g.onStumble)g.onStumble(u);
      }
    }
  }
  const h=Math.min(dt,1/30);
  for(const ch of ['sq','lean','spin']){
    const s=SPRING[ch],v='v'+ch,cap=CAP[ch];
    c[v]+=(-s.k*c[ch]-s.d*c[v])*h;
    const raw=c[ch]+c[v]*h;
    c[ch]=clamp(raw,cap);
    // Am Anschlag prallt es ab, statt dort zu kleben: das Extrem hält 1–3 Frames (§17.3),
    // sonst steht die Figur eine halbe Sekunde verbogen da (in den Screenshots gesehen).
    if(raw!==c[ch]&&Math.sign(c[v])===Math.sign(raw))c[v]*=-0.25;
  }
  if(c.accKind){
    if(c.accDelay>0)c.accDelay-=h;
    else{c.accT+=h;if(c.accT>0.42){c.accKind=null;c.accT=0;}}
  }
  frames++;
  if(Math.abs(c.sq)>0.02||Math.abs(c.spin)>0.01)deformed++;
  if(Math.abs(c.sq)>peakSq)peakSq=Math.abs(c.sq);
  if(Math.abs(c.spin)>peakSpin)peakSpin=Math.abs(c.spin);
}
function updateAll(g,dt){
  if(!enabled)return;
  heroRef=g.hero||null;
  if(g.hero)update(g.hero,dt,g);
  for(const m of g.mobs)if(m.hp>0)update(m,dt,g);
}
/* Wird IM Zeichenaufruf angewandt, nach translate(u.x,u.y): der Fußpunkt ist der Ursprung,
   also bleibt die Figur am Boden, egal wie sie gestaucht wird. */
function applyTransform(ctx,u){
  if(!enabled||!u||!u.cm)return;
  const c=u.cm;
  if(Math.abs(c.sq)<0.001&&Math.abs(c.spin)<0.0005&&Math.abs(c.lean)<0.001)return;
  const sy=1-c.sq, sx=1/sy;                 // Fläche erhalten (2D)
  if(c.spin)ctx.rotate(c.spin);   // schon auf ±6° geklammert (CAP.spin)
  ctx.transform(sx,0,-c.lean,sy,0,0);        // Neigung als Scherung, Füße bleiben stehen
}
/* Der Akzent: zwei Ebenen genügen in 2D (§17.4). Gezeichnet in Weltkoordinaten. */
function drawAccent(ctx,u,bodyH){
  if(!enabled||!u||!u.cm||!u.cm.accKind||u.cm.accDelay>0)return;
  const c=u.cm,t=c.accT/0.42,a=1-t;
  ctx.save();
  if(c.accKind==='dust'){
    ctx.fillStyle='rgba(232,224,200,'+(a*0.5).toFixed(2)+')';
    for(let i=0;i<3;i++){
      const s=(i-1)*13*(1+t*1.6);
      ctx.beginPath();ctx.arc(u.x+s,u.y-3-t*7,3.4*(1-t*0.5),0,7);ctx.fill();
    }
  }else if(c.accKind==='stars'){
    ctx.strokeStyle='rgba(232,211,138,'+(a*0.9).toFixed(2)+')';ctx.lineWidth=2;
    for(let i=0;i<2;i++){
      const ang=(-0.6+i*1.2)+t*0.7,r=16+t*18;
      const sx=u.x+Math.cos(ang)*r,sy=u.y-bodyH*0.72+Math.sin(ang)*r*0.5;
      ctx.beginPath();ctx.moveTo(sx-4,sy);ctx.lineTo(sx+4,sy);
      ctx.moveTo(sx,sy-4);ctx.lineTo(sx,sy+4);ctx.stroke();
    }
  }else if(c.accKind==='excl'){
    ctx.font='bold 20px "Courier New",monospace';ctx.textAlign='center';
    ctx.fillStyle='rgba(232,211,138,'+a.toFixed(2)+')';
    ctx.fillText('!',u.x,u.y-bodyH-10-t*12);
  }
  ctx.restore();
}
function report(){
  return{frames,deformedRatio:frames?+(deformed/frames).toFixed(3):0,
    peakSquashPct:+(peakSq*100).toFixed(1),peakSpinDeg:+(peakSpin*180/Math.PI).toFixed(2),
    pokes:Object.assign({},pokes),heroPokes:Object.assign({},heroPokes),enabled};
}
function reset(){pokes={};heroPokes={};frames=0;deformed=0;peakSq=0;peakSpin=0;}
// Sonde für die Abnahme: was steht JETZT an dieser Einheit
function probe(u){const c=u&&u.cm;return c?{sq:+c.sq.toFixed(3),lean:+c.lean.toFixed(3),
  spin:+(c.spin*180/Math.PI).toFixed(2),accent:c.accKind,dist:Math.round(c.dist)}:null;}

window.OW_MOTION={poke,update,updateAll,applyTransform,drawAccent,report,reset,probe,POKES,CAP,
  get enabled(){return enabled;},set enabled(v){enabled=!!v;},
  version:'motion-v1.0'};
})();
