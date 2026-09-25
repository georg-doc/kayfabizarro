import { renderCardQuarter, CARD_POOL } from './bb-scene.js';
import { drawGate1CollageFace } from './collage-engine.js';

const cv=document.querySelector('canvas');
const ctx=cv.getContext('2d');
const report={ready:false,error:null,source:'Gate-1 drawCollageFace copied verbatim',card:null};
window.__DONOR_REPORT__=report;

try{
  const card=await renderCardQuarter(CARD_POOL[0]);
  report.card={title:card.title,cardNumber:card.cardNumber,ar:card.ar};
  drawGate1CollageFace(ctx,cv.width,cv.height,card,0,false);
  report.ready=true;
  document.documentElement.dataset.donorReady='1';
  console.info('[B2b donor-isolation] Gate-1 drawCollageFace visible',report);
}catch(e){
  report.error=String(e?.stack||e);
  document.documentElement.dataset.donorReady='0';
  console.error(e);
}
