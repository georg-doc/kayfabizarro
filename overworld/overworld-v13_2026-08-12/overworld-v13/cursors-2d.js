/* KFB Overworld — Zeiger (cur-v1.0, V5-S5b, Masterplan §23)
   Drei Zustände, drei Bilder, aus dem Tiny-Swords-UI-Kit: **default** (gelblich, Pointers/01),
   **hint** (etwas ist erreichbar, Cursor_02), **locked** (gesperrt, Cursor_03).

   Warum ein Modul und nicht drei CSS-Zeilen: die Blätter sind 64 px, als Zeiger ist das ein
   Wandbild — CSS kann einen Cursor nicht skalieren (`cursor:url(...)` nimmt die Bildgröße, Punkt).
   Also wird jedes Bild einmal auf **40 px** heruntergezeichnet und als Data-URL gesetzt, mit
   gemessenem Griffpunkt: die Spitze liegt nicht in der Ecke, sondern dort, wo im Blatt die erste
   deckende Zeile beginnt (`probeBox`) — geraten wäre der Zeiger um ein paar Pixel versetzt. */
(function(){
'use strict';
const SRC={
  default:'Tiny Swords (Update 010)/UI/Pointers/01.png',
  hint:'Tiny Swords (Free Pack)/UI Elements/UI Elements/Cursors/Cursor_02.png',
  locked:'Tiny Swords (Free Pack)/UI Elements/UI Elements/Cursors/Cursor_03.png',
};
/* 28 → **40 px** (Georg 7.8.): der Zeiger war gegenüber den 64er-Sprites zu klein. 40 ist die
   obere Grenze, die Browser ohne Zicken als Cursor annehmen (ab ~128 fallen sie auf den
   System-Zeiger zurück). */
const SIZE=40;
const made={};let pending=null,state='default',target=null;

function loadImg(u){
  if(window.OW_LOADER)return window.OW_LOADER.loadImg(u);
  return new Promise((ok,no)=>{const i=new Image();i.crossOrigin='anonymous';
    i.onload=()=>ok(i);i.onerror=()=>no(new Error('load failed'));i.src=u;});
}

function ready(){
  if(pending)return pending;
  const S=window.OW_SRC;
  pending=Promise.all(Object.keys(SRC).map(async k=>{
    try{
      const img=await loadImg(S?S.a2d(SRC[k]):SRC[k]);
      const cv=document.createElement('canvas');cv.width=SIZE;cv.height=SIZE;
      const g=cv.getContext('2d');g.imageSmoothingEnabled=false;
      g.drawImage(img,0,0,SIZE,SIZE);
      // Griffpunkt gemessen statt geraten: die Spitze des Zeigers, nicht die Bildecke.
      // (Die Box heißt {x,y,w,h,bottom,cx} — ein geratenes `x0` machte den Griffpunkt NaN, und
      //  ein NaN im `cursor`-Wert macht die ganze Regel ungültig: der Zeiger blieb `auto`.)
      let hx=1,hy=1;
      const B=window.OW_LOADER&&window.OW_LOADER.probeBox;
      const b=B?B(img,0,0,img.width,img.height):null;
      if(b&&Number.isFinite(b.x)&&Number.isFinite(b.y)){
        hx=Math.round(b.x/img.width*SIZE);hy=Math.round(b.y/img.height*SIZE);
      }
      made[k]={url:cv.toDataURL(),hx:Math.max(0,hx)|0,hy:Math.max(0,hy)|0,src:img.width+'px'};
    }catch(e){console.warn('[cursor]',k,'fehlt:',e.message);}
  })).then(()=>{
    console.log('[cursor] cur-v1.0 ·',Object.keys(made).map(k=>
      k+' '+made[k].src+'→'+SIZE+'px @'+made[k].hx+','+made[k].hy).join(' · '));
    if(target)apply();
    return made;
  });
  return pending;
}

function css(k){
  const m=made[k]||made.default;
  return m?'url('+m.url+') '+m.hx+' '+m.hy+', auto':'auto';
}
/* Gesetzt wird am Wirtselement und mit `!important`-Priorität über die Style-Eigenschaft: die
   Szene schreibt Styles ihrer Leinwand neu, und ein geerbter Zeiger überlebt das. */
function apply(){
  if(!target)return;
  target.style.setProperty('cursor',css(state),'important');
}

/* Ein Zustand, kein Stapel: wer den Zeiger setzt, sagt was gilt — nicht was dazukommt. */
function set(k){if(k===state)return;state=made[k]?k:'default';apply();}
function attach(el){target=el;ready();apply();}

window.OW_CURSOR={version:'cur-v1.0',SIZE,ready,attach,set,css,
  get state(){return state;},get made(){return made;},
  note:'Drei Zustände (default/hint/locked), auf 40 px heruntergezeichnet, Griffpunkt gemessen.'};
})();
