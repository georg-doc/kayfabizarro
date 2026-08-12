/* KFB Overworld — Wahlblatt (V6-S1, 2026-08-07)
   Taste C: jede Einheit, die eine Ruheanimation hat, ist ein Held. Das Blatt ist zugleich die
   Mob-Übersicht, die im Handover offenstand — Bild, Körperhöhe, Rolle, Temperament, Biom.
   Zwei Dinge, ein Blatt: wer wissen will, was es gibt, sieht es; wer es spielen will, klickt.

   Regel: die Liste wird GELESEN (OW_UNITS.roster()), nie aufgezählt. Eine zweite Liste hier
   wäre genau die Falle, wegen der dieser Slice überhaupt entstanden ist.
   Die Vorschau wird mit demselben Loader und derselben Bezugsgröße gebaut wie das Spiel —
   was hier groß aussieht, ist im Spiel groß. Kein zweiter Maßstab. */
(function(){
'use strict';

const GROUP_LABEL={Knights:'Knights',KFB:'KFB',camp:'Goblin Raiders · camp',
  cave:'Caveborn · cave',wilds:'Wilds',dungeon:'Dungeon',water:'Pirate Fish · water',
  critters:'Wildlife'};
const ROLE_LABEL={melee:'melee',ranged:'ranged',boss:'boss',critter:'critter'};

const CSS=`
.roster{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
  width:min(940px,94%);max-height:88%;background:#161f1b;border:2px solid #e8d38a;
  border-radius:8px;color:#e8e4d8;display:none;flex-direction:column;overflow:hidden;z-index:40}
.roster h4{margin:0;padding:11px 14px;font-size:11px;letter-spacing:1.6px;color:#e8d38a;
  border-bottom:1px solid #3c4a41;display:flex;justify-content:space-between;align-items:center}
.roster h4 b{font-weight:400;color:#6d7d71;letter-spacing:.6px;text-transform:none}
.roster .close{font-family:inherit;font-size:11px;background:none;color:#9aa79c;
  border:1px solid #3c4a41;border-radius:4px;padding:3px 9px;cursor:pointer}
.roster .close:hover{border-color:#e8d38a;color:#e8d38a}
.roster .scroll{overflow-y:auto;overflow-x:hidden;flex:1;min-height:0;padding:4px 14px 14px}
.roster .grp{font-size:10px;letter-spacing:1.4px;color:#6d7d71;text-transform:uppercase;
  padding:14px 0 7px;border-bottom:1px solid #2c3730;margin-bottom:10px}
.roster .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(104px,1fr));gap:9px}
.roster .u{background:#1d2723;border:1px solid #2c3730;border-radius:6px;cursor:pointer;
  display:flex;flex-direction:column;align-items:center;padding:6px 4px 7px;text-align:center}
.roster .u:hover{border-color:#e8d38a;background:#243029}
.roster .u.on{border-color:#e8d38a;background:#243029;box-shadow:inset 0 0 0 1px rgba(232,211,138,.35)}
/* Der Runner hat im selben Shadow-DOM eine generische ¦canvas{position:absolute;inset:0;
   width:100%;height:100%}¦-Regel für die Spielfläche. Ohne Gegenwehr erbt jede Kachel sie und
   liegt 850 × 454 groß über dem Blatt (gemessen, alle 30). Deshalb hier explizit zurück in den
   Fluss — eine geerbte Regel ist kein Zufall, den man wegprobiert. */
.roster .u canvas{display:block;image-rendering:pixelated;
  position:static;inset:auto;width:96px;height:108px;flex:none}
.roster .u .nm{font-size:10px;letter-spacing:.5px;color:#e8e4d8;margin-top:4px;line-height:1.25}
.roster .u .me{font-size:9px;letter-spacing:.4px;color:#6d7d71;margin-top:2px;line-height:1.3}
/* Die MESSUNG steht in eigener Zeile und in eigener Farbe: was oben steht (Rolle, Temperament),
   ist eine Zuschreibung aus dem Katalog — was hier steht, ist am Blatt gezählt. Zwei Arten von
   Auskunft, zwei Töne; sonst liest man Gemessenes als Behauptung. */
.roster .u .mx{font-size:9px;letter-spacing:.2px;color:#9fb3a2;margin-top:3px;line-height:1.35}
.roster .u .no{font-size:9px;color:#a08050;margin-top:2px}
.roster .foot{padding:9px 14px;border-top:1px solid #3c4a41;font-size:10px;color:#6d7d71;
  letter-spacing:.5px;display:flex;justify-content:space-between;gap:12px}
`;

/* Der Maßstab der Kachel: der Troll (Körper 177 px in Weltpixeln) füllt die Kachel, alles andere
   steht ehrlich daneben. Ein Warrior ist hier klein, weil er neben einem Troll klein IST — die
   Kachel ist ein Größenvergleich, kein Porträt. */
const TILE_W=96,TILE_H=108,BODY_K=0.5,BODY_MAX=TILE_H-16;

function mount(game){
  const sh=game.shadowRoot;
  if(!sh||sh.querySelector('.roster'))return;
  const st=document.createElement('style');st.textContent=CSS;sh.appendChild(st);

  const el=document.createElement('div');el.className='roster';
  el.innerHTML='<h4>PLAY AS <b>every unit with an idle is a hero</b>'
    +'<button class="close">close</button></h4><div class="scroll"></div>'
    +'<div class="foot"><span>C opens · click to play</span><span class="ms"></span><span class="st"></span></div>';
  sh.appendChild(el);
  game.rosterEl=el;

  el.querySelector('.close').onclick=()=>toggle(game,false);
  el.addEventListener('click',ev=>{
    const t=ev.target.closest&&ev.target.closest('.u');
    if(!t)return;
    const id=t.dataset.id;
    if(id===String(game.att.hero||''))return;
    el.querySelector('.st').textContent='loading '+id+'…';
    game.setAttribute('hero',id);
    setTimeout(()=>{markActive(game);el.querySelector('.st').textContent='';},900);
  });

  let built=false;
  game.toggleRoster=(on)=>{
    const open=el.style.display==='flex';
    const want=on==null?!open:!!on;
    el.style.display=want?'flex':'none';
    if(want&&!built){built=true;build(game,el);}
    if(want)markActive(game);
  };
  return el;
}
const toggle=(game,on)=>game.toggleRoster&&game.toggleRoster(on);

function markActive(game){
  const el=game.rosterEl;if(!el)return;
  const cur=String(game.att.hero||'warrior');
  for(const u of el.querySelectorAll('.u'))u.classList.toggle('on',u.dataset.id===cur);
}

function build(game,el){
  const CAT=window.OW_UNITS;
  const list=CAT.roster();
  const scroll=el.querySelector('.scroll');
  const groups=[];
  for(const r of list){
    let g=groups.find(x=>x.k===r.group);
    if(!g)groups.push(g={k:r.group,items:[]});
    g.items.push(r);
  }
  scroll.innerHTML=groups.map(g=>
    `<div class="grp">${GROUP_LABEL[g.k]||g.k} · ${g.items.length}</div><div class="grid">`
    +g.items.map(r=>{
      const meta=[ROLE_LABEL[r.role]||r.role,r.temper||''].filter(Boolean).join(' · ');
      return `<div class="u" data-id="${r.id}" title="${r.label}">`
        +`<canvas width="${TILE_W}" height="${TILE_H}"></canvas>`
        +`<div class="nm">${r.label}</div>`
        +`<div class="me">${meta}</div>`
        /* Kein »no attack« mehr aus dem Katalog-Flag: die Zeile wird beim Messen gefüllt (paint),
           und was dort steht, ist am geladenen Blatt gezählt. */
        +'<div class="mx">…</div>'
        +'</div>';
    }).join('')+'</div>').join('');
  el.querySelector('.foot .ms').textContent=list.length+' Einheiten · messe…';
  paint(game,el,list);
}

/* Vorschau UND Messung in einem Durchgang (v11-U1): der Loader lädt jedes Blatt hier ohnehin für
   die Kachel — also wird dabei auch gezählt, was drin ist. Zwei Durchgänge für ein Blatt wären
   zwei Gelegenheiten, verschiedene Zahlen zu bekommen.
   Drei gleichzeitig: dreißig Blätter auf einmal blockieren den Frame und die Kacheln erscheinen
   trotzdem nacheinander. */
async function paint(game,el,list){
  const CAT=window.OW_UNITS,OWL=window.OW_LOADER;
  if(!OWL)return;
  const cvs=el.querySelectorAll('.u canvas'),mxs=el.querySelectorAll('.u .mx');
  const z={n:0,hieb:0,rempler:0,wurf:0,portrait:0,fehlt:0};
  const zeigen=()=>{
    const f=el.querySelector('.foot .ms');
    if(f)f.textContent=z.n+' gemessen · '+z.hieb+' mit Hieb · '+z.rempler+' Rempler · '
      +z.wurf+' mit Wurf · '+z.portrait+' mit Porträt'+(z.fehlt?' · '+z.fehlt+' ohne Blatt':'');
  };
  let i=0;
  const next=async()=>{
    while(i<list.length){
      const k=i++,r=list[k],cv=cvs[k],mx=mxs[k];
      if(!cv)continue;
      try{
        const d=await CAT.heroDef(r.id,game.att.color);
        const u=await OWL.loadUnit('pv_'+d.id,d.def,{refBody:game.refBody||91});
        drawTile(cv,u);
        z.n++;
        const A=u.anims;
        const hieb=Object.keys(A).find(x=>x==='attack'||x.indexOf('attack:')===0);
        const teile=[Math.round(u.bodyH)+' px','Ruhe '+A.idle.frames];
        if(hieb){z.hieb++;teile.push('Hieb '+A[hieb].frames);}
        else{z.rempler++;teile.push('Rempler');}
        if(A.run)teile.push('Lauf '+A.run.frames);
        /* v11-U2: das Geschoss FLIEGT jetzt (shots.js) — also steht hier, wie es fliegt, und nicht
           mehr die Entschuldigung von gestern (»noch Nahkampf«). Flach oder im Bogen kommt aus
           `shot.arc` im Katalog, die Wurfweite aus derselben Zahl, mit der Held und Gegner
           stehenbleiben (`OW_SHOTS.T.standoff`) — keine zweite Zahl für dieselbe Auskunft. */
        if(d.def.projectile){z.wurf++;
          const S=window.OW_SHOTS;
          teile.push('Wurf '+((d.def.shot&&d.def.shot.arc)?'im Bogen':'flach')
            +(S?' bis '+S.T.standoff+' px':''));}
        if(d.def.avatar)z.portrait++;else teile.push('ohne Porträt');
        if(window.OW_FEEL&&OW_FEEL.bodyFactor){
          const kf=OW_FEEL.bodyFactor({unit:u});
          teile.push(Math.round(OW_FEEL.T.base*kf)+' px/s');
        }
        if(mx)mx.textContent=teile.join(' · ');
        zeigen();
      }catch(e){
        const c=cv.getContext('2d');
        c.fillStyle='#3c4a41';c.font='9px monospace';c.textAlign='center';
        c.fillText('—',TILE_W/2,TILE_H/2);
        z.fehlt++;
        if(mx)mx.textContent='Blatt fehlt';
        zeigen();
        console.warn('[roster] Vorschau fehlt:',r.id,e.message);
      }
    }
  };
  await Promise.all([next(),next(),next()]);
  zeigen();
}

function drawTile(cv,u){
  const a=u.anims.idle;if(!a)return;
  const c=cv.getContext('2d');
  c.imageSmoothingEnabled=false;
  c.clearRect(0,0,TILE_W,TILE_H);
  // Standlinie: die Kachel hat einen Boden, damit Größenunterschiede vergleichbar sind
  c.strokeStyle='rgba(232,211,138,.16)';c.beginPath();
  c.moveTo(10,TILE_H-9.5);c.lineTo(TILE_W-10,TILE_H-9.5);c.stroke();
  const bodyPx=Math.min(BODY_MAX,u.bodyH*BODY_K);   // bodyH ist die Weltkörperhöhe
  const k=bodyPx/(u.srcBodyH||1);
  const ax=a.anchorX!=null?a.anchorX:a.fw/2, ay=a.anchorY!=null?a.anchorY:a.fh;
  c.drawImage(a.img,a.sx||0,a.sy||0,a.fw,a.fh,
    TILE_W/2-ax*k, TILE_H-9-ay*k, a.fw*k, a.fh*k);
}

window.OW_ROSTER={version:'roster-v1.1',mount,
  note:'Liest OW_UNITS.roster() · Vorschau UND Messung über OW_LOADER mit derselben refBody wie das Spiel'};
})();
