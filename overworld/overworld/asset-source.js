/* KFB — asset-source (src-v1.0, V5-S3c)
   **Die eine Stelle, an der steht, woher der Bestand kommt.** Vorher stand die Basis-URL als
   Konstante in sechs Modulen — dieselbe Falle wie die UI-Teileliste (Falle 7, Session-Cut v4):
   eine Liste an sechs Orten ändert man fünfmal falsch.

   Zwei Kanäle, bewusst getrennt (Coworker-Addendum, Masterplan §20b):
   - **Bytes** (Sprites, Sheets, Klänge, PDFs — die VIELEN Anfragen) laufen über
     `kayfabizarro.pages.dev`: CDN, kein Kontingent, CORS sauber. Geprüft 2026-08-06:
     `pages.dev/media/2D_Assets/…png` → 200 image/png, `…/media/kfb/index.json` → 200 application/json.
   - **Listen** (Verzeichnisse, Voice-Packs — der EINE Aufruf) laufen über die GitHub-API. Dort gilt
     unangemeldet 60 Anfragen je Stunde; ein Aufruf je Sitzung, im localStorage gecacht.

   Umschalten zum Prüfen: `?src=raw` in der Adresse nimmt `raw.githubusercontent.com` statt des CDN.
   Das ist der Rückweg, wenn ein Deploy hinterherhängt — jeder Auftrag braucht einen Rückweg. */
(function(){
'use strict';
const REPO='georg-doc/kayfabizarro',REF='main';
const CDN='https://kayfabizarro.pages.dev/';
const RAW='https://raw.githubusercontent.com/'+REPO+'/'+REF+'/';

let mode='cdn';
try{
  const q=new URLSearchParams(location.search).get('src');
  if(q==='raw')mode='raw';
  else if(localStorage.getItem('ow_src')==='raw')mode='raw';
}catch(e){}

const base=()=>mode==='raw'?RAW:CDN;
const media=p=>base()+'media/'+(p||'');

/* WS1 10.8. · **`rel()` — relativ auflösen, ohne am Standalone zu zerbrechen.**
   Drei Module lösten Nachbardateien mit `new URL(pfad, location.href)` bzw. gegen die eigene
   `script.src` auf. Im **Standalone** ist beides eine `blob:`-Adresse, und `blob:` ist ein opakes
   Schema ohne Pfad: `new URL('./x','blob:https://…')` **wirft**. Folge im S25-Export: die Tusche
   des HUD kam gar nicht (unbehandelte Zurückweisung in `loadInk`), das Kartenraster fiel auf einen
   geratenen Wert zurück — im Projekt lief alles, weil `location.href` dort eine echte Seite ist.
   Der Fehler ist also nur im Auslieferungszustand sichtbar, und genau den bekommt WS0 in die Hand.
   `rel()` versucht die Nähe und fällt auf das Repo zurück, statt zu werfen. Das dritte Argument ist
   dieser Rückweg als **Repo-Pfad**: die Module liegen in `overworld/`, eine aus `./x` geratene
   Wurzeladresse wäre nur die nächste stille 404 (einmal passiert, 10.8.). Wer `rel()` ruft, sagt,
   wo die Datei im Repo liegt. */
const rel=(path,near,repoPath)=>{
  for(const b of [near,location.href]){
    if(!b||/^blob:|^data:/.test(b))continue;
    try{return new URL(path,b).href;}catch(e){}
  }
  return base()+(repoPath||String(path).replace(/^(\.\.?\/)+/,''));
};

window.OW_SRC={
  version:'src-v1.1',repo:REPO,ref:REF,mode,cdn:CDN,raw:RAW,
  base,media,rel,
  a2d:p=>media('2D_Assets/'+(p||'')),   // Sprites, Sheets, UI-Teile
  a3d:p=>media('3D_Assets/'+(p||'')),   // Klänge, Kataloge, Modelle
  kfb:p=>media('kfb/'+(p||'')),         // Decks, Kartenrücken, Regelhefte
  api:'https://api.github.com/repos/'+REPO,
  /* Kanal wechseln und die Seite neu laden — für den Fall, dass das CDN einmal schweigt. */
  use(which){try{localStorage.setItem('ow_src',which==='raw'?'raw':'cdn');}catch(e){}
    location.reload();},
  note:'Bytes über pages.dev, Listen über die GitHub-API. ?src=raw schaltet auf die Rohadresse.'
};
console.log('[asset-source]',mode,'·',base());
})();
