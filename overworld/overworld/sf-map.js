/* KFB — sf-map (sf-v1.0, V7-S7)
   **Georg malt, wir lesen. Kein Kachelindex wird mehr geraten.**

   Der offene Punkt aus HOUSEKEEPING lautete: »der Dungeon Editor läuft und exportiert gültiges JSON,
   aber die Kachelindizes sind geraten und das Ergebnis ist nicht nahtlos. Vereinbarter Ausweg: der
   Editor zeigt das Blatt als Palette, Georg wählt die Kachel, das Autotiling wird aus dem Gemalten
   abgeleitet statt erfunden.«

   Sprite Fusion IST dieser Editor — im Browser, mit Autotiling, Ebenen und Kollisions-Häkchen, und
   mit einem Export, der genau das liefert, was wir brauchen. Wir bauen den Editor also nicht, wir
   lesen sein Ergebnis. Das Format (an der Doku geprüft, nicht angenommen):

     { "tileSize": 64, "mapWidth": 38, "mapHeight": 14,
       "layers": [ { "name": "Ground", "collider": true,
                     "tiles": [ {"id":"0","x":5,"y":11},
                                {"id":"1","x":6,"y":11,"attributes":{"isSpawn":true}} ] } ] }

   Zwei Punkte, an denen man hier falsch abbiegen kann:

   1. **`id` ist ein Index in das exportierte Blatt, keine Bedeutung.** Die Spaltenzahl wird aus der
      Blattbreite GEMESSEN (`sheet.width / tileSize`), nicht aus der Kartenbreite geschlossen. Wer
      hier rechnet statt zu messen, hat den Fehler des Dungeon Editors nur verschoben.
   2. **Die Ebenenreihenfolge ist die Zeichenreihenfolge, oben zuerst.** Sprite Fusion listet die
      oberste Ebene als erste (so steht sie auch im Editor). Gezeichnet wird deshalb von hinten nach
      vorne durch die Liste — ohne das liegt der Boden über den Wänden.

   Bedeutung kommt aus `attributes`, nicht aus der Kachel. Das ist dieselbe Regel wie bei den
   Requisiten: das Bild sagt, wie es aussieht, die Daten sagen, was es ist. Ein `entity`-Attribut
   wird zu einem Spawn, ein `collider`-Häkchen zu einer Wand — und wo nichts steht, behaupten wir
   nichts. */
(function(){
'use strict';

const stats={maps:0,tiles:0,layers:0,ms:0};

/* ── Der Export ist ein ZIP ──────────────────────────────────────────────────────────
   An der Doku geprüft: »A Sprite Fusion JSON `map.zip` package with: map.json, spritesheet.png«.
   Meine erste Fassung erwartete zwei lose Dateien — das hätte Georg einen Umweg über den Finder
   gekostet, den niemand braucht. Also lesen wir das ZIP selbst: die lokalen Dateiköpfe reichen, ein
   zweistelliges ZIP von zwei Dateien braucht kein Verzeichnis am Ende.
   Entpackt wird mit `DecompressionStream('deflate-raw')` — im Browser vorhanden, keine Bibliothek. */
async function unzip(blob){
  const buf=new Uint8Array(await blob.arrayBuffer());
  const dv=new DataView(buf.buffer);
  const out={};
  let p=0;
  while(p+30<=buf.length&&dv.getUint32(p,true)===0x04034b50){
    const method=dv.getUint16(p+8,true);
    let csize=dv.getUint32(p+18,true);
    const nlen=dv.getUint16(p+26,true), elen=dv.getUint16(p+28,true);
    const name=new TextDecoder().decode(buf.subarray(p+30,p+30+nlen));
    let data=p+30+nlen+elen;
    /* Größe 0 mit Bit 3 gesetzt heißt: die Größe steht ERST hinter den Daten (streaming). Dann
       bis zum nächsten Kopf suchen, statt eine Zahl zu glauben, die nicht da ist. */
    if(!csize&&(dv.getUint16(p+6,true)&0x08)){
      let q=data;
      while(q+4<=buf.length&&dv.getUint32(q,true)!==0x08074b50&&dv.getUint32(q,true)!==0x04034b50)q++;
      csize=q-data;
    }
    const raw=buf.subarray(data,data+csize);
    if(name&&!name.endsWith('/')){
      if(method===0)out[name]=new Blob([raw]);
      else if(method===8){
        if(typeof DecompressionStream!=='function')
          throw new Error('ZIP ist komprimiert, aber der Browser kann kein deflate-raw');
        const ds=new DecompressionStream('deflate-raw');
        out[name]=await new Response(new Blob([raw]).stream().pipeThrough(ds)).blob();
      }else throw new Error('unbekanntes ZIP-Verfahren '+method+' bei '+name);
    }
    p=data+csize;
    if(dv.getUint32(p,true)===0x08074b50)p+=16;   // Data descriptor überspringen
  }
  if(!Object.keys(out).length)throw new Error('kein ZIP oder leer');
  return out;
}

/* Ein abgelegtes Paket auflösen: ZIP oder zwei lose Dateien — beide Wege, weil Georg beides in der
   Hand haben kann. Rückgabe: {json, sheet:Blob}. */
async function fromFiles(files){
  const list=[...files];
  const zip=list.find(f=>/\.zip$/i.test(f.name));
  if(zip){
    const e=await unzip(zip);
    const jn=Object.keys(e).find(k=>/\.json$/i.test(k));
    const pn=Object.keys(e).find(k=>/\.(png|webp)$/i.test(k));
    if(!jn||!pn)throw new Error('im ZIP fehlt '+(jn?'das Blatt':'die map.json')+' (drin: '+Object.keys(e).join(', ')+')');
    return {json:await e[jn].text(),sheet:e[pn],names:[jn,pn]};
  }
  const jf=list.find(f=>/\.json$/i.test(f.name));
  const pf=list.find(f=>/\.(png|webp|gif)$/i.test(f.name));
  if(!jf||!pf)throw new Error('Es braucht die map.zip — oder map.json und spritesheet.png zusammen.');
  return {json:await jf.text(),sheet:pf,names:[jf.name,pf.name]};
}

function loadImg(src){
  return new Promise((res,rej)=>{
    const i=new Image();i.crossOrigin='anonymous';
    i.onload=()=>res(i);i.onerror=()=>rej(new Error('Blatt nicht ladbar: '+src));
    i.src=src;
  });
}

/* Prüfen statt vertrauen. Eine Karte, die hier durchfällt, wird nicht halb geladen — ein halber
   Zustand ist schlimmer als ein klarer Fehler (dieselbe Lehre wie »auf läuft gaten, nie auf
   existiert«). */
function validate(m){
  const err=[];
  if(!m||typeof m!=='object')return['kein Objekt'];
  if(!(m.tileSize>0))err.push('tileSize fehlt');
  if(!(m.mapWidth>0)||!(m.mapHeight>0))err.push('mapWidth/mapHeight fehlen');
  if(!Array.isArray(m.layers)||!m.layers.length)err.push('keine Ebenen');
  else m.layers.forEach((l,i)=>{
    if(!Array.isArray(l.tiles))err.push('Ebene '+i+' ('+(l.name||'?')+') hat keine tiles');
  });
  return err;
}

/* Eine Karte aus JSON + Blatt aufbauen. `sheet` ist ein Bild oder eine URL. */
async function build(json,sheet,opt){
  const t0=performance.now();
  const o=opt||{};
  const m=typeof json==='string'?JSON.parse(json):json;
  const err=validate(m);
  if(err.length)throw new Error('Sprite-Fusion-JSON unbrauchbar: '+err.join(' · '));
  const img=(sheet&&sheet.width)?sheet:await loadImg(sheet);
  const TS=m.tileSize;
  const cols=Math.floor(img.width/TS), rows=Math.floor(img.height/TS);
  if(cols<1||rows<1)throw new Error('Blatt kleiner als eine Kachel ('+img.width+'×'+img.height+' bei tileSize '+TS+')');
  const maxId=cols*rows-1;

  const layers=[],blocked=new Uint8Array(m.mapWidth*m.mapHeight);
  const objects=[];
  let tiles=0,outOfRange=0,outOfMap=0;
  /* Von hinten nach vorne: die letzte Ebene der Liste ist die unterste im Editor. */
  for(let i=m.layers.length-1;i>=0;i--){
    const L=m.layers[i];
    const list=[];
    for(const t of L.tiles){
      const id=parseInt(t.id,10);
      if(!(id>=0&&id<=maxId)){outOfRange++;continue;}
      if(t.x<0||t.y<0||t.x>=m.mapWidth||t.y>=m.mapHeight){outOfMap++;continue;}
      const e={id,x:t.x,y:t.y,sx:(id%cols)*TS,sy:Math.floor(id/cols)*TS};
      if(t.attributes)e.attr=t.attributes;
      list.push(e);tiles++;
      if(L.collider)blocked[t.y*m.mapWidth+t.x]=1;
      /* Objektebenen: Position plus Attribute, ohne Bild. Was daraus wird, entscheidet der Runner —
         dieses Modul deutet nichts. */
      if(t.attributes)objects.push({x:t.x,y:t.y,attr:t.attributes,layer:L.name||('Ebene '+i)});
    }
    layers.push({name:L.name||('Ebene '+i),collider:!!L.collider,tiles:list,index:i});
  }

  const map={tileSize:TS,w:m.mapWidth,h:m.mapHeight,sheet:img,cols,rows,maxId,
    layers,blocked,objects,
    stats:{tiles,layers:layers.length,outOfRange,outOfMap,
      colliderLayers:layers.filter(l=>l.collider).map(l=>l.name),
      blockedCells:blocked.reduce((n,v)=>n+v,0)},
    at(x,y){return this.blocked[y*this.w+x]===1;},
    /* Einmal in eine Leinwand backen — die Karte ändert sich nicht, also darf sie nicht je Frame
       aus Hunderten Einzelkacheln bestehen. */
    bake(){
      if(this._baked)return this._baked;
      const c=document.createElement('canvas');
      c.width=this.w*TS;c.height=this.h*TS;
      const x=c.getContext('2d');x.imageSmoothingEnabled=false;
      for(const L of this.layers)for(const t of L.tiles)
        x.drawImage(this.sheet,t.sx,t.sy,TS,TS,t.x*TS,t.y*TS,TS,TS);
      this._baked=c;return c;
    },
    /* Nur die berührten Kacheln zeichnen — für Karten, die größer als der Ausschnitt sind. */
    draw(ctx,view,scale){
      const s=scale||1,S=TS*s;
      const x0=Math.max(0,Math.floor(view.x/S)),x1=Math.min(this.w-1,Math.floor((view.x+view.w)/S));
      const y0=Math.max(0,Math.floor(view.y/S)),y1=Math.min(this.h-1,Math.floor((view.y+view.h)/S));
      ctx.imageSmoothingEnabled=false;
      let n=0;
      for(const L of this.layers)for(const t of L.tiles){
        if(t.x<x0||t.x>x1||t.y<y0||t.y>y1)continue;
        ctx.drawImage(this.sheet,t.sx,t.sy,TS,TS,t.x*S,t.y*S,S,S);n++;
      }
      return n;
    }
  };
  stats.maps++;stats.tiles+=tiles;stats.layers+=layers.length;
  stats.ms=+(performance.now()-t0).toFixed(1);
  console.log('[sf-map]',m.mapWidth+'×'+m.mapHeight,'Felder à',TS,'·',layers.length,'Ebenen ·',
    tiles,'Kacheln · Blatt',cols+'×'+rows,'Kacheln · Kollision',map.stats.blockedCells,'Felder',
    outOfRange?'· '+outOfRange+' Kachel-IDs außerhalb des Blattes':'',
    outOfMap?'· '+outOfMap+' Kacheln außerhalb der Karte':'');
  return map;
}

/* Aus einem Kachelblatt eine gültige Sprite-Fusion-Karte SCHREIBEN — der Rückweg. Damit lässt sich
   der Leser ohne Georgs Export prüfen (jeder Auftrag braucht einen Rückweg, §Fehlerklassen v8), und
   eine im Spiel erzeugte Welt kann in den Editor zurückwandern. */
function toJSON(map,name){
  return JSON.stringify({
    name:name||'kfb-map',tileSize:map.tileSize,mapWidth:map.w,mapHeight:map.h,
    layers:map.layers.slice().reverse().map(L=>({
      name:L.name,collider:L.collider,
      tiles:L.tiles.map(t=>t.attr?{id:String(t.id),x:t.x,y:t.y,attributes:t.attr}
                                 :{id:String(t.id),x:t.x,y:t.y})
    }))
  },null,1);
}

window.OW_SFMAP={version:'sf-v1.1',build,validate,toJSON,loadImg,unzip,fromFiles,stats,
  note:'Liest Sprite-Fusion-Exporte: Ebenen, Kollision, Attribute. Die Spaltenzahl des Blattes wird '+
       'gemessen, nie gerechnet — sonst ist der Kachelindex wieder geraten.'};
})();
