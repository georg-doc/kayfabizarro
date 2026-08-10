/* KFB Overworld — gutter-2d (OW_GUTTER)
   ────────────────────────────────────────────────────────────────────────────────────────────────
   **Der Graben ist ein eigener Terrain-Baustein, kein Loch in der Insel.**

   Vorgeschichte (Georg, 9.8.): »die Wassergräben sind ja auch nicht durchgehend, sondern buggy
   Artefakte« — und gemessen war es genau so. `addZone` schrieb den Grabenring als `land = 0`, also
   Ozean. Von 234 Grabenfeldern waren **92 genau ein Feld breit**. Ein Feld Wasser kann keine Küste
   sein: Sandsaum und Autotiling greifen von beiden Seiten und fressen die Linie auf. Übrig blieben
   die Ecken, wo der Ring umbiegt und 2×2 Wasser entsteht — die blauen Lappen auf dem Bildschirmfoto.
   Georgs Urteil: »die Konzeption der Konstruktion als Meer war falsch.«

   Deshalb hier die andere Konstruktion:

   · **Der Graben verlässt `land`.** Der Ring behält den Bodenwert seiner Umgebung; er ist für den
     Terrain-Maler gewöhnliches Land und löst deshalb weder Sandsaum noch Schaum noch Autotiling aus.
     Unbegehbar wird er über `blocked` — das ist die Rolle, die er im Spiel hat, und sie hat mit
     Wasser nichts zu tun.
   · **Gezeichnet wird ein STRICH, keine Kachelfläche.** Ein Ring ist ein Pfad: äußeres Rechteck,
     inneres Rechteck, `evenodd`. Ein Clip, eine Füllung, zwei Konturen — je Zone, nicht je Feld.
     Damit funktioniert er bei einem Feld Breite, was ein Kachelsystem grundsätzlich nicht kann.
   · **Die Farbe ist eine Palette, kein neues System.** `OW_SHADE.PALETTES` führt die Fluide schon
     (wasser · bubblegum · oel · saeure). Der Graben nimmt eine davon — später die des gewürfelten
     Story-Modes. Fehlt das Modul, füllt ein Verlauf aus zwei Farben; das Spiel läuft mit Farbe
     weiter statt gar nicht.
   · **Der Graben IST der Gutter der Comicseite** (Masterplan §3.2). Er hat genau ein Tor, und das
     Tor ist ein Loch im Strich — hier ausgeklipst, damit die Brücke darüber liegen kann.

   Bewegung ist NICHT drin (Georg: »sonst: kein Shader jetzt«). Vorgesehen ist sie: `draw` nimmt die
   Zeit schon an und gibt sie an `OW_SHADE` weiter, das seinen eigenen Waber hat. Was hier fehlt, ist
   der Signatur-Shader je Terrain-Typ — der kommt als eigener Slice und gehört in die Kachel, nicht
   als bildschirmgroßes Composite darüber (die 90-ms-Falle).                                        */
(function(){
'use strict';
const VERSION='gut-v1.1';
if(window.OW_GUTTER&&window.OW_GUTTER.version===VERSION){
  console.log('[gutter] schon geladen ('+VERSION+')');return;}

/* Die Bank: der Graben hat zwei Ufer, und sie sind nicht gleich. Innen (zur Karte hin) liegt die
   Kante im Schatten, außen im Licht — dieselbe Lichtlogik wie beim Zonenschatten (`cardLift`, V9):
   **eine Lichtquelle für alles.** Oben links innen = tief. */
const BANK_IN ='rgba(24,22,18,.42)';
const BANK_OUT='rgba(255,252,240,.30)';

/* Rückfall-Farben, falls `OW_SHADE` nicht läuft. Zwei Töne je Fluid — tief und flach. Auf »läuft«
   gaten, nicht auf »existiert«. */
const NOTFARBE={
  wasser:   ['#0d4a5e','#2e9ab0'],
  bubblegum:['#8a2a6a','#e86ab0'],
  oel:      ['#080a0c','#2a323c'],
  saeure:   ['#1d3a12','#5fbf28'],
};

const stats={zonen:0,ms:0,bilder:0};

/* Ein Ring als Pfad. `evenodd` macht aus zwei Rechtecken ein Band — das ist der ganze Trick, und er
   ist der Grund, warum ein Feld Breite hier trägt: gefüllt wird die Fläche zwischen zwei Konturen,
   nicht eine Reihe von Kacheln, die einander erklären müssten. */
function ringPfad(z,T,br){
  const p=new Path2D();
  const ax=(z.x-br)*T, ay=(z.y-br)*T, aw=(z.w+br*2)*T, ah=(z.h+br*2)*T;
  p.rect(ax,ay,aw,ah);
  /* **Das Loch ist die KARTE, nicht das Feldrechteck** (v10-S8, Georgs Modell: Karte · Feder ·
     Wasser · dünne Feder). Die Karte trägt 1,74, das Spielraster 1,80 — die Differenz stand vorher
     als Bodenstreifen zwischen Tusche und Wasser. Jetzt beginnt das Wasser an der Kartenkante.
     Ohne gemerktes Blatt (erstes Bild) gilt wieder das Feldrechteck. */
  const q=z._plate;
  if(q)p.rect(q.x,q.y,q.w,q.h);
  else p.rect(z.x*T,z.y*T,z.w*T,z.h*T);
  return p;
}

/* Das Tor als Loch: ein Feld, plus ein halbes Feld Luft nach außen, damit der Steg anschließt und
   die Kante nicht mitten unter der Brücke endet. */
function torLoch(z,T){
  /* v10-S3a: das Loch gehört auf das **Brückenfeld** im Graben, nicht auf das innere Torfeld.
     Bis 9.8. stand in `gate` mal das eine, mal das andere (Runner-Fehler, dort beschrieben) —
     deshalb wird hier ausdrücklich `bridgeAt` bevorzugt und `gate` bleibt der Rückweg. */
  const t=z.bridgeAt||z.gate;
  if(!t)return null;
  const p=new Path2D();
  p.rect(t.x*T-2,t.y*T-2,T+4,T+4);
  return p;
}

function draw(ctx,o){
  const zones=o.zones;if(!zones||!zones.length)return 0;
  const T=o.TILE||64, br=o.breite==null?1:o.breite, t0=performance.now();
  const fluid=o.fluid||'wasser';
  const sichtbar=z=>!(o.x1!=null&&(z.x-br>o.x1+1||z.x+z.w+br<o.x0-1||
                                   z.y-br>o.y1+1||z.y+z.h+br<o.y0-1));
  let n=0;
  for(const z of zones){
    if(!sichtbar(z))continue;
    n++;
    ctx.save();
    /* Erst das Tor ausschneiden, dann den Ring klippen: zwei Clips hintereinander schneiden sich,
       und der Graben bleibt am Tor offen, ohne dass eine zweite Zeichnung ihn zudecken muss. */
    const loch=torLoch(z,T);
    if(loch){
      ctx.beginPath();
      ctx.rect((z.x-br-1)*T,(z.y-br-1)*T,(z.w+br*2+2)*T,(z.h+br*2+2)*T);
      ctx.clip(ringPfadInvers(loch,(z.x-br-1)*T,(z.y-br-1)*T,(z.w+br*2+2)*T,(z.h+br*2+2)*T),'evenodd');
    }
    const ring=ringPfad(z,T,br);
    ctx.clip(ring,'evenodd');
    const rect={x:(z.x-br)*T,y:(z.y-br)*T,w:(z.w+br*2)*T,h:(z.h+br*2)*T};
    let gemalt=false;
    if(window.OW_SHADE&&OW_SHADE.PALETTES[fluid]){
      try{gemalt=OW_SHADE.draw(ctx,rect,fluid,o.time||0,{alpha:1});}catch(e){gemalt=false;}
    }
    if(!gemalt){
      const f=NOTFARBE[fluid]||NOTFARBE.wasser;
      const g=ctx.createLinearGradient(rect.x,rect.y,rect.x+rect.w,rect.y+rect.h);
      g.addColorStop(0,f[1]);g.addColorStop(0.55,f[0]);g.addColorStop(1,f[1]);
      ctx.fillStyle=g;ctx.fillRect(rect.x,rect.y,rect.w,rect.h);
    }
    ctx.restore();
    /* **Die Ufer, v10-S8 (Georgs Modell).** Vorher zwei helle Bänder auf beiden Grenzen. Jetzt:
       innen KEINS mehr — dort liegt seit v10-S8 die Kartenfeder bündig auf der Kante, und zwei
       Linien nebeneinander sind zwei Wahrheiten über dieselbe Kante. Außen eine **Tuschelinie in
       Küstenstärke**: dünner als die Kartenfeder (die trägt bei 64 px Feld rund 10 px, diese 4,5),
       gleiche Farbe wie der Kanon. Reihenfolge nach außen: Karte · Feder · Wasser · dünne Feder. */
    ctx.save();
    if(loch){
      ctx.beginPath();
      ctx.rect((z.x-br-1)*T,(z.y-br-1)*T,(z.w+br*2+2)*T,(z.h+br*2+2)*T);
      ctx.clip(ringPfadInvers(loch,(z.x-br-1)*T,(z.y-br-1)*T,(z.w+br*2+2)*T,(z.h+br*2+2)*T),'evenodd');
    }
    const INK=(window.OW_CARD&&window.OW_CARD.canon&&window.OW_CARD.canon.INK_COLOR)||'#1f1a14';
    ctx.lineJoin='round';ctx.lineCap='round';
    ctx.lineWidth=Math.max(2,T*0.07);
    ctx.strokeStyle=INK;
    ctx.strokeRect((z.x-br)*T,(z.y-br)*T,(z.w+br*2)*T,(z.h+br*2)*T);
    ctx.restore();
  }
  stats.zonen=n;stats.ms+=performance.now()-t0;stats.bilder++;
  return n;
}

// Ein Loch in einer Fläche: äußeres Rechteck + Loch, mit `evenodd` geklippt = alles außer dem Loch.
function ringPfadInvers(loch,x,y,w,h){
  const p=new Path2D();
  p.rect(x,y,w,h);
  p.addPath(loch);
  return p;
}

window.OW_GUTTER={version:VERSION,draw,PALETTEN:Object.keys(NOTFARBE),
  bericht(){const b=stats.bilder||1;
    return {zonen:stats.zonen,msJeBild:+(stats.ms/b).toFixed(2),bilder:stats.bilder};},
  reset(){stats.ms=0;stats.bilder=0;}};
console.log('[gutter] '+VERSION+' — Ring als Pfad, Fluid aus OW_SHADE, Tor als Loch');
})();
