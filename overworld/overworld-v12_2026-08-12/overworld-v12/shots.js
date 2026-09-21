/* KFB Overworld — Flugkörper (v11-U2, 2026-08-11)
   Fünf der dreißig Einheiten führen ein Wurfgeschoss im Katalog (Archer · Hex Shaman · Gnoll ·
   Bomb Fish · Harpoon Shark). Bis hierher lag es nur da: sie schlugen mit der WURFANIMATION zu,
   also Bogen spannen und dann Nahkampfschaden aus zwölf Pixeln Entfernung. Das ist der Slice, der
   das Blatt einlöst.

   EINE Stelle für alles, was fliegt — Held und Gegner benutzen dieselbe Bahn, dieselbe
   Trefferprüfung, dasselbe Zeichnen. Zwei Flugbahnen (eine im Runner, eine in der KI) wären zwei
   Wahrheiten über dieselbe Frage.

   ── Was hier GEMESSEN wird statt geraten ────────────────────────────────────────────────────────
   1 **Bilderzahl** im Blatt: `probeStripCached` — dasselbe Verfahren wie bei den Einheiten.
   2 **Dreht es sich oder zeigt es?** Ein Blatt mit mehreren Bildern hat eine Drehung GEMALT (Bombe,
     Knochen) — dann laufen die Bilder und die Ausrichtung bleibt. Ein Blatt mit EINEM Bild wurde in
     eine Richtung gemalt (Pfeil, Harpune) — dann wird es entlang der Flugbahn gedreht.
   3 **Wohin zeigt dieses eine Bild?** Am Alpha-Kasten des Bildes: breiter als hoch → nach rechts
     (Pfeil, Harpune); höher als breit → nach oben, also −90° Versatz. Ein geratener Versatz wäre
     bei jedem neuen Blatt wieder falsch; ein gemessener stimmt auch für das nächste.
   Der BOGEN (Wurf statt Schuss) ist keine Messung, sondern Absicht — er steht als `shot.arc` im
   Katalog, bei genau zwei Einträgen (Bombe, Knochen). Alles andere fliegt flach. */
(function(){
'use strict';

const T={
  speed:440,       // px/s — der Held läuft 205…305, ein Geschoss muss ihn klar überholen
  range:520,       // px Flugweite, dann fällt es aus (kein Geschoss über den halben Bildschirm)
  life:2.6,        // s Notbremse, falls die Weite durch Bogen/Stoß nie erreicht wird
  pad:10,          // px Kulanz auf den Körperradius: knapp daneben ist getroffen
  fps:12,          // Bilderrate der gemalten Drehung
  scale:1,         // Geschosse werden im Maßstab des SCHÜTZEN gezeichnet (unit.scale)
  /* Wie weit ein Fernkämpfer aufhört zu laufen und zu werfen anfängt. 260 px ist knapp die halbe
     Flugweite: nah genug, dass das Ziel im Bild bleibt, weit genug, dass der Unterschied zum
     Nahkampf (Reichweite 54…70) sofort zu spüren ist. Gilt für Held UND Gegner — dieselbe Zahl. */
  standoff:260,
};

/* Ein Blatt je URL, einmal geladen, einmal gemessen. */
const sheets=new Map();
function sheet(url){
  if(sheets.has(url))return sheets.get(url);
  const rec={ready:false,img:null,fw:0,fh:0,frames:1,aim:0};
  sheets.set(url,rec);
  const L=window.OW_LOADER;
  if(!L){console.warn('[shots] unit-loader fehlt — nichts fliegt');return rec;}
  L.loadImg(url).then(img=>{
    const st=L.probeStripCached(img);
    rec.img=img;rec.fw=st.fw;rec.fh=img.height;rec.frames=st.frames;
    if(st.frames<2){
      const b=L.probeBox(img,0,0,st.fw,img.height);
      // höher als breit → das Bild zeigt nach oben und muss um 90° zurückgedreht werden
      rec.aim=(b&&b.h>b.w*1.15)?-Math.PI/2:0;
      rec.spin=false;
    }else rec.spin=true;
    rec.ready=true;
    console.log('[shots]',url.split('/').pop(),rec.frames+' Bild'+(rec.frames>1?'er':''),
      rec.fw+'×'+rec.fh,rec.spin?'· gemalte Drehung':'· zeigt entlang der Bahn'
        +(rec.aim?' (Blatt zeigt nach oben, −90°)':''));
  }).catch(e=>console.warn('[shots] Blatt fehlt:',url,e.message));
  return rec;
}

/* Führt diese Einheit ein Geschoss? Gelesen am Katalog-Eintrag der GELADENEN Einheit — nicht an
   einer Liste von Namen hier. */
const armed=u=>!!(u&&u.unit&&u.unit.def&&u.unit.def.projectile);
const warm=unit=>{if(unit&&unit.def&&unit.def.projectile)sheet(unit.def.projectile);};

function list(g){if(!g.shots)g.shots=[];return g.shots;}

/* Der Abwurfpunkt: aus dem Körper, nicht aus dem Fußpunkt. Zwei Drittel Körperhöhe ist etwa die
   Hand (gemessen an Archer und Gnoll), ein Drittel Körperbreite nach vorn holt es aus dem Rumpf. */
function muzzle(s){
  const u=s.unit,mul=s.sizeMul||1;
  const bh=(u.bodyH||60)*mul,bw=(u.bodyW||30)*mul;
  return{x:s.x+(s.face||1)*bw*0.34,y:s.y-bh*0.62};
}

function fire(g,shooter,tx,ty,o){
  const u=shooter.unit;if(!u||!u.def||!u.def.projectile)return null;
  o=o||{};
  const rec=sheet(u.def.projectile);
  const cfg=u.def.shot||{};
  const m=muzzle(shooter);
  let dx=tx-m.x,dy=ty-m.y;
  const l=Math.hypot(dx,dy)||1;
  const sp=cfg.speed||T.speed;
  const s={x:m.x,y:m.y,x0:m.x,y0:m.y,
    vx:dx/l*sp,vy:dy/l*sp,
    rec,cfg,t:0,anim:0,
    /* Der Bogen ist eine ZEICHENHÖHE, keine Physik: die Bahn bleibt gerade, das Bild steigt und
       fällt darüber. Physik wäre hier drei Zahlen mehr für denselben Eindruck. */
    arc:cfg.arc||0,flight:Math.min(T.range,Math.max(60,l)),
    dmg:o.dmg||0,fromHero:!!o.fromHero,scale:(u.scale||1)*(cfg.scale||1),
    dead:false};
  list(g).push(s);
  if(g.audio)g.audio.sfx('hit',{gain:0.14,throttle:90});
  return s;
}

/* Nächstes lohnendes Ziel vor der Nase. Ohne Ziel wird trotzdem geworfen — ins Leere zu schießen
   ist eine erlaubte Handlung, kein Fehlerfall. */
function aimFrom(g,h){
  if(g.attackTarget&&g.attackTarget.hp>0)return g.attackTarget;
  let best=null,bd=T.range;
  for(const m of g.mobs){
    if(m.hp<=0||(m.critter&&!m.aggro))continue;
    const d=Math.hypot(m.x-h.x,m.y-h.y);
    if(d<bd){bd=d;best=m;}
  }
  return best;
}

/* Getroffen ist, wer im KÖRPERKASTEN steht — nicht wer nahe am Fußpunkt ist. Der Fußpunkt liegt
   unter den Füßen, ein Geschoss fliegt auf Brusthöhe: mit einem Radius um den Fuß fliegt jeder
   Pfeil über jeden Gegner hinweg (gerechnet: Brust 27 px über dem Fuß, Radius 20 → nie ein
   Treffer). Also ein Kasten: Breite aus `bodyW`, Höhe von der Sohle bis zum Scheitel. */
function hits(e,s){
  const u=e.unit,mul=e.sizeMul||1;
  const bw=Math.max(16,(u&&u.bodyW?u.bodyW:26)*mul)*0.5+T.pad;
  const bh=((u&&u.bodyH)||60)*mul;
  const y=s.y+arcZ(s);
  return Math.abs(e.x-s.x)<=bw&&y>=e.y-bh-T.pad&&y<=e.y+T.pad;
}

function step(g,dt,TILE){
  const L=list(g);if(!L.length)return;
  const h=g.hero;
  for(const s of L){
    s.t+=dt;s.anim+=dt*T.fps;
    s.x+=s.vx*dt;s.y+=s.vy*dt;
    const flown=Math.hypot(s.x-s.x0,s.y-s.y0);
    if(s.t>T.life||flown>Math.min(T.range,s.flight+40)){s.dead=true;continue;}
    /* Mauern halten, Wasser nicht: ein Geschoss FLIEGT — über den Graben, über den Teich. Geprüft
       wird deshalb nur `blocked` (Gebäude, Bäume, Fels), nicht `walk()`. */
    if(TILE&&g.blocked){
      const tx=Math.floor(s.x/TILE),ty=Math.floor(s.y/TILE);
      if(tx>=0&&ty>=0&&tx<g.W&&ty<g.H&&g.blocked[ty*g.W+tx]){s.dead=true;continue;}
    }
    if(s.fromHero){
      for(const m of g.mobs){
        if(m.hp<=0)continue;
        if(!hits(m,s))continue;
        g.damage(m,s.dmg,true);
        if(window.OW_FEEL)OW_FEEL.knock(m,s.vx,s.vy,OW_FEEL.T.knockMob*0.6);
        s.dead=true;break;
      }
    }else if(h&&h.hp>0){
      if(hits(h,s)){
        g.damage(h,s.dmg,false);
        if(window.OW_FEEL)OW_FEEL.knock(h,s.vx,s.vy,OW_FEEL.T.knockHero*0.6);
        s.dead=true;
        if(h.hp<=0)g.heroDown();
      }
    }
  }
  g.shots=L.filter(s=>!s.dead);
}

/* Die Wurfhöhe über der Bahn: eine Parabel über dem Fluganteil, Höhe `arc` in Weltpixeln. */
function arcZ(s){
  if(!s.arc)return 0;
  const p=Math.min(1,Math.hypot(s.x-s.x0,s.y-s.y0)/Math.max(1,s.flight));
  return -4*s.arc*p*(1-p);
}

function draw(g,ctx){
  const L=g.shots;if(!L||!L.length)return;
  ctx.save();
  ctx.imageSmoothingEnabled=false;
  for(const s of L){
    const r=s.rec;if(!r||!r.ready)continue;
    const fw=r.fw,fh=r.fh,sc=s.scale*T.scale;
    const fr=r.spin?Math.floor(s.anim)%r.frames:0;
    const y=s.y+arcZ(s);
    ctx.save();
    ctx.translate(s.x,y);
    if(!r.spin)ctx.rotate(Math.atan2(s.vy,s.vx)+r.aim);
    ctx.drawImage(r.img,fr*fw,0,fw,fh,-fw*sc/2,-fh*sc/2,fw*sc,fh*sc);
    ctx.restore();
  }
  ctx.restore();
}

window.OW_SHOTS={version:'shots-v1.0',T,armed,warm,fire,step,draw,aimFrom,
  note:'Eine Bahn für Held und Gegner · Bilderzahl und Ausrichtung am Blatt gemessen · Bogen aus dem Katalog'};
})();
