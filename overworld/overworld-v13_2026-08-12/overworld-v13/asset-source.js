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

window.OW_SRC={
  version:'src-v1.0',repo:REPO,ref:REF,mode,cdn:CDN,raw:RAW,
  base,media,
  a2d:p=>media('2D_Assets/'+(p||'')),   // Sprites, Sheets, UI-Teile
  /* v12-P1 · Der Runner-Ordner im Repo. Er liegt dort doppelt (`overworld/overworld/…`) — das ist
     keine Schönheit, aber es ist die kanonische Adresse, und eine zweite Wahrheit darüber wäre
     teurer als die doppelte Zeile. Alles, was früher relativ neben dem DC lag (Schrift,
     Rückseiten, Wortmarke), läuft hier durch. */
  ow:p=>base()+'overworld/overworld/'+(p||''),
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
